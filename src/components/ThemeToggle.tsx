"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg border bg-background w-full">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "relative flex flex-col items-center justify-center flex-1 h-12 rounded-md transition-colors",
          theme === "light" ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="h-4 w-4 mb-1" />
        <span className="text-xs">Light</span>
      </button>
      <div className="w-px h-8 bg-border" />
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "relative flex flex-col items-center justify-center flex-1 h-12 rounded-md transition-colors",
          theme === "dark" ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="h-4 w-4 mb-1" />
        <span className="text-xs">Dark</span>
      </button>
      <div className="w-px h-8 bg-border" />
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "relative flex flex-col items-center justify-center flex-1 h-12 rounded-md transition-colors",
          theme === "system" ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Monitor className="h-4 w-4 mb-1" />
        <span className="text-xs">System</span>
      </button>
    </div>
  );
} 