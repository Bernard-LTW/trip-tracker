'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="h-6 w-6" />
            <span>You're Offline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            It looks like you've lost your internet connection. Some features may be limited until you're back online.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => window.location.reload()}
              variant="default"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 