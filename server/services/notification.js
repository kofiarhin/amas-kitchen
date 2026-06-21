function formatOrderMessage(order) {
  return [
    `Order: ${order.orderNumber}`,
    `Customer: ${order.customerName}`,
    `Total: £${(order.total / 100).toFixed(2)}`,
    `Phone: ${order.phone}`,
  ].join("\n");
}

async function sendTelegramRequest(endpoint, body) {
  try {
    return await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Telegram notification request failed");
  }
}

async function parseTelegramResponse(response) {
  if (!response.ok) throw new Error(`Telegram notification failed with HTTP ${response.status}`);

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Telegram notification returned an invalid response");
  }
  if (payload?.ok !== true) throw new Error(`Telegram notification failed: ${payload?.description || "unknown API error"}`);
  return payload.result;
}

function createNotifier(config) {
  const { botToken, chatId } = config.telegram;
  const endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;
  return async (order) => {
    const response = await sendTelegramRequest(endpoint, {
      chat_id: chatId,
      text: formatOrderMessage(order),
    });
    return parseTelegramResponse(response);
  };
}

module.exports = { createNotifier };
