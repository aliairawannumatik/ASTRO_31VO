import React, { useState, useRef, useCallback } from "react";
import { RefreshCw, CheckCircle2, AlertTriangle, Info, Pencil } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ─── Grid constants ─────────────────────── */
const SVG_W = 360;
const SVG_H = 360;
const PAD   = 44;
const GMAX  = 8;
const UNIT  = (SVG_W - 2 * PAD) / GMAX;   // ~34 px per grid unit
const DOT_R = 9;

type Pt      = { x: number; y: number };   // integer math coords
type DotId   = "A1" | "B1" | "A2" | "B2";
type Phase   = "arrange" | "draw1" | "draw2" | "done";

/* ─── Coordinate helpers ─────────────────── */
const toSVG = (p: Pt) => ({
  sx: PAD + p.x * UNIT,
  sy: PAD + (GMAX - p.y) * UNIT,
});

const toGrid = (sx: number, sy: number): Pt => ({
  x: Math.max(0, Math.min(GMAX, Math.round((sx - PAD) / UNIT))),
  y: Math.max(0, Math.min(GMAX, Math.round(GMAX - (sy - PAD) / UNIT))),
});

/* ─── Math helpers ───────────────────────── */
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
function gcd3(a: number, b: number, c: number) { return gcd(gcd(a || 1, b || 1), c || 1); }

function lineStdForm(p1: Pt, p2: Pt): { a: number; b: number; c: number } | null {
  if (p1.x === p2.x && p1.y === p2.y) return null;
  let a = p2.y - p1.y;
  let b = -(p2.x - p1.x);
  let c = a * p1.x + b * p1.y;
  const g = gcd3(Math.abs(a), Math.abs(b), Math.abs(c));
  a /= g; b /= g; c /= g;
  if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c; }
  return { a, b, c };
}

function stdFormLatex({ a, b, c }: { a: number; b: number; c: number }): string {
  const ax = a === 0 ? "" : a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  let by = "";
  if (b !== 0) {
    const sign = b > 0 && ax ? "+" : b < 0 ? "-" : "";
    const abs  = Math.abs(b) === 1 ? "y" : `${Math.abs(b)}y`;
    by = `${sign}${abs}`;
  }
  return `${ax}${by}=${c}`;
}

/* Intersection of lines through A→B and C→D */
function intersectLines(A: Pt, B: Pt, C: Pt, D: Pt): Pt | null {
  const a1 = B.y - A.y, b1 = A.x - B.x, c1 = a1 * A.x + b1 * A.y;
  const a2 = D.y - C.y, b2 = C.x - D.x, c2 = a2 * C.x + b2 * C.y;
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 0.001) return null;
  return { x: (c1 * b2 - c2 * b1) / det, y: (a1 * c2 - a2 * c1) / det };
}

/* ─── Equation parser: accepts "ax + by = c" form ─── */
function parseEquation(raw: string): { a: number; b: number; c: number } | null {
  try {
    const s = raw.replace(/\s/g, '').toLowerCase();
    const ei = s.indexOf('=');
    if (ei < 1) return null;
    const c = parseFloat(s.slice(ei + 1));
    if (isNaN(c)) return null;

    const lhs = s.slice(0, ei);
    const norm = /^[xy]/.test(lhs) ? '+' + lhs : lhs;
    const terms = norm.match(/[+\-][^+\-]*/g) ?? [];

    let a = 0, b = 0;
    for (const term of terms) {
      const sign = term[0] === '-' ? -1 : 1;
      const body = term.slice(1);
      if (body.includes('x')) {
        const n = body.replace('x', '');
        a = n === '' ? sign : sign * (parseFloat(n) || 0);
      } else if (body.includes('y')) {
        const n = body.replace('y', '');
        b = n === '' ? sign : sign * (parseFloat(n) || 0);
      }
    }
    if ((a === 0 && b === 0) || isNaN(a) || isNaN(b)) return null;
    return { a, b, c };
  } catch { return null; }
}

/* ─── Find two integer grid points on ax + by = c ─── */
function findTwoPointsOnLine(a: number, b: number, c: number): [Pt, Pt] | null {
  const candidates: Pt[] = [];

  if (b !== 0) {
    for (let x = 0; x <= GMAX; x++) {
      const y = (c - a * x) / b;
      if (y >= -0.001 && y <= GMAX + 0.001 && Math.abs(y - Math.round(y)) < 1e-6) {
        const pt = { x, y: Math.round(y) };
        if (!candidates.some(p => p.x === pt.x && p.y === pt.y)) candidates.push(pt);
      }
    }
  } else if (a !== 0) {
    const x = c / a;
    if (x >= 0 && x <= GMAX && Math.abs(x - Math.round(x)) < 1e-6) {
      const xi = Math.round(x);
      candidates.push({ x: xi, y: 0 });
      candidates.push({ x: xi, y: Math.round(GMAX / 2) });
    }
  }

  if (candidates.length >= 2) {
    return [candidates[0], candidates[candidates.length - 1]];
  }

  const fallback: Pt[] = [];
  if (b !== 0) fallback.push({ x: 0, y: Math.max(0, Math.min(GMAX, Math.round(c / b))) });
  if (a !== 0) fallback.push({ x: Math.max(0, Math.min(GMAX, Math.round(c / a))), y: 0 });
  if (fallback.length >= 2 && !(fallback[0].x === fallback[1].x && fallback[0].y === fallback[1].y))
    return [fallback[0], fallback[1]];

  return null;
}

/* Extend line through P1→P2 to grid boundaries → SVG endpoints */
function extendedLine(p1: Pt, p2: Pt) {
  if (p1.x === p2.x && p1.y === p2.y) return null;
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  const ts: number[] = [];
  if (Math.abs(dx) > 1e-9) { ts.push((0 - p1.x) / dx); ts.push((GMAX - p1.x) / dx); }
  if (Math.abs(dy) > 1e-9) { ts.push((0 - p1.y) / dy); ts.push((GMAX - p1.y) / dy); }
  const pts = ts
    .map(t => ({ x: p1.x + t * dx, y: p1.y + t * dy }))
    .filter(p => p.x >= -0.01 && p.x <= GMAX + 0.01 && p.y >= -0.01 && p.y <= GMAX + 0.01)
    .sort((a, b) => a.x - b.x || a.y - b.y);
  if (pts.length < 2) return null;
  return { p1: pts[0], p2: pts[pts.length - 1] };
}

/* ─── i18n strings ───────────────────────── */
const ui = {
  id: {
    headerTitle: "🖊️ Lab Grafik SPLDV Interaktif",
    headerSub: "Gambar dua garis — temukan titik potong = solusi!",
    phases: ["① Atur Titik", "② Gambar Garis 1", "③ Gambar Garis 2", "④ Solusi!"],
    hintInit: "Ketik persamaan di bawah lalu tekan Terapkan, atau seret titik secara manual, kemudian klik 'Mulai Menggambar!'",
    hintLine1Done: "Bagus! Sekarang seret dari A₂ (atau B₂) ke titik pasangannya untuk menggambar Garis 2.",
    hintIntersect: (rx: number, ry: number) => `🎉 Kedua garis berpotongan di (${rx}, ${ry}) — itulah solusi SPLDV!`,
    hintParallel: "⚠️ Kedua garis sejajar — SPLDV ini tidak memiliki solusi tunggal.",
    hintAlmost: "Hampir! Seret dari satu titik sampai menyentuh titik pasangannya. 🎯",
    hintSamePoint1: "⚠️ Titik A₁ dan B₁ harus berbeda!",
    hintSamePoint2: "⚠️ Titik A₂ dan B₂ harus berbeda!",
    hintDraw1: "Sentuh titik A₁ (atau B₁), lalu seret ke titik pasangannya untuk menggambar Garis 1.",
    hintReset: "Ketik persamaan di bawah lalu tekan Terapkan, atau seret titik secara manual, kemudian klik 'Mulai Menggambar!'",
    hintApplied: (n: number) => `✅ Persamaan ${n === 1 ? "Garis 1" : "Garis 2"} diterapkan! Sesuaikan titik jika perlu, lalu klik 'Mulai Menggambar!'`,
    backToArrange: "Atur ulang titik-titik, lalu klik 'Mulai Menggambar!' kembali.",
    intersectionLabel: "Titik Potong",
    line1Label: "Garis 1",
    line2Label: "Garis 2",
    applyBtn: "Terapkan",
    startBtn: "Mulai Menggambar!",
    backBtn: "← Kembali ke Atur Titik",
    tryOtherBtn: "Coba Konfigurasi Titik Lain",
    solutionFound: "🎯 Solusi SPLDV Ditemukan!",
    intersectionNote: (isInt: boolean) => "Titik potong kedua garis = penyelesaian sistem persamaan!" + (!isInt ? " (bukan bilangan bulat — coba atur ulang titik-titiknya)" : ""),
    noSolutionTitle: "⚠️ Tidak Ada Solusi",
    noSolutionNote: "Kedua garis sejajar — SPLDV ini tidak memiliki penyelesaian!",
    errorFormat: "⚠️ Format tidak valid. Coba: 2x + 3y = 6",
    conceptNote: (math: JSX.Element) => <>Setiap PLDV adalah sebuah <strong>garis lurus</strong> di bidang koordinat. <strong className="text-yellow-300">Titik potong</strong> dua garis = nilai {math} yang memenuhi <em>kedua</em> persamaan sekaligus — itulah <strong>penyelesaian SPLDV</strong>!</>,
  },
  en: {
    headerTitle: "🖊️ Interactive SLETV Graph Lab",
    headerSub: "Draw two lines — find the intersection = solution!",
    phases: ["① Set Points", "② Draw Line 1", "③ Draw Line 2", "④ Solution!"],
    hintInit: "Type an equation below and press Apply, or drag the points manually, then click 'Start Drawing!'",
    hintLine1Done: "Nice! Now drag from A₂ (or B₂) to its partner to draw Line 2.",
    hintIntersect: (rx: number, ry: number) => `🎉 The lines intersect at (${rx}, ${ry}) — that's the SLETV solution!`,
    hintParallel: "⚠️ The two lines are parallel — this system has no unique solution.",
    hintAlmost: "Almost! Drag from one point until you reach its partner. 🎯",
    hintSamePoint1: "⚠️ Points A₁ and B₁ must be different!",
    hintSamePoint2: "⚠️ Points A₂ and B₂ must be different!",
    hintDraw1: "Touch point A₁ (or B₁) and drag to its partner to draw Line 1.",
    hintReset: "Type an equation below and press Apply, or drag the points manually, then click 'Start Drawing!'",
    hintApplied: (n: number) => `✅ Line ${n} equation applied! Adjust points if needed, then click 'Start Drawing!'`,
    backToArrange: "Rearrange the points, then click 'Start Drawing!' again.",
    intersectionLabel: "Intersection",
    line1Label: "Line 1",
    line2Label: "Line 2",
    applyBtn: "Apply",
    startBtn: "Start Drawing!",
    backBtn: "← Back to Set Points",
    tryOtherBtn: "Try Different Points",
    solutionFound: "🎯 Solution Found!",
    intersectionNote: (isInt: boolean) => "Intersection of both lines = solution of the system!" + (!isInt ? " (not integers — try adjusting the points)" : ""),
    noSolutionTitle: "⚠️ No Solution",
    noSolutionNote: "The lines are parallel — this system has no solution!",
    errorFormat: "⚠️ Invalid format. Try: 2x + 3y = 6",
    conceptNote: (math: JSX.Element) => <>Each linear equation is a <strong>straight line</strong> in the coordinate plane. The <strong className="text-yellow-300">intersection</strong> of two lines = the value {math} that satisfies <em>both</em> equations simultaneously — that's the <strong>solution of the system</strong>!</>,
  },
  ja: {
    headerTitle: "🖊️ 連立方程式インタラクティブグラフ",
    headerSub: "2本の直線を描こう — 交点 = 解！",
    phases: ["① 点を設定", "② 直線1を描く", "③ 直線2を描く", "④ 解！"],
    hintInit: "下の方程式を入力して「適用」を押すか、点を手動でドラッグしてから「描き始める！」をクリック",
    hintLine1Done: "うまい！次はA₂（またはB₂）からペアの点にドラッグして直線2を描こう。",
    hintIntersect: (rx: number, ry: number) => `🎉 2本の直線が(${rx}, ${ry})で交わった — これが連立方程式の解！`,
    hintParallel: "⚠️ 2本の直線は平行 — この連立方程式には唯一の解がありません。",
    hintAlmost: "惜しい！一方の点からペアの点まで引っ張ってみて。🎯",
    hintSamePoint1: "⚠️ A₁とB₁は異なる点にしてください！",
    hintSamePoint2: "⚠️ A₂とB₂は異なる点にしてください！",
    hintDraw1: "点A₁（またはB₁）を触れてペアの点までドラッグして直線1を描こう。",
    hintReset: "下の方程式を入力して「適用」を押すか、点を手動でドラッグしてから「描き始める！」をクリック",
    hintApplied: (n: number) => `✅ 直線${n}の方程式を適用しました！必要なら点を調整してから「描き始める！」をクリック`,
    backToArrange: "点を再配置してから「描き始める！」をクリックしてください。",
    intersectionLabel: "交点",
    line1Label: "直線1",
    line2Label: "直線2",
    applyBtn: "適用",
    startBtn: "描き始める！",
    backBtn: "← 点の設定に戻る",
    tryOtherBtn: "別の点を試す",
    solutionFound: "🎯 解が見つかりました！",
    intersectionNote: (isInt: boolean) => "2本の直線の交点 = 連立方程式の解！" + (!isInt ? "（整数ではありません — 点を調整してみてください）" : ""),
    noSolutionTitle: "⚠️ 解なし",
    noSolutionNote: "2本の直線は平行 — この連立方程式には解がありません！",
    errorFormat: "⚠️ 無効な形式。例：2x + 3y = 6",
    conceptNote: (math: JSX.Element) => <>各一次方程式は座標平面上の<strong>直線</strong>です。2本の直線の<strong className="text-yellow-300">交点</strong> = <em>両方</em>の方程式を同時に満たす{math}の値 — それが<strong>連立方程式の解</strong>です！</>,
  },
};

/* ─── Component ──────────────────────────── */
const GrafikSPLDVInteraktif: React.FC = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = ui[language];

  /* Use refs for positions so pointer callbacks are always fresh */
  const posRef = useRef<Record<DotId, Pt>>({
    A1: { x: 0, y: 6 }, B1: { x: 6, y: 0 },
    A2: { x: 0, y: 2 }, B2: { x: 3, y: 5 },
  });
  const [pos, setPos] = useState({ ...posRef.current });

  const updatePos = useCallback((id: DotId, p: Pt) => {
    posRef.current = { ...posRef.current, [id]: p };
    setPos({ ...posRef.current });
  }, []);

  const phaseRef   = useRef<Phase>("arrange");
  const [phase,    setPhaseState] = useState<Phase>("arrange");
  const setPhase   = (p: Phase) => { phaseRef.current = p; setPhaseState(p); };

  const [line1Drawn, setLine1Drawn] = useState(false);
  const [line2Drawn, setLine2Drawn] = useState(false);
  const [hint,       setHint]       = useState(t.hintInit);

  const [eq1Input, setEq1Input] = useState("x + y = 6");
  const [eq2Input, setEq2Input] = useState("x - y = 2");
  const [eq1Error, setEq1Error] = useState(false);
  const [eq2Error, setEq2Error] = useState(false);
  const [drawFlash,  setDrawFlash]  = useState<1|2|null>(null);

  /* Dragging state (ref = no stale closure) */
  const dragDotRef  = useRef<DotId | null>(null);
  const drawDragRef = useRef<{ startDot: DotId; active: boolean } | null>(null);
  const [drawCursor, setDrawCursor] = useState<{ x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  const getSVGPos = useCallback((e: React.PointerEvent | PointerEvent) => {
    const svg  = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    return {
      sx: (e.clientX - rect.left)  * (SVG_W / rect.width),
      sy: (e.clientY - rect.top)   * (SVG_H / rect.height),
    };
  }, []);

  /* ── Pointer handlers ── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const { sx, sy } = getSVGPos(e);
    const ph = phaseRef.current;

    if (ph === "arrange") {
      const ids: DotId[] = ["A1","B1","A2","B2"];
      for (const id of ids) {
        const svgPt = toSVG(posRef.current[id]);
        const dist  = Math.hypot(sx - svgPt.sx, sy - svgPt.sy);
        if (dist < DOT_R * 3) {
          dragDotRef.current = id;
          (e.currentTarget as SVGElement).setPointerCapture(e.pointerId);
          return;
        }
      }
    }

    if (ph === "draw1" || ph === "draw2") {
      const activeDots: DotId[] = ph === "draw1" ? ["A1","B1"] : ["A2","B2"];
      for (const id of activeDots) {
        const svgPt = toSVG(posRef.current[id]);
        const dist  = Math.hypot(sx - svgPt.sx, sy - svgPt.sy);
        if (dist < DOT_R * 3.5) {
          drawDragRef.current = { startDot: id, active: true };
          setDrawCursor({ x: sx, y: sy });
          (e.currentTarget as SVGElement).setPointerCapture(e.pointerId);
          return;
        }
      }
    }
  }, [getSVGPos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const { sx, sy } = getSVGPos(e);
    const ph = phaseRef.current;

    if (dragDotRef.current && ph === "arrange") {
      const p = toGrid(sx, sy);
      updatePos(dragDotRef.current, p);
      setLine1Drawn(false); setLine2Drawn(false);
    }
    if (drawDragRef.current?.active) {
      setDrawCursor({ x: sx, y: sy });
    }
  }, [getSVGPos, updatePos]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const { sx, sy } = getSVGPos(e);
    dragDotRef.current = null;

    if (drawDragRef.current?.active) {
      const { startDot } = drawDragRef.current;
      const ph = phaseRef.current;
      const targetDot: DotId =
        ph === "draw1" ? (startDot === "A1" ? "B1" : "A1")
                       : (startDot === "A2" ? "B2" : "A2");

      const tgt  = toSVG(posRef.current[targetDot]);
      const dist = Math.hypot(sx - tgt.sx, sy - tgt.sy);

      if (dist < UNIT * 2) {
        playPopSound();
        setDrawFlash(ph === "draw1" ? 1 : 2);
        setTimeout(() => {
          if (phaseRef.current === "draw1") {
            setLine1Drawn(true);
            setPhase("draw2");
            setHint(t.hintLine1Done);
          } else {
            setLine2Drawn(true);
            setPhase("done");
            const ix = intersectLines(
              posRef.current.A1, posRef.current.B1,
              posRef.current.A2, posRef.current.B2,
            );
            if (ix) {
              const rx = Math.round(ix.x * 100) / 100;
              const ry = Math.round(ix.y * 100) / 100;
              setHint(t.hintIntersect(rx, ry));
            } else {
              setHint(t.hintParallel);
            }
          }
          setDrawFlash(null);
        }, 600);
      } else {
        setHint(t.hintAlmost);
      }

      drawDragRef.current = null;
      setDrawCursor(null);
    }
  }, [getSVGPos, t]);

  /* ── Actions ── */
  const startDraw = () => {
    const { A1, B1, A2, B2 } = posRef.current;
    if (A1.x === B1.x && A1.y === B1.y) { setHint(t.hintSamePoint1); return; }
    if (A2.x === B2.x && A2.y === B2.y) { setHint(t.hintSamePoint2); return; }
    playPopSound();
    setPhase("draw1");
    setHint(t.hintDraw1);
  };

  const reset = () => {
    playPopSound();
    posRef.current = { A1:{x:0,y:6}, B1:{x:6,y:0}, A2:{x:0,y:4}, B2:{x:4,y:0} };
    setPos({ ...posRef.current });
    setPhase("arrange");
    setLine1Drawn(false); setLine2Drawn(false);
    setDrawCursor(null); drawDragRef.current = null;
    setEq1Input("x + y = 6"); setEq2Input("x - y = 2");
    setEq1Error(false); setEq2Error(false);
    setHint(t.hintReset);
  };

  const applyEq = (which: 1 | 2) => {
    const raw = which === 1 ? eq1Input : eq2Input;
    const parsed = parseEquation(raw);
    if (!parsed) {
      if (which === 1) setEq1Error(true); else setEq2Error(true);
      return;
    }
    const pts = findTwoPointsOnLine(parsed.a, parsed.b, parsed.c);
    if (!pts) {
      if (which === 1) setEq1Error(true); else setEq2Error(true);
      return;
    }
    playPopSound();
    if (which === 1) {
      setEq1Error(false);
      updatePos("A1", pts[0]);
      updatePos("B1", pts[1]);
    } else {
      setEq2Error(false);
      updatePos("A2", pts[0]);
      updatePos("B2", pts[1]);
    }
    setLine1Drawn(false); setLine2Drawn(false);
    setPhase("arrange");
    setHint(t.hintApplied(which));
  };

  /* ── Derived ── */
  const { A1, B1, A2, B2 } = pos;
  const intersection = (line1Drawn && line2Drawn) ? intersectLines(A1, B1, A2, B2) : null;
  const eq1 = lineStdForm(A1, B1);
  const eq2 = lineStdForm(A2, B2);
  const ext1 = extendedLine(A1, B1);
  const ext2 = extendedLine(A2, B2);
  const ticks = Array.from({ length: GMAX + 1 }, (_, i) => i);

  const phaseOrder: Phase[] = ["arrange","draw1","draw2","done"];
  const phaseIdx = phaseOrder.indexOf(phase);

  const startPtSVG  = drawDragRef.current ? toSVG(posRef.current[drawDragRef.current.startDot]) : null;
  const activeColor = phase === "draw1" ? "#22d3ee" : "#a78bfa";

  return (
    <div className={`${isDark ? "bg-gradient-to-b from-slate-900/95 to-indigo-950/70 border-indigo-500/30 shadow-indigo-900/30" : "bg-gradient-to-b from-indigo-50 to-blue-50 border-indigo-300 shadow-indigo-100/60"} border rounded-2xl overflow-hidden shadow-2xl`}>

      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-indigo-500/20 bg-indigo-900/20" : "border-indigo-200 bg-indigo-100"}`}>
        <div>
          <p className={`font-display text-sm font-bold ${isDark ? "text-cyan-300" : "text-indigo-700"}`}>{t.headerTitle}</p>
          <p className={`font-body text-xs ${isDark ? "text-white/40" : "text-indigo-500"}`}>{t.headerSub}</p>
        </div>
        <button onClick={reset}
          className={`p-2 rounded-lg ${isDark ? "bg-white/5 border-white/10 hover:border-white/30 text-white/50 hover:text-white" : "bg-white border-indigo-200 hover:border-indigo-400 text-indigo-400 hover:text-indigo-600"} border transition-all`}
          title="Reset">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Phase bar */}
      <div className="flex gap-1 px-4 pt-3 pb-1">
        {(t.phases.map((label, i) => {
          const key = phaseOrder[i];
          const done    = i < phaseIdx;
          const active  = key === phase;
          return (
            <div key={key} className={`flex-1 text-center py-1 rounded text-[10px] font-body font-bold transition-all
              ${active
                ? isDark ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "bg-cyan-100 text-cyan-700 border border-cyan-400"
                : done
                ? isDark ? "bg-green-900/20 text-green-400 border border-green-500/20" : "bg-green-100 text-green-700 border border-green-400"
                : isDark ? "bg-white/5 text-white/25 border border-white/10" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
              {done ? "✓ " : ""}{label}
            </div>
          );
        }))}
      </div>

      {/* SVG Grid */}
      <div className="px-3 pt-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width:"100%", height:"auto", touchAction:"none",
            cursor: phase === "arrange" ? "default" : "crosshair", display:"block" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <defs>
            <marker id="axArr" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
              <path d="M0,1 L5,3.5 L0,6 Z" fill={isDark ? "#475569" : "#94a3b8"} />
            </marker>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect x={0} y={0} width={SVG_W} height={SVG_H} fill={isDark ? "#0f172a" : "#f8fafc"} rx="8" />
          <rect x={PAD} y={PAD} width={SVG_W-2*PAD} height={SVG_H-2*PAD} fill={isDark ? "#0f172a" : "#f1f5f9"} rx="4" />

          {/* Grid lines */}
          {ticks.map(i => {
            const { sx } = toSVG({ x: i, y: 0 });
            const { sy } = toSVG({ x: 0, y: i });
            const isAxis = i === 0;
            return (
              <g key={i}>
                <line x1={sx} y1={PAD} x2={sx} y2={SVG_H-PAD}
                  stroke={isDark ? (isAxis ? "#334155" : "#1e293b") : (isAxis ? "#94a3b8" : "#e2e8f0")}
                  strokeWidth={isAxis ? 1 : 0.7} />
                <line x1={PAD} y1={sy} x2={SVG_W-PAD} y2={sy}
                  stroke={isDark ? (isAxis ? "#334155" : "#1e293b") : (isAxis ? "#94a3b8" : "#e2e8f0")}
                  strokeWidth={isAxis ? 1 : 0.7} />
                <text x={sx} y={SVG_H-PAD+14} textAnchor="middle" fill={isDark ? "#475569" : "#64748b"} fontSize="10" fontFamily="monospace">{i}</text>
                {i > 0 && <text x={PAD-7} y={sy+4} textAnchor="end" fill={isDark ? "#475569" : "#64748b"} fontSize="10" fontFamily="monospace">{i}</text>}
              </g>
            );
          })}

          {/* Axes with arrows */}
          <line x1={PAD} y1={SVG_H-PAD} x2={SVG_W-8} y2={SVG_H-PAD}
            stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="1.5" markerEnd="url(#axArr)" />
          <line x1={PAD} y1={SVG_H-PAD} x2={PAD} y2={8}
            stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="1.5" markerEnd="url(#axArr)" />
          <text x={SVG_W-10} y={SVG_H-PAD+4} fill={isDark ? "#64748b" : "#475569"} fontSize="12" fontStyle="italic">x</text>
          <text x={PAD-2} y={14} fill={isDark ? "#64748b" : "#475569"} fontSize="12" fontStyle="italic">y</text>

          {/* Drawn lines */}
          {line1Drawn && ext1 && (() => {
            const s = toSVG(ext1.p1), e = toSVG(ext1.p2);
            return (
              <line x1={s.sx} y1={s.sy} x2={e.sx} y2={e.sy}
                stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"
                style={drawFlash===1 ? { animation:"drawIn 0.5s ease-out" } : undefined} />
            );
          })()}
          {line2Drawn && ext2 && (() => {
            const s = toSVG(ext2.p1), e = toSVG(ext2.p2);
            return (
              <line x1={s.sx} y1={s.sy} x2={e.sx} y2={e.sy}
                stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"
                style={drawFlash===2 ? { animation:"drawIn 0.5s ease-out" } : undefined} />
            );
          })()}

          {/* In-progress draw drag line */}
          {drawCursor && startPtSVG && (
            <line x1={startPtSVG.sx} y1={startPtSVG.sy}
              x2={drawCursor.x} y2={drawCursor.y}
              stroke={activeColor} strokeWidth="2.2"
              strokeDasharray="7,5" opacity="0.75" strokeLinecap="round" />
          )}

          {/* Preview dotted lines (in arrange phase) */}
          {phase === "arrange" && (() => {
            const ex1 = extendedLine(A1, B1);
            const ex2 = extendedLine(A2, B2);
            return (
              <>
                {ex1 && (() => {
                  const s=toSVG(ex1.p1),e=toSVG(ex1.p2);
                  return <line x1={s.sx} y1={s.sy} x2={e.sx} y2={e.sy} stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.25" />;
                })()}
                {ex2 && (() => {
                  const s=toSVG(ex2.p1),e=toSVG(ex2.p2);
                  return <line x1={s.sx} y1={s.sy} x2={e.sx} y2={e.sy} stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.25" />;
                })()}
              </>
            );
          })()}

          {/* Dots */}
          {([
            { id:"A1" as DotId, pt:A1, color:"#22d3ee", label:"A₁", line:1 },
            { id:"B1" as DotId, pt:B1, color:"#22d3ee", label:"B₁", line:1 },
            { id:"A2" as DotId, pt:A2, color:"#a78bfa", label:"A₂", line:2 },
            { id:"B2" as DotId, pt:B2, color:"#a78bfa", label:"B₂", line:2 },
          ]).map(({ id, pt, color, label, line }) => {
            const { sx, sy } = toSVG(pt);
            const isActiveLine = (phase === "draw1" && line === 1) || (phase === "draw2" && line === 2);
            const isDraggable  = phase === "arrange";
            const pulse = isActiveLine;

            const offX = sx > SVG_W - PAD - 30 ? -38 : 13;
            const offY = sy < PAD + 20 ? 18 : -10;

            return (
              <g key={id} style={{ cursor: isDraggable ? "grab" : isActiveLine ? "crosshair" : "default" }}>
                {pulse && (
                  <circle cx={sx} cy={sy} r={DOT_R+8} fill={color} opacity="0.12">
                    <animate attributeName="r" values={`${DOT_R+4};${DOT_R+12};${DOT_R+4}`} dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.04;0.15" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={sx} cy={sy} r={DOT_R*3} fill="transparent" />
                <circle cx={sx} cy={sy} r={DOT_R} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
                <circle cx={sx} cy={sy} r={5} fill={color} />
                <text x={sx+offX} y={sy+offY} fill={color} fontSize="11" fontWeight="bold" fontFamily="sans-serif">{label}</text>
                <text x={sx+offX} y={sy+offY+12} fill={color} fontSize="9" fontFamily="monospace" opacity="0.65">({pt.x},{pt.y})</text>
              </g>
            );
          })}

          {/* Intersection dot */}
          {intersection && (() => {
            const rx = Math.round(intersection.x * 100) / 100;
            const ry = Math.round(intersection.y * 100) / 100;
            const { sx, sy } = toSVG({ x: rx, y: ry });
            const inBounds = sx >= PAD-2 && sx <= SVG_W-PAD+2 && sy >= PAD-2 && sy <= SVG_H-PAD+2;
            if (!inBounds) return null;
            const labelX = sx > SVG_W-PAD-60 ? sx-70 : sx+12;
            return (
              <g filter="url(#glow)">
                <circle cx={sx} cy={sy} r={20} fill="#fbbf24" opacity="0.12" />
                <circle cx={sx} cy={sy} r={11} fill="#fbbf24" opacity="0.25" />
                <circle cx={sx} cy={sy} r={6}  fill="#fbbf24" stroke="#fff" strokeWidth="2" />
                <text x={labelX} y={sy-8} fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="sans-serif">({rx}, {ry})</text>
                <text x={labelX} y={sy+5} fill="#fbbf24" fontSize="9" fontFamily="sans-serif" opacity="0.75">{t.intersectionLabel}</text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Info panel */}
      <div className="px-4 pb-4 space-y-3">

        {/* Hint bar */}
        <div className={`border rounded-xl px-4 py-2.5 flex items-start gap-2
          ${phase==="done" && intersection
            ? isDark ? "bg-green-900/25 border-green-500/30" : "bg-green-50 border-green-400"
            : phase==="done" && !intersection
            ? isDark ? "bg-red-900/25 border-red-500/30"   : "bg-red-50 border-red-400"
            : isDark ? "bg-indigo-900/25 border-indigo-500/20" : "bg-indigo-50 border-indigo-300"}`}>
          {phase==="done" && intersection
            ? <CheckCircle2 className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"} shrink-0 mt-0.5`} />
            : phase==="done"
            ? <AlertTriangle className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-600"} shrink-0 mt-0.5`} />
            : <Info className={`w-4 h-4 ${isDark ? "text-indigo-400" : "text-indigo-600"} shrink-0 mt-0.5`} />}
          <p className={`font-body text-xs leading-relaxed ${isDark ? "text-white/80" : "text-gray-700"}`}>{hint}</p>
        </div>

        {/* Equation panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Line 1 */}
          <div className={`border rounded-xl p-3 transition-all space-y-2
            ${(phase==="draw1"||phase==="arrange")
              ? isDark ? "border-cyan-500/50 bg-cyan-900/25" : "border-cyan-400 bg-cyan-50"
              : isDark ? "border-cyan-500/15 bg-cyan-900/10" : "border-cyan-200 bg-cyan-50/50"}`}>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
              <p className={`font-body text-[10px] ${isDark ? "text-cyan-400" : "text-cyan-600"} uppercase font-bold`}>{t.line1Label}</p>
              {line1Drawn && <CheckCircle2 className={`w-3 h-3 ${isDark ? "text-green-400" : "text-green-600"} ml-auto`} />}
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={eq1Input}
                onChange={e => { setEq1Input(e.target.value); setEq1Error(false); }}
                onKeyDown={e => e.key === "Enter" && applyEq(1)}
                placeholder="e.g. 2x + 3y = 6"
                className={`flex-1 min-w-0 border rounded-lg px-2 py-1.5 text-xs font-mono outline-none focus:ring-1 transition-all
                  ${isDark ? "bg-slate-900/70 text-white/90 placeholder-white/25" : "bg-white text-gray-800 placeholder-gray-400"}
                  ${eq1Error ? "border-red-500/60 focus:ring-red-500/40" : "border-cyan-500/30 focus:ring-cyan-500/40"}`}
              />
              <button
                onClick={() => applyEq(1)}
                className="shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold font-body px-2 py-1.5 rounded-lg transition-all"
              >
                {t.applyBtn}
              </button>
            </div>
            {eq1Error && (
              <p className="text-[10px] text-red-400 font-body">{t.errorFormat}</p>
            )}
            <div className="flex items-center justify-between">
              <p className={`font-body text-[10px] ${isDark ? "text-white/40" : "text-gray-500"}`}>A₁({A1.x},{A1.y}) · B₁({B1.x},{B1.y})</p>
              {eq1 && (
                <span className={`${isDark ? "text-cyan-300" : "text-cyan-600"} text-xs`}>
                  <InlineMath math={stdFormLatex(eq1)} />
                </span>
              )}
            </div>
          </div>

          {/* Line 2 */}
          <div className={`border rounded-xl p-3 transition-all space-y-2
            ${phase==="draw2"
              ? isDark ? "border-violet-500/50 bg-violet-900/25" : "border-violet-400 bg-violet-50"
              : isDark ? "border-violet-500/15 bg-violet-900/10" : "border-violet-200 bg-violet-50/50"}`}>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shrink-0" />
              <p className={`font-body text-[10px] ${isDark ? "text-violet-400" : "text-violet-600"} uppercase font-bold`}>{t.line2Label}</p>
              {line2Drawn && <CheckCircle2 className={`w-3 h-3 ${isDark ? "text-green-400" : "text-green-600"} ml-auto`} />}
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={eq2Input}
                onChange={e => { setEq2Input(e.target.value); setEq2Error(false); }}
                onKeyDown={e => e.key === "Enter" && applyEq(2)}
                placeholder="e.g. x - 2y = 4"
                className={`flex-1 min-w-0 border rounded-lg px-2 py-1.5 text-xs font-mono outline-none focus:ring-1 transition-all
                  ${isDark ? "bg-slate-900/70 text-white/90 placeholder-white/25" : "bg-white text-gray-800 placeholder-gray-400"}
                  ${eq2Error ? "border-red-500/60 focus:ring-red-500/40" : "border-violet-500/30 focus:ring-violet-500/40"}`}
              />
              <button
                onClick={() => applyEq(2)}
                className="shrink-0 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold font-body px-2 py-1.5 rounded-lg transition-all"
              >
                {t.applyBtn}
              </button>
            </div>
            {eq2Error && (
              <p className="text-[10px] text-red-400 font-body">{t.errorFormat}</p>
            )}
            <div className="flex items-center justify-between">
              <p className={`font-body text-[10px] ${isDark ? "text-white/40" : "text-gray-500"}`}>A₂({A2.x},{A2.y}) · B₂({B2.x},{B2.y})</p>
              {eq2 && (
                <span className={`${isDark ? "text-violet-300" : "text-violet-600"} text-xs`}>
                  <InlineMath math={stdFormLatex(eq2)} />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Intersection result */}
        {phase === "done" && intersection && (() => {
          const rx = Math.round(intersection.x * 100) / 100;
          const ry = Math.round(intersection.y * 100) / 100;
          const isInt = Number.isInteger(rx) && Number.isInteger(ry);
          return (
            <div className={`${isDark ? "bg-yellow-900/25 border-yellow-500/40" : "bg-yellow-50 border-yellow-400"} border rounded-xl p-4 text-center space-y-2`}>
              <p className={`font-display text-base font-bold ${isDark ? "text-yellow-300" : "text-yellow-700"}`}>{t.solutionFound}</p>
              <div className="flex justify-center gap-6">
                <div className={`${isDark ? "bg-yellow-900/30 border-yellow-500/20" : "bg-white border-yellow-300"} border rounded-lg px-4 py-2`}>
                  <p className={`${isDark ? "text-yellow-200" : "text-yellow-600"} text-xs font-body`}>x</p>
                  <p className={`${isDark ? "text-yellow-300" : "text-yellow-800"} font-bold text-lg font-display`}>{rx}</p>
                </div>
                <div className={`${isDark ? "bg-yellow-900/30 border-yellow-500/20" : "bg-white border-yellow-300"} border rounded-lg px-4 py-2`}>
                  <p className={`${isDark ? "text-yellow-200" : "text-yellow-600"} text-xs font-body`}>y</p>
                  <p className={`${isDark ? "text-yellow-300" : "text-yellow-800"} font-bold text-lg font-display`}>{ry}</p>
                </div>
              </div>
              <p className={`font-body text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{t.intersectionNote(isInt)}</p>
            </div>
          );
        })()}

        {phase === "done" && !intersection && (
          <div className={`${isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-400"} border rounded-xl p-3 text-center`}>
            <p className={`font-display text-sm font-bold ${isDark ? "text-red-300" : "text-red-700"}`}>{t.noSolutionTitle}</p>
            <p className={`font-body text-xs ${isDark ? "text-white/50" : "text-gray-500"} mt-1`}>{t.noSolutionNote}</p>
          </div>
        )}

        {/* Action buttons */}
        {phase === "arrange" && (
          <button onClick={startDraw}
            className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-body font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2">
            <Pencil className="w-4 h-4" />
            {t.startBtn}
          </button>
        )}

        {(phase === "draw1" || phase === "draw2") && (
          <button onClick={() => { playPopSound(); setPhase("arrange"); setHint(t.backToArrange); setDrawCursor(null); }}
            className={`w-full ${isDark ? "bg-white/5 border-white/10 hover:border-white/20 text-white/50 hover:text-white/80" : "bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700"} border font-body text-xs py-2 rounded-xl transition-all`}>
            {t.backBtn}
          </button>
        )}

        {phase === "done" && (
          <button onClick={reset}
            className={`w-full ${isDark ? "bg-white/5 border-white/10 hover:border-white/20 text-white/50 hover:text-white/80" : "bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700"} border font-body text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-2`}>
            <RefreshCw className="w-3.5 h-3.5" /> {t.tryOtherBtn}
          </button>
        )}

        {/* Concept note */}
        <div className={`${isDark ? "bg-purple-900/15 border-purple-500/20" : "bg-purple-50 border-purple-300"} border rounded-xl px-4 py-2.5 flex gap-2`}>
          <span className="text-purple-400 text-sm shrink-0">💡</span>
          <p className={`font-body text-xs ${isDark ? "text-purple-200" : "text-purple-700"} leading-relaxed`}>
            {t.conceptNote(<InlineMath math="(x,y)" />)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrafikSPLDVInteraktif;
