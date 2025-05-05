'use client';

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { format } from "date-fns";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [entryDate, setEntryDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEntryDate() {
      if (!user) return;
      try {
        setIsLoading(true);
        const date = await userService.getArrivalDate(user.uid);
        setEntryDate(date);
      } catch (error) {
        console.error('Error loading entry date:', error);
        setEntryDate(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadEntryDate();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4 sm:p-8 overflow-y-auto">
      <div className="w-full max-w-[min(600px,calc(100vw-2rem))] mx-auto space-y-4">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This app is based on UK immigration regulations but should be used with caution. Always verify calculations.
          </AlertDescription>
        </Alert>
      
        <Card className="border-none shadow-none">
          <CardHeader className="flex flex-row items-center gap-4">
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User profile'}
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-semibold">{user.displayName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* <div className="space-y-2">
              <h2 className="text-lg font-medium">Account Details</h2>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Display Name</p>
                <p className="font-medium">{user.displayName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div> */}

            <div className="space-y-4">
              <h2 className="text-lg font-medium">App Options</h2>
              <div className="w-full">
                <ThemeToggle />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Link href="/profile/edit" className="w-full">
                <Button
                  variant="secondary"
                  className="w-full h-9"
                >
                  Edit Profile
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="destructive"
                className="w-full h-9"
              >
                Sign out
              </Button>

              {!isLoading && entryDate && (
                <p className="text-sm text-muted-foreground text-center mt-4 italic">
                  Been in the UK since {format(entryDate, 'MMMM d, yyyy')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 