import { useEffect, useState } from "react";
import { getStoredTheme, applyTheme, THEME_CHANGE_EVENT } from "../lib/theme";

export function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    const handleChange = (event) => setTheme(event.detail);
    window.addEventListener(THEME_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleChange);
  }, []);

  const toggleTheme = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  return [theme, toggleTheme];
}
