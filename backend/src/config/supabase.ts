import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// نستخدم Service Key هنا (وليس anon key) لأن كل التحقق من الصلاحيات
// يتم في الـ backend عبر JWT الخاص بنا، وليس عبر Supabase Auth مباشرة
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
