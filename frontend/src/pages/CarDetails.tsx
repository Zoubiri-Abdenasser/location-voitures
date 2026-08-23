import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCarById } from "../api/cars";
import type { Car } from "../types";
import BookingForm from "../components/reservations/BookingForm";

const categoryLabels: Record<string, string> = {
  economy: "اقتصادية",
  suv: "SUV",
  luxury: "فاخرة",
  family: "عائلية",
};

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchCarById(id)
      .then(setCar)
      .catch(() => setCar(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-20 text-muted">جاري التحميل...</p>;
  if (!car) return <p className="text-center py-20 text-muted">السيارة غير موجودة</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 sm:gap-10">
        <div>
          <div className="aspect-video rounded-2xl overflow-hidden bg-surface-alt border border-border mb-4 sm:mb-6">
            {car.main_image_url ? (
              <img
                src={car.main_image_url}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                لا توجد صورة
              </div>
            )}
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl mb-2">
            {car.brand} {car.model} <span className="text-muted text-lg sm:text-xl">{car.year}</span>
          </h1>
          <p className="text-gold-dim mb-4 sm:mb-6">{categoryLabels[car.category]}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { label: "ناقل الحركة", value: car.transmission === "automatic" ? "أوتوماتيك" : "يدوي" },
              { label: "الوقود", value: car.fuel_type },
              { label: "المقاعد", value: car.seats },
              { label: "السعر/اليوم", value: `${car.price_per_day.toLocaleString("ar-DZ")} دج` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-surface-alt border border-border p-3 sm:p-4">
                <p className="text-[11px] sm:text-xs text-muted mb-1">{item.label}</p>
                <p className="text-sm sm:text-base font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          {car.description && (
            <div className="mb-6 sm:mb-8">
              <h2 className="font-display font-bold text-base sm:text-lg mb-2">الوصف</h2>
              <p className="text-sm sm:text-base text-muted">{car.description}</p>
            </div>
          )}

          {car.features && car.features.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg mb-3">المميزات</h2>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <span
                    key={f}
                    className="text-xs rounded-full bg-surface-alt border border-border px-3 py-1.5"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <BookingForm car={car} />
        </div>
      </div>
    </div>
  );
}