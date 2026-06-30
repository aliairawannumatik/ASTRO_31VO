import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const CELL = 24;
const HALF = 5;
const PAD  = 22;
const GW   = PAD * 2 + HALF * 2 * CELL;
const GH   = GW;

const toSX = (mx: number) => PAD + (mx + HALF) * CELL;
const toSY = (my: number) => PAD + (HALF - my) * CELL;

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}
function frac(n: number, d: number): string {
  const g = gcd(Math.abs(n), Math.abs(d));
  const sn = n / g, sd = d / g;
  const [fn, fd] = sd < 0 ? [-sn, -sd] : [sn, sd];
  if (fd === 1) return String(fn);
  const sign = fn * fd < 0 ? "-" : "";
  return `${sign}\\dfrac{${Math.abs(fn)}}{${Math.abs(fd)}}`;
}
function fracVal(n: number, d: number): number { return n / d; }

function mToLatex(m: number): string {
  const n = Math.round(m * 2);
  return frac(n, 2);
}

function clipLine(slope: number | null, yInt: number): { x1: number; y1: number; x2: number; y2: number } | null {
  if (slope === null) return null;
  const pts: [number, number][] = [];
  const tryAdd = (x: number, y: number) => {
    if (x >= -HALF - 0.01 && x <= HALF + 0.01 && y >= -HALF - 0.01 && y <= HALF + 0.01) pts.push([x, y]);
  };
  tryAdd(-HALF, slope * -HALF + yInt);
  tryAdd( HALF, slope *  HALF + yInt);
  const xAtTop    = yInt !== undefined ? (HALF - yInt) / (slope || 1)  : 0;
  const xAtBottom = yInt !== undefined ? (-HALF - yInt) / (slope || 1) : 0;
  if (slope !== 0) { tryAdd(xAtTop, HALF); tryAdd(xAtBottom, -HALF); }
  const uniq = pts.filter((p, i) => pts.findIndex(q => Math.abs(q[0]-p[0]) < 0.01 && Math.abs(q[1]-p[1]) < 0.01) === i);
  if (uniq.length < 2) return null;
  return { x1: toSX(uniq[0][0]), y1: toSY(uniq[0][1]), x2: toSX(uniq[1][0]), y2: toSY(uniq[1][1]) };
}

function GridBase() {
  return (
    <>
      {Array.from({ length: HALF * 2 + 1 }, (_, i) => (
        <g key={i}>
          <line x1={PAD + i * CELL} y1={PAD} x2={PAD + i * CELL} y2={GH - PAD} stroke="#1a2744" strokeWidth="1" />
          <line x1={PAD} y1={PAD + i * CELL} x2={GW - PAD} y2={PAD + i * CELL} stroke="#1a2744" strokeWidth="1" />
        </g>
      ))}
      <line x1={PAD} y1={toSY(0)} x2={GW - PAD} y2={toSY(0)} stroke="#334155" strokeWidth="1.5" />
      <line x1={toSX(0)} y1={PAD} x2={toSX(0)} y2={GH - PAD} stroke="#334155" strokeWidth="1.5" />
      {[-4,-3,-2,-1,1,2,3,4].map(v => (
        <g key={v}>
          <text x={toSX(v)} y={toSY(0) + 11} fill="#475569" fontSize="7.5" textAnchor="middle">{v}</text>
          <text x={toSX(0) - 7} y={toSY(v) + 3} fill="#475569" fontSize="7.5" textAnchor="end">{v}</text>
        </g>
      ))}
      <text x={GW - PAD + 2} y={toSY(0) + 4} fill="#475569" fontSize="8">x</text>
      <text x={toSX(0) + 3}  y={PAD - 4}     fill="#475569" fontSize="8">y</text>
    </>
  );
}

const T_YMXC = {
  id: {
    why1: "Persamaan",
    why2: "langsung memberitahu kita gradiennya karena kita bisa hitung",
    why3: "dari",
    why4: "sembarang",
    why5: "dua titik:",
    proof: "Ambil P₁(x₁, y₁) dan P₂(x₂, y₂) di garis yang sama:",
    note: "Nilai",
    note2: "ikut menghilang — gradien tidak bergantung pada posisi vertikal garis.",
    mLabel: "m (gradien)",
    cLabel: "c (konstanta)",
    gradInfo: "Gradien garis ini =",
  },
  en: {
    why1: "The equation",
    why2: "directly reveals the gradient because we can compute",
    why3: "from",
    why4: "any",
    why5: "two points:",
    proof: "Take P₁(x₁, y₁) and P₂(x₂, y₂) on the same line:",
    note: "The value",
    note2: "cancels out — the gradient does not depend on the vertical position of the line.",
    mLabel: "m (gradient)",
    cLabel: "c (constant)",
    gradInfo: "Gradient of this line =",
  },
  ja: {
    why1: "方程式",
    why2: "は傾きを直接教えてくれます。なぜなら",
    why3: "を",
    why4: "任意の",
    why5: "2点で計算できるからです：",
    proof: "同じ直線上の P₁(x₁, y₁) と P₂(x₂, y₂) を取ると：",
    note: "値",
    note2: "は消える — 傾きは直線の縦位置に依存しない。",
    mLabel: "m（傾き）",
    cLabel: "c（定数）",
    gradInfo: "この直線の傾き =",
  },
};

const T_AXBY = {
  id: {
    why1: "Bentuk",
    why2: "tidak langsung terlihat gradiennya. Caranya:",
    why3: "ubah dulu ke bentuk y = mx + c",
    proof: "Jadi gradiennya pasti",
    proof2: "— tandanya",
    proof3: "terbalik",
    proof4: "dari koefisien",
    sliderA: "a",
    sliderB: "b",
    sliderC: "c",
    convTitle: "Langkah konversi",
    stepInit: "Awal:",
    stepMove: "Pindah ax:",
    stepDiv: "Bagi b:",
    vertMsg: "b = 0 → garis vertikal, gradien tidak terdefinisi",
    posGrad: "Gradien positif (↗)",
    negGrad: "Gradien negatif (↘)",
    zeroGrad: "Gradien nol — garis horizontal (→)",
  },
  en: {
    why1: "The form",
    why2: "does not show the gradient directly. The method:",
    why3: "convert to y = mx + c first",
    proof: "So the gradient must be",
    proof2: "— its sign is",
    proof3: "opposite",
    proof4: "to the coefficient",
    sliderA: "a",
    sliderB: "b",
    sliderC: "c",
    convTitle: "Conversion steps",
    stepInit: "Start:",
    stepMove: "Move ax:",
    stepDiv: "Divide b:",
    vertMsg: "b = 0 → vertical line, gradient undefined",
    posGrad: "Positive gradient (↗)",
    negGrad: "Negative gradient (↘)",
    zeroGrad: "Zero gradient — horizontal line (→)",
  },
  ja: {
    why1: "形",
    why2: "は傾きが直接わかりません。方法：",
    why3: "まず y = mx + c に変換する",
    proof: "よって傾きは",
    proof2: "— 符号は係数",
    proof3: "の逆",
    proof4: "",
    sliderA: "a",
    sliderB: "b",
    sliderC: "c",
    convTitle: "変換の手順",
    stepInit: "開始：",
    stepMove: "ax を移項：",
    stepDiv: "b で割る：",
    vertMsg: "b = 0 → 垂直線、傾き未定義",
    posGrad: "正の傾き (↗)",
    negGrad: "負の傾き (↘)",
    zeroGrad: "傾き = 0 — 水平線 (→)",
  },
};

function TabYMXC({ language }: { language: "id" | "en" | "ja" }) {
  const [m, setM] = useState(1.5);
  const [c, setC] = useState(1);
  const tl = T_YMXC[language];

  const line = clipLine(m, c);
  const tx0 = toSX(0), ty0 = toSY(c);
  const tx1 = toSX(1), ty1 = toSY(c);
  const tx2 = toSX(1), ty2 = toSY(c + m);
  const mDisplay = mToLatex(m);
  const cAbs = Math.abs(c);
  const cSign = c < 0 ? "-" : "+";

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm font-body text-white/75 leading-relaxed">
        <p>
          {tl.why1} <InlineMath math="y = mx + c" /> {tl.why2}{" "}
          <InlineMath math="\Delta y / \Delta x" /> {tl.why3} <em>{tl.why4}</em> {tl.why5}
        </p>
        <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-3 space-y-1 text-xs">
          <p className="text-white/50">{tl.proof}</p>
          <BlockMath math="\frac{y_2 - y_1}{x_2 - x_1} = \frac{(mx_2+c)-(mx_1+c)}{x_2-x_1} = \frac{m(x_2-x_1)}{x_2-x_1} = m \checkmark" />
        </div>
        <p className="text-xs text-white/50">
          {tl.note} <InlineMath math="c" /> {tl.note2}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-xl p-3 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-cyan-300 font-bold font-body">{tl.mLabel}</span>
            <span className="text-xs font-bold text-white"><InlineMath math={mDisplay} /></span>
          </div>
          <input type="range" min={-3} max={3} step={0.5} value={m}
            onChange={e => setM(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-white/30"><span>-3</span><span>3</span></div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-amber-300 font-bold font-body">{tl.cLabel}</span>
            <span className="text-xs font-bold text-white">{c}</span>
          </div>
          <input type="range" min={-4} max={4} step={1} value={c}
            onChange={e => setC(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-white/30"><span>-4</span><span>4</span></div>
        </div>
      </div>

      <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-3 text-center">
        <BlockMath math={`y = ${mDisplay}\\,x ${cSign} ${cAbs}`} />
        <p className="text-xs text-cyan-300 font-body mt-1">
          {tl.gradInfo} <strong><InlineMath math={`m = ${mDisplay}`} /></strong>
        </p>
      </div>

      <svg viewBox={`0 0 ${GW} ${GH}`} width="100%"
        style={{ background: "rgba(10,18,35,0.90)", borderRadius: 12 }}>
        <GridBase />
        {line && (
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        )}
        {Math.abs(m) <= HALF && c > -HALF && c < HALF && (
          <>
            <line x1={tx0} y1={ty0} x2={tx1} y2={ty1}
              stroke="#4ade80" strokeWidth="2" strokeDasharray="4,2" opacity="0.9" />
            <line x1={tx1} y1={ty1} x2={tx2} y2={ty2}
              stroke="#f472b6" strokeWidth="2" strokeDasharray="4,2" opacity="0.9" />
            <text x={tx1 + 6} y={(ty1 + ty2) / 2 + 3}
              fill="#f472b6" fontSize="9" fontWeight="bold">m</text>
            <text x={(tx0 + tx1) / 2} y={ty0 + (m >= 0 ? 11 : -4)}
              fill="#4ade80" fontSize="9" fontWeight="bold" textAnchor="middle">1</text>
            <polyline
              points={`${tx1 - 5},${ty1} ${tx1 - 5},${ty1 + (m >= 0 ? -5 : 5)} ${tx1},${ty1 + (m >= 0 ? -5 : 5)}`}
              fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
          </>
        )}
        <circle cx={toSX(0)} cy={toSY(c)} r="5" fill="#fbbf24" stroke="white" strokeWidth="1.5" />
        <text x={toSX(0) + 8} y={toSY(c) - 5}
          fill="#fbbf24" fontSize="9" fontWeight="bold">(0, {c})</text>
      </svg>
    </div>
  );
}

function TabAxBy({ language }: { language: "id" | "en" | "ja" }) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(6);
  const tl = T_AXBY[language];

  const bZero = b === 0;
  const slope = bZero ? null : -a / b;
  const yInt  = bZero ? 0 : c / b;
  const line  = clipLine(slope, yInt);

  const mLatexStr   = bZero ? "\\nexists" : frac(-a, b);
  const mNum        = bZero ? null : fracVal(-a, b);
  const cBLatex     = bZero ? "" : frac(c, b);

  const signA = a < 0 ? "+" : "-";
  const absA  = Math.abs(a);
  const step4 = bZero ? "" : `y = ${mLatexStr}\\,x + ${cBLatex}`;

  const gradColor = mNum === null ? "#fff" : mNum > 0 ? "#4ade80" : mNum < 0 ? "#f87171" : "#94a3b8";

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm font-body text-white/75 leading-relaxed">
        <p>
          {tl.why1} <InlineMath math="ax + by = c" /> {tl.why2}{" "}
          <strong className="text-violet-300">{tl.why3}</strong>.
        </p>
        <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-3 text-xs space-y-1">
          <BlockMath math="ax + by = c \;\Rightarrow\; by = -ax + c \;\Rightarrow\; y = \underbrace{-\frac{a}{b}}_{m}x + \frac{c}{b}" />
        </div>
        <p className="text-xs text-white/50">
          {tl.proof} <InlineMath math="m = -\dfrac{a}{b}" /> {tl.proof2}{" "}
          <em>{tl.proof3}</em> {tl.proof4} <InlineMath math="a" />.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: tl.sliderA, val: a, set: setA, color: "text-orange-300", accent: "accent-orange-400", key: "a" },
          { label: tl.sliderB, val: b, set: setB, color: "text-violet-300", accent: "accent-violet-400", key: "b" },
          { label: tl.sliderC, val: c, set: setC, color: "text-teal-300",   accent: "accent-teal-400",   key: "c" },
        ].map(({ label, val, set, color, accent, key }) => (
          <div key={key} className="bg-slate-800/50 rounded-xl p-2.5 space-y-1">
            <div className="flex justify-between">
              <span className={`text-xs font-bold font-body ${color}`}>{label}</span>
              <span className="text-xs font-bold text-white">{val}</span>
            </div>
            <input type="range" min={key === "b" ? -4 : -6} max={key === "b" ? 4 : 6} step={1} value={val}
              onChange={e => set(Number(e.target.value))}
              className={`w-full ${accent} cursor-pointer`} />
          </div>
        ))}
      </div>

      <div className="bg-slate-800/60 border border-violet-500/30 rounded-xl p-3 space-y-2">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-wide">{tl.convTitle}</p>
        <div className="space-y-1 text-sm">
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-white/35 w-16 shrink-0">{tl.stepInit}</span>
            <InlineMath math={`${a}x + (${b})y = ${c}`} />
          </div>
          {!bZero && (
            <>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-white/35 w-16 shrink-0">{tl.stepMove}</span>
                <InlineMath math={`(${b})y = ${-a}x + ${c}`} />
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-white/35 w-16 shrink-0">{tl.stepDiv}</span>
                <InlineMath math={step4} />
              </div>
            </>
          )}
          {bZero && (
            <p className="text-xs text-red-400 font-body">{tl.vertMsg}</p>
          )}
        </div>
      </div>

      {!bZero && (
        <div className="rounded-xl p-3 text-center border"
          style={{ background: "rgba(139,92,246,0.12)", borderColor: "rgba(139,92,246,0.35)" }}>
          <InlineMath math={`m = -\\frac{a}{b} = -\\frac{${a}}{${b}} = ${mLatexStr}`} />
          <p className="text-xs font-body mt-1" style={{ color: gradColor }}>
            {mNum !== null && (mNum > 0 ? tl.posGrad : mNum < 0 ? tl.negGrad : tl.zeroGrad)}
          </p>
        </div>
      )}

      <svg viewBox={`0 0 ${GW} ${GH}`} width="100%"
        style={{ background: "rgba(10,18,35,0.90)", borderRadius: 12 }}>
        <GridBase />
        {line && !bZero && (
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        )}
        {bZero && (
          (() => {
            const xv = a !== 0 ? c / a : 0;
            if (xv < -HALF || xv > HALF) return null;
            return <line x1={toSX(xv)} y1={PAD} x2={toSX(xv)} y2={GH - PAD}
              stroke="#a78bfa" strokeWidth="2.5" opacity="0.9" />;
          })()
        )}
        {!bZero && yInt >= -HALF && yInt <= HALF && (
          <>
            <circle cx={toSX(0)} cy={toSY(yInt)} r="5" fill="#a78bfa" stroke="white" strokeWidth="1.5" />
            <text x={toSX(0) + 8} y={toSY(yInt) - 5} fill="#a78bfa" fontSize="9" fontWeight="bold">
              (0, {frac(c, b).replace("\\dfrac", "").replace("{", "").replace("}", "/").replace("}", "")})
            </text>
          </>
        )}
        <text x={PAD + 4} y={PAD + 13} fill="#94a3b8" fontSize="9" fontStyle="italic">
          {a}x + {b}y = {c}
        </text>
      </svg>
    </div>
  );
}

export default function GradienPersamaanInteraktif() {
  const { language } = useLanguage();
  const [tab, setTab] = useState<"ymxc" | "axby">("ymxc");

  return (
    <div className="space-y-4">
      <div className="flex rounded-xl overflow-hidden border border-slate-700">
        <button
          onClick={() => setTab("ymxc")}
          className={`flex-1 py-2.5 text-sm font-body font-semibold transition-colors ${
            tab === "ymxc"
              ? "bg-cyan-600/30 text-cyan-300 border-r border-slate-700"
              : "bg-slate-800/40 text-white/40 border-r border-slate-700 hover:text-white/70"
          }`}
        >
          y = mx + c
        </button>
        <button
          onClick={() => setTab("axby")}
          className={`flex-1 py-2.5 text-sm font-body font-semibold transition-colors ${
            tab === "axby"
              ? "bg-violet-600/30 text-violet-300"
              : "bg-slate-800/40 text-white/40 hover:text-white/70"
          }`}
        >
          ax + by = c
        </button>
      </div>

      {tab === "ymxc" ? <TabYMXC language={language} /> : <TabAxBy language={language} />}
    </div>
  );
}
