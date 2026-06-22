export const THEME_STORAGE_KEY = "amas-theme";
export const THEMES = ["light", "dark"];

export function getSystemTheme() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function getStoredTheme() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(value) ? value : null;
  } catch {
    return null;
  }
}

export function resolveTheme(preference = getStoredTheme()) {
  return THEMES.includes(preference) ? preference : getSystemTheme();
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const resolved = THEMES.includes(theme) ? theme : getSystemTheme();
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function setThemePreference(theme) {
  if (!THEMES.includes(theme)) return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent("amas-theme-change", { detail: { theme } }));
}
