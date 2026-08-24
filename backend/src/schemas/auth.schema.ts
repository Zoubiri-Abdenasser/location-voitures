import { z } from "zod";

export const registerAdminSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل"),
  full_name: z.string().min(2).max(150).optional(),
});

// يُستخدم فقط من طرف مدير لإضافة موظف جديد
export const createEmployeeSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل"),
  full_name: z.string().min(2).max(150).optional(),
});

export const loginAdminSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type RegisterAdminInput = z.infer<typeof registerAdminSchema>;
export type LoginAdminInput = z.infer<typeof loginAdminSchema>;
