import rateLimit from "express-rate-limit";

// يُطبَّق فقط على نقاط الوصول العامة الحساسة (إنشاء حجز)
export const reservationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10, // 10 طلبات كحد أقصى لكل IP
  message: { error: "عدد كبير جدًا من الطلبات، حاول مرة أخرى بعد قليل" },
  standardHeaders: true,
  legacyHeaders: false,
});

// أكثر تساهلاً لتسجيل الدخول (لكن يمنع هجمات Brute Force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "عدد كبير جدًا من محاولات الدخول، حاول لاحقًا" },
  standardHeaders: true,
  legacyHeaders: false,
});
