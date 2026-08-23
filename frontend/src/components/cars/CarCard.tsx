import { Link } from "react-router-dom";
import type { Car } from "../../types";

const categoryLabels: Record<Car["category"], string> = {
  economy: "اقتصادية",
  suv: "SUV",
  luxury: "فاخرة",
  family: "عائلية",
};

const transmissionLabels: Record<Car["transmission"], string> = {
  automatic: "أوتوماتيك",
  manual: "يدوي",
};

export default function CarCard({ car }: { car: Car }) {
  const isBooked = !!car.booked_until;

  return (
    <Link
      to={`/cars/${car.id}`}
      className="group block rounded-2xl overflow-hidden bg-surface border border-border hover:border-gold hover:shadow-lg transition-all"
    >
      <div className="relative aspect-[16/10] bg-surface-alt overflow-hidden">
        {isBooked && (
          <span className="absolute top-3 right-3 z-10 text-xs font-bold bg-red-600 text-white rounded-full px-3 py-1">
            محجوزة حتى {new Date(car.booked_until!).toLocaleDateString("ar-DZ")}
          </span>
        )}
        {car.main_image_url ? (
          <img
            src={car.main_image_url}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">
            لا توجد صورة
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-bold text-lg">
            {car.brand} {car.model}
          </h3>
          <span className="text-xs text-muted">{car.year}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted mb-3">
          <span>{categoryLabels[car.category]}</span>
          <span>·</span>
          <span>{transmissionLabels[car.transmission]}</span>
          <span>·</span>
          <span>{car.seats} مقاعد</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-display font-extrabold text-gold-dim">
              {car.price_per_day.toLocaleString("ar-DZ")}
            </span>
            <span className="text-xs text-muted mr-1">دج / يوم</span>
          </div>
          <span className="text-sm text-gold-dim group-hover:translate-x-[-4px] transition-transform">
            التفاصيل ←
          </span>
        </div>
      </div>
    </Link>
  );
}