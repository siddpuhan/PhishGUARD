import { useEffect, useRef } from "react";

/**
 * A sparse field of tiny, slow-drifting dots. Pure ambient texture — never
 * reads as a "feature". Canvas-based for low cost. Honors reduced-motion by
 * rendering a static, slightly-faded field.
 */
export function Particles({ density = 0.00006 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let count = 0;
    let dpr = 1;

    let dots = [];

    const seed = () => {
      count = Math.max(24, Math.floor(width * height * density));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.04,
        r: Math.random() * 1.1 + 0.3,
        a: Math.random() * 0.28 + 0.05,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        if (!reduced) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < -2) d.x = width + 2;
          if (d.x > width + 2) d.x = -2;
          if (d.y < -2) d.y = height + 2;
          if (d.y > height + 2) d.y = -2;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(144, 169, 85, ${d.a})`;
        ctx.fill();
      }
    };

    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduced) {
      draw();
    } else {
      loop();
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
