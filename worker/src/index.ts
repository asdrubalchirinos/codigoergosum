import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { validateTurnstileToken } from './turnstile';

type Bindings = {
    DB: D1Database;
    RESEND_API_KEY: string;
    PUBLIC_NEWSLETTER_API_URL: string;
    TURNSTILE_SECRET_KEY: string;
    ORIGIN_BASE_URL: string;
};

interface Subscriber {
    id: string;
    email: string;
    status: 'pending' | 'confirmed' | 'unsubscribed';
    created_at: number;
    confirmed_at?: number;
    unsubscribed_at?: number;
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

app.use('/*', cors());

app.get('/', (c) => {
    return c.text('Newsletter API is running!');
});

app.post('/api/subscribe', async (c) => {
    const body = await c.req.json();
    const { email, token } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return c.json({ error: 'Invalid email address' }, 400);
    }

    // Validate Turnstile
    if (c.env.TURNSTILE_SECRET_KEY && token) {
        const ip = c.req.header('CF-Connecting-IP');
        const isValid = await validateTurnstileToken(token, c.env.TURNSTILE_SECRET_KEY, ip);
        if (!isValid) {
            return c.json({ error: 'Invalid captcha' }, 400);
        }
    } else if (c.env.TURNSTILE_SECRET_KEY && !token) {
        // Enforce captcha if key is set
        return c.json({ error: 'Captcha required' }, 400);
    }

    try {
        const db = c.env.DB;

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
        const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour

        // Transaction to upsert subscriber and create token
        await db.batch([
            db.prepare(`
                INSERT INTO subscribers (id, email, status) VALUES (?, ?, 'pending')
                ON CONFLICT(email) DO UPDATE SET status = 'pending', unsubscribed_at = NULL
            `).bind(subscriberId, email),
            db.prepare(`
                INSERT INTO tokens (id, subscriber_id, type, token, expires_at) VALUES (?, ?, 'confirm', ?, ?)
            `).bind(crypto.randomUUID(), subscriberId, token, expiresAt)
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
                    from: 'Newsletter <newsletter@codigoergosum.com>', // Update this!
                    to: email,
                    subject: 'Confirm your subscription',
                    html: `<p>Please confirm your subscription by clicking <a href="${confirmUrl}">here</a>.</p>`
                })
            });

            if (!res.ok) {
                console.error('Failed to send email', await res.text());
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

        // Redirect to success page
        return c.redirect(`${c.env.ORIGIN_BASE_URL}/confirm?status=success`);

    } catch (e) {
        console.error(e);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

app.post('/api/unsubscribe', async (c) => {
    const body = await c.req.json();
    const { email, token } = body;

    try {
        const db = c.env.DB;

        if (token) {
            // Token-based unsubscribe
            const tokenRecord = await db.prepare('SELECT * FROM tokens WHERE token = ? AND type = \'unsubscribe\'').bind(token).first<Token>();

            if (!tokenRecord) {
                return c.json({ error: 'Invalid or expired token' }, 400);
            }

            await db.batch([
                db.prepare('UPDATE subscribers SET status = \'unsubscribed\', unsubscribed_at = unixepoch() WHERE id = ?').bind(tokenRecord.subscriber_id),
                db.prepare('DELETE FROM tokens WHERE id = ?').bind(tokenRecord.id)
            ]);

            return c.json({ message: 'Unsubscribed successfully' });
        } else if (email) {
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
                            from: 'Newsletter <newsletter@codigoergosum.com>',
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

export default app;
