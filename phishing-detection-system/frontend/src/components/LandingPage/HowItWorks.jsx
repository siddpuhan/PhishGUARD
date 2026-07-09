import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "You submit a URL",
    body: "The URL is normalized and parsed — scheme, host, registered domain, path, and query are separated before any signal is scored.",
  },
  {
    n: "02",
    title: "Thirteen signals are scored",
    body: "TLS presence, IP-host, high-abuse TLDs, brand impersonation, credential-harvesting terms, subdomain stacking, hyphenation, length, punycode homoglyphs, shorteners, embedded credentials, misleading segments, and reputation.",
  },
  {
    n: "03",
    title: "Signals combine into a risk score",
    body: "Weighted contributions sum to a 0–100 risk score. The distance from the decision boundary sets the confidence of the verdict.",
  },
  {
    n: "04",
    title: "You receive a verdict and a trace",
    body: "A three-tier verdict, confidence, risk, a plain-language explanation, ranked feature weights, and concrete next steps — all in one response.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-20 border-t border-subtle">
      <div className="px-6 py-20 sm:px-10 lg:py-28 lg:px-16 xl:px-24">
        <Reveal>
          <span className="text-xs font-medium uppercase tracking-wider text-faint">
            How it works
          </span>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight-2 text-fg sm:text-4xl">
            From a pasted string to a defensible decision.
          </h2>
        </Reveal>

        <ol className="mt-14 flex flex-col gap-0">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 0.05}>
              <div className="relative grid grid-cols-1 gap-6 border-t border-subtle py-10 sm:grid-cols-12">
                {/* Oversized ghost number */}
                <div className="sm:col-span-3">
                  <span
                    aria-hidden="true"
                    className="font-display text-5xl font-semibold leading-none tracking-tight-3 text-forest-800"
                  >
                    {step.n}
                  </span>
                </div>
                <div className="sm:col-span-7">
                  <h3 className="font-display text-xl font-semibold tracking-tight-2 text-fg">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
                <div className="hidden sm:col-span-2 sm:flex sm:items-start sm:justify-end">
                  <span className="font-mono text-xs text-faint">
                    step {i + 1}/{STEPS.length}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
