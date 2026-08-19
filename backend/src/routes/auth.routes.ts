import { Router } from "express";
import { supabase } from "../config/supabase";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimiter";
import { registerAdminSchema, loginAdminSchema } from "../schemas/auth.schema";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.utils";
import { Admin } from "../types";

const router = Router();

/**
 * POST /api/auth/register
 * مخصص للاستخدام مرة واحدة فقط عند إعداد الموقع لأول مرة
 * يُمنع التسجيل إذا كان هناك أدمن موجود بالفعل
 */
router.post("/register", authLimiter, validate(registerAdminSchema), async (req, res, next) => {
  try {
    const { email, password, full_name } = req.body;

    const { count, error: countError } = await supabase
      .from("admins")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    if (count && count > 0) {
      return res.status(403).json({
        error: "التسجيل مغلق - يوجد مالك مسجل بالفعل لهذا الموقع",
      });
    }

    const password_hash = await hashPassword(password);

    const { data, error } = await supabase
      .from("admins")
      .insert({ email, password_hash, full_name })
      .select("id, email, full_name, created_at")
      .single();

    if (error) throw error;

    res.status(201).json({ message: "تم إنشاء الحساب بنجاح", admin: data });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 */
router.post("/login", authLimiter, validate(loginAdminSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single<Admin>();

    // رسالة موحدة سواء كان البريد أو كلمة المرور خاطئة (لا نكشف أيهما خاطئ)
    if (error || !admin) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    const isValid = await comparePassword(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    const token = generateToken({ adminId: admin.id, email: admin.email });

    res.json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      admin: { id: admin.id, email: admin.email, full_name: admin.full_name },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
