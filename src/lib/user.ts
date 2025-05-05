import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { User } from '@/types/userTypes';


export async function createOrUpdateUser(userId: string, userData: Partial<User>) {
  const userRef = doc(db, 'users', userId);
  
  try {
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(userRef, {
        ...userData,
        createdAt: Timestamp.now(),
        prInfo: userData.prInfo || null
      });
    } else {
      // Update existing user document
      const existingData = userDoc.data();
      await setDoc(userRef, {
        ...userData,
        prInfo: userData.prInfo === undefined 
          ? existingData.prInfo 
          : userData.prInfo
      }, { merge: true });
    }
    
    return true;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

export async function getUserData(userId: string): Promise<User | null> {
  const userRef = doc(db, 'users', userId);
  
  try {
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) { 
      return userDoc.data() as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
} 