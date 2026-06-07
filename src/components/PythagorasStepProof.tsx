import React, { useState, useRef, useCallback, useEffect } from "react";

// ─── Geometry: a=3, b=4, c=5, scale=36 px/unit ───────────────────────────────
const A_PX = 108;   // a × 36
const B_PX = 144;   // b × 36
const S_PX = 252;   // (a+b) × 36
const OX   = 64;    // big-square top-left x
const OY   = 30;    // big-square top-left y

type Pt  = [number, number];
type Tri = [Pt, Pt, Pt];

// Arrangement A: 4 triangles at corners → c² exposed in centre
const POS_A: Tri[] = [
  [[OX,         OY],        [OX+B_PX, OY],        [OX,         OY+A_PX]],
  [[OX+S_PX,    OY],        [OX+S_PX, OY+B_PX],   [OX+B_PX,    OY]],
  [[OX+S_PX,    OY+S_PX],   [OX+A_PX, OY+S_PX],   [OX+S_PX,    OY+B_PX]],
  [[OX,         OY+S_PX],   [OX+A_PX, OY+S_PX],   [OX,         OY+B_PX]],
];

// Arrangement B: 4 triangles form 2 rectangles → a² and b² exposed
const POS_B: Tri[] = [
  [[OX+A_PX,    OY],        [OX+S_PX, OY],         [OX+A_PX,    OY+A_PX]],
  [[OX+S_PX,    OY+A_PX],   [OX+A_PX, OY+A_PX],    [OX+S_PX,    OY]],
  [[OX+A_PX,    OY+S_PX],   [OX,      OY+S_PX],    [OX+A_PX,    OY+A_PX]],
  [[OX,         OY+A_PX],   [OX+A_PX, OY+A_PX],    [OX,         OY+S_PX]],
];

// c² tilted inner square
const C2_PTS: Pt[] = [
  [OX+B_PX,  OY],
  [OX+S_PX,  OY+B_PX],
  [OX+A_PX,  OY+S_PX],
  [OX,       OY+B_PX],
];
const C2_CX = C2_PTS.reduce((s, p) => s + p[0], 0) / 4;
const C2_CY = C2_PTS.reduce((s, p) => s + p[1], 0) / 4;

const TRI_FILL   = ["#3b82f6", "#22c55e", "#f97316", "#a855f7"];
const TRI_STROKE = ["#93c5fd", "#86efac", "#fdba74", "#d8b4fe"];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function ease(t: number) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; }
function lerpTri(A: Tri, B: Tri, t: number): Pt[] {
  return A.map((v, i) => [lerp(v[0], B[i][0], t), lerp(v[1], B[i][1], t)] as Pt);
}
function svgPts(v: Pt[]) { return v.map(p => p.join(",")).join(" "); }
function cen(v: Pt[]): Pt {
  return [v.reduce((s, p) => s + p[0], 0) / v.length, v.reduce((s, p) => s + p[1], 0) / v.length];
}

// ─── Step definitions ─────────────────────────────────────────────────────────
interface StepMeta {
  dot: string;
  title: string;
  desc: string;
  color: string;
}
const STEPS: StepMeta[] = [
  {
    dot: "1",
    title: "Segitiga Siku-Siku",
    desc: "Segitiga siku-siku dengan kaki a = 3 dan b = 4, serta hipotenusa c = 5. Kita akan membuktikan secara visual bahwa a² + b² = c²!",
    color: "#22d3ee",
  },
  {
    dot: "2",
    title: "Buat Persegi Besar (a+b)²",
    desc: "Buat persegi besar bersisi (a + b) = 7. Luasnya = (a + b)² = 49 satuan². Persegi inilah yang menjadi \"arena\" pembuktian kita!",
    color: "#818cf8",
  },
  {
    dot: "3",
    title: "Susun 4 Segitiga Identik",
    desc: "Empat salinan segitiga siku-siku ditempatkan di sudut-sudut persegi besar. Perhatikan ruang kosong yang terbentuk di tengah!",
    color: "#c084fc",
  },
  {
    dot: "4",
    title: "Ruang Kosong Tengah = c²",
    desc: "Setiap sisi ruang kosong adalah hipotenusa c dari segitiga. Jadi ruang kosong = persegi bersisi c, luasnya = c² = 25 satuan persegi!",
    color: "#fbbf24",
  },
  {
    dot: "5",
    title: "Geser 4 Segitiga!",
    desc: "Geser 4 segitiga ke posisi baru dalam persegi yang sama. Ruang kosong berubah menjadi dua persegi terpisah: a² = 9 dan b² = 16!",
    color: "#34d399",
  },
  {
    dot: "6",
    title: "a² + b² = c²  Terbukti! ✓",
    desc: "Luas persegi besar tidak berubah. Dari dua cara menghitung: c² = a² + b²  ➜  25 = 9 + 16 = 25 ✓  Teorema Pythagoras terbukti secara visual!",
    color: "#4ade80",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const PythagorasStepProof: React.FC = () => {
  const [step, setStep]       = useState(0);
  const [animT, setAnimT]     = useState(0);
  const [isAnim, setIsAnim]   = useState(false);

  const rafRef    = useRef<number | null>(null);
  const startRef  = useRef<number | null>(null);
  const isAnimRef = useRef(false);
  const DURATION  = 1500;

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const stopAnim = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    isAnimRef.current = false;
    setIsAnim(false);
  }, []);

  const animLoop = useCallback((ts: number) => {
    if (!isAnimRef.current) return;
    if (startRef.current === null) startRef.current = ts;
    const elapsed  = ts - startRef.current;
    const progress = Math.min(elapsed / DURATION, 1);
    const newT     = ease(progress);
    setAnimT(newT);
    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animLoop);
    } else {
      isAnimRef.current = false;
      setIsAnim(false);
      setStep(5);   // auto-advance to final step
    }
  }, []);

  const startAnim = useCallback(() => {
    setStep(4);
    setAnimT(0);
    startRef.current  = null;
    isAnimRef.current = true;
    setIsAnim(true);
    rafRef.current = requestAnimationFrame(animLoop);
  }, [animLoop]);

  const goNext = () => {
    if (isAnim) return;
    if (step === 3) { startAnim(); }
    else if (step < 5) { setStep(s => s + 1); }
  };

  const goPrev = () => {
    if (isAnim) { stopAnim(); setStep(3); setAnimT(0); return; }
    if (step === 5 || step === 4) { setStep(3); setAnimT(0); }
    else if (step > 0) { setStep(s => s - 1); }
  };

  const goReset = () => { stopAnim(); setStep(0); setAnimT(0); };

  const jumpTo = (i: number) => {
    stopAnim();
    if (i === 4) { setStep(3); setAnimT(0); }   // clicking animation dot → pre-anim state
    else if (i === 5) { setStep(5); setAnimT(1); }
    else { setStep(i); setAnimT(0); }
  };

  // Compute triangle vertices at current state
  const triVerts: Pt[][] = POS_A.map((posA, i) => {
    if (step <= 3) return posA as unknown as Pt[];
    if (step === 4) return lerpTri(posA, POS_B[i], animT);
    return POS_B[i] as unknown as Pt[];
  });

  // Visibility flags
  const showBigSq  = step >= 1;
  const showT1     = step === 0;          // step 0: T1 only (intro triangle)
  const showAllTri = step >= 2;
  const showC2     = step >= 3;
  const c2Alpha    = step < 4 ? 1 : step === 4 ? 1 - animT : 0;
  const abAlpha    = step < 4 ? 0 : step === 4 ? animT     : 1;
  const showFinal  = step >= 5;

  // Step indicator includes animation step (dot 4 active during anim)
  const activeDot  = step;   // 0-5
  const info = STEPS[Math.min(step, 5)];

  // ─── Standalone intro triangle (step 0 only) — rendered larger via transform
  // T1 vertices: (OX,OY), (OX+B_PX,OY), (OX,OY+A_PX)
  // For step 0 we show only T1, same coordinates.

  return (
    <div className="w-full flex flex-col items-center gap-3 mb-1">

      {/* ── Step dots ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => jumpTo(i)}
            title={`Langkah ${i + 1}: ${s.title}`}
            className="rounded-full transition-all duration-300 focus:outline-none"
            style={{
              width:  i === activeDot ? 30 : 10,
              height: 10,
              background: i < activeDot
                ? "rgba(100,116,139,0.55)"
                : i === activeDot
                ? info.color
                : "rgba(71,85,105,0.35)",
            }}
          />
        ))}
      </div>

      {/* ── SVG canvas ──────────────────────────────────────────────────────── */}
      <div
        className="w-full overflow-hidden rounded-2xl border bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl"
        style={{ maxWidth: 400, borderColor: `${info.color}45` }}
      >
        <svg
          viewBox="0 0 390 302"
          className="w-full"
          aria-label="Pembuktian Teorema Pythagoras — Step by Step"
        >
          <defs>
            <filter id="sp-glow-c2">
              <feGaussianBlur stdDeviation="5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="sp-glow-sq">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="sp-glow-eq">
              <feGaussianBlur stdDeviation="6" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── Big outer square ── */}
          {showBigSq && (
            <>
              <rect
                x={OX} y={OY} width={S_PX} height={S_PX}
                fill="none"
                stroke="rgba(148,163,184,0.55)"
                strokeWidth="2"
                strokeDasharray="9 5"
              />
              {/* (a+b) side label — top */}
              <text
                x={OX + S_PX / 2} y={OY - 9}
                textAnchor="middle" fill="#64748b"
                fontSize="11" fontFamily="monospace"
              >(a+b) = 7</text>
              {/* (a+b) side label — left */}
              <text
                x={OX - 22} y={OY + S_PX / 2 + 4}
                textAnchor="middle" fill="#64748b"
                fontSize="11" fontFamily="monospace"
              >(a+b)</text>
            </>
          )}

          {/* ── c² tilted inner square ── */}
          {showC2 && c2Alpha > 0.02 && (
            <>
              <polygon
                points={svgPts(C2_PTS)}
                fill={`rgba(251,191,36,${0.15 * c2Alpha})`}
                stroke={`rgba(251,191,36,${c2Alpha})`}
                strokeWidth="2.5"
                filter="url(#sp-glow-c2)"
              />
              {c2Alpha > 0.12 && (
                <>
                  <text
                    x={C2_CX} y={C2_CY + 1}
                    textAnchor="middle"
                    fill={`rgba(253,230,138,${c2Alpha})`}
                    fontSize="22" fontWeight="bold" fontFamily="monospace"
                    filter="url(#sp-glow-c2)"
                  >c²</text>
                  <text
                    x={C2_CX} y={C2_CY + 18}
                    textAnchor="middle"
                    fill={`rgba(251,191,36,${c2Alpha * 0.85})`}
                    fontSize="12" fontFamily="monospace"
                  >= 25</text>
                </>
              )}
              {/* "c" labels on each side of inner tilted square (step 3 only) */}
              {step === 3 && ([
                { mx: (C2_PTS[3][0]+C2_PTS[0][0])/2, my: (C2_PTS[3][1]+C2_PTS[0][1])/2, dx: -14, dy: -3 },
                { mx: (C2_PTS[0][0]+C2_PTS[1][0])/2, my: (C2_PTS[0][1]+C2_PTS[1][1])/2, dx:  14, dy: -3 },
                { mx: (C2_PTS[1][0]+C2_PTS[2][0])/2, my: (C2_PTS[1][1]+C2_PTS[2][1])/2, dx:  14, dy:  8 },
                { mx: (C2_PTS[2][0]+C2_PTS[3][0])/2, my: (C2_PTS[2][1]+C2_PTS[3][1])/2, dx: -14, dy:  8 },
              ].map((m, i) => (
                <text key={i}
                  x={m.mx + m.dx} y={m.my + m.dy}
                  textAnchor="middle"
                  fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="monospace"
                  filter="url(#sp-glow-c2)"
                >c</text>
              )))}
            </>
          )}

          {/* ── a² square (fades in during animation) ── */}
          {abAlpha > 0.02 && (
            <>
              <rect
                x={OX} y={OY} width={A_PX} height={A_PX}
                fill={`rgba(59,130,246,${0.18 * abAlpha})`}
                stroke={`rgba(59,130,246,${abAlpha})`}
                strokeWidth="2.5"
                filter={abAlpha > 0.6 ? "url(#sp-glow-sq)" : undefined}
              />
              {abAlpha > 0.2 && (
                <>
                  <text
                    x={OX + A_PX/2} y={OY + A_PX/2 + 2}
                    textAnchor="middle"
                    fill={`rgba(147,197,253,${abAlpha})`}
                    fontSize="20" fontWeight="bold" fontFamily="monospace"
                    filter="url(#sp-glow-sq)"
                  >a²</text>
                  <text
                    x={OX + A_PX/2} y={OY + A_PX/2 + 18}
                    textAnchor="middle"
                    fill={`rgba(147,197,253,${abAlpha * 0.8})`}
                    fontSize="12" fontFamily="monospace"
                  >= 9</text>
                </>
              )}
            </>
          )}

          {/* ── b² square (fades in during animation) ── */}
          {abAlpha > 0.02 && (
            <>
              <rect
                x={OX + A_PX} y={OY + A_PX} width={B_PX} height={B_PX}
                fill={`rgba(34,197,94,${0.18 * abAlpha})`}
                stroke={`rgba(34,197,94,${abAlpha})`}
                strokeWidth="2.5"
                filter={abAlpha > 0.6 ? "url(#sp-glow-sq)" : undefined}
              />
              {abAlpha > 0.2 && (
                <>
                  <text
                    x={OX + A_PX + B_PX/2} y={OY + A_PX + B_PX/2 + 2}
                    textAnchor="middle"
                    fill={`rgba(134,239,172,${abAlpha})`}
                    fontSize="20" fontWeight="bold" fontFamily="monospace"
                    filter="url(#sp-glow-sq)"
                  >b²</text>
                  <text
                    x={OX + A_PX + B_PX/2} y={OY + A_PX + B_PX/2 + 18}
                    textAnchor="middle"
                    fill={`rgba(134,239,172,${abAlpha * 0.8})`}
                    fontSize="12" fontFamily="monospace"
                  >= 16</text>
                </>
              )}
            </>
          )}

          {/* ── 4 triangles ── */}
          {triVerts.map((verts, i) => {
            if (!showAllTri && !(showT1 && i === 0)) return null;
            const [cx, cy] = cen(verts);
            return (
              <g key={i}>
                <polygon
                  points={svgPts(verts)}
                  fill={TRI_FILL[i]}
                  fillOpacity="0.78"
                  stroke={TRI_STROKE[i]}
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                {showAllTri && (
                  <text
                    x={cx} y={cy + 4}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.85)"
                    fontSize="9" fontWeight="bold" fontFamily="monospace"
                  >{["T₁","T₂","T₃","T₄"][i]}</text>
                )}
              </g>
            );
          })}

          {/* ── Step 0: labels on the intro triangle T1 ── */}
          {showT1 && (
            <>
              {/* Right-angle mark at corner (OX, OY) */}
              <polyline
                points={`${OX},${OY+14} ${OX+14},${OY+14} ${OX+14},${OY}`}
                fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"
              />
              <text x={OX+18} y={OY+A_PX-6} fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="monospace">90°</text>

              {/* a — vertical leg label */}
              <text x={OX-16} y={OY+A_PX/2+4} textAnchor="middle" fill="#93c5fd" fontSize="17" fontWeight="bold" fontFamily="monospace">a</text>
              <text x={OX-16} y={OY+A_PX/2+20} textAnchor="middle" fill="#60a5fa" fontSize="10" fontFamily="monospace">=3</text>

              {/* b — horizontal leg label */}
              <text x={OX+B_PX/2} y={OY-14} textAnchor="middle" fill="#86efac" fontSize="17" fontWeight="bold" fontFamily="monospace">b</text>
              <text x={OX+B_PX/2} y={OY-3} textAnchor="middle" fill="#4ade80" fontSize="10" fontFamily="monospace">=4</text>

              {/* c — hypotenuse label (midpoint offset) */}
              <text x={OX+B_PX/2+22} y={OY+A_PX/2-6} textAnchor="middle" fill="#fdba74" fontSize="17" fontWeight="bold" fontFamily="monospace">c</text>
              <text x={OX+B_PX/2+22} y={OY+A_PX/2+10} textAnchor="middle" fill="#fb923c" fontSize="10" fontFamily="monospace">=5</text>

              {/* Intro formula */}
              <text x={205} y={188} textAnchor="middle" fill="rgba(251,191,36,0.55)" fontSize="14" fontWeight="bold" fontFamily="monospace">
                Buktikan: a² + b² = c²
              </text>
              <text x={205} y={208} textAnchor="middle" fill="rgba(251,191,36,0.35)" fontSize="11" fontFamily="monospace">
                Tekan "Selanjutnya" untuk mulai →
              </text>
            </>
          )}

          {/* ── Step 1: emphasise the big square area ── */}
          {step === 1 && (
            <>
              {/* Corner marks */}
              {([[OX,OY],[OX+S_PX,OY],[OX+S_PX,OY+S_PX],[OX,OY+S_PX]] as Pt[]).map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r="3" fill="rgba(148,163,184,0.7)"/>
              ))}
              {/* Area label */}
              <text x={OX+S_PX/2} y={OY+S_PX/2-8} textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize="18" fontWeight="bold" fontFamily="monospace">(a+b)²</text>
              <text x={OX+S_PX/2} y={OY+S_PX/2+12} textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="13" fontFamily="monospace">= 49 satuan²</text>
            </>
          )}

          {/* ── Step 2: hint that triangles fill the square ── */}
          {step === 2 && (
            <text x={OX+S_PX/2} y={OY+S_PX+20} textAnchor="middle" fill="rgba(192,132,252,0.7)" fontSize="11" fontFamily="monospace">
              4 segitiga + ruang kosong = (a+b)²
            </text>
          )}

          {/* ── Final equation banner ── */}
          {showFinal && (
            <g>
              <rect
                x={54} y={270} width={280} height={24}
                rx="7"
                fill="rgba(15,23,42,0.95)"
                stroke="rgba(74,222,128,0.9)"
                strokeWidth="1.5"
                filter="url(#sp-glow-eq)"
              />
              <text
                x={194} y={286}
                textAnchor="middle"
                fill="#86efac" fontSize="12" fontWeight="bold" fontFamily="monospace"
                filter="url(#sp-glow-eq)"
              >a² + b² = c²  ➜  9 + 16 = 25  ✓  Terbukti!</text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Info card ───────────────────────────────────────────────────────── */}
      <div
        className="w-full rounded-xl px-4 py-3 border transition-all duration-500"
        style={{
          maxWidth: 400,
          background: "rgba(15,23,42,0.82)",
          borderColor: `${info.color}45`,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full font-mono"
            style={{ background: `${info.color}25`, color: info.color }}
          >
            LANGKAH {info.dot}/6
          </span>
          <span className="text-xs font-bold" style={{ color: info.color }}>{info.title}</span>
        </div>
        <p className="text-xs text-white/70 font-body leading-relaxed">{info.desc}</p>
      </div>

      {/* ── Navigation buttons ───────────────────────────────────────────────── */}
      <div className="flex gap-3 items-center">
        {/* Prev */}
        <button
          onClick={goPrev}
          disabled={step === 0}
          className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "rgba(71,85,105,0.25)",
            border: "1.5px solid rgba(100,116,139,0.5)",
            color: "#94a3b8",
          }}
        >
          ← Sebelumnya
        </button>

        {/* Next / Animate / Reset */}
        {step < 5 ? (
          <button
            onClick={goNext}
            disabled={isAnim}
            className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: `${info.color}22`,
              border: `1.5px solid ${info.color}`,
              color: info.color,
            }}
          >
            {isAnim
              ? "⏳ Menggeser segitiga…"
              : step === 3
              ? "▶ Geser Segitiga!"
              : "Selanjutnya →"}
          </button>
        ) : (
          <button
            onClick={goReset}
            className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-200"
            style={{
              background: "rgba(74,222,128,0.2)",
              border: "1.5px solid rgba(74,222,128,0.85)",
              color: "#4ade80",
            }}
          >
            🔄 Ulangi dari Awal
          </button>
        )}
      </div>
    </div>
  );
};

export default PythagorasStepProof;
