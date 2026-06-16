import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";

/* ─── Grid ─────────────────────────────────────────────── */
const CELL = 24;
const HALF = 5;
const PAD  = 22;
const GW   = PAD * 2 + HALF * 2 * CELL;   // 284
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

/* Convert a decimal-ish m slider value to LaTeX */
function mToLatex(m: number): string {
  const n = Math.round(m * 2);
  return frac(n, 2);
}
function mToNum(m: number): number { return m; }

/* Line clip to grid box [-HALF,HALF]×[-HALF,HALF] */
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
      {/* axis numbers */}
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

/* ─────────────────────────── TAB 1: y = mx + c ────────── */
function TabYMXC() {
  const [m, setM] = useState(1.5);
  const [c, setC] = useState(1);

  const line = clipLine(m, c);
  /* triangle at x=0→1: shows Δx=1, Δy=m */
  const tx0 = toSX(0), ty0 = toSY(c);
  const tx1 = toSX(1), ty1 = toSY(c);      // horizontal foot
  const tx2 = toSX(1), ty2 = toSY(c + m);  // point P₂(1, m+c)
  const mDisplay = mToLatex(m);
  const cAbs = Math.abs(c);
  const cSign = c < 0 ? "-" : "+";

  return (
    <div className="space-y-4">
      {/* WHY explanation */}
      <div className="space-y-2 text-sm font-body text-white/75 leading-relaxed">
        <p>
          Persamaan <InlineMath math="y = mx + c" /> langsung memberitahu kita gradiennya
          karena kita bisa hitung <InlineMath math="\Delta y / \Delta x" /> dari <em>sembarang</em> dua titik:
        </p>
        <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-3 space-y-1 text-xs">
          <p className="text-white/50">Ambil P₁(x₁, y₁) dan P₂(x₂, y₂) di garis yang sama:</p>
          <BlockMath math="\frac{y_2 - y_1}{x_2 - x_1} = \frac{(mx_2+c)-(mx_1+c)}{x_2-x_1} = \frac{m(x_2-x_1)}{x_2-x_1} = m \checkmark" />
        </div>
        <p className="text-xs text-white/50">
          Nilai <InlineMath math="c" /> ikut menghilang — gradien tidak bergantung pada posisi vertikal garis.
        </p>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-xl p-3 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-cyan-300 font-bold font-body">m (gradien)</span>
            <span className="text-xs font-bold text-white"><InlineMath math={mDisplay} /></span>
          </div>
          <input type="range" min={-3} max={3} step={0.5} value={m}
            onChange={e => setM(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-white/30"><span>-3</span><span>3</span></div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-amber-300 font-bold font-body">c (konstanta)</span>
            <span className="text-xs font-bold text-white">{c}</span>
          </div>
          <input type="range" min={-4} max={4} step={1} value={c}
            onChange={e => setC(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-white/30"><span>-4</span><span>4</span></div>
        </div>
      </div>

      {/* Live equation */}
      <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-3 text-center">
        <BlockMath math={`y = ${mDisplay}\\,x ${cSign} ${cAbs}`} />
        <p className="text-xs text-cyan-300 font-body mt-1">
          Gradien garis ini = <strong><InlineMath math={`m = ${mDisplay}`} /></strong>
        </p>
      </div>

      {/* SVG */}
      <svg viewBox={`0 0 ${GW} ${GH}`} width="100%"
        style={{ background: "rgba(10,18,35,0.90)", borderRadius: 12 }}>
        <GridBase />

        {/* Line */}
        {line && (
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        )}

        {/* Triangle Δx=1 Δy=m at x=0→1 */}
        {Math.abs(m) <= HALF && c > -HALF && c < HALF && (
          <>
            {/* datar: (0,c) → (1,c) */}
            <line x1={tx0} y1={ty0} x2={tx1} y2={ty1}
              stroke="#4ade80" strokeWidth="2" strokeDasharray="4,2" opacity="0.9" />
            {/* tegak: (1,c) → (1,c+m) */}
            <line x1={tx1} y1={ty1} x2={tx2} y2={ty2}
              stroke="#f472b6" strokeWidth="2" strokeDasharray="4,2" opacity="0.9" />
            <text x={tx1 + 6} y={(ty1 + ty2) / 2 + 3}
              fill="#f472b6" fontSize="9" fontWeight="bold">m</text>
            <text x={(tx0 + tx1) / 2} y={ty0 + (m >= 0 ? 11 : -4)}
              fill="#4ade80" fontSize="9" fontWeight="bold" textAnchor="middle">1</text>
            {/* right angle mark */}
            <polyline
              points={`${tx1 - 5},${ty1} ${tx1 - 5},${ty1 + (m >= 0 ? -5 : 5)} ${tx1},${ty1 + (m >= 0 ? -5 : 5)}`}
              fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
          </>
        )}

        {/* y-intercept dot */}
        <circle cx={toSX(0)} cy={toSY(c)} r="5" fill="#fbbf24" stroke="white" strokeWidth="1.5" />
        <text x={toSX(0) + 8} y={toSY(c) - 5}
          fill="#fbbf24" fontSize="9" fontWeight="bold">(0, {c})</text>
      </svg>
    </div>
  );
}

/* ─────────────────────────── TAB 2: ax + by = c ────────── */
function TabAxBy() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(6);

  const bZero = b === 0;
  const slope = bZero ? null : -a / b;
  const yInt  = bZero ? 0 : c / b;
  const line  = clipLine(slope, yInt);

  const mLatex   = bZero ? "\\text{tdk terdefinisi}" : frac(-a, b);
  const mNum     = bZero ? null : fracVal(-a, b);
  const cBLatex  = bZero ? "" : frac(c, b);

  /* live steps */
  const signA = a < 0 ? "+" : "-";
  const absA  = Math.abs(a);
  const step1 = `${a}x + ${b}y = ${c}`;
  const step2 = `${b}y = ${signA}${absA}x + ${c}`;
  const step3 = bZero
    ? "b = 0 \\Rightarrow \\text{tidak bisa dibagi}"
    : `y = \\dfrac{${-a}}{${b}}x + \\dfrac{${c}}{${b}}`;
  const step4 = bZero ? "" : `y = ${mLatex}\\,x + ${cBLatex}`;

  const gradColor = mNum === null ? "#fff" : mNum > 0 ? "#4ade80" : mNum < 0 ? "#f87171" : "#94a3b8";

  return (
    <div className="space-y-4">
      {/* WHY explanation */}
      <div className="space-y-2 text-sm font-body text-white/75 leading-relaxed">
        <p>
          Bentuk <InlineMath math="ax + by = c" /> tidak langsung terlihat gradiennya.
          Caranya: <strong className="text-violet-300">ubah dulu ke bentuk y = mx + c</strong>.
        </p>
        <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-3 text-xs space-y-1">
          <BlockMath math="ax + by = c \;\Rightarrow\; by = -ax + c \;\Rightarrow\; y = \underbrace{-\frac{a}{b}}_{m}x + \frac{c}{b}" />
        </div>
        <p className="text-xs text-white/50">
          Jadi gradiennya pasti <InlineMath math="m = -\dfrac{a}{b}" /> — tandanya <em>terbalik</em> dari koefisien <InlineMath math="a" />.
        </p>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "a", val: a, set: setA, color: "text-orange-300", accent: "accent-orange-400" },
          { label: "b", val: b, set: setB, color: "text-violet-300", accent: "accent-violet-400" },
          { label: "c", val: c, set: setC, color: "text-teal-300",   accent: "accent-teal-400"   },
        ].map(({ label, val, set, color, accent }) => (
          <div key={label} className="bg-slate-800/50 rounded-xl p-2.5 space-y-1">
            <div className="flex justify-between">
              <span className={`text-xs font-bold font-body ${color}`}>{label}</span>
              <span className="text-xs font-bold text-white">{val}</span>
            </div>
            <input type="range" min={label === "b" ? -4 : -6} max={label === "b" ? 4 : 6} step={1} value={val}
              onChange={e => set(Number(e.target.value))}
              className={`w-full ${accent} cursor-pointer`} />
          </div>
        ))}
      </div>

      {/* Live conversion steps */}
      <div className="bg-slate-800/60 border border-violet-500/30 rounded-xl p-3 space-y-2">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-wide">Langkah konversi</p>
        <div className="space-y-1 text-sm">
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-white/35 w-12 shrink-0">Awal:</span>
            <InlineMath math={`${a}x + (${b})y = ${c}`} />
          </div>
          {!bZero && (
            <>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-white/35 w-12 shrink-0">Pindah ax:</span>
                <InlineMath math={`(${b})y = ${-a}x + ${c}`} />
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-white/35 w-12 shrink-0">Bagi b:</span>
                <InlineMath math={step4} />
              </div>
            </>
          )}
          {bZero && (
            <p className="text-xs text-red-400 font-body">b = 0 → garis vertikal, gradien tidak terdefinisi</p>
          )}
        </div>
      </div>

      {/* Result */}
      {!bZero && (
        <div className="rounded-xl p-3 text-center border"
          style={{ background: "rgba(139,92,246,0.12)", borderColor: "rgba(139,92,246,0.35)" }}>
          <InlineMath math={`m = -\\frac{a}{b} = -\\frac{${a}}{${b}} = ${mLatex}`} />
          <p className="text-xs font-body mt-1" style={{ color: gradColor }}>
            {mNum !== null && (mNum > 0 ? "Gradien positif (↗)" : mNum < 0 ? "Gradien negatif (↘)" : "Gradien nol — garis horizontal (→)")}
          </p>
        </div>
      )}

      {/* SVG */}
      <svg viewBox={`0 0 ${GW} ${GH}`} width="100%"
        style={{ background: "rgba(10,18,35,0.90)", borderRadius: 12 }}>
        <GridBase />
        {line && !bZero && (
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        )}
        {bZero && (
          /* vertical line x = c/a */
          (() => {
            const xv = a !== 0 ? c / a : 0;
            if (xv < -HALF || xv > HALF) return null;
            return <line x1={toSX(xv)} y1={PAD} x2={toSX(xv)} y2={GH - PAD}
              stroke="#a78bfa" strokeWidth="2.5" opacity="0.9" />;
          })()
        )}
        {/* y-intercept */}
        {!bZero && yInt >= -HALF && yInt <= HALF && (
          <>
            <circle cx={toSX(0)} cy={toSY(yInt)} r="5" fill="#a78bfa" stroke="white" strokeWidth="1.5" />
            <text x={toSX(0) + 8} y={toSY(yInt) - 5} fill="#a78bfa" fontSize="9" fontWeight="bold">
              (0, {frac(c, b).replace("\\dfrac", "").replace("{", "").replace("}", "/").replace("}", "")})
            </text>
          </>
        )}
        {/* equation label on grid */}
        <text x={PAD + 4} y={PAD + 13} fill="#94a3b8" fontSize="9" fontStyle="italic">
          {a}x + {b}y = {c}
        </text>
      </svg>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function GradienPersamaanInteraktif() {
  const [tab, setTab] = useState<"ymxc" | "axby">("ymxc");

  return (
    <div className="space-y-4">
      {/* Tab buttons */}
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

      {tab === "ymxc" ? <TabYMXC /> : <TabAxBy />}
    </div>
  );
}
