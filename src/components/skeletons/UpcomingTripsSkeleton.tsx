import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";

export function UpcomingTripsSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 