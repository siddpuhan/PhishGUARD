import { Link } from "react-router-dom";
import { FooterAnimation } from "./FooterAnimation";
import { ShieldLogo } from "./ShieldLogo";

const NAV = [
  { label: "Scanner", to: "/scan" },
  { label: "How it works", href: "#how" },
  { label: "Why it works", href: "#why" },
  { label: "GitHub", href: "https://github.com" },
];

export function Footer() {
  return (
    <footer
      className="relative mt-auto w-full overflow-hidden"
      style={{ backgroundColor: "hsl(122 40% 7%)" }}
    >
      {/* ── Background animation layer — fills the entire footer ── */}
      <FooterAnimation />

      {/* ── Readability scrim — minimal, just enough for text contrast ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-950/40 via-transparent to-forest-950/35"
      />
      {/* Subtle vignette on the sides for text contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,hsl(122_40%_7%/0.6)_100%)]"
      />

      {/* ── Foreground content — overlaid on top of the animation ── */}
      <div className="relative z-10 flex min-h-[440px] flex-col justify-between px-6 py-12 sm:px-10 lg:px-16 lg:py-16 xl:px-24">
        {/* Top: brand + nav */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <ShieldLogo size={22} />
              <span className="font-display text-base font-semibold text-fg">
                Kavach
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              URL phishing detection. Paste a link, get a defensible verdict —
              prediction, confidence, risk, and the features that drove the call.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              {NAV.map((n) => (
                <li key={n.label}>
                  {n.to ? (
                    <Link
                      to={n.to}
                      className="text-sm text-muted transition-colors hover:text-forest-200"
                    >
                      {n.label}
                    </Link>
                  ) : (
                    <a
                      href={n.href}
                      className="text-sm text-muted transition-colors hover:text-forest-200"
                    >
                      {n.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom: copyright row */}
        <div className="mt-12 flex flex-col gap-2 border-t border-forest-800/60 pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Kavach. MIT licensed.</span>
          <span className="font-mono">
            built with restraint · forest palette
          </span>
        </div>
      </div>
    </footer>
  );
}
