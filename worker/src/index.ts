import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { validateTurnstileToken } from './turnstile';
import { RateLimiter } from './rate-limiter';
import { sanitizeHtml } from './sanitize';

type Bindings = {
    DB: D1Database;
    RESEND_API_KEY: string;
    PUBLIC_NEWSLETTER_API_URL: string;
    TURNSTILE_SECRET_KEY: string;
    ORIGIN_BASE_URL: string;
    ADMIN_API_KEY: string;
};

interface Subscriber {
    id: string;
    email: string;
    status: 'pending' | 'confirmed' | 'unsubscribed';
    created_at: number;
    confirmed_at?: number;
    unsubscribed_at?: number;
    consent_at?: number;
    consent_source?: string;
    consent_note?: string;
    added_by?: string;
}

interface Token {
    id: string;
    subscriber_id: string;
    type: 'confirm' | 'unsubscribe';
    token: string;
    expires_at: number;
    created_at: number;
}

const app = new Hono<{ Bindings: Bindings }>();

function hasValidAdminKey(requestKey: string | undefined, configuredKey: string | undefined): boolean {
    if (!requestKey || !configuredKey || requestKey.length !== configuredKey.length) {
        return false;
    }

    let isEqual = true;
    for (let i = 0; i < requestKey.length; i++) {
        if (requestKey[i] !== configuredKey[i]) isEqual = false;
    }

    return isEqual;
}

// Security Headers Middleware
app.use('*', async (c, next) => {
    await next();
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header('X-XSS-Protection', '1; mode=block');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// CORS Configuration
app.use('/*', cors({
    origin: [
        'https://www.codigoergosum.com',
        'https://codigoergosum.com',
        'http://localhost:4321'
    ],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}));

app.get('/', (c) => {
    return c.text('Newsletter API is running!');
});

app.post('/api/subscribe', async (c) => {
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';
    const db = c.env.DB;

    // Rate Limiting: 10 requests per 15 minutes
    const rateLimiter = new RateLimiter(db);
    const isAllowed = await rateLimiter.check(ip, 10, 15 * 60);

    if (!isAllowed) {
        return c.json({ error: 'Too many requests. Please try again later.' }, 429);
    }

    const body = await c.req.json();
    const { email, token } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return c.json({ error: 'Invalid email address' }, 400);
    }

    // Validate Turnstile
    if (c.env.TURNSTILE_SECRET_KEY && token) {
        const isValid = await validateTurnstileToken(token, c.env.TURNSTILE_SECRET_KEY, ip);
        if (!isValid) {
            return c.json({ error: 'Invalid captcha' }, 400);
        }
    } else if (c.env.TURNSTILE_SECRET_KEY && !token) {
        // Enforce captcha if key is set
        return c.json({ error: 'Captcha required' }, 400);
    }

    try {
        // Check if subscriber exists
        const existing = await db.prepare('SELECT * FROM subscribers WHERE email = ?').bind(email).first<Subscriber>();

        if (existing) {
            if (existing.status === 'confirmed') {
                return c.json({ message: 'Already subscribed' });
            }
            // If pending or unsubscribed, we might want to resend confirmation
            // For now, let's treat it as a new subscription request but reuse the ID
        }

        const subscriberId = existing ? existing.id : crypto.randomUUID();
        const token = crypto.randomUUID();
        const tokenId = crypto.randomUUID();
        const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour

        // Transaction to upsert subscriber and create token
        await db.batch([
            db.prepare(`
                INSERT INTO subscribers (id, email, status) VALUES (?, ?, 'pending')
                ON CONFLICT(email) DO UPDATE SET status = 'pending', unsubscribed_at = NULL
            `).bind(subscriberId, email),
            db.prepare(`
                INSERT INTO tokens (id, subscriber_id, type, token, expires_at) VALUES (?, ?, 'confirm', ?, ?)
            `).bind(tokenId, subscriberId, token, expiresAt)
        ]);

        // Send confirmation email
        const confirmUrl = `${c.env.ORIGIN_BASE_URL}/confirm?token=${token}`;

        // Mock sending email if no API key
        if (c.env.RESEND_API_KEY) {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Código Ergo Sum <newsletter@notifications.codigoergosum.com>', // Update this!
                    to: email,
                    subject: 'Confirm your subscription',
                    html: `<p>Please confirm your subscription by clicking <a href="${confirmUrl}">here</a>.</p>`
                })
            });

            if (!res.ok) {
                console.error('Failed to send email', await res.text());
                const rollbackStatements = [
                    db.prepare('DELETE FROM tokens WHERE id = ?').bind(tokenId)
                ];

                if (!existing) {
                    rollbackStatements.push(
                        db.prepare('DELETE FROM subscribers WHERE id = ?').bind(subscriberId)
                    );
                } else if (existing.status === 'unsubscribed') {
                    rollbackStatements.push(
                        db.prepare('UPDATE subscribers SET status = \'unsubscribed\', unsubscribed_at = ? WHERE id = ?')
                            .bind(existing.unsubscribed_at ?? null, subscriberId)
                    );
                }

                try {
                    await db.batch(rollbackStatements);
                } catch (rollbackError) {
                    console.error('Failed to rollback subscription after email error', rollbackError);
                    return c.json({ error: 'Internal server error' }, 500);
                }

                return c.json({ error: 'Failed to send confirmation email. Please try again later.' }, 502);
            }
        } else {
            console.log(`[MOCK EMAIL] To: ${email}, Link: ${confirmUrl}`);
        }

        return c.json({ message: 'Check your email to confirm.' });

    } catch (e) {
        console.error(e);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

app.get('/api/confirm', async (c) => {
    const token = c.req.query('token');

    if (!token) {
        return c.json({ error: 'Token is required' }, 400);
    }

    try {
        const db = c.env.DB;

        // Find token
        const tokenRecord = await db.prepare('SELECT * FROM tokens WHERE token = ? AND type = \'confirm\'').bind(token).first<Token>();

        if (!tokenRecord) {
            return c.json({ error: 'Invalid or expired token' }, 400);
        }

        if (tokenRecord.expires_at < Math.floor(Date.now() / 1000)) {
            return c.json({ error: 'Token expired' }, 400);
        }

        // Update subscriber status
        await db.batch([
            db.prepare('UPDATE subscribers SET status = \'confirmed\', confirmed_at = unixepoch() WHERE id = ?').bind(tokenRecord.subscriber_id),
            db.prepare('DELETE FROM tokens WHERE id = ?').bind(tokenRecord.id)
        ]);

        // Return JSON success, let frontend handle redirect
        return c.json({ success: true, message: 'Subscription confirmed' });

    } catch (e) {
        console.error(e);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

app.post('/api/admin/subscribers', async (c) => {
    if (!hasValidAdminKey(c.req.header('X-Admin-Key'), c.env.ADMIN_API_KEY)) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    let body: {
        email?: string;
        consentSource?: string;
        consentNote?: string;
        addedBy?: string;
        resubscribe?: boolean;
    };

    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: 'Invalid JSON body' }, 400);
    }

    const email = body.email?.trim().toLowerCase();
    const consentSource = body.consentSource?.trim();
    const consentNote = body.consentNote?.trim() || null;
    const addedBy = body.addedBy?.trim() || 'admin-api';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return c.json({ error: 'Invalid email address' }, 400);
    }

    if (!consentSource) {
        return c.json({ error: 'consentSource is required' }, 400);
    }

    if (consentSource.length > 120 || (consentNote && consentNote.length > 500) || addedBy.length > 120) {
        return c.json({ error: 'Consent metadata is too long' }, 400);
    }

    try {
        const db = c.env.DB;
        const existing = await db.prepare('SELECT * FROM subscribers WHERE email = ?').bind(email).first<Subscriber>();

        if (existing?.status === 'unsubscribed' && !body.resubscribe) {
            return c.json({
                error: 'Subscriber is unsubscribed. Set resubscribe=true only after obtaining fresh consent.'
            }, 409);
        }

        const consentAt = Math.floor(Date.now() / 1000);
        const subscriberId = existing?.id || crypto.randomUUID();

        if (existing) {
            await db.batch([
                db.prepare(`
                    UPDATE subscribers
                    SET status = 'confirmed',
                        confirmed_at = ?,
                        unsubscribed_at = NULL,
                        consent_at = ?,
                        consent_source = ?,
                        consent_note = ?,
                        added_by = ?
                    WHERE id = ?
                `).bind(consentAt, consentAt, consentSource, consentNote, addedBy, subscriberId),
                db.prepare("DELETE FROM tokens WHERE subscriber_id = ? AND type = 'confirm'").bind(subscriberId)
            ]);
        } else {
            await db.prepare(`
                INSERT INTO subscribers
                    (id, email, status, confirmed_at, consent_at, consent_source, consent_note, added_by)
                VALUES (?, ?, 'confirmed', ?, ?, ?, ?, ?)
            `).bind(
                subscriberId,
                email,
                consentAt,
                consentAt,
                consentSource,
                consentNote,
                addedBy
            ).run();
        }

        console.log(`[AUDIT] Admin subscriber ${existing ? 'updated' : 'created'}: ${email}, source=${consentSource}, addedBy=${addedBy}`);

        return c.json({
            message: existing?.status === 'confirmed'
                ? 'Subscriber already confirmed; consent metadata updated.'
                : 'Subscriber added as confirmed.',
            email,
            status: 'confirmed'
        }, existing?.status === 'confirmed' ? 200 : 201);
    } catch (e) {
        console.error(e);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

app.post('/api/unsubscribe', async (c) => {
    const body = await c.req.json();
    const { email, token } = body;
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';

    try {
        const db = c.env.DB;

        if (token) {
            // Token-based unsubscribe
            const tokenRecord = await db.prepare(
                'SELECT * FROM tokens WHERE token = ? AND type = \'unsubscribe\' AND expires_at >= unixepoch()'
            ).bind(token).first<Token>();

            if (!tokenRecord) {
                return c.json({ error: 'Invalid or expired token' }, 400);
            }

            await db.batch([
                db.prepare('UPDATE subscribers SET status = \'unsubscribed\', unsubscribed_at = unixepoch() WHERE id = ?').bind(tokenRecord.subscriber_id),
                db.prepare('DELETE FROM tokens WHERE id = ?').bind(tokenRecord.id)
            ]);

            return c.json({ message: 'Unsubscribed successfully' });
        } else if (email) {
            // Rate Limiting: 5 email-based unsubscribe requests per 15 minutes per IP
            const rateLimiter = new RateLimiter(db);
            const isAllowed = await rateLimiter.check(`unsubscribe:${ip}`, 5, 15 * 60);

            if (!isAllowed) {
                return c.json({ error: 'Too many requests. Please try again later.' }, 429);
            }

            // Email-based unsubscribe request
            const subscriber = await db.prepare('SELECT * FROM subscribers WHERE email = ?').bind(email).first<Subscriber>();

            if (subscriber) {
                const token = crypto.randomUUID();
                const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours

                await db.prepare('INSERT INTO tokens (id, subscriber_id, type, token, expires_at) VALUES (?, ?, \'unsubscribe\', ?, ?)').bind(crypto.randomUUID(), subscriber.id, token, expiresAt).run();

                const unsubscribeUrl = `${c.env.ORIGIN_BASE_URL}/unsubscribe?token=${token}`;

                // Mock sending email
                if (c.env.RESEND_API_KEY) {
                    await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from: 'Código Ergo Sum <newsletter@notifications.codigoergosum.com>',
                            to: email,
                            subject: 'Unsubscribe from newsletter',
                            html: `<p>Click <a href="${unsubscribeUrl}">here</a> to unsubscribe.</p>`
                        })
                    });
                } else {
                    console.log(`[MOCK EMAIL] Unsubscribe To: ${email}, Link: ${unsubscribeUrl}`);
                }
            }

            // Always return success to prevent email enumeration
            return c.json({ message: 'If the email exists, an unsubscribe link has been sent.' });
        }

        return c.json({ error: 'Email or token required' }, 400);

    } catch (e) {
        console.error(e);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

app.post('/api/broadcast', async (c) => {
    const apiKey = c.req.header('X-Admin-Key');
    const envApiKey = c.env.ADMIN_API_KEY;

    if (!hasValidAdminKey(apiKey, envApiKey)) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    let { subject, html, testEmail } = body;

    if (!subject || !html) {
        return c.json({ error: 'Subject and HTML content are required' }, 400);
    }

    // Sanitize HTML
    html = sanitizeHtml(html);

    try {
        const db = c.env.DB;

        // If testEmail is provided, send only to that address
        if (testEmail) {
            console.log(`[AUDIT] Broadcast TEST initiated by admin. Subject: ${subject}, To: ${testEmail}`);

            if (c.env.RESEND_API_KEY) {
                const res = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Código Ergo Sum <newsletter@notifications.codigoergosum.com>',
                        to: testEmail,
                        subject: `[TEST] ${subject}`,
                        html: html
                    })
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Resend Error:', errorText);
                    return c.json({ error: 'Failed to send test email', details: errorText }, 500);
                }
            } else {
                console.log(`[MOCK BROADCAST TEST] To: ${testEmail}, Subject: ${subject}`);
            }
            return c.json({ message: 'Test email sent', count: 1 });
        }

        // Production Broadcast
        console.log(`[AUDIT] Broadcast PRODUCTION initiated by admin. Subject: ${subject}`);

        const { results } = await db.prepare('SELECT email FROM subscribers WHERE status = \'confirmed\'').all<Subscriber>();

        if (!results || results.length === 0) {
            return c.json({ message: 'No confirmed subscribers found', count: 0 });
        }

        let sentCount = 0;
        let errorCount = 0;

        // Batch sending limit for Resend is 100
        const BATCH_SIZE = 100;
        const chunks = [];

        for (let i = 0; i < results.length; i += BATCH_SIZE) {
            chunks.push(results.slice(i, i + BATCH_SIZE));
        }

        console.log(`Sending ${results.length} emails in ${chunks.length} batches...`);

        for (const chunk of chunks) {
            if (c.env.RESEND_API_KEY) {
                // Map chunk to Resend batch format
                const batchEmails = chunk.map(sub => ({
                    from: 'Código Ergo Sum <newsletter@notifications.codigoergosum.com>',
                    to: sub.email,
                    subject: subject,
                    html: html,
                    headers: {
                        'List-Unsubscribe': `<${c.env.ORIGIN_BASE_URL}/unsubscribe>`
                    }
                }));

                const res = await fetch('https://api.resend.com/emails/batch', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(batchEmails) // Array of email objects
                });

                if (res.ok) {
                    const data = await res.json() as { data: { id: string }[] };
                    // Access 'data' property if it exists, otherwise assume success based on res.ok
                    const count = data?.data?.length || chunk.length;
                    sentCount += count;
                } else {
                    console.error('Batch Send Failed:', await res.text());
                    errorCount += chunk.length;
                }
            } else {
                // Mock Batch
                console.log(`[MOCK BATCH] Sending ${chunk.length} emails...`);
                chunk.forEach(sub => console.log(`  -> ${sub.email}`));
                sentCount += chunk.length;
            }
        }

        return c.json({ message: 'Broadcast completed', sent: sentCount, errors: errorCount });

    } catch (e) {
        console.error(e);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default app;
