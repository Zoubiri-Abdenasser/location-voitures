import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type Source = "body" | "query" | "params";

/**
 * Middleware قابل لإعادة الاستخدام للتحقق من المدخلات عبر Zod
 * يمنع تكرار try/catch في كل route ويعطي رسائل خطأ موحدة بالعربية
 */
export function validate(schema: ZodSchema, source: Source = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        error: "بيانات غير صالحة",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // نستبدل البيانات بالنسخة المُتحقق منها والمُنظّفة (مع defaults)
    req[source] = result.data;
    next();
  };
}
