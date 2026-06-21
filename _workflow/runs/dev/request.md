# Active Request

Implement the complete Ama's Kitchen MVP defined in `Amas-Kitchen-PRD.md` using the existing MERN repository.

Confirmed clarifications:

- Send new-order admin notifications through configurable SMTP using Nodemailer; credentials and recipient are environment variables.
- Food-item images are validated URLs entered by the admin. Support multiple URLs; do not implement uploads or Cloudinary administration.
- Add an idempotent seed command for sample menu items, configured delivery zones, and one default settings record; keep seed values editable before deployment.
- Produce deployment-ready configuration, health checks, environment documentation, and documentation of the 30-day database-backup requirement. Do not deploy or provision infrastructure.
- Execution mode: `complete-workflow`.
