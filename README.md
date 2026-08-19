# 🚗 Location Voitures

موقع كراء السيارات — مشروع full-stack (React + Express + Supabase)

## البنية

```
location-voitures/
├── backend/     → Express + TypeScript + Supabase
└── frontend/    → React + TypeScript + Vite + Tailwind (قيد الإنشاء)
```

## Backend

راجع `backend/README.md` (قريبًا) للتفاصيل. المتطلبات:
- Node.js 18+
- حساب Supabase (PostgreSQL)

### تشغيل محلي

```bash
cd backend
cp .env.example .env   # ثم املأ القيم الحقيقية
npm install
npm run dev
```

## الحالة الحالية

- [x] تصميم قاعدة البيانات (schema.sql)
- [x] Backend API كامل (auth, cars, reservations)
- [ ] Frontend (React)
- [ ] النشر (Vercel + Render)
