// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsm6BC3QzeQ5bCou2l474xO-CfedQsfFY",
  authDomain: "trip-tracker-cac70.firebaseapp.com",
  projectId: "trip-tracker-cac70",
  storageBucket: "trip-tracker-cac70.firebasestorage.app",
  messagingSenderId: "995996851223",
  appId: "1:995996851223:web:f258940e6dcecd1e849052"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);