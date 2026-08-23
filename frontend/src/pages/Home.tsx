import { useEffect, useState } from "react";
import { fetchCars } from "../api/cars";
import type { Car } from "../types";
import CarCard from "../components/cars/CarCard";
import SearchForm from "../components/cars/SearchForm";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop";

const features = [
  {
    title: "سيارات متنوعة",
    desc: "مجموعة واسعة تناسب الجميع",
    icon: "🚗",
  },
  {
    title: "أفضل الأسعار",
    desc: "أسعار تنافسية بدون رسوم خفية",
    icon: "🏷️",
  },
  {
    title: "دعم 24/7",
    desc: "نحن هنا لمساعدتك دائمًا",
    icon: "🎧",
  },
  {
    title: "تأمين شامل",
    desc: "راحة بال طوال فترة الكراء",
    icon: "🛡️",
  },
];

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars()
      .then((cars) => setFeaturedCars(cars.slice(0, 6)))
      .catch(() => setFeaturedCars([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[420px] sm:h-[500px] md:h-[600px] overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="سيارة على طريق ساحلي"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-l from-paper via-paper/50 sm:via-paper/40 to-transparent sm:to-paper/90" />

          <div className="relative mx-auto max-w-7xl px-4 h-full flex items-end sm:items-center pb-8 sm:pb-0">
            <div className="max-w-lg">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight text-ink">
                تجربة قيادة
                <br />
                تبدأ من هنا
              </h1>
              <div className="w-16 h-1 bg-gold my-4 sm:my-5" />
              <p className="text-sm sm:text-base text-muted mb-6 sm:mb-8">
                استأجر سيارتك بسهولة وأمان بأفضل الأسعار. مجموعة واسعة من
                السيارات تناسب جميع احتياجاتك.
              </p>
              <a href="/cars" className="inline-block rounded-lg bg-gold text-ink font-display font-bold px-6 sm:px-8 py-3 sm:py-3.5 hover:bg-gold-dim transition-colors">
                احجز الآن
              </a>
            </div>
          </div>
        </div>

        {/* بطاقة البحث العائمة */}
        <div className="relative mx-auto max-w-6xl px-4 -mt-6 sm:-mt-14 md:-mt-16">
          <SearchForm />
        </div>
      </section>

      {/* صف المميزات */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl shrink-0">{f.icon}</span>
              <div>
                <p className="font-display font-bold text-xs sm:text-sm">{f.title}</p>
                <p className="text-[11px] sm:text-xs text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="lane-divider" />

      {/* السيارات المتوفرة */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="font-display font-bold text-xl sm:text-2xl mb-6">سيارات متوفرة الآن</h2>

        {loading ? (
          <p className="text-muted">جاري التحميل...</p>
        ) : featuredCars.length === 0 ? (
          <p className="text-muted">لا توجد سيارات متاحة حاليًا.</p>
        ) : (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}