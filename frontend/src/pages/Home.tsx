import { useEffect, useState } from "react";
import { fetchCars } from "../api/cars";
import type { Car } from "../types";
import CarCard from "../components/cars/CarCard";
import SearchForm from "../components/cars/SearchForm";

const features = [
  { title: "تأمين شامل", desc: "كل سياراتنا مؤمَّنة بالكامل ضد الحوادث والسرقة" },
  { title: "دعم على مدار الساعة", desc: "فريقنا جاهز لمساعدتك في أي وقت" },
  { title: "أسعار شفافة", desc: "لا رسوم مخفية، السعر الذي تراه هو ما تدفعه" },
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-steel/20 via-ink to-ink" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight max-w-2xl">
            اكرِ سيارتك،
            <br />
            <span className="text-gold">بسهولة وأمان</span>
          </h1>
          <p className="text-muted mt-4 max-w-md">
            مئات السيارات المتاحة، حجز فوري بدون تعقيد، وأسعار واضحة من البداية.
          </p>

          <div className="mt-10">
            <SearchForm />
          </div>
        </div>
      </section>

      <div className="lane-divider" />

      {/* Featured cars */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display font-bold text-2xl mb-6">سيارات متوفرة الآن</h2>

        {loading ? (
          <p className="text-muted">جاري التحميل...</p>
        ) : featuredCars.length === 0 ? (
          <p className="text-muted">لا توجد سيارات متاحة حاليًا.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display font-bold text-2xl mb-8">لماذا تختارنا؟</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-surface border border-surface-light p-6"
            >
              <h3 className="font-display font-bold text-gold mb-2">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}