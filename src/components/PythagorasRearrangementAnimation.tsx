import React, { useRef, useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GEOMETRY CONSTANTS  (a=3, b=4, c=5 right triangle, scale=36 px/unit)
// ─────────────────────────────────────────────────────────────────────────────
const A_S = 108;  // a × 36
const B_S = 144;  // b × 36
const S   = 252;  // (a+b) × 36  — side of big outer square
const OX  = 65;   // big-square top-left x
const OY  = 30;   // big-square top-left y

// ─────────────────────────────────────────────────────────────────────────────
// TRIANGLE VERTEX POSITIONS
// ─────────────────────────────────────────────────────────────────────────────

// Position A — 4 triangles pinned to the CORNERS of the big square.
// The region they leave empty in the centre is a tilted square with side c.
const POS_A: [[number,number],[number,number],[number,number]][] = [
  // T1 top-left  → right-angle at (OX, OY); legs: b right, a down
  [[OX,      OY],   [OX+B_S, OY],      [OX,     OY+A_S]],
  // T2 top-right → right-angle at (OX+S, OY); legs: a left, b down
  [[OX+S,    OY],   [OX+S,   OY+B_S],  [OX+B_S, OY]],
  // T3 bot-right → right-angle at (OX+S, OY+S); legs: b left, a up
  [[OX+S,    OY+S], [OX+A_S, OY+S],    [OX+S,   OY+B_S]],
  // T4 bot-left  → right-angle at (OX, OY+S); legs: a right, b up
  [[OX,      OY+S], [OX,     OY+A_S],  [OX+A_S, OY+S]],
];

// Position B — 4 triangles form TWO RECTANGLES (each a×b) at top-right & bot-left.
// Empty spaces left behind: a² square (top-left) and b² square (bottom-right).
const POS_B: [[number,number],[number,number],[number,number]][] = [
  // T1 → top-right rectangle, upper half; right-angle at (OX+A_S, OY)
  [[OX+A_S, OY],      [OX+S,    OY],      [OX+A_S, OY+A_S]],
  // T2 → top-right rectangle, lower half; right-angle at (OX+S, OY+A_S)
  [[OX+S,   OY+A_S],  [OX+A_S,  OY+A_S],  [OX+S,   OY]],
  // T3 → bot-left rectangle, lower half; right-angle at (OX+A_S, OY+S)
  [[OX+A_S, OY+S],    [OX,      OY+S],    [OX+A_S, OY+A_S]],
  // T4 → bot-left rectangle, upper half; right-angle at (OX, OY+A_S)
  [[OX,     OY+A_S],  [OX+A_S,  OY+A_S],  [OX,     OY+S]],
];

// Bright contrasting colours for the 4 triangles
const TRI_FILL   = ["#3b82f6", "#22c55e", "#f97316", "#a855f7"];
const TRI_STROKE = ["#93c5fd", "#86efac", "#fdba74", "#d8b4fe"];

// ─────────────────────────────────────────────────────────────────────────────
// The inner tilted c² square.
// Its 4 vertices sit on the edges of the big square,
// and each of its sides IS the hypotenuse of one of the 4 triangles.
// ─────────────────────────────────────────────────────────────────────────────
const INNER_C2: [number,number][] = [
  [OX+B_S, OY],       // P1 — on top edge,   b from left
  [OX+S,   OY+B_S],  // P2 — on right edge,  b from top
  [OX+A_S, OY+S],    // P3 — on bottom edge, a from left
  [OX,     OY+A_S],  // P4 — on left edge,   a from top
];

// Centroid of the inner c² square (for the "c²" label)
const C2_CX = INNER_C2.reduce((s,p)=>s+p[0],0)/4;  // ≈ 189
const C2_CY = INNER_C2.reduce((s,p)=>s+p[1],0)/4;  // ≈ 156

// Midpoints of the 4 sides of the inner tilted square — for placing "c" labels
const HYPO_MIDS: { mx:number; my:number; ox:number; oy:number }[] = [
  // P4→P1 (hyp of T1): top-left side → label offset toward outer top-left
  { mx:(INNER_C2[3][0]+INNER_C2[0][0])/2, my:(INNER_C2[3][1]+INNER_C2[0][1])/2, ox:-16, oy:-4 },
  // P1→P2 (hyp of T2): top-right side
  { mx:(INNER_C2[0][0]+INNER_C2[1][0])/2, my:(INNER_C2[0][1]+INNER_C2[1][1])/2, ox: 16, oy:-4 },
  // P2→P3 (hyp of T3): bottom-right side
  { mx:(INNER_C2[1][0]+INNER_C2[2][0])/2, my:(INNER_C2[1][1]+INNER_C2[2][1])/2, ox: 16, oy: 8 },
  // P3→P4 (hyp of T4): bottom-left side
  { mx:(INNER_C2[2][0]+INNER_C2[3][0])/2, my:(INNER_C2[2][1]+INNER_C2[3][1])/2, ox:-16, oy: 8 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Side-label positions on T1 (top-left triangle) — shown in steps 0 & 1
// ─────────────────────────────────────────────────────────────────────────────
const T1 = POS_A[0];
// midpoint of each edge of T1
const MID_A: [number,number] = [(T1[0][0]+T1[2][0])/2 - 14, (T1[0][1]+T1[2][1])/2]; // vertical leg a
const MID_B: [number,number] = [(T1[0][0]+T1[1][0])/2,      (T1[0][1]+T1[1][1])/2 - 10]; // horizontal leg b
const MID_C: [number,number] = [(T1[1][0]+T1[2][0])/2 - 10, (T1[1][1]+T1[2][1])/2 - 2];  // hypotenuse c

// ─────────────────────────────────────────────────────────────────────────────
// LERP / EASING HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Linear interpolation */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/** Smooth cubic ease-in-out */
function ease(t: number) {
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
}

/** Lerp a full triangle between two positions */
function lerpTri(
  from: [[number,number],[number,number],[number,number]],
  to:   [[number,number],[number,number],[number,number]],
  t: number
): [number,number][] {
  return from.map((v,i) => [lerp(v[0],to[i][0],t), lerp(v[1],to[i][1],t)]);
}

/** SVG points string */
function pts(v: [number,number][]) {
  return v.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

/** Centroid */
function cen(v: [number,number][]): [number,number] {
  return [v.reduce((s,p)=>s+p[0],0)/v.length, v.reduce((s,p)=>s+p[1],0)/v.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP METADATA — each step has a title, description, and button label
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    title: "Langkah 1 — Susun 4 segitiga di sudut persegi",
    desc: "Empat segitiga siku-siku identik (sisi a, b, dan hipotenusa c) ditempatkan di sudut-sudut persegi besar bersisi (a+b). Perhatikan ruang kosong yang terbentuk di tengah.",
    btn: "Langkah 2: Lihat hipotenusa →",
    btnColor: "rgba(168,85,247,",
  },
  {
    title: "Langkah 2 — Hipotenusa setiap segitiga panjangnya c",
    desc: "Perhatikan! Setiap sisi ruang kosong di tengah adalah HIPOTENUSA dari salah satu segitiga. Karena semua hipotenusa panjangnya c, maka sisi ruang kosong = c.",
    btn: "Langkah 3: Ini adalah c² →",
    btnColor: "rgba(251,191,36,",
  },
  {
    title: "Langkah 3 — Ruang kosong di tengah = c²",
    desc: "Ruang kosong berbentuk persegi dengan sisi c, sehingga luasnya = c × c = c². Sekarang kita akan menggeser keempat segitiga untuk melihat apa yang terjadi!",
    btn: "▶ Geser Segitiga ke Posisi B",
    btnColor: "rgba(234,179,8,",
  },
  {
    title: "Langkah 4 — Luas kosong = a² + b² = c²  ✓",
    desc: "Dengan menggeser segitiga, ruang kosong berubah menjadi DUA persegi: a² (= 9) dan b² (= 16). Totalnya 25 = c²! Karena luas persegi besar tidak berubah, a² + b² = c².",
    btn: "🔄 Ulangi dari Awal",
    btnColor: "rgba(34,197,94,",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const PythagorasRearrangementAnimation: React.FC = () => {

  // Discrete step (0–3) controls what's shown
  const [step, setStep]         = useState(0);
  // Continuous lerp value for the sliding animation (only used in step 3)
  const [t, setT]               = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDone, setAnimDone] = useState(false);

  // refs for rAF loop (avoid stale closures)
  const tRef        = useRef(0);
  const rafRef      = useRef<number|null>(null);
  const isAnimRef   = useRef(false);
  const startTsRef  = useRef<number|null>(null);  // rAF timestamp at animation start

  const DURATION_MS = 1400;

  // ── rAF animation loop (only runs during step 3) ─────────────────────────
  const animLoop = useCallback((ts: number) => {
    if (!isAnimRef.current) return;

    // Capture start time on first frame
    if (startTsRef.current === null) startTsRef.current = ts;

    const elapsed  = ts - startTsRef.current;
    const progress = Math.min(elapsed / DURATION_MS, 1);
    const newT     = ease(progress); // lerp from 0 → 1

    tRef.current = newT;
    setT(newT);

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animLoop);
    } else {
      // Animation complete
      tRef.current = 1;
      setT(1);
      isAnimRef.current = false;
      setIsAnimating(false);
      setAnimDone(true);
    }
  }, []);

  // ── Cleanup rAF on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // ── Back button handler ───────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (isAnimating) return;
    // Cancel any running animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    isAnimRef.current = false;
    setIsAnimating(false);
    setAnimDone(false);
    setT(0);
    tRef.current = 0;
    startTsRef.current = null;
    setStep(s => Math.max(0, s - 1));
  }, [isAnimating]);

  // ── Forward button handler ────────────────────────────────────────────────
  const handleBtn = useCallback(() => {
    if (step < 2) {
      // Steps 0→1→2: just advance
      setStep(s => s + 1);
    } else if (step === 2) {
      // Step 2→3: advance step AND kick off the lerp animation
      setStep(3);
      setT(0);
      tRef.current = 0;
      startTsRef.current = null;
      isAnimRef.current = true;
      setIsAnimating(true);
      setAnimDone(false);
      rafRef.current = requestAnimationFrame(animLoop);
    } else {
      // Step 3 done → reset everything
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      isAnimRef.current = false;
      setIsAnimating(false);
      setAnimDone(false);
      setStep(0);
      setT(0);
      tRef.current = 0;
      startTsRef.current = null;
    }
  }, [step, animLoop]);

  // ── Compute triangle vertices (lerp between A and B) ─────────────────────
  // In steps 0–2, triangles are fixed at POS_A (t=0).
  // In step 3, they slide from POS_A → POS_B.
  const currentTris = POS_A.map((posA, i) =>
    lerpTri(posA, POS_B[i], t) as [number,number][]
  );

  // ── Derived opacity values based on step + t ──────────────────────────────
  // Show side labels (a,b,c) on T1 only in steps 0–1
  const showSideLabels = step <= 1;
  // Step 1: glow hypotenuses + show "c" on each inner side
  const showHypoGlow   = step >= 1;
  // Step 2+: show filled c² square
  const showC2Fill     = step >= 2;
  // c² square fades out during step 3 animation (as t increases)
  const c2Opacity      = step < 3 ? 1 : (1 - t);
  // a² and b² fade in during step 3 animation
  const abOpacity      = step < 3 ? 0 : t;

  // ── Step info ─────────────────────────────────────────────────────────────
  const info = STEPS[step];
  const isLastDone = step === 3 && animDone;

  return (
    <div className="w-full flex flex-col items-center gap-3">

      {/* ── Step indicator dots ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? 28 : 10,
              height: 10,
              background: i < step
                ? "rgba(168,85,247,0.6)"
                : i === step
                ? (step === 3 && animDone ? "#22c55e" : "#a855f7")
                : "rgba(100,116,139,0.35)",
            }}
          />
        ))}
      </div>

      {/* ── SVG Canvas ──────────────────────────────────────────────────── */}
      <div
        className="w-full overflow-hidden rounded-xl border bg-slate-900/70"
        style={{ maxWidth: 420, borderColor: "rgba(168,85,247,0.35)" }}
      >
        <svg viewBox="0 0 380 340" className="w-full" aria-label="Animasi Rearrangement Pythagoras">
          <defs>
            <filter id="ra-glow-hy">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="ra-glow-sq">
              <feGaussianBlur stdDeviation="6" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── 1. Big outer square (always) ── */}
          <rect x={OX} y={OY} width={S} height={S}
            fill="none" stroke="rgba(148,163,184,0.55)" strokeWidth="2" strokeDasharray="8 4"/>
          <text x={OX+S/2} y={OY-9} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">(a+b)</text>
          <text x={OX-24}  y={OY+S/2+4} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">(a+b)</text>

          {/* ── 2. Step 1+: glow HYPOTENUSES of all 4 triangles ──
                  These are the 4 edges of the inner tilted square.
                  Showing them glowing makes it clear they form a square. ── */}
          {showHypoGlow && INNER_C2.map((p, i) => {
            const next = INNER_C2[(i+1) % 4];
            return (
              <line key={i}
                x1={p[0]} y1={p[1]} x2={next[0]} y2={next[1]}
                stroke="#fbbf24" strokeWidth={step >= 2 ? 2.5 : 3.5}
                strokeOpacity={step >= 2 ? 0.7 : 1}
                filter="url(#ra-glow-hy)"
              />
            );
          })}

          {/* Step 1: "c" label on each hypotenuse (each side of inner square) */}
          {step === 1 && HYPO_MIDS.map((m, i) => (
            <text key={i}
              x={m.mx + m.ox} y={m.my + m.oy}
              textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold"
              fontFamily="monospace" filter="url(#ra-glow-hy)"
            >c</text>
          ))}

          {/* ── 3. Step 2+: filled c² tilted square ── */}
          {showC2Fill && (
            <>
              <polygon points={pts(INNER_C2)}
                fill={`rgba(239,68,68,${0.35 * c2Opacity})`}
                stroke={`rgba(239,68,68,${c2Opacity})`}
                strokeWidth="2"
                filter={c2Opacity > 0.3 ? "url(#ra-glow-sq)" : undefined}
              />
              {c2Opacity > 0.05 && (
                <>
                  <text x={C2_CX} y={C2_CY+2} textAnchor="middle"
                    fill={`rgba(252,165,165,${c2Opacity})`}
                    fontSize="20" fontWeight="bold" fontFamily="monospace"
                    filter="url(#ra-glow-sq)"
                  >c²</text>
                  {/* "c" labels on each side (step 2 only, fade when animating) */}
                  {step === 2 && HYPO_MIDS.map((m,i) => (
                    <text key={i}
                      x={m.mx+m.ox} y={m.my+m.oy}
                      textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="bold"
                      fontFamily="monospace"
                    >c</text>
                  ))}
                </>
              )}
            </>
          )}

          {/* ── 4. a² empty square (fades in during step 3) ── */}
          <rect x={OX} y={OY} width={A_S} height={A_S}
            fill={`rgba(59,130,246,${0.2*abOpacity})`}
            stroke={`rgba(59,130,246,${abOpacity*0.95})`}
            strokeWidth="2.5"
          />
          {abOpacity > 0.08 && (
            <>
              <text x={OX+A_S/2} y={OY+A_S/2+4} textAnchor="middle"
                fill={`rgba(147,197,253,${abOpacity})`}
                fontSize="20" fontWeight="bold" fontFamily="monospace"
                filter="url(#ra-glow-sq)"
              >a²</text>
              <text x={OX+A_S/2} y={OY+A_S/2+20} textAnchor="middle"
                fill={`rgba(147,197,253,${abOpacity*0.8})`}
                fontSize="11" fontFamily="monospace"
              >= 9</text>
            </>
          )}

          {/* ── 5. b² empty square (fades in during step 3) ── */}
          <rect x={OX+A_S} y={OY+A_S} width={B_S} height={B_S}
            fill={`rgba(34,197,94,${0.2*abOpacity})`}
            stroke={`rgba(34,197,94,${abOpacity*0.95})`}
            strokeWidth="2.5"
          />
          {abOpacity > 0.08 && (
            <>
              <text x={OX+A_S+B_S/2} y={OY+A_S+B_S/2+4} textAnchor="middle"
                fill={`rgba(134,239,172,${abOpacity})`}
                fontSize="20" fontWeight="bold" fontFamily="monospace"
                filter="url(#ra-glow-sq)"
              >b²</text>
              <text x={OX+A_S+B_S/2} y={OY+A_S+B_S/2+20} textAnchor="middle"
                fill={`rgba(134,239,172,${abOpacity*0.8})`}
                fontSize="11" fontFamily="monospace"
              >= 16</text>
            </>
          )}

          {/* ── 6. The 4 triangles — rendered last so they're on top ── */}
          {currentTris.map((verts, i) => {
            const [cx, cy] = cen(verts as [number,number][]);
            return (
              <g key={i}>
                <polygon
                  points={pts(verts as [number,number][])}
                  fill={TRI_FILL[i]} fillOpacity="0.78"
                  stroke={TRI_STROKE[i]} strokeWidth="1.8" strokeLinejoin="round"
                />
                {/* T₁ label at centroid */}
                <text x={cx} y={cy+4} textAnchor="middle"
                  fill="var(--icon-color)" fontSize="10" fontWeight="bold"
                  fontFamily="monospace" opacity="0.9"
                >{["T₁","T₂","T₃","T₄"][i]}</text>
              </g>
            );
          })}

          {/* ── 7. Side labels a, b, c on T1 (steps 0 and 1) ── */}
          {showSideLabels && (
            <g>
              <text x={MID_A[0]} y={MID_A[1]+4} textAnchor="middle"
                fill="#93c5fd" fontSize="13" fontWeight="bold" fontFamily="monospace">a</text>
              <text x={MID_B[0]} y={MID_B[1]} textAnchor="middle"
                fill="#86efac" fontSize="13" fontWeight="bold" fontFamily="monospace">b</text>
              {/* 'c' on hypotenuse: highlighted yellow in step 1 */}
              <text x={MID_C[0]} y={MID_C[1]} textAnchor="middle"
                fill={step >= 1 ? "#fbbf24" : "#fdba74"}
                fontSize={step >= 1 ? "15" : "13"}
                fontWeight="bold" fontFamily="monospace"
                filter={step >= 1 ? "url(#ra-glow-hy)" : undefined}
              >c</text>
            </g>
          )}

          {/* ── 8. Final equation banner (step 3, animation done) ── */}
          {isLastDone && (
            <g>
              <rect x={58} y={295} width={262} height={36} rx="9"
                fill="rgba(15,23,42,0.93)" stroke="rgba(234,179,8,0.9)" strokeWidth="1.8"
                filter="url(#ra-glow-sq)"
              />
              <text x={189} y={311} textAnchor="middle"
                fill="#fde68a" fontSize="12" fontWeight="bold" fontFamily="monospace"
              >a² + b² = c²</text>
              <text x={189} y={325} textAnchor="middle"
                fill="#fbbf24" fontSize="10.5" fontFamily="monospace"
              >9 + 16 = 25  ✓  Teorema Pythagoras Terbukti!</text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Step description card ────────────────────────────────────────── */}
      <div
        className="w-full max-w-sm rounded-lg px-4 py-3 text-center border transition-all duration-500"
        style={{
          background: "var(--bg-card)",
          borderColor: step === 3 && animDone
            ? "rgba(34,197,94,0.6)"
            : step === 2
            ? "rgba(234,179,8,0.5)"
            : step === 1
            ? "rgba(251,191,36,0.4)"
            : "rgba(168,85,247,0.4)",
        }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-1"
          style={{ color: step >= 3 && animDone ? "#86efac" : step >= 2 ? "#fbbf24" : "#d8b4fe" }}>
          {info.title}
        </p>
        <p className="text-xs text-white/75 font-body leading-relaxed">{info.desc}</p>
      </div>

      {/* ── Action buttons ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Back button */}
        <button
          onClick={handleBack}
          disabled={isAnimating || step === 0}
          className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "rgba(100,116,139,0.18)",
            border: "1.5px solid rgba(100,116,139,0.6)",
            color: "#cbd5e1",
          }}
        >
          ← Kembali
        </button>

        {/* Forward / reset button */}
        <button
          onClick={handleBtn}
          disabled={isAnimating}
          className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: `${info.btnColor}0.18)`,
            border: `1.5px solid ${info.btnColor}0.7)`,
            color: step === 1 ? "#fde68a" : step === 2 ? "#fbbf24" : step === 3 && animDone ? "#86efac" : "#d8b4fe",
          }}
        >
          {isAnimating ? "⏳ Menggeser segitiga…" : info.btn}
        </button>
      </div>

      {/* ── Colour legend ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-3 text-xs font-body">
        {["T₁","T₂","T₃","T₄"].map((lbl,i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: TRI_FILL[i], opacity:.85 }}/>
            <span style={{ color: TRI_STROKE[i] }}>{lbl}</span>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm border" style={{ background:"rgba(251,191,36,0.3)", borderColor:"#fbbf24" }}/>
          <span className="text-yellow-300">c²</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm border" style={{ background:"rgba(59,130,246,0.25)", borderColor:"#60a5fa" }}/>
          <span className="text-blue-300">a²</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm border" style={{ background:"rgba(34,197,94,0.25)", borderColor:"#4ade80" }}/>
          <span className="text-green-300">b²</span>
        </div>
      </div>
    </div>
  );
};

export default PythagorasRearrangementAnimation;
