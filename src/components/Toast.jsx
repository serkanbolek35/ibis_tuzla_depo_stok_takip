// src/components/Toast.jsx
import { useApp } from "../contexts/AppContext.jsx";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      {toast.msg}
    </div>
  );
}
