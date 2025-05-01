import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

export interface UserPRInfo {
  firstEntryToUK: string;
  visaType: string;
  indefiniteLeaveDate: string | null;
  notes: string;
}

export interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  prInfo: UserPRInfo;
}

export async function createOrUpdateUser(userId: string, userData: Partial<UserData>) {
  const userRef = doc(db, 'users', userId);
  
  try {
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(userRef, {
        ...userData,
        createdAt: Timestamp.now(),
        prInfo: {
          firstEntryToUK: '',
          visaType: '',
          indefiniteLeaveDate: null,
          notes: '',
          ...userData.prInfo
        }
      });
    } else {
      // Update existing user document
      await setDoc(userRef, {
        ...userData,
        prInfo: {
          ...userDoc.data().prInfo,
          ...userData.prInfo
        }
      }, { merge: true });
    }
    
    return true;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

export async function getUserData(userId: string): Promise<UserData | null> {
  const userRef = doc(db, 'users', userId);
  
  try {
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
} 