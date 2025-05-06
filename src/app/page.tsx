'use client';

import { useAuth } from "@/context/AuthContext";
import SignInSection from "@/components/SignInSection";
import ProfileSection from "@/components/Dashboard";

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center overflow-auto">
      <main className="w-full max-w-[min(600px,100vw)] flex-1 px-1 py-2">
        {!user ? (
          <SignInSection onSignIn={signInWithGoogle} />
        ) : (
          <ProfileSection user={user} isLoading={loading} />
        )}
      </main>
    </div>
  );
}
