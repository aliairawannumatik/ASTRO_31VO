import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Zap, ChevronDown, ChevronUp, Filter } from "lucide-react";
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
const NilaiPangkatSVG = ({ base, exp, result }: { base: string; exp: string; result: string }) => (
  <svg viewBox="0 0 300 110" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="280" height="90" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <rect x="25" y="25" width="80" height="60" rx="6" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.5"/>
    <text x="65" y="50" fill="#fde68a" fontSize="20" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{base}</text>
    <text x="86" y="36" fill="#fbbf24" fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{exp}</text>
    <text x="140" y="60" fill="#64748b" fontSize="20" textAnchor="middle" fontFamily="monospace">=</text>
    <rect x="175" y="25" width="100" height="60" rx="6" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="225" y="62" fill="#22d3ee" fontSize="22" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{result}</text>
    <text x="155" y="97" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">{base} dipangkatkan {exp}</text>
  </svg>
);

const SifatPangkatSVG = ({ label, left, right, color }: { label: string; left: string; right: string; color: string }) => {
  const c = color === "cyan" ? { stroke: "#06b6d4", fill: "rgba(6,182,212,0.15)", text: "#22d3ee" }
          : color === "violet" ? { stroke: "#8b5cf6", fill: "rgba(139,92,246,0.15)", text: "#c084fc" }
          : color === "amber" ? { stroke: "#f59e0b", fill: "rgba(245,158,11,0.15)", text: "#fbbf24" }
          : { stroke: "#22c55e", fill: "rgba(34,197,94,0.15)", text: "#4ade80" };
  return (
    <svg viewBox="0 0 300 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <rect x="10" y="10" width="280" height="80" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
      <text x="150" y="28" fill={c.text} fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label}</text>
      <rect x="20" y="33" width="120" height="38" rx="5" fill={c.fill} stroke={c.stroke} strokeWidth="1.5"/>
      <text x="80" y="57" fill="var(--icon-color)" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{left}</text>
      <text x="155" y="57" fill="#64748b" fontSize="16" textAnchor="middle" fontFamily="monospace">=</text>
      <rect x="165" y="33" width="115" height="38" rx="5" fill={c.fill} stroke={c.stroke} strokeWidth="1.5"/>
      <text x="222" y="57" fill="var(--icon-color)" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{right}</text>
    </svg>
  );
};

const PangkatNegatifSVG = ({ base, exp, num, den }: { base: string; exp: string; num: string; den: string }) => (
  <svg viewBox="0 0 300 120" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="280" height="100" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <text x="65" y="62" fill="#fde68a" fontSize="24" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{base}</text>
    <text x="90" y="44" fill="#f87171" fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{exp}</text>
    <text x="135" y="64" fill="#64748b" fontSize="18" textAnchor="middle" fontFamily="monospace">=</text>
    <text x="165" y="50" fill="#22d3ee" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{num}</text>
    <line x1="150" y1="62" x2="220" y2="62" stroke="#64748b" strokeWidth="1.5"/>
    <text x="165" y="78" fill="#22d3ee" fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{den}</text>
    <text x="150" y="100" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Pangkat negatif = kebalikan pangkat positif</text>
  </svg>
);

const PangkatNolSVG = ({ base }: { base: string }) => (
  <svg viewBox="0 0 260 90" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="240" height="70" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <rect x="25" y="22" width="90" height="46" rx="5" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.5"/>
    <text x="70" y="52" fill="#fde68a" fontSize="22" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{base}</text>
    <text x="95" y="33" fill="#fbbf24" fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">0</text>
    <text x="140" y="52" fill="#64748b" fontSize="18" textAnchor="middle" fontFamily="monospace">=</text>
    <rect x="160" y="22" width="75" height="46" rx="5" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="197" y="52" fill="#4ade80" fontSize="26" textAnchor="middle" fontFamily="monospace" fontWeight="bold">1</text>
  </svg>
);

const PerbandinganPangkatSVG = ({ a, b, expA, expB, resA, resB }: { a: string; b: string; expA: string; expB: string; resA: string; resB: string }) => (
  <svg viewBox="0 0 300 120" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="280" height="100" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <rect x="20" y="25" width="118" height="55" rx="5" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="79" y="46" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace">{a}<tspan baselineShift="super" fontSize="9">{expA}</tspan> = {resA}</text>
    <text x="79" y="68" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Basis {a}</text>
    <rect x="162" y="25" width="118" height="55" rx="5" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="221" y="46" fill="#c084fc" fontSize="11" textAnchor="middle" fontFamily="monospace">{b}<tspan baselineShift="super" fontSize="9">{expB}</tspan> = {resB}</text>
    <text x="221" y="68" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Basis {b}</text>
    <text x="150" y="53" fill="#64748b" fontSize="14" textAnchor="middle">vs</text>
    <text x="150" y="101" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Bandingkan nilai pangkat</text>
  </svg>
);

const NotasiIlmiahSVG = ({ angka, notasi }: { angka: string; notasi: string }) => (
  <svg viewBox="0 0 300 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="280" height="80" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <rect x="20" y="22" width="120" height="46" rx="5" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="80" y="50" fill="#fde68a" fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{angka}</text>
    <text x="80" y="62" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Bilangan Biasa</text>
    <text x="155" y="50" fill="#64748b" fontSize="16" textAnchor="middle" fontFamily="monospace">⟺</text>
    <rect x="165" y="22" width="120" height="46" rx="5" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="225" y="50" fill="#22d3ee" fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{notasi}</text>
    <text x="225" y="62" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Notasi Ilmiah</text>
    <text x="150" y="88" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">a × 10ⁿ, 1 ≤ a {"<"} 10</text>
  </svg>
);

const AkarKuadratSVG = ({ angka, akar }: { angka: string; akar: string }) => (
  <svg viewBox="0 0 280 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="260" height="80" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <rect x="25" y="23" width="90" height="44" rx="5" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="70" y="50" fill="#4ade80" fontSize="20" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{angka}</text>
    <text x="70" y="62" fill="#86efac" fontSize="8" textAnchor="middle" fontFamily="monospace">Bilangan</text>
    <text x="145" y="52" fill="#64748b" fontSize="16" textAnchor="middle" fontFamily="monospace">→</text>
    <text x="145" y="63" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">√</text>
    <rect x="170" y="23" width="90" height="44" rx="5" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.5"/>
    <text x="215" y="50" fill="#fde68a" fontSize="20" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{akar}</text>
    <text x="215" y="62" fill="#fcd34d" fontSize="8" textAnchor="middle" fontFamily="monospace">Akar Kuadrat</text>
    <text x="140" y="87" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">√{angka} = {akar} karena {akar}² = {angka}</text>
  </svg>
);

const GrafikPangkatSVG = () => (
  <svg viewBox="0 0 300 130" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="0" y="0" width="300" height="130" rx="6" fill="rgba(0,0,0,0.2)"/>
    <text x="150" y="18" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Perbandingan Pertumbuhan: 2ⁿ vs n²</text>
    <line x1="40" y1="25" x2="40" y2="115" stroke="#334155" strokeWidth="1"/>
    <line x1="40" y1="115" x2="280" y2="115" stroke="#334155" strokeWidth="1"/>
    <text x="45" y="113" fill="#64748b" fontSize="6.5" fontFamily="monospace">0</text>
    <text x="85" y="113" fill="#64748b" fontSize="6.5" fontFamily="monospace">1</text>
    <text x="125" y="113" fill="#64748b" fontSize="6.5" fontFamily="monospace">2</text>
    <text x="165" y="113" fill="#64748b" fontSize="6.5" fontFamily="monospace">3</text>
    <text x="205" y="113" fill="#64748b" fontSize="6.5" fontFamily="monospace">4</text>
    <text x="245" y="113" fill="#64748b" fontSize="6.5" fontFamily="monospace">5</text>
    <polyline points="45,110 85,102 125,78 165,55 205,24 245,25" fill="none" stroke="#06b6d4" strokeWidth="2"/>
    <text x="248" y="22" fill="#06b6d4" fontSize="7" fontFamily="monospace">2ⁿ</text>
    <polyline points="45,110 85,108 125,100 165,86 205,70 245,48" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2"/>
    <text x="248" y="46" fill="#f59e0b" fontSize="7" fontFamily="monospace">n²</text>
    <text x="150" y="127" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Eksponensial tumbuh lebih cepat dari kuadrat</text>
  </svg>
);

const visualMap: Record<string, React.ReactNode> = {
  "pangkat-2-3": <NilaiPangkatSVG base="2" exp="3" result="8" />,
  "pangkat-3-4": <NilaiPangkatSVG base="3" exp="4" result="81" />,
  "pangkat-5-2": <NilaiPangkatSVG base="5" exp="2" result="25" />,
  "pangkat-2-8": <NilaiPangkatSVG base="2" exp="8" result="256" />,
  "pangkat-4-3": <NilaiPangkatSVG base="4" exp="3" result="64" />,
  "pangkat-10-3": <NilaiPangkatSVG base="10" exp="3" result="1.000" />,
  "pangkat-nol-5": <PangkatNolSVG base="5" />,
  "pangkat-nol-x": <PangkatNolSVG base="x" />,
  "sifat-kali": <SifatPangkatSVG label="Sifat Perkalian Pangkat" left="aᵐ × aⁿ" right="aᵐ⁺ⁿ" color="cyan" />,
  "sifat-bagi": <SifatPangkatSVG label="Sifat Pembagian Pangkat" left="aᵐ ÷ aⁿ" right="aᵐ⁻ⁿ" color="violet" />,
  "sifat-pangkat": <SifatPangkatSVG label="Sifat Pangkat dari Pangkat" left="(aᵐ)ⁿ" right="aᵐˣⁿ" color="amber" />,
  "negatif-2": <PangkatNegatifSVG base="2" exp="-3" num="1" den="8" />,
  "negatif-3": <PangkatNegatifSVG base="3" exp="-2" num="1" den="9" />,
  "negatif-5": <PangkatNegatifSVG base="5" exp="-2" num="1" den="25" />,
  "perbandingan-2-3": <PerbandinganPangkatSVG a="2" b="3" expA="5" expB="3" resA="32" resB="27" />,
  "notasi-ilmiah-1": <NotasiIlmiahSVG angka="360.000.000" notasi="3,6 × 10⁸" />,
  "notasi-ilmiah-2": <NotasiIlmiahSVG angka="0,000047" notasi="4,7 × 10⁻⁵" />,
  "akar-kuadrat-144": <AkarKuadratSVG angka="144" akar="12" />,
  "akar-kuadrat-225": <AkarKuadratSVG angka="225" akar="15" />,
  "grafik-pangkat": <GrafikPangkatSVG />,
};

const soalBilanganBerpangkat: Question[] = [
  /* ═══════════════════════════════════════════
     MUDAH  (Q1 – Q35)
  ═══════════════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "UN – Nilai Pangkat",
    question: "Nilai dari $2^3$ adalah ...",
    svgKey: "pangkat-2-3",
    options: ["A. 5", "B. 6", "C. 8", "D. 9"],
    correctAnswer: "C. 8",
    explanation: {
      concept: "Bilangan berpangkat berarti bilangan dikalikan dengan dirinya sendiri sebanyak pangkatnya.",
      steps: ["$2^3 = 2 \\times 2 \\times 2$", "$= 4 \\times 2 = 8$"],
      formula: "a^n = \\underbrace{a \\times a \\times \\cdots \\times a}_{n\\text{ kali}}"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "UN – Nilai Pangkat",
    question: "Hasil dari $5^2$ adalah ...",
    svgKey: "pangkat-5-2",
    options: ["A. 10", "B. 20", "C. 25", "D. 30"],
    correctAnswer: "C. 25",
    explanation: {
      concept: "$5^2$ berarti 5 dikali dirinya sendiri sebanyak 2 kali.",
      steps: ["$5^2 = 5 \\times 5 = 25$"],
      formula: "5^2 = 25"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "UN – Nilai Pangkat",
    question: "Nilai $3^4$ adalah ...",
    svgKey: "pangkat-3-4",
    options: ["A. 12", "B. 64", "C. 81", "D. 72"],
    correctAnswer: "C. 81",
    explanation: {
      concept: "$3^4$ berarti 3 dikali empat kali.",
      steps: ["$3^4 = 3 \\times 3 \\times 3 \\times 3$", "$= 9 \\times 9 = 81$"],
      formula: "3^4 = 81"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "UN – Pangkat Nol",
    question: "Nilai dari $7^0$ adalah ...",
    svgKey: "pangkat-nol-5",
    options: ["A. 0", "B. 1", "C. 7", "D. 49"],
    correctAnswer: "B. 1",
    explanation: {
      concept: "Setiap bilangan bukan nol yang berpangkat 0 sama dengan 1.",
      steps: ["$a^0 = 1$ untuk $a \\neq 0$", "$7^0 = 1$"],
      formula: "a^0 = 1 \\quad (a \\neq 0)"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "UN – Pangkat Negatif",
    question: "Nilai dari $2^{-3}$ adalah ...",
    svgKey: "negatif-2",
    options: ["A. $-8$", "B. $-6$", "C. $\\dfrac{1}{6}$", "D. $\\dfrac{1}{8}$"],
    correctAnswer: "D. $\\dfrac{1}{8}$",
    explanation: {
      concept: "Pangkat negatif artinya kebalikan dari pangkat positif.",
      steps: ["$2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8}$"],
      formula: "a^{-n} = \\dfrac{1}{a^n}"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "UN – Sifat Perkalian",
    question: "Hasil dari $2^3 \\times 2^4$ adalah ...",
    svgKey: "sifat-kali",
    options: ["A. $2^7$", "B. $2^{12}$", "C. $4^7$", "D. $4^{12}$"],
    correctAnswer: "A. $2^7$",
    explanation: {
      concept: "Perkalian dua bilangan berpangkat dengan basis sama: eksponen dijumlahkan.",
      steps: ["$2^3 \\times 2^4 = 2^{3+4} = 2^7$", "$2^7 = 128$"],
      formula: "a^m \\times a^n = a^{m+n}"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "UN – Sifat Pembagian",
    question: "Hasil dari $3^6 \\div 3^2$ adalah ...",
    svgKey: "sifat-bagi",
    options: ["A. $3^3$", "B. $3^4$", "C. $3^8$", "D. $9^4$"],
    correctAnswer: "B. $3^4$",
    explanation: {
      concept: "Pembagian dua bilangan berpangkat dengan basis sama: eksponen dikurangkan.",
      steps: ["$3^6 \\div 3^2 = 3^{6-2} = 3^4$", "$3^4 = 81$"],
      formula: "a^m \\div a^n = a^{m-n}"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "UN – Nilai Pangkat",
    question: "Nilai dari $10^3$ adalah ...",
    svgKey: "pangkat-10-3",
    options: ["A. 30", "B. 300", "C. 1.000", "D. 10.000"],
    correctAnswer: "C. 1.000",
    explanation: {
      concept: "$10^n$ berarti 1 diikuti n angka nol.",
      steps: ["$10^3 = 10 \\times 10 \\times 10 = 1.000$"],
      formula: "10^n = \\underbrace{1\\overbrace{0\\cdots0}^n}"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "UN – Akar Kuadrat",
    question: "Nilai $\\sqrt{144}$ adalah ...",
    svgKey: "akar-kuadrat-144",
    options: ["A. 11", "B. 12", "C. 13", "D. 14"],
    correctAnswer: "B. 12",
    explanation: {
      concept: "$\\sqrt{a} = b$ artinya $b^2 = a$.",
      steps: ["Cari $b$ sehingga $b^2 = 144$", "$12^2 = 144$ ✓", "Jadi $\\sqrt{144} = 12$"],
      formula: "\\sqrt{144} = 12"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "UN – Akar Kuadrat",
    question: "Hasil dari $\\sqrt{225}$ adalah ...",
    svgKey: "akar-kuadrat-225",
    options: ["A. 13", "B. 14", "C. 15", "D. 16"],
    correctAnswer: "C. 15",
    explanation: {
      concept: "Cari bilangan yang dikuadratkan menghasilkan 225.",
      steps: ["$15^2 = 225$ ✓", "$\\sqrt{225} = 15$"],
      formula: "\\sqrt{225} = 15"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "UN – Sifat Pangkat",
    question: "$(2^3)^2$ sama dengan ...",
    svgKey: "sifat-pangkat",
    options: ["A. $2^5$", "B. $2^6$", "C. $2^8$", "D. $4^6$"],
    correctAnswer: "B. $2^6$",
    explanation: {
      concept: "Pangkat dari pangkat: eksponen dikalikan.",
      steps: ["$(2^3)^2 = 2^{3 \\times 2} = 2^6$", "$2^6 = 64$"],
      formula: "(a^m)^n = a^{m \\cdot n}"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "UN – Nilai Pangkat",
    question: "Nilai $4^3$ adalah ...",
    svgKey: "pangkat-4-3",
    options: ["A. 16", "B. 48", "C. 64", "D. 81"],
    correctAnswer: "C. 64",
    explanation: {
      concept: "$4^3 = 4 \\times 4 \\times 4$.",
      steps: ["$4^3 = 4 \\times 4 \\times 4 = 16 \\times 4 = 64$"],
      formula: "4^3 = 64"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "UN – Pangkat Negatif",
    question: "Nilai dari $3^{-2}$ adalah ...",
    svgKey: "negatif-3",
    options: ["A. $-9$", "B. $-6$", "C. $\\dfrac{1}{9}$", "D. $\\dfrac{1}{6}$"],
    correctAnswer: "C. $\\dfrac{1}{9}$",
    explanation: {
      concept: "Pangkat negatif = kebalikan pangkat positif.",
      steps: ["$3^{-2} = \\dfrac{1}{3^2} = \\dfrac{1}{9}$"],
      formula: "a^{-n} = \\dfrac{1}{a^n}"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "KONTEKSTUAL – Kehidupan Sehari-hari",
    question: "Sebuah bakteri membelah diri menjadi 2 setiap jam. Jika awalnya ada 1 bakteri, setelah 4 jam banyaknya bakteri adalah ...",
    options: ["A. 8", "B. 16", "C. 32", "D. 64"],
    correctAnswer: "B. 16",
    explanation: {
      concept: "Pembelahan bakteri adalah contoh pertumbuhan eksponensial.",
      steps: ["Setelah 4 jam: $2^4$ bakteri", "$2^4 = 16$ bakteri"],
      formula: "\\text{Banyak bakteri} = 2^n \\text{ (n = jumlah jam)}"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "UN – Nilai Pangkat",
    question: "Nilai dari $(-3)^2$ adalah ...",
    options: ["A. $-9$", "B. $-6$", "C. 6", "D. 9"],
    correctAnswer: "D. 9",
    explanation: {
      concept: "Bilangan negatif berpangkat genap hasilnya positif.",
      steps: ["$(-3)^2 = (-3) \\times (-3)$", "$= +9$"],
      formula: "(-a)^{\\text{genap}} = a^{\\text{genap}} > 0"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "UN – Nilai Pangkat",
    question: "Nilai dari $(-2)^3$ adalah ...",
    options: ["A. $-8$", "B. $-6$", "C. 6", "D. 8"],
    correctAnswer: "A. $-8$",
    explanation: {
      concept: "Bilangan negatif berpangkat ganjil hasilnya negatif.",
      steps: ["$(-2)^3 = (-2) \\times (-2) \\times (-2)$", "$= 4 \\times (-2) = -8$"],
      formula: "(-a)^{\\text{ganjil}} = -a^{\\text{ganjil}} < 0"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "UN – Sifat Perkalian",
    question: "Bentuk sederhana dari $5^2 \\times 5^3$ adalah ...",
    options: ["A. $5^5$", "B. $5^6$", "C. $25^5$", "D. $25^6$"],
    correctAnswer: "A. $5^5$",
    explanation: {
      concept: "Perkalian pangkat dengan basis sama: eksponen dijumlahkan.",
      steps: ["$5^2 \\times 5^3 = 5^{2+3} = 5^5$"],
      formula: "a^m \\times a^n = a^{m+n}"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "UN – Pangkat Nol",
    question: "Nilai $\\left(\\dfrac{3}{4}\\right)^0$ adalah ...",
    options: ["A. 0", "B. $\\dfrac{3}{4}$", "C. 1", "D. Tidak terdefinisi"],
    correctAnswer: "C. 1",
    explanation: {
      concept: "Setiap pecahan bukan nol yang berpangkat 0 sama dengan 1.",
      steps: ["$\\left(\\dfrac{3}{4}\\right)^0 = 1$"],
      formula: "a^0 = 1, \\quad a \\neq 0"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "UN – Nilai Pangkat",
    question: "Nilai dari $2^8$ adalah ...",
    svgKey: "pangkat-2-8",
    options: ["A. 128", "B. 256", "C. 512", "D. 1024"],
    correctAnswer: "B. 256",
    explanation: {
      concept: "Hitung nilai $2^8$ secara bertahap.",
      steps: ["$2^1=2,\\ 2^2=4,\\ 2^3=8,\\ 2^4=16$", "$2^5=32,\\ 2^6=64,\\ 2^7=128,\\ 2^8=256$"],
      formula: "2^8 = 256"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "UN – Sifat Pembagian",
    question: "Hasil dari $\\dfrac{6^5}{6^3}$ adalah ...",
    options: ["A. $6^2$", "B. $6^8$", "C. $1^2$", "D. $1^8$"],
    correctAnswer: "A. $6^2$",
    explanation: {
      concept: "Pembagian pangkat dengan basis sama: eksponen dikurangkan.",
      steps: ["$\\dfrac{6^5}{6^3} = 6^{5-3} = 6^2 = 36$"],
      formula: "\\dfrac{a^m}{a^n} = a^{m-n}"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "UN – Akar Kuadrat",
    question: "Nilai dari $\\sqrt{81}$ adalah ...",
    options: ["A. 7", "B. 8", "C. 9", "D. 10"],
    correctAnswer: "C. 9",
    explanation: {
      concept: "$\\sqrt{81}$ adalah bilangan yang dikuadratkan menghasilkan 81.",
      steps: ["$9^2 = 81$ ✓", "$\\sqrt{81} = 9$"],
      formula: "\\sqrt{81} = 9"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "UN – Akar Pangkat Tiga",
    question: "Nilai $\\sqrt[3]{27}$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 9"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "$\\sqrt[3]{27}$ adalah bilangan yang dipangkatkan 3 menghasilkan 27.",
      steps: ["$3^3 = 27$ ✓", "$\\sqrt[3]{27} = 3$"],
      formula: "\\sqrt[3]{27} = 3"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "KONTEKSTUAL – Luas",
    question: "Luas sebuah persegi dengan sisi 7 cm adalah ...",
    options: ["A. 14 cm²", "B. 28 cm²", "C. 49 cm²", "D. 56 cm²"],
    correctAnswer: "C. 49 cm²",
    explanation: {
      concept: "Luas persegi = sisi² = sisi berpangkat 2.",
      steps: ["$L = s^2 = 7^2$", "$= 49$ cm²"],
      formula: "L = s^2"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "UN – Sifat Pangkat",
    question: "$(3^2)^4$ sama dengan ...",
    options: ["A. $3^6$", "B. $3^8$", "C. $9^8$", "D. $9^6$"],
    correctAnswer: "B. $3^8$",
    explanation: {
      concept: "Pangkat dari pangkat: eksponen dikalikan.",
      steps: ["$(3^2)^4 = 3^{2 \\times 4} = 3^8$"],
      formula: "(a^m)^n = a^{m \\times n}"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "UN – Pangkat Negatif",
    question: "Nilai dari $5^{-2}$ adalah ...",
    svgKey: "negatif-5",
    options: ["A. $-25$", "B. $-10$", "C. $\\dfrac{1}{25}$", "D. $\\dfrac{1}{10}$"],
    correctAnswer: "C. $\\dfrac{1}{25}$",
    explanation: {
      concept: "Pangkat negatif = kebalikan dari pangkat positif.",
      steps: ["$5^{-2} = \\dfrac{1}{5^2} = \\dfrac{1}{25}$"],
      formula: "a^{-n} = \\dfrac{1}{a^n}"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "UN – Nilai Pangkat",
    question: "Nilai dari $1^{100}$ adalah ...",
    options: ["A. 0", "B. 1", "C. 100", "D. 10.000"],
    correctAnswer: "B. 1",
    explanation: {
      concept: "1 dipangkatkan berapapun hasilnya selalu 1.",
      steps: ["$1^{100} = 1 \\times 1 \\times \\cdots \\times 1 = 1$"],
      formula: "1^n = 1 \\text{ untuk semua } n"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "KONTEKSTUAL – Volume",
    question: "Volume kubus dengan panjang rusuk 5 cm adalah ...",
    options: ["A. 15 cm³", "B. 25 cm³", "C. 100 cm³", "D. 125 cm³"],
    correctAnswer: "D. 125 cm³",
    explanation: {
      concept: "Volume kubus = rusuk³.",
      steps: ["$V = r^3 = 5^3$", "$= 125$ cm³"],
      formula: "V = r^3"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "UN – Perkalian Pangkat",
    question: "Nilai dari $2^2 \\times 2^2$ adalah ...",
    options: ["A. 8", "B. 16", "C. 32", "D. 64"],
    correctAnswer: "B. 16",
    explanation: {
      concept: "Hitung dua cara: sifat pangkat atau langsung.",
      steps: ["$2^2 \\times 2^2 = 2^{2+2} = 2^4 = 16$", "Cara lain: $4 \\times 4 = 16$"],
      formula: "a^m \\times a^n = a^{m+n}"
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "UN – Akar Kuadrat",
    question: "Nilai dari $\\sqrt{64}$ adalah ...",
    options: ["A. 6", "B. 7", "C. 8", "D. 9"],
    correctAnswer: "C. 8",
    explanation: {
      concept: "$8^2 = 64$, sehingga $\\sqrt{64} = 8$.",
      steps: ["$8 \\times 8 = 64$", "$\\sqrt{64} = 8$"],
      formula: "\\sqrt{64} = 8"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "KONTEKSTUAL – Teknologi",
    question: "Kapasitas memori sebuah flash disk adalah $2^{10}$ MB. Berapa MB kapasitasnya?",
    options: ["A. 256 MB", "B. 512 MB", "C. 1.024 MB", "D. 2.048 MB"],
    correctAnswer: "C. 1.024 MB",
    explanation: {
      concept: "Dalam komputer, satuan kapasitas sering dinyatakan dalam pangkat 2.",
      steps: ["$2^{10} = 1.024$", "Kapasitas $= 1.024$ MB"],
      formula: "2^{10} = 1.024"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "UN – Sifat Pangkat",
    question: "Nilai dari $(2 \\times 3)^2$ adalah ...",
    options: ["A. 10", "B. 24", "C. 36", "D. 48"],
    correctAnswer: "C. 36",
    explanation: {
      concept: "$(ab)^n = a^n \\times b^n$.",
      steps: ["$(2 \\times 3)^2 = 6^2 = 36$", "Cara lain: $2^2 \\times 3^2 = 4 \\times 9 = 36$"],
      formula: "(ab)^n = a^n \\cdot b^n"
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "UN – Nilai Pangkat",
    question: "Nilai dari $(-5)^2 + 5^2$ adalah ...",
    options: ["A. 0", "B. 25", "C. 50", "D. 100"],
    correctAnswer: "C. 50",
    explanation: {
      concept: "$(-5)^2 = 25$ karena pangkat genap, dan $5^2 = 25$.",
      steps: ["$(-5)^2 = 25$", "$5^2 = 25$", "$25 + 25 = 50$"],
      formula: "(-a)^2 = a^2"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "UN – Pangkat Pecahan",
    question: "Nilai dari $\\left(\\dfrac{1}{2}\\right)^3$ adalah ...",
    options: ["A. $\\dfrac{1}{2}$", "B. $\\dfrac{1}{4}$", "C. $\\dfrac{1}{6}$", "D. $\\dfrac{1}{8}$"],
    correctAnswer: "D. $\\dfrac{1}{8}$",
    explanation: {
      concept: "Pangkatkan pembilang dan penyebut secara terpisah.",
      steps: ["$\\left(\\dfrac{1}{2}\\right)^3 = \\dfrac{1^3}{2^3} = \\dfrac{1}{8}$"],
      formula: "\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "UN – Akar Pangkat Tiga",
    question: "Nilai dari $\\sqrt[3]{125}$ adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "C. 5",
    explanation: {
      concept: "$\\sqrt[3]{125}$ adalah bilangan yang dipangkatkan 3 menghasilkan 125.",
      steps: ["$5^3 = 125$ ✓", "$\\sqrt[3]{125} = 5$"],
      formula: "\\sqrt[3]{125} = 5"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "UN – Sifat Pangkat",
    question: "Nilai dari $2^4 \\div 2^1$ adalah ...",
    options: ["A. $2^3$", "B. $2^4$", "C. $2^5$", "D. $2^0$"],
    correctAnswer: "A. $2^3$",
    explanation: {
      concept: "Pembagian pangkat dengan basis sama: kurangkan eksponen.",
      steps: ["$2^4 \\div 2^1 = 2^{4-1} = 2^3 = 8$"],
      formula: "a^m \\div a^n = a^{m-n}"
    }
  },

  /* ═══════════════════════════════════════════
     SEDANG  (Q36 – Q70)
  ═══════════════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "UN – Sifat Campuran",
    question: "Nilai dari $\\dfrac{2^5 \\times 2^3}{2^4}$ adalah ...",
    options: ["A. $2^2$", "B. $2^4$", "C. $2^6$", "D. $2^{12}$"],
    correctAnswer: "B. $2^4$",
    explanation: {
      concept: "Gunakan sifat perkalian dan pembagian pangkat.",
      steps: ["$\\dfrac{2^5 \\times 2^3}{2^4} = \\dfrac{2^{5+3}}{2^4} = \\dfrac{2^8}{2^4} = 2^{8-4} = 2^4$"],
      formula: "\\dfrac{a^m \\times a^n}{a^p} = a^{m+n-p}"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "ANBK – Notasi Ilmiah",
    question: "Bilangan 360.000.000 dalam notasi ilmiah adalah ...",
    svgKey: "notasi-ilmiah-1",
    options: ["A. $3{,}6 \\times 10^7$", "B. $3{,}6 \\times 10^8$", "C. $36 \\times 10^7$", "D. $3{,}6 \\times 10^9$"],
    correctAnswer: "B. $3{,}6 \\times 10^8$",
    explanation: {
      concept: "Notasi ilmiah: $a \\times 10^n$ di mana $1 \\leq a < 10$.",
      steps: ["$360.000.000 = 3{,}6 \\times 100.000.000$", "$= 3{,}6 \\times 10^8$"],
      formula: "a \\times 10^n,\\quad 1 \\leq a < 10"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "ANBK – Notasi Ilmiah",
    question: "Bilangan $0{,}000047$ dalam notasi ilmiah adalah ...",
    svgKey: "notasi-ilmiah-2",
    options: ["A. $4{,}7 \\times 10^{-4}$", "B. $4{,}7 \\times 10^{-5}$", "C. $4{,}7 \\times 10^{-6}$", "D. $47 \\times 10^{-6}$"],
    correctAnswer: "B. $4{,}7 \\times 10^{-5}$",
    explanation: {
      concept: "Untuk bilangan < 1, gunakan pangkat negatif dalam notasi ilmiah.",
      steps: ["Geser koma 5 kali ke kanan: $0{,}000047 \\to 4{,}7$", "$= 4{,}7 \\times 10^{-5}$"],
      formula: "0{,}000047 = 4{,}7 \\times 10^{-5}"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "HOTS – Perbandingan",
    question: "Manakah yang lebih besar antara $2^5$ dan $3^3$?",
    svgKey: "perbandingan-2-3",
    options: ["A. $2^5$ karena $2^5 = 32 > 3^3 = 27$", "B. $3^3$ karena $3^3 = 27 > 2^5 = 32$", "C. Sama besar", "D. Tidak dapat dibandingkan"],
    correctAnswer: "A. $2^5$ karena $2^5 = 32 > 3^3 = 27$",
    explanation: {
      concept: "Hitung nilai masing-masing lalu bandingkan.",
      steps: ["$2^5 = 32$", "$3^3 = 27$", "$32 > 27$ sehingga $2^5 > 3^3$"],
      formula: "\\text{Hitung nilai numerik, lalu bandingkan}"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "UN – Penyederhanaan",
    question: "Bentuk paling sederhana dari $\\dfrac{a^6 \\cdot b^4}{a^2 \\cdot b}$ adalah ...",
    options: ["A. $a^4 b^3$", "B. $a^3 b^4$", "C. $a^4 b$", "D. $a^8 b^5$"],
    correctAnswer: "A. $a^4 b^3$",
    explanation: {
      concept: "Sederhanakan setiap variabel secara terpisah.",
      steps: ["$\\dfrac{a^6}{a^2} = a^{6-2} = a^4$", "$\\dfrac{b^4}{b^1} = b^{4-1} = b^3$", "Hasil: $a^4 b^3$"],
      formula: "\\dfrac{a^m b^n}{a^p b^q} = a^{m-p} b^{n-q}"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "HOTS – Persamaan Pangkat",
    question: "Nilai $x$ yang memenuhi $2^x = 64$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "C. 6",
    explanation: {
      concept: "Ubah 64 sebagai pangkat dari 2.",
      steps: ["$64 = 2^6$", "$2^x = 2^6 \\Rightarrow x = 6$"],
      formula: "2^6 = 64"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "KONTEKSTUAL – Pertumbuhan",
    question: "Populasi suatu kota adalah $1{,}2 \\times 10^6$ jiwa. Berapa jiwa populasinya dalam bilangan biasa?",
    options: ["A. 12.000 jiwa", "B. 120.000 jiwa", "C. 1.200.000 jiwa", "D. 12.000.000 jiwa"],
    correctAnswer: "C. 1.200.000 jiwa",
    explanation: {
      concept: "Konversi notasi ilmiah ke bilangan biasa.",
      steps: ["$1{,}2 \\times 10^6 = 1{,}2 \\times 1.000.000$", "$= 1.200.000$ jiwa"],
      formula: "a \\times 10^6 \\to \\text{geser koma 6 kali ke kanan}"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "ANBK – Perpangkatan",
    question: "Jika $3^n = 729$, nilai $n$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "C. 6",
    explanation: {
      concept: "Faktorkan 729 sebagai pangkat dari 3.",
      steps: ["$3^1=3,\\ 3^2=9,\\ 3^3=27,\\ 3^4=81,\\ 3^5=243,\\ 3^6=729$", "$n = 6$"],
      formula: "3^6 = 729"
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "TKA – Sifat Pangkat",
    question: "Hasil dari $(2^3 \\times 3^2)^2$ adalah ...",
    options: ["A. 5.184", "B. 5.280", "C. 5.400", "D. 5.600"],
    correctAnswer: "A. 5.184",
    explanation: {
      concept: "Gunakan sifat $(ab)^n = a^n b^n$, lalu hitung.",
      steps: ["$(2^3 \\times 3^2)^2 = (2^3)^2 \\times (3^2)^2 = 2^6 \\times 3^4$", "$= 64 \\times 81 = 5.184$"],
      formula: "(a^m \\cdot b^n)^p = a^{mp} \\cdot b^{np}"
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "HOTS – Persamaan",
    question: "Nilai $x$ yang memenuhi $5^{2x} = 625$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "$625 = 5^4$, sehingga $2x = 4$.",
      steps: ["$625 = 5^4$", "$5^{2x} = 5^4$", "$2x = 4 \\Rightarrow x = 2$"],
      formula: "5^4 = 625"
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "LITERASI MATEMATIKA – Bilangan",
    question: "Seorang ilmuwan mengukur diameter virus sebesar $0{,}000000025$ meter. Dalam notasi ilmiah, diameter tersebut adalah ...",
    options: ["A. $2{,}5 \\times 10^{-8}$", "B. $2{,}5 \\times 10^{-9}$", "C. $25 \\times 10^{-9}$", "D. $2{,}5 \\times 10^{-7}$"],
    correctAnswer: "A. $2{,}5 \\times 10^{-8}$",
    explanation: {
      concept: "Hitung pergeseran koma dari $0{,}000000025$ ke $2{,}5$.",
      steps: ["Dari $0{,}000000025$, geser koma 8 kali ke kanan: $2{,}5$", "Karena bergerak ke kanan pada bilangan < 1: eksponen negatif", "$= 2{,}5 \\times 10^{-8}$"],
      formula: "0{,}000000025 = 2{,}5 \\times 10^{-8}"
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "UN – Penyederhanaan",
    question: "Bentuk sederhana dari $\\dfrac{x^8}{x^3}$ adalah ...",
    options: ["A. $x^5$", "B. $x^{11}$", "C. $x^{-5}$", "D. $x^{24}$"],
    correctAnswer: "A. $x^5$",
    explanation: {
      concept: "Gunakan sifat pembagian pangkat.",
      steps: ["$\\dfrac{x^8}{x^3} = x^{8-3} = x^5$"],
      formula: "\\dfrac{x^m}{x^n} = x^{m-n}"
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "KONTEKSTUAL – Sains",
    question: "Massa sebuah atom hidrogen adalah sekitar $1{,}67 \\times 10^{-27}$ kg. Massa 1000 atom hidrogen adalah ...",
    options: ["A. $1{,}67 \\times 10^{-24}$ kg", "B. $1{,}67 \\times 10^{-25}$ kg", "C. $1{,}67 \\times 10^{-26}$ kg", "D. $1{,}67 \\times 10^{-30}$ kg"],
    correctAnswer: "A. $1{,}67 \\times 10^{-24}$ kg",
    explanation: {
      concept: "Kalikan dengan 1000 = $10^3$.",
      steps: ["$1000 \\times 1{,}67 \\times 10^{-27}$", "$= 1{,}67 \\times 10^3 \\times 10^{-27}$", "$= 1{,}67 \\times 10^{3+(-27)} = 1{,}67 \\times 10^{-24}$ kg"],
      formula: "10^3 \\times 10^{-27} = 10^{3-27} = 10^{-24}"
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "HOTS – Perbandingan",
    question: "Manakah urutan yang benar dari yang terkecil? $2^{10}$, $3^6$, $4^5$, $5^4$",
    options: ["A. $5^4 < 4^5 < 3^6 < 2^{10}$", "B. $2^{10} < 3^6 < 4^5 < 5^4$", "C. $3^6 < 5^4 < 4^5 < 2^{10}$", "D. $5^4 < 3^6 < 2^{10} < 4^5$"],
    correctAnswer: "D. $5^4 < 3^6 < 2^{10} < 4^5$",
    explanation: {
      concept: "Hitung setiap nilai lalu urutkan.",
      steps: ["$2^{10} = 1.024$", "$3^6 = 729$", "$4^5 = 1.024$", "$5^4 = 625$", "Urutan: $625 < 729 < 1.024 = 1.024$", "Jadi: $5^4 < 3^6 < 2^{10} = 4^5$"],
      formula: ""
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "ANBK – Penyederhanaan",
    question: "Bentuk paling sederhana dari $(2a^2)^3$ adalah ...",
    options: ["A. $6a^6$", "B. $8a^5$", "C. $8a^6$", "D. $6a^5$"],
    correctAnswer: "C. $8a^6$",
    explanation: {
      concept: "Pangkatkan setiap faktor secara terpisah.",
      steps: ["$(2a^2)^3 = 2^3 \\times (a^2)^3 = 8 \\times a^6 = 8a^6$"],
      formula: "(ka^m)^n = k^n \\cdot a^{mn}"
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "HOTS – Persamaan",
    question: "Diketahui $4^x = 8^3$. Nilai $x$ adalah ...",
    options: ["A. $\\dfrac{9}{2}$", "B. 4", "C. 6", "D. 9"],
    correctAnswer: "A. $\\dfrac{9}{2}$",
    explanation: {
      concept: "Ubah semua ke basis 2.",
      steps: ["$4^x = 8^3$", "$(2^2)^x = (2^3)^3$", "$2^{2x} = 2^9$", "$2x = 9 \\Rightarrow x = \\dfrac{9}{2}$"],
      formula: "4 = 2^2,\\quad 8 = 2^3"
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "TKA – Operasi Campuran",
    question: "Nilai dari $\\dfrac{(3^2)^3 \\times 3}{3^5}$ adalah ...",
    options: ["A. $3^2$", "B. $3^3$", "C. $3^5$", "D. $3^7$"],
    correctAnswer: "A. $3^2$",
    explanation: {
      concept: "Sederhanakan pembilang dulu, lalu bagi.",
      steps: ["$(3^2)^3 = 3^6$", "$3^6 \\times 3 = 3^7$", "$\\dfrac{3^7}{3^5} = 3^{7-5} = 3^2$"],
      formula: "\\dfrac{a^m}{a^n} = a^{m-n}"
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "KONTEKSTUAL – Ekonomi",
    question: "Nilai investasi seseorang menjadi $2$ kali lipat setiap 5 tahun. Jika investasi awal Rp1.000.000, setelah 20 tahun nilainya adalah ...",
    options: ["A. Rp8.000.000", "B. Rp16.000.000", "C. Rp32.000.000", "D. Rp64.000.000"],
    correctAnswer: "B. Rp16.000.000",
    explanation: {
      concept: "Dalam 20 tahun terjadi $20 \\div 5 = 4$ kali penggandaan.",
      steps: ["Penggandaan 4 kali: $2^4 = 16$", "Nilai $= 1.000.000 \\times 16 = $ Rp16.000.000"],
      formula: "\\text{Nilai} = \\text{Modal} \\times 2^n,\\quad n = \\frac{\\text{tahun}}{\\text{periode}}"
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "LITERASI MATEMATIKA",
    question: "Jarak Bumi–Matahari sekitar $1{,}5 \\times 10^8$ km. Jarak Bumi–Saturnus sekitar $1{,}5 \\times 10^9$ km. Berapa kali jarak Bumi–Saturnus dibanding Bumi–Matahari?",
    options: ["A. 1 kali", "B. 5 kali", "C. 10 kali", "D. 100 kali"],
    correctAnswer: "C. 10 kali",
    explanation: {
      concept: "Bagi kedua jarak untuk mencari perbandingan.",
      steps: ["$\\dfrac{1{,}5 \\times 10^9}{1{,}5 \\times 10^8} = \\dfrac{10^9}{10^8} = 10^1 = 10$"],
      formula: "\\dfrac{10^9}{10^8} = 10^{9-8} = 10"
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "ANBK – Persamaan",
    question: "Jika $2^{x+1} = 16$, maka nilai $x$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "$16 = 2^4$, sehingga $x+1 = 4$.",
      steps: ["$2^{x+1} = 2^4$", "$x + 1 = 4$", "$x = 3$"],
      formula: "a^m = a^n \\Rightarrow m = n"
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "TKA – Penyederhanaan",
    question: "Bentuk sederhana dari $\\left(\\dfrac{a^3}{b^2}\\right)^4$ adalah ...",
    options: ["A. $\\dfrac{a^7}{b^6}$", "B. $\\dfrac{a^{12}}{b^8}$", "C. $\\dfrac{a^{12}}{b^6}$", "D. $\\dfrac{a^7}{b^8}$"],
    correctAnswer: "B. $\\dfrac{a^{12}}{b^8}$",
    explanation: {
      concept: "Pangkatkan pembilang dan penyebut masing-masing.",
      steps: ["$\\left(\\dfrac{a^3}{b^2}\\right)^4 = \\dfrac{(a^3)^4}{(b^2)^4} = \\dfrac{a^{12}}{b^8}$"],
      formula: "\\left(\\frac{a^m}{b^n}\\right)^p = \\frac{a^{mp}}{b^{np}}"
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "HOTS – Pola",
    question: "Perhatikan pola: $2^1=2, 2^2=4, 2^3=8, 2^4=16$. Angka satuan $2^{2026}$ adalah ...",
    options: ["A. 2", "B. 4", "C. 6", "D. 8"],
    correctAnswer: "B. 4",
    explanation: {
      concept: "Angka satuan $2^n$ berulang dengan pola: 2, 4, 8, 6 (siklus 4).",
      steps: ["Pola angka satuan: 2, 4, 8, 6, 2, 4, 8, 6, ...", "$2026 \\div 4 = 506$ sisa $2$", "Sisa 2 → angka satuan = 4"],
      formula: "2026 \\equiv 2 \\pmod{4}"
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "UN – Akar Pangkat",
    question: "Nilai dari $\\sqrt[3]{-64}$ adalah ...",
    options: ["A. $-4$", "B. $4$", "C. $-8$", "D. $8$"],
    correctAnswer: "A. $-4$",
    explanation: {
      concept: "Akar pangkat tiga dari bilangan negatif hasilnya negatif.",
      steps: ["$(-4)^3 = -64$ ✓", "$\\sqrt[3]{-64} = -4$"],
      formula: "\\sqrt[3]{-a} = -\\sqrt[3]{a}"
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "KONTEKSTUAL – Populasi",
    question: "Jumlah sel bakteri yang membelah setiap 20 menit dimulai dari 1 sel. Setelah 2 jam (= 120 menit), banyak sel bakteri adalah ...",
    options: ["A. 32 sel", "B. 64 sel", "C. 128 sel", "D. 256 sel"],
    correctAnswer: "B. 64 sel",
    explanation: {
      concept: "Dalam 2 jam terjadi $120 \\div 20 = 6$ kali pembelahan.",
      steps: ["$n = 120 \\div 20 = 6$", "Banyak sel $= 2^6 = 64$"],
      formula: "\\text{Sel} = 2^n,\\quad n = \\frac{\\text{menit}}{20}"
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "ANBK – Notasi Ilmiah",
    question: "Hasil dari $(4 \\times 10^5) \\times (3 \\times 10^4)$ adalah ...",
    options: ["A. $12 \\times 10^9$", "B. $1{,}2 \\times 10^{10}$", "C. $12 \\times 10^{20}$", "D. $7 \\times 10^9$"],
    correctAnswer: "B. $1{,}2 \\times 10^{10}$",
    explanation: {
      concept: "Kalikan koefisien dan tambahkan eksponen.",
      steps: ["$4 \\times 3 = 12$", "$10^5 \\times 10^4 = 10^9$", "$12 \\times 10^9 = 1{,}2 \\times 10^{10}$"],
      formula: "(a \\times 10^m)(b \\times 10^n) = ab \\times 10^{m+n}"
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "TKA – Sifat Campuran",
    question: "Nilai dari $\\dfrac{6^4 \\times 6^2}{6^3 \\times 6}$ adalah ...",
    options: ["A. 36", "B. 216", "C. 1296", "D. 6"],
    correctAnswer: "A. 36",
    explanation: {
      concept: "Jumlahkan eksponen pembilang, jumlahkan eksponen penyebut, lalu kurangkan.",
      steps: ["$\\dfrac{6^{4+2}}{6^{3+1}} = \\dfrac{6^6}{6^4} = 6^2 = 36$"],
      formula: "6^2 = 36"
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "HOTS – Perbandingan Luas",
    question: "Sebuah persegi mempunyai sisi $2a$. Jika sisi diperbesar menjadi $4a$, perbandingan luas persegi baru dengan luas asal adalah ...",
    options: ["A. 2 : 1", "B. 4 : 1", "C. 8 : 1", "D. 16 : 1"],
    correctAnswer: "B. 4 : 1",
    explanation: {
      concept: "Perbandingan luas = kuadrat perbandingan sisi.",
      steps: ["Perbandingan sisi $= \\dfrac{4a}{2a} = 2$", "Perbandingan luas $= 2^2 = 4$", "Jadi 4 : 1"],
      formula: "\\frac{L_2}{L_1} = \\left(\\frac{s_2}{s_1}\\right)^2"
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "ANBK – Penyederhanaan",
    question: "Nilai dari $\\dfrac{(2^3)^4}{(2^4)^3}$ adalah ...",
    options: ["A. 0", "B. 1", "C. 2", "D. 4"],
    correctAnswer: "B. 1",
    explanation: {
      concept: "Pangkat dari pangkat: eksponen dikalikan.",
      steps: ["$(2^3)^4 = 2^{12}$", "$(2^4)^3 = 2^{12}$", "$\\dfrac{2^{12}}{2^{12}} = 2^0 = 1$"],
      formula: "(a^m)^n = a^{mn}"
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "LITERASI MATEMATIKA",
    question: "Luas permukaan sebuah kubus adalah $6s^2$. Jika $s = 2x^3$, maka luas permukaan dalam bentuk paling sederhana adalah ...",
    options: ["A. $12x^3$", "B. $24x^6$", "C. $6x^6$", "D. $24x^3$"],
    correctAnswer: "B. $24x^6$",
    explanation: {
      concept: "Substitusikan nilai $s$ ke dalam rumus.",
      steps: ["$s = 2x^3$, maka $s^2 = (2x^3)^2 = 4x^6$", "Luas $= 6 \\times 4x^6 = 24x^6$"],
      formula: "6(2x^3)^2 = 6 \\cdot 4x^6 = 24x^6"
    }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "HOTS – Kombinasi Sifat",
    question: "Nilai dari $\\dfrac{3^5 + 3^5 + 3^5}{3^2}$ adalah ...",
    options: ["A. $3^3$", "B. $3^4$", "C. $3^5$", "D. $3^6$"],
    correctAnswer: "B. $3^4$",
    explanation: {
      concept: "Sederhanakan pembilang terlebih dahulu.",
      steps: ["$3^5 + 3^5 + 3^5 = 3 \\times 3^5 = 3^1 \\times 3^5 = 3^6$", "$\\dfrac{3^6}{3^2} = 3^{6-2} = 3^4$"],
      formula: "k \\cdot a^n = a^1 \\cdot a^n = a^{n+1} \\text{ (jika } k=a\\text{)}"
    }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "TKA – Akar Pangkat",
    question: "Nilai dari $\\left(\\sqrt{5}\\right)^4$ adalah ...",
    options: ["A. 5", "B. 10", "C. 20", "D. 25"],
    correctAnswer: "D. 25",
    explanation: {
      concept: "$\\sqrt{5} = 5^{1/2}$, sehingga $\\left(5^{1/2}\\right)^4 = 5^2$.",
      steps: ["$\\left(\\sqrt{5}\\right)^4 = \\left(5^{\\frac{1}{2}}\\right)^4 = 5^{\\frac{4}{2}} = 5^2 = 25$"],
      formula: "\\left(\\sqrt{a}\\right)^n = a^{n/2}"
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "ANBK – Operasi Notasi Ilmiah",
    question: "Hasil dari $\\dfrac{8 \\times 10^6}{2 \\times 10^2}$ adalah ...",
    options: ["A. $4 \\times 10^3$", "B. $4 \\times 10^4$", "C. $6 \\times 10^4$", "D. $6 \\times 10^3$"],
    correctAnswer: "B. $4 \\times 10^4$",
    explanation: {
      concept: "Bagi koefisien dan kurangkan eksponen.",
      steps: ["$\\dfrac{8}{2} = 4$", "$\\dfrac{10^6}{10^2} = 10^{6-2} = 10^4$", "Hasil: $4 \\times 10^4$"],
      formula: "\\dfrac{a \\times 10^m}{b \\times 10^n} = \\dfrac{a}{b} \\times 10^{m-n}"
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "HOTS – Pangkat Rasional",
    question: "Nilai dari $16^{3/4}$ adalah ...",
    options: ["A. 4", "B. 8", "C. 12", "D. 32"],
    correctAnswer: "B. 8",
    explanation: {
      concept: "$a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m$.",
      steps: ["$16^{3/4} = \\left(\\sqrt[4]{16}\\right)^3$", "$\\sqrt[4]{16} = 2$ (karena $2^4=16$)", "$2^3 = 8$"],
      formula: "a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m"
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "KONTEKSTUAL – Perhitungan",
    question: "Diameter Bumi sekitar $1{,}28 \\times 10^4$ km dan diameter Merkurius sekitar $4{,}88 \\times 10^3$ km. Selisihnya dalam notasi ilmiah (pembulatan) adalah ...",
    options: ["A. $7{,}9 \\times 10^3$ km", "B. $8{,}0 \\times 10^3$ km", "C. $8{,}1 \\times 10^3$ km", "D. $6{,}9 \\times 10^3$ km"],
    correctAnswer: "A. $7{,}9 \\times 10^3$ km",
    explanation: {
      concept: "Samakan pangkat lalu kurangkan.",
      steps: ["$1{,}28 \\times 10^4 = 12{,}8 \\times 10^3$", "$12{,}8 - 4{,}88 = 7{,}92 \\approx 7{,}9$", "Selisih $\\approx 7{,}9 \\times 10^3$ km"],
      formula: ""
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang", category: "ANBK – Persamaan",
    question: "Nilai dari $9^x = 3^{10}$, maka $x$ adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "C. 5",
    explanation: {
      concept: "Ubah $9 = 3^2$, lalu samakan eksponen.",
      steps: ["$9^x = (3^2)^x = 3^{2x}$", "$3^{2x} = 3^{10}$", "$2x = 10 \\Rightarrow x = 5$"],
      formula: "9 = 3^2"
    }
  },

  /* ═══════════════════════════════════════════
     SULIT  (Q71 – Q100)
  ═══════════════════════════════════════════ */
  {
    id: 71, type: "PG", difficulty: "Sulit", category: "HOTS – Pangkat Rasional",
    question: "Nilai dari $8^{2/3} + 27^{2/3}$ adalah ...",
    options: ["A. 9", "B. 12", "C. 13", "D. 16"],
    correctAnswer: "C. 13",
    explanation: {
      concept: "$a^{2/3} = \\left(\\sqrt[3]{a}\\right)^2$.",
      steps: ["$8^{2/3} = (\\sqrt[3]{8})^2 = 2^2 = 4$", "$27^{2/3} = (\\sqrt[3]{27})^2 = 3^2 = 9$", "$4 + 9 = 13$"],
      formula: "a^{2/3} = \\left(\\sqrt[3]{a}\\right)^2"
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit", category: "HOTS – Persamaan Eksponen",
    question: "Nilai $x$ yang memenuhi $4^{x-1} = 2^{x+3}$ adalah ...",
    options: ["A. 3", "B. 5", "C. 7", "D. 9"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "Ubah semua ke basis 2.",
      steps: ["$4^{x-1} = (2^2)^{x-1} = 2^{2(x-1)} = 2^{2x-2}$", "$2^{2x-2} = 2^{x+3}$", "$2x - 2 = x + 3$", "$x = 5$"],
      formula: "4 = 2^2"
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sulit", category: "TKA – Penyederhanaan",
    question: "Bentuk paling sederhana dari $\\dfrac{(2x^2y)^3}{4x^3y^2}$ adalah ...",
    options: ["A. $\\dfrac{2x^3y}{1}$", "B. $2x^3y$", "C. $4x^3y$", "D. $2x^2y$"],
    correctAnswer: "B. $2x^3y$",
    explanation: {
      concept: "Pangkatkan pembilang dulu, lalu sederhanakan.",
      steps: ["$(2x^2y)^3 = 8x^6y^3$", "$\\dfrac{8x^6y^3}{4x^3y^2} = 2x^{6-3}y^{3-2} = 2x^3y$"],
      formula: "\\dfrac{8x^6y^3}{4x^3y^2} = 2x^3y"
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit", category: "HOTS – Pangkat Irasional",
    question: "Nilai dari $\\dfrac{2^{\\sqrt{3}} \\cdot 2^{\\sqrt{3}}}{2^{2\\sqrt{3}-1}}$ adalah ...",
    options: ["A. $\\dfrac{1}{2}$", "B. $1$", "C. $2$", "D. $4$"],
    correctAnswer: "C. $2$",
    explanation: {
      concept: "Terapkan sifat perkalian dan pembagian pangkat.",
      steps: ["$\\dfrac{2^{\\sqrt{3}} \\cdot 2^{\\sqrt{3}}}{2^{2\\sqrt{3}-1}} = \\dfrac{2^{2\\sqrt{3}}}{2^{2\\sqrt{3}-1}}$", "$= 2^{2\\sqrt{3} - (2\\sqrt{3}-1)} = 2^1 = 2$"],
      formula: "\\dfrac{a^m}{a^n} = a^{m-n}"
    }
  },
  {
    id: 75, type: "PG", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Sains",
    question: "Kecepatan cahaya adalah $3 \\times 10^8$ m/s. Jarak Bumi–Bulan sekitar $3{,}84 \\times 10^8$ m. Waktu yang dibutuhkan cahaya untuk mencapai Bulan (dalam detik) adalah ...",
    options: ["A. $0{,}78$ detik", "B. $1{,}28$ detik", "C. $7{,}8$ detik", "D. $12{,}8$ detik"],
    correctAnswer: "B. $1{,}28$ detik",
    explanation: {
      concept: "Waktu = Jarak ÷ Kecepatan.",
      steps: ["$t = \\dfrac{3{,}84 \\times 10^8}{3 \\times 10^8}$", "$= \\dfrac{3{,}84}{3} \\times 10^{8-8} = 1{,}28 \\times 10^0 = 1{,}28$ detik"],
      formula: "t = \\dfrac{d}{v}"
    }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS – Sistem Persamaan",
    question: "Jika $2^a \\cdot 3^b = 72$ dan $2^a = 8$, maka $3^b$ adalah ...",
    options: ["A. 3", "B. 6", "C. 9", "D. 27"],
    correctAnswer: "C. 9",
    explanation: {
      concept: "Cari nilai $2^a$ dulu, lalu tentukan $3^b$.",
      steps: ["$2^a = 8 = 2^3 \\Rightarrow a = 3$", "$8 \\times 3^b = 72$", "$3^b = \\dfrac{72}{8} = 9 = 3^2$"],
      formula: "2^3 \\times 3^b = 72 \\Rightarrow 3^b = 9"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "HOTS – Pola Angka",
    question: "Suku ke-$n$ dari barisan $3, 9, 27, 81, \\ldots$ adalah $U_n = 3^n$. Nilai $U_7 - U_6$ adalah ...",
    options: ["A. $3^6$", "B. $2 \\cdot 3^6$", "C. $3^7 - 3^6$", "D. $3^6 \\cdot 2$"],
    correctAnswer: "B. $2 \\cdot 3^6$",
    explanation: {
      concept: "$U_7 - U_6 = 3^7 - 3^6 = 3^6(3-1) = 2 \\cdot 3^6$.",
      steps: ["$3^7 - 3^6 = 3^6 \\cdot 3 - 3^6 \\cdot 1$", "$= 3^6(3-1) = 2 \\cdot 3^6$"],
      formula: "a^n - a^{n-1} = a^{n-1}(a-1)"
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "TKA – Perpangkatan Campuran",
    question: "Nilai dari $\\sqrt{2^{12} \\times 3^4}$ adalah ...",
    options: ["A. $2^5 \\times 3^2$", "B. $2^6 \\times 3^2$", "C. $2^6 \\times 3$", "D. $2^5 \\times 3$"],
    correctAnswer: "B. $2^6 \\times 3^2$",
    explanation: {
      concept: "$\\sqrt{a^m} = a^{m/2}$.",
      steps: ["$\\sqrt{2^{12} \\times 3^4} = 2^{12/2} \\times 3^{4/2} = 2^6 \\times 3^2$"],
      formula: "\\sqrt{a^m \\cdot b^n} = a^{m/2} \\cdot b^{n/2}"
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "ANBK – Persamaan Eksponen",
    question: "Nilai $x$ yang memenuhi $\\dfrac{9^x}{3^x} = 27$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "C. 3",
    explanation: {
      concept: "Ubah semua ke basis 3.",
      steps: ["$\\dfrac{9^x}{3^x} = \\dfrac{(3^2)^x}{3^x} = \\dfrac{3^{2x}}{3^x} = 3^x$", "$3^x = 27 = 3^3$", "$x = 3$"],
      formula: "\\dfrac{9^x}{3^x} = 3^x"
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "HOTS – Pembuktian",
    question: "Jika $a = 2^{10}$ dan $b = 5^5$, nilai dari $\\dfrac{ab}{10^5}$ adalah ...",
    options: ["A. $2^4$", "B. $2^5$", "C. $5^5$", "D. $10^5$"],
    correctAnswer: "B. $2^5$",
    explanation: {
      concept: "$10^5 = 2^5 \\times 5^5$. Sederhanakan $b$ dengan penyebut.",
      steps: ["$\\dfrac{2^{10} \\times 5^5}{10^5} = \\dfrac{2^{10} \\times 5^5}{2^5 \\times 5^5} = \\dfrac{2^{10}}{2^5} = 2^5$"],
      formula: "10^5 = 2^5 \\times 5^5"
    }
  },
  {
    id: 81, type: "MCMA", difficulty: "Sulit", category: "HOTS – Sifat Pangkat",
    question: "Perhatikan pernyataan berikut. Pilih SEMUA pernyataan yang BENAR!\n(1) $2^3 \\times 2^4 = 2^{12}$\n(2) $\\dfrac{5^8}{5^3} = 5^5$\n(3) $(3^2)^5 = 3^7$\n(4) $(-2)^4 = 16$",
    statements: [
      { text: "$2^3 \\times 2^4 = 2^{12}$", isCorrect: false },
      { text: "$\\dfrac{5^8}{5^3} = 5^5$", isCorrect: true },
      { text: "$(3^2)^5 = 3^7$", isCorrect: false },
      { text: "$(-2)^4 = 16$", isCorrect: true },
    ],
    options: ["A. (1) dan (3)", "B. (2) dan (4)", "C. (1), (2), dan (4)", "D. (2), (3), dan (4)"],
    correctAnswer: "B. (2) dan (4)",
    explanation: {
      concept: "Cek setiap pernyataan dengan sifat pangkat yang benar.",
      steps: [
        "(1) $2^3 \\times 2^4 = 2^7 \\neq 2^{12}$ → SALAH",
        "(2) $\\dfrac{5^8}{5^3} = 5^{8-3} = 5^5$ → BENAR ✓",
        "(3) $(3^2)^5 = 3^{10} \\neq 3^7$ → SALAH",
        "(4) $(-2)^4 = 16$ (pangkat genap) → BENAR ✓"
      ],
      formula: "a^m \\times a^n = a^{m+n},\\quad \\dfrac{a^m}{a^n}=a^{m-n},\\quad (a^m)^n=a^{mn}"
    }
  },
  {
    id: 82, type: "MCMA", difficulty: "Sulit", category: "HOTS – Pangkat Negatif",
    question: "Pilih SEMUA pernyataan yang BENAR tentang $3^{-2}$!\n(1) Nilainya $= \\dfrac{1}{9}$\n(2) Nilainya $= -9$\n(3) Nilainya lebih kecil dari 1\n(4) Nilainya sama dengan $\\dfrac{1}{3^2}$",
    statements: [
      { text: "Nilainya $= \\dfrac{1}{9}$", isCorrect: true },
      { text: "Nilainya $= -9$", isCorrect: false },
      { text: "Nilainya lebih kecil dari 1", isCorrect: true },
      { text: "Nilainya sama dengan $\\dfrac{1}{3^2}$", isCorrect: true },
    ],
    options: ["A. (1) dan (4)", "B. (2) dan (3)", "C. (1), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "C. (1), (3), dan (4)",
    explanation: {
      concept: "Pahami makna pangkat negatif.",
      steps: [
        "(1) $3^{-2} = \\dfrac{1}{9}$ → BENAR ✓",
        "(2) $3^{-2} = +\\dfrac{1}{9}$, bukan $-9$ → SALAH",
        "(3) $\\dfrac{1}{9} < 1$ → BENAR ✓",
        "(4) $3^{-2} = \\dfrac{1}{3^2}$ → BENAR ✓"
      ],
      formula: "a^{-n} = \\dfrac{1}{a^n} > 0"
    }
  },
  {
    id: 83, type: "MCMA", difficulty: "Sulit", category: "TKA – Notasi Ilmiah",
    question: "Pilih SEMUA yang merupakan penulisan notasi ilmiah yang BENAR!\n(1) $4{,}5 \\times 10^3 = 4.500$\n(2) $0{,}35 \\times 10^4 = 3{.}500$\n(3) $1{,}2 \\times 10^{-3} = 0{,}0012$\n(4) $12 \\times 10^2 = 1.200$",
    statements: [
      { text: "$4{,}5 \\times 10^3 = 4.500$ (notasi ilmiah benar)", isCorrect: true },
      { text: "$0{,}35 \\times 10^4 = 3.500$ (notasi ilmiah SALAH karena $0{,}35 < 1$)", isCorrect: false },
      { text: "$1{,}2 \\times 10^{-3} = 0{,}0012$ (notasi ilmiah benar)", isCorrect: true },
      { text: "$12 \\times 10^2 = 1.200$ (notasi ilmiah SALAH karena $12 \\geq 10$)", isCorrect: false },
    ],
    options: ["A. (1) saja", "B. (1) dan (3)", "C. (2) dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1) dan (3)",
    explanation: {
      concept: "Notasi ilmiah: $a \\times 10^n$ dengan syarat $1 \\leq a < 10$.",
      steps: [
        "(1) $4{,}5 \\in [1,10)$ → BENAR ✓",
        "(2) $0{,}35 < 1$ → Bukan notasi ilmiah baku → SALAH",
        "(3) $1{,}2 \\in [1,10)$ → BENAR ✓",
        "(4) $12 \\geq 10$ → Bukan notasi ilmiah baku → SALAH"
      ],
      formula: "1 \\leq a < 10 \\text{ untuk notasi ilmiah } a \\times 10^n"
    }
  },
  {
    id: 84, type: "MCMA", difficulty: "Sulit", category: "HOTS – Persamaan Eksponen",
    question: "Tentukan SEMUA nilai $x$ yang memenuhi persamaan $4^x = 2^{x+4}$!\n(1) $x = 4$\n(2) $x = 2$\n(3) $x = 0$\n(4) $x = 1$",
    statements: [
      { text: "$x = 4$: $4^4 = 256$, $2^{4+4} = 256$ ✓", isCorrect: true },
      { text: "$x = 2$: $4^2 = 16$, $2^{2+4} = 64$ ✗", isCorrect: false },
      { text: "$x = 0$: $4^0 = 1$, $2^{0+4} = 16$ ✗", isCorrect: false },
      { text: "$x = 1$: $4^1 = 4$, $2^{1+4} = 32$ ✗", isCorrect: false },
    ],
    options: ["A. (1) saja", "B. (2) saja", "C. (1) dan (2)", "D. (3) dan (4)"],
    correctAnswer: "A. (1) saja",
    explanation: {
      concept: "Ubah $4 = 2^2$, lalu samakan eksponen.",
      steps: ["$(2^2)^x = 2^{x+4}$", "$2^{2x} = 2^{x+4}$", "$2x = x + 4 \\Rightarrow x = 4$"],
      formula: "4^x = 2^{2x}"
    }
  },
  {
    id: 85, type: "MCMA", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Sains",
    question: "Massa Bumi $\\approx 6 \\times 10^{24}$ kg dan massa Bulan $\\approx 7{,}3 \\times 10^{22}$ kg. Pilih SEMUA pernyataan yang BENAR!\n(1) Massa Bumi sekitar 82 kali massa Bulan\n(2) Selisih massa Bumi dan Bulan $\\approx 5{,}93 \\times 10^{24}$ kg\n(3) Massa Bumi 100 kali massa Bulan\n(4) Massa Bulan adalah $1{,}22\\%$ dari massa Bumi",
    statements: [
      { text: "Massa Bumi sekitar 82 kali massa Bulan", isCorrect: true },
      { text: "Selisih massa $\\approx 5{,}93 \\times 10^{24}$ kg", isCorrect: true },
      { text: "Massa Bumi 100 kali massa Bulan", isCorrect: false },
      { text: "Massa Bulan adalah $1{,}22\\%$ dari massa Bumi", isCorrect: true },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (4)", "C. (3) saja", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (4)",
    explanation: {
      concept: "Hitung rasio dan selisih dalam notasi ilmiah.",
      steps: [
        "(1) $\\dfrac{6 \\times 10^{24}}{7{,}3 \\times 10^{22}} \\approx 82$ → BENAR ✓",
        "(2) $6 \\times 10^{24} - 0{,}073 \\times 10^{24} = 5{,}927 \\times 10^{24} \\approx 5{,}93 \\times 10^{24}$ → BENAR ✓",
        "(3) 82, bukan 100 → SALAH",
        "(4) $\\dfrac{1}{82} \\approx 1{,}22\\%$ → BENAR ✓"
      ],
      formula: "\\dfrac{7{,}3 \\times 10^{22}}{6 \\times 10^{24}} \\approx 0{,}0122 = 1{,}22\\%"
    }
  },
  {
    id: 86, type: "MCMA", difficulty: "Sulit", category: "HOTS – Pangkat Rasional",
    question: "Pilih SEMUA yang BENAR!\n(1) $25^{1/2} = 5$\n(2) $64^{1/3} = 4$\n(3) $81^{1/4} = 4$\n(4) $32^{1/5} = 2$",
    statements: [
      { text: "$25^{1/2} = 5$ karena $5^2 = 25$", isCorrect: true },
      { text: "$64^{1/3} = 4$ karena $4^3 = 64$", isCorrect: true },
      { text: "$81^{1/4} = 4$ karena $4^4 = 256 \\neq 81$ → SALAH (harusnya 3)", isCorrect: false },
      { text: "$32^{1/5} = 2$ karena $2^5 = 32$", isCorrect: true },
    ],
    options: ["A. (1) dan (4)", "B. (1), (2), dan (4)", "C. (2) dan (3)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (4)",
    explanation: {
      concept: "$a^{1/n} = \\sqrt[n]{a}$.",
      steps: [
        "(1) $25^{1/2} = \\sqrt{25} = 5$ → BENAR ✓",
        "(2) $64^{1/3} = \\sqrt[3]{64} = 4$ → BENAR ✓",
        "(3) $81^{1/4} = \\sqrt[4]{81} = 3$, bukan 4 → SALAH",
        "(4) $32^{1/5} = \\sqrt[5]{32} = 2$ → BENAR ✓"
      ],
      formula: "a^{1/n} = \\sqrt[n]{a}"
    }
  },
  {
    id: 87, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK – Sifat Pangkat",
    question: "Tentukan BENAR atau SALAH untuk setiap pernyataan berikut!\n(1) $a^0 = 0$ untuk $a \\neq 0$\n(2) $a^{-n} = \\dfrac{1}{a^n}$ untuk $a \\neq 0$\n(3) $(ab)^n = a^n b^n$\n(4) $(a+b)^2 = a^2 + b^2$",
    statements: [
      { text: "$a^0 = 0$ untuk $a \\neq 0$", isCorrect: false },
      { text: "$a^{-n} = \\dfrac{1}{a^n}$ untuk $a \\neq 0$", isCorrect: true },
      { text: "$(ab)^n = a^n b^n$", isCorrect: true },
      { text: "$(a+b)^2 = a^2 + b^2$", isCorrect: false },
    ],
    explanation: {
      concept: "Verifikasi setiap sifat perpangkatan.",
      steps: [
        "(1) SALAH: $a^0 = 1$, bukan 0",
        "(2) BENAR ✓: Definisi pangkat negatif",
        "(3) BENAR ✓: Sifat pangkat untuk perkalian",
        "(4) SALAH: $(a+b)^2 = a^2 + 2ab + b^2$"
      ],
      formula: "a^0=1,\\quad a^{-n}=\\frac{1}{a^n},\\quad (ab)^n=a^n b^n"
    }
  },
  {
    id: 88, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Notasi Ilmiah",
    question: "Tentukan BENAR atau SALAH!\n(1) $5.000 = 5 \\times 10^3$ (notasi ilmiah benar)\n(2) $0{,}05 = 5 \\times 10^{-3}$ (notasi ilmiah benar)\n(3) $2{,}4 \\times 10^5 = 240.000$\n(4) $10^0 = 1$",
    statements: [
      { text: "$5.000 = 5 \\times 10^3$ → notasi ilmiah benar", isCorrect: true },
      { text: "$0{,}05 = 5 \\times 10^{-3}$ → seharusnya $5 \\times 10^{-2}$, jadi SALAH", isCorrect: false },
      { text: "$2{,}4 \\times 10^5 = 240.000$", isCorrect: true },
      { text: "$10^0 = 1$", isCorrect: true },
    ],
    explanation: {
      concept: "Konversi antara bilangan biasa dan notasi ilmiah.",
      steps: [
        "(1) $5.000 = 5 \\times 1.000 = 5 \\times 10^3$ → BENAR ✓",
        "(2) $0{,}05 = 5 \\times 10^{-2}$, bukan $10^{-3}$ → SALAH",
        "(3) $2{,}4 \\times 10^5 = 2{,}4 \\times 100.000 = 240.000$ → BENAR ✓",
        "(4) $10^0 = 1$ → BENAR ✓"
      ],
      formula: "0{,}05 = 5 \\times 10^{-2}"
    }
  },
  {
    id: 89, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Pangkat Negatif",
    question: "Tentukan BENAR atau SALAH!\n(1) $2^{-1} > 2^{-2}$\n(2) $(-3)^{-1} = -\\dfrac{1}{3}$\n(3) $\\left(\\dfrac{1}{4}\\right)^{-2} = 16$\n(4) $10^{-3} = 0{,}0001$",
    statements: [
      { text: "$2^{-1} > 2^{-2}$: $\\dfrac{1}{2} > \\dfrac{1}{4}$ ✓", isCorrect: true },
      { text: "$(-3)^{-1} = -\\dfrac{1}{3}$", isCorrect: true },
      { text: "$\\left(\\dfrac{1}{4}\\right)^{-2} = 16$", isCorrect: true },
      { text: "$10^{-3} = 0{,}0001$: seharusnya $0{,}001$, jadi SALAH", isCorrect: false },
    ],
    explanation: {
      concept: "Evaluasi setiap pernyataan tentang pangkat negatif.",
      steps: [
        "(1) $\\dfrac{1}{2} > \\dfrac{1}{4}$ → BENAR ✓",
        "(2) $(-3)^{-1} = \\dfrac{1}{-3} = -\\dfrac{1}{3}$ → BENAR ✓",
        "(3) $\\left(\\dfrac{1}{4}\\right)^{-2} = 4^2 = 16$ → BENAR ✓",
        "(4) $10^{-3} = 0{,}001$, bukan $0{,}0001$ → SALAH"
      ],
      formula: "\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n"
    }
  },
  {
    id: 90, type: "Benar/Salah", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Eksponen",
    question: "Pertumbuhan populasi kota: $P = P_0 \\times 2^t$ di mana $t$ = tahun. Jika $P_0 = 1.000$ dan $t = 3$, tentukan BENAR/SALAH!\n(1) Populasi tahun ke-3 adalah 8.000\n(2) Populasi tahun ke-4 adalah 16.000\n(3) Pertumbuhan dari $t=2$ ke $t=3$ adalah 2.000\n(4) $2^t$ lebih besar dari $t^2$ untuk $t=5$",
    statements: [
      { text: "Populasi $t=3$: $1.000 \\times 2^3 = 8.000$ ✓", isCorrect: true },
      { text: "Populasi $t=4$: $1.000 \\times 2^4 = 16.000$ ✓", isCorrect: true },
      { text: "Pertumbuhan $t=2$ ke $t=3$: $8.000 - 4.000 = 4.000$, bukan 2.000 → SALAH", isCorrect: false },
      { text: "$2^5 = 32 > 5^2 = 25$ → BENAR ✓", isCorrect: true },
    ],
    explanation: {
      concept: "Gunakan model pertumbuhan eksponensial.",
      steps: [
        "(1) $P(3) = 1.000 \\times 2^3 = 8.000$ → BENAR ✓",
        "(2) $P(4) = 1.000 \\times 2^4 = 16.000$ → BENAR ✓",
        "(3) $P(3) - P(2) = 8.000 - 4.000 = 4.000 \\neq 2.000$ → SALAH",
        "(4) $2^5 = 32 > 5^2 = 25$ → BENAR ✓"
      ],
      formula: "P(t) = P_0 \\times 2^t"
    }
  },
  {
    id: 91, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Sifat Pangkat",
    question: "Tentukan BENAR atau SALAH untuk setiap pernyataan!\n(1) $0^0$ tidak terdefinisi atau nilainya 1 tergantung konteks\n(2) $(-1)^{2025} = -1$\n(3) $\\sqrt{x^2} = x$ untuk semua $x$\n(4) $a^{1/2} = \\sqrt{a}$ untuk $a \\geq 0$",
    statements: [
      { text: "$0^0$ = tidak terdefinisi/1 (tergantung konteks) → BENAR dalam matematika dasar = 1", isCorrect: true },
      { text: "$(-1)^{2025} = -1$ karena 2025 adalah bilangan ganjil", isCorrect: true },
      { text: "$\\sqrt{x^2} = |x| \\neq x$ untuk $x < 0$ → SALAH", isCorrect: false },
      { text: "$a^{1/2} = \\sqrt{a}$ untuk $a \\geq 0$ → BENAR", isCorrect: true },
    ],
    explanation: {
      concept: "Pahami sifat-sifat khusus pangkat.",
      steps: [
        "(1) Dalam SMP, $0^0 = 1$ (konvensi) → BENAR ✓",
        "(2) $(-1)^{\\text{ganjil}} = -1$ → BENAR ✓",
        "(3) $\\sqrt{x^2} = |x|$, misal $\\sqrt{(-3)^2} = 3 \\neq -3$ → SALAH",
        "(4) Definisi pangkat rasional → BENAR ✓"
      ],
      formula: "\\sqrt{x^2} = |x|,\\quad a^{1/2}=\\sqrt{a}"
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "TKA – Sifat Campuran",
    question: "Nilai dari $\\dfrac{6^4 - 6^3}{6^2}$ adalah ...",
    options: ["A. 30", "B. 36", "C. 180", "D. 216"],
    correctAnswer: "A. 30",
    explanation: {
      concept: "Faktorkan pembilang terlebih dahulu.",
      steps: ["$6^4 - 6^3 = 6^3(6-1) = 6^3 \\times 5$", "$\\dfrac{6^3 \\times 5}{6^2} = 6 \\times 5 = 30$"],
      formula: "a^m - a^{m-1} = a^{m-1}(a-1)"
    }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit", category: "HOTS – Eksponen Campuran",
    question: "Jika $x = 2$ dan $y = 3$, nilai dari $x^y + y^x$ adalah ...",
    options: ["A. 15", "B. 17", "C. 19", "D. 21"],
    correctAnswer: "B. 17",
    explanation: {
      concept: "Substitusikan $x=2, y=3$ ke ekspresi.",
      steps: ["$x^y = 2^3 = 8$", "$y^x = 3^2 = 9$", "$8 + 9 = 17$"],
      formula: "x^y + y^x"
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "TKA – Persamaan Kompleks",
    question: "Jika $27^x \\times 9^y = 3^{15}$ dan $x + y = 4$, maka nilai $3x + 2y$ adalah ...",
    options: ["A. 11", "B. 12", "C. 13", "D. 15"],
    correctAnswer: "D. 15",
    explanation: {
      concept: "Ubah semua ke basis 3, lalu selesaikan sistem persamaan.",
      steps: ["$27^x = 3^{3x}$, $9^y = 3^{2y}$", "$3^{3x} \\times 3^{2y} = 3^{15} \\Rightarrow 3x + 2y = 15$"],
      formula: "3x + 2y = 15 \\text{ (langsung dari eksponen)}"
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "HOTS – Pola Pangkat",
    question: "Nilai dari $\\dfrac{10^{2026} + 10^{2025}}{10^{2025}}$ adalah ...",
    options: ["A. 10", "B. 11", "C. 100", "D. 110"],
    correctAnswer: "B. 11",
    explanation: {
      concept: "Faktorkan $10^{2025}$ dari pembilang.",
      steps: ["$\\dfrac{10^{2025}(10 + 1)}{10^{2025}} = \\dfrac{10^{2025} \\times 11}{10^{2025}} = 11$"],
      formula: "\\dfrac{a^{n+1} + a^n}{a^n} = a + 1"
    }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "HOTS – Pertidaksamaan Eksponen",
    question: "Nilai $x$ yang memenuhi $2^x < 2^{x+1} - 16$ adalah ...",
    options: ["A. $x > 3$", "B. $x > 4$", "C. $x \\geq 4$", "D. $x < 4$"],
    correctAnswer: "B. $x > 4$",
    explanation: {
      concept: "Sederhanakan pertidaksamaan dengan sifat eksponen.",
      steps: ["$2^x < 2 \\cdot 2^x - 16$", "$0 < 2^x - 16$", "$2^x > 16 = 2^4$", "$x > 4$"],
      formula: "2^{x+1} = 2 \\cdot 2^x"
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Teknologi",
    question: "Prosesor generasi lama memiliki transistor $4 \\times 10^6$ buah. Prosesor modern memiliki $4 \\times 10^{10}$ transistor. Berapa kali lipat jumlah transistor prosesor modern dibanding yang lama?",
    svgKey: "grafik-pangkat",
    options: ["A. $10^3$", "B. $10^4$", "C. $10^5$", "D. $10^6$"],
    correctAnswer: "B. $10^4$",
    explanation: {
      concept: "Bagi jumlah transistor modern dengan yang lama.",
      steps: ["$\\dfrac{4 \\times 10^{10}}{4 \\times 10^6} = \\dfrac{4}{4} \\times \\dfrac{10^{10}}{10^6} = 1 \\times 10^4 = 10.000$ kali"],
      formula: "\\dfrac{10^{10}}{10^6} = 10^{10-6} = 10^4"
    }
  },
  {
    id: 98, type: "PG", difficulty: "Sulit", category: "HOTS – Kombinasi Sifat",
    question: "Nilai dari $\\dfrac{\\sqrt{3^8 \\times 4^6}}{\\left(\\sqrt[3]{8}\\right)^3}$ adalah ...",
    options: ["A. $\\dfrac{3^4 \\times 4^3}{8}$", "B. $\\dfrac{3^4 \\times 2^6}{8}$", "C. $3^4 \\times 2^3$", "D. $3^4 \\times 4^3 \\div 8$"],
    correctAnswer: "C. $3^4 \\times 2^3$",
    explanation: {
      concept: "Sederhanakan pembilang dan penyebut secara terpisah.",
      steps: [
        "Pembilang: $\\sqrt{3^8 \\times 4^6} = 3^4 \\times 4^3 = 3^4 \\times 2^6$",
        "Penyebut: $\\left(\\sqrt[3]{8}\\right)^3 = 8 = 2^3$",
        "$\\dfrac{3^4 \\times 2^6}{2^3} = 3^4 \\times 2^3$"
      ],
      formula: "\\sqrt{a^{2n}} = a^n,\\quad \\sqrt[3]{8} = 2"
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "TKA – Nilai Ekspresi",
    question: "Jika $2^a = 6$ dan $2^b = 3$, maka $2^{a-b}$ adalah ...",
    options: ["A. $2$", "B. $3$", "C. $4$", "D. $\\dfrac{1}{2}$"],
    correctAnswer: "A. $2$",
    explanation: {
      concept: "Gunakan sifat pembagian pangkat.",
      steps: ["$2^{a-b} = \\dfrac{2^a}{2^b} = \\dfrac{6}{3} = 2$"],
      formula: "2^{a-b} = \\dfrac{2^a}{2^b}"
    }
  },
  {
    id: 100, type: "PG", difficulty: "Sulit", category: "HOTS – Pembuktian dan Analisis",
    question: "Diketahui $p = 2^{50}$ dan $q = 5^{25}$. Mana pernyataan yang BENAR tentang $p$ dan $q$?",
    options: [
      "A. $p < q$ karena basis 5 lebih besar",
      "B. $p > q$ karena $2^{50} = (2^2)^{25} = 4^{25} > 5^{25}$",
      "C. $p < q$ karena $4^{25} < 5^{25}$",
      "D. $p = q$ karena eksponen proporsional"
    ],
    correctAnswer: "C. $p < q$ karena $4^{25} < 5^{25}$",
    explanation: {
      concept: "Ubah $p$ ke bentuk yang bisa dibandingkan dengan $q$.",
      steps: [
        "$p = 2^{50} = (2^2)^{25} = 4^{25}$",
        "$q = 5^{25}$",
        "Bandingkan: $4^{25}$ vs $5^{25}$",
        "Karena $4 < 5$, maka $4^{25} < 5^{25}$",
        "Jadi $p < q$"
      ],
      formula: "2^{50} = (2^2)^{25} = 4^{25} < 5^{25}"
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
    <div
      className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500 animate-slide-up"
      style={{ background: "linear-gradient(135deg,rgba(30,41,59,0.6) 0%,rgba(15,23,42,0.8) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)" }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%,rgba(250,204,21,0.08) 0%,transparent 50%)" }} />
      <div className="relative p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-yellow-400/80 bg-yellow-500/10 px-2 py-1 rounded-md">#{soal.id}</span>
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
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-yellow-500/30 transition-all duration-200">
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
        <button
          onClick={() => { playPopSound(); setIsOpen(!isOpen); }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-amber-500/30 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
        >
          <span className="text-sm font-semibold text-yellow-300">{isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-yellow-300" /> : <ChevronDown className="w-4 h-4 text-yellow-300" />}
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[2000px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
          <div className="relative p-5 rounded-xl border border-yellow-500/20"
            style={{ background: "linear-gradient(135deg,rgba(250,204,21,0.05) 0%,rgba(245,158,11,0.05) 100%)" }}>
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
const BankSoalBilanganBerpangkatPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalBilanganBerpangkat.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalBilanganBerpangkat.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalBilanganBerpangkat.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalBilanganBerpangkat.filter(s => s.difficulty === "Sulit").length,
    PG: soalBilanganBerpangkat.filter(s => s.type === "PG").length,
    MCMA: soalBilanganBerpangkat.filter(s => s.type === "MCMA").length,
    BS: soalBilanganBerpangkat.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">

        <div className="relative mb-4 mx-auto w-fit">
          <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-xl scale-150" />
          <Zap className="relative w-12 h-12 text-yellow-400" />
        </div>

        <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1 bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">
          BANK SOAL BILANGAN BERPANGKAT
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Pangkat Bulat · Pangkat Negatif · Sifat Pangkat · Notasi Ilmiah · Akar Pangkat
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
          <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-body">Total: {soalBilanganBerpangkat.length} Soal</span>
        </div>

        <div className="mb-6">
          <button
            onClick={() => { playPopSound(); setShowFilter(v => !v); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/60 border border-border hover:border-yellow-500/40 transition-all text-sm text-white/70 cursor-pointer font-body mx-auto"
          >
            <Filter className="w-4 h-4" /> Filter Soal {showFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showFilter && (
            <div className="mt-3 p-4 rounded-xl bg-card/60 border border-border space-y-3">
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tingkat Kesulitan:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua", "Mudah", "Sedang", "Sulit"] as const).map(d => (
                    <button key={d} onClick={() => { playPopSound(); setFilterDifficulty(d); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterDifficulty === d ? "bg-yellow-500 text-black border-yellow-500" : "border-border text-white/50 hover:border-yellow-500/40"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tipe Soal:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua", "PG", "MCMA", "Benar/Salah"] as const).map(t => (
                    <button key={t} onClick={() => { playPopSound(); setFilterType(t); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterType === t ? "bg-yellow-500 text-black border-yellow-500" : "border-border text-white/50 hover:border-yellow-500/40"}`}>
                      {t === "MCMA" ? "PG Kompleks MCMA" : t === "Benar/Salah" ? "PG Kompleks B/S" : t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalBilanganBerpangkat.length} soal</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filtered.map(soal => <SoalCard key={soal.id} soal={soal} />)}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/bank-soal"); }}
            className="text-sm text-muted-foreground hover:text-yellow-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Bank Soal
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSoalBilanganBerpangkatPage;
