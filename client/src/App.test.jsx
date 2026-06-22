import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import businessConfig from "../../shared/businessConfig.json";
import App from "./App";

const closedBootstrap = {
  business: businessConfig,
  ordering: { canOrder: false, code: "SUNDAY_CLOSED", reason: "Ama's Kitchen is closed on Sundays." },
  menu: [{ _id: "dish-1", name: "Smoky Jollof", description: "Party rice", images: ["https://example.com/dish.jpg"], basePrice: 1200, category: "Rice Bowls", available: true, addonGroups: [] }],
  deliveryZones: [{ name: "Lapaz" }], minimumOrder: 2000, deliveryFee: 300, supportPhone: businessConfig.supportPhone,
};

describe("customer ordering state", () => {
  beforeEach(() => { localStorage.clear(); vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: closedBootstrap }) })); });
  afterEach(() => vi.unstubAllGlobals());

  test("keeps the menu visible while Sunday ordering controls are disabled", async () => {
    render(<App />);
    expect(await screen.findByText("Smoky Jollof")).toBeVisible();
    expect(screen.getByText("Ordering is closed")).toBeVisible();
    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
  });
});
