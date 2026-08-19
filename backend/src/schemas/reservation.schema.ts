import { z } from "zod";

const extraSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
});

export const createReservationSchema = z
  .object({
    car_id: z.string().uuid("معرّف السيارة غير صالح"),
    customer_name: z.string().min(2, "الاسم قصير جدًا").max(150),
    customer_phone: z
      .string()
      .min(8, "رقم الهاتف غير صالح")
      .max(20)
      .regex(/^[0-9+\s-]+$/, "رقم الهاتف يحتوي على رموز غير صالحة"),
    driver_license_number: z.string().min(3, "رقم رخصة القيادة غير صالح").max(50),
    pickup_date: z.string().date("تاريخ الاستلام غير صالح"),
    return_date: z.string().date("تاريخ الإرجاع غير صالح"),
    pickup_location: z.string().max(200).optional().nullable(),
    extras: z.array(extraSchema).optional().default([]),
  })
  .refine((data) => new Date(data.return_date) > new Date(data.pickup_date), {
    message: "تاريخ الإرجاع يجب أن يكون بعد تاريخ الاستلام",
    path: ["return_date"],
  })
  .refine((data) => new Date(data.pickup_date) >= new Date(new Date().toDateString()), {
    message: "تاريخ الاستلام لا يمكن أن يكون في الماضي",
    path: ["pickup_date"],
  });

export const updateReservationStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
