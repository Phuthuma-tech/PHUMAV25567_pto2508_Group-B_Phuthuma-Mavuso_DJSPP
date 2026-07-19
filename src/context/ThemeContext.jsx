import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage.js";

const ThemeContext = createContext(null);

/** localStorage key for the persisted theme preference. */
const THEME_KEY = "podcastExplorer:theme";

/**
 * Resolve the initial theme: whatever was last saved, falling back to the
 * user's OS-level light/dark preference, falling back to "dark" (this
 * app's original look) if neither is available.
 *
 * @returns {"light"|"dark"}
 */
function getInitialTheme() {
  const saved = readStorage(THEME_KEY, null);
  if (saved === "light" || saved === "dark") return saved;

  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

/**
 * Provides the current light/dark theme and a toggle function. The theme
 * is applied by setting `data-theme` on the root `<html>` element; every
 * colour in the app is defined as a CSS custom property in
 * `styles/tokens.css` that's overridden under `[data-theme="light"]`, so
 * flipping the attribute updates the entire UI at once via the browser's
 * normal style recalculation — no per-component theme props needed.
 *
 * @param {{ children: import("react").ReactNode }} props
 * @returns {JSX.Element}
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    writeStorage(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Access the current theme and its toggle function.
 *
 * @returns {{ theme: "light"|"dark", toggleTheme: () => void }}
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
