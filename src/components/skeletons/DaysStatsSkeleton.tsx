import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";

export function DaysStatsSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 