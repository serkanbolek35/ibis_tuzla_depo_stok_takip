# Firebase Setup Guide — İbis Tuzla Stock Management

## PART 1 — CREATE FIREBASE PROJECT

1. Go to https://console.firebase.google.com → "Add project" → name it `ibis-tuzla-stock`
2. Authentication → Get started → Email/Password → Enable
3. Create 9 user accounts (emails + passwords) in Authentication → Users
4. Firestore → Create database → Production mode → region: europe-west1
5. Project Settings (gear icon) → Your apps → Web (</>) → Copy firebaseConfig

## PART 2 — ENVIRONMENT VARIABLES (Security)

### File: `.env` (project root — NEVER commit this)
```
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=ibis-tuzla-stock.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ibis-tuzla-stock
VITE_FIREBASE_STORAGE_BUCKET=ibis-tuzla-stock.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxx
```

### File: `.gitignore` (must include):
```
node_modules/
dist/
.env
.env.local
.env.development
.env.production
.DS_Store
```

### File: `src/firebase.js`
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
```

## PART 3 — FIRESTORE COLLECTIONS

### users/{uid}
{ email, name, role: "admin"|"staff", createdAt }

### depot_stock/{itemId}
{ itemId, name, nameEn, category, categoryEn, qty, minAlert: 20, lastUpdated, lastUpdatedBy }

### location_stock/{location_itemId}
{ location: "market"|"bar"|"restaurant", itemId, qty, lastUpdated }

### reports/{auto-id}
{ shiftDate: "YYYY-MM-DD", submittedAt, submittedBy, submittedByName,
  isNightShift: bool, transfers: [{itemId, name, qty, location}], note }

### stock_entries/{auto-id}  (audit log)
{ itemId, qtyAdded, addedBy, addedAt, note }

## PART 4 — FIRESTORE SECURITY RULES

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    function isAuth() { return request.auth != null; }

    match /users/{uid} {
      allow read: if request.auth.uid == uid || isAdmin();
      allow write: if isAdmin();
    }
    match /depot_stock/{itemId} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }
    match /location_stock/{id} {
      allow read, write: if isAuth();
    }
    match /reports/{id} {
      allow read: if isAdmin() || (isAuth() && resource.data.submittedBy == request.auth.uid);
      allow create: if isAuth();
      allow update, delete: if isAdmin();
    }
    match /stock_entries/{id} {
      allow read, write: if isAdmin();
    }
  }
}
```

## PART 5 — NIGHT SHIFT RULE

```javascript
// src/utils/shiftDate.js
export function getShiftDate(now = new Date()) {
  const base = new Date(now);
  if (now.getHours() < 6) base.setDate(base.getDate() - 1);
  return base.toISOString().split("T")[0]; // "YYYY-MM-DD"
}
// 06/06/2026 02:00 → "2026-06-05"  ✓
// 06/06/2026 08:00 → "2026-06-06"  ✓
```

## PART 6 — USER SEEDING SCRIPT

After creating Auth accounts, get UIDs from Firebase Console → Authentication → Users,
then run this once to write role documents:

```javascript
// src/utils/seedUsers.js
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const USERS = [
  { uid: "PASTE_UID_1", email: "emrahkarakus@ibis.com.tr",   name: "Emrah Karakuş",  role: "admin" },
  { uid: "PASTE_UID_2", email: "ferdiasik@ibis.com.tr",      name: "Ferdi Aşık",     role: "admin" },
  { uid: "PASTE_UID_3", email: "enecan@ibis.com.tr",         name: "Enes Can",        role: "staff" },
  { uid: "PASTE_UID_4", email: "iremcetinkaya@ibis.com.tr",  name: "İrem Çetinkaya", role: "staff" },
  { uid: "PASTE_UID_5", email: "pinarturkel@ibis.com.tr",    name: "Pınar Türkel",   role: "staff" },
  { uid: "PASTE_UID_6", email: "serkanbolek@ibis.com.tr",    name: "Serkan Bölek",   role: "staff" },
  { uid: "PASTE_UID_7", email: "zeynepguven@ibis.com.tr",    name: "Zeynep Güven",   role: "staff" },
  { uid: "PASTE_UID_8", email: "ayephokho@ibis.com.tr",      name: "Aye Phokho",     role: "staff" },
  { uid: "PASTE_UID_9", email: "zinmyohtet@ibis.com.tr",     name: "Zin Myo Htet",   role: "staff" },
];

export async function seedUsers() {
  for (const u of USERS) {
    await setDoc(doc(db, "users", u.uid), { ...u, createdAt: serverTimestamp() });
    console.log("✓", u.email);
  }
}
// Call seedUsers() from your App.jsx once, then remove the call.
```

## PART 7 — GITHUB CHECKLIST
```bash
git status        # .env must NOT appear
npm run build     # must succeed
git add .
git commit -m "Initial commit"
git push origin main
```
For Vercel/Netlify: add VITE_ env vars in the platform dashboard.
