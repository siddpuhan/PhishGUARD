import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { BrowserFrame } from "./BrowserFrame";
import { ScannerPanel } from "./ScannerPanel";
import { Particles } from "./Particles";
import { ShieldLogo } from "./ShieldLogo";

const TYPING_URLS = [
  "paypal.verify-account.login-secure.tk",
  "192.168.4.21/apple-id/confirm",
  "amzn-invoice-update.xyz/billing",
  "wellsfargo.com-secure-login.cf",
];

const SIGNALS = [
  "TLS certificate",
  "IP-address host",
  "High-abuse TLD",
  "Brand impersonation",
  "Credential terms",
  "Subdomain stacking",
  "Hyphenation",
  "URL length",
  "Punycode homoglyph",
  "URL shortener",
  "Embedded credentials",
  "Misleading '@'",
  "Reputation",
];

const THREAT_FEED = [
  { host: "paypal.verify-account.login-secure.tk", v: "malicious" },
  { host: "google.com", v: "safe" },
  { host: "192.168.4.21/apple-id/confirm", v: "malicious" },
  { host: "bit.ly/3xK9pLm", v: "suspicious" },
  { host: "amzn-invoice-update.xyz/billing", v: "malicious" },
  { host: "wellsfargo.com-secure-login.cf", v: "malicious" },
  { host: "github.com", v: "safe" },
  { host: "recover-meta-wallet.click", v: "suspicious" },
  { host: "netflix.billing-update.party", v: "malicious" },
  { host: "linear.app", v: "safe" },
];

const FEED_ICON = {
  malicious: ShieldX,
  suspicious: ShieldAlert,
  safe: ShieldCheck,
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroBackdrop />
      <Particles density={0.00005} />

      <div className="relative grid grid-cols-1 gap-12 px-6 pb-20 pt-28 sm:px-10 sm:pt-32 lg:grid-cols-12 lg:gap-10 lg:px-16 lg:pb-28 lg:pt-36 xl:px-24">
        {/* Left — headline column */}
        <div className="relative lg:col-span-5 lg:pt-4">
          <ShieldWatermark />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-subtle bg-surface px-3 py-1 text-xs text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-300 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-forest-300" />
              </span>
              PhishGuard · Advanced Threat Shield
            </span>
          </motion.div>

          <Headline />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="mt-5 max-w-md text-base leading-relaxed text-muted"
          >
            Our system inspects domain structure, certificate, redirects, and
            lexical signals — then returns a prediction, confidence, risk
            score, and the features that drove the threat assessment.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <MagneticCTA />
            <a
              href="#how"
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm text-muted transition-colors hover:text-forest-200"
            >
              How it works
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-6 border-t border-subtle pt-6"
          >
            <Stat label="URLs scanned" value={<LiveCounter />} pulse />
            <Stat label="Signals scored" value="13" />
            <Stat label="Median latency" value="340ms" />
          </motion.div>

          {/* Signal chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.58 }}
            className="mt-6"
          >
            <div className="mb-2 flex items-center gap-2 font-mono text-xs text-faint">
              <Zap className="h-3 w-3 text-forest-400" strokeWidth={1.5} />
              <span>every signal, scored</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SIGNALS.map((s, i) => (
                <SignalChip key={s} label={s} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Live threat feed ticker */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.66 }}
            className="mt-6"
          >
            <ThreatTicker />
          </motion.div>
        </div>

        {/* Right — live product UI */}
        <motion.div
          id="scanner"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="lg:col-span-7"
        >
          <BrowserFrame
            url="kavach.io/scan"
            addressSlot={
              <div className="ml-2 flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md border border-subtle bg-forest-950/60 px-3 text-xs text-muted">
                <span className="font-mono text-faint" aria-hidden="true">https://</span>
                <span className="truncate font-mono text-muted/90">phishguard.io/scan</span>
              </div>
            }
          >
            <ScannerPanel
              variant="live"
              initialUrl="https://paypal.verify-account.login-secure.tk/signin"
              autoRun
            />
          </BrowserFrame>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────── Headline ────────────────────────── */

function Headline() {
  const words = ["Paste", "a", "URL.", "Get", "a", "verdict", "in", "under", "a", "second."];
  return (
    <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.06] tracking-tight-3 text-fg sm:text-5xl">
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1 + i * 0.06,
          }}
          className={
            w === "verdict"
              ? "inline-block bg-gradient-to-br from-forest-200 via-forest-300 to-forest-500 bg-clip-text text-transparent"
              : "inline-block"
          }
        >
          {w === "second." ? (
            <>
              {w}
              <br />
            </>
          ) : (
            <>
              {w}&nbsp;
            </>
          )}
        </motion.span>
      ))}
    </h1>
  );
}

/* ────────────────────────── Magnetic CTA ────────────────────────── */

function MagneticCTA() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const relX = e.clientX - (r.left + r.width / 2);
    const relY = e.clientY - (r.top + r.height / 2);
    x.set(relX * 0.18);
    y.set(relY * 0.25);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const MotionLink = motion(Link);

  return (
    <MotionLink
      ref={ref}
      to="/scan"
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-md border border-forest-500/50 bg-forest-700/50 px-5 text-sm font-medium text-forest-100 transition-colors hover:border-forest-400 hover:bg-forest-700/80"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-forest-300/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <ShieldLogo size={15} />
      <span className="relative">Scan Now</span>
      <ArrowRight
        className="relative h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        strokeWidth={2}
      />
    </MotionLink>
  );
}

/* ────────────────────────── Stat ────────────────────────── */

function Stat({
  label,
  value,
  pulse = false,
}) {
  return (
    <div className="group relative">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-faint transition-colors group-hover:text-muted">
        {pulse && (
          <span className="relative flex h-1 w-1">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-300 opacity-70" />
            <span className="relative inline-flex h-1 w-1 rounded-full bg-forest-300" />
          </span>
        )}
        {label}
      </dt>
      <dd className="tnum mt-1 font-display text-lg font-semibold text-fg transition-transform duration-200 group-hover:-translate-y-0.5">
        {value}
      </dd>
    </div>
  );
}

function LiveCounter() {
  const [count, setCount] = useState(184213);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 4) + 1);
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return <span className="tnum">{count.toLocaleString()}</span>;
}

/* ────────────────────────── Signal chips ────────────────────────── */

function SignalChip({ label, index }) {
  return (
    <motion.a
      href="#scanner"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.7 + index * 0.03 }}
      whileHover={{ y: -2 }}
      className="rounded border border-subtle bg-surface px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-forest-500/50 hover:bg-forest-800/40 hover:text-forest-200"
    >
      {label}
    </motion.a>
  );
}

/* ────────────────────────── Threat ticker ────────────────────────── */

function ThreatTicker() {
  const items = [...THREAT_FEED, ...THREAT_FEED];
  return (
    <div className="relative overflow-hidden rounded-md border border-subtle bg-surface/60">
      <div className="flex items-center gap-2 border-b border-subtle px-3 py-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-forest-400" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          live threat feed
        </span>
      </div>
      <div className="relative flex">
        <motion.div
          className="flex shrink-0 items-center gap-6 py-2 pl-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {items.map((item, i) => {
            const Icon = FEED_ICON[item.v];
            return (
              <span key={i} className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px]">
                <Icon
                  className={
                    "h-3 w-3 " +
                    (item.v === "malicious"
                      ? "text-forest-500"
                      : item.v === "suspicious"
                        ? "text-forest-400"
                        : "text-forest-300")
                  }
                  strokeWidth={1.5}
                />
                <span className="text-muted">{item.host}</span>
                <span className="text-faint">·</span>
                <span
                  className={
                    "uppercase " +
                    (item.v === "malicious"
                      ? "text-forest-500"
                      : item.v === "suspicious"
                        ? "text-forest-400"
                        : "text-forest-300")
                  }
                >
                  {item.v}
                </span>
              </span>
            );
          })}
        </motion.div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-forest-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-forest-950 to-transparent" />
      </div>
    </div>
  );
}

/* ────────────────────────── Shield watermark ────────────────────────── */

function ShieldWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-10 -left-10 -z-0 hidden select-none lg:block"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative"
      >
        <div className="opacity-[0.07]">
          <ShieldLogo size={220} />
        </div>
        <motion.div
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-forest-300/20"
          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-forest-300/20"
          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
        />
      </motion.div>
    </div>
  );
}

/* ────────────────────────── Hero backdrop ────────────────────────── */

function HeroBackdrop() {
  const mx = useMotionValue(50);
  const my = useMotionValue(20);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const mask = useMotionTemplate`radial-gradient(300px 300px at ${sx}% ${sy}%, black 30%, transparent 75%)`;
  const glow = useMotionTemplate`radial-gradient(50% 60% at ${sx}% ${sy}%, hsla(78, 40%, 50%, 0.16), transparent 70%)`;

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      onMouseMove={onMove}
      className="pointer-events-none absolute inset-0"
    >
      <motion.div className="absolute inset-0" style={{ background: glow }} />
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
          backgroundImage:
            "linear-gradient(hsl(78 30% 50% / 0.18) 1px, transparent 1px), linear-gradient(90deg, hsl(78 30% 50% / 0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </motion.div>
  );
}
export default Hero;
