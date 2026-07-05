import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const COLORS = {
  alas: "#22d3ee",
  atas: "#facc15",
};

type Point = [number, number];

const ngon = (
  cx: number, cy: number,
  rx: number, ry: number,
  n: number, startAngle = -Math.PI / 2
): Point[] =>
  Array.from({ length: n }, (_, i) => {
    const a = startAngle + (2 * Math.PI * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });

const poly = (pts: Point[]) =>
  pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

interface PrismaProps {
  n: number;
  cx: number;
  name: string;
  titikLabel: string;
  phase: number;
}

const TitikStandingPrisma = ({ n, cx, name, titikLabel, phase }: PrismaProps) => {
  const topCY = 28, botCY = 148;
  const faceRX = 26, faceRY = 9;
  const startAngle = n === 4 ? -Math.PI / 4 : -Math.PI / 2;

  const top: Point[] = ngon(cx, topCY, faceRX, faceRY, n, startAngle);
  const bot: Point[] = ngon(cx, botCY, faceRX, faceRY, n, startAngle);

  const showAlas = phase === 0 || phase === 2;
  const showAtas = phase === 1 || phase === 2;

  const rAlas  = showAlas ? 5.5 : 2.5;
  const rAtas  = showAtas ? 5.5 : 2.5;
  const opAlas = showAlas ? 1 : 0.18;
  const opAtas = showAtas ? 1 : 0.18;
  const clsAlas = showAlas ? "titik-glow-alas" : "";
  const clsAtas = showAtas ? "titik-glow-atas"  : "";

  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const i2 = (i + 1) % n;
        const pts: Point[] = [bot[i], bot[i2], top[i2], top[i]];
        const midX = pts.reduce((s, p) => s + p[0], 0) / 4;
        if (midX < cx - 28) return null;
        return (
          <polygon key={`face-${i}`} points={poly(pts)}
            fill="rgba(51,65,85,0.35)" stroke="rgba(100,116,139,0.25)" strokeWidth="0.5" />
        );
      })}
      <polygon points={poly(bot)} fill="rgba(15,23,42,0.55)" stroke="#334155" strokeWidth="0.8" />
      <polygon points={poly(top)} fill="rgba(30,41,59,0.7)"  stroke="#334155" strokeWidth="0.8" />
      {bot.map((b, i) => (
        <line key={`v-${i}`}
          x1={b[0].toFixed(1)} y1={b[1].toFixed(1)}
          x2={top[i][0].toFixed(1)} y2={top[i][1].toFixed(1)}
          stroke="#334155" strokeWidth="0.8" />
      ))}
      {bot.map(([x, y], i) => (
        <circle key={`alas-${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)}
          r={rAlas} fill={COLORS.alas} opacity={opAlas}
          className={clsAlas} style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
      {top.map(([x, y], i) => (
        <circle key={`atas-${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)}
          r={rAtas} fill={COLORS.atas} opacity={opAtas}
          className={clsAtas} style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
      <text x={cx} y={174} textAnchor="middle" fontSize="8.5" fill="#e2e8f0"
        fontFamily="sans-serif" fontWeight="bold">{name}</text>
      <text x={cx} y={186} textAnchor="middle" fontSize="7.5" fill="#94a3b8"
        fontFamily="monospace">{titikLabel}</text>
    </g>
  );
};

export default function TitikSudutTigaPrismaAnimation() {
  const { language: lang } = useLanguage();
  const [phase, setPhase] = useState(0);
  const [auto,  setAuto]  = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setPhase(p => (p + 1) % 3), 2200);
    return () => clearInterval(id);
  }, [auto]);

  const PHASES = [
    {
      key: "alas",
      label: lang === "en" ? "Bottom Vertices" : lang === "ja" ? "底面の頂点" : "Titik Sudut Alas",
      color: COLORS.alas,
      desc:  lang === "en"
        ? "vertices forming the bottom base polygon"
        : lang === "ja" ? "底面を形成する頂点"
        : "titik-titik sudut yang membentuk alas (bawah)",
    },
    {
      key: "atas",
      label: lang === "en" ? "Top Vertices"    : lang === "ja" ? "上面の頂点" : "Titik Sudut Atas",
      color: COLORS.atas,
      desc:  lang === "en"
        ? "vertices forming the top lid — same count as the bottom"
        : lang === "ja" ? "上面を形成する頂点 — 底面と同じ個数"
        : "titik-titik sudut yang membentuk tutup (atas) — sama banyak dengan alas",
    },
    {
      key: "all",
      label: lang === "en" ? "All Vertices"    : lang === "ja" ? "全頂点"     : "Semua Titik Sudut",
      color: "#a78bfa",
      desc:  lang === "en"
        ? "total vertices = 2 × n  (n = number of base sides)"
        : lang === "ja" ? "頂点の合計 = 2 × n（n = 底面の辺の数）"
        : "total titik sudut = 2 × n  (n = jumlah sisi alas)",
    },
  ];

  const PRISMS = [
    {
      n: 3, cx: 57,
      name:       lang === "en" ? "Triangular Prism"    : lang === "ja" ? "三角柱" : "Prisma Segitiga",
      titikLabel: lang === "en" ? "2×3 = 6 vertices"    : lang === "ja" ? "2×3 = 6頂点" : "2×3 = 6 titik",
    },
    {
      n: 4, cx: 170,
      name:       lang === "en" ? "Quadrilateral Prism" : lang === "ja" ? "四角柱" : "Prisma Segiempat",
      titikLabel: lang === "en" ? "2×4 = 8 vertices"    : lang === "ja" ? "2×4 = 8頂点" : "2×4 = 8 titik",
    },
    {
      n: 5, cx: 283,
      name:       lang === "en" ? "Pentagonal Prism"    : lang === "ja" ? "五角柱" : "Prisma Segilima",
      titikLabel: lang === "en" ? "2×5 = 10 vertices"   : lang === "ja" ? "2×5 = 10頂点" : "2×5 = 10 titik",
    },
  ];

  const caption = lang === "en"
    ? "Top and Bottom always have the SAME number of vertices  ·  Vertices = 2n"
    : lang === "ja" ? "上面と底面の頂点数は常に同じ  ·  頂点 = 2n"
    : "Titik sudut Atas dan Alas selalu sama banyak  ·  T. Sudut = 2n";

  const legendItems = [
    { color: COLORS.alas, label: lang === "en" ? "Bottom Vertices" : lang === "ja" ? "底面の頂点" : "Titik Sudut Alas" },
    { color: COLORS.atas, label: lang === "en" ? "Top Vertices"    : lang === "ja" ? "上面の頂点" : "Titik Sudut Atas" },
  ];

  const autoLabel = auto
    ? (lang === "en" ? "⏸ Pause auto-play" : lang === "ja" ? "⏸ 自動停止" : "⏸ Berhenti otomatis")
    : (lang === "en" ? "▶ Resume auto-play" : lang === "ja" ? "▶ 自動再生" : "▶ Putar otomatis");

  const current = PHASES[phase];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {PHASES.map((p, i) => (
          <button key={p.key}
            onClick={() => { setPhase(i); setAuto(false); }}
            className="text-xs font-bold py-1.5 px-2.5 rounded-lg border transition-all duration-200 font-body"
            style={{
              borderColor: p.color,
              color: phase === i ? "#0f172a" : p.color,
              backgroundColor: phase === i ? p.color : "transparent",
              opacity: phase === i ? 1 : 0.55,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden">
        <svg viewBox="0 0 340 218" className="w-full" style={{ maxHeight: 245 }}>
          <defs>
            <style>{`
              @keyframes titikGlowAlas {
                0%,100% { filter: drop-shadow(0 0 5px #22d3ee) drop-shadow(0 0 10px #22d3ee); r: 5.5; }
                50%     { filter: drop-shadow(0 0 1px #22d3ee); }
              }
              @keyframes titikGlowAtas {
                0%,100% { filter: drop-shadow(0 0 5px #facc15) drop-shadow(0 0 10px #facc15); }
                50%     { filter: drop-shadow(0 0 1px #facc15); }
              }
              .titik-glow-alas { animation: titikGlowAlas 1.6s ease-in-out infinite; }
              .titik-glow-atas { animation: titikGlowAtas 1.6s ease-in-out infinite 0.5s; }
            `}</style>
          </defs>

          <line x1="113.5" y1="5" x2="113.5" y2="160" stroke="#1e293b" strokeWidth="1" />
          <line x1="226.5" y1="5" x2="226.5" y2="160" stroke="#1e293b" strokeWidth="1" />

          {PRISMS.map(p => (
            <TitikStandingPrisma key={p.n} n={p.n} cx={p.cx}
              name={p.name} titikLabel={p.titikLabel} phase={phase} />
          ))}

          <text x="170" y="213" textAnchor="middle" fontSize="8" fill="#facc15" fontFamily="monospace">
            {caption}
          </text>
        </svg>
      </div>

      <div className="rounded-lg px-4 py-2.5 text-xs font-body border flex items-start gap-2"
        style={{ borderColor: `${current.color}50`, backgroundColor: `${current.color}12` }}>
        <span className="font-bold whitespace-nowrap mt-0.5" style={{ color: current.color }}>
          {current.label}
        </span>
        <span className="text-white/60">— {current.desc}</span>
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        {legendItems.map(l => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs font-body">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
            <span style={{ color: l.color }}>{l.label}</span>
          </div>
        ))}
      </div>

      <button onClick={() => setAuto(a => !a)}
        className="w-full text-xs font-body py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all">
        {autoLabel}
      </button>
    </div>
  );
}
