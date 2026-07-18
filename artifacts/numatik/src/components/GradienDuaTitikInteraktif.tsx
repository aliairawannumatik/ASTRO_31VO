import React, { useState, useRef, useEffect, useCallback } from "react";
import { InlineMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const CELL  = 26;
const HALF  = 5;
const COLS  = HALF * 2;
const ROWS  = HALF * 2;
const PAD   = 18;
const W     = PAD * 2 + COLS * CELL;
const H     = PAD * 2 + ROWS * CELL;

const toSVG = (mx: number, my: number): [number, number] => [
  PAD + (mx + HALF) * CELL,
  PAD + (HALF - my) * CELL,
];
const toMath = (sx: number, sy: number): [number, number] => {
  const mx = Math.round((sx - PAD) / CELL - HALF);
  const my = Math.round(HALF - (sy - PAD) / CELL);
  return [
    Math.max(-HALF, Math.min(HALF, mx)),
    Math.max(-HALF, Math.min(HALF, my)),
  ];
};

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function simplify(num: number, den: number): [number, number] {
  const g = gcd(Math.abs(num), Math.abs(den));
  const n = num / g, d = den / g;
  return d < 0 ? [-n, -d] : [n, d];
}

function mLatex(dy: number, dx: number): string {
  if (dx === 0) return "\\nexists";
  if (dy === 0) return "0";
  const [n, d] = simplify(dy, dx);
  const sign = n * d > 0 ? "+" : "-";
  const absN = Math.abs(n), absD = Math.abs(d);
  return absD === 1 ? `${sign}${absN}` : `${sign}\\dfrac{${absN}}{${absD}}`;
}

function numStr(v: number): string {
  if (v >= 0) return String(v);
  return `(${v})`;
}

const labelOffset = (sx: number, sy: number): [number, number] => {
  const inRight = sx < W / 2;
  const inTop   = sy > H / 2;
  return [inRight ? 10 : -10, inTop ? 12 : -8];
};

const translations = {
  id: {
    dragHint: "Seret P₁ dan P₂ ke posisi berbeda",
    verticalHint: "garis tegak lurus (vertikal)",
    mUndefined: "tidak terdefinisi",
    formulaLabel: "Rumus:",
    subsLabel: "Substitusi:",
    calcLabel: "Hitung:",
    resultLabel: "Hasil:",
    positive: "(positif ↗)",
    negative: "(negatif ↘)",
    horizontal: "(horizontal →)",
  },
  en: {
    dragHint: "Drag P₁ and P₂ to different positions",
    verticalHint: "vertical line (undefined slope)",
    mUndefined: "undefined",
    formulaLabel: "Formula:",
    subsLabel: "Substitute:",
    calcLabel: "Simplify:",
    resultLabel: "Result:",
    positive: "(positive ↗)",
    negative: "(negative ↘)",
    horizontal: "(horizontal →)",
  },
  ja: {
    dragHint: "P₁とP₂を別の位置にドラッグ",
    verticalHint: "垂直線（傾き未定義）",
    mUndefined: "未定義",
    formulaLabel: "公式：",
    subsLabel: "代入：",
    calcLabel: "計算：",
    resultLabel: "結果：",
    positive: "（正 ↗）",
    negative: "（負 ↘）",
    horizontal: "（水平 →）",
  },
};

export default function GradienDuaTitikInteraktif() {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = translations[language];

  const [p1, setP1] = useState<[number, number]>([-3, -1]);
  const [p2, setP2] = useState<[number, number]>([3, 3]);
  const svgRef    = useRef<SVGSVGElement>(null);
  const dragging  = useRef<"p1" | "p2" | null>(null);

  const getMathPos = useCallback((clientX: number, clientY: number): [number, number] => {
    const svg = svgRef.current;
    if (!svg) return [0, 0];
    const rect = svg.getBoundingClientRect();
    const sx = (clientX - rect.left) * (W / rect.width);
    const sy = (clientY - rect.top)  * (H / rect.height);
    return toMath(sx, sy);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const pos = getMathPos(e.clientX, e.clientY);
      if (dragging.current === "p1") setP1(pos);
      else setP2(pos);
    };
    const onMouseUp = () => { dragging.current = null; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const pos = getMathPos(touch.clientX, touch.clientY);
      if (dragging.current === "p1") setP1(pos);
      else setP2(pos);
    };
    const onTouchEnd = () => { dragging.current = null; };

    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseup",    onMouseUp);
    window.addEventListener("touchmove",  onTouchMove, { passive: false });
    window.addEventListener("touchend",   onTouchEnd);
    return () => {
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseup",    onMouseUp);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [getMathPos]);

  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [sx1, sy1] = toSVG(x1, y1);
  const [sx2, sy2] = toSVG(x2, y2);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const samePoint = dx === 0 && dy === 0;

  const [csx, csy] = toSVG(x2, y1);

  const extLine = (() => {
    if (dx === 0) {
      const [ex, ey1] = toSVG(x1, -HALF);
      const [, ey2]   = toSVG(x1,  HALF);
      return { x1: ex, y1: ey2, x2: ex, y2: ey1 };
    }
    const slope = dy / dx;
    const yAtLeft  = y1 + slope * (-HALF - x1);
    const yAtRight = y1 + slope * ( HALF - x1);
    const [elx, ely] = toSVG(-HALF, yAtLeft);
    const [erx, ery] = toSVG( HALF, yAtRight);
    return { x1: elx, y1: ely, x2: erx, y2: ery };
  })();

  const mResult   = mLatex(dy, dx);
  const stepSubs  = dx !== 0
    ? `\\frac{${numStr(y2)} - ${numStr(y1)}}{${numStr(x2)} - ${numStr(x1)}}`
    : "";
  const stepSimp  = dx !== 0 && dy !== 0
    ? `\\frac{${dy}}{${dx}}`
    : "";

  const [lo1x, lo1y] = labelOffset(sx1, sy1);
  const [lo2x, lo2y] = labelOffset(sx2, sy2);

  return (
    <div className="space-y-3">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{
          background: isDark ? "rgba(10,18,35,0.90)" : "rgba(241,245,249,0.95)",
          borderRadius: 12,
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {Array.from({ length: COLS + 1 }, (_, i) => (
          <line key={`vc${i}`}
            x1={PAD + i * CELL} y1={PAD}
            x2={PAD + i * CELL} y2={H - PAD}
            stroke={isDark ? "#1a2744" : "#e2e8f0"} strokeWidth="1" />
        ))}
        {Array.from({ length: ROWS + 1 }, (_, i) => (
          <line key={`hr${i}`}
            x1={PAD} y1={PAD + i * CELL}
            x2={W - PAD} y2={PAD + i * CELL}
            stroke={isDark ? "#1a2744" : "#e2e8f0"} strokeWidth="1" />
        ))}

        {(() => {
          const [ox, oy] = toSVG(0, 0);
          return (
            <>
              <line x1={PAD} y1={oy} x2={W - PAD} y2={oy} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.5" />
              <line x1={ox} y1={PAD} x2={ox}      y2={H - PAD} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.5" />
            </>
          );
        })()}

        {!samePoint && (
          <line {...extLine}
            stroke="#a78bfa" strokeWidth="1.2" opacity="0.25" strokeLinecap="round" />
        )}

        {!samePoint && dx !== 0 && dy !== 0 && (
          <>
            <line x1={sx1} y1={sy1} x2={csx} y2={csy}
              stroke="#4ade80" strokeWidth="2" strokeDasharray="5,2.5" opacity="0.9" />
            <line x1={csx} y1={csy} x2={sx2} y2={sy2}
              stroke="#f472b6" strokeWidth="2" strokeDasharray="5,2.5" opacity="0.9" />
            <polyline
              points={`${csx+(dx>0?-6:6)},${csy} ${csx+(dx>0?-6:6)},${csy+(dy>0?6:-6)} ${csx},${csy+(dy>0?6:-6)}`}
              fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
            <text x={(sx1+csx)/2} y={csy+(dy>=0?13:-5)}
              fill="#4ade80" fontSize="10" fontWeight="bold" textAnchor="middle">
              Δx = {dx}
            </text>
            <text
              x={csx+(dx>=0?10:-10)} y={(csy+sy2)/2+4}
              fill="#f472b6" fontSize="10" fontWeight="bold"
              textAnchor={dx>=0?"start":"end"}>
              Δy = {dy}
            </text>
          </>
        )}

        {!samePoint && (
          <line x1={sx1} y1={sy1} x2={sx2} y2={sy2}
            stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
        )}

        <g style={{ cursor: "grab" }}
          onMouseDown={e => { e.preventDefault(); dragging.current = "p1"; }}
          onTouchStart={e => { e.preventDefault(); dragging.current = "p1"; }}>
          <circle cx={sx1} cy={sy1} r="13" fill="#22d3ee" opacity="0.10" />
          <circle cx={sx1} cy={sy1} r="6"  fill="#22d3ee" stroke="white" strokeWidth="1.5" />
          <text x={sx1+lo1x} y={sy1+lo1y}
            fill="#22d3ee" fontSize="9.5" fontWeight="bold" textAnchor="middle">
            P₁({x1},{y1})
          </text>
        </g>

        <g style={{ cursor: "grab" }}
          onMouseDown={e => { e.preventDefault(); dragging.current = "p2"; }}
          onTouchStart={e => { e.preventDefault(); dragging.current = "p2"; }}>
          <circle cx={sx2} cy={sy2} r="13" fill="#facc15" opacity="0.10" />
          <circle cx={sx2} cy={sy2} r="6"  fill="#facc15" stroke="white" strokeWidth="1.5" />
          <text x={sx2+lo2x} y={sy2+lo2y}
            fill="#facc15" fontSize="9.5" fontWeight="bold" textAnchor="middle">
            P₂({x2},{y2})
          </text>
        </g>
      </svg>

      <div className={`border border-violet-500/30 rounded-xl p-4 space-y-3 ${isDark ? "bg-slate-800/60" : "bg-gray-100"}`}>
        {samePoint ? (
          <p className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"} font-body text-center`}>{t.dragHint}</p>
        ) : dx === 0 ? (
          <div className="text-center space-y-1">
            <p className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"} font-body`}>Δx = 0 → {t.verticalHint}</p>
            <div className="flex items-center justify-center gap-2">
              <InlineMath math="m =" />
              <span className={`text-sm font-body ${isDark ? "text-white/80" : "text-slate-700"}`}>{t.mUndefined}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] ${isDark ? "text-white/40" : "text-slate-400"} font-body w-16 shrink-0`}>{t.formulaLabel}</span>
              <InlineMath math="m = \dfrac{y_2 - y_1}{x_2 - x_1}" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] ${isDark ? "text-white/40" : "text-slate-400"} font-body w-16 shrink-0`}>{t.subsLabel}</span>
              <InlineMath math={`m = ${stepSubs}`} />
            </div>
            {stepSimp && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] ${isDark ? "text-white/40" : "text-slate-400"} font-body w-16 shrink-0`}>{t.calcLabel}</span>
                <InlineMath math={`m = ${stepSimp}`} />
              </div>
            )}
            <div className="bg-violet-500/15 border border-violet-500/35 rounded-lg px-3 py-2 flex items-center justify-center gap-2">
              <span className={`text-xs ${isDark ? "text-white/50" : "text-slate-400"} font-body`}>{t.resultLabel}</span>
              <span className="text-base font-bold">
                <InlineMath math={`m = ${mResult}`} />
              </span>
              <span className={`text-xs font-bold font-body ml-1 ${dy / dx > 0 ? "text-green-400" : dy === 0 ? (isDark ? "text-white/50" : "text-slate-400") : "text-red-400"}`}>
                {dy / dx > 0 ? t.positive : dy === 0 ? t.horizontal : t.negative}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
