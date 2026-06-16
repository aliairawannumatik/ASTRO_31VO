import React, { useCallback, useEffect, useRef, useState } from "react";

// ─── Geometry: 3-4-5 triangle, 40 px per unit ────────────────────────────────
// a = 120 px (vertical),  b = 160 px (horizontal),  c = 200 px (hypotenuse)
const C_PT = { x: 260, y: 310 }; // right-angle vertex
const B_PT = { x: 260, y: 190 }; // top vertex      (leg a)
const A_PT = { x: 420, y: 310 }; // right vertex     (leg b)

// Square a² – left of CB (120 × 120)
const SQ_A = [
  { x: 260, y: 310 },
  { x: 260, y: 190 },
  { x: 140, y: 190 },
  { x: 140, y: 310 },
];

// Square b² – below CA (160 × 160)
const SQ_B = [
  { x: 260, y: 310 },
  { x: 420, y: 310 },
  { x: 420, y: 470 },
  { x: 260, y: 470 },
];

// Square c² – on hypotenuse BA (200 × 200)
// Outward perpendicular to BA = CW rotation of (160,120) = (120,−160)
const SQ_C = [
  { x: 260, y: 190 }, // B
  { x: 420, y: 310 }, // A
  { x: 540, y: 150 }, // A + (120,−160)
  { x: 380, y:  30 }, // B + (120,−160)
];

const centerOf = (pts: { x: number; y: number }[]) => ({
  x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
  y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
});

const CTR_A = centerOf(SQ_A); // ≈ (200, 250)
const CTR_B = centerOf(SQ_B); // ≈ (340, 390)
const CTR_C = centerOf(SQ_C); // ≈ (400, 170)

const W = 600;
const H = 500;
const DURATION = 5000; // ms per cycle

const COL_A  = "#4fc3f7";
const COL_B  = "#81c784";
const COL_C  = "#ffb74d";
const COL_BG = "#1a1a2e";

// ─── Narration steps (t = fraction 0..1) ─────────────────────────────────────
const NARRATION = [
  { t: 0.00, text: "Langkah 1: Perhatikan segitiga siku-siku dengan sisi a = 3, b = 4, c = 5..." },
  { t: 0.12, text: "Langkah 2: Persegi terbentuk di setiap sisi segitiga..." },
  { t: 0.38, text: "Langkah 3: Luas a² = 9,  Luas b² = 16,  Luas c² = 25 satuan persegi." },
  { t: 0.58, text: "Langkah 4: Perhatikan persegi a² dan b² bergerak menuju persegi c²..." },
  { t: 0.82, text: "Langkah 5: Luas a² + b² = 9 + 16 = 25 = Luas c²  ✓" },
];

// ─── Easing helpers ───────────────────────────────────────────────────────────
function easeOut3(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeInOut3(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function phase(t: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (t - start) / (end - start)));
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────
function poly(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[]
) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Draw a square that grows from its centre
function drawSquare(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[],
  ctr: { x: number; y: number },
  scale: number,
  alpha: number,
  fillColor: string,
  strokeColor: string,
  tx = 0, ty = 0
) {
  if (alpha <= 0.005 || scale <= 0.005) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(ctr.x + tx, ctr.y + ty);
  ctx.scale(scale, scale);
  ctx.translate(-ctr.x, -ctr.y);
  poly(ctx, pts);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.5 / scale;
  ctx.stroke();
  ctx.restore();
}

function label(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  color: string, size: number, alpha: number
) {
  if (alpha <= 0.005) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 8;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ─── Main draw function (pure, no React state writes) ────────────────────────
function drawFrame(ctx: CanvasRenderingContext2D, elapsed: number): number {
  const t = Math.min(elapsed / DURATION, 1);

  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = COL_BG;
  ctx.fillRect(0, 0, W, H);

  // ── Phase fractions ──
  const pTri   = easeOut3(phase(t, 0.00, 0.12));   // triangle appears
  const pSqA   = easeOut3(phase(t, 0.12, 0.26));   // a² grows
  const pSqB   = easeOut3(phase(t, 0.22, 0.38));   // b² grows
  const pSqC   = easeOut3(phase(t, 0.34, 0.56));   // c² grows
  const pMove  = easeInOut3(phase(t, 0.58, 0.82)); // a² + b² move to c²
  const pFrm   = easeOut3(phase(t, 0.84, 0.97));   // formula appears

  // ── Square a² ──
  if (pSqA > 0) {
    const alpha = Math.min(pSqA * 2, 1) * (1 - pMove);
    const sc    = pSqA * (1 - pMove * 0.92);
    const tx    = (CTR_C.x - CTR_A.x) * pMove;
    const ty    = (CTR_C.y - CTR_A.y) * pMove;
    drawSquare(ctx, SQ_A, CTR_A, sc, alpha, COL_A + "44", COL_A, tx, ty);

    if (pSqA > 0.5 && pMove < 0.4) {
      const lx = CTR_A.x + tx;
      const ly = CTR_A.y + ty;
      label(ctx, "a²",  lx, ly -  9, COL_A, 22, alpha);
      label(ctx, "= 9", lx, ly + 14, COL_A, 13, alpha * 0.85);
    }
  }

  // ── Square b² ──
  if (pSqB > 0) {
    const alpha = Math.min(pSqB * 2, 1) * (1 - pMove);
    const sc    = pSqB * (1 - pMove * 0.92);
    const tx    = (CTR_C.x - CTR_B.x) * pMove;
    const ty    = (CTR_C.y - CTR_B.y) * pMove;
    drawSquare(ctx, SQ_B, CTR_B, sc, alpha, COL_B + "44", COL_B, tx, ty);

    if (pSqB > 0.5 && pMove < 0.4) {
      const lx = CTR_B.x + tx;
      const ly = CTR_B.y + ty;
      label(ctx, "b²",   lx, ly -  9, COL_B, 22, alpha);
      label(ctx, "= 16", lx, ly + 14, COL_B, 13, alpha * 0.85);
    }
  }

  // ── Square c² (glows as a²+b² merge into it) ──
  if (pSqC > 0) {
    const glow = pMove;

    ctx.save();
    ctx.globalAlpha = pSqC;

    if (glow > 0.05) {
      ctx.shadowColor = COL_C;
      ctx.shadowBlur  = 28 * glow;
    }

    // Fill: transitions from plain orange to combined a+b gradient
    if (glow > 0.05) {
      const grad = ctx.createLinearGradient(
        CTR_C.x - 100, CTR_C.y - 70,
        CTR_C.x + 100, CTR_C.y + 70
      );
      grad.addColorStop(0,   COL_A + "cc");
      grad.addColorStop(0.5, COL_C + "cc");
      grad.addColorStop(1,   COL_B + "cc");
      ctx.globalAlpha = pSqC * (0.45 + glow * 0.55);

      ctx.save();
      ctx.translate(CTR_C.x, CTR_C.y);
      ctx.scale(pSqC, pSqC);
      ctx.translate(-CTR_C.x, -CTR_C.y);
      poly(ctx, SQ_C);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    } else {
      ctx.save();
      ctx.globalAlpha = pSqC * 0.3;
      ctx.translate(CTR_C.x, CTR_C.y);
      ctx.scale(pSqC, pSqC);
      ctx.translate(-CTR_C.x, -CTR_C.y);
      poly(ctx, SQ_C);
      ctx.fillStyle = COL_C + "44";
      ctx.fill();
      ctx.restore();
    }

    // Stroke
    ctx.save();
    ctx.globalAlpha = pSqC;
    ctx.translate(CTR_C.x, CTR_C.y);
    ctx.scale(pSqC, pSqC);
    ctx.translate(-CTR_C.x, -CTR_C.y);
    poly(ctx, SQ_C);
    ctx.strokeStyle = COL_C;
    ctx.lineWidth   = 2.5 / pSqC;
    ctx.stroke();
    ctx.restore();

    ctx.restore();

    label(ctx, "c²",   CTR_C.x, CTR_C.y -  9, COL_C, 22, pSqC);
    label(ctx, "= 25", CTR_C.x, CTR_C.y + 14, COL_C, 13, pSqC * 0.85);
  }

  // ── Triangle (drawn on top of squares so it's always visible) ──
  if (pTri > 0) {
    ctx.save();
    ctx.globalAlpha = pTri;

    // Fill
    poly(ctx, [C_PT, B_PT, A_PT]);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fill();

    // Stroke
    ctx.strokeStyle = "rgba(255,255,255,0.92)";
    ctx.lineWidth   = 2.5;
    ctx.stroke();

    // Right-angle mark
    ctx.beginPath();
    ctx.moveTo(C_PT.x,      C_PT.y - 15);
    ctx.lineTo(C_PT.x + 15, C_PT.y - 15);
    ctx.lineTo(C_PT.x + 15, C_PT.y);
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.restore();

    // Side labels (fade in with triangle)
    if (pTri > 0.4) {
      const la = Math.min((pTri - 0.4) / 0.6, 1);
      label(ctx, "a = 3", C_PT.x - 28, (C_PT.y + B_PT.y) / 2,      "#93c5fd", 13, la);
      label(ctx, "b = 4", (C_PT.x + A_PT.x) / 2,    C_PT.y + 22,   "#86efac", 13, la);
      label(ctx, "c = 5", (B_PT.x + A_PT.x) / 2 + 24, (B_PT.y + A_PT.y) / 2 - 12, "#fdba74", 13, la);
    }
  }

  // ── Formula banner ──
  if (pFrm > 0) {
    const fx  = W / 2;
    const fy  = H - 44;
    const bw  = 290;
    const bh  = 40;

    ctx.save();
    ctx.globalAlpha = pFrm;

    // Glow
    ctx.shadowColor = "#fde047";
    ctx.shadowBlur  = 18;

    // Pill background
    ctx.fillStyle   = "rgba(234,179,8,0.22)";
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth   = 1.5;
    roundRect(ctx, fx - bw / 2, fy - bh / 2, bw, bh, 10);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur  = 10;
    ctx.fillStyle   = "#fde047";
    ctx.font        = "bold 22px Arial, sans-serif";
    ctx.textAlign   = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("a² + b² = c²  ✓", fx, fy);
    ctx.restore();
  }

  return t; // return normalised progress for caller
}

// ─── Component ────────────────────────────────────────────────────────────────
type UIState = "idle" | "playing" | "paused" | "done";

const PythagorasSquaresAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable animation state lives in a ref (no re-renders from this)
  const anim = useRef({ running: false, raf: 0, startTs: 0, elapsed: 0, speed: 1 });

  // step function stored in a ref so the RAF closure always uses the latest version
  const stepRef = useRef<(ts: number) => void>(() => {});

  const [uiState,   setUiState]   = useState<UIState>("idle");
  const [speed,     setSpeed]     = useState(1);
  const [narration, setNarration] = useState(NARRATION[0].text);
  const [prog,      setProg]      = useState(0);

  // Core draw wrapper — writes to canvas and updates React display state
  const draw = useCallback((elapsed: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = drawFrame(ctx, elapsed);
    setProg(t);

    let narr = NARRATION[0].text;
    for (const n of NARRATION) { if (t >= n.t) narr = n.text; }
    setNarration(narr);
  }, []);

  // Keep stepRef up-to-date on every render (captures latest draw/setUiState)
  useEffect(() => {
    stepRef.current = (ts: number) => {
      const a = anim.current;
      if (!a.running) return;
      const elapsed = (ts - a.startTs) * a.speed;
      if (elapsed >= DURATION) {
        a.running = false;
        a.elapsed = DURATION;
        draw(DURATION);
        setUiState("done");
        return;
      }
      a.elapsed = elapsed;
      draw(elapsed);
      a.raf = requestAnimationFrame(stepRef.current);
    };
  });

  const play = useCallback(() => {
    const a = anim.current;
    if (a.running) return;
    a.running = true;
    a.startTs = performance.now() - a.elapsed / a.speed;
    setUiState("playing");
    a.raf = requestAnimationFrame(stepRef.current);
  }, []);

  const pause = useCallback(() => {
    const a = anim.current;
    a.running = false;
    cancelAnimationFrame(a.raf);
    setUiState("paused");
  }, []);

  const reset = useCallback(() => {
    const a = anim.current;
    a.running = false;
    cancelAnimationFrame(a.raf);
    a.elapsed  = 0;
    a.startTs  = 0;
    setUiState("idle");
    setProg(0);
    setNarration(NARRATION[0].text);
    draw(0);
  }, [draw]);

  const handleSpeed = useCallback((v: number) => {
    const a = anim.current;
    if (a.running) {
      a.startTs = performance.now() - a.elapsed / v;
    }
    a.speed = v;
    setSpeed(v);
  }, []);

  // Initial frame
  useEffect(() => { draw(0); }, [draw]);

  // Cleanup on unmount
  useEffect(() => () => cancelAnimationFrame(anim.current.raf), []);

  return (
    <div className="flex flex-col items-center gap-4 select-none">

      {/* ── Title banner ── */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-2 w-full text-center">
        <p className="font-display text-xs font-bold text-blue-300 uppercase tracking-widest">
          🟦 Animasi Persegi Bergerak — a² + b² = c²
        </p>
        <p className="font-body text-xs text-white/50 mt-0.5">
          Persegi di setiap sisi segitiga bergerak dan bergabung membuktikan Teorema Pythagoras
        </p>
      </div>

      {/* ── Canvas ── */}
      <div
        className="w-full max-w-lg mx-auto rounded-xl overflow-hidden border border-slate-700/50"
        style={{ background: COL_BG }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full h-auto block"
        />
      </div>

      {/* ── Progress bar ── */}
      <div className="w-full max-w-lg mx-auto bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${prog * 100}%`,
            background: "linear-gradient(to right, #4fc3f7, #81c784, #ffb74d)",
            transition: "width 80ms linear",
          }}
        />
      </div>

      {/* ── Controls ── */}
      <div className="flex gap-3 items-center flex-wrap justify-center">
        {uiState === "idle" && (
          <button
            onClick={play}
            className="px-6 py-2.5 rounded-xl font-body font-bold text-sm
              bg-gradient-to-r from-blue-500 to-cyan-600
              hover:from-blue-400 hover:to-cyan-500
              text-white shadow-lg shadow-blue-500/30
              transition-all active:scale-95"
          >
            ▶ Play
          </button>
        )}

        {uiState === "playing" && (
          <button
            onClick={pause}
            className="px-6 py-2.5 rounded-xl font-body font-bold text-sm
              bg-slate-700 hover:bg-slate-600 border border-slate-500
              text-white transition-all active:scale-95"
          >
            ⏸ Pause
          </button>
        )}

        {uiState === "paused" && (
          <>
            <button
              onClick={play}
              className="px-6 py-2.5 rounded-xl font-body font-bold text-sm
                bg-gradient-to-r from-blue-500 to-cyan-600
                hover:from-blue-400 hover:to-cyan-500
                text-white shadow-lg shadow-blue-500/30
                transition-all active:scale-95"
            >
              ▶ Lanjut
            </button>
            <button
              onClick={reset}
              className="px-5 py-2.5 rounded-xl font-body font-bold text-sm
                bg-slate-700 hover:bg-slate-600 border border-slate-500
                text-white transition-all active:scale-95"
            >
              🔄 Reset
            </button>
          </>
        )}

        {uiState === "done" && (
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl font-body font-bold text-sm
              bg-slate-700 hover:bg-slate-600 border border-slate-500
              text-white transition-all active:scale-95"
          >
            🔄 Ulangi Animasi
          </button>
        )}

        {/* Speed slider */}
        <div className="flex items-center gap-2 font-body text-xs text-white/60">
          <span title="Lambat">🐢</span>
          <input
            type="range"
            min={0.5} max={2} step={0.25}
            value={speed}
            onChange={e => handleSpeed(Number(e.target.value))}
            className="w-24 accent-cyan-400"
            aria-label="Kecepatan animasi"
          />
          <span title="Cepat">🚀</span>
          <span className="text-cyan-300 font-bold w-8">{speed}×</span>
        </div>
      </div>

      {/* ── Real-time values ── */}
      <div className="flex gap-3 justify-center flex-wrap font-body text-xs">
        <span className="bg-blue-900/40 border border-blue-500/30 rounded-lg px-3 py-1 text-blue-300 font-bold">a = 3,  a² = 9</span>
        <span className="bg-green-900/40 border border-green-500/30 rounded-lg px-3 py-1 text-green-300 font-bold">b = 4,  b² = 16</span>
        <span className="bg-orange-900/40 border border-orange-500/30 rounded-lg px-3 py-1 text-orange-300 font-bold">c = 5,  c² = 25</span>
      </div>

      {/* ── Step-by-step narration ── */}
      <div className="w-full max-w-lg mx-auto bg-slate-800/60 border border-slate-600/40 rounded-xl px-4 py-3 min-h-[52px] flex items-center">
        <p className="font-body text-sm text-white/85 leading-relaxed">
          {narration}
        </p>
      </div>

      {/* ── Hint ── */}
      <p className={`text-center font-body text-xs max-w-xs leading-relaxed transition-colors duration-300 ${
        uiState === "done"    ? "text-yellow-300 font-semibold" :
        uiState === "playing" ? "text-cyan-300"                 :
        "text-white/45"
      }`}>
        {uiState === "idle"    && "Tekan ▶ Play untuk menyaksikan pembuktian visual Teorema Pythagoras secara animasi!"}
        {uiState === "playing" && "Persegi a² dan b² sedang bergerak menuju c²…"}
        {uiState === "paused"  && "Animasi dijeda. Tekan Lanjut untuk melanjutkan."}
        {uiState === "done"    && "Terbukti! Luas a² + b² = 9 + 16 = 25 = c²  ✓  Teorema Pythagoras berlaku!"}
      </p>
    </div>
  );
};

export default PythagorasSquaresAnimation;
