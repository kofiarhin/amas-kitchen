const nodemailer = require("nodemailer");

function createNotifier(config) {
  if (!config.smtp.host) return async () => undefined;
  const transporter = nodemailer.createTransport({ host: config.smtp.host, port: config.smtp.port, secure: config.smtp.secure, auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined });
  return (order) => transporter.sendMail({ from: config.smtp.from, to: config.smtp.recipient, subject: `New order ${order.orderNumber}`, text: `${order.orderNumber} from ${order.customerName}\nTotal: £${(order.total / 100).toFixed(2)}\nPhone: ${order.phone}` });
}

module.exports = { createNotifier };
