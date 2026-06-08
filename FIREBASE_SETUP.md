# Firebase & .env Setup Guide — İbis Tuzla Stock v2

## ─────────────────────────────────────────
## PART 1 — CREATE YOUR FIREBASE PROJECT
## ─────────────────────────────────────────

### Step 1: Create the project
1. Go to https://console.firebase.google.com
2. Click **"Add project"** → name it `ibis-tuzla-stock`
3. Disable Google Analytics (optional) → **Create project**

### Step 2: Enable Authentication
1. Left sidebar → **Build → Authentication**
2. Click **"Get started"**
3. **Sign-in method** tab → Enable **Email/Password**
4. Go to **Users** tab → **Add user** for each person:

| Email                          | Password (you set) | Role  |
|-------------------------------|-------------------|-------|
| emrahkarakus@ibis.com.tr      | ••••••••          | admin |
| ferdiasik@ibis.com.tr         | ••••••••          | admin |
| enecan@ibis.com.tr            | ••••••••          | staff |
| iremcetinkaya@ibis.com.tr     | ••••••••          | staff |
| pinarturkel@ibis.com.tr       | ••••••••          | staff |
| serkanbolek@ibis.com.tr       | ••••••••          | staff |
| zeynepguven@ibis.com.tr       | ••••••••          | staff |
| ayephokho@ibis.com.tr         | ••••••••          | staff |
| zinmyohtet@ibis.com.tr        | ••••••••          | staff |

5. **Copy each user's UID** (the long string in the Users table)

### Step 3: Enable Firestore
1. Left sidebar → **Build → Firestore Database**
2. Click **"Create database"**
3. Select **Production mode**
4. Choose region: **europe-west1** (closest to Turkey)

### Step 4: Deploy Firestore Security Rules
1. Go to **Firestore → Rules** tab
2. Replace contents with the code from `firestore.rules` in this repo
3. Click **Publish**

### Step 5: Get your Web App config
1. Project settings (⚙ gear icon, top-left) → **Your apps**
2. Click the Web icon `</>`
3. Register app name: `ibis-tuzla-web`
4. Copy the `firebaseConfig` object — you'll need these values

---

## ─────────────────────────────────────────
## PART 2 — ENVIRONMENT VARIABLES (.env)
## ─────────────────────────────────────────

### Why .env?
Firebase API keys are technically public (they identify your project),
but keeping them in `.env` means:
- They never appear in your Git history
- You can rotate them without code changes
- GitHub won't expose them in your public repo

### The Golden Rule
```
.env  →  NEVER commit  (listed in .gitignore)
.env.example  →  ALWAYS commit  (shows teammates what variables are needed)
```

### Step 1: Create `.env` in your project root

```bash
# Copy the example file
cp .env.example .env
```

Then fill it in with your real values from Firebase console:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=ibis-tuzla-stock.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ibis-tuzla-stock
VITE_FIREBASE_STORAGE_BUCKET=ibis-tuzla-stock.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxx
```

> ⚠️ All Vite env vars MUST start with `VITE_` to be accessible in the browser.

### Step 2: Verify .gitignore contains `.env`
Check your `.gitignore` — it already includes:
```
.env
.env.local
.env.development
.env.production
```

### Step 3: Check before pushing
```bash
git status  # .env must NOT appear here
cat .gitignore | grep env  # should show .env
```

---

## ─────────────────────────────────────────
## PART 3 — UPDATE USER UIDs
## ─────────────────────────────────────────

After creating users in Firebase Auth, you need to paste their UIDs into
`src/contexts/AppContext.jsx`. Find this section:

```js
const SEED_USERS = [
  { uid: "REPLACE_UID_EMRAH",  email: "emrahkarakus@ibis.com.tr", ... },
  ...
];
```

Replace each `REPLACE_UID_*` with the actual UID from:
Firebase Console → Authentication → Users → (click user) → User UID

---

## ─────────────────────────────────────────
## PART 4 — FIRESTORE DATA MODEL
## ─────────────────────────────────────────

```
Firestore
├── users/{uid}
│     email:       "emrahkarakus@ibis.com.tr"
│     name:        "Emrah Karakuş"
│     role:        "admin" | "staff"
│     createdAt:   Timestamp
│
├── depot_stock/{productId}
│     itemId:      "bar-becks-330"
│     name:        "BECK'S 330 ML"
│     nameEn:      "Beck's 330ml"
│     category:    "Bira"
│     categoryEn:  "Beers"
│     location:    "bar"        ← strict assignment
│     targetStock: 10           ← par/min stock for that location
│     qty:         45           ← current depot quantity
│     minAlert:    20           ← alert threshold (depot only)
│     lastUpdated: Timestamp
│     lastUpdatedBy: uid
│
├── products/{productId}        ← admin-added dynamic products only
│     (same shape as depot_stock meta fields)
│     isDynamic:   true
│     createdAt:   Timestamp
│     createdBy:   uid
│
├── reports/{auto-id}
│     shiftDate:      "2026-06-05"   ← night-shift date rule applied
│     submittedAt:    Timestamp      ← actual submit time
│     submittedBy:    uid
│     submittedByName:"Serkan Bölek"
│     isNightShift:   true           ← true if submitted 00:00–05:59
│     location:       "bar"
│     transfers: [
│       { itemId, name, nameEn, qty, location }
│       ...
│     ]
│     note:           "Optional note"
│
└── stock_entries/{auto-id}          ← audit trail
      itemId:     "bar-becks-330"
      qtyAdded:   50                 ← for +add operations
      qtySet:     120                ← for override operations
      type:       "add" | "override"
      addedBy:    uid
      addedAt:    Timestamp
      note:       "Shipment June"
```

### Location/Category Strict Segregation Rule

Products in `depot_stock` have a `location` field that MUST match one of:
- `"bar"` — Bar products (spirits, wines, beers for bar)
- `"market"` — Market products (retail bottles, food snacks)
- `"litre"` — Liter drinks (1L soft drinks, juices)
- `"restaurant"` — Restaurant-specific items

In the UI, when staff selects "Bar" in the Transfer Form,
the app filters: `allProducts.filter(p => p.location === "bar")`
This guarantees Bar staff NEVER sees Market or Litre products.

---

## ─────────────────────────────────────────
## PART 5 — NIGHT SHIFT DATE RULE
## ─────────────────────────────────────────

```js
// src/utils/helpers.js
export function getShiftDate(now = new Date()) {
  const base = new Date(now);
  if (now.getHours() < 6) base.setDate(base.getDate() - 1);
  return base.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

// Examples:
// 2026-06-06 02:00 → shiftDate = "2026-06-05" ✓  (night shift → previous day)
// 2026-06-06 07:00 → shiftDate = "2026-06-06" ✓  (normal → same day)
// 2026-06-06 23:59 → shiftDate = "2026-06-06" ✓  (late night but before midnight)
```

---

## ─────────────────────────────────────────
## PART 6 — RUN LOCALLY
## ─────────────────────────────────────────

```bash
# 1. Install dependencies
npm install

# 2. Create .env and fill in Firebase config
cp .env.example .env
# edit .env with your values

# 3. Start dev server
npm run dev

# 4. Open http://localhost:5173
```

---

## ─────────────────────────────────────────
## PART 7 — DEPLOY TO GITHUB PAGES
## ─────────────────────────────────────────

### Option A: GitHub Pages (via gh-pages)
```bash
# 1. In package.json, set:
#    "homepage": "https://YOUR_USERNAME.github.io/ibis-tuzla-stock"

# 2. Build and deploy
npm run build
npm run deploy
```

### Option B: Vercel / Netlify (recommended — supports env vars)
1. Connect your GitHub repo
2. In Vercel/Netlify dashboard → **Environment Variables**
3. Add all 6 `VITE_FIREBASE_*` variables
4. Deploy

> ✅ Vercel/Netlify are preferred because they handle env vars securely
> and provide HTTPS automatically.

---

## ─────────────────────────────────────────
## PART 8 — GITHUB SECURITY CHECKLIST
## ─────────────────────────────────────────

Before `git push`, verify:

```bash
# .env must NOT be tracked
git ls-files | grep "\.env$"      # should return nothing

# Check .gitignore is correct  
cat .gitignore | grep "\.env"     # should show .env

# Run final check
git status                         # .env must not appear
```

If you accidentally committed .env:
```bash
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Remove .env from tracking"
git push
# Also rotate your Firebase API key in Firebase Console > Project Settings
```

---

## ─────────────────────────────────────────
## PROJECT FILE STRUCTURE
## ─────────────────────────────────────────

```
ibis-tuzla-stock/
├── .env                          ← YOUR SECRETS (never commit)
├── .env.example                  ← Template (safe to commit)
├── .gitignore
├── firestore.rules               ← Firestore security rules
├── FIREBASE_SETUP.md             ← This file
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                   ← Root, wraps AppProvider
    ├── main.jsx                  ← React DOM entry point
    ├── firebase.js               ← Firebase init (reads from .env)
    ├── styles/
    │   └── global.css            ← All styles
    ├── contexts/
    │   └── AppContext.jsx        ← Global state, auth, realtime data
    ├── data/
    │   ├── products.js           ← Static product catalogue (~150 items)
    │   └── i18n.js               ← TR/EN translations
    ├── utils/
    │   └── helpers.js            ← getShiftDate, formatDate, exportCSV
    ├── services/
    │   └── stockService.js       ← All Firestore operations
    └── components/
        ├── LoginPage.jsx
        ├── MainLayout.jsx        ← Sidebar + mobile nav
        ├── Toast.jsx
        ├── LoadingScreen.jsx
        └── pages/
            ├── Dashboard.jsx     ← Overview + low stock alerts
            ├── DepotView.jsx     ← Admin: all depot stock
            ├── StockEntryView.jsx ← Admin: +add incoming stock
            ├── OverrideView.jsx  ← Admin: manual stock correction
            ├── TransferView.jsx  ← Staff: transfer form with par stock helper
            ├── ReportsView.jsx   ← Today's reports
            ├── ArchiveView.jsx   ← Admin: historical reports
            └── AddProductView.jsx ← Admin: add/manage dynamic products
```
