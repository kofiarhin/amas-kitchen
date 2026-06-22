const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function readJson(response) {
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "The request failed.");
  return result.data;
}

export async function fetchPublicBootstrap({ signal } = {}) {
  const response = await fetch(`${API_URL}/api/public/bootstrap`, { signal });
  return readJson(response);
}

export async function placeOrder(payload, idempotencyKey = globalThis.crypto.randomUUID()) {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(payload),
  });
  return readJson(response);
}
