import React, { useState, useEffect } from "react";

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
      {/* Back side faces (rendered first, behind everything) */}
      {backFaces.map((f, i) => (
        <polygon
          key={`back-${i}`}
          points={poly(f.pts)}
          fill={COLORS.tegak}
          fillOpacity={opT * 0.45}
          stroke={strokeT}
          strokeWidth={swT * 0.5}
        />
      ))}

      {/* Alas (bottom polygon) */}
      <polygon
        points={poly(bot)}
        fill={COLORS.alasTutup}
        fillOpacity={opAT}
        stroke={strokeAT}
        strokeWidth={swAT}
        className={clsAT}
      />

      {/* Front side faces */}
      {frontFaces.map((f, i) => (
        <polygon
          key={`front-${i}`}
          points={poly(f.pts)}
          fill={COLORS.tegak}
          fillOpacity={opT}
          stroke={strokeT}
          strokeWidth={swT}
          className={clsT}
        />
      ))}

      {/* Tutup (top polygon) */}
      <polygon
        points={poly(top)}
        fill={COLORS.alasTutup}
        fillOpacity={opAT}
        stroke={strokeAT}
        strokeWidth={swAT}
        className={clsAT}
      />

      {/* Always-on structural edge outlines */}
      {Array.from({ length: n }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={bot[i][0].toFixed(1)} y1={bot[i][1].toFixed(1)}
          x2={top[i][0].toFixed(1)} y2={top[i][1].toFixed(1)}
          stroke="#475569" strokeWidth="0.7"
        />
      ))}

      {/* Vertex dots */}
      {[...top, ...bot].map(([x, y], i) => (
        <circle key={`v-${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2" fill="#cbd5e1" opacity="0.6" />
      ))}

      {/* Labels */}
      <text x={cx} y={174} textAnchor="middle" fontSize="8.5" fill="#e2e8f0"
        fontFamily="sans-serif" fontWeight="bold">{name}</text>
      <text x={cx} y={186} textAnchor="middle" fontSize="7.5" fill="#94a3b8"
        fontFamily="monospace">{sisiLabel}</text>
    </g>
  );
};

const PHASES = [
  { key: "alas_tutup", label: "Sisi Alas & Tutup", color: COLORS.alasTutup,
    desc: "2 sisi segitiga: alas (bawah) dan tutup (atas)" },
  { key: "tegak",      label: "Sisi Tegak",         color: COLORS.tegak,
    desc: "sisi-sisi persegi panjang yang menghubungkan alas dan tutup" },
  { key: "all",        label: "Semua Sisi",          color: "#a78bfa",
    desc: "total sisi = n + 2  (n = jumlah sisi alas)" },
];

const PRISMS = [
  { n: 3, cx: 57,  name: "Prisma Segitiga",  sisiLabel: "3+2 = 5 sisi" },
  { n: 4, cx: 170, name: "Prisma Segiempat", sisiLabel: "4+2 = 6 sisi" },
  { n: 5, cx: 283, name: "Prisma Segilima",  sisiLabel: "5+2 = 7 sisi" },
];

export default function SisiTigaPrismaAnimation() {
  const [phase, setPhase] = useState(0);
  const [auto,  setAuto]  = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setPhase(p => (p + 1) % 3), 2200);
    return () => clearInterval(id);
  }, [auto]);

  const current = PHASES[phase];

  return (
    <div className="space-y-3">
      {/* Phase buttons */}
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

      {/* SVG with 3 prisms */}
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

          {/* Column dividers */}
          <line x1="113.5" y1="5" x2="113.5" y2="160" stroke="#1e293b" strokeWidth="1" />
          <line x1="226.5" y1="5" x2="226.5" y2="160" stroke="#1e293b" strokeWidth="1" />

          {PRISMS.map(p => (
            <SisiStandingPrisma
              key={p.n}
              n={p.n}
              cx={p.cx}
              name={p.name}
              sisiLabel={p.sisiLabel}
              phase={phase}
            />
          ))}

          {/* Bottom caption */}
          <text x="170" y="213" textAnchor="middle" fontSize="8" fill="#facc15" fontFamily="monospace">
            Alas dan Tutup SAMA bentuknya  ·  Sisi = n + 2
          </text>
        </svg>
      </div>

      {/* Active phase description */}
      <div
        className="rounded-lg px-4 py-2.5 text-xs font-body border flex items-start gap-2"
        style={{ borderColor: `${current.color}50`, backgroundColor: `${current.color}12` }}
      >
        <span className="font-bold whitespace-nowrap mt-0.5" style={{ color: current.color }}>
          {current.label}
        </span>
        <span className="text-white/60">— {current.desc}</span>
      </div>

      {/* Legend row */}
      <div className="flex gap-3 justify-center flex-wrap">
        {[
          { color: COLORS.alasTutup, label: "Sisi Alas & Tutup" },
          { color: COLORS.tegak,     label: "Sisi Tegak" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs font-body">
            <div className="w-4 h-4 rounded-sm opacity-80" style={{ backgroundColor: l.color }} />
            <span style={{ color: l.color }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Auto-play toggle */}
      <button
        onClick={() => setAuto(a => !a)}
        className="w-full text-xs font-body py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
      >
        {auto ? "⏸ Berhenti otomatis" : "▶ Putar otomatis"}
      </button>
    </div>
  );
}
