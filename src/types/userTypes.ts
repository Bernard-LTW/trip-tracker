import { Timestamp } from 'firebase/firestore';

export interface UserPRInfo {
  firstEntryToUK: string; //ISO date string format (YYYY-MM-DD)
  visaType: string;
  indefiniteLeaveDate: string | null;
  notes: string;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp;
  prInfo: UserPRInfo;
}
