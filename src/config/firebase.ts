import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzaC5bsp6AKnOiGhvb9XwL5fRCKBYRRC0",
  authDomain: "set-sync-7667f.firebaseapp.com",
  projectId: "set-sync-7667f",
  storageBucket: "set-sync-7667f.firebasestorage.app",
  messagingSenderId: "139680758970",
  appId: "1:139680758970:web:6ef9aea3394b62ec641683",
  measurementId: "G-2F2HT67NXE",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = firebaseConfig.appId;
