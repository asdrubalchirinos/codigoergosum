import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import 'dotenv/config';

const NEWSLETTER_HTML_PATH = path.join(process.cwd(), 'dist/newsletter.html');
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TEST_EMAIL = process.env.TEST_EMAIL;

async function send() {
    if (!fs.existsSync(NEWSLETTER_HTML_PATH)) {
        console.error('Newsletter HTML not found. Run build-html.mjs first.');
        process.exit(1);
    }

    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing in .env');
        process.exit(1);
    }

    if (!TEST_EMAIL) {
        console.error('TEST_EMAIL is missing in .env');
        process.exit(1);
    }

    const html = fs.readFileSync(NEWSLETTER_HTML_PATH, 'utf-8');
    
    console.log(`Sending test newsletter to ${TEST_EMAIL}...`);

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Newsletter <newsletter@notifications.codigoergosum.com>',
            to: TEST_EMAIL,
            subject: 'Newsletter Test: Código Ergo Sum',
            html: html
        })
    });

    if (!res.ok) {
        console.error('Failed to send email:', await res.text());
        process.exit(1);
    }

    const data = await res.json();
    console.log('Email sent successfully!', data);
}

send().catch(console.error);
