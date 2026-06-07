// src/utils/seedUsers.js
// Bu dosyayı SADECE BİR KEZ çalıştır, sonra çağrıyı kaldır.

import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const USERS = [
  {
    uid:   "tcBDJ6xrieWagdWNmWnIWQt",
    email: "emrahkarakus@ibis.com.tr",
    name:  "Emrah Karakuş",
    role:  "admin",
  },
  {
    uid:   "TTSUyV1lhfcw5vHVLTKZ1CS5EQt1",
    email: "ferdiasik@ibis.com.tr",
    name:  "Ferdi Aşık",
    role:  "admin",
  },
  {
    uid:   "PDi2cwcDOsWUPPiWOf1KInUgnbr1",
    email: "enecan@ibis.com.tr",
    name:  "Enes Can",
    role:  "staff",
  },
  {
    uid:   "5PhgB7e4SpOFusZsUJ6rJCwuXDc2",
    email: "iremcetinkaya@ibis.com.tr",
    name:  "İrem Çetinkaya",
    role:  "staff",
  },
  {
    uid:   "8wDqPqAa5LPeIODR08EUnYTRllH2",
    email: "pinarturkel@ibis.com.tr",
    name:  "Pınar Türkel",
    role:  "staff",
  },
  {
    uid:   "E3cG38h53FYpH0v0rqEJ7Umfpof2",
    email: "serkanbolek@ibis.com.tr",
    name:  "Serkan Bölek",
    role:  "staff",
  },
  {
    uid:   "Xd6DbHbpX1hXKXOC6SFBUqPzhEx1",
    email: "zeynepguven@ibis.com.tr",
    name:  "Zeynep Güven",
    role:  "staff",
  },
  {
    uid:   "mTfL0zn4qfUeJ6mnSPUKrULCvxg1",
    email: "ayephokho@ibis.com.tr",
    name:  "Aye Phokho",
    role:  "staff",
  },
  {
    uid:   "f8SD2kFou4YLsMCrR9lW7ZCIzgn1",
    email: "zinmyohtet@ibis.com.tr",
    name:  "Zin Myo Htet",
    role:  "staff",
  },
];

export async function seedUsers() {
  console.log("Kullanıcılar oluşturuluyor...");
  for (const user of USERS) {
    await setDoc(doc(db, "users", user.uid), {
      email:     user.email,
      name:      user.name,
      role:      user.role,
      createdAt: serverTimestamp(),
    });
    console.log("✅", user.email);
  }
  console.log("Tamamlandı!");
}
