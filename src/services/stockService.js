// src/services/stockService.js
import {
  doc, getDoc, setDoc, updateDoc, addDoc, deleteDoc,
  collection, query, where, orderBy, onSnapshot,
  serverTimestamp, increment, getDocs,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { PRODUCTS } from "../data/products.js";
import { getShiftDate } from "../utils/helpers.js";

// ── User ──────────────────────────────────────────────────────────────────

export async function getUser(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function seedUsersIfNeeded(seedUsers) {
  for (const u of seedUsers) {
    const ref  = doc(db, "users", u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: u.email, name: u.name, role: u.role,
        createdAt: serverTimestamp(),
      });
    }
  }
}

// ── Depot Stock ───────────────────────────────────────────────────────────

export function subscribeDepotStock(callback) {
  return onSnapshot(collection(db, "depot_stock"), snap => {
    const stock = {};
    snap.forEach(d => { stock[d.id] = d.data(); });
    callback(stock);
  });
}

export async function initDepotItem(product) {
  const ref  = doc(db, "depot_stock", product.id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      itemId: product.id, name: product.name, nameEn: product.nameEn,
      category: product.cat, categoryEn: product.catEn,
      location: product.location, targetStock: product.targetStock,
      qty: 0, minAlert: 20,
      lastUpdated: serverTimestamp(), lastUpdatedBy: "system",
    });
  }
}

export async function initAllDepotItems() {
  for (const p of PRODUCTS) await initDepotItem(p);
}

export async function addDepotStock(itemId, qty, userId, note) {
  await updateDoc(doc(db, "depot_stock", itemId), {
    qty: increment(qty),
    lastUpdated: serverTimestamp(),
    lastUpdatedBy: userId,
  });
  await addDoc(collection(db, "stock_entries"), {
    itemId, qtyAdded: qty, addedBy: userId,
    addedAt: serverTimestamp(), note: note || "",
  });
}

export async function setDepotStock(itemId, newQty, userId) {
  await setDoc(doc(db, "depot_stock", itemId), {
    qty: newQty, lastUpdated: serverTimestamp(), lastUpdatedBy: userId,
  }, { merge: true });
  await addDoc(collection(db, "stock_entries"), {
    itemId, qtySet: newQty, type: "override",
    addedBy: userId, addedAt: serverTimestamp(),
  });
}

// ── Dynamic Products ──────────────────────────────────────────────────────

export async function addDynamicProduct(product, initialQty, userId) {
  // Write to products collection (catalogue)
  await setDoc(doc(db, "products", product.id), {
    ...product,
    createdAt: serverTimestamp(), createdBy: userId,
  });
  // Write to depot_stock
  await setDoc(doc(db, "depot_stock", product.id), {
    itemId: product.id, name: product.name, nameEn: product.nameEn,
    category: product.cat, categoryEn: product.catEn,
    location: product.location, targetStock: product.targetStock,
    qty: initialQty, minAlert: 20,
    lastUpdated: serverTimestamp(), lastUpdatedBy: userId,
  });
}

export async function deleteDynamicProduct(productId) {
  await deleteDoc(doc(db, "products", productId));
  await deleteDoc(doc(db, "depot_stock", productId));
}

export function subscribeDynamicProducts(callback) {
  return onSnapshot(collection(db, "products"), snap => {
    const prods = snap.docs.map(d => d.data());
    callback(prods);
  });
}

// ── Reports ───────────────────────────────────────────────────────────────

export function subscribeReports(isAdmin, userId, callback) {
  const q = isAdmin
    ? query(collection(db, "reports"), orderBy("submittedAt", "desc"))
    : query(
        collection(db, "reports"),
        where("submittedBy", "==", userId),
        orderBy("submittedAt", "desc")
      );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function submitTransferReport(transfers, userId, userName, note) {
  const now       = new Date();
  const shiftDate = getShiftDate(now);
  const isNight   = now.getHours() < 6;

  await addDoc(collection(db, "reports"), {
    shiftDate,
    submittedAt: serverTimestamp(),
    submittedBy: userId,
    submittedByName: userName,
    isNightShift: isNight,
    transfers,
    note: note || "",
  });

  // Decrement depot stock for each transfer
  for (const tr of transfers) {
    if (tr.qty > 0) {
      try {
        await updateDoc(doc(db, "depot_stock", tr.itemId), {
          qty: increment(-tr.qty),
          lastUpdated: serverTimestamp(),
        });
      } catch {
        // Item might be newly added — ignore
      }
    }
  }
}

export async function getStockEntries(itemId) {
  const q   = query(collection(db, "stock_entries"), where("itemId", "==", itemId), orderBy("addedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
