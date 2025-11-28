# Testing the Newsletter API Locally

## Prerequisites
- Node.js installed.
- `npm install` run in the `worker/` directory.

## 1. Start the Worker
Run the development server:
```bash
cd worker
npm run dev
```
This will start the worker on `http://localhost:8787`.

## 2. Setup Local Database
In a separate terminal window (keep the worker running), apply the schema to the local D1 database:
```bash
cd worker
npx wrangler d1 execute newsletter-db --local --file=./schema.sql
```

## 3. Test Endpoints

### Subscribe
```bash
curl -X POST http://localhost:8787/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```
**Expected Response:** `{"message":"Check your email to confirm."}`

### Check Database (to get the token)
```bash
npx wrangler d1 execute newsletter-db --local --command "SELECT * FROM tokens"
```
Copy the `token` value from the output.

### Confirm
Replace `<TOKEN>` with the token you copied:
```bash
curl "http://localhost:8787/api/confirm?token=<TOKEN>"
```
**Expected Response:** Redirects to `http://localhost:4321/confirm?status=success`.

### Unsubscribe
```bash
curl -X POST http://localhost:8787/api/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```
**Expected Response:** `{"message":"If the email exists, an unsubscribe link has been sent."}`

## Security Testing

### Rate Limiting
To test rate limiting:
1. Send >10 subscription requests from the same IP within 15 minutes.
2. Verify that the 11th request returns `429 Too Many Requests`.

### CORS
1. Try to access the API from a different origin (e.g., using `curl` with a fake Origin header).
2. Verify that the request is blocked or the CORS headers are missing.

### Admin Authentication
1. Try to broadcast with an invalid `X-Admin-Key`.
2. Verify `401 Unauthorized` response.
3. Try with a key of different length (timing attack check).

### HTML Sanitization
1. Send a broadcast with `<script>alert('xss')</script>` in the HTML.
2. Verify the script tag is removed in the received email.
