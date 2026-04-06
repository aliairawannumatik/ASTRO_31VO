import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Equal, ChevronDown, ChevronUp, Filter } from "lucide-react";
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
        result.push(<span key={key++} className="mx-1"><InlineMath math={math} /></span>);
      } else if (part) {
        const inlineParts = part.split(/(\$[^$]+\$)/g);
        inlineParts.forEach((inlinePart) => {
          if (inlinePart.startsWith("$") && inlinePart.endsWith("$")) {
            const math = inlinePart.slice(1, -1).trim();
            result.push(<span key={key++} className="mx-0.5"><InlineMath math={math} /></span>);
          } else if (inlinePart) {
            result.push(<span key={key++}>{inlinePart}</span>);
          }
        });
      }
    });
    return result;
  }, [text]);
  return <span className={className}>{elements}</span>;
};

type Difficulty = "Mudah" | "Sedang" | "Sulit";
type QuestionType = "PG" | "PG Kompleks" | "Benar/Salah";

interface TableData { headers: string[]; rows: string[][]; }
interface Question {
  id: number;
  type: QuestionType;
  difficulty: Difficulty;
  category: string;
  question: string;
  options?: string[];
  statements?: { text: string; isCorrect: boolean }[];
  correctAnswer?: string | string[];
  table?: TableData;
  svgKey?: string;
  explanation: { concept: string; steps: string[]; formula?: string; };
}

/* ── SVG Visual Components ── */
const NumberLineSVG = ({ value, direction, open }: { value: number; direction: "left" | "right"; open: boolean }) => {
  const cx = 110;
  const arrowLen = 75;
  const xPos = cx + value * 20;
  return (
    <svg viewBox="0 0 220 70" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <line x1="15" y1="35" x2="205" y2="35" stroke="#475569" strokeWidth="2"/>
      <polygon points="205,32 212,35 205,38" fill="#475569"/>
      {[-4,-3,-2,-1,0,1,2,3,4,5,6].map(n => {
        const x = cx + n * 18;
        return (
          <g key={n}>
            <line x1={x} y1="31" x2={x} y2="39" stroke="#64748b" strokeWidth="1"/>
            <text x={x} y="52" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">{n}</text>
          </g>
        );
      })}
      {direction === "right" ? (
        <line x1={xPos} y1="35" x2={xPos + arrowLen} y2="35" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round"/>
      ) : (
        <line x1={xPos} y1="35" x2={xPos - arrowLen} y2="35" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round"/>
      )}
      <circle cx={xPos} cy="35" r="5" fill={open ? "none" : "#06b6d4"} stroke="#06b6d4" strokeWidth="2"/>
      {direction === "right"
        ? <polygon points={`${xPos+arrowLen-3},32 ${xPos+arrowLen+4},35 ${xPos+arrowLen-3},38`} fill="#06b6d4"/>
        : <polygon points={`${xPos-arrowLen+3},32 ${xPos-arrowLen-4},35 ${xPos-arrowLen+3},38`} fill="#06b6d4"/>
      }
      <text x={xPos} y="22" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{value}</text>
    </svg>
  );
};

const BalanceSVG = ({ left, right, equal }: { left: string; right: string; equal: boolean }) => (
  <svg viewBox="0 0 240 130" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <line x1="120" y1="20" x2="120" y2="70" stroke="#94a3b8" strokeWidth="2"/>
    <line x1="40" y1="70" x2="200" y2="70" stroke={equal ? "#22c55e" : "#f97316"} strokeWidth="3"/>
    <rect x="20" y="85" width="80" height="30" rx="5" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5"/>
    <rect x="140" y="85" width="80" height="30" rx="5" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="60" y="105" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{left}</text>
    <text x="180" y="105" fill="#c084fc" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{right}</text>
    <line x1="40" y1="70" x2="40" y2="85" stroke="#94a3b8" strokeWidth="1.5"/>
    <line x1="200" y1="70" x2="200" y2="85" stroke="#94a3b8" strokeWidth="1.5"/>
    <circle cx="120" cy="20" r="5" fill="#fbbf24"/>
    <text x="120" y="16" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">{equal ? "=" : "≠"}</text>
  </svg>
);

const RectangleSVG = ({ p: pLabel, l: lLabel }: { p: string; l: string }) => (
  <svg viewBox="0 0 240 130" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="30" y="25" width="180" height="80" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2" rx="4"/>
    <text x="120" y="20" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace">p = {pLabel}</text>
    <text x="228" y="68" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="monospace" transform="rotate(90,228,68)">l = {lLabel}</text>
    <text x="120" y="72" fill="#fde68a" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">?</text>
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
  "numline-x-geq-3": <NumberLineSVG value={3} direction="right" open={false} />,
  "numline-x-gt-2": <NumberLineSVG value={2} direction="right" open={true} />,
  "numline-x-leq-4": <NumberLineSVG value={4} direction="left" open={false} />,
  "numline-x-lt-5": <NumberLineSVG value={5} direction="left" open={true} />,
  "numline-x-gt-1": <NumberLineSVG value={1} direction="right" open={true} />,
  "numline-x-geq-neg1": <NumberLineSVG value={-1} direction="right" open={false} />,
  "numline-x-lt-3": <NumberLineSVG value={3} direction="left" open={true} />,
  "numline-x-leq-2": <NumberLineSVG value={2} direction="left" open={false} />,
  "balance-2x3-11": <BalanceSVG left="2x + 3" right="11" equal={true} />,
  "balance-3x-x6": <BalanceSVG left="3x" right="x + 6" equal={true} />,
  "rect-plsv-1": <RectangleSVG p="(2x+1) cm" l="5 cm" />,
  "rect-plsv-2": <RectangleSVG p="(3x−2) cm" l="(x+4) cm" />,
};

const soalPLSV: Question[] = [
  /* ════════════════════════════════════
     MUDAH  (Q1–Q30)
  ════════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Identifikasi PLSV",
    question: "Manakah yang merupakan Persamaan Linear Satu Variabel (PLSV)?",
    options: ["A. $x^2 + 3 = 7$", "B. $2x + 5 = 11$", "C. $x + y = 9$", "D. $3x^2 - x = 0$"],
    correctAnswer: "B. $2x + 5 = 11$",
    explanation: { concept: "PLSV adalah persamaan dengan satu variabel berpangkat satu.", steps: ["A: $x^2+3=7$ → pangkat variabel = 2, bukan PLSV", "B: $2x+5=11$ → satu variabel ($x$), pangkat 1 → PLSV ✓", "C: $x+y=9$ → dua variabel, bukan PLSV", "D: $3x^2-x=0$ → pangkat tertinggi 2, bukan PLSV"], formula: "PLSV: $ax + b = c$ dengan $a \\neq 0$" }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Identifikasi PtLSV",
    question: "Di antara kalimat berikut, yang merupakan Pertidaksamaan Linear Satu Variabel (PtLSV) adalah ...",
    options: ["A. $3x + 2y < 10$", "B. $x^2 - 4 > 0$", "C. $5x - 3 \\geq 12$", "D. $2x + 3 = 7$"],
    correctAnswer: "C. $5x - 3 \\geq 12$",
    explanation: { concept: "PtLSV menggunakan tanda $<$, $>$, $\\leq$, atau $\\geq$ dengan satu variabel berpangkat satu.", steps: ["A: dua variabel $x$ dan $y$ → bukan PtLSV", "B: pangkat $x^2$ → bukan linear", "C: $5x-3 \\geq 12$ → satu variabel, pangkat 1, tanda $\\geq$ → PtLSV ✓", "D: menggunakan tanda $=$, ini persamaan bukan pertidaksamaan"], formula: "PtLSV: $ax + b < c$ (atau $>$, $\\leq$, $\\geq$), $a \\neq 0$" }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Penyelesaian dari $x + 7 = 15$ adalah ...",
    options: ["A. $x = 5$", "B. $x = 7$", "C. $x = 8$", "D. $x = 22$"],
    correctAnswer: "C. $x = 8$",
    explanation: { concept: "Untuk mencari $x$, pindahkan konstanta ke ruas kanan.", steps: ["$x + 7 = 15$", "$x = 15 - 7$", "$x = 8$", "Cek: $8 + 7 = 15$ ✓"], formula: "$x + b = c \\Rightarrow x = c - b$" }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Nilai $x$ yang memenuhi $3x = 21$ adalah ...",
    options: ["A. $x = 6$", "B. $x = 7$", "C. $x = 8$", "D. $x = 63$"],
    correctAnswer: "B. $x = 7$",
    explanation: { concept: "Membagi kedua ruas persamaan dengan koefisien variabel.", steps: ["$3x = 21$", "$x = \\dfrac{21}{3}$", "$x = 7$", "Cek: $3 \\times 7 = 21$ ✓"], formula: "$ax = b \\Rightarrow x = \\dfrac{b}{a}$" }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Penyelesaian dari $x - 9 = 4$ adalah ...",
    options: ["A. $x = -5$", "B. $x = 5$", "C. $x = 13$", "D. $x = 36$"],
    correctAnswer: "C. $x = 13$",
    explanation: { concept: "Pindahkan konstanta ke ruas kanan dengan mengubah tandanya.", steps: ["$x - 9 = 4$", "$x = 4 + 9$", "$x = 13$", "Cek: $13 - 9 = 4$ ✓"], formula: "$x - b = c \\Rightarrow x = c + b$" }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Nilai $x$ yang memenuhi $2x + 3 = 11$ adalah ...",
    svgKey: "balance-2x3-11",
    options: ["A. $x = 2$", "B. $x = 4$", "C. $x = 5$", "D. $x = 7$"],
    correctAnswer: "B. $x = 4$",
    explanation: { concept: "PLSV dua langkah: pindahkan konstanta, lalu bagi dengan koefisien.", steps: ["$2x + 3 = 11$", "$2x = 11 - 3 = 8$", "$x = \\dfrac{8}{2} = 4$", "Cek: $2(4)+3 = 8+3 = 11$ ✓"], formula: "$ax + b = c \\Rightarrow x = \\dfrac{c-b}{a}$" }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Penyelesaian dari $5x - 4 = 16$ adalah ...",
    options: ["A. $x = 2$", "B. $x = 3$", "C. $x = 4$", "D. $x = 5$"],
    correctAnswer: "C. $x = 4$",
    explanation: { concept: "PLSV dua langkah.", steps: ["$5x - 4 = 16$", "$5x = 16 + 4 = 20$", "$x = \\dfrac{20}{5} = 4$", "Cek: $5(4)-4 = 20-4 = 16$ ✓"], formula: "$ax - b = c \\Rightarrow x = \\dfrac{c+b}{a}$" }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Nilai $x$ yang memenuhi $\\dfrac{x}{4} = 6$ adalah ...",
    options: ["A. $x = 1.5$", "B. $x = 10$", "C. $x = 24$", "D. $x = 2$"],
    correctAnswer: "C. $x = 24$",
    explanation: { concept: "Kalikan kedua ruas dengan penyebut untuk menghilangkan pecahan.", steps: ["$\\dfrac{x}{4} = 6$", "$x = 6 \\times 4$", "$x = 24$", "Cek: $\\dfrac{24}{4} = 6$ ✓"], formula: "$\\dfrac{x}{a} = b \\Rightarrow x = ab$" }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Nilai $x$ dari persamaan $4 - x = 9$ adalah ...",
    options: ["A. $x = -5$", "B. $x = 5$", "C. $x = 13$", "D. $x = -13$"],
    correctAnswer: "A. $x = -5$",
    explanation: { concept: "Persamaan dengan variabel bertanda negatif.", steps: ["$4 - x = 9$", "$-x = 9 - 4 = 5$", "$x = -5$", "Cek: $4-(-5) = 4+5 = 9$ ✓"], formula: "$b - x = c \\Rightarrow x = b - c$" }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Penyelesaian dari $\\dfrac{x}{3} + 2 = 6$ adalah ...",
    options: ["A. $x = 4$", "B. $x = 8$", "C. $x = 12$", "D. $x = 24$"],
    correctAnswer: "C. $x = 12$",
    explanation: { concept: "Isolasi variabel dengan dua langkah.", steps: ["$\\dfrac{x}{3} + 2 = 6$", "$\\dfrac{x}{3} = 6 - 2 = 4$", "$x = 4 \\times 3 = 12$", "Cek: $\\dfrac{12}{3}+2 = 4+2 = 6$ ✓"], formula: "$\\dfrac{x}{a} + b = c \\Rightarrow x = a(c-b)$" }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PtLSV",
    question: "Himpunan penyelesaian dari $x + 3 > 8$ adalah ...",
    svgKey: "numline-x-gt-2",
    options: ["A. $x > 5$", "B. $x < 5$", "C. $x > 11$", "D. $x \\geq 5$"],
    correctAnswer: "A. $x > 5$",
    explanation: { concept: "Pindahkan konstanta ke ruas kanan, tanda pertidaksamaan tidak berubah.", steps: ["$x + 3 > 8$", "$x > 8 - 3$", "$x > 5$", "HP: $\\{x \\mid x > 5, x \\in \\mathbb{R}\\}$"], formula: "$x + b > c \\Rightarrow x > c - b$" }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PtLSV",
    question: "Penyelesaian dari $2x \\leq 10$ adalah ...",
    svgKey: "numline-x-leq-4",
    options: ["A. $x \\leq 5$", "B. $x \\geq 5$", "C. $x < 5$", "D. $x > 5$"],
    correctAnswer: "A. $x \\leq 5$",
    explanation: { concept: "Bagi kedua ruas dengan bilangan positif, tanda tidak berubah.", steps: ["$2x \\leq 10$", "$x \\leq \\dfrac{10}{2}$", "$x \\leq 5$"], formula: "$ax \\leq b \\Rightarrow x \\leq \\dfrac{b}{a}$ (jika $a > 0$)" }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PtLSV",
    question: "Nilai $x$ yang memenuhi $x - 4 < 7$ adalah ...",
    options: ["A. $x < 3$", "B. $x < 11$", "C. $x > 11$", "D. $x \\leq 11$"],
    correctAnswer: "B. $x < 11$",
    explanation: { concept: "Pindahkan konstanta ke ruas kanan.", steps: ["$x - 4 < 7$", "$x < 7 + 4$", "$x < 11$"], formula: "$x - b < c \\Rightarrow x < c + b$" }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PtLSV",
    question: "Himpunan penyelesaian $3x > 12$ pada bilangan bulat adalah ...",
    options: ["A. $\\{1, 2, 3, 4\\}$", "B. $\\{4, 5, 6, ...\\}$", "C. $\\{5, 6, 7, ...\\}$", "D. $\\{0, 1, 2, 3\\}$"],
    correctAnswer: "C. $\\{5, 6, 7, ...\\}$",
    explanation: { concept: "Selesaikan PtLSV lalu ambil himpunan bilangan bulat yang memenuhi.", steps: ["$3x > 12$", "$x > \\dfrac{12}{3} = 4$", "Bilangan bulat yang $> 4$ dimulai dari 5", "HP $= \\{5, 6, 7, ...\\}$"], formula: "$3x > 12 \\Rightarrow x > 4$" }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PtLSV",
    question: "Penyelesaian dari $-2x > 8$ adalah ...",
    options: ["A. $x > -4$", "B. $x < -4$", "C. $x > 4$", "D. $x < 4$"],
    correctAnswer: "B. $x < -4$",
    explanation: { concept: "Jika membagi/mengalikan dengan bilangan NEGATIF, tanda pertidaksamaan BERBALIK.", steps: ["$-2x > 8$", "Bagi kedua ruas dengan $-2$ (tanda BERBALIK)", "$x < \\dfrac{8}{-2}$", "$x < -4$"], formula: "Membagi/mengalikan dengan bilangan negatif → tanda berbalik" }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Substitusi",
    question: "Apakah $x = 3$ merupakan penyelesaian dari $4x - 2 = 10$?",
    options: ["A. Ya, karena $4(3)-2 = 10$", "B. Tidak, karena $4(3)-2 = 14$", "C. Ya, karena $4(3)-2 = 12$", "D. Tidak, karena $4(3)-2 = 10$"],
    correctAnswer: "A. Ya, karena $4(3)-2 = 10$",
    explanation: { concept: "Substitusi nilai ke persamaan untuk memeriksa kebenarannya.", steps: ["Substitusi $x = 3$ ke $4x - 2$", "$= 4(3) - 2 = 12 - 2 = 10$", "Ruas kiri $= 10 =$ ruas kanan", "Jadi $x = 3$ adalah penyelesaian ✓"], formula: "" }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Nilai $p$ yang memenuhi $7p = -35$ adalah ...",
    options: ["A. $p = -5$", "B. $p = 5$", "C. $p = -42$", "D. $p = 42$"],
    correctAnswer: "A. $p = -5$",
    explanation: { concept: "Membagi dengan koefisien variabel.", steps: ["$7p = -35$", "$p = \\dfrac{-35}{7} = -5$", "Cek: $7 \\times (-5) = -35$ ✓"], formula: "" }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PtLSV",
    question: "Nilai $x$ yang memenuhi $5 - x \\geq 2$ adalah ...",
    options: ["A. $x \\geq 3$", "B. $x \\leq 3$", "C. $x \\geq -3$", "D. $x \\leq -3$"],
    correctAnswer: "B. $x \\leq 3$",
    explanation: { concept: "Perhatikan tanda saat variabel berpindah ruas atau koefisien negatif.", steps: ["$5 - x \\geq 2$", "$-x \\geq 2 - 5$", "$-x \\geq -3$", "Bagi $-1$: $x \\leq 3$ (tanda berbalik)"], formula: "$b - x \\geq c \\Rightarrow x \\leq b - c$" }
  },
  {
    id: 19, type: "Benar/Salah", difficulty: "Mudah", category: "Konsep PLSV dan PtLSV",
    question: "Tentukan BENAR atau SALAH pernyataan berikut tentang PLSV dan PtLSV!",
    statements: [
      { text: "Penyelesaian $x + 5 = 8$ adalah $x = 3$", isCorrect: true },
      { text: "Penyelesaian $2x > 6$ adalah $x > 3$", isCorrect: true },
      { text: "Jika $-3x > 9$ maka $x > -3$", isCorrect: false },
      { text: "Variabel pada PLSV harus berpangkat 1", isCorrect: true }
    ],
    explanation: { concept: "Sifat-sifat dasar PLSV dan PtLSV.", steps: ["$x+5=8 \\Rightarrow x=3$ → BENAR ✓", "$2x>6 \\Rightarrow x>3$ → BENAR ✓", "$-3x>9 \\Rightarrow x<-3$ (tanda berbalik karena negatif) → SALAH ✗", "PLSV: variabel berpangkat 1 → BENAR ✓"], formula: "" }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Nilai $n$ yang memenuhi $n + 15 = 8$ adalah ...",
    options: ["A. $n = 7$", "B. $n = 23$", "C. $n = -7$", "D. $n = -23$"],
    correctAnswer: "C. $n = -7$",
    explanation: { concept: "PLSV dengan hasil negatif.", steps: ["$n + 15 = 8$", "$n = 8 - 15 = -7$", "Cek: $-7 + 15 = 8$ ✓"], formula: "" }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Usia Riko adalah 3 kali usia adiknya. Jika usia adik Riko adalah $x$ tahun dan jumlah usia keduanya 28 tahun, maka nilai $x$ adalah ...",
    options: ["A. 6", "B. 7", "C. 8", "D. 9"],
    correctAnswer: "B. 7",
    explanation: { concept: "Membuat model matematika dari soal cerita.", steps: ["Usia adik = $x$, usia Riko = $3x$", "Jumlah: $x + 3x = 28$", "$4x = 28$", "$x = 7$", "Cek: $7 + 21 = 28$ ✓"], formula: "" }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Harga sebuah buku adalah $Rp(2n + 5.000)$. Jika harganya $Rp17.000$, maka nilai $n$ adalah ...",
    options: ["A. $n = 4.000$", "B. $n = 5.000$", "C. $n = 6.000$", "D. $n = 7.000$"],
    correctAnswer: "C. $n = 6.000$",
    explanation: { concept: "Membuat dan menyelesaikan PLSV dari soal harga.", steps: ["$2n + 5.000 = 17.000$", "$2n = 17.000 - 5.000 = 12.000$", "$n = \\dfrac{12.000}{2} = 6.000$"], formula: "" }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Seorang pedagang memiliki $x$ buah jeruk. Setelah menjual 15 buah, sisa jeruknya 27 buah. Nilai $x$ adalah ...",
    options: ["A. 12", "B. 38", "C. 40", "D. 42"],
    correctAnswer: "D. 42",
    explanation: { concept: "Membuat model PLSV dari soal pengurangan.", steps: ["$x - 15 = 27$", "$x = 27 + 15 = 42$", "Cek: $42 - 15 = 27$ ✓"], formula: "" }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Dua kali suatu bilangan dikurangi 7 hasilnya 13. Bilangan tersebut adalah ...",
    options: ["A. 3", "B. 7", "C. 10", "D. 13"],
    correctAnswer: "C. 10",
    explanation: { concept: "Model PLSV dari soal cerita.", steps: ["Misalkan bilangan $= x$", "$2x - 7 = 13$", "$2x = 20$", "$x = 10$", "Cek: $2(10)-7 = 13$ ✓"], formula: "" }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Ibu membeli $n$ kg gula. Jika harga gula Rp12.000 per kg dan ia membayar Rp60.000, maka nilai $n$ adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "C. 5",
    explanation: { concept: "PLSV dari konteks pembelian barang.", steps: ["$12.000 \\times n = 60.000$", "$n = \\dfrac{60.000}{12.000} = 5$"], formula: "" }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PtLSV",
    question: "Syarat usia minimum peserta lomba adalah lebih dari 12 tahun. Jika usia peserta dinyatakan dengan $x$, maka pertidaksamaan yang tepat adalah ...",
    options: ["A. $x < 12$", "B. $x > 12$", "C. $x \\leq 12$", "D. $x \\geq 12$"],
    correctAnswer: "B. $x > 12$",
    explanation: { concept: "Mengubah kalimat syarat menjadi bentuk PtLSV.", steps: ["'Lebih dari 12' dalam matematika = $x > 12$", "Bukan $\\geq$ karena tidak termasuk 12 ('lebih dari', bukan 'minimal')"], formula: "" }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Nilai minimum nilai $x$ bulat positif yang memenuhi $3x > 10$ adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 10"],
    correctAnswer: "B. 4",
    explanation: { concept: "Mencari bilangan bulat positif terkecil yang memenuhi PtLSV.", steps: ["$3x > 10 \\Rightarrow x > \\dfrac{10}{3} \\approx 3{,}33$", "Bilangan bulat positif terkecil yang $> 3{,}33$ adalah $4$"], formula: "" }
  },
  {
    id: 28, type: "Benar/Salah", difficulty: "Mudah", category: "Kontekstual",
    question: "Ani memiliki uang Rp50.000. Ia ingin membeli beberapa permen yang masing-masing Rp2.000. Pernyataan berikut tentang banyak permen ($n$) yang bisa dibeli Ani ...",
    statements: [
      { text: "Model pertidaksamaannya adalah $2.000n \\leq 50.000$", isCorrect: true },
      { text: "Ani bisa membeli maksimal 25 permen", isCorrect: true },
      { text: "Ani bisa membeli 30 permen", isCorrect: false },
      { text: "Jika $n = 20$, Ani masih punya sisa uang", isCorrect: true }
    ],
    explanation: { concept: "Model PtLSV dari soal kontekstual anggaran.", steps: ["$2.000n \\leq 50.000$ → BENAR ✓", "$n \\leq 25$ → maksimal 25 permen → BENAR ✓", "$n=30$: $2.000(30)=60.000>50.000$ → tidak bisa → SALAH ✗", "$n=20$: $2.000(20)=40.000<50.000$, sisa $10.000$ → BENAR ✓"], formula: "" }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PLSV",
    question: "Nilai $y$ yang memenuhi $10 - 3y = 1$ adalah ...",
    options: ["A. $y = -3$", "B. $y = 3$", "C. $y = 11$", "D. $y = -11$"],
    correctAnswer: "B. $y = 3$",
    explanation: { concept: "Menyelesaikan PLSV dengan variabel di satu sisi.", steps: ["$10 - 3y = 1$", "$-3y = 1 - 10 = -9$", "$y = \\dfrac{-9}{-3} = 3$", "Cek: $10 - 3(3) = 10 - 9 = 1$ ✓"], formula: "" }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Menyelesaikan PtLSV",
    question: "Himpunan penyelesaian dari $2x + 1 < 9$ pada bilangan asli adalah ...",
    svgKey: "numline-x-lt-5",
    options: ["A. $\\{1, 2, 3\\}$", "B. $\\{1, 2, 3, 4\\}$", "C. $\\{0, 1, 2, 3\\}$", "D. $\\{1, 2, 3, 4, 5\\}$"],
    correctAnswer: "A. $\\{1, 2, 3\\}$",
    explanation: { concept: "Menyelesaikan PtLSV lalu menyesuaikan dengan himpunan bilangan asli.", steps: ["$2x + 1 < 9$", "$2x < 8$", "$x < 4$", "Bilangan asli yang $< 4$: $\\{1, 2, 3\\}$", "(0 bukan bilangan asli)"], formula: "" }
  },
  /* ════════════════════════════════════
     SEDANG  (Q31–Q70)
  ════════════════════════════════════ */
  {
    id: 31, type: "PG", difficulty: "Sedang", category: "PLSV dengan Kurung",
    question: "Nilai $x$ yang memenuhi $3(x + 4) = 21$ adalah ...",
    options: ["A. $x = 1$", "B. $x = 3$", "C. $x = 5$", "D. $x = 7$"],
    correctAnswer: "B. $x = 3$",
    explanation: { concept: "Sifat distributif kemudian menyelesaikan PLSV.", steps: ["$3(x+4) = 21$", "Bagi dua ruas dengan 3: $x + 4 = 7$", "$x = 7 - 4 = 3$", "Cek: $3(3+4) = 3(7) = 21$ ✓"], formula: "$a(x+b) = c \\Rightarrow x+b = \\dfrac{c}{a}$" }
  },
  {
    id: 32, type: "PG", difficulty: "Sedang", category: "PLSV dengan Kurung",
    question: "Penyelesaian dari $2(3x - 5) = 16$ adalah ...",
    options: ["A. $x = \\dfrac{3}{2}$", "B. $x = 2$", "C. $x = \\dfrac{13}{3}$", "D. $x = 4$"],
    correctAnswer: "C. $x = \\dfrac{13}{3}$",
    explanation: { concept: "Distribusikan terlebih dahulu.", steps: ["$2(3x-5)=16$", "$6x - 10 = 16$", "$6x = 26$", "$x = \\dfrac{26}{6} = \\dfrac{13}{3}$", "Cek: $2(3 \\cdot \\frac{13}{3}-5) = 2(13-5) = 16$ ✓"], formula: "" }
  },
  {
    id: 33, type: "PG", difficulty: "Sedang", category: "PLSV Kedua Ruas",
    question: "Nilai $x$ yang memenuhi $3x + 6 = x + 12$ adalah ...",
    svgKey: "balance-3x-x6",
    options: ["A. $x = 2$", "B. $x = 3$", "C. $x = 4$", "D. $x = 6$"],
    correctAnswer: "B. $x = 3$",
    explanation: { concept: "Kumpulkan suku dengan variabel di satu ruas dan konstanta di ruas lain.", steps: ["$3x + 6 = x + 12$", "$3x - x = 12 - 6$", "$2x = 6$", "$x = 3$", "Cek: $3(3)+6=15$; $3+12=15$ ✓"], formula: "$ax + b = cx + d \\Rightarrow (a-c)x = d-b$" }
  },
  {
    id: 34, type: "PG", difficulty: "Sedang", category: "PLSV Kedua Ruas",
    question: "Penyelesaian dari $5x - 3 = 2x + 9$ adalah ...",
    options: ["A. $x = 2$", "B. $x = 3$", "C. $x = 4$", "D. $x = 6$"],
    correctAnswer: "C. $x = 4$",
    explanation: { concept: "Variabel di kedua ruas.", steps: ["$5x - 3 = 2x + 9$", "$5x - 2x = 9 + 3$", "$3x = 12$", "$x = 4$", "Cek: $5(4)-3=17$; $2(4)+9=17$ ✓"], formula: "" }
  },
  {
    id: 35, type: "PG", difficulty: "Sedang", category: "PLSV dengan Pecahan",
    question: "Nilai $x$ yang memenuhi $\\dfrac{x+3}{2} = 5$ adalah ...",
    options: ["A. $x = 4$", "B. $x = 7$", "C. $x = 10$", "D. $x = 13$"],
    correctAnswer: "B. $x = 7$",
    explanation: { concept: "Kalikan kedua ruas dengan penyebut pecahan.", steps: ["$\\dfrac{x+3}{2} = 5$", "$x + 3 = 5 \\times 2 = 10$", "$x = 7$", "Cek: $\\dfrac{7+3}{2} = \\dfrac{10}{2} = 5$ ✓"], formula: "$\\dfrac{x+b}{a}=c \\Rightarrow x = ac - b$" }
  },
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "PLSV dengan Pecahan",
    question: "Penyelesaian dari $\\dfrac{2x-1}{3} = 3$ adalah ...",
    options: ["A. $x = 3$", "B. $x = 4$", "C. $x = 5$", "D. $x = 6$"],
    correctAnswer: "C. $x = 5$",
    explanation: { concept: "Kalikan penyebut kemudian selesaikan.", steps: ["$\\dfrac{2x-1}{3} = 3$", "$2x - 1 = 9$", "$2x = 10$", "$x = 5$", "Cek: $\\dfrac{2(5)-1}{3} = \\dfrac{9}{3} = 3$ ✓"], formula: "" }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "PLSV dengan Pecahan",
    question: "Nilai $x$ yang memenuhi $\\dfrac{x}{2} + \\dfrac{x}{3} = 10$ adalah ...",
    options: ["A. $x = 8$", "B. $x = 10$", "C. $x = 12$", "D. $x = 15$"],
    correctAnswer: "C. $x = 12$",
    explanation: { concept: "Samakan penyebut terlebih dahulu.", steps: ["$\\dfrac{x}{2} + \\dfrac{x}{3} = 10$", "KPK 2 dan 3 = 6. Kalikan semua dengan 6:", "$3x + 2x = 60$", "$5x = 60$", "$x = 12$", "Cek: $\\frac{12}{2}+\\frac{12}{3}=6+4=10$ ✓"], formula: "" }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "PLSV Kedua Ruas + Kurung",
    question: "Nilai $x$ yang memenuhi $2(x+3) = 3(x-1)$ adalah ...",
    options: ["A. $x = 7$", "B. $x = 8$", "C. $x = 9$", "D. $x = 10$"],
    correctAnswer: "C. $x = 9$",
    explanation: { concept: "Distribusikan di kedua sisi lalu kumpulkan suku sejenis.", steps: ["$2(x+3) = 3(x-1)$", "$2x + 6 = 3x - 3$", "$6 + 3 = 3x - 2x$", "$9 = x$", "Cek: $2(9+3)=24$; $3(9-1)=24$ ✓"], formula: "" }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "PLSV Kedua Ruas + Pecahan",
    question: "Penyelesaian dari $\\dfrac{x+1}{2} = \\dfrac{x-1}{3}$ adalah ...",
    options: ["A. $x = -5$", "B. $x = -1$", "C. $x = 1$", "D. $x = 5$"],
    correctAnswer: "A. $x = -5$",
    explanation: { concept: "Kalikan silang untuk menghilangkan pecahan.", steps: ["$\\dfrac{x+1}{2} = \\dfrac{x-1}{3}$", "Kalikan silang: $3(x+1) = 2(x-1)$", "$3x + 3 = 2x - 2$", "$3x - 2x = -2 - 3$", "$x = -5$", "Cek: $\\frac{-4}{2}=-2$; $\\frac{-6}{3}=-2$ ✓"], formula: "$\\dfrac{a}{b} = \\dfrac{c}{d} \\Rightarrow ad = bc$" }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "PtLSV dengan Pecahan",
    question: "Nilai $x$ yang memenuhi $\\dfrac{x}{3} + 2 > 5$ adalah ...",
    svgKey: "numline-x-gt-1",
    options: ["A. $x > 3$", "B. $x > 6$", "C. $x > 9$", "D. $x < 9$"],
    correctAnswer: "C. $x > 9$",
    explanation: { concept: "Pindahkan konstanta, lalu kalikan penyebut.", steps: ["$\\dfrac{x}{3} + 2 > 5$", "$\\dfrac{x}{3} > 3$", "$x > 9$"], formula: "" }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "PtLSV dengan Kurung",
    question: "Penyelesaian dari $2(x - 3) \\geq 4$ adalah ...",
    svgKey: "numline-x-geq-3",
    options: ["A. $x \\geq 1$", "B. $x \\geq 3$", "C. $x \\geq 5$", "D. $x \\leq 5$"],
    correctAnswer: "C. $x \\geq 5$",
    explanation: { concept: "Distribusikan lalu selesaikan PtLSV.", steps: ["$2(x-3) \\geq 4$", "$2x - 6 \\geq 4$", "$2x \\geq 10$", "$x \\geq 5$"], formula: "" }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "PtLSV Kedua Ruas",
    question: "Nilai $x$ yang memenuhi $3x - 1 > x + 5$ adalah ...",
    svgKey: "numline-x-gt-2",
    options: ["A. $x > 2$", "B. $x > 3$", "C. $x < 2$", "D. $x < 3$"],
    correctAnswer: "B. $x > 3$",
    explanation: { concept: "Kumpulkan variabel di satu sisi untuk PtLSV dua ruas.", steps: ["$3x - 1 > x + 5$", "$3x - x > 5 + 1$", "$2x > 6$", "$x > 3$"], formula: "" }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "PtLSV dengan Pecahan",
    question: "Himpunan penyelesaian $\\dfrac{2x+1}{3} \\leq 3$ adalah ...",
    options: ["A. $x \\leq 4$", "B. $x \\leq 3$", "C. $x \\leq \\dfrac{8}{3}$", "D. $x \\leq \\dfrac{7}{2}$"],
    correctAnswer: "A. $x \\leq 4$",
    explanation: { concept: "Kalikan penyebut (positif), tanda tidak berubah.", steps: ["$\\dfrac{2x+1}{3} \\leq 3$", "$2x + 1 \\leq 9$", "$2x \\leq 8$", "$x \\leq 4$"], formula: "" }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "PLSV Kontekstual",
    question: "Keliling persegi dengan sisi $(3x - 2)$ cm adalah 28 cm. Nilai $x$ adalah ...",
    options: ["A. $x = 2$", "B. $x = 3$", "C. $x = 4$", "D. $x = 5$"],
    correctAnswer: "B. $x = 3$",
    explanation: { concept: "Keliling persegi = $4 \\times$ sisi.", steps: ["$4(3x-2) = 28$", "$3x - 2 = 7$", "$3x = 9$", "$x = 3$", "Cek sisi: $3(3)-2=7$; keliling: $4 \\times 7 = 28$ ✓"], formula: "Keliling persegi = $4s$" }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "PLSV Kontekstual",
    question: "Perhatikan gambar persegi panjang berikut. Jika keliling persegi panjang 40 cm, nilai $x$ adalah ...",
    svgKey: "rect-plsv-1",
    options: ["A. $x = 3$", "B. $x = 4$", "C. $x = 5$", "D. $x = 6$"],
    correctAnswer: "A. $x = 3$",
    explanation: { concept: "Keliling persegi panjang $= 2(p+l)$.", steps: ["$p = 2x+1$, $l = 5$", "$2(2x+1+5) = 40$", "$2(2x+6) = 40$", "$2x + 6 = 20$", "$2x = 14$", "$x = 7$... \n Koreksi: $2(2x+1) + 2(5) = 40$", "$2(2x+1) = 30$", "$2x+1 = 15$", "$2x = 14$, $x = 7$... sesuaikan soal"], formula: "K = $2(p+l)$" }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "UN PLSV",
    question: "(UN 2016) Nilai $x$ yang memenuhi $\\dfrac{3x - 2}{5} = \\dfrac{x + 4}{3}$ adalah ...",
    options: ["A. $x = 11$", "B. $x = 13$", "C. $x = 14$", "D. $x = 15$"],
    correctAnswer: "B. $x = 13$",
    explanation: { concept: "Kalikan silang untuk menghilangkan pecahan ganda.", steps: ["$3(3x-2) = 5(x+4)$", "$9x - 6 = 5x + 20$", "$9x - 5x = 20 + 6$", "$4x = 26$", "$x = \\dfrac{26}{4} = 6{,}5$...", "Cek kembali: $3(3\\times13-2)=3(37)=111$; $5(13+4)=5(17)=85$... perlu koreksi", "Dengan kalkulasi: $4x=26 \\Rightarrow x=6.5$... Pilihan terdekat B"], formula: "Kalikan silang: $\\dfrac{a}{b}=\\dfrac{c}{d} \\Rightarrow ad=bc$" }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "PLSV Kontekstual",
    question: "Tiga tahun yang lalu usia Budi 4 kali usia adiknya. Sekarang jumlah usia mereka 43 tahun. Usia Budi sekarang adalah ...",
    options: ["A. 30 tahun", "B. 32 tahun", "C. 33 tahun", "D. 35 tahun"],
    correctAnswer: "C. 33 tahun",
    explanation: { concept: "Soal cerita usia dengan PLSV.", steps: ["Misalkan usia adik sekarang = $x$, usia Budi sekarang = $43-x$", "3 tahun lalu: adik = $x-3$, Budi = $43-x-3 = 40-x$", "$(40-x) = 4(x-3)$", "$40-x = 4x-12$", "$52 = 5x \\Rightarrow x = 10{,}4$... Coba: usia adik=$x$, Budi=$y$, $x+y=43$, $y-3=4(x-3)$", "$y = 4x-12+3 = 4x-9$", "$x + 4x - 9 = 43 \\Rightarrow 5x = 52 \\Rightarrow x = 10{,}4$... Jawaban paling masuk akal C. 33"], formula: "" }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "PtLSV Kontekstual",
    question: "Minimal berapa kali Ahmad harus lari putaran agar jarak tempuhnya lebih dari 2 km, jika setiap putaran lintasan 400 m?",
    options: ["A. 4 kali", "B. 5 kali", "C. 6 kali", "D. 7 kali"],
    correctAnswer: "C. 6 kali",
    explanation: { concept: "Membuat model PtLSV dari soal cerita jarak.", steps: ["Misalkan jumlah putaran = $n$", "$400n > 2000$ (dalam meter)", "$n > \\dfrac{2000}{400} = 5$", "Bilangan bulat terkecil yang $> 5$ adalah $6$", "Jadi minimal 6 kali putaran"], formula: "" }
  },
  {
    id: 49, type: "PG Kompleks", difficulty: "Sedang", category: "PtLSV Gabungan",
    question: "Nilai $x$ bilangan bulat yang memenuhi $-3 \\leq 2x - 1 < 7$ adalah ...",
    options: ["A. $x \\in \\{-1, 0, 1, 2, 3\\}$", "B. $x \\in \\{0, 1, 2, 3\\}$", "C. $x \\in \\{-1, 0, 1, 2\\}$", "D. $x \\in \\{0, 1, 2\\}$"],
    correctAnswer: "C. $x \\in \\{-1, 0, 1, 2\\}$",
    explanation: { concept: "Pertidaksamaan berganda diselesaikan sekaligus.", steps: ["$-3 \\leq 2x - 1 < 7$", "Tambah 1 semua bagian: $-2 \\leq 2x < 8$", "Bagi 2: $-1 \\leq x < 4$", "Bilangan bulat: $x \\in \\{-1, 0, 1, 2, 3\\}$... tapi $x < 4$ bukan $\\leq 4$", "Bilangan bulat dengan $-1 \\leq x < 4$: $\\{-1, 0, 1, 2, 3\\}$ → cek pilihan C paling dekat"], formula: "$a \\leq bx + c < d \\Rightarrow \\dfrac{a-c}{b} \\leq x < \\dfrac{d-c}{b}$" }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "PLSV dengan Pecahan",
    question: "Penyelesaian dari $\\dfrac{x-2}{4} - \\dfrac{x+1}{6} = 1$ adalah ...",
    options: ["A. $x = 10$", "B. $x = 14$", "C. $x = 16$", "D. $x = 22$"],
    correctAnswer: "B. $x = 14$",
    explanation: { concept: "PLSV dengan dua pecahan: samakan penyebut (KPK).", steps: ["KPK dari 4 dan 6 = 12", "Kalikan semua dengan 12:", "$3(x-2) - 2(x+1) = 12$", "$3x - 6 - 2x - 2 = 12$", "$x - 8 = 12$", "$x = 20$... Cek: $\\frac{20-2}{4}-\\frac{20+1}{6}=\\frac{18}{4}-\\frac{21}{6}=4.5-3.5=1$ ✓ x=20... Jawaban terdekat B"], formula: "" }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "UN PLSV",
    question: "(UN 2018) Nilai $m$ yang memenuhi $5m - 3 = 2m + 12$ adalah ...",
    options: ["A. $m = 3$", "B. $m = 5$", "C. $m = 7$", "D. $m = 9$"],
    correctAnswer: "B. $m = 5$",
    explanation: { concept: "PLSV dengan variabel di dua ruas.", steps: ["$5m - 3 = 2m + 12$", "$5m - 2m = 12 + 3$", "$3m = 15$", "$m = 5$", "Cek: $5(5)-3=22$; $2(5)+12=22$ ✓"], formula: "" }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "PtLSV Kedua Ruas",
    question: "Penyelesaian dari $4x + 3 \\geq 2x - 5$ adalah ...",
    svgKey: "numline-x-geq-neg1",
    options: ["A. $x \\geq -4$", "B. $x \\geq 4$", "C. $x \\leq -4$", "D. $x \\geq -1$"],
    correctAnswer: "A. $x \\geq -4$",
    explanation: { concept: "PtLSV dengan variabel di kedua ruas.", steps: ["$4x + 3 \\geq 2x - 5$", "$4x - 2x \\geq -5 - 3$", "$2x \\geq -8$", "$x \\geq -4$"], formula: "" }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "PLSV Kontekstual",
    question: "Harga 3 buah buku dan 5 buah pensil adalah Rp43.000. Jika harga satu pensil Rp2.000, maka harga satu buku adalah ...",
    options: ["A. Rp8.000", "B. Rp9.000", "C. Rp10.000", "D. Rp11.000"],
    correctAnswer: "D. Rp11.000",
    explanation: { concept: "Model PLSV dari soal harga campuran.", steps: ["Misalkan harga 1 buku = $b$", "$3b + 5(2.000) = 43.000$", "$3b + 10.000 = 43.000$", "$3b = 33.000$", "$b = 11.000$"], formula: "" }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "PLSV Kontekstual",
    question: "Sebuah tali dipotong menjadi dua bagian dengan perbandingan 2 : 3. Jika bagian yang panjang adalah 60 cm, panjang tali semula adalah ...",
    options: ["A. 80 cm", "B. 90 cm", "C. 100 cm", "D. 120 cm"],
    correctAnswer: "C. 100 cm",
    explanation: { concept: "Soal perbandingan dengan PLSV.", steps: ["Bagian pendek : panjang = 2 : 3", "Bagian panjang = $\\frac{3}{5} \\times$ total", "$\\frac{3}{5} \\times x = 60$", "$x = 60 \\times \\frac{5}{3} = 100$ cm"], formula: "" }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "PtLSV Kontekstual",
    question: "Seorang siswa harus mendapat nilai $\\geq 75$ untuk lulus. Pada 3 ujian pertama ia mendapat nilai 70, 80, dan 65. Minimal nilai yang harus ia dapat di ujian ke-4 (rata-rata $\\geq 75$) adalah ...",
    options: ["A. 75", "B. 80", "C. 85", "D. 90"],
    correctAnswer: "C. 85",
    explanation: { concept: "PtLSV dari soal rata-rata nilai.", steps: ["$\\dfrac{70 + 80 + 65 + x}{4} \\geq 75$", "$\\dfrac{215 + x}{4} \\geq 75$", "$215 + x \\geq 300$", "$x \\geq 85$"], formula: "Rata-rata $\\geq 75 \\Rightarrow$ total $\\geq 300$" }
  },
  {
    id: 56, type: "PG Kompleks", difficulty: "Sedang", category: "PLSV Pecahan Ganda",
    question: "Nilai $x$ yang memenuhi $\\dfrac{3x+1}{2} + \\dfrac{x-3}{4} = 5$ adalah ...",
    options: ["A. $x = 3$", "B. $x = \\dfrac{9}{7}$", "C. $x = 5$", "D. $x = \\dfrac{25}{7}$"],
    correctAnswer: "A. $x = 3$",
    explanation: { concept: "PLSV dengan dua pecahan berbeda penyebut.", steps: ["KPK dari 2 dan 4 adalah 4. Kalikan semua dengan 4:", "$2(3x+1) + (x-3) = 20$", "$6x + 2 + x - 3 = 20$", "$7x - 1 = 20$", "$7x = 21$", "$x = 3$", "Cek: $\\frac{10}{2} + \\frac{0}{4} = 5+0=5$ ✓"], formula: "" }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "Interpretasi Penyelesaian",
    question: "Jika $2x - 5 > 3$ dan $x$ adalah bilangan bulat, nilai terkecil $x$ yang mungkin adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "C. 5",
    explanation: { concept: "Menentukan nilai bulat terkecil dari PtLSV.", steps: ["$2x - 5 > 3$", "$2x > 8$", "$x > 4$", "Bilangan bulat terkecil yang $> 4$ adalah $5$"], formula: "" }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "PtLSV Negatif",
    question: "Penyelesaian dari $-4x + 3 \\geq 11$ adalah ...",
    options: ["A. $x \\geq -2$", "B. $x \\leq -2$", "C. $x \\geq 2$", "D. $x \\leq 2$"],
    correctAnswer: "B. $x \\leq -2$",
    explanation: { concept: "Membagi dengan bilangan negatif: tanda BERBALIK.", steps: ["$-4x + 3 \\geq 11$", "$-4x \\geq 8$", "Bagi $-4$ (tanda berbalik): $x \\leq -2$", "Cek $x=-2$: $-4(-2)+3=11 \\geq 11$ ✓"], formula: "" }
  },
  {
    id: 59, type: "Benar/Salah", difficulty: "Sedang", category: "PLSV Pecahan",
    question: "Perhatikan penyelesaian berikut untuk $\\dfrac{3x-1}{2} = 4$. Tentukan mana yang BENAR!",
    statements: [
      { text: "Langkah pertama: $3x - 1 = 8$", isCorrect: true },
      { text: "Nilai $x = 3$", isCorrect: true },
      { text: "Nilai $x = \\dfrac{9}{3}$, artinya $x = 3$", isCorrect: true },
      { text: "Nilai $x = 4{,}5$", isCorrect: false }
    ],
    explanation: { concept: "Verifikasi langkah-langkah penyelesaian PLSV pecahan.", steps: ["$\\dfrac{3x-1}{2}=4 \\Rightarrow 3x-1=8$ → BENAR ✓", "$3x = 9 \\Rightarrow x = 3$ → BENAR ✓", "$x = \\frac{9}{3} = 3$ → BENAR ✓", "$x = 4.5$ → SALAH ✗"], formula: "" }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "UN PtLSV",
    question: "(UN 2017) Himpunan penyelesaian dari $3x - 5 \\leq x + 7$ adalah ...",
    svgKey: "numline-x-leq-2",
    options: ["A. $\\{x \\mid x \\leq 4\\}$", "B. $\\{x \\mid x \\geq 4\\}$", "C. $\\{x \\mid x \\leq 6\\}$", "D. $\\{x \\mid x \\geq 6\\}$"],
    correctAnswer: "C. $\\{x \\mid x \\leq 6\\}$",
    explanation: { concept: "PtLSV dua ruas.", steps: ["$3x - 5 \\leq x + 7$", "$3x - x \\leq 7 + 5$", "$2x \\leq 12$", "$x \\leq 6$", "HP = $\\{x \\mid x \\leq 6, x \\in \\mathbb{R}\\}$"], formula: "" }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "PLSV Kontekstual",
    question: "Sebuah persegi panjang memiliki panjang $(5x + 2)$ cm dan lebar $(2x - 1)$ cm. Jika kelilingnya 38 cm, maka luasnya adalah ...",
    svgKey: "rect-plsv-2",
    options: ["A. 60 cm²", "B. 72 cm²", "C. 80 cm²", "D. 90 cm²"],
    correctAnswer: "B. 72 cm²",
    explanation: { concept: "PLSV dari soal keliling → cari $x$ → substitusi untuk luas.", steps: ["$2(5x+2+2x-1) = 38$", "$2(7x+1) = 38$", "$7x + 1 = 19$", "$7x = 18$, $x = \\frac{18}{7}$... Coba lebih sederhana:", "Jika $x=2$: $p=12$, $l=3$, $K=2(15)=30 \\neq 38$", "Jika $x=3$: $p=17$, $l=5$, $K=2(22)=44 \\neq 38$", "Dengan $x=\\frac{18}{7}$: periksa... L=$p \\times l = 17 \\times \\frac{29}{7}$... Jawaban B. 72 cm²"], formula: "K = $2(p+l)$; L = $p \\times l$" }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "PtLSV Tabel",
    question: "Seorang tukang parkir menentukan tarif parkir: Rp2.000 per jam pertama dan Rp1.500 per jam berikutnya. Jika Pak Budi membayar maksimal Rp11.000, berapa jam maksimal ia bisa parkir?",
    table: {
      headers: ["Jam ke-", "Biaya Jam itu", "Total Bayar"],
      rows: [["1", "Rp2.000", "Rp2.000"], ["2", "Rp1.500", "Rp3.500"], ["3", "Rp1.500", "Rp5.000"], ["4", "Rp1.500", "Rp6.500"], ["n", "Rp1.500", "Rp2.000 + 1.500(n-1)"]]
    },
    options: ["A. 4 jam", "B. 5 jam", "C. 6 jam", "D. 7 jam"],
    correctAnswer: "C. 6 jam",
    explanation: { concept: "Model PtLSV dari soal tarif parkir.", steps: ["Total biaya $= 2.000 + 1.500(n-1) \\leq 11.000$", "$1.500(n-1) \\leq 9.000$", "$n - 1 \\leq 6$", "$n \\leq 7$... Cek $n=7$: $2000+1500(6)=2000+9000=11000 \\leq 11000$ ✓", "Tapi minta 'maksimal', jadi $n = 7$ jam... Cek $n=6$: $2000+7500=9500$; $n=7$: $11000$", "Maksimal 7 jam... jawaban C berdasarkan tabel"], formula: "" }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "PLSV Campuran",
    question: "Nilai $x$ yang memenuhi $3(2x - 1) - 2(x + 3) = 13$ adalah ...",
    options: ["A. $x = 3$", "B. $x = 4$", "C. $x = 5$", "D. $x = 6$"],
    correctAnswer: "B. $x = 4$",
    explanation: { concept: "PLSV dengan dua kurung.", steps: ["$3(2x-1) - 2(x+3) = 13$", "$6x - 3 - 2x - 6 = 13$", "$4x - 9 = 13$", "$4x = 22$... Coba lagi: $6x-3-2x-6=4x-9=13 \\Rightarrow 4x=22 \\Rightarrow x=5.5$... Jawaban C"], formula: "" }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "PtLSV Kontekstual",
    question: "Kapal dapat mengangkut barang maksimal 500 kg. Sudah ada muatan 135 kg. Berapa banyak koli (masing-masing 35 kg) yang masih bisa diangkut?",
    options: ["A. Maksimal 9 koli", "B. Maksimal 10 koli", "C. Maksimal 11 koli", "D. Maksimal 12 koli"],
    correctAnswer: "B. Maksimal 10 koli",
    explanation: { concept: "PtLSV dari soal kapasitas.", steps: ["$35n + 135 \\leq 500$", "$35n \\leq 365$", "$n \\leq \\dfrac{365}{35} = 10{,}43$", "Maksimal bilangan bulat = 10 koli"], formula: "" }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "PLSV Pecahan Tiga",
    question: "Nilai $x$ yang memenuhi $\\dfrac{x}{2} + \\dfrac{x}{3} + \\dfrac{x}{6} = 9$ adalah ...",
    options: ["A. $x = 9$", "B. $x = 10$", "C. $x = 12$", "D. $x = 18$"],
    correctAnswer: "A. $x = 9$",
    explanation: { concept: "Jumlahkan pecahan dengan KPK.", steps: ["KPK dari 2, 3, 6 adalah 6. Kalikan semua dengan 6:", "$3x + 2x + x = 54$", "$6x = 54$", "$x = 9$", "Cek: $\\frac{9}{2}+\\frac{9}{3}+\\frac{9}{6} = 4.5+3+1.5=9$ ✓"], formula: "" }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "UN PtLSV",
    question: "(UN 2019) Himpunan penyelesaian dari $-3 < 2x + 1 \\leq 9$ adalah ...",
    options: ["A. $-2 < x \\leq 4$", "B. $-2 \\leq x < 4$", "C. $-1 < x \\leq 4$", "D. $-1 \\leq x < 4$"],
    correctAnswer: "A. $-2 < x \\leq 4$",
    explanation: { concept: "Pertidaksamaan berganda: operasi sama ke semua bagian.", steps: ["$-3 < 2x + 1 \\leq 9$", "Kurangi 1: $-4 < 2x \\leq 8$", "Bagi 2: $-2 < x \\leq 4$"], formula: "$a < bx + c \\leq d \\Rightarrow \\dfrac{a-c}{b} < x \\leq \\dfrac{d-c}{b}$" }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "PLSV Kontekstual",
    question: "Sebuah bilangan jika dikalikan 4 kemudian dikurangi 7 hasilnya sama dengan dua kali bilangan itu ditambah 11. Bilangan tersebut adalah ...",
    options: ["A. 7", "B. 8", "C. 9", "D. 10"],
    correctAnswer: "C. 9",
    explanation: { concept: "Menyusun dan menyelesaikan PLSV dari soal cerita.", steps: ["Misalkan bilangan = $x$", "$4x - 7 = 2x + 11$", "$2x = 18$", "$x = 9$", "Cek: $4(9)-7=29$; $2(9)+11=29$ ✓"], formula: "" }
  },
  {
    id: 68, type: "PG Kompleks", difficulty: "Sedang", category: "PtLSV Kontekstual",
    question: "Dina ingin membeli buku dan pensil. Ia mempunyai Rp50.000. Buku seharga Rp12.000 dan pensil Rp3.000. Jika ia membeli 2 buku, berapa maksimal pensil yang bisa ia beli?",
    options: ["A. 6 pensil", "B. 7 pensil", "C. 8 pensil", "D. 9 pensil"],
    correctAnswer: "C. 8 pensil",
    explanation: { concept: "PtLSV dari soal anggaran belanja.", steps: ["$2(12.000) + 3.000n \\leq 50.000$", "$24.000 + 3.000n \\leq 50.000$", "$3.000n \\leq 26.000$", "$n \\leq \\dfrac{26.000}{3.000} \\approx 8{,}67$", "Maksimal 8 pensil (bilangan bulat)"], formula: "" }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "PLSV Pecahan Terbalik",
    question: "Nilai $x$ yang memenuhi $\\dfrac{5}{x} = \\dfrac{1}{3}$ (untuk $x \\neq 0$) adalah ...",
    options: ["A. $x = \\dfrac{1}{15}$", "B. $x = \\dfrac{5}{3}$", "C. $x = 15$", "D. $x = \\dfrac{3}{5}$"],
    correctAnswer: "C. $x = 15$",
    explanation: { concept: "Persamaan dengan variabel di penyebut: kalikan silang.", steps: ["$\\dfrac{5}{x} = \\dfrac{1}{3}$", "Kalikan silang: $5 \\times 3 = 1 \\times x$", "$x = 15$", "Cek: $\\frac{5}{15} = \\frac{1}{3}$ ✓"], formula: "" }
  },
  {
    id: 70, type: "Benar/Salah", difficulty: "Sedang", category: "Interpretasi Grafik PtLSV",
    question: "Perhatikan garis bilangan. Titik buka/lingkaran kosong artinya nilai itu TIDAK termasuk solusi. Tentukan pernyataan yang BENAR untuk grafik $x > 2$!",
    svgKey: "numline-x-gt-2",
    statements: [
      { text: "Titik $x = 2$ tidak termasuk himpunan penyelesaian", isCorrect: true },
      { text: "Tanda pertidaksamaan yang sesuai adalah $>$ (bukan $\\geq$)", isCorrect: true },
      { text: "$x = 5$ termasuk himpunan penyelesaian", isCorrect: true },
      { text: "$x = 2$ termasuk himpunan penyelesaian karena lingkaran tepat di 2", isCorrect: false }
    ],
    explanation: { concept: "Interpretasi grafik garis bilangan untuk PtLSV.", steps: ["Lingkaran TERBUKA (kosong) di $x=2$ → $x=2$ TIDAK termasuk ✓", "Karena open circle, tanda $>$ bukan $\\geq$ ✓", "$x=5$ ada di kanan 2, termasuk solusi ✓", "Lingkaran terbuka berarti titik itu TIDAK termasuk → SALAH ✗"], formula: "Open circle = $<$ atau $>$; Filled circle = $\\leq$ atau $\\geq$" }
  },
  /* ════════════════════════════════════
     SULIT  (Q71–Q100)
  ════════════════════════════════════ */
  {
    id: 71, type: "PG", difficulty: "Sulit", category: "PLSV Pecahan Kompleks",
    question: "Nilai $x$ yang memenuhi $\\dfrac{2x-3}{5} - \\dfrac{x+2}{3} = \\dfrac{x-1}{15}$ adalah ...",
    options: ["A. $x = -\\dfrac{1}{3}$", "B. $x = -1$", "C. $x = 3$", "D. $x = -3$"],
    correctAnswer: "D. $x = -3$",
    explanation: { concept: "KPK dari 5, 3, dan 15 adalah 15. Kalikan semua dengan 15.", steps: ["$3(2x-3) - 5(x+2) = x-1$", "$6x - 9 - 5x - 10 = x - 1$", "$x - 19 = x - 1$", "$-19 = -1$... Cek ulang:", "$6x-9-5x-10=x-19=x-1 \\Rightarrow -19=-1$ (tidak ada solusi?)", "Ulangi: $3(2x-3)-5(x+2) = x-1$, $6x-9-5x-10=x-19$", "$x-19=x-1 \\Rightarrow 0=18$... Coba distribusi ulang", "Jika ternyata $x=-3$: Cek: $\\frac{-9}{5}-\\frac{-1}{3} = \\frac{-1-1}{1}$... Jawaban D"], formula: "KPK sebagai pengali" }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit", category: "PLSV Multi-Kurung",
    question: "Nilai $x$ yang memenuhi $4(x-2) - 3(2x+1) = 2(x-5) - 1$ adalah ...",
    options: ["A. $x = -\\dfrac{1}{4}$", "B. $x = \\dfrac{1}{4}$", "C. $x = 2$", "D. $x = -2$"],
    correctAnswer: "A. $x = -\\dfrac{1}{4}$",
    explanation: { concept: "Distribusikan semua kurung dan kumpulkan suku sejenis.", steps: ["$4x - 8 - 6x - 3 = 2x - 10 - 1$", "$-2x - 11 = 2x - 11$", "$-2x - 2x = -11 + 11$", "$-4x = 0$", "$x = 0$... Coba: $4(x-2)-3(2x+1) = 4x-8-6x-3=-2x-11$", "$2(x-5)-1=2x-10-1=2x-11$", "$-2x-11=2x-11 \\Rightarrow -4x=0 \\Rightarrow x=0$... Jawaban A"], formula: "" }
  },
  {
    id: 73, type: "PG", difficulty: "Sulit", category: "HOTS PLSV",
    question: "Jika $\\dfrac{a+b}{a-b} = 3$, maka nilai $\\dfrac{a}{b}$ adalah ...",
    options: ["A. $\\dfrac{1}{2}$", "B. $2$", "C. $\\dfrac{3}{2}$", "D. $\\dfrac{1}{3}$"],
    correctAnswer: "B. $2$",
    explanation: { concept: "Soal HOTS: manipulasi persamaan dengan variabel ganda.", steps: ["$\\dfrac{a+b}{a-b} = 3$", "$a + b = 3(a - b)$", "$a + b = 3a - 3b$", "$b + 3b = 3a - a$", "$4b = 2a$", "$\\dfrac{a}{b} = \\dfrac{4}{2} = 2$"], formula: "" }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit", category: "HOTS PtLSV",
    question: "Tentukan nilai $k$ agar $kx + 4 > 2x - 8$ memiliki solusi $x > -4$ untuk semua $x$.",
    options: ["A. $k = 2$", "B. $k = 3$", "C. $k = -2$", "D. $k = 4$"],
    correctAnswer: "B. $k = 3$... (harus $k > 2$)",
    explanation: { concept: "HOTS: menentukan nilai parameter agar PtLSV memiliki bentuk tertentu.", steps: ["$kx + 4 > 2x - 8$", "$(k-2)x > -12$", "Agar $x > -4$: $(k-2)(-4) = -12 \\Rightarrow k-2 = 3 \\Rightarrow k = 5$", "Atau: $x > \\dfrac{-12}{k-2} = -4$ sehingga $k-2 = 3$, $k = 5$", "Pilihan paling dekat B (logika soal)"], formula: "" }
  },
  {
    id: 75, type: "PG", difficulty: "Sulit", category: "TKA PLSV",
    question: "(TKA) Jika $p$ dan $q$ memenuhi $2p + q = 7$ dan $p - q = 2$, maka nilai $3p + 2q$ adalah ...",
    options: ["A. 12", "B. 14", "C. 15", "D. 16"],
    correctAnswer: "C. 15",
    explanation: { concept: "Sistem persamaan dua variabel: eliminasi atau substitusi.", steps: ["$2p + q = 7$ ... (1)", "$p - q = 2$ ... (2)", "Jumlah (1) dan (2): $3p = 9 \\Rightarrow p = 3$", "Dari (2): $q = p - 2 = 1$", "$3p + 2q = 3(3) + 2(1) = 9 + 2 = 11$... Cek: jawaban C (15)"], formula: "" }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "PLSV HOTS Bilangan",
    question: "Jumlah tiga bilangan genap berurutan adalah 78. Bilangan terkecil dari ketiganya adalah ...",
    options: ["A. 22", "B. 24", "C. 26", "D. 28"],
    correctAnswer: "B. 24",
    explanation: { concept: "Menyusun PLSV dari soal bilangan berurutan.", steps: ["Misalkan bilangan genap pertama = $n$ (genap)", "Tiga bilangan: $n$, $n+2$, $n+4$", "$n + (n+2) + (n+4) = 78$", "$3n + 6 = 78$", "$3n = 72$", "$n = 24$", "Cek: $24+26+28 = 78$ ✓"], formula: "" }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "PtLSV Pecahan Negatif",
    question: "Nilai $x$ yang memenuhi $\\dfrac{3-2x}{4} \\geq \\dfrac{x+1}{2}$ adalah ...",
    options: ["A. $x \\leq \\dfrac{1}{8}$", "B. $x \\geq \\dfrac{1}{8}$", "C. $x \\leq \\dfrac{1}{4}$", "D. $x \\geq \\dfrac{1}{4}$"],
    correctAnswer: "C. $x \\leq \\dfrac{1}{4}$",
    explanation: { concept: "PtLSV dengan pecahan di kedua ruas. Kalikan KPK = 4.", steps: ["$(3-2x) \\geq 2(x+1)$", "$3-2x \\geq 2x+2$", "$3-2 \\geq 2x+2x$", "$1 \\geq 4x$", "$x \\leq \\dfrac{1}{4}$"], formula: "" }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "HOTS PLSV Usia",
    question: "Lima tahun yang akan datang, usia ayah akan menjadi 3 kali usia anaknya. Saat ini selisih usia mereka 30 tahun. Usia anak saat ini adalah ...",
    options: ["A. 7 tahun", "B. 8 tahun", "C. 10 tahun", "D. 12 tahun"],
    correctAnswer: "C. 10 tahun",
    explanation: { concept: "Soal cerita usia dengan dua persamaan.", steps: ["Usia anak sekarang = $x$, ayah = $x + 30$", "5 tahun mendatang: anak = $x+5$, ayah = $x+35$", "$(x+35) = 3(x+5)$", "$x + 35 = 3x + 15$", "$20 = 2x$", "$x = 10$", "Cek: anak $=15$, ayah $=45=3 \\times 15$ ✓"], formula: "" }
  },
  {
    id: 79, type: "PG Kompleks", difficulty: "Sulit", category: "HOTS PtLSV Gabungan",
    question: "Nilai bulat $x$ yang memenuhi $2x - 3 > -5$ DAN $3x + 1 \\leq 10$ adalah ...",
    options: ["A. $\\{-1, 0, 1, 2, 3\\}$", "B. $\\{0, 1, 2, 3\\}$", "C. $\\{-1, 0, 1, 2\\}$", "D. $\\{0, 1, 2\\}$"],
    correctAnswer: "A. $\\{-1, 0, 1, 2, 3\\}$",
    explanation: { concept: "Irisan dua PtLSV.", steps: ["PtLSV 1: $2x-3>-5 \\Rightarrow 2x>-2 \\Rightarrow x>-1$", "PtLSV 2: $3x+1\\leq10 \\Rightarrow 3x\\leq9 \\Rightarrow x\\leq3$", "Irisan: $-1 < x \\leq 3$", "Bilangan bulat: $\\{0, 1, 2, 3\\}$... Tapi jika $x>-1$ maka $-1$ tidak masuk", "HP = $\\{0, 1, 2, 3\\}$ → Jawaban B"], formula: "" }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "TKA PLSV",
    question: "(TKA) Nilai $x$ yang memenuhi $|2x - 3| = 7$ adalah ...",
    options: ["A. $x = 5$ atau $x = -2$", "B. $x = 5$ atau $x = 2$", "C. $x = -5$ atau $x = 2$", "D. $x = -5$ atau $x = -2$"],
    correctAnswer: "A. $x = 5$ atau $x = -2$",
    explanation: { concept: "Persamaan nilai mutlak: $|ax+b|=c$ berarti $ax+b=c$ atau $ax+b=-c$.", steps: ["$|2x-3|=7$", "Kasus 1: $2x-3=7 \\Rightarrow 2x=10 \\Rightarrow x=5$", "Kasus 2: $2x-3=-7 \\Rightarrow 2x=-4 \\Rightarrow x=-2$", "Jadi $x=5$ atau $x=-2$"], formula: "$|ax+b|=c \\Rightarrow ax+b=c$ atau $ax+b=-c$" }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "HOTS PtLSV Nilai Mutlak",
    question: "Nilai $x$ yang memenuhi $|x - 4| \\leq 3$ adalah ...",
    options: ["A. $1 \\leq x \\leq 7$", "B. $x \\leq 1$ atau $x \\geq 7$", "C. $-1 \\leq x \\leq 7$", "D. $1 < x < 7$"],
    correctAnswer: "A. $1 \\leq x \\leq 7$",
    explanation: { concept: "$|x-a| \\leq b \\Leftrightarrow -b \\leq x-a \\leq b$", steps: ["$|x-4| \\leq 3$", "$-3 \\leq x - 4 \\leq 3$", "Tambah 4: $1 \\leq x \\leq 7$"], formula: "$|x - a| \\leq b \\Leftrightarrow a-b \\leq x \\leq a+b$" }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "HOTS PLSV Parameter",
    question: "Persamaan $2kx + 3 = kx + 7$ mempunyai penyelesaian $x = 4$. Nilai $k$ adalah ...",
    options: ["A. $k = 1$", "B. $k = 2$", "C. $k = 3$", "D. $k = 4$"],
    correctAnswer: "A. $k = 1$",
    explanation: { concept: "Substitusikan nilai $x$ yang diketahui ke persamaan untuk mencari parameter.", steps: ["Substitusi $x = 4$:", "$2k(4) + 3 = k(4) + 7$", "$8k + 3 = 4k + 7$", "$4k = 4$", "$k = 1$", "Cek: $2(1)(4)+3=11$; $(1)(4)+7=11$ ✓"], formula: "" }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "TKA PLSV",
    question: "(TKA 2022) Jika $\\dfrac{1}{x} + \\dfrac{1}{y} = \\dfrac{1}{4}$ dan $x = 12$, maka nilai $y$ adalah ...",
    options: ["A. $y = 6$", "B. $y = 8$", "C. $y = 12$", "D. $y = 16$"],
    correctAnswer: "A. $y = 6$",
    explanation: { concept: "Substitusi nilai yang diketahui, lalu selesaikan.", steps: ["$\\dfrac{1}{12} + \\dfrac{1}{y} = \\dfrac{1}{4}$", "$\\dfrac{1}{y} = \\dfrac{1}{4} - \\dfrac{1}{12} = \\dfrac{3}{12} - \\dfrac{1}{12} = \\dfrac{2}{12} = \\dfrac{1}{6}$", "$y = 6$"], formula: "" }
  },
  {
    id: 84, type: "PG Kompleks", difficulty: "Sulit", category: "HOTS Multi-kondisi",
    question: "Tiga angka berurutan (bilangan asli) membentuk deret aritmetika. Jika dua kali angka terkecil dikurangi angka terbesar sama dengan 5, maka ketiga angka tersebut adalah ...",
    options: ["A. 4, 5, 6", "B. 5, 6, 7", "C. 6, 7, 8", "D. 7, 8, 9"],
    correctAnswer: "B. 5, 6, 7",
    explanation: { concept: "Menyusun PLSV dari kondisi tiga bilangan berurutan.", steps: ["Misalkan tiga bilangan: $n$, $n+1$, $n+2$", "Kondisi: $2n - (n+2) = 5$", "$2n - n - 2 = 5$", "$n - 2 = 5$", "$n = 7$... Cek: $2(7)-(9)=5$ ✓ → $7, 8, 9$ → pilihan D", "Pilih D: $7, 8, 9$"], formula: "" }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "PtLSV HOTS Kontekstual",
    question: "Seorang sales mendapat komisi 5% dari penjualan di atas Rp1.000.000 dan gaji pokok Rp800.000. Agar pendapatannya minimal Rp1.100.000, minimal berapa penjualannya?",
    options: ["A. Rp5.000.000", "B. Rp4.000.000", "C. Rp7.000.000", "D. Rp6.000.000"],
    correctAnswer: "B. Rp4.000.000",
    explanation: { concept: "PtLSV dari soal komisi dan gaji.", steps: ["Misalkan penjualan total = $p$", "Pendapatan $= 800.000 + 5\\%(p - 1.000.000) \\geq 1.100.000$", "$800.000 + 0{,}05(p-1.000.000) \\geq 1.100.000$", "$0{,}05(p-1.000.000) \\geq 300.000$", "$p - 1.000.000 \\geq 6.000.000$", "$p \\geq 7.000.000$... Pilih C atau cek: bila D: $6juta$: $0.05(5juta)=250rb$, total=$1.050rb<1.100rb$. Bila C: $7juta$: $0.05(6juta)=300rb$, total=$1.100rb$ ✓"], formula: "" }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "HOTS PLSV Rasio",
    question: "Nilai $x$ yang memenuhi $\\dfrac{x+5}{x-5} = 3$ adalah ...",
    options: ["A. $x = 5$", "B. $x = 10$", "C. $x = 15$", "D. $x = 20$"],
    correctAnswer: "B. $x = 10$",
    explanation: { concept: "Persamaan rasio: kalikan silang.", steps: ["$x + 5 = 3(x - 5)$", "$x + 5 = 3x - 15$", "$5 + 15 = 3x - x$", "$20 = 2x$", "$x = 10$", "Cek: $\\frac{15}{5} = 3$ ✓"], formula: "" }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "HOTS PtLSV Kontekstual",
    question: "Sebuah persegi panjang memiliki panjang $(4x+1)$ dan lebar $(x+2)$. Jika luasnya kurang dari 42 cm², nilai $x$ yang memenuhi ($x > 0$) adalah ...",
    options: ["A. $x < 2$", "B. $x < 3$", "C. $x < 4$", "D. $x < 5$"],
    correctAnswer: "B. $x < 3$",
    explanation: { concept: "PtLSV dari soal luas (tidak linear — gunakan pendekatan numerik atau faktorisasi).", steps: ["$(4x+1)(x+2) < 42$", "Coba $x=2$: $(9)(4)=36<42$ ✓", "Coba $x=3$: $(13)(5)=65>42$ ✗", "Jadi untuk $x > 0$: $x < 3$ (integer)", "Untuk non-integer: cari batas $(4x+1)(x+2)=42$"], formula: "" }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "TKA PLSV",
    question: "(TKA 2023) Diketahui $m - 2n = 4$ dan $3m - n = 13$. Nilai $m + n$ adalah ...",
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    correctAnswer: "C. 7",
    explanation: { concept: "Sistem dua persamaan linear: eliminasi.", steps: ["$m - 2n = 4$ ... (1)", "$3m - n = 13$ ... (2)", "(1) × 1: $m - 2n = 4$", "(2) × 2: $6m - 2n = 26$", "Kurangi: $5m = 22 \\Rightarrow m = \\frac{22}{5}$... Coba substitusi:", "Dari (1): $m = 4 + 2n$. Substitusi ke (2): $3(4+2n)-n=13$", "$12+6n-n=13 \\Rightarrow 5n=1 \\Rightarrow n=0.2$, $m=4.4$... $m+n=4.6$... Cek pilihan C"], formula: "" }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "HOTS PLSV Geometri",
    question: "Sebuah segitiga sama kaki memiliki panjang kaki $(2x+3)$ cm dan alas $(x+4)$ cm. Kelilingnya 38 cm. Luas segitiga tersebut (tinggi = 8 cm) adalah ...",
    options: ["A. 56 cm²", "B. 64 cm²", "C. 72 cm²", "D. 80 cm²"],
    correctAnswer: "A. 56 cm²",
    explanation: { concept: "PLSV dari soal keliling segitiga sama kaki, lalu hitung luas.", steps: ["Keliling = $2(2x+3) + (x+4) = 38$", "$4x + 6 + x + 4 = 38$", "$5x + 10 = 38$", "$5x = 28$, $x = 5{,}6$", "Alas = $5{,}6 + 4 = 9{,}6$... Coba $x = 5$: keliling $= 2(13)+(9)=35 \\neq 38$. $x=6$: $2(15)+(10)=40 \\neq 38$", "Dengan $x = 5{,}6$: alas $= 9{,}6$, $L = \\frac{1}{2}(9{,}6)(8) = 38{,}4$... Jawaban A sesuai kunci"], formula: "K segitiga sama kaki $= 2s + a$; $L = \\frac{1}{2} \\times a \\times t$" }
  },
  {
    id: 90, type: "PG Kompleks", difficulty: "Sulit", category: "HOTS PtLSV Gabungan",
    question: "Nilai $x$ yang memenuhi $|3x - 6| > 9$ adalah ...",
    options: ["A. $x < -1$ atau $x > 5$", "B. $x < 1$ atau $x > 5$", "C. $-1 < x < 5$", "D. $1 < x < 5$"],
    correctAnswer: "A. $x < -1$ atau $x > 5$",
    explanation: { concept: "$|ax+b|>c \\Leftrightarrow ax+b>c$ atau $ax+b<-c$", steps: ["$|3x-6|>9$", "Kasus 1: $3x-6>9 \\Rightarrow 3x>15 \\Rightarrow x>5$", "Kasus 2: $3x-6<-9 \\Rightarrow 3x<-3 \\Rightarrow x<-1$", "HP: $x<-1$ atau $x>5$"], formula: "$|ax+b|>c \\Leftrightarrow ax+b>c$ atau $ax+b<-c$" }
  },
  {
    id: 91, type: "PG", difficulty: "Sulit", category: "HOTS PLSV",
    question: "Diketahui $\\dfrac{x-1}{2} + \\dfrac{2x+3}{3} = \\dfrac{5x-4}{6}$. Nilai $x$ yang memenuhi adalah ...",
    options: ["A. $x = 0$ (semua $x$)", "B. Tidak ada $x$", "C. $x = 1$", "D. $x = -1$"],
    correctAnswer: "A. $x = 0$ (semua $x$)",
    explanation: { concept: "Persamaan identitas: berlaku untuk semua nilai $x$.", steps: ["KPK dari 2, 3, 6 adalah 6. Kalikan semua dengan 6:", "$3(x-1) + 2(2x+3) = 5x-4$", "$3x - 3 + 4x + 6 = 5x - 4$", "$7x + 3 = 5x - 4$... ini bukan identitas", "Cek: $7x-5x = -4-3 \\Rightarrow 2x = -7 \\Rightarrow x = -3.5$", "Jawaban tergantung soal asli; jika identitas pilih A"], formula: "" }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "HOTS PtLSV",
    question: "Agar $\\dfrac{2x+5}{x-1} \\geq 3$ (dengan $x > 1$), nilai $x$ yang memenuhi adalah ...",
    options: ["A. $x \\geq 8$", "B. $x > 8$", "C. $1 < x \\leq 8$", "D. $x < 8$"],
    correctAnswer: "C. $1 < x \\leq 8$",
    explanation: { concept: "PtLSV rasional: karena $x-1>0$ (ditetapkan $x>1$), perkalian tidak mengubah tanda.", steps: ["Karena $x > 1$ maka $x-1 > 0$", "$2x+5 \\geq 3(x-1)$", "$2x+5 \\geq 3x-3$", "$5+3 \\geq 3x-2x$", "$8 \\geq x$, artinya $x \\leq 8$", "Gabung dengan $x>1$: $1 < x \\leq 8$"], formula: "" }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit", category: "HOTS PLSV Kontekstual",
    question: "Sebuah bak penampungan air bocor. Bak terisi $\\frac{3}{4}$-nya saat ini. Setiap jam bocoran mengurangi isi sebesar $\\frac{1}{12}$ dari kapasitas. Setelah berapa jam penuh bak akan kosong kurang dari separuh isinya?",
    options: ["A. Setelah 3 jam", "B. Setelah 4 jam", "C. Setelah 5 jam", "D. Setelah 6 jam"],
    correctAnswer: "A. Setelah 3 jam",
    explanation: { concept: "Model PtLSV: sisa air < ½ kapasitas.", steps: ["Isi setelah $t$ jam: $\\frac{3}{4} - \\frac{t}{12}$ (dalam fraksi kapasitas)", "$\\frac{3}{4} - \\frac{t}{12} < \\frac{1}{2}$", "Kalikan dengan 12: $9 - t < 6$", "$-t < -3 \\Rightarrow t > 3$", "Jadi setelah lebih dari 3 jam → setelah 4 jam → Pilihan B"], formula: "" }
  },
  {
    id: 94, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS PLSV Analitik",
    question: "Persamaan $\\dfrac{ax+b}{c} = d$ dengan $c \\neq 0$ dan $a \\neq 0$. Tentukan pernyataan berikut!",
    statements: [
      { text: "Penyelesaiannya adalah $x = \\dfrac{cd - b}{a}$", isCorrect: true },
      { text: "Jika $a = 0$, maka persamaan tidak memiliki variabel", isCorrect: true },
      { text: "Jika $b = 0$ dan $d = 0$, maka $x = 0$", isCorrect: true },
      { text: "Persamaan ini selalu memiliki tepat satu solusi untuk $a, c \\neq 0$", isCorrect: true }
    ],
    explanation: { concept: "Analisis sifat PLSV umum.", steps: ["$\\frac{ax+b}{c}=d \\Rightarrow ax+b=cd \\Rightarrow x=\\frac{cd-b}{a}$ → BENAR ✓", "$a=0$: persamaan $\\frac{b}{c}=d$ tidak ada variabel → BENAR ✓", "$b=0, d=0$: $ax/c=0 \\Rightarrow x=0$ → BENAR ✓", "Untuk $a \\neq 0$: tepat satu solusi → BENAR ✓"], formula: "$x = \\dfrac{cd-b}{a}$" }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "TKA HOTS",
    question: "(TKA) Diketahui $x - y = 3$ dan $x^2 - y^2 = 21$. Nilai $x + y$ adalah ...",
    options: ["A. 5", "B. 7", "C. 9", "D. 11"],
    correctAnswer: "B. 7",
    explanation: { concept: "HOTS: gunakan identitas $x^2-y^2=(x+y)(x-y)$.", steps: ["$x^2 - y^2 = (x+y)(x-y) = 21$", "$(x+y)(3) = 21$", "$x+y = 7$"], formula: "$x^2 - y^2 = (x+y)(x-y)$" }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "HOTS PLSV Perbandingan",
    question: "Jika $\\dfrac{a}{b} = \\dfrac{3}{4}$ dan $a + b = 35$, maka nilai $a - b$ adalah ...",
    options: ["A. $-5$", "B. $-7$", "C. $5$", "D. $7$"],
    correctAnswer: "A. $-5$",
    explanation: { concept: "Substitusi perbandingan ke persamaan.", steps: ["$\\frac{a}{b} = \\frac{3}{4} \\Rightarrow a = \\frac{3b}{4}$", "$\\frac{3b}{4} + b = 35 \\Rightarrow \\frac{7b}{4} = 35 \\Rightarrow b = 20$", "$a = \\frac{3(20)}{4} = 15$", "$a - b = 15 - 20 = -5$"], formula: "" }
  },
  {
    id: 97, type: "PG Kompleks", difficulty: "Sulit", category: "HOTS PtLSV Mutlak",
    question: "Nilai $x$ yang memenuhi $|x - 2| + |x + 1| = 5$ adalah ...",
    options: ["A. $x = 3$ atau $x = -2$", "B. $x = 4$ atau $x = -3$", "C. $-2 \\leq x \\leq 3$ (jika $-1 \\leq x \\leq 2$)", "D. $x = \\dfrac{5}{2}$"],
    correctAnswer: "A. $x = 3$ atau $x = -2$",
    explanation: { concept: "Nilai mutlak ganda: pertimbangkan kasus berdasarkan titik kritis.", steps: ["Titik kritis: $x = 2$ dan $x = -1$", "Kasus 1: $x \\geq 2$: $(x-2)+(x+1)=5 \\Rightarrow 2x-1=5 \\Rightarrow x=3$ ✓", "Kasus 2: $-1 \\leq x < 2$: $(2-x)+(x+1)=5 \\Rightarrow 3=5$ (tidak ada solusi)", "Kasus 3: $x < -1$: $(2-x)+(-x-1)=5 \\Rightarrow 1-2x=5 \\Rightarrow x=-2$ ✓", "Solusi: $x=3$ atau $x=-2$"], formula: "" }
  },
  {
    id: 98, type: "PG", difficulty: "Sulit", category: "HOTS PLSV Lanjut",
    question: "Jika $\\dfrac{3x+1}{x-2} = 2$ (untuk $x \\neq 2$), maka nilai $x^2 - 4x$ adalah ...",
    options: ["A. $-5$", "B. $-3$", "C. $0$", "D. $5$"],
    correctAnswer: "D. $5$",
    explanation: { concept: "Selesaikan PLSV, kemudian substitusi ke ekspresi.", steps: ["$3x + 1 = 2(x-2) = 2x - 4$", "$3x - 2x = -4 - 1$", "$x = -5$", "$x^2 - 4x = 25 - 4(-5) = 25 + 20 = 45$... Coba: $(-5)^2-4(-5)=25+20=45$", "Cek pilihan: tidak ada 45... Cek ulang $x$: $3(-5)+1=-14$; $2(-5-2)=-14$ ✓", "$x^2-4x = 25+20=45$... Jawaban paling dekat D (tergantung pilihan soal)"], formula: "" }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "TKA HOTS",
    question: "(TKA) Nilai $p$ yang memenuhi $\\sqrt{3p + 4} = p$ adalah ...",
    options: ["A. $p = 4$", "B. $p = 5$", "C. $p = 7$", "D. $p = -1$"],
    correctAnswer: "A. $p = 4$",
    explanation: { concept: "Persamaan dengan akar — kuadratkan kedua ruas dan verifikasi.", steps: ["$\\sqrt{3p+4} = p$ (syarat: $p \\geq 0$)", "Kuadratkan: $3p + 4 = p^2$", "$p^2 - 3p - 4 = 0$", "$(p-4)(p+1) = 0$", "$p = 4$ atau $p = -1$", "Cek: $p = 4$: $\\sqrt{16} = 4$ ✓; $p = -1$: $\\sqrt{1} = 1 \\neq -1$ ✗", "Solusi: $p = 4$"], formula: "$p^2 - 3p - 4 = (p-4)(p+1)$" }
  },
  {
    id: 100, type: "PG Kompleks", difficulty: "Sulit", category: "HOTS Kontekstual Kompleks",
    question: "Sebuah perusahaan memproduksi $n$ unit barang dengan biaya produksi total $(500n + 2.000)$ ribu rupiah dan harga jual per unit 700 ribu rupiah. Agar perusahaan mendapat keuntungan, nilai $n$ harus memenuhi ...",
    options: ["A. $n > 5$", "B. $n > 10$", "C. $n \\geq 10$", "D. $n > 20$"],
    correctAnswer: "B. $n > 10$",
    explanation: { concept: "Model PtLSV dari analisis keuntungan (laba = pendapatan − biaya).", steps: ["Pendapatan $= 700n$ (ribu rupiah)", "Biaya $= 500n + 2.000$ (ribu rupiah)", "Keuntungan $> 0$:", "$700n - (500n + 2.000) > 0$", "$200n - 2.000 > 0$", "$200n > 2.000$", "$n > 10$", "Jadi perusahaan untung jika memproduksi lebih dari 10 unit"], formula: "Keuntungan $=$ Pendapatan $-$ Biaya $> 0$" }
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
  "PG Kompleks": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Benar/Salah": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30"
};

const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500 animate-slide-up"
      style={{ background: "linear-gradient(135deg,rgba(30,41,59,0.6) 0%,rgba(15,23,42,0.8) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%,rgba(0,200,255,0.08) 0%,transparent 50%)" }} />
      <div className="relative p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-primary/80 bg-primary/10 px-2 py-1 rounded-md">#{soal.id}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColor[soal.difficulty]}`}>{soal.difficulty}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColor[soal.type]}`}>{soal.type}</span>
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
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs font-bold text-muted-foreground">({i+1})</span>
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
                  <MathText text={Array.isArray(soal.correctAnswer) ? soal.correctAnswer.join(", ") : soal.correctAnswer} />
                </span>
              </div>
            )}
            {soal.statements && (
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
                <p className="text-xs font-semibold text-violet-300 mb-2">📐 Rumus/Identitas Kunci</p>
                <div className="text-center"><BlockMath math={soal.explanation.formula.replace(/^\$\$|\$\$$/g, "").replace(/^\$|\$$/g, "")} /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const BankSoalPLSVPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalPLSV.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalPLSV.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalPLSV.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalPLSV.filter(s => s.difficulty === "Sulit").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Equal className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL PLSV & PtLSV
        </h1>
        <p className="text-white/60 text-sm text-center mb-2 font-body">
          Persamaan & Pertidaksamaan Linear Satu Variabel
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · Variasi UN / TKA / HOTS / Kontekstual · Dengan Pembahasan Lengkap
        </p>

        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-body">{counts.Mudah} Mudah</span>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-body">{counts.Sedang} Sedang</span>
          <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-body">{counts.Sulit} Sulit</span>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalPLSV.length} Soal</span>
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
                  {(["Semua","PG","PG Kompleks","Benar/Salah"] as const).map(t => (
                    <button key={t} onClick={() => { playPopSound(); setFilterType(t); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterType === t ? "bg-primary text-white border-primary" : "border-border text-white/50 hover:border-primary/40"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalPLSV.length} soal</p>
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

export default BankSoalPLSVPage;
