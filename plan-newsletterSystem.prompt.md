# Newsletter System Plan for codigoergosum (Astro)

## Goals
- Add a simple, privacy-friendly newsletter to the Astro blog.
- Support subscribe → confirm → deliver → unsubscribe lifecycle.
- Keep the site static; use an external API (serverless) for subscription/confirmation logic.
- Keep authoring flow simple: generate newsletter emails from existing blog posts.

## High-Level Architecture
- Frontend (Astro):
  - `NewsletterForm` component embedded on homepage and/or post pages.
  - Confirmation and Unsubscribe landing pages (`/confirm`, `/unsubscribe`).
- External API (Cloudflare Workers or similar):
  - Endpoints: `/api/subscribe`, `/api/confirm`, `/api/unsubscribe`.
  - DB: Cloudflare D1 (or equivalent) storing subscribers and confirmations.
  - Email provider: Resend (or similar) to send confirmation and newsletter emails.
  - Captcha: Cloudflare Turnstile (optional but recommended).
- Dev workflow:
  - Author posts as usual.
  - Use a script to generate/send newsletter HTML from recent posts via MJML.
- CI/CD:
  - GitHub Actions workflow to trigger newsletter sends (manual dispatch) and/or scheduled digest.

## Environment Variables (Frontend)
- `PUBLIC_NEWSLETTER_API_URL`: Base URL for the external API (e.g., `https://newsletter.example.com`).
- Optional Turnstile site key if the widget is used on the form (`PUBLIC_TURNSTILE_SITE_KEY`).

## Environment Variables (Backend/API)
- `RESEND_API_KEY`: Email provider API key.
- `ORIGIN_BASE_URL`: Public origin of the blog (e.g., `https://codigoergosum.com`).
- `TURNSTILE_SECRET_KEY`: Captcha secret (if enabled).
- `CONFIRM_TOKEN_TTL_MINUTES`: Token expiry (e.g., 60).
- `UNSUBSCRIBE_TOKEN_TTL_MINUTES`: Optional separate TTL or reuse confirm TTL.
- `D1`: Cloudflare D1 binding (if on Cloudflare).

## Database Schema (D1)
- `subscribers`:
  - `id` TEXT PRIMARY KEY (uuid)
  - `email` TEXT UNIQUE NOT NULL
  - `status` TEXT NOT NULL CHECK (status IN ('pending','confirmed','unsubscribed'))
  - `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `confirmed_at` DATETIME NULL
  - `unsubscribed_at` DATETIME NULL
- `tokens`:
  - `id` TEXT PRIMARY KEY (uuid)
  - `subscriber_id` TEXT NOT NULL REFERENCES subscribers(id)
  - `type` TEXT NOT NULL CHECK (type IN ('confirm','unsubscribe'))
  - `token` TEXT UNIQUE NOT NULL
  - `expires_at` DATETIME NOT NULL
  - `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  - Indexes on (`token`), (`subscriber_id`,`type`).

## API Endpoints (Spec)
- `POST /api/subscribe`
  - Body: `{ email: string, turnstileToken?: string }`
  - Validates email, optional Turnstile.
  - If new or unsubscribed: upsert subscriber to `pending`, create confirm token, send confirmation email with link: `${ORIGIN_BASE_URL}/confirm?token=...`.
  - If already confirmed: idempotent 200 with message.
  - Responses:
    - 200 `{ ok: true, message: 'Check your email to confirm.' }`
    - 400/429/500 with meaningful message.
- `GET /api/confirm?token=...`
  - Validates token and expiry; sets subscriber `status='confirmed'`, `confirmed_at`.
  - Invalid/expired: 400 with reason.
  - Success: 302 redirect to `${ORIGIN_BASE_URL}/confirm?status=success`.
- `POST /api/unsubscribe`
  - Body: `{ email?: string, token?: string }` (support either direct email flow or tokenized link)
  - If token provided: validate, mark `unsubscribed`, record `unsubscribed_at`.
  - If email provided: send an unsubscribe confirmation email with link `${ORIGIN_BASE_URL}/unsubscribe?token=...`.
  - Responses: 200 on idempotent success.

## Frontend Components and Pages
- `src/components/NewsletterForm.astro`
  - Props: `mode?: 'compact' | 'full'`.
  - Renders email input, optional Turnstile widget, submit button, and status message area.
  - Client script (plain JS, no TS in `<script>` for Astro stability):
    - On submit: read email, read Turnstile token if present (`[name="cf-turnstile-response"]`).
    - POST to `${PUBLIC_NEWSLETTER_API_URL}/api/subscribe`.
    - Show success or error message; handle network failures gracefully.
  - Accessibility: label association, focus management after submit.
- `src/pages/confirm.astro`
  - Reads `status` or `error` query param and renders appropriate message.
  - Friendly copy: “Email confirmado. ¡Gracias por suscribirte!” or error guidance.
- `src/pages/unsubscribe.astro`
  - Supports both direct token link and email entry form.
  - If `token` present: call API to finalize; show success.
  - Otherwise: render form to request an unsubscribe link.

## Email Templates
- `src/templates/newsletter.mjml`
  - MJML template to render a digest or featured post.
  - Variables: site title, intro text, list of posts (title, excerpt, URL), footer with unsubscribe link.
  - Compiled to HTML before sending.
- Optional: `src/templates/confirm.mjml`, `src/templates/unsubscribe.mjml` for transactional emails (or use simple provider templates).

## Scripts (Node)
- `scripts/newsletter/build-html.mjs`
  - Reads latest posts (via filesystem or a lightweight content loader).
  - Uses `gray-matter` to parse markdown frontmatter and `mjml` to render HTML.
  - Outputs `dist/newsletter.html`.
- `scripts/newsletter/send.mjs`
  - Loads `dist/newsletter.html`.
  - Calls backend API to send newsletter to confirmed subscribers (or directly calls provider if backend owns sending).
  - CLI args: `--post slugs`, `--dry-run`, `--subject`.

## CI/CD (GitHub Actions)
- Manual workflow `.github/workflows/newsletter.yml`:
  - `workflow_dispatch` with inputs: `subject`, `target` (e.g., recent N posts), `dryRun`.
  - Steps:
    - `npm ci`
    - `npm run build:newsletter` → uses MJML to produce HTML.
    - `node scripts/newsletter/send.mjs --subject ...`.
  - Secrets: `RESEND_API_KEY`, `PUBLIC_NEWSLETTER_API_URL` or backend endpoint, any auth tokens.
- Optional schedule for weekly digest.

## Security and Compliance
- Double opt-in: enforce confirm token before sending any newsletter.
- Rate limiting on subscribe/unsubscribe.
- Turnstile captcha to reduce abuse.
- Store only email and minimal metadata; no PII beyond email.
- Unsubscribe link in every email; idempotent operations.

## Implementation Phases
- Phase 1 (Frontend + UX):
  - Add `NewsletterForm.astro`, `confirm.astro`, `unsubscribe.astro` with clean UX.
  - Wire form to `PUBLIC_NEWSLETTER_API_URL`.
  - Test: manual E2E with mocked API endpoints.
- Phase 2 (Backend API):
  - Implement Workers routes, D1 schema, Resend integration, tokens.
  - Test tokens, expiry, idempotency; deploy behind custom domain.
- Phase 3 (Email + CI):
  - Add MJML template, build script, and `send.mjs`.
  - Add GitHub Action for manual dispatch.
- Phase 4 (Hardening):
  - Add Turnstile, rate limits, logging/monitoring, bounce handling (future).

## Acceptance Criteria
- Subscribing with a valid email shows success and sends a confirmation email.
- Confirmation link activates the subscriber and redirects to `/confirm?status=success`.
- Unsubscribe flow works via token or email request, always idempotent.
- Newsletter HTML builds locally and sends via workflow in dry-run mode.
- No Astro compiler panics; client scripts use plain JS in `<script>` blocks.

## Notes on Sidebar Compiler Panic
- The previous Astro compiler panic originated in `Sidebar.astro` when rendering a complex tag cloud. Mitigation strategy:
  - Precompute tag arrays server-side, avoid complex inline JSX expressions in HTML section.
  - Favor simple loops/rendering and avoid TS annotations in client scripts.
  - Re-enable `Sidebar` on `index.astro` after validating the refactor under `npm run dev`.

## Next Actions (Practical)
- Implement Phase 1 pages/components.
- Stand up a minimal Worker with `/api/subscribe` returning success (mock) to unblock UX.
- Add MJML dependency and skeleton template.
- Validate flows end-to-end with mock backend, then replace with real backend.
