# Newsletter System Setup Guide

This document outlines the steps required to configure, deploy, and run the newsletter system for **Código Ergo Sum**.

## 1. Prerequisites

- **Cloudflare Account**: For Workers, D1 Database, and Turnstile.
- **Resend Account**: For sending emails.
- **Node.js & npm**: Installed locally.
- **Wrangler CLI**: `npm install -g wrangler`

## 2. Cloudflare Services Setup

### A. Turnstile (Captcha)
1. Go to **Cloudflare Dashboard > Turnstile**.
2. Click **Add Site**.
3. Enter Site Name (e.g., `CodigoErgoSum`) and Domain (`codigoergosum.com`, add `localhost` for dev).
4. **Copy Keys**:
   - **Site Key** (Public)
   - **Secret Key** (Private)

### B. D1 Database
1. Run locally to create the DB (if not done):
   ```bash
   npx wrangler d1 create newsletter-db
   ```
2. Copy the `database_id` output.
3. Update `worker/wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "newsletter-db"
   database_id = "PASTE_YOUR_ID_HERE"
   ```

### C. Resend (Email)
1. Go to [Resend.com](https://resend.com) -> **API Keys**.
2. Create a new API Key.
3. Verify your domain (`codigoergosum.com`) in Resend settings to send real emails.

## 3. Environment Variables

### Frontend (`.env`)
Create or edit `.env` in the project root:

```env
# URL of your deployed Worker (or localhost for dev)
PUBLIC_NEWSLETTER_API_URL=http://localhost:8787

# Turnstile Public Key
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAxXXxXXxXXxXXxX
```

### Backend (Worker Secrets)
Run these commands in the `worker/` directory to set production secrets:

```bash
cd worker

# Resend API Key
npx wrangler secret put RESEND_API_KEY

# Turnstile Secret Key
npx wrangler secret put TURNSTILE_SECRET_KEY

# Your Blog URL
npx wrangler secret put ORIGIN_BASE_URL
# Value: https://codigoergosum.com
```

## 4. Deployment

### Backend (Worker)
1. Apply database schema (production):
   ```bash
   cd worker
   npx wrangler d1 execute newsletter-db --remote --file=./schema.sql
   ```
2. Deploy the worker:
   ```bash
   npx wrangler deploy
   ```
3. Note the Worker URL (e.g., `https://newsletter-worker.your-subdomain.workers.dev`).
4. Update `PUBLIC_NEWSLETTER_API_URL` in your frontend `.env` (and in GitHub Secrets) with this URL.

### Frontend (Astro)
Deploy your Astro site as usual (e.g., GitHub Pages, Cloudflare Pages). Ensure the `PUBLIC_` variables are set in your build environment.

## 5. GitHub Actions (Newsletter Sending)

To enable the "Send Newsletter" workflow:

1. Go to your GitHub Repo > **Settings > Secrets and variables > Actions**.
2. Add Repository Secrets:
   - `NEWSLETTER_API_URL`: Your Worker URL.
   - `NEWSLETTER_API_KEY`: (Optional, if you added auth to the worker).

**To Send a Newsletter:**
1. Go to **Actions** tab in GitHub.
2. Select **Send Newsletter**.
3. Click **Run workflow**.
4. Enter the **Post Slug** (e.g., `mi-vision-de-los-vision-pro`).
5. Uncheck **Dry Run** to actually send.

## 6. Local Development

1. **Start Worker**:
   ```bash
   cd worker
   npm run dev
   ```
2. **Start Frontend**:
   ```bash
   # In project root
   npm run dev
   ```
3. **Test Subscription**:
   - Go to `http://localhost:4321`.
   - Fill out the form.
   - Check Worker console for the "Mock Email" with the confirmation link.
