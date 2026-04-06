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
  /* ══════════ MUDAH (1–35) ══════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah koin dilempar satu kali. Ruang sampelnya adalah S = {A, G}. Banyaknya titik sampel adalah ...",
    svgKey: "koin-1",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Ruang sampel adalah himpunan semua hasil yang mungkin.",
      steps: ["Koin memiliki 2 sisi: Angka (A) dan Gambar (G)", "S = {A, G}", "n(S) = 2"],
      formula: "n(S) = 2"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah dadu bermata 6 dilempar satu kali. Banyaknya anggota ruang sampel adalah ...",
    svgKey: "dadu-prima",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "D. 6",
    explanation: {
      concept: "Dadu bermata 6 memiliki 6 kemungkinan hasil.",
      steps: ["S = {1, 2, 3, 4, 5, 6}", "n(S) = 6"],
      formula: "n(S) = 6"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah dadu dilempar satu kali. Peluang muncul bilangan prima adalah ...",
    svgKey: "dadu-prima",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{3}$", "C. $\\frac{1}{2}$", "D. $\\frac{2}{3}$"],
    correctAnswer: "C. $\\frac{1}{2}$",
    explanation: {
      concept: "Bilangan prima antara 1–6 adalah 2, 3, dan 5.",
      steps: ["A = {2, 3, 5}", "n(A) = 3", "$P(A) = \\dfrac{n(A)}{n(S)} = \\dfrac{3}{6} = \\dfrac{1}{2}$"],
      formula: "P(A) = \\frac{n(A)}{n(S)}"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah dadu dilempar satu kali. Peluang muncul bilangan genap adalah ...",
    svgKey: "dadu-genap",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{5}{6}$"],
    correctAnswer: "B. $\\frac{1}{2}$",
    explanation: {
      concept: "Bilangan genap pada dadu: 2, 4, 6.",
      steps: ["A = {2, 4, 6}", "n(A) = 3", "$P(A) = \\dfrac{3}{6} = \\dfrac{1}{2}$"],
      formula: "P(\\text{genap}) = \\frac{1}{2}"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada pelemparan sebuah dadu bermata 6, peluang muncul mata dadu lebih dari 4 adalah ...",
    svgKey: "dadu-besar4",
    options: ["A. $\\frac{1}{3}$", "B. $\\frac{1}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{5}{6}$"],
    correctAnswer: "A. $\\frac{1}{3}$",
    explanation: {
      concept: "Mata dadu > 4 adalah: 5 dan 6.",
      steps: ["A = {5, 6}", "n(A) = 2", "$P(A) = \\dfrac{2}{6} = \\dfrac{1}{3}$"],
      formula: ""
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah kantong berisi 3 bola merah dan 2 bola biru. Jika satu bola diambil secara acak, peluang terambil bola merah adalah ...",
    svgKey: "marble-3r2b",
    options: ["A. $\\frac{1}{5}$", "B. $\\frac{3}{5}$", "C. $\\frac{2}{5}$", "D. $\\frac{4}{5}$"],
    correctAnswer: "B. $\\frac{3}{5}$",
    explanation: {
      concept: "P(merah) = banyak bola merah / total bola.",
      steps: ["n(merah) = 3", "n(S) = 3 + 2 = 5", "$P(\\text{merah}) = \\dfrac{3}{5}$"],
      formula: "P = \\frac{n(A)}{n(S)}"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Diketahui $P(A) = 0{,}4$. Maka nilai $P(A^c)$ (komplemen A) adalah ...",
    options: ["A. 0,4", "B. 0,5", "C. 0,6", "D. 1,4"],
    correctAnswer: "C. 0,6",
    explanation: {
      concept: "P(Ac) = 1 − P(A) karena jumlah peluang suatu kejadian dan komplementnya selalu 1.",
      steps: ["$P(A^c) = 1 - P(A)$", "$P(A^c) = 1 - 0{,}4 = 0{,}6$"],
      formula: "P(A^c) = 1 - P(A)"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Suatu kejadian memiliki peluang $\\frac{1}{3}$. Jika percobaan dilakukan 60 kali, maka frekuensi harapan kejadian tersebut adalah ...",
    svgKey: "frek-60-1o3",
    options: ["A. 15", "B. 20", "C. 25", "D. 30"],
    correctAnswer: "B. 20",
    explanation: {
      concept: "Frekuensi harapan = P(A) × n.",
      steps: ["$f_h = P(A) \\times n$", "$f_h = \\dfrac{1}{3} \\times 60 = 20$"],
      formula: "f_h = P(A) \\times n"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Dua koin dilempar bersamaan. Banyaknya anggota ruang sampel adalah ...",
    svgKey: "koin-2",
    options: ["A. 2", "B. 3", "C. 4", "D. 8"],
    correctAnswer: "C. 4",
    explanation: {
      concept: "Ruang sampel 2 koin: S = {AA, AG, GA, GG}.",
      steps: ["S = {AA, AG, GA, GG}", "n(S) = 4"],
      formula: "n(S) = 2^2 = 4"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Dua koin dilempar bersamaan. Peluang muncul dua angka (AA) adalah ...",
    svgKey: "koin-2",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{2}$", "C. $\\frac{3}{4}$", "D. 1"],
    correctAnswer: "A. $\\frac{1}{4}$",
    explanation: {
      concept: "S = {AA, AG, GA, GG}. Kejadian AA hanya 1 anggota.",
      steps: ["n(AA) = 1", "n(S) = 4", "$P(AA) = \\dfrac{1}{4}$"],
      formula: ""
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Dua koin dilempar bersamaan. Peluang muncul minimal satu angka (A) adalah ...",
    svgKey: "koin-2",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{3}{4}$"],
    correctAnswer: "D. $\\frac{3}{4}$",
    explanation: {
      concept: "Minimal satu A: {AA, AG, GA} — ada 3 kemungkinan.",
      steps: ["A = {AA, AG, GA}", "n(A) = 3", "$P(A) = \\dfrac{3}{4}$"],
      formula: ""
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah dadu dilempar sekali. Peluang muncul faktor dari 6 adalah ...",
    svgKey: "dadu-faktor6",
    options: ["A. $\\frac{1}{3}$", "B. $\\frac{1}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{5}{6}$"],
    correctAnswer: "C. $\\frac{2}{3}$",
    explanation: {
      concept: "Faktor dari 6 adalah bilangan yang membagi habis 6: 1, 2, 3, 6.",
      steps: ["A = {1, 2, 3, 6}", "n(A) = 4", "$P(A) = \\dfrac{4}{6} = \\dfrac{2}{3}$"],
      formula: ""
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Dalam satu kelas terdapat 20 siswa: 8 perempuan dan 12 laki-laki. Jika satu siswa dipilih secara acak, peluang terpilih siswa perempuan adalah ...",
    options: ["A. $\\frac{1}{5}$", "B. $\\frac{2}{5}$", "C. $\\frac{3}{5}$", "D. $\\frac{4}{5}$"],
    correctAnswer: "B. $\\frac{2}{5}$",
    explanation: {
      concept: "P(perempuan) = jumlah perempuan / total siswa.",
      steps: ["n(perempuan) = 8", "n(S) = 20", "$P = \\dfrac{8}{20} = \\dfrac{2}{5}$"],
      formula: ""
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Prakiraan cuaca menyatakan peluang hujan besok adalah 0,35. Maka peluang TIDAK hujan besok adalah ...",
    options: ["A. 0,35", "B. 0,50", "C. 0,65", "D. 0,75"],
    correctAnswer: "C. 0,65",
    explanation: {
      concept: "P(tidak hujan) = 1 − P(hujan).",
      steps: ["$P(\\text{tidak hujan}) = 1 - 0{,}35 = 0{,}65$"],
      formula: "P(A^c) = 1 - P(A)"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah dadu dilempar 120 kali. Frekuensi harapan muncul angka 6 adalah ...",
    svgKey: "frek-120-1o6",
    options: ["A. 10", "B. 20", "C. 30", "D. 40"],
    correctAnswer: "B. 20",
    explanation: {
      concept: "P(angka 6) = 1/6. Frekuensi harapan = P × n.",
      steps: ["$f_h = \\dfrac{1}{6} \\times 120 = 20$"],
      formula: ""
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Empirik",
    question: "Sebuah koin dilempar 50 kali dan muncul angka (A) sebanyak 28 kali. Peluang empirik muncul angka adalah ...",
    options: ["A. $\\frac{11}{25}$", "B. $\\frac{13}{25}$", "C. $\\frac{14}{25}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "C. $\\frac{14}{25}$",
    explanation: {
      concept: "Peluang empirik = frekuensi kejadian / banyak percobaan.",
      steps: ["$P_{\\text{empirik}} = \\dfrac{28}{50} = \\dfrac{14}{25}$"],
      formula: "P_{\\text{empirik}} = \\frac{f}{n}"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Dari kartu bernomor 1 sampai 10, dipilih satu kartu secara acak. Peluang terambil kartu bernomor ganjil adalah ...",
    options: ["A. $\\frac{2}{5}$", "B. $\\frac{1}{2}$", "C. $\\frac{3}{5}$", "D. $\\frac{7}{10}$"],
    correctAnswer: "B. $\\frac{1}{2}$",
    explanation: {
      concept: "Bilangan ganjil dari 1–10: 1, 3, 5, 7, 9.",
      steps: ["A = {1, 3, 5, 7, 9}", "n(A) = 5", "$P = \\dfrac{5}{10} = \\dfrac{1}{2}$"],
      formula: ""
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah kotak berisi 4 bola merah dan 6 bola putih. Peluang terambil bola yang bukan merah adalah ...",
    svgKey: "marble-4r6p",
    options: ["A. $\\frac{2}{5}$", "B. $\\frac{1}{2}$", "C. $\\frac{3}{5}$", "D. $\\frac{4}{5}$"],
    correctAnswer: "C. $\\frac{3}{5}$",
    explanation: {
      concept: "Bukan merah = putih. P(putih) = 6/10.",
      steps: ["n(putih) = 6", "n(S) = 10", "$P(\\text{bukan merah}) = \\dfrac{6}{10} = \\dfrac{3}{5}$"],
      formula: ""
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Dua buah dadu dilempar bersamaan. Banyaknya anggota ruang sampelnya adalah ...",
    svgKey: "dua-dadu-7",
    options: ["A. 12", "B. 18", "C. 24", "D. 36"],
    correctAnswer: "D. 36",
    explanation: {
      concept: "Setiap dadu memiliki 6 kemungkinan, sehingga 2 dadu menghasilkan 6×6 = 36 titik sampel.",
      steps: ["n(S) = 6 × 6 = 36"],
      formula: "n(S) = 6^2 = 36"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah kantong berisi 5 bola merah, 3 bola putih, dan 2 bola hijau. Peluang terambil bola putih adalah ...",
    svgKey: "marble-5r3p2h",
    options: ["A. $\\frac{1}{5}$", "B. $\\frac{3}{10}$", "C. $\\frac{2}{5}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "B. $\\frac{3}{10}$",
    explanation: {
      concept: "n(S) = 5 + 3 + 2 = 10.",
      steps: ["n(putih) = 3", "n(S) = 10", "$P(\\text{putih}) = \\dfrac{3}{10}$"],
      formula: ""
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Pada pelemparan satu dadu, peluang muncul bilangan yang bukan prima adalah ...",
    svgKey: "dadu-genap",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{5}{6}$"],
    correctAnswer: "B. $\\frac{1}{2}$",
    explanation: {
      concept: "Prima: {2,3,5}. Bukan prima: {1,4,6}.",
      steps: ["P(prima) = 3/6 = 1/2", "$P(\\text{bukan prima}) = 1 - \\dfrac{1}{2} = \\dfrac{1}{2}$"],
      formula: "P(A^c) = 1 - P(A)"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Peluang suatu kejadian adalah $\\frac{2}{5}$. Jika percobaan dilakukan 200 kali, frekuensi harapannya adalah ...",
    svgKey: "frek-200-2o5",
    options: ["A. 40", "B. 60", "C. 80", "D. 100"],
    correctAnswer: "C. 80",
    explanation: {
      concept: "f_h = P(A) × n.",
      steps: ["$f_h = \\dfrac{2}{5} \\times 200 = 80$"],
      formula: ""
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah dadu dilempar satu kali. Peluang muncul angka 1 adalah ...",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{4}$", "C. $\\frac{1}{3}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "A. $\\frac{1}{6}$",
    explanation: {
      concept: "Hanya 1 dari 6 sisi yang menunjukkan angka 1.",
      steps: ["n(angka 1) = 1", "n(S) = 6", "$P = \\dfrac{1}{6}$"],
      formula: ""
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Dalam sebuah kotak terdapat 4 bola merah dan 6 bola putih. Peluang terambil bola putih adalah ...",
    svgKey: "marble-4r6p",
    options: ["A. $\\frac{2}{5}$", "B. $\\frac{1}{2}$", "C. $\\frac{3}{5}$", "D. $\\frac{4}{5}$"],
    correctAnswer: "C. $\\frac{3}{5}$",
    explanation: {
      concept: "P(putih) = 6/10.",
      steps: ["$P(\\text{putih}) = \\dfrac{6}{10} = \\dfrac{3}{5}$"],
      formula: ""
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Empirik",
    question: "Koin dilempar 200 kali. Muncul gambar (G) sebanyak 90 kali. Peluang empirik muncul gambar adalah ...",
    options: ["A. $\\frac{2}{5}$", "B. $\\frac{9}{20}$", "C. $\\frac{1}{2}$", "D. $\\frac{11}{20}$"],
    correctAnswer: "B. $\\frac{9}{20}$",
    explanation: {
      concept: "P empirik = f/n.",
      steps: ["$P_{\\text{empirik}} = \\dfrac{90}{200} = \\dfrac{9}{20}$"],
      formula: ""
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah dadu dilempar sekali. Peluang muncul kelipatan 3 adalah ...",
    svgKey: "dadu-kelipatan3",
    options: ["A. $\\frac{1}{3}$", "B. $\\frac{1}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{5}{6}$"],
    correctAnswer: "A. $\\frac{1}{3}$",
    explanation: {
      concept: "Kelipatan 3 pada dadu: 3 dan 6.",
      steps: ["A = {3, 6}", "n(A) = 2", "$P = \\dfrac{2}{6} = \\dfrac{1}{3}$"],
      formula: ""
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Diketahui $P(A) = \\frac{3}{7}$. Nilai $P(A^c)$ adalah ...",
    options: ["A. $\\frac{3}{7}$", "B. $\\frac{4}{7}$", "C. $\\frac{5}{7}$", "D. $\\frac{7}{3}$"],
    correctAnswer: "B. $\\frac{4}{7}$",
    explanation: {
      concept: "P(Ac) = 1 − P(A).",
      steps: ["$P(A^c) = 1 - \\dfrac{3}{7} = \\dfrac{7}{7} - \\dfrac{3}{7} = \\dfrac{4}{7}$"],
      formula: ""
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Dari 52 kartu bridge, satu kartu diambil secara acak. Peluang terambil kartu As adalah ...",
    svgKey: "kartu-bridge",
    options: ["A. $\\frac{1}{52}$", "B. $\\frac{1}{26}$", "C. $\\frac{1}{13}$", "D. $\\frac{1}{4}$"],
    correctAnswer: "C. $\\frac{1}{13}$",
    explanation: {
      concept: "Dalam 52 kartu bridge, terdapat 4 kartu As (satu tiap suit).",
      steps: ["n(As) = 4", "n(S) = 52", "$P = \\dfrac{4}{52} = \\dfrac{1}{13}$"],
      formula: ""
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah koin dilempar 300 kali. Frekuensi harapan muncul angka (A) adalah ...",
    svgKey: "frek-300-1o2",
    options: ["A. 100", "B. 120", "C. 150", "D. 200"],
    correctAnswer: "C. 150",
    explanation: {
      concept: "P(A) = 1/2, frekuensi harapan = P × n.",
      steps: ["$f_h = \\dfrac{1}{2} \\times 300 = 150$"],
      formula: ""
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Dalam daftar hadir 30 siswa, 12 siswa tidak hadir. Jika satu nama dipilih acak, peluang terpilih siswa yang hadir adalah ...",
    options: ["A. $\\frac{2}{5}$", "B. $\\frac{1}{2}$", "C. $\\frac{3}{5}$", "D. $\\frac{4}{5}$"],
    correctAnswer: "C. $\\frac{3}{5}$",
    explanation: {
      concept: "Hadir = 30 − 12 = 18 siswa.",
      steps: ["n(hadir) = 30 - 12 = 18", "$P = \\dfrac{18}{30} = \\dfrac{3}{5}$"],
      formula: ""
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah dadu dilempar sekali. Peluang muncul bilangan kurang dari 4 adalah ...",
    svgKey: "dadu-kecil4",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{5}{6}$"],
    correctAnswer: "B. $\\frac{1}{2}$",
    explanation: {
      concept: "Bilangan < 4 pada dadu: 1, 2, 3.",
      steps: ["A = {1, 2, 3}", "n(A) = 3", "$P = \\dfrac{3}{6} = \\dfrac{1}{2}$"],
      formula: ""
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah spinner (roda putar) dibagi menjadi 4 bagian sama besar berwarna merah, biru, hijau, dan kuning. Peluang jarum berhenti di bagian merah adalah ...",
    svgKey: "spinner-4",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{3}$", "C. $\\frac{1}{2}$", "D. $\\frac{3}{4}$"],
    correctAnswer: "A. $\\frac{1}{4}$",
    explanation: {
      concept: "4 bagian sama besar → P(satu bagian) = 1/4.",
      steps: ["$P(\\text{merah}) = \\dfrac{1}{4}$"],
      formula: ""
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Dasar Peluang",
    question: "Nilai peluang suatu kejadian A yang paling tepat adalah ...",
    options: ["A. $P(A) = -0{,}5$", "B. $P(A) = 1{,}2$", "C. $P(A) = 0{,}85$", "D. $P(A) = \\frac{5}{4}$"],
    correctAnswer: "C. $P(A) = 0{,}85$",
    explanation: {
      concept: "Nilai peluang selalu berada antara 0 dan 1 (inklusif): 0 ≤ P(A) ≤ 1.",
      steps: ["A: P = −0,5 → tidak valid (< 0)", "B: P = 1,2 → tidak valid (> 1)", "C: P = 0,85 → valid", "D: P = 5/4 = 1,25 → tidak valid"],
      formula: "0 \\leq P(A) \\leq 1"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "UN",
    question: "Sebuah kotak berisi 4 bola merah, 3 bola kuning, dan 3 bola biru. Peluang terambil bola kuning adalah ...",
    svgKey: "marble-5r3k",
    options: ["A. $\\frac{1}{5}$", "B. $\\frac{3}{10}$", "C. $\\frac{2}{5}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "B. $\\frac{3}{10}$",
    explanation: {
      concept: "n(S) = 4 + 3 + 3 = 10.",
      steps: ["n(kuning) = 3", "n(S) = 10", "$P = \\dfrac{3}{10}$"],
      formula: ""
    }
  },
  {
    id: 35, type: "Benar/Salah", difficulty: "Mudah", category: "Dasar Peluang",
    question: "Tentukan benar atau salah setiap pernyataan berikut tentang peluang:",
    statements: [
      { text: "Peluang kejadian pasti (certain event) bernilai 1.", isCorrect: true },
      { text: "Peluang kejadian mustahil (impossible event) bernilai −1.", isCorrect: false },
      { text: "Jika P(A) = 0,7 maka P(Ac) = 0,3.", isCorrect: true },
      { text: "Peluang suatu kejadian dapat bernilai lebih dari 1.", isCorrect: false },
    ],
    explanation: {
      concept: "Sifat-sifat dasar peluang.",
      steps: [
        "Kejadian pasti: P = 1 (benar)",
        "Kejadian mustahil: P = 0, bukan −1 (salah)",
        "P(Ac) = 1 − P(A) = 1 − 0,7 = 0,3 (benar)",
        "0 ≤ P(A) ≤ 1, tidak bisa > 1 (salah)",
      ],
      formula: "0 \\leq P(A) \\leq 1"
    }
  },

  /* ══════════ SEDANG (36–75) ══════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dua buah dadu dilempar bersamaan. Peluang muncul jumlah mata dadu sama dengan 7 adalah ...",
    svgKey: "dua-dadu-7",
    options: ["A. $\\frac{1}{9}$", "B. $\\frac{1}{8}$", "C. $\\frac{1}{6}$", "D. $\\frac{5}{36}$"],
    correctAnswer: "C. $\\frac{1}{6}$",
    explanation: {
      concept: "Jumlah = 7: (1,6),(6,1),(2,5),(5,2),(3,4),(4,3) — ada 6 pasangan.",
      steps: ["n(jumlah=7) = 6", "n(S) = 36", "$P = \\dfrac{6}{36} = \\dfrac{1}{6}$"],
      formula: ""
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dua buah dadu dilempar bersamaan. Peluang muncul jumlah mata dadu sama dengan 10 adalah ...",
    svgKey: "dua-dadu-10",
    options: ["A. $\\frac{1}{36}$", "B. $\\frac{1}{12}$", "C. $\\frac{1}{9}$", "D. $\\frac{1}{6}$"],
    correctAnswer: "B. $\\frac{1}{12}$",
    explanation: {
      concept: "Jumlah = 10: (4,6),(6,4),(5,5) — ada 3 pasangan.",
      steps: ["n(jumlah=10) = 3", "$P = \\dfrac{3}{36} = \\dfrac{1}{12}$"],
      formula: ""
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dua buah dadu dilempar bersamaan. Peluang muncul jumlah mata dadu sama dengan 2 adalah ...",
    svgKey: "dua-dadu-2",
    options: ["A. $\\frac{1}{36}$", "B. $\\frac{1}{18}$", "C. $\\frac{1}{12}$", "D. $\\frac{1}{9}$"],
    correctAnswer: "A. $\\frac{1}{36}$",
    explanation: {
      concept: "Jumlah = 2 hanya bisa dengan (1,1).",
      steps: ["n(jumlah=2) = 1", "$P = \\dfrac{1}{36}$"],
      formula: ""
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Dua buah dadu dilempar bersamaan. Peluang jumlah mata dadu lebih dari 9 adalah ...",
    svgKey: "dua-dadu-gt9",
    options: ["A. $\\frac{1}{12}$", "B. $\\frac{1}{9}$", "C. $\\frac{1}{6}$", "D. $\\frac{5}{18}$"],
    correctAnswer: "C. $\\frac{1}{6}$",
    explanation: {
      concept: "Jumlah > 9: jumlah = 10, 11, atau 12.",
      steps: [
        "Jumlah 10: (4,6),(6,4),(5,5) → 3",
        "Jumlah 11: (5,6),(6,5) → 2",
        "Jumlah 12: (6,6) → 1",
        "Total = 6",
        "$P = \\dfrac{6}{36} = \\dfrac{1}{6}$"
      ],
      formula: ""
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dua koin dilempar bersamaan. Peluang muncul tepat satu angka (A) adalah ...",
    svgKey: "koin-2",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{2}$", "C. $\\frac{3}{4}$", "D. 1"],
    correctAnswer: "B. $\\frac{1}{2}$",
    explanation: {
      concept: "Tepat satu A: {AG, GA} — ada 2 kejadian dari 4.",
      steps: ["A = {AG, GA}", "n(A) = 2", "$P = \\dfrac{2}{4} = \\dfrac{1}{2}$"],
      formula: ""
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Diketahui $P(A) = 0{,}5$, $P(B) = 0{,}4$, dan $P(A \\cap B) = 0{,}2$. Nilai $P(A \\cup B)$ adalah ...",
    svgKey: "venn-ab",
    options: ["A. 0,5", "B. 0,6", "C. 0,7", "D. 0,9"],
    correctAnswer: "C. 0,7",
    explanation: {
      concept: "Rumus gabungan dua kejadian.",
      steps: ["$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$", "$= 0{,}5 + 0{,}4 - 0{,}2 = 0{,}7$"],
      formula: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Kejadian A dan B saling lepas. Jika $P(A) = \\frac{1}{3}$ dan $P(B) = \\frac{1}{4}$, maka $P(A \\cup B)$ adalah ...",
    options: ["A. $\\frac{1}{12}$", "B. $\\frac{7}{12}$", "C. $\\frac{5}{12}$", "D. $\\frac{3}{4}$"],
    correctAnswer: "B. $\\frac{7}{12}$",
    explanation: {
      concept: "Saling lepas: P(A∩B) = 0, sehingga P(A∪B) = P(A) + P(B).",
      steps: ["$P(A \\cup B) = \\dfrac{1}{3} + \\dfrac{1}{4} = \\dfrac{4}{12} + \\dfrac{3}{12} = \\dfrac{7}{12}$"],
      formula: "P(A \\cup B) = P(A) + P(B) \\text{ (saling lepas)}"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Satu dadu dan satu koin dilempar bersamaan. Banyaknya anggota ruang sampel adalah ...",
    svgKey: "dadu-koin",
    options: ["A. 6", "B. 8", "C. 12", "D. 36"],
    correctAnswer: "C. 12",
    explanation: {
      concept: "n(S) = jumlah kemungkinan dadu × jumlah kemungkinan koin = 6 × 2.",
      steps: ["n(S) = 6 × 2 = 12"],
      formula: "n(S) = n_1 \\times n_2"
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Satu dadu dan satu koin dilempar bersamaan. Peluang muncul angka genap pada dadu dan gambar (G) pada koin adalah ...",
    svgKey: "dadu-koin",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{3}$", "C. $\\frac{5}{12}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "A. $\\frac{1}{4}$",
    explanation: {
      concept: "Genap dadu: {2,4,6}; Gambar koin: {G}. Kombinasi = 3 pasangan.",
      steps: ["n(genap, G) = 3 × 1 = 3", "n(S) = 12", "$P = \\dfrac{3}{12} = \\dfrac{1}{4}$"],
      formula: ""
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Dua buah dadu dilempar bersamaan. Peluang jumlah mata dadu merupakan bilangan prima adalah ...",
    svgKey: "dua-dadu-prima",
    options: ["A. $\\frac{5}{18}$", "B. $\\frac{5}{12}$", "C. $\\frac{7}{18}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "B. $\\frac{5}{12}$",
    explanation: {
      concept: "Bilangan prima antara 2–12: 2, 3, 5, 7, 11.",
      steps: [
        "Jumlah=2: (1,1) → 1",
        "Jumlah=3: (1,2),(2,1) → 2",
        "Jumlah=5: (1,4),(4,1),(2,3),(3,2) → 4",
        "Jumlah=7: (1,6),(6,1),(2,5),(5,2),(3,4),(4,3) → 6",
        "Jumlah=11: (5,6),(6,5) → 2",
        "Total = 15",
        "$P = \\dfrac{15}{36} = \\dfrac{5}{12}$"
      ],
      formula: ""
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah pabrik memproduksi lampu dengan peluang cacat 0,02. Jika diproduksi 1.000 lampu, frekuensi harapan lampu yang cacat adalah ...",
    options: ["A. 10", "B. 20", "C. 50", "D. 100"],
    correctAnswer: "B. 20",
    explanation: {
      concept: "Frekuensi harapan = P × n.",
      steps: ["$f_h = 0{,}02 \\times 1000 = 20$"],
      formula: ""
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "Empirik",
    question: "Koin dilempar 200 kali. Muncul angka sebanyak 110 kali. Peluang empirik muncul angka adalah ...",
    options: ["A. $\\frac{9}{20}$", "B. $\\frac{1}{2}$", "C. $\\frac{11}{20}$", "D. $\\frac{3}{5}$"],
    correctAnswer: "C. $\\frac{11}{20}$",
    explanation: {
      concept: "P empirik = frekuensi/n.",
      steps: ["$P_{\\text{empirik}} = \\dfrac{110}{200} = \\dfrac{11}{20}$"],
      formula: ""
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Dari 52 kartu bridge, satu kartu diambil secara acak. Peluang terambil kartu yang BUKAN As adalah ...",
    svgKey: "kartu-bridge",
    options: ["A. $\\frac{1}{13}$", "B. $\\frac{1}{4}$", "C. $\\frac{12}{13}$", "D. $\\frac{3}{4}$"],
    correctAnswer: "C. $\\frac{12}{13}$",
    explanation: {
      concept: "P(bukan As) = 1 − P(As).",
      steps: ["$P(\\text{bukan As}) = 1 - \\dfrac{4}{52} = \\dfrac{48}{52} = \\dfrac{12}{13}$"],
      formula: ""
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dalam sebuah kotak terdapat 12 kartu bernomor 1–12. Peluang terambil kartu bernomor kelipatan 4 adalah ...",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{4}$", "C. $\\frac{1}{3}$", "D. $\\frac{5}{12}$"],
    correctAnswer: "B. $\\frac{1}{4}$",
    explanation: {
      concept: "Kelipatan 4 dari 1–12: 4, 8, 12.",
      steps: ["n(kelipatan 4) = 3", "n(S) = 12", "$P = \\dfrac{3}{12} = \\dfrac{1}{4}$"],
      formula: ""
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dua buah dadu dilempar bersamaan. Peluang muncul jumlah mata dadu sama dengan 8 adalah ...",
    svgKey: "dua-dadu-8",
    options: ["A. $\\frac{1}{9}$", "B. $\\frac{5}{36}$", "C. $\\frac{1}{6}$", "D. $\\frac{7}{36}$"],
    correctAnswer: "B. $\\frac{5}{36}$",
    explanation: {
      concept: "Jumlah = 8: (2,6),(6,2),(3,5),(5,3),(4,4) — ada 5 pasangan.",
      steps: ["n(jumlah=8) = 5", "$P = \\dfrac{5}{36}$"],
      formula: ""
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah spinner dibagi 3 sektor: merah (120°), biru (90°), hijau (150°). Peluang jarum berhenti di sektor merah adalah ...",
    svgKey: "spinner-3",
    options: ["A. $\\frac{1}{3}$", "B. $\\frac{1}{4}$", "C. $\\frac{5}{12}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "A. $\\frac{1}{3}$",
    explanation: {
      concept: "P(sektor) = sudut sektor / 360°.",
      steps: ["$P(\\text{merah}) = \\dfrac{120°}{360°} = \\dfrac{1}{3}$"],
      formula: "P = \\frac{\\theta}{360°}"
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Diketahui $P(A) = 0{,}6$, $P(B) = 0{,}5$, dan $P(A \\cup B) = 0{,}8$. Nilai $P(A \\cap B)$ adalah ...",
    svgKey: "venn-ab",
    options: ["A. 0,2", "B. 0,3", "C. 0,4", "D. 0,5"],
    correctAnswer: "B. 0,3",
    explanation: {
      concept: "Gunakan rumus P(A∩B) = P(A) + P(B) − P(A∪B).",
      steps: ["$P(A \\cap B) = 0{,}6 + 0{,}5 - 0{,}8 = 0{,}3$"],
      formula: "P(A \\cap B) = P(A) + P(B) - P(A \\cup B)"
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dadu dilempar 180 kali. Peluang muncul bilangan prima adalah $\\frac{1}{2}$. Frekuensi harapan muncul bilangan prima adalah ...",
    svgKey: "frek-180-1o2",
    options: ["A. 60", "B. 72", "C. 90", "D. 120"],
    correctAnswer: "C. 90",
    explanation: {
      concept: "f_h = P × n.",
      steps: ["$f_h = \\dfrac{1}{2} \\times 180 = 90$"],
      formula: ""
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Dua dadu dilempar bersamaan. Peluang jumlah mata dadu minimal 10 adalah ...",
    svgKey: "dua-dadu-gt9",
    options: ["A. $\\frac{1}{12}$", "B. $\\frac{1}{9}$", "C. $\\frac{1}{6}$", "D. $\\frac{5}{18}$"],
    correctAnswer: "C. $\\frac{1}{6}$",
    explanation: {
      concept: "Minimal 10 berarti jumlah ≥ 10 (yaitu 10, 11, atau 12).",
      steps: [
        "Jumlah 10: 3 cara, Jumlah 11: 2 cara, Jumlah 12: 1 cara",
        "Total = 6",
        "$P = \\dfrac{6}{36} = \\dfrac{1}{6}$"
      ],
      formula: ""
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Diketahui $P(A) = 0{,}3$, $P(B) = 0{,}4$, dan $P(A \\cap B) = 0{,}1$. Nilai $P(A^c \\cap B^c)$ adalah ...",
    options: ["A. 0,3", "B. 0,4", "C. 0,5", "D. 0,6"],
    correctAnswer: "B. 0,4",
    explanation: {
      concept: "P(Ac ∩ Bc) = 1 − P(A∪B) = 1 − [P(A)+P(B)−P(A∩B)].",
      steps: [
        "$P(A \\cup B) = 0{,}3 + 0{,}4 - 0{,}1 = 0{,}6$",
        "$P(A^c \\cap B^c) = 1 - 0{,}6 = 0{,}4$"
      ],
      formula: "P(A^c \\cap B^c) = 1 - P(A \\cup B)"
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah kantong berisi 3 bola merah, 4 bola putih, dan 2 bola biru. Peluang terambil bola yang bukan biru adalah ...",
    svgKey: "marble-3r4b5h",
    options: ["A. $\\frac{2}{9}$", "B. $\\frac{4}{9}$", "C. $\\frac{7}{9}$", "D. $\\frac{8}{9}$"],
    correctAnswer: "C. $\\frac{7}{9}$",
    explanation: {
      concept: "Bukan biru = merah + putih = 3 + 4 = 7.",
      steps: ["n(bukan biru) = 7", "n(S) = 9", "$P = \\dfrac{7}{9}$"],
      formula: ""
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Sebuah dadu dilempar sekali. Peluang muncul bilangan ganjil DAN lebih dari 3 adalah ...",
    svgKey: "dadu-ganjil-besar3",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{3}$", "C. $\\frac{1}{2}$", "D. $\\frac{2}{3}$"],
    correctAnswer: "A. $\\frac{1}{6}$",
    explanation: {
      concept: "Ganjil = {1,3,5}; lebih dari 3 = {4,5,6}; irisannya = {5}.",
      steps: ["Ganjil ∩ (>3) = {5}", "n = 1", "$P = \\dfrac{1}{6}$"],
      formula: ""
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Dari 100 produk yang diperiksa, 5 di antaranya cacat. Peluang memilih produk yang tidak cacat adalah ...",
    options: ["A. $\\frac{1}{20}$", "B. $\\frac{9}{10}$", "C. $\\frac{19}{20}$", "D. $\\frac{99}{100}$"],
    correctAnswer: "C. $\\frac{19}{20}$",
    explanation: {
      concept: "Tidak cacat = 100 − 5 = 95.",
      steps: ["$P(\\text{tidak cacat}) = \\dfrac{95}{100} = \\dfrac{19}{20}$"],
      formula: ""
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dua koin dilempar bersamaan. Peluang muncul keduanya gambar (GG) adalah ...",
    svgKey: "koin-2",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{2}$", "C. $\\frac{3}{4}$", "D. 1"],
    correctAnswer: "A. $\\frac{1}{4}$",
    explanation: {
      concept: "S = {AA, AG, GA, GG}. GG hanya 1 anggota.",
      steps: ["n(GG) = 1", "n(S) = 4", "$P = \\dfrac{1}{4}$"],
      formula: ""
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Dua dadu dilempar. Peluang salah satu dadu menunjukkan angka 4 adalah ...",
    svgKey: "dua-dadu-8",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{5}{18}$", "C. $\\frac{11}{36}$", "D. $\\frac{1}{3}$"],
    correctAnswer: "C. $\\frac{11}{36}$",
    explanation: {
      concept: "Dadu 1 = 4 OR dadu 2 = 4, kurangi yang keduanya = 4.",
      steps: [
        "Dadu1=4: {(4,1),(4,2),(4,3),(4,4),(4,5),(4,6)} = 6",
        "Dadu2=4: {(1,4),(2,4),(3,4),(4,4),(5,4),(6,4)} = 6",
        "Keduanya=4: {(4,4)} = 1",
        "$P = \\dfrac{6+6-1}{36} = \\dfrac{11}{36}$"
      ],
      formula: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)"
    }
  },
  {
    id: 61, type: "MCMA", difficulty: "Sedang", category: "TKA",
    question: "Diketahui A dan B adalah dua kejadian dalam ruang sampel S. Pilih SEMUA pernyataan yang benar!",
    options: [
      "A. $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$",
      "B. Jika A dan B saling lepas, maka $P(A \\cap B) = 0$",
      "C. $P(A^c) = P(A)$",
      "D. $0 \\leq P(A) \\leq 1$ untuk setiap kejadian A"
    ],
    correctAnswer: "A, B, D",
    explanation: {
      concept: "Sifat-sifat peluang.",
      steps: [
        "A: Rumus gabungan → Benar",
        "B: Saling lepas → P(A∩B) = 0 → Benar",
        "C: P(Ac) = 1 − P(A) ≠ P(A) secara umum → Salah",
        "D: Nilai peluang selalu antara 0 dan 1 → Benar"
      ],
      formula: ""
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Peluang hujan pada hari Senin adalah 0,4 dan pada hari Selasa adalah 0,3 (kejadian bebas). Peluang hujan PADA KEDUA hari tersebut adalah ...",
    options: ["A. 0,10", "B. 0,12", "C. 0,58", "D. 0,70"],
    correctAnswer: "B. 0,12",
    explanation: {
      concept: "Untuk kejadian bebas, P(A∩B) = P(A) × P(B).",
      steps: ["$P = 0{,}4 \\times 0{,}3 = 0{,}12$"],
      formula: "P(A \\cap B) = P(A) \\times P(B) \\text{ (kejadian bebas)}"
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dua dadu dilempar bersamaan. Peluang jumlah mata dadu merupakan bilangan genap adalah ...",
    svgKey: "dua-dadu-genap",
    options: ["A. $\\frac{1}{3}$", "B. $\\frac{5}{12}$", "C. $\\frac{1}{2}$", "D. $\\frac{7}{12}$"],
    correctAnswer: "C. $\\frac{1}{2}$",
    explanation: {
      concept: "Jumlah genap terjadi jika keduanya genap atau keduanya ganjil.",
      steps: [
        "Keduanya genap: 3×3 = 9 cara",
        "Keduanya ganjil: 3×3 = 9 cara",
        "Total = 18",
        "$P = \\dfrac{18}{36} = \\dfrac{1}{2}$"
      ],
      formula: ""
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dari 52 kartu bridge, satu kartu diambil secara acak. Peluang terambil kartu hati (♥) adalah ...",
    svgKey: "kartu-bridge",
    options: ["A. $\\frac{1}{52}$", "B. $\\frac{1}{4}$", "C. $\\frac{1}{3}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "B. $\\frac{1}{4}$",
    explanation: {
      concept: "Dalam 52 kartu bridge, terdapat 13 kartu hati.",
      steps: ["n(hati) = 13", "$P = \\dfrac{13}{52} = \\dfrac{1}{4}$"],
      formula: ""
    }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Dari 52 kartu bridge, peluang terambil kartu gambar (Jack, Queen, King) adalah ...",
    svgKey: "kartu-bridge",
    options: ["A. $\\frac{1}{13}$", "B. $\\frac{3}{52}$", "C. $\\frac{3}{13}$", "D. $\\frac{1}{4}$"],
    correctAnswer: "C. $\\frac{3}{13}$",
    explanation: {
      concept: "Kartu gambar: J, Q, K — masing-masing 4 buah = 12 total.",
      steps: ["n(gambar) = 3 × 4 = 12", "$P = \\dfrac{12}{52} = \\dfrac{3}{13}$"],
      formula: ""
    }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Dalam satu kelas 40 siswa: 25 menyukai matematika, 20 menyukai IPA, dan 10 menyukai keduanya. Peluang terpilih siswa yang tidak menyukai keduanya adalah ...",
    svgKey: "venn-siswa",
    options: ["A. $\\frac{1}{8}$", "B. $\\frac{1}{4}$", "C. $\\frac{3}{8}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "A. $\\frac{1}{8}$",
    explanation: {
      concept: "Gunakan diagram Venn untuk menghitung irisan dan komplemen.",
      steps: [
        "$n(M \\cup I) = 25 + 20 - 10 = 35$",
        "Tidak suka keduanya = $40 - 35 = 5$",
        "$P = \\dfrac{5}{40} = \\dfrac{1}{8}$"
      ],
      formula: ""
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Peluang suatu kejadian adalah $\\frac{1}{5}$. Jika percobaan dilakukan 500 kali, frekuensi harapannya adalah ...",
    svgKey: "frek-500-1o5",
    options: ["A. 50", "B. 80", "C. 100", "D. 150"],
    correctAnswer: "C. 100",
    explanation: {
      concept: "f_h = P × n.",
      steps: ["$f_h = \\dfrac{1}{5} \\times 500 = 100$"],
      formula: ""
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Dua dadu dilempar bersamaan. Peluang muncul angka yang berbeda pada kedua dadu adalah ...",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{3}$", "C. $\\frac{2}{3}$", "D. $\\frac{5}{6}$"],
    correctAnswer: "D. $\\frac{5}{6}$",
    explanation: {
      concept: "P(angka sama) = 6/36 = 1/6. Maka P(berbeda) = 1 − 1/6.",
      steps: ["n(sama) = 6", "P(sama) = 6/36 = 1/6", "$P(\\text{berbeda}) = 1 - \\dfrac{1}{6} = \\dfrac{5}{6}$"],
      formula: ""
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah kantong berisi 5 bola merah dan 3 bola kuning. Satu bola diambil secara acak. Peluang terambil bola yang BUKAN merah adalah ...",
    svgKey: "marble-5r3k",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{3}{8}$", "C. $\\frac{5}{8}$", "D. $\\frac{3}{4}$"],
    correctAnswer: "B. $\\frac{3}{8}$",
    explanation: {
      concept: "Bukan merah = kuning.",
      steps: ["n(kuning) = 3", "n(S) = 8", "$P = \\dfrac{3}{8}$"],
      formula: ""
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Diketahui $P(A) = 0{,}6$, $P(B) = 0{,}5$, dan $P(A \\cup B) = 0{,}9$. Nilai $P(A \\cap B)$ adalah ...",
    options: ["A. 0,1", "B. 0,2", "C. 0,3", "D. 0,4"],
    correctAnswer: "B. 0,2",
    explanation: {
      concept: "P(A∩B) = P(A) + P(B) − P(A∪B).",
      steps: ["$P(A \\cap B) = 0{,}6 + 0{,}5 - 0{,}9 = 0{,}2$"],
      formula: ""
    }
  },
  {
    id: 71, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Dua dadu dilempar bersamaan. Peluang jumlah mata dadu kurang dari 5 adalah ...",
    svgKey: "dua-dadu-lt5",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{4}$", "C. $\\frac{1}{3}$", "D. $\\frac{5}{12}$"],
    correctAnswer: "A. $\\frac{1}{6}$",
    explanation: {
      concept: "Jumlah < 5: jumlah = 2, 3, atau 4.",
      steps: [
        "Jumlah 2: (1,1) = 1",
        "Jumlah 3: (1,2),(2,1) = 2",
        "Jumlah 4: (1,3),(3,1),(2,2) = 3",
        "Total = 6",
        "$P = \\dfrac{6}{36} = \\dfrac{1}{6}$"
      ],
      formula: ""
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Ramalan cuaca menyatakan probabilitas hujan di suatu kota adalah 0,7. Dari 30 hari ke depan, berapa hari yang diperkirakan akan hujan?",
    options: ["A. 7 hari", "B. 14 hari", "C. 21 hari", "D. 24 hari"],
    correctAnswer: "C. 21 hari",
    explanation: {
      concept: "Frekuensi harapan = P × n.",
      steps: ["$f_h = 0{,}7 \\times 30 = 21$"],
      formula: ""
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Sebuah dadu dilempar sekali. Peluang muncul bilangan prima yang kurang dari 5 adalah ...",
    options: ["A. $\\frac{1}{3}$", "B. $\\frac{1}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{5}{6}$"],
    correctAnswer: "A. $\\frac{1}{3}$",
    explanation: {
      concept: "Bilangan prima < 5 pada dadu: 2, 3.",
      steps: ["A = {2, 3}", "n(A) = 2", "$P = \\dfrac{2}{6} = \\dfrac{1}{3}$"],
      formula: ""
    }
  },
  {
    id: 74, type: "MCMA", difficulty: "Sedang", category: "TKA",
    question: "Dari 52 kartu bridge, sebuah kartu diambil acak. Pilih SEMUA pernyataan yang benar!",
    svgKey: "kartu-bridge",
    options: [
      "A. P(kartu merah) = 1/2",
      "B. P(kartu As) = 1/13",
      "C. P(kartu hitam) = 3/4",
      "D. P(kartu gambar J/Q/K) = 3/13"
    ],
    correctAnswer: "A, B, D",
    explanation: {
      concept: "Fakta kartu bridge: 26 merah, 26 hitam, 4 As, 12 kartu gambar.",
      steps: [
        "A: P(merah) = 26/52 = 1/2 ✓",
        "B: P(As) = 4/52 = 1/13 ✓",
        "C: P(hitam) = 26/52 = 1/2, bukan 3/4 ✗",
        "D: P(J/Q/K) = 12/52 = 3/13 ✓"
      ],
      formula: ""
    }
  },
  {
    id: 75, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK",
    question: "Tentukan benar atau salah setiap pernyataan berikut tentang kejadian saling lepas (mutually exclusive):",
    statements: [
      { text: "Jika A dan B saling lepas, maka P(A∪B) = P(A) + P(B).", isCorrect: true },
      { text: "Jika A dan B saling lepas, maka P(A∩B) = P(A) × P(B).", isCorrect: false },
      { text: "Dua kejadian bisa saling lepas sekaligus saling bebas jika P(A) = 0 atau P(B) = 0.", isCorrect: true },
      { text: "Pada pelemparan 1 dadu, kejadian 'muncul angka genap' dan 'muncul angka > 3' saling lepas.", isCorrect: false },
    ],
    explanation: {
      concept: "Kejadian saling lepas: P(A∩B) = 0.",
      steps: [
        "1: P(A∪B) = P(A)+P(B) jika saling lepas → Benar",
        "2: P(A∩B) = 0 (bukan P(A)×P(B) secara umum) → Salah",
        "3: Jika P(A)=0 atau P(B)=0, maka P(A∩B)=0 dan P(A)×P(B)=0 → Benar",
        "4: Genap={2,4,6} dan >3={4,5,6} beririsan di {4,6} → tidak saling lepas → Salah"
      ],
      formula: ""
    }
  },

  /* ══════════ SULIT (76–100) ══════════ */
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dua dadu dilempar bersamaan. Peluang selisih kedua mata dadu sama dengan 2 adalah ...",
    svgKey: "dua-dadu-selisih2",
    options: ["A. $\\frac{1}{6}$", "B. $\\frac{2}{9}$", "C. $\\frac{5}{18}$", "D. $\\frac{1}{3}$"],
    correctAnswer: "B. $\\frac{2}{9}$",
    explanation: {
      concept: "|d1 − d2| = 2.",
      steps: [
        "Pasangan: (1,3),(3,1),(2,4),(4,2),(3,5),(5,3),(4,6),(6,4) = 8 pasangan",
        "$P = \\dfrac{8}{36} = \\dfrac{2}{9}$"
      ],
      formula: ""
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dua dadu dilempar bersamaan. Peluang hasil kali kedua mata dadu merupakan bilangan genap adalah ...",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{2}$", "C. $\\frac{3}{4}$", "D. $\\frac{5}{6}$"],
    correctAnswer: "C. $\\frac{3}{4}$",
    explanation: {
      concept: "Hasil kali ganjil hanya jika KEDUANYA ganjil. Ganjil pada dadu: {1,3,5}.",
      steps: [
        "n(keduanya ganjil) = 3 × 3 = 9",
        "P(hasil kali ganjil) = 9/36 = 1/4",
        "$P(\\text{hasil kali genap}) = 1 - \\dfrac{1}{4} = \\dfrac{3}{4}$"
      ],
      formula: ""
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Dari bilangan 1 sampai 20, satu bilangan dipilih secara acak. Peluang terpilih bilangan prima ATAU bilangan genap adalah ...",
    options: ["A. $\\frac{3}{5}$", "B. $\\frac{7}{10}$", "C. $\\frac{4}{5}$", "D. $\\frac{17}{20}$"],
    correctAnswer: "D. $\\frac{17}{20}$",
    explanation: {
      concept: "Gunakan rumus P(A∪B) = P(A)+P(B)−P(A∩B).",
      steps: [
        "Prima (1–20): {2,3,5,7,11,13,17,19} → n=8",
        "Genap (1–20): {2,4,6,8,10,12,14,16,18,20} → n=10",
        "Prima∩Genap: {2} → n=1",
        "$P = \\dfrac{8+10-1}{20} = \\dfrac{17}{20}$"
      ],
      formula: ""
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Kejadian A dan B saling bebas (independent). Jika $P(A) = \\frac{2}{5}$ dan $P(B) = \\frac{1}{3}$, maka $P(A \\cap B)$ adalah ...",
    options: ["A. $\\frac{1}{15}$", "B. $\\frac{2}{15}$", "C. $\\frac{1}{5}$", "D. $\\frac{11}{15}$"],
    correctAnswer: "B. $\\frac{2}{15}$",
    explanation: {
      concept: "Untuk kejadian saling bebas: P(A∩B) = P(A) × P(B).",
      steps: ["$P(A \\cap B) = P(A) \\times P(B) = \\dfrac{2}{5} \\times \\dfrac{1}{3} = \\dfrac{2}{15}$"],
      formula: "P(A \\cap B) = P(A) \\times P(B)"
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Tiga koin dilempar bersamaan. Peluang muncul tepat dua angka (A) adalah ...",
    svgKey: "koin-3",
    options: ["A. $\\frac{1}{8}$", "B. $\\frac{1}{4}$", "C. $\\frac{3}{8}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "C. $\\frac{3}{8}$",
    explanation: {
      concept: "S memiliki 2³ = 8 anggota. Tepat 2A: {AAG, AGA, GAA}.",
      steps: ["n(tepat 2A) = 3", "n(S) = 8", "$P = \\dfrac{3}{8}$"],
      formula: ""
    }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Tiga koin dilempar bersamaan. Peluang muncul minimal dua gambar (G) adalah ...",
    svgKey: "koin-3",
    options: ["A. $\\frac{1}{8}$", "B. $\\frac{1}{2}$", "C. $\\frac{5}{8}$", "D. $\\frac{3}{4}$"],
    correctAnswer: "B. $\\frac{1}{2}$",
    explanation: {
      concept: "Minimal 2G: tepat 2G atau tepat 3G.",
      steps: [
        "Tepat 2G: {AGG, GAG, GGA} = 3",
        "Tepat 3G: {GGG} = 1",
        "Total = 4",
        "$P = \\dfrac{4}{8} = \\dfrac{1}{2}$"
      ],
      formula: ""
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Dua dadu dilempar. Peluang jumlah mata dadu = 7 ATAU kedua dadu menunjukkan angka sama adalah ...",
    svgKey: "dua-dadu-7",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{3}$", "C. $\\frac{5}{12}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "B. $\\frac{1}{3}$",
    explanation: {
      concept: "Hitung kejadian A (jumlah=7) dan B (sama), lalu P(A∪B).",
      steps: [
        "Jumlah=7: {(1,6),(6,1),(2,5),(5,2),(3,4),(4,3)} = 6",
        "Sama: {(1,1),(2,2),(3,3),(4,4),(5,5),(6,6)} = 6",
        "Irisan (jumlah=7 DAN sama): mustahil → 0",
        "$P = \\dfrac{6+6-0}{36} = \\dfrac{12}{36} = \\dfrac{1}{3}$"
      ],
      formula: ""
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Diketahui $P(A) = \\frac{1}{2}$, $P(B) = \\frac{5}{8}$, dan $P(A \\cup B) = \\frac{3}{4}$. Nilai $P(A \\cap B)$ adalah ...",
    options: ["A. $\\frac{1}{8}$", "B. $\\frac{1}{4}$", "C. $\\frac{3}{8}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "C. $\\frac{3}{8}$",
    explanation: {
      concept: "P(A∩B) = P(A) + P(B) − P(A∪B).",
      steps: [
        "$P(A \\cap B) = \\dfrac{1}{2} + \\dfrac{5}{8} - \\dfrac{3}{4}$",
        "$= \\dfrac{4}{8} + \\dfrac{5}{8} - \\dfrac{6}{8} = \\dfrac{3}{8}$"
      ],
      formula: ""
    }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dua dadu dilempar. Peluang jumlah mata prima DAN setidaknya satu dadu menunjukkan angka 1 adalah ...",
    svgKey: "dua-dadu-prima",
    options: ["A. $\\frac{5}{36}$", "B. $\\frac{7}{36}$", "C. $\\frac{5}{12}$", "D. $\\frac{1}{4}$"],
    correctAnswer: "B. $\\frac{7}{36}$",
    explanation: {
      concept: "Cari pasangan dadu dengan jumlah prima DAN minimal satu angka = 1.",
      steps: [
        "(1,1)→2✓, (1,2)→3✓, (2,1)→3✓, (1,4)→5✓, (4,1)→5✓, (1,6)→7✓, (6,1)→7✓",
        "Total = 7 pasangan",
        "$P = \\dfrac{7}{36}$"
      ],
      formula: ""
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Dua dadu dilempar bersamaan. Peluang jumlah mata dadu merupakan bilangan sempurna (perfect number) adalah ...",
    options: ["A. $\\frac{5}{36}$", "B. $\\frac{1}{6}$", "C. $\\frac{7}{36}$", "D. $\\frac{1}{4}$"],
    correctAnswer: "A. $\\frac{5}{36}$",
    explanation: {
      concept: "Bilangan sempurna antara 2–12: hanya 6. (6 = 1+2+3, faktor selain dirinya).",
      steps: [
        "Jumlah = 6: (1,5),(5,1),(2,4),(4,2),(3,3) = 5 pasangan",
        "$P = \\dfrac{5}{36}$"
      ],
      formula: ""
    }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah pabrik memproduksi bola lampu dengan tingkat cacat 3%. Dari 500 bola lampu yang diproduksi, berapa banyak yang diharapkan cacat?",
    options: ["A. 10", "B. 15", "C. 20", "D. 30"],
    correctAnswer: "B. 15",
    explanation: {
      concept: "Frekuensi harapan = P(cacat) × n.",
      steps: [
        "$P(\\text{cacat}) = \\dfrac{3}{100}$",
        "$f_h = \\dfrac{3}{100} \\times 500 = 15$"
      ],
      formula: ""
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dalam satu kelas 40 siswa: 25 suka matematika, 20 suka IPA, 10 suka keduanya. Peluang dipilih siswa yang tidak suka keduanya adalah ...",
    svgKey: "venn-siswa",
    options: ["A. $\\frac{1}{8}$", "B. $\\frac{1}{4}$", "C. $\\frac{3}{8}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "A. $\\frac{1}{8}$",
    explanation: {
      concept: "Hitung siswa yang suka minimal satu pelajaran menggunakan inklusi-eksklusi.",
      steps: [
        "$n(M \\cup I) = 25 + 20 - 10 = 35$",
        "Tidak suka keduanya $= 40 - 35 = 5$",
        "$P = \\dfrac{5}{40} = \\dfrac{1}{8}$"
      ],
      formula: ""
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dadu dilempar 600 kali. Angka 5 muncul 92 kali. Selisih antara peluang empirik dan peluang teoritik angka 5 adalah ...",
    options: ["A. $\\frac{1}{300}$", "B. $\\frac{1}{150}$", "C. $\\frac{1}{75}$", "D. $\\frac{1}{50}$"],
    correctAnswer: "C. $\\frac{1}{75}$",
    explanation: {
      concept: "Bandingkan P empirik dan P teoritik.",
      steps: [
        "$P_{\\text{empirik}} = \\dfrac{92}{600} = \\dfrac{23}{150}$",
        "$P_{\\text{teoritik}} = \\dfrac{1}{6} = \\dfrac{25}{150}$",
        "$\\text{Selisih} = \\dfrac{25}{150} - \\dfrac{23}{150} = \\dfrac{2}{150} = \\dfrac{1}{75}$"
      ],
      formula: ""
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Dari 52 kartu bridge, satu kartu diambil acak. Peluang terambil kartu merah ATAU kartu As adalah ...",
    svgKey: "kartu-bridge",
    options: ["A. $\\frac{1}{2}$", "B. $\\frac{7}{13}$", "C. $\\frac{7}{13}$", "D. $\\frac{15}{26}$"],
    correctAnswer: "B. $\\frac{7}{13}$",
    explanation: {
      concept: "Kartu merah = 26, As = 4, As merah = 2.",
      steps: [
        "$P(\\text{merah} \\cup \\text{As}) = \\dfrac{26+4-2}{52} = \\dfrac{28}{52} = \\dfrac{7}{13}$"
      ],
      formula: ""
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Dua dadu dilempar bersamaan. Peluang angka pada dadu pertama lebih besar dari angka pada dadu kedua adalah ...",
    svgKey: "dua-dadu-d1gtd2",
    options: ["A. $\\frac{1}{3}$", "B. $\\frac{5}{12}$", "C. $\\frac{1}{2}$", "D. $\\frac{7}{12}$"],
    correctAnswer: "B. $\\frac{5}{12}$",
    explanation: {
      concept: "Hitung pasangan di mana dadu1 > dadu2.",
      steps: [
        "d1=2: (2,1) → 1; d1=3: 2; d1=4: 3; d1=5: 4; d1=6: 5",
        "Total = 1+2+3+4+5 = 15",
        "$P = \\dfrac{15}{36} = \\dfrac{5}{12}$"
      ],
      formula: ""
    }
  },
  {
    id: 91, type: "MCMA", difficulty: "Sulit", category: "HOTS",
    question: "Dua dadu dilempar bersamaan. Pilih SEMUA pernyataan yang benar!",
    svgKey: "dua-dadu-7",
    options: [
      "A. P(jumlah = 7) = 1/6",
      "B. P(jumlah = 12) = 1/36",
      "C. P(jumlah ganjil) = 1/2",
      "D. P(jumlah = 1) = 1/36"
    ],
    correctAnswer: "A, B, C",
    explanation: {
      concept: "Analisis ruang sampel 2 dadu.",
      steps: [
        "A: Jumlah=7 ada 6 cara → 6/36=1/6 ✓",
        "B: Jumlah=12 hanya (6,6) → 1/36 ✓",
        "C: Jumlah ganjil = 18 cara → 1/2 ✓",
        "D: Jumlah minimum = 2 (bukan 1) → Tidak mungkin, P=0 ✗"
      ],
      formula: ""
    }
  },
  {
    id: 92, type: "MCMA", difficulty: "Sulit", category: "Olimpiade",
    question: "Sebuah kantong berisi 3 bola merah, 4 bola biru, dan 5 bola hijau. Pilih SEMUA pernyataan yang benar!",
    svgKey: "marble-3r4b5h",
    options: [
      "A. P(merah) = 1/4",
      "B. P(biru atau hijau) = 3/4",
      "C. P(bukan merah) = 3/4",
      "D. P(merah) + P(biru) + P(hijau) = 1"
    ],
    correctAnswer: "A, B, C, D",
    explanation: {
      concept: "n(S) = 3+4+5 = 12.",
      steps: [
        "A: P(merah) = 3/12 = 1/4 ✓",
        "B: P(biru∪hijau) = (4+5)/12 = 9/12 = 3/4 ✓",
        "C: P(bukan merah) = 9/12 = 3/4 ✓",
        "D: 3/12 + 4/12 + 5/12 = 12/12 = 1 ✓"
      ],
      formula: ""
    }
  },
  {
    id: 93, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS",
    question: "Tentukan benar atau salah setiap pernyataan berikut:",
    statements: [
      { text: "P(A∪B) selalu lebih besar dari atau sama dengan P(A) dan P(B).", isCorrect: true },
      { text: "Jika P(A) = P(B) = 0,6, maka A dan B tidak mungkin saling lepas.", isCorrect: true },
      { text: "Untuk kejadian bebas A dan B: P(A∪B) = P(A) + P(B) − P(A)·P(B).", isCorrect: true },
      { text: "Peluang empirik selalu sama dengan peluang teoritik.", isCorrect: false },
    ],
    explanation: {
      concept: "Sifat peluang lanjutan.",
      steps: [
        "1: P(A∪B) ≥ max(P(A),P(B)) → Benar",
        "2: P(A)+P(B)=1,2 > 1 → P(A∩B) ≥ 0,2 > 0 → tidak saling lepas → Benar",
        "3: Untuk bebas: P(A∩B)=P(A)P(B), substitusi ke rumus → Benar",
        "4: Empirik mendekati teoritik seiring banyak percobaan, tidak selalu sama → Salah"
      ],
      formula: ""
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Dua dadu dilempar bersamaan. Peluang angka pada dadu pertama lebih besar dari atau sama dengan angka pada dadu kedua adalah ...",
    svgKey: "dua-dadu-d1ged2",
    options: ["A. $\\frac{5}{12}$", "B. $\\frac{1}{2}$", "C. $\\frac{7}{12}$", "D. $\\frac{2}{3}$"],
    correctAnswer: "C. $\\frac{7}{12}$",
    explanation: {
      concept: "d1 ≥ d2 termasuk kasus d1 = d2.",
      steps: [
        "d1 > d2: 15 pasangan",
        "d1 = d2: 6 pasangan",
        "Total = 21",
        "$P = \\dfrac{21}{36} = \\dfrac{7}{12}$"
      ],
      formula: ""
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Diketahui A dan B saling lepas dengan $P(A) = 0{,}3$ dan $P(B) = 0{,}4$. Nilai $P((A \\cup B)^c)$ adalah ...",
    options: ["A. 0,1", "B. 0,3", "C. 0,4", "D. 0,7"],
    correctAnswer: "B. 0,3",
    explanation: {
      concept: "P(A∪B) = P(A)+P(B) (saling lepas). Lalu P((A∪B)c) = 1 − P(A∪B).",
      steps: [
        "$P(A \\cup B) = 0{,}3 + 0{,}4 = 0{,}7$",
        "$P((A \\cup B)^c) = 1 - 0{,}7 = 0{,}3$"
      ],
      formula: ""
    }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dua dadu dilempar. Peluang minimal satu dadu menunjukkan bilangan prima adalah ...",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{2}$", "C. $\\frac{3}{4}$", "D. $\\frac{5}{6}$"],
    correctAnswer: "C. $\\frac{3}{4}$",
    explanation: {
      concept: "Komplemen: P(min 1 prima) = 1 − P(keduanya tidak prima).",
      steps: [
        "Tidak prima pada dadu: {1,4,6} → 3 dari 6",
        "$P(\\text{tidak prima}) = \\dfrac{3}{6} = \\dfrac{1}{2}$",
        "$P(\\text{keduanya tidak prima}) = \\left(\\dfrac{1}{2}\\right)^2 = \\dfrac{1}{4}$",
        "$P(\\text{min 1 prima}) = 1 - \\dfrac{1}{4} = \\dfrac{3}{4}$"
      ],
      formula: ""
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Tiga koin dilempar bersamaan. Peluang jumlah angka (A) yang muncul lebih banyak dari gambar (G) adalah ...",
    svgKey: "koin-3",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{2}$", "C. $\\frac{3}{4}$", "D. 1"],
    correctAnswer: "B. $\\frac{1}{2}$",
    explanation: {
      concept: "A lebih banyak dari G artinya minimal 2 angka muncul.",
      steps: [
        "Tepat 2A: {AAG,AGA,GAA} = 3",
        "Tepat 3A: {AAA} = 1",
        "Total = 4",
        "$P = \\dfrac{4}{8} = \\dfrac{1}{2}$"
      ],
      formula: ""
    }
  },
  {
    id: 98, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Dari bilangan 1 sampai 50, dipilih satu bilangan secara acak. Peluang terpilih kelipatan 3 atau kelipatan 5 adalah ...",
    options: ["A. $\\frac{9}{25}$", "B. $\\frac{23}{50}$", "C. $\\frac{12}{25}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "B. $\\frac{23}{50}$",
    explanation: {
      concept: "Gunakan inklusi-eksklusi untuk kelipatan 3 atau kelipatan 5.",
      steps: [
        "Kelipatan 3 (1–50): ⌊50/3⌋ = 16",
        "Kelipatan 5 (1–50): ⌊50/5⌋ = 10",
        "Kelipatan 15 (1–50): ⌊50/15⌋ = 3",
        "$n = 16 + 10 - 3 = 23$",
        "$P = \\dfrac{23}{50}$"
      ],
      formula: "P(K_3 \\cup K_5) = \\frac{n(K_3)+n(K_5)-n(K_{15})}{50}"
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Sebuah kantong berisi 3 bola merah, 4 bola biru, dan 5 bola hijau. Peluang terambil bola yang TIDAK hijau adalah ...",
    svgKey: "marble-3r4b5h",
    options: ["A. $\\frac{5}{12}$", "B. $\\frac{1}{2}$", "C. $\\frac{7}{12}$", "D. $\\frac{2}{3}$"],
    correctAnswer: "C. $\\frac{7}{12}$",
    explanation: {
      concept: "Tidak hijau = merah + biru.",
      steps: ["n(tidak hijau) = 3+4 = 7", "n(S) = 12", "$P = \\dfrac{7}{12}$"],
      formula: ""
    }
  },
  {
    id: 100, type: "Benar/Salah", difficulty: "Sulit", category: "Olimpiade",
    question: "Tentukan benar atau salah setiap pernyataan berikut tentang peluang gabungan dua kejadian:",
    statements: [
      { text: "P(A∪B) = P(A) + P(B) berlaku untuk semua kejadian A dan B.", isCorrect: false },
      { text: "P(A∩B) ≤ min(P(A), P(B)).", isCorrect: true },
      { text: "P(A∪B) ≤ P(A) + P(B) untuk semua kejadian A dan B.", isCorrect: true },
      { text: "Jika P(A) + P(B) > 1 maka A dan B pasti tidak saling lepas.", isCorrect: true },
    ],
    explanation: {
      concept: "Sifat-sifat lanjutan peluang gabungan.",
      steps: [
        "1: Hanya berlaku jika saling lepas → Salah",
        "2: P(A∩B) ≤ P(A) dan P(A∩B) ≤ P(B) → Benar",
        "3: P(A∪B) = P(A)+P(B)−P(A∩B) ≤ P(A)+P(B) karena P(A∩B)≥0 → Benar",
        "4: Jika saling lepas: P(A∪B)=P(A)+P(B)>1, mustahil → pasti tidak saling lepas → Benar"
      ],
      formula: ""
    }
  },
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
        <div className="mt-3 p-3 rounded-lg bg-slate-800/60 border border-cyan-500/20 text-xs space-y-1">
          <p className="text-cyan-300 font-mono font-bold">Konsep: <span className="font-normal text-white/80">{soal.explanation.concept}</span></p>
          {soal.explanation.steps.map((s, i) => (
            <p key={i} className="text-white/75 font-mono"><MathText text={`• ${s}`} /></p>
          ))}
          {soal.explanation.formula && (
            <div className="mt-2 text-center text-cyan-400 font-mono">
              <BlockMath math={soal.explanation.formula} />
            </div>
          )}
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
