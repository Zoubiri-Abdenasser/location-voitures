import { useEffect, useState } from "react";
import { fetchReservations, updateReservationStatus } from "../api/reservations";
import type { Reservation, ReservationStatus } from "../types";
import { logoutAdmin } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

const statusLabels: Record<ReservationStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  cancelled: "ملغى",
  completed: "منتهي",
};

const statusColors: Record<ReservationStatus, string> = {
  pending: "text-gold-dim bg-gold/10",
  confirmed: "text-green-700 bg-green-100",
  cancelled: "text-red-700 bg-red-100",
  completed: "text-muted bg-surface-alt",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetchReservations()
      .then(setReservations)
      .catch(() => setReservations([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(id: string, status: ReservationStatus) {
    await updateReservationStatus(id, status);
    load();
  }

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl">لوحة التحكم</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/cars"
            className="text-sm rounded-lg border border-gold text-gold-dim px-4 py-2 hover:bg-gold hover:text-ink transition-colors"
          >
            إدارة الأسطول
          </Link>
          <button
            onClick={() => {
              logoutAdmin();
              navigate("/login");
            }}
            className="text-sm text-muted hover:text-ink"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "إجمالي الحجوزات", value: stats.total },
          { label: "قيد الانتظار", value: stats.pending },
          { label: "مؤكدة", value: stats.confirmed },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-surface border border-border p-5">
            <p className="text-xs text-muted mb-1">{s.label}</p>
            <p className="font-display font-extrabold text-2xl text-gold-dim">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display font-bold text-lg mb-4">الحجوزات</h2>

      {loading ? (
        <p className="text-muted">جاري التحميل...</p>
      ) : reservations.length === 0 ? (
        <p className="text-muted">لا توجد حجوزات بعد.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-muted text-xs">
              <tr>
                <th className="text-right p-3">العميل</th>
                <th className="text-right p-3">السيارة</th>
                <th className="text-right p-3">التواريخ</th>
                <th className="text-right p-3">السعر</th>
                <th className="text-right p-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-t border-border bg-surface">
                  <td className="p-3">
                    <p>{r.customer_name}</p>
                    <p className="text-xs text-muted">{r.customer_phone}</p>
                  </td>
                  <td className="p-3">
                    {r.cars ? `${r.cars.brand} ${r.cars.model}` : "—"}
                  </td>
                  <td className="p-3 text-xs">
                    {r.pickup_date} → {r.return_date}
                  </td>
                  <td className="p-3">{r.total_price.toLocaleString("ar-DZ")} دج</td>
                  <td className="p-3">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        handleStatusChange(r.id, e.target.value as ReservationStatus)
                      }
                      className={`text-xs rounded-full px-2 py-1 border-0 ${statusColors[r.status]}`}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
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