function formatMoney(pence = 0) {
  return `£${(pence / 100).toFixed(2)}`;
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatOrderItems(items = []) {
  if (!items.length) return ["Items: Not provided"];

  return [
    "Items:",
    ...items.flatMap((item) => {
      const quantity = item.quantity || 1;
      const lines = [`- ${quantity}x ${item.name} (${formatMoney(item.lineTotal)})`];

      for (const addon of item.selectedAddons || []) {
        const group = clean(addon.addonGroupName);
        const prefix = group ? `${group}: ` : "";
        lines.push(`  • ${prefix}${addon.name} (+${formatMoney(addon.price)})`);
      }

      return lines;
    }),
  ];
}

function formatDeliveryAddress(deliveryAddress = {}) {
  const addressParts = [
    clean(deliveryAddress.line1),
    clean(deliveryAddress.line2),
    clean(deliveryAddress.city),
  ].filter(Boolean);

  const lines = [];
  if (addressParts.length) lines.push(`Delivery: ${addressParts.join(", ")}`);
  if (clean(deliveryAddress.instructions)) lines.push(`Instructions: ${clean(deliveryAddress.instructions)}`);
  return lines;
}

function formatOrderMessage(order) {
  const lines = [
    `Order: ${order.orderNumber}`,
    `Customer: ${order.customerName}`,
    `Total: ${formatMoney(order.total)}`,
    `Phone: ${order.phone}`,
    "",
    ...formatOrderItems(order.items),
    "",
    ...formatDeliveryAddress(order.deliveryAddress),
  ];

  if (clean(order.notes)) lines.push(`Notes: ${clean(order.notes)}`);

  return lines.filter((line, index, all) => line !== "" || (all[index - 1] && all[index + 1])).join("\n");
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

module.exports = { createNotifier, formatOrderMessage };
