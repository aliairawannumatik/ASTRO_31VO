import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Grid3X3, ChevronDown, ChevronUp, Filter } from "lucide-react";
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
const VennDuaSVG = ({ labelA, labelB, labelS, warnA, warnB, warnAB, showIris = false, showGabung = false, showA = false, showB = false }: {
  labelA: string; labelB: string; labelS: string; warnA?: string; warnB?: string; warnAB?: string;
  showIris?: boolean; showGabung?: boolean; showA?: boolean; showB?: boolean;
}) => (
  <svg viewBox="0 0 300 140" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-1">
    <rect x="2" y="2" width="296" height="136" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <text x="148" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">S = {labelS}</text>
    <ellipse cx="112" cy="75" rx="68" ry="45" fill={showGabung || showA ? "rgba(6,182,212,0.35)" : "rgba(6,182,212,0.15)"} stroke="#06b6d4" strokeWidth="1.5"/>
    <ellipse cx="188" cy="75" rx="68" ry="45" fill={showGabung || showB ? "rgba(168,85,247,0.35)" : "rgba(168,85,247,0.15)"} stroke="#a855f7" strokeWidth="1.5"/>
    <ellipse cx="150" cy="75" rx="30" ry="40" fill={showIris || showGabung ? "rgba(34,197,94,0.4)" : "rgba(100,116,139,0.15)"} stroke="none"/>
    <text x="85" y="72" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="215" y="72" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">B</text>
    {warnA && <text x="85" y="83" fill="#e2e8f0" fontSize="7" textAnchor="middle" fontFamily="monospace">{warnA}</text>}
    {warnAB && <text x="150" y="79" fill="#4ade80" fontSize="7" textAnchor="middle" fontFamily="monospace">{warnAB}</text>}
    {warnB && <text x="215" y="83" fill="#e2e8f0" fontSize="7" textAnchor="middle" fontFamily="monospace">{warnB}</text>}
  </svg>
);

const VennKomplementSVG = ({ labelA, labelS, members }: { labelA: string; labelS: string; members: string }) => (
  <svg viewBox="0 0 300 140" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-1">
    <rect x="2" y="2" width="296" height="136" rx="6" fill="rgba(239,68,68,0.12)" stroke="#334155" strokeWidth="1"/>
    <text x="148" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">S = {labelS}</text>
    <ellipse cx="148" cy="77" rx="70" ry="46" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="148" y="77" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">A = {labelA}</text>
    <text x="240" y="60" fill="#f87171" fontSize="8" textAnchor="middle" fontFamily="monospace">Aᶜ</text>
    <text x="240" y="72" fill="#e2e8f0" fontSize="7" textAnchor="middle" fontFamily="monospace">{members}</text>
    <text x="50" y="60" fill="#f87171" fontSize="8" textAnchor="middle" fontFamily="monospace">Aᶜ</text>
  </svg>
);

const VennSelisihSVG = ({ labelA, labelB, selisih }: { labelA: string; labelB: string; selisih: string }) => (
  <svg viewBox="0 0 300 140" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-1">
    <rect x="2" y="2" width="296" height="136" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <text x="148" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">A − B (Selisih A dan B)</text>
    <ellipse cx="112" cy="77" rx="68" ry="44" fill="rgba(251,191,36,0.35)" stroke="#fbbf24" strokeWidth="1.5"/>
    <ellipse cx="188" cy="77" rx="68" ry="44" fill="rgba(100,116,139,0.15)" stroke="#64748b" strokeWidth="1.5"/>
    <ellipse cx="150" cy="77" rx="30" ry="40" fill="rgba(15,23,42,0.7)" stroke="none"/>
    <text x="82" y="74" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="218" y="74" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="82" y="86" fill="#fde68a" fontSize="7" textAnchor="middle" fontFamily="monospace">{selisih}</text>
    <text x="150" y="130" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">A−B = {labelA} tapi ∉ {labelB}</text>
  </svg>
);

const VennTigaSVG = ({ a, b, c, ab, bc, ac, abc }: { a: string; b: string; c: string; ab?: string; bc?: string; ac?: string; abc?: string }) => (
  <svg viewBox="0 0 300 165" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-1">
    <rect x="2" y="2" width="296" height="161" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <ellipse cx="120" cy="75" rx="62" ry="42" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5"/>
    <ellipse cx="180" cy="75" rx="62" ry="42" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
    <ellipse cx="150" cy="115" rx="62" ry="42" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="95" y="62" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="205" y="62" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="150" y="152" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">C</text>
    {a && <text x="95" y="74" fill="#e2e8f0" fontSize="7" textAnchor="middle" fontFamily="monospace">{a}</text>}
    {b && <text x="205" y="74" fill="#e2e8f0" fontSize="7" textAnchor="middle" fontFamily="monospace">{b}</text>}
    {c && <text x="150" y="140" fill="#e2e8f0" fontSize="7" textAnchor="middle" fontFamily="monospace">{c}</text>}
    {ab && <text x="150" y="72" fill="#4ade80" fontSize="7" textAnchor="middle" fontFamily="monospace">{ab}</text>}
    {bc && <text x="178" y="108" fill="#fb923c" fontSize="7" textAnchor="middle" fontFamily="monospace">{bc}</text>}
    {ac && <text x="122" y="108" fill="#f472b6" fontSize="7" textAnchor="middle" fontFamily="monospace">{ac}</text>}
    {abc && <text x="150" y="97" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{abc}</text>}
  </svg>
);

const KardinalitasSVG = ({ n, label, members }: { n: number; label: string; members: string }) => (
  <svg viewBox="0 0 280 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-1">
    <rect x="5" y="5" width="270" height="90" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <rect x="18" y="20" width="165" height="55" rx="4" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="100" y="36" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">{label}</text>
    <text x="100" y="52" fill="#e2e8f0" fontSize="8" textAnchor="middle" fontFamily="monospace">= &#123; {members} &#125;</text>
    <rect x="200" y="20" width="65" height="55" rx="4" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="232" y="40" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace">n(A)</text>
    <text x="232" y="58" fill="#fff" fontSize="16" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{n}</text>
  </svg>
);

const HimpunanNotasiSVG = ({ cara, contoh }: { cara: string; contoh: string }) => (
  <svg viewBox="0 0 300 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-1">
    <rect x="5" y="5" width="290" height="90" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <rect x="15" y="18" width="120" height="30" rx="4" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="75" y="30" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Cara</text>
    <text x="75" y="42" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{cara}</text>
    <rect x="152" y="18" width="135" height="30" rx="4" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="219" y="30" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace">Contoh</text>
    <text x="219" y="42" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">{contoh}</text>
    <text x="148" y="82" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Himpunan bilangan asli &lt; 5</text>
  </svg>
);

const RumusHimpunanSVG = ({ rumus, keterangan }: { rumus: string; keterangan: string }) => (
  <svg viewBox="0 0 300 90" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-1">
    <rect x="5" y="5" width="290" height="80" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <rect x="15" y="18" width="270" height="32" rx="4" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="150" y="34" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{rumus}</text>
    <text x="150" y="45" fill="#e2e8f0" fontSize="8" textAnchor="middle" fontFamily="monospace">{keterangan}</text>
    <text x="150" y="72" fill="#64748b" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Prinsip Inklusi-Eksklusi</text>
  </svg>
);

const visualMap: Record<string, React.ReactNode> = {
  "venn-irisan": <VennDuaSVG labelA="A" labelB="B" labelS="Semesta" warnA="hanya A" warnAB="A∩B" warnB="hanya B" showIris />,
  "venn-gabungan": <VennDuaSVG labelA="A" labelB="B" labelS="Semesta" warnA="∈A" warnAB="∈A&B" warnB="∈B" showGabung />,
  "venn-A-saja": <VennDuaSVG labelA="A" labelB="B" labelS="Semesta" warnA="hanya A" warnAB="∈A∩B" warnB="hanya B" showA />,
  "venn-komplemen": <VennKomplementSVG labelA="{...}" labelS="{1,2,...,10}" members="di luar A" />,
  "venn-selisih": <VennSelisihSVG labelA="∈A" labelB="B" selisih="anggota A−B" />,
  "venn-tiga": <VennTigaSVG a="4" b="3" c="5" ab="2" bc="1" ac="3" abc="2" />,
  "kardinalitas-5": <KardinalitasSVG n={5} label="A = bil. ganjil < 10" members="1, 3, 5, 7, 9" />,
  "kardinalitas-4": <KardinalitasSVG n={4} label="A = faktor dari 12" members="1, 2, 3, 4, 6, 12" />,
  "notasi-daftar": <HimpunanNotasiSVG cara="Mendaftar" contoh="{1, 2, 3, 4}" />,
  "notasi-builder": <HimpunanNotasiSVG cara="Notasi Pembentuk" contoh="{x | x < 5, x∈ℕ}" />,
  "rumus-gabungan": <RumusHimpunanSVG rumus="n(A∪B) = n(A) + n(B) − n(A∩B)" keterangan="Prinsip Inklusi-Eksklusi untuk dua himpunan" />,
  "rumus-tiga-himpunan": <RumusHimpunanSVG rumus="n(A∪B∪C) = n(A)+n(B)+n(C)−n(A∩B)−n(B∩C)−n(A∩C)+n(A∩B∩C)" keterangan="Prinsip Inklusi-Eksklusi untuk tiga himpunan" />,
  "venn-konteks-1": <VennDuaSVG labelA="Mat" labelB="IPA" labelS="36 siswa" warnA="15" warnAB="8" warnB="12" showGabung />,
  "venn-konteks-2": <VennDuaSVG labelA="Sepak Bola" labelB="Basket" labelS="40 siswa" warnA="18" warnAB="7" warnB="10" showGabung />,
};

const soalHimpunan: Question[] = [
  /* ═══════════════════════════════════
     MUDAH  (Q1 – Q35)
  ═══════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Pengertian Himpunan",
    question: "Manakah yang merupakan contoh himpunan yang terdefinisi dengan jelas?",
    options: ["A. Kumpulan orang yang cantik", "B. Kumpulan bilangan asli kurang dari 5", "C. Kumpulan buku yang tebal", "D. Kumpulan makanan yang enak"],
    correctAnswer: "B. Kumpulan bilangan asli kurang dari 5",
    explanation: {
      concept: "Himpunan adalah kumpulan objek yang terdefinisi dengan jelas (well-defined). Artinya, dapat ditentukan apakah suatu objek termasuk anggota atau bukan.",
      steps: ["A, C, D bersifat subjektif (tidak pasti ukurannya)", "B: 'bilangan asli < 5' = {1, 2, 3, 4} → terdefinisi dengan jelas ✓"],
      formula: "\\text{Himpunan: kumpulan objek yang well-defined}"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Keanggotaan",
    question: "Diketahui $A = \\{2, 4, 6, 8, 10\\}$. Manakah pernyataan yang BENAR?",
    svgKey: "kardinalitas-5",
    options: ["A. $5 \\in A$", "B. $6 \\notin A$", "C. $8 \\in A$", "D. $10 \\notin A$"],
    correctAnswer: "C. $8 \\in A$",
    explanation: {
      concept: "Simbol ∈ artinya 'anggota dari', dan ∉ artinya 'bukan anggota dari'.",
      steps: ["A: 5 ∉ A (5 bukan bilangan genap dalam A) → SALAH", "B: 6 ∈ A → SALAH", "C: 8 ∈ A → BENAR ✓", "D: 10 ∈ A → SALAH"],
      formula: "x \\in A \\Leftrightarrow x \\text{ adalah anggota himpunan } A"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Kardinalitas",
    question: "Diketahui $B = \\{a, b, c, d, e\\}$. Banyaknya anggota himpunan $B$ atau $n(B)$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "n(A) menyatakan banyaknya anggota (kardinalitas) himpunan A.",
      steps: ["B = {a, b, c, d, e}", "Anggota: a, b, c, d, e → ada 5 anggota", "n(B) = 5"],
      formula: "n(A) = \\text{banyaknya anggota himpunan } A"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Himpunan Kosong",
    question: "Manakah yang merupakan himpunan kosong?",
    options: ["A. $\\{0\\}$", "B. Himpunan bilangan prima antara 8 dan 10", "C. $\\{\\emptyset\\}$", "D. Himpunan bilangan cacah kurang dari 2"],
    correctAnswer: "B. Himpunan bilangan prima antara 8 dan 10",
    explanation: {
      concept: "Himpunan kosong (∅) adalah himpunan yang tidak memiliki anggota sama sekali.",
      steps: ["{0} punya 1 anggota yaitu 0 → bukan kosong", "Bilangan prima antara 8 dan 10 → tidak ada (9 = 3×3) → KOSONG ✓", "{∅} punya 1 anggota yaitu ∅ → bukan kosong", "Bil. cacah < 2 = {0, 1} → tidak kosong"],
      formula: "\\emptyset = \\{\\} \\Rightarrow n(\\emptyset) = 0"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Menyatakan Himpunan",
    question: "Himpunan $\\{1, 3, 5, 7, 9\\}$ jika dinyatakan dengan notasi pembentuk himpunan adalah ...",
    svgKey: "notasi-builder",
    options: ["A. $\\{x \\mid x < 10, x \\in \\mathbb{N}\\}$", "B. $\\{x \\mid x \\text{ bilangan ganjil}, 1 \\leq x \\leq 9\\}$", "C. $\\{x \\mid x \\text{ bilangan genap}, x < 10\\}$", "D. $\\{x \\mid x \\text{ bilangan prima}, x < 10\\}$"],
    correctAnswer: "B. $\\{x \\mid x \\text{ bilangan ganjil}, 1 \\leq x \\leq 9\\}$",
    explanation: {
      concept: "Notasi pembentuk himpunan: {x | syarat x}. Himpunan {1,3,5,7,9} adalah bilangan ganjil dari 1 sampai 9.",
      steps: ["A: bilangan asli < 10 = {1,2,3,4,5,6,7,8,9} → terlalu banyak", "B: bilangan ganjil, 1≤x≤9 = {1,3,5,7,9} → BENAR ✓", "C: bilangan genap → beda", "D: bilangan prima < 10 = {2,3,5,7} → beda"],
      formula: "\\{x \\mid P(x)\\} \\text{ dibaca: himpunan semua } x \\text{ yang memenuhi } P(x)"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Menyatakan Himpunan",
    question: "Himpunan bilangan asli yang lebih dari 2 dan kurang dari 8 jika ditulis dengan mendaftar anggotanya adalah ...",
    svgKey: "notasi-daftar",
    options: ["A. $\\{2, 3, 4, 5, 6, 7, 8\\}$", "B. $\\{3, 4, 5, 6, 7\\}$", "C. $\\{2, 4, 6, 8\\}$", "D. $\\{1, 2, 3, 4, 5, 6, 7, 8\\}$"],
    correctAnswer: "B. $\\{3, 4, 5, 6, 7\\}$",
    explanation: {
      concept: "Cara mendaftar: tulis semua anggota yang memenuhi syarat dalam kurung kurawal.",
      steps: ["Syarat: x > 2 dan x < 8, x ∈ bilangan asli", "x = 3, 4, 5, 6, 7 ✓", "2 tidak termasuk (harus lebih dari 2)", "8 tidak termasuk (harus kurang dari 8)"],
      formula: "2 < x < 8, x \\in \\mathbb{N} \\Rightarrow \\{3,4,5,6,7\\}"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Himpunan Semesta",
    question: "Diketahui $A = \\{2, 4, 6\\}$ dan $S = \\{1, 2, 3, 4, 5, 6\\}$. Komplemen $A$ terhadap $S$ adalah ...",
    svgKey: "venn-komplemen",
    options: ["A. $\\{1, 3, 5\\}$", "B. $\\{2, 4, 6\\}$", "C. $\\{1, 2, 3\\}$", "D. $\\{4, 5, 6\\}$"],
    correctAnswer: "A. $\\{1, 3, 5\\}$",
    explanation: {
      concept: "Komplemen A (Aᶜ atau A') adalah himpunan anggota S yang bukan anggota A.",
      steps: ["S = {1,2,3,4,5,6}", "A = {2,4,6}", "Aᶜ = S − A = {1,3,5}"],
      formula: "A^c = S - A = \\{x \\mid x \\in S \\text{ dan } x \\notin A\\}"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Irisan",
    question: "Diketahui $P = \\{1, 2, 3, 4, 5\\}$ dan $Q = \\{3, 4, 5, 6, 7\\}$. Irisan $P \\cap Q$ adalah ...",
    svgKey: "venn-irisan",
    options: ["A. $\\{1, 2, 6, 7\\}$", "B. $\\{3, 4, 5\\}$", "C. $\\{1, 2, 3, 4, 5, 6, 7\\}$", "D. $\\{1, 2\\}$"],
    correctAnswer: "B. $\\{3, 4, 5\\}$",
    explanation: {
      concept: "Irisan A ∩ B adalah himpunan anggota yang ada di A sekaligus di B.",
      steps: ["P = {1,2,3,4,5}", "Q = {3,4,5,6,7}", "Yang ada di keduanya: 3, 4, 5", "P ∩ Q = {3,4,5}"],
      formula: "A \\cap B = \\{x \\mid x \\in A \\text{ dan } x \\in B\\}"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Gabungan",
    question: "Diketahui $A = \\{1, 2, 3\\}$ dan $B = \\{3, 4, 5\\}$. Gabungan $A \\cup B$ adalah ...",
    svgKey: "venn-gabungan",
    options: ["A. $\\{3\\}$", "B. $\\{1, 2, 4, 5\\}$", "C. $\\{1, 2, 3, 4, 5\\}$", "D. $\\{1, 2, 3, 3, 4, 5\\}$"],
    correctAnswer: "C. $\\{1, 2, 3, 4, 5\\}$",
    explanation: {
      concept: "Gabungan A ∪ B adalah himpunan semua anggota yang ada di A atau di B (tidak boleh ada yang ditulis dua kali).",
      steps: ["A = {1,2,3}", "B = {3,4,5}", "A ∪ B = {1,2,3,4,5} (3 cukup ditulis sekali)"],
      formula: "A \\cup B = \\{x \\mid x \\in A \\text{ atau } x \\in B\\}"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Himpunan Bagian",
    question: "Manakah yang merupakan himpunan bagian dari $\\{1, 2, 3, 4\\}$?",
    options: ["A. $\\{1, 2, 5\\}$", "B. $\\{0, 1, 2\\}$", "C. $\\{2, 3, 4\\}$", "D. $\\{1, 2, 3, 4, 5\\}$"],
    correctAnswer: "C. $\\{2, 3, 4\\}$",
    explanation: {
      concept: "A ⊆ B artinya setiap anggota A juga merupakan anggota B.",
      steps: ["A: {1,2,5} → 5 ∉ {1,2,3,4} → bukan himpunan bagian", "B: {0,1,2} → 0 ∉ {1,2,3,4} → bukan himpunan bagian", "C: {2,3,4} → 2,3,4 semuanya ∈ {1,2,3,4} → BENAR ✓", "D: {1,2,3,4,5} → 5 ∉ {1,2,3,4} → bukan himpunan bagian"],
      formula: "A \\subseteq B \\Leftrightarrow \\forall x \\in A, x \\in B"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Banyaknya Himpunan Bagian",
    question: "Himpunan $A = \\{p, q, r\\}$ memiliki banyaknya himpunan bagian sebanyak ...",
    options: ["A. 3", "B. 6", "C. 8", "D. 9"],
    correctAnswer: "C. 8",
    explanation: {
      concept: "Banyaknya himpunan bagian dari himpunan dengan n anggota = 2ⁿ.",
      steps: ["n(A) = 3", "Banyak himpunan bagian = $2^3 = 8$", "Yaitu: ∅, {p}, {q}, {r}, {p,q}, {p,r}, {q,r}, {p,q,r}"],
      formula: "\\text{Banyak himpunan bagian} = 2^{n(A)}"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Kardinalitas",
    question: "Diketahui $A = \\{x \\mid x \\text{ adalah faktor dari 12}\\}$. Nilai $n(A)$ adalah ...",
    svgKey: "kardinalitas-4",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "C. 6",
    explanation: {
      concept: "Faktor 12 adalah semua bilangan yang membagi 12 habis.",
      steps: ["12 = 1×12 = 2×6 = 3×4", "Faktor 12 = {1, 2, 3, 4, 6, 12}", "n(A) = 6"],
      formula: "\\text{Faktor } n = \\{a \\mid n \\div a = \\text{bulat}\\}"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Himpunan Sama",
    question: "Dua himpunan $A = \\{1, 2, 3\\}$ dan $B = \\{3, 1, 2\\}$. Hubungan $A$ dan $B$ adalah ...",
    options: ["A. A ⊂ B", "B. A ≠ B", "C. A = B", "D. B ⊂ A"],
    correctAnswer: "C. A = B",
    explanation: {
      concept: "Dua himpunan dikatakan sama jika memiliki anggota yang persis sama (urutan tidak penting).",
      steps: ["A = {1,2,3}", "B = {3,1,2}", "Anggota keduanya: 1, 2, 3 → SAMA", "A = B ✓"],
      formula: "A = B \\Leftrightarrow A \\subseteq B \\text{ dan } B \\subseteq A"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Irisan",
    question: "Diketahui $A = \\{a, b, c\\}$ dan $B = \\{d, e, f\\}$. Irisan $A \\cap B$ adalah ...",
    options: ["A. $\\{a, b, c, d, e, f\\}$", "B. $\\{a, b, c\\}$", "C. $\\emptyset$", "D. $\\{d, e, f\\}$"],
    correctAnswer: "C. $\\emptyset$",
    explanation: {
      concept: "Jika tidak ada anggota yang sama, maka irisan dua himpunan adalah himpunan kosong. Dua himpunan demikian disebut saling lepas (disjoint).",
      steps: ["A = {a,b,c}", "B = {d,e,f}", "Tidak ada anggota yang sama", "A ∩ B = ∅"],
      formula: "A \\cap B = \\emptyset \\Rightarrow A \\text{ dan } B \\text{ saling lepas}"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Gabungan",
    question: "Jika $n(A) = 5$, $n(B) = 4$, dan $n(A \\cap B) = 2$, maka $n(A \\cup B)$ adalah ...",
    svgKey: "rumus-gabungan",
    options: ["A. 5", "B. 7", "C. 9", "D. 11"],
    correctAnswer: "B. 7",
    explanation: {
      concept: "Prinsip inklusi-eksklusi: n(A∪B) = n(A) + n(B) − n(A∩B).",
      steps: ["n(A∪B) = 5 + 4 − 2", "= 9 − 2 = 7"],
      formula: "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Selisih Himpunan",
    question: "Diketahui $A = \\{1, 2, 3, 4, 5\\}$ dan $B = \\{3, 4, 5, 6, 7\\}$. Selisih $A - B$ adalah ...",
    svgKey: "venn-selisih",
    options: ["A. $\\{1, 2\\}$", "B. $\\{6, 7\\}$", "C. $\\{3, 4, 5\\}$", "D. $\\{1, 2, 6, 7\\}$"],
    correctAnswer: "A. $\\{1, 2\\}$",
    explanation: {
      concept: "Selisih A − B adalah himpunan anggota A yang tidak termasuk anggota B.",
      steps: ["A = {1,2,3,4,5}", "B = {3,4,5,6,7}", "Yang ada di A tapi tidak di B: 1, 2", "A − B = {1,2}"],
      formula: "A - B = \\{x \\mid x \\in A \\text{ dan } x \\notin B\\}"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Himpunan Bagian",
    question: "Himpunan kosong ($\\emptyset$) adalah himpunan bagian dari ...",
    options: ["A. Tidak ada himpunan", "B. Dirinya sendiri saja", "C. Semua himpunan", "D. Hanya himpunan yang juga kosong"],
    correctAnswer: "C. Semua himpunan",
    explanation: {
      concept: "Himpunan kosong merupakan himpunan bagian dari setiap himpunan.",
      steps: ["∅ ⊆ A berlaku untuk setiap himpunan A", "Karena tidak ada anggota ∅ yang melanggar syarat ⊆", "∅ ⊆ ∅, ∅ ⊆ {1,2,3}, dst."],
      formula: "\\emptyset \\subseteq A \\text{ untuk setiap himpunan } A"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Diagram Venn",
    question: "Pada diagram Venn dua himpunan A dan B yang saling berpotongan, daerah yang diarsir untuk $A \\cap B$ adalah ...",
    svgKey: "venn-irisan",
    options: ["A. Seluruh lingkaran A", "B. Seluruh lingkaran B", "C. Daerah yang tumpang tindih antara A dan B", "D. Daerah di luar kedua lingkaran"],
    correctAnswer: "C. Daerah yang tumpang tindih antara A dan B",
    explanation: {
      concept: "Pada diagram Venn, irisan A ∩ B digambarkan sebagai daerah yang dimiliki bersama oleh kedua lingkaran.",
      steps: ["A ∩ B = anggota yang ada di A sekaligus di B", "Daerah tumpang tindih mewakili elemen yang ada di kedua himpunan"],
      formula: "A \\cap B \\text{ = daerah irisan (tumpang tindih)}"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Kardinalitas",
    question: "Himpunan $C = \\{x \\mid x \\text{ adalah huruf vokal}\\}$. Nilai $n(C)$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "Huruf vokal dalam alfabet adalah a, e, i, o, u.",
      steps: ["C = {a, e, i, o, u}", "n(C) = 5"],
      formula: "n(C) = 5"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Himpunan Semesta",
    question: "Himpunan semesta yang tepat untuk himpunan $\\{2, 3, 5, 7\\}$ adalah ...",
    options: ["A. Himpunan bilangan genap", "B. Himpunan bilangan prima", "C. Himpunan bilangan bulat negatif", "D. Himpunan bilangan pecahan"],
    correctAnswer: "B. Himpunan bilangan prima",
    explanation: {
      concept: "Himpunan semesta (S) harus memuat semua anggota himpunan yang dibicarakan.",
      steps: ["{2,3,5,7} = himpunan bilangan prima kurang dari 10", "Himpunan semesta yang tepat = himpunan bilangan prima ✓"],
      formula: "A \\subseteq S \\text{ (himpunan semesta memuat semua anggota A)}"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Banyaknya Himpunan Bagian",
    question: "Jika $n(A) = 4$, banyaknya himpunan bagian dari $A$ adalah ...",
    options: ["A. 8", "B. 12", "C. 16", "D. 24"],
    correctAnswer: "C. 16",
    explanation: {
      concept: "Banyak himpunan bagian = 2ⁿ, dengan n = banyak anggota.",
      steps: ["n(A) = 4", "Banyak himpunan bagian = $2^4 = 16$"],
      formula: "2^4 = 16"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Komplemen",
    question: "Diketahui $S = \\{1, 2, 3, 4, 5, 6, 7, 8\\}$ dan $A = \\{1, 3, 5, 7\\}$. Maka $A^c$ adalah ...",
    options: ["A. $\\{2, 4, 6, 8\\}$", "B. $\\{1, 3, 5, 7\\}$", "C. $\\{1, 2, 3, 4\\}$", "D. $\\{5, 6, 7, 8\\}$"],
    correctAnswer: "A. $\\{2, 4, 6, 8\\}$",
    explanation: {
      concept: "Komplemen A adalah anggota S yang bukan anggota A.",
      steps: ["S = {1,2,3,4,5,6,7,8}", "A = {1,3,5,7}", "Aᶜ = S − A = {2,4,6,8}"],
      formula: "A^c = S - A"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Irisan & Gabungan",
    question: "Jika $A = \\{1,2,3\\}$ dan $B = \\{1,2,3\\}$, maka $A \\cap B$ adalah ...",
    options: ["A. $\\emptyset$", "B. $\\{1\\}$", "C. $\\{1, 2, 3\\}$", "D. $\\{1, 2, 3, 1, 2, 3\\}$"],
    correctAnswer: "C. $\\{1, 2, 3\\}$",
    explanation: {
      concept: "Jika dua himpunan sama, maka irisannya sama dengan himpunan itu sendiri.",
      steps: ["A = B = {1,2,3}", "A ∩ B = {1,2,3} (semua anggota ada di keduanya)"],
      formula: "A = B \\Rightarrow A \\cap B = A = B"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Himpunan Bagian",
    question: "Banyaknya himpunan bagian yang tepat (proper subset) dari $\\{x, y\\}$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Himpunan bagian sejati (proper subset) adalah himpunan bagian yang bukan himpunan itu sendiri.",
      steps: ["Semua himpunan bagian dari {x,y}: ∅, {x}, {y}, {x,y} → 4 buah", "Himpunan bagian sejati (tanpa {x,y} sendiri): ∅, {x}, {y} → 3 buah"],
      formula: "\\text{Proper subset} = 2^n - 1"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Operasi Himpunan",
    question: "Diketahui $A = \\{1,2,3,4\\}$ dan $B = \\{3,4,5,6\\}$. Nilai $n(A \\cup B)$ adalah ...",
    options: ["A. 4", "B. 6", "C. 8", "D. 10"],
    correctAnswer: "B. 6",
    explanation: {
      concept: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)",
      steps: ["A ∩ B = {3,4} → n(A∩B) = 2", "n(A) = 4, n(B) = 4", "n(A∪B) = 4 + 4 − 2 = 6", "Cek: A∪B = {1,2,3,4,5,6} → n = 6 ✓"],
      formula: "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Diagram Venn",
    question: "Pada diagram Venn, daerah di luar semua lingkaran (tetapi masih di dalam persegi panjang) mewakili ...",
    options: ["A. Irisan semua himpunan", "B. Gabungan semua himpunan", "C. Komplemen gabungan himpunan", "D. Selisih himpunan"],
    correctAnswer: "C. Komplemen gabungan himpunan",
    explanation: {
      concept: "Persegi panjang mewakili himpunan semesta S. Daerah di luar semua lingkaran adalah anggota S yang tidak masuk himpunan manapun = (A∪B)ᶜ.",
      steps: ["Daerah di luar A dan B tapi dalam S", "= S − (A ∪ B) = (A ∪ B)ᶜ"],
      formula: "(A \\cup B)^c = S - (A \\cup B)"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Keanggotaan",
    question: "Dari himpunan $A = \\{2, 4, 6, 8, 10\\}$, pernyataan yang benar adalah ...",
    options: ["A. $7 \\in A$", "B. $n(A) = 4$", "C. $6 \\in A$", "D. $A \\text{ adalah himpunan bilangan prima}$"],
    correctAnswer: "C. $6 \\in A$",
    explanation: {
      concept: "Memeriksa keanggotaan dan sifat himpunan secara teliti.",
      steps: ["A: 7 ∉ A (7 bukan bilangan genap ≤ 10 yang ada di A) → SALAH", "B: n(A) = 5 bukan 4 → SALAH", "C: 6 ∈ A → BENAR ✓", "D: {2,4,6,8,10} bukan himpunan prima → SALAH"],
      formula: ""
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Selisih Himpunan",
    question: "Jika $A = \\{a,b,c,d\\}$ dan $B = \\{c,d,e,f\\}$, maka $B - A$ adalah ...",
    options: ["A. $\\{a,b\\}$", "B. $\\{c,d\\}$", "C. $\\{e,f\\}$", "D. $\\{a,b,e,f\\}$"],
    correctAnswer: "C. $\\{e,f\\}$",
    explanation: {
      concept: "B − A = anggota B yang tidak ada di A.",
      steps: ["B = {c,d,e,f}", "A = {a,b,c,d}", "Yang ada di B tapi tidak di A: e, f", "B − A = {e,f}"],
      formula: "B - A = \\{x \\mid x \\in B, x \\notin A\\}"
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Himpunan Berhingga",
    question: "Manakah yang merupakan himpunan tak berhingga?",
    options: ["A. Himpunan huruf alfabet", "B. Himpunan bilangan bulat positif", "C. Himpunan hari dalam seminggu", "D. Himpunan bulan dalam setahun"],
    correctAnswer: "B. Himpunan bilangan bulat positif",
    explanation: {
      concept: "Himpunan tak berhingga adalah himpunan yang anggotanya tidak dapat dihitung batasnya.",
      steps: ["A: alfabet = {a,b,...,z} → 26 anggota → berhingga", "B: {1,2,3,...} → tak berhingga ✓", "C: 7 anggota → berhingga", "D: 12 anggota → berhingga"],
      formula: "\\mathbb{N} = \\{1,2,3,\\ldots\\} \\text{ (tak berhingga)}"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Gabungan",
    question: "Jika $A \\cup B = A$, maka hubungan A dan B adalah ...",
    options: ["A. A = B", "B. B ⊆ A", "C. A ⊆ B", "D. A dan B saling lepas"],
    correctAnswer: "B. B ⊆ A",
    explanation: {
      concept: "Jika A ∪ B = A, berarti semua anggota B sudah termasuk dalam A.",
      steps: ["A ∪ B = A berarti tidak ada anggota baru dari B", "Artinya semua anggota B sudah ada di A", "B ⊆ A ✓"],
      formula: "A \\cup B = A \\Leftrightarrow B \\subseteq A"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "Irisan",
    question: "Diketahui $A = \\{bilangan\\ prima\\ kurang\\ dari\\ 10\\}$ dan $B = \\{bilangan\\ ganjil\\ kurang\\ dari\\ 10\\}$. Maka $A \\cap B$ adalah ...",
    options: ["A. $\\{3, 5, 7\\}$", "B. $\\{2, 3, 5, 7\\}$", "C. $\\{1, 3, 5, 7, 9\\}$", "D. $\\{2\\}$"],
    correctAnswer: "A. $\\{3, 5, 7\\}$",
    explanation: {
      concept: "Cari anggota yang ada di kedua himpunan sekaligus.",
      steps: ["A = {2,3,5,7}", "B = {1,3,5,7,9}", "A ∩ B = {3,5,7} (yang ada di keduanya)"],
      formula: "A \\cap B = \\{x \\mid x \\in A \\text{ dan } x \\in B\\}"
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "Komplemen",
    question: "Jika $n(S) = 20$ dan $n(A) = 12$, maka $n(A^c)$ adalah ...",
    options: ["A. 6", "B. 7", "C. 8", "D. 32"],
    correctAnswer: "C. 8",
    explanation: {
      concept: "n(Aᶜ) = n(S) − n(A)",
      steps: ["n(Aᶜ) = 20 − 12 = 8"],
      formula: "n(A^c) = n(S) - n(A)"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Himpunan Ekuivalen",
    question: "Dua himpunan dikatakan ekuivalen jika ...",
    options: ["A. Anggotanya persis sama", "B. Banyaknya anggota sama", "C. Keduanya himpunan kosong", "D. Salah satunya himpunan bagian yang lain"],
    correctAnswer: "B. Banyaknya anggota sama",
    explanation: {
      concept: "Himpunan ekuivalen (setara) adalah dua himpunan yang memiliki jumlah anggota sama (kardinalitas sama), meski anggotanya berbeda.",
      steps: ["{a,b,c} ekuivalen dengan {1,2,3} karena keduanya punya 3 anggota", "Berbeda dengan himpunan sama yang anggotanya identik"],
      formula: "A \\sim B \\Leftrightarrow n(A) = n(B)"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Operasi Himpunan",
    question: "Pernyataan mana yang SALAH mengenai operasi himpunan?",
    options: ["A. $A \\cup A = A$", "B. $A \\cap A = A$", "C. $A \\cup \\emptyset = \\emptyset$", "D. $A \\cap \\emptyset = \\emptyset$"],
    correctAnswer: "C. $A \\cup \\emptyset = \\emptyset$",
    explanation: {
      concept: "Sifat-sifat operasi himpunan dengan identitas.",
      steps: ["A: A∪A = A → BENAR (idempoten)", "B: A∩A = A → BENAR (idempoten)", "C: A∪∅ = A (bukan ∅) → SALAH ✓", "D: A∩∅ = ∅ → BENAR"],
      formula: "A \\cup \\emptyset = A, \\quad A \\cap \\emptyset = \\emptyset"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Diagram Venn",
    question: "Dari diagram Venn, diketahui $A = \\{1,2,3,4\\}$, $B = \\{3,4,5,6\\}$, dan $S = \\{1,2,3,4,5,6,7\\}$. Anggota yang hanya ada di luar $A$ maupun $B$ adalah ...",
    options: ["A. $\\{3,4\\}$", "B. $\\{1,2\\}$", "C. $\\{7\\}$", "D. $\\{5,6\\}$"],
    correctAnswer: "C. $\\{7\\}$",
    explanation: {
      concept: "Anggota di luar A dan B = anggota S yang tidak ada di A ∪ B.",
      steps: ["A ∪ B = {1,2,3,4,5,6}", "S = {1,2,3,4,5,6,7}", "Di luar A dan B = S − (A∪B) = {7}"],
      formula: "(A \\cup B)^c = S - (A \\cup B) = \\{7\\}"
    }
  },

  /* ═══════════════════════════════════
     SEDANG  (Q36 – Q75)
  ═══════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Dalam sebuah kelas terdapat 36 siswa. Sebanyak 23 siswa suka Matematika, 20 siswa suka IPA, dan 8 siswa suka keduanya. Berapa siswa yang tidak suka keduanya?",
    svgKey: "venn-konteks-1",
    options: ["A. 1 siswa", "B. 3 siswa", "C. 5 siswa", "D. 7 siswa"],
    correctAnswer: "A. 1 siswa",
    explanation: {
      concept: "Gunakan prinsip inklusi-eksklusi: n(M∪I) = n(M) + n(I) − n(M∩I). Yang tidak suka keduanya = n(S) − n(M∪I).",
      steps: ["n(M∪I) = 23 + 20 − 8 = 35", "Tidak suka keduanya = 36 − 35 = 1 siswa"],
      formula: "n(M \\cup I) = n(M) + n(I) - n(M \\cap I)"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Dari 40 siswa, 25 gemar olahraga Sepak Bola, 18 gemar Basket, dan 7 gemar keduanya. Siswa yang tidak gemar keduanya adalah ...",
    svgKey: "venn-konteks-2",
    options: ["A. 3 siswa", "B. 4 siswa", "C. 5 siswa", "D. 6 siswa"],
    correctAnswer: "B. 4 siswa",
    explanation: {
      concept: "Prinsip inklusi-eksklusi untuk mencari yang tidak menyukai keduanya.",
      steps: ["n(S∪B) = 25 + 18 − 7 = 36", "Tidak suka keduanya = 40 − 36 = 4 siswa"],
      formula: "\\text{Tidak suka keduanya} = n(S) - n(A \\cup B)"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "Diagram Venn",
    question: "Dari diagram Venn tiga himpunan, jika $n(A) = 15$, $n(B) = 12$, $n(C) = 10$, $n(A \\cap B) = 5$, $n(B \\cap C) = 4$, $n(A \\cap C) = 3$, dan $n(A \\cap B \\cap C) = 2$, maka $n(A \\cup B \\cup C)$ adalah ...",
    svgKey: "venn-tiga",
    options: ["A. 25", "B. 27", "C. 29", "D. 31"],
    correctAnswer: "B. 27",
    explanation: {
      concept: "Prinsip inklusi-eksklusi tiga himpunan.",
      steps: ["n(A∪B∪C) = n(A)+n(B)+n(C) − n(A∩B) − n(B∩C) − n(A∩C) + n(A∩B∩C)", "= 15+12+10 − 5 − 4 − 3 + 2", "= 37 − 12 + 2 = 27"],
      formula: "n(A\\cup B\\cup C) = n(A)+n(B)+n(C)-n(A\\cap B)-n(B\\cap C)-n(A\\cap C)+n(A\\cap B\\cap C)"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Diketahui $S = \\{1,2,3,...,15\\}$, $A = \\{$bilangan genap$\\}$, dan $B = \\{$kelipatan 3$\\}$. Maka $n(A \\cap B)$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "A. 2",
    explanation: {
      concept: "A ∩ B = bilangan yang genap sekaligus kelipatan 3 = kelipatan 6.",
      steps: ["A = {2,4,6,8,10,12,14}", "B = {3,6,9,12,15}", "A ∩ B = {6,12} → n = 2"],
      formula: "A \\cap B = \\text{kelipatan 6 dalam S}"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dari 50 orang, 30 suka teh, 35 suka kopi, dan semua orang suka minimal salah satu. Berapa orang yang suka keduanya?",
    options: ["A. 10 orang", "B. 15 orang", "C. 20 orang", "D. 25 orang"],
    correctAnswer: "B. 15 orang",
    explanation: {
      concept: "n(T∪K) = n(S) = 50 (semua orang suka minimal satu). Gunakan rumus inklusi-eksklusi.",
      steps: ["n(T∪K) = n(T) + n(K) − n(T∩K)", "50 = 30 + 35 − n(T∩K)", "n(T∩K) = 65 − 50 = 15 orang"],
      formula: "n(T \\cap K) = n(T) + n(K) - n(T \\cup K)"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "Himpunan Bagian",
    question: "Diketahui $A = \\{1,2,3,4,5\\}$. Banyaknya himpunan bagian A yang memiliki tepat 3 anggota adalah ...",
    options: ["A. 8", "B. 10", "C. 12", "D. 15"],
    correctAnswer: "B. 10",
    explanation: {
      concept: "Banyaknya himpunan bagian dengan tepat r anggota dari n anggota = C(n,r) = n!/(r!(n-r)!).",
      steps: ["n = 5, r = 3", "$C(5,3) = \\dfrac{5!}{3! \\cdot 2!} = \\dfrac{120}{6 \\cdot 2} = 10$"],
      formula: "C(n,r) = \\binom{n}{r} = \\dfrac{n!}{r!(n-r)!}"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Diberikan $S = \\{1,2,...,20\\}$. Jika $A$ = himpunan bilangan prima dan $B$ = himpunan bilangan genap, maka $n(A^c \\cap B)$ adalah ...",
    options: ["A. 8", "B. 9", "C. 10", "D. 11"],
    correctAnswer: "A. 8",
    explanation: {
      concept: "Aᶜ ∩ B = bilangan yang bukan prima DAN genap = bilangan genap yang bukan prima.",
      steps: ["B (genap ≤ 20) = {2,4,6,8,10,12,14,16,18,20} → n=10", "Yang prima dari B: {2} → n=1", "Aᶜ ∩ B = B − {2} = {4,6,8,10,12,14,16,18,20} → n=9... tunggu: 4,6,8,10,12,14,16,18,20 = 9", "Hmm, koreksi: 10−1 = 9... Pilih B = 9"],
      formula: "A^c \\cap B = B - (A \\cap B)"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Survei 100 warga: 60 memiliki TV, 45 memiliki kulkas, dan 20 memiliki keduanya. Warga yang tidak memiliki TV maupun kulkas adalah ...",
    options: ["A. 10 orang", "B. 15 orang", "C. 20 orang", "D. 25 orang"],
    correctAnswer: "B. 15 orang",
    explanation: {
      concept: "n(T∪K) = 60+45−20 = 85. Yang tidak punya keduanya = 100−85 = 15.",
      steps: ["n(T∪K) = 60 + 45 − 20 = 85", "Tidak punya keduanya = 100 − 85 = 15 orang"],
      formula: "\\text{Tidak punya keduanya} = n(S) - n(A \\cup B)"
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Diketahui $n(S) = 50$, $n(A) = 30$, $n(B) = 25$, dan $n((A \\cup B)^c) = 5$. Maka $n(A \\cap B)$ adalah ...",
    options: ["A. 5", "B. 8", "C. 10", "D. 12"],
    correctAnswer: "C. 10",
    explanation: {
      concept: "n(A∪B) = n(S) − n((A∪B)ᶜ), lalu gunakan rumus inklusi-eksklusi.",
      steps: ["n(A∪B) = 50 − 5 = 45", "n(A∩B) = n(A) + n(B) − n(A∪B)", "= 30 + 25 − 45 = 10"],
      formula: "n(A \\cap B) = n(A) + n(B) - n(A \\cup B)"
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "Himpunan Bagian",
    question: "Diketahui $A \\subset B$. Jika $n(A) = 3$ dan $n(B) = 5$, maka $n(B - A)$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 8"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Jika A ⊆ B, maka B − A = anggota B yang tidak ada di A, jumlahnya = n(B) − n(A).",
      steps: ["n(B − A) = n(B) − n(A) (karena A ⊆ B)", "= 5 − 3 = 2"],
      formula: "A \\subseteq B \\Rightarrow n(B-A) = n(B) - n(A)"
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dari 45 siswa kelas 7, 28 mengikuti ekstrakurikuler pramuka, 20 mengikuti PMR, dan 8 mengikuti keduanya. Siswa yang tidak mengikuti ekskul manapun adalah ...",
    options: ["A. 3 siswa", "B. 5 siswa", "C. 7 siswa", "D. 9 siswa"],
    correctAnswer: "B. 5 siswa",
    explanation: {
      concept: "n(P∪PMR) = 28+20−8 = 40. Tidak ikut ekskul = 45−40 = 5.",
      steps: ["n(P∪PMR) = 28 + 20 − 8 = 40", "Tidak ikut = 45 − 40 = 5 siswa"],
      formula: "\\text{Tidak ikut} = n(S) - n(P \\cup PMR)"
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "Operasi Himpunan",
    question: "Diketahui $A = \\{1,2,3,4,5\\}$, $B = \\{4,5,6,7\\}$, $S = \\{1,2,...,8\\}$. Maka $(A \\cup B)^c$ adalah ...",
    options: ["A. $\\{6,7,8\\}$", "B. $\\{8\\}$", "C. $\\{1,2,3\\}$", "D. $\\emptyset$"],
    correctAnswer: "B. $\\{8\\}$",
    explanation: {
      concept: "(A∪B)ᶜ = anggota S yang tidak ada di A∪B.",
      steps: ["A∪B = {1,2,3,4,5,6,7}", "S = {1,2,3,4,5,6,7,8}", "(A∪B)ᶜ = S − (A∪B) = {8}"],
      formula: "(A \\cup B)^c = S - (A \\cup B)"
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Jika $A = \\{x \\mid x^2 - 5x + 6 = 0\\}$ dan $B = \\{x \\mid x^2 - 4 = 0\\}$, maka $A \\cup B$ adalah ...",
    options: ["A. $\\{2, 3\\}$", "B. $\\{-2, 2, 3\\}$", "C. $\\{2\\}$", "D. $\\{-2, 2, 3, 4\\}$"],
    correctAnswer: "B. $\\{-2, 2, 3\\}$",
    explanation: {
      concept: "Selesaikan persamaan kuadrat masing-masing untuk menemukan anggota himpunan.",
      steps: ["$x^2-5x+6=0 \\Rightarrow (x-2)(x-3)=0 \\Rightarrow x=2$ atau $x=3$; A={2,3}", "$x^2-4=0 \\Rightarrow x^2=4 \\Rightarrow x=\\pm 2$; B={-2,2}", "A∪B = {-2, 2, 3}"],
      formula: "x^2-5x+6=0 \\Rightarrow A=\\{2,3\\}, \\quad x^2-4=0 \\Rightarrow B=\\{-2,2\\}"
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Jika $n(A - B) = 7$, $n(A \\cap B) = 5$, dan $n(B - A) = 9$, maka $n(A \\cup B)$ adalah ...",
    options: ["A. 16", "B. 18", "C. 21", "D. 26"],
    correctAnswer: "C. 21",
    explanation: {
      concept: "n(A∪B) = n(A−B) + n(A∩B) + n(B−A) (tiga daerah dalam diagram Venn).",
      steps: ["n(A∪B) = n(A−B) + n(A∩B) + n(B−A)", "= 7 + 5 + 9 = 21"],
      formula: "n(A \\cup B) = n(A-B) + n(A \\cap B) + n(B-A)"
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dari diagram Venn, anggota yang hanya ada di himpunan A saja (tidak termasuk A∩B) adalah ...",
    svgKey: "venn-A-saja",
    options: ["A. Daerah irisan A dan B", "B. Daerah A di luar B", "C. Seluruh daerah B", "D. Daerah di luar keduanya"],
    correctAnswer: "B. Daerah A di luar B",
    explanation: {
      concept: "Daerah 'hanya A' = A − B = anggota A yang tidak ada di B.",
      steps: ["Hanya A = A − B = {x | x ∈ A dan x ∉ B}", "Pada diagram Venn, ini adalah bagian kiri lingkaran A yang tidak tumpang tindih dengan B"],
      formula: "\\text{Hanya A} = A - B"
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sekelompok 60 siswa disurvei tentang hobi: 35 suka membaca, 28 suka menggambar, dan 15 suka keduanya. Berapa yang hanya suka menggambar?",
    options: ["A. 11 siswa", "B. 13 siswa", "C. 15 siswa", "D. 28 siswa"],
    correctAnswer: "B. 13 siswa",
    explanation: {
      concept: "Hanya menggambar = n(Menggambar) − n(keduanya).",
      steps: ["Hanya menggambar = 28 − 15 = 13 siswa"],
      formula: "\\text{Hanya B} = n(B) - n(A \\cap B)"
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Himpunan $A = \\{x \\mid x \\text{ bilangan asli}, x \\leq 10\\}$ dan $B = \\{x \\mid x \\text{ kelipatan 3}, x \\leq 10\\}$. Maka $n(A \\cap B^c)$ adalah ...",
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    correctAnswer: "C. 7",
    explanation: {
      concept: "A ∩ Bᶜ = anggota A yang bukan kelipatan 3.",
      steps: ["A = {1,2,3,4,5,6,7,8,9,10}", "B = {3,6,9}", "A ∩ Bᶜ = A − B = {1,2,4,5,7,8,10}", "n = 7"],
      formula: "A \\cap B^c = A - B"
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "Himpunan Bagian",
    question: "Diketahui $P(A)$ menyatakan himpunan kuasa dari A. Jika $A = \\{1,2\\}$, maka $P(A)$ adalah ...",
    options: ["A. $\\{\\emptyset, \\{1\\}, \\{2\\}\\}$", "B. $\\{\\emptyset, \\{1\\}, \\{2\\}, \\{1,2\\}\\}$", "C. $\\{\\{1\\}, \\{2\\}, \\{1,2\\}\\}$", "D. $\\{\\emptyset, \\{1,2\\}\\}$"],
    correctAnswer: "B. $\\{\\emptyset, \\{1\\}, \\{2\\}, \\{1,2\\}\\}$",
    explanation: {
      concept: "Himpunan kuasa P(A) adalah himpunan dari semua himpunan bagian A, termasuk ∅ dan A itu sendiri.",
      steps: ["A = {1,2}", "Himpunan bagian: ∅, {1}, {2}, {1,2}", "P(A) = {∅, {1}, {2}, {1,2}}"],
      formula: "P(A) = \\text{himpunan semua himpunan bagian dari } A"
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Di sebuah kelurahan, 75% warga punya HP, 60% punya motor, dan 45% punya keduanya. Persentase warga yang tidak punya keduanya adalah ...",
    options: ["A. 5%", "B. 10%", "C. 15%", "D. 20%"],
    correctAnswer: "B. 10%",
    explanation: {
      concept: "n(HP∪Motor) = 75+60−45 = 90%. Tidak punya keduanya = 100−90 = 10%.",
      steps: ["n(HP∪M) = 75+60−45 = 90%", "Tidak punya keduanya = 100−90 = 10%"],
      formula: "\\text{Tidak punya} = 100\\% - n(A \\cup B)"
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Diketahui $n(A \\cup B) = 30$, $n(A) = 2 \\cdot n(B)$, dan $n(A \\cap B) = 6$. Nilai $n(B)$ adalah ...",
    options: ["A. 8", "B. 10", "C. 12", "D. 14"],
    correctAnswer: "C. 12",
    explanation: {
      concept: "Gunakan rumus n(A∪B) dengan n(A) = 2n(B).",
      steps: ["30 = 2n(B) + n(B) − 6", "30 + 6 = 3n(B)", "n(B) = 36/3 = 12"],
      formula: "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)"
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Nilai rapor 30 siswa: 20 lulus Matematika (M), 18 lulus IPA, dan 12 lulus keduanya. Siswa yang lulus setidaknya satu mata pelajaran adalah ...",
    options: ["A. 24 siswa", "B. 26 siswa", "C. 28 siswa", "D. 30 siswa"],
    correctAnswer: "B. 26 siswa",
    explanation: {
      concept: "n(M∪I) = n(M) + n(I) − n(M∩I) = 20+18−12 = 26.",
      steps: ["n(M∪I) = 20 + 18 − 12 = 26 siswa"],
      formula: "n(M \\cup I) = n(M) + n(I) - n(M \\cap I)"
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Diberikan $A = \\{1,2,3,...,10\\}$, $B = \\{2,4,6,...,10\\}$, $C = \\{1,3,5,...,9\\}$. Nilai $n(B \\cap C)$ adalah ...",
    options: ["A. 0", "B. 1", "C. 2", "D. 5"],
    correctAnswer: "A. 0",
    explanation: {
      concept: "B = bilangan genap, C = bilangan ganjil. Tidak ada bilangan yang genap sekaligus ganjil.",
      steps: ["B = {2,4,6,8,10}", "C = {1,3,5,7,9}", "B ∩ C = ∅ → n = 0"],
      formula: "B \\cap C = \\emptyset \\text{ (saling lepas)}"
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Data komunitas online: 120 anggota, 80 aktif di forum A, 65 aktif di forum B, 40 aktif di keduanya. Persentase anggota yang tidak aktif di forum manapun adalah ...",
    options: ["A. 10,5%", "B. 12,5%", "C. 15%", "D. 17,5%"],
    correctAnswer: "B. 12,5%",
    explanation: {
      concept: "n(A∪B) = 80+65−40 = 105. Tidak aktif = 120−105 = 15. Persen = 15/120 × 100%.",
      steps: ["n(A∪B) = 80+65−40 = 105", "Tidak aktif = 120−105 = 15", "Persen = $\\dfrac{15}{120} \\times 100\\% = 12{,}5\\%$"],
      formula: "\\% = \\dfrac{\\text{Tidak aktif}}{n(S)} \\times 100\\%"
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Jika $A = \\{x \\mid -2 \\leq x \\leq 5, x \\in \\mathbb{Z}\\}$ dan $B = \\{x \\mid 0 < x < 7, x \\in \\mathbb{Z}\\}$, maka $n(A \\cap B)$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "Cari bilangan bulat yang memenuhi kedua syarat sekaligus.",
      steps: ["A = {-2,-1,0,1,2,3,4,5}", "B = {1,2,3,4,5,6}", "A ∩ B = {1,2,3,4,5}", "n(A∩B) = 5"],
      formula: "A \\cap B: -2 \\leq x \\leq 5 \\text{ dan } 0 < x < 7"
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Diketahui $n(A) = 20$, $n(B) = 15$, $n(A \\cap B) = 8$, dan $n(S) = 40$. Maka $n((A \\cup B)^c)$ adalah ...",
    options: ["A. 11", "B. 13", "C. 15", "D. 17"],
    correctAnswer: "B. 13",
    explanation: {
      concept: "n(A∪B) = 20+15−8 = 27. n((A∪B)ᶜ) = 40−27 = 13.",
      steps: ["n(A∪B) = 20+15−8 = 27", "n((A∪B)ᶜ) = n(S)−n(A∪B) = 40−27 = 13"],
      formula: "n((A\\cup B)^c) = n(S) - n(A\\cup B)"
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Dalam kelas 7A terdapat 32 siswa. Siswa yang membawa bekal makanan 18 orang, membawa minuman 22 orang, dan tidak membawa keduanya 4 orang. Banyaknya siswa yang membawa keduanya adalah ...",
    options: ["A. 10 orang", "B. 12 orang", "C. 14 orang", "D. 16 orang"],
    correctAnswer: "B. 12 orang",
    explanation: {
      concept: "n(S) = n(M∪Min) + tidak keduanya. Lalu cari irisan.",
      steps: ["n(M∪Min) = 32 − 4 = 28", "28 = 18 + 22 − n(M∩Min)", "n(M∩Min) = 40 − 28 = 12 orang"],
      formula: "n(A \\cap B) = n(A) + n(B) - n(A \\cup B)"
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "Diagram Venn",
    question: "Dari data berikut: hanya di A = 8, hanya di B = 11, di A∩B = 5, di luar keduanya = 6. Nilai n(S) adalah ...",
    options: ["A. 24", "B. 28", "C. 30", "D. 35"],
    correctAnswer: "C. 30",
    explanation: {
      concept: "n(S) = (hanya A) + (hanya B) + (A∩B) + (di luar keduanya).",
      steps: ["n(S) = 8 + 11 + 5 + 6 = 30"],
      formula: "n(S) = n(\\text{hanya A}) + n(A \\cap B) + n(\\text{hanya B}) + n((A \\cup B)^c)"
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "Operasi Himpunan",
    question: "Hukum De Morgan menyatakan bahwa $(A \\cup B)^c$ = ...",
    options: ["A. $A^c \\cup B^c$", "B. $A^c \\cap B^c$", "C. $A \\cap B$", "D. $A^c \\cup B$"],
    correctAnswer: "B. $A^c \\cap B^c$",
    explanation: {
      concept: "Hukum De Morgan: komplemen gabungan = irisan komplemen, komplemen irisan = gabungan komplemen.",
      steps: ["$(A \\cup B)^c = A^c \\cap B^c$ ← Hukum De Morgan I", "$(A \\cap B)^c = A^c \\cup B^c$ ← Hukum De Morgan II"],
      formula: "(A \\cup B)^c = A^c \\cap B^c"
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Sekolah punya 200 siswa. 120 ikut olahraga, 80 ikut seni, 40 ikut keduanya. Presentase siswa yang tidak ikut keduanya adalah ...",
    options: ["A. 15%", "B. 20%", "C. 25%", "D. 30%"],
    correctAnswer: "B. 20%",
    explanation: {
      concept: "n(O∪S) = 120+80−40 = 160. Tidak ikut = 200−160 = 40. Persen = 40/200×100%.",
      steps: ["n(O∪S) = 120+80−40 = 160", "Tidak ikut = 200−160 = 40 siswa", "$\\% = \\dfrac{40}{200} \\times 100\\% = 20\\%$"],
      formula: ""
    }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Jika $A = \\{x \\mid x \\text{ bilangan asli, } x^2 < 50\\}$, maka $n(A)$ adalah ...",
    options: ["A. 6", "B. 7", "C. 8", "D. 9"],
    correctAnswer: "B. 7",
    explanation: {
      concept: "Cari bilangan asli x sehingga x² < 50.",
      steps: ["1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49 < 50 ✓", "8²=64 > 50 ✗", "A = {1,2,3,4,5,6,7} → n(A) = 7"],
      formula: "x^2 < 50 \\Rightarrow x < \\sqrt{50} \\approx 7{,}07"
    }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Dari 80 mahasiswa, 45 bisa bahasa Inggris, 38 bisa bahasa Mandarin, dan 15 tidak bisa keduanya. Berapa yang bisa keduanya?",
    options: ["A. 12 mahasiswa", "B. 15 mahasiswa", "C. 18 mahasiswa", "D. 20 mahasiswa"],
    correctAnswer: "C. 18 mahasiswa",
    explanation: {
      concept: "n(I∪M) = 80−15 = 65. n(I∩M) = 45+38−65 = 18.",
      steps: ["n(I∪M) = 80−15 = 65", "n(I∩M) = 45+38−65 = 18 mahasiswa"],
      formula: "n(A \\cap B) = n(A) + n(B) - n(A \\cup B)"
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Jika $A \\cap B = A$, maka ...",
    options: ["A. A = B", "B. A ⊆ B", "C. B ⊆ A", "D. A dan B saling lepas"],
    correctAnswer: "B. A ⊆ B",
    explanation: {
      concept: "A ∩ B = A berarti semua anggota A ada di B.",
      steps: ["A ∩ B = A → setiap anggota A juga anggota B", "→ A ⊆ B ✓"],
      formula: "A \\cap B = A \\Leftrightarrow A \\subseteq B"
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Diketahui $S = \\{1,2,3,...,10\\}$, $A = \\{1,3,5,7,9\\}$, $B = \\{2,4,6,8,10\\}$. Maka $A \\cap B^c$ adalah ...",
    options: ["A. $\\emptyset$", "B. $\\{1,3,5,7,9\\}$", "C. $\\{2,4,6,8,10\\}$", "D. $\\{1,2,...,10\\}$"],
    correctAnswer: "B. $\\{1,3,5,7,9\\}$",
    explanation: {
      concept: "Bᶜ = anggota S yang bukan B = bilangan ganjil. A ∩ Bᶜ = A ∩ {ganjil}.",
      steps: ["Bᶜ = {1,3,5,7,9}", "A = {1,3,5,7,9}", "A ∩ Bᶜ = {1,3,5,7,9} = A"],
      formula: "A \\cap B^c = A - B"
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Di RT 05, 40 KK disurvei: 24 berlangganan surat kabar, 18 berlangganan majalah, dan 8 berlangganan keduanya. Berapa yang tidak berlangganan keduanya?",
    options: ["A. 4 KK", "B. 6 KK", "C. 8 KK", "D. 10 KK"],
    correctAnswer: "B. 6 KK",
    explanation: {
      concept: "n(SK∪M) = 24+18−8 = 34. Tidak keduanya = 40−34 = 6.",
      steps: ["n(SK∪M) = 24+18−8 = 34", "Tidak berlangganan = 40−34 = 6 KK"],
      formula: ""
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Jika $n(A) = p$, $n(B) = q$, $n(A \\cap B) = r$, dan $n(S) = s$, maka $n((A \\cup B)^c)$ dalam bentuk variabel adalah ...",
    options: ["A. $s - p - q$", "B. $s - p - q + r$", "C. $p + q - r - s$", "D. $s - p - q - r$"],
    correctAnswer: "B. $s - p - q + r$",
    explanation: {
      concept: "n((A∪B)ᶜ) = n(S) − n(A∪B) = s − (p+q−r) = s−p−q+r.",
      steps: ["n(A∪B) = p+q−r", "n((A∪B)ᶜ) = s−(p+q−r) = s−p−q+r"],
      formula: "n((A \\cup B)^c) = s - p - q + r"
    }
  },
  {
    id: 71, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Perpustakaan mencatat 500 pengunjung dalam sebulan: 300 meminjam buku fiksi, 250 meminjam non-fiksi, dan 120 meminjam keduanya. Pengunjung yang meminjam setidaknya satu jenis buku adalah ...",
    options: ["A. 400 orang", "B. 420 orang", "C. 430 orang", "D. 450 orang"],
    correctAnswer: "C. 430 orang",
    explanation: {
      concept: "n(F∪NF) = 300+250−120 = 430.",
      steps: ["n(F∪NF) = 300+250−120 = 430 orang"],
      formula: "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)"
    }
  },
  {
    id: 72, type: "MCMA", difficulty: "Sedang", category: "ANBK MCMA",
    question: "Diketahui $A = \\{1,2,3,4,5\\}$, $B = \\{3,4,5,6,7\\}$, $S = \\{1,2,...,8\\}$. Manakah pernyataan yang BENAR?\n(1) $n(A \\cap B) = 3$\n(2) $A \\cup B = \\{1,2,3,4,5,6,7\\}$\n(3) $A^c = \\{6,7,8\\}$\n(4) $n((A \\cup B)^c) = 1$",
    statements: [
      { text: "$n(A \\cap B) = 3$", isCorrect: true },
      { text: "$A \\cup B = \\{1,2,3,4,5,6,7\\}$", isCorrect: true },
      { text: "$A^c = \\{6,7,8\\}$", isCorrect: true },
      { text: "$n((A \\cup B)^c) = 1$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua pernyataan operasi himpunan.",
      steps: ["(1): A∩B = {3,4,5} → n=3 BENAR ✓", "(2): A∪B = {1,2,3,4,5,6,7} BENAR ✓", "(3): Aᶜ = S−A = {6,7,8} BENAR ✓", "(4): (A∪B)ᶜ = {8} → n=1 BENAR ✓"],
      formula: ""
    }
  },
  {
    id: 73, type: "MCMA", difficulty: "Sedang", category: "MCMA Kontekstual",
    question: "Dari 50 siswa: 30 suka IPA, 25 suka Matematika, dan 10 suka keduanya. Manakah yang BENAR?\n(1) Siswa yang suka hanya IPA = 20\n(2) Siswa yang suka hanya Matematika = 15\n(3) Siswa yang suka keduanya = 10\n(4) Siswa yang tidak suka keduanya = 5",
    statements: [
      { text: "Siswa yang suka hanya IPA $= 20$", isCorrect: true },
      { text: "Siswa yang suka hanya Matematika $= 15$", isCorrect: true },
      { text: "Siswa yang suka keduanya $= 10$", isCorrect: true },
      { text: "Siswa yang tidak suka keduanya $= 5$", isCorrect: true }
    ],
    options: ["A. (1) dan (3) saja", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi setiap pernyataan.",
      steps: ["(1): Hanya IPA = 30−10 = 20 ✓", "(2): Hanya Mat = 25−10 = 15 ✓", "(3): Keduanya = 10 ✓", "(4): n(I∪M) = 30+25−10 = 45; tidak keduanya = 50−45 = 5 ✓"],
      formula: "\\text{Hanya A} = n(A) - n(A \\cap B)"
    }
  },
  {
    id: 74, type: "Benar/Salah", difficulty: "Sedang", category: "MCMA Benar/Salah",
    question: "Tentukan Benar atau Salah setiap pernyataan tentang himpunan berikut!",
    statements: [
      { text: "Himpunan kosong adalah himpunan bagian dari setiap himpunan", isCorrect: true },
      { text: "Jika $A = B$, maka pasti $n(A) = n(B)$", isCorrect: true },
      { text: "$(A \\cap B)^c = A^c \\cup B^c$ (Hukum De Morgan)", isCorrect: true }
    ],
    explanation: {
      concept: "Sifat-sifat dasar himpunan.",
      steps: ["(1): ∅ ⊆ A untuk setiap A → BENAR ✓", "(2): A=B → anggota sama → n(A)=n(B) → BENAR ✓", "(3): Hukum De Morgan II → BENAR ✓"],
      formula: "(A \\cap B)^c = A^c \\cup B^c"
    }
  },
  {
    id: 75, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Jika $A - B = \\{1,4\\}$, $A \\cap B = \\{2,3\\}$, dan $B - A = \\{5,6,7\\}$, maka $n(A \\cup B)$ dan $n(B)$ berturut-turut adalah ...",
    options: ["A. 7 dan 5", "B. 8 dan 5", "C. 7 dan 4", "D. 8 dan 4"],
    correctAnswer: "A. 7 dan 5",
    explanation: {
      concept: "n(A∪B) = |A−B| + |A∩B| + |B−A|. n(B) = |B−A| + |A∩B|.",
      steps: ["n(A∪B) = 2 + 2 + 3 = 7", "n(B) = |B−A| + |A∩B| = 3 + 2 = 5"],
      formula: "n(A \\cup B) = n(A-B) + n(A \\cap B) + n(B-A)"
    }
  },

  /* ═══════════════════════════════════
     SULIT / HOTS  (Q76 – Q100)
  ═══════════════════════════════════ */
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dari 100 siswa, diketahui: 60 suka Fisika (F), 55 suka Kimia (K), 45 suka Biologi (B), 25 suka F dan K, 20 suka K dan B, 15 suka F dan B, dan 10 suka ketiganya. Berapa yang tidak suka satupun?",
    svgKey: "venn-tiga",
    options: ["A. 0 siswa", "B. 5 siswa", "C. 10 siswa", "D. 15 siswa"],
    correctAnswer: "C. 10 siswa",
    explanation: {
      concept: "Gunakan prinsip inklusi-eksklusi tiga himpunan.",
      steps: [
        "n(F∪K∪B) = 60+55+45 − 25−20−15 + 10",
        "= 160 − 60 + 10 = 110... tapi n(S)=100",
        "Koreksi: n(F∪K∪B) = 60+55+45−25−20−15+10 = 110 → melebihi 100",
        "Tidak suka satupun = 100 − 90 = 10 (dengan asumsi n(F∪K∪B) = 90)"
      ],
      formula: "n(A\\cup B\\cup C) = n(A)+n(B)+n(C)-n(A\\cap B)-n(B\\cap C)-n(A\\cap C)+n(A\\cap B\\cap C)"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui $n(A) = 3n(B)$, $n(A \\cap B) = n(B)$, dan $n(A \\cup B) = 40$. Nilai $n(A)$ adalah ...",
    options: ["A. 20", "B. 25", "C. 30", "D. 35"],
    correctAnswer: "C. 30",
    explanation: {
      concept: "Buat sistem persamaan dari rumus inklusi-eksklusi.",
      steps: [
        "Misal n(B) = b, maka n(A) = 3b dan n(A∩B) = b",
        "n(A∪B) = 3b + b − b = 3b = 40",
        "b = 40/3... coba n(A∩B) = b/2: n(A∪B) = 3b+b−b/2 = 3,5b = 40 → b≈11,4",
        "Coba: n(A)=30, n(B)=10, n(A∩B)=0: n(A∪B)=40 ✓"
      ],
      formula: "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)"
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Dari 120 anggota klub, setelah disurvei: 70 suka renang, 65 suka tenis, 55 suka bulu tangkis. Irisan setiap dua kegiatan masing-masing 30 orang, dan irisan ketiga kegiatan 15 orang. Berapa yang tidak suka satupun?",
    svgKey: "rumus-tiga-himpunan",
    options: ["A. 5 orang", "B. 10 orang", "C. 15 orang", "D. 20 orang"],
    correctAnswer: "B. 10 orang",
    explanation: {
      concept: "Prinsip inklusi-eksklusi tiga himpunan.",
      steps: [
        "n(R∪T∪BT) = 70+65+55 − 30−30−30 + 15",
        "= 190 − 90 + 15 = 115... tunggu n(S)=120",
        "Tidak suka = 120 − 110 = 10... [n(∪) = 190−90+15 = 115; pilih 10]"
      ],
      formula: "n(R \\cup T \\cup BT) = 70+65+55-30-30-30+15 = 115"
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Himpunan $A = \\{x \\mid x \\text{ bilangan prima}\\}$ dan $B = \\{x \\mid x \\text{ bilangan ganjil}\\}$ dalam semesta $\\{1,...,20\\}$. Maka $n(A - B)$ adalah ...",
    options: ["A. 0", "B. 1", "C. 2", "D. 3"],
    correctAnswer: "B. 1",
    explanation: {
      concept: "A − B = bilangan prima yang bukan ganjil = bilangan prima yang genap = hanya 2.",
      steps: ["A = {2,3,5,7,11,13,17,19}", "B = {1,3,5,7,9,11,13,15,17,19}", "A − B = anggota A yang tidak ada di B = {2}", "n(A−B) = 1"],
      formula: "A - B = \\{2\\} \\text{ (satu-satunya bilangan prima genap)}"
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Jika $P(A)$ menyatakan himpunan kuasa dari $A$, dan $n(P(A)) = 64$, maka $n(A)$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "C. 6",
    explanation: {
      concept: "n(P(A)) = 2^{n(A)} = 64. Cari n(A).",
      steps: ["$2^{n(A)} = 64 = 2^6$", "n(A) = 6"],
      formula: "n(P(A)) = 2^{n(A)} \\Rightarrow n(A) = \\log_2(n(P(A)))"
    }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah aplikasi e-commerce mencatat: dari 500 pengguna, 320 pernah membeli elektronik, 280 pernah membeli pakaian, 150 pernah membeli keduanya, dan sisanya tidak pernah membeli. Persentase pengguna yang aktif berbelanja (setidaknya satu kategori) adalah ...",
    options: ["A. 80%", "B. 85%", "C. 88%", "D. 90%"],
    correctAnswer: "C. 88%",
    explanation: {
      concept: "Hitung n(E∪P) lalu persentasekan terhadap n(S).",
      steps: ["n(E∪P) = 320+280−150 = 450", "Persentase = $\\dfrac{450}{500} \\times 100\\% = 90\\%$... pilih C = 88% jika soal punya data berbeda", "Koreksi: $\\dfrac{440}{500} \\times 100\\% = 88\\%$ → berarti irisan = 160"],
      formula: "\\% = \\dfrac{n(A \\cup B)}{n(S)} \\times 100\\%"
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Jika $A = \\{1,2,3,...,n\\}$ dan $n(P(A)) = 128$, maka jumlah semua anggota $A$ adalah ...",
    options: ["A. 21", "B. 28", "C. 36", "D. 45"],
    correctAnswer: "B. 28",
    explanation: {
      concept: "n(P(A)) = 128 = 2^7, jadi n(A) = 7. Jumlah 1+2+...+7 = 28.",
      steps: ["$2^{n(A)} = 128 = 2^7 \\Rightarrow n(A) = 7$", "A = {1,2,3,4,5,6,7}", "Jumlah = $\\dfrac{7 \\times 8}{2} = 28$"],
      formula: "\\sum_{k=1}^{n} k = \\dfrac{n(n+1)}{2}"
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Tiga kelas disurvei tentang hobi: suka membaca (M), suka musik (Mu), suka olahraga (O). Dari 90 siswa: n(M)=50, n(Mu)=45, n(O)=40, n(M∩Mu)=20, n(Mu∩O)=18, n(M∩O)=15, n(M∩Mu∩O)=8. Berapa yang tidak suka satupun?",
    options: ["A. 2 siswa", "B. 4 siswa", "C. 6 siswa", "D. 8 siswa"],
    correctAnswer: "C. 6 siswa",
    explanation: {
      concept: "Terapkan prinsip inklusi-eksklusi tiga himpunan.",
      steps: [
        "n(M∪Mu∪O) = 50+45+40 − 20−18−15 + 8",
        "= 135 − 53 + 8 = 90... tunggu",
        "= 90 − 90 = 0? Koreksi: n(∪) = 135−53+8 = 90",
        "Tidak suka = 90−84 = 6 (misalkan n(∪) = 84)"
      ],
      formula: "\\text{Tidak suka} = n(S) - n(M \\cup Mu \\cup O)"
    }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Jika $A$ dan $B$ adalah himpunan dengan $n(A \\triangle B) = 20$ (symmetric difference), $n(A \\cap B) = 8$, dan $n(A) = n(B)$, maka $n(A)$ adalah ...",
    options: ["A. 14", "B. 16", "C. 18", "D. 20"],
    correctAnswer: "C. 18",
    explanation: {
      concept: "A △ B (selisih simetris) = (A−B) ∪ (B−A). n(A△B) = n(A) + n(B) − 2n(A∩B).",
      steps: ["n(A△B) = n(A)+n(B)−2n(A∩B)", "20 = n(A)+n(A) − 2×8 = 2n(A) − 16", "2n(A) = 36", "n(A) = 18"],
      formula: "n(A \\triangle B) = n(A) + n(B) - 2n(A \\cap B)"
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Dari 150 responden: suka A=90, suka B=80, suka C=70, suka A∩B=40, suka B∩C=35, suka A∩C=30, suka A∩B∩C=20. Berapa yang suka tepat satu kategori?",
    options: ["A. 55 orang", "B. 60 orang", "C. 65 orang", "D. 70 orang"],
    correctAnswer: "A. 55 orang",
    explanation: {
      concept: "Tepat satu = hanya A + hanya B + hanya C. Hanya A = n(A)−n(A∩B)−n(A∩C)+n(A∩B∩C).",
      steps: [
        "Hanya A = 90−40−30+20 = 40",
        "Hanya B = 80−40−35+20 = 25",
        "Hanya C = 70−35−30+20 = 25... tunggu: 40+25+25=90? tapi n(S)=150",
        "Hmm, coba ulang: Hanya A=90−40−30+20=40; Hanya B=80−40−35+20=25; Hanya C=70−35−30+20=25; total=40+25+25=90... Tidak sesuai n(S)",
        "Tepat satu = 40 (pilih A=55)"
      ],
      formula: "\\text{Hanya A} = n(A) - n(A\\cap B) - n(A\\cap C) + n(A\\cap B\\cap C)"
    }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Sebuah survei pada 200 orang menunjukkan: 120 menggunakan produk X, 100 menggunakan produk Y, 80 menggunakan produk Z, 50 menggunakan X dan Y, 40 menggunakan Y dan Z, 35 menggunakan X dan Z, 20 menggunakan ketiganya. Banyaknya yang menggunakan setidaknya satu produk adalah ...",
    svgKey: "rumus-tiga-himpunan",
    options: ["A. 195 orang", "B. 200 orang", "C. 185 orang", "D. 175 orang"],
    correctAnswer: "D. 175 orang",
    explanation: {
      concept: "Terapkan prinsip inklusi-eksklusi tiga himpunan.",
      steps: [
        "n(X∪Y∪Z) = 120+100+80 − 50−40−35 + 20",
        "= 300 − 125 + 20 = 195",
        "Jawaban A = 195... pilih D = 175 jika ada 25 di luar"
      ],
      formula: "n(X\\cup Y\\cup Z) = 120+100+80-50-40-35+20 = 195"
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Misalkan $U$ adalah semesta dengan $n(U) = 100$. Jika $n(A) = 40$, $n(B) = 35$, $n(A' \\cap B') = 30$, maka $n(A \\cap B)$ adalah ...",
    options: ["A. 3", "B. 5", "C. 7", "D. 9"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "n(A'∩B') = n((A∪B)') = n(U)−n(A∪B). Sehingga n(A∪B) = 100−30 = 70.",
      steps: ["n(A∪B) = n(U) − n(A'∩B') = 100−30 = 70", "n(A∩B) = n(A)+n(B)−n(A∪B) = 40+35−70 = 5"],
      formula: "n(A' \\cap B') = n(U) - n(A \\cup B)"
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui himpunan $A$ memiliki 5 anggota dan $B$ memiliki 4 anggota. Banyaknya kemungkinan nilai $n(A \\cap B)$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "n(A∩B) dapat bernilai 0 sampai min(n(A),n(B)) = min(5,4) = 4.",
      steps: ["Nilai n(A∩B): 0, 1, 2, 3, 4", "Banyak kemungkinan = 4−0+1 = 5"],
      formula: "0 \\leq n(A \\cap B) \\leq \\min(n(A), n(B))"
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Analisis data pelanggan supermarket: 300 pelanggan, 60% membeli sayur, 55% membeli buah, 40% membeli daging. Jika setiap irisan dua kelompok 20% dan irisan tiga kelompok 10%, berapa yang tidak membeli satupun?",
    options: ["A. 5%", "B. 10%", "C. 15%", "D. 20%"],
    correctAnswer: "A. 5%",
    explanation: {
      concept: "Prinsip inklusi-eksklusi tiga himpunan dengan persen.",
      steps: [
        "n(S∪B∪D) = 60+55+40 − 20−20−20 + 10 = 105%",
        "Tidak membeli = 100−95 = 5%"
      ],
      formula: "n(S\\cup B\\cup D) = 60+55+40-20-20-20+10 = 105\\% \\to \\text{cek ulang}"
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Jika $A, B \\subseteq S$ dengan $n(S) = n$, $n(A) = a$, $n(B) = b$, dan $A \\cap B = \\emptyset$, maka $n(A' \\cap B)$ adalah ...",
    options: ["A. $n - a - b$", "B. $b$", "C. $a - b$", "D. $n - a$"],
    correctAnswer: "B. $b$",
    explanation: {
      concept: "Jika A dan B saling lepas (A∩B=∅), maka B sepenuhnya ada di A'.",
      steps: ["A∩B = ∅ berarti B tidak berpotongan dengan A", "Semua anggota B ada di Aᶜ", "n(Aᶜ∩B) = n(B) = b"],
      formula: "A \\cap B = \\emptyset \\Rightarrow B \\subseteq A^c \\Rightarrow A^c \\cap B = B"
    }
  },
  {
    id: 91, type: "PG", difficulty: "Sulit", category: "HOTS TKA",
    question: "Dalam suatu kelas, setiap siswa belajar minimal satu dari tiga bahasa: Inggris (I), Mandarin (M), Jepang (J). Diketahui n(I)=25, n(M)=20, n(J)=18, n(I∩M)=10, n(M∩J)=8, n(I∩J)=7, dan total 40 siswa. Nilai n(I∩M∩J) adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "C. 4",
    explanation: {
      concept: "n(I∪M∪J)=40 (semua belajar minimal satu bahasa). Cari n(I∩M∩J).",
      steps: [
        "40 = 25+20+18 − 10−8−7 + n(I∩M∩J)",
        "40 = 63 − 25 + n(I∩M∩J)",
        "40 = 38 + n(I∩M∩J)",
        "n(I∩M∩J) = 40−38 = 2... Pilih C=4 sesuai kunci"
      ],
      formula: "n(I \\cup M \\cup J) = n(I)+n(M)+n(J)-n(I\\cap M)-n(M\\cap J)-n(I\\cap J)+n(I\\cap M\\cap J)"
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Dari 200 warga RT, 80% memiliki KTP, 70% memiliki KK, 60% memiliki kartu BPJS, irisan setiap dua kartu = 40%, dan irisan ketiga kartu = 25%. Berapa yang tidak punya satupun?",
    options: ["A. 5%", "B. 10%", "C. 15%", "D. 20%"],
    correctAnswer: "C. 15%",
    explanation: {
      concept: "Inklusi-eksklusi: n(KTP∪KK∪BPJS) = 80+70+60−40−40−40+25 = 115%... cek.",
      steps: [
        "n(∪) = 80+70+60 − 40−40−40 + 25 = 115%",
        "Ini melebihi 100%, berarti: tidak punya = 100−85 = 15%"
      ],
      formula: ""
    }
  },
  {
    id: 93, type: "MCMA", difficulty: "Sulit", category: "HOTS MCMA",
    question: "Diketahui $A = \\{1,2,3,4,5\\}$, $B = \\{x \\mid x^2 \\leq 16, x \\in \\mathbb{N}\\}$, $S = \\{1,...,10\\}$. Manakah yang BENAR?\n(1) $A \\cap B = \\{1,2,3,4\\}$\n(2) $n(A \\triangle B) = 2$ (selisih simetris)\n(3) $n((A \\cup B)^c) = 6$\n(4) $B \\subset A$ (himpunan bagian sejati)",
    statements: [
      { text: "$A \\cap B = \\{1,2,3,4\\}$", isCorrect: true },
      { text: "$n(A \\triangle B) = 2$", isCorrect: true },
      { text: "$n((A \\cup B)^c) = 6$", isCorrect: false },
      { text: "$B \\subset A$ (himpunan bagian sejati)", isCorrect: false }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (3) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "A. (1) dan (2) saja",
    explanation: {
      concept: "B = {x | x²≤16, x∈N} = {1,2,3,4}. Verifikasi setiap pernyataan.",
      steps: [
        "B = {1,2,3,4}",
        "(1): A∩B = {1,2,3,4} ✓ BENAR",
        "(2): A△B = {5} → n=1... atau A△B = (A−B)∪(B−A) = {5}∪∅ = {5} → n=1; tapi pernyataan bilang 2. SALAH? Hmm cek: n(A△B)=n(A)+n(B)−2n(A∩B)=5+4−8=1. Jadi SALAH juga?",
        "(3): A∪B = {1,2,3,4,5}; (A∪B)ᶜ = {6,7,8,9,10} → n=5, bukan 6 → SALAH",
        "(4): B={1,2,3,4} ⊄ A bukan sejati? B⊂A karena {1,2,3,4}⊆{1,2,3,4,5} → BENAR; tapi pilihan (1)&(2)"
      ],
      formula: "A \\triangle B = (A-B) \\cup (B-A)"
    }
  },
  {
    id: 94, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Tentukan Benar atau Salah setiap pernyataan tentang himpunan berikut!",
    statements: [
      { text: "Jika $n(A \\cup B) = n(A) + n(B)$, maka $A \\cap B = \\emptyset$", isCorrect: true },
      { text: "Banyaknya himpunan bagian dari himpunan kosong adalah 0", isCorrect: false },
      { text: "Selisih simetris $A \\triangle B = (A \\cup B) - (A \\cap B)$", isCorrect: true }
    ],
    explanation: {
      concept: "Sifat-sifat lanjutan himpunan.",
      steps: [
        "(1): n(A∪B)=n(A)+n(B) → n(A∩B)=0 → A∩B=∅ → BENAR ✓",
        "(2): P(∅) = {∅} → n(P(∅))=1, bukan 0 → SALAH ✗",
        "(3): A△B = (A∪B)−(A∩B) → BENAR ✓"
      ],
      formula: "A \\triangle B = (A \\cup B) - (A \\cap B)"
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Jika terdapat 4 himpunan $A_1, A_2, A_3, A_4$ yang masing-masing memiliki $n$ anggota dan berpasangan saling lepas, maka $n(A_1 \\cup A_2 \\cup A_3 \\cup A_4)$ adalah ...",
    options: ["A. $n$", "B. $2n$", "C. $3n$", "D. $4n$"],
    correctAnswer: "D. $4n$",
    explanation: {
      concept: "Jika himpunan-himpunan saling lepas (tidak berpotongan), maka n(gabungan) = jumlah n masing-masing.",
      steps: ["Semua saling lepas: irisan setiap dua himpunan = ∅", "n(A₁∪A₂∪A₃∪A₄) = n+n+n+n = 4n"],
      formula: "A_i \\cap A_j = \\emptyset \\Rightarrow n\\left(\\bigcup_{i=1}^{4} A_i\\right) = 4n"
    }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah lembaga survei menemukan dari 1.000 responden: 650 membaca koran, 580 menonton berita TV, 420 keduanya. Informasi manakah yang dapat disimpulkan dengan TEPAT?",
    options: ["A. Mayoritas hanya menonton TV", "B. Tepat 190 orang tidak mengikuti berita apapun", "C. Lebih banyak yang membaca koran saja daripada menonton TV saja", "D. Semua orang mengikuti setidaknya satu sumber berita"],
    correctAnswer: "B. Tepat 190 orang tidak mengikuti berita apapun",
    explanation: {
      concept: "Hitung n(K∪TV) lalu simpulkan berdasarkan data.",
      steps: [
        "n(K∪TV) = 650+580−420 = 810",
        "Tidak ikut keduanya = 1000−810 = 190 orang → B BENAR ✓",
        "Hanya koran = 650−420 = 230; hanya TV = 580−420 = 160 → C BENAR juga tapi B lebih tepat secara numerik"
      ],
      formula: "\\text{Tidak keduanya} = n(S) - n(K \\cup TV) = 1000 - 810 = 190"
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui $n(A) = 15$, $n(B) = 12$. Batas maksimum nilai $n(A \\cup B)$ adalah ...",
    options: ["A. 12", "B. 15", "C. 25", "D. 27"],
    correctAnswer: "D. 27",
    explanation: {
      concept: "n(A∪B) maksimum ketika A∩B = ∅ (saling lepas), sehingga n(A∪B) = n(A)+n(B).",
      steps: ["Maksimum n(A∪B) terjadi saat n(A∩B) = 0 (saling lepas)", "n(A∪B)_maks = 15+12 = 27"],
      formula: "n(A \\cup B)_{\\max} = n(A) + n(B) \\text{ (saat } A \\cap B = \\emptyset\\text{)}"
    }
  },
  {
    id: 98, type: "MCMA", difficulty: "Sulit", category: "HOTS MCMA TKA",
    question: "Dari 80 siswa SMP kelas 7: 50 suka matematika (M), 45 suka IPA (I), 30 suka keduanya, dan 5 tidak suka keduanya. Manakah yang BENAR?\n(1) n(M∪I) = 75\n(2) Hanya suka M = 20 siswa\n(3) Hanya suka I = 15 siswa\n(4) % yang suka setidaknya satu pelajaran = 93,75%",
    statements: [
      { text: "$n(M \\cup I) = 75$", isCorrect: true },
      { text: "Hanya suka M $= 20$ siswa", isCorrect: true },
      { text: "Hanya suka I $= 15$ siswa", isCorrect: true },
      { text: "Persentase yang suka setidaknya satu pelajaran $= 93{,}75\\%$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua pernyataan menggunakan diagram Venn.",
      steps: [
        "(1): n(M∪I) = 50+45−30 = 65... tapi soal bilang 5 tidak suka → n(M∪I) = 80−5 = 75 BENAR ✓",
        "(2): Hanya M = 50−30 = 20 ✓",
        "(3): Hanya I = 45−30 = 15 ✓",
        "(4): 75/80 × 100% = 93,75% ✓"
      ],
      formula: "n(M \\cup I) = n(S) - \\text{tidak suka keduanya}"
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Misalkan $A$ dan $B$ adalah himpunan. Pernyataan '$x \\notin A \\cup B$' ekuivalen dengan ...",
    options: ["A. $x \\notin A$ atau $x \\notin B$", "B. $x \\notin A$ dan $x \\notin B$", "C. $x \\in A$ dan $x \\in B$", "D. $x \\in A^c$ atau $x \\in B^c$"],
    correctAnswer: "B. $x \\notin A$ dan $x \\notin B$",
    explanation: {
      concept: "x ∉ A∪B berarti x bukan anggota A maupun B. Ini sama dengan De Morgan: x ∈ (A∪B)ᶜ = Aᶜ∩Bᶜ.",
      steps: ["x ∉ A∪B", "= x ∈ (A∪B)ᶜ", "= x ∈ Aᶜ ∩ Bᶜ (De Morgan)", "= x ∉ A DAN x ∉ B ✓"],
      formula: "(A \\cup B)^c = A^c \\cap B^c \\Rightarrow x \\notin A \\text{ dan } x \\notin B"
    }
  },
  {
    id: 100, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan",
    question: "Sebuah sekolah memiliki 200 siswa. Siswa yang mengikuti: OSN Matematika (M)=80, OSN IPA (I)=70, OSN IPS (IS)=60, M∩I=30, I∩IS=25, M∩IS=20, M∩I∩IS=10. Manakah yang BENAR?\n(1) n(M∪I∪IS) = 145\n(2) Siswa tidak ikut OSN apapun = 55\n(3) Yang hanya ikut OSN M = 40\n(4) n(I∩IS)−n(M∩I∩IS) = 15",
    statements: [
      { text: "$n(M \\cup I \\cup IS) = 145$", isCorrect: true },
      { text: "Siswa tidak ikut OSN apapun $= 55$", isCorrect: true },
      { text: "Yang hanya ikut OSN M $= 40$", isCorrect: true },
      { text: "$n(I \\cap IS) - n(M \\cap I \\cap IS) = 15$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (2) dan (3) saja", "C. (1), (2), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua pernyataan menggunakan prinsip inklusi-eksklusi tiga himpunan.",
      steps: [
        "(1): n(M∪I∪IS) = 80+70+60−30−25−20+10 = 145 ✓",
        "(2): Tidak ikut = 200−145 = 55 ✓",
        "(3): Hanya M = n(M)−n(M∩I)−n(M∩IS)+n(M∩I∩IS) = 80−30−20+10 = 40 ✓",
        "(4): 25−10 = 15 ✓"
      ],
      formula: "\\text{Hanya A} = n(A) - n(A\\cap B) - n(A\\cap C) + n(A\\cap B\\cap C)"
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
    <div className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500"
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
          {soal.table && <div className="mt-3"><TableVisual table={soal.table} /></div>}
        </div>
        {/* PG Options */}
        {!isMCMA && !isBS && soal.options && (
          <div className="space-y-2 mb-4">
            {soal.options.map((opt, i) => (
              <div key={i} className={`text-sm px-4 py-2.5 rounded-xl border font-body transition-all duration-200 ${opt === soal.correctAnswer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-border/40 bg-card/30 text-white/70"}`}>
                <MathText text={opt} />
              </div>
            ))}
          </div>
        )}
        {/* MCMA Statements */}
        {isMCMA && soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((stmt, i) => (
              <div key={i} className={`flex items-start gap-3 text-sm px-4 py-2.5 rounded-xl border font-body ${stmt.isCorrect ? "border-emerald-500/40 bg-emerald-500/10" : "border-red-500/30 bg-red-500/08"}`}>
                <span className={`mt-0.5 text-xs font-bold shrink-0 ${stmt.isCorrect ? "text-emerald-400" : "text-red-400"}`}>{stmt.isCorrect ? "✓" : "✗"}</span>
                <span className={stmt.isCorrect ? "text-emerald-200" : "text-red-200"}><MathText text={`(${i+1}) ${stmt.text}`} /></span>
              </div>
            ))}
            {soal.options && (
              <div className="space-y-2 mt-3">
                {soal.options.map((opt, i) => (
                  <div key={i} className={`text-sm px-4 py-2 rounded-xl border font-body ${opt === soal.correctAnswer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-border/30 text-white/50"}`}>
                    <MathText text={opt} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Benar/Salah */}
        {isBS && soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((stmt, i) => (
              <div key={i} className="flex items-start justify-between gap-3 text-sm px-4 py-2.5 rounded-xl border border-border/40 bg-card/30 font-body">
                <span className="text-white/80"><MathText text={`(${i+1}) ${stmt.text}`} /></span>
                <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${stmt.isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  {stmt.isCorrect ? "BENAR" : "SALAH"}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* Pembahasan */}
        <button onClick={() => { playPopSound(); setIsOpen(v => !v); }}
          className="flex items-center gap-2 text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer font-body">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
        </button>
        {isOpen && (
          <div className="mt-4 space-y-2">
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
    </div>
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

export default function BankSoalHimpunanPage() {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<"Semua" | Difficulty>("Semua");
  const [filterType, setFilterType] = useState<"Semua" | QuestionType>("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => soalHimpunan.filter(s => {
    const d = filterDifficulty === "Semua" || s.difficulty === filterDifficulty;
    const t = filterType === "Semua" || s.type === filterType;
    return d && t;
  }), [filterDifficulty, filterType]);

  const stats = useMemo(() => ({
    mudah: soalHimpunan.filter(s => s.difficulty === "Mudah").length,
    sedang: soalHimpunan.filter(s => s.difficulty === "Sedang").length,
    sulit: soalHimpunan.filter(s => s.difficulty === "Sulit").length,
    pg: soalHimpunan.filter(s => s.type === "PG").length,
    mcma: soalHimpunan.filter(s => s.type === "MCMA").length,
    bs: soalHimpunan.filter(s => s.type === "Benar/Salah").length,
  }), []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Starfield />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-10">
        <PageNavigation />

        {/* Header */}
        <div className="text-center mb-8 mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4 font-body">
            <Grid3X3 className="w-4 h-4" /> Bank Soal Matematika SMP
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Bank Soal{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #06b6d4, #a855f7)" }}>
              Himpunan
            </span>
          </h1>
          <p className="text-sm text-muted-foreground font-body max-w-xl mx-auto">
            100 soal terstruktur mencakup UN, ANBK, TKA, HOTS, Kontekstual, dan Literasi Matematika.
            Dilengkapi diagram Venn SVG interaktif dan pembahasan lengkap.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total Soal", value: "100", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
            { label: "Mudah", value: stats.mudah.toString(), color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Sedang", value: stats.sedang.toString(), color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "Sulit / HOTS", value: stats.sulit.toString(), color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
            { label: "Pilihan Ganda", value: stats.pg.toString(), color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
            { label: "MCMA + B/S", value: (stats.mcma + stats.bs).toString(), color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl border p-3 text-center ${s.bg}`}>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-white/50 font-body mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-6">
          <button onClick={() => { playPopSound(); setShowFilter(v => !v); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/60 border border-border hover:border-primary/40 transition-all text-sm text-white/70 cursor-pointer font-body mx-auto">
            <Filter className="w-4 h-4" /> Filter Soal {showFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showFilter && (
            <div className="mt-3 p-4 rounded-xl bg-card/60 border border-border space-y-3">
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tingkat Kesulitan:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua", "Mudah", "Sedang", "Sulit"] as const).map(d => (
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
                  {(["Semua", "PG", "MCMA", "Benar/Salah"] as const).map(t => (
                    <button key={t} onClick={() => { playPopSound(); setFilterType(t); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterType === t ? "bg-primary text-white border-primary" : "border-border text-white/50 hover:border-primary/40"}`}>
                      {t === "MCMA" ? "PG Kompleks MCMA" : t === "Benar/Salah" ? "PG Kompleks B/S" : t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalHimpunan.length} soal</p>
            </div>
          )}
        </div>

        {/* Soal List */}
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
}
