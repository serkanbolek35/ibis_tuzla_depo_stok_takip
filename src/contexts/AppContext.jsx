// src/contexts/AppContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase.js";
import { STRINGS } from "../data/i18n.js";
import { PRODUCTS } from "../data/products.js";
import {
  getUser, subscribeDepotStock, subscribeReports, subscribeDynamicProducts,
  addDepotStock, setDepotStock, submitTransferReport,
  addDynamicProduct, deleteDynamicProduct, seedUsersIfNeeded, initAllDepotItems,
} from "../services/stockService.js";

// Hardcoded seed user UIDs — replace with your actual Firebase Auth UIDs
const SEED_USERS = [
  { uid: "tcBDJ6xrieWagdWNmWnIWQtzIaD3",   email: "emrahkarakus@ibis.com.tr",  name: "Emrah Karakuş",  role: "admin" },
  { uid: "TTSUyV1lhfcw5vHVLTKZ1CS5EQt1",   email: "ferdiasik@ibis.com.tr",     name: "Ferdi Aşık",     role: "admin" },
  { uid: "PDi2cwcDOsWUPPiWOf1KInUgnbr1",    email: "enecan@ibis.com.tr",        name: "Enes Can",        role: "staff" },
  { uid: "5PhgB7e4SpOFusZsUJ6rJCwuXDc2",    email: "iremcetinkaya@ibis.com.tr", name: "İrem Çetinkaya", role: "staff" },
  { uid: "8wDqPqAa5LPeIODR08EUnYTRllH2",   email: "pinarturkel@ibis.com.tr",   name: "Pınar Türkel",   role: "staff" },
  { uid: "E3cG38h53FYpH0v0rqEJ7Umfpof2",  email: "serkanbolek@ibis.com.tr",   name: "Serkan Bölek",   role: "staff" },
  { uid: "Xd6DbHbpX1hXKXOC6SFBUqPzhEx1",  email: "zeynepguven@ibis.com.tr",   name: "Zeynep Güven",   role: "staff" },
  { uid: "mTfL0zn4qfUeJ6mnSPUKrULCvxg1",     email: "ayephokho@ibis.com.tr",     name: "Aye Phokho",     role: "staff" },
  { uid: "f8SD2kFou4YLsMCrR9lW7ZCIzgn1",     email: "zinmyohtet@ibis.com.tr",    name: "Zin Myo Htet",   role: "staff" },
];

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [lang, setLang]               = useState(() => localStorage.getItem("ibis_lang") || "tr");
  const [user, setUser]               = useState(null);
  const [userRole, setUserRole]       = useState(null);
  const [userName, setUserName]       = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [depotStock, setDepotStock]   = useState({});
  const [reports, setReports]         = useState([]);
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [toast, setToast]             = useState(null);

  const t       = STRINGS[lang];
  const isAdmin = userRole === "admin";

  // Persist language
  useEffect(() => { localStorage.setItem("ibis_lang", lang); }, [lang]);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async fbUser => {
      if (fbUser) {
        const userData = await getUser(fbUser.uid);
        setUser(fbUser);
        setUserRole(userData?.role || "staff");
        setUserName(userData?.name || fbUser.email);
      } else {
        setUser(null); setUserRole(null); setUserName("");
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Real-time depot stock
  useEffect(() => {
    if (!user) return;
    return subscribeDepotStock(setDepotStock);
  }, [user]);

  // Real-time reports
  useEffect(() => {
    if (!user) return;
    return subscribeReports(isAdmin, user.uid, setReports);
  }, [user, isAdmin]);

  // Dynamic products (admin-added)
  useEffect(() => {
    if (!user) return;
    return subscribeDynamicProducts(setDynamicProducts);
  }, [user]);

  // Admin one-time init
  useEffect(() => {
    if (!user || !isAdmin) return;
    seedUsersIfNeeded(SEED_USERS);
    initAllDepotItems();
  }, [user, isAdmin]);

  const login  = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const addStock = async (itemId, qty, note) => {
    await addDepotStock(itemId, qty, user.uid, note);
    showToast(t.stockAdded);
  };

  const overrideStock = async (itemId, qty) => {
    await setDepotStock(itemId, qty, user.uid);
    showToast(t.stockUpdated);
  };

  const doSubmitTransfer = async (transfers, note) => {
    await submitTransferReport(transfers, user.uid, userName, note);
    showToast(t.reportSaved);
  };

  const doAddProduct = async (product, initialQty) => {
    await addDynamicProduct(product, initialQty, user.uid);
    showToast(t.productAdded);
  };

  const doDeleteProduct = async productId => {
    await deleteDynamicProduct(productId);
    showToast(t.stockUpdated);
  };

  // All products = static + dynamic
  const allProducts = [
    ...PRODUCTS,
    ...dynamicProducts.filter(d => !PRODUCTS.find(p => p.id === d.id)),
  ];

  const ctx = {
    t, lang, setLang,
    user, userRole, userName, isAdmin,
    authLoading, login, logout,
    depotStock, reports,
    allProducts, dynamicProducts,
    addStock, overrideStock,
    submitTransfer: doSubmitTransfer,
    addProduct: doAddProduct,
    deleteProduct: doDeleteProduct,
    showToast, toast,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}
