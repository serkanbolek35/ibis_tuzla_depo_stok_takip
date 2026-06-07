import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc,
  collection, query, where, orderBy, onSnapshot,
  serverTimestamp, increment
} from "firebase/firestore";

// ─────────────────────────────────────────────
// FIREBASE INIT
// ─────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDPOKGJVvGhX3tkK6-2SKmMbY8AsHdlRcc",
  authDomain:        "ibis-tuzla-stock.firebaseapp.com",
  projectId:         "ibis-tuzla-stock",
  storageBucket:     "ibis-tuzla-stock.firebasestorage.app",
  messagingSenderId: "952788280577",
  appId:             "1:952788280577:web:ff58967cb9b1a36bc6a700",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db   = getFirestore(firebaseApp);

// ─────────────────────────────────────────────
// NIGHT SHIFT DATE RULE
// 00:00–05:59 → previous day
// ─────────────────────────────────────────────
function getShiftDate(now = new Date()) {
  const base = new Date(now);
  if (now.getHours() < 6) base.setDate(base.getDate() - 1);
  return base.toISOString().split("T")[0];
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

// ─────────────────────────────────────────────
// USER SEED DATA (roles written to Firestore once)
// ─────────────────────────────────────────────
const SEED_USERS = [
  { uid: "tcBDJ6xrieWagdWNmWnIWQt",      email: "emrahkarakus@ibis.com.tr",  name: "Emrah Karakuş",  role: "admin" },
  { uid: "TTSUyV1lhfcw5vHVLTKZ1CS5EQt1", email: "ferdiasik@ibis.com.tr",     name: "Ferdi Aşık",     role: "admin" },
  { uid: "PDi2cwcDOsWUPPiWOf1KInUgnbr1", email: "enecan@ibis.com.tr",        name: "Enes Can",        role: "staff" },
  { uid: "5PhgB7e4SpOFusZsUJ6rJCwuXDc2", email: "iremcetinkaya@ibis.com.tr", name: "İrem Çetinkaya", role: "staff" },
  { uid: "8wDqPqAa5LPeIODR08EUnYTRllH2", email: "pinarturkel@ibis.com.tr",   name: "Pınar Türkel",   role: "staff" },
  { uid: "E3cG38h53FYpH0v0rqEJ7Umfpof2", email: "serkanbolek@ibis.com.tr",   name: "Serkan Bölek",   role: "staff" },
  { uid: "Xd6DbHbpX1hXKXOC6SFBUqPzhEx1", email: "zeynepguven@ibis.com.tr",   name: "Zeynep Güven",   role: "staff" },
  { uid: "mTfL0zn4qfUeJ6mnSPUKrULCvxg1", email: "ayephokho@ibis.com.tr",     name: "Aye Phokho",     role: "staff" },
  { uid: "f8SD2kFou4YLsMCrR9lW7ZCIzgn1", email: "zinmyohtet@ibis.com.tr",    name: "Zin Myo Htet",   role: "staff" },
];

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────
const PRODUCTS = [
  { id:"becks-330",      name:"BECK'S 330 ML",            nameEn:"Beck's 330ml",            cat:"Bira",           catEn:"Beers",        minAlert:20 },
  { id:"bomonti-500",    name:"BONMONTİ FİLTRESİZ 500ML", nameEn:"Bomonti 500ml",           cat:"Bira",           catEn:"Beers",        minAlert:20 },
  { id:"efes-330",       name:"EFES ŞİŞE 330 ML",         nameEn:"Efes Bottle 330ml",       cat:"Bira",           catEn:"Beers",        minAlert:20 },
  { id:"efes-500",       name:"EFES ŞİŞE 500 ML",         nameEn:"Efes Bottle 500ml",       cat:"Bira",           catEn:"Beers",        minAlert:20 },
  { id:"heineken-330",   name:"HEİNEKEN 330 ML",          nameEn:"Heineken 330ml",          cat:"Bira",           catEn:"Beers",        minAlert:20 },
  { id:"miller-330",     name:"MILLER 330 ML",             nameEn:"Miller 330ml",            cat:"Bira",           catEn:"Beers",        minAlert:20 },
  { id:"coca-cola-300",  name:"COCA-COLA ŞİŞE 300ML",     nameEn:"Coca-Cola 300ml",         cat:"Meşrubat",       catEn:"Soft Drinks",  minAlert:20 },
  { id:"cola-zero-300",  name:"COLA ZERO ŞİŞE 300 ML",    nameEn:"Cola Zero 300ml",         cat:"Meşrubat",       catEn:"Soft Drinks",  minAlert:20 },
  { id:"fanta-330",      name:"FANTA 330 ML",              nameEn:"Fanta 330ml",             cat:"Meşrubat",       catEn:"Soft Drinks",  minAlert:20 },
  { id:"sprite-330",     name:"SPRİTE 330 ML",             nameEn:"Sprite 330ml",            cat:"Meşrubat",       catEn:"Soft Drinks",  minAlert:20 },
  { id:"burn-330",       name:"BURN 330 ML",               nameEn:"Burn 330ml",              cat:"Meşrubat",       catEn:"Soft Drinks",  minAlert:20 },
  { id:"redbull-250",    name:"REDBULL 250 ML",            nameEn:"Red Bull 250ml",          cat:"Meşrubat",       catEn:"Soft Drinks",  minAlert:20 },
  { id:"fusetea-lemon",  name:"FUSETEA LEMON 330 ML",      nameEn:"Fusetea Lemon 330ml",     cat:"Meşrubat",       catEn:"Soft Drinks",  minAlert:20 },
  { id:"fusetea-peach",  name:"FUSETEA PEACH 330 ML",      nameEn:"Fusetea Peach 330ml",     cat:"Meşrubat",       catEn:"Soft Drinks",  minAlert:20 },
  { id:"riabo",          name:"RİABO ORGANİK SMOOTHİE",    nameEn:"Riabo Organic Smoothie",  cat:"Meşrubat",       catEn:"Soft Drinks",  minAlert:20 },
  { id:"san-pellegrino", name:"SAN PELLEGRİNO 250 ML",    nameEn:"San Pellegrino 250ml",    cat:"Su/Soda",        catEn:"Water & Soda", minAlert:20 },
  { id:"uludag-250",     name:"ULUDAĞ PREMİUM 250 ML",     nameEn:"Uludag Premium 250ml",    cat:"Su/Soda",        catEn:"Water & Soda", minAlert:20 },
  { id:"schweppes",      name:"SCHWEPPS TONİC 250 ML",     nameEn:"Schweppes Tonic 250ml",   cat:"Su/Soda",        catEn:"Water & Soda", minAlert:20 },
  { id:"uludag-330",     name:"ULUDAĞ CAM SU 330 ML",      nameEn:"Uludag Glass Water 330ml",cat:"Su/Soda",        catEn:"Water & Soda", minAlert:20 },
  { id:"uludag-750",     name:"ULUDAĞ CAM SU 750 ML",      nameEn:"Uludag Glass Water 750ml",cat:"Su/Soda",        catEn:"Water & Soda", minAlert:20 },
  { id:"damla-soda",     name:"DAMLA SODA 200 ML",         nameEn:"Damla Soda 200ml",        cat:"Su/Soda",        catEn:"Water & Soda", minAlert:20 },
  { id:"cankaya",        name:"ÇANKAYA 75 CL",             nameEn:"Çankaya 75cl",            cat:"Beyaz Şarap",    catEn:"White Wine",   minAlert:20 },
  { id:"diren-sek",      name:"DİREN SEK BEYAZ 750 ML",    nameEn:"Diren Sek White 750ml",   cat:"Beyaz Şarap",    catEn:"White Wine",   minAlert:20 },
  { id:"diren-chardonnay",name:"DİREN CHARDONNAY 750 ML",  nameEn:"Diren Chardonnay 750ml",  cat:"Beyaz Şarap",    catEn:"White Wine",   minAlert:20 },
  { id:"diren-karmen-w", name:"DİREN KARMEN BEYAZ 750 ML", nameEn:"Diren Karmen White 750ml",cat:"Beyaz Şarap",    catEn:"White Wine",   minAlert:20 },
  { id:"angora-w",       name:"ANGORA BEYAZ 75 CL",        nameEn:"Angora White 75cl",       cat:"Beyaz Şarap",    catEn:"White Wine",   minAlert:20 },
  { id:"angora-red",     name:"ANGORA KIRMIZI 75 CL",      nameEn:"Angora Red 75cl",         cat:"Kırmızı Şarap",  catEn:"Red Wine",     minAlert:20 },
  { id:"yakut",          name:"YAKUT 75 CL",               nameEn:"Yakut 75cl",              cat:"Kırmızı Şarap",  catEn:"Red Wine",     minAlert:20 },
  { id:"diren-mahlep",   name:"DİREN MAHLEP AROMATİZE",    nameEn:"Diren Mahlep Aromatize",  cat:"Kırmızı Şarap",  catEn:"Red Wine",     minAlert:20 },
  { id:"diren-cadde",    name:"DİREN CADDE",               nameEn:"Diren Cadde",             cat:"Kırmızı Şarap",  catEn:"Red Wine",     minAlert:20 },
  { id:"diren-syrah",    name:"DİREN COLLECTİON SYRAH",    nameEn:"Diren Collection Syrah",  cat:"Kırmızı Şarap",  catEn:"Red Wine",     minAlert:20 },
  { id:"diren-karmen-r", name:"DİREN KARMEN KIRMIZI",      nameEn:"Diren Karmen Red",        cat:"Kırmızı Şarap",  catEn:"Red Wine",     minAlert:20 },
  { id:"gato-negro",     name:"GATO NEGRO",                nameEn:"Gato Negro",              cat:"Kırmızı Şarap",  catEn:"Red Wine",     minAlert:20 },
  { id:"kavaklidere-lal",name:"KAVAKLIDERE LAL 75 CL",     nameEn:"Kavaklidere Lal 75cl",    cat:"Pembe Şarap",    catEn:"Rosé Wine",    minAlert:20 },
  { id:"angora-rose",    name:"ANGORA ROSE 75 CL",         nameEn:"Angora Rosé 75cl",        cat:"Pembe Şarap",    catEn:"Rosé Wine",    minAlert:20 },
  { id:"diren-cadde-rose",name:"DİREN CADDE ROSE 750 ML",  nameEn:"Diren Cadde Rose 750ml",  cat:"Pembe Şarap",    catEn:"Rosé Wine",    minAlert:20 },
  { id:"inci-damlasi",   name:"İNCİ DAMLASI 75 CL",        nameEn:"İnci Damlası 75cl",       cat:"Şampanya",       catEn:"Sparkling",    minAlert:20 },
  { id:"altin-kopuk",    name:"ALTIN KÖPÜK 75 CL",         nameEn:"Altın Köpük 75cl",        cat:"Şampanya",       catEn:"Sparkling",    minAlert:20 },
  { id:"beefeater",      name:"BEEFEATER 70 CL",           nameEn:"Beefeater 70cl",          cat:"Cin",            catEn:"Gin",          minAlert:20 },
  { id:"gordons",        name:"GORDONS 70 CL",             nameEn:"Gordon's 70cl",           cat:"Cin",            catEn:"Gin",          minAlert:20 },
  { id:"absolut-100",    name:"ABSOLUT 100 CL",            nameEn:"Absolut 100cl",           cat:"Vodka",          catEn:"Vodka",        minAlert:20 },
  { id:"smirnoff",       name:"SMİRNOF TRIPLE 100 CL",     nameEn:"Smirnoff Triple 100cl",   cat:"Vodka",          catEn:"Vodka",        minAlert:20 },
  { id:"absolut-35",     name:"ABSOLUT 35 CL",             nameEn:"Absolut 35cl",            cat:"Vodka",          catEn:"Vodka",        minAlert:20 },
  { id:"chivas-100",     name:"CHİVAS REGAL 100 CL",       nameEn:"Chivas Regal 100cl",      cat:"Viski",          catEn:"Whisky",       minAlert:20 },
  { id:"jack-100",       name:"JACK DANİELS 100 CL",       nameEn:"Jack Daniel's 100cl",     cat:"Viski",          catEn:"Whisky",       minAlert:20 },
  { id:"black-label",    name:"BLACK LABEL 100 CL",        nameEn:"Black Label 100cl",       cat:"Viski",          catEn:"Whisky",       minAlert:20 },
  { id:"red-label",      name:"RED LABEL 100 CL",          nameEn:"Red Label 100cl",         cat:"Viski",          catEn:"Whisky",       minAlert:20 },
  { id:"jb-100",         name:"J&B 100 CL",                nameEn:"J&B 100cl",               cat:"Viski",          catEn:"Whisky",       minAlert:20 },
  { id:"jim-beam",       name:"JİM BEAM 100 CL",           nameEn:"Jim Beam 100cl",          cat:"Viski",          catEn:"Whisky",       minAlert:20 },
  { id:"glenlivet",      name:"GLENLİVET 70 CL",           nameEn:"Glenlivet 70cl",          cat:"Viski",          catEn:"Whisky",       minAlert:20 },
  { id:"yeni-raki",      name:"YENİ RAKI 100 CL",          nameEn:"Yeni Rakı 100cl",         cat:"Rakı",           catEn:"Raki",         minAlert:20 },
  { id:"tekirdag",       name:"TEKİRDAĞ RAKI 100 CL",      nameEn:"Tekirdağ Rakı 100cl",     cat:"Rakı",           catEn:"Raki",         minAlert:20 },
  { id:"gobek",          name:"GÖBEK RAKI 100 CL",         nameEn:"Göbek Rakı 100cl",        cat:"Rakı",           catEn:"Raki",         minAlert:20 },
  { id:"olmega",         name:"OLMEGA 70 CL",              nameEn:"Olmega 70cl",             cat:"Tekila",         catEn:"Tequila",      minAlert:20 },
  { id:"aperol",         name:"APEROL 70 CL",              nameEn:"Aperol 70cl",             cat:"Likör",          catEn:"Liqueur",      minAlert:20 },
  { id:"baileys",        name:"BAİLEYS 70 CL",             nameEn:"Baileys 70cl",            cat:"Likör",          catEn:"Liqueur",      minAlert:20 },
  { id:"campari",        name:"CAMPARİ 70 CL",             nameEn:"Campari 70cl",            cat:"Likör",          catEn:"Liqueur",      minAlert:20 },
  { id:"cointreau",      name:"COİNTREU 70 CL",            nameEn:"Cointreau 70cl",          cat:"Likör",          catEn:"Liqueur",      minAlert:20 },
  { id:"malibu",         name:"MALİBU 70 CL",              nameEn:"Malibu 70cl",             cat:"Likör",          catEn:"Liqueur",      minAlert:20 },
  { id:"doritos",        name:"DORİTOS",                   nameEn:"Doritos",                 cat:"Market Ürünü",   catEn:"Food",         minAlert:20 },
  { id:"ruffles",        name:"RUFFLES",                   nameEn:"Ruffles",                 cat:"Market Ürünü",   catEn:"Food",         minAlert:20 },
  { id:"karisik-cerez",  name:"KARIŞIK ÇEREZ 200GR",       nameEn:"Mixed Nuts 200g",         cat:"Market Ürünü",   catEn:"Food",         minAlert:20 },
  { id:"milka",          name:"ÇİKOLATA MİLKA",            nameEn:"Milka Chocolate",         cat:"Market Ürünü",   catEn:"Food",         minAlert:20 },
  { id:"snickers",       name:"ÇİKOLATA SNİCKERS",         nameEn:"Snickers",                cat:"Market Ürünü",   catEn:"Food",         minAlert:20 },
  { id:"toblerone",      name:"ÇİKOLATA TOBLERONE",        nameEn:"Toblerone",               cat:"Market Ürünü",   catEn:"Food",         minAlert:20 },
  { id:"noodle",         name:"NOODLE",                    nameEn:"Noodle",                  cat:"Market Ürünü",   catEn:"Food",         minAlert:20 },
  { id:"ucgen-sandvic",  name:"ÜÇGEN SANDVİÇ",             nameEn:"Triangle Sandwich",       cat:"Market Ürünü",   catEn:"Food",         minAlert:20 },
  { id:"kola-1lt",       name:"KOLA 1 LT",                 nameEn:"Cola 1L",                 cat:"1L İçecek",      catEn:"Juices 1L",    minAlert:20 },
  { id:"kola-zero-1lt",  name:"KOLA ZERO 1 LT",            nameEn:"Cola Zero 1L",            cat:"1L İçecek",      catEn:"Juices 1L",    minAlert:20 },
  { id:"fanta-1lt",      name:"FANTA 1 LT",                nameEn:"Fanta 1L",                cat:"1L İçecek",      catEn:"Juices 1L",    minAlert:20 },
  { id:"sprite-1lt",     name:"SPRİTE 1 LT",               nameEn:"Sprite 1L",               cat:"1L İçecek",      catEn:"Juices 1L",    minAlert:20 },
  { id:"visne-1lt",      name:"VİŞNE SUYU 1 LT",           nameEn:"Cherry Juice 1L",         cat:"1L İçecek",      catEn:"Juices 1L",    minAlert:20 },
  { id:"elma-1lt",       name:"ELMA SUYU 1 LT",            nameEn:"Apple Juice 1L",          cat:"1L İçecek",      catEn:"Juices 1L",    minAlert:20 },
  { id:"portakal-1lt",   name:"PORTAKAL SUYU 1 LT",        nameEn:"Orange Juice 1L",         cat:"1L İçecek",      catEn:"Juices 1L",    minAlert:20 },
];

// ─────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────
const STRINGS = {
  tr: {
    appName:"İbis Tuzla Stok",login:"Giriş Yap",logout:"Çıkış",
    email:"E-posta",password:"Şifre",loginBtn:"Giriş",loginErr:"Hatalı e-posta veya şifre.",
    loading:"Yükleniyor...",
    dashboard:"Panel",depot:"Depo",market:"Market",bar:"Bar",restaurant:"Restoran",
    reports:"Raporlar",stockEntry:"Stok Girişi",override:"Manuel Düzeltme",archive:"Arşiv",
    transferForm:"İkmal Formu",adminPanel:"Yönetici Paneli",staffPanel:"Personel Paneli",
    product:"Ürün",currentStock:"Mevcut Stok",minStock:"Min",qty:"Miktar",
    location:"Konum",note:"Not",save:"Kaydet",submit:"Gönder",cancel:"İptal",
    confirm:"Onayla",back:"Geri",search:"Ara...",allCats:"Tüm Kategoriler",
    allDates:"Tüm Tarihler",shiftDate:"Vardiya Tarihi",submittedBy:"Gönderen",
    submittedAt:"Gönderim Saati",reportDetail:"Rapor Detayı",noReports:"Rapor bulunamadı.",
    stockAdded:"Stok eklendi ✓",stockUpdated:"Stok güncellendi ✓",reportSaved:"Rapor kaydedildi ✓",
    lowStock:"⚠ Düşük Stok",nightNote:"🌙 Gece 00:00–06:00 arası raporlar önceki güne kaydedilir.",
    addQty:"Eklenecek miktar (+)",setQty:"Yeni miktar (üzerine yaz)",enterQty:"Miktar girin",
    transferQty:"Transfer miktarı",items:"ürün",confirmTransfer:"Transfer Onayı",
    confirmMsg:"adet ürün transfer edilecek. Onaylıyor musunuz?",
    depotOnly:"(Yalnızca Depo)",addNote:"Sevkiyat notu (opsiyonel)",today:"Bugün",
  },
  en: {
    appName:"Ibis Tuzla Stock",login:"Sign In",logout:"Sign Out",
    email:"Email",password:"Password",loginBtn:"Login",loginErr:"Invalid email or password.",
    loading:"Loading...",
    dashboard:"Dashboard",depot:"Depot",market:"Market",bar:"Bar",restaurant:"Restaurant",
    reports:"Reports",stockEntry:"Stock Entry",override:"Manual Override",archive:"Archive",
    transferForm:"Transfer Form",adminPanel:"Admin Panel",staffPanel:"Staff Panel",
    product:"Product",currentStock:"Current Stock",minStock:"Min",qty:"Qty",
    location:"Location",note:"Note",save:"Save",submit:"Submit",cancel:"Cancel",
    confirm:"Confirm",back:"Back",search:"Search...",allCats:"All Categories",
    allDates:"All Dates",shiftDate:"Shift Date",submittedBy:"Submitted By",
    submittedAt:"Submitted At",reportDetail:"Report Detail",noReports:"No reports found.",
    stockAdded:"Stock added ✓",stockUpdated:"Stock updated ✓",reportSaved:"Report saved ✓",
    lowStock:"⚠ Low Stock",nightNote:"🌙 Reports submitted 00:00–06:00 are logged under the previous day.",
    addQty:"Amount to add (+)",setQty:"New amount (overwrite)",enterQty:"Enter quantity",
    transferQty:"Transfer quantity",items:"items",confirmTransfer:"Confirm Transfer",
    confirmMsg:"item(s) will be transferred. Confirm?",
    depotOnly:"(Depot only)",addNote:"Shipment note (optional)",today:"Today",
  }
};

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);

// ─────────────────────────────────────────────
// FIRESTORE SERVICES
// ─────────────────────────────────────────────
const svc = {
  async getUser(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  },

  // Kullanıcı rollerini yazar — kayıt varsa atlar
  async seedUsersIfNeeded() {
    for (const u of SEED_USERS) {
      const ref  = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          email: u.email, name: u.name, role: u.role,
          createdAt: serverTimestamp(),
        });
        console.log("✅ Kullanıcı oluşturuldu:", u.email);
      }
    }
  },

  async addDepotStock(itemId, qty, userId, note) {
    await updateDoc(doc(db, "depot_stock", itemId), {
      qty: increment(qty),
      lastUpdated: serverTimestamp(),
      lastUpdatedBy: userId,
    });
    await addDoc(collection(db, "stock_entries"), {
      itemId, qtyAdded: qty, addedBy: userId,
      addedAt: serverTimestamp(), note: note || "",
    });
  },

  async setDepotStock(itemId, newQty, userId) {
    await setDoc(doc(db, "depot_stock", itemId), {
      qty: newQty, lastUpdated: serverTimestamp(), lastUpdatedBy: userId,
    }, { merge: true });
  },

  async initDepotItem(product) {
    const ref  = doc(db, "depot_stock", product.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        itemId: product.id, name: product.name, nameEn: product.nameEn,
        category: product.cat, categoryEn: product.catEn,
        qty: 0, minAlert: 20,
        lastUpdated: serverTimestamp(), lastUpdatedBy: "system",
      });
    }
  },

  async submitTransferReport(transfers, userId, userName, note) {
    const now = new Date();
    const shiftDate = getShiftDate(now);
    const isNight = now.getHours() < 6;
    await addDoc(collection(db, "reports"), {
      shiftDate, submittedAt: serverTimestamp(),
      submittedBy: userId, submittedByName: userName,
      isNightShift: isNight, transfers, note: note || "",
    });
    for (const tr of transfers) {
      if (tr.qty > 0) {
        await updateDoc(doc(db, "depot_stock", tr.itemId), {
          qty: increment(-tr.qty), lastUpdated: serverTimestamp(),
        });
      }
    }
  },
};

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [lang, setLang]           = useState("tr");
  const [user, setUser]           = useState(null);
  const [userRole, setUserRole]   = useState(null);
  const [userName, setUserName]   = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [depotStock, setDepotStock]   = useState({});
  const [reports, setReports]         = useState([]);
  const [toast, setToast]             = useState(null);

  const t       = STRINGS[lang];
  const isAdmin = userRole === "admin";

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userData = await svc.getUser(fbUser.uid);
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
    const unsub = onSnapshot(collection(db, "depot_stock"), (snap) => {
      const stock = {};
      snap.forEach(d => { stock[d.id] = d.data(); });
      setDepotStock(stock);
    });
    return unsub;
  }, [user]);

  // Real-time reports
  useEffect(() => {
    if (!user) return;
    const q = isAdmin
      ? query(collection(db, "reports"), orderBy("submittedAt", "desc"))
      : query(collection(db, "reports"),
          where("submittedBy", "==", user.uid),
          orderBy("submittedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user, isAdmin]);

  // Admin: seed user roles + init depot items
  useEffect(() => {
    if (!user || !isAdmin) return;
    svc.seedUsersIfNeeded();
    PRODUCTS.forEach(p => svc.initDepotItem(p));
  }, [user, isAdmin]);

  const login  = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const addStock = async (itemId, qty, note) => {
    await svc.addDepotStock(itemId, qty, user.uid, note);
    showToast(t.stockAdded);
  };
  const setStock = async (itemId, qty) => {
    await svc.setDepotStock(itemId, qty, user.uid);
    showToast(t.stockUpdated);
  };
  const submitTransfer = async (transfers, note) => {
    await svc.submitTransferReport(transfers, user.uid, userName, note);
    showToast(t.reportSaved);
  };

  const ctx = {
    t, lang, setLang, user, userRole, userName, isAdmin,
    login, logout, depotStock, reports,
    addStock, setStock, submitTransfer, showToast,
  };

  if (authLoading) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", background:"#0f172a", gap:"0.5rem" }}>
        <div style={{ fontSize:"3rem", color:"#d4a853" }}>⬡</div>
        <div style={{ fontSize:"1.25rem", fontWeight:700, color:"#fff", letterSpacing:"0.15em" }}>İBİS TUZLA</div>
        <div style={{ fontSize:"0.8rem", color:"#64748b" }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <Ctx.Provider value={ctx}>
      <style>{CSS}</style>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
      {!user ? <LoginPage /> : <MainLayout />}
    </Ctx.Provider>
  );
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
function LoginPage() {
  const { t, login, lang, setLang } = useApp();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(""); setLoading(true);
    try { await login(email, password); }
    catch { setError(t.loginErr); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">⬡</div>
          <h1 className="login-title">İBİS TUZLA</h1>
          <p className="login-sub">Stock Management</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label className="field-label">{t.email}</label>
            <input type="email" className="field-input" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@ibis.com.tr" autoComplete="email" />
          </div>
          <div className="field-group">
            <label className="field-label">{t.password}</label>
            <input type="password" className="field-input" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password" />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? t.loading : t.loginBtn}
          </button>
        </form>
        <div className="login-lang">
          <button className={`lang-pill ${lang==="tr"?"active":""}`} onClick={() => setLang("tr")}>TR</button>
          <button className={`lang-pill ${lang==="en"?"active":""}`} onClick={() => setLang("en")}>EN</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN LAYOUT
// ─────────────────────────────────────────────
function MainLayout() {
  const { t, isAdmin, userName, logout, lang, setLang } = useApp();
  const [page, setPage]           = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminNav = [
    { id:"dashboard",   icon:"⊞", label:t.dashboard },
    { id:"depot",       icon:"▦", label:t.depot },
    { id:"stock-entry", icon:"+", label:t.stockEntry },
    { id:"override",    icon:"✎", label:t.override },
    { id:"reports",     icon:"≡", label:t.reports },
    { id:"archive",     icon:"⬡", label:t.archive },
  ];
  const staffNav = [
    { id:"dashboard", icon:"⊞", label:t.dashboard },
    { id:"transfer",  icon:"⟳", label:t.transferForm },
    { id:"reports",   icon:"≡", label:t.reports },
  ];
  const nav = isAdmin ? adminNav : staffNav;
  const go  = (id) => { setPage(id); setMobileOpen(false); };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo">⬡</span>
          <span className="sidebar-app">{t.appName}</span>
        </div>
        <div className="sidebar-role-badge">
          {isAdmin ? t.adminPanel : t.staffPanel}
        </div>
        <nav className="sidebar-nav">
          {nav.map(n => (
            <button key={n.id}
              className={`nav-link ${page===n.id ? "nav-active" : ""}`}
              onClick={() => go(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{userName[0]?.toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{userName.split("@")[0]}</div>
              <div className="user-role">{isAdmin ? "Admin" : "Staff"}</div>
            </div>
          </div>
          <div className="sidebar-controls">
            <div className="lang-toggle">
              <button className={lang==="tr"?"active":""} onClick={() => setLang("tr")}>TR</button>
              <button className={lang==="en"?"active":""} onClick={() => setLang("en")}>EN</button>
            </div>
            <button className="btn-logout" onClick={logout}>{t.logout}</button>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}

      <header className="mobile-header">
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
        <span className="mobile-title">{t.appName}</span>
        <div className="lang-toggle-sm">
          <button className={lang==="tr"?"active":""} onClick={() => setLang("tr")}>TR</button>
          <button className={lang==="en"?"active":""} onClick={() => setLang("en")}>EN</button>
        </div>
      </header>

      <main className="main-content">
        {page==="dashboard"   && <Dashboard onNavigate={go} />}
        {page==="depot"       && isAdmin && <DepotView />}
        {page==="stock-entry" && isAdmin && <StockEntryView />}
        {page==="override"    && isAdmin && <OverrideView />}
        {page==="reports"     && <ReportsView />}
        {page==="archive"     && isAdmin && <ArchiveView />}
        {page==="transfer"    && !isAdmin && <TransferView />}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function Dashboard({ onNavigate }) {
  const { t, depotStock, reports, isAdmin, lang } = useApp();
  const totalItems   = PRODUCTS.length;
  const lowItems     = PRODUCTS.filter(p => (depotStock[p.id]?.qty ?? 0) < 20).length;
  const today        = getShiftDate();
  const todayReports = reports.filter(r => r.shiftDate === today);
  const lowProducts  = PRODUCTS.filter(p => (depotStock[p.id]?.qty ?? 0) < 20).slice(0, 6);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.dashboard}</h2>
        <div className="shift-pill">📅 {formatDate(today)}</div>
      </div>
      <div className="stat-grid">
        {[
          { label:t.depot,    val:totalItems,        sub:`${lowItems} ${t.lowStock}`, color:"#0f172a", action:isAdmin?"depot":null },
          { label:t.today||"Bugün", val:todayReports.length, sub:t.reports,          color:"#1e3a5f", action:"reports" },
          { label:t.lowStock, val:lowItems,           sub:t.depotOnly,                color:lowItems>0?"#7f1d1d":"#14532d", action:isAdmin?"depot":null },
        ].map(s => (
          <div key={s.label} className="stat-card"
            style={{ cursor: s.action ? "pointer" : "default" }}
            onClick={() => s.action && onNavigate(s.action)}>
            <div className="stat-icon" style={{ background: s.color }}>
              {s.label===t.lowStock ? "⚠" : s.label===t.depot ? "▦" : "≡"}
            </div>
            <div>
              <div className="stat-value">{s.val}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {isAdmin && lowProducts.length > 0 && (
        <div className="section">
          <div className="section-label" style={{ color:"#b91c1c" }}>{t.lowStock} {t.depotOnly}</div>
          <div className="alert-grid">
            {lowProducts.map(p => (
              <div key={p.id} className="alert-card">
                <div className="alert-name">{lang==="tr" ? p.name : p.nameEn}</div>
                <div className="alert-qty">
                  <span className="qty-red">{depotStock[p.id]?.qty ?? 0}</span>
                  <span className="qty-sep"> / min 20</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-label">{t.reports} — {formatDate(today)}</div>
        {todayReports.length === 0
          ? <p className="empty-msg">{t.noReports}</p>
          : <div className="report-list">{todayReports.map(r => <ReportRow key={r.id} report={r} />)}</div>
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DEPOT VIEW
// ─────────────────────────────────────────────
function DepotView() {
  const { t, depotStock, lang } = useApp();
  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const cats = [...new Set(PRODUCTS.map(p => lang==="tr" ? p.cat : p.catEn))];
  const filtered = PRODUCTS.filter(p => {
    const name = lang==="tr" ? p.name : p.nameEn;
    const cat  = lang==="tr" ? p.cat  : p.catEn;
    return name.toLowerCase().includes(search.toLowerCase()) &&
           (catFilter==="all" || cat===catFilter);
  });
  const grouped = {};
  filtered.forEach(p => {
    const cat = lang==="tr" ? p.cat : p.catEn;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.depot}</h2>
        <div className="badge">{PRODUCTS.length} {t.items}</div>
      </div>
      <div className="filter-bar">
        <input className="search-input" placeholder={t.search}
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={catFilter}
          onChange={e => setCatFilter(e.target.value)}>
          <option value="all">{t.allCats}</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="cat-block">
          <div className="cat-header">{cat}</div>
          <div className="stock-table">
            <div className="table-head table-3col">
              <span>{t.product}</span>
              <span className="col-right">{t.minStock}</span>
              <span className="col-right">{t.currentStock}</span>
            </div>
            {items.map(p => {
              const qty   = depotStock[p.id]?.qty ?? 0;
              const isLow = qty < 20;
              return (
                <div key={p.id} className={`table-row table-3col ${isLow ? "row-low" : ""}`}>
                  <span className="item-name">{lang==="tr" ? p.name : p.nameEn}</span>
                  <span className="col-right item-min">20</span>
                  <span className={`col-right item-qty ${isLow ? "qty-red" : "qty-green"}`}>{qty}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// STOCK ENTRY
// ─────────────────────────────────────────────
function StockEntryView() {
  const { t, depotStock, addStock, lang } = useApp();
  const [search, setSearch] = useState("");
  const [values, setValues] = useState({});
  const [note, setNote]     = useState("");
  const [saved, setSaved]   = useState({});

  const handle = async (itemId) => {
    const qty = parseInt(values[itemId]);
    if (!qty || qty <= 0) return;
    await addStock(itemId, qty, note);
    setValues(p => ({ ...p, [itemId]: "" }));
    setSaved(p => ({ ...p, [itemId]: true }));
    setTimeout(() => setSaved(p => ({ ...p, [itemId]: false })), 1800);
  };

  const filtered = PRODUCTS.filter(p =>
    (lang==="tr" ? p.name : p.nameEn).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header"><h2 className="page-title">{t.stockEntry}</h2></div>
      <div className="info-banner">ℹ {t.addQty}</div>
      <div className="filter-bar">
        <input className="search-input" placeholder={t.search}
          value={search} onChange={e => setSearch(e.target.value)} />
        <input className="note-input" placeholder={t.addNote}
          value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <div className="entry-grid">
        {filtered.map(p => {
          const cur = depotStock[p.id]?.qty ?? 0;
          return (
            <div key={p.id} className="entry-card">
              <div className="entry-name">{lang==="tr" ? p.name : p.nameEn}</div>
              <div className="entry-cat">{lang==="tr" ? p.cat : p.catEn}</div>
              <div className="entry-current">{t.currentStock}: <strong>{cur}</strong></div>
              <div className="entry-row">
                <input type="number" min="1" className="qty-input"
                  placeholder={t.enterQty} value={values[p.id] || ""}
                  onChange={e => setValues(v => ({ ...v, [p.id]: e.target.value }))}
                  onKeyDown={e => e.key==="Enter" && handle(p.id)} />
                <button className={`btn-add ${saved[p.id] ? "btn-saved" : ""}`}
                  onClick={() => handle(p.id)}>
                  {saved[p.id] ? "✓" : "+"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// OVERRIDE
// ─────────────────────────────────────────────
function OverrideView() {
  const { t, depotStock, setStock, lang } = useApp();
  const [search, setSearch] = useState("");
  const [values, setValues] = useState({});
  const [saved, setSaved]   = useState({});

  const handle = async (itemId) => {
    const qty = parseInt(values[itemId]);
    if (isNaN(qty) || qty < 0) return;
    await setStock(itemId, qty);
    setSaved(p => ({ ...p, [itemId]: true }));
    setTimeout(() => setSaved(p => ({ ...p, [itemId]: false })), 1800);
  };

  const filtered = PRODUCTS.filter(p =>
    (lang==="tr" ? p.name : p.nameEn).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header"><h2 className="page-title">{t.override}</h2></div>
      <div className="info-banner warning">⚠ {t.setQty}</div>
      <div className="filter-bar">
        <input className="search-input" placeholder={t.search}
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="entry-grid">
        {filtered.map(p => {
          const cur = depotStock[p.id]?.qty ?? 0;
          return (
            <div key={p.id} className="entry-card">
              <div className="entry-name">{lang==="tr" ? p.name : p.nameEn}</div>
              <div className="entry-cat">{lang==="tr" ? p.cat : p.catEn}</div>
              <div className="entry-current">{t.currentStock}: <strong>{cur}</strong></div>
              <div className="entry-row">
                <input type="number" min="0" className="qty-input"
                  placeholder={String(cur)} value={values[p.id] ?? ""}
                  onChange={e => setValues(v => ({ ...v, [p.id]: e.target.value }))}
                  onKeyDown={e => e.key==="Enter" && handle(p.id)} />
                <button className={`btn-add btn-override ${saved[p.id] ? "btn-saved" : ""}`}
                  onClick={() => handle(p.id)}>
                  {saved[p.id] ? "✓" : "✎"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TRANSFER (Staff)
// ─────────────────────────────────────────────
function TransferView() {
  const { t, depotStock, submitTransfer, lang } = useApp();
  const [location, setLocation]     = useState("bar");
  const [quantities, setQuantities] = useState({});
  const [note, setNote]             = useState("");
  const [catFilter, setCatFilter]   = useState("all");
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const now       = new Date();
  const isNight   = now.getHours() < 6;
  const shiftDate = getShiftDate(now);
  const cats      = [...new Set(PRODUCTS.map(p => lang==="tr" ? p.cat : p.catEn))];
  const filtered  = PRODUCTS.filter(p =>
    catFilter==="all" || (lang==="tr" ? p.cat : p.catEn)===catFilter
  );
  const grouped = {};
  filtered.forEach(p => {
    const cat = lang==="tr" ? p.cat : p.catEn;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  const totalItems = Object.values(quantities).filter(q => Number(q) > 0).length;
  const totalUnits = Object.values(quantities).reduce((s, q) => s + (Number(q) || 0), 0);

  const handleSubmit = async () => {
    const transfers = Object.entries(quantities)
      .filter(([, q]) => Number(q) > 0)
      .map(([itemId, qty]) => {
        const p = PRODUCTS.find(x => x.id===itemId);
        return { itemId, qty: Number(qty), name: p?.name||itemId, nameEn: p?.nameEn||itemId, location };
      });
    if (!transfers.length) return;
    await submitTransfer(transfers, note);
    setQuantities({}); setNote(""); setSubmitted(true); setShowConfirm(false);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.transferForm}</h2>
        <div className="shift-pill">📅 {formatDate(shiftDate)}</div>
      </div>
      {isNight && <div className="night-banner">{t.nightNote}</div>}

      <div className="location-tabs">
        {["bar","market","restaurant"].map(loc => (
          <button key={loc}
            className={`loc-tab ${location===loc ? "loc-active" : ""}`}
            onClick={() => setLocation(loc)}>
            {t[loc] || loc}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <select className="filter-select" value={catFilter}
          onChange={e => setCatFilter(e.target.value)}>
          <option value="all">{t.allCats}</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="note-input" placeholder={t.note+"..."}
          value={note} onChange={e => setNote(e.target.value)} />
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="cat-block">
          <div className="cat-header">{cat}</div>
          <div className="stock-table">
            <div className="table-head table-4col">
              <span>{t.product}</span>
              <span className="col-right">Depo</span>
              <span className="col-right">Min</span>
              <span className="col-right">{t.transferQty}</span>
            </div>
            {items.map(p => {
              const depotQty = depotStock[p.id]?.qty ?? 0;
              const isLow    = depotQty < 20;
              return (
                <div key={p.id} className={`table-row table-4col ${isLow ? "row-low" : ""}`}>
                  <span className="item-name">{lang==="tr" ? p.name : p.nameEn}</span>
                  <span className={`col-right item-qty ${isLow ? "qty-red" : "qty-green"}`}>{depotQty}</span>
                  <span className="col-right item-min">20</span>
                  <input type="number" min="0" className="tr-input" placeholder="0"
                    value={quantities[p.id] || ""}
                    onChange={e => setQuantities(q => ({ ...q, [p.id]: e.target.value }))} />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="submit-bar">
        <div className="submit-summary">
          {totalItems > 0 && <span>{totalItems} {t.items} · {totalUnits} {t.qty}</span>}
        </div>
        <button className="btn-primary btn-submit"
          disabled={totalItems===0} onClick={() => setShowConfirm(true)}>
          {t.submit} →
        </button>
      </div>

      {submitted && <div className="success-banner">✓ {t.reportSaved}</div>}

      {showConfirm && (
        <div className="modal-bg">
          <div className="modal">
            <h3>{t.confirmTransfer}</h3>
            <p style={{ margin:"0.75rem 0", color:"#6b7280" }}>
              <strong>{totalUnits}</strong> {t.confirmMsg}
            </p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowConfirm(false)}>{t.cancel}</button>
              <button className="btn-primary" onClick={handleSubmit}>{t.confirm}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────
function ReportsView() {
  const { t, reports } = useApp();
  const [selected, setSelected] = useState(null);
  const today        = getShiftDate();
  const todayReports = reports.filter(r => r.shiftDate===today);

  if (selected) return <ReportDetail report={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.reports}</h2>
        <div className="badge">{todayReports.length}</div>
      </div>
      <div className="section-label">{formatDate(today)}</div>
      {todayReports.length===0
        ? <p className="empty-msg">{t.noReports}</p>
        : <div className="report-list">
            {todayReports.map(r => <ReportRow key={r.id} report={r} onClick={() => setSelected(r)} />)}
          </div>
      }
    </div>
  );
}

// ─────────────────────────────────────────────
// ARCHIVE
// ─────────────────────────────────────────────
function ArchiveView() {
  const { t, reports } = useApp();
  const [dateFilter, setDateFilter] = useState("all");
  const [selected, setSelected]     = useState(null);
  const dates    = [...new Set(reports.map(r => r.shiftDate))].sort().reverse();
  const filtered = reports.filter(r => dateFilter==="all" || r.shiftDate===dateFilter);

  if (selected) return <ReportDetail report={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.archive}</h2>
        <div className="badge">{filtered.length}</div>
      </div>
      <div className="filter-bar">
        <select className="filter-select" value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}>
          <option value="all">{t.allDates}</option>
          {dates.map(d => <option key={d} value={d}>{formatDate(d)}</option>)}
        </select>
      </div>
      {filtered.length===0
        ? <p className="empty-msg">{t.noReports}</p>
        : <div className="report-list">
            {filtered.map(r => <ReportRow key={r.id} report={r} onClick={() => setSelected(r)} />)}
          </div>
      }
    </div>
  );
}

// ─────────────────────────────────────────────
// REPORT ROW
// ─────────────────────────────────────────────
function ReportRow({ report, onClick }) {
  const { t } = useApp();
  const locs  = [...new Set((report.transfers || []).map(tr => tr.location))];
  const locMap = { bar:"Bar", market:"Market", restaurant:"Restaurant" };
  return (
    <div className="report-row" onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="report-row-left">
        {locs.map(l => <span key={l} className="loc-tag">{locMap[l]||l}</span>)}
        <span className="report-date">{formatDate(report.shiftDate)}</span>
        {report.isNightShift && <span className="night-tag">🌙</span>}
      </div>
      <div className="report-row-right">
        <span className="report-by">{report.submittedByName}</span>
        <span className="report-count">{(report.transfers||[]).length} {t.items}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// REPORT DETAIL
// ─────────────────────────────────────────────
function ReportDetail({ report, onBack }) {
  const { t, lang } = useApp();
  const submittedAt = report.submittedAt?.toDate?.()?.toLocaleString() || "—";
  const locs        = [...new Set((report.transfers||[]).map(tr => tr.location))];
  const locMap      = { bar:"Bar", market:"Market", restaurant:"Restaurant" };

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn-back" onClick={onBack}>← {t.back}</button>
        <h2 className="page-title">{t.reportDetail}</h2>
      </div>
      <div className="detail-card">
        <div className="detail-meta">
          <div><strong>{t.shiftDate}:</strong> {formatDate(report.shiftDate)}</div>
          <div><strong>{t.submittedBy}:</strong> {report.submittedByName}</div>
          <div><strong>{t.submittedAt}:</strong> {submittedAt}</div>
          {report.isNightShift && <div>🌙 {t.nightNote}</div>}
          <div>{locs.map(l => <span key={l} className="loc-tag">{locMap[l]||l}</span>)}</div>
          {report.note && <div><strong>Not:</strong> {report.note}</div>}
        </div>
        <div className="stock-table" style={{ marginTop:"1rem" }}>
          <div className="table-head table-3col">
            <span>{t.product}</span>
            <span className="col-right">{t.location}</span>
            <span className="col-right">{t.qty}</span>
          </div>
          {(report.transfers||[]).map((tr, i) => (
            <div key={i} className="table-row table-3col">
              <span className="item-name">{lang==="tr" ? tr.name : (tr.nameEn||tr.name)}</span>
              <span className="col-right" style={{ color:"#6b7280", fontSize:"0.8rem" }}>
                {locMap[tr.location]||tr.location}
              </span>
              <span className="col-right qty-green">{tr.qty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#f8f7f3; --surface:#fff; --surface2:#f1f0eb; --border:#e4e2d9;
    --text:#1a1917; --text2:#6b6760; --text3:#9e9b93;
    --accent:#0f172a; --accent2:#1e293b; --gold:#d4a853;
    --green:#16a34a; --green-bg:#dcfce7;
    --red:#dc2626; --red-bg:#fee2e2;
    --amber:#d97706; --amber-bg:#fef3c7;
    --blue:#1d4ed8; --blue-bg:#dbeafe;
    --r:8px; --r-sm:5px;
    --shadow:0 1px 3px rgba(0,0,0,.08);
    --shadow-md:0 4px 12px rgba(0,0,0,.1);
    --sw:236px;
    font-family:'DM Sans',system-ui,sans-serif;
  }
  body { background:var(--bg); color:var(--text); -webkit-font-smoothing:antialiased; }
  input,select,textarea,button { font-family:inherit; font-size:inherit; }
  button { cursor:pointer; }
  .app-shell { display:flex; min-height:100vh; }
  .sidebar { width:var(--sw); background:var(--accent); color:#fff; display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:80; overflow-y:auto; transition:transform .25s ease; }
  .sidebar-brand { display:flex; align-items:center; gap:.6rem; padding:1.25rem 1rem .85rem; border-bottom:1px solid rgba(255,255,255,.1); }
  .sidebar-logo { font-size:1.4rem; color:var(--gold); }
  .sidebar-app { font-size:.875rem; font-weight:700; letter-spacing:.03em; }
  .sidebar-role-badge { font-size:.65rem; color:rgba(255,255,255,.4); text-transform:uppercase; letter-spacing:.1em; padding:.4rem 1rem .6rem; }
  .sidebar-nav { flex:1; padding:.4rem 0; }
  .nav-link { display:flex; align-items:center; gap:.7rem; width:100%; padding:.62rem 1rem; background:none; border:none; border-left:2px solid transparent; color:rgba(255,255,255,.6); font-size:.84rem; text-align:left; transition:background .12s,color .12s; }
  .nav-link:hover { background:rgba(255,255,255,.06); color:#fff; }
  .nav-active { background:rgba(255,255,255,.1); color:#fff; border-left-color:var(--gold); }
  .nav-icon { width:18px; text-align:center; font-size:.9rem; }
  .sidebar-footer { padding:.85rem 1rem; border-top:1px solid rgba(255,255,255,.1); }
  .sidebar-user { display:flex; align-items:center; gap:.65rem; margin-bottom:.75rem; }
  .user-avatar { width:30px; height:30px; border-radius:50%; background:var(--gold); color:#0f172a; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.82rem; flex-shrink:0; }
  .user-name { font-size:.82rem; font-weight:600; }
  .user-role { font-size:.68rem; color:rgba(255,255,255,.4); }
  .sidebar-controls { display:flex; align-items:center; justify-content:space-between; }
  .lang-toggle { display:flex; gap:.25rem; }
  .lang-toggle button,.lang-toggle-sm button { padding:.2rem .45rem; border:1px solid rgba(255,255,255,.2); background:none; color:rgba(255,255,255,.5); border-radius:3px; font-size:.68rem; font-weight:700; transition:all .12s; }
  .lang-toggle button.active,.lang-toggle-sm button.active { background:rgba(255,255,255,.15); color:#fff; border-color:rgba(255,255,255,.4); }
  .btn-logout { padding:.25rem .6rem; border:1px solid rgba(255,255,255,.15); background:none; color:rgba(255,255,255,.5); border-radius:var(--r-sm); font-size:.72rem; transition:all .12s; }
  .btn-logout:hover { background:rgba(255,255,255,.08); color:#fff; }
  .mobile-header { display:none; position:sticky; top:0; z-index:70; height:52px; background:var(--accent); color:#fff; align-items:center; padding:0 1rem; gap:.75rem; }
  .hamburger { background:none; border:none; color:#fff; font-size:1.2rem; padding:.25rem; }
  .mobile-title { flex:1; font-size:.875rem; font-weight:700; }
  .lang-toggle-sm { display:flex; gap:.25rem; }
  .mobile-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:70; }
  .main-content { margin-left:var(--sw); flex:1; padding:1.75rem; overflow-x:hidden; }
  .page { max-width:1080px; }
  .page-header { display:flex; align-items:center; gap:.85rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .page-title { font-size:1.35rem; font-weight:700; letter-spacing:-.02em; }
  .badge { background:var(--surface2); border:1px solid var(--border); color:var(--text2); padding:.18rem .6rem; border-radius:20px; font-size:.72rem; font-weight:600; }
  .shift-pill { background:var(--blue-bg); color:var(--blue); padding:.22rem .65rem; border-radius:20px; font-size:.72rem; font-weight:600; }
  .section { margin-bottom:1.75rem; }
  .section-label { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text2); margin-bottom:.6rem; }
  .stat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(175px,1fr)); gap:.75rem; margin-bottom:1.75rem; }
  .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); padding:1rem; display:flex; align-items:flex-start; gap:.85rem; box-shadow:var(--shadow); transition:box-shadow .15s,transform .15s; }
  .stat-card:hover { box-shadow:var(--shadow-md); transform:translateY(-1px); }
  .stat-icon { width:38px; height:38px; border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1rem; flex-shrink:0; }
  .stat-value { font-size:1.6rem; font-weight:700; letter-spacing:-.03em; line-height:1; }
  .stat-label { font-size:.75rem; font-weight:600; color:var(--text2); margin-top:.15rem; }
  .stat-sub { font-size:.68rem; color:var(--red); margin-top:.15rem; }
  .alert-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(155px,1fr)); gap:.5rem; }
  .alert-card { background:var(--red-bg); border:1px solid #fca5a5; border-radius:var(--r-sm); padding:.65rem; }
  .alert-name { font-size:.75rem; font-weight:600; margin-bottom:.3rem; line-height:1.3; }
  .alert-qty { font-size:.82rem; }
  .filter-bar { display:flex; gap:.6rem; margin-bottom:1.1rem; flex-wrap:wrap; }
  .search-input,.filter-select,.note-input,.field-input { padding:.5rem .8rem; border:1px solid var(--border); border-radius:var(--r-sm); background:var(--surface); font-size:.85rem; color:var(--text); outline:none; transition:border-color .12s; }
  .search-input:focus,.filter-select:focus,.note-input:focus,.field-input:focus { border-color:var(--accent); }
  .search-input { flex:1; min-width:170px; }
  .filter-select { min-width:150px; }
  .note-input { flex:1; min-width:200px; }
  .cat-block { margin-bottom:1.2rem; }
  .cat-header { font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--text3); padding:.45rem .75rem; background:var(--surface2); border:1px solid var(--border); border-radius:var(--r-sm) var(--r-sm) 0 0; }
  .stock-table { background:var(--surface); border:1px solid var(--border); border-top:none; border-radius:0 0 var(--r-sm) var(--r-sm); overflow:hidden; }
  .table-head { display:grid; padding:.5rem .75rem; background:var(--surface2); border-bottom:1px solid var(--border); font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--text2); }
  .table-row { display:grid; padding:.55rem .75rem; border-bottom:1px solid var(--border); align-items:center; transition:background .08s; }
  .table-row:last-child { border-bottom:none; }
  .table-row:hover { background:var(--surface2); }
  .row-low { background:#fff5f5; }
  .row-low:hover { background:#ffe4e4; }
  .table-3col { grid-template-columns:1fr 50px 65px; gap:.5rem; }
  .table-4col { grid-template-columns:1fr 60px 50px 75px; gap:.5rem; }
  .item-name { font-size:.82rem; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .item-min { font-size:.75rem; color:var(--text3); }
  .item-qty { font-size:.85rem; font-weight:600; }
  .col-right { text-align:right; }
  .qty-green { color:var(--green); }
  .qty-red { color:var(--red); }
  .qty-sep { color:var(--text3); }
  .tr-input { width:70px; padding:.3rem .45rem; text-align:center; border:1px solid var(--border); border-radius:var(--r-sm); font-size:.82rem; color:var(--text); outline:none; background:var(--surface); transition:border-color .12s; margin-left:auto; }
  .tr-input:focus { border-color:var(--accent); }
  .entry-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:.65rem; }
  .entry-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); padding:.85rem; box-shadow:var(--shadow); }
  .entry-name { font-size:.8rem; font-weight:600; line-height:1.3; margin-bottom:.15rem; }
  .entry-cat { font-size:.68rem; color:var(--text3); text-transform:uppercase; letter-spacing:.06em; margin-bottom:.55rem; }
  .entry-current { font-size:.75rem; color:var(--text2); margin-bottom:.5rem; }
  .entry-current strong { font-size:.88rem; color:var(--text); }
  .entry-row { display:flex; gap:.35rem; }
  .qty-input { flex:1; padding:.42rem .55rem; border:1px solid var(--border); border-radius:var(--r-sm); font-size:.85rem; color:var(--text); outline:none; background:var(--surface); transition:border-color .12s; }
  .qty-input:focus { border-color:var(--accent); }
  .btn-add { width:34px; height:34px; background:var(--accent); color:#fff; border:none; border-radius:var(--r-sm); font-size:1rem; font-weight:700; display:flex; align-items:center; justify-content:center; transition:background .12s,transform .1s; flex-shrink:0; }
  .btn-add:hover { background:var(--accent2); }
  .btn-add:active { transform:scale(.93); }
  .btn-saved { background:var(--green); }
  .btn-override { background:#7c3aed; }
  .btn-override:hover { background:#6d28d9; }
  .report-list { display:flex; flex-direction:column; gap:.35rem; }
  .report-row { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-sm); padding:.65rem .85rem; display:flex; justify-content:space-between; align-items:center; transition:box-shadow .12s; flex-wrap:wrap; gap:.5rem; }
  .report-row:hover { box-shadow:var(--shadow); }
  .report-row-left,.report-row-right { display:flex; align-items:center; gap:.6rem; flex-wrap:wrap; }
  .loc-tag { background:var(--blue-bg); color:var(--blue); padding:.15rem .5rem; border-radius:12px; font-size:.7rem; font-weight:700; }
  .night-tag { font-size:.8rem; }
  .report-date { font-size:.78rem; color:var(--text2); }
  .report-by { font-size:.78rem; color:var(--text2); }
  .report-count { font-size:.7rem; color:var(--text3); }
  .detail-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; box-shadow:var(--shadow); }
  .detail-meta { padding:1rem; display:flex; flex-direction:column; gap:.45rem; background:var(--surface2); border-bottom:1px solid var(--border); font-size:.82rem; }
  .btn-back { background:none; border:1px solid var(--border); color:var(--text2); padding:.35rem .7rem; border-radius:var(--r-sm); font-size:.78rem; transition:all .12s; }
  .btn-back:hover { background:var(--surface2); color:var(--text); }
  .location-tabs { display:flex; gap:.3rem; background:var(--surface2); padding:.28rem; border-radius:var(--r-sm); width:fit-content; margin-bottom:1rem; }
  .loc-tab { padding:.42rem 1rem; background:none; border:none; border-radius:calc(var(--r-sm) - 2px); font-size:.84rem; font-weight:500; color:var(--text2); transition:background .12s,color .12s; }
  .loc-active { background:var(--surface); color:var(--text); font-weight:600; box-shadow:var(--shadow); }
  .submit-bar { display:flex; align-items:center; justify-content:space-between; margin-top:1.25rem; padding:1rem; background:var(--surface); border:1px solid var(--border); border-radius:var(--r); box-shadow:var(--shadow); flex-wrap:wrap; gap:.75rem; }
  .submit-summary { font-size:.82rem; color:var(--text2); }
  .btn-submit { min-width:130px; }
  .success-banner { background:var(--green-bg); color:var(--green); border:1px solid #86efac; border-radius:var(--r-sm); padding:.75rem 1rem; font-weight:600; margin-top:1rem; }
  .night-banner { background:#1e3a5f; color:#93c5fd; border:1px solid #3b82f6; border-radius:var(--r-sm); padding:.65rem .9rem; font-size:.8rem; margin-bottom:1rem; }
  .info-banner { background:var(--blue-bg); color:var(--blue); border-radius:var(--r-sm); padding:.6rem .9rem; font-size:.8rem; margin-bottom:1rem; }
  .info-banner.warning { background:var(--amber-bg); color:var(--amber); }
  .btn-primary { padding:.58rem 1.15rem; background:var(--accent); color:#fff; border:none; border-radius:var(--r-sm); font-size:.875rem; font-weight:600; display:inline-block; transition:background .12s,transform .1s; }
  .btn-primary:hover { background:var(--accent2); }
  .btn-primary:active { transform:scale(.98); }
  .btn-primary:disabled { opacity:.4; cursor:not-allowed; }
  .btn-ghost { padding:.55rem 1.1rem; background:none; color:var(--text2); border:1px solid var(--border); border-radius:var(--r-sm); font-size:.875rem; font-weight:500; transition:all .12s; }
  .btn-ghost:hover { background:var(--surface2); color:var(--text); }
  .login-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--accent); padding:1rem; }
  .login-card { background:var(--surface); border-radius:14px; padding:2.25rem; width:100%; max-width:360px; box-shadow:0 20px 60px rgba(0,0,0,.4); }
  .login-brand { text-align:center; margin-bottom:1.75rem; }
  .login-logo { font-size:2.2rem; color:var(--gold); }
  .login-title { font-size:1.35rem; font-weight:700; margin:.3rem 0 .15rem; letter-spacing:-.02em; }
  .login-sub { font-size:.7rem; color:var(--text3); text-transform:uppercase; letter-spacing:.12em; }
  .login-form { display:flex; flex-direction:column; gap:1rem; }
  .field-group { display:flex; flex-direction:column; gap:.3rem; }
  .field-label { font-size:.72rem; font-weight:700; color:var(--text2); text-transform:uppercase; letter-spacing:.06em; }
  .field-input { width:100%; }
  .login-error { background:var(--red-bg); color:var(--red); border-radius:var(--r-sm); padding:.55rem .8rem; font-size:.8rem; }
  .login-btn { width:100%; margin-top:.25rem; }
  .login-lang { display:flex; justify-content:center; gap:.4rem; margin-top:1rem; }
  .lang-pill { padding:.25rem .6rem; border:1px solid var(--border); background:none; border-radius:var(--r-sm); font-size:.72rem; font-weight:700; color:var(--text2); transition:all .12s; }
  .lang-pill.active { background:var(--accent); color:#fff; border-color:var(--accent); }
  .modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:200; padding:1rem; }
  .modal { background:var(--surface); border-radius:var(--r); padding:1.5rem; max-width:360px; width:100%; box-shadow:0 20px 60px rgba(0,0,0,.3); }
  .modal h3 { font-size:1rem; font-weight:700; margin-bottom:.5rem; }
  .modal-actions { display:flex; gap:.6rem; justify-content:flex-end; margin-top:1.25rem; }
  .toast { position:fixed; bottom:1.25rem; right:1.25rem; padding:.65rem 1.1rem; border-radius:var(--r); font-size:.875rem; font-weight:600; z-index:999; box-shadow:var(--shadow-md); animation:toastIn .2s ease; }
  .toast-success { background:var(--green); color:#fff; }
  .toast-error { background:var(--red); color:#fff; }
  @keyframes toastIn { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
  .empty-msg { color:var(--text3); font-size:.875rem; padding:1.75rem; text-align:center; background:var(--surface2); border-radius:var(--r); border:1px dashed var(--border); }
  @media(max-width:768px) {
    .sidebar{transform:translateX(-100%)}
    .sidebar-open{transform:translateX(0)}
    .mobile-header{display:flex}
    .main-content{margin-left:0;padding:4.5rem 1rem 1rem}
    .stat-grid{grid-template-columns:1fr 1fr}
    .entry-grid{grid-template-columns:1fr 1fr}
    .table-4col{grid-template-columns:1fr 55px 75px}
    .toast{right:.75rem;left:.75rem}
    .location-tabs{width:100%}
    .loc-tab{flex:1;text-align:center}
  }
  @media(max-width:480px) {
    .stat-grid{grid-template-columns:1fr}
    .entry-grid{grid-template-columns:1fr}
    .table-3col{grid-template-columns:1fr 55px}
    .filter-bar{flex-direction:column}
    .search-input,.note-input{min-width:unset}
  }
`;
