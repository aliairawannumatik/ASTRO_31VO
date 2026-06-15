import React, { useState, useRef } from "react";
import { BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import { Play, RotateCcw, ChevronRight, ChevronLeft, Zap, GitMerge } from "lucide-react";
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
function termStr(coeff: number, varName: string): string {
  if (coeff === 0) return `0${varName}`;
  if (Math.abs(coeff) === 1) return coeff > 0 ? varName : `-${varName}`;
  return `${coeff}${varName}`;
}
function eqLine(a: number, b: number, c: number): string {
  let s = "";
  if (a !== 0) s += a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  if (b !== 0) {
    if (s) s += b > 0 ? ` + ${Math.abs(b) === 1 ? "y" : `${Math.abs(b)}y`}` : ` - ${Math.abs(b) === 1 ? "y" : `${Math.abs(b)}y`}`;
    else s += b === 1 ? "y" : b === -1 ? "-y" : `${b}y`;
  }
  return `${s || "0"} = ${c}`;
}
function eqTex(a: number, b: number, c: number): string {
  return eqLine(a, b, c);
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

// ── Step types ────────────────────────────────────────────────────────────────

interface StepSystem {
  kind: "system";
  a1: number; b1: number; c1: number;
  a2: number; b2: number; c2: number;
  elimVar: "x" | "y";
}
interface StepElimMultiply {
  kind: "elim-multiply";
  elimVar: "x" | "y";
  a1: number; b1: number; c1: number;
  a2: number; b2: number; c2: number;
  m1: number; m2: number;
  na1: number; nb1: number; nc1: number;
  na2: number; nb2: number; nc2: number;
}
interface StepElimOperate {
  kind: "elim-operate";
  elimVar: "x" | "y";
  na1: number; nb1: number; nc1: number;
  na2: number; nb2: number; nc2: number;
  m1: number; m2: number;
  op: "+" | "-";
  resultCoeff: number;
  resultRhs: number;
  resultVar: "x" | "y";
  resultFrac: [number, number];
}
interface StepSubst {
  kind: "subst";
  foundVar: "x" | "y";
  foundFrac: [number, number];
  useEq: number; // 1 or 2
  a: number; b: number; c: number;
  otherVar: "x" | "y";
  otherFrac: [number, number];
}
interface StepVerify {
  kind: "verify";
  a1: number; b1: number; c1: number;
  a2: number; b2: number; c2: number;
  xFrac: [number, number];
  yFrac: [number, number];
  ok1: boolean; ok2: boolean;
}
interface StepSolution {
  kind: "solution";
  xFrac: [number, number];
  yFrac: [number, number];
}

type CStep = StepSystem | StepElimMultiply | StepElimOperate | StepSubst | StepVerify | StepSolution;

// ── Step generator ────────────────────────────────────────────────────────────

function generateSteps(
  p1: { a: number; b: number; c: number },
  p2: { a: number; b: number; c: number },
  elimVar: "x" | "y"
): { steps: CStep[]; error: string } {
  const det = p1.a * p2.b - p1.b * p2.a;
  if (det === 0) {
    const check = p1.c * p2.b - p1.b * p2.c;
    return {
      steps: [],
      error: check === 0
        ? "SPLDV ini memiliki TAK HINGGA SOLUSI — kedua persamaan identik."
        : "SPLDV ini TIDAK MEMILIKI SOLUSI — kedua garis sejajar.",
    };
  }

  const src1 = elimVar === "x" ? p1.a : p1.b;
  const src2 = elimVar === "x" ? p2.a : p2.b;
  if (src1 === 0 || src2 === 0) {
    return { steps: [], error: `Salah satu persamaan tidak memiliki variabel ${elimVar}! Pilih variabel lain.` };
  }

  const L = lcm(Math.abs(src1), Math.abs(src2));
  const m1 = L / Math.abs(src1);
  const m2 = L / Math.abs(src2);

  const na1 = p1.a * m1; const nb1 = p1.b * m1; const nc1 = p1.c * m1;
  const na2 = p2.a * m2; const nb2 = p2.b * m2; const nc2 = p2.c * m2;

  const newSrc1 = elimVar === "x" ? na1 : nb1;
  const newSrc2 = elimVar === "x" ? na2 : nb2;
  const op: "+" | "-" = (newSrc1 * newSrc2 > 0) ? "-" : "+";

  const resultCoeff = op === "-"
    ? (elimVar === "x" ? nb1 - nb2 : na1 - na2)
    : (elimVar === "x" ? nb1 + nb2 : na1 + na2);
  const resultRhs = op === "-" ? nc1 - nc2 : nc1 + nc2;
  const resultVar: "x" | "y" = elimVar === "x" ? "y" : "x";
  const resultFrac = red(resultRhs, resultCoeff);
  const resultVal = resultFrac[0] / resultFrac[1];

  const xFrac: [number, number] = resultVar === "x" ? resultFrac : (() => {
    const sub = resultVar === "y" ? resultVal : 0;
    const val = (p1.c - p1.b * sub) / p1.a;
    return red(Math.round(val * 1000), 1000);
  })();
  const yFrac: [number, number] = resultVar === "y" ? resultFrac : (() => {
    const sub = resultVar === "x" ? resultVal : 0;
    const val = (p1.c - p1.a * sub) / p1.b;
    return red(Math.round(val * 1000), 1000);
  })();

  // Recalculate properly
  const foundFrac = resultFrac;
  const foundVar = resultVar;
  const otherVar: "x" | "y" = foundVar === "x" ? "y" : "x";
  const foundVal = foundFrac[0] / foundFrac[1];

  // Choose simpler equation for substitution (prefer one with smaller coefficients)
  const complexity1 = Math.abs(p1.a) + Math.abs(p1.b);
  const complexity2 = Math.abs(p2.a) + Math.abs(p2.b);
  const useEqNum = complexity1 <= complexity2 ? 1 : 2;
  const useEq = useEqNum === 1 ? p1 : p2;

  let otherVal: number;
  if (otherVar === "x") {
    otherVal = (useEq.c - useEq.b * foundVal) / useEq.a;
  } else {
    otherVal = (useEq.c - useEq.a * foundVal) / useEq.b;
  }
  const otherFrac = red(Math.round(otherVal * 10000), 10000);

  const xF: [number, number] = otherVar === "x" ? otherFrac : foundFrac as [number, number];
  const yF: [number, number] = otherVar === "y" ? otherFrac : foundFrac as [number, number];

  const xVal = xF[0] / xF[1];
  const yVal = yF[0] / yF[1];
  const ok1 = Math.abs(p1.a * xVal + p1.b * yVal - p1.c) < 0.01;
  const ok2 = Math.abs(p2.a * xVal + p2.b * yVal - p2.c) < 0.01;

  const steps: CStep[] = [
    {
      kind: "system",
      a1: p1.a, b1: p1.b, c1: p1.c,
      a2: p2.a, b2: p2.b, c2: p2.c,
      elimVar,
    },
    {
      kind: "elim-multiply",
      elimVar,
      a1: p1.a, b1: p1.b, c1: p1.c,
      a2: p2.a, b2: p2.b, c2: p2.c,
      m1, m2,
      na1, nb1, nc1,
      na2, nb2, nc2,
    },
    {
      kind: "elim-operate",
      elimVar,
      na1, nb1, nc1,
      na2, nb2, nc2,
      m1, m2,
      op,
      resultCoeff,
      resultRhs,
      resultVar,
      resultFrac,
    },
    {
      kind: "subst",
      foundVar,
      foundFrac,
      useEq: useEqNum,
      a: useEq.a, b: useEq.b, c: useEq.c,
      otherVar,
      otherFrac,
    },
    {
      kind: "verify",
      a1: p1.a, b1: p1.b, c1: p1.c,
      a2: p2.a, b2: p2.b, c2: p2.c,
      xFrac: xF, yFrac: yF,
      ok1, ok2,
    },
    {
      kind: "solution",
      xFrac: xF,
      yFrac: yF,
    },
  ];

  return { steps, error: "" };
}

// ── Step card styles ──────────────────────────────────────────────────────────

const STEP_STYLES = [
  { border: "border-slate-400/60",   bg: "bg-slate-800/50",    badge: "bg-slate-600",    label: "1" },
  { border: "border-amber-400/60",   bg: "bg-amber-900/20",    badge: "bg-amber-600",    label: "2" },
  { border: "border-violet-400/60",  bg: "bg-violet-900/20",   badge: "bg-violet-600",   label: "3" },
  { border: "border-green-400/60",   bg: "bg-green-900/20",    badge: "bg-green-600",    label: "4" },
  { border: "border-cyan-400/60",    bg: "bg-cyan-900/20",     badge: "bg-cyan-600",     label: "5" },
  { border: "border-yellow-400/60",  bg: "bg-yellow-900/20",   badge: "bg-yellow-500",   label: "6" },
];

// ── Individual step renderers ─────────────────────────────────────────────────

const StepSystemCard: React.FC<{ step: StepSystem }> = ({ step }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Zap className="w-4 h-4 text-slate-300 shrink-0" />
      <p className="font-body text-sm font-bold text-white">Langkah 1 — Tuliskan SPLDV</p>
    </div>
    <div className="bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3">
      <BlockMath math={`\\begin{cases} P1:\\; ${eqTex(step.a1, step.b1, step.c1)} \\\\[4pt] P2:\\; ${eqTex(step.a2, step.b2, step.c2)} \\end{cases}`} />
    </div>
    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg px-3 py-2">
      <p className="font-body text-xs text-violet-200">
        Strategi: <strong>eliminasi {step.elimVar}</strong> dulu → dapat nilai {step.elimVar === "x" ? "y" : "x"}, lalu <strong>substitusi</strong> → dapat nilai {step.elimVar}.
      </p>
    </div>
  </div>
);

const StepElimMultiplyCard: React.FC<{ step: StepElimMultiply }> = ({ step }) => {
  const { elimVar, a1, b1, c1, a2, b2, c2, m1, m2, na1, nb1, nc1, na2, nb2, nc2 } = step;
  const needsMult = m1 !== 1 || m2 !== 1;

  const kpk = lcm(Math.abs(elimVar === "x" ? a1 : b1), Math.abs(elimVar === "x" ? a2 : b2));
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="font-body text-sm font-bold text-white">
          Langkah 2 — Samakan koefisien <span className="text-amber-300">{elimVar}</span>
        </p>
      </div>
      <p className="font-body text-xs text-white/60">
        KPK dari |{elimVar === "x" ? a1 : b1}| dan |{elimVar === "x" ? a2 : b2}| = {kpk}.
        {needsMult ? ` Kalikan P1 × ${m1} dan P2 × ${m2}:` : " Koefisien sudah sama, tidak perlu dikalikan."}
      </p>

      {/* Vertical multiplication display */}
      <div className="bg-slate-900/70 border border-amber-500/20 rounded-xl px-4 py-3 space-y-3">
        <p className="font-body text-[10px] uppercase text-amber-300/70 tracking-wide">Proses perkalian</p>

        {/* P1 row */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
            <span className="text-white/50 w-6 shrink-0">P1</span>
            <span className="text-white/80">{eqLine(a1, b1, c1)}</span>
            {needsMult && m1 !== 1 && (
              <>
                <span className="text-amber-300 font-bold">|×{m1}|</span>
                <span className="text-white/30">→</span>
                <span className="text-cyan-300 font-bold">{eqLine(na1, nb1, nc1)}</span>
              </>
            )}
            {(m1 === 1) && (
              <>
                <span className="text-white/30 text-xs">|×1 (tetap)|</span>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* P2 row */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
            <span className="text-white/50 w-6 shrink-0">P2</span>
            <span className="text-white/80">{eqLine(a2, b2, c2)}</span>
            {needsMult && m2 !== 1 && (
              <>
                <span className="text-amber-300 font-bold">|×{m2}|</span>
                <span className="text-white/30">→</span>
                <span className="text-cyan-300 font-bold">{eqLine(na2, nb2, nc2)}</span>
              </>
            )}
            {(m2 === 1) && (
              <>
                <span className="text-white/30 text-xs">|×1 (tetap)|</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Result after multiplication */}
      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl px-4 py-3 space-y-1.5">
        <p className="font-body text-[10px] uppercase text-cyan-300/70 tracking-wide mb-2">Persamaan setelah dikalikan</p>
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-white/50 w-16 shrink-0 text-right pr-1">{m1 === 1 ? "P1" : `P1×${m1}`}</span>
          <span className="text-cyan-200 font-bold">{eqLine(na1, nb1, nc1)}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-white/50 w-16 shrink-0 text-right pr-1">{m2 === 1 ? "P2" : `P2×${m2}`}</span>
          <span className="text-cyan-200 font-bold">{eqLine(na2, nb2, nc2)}</span>
        </div>
      </div>
    </div>
  );
};

const StepElimOperateCard: React.FC<{ step: StepElimOperate }> = ({ step }) => {
  const { elimVar, na1, nb1, nc1, na2, nb2, nc2, m1, m2, op, resultCoeff, resultRhs, resultVar, resultFrac } = step;
  const solveTex = `${resultVar} = \\dfrac{${resultRhs}}{${resultCoeff}} = ${ft(resultFrac)}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-violet-400 shrink-0" />
        <p className="font-body text-sm font-bold text-white">
          Langkah 3 — Eliminasi <span className="text-violet-300">{elimVar}</span>
          <span className="text-white/50 font-normal"> ({op === "-" ? "kurangkan" : "jumlahkan"} kedua persamaan)</span>
        </p>
      </div>
      <p className="font-body text-xs text-white/60">
        Koefisien {elimVar} di kedua persamaan bertanda <strong className="text-white/80">{(elimVar === "x" ? na1 * na2 > 0 : nb1 * nb2 > 0) ? "sama" : "berlawanan"}</strong>
        &nbsp;→ {op === "-" ? "kurangkan (−)" : "jumlahkan (+)"}
      </p>

      {/* Vertical elimination table */}
      <div className="bg-slate-900/80 border border-violet-500/20 rounded-xl px-4 py-3 font-mono text-sm space-y-0.5">
        {/* Row 1 */}
        <div className="flex items-center gap-2 py-1">
          <span className="text-white/40 w-16 shrink-0 text-right pr-1 font-body text-[11px]">
            {m1 === 1 ? "P1" : `P1×${m1}`}
          </span>
          <span className="text-white/85">{eqLine(na1, nb1, nc1)}</span>
        </div>
        {/* Row 2 with sign on the right */}
        <div className="flex items-center gap-2 pb-1 border-b-2 border-white/30">
          <span className="text-white/40 w-16 shrink-0 text-right pr-1 font-body text-[11px]">
            {m2 === 1 ? "P2" : `P2×${m2}`}
          </span>
          <span className="text-white/85">{eqLine(na2, nb2, nc2)}</span>
          <span className={`ml-2 font-bold text-base ${op === "-" ? "text-red-400" : "text-green-400"}`}>{op}</span>
        </div>
        {/* Result */}
        <div className="flex items-center gap-2 pt-1.5">
          <span className="text-white/40 w-16 shrink-0 text-right pr-1 font-body text-[11px]">Hasil</span>
          <span className="text-yellow-300 font-bold">
            {termStr(resultCoeff, resultVar)} = {resultRhs}
          </span>
        </div>
      </div>

      {/* Badge: variable lenyap */}
      <div className="flex justify-center">
        <span className="bg-red-900/50 border border-red-500/30 rounded-full px-3 py-0.5 text-[10px] font-body text-red-300">
          🔴 {elimVar} lenyap! → tersisa hanya {resultVar}
        </span>
      </div>

      {/* Solve */}
      <div className="bg-slate-800/50 border border-yellow-500/20 rounded-xl px-4 py-2">
        <BlockMath math={solveTex} />
      </div>
    </div>
  );
};

const StepSubstCard: React.FC<{ step: StepSubst }> = ({ step }) => {
  const { foundVar, foundFrac, useEq, a, b, c, otherVar, otherFrac } = step;
  const foundVal = ft(foundFrac);

  // Build substitution TeX
  const aStr = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  const bStr = b === 1 ? "y" : b === -1 ? "-y" : `${Math.abs(b)}y`;
  const bSign = b > 0 ? "+" : "-";

  let substLine: string;
  if (foundVar === "x") {
    substLine = `${a}(${foundVal}) ${bSign} ${Math.abs(b)}${otherVar} = ${c}`;
  } else {
    substLine = `${a}${otherVar} ${bSign} ${Math.abs(b)}(${foundVal}) = ${c}`;
  }

  const otherTex = `${otherVar} = ${ft(otherFrac)}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <GitMerge className="w-4 h-4 text-green-400 shrink-0" />
        <p className="font-body text-sm font-bold text-white">
          Langkah 4 — Substitusi nilai <span className="text-green-300">{foundVar} = {foundVal}</span>
        </p>
      </div>
      <p className="font-body text-xs text-white/60">
        Masukkan nilai {foundVar} = {foundVal} ke Persamaan {useEq} untuk mencari {otherVar}.
      </p>

      <div className="bg-slate-900/70 border border-green-500/20 rounded-xl px-4 py-3 space-y-1">
        <p className="font-body text-[10px] uppercase text-green-300/70 tracking-wide mb-2">Persamaan {useEq}: {eqLine(a, b, c)}</p>
        <BlockMath math={substLine} />
        <BlockMath math={otherTex} />
      </div>
    </div>
  );
};

const StepVerifyCard: React.FC<{ step: StepVerify }> = ({ step }) => {
  const { a1, b1, c1, a2, b2, c2, xFrac, yFrac, ok1, ok2 } = step;
  const xv = ft(xFrac); const yv = ft(yFrac);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
        <p className="font-body text-sm font-bold text-white">Langkah 5 — Verifikasi</p>
      </div>
      <div className="bg-slate-900/70 border border-cyan-500/20 rounded-xl px-4 py-3 space-y-2">
        <BlockMath math={`P1:\\; ${a1}(${xv}) + (${b1})(${yv}) = ${c1}\\; ${ok1 ? "\\checkmark" : "\\times"}`} />
        <BlockMath math={`P2:\\; ${a2}(${xv}) + (${b2})(${yv}) = ${c2}\\; ${ok2 ? "\\checkmark" : "\\times"}`} />
      </div>
      <div className={`rounded-lg px-3 py-2 text-xs font-body ${ok1 && ok2 ? "bg-green-900/30 border border-green-500/30 text-green-300" : "bg-red-900/30 border border-red-500/30 text-red-300"}`}>
        {ok1 && ok2 ? "✅ Kedua persamaan terpenuhi — solusi valid!" : "⚠️ Ada ketidaksesuaian, periksa input."}
      </div>
    </div>
  );
};

const StepSolutionCard: React.FC<{ step: StepSolution }> = ({ step }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
      <p className="font-body text-sm font-bold text-white">✅ Solusi SPLDV</p>
    </div>
    <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl px-4 py-3">
      <BlockMath math={`\\boxed{\\; x = ${ft(step.xFrac)},\\quad y = ${ft(step.yFrac)} \\;}`} />
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const CampuranInteraktif: React.FC = () => {
  const [eq1, setEq1] = useState("x + 2y = 8");
  const [eq2, setEq2] = useState("3x - y = 3");
  const [elimVar, setElimVar] = useState<"x" | "y">("x");
  const [eq1Err, setEq1Err] = useState(false);
  const [eq2Err, setEq2Err] = useState(false);

  const [steps, setSteps] = useState<CStep[]>([]);
  const [visibleCount, setVC] = useState(0);
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const done = visibleCount >= steps.length && steps.length > 0;

  const handleSolve = () => {
    playPopSound();
    const p1 = parseEq(eq1); const p2 = parseEq(eq2);
    let err = false;
    if (!p1) { setEq1Err(true); err = true; } else setEq1Err(false);
    if (!p2) { setEq2Err(true); err = true; } else setEq2Err(false);
    if (err) return;
    const { steps: s, error: e } = generateSteps(p1!, p2!, elimVar);
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
    setSteps([]); setVC(0); setError(""); setEq1Err(false); setEq2Err(false);
  };

  const stepTitles = [
    "Tuliskan SPLDV",
    "Samakan Koefisien",
    "Operasi Eliminasi",
    "Substitusi",
    "Verifikasi",
    "Solusi",
  ];

  return (
    <div className="space-y-4">

      {/* ── Input Panel ── */}
      <div className="bg-slate-900/60 border border-violet-500/20 rounded-2xl p-4 space-y-4">
        <p className="font-body text-sm font-bold text-violet-300 text-center uppercase tracking-wide">
          🔀 Input Sistem Persamaan
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Persamaan 1 (P1)", val: eq1, set: setEq1, err: eq1Err, ph: "cth: x + 2y = 8" },
            { label: "Persamaan 2 (P2)", val: eq2, set: setEq2, err: eq2Err, ph: "cth: 3x - y = 3" },
          ].map(({ label, val, set, err, ph }) => (
            <div key={label} className="space-y-1">
              <label className="font-body text-xs text-white/60">{label}</label>
              <input
                type="text"
                value={val}
                onChange={e => { set(e.target.value); setEq1Err(false); setEq2Err(false); }}
                placeholder={ph}
                className={`w-full bg-slate-800/70 border rounded-xl px-3 py-2 text-sm font-mono text-white/90 placeholder-white/25 outline-none focus:ring-2 transition-all ${
                  err ? "border-red-500/60 focus:ring-red-500/30" : "border-violet-500/30 focus:ring-violet-500/30"
                }`}
              />
              {err && <p className="text-[11px] text-red-400 font-body">⚠️ Gunakan format: <span className="font-mono">2x + 3y = 6</span></p>}
            </div>
          ))}
        </div>

        {/* Variable selector */}
        <div className="space-y-2">
          <p className="font-body text-xs text-white/60">Variabel yang dieliminasi:</p>
          <div className="flex gap-2">
            {(["x", "y"] as const).map(v => (
              <button
                key={v}
                onClick={() => { playPopSound(); setElimVar(v); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold font-body border transition-all ${
                  elimVar === v
                    ? "bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-900/30"
                    : "bg-slate-800/50 border-white/10 text-white/50 hover:border-white/30"
                }`}
              >
                Eliminasi {v}
              </button>
            ))}
          </div>
          <p className="font-body text-[11px] text-white/30 text-center">
            Eliminasi {elimVar} → temukan {elimVar === "x" ? "y" : "x"} → substitusi → temukan {elimVar}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSolve}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-bold font-body py-3 rounded-xl transition-all shadow-lg"
          >
            <Play className="w-4 h-4" />
            🔀 Metode Campuran Langkah demi Langkah
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
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: `${(visibleCount / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/40 font-body shrink-0">{visibleCount}/{steps.length}</span>
          </div>

          {/* Step mini-map */}
          <div className="flex gap-1.5 flex-wrap">
            {stepTitles.map((t, i) => (
              <div
                key={i}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-body border transition-all ${
                  i < visibleCount
                    ? `${STEP_STYLES[i].bg} ${STEP_STYLES[i].border} text-white/80`
                    : "bg-white/5 border-white/10 text-white/20"
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${i < visibleCount ? STEP_STYLES[i].badge + " text-white" : "bg-white/10 text-white/30"}`}>
                  {i + 1}
                </span>
                <span>{t}</span>
              </div>
            ))}
          </div>

          {/* Step cards */}
          {steps.map((step, i) => {
            const visible = i < visibleCount;
            const style = STEP_STYLES[i] || STEP_STYLES[0];
            return (
              <div
                key={i}
                className={`border ${style.border} ${style.bg} rounded-2xl overflow-hidden transition-all duration-700 ease-out ${
                  visible ? "opacity-100 translate-y-0 max-h-[1200px]" : "opacity-0 translate-y-6 max-h-0 pointer-events-none overflow-hidden"
                }`}
              >
                <div className="px-4 pt-3 pb-4">
                  {step.kind === "system"       && <StepSystemCard       step={step} />}
                  {step.kind === "elim-multiply" && <StepElimMultiplyCard step={step} />}
                  {step.kind === "elim-operate"  && <StepElimOperateCard  step={step} />}
                  {step.kind === "subst"         && <StepSubstCard        step={step} />}
                  {step.kind === "verify"        && <StepVerifyCard       step={step} />}
                  {step.kind === "solution"      && <StepSolutionCard     step={step} />}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />

          {/* Nav buttons */}
          <div className="flex gap-2 pt-1">
            {visibleCount > 1 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-700/60 hover:bg-slate-600/60 border border-white/10 text-white/70 text-sm rounded-xl transition-all font-body"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
            )}
            {!done && (
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600/80 to-blue-600/80 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-bold font-body py-2.5 rounded-xl transition-all"
              >
                Langkah Berikutnya <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {done && (
              <div className="flex-1 text-center py-2.5 text-sm font-body text-yellow-300 font-bold">
                🎉 Selesai! Semua langkah ditampilkan.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampuranInteraktif;
