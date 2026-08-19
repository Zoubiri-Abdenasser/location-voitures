import { Router } from "express";
import { supabase } from "../config/supabase";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createCarSchema,
  updateCarSchema,
  carFiltersSchema,
} from "../schemas/car.schema";
import { z } from "zod";

const router = Router();

/**
 * GET /api/cars
 * عام - يدعم الفلترة، ويستثني السيارات المحجوزة إن أُرسل نطاق تواريخ
 */
router.get("/", validate(carFiltersSchema, "query"), async (req, res, next) => {
  try {
    const { category, transmission, min_price, max_price, seats, pickup_date, return_date } =
      req.query as any;

    let query = supabase.from("cars").select("*").eq("status", "available");

    if (category) query = query.eq("category", category);
    if (transmission) query = query.eq("transmission", transmission);
    if (min_price !== undefined) query = query.gte("price_per_day", min_price);
    if (max_price !== undefined) query = query.lte("price_per_day", max_price);
    if (seats !== undefined) query = query.gte("seats", seats);

    const { data: cars, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    // إن أُرسل نطاق تواريخ، نستثني السيارات المحجوزة في تلك الفترة
    if (pickup_date && return_date && cars) {
      const carIds = cars.map((c) => c.id);
      const { data: conflicting, error: resError } = await supabase
        .from("reservations")
        .select("car_id")
        .in("car_id", carIds)
        .in("status", ["pending", "confirmed"])
        .lt("pickup_date", return_date)
        .gt("return_date", pickup_date);

      if (resError) throw resError;

      const bookedCarIds = new Set((conflicting || []).map((r) => r.car_id));
      return res.json({ cars: cars.filter((c) => !bookedCarIds.has(c.id)) });
    }

    res.json({ cars });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/cars/:id
 * عام - تفاصيل سيارة واحدة
 */
router.get("/:id", validate(z.object({ id: z.string().uuid() }), "params"), async (req, res, next) => {
  try {
    const { data: car, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !car) {
      return res.status(404).json({ error: "السيارة غير موجودة" });
    }

    res.json({ car });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/cars/:id/availability
 * عام - يُرجع التواريخ المحجوزة لعرضها في تقويم صفحة التفاصيل
 */
router.get(
  "/:id/availability",
  validate(z.object({ id: z.string().uuid() }), "params"),
  async (req, res, next) => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("pickup_date, return_date")
        .eq("car_id", req.params.id)
        .in("status", ["pending", "confirmed"]);

      if (error) throw error;

      res.json({ booked_ranges: data });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/cars
 * محمي - إضافة سيارة جديدة
 */
router.post("/", requireAuth, validate(createCarSchema), async (req, res, next) => {
  try {
    const { data: car, error } = await supabase
      .from("cars")
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "تمت إضافة السيارة بنجاح", car });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/cars/:id
 * محمي - تعديل سيارة
 */
router.put(
  "/:id",
  requireAuth,
  validate(z.object({ id: z.string().uuid() }), "params"),
  validate(updateCarSchema),
  async (req, res, next) => {
    try {
      const { data: car, error } = await supabase
        .from("cars")
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq("id", req.params.id)
        .select()
        .single();

      if (error || !car) {
        return res.status(404).json({ error: "السيارة غير موجودة" });
      }

      res.json({ message: "تم تعديل السيارة بنجاح", car });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/cars/:id
 * محمي
 */
router.delete(
  "/:id",
  requireAuth,
  validate(z.object({ id: z.string().uuid() }), "params"),
  async (req, res, next) => {
    try {
      const { error } = await supabase.from("cars").delete().eq("id", req.params.id);
      if (error) throw error;

      res.json({ message: "تم حذف السيارة بنجاح" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
