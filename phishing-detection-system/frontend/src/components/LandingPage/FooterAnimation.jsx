import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  motion,
  useInView,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Signature footer animation — the boat that sails back and forth across the
 * full width, catching phishing-URL fish on each leg.
 *
 * The SVG fills its container (absolute inset-0) so it can sit BEHIND the
 * footer content as a living background. A hooded analyst pilots a small
 * boat left → right → left → repeat. On the forward leg a fish is hooked
 * and hauled aboard; on the return leg a second fish is caught. The scene
 * is eye-catching: aurora sky glow, twinkling stars, drifting mist, a warm
 * lantern on the boat, bioluminescent fish, splash particles, wake ripples,
 * and a water reflection of the boat.
 *
 * Palette-locked to the forest scale. Loops only while in viewport.
 * Reduced-motion users get a static composed frame. The whole scene
 * parallaxes subtly with the pointer.
 */

const DURATION = 10; // full back-and-forth cycle (seconds) — repeats every 10s

// Boat traversal: pause-left → travel right → pause-right → travel left → pause-left
const TRAVEL_TIMES = [0, 0.06, 0.44, 0.56, 0.94, 1];
const BOAT_X = [60, 60, 1140, 1140, 60, 60];
const EASE = [0.42, 0, 0.58, 1];

// Gentle bobbing — sampled across the full cycle (around the waterline y=300)
const BOB_TIMES = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
const BOAT_Y = [300, 297, 296, 298, 300, 297, 296, 298, 300];
const BOAT_ROT = [0, -1, -1.4, -0.6, 0, -1, -1.4, -0.6, 0];

// Boat faces right on the forward leg, left on the return leg
const FACE_TIMES = [0, 0.49, 0.51, 0.99, 1];
const BOAT_FACE = [1, 1, -1, -1, 1];

// ── Fish A — caught on the forward leg ──
// Boat faces right, so hook is at boat_x + 108.
// At t=0.25 the boat reaches x=600, hook at x=708. Fish waits there, then
// gets hooked and reeled UP + ALONG with the moving hook over a full second.
//   t=0.08 → fish appears swimming at (708, 388)
//   t=0.25 → HOOKED, glow pulses, fish at (708, 388)
//   t=0.30 → fish rising to (740, 350)
//   t=0.33 → fish mid-arc at (780, 310)
//   t=0.35 → fish reaches boat at (821, 270), disappears
const FISH_A_TIMES = [0, 0.08, 0.15, 0.22, 0.25, 0.30, 0.33, 0.35, 0.99, 1];
const FISH_A_OPACITY = [0, 0.6, 0.8, 0.95, 1.0, 1.0, 0.8, 0, 0, 0];
const FISH_A_X = [708, 708, 708, 708, 708, 740, 780, 821, 708, 708];
const FISH_A_Y = [388, 388, 388, 388, 388, 350, 310, 270, 388, 388];

// ── Fish B — caught on the return leg ──
// Boat faces left, so hook is at boat_x - 108.
// At t=0.75 the boat reaches x=600, hook at x=492. Fish waits there, then
// gets hooked and reeled UP + ALONG with the moving hook over a full second.
//   t=0.58 → fish appears swimming at (492, 388)
//   t=0.75 → HOOKED, glow pulses, fish at (492, 388)
//   t=0.80 → fish rising to (460, 350)
//   t=0.83 → fish mid-arc at (420, 310)
//   t=0.85 → fish reaches boat at (379, 270), disappears
const FISH_B_TIMES = [0, 0.58, 0.65, 0.72, 0.75, 0.80, 0.83, 0.85, 0.99, 1];
const FISH_B_OPACITY = [0, 0.6, 0.8, 0.95, 1.0, 1.0, 0.8, 0, 0, 0];
const FISH_B_X = [492, 492, 492, 492, 492, 460, 420, 379, 492, 492];
const FISH_B_Y = [388, 388, 388, 388, 388, 350, 310, 270, 388, 388];

// Hook glow pulses at the exact catch moments (t=0.25 and t=0.75)
const GLOW_TIMES = [0, 0.24, 0.25, 0.35, 0.74, 0.75, 0.85, 1];
const GLOW_OPACITY = [0, 0, 0.95, 0.2, 0, 0.95, 0.2, 0];
const GLOW_SCALE = [0.6, 0.6, 1.6, 0.8, 0.6, 1.6, 0.8, 0.6];

// Splash particles when the fish breaks the water surface (y crosses 300)
const SPLASH_TIMES = [0, 0.27, 0.30, 0.77, 0.80, 1];
const SPLASH_OPACITY = [0, 0.95, 0, 0.95, 0, 0];
const SPLASH_Y = [0, -10, 0, -10, 0, 0];

// Lantern on the boat — gentle ambient pulse
const LANTERN_OPACITY = [0.7, 1, 0.7, 0.85, 0.7, 1, 0.7, 0.85, 0.7];

export function FooterAnimation() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const controls = useAnimationControls();
  const reduced = usePrefersReducedMotion();

  // Pointer parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18 });
  const sy = useSpring(py, { stiffness: 40, damping: 18 });
  const sceneX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const sceneY = useTransform(sy, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    if (reduced) return;
    if (inView) controls.start("run");
    else controls.stop();
  }, [inView, controls, reduced]);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  if (reduced) return <StaticScene />;

  return (
    <div
      ref={ref}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      onMouseMove={onMove}
      onMouseLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.svg
        viewBox="0 0 1200 480"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="An analyst piloting a boat back and forth across the water, catching phishing URLs"
        style={{ x: sceneX, y: sceneY }}
      >
        <defs>
          <linearGradient id="fc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(113 38% 24%)" />
            <stop offset="30%" stopColor="hsl(110 36% 20%)" />
            <stop offset="55%" stopColor="hsl(106 34% 18%)" />
            <stop offset="75%" stopColor="hsl(100 32% 16%)" />
            <stop offset="100%" stopColor="hsl(98 30% 14%)" />
          </linearGradient>
          <radialGradient id="fc-aurora" cx="25%" cy="15%" r="60%">
            <stop offset="0%" stopColor="hsl(78 50% 55% / 0.22)" />
            <stop offset="50%" stopColor="hsl(98 40% 42% / 0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="fc-moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(80 50% 85% / 0.5)" />
            <stop offset="35%" stopColor="hsl(78 45% 65% / 0.18)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="fc-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(100 32% 14%)" />
            <stop offset="25%" stopColor="hsl(120 40% 8%)" />
            <stop offset="100%" stopColor="hsl(122 46% 3%)" />
          </linearGradient>
          <linearGradient id="fc-hull" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(88 36% 46%)" />
            <stop offset="50%" stopColor="hsl(106 34% 32%)" />
            <stop offset="100%" stopColor="hsl(113 36% 20%)" />
          </linearGradient>
          <radialGradient id="fc-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(78 55% 70% / 1)" />
            <stop offset="45%" stopColor="hsl(78 48% 58% / 0.45)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="fc-lantern" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(72 60% 78% / 1)" />
            <stop offset="40%" stopColor="hsl(78 52% 60% / 0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="fc-blur"><feGaussianBlur stdDeviation="8" /></filter>
        </defs>

        {/* ── Sky ── */}
        <rect x="0" y="0" width="1200" height="480" fill="url(#fc-sky)" />
        <rect x="0" y="0" width="1200" height="480" fill="url(#fc-aurora)" />
        {/* Moon glow, upper-right */}
        <circle cx="980" cy="80" r="160" fill="url(#fc-moon)" />
        <circle cx="980" cy="80" r="28" fill="hsl(80 55% 85%)" opacity="0.25" />
        <circle cx="980" cy="80" r="16" fill="hsl(80 60% 88%)" opacity="0.3" />

        {/* Twinkling stars */}
        {STARS.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="hsl(80 55% 88%)"
            variants={{
              rest: { opacity: s.o + 0.15 },
              run: {
                opacity: [s.o + 0.15, 1, s.o * 0.4, s.o + 0.15],
                transition: {
                  duration: 3 + (i % 4),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                },
              },
            }}
            initial="rest"
            animate={controls}
          />
        ))}

        {/* Drifting mist */}
        <motion.ellipse
          cx="200" cy="180" rx="180" ry="24"
          fill="hsl(113 30% 24%)"
          filter="url(#fc-blur)"
          variants={{
            rest: { opacity: 0.12, x: 0 },
            run: {
              opacity: [0.1, 0.16, 0.1],
              x: [0, 120, 0],
              transition: { duration: DURATION * 2, repeat: Infinity, ease: "linear" },
            },
          }}
          initial="rest"
          animate={controls}
        />
        <motion.ellipse
          cx="800" cy="140" rx="220" ry="20"
          fill="hsl(106 30% 26%)"
          filter="url(#fc-blur)"
          variants={{
            rest: { opacity: 0.1, x: 0 },
            run: {
              opacity: [0.08, 0.14, 0.08],
              x: [0, -100, 0],
              transition: { duration: DURATION * 2.5, repeat: Infinity, ease: "linear" },
            },
          }}
          initial="rest"
          animate={controls}
        />

        {/* Horizon glow line */}
        <rect x="0" y="294" width="1200" height="6" fill="hsl(78 45% 55%)" opacity="0.06" />

        {/* ── Water ── */}
        <rect x="0" y="300" width="1200" height="180" fill="url(#fc-water)" />

        {/* Water shimmer lines */}
        {[312, 324, 340, 358, 380, 406, 436].map((y, i) => (
          <Ripple key={y} y={y} x0={-20} w={1240} amp={2 + (i % 2)} controls={controls} delay={i * 0.2} />
        ))}

        {/* Moonlight reflection on water */}
        <motion.ellipse
          cx="980" cy="320" rx="80" ry="3"
          fill="hsl(80 45% 70%)"
          variants={{
            rest: { opacity: 0.1 },
            run: {
              opacity: [0.08, 0.16, 0.08],
              transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            },
          }}
          initial="rest"
          animate={controls}
        />

        {/* Fish (behind the boat) */}
        <Fish data={FISH_A_OPACITY} times={FISH_A_TIMES} fx={FISH_A_X} fy={FISH_A_Y} controls={controls} />
        <Fish data={FISH_B_OPACITY} times={FISH_B_TIMES} fx={FISH_B_X} fy={FISH_B_Y} controls={controls} />

        {/* ── The boat ── */}
        <motion.g
          variants={{
            rest: { x: 60, y: 300, rotate: 0 },
            run: {
              x: BOAT_X,
              y: BOAT_Y,
              rotate: BOAT_ROT,
              transition: {
                x: { duration: DURATION, times: [...TRAVEL_TIMES], ease: EASE, repeat: Infinity },
                y: { duration: DURATION, times: [...BOB_TIMES], ease: EASE, repeat: Infinity },
                rotate: { duration: DURATION, times: [...BOB_TIMES], ease: EASE, repeat: Infinity },
              },
            },
          }}
          initial="rest"
          animate={controls}
          style={{ transformBox: "view-box" }}
        >
          {/* Inner group handles left/right facing flip */}
          <motion.g
            variants={{
              rest: { scaleX: 1 },
              run: {
                scaleX: BOAT_FACE,
                transition: {
                  scaleX: {
                    duration: DURATION,
                    times: [...FACE_TIMES],
                    ease: "linear",
                    repeat: Infinity,
                  },
                },
              },
            }}
            initial="rest"
            animate={controls}
            style={{ transformBox: "view-box", transformOrigin: "0px 0px" }}
          >
            <BoatAssembly controls={controls} />
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
}

/* ----------------------------- Sub components ----------------------------- */

function BoatAssembly({ controls }) {
  return (
    <g>
      {/* Wake ripples trailing behind */}
      <motion.g
        variants={{
          rest: { opacity: 0 },
          run: {
            opacity: [0, 0.5, 0.5, 0.5, 0.5, 0.5, 0],
            transition: { duration: DURATION, times: [...TRAVEL_TIMES], repeat: Infinity },
          },
        }}
        initial="rest"
        animate={controls}
      >
        <path d="M-60,8 q-20,3 -42,0" fill="none" stroke="hsl(78 45% 60%)" strokeWidth="1.2" opacity="0.4" />
        <path d="M-82,12 q-24,3 -50,0" fill="none" stroke="hsl(78 40% 55%)" strokeWidth="1" opacity="0.28" />
        <path d="M-106,16 q-28,3 -58,0" fill="none" stroke="hsl(78 35% 50%)" strokeWidth="0.8" opacity="0.18" />
      </motion.g>

      {/* Water reflection of the boat */}
      <g opacity="0.16" transform="translate(0,36) scale(1,-0.35)">
        <HullShape />
        <rect x="-8" y="-18" width="14" height="16" rx="1.5" fill="hsl(113 30% 16%)" />
      </g>

      {/* Hull */}
      <HullShape />

      {/* Cabin */}
      <rect x="-8" y="-18" width="14" height="16" rx="1.5" fill="hsl(113 30% 16%)" />
      <rect x="-8" y="-18" width="14" height="3" fill="hsl(78 40% 50%)" opacity="0.6" />

      {/* Mast + flag */}
      <line x1="-1" y1="-18" x2="-1" y2="-50" stroke="hsl(98 26% 32%)" strokeWidth="1.5" />
      <motion.path
        d="M-1,-50 L16,-45 L-1,-40 Z"
        fill="hsl(78 45% 52%)"
        variants={{
          rest: { opacity: 0.9 },
          run: {
            opacity: [0.85, 1, 0.85],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          },
        }}
        initial="rest"
        animate={controls}
      />

      {/* Lantern — warm glow at the mast top */}
      <motion.circle
        cx="-1"
        cy="-50"
        r="28"
        fill="url(#fc-lantern)"
        variants={{
          rest: { opacity: 0.8, scale: 1 },
          run: {
            opacity: LANTERN_OPACITY,
            scale: [1, 1.15, 1, 1.08, 1, 1.15, 1, 1.08, 1],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          },
        }}
        initial="rest"
        animate={controls}
        style={{ transformOrigin: "-1px -50px", transformBox: "view-box" }}
      />
      <circle cx="-1" cy="-50" r="3.5" fill="hsl(72 65% 78%)" />
      <circle cx="-1" cy="-50" r="1.5" fill="hsl(72 70% 85%)" />

      {/* Fisherman — hooded analyst */}
      <g fill="hsl(113 30% 14%)">
        <path d="M12,-2 q10,-2 16,2 l4,10 q-14,4 -22,0 Z" />
        <path d="M16,-2 q8,-14 20,-14 q12,0 16,14 l-2,4 q-18,4 -32,0 Z" />
        <path d="M26,-16 q4,-12 12,-12 q8,0 10,12 Z" />
        <circle cx="36" cy="-22" r="5" fill="hsl(106 28% 22%)" />
        <path d="M42,-8 q10,-2 18,2 l-2,5 q-10,-3 -18,1 Z" />
      </g>
      {/* Hood rim highlight */}
      <path d="M26,-16 q4,-12 12,-12" fill="none" stroke="hsl(78 45% 58%)" strokeWidth="0.8" opacity="0.55" />

      {/* Fishing rod */}
      <line x1="60" y1="-6" x2="108" y2="-36" stroke="hsl(98 26% 32%)" strokeWidth="2" strokeLinecap="round" />

      {/* Fishing line + hook + glow (animated group) */}
      <motion.g
        variants={{
          rest: { y: 0 },
          run: {
            y: [0, 0, 6, 0, 0, 0, 6, 0, 0],
            transition: { duration: DURATION, times: [...BOB_TIMES], ease: EASE, repeat: Infinity },
          },
        }}
        initial="rest"
        animate={controls}
      >
        <line x1="108" y1="-36" x2="108" y2="86" stroke="hsl(78 40% 55%)" strokeWidth="0.8" opacity="0.5" />
        <path d="M108,86 q-3,4 0,7" fill="none" stroke="hsl(78 40% 55%)" strokeWidth="0.8" opacity="0.7" />

        {/* Hook glow — pulses at each catch */}
        <motion.circle
          cx="108"
          cy="86"
          r="22"
          fill="url(#fc-glow)"
          variants={{
            rest: { opacity: 0, scale: 0.6 },
            run: {
              opacity: GLOW_OPACITY,
              scale: GLOW_SCALE,
              transition: { duration: DURATION, times: [...GLOW_TIMES], ease: EASE, repeat: Infinity },
            },
          }}
          initial="rest"
          animate={controls}
          style={{ transformOrigin: "108px 86px", transformBox: "view-box" }}
        />

        {/* Splash droplets at each catch */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={105 + i * 4}
            cy={86}
            r={1.6}
            fill="hsl(72 60% 75%)"
            variants={{
              rest: { opacity: 0, y: 0 },
              run: {
                opacity: SPLASH_OPACITY,
                y: SPLASH_Y,
                transition: { duration: DURATION, times: [...SPLASH_TIMES], ease: EASE, repeat: Infinity },
              },
            }}
            initial="rest"
            animate={controls}
          />
        ))}
      </motion.g>
    </g>
  );
}

function HullShape() {
  return (
    <path
      d="M-48,-2 L34,-2 L54,4 L42,16 Q0,24 -38,16 Z"
      fill="url(#fc-hull)"
      stroke="hsl(78 45% 52%)"
      strokeWidth="1"
      opacity="0.96"
    />
  );
}

function Fish({
  data,
  times,
  fx,
  fy,
  controls,
}) {
  return (
    <motion.g
      variants={{
        rest: { opacity: 0, x: fx[0], y: fy[0] },
        run: {
          opacity: data,
          x: fx,
          y: fy,
          transition: {
            duration: DURATION,
            times,
            ease: EASE,
            repeat: Infinity,
          },
        },
      }}
      initial="rest"
      animate={controls}
    >
      <circle cx="0" cy="0" r="28" fill="hsl(78 55% 60% / 0.2)" />
      <circle cx="0" cy="0" r="16" fill="hsl(78 55% 62% / 0.25)" />
      <ellipse cx="0" cy="0" rx="16" ry="6.5" fill="hsl(78 55% 60%)" />
      <path d="M-16,0 L-27,-8 L-27,8 Z" fill="hsl(98 42% 48%)" />
      <circle cx="7" cy="-1.5" r="1.5" fill="hsl(120 38% 8%)" />
      <ellipse cx="3" cy="2.5" rx="10" ry="2.5" fill="hsl(72 60% 72% / 0.55)" />
    </motion.g>
  );
}

function Ripple({
  y,
  x0,
  w,
  amp,
  controls,
  delay = 0,
}) {
  const segs = 14;
  let d = `M${x0},${y}`;
  for (let i = 0; i <= segs; i++) {
    const x = x0 + (w / segs) * i;
    const dy = (i % 2 === 0 ? -amp : amp);
    d += ` L${x},${y + dy}`;
  }
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="hsl(78 40% 50%)"
      strokeWidth="0.8"
      variants={{
        rest: { opacity: 0.1 + delay * 0.02, x: 0 },
        run: {
          opacity: [0.08, 0.18, 0.1, 0.14, 0.08],
          x: [0, 10, 0, -8, 0].map((v) => v * (delay + 1)),
          transition: {
            duration: 6 + delay * 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
      }}
      initial="rest"
      animate={controls}
    />
  );
}

const STARS = [
  { x: 80, y: 30, r: 0.8, o: 0.45 },
  { x: 180, y: 60, r: 0.6, o: 0.35 },
  { x: 300, y: 24, r: 0.9, o: 0.5 },
  { x: 420, y: 50, r: 0.5, o: 0.3 },
  { x: 540, y: 80, r: 0.7, o: 0.4 },
  { x: 660, y: 36, r: 0.6, o: 0.35 },
  { x: 760, y: 110, r: 0.5, o: 0.3 },
  { x: 880, y: 180, r: 0.5, o: 0.28 },
  { x: 1080, y: 160, r: 0.6, o: 0.32 },
  { x: 1160, y: 50, r: 0.7, o: 0.4 },
  { x: 140, y: 120, r: 0.4, o: 0.22 },
  { x: 380, y: 140, r: 0.5, o: 0.28 },
  { x: 600, y: 160, r: 0.4, o: 0.24 },
  { x: 1000, y: 220, r: 0.5, o: 0.3 },
];

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

function StaticScene() {
  return (
    <div className="absolute inset-0 h-full w-full" aria-hidden="true">
      <svg viewBox="0 0 1200 480" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label="An analyst piloting a boat, with caught phishing URLs aboard">
        <defs>
          <linearGradient id="fc-sky-s" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(113 38% 24%)" />
            <stop offset="30%" stopColor="hsl(110 36% 20%)" />
            <stop offset="55%" stopColor="hsl(106 34% 18%)" />
            <stop offset="75%" stopColor="hsl(100 32% 16%)" />
            <stop offset="100%" stopColor="hsl(98 30% 14%)" />
          </linearGradient>
          <linearGradient id="fc-water-s" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(106 36% 20%)" />
            <stop offset="30%" stopColor="hsl(120 38% 10%)" />
            <stop offset="100%" stopColor="hsl(122 44% 4%)" />
          </linearGradient>
          <linearGradient id="fc-hull-s" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(98 30% 40%)" />
            <stop offset="50%" stopColor="hsl(106 32% 28%)" />
            <stop offset="100%" stopColor="hsl(113 34% 18%)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1200" height="480" fill="url(#fc-sky-s)" />
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="hsl(80 50% 80%)" opacity={s.o} />
        ))}
        <circle cx="980" cy="80" r="22" fill="hsl(80 45% 82%)" opacity="0.18" />
        <rect x="0" y="300" width="1200" height="180" fill="url(#fc-water-s)" />
        <g transform="translate(600,300)">
          <path d="M-48,-2 L34,-2 L54,4 L42,16 Q0,24 -38,16 Z" fill="url(#fc-hull-s)" stroke="hsl(78 45% 52%)" strokeWidth="1" opacity="0.96" />
          <rect x="-8" y="-18" width="14" height="16" rx="1.5" fill="hsl(113 30% 16%)" />
          <line x1="-1" y1="-18" x2="-1" y2="-50" stroke="hsl(98 26% 32%)" strokeWidth="1.5" />
          <path d="M-1,-50 L16,-45 L-1,-40 Z" fill="hsl(78 45% 52%)" />
          <g fill="hsl(113 30% 14%)">
            <path d="M12,-2 q10,-2 16,2 l4,10 q-14,4 -22,0 Z" />
            <path d="M16,-2 q8,-14 20,-14 q12,0 16,14 l-2,4 q-18,4 -32,0 Z" />
            <path d="M26,-16 q4,-12 12,-12 q8,0 10,12 Z" />
            <circle cx="36" cy="-22" r="5" fill="hsl(106 28% 22%)" />
            <path d="M42,-8 q10,-2 18,2 l-2,5 q-10,-3 -18,1 Z" />
          </g>
          <line x1="60" y1="-6" x2="108" y2="-36" stroke="hsl(98 26% 32%)" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
