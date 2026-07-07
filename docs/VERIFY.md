# Verify

## Local checks

Run backend tests:

```bash
npm test
```

Run frontend tests:

```bash
npm test --prefix client
```

Build the frontend:

```bash
npm run build --prefix client
```

## Production checks

After deployment, open the Heroku `/health` endpoint for the configured app.

Expected response includes `status: ok` and `service: amas-kitchen-api`.

## Notification checks

Create a test order in a safe environment and confirm Telegram delivery using `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
