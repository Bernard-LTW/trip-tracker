'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { tripService } from '@/services/tripService';
import { Trip } from '@/types/tripTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, PlusIcon, PencilIcon } from 'lucide-react';
import { format, isWithinInterval, isAfter, isBefore } from 'date-fns';

interface GroupedTrips {
  [key: string]: Trip[];
}

export default function TripsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrips() {
      if (!user) return router.push('/');
      
      try {
        setLoading(true);
        const userTrips = await tripService.getUserTrips(user.uid);
        setTrips(userTrips);
      } catch (err) {
        setError('Failed to load trips');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, [user]);

  const now = new Date();

  const currentTrips = trips.filter(trip => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    return isWithinInterval(now, { start: startDate, end: endDate });
  });

  const upcomingTrips = trips.filter(trip => {
    const startDate = new Date(trip.startDate);
    return isAfter(startDate, now);
  });

  const pastTrips = trips.filter(trip => {
    const endDate = new Date(trip.endDate);
    return isBefore(endDate, now);
  });

  const groupTripsByMonth = (trips: Trip[]): GroupedTrips => {
    return trips.reduce((groups: GroupedTrips, trip) => {
      const date = new Date(trip.startDate);
      const monthYear = format(date, 'MMMM yyyy');
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(trip);
      return groups;
    }, {});
  };

  const renderTripCard = (trip: Trip) => (
    <Card key={trip.id} className="hover:shadow-lg transition-shadow mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1 flex items-center gap-2">
            {trip.emoji && <span className="text-xl">{trip.emoji}</span>}
            {trip.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/trips/edit/${trip.id}`)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <CardDescription className="line-clamp-2 italic">{trip.description ? trip.description : 'No description'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
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
      </CardContent>
    </Card>
  );

  const renderTripSection = (title: string, trips: Trip[], grouped: boolean = false) => {
    if (trips.length === 0) return null;

    if (grouped) {
      const groupedTrips = groupTripsByMonth(trips);
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedTrips).map(([monthYear, monthTrips]) => (
              <div key={monthYear} className="space-y-4">
                <h3 className="text-xl font-semibold text-muted-foreground">{monthYear}</h3>
                <div className="grid gap-4">
                  {monthTrips.map(renderTripCard)}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map(renderTripCard)}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Please sign in to view your trips</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl pt-8 h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Trips</h1>
          <p className="text-muted-foreground mt-1">Track and manage your travels</p>
        </div>
        <Button onClick={() => router.push('/trips/new')} className="gap-2">
          <PlusIcon className="h-4 w-4" />
          New Trip
        </Button>
      </div>

      {trips.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">No trips found. Start planning your next adventure!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-12">
          <div className="overflow-y-auto max-h-[calc(100vh-14rem)]">
            {renderTripSection('Current Trips', currentTrips)}
            {renderTripSection('Upcoming Trips', upcomingTrips)}
            {renderTripSection('Past Trips', pastTrips, true)}
          </div>
        </div>
      )}
    </div>
  );
} 