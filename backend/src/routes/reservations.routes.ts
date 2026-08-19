import { Router } from "express";
import { supabase } from "../config/supabase";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { reservationLimiter } from "../middleware/rateLimiter";
import {
  createReservationSchema,
  updateReservationStatusSchema,
} from "../schemas/reservation.schema";
import { z } from "zod";
import { Extra } from "../types";

const router = Router();

/**
 * التحقق من توفر السيارة في الفترة المطلوبة
 * منطق التعارض: فترتان متعارضتان إذا (بداية أ < نهاية ب) و (نهاية أ > بداية ب)
 */
async function isCarAvailable(
  carId: string,
  pickupDate: string,
  returnDate: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("reservations")
    .select("id")
    .eq("car_id", carId)
    .in("status", ["pending", "confirmed"])
    .lt("pickup_date", returnDate)
    .gt("return_date", pickupDate);

  if (error) throw error;
  return (data || []).length === 0;
}

/**
 * POST /api/reservations
 * عام (Rate Limited) - إنشاء طلب حجز جديد
 */
router.post(
  "/",
  reservationLimiter,
  validate(createReservationSchema),
  async (req, res, next) => {
    try {
      const { car_id, pickup_date, return_date, extras } = req.body;

      // 1. التحقق من وجود السيارة وأنها متاحة (وليست في الصيانة مثلاً)
      const { data: car, error: carError } = await supabase
        .from("cars")
        .select("*")
        .eq("id", car_id)
        .single();

      if (carError || !car) {
        return res.status(404).json({ error: "السيارة غير موجودة" });
      }

      if (car.status !== "available") {
        return res.status(409).json({ error: "هذه السيارة غير متاحة حاليًا للحجز" });
      }

      // 2. التحقق من عدم تعارض التواريخ مع حجز آخر (الأهم)
      const available = await isCarAvailable(car_id, pickup_date, return_date);
      if (!available) {
        return res.status(409).json({
          error: "السيارة محجوزة بالفعل في هذه الفترة، الرجاء اختيار تواريخ أخرى",
        });
      }

      // 3. حساب السعر الإجمالي في الـ backend (لا نثق بالسعر القادم من الواجهة)
      const days = Math.ceil(
        (new Date(return_date).getTime() - new Date(pickup_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const extrasTotal = (extras as Extra[]).reduce((sum, e) => sum + e.price, 0);
      const total_price = days * car.price_per_day + extrasTotal;

      const { data: reservation, error: insertError } = await supabase
        .from("reservations")
        .insert({ ...req.body, total_price, status: "pending" })
        .select()
        .single();

      if (insertError) throw insertError;

      res.status(201).json({
        message: "تم إرسال طلب الحجز بنجاح، سيتم التواصل معك للتأكيد",
        reservation,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/reservations
 * محمي - عرض كل الحجوزات (للوحة التحكم)
 */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { data: reservations, error } = await supabase
      .from("reservations")
      .select("*, cars(brand, model, main_image_url)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ reservations });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/reservations/:id/status
 * محمي - تحديث حالة الحجز (تأكيد/إلغاء/إتمام)
 */
router.patch(
  "/:id/status",
  requireAuth,
  validate(z.object({ id: z.string().uuid() }), "params"),
  validate(updateReservationStatusSchema),
  async (req, res, next) => {
    try {
      const { data: reservation, error } = await supabase
        .from("reservations")
        .update({ status: req.body.status })
        .eq("id", req.params.id)
        .select()
        .single();

      if (error || !reservation) {
        return res.status(404).json({ error: "الحجز غير موجود" });
      }

      res.json({ message: "تم تحديث حالة الحجز", reservation });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
