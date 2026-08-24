export type CarCategory = "economy" | "suv" | "luxury" | "family";
export type Transmission = "automatic" | "manual";
export type FuelType = "essence" | "diesel" | "electrique" | "hybride";
export type CarStatus = "available" | "maintenance" | "unavailable";
export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Extra {
  name: string;
  price: number;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  transmission: Transmission;
  fuel_type: FuelType;
  seats: number;
  price_per_day: number;
  main_image_url: string | null;
  gallery_images: string[] | null;
  description: string | null;
  features: string[] | null;
  status: CarStatus;
  created_at: string;
  updated_at: string;
  booked_until?: string | null; // محسوبة عند القراءة فقط - تاريخ انتهاء الحجز الحالي إن وُجد
}

export interface Reservation {
  id: string;
  car_id: string;
  customer_name: string;
  customer_phone: string;
  driver_license_number: string;
  pickup_date: string; // YYYY-MM-DD
  return_date: string; // YYYY-MM-DD
  pickup_location: string | null;
  extras: Extra[];
  total_price: number;
  status: ReservationStatus;
  created_at: string;
}

export type AdminRole = "manager" | "employee";

export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: AdminRole;
  created_at: string;
}

// يُضاف إلى Express.Request بعد التحقق من JWT
export interface AuthPayload {
  adminId: string;
  email: string;
  role: AdminRole;
}
