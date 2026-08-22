import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginAdmin(email, password);
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.error || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-surface border border-surface-light p-8 space-y-4"
      >
        <h1 className="font-display font-bold text-2xl text-center mb-2">تسجيل الدخول</h1>

        <label className="block">
          <span className="block text-xs text-muted mb-1">البريد الإلكتروني</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-ink border border-surface-light px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block">
          <span className="block text-xs text-muted mb-1">كلمة المرور</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-ink border border-surface-light px-3 py-2.5 text-sm"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gold text-ink font-display font-bold py-2.5 hover:bg-gold-dim transition-colors disabled:opacity-50"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}