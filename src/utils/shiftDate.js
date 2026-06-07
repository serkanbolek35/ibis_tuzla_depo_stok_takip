// ============================================================
// src/utils/shiftDate.js
// Gece vardiyası tarih kuralı / Night shift date rule
// ============================================================
//
// KURAL / RULE:
//   00:00 – 05:59 → önceki günün vardiyası / previous day's shift
//   06:00 – 23:59 → aynı günün vardiyası / same day's shift
//
// ÖRNEK / EXAMPLE:
//   06 Haz 2026 02:30 → shiftDate = "2026-06-05"  ✓
//   06 Haz 2026 08:00 → shiftDate = "2026-06-06"  ✓
// ============================================================

/**
 * Verilen anı esas alarak doğru vardiya tarihini döndürür.
 * Returns the correct shift date (YYYY-MM-DD) for a given moment.
 *
 * @param {Date} now - Tarih (varsayılan: şu an / default: now)
 * @returns {string} "YYYY-MM-DD"
 */
export function getShiftDate(now = new Date()) {
  const base = new Date(now);
  // Gece yarısından sabah 06:00'a kadar → bir önceki gün
  // Midnight to 05:59 → belongs to the previous calendar day
  if (now.getHours() < 6) {
    base.setDate(base.getDate() - 1);
  }
  return base.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

/**
 * "YYYY-MM-DD" formatını "DD/MM/YYYY" olarak gösterir.
 * Formats "YYYY-MM-DD" → "DD/MM/YYYY" for display.
 *
 * @param {string} dateStr - "2026-06-05"
 * @returns {string} "05/06/2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Şu anki vardiyada gece mi? (00:00–05:59 aralığı)
 * Is the current time within the night shift window?
 *
 * @param {Date} now
 * @returns {boolean}
 */
export function isNightShift(now = new Date()) {
  return now.getHours() < 6;
}
