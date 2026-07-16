import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── Geometry: 3-4-5 triple, 40 px/unit ─────────────────────────────────────
const SC = 40;
const A  = 3 * SC;   // 120 px  (leg a)
const B  = 4 * SC;   // 160 px  (leg b)
const S  = 7 * SC;   // 280 px  (big square side = a+b)

// Big square placed so it's centred in viewBox 420 × 360
const OX = 70;
const OY = 24;

type Pt  = [number, number];
type Tri = readonly [Pt, Pt, Pt];

// ── Vertices where adjacent hypotenuses meet (inner tilted square) ──
const C2: readonly Pt[] = [
  [OX + B,     OY    ],
  [OX + S,     OY + B],
  [OX + A,     OY + S],
  [OX,         OY + B],
];
const C2_CX = C2.reduce((s, p) => s + p[0], 0) / 4;
const C2_CY = C2.reduce((s, p) => s + p[1], 0) / 4;

// ── Arrangement A: 4 triangles at corners → c² exposed ──
const POS_A: Tri[] = [
  [[OX,     OY    ], [OX + B, OY    ], [OX,     OY + A]],
  [[OX + S, OY    ], [OX + S, OY + B], [OX + B, OY    ]],
  [[OX + S, OY + S], [OX + A, OY + S], [OX + S, OY + B]],
  [[OX,     OY + S], [OX,     OY + B], [OX + A, OY + S]],
];

// ── Arrangement B: 2 rectangles → a² (top-left) + b² (bottom-right) exposed ──
const POS_B: Tri[] = [
  [[OX + A, OY    ], [OX + S, OY    ], [OX + A, OY + A]],
  [[OX + S, OY + A], [OX + A, OY + A], [OX + S, OY    ]],
  [[OX,     OY + A], [OX,     OY + S], [OX + A, OY + A]],
  [[OX + A, OY + S], [OX + A, OY + A], [OX,     OY + S]],
];

// ── Triangle colours ──
const FILL   = ["#3b82f6", "#22c55e", "#f97316", "#a855f7"] as const;
const STROKE = ["#93c5fd", "#86efac", "#fdba74", "#d8b4fe"] as const;

// ── Helpers ──
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function lerpTri(A: Tri, B: Tri, t: number): Pt[] {
  return A.map((v, i) => [lerp(v[0], B[i][0], t), lerp(v[1], B[i][1], t)] as Pt);
}
function pts(v: Pt[]) { return v.map(p => p.join(",")).join(" "); }
function cen(v: Pt[]): Pt {
  return [
    v.reduce((s, p) => s + p[0], 0) / v.length,
    v.reduce((s, p) => s + p[1], 0) / v.length,
  ];
}

// ── Step metadata ──
interface StepMeta { label: string; title: string; desc: string; color: string; }

const STEPS_TRANSLATIONS: Record<string, StepMeta[]> = {
  id: [
    { label: "1", title: "Segitiga Siku-Siku", desc: "Segitiga siku-siku dengan kaki a = 3 dan b = 4, serta hipotenusa c = 5. Tujuan: buktikan secara visual bahwa a² + b² = c².", color: "#22d3ee" },
    { label: "2", title: "Persegi Besar (a+b)²", desc: "Buat persegi besar dengan sisi (a + b) = 7. Luas persegi ini = (a + b)² = 49 satuan² — ini menjadi \"arena\" pembuktian kita!", color: "#818cf8" },
    { label: "3", title: "Susun 4 Segitiga", desc: "Empat salinan segitiga siku-siku ditempatkan di sudut-sudut persegi besar. Perhatikan ruang kosong berbentuk persegi miring di tengah.", color: "#c084fc" },
    { label: "4", title: "Ruang Tengah = c²", desc: "Setiap sisi ruang kosong di tengah adalah hipotenusa c. Artinya ruang itu adalah persegi bersisi c → luasnya = c² = 25 satuan²!", color: "#fbbf24" },
    { label: "5", title: "Geser Segitiga! ▶", desc: "Empat segitiga digeser ke posisi baru di dalam persegi yang sama. Ruang kosong kini terpecah menjadi dua persegi: a² dan b²!", color: "#34d399" },
    { label: "6", title: "a² + b² = c²  ✓", desc: "Luas persegi besar tetap sama. Dengan dua cara menghitung: c² = a² + b²  →  25 = 9 + 16 = 25 ✓  Teorema Pythagoras TERBUKTI!", color: "#4ade80" },
  ],
  en: [
    { label: "1", title: "Right Triangle", desc: "A right triangle with legs a = 3 and b = 4, and hypotenuse c = 5. Goal: visually prove that a² + b² = c².", color: "#22d3ee" },
    { label: "2", title: "Large Square (a+b)²", desc: "Create a large square with side (a + b) = 7. Its area = (a + b)² = 49 square units — this becomes our proof \"arena\"!", color: "#818cf8" },
    { label: "3", title: "Arrange 4 Triangles", desc: "Four copies of the right triangle are placed at the corners of the large square. Notice the tilted square-shaped empty space in the center.", color: "#c084fc" },
    { label: "4", title: "Center Space = c²", desc: "Every side of the empty center space is hypotenuse c. So that space is a square with side c → its area = c² = 25 square units!", color: "#fbbf24" },
    { label: "5", title: "Slide Triangles! ▶", desc: "The four triangles slide to new positions inside the same large square. The empty space now splits into two squares: a² and b²!", color: "#34d399" },
    { label: "6", title: "a² + b² = c²  ✓", desc: "The large square's area stays the same. By two ways of counting: c² = a² + b²  →  25 = 9 + 16 = 25 ✓  Pythagorean Theorem PROVEN!", color: "#4ade80" },
  ],
  ja: [
    { label: "1", title: "直角三角形", desc: "直角三角形：脚 a = 3、b = 4、斜辺 c = 5。目標：a² + b² = c² を視覚的に証明する。", color: "#22d3ee" },
    { label: "2", title: "大きな正方形 (a+b)²", desc: "一辺 (a + b) = 7 の大きな正方形を作ります。面積 = (a + b)² = 49 平方単位 — これが証明の「舞台」です！", color: "#818cf8" },
    { label: "3", title: "4 つの三角形を配置", desc: "直角三角形の 4 枚のコピーを大きな正方形の隅に置きます。中央に傾いた正方形の空白ができることに注目。", color: "#c084fc" },
    { label: "4", title: "中央の空白 = c²", desc: "中央の空白の各辺はすべて斜辺 c です。つまりその空白は一辺 c の正方形 → 面積 = c² = 25 平方単位！", color: "#fbbf24" },
    { label: "5", title: "三角形を移動！ ▶", desc: "4 つの三角形が同じ大きな正方形の内側の新しい位置に移動します。空白が 2 つの正方形 a² と b² に分かれます！", color: "#34d399" },
    { label: "6", title: "a² + b² = c²  ✓", desc: "大きな正方形の面積は変わりません。2 通りの数え方：c² = a² + b²  →  25 = 9 + 16 = 25 ✓  三平方の定理 証明済み！", color: "#4ade80" },
  ],
};

const SP_UI_TRANSLATIONS = {
  id: {
    stepLabel: "LANGKAH",
    of: "/ 6",
    autoPlay: "▶ Putar Otomatis",
    stop: "⏹ Stop",
    back: "← Kembali",
    sliding: "⏳ Menggeser…",
    slideBtn: "▶ Geser Segitiga!",
    next: "Selanjutnya →",
    replay: "🔄 Ulangi",
    prove: "Buktikan: a² + b² = c²",
    prompt: "▶ Tekan Selanjutnya atau Putar Otomatis",
    proven: "a² + b² = c²  →  9 + 16 = 25  ✓  TERBUKTI!",
  },
  en: {
    stepLabel: "STEP",
    of: "/ 6",
    autoPlay: "▶ Auto-play",
    stop: "⏹ Stop",
    back: "← Back",
    sliding: "⏳ Sliding…",
    slideBtn: "▶ Slide Triangles!",
    next: "Next →",
    replay: "🔄 Replay",
    prove: "Prove: a² + b² = c²",
    prompt: "▶ Press Next or Auto-play",
    proven: "a² + b² = c²  →  9 + 16 = 25  ✓  PROVEN!",
  },
  ja: {
    stepLabel: "ステップ",
    of: "/ 6",
    autoPlay: "▶ 自動再生",
    stop: "⏹ 停止",
    back: "← 戻る",
    sliding: "⏳ 移動中…",
    slideBtn: "▶ 三角形を移動！",
    next: "次へ →",
    replay: "🔄 くり返す",
    prove: "証明：a² + b² = c²",
    prompt: "▶ 次へ または 自動再生 を押してください",
    proven: "a² + b² = c²  →  9 + 16 = 25  ✓  証明済み！",
  },
};

const ANIM_DURATION = 1600;

// ── Component ─────────────────────────────────────────────────────────────────
const PythagorasStepProof: React.FC = () => {
  const { language } = useLanguage();
  const STEPS = STEPS_TRANSLATIONS[language as keyof typeof STEPS_TRANSLATIONS] ?? STEPS_TRANSLATIONS.id;
  const spui = SP_UI_TRANSLATIONS[language as keyof typeof SP_UI_TRANSLATIONS] ?? SP_UI_TRANSLATIONS.id;

  const [step,   setStep  ] = useState(0);
  const [animT,  setAnimT ] = useState(0);
  const [isAnim, setIsAnim] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const rafRef     = useRef<number | null>(null);
  const startRef   = useRef<number | null>(null);
  const isAnimRef  = useRef(false);
  const autoTimRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up on unmount
  useEffect(() => () => {
    if (rafRef.current)    cancelAnimationFrame(rafRef.current);
    if (autoTimRef.current) clearTimeout(autoTimRef.current);
  }, []);

  // ── Core animation loop ──
  const animLoop = useCallback((ts: number) => {
    if (!isAnimRef.current) return;
    if (startRef.current === null) startRef.current = ts;
    const elapsed  = ts - startRef.current;
    const progress = Math.min(elapsed / ANIM_DURATION, 1);
    setAnimT(ease(progress));
    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animLoop);
    } else {
      isAnimRef.current = false;
      setIsAnim(false);
      setStep(5);
    }
  }, []);

  const startAnim = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStep(4);
    setAnimT(0);
    startRef.current  = null;
    isAnimRef.current = true;
    setIsAnim(true);
    rafRef.current = requestAnimationFrame(animLoop);
  }, [animLoop]);

  const stopAnim = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current    = null;
    isAnimRef.current = false;
    setIsAnim(false);
  }, []);

  // ── Auto-play logic ──
  const scheduleNext = useCallback((fromStep: number) => {
    if (autoTimRef.current) clearTimeout(autoTimRef.current);
    if (fromStep >= 5) { setAutoPlay(false); return; }
    const delay = fromStep === 3 ? ANIM_DURATION + 200 : 2200;
    autoTimRef.current = setTimeout(() => {
      if (fromStep === 3) {
        startAnim();
      } else {
        const next = fromStep + 1;
        setStep(next);
        scheduleNext(next);
      }
    }, delay);
  }, [startAnim]);

  // Watch step changes while auto-playing
  useEffect(() => {
    if (!autoPlay) return;
    if (step === 5) { setAutoPlay(false); return; }
    if (step !== 4) scheduleNext(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, step]);

  // After animation finishes during auto-play, schedule step 5 display
  useEffect(() => {
    if (autoPlay && !isAnim && step === 5) setAutoPlay(false);
  }, [autoPlay, isAnim, step]);

  const toggleAutoPlay = () => {
    if (autoPlay) {
      setAutoPlay(false);
      stopAnim();
      if (autoTimRef.current) clearTimeout(autoTimRef.current);
    } else {
      stopAnim();
      setStep(0);
      setAnimT(0);
      setAutoPlay(true);
    }
  };

  // ── Navigation ──
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

  const goReset = () => {
    stopAnim();
    setAutoPlay(false);
    if (autoTimRef.current) clearTimeout(autoTimRef.current);
    setStep(0);
    setAnimT(0);
  };

  const jumpTo = (i: number) => {
    stopAnim();
    setAutoPlay(false);
    if (autoTimRef.current) clearTimeout(autoTimRef.current);
    if (i === 4) { startAnim(); }
    else if (i === 5) { setStep(5); setAnimT(1); }
    else { setStep(i); setAnimT(0); }
  };

  // ── Derived geometry ──
  const triVerts: Pt[][] = POS_A.map((posA, i) => {
    if (step <= 3) return [...posA] as Pt[];
    if (step === 4) return lerpTri(posA, POS_B[i], animT);
    return [...POS_B[i]] as Pt[];
  });

  const showBigSq  = step >= 1;
  const showT0only = step === 0;
  const showAllTri = step >= 2;
  const showC2     = step >= 3;
  const c2Opacity  = step < 4 ? 1 : step === 4 ? 1 - animT : 0;
  const abOpacity  = step < 4 ? 0 : step === 4 ? animT     : 1;
  const showFinal  = step >= 5;

  const info     = STEPS[step <= 5 ? step : 5];
  const activeDot = step;

  // ── SVG helpers ──
  const RightAngle = ({ x, y, dir = "br" }: { x: number; y: number; dir?: string }) => {
    const d = 11;
    const pts: Record<string, string> = {
      br: `${x},${y+d} ${x+d},${y+d} ${x+d},${y}`,
      bl: `${x},${y+d} ${x-d},${y+d} ${x-d},${y}`,
      tr: `${x},${y-d} ${x+d},${y-d} ${x+d},${y}`,
      tl: `${x},${y-d} ${x-d},${y-d} ${x-d},${y}`,
    };
    return <polyline points={pts[dir]} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>;
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">

      {/* ── Step dots ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => jumpTo(i)}
            title={`Langkah ${s.label}: ${s.title}`}
            className="rounded-full transition-all duration-300 focus:outline-none"
            style={{
              width:      i === activeDot ? 32 : 10,
              height:     10,
              background: i < activeDot
                ? "rgba(100,116,139,0.55)"
                : i === activeDot
                ? info.color
                : "rgba(71,85,105,0.35)",
              boxShadow:  i === activeDot ? `0 0 8px ${info.color}88` : "none",
            }}
          />
        ))}
      </div>

      {/* ── SVG Canvas ────────────────────────────────────────────────────── */}
      <div
        className="w-full overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          maxWidth: 420,
          background: "linear-gradient(160deg,#0f172a 0%,#0d1728 100%)",
          borderColor: `${info.color}40`,
          boxShadow: `0 0 24px ${info.color}18`,
        }}
      >
        <svg viewBox="0 0 420 342" className="w-full" aria-label="Animasi Pembuktian Teorema Pythagoras">
          <defs>
            <filter id="glow-c">
              <feGaussianBlur stdDeviation="5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-sq">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-fin">
              <feGaussianBlur stdDeviation="7" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── Big square ── */}
          {showBigSq && (
            <>
              <rect
                x={OX} y={OY} width={S} height={S}
                fill="none"
                stroke="rgba(148,163,184,0.45)"
                strokeWidth="2"
                strokeDasharray="10 5"
              />
              <text x={OX + S / 2} y={OY - 10} textAnchor="middle"
                fill="rgba(148,163,184,0.65)" fontSize="11" fontFamily="monospace">
                sisi = a+b = 7
              </text>
              <text x={OX - 28} y={OY + S / 2 + 4} textAnchor="middle"
                fill="rgba(148,163,184,0.55)" fontSize="11" fontFamily="monospace">
                a+b
              </text>
              {/* Step 1: area label in center */}
              {step === 1 && (
                <>
                  {[
                    [OX,     OY    ],[OX + S, OY    ],
                    [OX + S, OY + S],[OX,     OY + S],
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="3.5" fill="rgba(148,163,184,0.7)"/>
                  ))}
                  <text x={OX + S / 2} y={OY + S / 2 - 10} textAnchor="middle"
                    fill="rgba(148,163,184,0.5)" fontSize="20" fontWeight="bold" fontFamily="monospace">
                    (a+b)²
                  </text>
                  <text x={OX + S / 2} y={OY + S / 2 + 14} textAnchor="middle"
                    fill="rgba(148,163,184,0.4)" fontSize="13" fontFamily="monospace">
                    = 49 satuan²
                  </text>
                </>
              )}
              {/* Step 2: hint text */}
              {step === 2 && (
                <text x={OX + S / 2} y={OY + S + 18} textAnchor="middle"
                  fill="rgba(192,132,252,0.7)" fontSize="11" fontFamily="monospace">
                  4 segitiga + ruang kosong = (a+b)²
                </text>
              )}
            </>
          )}

          {/* ── c² tilted inner square ── */}
          {showC2 && c2Opacity > 0.02 && (
            <>
              <polygon
                points={pts([...C2] as Pt[])}
                fill={`rgba(251,191,36,${0.12 * c2Opacity})`}
                stroke={`rgba(251,191,36,${c2Opacity})`}
                strokeWidth="2.5"
                filter="url(#glow-c)"
              />
              {c2Opacity > 0.15 && (
                <>
                  <text x={C2_CX} y={C2_CY + 5} textAnchor="middle"
                    fill={`rgba(253,230,138,${c2Opacity})`}
                    fontSize="24" fontWeight="bold" fontFamily="monospace"
                    filter="url(#glow-c)">
                    c²
                  </text>
                  <text x={C2_CX} y={C2_CY + 22} textAnchor="middle"
                    fill={`rgba(251,191,36,${c2Opacity * 0.8})`}
                    fontSize="13" fontFamily="monospace">
                    = 25
                  </text>
                  {/* c labels on each side of tilted square */}
                  {step === 3 && ([
                    { mx: (C2[3][0]+C2[0][0])/2-16, my: (C2[3][1]+C2[0][1])/2-2 },
                    { mx: (C2[0][0]+C2[1][0])/2+16, my: (C2[0][1]+C2[1][1])/2-2 },
                    { mx: (C2[1][0]+C2[2][0])/2+16, my: (C2[1][1]+C2[2][1])/2+5 },
                    { mx: (C2[2][0]+C2[3][0])/2-16, my: (C2[2][1]+C2[3][1])/2+5 },
                  ].map((m, i) => (
                    <text key={i} x={m.mx} y={m.my} textAnchor="middle"
                      fill={`rgba(251,191,36,${c2Opacity})`}
                      fontSize="13" fontWeight="bold" fontFamily="monospace"
                      filter="url(#glow-c)">
                      c
                    </text>
                  )))}
                </>
              )}
            </>
          )}

          {/* ── a² square (fades in) ── */}
          {abOpacity > 0.02 && (
            <>
              <rect
                x={OX} y={OY} width={A} height={A}
                fill={`rgba(59,130,246,${0.2 * abOpacity})`}
                stroke={`rgba(59,130,246,${abOpacity})`}
                strokeWidth="2.5"
                filter={abOpacity > 0.5 ? "url(#glow-sq)" : undefined}
              />
              {abOpacity > 0.25 && (
                <>
                  <text x={OX + A / 2} y={OY + A / 2 + 5} textAnchor="middle"
                    fill={`rgba(147,197,253,${abOpacity})`}
                    fontSize="22" fontWeight="bold" fontFamily="monospace"
                    filter="url(#glow-sq)">
                    a²
                  </text>
                  <text x={OX + A / 2} y={OY + A / 2 + 21} textAnchor="middle"
                    fill={`rgba(147,197,253,${abOpacity * 0.8})`}
                    fontSize="13" fontFamily="monospace">
                    = 9
                  </text>
                </>
              )}
            </>
          )}

          {/* ── b² square (fades in) ── */}
          {abOpacity > 0.02 && (
            <>
              <rect
                x={OX + A} y={OY + A} width={B} height={B}
                fill={`rgba(34,197,94,${0.2 * abOpacity})`}
                stroke={`rgba(34,197,94,${abOpacity})`}
                strokeWidth="2.5"
                filter={abOpacity > 0.5 ? "url(#glow-sq)" : undefined}
              />
              {abOpacity > 0.25 && (
                <>
                  <text x={OX + A + B / 2} y={OY + A + B / 2 + 5} textAnchor="middle"
                    fill={`rgba(134,239,172,${abOpacity})`}
                    fontSize="22" fontWeight="bold" fontFamily="monospace"
                    filter="url(#glow-sq)">
                    b²
                  </text>
                  <text x={OX + A + B / 2} y={OY + A + B / 2 + 21} textAnchor="middle"
                    fill={`rgba(134,239,172,${abOpacity * 0.8})`}
                    fontSize="13" fontFamily="monospace">
                    = 16
                  </text>
                </>
              )}
            </>
          )}

          {/* ── 4 Triangles ── */}
          {triVerts.map((verts, i) => {
            if (!showAllTri && !(showT0only && i === 0)) return null;
            const [cx, cy] = cen(verts);
            return (
              <g key={i}>
                <polygon
                  points={pts(verts)}
                  fill={FILL[i]}
                  fillOpacity="0.80"
                  stroke={STROKE[i]}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {showAllTri && (
                  <text x={cx} y={cy + 4} textAnchor="middle"
                    fill="rgba(255,255,255,0.9)"
                    fontSize="10" fontWeight="bold" fontFamily="monospace">
                    {["T₁","T₂","T₃","T₄"][i]}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Step 0: intro triangle labels ── */}
          {showT0only && (() => {
            const [p0, p1, p2] = POS_A[0];
            return (
              <>
                <RightAngle x={p0[0]} y={p0[1]} dir="br"/>
                <text x={p0[0] - 8} y={p0[1] + 12} fill="rgba(255,255,255,0.3)"
                  fontSize="8" fontFamily="monospace">90°</text>
                {/* a label — left side */}
                <text x={p0[0] - 18} y={(p0[1] + p2[1]) / 2 + 4} textAnchor="middle"
                  fill="#93c5fd" fontSize="18" fontWeight="bold" fontFamily="monospace">a</text>
                <text x={p0[0] - 18} y={(p0[1] + p2[1]) / 2 + 20} textAnchor="middle"
                  fill="#60a5fa" fontSize="11" fontFamily="monospace">=3</text>
                {/* b label — top side */}
                <text x={(p0[0] + p1[0]) / 2} y={p0[1] - 16} textAnchor="middle"
                  fill="#86efac" fontSize="18" fontWeight="bold" fontFamily="monospace">b</text>
                <text x={(p0[0] + p1[0]) / 2} y={p0[1] - 4} textAnchor="middle"
                  fill="#4ade80" fontSize="11" fontFamily="monospace">=4</text>
                {/* c label — hypotenuse */}
                <text x={(p1[0] + p2[0]) / 2 + 22} y={(p1[1] + p2[1]) / 2 - 4} textAnchor="middle"
                  fill="#fdba74" fontSize="18" fontWeight="bold" fontFamily="monospace">c</text>
                <text x={(p1[0] + p2[0]) / 2 + 22} y={(p1[1] + p2[1]) / 2 + 12} textAnchor="middle"
                  fill="#fb923c" fontSize="11" fontFamily="monospace">=5</text>
                {/* Prompt */}
                <text x={210} y={210} textAnchor="middle"
                  fill="rgba(251,191,36,0.5)" fontSize="13" fontWeight="bold" fontFamily="monospace">
                  {spui.prove}
                </text>
                <text x={210} y={230} textAnchor="middle"
                  fill="rgba(251,191,36,0.35)" fontSize="11" fontFamily="monospace">
                  {spui.prompt}
                </text>
              </>
            );
          })()}

          {/* ── Final equation banner ── */}
          {showFinal && (
            <g>
              <rect x={60} y={300} width={300} height={26} rx="8"
                fill="rgba(10,20,40,0.97)"
                stroke="rgba(74,222,128,0.95)"
                strokeWidth="1.5"
                filter="url(#glow-fin)"
              />
              <text x={210} y={317} textAnchor="middle"
                fill="#86efac" fontSize="12" fontWeight="bold" fontFamily="monospace"
                filter="url(#glow-fin)">
                {spui.proven}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Info card ─────────────────────────────────────────────────────── */}
      <div
        className="w-full rounded-xl px-4 py-3 border transition-all duration-500"
        style={{
          maxWidth: 420,
          background: "rgba(15,23,42,0.85)",
          borderColor: `${info.color}40`,
        }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full font-mono"
            style={{ background: `${info.color}20`, color: info.color }}
          >
            {spui.stepLabel} {info.label} {spui.of}
          </span>
          <span className="text-xs font-bold" style={{ color: info.color }}>
            {info.title}
          </span>
        </div>
        <p className="text-xs text-white/70 font-body leading-relaxed">{info.desc}</p>
      </div>

      {/* ── Controls ──────────────────────────────────────────────────────── */}
      <div className="flex gap-2 items-center flex-wrap justify-center">
        {/* Auto-play toggle */}
        <button
          onClick={toggleAutoPlay}
          className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
          style={{
            background: autoPlay ? "rgba(251,191,36,0.25)" : "rgba(251,191,36,0.12)",
            border: `1.5px solid rgba(251,191,36,${autoPlay ? 0.9 : 0.5})`,
            color: "#fbbf24",
          }}
        >
          {autoPlay ? spui.stop : spui.autoPlay}
        </button>

        {/* Prev */}
        <button
          onClick={goPrev}
          disabled={step === 0 || (isAnim)}
          className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "rgba(71,85,105,0.25)",
            border: "1.5px solid rgba(100,116,139,0.5)",
            color: "#94a3b8",
          }}
        >
          {spui.back}
        </button>

        {/* Next / Reset */}
        {step < 5 ? (
          <button
            onClick={goNext}
            disabled={isAnim}
            className="px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: `${info.color}20`,
              border: `1.5px solid ${info.color}`,
              color: info.color,
            }}
          >
            {isAnim
              ? spui.sliding
              : step === 3
              ? spui.slideBtn
              : spui.next}
          </button>
        ) : (
          <button
            onClick={goReset}
            className="px-5 py-2 rounded-full text-xs font-bold transition-all duration-200"
            style={{
              background: "rgba(74,222,128,0.18)",
              border: "1.5px solid rgba(74,222,128,0.85)",
              color: "#4ade80",
            }}
          >
            {spui.replay}
          </button>
        )}
      </div>
    </div>
  );
};

export default PythagorasStepProof;
