'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserData } from '@/lib/user';
import { User } from '@/types/userTypes';
import PRInfoForm from '@/components/PRInfoForm';
import { Toaster } from 'sonner';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      
      try {
        const data = await getUserData(user.uid);
        setUserData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-lg">Please sign in to edit your profile.</p>
        <Button onClick={() => router.push('/')}>Sign in</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 sm:p-8 overflow-y-auto">
      <div className="w-full max-w-[min(600px,calc(100vw-2rem))] mx-auto space-y-4">
        <Link href="/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Link>
        
        <Card className="border-none shadow-none bg-background px-0">
          <CardHeader className="px-1">
            <h1 className="text-2xl font-semibold">Edit Profile</h1>
          </CardHeader>
          <CardContent className="p-0">
            {userData && (
              <PRInfoForm initialData={userData.prInfo} />
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
