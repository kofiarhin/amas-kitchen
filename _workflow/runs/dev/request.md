# Active Work Request

Replace SMTP/Nodemailer order notifications with Telegram Bot API notifications while preserving the existing route and order-service dependency flow.

Requirements:

- Replace `server/services/notification.js` with a native Node 22 `fetch` implementation calling Telegram `sendMessage`.
- Preserve the current plain-text fields: order number, customer name, total, and phone number.
- Throw on HTTP or Telegram API failure so `orderService` continues to catch and log notification failures without rolling back orders.
- Remove `nodemailer` and all SMTP configuration.
- Require `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`, exposed as `config.telegram.botToken` and `config.telegram.chatId`.
- Update `.env.example`, dependency manifests/lockfile, relevant documentation, and automated tests.
- Do not install Axios or change the existing `createNotifier(config)` injection and `deps.notify(order)` flow.

Execution mode: `complete-workflow`.
