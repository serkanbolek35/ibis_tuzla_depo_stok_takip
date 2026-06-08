// src/components/pages/DepotView.jsx
import { useState } from "react";
import { useApp } from "../../contexts/AppContext.jsx";
import { groupByCategory } from "../../data/products.js";
import { exportToCSV } from "../../utils/helpers.js";

const LOC_LABELS = { bar: "Bar", market: "Market", restaurant: "Restoran", litre: "Litrelik" };

export default function DepotView() {
  const { t, depotStock, allProducts, lang } = useApp();
  const [search, setSearch]       = useState("");
  const [locFilter, setLocFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");

  const locations = ["all", ...new Set(allProducts.map(p => p.location))];

  const filtered = allProducts.filter(p => {
    const name   = lang === "tr" ? p.name : p.nameEn;
    const locOk  = locFilter === "all" || p.location === locFilter;
    const catOk  = catFilter === "all" || (lang === "tr" ? p.cat : p.catEn) === catFilter;
    const srchOk = name.toLowerCase().includes(search.toLowerCase());
    return locOk && catOk && srchOk;
  });

  const availableCats = [...new Set(
    allProducts
      .filter(p => locFilter === "all" || p.location === locFilter)
      .map(p => lang === "tr" ? p.cat : p.catEn)
  )];

  const grouped = groupByCategory(filtered, lang);
  const lowCount = filtered.filter(p => (depotStock[p.id]?.qty ?? 0) < 20).length;

  const handleExport = () => {
    const rows = filtered.map(p => ({
      ID: p.id,
      [lang === "tr" ? "Ürün" : "Product"]: lang === "tr" ? p.name : p.nameEn,
      [lang === "tr" ? "Kategori" : "Category"]: lang === "tr" ? p.cat : p.catEn,
      [lang === "tr" ? "Konum" : "Location"]: p.location,
      [lang === "tr" ? "Hedef Stok" : "Target Stock"]: p.targetStock,
      [lang === "tr" ? "Depo Stok" : "Depot Stock"]: depotStock[p.id]?.qty ?? 0,
    }));
    exportToCSV(rows, "ibis-tuzla-depot.csv");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.depot}</h2>
        <div style={{ display: "flex", gap: ".5rem", alignItems: "center", flexWrap: "wrap" }}>
          {lowCount > 0 && (
            <span className="low-badge">⚠ {lowCount} {t.totalLow}</span>
          )}
          <span className="badge">{filtered.length} {t.items}</span>
          <button className="btn-ghost btn-sm" onClick={handleExport}>⬇ {t.exportCsv}</button>
        </div>
      </div>

      <div className="info-banner">ℹ {t.depotStockNote}</div>

      {/* Filters */}
      <div className="filter-bar">
        <input className="search-input" placeholder={t.search}
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={locFilter}
          onChange={e => { setLocFilter(e.target.value); setCatFilter("all"); }}>
          <option value="all">{t.allLocations}</option>
          {locations.filter(l => l !== "all").map(l =>
            <option key={l} value={l}>{LOC_LABELS[l] || l}</option>
          )}
        </select>
        <select className="filter-select" value={catFilter}
          onChange={e => setCatFilter(e.target.value)}>
          <option value="all">{t.allCats}</option>
          {availableCats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="empty-box">{t.noProducts}</div>
      )}

      {Object.entries(grouped).map(([cat, items]) => {
        const locName = locFilter === "all"
          ? (LOC_LABELS[items[0]?.location] || items[0]?.location)
          : null;
        return (
          <div key={cat} className="cat-block">
            <div className="cat-header">
              {locName && <span className={`loc-pill loc-${items[0]?.location}`}>{locName}</span>}
              <span>{cat}</span>
              <span className="cat-count">{items.length}</span>
            </div>
            <div className="stock-table">
              <div className="table-head grid-depot">
                <span>{t.product}</span>
                <span className="col-right">{t.targetStock}</span>
                <span className="col-right">{t.depotStock}</span>
              </div>
              {items.map(p => {
                const qty   = depotStock[p.id]?.qty ?? 0;
                const isLow = qty < 20;
                return (
                  <div key={p.id} className={`table-row grid-depot ${isLow ? "row-low" : ""}`}>
                    <span className="item-name">{lang === "tr" ? p.name : p.nameEn}</span>
                    <span className="col-right item-min">{p.targetStock}</span>
                    <span className={`col-right fw-bold ${isLow ? "qty-red" : "qty-green"}`}>{qty}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
