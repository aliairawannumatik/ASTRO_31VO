import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Node {
  id: number;
  value: number;
  x: number;
  y: number;
  isPrime: boolean;
  parentId?: number;
}

interface TreeConfig {
  label: string;
  result: string;
  color: string;
  glowColor: string;
  nodes: Node[];
  edges: { from: number; to: number }[];
}

const tree12Nodes: Node[] = [
  { id: 0, value: 12, x: 130, y: 28, isPrime: false },
  { id: 1, value: 2,  x: 60,  y: 100, isPrime: true },
  { id: 2, value: 6,  x: 200, y: 100, isPrime: false, parentId: 0 },
  { id: 3, value: 2,  x: 150, y: 172, isPrime: true,  parentId: 2 },
  { id: 4, value: 3,  x: 250, y: 172, isPrime: true,  parentId: 2 },
];
const tree12Edges = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
];

const tree18Nodes: Node[] = [
  { id: 0, value: 18, x: 130, y: 28, isPrime: false },
  { id: 1, value: 2,  x: 60,  y: 100, isPrime: true },
  { id: 2, value: 9,  x: 200, y: 100, isPrime: false, parentId: 0 },
  { id: 3, value: 3,  x: 150, y: 172, isPrime: true,  parentId: 2 },
  { id: 4, value: 3,  x: 250, y: 172, isPrime: true,  parentId: 2 },
];
const tree18Edges = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
];

const REVEAL_STEPS = [
  [0],
  [0, 1, 2],
  [0, 1, 2, 3, 4],
];

function FactorTree({ tree, step, primeLabel }: { tree: TreeConfig; step: number; primeLabel: string }) {
  const visibleIds = new Set(REVEAL_STEPS[Math.min(step, REVEAL_STEPS.length - 1)]);

  const getNode = (id: number) => tree.nodes.find((n) => n.id === id)!;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold" style={{ color: tree.color }}>
        {tree.label}
      </p>
      <svg viewBox="0 0 310 210" width="100%" style={{ maxWidth: 280 }}>
        {tree.edges.map((edge, i) => {
          const from = getNode(edge.from);
          const to = getNode(edge.to);
          const visible = visibleIds.has(edge.from) && visibleIds.has(edge.to);
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={tree.color}
              strokeWidth="2"
              strokeOpacity={visible ? 0.7 : 0}
              style={{ transition: "stroke-opacity 0.4s ease" }}
            />
          );
        })}

        {tree.nodes.map((node) => {
          const visible = visibleIds.has(node.id);
          return (
            <g
              key={node.id}
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            >
              {node.isPrime ? (
                <>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={22}
                    fill="rgba(250,204,21,0.15)"
                    stroke="#facc15"
                    strokeWidth="2"
                  />
                  <filter id={`glow-prime-${node.id}`}>
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill="#facc15"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {node.value}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 36}
                    textAnchor="middle"
                    fill="#facc15"
                    fontSize="8"
                    opacity="0.9"
                  >
                    {primeLabel}
                  </text>
                </>
              ) : (
                <>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={22}
                    fill={`rgba(${node.id === 0 ? "255,255,255" : "100,100,120"},0.08)`}
                    stroke={tree.color}
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill="var(--icon-color)"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {node.value}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <div
        className="text-xs font-bold px-3 py-1 rounded-full"
        style={{
          color: tree.color,
          background: `rgba(${tree.color === "#38bdf8" ? "56,189,248" : "167,139,250"},0.1)`,
          border: `1px solid ${tree.color}50`,
          opacity: step >= 2 ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {tree.result}
      </div>
    </div>
  );
}

export default function FactorTreeAnimation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { language } = useLanguage();

  const translations = {
    id: {
      title: "🌳 Animasi Pohon Faktor",
      start: "▶ Mulai",
      reset: "↺ Reset",
      steps: ["Tampilkan akar", "Pecah menjadi dua", "Temukan faktor prima"],
      tree12Label: "Pohon Faktor 12",
      tree18Label: "Pohon Faktor 18",
      primeLabel: "★ Prima",
      legendPrime: "Bilangan kuning",
      legendPrimeDesc: "= bilangan prima (tidak bisa dibagi lagi)",
      legendLCM: "KPK",
      legendLCMDesc: "= pangkat tertinggi →",
      legendGCD: "FPB",
      legendGCDDesc: "= pangkat terendah (faktor sama) →",
    },
    en: {
      title: "🌳 Factor Tree Animation",
      start: "▶ Start",
      reset: "↺ Reset",
      steps: ["Show root", "Split into two", "Find prime factors"],
      tree12Label: "Factor Tree 12",
      tree18Label: "Factor Tree 18",
      primeLabel: "★ Prime",
      legendPrime: "Yellow numbers",
      legendPrimeDesc: "= prime numbers (cannot be divided further)",
      legendLCM: "LCM",
      legendLCMDesc: "= highest power →",
      legendGCD: "GCD",
      legendGCDDesc: "= lowest power (common factors) →",
    },
    ja: {
      title: "🌳 因数木アニメーション",
      start: "▶ 開始",
      reset: "↺ リセット",
      steps: ["根を表示", "2つに分割", "素因数を探す"],
      tree12Label: "因数木 12",
      tree18Label: "因数木 18",
      primeLabel: "★ 素数",
      legendPrime: "黄色の数",
      legendPrimeDesc: "= 素数（これ以上割れない）",
      legendLCM: "最小公倍数",
      legendLCMDesc: "= 最高の指数 →",
      legendGCD: "最大公約数",
      legendGCDDesc: "= 最小の指数（共通因数）→",
    },
  };

  const c = translations[language];

  const tree12: TreeConfig = {
    label: c.tree12Label,
    result: "12 = 2² × 3",
    color: "#38bdf8",
    glowColor: "rgba(56,189,248,0.4)",
    nodes: tree12Nodes,
    edges: tree12Edges,
  };

  const tree18: TreeConfig = {
    label: c.tree18Label,
    result: "18 = 2 × 3²",
    color: "#a78bfa",
    glowColor: "rgba(167,139,250,0.4)",
    nodes: tree18Nodes,
    edges: tree18Edges,
  };

  useEffect(() => {
    if (!playing) return;
    if (step >= REVEAL_STEPS.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(timer);
  }, [playing, step]);

  const handlePlay = () => {
    setStep(0);
    setPlaying(true);
  };

  const handleReset = () => {
    setPlaying(false);
    setStep(0);
  };

  return (
    <div className="bg-slate-900/60 border border-blue-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-blue-300">{c.title}</p>
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            disabled={playing}
            className="text-xs px-3 py-1 rounded-full font-semibold transition-all"
            style={{
              background: playing ? "rgba(56,189,248,0.1)" : "rgba(56,189,248,0.2)",
              color: "#38bdf8",
              border: "1px solid rgba(56,189,248,0.4)",
              opacity: playing ? 0.6 : 1,
              cursor: playing ? "not-allowed" : "pointer",
            }}
          >
            {c.start}
          </button>
          <button
            onClick={handleReset}
            className="text-xs px-3 py-1 rounded-full font-semibold transition-all"
            style={{
              background: "rgba(148,163,184,0.1)",
              color: "#94a3b8",
              border: "1px solid rgba(148,163,184,0.3)",
              cursor: "pointer",
            }}
          >
            {c.reset}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-white/50">
        {c.steps.map((label, i) => (
          <span key={i} className="flex items-center gap-1">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{
                background: step >= i ? "rgba(56,189,248,0.3)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${step >= i ? "#38bdf8" : "rgba(255,255,255,0.1)"}`,
                color: step >= i ? "#38bdf8" : "#64748b",
              }}
            >
              {i + 1}
            </span>
            <span className={step >= i ? "text-blue-300" : ""}>{label}</span>
            {i < 2 && <span className="mx-1 text-white/20">→</span>}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FactorTree tree={tree12} step={step} primeLabel={c.primeLabel} />
        <FactorTree tree={tree18} step={step} primeLabel={c.primeLabel} />
      </div>

      {step >= 2 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-lg p-3 text-xs text-white/70 space-y-1 animate-fade-in">
          <p>
            <span className="text-yellow-400 font-semibold">★ {c.legendPrime}</span> {c.legendPrimeDesc}
          </p>
          <p>
            <span className="text-sky-400 font-semibold">{c.legendLCM}</span> {c.legendLCMDesc}{" "}
            <span className="text-sky-300 font-bold">2² × 3² = 36</span>
          </p>
          <p>
            <span className="text-orange-400 font-semibold">{c.legendGCD}</span> {c.legendGCDDesc}{" "}
            <span className="text-orange-300 font-bold">2¹ × 3¹ = 6</span>
          </p>
        </div>
      )}
    </div>
  );
}
