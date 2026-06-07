// ============================================================
// src/utils/seedUsers.js
//
// Bu dosyayı SADECE BİR KEZ çalıştır:
//   Firebase Auth'da kullanıcıları oluşturduktan sonra,
//   her kullanıcının UID'sini Firebase Console'dan al ve
//   aşağıdaki listeye yapıştır. Ardından App.jsx'te
//   seedUsers() fonksiyonunu çağır, çıktıyı gör, sonra sil.
//
// Run this file ONLY ONCE:
//   After creating users in Firebase Auth, get each UID from
//   Firebase Console → Authentication → Users → copy the UID
//   column. Paste below, call seedUsers() from App.jsx once,
//   verify in Firestore, then remove the call.
// ============================================================

import { db }          from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// UID'leri Firebase Console → Authentication → Users'dan al
// Get UIDs from Firebase Console → Authentication → Users tab
const USERS = [
  {
    uid:   "PASTE_UID_FOR_emrahkarakus",   // ← Firebase Console'dan kopyala
    email: "emrahkarakus@ibis.com.tr",
    name:  "Emrah Karakuş",
    role:  "admin",
  },
  {
    uid:   "PASTE_UID_FOR_ferdiasik",
    email: "ferdiasik@ibis.com.tr",
    name:  "Ferdi Aşık",
    role:  "admin",
  },
  {
    uid:   "PASTE_UID_FOR_enecan",
    email: "enecan@ibis.com.tr",
    name:  "Enes Can",
    role:  "staff",
  },
  {
    uid:   "PASTE_UID_FOR_iremcetinkaya",
    email: "iremcetinkaya@ibis.com.tr",
    name:  "İrem Çetinkaya",
    role:  "staff",
  },
  {
    uid:   "PASTE_UID_FOR_pinarturkel",
    email: "pinarturkel@ibis.com.tr",
    name:  "Pınar Türkel",
    role:  "staff",
  },
  {
    uid:   "PASTE_UID_FOR_serkanbolek",
    email: "serkanbolek@ibis.com.tr",
    name:  "Serkan Bölek",
    role:  "staff",
  },
  {
    uid:   "PASTE_UID_FOR_zeynepguven",
    email: "zeynepguven@ibis.com.tr",
    name:  "Zeynep Güven",
    role:  "staff",
  },
  {
    uid:   "PASTE_UID_FOR_ayephokho",
    email: "ayephokho@ibis.com.tr",
    name:  "Aye Phokho",
    role:  "staff",
  },
  {
    uid:   "PASTE_UID_FOR_zinmyohtet",
    email: "zinmyohtet@ibis.com.tr",
    name:  "Zin Myo Htet",
    role:  "staff",
  },
];

/**
 * Tüm kullanıcıları Firestore'a yazar.
 * Writes all user role documents to Firestore.
 *
 * KULLANIM / USAGE — App.jsx içinde bir kez çağır:
 *
 *   import { seedUsers } from "./utils/seedUsers";
 *   // App() fonksiyonunun içinde, sadece admin olarak giriş yapınca:
 *   useEffect(() => {
 *     if (isAdmin) seedUsers();
 *   }, [isAdmin]);
 *
 *   // Firestore'da users/{uid} belgelerini gördükten sonra bu kodu sil.
 */
export async function seedUsers() {
  console.log("🌱 Kullanıcılar oluşturuluyor / Seeding users...");

  for (const user of USERS) {
    if (user.uid.startsWith("PASTE_UID")) {
      console.warn(`⚠ UID girilmemiş / UID not set for: ${user.email}`);
      continue;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        email:     user.email,
        name:      user.name,
        role:      user.role,
        createdAt: serverTimestamp(),
      });
      console.log(`✅ ${user.role.padEnd(5)} → ${user.email}`);
    } catch (err) {
      console.error(`❌ ${user.email}:`, err.message);
    }
  }

  console.log("✅ Tamamlandı / Seeding complete! Bu kodu artık kaldırabilirsin.");
}
