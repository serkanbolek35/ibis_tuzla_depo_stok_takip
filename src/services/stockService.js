// ============================================================
// src/services/stockService.js
// Tüm Firestore yazma işlemleri / All Firestore write operations
// ============================================================

import {
  doc, getDoc, setDoc, updateDoc, addDoc,
  collection, serverTimestamp, increment,
} from "firebase/firestore";
import { db }           from "../firebase";
import { getShiftDate } from "../utils/shiftDate";

// ─────────────────────────────────────────────────────────────
// KULLANICI / USER
// ─────────────────────────────────────────────────────────────

/**
 * Kullanıcı belgesini Firestore'dan getirir.
 * Fetches user document from Firestore.
 */
export async function getUser(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// ─────────────────────────────────────────────────────────────
// DEPO STOK / DEPOT STOCK
// ─────────────────────────────────────────────────────────────

/**
 * Depoya yeni sevkiyat ekler (+). Mevcut stoka ekleme yapar.
 * Admin: Adds incoming shipment (+). ADDS to existing stock.
 *
 * @param {string} itemId  - Ürün ID
 * @param {number} qty     - Eklenecek miktar (pozitif)
 * @param {string} userId  - İşlemi yapan admin UID
 * @param {string} note    - İsteğe bağlı sevkiyat notu
 */
export async function addDepotStock(itemId, qty, userId, note = "") {
  if (qty <= 0) throw new Error("Miktar pozitif olmalı / Quantity must be positive");

  // Mevcut stoka ekle / Add to existing stock
  await updateDoc(doc(db, "depot_stock", itemId), {
    qty:           increment(qty),
    lastUpdated:   serverTimestamp(),
    lastUpdatedBy: userId,
  });

  // Denetim kaydı oluştur / Create audit log entry
  await addDoc(collection(db, "stock_entries"), {
    itemId,
    qtyAdded:  qty,
    addedBy:   userId,
    addedAt:   serverTimestamp(),
    note,
  });
}

/**
 * Stoku manuel olarak ayarlar (üzerine yazar).
 * Admin: Manually sets stock to exact value (overwrite).
 *
 * @param {string} itemId  - Ürün ID
 * @param {number} newQty  - Yeni kesin miktar
 * @param {string} userId  - İşlemi yapan admin UID
 */
export async function setDepotStock(itemId, newQty, userId) {
  if (newQty < 0) throw new Error("Stok negatif olamaz / Stock cannot be negative");

  await setDoc(doc(db, "depot_stock", itemId), {
    qty:           newQty,
    lastUpdated:   serverTimestamp(),
    lastUpdatedBy: userId,
  }, { merge: true }); // itemId, name gibi alanları korur
}

/**
 * Eğer ürün henüz Firestore'da yoksa oluşturur.
 * Creates a depot stock document if it doesn't exist yet.
 * Uygulama ilk açıldığında admin için çalışır.
 */
export async function initDepotItem(product) {
  const ref  = doc(db, "depot_stock", product.id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      itemId:      product.id,
      name:        product.name,
      nameEn:      product.nameEn,
      category:    product.cat,
      categoryEn:  product.catEn,
      qty:         0,
      minAlert:    20,
      lastUpdated: serverTimestamp(),
      lastUpdatedBy: "system-init",
    });
  }
}

// ─────────────────────────────────────────────────────────────
// TRANSFER RAPORU / TRANSFER REPORT
// ─────────────────────────────────────────────────────────────

/**
 * Personelin ikmal raporunu kaydeder.
 * Staff: Saves a restock transfer report.
 *
 * Gece yarısı kuralı burada uygulanır:
 * Night shift rule applied here — shiftDate may be previous day.
 *
 * @param {Array}  transfers   - [{ itemId, name, nameEn, qty, location }]
 * @param {string} userId      - Personelin UID'si
 * @param {string} userName    - Personelin adı
 * @param {string} note        - İsteğe bağlı not
 */
export async function submitTransferReport(transfers, userId, userName, note = "") {
  const now       = new Date();
  const shiftDate = getShiftDate(now);   // ← Gece yarısı kuralı / Night shift rule
  const isNight   = now.getHours() < 6;

  // 1. Raporu kaydet / Save the report
  await addDoc(collection(db, "reports"), {
    shiftDate,                        // Vardiya tarihi (düzeltilmiş)
    submittedAt:     serverTimestamp(), // Gerçek gönderim saati
    submittedBy:     userId,
    submittedByName: userName,
    isNightShift:    isNight,
    transfers,
    note,
  });

  // 2. Depodan düş / Deduct from depot
  // ÜRETİMDE: atomiklik için Firestore batch veya Cloud Function kullan
  // PRODUCTION: use Firestore WriteBatch or Cloud Function for atomicity
  for (const tr of transfers) {
    if (tr.qty > 0) {
      await updateDoc(doc(db, "depot_stock", tr.itemId), {
        qty:         increment(-tr.qty),
        lastUpdated: serverTimestamp(),
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────
// ÜRETİM İYİLEŞTİRMESİ: ATOMIK BATCH
// PRODUCTION IMPROVEMENT: ATOMIC BATCH WRITE
// ─────────────────────────────────────────────────────────────
// Aşağıdaki sürüm WriteBatch kullanarak tüm yazmaları atomik yapar.
// The version below uses WriteBatch to make all writes atomic.
// Eğer network kesilirse hiçbir yazma yarım kalmaz.
// If network drops, no write is left half-done.
//
// import { writeBatch } from "firebase/firestore";
//
// export async function submitTransferReportAtomic(transfers, userId, userName, note = "") {
//   const now       = new Date();
//   const shiftDate = getShiftDate(now);
//   const isNight   = now.getHours() < 6;
//   const batch     = writeBatch(db);
//
//   // Rapor belgesi
//   const reportRef = doc(collection(db, "reports"));
//   batch.set(reportRef, {
//     shiftDate, submittedAt: serverTimestamp(),
//     submittedBy: userId, submittedByName: userName,
//     isNightShift: isNight, transfers, note,
//   });
//
//   // Depo düşümleri
//   for (const tr of transfers) {
//     if (tr.qty > 0) {
//       batch.update(doc(db, "depot_stock", tr.itemId), {
//         qty: increment(-tr.qty), lastUpdated: serverTimestamp(),
//       });
//     }
//   }
//
//   await batch.commit(); // Tek seferde atomik / Atomic single commit
// }
