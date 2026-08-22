import { Link, NavLink } from "react-router-dom";
import { isAuthenticated } from "../../api/auth";

const navItems = [
  { to: "/", label: "الرئيسية" },
  { to: "/cars", label: "السيارات" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "اتصل بنا" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-surface-light">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-display font-extrabold text-xl text-gold">
          زوبيري
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-gold" : "text-paper/80 hover:text-paper"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to={isAuthenticated() ? "/admin" : "/login"}
          className="rounded-full border border-gold-dim px-4 py-1.5 text-sm text-gold hover:bg-gold hover:text-ink transition-colors"
        >
          {isAuthenticated() ? "لوحة التحكم" : "تسجيل الدخول"}
        </Link>
      </div>
    </header>
  );
}