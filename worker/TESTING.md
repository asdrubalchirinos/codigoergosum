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
