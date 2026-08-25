import React, { useEffect, useRef } from 'react';

export type BandsMode = 'light' | 'mono';

interface BandUniforms {
  wMin: number;
  wMax: number;
  clusterX: number; // >1 crowds vertical bands toward the right edge; 1 = uniform
  speed: number;
  opacityFlat: number | null; // null = vary per band (light mode); a number flattens it (mono)
}

// DESIGN.md §9 uniform table.
const LIGHT: BandUniforms = { wMin: 0.002, wMax: 0.045, clusterX: 2.4, speed: 0.006, opacityFlat: null };
const MONO: BandUniforms  = { wMin: 0.006, wMax: 0.006, clusterX: 1.0, speed: 0.002, opacityFlat: 0.35 };

const BAND_COUNT = 15; // per axis — sparse enough to leave a large area nearly empty (DESIGN.md §4.4)

function hash(i: number, seed: number) {
  const s = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpUniforms(a: BandUniforms, b: BandUniforms, t: number): BandUniforms {
  return {
    wMin: mix(a.wMin, b.wMin, t),
    wMax: mix(a.wMax, b.wMax, t),
    clusterX: mix(a.clusterX, b.clusterX, t),
    speed: mix(a.speed, b.speed, t),
    opacityFlat: a.opacityFlat === null && b.opacityFlat === null
      ? null
      : mix(a.opacityFlat ?? 0.475, b.opacityFlat ?? 0.475, t),
  };
}

const BASE_COLOR = '#FDFCFA';
const WARP_COLOR = '#8FA8F0'; // blue, vertical bands
const WEFT_COLOR = '#F8DCC8'; // peach, horizontal bands

// Normalized bottom-right rectangle the bio sits in — kept lighter so the
// text stays readable against the densest part of the band field (DESIGN.md §6).
const BIO_ZONE = { x0: 0.58, y0: 0.68, x1: 1.0, y1: 1.0 };

function band(i: number, seed: number, density: number, drift: number, u: BandUniforms) {
  const h = hash(i, seed);
  const x = (h * 7.13 + drift) % 1;
  // density > 1 crowds positions toward 1 (the right/bottom edge); density = 1 is uniform.
  const cluster = density === 1 ? x : Math.pow(x, 1 / density);
  // Width and opacity are right-skewed: most bands thin/faint, a few solid —
  // "some are barely there, a few are solid" (DESIGN.md §4.2), not an even spread.
  const wSkew = Math.pow(hash(i, seed + 41), 1.8);
  const w = mix(u.wMin, u.wMax, wSkew);
  const aSkew = Math.pow(hash(i, seed + 97), 2.2);
  const a = u.opacityFlat !== null ? u.opacityFlat : mix(0.06, 0.88, aSkew);
  return { pos: cluster, width: w, alpha: a };
}

const BandsCanvas: React.FC<{ mode: BandsMode; dimmed?: boolean }> = ({ mode, dimmed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;
    const ctx: CanvasRenderingContext2D = ctx2d;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0, height = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let driftX = 0;
    let driftY = 0;
    let current = mode === 'mono' ? { ...MONO } : { ...LIGHT };
    let transitionFrom = { ...current };
    let transitionStart = 0;
    const TRANSITION_MS = 800;

    function draw() {
      const u = current;

      // Base fill — the surface the bands multiply against.
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = BASE_COLOR;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'multiply';

      // Vertical bands (blue), clustered toward the right edge in light mode.
      ctx.fillStyle = WARP_COLOR;
      for (let i = 0; i < BAND_COUNT; i++) {
        const b = band(i, 0, u.clusterX, driftX, u);
        const cx = b.pos * width;
        const bw = Math.max(3, b.width * width);
        ctx.globalAlpha = b.alpha;
        ctx.fillRect(cx - bw / 2, 0, bw, height);
      }

      // Horizontal bands (peach), always uniformly spread.
      ctx.fillStyle = WEFT_COLOR;
      for (let i = 0; i < BAND_COUNT; i++) {
        const b = band(i, 13, 1.0, driftY, u);
        const cy = b.pos * height;
        const bh = Math.max(3, b.width * height);
        ctx.globalAlpha = b.alpha;
        ctx.fillRect(0, cy - bh / 2, width, bh);
      }

      // Low-density lane behind the bio (bottom-right), both modes: a solid
      // wash through the zone the text actually occupies, feathered only at
      // the outer edge so it reads as a quiet patch, not a hard box.
      ctx.globalCompositeOperation = 'source-over';
      const zx = BIO_ZONE.x0 * width, zy = BIO_ZONE.y0 * height;
      const zw = (BIO_ZONE.x1 - BIO_ZONE.x0) * width, zh = (BIO_ZONE.y1 - BIO_ZONE.y0) * height;

      ctx.fillStyle = 'rgba(253,252,250,0.94)';
      ctx.fillRect(zx, zy, zw, zh);

      const grad = ctx.createRadialGradient(
        zx + zw * 0.5, zy + zh * 0.5, Math.max(zw, zh) * 0.35,
        zx + zw * 0.5, zy + zh * 0.5, Math.max(zw, zh) * 0.85
      );
      grad.addColorStop(0, 'rgba(253,252,250,0.94)');
      grad.addColorStop(1, 'rgba(253,252,250,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(zx - zw * 0.4, zy - zh * 0.4, zw * 1.8, zh * 1.8);

      ctx.globalAlpha = 1;
    }

    function frame(t: number) {
      if (transitionStart > 0) {
        const p = Math.min(1, (t - transitionStart) / TRANSITION_MS);
        current = lerpUniforms(transitionFrom, modeRef.current === 'mono' ? MONO : LIGHT, p);
        if (p >= 1) transitionStart = 0;
      }
      driftX = (driftX + current.speed * 0.016) % 1;
      driftY = (driftY + current.speed * 0.011) % 1;
      draw();
      if (!reduceMotion) raf = requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      draw();
    } else {
      raf = requestAnimationFrame(frame);
    }

    (canvas as any).__startTransition = () => {
      transitionFrom = { ...current };
      transitionStart = performance.now();
      if (reduceMotion) {
        current = modeRef.current === 'mono' ? { ...MONO } : { ...LIGHT };
        draw();
      } else if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    };

    return () => {
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    modeRef.current = mode;
    const canvas = canvasRef.current as any;
    canvas?.__startTransition?.();
  }, [mode]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: dimmed ? 0.5 : 1,
        transition: 'opacity 500ms ease',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          animation: 'bands-fade-in 900ms ease-out 120ms forwards',
        }}
      />
    </div>
  );
};

export default BandsCanvas;
