import { BrowserFrame } from "./BrowserFrame";
import { ScannerPanel } from "./ScannerPanel";
import { Reveal } from "./Reveal";

export function ProductPreview() {
  return (
    <section id="scanner" className="relative scroll-mt-20 border-t border-subtle">
      <div className="px-6 py-20 sm:px-10 lg:py-28 lg:px-16 xl:px-24">
        <div className="mb-10 flex flex-col gap-4 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <span className="text-xs font-medium uppercase tracking-wider text-faint">
              The inspector
            </span>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight-2 text-fg sm:text-4xl">
              One URL in. A full risk readout out.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              The same engine that powers the scanner above. Switch to the raw
              response to inspect the exact payload the model returns.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <BrowserFrame
            url="kavach.io/scan?q=expanded"
            addressSlot={
              <div className="ml-2 flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md border border-subtle bg-forest-950/60 px-3 text-xs text-muted">
                <span className="font-mono text-faint" aria-hidden="true">https://</span>
                <span className="truncate font-mono text-muted/90">kavach.io/scan</span>
              </div>
            }
          >
            <ScannerPanel
              variant="expanded"
              initialUrl="https://amzn-invoice-update.xyz/billing"
              autoRun
            />
          </BrowserFrame>
        </Reveal>
      </div>
    </section>
  );
}
