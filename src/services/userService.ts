import { db } from '@/lib/firebaseConfig';
import { User } from '@/types/userTypes';
import { tripService } from './tripService';
import { 
  collection, 
  doc, 
  getDoc
} from 'firebase/firestore';
import { Trip } from '@/types/tripTypes';


export const userService = {
  async getUser(userId: string): Promise<User> {
    const userRef = doc(collection(db, 'users'), userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return userDoc.data() as User;
  },

  async getArrivalDate(userId: string): Promise<Date | null> {
    try {
      const user = await this.getUser(userId);
      if (!user.prInfo?.firstEntryToUK) {
        return null;
      }
      const date = new Date(user.prInfo.firstEntryToUK);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    } catch (error) {
      console.error('Error getting arrival date:', error);
      return null;
    }
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
      const totalDays = trips.reduce((acc, trip) => {
        const tripStartDate = new Date(trip.startDate);
        const tripEndDate = new Date(trip.endDate);
        if (isNaN(tripStartDate.getTime()) || isNaN(tripEndDate.getTime())) {
          return acc;
        }
        // Add 1 to include both start and end dates
        const days = Math.floor((tripEndDate.getTime() - tripStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return acc + days;
      }, 0);
      return totalDays;
    } catch (error) {
      console.error('Error getting total days on trip:', error);
      throw error;
    }
  },

  async getDaysSinceArrival(userId: string): Promise<number> {
    try {
      const arrivalDate = await this.getArrivalDate(userId);
      if (!arrivalDate) {
        return 0;
      }
      const currentDate = new Date();
      // Add 1 to include both start and end dates
      const daysSinceArrival = Math.floor((currentDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return daysSinceArrival;
    } catch (error) {
      console.error('Error getting days in UK since arrival:', error);
      return 0;
    }
  },
  
  async getDaysSinceVisaApproval(userId: string): Promise<number> {
    try {
      const user = await this.getUser(userId);
      if (!user.prInfo?.visaApprovalDate) {
        return 0;
      }
      const visaApprovalDate = new Date(user.prInfo.visaApprovalDate);
      const currentDate = new Date();
      // Add 1 to include both start and end dates
      const daysSinceVisaApproval = Math.floor((currentDate.getTime() - visaApprovalDate.getTime()) / (1000 * 60 * 60 * 24)) ;
      return daysSinceVisaApproval;
    } catch (error) {
      console.error('Error getting days since visa approval:', error);
      return 0;
    }
  },

  async getDaysSinceVisaApprovalinUK(userId: string): Promise<number> {
    try {
      const user = await this.getUser(userId);
      if (!user.prInfo?.visaApprovalDate) {
        return 0;
      }
      const visaApprovalDate = new Date(user.prInfo.visaApprovalDate);
      const currentDate = new Date();
      const daysSinceVisaApproval = (currentDate.getTime() - visaApprovalDate.getTime()) / (1000 * 60 * 60 * 24);
      const totalDaysOnTrip = await this.getTotalDaysOnTrip(userId);
      const visaArrivalDelta = await this.getVisaArrivalDelta(userId);
      return Math.floor(daysSinceVisaApproval-totalDaysOnTrip-visaArrivalDelta);
    } catch (error) {
      console.error('Error getting days since visa approval:', error);
      return 0;
    }
  },

  async getVisaArrivalDelta(userId: string): Promise<number> {
    try {
      const user = await this.getUser(userId);
      if (!user.prInfo?.visaApprovalDate) {
        return 0;
      }
      const visaApprovalDate = new Date(user.prInfo.visaApprovalDate);
      const arrivalDate = await this.getArrivalDate(userId);
      if (!arrivalDate) {
        return 0;
      }
      // Add 1 to include both start and end dates
      return Math.floor((arrivalDate.getTime() - visaApprovalDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    } catch (error) {
      console.error('Error getting visa arrival delta:', error);
      return 0;
    }
  },

  async getTotalnotinUK(userId: string): Promise<number> {
    try {
      const user = await this.getUser(userId);
      if (!user.prInfo?.visaApprovalDate) {
        return 0;
      }
      const totalDaysOnTrip = await this.getTotalDaysOnTrip(userId);
      const visaArrivalDelta = await this.getVisaArrivalDelta(userId);
      return Math.floor(totalDaysOnTrip+visaArrivalDelta);
    } catch (error) {
      console.error('Error getting total days not in UK:', error);
      return 0;
    }
  },

  async hasPRinfo(userId: string): Promise<boolean> {
    const user = await this.getUser(userId);
    return user.prInfo !== null;
  }
};
