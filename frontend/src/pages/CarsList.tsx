import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchCars } from "../api/cars";
import type { Car, CarFilters } from "../types";
import CarCard from "../components/cars/CarCard";

export default function CarsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const filters: CarFilters = {
    category: (searchParams.get("category") as Car["category"]) || undefined,
    transmission: (searchParams.get("transmission") as Car["transmission"]) || undefined,
    pickup_date: searchParams.get("pickup_date") || undefined,
    return_date: searchParams.get("return_date") || undefined,
  };

  useEffect(() => {
    setLoading(true);
    fetchCars(filters)
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <h1 className="font-display font-bold text-xl sm:text-2xl mb-4 sm:mb-6">السيارات المتاحة</h1>

      <div className="grid md:grid-cols-[220px_1fr] gap-4 md:gap-8">
        {/* الفلاتر - صف أفقي على الهاتف، عمود جانبي على الحاسوب */}
        <aside className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
          <div>
            <span className="block text-xs text-muted mb-1.5">الفئة</span>
            <select
              value={filters.category || ""}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="w-full rounded-lg bg-surface border border-border px-3 py-2 text-sm"
            >
              <option value="">الكل</option>
              <option value="economy">اقتصادية</option>
              <option value="suv">SUV</option>
              <option value="luxury">فاخرة</option>
              <option value="family">عائلية</option>
            </select>
          </div>

          <div>
            <span className="block text-xs text-muted mb-1.5">ناقل الحركة</span>
            <select
              value={filters.transmission || ""}
              onChange={(e) => updateFilter("transmission", e.target.value)}
              className="w-full rounded-lg bg-surface border border-border px-3 py-2 text-sm"
            >
              <option value="">الكل</option>
              <option value="automatic">أوتوماتيك</option>
              <option value="manual">يدوي</option>
            </select>
          </div>
        </aside>

        {/* النتائج */}
        <div>
          {loading ? (
            <p className="text-muted">جاري التحميل...</p>
          ) : cars.length === 0 ? (
            <p className="text-muted">لا توجد سيارات مطابقة لبحثك.</p>
          ) : (
            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}