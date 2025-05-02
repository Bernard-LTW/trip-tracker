import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <Card className="w-[min(600px,100vw)] border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-3 py-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
} 