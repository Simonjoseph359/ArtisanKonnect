import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

export const firebaseConfig = {
  apiKey: "AIzaSyAeC3EadOOjb1oej_IsqhpH2BXeoG_7DTc",
  authDomain: "artisankonnect-7e027.firebaseapp.com",
  projectId: "artisankonnect-7e027",
  storageBucket: "artisankonnect-7e027.firebasestorage.app",
  messagingSenderId: "457291138128",
  appId: "1:457291138128:web:c09dddde8478aedbf2fd55"
};

// Initialize Firebase app instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app); 

