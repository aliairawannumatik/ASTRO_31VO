import { useState, useRef, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const VIEW = 400;
const RANGE = 8;
const CELL = VIEW / (RANGE * 2);
const O = VIEW / 2;

const toSVGX = (v: number) => O + v * CELL;
const toSVGY = (v: number) => O - v * CELL;
const fromSVGX = (p: number) => Math.round((p - O) / CELL);
const fromSVGY = (p: number) => Math.round(-(p - O) / CELL);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Challenge = {
  id: string;
  label: { id: string; en: string; ja: string };
  check: (m: number | null, c: number | null) => boolean;
  hint: { id: string; en: string; ja: string };
};

const CHALLENGES: Challenge[] = [
  {
    id: "free",
    label: { id: "🎨 Eksplorasi Bebas", en: "🎨 Free Exploration", ja: "🎨 自由探索" },
    check: () => true,
    hint: {
      id: "Geser titik biru atau merah ke mana saja. Perhatikan bagaimana m dan c berubah.",
      en: "Drag the blue or pink point anywhere. Watch how m and c change.",
      ja: "青や赤の点をどこへでもドラッグ。m と c の変化を観察しよう。",
    },
  },
  {
    id: "m2",
    label: { id: "Buat garis dengan m = 2", en: "Draw a line with m = 2", ja: "m = 2 の直線を描こう" },
    check: (m) => m === 2,
    hint: {
      id: "Naik 2 satuan setiap geser 1 satuan ke kanan.",
      en: "Rise 2 units for every 1 unit to the right.",
      ja: "右に 1 進むたびに 2 上がる。",
    },
  },
  {
    id: "mneg1",
    label: { id: "Buat garis dengan m = −1", en: "Draw a line with m = −1", ja: "m = −1 の直線を描こう" },
    check: (m) => m === -1,
    hint: {
      id: "Turun 1 satuan setiap geser 1 satuan ke kanan.",
      en: "Drop 1 unit for every 1 unit to the right.",
      ja: "右に 1 進むたびに 1 下がる。",
    },
  },
  {
    id: "horizontal",
    label: { id: "Buat garis MENDATAR (m = 0)", en: "Draw a HORIZONTAL line (m = 0)", ja: "水平線を描こう（m = 0）" },
    check: (m) => m === 0,
    hint: {
      id: "Posisikan kedua titik di ketinggian (y) yang sama.",
      en: "Place both points at the same height (y).",
      ja: "両点を同じ y 座標に置いて。",
    },
  },
  {
    id: "intercept3",
    label: { id: "Buat garis y = x + 3", en: "Draw the line y = x + 3", ja: "直線 y = x + 3 を描こう" },
    check: (m, c) => m === 1 && c === 3,
    hint: {
      id: "Gradien 1 dan memotong sumbu y di titik 3.",
      en: "Slope 1 crossing the y-axis at 3.",
      ja: "傾き 1 で y 軸の 3 を通る。",
    },
  },
  {
    id: "throughorigin",
    label: { id: "Buat garis melewati (0,0) dengan m = 3", en: "Line through (0,0) with m = 3", ja: "点(0,0)を通る m = 3 の直線" },
    check: (m, c) => m === 3 && c === 0,
    hint: {
      id: "Salah satu titik harus di (0, 0).",
      en: "One point must be at (0, 0).",
      ja: "一方の点を (0, 0) に置いて。",
    },
  },
];

const UI = {
  id: {
    challenge: "Tantangan",
    success: "🏆 BERHASIL!",
    lineEq: "Persamaan Garis",
    gradient: "Gradien (m)",
    constant: "Konstanta (c)",
    yIntercept: "titik potong sumbu y",
    lineType: "📊 Jenis Garis:",
    vertical: "↕️ Garis VERTIKAL (gradien tak hingga)",
    horizontal: "↔️ Garis MENDATAR (gradien nol)",
    rising: "↗️ NAIK ke kanan (m positif)",
    falling: "↘️ TURUN ke kanan (m negatif)",
    hideD: "📐 Sembunyikan Δ",
    showD: "📐 Tampilkan Δ",
    reset: "🔄 Reset",
    dragHint: "🖱️ Seret titik biru (A) atau merah muda (B). Kuning = perubahan x, ungu = perubahan y.",
  },
  en: {
    challenge: "Challenge",
    success: "🏆 SUCCESS!",
    lineEq: "Line Equation",
    gradient: "Gradient (m)",
    constant: "Constant (c)",
    yIntercept: "y-intercept",
    lineType: "📊 Line Type:",
    vertical: "↕️ VERTICAL line (undefined slope)",
    horizontal: "↔️ HORIZONTAL line (slope = 0)",
    rising: "↗️ RISING to the right (positive m)",
    falling: "↘️ FALLING to the right (negative m)",
    hideD: "📐 Hide Δ",
    showD: "📐 Show Δ",
    reset: "🔄 Reset",
    dragHint: "🖱️ Drag the blue (A) or pink (B) point. Yellow = Δx, purple = Δy.",
  },
  ja: {
    challenge: "チャレンジ",
    success: "🏆 成功！",
    lineEq: "直線の方程式",
    gradient: "傾き (m)",
    constant: "定数 (c)",
    yIntercept: "y 切片",
    lineType: "📊 直線の種類：",
    vertical: "↕️ 垂直線（傾き未定義）",
    horizontal: "↔️ 水平線（傾き = 0）",
    rising: "↗️ 右上がり（m 正）",
    falling: "↘️ 右下がり（m 負）",
    hideD: "📐 Δ を隠す",
    showD: "📐 Δ を表示",
    reset: "🔄 リセット",
    dragHint: "🖱️ 青(A)または桃(B)の点をドラッグ。黄 = Δx、紫 = Δy。",
  },
};

export default function PGLGradientInteractive() {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const ui = UI[language];

  const [pA, setPA] = useState({ x: -2, y: -1 });
  const [pB, setPB] = useState({ x: 3, y: 4 });
  const [dragging, setDragging] = useState<"A" | "B" | null>(null);
  const [showRiseRun, setShowRiseRun] = useState(true);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const dx = pB.x - pA.x;
  const dy = pB.y - pA.y;
  const isVertical = dx === 0;
  const m = isVertical ? null : dy / dx;
  const c = m === null ? null : pA.y - m * pA.x;

  const challenge = CHALLENGES[challengeIdx];
  const challengeMet = challenge.check(m, c);

  const lineEnds = useMemo(() => {
    if (isVertical) {
      return [{ x: pA.x, y: -RANGE }, { x: pA.x, y: RANGE }];
    }
    if (m === null) return [];
    const points: { x: number; y: number }[] = [];
    for (const x of [-RANGE, RANGE]) {
      const y = m * x + (c ?? 0);
      if (y >= -RANGE && y <= RANGE) points.push({ x, y });
    }
    if (m !== 0) {
      for (const y of [-RANGE, RANGE]) {
        const x = (y - (c ?? 0)) / m;
        if (x >= -RANGE && x <= RANGE) points.push({ x, y });
      }
    }
    const unique = points.filter(
      (p, i, arr) => arr.findIndex((q) => Math.abs(q.x - p.x) < 0.001 && Math.abs(q.y - p.y) < 0.001) === i,
    );
    return unique.slice(0, 2);
  }, [m, c, isVertical, pA]);

  const lineColor = useMemo(() => {
    if (m === null) return "#94a3b8";
    if (m > 0) return "#34d399";
    if (m < 0) return "#fb7185";
    return "#22d3ee";
  }, [m]);

  const formatEquation = () => {
    if (isVertical) return `x = ${pA.x}`;
    if (m === null || c === null) return "—";
    const mPart = m === 0 ? "" : m === 1 ? "x" : m === -1 ? "−x" : `${m}x`;
    const cPart = c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`;
    if (m === 0) return `y = ${c}`;
    return `y = ${mPart}${cPart}`;
  };

  const getSVGPos = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      svgX: ((e.clientX - rect.left) / rect.width) * VIEW,
      svgY: ((e.clientY - rect.top) / rect.height) * VIEW,
    };
  }, []);

  const handleDown = useCallback(
    (e: React.PointerEvent<SVGCircleElement>, id: "A" | "B") => {
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
      const x = clamp(fromSVGX(pos.svgX), -RANGE, RANGE);
      const y = clamp(fromSVGY(pos.svgY), -RANGE, RANGE);
      const newPoint = { x, y };
      if (dragging === "A" && (newPoint.x !== pB.x || newPoint.y !== pB.y)) setPA(newPoint);
      else if (dragging === "B" && (newPoint.x !== pA.x || newPoint.y !== pA.y)) setPB(newPoint);
    },
    [dragging, getSVGPos, pA, pB],
  );

  const handleUp = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    (e.target as SVGCircleElement).releasePointerCapture(e.pointerId);
    setDragging(null);
  }, []);

  const reset = () => {
    setPA({ x: -2, y: -1 });
    setPB({ x: 3, y: 4 });
  };

  return (
    <div className={`rounded-2xl border border-emerald-300/20 p-3 md:p-4 ${isDark ? "bg-slate-950/60" : "bg-gray-50"}`}>
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {CHALLENGES.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setChallengeIdx(i)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all border ${
              i === challengeIdx
                ? "bg-emerald-500 text-slate-900 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                : (isDark ? "border-white/20 text-white/70 bg-white/5 hover:bg-white/10" : "border-slate-200 text-slate-600 bg-slate-100 hover:bg-slate-200")
            }`}
          >
            {ch.label[language]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_240px] gap-4 items-start">
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            className={`w-full h-auto rounded-xl border touch-none ${isDark ? "bg-gradient-to-br from-slate-900 to-slate-950 border-white/10" : "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"}`}
            onPointerMove={handleMove}
          >
            {Array.from({ length: RANGE * 2 + 1 }).map((_, i) => {
              const v = i - RANGE;
              return (
                <g key={`g${i}`}>
                  <line x1={toSVGX(v)} y1={0} x2={toSVGX(v)} y2={VIEW}
                    stroke={v === 0 ? (isDark ? "#64748b" : "#94a3b8") : (isDark ? "#1e293b" : "#e2e8f0")} strokeWidth={v === 0 ? 1.5 : 0.6} />
                  <line x1={0} y1={toSVGY(v)} x2={VIEW} y2={toSVGY(v)}
                    stroke={v === 0 ? (isDark ? "#64748b" : "#94a3b8") : (isDark ? "#1e293b" : "#e2e8f0")} strokeWidth={v === 0 ? 1.5 : 0.6} />
                </g>
              );
            })}
            {[-6, -4, -2, 2, 4, 6].map((v) => (
              <g key={`lbl${v}`}>
                <text x={toSVGX(v)} y={O + 12} fill={isDark ? "#64748b" : "#94a3b8"} fontSize="9" textAnchor="middle">{v}</text>
                <text x={O - 6} y={toSVGY(v) + 3} fill={isDark ? "#64748b" : "#94a3b8"} fontSize="9" textAnchor="end">{v}</text>
              </g>
            ))}
            <text x={VIEW - 8} y={O - 4} fill={isDark ? "#94a3b8" : "#64748b"} fontSize="11" fontWeight="bold" textAnchor="end">x</text>
            <text x={O + 4} y={12} fill={isDark ? "#94a3b8" : "#64748b"} fontSize="11" fontWeight="bold">y</text>

            {lineEnds.length === 2 && (
              <line
                x1={toSVGX(lineEnds[0].x)} y1={toSVGY(lineEnds[0].y)}
                x2={toSVGX(lineEnds[1].x)} y2={toSVGY(lineEnds[1].y)}
                stroke={lineColor} strokeWidth={3} strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${lineColor})` }}
              />
            )}

            {showRiseRun && !isVertical && dx !== 0 && (
              <>
                <line x1={toSVGX(pA.x)} y1={toSVGY(pA.y)} x2={toSVGX(pB.x)} y2={toSVGY(pA.y)}
                  stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 3" />
                <line x1={toSVGX(pB.x)} y1={toSVGY(pA.y)} x2={toSVGX(pB.x)} y2={toSVGY(pB.y)}
                  stroke="#a78bfa" strokeWidth={2} strokeDasharray="4 3" />
                <text
                  x={(toSVGX(pA.x) + toSVGX(pB.x)) / 2}
                  y={toSVGY(pA.y) + (pA.y > pB.y ? -6 : 14)}
                  fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                >
                  Δx = {dx}
                </text>
                <text
                  x={toSVGX(pB.x) + (dx > 0 ? 6 : -6)}
                  y={(toSVGY(pA.y) + toSVGY(pB.y)) / 2}
                  fill="#a78bfa" fontSize="11" fontWeight="bold"
                  textAnchor={dx > 0 ? "start" : "end"}
                  style={{ pointerEvents: "none" }}
                >
                  Δy = {dy}
                </text>
              </>
            )}

            {!isVertical && m !== null && c !== null && c >= -RANGE && c <= RANGE && (
              <>
                <circle cx={toSVGX(0)} cy={toSVGY(c)} r={5} fill="#fde047" stroke="#facc15" strokeWidth={2} />
                <text x={toSVGX(0) + 8} y={toSVGY(c) - 6} fill="#fde047" fontSize="10" fontWeight="bold">c={c}</text>
              </>
            )}

            <circle cx={toSVGX(pA.x)} cy={toSVGY(pA.y)} r={11}
              fill="#22d3ee" stroke="#0e7490" strokeWidth={3}
              onPointerDown={(e) => handleDown(e, "A")} onPointerUp={handleUp}
              style={{ cursor: dragging === "A" ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(34,211,238,0.7))" }} />
            <text x={toSVGX(pA.x) - 14} y={toSVGY(pA.y) - 12}
              fill="#22d3ee" fontSize="12" fontWeight="bold" textAnchor="end"
              style={{ pointerEvents: "none" }}>
              A({pA.x}, {pA.y})
            </text>

            <circle cx={toSVGX(pB.x)} cy={toSVGY(pB.y)} r={11}
              fill="#f472b6" stroke="#9f1239" strokeWidth={3}
              onPointerDown={(e) => handleDown(e, "B")} onPointerUp={handleUp}
              style={{ cursor: dragging === "B" ? "grabbing" : "grab", filter: "drop-shadow(0 0 8px rgba(244,114,182,0.7))" }} />
            <text x={toSVGX(pB.x) + 14} y={toSVGY(pB.y) - 12}
              fill="#f472b6" fontSize="12" fontWeight="bold"
              style={{ pointerEvents: "none" }}>
              B({pB.x}, {pB.y})
            </text>
          </svg>
          <p className={`mt-2 text-[11px] text-center ${isDark ? "text-white/55" : "text-slate-500"} font-body italic`}>
            {ui.dragHint}
          </p>
        </div>

        <div className="space-y-2">
          <div className={`rounded-xl border-2 p-3 transition-all ${
            challengeIdx === 0
              ? "border-emerald-300/30 bg-emerald-500/10"
              : challengeMet
                ? "border-yellow-300/60 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 animate-pulse"
                : "border-amber-300/30 bg-amber-500/10"
          }`}>
            <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-400"} mb-1`}>{ui.challenge}</p>
            <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{challenge.label[language]}</p>
            {challengeIdx !== 0 && (
              <p className={`text-xs mt-1 ${isDark ? "text-white/70" : "text-slate-600"} italic`}>
                {challengeMet ? ui.success : `💡 ${challenge.hint[language]}`}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-emerald-200/70 mb-1">{ui.lineEq}</p>
            <p className="text-xl font-display font-bold text-emerald-100">{formatEquation()}</p>
          </div>

          <div className={`rounded-xl border p-3 space-y-2 ${isDark ? "border-white/15 bg-black/30" : "border-slate-200 bg-white/80"}`}>
            <div>
              <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-400"}`}>{ui.gradient}</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold" style={{ color: lineColor }}>
                  {m === null ? "∞" : m % 1 === 0 ? m : m.toFixed(2)}
                </span>
                <span className={`text-[11px] ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  = Δy/Δx = {dy}/{isVertical ? "0" : dx}
                </span>
              </div>
            </div>
            <div>
              <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-400"}`}>{ui.constant}</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-yellow-200">
                  {c === null ? "—" : c % 1 === 0 ? c : c.toFixed(2)}
                </span>
                <span className={`text-[11px] ${isDark ? "text-white/60" : "text-slate-500"}`}>{ui.yIntercept}</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-3 text-xs ${isDark ? "border-white/15 bg-black/30 text-white/75" : "border-slate-200 bg-white/80 text-slate-600"}`}>
            <p className={`font-bold ${isDark ? "text-white/85" : "text-slate-700"} mb-1`}>{ui.lineType}</p>
            {m === null && <p>{ui.vertical}</p>}
            {m !== null && m === 0 && <p>{ui.horizontal}</p>}
            {m !== null && m > 0 && <p className="text-emerald-300">{ui.rising}</p>}
            {m !== null && m < 0 && <p className="text-rose-300">{ui.falling}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowRiseRun((v) => !v)}
              className={`flex-1 rounded-lg border ${isDark ? "border-white/20" : "border-slate-200"} ${isDark ? "bg-white/5" : "bg-slate-100"} hover:bg-white/10 ${isDark ? "text-white" : "text-slate-800"} text-[11px] font-bold py-2 transition-colors`}
            >
              {showRiseRun ? ui.hideD : ui.showD}
            </button>
            <button
              type="button"
              onClick={reset}
              className={`flex-1 rounded-lg border ${isDark ? "border-white/20" : "border-slate-200"} ${isDark ? "bg-white/5" : "bg-slate-100"} hover:bg-white/10 ${isDark ? "text-white" : "text-slate-800"} text-[11px] font-bold py-2 transition-colors`}
            >
              {ui.reset}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
