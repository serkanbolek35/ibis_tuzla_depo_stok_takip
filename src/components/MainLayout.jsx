// src/components/MainLayout.jsx
import { useState } from "react";
import { useApp } from "../contexts/AppContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DepotView from "./pages/DepotView.jsx";
import StockEntryView from "./pages/StockEntryView.jsx";
import OverrideView from "./pages/OverrideView.jsx";
import ReportsView from "./pages/ReportsView.jsx";
import ArchiveView from "./pages/ArchiveView.jsx";
import TransferView from "./pages/TransferView.jsx";
import AddProductView from "./pages/AddProductView.jsx";

const ICONS = {
  dashboard: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  depot: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  stockEntry: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  override: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  reports: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  ),
  archive: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="21,8 21,21 3,21 3,8"/>
      <rect x="1" y="3" width="22" height="5"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  ),
  transfer: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="17,1 21,5 17,9"/>
      <path d="M3 11V9a4 4 0 014-4h14"/>
      <polyline points="7,23 3,19 7,15"/>
      <path d="M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  ),
  addProduct: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
      <circle cx="12" cy="12" r="1"/>
      <line x1="12" y1="2" x2="12" y2="7"/>
      <line x1="12" y1="17" x2="12" y2="22"/>
    </svg>
  ),
};

export default function MainLayout() {
  const { t, isAdmin, userName, userRole, logout, lang, setLang } = useApp();
  const [page, setPage]             = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminNav = [
    { id: "dashboard",   icon: ICONS.dashboard,   label: t.navDashboard },
    { id: "depot",       icon: ICONS.depot,       label: t.navDepot },
    { id: "stock-entry", icon: ICONS.stockEntry,  label: t.navStockEntry },
    { id: "override",    icon: ICONS.override,    label: t.navOverride },
    { id: "reports",     icon: ICONS.reports,     label: t.navReports },
    { id: "archive",     icon: ICONS.archive,     label: t.navArchive },
    { id: "add-product", icon: ICONS.addProduct,  label: t.navAddProduct },
  ];
  const staffNav = [
    { id: "dashboard", icon: ICONS.dashboard, label: t.navDashboard },
    { id: "transfer",  icon: ICONS.transfer,  label: t.navTransfer },
    { id: "reports",   icon: ICONS.reports,   label: t.navReports },
  ];
  const nav = isAdmin ? adminNav : staffNav;

  const go = id => { setPage(id); setMobileOpen(false); };

  const pageContent = () => {
    if (page === "dashboard")   return <Dashboard onNavigate={go} />;
    if (page === "depot"       && isAdmin) return <DepotView />;
    if (page === "stock-entry" && isAdmin) return <StockEntryView />;
    if (page === "override"    && isAdmin) return <OverrideView />;
    if (page === "reports")    return <ReportsView />;
    if (page === "archive"     && isAdmin) return <ArchiveView />;
    if (page === "transfer"    && !isAdmin) return <TransferView />;
    if (page === "add-product" && isAdmin) return <AddProductView />;
    return <Dashboard onNavigate={go} />;
  };

  const initials = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo">⬡</span>
          <div>
            <div className="sidebar-app-name">{t.appName}</div>
          </div>
        </div>

        <div className="sidebar-role-badge">
          {isAdmin ? t.adminPanel : t.staffPanel}
        </div>

        <nav className="sidebar-nav">
          {nav.map(n => (
            <button
              key={n.id}
              className={`nav-link ${page === n.id ? "nav-active" : ""}`}
              onClick={() => go(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{initials || "?"}</div>
            <div className="user-info">
              <div className="user-name">{userName.split(" ")[0]}</div>
              <div className="user-role">{isAdmin ? "Admin" : "Staff"}</div>
            </div>
          </div>
          <div className="sidebar-controls">
            <div className="lang-toggle">
              <button className={lang === "tr" ? "active" : ""} onClick={() => setLang("tr")}>TR</button>
              <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
            </div>
            <button className="btn-logout" onClick={logout}>{t.logout}</button>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* MOBILE HEADER */}
      <header className="mobile-header">
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <span className="mobile-title">{t.appName}</span>
        <div className="lang-toggle-sm">
          <button className={lang === "tr" ? "active" : ""} onClick={() => setLang("tr")}>TR</button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
      </header>

      {/* MAIN */}
      <main className="main-content">{pageContent()}</main>
    </div>
  );
}
