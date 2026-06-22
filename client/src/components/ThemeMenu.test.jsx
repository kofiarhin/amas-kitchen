import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeMenu from "./ThemeMenu";
import { THEME_STORAGE_KEY } from "../lib/theme";

function mockMatchMedia(prefersLight = false) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query.includes("light") ? prefersLight : !prefersLight,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe("ThemeMenu", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.colorScheme = "";
    mockMatchMedia(true);
  });

  afterEach(() => vi.restoreAllMocks());

  test("defaults to the system theme when localStorage is empty", () => {
    render(<ThemeMenu />);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  test("shows only Light and Dark options, not System", async () => {
    render(<ThemeMenu />);
    await userEvent.click(screen.getByLabelText("Choose color theme"));
    expect(screen.getByRole("menuitemradio", { name: /light/i })).toBeVisible();
    expect(screen.getByRole("menuitemradio", { name: /dark/i })).toBeVisible();
    expect(screen.queryByText(/system/i)).not.toBeInTheDocument();
  });

  test("clicking Light persists light and updates the document theme", async () => {
    mockMatchMedia(false);
    render(<ThemeMenu />);
    await userEvent.click(screen.getByLabelText("Choose color theme"));
    await userEvent.click(screen.getByRole("menuitemradio", { name: /light/i }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  test("clicking Dark persists dark and updates the document theme", async () => {
    render(<ThemeMenu />);
    await userEvent.click(screen.getByLabelText("Choose color theme"));
    await userEvent.click(screen.getByRole("menuitemradio", { name: /dark/i }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
