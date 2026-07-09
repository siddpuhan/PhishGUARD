import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { ShieldLogo } from "./ShieldLogo";
import AuthContext from "../../context/AuthContext";

const LINKS = [
  { label: "Scanner", to: "/scan" },
  { label: "How", href: "#how" },
  { label: "Why", href: "#why" },
  { label: "GitHub", href: "https://github.com" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-subtle bg-forest-950/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="flex h-14 items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-24">
        <Link to="/" className="flex items-center gap-2">
          <ShieldLogo size={20} />
          <span className="font-display text-sm font-semibold tracking-tight-2 text-fg">
            PHISHGUARD
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-7">
            {LINKS.map((l) => (
              <li key={l.label}>
                {l.to ? (
                  <Link
                    to={l.to}
                    className="text-sm text-muted transition-colors hover:text-forest-200"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-forest-200"
                  >
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="text-sm text-muted transition-colors hover:text-forest-200"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-muted transition-colors hover:text-forest-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex h-8 items-center rounded-md border border-forest-600/50 bg-forest-700/40 px-3 text-xs font-medium text-forest-100 transition-colors hover:border-forest-500 hover:bg-forest-700/60"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
export default Nav;
