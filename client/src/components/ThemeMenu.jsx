import { useEffect, useId, useRef, useState } from "react";
import { Check, DotsThreeVertical, Moon, Sun } from "@phosphor-icons/react";
import { applyTheme, getStoredTheme, resolveTheme, setThemePreference } from "../lib/theme";

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

export default function ThemeMenu({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => resolveTheme());
  const menuRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    const sync = () => {
      const next = resolveTheme();
      applyTheme(next);
      setTheme(next);
    };
    sync();

    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (!getStoredTheme()) sync();
    };
    const onStorage = (event) => {
      if (!event.key || event.key === "amas-theme") sync();
    };
    const onThemeChange = () => sync();

    media?.addEventListener?.("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    window.addEventListener("amas-theme-change", onThemeChange);
    return () => {
      media?.removeEventListener?.("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("amas-theme-change", onThemeChange);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const chooseTheme = (value) => {
    setThemePreference(value);
    setTheme(value);
    setOpen(false);
  };

  return (
    <div className={`theme-menu ${className}`.trim()} ref={menuRef}>
      <button className="theme-menu-trigger" type="button" aria-label="Choose color theme" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((value) => !value)}>
        <DotsThreeVertical size={22} weight="bold" />
      </button>
      {open && (
        <div className="theme-menu-panel" id={menuId} role="menu" aria-label="Color theme">
          {options.map(({ value, label, Icon }) => (
            <button key={value} type="button" role="menuitemradio" aria-checked={theme === value} className="theme-menu-item" onClick={() => chooseTheme(value)}>
              <Icon size={18} />
              <span>{label}</span>
              {theme === value && <Check size={17} weight="bold" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
