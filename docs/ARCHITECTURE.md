# Architecture

## Frontend

The client is a Vite React app in `client/`. Local development runs on Vite. Production builds to `client/dist`.

## Backend

The API is an Express app in `server/`. `server/server.js` connects MongoDB and starts the HTTP server. `server/app.js` configures security middleware, CORS, JSON parsing, routes, error handling, and production static frontend serving.

## Deployment shape

Heroku runs a single Node app. During Heroku build, `heroku-postbuild` installs client dependencies and builds the frontend. At runtime, Express serves API routes under `/api/*` and serves the React app for frontend routes.

## Notifications

Order notifications use Telegram. Configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in the Heroku environment.
