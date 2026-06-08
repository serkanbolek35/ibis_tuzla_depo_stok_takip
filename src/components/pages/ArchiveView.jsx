// src/components/pages/ArchiveView.jsx
import { useState, useMemo } from "react";
import { useApp } from "../../contexts/AppContext.jsx";
import { formatDate } from "../../utils/helpers.js";
import { ReportDetail } from "./ReportsView.jsx";

const LOC_MAP = { bar: "Bar", market: "Market", restaurant: "Restaurant", litre: "Litrelik" };

export default function ArchiveView() {
  const { t, reports } = useApp();
  const [dateFilter, setDateFilter] = useState("all");
  const [locFilter, setLocFilter]   = useState("all");
  const [selected, setSelected]     = useState(null);

  const dates = useMemo(
    () => [...new Set(reports.map(r => r.shiftDate))].sort().reverse(),
    [reports]
  );

  const filtered = useMemo(() => {
    return reports.filter(r => {
      const dateOk = dateFilter === "all" || r.shiftDate === dateFilter;
      const locOk  = locFilter  === "all" ||
        (r.transfers || []).some(tr => tr.location === locFilter);
      return dateOk && locOk;
    });
  }, [reports, dateFilter, locFilter]);

  if (selected) {
    return <ReportDetail report={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.archive}</h2>
        <span className="badge">{filtered.length}</span>
      </div>

      <div className="filter-bar">
        <select className="filter-select" value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}>
          <option value="all">{t.allDates}</option>
          {dates.map(d => <option key={d} value={d}>{formatDate(d)}</option>)}
        </select>
        <select className="filter-select" value={locFilter}
          onChange={e => setLocFilter(e.target.value)}>
          <option value="all">{t.allLocations}</option>
          {Object.entries(LOC_MAP).map(([id, label]) =>
            <option key={id} value={id}>{label}</option>
          )}
        </select>
      </div>

      {/* Group by date */}
      {filtered.length === 0 ? (
        <div className="empty-box">{t.noReports}</div>
      ) : (
        <>
          {dates
            .filter(d => dateFilter === "all" || d === dateFilter)
            .map(date => {
              const dayReports = filtered.filter(r => r.shiftDate === date);
              if (!dayReports.length) return null;
              return (
                <div key={date} className="section">
                  <div className="section-label">{formatDate(date)}</div>
                  <div className="report-list">
                    {dayReports.map(r => (
                      <ArchiveRow key={r.id} report={r} onClick={() => setSelected(r)} />
                    ))}
                  </div>
                </div>
              );
            })
          }
        </>
      )}
    </div>
  );
}

function ArchiveRow({ report, onClick }) {
  const { t } = useApp();
  const locs  = [...new Set((report.transfers || []).map(tr => tr.location))];
  const total = (report.transfers || []).reduce((s, tr) => s + (tr.qty || 0), 0);

  return (
    <div className="report-row clickable" onClick={onClick}>
      <div className="report-row-left">
        {locs.map(l => <span key={l} className={`loc-pill loc-${l}`}>{LOC_MAP[l] || l}</span>)}
        {report.isNightShift && <span className="night-tag">🌙</span>}
      </div>
      <div className="report-row-right">
        <span className="report-by">{report.submittedByName}</span>
        <span className="report-count">{(report.transfers || []).length} {t.items} · {total} {t.qty}</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{opacity:.4}}>
          <polyline points="9,18 15,12 9,6"/>
        </svg>
      </div>
    </div>
  );
}
