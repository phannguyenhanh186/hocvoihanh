import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import type { StateStorage } from "zustand/middleware";
import { db } from "./firebase";
import { setFirestoreError } from "./firestoreStatus";

// The whole app's data lives in ONE Firestore document. This app has no
// teacher accounts/multi-tenant model, so one shared document is the
// simplest thing that makes data visible across devices (teacher's laptop,
// student's phone, etc.) instead of stuck in one browser's localStorage.
//
// Trade-off: since there's no login, Firestore Security Rules can't check
// "is this the teacher?" — see FIREBASE_SETUP.md for the rules used and
// what they do (and don't) protect against.
const DOC_REF = () => doc(db, "app_state", "shared");

const RULES_HINT =
  "Chưa thể kết nối Firebase — kiểm tra đã publish Security Rules theo hướng dẫn trong FIREBASE_SETUP.md chưa. Dữ liệu hiện KHÔNG được lưu, sẽ mất khi tải lại trang.";

export const firestoreStorage: StateStorage = {
  getItem: async () => {
    try {
      const snap = await getDoc(DOC_REF());
      setFirestoreError(null);
      return snap.exists() ? JSON.stringify(snap.data()) : null;
    } catch (err) {
      console.error("[firestoreStorage] getItem failed:", err);
      setFirestoreError(RULES_HINT);
      return null;
    }
  },
  setItem: async (_name, value) => {
    try {
      await setDoc(DOC_REF(), JSON.parse(value));
      setFirestoreError(null);
    } catch (err) {
      console.error("[firestoreStorage] setItem failed:", err);
      setFirestoreError(RULES_HINT);
    }
  },
  removeItem: async () => {
    try {
      await deleteDoc(DOC_REF());
      setFirestoreError(null);
    } catch (err) {
      console.error("[firestoreStorage] removeItem failed:", err);
      setFirestoreError(RULES_HINT);
    }
  },
};
