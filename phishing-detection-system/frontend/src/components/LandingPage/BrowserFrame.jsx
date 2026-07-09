import { cn } from "../../lib/utils";

/**
 * A realistic, restrained browser-window frame. Traffic-light dots are
 * rendered in the forest greyscale, never red/yellow/green. The address bar
 * is a real, labelable element — used by the scanner.
 */
export function BrowserFrame({
  url = "kavach.io",
  children,
  className,
  addressSlot,
  loading = false,
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-strong bg-surface-raised shadow-2xl shadow-black/40 backdrop-blur-sm",
        className,
      )}
    >
      {/* Chrome */}
      <div className="flex items-center gap-3 border-b border-subtle bg-forest-950/70 px-4 py-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-forest-700/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-forest-600/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-forest-500/60" />
        </div>

        {addressSlot ?? (
          <div className="ml-2 flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md border border-subtle bg-forest-950/60 px-3 text-xs text-muted">
            <span className="font-mono text-faint" aria-hidden="true">
              {loading ? "analyzing…" : "https://"}
            </span>
            <span className="truncate font-mono text-muted/90">{url}</span>
          </div>
        )}

        <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
          <span className="h-3 w-3 rounded-[3px] border border-subtle" />
          <span className="h-3 w-3 rounded-[3px] border border-subtle" />
        </div>
      </div>

      {/* Viewport */}
      <div className="relative">{children}</div>
    </div>
  );
}
