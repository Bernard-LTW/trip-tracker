import { Timestamp } from 'firebase/firestore';

export interface Trip {
  id?: string;  // Optional because it's not needed when creating a new trip
  userId: string;
  title: string;
  description: string;
  country: string;
  startDate: string;  // ISO date string format (YYYY-MM-DD)
  endDate: string;    // ISO date string format (YYYY-MM-DD)
  createdAt: Timestamp;
}
