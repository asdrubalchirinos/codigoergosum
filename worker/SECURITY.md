# Security Policy

## Overview
This document outlines the security measures and best practices for the Newsletter Worker.

## Authentication & Authorization
- **Admin API**: Protected by `X-Admin-Key` header. The key must be at least 32 characters long and high entropy.
- **Subscriptions**: Protected by Cloudflare Turnstile CAPTCHA.
- **Subscriber Actions**: Confirmation and Unsubscribe actions are protected by cryptographically secure, single-use tokens.

## Secret Management
- **Production Secrets**: MUST be stored in Cloudflare Secrets using `wrangler secret put`.
- **Development**: Local secrets are stored in `.dev.vars` (Git-ignored).
- **Never commit secrets** to version control.

## Rate Limiting
- **Subscribe Endpoint**: Limited to 10 requests per 15 minutes per IP address.
- **Implementation**: Uses D1 database `rate_limits` table.

## CORS Policy
- Restricted to the following origins:
  - `https://www.codigoergosum.com`
  - `https://codigoergosum.com`
  - `http://localhost:4321`

## Input Validation
- **Email**: Regex validation on all endpoints.
- **HTML**: Broadcast content is sanitized to strip scripts, iframes, and dangerous attributes.

## Incident Response
If a security breach is suspected:
1. Rotate `ADMIN_API_KEY` immediately: `wrangler secret put ADMIN_API_KEY`
2. Rotate `RESEND_API_KEY` if emails are compromised.
3. Check logs for suspicious activity.
