import { Timestamp } from 'firebase/firestore';

export interface Trip {
  userId: string;
  title: string;
  description: string;
  country: string;
  startDate: string;  // ISO date string format (YYYY-MM-DD)
  endDate: string;    // ISO date string format (YYYY-MM-DD)
  createdAt: Timestamp;
}
