import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import 'dotenv/config';
import { parseArgs } from 'node:util';

const NEWSLETTER_HTML_PATH = path.join(process.cwd(), 'dist/newsletter.html');
const API_URL = process.env.NEWSLETTER_API_URL || 'http://localhost:8787';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const TEST_EMAIL = process.env.TEST_EMAIL;

async function send() {
    const { values } = parseArgs({
        args: process.argv.slice(2),
        options: {
            dryRun: {
                type: 'string', // GitHub Actions sends 'true'/'false' as string sometimes
                default: 'true'
            },
            testEmail: {
                type: 'string'
            }
        },
    });

    const isDryRun = values.dryRun === 'true' || values.dryRun === true;
    const targetTestEmail = values.testEmail || TEST_EMAIL;

    if (!fs.existsSync(NEWSLETTER_HTML_PATH)) {
        console.error('Newsletter HTML not found. Run build-html.mjs first.');
        process.exit(1);
    }

    if (!ADMIN_API_KEY) {
        console.error('ADMIN_API_KEY is missing in .env');
        process.exit(1);
    }

    const html = fs.readFileSync(NEWSLETTER_HTML_PATH, 'utf-8');
    
    // Extract title from HTML for subject (simple regex)
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const subject = titleMatch ? titleMatch[1] : 'Código Ergo Sum Newsletter';

    console.log(`Sending newsletter via ${API_URL}...`);
    console.log(`Mode: ${isDryRun ? 'DRY RUN (Test Email)' : 'PRODUCTION (Broadcast)'}`);

    const payload = {
        subject,
        html,
        testEmail: isDryRun ? targetTestEmail : undefined
    };

    if (isDryRun && !payload.testEmail) {
        console.error('Error: Dry run requires a test email (TEST_EMAIL env or --testEmail arg)');
        process.exit(1);
    }

    try {
        const res = await fetch(`${API_URL}/api/broadcast`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Key': ADMIN_API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error('Failed to send:', await res.text());
            process.exit(1);
        }

        const data = await res.json();
        console.log('Success:', data);

    } catch (error) {
        console.error('Network Error:', error);
        process.exit(1);
    }
}

send().catch(console.error);
