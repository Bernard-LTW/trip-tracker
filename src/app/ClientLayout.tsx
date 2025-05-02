'use client';

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
      {user && <NavBar />}
    </div>
  );
} 