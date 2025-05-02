import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/tripService";
import { Trip } from "@/types/tripTypes";
import { Card, CardContent } from '@/components/ui/card';
import { MapPinIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

export default function CheckIfOnTrip() {
    const { user } = useAuth();
    const [isOnTrip, setIsOnTrip] = useState(false);
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

    useEffect(() => {
        async function checkTripStatus() {
            if (!user) return;

            try {
                const trips = await tripService.getUserTrips(user.uid);
                const now = new Date();
                const activeTrip = trips.find(trip => {
                    const startDate = new Date(trip.startDate);
                    const endDate = new Date(trip.endDate);
                    return now >= startDate && now <= endDate;
                });

                setIsOnTrip(!!activeTrip);
                setCurrentTrip(activeTrip || null);
            } catch (error) {
                console.error('Error checking trip status:', error);
            }
        }

        checkTripStatus();
    }, [user]);

    if (!user) return null;

    return (
        <Card className={cn(
            "border",
            isOnTrip ? "bg-green-500/10 dark:bg-green-500/20" : "bg-muted"
        )}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-full",
                        isOnTrip ? "bg-green-500/20 dark:bg-green-500/30" : "bg-muted-foreground/20"
                    )}>
                        <MapPinIcon className={cn(
                            "h-5 w-5",
                            isOnTrip ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                        )} />
                    </div>
                    <div>
                        <p className={cn(
                            "font-medium",
                            isOnTrip ? "text-green-700 dark:text-green-300" : "text-foreground"
                        )}>
                            {isOnTrip ? (
                                <>
                                    Currently in {currentTrip?.emoji} {currentTrip?.country}
                                    <span className={cn(
                                        "block text-sm mt-1",
                                        "text-green-600 dark:text-green-400"
                                    )}>
                                        Until {format(new Date(currentTrip!.endDate), 'MMM d, yyyy')}
                                    </span>
                                </>
                            ) : (
                                "Not currently on a trip"
                            )}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}