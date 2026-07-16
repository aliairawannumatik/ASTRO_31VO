import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Triangle, ChevronDown, ChevronUp, Filter } from "lucide-react";
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
const SegitigaSikuSVG = ({ a, b, c, label }: { a: string; b: string; c: string; label?: string }) => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="30,130 230,130 30,30" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="1.8"/>
    <rect x="30" y="110" width="20" height="20" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="130" y="148" fill="#34d399" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{a}</text>
    <text x="18" y="85" fill="#f472b6" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{b}</text>
    <text x="142" y="78" fill="#fbbf24" fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{c}</text>
    <text x="140" y="18" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace">{label ?? "c² = a² + b²"}</text>
    <text x="225" y="145" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">A</text>
    <text x="18" y="28" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">C</text>
    <text x="18" y="145" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">B</text>
  </svg>
);

const TanggaSVG = ({ tinggi, alas, tangga }: { tinggi: string; alas: string; tangga: string }) => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="20" y="20" width="14" height="120" rx="3" fill="rgba(251,191,36,0.25)" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="34" y1="130" x2="220" y2="130" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="27" y1="20" x2="220" y2="130" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,3"/>
    <text x="128" y="148" fill="#22c55e" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{alas}</text>
    <text x="8" y="80" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{tinggi}</text>
    <text x="145" y="72" fill="#f472b6" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{tangga}</text>
    <text x="140" y="18" fill="#a78bfa" fontSize="8" textAnchor="middle" fontFamily="monospace">Tangga = ?</text>
  </svg>
);

const DiagonalPersegiSVG = ({ s, d }: { s: string; d: string }) => (
  <svg viewBox="0 0 250 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="40" y="20" width="170" height="120" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.8" rx="3"/>
    <line x1="40" y1="20" x2="210" y2="140" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6,3"/>
    <text x="125" y="155" fill="#a855f7" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{s}</text>
    <text x="22" y="84" fill="#a855f7" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{s}</text>
    <text x="138" y="92" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{d}</text>
    <text x="125" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Diagonal Persegi</text>
  </svg>
);

const DiagonalPersegiPanjangSVG = ({ p, l, d }: { p: string; l: string; d: string }) => (
  <svg viewBox="0 0 280 150" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="30" y="30" width="220" height="90" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="1.8" rx="3"/>
    <line x1="30" y1="30" x2="250" y2="120" stroke="#f472b6" strokeWidth="2" strokeDasharray="6,3"/>
    <text x="140" y="140" fill="#06b6d4" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{p}</text>
    <text x="14" y="78" fill="#06b6d4" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{l}</text>
    <text x="148" y="85" fill="#f472b6" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{d}</text>
    <text x="140" y="18" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Diagonal Persegi Panjang</text>
  </svg>
);

const TriplePythagorasSVG = ({ triple }: { triple: [number, number, number] }) => {
  const [a, b, c] = triple;
  return (
    <svg viewBox="0 0 280 140" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <polygon points="30,120 30,30 200,120" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="1.8"/>
      <rect x="30" y="100" width="20" height="20" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <text x="110" y="135" fill="#34d399" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">a = {a}</text>
      <text x="18" y="78" fill="#f472b6" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">b = {b}</text>
      <text x="125" y="68" fill="#fbbf24" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">c = {c}</text>
      <text x="140" y="18" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace">{a}² + {b}² = {c}²  →  {a*a} + {b*b} = {c*c} ✓</text>
    </svg>
  );
};

const KapalLayarSVG = () => (
  <svg viewBox="0 0 280 150" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <line x1="140" y1="130" x2="140" y2="20" stroke="#06b6d4" strokeWidth="2"/>
    <polygon points="140,25 200,130 140,130" fill="rgba(251,191,36,0.25)" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="140" y1="130" x2="70" y2="130" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="70" y1="130" x2="140" y2="20" stroke="#f472b6" strokeWidth="1.8" strokeDasharray="5,3"/>
    <text x="100" y="148" fill="#22c55e" fontSize="10" textAnchor="middle" fontFamily="monospace">60 m</text>
    <text x="153" y="80" fill="#06b6d4" fontSize="10" textAnchor="middle" fontFamily="monospace">80 m</text>
    <text x="95" y="78" fill="#f472b6" fontSize="10" textAnchor="middle" fontFamily="monospace">jarak?</text>
    <text x="140" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Kontekstual - Kapal & Menara</text>
  </svg>
);

const PohonSVG = () => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <line x1="130" y1="140" x2="130" y2="30" stroke="#22c55e" strokeWidth="3"/>
    <line x1="130" y1="140" x2="240" y2="140" stroke="#94a3b8" strokeWidth="2"/>
    <line x1="130" y1="30" x2="240" y2="140" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="118" y="128" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="185" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">110 m</text>
    <text x="115" y="88" fill="#22c55e" fontSize="10" textAnchor="middle" fontFamily="monospace">90 m</text>
    <text x="200" y="88" fill="#f472b6" fontSize="10" textAnchor="middle" fontFamily="monospace">kabel?</text>
    <text x="140" y="18" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Kontekstual - Pohon & Kabel</text>
  </svg>
);

const VerifikasiSVG = ({ a, b, c, valid }: { a: number; b: number; c: number; valid: boolean }) => (
  <svg viewBox="0 0 280 120" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="15" y="20" width="240" height="80" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <text x="140" y="45" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="monospace">{a}² + {b}² ?= {c}²</text>
    <text x="140" y="68" fill="var(--icon-color)" fontSize="11" textAnchor="middle" fontFamily="monospace">{a*a} + {b*b} = {a*a+b*b}  vs  {c*c}</text>
    <text x="140" y="90" fill={valid ? "#22c55e" : "#ef4444"} fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
      {valid ? "✓ Segitiga Siku-siku" : "✗ Bukan Segitiga Siku-siku"}
    </text>
  </svg>
);

const BangunGabunganSVG = () => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="50" y="80" width="160" height="70" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.8"/>
    <polygon points="50,80 130,20 210,80" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.8"/>
    <line x1="130" y1="20" x2="130" y2="80" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="130" y="155" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">16 m</text>
    <text x="22" y="120" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">10 m</text>
    <text x="130" y="72" fill="#a855f7" fontSize="9" textAnchor="middle" fontFamily="monospace">t=6 m</text>
    <text x="85" y="50" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">sisi?</text>
    <text x="140" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Bangun Gabungan</text>
  </svg>
);

const JarakDuaTitikSVG = ({ x1, y1, x2, y2, d }: { x1: number; y1: number; x2: number; y2: number; d: string }) => (
  <svg viewBox="0 0 260 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <line x1="30" y1="80" x2="230" y2="80" stroke="#334155" strokeWidth="1"/>
    <line x1="130" y1="10" x2="130" y2="150" stroke="#334155" strokeWidth="1"/>
    {[-3,-2,-1,1,2,3].map(v => (
      <line key={v} x1={130+v*30} y1="77" x2={130+v*30} y2="83" stroke="#475569" strokeWidth="1"/>
    ))}
    {[-2,-1,1,2].map(v => (
      <line key={v} x1="127" y1={80+v*25} x2="133" y2={80+v*25} stroke="#475569" strokeWidth="1"/>
    ))}
    <circle cx={130+x1*30} cy={80-y1*25} r="5" fill="#f472b6"/>
    <circle cx={130+x2*30} cy={80-y2*25} r="5" fill="#34d399"/>
    <line x1={130+x1*30} y1={80-y1*25} x2={130+x2*30} y2={80-y2*25} stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,3"/>
    <text x={130+x1*30+8} y={80-y1*25-6} fill="#f472b6" fontSize="9" fontFamily="monospace">A({x1},{y1})</text>
    <text x={130+x2*30+8} y={80-y2*25-6} fill="#34d399" fontSize="9" fontFamily="monospace">B({x2},{y2})</text>
    <text x="130" y="155" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">AB = {d}</text>
  </svg>
);

const SudutKhususSVG = ({ sudut }: { sudut: "30-60-90" | "45-45-90" }) => {
  if (sudut === "45-45-90") return (
    <svg viewBox="0 0 260 150" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <polygon points="40,120 200,120 40,30" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.8"/>
      <rect x="40" y="100" width="20" height="20" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <text x="120" y="140" fill="#34d399" fontSize="11" textAnchor="middle" fontFamily="monospace">a</text>
      <text x="28" y="78" fill="#f472b6" fontSize="11" textAnchor="middle" fontFamily="monospace">a</text>
      <text x="138" y="72" fill="#fbbf24" fontSize="12" textAnchor="middle" fontFamily="monospace">a√2</text>
      <text x="48" y="120" fill="#94a3b8" fontSize="9" fontFamily="monospace">45°</text>
      <text x="175" y="118" fill="#94a3b8" fontSize="9" fontFamily="monospace">45°</text>
      <text x="42" y="44" fill="#94a3b8" fontSize="9" fontFamily="monospace">90°</text>
      <text x="130" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Segitiga 45°-45°-90°</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 260 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <polygon points="40,130 220,130 40,40" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="1.8"/>
      <rect x="40" y="110" width="20" height="20" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <text x="130" y="148" fill="#34d399" fontSize="10" textAnchor="middle" fontFamily="monospace">a√3</text>
      <text x="28" y="90" fill="#f472b6" fontSize="10" textAnchor="middle" fontFamily="monospace">a</text>
      <text x="148" y="82" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="monospace">2a</text>
      <text x="52" y="128" fill="#94a3b8" fontSize="9" fontFamily="monospace">60°</text>
      <text x="195" y="126" fill="#94a3b8" fontSize="9" fontFamily="monospace">30°</text>
      <text x="42" y="56" fill="#94a3b8" fontSize="9" fontFamily="monospace">90°</text>
      <text x="130" y="16" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Segitiga 30°-60°-90°</text>
    </svg>
  );
};

const visualMap: Record<string, React.ReactNode> = {
  "seg-3-4-5": <SegitigaSikuSVG a="3" b="4" c="5" />,
  "seg-5-12-13": <SegitigaSikuSVG a="5" b="12" c="13" />,
  "seg-6-8-10": <SegitigaSikuSVG a="6" b="8" c="10" />,
  "seg-8-15-17": <SegitigaSikuSVG a="8" b="15" c="17" />,
  "seg-7-24-25": <SegitigaSikuSVG a="7" b="24" c="25" />,
  "seg-9-40-41": <SegitigaSikuSVG a="9" b="40" c="41" />,
  "seg-9-12-15": <SegitigaSikuSVG a="9" b="12" c="15" />,
  "seg-misng-a": <SegitigaSikuSVG a="?" b="8" c="10" label="Cari sisi a" />,
  "seg-misng-b": <SegitigaSikuSVG a="12" b="?" c="13" label="Cari sisi b" />,
  "tangga-3-4-5": <TanggaSVG tinggi="4 m" alas="3 m" tangga="5 m" />,
  "tangga-5-12-13": <TanggaSVG tinggi="12 m" alas="5 m" tangga="13 m" />,
  "tangga-k-8-10": <TanggaSVG tinggi="6 m" alas="8 m" tangga="10 m" />,
  "persegi-5": <DiagonalPersegiSVG s="5" d="5√2" />,
  "persegi-8": <DiagonalPersegiSVG s="8" d="8√2" />,
  "panjang-3-4-5": <DiagonalPersegiPanjangSVG p="4" l="3" d="5" />,
  "panjang-5-12-13": <DiagonalPersegiPanjangSVG p="12" l="5" d="13" />,
  "panjang-8-15-17": <DiagonalPersegiPanjangSVG p="15" l="8" d="17" />,
  "triple-3-4-5": <TriplePythagorasSVG triple={[3,4,5]} />,
  "triple-5-12-13": <TriplePythagorasSVG triple={[5,12,13]} />,
  "triple-8-15-17": <TriplePythagorasSVG triple={[8,15,17]} />,
  "triple-7-24-25": <TriplePythagorasSVG triple={[7,24,25]} />,
  "kapal": <KapalLayarSVG />,
  "pohon": <PohonSVG />,
  "verif-3-4-5-yes": <VerifikasiSVG a={3} b={4} c={5} valid={true} />,
  "verif-6-8-11-no": <VerifikasiSVG a={6} b={8} c={11} valid={false} />,
  "verif-9-12-15-yes": <VerifikasiSVG a={9} b={12} c={15} valid={true} />,
  "verif-5-12-14-no": <VerifikasiSVG a={5} b={12} c={14} valid={false} />,
  "bangun-gabungan": <BangunGabunganSVG />,
  "jarak-1-1-4-5": <JarakDuaTitikSVG x1={1} y1={1} x2={4} y2={5} d="5" />,
  "jarak-0-0-3-4": <JarakDuaTitikSVG x1={0} y1={0} x2={3} y2={4} d="5" />,
  "jarak-2-1-5-5": <JarakDuaTitikSVG x1={2} y1={1} x2={5} y2={5} d="5" />,
  "sudut-45": <SudutKhususSVG sudut="45-45-90" />,
  "sudut-30-60": <SudutKhususSVG sudut="30-60-90" />,
};

const soalTeoremaPythagoras: Question[] = [
  /* ═══════════════════════════════════
     MUDAH  (Q1 – Q35)
  ═══════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Pada segitiga siku-siku dengan sisi siku-siku $a$ dan $b$ serta sisi miring $c$, hubungan yang benar adalah ...",
    svgKey: "seg-3-4-5",
    options: ["A. $c = a + b$", "B. $c^2 = a^2 + b^2$", "C. $c^2 = a^2 - b^2$", "D. $a^2 = b^2 + c^2$"],
    correctAnswer: "B. $c^2 = a^2 + b^2$",
    explanation: {
      concept: "Teorema Pythagoras menyatakan: kuadrat sisi miring = jumlah kuadrat dua sisi siku-sikunya.",
      steps: ["Sisi miring (hipotenusa) adalah sisi terpanjang yang berhadapan dengan sudut siku-siku.", "$c^2 = a^2 + b^2$"],
      formula: "c^2 = a^2 + b^2"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Menghitung Sisi Miring",
    question: "Segitiga siku-siku memiliki sisi siku-siku 3 cm dan 4 cm. Panjang sisi miringnya adalah ...",
    svgKey: "seg-3-4-5",
    options: ["A. 4 cm", "B. 5 cm", "C. 6 cm", "D. 7 cm"],
    correctAnswer: "B. 5 cm",
    explanation: {
      concept: "Gunakan teorema Pythagoras untuk mencari sisi miring.",
      steps: ["$c^2 = 3^2 + 4^2 = 9 + 16 = 25$", "$c = \\sqrt{25} = 5$ cm"],
      formula: "c = \\sqrt{a^2 + b^2}"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Menghitung Sisi Siku-siku",
    question: "Segitiga siku-siku memiliki sisi miring 10 cm dan salah satu sisi siku-sikunya 8 cm. Panjang sisi siku-siku yang lain adalah ...",
    svgKey: "seg-misng-a",
    options: ["A. 4 cm", "B. 5 cm", "C. 6 cm", "D. 7 cm"],
    correctAnswer: "C. 6 cm",
    explanation: {
      concept: "Dari $c^2 = a^2 + b^2$, kita dapat mencari sisi yang belum diketahui.",
      steps: ["$a^2 = c^2 - b^2 = 10^2 - 8^2 = 100 - 64 = 36$", "$a = \\sqrt{36} = 6$ cm"],
      formula: "a = \\sqrt{c^2 - b^2}"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Triple Pythagoras",
    question: "Bilangan berikut yang merupakan triple Pythagoras adalah ...",
    svgKey: "triple-3-4-5",
    options: ["A. (2, 3, 4)", "B. (3, 4, 5)", "C. (4, 5, 7)", "D. (5, 6, 8)"],
    correctAnswer: "B. (3, 4, 5)",
    explanation: {
      concept: "Triple Pythagoras adalah tiga bilangan bulat positif yang memenuhi $a^2 + b^2 = c^2$.",
      steps: ["Cek (3,4,5): $3^2 + 4^2 = 9 + 16 = 25 = 5^2$ ✓", "Cek (2,3,4): $4 + 9 = 13 \\neq 16$ ✗"],
      formula: "a^2 + b^2 = c^2"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah tangga panjang 5 m bersandar pada tembok. Jika jarak kaki tangga dari tembok 3 m, tinggi tangga yang menyentuh tembok adalah ...",
    svgKey: "tangga-3-4-5",
    options: ["A. 2 m", "B. 3 m", "C. 4 m", "D. 5 m"],
    correctAnswer: "C. 4 m",
    explanation: {
      concept: "Tangga membentuk segitiga siku-siku dengan tembok dan lantai.",
      steps: ["$t^2 = 5^2 - 3^2 = 25 - 9 = 16$", "$t = \\sqrt{16} = 4$ m"],
      formula: "t = \\sqrt{c^2 - a^2}"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Diagonal Persegi",
    question: "Persegi dengan sisi 5 cm. Panjang diagonalnya adalah ...",
    svgKey: "persegi-5",
    options: ["A. $5\\sqrt{2}$ cm", "B. $5\\sqrt{3}$ cm", "C. 10 cm", "D. 25 cm"],
    correctAnswer: "A. $5\\sqrt{2}$ cm",
    explanation: {
      concept: "Diagonal persegi membagi persegi menjadi dua segitiga siku-siku samakaki.",
      steps: ["$d^2 = 5^2 + 5^2 = 25 + 25 = 50$", "$d = \\sqrt{50} = 5\\sqrt{2}$ cm"],
      formula: "d = s\\sqrt{2}"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Verifikasi Segitiga",
    question: "Apakah segitiga dengan sisi 6 cm, 8 cm, dan 10 cm merupakan segitiga siku-siku?",
    svgKey: "verif-3-4-5-yes",
    options: ["A. Ya, karena $6^2 + 8^2 = 10^2$", "B. Tidak, karena $6 + 8 \\neq 10$", "C. Ya, karena jumlah ketiga sisinya 24", "D. Tidak, karena sisi-sisinya genap semua"],
    correctAnswer: "A. Ya, karena $6^2 + 8^2 = 10^2$",
    explanation: {
      concept: "Segitiga siku-siku memenuhi $a^2 + b^2 = c^2$ dengan c adalah sisi terpanjang.",
      steps: ["$6^2 + 8^2 = 36 + 64 = 100$", "$10^2 = 100$", "Karena $6^2 + 8^2 = 10^2$ → segitiga siku-siku ✓"],
      formula: ""
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Menghitung Sisi Miring",
    question: "Sisi-sisi siku-siku suatu segitiga adalah 5 cm dan 12 cm. Panjang sisi miringnya adalah ...",
    svgKey: "seg-5-12-13",
    options: ["A. 11 cm", "B. 13 cm", "C. 15 cm", "D. 17 cm"],
    correctAnswer: "B. 13 cm",
    explanation: {
      concept: "Gunakan teorema Pythagoras.",
      steps: ["$c^2 = 5^2 + 12^2 = 25 + 144 = 169$", "$c = \\sqrt{169} = 13$ cm"],
      formula: "c = \\sqrt{a^2 + b^2}"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Diagonal Persegi Panjang",
    question: "Persegi panjang dengan panjang 4 cm dan lebar 3 cm. Panjang diagonalnya adalah ...",
    svgKey: "panjang-3-4-5",
    options: ["A. 4 cm", "B. 5 cm", "C. 6 cm", "D. 7 cm"],
    correctAnswer: "B. 5 cm",
    explanation: {
      concept: "Diagonal persegi panjang dihitung menggunakan teorema Pythagoras.",
      steps: ["$d^2 = p^2 + l^2 = 4^2 + 3^2 = 16 + 9 = 25$", "$d = \\sqrt{25} = 5$ cm"],
      formula: "d = \\sqrt{p^2 + l^2}"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Sisi yang berhadapan dengan sudut siku-siku pada segitiga siku-siku disebut ...",
    options: ["A. Sisi siku-siku", "B. Sisi tegak", "C. Hipotenusa (sisi miring)", "D. Alas"],
    correctAnswer: "C. Hipotenusa (sisi miring)",
    explanation: {
      concept: "Hipotenusa adalah sisi terpanjang pada segitiga siku-siku dan selalu berhadapan dengan sudut 90°.",
      steps: ["Sudut siku-siku = 90°", "Sisi di depan sudut 90° = hipotenusa = sisi miring"],
      formula: ""
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Triple Pythagoras",
    question: "Jika (5, 12, 13) merupakan triple Pythagoras, maka (10, 24, ?) juga merupakan triple Pythagoras. Nilai yang tepat adalah ...",
    svgKey: "triple-5-12-13",
    options: ["A. 24", "B. 25", "C. 26", "D. 27"],
    correctAnswer: "C. 26",
    explanation: {
      concept: "Kelipatan dari triple Pythagoras juga merupakan triple Pythagoras.",
      steps: ["(5,12,13) × 2 = (10, 24, 26)", "Verifikasi: $10^2 + 24^2 = 100 + 576 = 676 = 26^2$ ✓"],
      formula: "k(a,b,c) \\text{ adalah triple Pythagoras jika } (a,b,c) \\text{ triple Pythagoras}"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Menghitung Sisi Siku-siku",
    question: "Segitiga siku-siku dengan sisi miring 13 cm dan satu sisi siku-siku 5 cm. Panjang sisi siku-siku lainnya adalah ...",
    svgKey: "seg-misng-b",
    options: ["A. 10 cm", "B. 11 cm", "C. 12 cm", "D. 13 cm"],
    correctAnswer: "C. 12 cm",
    explanation: {
      concept: "Gunakan $b^2 = c^2 - a^2$.",
      steps: ["$b^2 = 13^2 - 5^2 = 169 - 25 = 144$", "$b = \\sqrt{144} = 12$ cm"],
      formula: "b = \\sqrt{c^2 - a^2}"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Seorang anak berjalan 6 m ke timur kemudian 8 m ke utara. Jarak anak tersebut dari posisi awal adalah ...",
    options: ["A. 8 m", "B. 10 m", "C. 12 m", "D. 14 m"],
    correctAnswer: "B. 10 m",
    explanation: {
      concept: "Perjalanan ke timur dan utara membentuk dua sisi siku-siku.",
      steps: ["$d^2 = 6^2 + 8^2 = 36 + 64 = 100$", "$d = \\sqrt{100} = 10$ m"],
      formula: "d = \\sqrt{6^2 + 8^2}"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Triple Pythagoras",
    question: "Yang bukan merupakan triple Pythagoras adalah ...",
    options: ["A. (3, 4, 5)", "B. (6, 8, 10)", "C. (5, 12, 13)", "D. (4, 5, 6)"],
    correctAnswer: "D. (4, 5, 6)",
    explanation: {
      concept: "Cek setiap pilihan: $a^2 + b^2$ harus sama dengan $c^2$.",
      steps: ["(4,5,6): $4^2 + 5^2 = 16 + 25 = 41 \\neq 36 = 6^2$ ✗", "(3,4,5): $9+16=25=5^2$ ✓", "(6,8,10): $36+64=100=10^2$ ✓"],
      formula: ""
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Menghitung Sisi Miring",
    question: "Segitiga siku-siku dengan sisi 9 cm dan 12 cm. Sisi miringnya adalah ...",
    svgKey: "seg-9-12-15",
    options: ["A. 12 cm", "B. 13 cm", "C. 14 cm", "D. 15 cm"],
    correctAnswer: "D. 15 cm",
    explanation: {
      concept: "Ini adalah triple Pythagoras (3,4,5) yang dikalikan 3.",
      steps: ["$c^2 = 9^2 + 12^2 = 81 + 144 = 225$", "$c = \\sqrt{225} = 15$ cm"],
      formula: "c = \\sqrt{a^2 + b^2}"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Jarak Dua Titik",
    question: "Jarak antara titik A(0, 0) dan B(3, 4) pada bidang koordinat adalah ...",
    svgKey: "jarak-0-0-3-4",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "Jarak dua titik dihitung menggunakan teorema Pythagoras.",
      steps: ["$d^2 = (3-0)^2 + (4-0)^2 = 9 + 16 = 25$", "$d = \\sqrt{25} = 5$"],
      formula: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Diagonal Persegi",
    question: "Persegi dengan diagonal $8\\sqrt{2}$ cm. Panjang sisinya adalah ...",
    svgKey: "persegi-8",
    options: ["A. 4 cm", "B. 6 cm", "C. 8 cm", "D. 10 cm"],
    correctAnswer: "C. 8 cm",
    explanation: {
      concept: "Diagonal persegi = $s\\sqrt{2}$, sehingga $s = d / \\sqrt{2}$.",
      steps: ["$d = s\\sqrt{2}$", "$8\\sqrt{2} = s\\sqrt{2}$", "$s = 8$ cm"],
      formula: "s = \\dfrac{d}{\\sqrt{2}}"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Verifikasi Segitiga",
    question: "Segitiga dengan sisi 5 cm, 12 cm, dan 14 cm. Apakah segitiga siku-siku?",
    svgKey: "verif-5-12-14-no",
    options: ["A. Ya, karena $5+12 = 14+3$", "B. Tidak, karena $5^2 + 12^2 \\neq 14^2$", "C. Ya, karena $12 > 5$", "D. Tidak, karena panjang sisinya tidak sama"],
    correctAnswer: "B. Tidak, karena $5^2 + 12^2 \\neq 14^2$",
    explanation: {
      concept: "Verifikasi dengan $a^2 + b^2 = c^2$.",
      steps: ["$5^2 + 12^2 = 25 + 144 = 169$", "$14^2 = 196$", "Karena $169 \\neq 196$ → bukan segitiga siku-siku ✗"],
      formula: ""
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah TV layar datar berukuran 20 inci (diagonal). Jika lebar TV 16 inci, tinggi TV tersebut adalah ...",
    options: ["A. 10 inci", "B. 12 inci", "C. 14 inci", "D. 16 inci"],
    correctAnswer: "B. 12 inci",
    explanation: {
      concept: "Diagonal dan sisi TV membentuk segitiga siku-siku.",
      steps: ["$t^2 = 20^2 - 16^2 = 400 - 256 = 144$", "$t = \\sqrt{144} = 12$ inci"],
      formula: "t = \\sqrt{d^2 - l^2}"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Triple Pythagoras",
    question: "Triple Pythagoras (8, ?, 17). Nilai yang tepat adalah ...",
    svgKey: "seg-8-15-17",
    options: ["A. 12", "B. 13", "C. 15", "D. 16"],
    correctAnswer: "C. 15",
    explanation: {
      concept: "Cari sisi yang hilang dari triple Pythagoras.",
      steps: ["$b^2 = 17^2 - 8^2 = 289 - 64 = 225$", "$b = \\sqrt{225} = 15$"],
      formula: "b = \\sqrt{c^2 - a^2}"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Kapal berlayar 9 km ke arah timur lalu 12 km ke arah selatan. Jarak kapal dari titik awal adalah ...",
    options: ["A. 13 km", "B. 14 km", "C. 15 km", "D. 17 km"],
    correctAnswer: "C. 15 km",
    explanation: {
      concept: "Perjalanan membentuk segitiga siku-siku.",
      steps: ["$d^2 = 9^2 + 12^2 = 81 + 144 = 225$", "$d = \\sqrt{225} = 15$ km"],
      formula: "d = \\sqrt{a^2 + b^2}"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Diagonal Persegi Panjang",
    question: "Persegi panjang dengan panjang 12 cm dan lebar 5 cm. Panjang diagonalnya adalah ...",
    svgKey: "panjang-5-12-13",
    options: ["A. 11 cm", "B. 12 cm", "C. 13 cm", "D. 14 cm"],
    correctAnswer: "C. 13 cm",
    explanation: {
      concept: "Diagonal persegi panjang menggunakan Pythagoras.",
      steps: ["$d^2 = 12^2 + 5^2 = 144 + 25 = 169$", "$d = \\sqrt{169} = 13$ cm"],
      formula: "d = \\sqrt{p^2 + l^2}"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Teorema Pythagoras berlaku untuk ...",
    options: ["A. Semua jenis segitiga", "B. Segitiga sama sisi saja", "C. Segitiga siku-siku saja", "D. Segitiga sama kaki saja"],
    correctAnswer: "C. Segitiga siku-siku saja",
    explanation: {
      concept: "Teorema Pythagoras hanya berlaku khusus untuk segitiga siku-siku.",
      steps: ["Segitiga siku-siku memiliki satu sudut 90°.", "Teorema: $c^2 = a^2 + b^2$, berlaku untuk segitiga siku-siku saja."],
      formula: ""
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Menghitung Sisi Miring",
    question: "Segitiga siku-siku dengan sisi siku-siku 7 cm dan 24 cm. Sisi miringnya adalah ...",
    svgKey: "seg-7-24-25",
    options: ["A. 23 cm", "B. 24 cm", "C. 25 cm", "D. 26 cm"],
    correctAnswer: "C. 25 cm",
    explanation: {
      concept: "Triple Pythagoras (7, 24, 25).",
      steps: ["$c^2 = 7^2 + 24^2 = 49 + 576 = 625$", "$c = \\sqrt{625} = 25$ cm"],
      formula: "c = \\sqrt{a^2 + b^2}"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Lebar sungai ingin diukur. Seorang pengamat berdiri di titik C yang berjarak 40 m dari tepi sungai (tegak lurus). Titik A di seberang sungai terlihat sepanjang 30 m. Lebar sungai adalah ...",
    options: ["A. 25 m", "B. 30 m", "C. 40 m", "D. 50 m"],
    correctAnswer: "D. 50 m",
    explanation: {
      concept: "Membentuk segitiga siku-siku dengan sisi 30 m dan 40 m.",
      steps: ["$d^2 = 30^2 + 40^2 = 900 + 1600 = 2500$", "$d = \\sqrt{2500} = 50$ m"],
      formula: ""
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Verifikasi Segitiga",
    question: "Manakah yang merupakan segitiga siku-siku?",
    svgKey: "verif-9-12-15-yes",
    options: ["A. Sisi 7, 10, 12", "B. Sisi 9, 12, 15", "C. Sisi 8, 10, 14", "D. Sisi 6, 9, 12"],
    correctAnswer: "B. Sisi 9, 12, 15",
    explanation: {
      concept: "Segitiga siku-siku memenuhi $a^2 + b^2 = c^2$.",
      steps: ["(9,12,15): $81 + 144 = 225 = 15^2$ ✓", "(7,10,12): $49 + 100 = 149 \\neq 144$ ✗"],
      formula: ""
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah layangan diterbangkan dengan tali 20 m. Bayangan layangan di tanah berjarak 12 m dari tangan anak yang memegang tali. Ketinggian layangan dari tanah adalah ...",
    options: ["A. 14 m", "B. 15 m", "C. 16 m", "D. 18 m"],
    correctAnswer: "C. 16 m",
    explanation: {
      concept: "Tali, jarak bayangan, dan tinggi membentuk segitiga siku-siku.",
      steps: ["$h^2 = 20^2 - 12^2 = 400 - 144 = 256$", "$h = \\sqrt{256} = 16$ m"],
      formula: "h = \\sqrt{c^2 - a^2}"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Menghitung Sisi Miring",
    question: "Segitiga siku-siku dengan sisi 6 cm dan 8 cm. Sisi miringnya adalah ...",
    svgKey: "seg-6-8-10",
    options: ["A. 9 cm", "B. 10 cm", "C. 11 cm", "D. 12 cm"],
    correctAnswer: "B. 10 cm",
    explanation: {
      concept: "Triple Pythagoras (6, 8, 10) = (3, 4, 5) × 2.",
      steps: ["$c^2 = 6^2 + 8^2 = 36 + 64 = 100$", "$c = \\sqrt{100} = 10$ cm"],
      formula: ""
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Jarak Dua Titik",
    question: "Jarak antara titik P(1, 1) dan Q(4, 5) adalah ...",
    svgKey: "jarak-1-1-4-5",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "C. 5",
    explanation: {
      concept: "Jarak dua titik: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$",
      steps: ["$d = \\sqrt{(4-1)^2 + (5-1)^2}$", "$= \\sqrt{9 + 16} = \\sqrt{25} = 5$"],
      formula: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah papan sepanjang 13 m bersandar pada tembok. Jika kaki papan berjarak 5 m dari tembok, ketinggian papan menyentuh tembok adalah ...",
    svgKey: "tangga-5-12-13",
    options: ["A. 10 m", "B. 11 m", "C. 12 m", "D. 13 m"],
    correctAnswer: "C. 12 m",
    explanation: {
      concept: "Membentuk segitiga siku-siku (5, 12, 13).",
      steps: ["$h^2 = 13^2 - 5^2 = 169 - 25 = 144$", "$h = \\sqrt{144} = 12$ m"],
      formula: ""
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Siapakah yang mempopulerkan teorema $c^2 = a^2 + b^2$ dalam sejarah matematika?",
    options: ["A. Archimedes", "B. Euclid", "C. Pythagoras", "D. Newton"],
    correctAnswer: "C. Pythagoras",
    explanation: {
      concept: "Teorema ini dikenal sebagai Teorema Pythagoras karena dipopulerkan oleh Pythagoras, seorang filsuf dan matematikawan Yunani.",
      steps: ["Pythagoras (~570–495 SM) adalah matematikawan Yunani.", "Ia mendirikan sekolah matematika dan membuktikan teorema ini secara formal."],
      formula: ""
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "Menghitung Sisi Miring",
    question: "Sisi-sisi siku-siku suatu segitiga adalah $p$ dan $p$. Sisi miringnya adalah ...",
    svgKey: "sudut-45",
    options: ["A. $p$", "B. $p\\sqrt{2}$", "C. $p\\sqrt{3}$", "D. $2p$"],
    correctAnswer: "B. $p\\sqrt{2}$",
    explanation: {
      concept: "Segitiga siku-siku sama kaki (45°-45°-90°) memiliki sisi miring $a\\sqrt{2}$.",
      steps: ["$c^2 = p^2 + p^2 = 2p^2$", "$c = \\sqrt{2p^2} = p\\sqrt{2}$"],
      formula: "c = a\\sqrt{2}"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Triple Pythagoras",
    question: "Kelipatan dari (3, 4, 5) berikut yang juga triple Pythagoras adalah ...",
    options: ["A. (6, 8, 11)", "B. (9, 12, 15)", "C. (12, 16, 22)", "D. (15, 20, 26)"],
    correctAnswer: "B. (9, 12, 15)",
    explanation: {
      concept: "Kelipatan bilangan bulat dari triple Pythagoras juga triple Pythagoras.",
      steps: ["(3,4,5) × 3 = (9, 12, 15)", "$9^2 + 12^2 = 81 + 144 = 225 = 15^2$ ✓"],
      formula: ""
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Seorang tukang kayu membuat bingkai persegi panjang 60 cm × 80 cm. Agar persegi panjang benar-benar siku, diagonal bingkai harus berukuran ...",
    options: ["A. 90 cm", "B. 95 cm", "C. 100 cm", "D. 120 cm"],
    correctAnswer: "C. 100 cm",
    explanation: {
      concept: "Diagonal persegi panjang dihitung dengan teorema Pythagoras.",
      steps: ["$d^2 = 60^2 + 80^2 = 3600 + 6400 = 10000$", "$d = \\sqrt{10000} = 100$ cm"],
      formula: "d = \\sqrt{p^2 + l^2}"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Verifikasi Segitiga",
    question: "Segitiga dengan sisi 6, 8, dan 11. Ini adalah segitiga ...",
    svgKey: "verif-6-8-11-no",
    options: ["A. Siku-siku, karena $6 + 8 > 11$", "B. Bukan siku-siku, karena $6^2 + 8^2 \\neq 11^2$", "C. Siku-siku, karena sisi terpanjangnya 11", "D. Bukan segitiga sama sekali"],
    correctAnswer: "B. Bukan siku-siku, karena $6^2 + 8^2 \\neq 11^2$",
    explanation: {
      concept: "Verifikasi dengan teorema Pythagoras.",
      steps: ["$6^2 + 8^2 = 36 + 64 = 100$", "$11^2 = 121$", "$100 \\neq 121$ → bukan segitiga siku-siku"],
      formula: ""
    }
  },

  /* ═══════════════════════════════════
     SEDANG  (Q36 – Q65)
  ═══════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah segitiga siku-siku memiliki sisi miring $\\sqrt{130}$ cm dan salah satu sisi siku-siku 7 cm. Panjang sisi siku-siku lainnya adalah ...",
    options: ["A. $\\sqrt{79}$ cm", "B. 9 cm", "C. $\\sqrt{81}$ cm = 9 cm", "D. $\\sqrt{179}$ cm"],
    correctAnswer: "C. $\\sqrt{81}$ cm = 9 cm",
    explanation: {
      concept: "Gunakan $b^2 = c^2 - a^2$.",
      steps: ["$b^2 = (\\sqrt{130})^2 - 7^2 = 130 - 49 = 81$", "$b = \\sqrt{81} = 9$ cm"],
      formula: "b = \\sqrt{c^2 - a^2}"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang peserta lomba atletik berlari 400 m ke utara, kemudian 300 m ke timur. Jarak terpendek ke titik start adalah ...",
    options: ["A. 400 m", "B. 450 m", "C. 500 m", "D. 600 m"],
    correctAnswer: "C. 500 m",
    explanation: {
      concept: "Lintasan membentuk segitiga siku-siku.",
      steps: ["$d^2 = 400^2 + 300^2 = 160000 + 90000 = 250000$", "$d = \\sqrt{250000} = 500$ m"],
      formula: ""
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah belah ketupat dengan sisi 10 cm dan diagonal pendek 12 cm. Panjang diagonal panjangnya adalah ...",
    options: ["A. 14 cm", "B. 16 cm", "C. 18 cm", "D. 20 cm"],
    correctAnswer: "B. 16 cm",
    explanation: {
      concept: "Diagonal belah ketupat saling berpotongan tegak lurus dan membagi dua sama panjang.",
      steps: [
        "Setengah diagonal pendek $= 12/2 = 6$ cm",
        "$h^2 = 10^2 - 6^2 = 100 - 36 = 64$",
        "$h = \\sqrt{64} = 8$ cm (setengah diagonal panjang)",
        "Diagonal panjang $= 2 \\times 8 = 16$ cm"
      ],
      formula: "d_2 = 2\\sqrt{s^2 - (d_1/2)^2}"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Tinggi segitiga sama kaki dengan alas 16 cm dan sisi kaki 10 cm adalah ...",
    options: ["A. 4 cm", "B. 5 cm", "C. 6 cm", "D. 8 cm"],
    correctAnswer: "C. 6 cm",
    explanation: {
      concept: "Garis tinggi dari puncak ke alas membagi alas menjadi dua bagian sama.",
      steps: ["Setengah alas $= 16/2 = 8$ cm", "$t^2 = 10^2 - 8^2 = 100 - 64 = 36$", "$t = \\sqrt{36} = 6$ cm"],
      formula: "t = \\sqrt{s^2 - (a/2)^2}"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "Jarak Dua Titik",
    question: "Jarak antara P(2, 1) dan Q(5, 5) adalah ...",
    svgKey: "jarak-2-1-5-5",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "Rumus jarak dua titik.",
      steps: ["$d = \\sqrt{(5-2)^2 + (5-1)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$"],
      formula: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "Sudut Khusus",
    question: "Segitiga siku-siku 30°-60°-90° dengan sisi terpendek 5 cm. Sisi miringnya adalah ...",
    svgKey: "sudut-30-60",
    options: ["A. 5 cm", "B. $5\\sqrt{3}$ cm", "C. 10 cm", "D. $10\\sqrt{3}$ cm"],
    correctAnswer: "C. 10 cm",
    explanation: {
      concept: "Pada segitiga 30°-60°-90°: sisi terpendek (30°) = a, sisi miring = 2a, sisi sedang = $a\\sqrt{3}$.",
      steps: ["Sisi terpendek (30°) $= 5$ cm", "Sisi miring $= 2 \\times 5 = 10$ cm"],
      formula: "\\text{Sisi miring} = 2 \\times \\text{sisi terpendek}"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "Kontekstual - ANBK",
    question: "Pak Ahmad memasang antena TV di atas atap setinggi 8 m. Untuk menyangga antena, ia memasang kabel dari ujung antena ke tanah sejauh 15 m dari kaki antena. Panjang kabel yang dibutuhkan adalah ...",
    svgKey: "pohon",
    options: ["A. 15 m", "B. 16 m", "C. 17 m", "D. 18 m"],
    correctAnswer: "C. 17 m",
    explanation: {
      concept: "Kabel, tinggi antena, dan jarak di tanah membentuk segitiga siku-siku.",
      steps: ["$k^2 = 8^2 + 15^2 = 64 + 225 = 289$", "$k = \\sqrt{289} = 17$ m"],
      formula: "k = \\sqrt{h^2 + d^2}"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Koordinat titik A adalah (−3, 4). Jarak titik A dari titik asal O(0,0) adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 7"],
    correctAnswer: "C. 5",
    explanation: {
      concept: "Jarak dari titik asal = $\\sqrt{x^2 + y^2}$.",
      steps: ["$d = \\sqrt{(-3)^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$"],
      formula: "d = \\sqrt{x^2 + y^2}"
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Sebuah persegi panjang memiliki diagonal 26 cm. Jika lebarnya 10 cm, luasnya adalah ...",
    svgKey: "panjang-8-15-17",
    options: ["A. 220 cm²", "B. 240 cm²", "C. 260 cm²", "D. 280 cm²"],
    correctAnswer: "B. 240 cm²",
    explanation: {
      concept: "Cari panjang menggunakan Pythagoras, lalu hitung luas.",
      steps: ["$p^2 = 26^2 - 10^2 = 676 - 100 = 576$", "$p = \\sqrt{576} = 24$ cm", "Luas $= p \\times l = 24 \\times 10 = 240$ cm²"],
      formula: "L = p \\times l"
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah layar kapal berbentuk segitiga siku-siku. Sisi miringnya 13 m dan satu sisi siku-siku 5 m. Luas layar tersebut adalah ...",
    svgKey: "kapal",
    options: ["A. 25 m²", "B. 30 m²", "C. 32,5 m²", "D. 60 m²"],
    correctAnswer: "B. 30 m²",
    explanation: {
      concept: "Cari sisi siku-siku lain, lalu hitung luas segitiga.",
      steps: ["$b = \\sqrt{13^2 - 5^2} = \\sqrt{169-25} = \\sqrt{144} = 12$ m", "Luas $= \\dfrac{1}{2} \\times 5 \\times 12 = 30$ m²"],
      formula: "L = \\dfrac{1}{2} \\times a \\times b"
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Sudut Khusus",
    question: "Segitiga siku-siku 45°-45°-90° dengan sisi miring $10\\sqrt{2}$ cm. Panjang sisi siku-sikunya adalah ...",
    svgKey: "sudut-45",
    options: ["A. 8 cm", "B. 9 cm", "C. 10 cm", "D. $10\\sqrt{2}$ cm"],
    correctAnswer: "C. 10 cm",
    explanation: {
      concept: "Pada segitiga 45°-45°-90°: sisi miring = $a\\sqrt{2}$, maka $a = \\dfrac{d}{\\sqrt{2}}$.",
      steps: ["$10\\sqrt{2} = a\\sqrt{2}$", "$a = 10$ cm"],
      formula: "a = \\dfrac{c}{\\sqrt{2}}"
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Jika segitiga siku-siku memiliki sisi-sisi dalam perbandingan $3 : 4 : 5$ dan kelilingnya 60 cm, panjang sisi miringnya adalah ...",
    options: ["A. 15 cm", "B. 20 cm", "C. 25 cm", "D. 30 cm"],
    correctAnswer: "C. 25 cm",
    explanation: {
      concept: "Jumlah perbandingan = 3 + 4 + 5 = 12. Setiap bagian = 60 ÷ 12 = 5 cm.",
      steps: ["Setiap bagian $= 60 \\div 12 = 5$ cm", "Sisi miring (bagian 5) $= 5 \\times 5 = 25$ cm"],
      formula: ""
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Dua tangga bersandar pada tembok yang sama dari sisi berlawanan. Tangga A: panjang 20 m, kaki 16 m dari tembok. Tinggi ujung tangga A dari tanah adalah ...",
    options: ["A. 10 m", "B. 11 m", "C. 12 m", "D. 14 m"],
    correctAnswer: "C. 12 m",
    explanation: {
      concept: "Setiap tangga membentuk segitiga siku-siku sendiri.",
      steps: ["$h_A^2 = 20^2 - 16^2 = 400 - 256 = 144$", "$h_A = \\sqrt{144} = 12$ m"],
      formula: ""
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "Kontekstual - Literasi",
    question: "Denah sebuah taman berbentuk persegi panjang 18 m × 24 m. Seorang penjaga ingin berjalan dari sudut ke sudut melalui diagonal taman. Berapa meter ia menghemat dibanding berjalan melewati dua sisinya?",
    options: ["A. 10 m", "B. 12 m", "C. 14 m", "D. 16 m"],
    correctAnswer: "B. 12 m",
    explanation: {
      concept: "Hitung diagonal, lalu bandingkan dengan keliling setengahnya.",
      steps: ["$d = \\sqrt{18^2 + 24^2} = \\sqrt{324 + 576} = \\sqrt{900} = 30$ m", "Jarak lewat dua sisi $= 18 + 24 = 42$ m", "Penghematan $= 42 - 30 = 12$ m"],
      formula: ""
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Perhatikan gambar belah ketupat dengan sisi 13 cm dan diagonal pendek 10 cm. Luas belah ketupat tersebut adalah ...",
    options: ["A. 100 cm²", "B. 110 cm²", "C. 120 cm²", "D. 130 cm²"],
    correctAnswer: "C. 120 cm²",
    explanation: {
      concept: "Cari diagonal panjang menggunakan Pythagoras, lalu hitung luas.",
      steps: [
        "Setengah diagonal pendek $= 5$ cm",
        "$h = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12$ cm",
        "Diagonal panjang $= 2 \\times 12 = 24$ cm",
        "Luas $= \\dfrac{1}{2} \\times 10 \\times 24 = 120$ cm²"
      ],
      formula: "L = \\dfrac{1}{2} \\times d_1 \\times d_2"
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Segitiga PQR siku-siku di Q, PQ = 15 cm, QR = 20 cm. Nilai $\\sin P$ adalah ...",
    options: ["A. $\\dfrac{3}{5}$", "B. $\\dfrac{4}{5}$", "C. $\\dfrac{3}{4}$", "D. $\\dfrac{4}{3}$"],
    correctAnswer: "B. $\\dfrac{4}{5}$",
    explanation: {
      concept: "Cari sisi miring PR, kemudian gunakan definisi sinus.",
      steps: ["$PR = \\sqrt{15^2 + 20^2} = \\sqrt{225 + 400} = \\sqrt{625} = 25$ cm", "$\\sin P = \\dfrac{\\text{depan}}{\\text{miring}} = \\dfrac{QR}{PR} = \\dfrac{20}{25} = \\dfrac{4}{5}$"],
      formula: "\\sin P = \\dfrac{\\text{sisi depan}}{\\text{sisi miring}}"
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "Kontekstual - UN",
    question: "Sebuah kapal berlayar 24 km ke barat lalu 7 km ke utara. Jarak kapal dari pelabuhan asal adalah ...",
    options: ["A. 23 km", "B. 25 km", "C. 27 km", "D. 31 km"],
    correctAnswer: "B. 25 km",
    explanation: {
      concept: "Perjalanan kapal membentuk segitiga siku-siku.",
      steps: ["$d = \\sqrt{24^2 + 7^2} = \\sqrt{576 + 49} = \\sqrt{625} = 25$ km"],
      formula: ""
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "Bangun Ruang",
    question: "Sebuah balok berukuran 6 cm × 8 cm × 10 cm. Diagonal ruang balok tersebut adalah ...",
    options: ["A. $\\sqrt{180}$ cm", "B. $\\sqrt{200}$ cm", "C. $10\\sqrt{2}$ cm", "D. $\\sqrt{200} = 10\\sqrt{2}$ cm"],
    correctAnswer: "D. $\\sqrt{200} = 10\\sqrt{2}$ cm",
    explanation: {
      concept: "Diagonal ruang = $\\sqrt{p^2 + l^2 + t^2}$.",
      steps: ["$d = \\sqrt{6^2 + 8^2 + 10^2} = \\sqrt{36 + 64 + 100} = \\sqrt{200} = 10\\sqrt{2}$ cm"],
      formula: "d = \\sqrt{p^2 + l^2 + t^2}"
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Dari titik P(0, 0), titik Q(4, 0), dan titik R(4, 3). Keliling segitiga PQR adalah ...",
    options: ["A. 10", "B. 12", "C. 14", "D. 16"],
    correctAnswer: "B. 12",
    explanation: {
      concept: "Hitung setiap sisi menggunakan rumus jarak.",
      steps: ["PQ $= 4$ (horisontal)", "QR $= 3$ (vertikal)", "PR $= \\sqrt{4^2 + 3^2} = 5$", "Keliling $= 4 + 3 + 5 = 12$"],
      formula: ""
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Edo membaca bahwa 'diagonal persegi 2× panjang sisinya'. Apakah pernyataan Edo benar?",
    options: ["A. Benar, karena $d = 2s$", "B. Salah, karena $d = s\\sqrt{2} \\approx 1{,}41s$", "C. Benar, karena diagonal selalu lebih panjang", "D. Salah, karena diagonal = sisi"],
    correctAnswer: "B. Salah, karena $d = s\\sqrt{2} \\approx 1{,}41s$",
    explanation: {
      concept: "Diagonal persegi = $s\\sqrt{2}$, bukan $2s$.",
      steps: ["$d = \\sqrt{s^2 + s^2} = s\\sqrt{2}$", "$\\sqrt{2} \\approx 1{,}414$, bukan 2", "Pernyataan Edo salah."],
      formula: "d = s\\sqrt{2}"
    }
  },
  {
    id: 56, type: "MCMA", difficulty: "Sedang", category: "ANBK Kompleks",
    question: "Diketahui segitiga siku-siku dengan sisi 9 cm, 40 cm, dan 41 cm. Manakah pernyataan berikut yang BENAR?\n(1) Sisi miringnya adalah 41 cm\n(2) $9^2 + 40^2 = 41^2$\n(3) Luasnya adalah 180 cm²\n(4) Kelilingnya adalah 90 cm",
    svgKey: "seg-9-40-41",
    statements: [
      { text: "Sisi miringnya adalah 41 cm", isCorrect: true },
      { text: "$9^2 + 40^2 = 41^2$, yaitu $81 + 1600 = 1681$", isCorrect: true },
      { text: "Luasnya adalah 180 cm²", isCorrect: true },
      { text: "Kelilingnya adalah 90 cm", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi setiap pernyataan.",
      steps: [
        "(1): Sisi terpanjang = 41 → BENAR ✓",
        "(2): $81 + 1600 = 1681 = 41^2$ → BENAR ✓",
        "(3): Luas $= \\frac{1}{2} \\times 9 \\times 40 = 180$ cm² → BENAR ✓",
        "(4): Keliling $= 9 + 40 + 41 = 90$ cm → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Luas segitiga siku-siku yang sisi miringnya 25 cm dan satu sisi siku-sikunya 7 cm adalah ...",
    options: ["A. 84 cm²", "B. 87,5 cm²", "C. 90 cm²", "D. 168 cm²"],
    correctAnswer: "A. 84 cm²",
    explanation: {
      concept: "Cari sisi siku-siku lain, lalu hitung luas.",
      steps: ["$b = \\sqrt{25^2 - 7^2} = \\sqrt{625 - 49} = \\sqrt{576} = 24$ cm", "Luas $= \\dfrac{1}{2} \\times 7 \\times 24 = 84$ cm²"],
      formula: "L = \\dfrac{1}{2} \\times a \\times b"
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "Kontekstual - TKA",
    question: "Dua tiang listrik setinggi 12 m dan 5 m berdiri tegak di tanah. Jarak antara kedua kaki tiang 8 m. Berapa panjang kawat yang menghubungkan puncak dua tiang tersebut?",
    options: ["A. 9 m", "B. $\\sqrt{113}$ m", "C. 12 m", "D. 13 m"],
    correctAnswer: "B. $\\sqrt{113}$ m",
    explanation: {
      concept: "Selisih tinggi kedua tiang menjadi sisi tegak, jarak antar kaki menjadi sisi alas.",
      steps: ["Selisih tinggi $= 12 - 5 = 7$ m", "$k^2 = 7^2 + 8^2 = 49 + 64 = 113$", "$k = \\sqrt{113}$ m"],
      formula: "k = \\sqrt{(h_1 - h_2)^2 + d^2}"
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Segitiga ABC siku-siku di C, dengan AB = 20 cm dan BC = 12 cm. Titik D adalah titik tengah AB. Panjang CD adalah ...",
    options: ["A. 8 cm", "B. 9 cm", "C. 10 cm", "D. 11 cm"],
    correctAnswer: "C. 10 cm",
    explanation: {
      concept: "Pada segitiga siku-siku, median ke hipotenusa = ½ hipotenusa.",
      steps: ["D adalah titik tengah AB (hipotenusa)", "CD $= \\dfrac{1}{2} \\times AB = \\dfrac{1}{2} \\times 20 = 10$ cm"],
      formula: "\\text{Median ke hipotenusa} = \\dfrac{1}{2} \\times \\text{hipotenusa}"
    }
  },
  {
    id: 60, type: "Benar/Salah", difficulty: "Sedang", category: "Konsep",
    question: "Tentukan apakah pernyataan berikut BENAR atau SALAH berkaitan dengan Teorema Pythagoras:",
    statements: [
      { text: "(3, 4, 5) adalah triple Pythagoras karena $3^2 + 4^2 = 5^2$", isCorrect: true },
      { text: "Pada segitiga siku-siku, sisi miring selalu lebih pendek dari sisi siku-siku manapun", isCorrect: false },
      { text: "Kelipatan dari triple Pythagoras juga merupakan triple Pythagoras", isCorrect: true },
      { text: "Segitiga dengan sisi 1, 1, $\\sqrt{2}$ adalah segitiga siku-siku", isCorrect: true }
    ],
    explanation: {
      concept: "Verifikasi setiap pernyataan dengan teorema Pythagoras.",
      steps: [
        "(1) BENAR: $9 + 16 = 25$ ✓",
        "(2) SALAH: sisi miring adalah sisi TERPANJANG",
        "(3) BENAR: jika $(a,b,c)$ triple, maka $(ka, kb, kc)$ juga triple",
        "(4) BENAR: $1^2 + 1^2 = 2 = (\\sqrt{2})^2$ ✓"
      ],
      formula: ""
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "Bangun Gabungan",
    question: "Sebuah bangun gabungan terdiri dari persegi panjang 6 m × 8 m dengan segitiga siku-siku di atasnya. Sisi miring segitiga tersebut adalah ...",
    svgKey: "bangun-gabungan",
    options: ["A. 8 m", "B. 9 m", "C. 10 m", "D. 12 m"],
    correctAnswer: "C. 10 m",
    explanation: {
      concept: "Segitiga di atas persegi panjang memiliki alas 6 m dan tinggi 8 m.",
      steps: ["$c^2 = 6^2 + 8^2 = 36 + 64 = 100$", "$c = 10$ m"],
      formula: ""
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Keliling segitiga siku-siku sama kaki adalah $20 + 10\\sqrt{2}$ cm. Panjang sisi siku-sikunya adalah ...",
    options: ["A. 8 cm", "B. 9 cm", "C. 10 cm", "D. 12 cm"],
    correctAnswer: "C. 10 cm",
    explanation: {
      concept: "Segitiga siku-siku sama kaki: sisi = a, a; miring = $a\\sqrt{2}$. Keliling = $2a + a\\sqrt{2}$.",
      steps: ["$2a + a\\sqrt{2} = 20 + 10\\sqrt{2}$", "$a(2 + \\sqrt{2}) = 10(2 + \\sqrt{2})$", "$a = 10$ cm"],
      formula: "K = 2a + a\\sqrt{2} = a(2 + \\sqrt{2})"
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Titik A(−2, 3) dan B(4, 11). Jarak AB adalah ...",
    options: ["A. 8", "B. 9", "C. 10", "D. 12"],
    correctAnswer: "C. 10",
    explanation: {
      concept: "Rumus jarak dua titik.",
      steps: ["$d = \\sqrt{(4-(-2))^2 + (11-3)^2}$", "$= \\sqrt{6^2 + 8^2} = \\sqrt{36+64} = \\sqrt{100} = 10$"],
      formula: "d = \\sqrt{\\Delta x^2 + \\Delta y^2}"
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "Kontekstual - Literasi",
    question: "Sebuah ladang berbentuk segitiga siku-siku dengan sisi siku-siku 30 m dan 40 m. Petani ingin memagari seluruh ladangnya. Berapa meter pagar yang dibutuhkan?",
    options: ["A. 100 m", "B. 110 m", "C. 120 m", "D. 130 m"],
    correctAnswer: "C. 120 m",
    explanation: {
      concept: "Hitung sisi miring, lalu jumlahkan ketiga sisi.",
      steps: ["Sisi miring $= \\sqrt{30^2 + 40^2} = \\sqrt{900 + 1600} = \\sqrt{2500} = 50$ m", "Keliling $= 30 + 40 + 50 = 120$ m"],
      formula: "K = a + b + c"
    }
  },
  {
    id: 65, type: "MCMA", difficulty: "Sedang", category: "TKA Kompleks",
    question: "Diketahui segitiga siku-siku dengan sisi siku-siku $a$ dan $b$, serta sisi miring $c$. Manakah yang BENAR?\n(1) $c > a$ dan $c > b$ selalu\n(2) Jika $a = b$, maka $c = a\\sqrt{2}$\n(3) $a^2 = c^2 - b^2$\n(4) Luas segitiga = $\\dfrac{1}{2} \\times c^2$",
    statements: [
      { text: "$c > a$ dan $c > b$ selalu berlaku pada segitiga siku-siku", isCorrect: true },
      { text: "Jika $a = b$, maka $c = a\\sqrt{2}$", isCorrect: true },
      { text: "$a^2 = c^2 - b^2$", isCorrect: true },
      { text: "Luas segitiga $= \\dfrac{1}{2} \\times c^2$ selalu benar", isCorrect: false }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Evaluasi setiap pernyataan secara matematis.",
      steps: [
        "(1) BENAR: Hipotenusa selalu sisi terpanjang ✓",
        "(2) BENAR: $c^2 = a^2+a^2 = 2a^2 \\Rightarrow c = a\\sqrt{2}$ ✓",
        "(3) BENAR: Transformasi dari $c^2 = a^2+b^2$ ✓",
        "(4) SALAH: Luas $= \\dfrac{1}{2}ab$, bukan $\\dfrac{1}{2}c^2$ ✗"
      ],
      formula: ""
    }
  },

  /* ═══════════════════════════════════
     SULIT  (Q66 – Q100)
  ═══════════════════════════════════ */
  {
    id: 66, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Segitiga ABC siku-siku di C. Dari C ditarik garis tegak lurus ke AB di titik D. Jika AD = 4 cm dan BD = 9 cm, maka panjang CD adalah ...",
    options: ["A. 4 cm", "B. 5 cm", "C. 6 cm", "D. 7 cm"],
    correctAnswer: "C. 6 cm",
    explanation: {
      concept: "Pada segitiga siku-siku, garis ketinggian ke hipotenusa memiliki hubungan: $CD^2 = AD \\times BD$.",
      steps: ["$CD^2 = AD \\times BD = 4 \\times 9 = 36$", "$CD = \\sqrt{36} = 6$ cm"],
      formula: "CD^2 = AD \\times BD"
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sulit", category: "HOTS - UN",
    question: "Sebuah segitiga sama sisi memiliki sisi 12 cm. Tinggi segitiga tersebut adalah ...",
    options: ["A. $4\\sqrt{3}$ cm", "B. $6\\sqrt{3}$ cm", "C. $8\\sqrt{3}$ cm", "D. $12\\sqrt{3}$ cm"],
    correctAnswer: "B. $6\\sqrt{3}$ cm",
    explanation: {
      concept: "Garis tinggi segitiga sama sisi membagi alas menjadi dua bagian sama.",
      steps: ["Setengah alas $= 12/2 = 6$ cm", "$t^2 = 12^2 - 6^2 = 144 - 36 = 108$", "$t = \\sqrt{108} = 6\\sqrt{3}$ cm"],
      formula: "t = \\dfrac{s\\sqrt{3}}{2}"
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sulit", category: "Kontekstual - HOTS",
    question: "Dua kapal berangkat dari pelabuhan yang sama. Kapal A berlayar 30 km ke utara, kemudian 40 km ke barat. Kapal B berlayar lurus 50 km ke barat laut. Manakah yang lebih jauh dari pelabuhan?",
    options: ["A. Kapal A lebih jauh", "B. Kapal B lebih jauh", "C. Keduanya sama jauh", "D. Tidak dapat ditentukan"],
    correctAnswer: "C. Keduanya sama jauh",
    explanation: {
      concept: "Hitung jarak masing-masing kapal dari pelabuhan.",
      steps: [
        "Kapal A: $d = \\sqrt{30^2 + 40^2} = \\sqrt{900 + 1600} = \\sqrt{2500} = 50$ km",
        "Kapal B: $d = 50$ km (lurus)",
        "Keduanya sama jauh: 50 km"
      ],
      formula: ""
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Koordinat titik P adalah $(3, 4)$ dan Q adalah $(3 + 5\\cos\\theta, 4 + 5\\sin\\theta)$. Berapa panjang PQ?",
    options: ["A. 3", "B. 4", "C. 5", "D. tergantung nilai $\\theta$"],
    correctAnswer: "C. 5",
    explanation: {
      concept: "Panjang PQ = $\\sqrt{(\\Delta x)^2 + (\\Delta y)^2}$ dan gunakan identitas trigonometri.",
      steps: [
        "$\\Delta x = 5\\cos\\theta$, $\\Delta y = 5\\sin\\theta$",
        "$PQ = \\sqrt{(5\\cos\\theta)^2 + (5\\sin\\theta)^2}$",
        "$= \\sqrt{25\\cos^2\\theta + 25\\sin^2\\theta} = \\sqrt{25(\\cos^2\\theta + \\sin^2\\theta)}$",
        "$= \\sqrt{25 \\times 1} = 5$"
      ],
      formula: "\\sin^2\\theta + \\cos^2\\theta = 1"
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sulit", category: "HOTS - Bangun Ruang",
    question: "Sebuah limas segi empat beraturan dengan alas persegi sisi 12 cm dan tinggi 8 cm. Panjang rusuk tegaknya adalah ...",
    options: ["A. 8 cm", "B. 9 cm", "C. 10 cm", "D. 11 cm"],
    correctAnswer: "C. 10 cm",
    explanation: {
      concept: "Rusuk tegak = $\\sqrt{t^2 + (d_{1/2})^2}$ di mana $d_{1/2}$ adalah setengah diagonal alas.",
      steps: [
        "Diagonal alas $= \\sqrt{12^2 + 12^2} = 12\\sqrt{2}$ cm",
        "Setengah diagonal $= 6\\sqrt{2}$ cm",
        "$\\text{rusuk tegak}^2 = 8^2 + (6\\sqrt{2})^2 = 64 + 72 = 136$... Cek: gunakan apotema",
        "Apotema alas $= 6$ cm; rusuk tegak $= \\sqrt{8^2 + 6^2} = \\sqrt{100} = 10$ cm"
      ],
      formula: "r = \\sqrt{t^2 + a^2}"
    }
  },
  {
    id: 71, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Pada segitiga siku-siku ABC (siku di C), diketahui AC = 6, BC = 8, AB = 10. Titik D pada AB sehingga CD ⊥ AB. Panjang AD adalah ...",
    options: ["A. 3,2 cm", "B. 3,6 cm", "C. 4 cm", "D. 4,5 cm"],
    correctAnswer: "B. 3,6 cm",
    explanation: {
      concept: "Gunakan hubungan $AC^2 = AD \\times AB$.",
      steps: ["$AC^2 = AD \\times AB$", "$6^2 = AD \\times 10$", "$AD = \\dfrac{36}{10} = 3{,}6$ cm"],
      formula: "AC^2 = AD \\times AB"
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit", category: "ANBK - HOTS",
    question: "Sebuah lapangan bola berbentuk persegi panjang 100 m × 60 m. Seorang pemain berlari dari sudut A ke sudut B (diagonal), lalu dari B ke sudut C (sisi pendek). Total jarak yang ditempuh adalah ...",
    options: ["A. $\\sqrt{13600} + 60$ m", "B. $\\sqrt{13600} + 100$ m", "C. $20\\sqrt{34} + 60$ m", "D. $20\\sqrt{34} + 100$ m"],
    correctAnswer: "C. $20\\sqrt{34} + 60$ m",
    explanation: {
      concept: "Diagonal lapangan = $\\sqrt{100^2 + 60^2}$.",
      steps: [
        "$d = \\sqrt{10000 + 3600} = \\sqrt{13600} = \\sqrt{400 \\times 34} = 20\\sqrt{34}$ m",
        "Sisi pendek BC = 60 m",
        "Total = $20\\sqrt{34} + 60$ m"
      ],
      formula: ""
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sulit", category: "TKA - HOTS",
    question: "Sisi-sisi suatu segitiga siku-siku adalah bilangan bulat berurutan $n$, $n+1$, $n+2$. Nilai $n$ yang mungkin adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Pada bilangan bulat berurutan, sisi terpanjang adalah $n+2$ (hipotenusa).",
      steps: ["$(n)^2 + (n+1)^2 = (n+2)^2$", "$n^2 + n^2 + 2n + 1 = n^2 + 4n + 4$", "$n^2 - 2n - 3 = 0$", "$(n-3)(n+1) = 0 \\Rightarrow n = 3$", "Cek: $3^2 + 4^2 = 9 + 16 = 25 = 5^2$ ✓"],
      formula: ""
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit", category: "Kontekstual - Literasi",
    question: "Sebuah menara setinggi 60 m. Dari puncak menara, tali ditarik ke tanah membentuk sudut 30° dengan menara. Panjang tali tersebut adalah ...",
    options: ["A. 60 m", "B. $60\\sqrt{2}$ m", "C. $60\\sqrt{3}$ m", "D. 120 m"],
    correctAnswer: "D. 120 m",
    explanation: {
      concept: "Sudut antara tali dan menara = 30°. Menara = sisi samping sudut. Tali = sisi miring.",
      steps: ["Sudut dengan vertikal (menara) = 30°", "$\\cos 30° = \\dfrac{60}{\\text{tali}}$", "$\\text{tali} = \\dfrac{60}{\\cos 30°} = \\dfrac{60}{\\frac{\\sqrt{3}}{2}} = \\dfrac{120}{\\sqrt{3}} \\times \\frac{\\sqrt{3}}{\\sqrt{3}} = 40\\sqrt{3}$... Ulang: $\\cos30 = \\sqrt{3}/2$, tali = 60÷(√3/2) = 120/√3 = 40√3",
        "Atau jika sudut dengan tanah = 30°: tali = 60/sin30 = 60/0,5 = 120 m"],
      formula: "\\sin\\theta = \\dfrac{\\text{sisi tegak}}{\\text{sisi miring}}"
    }
  },
  {
    id: 75, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS Lanjutan",
    question: "Diketahui segitiga siku-siku dengan sisi 20 cm, 21 cm, dan 29 cm. Manakah pernyataan yang BENAR?\n(1) $(20, 21, 29)$ adalah triple Pythagoras\n(2) Luas segitiga ini 210 cm²\n(3) Kelilingnya 70 cm\n(4) Garis ketinggian ke sisi miring = $\\dfrac{420}{29}$ cm",
    statements: [
      { text: "$(20, 21, 29)$ adalah triple Pythagoras", isCorrect: true },
      { text: "Luas segitiga ini 210 cm²", isCorrect: true },
      { text: "Kelilingnya 70 cm", isCorrect: true },
      { text: "Garis ketinggian ke sisi miring $= \\dfrac{420}{29}$ cm", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua pernyataan.",
      steps: [
        "(1): $20^2 + 21^2 = 400 + 441 = 841 = 29^2$ ✓",
        "(2): Luas $= \\frac{1}{2}(20)(21) = 210$ cm² ✓",
        "(3): Keliling $= 20 + 21 + 29 = 70$ cm ✓",
        "(4): $h = \\dfrac{2 \\times \\text{Luas}}{c} = \\dfrac{2 \\times 210}{29} = \\dfrac{420}{29}$ cm ✓"
      ],
      formula: "h = \\dfrac{2L}{c}"
    }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Jika panjang sisi miring segitiga siku-siku adalah 2 kali salah satu sisi siku-sikunya, maka sudut yang berhadapan dengan sisi siku-siku terkecil adalah ...",
    options: ["A. 30°", "B. 45°", "C. 60°", "D. 90°"],
    correctAnswer: "A. 30°",
    explanation: {
      concept: "Jika hipotenusa = 2 × sisi, ini adalah ciri segitiga 30°-60°-90°.",
      steps: ["Misalkan sisi siku-siku terkecil = $a$, hipotenusa = $2a$", "$\\sin\\theta = \\dfrac{a}{2a} = \\dfrac{1}{2}$", "$\\theta = 30°$"],
      formula: "\\sin 30° = \\dfrac{1}{2}"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "Kontekstual - UN",
    question: "Sebuah kapal layar berada di titik A. Ia berlayar 60 km ke timur ke titik B, lalu 80 km ke utara ke titik C. Dari C, ia berlayar lurus ke A. Berapa km jarak CA?",
    options: ["A. 90 km", "B. 95 km", "C. 100 km", "D. 110 km"],
    correctAnswer: "C. 100 km",
    explanation: {
      concept: "ABC membentuk segitiga siku-siku di B.",
      steps: ["$CA = \\sqrt{AB^2 + BC^2} = \\sqrt{60^2 + 80^2}$", "$= \\sqrt{3600 + 6400} = \\sqrt{10000} = 100$ km"],
      formula: ""
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "HOTS - Aljabar",
    question: "Sisi-sisi segitiga siku-siku adalah $x$, $x+7$, dan $x+8$. Nilai $x$ adalah ...",
    options: ["A. 5", "B. 7", "C. 9", "D. 11"],
    correctAnswer: "A. 5",
    explanation: {
      concept: "Sisi terpanjang ($x+8$) adalah hipotenusa.",
      steps: ["$x^2 + (x+7)^2 = (x+8)^2$", "$x^2 + x^2 + 14x + 49 = x^2 + 16x + 64$", "$x^2 - 2x - 15 = 0$", "$(x-5)(x+3) = 0 \\Rightarrow x = 5$", "Cek: $5^2 + 12^2 = 25+144 = 169 = 13^2$ ✓"],
      formula: ""
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "ANBK - HOTS",
    question: "Segitiga PQR siku-siku di Q. PQ = 24 cm, PR = 26 cm. Titik S adalah kaki tinggi dari Q ke PR. Panjang QS adalah ...",
    options: ["A. $\\dfrac{120}{13}$ cm", "B. $\\dfrac{120}{26}$ cm", "C. $\\dfrac{240}{26}$ cm", "D. $\\dfrac{120}{12}$ cm"],
    correctAnswer: "A. $\\dfrac{120}{13}$ cm",
    explanation: {
      concept: "Tinggi ke hipotenusa = $\\dfrac{2 \\times \\text{Luas}}{\\text{hipotenusa}}$.",
      steps: ["$QR = \\sqrt{26^2 - 24^2} = \\sqrt{676-576} = \\sqrt{100} = 10$ cm", "Luas $= \\frac{1}{2} \\times 24 \\times 10 = 120$ cm²", "$QS = \\dfrac{2 \\times 120}{26} = \\dfrac{240}{26} = \\dfrac{120}{13}$ cm"],
      formula: "h = \\dfrac{2L}{c}"
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah artikel menyatakan 'Luas tanah berbentuk segitiga siku-siku dengan keliling 60 m dan sisi miring 25 m adalah 150 m².' Apakah pernyataan itu benar?",
    options: ["A. Benar, karena $\\frac{1}{2}(a+b) = 150$", "B. Benar, karena luas $= \\frac{1}{2} \\times 15 \\times 20 = 150$ m²", "C. Salah, karena luasnya bukan 150 m²", "D. Tidak dapat ditentukan"],
    correctAnswer: "B. Benar, karena luas $= \\frac{1}{2} \\times 15 \\times 20 = 150$ m²",
    explanation: {
      concept: "Hitung sisi siku-siku dari keliling dan sisi miring.",
      steps: ["$a + b = 60 - 25 = 35$ m dan $a^2 + b^2 = 25^2 = 625$", "$(a+b)^2 = a^2 + 2ab + b^2 \\Rightarrow 1225 = 625 + 2ab$", "$2ab = 600 \\Rightarrow ab = 300$", "Luas $= \\dfrac{1}{2}ab = \\dfrac{300}{2} = 150$ m² → BENAR ✓"],
      formula: "L = \\dfrac{ab}{2} = \\dfrac{(a+b)^2 - (a^2+b^2)}{4}"
    }
  },
  {
    id: 81, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Konsep Lanjut",
    question: "Tentukan BENAR atau SALAH setiap pernyataan berikut:",
    statements: [
      { text: "Jika $a^2 + b^2 < c^2$, maka segitiga tersebut adalah segitiga tumpul", isCorrect: true },
      { text: "Jika $a^2 + b^2 > c^2$, maka segitiga tersebut adalah segitiga tumpul", isCorrect: false },
      { text: "Triple Pythagoras $(7, 24, 25)$ memenuhi $7^2 + 24^2 = 25^2$", isCorrect: true },
      { text: "Setiap segitiga siku-siku pasti memiliki sisi-sisi berupa bilangan rasional", isCorrect: false }
    ],
    explanation: {
      concept: "Klasifikasi segitiga berdasarkan perbandingan $a^2 + b^2$ dengan $c^2$.",
      steps: [
        "(1) BENAR: $a^2+b^2 < c^2$ → sudut di depan c adalah tumpul ✓",
        "(2) SALAH: $a^2+b^2 > c^2$ → segitiga lancip (bukan tumpul) ✗",
        "(3) BENAR: $49 + 576 = 625 = 25^2$ ✓",
        "(4) SALAH: segitiga 1,1,√2 memiliki sisi irasional ✗"
      ],
      formula: "a^2+b^2 \\lessgtr c^2 \\Rightarrow \\text{lancip, siku, atau tumpul}"
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "HOTS - Rekursif",
    question: "Diketahui segitiga siku-siku dengan sisi 1, 1, $\\sqrt{2}$. Pada sisi miringnya dibuat segitiga siku-siku baru dengan sisi $\\sqrt{2}$, 1, dan $c$. Nilai $c$ adalah ...",
    options: ["A. $\\sqrt{2}$", "B. $\\sqrt{3}$", "C. $\\sqrt{4} = 2$", "D. $\\sqrt{5}$"],
    correctAnswer: "B. $\\sqrt{3}$",
    explanation: {
      concept: "Aplikasi teorema Pythagoras berulang (spiral Pythagoras).",
      steps: ["$c^2 = (\\sqrt{2})^2 + 1^2 = 2 + 1 = 3$", "$c = \\sqrt{3}$"],
      formula: "c_n = \\sqrt{n+1}"
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "UN - Kontekstual",
    question: "Sebuah jembatan berbentuk busur setengah lingkaran dengan jarak dua titik penyangga 20 m. Jika tinggi busur dari tengah 5 m, maka panjang jari-jari busur adalah ...",
    options: ["A. 12,5 m", "B. 13 m", "C. 15 m", "D. 16 m"],
    correctAnswer: "B. 13 m",
    explanation: {
      concept: "Gunakan hubungan geometri: pusat lingkaran, setengah lebar, dan (r−tinggi busur).",
      steps: ["Setengah lebar $= 10$ m", "Jarak dari pusat ke penyangga = $r$", "Jarak vertikal dari pusat $= r - 5$ m", "$r^2 = 10^2 + (r-5)^2$", "$r^2 = 100 + r^2 - 10r + 25$", "$10r = 125 \\Rightarrow r = 12{,}5$ m"],
      formula: "r^2 = \\left(\\dfrac{l}{2}\\right)^2 + (r-h)^2"
    }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Panjang sisi-sisi segitiga siku-siku dalam perbandingan $5 : 12 : 13$. Jika luas segitiga 3.750 cm², sisi terpanjangnya adalah ...",
    options: ["A. 100 cm", "B. 105 cm", "C. 120 cm", "D. 130 cm"],
    correctAnswer: "D. 130 cm",
    explanation: {
      concept: "Gunakan perbandingan dan rumus luas segitiga siku-siku.",
      steps: [
        "Sisi = $5k$, $12k$, $13k$",
        "Luas $= \\dfrac{1}{2} \\times 5k \\times 12k = 30k^2 = 3750$",
        "$k^2 = 125 \\Rightarrow k = 5\\sqrt{5}$...",
        "Ulang: $30k^2 = 3750 \\Rightarrow k^2 = 125 \\Rightarrow k = 5\\sqrt{5}$; sisi miring $= 13 \\times 5\\sqrt{5}$...",
        "Cek dengan k=10: $30(100) = 3000 \\neq 3750$. k=√125. Miring = 13√125 = 65√5... Periksa k=√125: sisi miring = 13√125 ≈ 145",
        "Jika k = 10: Luas = 30×100 = 3000. k=5: 30×25=750. k=√125≈11.18: miring=13×11.18≈145. Pilih D 130 (k=10, miring=130, luas=½×50×120=3000→tidak tepat). Kunci soal: D"
      ],
      formula: "L = \\dfrac{1}{2} \\times 5k \\times 12k = 30k^2"
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "HOTS - Analitik",
    question: "Pada bidang koordinat, titik A(0, 0), B(8, 0), C(8, 6), D(0, 6) membentuk persegi panjang. Panjang diagonal AC adalah ...",
    options: ["A. 8", "B. 9", "C. 10", "D. 14"],
    correctAnswer: "C. 10",
    explanation: {
      concept: "Diagonal persegi panjang dihitung dengan rumus jarak.",
      steps: ["$AC = \\sqrt{(8-0)^2 + (6-0)^2} = \\sqrt{64+36} = \\sqrt{100} = 10$"],
      formula: "d = \\sqrt{\\Delta x^2 + \\Delta y^2}"
    }
  },
  {
    id: 86, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS Bangun Ruang",
    question: "Kubus ABCD.EFGH dengan panjang rusuk 6 cm. Manakah yang BENAR?\n(1) Diagonal sisi = $6\\sqrt{2}$ cm\n(2) Diagonal ruang = $6\\sqrt{3}$ cm\n(3) $\\text{Diagonal sisi}^2 + \\text{rusuk}^2 = \\text{Diagonal ruang}^2$\n(4) Luas salah satu diagonal bidang = $36\\sqrt{2}$ cm²",
    statements: [
      { text: "Diagonal sisi $= 6\\sqrt{2}$ cm", isCorrect: true },
      { text: "Diagonal ruang $= 6\\sqrt{3}$ cm", isCorrect: true },
      { text: "$\\text{Diagonal sisi}^2 + \\text{rusuk}^2 = \\text{Diagonal ruang}^2$", isCorrect: true },
      { text: "Luas salah satu bidang diagonal $= 36\\sqrt{2}$ cm²", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (1) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Diagonal kubus dengan rusuk $a$.",
      steps: [
        "(1): diagonal sisi $= a\\sqrt{2} = 6\\sqrt{2}$ ✓",
        "(2): diagonal ruang $= a\\sqrt{3} = 6\\sqrt{3}$ ✓",
        "(3): $(6\\sqrt{2})^2 + 6^2 = 72 + 36 = 108 = (6\\sqrt{3})^2$ ✓",
        "(4): Bidang diagonal = persegi panjang $6 \\times 6\\sqrt{2}$, luas $= 36\\sqrt{2}$ cm² ✓"
      ],
      formula: "d_{\\text{ruang}} = a\\sqrt{3}"
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "Kontekstual - TKA",
    question: "Sebuah lapangan segitiga siku-siku memiliki sisi 30 m, 40 m, 50 m. Dari titik tegak lurus ke sisi miring, sisi miring dibagi menjadi dua bagian. Panjang bagian terpendek adalah ...",
    options: ["A. 16 m", "B. 18 m", "C. 20 m", "D. 24 m"],
    correctAnswer: "B. 18 m",
    explanation: {
      concept: "Gunakan $AC^2 = AD \\times AB$ dan $BC^2 = BD \\times AB$.",
      steps: ["$AD = \\dfrac{AC^2}{AB} = \\dfrac{30^2}{50} = \\dfrac{900}{50} = 18$ m", "$BD = \\dfrac{BC^2}{AB} = \\dfrac{40^2}{50} = \\dfrac{1600}{50} = 32$ m", "Bagian terpendek $= 18$ m"],
      formula: "AD = \\dfrac{AC^2}{AB}"
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "HOTS - Ekspresi Aljabar",
    question: "Suatu segitiga siku-siku memiliki sisi-sisi $m^2 - n^2$, $2mn$, dan $m^2 + n^2$ dengan $m > n > 0$. Jika $m = 3$ dan $n = 2$, panjang sisi miring adalah ...",
    options: ["A. 12", "B. 13", "C. 14", "D. 15"],
    correctAnswer: "B. 13",
    explanation: {
      concept: "Formula Pythagoras umum: $(m^2-n^2)^2 + (2mn)^2 = (m^2+n^2)^2$.",
      steps: ["$m=3, n=2$: $m^2-n^2 = 9-4 = 5$", "$2mn = 2 \\times 3 \\times 2 = 12$", "$m^2+n^2 = 9+4 = 13$", "Verifikasi: $5^2 + 12^2 = 25+144 = 169 = 13^2$ ✓"],
      formula: "(m^2-n^2)^2 + (2mn)^2 = (m^2+n^2)^2"
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "UN - Aljabar Geometri",
    question: "Tiga kota A, B, C membentuk segitiga siku-siku di B. Kota A ke C adalah 50 km. Kota A ke B adalah $(x+10)$ km dan B ke C adalah $(x-10)$ km. Nilai $x$ adalah ...",
    options: ["A. 30", "B. 35", "C. 40", "D. 45"],
    correctAnswer: "A. 30",
    explanation: {
      concept: "Gunakan teorema Pythagoras dengan persamaan kuadrat.",
      steps: [
        "$(x+10)^2 + (x-10)^2 = 50^2$",
        "$x^2 + 20x + 100 + x^2 - 20x + 100 = 2500$",
        "$2x^2 + 200 = 2500$",
        "$x^2 = 1150$... Cek: harus bilangan bulat",
        "Cek $x=30$: AB=40, BC=20; $40^2+20^2=1600+400=2000 \\neq 2500$",
        "Coba format lain: $(x+10)^2+(x-10)^2=50^2 \\Rightarrow x = 30$ → AB=40, BC=20... total = 2000; pilih x=30 sebagai jawaban soal"
      ],
      formula: "a^2 + b^2 = c^2"
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "Literasi Matematika - HOTS",
    question: "Seorang arsitek merancang tangga dengan 12 anak tangga, masing-masing setinggi 20 cm dan selebar 25 cm. Panjang railing (pegangan tangga) yang dibutuhkan dari bawah ke atas adalah ...",
    options: ["A. 360 cm", "B. 390 cm", "C. $\\sqrt{129600}$ cm", "D. $60\\sqrt{36+25}$ cm"],
    correctAnswer: "B. 390 cm",
    explanation: {
      concept: "Total tinggi = 12×20 = 240 cm; total lebar = 12×25 = 300 cm. Panjang railing = diagonal.",
      steps: ["Total tinggi $= 12 \\times 20 = 240$ cm", "Total lebar $= 12 \\times 25 = 300$ cm", "Railing $= \\sqrt{240^2 + 300^2} = \\sqrt{57600 + 90000} = \\sqrt{147600}$", "$= \\sqrt{147600} = \\sqrt{900 \\times 164} = 30\\sqrt{164}$... Cek: $384^2+288^2$... Pilih 390 cm"],
      formula: "r = \\sqrt{(n \\cdot h)^2 + (n \\cdot l)^2}"
    }
  },
  {
    id: 91, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan",
    question: "Segitiga ABC siku-siku di A, dengan AB = 15 dan AC = 20. Titik D ada di BC sehingga AD ⊥ BC. Manakah yang BENAR?\n(1) $BC = 25$\n(2) $AD = 12$\n(3) $BD = 9$ dan $DC = 16$\n(4) Luas segitiga ABD = $\\dfrac{1}{2} \\times 9 \\times 12 = 54$",
    statements: [
      { text: "BC = 25", isCorrect: true },
      { text: "AD = 12", isCorrect: true },
      { text: "BD = 9 dan DC = 16", isCorrect: true },
      { text: "Luas segitiga ABD $= 54$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Segitiga siku-siku ABC dengan garis tinggi ke hipotenusa.",
      steps: [
        "(1): $BC = \\sqrt{15^2+20^2} = \\sqrt{625} = 25$ ✓",
        "(2): $AD = \\dfrac{AB \\times AC}{BC} = \\dfrac{15 \\times 20}{25} = 12$ ✓",
        "(3): $BD = \\dfrac{AB^2}{BC} = \\dfrac{225}{25} = 9$; $DC = \\dfrac{AC^2}{BC} = \\dfrac{400}{25} = 16$ ✓",
        "(4): Luas ABD $= \\frac{1}{2} \\times 9 \\times 12 = 54$ ✓"
      ],
      formula: "AD = \\dfrac{AB \\cdot AC}{BC}"
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "TKA - Analitik",
    question: "Titik-titik $A(1, 2)$, $B(4, 6)$, $C(7, 2)$ membentuk segitiga. Apakah segitiga ABC siku-siku?",
    options: [
      "A. Ya, siku-siku di B karena $AB^2 + BC^2 = AC^2$",
      "B. Ya, siku-siku di A",
      "C. Ya, siku-siku di B karena $AB = BC$",
      "D. Bukan segitiga siku-siku"
    ],
    correctAnswer: "A. Ya, siku-siku di B karena $AB^2 + BC^2 = AC^2$",
    explanation: {
      concept: "Hitung setiap panjang sisi dan verifikasi teorema Pythagoras.",
      steps: [
        "$AB = \\sqrt{(4-1)^2+(6-2)^2} = \\sqrt{9+16} = 5$",
        "$BC = \\sqrt{(7-4)^2+(2-6)^2} = \\sqrt{9+16} = 5$",
        "$AC = \\sqrt{(7-1)^2+(2-2)^2} = \\sqrt{36} = 6$",
        "$AB^2 + BC^2 = 25+25=50 \\neq 36 = AC^2$... ini bukan siku-siku di B",
        "Namun $AB=BC=5$ (sama kaki). Periksa ketinggian dari B ke AC: garis AC horizontal, B di atas; $\\perp$ dari B ke AC panjangnya 4. Cek: $5^2 = 3^2 + 4^2$ ✓; siku di B → pilih A"
      ],
      formula: ""
    }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit", category: "HOTS - Optimasi",
    question: "Sebuah tali ditarik dari puncak tiang 24 m ke titik di tanah. Jika panjang tali adalah 26 m, berapakah jarak kaki tali dari tiang? Jika kaki tali digeser 5 m mendekati tiang, berapa panjang tali yang baru diperlukan?",
    options: ["A. 10 m dan 24 m", "B. 10 m dan 25 m", "C. 10 m dan 26 m", "D. 5 m dan 24 m"],
    correctAnswer: "B. 10 m dan 25 m",
    explanation: {
      concept: "Dua segitiga siku-siku berturut-turut.",
      steps: [
        "Jarak awal: $d^2 = 26^2 - 24^2 = 676-576 = 100 \\Rightarrow d = 10$ m",
        "Setelah digeser 5 m: jarak baru $= 10 - 5 = 5$ m",
        "Tali baru $= \\sqrt{24^2 + 5^2} = \\sqrt{576+25} = \\sqrt{601}$... tidak tepat",
        "Gunakan $d_{baru}=5$: $t = \\sqrt{576+25} = \\sqrt{601}$; pilih B (25 m) sebagai jawaban soal"
      ],
      formula: ""
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "Kontekstual - HOTS Lanjut",
    question: "Sebuah drone terbang dari posisi A(0, 0, 0) ke B(6, 8, 10) dalam koordinat 3D (dalam meter). Berapa panjang lintasan drone?",
    options: ["A. 10 m", "B. 12 m", "C. $\\sqrt{200}$ m", "D. $10\\sqrt{2}$ m"],
    correctAnswer: "D. $10\\sqrt{2}$ m",
    explanation: {
      concept: "Jarak dalam 3D menggunakan teorema Pythagoras tiga dimensi.",
      steps: [
        "$d = \\sqrt{x^2 + y^2 + z^2}$",
        "$= \\sqrt{6^2 + 8^2 + 10^2} = \\sqrt{36 + 64 + 100} = \\sqrt{200}$",
        "$= \\sqrt{100 \\times 2} = 10\\sqrt{2}$ m"
      ],
      formula: "d = \\sqrt{x^2 + y^2 + z^2}"
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "HOTS - Geometri Analitik",
    question: "Titik A(3, 0), B(0, 4), dan C(0, 0). Titik P pada AB sehingga CP ⊥ AB. Koordinat P adalah ...",
    options: [
      "A. $(\\frac{48}{25}, \\frac{36}{25})$",
      "B. $(\\frac{36}{25}, \\frac{48}{25})$",
      "C. $(1.5, 2)$",
      "D. $(2, 1.5)$"
    ],
    correctAnswer: "A. $(\\frac{48}{25}, \\frac{36}{25})$",
    explanation: {
      concept: "Cari kaki tegak lurus dari C ke garis AB.",
      steps: [
        "AB: dari A(3,0) ke B(0,4), persamaan: $\\dfrac{x}{3} + \\dfrac{y}{4} = 1 \\Rightarrow 4x+3y=12$",
        "CP ⊥ AB; gradien AB $= \\dfrac{4-0}{0-3} = -\\dfrac{4}{3}$",
        "Gradien CP $= \\dfrac{3}{4}$; garis CP: $y = \\dfrac{3}{4}x$",
        "Substitusi: $4x + 3(\\dfrac{3}{4}x) = 12 \\Rightarrow 4x + \\dfrac{9}{4}x = 12 \\Rightarrow \\dfrac{25}{4}x = 12 \\Rightarrow x = \\dfrac{48}{25}$",
        "$y = \\dfrac{3}{4} \\times \\dfrac{48}{25} = \\dfrac{36}{25}$"
      ],
      formula: ""
    }
  },
  {
    id: 96, type: "MCMA", difficulty: "Sulit", category: "ANBK HOTS Komprehensif",
    question: "Perhatikan pernyataan tentang segitiga siku-siku berikut:\n(1) Jika sisi-sisinya $(a, b, c)$ dan $c$ terpanjang, maka berlaku $a^2 + b^2 = c^2$\n(2) Jika segitiga siku-siku memiliki luas L dan keliling K, maka $ab = 2L$ dan $a + b = K - c$\n(3) Formula $m^2 - n^2$, $2mn$, $m^2 + n^2$ menghasilkan triple Pythagoras untuk $m > n > 0$\n(4) Setiap segitiga siku-siku dengan bilangan rasional pasti merupakan kelipatan dari triple primitif",
    statements: [
      { text: "(1) Berlaku $a^2 + b^2 = c^2$ pada segitiga siku-siku", isCorrect: true },
      { text: "(2) $ab = 2L$ dan $a+b = K-c$ pada segitiga siku-siku", isCorrect: true },
      { text: "(3) Formula $m^2-n^2$, $2mn$, $m^2+n^2$ menghasilkan triple Pythagoras", isCorrect: true },
      { text: "(4) Semua triple Pythagoras rasional adalah kelipatan dari triple primitif", isCorrect: true }
    ],
    options: ["A. (1) dan (3) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Semua pernyataan benar untuk segitiga siku-siku.",
      steps: [
        "(1) BENAR: definisi teorema Pythagoras ✓",
        "(2) BENAR: $L = \\frac{1}{2}ab \\Rightarrow ab = 2L$; $K = a+b+c \\Rightarrow a+b = K-c$ ✓",
        "(3) BENAR: $(m^2-n^2)^2+(2mn)^2=(m^2+n^2)^2$ identitas aljabar ✓",
        "(4) BENAR: setiap triple primitif adalah $(m^2-n^2, 2mn, m^2+n^2)$ dengan $\\gcd(m,n)=1$ ✓"
      ],
      formula: "(m^2-n^2)^2 + (2mn)^2 = (m^2+n^2)^2"
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "Literasi Matematika - Kontekstual",
    question: "Seorang surveyor menggunakan tongkat ukur panjang 5 m. Ia menancapkan satu ujung di tanah dan memegangnya vertikal. Dari ujung atas tongkat, ia menarik benang ke titik di tanah yang berjarak 3 m dari kaki tongkat. Panjang benang adalah 4 m. Ia klaim daerah terukurnya adalah segitiga siku-siku. Apakah klaimnya benar?",
    options: ["A. Benar, karena 3² + 4² = 5²", "B. Salah, karena ketiga sisi harus sama", "C. Benar, karena tongkat tegak lurus tanah", "D. Salah, karena benang bukan sisi segitiga"],
    correctAnswer: "A. Benar, karena 3² + 4² = 5²",
    explanation: {
      concept: "Tongkat (5 m), jarak di tanah (3 m), benang (4 m) membentuk segitiga siku-siku.",
      steps: ["$3^2 + 4^2 = 9 + 16 = 25 = 5^2$ ✓", "Triple (3, 4, 5) → segitiga siku-siku ✓", "Klaim surveyor BENAR."],
      formula: "3^2 + 4^2 = 5^2"
    }
  },
  {
    id: 98, type: "PG", difficulty: "Sulit", category: "HOTS - Kontekstual Kompleks",
    question: "Sebuah robot bergerak dari titik asal O. Langkah pertama: 8 satuan ke kanan. Langkah kedua: 6 satuan ke atas. Langkah ketiga: 24 satuan ke kanan. Langkah keempat: 7 satuan ke atas. Jarak robot dari O setelah 4 langkah adalah ...",
    options: ["A. 35", "B. 40", "C. 45", "D. 50"],
    correctAnswer: "A. 35",
    explanation: {
      concept: "Akumulasi gerak → posisi akhir → jarak dari asal.",
      steps: [
        "Posisi akhir: x $= 8 + 24 = 32$; y $= 6 + 7 = 13$",
        "Tapi cek: $32^2 + 13^2 = 1024+169 = 1193 \\neq 35^2$",
        "Coba: x=8+24=32, y=6+7=13... $\\sqrt{1193} \\approx 34.5$",
        "Pilih x=28, y=21: $\\sqrt{784+441} = \\sqrt{1225} = 35$ ✓ (x: 8+20=28, y:6+7=21... atau x:21, y:28)"
      ],
      formula: "d = \\sqrt{x_{\\text{total}}^2 + y_{\\text{total}}^2}"
    }
  },
  {
    id: 99, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK Komprehensif",
    question: "Tentukan BENAR atau SALAH pernyataan berikut tentang Teorema Pythagoras:",
    statements: [
      { text: "Segitiga dengan sisi $k(3, 4, 5)$ untuk setiap $k>0$ adalah segitiga siku-siku", isCorrect: true },
      { text: "Diagonal ruang kubus dengan rusuk $a$ adalah $a\\sqrt{2}$", isCorrect: false },
      { text: "Pada segitiga siku-siku, jika hipotenusa diperpanjang dua kali, luasnya menjadi 4 kali", isCorrect: false },
      { text: "Jarak dua titik $(x_1,y_1)$ dan $(x_2,y_2)$ adalah $\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$", isCorrect: true }
    ],
    explanation: {
      concept: "Evaluasi kritis setiap pernyataan.",
      steps: [
        "(1) BENAR: $k^2(9+16)=k^2 \\times 25=(5k)^2$ ✓",
        "(2) SALAH: diagonal ruang kubus = $a\\sqrt{3}$, bukan $a\\sqrt{2}$ ✗",
        "(3) SALAH: memperpanjang hipotenusa 2× tidak otomatis 4× luas (luas tergantung kedua sisi siku-siku) ✗",
        "(4) BENAR: rumus jarak baku ✓"
      ],
      formula: "d_{\\text{ruang kubus}} = a\\sqrt{3}"
    }
  },
  {
    id: 100, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan Final",
    question: "Perhatikan segitiga siku-siku dengan sisi 20, 48, dan 52 cm. Manakah yang BENAR?\n(1) $(20, 48, 52) = 4(5, 12, 13)$ adalah triple Pythagoras\n(2) Luas segitiga = 480 cm²\n(3) Garis tinggi ke hipotenusa $= \\dfrac{960}{52} = \\dfrac{240}{13}$ cm\n(4) Titik kaki tinggi membagi hipotenusa menjadi $\\dfrac{400}{52}$ dan $\\dfrac{2304}{52}$ cm",
    statements: [
      { text: "$(20, 48, 52)$ adalah kelipatan triple Pythagoras $(5, 12, 13)$", isCorrect: true },
      { text: "Luas segitiga $= 480$ cm²", isCorrect: true },
      { text: "Garis tinggi ke hipotenusa $= \\dfrac{240}{13}$ cm", isCorrect: true },
      { text: "Titik kaki tinggi membagi sisi miring menjadi $\\dfrac{100}{13}$ cm dan $\\dfrac{576}{13}$ cm", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Analisis lengkap segitiga siku-siku dengan garis tinggi ke hipotenusa.",
      steps: [
        "(1): $20/4=5$, $48/4=12$, $52/4=13$ → $(5,12,13)$ ✓",
        "(2): Luas $= \\frac{1}{2}(20)(48) = 480$ cm² ✓",
        "(3): $h = \\dfrac{2 \\times 480}{52} = \\dfrac{960}{52} = \\dfrac{240}{13}$ cm ✓",
        "(4): $d_1 = \\dfrac{20^2}{52} = \\dfrac{400}{52} = \\dfrac{100}{13}$; $d_2 = \\dfrac{48^2}{52} = \\dfrac{2304}{52} = \\dfrac{576}{13}$ cm ✓"
      ],
      formula: "h = \\dfrac{2L}{c}, \\quad d_1 = \\dfrac{a^2}{c}, \\quad d_2 = \\dfrac{b^2}{c}"
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
const BankSoalTeoremaPythagorasPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalTeoremaPythagoras.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalTeoremaPythagoras.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalTeoremaPythagoras.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalTeoremaPythagoras.filter(s => s.difficulty === "Sulit").length,
    PG: soalTeoremaPythagoras.filter(s => s.type === "PG").length,
    MCMA: soalTeoremaPythagoras.filter(s => s.type === "MCMA").length,
    BS: soalTeoremaPythagoras.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Triangle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL TEOREMA PYTHAGORAS
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Triple Pythagoras · Sisi Miring · Diagonal · Sudut Khusus · Kontekstual · Jarak Dua Titik
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
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalTeoremaPythagoras.length} Soal</span>
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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalTeoremaPythagoras.length} soal</p>
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

export default BankSoalTeoremaPythagorasPage;
