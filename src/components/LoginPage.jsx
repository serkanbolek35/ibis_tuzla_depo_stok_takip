// src/components/LoginPage.jsx
import { useState } from "react";
import { useApp } from "../contexts/AppContext.jsx";

export default function LoginPage() {
  const { t, login, lang, setLang } = useApp();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async e => {
    e?.preventDefault();
    setError(""); setLoading(true);
    try { await login(email, password); }
    catch { setError(t.loginErr); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">⬡</div>
          <h1 className="login-title">İBİS TUZLA</h1>
          <p className="login-sub">Stock Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label className="field-label">{t.email}</label>
            <input
              type="email" className="field-input" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@ibis.com.tr" autoComplete="email"
            />
          </div>
          <div className="field-group">
            <label className="field-label">{t.password}</label>
            <input
              type="password" className="field-input" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password"
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? t.loading : t.loginBtn}
          </button>
        </form>

        <div className="login-lang">
          <button className={`lang-pill ${lang === "tr" ? "active" : ""}`} onClick={() => setLang("tr")}>TR</button>
          <button className={`lang-pill ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
        </div>
      </div>
    </div>
  );
}
