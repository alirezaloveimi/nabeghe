"use client";

import { useTheme } from "@/hooks/useTheme";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

export default function ToggleTheme() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="hidden lg:grid-center size-10 bg-secondary rounded-full text-foreground text-xl"
    >
      {theme === "dark" ? <IoSunnyOutline /> : <IoMoonOutline />}
    </button>
  );
}
