export default function Footer() {
  return (
    <footer className="border-t border-surface-light mt-24">
      <div className="lane-divider" />
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm text-muted">
        <div>
          <p className="font-display font-bold text-paper mb-2">زوبيري</p>
          <p>اكرِ سيارتك بسهولة وأمان، في أي وقت وأي مكان.</p>
        </div>
        <div>
          <p className="font-display font-bold text-paper mb-2">روابط سريعة</p>
          <ul className="space-y-1">
            <li>السيارات</li>
            <li>من نحن</li>
            <li>اتصل بنا</li>
          </ul>
        </div>
        <div>
          <p className="font-display font-bold text-paper mb-2">تواصل معنا</p>
          <p>الهاتف: 0555 00 00 00</p>
          <p>البريد: contact@zoubiri.dz</p>
        </div>
      </div>
      <p className="text-center text-xs text-muted pb-6">
        © {new Date().getFullYear()} زوبيري — جميع الحقوق محفوظة
      </p>
    </footer>
  );
}