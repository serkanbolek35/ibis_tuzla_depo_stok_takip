// src/data/products.js
// Each product has a STRICT location assignment.
// A product that lives in "bar" must NOT appear in "market".
// The "location" field is the PRIMARY location (for transfer filtering).
// Products shared across locations are duplicated with different IDs.

export const LOCATIONS = {
  bar:        { tr: "Bar",       en: "Bar" },
  market:     { tr: "Market",    en: "Market" },
  restaurant: { tr: "Restoran",  en: "Restaurant" },
  litre:      { tr: "Litrelik",  en: "Liter Drinks" },
};

// Categories (bilingual)
export const CATEGORIES_TR = [
  "Bira", "Meşrubat", "Su/Soda", "Beyaz Şarap", "Kırmızı Şarap",
  "Pembe Şarap", "Şampanya", "Cin", "Vodka", "Viski", "Rakı",
  "Tekila", "Rom", "Konyak", "Vermut", "Likör",
  "Market Ürünü", "1L Soft İçecek", "1L Meyve Suyu",
];

export const PRODUCTS = [
  // ── BAR — BİRA ───────────────────────────────────────────────────────────
  { id:"bar-becks-330",      name:"BECK'S 330 ML",             nameEn:"Beck's 330ml",             cat:"Bira",          catEn:"Beers",         location:"bar",    targetStock:10  },
  { id:"bar-bomonti-500",    name:"BONMONTİ FİLTRESİZ 500ML",  nameEn:"Bomonti 500ml",            cat:"Bira",          catEn:"Beers",         location:"bar",    targetStock:30  },
  { id:"bar-efes-330",       name:"EFES ŞİŞE 330 ML",          nameEn:"Efes Bottle 330ml",        cat:"Bira",          catEn:"Beers",         location:"bar",    targetStock:30  },
  { id:"bar-efes-500",       name:"EFES ŞİŞE 500 ML",          nameEn:"Efes Bottle 500ml",        cat:"Bira",          catEn:"Beers",         location:"bar",    targetStock:30  },
  { id:"bar-heineken-330",   name:"HEİNEKEN 330 ML",           nameEn:"Heineken 330ml",           cat:"Bira",          catEn:"Beers",         location:"bar",    targetStock:10  },
  { id:"bar-miller-330",     name:"MILLER 330 ML",              nameEn:"Miller 330ml",             cat:"Bira",          catEn:"Beers",         location:"bar",    targetStock:10  },

  // ── BAR — MEŞRUBAT ───────────────────────────────────────────────────────
  { id:"bar-coca-cola",      name:"COCA-COLA ŞİŞE 300ML",      nameEn:"Coca-Cola 300ml",          cat:"Meşrubat",      catEn:"Soft Drinks",   location:"bar",    targetStock:28  },
  { id:"bar-cola-zero",      name:"COLA ZERO ŞİŞE 300 ML",     nameEn:"Cola Zero 300ml",          cat:"Meşrubat",      catEn:"Soft Drinks",   location:"bar",    targetStock:28  },
  { id:"bar-fanta-330",      name:"FANTA 330 ML",               nameEn:"Fanta 330ml",              cat:"Meşrubat",      catEn:"Soft Drinks",   location:"bar",    targetStock:14  },
  { id:"bar-sprite-330",     name:"SPRİTE 330 ML",              nameEn:"Sprite 330ml",             cat:"Meşrubat",      catEn:"Soft Drinks",   location:"bar",    targetStock:14  },
  { id:"bar-burn-330",       name:"BURN 330 ML",                nameEn:"Burn 330ml",               cat:"Meşrubat",      catEn:"Soft Drinks",   location:"bar",    targetStock:14  },
  { id:"bar-redbull-250",    name:"REDBULL 250 ML",             nameEn:"Red Bull 250ml",           cat:"Meşrubat",      catEn:"Soft Drinks",   location:"bar",    targetStock:5   },
  { id:"bar-fusetea-lemon",  name:"FUSETEA LEMON 330 ML",       nameEn:"Fusetea Lemon 330ml",      cat:"Meşrubat",      catEn:"Soft Drinks",   location:"bar",    targetStock:5   },
  { id:"bar-fusetea-peach",  name:"FUSETEA PEACH 330 ML",       nameEn:"Fusetea Peach 330ml",      cat:"Meşrubat",      catEn:"Soft Drinks",   location:"bar",    targetStock:5   },

  // ── BAR — SU/SODA ────────────────────────────────────────────────────────
  { id:"bar-damla-soda",     name:"DAMLA SODA 200 ML",          nameEn:"Damla Soda 200ml",         cat:"Su/Soda",       catEn:"Water & Soda",  location:"bar",    targetStock:5   },
  { id:"bar-san-pellegrino", name:"SAN PELLEGRİNO 250 ML",      nameEn:"San Pellegrino 250ml",     cat:"Su/Soda",       catEn:"Water & Soda",  location:"bar",    targetStock:5   },
  { id:"bar-uludag-250",     name:"ULUDAĞ PREMİUM 250 ML",      nameEn:"Uludag Premium 250ml",     cat:"Su/Soda",       catEn:"Water & Soda",  location:"bar",    targetStock:5   },
  { id:"bar-schweppes",      name:"SCHWEPPS TONİC 250 ML",      nameEn:"Schweppes Tonic 250ml",    cat:"Su/Soda",       catEn:"Water & Soda",  location:"bar",    targetStock:5   },
  { id:"bar-uludag-330",     name:"ULUDAĞ CAM SU 330 ML",       nameEn:"Uludag Glass Water 330ml", cat:"Su/Soda",       catEn:"Water & Soda",  location:"bar",    targetStock:40  },
  { id:"bar-uludag-750",     name:"ULUDAĞ CAM SU 750 ML",       nameEn:"Uludag Glass Water 750ml", cat:"Su/Soda",       catEn:"Water & Soda",  location:"bar",    targetStock:40  },

  // ── BAR — BEYAZ ŞARAP ────────────────────────────────────────────────────
  { id:"bar-angora-w",       name:"ANGORA BEYAZ 75 CL",         nameEn:"Angora White 75cl",        cat:"Beyaz Şarap",   catEn:"White Wine",    location:"bar",    targetStock:1   },
  { id:"bar-angora-w-375",   name:"ANGORA BEYAZ 37.5 CL",       nameEn:"Angora White 37.5cl",      cat:"Beyaz Şarap",   catEn:"White Wine",    location:"bar",    targetStock:3   },
  { id:"bar-cankaya-w",      name:"ÇANKAYA BEYAZ 75 CL",        nameEn:"Çankaya White 75cl",       cat:"Beyaz Şarap",   catEn:"White Wine",    location:"bar",    targetStock:3   },
  { id:"bar-cankaya-w-375",  name:"ÇANKAYA BEYAZ 37.5 CL",      nameEn:"Çankaya White 37.5cl",     cat:"Beyaz Şarap",   catEn:"White Wine",    location:"bar",    targetStock:3   },
  { id:"bar-diren-sek",      name:"DİREN SEK BEYAZ 750 ML",     nameEn:"Diren Sek White 750ml",    cat:"Beyaz Şarap",   catEn:"White Wine",    location:"bar",    targetStock:3   },
  { id:"bar-diren-chardonnay",name:"DİREN CHARDONNAY 750 ML",   nameEn:"Diren Chardonnay 750ml",   cat:"Beyaz Şarap",   catEn:"White Wine",    location:"bar",    targetStock:3   },
  { id:"bar-diren-karmen-w", name:"DİREN KARMEN BEYAZ 750 ML",  nameEn:"Diren Karmen White 750ml", cat:"Beyaz Şarap",   catEn:"White Wine",    location:"bar",    targetStock:3   },
  { id:"bar-diren-sel-w",    name:"DİREN SELECTİON BEYAZ 750", nameEn:"Diren Selection White 750ml",cat:"Beyaz Şarap", catEn:"White Wine",    location:"bar",    targetStock:3   },

  // ── BAR — KIRMIZI ŞARAP ──────────────────────────────────────────────────
  { id:"bar-angora-r",       name:"ANGORA KIRMIZI 75 CL",       nameEn:"Angora Red 75cl",          cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"bar",    targetStock:3   },
  { id:"bar-angora-r-375",   name:"ANGORA KIRMIZI 37.5 CL",     nameEn:"Angora Red 37.5cl",        cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"bar",    targetStock:3   },
  { id:"bar-yakut",          name:"YAKUT 75 CL",                nameEn:"Yakut 75cl",               cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"bar",    targetStock:3   },
  { id:"bar-yakut-375",      name:"YAKUT 37.5 CL",              nameEn:"Yakut 37.5cl",             cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"bar",    targetStock:3   },
  { id:"bar-gato-negro",     name:"GATO NEGRO",                 nameEn:"Gato Negro",               cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"bar",    targetStock:3   },
  { id:"bar-diren-mahlep",   name:"DİREN MAHLEP AROMATİZE",     nameEn:"Diren Mahlep Aromatize",   cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"bar",    targetStock:3   },
  { id:"bar-diren-cadde",    name:"DİREN CADDE",                nameEn:"Diren Cadde",              cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"bar",    targetStock:3   },
  { id:"bar-diren-syrah",    name:"DİREN COLLECTİON SYRAH",     nameEn:"Diren Collection Syrah",   cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"bar",    targetStock:3   },
  { id:"bar-diren-karmen-r", name:"DİREN KARMEN KIRMIZI",       nameEn:"Diren Karmen Red",         cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"bar",    targetStock:3   },
  { id:"bar-diren-sel-r",    name:"DİREN SELECTİON KIRMIZI 75",nameEn:"Diren Selection Red 75cl", cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"bar",    targetStock:3   },

  // ── BAR — PEMBE ŞARAP ────────────────────────────────────────────────────
  { id:"bar-kav-lal",        name:"KAVAKLIDERE LAL 75 CL",      nameEn:"Kavaklidere Lal 75cl",     cat:"Pembe Şarap",   catEn:"Rosé Wine",     location:"bar",    targetStock:3   },
  { id:"bar-kav-lal-375",    name:"KAVAKLIDERE LAL 37.5 CL",    nameEn:"Kavaklidere Lal 37.5cl",   cat:"Pembe Şarap",   catEn:"Rosé Wine",     location:"bar",    targetStock:3   },
  { id:"bar-angora-rose",    name:"ANGORA ROSE 75 CL",          nameEn:"Angora Rosé 75cl",         cat:"Pembe Şarap",   catEn:"Rosé Wine",     location:"bar",    targetStock:3   },
  { id:"bar-diren-cadde-r",  name:"DİREN CADDE ROSE 750 ML",    nameEn:"Diren Cadde Rose 750ml",   cat:"Pembe Şarap",   catEn:"Rosé Wine",     location:"bar",    targetStock:3   },
  { id:"bar-diren-karmen-rz",name:"DİREN KARMEN ROSE 750 ML",   nameEn:"Diren Karmen Rose 750ml",  cat:"Pembe Şarap",   catEn:"Rosé Wine",     location:"bar",    targetStock:3   },

  // ── BAR — ŞAMPANYA ───────────────────────────────────────────────────────
  { id:"bar-inci-damlasi",   name:"İNCİ DAMLASI 75 CL",         nameEn:"İnci Damlası 75cl",        cat:"Şampanya",      catEn:"Sparkling",     location:"bar",    targetStock:0   },
  { id:"bar-altin-kopuk",    name:"ALTIN KÖPÜK 75 CL",          nameEn:"Altın Köpük 75cl",         cat:"Şampanya",      catEn:"Sparkling",     location:"bar",    targetStock:0   },

  // ── BAR — CİN ────────────────────────────────────────────────────────────
  { id:"bar-beefeater",      name:"BEEFEATER 70 CL",            nameEn:"Beefeater 70cl",           cat:"Cin",           catEn:"Gin",           location:"bar",    targetStock:17  },
  { id:"bar-gordons",        name:"GORDONS 70 CL",              nameEn:"Gordon's 70cl",            cat:"Cin",           catEn:"Gin",           location:"bar",    targetStock:17  },
  { id:"bar-gilbeys-gin",    name:"CİN GİLBEYS 100 CL",        nameEn:"Gilbeys Gin 100cl",        cat:"Cin",           catEn:"Gin",           location:"bar",    targetStock:25  },

  // ── BAR — VODKA ──────────────────────────────────────────────────────────
  { id:"bar-absolut-100",    name:"ABSOLUT 100 CL",             nameEn:"Absolut 100cl",            cat:"Vodka",         catEn:"Vodka",         location:"bar",    targetStock:25  },
  { id:"bar-smirnoff",       name:"SMİRNOF TRIPLE 100 CL",      nameEn:"Smirnoff Triple 100cl",    cat:"Vodka",         catEn:"Vodka",         location:"bar",    targetStock:25  },
  { id:"bar-gilbeys-vodka",  name:"VOTKA GİLBEYS 100 CL",      nameEn:"Gilbeys Vodka 100cl",      cat:"Vodka",         catEn:"Vodka",         location:"bar",    targetStock:25  },
  { id:"bar-absolut-35",     name:"ABSOLUT 35 CL (ADET)",       nameEn:"Absolut 35cl (bottle)",    cat:"Vodka",         catEn:"Vodka",         location:"bar",    targetStock:1   },

  // ── BAR — VİSKİ ──────────────────────────────────────────────────────────
  { id:"bar-chivas-100",     name:"CHİVAS REGAL 100 CL",        nameEn:"Chivas Regal 100cl",       cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:25  },
  { id:"bar-jack-100",       name:"JACK DANİELS 100 CL",        nameEn:"Jack Daniel's 100cl",      cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:25  },
  { id:"bar-black-label",    name:"BLACK LABEL 100 CL",         nameEn:"Black Label 100cl",        cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:25  },
  { id:"bar-red-label",      name:"RED LABEL 100 CL",           nameEn:"Red Label 100cl",          cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:25  },
  { id:"bar-jb-100",         name:"J&B 100 CL",                 nameEn:"J&B 100cl",                cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:25  },
  { id:"bar-jim-beam",       name:"JİM BEAM 100 CL",            nameEn:"Jim Beam 100cl",           cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:25  },
  { id:"bar-glenlivet",      name:"GLENLİVET 70 CL",            nameEn:"Glenlivet 70cl",           cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:17  },
  { id:"bar-jack-35",        name:"JACK DANİELS 35 CL (ADET)",  nameEn:"Jack Daniel's 35cl",       cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:1   },
  { id:"bar-red-label-35",   name:"RED LABEL 35 CL (ADET)",     nameEn:"Red Label 35cl",           cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:1   },
  { id:"bar-jb-35",          name:"J&B 35 CL (ADET)",           nameEn:"J&B 35cl",                 cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:1   },
  { id:"bar-jim-beam-35",    name:"JİM BEAM 35 CL (ADET)",      nameEn:"Jim Beam 35cl",            cat:"Viski",         catEn:"Whisky",        location:"bar",    targetStock:1   },

  // ── BAR — RAKI ───────────────────────────────────────────────────────────
  { id:"bar-yeni-raki",      name:"YENİ RAKI 100 CL",           nameEn:"Yeni Rakı 100cl",          cat:"Rakı",          catEn:"Raki",          location:"bar",    targetStock:25  },
  { id:"bar-tekirdag",       name:"TEKİRDAĞ RAKI 100 CL",       nameEn:"Tekirdağ Rakı 100cl",      cat:"Rakı",          catEn:"Raki",          location:"bar",    targetStock:25  },
  { id:"bar-gobek",          name:"GÖBEK RAKI 100 CL",          nameEn:"Göbek Rakı 100cl",         cat:"Rakı",          catEn:"Raki",          location:"bar",    targetStock:25  },
  { id:"bar-yeni-raki-35",   name:"YENİ RAKI 35 CL (ADET)",     nameEn:"Yeni Rakı 35cl",           cat:"Rakı",          catEn:"Raki",          location:"bar",    targetStock:1   },
  { id:"bar-tekirdag-35",    name:"TEKİRDAĞ 35 CL (ADET)",      nameEn:"Tekirdağ Rakı 35cl",       cat:"Rakı",          catEn:"Raki",          location:"bar",    targetStock:1   },

  // ── BAR — TEKİLA ─────────────────────────────────────────────────────────
  { id:"bar-olmega-70",      name:"OLMEGA 70 CL",               nameEn:"Olmega 70cl",              cat:"Tekila",        catEn:"Tequila",       location:"bar",    targetStock:17  },
  { id:"bar-olmega-35",      name:"OLMEGA 35 CL (ADET)",        nameEn:"Olmega 35cl",              cat:"Tekila",        catEn:"Tequila",       location:"bar",    targetStock:1   },

  // ── BAR — ROM ────────────────────────────────────────────────────────────
  { id:"bar-bacardi",        name:"BACARDİ 70 CL",              nameEn:"Bacardi 70cl",             cat:"Rom",           catEn:"Rum",           location:"bar",    targetStock:17  },

  // ── BAR — KONYAK ─────────────────────────────────────────────────────────
  { id:"bar-hennessy",       name:"HENNESSY V.S.O.P 70 CL",     nameEn:"Hennessy VSOP 70cl",       cat:"Konyak",        catEn:"Cognac",        location:"bar",    targetStock:17  },

  // ── BAR — VERMUT ─────────────────────────────────────────────────────────
  { id:"bar-martini-bianco", name:"MARTİNİ BİANCO 75 CL",       nameEn:"Martini Bianco 75cl",      cat:"Vermut",        catEn:"Vermouth",      location:"bar",    targetStock:19  },
  { id:"bar-martini-rosso",  name:"MARTİNİ ROSSO 75 CL",        nameEn:"Martini Rosso 75cl",       cat:"Vermut",        catEn:"Vermouth",      location:"bar",    targetStock:19  },

  // ── BAR — LIKÖR ──────────────────────────────────────────────────────────
  { id:"bar-aperol",         name:"APEROL 70 CL",               nameEn:"Aperol 70cl",              cat:"Likör",         catEn:"Liqueur",       location:"bar",    targetStock:17  },
  { id:"bar-ameretto",       name:"AMERETTO 70 CL",             nameEn:"Amaretto 70cl",            cat:"Likör",         catEn:"Liqueur",       location:"bar",    targetStock:17  },
  { id:"bar-baileys",        name:"BAİLEYS 70 CL",              nameEn:"Baileys 70cl",             cat:"Likör",         catEn:"Liqueur",       location:"bar",    targetStock:17  },
  { id:"bar-campari",        name:"CAMPARİ 70 CL",              nameEn:"Campari 70cl",             cat:"Likör",         catEn:"Liqueur",       location:"bar",    targetStock:17  },
  { id:"bar-cointreau",      name:"COİNTREU 70 CL",             nameEn:"Cointreau 70cl",           cat:"Likör",         catEn:"Liqueur",       location:"bar",    targetStock:17  },
  { id:"bar-kahula",         name:"KAHULA 100 CL",              nameEn:"Kahlúa 100cl",             cat:"Likör",         catEn:"Liqueur",       location:"bar",    targetStock:17  },
  { id:"bar-sheridans",      name:"SHERİDANS 70 CL",            nameEn:"Sheridans 70cl",           cat:"Likör",         catEn:"Liqueur",       location:"bar",    targetStock:17  },
  { id:"bar-malibu",         name:"MALİBU 70 CL",               nameEn:"Malibu 70cl",              cat:"Likör",         catEn:"Liqueur",       location:"bar",    targetStock:17  },

  // ─────────────────────────────────────────────────────────────────────────
  // ── MARKET — BİRA ────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────
  { id:"mkt-becks-330",      name:"BECK'S 330 ML",              nameEn:"Beck's 330ml",             cat:"Bira",          catEn:"Beers",         location:"market", targetStock:7   },
  { id:"mkt-bomonti-500",    name:"BONMONTİ FİLTRESİZ 500ML",  nameEn:"Bomonti 500ml",            cat:"Bira",          catEn:"Beers",         location:"market", targetStock:18  },
  { id:"mkt-efes-330",       name:"EFES ŞİŞE 330 ML",          nameEn:"Efes Bottle 330ml",        cat:"Bira",          catEn:"Beers",         location:"market", targetStock:14  },
  { id:"mkt-efes-500",       name:"EFES ŞİŞE 500 ML",          nameEn:"Efes Bottle 500ml",        cat:"Bira",          catEn:"Beers",         location:"market", targetStock:12  },
  { id:"mkt-heineken-330",   name:"HEİNEKEN 330 ML",           nameEn:"Heineken 330ml",           cat:"Bira",          catEn:"Beers",         location:"market", targetStock:7   },
  { id:"mkt-miller-330",     name:"MILLER 330 ML",              nameEn:"Miller 330ml",             cat:"Bira",          catEn:"Beers",         location:"market", targetStock:7   },

  // ── MARKET — MEŞRUBAT ────────────────────────────────────────────────────
  { id:"mkt-coca-cola",      name:"COCA-COLA ŞİŞE 300ML",      nameEn:"Coca-Cola 300ml",          cat:"Meşrubat",      catEn:"Soft Drinks",   location:"market", targetStock:28  },
  { id:"mkt-cola-zero",      name:"COLA ZERO ŞİŞE 300 ML",     nameEn:"Cola Zero 300ml",          cat:"Meşrubat",      catEn:"Soft Drinks",   location:"market", targetStock:28  },
  { id:"mkt-fanta-330",      name:"FANTA 330 ML",               nameEn:"Fanta 330ml",              cat:"Meşrubat",      catEn:"Soft Drinks",   location:"market", targetStock:7   },
  { id:"mkt-sprite-330",     name:"SPRİTE 330 ML",              nameEn:"Sprite 330ml",             cat:"Meşrubat",      catEn:"Soft Drinks",   location:"market", targetStock:7   },
  { id:"mkt-burn-330",       name:"BURN 330 ML",                nameEn:"Burn 330ml",               cat:"Meşrubat",      catEn:"Soft Drinks",   location:"market", targetStock:10  },
  { id:"mkt-redbull-250",    name:"REDBULL 250 ML",             nameEn:"Red Bull 250ml",           cat:"Meşrubat",      catEn:"Soft Drinks",   location:"market", targetStock:10  },
  { id:"mkt-fusetea-lemon",  name:"FUSETEA LEMON 330 ML",       nameEn:"Fusetea Lemon 330ml",      cat:"Meşrubat",      catEn:"Soft Drinks",   location:"market", targetStock:10  },
  { id:"mkt-fusetea-peach",  name:"FUSETEA PEACH 330 ML",       nameEn:"Fusetea Peach 330ml",      cat:"Meşrubat",      catEn:"Soft Drinks",   location:"market", targetStock:10  },
  { id:"mkt-riabo",          name:"RİABO ORGANİK SMOOTHİE",     nameEn:"Riabo Organic Smoothie",   cat:"Meşrubat",      catEn:"Soft Drinks",   location:"market", targetStock:10  },

  // ── MARKET — SU/SODA ─────────────────────────────────────────────────────
  { id:"mkt-san-pellegrino", name:"SAN PELLEGRİNO 250 ML",      nameEn:"San Pellegrino 250ml",     cat:"Su/Soda",       catEn:"Water & Soda",  location:"market", targetStock:8   },
  { id:"mkt-uludag-250",     name:"ULUDAĞ PREMİUM 250 ML",      nameEn:"Uludag Premium 250ml",     cat:"Su/Soda",       catEn:"Water & Soda",  location:"market", targetStock:8   },
  { id:"mkt-schweppes",      name:"SCHWEPPS TONİC 250 ML",      nameEn:"Schweppes Tonic 250ml",    cat:"Su/Soda",       catEn:"Water & Soda",  location:"market", targetStock:8   },
  { id:"mkt-uludag-330",     name:"ULUDAĞ CAM SU 330 ML",       nameEn:"Uludag Glass Water 330ml", cat:"Su/Soda",       catEn:"Water & Soda",  location:"market", targetStock:21  },
  { id:"mkt-uludag-750",     name:"ULUDAĞ CAM SU 750 ML",       nameEn:"Uludag Glass Water 750ml", cat:"Su/Soda",       catEn:"Water & Soda",  location:"market", targetStock:36  },

  // ── MARKET — ŞARAP ───────────────────────────────────────────────────────
  { id:"mkt-cankaya-w",      name:"ÇANKAYA 75 CL",              nameEn:"Çankaya 75cl",             cat:"Beyaz Şarap",   catEn:"White Wine",    location:"market", targetStock:1   },
  { id:"mkt-diren-sek",      name:"DİREN SEK BEYAZ 750 ML",     nameEn:"Diren Sek White 750ml",    cat:"Beyaz Şarap",   catEn:"White Wine",    location:"market", targetStock:1   },
  { id:"mkt-diren-chardonnay",name:"DİREN CHARDONNAY 750 ML",   nameEn:"Diren Chardonnay 750ml",   cat:"Beyaz Şarap",   catEn:"White Wine",    location:"market", targetStock:1   },
  { id:"mkt-diren-karmen-w", name:"DİREN KARMEN 750 ML",        nameEn:"Diren Karmen 750ml",       cat:"Beyaz Şarap",   catEn:"White Wine",    location:"market", targetStock:1   },
  { id:"mkt-diren-sel-w",    name:"DİREN SELECTİON BEYAZ 750", nameEn:"Diren Selection White 750ml",cat:"Beyaz Şarap", catEn:"White Wine",    location:"market", targetStock:1   },
  { id:"mkt-angora-r",       name:"ANGORA KIRMIZI 75 CL",       nameEn:"Angora Red 75cl",          cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"market", targetStock:2   },
  { id:"mkt-yakut",          name:"YAKUT 75 CL",                nameEn:"Yakut 75cl",               cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"market", targetStock:2   },
  { id:"mkt-diren-mahlep",   name:"DİREN MAHLEP AROMATİZE",     nameEn:"Diren Mahlep Aromatize",   cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"market", targetStock:2   },
  { id:"mkt-diren-cadde",    name:"DİREN CADDE",                nameEn:"Diren Cadde",              cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"market", targetStock:2   },
  { id:"mkt-diren-syrah",    name:"DİREN COLLECTİON SYRAH",     nameEn:"Diren Collection Syrah",   cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"market", targetStock:2   },
  { id:"mkt-diren-karmen-r", name:"DİREN KARMEN KIRMIZI",       nameEn:"Diren Karmen Red",         cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"market", targetStock:2   },
  { id:"mkt-diren-sel-r",    name:"DİREN SELECTİON 75 CL",     nameEn:"Diren Selection Red 75cl", cat:"Kırmızı Şarap", catEn:"Red Wine",      location:"market", targetStock:2   },
  { id:"mkt-kav-lal",        name:"KAVAKLIDERE LAL 75 CL",      nameEn:"Kavaklidere Lal 75cl",     cat:"Pembe Şarap",   catEn:"Rosé Wine",     location:"market", targetStock:1   },
  { id:"mkt-angora-rose",    name:"ANGORA ROSE 75 CL",          nameEn:"Angora Rosé 75cl",         cat:"Pembe Şarap",   catEn:"Rosé Wine",     location:"market", targetStock:1   },
  { id:"mkt-diren-cadde-rz", name:"DİREN CADDE ROSE 750 ML",    nameEn:"Diren Cadde Rose 750ml",   cat:"Pembe Şarap",   catEn:"Rosé Wine",     location:"market", targetStock:1   },
  { id:"mkt-diren-karmen-rz",name:"DİREN KARMEN ROSE 750 ML",   nameEn:"Diren Karmen Rose 750ml",  cat:"Pembe Şarap",   catEn:"Rosé Wine",     location:"market", targetStock:1   },

  // ── MARKET — SERT İÇKİ ───────────────────────────────────────────────────
  { id:"mkt-absolut-35",     name:"ABSOLUT 35 CL (Adet)",       nameEn:"Absolut 35cl (bottle)",    cat:"Vodka",         catEn:"Vodka",         location:"market", targetStock:3   },
  { id:"mkt-jack-35",        name:"JACK DANIELS 35 CL",         nameEn:"Jack Daniel's 35cl",       cat:"Viski",         catEn:"Whisky",        location:"market", targetStock:3   },
  { id:"mkt-red-label-35",   name:"RED LABEL 35 CL",            nameEn:"Red Label 35cl",           cat:"Viski",         catEn:"Whisky",        location:"market", targetStock:3   },
  { id:"mkt-jb-35",          name:"J&B 35 CL",                  nameEn:"J&B 35cl",                 cat:"Viski",         catEn:"Whisky",        location:"market", targetStock:3   },
  { id:"mkt-chivas-35",      name:"CHİVAS REGAL 35 CL",         nameEn:"Chivas Regal 35cl",        cat:"Viski",         catEn:"Whisky",        location:"market", targetStock:3   },
  { id:"mkt-jim-beam-35",    name:"JİM BEAM 35 CL",             nameEn:"Jim Beam 35cl",            cat:"Viski",         catEn:"Whisky",        location:"market", targetStock:3   },
  { id:"mkt-inci-damlasi",   name:"İNCİ DAMLASI 75 CL (Adet)",  nameEn:"İnci Damlası 75cl",        cat:"Şampanya",      catEn:"Sparkling",     location:"market", targetStock:1   },
  { id:"mkt-altin-kopuk",    name:"ALTIN KÖPÜK 75 (Adet)",      nameEn:"Altın Köpük 75cl",         cat:"Şampanya",      catEn:"Sparkling",     location:"market", targetStock:1   },
  { id:"mkt-olmega-35",      name:"OLMEGA 35 CL",               nameEn:"Olmega 35cl",              cat:"Tekila",        catEn:"Tequila",       location:"market", targetStock:3   },

  // ── MARKET — YIYECEK ─────────────────────────────────────────────────────
  { id:"mkt-doritos",        name:"DORİTOS",                    nameEn:"Doritos",                  cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:5   },
  { id:"mkt-ruffles",        name:"RUFFLES",                    nameEn:"Ruffles",                  cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:5   },
  { id:"mkt-karisik-cerez",  name:"KARIŞIK ÇEREZ 200GR",        nameEn:"Mixed Nuts 200g",          cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:5   },
  { id:"mkt-badem",          name:"BADEM 200 GR",               nameEn:"Almonds 200g",             cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:5   },
  { id:"mkt-findik",         name:"FINDIK 200 GR",              nameEn:"Hazelnuts 200g",           cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:5   },
  { id:"mkt-kaju",           name:"KAJU 200 GR",                nameEn:"Cashews 200g",             cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:5   },
  { id:"mkt-tuzlu-fistik",   name:"TUZLU FISTIK 200 GR",        nameEn:"Salted Peanuts 200g",      cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:5   },
  { id:"mkt-mcvities",       name:"MCVİTİES BİSKÜVİ",           nameEn:"McVitie's Biscuits",       cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-milka",          name:"ÇİKOLATA MİLKA",             nameEn:"Milka Chocolate",          cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-metro-big",      name:"ÇİKOLATA METRO BIG",         nameEn:"Metro Big Chocolate",      cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-snickers",       name:"ÇİKOLATA SNİCKERS",          nameEn:"Snickers",                 cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-toblerone",      name:"ÇİKOLATA TOBLERONE",         nameEn:"Toblerone",                cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-damak",          name:"ÇİKOLATA DAMAK",             nameEn:"Damak Chocolate",          cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-godiva",         name:"ÇİKOLATA GODİVA",            nameEn:"Godiva Chocolate",         cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-zuber",          name:"ZÜBER BAR",                  nameEn:"Züber Bar",                cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-grissini",       name:"GRİSSİNİ ÇUBUK KRAKER",      nameEn:"Grissini Breadsticks",     cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:5   },
  { id:"mkt-noodle",         name:"NOODLE",                     nameEn:"Noodle",                   cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-sandvic",        name:"ÜÇGEN SANDVİÇ",              nameEn:"Triangle Sandwich",        cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-eti-form",       name:"ETİ FORM",                   nameEn:"Eti Form",                 cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },
  { id:"mkt-biscolata",      name:"BİSCOLATA STİX",             nameEn:"Biscolata Stix",           cat:"Market Ürünü",  catEn:"Food",          location:"market", targetStock:10  },

  // ─────────────────────────────────────────────────────────────────────────
  // ── LİTRELİK İÇECEKLER (Market/Restaurant shared section) ────────────────
  // ─────────────────────────────────────────────────────────────────────────
  { id:"lt-kola-1lt",        name:"KOLA 1 LT",                  nameEn:"Cola 1L",                  cat:"1L Soft İçecek",catEn:"Liter Soft Drinks",location:"litre",targetStock:8   },
  { id:"lt-kola-zero-1lt",   name:"KOLA ZERO 1 LT",             nameEn:"Cola Zero 1L",             cat:"1L Soft İçecek",catEn:"Liter Soft Drinks",location:"litre",targetStock:8   },
  { id:"lt-fanta-1lt",       name:"FANTA 1 LT",                 nameEn:"Fanta 1L",                 cat:"1L Soft İçecek",catEn:"Liter Soft Drinks",location:"litre",targetStock:8   },
  { id:"lt-sprite-1lt",      name:"SPRİTE 1 LT",                nameEn:"Sprite 1L",                cat:"1L Soft İçecek",catEn:"Liter Soft Drinks",location:"litre",targetStock:8   },
  { id:"lt-fusetea-lemon",   name:"FUSETEA LİMON 1 LT",         nameEn:"Fusetea Lemon 1L",         cat:"1L Soft İçecek",catEn:"Liter Soft Drinks",location:"litre",targetStock:8   },
  { id:"lt-fusetea-peach",   name:"FUSETEA ŞEFTALİ 1 LT",       nameEn:"Fusetea Peach 1L",         cat:"1L Soft İçecek",catEn:"Liter Soft Drinks",location:"litre",targetStock:8   },
  { id:"lt-visne",           name:"VİŞNE SUYU 1 LT",            nameEn:"Cherry Juice 1L",          cat:"1L Meyve Suyu",  catEn:"Liter Juices",  location:"litre", targetStock:8   },
  { id:"lt-elma",            name:"ELMA SUYU 1 LT",             nameEn:"Apple Juice 1L",           cat:"1L Meyve Suyu",  catEn:"Liter Juices",  location:"litre", targetStock:8   },
  { id:"lt-kayisi",          name:"KAYISI SUYU 1 LT",           nameEn:"Apricot Juice 1L",         cat:"1L Meyve Suyu",  catEn:"Liter Juices",  location:"litre", targetStock:8   },
  { id:"lt-seftali",         name:"ŞEFTALİ SUYU 1 LT",          nameEn:"Peach Juice 1L",           cat:"1L Meyve Suyu",  catEn:"Liter Juices",  location:"litre", targetStock:8   },
];

// Unique locations present in PRODUCTS
export const PRODUCT_LOCATIONS = [...new Set(PRODUCTS.map(p => p.location))];

// Get products for a specific location
export function getProductsByLocation(location) {
  return PRODUCTS.filter(p => p.location === location);
}

// Get all categories for a location
export function getCategoriesForLocation(location, lang = "tr") {
  const prods = getProductsByLocation(location);
  return [...new Set(prods.map(p => lang === "tr" ? p.cat : p.catEn))];
}

// Group products by category
export function groupByCategory(products, lang = "tr") {
  const grouped = {};
  products.forEach(p => {
    const cat = lang === "tr" ? p.cat : p.catEn;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });
  return grouped;
}
