'use client';

import { useAuth } from "@/context/AuthContext";
import SignInSection from "@/components/SignInSection";
import ProfileSection from "@/components/ProfileSection";

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
    <div className="min-h-screen flex items-start justify-center p-8">
      <main className="flex flex-col items-center gap-8 pt-4">
        {!user ? (
          <SignInSection onSignIn={signInWithGoogle} />
        ) : (
          <ProfileSection user={user} isLoading={loading} />
        )}
      </main>
    </div>
  );
}
