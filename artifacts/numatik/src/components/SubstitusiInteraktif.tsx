import React, { useState, useEffect, useRef } from "react";
import { BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";
import { playPopSound } from "@/hooks/useAudio";
import { Play, RotateCcw, ChevronDown } from "lucide-react";
import "katex/dist/katex.min.css";

// ── i18n ──────────────────────────────────────────────────────────────────────

const ui = {
  id: {
    inputTitle: "🔢 Input Sistem Persamaan",
    eq1Label: "Persamaan 1 (P1)", eq2Label: "Persamaan 2 (P2)",
    eq1Ph: "cth: x + y = 5", eq2Ph: "cth: 2x + 3y = 11",
    errFmt: "⚠️ Format tidak dikenali. Gunakan:",
    isoFromLabel: "Nyatakan dari persamaan:", isoEq1: "Persamaan 1", isoEq2: "Persamaan 2",
    isoVarLabel: "Variabel yang dinyatakan:",
    solveRunning: "Sedang memproses…", solveBtnLabel: "▶ Selesaikan Langkah demi Langkah",
    skipBtn: "Lewati animasi (tampilkan semua)",
    // steps
    step1: "Langkah 1 — Tuliskan SPLDV",
    step1NoteY: (s: string, t: string) => `Pilih: nyatakan y dari ${s}, lalu substitusikan ke ${t}.`,
    step1NoteX: (s: string, t: string) => `Pilih: nyatakan x dari ${s}, lalu substitusikan ke ${t}.`,
    step2Y: (s: string) => `Langkah 2 — Nyatakan y dari ${s}`,
    step2X: (s: string) => `Langkah 2 — Nyatakan x dari ${s}`,
    step2NoteY: "Pindahkan suku x ke ruas kanan, lalu bagi dengan koefisien y.",
    step2NoteX: "Pindahkan suku y ke ruas kanan, lalu bagi dengan koefisien x.",
    step3: (t: string) => `Langkah 3 — Substitusikan (*) ke ${t}`,
    step3NoteY: (t: string) => `Setiap y di ${t} diganti dengan ekspresi (*).`,
    step3NoteX: (t: string) => `Setiap x di ${t} diganti dengan ekspresi (*).`,
    subY: "ganti y dengan (*)", subX: "ganti x dengan (*)",
    step4: "Langkah 4 — Kembangkan",
    expandAll: (b: number) => `\\times ${b} \\;\\text{pd semua suku:}`,
    expandBracket: "\\text{Buka kurung:}",
    step4NoteCoeff: (b: number) => `Kalikan semua suku dengan ${b} untuk menghilangkan penyebut.`,
    step4NoteDistrib: "Distribusikan perkalian ke semua suku dalam kurung.",
    termX: "\\text{suku x}", termY: "\\text{suku y}",
    step5X: "Langkah 5 — Kumpulkan suku x",
    step5Y: "Langkah 5 — Kumpulkan suku y",
    step6X: "Langkah 6 — Selesaikan nilai x",
    step6Y: "Langkah 6 — Selesaikan nilai y",
    step6Note: (v: string, val: string) => `Solusi: ${v} = ${val}`,
    step7Y: "Langkah 7 — Cari nilai y (substitusi balik ke (*))",
    step7X: "Langkah 7 — Cari nilai x (substitusi balik ke (*))",
    step8: "Langkah 8 — Verifikasi ke kedua persamaan",
    step8Ok: "Kedua persamaan terpenuhi! Solusi valid.",
    step8Fail: "⚠️ Ada ketidaksesuaian — periksa input.",
    solution: "✅ Solusi SPLDV",
    errNoY: (n: number) => `Persamaan ${n} tidak memiliki variabel y! Pilih variabel atau persamaan lain.`,
    errNoX: (n: number) => `Persamaan ${n} tidak memiliki variabel x! Pilih variabel atau persamaan lain.`,
    errInfinite: "SPLDV ini memiliki TAK HINGGA SOLUSI — kedua garis berimpit.",
    errParallel: "SPLDV ini TIDAK MEMILIKI SOLUSI — kedua garis sejajar.",
  },
  en: {
    inputTitle: "🔢 Input System of Equations",
    eq1Label: "Equation 1 (P1)", eq2Label: "Equation 2 (P2)",
    eq1Ph: "e.g. x + y = 5", eq2Ph: "e.g. 2x + 3y = 11",
    errFmt: "⚠️ Unrecognized format. Use:",
    isoFromLabel: "Express variable from equation:", isoEq1: "Equation 1", isoEq2: "Equation 2",
    isoVarLabel: "Variable to isolate:",
    solveRunning: "Processing…", solveBtnLabel: "▶ Solve Step by Step",
    skipBtn: "Skip animation (show all)",
    step1: "Step 1 — Write the System",
    step1NoteY: (s: string, t: string) => `Plan: express y from ${s}, then substitute into ${t}.`,
    step1NoteX: (s: string, t: string) => `Plan: express x from ${s}, then substitute into ${t}.`,
    step2Y: (s: string) => `Step 2 — Express y from ${s}`,
    step2X: (s: string) => `Step 2 — Express x from ${s}`,
    step2NoteY: "Move the x term to the right side, then divide by the y coefficient.",
    step2NoteX: "Move the y term to the right side, then divide by the x coefficient.",
    step3: (t: string) => `Step 3 — Substitute (*) into ${t}`,
    step3NoteY: (t: string) => `Every y in ${t} is replaced by expression (*).`,
    step3NoteX: (t: string) => `Every x in ${t} is replaced by expression (*).`,
    subY: "replace y with (*)", subX: "replace x with (*)",
    step4: "Step 4 — Expand",
    expandAll: (b: number) => `\\times ${b} \\;\\text{for all terms:}`,
    expandBracket: "\\text{Expand:}",
    step4NoteCoeff: (b: number) => `Multiply all terms by ${b} to clear the denominator.`,
    step4NoteDistrib: "Distribute the multiplication across all terms in the bracket.",
    termX: "\\text{x term}", termY: "\\text{y term}",
    step5X: "Step 5 — Collect x terms",
    step5Y: "Step 5 — Collect y terms",
    step6X: "Step 6 — Solve for x",
    step6Y: "Step 6 — Solve for y",
    step6Note: (v: string, val: string) => `Solution: ${v} = ${val}`,
    step7Y: "Step 7 — Find y (back-substitute into (*))",
    step7X: "Step 7 — Find x (back-substitute into (*))",
    step8: "Step 8 — Verify in both equations",
    step8Ok: "Both equations satisfied! Valid solution.",
    step8Fail: "⚠️ Mismatch — check your input.",
    solution: "✅ Solution",
    errNoY: (n: number) => `Equation ${n} has no y variable! Choose a different variable or equation.`,
    errNoX: (n: number) => `Equation ${n} has no x variable! Choose a different variable or equation.`,
    errInfinite: "This system has INFINITELY MANY SOLUTIONS — the lines coincide.",
    errParallel: "This system has NO SOLUTION — the lines are parallel.",
  },
  ja: {
    inputTitle: "🔢 連立方程式を入力",
    eq1Label: "方程式1 (P1)", eq2Label: "方程式2 (P2)",
    eq1Ph: "例: x + y = 5", eq2Ph: "例: 2x + 3y = 11",
    errFmt: "⚠️ 形式が無効です。例:",
    isoFromLabel: "どの式から変数を表すか：", isoEq1: "方程式1", isoEq2: "方程式2",
    isoVarLabel: "孤立させる変数：",
    solveRunning: "計算中…", solveBtnLabel: "▶ ステップごとに解く",
    skipBtn: "アニメーションをスキップ（全表示）",
    step1: "ステップ1 — 連立方程式を書く",
    step1NoteY: (s: string, t: string) => `方針：${s}からyを表し、${t}に代入する。`,
    step1NoteX: (s: string, t: string) => `方針：${s}からxを表し、${t}に代入する。`,
    step2Y: (s: string) => `ステップ2 — ${s}からyを表す`,
    step2X: (s: string) => `ステップ2 — ${s}からxを表す`,
    step2NoteY: "x項を右辺に移し、yの係数で割る。",
    step2NoteX: "y項を右辺に移し、xの係数で割る。",
    step3: (t: string) => `ステップ3 — (*)を${t}に代入`,
    step3NoteY: (t: string) => `${t}のすべてのyを(*)で置き換える。`,
    step3NoteX: (t: string) => `${t}のすべてのxを(*)で置き換える。`,
    subY: "yを(*)で置換", subX: "xを(*)で置換",
    step4: "ステップ4 — 展開",
    expandAll: (b: number) => `\\times ${b} \\;\\text{各項に:}`,
    expandBracket: "\\text{括弧を展開:}",
    step4NoteCoeff: (b: number) => `分母を消すために全項に${b}をかける。`,
    step4NoteDistrib: "括弧内の全項に掛け算を分配する。",
    termX: "\\text{x}", termY: "\\text{y}",
    step5X: "ステップ5 — xの項をまとめる",
    step5Y: "ステップ5 — yの項をまとめる",
    step6X: "ステップ6 — xを求める",
    step6Y: "ステップ6 — yを求める",
    step6Note: (v: string, val: string) => `解：${v} = ${val}`,
    step7Y: "ステップ7 — yを求める（(*)に逆代入）",
    step7X: "ステップ7 — xを求める（(*)に逆代入）",
    step8: "ステップ8 — 両方の式で検証",
    step8Ok: "両方の方程式が成立！解は有効です。",
    step8Fail: "⚠️ 不一致 — 入力を確認してください。",
    solution: "✅ 解",
    errNoY: (n: number) => `方程式${n}にはyがありません！別の変数または式を選んでください。`,
    errNoX: (n: number) => `方程式${n}にはxがありません！別の変数または式を選んでください。`,
    errInfinite: "この連立方程式は解が無限にあります — 直線が一致しています。",
    errParallel: "この連立方程式に解はありません — 直線が平行です。",
  },
};

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

type Str = typeof ui["id"];

function generateSteps(
  p1: { a: number; b: number; c: number },
  p2: { a: number; b: number; c: number },
  isoEq: 1 | 2,
  isoVar: "x" | "y",
  s: Str
): { steps: SolStep[]; error: string } {
  const src = isoEq === 1 ? p1 : p2;
  const tgt = isoEq === 1 ? p2 : p1;
  const srcLbl = `P${isoEq}`;
  const tgtLbl = isoEq === 1 ? "P2" : "P1";
  const steps: SolStep[] = [];

  if (isoVar === "y") {
    if (src.b === 0)
      return { steps: [], error: s.errNoY(isoEq) };

    const coeffX = tgt.a * src.b - tgt.b * src.a;
    const rhsX = tgt.c * src.b - tgt.b * src.c;

    if (coeffX === 0) {
      return { steps: [], error: rhsX === 0 ? s.errInfinite : s.errParallel };
    }

    const xFrac = red(rhsX, coeffX);
    const yNum = src.c * xFrac[1] - src.a * xFrac[0];
    const yDen = src.b * xFrac[1];
    const yFrac = red(yNum, yDen);
    const xVal = xFrac[0] / xFrac[1];
    const yVal = yFrac[0] / yFrac[1];

    const expr = exprForY(src.a, src.b, src.c);

    steps.push({
      title: s.step1,
      lines: [`\\begin{cases} P1:\\; ${eqTex(p1.a, p1.b, p1.c)} \\\\[4pt] P2:\\; ${eqTex(p2.a, p2.b, p2.c)} \\end{cases}`],
      note: s.step1NoteY(srcLbl, tgtLbl),
      color: "border-slate-500/40 bg-slate-800/40",
    });

    const isolateLines: string[] = [];
    if (src.a !== 0) {
      isolateLines.push(`${srcLbl}:\\; ${eqTex(src.a, src.b, src.c)}`);
      isolateLines.push(
        `${lhsTex(0, src.b)} = ${nt(src.c)}${src.a > 0 ? ` - ${src.a === 1 ? "" : src.a}x` : ` + ${Math.abs(src.a) === 1 ? "" : Math.abs(src.a)}x`}`
      );
    } else {
      isolateLines.push(`${srcLbl}:\\; ${eqTex(src.a, src.b, src.c)}`);
    }
    isolateLines.push(`y = ${expr} \\quad \\cdots (*)`);

    steps.push({
      title: s.step2Y(srcLbl),
      lines: isolateLines,
      note: s.step2NoteY,
      color: "border-cyan-500/40 bg-cyan-900/20",
    });

    steps.push({
      title: s.step3(tgtLbl),
      lines: [
        `${tgtLbl}:\\; ${eqTex(tgt.a, tgt.b, tgt.c)}`,
        `\\underbrace{\\text{${s.subY}}}_{\\downarrow}`,
        subIntoTgtY(tgt.a, tgt.b, tgt.c, expr),
      ],
      note: s.step3NoteY(tgtLbl),
      color: "border-violet-500/40 bg-violet-900/20",
    });

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
      title: s.step4,
      lines: [
        src.b !== 1 && src.b !== -1 ? s.expandAll(src.b) : s.expandBracket,
        expandLine,
      ],
      note: src.b !== 1 && src.b !== -1 ? s.step4NoteCoeff(src.b) : s.step4NoteDistrib,
      color: "border-blue-500/40 bg-blue-900/20",
    });

    steps.push({
      title: s.step5X,
      lines: [
        `\\underbrace{${nt(termAtBs)}x}_{${s.termX}} ${termBtAs > 0 ? `- ${nt(termBtAs)}x` : termBtAs < 0 ? `+ ${nt(Math.abs(termBtAs))}x` : ""} = ${nt(rhsBs)}${termBtCs !== 0 ? (termBtCs > 0 ? ` - ${nt(termBtCs)}` : ` + ${nt(Math.abs(termBtCs))}`) : ""}`,
        `${lhsTex(coeffX, 0)} = ${nt(rhsX)}`,
      ],
      color: "border-indigo-500/40 bg-indigo-900/20",
    });

    steps.push({
      title: s.step6X,
      lines: [
        coeffX !== 1
          ? `x = \\dfrac{${nt(rhsX)}}{${nt(coeffX)}} = ${ft(xFrac)}`
          : `x = ${ft(xFrac)}`,
      ],
      note: s.step6Note("x", ft(xFrac)),
      color: "border-emerald-500/40 bg-emerald-900/20",
    });

    const xDisplay = ft(xFrac);
    const backSubExpr = exprForY(src.a, src.b, src.c).replace("x", `(${xDisplay})`);
    steps.push({
      title: s.step7Y,
      lines: [`y = ${backSubExpr}`, `y = ${ft(yFrac)}`],
      color: "border-orange-500/40 bg-orange-900/20",
    });

    const ok1 = Math.abs(p1.a * xVal + p1.b * yVal - p1.c) < 0.0001;
    const ok2 = Math.abs(p2.a * xVal + p2.b * yVal - p2.c) < 0.0001;
    steps.push({
      title: s.step8,
      lines: [
        `P1:\\; ${lhsTex(p1.a, p1.b)} = ${p1.a !== 0 ? `${nt(p1.a)}\\cdot${ft(xFrac)}` : ""}${p1.b !== 0 ? `${p1.b > 0 && p1.a !== 0 ? " + " : ""}${nt(p1.b)}\\cdot${ft(yFrac)}` : ""} = ${nt(p1.c)}\\; ${ok1 ? "\\checkmark" : "\\times"}`,
        `P2:\\; ${lhsTex(p2.a, p2.b)} = ${p2.a !== 0 ? `${nt(p2.a)}\\cdot${ft(xFrac)}` : ""}${p2.b !== 0 ? `${p2.b > 0 && p2.a !== 0 ? " + " : ""}${nt(p2.b)}\\cdot${ft(yFrac)}` : ""} = ${nt(p2.c)}\\; ${ok2 ? "\\checkmark" : "\\times"}`,
      ],
      note: ok1 && ok2 ? s.step8Ok : s.step8Fail,
      color: "border-green-500/40 bg-green-900/20",
    });

    steps.push({
      title: s.solution,
      lines: [`\\boxed{\\; x = ${ft(xFrac)}, \\quad y = ${ft(yFrac)} \\;}`],
      color: "border-yellow-500/40 bg-yellow-900/20",
      isAnswer: true,
    });

  } else {
    // isoVar === 'x'
    if (src.a === 0)
      return { steps: [], error: s.errNoX(isoEq) };

    const coeffY = tgt.b * src.a - tgt.a * src.b;
    const rhsY = tgt.c * src.a - tgt.a * src.c;

    if (coeffY === 0) {
      return { steps: [], error: rhsY === 0 ? s.errInfinite : s.errParallel };
    }

    const yFrac = red(rhsY, coeffY);
    const xNum = src.c * yFrac[1] - src.b * yFrac[0];
    const xDen = src.a * yFrac[1];
    const xFrac = red(xNum, xDen);
    const xVal = xFrac[0] / xFrac[1];
    const yVal = yFrac[0] / yFrac[1];

    const expr = exprForX(src.a, src.b, src.c);

    steps.push({
      title: s.step1,
      lines: [`\\begin{cases} P1:\\; ${eqTex(p1.a, p1.b, p1.c)} \\\\[4pt] P2:\\; ${eqTex(p2.a, p2.b, p2.c)} \\end{cases}`],
      note: s.step1NoteX(srcLbl, tgtLbl),
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
      title: s.step2X(srcLbl),
      lines: isolateLines,
      note: s.step2NoteX,
      color: "border-cyan-500/40 bg-cyan-900/20",
    });

    steps.push({
      title: s.step3(tgtLbl),
      lines: [
        `${tgtLbl}:\\; ${eqTex(tgt.a, tgt.b, tgt.c)}`,
        `\\underbrace{\\text{${s.subX}}}_{\\downarrow}`,
        subIntoTgtX(tgt.a, tgt.b, tgt.c, expr),
      ],
      note: s.step3NoteX(tgtLbl),
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
      title: s.step4,
      lines: [
        src.a !== 1 && src.a !== -1 ? s.expandAll(src.a) : s.expandBracket,
        expandLine,
      ],
      color: "border-blue-500/40 bg-blue-900/20",
    });

    steps.push({
      title: s.step5Y,
      lines: [`${lhsTex(0, coeffY)} = ${nt(rhsY)}`],
      color: "border-indigo-500/40 bg-indigo-900/20",
    });

    steps.push({
      title: s.step6Y,
      lines: [
        coeffY !== 1
          ? `y = \\dfrac{${nt(rhsY)}}{${nt(coeffY)}} = ${ft(yFrac)}`
          : `y = ${ft(yFrac)}`,
      ],
      note: s.step6Note("y", ft(yFrac)),
      color: "border-emerald-500/40 bg-emerald-900/20",
    });

    const yDisplay = ft(yFrac);
    const backSubExpr = exprForX(src.a, src.b, src.c).replace("y", `(${yDisplay})`);
    steps.push({
      title: s.step7X,
      lines: [`x = ${backSubExpr}`, `x = ${ft(xFrac)}`],
      color: "border-orange-500/40 bg-orange-900/20",
    });

    const ok1 = Math.abs(p1.a * xVal + p1.b * yVal - p1.c) < 0.0001;
    const ok2 = Math.abs(p2.a * xVal + p2.b * yVal - p2.c) < 0.0001;
    steps.push({
      title: s.step8,
      lines: [
        `P1:\\; ${lhsTex(p1.a, p1.b)} = ${p1.a !== 0 ? `${nt(p1.a)}\\cdot${ft(xFrac)}` : ""}${p1.b !== 0 ? `${p1.b > 0 && p1.a !== 0 ? " + " : ""}${nt(p1.b)}\\cdot${ft(yFrac)}` : ""} = ${nt(p1.c)}\\; ${ok1 ? "\\checkmark" : "\\times"}`,
        `P2:\\; ${lhsTex(p2.a, p2.b)} = ${p2.a !== 0 ? `${nt(p2.a)}\\cdot${ft(xFrac)}` : ""}${p2.b !== 0 ? `${p2.b > 0 && p2.a !== 0 ? " + " : ""}${nt(p2.b)}\\cdot${ft(yFrac)}` : ""} = ${nt(p2.c)}\\; ${ok2 ? "\\checkmark" : "\\times"}`,
      ],
      note: ok1 && ok2 ? s.step8Ok : s.step8Fail,
      color: "border-green-500/40 bg-green-900/20",
    });

    steps.push({
      title: s.solution,
      lines: [`\\boxed{\\; x = ${ft(xFrac)}, \\quad y = ${ft(yFrac)} \\;}`],
      color: "border-yellow-500/40 bg-yellow-900/20",
      isAnswer: true,
    });
  }

  return { steps, error: "" };
}

// ── Main component ────────────────────────────────────────────────────────────

const STEP_DELAY_MS = 1300;

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

const SubstitusiInteraktif: React.FC = () => {
  const { language } = useLanguage();
  const t = ui[language as keyof typeof ui] ?? ui.id;

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

    const { steps: s, error: e } = generateSteps(p1!, p2!, isoEq, isoVar, t);
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
    setSteps([]); setVisibleCount(0); setIsRunning(false);
    setDone(false); setError(""); setEq1Err(false); setEq2Err(false);
  };

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisibleCount(steps.length);
    setIsRunning(false);
    setDone(true);
  };

  return (
    <div className="space-y-4">

      {/* ── Input Panel ── */}
      <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-4 space-y-4">
        <p className="font-body text-sm font-bold text-cyan-300 text-center uppercase tracking-wide">
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
                onChange={(e) => { set(e.target.value); if (eq1Err || eq2Err) { setEq1Err(false); setEq2Err(false); } }}
                placeholder={ph}
                className={`w-full bg-slate-800/70 border rounded-xl px-3 py-2 text-sm font-mono text-white/90 placeholder-white/25 outline-none focus:ring-2 transition-all ${
                  err ? "border-red-500/60 focus:ring-red-500/30" : "border-cyan-500/30 focus:ring-cyan-500/30"
                }`}
              />
              {err && (
                <p className="text-[11px] text-red-400 font-body">
                  {t.errFmt} <span className="font-mono">2x + 3y = 6</span>
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <p className="font-body text-xs text-white/60">{t.isoFromLabel}</p>
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
                  {n === 1 ? t.isoEq1 : t.isoEq2}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-body text-xs text-white/60">{t.isoVarLabel}</p>
            <div className="flex gap-2">
              {(["x", "y"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => { playPopSound(); setIsoVar(v); }}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold font-body border transition-all ${
                    isoVar === v
                      ? "bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/30"
                      : "bg-slate-800/50 border-white/10 text-white/50 hover:border-white/30"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSolve}
            disabled={isRunning}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold font-body py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20"
          >
            <Play className="w-4 h-4" />
            {isRunning ? t.solveRunning : t.solveBtnLabel}
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
            {t.skipBtn}
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
            const visible = i < visibleCount;
            const cm = stepColorMap[step.color] ?? { border: "border-white/20", bg: "bg-slate-800/40", badge: "bg-slate-600 text-white" };

            return (
              <div
                key={i}
                className={`border ${cm.border} ${cm.bg} rounded-2xl overflow-hidden transition-all duration-700 ease-out ${
                  visible ? "opacity-100 translate-y-0 max-h-[600px]" : "opacity-0 translate-y-6 max-h-0 pointer-events-none overflow-hidden"
                }`}
              >
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
                    {step.lines.map((line, j) => (
                      <BlockMath key={j} math={line} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />

          {done && (
            <div className="text-center py-2">
              <ChevronDown className="w-4 h-4 text-white/20 mx-auto" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubstitusiInteraktif;
