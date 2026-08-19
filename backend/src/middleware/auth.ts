import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthPayload } from "../types";

// نوسّع Request لإضافة بيانات الأدمن بعد التحقق من التوكن
declare global {
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "غير مصرح - التوكن مفقود" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "غير مصرح - التوكن غير صالح أو منتهي الصلاحية" });
  }
}
