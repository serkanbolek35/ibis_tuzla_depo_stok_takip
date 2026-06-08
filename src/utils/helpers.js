// src/utils/helpers.js

/**
 * Night-shift date rule:
 * If the current time is between 00:00 and 05:59, the shift date is the PREVIOUS day.
 * Example: 2026-06-06 02:00 → shiftDate = "2026-06-05"
 */
export function getShiftDate(now = new Date()) {
  const base = new Date(now);
  if (now.getHours() < 6) base.setDate(base.getDate() - 1);
  return base.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

/** Format "YYYY-MM-DD" → "DD/MM/YYYY" */
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

/** Format a Firebase Timestamp or JS Date to locale string */
export function formatTimestamp(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("tr-TR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/** Export data array to CSV and trigger download */
export function exportToCSV(rows, filename = "export.csv") {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csvContent = [
    keys.join(","),
    ...rows.map(r =>
      keys.map(k => {
        const val = r[k] ?? "";
        const s   = String(val).replace(/"/g, '""');
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s;
      }).join(",")
    ),
  ].join("\n");
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/** Debounce helper */
export function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
