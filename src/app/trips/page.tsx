'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { tripService } from '@/services/tripService';
import { Trip } from '@/types/tripTypes';

export default function TripsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrips() {
      if (!user) return;
      
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

  if (!user) {
    return <div>Please sign in to view your trips</div>;
  }

  if (loading) {
    return <div>Loading trips...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Trips</h1>
        <button
          onClick={() => router.push('/trips/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No trips found. Start planning your next adventure!</p>
          <button
            onClick={() => router.push('/trips/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <div key={trip.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold">{trip.title}</h2>
              <p className="text-gray-600">{trip.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>Country: {trip.country}</p>
                <p>Dates: {trip.startDate} to {trip.endDate}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 