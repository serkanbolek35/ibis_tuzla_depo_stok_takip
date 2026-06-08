// src/components/pages/AddProductView.jsx
import { useState, useMemo } from "react";
import { useApp } from "../../contexts/AppContext.jsx";
import { PRODUCTS, LOCATIONS } from "../../data/products.js";

const LOCATION_OPTIONS = [
  { id: "bar",        labelTr: "Bar",        labelEn: "Bar" },
  { id: "market",     labelTr: "Market",     labelEn: "Market" },
  { id: "litre",      labelTr: "Litrelik",   labelEn: "Liter Drinks" },
  { id: "restaurant", labelTr: "Restoran",   labelEn: "Restaurant" },
];

function generateId(name, location) {
  return `${location}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}-${Date.now()}`;
}

export default function AddProductView() {
  const { t, lang, addProduct, deleteProduct, allProducts, depotStock } = useApp();

  const [form, setForm] = useState({
    name: "", nameEn: "", location: "bar",
    cat: "", catEn: "", targetStock: "", initialQty: "",
    useNewCat: false, newCatTr: "", newCatEn: "",
  });
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors]   = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("add"); // "add" | "manage"

  // Existing categories for selected location
  const existingCats = useMemo(() => {
    const prods = allProducts.filter(p => p.location === form.location);
    return [...new Set(prods.map(p => ({ tr: p.cat, en: p.catEn }))
      .filter(c => c.tr)
      .map(c => JSON.stringify(c))
    )].map(s => JSON.parse(s));
  }, [allProducts, form.location]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = lang === "tr" ? "Ürün adı zorunlu" : "Product name required";
    if (!form.location) e.location = lang === "tr" ? "Konum seçin" : "Select location";
    const catTr = form.useNewCat ? form.newCatTr : form.cat;
    const catEn = form.useNewCat ? form.newCatEn : form.catEn;
    if (!catTr.trim()) e.cat = lang === "tr" ? "Kategori zorunlu" : "Category required";
    if (isNaN(Number(form.targetStock)) || Number(form.targetStock) < 0)
      e.targetStock = lang === "tr" ? "Geçerli bir sayı girin" : "Enter a valid number";
    if (isNaN(Number(form.initialQty)) || Number(form.initialQty) < 0)
      e.initialQty = lang === "tr" ? "Geçerli bir sayı girin" : "Enter a valid number";
    return e;
  };

  const handleAdd = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const catTr = form.useNewCat ? form.newCatTr.trim() : form.cat;
      const catEn = form.useNewCat ? form.newCatEn.trim() : form.catEn;
      const product = {
        id: generateId(form.name, form.location),
        name: form.name.trim().toUpperCase(),
        nameEn: form.nameEn.trim() || form.name.trim(),
        cat: catTr,
        catEn: catEn || catTr,
        location: form.location,
        targetStock: Number(form.targetStock) || 0,
        isDynamic: true,
      };
      await addProduct(product, Number(form.initialQty) || 0);
      setForm({ name: "", nameEn: "", location: form.location, cat: "", catEn: "",
        targetStock: "", initialQty: "", useNewCat: false, newCatTr: "", newCatEn: "" });
      setErrors({});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    await deleteProduct(id);
    setConfirmDelete(null);
  };

  const dynamicProducts = allProducts.filter(p => p.isDynamic);
  const locLabel = id => LOCATION_OPTIONS.find(l => l.id === id)?.[lang === "tr" ? "labelTr" : "labelEn"] || id;

  const field = (key, label, type = "text", placeholder = "") => (
    <div className="form-field">
      <label className="field-label">{label}</label>
      <input
        type={type} className={`field-input ${errors[key] ? "field-error" : ""}`}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(err => ({ ...err, [key]: "" })); }}
      />
      {errors[key] && <span className="error-hint">{errors[key]}</span>}
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{t.addProduct}</h2>
      </div>

      {/* Tab switcher */}
      <div className="tab-switcher">
        <button className={`tab-btn ${activeTab === "add" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("add")}>
          {lang === "tr" ? "➕ Yeni Ürün" : "➕ New Product"}
        </button>
        <button className={`tab-btn ${activeTab === "manage" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("manage")}>
          {lang === "tr" ? "📋 Dinamik Ürünler" : "📋 Dynamic Products"} ({dynamicProducts.length})
        </button>
      </div>

      {/* ── ADD PRODUCT FORM ── */}
      {activeTab === "add" && (
        <div className="form-card">
          {success && <div className="success-banner">✓ {t.productAdded}</div>}

          {/* Step 1: Location */}
          <div className="form-step">
            <div className="form-step-label">
              <span className="step-num">1</span>
              {t.locationLabel}
            </div>
            <div className="location-grid">
              {LOCATION_OPTIONS.map(loc => (
                <button
                  key={loc.id}
                  className={`loc-select-btn ${form.location === loc.id ? "loc-select-active" : ""}`}
                  onClick={() => setForm(f => ({ ...f, location: loc.id, cat: "", catEn: "", useNewCat: false }))}
                >
                  {lang === "tr" ? loc.labelTr : loc.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Category */}
          <div className="form-step">
            <div className="form-step-label">
              <span className="step-num">2</span>
              {t.categoryLabel}
            </div>
            {existingCats.length > 0 && (
              <div className="cat-chips">
                {existingCats.map(c => (
                  <button
                    key={c.tr}
                    className={`cat-chip ${!form.useNewCat && form.cat === c.tr ? "cat-chip-active" : ""}`}
                    onClick={() => setForm(f => ({ ...f, cat: c.tr, catEn: c.en, useNewCat: false }))}
                  >
                    {lang === "tr" ? c.tr : c.en}
                  </button>
                ))}
                <button
                  className={`cat-chip cat-chip-new ${form.useNewCat ? "cat-chip-active" : ""}`}
                  onClick={() => setForm(f => ({ ...f, useNewCat: true, cat: "", catEn: "" }))}
                >
                  + {lang === "tr" ? "Yeni" : "New"}
                </button>
              </div>
            )}

            {(form.useNewCat || existingCats.length === 0) && (
              <div className="new-cat-fields">
                <input className="field-input" placeholder={lang === "tr" ? "Kategori (TR)" : "Category (TR)"}
                  value={form.newCatTr}
                  onChange={e => setForm(f => ({ ...f, newCatTr: e.target.value }))} />
                <input className="field-input" placeholder={lang === "tr" ? "Kategori (EN)" : "Category (EN)"}
                  value={form.newCatEn}
                  onChange={e => setForm(f => ({ ...f, newCatEn: e.target.value }))} />
              </div>
            )}
            {errors.cat && <span className="error-hint">{errors.cat}</span>}
          </div>

          {/* Step 3: Product Details */}
          <div className="form-step">
            <div className="form-step-label">
              <span className="step-num">3</span>
              {lang === "tr" ? "Ürün Detayları" : "Product Details"}
            </div>
            <div className="form-grid">
              {field("name", t.productName, "text", "ÖRNEK ÜRÜN 330 ML")}
              {field("nameEn", t.productNameEn, "text", "Example Product 330ml")}
              {field("targetStock", t.targetStock, "number", "10")}
              {field("initialQty", t.initialStock, "number", "0")}
            </div>
          </div>

          {/* Summary preview */}
          {form.name && (
            <div className="form-preview">
              <div className="preview-label">{lang === "tr" ? "Önizleme" : "Preview"}</div>
              <div className="preview-row">
                <span className={`loc-pill loc-${form.location}`}>{locLabel(form.location)}</span>
                <span>{form.useNewCat ? form.newCatTr : form.cat}</span>
                <span>→</span>
                <strong>{form.name.toUpperCase()}</strong>
              </div>
            </div>
          )}

          <button className="btn-primary btn-full" onClick={handleAdd} disabled={saving}>
            {saving ? "…" : `➕ ${t.addProduct}`}
          </button>
        </div>
      )}

      {/* ── MANAGE DYNAMIC PRODUCTS ── */}
      {activeTab === "manage" && (
        <div>
          {dynamicProducts.length === 0 ? (
            <div className="empty-box">
              {lang === "tr" ? "Henüz dinamik ürün eklenmedi." : "No dynamic products added yet."}
            </div>
          ) : (
            <div className="manage-list">
              {dynamicProducts.map(p => (
                <div key={p.id} className="manage-row">
                  <div className="manage-row-info">
                    <div className="manage-name">{lang === "tr" ? p.name : p.nameEn}</div>
                    <div className="manage-meta">
                      <span className={`loc-pill loc-${p.location} loc-pill-sm`}>{locLabel(p.location)}</span>
                      <span className="text-muted">{lang === "tr" ? p.cat : p.catEn}</span>
                      <span className="text-muted">
                        {t.depotStock}: <strong>{depotStock[p.id]?.qty ?? 0}</strong>
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-danger-sm"
                    onClick={() => setConfirmDelete(p)}
                    title={t.deleteProduct}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="modal-bg">
          <div className="modal">
            <h3 className="modal-title">{t.deleteProduct}</h3>
            <div className="modal-body">
              <p>{t.confirmDelete}</p>
              <p style={{ marginTop: ".5rem", fontWeight: 600 }}>
                {lang === "tr" ? confirmDelete.name : confirmDelete.nameEn}
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>{t.no}</button>
              <button className="btn-danger" onClick={() => handleDelete(confirmDelete.id)}>
                {t.yes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
