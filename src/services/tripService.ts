import { db } from '@/lib/firebaseConfig';
import { Trip } from '@/types/tripTypes';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';

export const tripService = {
  // Get all trips for a user
  async getUserTrips(userId: string): Promise<Trip[]> {
    try {
      const tripsQuery = query(
        collection(db, 'trips'),
        where('userId', '==', userId),
        orderBy('startDate', 'desc')
      );
      const snapshot = await getDocs(tripsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
    } catch (error) {
      console.error('Error fetching user trips:', error);
      throw error;
    }
  },

  // Get a single trip by ID
  async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const tripDoc = await getDoc(doc(db, 'trips', tripId));
      if (!tripDoc.exists()) return null;
      return { id: tripDoc.id, ...tripDoc.data() } as Trip;
    } catch (error) {
      console.error('Error fetching trip:', error);
      throw error;
    }
  },

  // Create a new trip
  async createTrip(trip: Omit<Trip, 'id'>): Promise<string> {
    try {
      const tripRef = doc(collection(db, 'trips'));
      await setDoc(tripRef, trip);
      return tripRef.id;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },

  // Update a trip
  async updateTrip(tripId: string, data: Partial<Trip>): Promise<void> {
    try {
      await updateDoc(doc(db, 'trips', tripId), data);
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  // Delete a trip
  async deleteTrip(tripId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'trips', tripId));
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }
}; 