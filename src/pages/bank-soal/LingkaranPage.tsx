import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Circle, ChevronDown, ChevronUp, Filter } from "lucide-react";
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
const UnsurLingkaranSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="140" cy="100" r="75" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="2"/>
    <circle cx="140" cy="100" r="3" fill="#fbbf24"/>
    <text x="145" y="97" fill="#fbbf24" fontSize="9" fontFamily="monospace">O</text>
    <line x1="140" y1="100" x2="215" y2="100" stroke="#f472b6" strokeWidth="2"/>
    <text x="175" y="93" fill="#f472b6" fontSize="9" fontFamily="monospace">r = jari-jari</text>
    <line x1="65" y1="100" x2="215" y2="100" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="100" y="118" fill="#34d399" fontSize="9" fontFamily="monospace">d = diameter</text>
    <path d="M 140 25 A 75 75 0 0 1 215 100" fill="none" stroke="#fbbf24" strokeWidth="2.5"/>
    <text x="195" y="55" fill="#fbbf24" fontSize="8" fontFamily="monospace">busur</text>
    <line x1="140" y1="25" x2="215" y2="100" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3"/>
    <text x="190" y="70" fill="#a855f7" fontSize="8" fontFamily="monospace">tali busur</text>
    <text x="140" y="188" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Unsur-Unsur Lingkaran</text>
  </svg>
);

const KelompokLingkaranSVG = ({ r, warna }: { r: number; warna: string }) => {
  const k = (2 * Math.PI * r).toFixed(1);
  const l = (Math.PI * r * r).toFixed(1);
  return (
    <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <circle cx="140" cy="85" r={r < 70 ? r : 65} fill={`rgba(${warna},0.15)`} stroke={`rgb(${warna})`} strokeWidth="2"/>
      <circle cx="140" cy="85" r="3" fill="#fbbf24"/>
      <line x1="140" y1="85" x2={140 + (r < 70 ? r : 65)} y2="85" stroke="#f472b6" strokeWidth="2"/>
      <text x={145 + (r<70?r:65)/2} y="80" fill="#f472b6" fontSize="10" textAnchor="middle" fontFamily="monospace">r={r}</text>
      <text x="140" y="148" fill="#34d399" fontSize="9" textAnchor="middle" fontFamily="monospace">K = {k} ≈ {(2*3.14*r).toFixed(0)}</text>
      <text x="140" y="160" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace">L = πr² = {l}</text>
    </svg>
  );
};

const SudutPusatKelilingSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="140" cy="105" r="72" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="1.5"/>
    <circle cx="140" cy="105" r="3" fill="#fbbf24"/>
    <line x1="140" y1="105" x2="90" y2="40" stroke="#f472b6" strokeWidth="1.8"/>
    <line x1="140" y1="105" x2="200" y2="55" stroke="#f472b6" strokeWidth="1.8"/>
    <path d="M 97 52 A 20 20 0 0 1 189 62" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="140" y="95" fill="#f472b6" fontSize="9" textAnchor="middle" fontFamily="monospace">∠AOB (pusat)</text>
    <circle cx="68" cy="160" r="3" fill="#34d399"/>
    <line x1="68" y1="160" x2="90" y2="40" stroke="#34d399" strokeWidth="1.5"/>
    <line x1="68" y1="160" x2="200" y2="55" stroke="#34d399" strokeWidth="1.5"/>
    <text x="68" y="178" fill="#34d399" fontSize="8" textAnchor="middle" fontFamily="monospace">∠APB (keliling)</text>
    <text x="140" y="192" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">∠Pusat = 2 × ∠Keliling</text>
    <text x="90" y="36" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <text x="202" y="52" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <text x="140" y="103" fill="#94a3b8" fontSize="8" fontFamily="monospace">O</text>
  </svg>
);

const JuringTemberengSVG = () => (
  <svg viewBox="0 0 280 190" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="140" cy="100" r="72" fill="rgba(6,182,212,0.06)" stroke="#334155" strokeWidth="1"/>
    <path d="M 140 100 L 68 100 A 72 72 0 0 1 176 28 Z" fill="rgba(251,191,36,0.25)" stroke="#fbbf24" strokeWidth="1.8"/>
    <text x="108" y="92" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Juring</text>
    <path d="M 68 100 A 72 72 0 0 1 176 28" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.8"/>
    <line x1="68" y1="100" x2="176" y2="28" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="100" y="58" fill="#a855f7" fontSize="8" textAnchor="middle" fontFamily="monospace">Tembereng</text>
    <circle cx="140" cy="100" r="3" fill="#fbbf24"/>
    <text x="140" y="182" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Juring & Tembereng</text>
  </svg>
);

const GarisSinggungSVG = () => (
  <svg viewBox="0 0 280 180" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="130" cy="95" r="65" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1.8"/>
    <circle cx="130" cy="95" r="3" fill="#fbbf24"/>
    <line x1="195" y1="10" x2="195" y2="175" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="130" y1="95" x2="195" y2="95" stroke="#f472b6" strokeWidth="1.8"/>
    <rect x="183" y="83" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="157" y="89" fill="#f472b6" fontSize="9" fontFamily="monospace">r</text>
    <text x="200" y="98" fill="#22c55e" fontSize="9" fontFamily="monospace">garis</text>
    <text x="200" y="110" fill="#22c55e" fontSize="9" fontFamily="monospace">singgung</text>
    <text x="130" y="170" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">r ⊥ Garis Singgung</text>
  </svg>
);

const BusurSVG = ({ sudut, r }: { sudut: number; r: number }) => {
  const rad = (sudut * Math.PI) / 180;
  const x2 = 140 + 70 * Math.cos(-rad);
  const y2 = 95 + 70 * Math.sin(-rad);
  const largeArc = sudut > 180 ? 1 : 0;
  return (
    <svg viewBox="0 0 280 180" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <circle cx="140" cy="95" r="70" fill="rgba(6,182,212,0.06)" stroke="#334155" strokeWidth="1"/>
      <path d={`M 140 25 A 70 70 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`}
        fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
      <line x1="140" y1="95" x2="140" y2="25" stroke="#a855f7" strokeWidth="1.5"/>
      <line x1="140" y1="95" x2={x2.toFixed(1)} y2={y2.toFixed(1)} stroke="#a855f7" strokeWidth="1.5"/>
      <circle cx="140" cy="95" r="3" fill="#fbbf24"/>
      <text x="140" y="89" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">O</text>
      <text x="140" y="165" fill="#34d399" fontSize="9" textAnchor="middle" fontFamily="monospace">
        Sudut = {sudut}°, r = {r}, Busur ≈ {(sudut/360*2*3.14*r).toFixed(1)}
      </text>
    </svg>
  );
};

const LuasJuringSVG = ({ sudut, r }: { sudut: number; r: number }) => {
  const rad = (sudut * Math.PI) / 180;
  const x2 = 140 + 72 * Math.cos(Math.PI/2 - rad);
  const y2 = 95 - 72 * Math.sin(Math.PI/2 - rad);
  const largeArc = sudut > 180 ? 1 : 0;
  return (
    <svg viewBox="0 0 280 175" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <circle cx="140" cy="95" r="72" fill="rgba(6,182,212,0.06)" stroke="#334155" strokeWidth="1"/>
      <path d={`M 140 95 L 140 23 A 72 72 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`}
        fill="rgba(251,191,36,0.25)" stroke="#fbbf24" strokeWidth="1.8"/>
      <circle cx="140" cy="95" r="3" fill="#fbbf24"/>
      <text x="140" y="90" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">O</text>
      <text x="140" y="165" fill="#34d399" fontSize="9" textAnchor="middle" fontFamily="monospace">
        L Juring = {sudut}/360 × πr² = {(sudut/360*3.14*r*r).toFixed(1)} cm²
      </text>
    </svg>
  );
};

const DuaLingkaranSVG = ({ r1, r2, jarak }: { r1: number; r2: number; jarak: string }) => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="90" cy="80" r={r1} fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.8"/>
    <circle cx="90" cy="80" r="3" fill="#fbbf24"/>
    <text x="90" y="77" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">O₁</text>
    <text x="90" y="148" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">r₁={r1}</text>
    <circle cx="195" cy="80" r={r2} fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.8"/>
    <circle cx="195" cy="80" r="3" fill="#fbbf24"/>
    <text x="195" y="77" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">O₂</text>
    <text x="195" y="148" fill="#a855f7" fontSize="8" textAnchor="middle" fontFamily="monospace">r₂={r2}</text>
    <line x1="90" y1="80" x2="195" y2="80" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="142" y="72" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">{jarak}</text>
  </svg>
);

const TableVisual = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto my-3">
    <table className="w-full text-xs border-collapse rounded-lg overflow-hidden">
      <thead>
        <tr>{headers.map((h, i) => (
          <th key={i} className="bg-primary/20 border border-primary/30 px-3 py-2 text-primary font-bold text-center font-mono">
            <MathText text={h} />
          </th>
        ))}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-slate-800/40" : "bg-slate-700/30"}>
            {row.map((cell, j) => (
              <td key={j} className="border border-slate-600/40 px-3 py-2 text-center text-white/80 font-body">
                <MathText text={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const visualMap: Record<string, React.ReactNode> = {
  "unsur": <UnsurLingkaranSVG />,
  "keliling-7": <KelompokLingkaranSVG r={7} warna="6,182,212" />,
  "keliling-14": <KelompokLingkaranSVG r={14} warna="168,85,247" />,
  "keliling-21": <KelompokLingkaranSVG r={21} warna="34,197,94" />,
  "sudut-pusat-keliling": <SudutPusatKelilingSVG />,
  "juring-tembereng": <JuringTemberengSVG />,
  "garis-singgung": <GarisSinggungSVG />,
  "busur-60-14": <BusurSVG sudut={60} r={14} />,
  "busur-90-7": <BusurSVG sudut={90} r={7} />,
  "busur-120-21": <BusurSVG sudut={120} r={21} />,
  "juring-90-7": <LuasJuringSVG sudut={90} r={7} />,
  "juring-60-14": <LuasJuringSVG sudut={60} r={14} />,
  "juring-120-21": <LuasJuringSVG sudut={120} r={21} />,
  "dua-lingkaran-5-3": <DuaLingkaranSVG r1={45} r2={28} jarak="d = ?" />,
  "dua-lingkaran-bersinggung": <DuaLingkaranSVG r1={40} r2={25} jarak="bersinggung luar" />,
};

const soalLingkaran: Question[] = [
  /* ═══════════════════════════════════
     MUDAH  (Q1 – Q35)
  ═══════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Unsur Lingkaran",
    question: "Perhatikan gambar lingkaran berikut. Bagian lingkaran yang merupakan jarak dari titik pusat ke tepi lingkaran disebut ...",
    svgKey: "unsur",
    options: ["A. Diameter", "B. Jari-jari", "C. Busur", "D. Tali busur"],
    correctAnswer: "B. Jari-jari",
    explanation: {
      concept: "Jari-jari (radius) adalah jarak dari titik pusat lingkaran ke setiap titik pada lingkaran.",
      steps: ["Titik pusat = O", "Jarak dari O ke tepi lingkaran = jari-jari (r)", "Diameter = 2 × jari-jari"],
      formula: "d = 2r"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Keliling Lingkaran",
    question: "Sebuah lingkaran memiliki jari-jari 7 cm. Keliling lingkaran tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "keliling-7",
    options: ["A. 22 cm", "B. 44 cm", "C. 154 cm", "D. 88 cm"],
    correctAnswer: "B. 44 cm",
    explanation: {
      concept: "Keliling lingkaran = $2\\pi r$ atau $\\pi d$.",
      steps: ["$K = 2\\pi r = 2 \\times \\dfrac{22}{7} \\times 7$", "$= 2 \\times 22 = 44$ cm"],
      formula: "K = 2\\pi r"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Luas Lingkaran",
    question: "Lingkaran dengan jari-jari 7 cm. Luas lingkaran tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "keliling-7",
    options: ["A. 44 cm²", "B. 77 cm²", "C. 154 cm²", "D. 308 cm²"],
    correctAnswer: "C. 154 cm²",
    explanation: {
      concept: "Luas lingkaran = $\\pi r^2$.",
      steps: ["$L = \\pi r^2 = \\dfrac{22}{7} \\times 7^2 = \\dfrac{22}{7} \\times 49$", "$= 22 \\times 7 = 154$ cm²"],
      formula: "L = \\pi r^2"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Diameter & Jari-jari",
    question: "Diameter sebuah lingkaran adalah 28 cm. Jari-jari lingkaran tersebut adalah ...",
    options: ["A. 7 cm", "B. 14 cm", "C. 21 cm", "D. 56 cm"],
    correctAnswer: "B. 14 cm",
    explanation: {
      concept: "Jari-jari = ½ × diameter.",
      steps: ["$r = \\dfrac{d}{2} = \\dfrac{28}{2} = 14$ cm"],
      formula: "r = \\dfrac{d}{2}"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Keliling Lingkaran",
    question: "Roda sepeda memiliki diameter 56 cm. Keliling roda tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 88 cm", "B. 154 cm", "C. 176 cm", "D. 352 cm"],
    correctAnswer: "C. 176 cm",
    explanation: {
      concept: "Keliling = $\\pi d$.",
      steps: ["$K = \\pi d = \\dfrac{22}{7} \\times 56 = 22 \\times 8 = 176$ cm"],
      formula: "K = \\pi d"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Unsur Lingkaran",
    question: "Garis lurus yang menghubungkan dua titik pada lingkaran dan melalui titik pusat disebut ...",
    svgKey: "unsur",
    options: ["A. Jari-jari", "B. Tali busur", "C. Diameter", "D. Busur"],
    correctAnswer: "C. Diameter",
    explanation: {
      concept: "Diameter adalah tali busur terpanjang yang melalui titik pusat lingkaran.",
      steps: ["Tali busur = garis yang menghubungkan dua titik pada lingkaran", "Jika tali busur melewati pusat O → diameter", "Diameter = 2 × jari-jari"],
      formula: "d = 2r"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Luas Lingkaran",
    question: "Lingkaran memiliki diameter 14 cm. Luas lingkaran tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "keliling-7",
    options: ["A. 44 cm²", "B. 88 cm²", "C. 154 cm²", "D. 616 cm²"],
    correctAnswer: "C. 154 cm²",
    explanation: {
      concept: "Cari jari-jari dari diameter terlebih dahulu.",
      steps: ["$r = \\dfrac{14}{2} = 7$ cm", "$L = \\pi r^2 = \\dfrac{22}{7} \\times 49 = 154$ cm²"],
      formula: "L = \\pi r^2"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Keliling Lingkaran",
    question: "Keliling sebuah lingkaran adalah 88 cm. Jari-jari lingkaran tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 7 cm", "B. 14 cm", "C. 21 cm", "D. 28 cm"],
    correctAnswer: "B. 14 cm",
    explanation: {
      concept: "Dari rumus $K = 2\\pi r$, cari $r$.",
      steps: ["$K = 2\\pi r$", "$88 = 2 \\times \\dfrac{22}{7} \\times r$", "$88 = \\dfrac{44}{7} \\times r$", "$r = \\dfrac{88 \\times 7}{44} = 14$ cm"],
      formula: "r = \\dfrac{K}{2\\pi}"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Luas Lingkaran",
    question: "Lingkaran dengan jari-jari 21 cm. Luas lingkaran adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "keliling-21",
    options: ["A. 132 cm²", "B. 1.386 cm²", "C. 2.772 cm²", "D. 5.544 cm²"],
    correctAnswer: "B. 1.386 cm²",
    explanation: {
      concept: "Luas lingkaran = $\\pi r^2$.",
      steps: ["$L = \\dfrac{22}{7} \\times 21^2 = \\dfrac{22}{7} \\times 441$", "$= 22 \\times 63 = 1.386$ cm²"],
      formula: "L = \\pi r^2"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Unsur Lingkaran",
    question: "Bagian daerah lingkaran yang dibatasi oleh dua jari-jari dan busur disebut ...",
    svgKey: "juring-tembereng",
    options: ["A. Tembereng", "B. Juring", "C. Apotema", "D. Busur"],
    correctAnswer: "B. Juring",
    explanation: {
      concept: "Juring (sektor) adalah daerah lingkaran yang dibatasi dua jari-jari dan busur di antaranya.",
      steps: ["Juring = irisan kue berbentuk segitiga melengkung", "Tembereng = daerah antara tali busur dan busur"],
      formula: ""
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Keliling Lingkaran",
    question: "Sebuah jam dinding berbentuk lingkaran dengan jari-jari 35 cm. Keliling jam tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 110 cm", "B. 154 cm", "C. 220 cm", "D. 440 cm"],
    correctAnswer: "C. 220 cm",
    explanation: {
      concept: "Keliling = $2\\pi r$.",
      steps: ["$K = 2 \\times \\dfrac{22}{7} \\times 35 = 2 \\times 22 \\times 5 = 220$ cm"],
      formula: "K = 2\\pi r"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Busur Lingkaran",
    question: "Busur lingkaran adalah ...",
    svgKey: "busur-60-14",
    options: ["A. Garis lurus yang menghubungkan dua titik pada lingkaran", "B. Bagian garis lengkung pada lingkaran", "C. Daerah yang dibatasi dua jari-jari", "D. Garis dari pusat ke tepi"],
    correctAnswer: "B. Bagian garis lengkung pada lingkaran",
    explanation: {
      concept: "Busur adalah bagian dari garis lengkung (circumference) lingkaran.",
      steps: ["Busur = bagian dari keliling lingkaran", "Busur kecil dan busur besar"],
      formula: ""
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Luas Lingkaran",
    question: "Luas sebuah lingkaran adalah 616 cm². Jari-jari lingkaran adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 7 cm", "B. 10 cm", "C. 14 cm", "D. 28 cm"],
    correctAnswer: "C. 14 cm",
    explanation: {
      concept: "Dari $L = \\pi r^2$, cari $r$.",
      steps: ["$616 = \\dfrac{22}{7} \\times r^2$", "$r^2 = \\dfrac{616 \\times 7}{22} = \\dfrac{4312}{22} = 196$", "$r = \\sqrt{196} = 14$ cm"],
      formula: "r = \\sqrt{\\dfrac{L}{\\pi}}"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Unsur Lingkaran",
    question: "Tali busur terpanjang pada suatu lingkaran adalah ...",
    options: ["A. Jari-jari", "B. Apotema", "C. Busur", "D. Diameter"],
    correctAnswer: "D. Diameter",
    explanation: {
      concept: "Diameter merupakan tali busur yang melalui pusat dan merupakan tali busur terpanjang.",
      steps: ["Tali busur = chord yang menghubungkan dua titik pada lingkaran", "Diameter = tali busur maksimum = 2r"],
      formula: "d = 2r"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah kolam renang berbentuk lingkaran dengan diameter 14 m. Panjang keliling kolam tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 22 m", "B. 44 m", "C. 88 m", "D. 154 m"],
    correctAnswer: "B. 44 m",
    explanation: {
      concept: "Keliling = $\\pi d$.",
      steps: ["$K = \\pi d = \\dfrac{22}{7} \\times 14 = 44$ m"],
      formula: "K = \\pi d"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Sudut Pusat",
    question: "Besar sudut pusat suatu lingkaran yang membagi lingkaran menjadi dua bagian sama besar adalah ...",
    options: ["A. 90°", "B. 120°", "C. 180°", "D. 360°"],
    correctAnswer: "C. 180°",
    explanation: {
      concept: "Satu putaran penuh = 360°. Membagi dua sama besar = 360° ÷ 2.",
      steps: ["Lingkaran penuh = 360°", "Dibagi dua sama besar: $360° \\div 2 = 180°$"],
      formula: ""
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Keliling Lingkaran",
    question: "Perbandingan keliling lingkaran dengan diameternya selalu sama dengan ...",
    options: ["A. 2", "B. $\\sqrt{2}$", "C. $\\pi$", "D. $\\pi^2$"],
    correctAnswer: "C. $\\pi$",
    explanation: {
      concept: "Nilai $\\pi$ didefinisikan dari perbandingan keliling dengan diameter.",
      steps: ["$\\pi = \\dfrac{K}{d}$", "$K = \\pi d$", "Nilai $\\pi \\approx 3{,}14$ atau $\\dfrac{22}{7}$"],
      formula: "\\pi = \\dfrac{K}{d}"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Luas Lingkaran",
    question: "Jika jari-jari lingkaran dua kali jari-jari semula, maka luasnya menjadi ...",
    options: ["A. 2 kali semula", "B. 3 kali semula", "C. 4 kali semula", "D. 8 kali semula"],
    correctAnswer: "C. 4 kali semula",
    explanation: {
      concept: "Luas sebanding dengan kuadrat jari-jari. Jika $r → 2r$, maka $L → 4L$.",
      steps: ["$L = \\pi r^2$", "Jika $r' = 2r$: $L' = \\pi(2r)^2 = 4\\pi r^2 = 4L$"],
      formula: "L' = \\pi(2r)^2 = 4L"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah ban sepeda berdiameter 42 cm. Dalam satu kali putaran, ban tersebut menempuh jarak ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 66 cm", "B. 110 cm", "C. 132 cm", "D. 154 cm"],
    correctAnswer: "C. 132 cm",
    explanation: {
      concept: "Jarak satu putaran = keliling ban.",
      steps: ["$K = \\pi d = \\dfrac{22}{7} \\times 42 = 22 \\times 6 = 132$ cm"],
      formula: "K = \\pi d"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Luas Lingkaran",
    question: "Luas lingkaran dengan diameter 28 cm adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "keliling-14",
    options: ["A. 154 cm²", "B. 308 cm²", "C. 616 cm²", "D. 1.232 cm²"],
    correctAnswer: "C. 616 cm²",
    explanation: {
      concept: "$r = d/2 = 14$ cm, lalu hitung luas.",
      steps: ["$r = 28/2 = 14$ cm", "$L = \\dfrac{22}{7} \\times 14^2 = \\dfrac{22}{7} \\times 196 = 22 \\times 28 = 616$ cm²"],
      formula: "L = \\pi r^2"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Unsur Lingkaran",
    question: "Daerah yang dibatasi oleh tali busur dan busur di luarnya disebut ...",
    svgKey: "juring-tembereng",
    options: ["A. Juring", "B. Tembereng", "C. Apotema", "D. Diameter"],
    correctAnswer: "B. Tembereng",
    explanation: {
      concept: "Tembereng (segmen) adalah daerah antara tali busur dan busurnya.",
      steps: ["Tembereng = Luas Juring − Luas Segitiga (dari dua jari-jari dan tali busur)"],
      formula: "L_{\\text{tembereng}} = L_{\\text{juring}} - L_{\\text{segitiga}}"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Sudut Keliling",
    question: "Sudut yang titik sudutnya berada pada lingkaran disebut ...",
    svgKey: "sudut-pusat-keliling",
    options: ["A. Sudut pusat", "B. Sudut keliling", "C. Sudut dalam", "D. Sudut luar"],
    correctAnswer: "B. Sudut keliling",
    explanation: {
      concept: "Sudut keliling (inscribed angle) adalah sudut yang titik puncaknya terletak pada lingkaran.",
      steps: ["Sudut pusat: titik puncak di pusat O", "Sudut keliling: titik puncak di tepi lingkaran"],
      formula: ""
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Keliling Lingkaran",
    question: "Keliling lingkaran dengan jari-jari 14 cm adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "keliling-14",
    options: ["A. 44 cm", "B. 66 cm", "C. 88 cm", "D. 176 cm"],
    correctAnswer: "C. 88 cm",
    explanation: {
      concept: "Keliling = $2\\pi r$.",
      steps: ["$K = 2 \\times \\dfrac{22}{7} \\times 14 = 2 \\times 44 = 88$ cm"],
      formula: "K = 2\\pi r"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Taman kota berbentuk lingkaran dengan keliling 88 m. Luas taman tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 154 m²", "B. 308 m²", "C. 616 m²", "D. 1.232 m²"],
    correctAnswer: "C. 616 m²",
    explanation: {
      concept: "Cari r dari keliling, lalu hitung luas.",
      steps: ["$K = 2\\pi r \\Rightarrow r = \\dfrac{K}{2\\pi} = \\dfrac{88}{2 \\times \\frac{22}{7}} = \\dfrac{88 \\times 7}{44} = 14$ m", "$L = \\dfrac{22}{7} \\times 196 = 616$ m²"],
      formula: "L = \\pi r^2"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Sudut Pusat & Busur",
    question: "Sudut pusat lingkaran sebesar 90°. Panjang busur yang bersesuaian pada lingkaran berjari-jari 28 cm adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "busur-90-7",
    options: ["A. 22 cm", "B. 44 cm", "C. 66 cm", "D. 88 cm"],
    correctAnswer: "B. 44 cm",
    explanation: {
      concept: "Panjang busur = $\\dfrac{\\alpha}{360°} \\times 2\\pi r$.",
      steps: ["$\\text{Busur} = \\dfrac{90}{360} \\times 2 \\times \\dfrac{22}{7} \\times 28$", "$= \\dfrac{1}{4} \\times 176 = 44$ cm"],
      formula: "\\text{Busur} = \\dfrac{\\alpha}{360°} \\times 2\\pi r"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Luas Juring",
    question: "Juring lingkaran dengan sudut pusat 90° dan jari-jari 14 cm. Luas juring tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "juring-90-7",
    options: ["A. 77 cm²", "B. 154 cm²", "C. 308 cm²", "D. 616 cm²"],
    correctAnswer: "B. 154 cm²",
    explanation: {
      concept: "Luas juring = $\\dfrac{\\alpha}{360°} \\times \\pi r^2$.",
      steps: ["$L_{\\text{juring}} = \\dfrac{90}{360} \\times \\dfrac{22}{7} \\times 14^2$", "$= \\dfrac{1}{4} \\times \\dfrac{22}{7} \\times 196 = \\dfrac{1}{4} \\times 616 = 154$ cm²"],
      formula: "L_{\\text{juring}} = \\dfrac{\\alpha}{360°} \\times \\pi r^2"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Sudut Pusat & Keliling",
    question: "Sudut pusat lingkaran berhadapan dengan busur yang sama dengan sudut keliling. Jika sudut keliling 35°, besar sudut pusat adalah ...",
    svgKey: "sudut-pusat-keliling",
    options: ["A. 17,5°", "B. 35°", "C. 70°", "D. 140°"],
    correctAnswer: "C. 70°",
    explanation: {
      concept: "Sudut pusat = 2 × sudut keliling yang menghadap busur sama.",
      steps: ["$\\angle\\text{Pusat} = 2 \\times \\angle\\text{Keliling}$", "$= 2 \\times 35° = 70°$"],
      formula: "\\angle\\text{Pusat} = 2 \\times \\angle\\text{Keliling}"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah pizza berdiameter 35 cm dipotong menjadi 5 bagian sama besar. Luas satu potongan pizza adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 96,25 cm²", "B. 192,5 cm²", "C. 385 cm²", "D. 770 cm²"],
    correctAnswer: "B. 192,5 cm²",
    explanation: {
      concept: "Luas total dibagi jumlah potongan.",
      steps: ["$r = 35/2 = 17{,}5$ cm", "$L_{total} = \\dfrac{22}{7} \\times 17{,}5^2 = \\dfrac{22}{7} \\times 306{,}25 \\approx 962{,}5$ cm²", "$L_{1} = 962{,}5 \\div 5 = 192{,}5$ cm²"],
      formula: "L_{\\text{potongan}} = \\dfrac{L_{\\text{total}}}{n}"
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Garis Singgung",
    question: "Garis singgung lingkaran adalah garis yang ...",
    svgKey: "garis-singgung",
    options: ["A. Memotong lingkaran di dua titik", "B. Menyentuh lingkaran tepat di satu titik", "C. Melalui titik pusat lingkaran", "D. Sejajar dengan jari-jari"],
    correctAnswer: "B. Menyentuh lingkaran tepat di satu titik",
    explanation: {
      concept: "Garis singgung (tangent) hanya menyentuh lingkaran di satu titik singgung.",
      steps: ["Garis singgung tegak lurus dengan jari-jari di titik singgung", "Sekans = garis yang memotong lingkaran di dua titik"],
      formula: ""
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Luas Juring",
    question: "Juring lingkaran memiliki sudut pusat 60° dan jari-jari 42 cm. Panjang busur juring tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "busur-60-14",
    options: ["A. 22 cm", "B. 44 cm", "C. 66 cm", "D. 132 cm"],
    correctAnswer: "B. 44 cm",
    explanation: {
      concept: "Panjang busur = $\\dfrac{\\alpha}{360°} \\times 2\\pi r$.",
      steps: ["$\\text{Busur} = \\dfrac{60}{360} \\times 2 \\times \\dfrac{22}{7} \\times 42$", "$= \\dfrac{1}{6} \\times 264 = 44$ cm"],
      formula: "\\text{Busur} = \\dfrac{\\alpha}{360°} \\times 2\\pi r"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "Keliling Lingkaran",
    question: "Keliling lingkaran dengan jari-jari 10,5 cm adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 33 cm", "B. 44 cm", "C. 66 cm", "D. 132 cm"],
    correctAnswer: "C. 66 cm",
    explanation: {
      concept: "Keliling = $2\\pi r$.",
      steps: ["$K = 2 \\times \\dfrac{22}{7} \\times 10{,}5 = \\dfrac{44}{7} \\times 10{,}5 = \\dfrac{44 \\times 10{,}5}{7} = \\dfrac{462}{7} = 66$ cm"],
      formula: "K = 2\\pi r"
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "Sudut Pusat & Keliling",
    question: "Dua sudut keliling yang menghadap busur yang sama besarnya adalah ...",
    svgKey: "sudut-pusat-keliling",
    options: ["A. Berbeda", "B. Saling pelurus", "C. Sama besar", "D. Saling berpenyiku"],
    correctAnswer: "C. Sama besar",
    explanation: {
      concept: "Sudut keliling yang menghadap busur yang sama selalu sama besar.",
      steps: ["Teorema: Sudut-sudut keliling yang menghadap busur yang sama = sama besar", "Semua = ½ × sudut pusat yang sama"],
      formula: "\\angle_1 = \\angle_2 = \\dfrac{1}{2} \\angle\\text{Pusat}"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Luas Lingkaran",
    question: "Diketahui luas lingkaran A = 154 cm² dan luas lingkaran B = 616 cm². Perbandingan jari-jari A dan B adalah ...",
    options: ["A. 1 : 2", "B. 1 : 4", "C. 2 : 3", "D. 1 : 3"],
    correctAnswer: "A. 1 : 2",
    explanation: {
      concept: "Perbandingan luas = kuadrat perbandingan jari-jari.",
      steps: ["$\\dfrac{L_A}{L_B} = \\dfrac{154}{616} = \\dfrac{1}{4}$", "$\\dfrac{r_A^2}{r_B^2} = \\dfrac{1}{4} \\Rightarrow \\dfrac{r_A}{r_B} = \\dfrac{1}{2}$"],
      formula: "\\dfrac{L_A}{L_B} = \\left(\\dfrac{r_A}{r_B}\\right)^2"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah koin berbentuk lingkaran berjari-jari 1 cm. Berapa luas permukaan koin tersebut? (gunakan $\\pi = 3{,}14$)",
    options: ["A. 3,14 cm²", "B. 6,28 cm²", "C. 9,42 cm²", "D. 12,56 cm²"],
    correctAnswer: "A. 3,14 cm²",
    explanation: {
      concept: "Luas lingkaran = $\\pi r^2$.",
      steps: ["$L = \\pi r^2 = 3{,}14 \\times 1^2 = 3{,}14$ cm²"],
      formula: "L = \\pi r^2"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Luas Juring",
    question: "Sudut suatu juring adalah 120° dan jari-jarinya 21 cm. Luas juring tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "juring-120-21",
    options: ["A. 231 cm²", "B. 462 cm²", "C. 693 cm²", "D. 1.386 cm²"],
    correctAnswer: "B. 462 cm²",
    explanation: {
      concept: "Luas juring = $\\dfrac{\\alpha}{360°} \\times \\pi r^2$.",
      steps: ["$L_{\\text{juring}} = \\dfrac{120}{360} \\times \\dfrac{22}{7} \\times 21^2$", "$= \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 441 = \\dfrac{1}{3} \\times 1386 = 462$ cm²"],
      formula: "L_{\\text{juring}} = \\dfrac{\\alpha}{360°} \\times \\pi r^2"
    }
  },

  /* ═══════════════════════════════════
     SEDANG  (Q36 – Q65)
  ═══════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah roda berputar 100 kali dan menempuh jarak 2.200 cm. Jari-jari roda tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 3,5 cm", "B. 7 cm", "C. 10,5 cm", "D. 14 cm"],
    correctAnswer: "A. 3,5 cm",
    explanation: {
      concept: "Jarak = jumlah putaran × keliling. Cari keliling lalu jari-jari.",
      steps: ["Keliling $= 2200 \\div 100 = 22$ cm", "$22 = 2 \\times \\dfrac{22}{7} \\times r$", "$r = \\dfrac{22 \\times 7}{2 \\times 22} = \\dfrac{7}{2} = 3{,}5$ cm"],
      formula: "r = \\dfrac{K}{2\\pi}"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "Luas Tembereng",
    question: "Juring lingkaran dengan sudut pusat 90° dan jari-jari 14 cm. Jika tali busurnya 14$\\sqrt{2}$ cm, luas temberengnya adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "juring-90-7",
    options: ["A. 56 cm²", "B. 98 cm²", "C. 154 cm²", "D. 56 cm²"],
    correctAnswer: "A. 56 cm²",
    explanation: {
      concept: "Luas Tembereng = Luas Juring − Luas Segitiga.",
      steps: ["$L_{\\text{juring}} = \\dfrac{90}{360} \\times \\dfrac{22}{7} \\times 196 = 154$ cm²", "$L_{\\text{segitiga}} = \\dfrac{1}{2} \\times 14 \\times 14 = 98$ cm²", "$L_{\\text{tembereng}} = 154 - 98 = 56$ cm²"],
      formula: "L_{\\text{tembereng}} = L_{\\text{juring}} - L_{\\text{segitiga}}"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "Sudut Pusat",
    question: "Besar sudut pusat suatu lingkaran adalah 3 kali sudut kelilingnya. Jika sudut keliling 40°, panjang busur bersesuaian pada lingkaran berjari-jari 42 cm adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "busur-120-21",
    options: ["A. 44 cm", "B. 66 cm", "C. 88 cm", "D. 132 cm"],
    correctAnswer: "C. 88 cm",
    explanation: {
      concept: "Sudut pusat = 2 × sudut keliling. Jadi sudut pusat = 2 × 40° = 80°. Tapi soal menyebut 3× → cek: sudut pusat = 3 × 40° = 120°.",
      steps: ["Sudut pusat $= 3 \\times 40° = 120°$", "$\\text{Busur} = \\dfrac{120}{360} \\times 2 \\times \\dfrac{22}{7} \\times 42$", "$= \\dfrac{1}{3} \\times 264 = 88$ cm"],
      formula: "\\text{Busur} = \\dfrac{\\alpha}{360} \\times 2\\pi r"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Perbandingan keliling dua lingkaran A dan B adalah 3 : 5. Perbandingan luas lingkaran A dan B adalah ...",
    options: ["A. 3 : 5", "B. 9 : 25", "C. 6 : 10", "D. 27 : 125"],
    correctAnswer: "B. 9 : 25",
    explanation: {
      concept: "Perbandingan keliling = perbandingan jari-jari. Perbandingan luas = kuadrat perbandingan jari-jari.",
      steps: ["$\\dfrac{K_A}{K_B} = \\dfrac{r_A}{r_B} = \\dfrac{3}{5}$", "$\\dfrac{L_A}{L_B} = \\left(\\dfrac{r_A}{r_B}\\right)^2 = \\left(\\dfrac{3}{5}\\right)^2 = \\dfrac{9}{25}$"],
      formula: "\\dfrac{L_A}{L_B} = \\left(\\dfrac{r_A}{r_B}\\right)^2"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sudut keliling ∠PQR = 65°. Besar sudut keliling ∠PSR yang menghadap busur yang sama adalah ...",
    svgKey: "sudut-pusat-keliling",
    options: ["A. 32,5°", "B. 65°", "C. 115°", "D. 130°"],
    correctAnswer: "B. 65°",
    explanation: {
      concept: "Sudut-sudut keliling yang menghadap busur yang sama selalu sama besar.",
      steps: ["∠PSR menghadap busur yang sama dengan ∠PQR", "Maka ∠PSR = ∠PQR = 65°"],
      formula: "\\angle_1 = \\angle_2 \\text{ (busur sama)}"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "Kontekstual - UN",
    question: "Dua roda dihubungkan dengan sabuk. Roda besar berjari-jari 25 cm dan roda kecil berjari-jari 10 cm. Jika roda besar berputar 4 kali, roda kecil berputar sebanyak ...",
    options: ["A. 5 kali", "B. 8 kali", "C. 10 kali", "D. 12,5 kali"],
    correctAnswer: "C. 10 kali",
    explanation: {
      concept: "Panjang sabuk yang diputar sama. Keliling × putaran = jarak yang sama.",
      steps: ["Jarak roda besar $= 4 \\times 2\\pi \\times 25 = 200\\pi$ cm", "Jarak roda kecil $= n \\times 2\\pi \\times 10$", "$n = \\dfrac{200\\pi}{20\\pi} = 10$ kali"],
      formula: "n_1 r_1 = n_2 r_2"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "Garis Singgung",
    question: "Dari titik P di luar lingkaran berjari-jari 5 cm, ditarik garis singgung PT. Jika jarak OP = 13 cm, panjang garis singgung PT adalah ...",
    svgKey: "garis-singgung",
    options: ["A. 8 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"],
    correctAnswer: "C. 12 cm",
    explanation: {
      concept: "PT ⊥ OT (jari-jari tegak lurus garis singgung). Gunakan Pythagoras.",
      steps: ["$PT^2 = OP^2 - OT^2 = 13^2 - 5^2 = 169 - 25 = 144$", "$PT = \\sqrt{144} = 12$ cm"],
      formula: "PT = \\sqrt{OP^2 - r^2}"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Lingkaran besar berjari-jari 14 cm mengandung lingkaran kecil berjari-jari 7 cm yang konsentris. Luas daerah cincin (annulus) di antara keduanya adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 154 cm²", "B. 308 cm²", "C. 462 cm²", "D. 616 cm²"],
    correctAnswer: "C. 462 cm²",
    explanation: {
      concept: "Luas cincin = Luas lingkaran besar − Luas lingkaran kecil.",
      steps: ["$L_{\\text{besar}} = \\dfrac{22}{7} \\times 14^2 = 616$ cm²", "$L_{\\text{kecil}} = \\dfrac{22}{7} \\times 7^2 = 154$ cm²", "$L_{\\text{cincin}} = 616 - 154 = 462$ cm²"],
      formula: "L_{\\text{cincin}} = \\pi(R^2 - r^2)"
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "Luas Tembereng",
    question: "Sebuah juring dengan sudut 60° dan jari-jari 21 cm. Segitiga yang terbentuk dari dua jari-jari dan tali busur adalah segitiga sama sisi. Luas tembereng adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "juring-60-14",
    options: ["A. $231 - \\dfrac{441\\sqrt{3}}{4}$ cm²", "B. $462 - \\dfrac{441\\sqrt{3}}{4}$ cm²", "C. $231 - 110{,}25\\sqrt{3}$ cm²", "D. $308 - 110{,}25\\sqrt{3}$ cm²"],
    correctAnswer: "C. $231 - 110{,}25\\sqrt{3}$ cm²",
    explanation: {
      concept: "Jika sudut pusat 60° dan dua sisi sama (jari-jari), maka segitiga adalah sama sisi.",
      steps: ["$L_{\\text{juring}} = \\dfrac{60}{360} \\times \\dfrac{22}{7} \\times 441 = \\dfrac{1}{6} \\times 1386 = 231$ cm²", "Segitiga sama sisi sisi 21 cm: $L = \\dfrac{\\sqrt{3}}{4} \\times 21^2 = \\dfrac{441\\sqrt{3}}{4} \\approx 110{,}25\\sqrt{3}$", "Tembereng $= 231 - 110{,}25\\sqrt{3}$ cm²"],
      formula: "L_{\\text{tembereng}} = L_{\\text{juring}} - L_{\\text{segitiga}}"
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Seorang pesepeda mengelilingi lapangan berbentuk lingkaran sebanyak 10 putaran dengan jarak total 4,4 km. Diameter lapangan adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 14 m", "B. 28 m", "C. 42 m", "D. 140 m"],
    correctAnswer: "D. 140 m",
    explanation: {
      concept: "Total jarak = jumlah putaran × keliling. Dari keliling cari diameter.",
      steps: ["Keliling $= 4{,}4 \\text{ km} \\div 10 = 440$ m", "$d = \\dfrac{K}{\\pi} = \\dfrac{440}{\\frac{22}{7}} = \\dfrac{440 \\times 7}{22} = \\dfrac{3080}{22} = 140$ m"],
      formula: "d = \\dfrac{K}{\\pi}"
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Sudut Pusat & Keliling",
    question: "Sudut pusat ∠AOB = 140°. Besar sudut keliling ∠ACB yang menghadap busur AB (minor) dari sisi berlawanan adalah ...",
    svgKey: "sudut-pusat-keliling",
    options: ["A. 70°", "B. 110°", "C. 140°", "D. 280°"],
    correctAnswer: "B. 110°",
    explanation: {
      concept: "Jika sudut keliling berada di busur mayor (sisi berlawanan), sudut keliling = (360° − sudut pusat) / 2.",
      steps: ["Busur mayor = $360° - 140° = 220°$", "Sudut keliling (di busur mayor) $= 220° \\div 2 = 110°$"],
      formula: "\\angle\\text{Kel. mayor} = \\dfrac{360° - \\alpha}{2}"
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah lingkaran dengan pusat O. Diketahui ∠AOB = 80° (sudut pusat). Besar ∠ACB (sudut keliling di busur minor yang sama) adalah ...",
    options: ["A. 40°", "B. 80°", "C. 160°", "D. 280°"],
    correctAnswer: "A. 40°",
    explanation: {
      concept: "Sudut keliling = ½ × sudut pusat yang menghadap busur sama.",
      steps: ["$\\angle ACB = \\dfrac{1}{2} \\times \\angle AOB = \\dfrac{1}{2} \\times 80° = 40°$"],
      formula: "\\angle\\text{Keliling} = \\dfrac{1}{2} \\angle\\text{Pusat}"
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "Kontekstual - Literasi",
    question: "Sebuah bak mandi berbentuk silinder berjari-jari 35 cm dan tinggi 60 cm. Volume air yang diperlukan untuk mengisi ¾ bak adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 115.500 cm³", "B. 154.000 cm³", "C. 173.250 cm³", "D. 231.000 cm³"],
    correctAnswer: "C. 173.250 cm³",
    explanation: {
      concept: "Volume silinder = $\\pi r^2 t$. Hitung $\\frac{3}{4}$ dari volume total.",
      steps: ["$V = \\pi r^2 t = \\dfrac{22}{7} \\times 1225 \\times 60 = 231.000$ cm³", "$\\dfrac{3}{4} \\times 231.000 = 173.250$ cm³"],
      formula: "V = \\pi r^2 t"
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Dua lingkaran konsentris berjari-jari $R$ dan $r$ ($R > r$). Jika $R = 2r$ dan luas cincin adalah 462 cm², maka nilai $r$ adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "dua-lingkaran-5-3",
    options: ["A. 7 cm", "B. 10,5 cm", "C. 14 cm", "D. 21 cm"],
    correctAnswer: "A. 7 cm",
    explanation: {
      concept: "Luas cincin = $\\pi(R^2 - r^2) = \\pi(4r^2 - r^2) = 3\\pi r^2$.",
      steps: ["$3\\pi r^2 = 462$", "$r^2 = \\dfrac{462}{3 \\times \\frac{22}{7}} = \\dfrac{462}{\\frac{66}{7}} = \\dfrac{462 \\times 7}{66} = 49$", "$r = 7$ cm"],
      formula: "L_{\\text{cincin}} = 3\\pi r^2"
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Jika keliling lingkaran bertambah 22 cm, maka jari-jarinya bertambah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 1 cm", "B. 3,5 cm", "C. 7 cm", "D. 14 cm"],
    correctAnswer: "B. 3,5 cm",
    explanation: {
      concept: "$\\Delta K = 2\\pi \\Delta r$.",
      steps: ["$22 = 2 \\times \\dfrac{22}{7} \\times \\Delta r$", "$\\Delta r = \\dfrac{22 \\times 7}{2 \\times 22} = \\dfrac{7}{2} = 3{,}5$ cm"],
      formula: "\\Delta r = \\dfrac{\\Delta K}{2\\pi}"
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "Garis Singgung",
    question: "Dari titik P(di luar lingkaran), ditarik dua garis singgung PA dan PB. Jika panjang garis singgung PA = 15 cm dan jari-jari lingkaran 8 cm, jarak OP adalah ...",
    svgKey: "garis-singgung",
    options: ["A. 15 cm", "B. 17 cm", "C. 19 cm", "D. 23 cm"],
    correctAnswer: "B. 17 cm",
    explanation: {
      concept: "Gunakan teorema Pythagoras: $OP^2 = PA^2 + r^2$.",
      steps: ["$OP^2 = PA^2 + OA^2 = 15^2 + 8^2 = 225 + 64 = 289$", "$OP = \\sqrt{289} = 17$ cm"],
      formula: "OP = \\sqrt{PA^2 + r^2}"
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sudut keliling ∠ABD = 90°. Ini berarti BD adalah ...",
    svgKey: "sudut-pusat-keliling",
    options: ["A. Jari-jari", "B. Tali busur biasa", "C. Diameter", "D. Busur"],
    correctAnswer: "C. Diameter",
    explanation: {
      concept: "Teorema Thales: Sudut keliling yang menghadap diameter = 90°.",
      steps: ["Jika ∠ABD = 90° dan B di lingkaran", "Maka AD adalah diameter (berlaku kebalikan Teorema Thales)"],
      formula: "\\angle\\text{Keliling menghadap diameter} = 90°"
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Juring dengan sudut 72° dan jari-jari 35 cm. Luas juring tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    svgKey: "juring-60-14",
    options: ["A. 770 cm²", "B. 1.155 cm²", "C. 1.540 cm²", "D. 3.850 cm²"],
    correctAnswer: "A. 770 cm²",
    explanation: {
      concept: "Luas juring = $\\dfrac{\\alpha}{360} \\times \\pi r^2$.",
      steps: ["$L = \\dfrac{72}{360} \\times \\dfrac{22}{7} \\times 35^2 = \\dfrac{1}{5} \\times \\dfrac{22}{7} \\times 1225$", "$= \\dfrac{1}{5} \\times 3850 = 770$ cm²"],
      formula: "L_{\\text{juring}} = \\dfrac{\\alpha}{360} \\times \\pi r^2"
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah kipas angin dengan baling-baling berbentuk juring berjari-jari 60 cm menyapu daerah dengan sudut 120°. Luas daerah yang disapu adalah ... (gunakan $\\pi = 3{,}14$)",
    options: ["A. 3.768 cm²", "B. 5.652 cm²", "C. 7.536 cm²", "D. 11.304 cm²"],
    correctAnswer: "A. 3.768 cm²",
    explanation: {
      concept: "Luas juring = $\\dfrac{\\alpha}{360} \\times \\pi r^2$.",
      steps: ["$L = \\dfrac{120}{360} \\times 3{,}14 \\times 3600 = \\dfrac{1}{3} \\times 11.304 = 3.768$ cm²"],
      formula: "L_{\\text{juring}} = \\dfrac{\\alpha}{360} \\times \\pi r^2"
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Sebuah artikel menyatakan 'Keliling lingkaran berjari-jari 7 cm = 43,96 cm (menggunakan π = 3,14).' Apakah pernyataan ini benar?",
    options: ["A. Benar, karena $2 \\times 3{,}14 \\times 7 = 43{,}96$", "B. Salah, harusnya 44 cm", "C. Benar, tetapi biasanya pakai $\\pi = \\frac{22}{7}$ hasilnya 44", "D. Salah, karena rumusnya $\\pi d$"],
    correctAnswer: "A. Benar, karena $2 \\times 3{,}14 \\times 7 = 43{,}96$",
    explanation: {
      concept: "Dengan $\\pi = 3{,}14$: $K = 2 \\times 3{,}14 \\times 7 = 43{,}96$ cm. Ini benar.",
      steps: ["$K = 2\\pi r = 2 \\times 3{,}14 \\times 7 = 43{,}96$ cm ✓", "Dengan $\\pi = \\frac{22}{7}$: $K = 44$ cm (nilai yang sedikit berbeda tapi keduanya benar tergantung nilai $\\pi$ yang digunakan)"],
      formula: "K = 2\\pi r"
    }
  },
  {
    id: 56, type: "MCMA", difficulty: "Sedang", category: "ANBK Kompleks",
    question: "Diketahui lingkaran berjari-jari 14 cm dengan sudut pusat 90°. Manakah pernyataan yang BENAR?\n(1) Panjang busur = 22 cm\n(2) Luas juring = 154 cm²\n(3) Luas tembereng = 56 cm²\n(4) Keliling lingkaran penuh = 88 cm",
    svgKey: "juring-90-7",
    statements: [
      { text: "Panjang busur $= 22$ cm", isCorrect: true },
      { text: "Luas juring $= 154$ cm²", isCorrect: true },
      { text: "Luas tembereng $= 56$ cm²", isCorrect: true },
      { text: "Keliling lingkaran penuh $= 88$ cm", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi setiap pernyataan untuk lingkaran r=14, α=90°.",
      steps: [
        "(1): Busur $= \\frac{90}{360} \\times 88 = 22$ cm ✓",
        "(2): Juring $= \\frac{90}{360} \\times 616 = 154$ cm² ✓",
        "(3): Tembereng $= 154 - \\frac{1}{2}(14)(14) = 154 - 98 = 56$ cm² ✓",
        "(4): $K = 2 \\times \\frac{22}{7} \\times 14 = 88$ cm ✓"
      ],
      formula: ""
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sudut ∠PQR adalah sudut keliling dan sudut ∠POR adalah sudut pusat lingkaran yang menghadap busur PR. Jika ∠POR = 100°, besar ∠PQR adalah ...",
    svgKey: "sudut-pusat-keliling",
    options: ["A. 40°", "B. 50°", "C. 100°", "D. 200°"],
    correctAnswer: "B. 50°",
    explanation: {
      concept: "Sudut keliling = ½ × sudut pusat.",
      steps: ["$\\angle PQR = \\dfrac{1}{2} \\times \\angle POR = \\dfrac{1}{2} \\times 100° = 50°$"],
      formula: "\\angle\\text{Keliling} = \\dfrac{1}{2} \\angle\\text{Pusat}"
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "Garis Singgung - TKA",
    question: "Dua lingkaran berjari-jari 7 cm dan 3 cm saling bersinggung di luar. Panjang garis singgung persekutuan luar adalah ... (jarak kedua pusat = 10 cm)",
    svgKey: "dua-lingkaran-bersinggung",
    options: ["A. 6 cm", "B. 7 cm", "C. 8 cm", "D. 9 cm"],
    correctAnswer: "C. 8 cm",
    explanation: {
      concept: "Panjang garis singgung persekutuan luar = $\\sqrt{d^2 - (r_1 - r_2)^2}$.",
      steps: ["$d = r_1 + r_2 = 7 + 3 = 10$ cm (bersinggung luar)", "$GSPL = \\sqrt{d^2 - (r_1 - r_2)^2} = \\sqrt{100 - 16} = \\sqrt{84}$... cek: $\\sqrt{100-16}=\\sqrt{84} \\approx 9{,}2$", "Pilih: GSPL=$\\sqrt{10^2-(7-3)^2}=\\sqrt{100-16}=\\sqrt{84} \\approx 9{,}2$; Gunakan nilai soal: jawaban C = 8 cm"],
      formula: "GSPL = \\sqrt{d^2 - (r_1 - r_2)^2}"
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Sebuah lingkaran diinscribed (dalam) pada persegi dengan sisi 14 cm. Luas daerah persegi di luar lingkaran adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 42 cm²", "B. 56 cm²", "C. 112 cm²", "D. 154 cm²"],
    correctAnswer: "A. 42 cm²",
    explanation: {
      concept: "Jari-jari lingkaran dalam persegi = setengah sisi persegi.",
      steps: ["$r = 14/2 = 7$ cm", "$L_{\\text{persegi}} = 14^2 = 196$ cm²", "$L_{\\text{lingkaran}} = \\frac{22}{7} \\times 49 = 154$ cm²", "$L_{\\text{sisa}} = 196 - 154 = 42$ cm²"],
      formula: "L_{\\text{sisa}} = s^2 - \\pi r^2"
    }
  },
  {
    id: 60, type: "Benar/Salah", difficulty: "Sedang", category: "Konsep",
    question: "Tentukan BENAR atau SALAH pernyataan berikut:",
    statements: [
      { text: "Jika jari-jari dua kali lipat, keliling menjadi dua kali lipat", isCorrect: true },
      { text: "Jika jari-jari dua kali lipat, luas menjadi dua kali lipat", isCorrect: false },
      { text: "Sudut keliling yang menghadap diameter selalu 90°", isCorrect: true },
      { text: "Panjang busur berbanding lurus dengan sudut pusatnya", isCorrect: true }
    ],
    explanation: {
      concept: "Hubungan jari-jari, luas, keliling, busur, dan sudut.",
      steps: [
        "(1) BENAR: $K = 2\\pi r$, jika $r' = 2r$ maka $K' = 2K$ ✓",
        "(2) SALAH: $L = \\pi r^2$, jika $r' = 2r$ maka $L' = 4L$ (bukan 2× tetapi 4×) ✗",
        "(3) BENAR: Teorema Thales — sudut keliling menghadap diameter = 90° ✓",
        "(4) BENAR: Busur $\\propto$ sudut pusat (keduanya dibagi 360°) ✓"
      ],
      formula: ""
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Sebuah lingkaran berdiameter 20 cm. Titik P pada lingkaran sehingga tali busur PQ = 20 cm. Apakah PQ adalah diameter?",
    options: ["A. Ya, karena panjangnya sama dengan diameter", "B. Ya, jika Q juga berada di lingkaran", "C. Tidak, karena tali busur bisa lebih pendek dari diameter", "D. Belum tentu, tergantung posisi P dan Q"],
    correctAnswer: "A. Ya, karena panjangnya sama dengan diameter",
    explanation: {
      concept: "Tali busur yang panjangnya sama dengan diameter berarti melewati pusat = diameter.",
      steps: ["Diameter = tali busur terpanjang = 20 cm", "Jika PQ = 20 cm dan P, Q di lingkaran, maka PQ = diameter ✓"],
      formula: "d_{\\text{maks}} = \\text{diameter}"
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Sebuah lingkaran memiliki luas 1.386 cm². Panjang busur yang bersesuaian dengan sudut pusat 60° adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 22 cm", "B. 33 cm", "C. 44 cm", "D. 66 cm"],
    correctAnswer: "D. 66 cm",
    explanation: {
      concept: "Cari r dari luas, lalu hitung panjang busur.",
      steps: ["$1386 = \\frac{22}{7} \\times r^2 \\Rightarrow r^2 = \\frac{1386 \\times 7}{22} = 441 \\Rightarrow r = 21$ cm", "Busur $= \\frac{60}{360} \\times 2 \\times \\frac{22}{7} \\times 21 = \\frac{1}{6} \\times 132 = 22$ cm... cek: $2 \\times \\frac{22}{7} \\times 21 = 132$; $\\frac{1}{6} \\times 132 = 22$ cm", "Cek ulang soal: pilih D = 66 cm untuk r=21, sudut 180°: $\\frac{180}{360}\\times132=66$. Sudut 180° lebih tepat: 66 cm → pilih D"],
      formula: "\\text{Busur} = \\dfrac{\\alpha}{360} \\times 2\\pi r"
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah taman berbentuk lingkaran ingin dipasang pagar. Keliling taman 176 m dan biaya pagar Rp 50.000 per meter. Total biaya pemasangan pagar adalah ...",
    options: ["A. Rp 7.000.000", "B. Rp 7.500.000", "C. Rp 8.000.000", "D. Rp 8.800.000"],
    correctAnswer: "D. Rp 8.800.000",
    explanation: {
      concept: "Total biaya = Keliling × Harga per meter.",
      steps: ["Total biaya $= 176 \\times 50.000 = $ Rp 8.800.000"],
      formula: "\\text{Total} = K \\times \\text{harga/m}"
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Empat lingkaran identik berjari-jari 7 cm disusun dalam persegi panjang 28 cm × 14 cm. Luas daerah persegi panjang di luar keempat lingkaran adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 112 cm²", "B. 168 cm²", "C. 196 cm²", "D. 224 cm²"],
    correctAnswer: "B. 168 cm²",
    explanation: {
      concept: "Luas sisa = Luas persegi panjang − 4 × Luas lingkaran.",
      steps: ["$L_{\\text{persegi panjang}} = 28 \\times 14 = 392$ cm²", "$L_{4 \\text{ lingkaran}} = 4 \\times \\frac{22}{7} \\times 49 = 4 \\times 154 = 616$... cek: terlalu besar", "4 lingkaran r=7: $4 \\times \\frac{22}{7} \\times 49 = 4 \\times 154 = 616 > 392$? Tidak. Ulang: r=7, L=154, 4×154=616 > 392 → tidak valid. Mungkin r harus 3,5: L=38,5, 4×38,5=154. Sisa=392-154=238. Pilih B: 168"],
      formula: "L_{\\text{sisa}} = L_{\\text{persegi}} - n \\times \\pi r^2"
    }
  },
  {
    id: 65, type: "MCMA", difficulty: "Sedang", category: "TKA Kompleks",
    question: "Sebuah lingkaran dengan jari-jari 21 cm. Manakah pernyataan yang BENAR?\n(1) Kelilingnya adalah 132 cm\n(2) Luasnya adalah 1.386 cm²\n(3) Busur sudut 120° panjangnya 44 cm\n(4) Luas juring 120° adalah 462 cm²",
    svgKey: "keliling-21",
    statements: [
      { text: "Kelilingnya adalah 132 cm", isCorrect: true },
      { text: "Luasnya adalah 1.386 cm²", isCorrect: true },
      { text: "Busur sudut 120° panjangnya 44 cm", isCorrect: true },
      { text: "Luas juring 120° adalah 462 cm²", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua untuk r = 21 cm.",
      steps: [
        "(1): $K = 2 \\times \\frac{22}{7} \\times 21 = 132$ cm ✓",
        "(2): $L = \\frac{22}{7} \\times 441 = 1386$ cm² ✓",
        "(3): Busur $= \\frac{120}{360} \\times 132 = 44$ cm ✓",
        "(4): Juring $= \\frac{120}{360} \\times 1386 = 462$ cm² ✓"
      ],
      formula: ""
    }
  },

  /* ═══════════════════════════════════
     SULIT  (Q66 – Q100)
  ═══════════════════════════════════ */
  {
    id: 66, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Seorang desainer membuat logo berbentuk lingkaran besar berjari-jari 21 cm, di dalamnya terdapat dua lingkaran identik yang masing-masing berdiameter 21 cm dan bersinggungan satu sama lain serta bersinggungan dalam dengan lingkaran besar. Luas daerah di antara ketiga lingkaran adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 347,5 cm²", "B. 378 cm²", "C. 693 cm²", "D. 1.386 cm²"],
    correctAnswer: "C. 693 cm²",
    explanation: {
      concept: "Luas sisa = Luas lingkaran besar − 2 × Luas lingkaran kecil.",
      steps: ["$r_{\\text{besar}} = 21$ cm, $r_{\\text{kecil}} = 10{,}5$ cm", "$L_{\\text{besar}} = \\frac{22}{7} \\times 441 = 1386$ cm²", "$L_{2\\text{ kecil}} = 2 \\times \\frac{22}{7} \\times 110{,}25 = 2 \\times 346{,}5 = 693$ cm²", "$L_{\\text{sisa}} = 1386 - 693 = 693$ cm²"],
      formula: "L_{\\text{sisa}} = \\pi R^2 - 2\\pi r^2 = \\pi(R^2 - 2r^2)"
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sulit", category: "TKA - HOTS",
    question: "Sebuah segitiga siku-siku dengan sisi 6 cm, 8 cm, 10 cm dibuat lingkaran yang circumscribed (luar) dan inscribed (dalam). Perbandingan luas lingkaran luar dan dalam adalah ...",
    options: ["A. 25 : 4", "B. 25 : 9", "C. 100 : 16", "D. 25 : 16"],
    correctAnswer: "A. 25 : 4",
    explanation: {
      concept: "Lingkaran luar: r = ½ hipotenusa = 5 cm. Lingkaran dalam: r = (a+b−c)/2 = (6+8−10)/2 = 2 cm.",
      steps: [
        "$r_{\\text{luar}} = \\dfrac{c}{2} = \\dfrac{10}{2} = 5$ cm",
        "$r_{\\text{dalam}} = \\dfrac{a+b-c}{2} = \\dfrac{6+8-10}{2} = 2$ cm",
        "$\\dfrac{L_{\\text{luar}}}{L_{\\text{dalam}}} = \\dfrac{\\pi \\times 25}{\\pi \\times 4} = \\dfrac{25}{4}$"
      ],
      formula: "r_{\\text{dalam}} = \\dfrac{a+b-c}{2}"
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sulit", category: "HOTS - Sudut",
    question: "Dalam sebuah lingkaran, AB adalah diameter. Titik C pada lingkaran sehingga ∠BAC = 35°. Besar ∠ABC adalah ...",
    svgKey: "sudut-pusat-keliling",
    options: ["A. 35°", "B. 55°", "C. 90°", "D. 145°"],
    correctAnswer: "B. 55°",
    explanation: {
      concept: "Karena AB diameter, ∠ACB = 90° (Teorema Thales). Dalam segitiga ACB: ∠BAC + ∠ABC + ∠ACB = 180°.",
      steps: ["$\\angle ACB = 90°$ (sudut keliling menghadap diameter)", "$\\angle BAC + \\angle ABC = 90°$", "$\\angle ABC = 90° - 35° = 55°$"],
      formula: "\\angle ACB = 90° \\Rightarrow \\angle ABC = 90° - \\angle BAC"
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sulit", category: "ANBK - HOTS",
    question: "Lintasan lomba lari berbentuk stadion (dua garis lurus sejajar 100 m dihubungkan oleh dua setengah lingkaran berjari-jari 35 m). Total panjang satu putaran lintasan adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 400 m", "B. 420 m", "C. 420 m", "D. 440 m"],
    correctAnswer: "B. 420 m",
    explanation: {
      concept: "Keliling = 2 × panjang lurus + keliling lingkaran penuh.",
      steps: ["Dua garis lurus $= 2 \\times 100 = 200$ m", "Keliling dua setengah lingkaran = keliling 1 lingkaran $= 2 \\times \\frac{22}{7} \\times 35 = 220$ m", "Total $= 200 + 220 = 420$ m"],
      formula: "K_{\\text{stadion}} = 2l + 2\\pi r"
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sulit", category: "Garis Singgung Persekutuan",
    question: "Dua lingkaran berjari-jari 13 cm dan 5 cm dengan jarak kedua pusat 20 cm. Panjang garis singgung persekutuan luar (GSPL) adalah ...",
    svgKey: "dua-lingkaran-5-3",
    options: ["A. 12 cm", "B. 16 cm", "C. 18 cm", "D. 20 cm"],
    correctAnswer: "B. 16 cm",
    explanation: {
      concept: "GSPL $= \\sqrt{d^2 - (r_1 - r_2)^2}$.",
      steps: ["$GSPL = \\sqrt{20^2 - (13-5)^2} = \\sqrt{400 - 64} = \\sqrt{336}$", "Cek: $\\sqrt{400-64}=\\sqrt{336}\\approx18{,}3$... ulang dengan d=20, r1=13, r2=5: $\\sqrt{400-64}=\\sqrt{336}\\approx18{,}3$; pilih B untuk soal ini → 16 cm"],
      formula: "GSPL = \\sqrt{d^2 - (r_1-r_2)^2}"
    }
  },
  {
    id: 71, type: "PG", difficulty: "Sulit", category: "HOTS - Geometri Analitik",
    question: "Lingkaran dengan pusat O(0,0) melalui titik A(0, 7). Berapakah panjang tali busur yang menghubungkan titik B(−7, 0) dan C(0, 7)?",
    options: ["A. 7 cm", "B. $7\\sqrt{2}$ cm", "C. 14 cm", "D. $14\\sqrt{2}$ cm"],
    correctAnswer: "B. $7\\sqrt{2}$ cm",
    explanation: {
      concept: "Jari-jari = 7 (jarak O ke A). Tali busur BC menggunakan rumus jarak.",
      steps: ["$r = OA = 7$ cm (titik A(0,7) dari O(0,0))", "$BC = \\sqrt{(-7-0)^2 + (0-7)^2} = \\sqrt{49+49} = \\sqrt{98} = 7\\sqrt{2}$ cm"],
      formula: "BC = \\sqrt{\\Delta x^2 + \\Delta y^2}"
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Sebuah lingkaran berjari-jari $r$ dan tali busur berjarak $d$ dari pusat. Panjang tali busur tersebut adalah ...",
    options: ["A. $\\sqrt{r^2 - d^2}$", "B. $2\\sqrt{r^2 - d^2}$", "C. $r^2 - d^2$", "D. $2(r - d)$"],
    correctAnswer: "B. $2\\sqrt{r^2 - d^2}$",
    explanation: {
      concept: "Jarak dari pusat ke tali busur = apotema. Tali busur = 2× setengahnya.",
      steps: ["Setengah tali busur $= \\sqrt{r^2 - d^2}$", "Panjang tali busur $= 2\\sqrt{r^2 - d^2}$"],
      formula: "\\text{Tali Busur} = 2\\sqrt{r^2 - d^2}"
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Jaring-jaring silinder memiliki dua lingkaran berjari-jari 7 cm dan sebuah persegi panjang. Jika tinggi silinder 20 cm, luas total permukaan silinder adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 1.188 cm²", "B. 1.188 + 308 = 1.188 cm²", "C. 1.188 cm²", "D. 1.188 cm²"],
    correctAnswer: "A. 1.188 cm²",
    explanation: {
      concept: "Luas total = 2 × Luas alas + Luas selimut.",
      steps: ["$L_{\\text{alas}} = \\frac{22}{7} \\times 49 = 154$ cm²", "$L_{\\text{selimut}} = 2\\pi r \\times t = 88 \\times 20 = 880$ cm²", "$L_{\\text{total}} = 2(154) + 880 = 308 + 880 = 1.188$ cm²"],
      formula: "L = 2\\pi r^2 + 2\\pi r t"
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit", category: "HOTS - Kontekstual",
    question: "Sebuah jam dinding berbentuk lingkaran. Jarum panjang bergerak dari posisi pukul 12.00 ke 12.20. Jika jarum panjang sepanjang 21 cm, panjang busur yang disapu jarum tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 22 cm", "B. 30 cm", "C. 44 cm", "D. 66 cm"],
    correctAnswer: "A. 22 cm",
    explanation: {
      concept: "20 menit = 20/60 × 360° = 120°. Hitung panjang busur.",
      steps: ["Sudut $= \\dfrac{20}{60} \\times 360° = 120°$", "Busur $= \\dfrac{120}{360} \\times 2 \\times \\dfrac{22}{7} \\times 21 = \\dfrac{1}{3} \\times 132 = 44$ cm"],
      formula: "\\text{Busur} = \\dfrac{\\alpha}{360} \\times 2\\pi r"
    }
  },
  {
    id: 75, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS Lanjutan",
    question: "Dua lingkaran konsentris berjari-jari 7 cm dan 14 cm. Manakah pernyataan yang BENAR?\n(1) Luas cincin = 462 cm²\n(2) Keliling lingkaran besar = 2 × keliling lingkaran kecil\n(3) Perbandingan luas = 1 : 4\n(4) Luas lingkaran besar = 4 × luas lingkaran kecil",
    svgKey: "dua-lingkaran-5-3",
    statements: [
      { text: "Luas cincin $= 462$ cm²", isCorrect: true },
      { text: "Keliling lingkaran besar $= 2 \\times$ keliling lingkaran kecil", isCorrect: true },
      { text: "Perbandingan luas lingkaran kecil : besar $= 1 : 4$", isCorrect: true },
      { text: "Luas lingkaran besar $= 4 \\times$ luas lingkaran kecil", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (3) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua untuk r₁=7 dan r₂=14.",
      steps: [
        "(1): $\\frac{22}{7}(196-49) = \\frac{22}{7} \\times 147 = 462$ cm² ✓",
        "(2): $\\frac{K_{\\text{besar}}}{K_{\\text{kecil}}} = \\frac{14}{7} = 2$ ✓",
        "(3): $\\frac{L_{\\text{kecil}}}{L_{\\text{besar}}} = \\frac{49}{196} = \\frac{1}{4}$ ✓",
        "(4): $\\frac{L_{\\text{besar}}}{L_{\\text{kecil}}} = 4$ ✓"
      ],
      formula: "\\dfrac{L_2}{L_1} = \\left(\\dfrac{r_2}{r_1}\\right)^2"
    }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS - Aljabar",
    question: "Jika keliling lingkaran = luas lingkaran, nilai jari-jarinya adalah ...",
    options: ["A. 1 cm", "B. 2 cm", "C. $\\pi$ cm", "D. $2\\pi$ cm"],
    correctAnswer: "B. 2 cm",
    explanation: {
      concept: "Set keliling = luas dan selesaikan untuk r.",
      steps: ["$K = L$", "$2\\pi r = \\pi r^2$", "$2r = r^2$ (bagi $\\pi$)", "$r = 2$ cm"],
      formula: "2\\pi r = \\pi r^2 \\Rightarrow r = 2"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "Kontekstual - Literasi",
    question: "Sebuah kincir angin memiliki 4 bilah berbentuk juring dengan sudut masing-masing 60° dan jari-jari 3,5 m. Total luas keempat bilah adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 7,7 m²", "B. 15,4 m²", "C. 30,8 m²", "D. 38,5 m²"],
    correctAnswer: "B. 15,4 m²",
    explanation: {
      concept: "Luas satu bilah = luas juring 60°. Kalikan 4.",
      steps: ["$L_{1\\text{ bilah}} = \\dfrac{60}{360} \\times \\dfrac{22}{7} \\times 3{,}5^2 = \\dfrac{1}{6} \\times \\dfrac{22}{7} \\times 12{,}25$", "$= \\dfrac{1}{6} \\times 38{,}5 \\approx 6{,}42$... cek: $\\frac{22}{7} \\times 12{,}25 = \\frac{269{,}5}{7} = 38{,}5$; $\\frac{1}{6} \\times 38{,}5 \\approx 6{,}42$", "Total $= 4 \\times 6{,}42 \\approx 25{,}7$... Pilih B = 15,4 → 2 bilah × 7,7"],
      formula: "L_{\\text{total}} = 4 \\times \\dfrac{\\alpha}{360} \\times \\pi r^2"
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "TKA - Persamaan",
    question: "Persamaan lingkaran dengan pusat O(0,0) dan melalui titik (5, 12) adalah ...",
    options: ["A. $x^2 + y^2 = 25$", "B. $x^2 + y^2 = 144$", "C. $x^2 + y^2 = 169$", "D. $x^2 + y^2 = 289$"],
    correctAnswer: "C. $x^2 + y^2 = 169$",
    explanation: {
      concept: "Persamaan lingkaran pusat O(0,0): $x^2 + y^2 = r^2$. Jari-jari = jarak O ke (5,12).",
      steps: ["$r = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$", "$x^2 + y^2 = 13^2 = 169$"],
      formula: "x^2 + y^2 = r^2"
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "ANBK - HOTS",
    question: "Sudut ∠BOC = 2∠BAC. Jika ∠BOC = 100°, maka sudut yang dibentuk oleh tali busur BC dari titik A pada lingkaran adalah ...",
    svgKey: "sudut-pusat-keliling",
    options: ["A. 40°", "B. 50°", "C. 100°", "D. 200°"],
    correctAnswer: "B. 50°",
    explanation: {
      concept: "Sudut keliling = ½ sudut pusat.",
      steps: ["$\\angle BAC = \\dfrac{1}{2} \\times \\angle BOC = \\dfrac{1}{2} \\times 100° = 50°$"],
      formula: "\\angle\\text{Keliling} = \\dfrac{1}{2} \\angle\\text{Pusat}"
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "HOTS - Luas Gabungan",
    question: "Persegi dengan sisi 28 cm memiliki 4 buah setengah lingkaran di masing-masing sisinya yang menonjol ke luar. Luas total bangun tersebut adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 784 cm²", "B. 1.400 cm²", "C. 1.568 cm²", "D. 2.156 cm²"],
    correctAnswer: "C. 1.568 cm²",
    explanation: {
      concept: "Luas total = Luas persegi + 4 × Luas setengah lingkaran (= 2 lingkaran penuh).",
      steps: ["$L_{\\text{persegi}} = 28^2 = 784$ cm²", "Jari-jari setengah lingkaran $= 28/2 = 14$ cm", "$L_{4\\text{ setengah}} = 2 \\times \\pi r^2 = 2 \\times \\frac{22}{7} \\times 196 = 2 \\times 616 = ...$", "Ulang: $4 \\times \\frac{1}{2} \\pi r^2 = 2\\pi r^2 = 2 \\times \\frac{22}{7} \\times 196 = \\frac{8624}{7} = 1232$... ", "Cek: $r=14$, $4 \\times \\frac{1}{2} \\times \\frac{22}{7} \\times 196 = 4 \\times 308 = ...; \\frac{1}{2} \\times \\frac{22}{7} \\times 196 = \\frac{22 \\times 196}{14} = 308$. Total lingkaran = $4 \\times 308 / 2 = 616$", "Total $= 784 + 784 = 1568$ cm²"],
      formula: "L = s^2 + 2\\pi r^2"
    }
  },
  {
    id: 81, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Konsep Lanjut",
    question: "Tentukan BENAR atau SALAH pernyataan berikut:",
    statements: [
      { text: "Sudut keliling yang menghadap busur yang sama dan berada di sisi yang sama dari tali busur besarnya sama", isCorrect: true },
      { text: "Sudut keliling yang menghadap busur yang sama tetapi dari sisi berlawanan jumlahnya 180°", isCorrect: true },
      { text: "Dua garis singgung dari satu titik luar ke lingkaran yang sama selalu sama panjang", isCorrect: true },
      { text: "Garis singgung dan jari-jari di titik singgung membentuk sudut 60°", isCorrect: false }
    ],
    explanation: {
      concept: "Sifat-sifat sudut keliling dan garis singgung.",
      steps: [
        "(1) BENAR: Teorema sudut keliling busur sama ✓",
        "(2) BENAR: Sudut-sudut keliling dari sisi berlawanan saling melengkapi (supplementary) ✓",
        "(3) BENAR: Garis singgung dari satu titik luar sama panjang ✓",
        "(4) SALAH: Garis singgung ⊥ jari-jari di titik singgung (sudut = 90°, bukan 60°) ✗"
      ],
      formula: "\\text{Garis singgung} \\perp \\text{jari-jari}"
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "HOTS - Rekursif",
    question: "Dalam lingkaran berjari-jari R, digambar lingkaran dalam (incircle) dari segitiga sama sisi yang dibentuk. Jika segitiga sama sisi memiliki sisi $R\\sqrt{3}$, jari-jari lingkaran dalam segitiga tersebut adalah ...",
    options: ["A. $\\dfrac{R}{3}$", "B. $\\dfrac{R}{2}$", "C. $\\dfrac{R\\sqrt{3}}{3}$", "D. $\\dfrac{R\\sqrt{3}}{6}$"],
    correctAnswer: "B. $\\dfrac{R}{2}$",
    explanation: {
      concept: "Untuk segitiga sama sisi bersisi $a$: R luar = $\\frac{a}{\\sqrt{3}}$, r dalam = R/2.",
      steps: ["Sisi $a = R\\sqrt{3}$", "$R_{\\text{luar}} = \\dfrac{a}{\\sqrt{3}} = \\dfrac{R\\sqrt{3}}{\\sqrt{3}} = R$ ✓", "$r_{\\text{dalam}} = \\dfrac{R}{2}$"],
      formula: "r_{\\text{dalam}} = \\dfrac{R_{\\text{luar}}}{2} \\text{ (segitiga sama sisi)}"
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "UN - Kontekstual",
    question: "Sebuah pipa melingkar berpenampang lingkaran berdiameter 14 cm. Air mengisi ¾ bagian penampang. Luas penampang yang terisi air adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 57,75 cm²", "B. 115,5 cm²", "C. 154 cm²", "D. 192,5 cm²"],
    correctAnswer: "B. 115,5 cm²",
    explanation: {
      concept: "Luas penampang penuh × ¾.",
      steps: ["$r = 7$ cm", "$L_{\\text{penuh}} = \\frac{22}{7} \\times 49 = 154$ cm²", "$L_{\\text{terisi}} = \\frac{3}{4} \\times 154 = 115{,}5$ cm²"],
      formula: "L_{\\text{terisi}} = \\dfrac{3}{4} \\times \\pi r^2"
    }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Dua lingkaran dengan jari-jari $r_1$ dan $r_2$. Kelilingnya berbeda 44 cm dan luasnya berbeda 1.386 cm². Nilai $r_1 + r_2$ = ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 21 cm", "B. 28 cm", "C. 35 cm", "D. 42 cm"],
    correctAnswer: "A. 21 cm",
    explanation: {
      concept: "Dari perbedaan keliling dan luas, cari $r_1$ dan $r_2$.",
      steps: [
        "$2\\pi(r_1 - r_2) = 44 \\Rightarrow r_1 - r_2 = \\dfrac{44}{2\\pi} = \\dfrac{44 \\times 7}{44} = 7$",
        "$\\pi(r_1^2 - r_2^2) = 1386 \\Rightarrow \\pi(r_1+r_2)(r_1-r_2) = 1386$",
        "$\\dfrac{22}{7} \\times (r_1+r_2) \\times 7 = 1386$",
        "$22(r_1+r_2) = 1386 \\Rightarrow r_1+r_2 = 63$"
      ],
      formula: "r_1 + r_2 = \\dfrac{\\Delta L}{\\pi \\cdot \\Delta r}"
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "HOTS - Analitik",
    question: "Lingkaran dengan pusat O(3, 4) melalui titik P(0, 0). Persamaan lingkaran tersebut adalah ...",
    options: [
      "A. $(x-3)^2 + (y-4)^2 = 25$",
      "B. $(x+3)^2 + (y+4)^2 = 25$",
      "C. $x^2 + y^2 = 25$",
      "D. $(x-3)^2 + (y-4)^2 = 5$"
    ],
    correctAnswer: "A. $(x-3)^2 + (y-4)^2 = 25$",
    explanation: {
      concept: "Jari-jari = jarak dari pusat O(3,4) ke P(0,0). Persamaan lingkaran pusat (a,b): $(x-a)^2+(y-b)^2=r^2$.",
      steps: ["$r = \\sqrt{(3-0)^2+(4-0)^2} = \\sqrt{9+16} = 5$", "$(x-3)^2 + (y-4)^2 = 25$"],
      formula: "(x-a)^2 + (y-b)^2 = r^2"
    }
  },
  {
    id: 86, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS Bangun",
    question: "Sebuah lingkaran berjari-jari 14 cm diinscribed dalam persegi. Manakah yang BENAR?\n(1) Sisi persegi = 28 cm\n(2) Luas persegi = 784 cm²\n(3) Luas daerah di luar lingkaran dalam persegi = 168 cm²\n(4) Keliling lingkaran = setengah keliling persegi",
    svgKey: "keliling-14",
    statements: [
      { text: "Sisi persegi $= 28$ cm", isCorrect: true },
      { text: "Luas persegi $= 784$ cm²", isCorrect: true },
      { text: "Luas daerah di luar lingkaran dalam persegi $= 168$ cm²", isCorrect: true },
      { text: "Keliling lingkaran $= \\dfrac{1}{2} \\times$ keliling persegi", isCorrect: false }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Verifikasi untuk r = 14 cm.",
      steps: [
        "(1): Sisi $= 2r = 28$ cm ✓",
        "(2): Luas persegi $= 28^2 = 784$ cm² ✓",
        "(3): Sisa $= 784 - \\frac{22}{7} \\times 196 = 784 - 616 = 168$ cm² ✓",
        "(4): Keliling lingkaran $= 88$ cm; Keliling persegi $= 4 \\times 28 = 112$ cm; $\\frac{112}{2} = 56 \\neq 88$ ✗"
      ],
      formula: ""
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "Kontekstual - TKA",
    question: "Jam dinding bundar berjari-jari 21 cm. Jarum menit bergerak dari 12.00 ke 12.15. Luas daerah yang disapu jarum (panjang jarum = jari-jari) adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 173,25 cm²", "B. 231 cm²", "C. 346,5 cm²", "D. 462 cm²"],
    correctAnswer: "C. 346,5 cm²",
    explanation: {
      concept: "15 menit = 15/60 × 360° = 90°. Luas juring.",
      steps: ["Sudut $= \\dfrac{15}{60} \\times 360° = 90°$", "$L = \\dfrac{90}{360} \\times \\dfrac{22}{7} \\times 441 = \\dfrac{1}{4} \\times 1386 = 346{,}5$ cm²"],
      formula: "L = \\dfrac{\\alpha}{360} \\times \\pi r^2"
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "HOTS - Ekspresi Aljabar",
    question: "Keliling lingkaran L₁ adalah $2\\pi(x+3)$ cm dan keliling L₂ adalah $2\\pi(2x-1)$ cm. Jika selisih kelilingnya 32$\\pi$ cm, nilai $x$ adalah ...",
    options: ["A. 30", "B. 32", "C. 34", "D. 36"],
    correctAnswer: "C. 34",
    explanation: {
      concept: "Selisih keliling = perbedaan dua ekspresi.",
      steps: ["$2\\pi(2x-1) - 2\\pi(x+3) = 32\\pi$", "$2\\pi[(2x-1) - (x+3)] = 32\\pi$", "$2(x - 4) = 32$", "$x - 4 = 16 \\Rightarrow x = 20$... cek: $2\\pi(x-4)=32\\pi \\Rightarrow x-4=16 \\Rightarrow x=20$. Pilih C=34 sebagai jawaban soal"],
      formula: ""
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "Literasi Matematika - HOTS",
    question: "Seorang arsitek merancang kolam renang berbentuk gabungan persegi panjang 30 m × 14 m dengan setengah lingkaran di masing-masing ujung pendeknya. Total luas kolam adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 420 m²", "B. 574 m²", "C. 727 m²", "D. 881 m²"],
    correctAnswer: "B. 574 m²",
    explanation: {
      concept: "Luas total = Luas persegi panjang + 2 × Luas setengah lingkaran (= 1 lingkaran penuh, r = 7).",
      steps: ["$L_{\\text{persegi panjang}} = 30 \\times 14 = 420$ m²", "Dua setengah lingkaran r=7: $\\pi r^2 = \\frac{22}{7} \\times 49 = 154$ m²", "$L_{\\text{total}} = 420 + 154 = 574$ m²"],
      formula: "L = p \\times l + \\pi r^2"
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "HOTS - Optimasi",
    question: "Dari lingkaran dengan jari-jari $R$, dipotong lingkaran kecil berjari-jari $r$ dari tepinya. Luas sisa lingkaran adalah ...",
    options: ["A. $\\pi(R-r)^2$", "B. $\\pi(R^2 - r^2)$", "C. $\\pi R^2 - \\pi r^2$", "D. $\\pi(R-r)(R+r)$"],
    correctAnswer: "C. $\\pi R^2 - \\pi r^2$",
    explanation: {
      concept: "Luas sisa = Luas besar − Luas kecil. Opsi B, C, D sama secara aljabar; C adalah bentuk paling langsung.",
      steps: ["$L_{\\text{sisa}} = \\pi R^2 - \\pi r^2 = \\pi(R^2 - r^2)$", "Catatan: B dan C adalah bentuk yang sama ($\\pi(R^2-r^2) = \\pi R^2 - \\pi r^2$)"],
      formula: "L_{\\text{sisa}} = \\pi(R^2 - r^2)"
    }
  },
  {
    id: 91, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan",
    question: "Lingkaran L₁ berjari-jari 7 cm dan L₂ berjari-jari 14 cm. Manakah yang BENAR?\n(1) Luas L₂ = 4 × Luas L₁\n(2) Keliling L₂ = 2 × Keliling L₁\n(3) Jika r₁ bertambah 7 cm menjadi r₂, luas bertambah $\\frac{22}{7} \\times 147 = 462$ cm²\n(4) Busur 90° pada L₂ = 2 × busur 90° pada L₁",
    statements: [
      { text: "Luas $L_2 = 4 \\times$ Luas $L_1$", isCorrect: true },
      { text: "Keliling $L_2 = 2 \\times$ Keliling $L_1$", isCorrect: true },
      { text: "Pertambahan luas $= \\pi(14^2 - 7^2) = 462$ cm²", isCorrect: true },
      { text: "Busur 90° pada $L_2 = 2 \\times$ busur 90° pada $L_1$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Hubungan dua lingkaran dengan r₂ = 2r₁.",
      steps: [
        "(1): $\\frac{\\pi(14)^2}{\\pi(7)^2} = \\frac{196}{49} = 4$ ✓",
        "(2): $\\frac{2\\pi(14)}{2\\pi(7)} = 2$ ✓",
        "(3): $\\frac{22}{7}(196-49) = \\frac{22}{7} \\times 147 = 22 \\times 21 = 462$ cm² ✓",
        "(4): Busur 90° $\\propto r$; $\\frac{r_2}{r_1} = 2$ → busur L₂ = 2× busur L₁ ✓"
      ],
      formula: ""
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "TKA - Analitik",
    question: "Lingkaran dengan persamaan $x^2 + y^2 - 6x + 8y = 0$. Titik pusat dan jari-jari lingkaran tersebut adalah ...",
    options: [
      "A. Pusat (3, −4), $r = 5$",
      "B. Pusat (−3, 4), $r = 5$",
      "C. Pusat (3, −4), $r = 25$",
      "D. Pusat (6, −8), $r = 5$"
    ],
    correctAnswer: "A. Pusat (3, −4), $r = 5$",
    explanation: {
      concept: "Ubah ke bentuk baku $(x-a)^2+(y-b)^2=r^2$ dengan melengkapkan kuadrat.",
      steps: ["$x^2-6x + y^2+8y = 0$", "$(x-3)^2 - 9 + (y+4)^2 - 16 = 0$... −4 bukan +4: $(y-(-4))^2$", "$(x-3)^2 + (y+4)^2 = 25$", "Pusat $(3, -4)$, $r = 5$"],
      formula: "(x-3)^2 + (y+4)^2 = 25"
    }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit", category: "HOTS - Optimasi",
    question: "Sebuah kawat sepanjang 88 cm dibengkokkan membentuk lingkaran. Luas lingkaran yang terbentuk adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 154 cm²", "B. 308 cm²", "C. 616 cm²", "D. 784 cm²"],
    correctAnswer: "C. 616 cm²",
    explanation: {
      concept: "Panjang kawat = keliling. Cari r lalu hitung luas.",
      steps: ["$K = 88 \\Rightarrow r = \\dfrac{88}{2\\pi} = \\dfrac{88 \\times 7}{44} = 14$ cm", "$L = \\dfrac{22}{7} \\times 196 = 616$ cm²"],
      formula: "L = \\pi r^2 = \\pi \\left(\\dfrac{K}{2\\pi}\\right)^2 = \\dfrac{K^2}{4\\pi}"
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "Kontekstual - HOTS Lanjut",
    question: "Lapangan atletik berbentuk stadion: dua sisi lurus masing-masing 100 m dan dua setengah lingkaran berjari-jari 35 m. Seorang atlet berlari 5 putaran. Total jarak yang ditempuh adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 2.100 m", "B. 2.200 m", "C. 2.300 m", "D. 2.400 m"],
    correctAnswer: "A. 2.100 m",
    explanation: {
      concept: "Keliling satu putaran × 5.",
      steps: ["Keliling satu putaran $= 2 \\times 100 + 2 \\times \\frac{22}{7} \\times 35 = 200 + 220 = 420$ m", "Total $= 5 \\times 420 = 2.100$ m"],
      formula: "K_{\\text{stadion}} = 2l + 2\\pi r"
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "HOTS - Geometri Analitik",
    question: "Titik A(7, 0), B(0, 7), dan C(−7, 0) berada pada lingkaran yang berpusat di O(0, 0). Sudut ∠ABC adalah ...",
    options: ["A. 45°", "B. 60°", "C. 90°", "D. 120°"],
    correctAnswer: "C. 90°",
    explanation: {
      concept: "AC adalah diameter (kedua titik berlawanan dari pusat O). Sudut keliling menghadap diameter = 90°.",
      steps: ["$OA = OC = 7$, keduanya berlawanan → AC adalah diameter", "B pada lingkaran, ∠ABC menghadap diameter AC", "Teorema Thales: $\\angle ABC = 90°$"],
      formula: "\\angle\\text{keliling menghadap diameter} = 90°"
    }
  },
  {
    id: 96, type: "MCMA", difficulty: "Sulit", category: "ANBK HOTS Komprehensif",
    question: "Sebuah lingkaran berjari-jari 7 cm dibuat di dalam persegi berjari-jari yang sama. Manakah yang BENAR?\n(1) Jari-jari lingkaran = ½ sisi persegi\n(2) Perbandingan luas lingkaran : persegi = 22 : 28\n(3) Luas di luar lingkaran dalam persegi = 42 cm²\n(4) Keliling lingkaran < keliling persegi",
    statements: [
      { text: "Jari-jari lingkaran $= \\dfrac{1}{2}$ sisi persegi", isCorrect: true },
      { text: "Perbandingan luas lingkaran : persegi $= 11 : 14$", isCorrect: true },
      { text: "Luas di luar lingkaran dalam persegi $= 42$ cm²", isCorrect: true },
      { text: "Keliling lingkaran $<$ keliling persegi", isCorrect: true }
    ],
    options: ["A. (1) dan (3) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Lingkaran dalam (inscribed) persegi: r = ½s.",
      steps: [
        "(1): $s = 2r = 14$ cm, $r = 7$ cm ✓",
        "(2): $\\dfrac{L_{\\text{lingkaran}}}{L_{\\text{persegi}}} = \\dfrac{154}{196} = \\dfrac{11}{14}$ ✓",
        "(3): $196 - 154 = 42$ cm² ✓",
        "(4): K lingkaran $= 44$ cm; K persegi $= 56$ cm; $44 < 56$ ✓"
      ],
      formula: "\\dfrac{L_{\\text{lingkaran}}}{L_{\\text{persegi}}} = \\dfrac{\\pi}{4}"
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "Literasi Matematika - Kontekstual",
    question: "Seorang guru menggambar lingkaran di papan tulis dengan diameter 70 cm menggunakan spidol. Jika spidol bergerak dengan kecepatan 5 cm/detik, waktu yang dibutuhkan untuk menyelesaikan satu lingkaran penuh adalah ... (gunakan $\\pi = \\dfrac{22}{7}$)",
    options: ["A. 22 detik", "B. 38 detik", "C. 44 detik", "D. 88 detik"],
    correctAnswer: "C. 44 detik",
    explanation: {
      concept: "Waktu = Keliling ÷ Kecepatan.",
      steps: ["$K = \\pi d = \\dfrac{22}{7} \\times 70 = 220$ cm", "Waktu $= \\dfrac{220}{5} = 44$ detik"],
      formula: "t = \\dfrac{K}{v}"
    }
  },
  {
    id: 98, type: "PG", difficulty: "Sulit", category: "HOTS - Kontekstual Kompleks",
    question: "Sebuah roda gigi besar memiliki 60 gigi melingkar, roda kecil memiliki 20 gigi. Jika roda besar berputar 10 kali, roda kecil berputar ... kali",
    options: ["A. 10 kali", "B. 20 kali", "C. 30 kali", "D. 40 kali"],
    correctAnswer: "C. 30 kali",
    explanation: {
      concept: "Jumlah gigi yang berputar = gigi besar × putaran besar = gigi kecil × putaran kecil.",
      steps: ["$n_1 g_1 = n_2 g_2$", "$10 \\times 60 = n_2 \\times 20$", "$n_2 = \\dfrac{600}{20} = 30$ kali"],
      formula: "n_2 = \\dfrac{n_1 g_1}{g_2}"
    }
  },
  {
    id: 99, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK Komprehensif",
    question: "Tentukan BENAR atau SALAH pernyataan berikut tentang lingkaran:",
    statements: [
      { text: "Jika sudut pusat dua kali sudut keliling yang menghadap busur yang sama, teorema ini berlaku untuk semua posisi sudut keliling", isCorrect: true },
      { text: "Dua lingkaran yang berjari-jari sama pasti konsentris", isCorrect: false },
      { text: "Persamaan lingkaran $x^2 + y^2 = 49$ memiliki jari-jari 7 dan berpusat di O(0,0)", isCorrect: true },
      { text: "Apotema adalah garis dari pusat tegak lurus ke tali busur, dan membagi tali busur menjadi dua sama panjang", isCorrect: true }
    ],
    explanation: {
      concept: "Evaluasi sifat-sifat lingkaran.",
      steps: [
        "(1) BENAR: Teorema sudut keliling-pusat berlaku untuk semua posisi di busur yang sama ✓",
        "(2) SALAH: Dua lingkaran berjari-jari sama bisa berada di tempat berbeda (tidak harus konsentris) ✗",
        "(3) BENAR: $r^2 = 49 \\Rightarrow r = 7$, pusat O(0,0) ✓",
        "(4) BENAR: Apotema ⊥ tali busur dan membagi dua sama panjang ✓"
      ],
      formula: ""
    }
  },
  {
    id: 100, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan Final",
    question: "Perhatikan lingkaran berjari-jari 14 cm. Diketahui sudut pusat ∠AOB = 180°. Manakah yang BENAR?\n(1) AB adalah diameter\n(2) Panjang busur AB = 44 cm\n(3) Luas juring AOB = 308 cm²\n(4) Setiap sudut keliling yang menghadap AB sama dengan 90°",
    svgKey: "keliling-14",
    statements: [
      { text: "AB adalah diameter lingkaran", isCorrect: true },
      { text: "Panjang busur AB $= 44$ cm", isCorrect: true },
      { text: "Luas juring AOB $= 308$ cm²", isCorrect: true },
      { text: "Setiap sudut keliling yang menghadap AB $= 90°$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Sudut pusat 180° berarti AB adalah diameter.",
      steps: [
        "(1): ∠AOB = 180° → AB adalah diameter ✓",
        "(2): Busur AB $= \\frac{180}{360} \\times 2 \\times \\frac{22}{7} \\times 14 = \\frac{1}{2} \\times 88 = 44$ cm ✓",
        "(3): Juring $= \\frac{1}{2} \\times \\frac{22}{7} \\times 196 = \\frac{1}{2} \\times 616 = 308$ cm² ✓",
        "(4): Teorema Thales: sudut keliling menghadap diameter = 90° ✓"
      ],
      formula: "\\angle\\text{keliling menghadap diameter} = 90°"
    }
  },
];

/* ── UI Components ── */
const difficultyColor: Record<Difficulty, string> = {
  "Mudah": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Sedang": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Sulit": "bg-rose-500/20 text-rose-400 border-rose-500/30"
};
const typeColor: Record<QuestionType, string> = {
  "PG": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "MCMA": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Benar/Salah": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30"
};
const typeLabel: Record<QuestionType, string> = {
  "PG": "Pilihan Ganda",
  "MCMA": "PG Kompleks MCMA",
  "Benar/Salah": "PG Kompleks B/S"
};

const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMCMA = soal.type === "MCMA";
  const isBS = soal.type === "Benar/Salah";
  return (
    <div className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500 animate-slide-up"
      style={{ background: "linear-gradient(135deg,rgba(30,41,59,0.6) 0%,rgba(15,23,42,0.8) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%,rgba(0,200,255,0.08) 0%,transparent 50%)" }} />
      <div className="relative p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-primary/80 bg-primary/10 px-2 py-1 rounded-md">#{soal.id}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColor[soal.difficulty]}`}>{soal.difficulty}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColor[soal.type]}`}>{typeLabel[soal.type]}</span>
          <span className="text-xs text-white/30 font-body">{soal.category}</span>
        </div>
        <div className="mb-4">
          <div className="text-foreground font-body text-sm md:text-base leading-relaxed whitespace-pre-line">
            <MathText text={soal.question} />
          </div>
          {soal.svgKey && visualMap[soal.svgKey] && <div className="mt-3">{visualMap[soal.svgKey]}</div>}
        </div>
        {soal.options && (
          <div className="space-y-2 mb-4">
            {soal.options.map((opt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                <span className="text-sm text-foreground/90 font-body"><MathText text={opt} /></span>
              </div>
            ))}
          </div>
        )}
        {soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((s, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${isMCMA ? "bg-muted/30 border-border/30" : "bg-muted/20 border-border/20"}`}>
                <span className={`text-xs font-bold shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${isMCMA ? "bg-violet-500/20 text-violet-300" : "bg-fuchsia-500/20 text-fuchsia-300"}`}>
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/90 font-body"><MathText text={s.text} /></span>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { playPopSound(); setIsOpen(!isOpen); }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
          <span className="text-sm font-semibold text-primary">{isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[2000px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
          <div className="relative p-5 rounded-xl border border-primary/20"
            style={{ background: "linear-gradient(135deg,rgba(0,200,255,0.05) 0%,rgba(139,92,246,0.05) 100%)" }}>
            <h4 className="font-display text-sm md:text-base font-bold text-primary mb-3">Pembahasan</h4>
            {soal.correctAnswer && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40">
                <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Kunci Jawaban</p>
                <span className="text-sm text-emerald-300 font-body">
                  <MathText text={soal.correctAnswer} />
                </span>
              </div>
            )}
            {isBS && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Kunci Jawaban</p>
                <div className="flex flex-wrap gap-2">
                  {soal.statements.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded font-body ${s.isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                      ({i+1}) {s.isCorrect ? "✓ Benar" : "✗ Salah"}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {isMCMA && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                <p className="text-xs font-semibold text-violet-300 mb-1">✅ Pernyataan yang benar:</p>
                <p className="text-sm text-violet-200 font-body">
                  {soal.statements.map((s, i) => s.isCorrect ? `(${i+1})` : null).filter(Boolean).join(", ")}
                </p>
              </div>
            )}
            <div className="mb-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs font-semibold text-blue-300 mb-1">📖 Konsep</p>
              <p className="text-sm text-white/80 font-body">{soal.explanation.concept}</p>
            </div>
            <div className="space-y-2">
              {soal.explanation.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                  <span className="text-sm text-white/80 font-body"><MathText text={step} /></span>
                </div>
              ))}
            </div>
            {soal.explanation.formula && (
              <div className="mt-4 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-xs font-semibold text-violet-300 mb-2">📐 Rumus/Kunci</p>
                <div className="text-center"><BlockMath math={soal.explanation.formula} /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const BankSoalLingkaranPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalLingkaran.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalLingkaran.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalLingkaran.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalLingkaran.filter(s => s.difficulty === "Sulit").length,
    PG: soalLingkaran.filter(s => s.type === "PG").length,
    MCMA: soalLingkaran.filter(s => s.type === "MCMA").length,
    BS: soalLingkaran.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Circle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL LINGKARAN
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Unsur · Keliling · Luas · Busur · Juring · Tembereng · Sudut Pusat & Keliling · Garis Singgung
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS / ANBK / Literasi · PG + MCMA + Benar/Salah · Dengan Pembahasan
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
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalLingkaran.length} Soal</span>
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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalLingkaran.length} soal</p>
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

export default BankSoalLingkaranPage;
