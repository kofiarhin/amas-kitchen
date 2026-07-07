import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import businessConfig from "../../shared/businessConfig.json";
import App from "./App";

const bootstrap = {
  business: businessConfig,
  ordering: { canOrder: true, code: "ORDERING_OPEN", reason: "" },
  menu: [
    { _id: "dish-1", name: "Smoky Jollof", description: "Party rice", images: ["https://example.com/dish.jpg"], basePrice: 12000, category: "Rice", available: true, addonGroups: [] },
    { _id: "dish-2", name: "Charcoal Chicken", description: "Grilled chicken", images: ["https://example.com/chicken.jpg"], basePrice: 15000, category: "Grills", available: true, addonGroups: [] },
  ],
  deliveryZones: [{ name: "Lapaz" }], minimumOrder: 2000, deliveryFee: 300, supportPhone: businessConfig.supportPhone,
};

describe("premium public website", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    localStorage.clear();
    vi.stubGlobal("scrollTo", vi.fn());
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: bootstrap }) }));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  test("turns the homepage into a marketing funnel without checkout fields", async () => {
    render(<App />);
    expect(await screen.findByRole("heading", { name: /authentic ghanaian food/i })).toBeVisible();
    expect(screen.getAllByRole("link", { name: /order now/i })[0]).toHaveAttribute("href", "/menu");
    expect(screen.getByRole("heading", { name: /three plates/i })).toBeVisible();
    expect(screen.queryByLabelText(/delivery address/i)).not.toBeInTheDocument();
  });

  test("uses menu page for ordering and opens cart as a drawer", async () => {
    render(<App />);
    await userEvent.click((await screen.findAllByRole("link", { name: "Menu" }))[0]);
    expect(await screen.findByRole("heading", { name: /choose your plate/i })).toBeVisible();
    await userEvent.click(screen.getAllByRole("button", { name: "Add" })[0]);
    expect(await screen.findByRole("heading", { name: "Your order" })).toBeVisible();
    expect(screen.getAllByText("Smoky Jollof").length).toBeGreaterThan(1);
    expect(screen.getByRole("link", { name: "Checkout" })).toHaveAttribute("href", "/checkout");
  });

  test("autoplays the testimonial carousel while supporting pause and dot navigation", () => {
    vi.useFakeTimers();
    render(<App />);
    const carousel = screen.getByRole("region", { name: "Customer testimonials carousel" });

    expect(screen.getByText(/the jollof tasted like sunday at home/i)).toBeVisible();

    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByText(/our office lunch arrived warm/i)).toBeVisible();

    fireEvent.mouseEnter(carousel);
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByText(/our office lunch arrived warm/i)).toBeVisible();

    fireEvent.mouseLeave(carousel);
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByText(/has become our reliable choice/i)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /show testimonial 1 from naa adoley/i }));
    expect(screen.getByText(/the jollof tasted like sunday at home/i)).toBeVisible();
  });
});
