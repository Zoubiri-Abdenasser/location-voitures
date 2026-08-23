import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient.post("/auth/register", {
        email,
        password,
        full_name: fullName || undefined,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-surface-alt">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-surface border border-border shadow-sm p-8 space-y-4"
      >
        <h1 className="font-display font-bold text-2xl text-center mb-2">
          إنشاء حساب المالك
        </h1>
        <p className="text-xs text-muted text-center mb-2">
          هذه الصفحة تعمل مرة واحدة فقط عند إعداد الموقع لأول مرة
        </p>

        <label className="block">
          <span className="block text-xs text-muted mb-1">الاسم الكامل</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block">
          <span className="block text-xs text-muted mb-1">البريد الإلكتروني</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block">
          <span className="block text-xs text-muted mb-1">كلمة المرور</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2.5 text-sm"
          />
          <span className="block text-[11px] text-muted mt-1">
            8 أحرف على الأقل، حرف كبير ورقم واحد على الأقل
          </span>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gold text-ink font-display font-bold py-2.5 hover:bg-gold-dim transition-colors disabled:opacity-50"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
        </button>
      </form>
    </div>
  );
}