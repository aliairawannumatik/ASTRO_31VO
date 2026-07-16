import React, { useState, useRef } from "react";
import { BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";
import { playPopSound } from "@/hooks/useAudio";
import { Play, RotateCcw, Zap, ChevronRight, ChevronLeft } from "lucide-react";
import "katex/dist/katex.min.css";

// ── i18n ──────────────────────────────────────────────────────────────────────

const ui = {
  id: {
    inputTitle: "✖️ Input Sistem Persamaan",
    eq1Label: "Persamaan 1 (P1)", eq2Label: "Persamaan 2 (P2)",
    eq1Ph: "cth: 3x + y = 7", eq2Ph: "cth: x + y = 3",
    errFmt: "⚠️ Gunakan format:", solveBtn: "✖️ Eliminasi Langkah demi Langkah",
    elimFirstLabel: "Variabel yang dieliminasi pertama:",
    elimFirstBtn: (v: string) => `Eliminasi ${v} dulu`,
    strategyHint: (f: string, s: string) => `Eliminasi ${f} → temukan ${s} · lalu eliminasi ${s} → temukan ${f}`,
    prevBtn: "‹ Sebelumnya", nextBtn: "Selanjutnya ›",
    doneLabel: "🎉 Selesai!",
    stepLabel: (n: number, total: number) => `Langkah ${n} / ${total}`,
    // step content
    step1Title: "Langkah 1 — Tuliskan SPLDV",
    step1Note: (f: string, s: string) => `Strategi: eliminasi ${f} dulu → dapat ${s}, lalu eliminasi ${s} → dapat ${f}.`,
    blockTitle: (ev: string, sv: string) => `Eliminasi ${ev} → cari ${sv}`,
    equalizeLabel: (ev: string) => `Samakan koefisien ${ev} → kalikan kedua persamaan`,
    subtracted: "dikurangkan", added: "dijumlahkan",
    resultLabel: "Hasil",
    vanishBadge: (ev: string) => `🔴 ${ev} lenyap! → tersisa 1 variabel saja`,
    step4Title: "Langkah 4 — Verifikasi ke kedua persamaan",
    step4Ok: "Kedua persamaan terpenuhi — solusi valid!",
    step4Fail: "⚠️ Ada ketidaksesuaian, periksa input.",
    solutionTitle: "✅ Solusi SPLDV",
    errInfinite: "SPLDV ini memiliki TAK HINGGA SOLUSI — kedua persamaan identik (garis berimpit).",
    errParallel: "SPLDV ini TIDAK MEMILIKI SOLUSI — kedua garis sejajar.",
    errNoVar: (v: string) => `Salah satu persamaan tidak memiliki variabel ${v}! Pilih variabel lain.`,
    errCalc: "Gagal menghitung — coba variabel lain.",
  },
  en: {
    inputTitle: "✖️ Input System of Equations",
    eq1Label: "Equation 1 (P1)", eq2Label: "Equation 2 (P2)",
    eq1Ph: "e.g. 3x + y = 7", eq2Ph: "e.g. x + y = 3",
    errFmt: "⚠️ Use format:", solveBtn: "✖️ Eliminate Step by Step",
    elimFirstLabel: "Variable to eliminate first:",
    elimFirstBtn: (v: string) => `Eliminate ${v} first`,
    strategyHint: (f: string, s: string) => `Eliminate ${f} → find ${s} · then eliminate ${s} → find ${f}`,
    prevBtn: "‹ Previous", nextBtn: "Next ›",
    doneLabel: "🎉 Done!",
    stepLabel: (n: number, total: number) => `Step ${n} / ${total}`,
    step1Title: "Step 1 — Write the System",
    step1Note: (f: string, s: string) => `Strategy: eliminate ${f} first → find ${s}, then eliminate ${s} → find ${f}.`,
    blockTitle: (ev: string, sv: string) => `Eliminate ${ev} → find ${sv}`,
    equalizeLabel: (ev: string) => `Equalize ${ev} coefficients → multiply both equations`,
    subtracted: "subtracted", added: "added",
    resultLabel: "Result",
    vanishBadge: (ev: string) => `🔴 ${ev} eliminated! → 1 variable remains`,
    step4Title: "Step 4 — Verify in both equations",
    step4Ok: "Both equations satisfied — valid solution!",
    step4Fail: "⚠️ Mismatch — check your input.",
    solutionTitle: "✅ Solution",
    errInfinite: "This system has INFINITELY MANY SOLUTIONS — the lines coincide.",
    errParallel: "This system has NO SOLUTION — the lines are parallel.",
    errNoVar: (v: string) => `One equation has no ${v} variable! Choose a different variable.`,
    errCalc: "Calculation failed — try a different variable.",
  },
  ja: {
    inputTitle: "✖️ 連立方程式を入力",
    eq1Label: "方程式1 (P1)", eq2Label: "方程式2 (P2)",
    eq1Ph: "例: 3x + y = 7", eq2Ph: "例: x + y = 3",
    errFmt: "⚠️ 形式を使用してください:", solveBtn: "✖️ ステップごとに消去",
    elimFirstLabel: "最初に消去する変数：",
    elimFirstBtn: (v: string) => `まず${v}を消去`,
    strategyHint: (f: string, s: string) => `${f}を消去 → ${s}を求める · 次に${s}を消去 → ${f}を求める`,
    prevBtn: "‹ 前へ", nextBtn: "次へ ›",
    doneLabel: "🎉 完了！",
    stepLabel: (n: number, total: number) => `ステップ ${n} / ${total}`,
    step1Title: "ステップ1 — 連立方程式を書く",
    step1Note: (f: string, s: string) => `方針：まず${f}を消去して${s}を求め、次に${s}を消去して${f}を求める。`,
    blockTitle: (ev: string, sv: string) => `${ev}を消去 → ${sv}を求める`,
    equalizeLabel: (ev: string) => `${ev}の係数を揃える → 両式に掛け算`,
    subtracted: "引く", added: "足す",
    resultLabel: "結果",
    vanishBadge: (ev: string) => `🔴 ${ev}が消去されました！→ 変数1つのみ残る`,
    step4Title: "ステップ4 — 両方の式で検証",
    step4Ok: "両方の式が成立 — 解は有効！",
    step4Fail: "⚠️ 不一致 — 入力を確認してください。",
    solutionTitle: "✅ 解",
    errInfinite: "この連立方程式は解が無限にあります — 直線が一致しています。",
    errParallel: "この連立方程式に解はありません — 直線が平行です。",
    errNoVar: (v: string) => `一方の方程式に${v}がありません！別の変数を選んでください。`,
    errCalc: "計算に失敗しました — 別の変数を試してください。",
  },
};

type Tr = typeof ui["id"];

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

function termStr(coeff: number, varName: string): string {
  if (coeff === 0) return "0";
  if (Math.abs(coeff) === 1) return coeff > 0 ? varName : `-${varName}`;
  return `${coeff}${varName}`;
}

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

interface ERow { label: string; a: number; b: number; c: number; }

interface ElimBlock {
  elimVar: "x" | "y";
  solveVar: "x" | "y";
  row1: ERow;
  row2: ERow;
  op: "+" | "-";
  resultA: number;
  resultC: number;
  solveFrac: [number, number];
  origA1: number; origB1: number; origC1: number;
  origA2: number; origB2: number; origC2: number;
  m1: number; m2: number;
}

function buildElimBlock(
  a1: number, b1: number, c1: number,
  a2: number, b2: number, c2: number,
  elimVar: "x" | "y"
): ElimBlock | null {
  const src1 = elimVar === "x" ? a1 : b1;
  const src2 = elimVar === "x" ? a2 : b2;
  if (src1 === 0 || src2 === 0) return null;

  const L = lcm(Math.abs(src1), Math.abs(src2));
  const m1 = L / Math.abs(src1);
  const m2 = L / Math.abs(src2);
  const new1 = src1 * m1;
  const new2 = src2 * m2;
  const op: "+" | "-" = (new1 * new2 > 0) ? "-" : "+";

  const r1: ERow = { label: m1 === 1 ? "P1" : `P1×${m1}`, a: a1 * m1, b: b1 * m1, c: c1 * m1 };
  const r2: ERow = { label: m2 === 1 ? "P2" : `P2×${m2}`, a: a2 * m2, b: b2 * m2, c: c2 * m2 };

  const resultA = op === "-"
    ? (elimVar === "x" ? b1 * m1 - b2 * m2 : a1 * m1 - a2 * m2)
    : (elimVar === "x" ? b1 * m1 + b2 * m2 : a1 * m1 + a2 * m2);
  const resultC = op === "-" ? c1 * m1 - c2 * m2 : c1 * m1 + c2 * m2;
  const solveFrac = red(resultC, resultA);
  const solveVar: "x" | "y" = elimVar === "x" ? "y" : "x";

  return { elimVar, solveVar, row1: r1, row2: r2, op, resultA, resultC, solveFrac, origA1: a1, origB1: b1, origC1: c1, origA2: a2, origB2: b2, origC2: c2, m1, m2 };
}

// ── Step types ────────────────────────────────────────────────────────────────

interface NormalStep { kind: "normal"; title: string; lines: string[]; note?: string; color: string; isAnswer?: boolean; }
interface ElimStep { kind: "elim"; block: ElimBlock; }
type SolStep = NormalStep | ElimStep;

// ── Visual Elimination Table ──────────────────────────────────────────────────

const ElimTable: React.FC<{ block: ElimBlock; visible: boolean; t: Tr }> = ({ block, visible, t }) => {
  const { row1, row2, op, elimVar, resultA, resultC, solveFrac, solveVar,
          origA1, origB1, origC1, origA2, origB2, origC2, m1, m2 } = block;

  const cellBase = "px-2 py-1.5 text-center font-mono text-sm tabular-nums";
  const deadCell = `${cellBase} line-through text-red-400/80`;
  const liveCell = `${cellBase} text-emerald-300 font-bold`;
  const dimCell  = `${cellBase} text-white/60`;
  const resultElim = `${cellBase} text-red-400/60 line-through font-bold`;
  const resultLive = `${cellBase} text-yellow-300 font-bold text-base`;

  const xDead = elimVar === "x";
  const needsMult = m1 !== 1 || m2 !== 1;
  const solveTex = `${solveVar} = \\dfrac{${resultC}}{${resultA}} = ${ft(solveFrac)}`;

  const renderRow = (row: ERow, isRow2: boolean) => (
    <div className={`flex items-center gap-1 ${isRow2 ? "border-b border-white/20 pb-1" : ""}`}>
      <div className="w-14 shrink-0 text-right pr-2">
        <span className="text-white/60 text-[11px] font-body">{row.label}</span>
      </div>
      <span className={xDead ? deadCell : liveCell}>{termStr(row.a, "x")}</span>
      <span className={dimCell}>+</span>
      <span className={xDead ? liveCell : deadCell}>{termStr(row.b, "y")}</span>
      <span className={dimCell}>=</span>
      <span className={`${cellBase} text-white/80`}>{row.c}</span>
      {isRow2 && (
        <span className={`ml-1 text-xs font-bold font-body px-1.5 py-0.5 rounded ${
          op === "-" ? "text-red-300 bg-red-900/50 border border-red-500/30" : "text-green-300 bg-green-900/50 border border-green-500/30"
        }`}>
          {op === "-" ? t.subtracted : t.added}
        </span>
      )}
    </div>
  );

  return (
    <div className={`space-y-2 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="font-body text-sm font-bold text-white">{t.blockTitle(elimVar, solveVar)}</p>
      </div>

      {needsMult && (
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3 space-y-1.5">
          <p className="font-body text-[10px] uppercase text-white/50 tracking-wide mb-1">{t.equalizeLabel(elimVar)}</p>
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="text-white/50 w-5 shrink-0 text-right">P1</span>
            <span className="text-white/80">{termStr(origA1, "x")} + {termStr(origB1, "y")} = {origC1}</span>
            <span className="text-yellow-300 font-bold mx-1">|×{m1}|</span>
            <span className="text-cyan-300 font-bold">{termStr(row1.a, "x")} + {termStr(row1.b, "y")} = {row1.c}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="text-white/50 w-5 shrink-0 text-right">P2</span>
            <span className="text-white/80">{termStr(origA2, "x")} + {termStr(origB2, "y")} = {origC2}</span>
            <span className="text-yellow-300 font-bold mx-1">|×{m2}|</span>
            <span className="text-cyan-300 font-bold">{termStr(row2.a, "x")} + {termStr(row2.b, "y")} = {row2.c}</span>
          </div>
        </div>
      )}

      <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 space-y-0.5">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-14" />
          <span className={`${cellBase} text-[10px] uppercase ${xDead ? "text-red-400/80" : "text-white/50"}`}>x</span>
          <span className="w-3" />
          <span className={`${cellBase} text-[10px] uppercase ${!xDead ? "text-red-400/80" : "text-white/50"}`}>y</span>
          <span className="w-3" />
          <span className={`${cellBase} text-[10px] uppercase text-white/50`}>rhs</span>
        </div>

        {renderRow(row1, false)}
        {renderRow(row2, true)}

        <div className="flex items-center gap-1 pt-1">
          <div className="w-14 shrink-0 text-right pr-2">
            <span className="text-white/60 text-[11px] font-body">{t.resultLabel}</span>
          </div>
          <span className={xDead ? resultElim : resultLive}>{xDead ? "0" : termStr(resultA, "x")}</span>
          <span className={dimCell}>+</span>
          <span className={xDead ? resultLive : resultElim}>{xDead ? termStr(resultA, "y") : "0"}</span>
          <span className={dimCell}>=</span>
          <span className={`${cellBase} text-yellow-200 font-bold`}>{resultC}</span>
        </div>

        <div className="flex justify-center mt-2">
          <span className="bg-red-900/50 border border-red-500/30 rounded-full px-3 py-0.5 text-[10px] font-body text-red-300">
            {t.vanishBadge(elimVar)}
          </span>
        </div>
      </div>

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
  elimFirst: "x" | "y",
  t: Tr
): { steps: SolStep[]; error: string } {
  const elimSecond: "x" | "y" = elimFirst === "x" ? "y" : "x";

  const det = p1.a * p2.b - p1.b * p2.a;
  if (det === 0) {
    const check = p1.c * p2.b - p1.b * p2.c;
    return { steps: [], error: check === 0 ? t.errInfinite : t.errParallel };
  }

  const cf1 = elimFirst === "x" ? p1.a : p1.b;
  const cf2 = elimFirst === "x" ? p2.a : p2.b;
  if (cf1 === 0 || cf2 === 0) return { steps: [], error: t.errNoVar(elimFirst) };
  const cs1 = elimSecond === "x" ? p1.a : p1.b;
  const cs2 = elimSecond === "x" ? p2.a : p2.b;
  if (cs1 === 0 || cs2 === 0) return { steps: [], error: t.errNoVar(elimSecond) };

  const blockA = buildElimBlock(p1.a, p1.b, p1.c, p2.a, p2.b, p2.c, elimFirst);
  const blockB = buildElimBlock(p1.a, p1.b, p1.c, p2.a, p2.b, p2.c, elimSecond);
  if (!blockA || !blockB) return { steps: [], error: t.errCalc };

  const xFrac = blockB.solveVar === "x" ? blockB.solveFrac : blockA.solveFrac;
  const yFrac = blockB.solveVar === "y" ? blockB.solveFrac : blockA.solveFrac;
  const xVal = xFrac[0] / xFrac[1];
  const yVal = yFrac[0] / yFrac[1];

  const ok1 = Math.abs(p1.a * xVal + p1.b * yVal - p1.c) < 0.0001;
  const ok2 = Math.abs(p2.a * xVal + p2.b * yVal - p2.c) < 0.0001;

  const steps: SolStep[] = [
    {
      kind: "normal",
      title: t.step1Title,
      lines: [`\\begin{cases} P1:\\; ${eqTex(p1.a, p1.b, p1.c)} \\\\[4pt] P2:\\; ${eqTex(p2.a, p2.b, p2.c)} \\end{cases}`],
      note: t.step1Note(elimFirst, elimSecond),
      color: "border-slate-500/40 bg-slate-800/40",
    },
    { kind: "elim", block: blockA },
    { kind: "elim", block: blockB },
    {
      kind: "normal",
      title: t.step4Title,
      lines: [
        `P1:\\; ${lhsTex(p1.a, p1.b)} = ${p1.a !== 0 ? `${p1.a}\\cdot${ft(xFrac)}` : ""}${p1.b !== 0 ? `${p1.b > 0 && p1.a !== 0 ? "+" : ""}${p1.b}\\cdot${ft(yFrac)}` : ""} = ${p1.c}\\; ${ok1 ? "\\checkmark" : "\\times"}`,
        `P2:\\; ${lhsTex(p2.a, p2.b)} = ${p2.a !== 0 ? `${p2.a}\\cdot${ft(xFrac)}` : ""}${p2.b !== 0 ? `${p2.b > 0 && p2.a !== 0 ? "+" : ""}${p2.b}\\cdot${ft(yFrac)}` : ""} = ${p2.c}\\; ${ok2 ? "\\checkmark" : "\\times"}`,
      ],
      note: ok1 && ok2 ? t.step4Ok : t.step4Fail,
      color: "border-green-500/40 bg-green-900/20",
    },
    {
      kind: "normal",
      title: t.solutionTitle,
      lines: [`\\boxed{\\; x = ${ft(xFrac)}, \\quad y = ${ft(yFrac)} \\;}`],
      color: "border-yellow-500/40 bg-yellow-900/20",
      isAnswer: true,
    },
  ];

  return { steps, error: "" };
}

// ── Color map ─────────────────────────────────────────────────────────────────

const COLORS: Record<string, { border: string; bg: string; badge: string }> = {
  "border-slate-500/40 bg-slate-800/40":   { border: "border-slate-400/60",   bg: "bg-slate-800/50",   badge: "bg-slate-600 text-white" },
  "border-cyan-500/40 bg-cyan-900/20":     { border: "border-cyan-400/60",     bg: "bg-cyan-900/30",     badge: "bg-cyan-600 text-white" },
  "border-violet-500/40 bg-violet-900/20": { border: "border-violet-400/60",   bg: "bg-violet-900/30",   badge: "bg-violet-600 text-white" },
  "border-green-500/40 bg-green-900/20":   { border: "border-green-400/60",    bg: "bg-green-900/30",    badge: "bg-green-600 text-white" },
  "border-yellow-500/40 bg-yellow-900/20": { border: "border-yellow-400/60",   bg: "bg-yellow-900/30",   badge: "bg-yellow-500 text-black" },
};

// ── Main component ────────────────────────────────────────────────────────────

const EliminasiInteraktif: React.FC = () => {
  const { language } = useLanguage();
  const t = ui[language as keyof typeof ui] ?? ui.id;

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
  const elimSecond: "x" | "y" = elimFirst === "x" ? "y" : "x";

  const handleSolve = () => {
    playPopSound();
    const p1 = parseEq(eq1); const p2 = parseEq(eq2);
    let err = false;
    if (!p1) { setEq1Err(true); err = true; } else setEq1Err(false);
    if (!p2) { setEq2Err(true); err = true; } else setEq2Err(false);
    if (err) return;
    const { steps: s, error: e } = generateSteps(p1!, p2!, elimFirst, t);
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

  const handlePrev = () => { playPopSound(); setVC(c => Math.max(c - 1, 1)); };

  const handleReset = () => {
    playPopSound();
    setSteps([]); setVC(0);
    setError(""); setEq1Err(false); setEq2Err(false);
  };

  return (
    <div className="space-y-4">

      {/* ── Input Panel ── */}
      <div className="bg-slate-900/60 border border-red-500/20 rounded-2xl p-4 space-y-4">
        <p className="font-body text-sm font-bold text-red-300 text-center uppercase tracking-wide">
          {t.inputTitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: t.eq1Label, val: eq1, set: setEq1, err: eq1Err, ph: t.eq1Ph },
            { label: t.eq2Label, val: eq2, set: setEq2, err: eq2Err, ph: t.eq2Ph },
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
              {err && <p className="text-[11px] text-red-400 font-body">{t.errFmt} <span className="font-mono">2x + 3y = 6</span></p>}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="font-body text-xs text-white/60">{t.elimFirstLabel}</p>
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
                {t.elimFirstBtn(v)}
              </button>
            ))}
          </div>
          <p className="font-body text-[11px] text-white/30 text-center">
            {t.strategyHint(elimFirst, elimSecond)}
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSolve}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-sm font-bold font-body py-3 rounded-xl transition-all shadow-lg"
          >
            <Play className="w-4 h-4" />
            {t.solveBtn}
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
              const isElimFirst = i === 1;
              const borderColor = isElimFirst ? "border-cyan-400/60" : "border-violet-400/60";
              const bgColor     = isElimFirst ? "bg-cyan-900/30"     : "bg-violet-900/30";
              const badgeColor  = isElimFirst ? "bg-cyan-600"        : "bg-violet-600";
              return (
                <div key={i} className={`border ${borderColor} ${bgColor} rounded-2xl overflow-hidden ${transBase} ${transVis}`}>
                  <div className="px-4 pt-3 pb-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor} text-white`}>{i + 1}</span>
                      <p className="font-body text-sm font-semibold text-white">
                        {t.stepLabel(i + 1, steps.length)} — {t.blockTitle(step.block.elimVar, step.block.solveVar)}
                      </p>
                    </div>
                    <ElimTable block={step.block} visible={visible} t={t} />
                  </div>
                </div>
              );
            }

            const cm = COLORS[step.color] ?? { border: "border-white/20", bg: "bg-slate-800/40", badge: "bg-slate-600 text-white" };
            return (
              <div key={i} className={`border ${cm.border} ${cm.bg} rounded-2xl overflow-hidden ${transBase} ${transVis}`}>
                <div className="px-4 pt-3 pb-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cm.badge}`}>{i + 1}</span>
                    <p className={`font-body text-sm font-semibold ${step.isAnswer ? "text-yellow-300" : "text-white"}`}>
                      {step.title}
                    </p>
                  </div>
                  {step.note && (
                    <p className="font-body text-xs text-cyan-200/80 bg-cyan-900/20 border border-cyan-500/20 rounded-lg px-3 py-2">
                      💡 {step.note}
                    </p>
                  )}
                  <div className="space-y-2 overflow-x-auto">
                    {step.lines.map((line, j) => <BlockMath key={j} math={line} />)}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation */}
          <div className="flex justify-between gap-3 pt-1">
            <button
              onClick={handlePrev}
              disabled={visibleCount <= 1}
              className="flex items-center gap-1 px-4 py-2 bg-slate-800/60 border border-white/10 text-white/60 text-sm font-body rounded-xl transition-all hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> {t.prevBtn}
            </button>

            {!done ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-bold font-body rounded-xl transition-all hover:opacity-90"
              >
                {t.nextBtn} <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-body">{t.doneLabel}</span>
            )}
          </div>

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default EliminasiInteraktif;
