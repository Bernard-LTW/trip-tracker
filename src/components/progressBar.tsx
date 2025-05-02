import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { userService } from "@/services/userService";

export default function ProgressBar() {
    const { user } = useAuth();
    const [progress, setProgress] = useState(0);
    const [daysSinceArrival, setDaysSinceArrival] = useState(0);
    const finishNumberOfDay = 2150;
    // const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function updateProgress() {
            if (!user) return;
            const days = await userService.getDaysSinceArrival(user.uid);
            setDaysSinceArrival(days);
            const progress = (days / finishNumberOfDay) * 100;
            setProgress(Math.min(progress, 100)); // Cap at 100%
        }
        updateProgress();
    }, [user]);

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">PR Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress 
                value={progress}
                className="h-2"
            />
            <p className="text-sm text-muted-foreground text-center">
                {daysSinceArrival} days completed of {finishNumberOfDay} days required
            </p>
        </div>
    )
}