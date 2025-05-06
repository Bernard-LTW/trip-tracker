'use client'

import Link from "next/link";
import { Home, MapPin, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="max-w-[450px] mx-auto flex justify-around items-center h-20">
        <Link 
          href="/" 
          className={cn(
            "flex flex-col items-center gap-1 text-sm transition-colors",
            pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link 
          href="/trips" 
          className={cn(
            "flex flex-col items-center gap-1 text-sm transition-colors",
            pathname === "/trips" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <MapPin className="h-5 w-5" />
          <span>Trips</span>
        </Link>
        <Link 
          href="/profile" 
          className={cn(
            "flex flex-col items-center gap-1 text-sm transition-colors",
            pathname === "/profile" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
} 