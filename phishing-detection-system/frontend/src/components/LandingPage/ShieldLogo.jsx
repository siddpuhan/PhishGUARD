import { cn } from "../../lib/utils";

/**
 * Kavach shield logo.
 *
 * A heraldic shield silhouette in the forest palette: a dark inner field
 * bounded by a forest-300 stroke, crossed by a vertical spine, and crowned
 * with a subtle inner mark suggesting a lock / eye — "kavach" (shield) that
 * watches over the link you submit. Single component reused in the nav and
 * footer at any size.
 */
export function ShieldLogo({
  className,
  size = 22,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="kavach-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(106 34% 22%)" />
          <stop offset="100%" stopColor="hsl(120 38% 9%)" />
        </linearGradient>
        <linearGradient id="kavach-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(78 40% 62%)" />
          <stop offset="100%" stopColor="hsl(98 34% 45%)" />
        </linearGradient>
      </defs>

      {/* Shield outline */}
      <path
        d="M16 2.5 4.5 6.2v6.3c0 5.6 4 10.4 11.5 13.1C23.5 22.9 27.5 18.1 27.5 12.5V6.2L16 2.5Z"
        fill="url(#kavach-fill)"
        stroke="url(#kavach-stroke)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Vertical spine */}
      <path
        d="M16 5.2 V23.4"
        stroke="hsl(78 40% 62%)"
        strokeWidth="0.7"
        opacity="0.55"
        strokeLinecap="round"
      />

      {/* Inner mark — a lock / eye at the center */}
      <circle
        cx="16"
        cy="13"
        r="3.4"
        fill="none"
        stroke="hsl(78 45% 65%)"
        strokeWidth="1.1"
      />
      <path
        d="M14.4 13 h3.2"
        stroke="hsl(78 50% 70%)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* pupil / keyhole */}
      <circle cx="16" cy="13" r="1" fill="hsl(72 60% 72%)" />

      {/* Inner base accents */}
      <path
        d="M11 18.5 q5 3 10 0"
        stroke="hsl(98 34% 45%)"
        strokeWidth="0.9"
        opacity="0.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
