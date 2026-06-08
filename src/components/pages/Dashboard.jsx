// src/components/pages/Dashboard.jsx
import { useApp } from "../../contexts/AppContext.jsx";
import { getShiftDate, formatDate, formatTimestamp } from "../../utils/helpers.js";

export default function Dashboard({ onNavigate }) {
  const { t, depotStock, reports, isAdmin, lang, allProducts } = useApp();

  const today       = getShiftDate();
  const lowProducts = allProducts.filter(p => (depotStock[p.id]?.qty ?? 0) < 20);
  const todayReps   = reports.filter(r => r.shiftDate === today);
  const totalItems  = allProducts.length;

  const stats = [
    {
      icon: "📦", label: t.totalProducts, value: totalItems,
      sub: `${allProducts.filter(p => p.location === "bar").length} bar · ${allProducts.filter(p => p.location === "market").length} market`,
      color: "#1e3a5f", action: isAdmin ? "depot" : null,
    },
    {
      icon: "📋", label: t.todayTransfers, value: todayReps.length,
      sub: formatDate(today), color: "#14532d", action: "reports",
    },
    {
      icon: "⚠️", label: t.totalLow, value: lowProducts.length,
      sub: t.depotOnly, color: lowProducts.length > 0 ? "#7f1d1d" : "#14532d",
      action: isAdmin ? "depot" : null,
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.dashboard}</h2>
        <div className="shift-pill">📅 {formatDate(today)}</div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {stats.map(s => (
          <div
            key={s.label}
            className="stat-card"
            style={{ cursor: s.action ? "pointer" : "default" }}
            onClick={() => s.action && onNavigate(s.action)}
          >
            <div className="stat-icon-wrap" style={{ background: s.color }}>
              <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
            </div>
            <div className="stat-body">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Low stock alerts — admins only */}
      {isAdmin && lowProducts.length > 0 && (
        <div className="section">
          <div className="section-label alert-label">
            {t.lowStockAlert} {t.depotOnly}
          </div>
          <div className="alert-grid">
            {lowProducts.slice(0, 9).map(p => {
              const qty = depotStock[p.id]?.qty ?? 0;
              return (
                <div key={p.id} className="alert-card">
                  <div className="alert-name">{lang === "tr" ? p.name : p.nameEn}</div>
                  <div className="alert-meta">
                    <span className="loc-pill loc-pill-sm">{p.location}</span>
                  </div>
                  <div className="alert-qty">
                    <span className="qty-red fw-bold">{qty}</span>
                    <span className="qty-sep"> / 20</span>
                  </div>
                </div>
              );
            })}
          </div>
          {lowProducts.length > 9 && (
            <button className="view-all-btn" onClick={() => onNavigate("depot")}>
              {t.viewAll} ({lowProducts.length})
            </button>
          )}
        </div>
      )}

      {/* Today's reports */}
      <div className="section">
        <div className="section-label">{t.reports} — {formatDate(today)}</div>
        {todayReps.length === 0 ? (
          <div className="empty-box">{t.noReports}</div>
        ) : (
          <div className="report-list">
            {todayReps.slice(0, 5).map(r => (
              <ReportRowSimple key={r.id} report={r} />
            ))}
            {todayReps.length > 5 && (
              <button className="view-all-btn" onClick={() => onNavigate("reports")}>
                {t.viewAll} ({todayReps.length})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReportRowSimple({ report }) {
  const { t, lang } = useApp();
  const locMap = { bar: "Bar", market: "Market", restaurant: "Restaurant", litre: "Litrelik" };
  const locs   = [...new Set((report.transfers || []).map(tr => tr.location))];
  return (
    <div className="report-row">
      <div className="report-row-left">
        {locs.map(l => <span key={l} className={`loc-pill loc-${l}`}>{locMap[l] || l}</span>)}
        {report.isNightShift && <span className="night-tag" title="Gece vardiyası">🌙</span>}
      </div>
      <div className="report-row-right">
        <span className="report-by">{report.submittedByName}</span>
        <span className="report-count">{(report.transfers || []).length} {t.items}</span>
      </div>
    </div>
  );
}
