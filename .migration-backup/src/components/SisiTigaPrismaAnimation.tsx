import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const COLORS = {
  alasTutup: "#ef4444",
  tegak:     "#3b82f6",
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
  sisiLabel: string;
  phase: number;
}

const SisiStandingPrisma = ({ n, cx, name, sisiLabel, phase }: PrismaProps) => {
  const topCY = 28, botCY = 148;
  const faceRX = 26, faceRY = 9;
  const startAngle = n === 4 ? -Math.PI / 4 : -Math.PI / 2;

  const top: Point[] = ngon(cx, topCY, faceRX, faceRY, n, startAngle);
  const bot: Point[] = ngon(cx, botCY, faceRX, faceRY, n, startAngle);

  const showAlasTutup = phase === 0 || phase === 2;
  const showTegak     = phase === 1 || phase === 2;

  const opAT  = showAlasTutup ? 0.82 : 0.10;
  const opT   = showTegak     ? 0.68 : 0.10;
  const clsAT = showAlasTutup ? "sisi-glow-at" : "";
  const clsT  = showTegak     ? "sisi-glow-t"  : "";

  const strokeAT = showAlasTutup ? COLORS.alasTutup : "#334155";
  const strokeT  = showTegak     ? COLORS.tegak      : "#334155";
  const swAT = showAlasTutup ? 1.5 : 0.6;
  const swT  = showTegak     ? 1.5 : 0.6;

  const sideFaces = Array.from({ length: n }, (_, i) => {
    const i2 = (i + 1) % n;
    const pts: Point[] = [bot[i], bot[i2], top[i2], top[i]];
    const midX = pts.reduce((s, p) => s + p[0], 0) / 4;
    return { pts, midX };
  }).sort((a, b) => a.midX - b.midX);

  const half = Math.ceil(n / 2);
  const backFaces  = sideFaces.slice(0, half - 1);
  const frontFaces = sideFaces.slice(half - 1);

  return (
    <g>
      {backFaces.map((f, i) => (
        <polygon key={`back-${i}`} points={poly(f.pts)}
          fill={COLORS.tegak} fillOpacity={opT * 0.45}
          stroke={strokeT} strokeWidth={swT * 0.5} />
      ))}
      <polygon points={poly(bot)} fill={COLORS.alasTutup} fillOpacity={opAT}
        stroke={strokeAT} strokeWidth={swAT} className={clsAT} />
      {frontFaces.map((f, i) => (
        <polygon key={`front-${i}`} points={poly(f.pts)}
          fill={COLORS.tegak} fillOpacity={opT}
          stroke={strokeT} strokeWidth={swT} className={clsT} />
      ))}
      <polygon points={poly(top)} fill={COLORS.alasTutup} fillOpacity={opAT}
        stroke={strokeAT} strokeWidth={swAT} className={clsAT} />
      {Array.from({ length: n }, (_, i) => (
        <line key={`v-${i}`}
          x1={bot[i][0].toFixed(1)} y1={bot[i][1].toFixed(1)}
          x2={top[i][0].toFixed(1)} y2={top[i][1].toFixed(1)}
          stroke="#475569" strokeWidth="0.7" />
      ))}
      {[...top, ...bot].map(([x, y], i) => (
        <circle key={`v-${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2" fill="#cbd5e1" opacity="0.6" />
      ))}
      <text x={cx} y={174} textAnchor="middle" fontSize="8.5" fill="#e2e8f0"
        fontFamily="sans-serif" fontWeight="bold">{name}</text>
      <text x={cx} y={186} textAnchor="middle" fontSize="7.5" fill="#94a3b8"
        fontFamily="monospace">{sisiLabel}</text>
    </g>
  );
};

export default function SisiTigaPrismaAnimation() {
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
      key: "alas_tutup",
      label: lang === "en" ? "Base & Lid Faces"  : lang === "ja" ? "底面・上面" : "Sisi Alas & Tutup",
      color: COLORS.alasTutup,
      desc:  lang === "en"
        ? "2 congruent polygons: bottom base and top lid"
        : lang === "ja" ? "合同な多角形2枚：底面（下）と上面（上）"
        : "2 sisi segitiga: alas (bawah) dan tutup (atas)",
    },
    {
      key: "tegak",
      label: lang === "en" ? "Lateral Faces"     : lang === "ja" ? "側面"       : "Sisi Tegak",
      color: COLORS.tegak,
      desc:  lang === "en"
        ? "rectangular faces connecting base and lid"
        : lang === "ja" ? "底面と上面をつなぐ長方形の面"
        : "sisi-sisi persegi panjang yang menghubungkan alas dan tutup",
    },
    {
      key: "all",
      label: lang === "en" ? "All Faces"          : lang === "ja" ? "全面"       : "Semua Sisi",
      color: "#a78bfa",
      desc:  lang === "en"
        ? "total faces = n + 2  (n = number of base sides)"
        : lang === "ja" ? "面の合計 = n + 2（n = 底面の辺の数）"
        : "total sisi = n + 2  (n = jumlah sisi alas)",
    },
  ];

  const PRISMS = [
    {
      n: 3, cx: 57,
      name:      lang === "en" ? "Triangular Prism"    : lang === "ja" ? "三角柱" : "Prisma Segitiga",
      sisiLabel: lang === "en" ? "3+2 = 5 faces"       : lang === "ja" ? "3+2 = 5面" : "3+2 = 5 sisi",
    },
    {
      n: 4, cx: 170,
      name:      lang === "en" ? "Quadrilateral Prism" : lang === "ja" ? "四角柱" : "Prisma Segiempat",
      sisiLabel: lang === "en" ? "4+2 = 6 faces"       : lang === "ja" ? "4+2 = 6面" : "4+2 = 6 sisi",
    },
    {
      n: 5, cx: 283,
      name:      lang === "en" ? "Pentagonal Prism"    : lang === "ja" ? "五角柱" : "Prisma Segilima",
      sisiLabel: lang === "en" ? "5+2 = 7 faces"       : lang === "ja" ? "5+2 = 7面" : "5+2 = 7 sisi",
    },
  ];

  const caption = lang === "en"
    ? "Base and Lid are CONGRUENT  ·  Faces = n + 2"
    : lang === "ja" ? "底面と上面は合同  ·  面 = n + 2"
    : "Alas dan Tutup SAMA bentuknya  ·  Sisi = n + 2";

  const legendItems = [
    { color: COLORS.alasTutup, label: lang === "en" ? "Base & Lid Faces" : lang === "ja" ? "底面・上面" : "Sisi Alas & Tutup" },
    { color: COLORS.tegak,     label: lang === "en" ? "Lateral Faces"    : lang === "ja" ? "側面"       : "Sisi Tegak"        },
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
              @keyframes sisiGlowAT {
                0%,100% { filter: drop-shadow(0 0 6px ${COLORS.alasTutup}) drop-shadow(0 0 12px ${COLORS.alasTutup}); }
                50%     { filter: drop-shadow(0 0 1px ${COLORS.alasTutup}); }
              }
              @keyframes sisiGlowT {
                0%,100% { filter: drop-shadow(0 0 6px ${COLORS.tegak}) drop-shadow(0 0 12px ${COLORS.tegak}); }
                50%     { filter: drop-shadow(0 0 1px ${COLORS.tegak}); }
              }
              .sisi-glow-at { animation: sisiGlowAT 1.8s ease-in-out infinite; }
              .sisi-glow-t  { animation: sisiGlowT  1.8s ease-in-out infinite 0.4s; }
            `}</style>
          </defs>

          <line x1="113.5" y1="5" x2="113.5" y2="160" stroke="#1e293b" strokeWidth="1" />
          <line x1="226.5" y1="5" x2="226.5" y2="160" stroke="#1e293b" strokeWidth="1" />

          {PRISMS.map(p => (
            <SisiStandingPrisma key={p.n} n={p.n} cx={p.cx}
              name={p.name} sisiLabel={p.sisiLabel} phase={phase} />
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
            <div className="w-4 h-4 rounded-sm opacity-80" style={{ backgroundColor: l.color }} />
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
