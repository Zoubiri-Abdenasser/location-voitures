import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // لا نُرجع تفاصيل الخطأ الداخلي للعميل في الإنتاج (لأسباب أمنية)
  const isDev = process.env.NODE_ENV === "development";

  res.status(500).json({
    error: "حدث خطأ غير متوقع في السيرفر",
    ...(isDev && { details: err.message }),
  });
}

// يُستخدم في نهاية كل الـ routes لالتقاط المسارات غير الموجودة
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `المسار ${req.method} ${req.path} غير موجود` });
}
