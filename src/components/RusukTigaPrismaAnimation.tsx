import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const COLORS = {
  alas:  "#22d3ee",
  atas:  "#facc15",
  tegak: "#f97316",
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

const poly = (pts: Point[]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

interface PrismaProps {
  n: number;
  cx: number;
  name: string;
  rusukLabel: string;
  phase: number;
}

const StandingPrisma = ({ n, cx, name, rusukLabel, phase }: PrismaProps) => {
  const topCY = 28;
  const botCY = 148;
  const faceRX = 26, faceRY = 9;

  const startAngle = n === 4 ? -Math.PI / 4 : -Math.PI / 2;
  const top: Point[] = ngon(cx, topCY, faceRX, faceRY, n, startAngle);
  const bot: Point[] = ngon(cx, botCY, faceRX, faceRY, n, startAngle);

  const showAlas  = phase === 0 || phase === 3;
  const showTegak = phase === 1 || phase === 3;
  const showAtas  = phase === 2 || phase === 3;

  const opAlas  = showAlas  ? 1 : 0.18;
  const opTegak = showTegak ? 1 : 0.18;
  const opAtas  = showAtas  ? 1 : 0.18;

  const swAlas  = showAlas  ? 3.2 : 1.5;
  const swTegak = showTegak ? 3.2 : 1.5;
  const swAtas  = showAtas  ? 3.2 : 1.5;

  const clsAlas  = showAlas  ? "rusuk-glow-alas"  : "";
  const clsTegak = showTegak ? "rusuk-glow-tegak" : "";
  const clsAtas  = showAtas  ? "rusuk-glow-atas"  : "";

  return (
    <g>
      {bot.map((b, i) => {
        const b2 = bot[(i + 1) % n];
        const t  = top[i];
        const t2 = top[(i + 1) % n];
        const midX = (b[0] + b2[0] + t[0] + t2[0]) / 4;
        if (midX < cx - 30) return null;
        return (
          <polygon
            key={`face-${i}`}
            points={poly([b, b2, t2, t])}
            fill="rgba(51,65,85,0.45)"
            stroke="rgba(100,116,139,0.3)"
            strokeWidth="0.5"
          />
        );
      })}
      <polygon points={poly(bot)} fill="rgba(15,23,42,0.7)" stroke="rgba(100,116,139,0.25)" strokeWidth="0.6" />
      <polygon points={poly(top)} fill="rgba(30,41,59,0.85)" stroke="rgba(100,116,139,0.25)" strokeWidth="0.6" />

      {bot.map((b, i) => {
        const b2 = bot[(i + 1) % n];
        return (
          <line key={`alas-${i}`}
            x1={b[0].toFixed(1)} y1={b[1].toFixed(1)}
            x2={b2[0].toFixed(1)} y2={b2[1].toFixed(1)}
            stroke={COLORS.alas} strokeWidth={swAlas} strokeOpacity={opAlas}
            strokeLinecap="round" className={clsAlas}
          />
        );
      })}
      {top.map((t, i) => {
        const t2 = top[(i + 1) % n];
        return (
          <line key={`atas-${i}`}
            x1={t[0].toFixed(1)} y1={t[1].toFixed(1)}
            x2={t2[0].toFixed(1)} y2={t2[1].toFixed(1)}
            stroke={COLORS.atas} strokeWidth={swAtas} strokeOpacity={opAtas}
            strokeLinecap="round" className={clsAtas}
          />
        );
      })}
      {bot.map((b, i) => {
        const t = top[i];
        return (
          <line key={`tegak-${i}`}
            x1={b[0].toFixed(1)} y1={b[1].toFixed(1)}
            x2={t[0].toFixed(1)} y2={t[1].toFixed(1)}
            stroke={COLORS.tegak} strokeWidth={swTegak} strokeOpacity={opTegak}
            strokeLinecap="round" className={clsTegak}
          />
        );
      })}
      {[...top, ...bot].map(([x, y], i) => (
        <circle key={`v-${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.2" fill="#cbd5e1" opacity="0.7" />
      ))}

      <text x={cx} y={174} textAnchor="middle" fontSize="8.5" fill="#e2e8f0"
        fontFamily="sans-serif" fontWeight="bold">{name}</text>
      <text x={cx} y={186} textAnchor="middle" fontSize="7.5" fill="#94a3b8"
        fontFamily="monospace">{rusukLabel}</text>
    </g>
  );
};

export default function RusukTigaPrismaAnimation() {
  const { language: lang } = useLanguage();
  const [phase, setPhase] = useState(0);
  const [auto,  setAuto]  = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setPhase(p => (p + 1) % 4), 2000);
    return () => clearInterval(id);
  }, [auto]);

  const PHASES = [
    {
      key: "alas",
      label: lang === "en" ? "Bottom Edges" : lang === "ja" ? "底辺" : "Rusuk Alas (bawah)",
      color: COLORS.alas,
      desc:  lang === "en"
        ? "edges that form the bottom base polygon"
        : lang === "ja" ? "底面を構成する辺"
        : "rusuk-rusuk yang membentuk sisi alas (bawah)",
    },
    {
      key: "tegak",
      label: lang === "en" ? "Lateral Edges" : lang === "ja" ? "側辺" : "Rusuk Tegak",
      color: COLORS.tegak,
      desc:  lang === "en"
        ? "edges connecting bottom base to top base"
        : lang === "ja" ? "底面と上面を結ぶ辺"
        : "rusuk yang menghubungkan alas bawah ke alas atas",
    },
    {
      key: "atas",
      label: lang === "en" ? "Top Edges" : lang === "ja" ? "上辺" : "Rusuk Atas (tutup)",
      color: COLORS.atas,
      desc:  lang === "en"
        ? "identical shape to the bottom — a defining feature of prisms!"
        : lang === "ja" ? "底面と同じ形 — これが角柱の特徴！"
        : "sama persis bentuknya dengan alas — itulah ciri khas prisma!",
    },
    {
      key: "all",
      label: lang === "en" ? "All Edges" : lang === "ja" ? "全辺" : "Semua Rusuk",
      color: "#a78bfa",
      desc:  lang === "en"
        ? "total edges = 3 × n  (n = number of base sides)"
        : lang === "ja" ? "辺の合計 = 3 × n（n = 底面の辺の数）"
        : "total rusuk = 3 × n  (n = jumlah sisi alas)",
    },
  ];

  const PRISMS = [
    {
      n: 3, cx: 57,
      name:       lang === "en" ? "Triangular Prism"     : lang === "ja" ? "三角柱" : "Prisma Segitiga",
      rusukLabel: lang === "en" ? "3×3 = 9 edges"        : lang === "ja" ? "3×3 = 9辺" : "3×3 = 9 rusuk",
    },
    {
      n: 4, cx: 170,
      name:       lang === "en" ? "Quadrilateral Prism"  : lang === "ja" ? "四角柱" : "Prisma Segiempat",
      rusukLabel: lang === "en" ? "3×4 = 12 edges"       : lang === "ja" ? "3×4 = 12辺" : "3×4 = 12 rusuk",
    },
    {
      n: 5, cx: 283,
      name:       lang === "en" ? "Pentagonal Prism"     : lang === "ja" ? "五角柱" : "Prisma Segilima",
      rusukLabel: lang === "en" ? "3×5 = 15 edges"       : lang === "ja" ? "3×5 = 15辺" : "3×5 = 15 rusuk",
    },
  ];

  const caption = lang === "en"
    ? "Top and Bottom are always the SAME shape  ·  Edges = 3n"
    : lang === "ja" ? "上面と底面は常に同じ形  ·  辺 = 3n"
    : "Alas dan Tutup selalu SAMA bentuknya  ·  Rusuk = 3n";

  const legendItems = [
    { color: COLORS.alas,  label: lang === "en" ? "Bottom Edges"  : lang === "ja" ? "底辺"   : "Rusuk Alas"  },
    { color: COLORS.tegak, label: lang === "en" ? "Lateral Edges" : lang === "ja" ? "側辺"   : "Rusuk Tegak" },
    { color: COLORS.atas,  label: lang === "en" ? "Top Edges"     : lang === "ja" ? "上辺"   : "Rusuk Atas"  },
  ];

  const autoLabel = auto
    ? (lang === "en" ? "⏸ Pause auto-play" : lang === "ja" ? "⏸ 自動停止" : "⏸ Berhenti otomatis")
    : (lang === "en" ? "▶ Resume auto-play" : lang === "ja" ? "▶ 自動再生" : "▶ Putar otomatis");

  const current = PHASES[phase];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {PHASES.map((p, i) => (
          <button
            key={p.key}
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
              @keyframes glowAlas {
                0%,100% { filter: drop-shadow(0 0 5px #22d3ee) drop-shadow(0 0 10px #22d3ee); }
                50%     { filter: drop-shadow(0 0 1px #22d3ee); }
              }
              @keyframes glowTegak {
                0%,100% { filter: drop-shadow(0 0 5px #f97316) drop-shadow(0 0 10px #f97316); }
                50%     { filter: drop-shadow(0 0 1px #f97316); }
              }
              @keyframes glowAtas {
                0%,100% { filter: drop-shadow(0 0 5px #facc15) drop-shadow(0 0 10px #facc15); }
                50%     { filter: drop-shadow(0 0 1px #facc15); }
              }
              .rusuk-glow-alas  { animation: glowAlas  1.6s ease-in-out infinite; }
              .rusuk-glow-tegak { animation: glowTegak 1.6s ease-in-out infinite 0.3s; }
              .rusuk-glow-atas  { animation: glowAtas  1.6s ease-in-out infinite 0.6s; }
            `}</style>
          </defs>

          <line x1="113.5" y1="5" x2="113.5" y2="155" stroke="#1e293b" strokeWidth="1" />
          <line x1="226.5" y1="5" x2="226.5" y2="155" stroke="#1e293b" strokeWidth="1" />

          {PRISMS.map(p => (
            <StandingPrisma
              key={p.n}
              n={p.n}
              cx={p.cx}
              name={p.name}
              rusukLabel={p.rusukLabel}
              phase={phase}
            />
          ))}

          <rect x="0" y="204" width="340" height="14" fill="transparent" />
          <text x="170" y="213" textAnchor="middle" fontSize="8" fill="#facc15" fontFamily="monospace">
            {caption}
          </text>
        </svg>
      </div>

      <div
        className="rounded-lg px-4 py-2.5 text-xs font-body border flex items-start gap-2"
        style={{ borderColor: `${current.color}50`, backgroundColor: `${current.color}12` }}
      >
        <span className="font-bold whitespace-nowrap mt-0.5" style={{ color: current.color }}>
          {current.label}
        </span>
        <span className="text-white/60">— {current.desc}</span>
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        {legendItems.map(l => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs font-body">
            <div className="w-5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
            <span style={{ color: l.color }}>{l.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setAuto(a => !a)}
        className="w-full text-xs font-body py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
      >
        {autoLabel}
      </button>
    </div>
  );
}
