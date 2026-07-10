import React, {
  useRef, useEffect, useState, useCallback, useLayoutEffect, useId,
} from "react";
import {
  ZoomIn, ZoomOut, RotateCcw, Grid3x3, Eye, EyeOff,
  Plus, Trash2, Download, MousePointer2, Move, Keyboard,
} from "lucide-react";
import { compile } from "mathjs";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ─── Types ─────────────────────────────────────────────── */
interface LineEntry {
  id: string;
  raw: string;
  color: string;
  visible: boolean;
  error: string | null;
}

interface ParsedEquation {
  kind: "slope" | "vertical" | "explicit-y" | "explicit-x" | "implicit" | "invalid";
  m: number;
  c: number;
  x?: number;
  fn?: (x: number) => number;
  fnX?: (y: number) => number;
  implicit?: (x: number, y: number) => number;
}

interface KeyPoint { x: number; y: number; label: string; color: string; }

/* ─── Preset colors ─────────────────────────────────────── */
const PALETTE = [
  "#22d3ee", "#a78bfa", "#4ade80", "#fb923c",
  "#f472b6", "#facc15", "#f87171", "#34d399",
];

/* ─── Math helpers ───────────────────────────────────────── */
function evalFrac(s: string): number | null {
  if (!s) return null;
  const parts = s.split("/");
  if (parts.length === 1) { const n = parseFloat(s); return isNaN(n) ? null : n; }
  if (parts.length === 2) {
    const a = parseFloat(parts[0]), b = parseFloat(parts[1]);
    if (isNaN(a) || isNaN(b) || b === 0) return null;
    return a / b;
  }
  return null;
}

function fmt(n: number): string {
  if (!isFinite(n)) return "∞";
  if (Math.abs(n) < 1e-10) return "0";
  if (Number.isInteger(n)) return String(n);
  const frac = toFraction(n);
  if (frac) return frac;
  return n.toFixed(2).replace(/\.?0+$/, "");
}

function toFraction(x: number): string | null {
  for (let d = 1; d <= 12; d++) {
    const n = Math.round(x * d);
    if (Math.abs(n / d - x) < 1e-9 && Math.abs(n) <= 24) {
      if (d === 1) return String(n);
      const g = gcd(Math.abs(n), d);
      return `${n / g}/${d / g}`;
    }
  }
  return null;
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

/* ─── Normalise input string ─────────────────────────────── */
function normalise(raw: string): string {
  return raw.trim()
    .replace(/\s+/g, "")
    .replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/")
    .replace(/π/g, "pi")
    .replace(/√\(/g, "sqrt(").replace(/√/g, "sqrt(")
    .toLowerCase();
}

/* ─── Linear parser (fast path) ─────────────────────────── */
function parseLinear(s: string): ParsedEquation | null {
  // x = k
  const xEq = /^x=(-?\d*\.?\d+(?:\/\d+)?)$/.exec(s);
  if (xEq) {
    const v = evalFrac(xEq[1]);
    return v !== null ? { kind: "vertical", m: 0, c: 0, x: v } : null;
  }

  // y = mx + c (explicit slope-intercept or constant)
  const yEq = /^y=(.+)$/.exec(s);
  if (yEq) {
    const rhs = yEq[1];
    const full = /^(-?\d*\.?\d*(?:\/\d+)?)\*?x([+-]\d*\.?\d+(?:\/\d+)?)?$/.exec(rhs);
    if (full) {
      const mRaw = full[1] === "" || full[1] === "-" ? (full[1] === "-" ? "-1" : "1") : full[1];
      const m = evalFrac(mRaw) ?? NaN;
      const c = full[2] ? evalFrac(full[2]) ?? NaN : 0;
      if (!isNaN(m) && !isNaN(c)) return { kind: "slope", m, c };
    }
    const constOnly = /^(-?\d*\.?\d+(?:\/\d+)?)$/.exec(rhs);
    if (constOnly) { const c = evalFrac(constOnly[1]); if (c !== null) return { kind: "slope", m: 0, c }; }
    const linX = /^(-?\d*\.?\d+(?:\/\d+)?)\*?x$/.exec(rhs);
    if (linX) { const m = evalFrac(linX[1]); if (m !== null) return { kind: "slope", m, c: 0 }; }
    // y = <ekspresi non-linear> → jangan diteruskan ke normalizeGeneral, biarkan parseCurve menangani
    return null;
  }

  // ax + by + c = 0  OR  ax + by = c  (general form)
  const general = normalizeGeneral(s);
  if (general) return general;

  // x/a + y/b = 1 (intercept form)
  const intercept = parseIntercept(s);
  if (intercept) return intercept;

  return null;
}

function normalizeGeneral(s: string): ParsedEquation | null {
  let eq = s, rhs = 0;
  const eqIdx = eq.indexOf("=");
  if (eqIdx !== -1) {
    const rhsStr = eq.slice(eqIdx + 1);
    rhs = evalFrac(rhsStr) ?? 0;
    eq = eq.slice(0, eqIdx);
  }

  // FIX: strip leading "+" from each term before matching
  const terms = eq.match(/[+-]?[^+-]+/g);
  if (!terms) return null;
  let A = 0, B = 0, C = 0;
  for (const rawT of terms) {
    const t = rawT.replace(/^\+/, ""); // strip leading + (keep -)
    const xT = /^(-?\d*\.?\d*(?:\/\d+)?)\*?x$/.exec(t);
    const yT = /^(-?\d*\.?\d*(?:\/\d+)?)\*?y$/.exec(t);
    const cT = /^(-?\d*\.?\d+(?:\/\d+)?)$/.exec(t);
    if (xT) {
      const coeff = xT[1];
      A += evalFrac(coeff === "" || coeff === "+" ? "1" : coeff === "-" ? "-1" : coeff) ?? 0;
    } else if (yT) {
      const coeff = yT[1];
      B += evalFrac(coeff === "" || coeff === "+" ? "1" : coeff === "-" ? "-1" : coeff) ?? 0;
    } else if (cT) {
      C += evalFrac(cT[1]) ?? 0;
    } else {
      return null;
    }
  }
  C -= rhs;
  if (Math.abs(B) < 1e-12) {
    if (Math.abs(A) < 1e-12) return null;
    return { kind: "vertical", m: 0, c: 0, x: -C / A };
  }
  const m = -A / B, c = -C / B;
  if (isNaN(m) || isNaN(c)) return null;
  return { kind: "slope", m, c };
}

function parseIntercept(s: string): ParsedEquation | null {
  const m = /^x\/(-?\d*\.?\d+)\+?y\/(-?\d*\.?\d+)=1$/.exec(s) ||
            /^x\/(-?\d*\.?\d+)-y\/(-?\d*\.?\d+)=1$/.exec(s);
  if (!m) return null;
  const a = parseFloat(m[1]), b = parseFloat(m[2]);
  if (!a || !b) return null;
  return { kind: "slope", m: -b / a, c: b };
}

/* ─── LaTeX preview helper ───────────────────────────────── */
function toLatex(raw: string): string {
  return raw
    .trim()
    .replace(/sqrt\(([^)]*)\)/g, "\\sqrt{$1}")
    .replace(/abs\(([^)]*)\)/g, "\\left|$1\\right|")
    .replace(/\bsin\b/g, "\\sin")
    .replace(/\bcos\b/g, "\\cos")
    .replace(/\btan\b/g, "\\tan")
    .replace(/\bln\b/g, "\\ln")
    .replace(/\bpi\b/g, "\\pi")
    .replace(/\*/g, "\\cdot ")
    .replace(/\^\(([^)]*)\)/g, "^{$1}")
    .replace(/\^(-?\d+(?:\.\d+)?)/g, "^{$1}");
}

function LatexPreview({ raw, color }: { raw: string; color?: string }) {
  const tex = toLatex(raw);
  try {
    return (
      <span className="text-sm" style={{ color: color ?? "#67e8f9" }}>
        <InlineMath math={tex} />
      </span>
    );
  } catch {
    return <span className="text-xs font-mono text-white/40">{raw}</span>;
  }
}

/* ─── Curve parser (mathjs path) ────────────────────────── */
const compiledCache = new Map<string, ReturnType<typeof compile>>();
function safeCompile(expr: string) {
  if (compiledCache.has(expr)) return compiledCache.get(expr)!;
  const c = compile(expr);
  compiledCache.set(expr, c);
  return c;
}

function parseCurve(s: string): ParsedEquation | null {
  const eqIdx = s.indexOf("=");

  // y = f(x)
  if (s.startsWith("y=")) {
    const rhs = s.slice(2);
    try {
      const comp = safeCompile(rhs);
      const fn = (x: number) => {
        try { const r = comp.evaluate({ x, pi: Math.PI, e: Math.E }); return typeof r === "number" ? r : NaN; }
        catch { return NaN; }
      };
      fn(0); // test
      return { kind: "explicit-y", m: 0, c: 0, fn };
    } catch { return null; }
  }

  // x = f(y)
  if (s.startsWith("x=")) {
    const rhs = s.slice(2);
    if (/[y]/.test(rhs)) {
      try {
        const comp = safeCompile(rhs);
        const fnX = (y: number) => {
          try { const r = comp.evaluate({ y, pi: Math.PI, e: Math.E }); return typeof r === "number" ? r : NaN; }
          catch { return NaN; }
        };
        fnX(0);
        return { kind: "explicit-x", m: 0, c: 0, fnX };
      } catch { return null; }
    }
  }

  // implicit: lhs = rhs
  if (eqIdx !== -1) {
    const lhs = s.slice(0, eqIdx);
    const rhs = s.slice(eqIdx + 1);
    try {
      const lComp = safeCompile(lhs);
      const rComp = safeCompile(rhs);
      const implicit = (x: number, y: number) => {
        try {
          const scope = { x, y, pi: Math.PI, e: Math.E };
          const l = lComp.evaluate(scope);
          const r = rComp.evaluate(scope);
          if (typeof l !== "number" || typeof r !== "number") return NaN;
          return l - r;
        } catch { return NaN; }
      };
      implicit(1, 1); // test
      return { kind: "implicit", m: 0, c: 0, implicit };
    } catch { return null; }
  }

  return null;
}

/* ─── Main parser ─────────────────────────────────────────── */
function parseEquation(raw: string): ParsedEquation {
  const s = normalise(raw);
  if (!s) return { kind: "invalid", m: 0, c: 0 };

  // Try fast linear path first
  const linear = parseLinear(s);
  if (linear) return linear;

  // Try mathjs curve path
  const curve = parseCurve(s);
  if (curve) return curve;

  return { kind: "invalid", m: 0, c: 0 };
}

/* ─── Key points (linear only) ───────────────────────────── */
function findKeyPoints(eq: ParsedEquation, color: string): KeyPoint[] {
  if (eq.kind !== "slope" && eq.kind !== "vertical") return [];
  const pts: KeyPoint[] = [];
  if (eq.kind === "vertical") {
    pts.push({ x: eq.x!, y: 0, label: `(${fmt(eq.x!)}, 0)`, color });
    return pts;
  }
  const { m, c } = eq;
  pts.push({ x: 0, y: c, label: `(0, ${fmt(c)})`, color });
  if (Math.abs(m) > 1e-10) {
    const xi = -c / m;
    pts.push({ x: xi, y: 0, label: `(${fmt(xi)}, 0)`, color });
  }
  return pts;
}

/* ─── Canvas: grid ───────────────────────────────────────── */
function niceStep(unitPx: number): number {
  const raw = 70 / unitPx;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / pow;
  if (norm < 1.5) return pow;
  if (norm < 3.5) return 2 * pow;
  if (norm < 7.5) return 5 * pow;
  return 10 * pow;
}

function drawGrid(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  oX: number, oY: number, unitPx: number,
  showGrid: boolean, showLabels: boolean,
) {
  ctx.clearRect(0, 0, W, H);
  const step = niceStep(unitPx);
  const sX = Math.floor(-oX / unitPx / step) * step;
  const eX = Math.ceil((W - oX) / unitPx / step) * step;
  const sY = Math.ceil((oY - H) / unitPx / step) * step;
  const eY = Math.floor(oY / unitPx / step) * step;

  if (showGrid) {
    ctx.strokeStyle = "rgba(148,163,184,0.12)"; ctx.lineWidth = 1;
    for (let gx = sX; gx <= eX; gx += step) {
      const px = oX + gx * unitPx;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    }
    for (let gy = sY; gy <= eY; gy += step) {
      const py = oY - gy * unitPx;
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    }
  }

  ctx.strokeStyle = "rgba(148,163,184,0.6)"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, oY); ctx.lineTo(W, oY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(oX, 0); ctx.lineTo(oX, H); ctx.stroke();

  const aw = 7, ah = 5;
  ctx.fillStyle = "rgba(148,163,184,0.6)";
  ctx.beginPath(); ctx.moveTo(W, oY); ctx.lineTo(W - aw, oY - ah); ctx.lineTo(W - aw, oY + ah); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(oX, 0); ctx.lineTo(oX - ah, aw); ctx.lineTo(oX + ah, aw); ctx.closePath(); ctx.fill();

  if (showLabels) {
    ctx.fillStyle = "rgba(148,163,184,0.8)";
    ctx.font = `${Math.max(9, Math.min(12, unitPx * 0.3))}px monospace`;
    ctx.textAlign = "center";
    for (let gx = sX; gx <= eX; gx += step) {
      if (Math.abs(gx) < 1e-9) continue;
      const px = oX + gx * unitPx;
      ctx.beginPath(); ctx.moveTo(px, oY - 4); ctx.lineTo(px, oY + 4);
      ctx.strokeStyle = "rgba(148,163,184,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      if (px > 8 && px < W - 8) ctx.fillText(fmt(gx), px, oY + 14);
    }
    ctx.textAlign = "right";
    for (let gy = sY; gy <= eY; gy += step) {
      if (Math.abs(gy) < 1e-9) continue;
      const py = oY - gy * unitPx;
      ctx.beginPath(); ctx.moveTo(oX - 4, py); ctx.lineTo(oX + 4, py);
      ctx.strokeStyle = "rgba(148,163,184,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      if (py > 8 && py < H - 8) ctx.fillText(fmt(gy), oX - 7, py + 4);
    }
    ctx.fillStyle = "rgba(148,163,184,0.9)"; ctx.font = "bold 13px monospace";
    ctx.textAlign = "left"; ctx.fillText("x", W - 14, oY - 8);
    ctx.textAlign = "center"; ctx.fillText("y", oX + 10, 12); ctx.fillText("O", oX + 10, oY + 14);
  }
}

/* ─── Canvas: draw all equations ─────────────────────────── */
function drawEquations(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  oX: number, oY: number, unitPx: number,
  lines: LineEntry[],
) {
  for (const line of lines) {
    if (!line.visible || line.error) continue;
    const eq = parseEquation(line.raw);
    if (eq.kind === "invalid") continue;

    ctx.strokeStyle = line.color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = line.color;
    ctx.shadowBlur = 5;

    if (eq.kind === "vertical") {
      const px = oX + (eq.x ?? 0) * unitPx;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();

    } else if (eq.kind === "slope") {
      const xl = -oX / unitPx, xr = (W - oX) / unitPx;
      const yl = eq.m * xl + eq.c, yr = eq.m * xr + eq.c;
      ctx.beginPath();
      ctx.moveTo(oX + xl * unitPx, oY - yl * unitPx);
      ctx.lineTo(oX + xr * unitPx, oY - yr * unitPx);
      ctx.stroke();

    } else if (eq.kind === "explicit-y" && eq.fn) {
      ctx.beginPath();
      let penDown = false, prevPy = 0;
      const jumpThresh = H * 1.5;
      for (let px = 0; px <= W; px++) {
        const x = (px - oX) / unitPx;
        const y = eq.fn(x);
        if (!isFinite(y) || isNaN(y)) { penDown = false; continue; }
        const py = oY - y * unitPx;
        if (penDown && Math.abs(py - prevPy) > jumpThresh) penDown = false;
        if (!penDown) { ctx.moveTo(px, py); penDown = true; }
        else ctx.lineTo(px, py);
        prevPy = py;
      }
      ctx.stroke();

    } else if (eq.kind === "explicit-x" && eq.fnX) {
      ctx.beginPath();
      let penDown = false, prevPx2 = 0;
      const jumpThresh = W * 1.5;
      for (let py = 0; py <= H; py++) {
        const y = (oY - py) / unitPx;
        const x = eq.fnX(y);
        if (!isFinite(x) || isNaN(x)) { penDown = false; continue; }
        const px = oX + x * unitPx;
        if (penDown && Math.abs(px - prevPx2) > jumpThresh) penDown = false;
        if (!penDown) { ctx.moveTo(px, py); penDown = true; }
        else ctx.lineTo(px, py);
        prevPx2 = px;
      }
      ctx.stroke();

    } else if (eq.kind === "implicit" && eq.implicit) {
      // Grid scan: detect zero-crossings per 3×3 cell
      const STEP = 3;
      ctx.shadowBlur = 0;
      ctx.fillStyle = line.color;
      for (let px = 0; px < W - STEP; px += STEP) {
        for (let py = 0; py < H - STEP; py += STEP) {
          const x0 = (px - oX) / unitPx;
          const y0 = (oY - py) / unitPx;
          const x1 = (px + STEP - oX) / unitPx;
          const y1 = (oY - (py + STEP)) / unitPx;
          const v00 = eq.implicit(x0, y0);
          const v10 = eq.implicit(x1, y0);
          const v01 = eq.implicit(x0, y1);
          const v11 = eq.implicit(x1, y1);
          if ([v00, v10, v01, v11].some(isNaN)) continue;
          const signs = [v00 > 0, v10 > 0, v01 > 0, v11 > 0];
          const anyDiff = signs.some(b => b !== signs[0]);
          if (anyDiff) ctx.fillRect(px, py, STEP, STEP);
        }
      }
    }

    ctx.shadowBlur = 0;
  }
}

/* ─── Canvas: key points ─────────────────────────────────── */
function drawPoints(
  ctx: CanvasRenderingContext2D, oX: number, oY: number, unitPx: number,
  lines: LineEntry[], show: boolean,
) {
  if (!show) return;
  const seen = new Set<string>();
  for (const line of lines) {
    if (!line.visible || line.error) continue;
    const eq = parseEquation(line.raw);
    for (const pt of findKeyPoints(eq, line.color)) {
      const key = `${pt.x.toFixed(4)},${pt.y.toFixed(4)}`;
      if (seen.has(key)) continue; seen.add(key);
      const px = oX + pt.x * unitPx, py = oY - pt.y * unitPx;
      if (px < -20 || px > ctx.canvas.width + 20 || py < -20 || py > ctx.canvas.height + 20) continue;
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = pt.color; ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
    }
  }
}

/* ─── Canvas: intersections (linear only) ───────────────── */
function drawIntersections(
  ctx: CanvasRenderingContext2D, oX: number, oY: number, unitPx: number, lines: LineEntry[],
) {
  const vis = lines.filter(l => l.visible && !l.error);
  for (let i = 0; i < vis.length; i++) {
    for (let j = i + 1; j < vis.length; j++) {
      const p1 = parseEquation(vis[i].raw), p2 = parseEquation(vis[j].raw);
      if ((p1.kind !== "slope" && p1.kind !== "vertical") ||
          (p2.kind !== "slope" && p2.kind !== "vertical")) continue;
      let ix: number, iy: number;
      if (p1.kind === "vertical" && p2.kind === "vertical") continue;
      if (p1.kind === "vertical") { ix = p1.x!; iy = p2.m * ix + p2.c; }
      else if (p2.kind === "vertical") { ix = p2.x!; iy = p1.m * ix + p1.c; }
      else {
        if (Math.abs(p1.m - p2.m) < 1e-10) continue;
        ix = (p2.c - p1.c) / (p1.m - p2.m); iy = p1.m * ix + p1.c;
      }
      const px = oX + ix * unitPx, py = oY - iy * unitPx;
      if (px < -10 || px > ctx.canvas.width + 10 || py < -10 || py > ctx.canvas.height + 10) continue;
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(250,204,21,0.9)"; ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
    }
  }
}

/* ─── Canvas: cursor ─────────────────────────────────────── */
function drawCursor(
  ctx: CanvasRenderingContext2D, mx: number, my: number,
  oX: number, oY: number, unitPx: number,
) {
  ctx.strokeStyle = "rgba(148,163,184,0.25)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, ctx.canvas.height); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(ctx.canvas.width, my); ctx.stroke();
  ctx.setLineDash([]);
  const label = `(${((mx - oX) / unitPx).toFixed(2)}, ${((oY - my) / unitPx).toFixed(2)})`;
  ctx.font = "11px monospace";
  const tw = ctx.measureText(label).width;
  let lx = mx + 8, ly = my - 8;
  if (lx + tw + 10 > ctx.canvas.width) lx = mx - tw - 14;
  if (ly - 18 < 0) ly = my + 22;
  ctx.fillStyle = "rgba(15,23,42,0.85)";
  ctx.beginPath(); ctx.roundRect(lx - 4, ly - 14, tw + 12, 20, 4); ctx.fill();
  ctx.fillStyle = "#22d3ee"; ctx.fillText(label, lx + 2, ly);
}

/* ─── Math Keyboard ──────────────────────────────────────── */
interface MathKeyboardProps {
  value: string;
  onChange: (newValue: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onTemplate: (eq: string) => void;
}

const SYMBOL_ROWS: { label: string; insert: string; move?: number; title: string }[][] = [
  [
    { label: "x", insert: "x", title: "Variabel x" },
    { label: "y", insert: "y", title: "Variabel y" },
    { label: "^", insert: "^", title: "Pangkat" },
    { label: "x²", insert: "^2", title: "Kuadrat" },
    { label: "x³", insert: "^3", title: "Kubik" },
    { label: "xⁿ", insert: "^()", move: -1, title: "Pangkat n" },
  ],
  [
    { label: "√()", insert: "sqrt()", move: -1, title: "Akar kuadrat" },
    { label: "∛()", insert: "cbrt()", move: -1, title: "Akar kubik" },
    { label: "|()|", insert: "abs()", move: -1, title: "Nilai mutlak" },
    { label: "()", insert: "()", move: -1, title: "Kurung" },
    { label: "π", insert: "pi", title: "Pi (3.14159...)" },
    { label: "e", insert: "e", title: "Bilangan Euler" },
  ],
  [
    { label: "sin", insert: "sin()", move: -1, title: "Sinus" },
    { label: "cos", insert: "cos()", move: -1, title: "Kosinus" },
    { label: "tan", insert: "tan()", move: -1, title: "Tangen" },
    { label: "ln", insert: "log()", move: -1, title: "Logaritma natural" },
    { label: "log", insert: "log10()", move: -3, title: "Log basis 10" },
    { label: "1/x", insert: "1/()", move: -1, title: "Kebalikan / Hiperbola" },
  ],
];

const CURVE_TEMPLATES: { label: string; eq: string; desc: string; color: string }[] = [
  { label: "y = x²", eq: "y = x^2", desc: "Parabola", color: "#22d3ee" },
  { label: "y = x³", eq: "y = x^3", desc: "Kubik", color: "#a78bfa" },
  { label: "y = √x", eq: "y = sqrt(x)", desc: "Akar kuadrat", color: "#4ade80" },
  { label: "y = 1/x", eq: "y = 1/x", desc: "Hiperbola", color: "#fb923c" },
  { label: "y = x²−4", eq: "y = x^2 - 4", desc: "Parabola geser", color: "#f472b6" },
  { label: "x²+y²=25", eq: "x^2 + y^2 = 25", desc: "Lingkaran", color: "#facc15" },
  { label: "x²/9+y²/4=1", eq: "x^2/9 + y^2/4 = 1", desc: "Elips", color: "#34d399" },
  { label: "x²/9−y²/4=1", eq: "x^2/9 - y^2/4 = 1", desc: "Hiperbola", color: "#f87171" },
  { label: "y = sin(x)", eq: "y = sin(x)", desc: "Sinus", color: "#60a5fa" },
  { label: "y = cos(x)", eq: "y = cos(x)", desc: "Kosinus", color: "#c084fc" },
  { label: "y = |x|", eq: "y = abs(x)", desc: "Nilai mutlak", color: "#fbbf24" },
  { label: "xy = 4", eq: "x * y = 4", desc: "Hiperbola persegi", color: "#86efac" },
];

function MathKeyboard({ value, onChange, inputRef, onTemplate }: MathKeyboardProps) {
  const handleInsert = (insert: string, move?: number) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const newVal = before + insert + after;
    const newCursor = start + insert.length + (move ?? 0);
    onChange(newVal);
    setTimeout(() => {
      if (el) { el.focus(); el.setSelectionRange(newCursor, newCursor); }
    }, 0);
  };

  return (
    <div className="bg-slate-800/90 border border-white/10 rounded-xl p-3 space-y-3">
      {/* Symbol rows */}
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Simbol & Fungsi</p>
        {SYMBOL_ROWS.map((row, ri) => (
          <div key={ri} className="flex flex-wrap gap-1">
            {row.map(({ label, insert, move, title }) => (
              <button
                key={label}
                onClick={() => handleInsert(insert, move)}
                title={title}
                className="min-w-[40px] px-2 py-1.5 bg-slate-700/80 hover:bg-cyan-700/60 border border-white/10 hover:border-cyan-500/50 rounded-lg text-xs font-mono text-white/90 transition-colors active:scale-95"
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Template presets */}
      <div className="space-y-1.5 border-t border-white/10 pt-3">
        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Template Kurva Cepat</p>
        <div className="grid grid-cols-2 gap-1">
          {CURVE_TEMPLATES.map(({ label, eq, desc, color }) => (
            <button
              key={label}
              onClick={() => onTemplate(eq)}
              title={`Masukkan: ${eq} (${desc})`}
              className="flex items-center gap-2 px-2 py-1.5 bg-slate-700/60 hover:bg-slate-600/80 border border-white/10 rounded-lg transition-colors active:scale-95 text-left"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <span className="font-mono text-xs truncate" style={{ color }}>{label}</span>
              <span className="text-white/30 text-xs ml-auto shrink-0">{desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
const INITIAL_UNIT = 50;

export default function GeoGebraGrapher() {
  const uid = useId().replace(/:/g, "");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [size, setSize] = useState({ w: 600, h: 420 });
  const [unitPx, setUnitPx] = useState(INITIAL_UNIT);
  const [origin, setOrigin] = useState({ x: 300, y: 210 });
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [showIntersections, setShowIntersections] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [tool, setTool] = useState<"pointer" | "pan">("pointer");
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [lines, setLines] = useState<LineEntry[]>([
    { id: uid + "0", raw: "y = 2x + 1", color: PALETTE[0], visible: true, error: null },
    { id: uid + "1", raw: "y = -x + 3", color: PALETTE[1], visible: true, error: null },
  ]);
  const [input, setInput] = useState("");
  const [colorIdx, setColorIdx] = useState(2);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current; if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      const h = Math.max(340, Math.min(500, width * 0.65));
      setSize({ w: width, h });
      setOrigin({ x: width / 2, y: h / 2 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const { w, h } = size;
    canvas.width = w; canvas.height = h;
    drawGrid(ctx, w, h, origin.x, origin.y, unitPx, showGrid, showLabels);
    drawEquations(ctx, w, h, origin.x, origin.y, unitPx, lines);
    drawPoints(ctx, origin.x, origin.y, unitPx, lines, showPoints);
    if (showIntersections) drawIntersections(ctx, origin.x, origin.y, unitPx, lines);
    if (cursor) drawCursor(ctx, cursor.x, cursor.y, origin.x, origin.y, unitPx);
  }, [size, unitPx, origin, showGrid, showLabels, showPoints, showIntersections, lines, cursor]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    if (dragRef.current && tool === "pan") {
      setOrigin({ x: dragRef.current.origX + mx - dragRef.current.startX, y: dragRef.current.origY + my - dragRef.current.startY });
    }
    if (tool === "pointer") setCursor({ x: mx, y: my });
  }, [tool]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = { startX: e.clientX - rect.left, startY: e.clientY - rect.top, origX: origin.x, origY: origin.y };
  }, [origin]);

  const onMouseUp = useCallback(() => { dragRef.current = null; }, []);
  const onMouseLeave = useCallback(() => { dragRef.current = null; setCursor(null); }, []);

  const onWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    setUnitPx(u => Math.max(8, Math.min(200, u * factor)));
    setOrigin(prev => ({ x: mx + (prev.x - mx) * factor, y: my + (prev.y - my) * factor }));
  }, []);

  const touchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const t = e.touches[0];
      touchRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top, dist: 0 };
      dragRef.current = { startX: t.clientX - rect.left, startY: t.clientY - rect.top, origX: origin.x, origY: origin.y };
    }
  }, [origin]);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.touches.length === 1 && dragRef.current) {
      const t = e.touches[0];
      setOrigin({ x: dragRef.current.origX + t.clientX - rect.left - dragRef.current.startX, y: dragRef.current.origY + t.clientY - rect.top - dragRef.current.startY });
    } else if (e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      if (touchRef.current && touchRef.current.dist > 0) {
        const factor = dist / touchRef.current.dist;
        setUnitPx(u => Math.max(8, Math.min(200, u * factor)));
      }
      if (touchRef.current) touchRef.current.dist = dist;
    }
  }, []);

  const onTouchEnd = useCallback(() => { dragRef.current = null; if (touchRef.current) touchRef.current.dist = 0; }, []);

  const addLine = useCallback((raw?: string) => {
    const r = (raw ?? input).trim();
    if (!r) return;
    const eq = parseEquation(r);
    const newLine: LineEntry = {
      id: uid + Date.now(), raw: r,
      color: PALETTE[colorIdx % PALETTE.length],
      visible: true,
      error: eq.kind === "invalid" ? "Persamaan tidak dikenali" : null,
    };
    setLines(prev => [...prev, newLine]);
    if (!raw) setInput("");
    setColorIdx(c => c + 1);
  }, [input, colorIdx, uid]);

  const toggleLine = useCallback((id: string) => setLines(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l)), []);
  const removeLine = useCallback((id: string) => setLines(prev => prev.filter(l => l.id !== id)), []);

  const updateLineRaw = useCallback((id: string, raw: string) => {
    const eq = parseEquation(raw);
    setLines(prev => prev.map(l => l.id === id ? { ...l, raw, error: raw && eq.kind === "invalid" ? "Persamaan tidak dikenali" : null } : l));
  }, []);

  const changeLineColor = useCallback((id: string, color: string) => setLines(prev => prev.map(l => l.id === id ? { ...l, color } : l)), []);

  const reset = useCallback(() => {
    setUnitPx(INITIAL_UNIT);
    setOrigin({ x: size.w / 2, y: size.h / 2 });
  }, [size]);

  const downloadCanvas = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const link = document.createElement("a");
    link.download = "grafik-persamaan.png"; link.href = canvas.toDataURL(); link.click();
  }, []);

  const zoom = useCallback((factor: number) => {
    setUnitPx(u => Math.max(8, Math.min(200, u * factor)));
    setOrigin(prev => ({ x: size.w / 2 + (prev.x - size.w / 2) * factor, y: size.h / 2 + (prev.y - size.h / 2) * factor }));
  }, [size]);

  const handleTemplate = useCallback((eq: string) => {
    setInput(eq);
    setShowKeyboard(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const originMath = { x: (-origin.x / unitPx).toFixed(1), y: (origin.y / unitPx).toFixed(1) };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur overflow-hidden select-none">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-white/10 bg-slate-800/60">
        <span className="font-display font-bold text-cyan-300 text-sm mr-1">📐 GrafikPGL</span>
        <div className="flex gap-1">
          <ToolBtn active={tool === "pointer"} onClick={() => setTool("pointer")} title="Pointer / Koordinat"><MousePointer2 className="w-4 h-4" /></ToolBtn>
          <ToolBtn active={tool === "pan"} onClick={() => setTool("pan")} title="Geser Bidang"><Move className="w-4 h-4" /></ToolBtn>
        </div>
        <div className="w-px h-5 bg-white/20 mx-1" />
        <div className="flex gap-1">
          <ToolBtn onClick={() => zoom(1.25)} title="Perbesar"><ZoomIn className="w-4 h-4" /></ToolBtn>
          <ToolBtn onClick={() => zoom(0.8)} title="Perkecil"><ZoomOut className="w-4 h-4" /></ToolBtn>
          <ToolBtn onClick={reset} title="Reset Tampilan"><RotateCcw className="w-4 h-4" /></ToolBtn>
        </div>
        <div className="w-px h-5 bg-white/20 mx-1" />
        <div className="flex gap-1">
          <ToolBtn active={showGrid} onClick={() => setShowGrid(s => !s)} title="Tampilkan Grid"><Grid3x3 className="w-4 h-4" /></ToolBtn>
          <ToolBtn active={showPoints} onClick={() => setShowPoints(s => !s)} title="Titik Kunci">{showPoints ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</ToolBtn>
        </div>
        <div className="ml-auto"><ToolBtn onClick={downloadCanvas} title="Unduh Gambar"><Download className="w-4 h-4" /></ToolBtn></div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Canvas */}
        <div ref={containerRef} className="flex-1 relative" style={{ minWidth: 0 }}>
          <canvas
            ref={canvasRef} width={size.w} height={size.h}
            style={{ display: "block", width: "100%", cursor: tool === "pan" ? "grab" : "crosshair", background: "rgb(10,17,32)" }}
            onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave} onWheel={onWheel}
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          />
          <div className="absolute bottom-2 left-2 text-xs text-white/30 font-mono pointer-events-none">
            pusat ({originMath.x}, {originMath.y}) | skala {unitPx.toFixed(0)}px/unit
          </div>
        </div>

        {/* Equation panel */}
        <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/10 bg-slate-900/60 flex flex-col">
          {/* Add equation */}
          <div className="p-3 border-b border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Tambah Persamaan</p>
              <button
                onClick={() => setShowKeyboard(k => !k)}
                title="Papan Matematika"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${showKeyboard ? "bg-cyan-600/40 border border-cyan-500/50 text-cyan-300" : "bg-slate-700/60 border border-white/10 text-white/50 hover:text-white/80"}`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Keyboard</span>
              </button>
            </div>

            <div className="flex gap-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addLine()}
                placeholder="y = 2x + 1"
                className="flex-1 bg-slate-800 border border-white/20 rounded-lg px-2 py-1.5 text-sm text-white placeholder-white/30 font-mono focus:outline-none focus:border-cyan-500"
              />
              <button onClick={() => addLine()} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg px-2 py-1.5 transition-colors" title="Tambah">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {input.trim() && (
              <div className="px-2 py-1 bg-slate-800/60 rounded-lg border border-white/10 min-h-[28px] flex items-center">
                <LatexPreview raw={input} />
              </div>
            )}

            {/* Math keyboard panel */}
            {showKeyboard && (
              <MathKeyboard
                value={input}
                onChange={setInput}
                inputRef={inputRef}
                onTemplate={handleTemplate}
              />
            )}

            {/* Format hints */}
            {!showKeyboard && (
              <div className="text-xs text-white/40 space-y-0.5">
                <p className="text-white/50 font-semibold">Format yang didukung:</p>
                <p className="font-mono text-white/60">y = 2x + 1</p>
                <p className="font-mono text-white/60">2x + 3y = 6</p>
                <p className="font-mono text-white/60">3x - 2y + 6 = 0</p>
                <p className="font-mono text-white/60">x/4 + y/3 = 1</p>
                <p className="font-mono text-cyan-400">y = x^2 - 4x + 3</p>
                <p className="font-mono text-cyan-400">x^2 + y^2 = 25</p>
                <p className="font-mono text-cyan-400">y = sin(x)</p>
              </div>
            )}
          </div>

          {/* Line list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ maxHeight: showKeyboard ? 160 : undefined }}>
            {lines.length === 0 && (
              <p className="text-xs text-white/30 text-center py-4">Belum ada persamaan.<br />Ketik dan tekan Enter!</p>
            )}
            {lines.map((line) => {
              const eq = parseEquation(line.raw);
              const isLinear = eq.kind === "slope" || eq.kind === "vertical";
              const isCurve = eq.kind === "explicit-y" || eq.kind === "explicit-x" || eq.kind === "implicit";
              const typeLabel = eq.kind === "vertical" ? "vertikal"
                : eq.kind === "slope" ? "garis"
                : eq.kind === "explicit-y" ? "kurva y=f(x)"
                : eq.kind === "explicit-x" ? "kurva x=g(y)"
                : eq.kind === "implicit" ? "kurva implisit"
                : null;
              return (
                <div key={line.id} className={`rounded-xl border p-2 space-y-1.5 ${line.error ? "border-red-500/40 bg-red-900/10" : "border-white/10 bg-slate-800/40"}`}>
                  <div className="flex items-center gap-1.5">
                    <div className="relative">
                      <input type="color" value={line.color} onChange={e => changeLineColor(line.id, e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      <div className="w-4 h-4 rounded-full border border-white/30 shrink-0" style={{ background: line.color }} />
                    </div>
                    <input type="text" value={line.raw} onChange={e => updateLineRaw(line.id, e.target.value)} className="flex-1 bg-transparent text-xs font-mono text-white/60 focus:outline-none min-w-0" />
                    <button onClick={() => toggleLine(line.id)} className="text-white/40 hover:text-white/80 transition-colors shrink-0">{line.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>
                    <button onClick={() => removeLine(line.id)} className="text-white/40 hover:text-red-400 transition-colors shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="pl-6">
                    <LatexPreview raw={line.raw} color={line.color} />
                  </div>
                  {line.error && <p className="text-xs text-red-400">{line.error}</p>}
                  {!line.error && line.visible && typeLabel && (
                    <div className="space-y-0.5">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${line.color}20`, color: line.color }}>{typeLabel}</span>
                      {isLinear && (() => {
                        const pts = findKeyPoints(eq, line.color);
                        return (
                          <>
                            {pts.map((pt, i) => <p key={i} className="text-xs font-mono" style={{ color: line.color }}>{pt.label}</p>)}
                            {eq.kind === "slope" && <p className="text-xs text-white/40">m = {fmt(eq.m)} · c = {fmt(eq.c)}</p>}
                          </>
                        );
                      })()}
                      {isCurve && <p className="text-xs text-white/30">gunakan scroll untuk zoom</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Settings toggles */}
          <div className="p-2 border-t border-white/10 space-y-1">
            <Toggle label="Titik Perpotongan" checked={showIntersections} onChange={setShowIntersections} />
            <Toggle label="Label Sumbu" checked={showLabels} onChange={setShowLabels} />
          </div>
        </div>
      </div>

      {/* Help bar */}
      <div className="px-3 py-1.5 border-t border-white/10 bg-slate-800/40 text-xs text-white/40 flex flex-wrap gap-x-4 gap-y-0.5">
        <span>🖱️ Scroll = zoom</span>
        <span>🤏 Pinch = zoom (sentuh)</span>
        <span>✋ Mode Geser = seret bidang</span>
        <span>👆 Hover = koordinat</span>
        <span>🟡 Titik kuning = perpotongan garis</span>
        <span>⌨️ Klik Keyboard = input kurva</span>
      </div>
    </div>
  );
}

/* ─── Small UI helpers ───────────────────────────────────── */
function ToolBtn({ children, onClick, title, active }: {
  children: React.ReactNode; onClick: () => void; title: string; active?: boolean;
}) {
  return (
    <button onClick={onClick} title={title}
      className={`p-1.5 rounded-lg transition-colors ${active ? "bg-cyan-600/40 text-cyan-300 border border-cyan-500/40" : "text-white/60 hover:text-white/90 hover:bg-white/10 border border-transparent"}`}>
      {children}
    </button>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div onClick={() => onChange(!checked)} className={`w-8 h-4 rounded-full transition-colors ${checked ? "bg-cyan-600" : "bg-slate-700"}`}>
        <div className={`w-3 h-3 rounded-full bg-white mt-0.5 transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <span className="text-xs text-white/50">{label}</span>
    </label>
  );
}
