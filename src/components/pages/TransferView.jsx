// src/components/pages/TransferView.jsx
import { useState, useMemo } from "react";
import { useApp } from "../../contexts/AppContext.jsx";
import { getShiftDate, formatDate } from "../../utils/helpers.js";
import { getProductsByLocation, groupByCategory } from "../../data/products.js";

const LOCATIONS = [
  { id: "bar",        labelTr: "Bar",        labelEn: "Bar" },
  { id: "market",     labelTr: "Market",     labelEn: "Market" },
  { id: "litre",      labelTr: "Litrelik",   labelEn: "Liter Drinks" },
  { id: "restaurant", labelTr: "Restoran",   labelEn: "Restaurant" },
];

export default function TransferView() {
  const { t, depotStock, allProducts, submitTransfer, lang } = useApp();

  const [location, setLocation]       = useState("bar");
  const [quantities, setQuantities]   = useState({});
  const [note, setNote]               = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [loading, setLoading]         = useState(false);

  const now       = new Date();
  const isNight   = now.getHours() < 6;
  const shiftDate = getShiftDate(now);

  // Only show products for the selected location (strict segregation)
  const locationProducts = useMemo(
    () => allProducts.filter(p => p.location === location),
    [allProducts, location]
  );

  const grouped = useMemo(
    () => groupByCategory(locationProducts, lang),
    [locationProducts, lang]
  );

  const transfers = useMemo(() => {
    return Object.entries(quantities)
      .filter(([, q]) => Number(q) > 0)
      .map(([itemId, qty]) => {
        const p = allProducts.find(x => x.id === itemId);
        return {
          itemId,
          qty: Number(qty),
          name: p?.name || itemId,
          nameEn: p?.nameEn || itemId,
          location,
        };
      });
  }, [quantities, allProducts, location]);

  const totalItems = transfers.length;
  const totalUnits = transfers.reduce((s, tr) => s + tr.qty, 0);

  const handleLocationChange = locId => {
    setLocation(locId);
    setQuantities({});
  };

  const handleSubmit = async () => {
    if (!transfers.length) return;
    setLoading(true);
    try {
      await submitTransfer(transfers, note);
      setQuantities({});
      setNote("");
      setSubmitted(true);
      setShowConfirm(false);
      setTimeout(() => setSubmitted(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill: target − depot = how much to bring
  const autoFill = () => {
    const newQty = {};
    locationProducts.forEach(p => {
      const depotQty  = depotStock[p.id]?.qty ?? 0;
      const needed    = p.targetStock - depotQty; // simplified: target minus depot
      // In practice staff brings needed amount from depot
      const toTransfer = Math.max(0, needed);
      if (toTransfer > 0) newQty[p.id] = String(toTransfer);
    });
    setQuantities(newQty);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.transferForm}</h2>
        <div className="shift-pill">📅 {formatDate(shiftDate)}</div>
      </div>

      {isNight && (
        <div className="night-banner">{t.nightNote}</div>
      )}

      {/* Location tabs */}
      <div className="location-tabs">
        {LOCATIONS.map(loc => (
          <button
            key={loc.id}
            className={`loc-tab ${location === loc.id ? "loc-active" : ""}`}
            onClick={() => handleLocationChange(loc.id)}
          >
            {lang === "tr" ? loc.labelTr : loc.labelEn}
          </button>
        ))}
      </div>

      {/* Note + autofill */}
      <div className="filter-bar">
        <input
          className="note-input" placeholder={`${t.note}...`}
          value={note} onChange={e => setNote(e.target.value)}
        />
        <button className="btn-ghost btn-sm" onClick={autoFill} title="Auto-calculate needed quantities">
          ⚡ {lang === "tr" ? "Otomatik Doldur" : "Auto-Fill"}
        </button>
      </div>

      {/* Transfer helper legend */}
      <div className="transfer-legend">
        <span className="legend-item"><span className="legend-dot depot-dot" />Depo Stok</span>
        <span className="legend-item"><span className="legend-dot target-dot" />{t.targetStock}</span>
        <span className="legend-item"><span className="legend-dot tr-dot" />{t.transferQty}</span>
      </div>

      {/* Products by category, strict to selected location */}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="cat-block">
          <div className="cat-header">
            <span>{cat}</span>
            <span className="cat-count">{items.length}</span>
          </div>
          <div className="stock-table">
            <div className="table-head grid-transfer">
              <span>{t.product}</span>
              <span className="col-right">Depo</span>
              <span className="col-right">{lang === "tr" ? "Hedef" : "Target"}</span>
              <span className="col-right">{t.transferQty}</span>
            </div>
            {items.map(p => {
              const depotQty  = depotStock[p.id]?.qty ?? 0;
              const target    = p.targetStock;
              const needed    = Math.max(0, target - depotQty);
              const isLowDepo = depotQty < 20;
              return (
                <div key={p.id} className={`table-row grid-transfer ${isLowDepo ? "row-low" : ""}`}>
                  <div className="item-name-wrap">
                    <span className="item-name">{lang === "tr" ? p.name : p.nameEn}</span>
                    {needed > 0 && (
                      <span className="need-hint">
                        {t.transferHelper} <strong>{needed}</strong>
                      </span>
                    )}
                  </div>
                  <span className={`col-right fw-bold ${isLowDepo ? "qty-red" : "qty-green"}`}>
                    {depotQty}
                  </span>
                  <span className="col-right item-min">{target}</span>
                  <input
                    type="number" min="0" className="tr-input"
                    placeholder="0"
                    value={quantities[p.id] || ""}
                    onChange={e => setQuantities(q => ({ ...q, [p.id]: e.target.value }))}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {locationProducts.length === 0 && (
        <div className="empty-box">{t.noProducts}</div>
      )}

      {/* Sticky submit bar */}
      <div className="submit-bar">
        <div className="submit-summary">
          {totalItems > 0
            ? <span>{totalItems} {t.items} · {totalUnits} {t.qty}</span>
            : <span style={{ color: "var(--text3)", fontSize: ".8rem" }}>
                {lang === "tr" ? "Miktar giriniz" : "Enter quantities"}
              </span>
          }
        </div>
        <button
          className="btn-primary btn-submit"
          disabled={totalItems === 0}
          onClick={() => setShowConfirm(true)}
        >
          {t.submit} →
        </button>
      </div>

      {submitted && (
        <div className="success-banner">✓ {t.reportSaved}</div>
      )}

      {/* Confirm modal */}
      {showConfirm && (
        <div className="modal-bg">
          <div className="modal">
            <h3 className="modal-title">{t.confirmTransfer}</h3>
            <div className="modal-body">
              <p>
                <strong>{totalUnits}</strong> {t.confirmMsg}
              </p>
              <div className="modal-transfer-list">
                {transfers.slice(0, 6).map(tr => (
                  <div key={tr.itemId} className="modal-tr-row">
                    <span>{lang === "tr" ? tr.name : tr.nameEn}</span>
                    <span className="fw-bold qty-green">+{tr.qty}</span>
                  </div>
                ))}
                {transfers.length > 6 && (
                  <div className="modal-more">+{transfers.length - 6} more…</div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowConfirm(false)}>{t.cancel}</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "…" : t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
