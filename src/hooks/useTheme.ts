import { useTheme as Theme } from "next-themes";
import { useEffect, useState } from "react";

export function useTheme() {
  const { setTheme, theme } = Theme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "light" ? "dark" : "light");
  };

  return { theme, toggleTheme, mounted };
}
