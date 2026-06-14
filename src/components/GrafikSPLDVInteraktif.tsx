import React, { useRef, useState, useCallback, useEffect } from "react";
import { InlineMath } from "react-katex";
import { RefreshCw, Pencil, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
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
    // Ensure the first term has an explicit sign so we can split cleanly
    const norm = /^[xy]/.test(lhs) ? '+' + lhs : lhs;
    // Split into signed tokens: each starts with + or -
    const terms = norm.match(/[+\-][^+\-]*/g) ?? [];

    let a = 0, b = 0;
    for (const term of terms) {
      const sign = term[0] === '-' ? -1 : 1;
      const body = term.slice(1); // strip leading sign
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
    // Vertical line x = c/a
    const x = c / a;
    if (x >= 0 && x <= GMAX && Math.abs(x - Math.round(x)) < 1e-6) {
      const xi = Math.round(x);
      candidates.push({ x: xi, y: 0 });
      candidates.push({ x: xi, y: Math.round(GMAX / 2) });
    }
  }

  if (candidates.length >= 2) {
    // pick widest spread
    return [candidates[0], candidates[candidates.length - 1]];
  }

  // Fallback: use intercepts rounded to grid
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

/* ─── Component ──────────────────────────── */
const GrafikSPLDVInteraktif: React.FC = () => {
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
  const [hint,       setHint]       = useState("Ketik persamaan di bawah lalu tekan Terapkan, atau seret titik secara manual, kemudian klik 'Mulai Menggambar!'");

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
        /* SUCCESS — line drawn */
        playPopSound();
        setDrawFlash(ph === "draw1" ? 1 : 2);
        setTimeout(() => {
          if (phaseRef.current === "draw1") {
            setLine1Drawn(true);
            setPhase("draw2");
            setHint("Bagus! Sekarang seret dari A₂ (atau B₂) ke titik pasangannya untuk menggambar Garis 2.");
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
              setHint(`🎉 Kedua garis berpotongan di (${rx}, ${ry}) — itulah solusi SPLDV!`);
            } else {
              setHint("⚠️ Kedua garis sejajar — SPLDV ini tidak memiliki solusi tunggal.");
            }
          }
          setDrawFlash(null);
        }, 600);
      } else {
        setHint("Hampir! Seret dari satu titik sampai menyentuh titik pasangannya. 🎯");
      }

      drawDragRef.current = null;
      setDrawCursor(null);
    }
  }, [getSVGPos]);

  /* ── Actions ── */
  const startDraw = () => {
    const { A1, B1, A2, B2 } = posRef.current;
    if (A1.x === B1.x && A1.y === B1.y) { setHint("⚠️ Titik A₁ dan B₁ harus berbeda!"); return; }
    if (A2.x === B2.x && A2.y === B2.y) { setHint("⚠️ Titik A₂ dan B₂ harus berbeda!"); return; }
    playPopSound();
    setPhase("draw1");
    setHint("Sentuh titik A₁ (atau B₁), lalu seret ke titik pasangannya untuk menggambar Garis 1.");
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
    setHint("Ketik persamaan di bawah lalu tekan Terapkan, atau seret titik secara manual, kemudian klik 'Mulai Menggambar!'");
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
    setHint(`✅ Persamaan ${which === 1 ? "Garis 1" : "Garis 2"} diterapkan! Sesuaikan titik jika perlu, lalu klik 'Mulai Menggambar!'`);
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

  /* Draw-in-progress line */
  const startPtSVG  = drawDragRef.current ? toSVG(posRef.current[drawDragRef.current.startDot]) : null;
  const activeColor = phase === "draw1" ? "#22d3ee" : "#a78bfa";

  return (
    <div className="bg-gradient-to-b from-slate-900/95 to-indigo-950/70 border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/30">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-500/20 bg-indigo-900/20">
        <div>
          <p className="font-display text-sm font-bold text-cyan-300">🖊️ Lab Grafik SPLDV Interaktif</p>
          <p className="font-body text-xs text-white/40">Gambar dua garis — temukan titik potong = solusi!</p>
        </div>
        <button onClick={reset}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 text-white/50 hover:text-white transition-all"
          title="Reset">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Phase bar */}
      <div className="flex gap-1 px-4 pt-3 pb-1">
        {([
          { key:"arrange", label:"① Atur Titik" },
          { key:"draw1",   label:"② Gambar Garis 1" },
          { key:"draw2",   label:"③ Gambar Garis 2" },
          { key:"done",    label:"④ Solusi!" },
        ] as { key: Phase; label: string }[]).map(({ key, label }, i) => {
          const done    = i < phaseIdx;
          const active  = key === phase;
          return (
            <div key={key} className={`flex-1 text-center py-1 rounded text-[10px] font-body font-bold transition-all
              ${active ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : done   ? "bg-green-900/20 text-green-400 border border-green-500/20"
              :          "bg-white/5 text-white/25 border border-white/10"}`}>
              {done ? "✓ " : ""}{label}
            </div>
          );
        })}
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
              <path d="M0,1 L5,3.5 L0,6 Z" fill="#475569" />
            </marker>
            {/* Glow filter for intersection */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect x={PAD} y={PAD} width={SVG_W-2*PAD} height={SVG_H-2*PAD} fill="#0f172a" rx="4" />

          {/* Grid lines */}
          {ticks.map(i => {
            const { sx } = toSVG({ x: i, y: 0 });
            const { sy } = toSVG({ x: 0, y: i });
            const isAxis = i === 0;
            return (
              <g key={i}>
                <line x1={sx} y1={PAD} x2={sx} y2={SVG_H-PAD}
                  stroke={isAxis ? "#334155" : "#1e293b"} strokeWidth={isAxis ? 1 : 0.7} />
                <line x1={PAD} y1={sy} x2={SVG_W-PAD} y2={sy}
                  stroke={isAxis ? "#334155" : "#1e293b"} strokeWidth={isAxis ? 1 : 0.7} />
                <text x={sx} y={SVG_H-PAD+14} textAnchor="middle" fill="#475569" fontSize="10" fontFamily="monospace">{i}</text>
                {i > 0 && <text x={PAD-7} y={sy+4} textAnchor="end" fill="#475569" fontSize="10" fontFamily="monospace">{i}</text>}
              </g>
            );
          })}

          {/* Axes with arrows */}
          <line x1={PAD} y1={SVG_H-PAD} x2={SVG_W-8} y2={SVG_H-PAD}
            stroke="#475569" strokeWidth="1.5" markerEnd="url(#axArr)" />
          <line x1={PAD} y1={SVG_H-PAD} x2={PAD} y2={8}
            stroke="#475569" strokeWidth="1.5" markerEnd="url(#axArr)" />
          <text x={SVG_W-10} y={SVG_H-PAD+4} fill="#64748b" fontSize="12" fontStyle="italic">x</text>
          <text x={PAD-2} y={14} fill="#64748b" fontSize="12" fontStyle="italic">y</text>

          {/* ── Drawn lines (extended to grid edge) ── */}
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

          {/* ── In-progress draw drag line ── */}
          {drawCursor && startPtSVG && (
            <line x1={startPtSVG.sx} y1={startPtSVG.sy}
              x2={drawCursor.x} y2={drawCursor.y}
              stroke={activeColor} strokeWidth="2.2"
              strokeDasharray="7,5" opacity="0.75" strokeLinecap="round" />
          )}

          {/* ── Preview dotted lines (in arrange phase) ── */}
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

          {/* ── Dots ── */}
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

            /* Label offset: prefer right, but push left near right edge */
            const offX = sx > SVG_W - PAD - 30 ? -38 : 13;
            const offY = sy < PAD + 20 ? 18 : -10;

            return (
              <g key={id} style={{ cursor: isDraggable ? "grab" : isActiveLine ? "crosshair" : "default" }}>
                {/* Pulse ring for active dots */}
                {pulse && (
                  <circle cx={sx} cy={sy} r={DOT_R+8} fill={color} opacity="0.12">
                    <animate attributeName="r" values={`${DOT_R+4};${DOT_R+12};${DOT_R+4}`} dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.04;0.15" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Invisible larger hit area */}
                <circle cx={sx} cy={sy} r={DOT_R*3} fill="transparent" />
                {/* Outer ring */}
                <circle cx={sx} cy={sy} r={DOT_R} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
                {/* Inner dot */}
                <circle cx={sx} cy={sy} r={5} fill={color} />
                {/* Label + coordinate */}
                <text x={sx+offX} y={sy+offY} fill={color} fontSize="11" fontWeight="bold" fontFamily="sans-serif">{label}</text>
                <text x={sx+offX} y={sy+offY+12} fill={color} fontSize="9" fontFamily="monospace" opacity="0.65">({pt.x},{pt.y})</text>
              </g>
            );
          })}

          {/* ── Intersection dot ── */}
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
                <text x={labelX} y={sy+5} fill="#fbbf24" fontSize="9" fontFamily="sans-serif" opacity="0.75">Titik Potong</text>
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
            ? "bg-green-900/25 border-green-500/30"
            : phase==="done" && !intersection
            ? "bg-red-900/25 border-red-500/30"
            : "bg-indigo-900/25 border-indigo-500/20"}`}>
          {phase==="done" && intersection
            ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
            : phase==="done"
            ? <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            : <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
          <p className="font-body text-xs leading-relaxed text-white/80">{hint}</p>
        </div>

        {/* Equation panels — editable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Garis 1 */}
          <div className={`border rounded-xl p-3 transition-all space-y-2
            ${(phase==="draw1"||phase==="arrange") ? "border-cyan-500/50 bg-cyan-900/25" : "border-cyan-500/15 bg-cyan-900/10"}`}>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
              <p className="font-body text-[10px] text-cyan-400 uppercase font-bold">Garis 1</p>
              {line1Drawn && <CheckCircle2 className="w-3 h-3 text-green-400 ml-auto" />}
            </div>
            {/* Input row */}
            <div className="flex gap-1">
              <input
                type="text"
                value={eq1Input}
                onChange={e => { setEq1Input(e.target.value); setEq1Error(false); }}
                onKeyDown={e => e.key === "Enter" && applyEq(1)}
                placeholder="cth: 2x + 3y = 6"
                className={`flex-1 min-w-0 bg-slate-900/70 border rounded-lg px-2 py-1.5 text-xs font-mono text-white/90 placeholder-white/25 outline-none focus:ring-1 transition-all
                  ${eq1Error ? "border-red-500/60 focus:ring-red-500/40" : "border-cyan-500/30 focus:ring-cyan-500/40"}`}
              />
              <button
                onClick={() => applyEq(1)}
                className="shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold font-body px-2 py-1.5 rounded-lg transition-all"
              >
                Terapkan
              </button>
            </div>
            {eq1Error && (
              <p className="text-[10px] text-red-400 font-body">⚠️ Format tidak valid. Coba: 2x + 3y = 6</p>
            )}
            {/* Derived equation display */}
            <div className="flex items-center justify-between">
              <p className="font-body text-[10px] text-white/40">A₁({A1.x},{A1.y}) · B₁({B1.x},{B1.y})</p>
              {eq1 && (
                <span className="text-cyan-300 text-xs">
                  <InlineMath math={stdFormLatex(eq1)} />
                </span>
              )}
            </div>
          </div>

          {/* Garis 2 */}
          <div className={`border rounded-xl p-3 transition-all space-y-2
            ${phase==="draw2" ? "border-violet-500/50 bg-violet-900/25" : "border-violet-500/15 bg-violet-900/10"}`}>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shrink-0" />
              <p className="font-body text-[10px] text-violet-400 uppercase font-bold">Garis 2</p>
              {line2Drawn && <CheckCircle2 className="w-3 h-3 text-green-400 ml-auto" />}
            </div>
            {/* Input row */}
            <div className="flex gap-1">
              <input
                type="text"
                value={eq2Input}
                onChange={e => { setEq2Input(e.target.value); setEq2Error(false); }}
                onKeyDown={e => e.key === "Enter" && applyEq(2)}
                placeholder="cth: x - 2y = 4"
                className={`flex-1 min-w-0 bg-slate-900/70 border rounded-lg px-2 py-1.5 text-xs font-mono text-white/90 placeholder-white/25 outline-none focus:ring-1 transition-all
                  ${eq2Error ? "border-red-500/60 focus:ring-red-500/40" : "border-violet-500/30 focus:ring-violet-500/40"}`}
              />
              <button
                onClick={() => applyEq(2)}
                className="shrink-0 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold font-body px-2 py-1.5 rounded-lg transition-all"
              >
                Terapkan
              </button>
            </div>
            {eq2Error && (
              <p className="text-[10px] text-red-400 font-body">⚠️ Format tidak valid. Coba: x - 2y = 4</p>
            )}
            {/* Derived equation display */}
            <div className="flex items-center justify-between">
              <p className="font-body text-[10px] text-white/40">A₂({A2.x},{A2.y}) · B₂({B2.x},{B2.y})</p>
              {eq2 && (
                <span className="text-violet-300 text-xs">
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
            <div className="bg-yellow-900/25 border border-yellow-500/40 rounded-xl p-4 text-center space-y-2">
              <p className="font-display text-base font-bold text-yellow-300">🎯 Solusi SPLDV Ditemukan!</p>
              <div className="flex justify-center gap-6">
                <div className="bg-yellow-900/30 border border-yellow-500/20 rounded-lg px-4 py-2">
                  <p className="text-yellow-200 text-xs font-body">x</p>
                  <p className="text-yellow-300 font-bold text-lg font-display">{rx}</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/20 rounded-lg px-4 py-2">
                  <p className="text-yellow-200 text-xs font-body">y</p>
                  <p className="text-yellow-300 font-bold text-lg font-display">{ry}</p>
                </div>
              </div>
              <p className="font-body text-xs text-white/50">
                Titik potong kedua garis = penyelesaian sistem persamaan!
                {!isInt && " (bukan bilangan bulat — coba atur ulang titik-titiknya)"}
              </p>
            </div>
          );
        })()}

        {phase === "done" && !intersection && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center">
            <p className="font-display text-sm font-bold text-red-300">⚠️ Tidak Ada Solusi</p>
            <p className="font-body text-xs text-white/50 mt-1">Kedua garis sejajar — SPLDV ini tidak memiliki penyelesaian!</p>
          </div>
        )}

        {/* Action buttons */}
        {phase === "arrange" && (
          <button onClick={startDraw}
            className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-body font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2">
            <Pencil className="w-4 h-4" />
            Mulai Menggambar!
          </button>
        )}

        {(phase === "draw1" || phase === "draw2") && (
          <button onClick={() => { playPopSound(); setPhase("arrange"); setHint("Atur ulang titik-titik, lalu klik 'Mulai Menggambar!' kembali."); setDrawCursor(null); }}
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white/80 font-body text-xs py-2 rounded-xl transition-all">
            ← Kembali ke Atur Titik
          </button>
        )}

        {phase === "done" && (
          <button onClick={reset}
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white/80 font-body text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Coba Konfigurasi Titik Lain
          </button>
        )}

        {/* Concept note */}
        <div className="bg-purple-900/15 border border-purple-500/20 rounded-xl px-4 py-2.5 flex gap-2">
          <span className="text-purple-400 text-sm shrink-0">💡</span>
          <p className="font-body text-xs text-purple-200 leading-relaxed">
            Setiap PLDV adalah sebuah <strong>garis lurus</strong> di bidang koordinat.
            <strong className="text-yellow-300"> Titik potong</strong> dua garis = nilai <InlineMath math="(x,y)" /> yang
            memenuhi <em>kedua</em> persamaan sekaligus — itulah <strong>penyelesaian SPLDV</strong>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrafikSPLDVInteraktif;
