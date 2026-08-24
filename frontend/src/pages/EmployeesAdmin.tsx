import { useEffect, useState } from "react";
import { fetchEmployees, createEmployee, deleteEmployee, getStoredAdmin } from "../api/auth";
import type { Admin } from "../types";

export default function EmployeesAdmin() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const currentAdmin = getStoredAdmin();

  function load() {
    setLoading(true);
    fetchEmployees()
      .then(setAdmins)
      .catch(() => setAdmins([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createEmployee({ email, password, full_name: fullName || undefined });
      setEmail("");
      setPassword("");
      setFullName("");
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.error || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(admin: Admin) {
    const confirmed = window.confirm(`هل أنت متأكد من حذف حساب ${admin.email}؟`);
    if (!confirmed) return;
    await deleteEmployee(admin.id);
    load();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-display font-bold text-xl sm:text-2xl">إدارة الحسابات</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-gold text-ink font-display font-bold px-5 py-2.5 hover:bg-gold-dim transition-colors"
        >
          {showForm ? "إلغاء" : "+ إضافة موظف"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl bg-surface border border-border p-6 space-y-4 mb-8"
        >
          <h2 className="font-display font-bold">حساب موظف جديد</h2>

          <label className="block">
            <span className="block text-xs text-muted mb-1">الاسم الكامل</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1">البريد الإلكتروني</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1">كلمة المرور</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
            />
            <span className="block text-[11px] text-muted mt-1">
              8 أحرف على الأقل، حرف كبير ورقم واحد على الأقل
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gold text-ink font-display font-bold px-6 py-2.5 hover:bg-gold-dim transition-colors disabled:opacity-50"
          >
            {saving ? "جاري الإضافة..." : "إضافة الموظف"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-muted">جاري التحميل...</p>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-muted text-xs">
              <tr>
                <th className="text-right p-3">الاسم</th>
                <th className="text-right p-3">البريد الإلكتروني</th>
                <th className="text-right p-3">الدور</th>
                <th className="text-right p-3"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-t border-border bg-surface">
                  <td className="p-3">{admin.full_name || "—"}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 ${
                        admin.role === "manager"
                          ? "text-gold-dim bg-gold/10"
                          : "text-muted bg-surface-alt"
                      }`}
                    >
                      {admin.role === "manager" ? "مدير" : "موظف"}
                    </span>
                  </td>
                  <td className="p-3 text-left">
                    {admin.id !== currentAdmin?.id && (
                      <button
                        onClick={() => handleDelete(admin)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        حذف
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}