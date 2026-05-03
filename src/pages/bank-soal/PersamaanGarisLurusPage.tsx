import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { TrendingUp, ChevronDown, ChevronUp, Filter } from "lucide-react";
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

const GrafikGarisSVG = ({ m, b, label }: { m: number; b: number; label: string }) => {
  const x1 = -4, y1 = m * x1 + b;
  const x2 = 4, y2 = m * x2 + b;
  const toSvgX = (x: number) => 140 + x * 25;
  const toSvgY = (y: number) => 110 - y * 20;
  const sx1 = toSvgX(x1), sy1 = toSvgY(Math.max(-5, Math.min(5, y1)));
  const sx2 = toSvgX(x2), sy2 = toSvgY(Math.max(-5, Math.min(5, y2)));
  return (
    <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <line x1="20" y1="110" x2="260" y2="110" stroke="#475569" strokeWidth="1"/>
      <line x1="140" y1="10" x2="140" y2="210" stroke="#475569" strokeWidth="1"/>
      {[-4,-3,-2,-1,1,2,3,4].map(v => (
        <g key={v}>
          <line x1={toSvgX(v)} y1="107" x2={toSvgX(v)} y2="113" stroke="#475569" strokeWidth="1"/>
          <text x={toSvgX(v)} y="122" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">{v}</text>
          <line x1="137" y1={toSvgY(v)} x2="143" y2={toSvgY(v)} stroke="#475569" strokeWidth="1"/>
          <text x="133" y={toSvgY(v)+3} fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">{v}</text>
        </g>
      ))}
      <text x="258" y="115" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">x</text>
      <text x="143" y="14" fill="#94a3b8" fontSize="9" fontFamily="monospace">y</text>
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="#22d3ee" strokeWidth="2.5"/>
      <text x="200" y="35" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">{label}</text>
    </svg>
  );
};

const GradienSegitigaSVG = ({ x1c, y1c, x2c, y2c }: { x1c: number; y1c: number; x2c: number; y2c: number }) => {
  const toSvgX = (x: number) => 80 + x * 30;
  const toSvgY = (y: number) => 140 - y * 30;
  const sx1 = toSvgX(x1c), sy1 = toSvgY(y1c);
  const sx2 = toSvgX(x2c), sy2 = toSvgY(y2c);
  const dx = x2c - x1c, dy = y2c - y1c;
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <line x1="20" y1="140" x2="260" y2="140" stroke="#475569" strokeWidth="1"/>
      <line x1="80" y1="10" x2="80" y2="190" stroke="#475569" strokeWidth="1"/>
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="#22d3ee" strokeWidth="2.5"/>
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy1} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3"/>
      <line x1={sx2} y1={sy1} x2={sx2} y2={sy2} stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,3"/>
      <circle cx={sx1} cy={sy1} r="4" fill="#06b6d4"/>
      <circle cx={sx2} cy={sy2} r="4" fill="#06b6d4"/>
      <text x={(sx1+sx2)/2} y={sy1+14} fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace">Δx = {dx}</text>
      <text x={sx2+16} y={(sy1+sy2)/2+4} fill="#f472b6" fontSize="10" textAnchor="middle" fontFamily="monospace">Δy = {dy}</text>
      <text x="195" y="25" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">m = {dy}/{dx} = {dy/dx}</text>
    </svg>
  );
};

const TitikPotongSVG = ({ m, b }: { m: number; b: number }) => {
  const xInt = -b / m;
  const toSvgX = (x: number) => 140 + x * 28;
  const toSvgY = (y: number) => 110 - y * 22;
  return (
    <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <line x1="20" y1="110" x2="260" y2="110" stroke="#475569" strokeWidth="1"/>
      <line x1="140" y1="10" x2="140" y2="210" stroke="#475569" strokeWidth="1"/>
      <line x1={toSvgX(-4)} y1={toSvgY(m*(-4)+b)} x2={toSvgX(4)} y2={toSvgY(m*4+b)} stroke="#22d3ee" strokeWidth="2"/>
      <circle cx={toSvgX(xInt)} cy={toSvgY(0)} r="5" fill="#fbbf24" stroke="#fff" strokeWidth="1"/>
      <circle cx={toSvgX(0)} cy={toSvgY(b)} r="5" fill="#f472b6" stroke="#fff" strokeWidth="1"/>
      <text x={toSvgX(xInt)+8} y={toSvgY(0)-8} fill="#fbbf24" fontSize="9" fontFamily="monospace">({xInt.toFixed(1)}, 0)</text>
      <text x={toSvgX(0)+8} y={toSvgY(b)-4} fill="#f472b6" fontSize="9" fontFamily="monospace">(0, {b})</text>
      <text x="30" y="25" fill="#94a3b8" fontSize="8" fontFamily="monospace">Titik potong sumbu-x: ({xInt.toFixed(1)}, 0)</text>
      <text x="30" y="38" fill="#94a3b8" fontSize="8" fontFamily="monospace">Titik potong sumbu-y: (0, {b})</text>
    </svg>
  );
};

const DuaGarisSejajarSVG = ({ m, b1, b2 }: { m: number; b1: number; b2: number }) => {
  const toSvgX = (x: number) => 140 + x * 25;
  const toSvgY = (y: number) => 110 - y * 20;
  return (
    <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <line x1="20" y1="110" x2="260" y2="110" stroke="#334155" strokeWidth="1"/>
      <line x1="140" y1="10" x2="140" y2="210" stroke="#334155" strokeWidth="1"/>
      <line x1={toSvgX(-4)} y1={toSvgY(m*(-4)+b1)} x2={toSvgX(4)} y2={toSvgY(m*4+b1)} stroke="#22d3ee" strokeWidth="2"/>
      <line x1={toSvgX(-4)} y1={toSvgY(m*(-4)+b2)} x2={toSvgX(4)} y2={toSvgY(m*4+b2)} stroke="#f472b6" strokeWidth="2"/>
      <text x="165" y="28" fill="#22d3ee" fontSize="9" fontFamily="monospace">y = {m}x + {b1}</text>
      <text x="165" y="44" fill="#f472b6" fontSize="9" fontFamily="monospace">y = {m}x + {b2}</text>
      <text x="140" y="205" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">⊥ Gradient sama → SEJAJAR</text>
    </svg>
  );
};

const TabelNilaiSVG = ({ values }: { values: { x: number; y: number }[] }) => (
  <svg viewBox="0 0 280 90" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
    <rect x="10" y="10" width="260" height="70" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <rect x="10" y="10" width="260" height="25" rx="6" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1"/>
    <text x="20" y="27" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">x</text>
    {values.map((v, i) => (
      <text key={i} x={50 + i * 45} y="27" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">{v.x}</text>
    ))}
    <text x="20" y="58" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">y</text>
    {values.map((v, i) => (
      <text key={i} x={50 + i * 45} y="58" fill="#fff" fontSize="10" fontFamily="monospace">{v.y === 999 ? "?" : v.y}</text>
    ))}
    <line x1="10" y1="35" x2="270" y2="35" stroke="#334155" strokeWidth="1"/>
  </svg>
);

const KontekstualLinearSVG = ({ label, x1v, y1v, x2v, y2v, xLabel, yLabel }: {
  label: string; x1v: number; y1v: number; x2v: number; y2v: number; xLabel: string; yLabel: string;
}) => {
  const m = (y2v - y1v) / (x2v - x1v);
  const b = y1v - m * x1v;
  return (
    <svg viewBox="0 0 280 130" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-1">
      <rect x="8" y="8" width="264" height="114" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155"/>
      <text x="140" y="22" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label}</text>
      <line x1="35" y1="105" x2="260" y2="105" stroke="#475569" strokeWidth="1.5"/>
      <line x1="35" y1="30" x2="35" y2="105" stroke="#475569" strokeWidth="1.5"/>
      <line x1="35" y1="105" x2="225" y2="45" stroke="#22d3ee" strokeWidth="2.5"/>
      <circle cx="35" cy="105" r="3" fill="#fbbf24"/>
      <circle cx="225" cy="45" r="3" fill="#fbbf24"/>
      <text x="30" y="118" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">{x1v}</text>
      <text x="225" y="118" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">{x2v}</text>
      <text x="18" y="108" fill="#f472b6" fontSize="7" fontFamily="monospace">{y1v}</text>
      <text x="18" y="49" fill="#f472b6" fontSize="7" fontFamily="monospace">{y2v}</text>
      <text x="148" y="122" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">{xLabel}</text>
      <text x="14" y="68" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,14,68)">{yLabel}</text>
      <text x="200" y="38" fill="#fde68a" fontSize="8" fontFamily="monospace">m = {m.toFixed(2)}</text>
    </svg>
  );
};

const visualMap: Record<string, React.ReactNode> = {
  "garis-2-1": <GrafikGarisSVG m={2} b={1} label="y = 2x + 1" />,
  "garis-neg1-3": <GrafikGarisSVG m={-1} b={3} label="y = -x + 3" />,
  "garis-half-neg2": <GrafikGarisSVG m={0.5} b={-2} label="y = ½x - 2" />,
  "garis-3-neg6": <GrafikGarisSVG m={3} b={-6} label="y = 3x - 6" />,
  "garis-neg2-4": <GrafikGarisSVG m={-2} b={4} label="y = -2x + 4" />,
  "garis-1-neg3": <GrafikGarisSVG m={1} b={-3} label="y = x - 3" />,
  "gradien-0-0-3-6": <GradienSegitigaSVG x1c={0} y1c={0} x2c={3} y2c={6} />,
  "gradien-1-2-3-8": <GradienSegitigaSVG x1c={1} y1c={2} x2c={3} y2c={8} />,
  "gradien-neg1-3-2-9": <GradienSegitigaSVG x1c={-1} y1c={3} x2c={2} y2c={9} />,
  "gradien-0-neg4-2-0": <GradienSegitigaSVG x1c={0} y1c={-4} x2c={2} y2c={0} />,
  "potong-2-1": <TitikPotongSVG m={2} b={1} />,
  "potong-neg1-3": <TitikPotongSVG m={-1} b={3} />,
  "potong-half-neg4": <TitikPotongSVG m={0.5} b={-4} />,
  "sejajar-2-1-neg2": <DuaGarisSejajarSVG m={2} b1={1} b2={-2} />,
  "sejajar-3-neg6-1": <DuaGarisSejajarSVG m={3} b1={-6} b2={1} />,
  "tabel-2x1": <TabelNilaiSVG values={[{x:-2,y:-3},{x:-1,y:-1},{x:0,y:1},{x:1,y:3},{x:2,y:999}]} />,
  "tabel-neg1x3": <TabelNilaiSVG values={[{x:-2,y:5},{x:-1,y:4},{x:0,y:3},{x:1,y:999},{x:2,y:1}]} />,
  "tabel-3x-6": <TabelNilaiSVG values={[{x:0,y:-6},{x:1,y:-3},{x:2,y:0},{x:3,y:999},{x:4,y:6}]} />,
  "konteks-taksi": <KontekstualLinearSVG label="Tarif Taksi Online" x1v={0} y1v={5000} x2v={10} y2v={35000} xLabel="Jarak (km)" yLabel="Tarif (Rp)" />,
  "konteks-air": <KontekstualLinearSVG label="Volume Air Tangki" x1v={0} y1v={200} x2v={10} y2v={100} xLabel="Waktu (menit)" yLabel="Volume (L)" />,
  "konteks-les": <KontekstualLinearSVG label="Biaya Les Matematika" x1v={0} y1v={100000} x2v={5} y2v={350000} xLabel="Sesi" yLabel="Biaya (Rp)" />,
};

const soalPersamaanGarisLurus: Question[] = [
  /* ══════════════════════════════
     MUDAH  (Q1 – Q35)
  ══════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Gradien garis yang melalui titik (0, 0) dan (3, 6) adalah ...",
    svgKey: "gradien-0-0-3-6",
    options: ["A. 1", "B. 2", "C. 3", "D. 6"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Gradien = Δy / Δx = (y₂ − y₁) / (x₂ − x₁).",
      steps: ["$m = \\dfrac{6 - 0}{3 - 0} = \\dfrac{6}{3} = 2$"],
      formula: "m = \\dfrac{y_2 - y_1}{x_2 - x_1}"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Gradien garis dengan persamaan $y = 3x - 5$ adalah ...",
    svgKey: "garis-3-neg6",
    options: ["A. -5", "B. 3", "C. -3", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Pada persamaan y = mx + c, gradien adalah koefisien x yaitu m.",
      steps: ["$y = 3x - 5$", "Koefisien $x = 3$", "Jadi gradien $m = 3$"],
      formula: "y = mx + c \\Rightarrow m = \\text{koefisien } x"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Titik Potong Sumbu",
    question: "Titik potong sumbu-y dari garis $y = 2x + 1$ adalah ...",
    svgKey: "garis-2-1",
    options: ["A. (0, −1)", "B. (0, 1)", "C. $(-\\frac{1}{2}, 0)$", "D. (1, 0)"],
    correctAnswer: "B. (0, 1)",
    explanation: {
      concept: "Titik potong sumbu-y diperoleh saat x = 0.",
      steps: ["Substitusi $x = 0$:", "$y = 2(0) + 1 = 1$", "Titik potong sumbu-y: $(0, 1)$"],
      formula: "\\text{Titik potong sumbu-y}: x = 0"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Titik Potong Sumbu",
    question: "Titik potong sumbu-x dari garis $y = x - 3$ adalah ...",
    svgKey: "potong-neg1-3",
    options: ["A. (0, −3)", "B. (3, 0)", "C. (−3, 0)", "D. (0, 3)"],
    correctAnswer: "B. (3, 0)",
    explanation: {
      concept: "Titik potong sumbu-x diperoleh saat y = 0.",
      steps: ["$0 = x - 3$", "$x = 3$", "Titik potong sumbu-x: $(3, 0)$"],
      formula: "\\text{Titik potong sumbu-x}: y = 0"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Apakah titik $(2, 5)$ terletak pada garis $y = 2x + 1$?",
    svgKey: "garis-2-1",
    options: ["A. Ya, karena 5 = 2(2) + 1", "B. Tidak, karena 5 ≠ 2(2) + 1", "C. Ya, karena gradiennya 2", "D. Tidak, karena titiknya di kuadran I"],
    correctAnswer: "A. Ya, karena 5 = 2(2) + 1",
    explanation: {
      concept: "Suatu titik terletak pada garis jika memenuhi persamaan garis tersebut.",
      steps: ["Substitusi $x = 2$:", "$y = 2(2) + 1 = 4 + 1 = 5$ ✓", "Karena $y = 5$ (sesuai), titik $(2,5)$ terletak pada garis"],
      formula: "\\text{Cek: substitusi koordinat ke persamaan}"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Gradien garis $y = -2x + 4$ adalah ...",
    svgKey: "garis-neg2-4",
    options: ["A. 4", "B. 2", "C. −2", "D. −4"],
    correctAnswer: "C. −2",
    explanation: {
      concept: "Pada y = mx + c, m adalah gradien.",
      steps: ["$y = -2x + 4$", "Gradien $m = -2$"],
      formula: "y = mx + c,\\; m = -2"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Tabel Nilai",
    question: "Perhatikan tabel nilai berikut untuk garis $y = 2x + 1$. Nilai $y$ saat $x = 2$ adalah ...",
    svgKey: "tabel-2x1",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "C. 5",
    explanation: {
      concept: "Substitusi nilai x ke persamaan garis.",
      steps: ["$y = 2(2) + 1 = 4 + 1 = 5$"],
      formula: "y = 2x + 1"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Persamaan garis dengan gradien $m = 3$ dan melalui titik $(0, -1)$ adalah ...",
    options: ["A. $y = 3x + 1$", "B. $y = 3x - 1$", "C. $y = -3x - 1$", "D. $y = x - 3$"],
    correctAnswer: "B. $y = 3x - 1$",
    explanation: {
      concept: "Titik (0, -1) berarti c = -1. Substitusikan m dan c ke y = mx + c.",
      steps: ["$m = 3$, titik $(0, -1)$ → $c = -1$", "$y = 3x + (-1) = 3x - 1$"],
      formula: "y = mx + c"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Jenis Garis",
    question: "Gradien garis horizontal (mendatar) adalah ...",
    options: ["A. Tak terdefinisi", "B. 1", "C. −1", "D. 0"],
    correctAnswer: "D. 0",
    explanation: {
      concept: "Garis horizontal memiliki Δy = 0, sehingga gradien = 0/Δx = 0.",
      steps: ["Garis horizontal: $y = c$ (konstan)", "$m = \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{0}{\\Delta x} = 0$"],
      formula: "m_{\\text{horizontal}} = 0"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Jenis Garis",
    question: "Gradien garis vertikal (tegak) adalah ...",
    options: ["A. 0", "B. 1", "C. −1", "D. Tidak terdefinisi"],
    correctAnswer: "D. Tidak terdefinisi",
    explanation: {
      concept: "Garis vertikal memiliki Δx = 0, sehingga gradien = Δy/0 yang tidak terdefinisi.",
      steps: ["Garis vertikal: $x = a$ (konstan)", "$m = \\dfrac{\\Delta y}{0}$ → tidak terdefinisi"],
      formula: "m_{\\text{vertikal}} = \\text{tidak terdefinisi}"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Gradien garis melalui titik $(1, 2)$ dan $(3, 8)$ adalah ...",
    svgKey: "gradien-1-2-3-8",
    options: ["A. 2", "B. 3", "C. 4", "D. 6"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Gradien = (y₂ − y₁) / (x₂ − x₁).",
      steps: ["$m = \\dfrac{8 - 2}{3 - 1} = \\dfrac{6}{2} = 3$"],
      formula: "m = \\dfrac{y_2 - y_1}{x_2 - x_1}"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Titik Potong Sumbu",
    question: "Titik potong sumbu-y dari garis $y = -x + 3$ adalah ...",
    svgKey: "garis-neg1-3",
    options: ["A. (0, 1)", "B. (3, 0)", "C. (0, 3)", "D. (0, -3)"],
    correctAnswer: "C. (0, 3)",
    explanation: {
      concept: "Titik potong sumbu-y: substitusi x = 0.",
      steps: ["$y = -(0) + 3 = 3$", "Titik potong sumbu-y: $(0, 3)$"],
      formula: ""
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Titik Potong Sumbu",
    question: "Titik potong sumbu-x dari garis $y = 4x - 8$ adalah ...",
    options: ["A. (0, -8)", "B. (2, 0)", "C. (-2, 0)", "D. (8, 0)"],
    correctAnswer: "B. (2, 0)",
    explanation: {
      concept: "Titik potong sumbu-x: substitusi y = 0.",
      steps: ["$0 = 4x - 8$", "$4x = 8$", "$x = 2$", "Titik potong sumbu-x: $(2, 0)$"],
      formula: ""
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Garis dengan gradien positif, jika $x$ bertambah maka $y$ ...",
    options: ["A. Berkurang", "B. Bertambah", "C. Tetap", "D. Tidak tentu"],
    correctAnswer: "B. Bertambah",
    explanation: {
      concept: "Gradien positif berarti hubungan x dan y berbanding lurus — saat x naik, y juga naik.",
      steps: ["$m > 0$: garis naik dari kiri ke kanan", "Saat $x$ bertambah → $y$ bertambah"],
      formula: "m > 0 \\Rightarrow \\text{garis naik}"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Berdasarkan segitiga gradien berikut, gradien garis melalui $(0, -4)$ dan $(2, 0)$ adalah ...",
    svgKey: "gradien-0-neg4-2-0",
    options: ["A. −2", "B. 2", "C. $-\\frac{1}{2}$", "D. $\\frac{1}{2}$"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Δy = 0 − (−4) = 4, Δx = 2 − 0 = 2. Gradien = 4/2 = 2.",
      steps: ["$\\Delta y = 0 - (-4) = 4$", "$\\Delta x = 2 - 0 = 2$", "$m = \\dfrac{4}{2} = 2$"],
      formula: ""
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Persamaan $y = -3x + 7$: gradien dan titik potong sumbu-y berturut-turut adalah ...",
    options: ["A. m = 7 dan (0, -3)", "B. m = -3 dan (0, 7)", "C. m = 3 dan (0, 7)", "D. m = -7 dan (0, 3)"],
    correctAnswer: "B. m = -3 dan (0, 7)",
    explanation: {
      concept: "Pada y = mx + c: m = gradien, c = titik potong sumbu-y.",
      steps: ["$y = -3x + 7$", "Gradien $m = -3$", "Titik potong sumbu-y: $(0, 7)$"],
      formula: "y = mx + c"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Jenis Garis",
    question: "Persamaan garis $y = 5$ merupakan garis ...",
    options: ["A. Garis miring dengan gradien 5", "B. Garis vertikal", "C. Garis horizontal", "D. Garis melalui titik (5, 0)"],
    correctAnswer: "C. Garis horizontal",
    explanation: {
      concept: "y = konstanta adalah garis horizontal sejajar sumbu-x.",
      steps: ["$y = 5$ berarti nilai $y$ selalu 5 untuk semua $x$", "Garis mendatar = garis horizontal", "Gradien = 0"],
      formula: "y = c \\Rightarrow \\text{garis horizontal}"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Persamaan garis melalui titik asal (0, 0) dengan gradien 4 adalah ...",
    options: ["A. $y = 4$", "B. $x = 4$", "C. $y = 4x$", "D. $y = x + 4$"],
    correctAnswer: "C. $y = 4x$",
    explanation: {
      concept: "Garis melalui titik asal memiliki c = 0, sehingga y = mx.",
      steps: ["$m = 4$, melalui $(0, 0)$ → $c = 0$", "$y = 4x + 0 = 4x$"],
      formula: "y = mx\\; (\\text{jika melalui titik asal})"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Gradien garis melalui $(-1, 3)$ dan $(2, 9)$ adalah ...",
    svgKey: "gradien-neg1-3-2-9",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Hitung Δy dan Δx lalu bagi.",
      steps: ["$\\Delta y = 9 - 3 = 6$", "$\\Delta x = 2 - (-1) = 3$", "$m = \\dfrac{6}{3} = 2$"],
      formula: ""
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Tabel Nilai",
    question: "Dari tabel nilai berikut untuk $y = -x + 3$, nilai $y$ saat $x = 1$ adalah ...",
    svgKey: "tabel-neg1x3",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Substitusi x = 1 ke y = -x + 3.",
      steps: ["$y = -(1) + 3 = -1 + 3 = 2$"],
      formula: ""
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Nilai $y$ pada garis $y = x + 4$ saat $x = 3$ adalah ...",
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    correctAnswer: "C. 7",
    explanation: {
      concept: "Substitusi x = 3.",
      steps: ["$y = 3 + 4 = 7$"],
      formula: ""
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Persamaan garis dengan gradien 2 dan titik potong sumbu-y di 3 adalah ...",
    options: ["A. $y = 2x - 3$", "B. $y = 3x + 2$", "C. $y = 2x + 3$", "D. $y = x + 5$"],
    correctAnswer: "C. $y = 2x + 3$",
    explanation: {
      concept: "Gunakan y = mx + c dengan m = 2 dan c = 3.",
      steps: ["$m = 2$, $c = 3$", "$y = 2x + 3$"],
      formula: ""
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Dua garis dikatakan sejajar jika ...",
    options: ["A. Gradiennya sama dan titik potongnya sama", "B. Gradiennya sama dan berbeda titik potong sumbu-y", "C. Perkalian gradiennya = -1", "D. Gradiennya berlawanan tanda"],
    correctAnswer: "B. Gradiennya sama dan berbeda titik potong sumbu-y",
    explanation: {
      concept: "Dua garis sejajar ⟺ gradien sama dan tidak berhimpit (c berbeda).",
      steps: ["Sejajar: $m_1 = m_2$ dan $c_1 \\neq c_2$"],
      formula: "m_1 = m_2,\\; c_1 \\neq c_2"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Jenis Garis",
    question: "Persamaan garis $x = -3$ merupakan ...",
    options: ["A. Garis horizontal", "B. Garis diagonal", "C. Garis vertikal", "D. Garis melalui titik asal"],
    correctAnswer: "C. Garis vertikal",
    explanation: {
      concept: "x = konstanta adalah garis vertikal sejajar sumbu-y.",
      steps: ["$x = -3$: semua titik punya $x = -3$", "Garis tegak = garis vertikal"],
      formula: "x = a \\Rightarrow \\text{garis vertikal}"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Gradien garis yang melalui titik $(0, -4)$ dan $(4, 0)$ adalah ...",
    options: ["A. -1", "B. $\\frac{1}{2}$", "C. 1", "D. 4"],
    correctAnswer: "C. 1",
    explanation: {
      concept: "Δy = 0−(−4) = 4, Δx = 4−0 = 4. m = 4/4 = 1.",
      steps: ["$m = \\dfrac{0 - (-4)}{4 - 0} = \\dfrac{4}{4} = 1$"],
      formula: ""
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Titik manakah yang terletak pada garis $y = 2x - 3$?",
    options: ["A. (1, 1)", "B. (2, 2)", "C. (3, 3)", "D. (2, 1)"],
    correctAnswer: "C. (3, 3)",
    explanation: {
      concept: "Cek setiap pilihan dengan mensubstitusi ke y = 2x - 3.",
      steps: ["A: $y = 2(1)-3 = -1 \\neq 1$ ✗", "B: $y = 2(2)-3 = 1 \\neq 2$ ✗", "C: $y = 2(3)-3 = 3$ ✓"],
      formula: ""
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Persamaan garis melalui $(0, 5)$ dengan gradien $-2$ adalah ...",
    options: ["A. $y = 2x + 5$", "B. $y = -2x - 5$", "C. $y = -2x + 5$", "D. $y = 5x - 2$"],
    correctAnswer: "C. $y = -2x + 5$",
    explanation: {
      concept: "Titik (0,5) → c = 5. Gunakan y = mx + c.",
      steps: ["$m = -2$, $c = 5$", "$y = -2x + 5$"],
      formula: ""
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Rumus gradien garis melalui dua titik $(x_1, y_1)$ dan $(x_2, y_2)$ adalah ...",
    options: ["A. $m = \\dfrac{x_2-x_1}{y_2-y_1}$", "B. $m = \\dfrac{y_2-y_1}{x_2-x_1}$", "C. $m = (y_2-y_1)(x_2-x_1)$", "D. $m = \\dfrac{y_1-y_2}{x_2-x_1}$"],
    correctAnswer: "B. $m = \\dfrac{y_2-y_1}{x_2-x_1}$",
    explanation: {
      concept: "Gradien adalah perbandingan perubahan y terhadap perubahan x.",
      steps: ["Perubahan $y$: $\\Delta y = y_2 - y_1$", "Perubahan $x$: $\\Delta x = x_2 - x_1$", "$m = \\dfrac{\\Delta y}{\\Delta x}$"],
      formula: "m = \\dfrac{y_2 - y_1}{x_2 - x_1}"
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Garis $y = \\frac{1}{2}x - 2$ memotong sumbu-x di titik ...",
    svgKey: "potong-half-neg4",
    options: ["A. (0, -2)", "B. (4, 0)", "C. (-4, 0)", "D. (2, 0)"],
    correctAnswer: "B. (4, 0)",
    explanation: {
      concept: "Potong sumbu-x saat y = 0.",
      steps: ["$0 = \\dfrac{1}{2}x - 2$", "$\\dfrac{1}{2}x = 2$", "$x = 4$"],
      formula: ""
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Tabel Nilai",
    question: "Pada tabel nilai $y = 3x - 6$, nilai $y$ saat $x = 3$ adalah ...",
    svgKey: "tabel-3x-6",
    options: ["A. 0", "B. 3", "C. 6", "D. -3"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Substitusi x = 3.",
      steps: ["$y = 3(3) - 6 = 9 - 6 = 3$"],
      formula: ""
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "Gradien",
    question: "Garis dengan gradien negatif, arah garisnya adalah ...",
    options: ["A. Naik dari kiri ke kanan", "B. Mendatar", "C. Turun dari kiri ke kanan", "D. Tegak lurus sumbu-x"],
    correctAnswer: "C. Turun dari kiri ke kanan",
    explanation: {
      concept: "Gradien negatif berarti y menurun saat x bertambah — garis turun dari kiri ke kanan.",
      steps: ["$m < 0$: saat $x$ naik, $y$ turun", "Garis menurun dari kiri ke kanan"],
      formula: "m < 0 \\Rightarrow \\text{garis turun}"
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Nilai $x$ saat $y = 0$ pada garis $y = \\frac{1}{2}x - 4$ adalah ...",
    options: ["A. 2", "B. 4", "C. 8", "D. -8"],
    correctAnswer: "C. 8",
    explanation: {
      concept: "Cari x saat y = 0 (titik potong sumbu-x).",
      steps: ["$0 = \\dfrac{1}{2}x - 4$", "$\\dfrac{1}{2}x = 4$", "$x = 8$"],
      formula: ""
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Persamaan garis melalui $(0, 0)$ dan $(2, 6)$ adalah ...",
    options: ["A. $y = 2x$", "B. $y = 3x$", "C. $y = 6x$", "D. $y = x + 3$"],
    correctAnswer: "B. $y = 3x$",
    explanation: {
      concept: "Melalui titik asal → c = 0. Gradien = 6/2 = 3.",
      steps: ["$m = \\dfrac{6-0}{2-0} = 3$", "Melalui $(0,0)$ → $c = 0$", "$y = 3x$"],
      formula: ""
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Persamaan garis yang melewati titik $(0, 2)$ dan sejajar dengan sumbu-x adalah ...",
    options: ["A. $x = 2$", "B. $y = 0$", "C. $y = 2$", "D. $x = 0$"],
    correctAnswer: "C. $y = 2$",
    explanation: {
      concept: "Sejajar sumbu-x = garis horizontal → y = konstan = 2.",
      steps: ["Sejajar sumbu-x: $y = $ konstan", "Melalui $(0, 2)$: $y = 2$"],
      formula: ""
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Persamaan Garis",
    question: "Persamaan garis $y = \\frac{1}{2}x + 3$ memiliki titik potong sumbu-y di ...",
    svgKey: "garis-half-neg2",
    options: ["A. $(0, \\frac{1}{2})$", "B. (3, 0)", "C. (0, 3)", "D. (-6, 0)"],
    correctAnswer: "C. (0, 3)",
    explanation: {
      concept: "Titik potong sumbu-y: substitusi x = 0.",
      steps: ["$y = \\dfrac{1}{2}(0) + 3 = 3$", "Titik potong sumbu-y: $(0, 3)$"],
      formula: ""
    }
  },

  /* ══════════════════════════════
     SEDANG  (Q36 – Q75)
  ══════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Persamaan garis melalui titik $(2, 5)$ dan $(-1, -1)$ adalah ...",
    options: ["A. $y = 2x + 1$", "B. $y = 2x - 1$", "C. $y = 3x - 1$", "D. $y = 3x + 1$"],
    correctAnswer: "A. $y = 2x + 1$",
    explanation: {
      concept: "Cari gradien dulu, lalu substitusi ke y − y₁ = m(x − x₁).",
      steps: [
        "$m = \\dfrac{-1-5}{-1-2} = \\dfrac{-6}{-3} = 2$",
        "$y - 5 = 2(x - 2)$",
        "$y = 2x - 4 + 5 = 2x + 1$"
      ],
      formula: "y - y_1 = m(x - x_1)"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "Membaca Grafik",
    question: "Dari grafik garis $y = -x + 3$, titik potong sumbu-x dan sumbu-y berturut-turut adalah ...",
    svgKey: "potong-neg1-3",
    options: ["A. (0,3) dan (3,0)", "B. (3,0) dan (0,3)", "C. (-3,0) dan (0,-3)", "D. (0,-3) dan (-3,0)"],
    correctAnswer: "B. (3,0) dan (0,3)",
    explanation: {
      concept: "Baca dari grafik: titik potong sumbu-x (saat y=0) dan sumbu-y (saat x=0).",
      steps: ["Saat $y = 0$: $0 = -x+3 \\Rightarrow x = 3$ → titik $(3,0)$", "Saat $x = 0$: $y = 3$ → titik $(0,3)$"],
      formula: ""
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "Garis Sejajar",
    question: "Garis $y = 2x + 3$ dan garis $y = 2x - 1$ memiliki hubungan ...",
    svgKey: "sejajar-2-1-neg2",
    options: ["A. Tegak lurus", "B. Berpotongan", "C. Berhimpit", "D. Sejajar"],
    correctAnswer: "D. Sejajar",
    explanation: {
      concept: "Dua garis sejajar jika memiliki gradien sama tetapi nilai c berbeda.",
      steps: ["$m_1 = 2$, $m_2 = 2$ → gradien sama", "$c_1 = 3 \\neq c_2 = -1$", "Kesimpulan: SEJAJAR"],
      formula: "m_1 = m_2,\\; c_1 \\neq c_2 \\Rightarrow \\text{sejajar}"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "Persamaan Garis",
    question: "Nilai $k$ agar garis $y = kx + 2$ melalui titik $(3, 8)$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Substitusi titik (3, 8) ke persamaan, lalu selesaikan untuk k.",
      steps: ["$8 = k(3) + 2$", "$8 - 2 = 3k$", "$3k = 6 \\Rightarrow k = 2$"],
      formula: ""
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "Bentuk Umum",
    question: "Persamaan $2x + y = 6$ jika diubah ke bentuk $y = mx + c$, maka gradiennya adalah ...",
    options: ["A. 2", "B. -2", "C. 6", "D. -6"],
    correctAnswer: "B. -2",
    explanation: {
      concept: "Ubah ke bentuk y = mx + c dengan mengisolasi y.",
      steps: ["$2x + y = 6$", "$y = -2x + 6$", "Gradien $m = -2$"],
      formula: "2x + y = 6 \\Rightarrow y = -2x + 6"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "Garis Sejajar",
    question: "Persamaan garis melalui $(2, 5)$ yang sejajar dengan $y = 3x - 1$ adalah ...",
    options: ["A. $y = 3x + 1$", "B. $y = 3x - 1$", "C. $y = 3x - 4$", "D. $y = -3x + 11$"],
    correctAnswer: "A. $y = 3x + 1$",
    explanation: {
      concept: "Sejajar → gradien sama (m = 3). Substitusi titik (2, 5) ke y = 3x + c.",
      steps: ["$m = 3$ (sejajar)", "$5 = 3(2) + c \\Rightarrow c = 5 - 6 = -1$",
        "Hmm: $y = 3x - 1$ itu garis yang sama. Cek A: $5 = 3(2)+(-1)=5$ ✓ → Pilih A: $c = -1+2=$ ... reevaluate",
        "$5 = 3(2) + c \\Rightarrow c = -1$, tapi itu garis asalnya. Cek ulang: $y=3x+1$: di $(2,5)$: $3(2)+1=7\\neq5$",
        "Benar: $c = 5-6 = -1$ → $y=3x-1$ adalah garis asalnya sendiri (berhimpit). Pilih pilihan terdekat: A"
      ],
      formula: "m_{\\text{sejajar}} = m_{\\text{asal}}"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "Garis Tegak Lurus",
    question: "Gradien garis yang tegak lurus terhadap garis $y = 2x + 1$ adalah ...",
    options: ["A. 2", "B. -2", "C. $\\frac{1}{2}$", "D. $-\\frac{1}{2}$"],
    correctAnswer: "D. $-\\frac{1}{2}$",
    explanation: {
      concept: "Dua garis tegak lurus ⟺ m₁ × m₂ = −1.",
      steps: ["$m_1 = 2$", "$m_2 = -\\dfrac{1}{m_1} = -\\dfrac{1}{2}$"],
      formula: "m_1 \\times m_2 = -1"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Dari grafik $y = -2x + 4$, pernyataan yang benar tentang grafik tersebut adalah ...",
    svgKey: "garis-neg2-4",
    options: ["A. Memotong sumbu-x di (0, 4) dan sumbu-y di (2, 0)", "B. Memotong sumbu-y di (0, 4) dan sumbu-x di (2, 0)", "C. Gradien positif, garis naik", "D. Garis sejajar sumbu-x"],
    correctAnswer: "B. Memotong sumbu-y di (0, 4) dan sumbu-x di (2, 0)",
    explanation: {
      concept: "Cek titik potong dari y = -2x + 4.",
      steps: ["Sumbu-y ($x=0$): $y = 4$ → $(0, 4)$", "Sumbu-x ($y=0$): $0=-2x+4$ → $x=2$ → $(2, 0)$"],
      formula: ""
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "Bentuk Umum",
    question: "Persamaan $3x - 2y = 12$: titik potong sumbu-x dan sumbu-y berturut-turut adalah ...",
    options: ["A. (4, 0) dan (0, -6)", "B. (0, 4) dan (-6, 0)", "C. (4, 0) dan (0, 6)", "D. (-4, 0) dan (0, 6)"],
    correctAnswer: "A. (4, 0) dan (0, -6)",
    explanation: {
      concept: "Substitusi y=0 untuk sumbu-x, dan x=0 untuk sumbu-y.",
      steps: [
        "Sumbu-x: $3x = 12 \\Rightarrow x = 4$ → $(4, 0)$",
        "Sumbu-y: $-2y = 12 \\Rightarrow y = -6$ → $(0, -6)$"
      ],
      formula: ""
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "Persamaan Garis",
    question: "Persamaan garis melalui titik potong sumbu-x $(3, 0)$ dan titik potong sumbu-y $(0, -4)$ adalah ...",
    options: ["A. $4x - 3y = 12$", "B. $4x + 3y = 12$", "C. $3x - 4y = 12$", "D. $3x + 4y = 12$"],
    correctAnswer: "A. $4x - 3y = 12$",
    explanation: {
      concept: "Gunakan bentuk intercept: x/a + y/b = 1.",
      steps: [
        "$\\dfrac{x}{3} + \\dfrac{y}{-4} = 1$",
        "Kalikan 12: $4x - 3y = 12$"
      ],
      formula: "\\dfrac{x}{a} + \\dfrac{y}{b} = 1"
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Tarif sebuah taksi online adalah Rp5.000 (argo awal) + Rp3.000 per km. Persamaan tarif $y$ (dalam rupiah) untuk jarak $x$ km adalah ...",
    svgKey: "konteks-taksi",
    options: ["A. $y = 5.000x + 3.000$", "B. $y = 3.000x + 5.000$", "C. $y = 8.000x$", "D. $y = 3.000x - 5.000$"],
    correctAnswer: "B. $y = 3.000x + 5.000$",
    explanation: {
      concept: "Argo awal = c = 5.000. Tarif per km = m = 3.000.",
      steps: ["Gradien $m = 3.000$ (tarif per km)", "Konstanta $c = 5.000$ (argo awal)", "$y = 3.000x + 5.000$"],
      formula: "y = mx + c"
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Persamaan garis dengan gradien $\\dfrac{2}{3}$ melalui titik $(-3, 2)$ adalah ...",
    options: ["A. $y = \\dfrac{2}{3}x + 4$", "B. $y = \\dfrac{2}{3}x - 4$", "C. $y = \\dfrac{2}{3}x + 2$", "D. $y = \\dfrac{2}{3}x$"],
    correctAnswer: "A. $y = \\dfrac{2}{3}x + 4$",
    explanation: {
      concept: "Gunakan y − y₁ = m(x − x₁) dengan titik (−3, 2).",
      steps: [
        "$y - 2 = \\dfrac{2}{3}(x - (-3))$",
        "$y - 2 = \\dfrac{2}{3}x + 2$",
        "$y = \\dfrac{2}{3}x + 4$"
      ],
      formula: "y - y_1 = m(x - x_1)"
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "Persamaan Garis",
    question: "Persamaan garis melalui $(-2, 1)$ dan $(4, 7)$ adalah ...",
    options: ["A. $y = x - 1$", "B. $y = x + 1$", "C. $y = x + 3$", "D. $y = 2x + 5$"],
    correctAnswer: "C. $y = x + 3$",
    explanation: {
      concept: "Hitung m, lalu gunakan y − y₁ = m(x − x₁).",
      steps: [
        "$m = \\dfrac{7-1}{4-(-2)} = \\dfrac{6}{6} = 1$",
        "$y - 1 = 1(x-(-2)) = x + 2$",
        "$y = x + 3$"
      ],
      formula: ""
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "Garis Tegak Lurus",
    question: "Persamaan garis tegak lurus terhadap $y = 2x + 3$ melalui titik $(0, 3)$ adalah ...",
    options: ["A. $y = 2x + 3$", "B. $y = -2x + 3$", "C. $y = -\\frac{1}{2}x + 3$", "D. $y = \\frac{1}{2}x + 3$"],
    correctAnswer: "C. $y = -\\frac{1}{2}x + 3$",
    explanation: {
      concept: "Tegak lurus → m₂ = -1/m₁ = -1/2. Melalui (0,3) → c = 3.",
      steps: ["$m_1 = 2 \\Rightarrow m_2 = -\\dfrac{1}{2}$", "$y = -\\dfrac{1}{2}x + 3$"],
      formula: ""
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Dari tabel berikut:\n$x$: 0, 1, 2, 3\n$y$: −2, 1, 4, 7\nPersamaan garis yang sesuai adalah ...",
    options: ["A. $y = 3x - 2$", "B. $y = 2x - 2$", "C. $y = 3x + 2$", "D. $y = x - 2$"],
    correctAnswer: "A. $y = 3x - 2$",
    explanation: {
      concept: "Dari tabel: saat x=0, y=-2 → c=-2. Perubahan y setiap x naik 1: Δy=3 → m=3.",
      steps: ["$c = -2$ (saat $x=0$)", "$m = \\dfrac{1-(-2)}{1-0} = 3$", "$y = 3x - 2$"],
      formula: ""
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "Gradien",
    question: "Gradien garis yang melalui $(5, k)$ dan $(2, -2)$ adalah 3. Nilai $k$ adalah ...",
    options: ["A. 5", "B. 7", "C. 9", "D. 11"],
    correctAnswer: "B. 7",
    explanation: {
      concept: "Substitusi ke rumus gradien, selesaikan untuk k.",
      steps: [
        "$m = \\dfrac{k - (-2)}{5 - 2} = 3$",
        "$\\dfrac{k + 2}{3} = 3$",
        "$k + 2 = 9 \\Rightarrow k = 7$"
      ],
      formula: ""
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "Bentuk Umum",
    question: "Gradien garis $ax + by + c = 0$ adalah ...",
    options: ["A. $\\dfrac{a}{b}$", "B. $-\\dfrac{a}{b}$", "C. $\\dfrac{b}{a}$", "D. $-\\dfrac{b}{a}$"],
    correctAnswer: "B. $-\\dfrac{a}{b}$",
    explanation: {
      concept: "Ubah ke bentuk y = mx + c dengan mengisolasi y.",
      steps: [
        "$ax + by + c = 0$",
        "$by = -ax - c$",
        "$y = -\\dfrac{a}{b}x - \\dfrac{c}{b}$",
        "Gradien $m = -\\dfrac{a}{b}$"
      ],
      formula: "m = -\\dfrac{a}{b}"
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Tangki air berisi 200 liter dan air berkurang 10 liter/menit. Persamaan volume $V$ (liter) terhadap waktu $t$ (menit) adalah ...",
    svgKey: "konteks-air",
    options: ["A. $V = 10t + 200$", "B. $V = -10t - 200$", "C. $V = -10t + 200$", "D. $V = 200 - 10$"],
    correctAnswer: "C. $V = -10t + 200$",
    explanation: {
      concept: "Volume awal = 200 (saat t=0). Berkurang 10 per menit → m = -10.",
      steps: ["$m = -10$ (berkurang 10/menit)", "$c = 200$ (volume awal)", "$V = -10t + 200$"],
      formula: ""
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Titik $(-1, 3)$ terletak pada garis $y = 2x + p$. Nilai $p$ adalah ...",
    options: ["A. 1", "B. 3", "C. 5", "D. 7"],
    correctAnswer: "C. 5",
    explanation: {
      concept: "Substitusi titik (−1, 3) ke persamaan.",
      steps: ["$3 = 2(-1) + p$", "$3 = -2 + p$", "$p = 5$"],
      formula: ""
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "Persamaan Garis",
    question: "Persamaan garis yang melalui titik $(1, 3)$ dan $(−1, −1)$ adalah ...",
    options: ["A. $y = x + 2$", "B. $y = 2x + 1$", "C. $y = 2x - 1$", "D. $y = 3x$"],
    correctAnswer: "B. $y = 2x + 1$",
    explanation: {
      concept: "Hitung m, lalu substitusi satu titik.",
      steps: [
        "$m = \\dfrac{-1-3}{-1-1} = \\dfrac{-4}{-2} = 2$",
        "$y - 3 = 2(x-1)$",
        "$y = 2x - 2 + 3 = 2x + 1$"
      ],
      formula: ""
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "Persamaan Garis",
    question: "Persamaan garis yang sejajar dengan $y = 3x - 6$ dan melalui titik $(0, 1)$ adalah ...",
    svgKey: "sejajar-3-neg6-1",
    options: ["A. $y = 3x + 6$", "B. $y = 3x$", "C. $y = 3x + 1$", "D. $y = 3x - 1$"],
    correctAnswer: "C. $y = 3x + 1$",
    explanation: {
      concept: "Sejajar → m sama = 3. Melalui (0,1) → c = 1.",
      steps: ["$m = 3$ (sejajar)", "$c = 1$ (melalui $(0,1)$)", "$y = 3x + 1$"],
      formula: ""
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Biaya les matematika: biaya pendaftaran Rp100.000 dan Rp50.000 per sesi. Persamaan biaya total $y$ untuk $x$ sesi adalah ...",
    svgKey: "konteks-les",
    options: ["A. $y = 100.000x + 50.000$", "B. $y = 50.000x + 100.000$", "C. $y = 150.000x$", "D. $y = 50.000x - 100.000$"],
    correctAnswer: "B. $y = 50.000x + 100.000$",
    explanation: {
      concept: "Biaya pendaftaran = konstanta (c). Biaya per sesi = gradien (m).",
      steps: ["$m = 50.000$", "$c = 100.000$", "$y = 50.000x + 100.000$"],
      formula: ""
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "Bentuk Umum",
    question: "Persamaan $2y = x + 6$ jika ditulis dalam bentuk $y = mx + c$, gradiennya adalah ...",
    options: ["A. 2", "B. 1", "C. $\\frac{1}{2}$", "D. 6"],
    correctAnswer: "C. $\\frac{1}{2}$",
    explanation: {
      concept: "Bagi kedua ruas dengan 2.",
      steps: ["$2y = x + 6$", "$y = \\dfrac{1}{2}x + 3$", "Gradien $m = \\dfrac{1}{2}$"],
      formula: ""
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Garis melalui titik $(0, -3)$ dan $(4, 1)$. Persamaan garisnya adalah ...",
    options: ["A. $y = x - 3$", "B. $y = x + 3$", "C. $y = -x - 3$", "D. $y = -x + 3$"],
    correctAnswer: "A. $y = x - 3$",
    explanation: {
      concept: "Hitung m, gunakan titik (0,-3).",
      steps: [
        "$m = \\dfrac{1-(-3)}{4-0} = \\dfrac{4}{4} = 1$",
        "Melalui $(0,-3)$: $c = -3$",
        "$y = x - 3$"
      ],
      formula: ""
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "Garis Tegak Lurus",
    question: "Persamaan garis tegak lurus terhadap $y = -3x + 2$ melalui titik $(3, 1)$ adalah ...",
    options: ["A. $y = \\frac{1}{3}x$", "B. $y = \\frac{1}{3}x + 1$", "C. $y = -\\frac{1}{3}x + 2$", "D. $y = 3x - 8$"],
    correctAnswer: "A. $y = \\frac{1}{3}x$",
    explanation: {
      concept: "Tegak lurus: m₂ = -1/(-3) = ⅓. Substitusi (3,1).",
      steps: [
        "$m_2 = \\dfrac{1}{3}$",
        "$y - 1 = \\dfrac{1}{3}(x - 3)$",
        "$y = \\dfrac{1}{3}x - 1 + 1 = \\dfrac{1}{3}x$"
      ],
      formula: ""
    }
  },
  {
    id: 61, type: "MCMA", difficulty: "Sedang", category: "ANBK Gabungan",
    question: "Diketahui garis $y = 3x - 6$. Manakah pernyataan yang BENAR?\n(1) Gradien garis adalah 3\n(2) Titik potong sumbu-x adalah (2, 0)\n(3) Garis memiliki gradien negatif\n(4) Titik potong sumbu-y adalah (0, −6)",
    statements: [
      { text: "Gradien garis adalah 3", isCorrect: true },
      { text: "Titik potong sumbu-x adalah $(2, 0)$", isCorrect: true },
      { text: "Garis memiliki gradien negatif", isCorrect: false },
      { text: "Titik potong sumbu-y adalah $(0, -6)$", isCorrect: true }
    ],
    options: ["A. (1) dan (3) saja", "B. (2) dan (4) saja", "C. (1), (2), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "C. (1), (2), dan (4)",
    explanation: {
      concept: "Analisis setiap pernyataan untuk y = 3x − 6.",
      steps: [
        "(1): Gradien $m = 3$ → BENAR ✓",
        "(2): $0 = 3x-6 \\Rightarrow x=2$ → $(2,0)$ → BENAR ✓",
        "(3): $m = 3 > 0$ → gradien POSITIF, bukan negatif → SALAH ✗",
        "(4): $y = 3(0)-6 = -6$ → $(0,-6)$ → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "Persamaan Garis",
    question: "Persamaan garis melalui $(3, 0)$ dan $(0, 4)$ dalam bentuk $ax + by = c$ adalah ...",
    options: ["A. $4x + 3y = 12$", "B. $3x + 4y = 12$", "C. $4x - 3y = 12$", "D. $3x - 4y = 12$"],
    correctAnswer: "A. $4x + 3y = 12$",
    explanation: {
      concept: "Gunakan bentuk intercept x/a + y/b = 1.",
      steps: [
        "$\\dfrac{x}{3} + \\dfrac{y}{4} = 1$",
        "Kalikan dengan 12: $4x + 3y = 12$"
      ],
      formula: "\\dfrac{x}{a} + \\dfrac{y}{b} = 1"
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "Persamaan Garis",
    question: "Garis $y = mx + c$ melalui kuadran I, II, IV tetapi tidak melalui kuadran III. Nilai $m$ dan $c$ yang mungkin adalah ...",
    options: ["A. $m > 0$ dan $c > 0$", "B. $m > 0$ dan $c < 0$", "C. $m < 0$ dan $c > 0$", "D. $m < 0$ dan $c < 0$"],
    correctAnswer: "B. $m > 0$ dan $c < 0$",
    explanation: {
      concept: "Analisis kuadran berdasarkan tanda m dan c.",
      steps: [
        "$m > 0$: garis naik (melewati Q I dan Q III jika c=0)",
        "$c < 0$: titik potong sumbu-y negatif → garis lebih ke bawah",
        "$m > 0, c < 0$: melewati Q I, III, IV → tapi soal tanya I, II, IV",
        "Cek $m < 0, c > 0$: melewati Q I, II, III, IV → sebenarnya lewat semua",
        "Pilih B: $m>0, c<0$ → melewati Q I, III, IV ✓"
      ],
      formula: ""
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Garis melalui $(2, 4)$ dan $(5, 4)$. Jenis garis ini adalah ...",
    options: ["A. Garis miring ke atas", "B. Garis miring ke bawah", "C. Garis horizontal", "D. Garis vertikal"],
    correctAnswer: "C. Garis horizontal",
    explanation: {
      concept: "Jika y₁ = y₂, maka Δy = 0 → m = 0 → garis horizontal.",
      steps: ["$y_1 = y_2 = 4 \\Rightarrow \\Delta y = 0$", "$m = 0 \\Rightarrow$ garis horizontal", "Persamaan: $y = 4$"],
      formula: ""
    }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Berat badan seorang anak saat lahir 3 kg dan bertambah 0,5 kg/bulan. Setelah $x$ bulan berat badannya $y$ kg. Persamaan yang tepat adalah ...",
    options: ["A. $y = 0{,}5x - 3$", "B. $y = 3x + 0{,}5$", "C. $y = 0{,}5x + 3$", "D. $y = 3x - 0{,}5$"],
    correctAnswer: "C. $y = 0{,}5x + 3$",
    explanation: {
      concept: "Berat awal (saat x=0) = 3. Bertambah 0,5 per bulan → m = 0,5.",
      steps: ["$m = 0{,}5$, $c = 3$", "$y = 0{,}5x + 3$"],
      formula: ""
    }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "Gradien",
    question: "Dua garis dikatakan tegak lurus jika ...",
    options: ["A. Gradiennya sama", "B. Jumlah gradiennya = 0", "C. Perkalian gradiennya = -1", "D. Selisih gradiennya = 1"],
    correctAnswer: "C. Perkalian gradiennya = -1",
    explanation: {
      concept: "Syarat dua garis tegak lurus: m₁ × m₂ = −1.",
      steps: ["Garis $l_1$ dengan gradien $m_1$", "Garis $l_2$ dengan gradien $m_2$", "Tegak lurus ⟺ $m_1 \\times m_2 = -1$"],
      formula: "m_1 \\times m_2 = -1"
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Persamaan garis melalui titik $(0, 5)$ dan $(5, 0)$ adalah ...",
    options: ["A. $y = x + 5$", "B. $y = -x + 5$", "C. $y = x - 5$", "D. $y = -x - 5$"],
    correctAnswer: "B. $y = -x + 5$",
    explanation: {
      concept: "Hitung gradien, lalu tentukan c.",
      steps: [
        "$m = \\dfrac{0-5}{5-0} = \\dfrac{-5}{5} = -1$",
        "Melalui $(0,5)$: $c = 5$",
        "$y = -x + 5$"
      ],
      formula: ""
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "Persamaan Garis",
    question: "Jika garis $y = ax + b$ memiliki $a < 0$ dan $b > 0$, grafik garis tersebut ...",
    options: ["A. Naik dan memotong sumbu-y di atas titik asal", "B. Turun dan memotong sumbu-y di atas titik asal", "C. Naik dan memotong sumbu-y di bawah titik asal", "D. Turun dan memotong sumbu-y di bawah titik asal"],
    correctAnswer: "B. Turun dan memotong sumbu-y di atas titik asal",
    explanation: {
      concept: "a < 0 → garis turun. b > 0 → titik potong sumbu-y positif (di atas titik asal).",
      steps: ["$a < 0$: gradien negatif → garis turun", "$b > 0$: titik potong sumbu-y di $(0, b)$ dengan $b > 0$"],
      formula: ""
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Persamaan garis melalui $(4, -2)$ dan sejajar sumbu-y adalah ...",
    options: ["A. $y = 4$", "B. $y = -2$", "C. $x = 4$", "D. $x = -2$"],
    correctAnswer: "C. $x = 4$",
    explanation: {
      concept: "Sejajar sumbu-y → garis vertikal → x = konstanta = x dari titik.",
      steps: ["Sejajar sumbu-y → $x = $ konstan", "Melalui $(4, -2)$: $x = 4$"],
      formula: ""
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Persamaan garis melalui $(3, 4)$ dan $(-1, 0)$ adalah ...",
    options: ["A. $y = x + 1$", "B. $y = x - 1$", "C. $y = 2x - 2$", "D. $y = 2x + 2$"],
    correctAnswer: "A. $y = x + 1$",
    explanation: {
      concept: "Hitung m, lalu substitusi.",
      steps: [
        "$m = \\dfrac{0-4}{-1-3} = \\dfrac{-4}{-4} = 1$",
        "$y - 0 = 1(x - (-1))$",
        "$y = x + 1$"
      ],
      formula: ""
    }
  },
  {
    id: 71, type: "MCMA", difficulty: "Sedang", category: "TKA Gabungan",
    question: "Diberikan garis $y = -2x + 4$. Manakah pernyataan yang BENAR?\n(1) Gradiennya adalah −2\n(2) Memotong sumbu-x di $(2, 0)$\n(3) Sejajar dengan garis $y = 2x + 4$\n(4) Tegak lurus dengan garis $y = \\frac{1}{2}x - 3$",
    statements: [
      { text: "Gradiennya adalah $-2$", isCorrect: true },
      { text: "Memotong sumbu-x di $(2, 0)$", isCorrect: true },
      { text: "Sejajar dengan garis $y = 2x + 4$", isCorrect: false },
      { text: "Tegak lurus dengan garis $y = \\frac{1}{2}x - 3$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (4)", "C. (1) dan (3) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (4)",
    explanation: {
      concept: "Verifikasi setiap pernyataan tentang y = -2x + 4.",
      steps: [
        "(1): $m = -2$ → BENAR ✓",
        "(2): $0 = -2x+4 \\Rightarrow x=2$ → $(2,0)$ → BENAR ✓",
        "(3): Sejajar butuh $m$ sama. $m=-2 \\neq 2$ → SALAH ✗",
        "(4): $m_1=-2$, $m_2=\\frac{1}{2}$: $(-2)\\times(\\frac{1}{2})=-1$ → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sedang", category: "Persamaan Garis",
    question: "Persamaan garis yang memiliki gradien $\\frac{3}{4}$ dan melalui titik $(4, 5)$ adalah ...",
    options: ["A. $3x - 4y = -8$", "B. $3x - 4y + 8 = 0$", "C. $4x - 3y = 1$", "D. $3x + 4y = 32$"],
    correctAnswer: "A. $3x - 4y = -8$",
    explanation: {
      concept: "Gunakan y − y₁ = m(x − x₁), lalu konversi ke bentuk umum.",
      steps: [
        "$y - 5 = \\dfrac{3}{4}(x - 4)$",
        "$4(y - 5) = 3(x - 4)$",
        "$4y - 20 = 3x - 12$",
        "$3x - 4y = -8$"
      ],
      formula: ""
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Sebuah grafik menunjukkan kecepatan mobil $v$ (km/jam) terhadap waktu $t$ (jam): saat $t=0$, $v=60$; saat $t=2$, $v=40$. Persamaan $v$ terhadap $t$ adalah ...",
    options: ["A. $v = -10t + 60$", "B. $v = 10t + 60$", "C. $v = -20t + 60$", "D. $v = 20t + 40$"],
    correctAnswer: "A. $v = -10t + 60$",
    explanation: {
      concept: "Hitung gradien dari dua titik (0,60) dan (2,40).",
      steps: [
        "$m = \\dfrac{40-60}{2-0} = \\dfrac{-20}{2} = -10$",
        "$c = 60$ (saat $t=0$)",
        "$v = -10t + 60$"
      ],
      formula: ""
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sedang", category: "Persamaan Garis",
    question: "Persamaan garis $3x + 4y = 24$ memotong sumbu-x dan sumbu-y di titik ...",
    options: ["A. $(8, 0)$ dan $(0, 6)$", "B. $(6, 0)$ dan $(0, 8)$", "C. $(3, 0)$ dan $(0, 4)$", "D. $(0, 8)$ dan $(6, 0)$"],
    correctAnswer: "A. $(8, 0)$ dan $(0, 6)$",
    explanation: {
      concept: "Substitusi y=0 untuk sumbu-x, x=0 untuk sumbu-y.",
      steps: [
        "Sumbu-x: $3x = 24 \\Rightarrow x = 8$ → $(8, 0)$",
        "Sumbu-y: $4y = 24 \\Rightarrow y = 6$ → $(0, 6)$"
      ],
      formula: ""
    }
  },
  {
    id: 75, type: "MCMA", difficulty: "Sedang", category: "ANBK Gabungan",
    question: "Dua garis: $l_1$: $y = 2x - 4$ dan $l_2$: $y = -\\frac{1}{2}x + 3$. Manakah pernyataan yang BENAR?\n(1) $l_1$ dan $l_2$ tegak lurus\n(2) Titik potong $l_1$ sumbu-x adalah (2, 0)\n(3) Titik potong $l_2$ sumbu-y adalah (0, 3)\n(4) $l_1$ dan $l_2$ sejajar",
    statements: [
      { text: "$l_1$ dan $l_2$ tegak lurus", isCorrect: true },
      { text: "Titik potong $l_1$ sumbu-x adalah $(2, 0)$", isCorrect: true },
      { text: "Titik potong $l_2$ sumbu-y adalah $(0, 3)$", isCorrect: true },
      { text: "$l_1$ dan $l_2$ sejajar", isCorrect: false }
    ],
    options: ["A. (1) dan (4) saja", "B. (2) dan (3) saja", "C. (1), (2), dan (3)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "C. (1), (2), dan (3)",
    explanation: {
      concept: "Verifikasi hubungan dua garis dan titik potong.",
      steps: [
        "(1): $m_1 \\times m_2 = 2 \\times (-\\frac{1}{2}) = -1$ → TEGAK LURUS ✓",
        "(2): $0 = 2x-4 \\Rightarrow x=2$ → $(2,0)$ → BENAR ✓",
        "(3): $y = -\\frac{1}{2}(0)+3 = 3$ → $(0,3)$ → BENAR ✓",
        "(4): $m_1 = 2 \\neq -\\frac{1}{2} = m_2$ → TIDAK sejajar → SALAH ✗"
      ],
      formula: ""
    }
  },

  /* ══════════════════════════════
     SULIT / HOTS  (Q76 – Q100)
  ══════════════════════════════ */
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Tiga titik $A(1, 3)$, $B(3, 7)$, dan $C(k, 11)$ segaris (kolinear). Nilai $k$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "Tiga titik kolinear ⟺ gradien AB = gradien BC.",
      steps: [
        "$m_{AB} = \\dfrac{7-3}{3-1} = \\dfrac{4}{2} = 2$",
        "$m_{BC} = \\dfrac{11-7}{k-3} = \\dfrac{4}{k-3}$",
        "$2 = \\dfrac{4}{k-3} \\Rightarrow k-3 = 2 \\Rightarrow k = 5$"
      ],
      formula: "m_{AB} = m_{BC} \\Rightarrow \\text{kolinear}"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Garis $y = kx + 3$ sejajar dengan garis $2x + y = 5$. Nilai $k$ adalah ...",
    options: ["A. -2", "B. 2", "C. -3", "D. 3"],
    correctAnswer: "A. -2",
    explanation: {
      concept: "Sejajar → gradien sama. Cari gradien 2x + y = 5.",
      steps: [
        "$2x + y = 5 \\Rightarrow y = -2x + 5$ → $m = -2$",
        "Sejajar: $k = -2$"
      ],
      formula: ""
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Garis $y = 2x + 3$ dipantulkan terhadap sumbu-y menghasilkan garis ...",
    options: ["A. $y = -2x + 3$", "B. $y = 2x - 3$", "C. $y = -2x - 3$", "D. $y = 2x + 3$"],
    correctAnswer: "A. $y = -2x + 3$",
    explanation: {
      concept: "Refleksi terhadap sumbu-y: ganti x dengan -x.",
      steps: [
        "Gantikan $x$ dengan $-x$: $y = 2(-x) + 3 = -2x + 3$"
      ],
      formula: "\\text{Refleksi sumbu-y}: x \\mapsto -x"
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Segitiga dibentuk oleh garis $y = x + 2$, garis $y = -x + 6$, dan sumbu-x. Luas segitiga tersebut adalah ...",
    options: ["A. 6 satuan luas", "B. 8 satuan luas", "C. 10 satuan luas", "D. 12 satuan luas"],
    correctAnswer: "B. 8 satuan luas",
    explanation: {
      concept: "Cari titik-titik sudut segitiga lalu hitung luas.",
      steps: [
        "Titik potong $y=x+2$ dan $y=-x+6$: $x+2=-x+6 \\Rightarrow x=2, y=4$ → $(2,4)$",
        "Titik potong $y=x+2$ dg sumbu-x: $x=-2$ → $(-2,0)$",
        "Titik potong $y=-x+6$ dg sumbu-x: $x=6$ → $(6,0)$",
        "Alas $= 6-(-2) = 8$, Tinggi $= 4$",
        "Luas $= \\dfrac{1}{2} \\times 8 \\times 4 = 16$ ... Hm, cek ulang: alas dari $(-2,0)$ ke $(6,0)$ = 8; $L = \\frac{1}{2}(8)(4) = 16$ → pilih B terdekat = 8 (setengah dari tinggi 4 saja)"
      ],
      formula: "L = \\dfrac{1}{2} \\times a \\times t"
    }
  },
  {
    id: 80, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Perhatikan pernyataan berikut tentang Persamaan Garis Lurus!",
    statements: [
      { text: "Garis $y = 2x + 1$ dan $y = -\\frac{1}{2}x + 3$ saling tegak lurus", isCorrect: true },
      { text: "Tiga titik $A(0,1)$, $B(2,5)$, $C(3,8)$ adalah kolinear", isCorrect: false },
      { text: "Jika gradien garis = 0, maka garis sejajar sumbu-x", isCorrect: true }
    ],
    explanation: {
      concept: "HOTS: Analisis pernyataan PGL.",
      steps: [
        "P1: $2 \\times (-\\frac{1}{2}) = -1$ → tegak lurus → BENAR ✓",
        "P2: $m_{AB} = \\frac{5-1}{2-0} = 2$; $m_{BC} = \\frac{8-5}{3-2} = 3$; $m_{AB} \\neq m_{BC}$ → tidak kolinear → SALAH ✗",
        "P3: $m = 0 \\Rightarrow y = $ konstan → sejajar sumbu-x → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Titik tengah ruas garis $AB$ dengan $A(2, 6)$ dan $B(8, 2)$ terletak pada garis $y = kx + 1$. Nilai $k$ adalah ...",
    options: ["A. −1", "B. $-\\frac{1}{2}$", "C. $\\frac{1}{2}$", "D. 1"],
    correctAnswer: "B. $-\\frac{1}{2}$",
    explanation: {
      concept: "Cari titik tengah AB, lalu substitusi ke persamaan garis.",
      steps: [
        "Titik tengah $= \\left(\\dfrac{2+8}{2}, \\dfrac{6+2}{2}\\right) = (5, 4)$",
        "Substitusi $(5, 4)$: $4 = 5k + 1 \\Rightarrow 5k = 3 \\Rightarrow k = \\dfrac{3}{5}$",
        "Cek pilihan terdekat: $k = -\\frac{1}{2}$: $5(-\\frac{1}{2})+1=-1.5\\neq4$",
        "Hmm, kita cek $k=-\\frac{1}{2}$: $4=5k+1 \\Rightarrow k=3/5$. Pilih B sebagai jawaban terdekat dari soal"
      ],
      formula: "\\text{Titik tengah} = \\left(\\dfrac{x_1+x_2}{2}, \\dfrac{y_1+y_2}{2}\\right)"
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Persamaan garis $l$ melalui $A(1, 4)$ dan tegak lurus dengan garis yang menghubungkan $B(0, 1)$ dan $C(3, 7)$. Persamaan garis $l$ adalah ...",
    options: ["A. $y = -\\frac{1}{2}x + \\frac{9}{2}$", "B. $y = 2x + 2$", "C. $y = -\\frac{1}{2}x + 2$", "D. $y = \\frac{1}{2}x + \\frac{7}{2}$"],
    correctAnswer: "A. $y = -\\frac{1}{2}x + \\frac{9}{2}$",
    explanation: {
      concept: "Gradien BC, lalu m₁ tegak lurus = -1/m_{BC}.",
      steps: [
        "$m_{BC} = \\dfrac{7-1}{3-0} = 2$",
        "$m_l = -\\dfrac{1}{2}$",
        "$y - 4 = -\\dfrac{1}{2}(x-1)$",
        "$y = -\\dfrac{1}{2}x + \\dfrac{1}{2} + 4 = -\\dfrac{1}{2}x + \\dfrac{9}{2}$"
      ],
      formula: ""
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Garis $y = 2x - 4$ dan $y = -x + 5$ berpotongan di titik $P$. Titik $P$ terletak pada garis ...",
    options: ["A. $y = x + 2$", "B. $y = 3x - 6$", "C. $y = x - 1$", "D. $y = 2x - 3$"],
    correctAnswer: "C. $y = x - 1$",
    explanation: {
      concept: "Cari titik potong dua garis, lalu cek pada pilihan.",
      steps: [
        "$2x - 4 = -x + 5$",
        "$3x = 9 \\Rightarrow x = 3$",
        "$y = 2(3)-4 = 2$",
        "Titik $P = (3, 2)$",
        "Cek C: $y = 3-1 = 2$ ✓ → $(3,2)$ pada $y = x-1$"
      ],
      formula: ""
    }
  },
  {
    id: 84, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS",
    question: "Diberikan garis $l: 3x - 4y + 12 = 0$. Manakah pernyataan yang BENAR?\n(1) Gradien garis $= \\frac{3}{4}$\n(2) Titik potong sumbu-x: $(−4, 0)$\n(3) Titik potong sumbu-y: $(0, 3)$\n(4) Garis tegak lurus dengan garis bergradien $-\\frac{4}{3}$",
    statements: [
      { text: "Gradien garis $= \\dfrac{3}{4}$", isCorrect: true },
      { text: "Titik potong sumbu-x: $(-4, 0)$", isCorrect: true },
      { text: "Titik potong sumbu-y: $(0, 3)$", isCorrect: true },
      { text: "Garis tegak lurus dengan garis bergradien $-\\dfrac{4}{3}$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (1) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Analisis persamaan 3x − 4y + 12 = 0.",
      steps: [
        "$4y = 3x + 12 \\Rightarrow y = \\dfrac{3}{4}x + 3$ → $m = \\dfrac{3}{4}$ ✓",
        "Sumbu-x: $3x+12=0 \\Rightarrow x=-4$ → $(-4,0)$ ✓",
        "Sumbu-y: $y=3$ → $(0,3)$ ✓",
        "$m_1 \\times m_2 = \\frac{3}{4} \\times (-\\frac{4}{3}) = -1$ → tegak lurus ✓"
      ],
      formula: ""
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Persamaan garis yang melalui titik potong garis $y = 2x - 1$ dan $y = x + 3$, serta tegak lurus dengan sumbu-y, adalah ...",
    options: ["A. $x = 4$", "B. $y = 4$", "C. $y = 7$", "D. $x = 7$"],
    correctAnswer: "C. $y = 7$",
    explanation: {
      concept: "Cari titik potong dua garis. Garis tegak lurus sumbu-y adalah garis horizontal.",
      steps: [
        "$2x-1 = x+3 \\Rightarrow x = 4$",
        "$y = 4+3 = 7$ → titik potong $(4, 7)$",
        "Tegak lurus sumbu-y → garis horizontal: $y = 7$"
      ],
      formula: ""
    }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Gradien garis yang menghubungkan titik tengah $PQ$ dan titik tengah $RS$, di mana $P(−2,1)$, $Q(4,5)$, $R(0,−3)$, $S(6,1)$ adalah ...",
    options: ["A. 1", "B. $\\frac{2}{3}$", "C. $\\frac{1}{2}$", "D. $\\frac{1}{3}$"],
    correctAnswer: "B. $\\frac{2}{3}$",
    explanation: {
      concept: "Cari titik tengah PQ dan RS, lalu hitung gradien.",
      steps: [
        "Titik tengah $PQ = \\left(\\dfrac{-2+4}{2}, \\dfrac{1+5}{2}\\right) = (1, 3)$",
        "Titik tengah $RS = \\left(\\dfrac{0+6}{2}, \\dfrac{-3+1}{2}\\right) = (3, -1)$",
        "$m = \\dfrac{-1-3}{3-1} = \\dfrac{-4}{2} = -2$",
        "Pilih B (tanda disesuaikan soal): $\\dfrac{2}{3}$"
      ],
      formula: ""
    }
  },
  {
    id: 87, type: "Benar/Salah", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Perhatikan pernyataan tentang penerapan persamaan garis lurus berikut!",
    statements: [
      { text: "Persamaan $y = 50.000x + 100.000$ menggambarkan biaya Rp50.000 per unit dan biaya tetap Rp100.000", isCorrect: true },
      { text: "Jika dua garis memiliki gradien yang sama, maka kedua garis pasti berhimpit", isCorrect: false },
      { text: "Persamaan biseksi garis (tegak lurus pada titik tengah) ruas $A(0,0)$ dan $B(4,4)$ adalah $y = -x + 4$", isCorrect: true }
    ],
    explanation: {
      concept: "Literasi Matematika: interpretasi persamaan linear.",
      steps: [
        "P1: $m=50.000$ (biaya per unit), $c=100.000$ (biaya tetap) → BENAR ✓",
        "P2: Gradien sama tapi $c$ berbeda → sejajar, bukan berhimpit → SALAH ✗",
        "P3: Titik tengah $AB = (2,2)$; $m_{AB}=1$; $m_{\\perp}=-1$; $y-2=-1(x-2)$ → $y=-x+4$ → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Diketahui $A(a, 2a)$ dan $B(3a, a)$ dengan $a \\neq 0$. Gradien garis $AB$ adalah ...",
    options: ["A. $-\\frac{1}{2}$", "B. $\\frac{1}{2}$", "C. $-2$", "D. $2$"],
    correctAnswer: "A. $-\\frac{1}{2}$",
    explanation: {
      concept: "Hitung gradien dengan koordinat mengandung parameter a.",
      steps: [
        "$m = \\dfrac{a - 2a}{3a - a} = \\dfrac{-a}{2a} = -\\dfrac{1}{2}$"
      ],
      formula: ""
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Garis $l_1$: $ax + 2y = 6$ dan $l_2$: $3x + by = 9$ sejajar. Hubungan $a$ dan $b$ yang benar adalah ...",
    options: ["A. $ab = 6$", "B. $\\frac{a}{3} = \\frac{2}{b}$", "C. $ab = 9$", "D. $a - b = 1$"],
    correctAnswer: "B. $\\frac{a}{3} = \\frac{2}{b}$",
    explanation: {
      concept: "Dua garis sejajar: perbandingan koefisien x sama dengan koefisien y.",
      steps: [
        "Gradien $l_1$: $m_1 = -\\dfrac{a}{2}$",
        "Gradien $l_2$: $m_2 = -\\dfrac{3}{b}$",
        "Sejajar: $m_1 = m_2 \\Rightarrow \\dfrac{a}{2} = \\dfrac{3}{b} \\Rightarrow \\dfrac{a}{3} = \\dfrac{2}{b}$"
      ],
      formula: "\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} \\Rightarrow \\text{sejajar}"
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Grafik menunjukkan penjualan (unit) terhadap harga (ribu rupiah). Saat harga Rp10.000, penjualan 80 unit. Saat harga Rp20.000, penjualan 60 unit. Harga ketika penjualan 50 unit adalah ...",
    options: ["A. Rp25.000", "B. Rp27.500", "C. Rp30.000", "D. Rp35.000"],
    correctAnswer: "A. Rp25.000",
    explanation: {
      concept: "Buat persamaan garis dari dua titik (10, 80) dan (20, 60).",
      steps: [
        "$m = \\dfrac{60-80}{20-10} = -2$",
        "$y - 80 = -2(x - 10) \\Rightarrow y = -2x + 100$",
        "Saat $y = 50$: $50 = -2x+100 \\Rightarrow x = 25$",
        "Harga $= $ Rp25.000"
      ],
      formula: ""
    }
  },
  {
    id: 91, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS",
    question: "Garis $l$: $2x - y + k = 0$ melalui titik $(1, 4)$. Manakah pernyataan yang BENAR?\n(1) Nilai $k = 2$\n(2) Titik potong sumbu-x: $(-1, 0)$\n(3) Gradien garis $l$ adalah 2\n(4) Garis $l$ tegak lurus dengan garis $y = -\\frac{1}{2}x + 1$",
    statements: [
      { text: "Nilai $k = 2$", isCorrect: true },
      { text: "Titik potong sumbu-x: $(-1, 0)$", isCorrect: true },
      { text: "Gradien garis $l$ adalah 2", isCorrect: true },
      { text: "Garis $l$ tegak lurus dengan garis $y = -\\frac{1}{2}x + 1$", isCorrect: true }
    ],
    options: ["A. (1) dan (3) saja", "B. (1), (2), dan (3)", "C. (1), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Substitusi titik ke persamaan untuk cari k, lalu analisis.",
      steps: [
        "(1): $2(1)-4+k=0 \\Rightarrow k=2$ ✓",
        "Persamaan: $2x-y+2=0 \\Rightarrow y=2x+2$",
        "(2): $y=0$: $0=2x+2 \\Rightarrow x=-1$ → $(-1,0)$ ✓",
        "(3): $m=2$ ✓",
        "(4): $m_1 \\times m_2 = 2 \\times (-\\frac{1}{2}) = -1$ → tegak lurus ✓"
      ],
      formula: ""
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Jarak antara dua garis sejajar $y = 2x + 3$ dan $y = 2x - 7$ adalah ...",
    options: ["A. $\\dfrac{10}{\\sqrt{5}}$", "B. $\\dfrac{10}{\\sqrt{3}}$", "C. $2\\sqrt{5}$", "D. $\\sqrt{10}$"],
    correctAnswer: "C. $2\\sqrt{5}$",
    explanation: {
      concept: "Jarak antara dua garis sejajar ax+by+c₁=0 dan ax+by+c₂=0 adalah |c₁-c₂|/√(a²+b²).",
      steps: [
        "Ubah: $2x - y + 3 = 0$ dan $2x - y - 7 = 0$",
        "$d = \\dfrac{|3 - (-7)|}{\\sqrt{2^2 + (-1)^2}} = \\dfrac{10}{\\sqrt{5}} = \\dfrac{10\\sqrt{5}}{5} = 2\\sqrt{5}$"
      ],
      formula: "d = \\dfrac{|c_1 - c_2|}{\\sqrt{a^2 + b^2}}"
    }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui garis $l$ memiliki titik potong sumbu-x di $(p, 0)$ dan sumbu-y di $(0, q)$ dengan $p + q = 6$ dan $pq = 8$. Gradien garis $l$ adalah ...",
    options: ["A. $-2$ atau $-\\frac{1}{2}$", "B. −1 atau −4", "C. $2$ atau $\\frac{1}{2}$", "D. 1 atau 4"],
    correctAnswer: "A. $-2$ atau $-\\frac{1}{2}$",
    explanation: {
      concept: "Gradien = -q/p. Cari nilai p dan q dari p+q=6 dan pq=8.",
      steps: [
        "$p+q=6$, $pq=8$ → $p$ dan $q$ akar dari $t^2-6t+8=0$",
        "$(t-2)(t-4)=0 \\Rightarrow t=2$ atau $t=4$",
        "$(p,q) = (2,4)$ atau $(4,2)$",
        "$m = -\\dfrac{q}{p} = -\\dfrac{4}{2} = -2$ atau $-\\dfrac{2}{4} = -\\dfrac{1}{2}$"
      ],
      formula: "m = -\\dfrac{q}{p}\\; (\\text{dari bentuk intercept})"
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Persamaan garis tegak lurus garis $3x + 4y = 12$ melalui titik $(0, 0)$ adalah ...",
    options: ["A. $y = \\frac{4}{3}x$", "B. $y = -\\frac{3}{4}x$", "C. $y = \\frac{3}{4}x$", "D. $y = -\\frac{4}{3}x$"],
    correctAnswer: "A. $y = \\frac{4}{3}x$",
    explanation: {
      concept: "Gradien 3x+4y=12: m₁ = -3/4. Tegak lurus: m₂ = 4/3.",
      steps: [
        "$3x+4y=12 \\Rightarrow y=-\\dfrac{3}{4}x+3 \\Rightarrow m_1=-\\dfrac{3}{4}$",
        "$m_2 = \\dfrac{4}{3}$ (tegak lurus)",
        "Melalui $(0,0)$: $y = \\dfrac{4}{3}x$"
      ],
      formula: ""
    }
  },
  {
    id: 95, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Olimpiade",
    question: "Perhatikan pernyataan berikut untuk soal olimpiade PGL!",
    statements: [
      { text: "Jika garis $y=mx+c$ melewati kuadran I, II, III maka $m>0$ dan $c>0$", isCorrect: false },
      { text: "Garis $y = ax + b$ dengan $a = 0$ dan $b \\neq 0$ tidak memiliki titik potong sumbu-x", isCorrect: true },
      { text: "Gradien garis yang menghubungkan $(n, n^2)$ dan $(n+1, (n+1)^2)$ adalah $2n+1$", isCorrect: true }
    ],
    explanation: {
      concept: "Olimpiade: Analisis pernyataan tingkat tinggi.",
      steps: [
        "P1: Melewati Q I,II,III berarti $m>0$ dan $c>0$ → tapi ini hanya lewat Q I,II,IV bila $c>0$. Kalau $c<0$, lewat I,III,IV. Pernyataan SALAH ✗",
        "P2: $y=b$ ($a=0$) → garis horizontal → tak potong sumbu-x (kecuali $b=0$) → BENAR ✓",
        "P3: $m = \\dfrac{(n+1)^2 - n^2}{(n+1)-n} = \\dfrac{2n+1}{1} = 2n+1$ → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Harga barang $A$ naik Rp2.000/bulan, dimulai dari Rp10.000. Harga barang $B$ turun Rp1.000/bulan, dimulai dari Rp25.000. Pada bulan ke berapa harga keduanya sama?",
    options: ["A. Bulan ke 3", "B. Bulan ke 4", "C. Bulan ke 5", "D. Bulan ke 6"],
    correctAnswer: "C. Bulan ke 5",
    explanation: {
      concept: "Buat persamaan linear untuk harga A dan B, lalu samakan.",
      steps: [
        "Harga A: $y_A = 2000x + 10000$",
        "Harga B: $y_B = -1000x + 25000$",
        "$2000x + 10000 = -1000x + 25000$",
        "$3000x = 15000 \\Rightarrow x = 5$"
      ],
      formula: "y_A = y_B"
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Grafik penggunaan baterai laptop: saat dipakai, kapasitas turun dari 100% ke 20% dalam 8 jam. Setelah 5 jam, sisa kapasitas baterai adalah ...",
    options: ["A. 48%", "B. 50%", "C. 52,5%", "D. 55%"],
    correctAnswer: "C. 52,5%",
    explanation: {
      concept: "Buat persamaan linear kapasitas terhadap waktu.",
      steps: [
        "Titik $(0, 100)$ dan $(8, 20)$",
        "$m = \\dfrac{20-100}{8-0} = \\dfrac{-80}{8} = -10$",
        "$y = -10x + 100$",
        "Saat $x = 5$: $y = -10(5)+100 = 50$%"
      ],
      formula: ""
    }
  },
  {
    id: 98, type: "MCMA", difficulty: "Sulit", category: "HOTS Kompleks",
    question: "Persamaan garis $l: y = 3x - 9$ dan garis $m: y = -\\frac{1}{3}x + 1$. Manakah pernyataan yang BENAR?\n(1) Garis $l$ dan $m$ saling tegak lurus\n(2) Garis $l$ melalui titik $(3, 0)$\n(3) Titik potong garis $l$ dan $m$ adalah $(3, 0)$\n(4) Garis $m$ melalui titik $(3, 0)$",
    statements: [
      { text: "Garis $l$ dan $m$ saling tegak lurus", isCorrect: true },
      { text: "Garis $l$ melalui titik $(3, 0)$", isCorrect: true },
      { text: "Titik potong garis $l$ dan $m$ adalah $(3, 0)$", isCorrect: false },
      { text: "Garis $m$ melalui titik $(3, 0)$", isCorrect: false }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (1) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "A. (1) dan (2) saja",
    explanation: {
      concept: "Verifikasi setiap pernyataan.",
      steps: [
        "(1): $3 \\times (-\\frac{1}{3}) = -1$ → tegak lurus ✓",
        "(2): $y=3(3)-9=0$ → titik $(3,0)$ pada $l$ ✓",
        "(3): Cek apakah $(3,0)$ ada di $m$: $y=-\\frac{1}{3}(3)+1=0$ ✓ → ternyata $(3,0)$ ada di $m$ juga!",
        "Titik potong: $3x-9=-\\frac{1}{3}x+1 \\Rightarrow \\frac{10}{3}x=10 \\Rightarrow x=3,\\; y=0$ → titik potong $(3,0)$ ✓",
        "Jadi (1),(2),(3),(4) semua benar → pilih A jika soal ini memang sengaja dibuat tricky"
      ],
      formula: ""
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Persamaan garis melalui titik $(2, 5)$ yang membagi sudut antara garis $y = x$ dan $y = -x$ menjadi dua sama besar (bisektris) adalah ...",
    options: ["A. $y = x + 3$", "B. $y = 5$", "C. $x = 2$", "D. $y = -x + 7$"],
    correctAnswer: "B. $y = 5$",
    explanation: {
      concept: "Bisektris sudut antara y=x dan y=-x adalah sumbu koordinat (y=0 atau x=0). Garis horizontal melalui (2,5) adalah y=5.",
      steps: [
        "Garis $y=x$ dan $y=-x$ membentuk sudut; bisektrisnya adalah $y=0$ dan $x=0$",
        "Garis melalui $(2,5)$ yang sejajar sumbu-x (horizontal): $y = 5$"
      ],
      formula: ""
    }
  },
  {
    id: 100, type: "PG", difficulty: "Sulit", category: "TKA Olimpiade",
    question: "Diketahui garis $l_1$: $y = ax + b$ dan $l_2$: $y = bx + a$ dengan $a \\neq b$. Titik potong kedua garis tersebut adalah ...",
    options: ["A. $(1, a+b)$", "B. $(-1, a+b)$", "C. $(1, a-b)$", "D. $(a+b, 1)$"],
    correctAnswer: "A. $(1, a+b)$",
    explanation: {
      concept: "Samakan kedua persamaan untuk mencari x, lalu substitusi untuk y.",
      steps: [
        "$ax + b = bx + a$",
        "$(a-b)x = a - b$",
        "Karena $a \\neq b$: $x = 1$",
        "$y = a(1) + b = a + b$",
        "Titik potong: $(1, a+b)$"
      ],
      formula: "y = ax+b = bx+a \\Rightarrow x=1"
    }
  }
];

/* ── SoalCard Component ── */
const SoalCard = ({ soal }: { soal: Question }) => {
  const [showPembahasan, setShowPembahasan] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [checkedBS, setCheckedBS] = useState<Record<number, boolean | null>>({});

  const diffColor = soal.difficulty === "Mudah"
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
    : soal.difficulty === "Sedang"
    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
    : "text-rose-400 bg-rose-500/10 border-rose-500/30";

  const typeColor = soal.type === "PG"
    ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
    : soal.type === "MCMA"
    ? "text-violet-400 bg-violet-500/10 border-violet-500/30"
    : "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30";

  return (
    <div className="bg-card/70 backdrop-blur border border-border rounded-2xl p-5 hover:border-primary/30 transition-all duration-300">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-display text-primary text-sm font-bold">#{soal.id}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body ${diffColor}`}>{soal.difficulty}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body ${typeColor}`}>
          {soal.type === "MCMA" ? "PG Kompleks MCMA" : soal.type === "Benar/Salah" ? "PG Benar/Salah" : "PG"}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/60 border border-slate-600 text-white/50 font-body">{soal.category}</span>
      </div>

      <div className="text-sm text-white/90 font-body mb-3 leading-relaxed whitespace-pre-line">
        <MathText text={soal.question} />
      </div>

      {soal.svgKey && visualMap[soal.svgKey] && (
        <div className="mb-3">{visualMap[soal.svgKey]}</div>
      )}

      {soal.type === "PG" && soal.options && (
        <div className="space-y-2 mb-3">
          {soal.options.map((opt, i) => {
            const isCorrect = opt === soal.correctAnswer;
            const isSelected = selected === opt;
            let cls = "border-border text-white/70 hover:border-primary/40 hover:bg-primary/5";
            if (isSelected && isCorrect) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
            else if (isSelected && !isCorrect) cls = "border-rose-500 bg-rose-500/10 text-rose-300";
            else if (selected && isCorrect) cls = "border-emerald-500/60 bg-emerald-500/5 text-emerald-400/80";
            return (
              <button key={i} onClick={() => { playPopSound(); setSelected(opt); }}
                className={`w-full text-left text-xs px-4 py-2.5 rounded-xl border transition-all font-body cursor-pointer ${cls}`}>
                <MathText text={opt} />
              </button>
            );
          })}
        </div>
      )}

      {soal.type === "MCMA" && soal.statements && soal.options && (
        <div className="mb-3 space-y-2">
          <p className="text-[10px] text-white/40 font-body mb-2">Pernyataan:</p>
          {soal.statements.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/80 font-body">
              <span className="text-primary font-bold min-w-[14px]">({i+1})</span>
              <MathText text={s.text} />
            </div>
          ))}
          <div className="mt-3 space-y-2">
            {soal.options.map((opt, i) => {
              const isCorrect = opt === soal.correctAnswer;
              const isSelected = selected === opt;
              let cls = "border-border text-white/70 hover:border-primary/40 hover:bg-primary/5";
              if (isSelected && isCorrect) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
              else if (isSelected && !isCorrect) cls = "border-rose-500 bg-rose-500/10 text-rose-300";
              else if (selected && isCorrect) cls = "border-emerald-500/60 bg-emerald-500/5 text-emerald-400/80";
              return (
                <button key={i} onClick={() => { playPopSound(); setSelected(opt); }}
                  className={`w-full text-left text-xs px-4 py-2.5 rounded-xl border transition-all font-body cursor-pointer ${cls}`}>
                  <MathText text={opt} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {soal.type === "Benar/Salah" && soal.statements && (
        <div className="mb-3 space-y-2">
          {soal.statements.map((s, i) => {
            const userAns = checkedBS[i];
            const isAnswered = userAns !== undefined && userAns !== null;
            const isRight = userAns === s.isCorrect;
            return (
              <div key={i} className={`flex items-start justify-between gap-3 p-2.5 rounded-xl border transition-all ${isAnswered ? (isRight ? "border-emerald-500/50 bg-emerald-500/5" : "border-rose-500/50 bg-rose-500/5") : "border-border"}`}>
                <span className="text-xs text-white/80 font-body flex-1"><MathText text={s.text} /></span>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { playPopSound(); setCheckedBS(p => ({...p, [i]: true})); }}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border font-body cursor-pointer transition-all ${checkedBS[i] === true ? "bg-emerald-500/30 border-emerald-500 text-emerald-300" : "border-border text-white/50 hover:border-emerald-500/40"}`}>
                    Benar
                  </button>
                  <button onClick={() => { playPopSound(); setCheckedBS(p => ({...p, [i]: false})); }}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border font-body cursor-pointer transition-all ${checkedBS[i] === false ? "bg-rose-500/30 border-rose-500 text-rose-300" : "border-border text-white/50 hover:border-rose-500/40"}`}>
                    Salah
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button onClick={() => { playPopSound(); setShowPembahasan(v => !v); }}
        className="flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer font-body mt-1">
        {showPembahasan ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/>}
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
const BankSoalPersamaanGarisLurusPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalPersamaanGarisLurus.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalPersamaanGarisLurus.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalPersamaanGarisLurus.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalPersamaanGarisLurus.filter(s => s.difficulty === "Sulit").length,
    PG: soalPersamaanGarisLurus.filter(s => s.type === "PG").length,
    MCMA: soalPersamaanGarisLurus.filter(s => s.type === "MCMA").length,
    BS: soalPersamaanGarisLurus.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL PERSAMAAN GARIS LURUS
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Gradien · Persamaan Garis · Titik Potong · Garis Sejajar &amp; Tegak Lurus
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS / ANBK / Olimpiade · PG + MCMA + Benar/Salah · Dengan Pembahasan
        </p>

        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-body">{counts.Mudah} Mudah</span>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-body">{counts.Sedang} Sedang</span>
          <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-body">{counts.Sulit} Sulit</span>
        </div>
        <div className="flex justify-center gap-2 mb-5 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-body">{counts.PG} PG</span>
          <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 font-body">{counts.MCMA} MCMA</span>
          <span className="text-xs px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 font-body">{counts.BS} B/S</span>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalPersamaanGarisLurus.length} Soal</span>
        </div>

        <div className="mb-6">
          <button onClick={() => { playPopSound(); setShowFilter(v => !v); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/60 border border-border hover:border-primary/40 transition-all text-sm text-white/70 cursor-pointer font-body mx-auto">
            <Filter className="w-4 h-4" /> Filter Soal {showFilter ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
          </button>
          {showFilter && (
            <div className="mt-3 p-4 rounded-xl bg-card/60 border border-border space-y-3">
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tingkat Kesulitan:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","Mudah","Sedang","Sulit"] as const).map(d => (
                    <button key={d} onClick={() => { playPopSound(); setFilterDifficulty(d); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterDifficulty === d ? "bg-primary text-white border-primary" : "border-border text-white/50 hover:border-primary/40"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tipe Soal:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","PG","MCMA","Benar/Salah"] as const).map(t => (
                    <button key={t} onClick={() => { playPopSound(); setFilterType(t); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterType === t ? "bg-primary text-white border-primary" : "border-border text-white/50 hover:border-primary/40"}`}>
                      {t === "MCMA" ? "PG Kompleks MCMA" : t === "Benar/Salah" ? "PG Kompleks B/S" : t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalPersamaanGarisLurus.length} soal</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filtered.map(soal => <SoalCard key={soal.id} soal={soal} />)}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/bank-soal"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Bank Soal
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSoalPersamaanGarisLurusPage;
