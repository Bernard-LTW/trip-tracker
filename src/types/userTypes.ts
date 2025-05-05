import { Timestamp } from 'firebase/firestore';

export const Buffer = {
  'No Buffer': 0,
  'Little': 7,
  'Cautious': 14,
  'Safe': 30
} as const;

export type Buffer = typeof Buffer[keyof typeof Buffer];

export interface UserPRInfo {
  visaApprovalDate: string; //ISO date string format (YYYY-MM-DD)
  firstEntryToUK: string; //ISO date string format (YYYY-MM-DD)
  buffer: Buffer;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp;
  prInfo: UserPRInfo;
}
