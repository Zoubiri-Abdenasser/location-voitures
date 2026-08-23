import { useState } from "react";
import type { Car } from "../../types";
import { createReservation } from "../../api/reservations";

export default function BookingForm({ car }: { car: Car }) {
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const days =
    pickupDate && returnDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;
  const total = days * car.price_per_day;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      await createReservation({
        car_id: car.id,
        customer_name: name,
        customer_phone: phone,
        driver_license_number: license,
        pickup_date: pickupDate,
        return_date: returnDate,
      });
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.response?.data?.error || "حدث خطأ، حاول مرة أخرى");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-surface border border-gold p-6 text-center shadow-sm">
        <p className="font-display font-bold text-gold-dim mb-2">تم إرسال طلبك بنجاح</p>
        <p className="text-sm text-muted">سيتم التواصل معك قريبًا لتأكيد الحجز.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-surface border border-border p-6 space-y-4 sticky top-24 shadow-sm"
    >
      <h3 className="font-display font-bold text-lg">احجز هذه السيارة</h3>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-xs text-muted mb-1">الاستلام</span>
          <input
            type="date"
            required
            value={pickupDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="block text-xs text-muted mb-1">الإرجاع</span>
          <input
            type="date"
            required
            value={returnDate}
            min={pickupDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block">
        <span className="block text-xs text-muted mb-1">الاسم الكامل</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-muted mb-1">رقم الهاتف</span>
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-muted mb-1">رقم رخصة القيادة</span>
        <input
          required
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
        />
      </label>

      {days > 0 && (
        <div className="border-t border-border pt-3 flex items-center justify-between">
          <span className="text-sm text-muted">{days} يوم</span>
          <span className="font-display font-extrabold text-gold-dim text-xl">
            {total.toLocaleString("ar-DZ")} دج
          </span>
        </div>
      )}

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-gold text-ink font-display font-bold py-2.5 hover:bg-gold-dim transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "جاري الإرسال..." : "تأكيد طلب الحجز"}
      </button>
    </form>
  );
}