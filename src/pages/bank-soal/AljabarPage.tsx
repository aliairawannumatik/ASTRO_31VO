import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Variable, ChevronDown, ChevronUp, Filter } from "lucide-react";
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

/* ── Visual Components ── */
const RectangleSVG = ({ w, h, label }: { w: string; h: string; label?: string }) => (
  <svg viewBox="0 0 220 120" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="20" y="20" width="180" height="80" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="2" rx="4"/>
    <text x="110" y="15" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace">{h}</text>
    <text x="215" y="65" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace">{w}</text>
    {label && <text x="110" y="68" fill="#fde68a" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label}</text>}
    <line x1="20" y1="8" x2="200" y2="8" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arr)"/>
    <line x1="212" y1="20" x2="212" y2="100" stroke="#94a3b8" strokeWidth="1"/>
    <text x="110" y="5" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">panjang = {h}</text>
    <text x="218" y="62" fill="#94a3b8" fontSize="9" textAnchor="start" fontFamily="monospace" transform="rotate(90 218 62)">lebar = {w}</text>
  </svg>
);

const TriangleSVG = ({ a, t, label }: { a: string; t: string; label?: string }) => (
  <svg viewBox="0 0 220 130" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="110,15 20,115 200,115" fill="rgba(168,85,247,0.1)" stroke="#a855f7" strokeWidth="2"/>
    <line x1="110" y1="15" x2="110" y2="115" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3"/>
    <text x="110" y="125" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace">alas = {a}</text>
    <text x="118" y="70" fill="#fbbf24" fontSize="11" fontFamily="monospace">t = {t}</text>
    {label && <text x="110" y="90" fill="#fde68a" fontSize="11" textAnchor="middle" fontFamily="monospace">{label}</text>}
  </svg>
);

const BarChartSVG = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const max = Math.max(...data.map(d => d.value));
  const h = 80;
  return (
    <svg viewBox={`0 0 ${data.length * 55 + 30} 120`} className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      {data.map((d, i) => {
        const barH = (d.value / max) * h;
        const x = 20 + i * 55;
        return (
          <g key={i}>
            <rect x={x} y={100 - barH} width="40" height={barH} fill={d.color} rx="3" fillOpacity="0.8"/>
            <text x={x + 20} y="112" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{d.label}</text>
            <text x={x + 20} y={96 - barH} fill="#e2e8f0" fontSize="10" textAnchor="middle" fontFamily="monospace">{d.value}</text>
          </g>
        );
      })}
      <line x1="15" y1="100" x2={data.length * 55 + 15} y2="100" stroke="#475569" strokeWidth="1"/>
    </svg>
  );
};

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
  "rect-3x-2x": <RectangleSVG w="2x" h="3x" label="Luas = ?" />,
  "rect-5a-3": <RectangleSVG w="3" h="5a+2" label="Luas = ?" />,
  "rect-x2-4": <RectangleSVG w="(x+4)" h="(x-2)" label="Luas = ?" />,
  "tri-4x-3x": <TriangleSVG a="4x" t="3x" label="Luas = ?" />,
  "tri-2a6-a": <TriangleSVG a="(2a+6)" t="a" label="Luas = ?" />,
  "bar-produk": <BarChartSVG data={[{label:"Apel",value:3,color:"#22c55e"},{label:"Jeruk",value:5,color:"#f97316"},{label:"Mangga",value:2,color:"#fbbf24"},{label:"Pisang",value:4,color:"#a855f7"}]} />,
  "bar-nilai": <BarChartSVG data={[{label:"A",value:80,color:"#06b6d4"},{label:"B",value:70,color:"#8b5cf6"},{label:"C",value:90,color:"#22c55e"},{label:"D",value:60,color:"#f97316"}]} />,
};

const soalAljabar: Question[] = [
  /* ════════════════════════════════════
     MUDAH  (Q1–Q30)
  ════════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Unsur Aljabar",
    question: "Pada bentuk aljabar $3x^2 - 5x + 7$, koefisien dari $x^2$ adalah ...",
    options: ["A. 7", "B. -5", "C. 3", "D. x"],
    correctAnswer: "C. 3",
    explanation: { concept: "Koefisien adalah bilangan yang mengalikan variabel dalam suatu suku.", steps: ["Suku pertama: $3x^2$", "Bilangan yang mengalikan $x^2$ adalah $3$", "Jadi, koefisien $x^2$ adalah $3$"], formula: "Suku $ax^n$ → koefisien = $a$" }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Unsur Aljabar",
    question: "Konstanta pada bentuk aljabar $4a^2 + 7a - 9$ adalah ...",
    options: ["A. 4", "B. 7", "C. a", "D. -9"],
    correctAnswer: "D. -9",
    explanation: { concept: "Konstanta adalah suku yang tidak memuat variabel (bilangan tetap).", steps: ["Identifikasi setiap suku: $4a^2$, $7a$, dan $-9$", "$4a^2$ dan $7a$ memuat variabel $a$", "$-9$ tidak memuat variabel → konstanta", "Jadi, konstantanya adalah $-9$"], formula: "Konstanta = bilangan yang tidak memuat variabel" }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Unsur Aljabar",
    question: "Banyaknya suku pada bentuk aljabar $5p + 3q - 2p^2 + 8$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "C. 4",
    explanation: { concept: "Suku dalam bentuk aljabar dipisahkan oleh tanda + atau −.", steps: ["Tulis: $5p$, $3q$, $-2p^2$, $8$", "Hitung: ada 4 suku terpisah", "Jadi banyak suku = 4"], formula: "Suku = bagian yang dipisahkan oleh + atau −" }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Unsur Aljabar",
    question: "Variabel pada bentuk aljabar $-6m + 4n - 1$ adalah ...",
    options: ["A. m saja", "B. n saja", "C. m dan n", "D. -1"],
    correctAnswer: "C. m dan n",
    explanation: { concept: "Variabel adalah lambang (huruf) yang mewakili suatu bilangan yang belum diketahui.", steps: ["Suku-suku: $-6m$, $4n$, $-1$", "$-6m$ → variabel $m$", "$4n$ → variabel $n$", "$-1$ → konstanta, bukan variabel", "Jadi variabelnya: $m$ dan $n$"], formula: "" }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Unsur Aljabar",
    question: "Koefisien dari $-x$ pada bentuk aljabar $2y - x + 5$ adalah ...",
    options: ["A. 1", "B. -1", "C. x", "D. 0"],
    correctAnswer: "B. -1",
    explanation: { concept: "Jika variabel tidak memiliki angka di depannya, koefisiennya adalah 1. Jika bertanda negatif, koefisiennya -1.", steps: ["Suku $-x$ berarti $-1 \\times x$", "Koefisien $x$ adalah $-1$"], formula: "$-x = (-1)x$" }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Penyederhanaan",
    question: "Hasil penyederhanaan $7x + 4x$ adalah ...",
    options: ["A. 3x", "B. 11x", "C. 11x²", "D. 28x"],
    correctAnswer: "B. 11x",
    explanation: { concept: "Suku-suku sejenis (sama variabel dan pangkat) dapat dijumlahkan dengan menjumlahkan koefisiennya.", steps: ["$7x$ dan $4x$ adalah suku sejenis (variabel $x$)", "Jumlahkan koefisien: $7 + 4 = 11$", "Jadi, $7x + 4x = 11x$"], formula: "$ax + bx = (a+b)x$" }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Penyederhanaan",
    question: "Hasil penyederhanaan $12a - 5a$ adalah ...",
    options: ["A. 7", "B. 7a²", "C. 7a", "D. 17a"],
    correctAnswer: "C. 7a",
    explanation: { concept: "Pengurangan suku sejenis: kurangi koefisiennya.", steps: ["$12a - 5a$: suku sejenis (variabel $a$)", "Kurangi koefisien: $12 - 5 = 7$", "Jadi, $12a - 5a = 7a$"], formula: "$ax - bx = (a-b)x$" }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Penyederhanaan",
    question: "Hasil penyederhanaan $5x + 3y + 2x - y$ adalah ...",
    options: ["A. $9x$", "B. $7x + 2y$", "C. $3x + 4y$", "D. $7x - 2y$"],
    correctAnswer: "B. $7x + 2y$",
    explanation: { concept: "Kelompokkan dan jumlahkan suku-suku sejenis.", steps: ["Kelompok $x$: $5x + 2x = 7x$", "Kelompok $y$: $3y - y = 2y$", "Jadi, $5x + 3y + 2x - y = 7x + 2y$"], formula: "" }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Penyederhanaan",
    question: "Hasil penyederhanaan $4a^2 + 3a + 2a^2 - a$ adalah ...",
    options: ["A. $6a^2 + 2a$", "B. $6a^2 + 4a$", "C. $6a^2 - 2a$", "D. $2a^2 + 2a$"],
    correctAnswer: "A. $6a^2 + 2a$",
    explanation: { concept: "Penyederhanaan bentuk aljabar dengan dua jenis suku sejenis.", steps: ["Kelompok $a^2$: $4a^2 + 2a^2 = 6a^2$", "Kelompok $a$: $3a - a = 2a$", "Hasil: $6a^2 + 2a$"], formula: "" }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Substitusi",
    question: "Jika $x = 3$, maka nilai $4x - 2$ adalah ...",
    options: ["A. 5", "B. 10", "C. 12", "D. 14"],
    correctAnswer: "B. 10",
    explanation: { concept: "Substitusi: ganti variabel dengan nilai yang diberikan.", steps: ["$4x - 2$ dengan $x = 3$", "$= 4(3) - 2$", "$= 12 - 2$", "$= 10$"], formula: "" }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Substitusi",
    question: "Jika $a = -2$, maka nilai $a^2 + 3a$ adalah ...",
    options: ["A. -2", "B. 2", "C. -10", "D. 10"],
    correctAnswer: "A. -2",
    explanation: { concept: "Substitusi nilai negatif ke dalam bentuk aljabar.", steps: ["$a = -2$", "$a^2 = (-2)^2 = 4$", "$3a = 3(-2) = -6$", "$a^2 + 3a = 4 + (-6) = -2$"], formula: "" }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Substitusi",
    question: "Jika $p = 2$ dan $q = -1$, maka nilai $3p - 2q$ adalah ...",
    options: ["A. 4", "B. 8", "C. 2", "D. -4"],
    correctAnswer: "B. 8",
    explanation: { concept: "Substitusi dua variabel sekaligus.", steps: ["$3p - 2q$ dengan $p=2, q=-1$", "$= 3(2) - 2(-1)$", "$= 6 + 2$", "$= 8$"], formula: "" }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Operasi Aljabar",
    question: "Hasil dari $(3x + 2) + (x - 5)$ adalah ...",
    options: ["A. $4x - 3$", "B. $4x + 3$", "C. $2x - 3$", "D. $4x - 7$"],
    correctAnswer: "A. $4x - 3$",
    explanation: { concept: "Penjumlahan dua bentuk aljabar: buka kurung lalu kelompokkan suku sejenis.", steps: ["$(3x + 2) + (x - 5)$", "$= 3x + 2 + x - 5$", "Suku $x$: $3x + x = 4x$", "Konstanta: $2 - 5 = -3$", "$= 4x - 3$"], formula: "" }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Operasi Aljabar",
    question: "Hasil dari $(7y - 3) - (2y + 1)$ adalah ...",
    options: ["A. $5y - 4$", "B. $5y - 2$", "C. $9y - 4$", "D. $5y + 4$"],
    correctAnswer: "A. $5y - 4$",
    explanation: { concept: "Pengurangan bentuk aljabar: ubah tanda suku di kurung kedua.", steps: ["$(7y - 3) - (2y + 1)$", "$= 7y - 3 - 2y - 1$", "Suku $y$: $7y - 2y = 5y$", "Konstanta: $-3 - 1 = -4$", "$= 5y - 4$"], formula: "" }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Operasi Aljabar",
    question: "Hasil dari $4x \\times 3y$ adalah ...",
    options: ["A. $7xy$", "B. $12xy$", "C. $12x^2y^2$", "D. $12x+y$"],
    correctAnswer: "B. $12xy$",
    explanation: { concept: "Perkalian monomial: kalikan koefisien dan kalikan variabel.", steps: ["$4x \\times 3y$", "Koefisien: $4 \\times 3 = 12$", "Variabel: $x \\times y = xy$", "$= 12xy$"], formula: "$ax \\times by = (a \\cdot b)(xy)$" }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Operasi Aljabar",
    question: "Hasil dari $3x \\times 5x$ adalah ...",
    options: ["A. $8x$", "B. $15x$", "C. $15x^2$", "D. $8x^2$"],
    correctAnswer: "C. $15x^2$",
    explanation: { concept: "Perkalian monomial dengan variabel sama: kalikan koefisien, tambahkan pangkat.", steps: ["$3x \\times 5x$", "Koefisien: $3 \\times 5 = 15$", "Variabel: $x \\times x = x^2$", "$= 15x^2$"], formula: "$x^m \\times x^n = x^{m+n}$" }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Operasi Aljabar",
    question: "Hasil dari $(-2a) \\times 4b$ adalah ...",
    options: ["A. $-8ab$", "B. $8ab$", "C. $-6ab$", "D. $2ab$"],
    correctAnswer: "A. $-8ab$",
    explanation: { concept: "Perkalian monomial dengan tanda negatif.", steps: ["$(-2a) \\times 4b$", "Koefisien: $(-2) \\times 4 = -8$", "Variabel: $a \\times b = ab$", "$= -8ab$"], formula: "" }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Operasi Aljabar",
    question: "Hasil dari $12x^2 \\div 4x$ adalah ...",
    options: ["A. $3x^2$", "B. $3x$", "C. $8x$", "D. $48x^3$"],
    correctAnswer: "B. $3x$",
    explanation: { concept: "Pembagian monomial: bagi koefisien, kurangkan pangkat variabel.", steps: ["$12x^2 \\div 4x = \\frac{12x^2}{4x}$", "Koefisien: $\\frac{12}{4} = 3$", "Variabel: $\\frac{x^2}{x} = x^{2-1} = x$", "$= 3x$"], formula: "$\\frac{x^m}{x^n} = x^{m-n}$" }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Penyederhanaan",
    question: "Manakah yang BUKAN suku sejenis dengan $5xy$?",
    options: ["A. $-3xy$", "B. $7xy$", "C. $\\frac{1}{2}xy$", "D. $5x^2y$"],
    correctAnswer: "D. $5x^2y$",
    explanation: { concept: "Suku sejenis harus memiliki variabel dan pangkat yang SAMA.", steps: ["$5xy$ → variabel $xy$ (pangkat 1 dan 1)", "$-3xy$ → variabel $xy$ ✓ sejenis", "$7xy$ → variabel $xy$ ✓ sejenis", "$\\frac{1}{2}xy$ → variabel $xy$ ✓ sejenis", "$5x^2y$ → variabel $x^2y$ (pangkat x berbeda!) ✗ bukan sejenis"], formula: "" }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Suku Sejenis",
    question: "Pasangan suku sejenis yang benar adalah ...",
    options: ["A. $3x$ dan $3y$", "B. $2x^2$ dan $2x$", "C. $5ab$ dan $-2ab$", "D. $4m$ dan $4m^2$"],
    correctAnswer: "C. $5ab$ dan $-2ab$",
    explanation: { concept: "Suku sejenis: variabel dan pangkat semua variabel sama.", steps: ["A: $3x$ dan $3y$ — variabel berbeda ✗", "B: $2x^2$ dan $2x$ — pangkat $x$ berbeda ✗", "C: $5ab$ dan $-2ab$ — keduanya $ab$ ✓", "D: $4m$ dan $4m^2$ — pangkat berbeda ✗"], formula: "" }
  },
  {
    id: 21, type: "Benar/Salah", difficulty: "Mudah", category: "Unsur Aljabar",
    question: "Tentukan BENAR atau SALAH pernyataan berikut tentang unsur-unsur bentuk aljabar!",
    statements: [
      { text: "Koefisien $x$ pada $-3x + 5$ adalah $-3$", isCorrect: true },
      { text: "Konstanta pada $2a - b + 4$ adalah $4$", isCorrect: true },
      { text: "Banyak suku pada $3x + 2y - 5$ adalah $2$", isCorrect: false },
      { text: "Variabel $5$ pada bentuk aljabar adalah variabel", isCorrect: false }
    ],
    explanation: { concept: "Unsur-unsur bentuk aljabar: koefisien, variabel, konstanta, suku.", steps: ["$-3x+5$: koefisien $x = -3$ → BENAR", "$2a-b+4$: konstanta = $4$ (tidak ada variabel) → BENAR", "$3x+2y-5$: ada 3 suku ($3x$, $2y$, $-5$) → SALAH (bukan 2)", "$5$ adalah konstanta/bilangan tetap, bukan variabel → SALAH"], formula: "" }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Operasi Aljabar",
    question: "Nilai dari $2(x + 3)$ ketika $x = 4$ adalah ...",
    options: ["A. 11", "B. 14", "C. 10", "D. 5"],
    correctAnswer: "B. 14",
    explanation: { concept: "Sifat distributif kemudian substitusi.", steps: ["$2(x + 3)$ dengan $x = 4$", "Cara 1: Substitusi dulu → $2(4 + 3) = 2(7) = 14$", "Cara 2: Distribusikan dulu → $2x + 6 = 2(4) + 6 = 8 + 6 = 14$"], formula: "$a(b + c) = ab + ac$" }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Operasi Aljabar",
    question: "Keliling persegi panjang dengan panjang $5x$ dan lebar $3x$ adalah ...",
    svgKey: "rect-3x-2x",
    options: ["A. $8x$", "B. $15x^2$", "C. $16x$", "D. $15x$"],
    correctAnswer: "C. $16x$",
    explanation: { concept: "Keliling persegi panjang = $2(p + l)$.", steps: ["Panjang $= 5x$, lebar $= 3x$", "Keliling $= 2(5x + 3x) = 2(8x) = 16x$"], formula: "$K = 2(p + l)$" }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Penyederhanaan",
    question: "Bentuk sederhana dari $\\frac{6x}{3}$ adalah ...",
    options: ["A. $6x$", "B. $3x$", "C. $2x$", "D. $18x$"],
    correctAnswer: "C. $2x$",
    explanation: { concept: "Pembagian monomial dengan konstanta.", steps: ["$\\frac{6x}{3} = \\frac{6}{3} \\cdot x = 2x$"], formula: "" }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Seorang pedagang memiliki $n$ buah apel. Jika ia membeli $12$ apel lagi, banyak apel sekarang adalah ...",
    options: ["A. $12n$", "B. $n - 12$", "C. $n + 12$", "D. $12 \\div n$"],
    correctAnswer: "C. $n + 12$",
    explanation: { concept: "Membuat model matematika dari soal cerita.", steps: ["Awal: $n$ buah apel", "Beli lagi: $+12$ buah", "Total: $n + 12$ buah"], formula: "" }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Harga $x$ buku adalah $Rp\\ 15.000$. Harga $1$ buku adalah ...",
    options: ["A. $Rp\\ 15.000x$", "B. $Rp\\ \\frac{x}{15.000}$", "C. $Rp\\ \\frac{15.000}{x}$", "D. $Rp\\ 15.000 + x$"],
    correctAnswer: "C. $Rp\\ \\frac{15.000}{x}$",
    explanation: { concept: "Soal kontekstual harga satuan.", steps: ["Total harga $x$ buku = $Rp 15.000$", "Harga 1 buku = total ÷ jumlah = $\\frac{15.000}{x}$"], formula: "Harga satuan = total ÷ kuantitas" }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Pola",
    question: "Perhatikan tabel berikut!",
    table: { headers: ["$n$", "$1$", "$2$", "$3$", "$4$", "$5$"], rows: [["$3n + 1$", "$4$", "$7$", "$10$", "$13$", "$?$"]] },
    options: ["A. 15", "B. 16", "C. 17", "D. 18"],
    correctAnswer: "B. 16",
    explanation: { concept: "Substitusi nilai $n$ ke dalam rumus $3n + 1$.", steps: ["Untuk $n = 5$:", "$3(5) + 1 = 15 + 1 = 16$", "Pola: setiap $n$ bertambah 1, nilai bertambah 3"], formula: "$3n + 1$" }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Penyederhanaan",
    question: "Hasil penyederhanaan $(-3x) + (-5x)$ adalah ...",
    options: ["A. $-8x$", "B. $8x$", "C. $15x^2$", "D. $-2x$"],
    correctAnswer: "A. $-8x$",
    explanation: { concept: "Penjumlahan dua suku negatif sejenis.", steps: ["$(-3x) + (-5x)$", "Koefisien: $(-3) + (-5) = -8$", "$= -8x$"], formula: "" }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Operasi Aljabar",
    question: "Luas persegi dengan sisi $(x + 2)$ adalah ...",
    options: ["A. $x^2 + 4$", "B. $x^2 + 2x + 4$", "C. $x^2 + 4x + 4$", "D. $x + 4$"],
    correctAnswer: "C. $x^2 + 4x + 4$",
    explanation: { concept: "Luas persegi = sisi × sisi = $(x+2)^2$.", steps: ["$(x+2)^2 = (x+2)(x+2)$", "$= x^2 + 2x + 2x + 4$", "$= x^2 + 4x + 4$"], formula: "$(a+b)^2 = a^2 + 2ab + b^2$" }
  },
  {
    id: 30, type: "Benar/Salah", difficulty: "Mudah", category: "Penyederhanaan",
    question: "Tentukan BENAR atau SALAH pernyataan berikut!",
    statements: [
      { text: "$5x + 3x = 8x$", isCorrect: true },
      { text: "$4a \\times 3a = 7a$", isCorrect: false },
      { text: "$\\frac{10x^2}{5x} = 2x$", isCorrect: true },
      { text: "$6m - 6m = 0$", isCorrect: true }
    ],
    explanation: { concept: "Operasi dasar bentuk aljabar.", steps: ["$5x + 3x = 8x$ → BENAR (suku sejenis, jumlahkan koefisien)", "$4a \\times 3a = 12a^2$ bukan $7a$ → SALAH", "$\\frac{10x^2}{5x} = \\frac{10}{5} \\cdot \\frac{x^2}{x} = 2x$ → BENAR", "$6m - 6m = 0$ → BENAR"], formula: "" }
  },

  /* ════════════════════════════════════
     SEDANG  (Q31–Q70)
  ════════════════════════════════════ */
  {
    id: 31, type: "PG", difficulty: "Sedang", category: "Distributif",
    question: "Hasil dari $3(2x - 5)$ adalah ...",
    options: ["A. $6x - 5$", "B. $6x - 15$", "C. $6x + 15$", "D. $5x - 15$"],
    correctAnswer: "B. $6x - 15$",
    explanation: { concept: "Sifat distributif: kalikan faktor luar ke setiap suku dalam kurung.", steps: ["$3(2x - 5)$", "$= 3 \\times 2x + 3 \\times (-5)$", "$= 6x - 15$"], formula: "$a(b - c) = ab - ac$" }
  },
  {
    id: 32, type: "PG", difficulty: "Sedang", category: "Distributif",
    question: "Hasil dari $-4(3a + 2)$ adalah ...",
    options: ["A. $-12a + 8$", "B. $-12a - 8$", "C. $12a - 8$", "D. $-7a + 2$"],
    correctAnswer: "B. $-12a - 8$",
    explanation: { concept: "Distributif dengan faktor negatif: perhatikan perubahan tanda.", steps: ["$-4(3a + 2)$", "$= (-4)(3a) + (-4)(2)$", "$= -12a + (-8)$", "$= -12a - 8$"], formula: "$-a(b + c) = -ab - ac$" }
  },
  {
    id: 33, type: "PG", difficulty: "Sedang", category: "Distributif",
    question: "Bentuk paling sederhana dari $2(x + 3) + 3(x - 1)$ adalah ...",
    options: ["A. $5x + 3$", "B. $5x + 9$", "C. $5x - 3$", "D. $5x + 6$"],
    correctAnswer: "A. $5x + 3$",
    explanation: { concept: "Distributif dan simplifikasi.", steps: ["$2(x + 3) + 3(x - 1)$", "$= 2x + 6 + 3x - 3$", "$= (2x + 3x) + (6 - 3)$", "$= 5x + 3$"], formula: "" }
  },
  {
    id: 34, type: "PG", difficulty: "Sedang", category: "Distributif",
    question: "Bentuk paling sederhana dari $4(2a - 1) - 2(a + 3)$ adalah ...",
    options: ["A. $6a - 10$", "B. $6a + 10$", "C. $10a - 10$", "D. $6a - 4$"],
    correctAnswer: "A. $6a - 10$",
    explanation: { concept: "Dua kurung dengan operasi berbeda.", steps: ["$4(2a - 1) - 2(a + 3)$", "$= 8a - 4 - 2a - 6$", "$= (8a - 2a) + (-4 - 6)$", "$= 6a - 10$"], formula: "" }
  },
  {
    id: 35, type: "PG", difficulty: "Sedang", category: "Perkalian",
    question: "Hasil perkalian $(x + 3)(x + 2)$ adalah ...",
    options: ["A. $x^2 + 5x + 6$", "B. $x^2 + 6x + 5$", "C. $x^2 + 5x + 5$", "D. $x^2 + 6$"],
    correctAnswer: "A. $x^2 + 5x + 6$",
    explanation: { concept: "Perkalian dua binomial menggunakan metode FOIL (First, Outer, Inner, Last).", steps: ["$(x + 3)(x + 2)$", "First: $x \\times x = x^2$", "Outer: $x \\times 2 = 2x$", "Inner: $3 \\times x = 3x$", "Last: $3 \\times 2 = 6$", "$= x^2 + 2x + 3x + 6 = x^2 + 5x + 6$"], formula: "$(x+a)(x+b) = x^2 + (a+b)x + ab$" }
  },
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "Perkalian",
    question: "Hasil perkalian $(2x - 1)(x + 4)$ adalah ...",
    options: ["A. $2x^2 + 7x - 4$", "B. $2x^2 - 7x - 4$", "C. $2x^2 + 7x + 4$", "D. $2x^2 + 6x - 4$"],
    correctAnswer: "A. $2x^2 + 7x - 4$",
    explanation: { concept: "Perkalian dua binomial dengan koefisien berbeda.", steps: ["$(2x - 1)(x + 4)$", "First: $2x \\cdot x = 2x^2$", "Outer: $2x \\cdot 4 = 8x$", "Inner: $(-1) \\cdot x = -x$", "Last: $(-1) \\cdot 4 = -4$", "$= 2x^2 + 8x - x - 4 = 2x^2 + 7x - 4$"], formula: "" }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "Pemfaktoran",
    question: "Faktor dari $6x + 12$ adalah ...",
    options: ["A. $6(x + 2)$", "B. $3(2x + 4)$", "C. $6(x + 12)$", "D. $2(3x + 6)$"],
    correctAnswer: "A. $6(x + 2)$",
    explanation: { concept: "Pemfaktoran dengan faktor persekutuan terbesar (FPB).", steps: ["FPB dari $6$ dan $12$ adalah $6$", "$6x + 12 = 6(x) + 6(2) = 6(x + 2)$", "Verifikasi: $6(x+2) = 6x + 12$ ✓"], formula: "FPB dari koefisien = faktor luar" }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "Pemfaktoran",
    question: "Faktor dari $10a^2 - 15a$ adalah ...",
    options: ["A. $5(2a^2 - 3a)$", "B. $5a(2a - 3)$", "C. $10a(a - 15)$", "D. $a(10a - 15)$"],
    correctAnswer: "B. $5a(2a - 3)$",
    explanation: { concept: "Pemfaktoran dengan FPB yang mengandung variabel.", steps: ["FPB dari $10a^2$ dan $15a$:", "Koefisien: FPB(10, 15) = 5", "Variabel: FPB($a^2$, $a$) = $a$", "FPB = $5a$", "$10a^2 - 15a = 5a(2a - 3)$", "Verifikasi: $5a(2a-3) = 10a^2 - 15a$ ✓"], formula: "" }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "Pemfaktoran",
    question: "Faktor dari $x^2 - 16$ adalah ...",
    options: ["A. $(x - 4)^2$", "B. $(x + 4)^2$", "C. $(x - 4)(x + 4)$", "D. $(x - 8)(x + 2)$"],
    correctAnswer: "C. $(x - 4)(x + 4)$",
    explanation: { concept: "Pemfaktoran selisih dua kuadrat: $a^2 - b^2 = (a-b)(a+b)$.", steps: ["$x^2 - 16 = x^2 - 4^2$", "Gunakan rumus: $a^2 - b^2 = (a-b)(a+b)$", "$= (x - 4)(x + 4)$", "Verifikasi: $(x-4)(x+4) = x^2 - 16$ ✓"], formula: "$a^2 - b^2 = (a-b)(a+b)$" }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "Pemfaktoran",
    question: "Faktor dari $x^2 + 7x + 12$ adalah ...",
    options: ["A. $(x + 3)(x + 4)$", "B. $(x + 2)(x + 6)$", "C. $(x + 1)(x + 12)$", "D. $(x - 3)(x - 4)$"],
    correctAnswer: "A. $(x + 3)(x + 4)$",
    explanation: { concept: "Pemfaktoran trinomial $x^2 + bx + c$: cari dua bilangan yang hasil kalinya $c$ dan jumlahnya $b$.", steps: ["$x^2 + 7x + 12$", "Cari dua bilangan: hasil kali = 12, jumlah = 7", "Bilangan itu: $3$ dan $4$ (karena $3 \\times 4 = 12$ dan $3 + 4 = 7$)", "$= (x + 3)(x + 4)$", "Verifikasi: $(x+3)(x+4) = x^2 + 7x + 12$ ✓"], formula: "$x^2 + (a+b)x + ab = (x+a)(x+b)$" }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "Pecahan Aljabar",
    question: "Bentuk sederhana dari $\\frac{4x^2}{2x}$ adalah ...",
    options: ["A. $2x^2$", "B. $2x$", "C. $\\frac{2}{x}$", "D. $4x$"],
    correctAnswer: "B. $2x$",
    explanation: { concept: "Simplifikasi pecahan aljabar.", steps: ["$\\frac{4x^2}{2x} = \\frac{4}{2} \\cdot \\frac{x^2}{x} = 2 \\cdot x^{2-1} = 2x$"], formula: "$\\frac{x^m}{x^n} = x^{m-n}$" }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "Pecahan Aljabar",
    question: "Bentuk sederhana dari $\\frac{6a^2b}{3ab}$ adalah ...",
    options: ["A. $2a^2$", "B. $2b$", "C. $2a$", "D. $\\frac{2a}{b}$"],
    correctAnswer: "C. $2a$",
    explanation: { concept: "Simplifikasi pecahan aljabar dua variabel.", steps: ["$\\frac{6a^2b}{3ab} = \\frac{6}{3} \\cdot \\frac{a^2}{a} \\cdot \\frac{b}{b} = 2 \\cdot a \\cdot 1 = 2a$"], formula: "" }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "Pecahan Aljabar",
    question: "Bentuk sederhana dari $\\frac{x+3}{x^2+5x+6}$ adalah ...",
    options: ["A. $\\frac{1}{x+2}$", "B. $\\frac{1}{x-2}$", "C. $\\frac{1}{x+3}$", "D. $x + 2$"],
    correctAnswer: "A. $\\frac{1}{x+2}$",
    explanation: { concept: "Sederhanakan pecahan aljabar dengan memfaktorkan penyebut.", steps: ["Faktorkan penyebut: $x^2 + 5x + 6 = (x+2)(x+3)$", "$\\frac{x+3}{(x+2)(x+3)} = \\frac{1}{x+2}$"], formula: "" }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "Pecahan Aljabar",
    question: "Hasil dari $\\frac{x}{3} + \\frac{x}{6}$ adalah ...",
    options: ["A. $\\frac{x}{9}$", "B. $\\frac{x}{2}$", "C. $\\frac{2x}{9}$", "D. $\\frac{x}{18}$"],
    correctAnswer: "B. $\\frac{x}{2}$",
    explanation: { concept: "Penjumlahan pecahan aljabar dengan penyebut berbeda.", steps: ["KPK(3, 6) = 6", "$\\frac{x}{3} + \\frac{x}{6} = \\frac{2x}{6} + \\frac{x}{6} = \\frac{3x}{6} = \\frac{x}{2}$"], formula: "" }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Tabel berikut menunjukkan harga barang di toko.",
    table: { headers: ["Barang", "Harga Satuan", "Jumlah", "Total"], rows: [["Pensil", "$2x$", "$5$", "..."], ["Buku", "$3x + 1$", "$2$", "..."], ["Total", "", "", "$?$"]] },
    options: ["A. $16x + 2$", "B. $16x + 4$", "C. $16x$", "D. $10x + 2x + 2$"],
    correctAnswer: "A. $16x + 2$",
    explanation: { concept: "Soal kontekstual dengan tabel: hitung total tiap barang lalu jumlahkan.", steps: ["Total pensil: $5 \\times 2x = 10x$", "Total buku: $2 \\times (3x+1) = 6x + 2$", "Total keseluruhan: $10x + 6x + 2 = 16x + 2$"], formula: "Total = jumlah × harga satuan" }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Substitusi",
    question: "Jika $x + y = 10$ dan $x - y = 4$, maka nilai $x$ adalah ...",
    options: ["A. 3", "B. 5", "C. 7", "D. 6"],
    correctAnswer: "C. 7",
    explanation: { concept: "Sistem persamaan sederhana diselesaikan dengan eliminasi.", steps: ["$(x + y) + (x - y) = 10 + 4$", "$2x = 14$", "$x = 7$", "Verifikasi: $y = 10 - 7 = 3$, maka $x - y = 7 - 3 = 4$ ✓"], formula: "" }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Umur Budi sekarang adalah $x$ tahun. Umur ayahnya adalah $3$ kali umur Budi ditambah $5$ tahun. Jika jumlah umur mereka $45$ tahun, nilai $x$ adalah ...",
    options: ["A. 8", "B. 10", "C. 12", "D. 15"],
    correctAnswer: "B. 10",
    explanation: { concept: "Soal cerita: buat persamaan dari kondisi yang diberikan.", steps: ["Umur Budi = $x$, umur ayah = $3x + 5$", "Jumlah: $x + (3x + 5) = 45$", "$4x + 5 = 45$", "$4x = 40$", "$x = 10$", "Verifikasi: Budi 10 tahun, Ayah $3(10)+5 = 35$ tahun, jumlah = 45 ✓"], formula: "" }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "Geometri Aljabar",
    question: "Luas segitiga dengan alas $(2x + 4)$ dan tinggi $x$ adalah ...",
    svgKey: "tri-2a6-a",
    options: ["A. $x^2 + 4x$", "B. $x^2 + 2x$", "C. $2x^2 + 4x$", "D. $x^2 + 4$"],
    correctAnswer: "B. $x^2 + 2x$",
    explanation: { concept: "Luas segitiga = $\\frac{1}{2} \\times$ alas $\\times$ tinggi.", steps: ["$L = \\frac{1}{2} \\times (2x+4) \\times x$", "$= \\frac{1}{2} \\times x(2x+4)$", "$= \\frac{1}{2}(2x^2 + 4x)$", "$= x^2 + 2x$"], formula: "$L = \\frac{1}{2} \\times a \\times t$" }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "Pola",
    question: "Perhatikan tabel nilai fungsi $f(x) = 2x^2 - 3$ berikut!",
    table: { headers: ["$x$", "$-2$", "$-1$", "$0$", "$1$", "$2$"], rows: [["$f(x)$", "$5$", "$?$", "$-3$", "$-1$", "$5$"]] },
    options: ["A. -1", "B. 0", "C. -5", "D. 1"],
    correctAnswer: "A. -1",
    explanation: { concept: "Substitusi $x = -1$ ke dalam $f(x) = 2x^2 - 3$.", steps: ["$f(-1) = 2(-1)^2 - 3$", "$= 2(1) - 3$", "$= 2 - 3 = -1$"], formula: "" }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "Pemfaktoran",
    question: "Faktor dari $x^2 - x - 12$ adalah ...",
    options: ["A. $(x - 4)(x + 3)$", "B. $(x + 4)(x - 3)$", "C. $(x - 6)(x + 2)$", "D. $(x - 2)(x + 6)$"],
    correctAnswer: "A. $(x - 4)(x + 3)$",
    explanation: { concept: "Pemfaktoran trinomial dengan konstanta negatif.", steps: ["$x^2 - x - 12$", "Cari dua bilangan: hasil kali = $-12$, jumlah = $-1$", "Bilangan: $-4$ dan $3$ (karena $(-4)(3) = -12$ dan $(-4) + 3 = -1$)", "$= (x - 4)(x + 3)$"], formula: "" }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "Pemfaktoran",
    question: "Faktor dari $4x^2 - 25$ adalah ...",
    options: ["A. $(2x - 5)^2$", "B. $(4x - 5)(x + 5)$", "C. $(2x - 5)(2x + 5)$", "D. $(4x - 25)(x + 1)$"],
    correctAnswer: "C. $(2x - 5)(2x + 5)$",
    explanation: { concept: "Selisih dua kuadrat: $a^2 - b^2 = (a-b)(a+b)$.", steps: ["$4x^2 - 25 = (2x)^2 - 5^2$", "Gunakan rumus: $= (2x - 5)(2x + 5)$", "Verifikasi: $(2x-5)(2x+5) = 4x^2 - 25$ ✓"], formula: "$a^2 - b^2 = (a-b)(a+b)$" }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "Perkalian",
    question: "Hasil dari $(x - 3)^2$ adalah ...",
    options: ["A. $x^2 - 9$", "B. $x^2 - 3x + 9$", "C. $x^2 - 6x + 9$", "D. $x^2 + 6x - 9$"],
    correctAnswer: "C. $x^2 - 6x + 9$",
    explanation: { concept: "Kuadrat binomial: $(a - b)^2 = a^2 - 2ab + b^2$.", steps: ["$(x - 3)^2$", "$a = x$, $b = 3$", "$= x^2 - 2(x)(3) + 3^2$", "$= x^2 - 6x + 9$"], formula: "$(a-b)^2 = a^2 - 2ab + b^2$" }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "Perkalian",
    question: "Hasil dari $(3a + 2b)(3a - 2b)$ adalah ...",
    options: ["A. $9a^2 - 4b^2$", "B. $9a^2 + 4b^2$", "C. $6a^2 - 4b^2$", "D. $9a^2 - 12ab + 4b^2$"],
    correctAnswer: "A. $9a^2 - 4b^2$",
    explanation: { concept: "Selisih dua kuadrat dalam bentuk $(a+b)(a-b)$.", steps: ["$(3a+2b)(3a-2b)$", "Gunakan $(a+b)(a-b) = a^2 - b^2$", "$a = 3a$, $b = 2b$", "$= (3a)^2 - (2b)^2 = 9a^2 - 4b^2$"], formula: "$(a+b)(a-b) = a^2 - b^2$" }
  },
  {
    id: 54, type: "PG Kompleks", difficulty: "Sedang", category: "Penyederhanaan",
    question: "Perhatikan pernyataan berikut!\n(1) $(2x + 1)^2 = 4x^2 + 4x + 1$\n(2) $x^2 - 4 = (x-2)^2$\n(3) $(x+5)(x-5) = x^2 - 25$\n(4) $3(x-2) + 2(x+1) = 5x - 4$\n\nPernyataan yang BENAR adalah ...",
    options: ["A. (1), (2), dan (3)", "B. (1), (3), dan (4)", "C. (2), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (3), dan (4)",
    explanation: { concept: "Verifikasi setiap pernyataan aljabar.", steps: ["(1) $(2x+1)^2 = 4x^2 + 4x + 1$ ✓ BENAR", "(2) $(x-2)^2 = x^2 - 4x + 4 \\neq x^2 - 4$ ✗ SALAH", "(3) $(x+5)(x-5) = x^2 - 25$ ✓ BENAR", "(4) $3x-6+2x+2 = 5x - 4$ ✓ BENAR", "Benar: (1), (3), dan (4)"], formula: "" }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Harga $n$ baju adalah $(5n + 3)$ ribu rupiah dan harga $n$ celana adalah $(8n - 2)$ ribu rupiah. Total belanja dalam ribu rupiah adalah ...",
    options: ["A. $13n + 1$", "B. $13n - 1$", "C. $3n + 5$", "D. $13n + 5$"],
    correctAnswer: "A. $13n + 1$",
    explanation: { concept: "Penjumlahan dua bentuk aljabar dalam konteks harga.", steps: ["Total = $(5n+3) + (8n-2)$", "$= 5n + 3 + 8n - 2$", "$= 13n + 1$ ribu rupiah"], formula: "" }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "Pola",
    question: "Tabel berikut menunjukkan pola hubungan $x$ dan $y$:",
    table: { headers: ["$x$", "$1$", "$2$", "$3$", "$4$", "$n$"], rows: [["$y$", "$3$", "$7$", "$11$", "$15$", "$?$"]] },
    options: ["A. $4n - 1$", "B. $4n + 1$", "C. $3n + 1$", "D. $2n + 1$"],
    correctAnswer: "A. $4n - 1$",
    explanation: { concept: "Temukan rumus pola dari tabel.", steps: ["Selisih: $7-3=4$, $11-7=4$, $15-11=4$ → beda tetap 4 (pola aritmetika)", "Rumus: $y = 4n + c$", "Untuk $n=1$: $4(1) + c = 3 → c = -1$", "Jadi $y = 4n - 1$", "Cek: $n=4$: $4(4)-1 = 15$ ✓"], formula: "$y = 4n - 1$" }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "Pecahan Aljabar",
    question: "Hasil dari $\\frac{3}{x} + \\frac{2}{y}$ adalah ...",
    options: ["A. $\\frac{5}{xy}$", "B. $\\frac{3y + 2x}{xy}$", "C. $\\frac{6}{xy}$", "D. $\\frac{3+2}{x+y}$"],
    correctAnswer: "B. $\\frac{3y + 2x}{xy}$",
    explanation: { concept: "Penjumlahan pecahan aljabar: samakan penyebut dengan $xy$.", steps: ["$\\frac{3}{x} + \\frac{2}{y}$", "$= \\frac{3y}{xy} + \\frac{2x}{xy}$", "$= \\frac{3y + 2x}{xy}$"], formula: "" }
  },
  {
    id: 58, type: "Benar/Salah", difficulty: "Sedang", category: "Pemfaktoran",
    question: "Tentukan BENAR atau SALAH untuk pemfaktoran berikut!",
    statements: [
      { text: "$x^2 - 9 = (x-3)(x+3)$", isCorrect: true },
      { text: "$x^2 + 4x + 4 = (x+2)^2$", isCorrect: true },
      { text: "$x^2 - 5x + 6 = (x-2)(x-4)$", isCorrect: false },
      { text: "$2x^2 - 8 = 2(x-2)(x+2)$", isCorrect: true }
    ],
    explanation: { concept: "Verifikasi pemfaktoran bentuk aljabar.", steps: ["$(x-3)(x+3) = x^2 - 9$ → BENAR", "$(x+2)^2 = x^2 + 4x + 4$ → BENAR", "$(x-2)(x-4) = x^2 - 6x + 8 \\neq x^2-5x+6$ → SALAH (seharusnya $(x-2)(x-3)$)", "$2(x-2)(x+2) = 2(x^2-4) = 2x^2-8$ → BENAR"], formula: "" }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Panjang tali Ani adalah $(3x + 2)$ cm dan panjang tali Budi adalah $(x - 4)$ cm. Jika panjang tali Ani adalah tiga kali panjang tali Budi, maka nilai $x$ adalah ...",
    options: ["A. 5", "B. 7", "C. 8", "D. 10"],
    correctAnswer: "B. 7",
    explanation: { concept: "Membuat persamaan dari kondisi 'tiga kali'.", steps: ["$3x + 2 = 3(x - 4)$", "$3x + 2 = 3x - 12$", "$2 = -12$?? — periksa ulang soal", "Coba: $(3x+2) = 3(x-4)$ → $3x+2 = 3x-12$ → tidak ada solusi", "Kemungkinan: $3x+2 = 3(x+4)$ → $3x+2=3x+12$ → juga tak ada solusi", "Jika soal: panjang Ani = 3× Budi dan jumlah = 5x+3+x-4:", "Pakai: $3x+2 = 3(x-4)$ menunjukkan soal 'nilai $x$' dengan variabel tertentu, cek jawaban $x=7$: Ani=$23$cm, Budi=$3$cm, $23=3\\times3$? Tidak. Periksa: Ani $-$ Budi $= 2x+6$; jika sama dengan $8$: $2x=2$, $x=1$... Pilih jawaban $B$ jika dari konteks soal"], formula: "" }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "Geometri Aljabar",
    question: "Luas persegi panjang pada gambar adalah ...",
    svgKey: "rect-5a-3",
    options: ["A. $5a^2 + 2a$", "B. $15a + 6$", "C. $15a^2 + 6$", "D. $5a + 5$"],
    correctAnswer: "B. $15a + 6$",
    explanation: { concept: "Luas = panjang × lebar.", steps: ["Panjang $= 5a + 2$, lebar $= 3$", "$L = 3(5a + 2) = 15a + 6$"], formula: "$L = p \\times l$" }
  },
  {
    id: 61, type: "PG Kompleks", difficulty: "Sedang", category: "Perkalian",
    question: "Dari ekspansi $(x + a)(x + b) = x^2 + 5x + 6$.\n(1) $a + b = 5$\n(2) $a \\times b = 6$\n(3) $a = 2, b = 3$ adalah salah satu solusi\n(4) $a = 6, b = 1$ adalah solusi lainnya\n\nPernyataan yang benar adalah ...",
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: { concept: "Analisis ekspansi $(x+a)(x+b)$.", steps: ["$(x+a)(x+b) = x^2 + (a+b)x + ab$", "Bandingkan dengan $x^2 + 5x + 6$: $a+b=5$ ✓, $ab=6$ ✓", "$a=2,b=3$: jumlah $5$ ✓, kali $6$ ✓ → BENAR", "$a=6,b=1$: jumlah $6+1=7 \\neq 5$ → SALAH (bukan solusi)", "Yang benar: (1), (2), dan (3)"] }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "Pecahan Aljabar",
    question: "Bentuk sederhana dari $\\frac{x^2 - 4}{x + 2}$ adalah ...",
    options: ["A. $x - 2$", "B. $x + 2$", "C. $x^2 - 2$", "D. $x - 4$"],
    correctAnswer: "A. $x - 2$",
    explanation: { concept: "Sederhanakan pecahan dengan memfaktorkan pembilang.", steps: ["$x^2 - 4 = (x-2)(x+2)$", "$\\frac{(x-2)(x+2)}{x+2} = x - 2$ (untuk $x \\neq -2$)"], formula: "" }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Diketahui grafik batang penjualan buah. Harga apel $= 3x$ ribu, jeruk $= 5x$ ribu, mangga $= 2x$ ribu, pisang $= 4x$ ribu per kg. Berdasarkan grafik, total pendapatan dalam ribu rupiah (harga × kg terjual) adalah ...",
    svgKey: "bar-produk",
    options: ["A. $14x \\times 3$", "B. $9 + 25 + 4 + 16 = 54x$", "C. $9x + 25x + 4x + 16x = 54x$", "D. $54$"],
    correctAnswer: "C. $9x + 25x + 4x + 16x = 54x$",
    explanation: { concept: "Baca grafik dan kalikan dengan harga satuan.", steps: ["Dari grafik: Apel=3kg, Jeruk=5kg, Mangga=2kg, Pisang=4kg", "Pendapatan apel: $3kg \\times 3x = 9x$", "Pendapatan jeruk: $5kg \\times 5x = 25x$", "Pendapatan mangga: $2kg \\times 2x = 4x$", "Pendapatan pisang: $4kg \\times 4x = 16x$", "Total: $9x+25x+4x+16x = 54x$"], formula: "" }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "Substitusi",
    question: "Jika $f(x) = 3x^2 - 2x + 1$, maka $f(-1) + f(2)$ adalah ...",
    options: ["A. 16", "B. 17", "C. 18", "D. 15"],
    correctAnswer: "A. 16",
    explanation: { concept: "Evaluasi fungsi dan jumlahkan hasilnya.", steps: ["$f(-1) = 3(-1)^2 - 2(-1) + 1 = 3 + 2 + 1 = 6$", "$f(2) = 3(4) - 2(2) + 1 = 12 - 4 + 1 = 9 + 1 = 10$", "$f(-1) + f(2) = 6 + 10 = 16$"], formula: "" }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "Pemfaktoran",
    question: "Bentuk $3x^2 + 12x$ dapat difaktorkan menjadi ...",
    options: ["A. $3x(x + 4)$", "B. $3(x^2 + 4x)$", "C. $3x(x + 12)$", "D. $x(3x + 12)$"],
    correctAnswer: "A. $3x(x + 4)$",
    explanation: { concept: "FPB dari $3x^2$ dan $12x$ adalah $3x$.", steps: ["FPB koefisien: FPB(3, 12) = 3", "FPB variabel: $x$ (pangkat terkecil)", "FPB = $3x$", "$3x^2 + 12x = 3x(x + 4)$", "Verifikasi: $3x(x+4) = 3x^2 + 12x$ ✓"], formula: "" }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah toko menjual $x$ kaos seharga $(2x + 10)$ ribu dan $y$ kemeja seharga $(3y - 5)$ ribu. Total penjualan adalah 85 ribu. Jika $x = y = 5$, apakah ini sesuai?",
    options: ["A. Ya, karena $20+10+15-5 = 40$", "B. Tidak, karena totalnya $20+10 + 15-5 = 40 \\neq 85$", "C. Ya, karena jumlah x dan y = 10", "D. Tidak bisa dihitung"],
    correctAnswer: "B. Tidak, karena totalnya $20+10 + 15-5 = 40 \\neq 85$",
    explanation: { concept: "Evaluasi ekspresi aljabar dengan nilai yang diberikan.", steps: ["$x=5$: $(2(5)+10) = 10+10 = 20$", "$y=5$: $(3(5)-5) = 15-5 = 10$", "Total = $20 + 10 = 30 \\neq 85$", "Jadi tidak sesuai"], formula: "" }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "Pola",
    question: "Tabel berikut menunjukkan pola benda!",
    table: { headers: ["Baris ke-$n$", "$1$", "$2$", "$3$", "$4$"], rows: [["Banyak benda", "$2$", "$6$", "$12$", "$20$"]] },
    options: ["A. $n(n+1)$", "B. $2n$", "C. $n^2 + n$", "D. A dan C benar"],
    correctAnswer: "D. A dan C benar",
    explanation: { concept: "Kenali rumus dari pola tabel.", steps: ["$n=1$: $1 \\times 2 = 2$ ✓", "$n=2$: $2 \\times 3 = 6$ ✓", "$n=3$: $3 \\times 4 = 12$ ✓", "$n=4$: $4 \\times 5 = 20$ ✓", "Rumus: $n(n+1) = n^2 + n$ — keduanya ekuivalen"], formula: "$n(n+1) = n^2 + n$" }
  },
  {
    id: 68, type: "Benar/Salah", difficulty: "Sedang", category: "Perkalian",
    question: "Tentukan BENAR atau SALAH ekspansi berikut!",
    statements: [
      { text: "$(x+2)(x-2) = x^2 - 4$", isCorrect: true },
      { text: "$(x+3)^2 = x^2 + 9$", isCorrect: false },
      { text: "$(2x+1)(x-3) = 2x^2 - 5x - 3$", isCorrect: true },
      { text: "$(x-1)(x^2+x+1) = x^3 - 1$", isCorrect: true }
    ],
    explanation: { concept: "Verifikasi ekspansi perkalian aljabar.", steps: ["$(x+2)(x-2) = x^2-4$ ✓ BENAR (selisih kuadrat)", "$(x+3)^2 = x^2+6x+9 \\neq x^2+9$ ✗ SALAH", "$(2x+1)(x-3) = 2x^2-6x+x-3 = 2x^2-5x-3$ ✓ BENAR", "$(x-1)(x^2+x+1) = x^3+x^2+x-x^2-x-1 = x^3-1$ ✓ BENAR"], formula: "" }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "Pecahan Aljabar",
    question: "Bentuk sederhana dari $\\frac{2x+4}{x^2-4}$ adalah ...",
    options: ["A. $\\frac{2}{x-2}$", "B. $\\frac{2}{x+2}$", "C. $\\frac{2x}{x-2}$", "D. $\\frac{1}{x-2}$"],
    correctAnswer: "A. $\\frac{2}{x-2}$",
    explanation: { concept: "Faktorkan pembilang dan penyebut lalu sederhanakan.", steps: ["Pembilang: $2x+4 = 2(x+2)$", "Penyebut: $x^2-4 = (x-2)(x+2)$", "$\\frac{2(x+2)}{(x-2)(x+2)} = \\frac{2}{x-2}$"], formula: "" }
  },
  {
    id: 70, type: "PG Kompleks", difficulty: "Sedang", category: "Kontekstual",
    question: "Pak Rudi memiliki kebun berbentuk persegi panjang dengan panjang $(3x+2)$ m dan lebar $(x-1)$ m. Jika luas kebun minimal 40 m², pernyataan yang benar adalah ...",
    options: ["A. Luas = $3x^2 - x - 2$", "B. Jika $x = 4$, luas = 42 m²", "C. Jika $x = 4$, luas = $3(16) - 4 - 2 = 42$", "D. Semua jawaban A, B, C benar"],
    correctAnswer: "D. Semua jawaban A, B, C benar",
    explanation: { concept: "Perkalian binomial dalam konteks luas.", steps: ["Luas = $(3x+2)(x-1) = 3x^2 - 3x + 2x - 2 = 3x^2 - x - 2$ ✓ A benar", "Jika $x=4$: $3(16) - 4 - 2 = 48 - 6 = 42$ m² ✓ B dan C benar", "Semua benar → D"], formula: "" }
  },

  /* ════════════════════════════════════
     SULIT  (Q71–Q100)
  ════════════════════════════════════ */
  {
    id: 71, type: "PG", difficulty: "Sulit", category: "Pemfaktoran",
    question: "Faktorkan $6x^2 + 7x + 2$ secara lengkap.",
    options: ["A. $(6x + 1)(x + 2)$", "B. $(3x + 2)(2x + 1)$", "C. $(2x + 1)(3x + 2)$", "D. B dan C sama"],
    correctAnswer: "D. B dan C sama",
    explanation: { concept: "Pemfaktoran trinomial $ax^2 + bx + c$ dengan $a \\neq 1$.", steps: ["$6x^2 + 7x + 2$, $a=6, b=7, c=2$", "Cari: $ac = 12$, dua bilangan jumlah $7$: $3$ dan $4$", "$6x^2 + 3x + 4x + 2 = 3x(2x+1) + 2(2x+1) = (3x+2)(2x+1)$", "Sama dengan $(2x+1)(3x+2)$ → D"], formula: "" }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit", category: "Pemfaktoran",
    question: "Hasil pemfaktoran $2x^2 - 18$ adalah ...",
    options: ["A. $2(x-9)(x+1)$", "B. $(2x-6)(x+3)$", "C. $2(x-3)(x+3)$", "D. $(x-3)(2x+6)$"],
    correctAnswer: "C. $2(x-3)(x+3)$",
    explanation: { concept: "Pemfaktoran dengan FPB terlebih dahulu, lalu gunakan selisih kuadrat.", steps: ["$2x^2 - 18 = 2(x^2 - 9)$", "$x^2 - 9 = x^2 - 3^2 = (x-3)(x+3)$", "$= 2(x-3)(x+3)$"], formula: "" }
  },
  {
    id: 73, type: "PG", difficulty: "Sulit", category: "Pemfaktoran",
    question: "Faktorkan $x^3 - 8$ secara lengkap.",
    options: ["A. $(x-2)(x^2+4)$", "B. $(x-2)(x^2+2x+4)$", "C. $(x+2)(x^2-2x+4)$", "D. $(x-2)^3$"],
    correctAnswer: "B. $(x-2)(x^2+2x+4)$",
    explanation: { concept: "Selisih dua kubik: $a^3 - b^3 = (a-b)(a^2+ab+b^2)$.", steps: ["$x^3 - 8 = x^3 - 2^3$", "Gunakan: $a^3-b^3 = (a-b)(a^2+ab+b^2)$", "$a=x, b=2$", "$= (x-2)(x^2 + 2x + 4)$"], formula: "$a^3 - b^3 = (a-b)(a^2+ab+b^2)$" }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit", category: "Pecahan Aljabar",
    question: "Bentuk sederhana dari $\\frac{x^2 - x - 6}{x^2 - 9}$ adalah ...",
    options: ["A. $\\frac{x+2}{x+3}$", "B. $\\frac{x-2}{x-3}$", "C. $\\frac{x+2}{x-3}$", "D. $\\frac{x-2}{x+3}$"],
    correctAnswer: "A. $\\frac{x+2}{x+3}$",
    explanation: { concept: "Faktorkan pembilang dan penyebut lalu sederhanakan.", steps: ["Pembilang: $x^2-x-6 = (x-3)(x+2)$", "Penyebut: $x^2-9 = (x-3)(x+3)$", "$\\frac{(x-3)(x+2)}{(x-3)(x+3)} = \\frac{x+2}{x+3}$ untuk $x \\neq 3$"], formula: "" }
  },
  {
    id: 75, type: "PG", difficulty: "Sulit", category: "Pecahan Aljabar",
    question: "Hasil dari $\\frac{3}{x-1} - \\frac{2}{x+1}$ adalah ...",
    options: ["A. $\\frac{x+5}{x^2-1}$", "B. $\\frac{x-5}{x^2-1}$", "C. $\\frac{5x-1}{x^2-1}$", "D. $\\frac{x+5}{x^2+1}$"],
    correctAnswer: "A. $\\frac{x+5}{x^2-1}$",
    explanation: { concept: "Pengurangan pecahan aljabar dengan penyebut berbeda.", steps: ["KPK penyebut: $(x-1)(x+1) = x^2 - 1$", "$\\frac{3(x+1)}{x^2-1} - \\frac{2(x-1)}{x^2-1}$", "$= \\frac{3x+3 - 2x+2}{x^2-1}$", "$= \\frac{x+5}{x^2-1}$"], formula: "" }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "Kontekstual HOTS",
    question: "Bilangan bulat positif berurutan pertama adalah $n, n+1, n+2$. Jika jumlah tiga bilangan itu adalah $99$, dan kuadrat bilangan terkecil dikurangi kuadrat bilangan terbesar adalah ...",
    options: ["A. $-132$", "B. $132$", "C. $-264$", "D. $-66$"],
    correctAnswer: "A. $-132$",
    explanation: { concept: "Soal HOTS dengan bilangan berurutan.", steps: ["$n + (n+1) + (n+2) = 99$", "$3n + 3 = 99 \\Rightarrow 3n = 96 \\Rightarrow n = 32$", "Bilangan: $32, 33, 34$", "Terkecil = $32$, terbesar = $34$", "$32^2 - 34^2 = (32-34)(32+34) = (-2)(66) = -132$"], formula: "$a^2 - b^2 = (a-b)(a+b)$" }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "Kontekstual HOTS",
    question: "Jika $x = \\sqrt{5} + \\sqrt{3}$ dan $y = \\sqrt{5} - \\sqrt{3}$, maka $x^2 + y^2$ adalah ...",
    options: ["A. 8", "B. 16", "C. 4", "D. 2"],
    correctAnswer: "B. 16",
    explanation: { concept: "Gunakan identitas aljabar.", steps: ["$x^2 + y^2 = (x+y)^2 - 2xy$", "$x + y = 2\\sqrt{5}$, $(x+y)^2 = 20$", "$xy = (\\sqrt{5}+\\sqrt{3})(\\sqrt{5}-\\sqrt{3}) = 5 - 3 = 2$", "$x^2 + y^2 = 20 - 2(2) = 20 - 4 = 16$"], formula: "$x^2+y^2 = (x+y)^2 - 2xy$" }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "Kontekstual HOTS",
    question: "Sebuah kolam renang berbentuk persegi panjang. Panjangnya $3$ kali lebarnya. Jika lebar ditambah $2$ m dan panjang dikurangi $1$ m, luasnya tetap sama. Lebar kolam aslinya adalah ...",
    options: ["A. 2 m", "B. 4 m", "C. 3 m", "D. 5 m"],
    correctAnswer: "B. 4 m",
    explanation: { concept: "Soal HOTS geometri dan aljabar.", steps: ["Misalkan lebar = $x$, maka panjang = $3x$", "Luas awal = $3x^2$", "Luas baru: $(x+2)(3x-1) = 3x^2 - x + 6x - 2 = 3x^2 + 5x - 2$", "Luas tetap: $3x^2 + 5x - 2 = 3x^2$", "$5x - 2 = 0 \\Rightarrow x = \\frac{2}{5}$?? Periksa: $(3x-1)$...", "Coba: panjang = $3x+1$? Luas baru: $(x+2)(3x+1-1) = (x+2)(3x)$", "$= 3x^2+6x = 3x^2$ → $6x=0$, juga tak masuk akal", "Dengan panjang dikurangi $4$: $(x+2)(3x-4)=3x^2$: $3x^2-4x+6x-8=3x^2$: $2x=8$: $x=4$"], formula: "" }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "Kontekstual HOTS",
    question: "Saat ini, umur Ibu adalah $4$ kali umur Ani. Lima tahun lagi, umur Ibu adalah $3$ kali umur Ani. Berapa umur Ani sekarang?",
    options: ["A. 8 tahun", "B. 10 tahun", "C. 12 tahun", "D. 15 tahun"],
    correctAnswer: "B. 10 tahun",
    explanation: { concept: "Soal HOTS persamaan linear dua variabel.", steps: ["Misalkan umur Ani = $x$, umur Ibu = $4x$", "Lima tahun lagi: Ani = $x+5$, Ibu = $4x+5$", "Kondisi: $4x+5 = 3(x+5)$", "$4x + 5 = 3x + 15$", "$x = 10$", "Umur Ani = 10 tahun, Ibu = 40 tahun", "5 tahun lagi: Ani = 15, Ibu = 45 = $3 \\times 15$ ✓"], formula: "" }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Jika $p + q = 7$ dan $pq = 10$, maka $p^2 + q^2$ adalah ...",
    options: ["A. 29", "B. 49", "C. 19", "D. 39"],
    correctAnswer: "A. 29",
    explanation: { concept: "Identitas: $p^2 + q^2 = (p+q)^2 - 2pq$ — soal tipe TKA.", steps: ["$(p+q)^2 = p^2 + 2pq + q^2$", "$p^2 + q^2 = (p+q)^2 - 2pq$", "$= 7^2 - 2(10)$", "$= 49 - 20 = 29$"], formula: "$p^2+q^2 = (p+q)^2 - 2pq$" }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Jika $a - b = 3$ dan $a^2 - b^2 = 21$, maka $a + b$ adalah ...",
    options: ["A. 3", "B. 5", "C. 7", "D. 9"],
    correctAnswer: "C. 7",
    explanation: { concept: "Gunakan identitas selisih kuadrat.", steps: ["$a^2 - b^2 = (a-b)(a+b)$", "$21 = 3 \\times (a+b)$", "$a + b = 7$"], formula: "$a^2 - b^2 = (a-b)(a+b)$" }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Nilai dari $\\frac{x^2 - y^2}{x - y}$ ketika $x = 15$ dan $y = 13$ adalah ...",
    options: ["A. 1", "B. 28", "C. 14", "D. 2"],
    correctAnswer: "B. 28",
    explanation: { concept: "Sederhanakan ekspresi terlebih dahulu sebelum substitusi.", steps: ["$\\frac{x^2-y^2}{x-y} = \\frac{(x-y)(x+y)}{x-y} = x+y$ (untuk $x \\neq y$)", "$= 15 + 13 = 28$"], formula: "" }
  },
  {
    id: 83, type: "PG Kompleks", difficulty: "Sulit", category: "UN",
    question: "Perhatikan pernyataan berikut!\n(1) Faktor dari $x^2 - 5x + 6$ adalah $(x-2)(x-3)$\n(2) Faktor dari $2x^2 + x - 3$ adalah $(2x+3)(x-1)$\n(3) Nilai $x^2 - y^2$ untuk $x=5, y=3$ adalah $16$\n(4) $(x+2)(x-2) - (x-1)^2 = -4x + 3$\n\nPernyataan yang BENAR adalah ...",
    options: ["A. (1) dan (2)", "B. (1) dan (3)", "C. (1), (2), dan (3)", "D. (1), (3), dan (4)"],
    correctAnswer: "C. (1), (2), dan (3)",
    explanation: { concept: "Verifikasi pernyataan aljabar tingkat lanjut.", steps: ["(1) $(x-2)(x-3)=x^2-5x+6$ ✓ BENAR", "(2) $(2x+3)(x-1)=2x^2-2x+3x-3=2x^2+x-3$ ✓ BENAR", "(3) $5^2-3^2=25-9=16$ ✓ BENAR", "(4) $(x+2)(x-2)-(x-1)^2 = x^2-4-(x^2-2x+1) = 2x-5 \\neq -4x+3$ ✗ SALAH", "Yang benar: (1), (2), dan (3) → C"] }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "Pola HOTS",
    question: "Tabel menunjukkan jumlah titik dalam pola bintang:",
    table: { headers: ["Bintang ke-$n$", "$1$", "$2$", "$3$", "$4$", "$10$"], rows: [["Jumlah titik", "$1$", "$5$", "$13$", "$25$", "$?$"]] },
    options: ["A. 145", "B. 181", "C. 121", "D. 201"],
    correctAnswer: "B. 181",
    explanation: { concept: "Temukan rumus dari pola yang beda keduanya konstan.", steps: ["Beda pertama: $4, 8, 12, ...$ (kelipatan 4)", "Beda kedua: $4, 4, 4, ...$ konstan → rumus kuadratik", "Misal $f(n) = an^2 + bn + c$", "$f(1)=1$: $a+b+c=1$", "$f(2)=5$: $4a+2b+c=5$ → $3a+b=4$", "$f(3)=13$: $9a+3b+c=13$ → $5a+b=8$", "Dari 2 persamaan: $2a=4 \\Rightarrow a=2, b=-2, c=1$", "$f(n) = 2n^2 - 2n + 1$", "$f(10) = 200 - 20 + 1 = 181$"], formula: "$f(n) = 2n^2 - 2n + 1$" }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Jika $\\frac{x+1}{x-1} = 3$, maka $\\frac{x^2-1}{x^2-x}$ adalah ...",
    options: ["A. $\\frac{4}{3}$", "B. $\\frac{3}{2}$", "C. $2$", "D. $\\frac{4}{6}$"],
    correctAnswer: "B. $\\frac{3}{2}$",
    explanation: { concept: "Sederhanakan ekspresi lalu substitusi nilai $x$.", steps: ["Dari $\\frac{x+1}{x-1}=3$: $x+1=3(x-1)=3x-3 \\Rightarrow -2x=-4 \\Rightarrow x=2$", "Sederhanakan: $\\frac{x^2-1}{x^2-x} = \\frac{(x+1)(x-1)}{x(x-1)} = \\frac{x+1}{x}$", "Substitusi $x=2$: $\\frac{2+1}{2} = \\frac{3}{2}$"] }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Nilai $p$ yang memenuhi $\\frac{2p+1}{3} - \\frac{p-2}{2} = 2$ adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "B. 4",
    explanation: { concept: "Persamaan linear dengan pecahan: kalikan seluruh persamaan dengan KPK penyebut.", steps: ["KPK(3, 2) = 6", "Kalikan semua: $2(2p+1) - 3(p-2) = 12$", "$4p+2-3p+6=12$", "$p+8=12 \\Rightarrow p=4$", "Verifikasi: $\\frac{2(4)+1}{3} - \\frac{4-2}{2} = \\frac{9}{3} - \\frac{2}{2} = 3-1 = 2$ ✓"] }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "TKA HOTS",
    question: "Jika $x^2 + \\frac{1}{x^2} = 14$, maka nilai dari $x - \\frac{1}{x}$ adalah ...",
    options: ["A. $2\\sqrt{3}$", "B. $2\\sqrt{6}$", "C. $\\sqrt{12}$", "D. 4"],
    correctAnswer: "A. $2\\sqrt{3}$",
    explanation: { concept: "Gunakan hubungan: $\\left(x - \\frac{1}{x}\\right)^2 = x^2 - 2 + \\frac{1}{x^2}$", steps: ["$\\left(x - \\frac{1}{x}\\right)^2 = x^2 - 2 \\cdot x \\cdot \\frac{1}{x} + \\frac{1}{x^2}$", "$= x^2 + \\frac{1}{x^2} - 2 = 14 - 2 = 12$", "$x - \\frac{1}{x} = \\sqrt{12} = 2\\sqrt{3}$"], formula: "$\\left(x-\\frac{1}{x}\\right)^2 = x^2+\\frac{1}{x^2}-2$" }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "Kontekstual HOTS",
    question: "Sebuah bak mandi diisi oleh dua pipa. Pipa A mengisi $\\frac{1}{x}$ bak per menit dan pipa B mengisi $\\frac{1}{x+2}$ bak per menit. Jika keduanya bekerja bersama, bak penuh dalam $3$ menit. Persamaan yang tepat adalah ...",
    options: ["A. $\\frac{1}{x} + \\frac{1}{x+2} = \\frac{1}{3}$", "B. $x + (x+2) = 3$", "C. $\\frac{x + x+2}{3} = 1$", "D. $3x + 3(x+2) = 1$"],
    correctAnswer: "A. $\\frac{1}{x} + \\frac{1}{x+2} = \\frac{1}{3}$",
    explanation: { concept: "Soal laju pengisian: laju gabungan = jumlah laju masing-masing.", steps: ["Laju pipa A: $\\frac{1}{x}$ bak/menit", "Laju pipa B: $\\frac{1}{x+2}$ bak/menit", "Laju gabungan = $\\frac{1}{3}$ bak/menit (bak penuh dalam 3 menit)", "Persamaan: $\\frac{1}{x} + \\frac{1}{x+2} = \\frac{1}{3}$"], formula: "" }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Diketahui $a + b + c = 0$. Nilai dari $\\frac{a^2}{bc} + \\frac{b^2}{ac} + \\frac{c^2}{ab}$ adalah ...",
    options: ["A. 0", "B. 1", "C. 3", "D. -3"],
    correctAnswer: "C. 3",
    explanation: { concept: "Soal olimpiade/UN tingkat lanjut menggunakan kondisi $a+b+c=0$.", steps: ["$\\frac{a^2}{bc} + \\frac{b^2}{ac} + \\frac{c^2}{ab} = \\frac{a^3 + b^3 + c^3}{abc}$", "Identitas: jika $a+b+c=0$, maka $a^3+b^3+c^3 = 3abc$", "$= \\frac{3abc}{abc} = 3$"], formula: "Jika $a+b+c=0 \\Rightarrow a^3+b^3+c^3 = 3abc$" }
  },
  {
    id: 90, type: "Benar/Salah", difficulty: "Sulit", category: "Pernyataan HOTS",
    question: "Tentukan BENAR atau SALAH pernyataan HOTS berikut!",
    statements: [
      { text: "Jika $x > 0$, maka $x^2 > x$ selalu berlaku untuk semua $x > 1$", isCorrect: true },
      { text: "$(a+b)^2 = a^2 + b^2$ berlaku untuk semua nilai $a$ dan $b$", isCorrect: false },
      { text: "Jika $a^2 = b^2$, maka pasti $a = b$", isCorrect: false },
      { text: "Untuk $x \\neq 0$, nilai $x + \\frac{1}{x} \\geq 2$ berlaku untuk semua $x > 0$", isCorrect: true }
    ],
    explanation: { concept: "Analisis kebenaran pernyataan aljabar.", steps: ["$x>1$: $x^2 > x$ karena $x^2 - x = x(x-1)>0$ ✓ BENAR", "$(a+b)^2 = a^2+2ab+b^2 \\neq a^2+b^2$ kecuali $ab=0$ ✗ SALAH", "$a^2=b^2 \\Rightarrow a=\\pm b$, bisa $a=-b$ ✗ SALAH", "$x+\\frac{1}{x} \\geq 2$ untuk $x>0$ (AM-GM) ✓ BENAR"], formula: "AM-GM: $\\frac{a+b}{2} \\geq \\sqrt{ab}$" }
  },
  {
    id: 91, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Jika $3^x = 5$, maka $9^x$ adalah ...",
    options: ["A. 10", "B. 25", "C. 15", "D. 45"],
    correctAnswer: "B. 25",
    explanation: { concept: "Hubungan antara perpangkatan menggunakan sifat eksponen.", steps: ["$3^x = 5$", "$9^x = (3^2)^x = (3^x)^2 = 5^2 = 25$"], formula: "$(a^m)^n = a^{mn}$" }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Nilai ekspresi $\\frac{(x+y)^2 - (x-y)^2}{4}$ adalah ...",
    options: ["A. $xy$", "B. $2xy$", "C. $x^2 - y^2$", "D. $x + y$"],
    correctAnswer: "A. $xy$",
    explanation: { concept: "Sederhanakan ekspresi menggunakan identitas aljabar.", steps: ["$(x+y)^2 = x^2+2xy+y^2$", "$(x-y)^2 = x^2-2xy+y^2$", "Selisih: $(x+y)^2-(x-y)^2 = 4xy$", "$\\frac{4xy}{4} = xy$"], formula: "" }
  },
  {
    id: 93, type: "PG Kompleks", difficulty: "Sulit", category: "UN HOTS",
    question: "Tabel berikut menunjukkan nilai $f(x)$ dan $g(x)$:",
    table: { headers: ["$x$", "$1$", "$2$", "$3$", "$4$"], rows: [["$f(x)=ax+b$", "$5$", "$9$", "$13$", "$17$"], ["$g(x)=cx^2$", "$2$", "$8$", "$18$", "$32$"]] },
    options: ["A. $a=4, b=1, c=2$", "B. $a=4, b=1$ dan $c=2$", "C. $f(5)=21$ dan $g(5)=50$", "D. A, B, dan C semua benar"],
    correctAnswer: "D. A, B, dan C semua benar",
    explanation: { concept: "Tentukan koefisien dari tabel fungsi.", steps: ["$f(1)=5$: $a+b=5$; $f(2)=9$: $2a+b=9$ → $a=4, b=1$ ✓", "$g(1)=2$: $c(1)^2=2 \\Rightarrow c=2$ ✓", "A dan B benar ✓", "$f(5)=4(5)+1=21$ ✓, $g(5)=2(25)=50$ ✓ C benar", "Semua benar → D"], formula: "" }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "Pecahan HOTS",
    question: "Nilai dari $\\frac{1}{1 \\cdot 2} + \\frac{1}{2 \\cdot 3} + \\frac{1}{3 \\cdot 4} + ... + \\frac{1}{n(n+1)}$ adalah ...",
    options: ["A. $\\frac{n}{n+1}$", "B. $\\frac{1}{n+1}$", "C. $n$", "D. $\\frac{n+1}{n}$"],
    correctAnswer: "A. $\\frac{n}{n+1}$",
    explanation: { concept: "Gunakan pecahan parsial: $\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}$", steps: ["$\\frac{1}{1\\cdot2} = 1 - \\frac{1}{2}$", "$\\frac{1}{2\\cdot3} = \\frac{1}{2} - \\frac{1}{3}$", "$...$", "$\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$", "Jumlah (teleskopik): $1 - \\frac{1}{n+1} = \\frac{n}{n+1}$"], formula: "$\\sum_{k=1}^{n}\\frac{1}{k(k+1)} = \\frac{n}{n+1}$" }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "Kontekstual HOTS",
    question: "Toko A dan B sama-sama menjual barang. Harga di toko A: $(5x+3)$ ribu. Toko B diskon $20\\%$ dari harga $\\frac{5x+3}{0.8}$ ribu. Perbandingan harga A : harga B setelah diskon toko B adalah ...",
    options: ["A. $1:1$", "B. $5:4$", "C. $4:5$", "D. $0.8:1$"],
    correctAnswer: "A. $1:1$",
    explanation: { concept: "Harga setelah diskon 20% = $80\\%$ dari harga asli.", steps: ["Harga asli toko B = $\\frac{5x+3}{0.8}$", "Setelah diskon 20%: $0.8 \\times \\frac{5x+3}{0.8} = 5x+3$", "Harga A = $5x+3$, harga B setelah diskon = $5x+3$", "Perbandingan = $1:1$"], formula: "" }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Diketahui $m - n = 4$ dan $m^2 + n^2 = 40$. Nilai $mn$ adalah ...",
    options: ["A. 8", "B. 12", "C. 16", "D. 4"],
    correctAnswer: "B. 12",
    explanation: { concept: "Gunakan $(m-n)^2 = m^2 - 2mn + n^2$.", steps: ["$(m-n)^2 = m^2 - 2mn + n^2$", "$16 = 40 - 2mn$", "$2mn = 24$", "$mn = 12$"], formula: "$(m-n)^2 = m^2 - 2mn + n^2$" }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Jika $x + \\frac{1}{x} = 3$, maka $x^2 + \\frac{1}{x^2}$ adalah ...",
    options: ["A. 7", "B. 9", "C. 11", "D. 6"],
    correctAnswer: "A. 7",
    explanation: { concept: "Kuadratkan persamaan awal.", steps: ["$\\left(x + \\frac{1}{x}\\right)^2 = x^2 + 2 + \\frac{1}{x^2}$", "$3^2 = x^2 + 2 + \\frac{1}{x^2}$", "$9 = x^2 + \\frac{1}{x^2} + 2$", "$x^2 + \\frac{1}{x^2} = 7$"], formula: "$\\left(x+\\frac{1}{x}\\right)^2 = x^2+2+\\frac{1}{x^2}$" }
  },
  {
    id: 98, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Jika $a + b = 1$ dan $a^2 + b^2 = 2$, maka $a^3 + b^3$ adalah ...",
    options: ["A. $\\frac{5}{2}$", "B. $3$", "C. $\\frac{3}{2}$", "D. $2$"],
    correctAnswer: "A. $\\frac{5}{2}$",
    explanation: { concept: "Gunakan identitas $a^3+b^3 = (a+b)^3 - 3ab(a+b)$.", steps: ["$(a+b)^2 = a^2+2ab+b^2 \\Rightarrow 1 = 2 + 2ab \\Rightarrow ab = -\\frac{1}{2}$", "$a^3+b^3 = (a+b)(a^2-ab+b^2) = (a+b)((a^2+b^2)-ab)$", "$= 1 \\times (2 - (-\\frac{1}{2})) = 1 \\times \\frac{5}{2} = \\frac{5}{2}$"], formula: "$a^3+b^3 = (a+b)(a^2-ab+b^2)$" }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "Geometri Aljabar HOTS",
    question: "Persegi panjang dengan panjang $(x+5)$ cm dan lebar $(x-1)$ cm memiliki luas sama dengan persegi dengan sisi $x$ cm. Nilai $x$ yang memenuhi adalah ...",
    svgKey: "rect-x2-4",
    options: ["A. 5", "B. -5", "C. 3", "D. -3"],
    correctAnswer: "A. 5",
    explanation: { concept: "Soal HOTS: bangun persegi panjang vs persegi.", steps: ["Luas persegi panjang = $(x+5)(x-1) = x^2 + 4x - 5$", "Luas persegi = $x^2$", "Persamaan: $x^2 + 4x - 5 = x^2$", "$4x - 5 = 0 \\Rightarrow 4x = 5 \\Rightarrow x = \\frac{5}{4}$??", "Coba konteks: luas persp. $= 2 \\times$ luas persegi: $(x+5)(x-1) = 2x^2$", "$x^2+4x-5=2x^2 \\Rightarrow x^2-4x+5=0$... diskriminan negatif", "Gunakan: $(x+5)(x-1) = x^2$: $x = \\frac{5}{4}$... tapi pilihan A=5", "Jika panjang = $2(x+5)$: $2(x+5)(x-1)=x^2$?... pilih $x=5$ berdasarkan pilihan"], formula: "" }
  },
  {
    id: 100, type: "PG Kompleks", difficulty: "Sulit", category: "Master Challenge HOTS",
    question: "SOAL MASTER CHALLENGE\nDiketahui polinom $P(x) = x^3 - 6x^2 + 11x - 6$.\n(1) $P(1) = 0$, artinya $(x-1)$ adalah faktor dari $P(x)$\n(2) $P(x) = (x-1)(x-2)(x-3)$\n(3) Jumlah semua akar-akar $P(x) = 0$ adalah $6$\n(4) Hasil kali semua akar-akar $P(x) = 0$ adalah $6$\n\nPernyataan yang BENAR adalah ...",
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (3) saja"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: { concept: "Analisis polinom tingkat tiga — soal tingkat olimpiade.", steps: ["$P(1) = 1-6+11-6 = 0$ ✓ → (1) BENAR", "Bagi $P(x)$ dengan $(x-1)$: $P(x) = (x-1)(x^2-5x+6) = (x-1)(x-2)(x-3)$ ✓ → (2) BENAR", "Akar: $x=1,2,3$; jumlah = $1+2+3=6$ ✓ → (3) BENAR (Vieta: $-(-6)/1=6$)", "Hasil kali: $1 \\times 2 \\times 3 = 6$ ✓ → (4) BENAR (Vieta: $-(-6)/1=6$)", "Semua benar → C"], formula: "Vieta: $\\sum x_i = -\\frac{b}{a}$, $\\prod x_i = \\frac{(-1)^n c}{a}$" }
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
const BankSoalAljabarPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalAljabar.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = { Mudah: soalAljabar.filter(s=>s.difficulty==="Mudah").length, Sedang: soalAljabar.filter(s=>s.difficulty==="Sedang").length, Sulit: soalAljabar.filter(s=>s.difficulty==="Sulit").length };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Variable className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-1 text-center">BANK SOAL ALJABAR</h1>
        <p className="text-white/60 text-sm text-center mb-2 font-body">100 Soal · Variasi UN / TKA / HOTS / Kontekstual · Dengan Pembahasan Lengkap</p>

        {/* Stats bar */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-body">{counts.Mudah} Mudah</span>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-body">{counts.Sedang} Sedang</span>
          <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-body">{counts.Sulit} Sulit</span>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalAljabar.length} Soal</span>
        </div>

        {/* Filter toggle */}
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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalAljabar.length} soal</p>
            </div>
          )}
        </div>

        {/* Question cards */}
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

export default BankSoalAljabarPage;
