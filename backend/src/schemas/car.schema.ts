import { z } from "zod";

export const carCategorySchema = z.enum(["economy", "suv", "luxury", "family"]);
export const transmissionSchema = z.enum(["automatic", "manual"]);
export const fuelTypeSchema = z.enum(["essence", "diesel", "electrique", "hybride"]);
export const carStatusSchema = z.enum(["available", "maintenance", "unavailable"]);

export const createCarSchema = z.object({
  brand: z.string().min(1, "الماركة مطلوبة").max(100),
  model: z.string().min(1, "الموديل مطلوب").max(100),
  year: z
    .number()
    .int()
    .min(1990, "سنة الصنع غير منطقية")
    .max(new Date().getFullYear() + 1, "سنة الصنع غير منطقية"),
  category: carCategorySchema,
  transmission: transmissionSchema,
  fuel_type: fuelTypeSchema,
  seats: z.number().int().min(1).max(9),
  price_per_day: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
  main_image_url: z.string().url().optional().nullable(),
  gallery_images: z.array(z.string().url()).optional().default([]),
  description: z.string().max(2000).optional().nullable(),
  features: z.array(z.string()).optional().default([]),
  status: carStatusSchema.optional().default("available"),
});

export const updateCarSchema = createCarSchema.partial();

export const carFiltersSchema = z.object({
  category: carCategorySchema.optional(),
  transmission: transmissionSchema.optional(),
  min_price: z.coerce.number().nonnegative().optional(),
  max_price: z.coerce.number().positive().optional(),
  seats: z.coerce.number().int().positive().optional(),
  // فلترة بتاريخ التوفر - إن أُرسلت يجب إرسال الاثنين معًا
  pickup_date: z.string().date().optional(),
  return_date: z.string().date().optional(),
}).refine(
  (data) => (!!data.pickup_date === !!data.return_date),
  { message: "يجب إرسال pickup_date و return_date معًا" }
);

export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
