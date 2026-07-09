import { useEffect, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

/**
 * Two reactive cursor layers, both fixed to the viewport:
 *
 *  1. A small floating ring that trails the pointer with spring physics —
 *     the "floating cursor".
 *  2. A large, soft radial glow that follows the pointer — the "react
 *     shining element" — which lights up the dark forest background
 *     wherever the user moves.
 *
 * Touch devices and reduced-motion users get neither. The native cursor is
 * kept (the ring is additive, not a replacement).
 */
export function CursorGlow() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Raw pointer position.
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);

  // The glow trails more lazily than the ring for a parallax feel.
  const glowX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.6 });
  const glowY = useSpring(y, { stiffness: 60, damping: 20, mass: 0.6 });

  // The ring follows a touch faster.
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  // Build the reactive gradient string from the spring values.
  const background = useMotionTemplate`radial-gradient(460px 460px at ${glowX}px ${glowY}px, hsla(78, 33%, 55%, 0.12), hsla(98, 32%, 45%, 0.04) 40%, transparent 70%)`;

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target;
      const interactive = !!t?.closest(
        'a, button, input, textarea, select, [role="button"], [data-cursor="hover"]',
      );
      setHovering(interactive);
    };
    const onLeave = () => {
      x.set(-400);
      y.set(-400);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Background shine — large soft radial that lights the forest backdrop */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
        style={{ background }}
      />
      {/* Floating cursor ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border"
          animate={{
            width: hovering ? 38 : 22,
            height: hovering ? 38 : 22,
            borderColor: hovering
              ? "hsla(78, 33%, 60%, 0.9)"
              : "hsla(78, 33%, 55%, 0.55)",
            backgroundColor: hovering
              ? "hsla(78, 33%, 55%, 0.08)"
              : "hsla(78, 33%, 55%, 0)",
          }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-300/80" />
      </motion.div>
    </>
  );
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
