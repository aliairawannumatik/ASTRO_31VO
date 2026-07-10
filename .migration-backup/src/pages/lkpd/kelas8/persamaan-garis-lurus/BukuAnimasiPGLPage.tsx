import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import Starfield from "@/components/Starfield";
import GeoGebraGrapher from "@/components/GeoGebraGrapher";

/* ─── Data: 10 equations ─────────────────────────────────────── */
interface EquationEntry {
  id: number;
  raw: string;
  katex: string;
  isLinear: boolean;
  label: string;
  description: string;
  reason: string;
  tip: string;
  graphColor: string;
  graphPoints: [number, number][] | null;
  graphKind: "line" | "curve" | "vertical" | "horizontal" | "hyperbola" | "sqrt" | "xy";
}

const EQUATIONS: EquationEntry[] = [
  {
    id: 1,
    raw: "y = 2x + 3",
    katex: "y = 2x + 3",
    isLinear: true,
    label: "Bentuk Lereng–Intersep",
    description: "Persamaan garis lurus dengan gradien m = 2 dan titik potong sumbu-y di (0, 3).",
    reason: "Variabel x dan y berpangkat 1 (tertinggi). Grafiknya berupa garis lurus miring ke kanan atas.",
    tip: "Setiap kenaikan 1 satuan pada x, nilai y naik 2 satuan.",
    graphColor: "#22d3ee",
    graphPoints: [[-3,-3],[-2,-1],[-1,1],[0,3],[1,5],[2,7]],
    graphKind: "line",
  },
  {
    id: 2,
    raw: "y = x² + 1",
    katex: "y = x^2 + 1",
    isLinear: false,
    label: "Fungsi Kuadrat",
    description: "Ini adalah persamaan kuadrat (parabola), bukan persamaan garis lurus.",
    reason: "Variabel x berpangkat 2. Persamaan garis lurus hanya boleh berpangkat 1. Grafiknya berbentuk parabola (melengkung), bukan garis lurus.",
    tip: "Ciri non-linear: ada variabel dengan pangkat lebih dari 1.",
    graphColor: "#f472b6",
    graphPoints: null,
    graphKind: "curve",
  },
  {
    id: 3,
    raw: "3x - 2y = 6",
    katex: "3x - 2y = 6",
    isLinear: true,
    label: "Bentuk Umum ax + by = c",
    description: "Bentuk umum persamaan garis lurus. Bisa diubah ke y = (3/2)x - 3 dengan gradien 3/2.",
    reason: "Variabel x dan y keduanya berpangkat 1. Tidak ada operasi perkalian antar variabel. Grafiknya garis lurus.",
    tip: "Ubah ke bentuk y = mx + c: 2y = 3x - 6, maka y = (3/2)x - 3.",
    graphColor: "#a78bfa",
    graphPoints: [[-2,-6],[-1,-4.5],[0,-3],[1,-1.5],[2,0],[3,1.5],[4,3]],
    graphKind: "line",
  },
  {
    id: 4,
    raw: "y = 1/x",
    katex: "y = \\dfrac{1}{x}",
    isLinear: false,
    label: "Fungsi Hiperbola",
    description: "Persamaan hiperbola. Grafiknya berupa dua cabang kurva, bukan garis lurus.",
    reason: "Dapat ditulis y = x⁻¹, artinya x berpangkat -1. Bukan pangkat 1. Selain itu, x tidak boleh 0 (tak terdefinisi). Grafiknya melengkung.",
    tip: "Pangkat negatif atau pecahan → bukan persamaan garis lurus.",
    graphColor: "#fb923c",
    graphPoints: null,
    graphKind: "hyperbola",
  },
  {
    id: 5,
    raw: "x + y = 5",
    katex: "x + y = 5",
    isLinear: true,
    label: "Garis dengan Gradien -1",
    description: "Persamaan garis lurus sederhana. Ekuivalen dengan y = -x + 5, gradien = -1.",
    reason: "Variabel x dan y berpangkat 1. Tidak ada perkalian x dan y. Grafiknya garis lurus miring ke kanan bawah.",
    tip: "Titik potong sb-x: (5, 0). Titik potong sb-y: (0, 5).",
    graphColor: "#4ade80",
    graphPoints: [[-1,6],[0,5],[1,4],[2,3],[3,2],[4,1],[5,0],[6,-1]],
    graphKind: "line",
  },
  {
    id: 6,
    raw: "y = x³",
    katex: "y = x^3",
    isLinear: false,
    label: "Fungsi Kubik",
    description: "Persamaan fungsi kubik (pangkat 3). Grafiknya berbentuk kurva S, bukan garis lurus.",
    reason: "Variabel x berpangkat 3. Persamaan linear hanya boleh memiliki variabel dengan pangkat 1. Grafiknya tidak lurus.",
    tip: "Periksa pangkat tertinggi variabelnya — kalau lebih dari 1, bukan garis lurus.",
    graphColor: "#f87171",
    graphPoints: null,
    graphKind: "curve",
  },
  {
    id: 7,
    raw: "2x + 5 = 0",
    katex: "2x + 5 = 0",
    isLinear: true,
    label: "Garis Vertikal",
    description: "Persamaan garis vertikal. Solusinya x = -5/2 = -2,5. Garis tegak lurus sumbu-x.",
    reason: "Hanya memuat variabel x berpangkat 1, tidak ada variabel y. Ini adalah bentuk khusus persamaan garis lurus — garis vertikal di x = -2,5.",
    tip: "Garis vertikal tidak memiliki gradien (tak terdefinisi / ~∞).",
    graphColor: "#facc15",
    graphPoints: [[-2.5,-4],[-2.5,-3],[-2.5,-2],[-2.5,-1],[-2.5,0],[-2.5,1],[-2.5,2],[-2.5,3],[-2.5,4]],
    graphKind: "vertical",
  },
  {
    id: 8,
    raw: "y = √x",
    katex: "y = \\sqrt{x}",
    isLinear: false,
    label: "Fungsi Akar",
    description: "Persamaan fungsi akar kuadrat. Grafiknya berupa setengah parabola yang dilipat.",
    reason: "Dapat ditulis y = x^(1/2), artinya x berpangkat ½. Bukan pangkat 1. Grafiknya melengkung, bukan garis lurus.",
    tip: "Akar = pangkat ½ = bukan linear!",
    graphColor: "#34d399",
    graphPoints: null,
    graphKind: "sqrt",
  },
  {
    id: 9,
    raw: "y = -3",
    katex: "y = -3",
    isLinear: true,
    label: "Garis Horizontal",
    description: "Persamaan garis horizontal di y = -3. Sejajar dengan sumbu-x.",
    reason: "Ini setara dengan y = 0·x + (-3), sehingga gradien m = 0. Grafiknya garis lurus horizontal. Hanya memuat konstanta.",
    tip: "Garis horizontal: gradien = 0, berbentuk y = k untuk suatu konstanta k.",
    graphColor: "#60a5fa",
    graphPoints: [[-4,-3],[-3,-3],[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3],[3,-3],[4,-3]],
    graphKind: "horizontal",
  },
  {
    id: 10,
    raw: "xy = 4",
    katex: "xy = 4",
    isLinear: false,
    label: "Persamaan Hiperbola",
    description: "Persamaan hiperbola dengan asimtot pada sumbu-x dan sumbu-y.",
    reason: "Ada perkalian dua variabel (xy). Persamaan linear tidak boleh memuat perkalian antar variabel. Grafiknya bukan garis lurus.",
    tip: "Perkalian variabel (xy, x²y, dll.) → selalu bukan linear!",
    graphColor: "#e879f9",
    graphPoints: null,
    graphKind: "xy",
  },
];

/* ─── Mini SVG Graph ─────────────────────────────────────────── */
const W = 180, H = 140, MX = 90, MY = 70, SC = 14;
const px = (x: number) => MX + x * SC;
const py = (y: number) => MY - y * SC;
const TICKS = [-4, -3, -2, -1, 1, 2, 3, 4];

const MiniGraph: React.FC<{ entry: EquationEntry; animated: boolean }> = ({ entry, animated }) => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    setProgress(0);
    startRef.current = null;
    const dur = 700;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / dur, 1);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    if (animated) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setProgress(1);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animated, entry.id]);

  const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  const renderGraph = () => {
    const c = entry.graphColor;
    switch (entry.graphKind) {
      case "line":
      case "vertical":
      case "horizontal": {
        if (!entry.graphPoints) return null;
        const pts = entry.graphPoints;
        const n = Math.max(2, Math.round(pts.length * eased));
        const visible = pts.slice(0, n);
        const d = visible.map(([x, y], i) => `${i === 0 ? "M" : "L"}${px(x)},${py(y)}`).join(" ");
        return <path d={d} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
      }
      case "curve": {
        const curveX = Array.from({ length: 40 }, (_, i) => -3 + i * 0.15);
        const visible = curveX.slice(0, Math.round(curveX.length * eased));
        const fn = entry.id === 2 ? (x: number) => x * x + 1 : (x: number) => x * x * x;
        const d = visible.map((x, i) => {
          const y = fn(x);
          return `${i === 0 ? "M" : "L"}${px(x)},${py(y)}`;
        }).join(" ");
        return <path d={d} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
      }
      case "hyperbola":
      case "xy": {
        const fn = entry.id === 4 ? (x: number) => 1 / x : (x: number) => 4 / x;
        const branch1 = Array.from({ length: 25 }, (_, i) => 0.35 + i * 0.16);
        const branch2 = Array.from({ length: 25 }, (_, i) => -0.35 - i * 0.16);
        const n1 = Math.round(branch1.length * eased);
        const n2 = Math.round(branch2.length * eased);
        const d1 = branch1.slice(0, n1).map((x, i) => `${i === 0 ? "M" : "L"}${px(x)},${py(fn(x))}`).join(" ");
        const d2 = branch2.slice(0, n2).map((x, i) => `${i === 0 ? "M" : "L"}${px(x)},${py(fn(x))}`).join(" ");
        return (
          <>
            <path d={d1} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={d2} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      }
      case "sqrt": {
        const sqrtX = Array.from({ length: 35 }, (_, i) => i * 0.12);
        const visible = sqrtX.slice(0, Math.round(sqrtX.length * eased));
        const d = visible.map((x, i) => `${i === 0 ? "M" : "L"}${px(x)},${py(Math.sqrt(x))}`).join(" ");
        return <path d={d} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
      }
      default: return null;
    }
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ background: "rgba(6,12,30,0.95)", maxHeight: 200 }}>
      {/* Grid */}
      {TICKS.map(v => (
        <g key={v}>
          <line x1={px(v)} y1={6} x2={px(v)} y2={H - 6} stroke="#0f1f3d" strokeWidth="0.8" />
          <line x1={6} y1={py(v)} x2={W - 6} y2={py(v)} stroke="#0f1f3d" strokeWidth="0.8" />
        </g>
      ))}
      {/* Axes */}
      <line x1={6} y1={MY} x2={W - 6} y2={MY} stroke="#334155" strokeWidth="1.5" />
      <line x1={MX} y1={H - 6} x2={MX} y2={6} stroke="#334155" strokeWidth="1.5" />
      {/* Axis arrows */}
      <polygon points={`${W - 6},${MY} ${W - 12},${MY - 4} ${W - 12},${MY + 4}`} fill="#334155" />
      <polygon points={`${MX},6 ${MX - 4},12 ${MX + 4},12`} fill="#334155" />
      {/* Axis labels */}
      <text x={W - 12} y={MY + 12} fill="#475569" fontSize="9" fontWeight="bold">x</text>
      <text x={MX + 4} y={14} fill="#475569" fontSize="9" fontWeight="bold">y</text>
      <text x={MX + 3} y={MY + 12} fill="#334155" fontSize="7">O</text>
      {/* Tick marks */}
      {[-4, -2, 2, 4].map(v => (
        <g key={`t${v}`}>
          <text x={px(v) - (v < 0 ? 6 : 3)} y={MY + 11} fill="#374151" fontSize="7">{v}</text>
          <text x={MX - 13} y={py(v) + 3} fill="#374151" fontSize="7">{v}</text>
        </g>
      ))}
      {/* Equation graph */}
      {renderGraph()}
      {/* Equation label */}
      <rect x={4} y={4} width={entry.raw.length * 5.5 + 8} height={13} rx="3" fill="rgba(15,23,42,0.9)" />
      <text x={8} y={13.5} fill={entry.graphColor} fontSize="8" fontWeight="bold" fontFamily="monospace">{entry.raw}</text>
    </svg>
  );
};

/* ─── Number Button ──────────────────────────────────────────── */
const NumBtn: React.FC<{
  entry: EquationEntry;
  selected: boolean;
  onClick: () => void;
  animated: boolean;
}> = ({ entry, selected, onClick, animated }) => {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (animated) { setPulse(true); const t = setTimeout(() => setPulse(false), 600); return () => clearTimeout(t); }
  }, [animated]);

  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 rounded-full font-bold text-sm font-body transition-all duration-300 border-2 select-none
        ${selected
          ? "scale-110 shadow-lg z-10"
          : "hover:scale-105 bg-slate-800/80 border-white/10 text-white/60 hover:border-white/30"
        }
        ${pulse ? "animate-bounce" : ""}
      `}
      style={selected ? {
        background: entry.isLinear
          ? "linear-gradient(135deg,#0e7490,#0891b2)"
          : "linear-gradient(135deg,#9f1239,#be123c)",
        borderColor: entry.graphColor,
        color: "#fff",
        boxShadow: `0 0 18px ${entry.graphColor}66`,
      } : {}}
    >
      {entry.id}
      {selected && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
          style={{ background: entry.isLinear ? "#22d3ee" : "#f43f5e" }}>
          {entry.isLinear ? "✓" : "✗"}
        </span>
      )}
    </button>
  );
};

/* ─── Main Page ──────────────────────────────────────────────── */
const BukuAnimasiPGLPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number>(1);
  const [animKey, setAnimKey] = useState(0);
  const [prevSelected, setPrevSelected] = useState<number | null>(null);

  const entry = EQUATIONS[selected - 1];

  const handleSelect = (id: number) => {
    if (id === selected) return;
    setPrevSelected(selected);
    setSelected(id);
    setAnimKey(k => k + 1);
  };

  const linearCount = EQUATIONS.filter(e => e.isLinear).length;
  const nonLinearCount = EQUATIONS.filter(e => !e.isLinear).length;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />

      {/* Header */}
      <div className="relative z-10 w-full max-w-3xl px-4 pt-5 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-body text-white/50 hover:text-white/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-body font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" /> BUKU ANIMASI MATEMATIKA · KELAS 8
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white text-glow-cyan mb-1">
            PERSAMAAN GARIS LURUS
          </h1>
          <p className="text-white/50 text-xs font-body">
            Klik nomor untuk melihat apakah persamaan tersebut merupakan persamaan garis lurus atau bukan
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex gap-3 justify-center mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-body text-cyan-300 font-semibold">{linearCount} Persamaan Garis</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-body text-rose-300 font-semibold">{nonLinearCount} Bukan Garis Lurus</span>
          </div>
        </div>

        {/* Number selector */}
        <div className="flex gap-2 justify-center flex-wrap mb-6">
          {EQUATIONS.map(eq => (
            <NumBtn
              key={eq.id}
              entry={eq}
              selected={selected === eq.id}
              onClick={() => handleSelect(eq.id)}
              animated={animKey > 0 && selected === eq.id}
            />
          ))}
        </div>

        {/* Detail card */}
        <div
          key={animKey}
          className="bg-card/80 backdrop-blur rounded-2xl border overflow-hidden mb-6 animate-slide-up"
          style={{ borderColor: entry.isLinear ? "#0891b2" + "55" : "#be123c" + "55" }}
        >
          {/* Card header */}
          <div
            className="flex items-center gap-3 px-5 py-4 border-b"
            style={{
              background: entry.isLinear
                ? "linear-gradient(to right,rgba(8,145,178,0.15),transparent)"
                : "linear-gradient(to right,rgba(190,18,60,0.15),transparent)",
              borderColor: entry.isLinear ? "#0891b233" : "#be123c33",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shrink-0"
              style={{ background: entry.isLinear ? "#0e7490" : "#9f1239", color: "#fff" }}
            >
              {entry.id}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/40 font-body">{entry.label}</p>
              <div className="font-display font-bold text-lg text-white leading-tight mt-0.5">
                <InlineMath math={entry.katex} />
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-body shrink-0 ${
              entry.isLinear
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40"
                : "bg-rose-500/15 text-rose-300 border border-rose-500/40"
            }`}>
              {entry.isLinear
                ? <><CheckCircle className="w-3.5 h-3.5" /> Garis Lurus</>
                : <><XCircle className="w-3.5 h-3.5" /> Bukan Garis Lurus</>
              }
            </div>
          </div>

          {/* Card body */}
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: text */}
            <div className="space-y-3">
              {/* Description */}
              <div className="rounded-xl p-3.5 bg-white/5 border border-white/8">
                <p className="text-xs font-bold font-body text-white/50 mb-1.5 uppercase tracking-wider">📋 Deskripsi</p>
                <p className="text-sm font-body text-white/85 leading-relaxed">{entry.description}</p>
              </div>

              {/* Reason */}
              <div
                className="rounded-xl p-3.5 border"
                style={{
                  background: entry.isLinear ? "rgba(8,145,178,0.08)" : "rgba(190,18,60,0.08)",
                  borderColor: entry.isLinear ? "#0891b233" : "#be123c33",
                }}
              >
                <p className="text-xs font-bold font-body mb-1.5 uppercase tracking-wider"
                  style={{ color: entry.isLinear ? "#67e8f9" : "#fda4af" }}>
                  {entry.isLinear ? "✅ Mengapa Termasuk Garis Lurus?" : "❌ Mengapa BUKAN Garis Lurus?"}
                </p>
                <p className="text-sm font-body text-white/80 leading-relaxed">{entry.reason}</p>
              </div>

              {/* Tip */}
              <div className="rounded-xl p-3 bg-yellow-500/8 border border-yellow-500/25">
                <p className="text-xs font-body text-yellow-200">
                  <span className="font-bold">💡 Tips: </span>{entry.tip}
                </p>
              </div>
            </div>

            {/* Right: mini graph */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold font-body text-white/40 uppercase tracking-wider">📊 Grafik</p>
              <MiniGraph entry={entry} animated={true} key={`graph-${animKey}`} />
              <div
                className="rounded-lg px-3 py-2 text-center text-xs font-body"
                style={{
                  background: entry.isLinear ? "rgba(8,145,178,0.1)" : "rgba(190,18,60,0.1)",
                  color: entry.isLinear ? "#67e8f9" : "#fda4af",
                  border: `1px solid ${entry.isLinear ? "#0891b222" : "#be123c22"}`,
                }}
              >
                {entry.isLinear ? "Grafik berupa garis LURUS ✓" : "Grafik BUKAN garis lurus ✗"}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation between equations */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <button
            onClick={() => handleSelect(Math.max(1, selected - 1))}
            disabled={selected === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-body bg-white/8 border border-white/10 text-white/70 disabled:opacity-25 hover:bg-white/15 active:scale-95 transition-all"
          >
            ← Sebelumnya
          </button>
          <span className="text-xs text-white/30 font-body">
            {selected} / {EQUATIONS.length}
          </span>
          <button
            onClick={() => handleSelect(Math.min(EQUATIONS.length, selected + 1))}
            disabled={selected === EQUATIONS.length}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-body bg-white/8 border border-white/10 text-white/70 disabled:opacity-25 hover:bg-white/15 active:scale-95 transition-all"
          >
            Selanjutnya →
          </button>
        </div>

        {/* Quick reference table */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span className="font-body font-semibold text-white text-sm">Ringkasan 10 Persamaan</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="bg-slate-800/60">
                  <th className="px-4 py-2.5 text-white/50 text-left font-semibold">No</th>
                  <th className="px-4 py-2.5 text-white/50 text-left font-semibold">Persamaan</th>
                  <th className="px-4 py-2.5 text-white/50 text-center font-semibold">Status</th>
                  <th className="px-4 py-2.5 text-white/50 text-left font-semibold hidden sm:table-cell">Jenis</th>
                </tr>
              </thead>
              <tbody>
                {EQUATIONS.map((eq, i) => (
                  <tr
                    key={eq.id}
                    onClick={() => handleSelect(eq.id)}
                    className={`border-t border-white/5 cursor-pointer transition-colors ${
                      selected === eq.id ? "bg-white/8" : "hover:bg-white/5"
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                        style={{
                          background: selected === eq.id
                            ? (eq.isLinear ? "#0e7490" : "#9f1239")
                            : "rgba(255,255,255,0.05)",
                          color: selected === eq.id ? "#fff" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {eq.id}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono" style={{ color: eq.graphColor }}>{eq.raw}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {eq.isLinear
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                            <CheckCircle className="w-2.5 h-2.5" /> Garis Lurus
                          </span>
                        : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                            <XCircle className="w-2.5 h-2.5" /> Bukan
                          </span>
                      }
                    </td>
                    <td className="px-4 py-2.5 text-white/40 hidden sm:table-cell">{eq.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aturan kunci */}
        <div className="bg-gradient-to-br from-violet-900/30 to-cyan-900/20 border border-violet-500/30 rounded-2xl p-5 mb-8">
          <p className="font-body font-bold text-violet-300 text-sm mb-3">🔑 Aturan Kunci: Kapan Suatu Persamaan Merupakan Persamaan Garis Lurus?</p>
          <div className="space-y-2">
            {[
              { icon: "✅", text: "Semua variabel (x dan y) berpangkat paling tinggi 1", ok: true },
              { icon: "✅", text: "Tidak ada perkalian antar variabel (tidak ada xy, x²y, dll.)", ok: true },
              { icon: "✅", text: "Tidak ada variabel dalam bentuk akar atau pangkat negatif", ok: true },
              { icon: "❌", text: "Jika ada x² atau y² → bukan garis lurus (parabola)", ok: false },
              { icon: "❌", text: "Jika ada perkalian xy → bukan garis lurus (hiperbola)", ok: false },
              { icon: "❌", text: "Jika ada √x atau x⁻¹ → bukan garis lurus", ok: false },
            ].map(({ icon, text, ok }, i) => (
              <div key={i} className={`flex items-start gap-2 text-xs font-body rounded-lg px-3 py-2 ${
                ok ? "bg-cyan-500/8 text-cyan-200" : "bg-rose-500/8 text-rose-200"
              }`}>
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GeoGebra Lab — below the animation */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden mb-10">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
            <span className="text-xl">🖥️</span>
            <div>
              <p className="font-body font-semibold text-white text-sm">Laboratorium Grafik Interaktif</p>
              <p className="text-xs font-body text-white/40">Gambar sendiri persamaan di atas — lihat grafiknya langsung!</p>
            </div>
          </div>
          <div className="p-4">
            <GeoGebraGrapher />
            <div className="mt-3 bg-violet-500/10 border border-violet-500/30 rounded-xl p-3">
              <p className="text-xs font-body text-violet-200 leading-relaxed">
                <strong>💡 Coba ketik:</strong>{" "}
                <span className="font-mono">y = 2x + 3</span> · <span className="font-mono">y = x^2 + 1</span> · <span className="font-mono">xy = 4</span> · <span className="font-mono">y = sqrt(x)</span>
                {" "}— bandingkan mana yang grafiknya lurus dan mana yang melengkung!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BukuAnimasiPGLPage;
