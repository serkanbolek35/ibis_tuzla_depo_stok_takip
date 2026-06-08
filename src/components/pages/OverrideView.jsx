// src/components/pages/OverrideView.jsx
import { useState } from "react";
import { useApp } from "../../contexts/AppContext.jsx";

const LOC_LABELS = { bar: "Bar", market: "Market", restaurant: "Restoran", litre: "Litrelik" };

export default function OverrideView() {
  const { t, depotStock, allProducts, overrideStock, lang } = useApp();
  const [search, setSearch]   = useState("");
  const [locFilter, setLocFilter] = useState("all");
  const [values, setValues]   = useState({});
  const [saved, setSaved]     = useState({});
  const [loading, setLoading] = useState({});

  const locations = ["all", ...new Set(allProducts.map(p => p.location))];

  const filtered = allProducts.filter(p => {
    const name  = lang === "tr" ? p.name : p.nameEn;
    const locOk = locFilter === "all" || p.location === locFilter;
    return locOk && name.toLowerCase().includes(search.toLowerCase());
  });

  const handle = async itemId => {
    const val = values[itemId];
    const qty = parseInt(val);
    if (isNaN(qty) || qty < 0) return;
    setLoading(l => ({ ...l, [itemId]: true }));
    try {
      await overrideStock(itemId, qty);
      setSaved(s => ({ ...s, [itemId]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [itemId]: false })), 2000);
    } finally {
      setLoading(l => ({ ...l, [itemId]: false }));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.override}</h2>
      </div>
      <div className="info-banner warning">⚠ {t.setQty}</div>

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

      <div className="entry-grid">
        {filtered.map(p => {
          const cur = depotStock[p.id]?.qty ?? 0;
          return (
            <div key={p.id} className="entry-card">
              <div className="entry-card-top">
                <div className="entry-name">{lang === "tr" ? p.name : p.nameEn}</div>
                <span className={`loc-pill loc-${p.location} loc-pill-sm`}>
                  {LOC_LABELS[p.location] || p.location}
                </span>
              </div>
              <div className="entry-cat">{lang === "tr" ? p.cat : p.catEn}</div>
              <div className="entry-stock-row">
                <span className="entry-stock-label">{t.currentStock}</span>
                <span className="entry-stock-val fw-bold">{cur}</span>
              </div>
              <div className="entry-row">
                <input
                  type="number" min="0" className="qty-input"
                  placeholder={String(cur)}
                  value={values[p.id] ?? ""}
                  onChange={e => setValues(v => ({ ...v, [p.id]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handle(p.id)}
                />
                <button
                  className={`btn-add btn-override ${saved[p.id] ? "btn-saved" : ""}`}
                  onClick={() => handle(p.id)}
                  disabled={loading[p.id]}
                >
                  {saved[p.id] ? "✓" : loading[p.id] ? "…" : "✎"}
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
