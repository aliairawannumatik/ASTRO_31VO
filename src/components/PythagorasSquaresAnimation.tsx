import React, { useCallback, useEffect, useRef, useState } from "react";

// ─── Geometry: 3-4-5 triangle, 40 px/unit ────────────────────────────────────
// a = 120 px (vertical leg), b = 160 px (horizontal leg), c = 200 px (hypotenuse)
const C_PT = { x: 260, y: 310 }; // right-angle vertex
const B_PT = { x: 260, y: 190 }; // top vertex   (leg a)
const A_PT = { x: 420, y: 310 }; // right vertex  (leg b)

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
// Outward perpendicular to BA = CW rotation of (160,120) → (120, -160)
const SQ_C = [
  { x: 260, y: 190 }, // B
  { x: 420, y: 310 }, // A
  { x: 540, y: 150 }, // A + PERPC
  { x: 380, y:  30 }, // B + PERPC
];
// PERPC unit vector (the "depth" direction of c²)
const PERP = { x: 120, y: -160 }; // length = 200

// ── Fill helpers ──
// Strip of c² between fraction f1 and f2 along PERP direction (0=BA edge, 1=ED edge)
function cStrip(f1: number, f2: number) {
  return [
    { x: 260 + PERP.x * f1, y: 190 + PERP.y * f1 },  // B + f1*PERP
    { x: 420 + PERP.x * f1, y: 310 + PERP.y * f1 },  // A + f1*PERP
    { x: 420 + PERP.x * f2, y: 310 + PERP.y * f2 },  // A + f2*PERP
    { x: 260 + PERP.x * f2, y: 190 + PERP.y * f2 },  // B + f2*PERP
  ];
}

// Centre of a strip
function stripCtr(f1: number, f2: number) {
  const pts = cStrip(f1, f2);
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / 4,
    y: pts.reduce((s, p) => s + p.y, 0) / 4,
  };
}

const centerOf = (pts: { x: number; y: number }[]) => ({
  x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
  y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
});

const CTR_A = centerOf(SQ_A);   // ≈ (200, 250)
const CTR_B = centerOf(SQ_B);   // ≈ (340, 390)
const CTR_C = centerOf(SQ_C);   // ≈ (400, 170)

// a² occupies 9/25 of c², b² occupies 16/25
const F_A = 9 / 25;   // 0.36 — end fraction for a-strip
// Destination centres for the flying squares
const DST_A = stripCtr(0,   F_A);
const DST_B = stripCtr(F_A, 1.0);

const W = 600;
const H = 500;
const DURATION = 6500; // ms per cycle (slightly longer for clarity)

const COL_A   = "#4fc3f7";
const COL_B   = "#81c784";
const COL_C   = "#ffb74d";
const COL_BG  = "#1a1a2e";

// ─── Narration ────────────────────────────────────────────────────────────────
const NARRATION = [
  { t: 0.00, text: "Langkah 1: Perhatikan segitiga siku-siku dengan sisi a = 3, b = 4, c = 5." },
  { t: 0.12, text: "Langkah 2: Persegi terbentuk di setiap sisi segitiga." },
  { t: 0.40, text: "Langkah 3: Luas a² = 9,  Luas b² = 16,  Luas c² = 25 satuan persegi." },
  { t: 0.56, text: "Langkah 4: Persegi biru a² terbang dan mengisi 9/25 bagian dari c²!" },
  { t: 0.70, text: "Langkah 5: Persegi hijau b² terbang dan mengisi sisa 16/25 bagian c²!" },
  { t: 0.87, text: "Langkah 6: a² + b² = 9 + 16 = 25 = c²  ✓  Teorema Pythagoras terbukti!" },
];

// ─── Easing ───────────────────────────────────────────────────────────────────
function easeOut3(t: number)  { return 1 - Math.pow(1 - t, 3); }
function easeOut5(t: number)  { return 1 - Math.pow(1 - t, 5); }
function easeInOut3(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function ph(t: number, s: number, e: number) {
  return Math.max(0, Math.min(1, (t - s) / (e - s)));
}

// ─── Canvas utilities ─────────────────────────────────────────────────────────
function poly(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[]) {
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
  ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,      y + h, x,      y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x,      y,     x + r,  y,         r);
  ctx.closePath();
}

// Draw a polygon scaled from its centre, optionally translated
function drawSquare(
  ctx: CanvasRenderingContext2D,
  pts:   { x: number; y: number }[],
  ctr:   { x: number; y: number },
  scale: number,
  alpha: number,
  fill:  string,
  stroke: string,
  tx = 0, ty = 0
) {
  if (alpha < 0.005 || scale < 0.005) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(ctr.x + tx, ctr.y + ty);
  ctx.scale(scale, scale);
  ctx.translate(-ctr.x, -ctr.y);
  poly(ctx, pts);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.5 / scale;
  ctx.stroke();
  ctx.restore();
}

function lbl(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  color: string, size: number, alpha: number
) {
  if (alpha < 0.005) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle   = color;
  ctx.font        = `bold ${size}px Arial, sans-serif`;
  ctx.textAlign   = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.95)";
  ctx.shadowBlur  = 8;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Draw subtle grid inside a parallelogram strip (area visualisation)
function drawGrid(
  ctx: CanvasRenderingContext2D,
  f1: number, f2: number, color: string, alpha: number
) {
  if (alpha < 0.02) return;
  const pts = cStrip(f1, f2);
  ctx.save();
  ctx.globalAlpha = alpha * 0.35;
  ctx.strokeStyle = color;
  ctx.lineWidth   = 0.7;
  // Clip to the strip polygon
  poly(ctx, pts);
  ctx.clip();
  // Draw horizontal lines along PERP direction
  const steps = 12;
  for (let i = 1; i < steps; i++) {
    const frac = f1 + (f2 - f1) * (i / steps);
    const x1 = 260 + PERP.x * frac;
    const y1 = 190 + PERP.y * frac;
    const x2 = 420 + PERP.x * frac;
    const y2 = 310 + PERP.y * frac;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  // Draw lines along the BA direction
  const baSteps = 10;
  for (let i = 1; i < baSteps; i++) {
    const s = i / baSteps;
    const bx = 260 + (420 - 260) * s;
    const by = 190 + (310 - 190) * s;
    ctx.beginPath();
    ctx.moveTo(bx + PERP.x * f1, by + PERP.y * f1);
    ctx.lineTo(bx + PERP.x * f2, by + PERP.y * f2);
    ctx.stroke();
  }
  ctx.restore();
}

// ─── Main draw (pure — no React state side-effects) ───────────────────────────
function drawFrame(ctx: CanvasRenderingContext2D, elapsed: number): number {
  const t = Math.min(elapsed / DURATION, 1);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = COL_BG;
  ctx.fillRect(0, 0, W, H);

  // ── Phase fractions ──────────────────────────────────────────────────────────
  const pTri  = easeOut3(ph(t, 0.00, 0.12));  // triangle
  const pSqA  = easeOut3(ph(t, 0.12, 0.28));  // a² grows
  const pSqB  = easeOut3(ph(t, 0.22, 0.40));  // b² grows
  const pSqC  = easeOut3(ph(t, 0.36, 0.56));  // c² grows
  // a² flies toward its strip in c²
  const pMvA  = easeInOut3(ph(t, 0.56, 0.68));
  // a-strip inside c² fills 0 → F_A
  const pFlA  = easeOut5(ph(t, 0.62, 0.72));
  // b² flies toward its strip in c²
  const pMvB  = easeInOut3(ph(t, 0.68, 0.80));
  // b-strip inside c² fills F_A → 1.0
  const pFlB  = easeOut5(ph(t, 0.74, 0.85));
  // divider line between a and b strips
  const pDiv  = easeOut3(ph(t, 0.75, 0.82));
  // final formula
  const pFrm  = easeOut3(ph(t, 0.87, 0.97));

  // Current fill extents
  const flA   = pFlA * F_A;             // 0 → 0.36
  const flB   = F_A + pFlB * (1 - F_A); // 0.36 → 1.0

  // ── 1. Draw c² fill zones (BELOW outline so outline stays on top) ────────────
  if (pSqC > 0) {
    // a-strip (blue)
    if (flA > 0.002) {
      poly(ctx, cStrip(0, flA));
      ctx.fillStyle = COL_A + "cc";
      ctx.fill();
      drawGrid(ctx, 0, flA, COL_A, 1);
    }
    // b-strip (green)
    if (flB > F_A + 0.002) {
      poly(ctx, cStrip(F_A, flB));
      ctx.fillStyle = COL_B + "cc";
      ctx.fill();
      drawGrid(ctx, F_A, flB, COL_B, 1);
    }
  }

  // ── 2. Draw c² outline ───────────────────────────────────────────────────────
  if (pSqC > 0) {
    const glowing = pFlA > 0 || pFlB > F_A;
    ctx.save();
    ctx.globalAlpha = pSqC;
    ctx.translate(CTR_C.x, CTR_C.y);
    ctx.scale(pSqC, pSqC);
    ctx.translate(-CTR_C.x, -CTR_C.y);
    if (glowing) {
      ctx.shadowColor = COL_C;
      ctx.shadowBlur  = 16;
    }
    poly(ctx, SQ_C);
    ctx.strokeStyle = COL_C;
    ctx.lineWidth   = 3 / pSqC;
    ctx.stroke();
    ctx.restore();

    // c² label (before merge, show "c² = 25")
    if (pMvA < 0.1) {
      lbl(ctx, "c²",   CTR_C.x, CTR_C.y - 9,  COL_C, 22, pSqC);
      lbl(ctx, "= 25", CTR_C.x, CTR_C.y + 14, COL_C, 13, pSqC * 0.85);
    }
  }

  // ── 3. Divider line between a-zone and b-zone ─────────────────────────────
  if (pDiv > 0.02) {
    const dp1 = { x: 260 + PERP.x * F_A, y: 190 + PERP.y * F_A }; // B + F_A*PERP
    const dp2 = { x: 420 + PERP.x * F_A, y: 310 + PERP.y * F_A }; // A + F_A*PERP
    ctx.save();
    ctx.globalAlpha = pDiv * 0.9;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth   = 1.8;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(dp1.x, dp1.y);
    ctx.lineTo(dp2.x, dp2.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ── 4. Flying square a² ──────────────────────────────────────────────────────
  if (pSqA > 0 && pMvA < 0.999) {
    const alpha = Math.min(pSqA * 2, 1) * (1 - pMvA);
    const sc    = pSqA * (1 - pMvA);
    const tx    = (DST_A.x - CTR_A.x) * pMvA;
    const ty    = (DST_A.y - CTR_A.y) * pMvA;
    drawSquare(ctx, SQ_A, CTR_A, sc, alpha, COL_A + "55", COL_A, tx, ty);
    if (pSqA > 0.5 && pMvA < 0.3) {
      lbl(ctx, "a²",  CTR_A.x + tx, CTR_A.y + ty - 9,  COL_A, 22, alpha);
      lbl(ctx, "= 9", CTR_A.x + tx, CTR_A.y + ty + 14, COL_A, 13, alpha * 0.85);
    }
  }

  // ── 5. Flying square b² ──────────────────────────────────────────────────────
  if (pSqB > 0 && pMvB < 0.999) {
    const alpha = Math.min(pSqB * 2, 1) * (1 - pMvB);
    const sc    = pSqB * (1 - pMvB);
    const tx    = (DST_B.x - CTR_B.x) * pMvB;
    const ty    = (DST_B.y - CTR_B.y) * pMvB;
    drawSquare(ctx, SQ_B, CTR_B, sc, alpha, COL_B + "55", COL_B, tx, ty);
    if (pSqB > 0.5 && pMvB < 0.3) {
      lbl(ctx, "b²",   CTR_B.x + tx, CTR_B.y + ty - 9,  COL_B, 22, alpha);
      lbl(ctx, "= 16", CTR_B.x + tx, CTR_B.y + ty + 14, COL_B, 13, alpha * 0.85);
    }
  }

  // ── 6. Labels inside the filled c² zones ────────────────────────────────────
  // a-zone label: show when strip is at least 60% filled
  if (pFlA > 0.6) {
    const ctr = stripCtr(0, F_A);
    const fa  = Math.min((pFlA - 0.6) / 0.4, 1);
    lbl(ctx, "a²",    ctr.x, ctr.y - 9,  "#e0f7ff", 17, fa);
    lbl(ctx, "= 9",   ctr.x, ctr.y + 10, "#e0f7ff", 11, fa * 0.85);
  }
  // b-zone label: show when strip is at least 60% filled
  if (pFlB > F_A + 0.05) {
    const bFrac = (pFlB - F_A) / (1 - F_A);
    if (bFrac > 0.6) {
      const ctr = stripCtr(F_A, 1.0);
      const fb  = Math.min((bFrac - 0.6) / 0.4, 1);
      lbl(ctx, "b²",   ctr.x, ctr.y - 9,  "#e0ffe0", 17, fb);
      lbl(ctx, "= 16", ctr.x, ctr.y + 10, "#e0ffe0", 11, fb * 0.85);
    }
  }

  // ── 7. Area counter inside c² ────────────────────────────────────────────────
  if (pFlA > 0.05) {
    const areaA = Math.round(pFlA / F_A * 9);          // 0 → 9
    const areaB = Math.round(Math.max(0, pFlB - F_A) / (1 - F_A) * 16); // 0 → 16
    const total = areaA + areaB;
    const alpha = Math.min(pFlA * 4, 1);

    // Counter pill at top-right of canvas
    const px = W - 16, py = 20;
    const pw = 148, ph2 = 60;
    ctx.save();
    ctx.globalAlpha = alpha * 0.92;
    ctx.fillStyle   = "rgba(10,15,40,0.82)";
    ctx.strokeStyle = "#334155";
    ctx.lineWidth   = 1;
    roundRect(ctx, px - pw, py, pw, ph2, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    lbl(ctx, `a²: ${areaA}`,               px - pw / 2, py + 14, COL_A, 12, alpha);
    lbl(ctx, `b²: ${areaB}`,               px - pw / 2, py + 30, COL_B, 12, alpha);
    lbl(ctx, `Terisi: ${total}/25`,         px - pw / 2, py + 48,
      total === 25 ? "#fde047" : "rgba(255,255,255,0.65)", 11, alpha);
  }

  // ── 8. Triangle (always on top) ──────────────────────────────────────────────
  if (pTri > 0) {
    ctx.save();
    ctx.globalAlpha = pTri;
    poly(ctx, [C_PT, B_PT, A_PT]);
    ctx.fillStyle   = "rgba(255,255,255,0.10)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth   = 2.5;
    ctx.stroke();
    // right-angle mark
    ctx.beginPath();
    ctx.moveTo(C_PT.x,      C_PT.y - 15);
    ctx.lineTo(C_PT.x + 15, C_PT.y - 15);
    ctx.lineTo(C_PT.x + 15, C_PT.y);
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.restore();

    if (pTri > 0.4) {
      const la = Math.min((pTri - 0.4) / 0.6, 1);
      lbl(ctx, "a=3", C_PT.x - 30, (C_PT.y + B_PT.y) / 2,           "#93c5fd", 13, la);
      lbl(ctx, "b=4", (C_PT.x + A_PT.x) / 2, C_PT.y + 22,           "#86efac", 13, la);
      lbl(ctx, "c=5", (B_PT.x + A_PT.x) / 2 + 24, (B_PT.y + A_PT.y) / 2 - 12, "#fdba74", 13, la);
    }
  }

  // ── 9. "Fully filled!" flash ─────────────────────────────────────────────────
  if (pFlB > 0.97 && pFrm < 0.5) {
    const pulse = Math.sin((pFlB - 0.97) / 0.03 * Math.PI) * 0.6;
    ctx.save();
    ctx.globalAlpha = pulse;
    poly(ctx, SQ_C);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth   = 5;
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur  = 30;
    ctx.stroke();
    ctx.restore();
  }

  // ── 10. Final formula banner ─────────────────────────────────────────────────
  if (pFrm > 0) {
    const fx = W / 2;
    const fy = H - 40;
    ctx.save();
    ctx.globalAlpha = pFrm;
    ctx.shadowColor = "#fde047";
    ctx.shadowBlur  = 20;
    ctx.fillStyle   = "rgba(234,179,8,0.20)";
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth   = 1.5;
    roundRect(ctx, fx - 148, fy - 20, 296, 40, 10);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur  = 12;
    ctx.fillStyle   = "#fde047";
    ctx.font        = "bold 22px Arial, sans-serif";
    ctx.textAlign   = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("9 + 16 = 25  →  a² + b² = c²  ✓", fx, fy);
    ctx.restore();
  }

  return t;
}

// ─── React component ──────────────────────────────────────────────────────────
type UIState = "idle" | "playing" | "paused" | "done";

const PythagorasSquaresAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const anim      = useRef({ running: false, raf: 0, startTs: 0, elapsed: 0, speed: 1 });
  const stepRef   = useRef<(ts: number) => void>(() => {});

  const [uiState,   setUiState]   = useState<UIState>("idle");
  const [speed,     setSpeed]     = useState(1);
  const [narration, setNarration] = useState(NARRATION[0].text);
  const [prog,      setProg]      = useState(0);

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

  useEffect(() => {
    stepRef.current = (ts: number) => {
      const a = anim.current;
      if (!a.running) return;
      const elapsed = (ts - a.startTs) * a.speed;
      if (elapsed >= DURATION) {
        a.running = false; a.elapsed = DURATION;
        draw(DURATION); setUiState("done"); return;
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
    anim.current.running = false;
    cancelAnimationFrame(anim.current.raf);
    setUiState("paused");
  }, []);

  const reset = useCallback(() => {
    const a = anim.current;
    a.running = false; cancelAnimationFrame(a.raf);
    a.elapsed = 0; a.startTs = 0;
    setUiState("idle"); setProg(0);
    setNarration(NARRATION[0].text);
    draw(0);
  }, [draw]);

  const handleSpeed = useCallback((v: number) => {
    const a = anim.current;
    if (a.running) a.startTs = performance.now() - a.elapsed / v;
    a.speed = v; setSpeed(v);
  }, []);

  useEffect(() => { draw(0); }, [draw]);
  useEffect(() => () => cancelAnimationFrame(anim.current.raf), []);

  return (
    <div className="flex flex-col items-center gap-4 select-none">

      {/* Title */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-2 w-full text-center">
        <p className="font-display text-xs font-bold text-blue-300 uppercase tracking-widest">
          🟦 Animasi Persegi Bergerak — Pembuktian a² + b² = c²
        </p>
        <p className="font-body text-xs text-white/50 mt-0.5">
          Persegi a² (biru) dan b² (hijau) mengisi tepat seluruh persegi c² (oranye)
        </p>
      </div>

      {/* Canvas */}
      <div
        className="w-full max-w-lg mx-auto rounded-xl overflow-hidden border border-slate-700/50"
        style={{ background: COL_BG }}
      >
        <canvas ref={canvasRef} width={W} height={H} className="w-full h-auto block" />
      </div>

      {/* Progress bar */}
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

      {/* Controls */}
      <div className="flex gap-3 items-center flex-wrap justify-center">
        {uiState === "idle" && (
          <button onClick={play}
            className="px-6 py-2.5 rounded-xl font-body font-bold text-sm
              bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500
              text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95">
            ▶ Play
          </button>
        )}
        {uiState === "playing" && (
          <button onClick={pause}
            className="px-6 py-2.5 rounded-xl font-body font-bold text-sm
              bg-slate-700 hover:bg-slate-600 border border-slate-500
              text-white transition-all active:scale-95">
            ⏸ Pause
          </button>
        )}
        {uiState === "paused" && (
          <>
            <button onClick={play}
              className="px-6 py-2.5 rounded-xl font-body font-bold text-sm
                bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500
                text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95">
              ▶ Lanjut
            </button>
            <button onClick={reset}
              className="px-5 py-2.5 rounded-xl font-body font-bold text-sm
                bg-slate-700 hover:bg-slate-600 border border-slate-500
                text-white transition-all active:scale-95">
              🔄 Reset
            </button>
          </>
        )}
        {uiState === "done" && (
          <button onClick={reset}
            className="px-6 py-2.5 rounded-xl font-body font-bold text-sm
              bg-slate-700 hover:bg-slate-600 border border-slate-500
              text-white transition-all active:scale-95">
            🔄 Ulangi Animasi
          </button>
        )}

        {/* Speed */}
        <div className="flex items-center gap-2 font-body text-xs text-white/60">
          <span title="Lambat">🐢</span>
          <input type="range" min={0.5} max={2} step={0.25} value={speed}
            onChange={e => handleSpeed(Number(e.target.value))}
            className="w-24 accent-cyan-400" aria-label="Kecepatan animasi" />
          <span title="Cepat">🚀</span>
          <span className="text-cyan-300 font-bold w-8">{speed}×</span>
        </div>
      </div>

      {/* Value chips */}
      <div className="flex gap-3 justify-center flex-wrap font-body text-xs">
        <span className="bg-blue-900/40  border border-blue-500/30  rounded-lg px-3 py-1 text-blue-300  font-bold">a = 3 → a² = 9</span>
        <span className="bg-green-900/40 border border-green-500/30 rounded-lg px-3 py-1 text-green-300 font-bold">b = 4 → b² = 16</span>
        <span className="bg-orange-900/40 border border-orange-500/30 rounded-lg px-3 py-1 text-orange-300 font-bold">c = 5 → c² = 25</span>
      </div>

      {/* Narration */}
      <div className="w-full max-w-lg mx-auto bg-slate-800/60 border border-slate-600/40 rounded-xl px-4 py-3 min-h-[52px] flex items-center">
        <p className="font-body text-sm text-white/85 leading-relaxed">{narration}</p>
      </div>

      {/* Hint */}
      <p className={`text-center font-body text-xs max-w-xs leading-relaxed transition-colors duration-300 ${
        uiState === "done"    ? "text-yellow-300 font-semibold" :
        uiState === "playing" ? "text-cyan-300" : "text-white/45"
      }`}>
        {uiState === "idle"    && "Tekan ▶ Play — perhatikan bagaimana a² dan b² mengisi tepat seluruh area c²!"}
        {uiState === "playing" && "Perhatikan penghitung area di kanan atas canvas…"}
        {uiState === "paused"  && "Animasi dijeda. Tekan Lanjut untuk melanjutkan."}
        {uiState === "done"    && "Terbukti! a² (9) + b² (16) = 25 = c².  Tidak lebih, tidak kurang. ✓"}
      </p>
    </div>
  );
};

export default PythagorasSquaresAnimation;
