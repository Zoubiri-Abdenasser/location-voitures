import { Link, NavLink } from "react-router-dom";
import { isAuthenticated } from "../../api/auth";

const navItems = [
  { to: "/", label: "الرئيسية" },
  { to: "/cars", label: "أسطول السيارات" },
  { to: "/services", label: "خدماتنا" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "اتصل بنا" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-20">
        {/* الشعار */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path
                d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"
                stroke="#F5A623"
                strokeWidth="1.5"
              />
              <circle cx="7.5" cy="16.5" r="1.5" fill="#F5A623" />
              <circle cx="16.5" cy="16.5" r="1.5" fill="#F5A623" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="font-display font-extrabold text-lg">زوبيري</p>
            <p className="text-[10px] text-muted tracking-wide">لكراء السيارات</p>
          </div>
        </Link>

        {/* التنقل */}
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium pb-1 border-b-2 transition-colors ${
                  isActive
                    ? "text-ink border-gold"
                    : "text-muted border-transparent hover:text-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* التواصل + الدخول */}
        <div className="flex items-center gap-4">
          <a href="tel:+213555000000" className="hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
                  fill="#F5A623"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold" dir="ltr">+213 555 00 00 00</p>
              <p className="text-[11px] text-muted">تواصل معنا</p>
            </div>
          </a>

          <Link
            to={isAuthenticated() ? "/admin" : "/login"}
            className="rounded-full bg-ink text-paper text-sm font-bold px-5 py-2.5 hover:bg-gold hover:text-ink transition-colors"
          >
            {isAuthenticated() ? "لوحة التحكم" : "تسجيل الدخول"}
          </Link>
        </div>
      </div>
    </header>
  );
}