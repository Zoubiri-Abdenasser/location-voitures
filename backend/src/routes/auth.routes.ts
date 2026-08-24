import { Router } from "express";
import { supabase } from "../config/supabase";
import { validate } from "../middleware/validate";
import { requireAuth, requireManager } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import { registerAdminSchema, loginAdminSchema, createEmployeeSchema } from "../schemas/auth.schema";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.utils";
import { Admin } from "../types";

const router = Router();

/**
 * POST /api/auth/register
 * مخصص للاستخدام مرة واحدة فقط عند إعداد الموقع لأول مرة
 * أول حساب يُنشأ يصبح "مديرًا" تلقائيًا، ويُمنع التسجيل بعدها نهائيًا عبر هذا المسار
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
      .insert({ email, password_hash, full_name, role: "manager" })
      .select("id, email, full_name, role, created_at")
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

    if (error || !admin) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    const isValid = await comparePassword(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    const token = generateToken({ adminId: admin.id, email: admin.email, role: admin.role });

    res.json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/employees
 * محمي - يُستخدم فقط من طرف مدير لإضافة حساب موظف جديد
 */
router.post(
  "/employees",
  requireAuth,
  requireManager,
  authLimiter,
  validate(createEmployeeSchema),
  async (req, res, next) => {
    try {
      const { email, password, full_name } = req.body;

      const password_hash = await hashPassword(password);

      const { data, error } = await supabase
        .from("admins")
        .insert({ email, password_hash, full_name, role: "employee" })
        .select("id, email, full_name, role, created_at")
        .single();

      if (error) {
        if (error.code === "23505") {
          return res.status(409).json({ error: "هذا البريد الإلكتروني مستخدم بالفعل" });
        }
        throw error;
      }

      res.status(201).json({ message: "تم إضافة الموظف بنجاح", admin: data });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/auth/employees
 * محمي - يُستخدم فقط من طرف مدير لعرض كل الحسابات (مديرين وموظفين)
 */
router.get("/employees", requireAuth, requireManager, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ admins: data });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/auth/employees/:id
 * محمي - يُستخدم فقط من طرف مدير لحذف حساب موظف (لا يمكن حذف حسابه الخاص)
 */
router.delete("/employees/:id", requireAuth, requireManager, async (req, res, next) => {
  try {
    if (req.params.id === req.admin?.adminId) {
      return res.status(400).json({ error: "لا يمكنك حذف حسابك الخاص" });
    }

    const { error } = await supabase.from("admins").delete().eq("id", req.params.id);
    if (error) throw error;

    res.json({ message: "تم حذف الحساب بنجاح" });
  } catch (err) {
    next(err);
  }
});

export default router;