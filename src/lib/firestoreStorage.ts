import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import type { StateStorage } from "zustand/middleware";
import { db } from "./firebase";

// The whole app's data lives in ONE Firestore document. This app has no
// teacher accounts/multi-tenant model, so one shared document is the
// simplest thing that makes data visible across devices (teacher's laptop,
// student's phone, etc.) instead of stuck in one browser's localStorage.
//
// Trade-off: since there's no login, Firestore Security Rules can't check
// "is this the teacher?" — see FIREBASE_SETUP.md for the rules used and
// what they do (and don't) protect against.
const DOC_REF = () => doc(db, "app_state", "shared");

export const firestoreStorage: StateStorage = {
  getItem: async () => {
    try {
      const snap = await getDoc(DOC_REF());
      return snap.exists() ? JSON.stringify(snap.data()) : null;
    } catch (err) {
      console.error("[firestoreStorage] getItem failed:", err);
      return null;
    }
  },
  setItem: async (_name, value) => {
    try {
      await setDoc(DOC_REF(), JSON.parse(value));
    } catch (err) {
      console.error("[firestoreStorage] setItem failed:", err);
    }
  },
  removeItem: async () => {
    try {
      await deleteDoc(DOC_REF());
    } catch (err) {
      console.error("[firestoreStorage] removeItem failed:", err);
    }
  },
};
