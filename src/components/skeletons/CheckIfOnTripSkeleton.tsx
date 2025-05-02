import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";

export function CheckIfOnTripSkeleton() {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 