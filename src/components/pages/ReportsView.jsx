// src/components/pages/ReportsView.jsx
import { useState } from "react";
import { useApp } from "../../contexts/AppContext.jsx";
import { getShiftDate, formatDate, formatTimestamp, exportToCSV } from "../../utils/helpers.js";

const LOC_MAP = { bar: "Bar", market: "Market", restaurant: "Restaurant", litre: "Litrelik" };

export default function ReportsView() {
  const { t, reports } = useApp();
  const [selected, setSelected] = useState(null);

  const today      = getShiftDate();
  const todayReps  = reports.filter(r => r.shiftDate === today);

  if (selected) {
    return <ReportDetail report={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.reports}</h2>
        <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <span className="shift-pill">📅 {formatDate(today)}</span>
          <span className="badge">{todayReps.length}</span>
        </div>
      </div>

      {todayReps.length === 0 ? (
        <div className="empty-box">{t.noReports}</div>
      ) : (
        <div className="report-list">
          {todayReps.map(r => (
            <ReportRow key={r.id} report={r} onClick={() => setSelected(r)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportRow({ report, onClick }) {
  const { t } = useApp();
  const locs  = [...new Set((report.transfers || []).map(tr => tr.location))];

  return (
    <div className="report-row clickable" onClick={onClick}>
      <div className="report-row-left">
        {locs.map(l => <span key={l} className={`loc-pill loc-${l}`}>{LOC_MAP[l] || l}</span>)}
        {report.isNightShift && <span className="night-tag" title="Gece vardiyası">🌙</span>}
      </div>
      <div className="report-row-right">
        <span className="report-by">{report.submittedByName}</span>
        <span className="report-count">{(report.transfers || []).length} {t.items}</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{opacity:.4}}>
          <polyline points="9,18 15,12 9,6"/>
        </svg>
      </div>
    </div>
  );
}

export function ReportDetail({ report, onBack }) {
  const { t, lang } = useApp();
  const submittedAt = formatTimestamp(report.submittedAt);
  const locs = [...new Set((report.transfers || []).map(tr => tr.location))];

  const handleExport = () => {
    const rows = (report.transfers || []).map(tr => ({
      [lang === "tr" ? "Ürün" : "Product"]: lang === "tr" ? tr.name : (tr.nameEn || tr.name),
      [lang === "tr" ? "Konum" : "Location"]: LOC_MAP[tr.location] || tr.location,
      [lang === "tr" ? "Miktar" : "Qty"]: tr.qty,
    }));
    exportToCSV(rows, `report-${report.shiftDate}.csv`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn-back" onClick={onBack}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          {t.back}
        </button>
        <h2 className="page-title">{t.reportDetail}</h2>
        <button className="btn-ghost btn-sm" onClick={handleExport}>⬇ CSV</button>
      </div>

      <div className="detail-card">
        <div className="detail-meta">
          <div className="detail-meta-row">
            <span className="detail-meta-key">{t.shiftDate}</span>
            <span className="detail-meta-val">{formatDate(report.shiftDate)}</span>
          </div>
          <div className="detail-meta-row">
            <span className="detail-meta-key">{t.submittedBy}</span>
            <span className="detail-meta-val">{report.submittedByName}</span>
          </div>
          <div className="detail-meta-row">
            <span className="detail-meta-key">{t.submittedAt}</span>
            <span className="detail-meta-val">{submittedAt}</span>
          </div>
          <div className="detail-meta-row">
            <span className="detail-meta-key">{t.location}</span>
            <span style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
              {locs.map(l => <span key={l} className={`loc-pill loc-${l}`}>{LOC_MAP[l] || l}</span>)}
              {report.isNightShift && <span className="night-tag">🌙</span>}
            </span>
          </div>
          {report.note && (
            <div className="detail-meta-row">
              <span className="detail-meta-key">{t.note}</span>
              <span className="detail-meta-val">{report.note}</span>
            </div>
          )}
        </div>

        <div className="stock-table">
          <div className="table-head grid-report-detail">
            <span>{t.product}</span>
            <span className="col-right">{t.location}</span>
            <span className="col-right">{t.qty}</span>
          </div>
          {(report.transfers || []).map((tr, i) => (
            <div key={i} className="table-row grid-report-detail">
              <span className="item-name">{lang === "tr" ? tr.name : (tr.nameEn || tr.name)}</span>
              <span className="col-right" style={{ color: "var(--text3)", fontSize: ".78rem" }}>
                {LOC_MAP[tr.location] || tr.location}
              </span>
              <span className="col-right qty-green fw-bold">{tr.qty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
