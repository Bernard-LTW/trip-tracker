import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProfileSectionProps {
  user: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  };
  onSignOut: () => void;
}

export default function ProfileSection({ user, onSignOut }: ProfileSectionProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader className="flex flex-row items-center gap-4">
        {user.photoURL && (
          <Image
            src={user.photoURL}
            alt={user.displayName || 'User profile'}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold">Welcome, {user.displayName}!</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Link href="/trips" className="w-full">
            <Button
              variant="default"
              className="w-full"
            >
              View My Trips
            </Button>
          </Link>
          <Link href="/profile" className="w-full">
            <Button
              variant="secondary"
              className="w-full"
            >
              Edit Profile
            </Button>
          </Link>
          <Button
            onClick={onSignOut}
            variant="destructive"
            className="w-full"
          >
            Sign out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 