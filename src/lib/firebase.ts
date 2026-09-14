import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Safe to keep in the frontend bundle — this identifies the project, it
// does not grant access by itself. Access is controlled by Firestore/
// Storage Security Rules (see FIREBASE_SETUP.md).
const firebaseConfig = {
  apiKey: "AIzaSyBMtXpIAPEzBkwIjfvCayj7irywmoSj8z8",
  authDomain: "hocvoihanh-1806.firebaseapp.com",
  projectId: "hocvoihanh-1806",
  storageBucket: "hocvoihanh-1806.firebasestorage.app",
  messagingSenderId: "943470300091",
  appId: "1:943470300091:web:0343b8d80febbdddf8529e",
  measurementId: "G-W6SGFBYV3W",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
