import { Star, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function GithubSection() {
  return (
    <section id="github" className="relative scroll-mt-20 border-t border-subtle">
      <div className="px-6 py-16 sm:px-10 lg:py-20 lg:px-16 xl:px-24">
        <Reveal>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col gap-6 border-t border-subtle py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-faint">kavach/</span>
                <span className="font-display text-base font-semibold text-fg">
                  kavach
                </span>
              </div>
              <p className="max-w-md text-sm text-muted">
                The detection engine, signal definitions, and a self-hostable
                API. MIT-licensed.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-forest-300" strokeWidth={1.5} />
                <span className="tnum font-mono text-sm text-fg">2,418</span>
                <span className="text-xs text-faint">stars</span>
              </div>
              <span className="hidden h-8 w-px bg-forest-900 sm:block" />
              <span className="inline-flex items-center gap-1.5 rounded-md border border-subtle px-3 py-2 text-sm text-muted transition-colors group-hover:border-forest-500/50 group-hover:text-forest-200">
                View on GitHub
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
