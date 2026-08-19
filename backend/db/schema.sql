-- ============================================
-- Location Voitures - Database Schema
-- تنفيذ هذا الملف كاملاً في Supabase SQL Editor
-- ============================================

-- تفعيل extension لتوليد UUID (مفعّل افتراضيًا في Supabase غالبًا)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. جدول admins
-- ============================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. جدول cars
-- ============================================
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('economy', 'suv', 'luxury', 'family')),
  transmission TEXT NOT NULL CHECK (transmission IN ('automatic', 'manual')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('essence', 'diesel', 'electrique', 'hybride')),
  seats INT NOT NULL,
  price_per_day NUMERIC(10,2) NOT NULL CHECK (price_per_day > 0),
  main_image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  description TEXT,
  features TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'available'
         CHECK (status IN ('available', 'maintenance', 'unavailable')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cars_status ON cars (status);
CREATE INDEX idx_cars_category ON cars (category);

-- ============================================
-- 3. جدول reservations
-- ============================================
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,

  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  driver_license_number TEXT NOT NULL,

  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  pickup_location TEXT,

  extras JSONB DEFAULT '[]',
  total_price NUMERIC(10,2) NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending'
         CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),

  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT valid_dates CHECK (return_date > pickup_date)
);

CREATE INDEX idx_reservations_car_dates ON reservations (car_id, pickup_date, return_date);
CREATE INDEX idx_reservations_status ON reservations (status);

-- ============================================
-- 4. جدول rental_settings
-- ============================================
CREATE TABLE rental_settings (
  id INT PRIMARY KEY DEFAULT 1,
  min_driver_age INT DEFAULT 21,
  cancellation_policy TEXT,
  insurance_note TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO rental_settings (id) VALUES (1);

-- ============================================
-- 5. دالة التحقق من توفر السيارة (اختيارية - كطبقة حماية إضافية)
-- ============================================
CREATE OR REPLACE FUNCTION check_car_availability(
  p_car_id UUID,
  p_pickup DATE,
  p_return DATE
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM reservations
    WHERE car_id = p_car_id
      AND status IN ('pending', 'confirmed')
      AND pickup_date < p_return
      AND return_date > p_pickup
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. Row Level Security (RLS)
-- ============================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_settings ENABLE ROW LEVEL SECURITY;

-- admins: بدون أي policy عامة - الوصول فقط عبر service_role key من الـ backend

-- cars: قراءة عامة، كتابة عبر service_role فقط
CREATE POLICY "cars_select_public" ON cars
  FOR SELECT USING (true);

CREATE POLICY "cars_service_role_all" ON cars
  FOR ALL USING (auth.role() = 'service_role');

-- reservations: لا توجد سياسة SELECT عامة (فقط عبر service_role من الـ backend المحمي بـ JWT)
CREATE POLICY "reservations_service_role_all" ON reservations
  FOR ALL USING (auth.role() = 'service_role');

-- rental_settings: قراءة عامة، كتابة عبر service_role فقط
CREATE POLICY "settings_select_public" ON rental_settings
  FOR SELECT USING (true);

CREATE POLICY "settings_service_role_all" ON rental_settings
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- ملاحظة: لأن الـ backend يستخدم SUPABASE_SERVICE_KEY
-- فإنه يتجاوز RLS تلقائيًا لكل العمليات، والتحقق الفعلي
-- من الصلاحيات (JWT) يتم في middleware/auth.ts
-- RLS هنا هي طبقة حماية إضافية في حال تسرب anon key لاحقًا
-- ============================================
