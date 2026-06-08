import React, { useCallback, useEffect, useRef, useState } from "react";

// ─── Geometry: 3-4-5 triangle, scale 28 px/unit ──────────────────────────────
// a = 84 px, b = 112 px, c = 140 px
const A_ = { x: 200, y: 216 };   // top vertex (right angle on C side)
const B_ = { x: 312, y: 300 };   // right vertex
const C_ = { x: 200, y: 300 };   // right-angle vertex

// Outward perpendicular to hypotenuse AB (CW rotation, magnitude = c = 140)
// AB = (112,84) → CW = (84,-112)  ‖(84,-112)‖ = 140 ✓
const PERPC = { x: 84, y: -112 };

// Squares
const SQA = { x: 116, y: 216, w: 84, h: 84 };   // a² left of AC
const SQB = { x: 200, y: 300, w: 112, h: 112 }; // b² below CB

// c² full polygon (static)
const SQC_PTS = [
  A_,
  B_,
  { x: B_.x + PERPC.x, y: B_.y + PERPC.y }, // 396, 188
  { x: A_.x + PERPC.x, y: A_.y + PERPC.y }, // 284, 104
];
const SQC_STR = SQC_PTS.map(v => `${v.x},${v.y}`).join(" ");

// Centre of c² parallelogram
const CC = {
  x: (A_.x + B_.x + B_.x + PERPC.x + A_.x + PERPC.x) / 4, // 298
  y: (A_.y + B_.y + B_.y + PERPC.y + A_.y + PERPC.y) / 4, // 202
};

const DURATION_MS = 4200;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function hWavePath(x1: number, x2: number, y: number, amp: number, phase: number, n = 60) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x1 + (x2 - x1) * t;
    const wy = y + Math.sin(t * Math.PI * 4.5 + phase) * amp;
    d += i === 0 ? `M${x.toFixed(1)},${wy.toFixed(1)}` : `L${x.toFixed(1)},${wy.toFixed(1)}`;
  }
  return d;
}

function tWavePath(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  amp: number,
  phase: number,
  n = 50
) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return "";
  const nx = -dy / len;
  const ny = dx / len;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const off = Math.sin(t * Math.PI * 3.5 + phase) * amp;
    const x = p1.x + dx * t + nx * off;
    const y = p1.y + dy * t + ny * off;
    d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

// Animated stream path: lerps from start toward end using progress
function streamPath(
  sx: number, sy: number,
  cx: number, cy: number,
  ex: number, ey: number,
  t: number
) {
  // Interpolated end point along a quadratic bezier
  const qx = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * ex;
  const qy = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ey;
  return `M${sx},${sy} Q${cx},${cy} ${qx.toFixed(1)},${qy.toFixed(1)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
type Phase = "idle" | "animating" | "done";

const PythagorasWaterProof: React.FC = () => {
  const [phase, setPhase]     = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [tick, setTick]       = useState(0); // continuous wave clock

  const startRef  = useRef<number | null>(null);
  const rafRef    = useRef<number>(0);
  const waveRef   = useRef<number>(0);

  // Perpetual wave clock
  useEffect(() => {
    let alive = true;
    const loop = (ts: number) => {
      if (!alive) return;
      setTick(ts * 0.002);
      waveRef.current = requestAnimationFrame(loop);
    };
    waveRef.current = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(waveRef.current); };
  }, []);

  const startAnim = useCallback(() => {
    if (phase === "animating") return;
    setPhase("animating");
    setProgress(0);
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / DURATION_MS, 1);
      const p   = easeInOut(raw);
      setProgress(p);
      if (raw < 1) rafRef.current = requestAnimationFrame(step);
      else { setPhase("done"); setProgress(1); }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [phase]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    setProgress(0);
    startRef.current = null;
  }, []);

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    cancelAnimationFrame(waveRef.current);
  }, []);

  // ─── Derived water levels ───────────────────────────────────────────────────
  const lA = phase === "idle" ? 1 : 1 - progress;  // a² fill fraction
  const lB = phase === "idle" ? 1 : 1 - progress;  // b² fill fraction
  const lC = phase === "idle" ? 0 : progress;        // c² fill fraction

  // Pixel tops of water surfaces
  const aWaterTop = SQA.y + SQA.h * (1 - lA);
  const bWaterTop = SQB.y + SQB.h * (1 - lB);

  // c² fill clip: grows from AB outward in PERPC direction
  const cClipPts = [
    `${A_.x},${A_.y}`,
    `${B_.x},${B_.y}`,
    `${(B_.x + PERPC.x * lC).toFixed(1)},${(B_.y + PERPC.y * lC).toFixed(1)}`,
    `${(A_.x + PERPC.x * lC).toFixed(1)},${(A_.y + PERPC.y * lC).toFixed(1)}`,
  ].join(" ");

  // ─── Wave paths ─────────────────────────────────────────────────────────────
  const waveA = lA > 0.02
    ? hWavePath(SQA.x, SQA.x + SQA.w, aWaterTop, 2.2, tick)
    : "";
  const waveB = lB > 0.02
    ? hWavePath(SQB.x, SQB.x + SQB.w, bWaterTop, 2.2, tick * 1.3 + 1.1)
    : "";
  const cSurf1 = { x: A_.x + PERPC.x * lC, y: A_.y + PERPC.y * lC };
  const cSurf2 = { x: B_.x + PERPC.x * lC, y: B_.y + PERPC.y * lC };
  const waveC = lC > 0.03 && lC < 0.98
    ? tWavePath(cSurf1, cSurf2, 2.2, -tick * 1.7)
    : "";

  // ─── Flow streams ───────────────────────────────────────────────────────────
  // Progress envelope: ramps up fast, holds, fades near end
  const sOp = phase === "animating"
    ? Math.min(progress * 7, 1) * Math.min((1 - progress) * 7, 1)
    : 0;

  // Stream A: from A_ vertex, curves inward toward c² fill direction
  // Stream B: from B_ vertex, curves upward into c²
  const spA = streamPath(A_.x, A_.y, A_.x + 30, A_.y - 50, A_.x + 70, A_.y - 90, Math.min(progress * 1.4, 1));
  const spB = streamPath(B_.x, B_.y, B_.x + 30, B_.y - 55, B_.x + 65, B_.y - 100, Math.min(progress * 1.4, 1));

  // ─── Bubbles ────────────────────────────────────────────────────────────────
  type Bubble = { bx: number; by: number };
  const makeBubbles = (
    sx: number, sy: number, sw: number, sh: number,
    waterTop: number, lv: number,
    offsets: number[]
  ): Bubble[] => {
    if (lv < 0.07) return [];
    const filled = sy + sh - waterTop;
    return offsets.flatMap((off, i) => {
      const bx = sx + sw * [0.2, 0.5, 0.78][i % 3];
      const by = waterTop + filled * ((0.25 + (tick * (0.4 + off * 0.2) + off) % 0.7));
      return by > waterTop && by < sy + sh ? [{ bx, by }] : [];
    });
  };
  const bubblesA = makeBubbles(SQA.x, SQA.y, SQA.w, SQA.h, aWaterTop, lA, [0, 0.35, 0.65]);
  const bubblesB = makeBubbles(SQB.x, SQB.y, SQB.w, SQB.h, bWaterTop, lB, [0, 0.3, 0.6]);

  // ─── Progress % display during animation ────────────────────────────────────
  const pctC = Math.round(lC * 100);

  return (
    <div className="flex flex-col items-center gap-4 select-none">

      {/* ── Title ── */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-4 py-2 w-full text-center">
        <p className="font-display text-xs font-bold text-cyan-300 uppercase tracking-widest">
          💧 Pembuktian Air — a² + b² = c²
        </p>
        <p className="font-body text-xs text-white/50 mt-0.5">
          Jika luas a² dan b² disatukan → tepat memenuhi luas c²
        </p>
      </div>

      {/* ── SVG ── */}
      <div className="w-full max-w-sm mx-auto">
        <svg
          viewBox="85 78 345 400"
          className="w-full h-auto"
          style={{ filter: "drop-shadow(0 0 12px rgba(56,189,248,0.18))" }}
        >
          <defs>
            {/* Water gradients */}
            <linearGradient id="pw_wgA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#7dd3fc" stopOpacity="0.90"/>
              <stop offset="65%"  stopColor="#0ea5e9" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#075985" stopOpacity="0.99"/>
            </linearGradient>
            <linearGradient id="pw_wgB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#6ee7b7" stopOpacity="0.88"/>
              <stop offset="65%"  stopColor="#059669" stopOpacity="0.94"/>
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.99"/>
            </linearGradient>
            <linearGradient id="pw_wgC"
              gradientUnits="userSpaceOnUse"
              x1={A_.x} y1={A_.y}
              x2={A_.x + PERPC.x} y2={A_.y + PERPC.y}>
              <stop offset="0%"   stopColor="#e0f2fe" stopOpacity="0.88"/>
              <stop offset="55%"  stopColor="#38bdf8" stopOpacity="0.94"/>
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.99"/>
            </linearGradient>
            {/* Shimmer overlay (horizontal sweep) */}
            <linearGradient id="pw_shimmer" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0"/>
              <stop offset="42%"  stopColor="white" stopOpacity="0.20"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </linearGradient>
            {/* Glow filter for streams */}
            <filter id="pw_glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Static square clip paths */}
            <clipPath id="pw_clipA">
              <rect x={SQA.x} y={SQA.y} width={SQA.w} height={SQA.h}/>
            </clipPath>
            <clipPath id="pw_clipB">
              <rect x={SQB.x} y={SQB.y} width={SQB.w} height={SQB.h}/>
            </clipPath>
            <clipPath id="pw_clipC">
              <polygon points={SQC_STR}/>
            </clipPath>
          </defs>

          {/* ══ SQUARE a² ══ */}
          <rect x={SQA.x} y={SQA.y} width={SQA.w} height={SQA.h}
            fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth="2" rx="2"/>
          {lA > 0.005 && (
            <g clipPath="url(#pw_clipA)">
              {/* Water body */}
              <rect x={SQA.x} y={aWaterTop} width={SQA.w} height={SQA.y + SQA.h - aWaterTop}
                fill="url(#pw_wgA)"/>
              {/* Shimmer */}
              <rect x={SQA.x} y={aWaterTop} width={SQA.w} height={SQA.y + SQA.h - aWaterTop}
                fill="url(#pw_shimmer)" opacity="0.7"/>
              {/* Bubbles */}
              {bubblesA.map((b, i) => (
                <circle key={i} cx={b.bx} cy={b.by} r={1.7}
                  fill="rgba(224,242,254,0.60)" stroke="rgba(186,230,253,0.35)" strokeWidth="0.5"/>
              ))}
            </g>
          )}
          {/* Wave surface a² */}
          {waveA && (
            <path d={waveA} fill="none" stroke="rgba(186,230,253,0.85)" strokeWidth="1.5"
              clipPath="url(#pw_clipA)"/>
          )}

          {/* ══ SQUARE b² ══ */}
          <rect x={SQB.x} y={SQB.y} width={SQB.w} height={SQB.h}
            fill="rgba(34,197,94,0.06)" stroke="#22c55e" strokeWidth="2" rx="2"/>
          {lB > 0.005 && (
            <g clipPath="url(#pw_clipB)">
              <rect x={SQB.x} y={bWaterTop} width={SQB.w} height={SQB.y + SQB.h - bWaterTop}
                fill="url(#pw_wgB)"/>
              <rect x={SQB.x} y={bWaterTop} width={SQB.w} height={SQB.y + SQB.h - bWaterTop}
                fill="url(#pw_shimmer)" opacity="0.65"/>
              {bubblesB.map((b, i) => (
                <circle key={i} cx={b.bx} cy={b.by} r={2}
                  fill="rgba(209,250,229,0.60)" stroke="rgba(167,243,208,0.35)" strokeWidth="0.5"/>
              ))}
            </g>
          )}
          {waveB && (
            <path d={waveB} fill="none" stroke="rgba(167,243,208,0.85)" strokeWidth="1.5"
              clipPath="url(#pw_clipB)"/>
          )}

          {/* ══ SQUARE c² ══ */}
          <polygon points={SQC_STR}
            fill="rgba(249,115,22,0.06)" stroke="#f97316" strokeWidth="2"/>
          {lC > 0.005 && (
            <g clipPath="url(#pw_clipC)">
              {/* Filling parallelogram */}
              <polygon points={cClipPts} fill="url(#pw_wgC)"/>
              {/* Shimmer across full c² (masked by fill) */}
              <polygon points={SQC_STR} fill="url(#pw_shimmer)" opacity="0.55"/>
            </g>
          )}
          {waveC && (
            <path d={waveC} fill="none" stroke="rgba(186,230,253,0.85)" strokeWidth="1.5"
              clipPath="url(#pw_clipC)"/>
          )}

          {/* ══ TRIANGLE ══ */}
          <polygon
            points={`${A_.x},${A_.y} ${B_.x},${B_.y} ${C_.x},${C_.y}`}
            fill="rgba(99,102,241,0.22)" stroke="#818cf8" strokeWidth="2.5"
          />
          {/* Right-angle mark */}
          <polyline
            points={`${C_.x},${C_.y - 12} ${C_.x + 12},${C_.y - 12} ${C_.x + 12},${C_.y}`}
            fill="none" stroke="white" strokeWidth="1.5" opacity="0.65"
          />

          {/* ══ FLOW STREAMS ══ */}
          {sOp > 0.05 && (
            <>
              {/* Stream from A vertex → into c² */}
              <path d={spA} fill="none" stroke="#38bdf8" strokeWidth="6"
                strokeLinecap="round" opacity={sOp * 0.45}
                style={{ filter: "blur(2.5px)" }}/>
              <path d={spA} fill="none" stroke="#e0f2fe" strokeWidth="2.5"
                strokeLinecap="round" opacity={sOp}
                filter="url(#pw_glow)"/>
              {/* Stream from B vertex → into c² */}
              <path d={spB} fill="none" stroke="#38bdf8" strokeWidth="7"
                strokeLinecap="round" opacity={sOp * 0.45}
                style={{ filter: "blur(2.5px)" }}/>
              <path d={spB} fill="none" stroke="#bae6fd" strokeWidth="2.5"
                strokeLinecap="round" opacity={sOp}
                filter="url(#pw_glow)"/>

              {/* Droplets along stream A */}
              {[0.3, 0.6, 0.9].map((frac) => {
                const t = (progress * 2 + frac) % 1;
                const qx = (1 - t) * (1 - t) * A_.x + 2 * (1 - t) * t * (A_.x + 30) + t * t * (A_.x + 70);
                const qy = (1 - t) * (1 - t) * A_.y + 2 * (1 - t) * t * (A_.y - 50) + t * t * (A_.y - 90);
                return (
                  <circle key={frac} cx={qx} cy={qy} r={3}
                    fill="#7dd3fc" opacity={sOp * Math.sin(t * Math.PI) * 0.9}/>
                );
              })}
              {/* Droplets along stream B */}
              {[0.2, 0.55, 0.85].map((frac) => {
                const t = (progress * 2 + frac) % 1;
                const qx = (1 - t) * (1 - t) * B_.x + 2 * (1 - t) * t * (B_.x + 30) + t * t * (B_.x + 65);
                const qy = (1 - t) * (1 - t) * B_.y + 2 * (1 - t) * t * (B_.y - 55) + t * t * (B_.y - 100);
                return (
                  <circle key={frac} cx={qx} cy={qy} r={3.5}
                    fill="#7dd3fc" opacity={sOp * Math.sin(t * Math.PI) * 0.9}/>
                );
              })}
            </>
          )}

          {/* ══ LABELS: sides ══ */}
          <text x={A_.x - 18} y={(A_.y + C_.y) / 2 + 5}
            fill="#93c5fd" fontSize="14" fontWeight="bold" textAnchor="middle">a</text>
          <text x={(C_.x + B_.x) / 2} y={C_.y + 16}
            fill="#86efac" fontSize="14" fontWeight="bold" textAnchor="middle">b</text>
          <text x={(A_.x + B_.x) / 2 + 16} y={(A_.y + B_.y) / 2 - 5}
            fill="#fdba74" fontSize="14" fontWeight="bold">c</text>

          {/* ══ LABELS: square names & areas ══ */}
          {/* a² */}
          <text x={SQA.x + SQA.w / 2} y={SQA.y + SQA.h / 2 - 6}
            textAnchor="middle" fill="white" fontSize="17" fontWeight="bold"
            style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.7)", strokeWidth: 3 }}>
            a²
          </text>
          <text x={SQA.x + SQA.w / 2} y={SQA.y + SQA.h / 2 + 12}
            textAnchor="middle" fill="rgba(186,230,253,0.85)" fontSize="10">
            = 9
          </text>

          {/* b² */}
          <text x={SQB.x + SQB.w / 2} y={SQB.y + SQB.h / 2 - 6}
            textAnchor="middle" fill="white" fontSize="17" fontWeight="bold"
            style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.7)", strokeWidth: 3 }}>
            b²
          </text>
          <text x={SQB.x + SQB.w / 2} y={SQB.y + SQB.h / 2 + 12}
            textAnchor="middle" fill="rgba(167,243,208,0.85)" fontSize="10">
            = 16
          </text>

          {/* c² */}
          <text x={CC.x} y={CC.y - 6}
            textAnchor="middle" fill="white" fontSize="17" fontWeight="bold"
            style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.7)", strokeWidth: 3 }}>
            c²
          </text>
          <text x={CC.x} y={CC.y + 12}
            textAnchor="middle" fill="rgba(253,186,116,0.85)" fontSize="10">
            = 25
          </text>

          {/* ══ FILL % on c² during animation ══ */}
          {phase === "animating" && lC > 0.05 && (
            <text x={CC.x} y={CC.y + 30}
              textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold">
              {pctC}%
            </text>
          )}

          {/* ══ DONE BANNER ══ */}
          {phase === "done" && (
            <g>
              <rect x="110" y="434" width="210" height="30" rx="8"
                fill="rgba(234,179,8,0.18)" stroke="#eab308" strokeWidth="1.5"/>
              <text x="215" y="454" textAnchor="middle"
                fill="#fde047" fontSize="13" fontWeight="bold">
                ✓  9 + 16 = 25  ⟹  a² + b² = c²
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Button ── */}
      <div className="flex gap-3 items-center">
        {phase !== "animating" ? (
          <button
            onClick={phase === "done" ? reset : startAnim}
            className={`px-6 py-2.5 rounded-xl font-body font-bold text-sm transition-all duration-200 active:scale-95 ${
              phase === "done"
                ? "bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/40"
            }`}
          >
            {phase === "done" ? "🔄 Ulangi Animasi" : "💧 Alirkan Air"}
          </button>
        ) : (
          <div className="px-5 py-2.5 rounded-xl text-sm text-cyan-300 border border-cyan-500/30 bg-cyan-900/20 flex items-center gap-2 font-body">
            <span className="inline-block animate-bounce">💧</span>
            Air sedang mengalir ke c²…
          </div>
        )}
      </div>

      {/* ── Hint text ── */}
      <p className={`text-center font-body text-xs max-w-xs leading-relaxed transition-all duration-300 ${
        phase === "done" ? "text-yellow-300 font-semibold" :
        phase === "animating" ? "text-cyan-300" : "text-white/55"
      }`}>
        {phase === "idle" && (
          <>Persegi <span className="text-blue-300 font-bold">a²</span> dan <span className="text-green-300 font-bold">b²</span> penuh
          berisi air — tekan tombol untuk membuktikan Teorema Pythagoras secara visual!</>
        )}
        {phase === "animating" && (
          <>Air dari <span className="text-blue-300 font-bold">a²</span> + <span className="text-green-300 font-bold">b²</span> mengalir
          ke <span className="text-orange-300 font-bold">c²</span> — perhatikan apa yang terjadi!</>
        )}
        {phase === "done" && (
          <>Air mengisi <span className="text-orange-300">c²</span> dengan <strong>tepat</strong> — tidak kurang, tidak lebih.
          Inilah bukti visual bahwa <strong>a² + b² = c²</strong>! ✓</>
        )}
      </p>
    </div>
  );
};

export default PythagorasWaterProof;
