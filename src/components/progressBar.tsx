import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { userService } from "@/services/userService";

export default function ProgressBar() {
    const { user } = useAuth();
    const [progress, setProgress] = useState(0);
    const finishNumberOfDay = 2150;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function updateProgress() {
            if (!user) return;
            const daysSinceArrival = await userService.getDaysSinceArrival(user.uid);
            const progress = (daysSinceArrival / finishNumberOfDay) * 100;
            setProgress(progress);
        }
        updateProgress();
    }, [user]);
    return (
        <Progress 
            value={progress}
            className="w-full"
        />
    )
}