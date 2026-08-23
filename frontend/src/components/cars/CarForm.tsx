import { useState } from "react";
import type { Car, CarCategory, Transmission, FuelType, CarStatus } from "../../types";
import { uploadCarImage } from "../../api/cars";

interface CarFormProps {
  initialData?: Partial<Car>;
  onSubmit: (data: Partial<Car>) => Promise<void>;
  onCancel: () => void;
}

export default function CarForm({ initialData, onSubmit, onCancel }: CarFormProps) {
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [model, setModel] = useState(initialData?.model || "");
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [category, setCategory] = useState<CarCategory>(initialData?.category || "economy");
  const [transmission, setTransmission] = useState<Transmission>(
    initialData?.transmission || "automatic"
  );
  const [fuelType, setFuelType] = useState<FuelType>(initialData?.fuel_type || "essence");
  const [seats, setSeats] = useState(initialData?.seats || 5);
  const [pricePerDay, setPricePerDay] = useState(initialData?.price_per_day || 0);
  const [description, setDescription] = useState(initialData?.description || "");
  const [featuresText, setFeaturesText] = useState(
    initialData?.features?.join("، ") || ""
  );
  const [status, setStatus] = useState<CarStatus>(initialData?.status || "available");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.main_image_url || null
  );
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let mainImageUrl = initialData?.main_image_url || null;

      if (imageFile) {
        setUploading(true);
        mainImageUrl = await uploadCarImage(imageFile);
        setUploading(false);
      }

      await onSubmit({
        brand,
        model,
        year: Number(year),
        category,
        transmission,
        fuel_type: fuelType,
        seats: Number(seats),
        price_per_day: Number(pricePerDay),
        main_image_url: mainImageUrl,
        description: description || null,
        features: featuresText
          .split("،")
          .map((f) => f.trim())
          .filter(Boolean),
        status,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "حدث خطأ، حاول مرة أخرى");
      setLoading(false);
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-surface border border-border p-6 space-y-4"
    >
      <div>
        <span className="block text-xs text-muted mb-2">صورة السيارة</span>
        <div className="flex items-center gap-4">
          <div className="w-32 h-24 rounded-lg overflow-hidden bg-surface-alt border border-border flex items-center justify-center shrink-0">
            {imagePreview ? (
              <img src={imagePreview} alt="معاينة" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-muted">لا توجد صورة</span>
            )}
          </div>
          <label className="cursor-pointer text-sm text-gold-dim border border-gold rounded-lg px-4 py-2 hover:bg-gold hover:text-ink transition-colors">
            {imagePreview ? "تغيير الصورة" : "اختر صورة"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-xs text-muted mb-1">الماركة</span>
          <input
            required
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="block text-xs text-muted mb-1">الموديل</span>
          <input
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="block">
          <span className="block text-xs text-muted mb-1">سنة الصنع</span>
          <input
            type="number"
            required
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="block text-xs text-muted mb-1">المقاعد</span>
          <input
            type="number"
            required
            min={1}
            max={9}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="block text-xs text-muted mb-1">السعر/اليوم (دج)</span>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(Number(e.target.value))}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="block">
          <span className="block text-xs text-muted mb-1">الفئة</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CarCategory)}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
          >
            <option value="economy">اقتصادية</option>
            <option value="suv">SUV</option>
            <option value="luxury">فاخرة</option>
            <option value="family">عائلية</option>
          </select>
        </label>
        <label className="block">
          <span className="block text-xs text-muted mb-1">ناقل الحركة</span>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value as Transmission)}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
          >
            <option value="automatic">أوتوماتيك</option>
            <option value="manual">يدوي</option>
          </select>
        </label>
        <label className="block">
          <span className="block text-xs text-muted mb-1">نوع الوقود</span>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value as FuelType)}
            className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
          >
            <option value="essence">بنزين</option>
            <option value="diesel">ديزل</option>
            <option value="electrique">كهربائي</option>
            <option value="hybride">هجين</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="block text-xs text-muted mb-1">الوصف</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-muted mb-1">
          المميزات (افصل بينها بفاصلة عربية "،")
        </span>
        <input
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          placeholder="مكيف، GPS، بلوتوث"
          className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-muted mb-1">الحالة</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CarStatus)}
          className="w-full rounded-lg bg-paper border border-border px-3 py-2 text-sm"
        >
          <option value="available">متاحة</option>
          <option value="maintenance">في الصيانة</option>
          <option value="unavailable">غير متاحة</option>
        </select>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-gold text-ink font-display font-bold py-2.5 hover:bg-gold-dim transition-colors disabled:opacity-50"
        >
          {uploading ? "جاري رفع الصورة..." : loading ? "جاري الحفظ..." : "حفظ"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-border text-muted py-2.5 hover:text-ink transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}