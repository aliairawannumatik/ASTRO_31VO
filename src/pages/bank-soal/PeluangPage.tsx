import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Dices, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MathText = ({ text, className = "" }: { text: string; className?: string }) => {
  const elements = useMemo(() => {
    const result: React.ReactNode[] = [];
    let key = 0;
    const blockParts = text.split(/(\$\$[^$]+\$\$)/g);
    blockParts.forEach((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2).trim();
        result.push(<span key={key++} className="mx-1 block text-center my-2"><BlockMath math={math} /></span>);
      } else if (part) {
        const inlineParts = part.split(/(\$[^$]+\$)/g);
        inlineParts.forEach((ip) => {
          if (ip.startsWith("$") && ip.endsWith("$")) {
            result.push(<span key={key++} className="mx-0.5"><InlineMath math={ip.slice(1, -1)} /></span>);
          } else if (ip) {
            result.push(<span key={key++}>{ip}</span>);
          }
        });
      }
    });
    return result;
  }, [text]);
  return <span className={className}>{elements}</span>;
};

type Difficulty = "Mudah" | "Sedang" | "Sulit";
type QuestionType = "PG" | "MCMA" | "Benar/Salah";
interface Statement { text: string; isCorrect: boolean; }
interface Question {
  id: number;
  type: QuestionType;
  difficulty: Difficulty;
  category: string;
  question: string;
  options?: string[];
  statements?: Statement[];
  correctAnswer?: string;
  svgKey?: string;
  explanation: { concept: string; steps: string[]; formula?: string; };
}

/* ── SVG Visual Components ── */

const DaduHighlightSVG = ({ highlight, label }: { highlight: number[]; label: string }) => {
  const positions: Record<number, { cx: number; cy: number }[]> = {
    1: [{ cx: 30, cy: 30 }],
    2: [{ cx: 15, cy: 15 }, { cx: 45, cy: 45 }],
    3: [{ cx: 15, cy: 15 }, { cx: 30, cy: 30 }, { cx: 45, cy: 45 }],
    4: [{ cx: 15, cy: 15 }, { cx: 45, cy: 15 }, { cx: 15, cy: 45 }, { cx: 45, cy: 45 }],
    5: [{ cx: 15, cy: 15 }, { cx: 45, cy: 15 }, { cx: 30, cy: 30 }, { cx: 15, cy: 45 }, { cx: 45, cy: 45 }],
    6: [{ cx: 15, cy: 12 }, { cx: 45, cy: 12 }, { cx: 15, cy: 30 }, { cx: 45, cy: 30 }, { cx: 15, cy: 48 }, { cx: 45, cy: 48 }],
  };
  const faces = [1, 2, 3, 4, 5, 6];
  const cols = 3;
  return (
    <svg viewBox="0 0 280 130" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Kejadian: {label}</text>
      {faces.map((face, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const ox = 15 + col * 90;
        const oy = 20 + row * 65;
        const isHighlighted = highlight.includes(face);
        return (
          <g key={face} transform={`translate(${ox},${oy})`}>
            <rect x="0" y="0" width="60" height="60" rx="8"
              fill={isHighlighted ? "rgba(34,211,238,0.2)" : "rgba(30,41,59,0.8)"}
              stroke={isHighlighted ? "#22d3ee" : "#475569"} strokeWidth={isHighlighted ? 2 : 1} />
            {positions[face].map((dot, di) => (
              <circle key={di} cx={dot.cx} cy={dot.cy} r="5"
                fill={isHighlighted ? "#22d3ee" : "#64748b"} />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

const DuaDaduGridSVG = ({ highlightFn, label, count }: {
  highlightFn: (a: number, b: number) => boolean;
  label: string;
  count: number;
}) => {
  const cellSize = 32;
  const offset = 28;
  return (
    <svg viewBox="0 0 260 240" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <text x="130" y="14" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Ruang Sampel Dua Dadu (n=36)</text>
      <text x="8" y="125" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,8,125)">Dadu 1</text>
      <text x="130" y="238" fill="#f472b6" fontSize="8" textAnchor="middle" fontFamily="monospace">Dadu 2</text>
      {[1,2,3,4,5,6].map(d1 => (
        <text key={d1} x="18" y={offset + (d1-1)*cellSize + 22} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{d1}</text>
      ))}
      {[1,2,3,4,5,6].map(d2 => (
        <text key={d2} x={offset + (d2-1)*cellSize + 22} y={offset - 6} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{d2}</text>
      ))}
      {[1,2,3,4,5,6].map(d1 => [1,2,3,4,5,6].map(d2 => {
        const x = offset + (d2-1)*cellSize;
        const y = offset + (d1-1)*cellSize;
        const hi = highlightFn(d1, d2);
        return (
          <g key={`${d1}-${d2}`}>
            <rect x={x+2} y={y+2} width={cellSize-4} height={cellSize-4} rx="3"
              fill={hi ? "rgba(34,211,238,0.25)" : "rgba(30,41,59,0.4)"}
              stroke={hi ? "#22d3ee" : "#334155"} strokeWidth={hi ? 1.5 : 0.5} />
            <text x={x+cellSize/2} y={y+cellSize/2+4} fill={hi ? "#22d3ee" : "#475569"}
              fontSize="8" textAnchor="middle" fontFamily="monospace">{d1+d2}</text>
          </g>
        );
      }))}
      <text x="130" y="228" fill="#fbbf24" fontSize="8.5" textAnchor="middle" fontFamily="monospace">{label}: {count}/36</text>
    </svg>
  );
};

const KoinSVG = ({ count }: { count: 1 | 2 | 3 }) => {
  if (count === 1) return (
    <svg viewBox="0 0 280 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <circle cx="80" cy="50" r="38" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="2"/>
      <text x="80" y="44" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">A</text>
      <text x="80" y="60" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Angka</text>
      <circle cx="200" cy="50" r="38" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="2"/>
      <text x="200" y="44" fill="#a855f7" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">G</text>
      <text x="200" y="60" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Gambar</text>
      <text x="140" y="92" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">n(S) = 2 → S = {"{A, G}"}</text>
    </svg>
  );
  if (count === 2) return (
    <svg viewBox="0 0 280 150" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <text x="140" y="14" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Ruang Sampel 2 Koin</text>
      {[["A","A","#22d3ee"],["A","G","#fbbf24"],["G","A","#fbbf24"],["G","G","#f472b6"]].map(([k1,k2,col],i) => {
        const x = 20 + (i % 2)*130, y = 25 + Math.floor(i/2)*55;
        return (
          <g key={i}>
            <rect x={x} y={y} width="110" height="45" rx="6" fill={`rgba(${col==="#22d3ee"?"34,211,238":col==="#fbbf24"?"251,191,36":"244,114,182"},0.12)`} stroke={col as string} strokeWidth="1.5"/>
            <text x={x+20} y={y+28} fill={col as string} fontSize="16" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{k1}</text>
            <text x={x+55} y={y+28} fill={col as string} fontSize="16" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{k2}</text>
            <text x={x+85} y={y+28} fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">({k1}{k2})</text>
          </g>
        );
      })}
      <text x="140" y="144" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">n(S) = 4</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 280 180" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <text x="140" y="14" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Ruang Sampel 3 Koin (n=8)</text>
      {[["A","A","A","#22d3ee"],["A","A","G","#fbbf24"],["A","G","A","#fbbf24"],["A","G","G","#f472b6"],
        ["G","A","A","#fbbf24"],["G","A","G","#f472b6"],["G","G","A","#f472b6"],["G","G","G","#ef4444"]].map(([k1,k2,k3,col],i) => {
        const x = 10 + (i%4)*65, y = 22 + Math.floor(i/4)*70;
        return (
          <g key={i}>
            <rect x={x} y={y} width="58" height="55" rx="5" fill={`rgba(${col==="#22d3ee"?"34,211,238":col==="#fbbf24"?"251,191,36":col==="#f472b6"?"244,114,182":"239,68,68"},0.12)`} stroke={col as string} strokeWidth="1.5"/>
            <text x={x+29} y={y+24} fill={col as string} fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{k1}{k2}{k3}</text>
            <text x={x+29} y={y+43} fill="#64748b" fontSize="7.5" textAnchor="middle" fontFamily="monospace">{[k1,k2,k3].filter(k=>k==="A").length}A {[k1,k2,k3].filter(k=>k==="G").length}G</text>
          </g>
        );
      })}
    </svg>
  );
};

const MarbleBagSVG = ({ colors, counts, labels }: { colors: string[]; counts: number[]; labels: string[] }) => {
  const total = counts.reduce((a, b) => a + b, 0);
  let xOffset = 15;
  return (
    <svg viewBox="0 0 280 120" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <ellipse cx="140" cy="85" rx="90" ry="28" fill="rgba(30,41,59,0.8)" stroke="#475569" strokeWidth="1.5"/>
      <path d="M 50 85 Q 50 30 140 30 Q 230 30 230 85" fill="rgba(30,41,59,0.6)" stroke="#475569" strokeWidth="1.5"/>
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Total = {total} bola</text>
      {colors.map((color, ci) => {
        const marbles = [];
        for (let j = 0; j < Math.min(counts[ci], 6); j++) {
          const cx2 = xOffset + j * 22 + 14;
          marbles.push(<circle key={j} cx={cx2} cy={82} r="10" fill={color} stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>);
          if (counts[ci] > 6 && j === 5) marbles.push(
            <text key="more" x={cx2} y={86} fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">+{counts[ci]-5}</text>
          );
        }
        const lx = xOffset + Math.min(counts[ci], 6) * 11 + 2;
        const labelEl = <text key="lbl" x={xOffset + Math.min(counts[ci],6)*11} y={108} fill={color} fontSize="8" textAnchor="middle" fontFamily="monospace">{labels[ci]}: {counts[ci]}</text>;
        xOffset += Math.min(counts[ci], 6) * 22 + 15;
        return [...marbles, labelEl];
      })}
    </svg>
  );
};

const VennTwoSVG = ({ aLabel, bLabel, aOnly, both, bOnly, total }: {
  aLabel: string; bLabel: string; aOnly: number; both: number; bOnly: number; total: number;
}) => (
  <svg viewBox="0 0 280 140" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
    <text x="140" y="14" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Diagram Venn (n={total})</text>
    <ellipse cx="105" cy="75" rx="70" ry="50" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="2"/>
    <ellipse cx="175" cy="75" rx="70" ry="50" fill="rgba(244,114,182,0.15)" stroke="#f472b6" strokeWidth="2"/>
    <path d="M 140 29 Q 175 25 175 75 Q 175 125 140 121 Q 105 125 105 75 Q 105 25 140 29 Z" fill="rgba(168,85,247,0.2)"/>
    <text x="75" y="72" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{aLabel}</text>
    <text x="75" y="84" fill="#22d3ee" fontSize="12" textAnchor="middle" fontFamily="monospace">{aOnly}</text>
    <text x="140" y="72" fill="#c084fc" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">∩</text>
    <text x="140" y="84" fill="#c084fc" fontSize="12" textAnchor="middle" fontFamily="monospace">{both}</text>
    <text x="205" y="72" fill="#f472b6" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{bLabel}</text>
    <text x="205" y="84" fill="#f472b6" fontSize="12" textAnchor="middle" fontFamily="monospace">{bOnly}</text>
    <text x="140" y="128" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">Di luar: {total - aOnly - both - bOnly}</text>
  </svg>
);

const SpinnerSVG = ({ sections }: { sections: { color: string; label: string; deg: number }[] }) => {
  let currentAngle = -90;
  const cx = 80, cy = 75, r = 55;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arcs = sections.map((s) => {
    const startAngle = currentAngle;
    currentAngle += s.deg;
    const endAngle = currentAngle;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const midAngle = startAngle + s.deg / 2;
    const lx = cx + (r * 0.65) * Math.cos(toRad(midAngle));
    const ly = cy + (r * 0.65) * Math.sin(toRad(midAngle));
    const largeArc = s.deg > 180 ? 1 : 0;
    return { ...s, x1, y1, x2, y2, lx, ly, largeArc };
  });
  return (
    <svg viewBox="0 0 280 150" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Spinner / Roda Putar</text>
      {arcs.map((a, i) => (
        <g key={i}>
          <path d={`M ${cx} ${cy} L ${a.x1} ${a.y1} A ${r} ${r} 0 ${a.largeArc} 1 ${a.x2} ${a.y2} Z`}
            fill={a.color} stroke="#1e293b" strokeWidth="1.5" opacity="0.85"/>
          <text x={a.lx} y={a.ly+4} fill="#fff" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{a.label}</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5"/>
      <line x1={cx} y1={cy-55} x2={cx} y2={cy-62} stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow)"/>
      <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <polygon points="0 0, 6 3, 0 6" fill="#fbbf24"/>
      </marker></defs>
      <text x="175" y="35" fill="#94a3b8" fontSize="8" fontFamily="monospace">Keterangan:</text>
      {sections.map((s, i) => (
        <g key={i}>
          <rect x="175" y={45 + i * 18} width="12" height="12" rx="2" fill={s.color}/>
          <text x="192" y={55 + i * 18} fill="#cbd5e1" fontSize="8" fontFamily="monospace">{s.label} ({s.deg}°)</text>
        </g>
      ))}
    </svg>
  );
};

const KartuBridgeSVG = () => (
  <svg viewBox="0 0 280 130" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
    <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">52 Kartu Bridge</text>
    {[
      { suit: "♠ Sekop", color: "#94a3b8", count: 13, x: 15 },
      { suit: "♥ Hati", color: "#ef4444", count: 13, x: 82 },
      { suit: "♦ Wajik", color: "#ef4444", count: 13, x: 149 },
      { suit: "♣ Keriting", color: "#94a3b8", count: 13, x: 216 },
    ].map((s) => (
      <g key={s.suit}>
        <rect x={s.x} y="22" width="58" height="95" rx="6" fill="rgba(30,41,59,0.8)" stroke="#475569" strokeWidth="1.5"/>
        <text x={s.x + 29} y="42" fill={s.color} fontSize="16" textAnchor="middle" fontFamily="serif">{s.suit[0]}</text>
        <text x={s.x + 29} y="58" fill={s.color} fontSize="7.5" textAnchor="middle" fontFamily="monospace">{s.suit.slice(2)}</text>
        <rect x={s.x + 8} y="65" width="42" height="20" rx="3" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1"/>
        <text x={s.x + 29} y="79" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{s.count}</text>
        <text x={s.x + 29} y="106" fill="#64748b" fontSize="6.5" textAnchor="middle" fontFamily="monospace">A,2-10,J,Q,K</text>
      </g>
    ))}
    <text x="140" y="128" fill="#475569" fontSize="8" textAnchor="middle" fontFamily="monospace">Merah: 26 | Hitam: 26 | As: 4 | Gambar(J,Q,K): 12</text>
  </svg>
);

const FrekHarapanSVG = ({ n, p, frek, label }: { n: number; p: string; frek: number; label: string }) => (
  <svg viewBox="0 0 280 110" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
    <rect x="10" y="10" width="260" height="90" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155"/>
    <rect x="25" y="28" width="100" height="32" rx="4" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="75" y="41" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">n (percobaan)</text>
    <text x="75" y="55" fill="#fff" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{n}</text>
    <text x="140" y="46" fill="#64748b" fontSize="14" textAnchor="middle" fontFamily="monospace">×</text>
    <rect x="150" y="28" width="60" height="32" rx="4" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="180" y="41" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace">P(A)</text>
    <text x="180" y="55" fill="#fff" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{p}</text>
    <text x="222" y="46" fill="#64748b" fontSize="14" textAnchor="middle" fontFamily="monospace">=</text>
    <rect x="232" y="28" width="42" height="32" rx="4" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="253" y="55" fill="#22c55e" fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{frek}</text>
    <text x="140" y="90" fill="#fbbf24" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Frekuensi Harapan {label}: {frek} kali</text>
  </svg>
);

const RuangSampelDaduKoinSVG = () => (
  <svg viewBox="0 0 280 150" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
    <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Ruang Sampel Dadu + Koin (n=12)</text>
    {[1,2,3,4,5,6].map((d, di) => ["A","G"].map((k, ki) => {
      const x = 20 + di * 40, y = 25 + ki * 55;
      const isEvenGenap = d % 2 === 0 && k === "G";
      return (
        <g key={`${d}${k}`}>
          <rect x={x} y={y} width="35" height="45" rx="5"
            fill={isEvenGenap ? "rgba(34,211,238,0.2)" : "rgba(30,41,59,0.6)"}
            stroke={isEvenGenap ? "#22d3ee" : "#475569"} strokeWidth={isEvenGenap ? 1.5 : 0.8}/>
          <text x={x+17} y={y+20} fill={isEvenGenap ? "#22d3ee" : "#94a3b8"} fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{d}</text>
          <text x={x+17} y={y+35} fill={isEvenGenap ? "#22d3ee" : "#64748b"} fontSize="10" textAnchor="middle" fontFamily="monospace">{k}</text>
        </g>
      );
    }))}
    <text x="140" y="144" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">Biru = Genap & Gambar (3 kejadian)</text>
  </svg>
);

/* ── Visual Map ── */
const visualMap: Record<string, React.ReactNode> = {
  "koin-1": <KoinSVG count={1} />,
  "koin-2": <KoinSVG count={2} />,
  "koin-3": <KoinSVG count={3} />,
  "dadu-prima": <DaduHighlightSVG highlight={[2,3,5]} label="Bilangan Prima" />,
  "dadu-genap": <DaduHighlightSVG highlight={[2,4,6]} label="Bilangan Genap" />,
  "dadu-faktor6": <DaduHighlightSVG highlight={[1,2,3,6]} label="Faktor dari 6" />,
  "dadu-besar4": <DaduHighlightSVG highlight={[5,6]} label="Lebih dari 4" />,
  "dadu-kecil4": <DaduHighlightSVG highlight={[1,2,3]} label="Kurang dari 4" />,
  "dadu-kelipatan3": <DaduHighlightSVG highlight={[3,6]} label="Kelipatan 3" />,
  "dadu-ganjil-besar3": <DaduHighlightSVG highlight={[5]} label="Ganjil & > 3" />,
  "dadu-besar3": <DaduHighlightSVG highlight={[4,5,6]} label="Lebih dari 3" />,
  "dua-dadu-7": <DuaDaduGridSVG highlightFn={(a,b) => a+b===7} label="Jumlah = 7" count={6} />,
  "dua-dadu-10": <DuaDaduGridSVG highlightFn={(a,b) => a+b===10} label="Jumlah = 10" count={3} />,
  "dua-dadu-2": <DuaDaduGridSVG highlightFn={(a,b) => a+b===2} label="Jumlah = 2" count={1} />,
  "dua-dadu-gt9": <DuaDaduGridSVG highlightFn={(a,b) => a+b>9} label="Jumlah > 9" count={6} />,
  "dua-dadu-8": <DuaDaduGridSVG highlightFn={(a,b) => a+b===8} label="Jumlah = 8" count={5} />,
  "dua-dadu-prima": <DuaDaduGridSVG highlightFn={(a,b) => [2,3,5,7,11].includes(a+b)} label="Jumlah Prima" count={15} />,
  "dua-dadu-genap": <DuaDaduGridSVG highlightFn={(a,b) => (a+b)%2===0} label="Jumlah Genap" count={18} />,
  "dua-dadu-lt5": <DuaDaduGridSVG highlightFn={(a,b) => a+b<5} label="Jumlah < 5" count={6} />,
  "dua-dadu-selisih2": <DuaDaduGridSVG highlightFn={(a,b) => Math.abs(a-b)===2} label="|Selisih| = 2" count={8} />,
  "dua-dadu-d1gtd2": <DuaDaduGridSVG highlightFn={(a,b) => a>b} label="Dadu1 > Dadu2" count={15} />,
  "dua-dadu-d1ged2": <DuaDaduGridSVG highlightFn={(a,b) => a>=b} label="Dadu1 ≥ Dadu2" count={21} />,
  "marble-3r2b": <MarbleBagSVG colors={["#ef4444","#3b82f6"]} counts={[3,2]} labels={["Merah","Biru"]} />,
  "marble-4r6p": <MarbleBagSVG colors={["#ef4444","#f1f5f9"]} counts={[4,6]} labels={["Merah","Putih"]} />,
  "marble-5r3p2h": <MarbleBagSVG colors={["#ef4444","#f1f5f9","#22c55e"]} counts={[5,3,2]} labels={["Merah","Putih","Hijau"]} />,
  "marble-5r3k": <MarbleBagSVG colors={["#ef4444","#fbbf24"]} counts={[5,3]} labels={["Merah","Kuning"]} />,
  "marble-3r4b5h": <MarbleBagSVG colors={["#ef4444","#3b82f6","#22c55e"]} counts={[3,4,5]} labels={["Merah","Biru","Hijau"]} />,
  "venn-ab": <VennTwoSVG aLabel="A" bLabel="B" aOnly={30} both={20} bOnly={30} total={100} />,
  "venn-siswa": <VennTwoSVG aLabel="Mat" bLabel="IPA" aOnly={15} both={10} bOnly={10} total={40} />,
  "spinner-4": <SpinnerSVG sections={[
    {color:"#ef4444",label:"Merah",deg:90},{color:"#3b82f6",label:"Biru",deg:90},
    {color:"#22c55e",label:"Hijau",deg:90},{color:"#fbbf24",label:"Kuning",deg:90}
  ]} />,
  "spinner-3": <SpinnerSVG sections={[
    {color:"#ef4444",label:"Merah",deg:120},{color:"#3b82f6",label:"Biru",deg:90},
    {color:"#22c55e",label:"Hijau",deg:150}
  ]} />,
  "spinner-unequal": <SpinnerSVG sections={[
    {color:"#ef4444",label:"M",deg:120},{color:"#3b82f6",label:"B",deg:90},
    {color:"#22c55e",label:"H",deg:90},{color:"#fbbf24",label:"K",deg:60}
  ]} />,
  "kartu-bridge": <KartuBridgeSVG />,
  "frek-60-1o3": <FrekHarapanSVG n={60} p="1/3" frek={20} label="kejadian" />,
  "frek-120-1o6": <FrekHarapanSVG n={120} p="1/6" frek={20} label="angka 6" />,
  "frek-200-2o5": <FrekHarapanSVG n={200} p="2/5" frek={80} label="kejadian" />,
  "frek-300-1o2": <FrekHarapanSVG n={300} p="1/2" frek={150} label="angka A" />,
  "frek-180-1o2": <FrekHarapanSVG n={180} p="1/2" frek={90} label="prima" />,
  "frek-500-1o5": <FrekHarapanSVG n={500} p="1/5" frek={100} label="kejadian" />,
  "dadu-koin": <RuangSampelDaduKoinSVG />,
};

/* ── Question Data ── */
const questionsData: Question[] = [
  /* ══════ A. PILIHAN GANDA — Percobaan, Ruang Sampel & Titik Sampel ══════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Ruang sampel dari pelemparan 2 keping uang logam adalah ....",
    svgKey: "koin-2",
    options: [
      "A. S = {(A, G)}",
      "B. S = {(A, G), (A, A), (G, G)}",
      "C. S = {(A, G), (G, A), (A, A), (G, G)}",
      "D. S = {(A, G), (G, A)}"
    ],
    correctAnswer: "C. S = {(A, G), (G, A), (A, A), (G, G)}",
    explanation: {
      concept: "Ruang sampel adalah himpunan semua hasil yang mungkin dari suatu percobaan.",
      steps: [
        "Koin pertama: bisa muncul A atau G",
        "Koin kedua: bisa muncul A atau G",
        "Semua kombinasi: (A,A), (A,G), (G,A), (G,G)",
        "n(S) = 4"
      ],
      formula: "n(S) = 2^n \\text{ untuk } n \\text{ koin}"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada pelemparan dua buah dadu, kejadian mata dadu berjumlah 6 adalah ....",
    svgKey: "dua-dadu-7",
    options: [
      "A. {(0, 6), (1, 5), (2, 4)}",
      "B. {(1, 5), (5, 1), (2, 4), (4, 2), (3, 3), (6, 0)}",
      "C. {(1, 5), (2, 4), (3, 3)}",
      "D. {(1, 5), (5, 1), (2, 4), (4, 2), (3, 3)}"
    ],
    correctAnswer: "D. {(1, 5), (5, 1), (2, 4), (4, 2), (3, 3)}",
    explanation: {
      concept: "Pasangan dadu yang berjumlah 6: (1,5), (5,1), (2,4), (4,2), (3,3).",
      steps: [
        "1 + 5 = 6 ✓ → (1,5) dan (5,1)",
        "2 + 4 = 6 ✓ → (2,4) dan (4,2)",
        "3 + 3 = 6 ✓ → (3,3)",
        "Tidak ada (0,6) atau (6,0) karena dadu bermata 1–6"
      ],
      formula: ""
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah kotak terdiri dari kartu bernomor 1, 2, 3 serta kartu berhuruf abjad A, B, C, D. Banyaknya titik sampel dari pengambilan sebuah kartu dari kotak tersebut adalah ....",
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    correctAnswer: "C. 7",
    explanation: {
      concept: "Titik sampel = jumlah semua kartu yang mungkin terambil.",
      steps: [
        "Kartu bernomor: 1, 2, 3 → 3 kartu",
        "Kartu berhuruf: A, B, C, D → 4 kartu",
        "Total titik sampel = 3 + 4 = 7"
      ],
      formula: "n(S) = n(\\text{nomor}) + n(\\text{huruf})"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada percobaan melempar undi dua buah koin logam dan sebuah dadu sekaligus. Banyaknya titik sampel adalah ....",
    svgKey: "koin-2",
    options: ["A. 6", "B. 12", "C. 20", "D. 24"],
    correctAnswer: "D. 24",
    explanation: {
      concept: "Titik sampel = banyak hasil koin × banyak hasil dadu.",
      steps: [
        "2 koin: 2² = 4 kemungkinan",
        "1 dadu: 6 kemungkinan",
        "Total = 4 × 6 = 24"
      ],
      formula: "n(S) = 4 \\times 6 = 24"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Andi memiliki 3 baju, 4 celana, dan 2 pasang sepatu. Banyaknya cara Andi dapat memadukan baju, celana, dan sepatunya adalah ....",
    options: ["A. 9", "B. 18", "C. 24", "D. 36"],
    correctAnswer: "C. 24",
    explanation: {
      concept: "Aturan perkalian: jumlah cara = n₁ × n₂ × n₃.",
      steps: [
        "Pilihan baju: 3",
        "Pilihan celana: 4",
        "Pilihan sepatu: 2",
        "Total kombinasi = 3 × 4 × 2 = 24"
      ],
      formula: "n = 3 \\times 4 \\times 2 = 24"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada pelemparan 2 buah dadu, banyaknya titik sampel pada percobaan tersebut adalah ....",
    svgKey: "dua-dadu-7",
    options: ["A. 12", "B. 18", "C. 24", "D. 36"],
    correctAnswer: "D. 36",
    explanation: {
      concept: "Dua dadu masing-masing bermata 6.",
      steps: [
        "Dadu pertama: 6 kemungkinan",
        "Dadu kedua: 6 kemungkinan",
        "n(S) = 6 × 6 = 36"
      ],
      formula: "n(S) = 6^2 = 36"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Tiga buah mata uang logam dilempar secara bersamaan. Banyaknya kejadian muncul tepat dua angka (A) adalah ....",
    svgKey: "koin-3",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Tepat 2 angka (A) dari 3 koin: hitung kombinasi C(3,2).",
      steps: [
        "S = {AAA, AAG, AGA, AGG, GAA, GAG, GGA, GGG}",
        "Tepat 2A: {AAG, AGA, GAA}",
        "Banyaknya = 3"
      ],
      formula: "C(3,2) = 3"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Dari pelemparan dua buah koin dan sebuah dadu, banyaknya titik sampel adalah ....",
    svgKey: "koin-2",
    options: ["A. 12", "B. 18", "C. 24", "D. 36"],
    correctAnswer: "C. 24",
    explanation: {
      concept: "Titik sampel = hasil 2 koin × hasil 1 dadu.",
      steps: [
        "2 koin: 2² = 4 kemungkinan",
        "1 dadu: 6 kemungkinan",
        "n(S) = 4 × 6 = 24"
      ],
      formula: "n(S) = 4 \\times 6 = 24"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah dadu biru dan sebuah dadu hitam dilempar bersama-sama. Banyaknya kejadian muncul jumlah mata dadu 4 atau 10 adalah ....",
    svgKey: "dua-dadu-10",
    options: ["A. 4", "B. 5", "C. 6", "D. 8"],
    correctAnswer: "C. 6",
    explanation: {
      concept: "Hitung pasangan yang berjumlah 4 dan yang berjumlah 10, lalu gabungkan.",
      steps: [
        "Jumlah 4: (1,3),(3,1),(2,2) → 3 pasangan",
        "Jumlah 10: (4,6),(6,4),(5,5) → 3 pasangan",
        "Total = 3 + 3 = 6"
      ],
      formula: ""
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Jika sebuah dadu dilempar, maka banyaknya kejadian muncul mata dadu bukan 2 adalah ....",
    svgKey: "dadu-prima",
    options: ["A. 1", "B. 2", "C. 5", "D. 6"],
    correctAnswer: "C. 5",
    explanation: {
      concept: "Komplemen kejadian 'muncul 2' dari ruang sampel dadu.",
      steps: [
        "S = {1, 2, 3, 4, 5, 6}, n(S) = 6",
        "Kejadian muncul 2: {2} → n = 1",
        "Bukan 2: {1, 3, 4, 5, 6} → n = 5"
      ],
      formula: "n(A^c) = n(S) - n(A) = 6 - 1 = 5"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah keluarga berencana memiliki 3 anak. Banyaknya titik sampel yang dapat terjadi adalah ....",
    svgKey: "koin-3",
    options: ["A. 4", "B. 6", "C. 8", "D. 12"],
    correctAnswer: "C. 8",
    explanation: {
      concept: "Setiap anak bisa laki-laki (L) atau perempuan (P): 2 kemungkinan per anak.",
      steps: [
        "n(S) = 2³ = 8",
        "S = {LLL, LLP, LPL, LPP, PLL, PLP, PPL, PPP}"
      ],
      formula: "n(S) = 2^3 = 8"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada pelemparan dua buah uang logam, kejadian tidak muncul gambar (G) adalah ....",
    svgKey: "koin-2",
    options: [
      "A. {(A, A)}",
      "B. {(G, G)}",
      "C. {(A, G), (G, A)}",
      "D. {(G, G), (A, G), (G, A)}"
    ],
    correctAnswer: "A. {(A, A)}",
    explanation: {
      concept: "Tidak muncul gambar berarti kedua sisi menunjukkan angka (A).",
      steps: [
        "S = {(A,A), (A,G), (G,A), (G,G)}",
        "Tidak muncul G → (A,A)",
        "Jadi kejadiannya = {(A, A)}"
      ],
      formula: ""
    }
  },

  /* Frekuensi Relatif */
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada 80 kali pelemparan sekeping mata uang, muncul sisi angka sebanyak 52 kali. Frekuensi relatif munculnya sisi angka adalah ....",
    svgKey: "koin-1",
    options: [
      "A. $\\frac{1}{5}$",
      "B. $\\frac{13}{20}$",
      "C. $\\frac{17}{20}$",
      "D. $\\frac{7}{10}$"
    ],
    correctAnswer: "B. $\\frac{13}{20}$",
    explanation: {
      concept: "Frekuensi relatif = banyak kejadian ÷ banyak percobaan.",
      steps: [
        "$f_r = \\dfrac{52}{80} = \\dfrac{13}{20}$"
      ],
      formula: "f_r = \\frac{f}{n}"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada percobaan melempar undi sebuah dadu sebanyak 60 kali, mata dadu bermata 6 muncul 9 kali. Frekuensi relatif munculnya mata dadu bermata 6 adalah ....",
    svgKey: "dadu-prima",
    options: [
      "A. $\\frac{3}{20}$",
      "B. $\\frac{1}{20}$",
      "C. $\\frac{9}{60}$",
      "D. $\\frac{6}{60}$"
    ],
    correctAnswer: "A. $\\frac{3}{20}$",
    explanation: {
      concept: "Frekuensi relatif = banyak kejadian ÷ banyak percobaan.",
      steps: [
        "$f_r = \\dfrac{9}{60} = \\dfrac{3}{20}$"
      ],
      formula: "f_r = \\frac{9}{60} = \\frac{3}{20}"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada percobaan melempar dadu sebanyak 60 kali diperoleh data frekuensi:\n\nMata Dadu: 1→8, 2→10, 3→14, 4→12, 5→9, 6→7\n\nFrekuensi relatif muncul mata dadu 2 adalah ....",
    svgKey: "dadu-genap",
    options: [
      "A. $\\frac{2}{15}$",
      "B. $\\frac{1}{6}$",
      "C. $\\frac{7}{20}$",
      "D. $\\frac{1}{5}$"
    ],
    correctAnswer: "B. $\\frac{1}{6}$",
    explanation: {
      concept: "Frekuensi relatif = frekuensi muncul ÷ total percobaan.",
      steps: [
        "Frekuensi mata 2 = 10",
        "Total percobaan = 60",
        "$f_r = \\dfrac{10}{60} = \\dfrac{1}{6}$"
      ],
      formula: "f_r = \\frac{10}{60} = \\frac{1}{6}"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada percobaan melempar dadu sebanyak 60 kali diperoleh data frekuensi:\n\nMata Dadu: 1→8, 2→10, 3→14, 4→12, 5→9, 6→7\n\nFrekuensi relatif muncul mata dadu 3 adalah ....",
    svgKey: "dadu-prima",
    options: [
      "A. $\\frac{1}{4}$",
      "B. $\\frac{1}{5}$",
      "C. $\\frac{7}{30}$",
      "D. $\\frac{1}{6}$"
    ],
    correctAnswer: "C. $\\frac{7}{30}$",
    explanation: {
      concept: "Frekuensi relatif = frekuensi muncul ÷ total percobaan.",
      steps: [
        "Frekuensi mata 3 = 14",
        "Total percobaan = 60",
        "$f_r = \\dfrac{14}{60} = \\dfrac{7}{30}$"
      ],
      formula: "f_r = \\frac{14}{60} = \\frac{7}{30}"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada percobaan melempar dadu sebanyak 60 kali diperoleh data frekuensi:\n\nMata Dadu: 1→8, 2→10, 3→14, 4→12, 5→9, 6→7\n\nFrekuensi relatif muncul mata dadu 5 adalah ....",
    svgKey: "dadu-genap",
    options: [
      "A. $\\frac{1}{6}$",
      "B. $\\frac{3}{20}$",
      "C. $\\frac{1}{5}$",
      "D. $\\frac{1}{8}$"
    ],
    correctAnswer: "B. $\\frac{3}{20}$",
    explanation: {
      concept: "Frekuensi relatif = frekuensi muncul ÷ total percobaan.",
      steps: [
        "Frekuensi mata 5 = 9",
        "Total percobaan = 60",
        "$f_r = \\dfrac{9}{60} = \\dfrac{3}{20}$"
      ],
      formula: "f_r = \\frac{9}{60} = \\frac{3}{20}"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada percobaan pelemparan sebuah dadu sebanyak 120 kali, munculnya mata dadu genap terjadi sebanyak 66 kali. Frekuensi relatif munculnya mata dadu genap pada percobaan tersebut adalah ....",
    svgKey: "dadu-genap",
    options: [
      "A. $\\frac{9}{20}$",
      "B. $\\frac{6}{25}$",
      "C. $\\frac{11}{20}$",
      "D. $\\frac{11}{40}$"
    ],
    correctAnswer: "C. $\\frac{11}{20}$",
    explanation: {
      concept: "Frekuensi relatif = frekuensi kejadian ÷ banyak percobaan.",
      steps: [
        "$f_r = \\dfrac{66}{120} = \\dfrac{11}{20}$"
      ],
      formula: "f_r = \\frac{66}{120} = \\frac{11}{20}"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sekeping uang logam dilempar sebanyak 200 kali dan ternyata sisi angka muncul sebanyak 90 kali. Frekuensi relatif munculnya sisi angka adalah ....",
    svgKey: "koin-1",
    options: [
      "A. $\\frac{9}{20}$",
      "B. $\\frac{9}{10}$",
      "C. $\\frac{9}{25}$",
      "D. $\\frac{3}{10}$"
    ],
    correctAnswer: "A. $\\frac{9}{20}$",
    explanation: {
      concept: "Frekuensi relatif = frekuensi muncul ÷ total percobaan.",
      steps: [
        "$f_r = \\dfrac{90}{200} = \\dfrac{9}{20}$"
      ],
      formula: "f_r = \\frac{90}{200} = \\frac{9}{20}"
    }
  },

  /* Peluang dan Komplemen Suatu Kejadian */
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada percobaan mengetos sebuah dadu 240 kali, ternyata muncul mata dadu 4 sebanyak 36 kali. Frekuensi relatif munculnya mata dadu bukan 4 adalah ....",
    svgKey: "dadu-besar4",
    options: [
      "A. $\\frac{1}{36}$",
      "B. $\\frac{1}{8}$",
      "C. $\\frac{17}{20}$",
      "D. $\\frac{7}{8}$"
    ],
    correctAnswer: "C. $\\frac{17}{20}$",
    explanation: {
      concept: "Frekuensi bukan 4 = total − frekuensi 4, lalu bagi dengan total percobaan.",
      steps: [
        "Frekuensi bukan 4 = 240 − 36 = 204",
        "$f_r = \\dfrac{204}{240} = \\dfrac{17}{20}$"
      ],
      formula: "f_r(\\text{bukan 4}) = \\frac{204}{240} = \\frac{17}{20}"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah huruf dipilih acak dari kata \"MATEMATIKA\". Peluang terpilihnya huruf A adalah ....",
    options: [
      "A. $\\frac{1}{10}$",
      "B. $\\frac{2}{10}$",
      "C. $\\frac{3}{10}$",
      "D. $\\frac{4}{10}$"
    ],
    correctAnswer: "C. $\\frac{3}{10}$",
    explanation: {
      concept: "Hitung banyak huruf A dan total huruf dalam kata.",
      steps: [
        "MATEMATIKA → M, A, T, E, M, A, T, I, K, A",
        "Total huruf = 10",
        "Huruf A muncul: 3 kali",
        "$P(A) = \\dfrac{3}{10}$"
      ],
      formula: "P(A) = \\frac{n(A)}{n(S)} = \\frac{3}{10}"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Nilai peluang yang mungkin adalah sebagai berikut, kecuali ....",
    options: ["A. 0", "B. 0,75", "C. 1,25", "D. 1"],
    correctAnswer: "C. 1,25",
    explanation: {
      concept: "Nilai peluang suatu kejadian selalu memenuhi 0 ≤ P(A) ≤ 1.",
      steps: [
        "P = 0 → mungkin (kejadian mustahil)",
        "P = 0,75 → mungkin (0 ≤ 0,75 ≤ 1)",
        "P = 1,25 → TIDAK mungkin (melebihi 1)",
        "P = 1 → mungkin (kejadian pasti)"
      ],
      formula: "0 \\leq P(A) \\leq 1"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Ruang sampel suatu kejadian adalah {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}. Jika A = kejadian muncul bilangan prima, maka komplemen kejadian A adalah ....",
    svgKey: "dadu-prima",
    options: [
      "A. {2, 3, 5, 7}",
      "B. {1, 3, 5, 7, 9}",
      "C. {1, 4, 6, 8, 9, 10}",
      "D. {1, 4, 6, 8, 10}"
    ],
    correctAnswer: "C. {1, 4, 6, 8, 9, 10}",
    explanation: {
      concept: "Komplemen A = anggota S yang bukan anggota A.",
      steps: [
        "S = {1,2,3,4,5,6,7,8,9,10}",
        "A (prima) = {2,3,5,7}",
        "$A^c = S - A = \\{1,4,6,8,9,10\\}$",
        "Catatan: 9 = 3² bukan bilangan prima"
      ],
      formula: "A^c = S \\setminus A"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Dalam pemilihan ketua kelas terdapat 4 kandidat: 2 wanita dan 2 pria. Satu orang dipilih secara acak. Peluang terpilihnya kandidat wanita adalah ....",
    options: [
      "A. $\\frac{1}{4}$",
      "B. $\\frac{1}{3}$",
      "C. $\\frac{1}{2}$",
      "D. $\\frac{3}{4}$"
    ],
    correctAnswer: "C. $\\frac{1}{2}$",
    explanation: {
      concept: "Peluang = banyak hasil yang diinginkan ÷ total ruang sampel.",
      steps: [
        "n(wanita) = 2",
        "n(S) = 4",
        "$P(\\text{wanita}) = \\dfrac{2}{4} = \\dfrac{1}{2}$"
      ],
      formula: "P = \\frac{2}{4} = \\frac{1}{2}"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Dari sekelompok kartu yang diberi nomor 1 sampai 10, diambil satu kartu secara acak. Peluang terambilnya kartu bukan bilangan genap adalah ....",
    options: [
      "A. $\\frac{1}{4}$",
      "B. $\\frac{1}{3}$",
      "C. $\\frac{1}{2}$",
      "D. $\\frac{2}{3}$"
    ],
    correctAnswer: "C. $\\frac{1}{2}$",
    explanation: {
      concept: "Bukan genap = ganjil. Hitung banyak bilangan ganjil dalam 1–10.",
      steps: [
        "Ganjil: {1, 3, 5, 7, 9} → n = 5",
        "n(S) = 10",
        "$P(\\text{bukan genap}) = \\dfrac{5}{10} = \\dfrac{1}{2}$"
      ],
      formula: "P = \\frac{5}{10} = \\frac{1}{2}"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sepasang suami istri merencanakan untuk memiliki 2 anak saja. Peluang mereka mempunyai paling sedikit satu anak perempuan adalah ....",
    svgKey: "koin-2",
    options: [
      "A. $\\frac{1}{4}$",
      "B. $\\frac{1}{2}$",
      "C. $\\frac{3}{4}$",
      "D. 1"
    ],
    correctAnswer: "C. $\\frac{3}{4}$",
    explanation: {
      concept: "S = {LL, LP, PL, PP}. Paling sedikit 1P: kebalikan dari 'tidak ada P'.",
      steps: [
        "P(tidak ada P) = P(LL) = 1/4",
        "$P(\\text{paling sedikit 1P}) = 1 - \\dfrac{1}{4} = \\dfrac{3}{4}$"
      ],
      formula: "P(A) = 1 - P(A^c)"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah papan berbentuk segi delapan beraturan terbagi atas 4 bagian merah, 2 bagian biru, dan 2 bagian kuning. Sebuah jarum penunjuk diputar. Peluang jarum berhenti pada bagian bukan merah adalah ....",
    options: [
      "A. $\\frac{1}{8}$",
      "B. $\\frac{1}{4}$",
      "C. $\\frac{3}{8}$",
      "D. $\\frac{1}{2}$"
    ],
    correctAnswer: "D. $\\frac{1}{2}$",
    explanation: {
      concept: "Bukan merah = biru + kuning.",
      steps: [
        "n(bukan merah) = 2 + 2 = 4",
        "n(S) = 8",
        "$P(\\text{bukan merah}) = \\dfrac{4}{8} = \\dfrac{1}{2}$"
      ],
      formula: "P = \\frac{4}{8} = \\frac{1}{2}"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah dadu dilempar sekali. Peluang munculnya bilangan ganjil atau lebih dari 4 adalah ....",
    svgKey: "dadu-besar3",
    options: [
      "A. $\\frac{1}{6}$",
      "B. $\\frac{1}{2}$",
      "C. $\\frac{2}{3}$",
      "D. $\\frac{5}{6}$"
    ],
    correctAnswer: "C. $\\frac{2}{3}$",
    explanation: {
      concept: "Gunakan rumus P(A∪B) = P(A)+P(B)−P(A∩B).",
      steps: [
        "Ganjil = {1,3,5}, lebih dari 4 = {5,6}",
        "Ganjil ∪ lebih dari 4 = {1,3,5,6} → n = 4",
        "$P = \\dfrac{4}{6} = \\dfrac{2}{3}$"
      ],
      formula: "P(A \\cup B) = \\frac{n(A \\cup B)}{n(S)}"
    }
  },
  {
    id: 29, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Tiga mata uang logam dilempar bersamaan. Peluang kejadian muncul minimal 2 angka (A) adalah ....",
    svgKey: "koin-3",
    options: [
      "A. $\\frac{1}{6}$",
      "B. $\\frac{1}{4}$",
      "C. $\\frac{3}{8}$",
      "D. $\\frac{1}{2}$"
    ],
    correctAnswer: "D. $\\frac{1}{2}$",
    explanation: {
      concept: "Minimal 2A = tepat 2A atau tepat 3A.",
      steps: [
        "n(S) = 8",
        "Tepat 2A: {AAG, AGA, GAA} → 3",
        "Tepat 3A: {AAA} → 1",
        "Total = 4",
        "$P = \\dfrac{4}{8} = \\dfrac{1}{2}$"
      ],
      formula: "P(\\geq 2A) = \\frac{4}{8} = \\frac{1}{2}"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah dadu dan sebuah koin dilempar bersama-sama. Peluang muncul mata dadu kelipatan 3 dan koin angka (A) adalah ....",
    svgKey: "dadu-koin",
    options: [
      "A. $\\frac{1}{12}$",
      "B. $\\frac{1}{6}$",
      "C. $\\frac{1}{4}$",
      "D. $\\frac{1}{3}$"
    ],
    correctAnswer: "B. $\\frac{1}{6}$",
    explanation: {
      concept: "n(S) = 12. Hitung pasangan yang memenuhi keduanya.",
      steps: [
        "Kelipatan 3 pada dadu: {3, 6}",
        "Koin angka: {A}",
        "Pasangan yang sesuai: (3,A) dan (6,A) → 2",
        "$P = \\dfrac{2}{12} = \\dfrac{1}{6}$"
      ],
      formula: "P = \\frac{2}{12} = \\frac{1}{6}"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dalam sebuah kardus terdapat 12 bola merah, 5 bola kuning, dan 3 bola cokelat. Jika diambil sebuah bola secara acak, maka peluang terambilnya bola merah adalah ....",
    svgKey: "marble-4r6p",
    options: [
      "A. $\\frac{1}{4}$",
      "B. $\\frac{3}{10}$",
      "C. $\\frac{2}{5}$",
      "D. $\\frac{3}{5}$"
    ],
    correctAnswer: "D. $\\frac{3}{5}$",
    explanation: {
      concept: "Peluang = banyak bola merah ÷ total bola.",
      steps: [
        "n(merah) = 12",
        "n(S) = 12 + 5 + 3 = 20",
        "$P(\\text{merah}) = \\dfrac{12}{20} = \\dfrac{3}{5}$"
      ],
      formula: "P = \\frac{12}{20} = \\frac{3}{5}"
    }
  },
  {
    id: 32, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Suatu keluarga memiliki tiga orang anak. Peluang keluarga tersebut mempunyai paling sedikit 2 anak laki-laki adalah ....",
    svgKey: "koin-3",
    options: [
      "A. $\\frac{1}{4}$",
      "B. $\\frac{1}{2}$",
      "C. $\\frac{3}{4}$",
      "D. 1"
    ],
    correctAnswer: "B. $\\frac{1}{2}$",
    explanation: {
      concept: "Minimal 2L = tepat 2L atau 3L.",
      steps: [
        "S = 8 anggota (2³)",
        "Tepat 2L: {LLP, LPL, PLL} → 3",
        "Tepat 3L: {LLL} → 1",
        "Total = 4",
        "$P = \\dfrac{4}{8} = \\dfrac{1}{2}$"
      ],
      formula: "P = \\frac{4}{8} = \\frac{1}{2}"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Lima belas kartu diberi angka 1, 2, 3, ..., 15. Kartu-kartu tersebut dikocok kemudian diambil satu kartu secara acak. Peluang terambil kartu bergangka ganjil adalah ....",
    options: [
      "A. $\\frac{1}{3}$",
      "B. $\\frac{7}{15}$",
      "C. $\\frac{8}{15}$",
      "D. $\\frac{1}{2}$"
    ],
    correctAnswer: "C. $\\frac{8}{15}$",
    explanation: {
      concept: "Hitung bilangan ganjil dari 1 hingga 15.",
      steps: [
        "Ganjil: {1,3,5,7,9,11,13,15} → n = 8",
        "n(S) = 15",
        "$P(\\text{ganjil}) = \\dfrac{8}{15}$"
      ],
      formula: "P = \\frac{8}{15}"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dua buah dadu dilempar bersamaan. Peluang muncul mata dadu berjumlah 7 adalah ....",
    svgKey: "dua-dadu-7",
    options: [
      "A. $\\frac{1}{36}$",
      "B. $\\frac{1}{12}$",
      "C. $\\frac{1}{6}$",
      "D. $\\frac{5}{36}$"
    ],
    correctAnswer: "C. $\\frac{1}{6}$",
    explanation: {
      concept: "Hitung semua pasangan dadu yang berjumlah 7.",
      steps: [
        "(1,6),(6,1),(2,5),(5,2),(3,4),(4,3) → 6 pasangan",
        "n(S) = 36",
        "$P = \\dfrac{6}{36} = \\dfrac{1}{6}$"
      ],
      formula: "P = \\frac{6}{36} = \\frac{1}{6}"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Dari 1.000 butir telur ayam, terdapat 125 butir telur yang retak. Jika sebuah telur diambil secara acak, maka peluang terambil telur yang tidak retak adalah ....",
    options: [
      "A. $\\frac{1}{8}$",
      "B. $\\frac{3}{4}$",
      "C. $\\frac{7}{8}$",
      "D. 1"
    ],
    correctAnswer: "C. $\\frac{7}{8}$",
    explanation: {
      concept: "Tidak retak = total − retak.",
      steps: [
        "n(tidak retak) = 1000 − 125 = 875",
        "n(S) = 1000",
        "$P = \\dfrac{875}{1000} = \\dfrac{7}{8}$"
      ],
      formula: "P(\\text{tidak retak}) = \\frac{875}{1000} = \\frac{7}{8}"
    }
  },
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Di dalam sebuah kotak terdapat 8 bola putih, 4 bola merah, dan 4 bola kuning. Dari kotak tersebut diambil sebuah bola secara acak tanpa dikembalikan. Peluang terambilnya bola merah adalah ....",
    svgKey: "marble-4r6p",
    options: [
      "A. $\\frac{1}{8}$",
      "B. $\\frac{1}{4}$",
      "C. $\\frac{3}{8}$",
      "D. $\\frac{1}{2}$"
    ],
    correctAnswer: "B. $\\frac{1}{4}$",
    explanation: {
      concept: "Peluang = banyak bola merah ÷ total bola.",
      steps: [
        "n(merah) = 4",
        "n(S) = 8 + 4 + 4 = 16",
        "$P(\\text{merah}) = \\dfrac{4}{16} = \\dfrac{1}{4}$"
      ],
      formula: "P = \\frac{4}{16} = \\frac{1}{4}"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dari 30 siswa terdapat 16 siswa gemar Matematika, 14 siswa gemar IPA, dan 8 siswa tidak gemar keduanya. Jika dipilih satu siswa secara acak, maka peluang terpilihnya siswa yang hanya gemar IPA adalah ....",
    svgKey: "venn-siswa",
    options: [
      "A. $\\frac{1}{6}$",
      "B. $\\frac{1}{5}$",
      "C. $\\frac{4}{15}$",
      "D. $\\frac{13}{30}$"
    ],
    correctAnswer: "B. $\\frac{1}{5}$",
    explanation: {
      concept: "Gunakan diagram Venn untuk menemukan jumlah siswa yang hanya gemar IPA.",
      steps: [
        "n(M∪I) = 30 − 8 = 22 (yang gemar setidaknya satu)",
        "n(M∩I) = n(M) + n(I) − n(M∪I) = 16 + 14 − 22 = 8 (gemar keduanya)",
        "n(hanya IPA) = n(I) − n(M∩I) = 14 − 8 = 6",
        "$P(\\text{hanya IPA}) = \\dfrac{6}{30} = \\dfrac{1}{5}$"
      ],
      formula: "P = \\frac{6}{30} = \\frac{1}{5}"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Empat buah koin dilempar bersamaan. Peluang munculnya tepat 3 angka dan 1 gambar adalah ....",
    svgKey: "koin-3",
    options: [
      "A. $\\frac{1}{8}$",
      "B. $\\frac{1}{4}$",
      "C. $\\frac{3}{16}$",
      "D. $\\frac{1}{2}$"
    ],
    correctAnswer: "B. $\\frac{1}{4}$",
    explanation: {
      concept: "n(S) = 2⁴ = 16. Tepat 3A 1G = C(4,1) = 4.",
      steps: [
        "n(S) = 2⁴ = 16",
        "n(tepat 3A,1G) = C(4,1) = 4",
        "{AAAG, AAGA, AGAA, GAAA}",
        "$P = \\dfrac{4}{16} = \\dfrac{1}{4}$"
      ],
      formula: "P = \\frac{C(4,1)}{2^4} = \\frac{4}{16} = \\frac{1}{4}"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dadu merah dan dadu hijau dilempar bersamaan. Peluang munculnya mata 5 pada dadu merah dan mata 3 pada dadu hijau adalah ....",
    svgKey: "dua-dadu-7",
    options: [
      "A. $\\frac{1}{36}$",
      "B. $\\frac{1}{12}$",
      "C. $\\frac{1}{6}$",
      "D. $\\frac{5}{36}$"
    ],
    correctAnswer: "A. $\\frac{1}{36}$",
    explanation: {
      concept: "Kedua kejadian bebas: P(A∩B) = P(A) × P(B).",
      steps: [
        "P(dadu merah = 5) = 1/6",
        "P(dadu hijau = 3) = 1/6",
        "$P = \\dfrac{1}{6} \\times \\dfrac{1}{6} = \\dfrac{1}{36}$"
      ],
      formula: "P = \\frac{1}{6} \\times \\frac{1}{6} = \\frac{1}{36}"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dadu merah dan dadu biru dilempar bersamaan. Peluang munculnya mata genap pada kedua dadu adalah ....",
    svgKey: "dua-dadu-genap",
    options: [
      "A. $\\frac{1}{36}$",
      "B. $\\frac{1}{12}$",
      "C. $\\frac{1}{4}$",
      "D. $\\frac{1}{2}$"
    ],
    correctAnswer: "C. $\\frac{1}{4}$",
    explanation: {
      concept: "P(genap pada satu dadu) = 3/6 = 1/2. Kedua dadu independen.",
      steps: [
        "P(genap dadu merah) = 1/2",
        "P(genap dadu biru) = 1/2",
        "$P(\\text{keduanya genap}) = \\dfrac{1}{2} \\times \\dfrac{1}{2} = \\dfrac{1}{4}$"
      ],
      formula: "P = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}"
    }
  },

  /* Satu set kartu bridge */
  {
    id: 41, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Satu set kartu bridge terdiri atas 13 kartu cengkih berwarna hitam, 13 kartu hati berwarna merah, dan 13 kartu skop berwarna hitam, dan 13 kartu berlian berwarna merah. Tiap jenis kartu terdiri atas As (A), King (K), Queen (Q), Jack (J), serta kartu-kartu bernomor 10, 9, 8, 7, 6, 5, 4, 3, dan 2. Sebuah kartu diambil secara acak. Peluang terambilnya kartu As skop diambil adalah ....",
    svgKey: "kartu-bridge",
    options: [
      "A. $\\frac{1}{52}$",
      "B. $\\frac{1}{13}$",
      "C. $\\frac{1}{4}$",
      "D. $\\frac{2}{13}$"
    ],
    correctAnswer: "A. $\\frac{1}{52}$",
    explanation: {
      concept: "Kartu As Skop hanya ada 1 dari 52 kartu.",
      steps: [
        "n(As Skop) = 1",
        "n(S) = 52",
        "$P = \\dfrac{1}{52}$"
      ],
      formula: "P = \\frac{1}{52}"
    }
  },

  /* C. Isian */
  {
    id: 42, type: "PG", difficulty: "Sulit", category: "Kontekstual",
    question: "Pada pelemparan dua buah dadu bersama-sama, banyaknya kejadian muncul kedua-duanya mata dadu 6 adalah ....",
    svgKey: "dua-dadu-7",
    options: ["A. 1", "B. 2", "C. 5", "D. 6"],
    correctAnswer: "A. 1",
    explanation: {
      concept: "Pasangan (6,6) hanya ada satu dalam ruang sampel 36.",
      steps: [
        "n(S) = 36",
        "n(6,6) = 1 → hanya (6,6)",
        "Jumlah kejadian = 1"
      ],
      formula: ""
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Dua buah uang logam dilempar bersama-sama. Banyaknya kejadian muncul kedua-duanya sisi gambar adalah ....",
    svgKey: "koin-2",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "A. 1",
    explanation: {
      concept: "S = {(A,A),(A,G),(G,A),(G,G)}. Keduanya gambar = {(G,G)}.",
      steps: [
        "S = {(A,A),(A,G),(G,A),(G,G)}",
        "Keduanya G: {(G,G)} → 1 kejadian"
      ],
      formula: ""
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sulit", category: "Kontekstual",
    question: "Ruang sampel pada percobaan pelemparan dua buah dadu bersama-sama. Peluang munculnya jumlah mata dadu genap adalah ....",
    svgKey: "dua-dadu-genap",
    options: [
      "A. $\\frac{1}{36}$",
      "B. $\\frac{1}{6}$",
      "C. $\\frac{1}{4}$",
      "D. $\\frac{1}{2}$"
    ],
    correctAnswer: "D. $\\frac{1}{2}$",
    explanation: {
      concept: "Jumlah genap jika keduanya genap atau keduanya ganjil.",
      steps: [
        "Keduanya genap: 3×3 = 9",
        "Keduanya ganjil: 3×3 = 9",
        "Total = 18",
        "$P = \\dfrac{18}{36} = \\dfrac{1}{2}$"
      ],
      formula: "P = \\frac{18}{36} = \\frac{1}{2}"
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Sebuah dadu biru dan sebuah dadu merah dilempar bersamaan. Peluang munculnya jumlah mata dadu berjumlah 5 pada dadu pada percobaan tersebut adalah ....",
    svgKey: "dua-dadu-7",
    options: [
      "A. $\\frac{1}{36}$",
      "B. $\\frac{1}{12}$",
      "C. $\\frac{1}{9}$",
      "D. $\\frac{5}{36}$"
    ],
    correctAnswer: "C. $\\frac{1}{9}$",
    explanation: {
      concept: "Jumlah = 5: hitung semua pasangan.",
      steps: [
        "(1,4),(4,1),(2,3),(3,2) → 4 pasangan",
        "n(S) = 36",
        "$P = \\dfrac{4}{36} = \\dfrac{1}{9}$"
      ],
      formula: "P = \\frac{4}{36} = \\frac{1}{9}"
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sulit", category: "Kontekstual",
    question: "Sebuah dadu dan sebuah koin dilempar bersama-sama. Peluang munculnya mata dadu prima pada dadu dan sisi gambar pada koin adalah ....",
    svgKey: "dadu-koin",
    options: [
      "A. $\\frac{1}{12}$",
      "B. $\\frac{1}{6}$",
      "C. $\\frac{1}{4}$",
      "D. $\\frac{1}{3}$"
    ],
    correctAnswer: "C. $\\frac{1}{4}$",
    explanation: {
      concept: "Prima pada dadu: {2,3,5}. Gambar pada koin: {G}.",
      steps: [
        "P(prima) = 3/6 = 1/2",
        "P(gambar) = 1/2",
        "$P = \\dfrac{1}{2} \\times \\dfrac{1}{2} = \\dfrac{1}{4}$"
      ],
      formula: "P = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}"
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sulit", category: "Kontekstual",
    question: "Sebuah kotak berisi 9 bola merah dan 6 bola biru. Diambil satu bola secara acak. Peluang terambilnya bola bukan merah adalah ....",
    svgKey: "marble-3r2b",
    options: [
      "A. $\\frac{2}{5}$",
      "B. $\\frac{3}{5}$",
      "C. $\\frac{1}{3}$",
      "D. $\\frac{2}{3}$"
    ],
    correctAnswer: "A. $\\frac{2}{5}$",
    explanation: {
      concept: "Bukan merah = biru. Peluang = n(biru) ÷ n(S).",
      steps: [
        "n(biru) = 6",
        "n(S) = 9 + 6 = 15",
        "$P(\\text{bukan merah}) = \\dfrac{6}{15} = \\dfrac{2}{5}$"
      ],
      formula: "P = \\frac{6}{15} = \\frac{2}{5}"
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Sebuah dadu biru dan dadu merah dilempar bersamaan. Peluang munculnya jumlah mata dadu 5 pada dadu pada percobaan tersebut adalah ....",
    svgKey: "dua-dadu-7",
    options: [
      "A. $\\frac{3}{36}$",
      "B. $\\frac{4}{36}$",
      "C. $\\frac{5}{36}$",
      "D. $\\frac{6}{36}$"
    ],
    correctAnswer: "B. $\\frac{4}{36}$",
    explanation: {
      concept: "Pasangan dadu dengan jumlah 5.",
      steps: [
        "(1,4),(4,1),(2,3),(3,2) → 4 pasangan",
        "$P = \\dfrac{4}{36} = \\dfrac{1}{9}$"
      ],
      formula: "P = \\frac{4}{36} = \\frac{1}{9}"
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sulit", category: "Kontekstual",
    question: "Sebuah dadu dilempar dua kali. Peluang munculnya mata dadu genap pada pelemparan pertama dan mata dadu tiga pada pelemparan kedua adalah ....",
    svgKey: "dadu-genap",
    options: [
      "A. $\\frac{1}{36}$",
      "B. $\\frac{1}{12}$",
      "C. $\\frac{1}{4}$",
      "D. $\\frac{1}{6}$"
    ],
    correctAnswer: "B. $\\frac{1}{12}$",
    explanation: {
      concept: "Kedua pelemparan independen.",
      steps: [
        "P(genap) = 3/6 = 1/2",
        "P(muncul 3) = 1/6",
        "$P = \\dfrac{1}{2} \\times \\dfrac{1}{6} = \\dfrac{1}{12}$"
      ],
      formula: "P = \\frac{1}{2} \\times \\frac{1}{6} = \\frac{1}{12}"
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Sebuah dadu biru dan sebuah dadu merah dilempar bersama-sama, Peluang munculnya mata 5 pada dadu merah pada percobaan tersebut adalah ....",
    svgKey: "dadu-besar4",
    options: [
      "A. $\\frac{1}{36}$",
      "B. $\\frac{1}{12}$",
      "C. $\\frac{1}{6}$",
      "D. $\\frac{5}{36}$"
    ],
    correctAnswer: "C. $\\frac{1}{6}$",
    explanation: {
      concept: "Untuk dadu merah saja: P(5) = 1/6, tidak tergantung dadu biru.",
      steps: [
        "Dadu merah bermata 6: P(5) = 1/6",
        "Dadu biru tidak mempengaruhi hasil dadu merah"
      ],
      formula: "P = \\frac{1}{6}"
    }
  }
];

/* ── SoalCard Component ── */
const SoalCard = ({ soal, number }: { soal: Question; number: number }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedStatements, setSelectedStatements] = useState<Record<number, boolean | null>>({});
  const [showPembahasan, setShowPembahasan] = useState(false);
  const navigate = useNavigate();

  const diffColor = soal.difficulty === "Mudah" ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/10"
    : soal.difficulty === "Sedang" ? "text-amber-400 border-amber-400/40 bg-amber-400/10"
    : "text-red-400 border-red-400/40 bg-red-400/10";

  const typeColor = soal.type === "PG" ? "text-cyan-400 border-cyan-400/40 bg-cyan-400/10"
    : soal.type === "MCMA" ? "text-purple-400 border-purple-400/40 bg-purple-400/10"
    : "text-yellow-400 border-yellow-400/40 bg-yellow-400/10";

  const handleSelect = (opt: string) => {
    playPopSound();
    setSelected(opt);
    setShowPembahasan(false);
  };

  const handleStatementToggle = (idx: number, val: boolean) => {
    playPopSound();
    setSelectedStatements(prev => ({ ...prev, [idx]: prev[idx] === val ? null : val }));
  };

  const isCorrect = soal.type === "PG" && selected === soal.correctAnswer;
  const isMCMACorrect = soal.type === "MCMA" && selected === soal.correctAnswer;

  return (
    <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-5 mb-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-cyan-300 font-bold font-mono text-sm">#{number}</span>
        <span className={`text-xs border rounded-full px-2 py-0.5 font-mono ${diffColor}`}>{soal.difficulty}</span>
        <span className={`text-xs border rounded-full px-2 py-0.5 font-mono ${typeColor}`}>{soal.type}</span>
        <span className="text-xs border border-slate-600 bg-slate-800 text-slate-300 rounded-full px-2 py-0.5 font-mono">{soal.category}</span>
      </div>

      <div className="text-white/90 text-sm leading-relaxed mb-3">
        <MathText text={soal.question} />
      </div>

      {soal.svgKey && visualMap[soal.svgKey] && (
        <div className="mb-3">{visualMap[soal.svgKey]}</div>
      )}

      {soal.type === "Benar/Salah" && soal.statements && (
        <div className="space-y-2 mb-3">
          {soal.statements.map((stmt, idx) => {
            const userAns = selectedStatements[idx];
            const correct = stmt.isCorrect;
            const answered = userAns !== null && userAns !== undefined;
            const isRight = answered && userAns === correct;
            const isWrong = answered && userAns !== correct;
            return (
              <div key={idx} className={`border rounded-lg p-3 text-sm transition-colors ${answered ? (isRight ? "border-emerald-500/60 bg-emerald-500/10" : "border-red-500/60 bg-red-500/10") : "border-slate-700 bg-slate-800/40"}`}>
                <div className="text-white/85 mb-2"><MathText text={`${idx + 1}. ${stmt.text}`} /></div>
                <div className="flex gap-2">
                  {[true, false].map(val => (
                    <button key={String(val)} onClick={() => handleStatementToggle(idx, val)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${userAns === val ? (val === correct ? "bg-emerald-500/30 border-emerald-400 text-emerald-300" : "bg-red-500/30 border-red-400 text-red-300") : "bg-slate-800 border-slate-600 text-slate-400 hover:border-cyan-500"}`}>
                      {val ? "Benar" : "Salah"}
                    </button>
                  ))}
                  {answered && <span className={`ml-2 text-xs font-mono self-center ${isRight ? "text-emerald-400" : "text-red-400"}`}>{isRight ? "✓" : `✗ (${correct ? "Benar" : "Salah"})`}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(soal.type === "PG" || soal.type === "MCMA") && soal.options && (
        <div className="space-y-2 mb-3">
          {soal.options.map((opt) => {
            const isSelected = selected === opt;
            const isAnswerCorrect = soal.type === "MCMA"
              ? soal.correctAnswer?.split(", ").some(c => opt.startsWith(c.trim()))
              : opt === soal.correctAnswer;
            const showResult = isSelected;
            return (
              <button key={opt} onClick={() => handleSelect(opt)}
                className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all font-mono ${showResult ? (isAnswerCorrect ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-red-500/20 border-red-500 text-red-300") : "bg-slate-800/50 border-slate-700 text-white/80 hover:border-cyan-500/50 hover:bg-cyan-500/5"}`}>
                <MathText text={opt} />
              </button>
            );
          })}
          {selected && (
            <p className={`text-xs font-mono mt-1 ${(soal.type === "PG" && isCorrect) || (soal.type === "MCMA" && isMCMACorrect) ? "text-emerald-400" : "text-red-400"}`}>
              {(soal.type === "PG" && isCorrect) || (soal.type === "MCMA" && isMCMACorrect) ? "✓ Jawaban benar!" : `✗ Jawaban benar: ${soal.correctAnswer}`}
            </p>
          )}
        </div>
      )}

      <button onClick={() => { playPopSound(); setShowPembahasan(!showPembahasan); }}
        className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono mt-2 transition-colors">
        {showPembahasan ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showPembahasan ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
      </button>

      {showPembahasan && (
        <div className="mt-3 space-y-2">
            {/* ─── Jawaban ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20 mb-2.5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
              {soal.correctAnswer && (
                <div className="font-body text-sm text-emerald-50 font-bold">
                  <MathText text={Array.isArray(soal.correctAnswer) ? soal.correctAnswer.join(", ") : soal.correctAnswer} />
                </div>
              )}
              {soal.statements && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {soal.statements.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-0.5 rounded font-body font-semibold ${s.isCorrect ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-300"}`}>
                      ({i+1}) {s.isCorrect ? "✓ Benar" : "✗ Salah"}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* ─── Konsep & Trik ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20 mb-2.5" style={{background:"linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
              <div className="font-body text-xs text-violet-50/90 leading-relaxed">
                <MathText text={soal.explanation.concept} />
              </div>
            </div>
            {/* ─── Step by Step ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20 mb-2.5" style={{background:"linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
              <div className="space-y-1.5">
                {soal.explanation.steps.map((step, si) => (
                  <div key={si} className="flex gap-2 items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">{si + 1}</span>
                    <p className="text-xs text-cyan-50/90 font-body leading-relaxed"><MathText text={step} /></p>
                  </div>
                ))}
              </div>
            </div>
            {/* ─── Tips ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20 mb-2.5" style={{background:"linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
              <div className="font-body text-xs text-amber-50/90 leading-relaxed">
                {soal.explanation.formula ? <MathText text={soal.explanation.formula} /> : "Kuasai konsep utama dan latih langkah penyelesaian secara berurutan. Verifikasi jawaban dengan substitusi kembali ke soal."}
              </div>
            </div>
            {/* ─── Kesimpulan ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20" style={{background:"linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
              <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
                Jadi, jawaban yang tepat adalah{" "}
                <span className="font-bold text-rose-200">
                  {soal.correctAnswer ? <MathText text={Array.isArray(soal.correctAnswer) ? soal.correctAnswer.join(", ") : soal.correctAnswer} /> : "lihat kunci jawaban di atas"}
                </span>.
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

/* ── Main Page ── */
const PeluangPage = () => {
  const navigate = useNavigate();
  const [filterDiff, setFilterDiff] = useState<string>("Semua");
  const [filterType, setFilterType] = useState<string>("Semua");
  const [filterCat, setFilterCat] = useState<string>("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const difficulties = ["Semua", "Mudah", "Sedang", "Sulit"];
  const types = ["Semua", "PG", "MCMA", "Benar/Salah"];
  const categories = ["Semua", ...Array.from(new Set(questionsData.map(q => q.category)))];

  const filtered = questionsData.filter(q =>
    (filterDiff === "Semua" || q.difficulty === filterDiff) &&
    (filterType === "Semua" || q.type === filterType) &&
    (filterCat === "Semua" || q.category === filterCat)
  );

  const mudahCount = questionsData.filter(q => q.difficulty === "Mudah").length;
  const sedangCount = questionsData.filter(q => q.difficulty === "Sedang").length;
  const sulitCount = questionsData.filter(q => q.difficulty === "Sulit").length;
  const pgCount = questionsData.filter(q => q.type === "PG").length;
  const mcmaCount = questionsData.filter(q => q.type === "MCMA").length;
  const bsCount = questionsData.filter(q => q.type === "Benar/Salah").length;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden py-8">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" onPrev={() => { playPopSound(); navigate("/bank-soal"); }} />

      <div className="relative z-10 max-w-3xl w-full px-4 mt-16">
        <div className="text-center mb-6">
          <Dices className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-cyan-400 mb-2 tracking-wide" style={{ textShadow: "0 0 20px rgba(34,211,238,0.5)" }}>
            BANK SOAL PELUANG
          </h1>
          <p className="text-white/60 text-sm font-mono mb-1">
            Ruang Sampel · Peluang Teoritik · Komplemen · Frekuensi Harapan · Gabungan & Irisan
          </p>
          <p className="text-white/40 text-xs font-mono">
            100 Soal · UN / TKA / HOTS / ANBK / Olimpiade · PG + MCMA + Benar/Salah · Dengan Pembahasan
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-xs border border-emerald-400/40 bg-emerald-400/10 text-emerald-400 rounded-full px-3 py-1 font-mono">{mudahCount} Mudah</span>
            <span className="text-xs border border-amber-400/40 bg-amber-400/10 text-amber-400 rounded-full px-3 py-1 font-mono">{sedangCount} Sedang</span>
            <span className="text-xs border border-red-400/40 bg-red-400/10 text-red-400 rounded-full px-3 py-1 font-mono">{sulitCount} Sulit</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="text-xs border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 rounded-full px-3 py-1 font-mono">{pgCount} PG</span>
            <span className="text-xs border border-purple-400/40 bg-purple-400/10 text-purple-400 rounded-full px-3 py-1 font-mono">{mcmaCount} MCMA</span>
            <span className="text-xs border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 rounded-full px-3 py-1 font-mono">{bsCount} B/S</span>
            <span className="text-xs border border-slate-500 bg-slate-800 text-slate-300 rounded-full px-3 py-1 font-mono">Total: {questionsData.length} Soal</span>
          </div>
        </div>

        <div className="mb-6">
          <button onClick={() => { playPopSound(); setShowFilter(!showFilter); }}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full border border-slate-600 bg-slate-800/60 text-slate-300 text-sm font-mono hover:border-cyan-500 transition-colors">
            <Filter size={14} /> Filter Soal {showFilter ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </button>

          {showFilter && (
            <div className="mt-3 p-4 rounded-xl border border-slate-700 bg-slate-900/60 space-y-3">
              <div>
                <p className="text-xs text-slate-400 font-mono mb-2">Kesulitan:</p>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(d => (
                    <button key={d} onClick={() => { playPopSound(); setFilterDiff(d); }}
                      className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${filterDiff === d ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "border-slate-600 text-slate-400 hover:border-slate-400"}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono mb-2">Tipe Soal:</p>
                <div className="flex flex-wrap gap-2">
                  {types.map(t => (
                    <button key={t} onClick={() => { playPopSound(); setFilterType(t); }}
                      className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${filterType === t ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "border-slate-600 text-slate-400 hover:border-slate-400"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono mb-2">Kategori:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <button key={c} onClick={() => { playPopSound(); setFilterCat(c); }}
                      className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${filterCat === c ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "border-slate-600 text-slate-400 hover:border-slate-400"}`}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-slate-400 font-mono py-12">Tidak ada soal yang sesuai filter.</div>
        ) : (
          <div>
            <p className="text-xs text-slate-500 font-mono mb-4 text-center">Menampilkan {filtered.length} soal</p>
            {filtered.map((soal, idx) => (
              <SoalCard key={soal.id} soal={soal} number={idx + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeluangPage;
