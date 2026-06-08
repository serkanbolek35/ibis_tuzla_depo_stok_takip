import { initializeApp } from "firebase/app";
import { getAuth }        from "firebase/auth";
import { getFirestore }   from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyDPOKGJVvGhX3tkK6-2SKmMbY8AsHdlRcc",
  authDomain:        "ibis-tuzla-stock.firebaseapp.com",
  projectId:         "ibis-tuzla-stock",
  storageBucket:     "ibis-tuzla-stock.firebasestorage.app",
  messagingSenderId: "952788280577",
  appId:             "1:952788280577:web:ff58967cb9b1a36bc6a700",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;