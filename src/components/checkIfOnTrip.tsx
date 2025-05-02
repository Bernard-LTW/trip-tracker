import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/tripService";
import { Trip } from "@/types/tripTypes";
import { Card, CardContent } from '@/components/ui/card';
import { MapPinIcon } from 'lucide-react';
import { format } from 'date-fns';

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
        <Card className={isOnTrip ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isOnTrip ? "bg-green-100" : "bg-gray-100"}`}>
                        <MapPinIcon className={`h-5 w-5 ${isOnTrip ? "text-green-600" : "text-gray-600"}`} />
                    </div>
                    <div>
                        <p className={`font-medium ${isOnTrip ? "text-green-800" : "text-gray-800"}`}>
                            {isOnTrip ? (
                                <>
                                    Currently in {currentTrip?.emoji} {currentTrip?.country}
                                    <span className="block text-sm text-green-600 mt-1">
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