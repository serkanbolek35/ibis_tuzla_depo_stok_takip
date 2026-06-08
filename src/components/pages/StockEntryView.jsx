// src/components/pages/StockEntryView.jsx
import { useState } from "react";
import { useApp } from "../../contexts/AppContext.jsx";

const LOC_LABELS = { bar: "Bar", market: "Market", restaurant: "Restoran", litre: "Litrelik" };

export default function StockEntryView() {
  const { t, depotStock, allProducts, addStock, lang } = useApp();
  const [search, setSearch] = useState("");
  const [locFilter, setLocFilter] = useState("all");
  const [values, setValues] = useState({});
  const [note, setNote]     = useState("");
  const [saved, setSaved]   = useState({});
  const [loading, setLoading] = useState({});

  const locations = ["all", ...new Set(allProducts.map(p => p.location))];

  const filtered = allProducts.filter(p => {
    const name = lang === "tr" ? p.name : p.nameEn;
    const locOk = locFilter === "all" || p.location === locFilter;
    return locOk && name.toLowerCase().includes(search.toLowerCase());
  });

  const handle = async itemId => {
    const qty = parseInt(values[itemId]);
    if (!qty || qty <= 0) return;
    setLoading(l => ({ ...l, [itemId]: true }));
    try {
      await addStock(itemId, qty, note);
      setValues(v => ({ ...v, [itemId]: "" }));
      setSaved(s => ({ ...s, [itemId]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [itemId]: false })), 2000);
    } finally {
      setLoading(l => ({ ...l, [itemId]: false }));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.stockEntry}</h2>
      </div>
      <div className="info-banner">
        ℹ {t.addQty}
      </div>

      {/* Filters + note */}
      <div className="filter-bar">
        <input className="search-input" placeholder={t.search}
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={locFilter}
          onChange={e => setLocFilter(e.target.value)}>
          <option value="all">{t.allLocations}</option>
          {locations.filter(l => l !== "all").map(l =>
            <option key={l} value={l}>{LOC_LABELS[l] || l}</option>
          )}
        </select>
      </div>
      <div className="filter-bar" style={{ marginTop: 0 }}>
        <input className="note-input" placeholder={t.addNote}
          value={note} onChange={e => setNote(e.target.value)} />
      </div>

      <div className="entry-grid">
        {filtered.map(p => {
          const cur   = depotStock[p.id]?.qty ?? 0;
          const isLow = cur < 20;
          return (
            <div key={p.id} className={`entry-card ${isLow ? "entry-card-low" : ""}`}>
              <div className="entry-card-top">
                <div className="entry-name">{lang === "tr" ? p.name : p.nameEn}</div>
                <span className={`loc-pill loc-${p.location} loc-pill-sm`}>
                  {LOC_LABELS[p.location] || p.location}
                </span>
              </div>
              <div className="entry-cat">{lang === "tr" ? p.cat : p.catEn}</div>
              <div className="entry-stock-row">
                <span className="entry-stock-label">{t.depotStock}</span>
                <span className={`entry-stock-val ${isLow ? "qty-red" : "qty-green"}`}>{cur}</span>
              </div>
              <div className="entry-row">
                <input
                  type="number" min="1" className="qty-input"
                  placeholder={t.enterQty}
                  value={values[p.id] || ""}
                  onChange={e => setValues(v => ({ ...v, [p.id]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handle(p.id)}
                />
                <button
                  className={`btn-add ${saved[p.id] ? "btn-saved" : ""}`}
                  onClick={() => handle(p.id)}
                  disabled={loading[p.id]}
                >
                  {saved[p.id] ? "✓" : loading[p.id] ? "…" : "+"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="empty-box">{t.noProducts}</div>}
    </div>
  );
}
