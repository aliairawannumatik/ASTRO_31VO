import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ─── Data: 10 equations ─────────────────────────────────────── */
interface EqEntry {
  id: number;
  raw: string;
  katex: string;
  isLinear: boolean;
  label: string;
  description: string;
  reason: string;
  tip: string;
  color: string;
  graphKind: "line" | "curve" | "vertical" | "horizontal" | "hyperbola" | "sqrt" | "xy";
  graphPoints: [number, number][] | null;
}

const EQUATIONS: EqEntry[] = [
  {
    id: 1, raw: "y = 2x + 3", katex: "y = 2x + 3",
    isLinear: true, label: "Bentuk Lereng–Intersep",
    description: "Persamaan garis lurus dengan gradien m = 2 dan titik potong sumbu-y di (0, 3).",
    reason: "Variabel x dan y berpangkat 1 (tertinggi). Grafiknya berupa garis lurus miring ke kanan atas.",
    tip: "Setiap kenaikan 1 satuan pada x, nilai y naik 2 satuan.",
    color: "#22d3ee", graphKind: "line",
    graphPoints: [[-3,-3],[-2,-1],[-1,1],[0,3],[1,5],[2,7]],
  },
  {
    id: 2, raw: "y = x² + 1", katex: "y = x^2 + 1",
    isLinear: false, label: "Fungsi Kuadrat",
    description: "Ini adalah persamaan kuadrat (parabola), bukan persamaan garis lurus.",
    reason: "Variabel x berpangkat 2. Persamaan garis lurus hanya boleh berpangkat 1. Grafiknya berbentuk parabola.",
    tip: "Ciri non-linear: ada variabel dengan pangkat lebih dari 1.",
    color: "#f472b6", graphKind: "curve", graphPoints: null,
  },
  {
    id: 3, raw: "3x - 2y = 6", katex: "3x - 2y = 6",
    isLinear: true, label: "Bentuk Umum ax + by = c",
    description: "Bentuk umum persamaan garis lurus. Setara dengan y = (3/2)x - 3.",
    reason: "Variabel x dan y keduanya berpangkat 1. Tidak ada perkalian antar variabel.",
    tip: "Ubah ke y = mx + c: 2y = 3x - 6, maka y = (3/2)x - 3.",
    color: "#a78bfa", graphKind: "line",
    graphPoints: [[-2,-6],[-1,-4.5],[0,-3],[1,-1.5],[2,0],[3,1.5],[4,3]],
  },
  {
    id: 4, raw: "y = 1/x", katex: "y = \\dfrac{1}{x}",
    isLinear: false, label: "Fungsi Hiperbola",
    description: "Persamaan hiperbola. Grafiknya berupa dua cabang kurva, bukan garis lurus.",
    reason: "Dapat ditulis y = x⁻¹, artinya x berpangkat -1. Pangkat negatif → bukan linear.",
    tip: "Pangkat negatif atau pecahan variabel → bukan persamaan garis lurus.",
    color: "#fb923c", graphKind: "hyperbola", graphPoints: null,
  },
  {
    id: 5, raw: "x + y = 5", katex: "x + y = 5",
    isLinear: true, label: "Garis dengan Gradien -1",
    description: "Setara dengan y = -x + 5. Gradien = -1, garis miring ke kanan bawah.",
    reason: "Variabel x dan y berpangkat 1. Tidak ada perkalian xy. Grafiknya garis lurus.",
    tip: "Titik potong sb-x: (5, 0). Titik potong sb-y: (0, 5).",
    color: "#4ade80", graphKind: "line",
    graphPoints: [[-1,6],[0,5],[1,4],[2,3],[3,2],[4,1],[5,0],[6,-1]],
  },
  {
    id: 6, raw: "y = x³", katex: "y = x^3",
    isLinear: false, label: "Fungsi Kubik",
    description: "Persamaan fungsi kubik (pangkat 3). Grafiknya berbentuk kurva S.",
    reason: "Variabel x berpangkat 3. Persamaan linear hanya boleh memiliki variabel berpangkat 1.",
    tip: "Periksa pangkat tertinggi variabel — lebih dari 1 berarti bukan garis lurus.",
    color: "#f87171", graphKind: "curve", graphPoints: null,
  },
  {
    id: 7, raw: "2x + 5 = 0", katex: "2x + 5 = 0",
    isLinear: true, label: "Garis Vertikal",
    description: "Persamaan garis vertikal di x = -2,5. Tegak lurus sumbu-x.",
    reason: "Hanya memuat variabel x berpangkat 1. Ini bentuk khusus garis lurus — garis vertikal.",
    tip: "Garis vertikal tidak memiliki gradien (tak terdefinisi).",
    color: "#facc15", graphKind: "vertical",
    graphPoints: [[-2.5,-4],[-2.5,-3],[-2.5,-2],[-2.5,-1],[-2.5,0],[-2.5,1],[-2.5,2],[-2.5,3],[-2.5,4]],
  },
  {
    id: 8, raw: "y = √x", katex: "y = \\sqrt{x}",
    isLinear: false, label: "Fungsi Akar",
    description: "Fungsi akar kuadrat. Grafiknya berupa setengah parabola yang dilipat.",
    reason: "Dapat ditulis y = x^(1/2), artinya x berpangkat ½. Bukan pangkat 1 → bukan linear.",
    tip: "Akar = pangkat ½ → bukan linear!",
    color: "#34d399", graphKind: "sqrt", graphPoints: null,
  },
  {
    id: 9, raw: "y = -3", katex: "y = -3",
    isLinear: true, label: "Garis Horizontal",
    description: "Persamaan garis horizontal di y = -3, sejajar sumbu-x.",
    reason: "Setara dengan y = 0·x + (−3). Gradien m = 0. Grafiknya garis lurus mendatar.",
    tip: "Garis horizontal: gradien = 0, berbentuk y = k untuk suatu konstanta k.",
    color: "#60a5fa", graphKind: "horizontal",
    graphPoints: [[-4,-3],[-3,-3],[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3],[3,-3],[4,-3]],
  },
  {
    id: 10, raw: "xy = 4", katex: "xy = 4",
    isLinear: false, label: "Persamaan Hiperbola",
    description: "Persamaan hiperbola dengan asimtot pada sumbu-x dan sumbu-y.",
    reason: "Ada perkalian dua variabel (xy). Persamaan linear tidak boleh memuat perkalian antar variabel.",
    tip: "Perkalian variabel (xy, x²y, dll.) → selalu bukan linear!",
    color: "#e879f9", graphKind: "xy", graphPoints: null,
  },
];

/* ─── Mini SVG Graph ─────────────────────────────────────────── */
const GW = 160, GH = 126, GMX = 80, GMY = 63, GSC = 12;
const gx = (x: number) => GMX + x * GSC;
const gy = (y: number) => GMY - y * GSC;

const MiniGraph: React.FC<{ eq: EqEntry; animKey: number }> = ({ eq, animKey }) => {
  const [prog, setProg] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    setProg(0);
    startRef.current = null;
    const dur = 650;
    const run = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / dur, 1);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setProg(e);
      if (p < 1) rafRef.current = requestAnimationFrame(run);
    };
    rafRef.current = requestAnimationFrame(run);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animKey, eq.id]);

  const c = eq.color;

  const renderPath = () => {
    switch (eq.graphKind) {
      case "line": case "vertical": case "horizontal": {
        if (!eq.graphPoints) return null;
        const n = Math.max(2, Math.round(eq.graphPoints.length * prog));
        const d = eq.graphPoints.slice(0, n)
          .map(([x, y], i) => `${i === 0 ? "M" : "L"}${gx(x)},${gy(y)}`).join(" ");
        return <path d={d} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
      }
      case "curve": {
        const pts = Array.from({ length: 40 }, (_, i) => -3 + i * 0.15);
        const fn = eq.id === 2 ? (x: number) => x * x + 1 : (x: number) => x * x * x;
        const vis = pts.slice(0, Math.round(pts.length * prog));
        const d = vis.map((x, i) => `${i === 0 ? "M" : "L"}${gx(x)},${gy(fn(x))}`).join(" ");
        return <path d={d} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
      }
      case "hyperbola": case "xy": {
        const fn = eq.id === 4 ? (x: number) => 1 / x : (x: number) => 4 / x;
        const b1 = Array.from({ length: 22 }, (_, i) => 0.4 + i * 0.18);
        const b2 = Array.from({ length: 22 }, (_, i) => -0.4 - i * 0.18);
        const n = Math.round(b1.length * prog);
        const d1 = b1.slice(0, n).map((x, i) => `${i === 0 ? "M" : "L"}${gx(x)},${gy(fn(x))}`).join(" ");
        const d2 = b2.slice(0, n).map((x, i) => `${i === 0 ? "M" : "L"}${gx(x)},${gy(fn(x))}`).join(" ");
        return <><path d={d1} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" /><path d={d2} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" /></>;
      }
      case "sqrt": {
        const pts = Array.from({ length: 36 }, (_, i) => i * 0.115);
        const vis = pts.slice(0, Math.round(pts.length * prog));
        const d = vis.map((x, i) => `${i === 0 ? "M" : "L"}${gx(x)},${gy(Math.sqrt(x))}`).join(" ");
        return <path d={d} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" />;
      }
      default: return null;
    }
  };

  return (
    <svg viewBox={`0 0 ${GW} ${GH}`} className="w-full rounded-xl" style={{ background: "rgba(6,12,30,0.95)" }}>
      {[-4,-3,-2,-1,1,2,3,4].map(v => (
        <g key={v}>
          <line x1={gx(v)} y1={3} x2={gx(v)} y2={GH-3} stroke="#0f1f3d" strokeWidth="0.7" />
          <line x1={3} y1={gy(v)} x2={GW-3} y2={gy(v)} stroke="#0f1f3d" strokeWidth="0.7" />
        </g>
      ))}
      <line x1={4} y1={GMY} x2={GW-4} y2={GMY} stroke="#2d3f5e" strokeWidth="1.5" />
      <line x1={GMX} y1={GH-4} x2={GMX} y2={4} stroke="#2d3f5e" strokeWidth="1.5" />
      <polygon points={`${GW-4},${GMY} ${GW-9},${GMY-3} ${GW-9},${GMY+3}`} fill="#2d3f5e" />
      <polygon points={`${GMX},4 ${GMX-3},9 ${GMX+3},9`} fill="#2d3f5e" />
      <text x={GW-12} y={GMY+10} fill="#3d5275" fontSize="8" fontWeight="bold">x</text>
      <text x={GMX+3} y={12} fill="#3d5275" fontSize="8" fontWeight="bold">y</text>
      {renderPath()}
      <rect x={3} y={3} width={eq.raw.length * 5.2 + 6} height={12} rx="2" fill="rgba(6,12,30,0.88)" />
      <text x={6} y={12} fill={c} fontSize="7.5" fontWeight="bold" fontFamily="monospace">{eq.raw}</text>
    </svg>
  );
};

/* ─── Main Component ─────────────────────────────────────────── */
const EquasiGarisLurusAnim: React.FC = () => {
  const [sel, setSel] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // track which IDs the user has already revealed
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const eq = EQUATIONS[sel - 1];

  const pick = (id: number) => {
    if (id === sel) return;
    setSel(id);
    setAnimKey(k => k + 1);
    // hide penjelasan when switching to a new equation
    setRevealed(false);
  };

  const handleReveal = () => {
    setRevealed(true);
    setRevealedIds(prev => new Set(prev).add(sel));
  };

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🎬</span>
        <p className="text-sm font-bold text-cyan-300 font-body">Persamaan Garis Lurus vs. Bukan — Interaktif</p>
      </div>
      <p className="text-xs text-white/60 font-body leading-relaxed">
        Klik nomor <strong className="text-white/80">1–10</strong>, amati persamaan dan grafiknya, lalu tekan <strong className="text-white/80">"Tampilkan Penjelasan"</strong> untuk melihat jawabannya.
      </p>

      {/* Number buttons */}
      <div className="flex gap-2 flex-wrap">
        {EQUATIONS.map(e => (
          <button
            key={e.id}
            onClick={() => pick(e.id)}
            className={`relative w-9 h-9 rounded-full text-xs font-bold font-body border-2 transition-all duration-200 select-none
              ${sel === e.id ? "scale-110 z-10" : "bg-slate-800/70 border-white/10 text-white/50 hover:scale-105 hover:border-white/25"}`}
            style={sel === e.id ? {
              background: "linear-gradient(135deg,#1e3a5f,#1e4d6b)",
              borderColor: e.color,
              color: "#fff",
              boxShadow: `0 0 14px ${e.color}55`,
            } : {}}
          >
            {e.id}
            {/* only show ✓/✗ badge after revealed */}
            {revealedIds.has(e.id) && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold"
                style={{ background: e.isLinear ? "#22d3ee" : "#f43f5e", color: "#fff" }}>
                {e.isLinear ? "✓" : "✗"}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Card: equation + graph always visible */}
      <div key={animKey} className="rounded-xl border border-white/15 overflow-hidden">

        {/* Header: nomor + persamaan (always shown, NO status badge) */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 border-b border-white/8">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-slate-600/80 text-white">
            {eq.id}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/35 font-body leading-none mb-0.5">{eq.label}</p>
            <span className="font-display font-bold text-lg text-white">
              <InlineMath math={eq.katex} />
            </span>
          </div>
          {/* badge: hidden until revealed */}
          <div className={`transition-all duration-500 ${revealed ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-body ${
              eq.isLinear
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/35"
                : "bg-rose-500/15 text-rose-300 border border-rose-500/35"
            }`}>
              {eq.isLinear
                ? <><CheckCircle className="w-3 h-3" /> Garis Lurus</>
                : <><XCircle className="w-3 h-3" /> Bukan Garis Lurus</>}
            </div>
          </div>
        </div>

        {/* Reveal button OR grafik + penjelasan */}
        {!revealed ? (
          <div className="px-4 pb-5 pt-4 bg-slate-900/50 flex flex-col items-center gap-3">
            <p className="text-xs text-white/40 font-body italic">Amati persamaannya, lalu ungkap grafiknya…</p>
            <button
              onClick={handleReveal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-bold text-sm
                bg-gradient-to-r from-violet-600/80 to-cyan-600/80 hover:from-violet-500/90 hover:to-cyan-500/90
                border border-violet-400/30 text-white shadow-lg shadow-violet-900/30
                active:scale-95 transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
              Tampilkan Grafik &amp; Penjelasan
            </button>
          </div>
        ) : (
          <div
            className="px-4 pb-4 pt-1 bg-slate-900/50 space-y-2"
            style={{ animation: "slideDown 0.35s ease-out" }}
          >
            {/* hide button */}
            <div className="flex justify-end mb-1">
              <button
                onClick={() => setRevealed(false)}
                className="flex items-center gap-1.5 text-[11px] font-body text-white/35 hover:text-white/60 transition-colors"
              >
                <EyeOff className="w-3.5 h-3.5" /> Sembunyikan
              </button>
            </div>

            {/* Grafik */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-white/35 uppercase tracking-wider">📊 Grafik</p>
              <MiniGraph eq={eq} animKey={animKey} />
            </div>

            {/* Deskripsi */}
            <div className="rounded-lg p-3 bg-white/5 border border-white/8">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">📋 Deskripsi</p>
              <p className="text-xs font-body text-white/80 leading-relaxed">{eq.description}</p>
            </div>

            {/* Alasan */}
            <div className="rounded-lg p-3 border"
              style={{ background: eq.isLinear ? "rgba(8,145,178,0.07)" : "rgba(190,18,60,0.07)", borderColor: eq.isLinear ? "#0891b228" : "#be123c28" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: eq.isLinear ? "#67e8f9" : "#fda4af" }}>
                {eq.isLinear ? "✅ Mengapa Garis Lurus?" : "❌ Mengapa Bukan Garis Lurus?"}
              </p>
              <p className="text-xs font-body text-white/80 leading-relaxed">{eq.reason}</p>
            </div>

            {/* Tips */}
            <div className="rounded-lg px-3 py-2 bg-yellow-500/8 border border-yellow-500/25">
              <p className="text-[11px] font-body text-yellow-200">
                <strong>💡 Tips:</strong> {eq.tip}
              </p>
            </div>

            {/* Status footer */}
            <div className="rounded-lg px-3 py-2 text-center text-[11px] font-body font-bold"
              style={{
                background: eq.isLinear ? "rgba(8,145,178,0.12)" : "rgba(190,18,60,0.12)",
                color: eq.isLinear ? "#67e8f9" : "#fda4af",
                border: `1px solid ${eq.isLinear ? "#0891b230" : "#be123c30"}`,
              }}>
              {eq.isLinear
                ? "✅ Kesimpulan: Grafik berupa garis LURUS"
                : "❌ Kesimpulan: Grafik BUKAN garis lurus"}
            </div>
          </div>
        )}
      </div>

      {/* Prev / Next nav */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => pick(Math.max(1, sel - 1))} disabled={sel === 1}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold font-body bg-white/8 border border-white/10 text-white/60 disabled:opacity-25 hover:bg-white/15 active:scale-95 transition-all">
          ← Sebelumnya
        </button>
        <span className="text-xs text-white/30 font-body">{sel} / {EQUATIONS.length}</span>
        <button onClick={() => pick(Math.min(EQUATIONS.length, sel + 1))} disabled={sel === EQUATIONS.length}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold font-body bg-white/8 border border-white/10 text-white/60 disabled:opacity-25 hover:bg-white/15 active:scale-95 transition-all">
          Selanjutnya →
        </button>
      </div>

      {/* Summary bar: ✓/✗ only shown after each is revealed */}
      <div className="rounded-xl border border-white/8 overflow-hidden">
        <div className="grid grid-cols-10 bg-slate-800/60">
          {EQUATIONS.map(e => (
            <button key={e.id} onClick={() => pick(e.id)}
              className={`py-2 text-[10px] font-bold font-body text-center transition-all border-r border-white/5 last:border-0 ${
                sel === e.id ? "bg-white/10" : "hover:bg-white/5"
              }`}
              style={{ color: sel === e.id ? e.color : "rgba(255,255,255,0.35)" }}>
              {e.id}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-10">
          {EQUATIONS.map(e => (
            <div key={e.id} className="flex items-center justify-center py-1.5 border-r border-white/5 last:border-0">
              {revealedIds.has(e.id) ? (
                e.isLinear
                  ? <CheckCircle className="w-3 h-3 text-cyan-400/70" />
                  : <XCircle className="w-3 h-3 text-rose-400/70" />
              ) : (
                <span className="w-3 h-3 rounded-full border border-white/15 block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Slide-down keyframe (inline) ──────────────────────────── */
const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`;
if (!document.head.querySelector("[data-eq-anim]")) {
  styleTag.setAttribute("data-eq-anim", "1");
  document.head.appendChild(styleTag);
}

export default EquasiGarisLurusAnim;
