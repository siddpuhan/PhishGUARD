import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const FEATURE_DATA = [
  { label: "Brand impersonation", weight: 89 },
  { label: "IP-address host", weight: 82 },
  { label: "Punycode homoglyph", weight: 78 },
  { label: "High-abuse TLD", weight: 71 },
  { label: "No TLS certificate", weight: 64 },
  { label: "Credential terms", weight: 58 },
  { label: "Subdomain stacking", weight: 41 },
];

export function WhyItWorks() {
  return (
    <section id="why" className="relative scroll-mt-20 border-t border-subtle">
      <div className="px-6 py-20 sm:px-10 lg:py-28 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Pull-quote claim */}
          <div className="lg:pt-6">
            <Reveal>
              <span className="text-xs font-medium uppercase tracking-wider text-faint">
                Why it works
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <blockquote className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight-2 text-fg sm:text-3xl">
                <span className="text-forest-500">“</span>
                A phishing page is almost never one suspicious trait.
                It is the combination — a brand name in the path, a
                disposable TLD, no certificate, and a login form.
                <span className="text-forest-500">”</span>
              </blockquote>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
                Kavach scores each signal independently, then weighs them
                together. The result is a verdict you can defend — because
                every point of risk is traceable to a named feature, not a
                black-box score.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-subtle bg-forest-950">
                {[
                  { k: "Signals scored", v: "13" },
                  { k: "Verdict tiers", v: "3" },
                  { k: "Risk scale", v: "0–100" },
                  { k: "Confidence basis", v: "Boundary distance" },
                ].map((s) => (
                  <div key={s.k} className="bg-forest-950/60 p-4">
                    <dt className="text-xs uppercase tracking-wider text-faint">{s.k}</dt>
                    <dd className="tnum mt-1 font-display text-base font-semibold text-fg">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Data visualization */}
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-subtle bg-surface-raised p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-faint">
                    Feature importance
                  </span>
                  <p className="mt-1 font-mono text-[11px] text-faint">
                    sample: paypal.verify-account.login-secure.tk
                  </p>
                </div>
                <ConfidenceArc value={91} />
              </div>

              <ul className="mt-8 flex flex-col gap-3.5">
                {FEATURE_DATA.map((f, i) => (
                  <li key={f.label} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-xs text-fg">{f.label}</span>
                      <span className="tnum font-mono text-[11px] text-faint">{f.weight}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-forest-950">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-forest-700 to-forest-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.weight}%` }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{
                          duration: 0.7,
                          ease: [0.22, 1, 0.36, 1],
                          delay: 0.1 + i * 0.06,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center justify-between border-t border-subtle pt-4">
                <span className="text-xs text-faint">Verdict</span>
                <span className="font-display text-sm font-semibold text-forest-200">
                  Malicious · risk 91/100
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ConfidenceArc({ value }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg viewBox="0 0 64 64" className="h-20 w-20 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="hsl(120 38% 12%)"
          strokeWidth="5"
        />
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="hsl(78 33% 50%)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="tnum font-display text-base font-semibold text-fg">{value}</span>
        <span className="text-[9px] uppercase tracking-wider text-faint">conf.</span>
      </div>
    </div>
  );
}
