import { useEffect, useState } from "react";
import { fetchAllCarsAdmin, createCar, updateCar, deleteCar } from "../api/cars";
import type { Car } from "../types";
import CarForm from "../components/cars/CarForm";

const categoryLabels: Record<string, string> = {
  economy: "اقتصادية",
  suv: "SUV",
  luxury: "فاخرة",
  family: "عائلية",
};

const statusLabels: Record<string, string> = {
  available: "متاحة",
  maintenance: "في الصيانة",
  unavailable: "غير متاحة",
};

const statusColors: Record<string, string> = {
  available: "text-green-700 bg-green-100",
  maintenance: "text-gold-dim bg-gold/10",
  unavailable: "text-red-700 bg-red-100",
};

export default function CarsAdmin() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  function load() {
    setLoading(true);
    fetchAllCarsAdmin()
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(data: Partial<Car>) {
    await createCar(data);
    setShowForm(false);
    load();
  }

  async function handleUpdate(data: Partial<Car>) {
    if (!editingCar) return;
    await updateCar(editingCar.id, data);
    setEditingCar(null);
    load();
  }

  async function handleDelete(car: Car) {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف ${car.brand} ${car.model}؟ لا يمكن التراجع عن هذا الإجراء.`
    );
    if (!confirmed) return;
    await deleteCar(car.id);
    load();
  }

  if (showForm) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display font-bold text-2xl mb-6">إضافة سيارة جديدة</h1>
        <CarForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </div>
    );
  }

  if (editingCar) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display font-bold text-2xl mb-6">
          تعديل {editingCar.brand} {editingCar.model}
        </h1>
        <CarForm
          initialData={editingCar}
          onSubmit={handleUpdate}
          onCancel={() => setEditingCar(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl">إدارة الأسطول</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-gold text-ink font-display font-bold px-5 py-2.5 hover:bg-gold-dim transition-colors"
        >
          + إضافة سيارة
        </button>
      </div>

      {loading ? (
        <p className="text-muted">جاري التحميل...</p>
      ) : cars.length === 0 ? (
        <p className="text-muted">لا توجد سيارات بعد. أضف أول سيارة للبدء.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <div
              key={car.id}
              className="rounded-2xl bg-surface border border-border overflow-hidden"
            >
              <div className="aspect-[16/10] bg-surface-alt">
                {car.main_image_url ? (
                  <img
                    src={car.main_image_url}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                    لا توجد صورة
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-bold">
                    {car.brand} {car.model}
                  </h3>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${statusColors[car.status]}`}>
                    {statusLabels[car.status]}
                  </span>
                </div>

                <p className="text-xs text-muted mb-3">
                  {categoryLabels[car.category]} · {car.price_per_day.toLocaleString("ar-DZ")} دج/يوم
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCar(car)}
                    className="flex-1 text-xs rounded-lg border border-border py-2 hover:border-gold hover:text-gold-dim transition-colors"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(car)}
                    className="flex-1 text-xs rounded-lg border border-red-200 text-red-600 py-2 hover:bg-red-50 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}