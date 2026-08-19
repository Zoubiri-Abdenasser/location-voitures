import dotenv from "dotenv";

dotenv.config();

// التحقق من وجود كل المتغيرات الضرورية عند إقلاع السيرفر
// بدل اكتشاف نقصها لاحقًا أثناء التشغيل
const requiredEnvVars = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_KEY",
  "JWT_SECRET",
] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(
      `متغير البيئة المطلوب غير موجود: ${key}. تحقق من ملف .env`
    );
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  SUPABASE_URL: process.env.SUPABASE_URL as string,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim()),
};
