"use client";
import { Sun, Moon } from "@solar-icons/react";
import { useUser } from "../context/UserContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUser();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Changer le thème"
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center
        bg-black/5 dark:bg-white/10
        border border-black/10 dark:border-white/10
        text-black/50 dark:text-white/50
        hover:bg-black/10 dark:hover:bg-white/20
        transition-all duration-200"
    >
      {theme === 'dark'
        ? <Sun size={18} color="currentColor" />
        : <Moon size={18} color="currentColor" />
      }
    </button>
  );
}
