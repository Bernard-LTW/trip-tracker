import { db } from '@/lib/firebaseConfig';
import { User } from '@/types/userTypes';
import { tripService } from './tripService';
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
import { Trip } from '@/types/tripTypes';

export const userService = {
  async getUser(userId: string): Promise<User> {
    const userRef = doc(collection(db, 'users'), userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data() as User;
  },

  async getArrivalDate(userId: string): Promise<Date> {
    const user = await this.getUser(userId);
    return new Date(user.prInfo.firstEntryToUK);
  },
  // Get user by email
  async getCurrentTrip(userId: string): Promise<Trip | null> {
    try {
      const userRef = doc(collection(db, 'users'), userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }     

      // Check if the user is on any trip
      const trips = await tripService.getUserTrips(userId);
      const currentDate = new Date();
      return trips.find(trip => currentDate >= new Date(trip.startDate) && currentDate <= new Date(trip.endDate)) || null;
    } catch (error) {
      console.error('Error getting current trip:', error);
      throw error;
    }
  },

  async getTotalDaysOnTrip(userId: string): Promise<number> {
    try {
      const trips = await tripService.getUserTrips(userId);
      const currentDate = new Date();
      const totalDays = trips.reduce((acc, trip) => {
        const tripStartDate = new Date(trip.startDate);
        const tripEndDate = new Date(trip.endDate);
        const days = (tripEndDate.getTime() - tripStartDate.getTime()) / (1000 * 60 * 60 * 24);
        return acc + days;
      }, 0);
      return totalDays;
    } catch (error) {
      console.error('Error getting total days on trip:', error);
      throw error;
    }
  },

  async getDaysSinceArrival(userId: string): Promise<number> {

    try{
    const user = await this.getUser(userId);
    const arrivalDate = new Date(user.prInfo.firstEntryToUK);
    const currentDate = new Date();
    const daysSinceArrival = (currentDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor(daysSinceArrival);
    } catch (error) {
      console.error('Error getting days in UK since arrival:', error);
      throw error;
    }
  },

  async getDaysSinceArrivalinUK(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    const arrivalDate = new Date(user.prInfo.firstEntryToUK);
    const currentDate = new Date();
    const totalDaysOnTrip = await this.getTotalDaysOnTrip(userId);
    const daysSinceArrival = (currentDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24)-totalDaysOnTrip;
    return daysSinceArrival;
  }
  
};


