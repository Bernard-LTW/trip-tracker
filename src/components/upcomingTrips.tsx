import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/tripService";
import { Trip } from "@/types/tripTypes";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon, MapPinIcon } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { Button } from "./ui/button";

export default function UpcomingTrips() {
    const { user } = useAuth();
    const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        async function loadUpcomingTrips() {
            if (!user) return;
            try {
                const trips = await tripService.getUpcomingTrips(user.uid);
                setUpcomingTrips(trips);
            } catch (error) {
                console.error('Error fetching upcoming trips:', error);
            }
        }
        loadUpcomingTrips();
    }, [user]);

    if (!user || upcomingTrips.length === 0) return null;

    return (
        <Card>
            <CardContent className="px-1">
                <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center p-0 h-auto hover:bg-transparent"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-lg font-medium">Upcoming Trips({upcomingTrips.length})</span>
                    </div>
                    {isExpanded ? (
                        <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                </Button>

                {isExpanded && (
                    <div className="mt-4 space-y-3">
                        {upcomingTrips.map((trip) => {
                            const daysUntil = differenceInCalendarDays(new Date(trip.startDate), new Date());
                            return (
                                <div
                                    key={trip.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                                >
                                    <div className="flex flex-col items-center justify-center min-w-[56px]">
                                        <span className="text-3xl font-bold leading-none">{daysUntil}</span>
                                        <span className="text-xs text-muted-foreground uppercase tracking-widest">days</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">
                                            <span className="mr-1">{trip.emoji}</span>{trip.title}
                                        </p>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <div className="flex items-center gap-2">
                                                <MapPinIcon className="h-4 w-4" />
                                                <span>{trip.country}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4" />
                                                <span>
                                                    {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
