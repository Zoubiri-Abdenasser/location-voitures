import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchForm() {
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickupDate) params.set("pickup_date", pickupDate);
    if (returnDate) params.set("return_date", returnDate);
    if (category) params.set("category", category);
    navigate(`/cars?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface shadow-xl rounded-2xl p-3 sm:p-4 md:p-5 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-[auto_1fr_1fr_1fr_1fr] md:items-end border border-border"
    >
      <label className="block">
        <span className="block text-xs text-muted mb-1.5">موقع الاستلام</span>
        <input
          type="text"
          placeholder="اختر المدينة أو المطار"
          className="w-full rounded-lg bg-paper border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-muted mb-1.5">تاريخ الاستلام</span>
        <input
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full rounded-lg bg-paper border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-muted mb-1.5">تاريخ الإرجاع</span>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          min={pickupDate || new Date().toISOString().split("T")[0]}
          className="w-full rounded-lg bg-paper border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-muted mb-1.5">نوع السيارة</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg bg-paper border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
        >
          <option value="">اختر نوع السيارة</option>
          <option value="economy">اقتصادية</option>
          <option value="suv">SUV</option>
          <option value="luxury">فاخرة</option>
          <option value="family">عائلية</option>
        </select>
      </label>

      <button
        type="submit"
        className="rounded-xl bg-gold text-ink font-display font-bold px-6 py-3 hover:bg-gold-dim transition-colors sm:col-span-2 md:col-span-1"
      >
        ابحث الآن
      </button>
    </form>
  );
}