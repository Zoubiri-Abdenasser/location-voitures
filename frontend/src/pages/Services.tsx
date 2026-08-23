const services = [
  {
    title: "كراء يومي وأسبوعي",
    desc: "استأجر سيارتك لليوم أو الأسبوع بأسعار مرنة تناسب احتياجاتك.",
    icon: "📅",
  },
  {
    title: "تأمين شامل",
    desc: "كل سياراتنا مؤمَّنة بالكامل لراحة بالك طوال فترة الكراء.",
    icon: "🛡️",
  },
  {
    title: "توصيل السيارة",
    desc: "نوصل السيارة إلى المكان الذي يناسبك دون أي تكلفة إضافية.",
    icon: "🚚",
  },
  {
    title: "دعم على مدار الساعة",
    desc: "فريقنا متواجد دائمًا لمساعدتك في أي وقت تحتاجه.",
    icon: "🎧",
  },
  {
    title: "أسعار شفافة",
    desc: "لا رسوم مخفية — السعر الذي تراه هو ما تدفعه بالضبط.",
    icon: "🏷️",
  },
  {
    title: "سائق خاص (اختياري)",
    desc: "يمكنك طلب سائق مرافق مع السيارة عند الحاجة.",
    icon: "🧑‍✈️",
  },
];

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display font-extrabold text-3xl mb-3">خدماتنا</h1>
      <p className="text-muted mb-10 max-w-xl">
        نقدّم مجموعة من الخدمات لتجعل تجربة كراء السيارة سهلة ومريحة من البداية للنهاية.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl bg-surface border border-border p-6 hover:border-gold transition-colors"
          >
            <span className="text-3xl">{s.icon}</span>
            <h3 className="font-display font-bold text-lg mt-4 mb-2">{s.title}</h3>
            <p className="text-sm text-muted">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}