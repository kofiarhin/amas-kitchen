import { afterEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminApp from "./AdminApp";

afterEach(() => vi.unstubAllGlobals());

test("shows a focused login when no admin session exists", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({}) }));
  render(<AdminApp />);
  expect(await screen.findByRole("heading", { name: "Kitchen operations" })).toBeVisible();
  expect(screen.getByLabelText("Admin email")).toBeRequired();
  expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
});

test("authenticated admins can reach all management surfaces", async () => {
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url) => ({ ok: true, json: async () => ({ success: true, data: url.includes("/orders") ? [] : { email: "admin@amaskitchen.co.uk" } }) })));
  render(<AdminApp />);
  expect(await screen.findByRole("button", { name: "Menu" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Delivery zones" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Settings" })).toBeVisible();
});
