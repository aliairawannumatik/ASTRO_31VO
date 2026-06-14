import React, { useState, useEffect, useRef } from "react";
import { BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import { Play, RotateCcw, ChevronDown } from "lucide-react";
import "katex/dist/katex.min.css";

// ── Fraction helpers ──────────────────────────────────────────────────────────

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = b; b = a % b; a = t; }
  return a || 1;
}

function red(n: number, d: number): [number, number] {
  if (d === 0) return [NaN, 1];
  const g = gcd(Math.abs(n), Math.abs(d));
  const s = d < 0 ? -1 : 1;
  return [(s * n) / g, Math.abs(d) / g];
}

function ft([n, d]: [number, number]): string {
  if (isNaN(n)) return "\\varnothing";
  if (d === 1) return `${n}`;
  return `\\dfrac{${n}}{${d}}`;
}

function nt(n: number): string {
  return `${n}`;
}

function lhsTex(a: number, b: number): string {
  let s = "";
  if (a !== 0) {
    s += a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  }
  if (b !== 0) {
    if (s) {
      s += b > 0
        ? ` + ${b === 1 ? "y" : `${b}y`}`
        : ` - ${Math.abs(b) === 1 ? "y" : `${Math.abs(b)}y`}`;
    } else {
      s += b === 1 ? "y" : b === -1 ? "-y" : `${b}y`;
    }
  }
  return s || "0";
}

function eqTex(a: number, b: number, c: number): string {
  return `${lhsTex(a, b)} = ${nt(c)}`;
}

function exprForY(a_s: number, b_s: number, c_s: number): string {
  const numStr =
    a_s === 0
      ? `${nt(c_s)}`
      : a_s > 0
      ? `${nt(c_s)} - ${a_s === 1 ? "" : `${a_s}`}x`
      : `${nt(c_s)} + ${Math.abs(a_s) === 1 ? "" : `${Math.abs(a_s)}`}x`;
  if (b_s === 1) return numStr;
  if (b_s === -1) return `-(${numStr})`;
  return `\\dfrac{${numStr}}{${nt(b_s)}}`;
}

function exprForX(a_s: number, b_s: number, c_s: number): string {
  const numStr =
    b_s === 0
      ? `${nt(c_s)}`
      : b_s > 0
      ? `${nt(c_s)} - ${b_s === 1 ? "" : `${b_s}`}y`
      : `${nt(c_s)} + ${Math.abs(b_s) === 1 ? "" : `${Math.abs(b_s)}`}y`;
  if (a_s === 1) return numStr;
  if (a_s === -1) return `-(${numStr})`;
  return `\\dfrac{${numStr}}{${nt(a_s)}}`;
}

function subIntoTgtY(a_t: number, b_t: number, c_t: number, expr: string): string {
  const xPart = a_t === 0 ? "" : a_t === 1 ? "x" : a_t === -1 ? "-x" : `${a_t}x`;
  const yPart =
    b_t === 1 ? `\\left(${expr}\\right)`
    : b_t === -1 ? `-\\left(${expr}\\right)`
    : `${b_t}\\left(${expr}\\right)`;
  const lhs = xPart ? `${xPart} + ${yPart}` : yPart;
  return `${lhs} = ${nt(c_t)}`;
}

function subIntoTgtX(a_t: number, b_t: number, c_t: number, expr: string): string {
  const xPart =
    a_t === 1 ? `\\left(${expr}\\right)`
    : a_t === -1 ? `-\\left(${expr}\\right)`
    : `${a_t}\\left(${expr}\\right)`;
  const yPart = b_t === 0 ? "" : b_t === 1 ? "y" : b_t === -1 ? "-y" : `${b_t}y`;
  const lhs = yPart ? `${xPart} + ${yPart}` : xPart;
  return `${lhs} = ${nt(c_t)}`;
}

// ── Parser ───────────────────────────────────────────────────────────────────

function parseEq(s: string): { a: number; b: number; c: number } | null {
  const clean = s.replace(/\s+/g, "").toLowerCase();
  const parts = clean.split("=");
  if (parts.length !== 2) return null;
  const c = parseFloat(parts[1]);
  if (isNaN(c)) return null;
  const lhs = parts[0];
  const normalized = lhs[0] !== "-" && lhs[0] !== "+" ? "+" + lhs : lhs;
  const re = /[+-][0-9]*\.?[0-9]*[xy]/g;
  let a = 0, b = 0, found = false;
  let m: RegExpExecArray | null;
  while ((m = re.exec(normalized)) !== null) {
    found = true;
    const tok = m[0];
    const varCh = tok[tok.length - 1];
    const numStr = tok.slice(0, -1);
    let coeff: number;
    if (numStr === "+" || numStr === "") coeff = 1;
    else if (numStr === "-") coeff = -1;
    else coeff = parseFloat(numStr);
    if (varCh === "x") a = coeff;
    else b = coeff;
  }
  return found ? { a, b, c } : null;
}

// ── Step generator ────────────────────────────────────────────────────────────

interface SolStep {
  title: string;
  lines: string[];
  note?: string;
  color: string;
  isAnswer?: boolean;
}

function generateSteps(
  p1: { a: number; b: number; c: number },
  p2: { a: number; b: number; c: number },
  isoEq: 1 | 2,
  isoVar: "x" | "y"
): { steps: SolStep[]; error: string } {
  const src = isoEq === 1 ? p1 : p2;
  const tgt = isoEq === 1 ? p2 : p1;
  const srcLbl = `P${isoEq}`;
  const tgtLbl = isoEq === 1 ? "P2" : "P1";
  const steps: SolStep[] = [];

  if (isoVar === "y") {
    if (src.b === 0)
      return { steps: [], error: `Persamaan ${isoEq} tidak memiliki variabel y! Pilih variabel atau persamaan lain.` };

    const coeffX = tgt.a * src.b - tgt.b * src.a;
    const rhsX = tgt.c * src.b - tgt.b * src.c;

    if (coeffX === 0) {
      return {
        steps: [],
        error:
          rhsX === 0
            ? "SPLDV ini memiliki TAK HINGGA SOLUSI — kedua garis berimpit."
            : "SPLDV ini TIDAK MEMILIKI SOLUSI — kedua garis sejajar.",
      };
    }

    const xFrac = red(rhsX, coeffX);
    const yNum = src.c * xFrac[1] - src.a * xFrac[0];
    const yDen = src.b * xFrac[1];
    const yFrac = red(yNum, yDen);
    const xVal = xFrac[0] / xFrac[1];
    const yVal = yFrac[0] / yFrac[1];

    const expr = exprForY(src.a, src.b, src.c);

    // Step 1 — tulis SPLDV
    steps.push({
      title: "Langkah 1 — Tuliskan SPLDV",
      lines: [
        `\\begin{cases} P1:\\; ${eqTex(p1.a, p1.b, p1.c)} \\\\[4pt] P2:\\; ${eqTex(p2.a, p2.b, p2.c)} \\end{cases}`,
      ],
      note: `Pilih: isolasi y dari ${srcLbl}, lalu substitusikan ke ${tgtLbl}.`,
      color: "border-slate-500/40 bg-slate-800/40",
    });

    // Step 2 — isolasi y
    const isolateLines: string[] = [];
    if (src.a !== 0) {
      isolateLines.push(
        `${srcLbl}:\\; ${eqTex(src.a, src.b, src.c)}`
      );
      isolateLines.push(
        `${lhsTex(0, src.b)} = ${nt(src.c)}${src.a > 0 ? ` - ${src.a === 1 ? "" : src.a}x` : ` + ${Math.abs(src.a) === 1 ? "" : Math.abs(src.a)}x`}`
      );
    } else {
      isolateLines.push(`${srcLbl}:\\; ${eqTex(src.a, src.b, src.c)}`);
    }
    isolateLines.push(`y = ${expr} \\quad \\cdots (*)`);

    steps.push({
      title: `Langkah 2 — Isolasi y dari ${srcLbl}`,
      lines: isolateLines,
      note: "Pindahkan suku x ke ruas kanan, bagi dengan koefisien y.",
      color: "border-cyan-500/40 bg-cyan-900/20",
    });

    // Step 3 — tulis target dan substitusi
    steps.push({
      title: `Langkah 3 — Substitusikan (*) ke ${tgtLbl}`,
      lines: [
        `${tgtLbl}:\\; ${eqTex(tgt.a, tgt.b, tgt.c)}`,
        `\\underbrace{\\text{ganti }y\\text{ dengan }(*)}_{\\downarrow}`,
        subIntoTgtY(tgt.a, tgt.b, tgt.c, expr),
      ],
      note: `Setiap y di ${tgtLbl} diganti dengan ekspresi (*).`,
      color: "border-violet-500/40 bg-violet-900/20",
    });

    // Step 4 — expand / kembangkan
    const termAtBs = tgt.a * src.b;
    const termBtCs = tgt.b * src.c;
    const termBtAs = tgt.b * src.a;
    const rhsBs = tgt.c * src.b;
    const expandLine = `${lhsTex(termAtBs, 0)}${
      termBtCs !== 0 ? (termBtCs > 0 ? ` + ${nt(termBtCs)}` : ` - ${nt(Math.abs(termBtCs))}`) : ""
    }${
      termBtAs !== 0 ? (termBtAs > 0 ? ` - ${termBtAs === 1 ? "" : termBtAs}x` : ` + ${Math.abs(termBtAs) === 1 ? "" : Math.abs(termBtAs)}x`) : ""
    } = ${nt(rhsBs)}`;

    steps.push({
      title: `Langkah 4 — Kembangkan`,
      lines: [
        src.b !== 1 && src.b !== -1
          ? `\\times ${src.b} \\text{ pada semua suku:}`
          : `\\text{Buka tanda kurung:}`,
        expandLine,
      ],
      note:
        src.b !== 1 && src.b !== -1
          ? `Kalikan semua suku dengan ${src.b} untuk menghilangkan penyebut.`
          : "Distribusikan perkalian ke semua suku dalam kurung.",
      color: "border-blue-500/40 bg-blue-900/20",
    });

    // Step 5 — collect x
    steps.push({
      title: "Langkah 5 — Kumpulkan suku x",
      lines: [
        `\\underbrace{${nt(termAtBs)}x}_{\\text{suku x}} ${termBtAs > 0 ? `- ${nt(termBtAs)}x` : termBtAs < 0 ? `+ ${nt(Math.abs(termBtAs))}x` : ""} = ${nt(rhsBs)}${termBtCs !== 0 ? (termBtCs > 0 ? ` - ${nt(termBtCs)}` : ` + ${nt(Math.abs(termBtCs))}`) : ""}`,
        `${lhsTex(coeffX, 0)} = ${nt(rhsX)}`,
      ],
      color: "border-indigo-500/40 bg-indigo-900/20",
    });

    // Step 6 — selesaikan x
    steps.push({
      title: "Langkah 6 — Selesaikan nilai x",
      lines: [
        coeffX !== 1
          ? `x = \\dfrac{${nt(rhsX)}}{${nt(coeffX)}} = ${ft(xFrac)}`
          : `x = ${ft(xFrac)}`,
      ],
      note: `Solusi: x = ${ft(xFrac)}`,
      color: "border-emerald-500/40 bg-emerald-900/20",
    });

    // Step 7 — cari y
    const xDisplay = ft(xFrac);
    const backSubExpr = exprForY(src.a, src.b, src.c).replace("x", `(${xDisplay})`);
    steps.push({
      title: "Langkah 7 — Cari nilai y (substitusi balik ke (*))",
      lines: [
        `y = ${backSubExpr}`,
        `y = ${ft(yFrac)}`,
      ],
      color: "border-orange-500/40 bg-orange-900/20",
    });

    // Step 8 — verifikasi
    const ok1 = Math.abs(p1.a * xVal + p1.b * yVal - p1.c) < 0.0001;
    const ok2 = Math.abs(p2.a * xVal + p2.b * yVal - p2.c) < 0.0001;
    steps.push({
      title: "Langkah 8 — Verifikasi ke kedua persamaan",
      lines: [
        `P1:\\; ${lhsTex(p1.a, p1.b)} = ${p1.a !== 0 ? `${nt(p1.a)}\\cdot${ft(xFrac)}` : ""}${p1.b !== 0 ? `${p1.b > 0 && p1.a !== 0 ? " + " : ""}${nt(p1.b)}\\cdot${ft(yFrac)}` : ""} = ${nt(p1.c)}\\; ${ok1 ? "\\checkmark" : "\\times"}`,
        `P2:\\; ${lhsTex(p2.a, p2.b)} = ${p2.a !== 0 ? `${nt(p2.a)}\\cdot${ft(xFrac)}` : ""}${p2.b !== 0 ? `${p2.b > 0 && p2.a !== 0 ? " + " : ""}${nt(p2.b)}\\cdot${ft(yFrac)}` : ""} = ${nt(p2.c)}\\; ${ok2 ? "\\checkmark" : "\\times"}`,
      ],
      note: ok1 && ok2 ? "Kedua persamaan terpenuhi! Solusi valid." : "⚠️ Ada ketidaksesuaian — periksa input.",
      color: "border-green-500/40 bg-green-900/20",
    });

    // Step 9 — solusi akhir
    steps.push({
      title: "✅ Solusi SPLDV",
      lines: [`\\boxed{\\; x = ${ft(xFrac)}, \\quad y = ${ft(yFrac)} \\;}`],
      color: "border-yellow-500/40 bg-yellow-900/20",
      isAnswer: true,
    });

  } else {
    // isoVar === 'x'
    if (src.a === 0)
      return { steps: [], error: `Persamaan ${isoEq} tidak memiliki variabel x! Pilih variabel atau persamaan lain.` };

    const coeffY = tgt.b * src.a - tgt.a * src.b;
    const rhsY = tgt.c * src.a - tgt.a * src.c;

    if (coeffY === 0) {
      return {
        steps: [],
        error:
          rhsY === 0
            ? "SPLDV ini memiliki TAK HINGGA SOLUSI — kedua garis berimpit."
            : "SPLDV ini TIDAK MEMILIKI SOLUSI — kedua garis sejajar.",
      };
    }

    const yFrac = red(rhsY, coeffY);
    const xNum = src.c * yFrac[1] - src.b * yFrac[0];
    const xDen = src.a * yFrac[1];
    const xFrac = red(xNum, xDen);
    const xVal = xFrac[0] / xFrac[1];
    const yVal = yFrac[0] / yFrac[1];

    const expr = exprForX(src.a, src.b, src.c);

    steps.push({
      title: "Langkah 1 — Tuliskan SPLDV",
      lines: [
        `\\begin{cases} P1:\\; ${eqTex(p1.a, p1.b, p1.c)} \\\\[4pt] P2:\\; ${eqTex(p2.a, p2.b, p2.c)} \\end{cases}`,
      ],
      note: `Pilih: isolasi x dari ${srcLbl}, lalu substitusikan ke ${tgtLbl}.`,
      color: "border-slate-500/40 bg-slate-800/40",
    });

    const isolateLines: string[] = [`${srcLbl}:\\; ${eqTex(src.a, src.b, src.c)}`];
    if (src.b !== 0) {
      isolateLines.push(
        `${lhsTex(src.a, 0)} = ${nt(src.c)}${src.b > 0 ? ` - ${src.b === 1 ? "" : src.b}y` : ` + ${Math.abs(src.b) === 1 ? "" : Math.abs(src.b)}y`}`
      );
    }
    isolateLines.push(`x = ${expr} \\quad \\cdots (*)`);

    steps.push({
      title: `Langkah 2 — Isolasi x dari ${srcLbl}`,
      lines: isolateLines,
      note: "Pindahkan suku y ke ruas kanan, bagi dengan koefisien x.",
      color: "border-cyan-500/40 bg-cyan-900/20",
    });

    steps.push({
      title: `Langkah 3 — Substitusikan (*) ke ${tgtLbl}`,
      lines: [
        `${tgtLbl}:\\; ${eqTex(tgt.a, tgt.b, tgt.c)}`,
        `\\underbrace{\\text{ganti }x\\text{ dengan }(*)}_{\\downarrow}`,
        subIntoTgtX(tgt.a, tgt.b, tgt.c, expr),
      ],
      note: `Setiap x di ${tgtLbl} diganti dengan ekspresi (*).`,
      color: "border-violet-500/40 bg-violet-900/20",
    });

    const termBtAs = tgt.b * src.a;
    const termAtCs = tgt.a * src.c;
    const termAtBs = tgt.a * src.b;
    const rhsAs = tgt.c * src.a;

    const expandLine = `${
      termAtCs !== 0 ? nt(termAtCs) : ""
    }${
      termAtBs !== 0
        ? (termAtBs > 0
            ? `${termAtCs !== 0 ? " - " : "-"}${termAtBs === 1 ? "" : termAtBs}y`
            : `${termAtCs !== 0 ? " + " : "+"}${Math.abs(termAtBs) === 1 ? "" : Math.abs(termAtBs)}y`)
        : ""
    }${
      termBtAs !== 0
        ? (termBtAs > 0
            ? ` + ${termBtAs === 1 ? "" : termBtAs}y`
            : ` - ${Math.abs(termBtAs) === 1 ? "" : Math.abs(termBtAs)}y`)
        : ""
    } = ${nt(rhsAs)}`;

    steps.push({
      title: "Langkah 4 — Kembangkan",
      lines: [
        src.a !== 1 && src.a !== -1
          ? `\\times ${src.a} \\text{ pada semua suku:}`
          : `\\text{Buka tanda kurung:}`,
        expandLine,
      ],
      color: "border-blue-500/40 bg-blue-900/20",
    });

    steps.push({
      title: "Langkah 5 — Kumpulkan suku y",
      lines: [`${lhsTex(0, coeffY)} = ${nt(rhsY)}`],
      color: "border-indigo-500/40 bg-indigo-900/20",
    });

    steps.push({
      title: "Langkah 6 — Selesaikan nilai y",
      lines: [
        coeffY !== 1
          ? `y = \\dfrac{${nt(rhsY)}}{${nt(coeffY)}} = ${ft(yFrac)}`
          : `y = ${ft(yFrac)}`,
      ],
      note: `Solusi: y = ${ft(yFrac)}`,
      color: "border-emerald-500/40 bg-emerald-900/20",
    });

    const yDisplay = ft(yFrac);
    const backSubExpr = exprForX(src.a, src.b, src.c).replace("y", `(${yDisplay})`);
    steps.push({
      title: "Langkah 7 — Cari nilai x (substitusi balik ke (*))",
      lines: [
        `x = ${backSubExpr}`,
        `x = ${ft(xFrac)}`,
      ],
      color: "border-orange-500/40 bg-orange-900/20",
    });

    const ok1 = Math.abs(p1.a * xVal + p1.b * yVal - p1.c) < 0.0001;
    const ok2 = Math.abs(p2.a * xVal + p2.b * yVal - p2.c) < 0.0001;
    steps.push({
      title: "Langkah 8 — Verifikasi ke kedua persamaan",
      lines: [
        `P1:\\; ${lhsTex(p1.a, p1.b)} = ${p1.a !== 0 ? `${nt(p1.a)}\\cdot${ft(xFrac)}` : ""}${p1.b !== 0 ? `${p1.b > 0 && p1.a !== 0 ? " + " : ""}${nt(p1.b)}\\cdot${ft(yFrac)}` : ""} = ${nt(p1.c)}\\; ${ok1 ? "\\checkmark" : "\\times"}`,
        `P2:\\; ${lhsTex(p2.a, p2.b)} = ${p2.a !== 0 ? `${nt(p2.a)}\\cdot${ft(xFrac)}` : ""}${p2.b !== 0 ? `${p2.b > 0 && p2.a !== 0 ? " + " : ""}${nt(p2.b)}\\cdot${ft(yFrac)}` : ""} = ${nt(p2.c)}\\; ${ok2 ? "\\checkmark" : "\\times"}`,
      ],
      note: ok1 && ok2 ? "Kedua persamaan terpenuhi! Solusi valid." : "⚠️ Ada ketidaksesuaian — periksa input.",
      color: "border-green-500/40 bg-green-900/20",
    });

    steps.push({
      title: "✅ Solusi SPLDV",
      lines: [`\\boxed{\\; x = ${ft(xFrac)}, \\quad y = ${ft(yFrac)} \\;}`],
      color: "border-yellow-500/40 bg-yellow-900/20",
      isAnswer: true,
    });
  }

  return { steps, error: "" };
}

// ── Main component ────────────────────────────────────────────────────────────

const STEP_DELAY_MS = 1300;

const SubstitusiInteraktif: React.FC = () => {
  const [eq1, setEq1] = useState("x + y = 5");
  const [eq2, setEq2] = useState("2x + 3y = 11");
  const [isoEq, setIsoEq] = useState<1 | 2>(1);
  const [isoVar, setIsoVar] = useState<"x" | "y">("y");

  const [steps, setSteps] = useState<SolStep[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [eq1Err, setEq1Err] = useState(false);
  const [eq2Err, setEq2Err] = useState(false);
  const [done, setDone] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isRunning && visibleCount < steps.length) {
      timerRef.current = setTimeout(() => {
        setVisibleCount((c) => c + 1);
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, STEP_DELAY_MS);
    }
    if (visibleCount >= steps.length && steps.length > 0 && isRunning) {
      setIsRunning(false);
      setDone(true);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isRunning, visibleCount, steps.length]);

  const handleSolve = () => {
    playPopSound();
    const p1 = parseEq(eq1);
    const p2 = parseEq(eq2);
    let hasErr = false;
    if (!p1) { setEq1Err(true); hasErr = true; } else setEq1Err(false);
    if (!p2) { setEq2Err(true); hasErr = true; } else setEq2Err(false);
    if (hasErr) return;

    const { steps: s, error: e } = generateSteps(p1!, p2!, isoEq, isoVar);
    if (e) { setError(e); setSteps([]); setVisibleCount(0); setDone(false); return; }

    setError("");
    setSteps(s);
    setVisibleCount(1);
    setIsRunning(true);
    setDone(false);
  };

  const handleReset = () => {
    playPopSound();
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps([]);
    setVisibleCount(0);
    setIsRunning(false);
    setDone(false);
    setError("");
    setEq1Err(false);
    setEq2Err(false);
  };

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisibleCount(steps.length);
    setIsRunning(false);
    setDone(true);
  };

  const stepColorMap: Record<string, { border: string; bg: string; badge: string }> = {
    "border-slate-500/40 bg-slate-800/40": { border: "border-slate-500/40", bg: "bg-slate-800/40", badge: "bg-slate-600 text-white" },
    "border-cyan-500/40 bg-cyan-900/20": { border: "border-cyan-500/40", bg: "bg-cyan-900/20", badge: "bg-cyan-600 text-white" },
    "border-violet-500/40 bg-violet-900/20": { border: "border-violet-500/40", bg: "bg-violet-900/20", badge: "bg-violet-600 text-white" },
    "border-blue-500/40 bg-blue-900/20": { border: "border-blue-500/40", bg: "bg-blue-900/20", badge: "bg-blue-600 text-white" },
    "border-indigo-500/40 bg-indigo-900/20": { border: "border-indigo-500/40", bg: "bg-indigo-900/20", badge: "bg-indigo-600 text-white" },
    "border-emerald-500/40 bg-emerald-900/20": { border: "border-emerald-500/40", bg: "bg-emerald-900/20", badge: "bg-emerald-600 text-white" },
    "border-orange-500/40 bg-orange-900/20": { border: "border-orange-500/40", bg: "bg-orange-900/20", badge: "bg-orange-600 text-white" },
    "border-green-500/40 bg-green-900/20": { border: "border-green-500/40", bg: "bg-green-900/20", badge: "bg-green-600 text-white" },
    "border-yellow-500/40 bg-yellow-900/20": { border: "border-yellow-500/40", bg: "bg-yellow-900/20", badge: "bg-yellow-500 text-black" },
  };

  return (
    <div className="space-y-4">

      {/* ── Input Panel ── */}
      <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-4 space-y-4">
        <p className="font-body text-sm font-bold text-cyan-300 text-center uppercase tracking-wide">
          🔢 Input Sistem Persamaan
        </p>

        {/* Equation inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Persamaan 1 (P1)", val: eq1, set: setEq1, err: eq1Err, ph: "cth: x + y = 5" },
            { label: "Persamaan 2 (P2)", val: eq2, set: setEq2, err: eq2Err, ph: "cth: 2x + 3y = 11" },
          ].map(({ label, val, set, err, ph }) => (
            <div key={label} className="space-y-1">
              <label className="font-body text-xs text-white/60">{label}</label>
              <input
                type="text"
                value={val}
                onChange={(e) => { set(e.target.value); if (eq1Err || eq2Err) { setEq1Err(false); setEq2Err(false); } }}
                placeholder={ph}
                className={`w-full bg-slate-800/70 border rounded-xl px-3 py-2 text-sm font-mono text-white/90 placeholder-white/25 outline-none focus:ring-2 transition-all ${
                  err ? "border-red-500/60 focus:ring-red-500/30" : "border-cyan-500/30 focus:ring-cyan-500/30"
                }`}
              />
              {err && (
                <p className="text-[11px] text-red-400 font-body">
                  ⚠️ Format tidak dikenali. Gunakan: <span className="font-mono">2x + 3y = 6</span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Isolasi dari persamaan mana */}
          <div className="space-y-2">
            <p className="font-body text-xs text-white/60">Isolasi dari persamaan:</p>
            <div className="flex gap-2">
              {([1, 2] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => { playPopSound(); setIsoEq(n); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold font-body border transition-all ${
                    isoEq === n
                      ? "bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/30"
                      : "bg-slate-800/50 border-white/10 text-white/50 hover:border-white/30"
                  }`}
                >
                  Persamaan {n}
                </button>
              ))}
            </div>
          </div>

          {/* Variabel yang diisolasi */}
          <div className="space-y-2">
            <p className="font-body text-xs text-white/60">Variabel yang diisolasi:</p>
            <div className="flex gap-2">
              {(["x", "y"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => { playPopSound(); setIsoVar(v); }}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold font-body border transition-all ${
                    isoVar === v
                      ? "bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-900/30"
                      : "bg-slate-800/50 border-white/10 text-white/50 hover:border-white/30"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSolve}
            disabled={isRunning}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold font-body py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20"
          >
            <Play className="w-4 h-4" />
            {isRunning ? "Sedang memproses…" : "▶ Selesaikan Langkah demi Langkah"}
          </button>
          {(steps.length > 0 || error) && (
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-slate-700/60 hover:bg-slate-600/60 border border-white/10 text-white/70 text-sm rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {isRunning && steps.length > 0 && (
          <button
            onClick={handleSkip}
            className="w-full text-xs text-white/40 hover:text-white/70 font-body transition-all text-center"
          >
            Lewati animasi (tampilkan semua)
          </button>
        )}
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
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${(visibleCount / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/40 font-body shrink-0">
              {visibleCount}/{steps.length}
            </span>
          </div>

          {steps.map((step, i) => {
            const colors = stepColorMap[step.color] ?? { border: "border-white/20", bg: "bg-white/5", badge: "bg-white/20 text-white" };
            const visible = i < visibleCount;
            return (
              <div
                key={i}
                className={`border ${colors.border} ${colors.bg} rounded-2xl overflow-hidden transition-all duration-700 ease-out ${
                  visible ? "opacity-100 translate-y-0 max-h-[600px]" : "opacity-0 translate-y-6 max-h-0 pointer-events-none"
                }`}
                style={{ transitionProperty: "opacity, transform, max-height" }}
              >
                <div className="px-4 pt-3 pb-4">
                  {/* Step header */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                      {i + 1}
                    </span>
                    <p className={`font-body text-sm font-semibold ${step.isAnswer ? "text-yellow-300" : "text-white"}`}>
                      {step.title}
                    </p>
                  </div>

                  {/* Math lines */}
                  <div className={`space-y-1 ${step.isAnswer ? "text-center" : ""}`}>
                    {step.lines.map((line, j) => (
                      <div key={j} className={`${step.isAnswer ? "scale-110" : ""}`}>
                        <BlockMath math={line} />
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  {step.note && (
                    <p className="font-body text-[11px] text-white/50 mt-2 border-t border-white/10 pt-2">
                      💡 {step.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Running indicator */}
          {isRunning && (
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-white/40 font-body">Menghitung langkah berikutnya…</span>
            </div>
          )}

          {done && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl px-4 py-3 text-center space-y-1">
              <p className="font-body text-sm font-bold text-green-300">🎉 Selesai! Semua langkah sudah ditampilkan.</p>
              <p className="font-body text-xs text-white/50">Klik Reset untuk mencoba soal baru.</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default SubstitusiInteraktif;
