import { Timestamp } from 'firebase/firestore';

export interface UserPRInfo {
  visaApprovalDate: string; //ISO date string format (YYYY-MM-DD)
  firstEntryToUK: string; //ISO date string format (YYYY-MM-DD)
  visaType: string;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp;
  prInfo: UserPRInfo;
}
