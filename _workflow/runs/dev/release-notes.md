# Release Notes — Telegram Order Notifications

- Replaced SMTP/Nodemailer order email delivery with Telegram Bot API `sendMessage` using native Node.js `fetch`.
- Added required `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` configuration.
- Telegram messages include order number, customer name, GBP total, and phone number.
- Notification network, HTTP, malformed-response, and API failures remain isolated from successful order persistence and are logged through the existing flow.
- Removed Nodemailer, SMTP environment variables, and stale operational documentation.

Deployment action: configure both Telegram variables before starting the updated server, then place a test order against a non-production chat.
