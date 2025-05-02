import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CheckIfOnTrip from "./checkIfOnTrip";
import DaysStats from "./daysStats";
import UpcomingTrips from "./upcomingTrips";
import ProgressBar from "./progressBar";
import { Plus } from "lucide-react";

interface ProfileSectionProps {
  user: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  };
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <Card className="w-[min(600px,100vw)] border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-3 py-2">
        {user.photoURL && (
          <Image
            src={user.photoURL}
            alt={user.displayName || 'User profile'}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div className="flex-1">
          <h2 className="text-lg font-semibold leading-tight">Welcome, {user.displayName}!</h2>
          {/* <p className="text-sm text-muted-foreground leading-tight">{user.email}</p> */}
        </div>
        <Link href="/trips/new">
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <CheckIfOnTrip />
        <DaysStats />
        <ProgressBar />
        <UpcomingTrips />
      </CardContent>
    </Card>
  );
} 