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
      className="bg-surface/90 backdrop-blur border border-surface-light rounded-2xl p-4 md:p-6 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
    >
      <label className="block">
        <span className="block text-xs text-muted mb-1.5">تاريخ الاستلام</span>
        <input
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full rounded-lg bg-ink border border-surface-light px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-muted mb-1.5">تاريخ الإرجاع</span>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          min={pickupDate || new Date().toISOString().split("T")[0]}
          className="w-full rounded-lg bg-ink border border-surface-light px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-muted mb-1.5">نوع السيارة</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg bg-ink border border-surface-light px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
        >
          <option value="">كل الأنواع</option>
          <option value="economy">اقتصادية</option>
          <option value="suv">SUV</option>
          <option value="luxury">فاخرة</option>
          <option value="family">عائلية</option>
        </select>
      </label>

      <button
        type="submit"
        className="rounded-lg bg-gold text-ink font-display font-bold px-6 py-2.5 hover:bg-gold-dim transition-colors"
      >
        ابحث عن سيارة
      </button>
    </form>
  );
}