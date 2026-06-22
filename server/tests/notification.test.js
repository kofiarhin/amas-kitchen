const { createNotifier } = require("../services/notification");

describe("Telegram order notifier", () => {
  const config = { telegram: { botToken: "bot-token", chatId: "-100123" } };
  const order = { orderNumber: "AK-000042", customerName: "Ama Mensah", total: 4599, phone: "020 7946 0182" };

  afterEach(() => jest.restoreAllMocks());

  test("posts the confirmed order fields to Telegram sendMessage", async () => {
    const fetch = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: true, result: { message_id: 1 } }),
    });
    const notify = createNotifier(config);

    await notify(order);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.telegram.org/botbot-token/sendMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: "-100123",
          text: "Order: AK-000042\nCustomer: Ama Mensah\nTotal: £45.99\nPhone: 020 7946 0182\n\nItems: Not provided",
        }),
      },
    );
  });

  test("rejects non-successful HTTP responses", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({ ok: false, description: "Unauthorized" }),
    });

    await expect(createNotifier(config)(order)).rejects.toThrow("Telegram notification failed with HTTP 401");
  });

  test("rejects Telegram API failures returned with HTTP success", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: false, description: "chat not found" }),
    });

    await expect(createNotifier(config)(order)).rejects.toThrow("Telegram notification failed: chat not found");
  });

  test("rejects malformed Telegram responses", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
    });

    await expect(createNotifier(config)(order)).rejects.toThrow("Telegram notification returned an invalid response");
  });

  test("sanitizes network failures so the bot token is not exposed", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("request to https://api.telegram.org/botbot-token/sendMessage failed"));

    const promise = createNotifier(config)(order);
    await expect(promise).rejects.toThrow("Telegram notification request failed");
    await expect(promise).rejects.not.toThrow("bot-token");
  });
});
