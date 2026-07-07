# Operations

## Required configuration

Set these environment variables for the Heroku app before deployment:

- `NODE_ENV=production`
- `MONGO_URI`
- `CLIENT_URL`
- `DELIVERY_FEE`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

GitHub Actions also needs these repository secrets:

- `HEROKU_API_KEY`
- `HEROKU_APP_NAME`
- `HEROKU_EMAIL`

## Deployment

Pushing to `main` runs backend tests, frontend tests, builds the Vite client, then deploys the app to Heroku. Heroku runs `npm start`, which starts `server/server.js`. The backend serves the built frontend from `client/dist` in production.

## Seeding

Run the seed script after setting the production environment variables:

```bash
npm run seed
```

## Health checks

Use `/health` to confirm the API is ready after deployment. The CI/CD workflow checks this endpoint after Heroku deploys.

## Backups

Keep MongoDB backups for at least 30 days. Restore testing should be done before relying on a backup policy in production.
