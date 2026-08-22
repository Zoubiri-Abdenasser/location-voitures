import { Router } from "express";
import multer from "multer";
import { supabase } from "../config/supabase";
import { requireAuth } from "../middleware/auth";

const router = Router();

// نستقبل الملف في الذاكرة مؤقتًا (وليس على القرص) قبل رفعه لـ Supabase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 ميجابايت كحد أقصى
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("نوع الملف غير مدعوم - يُسمح فقط بـ JPEG, PNG, WEBP"));
    }
  },
});

/**
 * POST /api/upload/car-image
 * محمي - رفع صورة سيارة إلى Supabase Storage وإرجاع رابطها العام
 */
router.post(
  "/car-image",
  requireAuth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "لم يتم إرفاق أي صورة" });
      }

      // اسم ملف فريد لتفادي التعارض بين الصور
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("car-images")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("car-images").getPublicUrl(fileName);

      res.status(201).json({ url: data.publicUrl });
    } catch (err) {
      next(err);
    }
  }
);

export default router;