import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import carsRoutes from "./routes/cars.routes";
import reservationsRoutes from "./routes/reservations.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

// CORS - يسمح فقط بالنطاقات المحددة في .env
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
  })
);

app.use(express.json());

// نظام Keep-Alive بسيط (لمنع Render من إيقاف السيرفر عند السكون)
// نفس الحل المستخدم في مشروع Caffè Notte
setInterval(() => {
  console.log(`[Keep-Alive] ${new Date().toISOString()}`);
}, 10 * 60 * 1000);

app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚗 السيرفر يعمل على المنفذ ${env.PORT} (${env.NODE_ENV})`);
});
