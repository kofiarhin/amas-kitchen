# Project Context

Amas Kitchen is a MERN-style food ordering app with a Vite React frontend and an Express/MongoDB backend.

The backend exposes public menu/bootstrap routes, ordering routes, and admin routes. Order notifications are sent through Telegram using `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.

Production deployment is handled by GitHub Actions and Heroku. The production backend serves the compiled frontend from `client/dist`.
