# Amas Kitchen

Amas Kitchen is a full-stack food ordering application built with React, Vite, Express, and MongoDB. Customers can browse the menu and place orders, while administrators manage menu and order data. The backend can notify operators through Telegram and serves the compiled frontend in production.

## Technology stack

- React and Vite frontend
- Express 5 API
- MongoDB with Mongoose
- JWT authentication and bcrypt password hashing
- Zod request validation
- Helmet, CORS, cookie parsing, and rate limiting
- Jest and Supertest for backend tests
- Heroku deployment with GitHub Actions

## Repository structure

```text
client/                 React/Vite frontend
server/                 Express API, models, routes, tests, and seed scripts
docs/                   Product, architecture, operations, and verification docs
package.json            Root scripts and backend dependencies
```

## Requirements

- Node.js 22.x
- npm 10.x
- MongoDB connection string
- Telegram bot credentials when order notifications are enabled

## Setup

```bash
npm install
npm install --prefix client
```

Create a root `.env` file using the environment variables required by the server. At minimum, configure the MongoDB connection and authentication secret. Telegram credentials are optional unless notifications are enabled.

Typical variables include:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/amas-kitchen
JWT_SECRET=replace-with-a-strong-secret
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Review the server configuration before deployment because exact names and required values must match the implementation.

## Development

Run the API and frontend together:

```bash
npm run dev
```

Run either process separately:

```bash
npm run server
npm run client
```

## Tests

```bash
npm test
```

Backend tests are discovered under `server/tests/**/*.test.js` and run serially through Jest.

## Seed data

```bash
npm run seed
```

Use seed scripts only against the intended database environment.

## Production

The production server starts with:

```bash
npm start
```

The Heroku build step installs frontend dependencies and builds the Vite application. The backend then serves `client/dist`.

## Documentation

- [Product Requirements Document](docs/PRD.md)
- [Technical Specification](docs/TECHNICAL_SPECIFICATION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Operations](docs/OPERATIONS.md)
- [Verification](docs/VERIFY.md)
- [Project Context](docs/PROJECT_CONTEXT.md)

## Security notes

- Never commit `.env` files or credentials.
- Use a strong JWT secret and production MongoDB credentials.
- Restrict CORS to approved origins in production.
- Protect administrative routes with authentication and authorization.
- Validate all order totals and menu references on the server.
- Treat Telegram notifications as operational alerts, not as the system of record.
