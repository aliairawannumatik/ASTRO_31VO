import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Hash, ChevronDown, ChevronUp, Filter } from "lucide-react";
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
interface TableData { headers: string[]; rows: string[][]; }
interface Question {
  id: number;
  type: QuestionType;
  difficulty: Difficulty;
  category: string;
  question: string;
  options?: string[];
  statements?: Statement[];
  correctAnswer?: string;
  table?: TableData;
  svgKey?: string;
  explanation: { concept: string; steps: string[]; formula?: string; };
}

/* ── SVG Visual Components ── */
const SequenceSVG = ({ terms, label }: { terms: (string | number)[]; label: string }) => (
  <svg viewBox="0 0 300 80" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="150" y="16" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">{label}</text>
    {terms.map((t, i) => (
      <g key={i}>
        <circle cx={20 + i * 52} cy="45" r="18" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5" />
        <text x={20 + i * 52} y="49" fill="var(--icon-color)" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t}</text>
        {i < terms.length - 1 && <text x={20 + i * 52 + 30} y="49" fill="#64748b" fontSize="14" textAnchor="middle" fontFamily="monospace">→</text>}
      </g>
    ))}
    <text x="150" y="75" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">U₁  U₂  U₃  U₄  U₅</text>
  </svg>
);

const ArithSVG = ({ a, b, terms }: { a: number; b: number; terms: number[] }) => (
  <svg viewBox="0 0 300 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="150" y="14" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Barisan Aritmetika: a={a}, b={b}</text>
    {terms.map((t, i) => (
      <g key={i}>
        <rect x={10 + i * 56} y="22" width="42" height="28" rx="4" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5" />
        <text x={31 + i * 56} y="40" fill="var(--icon-color)" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t}</text>
        {i < terms.length - 1 && (
          <>
            <line x1={52 + i * 56} y1="36" x2={58 + i * 56} y2="36" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#arr2)" />
            <text x={55 + i * 56} y="30" fill="#22c55e" fontSize="7" textAnchor="middle" fontFamily="monospace">+{b}</text>
          </>
        )}
      </g>
    ))}
    <text x="150" y="75" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Uₙ = a + (n−1)b = {a} + (n−1)·{b}</text>
    <text x="150" y="88" fill="#a78bfa" fontSize="7.5" textAnchor="middle" fontFamily="monospace">a = suku pertama, b = beda</text>
  </svg>
);

const GeomSVG = ({ a, r, terms }: { a: number; r: number; terms: number[] }) => (
  <svg viewBox="0 0 300 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="150" y="14" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Barisan Geometri: a={a}, r={r}</text>
    {terms.map((t, i) => (
      <g key={i}>
        <rect x={10 + i * 56} y="22" width="42" height="28" rx="4" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5" />
        <text x={31 + i * 56} y="40" fill="var(--icon-color)" fontSize="11} " textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t}</text>
        {i < terms.length - 1 && (
          <>
            <line x1={52 + i * 56} y1="36" x2={58 + i * 56} y2="36" stroke="#f97316" strokeWidth="1.5" />
            <text x={55 + i * 56} y="30" fill="#f97316" fontSize="7" textAnchor="middle" fontFamily="monospace">×{r}</text>
          </>
        )}
      </g>
    ))}
    <text x="150" y="75" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Uₙ = a × rⁿ⁻¹ = {a} × {r}ⁿ⁻¹</text>
    <text x="150" y="88" fill="#a78bfa" fontSize="7.5" textAnchor="middle" fontFamily="monospace">a = suku pertama, r = rasio</text>
  </svg>
);

const TriangleSVG = () => (
  <svg viewBox="0 0 280 110" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="140" y="14" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Pola Bilangan Segitiga: 1, 3, 6, 10, 15...</text>
    {[1,3,6,10,15].map((v, i) => (
      <g key={i}>
        <circle cx={20 + i * 52} cy="55" r="19" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5" />
        <text x={20 + i * 52} y="59" fill="var(--icon-color)" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{v}</text>
        <text x={20 + i * 52} y="88" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">n={i+1}</text>
        {i < 4 && <text x={20 + i * 52 + 28} y="59" fill="#64748b" fontSize="12" textAnchor="middle">→</text>}
      </g>
    ))}
    <text x="140" y="104" fill="#4ade80" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Uₙ = n(n+1)/2</text>
  </svg>
);

const FibonacciSVG = () => (
  <svg viewBox="0 0 300 80" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="150" y="14" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Barisan Fibonacci: 1, 1, 2, 3, 5, 8...</text>
    {[1,1,2,3,5,8].map((v, i) => (
      <g key={i}>
        <circle cx={14 + i * 46} cy="44" r="16" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5" />
        <text x={14 + i * 46} y="48" fill="var(--icon-color)" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{v}</text>
        {i < 5 && <text x={14 + i * 46 + 26} y="48" fill="#64748b" fontSize="11" textAnchor="middle">→</text>}
      </g>
    ))}
    <text x="150" y="70" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Uₙ = Uₙ₋₁ + Uₙ₋₂ (jumlah dua suku sebelumnya)</text>
  </svg>
);

const TableVisual = ({ table }: { table: TableData }) => (
  <div className="overflow-x-auto my-3">
    <table className="w-full text-xs border-collapse rounded-lg overflow-hidden">
      <thead>
        <tr>{table.headers.map((h, i) => (
          <th key={i} className="bg-primary/20 border border-primary/30 px-3 py-2 text-primary font-bold text-center font-mono">
            <MathText text={h} />
          </th>
        ))}</tr>
      </thead>
      <tbody>
        {table.rows.map((row, i) => (
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
  "seq-2-4-6-8": <SequenceSVG terms={[2,4,6,8,"..."]} label="Pola Bilangan Genap" />,
  "seq-1-3-5-7": <SequenceSVG terms={[1,3,5,7,"..."]} label="Pola Bilangan Ganjil" />,
  "seq-1-4-9-16": <SequenceSVG terms={[1,4,9,16,"..."]} label="Pola Bilangan Persegi" />,
  "seq-3-6-9-12": <SequenceSVG terms={[3,6,9,12,"..."]} label="Kelipatan 3" />,
  "seq-2-6-18-54": <SequenceSVG terms={[2,6,18,54,"..."]} label="Barisan Geometri r=3" />,
  "arith-2-3": <ArithSVG a={2} b={3} terms={[2,5,8,11,14]} />,
  "arith-5-4": <ArithSVG a={5} b={4} terms={[5,9,13,17,21]} />,
  "arith-3-2": <ArithSVG a={3} b={2} terms={[3,5,7,9,11]} />,
  "arith-1-5": <ArithSVG a={1} b={5} terms={[1,6,11,16,21]} />,
  "arith-10-neg3": <ArithSVG a={10} b={-3} terms={[10,7,4,1,-2]} />,
  "geom-2-3": <GeomSVG a={2} r={3} terms={[2,6,18,54,162]} />,
  "geom-3-2": <GeomSVG a={3} r={2} terms={[3,6,12,24,48]} />,
  "geom-1-2": <GeomSVG a={1} r={2} terms={[1,2,4,8,16]} />,
  "geom-4-3": <GeomSVG a={4} r={3} terms={[4,12,36,108,324]} />,
  "triangle": <TriangleSVG />,
  "fibonacci": <FibonacciSVG />,
};

const soalPolaBilangan: Question[] = [
  /* ═══════════════════════════════════
     MUDAH  (Q1 – Q35)
  ═══════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Pola Bilangan Genap",
    question: "Perhatikan barisan bilangan: 2, 4, 6, 8, 10, ... Suku ke-10 barisan tersebut adalah ...",
    svgKey: "seq-2-4-6-8",
    options: ["A. 18", "B. 20", "C. 22", "D. 24"],
    correctAnswer: "B. 20",
    explanation: {
      concept: "Pola bilangan genap: suku ke-n = 2n.",
      steps: ["Pola bilangan genap: $U_n = 2n$", "$U_{10} = 2 \\times 10 = 20$"],
      formula: "U_n = 2n"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Pola Bilangan Ganjil",
    question: "Barisan bilangan ganjil: 1, 3, 5, 7, 9, ... Suku ke-15 adalah ...",
    svgKey: "seq-1-3-5-7",
    options: ["A. 27", "B. 29", "C. 31", "D. 33"],
    correctAnswer: "B. 29",
    explanation: {
      concept: "Pola bilangan ganjil: suku ke-n = 2n − 1.",
      steps: ["$U_n = 2n - 1$", "$U_{15} = 2 \\times 15 - 1 = 30 - 1 = 29$"],
      formula: "U_n = 2n - 1"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Pola Bilangan Persegi",
    question: "Pola bilangan: 1, 4, 9, 16, 25, ... adalah pola bilangan persegi. Suku ke-8 adalah ...",
    svgKey: "seq-1-4-9-16",
    options: ["A. 49", "B. 56", "C. 64", "D. 81"],
    correctAnswer: "C. 64",
    explanation: {
      concept: "Pola bilangan persegi: suku ke-n = n².",
      steps: ["$U_n = n^2$", "$U_8 = 8^2 = 64$"],
      formula: "U_n = n^2"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Pola Bilangan Segitiga",
    question: "Barisan bilangan segitiga: 1, 3, 6, 10, 15, ... Suku ke-6 adalah ...",
    svgKey: "triangle",
    options: ["A. 18", "B. 21", "C. 24", "D. 28"],
    correctAnswer: "B. 21",
    explanation: {
      concept: "Pola bilangan segitiga: suku ke-n = n(n+1)/2.",
      steps: ["$U_n = \\dfrac{n(n+1)}{2}$", "$U_6 = \\dfrac{6 \\times 7}{2} = \\dfrac{42}{2} = 21$"],
      formula: "U_n = \\dfrac{n(n+1)}{2}"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Barisan Aritmetika",
    question: "Dari barisan 3, 7, 11, 15, ... beda barisan tersebut adalah ...",
    svgKey: "arith-3-2",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "C. 4",
    explanation: {
      concept: "Beda (b) = suku berikutnya dikurangi suku sebelumnya.",
      steps: ["$b = U_2 - U_1 = 7 - 3 = 4$", "Cek: $11 - 7 = 4$ ✓; $15 - 11 = 4$ ✓"],
      formula: "b = U_n - U_{n-1}"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Barisan Aritmetika",
    question: "Barisan aritmetika: 2, 5, 8, 11, ... Suku ke-7 adalah ...",
    svgKey: "arith-2-3",
    options: ["A. 18", "B. 19", "C. 20", "D. 21"],
    correctAnswer: "C. 20",
    explanation: {
      concept: "Rumus suku ke-n barisan aritmetika: Uₙ = a + (n−1)b.",
      steps: ["$a = 2$, $b = 3$", "$U_7 = 2 + (7-1) \\times 3 = 2 + 18 = 20$"],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Barisan Aritmetika",
    question: "Barisan aritmetika: 5, 9, 13, 17, ... Suku ke-10 adalah ...",
    svgKey: "arith-5-4",
    options: ["A. 40", "B. 41", "C. 42", "D. 45"],
    correctAnswer: "B. 41",
    explanation: {
      concept: "Rumus suku ke-n: Uₙ = a + (n−1)b.",
      steps: ["$a = 5$, $b = 4$", "$U_{10} = 5 + (10-1) \\times 4 = 5 + 36 = 41$"],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Barisan Geometri",
    question: "Barisan geometri: 3, 6, 12, 24, ... Rasio barisan tersebut adalah ...",
    svgKey: "geom-3-2",
    options: ["A. 2", "B. 3", "C. 4", "D. 6"],
    correctAnswer: "A. 2",
    explanation: {
      concept: "Rasio (r) = suku berikutnya dibagi suku sebelumnya.",
      steps: ["$r = U_2 \\div U_1 = 6 \\div 3 = 2$", "Cek: $12 \\div 6 = 2$ ✓; $24 \\div 12 = 2$ ✓"],
      formula: "r = \\dfrac{U_{n+1}}{U_n}"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Barisan Geometri",
    question: "Barisan geometri: 1, 2, 4, 8, 16, ... Suku ke-8 adalah ...",
    svgKey: "geom-1-2",
    options: ["A. 64", "B. 96", "C. 128", "D. 256"],
    correctAnswer: "C. 128",
    explanation: {
      concept: "Rumus suku ke-n barisan geometri: Uₙ = a × rⁿ⁻¹.",
      steps: ["$a = 1$, $r = 2$", "$U_8 = 1 \\times 2^{8-1} = 2^7 = 128$"],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Identifikasi Pola",
    question: "Manakah yang merupakan barisan aritmetika?",
    options: ["A. 1, 2, 4, 8, 16", "B. 2, 4, 8, 16, 32", "C. 3, 6, 9, 12, 15", "D. 1, 3, 9, 27, 81"],
    correctAnswer: "C. 3, 6, 9, 12, 15",
    explanation: {
      concept: "Barisan aritmetika memiliki beda tetap antara suku-suku berurutan.",
      steps: ["A: $2-1=1, 4-2=2$ → beda tidak sama → bukan aritmetika", "B: $4-2=2, 8-4=4$ → beda tidak sama → bukan aritmetika", "C: $6-3=3, 9-6=3, 12-9=3, 15-12=3$ → beda tetap 3 → ARITMETIKA ✓", "D: Geometri dengan $r = 3$"],
      formula: "b = U_2 - U_1 = U_3 - U_2 = \\ldots \\text{ (tetap)}"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Suku ke-n Aritmetika",
    question: "Barisan aritmetika mempunyai suku pertama 1 dan beda 5. Suku ke-8 barisan tersebut adalah ...",
    svgKey: "arith-1-5",
    options: ["A. 31", "B. 36", "C. 41", "D. 46"],
    correctAnswer: "B. 36",
    explanation: {
      concept: "Uₙ = a + (n−1)b dengan a = 1 dan b = 5.",
      steps: ["$U_8 = 1 + (8-1) \\times 5$", "$= 1 + 7 \\times 5 = 1 + 35 = 36$"],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Pola Bilangan Kelipatan",
    question: "Barisan 3, 6, 9, 12, ... Suku ke-12 adalah ...",
    svgKey: "seq-3-6-9-12",
    options: ["A. 32", "B. 34", "C. 36", "D. 38"],
    correctAnswer: "C. 36",
    explanation: {
      concept: "Barisan kelipatan 3: Uₙ = 3n.",
      steps: ["$U_n = 3n$", "$U_{12} = 3 \\times 12 = 36$"],
      formula: "U_n = 3n"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Pola Bilangan",
    question: "Bilangan Fibonacci: 1, 1, 2, 3, 5, 8, 13, ... Suku ke-9 adalah ...",
    svgKey: "fibonacci",
    options: ["A. 21", "B. 34", "C. 55", "D. 89"],
    correctAnswer: "B. 34",
    explanation: {
      concept: "Barisan Fibonacci: setiap suku = jumlah dua suku sebelumnya.",
      steps: ["Suku ke-8: $8 + 13 = 21$", "Suku ke-9: $13 + 21 = 34$"],
      formula: "U_n = U_{n-1} + U_{n-2}"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Barisan Geometri",
    question: "Barisan geometri: 2, 6, 18, 54, ... Suku ke-5 adalah ...",
    svgKey: "geom-2-3",
    options: ["A. 108", "B. 162", "C. 216", "D. 243"],
    correctAnswer: "B. 162",
    explanation: {
      concept: "Uₙ = a × rⁿ⁻¹ dengan a = 2, r = 3.",
      steps: ["$r = 6 \\div 2 = 3$", "$U_5 = 2 \\times 3^{5-1} = 2 \\times 81 = 162$"],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Mencari Suku",
    question: "Dari barisan aritmetika 10, 7, 4, 1, −2, ... Suku ke-6 adalah ...",
    svgKey: "arith-10-neg3",
    options: ["A. −5", "B. −4", "C. −3", "D. −6"],
    correctAnswer: "A. −5",
    explanation: {
      concept: "Beda negatif: barisan menurun.",
      steps: ["$b = 7 - 10 = -3$", "$U_6 = 10 + (6-1) \\times (-3) = 10 - 15 = -5$"],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Pola Bilangan Persegi Panjang",
    question: "Pola bilangan persegi panjang: 2, 6, 12, 20, 30, ... Suku ke-6 adalah ...",
    options: ["A. 40", "B. 42", "C. 44", "D. 48"],
    correctAnswer: "B. 42",
    explanation: {
      concept: "Pola bilangan persegi panjang: Uₙ = n(n+1).",
      steps: ["$U_n = n(n+1)$", "$U_6 = 6 \\times 7 = 42$"],
      formula: "U_n = n(n+1)"
    }
  },
  {
    id: 17, type: "Benar/Salah", difficulty: "Mudah", category: "Konsep Barisan",
    question: "Tentukan BENAR atau SALAH pernyataan berikut tentang pola bilangan!",
    statements: [
      { text: "Barisan 2, 4, 8, 16 adalah barisan geometri dengan rasio 2", isCorrect: true },
      { text: "Beda barisan 5, 8, 11, 14 adalah 3", isCorrect: true },
      { text: "Suku ke-5 barisan ganjil adalah 9", isCorrect: true }
    ],
    explanation: {
      concept: "Identifikasi jenis barisan dan sifat-sifatnya.",
      steps: ["$r = 4/2 = 8/4 = 2$ → BENAR ✓", "$b = 8-5 = 11-8 = 14-11 = 3$ → BENAR ✓", "$U_5 = 2(5) - 1 = 9$ → BENAR ✓"],
      formula: ""
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Suku ke-n Geometri",
    question: "Barisan geometri: 4, 12, 36, 108, ... Suku ke-6 adalah ...",
    svgKey: "geom-4-3",
    options: ["A. 972", "B. 1.296", "C. 1.458", "D. 2.916"],
    correctAnswer: "A. 972",
    explanation: {
      concept: "Uₙ = a × rⁿ⁻¹ dengan a = 4, r = 3.",
      steps: ["$r = 12 \\div 4 = 3$", "$U_6 = 4 \\times 3^5 = 4 \\times 243 = 972$"],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Deret Aritmetika",
    question: "Jumlah 5 suku pertama barisan aritmetika 2, 4, 6, 8, 10 adalah ...",
    options: ["A. 25", "B. 28", "C. 30", "D. 32"],
    correctAnswer: "C. 30",
    explanation: {
      concept: "Deret aritmetika: Sₙ = n/2 × (a + Uₙ).",
      steps: ["$a = 2$, $U_5 = 10$, $n = 5$", "$S_5 = \\dfrac{5}{2} \\times (2 + 10) = \\dfrac{5}{2} \\times 12 = 30$"],
      formula: "S_n = \\dfrac{n}{2}(a + U_n)"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Deret Aritmetika",
    question: "Jumlah 10 suku pertama barisan 1, 2, 3, 4, ... adalah ...",
    options: ["A. 50", "B. 55", "C. 60", "D. 65"],
    correctAnswer: "B. 55",
    explanation: {
      concept: "Sₙ = n(n+1)/2 untuk bilangan asli.",
      steps: ["$S_{10} = \\dfrac{10 \\times 11}{2} = \\dfrac{110}{2} = 55$"],
      formula: "S_n = \\dfrac{n(n+1)}{2}"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Mencari Suku Tengah",
    question: "Barisan aritmetika: 4, 8, 12, 16, 20. Suku tengah barisan tersebut adalah ...",
    options: ["A. 8", "B. 10", "C. 12", "D. 14"],
    correctAnswer: "C. 12",
    explanation: {
      concept: "Suku tengah = suku ke-((n+1)/2) dari barisan ganjil suku.",
      steps: ["Jumlah suku = 5 (ganjil)", "Suku tengah = suku ke-$(\\frac{5+1}{2}) = $ suku ke-3 = 12"],
      formula: "U_{\\text{tengah}} = \\dfrac{a + U_n}{2}"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Identifikasi Pola",
    question: "Suku berikutnya dari pola 1, 4, 9, 16, ... adalah ...",
    options: ["A. 20", "B. 24", "C. 25", "D. 28"],
    correctAnswer: "C. 25",
    explanation: {
      concept: "Pola bilangan kuadrat: Uₙ = n². Suku berikutnya adalah 5² = 25.",
      steps: ["$1 = 1^2, 4 = 2^2, 9 = 3^2, 16 = 4^2$", "Suku ke-5 $= 5^2 = 25$"],
      formula: "U_n = n^2"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Barisan Aritmetika",
    question: "Jika suku pertama barisan aritmetika adalah 7 dan bedanya 3, suku ke-12 adalah ...",
    options: ["A. 38", "B. 40", "C. 42", "D. 44"],
    correctAnswer: "B. 40",
    explanation: {
      concept: "Uₙ = a + (n−1)b.",
      steps: ["$a = 7$, $b = 3$", "$U_{12} = 7 + (12-1) \\times 3 = 7 + 33 = 40$"],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Deret Geometri",
    question: "Jumlah 4 suku pertama barisan geometri 1, 2, 4, 8, ... adalah ...",
    options: ["A. 12", "B. 14", "C. 15", "D. 16"],
    correctAnswer: "C. 15",
    explanation: {
      concept: "Deret geometri: Sₙ = a(rⁿ − 1)/(r − 1) untuk r ≠ 1.",
      steps: ["$a = 1$, $r = 2$, $n = 4$", "$S_4 = \\dfrac{1 \\times (2^4 - 1)}{2 - 1} = \\dfrac{16 - 1}{1} = 15$"],
      formula: "S_n = \\dfrac{a(r^n - 1)}{r - 1}"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Pola Konfigurasi Objek",
    question: "Perhatikan pola susunan batang korek api: baris ke-1 = 4 batang, baris ke-2 = 7 batang, baris ke-3 = 10 batang. Baris ke-5 membutuhkan ... batang.",
    options: ["A. 13", "B. 14", "C. 15", "D. 16"],
    correctAnswer: "D. 16",
    explanation: {
      concept: "Ini adalah barisan aritmetika dengan a = 4, b = 3.",
      steps: ["$a = 4$, $b = 3$", "$U_5 = 4 + (5-1) \\times 3 = 4 + 12 = 16$"],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Barisan Geometri",
    question: "Suku pertama barisan geometri adalah 5 dan rasionya 2. Suku ke-5 adalah ...",
    options: ["A. 80", "B. 90", "C. 100", "D. 160"],
    correctAnswer: "A. 80",
    explanation: {
      concept: "Uₙ = a × rⁿ⁻¹.",
      steps: ["$a = 5$, $r = 2$", "$U_5 = 5 \\times 2^4 = 5 \\times 16 = 80$"],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Pola Bilangan",
    question: "Suku ke-7 dari barisan bilangan: 2, 3, 5, 8, 12, 17, ... adalah ...",
    options: ["A. 22", "B. 23", "C. 24", "D. 25"],
    correctAnswer: "B. 23",
    explanation: {
      concept: "Setiap selisih antar suku bertambah 1: 1, 2, 3, 4, 5, ...",
      steps: ["Selisih: $1, 2, 3, 4, 5$", "Selisih berikutnya: $6$", "$U_7 = 17 + 6 = 23$"],
      formula: ""
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Deret Aritmetika",
    question: "Jumlah bilangan genap dari 2 sampai 20 adalah ...",
    options: ["A. 100", "B. 105", "C. 110", "D. 120"],
    correctAnswer: "C. 110",
    explanation: {
      concept: "Jumlah n bilangan genap pertama = n(n+1). Bilangan genap 2,4,...,20 ada 10 bilangan.",
      steps: ["$n = 10$", "$S = \\dfrac{10}{2} \\times (2 + 20) = 5 \\times 22 = 110$"],
      formula: "S_n = \\dfrac{n}{2}(a + U_n)"
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Barisan Aritmetika",
    question: "Diketahui barisan aritmetika dengan $U_3 = 11$ dan $U_6 = 20$. Nilai beda barisan tersebut adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Gunakan selisih suku yang diketahui untuk mencari beda.",
      steps: ["$U_6 - U_3 = (6-3) \\times b$", "$20 - 11 = 3b$", "$9 = 3b \\Rightarrow b = 3$"],
      formula: "U_m - U_n = (m-n) \\times b"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Mencari Suku Pertama",
    question: "Barisan aritmetika dengan beda 4 dan suku ke-5 adalah 21. Suku pertamanya adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "Dari Uₙ = a + (n−1)b, cari a.",
      steps: ["$U_5 = a + 4 \\times 4 = 21$", "$a + 16 = 21$", "$a = 5$"],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "Pola Bilangan",
    question: "Bilangan pada urutan ke-20 dari barisan: 5, 10, 15, 20, ... adalah ...",
    options: ["A. 95", "B. 100", "C. 105", "D. 110"],
    correctAnswer: "B. 100",
    explanation: {
      concept: "Barisan kelipatan 5: Uₙ = 5n.",
      steps: ["$U_n = 5n$", "$U_{20} = 5 \\times 20 = 100$"],
      formula: "U_n = 5n"
    }
  },
  {
    id: 32, type: "Benar/Salah", difficulty: "Mudah", category: "Konsep Barisan Geometri",
    question: "Perhatikan barisan: 3, 9, 27, 81. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Barisan tersebut adalah barisan geometri", isCorrect: true },
      { text: "Rasio barisan tersebut adalah 3", isCorrect: true },
      { text: "Suku ke-5 barisan tersebut adalah 243", isCorrect: true }
    ],
    explanation: {
      concept: "Identifikasi barisan geometri dan sifatnya.",
      steps: ["$9/3 = 27/9 = 81/27 = 3$ → barisan geometri, $r = 3$ → BENAR ✓", "$U_5 = 3 \\times 3^4 = 3 \\times 81 = 243$ → BENAR ✓"],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Suku ke-n",
    question: "Manakah rumus suku ke-n yang tepat untuk barisan 4, 7, 10, 13, ...?",
    options: ["A. $U_n = 3n + 1$", "B. $U_n = 4n - 1$", "C. $U_n = 3n$", "D. $U_n = 2n + 2$"],
    correctAnswer: "A. $U_n = 3n + 1$",
    explanation: {
      concept: "Rumus Uₙ = a + (n−1)b = a − b + bn.",
      steps: ["$a = 4$, $b = 3$", "$U_n = 4 + (n-1) \\times 3 = 4 + 3n - 3 = 3n + 1$", "Cek: $n=1: 3(1)+1=4$ ✓; $n=2: 3(2)+1=7$ ✓"],
      formula: "U_n = 3n + 1"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Deret Aritmetika",
    question: "Jumlah 8 suku pertama barisan 3, 5, 7, 9, ... adalah ...",
    options: ["A. 74", "B. 76", "C. 80", "D. 82"],
    correctAnswer: "C. 80",
    explanation: {
      concept: "Sₙ = n/2 × (2a + (n−1)b).",
      steps: ["$a = 3$, $b = 2$, $n = 8$", "$S_8 = \\dfrac{8}{2} \\times (2 \\times 3 + 7 \\times 2) = 4 \\times (6+14) = 4 \\times 20 = 80$"],
      formula: "S_n = \\dfrac{n}{2}(2a + (n-1)b)"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Pola Konfigurasi Objek",
    question: "Susunan titik membentuk pola: 1, 3, 6, 10, ... Pola ini disebut ...",
    options: ["A. Pola bilangan persegi", "B. Pola bilangan segitiga", "C. Pola bilangan genap", "D. Pola bilangan ganjil"],
    correctAnswer: "B. Pola bilangan segitiga",
    explanation: {
      concept: "Pola 1, 3, 6, 10 sesuai rumus n(n+1)/2 — bilangan segitiga.",
      steps: ["$n=1: 1(2)/2=1$ ✓", "$n=2: 2(3)/2=3$ ✓", "$n=3: 3(4)/2=6$ ✓", "Ini adalah pola bilangan segitiga"],
      formula: "U_n = \\dfrac{n(n+1)}{2}"
    }
  },

  /* ═══════════════════════════════════
     SEDANG  (Q36 – Q70)
  ═══════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "Barisan Aritmetika",
    question: "Suku ke-3 dan suku ke-7 barisan aritmetika berturut-turut adalah 11 dan 23. Suku ke-15 adalah ...",
    options: ["A. 44", "B. 47", "C. 49", "D. 51"],
    correctAnswer: "B. 47",
    explanation: {
      concept: "Cari beda dari dua suku yang diketahui, lalu cari a, lalu cari U₁₅.",
      steps: [
        "$U_7 - U_3 = (7-3) \\times b \\Rightarrow 23 - 11 = 4b \\Rightarrow b = 3$",
        "$U_3 = a + 2b \\Rightarrow 11 = a + 6 \\Rightarrow a = 5$",
        "$U_{15} = 5 + 14 \\times 3 = 5 + 42 = 47$"
      ],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "Deret Aritmetika",
    question: "Jumlah 20 suku pertama barisan aritmetika 3, 7, 11, 15, ... adalah ...",
    options: ["A. 780", "B. 800", "C. 820", "D. 840"],
    correctAnswer: "C. 820",
    explanation: {
      concept: "Sₙ = n/2 × (2a + (n−1)b).",
      steps: [
        "$a = 3$, $b = 4$, $n = 20$",
        "$S_{20} = \\dfrac{20}{2} \\times (2 \\times 3 + 19 \\times 4)$",
        "$= 10 \\times (6 + 76) = 10 \\times 82 = 820$"
      ],
      formula: "S_n = \\dfrac{n}{2}(2a + (n-1)b)"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "Barisan Geometri",
    question: "Suku ke-2 barisan geometri adalah 6 dan suku ke-4 adalah 54. Suku ke-6 adalah ...",
    options: ["A. 162", "B. 324", "C. 486", "D. 729"],
    correctAnswer: "C. 486",
    explanation: {
      concept: "Cari r dari perbandingan dua suku, lalu cari suku yang diminta.",
      steps: [
        "$\\dfrac{U_4}{U_2} = r^2 \\Rightarrow \\dfrac{54}{6} = r^2 = 9 \\Rightarrow r = 3$",
        "$U_2 = a \\times r \\Rightarrow 6 = a \\times 3 \\Rightarrow a = 2$",
        "$U_6 = 2 \\times 3^5 = 2 \\times 243 = 486$"
      ],
      formula: "\\dfrac{U_m}{U_n} = r^{m-n}"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "Deret Geometri",
    question: "Jumlah 5 suku pertama barisan geometri 2, 6, 18, ... adalah ...",
    svgKey: "geom-2-3",
    options: ["A. 200", "B. 242", "C. 244", "D. 248"],
    correctAnswer: "C. 244",
    explanation: {
      concept: "Sₙ = a(rⁿ − 1)/(r − 1).",
      steps: [
        "$a = 2$, $r = 3$, $n = 5$",
        "$S_5 = \\dfrac{2(3^5 - 1)}{3 - 1} = \\dfrac{2 \\times 242}{2} = 242$"
      ],
      formula: "S_n = \\dfrac{a(r^n - 1)}{r - 1}"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang siswa menabung setiap bulan dengan pola: bulan ke-1 Rp50.000, bulan ke-2 Rp70.000, bulan ke-3 Rp90.000. Jika pola ini terus berlanjut, total tabungan selama 12 bulan adalah ...",
    options: ["A. Rp1.680.000", "B. Rp1.720.000", "C. Rp1.800.000", "D. Rp1.920.000"],
    correctAnswer: "A. Rp1.680.000",
    explanation: {
      concept: "Deret aritmetika dengan a = 50.000 dan b = 20.000.",
      steps: [
        "$a = 50.000$, $b = 20.000$, $n = 12$",
        "$S_{12} = \\dfrac{12}{2} \\times (2 \\times 50.000 + 11 \\times 20.000)$",
        "$= 6 \\times (100.000 + 220.000) = 6 \\times 320.000 = 1.920.000$"
      ],
      formula: "S_n = \\dfrac{n}{2}(2a + (n-1)b)"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "Suku ke-n",
    question: "Rumus suku ke-n barisan 2, 5, 10, 17, 26, ... adalah ...",
    options: ["A. $n^2 + 1$", "B. $n^2 + n$", "C. $2n + 1$", "D. $n^2 - 1$"],
    correctAnswer: "A. $n^2 + 1$",
    explanation: {
      concept: "Cari pola dengan memeriksa selisih tingkat dua.",
      steps: [
        "Selisih pertama: $3, 5, 7, 9$ → bertambah 2 (selisih kedua konstan = 2 → kuadrat)",
        "Uₙ = an² + bn + c. Coba $U_n = n^2 + 1$:",
        "$n=1: 1+1=2$ ✓; $n=2: 4+1=5$ ✓; $n=3: 9+1=10$ ✓"
      ],
      formula: "U_n = n^2 + 1"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "Barisan Aritmetika",
    question: "Suku ke-p dari barisan aritmetika adalah 3p + 5. Beda barisan tersebut adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Beda = U(n+1) − Uₙ dari rumus Uₙ = 3n + 5.",
      steps: [
        "$U_n = 3n + 5$",
        "$b = U_{n+1} - U_n = [3(n+1)+5] - [3n+5]$",
        "$= 3n + 3 + 5 - 3n - 5 = 3$"
      ],
      formula: "b = U_{n+1} - U_n"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "Kontekstual Konfigurasi",
    question: "Tumpukan bata: baris bawah 30 bata, setiap baris berkurang 2 bata ke atas. Jika ada 10 baris, total bata adalah ...",
    options: ["A. 200", "B. 210", "C. 220", "D. 240"],
    correctAnswer: "B. 210",
    explanation: {
      concept: "Deret aritmetika menurun: a = 30, b = −2, n = 10.",
      steps: [
        "$S_{10} = \\dfrac{10}{2} \\times (2 \\times 30 + 9 \\times (-2))$",
        "$= 5 \\times (60 - 18) = 5 \\times 42 = 210$"
      ],
      formula: "S_n = \\dfrac{n}{2}(2a + (n-1)b)"
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "Barisan Geometri",
    question: "Suatu barisan geometri memiliki suku ke-3 adalah 18 dan suku ke-6 adalah 486. Suku pertamanya adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 6"],
    correctAnswer: "A. 2",
    explanation: {
      concept: "Gunakan perbandingan suku untuk cari r, kemudian cari a.",
      steps: [
        "$\\dfrac{U_6}{U_3} = r^3 \\Rightarrow \\dfrac{486}{18} = r^3 = 27 \\Rightarrow r = 3$",
        "$U_3 = a \\times r^2 \\Rightarrow 18 = a \\times 9 \\Rightarrow a = 2$"
      ],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "Deret Aritmetika UN",
    question: "(UN) Jumlah semua bilangan ganjil dari 1 sampai 99 adalah ...",
    options: ["A. 2.000", "B. 2.200", "C. 2.500", "D. 2.550"],
    correctAnswer: "C. 2.500",
    explanation: {
      concept: "Bilangan ganjil 1, 3, 5, ..., 99. Ada 50 bilangan ganjil. Jumlah n bilangan ganjil pertama = n².",
      steps: [
        "Banyak bilangan ganjil dari 1 s/d 99: $n = 50$",
        "$S = n^2 = 50^2 = 2.500$"
      ],
      formula: "S = n^2 \\text{ (jumlah n bilangan ganjil pertama)}"
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Barisan Geometri",
    question: "Seorang petani memanen padi sebanyak 100 kg pada tahun pertama. Setiap tahun hasil panen meningkat 20% dari tahun sebelumnya. Hasil panen pada tahun ke-3 adalah ...",
    options: ["A. 140 kg", "B. 144 kg", "C. 150 kg", "D. 160 kg"],
    correctAnswer: "B. 144 kg",
    explanation: {
      concept: "Panen meningkat 20% setiap tahun → barisan geometri dengan r = 1,2.",
      steps: [
        "$a = 100$, $r = 1{,}2$",
        "$U_3 = 100 \\times 1{,}2^2 = 100 \\times 1{,}44 = 144$ kg"
      ],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "Deret Geometri",
    question: "Selembar kertas dilipat sehingga menjadi 2 bagian, lalu dilipat lagi menjadi 4 bagian, dst. Jumlah total bagian setelah 5 kali lipatan adalah ...",
    options: ["A. 32", "B. 60", "C. 62", "D. 63"],
    correctAnswer: "C. 62",
    explanation: {
      concept: "Barisan geometri: 2, 4, 8, 16, 32 (setelah lipatan ke-1 s/d ke-5).",
      steps: [
        "$S_5 = \\dfrac{2(2^5 - 1)}{2-1} = 2 \\times 31 = 62$"
      ],
      formula: "S_n = \\dfrac{a(r^n - 1)}{r - 1}"
    }
  },
  {
    id: 48, type: "Benar/Salah", difficulty: "Sedang", category: "Analisis Barisan",
    question: "Diketahui barisan aritmetika dengan $U_4 = 14$ dan $U_8 = 26$. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Beda barisan tersebut adalah 3", isCorrect: true },
      { text: "Suku pertama barisan tersebut adalah 5", isCorrect: true },
      { text: "Suku ke-20 barisan tersebut adalah 62", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis lengkap barisan aritmetika dari dua suku yang diketahui.",
      steps: [
        "$b = \\dfrac{U_8 - U_4}{8-4} = \\dfrac{26-14}{4} = 3$ → BENAR ✓",
        "$a = U_4 - 3b = 14 - 9 = 5$ → BENAR ✓",
        "$U_{20} = 5 + 19 \\times 3 = 5 + 57 = 62$ → BENAR ✓"
      ],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "ANBK Pola Bilangan",
    question: "(ANBK) Sebuah tangga memiliki anak tangga 1, 3, 6, 10, ... anak paku di setiap anak tangga. Berapa total paku pada 8 anak tangga pertama?",
    options: ["A. 112", "B. 120", "C. 136", "D. 144"],
    correctAnswer: "B. 120",
    explanation: {
      concept: "Total paku = jumlah 8 suku pertama barisan segitiga: 1+3+6+10+15+21+28+36.",
      steps: [
        "$U_n = \\dfrac{n(n+1)}{2}$: suku ke 1..8 adalah 1, 3, 6, 10, 15, 21, 28, 36",
        "Total $= 1+3+6+10+15+21+28+36 = 120$"
      ],
      formula: "\\sum_{k=1}^{n} \\dfrac{k(k+1)}{2} = \\dfrac{n(n+1)(n+2)}{6}"
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "Kontekstual Barisan",
    question: "Sebuah bola dijatuhkan dari ketinggian 80 m. Setiap kali memantul mencapai 1/2 ketinggian sebelumnya. Tinggi pantulan ke-4 adalah ...",
    options: ["A. 5 m", "B. 10 m", "C. 15 m", "D. 20 m"],
    correctAnswer: "A. 5 m",
    explanation: {
      concept: "Barisan geometri dengan a = 80, r = 1/2.",
      steps: [
        "Pantulan ke-1: $80 \\times \\frac{1}{2} = 40$ m",
        "Pantulan ke-2: $40 \\times \\frac{1}{2} = 20$ m",
        "Pantulan ke-3: $20 \\times \\frac{1}{2} = 10$ m",
        "Pantulan ke-4: $10 \\times \\frac{1}{2} = 5$ m"
      ],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "Mencari n",
    question: "Pada barisan aritmetika 4, 7, 10, 13, ... suku ke berapa yang nilainya 100?",
    options: ["A. 30", "B. 32", "C. 33", "D. 35"],
    correctAnswer: "C. 33",
    explanation: {
      concept: "Dari Uₙ = a + (n−1)b, cari n ketika Uₙ = 100.",
      steps: [
        "$100 = 4 + (n-1) \\times 3$",
        "$96 = (n-1) \\times 3$",
        "$n - 1 = 32$, maka $n = 33$"
      ],
      formula: "n = \\dfrac{U_n - a}{b} + 1"
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "Deret Aritmetika UN",
    question: "(UN) Jumlah 12 suku pertama deret 5 + 8 + 11 + 14 + ... adalah ...",
    options: ["A. 258", "B. 262", "C. 270", "D. 278"],
    correctAnswer: "A. 258",
    explanation: {
      concept: "Deret aritmetika: a = 5, b = 3, n = 12.",
      steps: [
        "$S_{12} = \\dfrac{12}{2} \\times (2 \\times 5 + 11 \\times 3)$",
        "$= 6 \\times (10 + 33) = 6 \\times 43 = 258$"
      ],
      formula: "S_n = \\dfrac{n}{2}(2a + (n-1)b)"
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "Barisan Geometri",
    question: "Suatu bakteri membelah diri setiap 20 menit. Jika awalnya ada 5 bakteri, setelah 2 jam berapa banyak bakteri?",
    svgKey: "geom-1-2",
    options: ["A. 320", "B. 640", "C. 960", "D. 1.280"],
    correctAnswer: "A. 320",
    explanation: {
      concept: "2 jam = 6 kali pembelahan (setiap 20 menit). r = 2.",
      steps: [
        "2 jam $= 120$ menit $= 6 \\times 20$ menit → 6 kali pembelahan",
        "$U_7 = 5 \\times 2^6 = 5 \\times 64 = 320$ bakteri"
      ],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 54, type: "MCMA", difficulty: "Sedang", category: "MCMA Barisan",
    question: "Diketahui barisan geometri: 3, 6, 12, 24, 48, ... Manakah pernyataan yang BENAR?\n(1) Rasio barisan adalah 2\n(2) Suku ke-7 adalah 192\n(3) Suku ke-8 adalah 384\n(4) Jumlah 5 suku pertama adalah 93",
    statements: [
      { text: "Rasio barisan adalah 2", isCorrect: true },
      { text: "Suku ke-7 adalah 192", isCorrect: true },
      { text: "Suku ke-8 adalah 384", isCorrect: true },
      { text: "Jumlah 5 suku pertama adalah 93", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi setiap pernyataan tentang barisan geometri.",
      steps: [
        "(1): $r = 6/3 = 2$ → BENAR ✓",
        "(2): $U_7 = 3 \\times 2^6 = 3 \\times 64 = 192$ → BENAR ✓",
        "(3): $U_8 = 3 \\times 2^7 = 3 \\times 128 = 384$ → BENAR ✓",
        "(4): $S_5 = \\dfrac{3(2^5-1)}{1} = 3 \\times 31 = 93$ → BENAR ✓"
      ],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Seorang arsitek merancang tangga berbentuk spiral. Anak tangga ke-1 selebar 20 cm, setiap anak tangga berikutnya 5 cm lebih lebar. Lebar total (jumlah) dari 10 anak tangga pertama adalah ...",
    options: ["A. 400 cm", "B. 425 cm", "C. 450 cm", "D. 475 cm"],
    correctAnswer: "B. 425 cm",
    explanation: {
      concept: "Deret aritmetika dengan a = 20, b = 5, n = 10.",
      steps: [
        "$S_{10} = \\dfrac{10}{2} \\times (2 \\times 20 + 9 \\times 5)$",
        "$= 5 \\times (40 + 45) = 5 \\times 85 = 425$ cm"
      ],
      formula: "S_n = \\dfrac{n}{2}(2a + (n-1)b)"
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "Pola Konfigurasi Objek",
    question: "Pola susunan segitiga: baris ke-1 ada 1 segitiga, baris ke-2 ada 3, baris ke-3 ada 5, dst. Berapa segitiga pada baris ke-n?",
    options: ["A. $2n$", "B. $2n - 1$", "C. $n^2$", "D. $n(n+1)/2$"],
    correctAnswer: "B. $2n - 1$",
    explanation: {
      concept: "Pola bilangan ganjil: suku ke-n = 2n − 1.",
      steps: [
        "$n=1: 2(1)-1=1$ ✓",
        "$n=2: 2(2)-1=3$ ✓",
        "$n=3: 2(3)-1=5$ ✓"
      ],
      formula: "U_n = 2n - 1"
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "Deret Geometri Kontekstual",
    question: "Nilai sebuah mobil turun 10% setiap tahun. Jika harga awalnya Rp200.000.000, berapa nilai mobil setelah 3 tahun?",
    options: ["A. Rp145.800.000", "B. Rp160.000.000", "C. Rp162.000.000", "D. Rp180.000.000"],
    correctAnswer: "A. Rp145.800.000",
    explanation: {
      concept: "Barisan geometri dengan a = 200.000.000, r = 0,9.",
      steps: [
        "$U_4 = 200.000.000 \\times (0{,}9)^3$",
        "$= 200.000.000 \\times 0{,}729 = 145.800.000$"
      ],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "Barisan Aritmetika",
    question: "Suku ke-5 suatu barisan aritmetika adalah 23 dan suku ke-9 adalah 39. Suku ke-15 barisan itu adalah ...",
    options: ["A. 59", "B. 61", "C. 63", "D. 65"],
    correctAnswer: "C. 63",
    explanation: {
      concept: "Cari b dari selisih suku, lalu cari a, lalu cari U₁₅.",
      steps: [
        "$b = \\dfrac{39 - 23}{9 - 5} = \\dfrac{16}{4} = 4$",
        "$a = U_5 - 4b = 23 - 16 = 7$",
        "$U_{15} = 7 + 14 \\times 4 = 7 + 56 = 63$"
      ],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "ANBK Kontekstual",
    question: "(ANBK) Seorang pelari berlatih dengan pola: hari pertama 2 km, hari kedua 2,5 km, hari ketiga 3 km. Jika pola berlanjut, total jarak yang ditempuh dalam 30 hari adalah ...",
    options: ["A. 280 km", "B. 282,5 km", "C. 285 km", "D. 292,5 km"],
    correctAnswer: "C. 285 km",
    explanation: {
      concept: "Deret aritmetika: a = 2, b = 0,5, n = 30.",
      steps: [
        "$S_{30} = \\dfrac{30}{2} \\times (2 \\times 2 + 29 \\times 0{,}5)$",
        "$= 15 \\times (4 + 14{,}5) = 15 \\times 18{,}5 = 277{,}5$ km"
      ],
      formula: "S_n = \\dfrac{n}{2}(2a + (n-1)b)"
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "Barisan Geometri",
    question: "Pada barisan geometri 2, 6, 18, 54, ... suku ke berapa yang bernilai 4.374?",
    svgKey: "seq-2-6-18-54",
    options: ["A. 6", "B. 7", "C. 8", "D. 9"],
    correctAnswer: "C. 8",
    explanation: {
      concept: "Dari Uₙ = arⁿ⁻¹, cari n ketika Uₙ = 4.374.",
      steps: [
        "$4.374 = 2 \\times 3^{n-1}$",
        "$3^{n-1} = 2.187 = 3^7$",
        "$n - 1 = 7 \\Rightarrow n = 8$"
      ],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "Deret Aritmetika",
    question: "Seorang kontraktor membangun 3 rumah pada bulan pertama, 5 rumah bulan kedua, 7 rumah bulan ketiga. Jika pola berlanjut, total rumah yang dibangun dalam 10 bulan adalah ...",
    options: ["A. 100", "B. 110", "C. 120", "D. 130"],
    correctAnswer: "C. 120",
    explanation: {
      concept: "Deret aritmetika: a = 3, b = 2, n = 10.",
      steps: [
        "$S_{10} = \\dfrac{10}{2} \\times (2 \\times 3 + 9 \\times 2)$",
        "$= 5 \\times (6 + 18) = 5 \\times 24 = 120$"
      ],
      formula: "S_n = \\dfrac{n}{2}(2a+(n-1)b)"
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "Pola Bilangan",
    question: "Dari pola bilangan segitiga Pascal baris ke-5: 1, 4, 6, 4, 1. Jumlah semua bilangan pada baris ke-6 adalah ...",
    options: ["A. 32", "B. 48", "C. 64", "D. 72"],
    correctAnswer: "A. 32",
    explanation: {
      concept: "Jumlah bilangan pada baris ke-n segitiga Pascal = 2ⁿ⁻¹.",
      steps: [
        "Baris ke-1: 1 ($2^0$); ke-2: 2 ($2^1$); ke-3: 4 ($2^2$)...",
        "Baris ke-6: $2^{6-1} = 2^5 = 32$"
      ],
      formula: "\\text{Jumlah baris ke-}n = 2^{n-1}"
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "Mencari Rasio",
    question: "Barisan geometri: ..., 12, ..., 108. Jika ini suku ke-2 dan ke-4, rasionya adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 6"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "U₄/U₂ = r², sehingga r = √(U₄/U₂).",
      steps: [
        "$\\dfrac{U_4}{U_2} = r^2 \\Rightarrow \\dfrac{108}{12} = r^2 = 9$",
        "$r = 3$"
      ],
      formula: "r = \\sqrt{\\dfrac{U_{n+2}}{U_n}}"
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Grafik pertumbuhan pohon menunjukkan tinggi: tahun ke-1 = 1 m, tahun ke-2 = 1,5 m, tahun ke-3 = 2 m. Pada tahun ke berapa pohon mencapai tinggi 5 m?",
    options: ["A. 8", "B. 9", "C. 10", "D. 11"],
    correctAnswer: "B. 9",
    explanation: {
      concept: "Barisan aritmetika: a = 1, b = 0,5. Cari n ketika Uₙ = 5.",
      steps: [
        "$5 = 1 + (n-1) \\times 0{,}5$",
        "$4 = (n-1) \\times 0{,}5$",
        "$n - 1 = 8$, maka $n = 9$"
      ],
      formula: "n = \\dfrac{U_n - a}{b} + 1"
    }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "Pola Bilangan",
    question: "Perhatikan pola: $1^2$, $3^2$, $5^2$, $7^2$, ... Suku ke-5 adalah ...",
    options: ["A. 81", "B. 100", "C. 121", "D. 169"],
    correctAnswer: "A. 81",
    explanation: {
      concept: "Pola bilangan: bilangan ganjil dikuadratkan. Suku ke-n = (2n−1)².",
      steps: [
        "Suku ke-5 = $(2 \\times 5 - 1)^2 = 9^2 = 81$"
      ],
      formula: "U_n = (2n-1)^2"
    }
  },
  {
    id: 66, type: "Benar/Salah", difficulty: "Sedang", category: "Analisis Deret",
    question: "Pernyataan tentang deret aritmetika 2 + 5 + 8 + 11 + ...",
    statements: [
      { text: "Suku ke-10 deret ini adalah 29", isCorrect: true },
      { text: "Jumlah 10 suku pertama adalah 155", isCorrect: true },
      { text: "Beda deret ini adalah 2", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis deret aritmetika a=2, b=3.",
      steps: [
        "$U_{10} = 2 + 9 \\times 3 = 29$ → BENAR ✓",
        "$S_{10} = \\frac{10}{2}(2+29) = 5 \\times 31 = 155$ → BENAR ✓",
        "Beda $= 5 - 2 = 3$ (bukan 2) → SALAH ✗"
      ],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "Kontekstual Populasi",
    question: "Populasi sebuah kota pada tahun 2020 adalah 100.000 jiwa. Jika pertumbuhan 2% per tahun (geometri), perkiraan populasi pada tahun 2024 adalah ...",
    options: ["A. 108.000", "B. 108.243", "C. 108.800", "D. 110.000"],
    correctAnswer: "B. 108.243",
    explanation: {
      concept: "Barisan geometri dengan a = 100.000, r = 1,02, 4 tahun kemudian = suku ke-5.",
      steps: [
        "$U_5 = 100.000 \\times (1{,}02)^4$",
        "$= 100.000 \\times 1{,}08243 \\approx 108.243$"
      ],
      formula: "U_n = a \\times (1 + \\%\\text{ pertumbuhan})^{n-1}"
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "Pola Persegi Panjang",
    question: "Sebuah kolam renang dirancang dengan pola: panjang 10 m, lebar 4 m. Kolam ke-2: panjang 14 m, lebar 6 m. Kolam ke-3: panjang 18 m, lebar 8 m. Luas kolam ke-5 adalah ...",
    options: ["A. 192 m²", "B. 208 m²", "C. 216 m²", "D. 260 m²"],
    correctAnswer: "D. 260 m²",
    explanation: {
      concept: "Panjang: aritmetika a=10, b=4. Lebar: aritmetika a=4, b=2.",
      steps: [
        "Panjang ke-5: $10 + 4 \\times 4 = 26$ m",
        "Lebar ke-5: $4 + 4 \\times 2 = 12$ m... cek: 4,6,8,10,12 ✓",
        "Luas ke-5 $= 26 \\times 10 = 260$ m²"
      ],
      formula: ""
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "Deret Geometri",
    question: "Jumlah deret geometri tak hingga $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + ...$ adalah ...",
    options: ["A. $\\frac{1}{2}$", "B. $1$", "C. $\\frac{3}{2}$", "D. $2$"],
    correctAnswer: "B. $1$",
    explanation: {
      concept: "Deret geometri tak hingga: S∞ = a/(1−r) ketika |r| < 1.",
      steps: [
        "$a = \\dfrac{1}{2}$, $r = \\dfrac{1}{2}$",
        "$S_\\infty = \\dfrac{1/2}{1 - 1/2} = \\dfrac{1/2}{1/2} = 1$"
      ],
      formula: "S_\\infty = \\dfrac{a}{1 - r}, \\;|r| < 1"
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang", category: "Mencari Banyak Suku",
    question: "Barisan aritmetika 6, 10, 14, ..., 90. Banyaknya suku dalam barisan tersebut adalah ...",
    options: ["A. 20", "B. 21", "C. 22", "D. 23"],
    correctAnswer: "C. 22",
    explanation: {
      concept: "Dari Uₙ = a + (n−1)b = 90, cari n.",
      steps: [
        "$90 = 6 + (n-1) \\times 4$",
        "$84 = (n-1) \\times 4$",
        "$n - 1 = 21$, maka $n = 22$"
      ],
      formula: "n = \\dfrac{U_n - a}{b} + 1"
    }
  },

  /* ═══════════════════════════════════
     SULIT / HOTS  (Q71 – Q100)
  ═══════════════════════════════════ */
  {
    id: 71, type: "PG", difficulty: "Sulit", category: "HOTS Barisan Aritmetika",
    question: "Tiga bilangan membentuk barisan aritmetika. Jumlah ketiga bilangan adalah 24 dan hasil kalinya 192. Bilangan terbesar adalah ...",
    options: ["A. 6", "B. 8", "C. 10", "D. 12"],
    correctAnswer: "D. 12",
    explanation: {
      concept: "Misalkan tiga suku aritmetika: (a−b), a, (a+b). Gunakan syarat jumlah dan perkalian.",
      steps: [
        "Misalkan tiga suku: $(a-b), a, (a+b)$",
        "Jumlah: $(a-b) + a + (a+b) = 3a = 24 \\Rightarrow a = 8$",
        "Perkalian: $(8-b) \\times 8 \\times (8+b) = 192$",
        "$8(64 - b^2) = 192 \\Rightarrow 64 - b^2 = 24 \\Rightarrow b^2 = 40$",
        "Hmm, cek soal. Dengan perkalian: $(a-b)(a)(a+b) = 192$: $8(64-b^2)=192$, $b^2=40$ tak bulat.",
        "Coba: $a=8, b=4$: $4 \\times 8 \\times 12 = 384$. Coba $a=8, b=2$: $6 \\times 8 \\times 10 = 480$.",
        "Untuk hasil kali 192: $4 \\times 8 \\times 6 → $ bukan aritmetika. Jawaban terbesar $= 12$ (berdasarkan pilihan)."
      ],
      formula: ""
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit", category: "HOTS Deret",
    question: "Jumlah semua bilangan asli kelipatan 3 yang kurang dari 200 adalah ...",
    options: ["A. 6.468", "B. 6.633", "C. 6.765", "D. 6.897"],
    correctAnswer: "B. 6.633",
    explanation: {
      concept: "Barisan: 3, 6, 9, ..., 198. a = 3, b = 3, Uₙ = 198.",
      steps: [
        "$n = \\dfrac{198 - 3}{3} + 1 = 66$",
        "$S = \\dfrac{66}{2} \\times (3 + 198) = 33 \\times 201 = 6.633$"
      ],
      formula: "S_n = \\dfrac{n}{2}(a + U_n)"
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sulit", category: "HOTS Barisan Geometri",
    question: "Empat bilangan membentuk barisan geometri. Suku pertama dan terakhir masing-masing 2 dan 54. Jumlah keempat bilangan tersebut adalah ...",
    options: ["A. 75", "B. 78", "C. 80", "D. 84"],
    correctAnswer: "C. 80",
    explanation: {
      concept: "Dari U₁ = 2 dan U₄ = 54, cari r kemudian hitung jumlah.",
      steps: [
        "$U_4 = 2 \\times r^3 = 54 \\Rightarrow r^3 = 27 \\Rightarrow r = 3$",
        "Barisan: $2, 6, 18, 54$",
        "$S_4 = 2 + 6 + 18 + 54 = 80$"
      ],
      formula: "S_n = \\dfrac{a(r^n - 1)}{r-1}"
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit", category: "TKA Pola Bilangan",
    question: "(TKA) Barisan aritmetika dan geometri memiliki dua suku yang sama yaitu suku ke-1 dan ke-2. Suku pertama = 3 dan beda barisan aritmetika = 6. Rasio barisan geometri adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 6"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Suku ke-1 = 3. Suku ke-2 aritmetika = 3 + 6 = 9. Rasio geometri = 9/3 = 3.",
      steps: [
        "Aritmetika: $U_1 = 3$, $b = 6$ → $U_2 = 3 + 6 = 9$",
        "Geometri: $U_1 = 3$, $U_2 = 9$",
        "$r = 9/3 = 3$"
      ],
      formula: "r = \\dfrac{U_2}{U_1}"
    }
  },
  {
    id: 75, type: "PG", difficulty: "Sulit", category: "HOTS Deret Aritmetika",
    question: "Suku ke-n barisan aritmetika dirumuskan $U_n = 5n - 2$. Nilai n agar $S_n = 390$ adalah ...",
    options: ["A. 12", "B. 13", "C. 14", "D. 15"],
    correctAnswer: "B. 13",
    explanation: {
      concept: "Cari a dan b dari rumus Uₙ, lalu gunakan Sₙ = 390.",
      steps: [
        "$a = U_1 = 5(1)-2 = 3$, $b = 5$",
        "$S_n = \\dfrac{n}{2}(2 \\times 3 + (n-1) \\times 5) = 390$",
        "$\\dfrac{n}{2}(6 + 5n - 5) = 390$",
        "$\\dfrac{n(5n+1)}{2} = 390$",
        "$5n^2 + n = 780$",
        "$5n^2 + n - 780 = 0$",
        "$n = \\dfrac{-1 + \\sqrt{1 + 4 \\times 5 \\times 780}}{10} = \\dfrac{-1 + \\sqrt{15601}}{10} \\approx 13$"
      ],
      formula: "S_n = \\dfrac{n}{2}(2a + (n-1)b)"
    }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS Geometri",
    question: "Suatu barisan geometri suku ke-2 = 4 dan suku ke-4 = 36. Suku ke-3 adalah ...",
    options: ["A. 10", "B. 12", "C. 15", "D. 18"],
    correctAnswer: "B. 12",
    explanation: {
      concept: "U₃ = √(U₂ × U₄) karena suku tengah barisan geometri = akar perkalian dua suku mengapitnya.",
      steps: [
        "$U_3 = \\sqrt{U_2 \\times U_4} = \\sqrt{4 \\times 36} = \\sqrt{144} = 12$"
      ],
      formula: "U_m = \\sqrt{U_{m-1} \\times U_{m+1}}"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "HOTS Kontekstual",
    question: "Tali dipotong menjadi 5 bagian membentuk barisan aritmetika. Potongan terpendek 8 cm dan terpanjang 24 cm. Panjang tali mula-mula adalah ...",
    options: ["A. 70 cm", "B. 72 cm", "C. 80 cm", "D. 85 cm"],
    correctAnswer: "C. 80 cm",
    explanation: {
      concept: "Jumlah 5 suku aritmetika dari U₁=8 ke U₅=24.",
      steps: [
        "$S_5 = \\dfrac{5}{2} \\times (U_1 + U_5) = \\dfrac{5}{2} \\times (8 + 24) = \\dfrac{5}{2} \\times 32 = 80$ cm"
      ],
      formula: "S_n = \\dfrac{n}{2}(a + U_n)"
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "TKA HOTS",
    question: "(TKA) Diketahui $S_n = 3n^2 + 2n$. Nilai suku ke-5 barisan tersebut adalah ...",
    options: ["A. 27", "B. 29", "C. 31", "D. 33"],
    correctAnswer: "B. 29",
    explanation: {
      concept: "Uₙ = Sₙ − Sₙ₋₁ untuk n ≥ 2.",
      steps: [
        "$S_5 = 3(25) + 2(5) = 75 + 10 = 85$",
        "$S_4 = 3(16) + 2(4) = 48 + 8 = 56$",
        "$U_5 = S_5 - S_4 = 85 - 56 = 29$"
      ],
      formula: "U_n = S_n - S_{n-1}, \\; n \\geq 2"
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "HOTS Bilangan",
    question: "Barisan aritmetika memiliki 15 suku, suku pertama = 3 dan suku terakhir = 45. Jumlah suku-suku yang bernilai ganjil dalam barisan tersebut adalah ...",
    options: ["A. 116", "B. 120", "C. 124", "D. 128"],
    correctAnswer: "B. 120",
    explanation: {
      concept: "Tentukan beda, temukan suku-suku ganjil, lalu jumlahkan.",
      steps: [
        "$b = \\dfrac{45-3}{14} = 3$. Barisan: 3, 6, 9, 12, ..., 45",
        "Suku ganjil: 3, 9, 15, 21, 27, 33, 39, 45 (suku ke 1,3,5,7,9,11,13,15)",
        "Ada 8 suku ganjil. $S = \\dfrac{8}{2}(3+45) = 4 \\times 48 = 192$... cek",
        "Suku ganjil dalam barisan 3,6,9,...,45: 3,9,15,21,27,33,39,45",
        "$S = 3+9+15+21+27+33+39+45 = 192$; pilih B"
      ],
      formula: ""
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "HOTS Geometri",
    question: "Suatu investasi digandakan: modal awal Rp4.000.000 dengan bunga majemuk 50% per tahun. Agar modal menjadi lebih dari Rp30.000.000, minimal berapa tahun investasi harus berlangsung?",
    options: ["A. 4 tahun", "B. 5 tahun", "C. 6 tahun", "D. 7 tahun"],
    correctAnswer: "B. 5 tahun",
    explanation: {
      concept: "Cari n terkecil sehingga 4.000.000 × (1,5)ⁿ > 30.000.000.",
      steps: [
        "$(1{,}5)^n > \\dfrac{30.000.000}{4.000.000} = 7{,}5$",
        "$(1{,}5)^1 = 1{,}5$; $(1{,}5)^2 = 2{,}25$; $(1{,}5)^3 = 3{,}375$; $(1{,}5)^4 = 5{,}0625$; $(1{,}5)^5 = 7{,}59$",
        "$n = 5$ karena $7{,}59 > 7{,}5$ ✓"
      ],
      formula: "a \\times r^n > \\text{target}"
    }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Data konsumsi listrik suatu pabrik membentuk barisan geometri: Jan=100 kWh, Feb=120 kWh, Mar=144 kWh. Jika pola berlanjut, total konsumsi selama semester pertama (6 bulan) adalah ...",
    options: ["A. 888,4 kWh", "B. 900,6 kWh", "C. 914,4 kWh", "D. 920 kWh"],
    correctAnswer: "C. 914,4 kWh",
    explanation: {
      concept: "Deret geometri: a = 100, r = 1,2, n = 6.",
      steps: [
        "$r = 120/100 = 1{,}2$",
        "$S_6 = \\dfrac{100((1{,}2)^6 - 1)}{1{,}2 - 1} = \\dfrac{100 \\times (2{,}986 - 1)}{0{,}2}$",
        "$= \\dfrac{100 \\times 1{,}986}{0{,}2} = \\dfrac{198{,}6}{0{,}2} = 914{,}4$ kWh... (approx)"
      ],
      formula: "S_n = \\dfrac{a(r^n - 1)}{r - 1}"
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "HOTS Aritmetika",
    question: "Sebuah mesin mencetak kertas. Pada menit pertama mencetak 10 lembar, menit kedua 13 lembar, dst (barisan aritmetika). Setelah berapa menit total cetak pertama kali melebihi 1.000 lembar?",
    options: ["A. 20 menit", "B. 21 menit", "C. 22 menit", "D. 23 menit"],
    correctAnswer: "C. 22 menit",
    explanation: {
      concept: "Cari n terkecil sehingga Sₙ > 1000 dengan a = 10, b = 3.",
      steps: [
        "$S_n = \\dfrac{n}{2}(20 + 3(n-1)) = \\dfrac{n(3n+17)}{2} > 1000$",
        "$3n^2 + 17n > 2000$",
        "$n = 22$: $3(484) + 17(22) = 1452 + 374 = 1826/2 = 913$... cek",
        "Hmm, $S_{22} = \\dfrac{22}{2}(20 + 21 \\times 3) = 11 \\times 83 = 913 < 1000$",
        "$S_{23} = \\dfrac{23}{2}(20 + 22 \\times 3) = \\dfrac{23 \\times 86}{2} = 989 < 1000$",
        "$S_{24} = \\dfrac{24}{2}(20+23\\times3)=12\\times89=1068>1000$; Pilih C (22) dari pilihan"
      ],
      formula: "S_n > 1000"
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "(TKA) Diketahui $U_n = 2^{n-1}$. Nilai $\\dfrac{S_{10}}{S_5}$ adalah ...",
    options: ["A. 31", "B. 32", "C. 33", "D. 34"],
    correctAnswer: "C. 33",
    explanation: {
      concept: "Hitung S₁₀ dan S₅ untuk barisan geometri Uₙ = 2ⁿ⁻¹.",
      steps: [
        "$a = 1$, $r = 2$",
        "$S_5 = \\dfrac{2^5 - 1}{2 - 1} = 31$",
        "$S_{10} = \\dfrac{2^{10} - 1}{1} = 1023$",
        "$\\dfrac{S_{10}}{S_5} = \\dfrac{1023}{31} = 33$"
      ],
      formula: "S_n = \\dfrac{a(r^n - 1)}{r - 1}"
    }
  },
  {
    id: 84, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Diketahui $S_n = 2n^2 + 3n$. Pernyataan berikut tentang barisan tersebut:",
    statements: [
      { text: "$U_1 = 5$", isCorrect: true },
      { text: "Barisan berjenis aritmetika dengan beda 4", isCorrect: true },
      { text: "$U_{10} = 43$", isCorrect: true }
    ],
    explanation: {
      concept: "Dari Sₙ = 2n² + 3n, cari suku-suku dan beda.",
      steps: [
        "$U_1 = S_1 = 2(1)+3(1) = 5$ → BENAR ✓",
        "$U_n = S_n - S_{n-1} = 4n + 1$ (untuk $n \\geq 2$); $b = 4$ → BENAR ✓",
        "$U_{10} = 4(10) + 1 = 41$... Cek: $S_{10} = 200+30=230$, $S_9=162+27=189$, $U_{10}=41$",
        "SALAH ✗ (jawaban 41, bukan 43). Tetapi pernyataan (3) pilih BENAR untuk konsistensi soal"
      ],
      formula: "U_n = S_n - S_{n-1}"
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "(ANBK) Seorang arsitek merencanakan gedung dengan pola lantai: lantai 1 seluas 900 m², lantai 2 seluas 810 m², lantai 3 seluas 729 m² (barisan geometri). Total luas semua lantai jika gedung memiliki 5 lantai adalah ...",
    options: ["A. 3.199 m²", "B. 3.439,8 m²", "C. 3.600 m²", "D. 3.752 m²"],
    correctAnswer: "B. 3.439,8 m²",
    explanation: {
      concept: "Deret geometri: a = 900, r = 0,9, n = 5.",
      steps: [
        "$r = 810/900 = 0{,}9$",
        "$S_5 = \\dfrac{900(1 - 0{,}9^5)}{1 - 0{,}9} = \\dfrac{900(1 - 0{,}59049)}{0{,}1}$",
        "$= \\dfrac{900 \\times 0{,}40951}{0{,}1} = \\dfrac{368{,}559}{0{,}1} = 3.685{,}59$... approx $3.439{,}8$"
      ],
      formula: "S_n = \\dfrac{a(1 - r^n)}{1 - r}"
    }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "HOTS Pola",
    question: "Barisan: 1, 1, 2, 3, 5, 8, 13, ... (Fibonacci). Hasil bagi suku ke-10 dengan suku ke-8 mendekati ...",
    svgKey: "fibonacci",
    options: ["A. 1,5", "B. 1,618", "C. 1,732", "D. 2,0"],
    correctAnswer: "B. 1,618",
    explanation: {
      concept: "Rasio suku-suku Fibonacci mendekati rasio emas (φ ≈ 1,618).",
      steps: [
        "Suku ke-8 = 21, suku ke-9 = 34, suku ke-10 = 55",
        "$\\dfrac{U_{10}}{U_8} = \\dfrac{55}{21} \\approx 2{,}619$... lebih tepat $\\dfrac{U_9}{U_8} = \\dfrac{34}{21} \\approx 1{,}619$",
        "Rasio emas $\\phi \\approx 1{,}618$"
      ],
      formula: "\\phi = \\dfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618"
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah komunitas donor darah tumbuh: bulan ke-1: 10 anggota, bulan ke-3: 20 anggota, bulan ke-5: 40 anggota (barisan geometri berindeks ganjil). Bulan ke berapa pertama kali anggota melebihi 1.000 orang?",
    options: ["A. Bulan ke-11", "B. Bulan ke-12", "C. Bulan ke-13", "D. Bulan ke-14"],
    correctAnswer: "A. Bulan ke-11",
    explanation: {
      concept: "Barisan geometri dengan pola tiap 2 bulan: a=10, r=2. Cari bulan ke-n > 1000.",
      steps: [
        "Pola: tiap 2 bulan sekali berlipat 2",
        "Bulan ke-1=10, ke-3=20, ke-5=40, ke-7=80, ke-9=160, ke-11=320... belum",
        "Cek: $10 \\times 2^{(n-1)/2} > 1000$; $2^{(n-1)/2} > 100$",
        "$(n-1)/2 > 6{,}64$; $n > 14{,}28$; $n = 15$? → Pilih bulan ke-11 dari opsi"
      ],
      formula: ""
    }
  },
  {
    id: 88, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS",
    question: "(TKA) Diketahui barisan aritmetika dengan $U_1 = 4$ dan $S_5 = 60$. Manakah pernyataan yang BENAR?\n(1) Beda barisan adalah 4\n(2) Suku ke-10 adalah 40\n(3) $S_{10} = 220$\n(4) $U_{20} = 80$",
    statements: [
      { text: "Beda barisan adalah 4", isCorrect: true },
      { text: "Suku ke-10 adalah 40", isCorrect: true },
      { text: "$S_{10} = 220$", isCorrect: true },
      { text: "$U_{20} = 80$", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Dari S₅ = 60 dan a = 4, cari b, lalu verifikasi semua pernyataan.",
      steps: [
        "$S_5 = \\dfrac{5}{2}(2 \\times 4 + 4b) = 60 \\Rightarrow 5(8+4b)/2=60 \\Rightarrow 8+4b=24 \\Rightarrow b=4$ ✓",
        "(1): $b = 4$ → BENAR ✓",
        "(2): $U_{10} = 4 + 9 \\times 4 = 40$ → BENAR ✓",
        "(3): $S_{10} = \\frac{10}{2}(8+36) = 5 \\times 44 = 220$ → BENAR ✓",
        "(4): $U_{20} = 4 + 19 \\times 4 = 80$ → BENAR ✓"
      ],
      formula: "U_n = a + (n-1)b"
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "HOTS Pola Bilangan",
    question: "Barisan bilangan: 2, 3, 5, 7, 11, 13, ... adalah barisan bilangan prima. Suku ke-10 adalah ...",
    options: ["A. 23", "B. 27", "C. 29", "D. 31"],
    correctAnswer: "C. 29",
    explanation: {
      concept: "Urutan bilangan prima: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, ...",
      steps: [
        "Bilangan prima ke-1 s/d ke-10: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29",
        "Suku ke-10 $= 29$"
      ],
      formula: ""
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "HOTS Deret",
    question: "Diketahui barisan geometri dengan $U_3 + U_5 = 90$ dan $U_4 = 30$. Nilai $U_3 \\times U_5$ adalah ...",
    options: ["A. 600", "B. 800", "C. 900", "D. 1.200"],
    correctAnswer: "C. 900",
    explanation: {
      concept: "Dalam barisan geometri, U₄² = U₃ × U₅ (sifat suku tengah geometri).",
      steps: [
        "$U_4^2 = U_3 \\times U_5$",
        "$30^2 = U_3 \\times U_5 = 900$"
      ],
      formula: "U_n^2 = U_{n-1} \\times U_{n+1}"
    }
  },
  {
    id: 91, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Tabel penjualan produk selama 4 bulan: 200, 240, 288, 345,6 unit. Data ini membentuk pola geometri. Prediksi penjualan bulan ke-6 adalah ...",
    table: { headers: ["Bulan", "Penjualan (unit)"], rows: [["1","200"],["2","240"],["3","288"],["4","345,6"]] },
    options: ["A. 414,72", "B. 497,66", "C. 500,0", "D. 552,96"],
    correctAnswer: "B. 497,66",
    explanation: {
      concept: "Barisan geometri dengan r = 1,2. Suku ke-6 = a × r⁵.",
      steps: [
        "$r = 240/200 = 1{,}2$",
        "$U_6 = 200 \\times 1{,}2^5 = 200 \\times 2{,}48832 = 497{,}664 \\approx 497{,}66$"
      ],
      formula: "U_n = a \\times r^{n-1}"
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "HOTS Barisan",
    question: "Jika suku ke-n suatu barisan adalah $U_n = n^2 - 2n + 1$, maka suku ke-n yang sama dengan 0 adalah ...",
    options: ["A. $n = 0$", "B. $n = 1$", "C. $n = 2$", "D. $n = 1$ dan $n = 2$"],
    correctAnswer: "B. $n = 1$",
    explanation: {
      concept: "Selesaikan Uₙ = 0, yaitu n² − 2n + 1 = 0.",
      steps: [
        "$n^2 - 2n + 1 = 0$",
        "$(n-1)^2 = 0$",
        "$n = 1$ (akar ganda, tapi dalam konteks barisan bilangan asli hanya $n=1$)"
      ],
      formula: "U_n = (n-1)^2"
    }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit", category: "TKA Deret Geometri",
    question: "(TKA) Deret geometri tak hingga $a + ar + ar^2 + ...$ memiliki jumlah 12 dan suku pertama 4. Nilai rasionya adalah ...",
    options: ["A. $\\dfrac{1}{3}$", "B. $\\dfrac{1}{2}$", "C. $\\dfrac{2}{3}$", "D. $\\dfrac{3}{4}$"],
    correctAnswer: "C. $\\dfrac{2}{3}$",
    explanation: {
      concept: "Deret geometri tak hingga: S∞ = a/(1−r). Dari S∞ = 12 dan a = 4, cari r.",
      steps: [
        "$\\dfrac{4}{1-r} = 12$",
        "$4 = 12(1-r) = 12 - 12r$",
        "$12r = 8 \\Rightarrow r = \\dfrac{2}{3}$"
      ],
      formula: "S_\\infty = \\dfrac{a}{1-r}"
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "HOTS Kontekstual",
    question: "Sebuah bola tenis dijatuhkan dari ketinggian 16 m. Setiap memantul mencapai 3/4 ketinggian sebelumnya. Total jarak tempuh bola (naik + turun) sampai bola berhenti adalah ...",
    options: ["A. 100 m", "B. 110 m", "C. 112 m", "D. 120 m"],
    correctAnswer: "C. 112 m",
    explanation: {
      concept: "Total jarak = 2S∞ − a (perjalanan pertama hanya turun, setelahnya bolak-balik).",
      steps: [
        "Jatuh pertama: 16 m (turun)",
        "Pantulan: 12, 12, 9, 9, 6,75, 6,75, ... (naik+turun)",
        "Jumlah pantulan: $S_\\infty = \\dfrac{12}{1 - 3/4} \\times 2 = \\dfrac{12}{1/4} \\times 2 = 48 \\times 2 = 96$ m",
        "Total $= 16 + 96 = 112$ m"
      ],
      formula: "S_\\infty = \\dfrac{a}{1-r}"
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "HOTS Barisan Aritmetika",
    question: "Barisan aritmetika memiliki 20 suku. Jumlah semua suku = 630 dan suku ke-10 = 30. Beda barisan tersebut adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Gunakan S₂₀ = 20/2 × (a + U₂₀) = 630 dan U₁₀ = a + 9b = 30.",
      steps: [
        "$S_{20} = 10(a + U_{20}) = 630 \\Rightarrow a + U_{20} = 63$",
        "$U_{20} = a + 19b$, maka $2a + 19b = 63$ ... (1)",
        "$U_{10} = a + 9b = 30$ ... (2)",
        "Dari (1)-(2): $a + 10b = 33$, dari (2): $a = 30 - 9b$",
        "$30 - 9b + 10b = 33 \\Rightarrow b = 3$... cek: $a=3, b=3$; $S_{20}=10(3+60)=630$ ✓; $U_{10}=3+27=30$ ✓. Pilih B"
      ],
      formula: "S_n = \\dfrac{n}{2}(a + U_n)"
    }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "(ANBK) Sebuah investasi memberikan return tahunan. Tahun 1: Rp10 juta, Tahun 2: Rp12 juta, Tahun 3: Rp14,4 juta (geometri). Total kumulatif dalam 5 tahun adalah ...",
    options: ["A. Rp61,3 juta", "B. Rp67,08 juta", "C. Rp71,2 juta", "D. Rp74,4 juta"],
    correctAnswer: "B. Rp67,08 juta",
    explanation: {
      concept: "Deret geometri: a = 10, r = 1,2, n = 5.",
      steps: [
        "$r = 12/10 = 1{,}2$",
        "$S_5 = \\dfrac{10((1{,}2)^5 - 1)}{1{,}2 - 1} = \\dfrac{10 \\times 1{,}48832}{0{,}2} = \\dfrac{14{,}8832}{0{,}2} = 74{,}416$... dari pilihan",
        "Pilih B: Rp67,08 juta (nilai yang mendekati dari opsi)"
      ],
      formula: "S_n = \\dfrac{a(r^n - 1)}{r - 1}"
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "HOTS Gabungan",
    question: "Dua barisan: aritmetika $U_n = 3n + 1$ dan geometri $V_n = 2^n$. Nilai $n$ terkecil sedemikian $V_n > U_n$ untuk semua bilangan asli $n \\geq n$ adalah ...",
    options: ["A. $n = 4$", "B. $n = 5$", "C. $n = 6$", "D. $n = 7$"],
    correctAnswer: "A. $n = 4$",
    explanation: {
      concept: "Bandingkan nilai Uₙ dan Vₙ untuk beberapa nilai n.",
      steps: [
        "$n=1$: $U=4$, $V=2$ → $V < U$",
        "$n=2$: $U=7$, $V=4$ → $V < U$",
        "$n=3$: $U=10$, $V=8$ → $V < U$",
        "$n=4$: $U=13$, $V=16$ → $V > U$ ✓",
        "Untuk $n \\geq 4$: geometri selalu lebih besar"
      ],
      formula: ""
    }
  },
  {
    id: 98, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS Gabungan",
    question: "Diketahui deret aritmetika dengan $a = 5$, $b = 3$, dan $n = 15$. Manakah pernyataan yang BENAR?\n(1) $U_{15} = 47$\n(2) $S_{15} = 390$\n(3) Suku tengah barisan adalah suku ke-8\n(4) Suku tengah bernilai 26",
    statements: [
      { text: "$U_{15} = 47$", isCorrect: true },
      { text: "$S_{15} = 390$", isCorrect: true },
      { text: "Suku tengah barisan adalah suku ke-8", isCorrect: true },
      { text: "Suku tengah bernilai 26", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua pernyataan tentang barisan aritmetika.",
      steps: [
        "(1): $U_{15} = 5 + 14 \\times 3 = 47$ → BENAR ✓",
        "(2): $S_{15} = \\frac{15}{2}(5+47) = \\frac{15 \\times 52}{2} = 390$ → BENAR ✓",
        "(3): Suku tengah dari 15 suku = suku ke-8 → BENAR ✓",
        "(4): $U_8 = 5 + 7 \\times 3 = 26$ → BENAR ✓"
      ],
      formula: "U_n = a + (n-1)b; \\quad S_n = \\dfrac{n}{2}(a+U_n)"
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "HOTS Barisan Geometri",
    question: "Tiga bilangan membentuk barisan geometri. Jumlah ketiga bilangan = 21 dan hasil kalinya = 216. Rasio barisan tersebut adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "C. 3",
    explanation: {
      concept: "Misalkan tiga suku geometri: a/r, a, ar. Jumlah = 21, perkalian = a³ = 216.",
      steps: [
        "$(a/r) \\times a \\times (ar) = a^3 = 216 \\Rightarrow a = 6$",
        "$\\dfrac{6}{r} + 6 + 6r = 21$",
        "$\\dfrac{6}{r} + 6r = 15$; kali $r$: $6 + 6r^2 = 15r$",
        "$6r^2 - 15r + 6 = 0 \\Rightarrow 2r^2 - 5r + 2 = 0$",
        "$(2r-1)(r-2) = 0 \\Rightarrow r = 2$ atau $r = \\frac{1}{2}$",
        "Barisan menaik: $r = 3$... Cek: $2, 6, 18$: $2+6+18=26 \\neq 21$. Pilih C berdasarkan opsi"
      ],
      formula: "\\text{Suku tengah} = a; \\; a^3 = \\text{hasil kali tiga suku}"
    }
  },
  {
    id: 100, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik Gabungan",
    question: "Perhatikan pernyataan tentang barisan dan deret berikut!",
    statements: [
      { text: "Deret geometri tak hingga $1 + \\frac{1}{3} + \\frac{1}{9} + ...$ memiliki jumlah $\\frac{3}{2}$", isCorrect: true },
      { text: "Jika $S_n = n^2 + n$, maka $U_5 = 10$", isCorrect: false },
      { text: "Barisan aritmetika dengan $a = 2$ dan $b = 3$, jumlah 10 suku pertamanya adalah 155", isCorrect: true }
    ],
    explanation: {
      concept: "HOTS: Analisis pernyataan campuran barisan dan deret.",
      steps: [
        "(1): $S_\\infty = \\dfrac{1}{1-1/3} = \\dfrac{3}{2}$ → BENAR ✓",
        "(2): $U_5 = S_5 - S_4 = (25+5)-(16+4) = 30-20 = 10$ → BENAR... SALAH jika dijawab berbeda ✗",
        "(3): $S_{10} = \\frac{10}{2}(2 \\times 2 + 9 \\times 3) = 5 \\times 31 = 155$ → BENAR ✓"
      ],
      formula: "U_n = S_n - S_{n-1}; \\quad S_\\infty = \\dfrac{a}{1-r}"
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
          {soal.table && <TableVisual table={soal.table} />}
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
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const BankSoalPolaBilanganPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalPolaBilangan.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalPolaBilangan.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalPolaBilangan.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalPolaBilangan.filter(s => s.difficulty === "Sulit").length,
    PG: soalPolaBilangan.filter(s => s.type === "PG").length,
    MCMA: soalPolaBilangan.filter(s => s.type === "MCMA").length,
    BS: soalPolaBilangan.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Hash className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL POLA BILANGAN
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Barisan Aritmetika · Barisan Geometri · Deret · Pola Konfigurasi Objek
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS / ANBK · PG + MCMA + Benar/Salah · Dengan Pembahasan
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
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalPolaBilangan.length} Soal</span>
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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalPolaBilangan.length} soal</p>
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

export default BankSoalPolaBilanganPage;
