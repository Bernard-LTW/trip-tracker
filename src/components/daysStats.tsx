import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, PlaneIcon } from "lucide-react";

export default function DaysStats() {
    const { user } = useAuth();
    const [daysInUK, setDaysInUK] = useState(0);
    const [daysAbroad, setDaysAbroad] = useState(0);

    useEffect(() => {
        async function updateStats() {
            if (!user) return;
            try {
                const ukDays = await userService.getDaysSinceVisaApprovalinUK(user.uid);
                const abroadDays = await userService.getTotalnotinUK(user.uid);
                // const date = await userService.getArrivalDate(user.uid);
                setDaysInUK(Math.round(ukDays));
                setDaysAbroad(Math.round(abroadDays));
                // setArrivalDate(date.toISOString().split('T')[0]);
            } catch (error) {
                console.error('Error fetching days stats:', error);
            }
        }
        updateStats();
    }, [user]);

    if (!user) return null;

    return (
        <div className="space-y-1">

            <div className="flex gap-">
                <Card className="flex-1 border-none shadow-none">
                    <CardContent className="p-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100">
                                <HomeIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Days in UK</p>
                                <p className="text-2xl font-bold">{daysInUK}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="w-px h-full bg-black" />
                <Card className="flex-1 border-none shadow-none">
                    <CardContent className="p-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-purple-100">
                                <PlaneIcon className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Days Abroad</p>
                                <p className="text-2xl font-bold">{daysAbroad}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* <p className="text-sm text-muted-foreground italic text-center">since {arrivalDate}</p> */}
        </div>
    );
}
