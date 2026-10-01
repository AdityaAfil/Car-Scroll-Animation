import { useCallback, useEffect, useState } from "react";

const KEY = "theme";

/**
 * Light/dark theme. The initial value is applied to <html> by a tiny
 * inline script in index.html (no flash); this hook keeps React in sync,
 * saves the choice and updates the browser theme colour.
 */
export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#0e0f12" : "#d6d6d6");
  }, [dark]);

  const toggle = useCallback(() => {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      /* private mode: ignore */
    }
  }, [dark]);

  return { dark, toggle };
}