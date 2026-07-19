import { useState, useRef, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const CHALLENGES_TRANSLATIONS = {
  id: [
    { id: "free",  label: "🎨 Eksplorasi Bebas",       check: () => true, hint: "Geser pegangan oranye atau ungu untuk mengubah panjang sisi." },
    { id: "t345",  label: "Buat triple 3-4-5",         check: (a:number, b:number, c:number) => (a===3&&b===4&&c===5)||(a===4&&b===3&&c===5), hint: "Atur sisi a = 3 dan sisi b = 4. Hipotenusa c akan menjadi 5." },
    { id: "t6810", label: "Buat triple 6-8-10",        check: (a:number, b:number, c:number) => (a===6&&b===8&&c===10)||(a===8&&b===6&&c===10), hint: "Kelipatan dari 3-4-5. Atur a = 6 dan b = 8." },
    { id: "t512",  label: "Buat hipotenusa = 13",      check: (a:number, b:number, c:number) => c===13&&((a===5&&b===12)||(a===12&&b===5)), hint: "Coba sisi 5 dan 12. Itulah triple Pythagoras lainnya!" },
    { id: "t815",  label: "Buat hipotenusa = 17",      check: (a:number, b:number, c:number) => c===17&&((a===8&&b===15)||(a===15&&b===8)), hint: "Triple 8-15-17 — coba kombinasi tersebut." },
  ],
  en: [
    { id: "free",  label: "🎨 Free Exploration",       check: () => true, hint: "Drag the orange or purple handle to change the side lengths." },
    { id: "t345",  label: "Make triple 3-4-5",         check: (a:number, b:number, c:number) => (a===3&&b===4&&c===5)||(a===4&&b===3&&c===5), hint: "Set side a = 3 and side b = 4. The hypotenuse c will become 5." },
    { id: "t6810", label: "Make triple 6-8-10",        check: (a:number, b:number, c:number) => (a===6&&b===8&&c===10)||(a===8&&b===6&&c===10), hint: "A multiple of 3-4-5. Set a = 6 and b = 8." },
    { id: "t512",  label: "Make hypotenuse = 13",      check: (a:number, b:number, c:number) => c===13&&((a===5&&b===12)||(a===12&&b===5)), hint: "Try sides 5 and 12. That's another Pythagorean triple!" },
    { id: "t815",  label: "Make hypotenuse = 17",      check: (a:number, b:number, c:number) => c===17&&((a===8&&b===15)||(a===15&&b===8)), hint: "Triple 8-15-17 — try that combination." },
  ],
  ja: [
    { id: "free",  label: "🎨 自由探索",              check: () => true, hint: "オレンジまたは紫のハンドルをドラッグして辺の長さを変えましょう。" },
    { id: "t345",  label: "3-4-5 を作る",             check: (a:number, b:number, c:number) => (a===3&&b===4&&c===5)||(a===4&&b===3&&c===5), hint: "辺 a = 3、辺 b = 4 に設定してください。斜辺 c は 5 になります。" },
    { id: "t6810", label: "6-8-10 を作る",            check: (a:number, b:number, c:number) => (a===6&&b===8&&c===10)||(a===8&&b===6&&c===10), hint: "3-4-5 の倍数。a = 6、b = 8 に設定してください。" },
    { id: "t512",  label: "斜辺 = 13 を作る",         check: (a:number, b:number, c:number) => c===13&&((a===5&&b===12)||(a===12&&b===5)), hint: "辺 5 と 12 を試してください。もう一つのピタゴラス数です！" },
    { id: "t815",  label: "斜辺 = 17 を作る",         check: (a:number, b:number, c:number) => c===17&&((a===8&&b===15)||(a===15&&b===8)), hint: "8-15-17 の組合せを試してください。" },
  ],
};

const INT_TRANSLATIONS = {
  id: {
    dragHint: "🖱️ Seret pegangan oranye (kanan) atau ungu (atas). Saksikan luas tiga persegi memenuhi a² + b² = c²!",
    challenge: "Tantangan",
    success: "🏆 BERHASIL! Triple Pythagoras tercapai!",
    hint: "💡",
    equation: "Persamaan Pythagoras",
    areaA: "■ Luas a²",
    areaB: "■ Luas b²",
    total: "■ Total = Luas c²",
    isTriple: (a:number, b:number, c:number) => `⭐ Ini Triple Pythagoras: ${a}-${b}-${c}!`,
    notTriple: (c:number) => `Hipotenusa = bilangan irasional (${c}…)`,
    showSq: "🟦 Tampilkan ²",
    hideSq: "🟦 Sembunyikan ²",
    reset: "🔄 Reset",
  },
  en: {
    dragHint: "🖱️ Drag the orange (right) or purple (top) handle. Watch the three squares satisfy a² + b² = c²!",
    challenge: "Challenge",
    success: "🏆 SUCCESS! Pythagorean triple achieved!",
    hint: "💡",
    equation: "Pythagorean Equation",
    areaA: "■ Area a²",
    areaB: "■ Area b²",
    total: "■ Total = Area c²",
    isTriple: (a:number, b:number, c:number) => `⭐ This is a Pythagorean Triple: ${a}-${b}-${c}!`,
    notTriple: (c:number) => `Hypotenuse = irrational number (${c}…)`,
    showSq: "🟦 Show squares",
    hideSq: "🟦 Hide squares",
    reset: "🔄 Reset",
  },
  ja: {
    dragHint: "🖱️ オレンジ（右）または紫（上）のハンドルをドラッグ。3つの正方形が a² + b² = c² を満たすのを観察しよう！",
    challenge: "チャレンジ",
    success: "🏆 成功！ピタゴラス数を達成しました！",
    hint: "💡",
    equation: "ピタゴラスの等式",
    areaA: "■ a² の面積",
    areaB: "■ b² の面積",
    total: "■ 合計 = c² の面積",
    isTriple: (a:number, b:number, c:number) => `⭐ これはピタゴラス数: ${a}-${b}-${c}！`,
    notTriple: (c:number) => `斜辺 = 無理数 (${c}…)`,
    showSq: "🟦 正方形を表示",
    hideSq: "🟦 正方形を非表示",
    reset: "🔄 リセット",
  },
};

const VIEW = 460;
const PAD = 60;
const MAX_LEN = 12;
const MIN_LEN = 1;
const UNIT = 22;

type Challenge = {
  id: string;
  label: string;
  check: (a: number, b: number, c: number) => boolean;
  hint: string;
};

export default function PythagorasInteractive() {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const CHALLENGES = CHALLENGES_TRANSLATIONS[language as keyof typeof CHALLENGES_TRANSLATIONS] ?? CHALLENGES_TRANSLATIONS.id;
  const ti = INT_TRANSLATIONS[language as keyof typeof INT_TRANSLATIONS] ?? INT_TRANSLATIONS.id;

  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);
  const [showSquares, setShowSquares] = useState(true);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const cExact = Math.sqrt(a * a + b * b);
  const c = Math.round(cExact * 100) / 100;
  const isInteger = Math.abs(cExact - Math.round(cExact)) < 0.001;
  const isTriple = isInteger && Number.isInteger(a) && Number.isInteger(b);

  const challenge = CHALLENGES[challengeIdx];
  const cInt = Math.round(cExact);
  const challengeMet = challenge.check(a, b, isInteger ? cInt : -1);

  // SVG positions: right angle at bottom-left
  const cornerX = PAD;
  const cornerY = VIEW - PAD;
  const horizEndX = cornerX + a * UNIT;
  const horizEndY = cornerY;
  const vertEndX = cornerX;
  const vertEndY = cornerY - b * UNIT;

  const triangleColor = useMemo(() => {
    if (challengeMet && challengeIdx > 0) return "#fde047";
    return "#22d3ee";
  }, [challengeMet, challengeIdx]);

  const getSVGPos = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * VIEW,
      y: ((e.clientY - rect.top) / rect.height) * VIEW,
    };
  }, []);

  const handleDown = useCallback(
    (e: React.PointerEvent<SVGCircleElement>, id: "a" | "b") => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
      setDragging(id);
    },
    [],
  );

  const handleMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const pos = getSVGPos(e);
      if (!pos) return;
      if (dragging === "a") {
        const newA = Math.round((pos.x - cornerX) / UNIT);
        if (newA >= MIN_LEN && newA <= MAX_LEN) setA(newA);
      } else if (dragging === "b") {
        const newB = Math.round((cornerY - pos.y) / UNIT);
        if (newB >= MIN_LEN && newB <= MAX_LEN) setB(newB);
      }
    },
    [dragging, getSVGPos, cornerX, cornerY],
  );

  const handleUp = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    (e.target as SVGCircleElement).releasePointerCapture(e.pointerId);
    setDragging(null);
  }, []);

  const reset = () => {
    setA(3);
    setB(4);
  };

  // Square A on the bottom (below horizontal leg) — width a, height a
  const sqAX = cornerX;
  const sqAY = cornerY;
  const sqASize = a * UNIT;

  // Square B on the left (left of vertical leg) — width b, height b
  const sqBX = cornerX - b * UNIT;
  const sqBY = vertEndY;
  const sqBSize = b * UNIT;

  // Square C on the hypotenuse (rotated)
  const hypDx = vertEndX - horizEndX;
  const hypDy = vertEndY - horizEndY;
  const hypLen = Math.sqrt(hypDx * hypDx + hypDy * hypDy);
  // Normal vector pointing AWAY from the right-angle corner
  // The triangle's right angle is at (cornerX, cornerY).
  // We want square C on the OUTSIDE (opposite side from corner).
  const nx = -hypDy / hypLen;
  const ny = hypDx / hypLen;
  const cornerToHypMidX = (horizEndX + vertEndX) / 2 - cornerX;
  const cornerToHypMidY = (horizEndY + vertEndY) / 2 - cornerY;
  const dot = nx * cornerToHypMidX + ny * cornerToHypMidY;
  const sign = dot >= 0 ? 1 : -1;
  const sqC1x = horizEndX;
  const sqC1y = horizEndY;
  const sqC2x = vertEndX;
  const sqC2y = vertEndY;
  const sqC3x = vertEndX + nx * hypLen * sign;
  const sqC3y = vertEndY + ny * hypLen * sign;
  const sqC4x = horizEndX + nx * hypLen * sign;
  const sqC4y = horizEndY + ny * hypLen * sign;

  return (
    <div className={isDark ? "rounded-2xl bg-slate-950/60 border border-cyan-300/20 p-3 md:p-4" : "rounded-2xl bg-gray-50 border border-cyan-300/20 p-3 md:p-4"}>
      {/* Challenge selector */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {CHALLENGES.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setChallengeIdx(i)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all border ${
              i === challengeIdx
                ? "bg-cyan-400 text-slate-900 border-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                : isDark ? "border-white/20 text-white/70 bg-white/5 hover:bg-white/10" : "border-gray-300 text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {ch.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_240px] gap-4 items-start">
        {/* Triangle */}
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`-50 -100 ${VIEW + 100} ${VIEW + 100}`}
            className="w-full h-auto rounded-xl touch-none"
            style={{ background: isDark ? "linear-gradient(to bottom right,#0f172a,#020617)" : "linear-gradient(to bottom right,#f8fafc,#f1f5f9)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)" }}
            onPointerMove={handleMove}
          >
            {/* Background grid (subtle) */}
            {Array.from({ length: MAX_LEN + 1 }).map((_, i) => (
              <g key={`gr${i}`} opacity="0.15">
                <line
                  x1={cornerX + i * UNIT}
                  y1={cornerY}
                  x2={cornerX + i * UNIT}
                  y2={cornerY - MAX_LEN * UNIT}
                  stroke="#475569"
                  strokeWidth="0.5"
                />
                <line
                  x1={cornerX}
                  y1={cornerY - i * UNIT}
                  x2={cornerX + MAX_LEN * UNIT}
                  y2={cornerY - i * UNIT}
                  stroke="#475569"
                  strokeWidth="0.5"
                />
              </g>
            ))}

            {/* Square on side a (bottom) */}
            {showSquares && (
              <g>
                <rect
                  x={sqAX}
                  y={sqAY}
                  width={sqASize}
                  height={sqASize}
                  fill="#fb923c"
                  fillOpacity="0.25"
                  stroke="#fb923c"
                  strokeWidth="2"
                />
                {Array.from({ length: a }).map((_, i) =>
                  Array.from({ length: a }).map((__, j) => (
                    <rect
                      key={`sa${i}-${j}`}
                      x={sqAX + i * UNIT}
                      y={sqAY + j * UNIT}
                      width={UNIT}
                      height={UNIT}
                      fill="none"
                      stroke="#fb923c"
                      strokeWidth="0.5"
                      strokeOpacity="0.6"
                    />
                  )),
                )}
                <text
                  x={sqAX + sqASize / 2}
                  y={sqAY + sqASize / 2 + 5}
                  textAnchor="middle"
                  fill="#fed7aa"
                  fontSize="16"
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  a² = {a * a}
                </text>
              </g>
            )}

            {/* Square on side b (left) */}
            {showSquares && (
              <g>
                <rect
                  x={sqBX}
                  y={sqBY}
                  width={sqBSize}
                  height={sqBSize}
                  fill="#a78bfa"
                  fillOpacity="0.25"
                  stroke="#a78bfa"
                  strokeWidth="2"
                />
                {Array.from({ length: b }).map((_, i) =>
                  Array.from({ length: b }).map((__, j) => (
                    <rect
                      key={`sb${i}-${j}`}
                      x={sqBX + i * UNIT}
                      y={sqBY + j * UNIT}
                      width={UNIT}
                      height={UNIT}
                      fill="none"
                      stroke="#a78bfa"
                      strokeWidth="0.5"
                      strokeOpacity="0.6"
                    />
                  )),
                )}
                <text
                  x={sqBX + sqBSize / 2}
                  y={sqBY + sqBSize / 2 + 5}
                  textAnchor="middle"
                  fill="#ddd6fe"
                  fontSize="16"
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  b² = {b * b}
                </text>
              </g>
            )}

            {/* Square on hypotenuse */}
            {showSquares && (
              <g>
                <polygon
                  points={`${sqC1x},${sqC1y} ${sqC2x},${sqC2y} ${sqC3x},${sqC3y} ${sqC4x},${sqC4y}`}
                  fill="#34d399"
                  fillOpacity="0.25"
                  stroke="#34d399"
                  strokeWidth="2"
                />
                <text
                  x={(sqC1x + sqC3x) / 2}
                  y={(sqC1y + sqC3y) / 2 + 5}
                  textAnchor="middle"
                  fill="#a7f3d0"
                  fontSize="16"
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  c² = {Math.round(cExact * cExact * 100) / 100}
                </text>
              </g>
            )}

            {/* Triangle outline */}
            <polygon
              points={`${cornerX},${cornerY} ${horizEndX},${horizEndY} ${vertEndX},${vertEndY}`}
              fill={triangleColor}
              fillOpacity="0.2"
              stroke={triangleColor}
              strokeWidth="3"
              style={{ filter: `drop-shadow(0 0 6px ${triangleColor})` }}
            />

            {/* Right angle marker */}
            <rect
              x={cornerX}
              y={cornerY - 12}
              width={12}
              height={12}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />

            {/* Side labels */}
            <text
              x={cornerX + (a * UNIT) / 2}
              y={cornerY + 22}
              textAnchor="middle"
              fill="#fb923c"
              fontSize="14"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              a = {a}
            </text>
            <text
              x={cornerX - 22}
              y={cornerY - (b * UNIT) / 2 + 4}
              textAnchor="end"
              fill="#a78bfa"
              fontSize="14"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              b = {b}
            </text>
            <text
              x={(horizEndX + vertEndX) / 2 + 10}
              y={(horizEndY + vertEndY) / 2 - 8}
              fill="#34d399"
              fontSize="14"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              c = {isInteger ? cInt : c.toFixed(2)}
            </text>

            {/* Drag handles */}
            <circle
              cx={horizEndX}
              cy={horizEndY}
              r={11}
              fill="#fb923c"
              stroke="#7c2d12"
              strokeWidth={3}
              onPointerDown={(e) => handleDown(e, "a")}
              onPointerUp={handleUp}
              style={{ cursor: dragging === "a" ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(251,146,60,0.7))" }}
            />
            <circle
              cx={vertEndX}
              cy={vertEndY}
              r={11}
              fill="#a78bfa"
              stroke="#4c1d95"
              strokeWidth={3}
              onPointerDown={(e) => handleDown(e, "b")}
              onPointerUp={handleUp}
              style={{ cursor: dragging === "b" ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(167,139,250,0.7))" }}
            />
          </svg>
          <p className={isDark ? "mt-2 text-[11px] text-center text-white/55 font-body italic" : "mt-2 text-[11px] text-center text-gray-500 font-body italic"}>
            {ti.dragHint}
          </p>
        </div>

        {/* Info panel */}
        <div className="space-y-2">
          <div
            className={`rounded-xl border-2 p-3 transition-all ${
              challengeIdx === 0
                ? "border-cyan-300/30 bg-cyan-500/10"
                : challengeMet
                  ? "border-yellow-300/60 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 animate-pulse"
                  : "border-amber-300/30 bg-amber-500/10"
            }`}
          >
            <p className={isDark ? "text-[10px] uppercase tracking-wider text-white/50 mb-1" : "text-[10px] uppercase tracking-wider text-gray-500 mb-1"}>{ti.challenge}</p>
            <p className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold text-gray-800"}>{challenge.label}</p>
            {challengeIdx !== 0 && (
              <p className={isDark ? "text-xs mt-1 text-white/70 italic" : "text-xs mt-1 text-gray-600 italic"}>
                {challengeMet ? ti.success : `${ti.hint} ${challenge.hint}`}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-emerald-200/70 mb-1">{ti.equation}</p>
            <p className="text-base font-display font-bold text-emerald-100">
              {a}² + {b}² = c²
            </p>
            <p className="text-base font-display font-bold text-emerald-100">
              {a * a} + {b * b} = {a * a + b * b}
            </p>
            <p className="text-xl font-display font-bold text-yellow-200 mt-1">
              c = √{a * a + b * b} = {isInteger ? cInt : c.toFixed(2)}
            </p>
          </div>

          <div className={isDark ? "rounded-xl border border-white/15 bg-black/30 p-3 space-y-1.5 text-xs" : "rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-1.5 text-xs"}>
            <div className="flex justify-between">
              <span className="text-orange-300">{ti.areaA}</span>
              <span className={isDark ? "font-bold text-white" : "font-bold text-gray-800"}>{a * a}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-violet-300">{ti.areaB}</span>
              <span className={isDark ? "font-bold text-white" : "font-bold text-gray-800"}>{b * b}</span>
            </div>
            <div className="border-t border-white/10 my-1" />
            <div className="flex justify-between text-emerald-200 font-bold">
              <span>{ti.total}</span>
              <span>{a * a + b * b}</span>
            </div>
          </div>

          <div className={isDark ? "rounded-xl border border-white/15 bg-black/30 p-2.5 text-xs text-white/75 text-center" : "rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-600 text-center"}>
            {isTriple ? (
              <p className="text-yellow-200 font-bold">{ti.isTriple(a, b, cInt)}</p>
            ) : (
              <p>{ti.notTriple(c.toFixed(2))}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowSquares((v) => !v)}
              className={isDark ? "flex-1 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-2 transition-colors" : "flex-1 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold py-2 transition-colors"}
            >
              {showSquares ? ti.hideSq : ti.showSq}
            </button>
            <button
              type="button"
              onClick={reset}
              className={isDark ? "flex-1 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-2 transition-colors" : "flex-1 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold py-2 transition-colors"}
            >
              {ti.reset}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
