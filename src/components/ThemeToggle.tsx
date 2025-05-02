"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full flex items-center justify-between rounded-lg border bg-card p-1">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-md transition-colors",
          theme === "light" 
            ? "bg-accent text-accent-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="h-5 w-5" />
        <span className="text-xs mt-1">Light</span>
      </button>
      <div className="h-8 w-px bg-border" />
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-md transition-colors",
          theme === "dark" 
            ? "bg-accent text-accent-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="h-5 w-5" />
        <span className="text-xs mt-1">Dark</span>
      </button>
      <div className="h-8 w-px bg-border" />
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-md transition-colors",
          theme === "system" 
            ? "bg-accent text-accent-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Monitor className="h-5 w-5" />
        <span className="text-xs mt-1">System</span>
      </button>
    </div>
  );
} 