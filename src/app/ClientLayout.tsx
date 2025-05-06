'use client';

import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";
import PRInfoWrapper from "@/components/PRInfoWrapper";
import { useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isOnboarding, setIsOnboarding] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <main className={`flex-1 overflow-y-auto flex flex-col ${user && !isOnboarding ? 'pb-24' : ''}`}>
        {user ? (
          <PRInfoWrapper onOnboardingChange={setIsOnboarding}>
            {children}
          </PRInfoWrapper>
        ) : (
          children
        )}
      </main>
      {user && !isOnboarding && <NavBar />}
    </div>
  );
} 