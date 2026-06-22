# Spec: Global light/dark theme system

Applied skill: design-taste-frontend

## Summary
Add a global theme system for the Vite React app. First visit resolves from `prefers-color-scheme`; explicit Light/Dark choices persist to `localStorage` under `amas-theme`. The public app preserves its current dark design as dark theme. Light mode applies through CSS custom properties. Admin login, loading, and signed-in dashboard also render the reusable theme menu.

## Acceptance Criteria
- [x] Document theme is applied via `document.documentElement.dataset.theme = "light" | "dark"`.
- [x] Inline script resolves and applies theme before React loads.
- [x] Theme menu has only Light and Dark options with Phosphor icons and selected checkmark.
- [x] Theme menu closes on selection, outside click, and Escape.
- [x] Public navbar, admin login, admin loading splash, and admin dashboard include the theme menu.
- [x] Tests verify system default, Light/Dark persistence, document theme updates, and no System option.
- [x] `npm run build --prefix client` succeeds.
