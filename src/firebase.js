// ============================================================
// src/firebase.js
// Firebase'i başlat — tüm değerler .env dosyasından gelir
// Firebase initialization — all values come from .env
// ============================================================
//
// KURULUM / SETUP:
//   1. Proje kök dizininde .env dosyası oluştur
//   2. Aşağıdaki değişkenleri Firebase Console'dan kopyala
//   3. .gitignore içinde .env satırının olduğuna emin ol
//
// SETUP:
//   1. Create .env in project root
//   2. Copy values from Firebase Console → Project Settings → Your apps
//   3. Confirm .env is listed in .gitignore before pushing to GitHub
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth }        from "firebase/auth";
import { getFirestore }   from "firebase/firestore";

// Tüm değerler .env dosyasından okunur — kaynak kodda asla hardcode etme
// All values read from .env — never hardcode these in source code
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Eksik değişken kontrolü — geliştirme sırasında erken uyarı
// Missing variable check — catches .env mistakes early
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length > 0) {
  console.error(
    "❌ Firebase: Eksik .env değişkenleri / Missing .env variables:\n" +
    missing.map(k => `   VITE_${k.replace(/([A-Z])/g, "_$1").toUpperCase()}`).join("\n")
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
