import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { cn } from "../../lib/utils";
import { detect } from "./detection";
import { verdictStyle } from "./verdict";

const SCAN_STAGES = [
  "Parsing URL",
  "Inspecting domain & certificate",
  "Resolving redirects",
  "Scoring lexical signals",
];

const SAMPLE_URLS = [
  "https://paypal.verify-account.login-secure.tk/signin",
  "https://google.com",
  "http://192.168.4.21/apple-id/confirm",
  "https://amzn-invoice-update.xyz/billing",
  "https://github.com",
];

const RECENT_SCAN_SEED = [
  { host: "paypal.verify-account.login-secure.tk", verdict: "malicious", risk: 91 },
  { host: "google.com", verdict: "safe", risk: 14 },
  { host: "192.168.4.21/apple-id/confirm", verdict: "malicious", risk: 88 },
  { host: "bit.ly/3xK9pLm", verdict: "suspicious", risk: 47 },
  { host: "amzn-invoice-update.xyz/billing", verdict: "malicious", risk: 79 },
  { host: "wellsfargo.com-secure-login.cf", verdict: "malicious", risk: 84 },
];

const RECENT_SCAN_ICON = {
  malicious: ShieldX,
  suspicious: ShieldAlert,
  safe: ShieldCheck,
};

function VerdictIcon({ verdict, className }) {
  const Icon = verdict === "malicious" ? ShieldX : verdict === "suspicious" ? ShieldAlert : ShieldCheck;
  return <Icon className={className} strokeWidth={1.5} />;
}

export function ScannerPanel({
  variant = "live",
  className,
  initialUrl,
  autoRun = false,
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [status, setStatus] = useState("idle");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState(RECENT_SCAN_SEED);
  const [tab, setTab] = useState("result");
  const inputRef = useRef(null);
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const runScan = useCallback(
    async (target) => {
      if (!target.trim()) return;
      clearTimers();
      setStatus("scanning");
      setStage(0);
      setResult(null);
      setTab("result");

      // Stage the loading sequence.
      SCAN_STAGES.forEach((_, i) => {
        timers.current.push(
          setTimeout(() => setStage(i), i * 220),
        );
      });

      try {
        // Run local simulation of the detector on the client side
        await new Promise((resolve) => setTimeout(resolve, SCAN_STAGES.length * 220));
        const data = detect(target);
        
        setResult(data);
        setStatus("done");
        setRecent((prev) => [
          { host: data.host || target, verdict: data.verdict, risk: data.riskScore },
          ...prev.slice(0, 7),
        ]);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    },
    [clearTimers],
  );

  useEffect(() => {
    if (autoRun && initialUrl) {
      runScan(initialUrl);
    }
    return clearTimers;
  }, [autoRun, initialUrl, runScan, clearTimers]);

  const onSubmit = (e) => {
    e.preventDefault();
    runScan(url);
  };

  const onSample = (s) => {
    setUrl(s);
    runScan(s);
  };

  const expanded = variant === "expanded";

  return (
    <div
      className={cn(
        "flex flex-col",
        expanded && "lg:flex-row",
        className,
      )}
    >
      {/* ---------------- Scanner ---------------- */}
      <div
        className={cn(
          "flex flex-col gap-5 p-5 sm:p-6",
          expanded && "lg:w-[440px] lg:shrink-0 lg:border-r lg:border-subtle",
        )}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label htmlFor="scan-url" className="text-xs font-medium uppercase tracking-wider text-faint">
            URL to inspect
          </label>
          <div className="flex items-stretch gap-2">
            <input
              id="scan-url"
              ref={inputRef}
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              className="h-10 min-w-0 flex-1 rounded-md border border-subtle bg-forest-950/60 px-3 font-mono text-sm text-fg placeholder:text-faint focus:border-forest-500/70 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
            />
            <button
              type="submit"
              disabled={status === "scanning" || !url.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-forest-600/60 bg-forest-700/40 px-4 text-sm font-medium text-forest-100 transition-colors hover:border-forest-500 hover:bg-forest-700/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "scanning" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                  Scanning
                </>
              ) : (
                <>
                  Scan
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sample URLs */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-faint">Try:</span>
          {SAMPLE_URLS.slice(0, expanded ? 4 : 3).map((s) => (
            <button
              key={s}
              onClick={() => onSample(s)}
              className="rounded border border-subtle px-2 py-0.5 font-mono text-[11px] text-muted transition-colors hover:border-forest-600/60 hover:text-forest-200"
            >
              {s.length > 28 ? s.slice(0, 26) + "…" : s}
            </button>
          ))}
        </div>

        {/* Loading sequence */}
        <AnimatePresence>
          {status === "scanning" && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-1.5"
              aria-live="polite"
            >
              {SCAN_STAGES.map((label, i) => (
                <li
                  key={label}
                  className={cn(
                    "flex items-center gap-2 font-mono text-xs transition-colors duration-200",
                    i <= stage ? "text-forest-300" : "text-faint",
                  )}
                >
                  <span
                    className={cn(
                      "h-1 w-1 rounded-full transition-colors",
                      i <= stage ? "bg-forest-300" : "bg-forest-700",
                    )}
                  />
                  {label}
                  {i === stage && i < SCAN_STAGES.length - 1 && (
                    <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-forest-300/60" />
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Recent scans (compact, in the side panel) */}
        {expanded && (
          <div className="mt-auto hidden flex-col gap-2 lg:flex">
            <span className="text-xs font-medium uppercase tracking-wider text-faint">
              Recent scans
            </span>
            <ul className="flex flex-col divide-y divide-forest-900/80">
              {recent.slice(0, 5).map((r, i) => {
                const Icon = RECENT_SCAN_ICON[r.verdict];
                return (
                  <li
                    key={r.host + i}
                    className="flex items-center gap-2.5 py-1.5 text-xs"
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5 shrink-0",
                        r.verdict === "malicious"
                          ? "text-forest-500"
                          : r.verdict === "suspicious"
                            ? "text-forest-400"
                            : "text-forest-300",
                      )}
                      strokeWidth={1.5}
                    />
                    <span className="min-w-0 flex-1 truncate font-mono text-muted">
                      {r.host}
                    </span>
                    <span className="tnum font-mono text-faint">{r.risk}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* ---------------- Result panel ---------------- */}
      <div className="min-h-[320px] flex-1 border-t border-subtle lg:border-l-0 lg:border-t-0">
        {expanded && (
          <div className="flex items-center gap-1 border-b border-subtle px-3 pt-2">
            {["result", "raw", "recent"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative -mb-px border-b-2 px-3 py-2 text-xs font-medium capitalize transition-colors",
                  tab === t
                    ? "border-forest-500 text-forest-200"
                    : "border-transparent text-faint hover:text-muted",
                )}
              >
                {t === "raw" ? "Raw response" : t}
              </button>
            ))}
          </div>
        )}

        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            {status === "idle" && !result && (
              <IdleState key="idle" expanded={expanded} />
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 text-center"
              >
                <p className="text-sm text-forest-200">Scan failed.</p>
                <p className="text-xs text-faint">
                  The analysis service is unavailable. Try again.
                </p>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {(!expanded || tab === "result") && (
                  <ResultView result={result} expanded={expanded} />
                )}
                {expanded && tab === "raw" && <RawView result={result} />}
                {expanded && tab === "recent" && (
                  <RecentView recent={recent} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Sub-views ----------------------------- */

function IdleState({ expanded }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[260px] flex-col items-start justify-center gap-3"
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-faint">
        <span className="h-1.5 w-1.5 rounded-full bg-forest-600" />
        Awaiting input
      </div>
      <p className={cn("font-display text-fg", expanded ? "text-xl" : "text-lg")}>
        Paste a URL to see the verdict.
      </p>
      <p className="max-w-sm text-sm text-muted">
        The model scores domain structure, certificate, redirects, and lexical
        signals, then returns a prediction, confidence, and risk score.
      </p>
    </motion.div>
  );
}

function ResultView({
  result,
  expanded,
}) {
  const v = verdictStyle[result.verdict];
  const stages = [
    { key: "verdict", delay: 0 },
    { key: "scores", delay: 0.08 },
    { key: "explanation", delay: 0.16 },
    { key: "features", delay: 0.24 },
    { key: "recommendations", delay: 0.32 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Verdict — dominant */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: stages[0].delay }}
        className={cn(
          "flex items-center gap-3 rounded-lg border px-4 py-3",
          v.chip,
        )}
      >
        <VerdictIcon verdict={result.verdict} className={cn("h-5 w-5 shrink-0", v.text)} />
        <div className="flex flex-col">
          <span className={cn("font-display text-2xl font-semibold leading-none tracking-tight-2", v.text)}>
            {v.label}
          </span>
          <span className="mt-1 font-mono text-[11px] text-faint">
            {result.host || result.url}
          </span>
        </div>
      </motion.div>

      {/* Scores */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: stages[1].delay }}
        className="grid grid-cols-2 gap-3"
      >
        <Metric
          label="Confidence"
          value={`${result.confidence.toFixed(1)}%`}
          fill={result.confidence}
        />
        <Metric
          label="Risk score"
          value={`${result.riskScore}`}
          sub={result.riskLabel}
          fill={result.riskScore}
          tone={result.verdict}
        />
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: stages[2].delay }}
      >
        <SectionLabel>Threat explanation</SectionLabel>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {result.threatExplanation}
        </p>
      </motion.div>

      {/* Feature importance */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: stages[3].delay }}
      >
        <SectionLabel>Feature importance</SectionLabel>
        <ul className="mt-3 flex flex-col gap-2.5">
          {result.features.map((f, i) => (
            <li key={f.label} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs text-fg">{f.label}</span>
                <span className="tnum font-mono text-[11px] text-faint">{f.weight}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-forest-950">
                <motion.div
                  className={cn("h-full rounded-full", v.bar)}
                  initial={{ width: 0 }}
                  animate={{ width: `${f.weight}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: stages[3].delay + 0.05 + i * 0.04 }}
                />
              </div>
              <span className="text-[11px] leading-snug text-faint">{f.detail}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: stages[4].delay }}
      >
        <SectionLabel>Recommendations</SectionLabel>
        <ul className="mt-2 flex flex-col gap-1.5">
          {result.recommendations.map((r) => (
            <li key={r} className="flex gap-2.5 text-sm text-muted">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest-500" />
              {r}
            </li>
          ))}
        </ul>
      </motion.div>

      {expanded && (
        <div className="flex items-center gap-3 border-t border-subtle pt-4 font-mono text-[11px] text-faint">
          <span>scanned {new Date(result.scannedAt).toLocaleTimeString()}</span>
          <span>·</span>
          <span>{result.latencyMs}ms</span>
          <span>·</span>
          <span className="uppercase">{result.raw.scheme}</span>
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  fill,
  tone,
}) {
  const barColor =
    tone === "malicious"
      ? "bg-forest-700"
      : tone === "suspicious"
        ? "bg-forest-500"
        : "bg-forest-300";
  return (
    <div className="rounded-lg border border-subtle bg-forest-950/40 p-3.5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wider text-faint">{label}</span>
        {sub && <span className="text-[11px] text-faint">{sub}</span>}
      </div>
      <div className="tnum mt-1.5 font-display text-xl font-semibold text-fg">{value}</div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-forest-950">
        <motion.div
          className={cn("h-full rounded-full", barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${fill}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <span className="text-xs font-medium uppercase tracking-wider text-faint">
      {children}
    </span>
  );
}

function RawView({ result }) {
  const json = JSON.stringify(result, null, 2);
  return (
    <div className="overflow-hidden rounded-lg border border-subtle bg-forest-950/70">
      <div className="flex items-center justify-between border-b border-subtle px-3 py-2">
        <span className="font-mono text-[11px] text-faint">response.json</span>
        <span className="font-mono text-[11px] text-faint">200 OK · {result.latencyMs}ms</span>
      </div>
      <pre className="max-h-[420px] overflow-auto p-4 font-mono text-[12px] leading-relaxed text-muted">
        <Syntax color={result.verdict}>{json}</Syntax>
      </pre>
    </div>
  );
}

function Syntax({
  children,
  color,
}) {
  const keyColor = "text-forest-300";
  const strColor = "text-forest-200";
  const numColor = "text-forest-100";
  const verdictColor =
    color === "malicious" ? "text-forest-500" : color === "suspicious" ? "text-forest-400" : "text-forest-300";

  const parts = children.split(/("(?:\\.|[^"\\])*"|\b\d+(?:\.\d+)?\b)/g);
  return (
    <code>
      {parts.map((p, i) => {
        if (!p) return null;
        if (p.startsWith('"')) {
          const next = parts[i + 1];
          if (next !== undefined && next.trimStart().startsWith(":")) {
            return <span key={i} className={keyColor}>{p}</span>;
          }
          const inner = p.slice(1, -1);
          if (inner === color) {
            return <span key={i} className={verdictColor}>{p}</span>;
          }
          return <span key={i} className={strColor}>{p}</span>;
        }
        if (/^\d+(\.\d+)?$/.test(p)) {
          return <span key={i} className={numColor}>{p}</span>;
        }
        return <span key={i}>{p}</span>;
      })}
    </code>
  );
}

function RecentView({
  recent,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-subtle">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-subtle bg-forest-950/40 text-faint">
          <tr>
            <th className="px-3 py-2 font-medium uppercase tracking-wider">Host</th>
            <th className="px-3 py-2 font-medium uppercase tracking-wider">Verdict</th>
            <th className="px-3 py-2 text-right font-medium uppercase tracking-wider">Risk</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-forest-900/80">
          {recent.map((r, i) => {
            const Icon = RECENT_SCAN_ICON[r.verdict];
            return (
              <tr key={r.host + i} className="transition-colors hover:bg-forest-950/40">
                <td className="max-w-0 truncate px-3 py-2 font-mono text-muted">{r.host}</td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center gap-1.5 capitalize">
                    <Icon
                      className={cn(
                        "h-3 w-3",
                        r.verdict === "malicious"
                          ? "text-forest-500"
                          : r.verdict === "suspicious"
                            ? "text-forest-400"
                            : "text-forest-300",
                      )}
                      strokeWidth={1.5}
                    />
                    {r.verdict}
                  </span>
                </td>
                <td className="tnum px-3 py-2 text-right font-mono text-faint">{r.risk}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
