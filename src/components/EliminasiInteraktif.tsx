import React, { useState, useRef } from "react";
import { BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import { Play, RotateCcw, Zap, ChevronRight, ChevronLeft } from "lucide-react";
import "katex/dist/katex.min.css";

// ── Math helpers ──────────────────────────────────────────────────────────────

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = b; b = a % b; a = t; }
  return a || 1;
}
function lcm(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  return (a * b) / gcd(a, b);
}
function red(n: number, d: number): [number, number] {
  if (d === 0) return [NaN, 1];
  const g = gcd(Math.abs(n), Math.abs(d));
  const s = d < 0 ? -1 : 1;
  return [(s * n) / g, Math.abs(d) / g];
}
function ft([n, d]: [number, number]): string {
  if (isNaN(n)) return "\\varnothing";
  return d === 1 ? `${n}` : `\\dfrac{${n}}{${d}}`;
}
function lhsTex(a: number, b: number): string {
  let s = "";
  if (a !== 0) s += a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  if (b !== 0) {
    if (s) s += b > 0 ? ` + ${b === 1 ? "y" : `${b}y`}` : ` - ${Math.abs(b) === 1 ? "y" : `${Math.abs(b)}y`}`;
    else s += b === 1 ? "y" : b === -1 ? "-y" : `${b}y`;
  }
  return s || "0";
}
function eqTex(a: number, b: number, c: number) { return `${lhsTex(a, b)} = ${c}`; }

// ── Parser ────────────────────────────────────────────────────────────────────

function parseEq(s: string): { a: number; b: number; c: number } | null {
  const clean = s.replace(/\s+/g, "").toLowerCase();
  const parts = clean.split("=");
  if (parts.length !== 2) return null;
  const c = parseFloat(parts[1]);
  if (isNaN(c)) return null;
  const lhs = parts[0];
  const norm = lhs[0] !== "-" && lhs[0] !== "+" ? "+" + lhs : lhs;
  const re = /[+-][0-9]*\.?[0-9]*[xy]/g;
  let a = 0, b = 0, found = false;
  let m: RegExpExecArray | null;
  while ((m = re.exec(norm)) !== null) {
    found = true;
    const tok = m[0];
    const v = tok[tok.length - 1];
    const ns = tok.slice(0, -1);
    const coeff = ns === "+" || ns === "" ? 1 : ns === "-" ? -1 : parseFloat(ns);
    if (v === "x") a = coeff; else b = coeff;
  }
  return found ? { a, b, c } : null;
}

// ── Elimination row data ───────────────────────────────────────────────────────

interface ERow {
  label: string;   // e.g. "P1×2"
  a: number; b: number; c: number;
}

interface ElimBlock {
  title: string;
  row1: ERow;
  row2: ERow;
  op: "+" | "-";   // which operation eliminates the variable
  elimVar: "x" | "y";
  resultA: number; // coefficient of surviving var
  resultC: number; // rhs after operation
  solveVar: "x" | "y";
  solveFrac: [number, number];
  color: string;
}

// Build one elimination pass: eliminate `elimVar`, solve for `solveVar`
function buildElimBlock(
  a1: number, b1: number, c1: number,
  a2: number, b2: number, c2: number,
  elimVar: "x" | "y",
  color: string
): ElimBlock | null {
  const src1 = elimVar === "x" ? a1 : b1;
  const src2 = elimVar === "x" ? a2 : b2;
  if (src1 === 0 || src2 === 0) return null;

  const L = lcm(Math.abs(src1), Math.abs(src2));
  const m1 = L / Math.abs(src1);
  const m2 = L / Math.abs(src2);

  const new1 = src1 * m1; // will be ±L
  const new2 = src2 * m2; // will be ±L

  // Same sign → subtract (new1 - new2 = 0); opposite sign → add (new1 + new2 = 0)
  const op: "+" | "-" = (new1 * new2 > 0) ? "-" : "+";
  const sign = op === "-" ? 1 : 1; // kept for clarity

  const r1: ERow = {
    label: m1 === 1 ? "P1" : `P1×${m1}`,
    a: a1 * m1, b: b1 * m1, c: c1 * m1,
  };
  const r2: ERow = {
    label: m2 === 1 ? "P2" : `P2×${m2}`,
    a: a2 * m2, b: b2 * m2, c: c2 * m2,
  };

  const resultA = op === "-"
    ? (elimVar === "x" ? b1 * m1 - b2 * m2 : a1 * m1 - a2 * m2)
    : (elimVar === "x" ? b1 * m1 + b2 * m2 : a1 * m1 + a2 * m2);
  const resultC = op === "-" ? c1 * m1 - c2 * m2 : c1 * m1 + c2 * m2;

  const solveFrac = red(resultC, resultA);
  const solveVar: "x" | "y" = elimVar === "x" ? "y" : "x";

  return { title: `Eliminasi ${elimVar} → cari ${solveVar}`, row1: r1, row2: r2, op, elimVar, resultA, resultC, solveFrac, solveVar, color };
}

// ── Step types ────────────────────────────────────────────────────────────────

interface NormalStep {
  kind: "normal";
  title: string;
  lines: string[];
  note?: string;
  color: string;
  isAnswer?: boolean;
}
interface ElimStep {
  kind: "elim";
  block: ElimBlock;
}
type SolStep = NormalStep | ElimStep;

// ── Visual Elimination Table ──────────────────────────────────────────────────

function termStr(coeff: number, varName: string): string {
  if (coeff === 0) return "0";
  if (Math.abs(coeff) === 1) return coeff > 0 ? varName : `-${varName}`;
  return `${coeff}${varName}`;
}

const ElimTable: React.FC<{ block: ElimBlock; visible: boolean }> = ({ block, visible }) => {
  const { row1, row2, op, elimVar, resultA, resultC, solveFrac, solveVar } = block;

  const cellBase = "px-2 py-1.5 text-center font-mono text-sm tabular-nums";
  const deadCell = `${cellBase} line-through text-red-400/60`; // eliminated column
  const liveCell = `${cellBase} text-emerald-300 font-bold`;
  const dimCell  = `${cellBase} text-white/40`;
  const resultElim = `${cellBase} text-slate-600 font-bold`; // "0" for eliminated
  const resultLive = `${cellBase} text-yellow-300 font-bold text-base`; // solved value

  // Row data
  const xDead = elimVar === "x";

  const renderRow = (row: ERow, isRow2: boolean) => (
    <div className={`flex items-center gap-1 ${isRow2 ? "border-b border-white/20 pb-1" : ""}`}>
      <div className="w-14 shrink-0 text-right pr-2">
        <span className="text-white/30 text-[11px] font-body">{isRow2 ? `${op === "-" ? "−" : "+"} ${row.label}` : row.label}</span>
      </div>
      <span className={xDead ? deadCell : liveCell}>{termStr(row.a, "x")}</span>
      <span className={dimCell}>+</span>
      <span className={xDead ? liveCell : deadCell}>{termStr(row.b, "y")}</span>
      <span className={dimCell}>=</span>
      <span className={`${cellBase} text-white/80`}>{row.c}</span>
    </div>
  );

  const solveTex = solveFrac[1] === 1
    ? `${solveVar} = \\dfrac{${resultC}}{${resultA}} = ${ft(solveFrac)}`
    : `${solveVar} = \\dfrac{${resultC}}{${resultA}} = ${ft(solveFrac)}`;

  return (
    <div className={`space-y-2 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>

      {/* Title pill */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="font-body text-sm font-bold text-white">{block.title}</p>
      </div>

      {/* Multiplier hint */}
      {(row1.label !== "P1" || row2.label !== "P2") && (
        <p className="font-body text-xs text-white/50">
          {row1.label !== "P1" ? `Kalikan P1 dengan ${row1.label.replace("P1×", "")}` : "P1 tetap"}
          {" · "}
          {row2.label !== "P2" ? `kalikan P2 dengan ${row2.label.replace("P2×", "")}` : "P2 tetap"}
          {" → koefisien "}{elimVar}{" menjadi sama"}
        </p>
      )}

      {/* The visual operation table */}
      <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 space-y-0.5">
        {/* Header */}
        <div className="flex items-center gap-1 mb-1">
          <div className="w-14" />
          <span className={`${cellBase} text-[10px] uppercase ${xDead ? "text-red-400/50" : "text-white/30"}`}>x</span>
          <span className="w-3" />
          <span className={`${cellBase} text-[10px] uppercase ${!xDead ? "text-red-400/50" : "text-white/30"}`}>y</span>
          <span className="w-3" />
          <span className={`${cellBase} text-[10px] uppercase text-white/30`}>rhs</span>
        </div>

        {/* Row 1 */}
        {renderRow(row1, false)}

        {/* Row 2 (with op prefix and underline) */}
        {renderRow(row2, true)}

        {/* Result row */}
        <div className="flex items-center gap-1 pt-1">
          <div className="w-14 shrink-0 text-right pr-2">
            <span className="text-white/30 text-[11px] font-body">Hasil</span>
          </div>
          <span className={xDead ? resultElim : resultLive}>
            {xDead ? "0" : termStr(resultA, "x")}
          </span>
          <span className={dimCell}>+</span>
          <span className={xDead ? resultLive : resultElim}>
            {xDead ? termStr(resultA, "y") : "0"}
          </span>
          <span className={dimCell}>=</span>
          <span className={`${cellBase} text-yellow-200 font-bold`}>{resultC}</span>
        </div>

        {/* "Variabel X/Y lenyap!" badge */}
        <div className="flex justify-center mt-2">
          <span className="bg-red-900/50 border border-red-500/30 rounded-full px-3 py-0.5 text-[10px] font-body text-red-300">
            🔴 {elimVar} lenyap!  →  tersisa 1 variabel saja
          </span>
        </div>
      </div>

      {/* Solve */}
      <div className="bg-slate-800/50 border border-yellow-500/20 rounded-xl px-4 py-2">
        <BlockMath math={solveTex} />
      </div>
    </div>
  );
};

// ── Step generator ────────────────────────────────────────────────────────────

function generateSteps(
  p1: { a: number; b: number; c: number },
  p2: { a: number; b: number; c: number },
  elimFirst: "x" | "y"
): { steps: SolStep[]; error: string } {

  const elimSecond: "x" | "y" = elimFirst === "x" ? "y" : "x";

  // Check solvability
  const det = p1.a * p2.b - p1.b * p2.a;
  if (det === 0) {
    const check = p1.c * p2.b - p1.b * p2.c;
    return {
      steps: [],
      error: check === 0
        ? "SPLDV ini memiliki TAK HINGGA SOLUSI — kedua persamaan identik (garis berimpit)."
        : "SPLDV ini TIDAK MEMILIKI SOLUSI — kedua garis sejajar.",
    };
  }

  // Check coefficient for elimFirst
  const cf1 = elimFirst === "x" ? p1.a : p1.b;
  const cf2 = elimFirst === "x" ? p2.a : p2.b;
  if (cf1 === 0 || cf2 === 0) {
    return { steps: [], error: `Salah satu persamaan tidak memiliki variabel ${elimFirst}! Pilih variabel lain.` };
  }
  const cs1 = elimSecond === "x" ? p1.a : p1.b;
  const cs2 = elimSecond === "x" ? p2.a : p2.b;
  if (cs1 === 0 || cs2 === 0) {
    return { steps: [], error: `Salah satu persamaan tidak memiliki variabel ${elimSecond}! Pilih variabel lain.` };
  }

  const blockA = buildElimBlock(p1.a, p1.b, p1.c, p2.a, p2.b, p2.c, elimFirst, "border-cyan-500/40 bg-cyan-900/20");
  const blockB = buildElimBlock(p1.a, p1.b, p1.c, p2.a, p2.b, p2.c, elimSecond, "border-violet-500/40 bg-violet-900/20");
  if (!blockA || !blockB) return { steps: [], error: "Gagal menghitung — coba variabel lain." };

  const xFrac = blockB.solveVar === "x" ? blockB.solveFrac : blockA.solveFrac;
  const yFrac = blockB.solveVar === "y" ? blockB.solveFrac : blockA.solveFrac;
  const xVal = xFrac[0] / xFrac[1];
  const yVal = yFrac[0] / yFrac[1];

  const ok1 = Math.abs(p1.a * xVal + p1.b * yVal - p1.c) < 0.0001;
  const ok2 = Math.abs(p2.a * xVal + p2.b * yVal - p2.c) < 0.0001;

  const steps: SolStep[] = [
    // Step 1: System
    {
      kind: "normal",
      title: "Langkah 1 — Tuliskan SPLDV",
      lines: [`\\begin{cases} P1:\\; ${eqTex(p1.a, p1.b, p1.c)} \\\\[4pt] P2:\\; ${eqTex(p2.a, p2.b, p2.c)} \\end{cases}`],
      note: `Strategi: eliminasi ${elimFirst} dulu → dapat ${elimSecond}, lalu eliminasi ${elimSecond} → dapat ${elimFirst}.`,
      color: "border-slate-500/40 bg-slate-800/40",
    },
    // Step 2: Elim blockA (eliminate elimFirst → find elimSecond)
    { kind: "elim", block: blockA },
    // Step 3: Elim blockB (eliminate elimSecond → find elimFirst)
    { kind: "elim", block: blockB },
    // Step 4: Verify
    {
      kind: "normal",
      title: "Langkah 4 — Verifikasi ke kedua persamaan",
      lines: [
        `P1:\\; ${lhsTex(p1.a, p1.b)} = ${p1.a !== 0 ? `${p1.a}\\cdot${ft(xFrac)}` : ""}${p1.b !== 0 ? `${p1.b > 0 && p1.a !== 0 ? "+" : ""}${p1.b}\\cdot${ft(yFrac)}` : ""} = ${p1.c}\\; ${ok1 ? "\\checkmark" : "\\times"}`,
        `P2:\\; ${lhsTex(p2.a, p2.b)} = ${p2.a !== 0 ? `${p2.a}\\cdot${ft(xFrac)}` : ""}${p2.b !== 0 ? `${p2.b > 0 && p2.a !== 0 ? "+" : ""}${p2.b}\\cdot${ft(yFrac)}` : ""} = ${p2.c}\\; ${ok2 ? "\\checkmark" : "\\times"}`,
      ],
      note: ok1 && ok2 ? "Kedua persamaan terpenuhi — solusi valid!" : "⚠️ Ada ketidaksesuaian, periksa input.",
      color: "border-green-500/40 bg-green-900/20",
    },
    // Step 5: Solution
    {
      kind: "normal",
      title: "✅ Solusi SPLDV",
      lines: [`\\boxed{\\; x = ${ft(xFrac)}, \\quad y = ${ft(yFrac)} \\;}`],
      color: "border-yellow-500/40 bg-yellow-900/20",
      isAnswer: true,
    },
  ];

  return { steps, error: "" };
}

// ── Color map ─────────────────────────────────────────────────────────────────

const COLORS: Record<string, { border: string; bg: string; badge: string }> = {
  "border-slate-500/40 bg-slate-800/40":   { border: "border-slate-500/40",   bg: "bg-slate-800/40",   badge: "bg-slate-600 text-white" },
  "border-cyan-500/40 bg-cyan-900/20":     { border: "border-cyan-500/40",     bg: "bg-cyan-900/20",     badge: "bg-cyan-600 text-white" },
  "border-violet-500/40 bg-violet-900/20": { border: "border-violet-500/40",   bg: "bg-violet-900/20",   badge: "bg-violet-600 text-white" },
  "border-green-500/40 bg-green-900/20":   { border: "border-green-500/40",    bg: "bg-green-900/20",    badge: "bg-green-600 text-white" },
  "border-yellow-500/40 bg-yellow-900/20": { border: "border-yellow-500/40",   bg: "bg-yellow-900/20",   badge: "bg-yellow-500 text-black" },
};

// ── Main component ────────────────────────────────────────────────────────────

const EliminasiInteraktif: React.FC = () => {
  const [eq1, setEq1]         = useState("3x + y = 7");
  const [eq2, setEq2]         = useState("x + y = 3");
  const [elimFirst, setElimFirst] = useState<"x" | "y">("y");
  const [eq1Err, setEq1Err]   = useState(false);
  const [eq2Err, setEq2Err]   = useState(false);

  const [steps, setSteps] = useState<SolStep[]>([]);
  const [visibleCount, setVC] = useState(0);
  const [error, setError]     = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const done = visibleCount >= steps.length && steps.length > 0;

  const handleSolve = () => {
    playPopSound();
    const p1 = parseEq(eq1); const p2 = parseEq(eq2);
    let err = false;
    if (!p1) { setEq1Err(true); err = true; } else setEq1Err(false);
    if (!p2) { setEq2Err(true); err = true; } else setEq2Err(false);
    if (err) return;
    const { steps: s, error: e } = generateSteps(p1!, p2!, elimFirst);
    if (e) { setError(e); setSteps([]); setVC(0); return; }
    setError(""); setSteps(s); setVC(1);
  };

  const handleNext = () => {
    playPopSound();
    setVC(c => {
      const next = Math.min(c + 1, steps.length);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
      return next;
    });
  };

  const handlePrev = () => {
    playPopSound();
    setVC(c => Math.max(c - 1, 1));
  };

  const handleReset = () => {
    playPopSound();
    setSteps([]); setVC(0);
    setError(""); setEq1Err(false); setEq2Err(false);
  };

  // Label for the strategy description
  const elimSecond: "x" | "y" = elimFirst === "x" ? "y" : "x";

  return (
    <div className="space-y-4">

      {/* ── Input Panel ── */}
      <div className="bg-slate-900/60 border border-red-500/20 rounded-2xl p-4 space-y-4">
        <p className="font-body text-sm font-bold text-red-300 text-center uppercase tracking-wide">
          ✖️ Input Sistem Persamaan
        </p>

        {/* Equations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Persamaan 1 (P1)", val: eq1, set: setEq1, err: eq1Err, ph: "cth: 3x + y = 7" },
            { label: "Persamaan 2 (P2)", val: eq2, set: setEq2, err: eq2Err, ph: "cth: x + y = 3" },
          ].map(({ label, val, set, err, ph }) => (
            <div key={label} className="space-y-1">
              <label className="font-body text-xs text-white/60">{label}</label>
              <input
                type="text"
                value={val}
                onChange={e => { set(e.target.value); setEq1Err(false); setEq2Err(false); }}
                placeholder={ph}
                className={`w-full bg-slate-800/70 border rounded-xl px-3 py-2 text-sm font-mono text-white/90 placeholder-white/25 outline-none focus:ring-2 transition-all ${
                  err ? "border-red-500/60 focus:ring-red-500/30" : "border-red-500/30 focus:ring-red-500/30"
                }`}
              />
              {err && <p className="text-[11px] text-red-400 font-body">⚠️ Gunakan format: <span className="font-mono">2x + 3y = 6</span></p>}
            </div>
          ))}
        </div>

        {/* Strategy selector */}
        <div className="space-y-2">
          <p className="font-body text-xs text-white/60">Variabel yang dieliminasi pertama:</p>
          <div className="flex gap-2">
            {(["x", "y"] as const).map(v => (
              <button
                key={v}
                onClick={() => { playPopSound(); setElimFirst(v); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold font-body border transition-all ${
                  elimFirst === v
                    ? "bg-red-600 border-red-400 text-white shadow-lg shadow-red-900/30"
                    : "bg-slate-800/50 border-white/10 text-white/50 hover:border-white/30"
                }`}
              >
                Eliminasi {v} dulu
              </button>
            ))}
          </div>
          <p className="font-body text-[11px] text-white/30 text-center">
            Eliminasi {elimFirst} → temukan {elimSecond} &nbsp;·&nbsp; lalu eliminasi {elimSecond} → temukan {elimFirst}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSolve}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-sm font-bold font-body py-3 rounded-xl transition-all shadow-lg"
          >
            <Play className="w-4 h-4" />
            ✖️ Eliminasi Langkah demi Langkah
          </button>
          {(steps.length > 0 || error) && (
            <button onClick={handleReset} className="px-4 py-3 bg-slate-700/60 hover:bg-slate-600/60 border border-white/10 text-white/70 text-sm rounded-xl transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/40 rounded-xl px-4 py-3 text-sm font-body text-red-300 text-center">
          ⚠️ {error}
        </div>
      )}

      {/* ── Steps ── */}
      {steps.length > 0 && (
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-700"
                style={{ width: `${(visibleCount / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/40 font-body shrink-0">{visibleCount}/{steps.length}</span>
          </div>

          {steps.map((step, i) => {
            const visible = i < visibleCount;
            const transBase = "transition-all duration-700 ease-out";
            const transVis  = visible ? "opacity-100 translate-y-0 max-h-[700px]" : "opacity-0 translate-y-6 max-h-0 pointer-events-none overflow-hidden";

            if (step.kind === "elim") {
              const isElimFirst = i === 1; // blockA
              const borderColor = isElimFirst ? "border-cyan-500/40" : "border-violet-500/40";
              const bgColor     = isElimFirst ? "bg-cyan-900/15"      : "bg-violet-900/15";
              const badgeColor  = isElimFirst ? "bg-cyan-600"         : "bg-violet-600";
              const stepNum     = i + 1;
              return (
                <div key={i} className={`border ${borderColor} ${bgColor} rounded-2xl overflow-hidden ${transBase} ${transVis}`}>
                  <div className="px-4 pt-3 pb-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor} text-white`}>{stepNum}</span>
                      <p className="font-body text-sm font-semibold text-white">Langkah {stepNum} — {step.block.title}</p>
                    </div>
                    <ElimTable block={step.block} visible={visible} />
                  </div>
                </div>
              );
            }

            // Normal step
            const col = COLORS[step.color] ?? { border: "border-white/20", bg: "bg-white/5", badge: "bg-white/20 text-white" };
            return (
              <div key={i} className={`border ${col.border} ${col.bg} rounded-2xl overflow-hidden ${transBase} ${transVis}`}>
                <div className="px-4 pt-3 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>{i + 1}</span>
                    <p className={`font-body text-sm font-semibold ${step.isAnswer ? "text-yellow-300" : "text-white"}`}>
                      {step.title}
                    </p>
                  </div>
                  <div className={step.isAnswer ? "text-center" : ""}>
                    {step.lines.map((line, j) => (
                      <div key={j} className={step.isAnswer ? "scale-110" : ""}>
                        <BlockMath math={line} />
                      </div>
                    ))}
                  </div>
                  {step.note && (
                    <p className="font-body text-[11px] text-white/50 mt-2 border-t border-white/10 pt-2">
                      💡 {step.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Lanjut / Kembali navigation */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handlePrev}
              disabled={visibleCount <= 1}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-700/60 hover:bg-slate-600/60 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white/80 text-sm font-bold font-body rounded-xl transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>

            <div className="flex-1 text-center">
              <span className="text-xs text-white/40 font-body">
                Langkah {visibleCount} dari {steps.length}
              </span>
            </div>

            {!done ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-bold font-body rounded-xl transition-all shadow-md"
              >
                Lanjut <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-emerald-400 text-sm font-bold font-body flex items-center gap-1">
                🎉 Selesai!
              </span>
            )}
          </div>

          {done && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl px-4 py-3 text-center space-y-1">
              <p className="font-body text-sm font-bold text-green-300">🎉 Eliminasi selesai! Solusi berhasil ditemukan.</p>
              <p className="font-body text-xs text-white/50">Klik Reset untuk mencoba soal baru.</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default EliminasiInteraktif;
