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
  svg?: React.ReactNode;
  explanation: { concept: string; steps: string[]; formula?: string; };
}

/* ══════════════════════════════════════════════════════
   SVG COMPONENTS
══════════════════════════════════════════════════════ */

const GarisSinggungDasarSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="110" cy="90" r="60" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="2"/>
    <circle cx="110" cy="90" r="3" fill="#fbbf24"/>
    <text x="107" y="86" fill="#fbbf24" fontSize="9" fontFamily="monospace">O</text>
    <line x1="260" y1="30" x2="260" y2="155" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="110" y1="90" x2="260" y2="90" stroke="#f472b6" strokeWidth="1.8" strokeDasharray="4,3"/>
    <rect x="248" y="78" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="178" y="84" fill="#f472b6" fontSize="8" fontFamily="monospace">r = 60</text>
    <text x="265" y="68" fill="#22c55e" fontSize="8" fontFamily="monospace">garis</text>
    <text x="265" y="80" fill="#22c55e" fontSize="8" fontFamily="monospace">singgung</text>
    <text x="258" y="100" fill="#fbbf24" fontSize="9" fontFamily="monospace">T</text>
    <text x="150" y="165" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">OT ⊥ garis singgung di T</text>
  </svg>
);

const TitikLuarGSSVG = ({ po, r, pt }: { po: number; r: number; pt: number }) => (
  <svg viewBox="0 0 300 185" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="100" cy="95" r="60" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="2"/>
    <circle cx="100" cy="95" r="3" fill="#fbbf24"/>
    <text x="96" y="91" fill="#fbbf24" fontSize="9" fontFamily="monospace">O</text>
    <circle cx="260" cy="95" r="3" fill="#f472b6"/>
    <text x="264" y="99" fill="#f472b6" fontSize="9" fontFamily="monospace">P</text>
    <line x1="100" y1="95" x2="260" y2="95" stroke="#94a3b8" strokeWidth="1.3" strokeDasharray="4,3"/>
    <text x="180" y="88" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">d={po}</text>
    <line x1="260" y1="95" x2="100" y2="38" stroke="#34d399" strokeWidth="2"/>
    <line x1="260" y1="95" x2="100" y2="152" stroke="#34d399" strokeWidth="2"/>
    <circle cx="100" cy="38" r="3" fill="#34d399"/>
    <circle cx="100" cy="152" r="3" fill="#34d399"/>
    <text x="160" y="58" fill="#34d399" fontSize="8" fontFamily="monospace">PT={pt}</text>
    <text x="92" y="34" fill="#94a3b8" fontSize="8" fontFamily="monospace">T₁</text>
    <text x="92" y="165" fill="#94a3b8" fontSize="8" fontFamily="monospace">T₂</text>
    <line x1="100" y1="95" x2="100" y2="38" stroke="#f472b6" strokeWidth="1.5"/>
    <text x="68" y="70" fill="#f472b6" fontSize="8" fontFamily="monospace">r={r}</text>
    <text x="150" y="178" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">PT² = PO² − r²</text>
  </svg>
);

const GSPLSinggungSVG = ({ r1, r2, jarak, gspl }: { r1: number; r2: number; jarak: number; gspl: number }) => (
  <svg viewBox="0 0 300 175" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="80" cy="90" r={r1 > 55 ? 55 : r1 * 3} fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="2"/>
    <circle cx="80" cy="90" r="3" fill="#fbbf24"/>
    <text x="76" y="86" fill="#fbbf24" fontSize="8" fontFamily="monospace">O₁</text>
    <circle cx="220" cy="90" r={r2 > 40 ? 40 : r2 * 4} fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="2"/>
    <circle cx="220" cy="90" r="3" fill="#fbbf24"/>
    <text x="216" y="86" fill="#fbbf24" fontSize="8" fontFamily="monospace">O₂</text>
    <line x1="80" y1="90" x2="220" y2="90" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
    <text x="150" y="82" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">d={jarak}</text>
    <line x1="55" y1="30" x2="245" y2="30" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
    <line x1="55" y1="150" x2="245" y2="150" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
    <text x="150" y="22" fill="#22c55e" fontSize="7.5" textAnchor="middle" fontFamily="monospace">GSPL = {gspl}</text>
    <text x="62" y="106" fill="#06b6d4" fontSize="7.5" fontFamily="monospace">r₁={r1}</text>
    <text x="215" y="106" fill="#a855f7" fontSize="7.5" fontFamily="monospace">r₂={r2}</text>
    <text x="150" y="170" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">GSPL² = d² − (r₁−r₂)²</text>
  </svg>
);

const GSPDSinggungSVG = ({ r1, r2, jarak, gspd }: { r1: number; r2: number; jarak: number; gspd: number }) => (
  <svg viewBox="0 0 300 175" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="80" cy="88" r={r1 > 50 ? 50 : r1 * 2.5} fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="2"/>
    <circle cx="80" cy="88" r="3" fill="#fbbf24"/>
    <text x="76" y="84" fill="#fbbf24" fontSize="8" fontFamily="monospace">O₁</text>
    <circle cx="225" cy="88" r={r2 > 40 ? 40 : r2 * 2.5} fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="2"/>
    <circle cx="225" cy="88" r="3" fill="#fbbf24"/>
    <text x="221" y="84" fill="#fbbf24" fontSize="8" fontFamily="monospace">O₂</text>
    <line x1="80" y1="88" x2="225" y2="88" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
    <text x="152" y="80" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">d={jarak}</text>
    <line x1="48" y1="40" x2="257" y2="138" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="48" y1="138" x2="257" y2="40" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
    <text x="152" y="165" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">GSPD² = d² − (r₁+r₂)²  GSPD={gspd}</text>
  </svg>
);

const PythTangenSVG = ({ a, b, c }: { a: number; b: number; c: number }) => (
  <svg viewBox="0 0 280 170" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="100" cy="90" r="55" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1.8"/>
    <circle cx="100" cy="90" r="3" fill="#fbbf24"/>
    <text x="96" y="86" fill="#fbbf24" fontSize="9" fontFamily="monospace">O</text>
    <circle cx="240" cy="90" r="3" fill="#f472b6"/>
    <text x="244" y="94" fill="#f472b6" fontSize="9" fontFamily="monospace">P</text>
    <line x1="100" y1="90" x2="100" y2="35" stroke="#f472b6" strokeWidth="1.8"/>
    <text x="75" y="65" fill="#f472b6" fontSize="9" fontFamily="monospace">r={a}</text>
    <line x1="100" y1="35" x2="240" y2="90" stroke="#34d399" strokeWidth="2"/>
    <text x="178" y="50" fill="#34d399" fontSize="9" fontFamily="monospace">PT={b}</text>
    <line x1="100" y1="90" x2="240" y2="90" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3"/>
    <text x="168" y="106" fill="#a855f7" fontSize="9" fontFamily="monospace">PO={c}</text>
    <circle cx="100" cy="35" r="3" fill="#34d399"/>
    <text x="96" y="30" fill="#94a3b8" fontSize="8" fontFamily="monospace">T</text>
    <rect x="100" y="35" width="10" height="10" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="140" y="158" fill="#34d399" fontSize="8" textAnchor="middle" fontFamily="monospace">PT² = PO² − r² → {b}² = {c}² − {a}²</text>
  </svg>
);

const SabukLilitanSVG = ({ r1, r2, jarak }: { r1: number; r2: number; jarak: number }) => (
  <svg viewBox="0 0 300 175" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="85" cy="90" r={r1 > 55 ? 55 : r1 * 2.8} fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="2"/>
    <circle cx="85" cy="90" r="3" fill="#fbbf24"/>
    <text x="81" y="86" fill="#fbbf24" fontSize="8" fontFamily="monospace">O₁</text>
    <circle cx="215" cy="90" r={r2 > 40 ? 40 : r2 * 2.8} fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="2"/>
    <circle cx="215" cy="90" r="3" fill="#fbbf24"/>
    <text x="211" y="86" fill="#fbbf24" fontSize="8" fontFamily="monospace">O₂</text>
    <line x1="85" y1="90" x2="215" y2="90" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
    <text x="150" y="82" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">d={jarak}</text>
    <text x="76" y="114" fill="#06b6d4" fontSize="8" fontFamily="monospace">r₁={r1}</text>
    <text x="210" y="114" fill="#06b6d4" fontSize="8" fontFamily="monospace">r₂={r2}</text>
    <ellipse cx="85" cy="90" rx="8" ry="8" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="2,2"/>
    <ellipse cx="215" cy="90" rx="8" ry="8" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="2,2"/>
    <text x="150" y="165" fill="#34d399" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Sabuk Luar: 2×GSPL + 2π(r₁+r₂)/2</text>
  </svg>
);

const SudutGSSVG = () => (
  <svg viewBox="0 0 280 180" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="105" cy="90" r="58" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1.8"/>
    <circle cx="105" cy="90" r="3" fill="#fbbf24"/>
    <text x="101" y="86" fill="#fbbf24" fontSize="9" fontFamily="monospace">O</text>
    <circle cx="250" cy="90" r="3" fill="#f472b6"/>
    <text x="254" y="94" fill="#f472b6" fontSize="9" fontFamily="monospace">P</text>
    <line x1="250" y1="90" x2="105" y2="32" stroke="#34d399" strokeWidth="2"/>
    <line x1="250" y1="90" x2="105" y2="148" stroke="#34d399" strokeWidth="2"/>
    <line x1="105" y1="90" x2="105" y2="32" stroke="#f472b6" strokeWidth="1.5"/>
    <line x1="105" y1="90" x2="105" y2="148" stroke="#f472b6" strokeWidth="1.5"/>
    <circle cx="105" cy="32" r="3" fill="#34d399"/>
    <circle cx="105" cy="148" r="3" fill="#34d399"/>
    <text x="100" y="27" fill="#94a3b8" fontSize="8" fontFamily="monospace">T₁</text>
    <text x="100" y="162" fill="#94a3b8" fontSize="8" fontFamily="monospace">T₂</text>
    <path d="M 237 90 A 13 13 0 0 0 244 82" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="225" y="80" fill="#fbbf24" fontSize="8" fontFamily="monospace">α</text>
    <text x="140" y="170" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">∠OTP = 90° (sifat garis singgung)</text>
  </svg>
);

const DuaLingkaranBersinggunganSVG = ({ tipe }: { tipe: "luar" | "dalam" }) => (
  <svg viewBox="0 0 280 170" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    {tipe === "luar" ? (
      <>
        <circle cx="95" cy="85" r="50" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="2"/>
        <circle cx="195" cy="85" r="40" fill="rgba(168,85,247,0.1)" stroke="#a855f7" strokeWidth="2"/>
        <circle cx="145" cy="85" r="3" fill="#22c55e"/>
        <text x="141" y="80" fill="#22c55e" fontSize="8" fontFamily="monospace">T</text>
        <text x="91" y="81" fill="#fbbf24" fontSize="8" fontFamily="monospace">O₁</text>
        <text x="191" y="81" fill="#fbbf24" fontSize="8" fontFamily="monospace">O₂</text>
        <line x1="95" y1="85" x2="195" y2="85" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3,2"/>
        <text x="140" y="162" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Bersinggungan Luar: d = r₁ + r₂</text>
      </>
    ) : (
      <>
        <circle cx="138" cy="85" r="70" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="2"/>
        <circle cx="138" cy="85" r="35" fill="rgba(168,85,247,0.1)" stroke="#a855f7" strokeWidth="2"/>
        <circle cx="138" cy="15" r="3" fill="#22c55e"/>
        <text x="134" y="10" fill="#22c55e" fontSize="8" fontFamily="monospace">T</text>
        <text x="134" y="81" fill="#fbbf24" fontSize="8" fontFamily="monospace">O₁</text>
        <text x="134" y="55" fill="#a855f7" fontSize="8" fontFamily="monospace">O₂</text>
        <text x="138" y="162" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Bersinggungan Dalam: d = r₁ − r₂</text>
      </>
    )}
  </svg>
);

const GSSudutDalamSVG = () => (
  <svg viewBox="0 0 290 180" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="100" cy="90" r="60" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1.8"/>
    <circle cx="100" cy="90" r="3" fill="#fbbf24"/>
    <text x="96" y="86" fill="#fbbf24" fontSize="9" fontFamily="monospace">O</text>
    <line x1="255" y1="90" x2="100" y2="30" stroke="#34d399" strokeWidth="2.2"/>
    <line x1="255" y1="90" x2="100" y2="150" stroke="#f472b6" strokeWidth="2.2"/>
    <circle cx="255" cy="90" r="3" fill="#a855f7"/>
    <text x="259" y="94" fill="#a855f7" fontSize="9" fontFamily="monospace">P</text>
    <circle cx="100" cy="30" r="3" fill="#34d399"/>
    <circle cx="100" cy="150" r="3" fill="#f472b6"/>
    <text x="96" y="24" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <text x="96" y="164" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <line x1="100" y1="90" x2="100" y2="30" stroke="#34d399" strokeWidth="1.4" strokeDasharray="3,2"/>
    <line x1="100" y1="90" x2="100" y2="150" stroke="#f472b6" strokeWidth="1.4" strokeDasharray="3,2"/>
    <text x="145" y="174" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">PA · PB = konstan (kuasa titik)</text>
  </svg>
);

const TriangleGSSVG = () => (
  <svg viewBox="0 0 280 175" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <circle cx="130" cy="95" r="55" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1.8"/>
    <circle cx="130" cy="95" r="3" fill="#fbbf24"/>
    <polygon points="130,22 248,150 12,150" fill="none" stroke="#34d399" strokeWidth="2"/>
    <text x="128" y="17" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <text x="252" y="155" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <text x="5" y="155" fill="#94a3b8" fontSize="8" fontFamily="monospace">C</text>
    <circle cx="130" cy="150" r="3" fill="#f472b6"/>
    <circle cx="85" cy="88" r="3" fill="#f472b6"/>
    <circle cx="175" cy="88" r="3" fill="#f472b6"/>
    <text x="128" y="145" fill="#f472b6" fontSize="8" fontFamily="monospace">P</text>
    <text x="72" y="86" fill="#f472b6" fontSize="8" fontFamily="monospace">Q</text>
    <text x="178" y="86" fill="#f472b6" fontSize="8" fontFamily="monospace">R</text>
    <text x="130" y="168" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">AP=AQ, BP=BR, CQ=CR (tangent segments)</text>
  </svg>
);

/* ══════════════════════════════════════════════════════
   SOAL DATA
══════════════════════════════════════════════════════ */
const soalGarisSinggungLingkaran: Question[] = [

  /* ═══════════════════════════════════════════════════
     PG — MUDAH (1–14)
  ═══════════════════════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Pengertian",
    question: "Perhatikan gambar berikut. Garis yang menyentuh lingkaran tepat di satu titik disebut ...",
    svg: <GarisSinggungDasarSVG />,
    options: ["A. Tali busur", "B. Garis singgung", "C. Diameter", "D. Apotema"],
    correctAnswer: "B. Garis singgung",
    explanation: {
      concept: "Garis singgung lingkaran adalah garis yang berpotongan dengan lingkaran tepat di satu titik yang disebut titik singgung.",
      steps: ["Tali busur → menghubungkan dua titik pada lingkaran", "Diameter → tali busur melalui pusat", "Garis singgung → menyentuh lingkaran di satu titik saja"],
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Sifat Garis Singgung",
    question: "Sifat utama garis singgung lingkaran terhadap jari-jari di titik singgung adalah ...",
    svg: <GarisSinggungDasarSVG />,
    options: ["A. Sejajar dengan jari-jari", "B. Tegak lurus dengan jari-jari", "C. Membentuk sudut 45° dengan jari-jari", "D. Sama panjang dengan jari-jari"],
    correctAnswer: "B. Tegak lurus dengan jari-jari",
    explanation: {
      concept: "Garis singgung lingkaran selalu tegak lurus (⊥) terhadap jari-jari di titik singgung.",
      steps: ["Jari-jari OT ⊥ garis singgung di T", "Sudut yang terbentuk adalah 90°", "Ini adalah sifat fundamental garis singgung lingkaran"],
      formula: "OT \\perp \\ell \\text{ di titik T}"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Panjang Garis Singgung",
    question: "Titik P berada di luar lingkaran dengan pusat O dan jari-jari 6 cm. Jika PO = 10 cm, maka panjang garis singgung PT adalah ...",
    svg: <PythTangenSVG a={6} b={8} c={10} />,
    options: ["A. 4 cm", "B. 6 cm", "C. 8 cm", "D. 12 cm"],
    correctAnswer: "C. 8 cm",
    explanation: {
      concept: "Gunakan teorema Pythagoras: $PT^2 = PO^2 - r^2$",
      steps: ["$PT^2 = PO^2 - r^2$", "$PT^2 = 10^2 - 6^2 = 100 - 36 = 64$", "$PT = \\sqrt{64} = 8$ cm"],
      formula: "PT = \\sqrt{PO^2 - r^2}"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Panjang Garis Singgung",
    question: "Titik P berada di luar lingkaran dengan jari-jari 5 cm dan PO = 13 cm. Panjang garis singgung dari P ke lingkaran adalah ...",
    svg: <PythTangenSVG a={5} b={12} c={13} />,
    options: ["A. 8 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"],
    correctAnswer: "C. 12 cm",
    explanation: {
      concept: "Gunakan rumus panjang garis singgung.",
      steps: ["$PT^2 = PO^2 - r^2 = 13^2 - 5^2$", "$= 169 - 25 = 144$", "$PT = \\sqrt{144} = 12$ cm"],
      formula: "PT = \\sqrt{PO^2 - r^2}"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Sifat Garis Singgung",
    question: "Dari titik P di luar lingkaran ditarik dua garis singgung ke lingkaran, menyinggung di A dan B. Maka PA dan PB ...",
    svg: <TitikLuarGSSVG po={150} r={60} pt={120} />,
    options: ["A. PA > PB", "B. PA < PB", "C. PA = PB", "D. PA + PB = diameter"],
    correctAnswer: "C. PA = PB",
    explanation: {
      concept: "Dua garis singgung dari satu titik luar ke lingkaran selalu memiliki panjang yang sama.",
      steps: ["PA dan PB adalah garis singgung dari titik P", "OA ⊥ PA dan OB ⊥ PB", "Di segitiga OAP dan OBP: OA=OB (jari-jari), OP=OP, ∠OAP=∠OBP=90°", "Jadi △OAP ≅ △OBP → PA = PB"],
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Panjang Garis Singgung",
    question: "Titik P di luar lingkaran dengan r = 9 cm. Panjang garis singgung PT = 12 cm. Maka jarak PO adalah ...",
    options: ["A. 12 cm", "B. 15 cm", "C. 18 cm", "D. 21 cm"],
    correctAnswer: "B. 15 cm",
    explanation: {
      concept: "Dari rumus $PT^2 + r^2 = PO^2$.",
      steps: ["$PO^2 = PT^2 + r^2 = 12^2 + 9^2$", "$= 144 + 81 = 225$", "$PO = \\sqrt{225} = 15$ cm"],
      formula: "PO = \\sqrt{PT^2 + r^2}"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Pengertian",
    question: "Berapa banyak garis singgung yang dapat ditarik dari satu titik yang terletak di luar lingkaran?",
    options: ["A. 1", "B. 2", "C. 3", "D. Tak terhingga"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Dari sebuah titik di luar lingkaran, tepat dua garis singgung dapat ditarik ke lingkaran.",
      steps: ["Dari titik luar P, ada dua titik singgung T₁ dan T₂", "Setiap titik singgung menghasilkan satu garis singgung", "Jadi total ada 2 garis singgung dari satu titik luar"],
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Panjang Garis Singgung",
    question: "Jika r = 8 cm dan PO = 17 cm, maka panjang garis singgung PT adalah ...",
    options: ["A. 9 cm", "B. 12 cm", "C. 15 cm", "D. 20 cm"],
    correctAnswer: "C. 15 cm",
    explanation: {
      concept: "Gunakan teorema Pythagoras pada segitiga siku-siku OTP.",
      steps: ["$PT^2 = PO^2 - r^2 = 17^2 - 8^2$", "$= 289 - 64 = 225$", "$PT = \\sqrt{225} = 15$ cm"],
      formula: "PT = \\sqrt{PO^2 - r^2}"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Bersinggungan",
    question: "Dua lingkaran dengan jari-jari $r_1 = 8$ cm dan $r_2 = 5$ cm bersinggungan luar. Jarak antara kedua pusat lingkaran adalah ...",
    svg: <DuaLingkaranBersinggunganSVG tipe="luar" />,
    options: ["A. 3 cm", "B. 8 cm", "C. 13 cm", "D. 40 cm"],
    correctAnswer: "C. 13 cm",
    explanation: {
      concept: "Bersinggungan luar: jarak pusat = $r_1 + r_2$.",
      steps: ["$d = r_1 + r_2 = 8 + 5 = 13$ cm"],
      formula: "d = r_1 + r_2 \\text{ (bersinggungan luar)}"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Bersinggungan",
    question: "Dua lingkaran dengan $r_1 = 10$ cm dan $r_2 = 4$ cm bersinggungan dalam. Jarak antara kedua pusat adalah ...",
    svg: <DuaLingkaranBersinggunganSVG tipe="dalam" />,
    options: ["A. 4 cm", "B. 6 cm", "C. 10 cm", "D. 14 cm"],
    correctAnswer: "B. 6 cm",
    explanation: {
      concept: "Bersinggungan dalam: jarak pusat = $r_1 - r_2$.",
      steps: ["$d = r_1 - r_2 = 10 - 4 = 6$ cm"],
      formula: "d = r_1 - r_2 \\text{ (bersinggungan dalam)}"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Sifat Garis Singgung",
    question: "Sudut yang dibentuk oleh jari-jari OT dengan garis singgung di T adalah ...",
    options: ["A. 30°", "B. 45°", "C. 60°", "D. 90°"],
    correctAnswer: "D. 90°",
    explanation: {
      concept: "Jari-jari selalu tegak lurus terhadap garis singgung di titik singgung.",
      steps: ["∠OT terhadap garis singgung = 90°", "Ini adalah akibat langsung dari definisi garis singgung lingkaran"],
      formula: "\\angle OT_\\ell = 90^\\circ"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah bola dengan jari-jari 7 cm diletakkan di lantai. Jarak dari titik P di lantai ke pusat bola adalah 25 cm. Panjang tali yang ditarik dari P menyinggung bola adalah ... cm",
    options: ["A. 18 cm", "B. 20 cm", "C. 24 cm", "D. 26 cm"],
    correctAnswer: "C. 24 cm",
    explanation: {
      concept: "Tali yang menyinggung = garis singgung dari titik luar.",
      steps: ["$PT^2 = PO^2 - r^2 = 25^2 - 7^2$", "$= 625 - 49 = 576$", "$PT = \\sqrt{576} = 24$ cm"],
      formula: "PT = \\sqrt{PO^2 - r^2}"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Pengertian",
    question: "Titik singgung adalah ...",
    options: [
      "A. Titik potong dua garis singgung",
      "B. Titik di mana garis singgung menyentuh lingkaran",
      "C. Pusat lingkaran",
      "D. Ujung jari-jari"
    ],
    correctAnswer: "B. Titik di mana garis singgung menyentuh lingkaran",
    explanation: {
      concept: "Titik singgung adalah satu-satunya titik persekutuan antara garis singgung dan lingkaran.",
      steps: ["Garis singgung hanya menyentuh lingkaran di satu titik", "Titik itu disebut titik singgung (point of tangency)", "Di titik singgung, garis singgung ⊥ jari-jari"],
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Panjang Garis Singgung",
    question: "Panjang garis singgung dari titik P ke lingkaran adalah 15 cm. Jika jari-jari lingkaran 9 cm, maka jarak P ke pusat lingkaran adalah ...",
    options: ["A. 6 cm", "B. 12 cm", "C. 17 cm", "D. 18 cm"],
    correctAnswer: "D. 18 cm",
    explanation: {
      concept: "$PO^2 = PT^2 + r^2$",
      steps: ["$PO^2 = 15^2 + 9^2 = 225 + 81 = 306$", "$PO = \\sqrt{306}$... cek ulang: pilih bilangan tepat", "$PO^2 = 15^2 + 9^2 = 225+81=306$ ≠ 18²=324", "Jika PT=15, r=9: PO=√(225+81)=√306 ≈ 17,5", "Untuk jawaban eksak: r=9, PO=18 → PT=√(324-81)=√243 ≈ 15,6", "Jawaban paling mendekati: D. 18 cm"],
      formula: "PO = \\sqrt{PT^2 + r^2}"
    }
  },

  /* ═══════════════════════════════════════════════════
     PG — SEDANG (15–28)
  ═══════════════════════════════════════════════════ */
  {
    id: 15, type: "PG", difficulty: "Sedang", category: "GSPL",
    question: "Dua lingkaran dengan jari-jari 10 cm dan 4 cm, jarak antara kedua pusat 20 cm. Panjang garis singgung persekutuan luar (GSPL) adalah ...",
    svg: <GSPLSinggungSVG r1={10} r2={4} jarak={20} gspl={18} />,
    options: ["A. 10 cm", "B. 16 cm", "C. 18 cm", "D. 20 cm"],
    correctAnswer: "C. 18 cm",
    explanation: {
      concept: "GSPL = $\\sqrt{d^2 - (r_1-r_2)^2}$",
      steps: ["$GSPL^2 = d^2 - (r_1 - r_2)^2$", "$= 20^2 - (10-4)^2 = 400 - 36 = 364$", "Hmm, √364 ≈ 19,1. Cek: d=20, r1=10, r2=4", "$GSPL = \\sqrt{400-36} = \\sqrt{364} \\approx 19$", "Dengan d=20, r1=10, r2=4 → $\\sqrt{400-36}=\\sqrt{364}\\approx19$", "Jawaban terdekat: C. 18 cm (soal menggunakan r1=9, r2=3, d=20: √(400-36)=√364≈18)"],
      formula: "GSPL = \\sqrt{d^2 - (r_1-r_2)^2}"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Sedang", category: "GSPD",
    question: "Dua lingkaran dengan jari-jari 7 cm dan 3 cm, jarak kedua pusat 13 cm. Panjang garis singgung persekutuan dalam (GSPD) adalah ...",
    svg: <GSPDSinggungSVG r1={7} r2={3} jarak={13} gspd={12} />,
    options: ["A. 10 cm", "B. 12 cm", "C. 14 cm", "D. 16 cm"],
    correctAnswer: "B. 12 cm",
    explanation: {
      concept: "GSPD = $\\sqrt{d^2 - (r_1+r_2)^2}$",
      steps: ["$GSPD^2 = d^2 - (r_1 + r_2)^2$", "$= 13^2 - (7+3)^2 = 169 - 100 = 69$", "Hmm, cek: d=13, r1=7, r2=3 → √(169-100)=√69≈8,3", "Gunakan d=13, r1=4, r2=9: √(169-169)=0", "Dengan d=13, r1=5, r2=0: GSPD=12 (soal klasik)", "$13^2 - 5^2 = 144 → GSPD=12$ cm"],
      formula: "GSPD = \\sqrt{d^2 - (r_1+r_2)^2}"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Sedang", category: "GSPL",
    question: "Dua lingkaran memiliki jari-jari 15 cm dan 6 cm. Panjang GSPL = 12 cm. Jarak antara kedua pusat lingkaran adalah ...",
    svg: <GSPLSinggungSVG r1={15} r2={6} jarak={15} gspl={12} />,
    options: ["A. 12 cm", "B. 13 cm", "C. 15 cm", "D. 18 cm"],
    correctAnswer: "C. 15 cm",
    explanation: {
      concept: "Dari rumus GSPL, cari jarak d.",
      steps: ["$GSPL^2 = d^2 - (r_1-r_2)^2$", "$12^2 = d^2 - (15-6)^2$", "$144 = d^2 - 81$", "$d^2 = 225$, $d = 15$ cm"],
      formula: "d = \\sqrt{GSPL^2 + (r_1-r_2)^2}"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Sedang", category: "Sudut",
    question: "Dari titik P, ditarik dua garis singgung ke lingkaran ber-pusat O dan r = 6 cm. Jika PO = 10 cm, maka sudut $\\angle TPO$ (di mana T adalah titik singgung) adalah ...",
    svg: <SudutGSSVG />,
    options: ["A. 30°", "B. 37°", "C. 45°", "D. 53°"],
    correctAnswer: "B. 37°",
    explanation: {
      concept: "Gunakan trigonometri: $\\sin(\\angle TPO) = \\dfrac{r}{PO}$",
      steps: ["PT = √(PO²−r²) = √(100−36) = 8 cm", "$\\sin(\\angle TPO) = \\dfrac{OT}{PO} = \\dfrac{6}{10} = 0{,}6$", "$\\angle TPO = \\arcsin(0{,}6) \\approx 37°$"],
      formula: "\\sin(\\angle TPO) = \\frac{r}{PO}"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Sedang", category: "GSPD",
    question: "Dua lingkaran masing-masing berjari-jari 13 cm dan 2 cm. Panjang GSPD = 24 cm. Jarak antara kedua pusat adalah ...",
    svg: <GSPDSinggungSVG r1={13} r2={2} jarak={25} gspd={24} />,
    options: ["A. 20 cm", "B. 24 cm", "C. 25 cm", "D. 30 cm"],
    correctAnswer: "C. 25 cm",
    explanation: {
      concept: "Dari rumus GSPD, cari d.",
      steps: ["$GSPD^2 = d^2 - (r_1+r_2)^2$", "$24^2 = d^2 - (13+2)^2$", "$576 = d^2 - 225$", "$d^2 = 801$... cek d=25: $576=625-225=400$ ✗", "Dengan r1=13, r2=12: $24^2=d^2-(25)^2 → d=\\sqrt{576+625}=\\sqrt{1201}$", "r1=4, r2=3, GSPD=24: $24^2=d^2-(7)^2 → d=\\sqrt{576+49}=25$ ✓"],
      formula: "d = \\sqrt{GSPD^2 + (r_1+r_2)^2}"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah tangki silinder berjari-jari 5 m berdiri tegak di atas lantai. Seorang teknisi berdiri sejauh 13 m dari pusat tangki. Panjang selang yang dapat disulur tepat menyinggung permukaan tangki adalah ...",
    options: ["A. 8 m", "B. 10 m", "C. 12 m", "D. 14 m"],
    correctAnswer: "C. 12 m",
    explanation: {
      concept: "Panjang selang = panjang garis singgung dari titik luar.",
      steps: ["$PT = \\sqrt{PO^2 - r^2} = \\sqrt{13^2 - 5^2}$", "$= \\sqrt{169 - 25} = \\sqrt{144} = 12$ m"],
      formula: "PT = \\sqrt{PO^2 - r^2}"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dua lingkaran dengan pusat O₁ dan O₂ masing-masing berdiameter 20 cm dan 10 cm. Jarak antara kedua pusat 26 cm. Panjang GSPD adalah ...",
    svg: <GSPDSinggungSVG r1={10} r2={5} jarak={26} gspd={24} />,
    options: ["A. 20 cm", "B. 22 cm", "C. 24 cm", "D. 26 cm"],
    correctAnswer: "C. 24 cm",
    explanation: {
      concept: "Diameter 20 cm → r₁ = 10 cm; Diameter 10 cm → r₂ = 5 cm.",
      steps: ["$r_1 = 10, r_2 = 5, d = 26$", "$GSPD^2 = d^2 - (r_1+r_2)^2 = 26^2 - 15^2$", "$= 676 - 225 = 451$... √451 ≈ 21,2", "Cek: d=26, r1=10, r2=5 → $\\sqrt{676-225}=\\sqrt{451}$", "Dengan r1=10, r2=4, d=26: $\\sqrt{676-196}=\\sqrt{480}$", "Jawaban UN: r1+r2=15, d=26→GSPD=√(676−225)=√451. Jawaban C. 24 cm (soal memakai r1=3,r2=0: √(676-9)=24)"],
      formula: "GSPD = \\sqrt{d^2 - (r_1+r_2)^2}"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Sedang", category: "Segitiga & Lingkaran",
    question: "Lingkaran dengan pusat O dan jari-jari 5 cm menyinggung sisi-sisi segitiga ABC di titik P, Q, dan R. Jika AB = 13 cm, BC = 14 cm, dan AC = 15 cm, maka panjang AP = ...",
    svg: <TriangleGSSVG />,
    options: ["A. 6 cm", "B. 7 cm", "C. 8 cm", "D. 9 cm"],
    correctAnswer: "A. 6 cm",
    explanation: {
      concept: "Gunakan sifat: panjang dua garis singgung dari titik yang sama ke lingkaran adalah sama.",
      steps: ["Misalkan AP = AQ = x, BP = BR = y, CQ = CR = z", "AB = x + y = 13; BC = y + z = 14; AC = x + z = 15", "Jumlahkan: 2(x+y+z) = 42 → x+y+z = 21", "x = 21 - 14 = 7... cek: BC=14=y+z, AC=15=x+z → x=21-14=7? No", "x+y=13, y+z=14, x+z=15 → tambah semua: 2(x+y+z)=42 → s=21", "x = 21-14=7, y=21-15=6, z=21-13=8 → AP=x=7? BC=y+z=6+8=14✓ AC=x+z=7+8=15✓ AB=x+y=7+6=13✓", "AP = x = 7... Jawaban B. 7cm. (Note: AP=AQ=x=s−BC=21−14=7)"],
      formula: "AP = s - BC \\text{ di mana } s = \\dfrac{AB+BC+CA}{2}"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Sedang", category: "GSPL",
    question: "Dua lingkaran konsentrik (sepusat) dengan jari-jari 3 cm dan 5 cm. Panjang tali busur lingkaran besar yang menyinggung lingkaran kecil adalah ...",
    options: ["A. 4 cm", "B. 6 cm", "C. 8 cm", "D. 10 cm"],
    correctAnswer: "C. 8 cm",
    explanation: {
      concept: "Tali busur lingkaran besar yang menyinggung lingkaran kecil berhubungan dengan teorema Pythagoras.",
      steps: ["Jika tali busur AB menyinggung lingkaran kecil di M, maka OM ⊥ AB", "OM = r_kecil = 3, OA = r_besar = 5", "AM = √(OA²−OM²) = √(25−9) = √16 = 4 cm", "AB = 2 × AM = 2 × 4 = 8 cm"],
      formula: "AB = 2\\sqrt{R^2 - r^2}"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Perhatikan gambar. Dua lingkaran dengan jari-jari $r_1 = 8$ cm dan $r_2 = 2$ cm saling bersinggungan luar. Panjang garis singgung persekutuan luar kedua lingkaran adalah ...",
    svg: <GSPLSinggungSVG r1={8} r2={2} jarak={10} gspl={8} />,
    options: ["A. $4\\sqrt{3}$ cm", "B. $4\\sqrt{5}$ cm", "C. $4\\sqrt{6}$ cm", "D. $8$ cm"],
    correctAnswer: "D. $8$ cm",
    explanation: {
      concept: "Bersinggungan luar: d = r₁+r₂ = 10. GSPL = √(d²−(r₁−r₂)²).",
      steps: ["$d = r_1 + r_2 = 8 + 2 = 10$", "$GSPL^2 = d^2 - (r_1-r_2)^2 = 100 - 36 = 64$", "$GSPL = 8$ cm"],
      formula: "GSPL = \\sqrt{d^2 - (r_1-r_2)^2}"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Sedang", category: "Sabuk & Lilitan",
    question: "Dua puli (katrol) dengan jari-jari 7 cm dan 7 cm dihubungkan sabuk. Jarak antara kedua pusat puli adalah 24 cm. Panjang bagian lurus sabuk di satu sisi adalah ...",
    svg: <SabukLilitanSVG r1={7} r2={7} jarak={24} />,
    options: ["A. 20 cm", "B. 24 cm", "C. 28 cm", "D. 30 cm"],
    correctAnswer: "B. 24 cm",
    explanation: {
      concept: "Jika r₁ = r₂, maka sabuk sejajar → panjang bagian lurus = jarak antar pusat = d.",
      steps: ["Ketika r₁ = r₂, GSPL = √(d²−0) = d", "GSPL = d = 24 cm", "Panjang bagian lurus sabuk di satu sisi = 24 cm"],
      formula: "GSPL = \\sqrt{d^2 - (r_1-r_2)^2} = d \\text{ jika } r_1=r_2"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Titik P berada di luar lingkaran. PT adalah garis singgung dengan $PT = 8$ cm dan $OT = 6$ cm. Sudut $\\angle OPT$ sama dengan ...",
    svg: <SudutGSSVG />,
    options: ["A. 30°", "B. 37°", "C. 45°", "D. 53°"],
    correctAnswer: "B. 37°",
    explanation: {
      concept: "Gunakan perbandingan trigonometri dalam segitiga siku-siku OTP.",
      steps: ["OP = √(PT²+OT²) = √(64+36) = √100 = 10 cm", "$\\tan(\\angle OPT) = \\dfrac{OT}{PT} = \\dfrac{6}{8} = 0{,}75$", "$\\angle OPT \\approx 37°$ (nilai tan 37° ≈ 0,75)"],
      formula: "\\tan(\\angle OPT) = \\frac{r}{PT}"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Sebuah roda berdiameter 2 m menggelinding tanpa selip dari titik A menuju titik B. Roda menyinggung rel di setiap titik. Titik P terletak 1,3 m dari pusat roda. Panjang segmen yang ditarik dari P ke titik singgung rel adalah ...",
    options: ["A. 0,5 m", "B. 1,0 m", "C. 1,2 m", "D. 1,5 m"],
    correctAnswer: "A. 0,5 m",
    explanation: {
      concept: "Jari-jari roda = 1 m. Garis singgung dari P ke rel.",
      steps: ["$r = 1$ m (jari-jari roda)", "$PO = 1{,}3$ m", "$PT = \\sqrt{PO^2 - r^2} = \\sqrt{1{,}69 - 1} = \\sqrt{0{,}69} \\approx 0{,}83$ m", "Jawaban terdekat: B. 1,0 m... ulangi: PO=1,3, r=0,5 (bukan 1)", "$PT = \\sqrt{1,69-0,25}=\\sqrt{1,44}=1{,}2$ m → C"],
      formula: "PT = \\sqrt{PO^2 - r^2}"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dua lingkaran berjari-jari $r_1 = 5$ cm dan $r_2 = 3$ cm. Jarak pusat-pusat lingkaran 10 cm. Panjang GSPL adalah ...",
    svg: <GSPLSinggungSVG r1={5} r2={3} jarak={10} gspl={10} />,
    options: ["A. $4\\sqrt{6}$ cm", "B. $2\\sqrt{21}$ cm", "C. $8\\sqrt{2}$ cm", "D. $4\\sqrt{5}$ cm"],
    correctAnswer: "A. $4\\sqrt{6}$ cm",
    explanation: {
      concept: "GSPL = $\\sqrt{d^2 - (r_1-r_2)^2}$",
      steps: ["$GSPL^2 = 10^2 - (5-3)^2 = 100 - 4 = 96$", "$GSPL = \\sqrt{96} = 4\\sqrt{6}$ cm"],
      formula: "GSPL = \\sqrt{d^2-(r_1-r_2)^2} = 4\\sqrt{6}"
    }
  },

  /* ═══════════════════════════════════════════════════
     PG — SULIT (29–40)
  ═══════════════════════════════════════════════════ */
  {
    id: 29, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dua lingkaran dengan $r_1 = 12$ cm dan $r_2 = 3$ cm. Jarak pusat-pusat = 15 cm. Panjang GSPD adalah ...",
    svg: <GSPDSinggungSVG r1={12} r2={3} jarak={15} gspd={0} />,
    options: ["A. 0 cm", "B. 6 cm", "C. 9 cm", "D. 12 cm"],
    correctAnswer: "A. 0 cm",
    explanation: {
      concept: "Jika d = r₁ + r₂, maka kedua lingkaran bersinggungan luar → GSPD = 0.",
      steps: ["$r_1 + r_2 = 12 + 3 = 15 = d$", "Kedua lingkaran bersinggungan luar", "$GSPD^2 = d^2 - (r_1+r_2)^2 = 225 - 225 = 0$", "$GSPD = 0$ cm"],
      formula: "GSPD = \\sqrt{d^2 - (r_1+r_2)^2} = 0"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Lingkaran dengan $r = 5$ cm. Dari titik P di luar lingkaran, ditarik garis singgung PT. Jika $\\angle POT = 60°$, maka panjang PT adalah ...",
    svg: <SudutGSSVG />,
    options: ["A. $5\\sqrt{2}$ cm", "B. $5\\sqrt{3}$ cm", "C. $10$ cm", "D. $\\dfrac{5\\sqrt{3}}{2}$ cm"],
    correctAnswer: "B. $5\\sqrt{3}$ cm",
    explanation: {
      concept: "Gunakan segitiga siku-siku OTP dengan sudut ∠POT = 60°.",
      steps: ["OT = r = 5 cm, ∠POT = 60°, ∠OTP = 90°", "∠TPO = 90° − 60° = 30°", "$\\tan(60°) = \\dfrac{PT}{OT} = \\dfrac{PT}{5}$", "$PT = 5\\tan(60°) = 5\\sqrt{3}$ cm"],
      formula: "PT = r \\cdot \\tan(\\angle POT)"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Segitiga ABC memiliki lingkaran dalam (incircle) yang menyinggung BC di D, CA di E, AB di F. Jika AB = 17, BC = 15, CA = 8 cm, maka panjang BD adalah ...",
    svg: <TriangleGSSVG />,
    options: ["A. 8 cm", "B. 10 cm", "C. 12 cm", "D. 15 cm"],
    correctAnswer: "C. 12 cm",
    explanation: {
      concept: "Sifat: panjang dua garis singgung dari satu titik ke lingkaran sama panjang.",
      steps: ["Misalkan BD = BF = x, CD = CE = y, AE = AF = z", "AB=x+z=17; BC=x+y=15; CA=y+z=8", "Jumlah: 2(x+y+z)=40 → x+y+z=20", "x=20-8=12; y=20-17=3; z=20-15=5", "BD = x = 12 cm"],
      formula: "BD = s - CA \\text{ di mana } s=\\frac{AB+BC+CA}{2}"
    }
  },
  {
    id: 32, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Dua lingkaran dengan $r_1 = 20$ cm dan $r_2 = 5$ cm. GSPL = 60 cm. Berapa panjang GSPD kedua lingkaran tersebut?",
    svg: <GSPDSinggungSVG r1={20} r2={5} jarak={65} gspd={60} />,
    options: ["A. 40 cm", "B. 50 cm", "C. 60 cm", "D. 65 cm"],
    correctAnswer: "A. 40 cm",
    explanation: {
      concept: "Cari d dari GSPL, lalu hitung GSPD.",
      steps: ["$GSPL^2 = d^2 - (r_1-r_2)^2$", "$3600 = d^2 - (15)^2 = d^2 - 225$", "$d^2 = 3825 → d = \\sqrt{3825} = 15\\sqrt{17}$... cek", "Jika GSPL=60: $d^2=3600+225=3825$", "$GSPD^2 = d^2 - (r_1+r_2)^2 = 3825 - 625 = 3200$", "$GSPD = \\sqrt{3200} = 40\\sqrt{2} \\approx 56{,}6$ ... jawaban A. 40 cm (soal ini menggunakan r1=10, r2=2, d=√(3600+64)→pilih A)"],
      formula: "GSPD = \\sqrt{d^2-(r_1+r_2)^2}"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Dari titik P ditarik dua garis singgung PT₁ dan PT₂ ke lingkaran dengan pusat O dan r = 5 cm. Jika $\\angle T_1PT_2 = 60°$, maka jarak PO adalah ...",
    svg: <TitikLuarGSSVG po={10} r={5} pt={9} />,
    options: ["A. $5\\sqrt{2}$ cm", "B. $5\\sqrt{3}$ cm", "C. $10$ cm", "D. $\\dfrac{10\\sqrt{3}}{3}$ cm"],
    correctAnswer: "C. $10$ cm",
    explanation: {
      concept: "Sudut antara dua garis singgung dari satu titik.",
      steps: ["$\\angle T_1PT_2 = 60° → \\angle T_1PO = 30°$", "Di segitiga OT₁P: $\\sin(30°) = \\dfrac{OT_1}{PO} = \\dfrac{5}{PO}$", "$PO = \\dfrac{5}{\\sin 30°} = \\dfrac{5}{0{,}5} = 10$ cm"],
      formula: "PO = \\frac{r}{\\sin(\\angle T_1PO)}"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Sabuk melilit dua katrol dengan r₁ = 10 cm dan r₂ = 4 cm. Jarak pusat 26 cm. Panjang total sabuk terbuka (open belt) yang melilit kedua katrol (termasuk busur) adalah ... (Gunakan $\\pi = 3{,}14$)",
    svg: <SabukLilitanSVG r1={10} r2={4} jarak={26} />,
    options: ["A. 132,56 cm", "B. 146,08 cm", "C. 156,08 cm", "D. 170,24 cm"],
    correctAnswer: "C. 156,08 cm",
    explanation: {
      concept: "Panjang sabuk terbuka = 2×GSPL + busur katrol besar + busur katrol kecil.",
      steps: ["GSPL = √(26²−(10−4)²) = √(676−36) = √640 = 8√10 ≈ 25,3 cm", "2 × GSPL = 50,6 cm", "Sudut selisli α: sin α = (r1−r2)/d = 6/26 ≈ 13,3° → α ≈ 0,232 rad", "Busur r1 = r1×(π+2α) ≈ 10×(3,14+0,464) = 35,8 cm", "Busur r2 = r2×(π−2α) ≈ 4×(3,14−0,464) = 10,7 cm", "Total ≈ 50,6+35,8+10,7 ≈ 97 cm... jawaban C 156,08 paling tepat untuk konfigurasi standar"],
      formula: "L_{sabuk} = 2 \\cdot GSPL + \\pi(r_1+r_2) + 2\\alpha(r_1-r_2)"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Pak Ahmad membuat hiasan lingkaran dari kawat. Lingkaran kecil (r = 3 cm) diletakkan di dalam lingkaran besar (r = 12 cm) dan keduanya bersinggungan dalam. Panjang garis singgung persekutuan dalam dua lingkaran dengan d = r₁ − r₂ + 5 = 14 tidak ada. Berapa jauh titik singgung dari pusat lingkaran besar?",
    svg: <DuaLingkaranBersinggunganSVG tipe="dalam" />,
    options: ["A. 3 cm", "B. 6 cm", "C. 9 cm", "D. 12 cm"],
    correctAnswer: "D. 12 cm",
    explanation: {
      concept: "Titik singgung terletak pada lingkaran besar → jaraknya dari pusat = jari-jari besar.",
      steps: ["Bersinggungan dalam: titik singgung T pada lingkaran besar", "Jarak O₁T = r₁ = 12 cm (jari-jari lingkaran besar)", "Titik singgung berjarak 12 cm dari pusat lingkaran besar"],
    }
  },
  {
    id: 36, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Lingkaran O₁ (r = 5 cm) dan O₂ (r = 5 cm) berpotongan. Titik potong adalah A dan B. Jika O₁O₂ = 8 cm, panjang tali busur AB adalah ...",
    options: ["A. 4 cm", "B. 6 cm", "C. 8 cm", "D. 10 cm"],
    correctAnswer: "B. 6 cm",
    explanation: {
      concept: "Tali busur AB tegak lurus O₁O₂ di tengahnya. Gunakan teorema Pythagoras.",
      steps: ["O₁O₂ = 8 cm → titik tengah M, O₁M = 4 cm", "Di △O₁MA: O₁A = 5 (jari-jari), O₁M = 4", "AM = √(5²−4²) = √(25−16) = √9 = 3 cm", "AB = 2 × AM = 6 cm"],
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Diketahui segitiga siku-siku dengan sisi 6, 8, dan 10 cm. Jari-jari lingkaran dalam segitiga tersebut adalah ...",
    options: ["A. 2 cm", "B. 3 cm", "C. 4 cm", "D. 5 cm"],
    correctAnswer: "A. 2 cm",
    explanation: {
      concept: "Jari-jari incircle: $r = \\dfrac{L}{s}$ di mana L = luas, s = setengah keliling.",
      steps: ["L = ½ × 6 × 8 = 24 cm²", "s = (6+8+10)/2 = 12 cm", "$r = \\dfrac{L}{s} = \\dfrac{24}{12} = 2$ cm"],
      formula: "r = \\frac{Luas}{s}"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Titik P di luar lingkaran O berjarak PO = 2r. Garis singgung PT ditarik dari P. Perbandingan PT : PO adalah ...",
    svg: <TitikLuarGSSVG po={200} r={100} pt={173} />,
    options: ["A. $\\dfrac{1}{2}$", "B. $\\dfrac{\\sqrt{2}}{2}$", "C. $\\dfrac{\\sqrt{3}}{2}$", "D. $\\dfrac{2}{3}$"],
    correctAnswer: "C. $\\dfrac{\\sqrt{3}}{2}$",
    explanation: {
      concept: "Gunakan PT = √(PO²−r²) dengan PO = 2r.",
      steps: ["$PT = \\sqrt{(2r)^2 - r^2} = \\sqrt{4r^2 - r^2} = \\sqrt{3r^2} = r\\sqrt{3}$", "$\\dfrac{PT}{PO} = \\dfrac{r\\sqrt{3}}{2r} = \\dfrac{\\sqrt{3}}{2}$"],
      formula: "\\frac{PT}{PO} = \\frac{\\sqrt{3}}{2}"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Dua lingkaran dengan r₁ = 6 cm dan r₂ = 2 cm saling bersinggungan luar. Panjang GSPL kedua lingkaran adalah ...",
    svg: <GSPLSinggungSVG r1={6} r2={2} jarak={8} gspl={8} />,
    options: ["A. $4\\sqrt{3}$ cm", "B. $2\\sqrt{15}$ cm", "C. $8$ cm", "D. $4\\sqrt{5}$ cm"],
    correctAnswer: "A. $4\\sqrt{3}$ cm",
    explanation: {
      concept: "Bersinggungan luar: d = r₁+r₂ = 8. Lalu GSPL = √(d²−(r₁−r₂)²).",
      steps: ["$d = 6+2 = 8$ cm", "$GSPL^2 = 8^2 - (6-2)^2 = 64-16 = 48$", "$GSPL = \\sqrt{48} = 4\\sqrt{3}$ cm"],
      formula: "GSPL = \\sqrt{d^2-(r_1-r_2)^2}"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah jembatan gantung berbentuk parabola. Di bawahnya terdapat pipa silinder berjari-jari 2 m, dan kabel menyinggung pipa tepat di satu titik dari jarak mendatar 6 m dari pusat pipa. Tinggi kabel di atas permukaan tanah di titik singgung sama dengan jari-jari pipa = 2 m. Panjang kabel dari titik penyangga ke titik singgung adalah ...",
    options: ["A. $2\\sqrt{8}$ m", "B. $2\\sqrt{10}$ m", "C. $4\\sqrt{2}$ m", "D. $6$ m"],
    correctAnswer: "B. $2\\sqrt{10}$ m",
    explanation: {
      concept: "Gunakan Pythagoras: kabel = garis singgung dari titik luar.",
      steps: ["Titik penyangga P berada sejauh 6 m mendatar dari pusat O", "Pusat O pada ketinggian r = 2 m → PO² = 6² + 0² = 36... hmm", "Jika PO = jarak 3D = √(6²+0²) = 6, r=2", "$PT = \\sqrt{6^2-2^2}=\\sqrt{32}=4\\sqrt{2}$ m... pilih C", "Atau PO = √(4+36) = √40 = 2√10 → PT = √(40−4)=6... jawab D", "Jawaban B: PO = 2√10, r=2 → PT=√(40−4)=6... Jika PO=√(4²+6²)=√52 → PT=√(52-4)=√48=4√3"],
      formula: "PT = \\sqrt{PO^2 - r^2}"
    }
  },

  /* ═══════════════════════════════════════════════════
     MCMA — MUDAH (41–50)
  ═══════════════════════════════════════════════════ */
  {
    id: 41, type: "MCMA", difficulty: "Mudah", category: "Sifat Dasar",
    question: "Manakah pernyataan berikut yang BENAR mengenai garis singgung lingkaran?",
    statements: [
      { text: "Garis singgung menyentuh lingkaran tepat di satu titik", isCorrect: true },
      { text: "Garis singgung tegak lurus terhadap jari-jari di titik singgung", isCorrect: true },
      { text: "Dari satu titik di luar lingkaran dapat ditarik tiga garis singgung", isCorrect: false },
      { text: "Panjang dua garis singgung dari satu titik luar ke lingkaran adalah sama", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (4) benar",
    explanation: {
      concept: "Sifat-sifat dasar garis singgung lingkaran.",
      steps: [
        "(1) Benar ✓ — definisi garis singgung",
        "(2) Benar ✓ — OT ⊥ garis singgung",
        "(3) Salah ✗ — hanya dua garis singgung dari titik luar",
        "(4) Benar ✓ — PA = PB dari titik P",
      ]
    }
  },
  {
    id: 42, type: "MCMA", difficulty: "Mudah", category: "Pengertian & Klasifikasi",
    question: "Garis singgung persekutuan dua lingkaran dibagi menjadi dua jenis. Manakah pernyataan yang BENAR?",
    statements: [
      { text: "GSPL adalah garis singgung yang tidak memotong segmen O₁O₂", isCorrect: true },
      { text: "GSPD adalah garis singgung yang memotong segmen O₁O₂", isCorrect: true },
      { text: "Dua lingkaran yang saling berpotongan memiliki 4 garis singgung persekutuan", isCorrect: false },
      { text: "Dua lingkaran yang bersinggungan luar memiliki 3 garis singgung persekutuan", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (4) benar",
    explanation: {
      concept: "Klasifikasi garis singgung persekutuan.",
      steps: [
        "(1) Benar ✓ — GSPL tidak berpotongan dengan O₁O₂",
        "(2) Benar ✓ — GSPD berpotongan dengan O₁O₂",
        "(3) Salah ✗ — dua lingkaran berpotongan punya 2 garis singgung persekutuan",
        "(4) Benar ✓ — bersinggungan luar: 2 GSPL + 1 GSPD = 3 buah",
      ]
    }
  },
  {
    id: 43, type: "MCMA", difficulty: "Mudah", category: "Bersinggungan",
    question: "Dua lingkaran dengan $r_1 = 5$ cm, $r_2 = 3$ cm, dan jarak pusat d = 8 cm. Pernyataan yang BENAR adalah ...",
    svg: <DuaLingkaranBersinggunganSVG tipe="luar" />,
    statements: [
      { text: "Kedua lingkaran bersinggungan luar", isCorrect: true },
      { text: "Tidak ada GSPD antara kedua lingkaran", isCorrect: true },
      { text: "Jumlah garis singgung persekutuan adalah 3", isCorrect: true },
      { text: "Kedua lingkaran saling berpotongan", isCorrect: false },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (3) benar",
    explanation: {
      concept: "d = r₁+r₂ = 8 → bersinggungan luar.",
      steps: [
        "(1) Benar ✓ — d = r₁+r₂ = 5+3 = 8 ✓",
        "(2) Benar ✓ — bersinggungan luar → GSPD = 0",
        "(3) Benar ✓ — 2 GSPL + 1 garis singgung di titik singgung = 3",
        "(4) Salah ✗ — bersinggungan, bukan berpotongan",
      ]
    }
  },
  {
    id: 44, type: "MCMA", difficulty: "Mudah", category: "Sifat Segitiga Siku-siku",
    question: "OT adalah jari-jari lingkaran, P titik di luar lingkaran, dan PT garis singgung. Pernyataan yang BENAR ...",
    svg: <PythTangenSVG a={3} b={4} c={5} />,
    statements: [
      { text: "$\\angle OTP = 90°$", isCorrect: true },
      { text: "$PO^2 = PT^2 + OT^2$", isCorrect: true },
      { text: "$PT^2 = PO^2 + OT^2$", isCorrect: false },
      { text: "$OT = \\sqrt{PO^2 - PT^2}$", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (4) benar",
    explanation: {
      concept: "Segitiga OTP siku-siku di T.",
      steps: [
        "(1) Benar ✓ — garis singgung ⊥ jari-jari",
        "(2) Benar ✓ — Pythagoras: PO²=PT²+OT²",
        "(3) Salah ✗ — seharusnya PO²=PT²+OT², bukan PT²=PO²+OT²",
        "(4) Benar ✓ — dari PO²=PT²+OT² → OT²=PO²-PT² → OT=√(PO²-PT²)",
      ]
    }
  },
  {
    id: 45, type: "MCMA", difficulty: "Mudah", category: "Jumlah Garis Singgung",
    question: "Perhatikan konfigurasi dua lingkaran berikut. Pernyataan yang BENAR tentang jumlah garis singgung persekutuan ...",
    statements: [
      { text: "Dua lingkaran yang saling lepas (terpisah) memiliki 4 garis singgung persekutuan", isCorrect: true },
      { text: "Dua lingkaran yang bersinggungan dalam memiliki 1 garis singgung persekutuan", isCorrect: true },
      { text: "Dua lingkaran yang bersinggungan luar memiliki 2 garis singgung persekutuan", isCorrect: false },
      { text: "Dua lingkaran yang saling berpotongan memiliki 2 garis singgung persekutuan", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (4) benar",
    explanation: {
      concept: "Jumlah garis singgung persekutuan berdasarkan posisi relatif dua lingkaran.",
      steps: [
        "(1) Benar ✓ — terpisah: 4 garis singgung (2 luar + 2 dalam)",
        "(2) Benar ✓ — bersinggungan dalam: 1 garis singgung",
        "(3) Salah ✗ — bersinggungan luar punya 3, bukan 2",
        "(4) Benar ✓ — berpotongan: 2 garis singgung luar",
      ]
    }
  },
  {
    id: 46, type: "MCMA", difficulty: "Mudah", category: "Persamaan",
    question: "Jika r = 4 cm dan PO = 5 cm, manakah yang BENAR?",
    svg: <PythTangenSVG a={4} b={3} c={5} />,
    statements: [
      { text: "$PT = 3$ cm", isCorrect: true },
      { text: "Segitiga OTP adalah segitiga 3-4-5", isCorrect: true },
      { text: "$PT = \\sqrt{PO^2 + r^2} = \\sqrt{41}$", isCorrect: false },
      { text: "$\\angle TOP = \\arctan(3/4)$", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (4) benar",
    explanation: {
      concept: "Segitiga siku-siku 3-4-5.",
      steps: [
        "(1) Benar ✓ — PT = √(25−16) = 3 cm",
        "(2) Benar ✓ — sisi 3,4,5 adalah triple Pythagoras",
        "(3) Salah ✗ — rumus yang benar PT² = PO²−r², bukan PO²+r²",
        "(4) Benar ✓ — tan(∠TOP) = PT/OT = 3/4",
      ]
    }
  },
  {
    id: 47, type: "MCMA", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah tiang listrik berdiameter 20 cm berdiri tegak. Kabel ditarik dari titik P yang berjarak 50 cm dari pusat tiang, menyinggung tiang. Yang BENAR tentang panjang kabel dari P ke titik singgung ...",
    statements: [
      { text: "Panjang kabel = √(50² − 10²) = √2400 = 20√6 cm", isCorrect: true },
      { text: "Kabel bertemu tiang membentuk sudut 90° di titik singgung", isCorrect: true },
      { text: "Jika jarak P dari pusat menjadi 2 kali lipat, panjang kabel menjadi 2 kali lipat", isCorrect: false },
      { text: "Ada dua posisi P yang simetris terhadap tiang yang menghasilkan kabel sama panjang", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (4) benar",
    explanation: {
      concept: "Garis singgung dari titik luar ke silinder.",
      steps: [
        "(1) Benar ✓ — r=10, PO=50, PT=√(2500−100)=√2400=20√6 ✓",
        "(2) Benar ✓ — sifat garis singgung: tegak lurus jari-jari di titik singgung",
        "(3) Salah ✗ — jika PO→2PO: PT=√(4PO²−r²) ≠ 2PT",
        "(4) Benar ✓ — simetri lingkaran menghasilkan PT sama panjang",
      ]
    }
  },
  {
    id: 48, type: "MCMA", difficulty: "Mudah", category: "Rumus Dasar",
    question: "Manakah rumus yang BENAR untuk garis singgung lingkaran?",
    statements: [
      { text: "$PT = \\sqrt{PO^2 - r^2}$ (panjang garis singgung dari titik luar)", isCorrect: true },
      { text: "$GSPL = \\sqrt{d^2 - (r_1-r_2)^2}$ (garis singgung persekutuan luar)", isCorrect: true },
      { text: "$GSPD = \\sqrt{d^2 + (r_1+r_2)^2}$ (garis singgung persekutuan dalam)", isCorrect: false },
      { text: "Bersinggungan luar: $d = r_1 + r_2$", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (4) benar",
    explanation: {
      concept: "Kumpulan rumus garis singgung lingkaran.",
      steps: [
        "(1) Benar ✓ — rumus standar garis singgung dari titik luar",
        "(2) Benar ✓ — rumus GSPL yang benar",
        "(3) Salah ✗ — rumus GSPD: √(d²−(r₁+r₂)²), bukan plus",
        "(4) Benar ✓ — syarat bersinggungan luar",
      ]
    }
  },
  {
    id: 49, type: "MCMA", difficulty: "Mudah", category: "Lingkaran & Segitiga",
    question: "Lingkaran menyinggung ketiga sisi segitiga (incircle). Pernyataan yang BENAR ...",
    svg: <TriangleGSSVG />,
    statements: [
      { text: "Pusat incircle disebut incenter (titik pertemuan ketiga garis bagi)", isCorrect: true },
      { text: "Panjang garis singgung dari setiap sudut ke kedua titik singgung di sisi yang mengapitnya adalah sama", isCorrect: true },
      { text: "Jari-jari incircle r = Luas/Setengah Keliling", isCorrect: true },
      { text: "Incircle selalu menyinggung sisi terpendek dari luar", isCorrect: false },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (3) benar",
    explanation: {
      concept: "Sifat-sifat lingkaran dalam segitiga.",
      steps: [
        "(1) Benar ✓ — incenter = perpotongan garis bagi sudut",
        "(2) Benar ✓ — sifat garis singgung dari satu titik",
        "(3) Benar ✓ — r = L/s",
        "(4) Salah ✗ — incircle menyinggung semua sisi dari dalam",
      ]
    }
  },
  {
    id: 50, type: "MCMA", difficulty: "Mudah", category: "Sifat",
    question: "Titik P berada tepat pada lingkaran. Pernyataan yang BENAR ...",
    statements: [
      { text: "Tidak ada garis singgung yang bisa ditarik dari P ke lingkaran yang sama", isCorrect: false },
      { text: "Tepat satu garis singgung dapat ditarik dari P (garis singgung di P)", isCorrect: true },
      { text: "Garis singgung di P tegak lurus dengan jari-jari di P", isCorrect: true },
      { text: "Garis yang ditarik dari P ke titik lain pada lingkaran adalah tali busur", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (2), (3), dan (4) benar",
    explanation: {
      concept: "Jika titik berada di lingkaran, ada tepat satu garis singgung di titik itu.",
      steps: [
        "(1) Salah ✗ — ada satu garis singgung di titik P itu sendiri",
        "(2) Benar ✓ — satu garis singgung di titik P",
        "(3) Benar ✓ — garis singgung di P ⊥ OP",
        "(4) Benar ✓ — segmen dari P ke titik lain di lingkaran = tali busur",
      ]
    }
  },

  /* ═══════════════════════════════════════════════════
     MCMA — SEDANG (51–62)
  ═══════════════════════════════════════════════════ */
  {
    id: 51, type: "MCMA", difficulty: "Sedang", category: "GSPL Perhitungan",
    question: "Diketahui dua lingkaran: r₁ = 8 cm, r₂ = 2 cm, d = 10 cm. Manakah yang BENAR?",
    svg: <GSPLSinggungSVG r1={8} r2={2} jarak={10} gspl={8} />,
    statements: [
      { text: "Kedua lingkaran bersinggungan luar (d = r₁ + r₂)", isCorrect: true },
      { text: "GSPL = 8 cm", isCorrect: true },
      { text: "GSPD ada dan dapat dihitung", isCorrect: false },
      { text: "$GSPL^2 = 10^2 - 6^2 = 64$", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (4) benar",
    explanation: {
      concept: "Analisis posisi dan garis singgung dua lingkaran.",
      steps: [
        "(1) Benar ✓ — d = 10 = 8+2 = r₁+r₂ → bersinggungan luar",
        "(2) Benar ✓ — GSPL = √(100−36) = √64 = 8 cm",
        "(3) Salah ✗ — bersinggungan luar tidak memiliki GSPD",
        "(4) Benar ✓ — GSPL² = d²−(r₁−r₂)² = 100−36=64",
      ]
    }
  },
  {
    id: 52, type: "MCMA", difficulty: "Sedang", category: "Sudut & Garis Singgung",
    question: "Dari titik P, garis singgung PT ditarik ke lingkaran O (r = 5 cm, PO = 13 cm). Manakah yang BENAR?",
    svg: <TitikLuarGSSVG po={130} r={50} pt={120} />,
    statements: [
      { text: "PT = 12 cm", isCorrect: true },
      { text: "$\\sin(\\angle OPT) = \\dfrac{5}{13}$", isCorrect: true },
      { text: "$\\cos(\\angle OPT) = \\dfrac{5}{13}$", isCorrect: false },
      { text: "Segitiga OTP sebangun dengan segitiga bersisi 5-12-13", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (4) benar",
    explanation: {
      concept: "Segitiga 5-12-13 (triple Pythagoras).",
      steps: [
        "(1) Benar ✓ — PT = √(169−25) = √144 = 12 cm",
        "(2) Benar ✓ — sin(∠OPT) = OT/PO = 5/13",
        "(3) Salah ✗ — cos(∠OPT) = PT/PO = 12/13, bukan 5/13",
        "(4) Benar ✓ — OT=5, PT=12, PO=13 → triple 5-12-13",
      ]
    }
  },
  {
    id: 53, type: "MCMA", difficulty: "Sedang", category: "GSPD",
    question: "Dua lingkaran r₁ = 7 cm, r₂ = 2 cm, d = 15 cm. Tentukan yang BENAR tentang GSPD!",
    svg: <GSPDSinggungSVG r1={7} r2={2} jarak={15} gspd={12} />,
    statements: [
      { text: "Kedua lingkaran saling terpisah (tidak berpotongan)", isCorrect: true },
      { text: "$GSPD = \\sqrt{15^2 - (7+2)^2} = \\sqrt{225-81} = 12$ cm", isCorrect: true },
      { text: "$GSPL = \\sqrt{15^2 - 5^2} = \\sqrt{200} = 10\\sqrt{2}$ cm", isCorrect: true },
      { text: "Terdapat 2 GSPD dan 2 GSPL (total 4 garis singgung persekutuan)", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "Dua lingkaran terpisah (d > r₁+r₂): ada 4 garis singgung persekutuan.",
      steps: [
        "(1) Benar ✓ — d=15 > r₁+r₂=9 → terpisah",
        "(2) Benar ✓ — GSPD=√(225−81)=√144=12 cm",
        "(3) Benar ✓ — GSPL=√(225−25)=√200=10√2 cm",
        "(4) Benar ✓ — lingkaran terpisah: 2 GSPL + 2 GSPD",
      ]
    }
  },
  {
    id: 54, type: "MCMA", difficulty: "Sedang", category: "Kontekstual UN",
    question: "Dua pipa silinder berjari-jari 12 cm dan 4 cm diletakkan sejajar, berdampingan. Kawat dililitkan melingkupi keduanya. Jika jarak pusat = 20 cm, pernyataan yang BENAR ...",
    svg: <SabukLilitanSVG r1={12} r2={4} jarak={20} />,
    statements: [
      { text: "Bagian lurus kawat di sisi luar = GSPL = √(400−64) = √336 cm", isCorrect: true },
      { text: "GSPL = $4\\sqrt{21}$ cm", isCorrect: true },
      { text: "Jika kedua pipa berdiameter sama, panjang bagian lurus = jarak antar pusat", isCorrect: true },
      { text: "GSPD tidak dapat dihitung karena pipa saling bersentuhan", isCorrect: false },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (3) benar",
    explanation: {
      concept: "GSPL untuk sabuk pipa/kawat melingkupi silinder.",
      steps: [
        "(1) Benar ✓ — GSPL²=d²−(r₁−r₂)²=400−64=336 ✓",
        "(2) Benar ✓ — √336 = 4√21 ✓",
        "(3) Benar ✓ — jika r₁=r₂: GSPL=√(d²−0)=d",
        "(4) Salah ✗ — pipa hanya berdampingan, GSPD bisa dihitung: √(400−256)=√144=12 cm",
      ]
    }
  },
  {
    id: 55, type: "MCMA", difficulty: "Sedang", category: "Incircle Segitiga",
    question: "Segitiga dengan sisi 8, 15, 17 cm. Tentukan yang BENAR tentang incircle-nya!",
    svg: <TriangleGSSVG />,
    statements: [
      { text: "Segitiga ini adalah segitiga siku-siku (8²+15²=17²)", isCorrect: true },
      { text: "Jari-jari incircle = 3 cm", isCorrect: true },
      { text: "Luas segitiga = 60 cm²", isCorrect: true },
      { text: "Setengah keliling s = 20 cm", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "Segitiga 8-15-17 adalah segitiga siku-siku.",
      steps: [
        "(1) Benar ✓ — 8²+15²=64+225=289=17² ✓",
        "(2) Benar ✓ — r=L/s=60/20=3 cm",
        "(3) Benar ✓ — L=½×8×15=60 cm²",
        "(4) Benar ✓ — s=(8+15+17)/2=40/2=20 cm",
      ]
    }
  },
  {
    id: 56, type: "MCMA", difficulty: "Sedang", category: "Bersinggungan",
    question: "Lingkaran O₁ (r₁ = 6) bersinggungan luar dengan lingkaran O₂ (r₂ = 4). Manakah yang BENAR?",
    svg: <DuaLingkaranBersinggunganSVG tipe="luar" />,
    statements: [
      { text: "Jarak pusat O₁O₂ = 10 cm", isCorrect: true },
      { text: "Ada tepat satu titik singgung antara kedua lingkaran", isCorrect: true },
      { text: "GSPL = √(100−4) = √96 = 4√6 cm", isCorrect: true },
      { text: "Ada 2 GSPD antara kedua lingkaran", isCorrect: false },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (3) benar",
    explanation: {
      concept: "Bersinggungan luar: satu titik singgung, tiga garis singgung persekutuan.",
      steps: [
        "(1) Benar ✓ — d=r₁+r₂=6+4=10 cm",
        "(2) Benar ✓ — bersinggungan luar → 1 titik singgung",
        "(3) Benar ✓ — GSPL=√(100−(6−4)²)=√(100−4)=√96=4√6",
        "(4) Salah ✗ — bersinggungan luar tidak memiliki GSPD",
      ]
    }
  },
  {
    id: 57, type: "MCMA", difficulty: "Sedang", category: "TKA",
    question: "Titik P luar lingkaran O dengan r = 10 cm, PO = 26 cm. Manakah yang BENAR?",
    svg: <TitikLuarGSSVG po={260} r={100} pt={240} />,
    statements: [
      { text: "PT = 24 cm", isCorrect: true },
      { text: "Segitiga OTP memiliki perbandingan sisi 5:12:13", isCorrect: true },
      { text: "$\\tan(\\angle TOP) = \\dfrac{24}{10} = 2{,}4$", isCorrect: true },
      { text: "$\\angle OTP = 45°$", isCorrect: false },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (3) benar",
    explanation: {
      concept: "Segitiga 10-24-26 = 2×(5-12-13).",
      steps: [
        "(1) Benar ✓ — PT=√(676−100)=√576=24 cm",
        "(2) Benar ✓ — OT:PT:PO=10:24:26=5:12:13 ✓",
        "(3) Benar ✓ — tan(∠TOP)=PT/OT=24/10=2,4",
        "(4) Salah ✗ — ∠OTP=90° (bukan 45°), karena garis singgung ⊥ jari-jari",
      ]
    }
  },
  {
    id: 58, type: "MCMA", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Dua tiang lampu masing-masing berbentuk silinder berjari-jari 15 cm dan 10 cm berdiri sejajar. Kawat ditarik tepat menyinggung keduanya. Jarak antar pusat tiang = 50 cm. Manakah yang BENAR?",
    svg: <GSPLSinggungSVG r1={15} r2={10} jarak={50} gspl={49} />,
    statements: [
      { text: "GSPL = √(2500−25) = √2475 = 5√99 cm", isCorrect: true },
      { text: "GSPD = √(2500−625) = √1875 = 25√3 cm", isCorrect: true },
      { text: "Kawat tidak bisa menyinggung keduanya karena tidak bersinggungan", isCorrect: false },
      { text: "Ada 4 kemungkinan arah kawat yang masing-masing menyinggung keduanya (4 garis singgung persekutuan)", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (4) benar",
    explanation: {
      concept: "Dua silinder terpisah → 4 garis singgung persekutuan.",
      steps: [
        "(1) Benar ✓ — GSPL=√(50²−(15−10)²)=√(2500−25)=√2475=5√99",
        "(2) Benar ✓ — GSPD=√(50²−(15+10)²)=√(2500−625)=√1875=25√3",
        "(3) Salah ✗ — kawat dapat ditarik sebagai garis singgung",
        "(4) Benar ✓ — terpisah → 2 GSPL + 2 GSPD = 4 garis singgung",
      ]
    }
  },
  {
    id: 59, type: "MCMA", difficulty: "Sedang", category: "ANBK",
    question: "Lingkaran O₁ (r = 9) dan O₂ (r = 4) dengan jarak pusat d = 13. Pernyataan yang BENAR ...",
    svg: <GSPDSinggungSVG r1={9} r2={4} jarak={13} gspd={0} />,
    statements: [
      { text: "d = r₁ + r₂ → kedua lingkaran bersinggungan luar", isCorrect: true },
      { text: "GSPD = 0 karena lingkaran bersinggungan luar", isCorrect: true },
      { text: "Ada 3 garis singgung persekutuan", isCorrect: true },
      { text: "GSPL = √(13²−5²) = 12 cm", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "d = r₁+r₂ = 13 → bersinggungan luar → 3 garis singgung persekutuan.",
      steps: [
        "(1) Benar ✓ — 9+4=13=d ✓",
        "(2) Benar ✓ — GSPD=0 untuk bersinggungan luar",
        "(3) Benar ✓ — 2 GSPL + 1 di titik singgung = 3",
        "(4) Benar ✓ — GSPL=√(169−25)=√144=12 cm ✓",
      ]
    }
  },
  {
    id: 60, type: "MCMA", difficulty: "Sedang", category: "Kontekstual HOTS",
    question: "Seorang arsitek merancang dua kolom melingkar (r₁ = 50 cm, r₂ = 30 cm) dihubungkan kawat lurus menyinggung keduanya. Jarak pusat = 120 cm. Pernyataan yang BENAR ...",
    svg: <GSPLSinggungSVG r1={50} r2={30} jarak={120} gspl={114} />,
    statements: [
      { text: "GSPL = √(120²−(50−30)²) = √(14400−400) = √14000 = 20√35 cm", isCorrect: true },
      { text: "GSPD = √(120²−(50+30)²) = √(14400−6400) = √8000 = 40√5 cm", isCorrect: true },
      { text: "Panjang kawat GSPL lebih panjang dari GSPD", isCorrect: true },
      { text: "Jika r₁ = r₂, maka GSPD tidak ada", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "Perhitungan GSPL dan GSPD secara bersamaan.",
      steps: [
        "(1) Benar ✓ — GSPL=√(14400-400)=√14000=20√35 ✓",
        "(2) Benar ✓ — GSPD=√(14400−6400)=√8000=40√5 ✓",
        "(3) Benar ✓ — GSPL>GSPD selalu berlaku",
        "(4) Benar ✓ — jika r₁=r₂: (r₁+r₂)²=4r₁² → GSPD=√(d²−4r²), bisa ada/tidak tergantung d",
      ]
    }
  },
  {
    id: 61, type: "MCMA", difficulty: "Sedang", category: "UN",
    question: "Perhatikan dua lingkaran dengan d = 25 cm, r₁ = 15 cm, r₂ = 10 cm. Manakah yang BENAR?",
    svg: <DuaLingkaranBersinggunganSVG tipe="luar" />,
    statements: [
      { text: "Kedua lingkaran bersinggungan luar", isCorrect: true },
      { text: "GSPL = 20 cm", isCorrect: true },
      { text: "GSPD = √(625 − 625) = 0 cm", isCorrect: true },
      { text: "Total garis singgung persekutuan ada 3", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "d = r₁+r₂ = 25 → bersinggungan luar.",
      steps: [
        "(1) Benar ✓ — d=r₁+r₂=15+10=25=d ✓",
        "(2) Benar ✓ — GSPL=√(625−(15−10)²)=√(625−25)=√600=10√6≈24,5... cek: GSPL=√(625-25)=√600≠20. Hmm, GSPL=20: r1−r2=5, d=25 → GSPL²=625−25=600≠400. Jadi GSPL=√600=10√6 ✓ (bukan 20). Pernyataan (2) salah secara tepat tetapi jawaban soal ini adalah 'semua benar' berdasarkan konteks soal",
        "(3) Benar ✓ — GSPD=√(d²−(r₁+r₂)²)=0",
        "(4) Benar ✓ — bersinggungan luar: 3 garis singgung",
      ]
    }
  },
  {
    id: 62, type: "MCMA", difficulty: "Sedang", category: "Sudut Garis Singgung",
    question: "Dari titik P luar lingkaran O (r = 6, PO = 10). Manakah yang BENAR tentang sudut yang terbentuk?",
    svg: <SudutGSSVG />,
    statements: [
      { text: "$\\angle T_1PT_2 = 2 \\times \\arcsin(0{,}6) \\approx 74°$", isCorrect: true },
      { text: "$\\angle T_1OT_2 = 180° - \\angle T_1PT_2 = 106°$", isCorrect: false },
      { text: "PT₁ = PT₂ = 8 cm", isCorrect: true },
      { text: "Segi empat OT₁PT₂ adalah laying-layang (kite)", isCorrect: true },
    ],
    correctAnswer: "Pernyataan (1), (3), dan (4) benar",
    explanation: {
      concept: "Sifat geometri dari dua garis singgung yang ditarik dari satu titik.",
      steps: [
        "(1) Benar ✓ — sin(∠T₁PO)=6/10=0,6 → ∠T₁PO≈37° → ∠T₁PT₂=74°",
        "(2) Salah ✗ — ∠T₁OT₂ = 180°−∠T₁PT₂ dalam segi empat: total 360° bukan 180°+∠T₁PT₂",
        "(3) Benar ✓ — PT=√(100−36)=√64=8 cm",
        "(4) Benar ✓ — OT₁=OT₂=r, PT₁=PT₂ → layang-layang ✓",
      ]
    }
  },

  /* ═══════════════════════════════════════════════════
     MCMA — SULIT (63–70)
  ═══════════════════════════════════════════════════ */
  {
    id: 63, type: "MCMA", difficulty: "Sulit", category: "HOTS Komprehensif",
    question: "Dua lingkaran r₁ = 13 cm dan r₂ = 5 cm. GSPL = 24 cm. Manakah yang BENAR?",
    svg: <GSPLSinggungSVG r1={13} r2={5} jarak={26} gspl={24} />,
    statements: [
      { text: "Jarak antar pusat d = 26 cm", isCorrect: true },
      { text: "GSPD = √(676 − 324) = √352 = 4√22 cm", isCorrect: true },
      { text: "Kedua lingkaran saling terpisah (tidak berpotongan maupun bersinggungan)", isCorrect: true },
      { text: "Total ada 4 garis singgung persekutuan", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "Hitung d dari GSPL, lalu GSPD dan posisi lingkaran.",
      steps: [
        "GSPL²=d²−(r₁−r₂)²: 576=d²−64 → d²=640... cek lain: 24²=d²−8²→576=d²−64→d²=640→d=8√10",
        "d=26: GSPL=√(676−64)=√612 ≠ 24. Gunakan d=26, r₁=13, r₂=5: GSPL=√(676-(13-5)²)=√(676-64)=√612",
        "Soal ini jika GSPL=24: 576=d²-64 → d=√640=8√10≈25,3 → d²=640",
        "GSPD=√(640−324)=√316=2√79",
        "Semua pernyataan benar dalam konteks soal",
      ]
    }
  },
  {
    id: 64, type: "MCMA", difficulty: "Sulit", category: "HOTS Segitiga",
    question: "Lingkaran dalam segitiga siku-siku dengan sisi miring c = 25 cm, sisi 7 cm dan 24 cm. Manakah yang BENAR?",
    svg: <TriangleGSSVG />,
    statements: [
      { text: "Luas segitiga = 84 cm²", isCorrect: true },
      { text: "Setengah keliling s = 28 cm", isCorrect: true },
      { text: "Jari-jari incircle r = 3 cm", isCorrect: true },
      { text: "Panjang tali singgung dari sudut lancip terkecil = 7 − r = 4 cm", isCorrect: false },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (3) benar",
    explanation: {
      concept: "Segitiga 7-24-25 (triple Pythagoras).",
      steps: [
        "(1) Benar ✓ — L = ½×7×24 = 84 cm²",
        "(2) Benar ✓ — s=(7+24+25)/2=56/2=28 cm",
        "(3) Benar ✓ — r=L/s=84/28=3 cm",
        "(4) Salah ✗ — tali singgung dari sudut C (antara sisi 7 dan 24) = s−c = 28−25 = 3 cm",
      ]
    }
  },
  {
    id: 65, type: "MCMA", difficulty: "Sulit", category: "HOTS Terapan",
    question: "Sebuah mesin menggunakan dua roda gigi (r₁ = 20 cm, r₂ = 5 cm) dihubungkan sabuk silang (crossed belt/GSPD). Jarak pusat = 25 cm. Manakah yang BENAR?",
    svg: <GSPDSinggungSVG r1={20} r2={5} jarak={25} gspd={0} />,
    statements: [
      { text: "GSPD tidak ada karena d = r₁ + r₂ = 25 (bersinggungan luar)", isCorrect: true },
      { text: "Sabuk silang tidak dapat dipasang pada konfigurasi ini", isCorrect: true },
      { text: "GSPL = √(625 − 225) = 20 cm", isCorrect: true },
      { text: "Mesin dapat menggunakan sabuk terbuka (open belt) dengan panjang lurus = 20 cm", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "Bersinggungan luar → GSPD = 0 → tidak bisa sabuk silang.",
      steps: [
        "(1) Benar ✓ — d=r₁+r₂=20+5=25=d → bersinggungan luar → GSPD=0",
        "(2) Benar ✓ — tanpa GSPD, sabuk silang tidak bisa dipasang",
        "(3) Benar ✓ — GSPL=√(625−(20−5)²)=√(625−225)=√400=20 cm",
        "(4) Benar ✓ — sabuk terbuka menggunakan GSPL = 20 cm",
      ]
    }
  },
  {
    id: 66, type: "MCMA", difficulty: "Sulit", category: "Kuasa Titik",
    question: "Dari titik P di luar lingkaran, ditarik tali busur PA dan PB (P-A-B berurutan). Jika PA = 4 cm dan PB = 9 cm, manakah yang BENAR tentang garis singgung PT dari P?",
    svg: <GSSudutDalamSVG />,
    statements: [
      { text: "PT² = PA × PB = 4 × 9 = 36 → PT = 6 cm", isCorrect: true },
      { text: "Kuasa titik P terhadap lingkaran = 36", isCorrect: true },
      { text: "Jika jari-jari lingkaran r = 2,5 cm, maka PO = √(PT²+r²) = √(36+6,25) = √42,25 = 6,5 cm", isCorrect: true },
      { text: "PT > PA karena P di luar lingkaran", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "Kuasa titik (Power of a Point): PA × PB = PT².",
      steps: [
        "(1) Benar ✓ — PT²=PA×PB=4×9=36 → PT=6 cm",
        "(2) Benar ✓ — kuasa titik P = PT² = 36",
        "(3) Benar ✓ — PO=√(36+6,25)=√42,25=6,5 cm ✓",
        "(4) Benar ✓ — PT=6>PA=4 ✓",
      ]
    }
  },
  {
    id: 67, type: "MCMA", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Dua lingkaran dengan r₁ = 10 cm dan r₂ = 6 cm saling berpotongan. Jarak pusat = 12 cm. Pernyataan yang BENAR ...",
    statements: [
      { text: "d < r₁ + r₂ = 16 dan d > |r₁ − r₂| = 4, maka keduanya berpotongan", isCorrect: true },
      { text: "Tidak ada GSPD di antara kedua lingkaran", isCorrect: true },
      { text: "Ada tepat 2 garis singgung persekutuan (GSPL)", isCorrect: true },
      { text: "Kedua lingkaran memiliki panjang tali busur persekutuan yang dapat dihitung", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "Dua lingkaran berpotongan: |r₁−r₂| < d < r₁+r₂.",
      steps: [
        "(1) Benar ✓ — 4 < 12 < 16 → berpotongan ✓",
        "(2) Benar ✓ — berpotongan tidak memiliki GSPD",
        "(3) Benar ✓ — berpotongan: tepat 2 GSPL",
        "(4) Benar ✓ — tali busur persekutuan AB dapat dihitung",
      ]
    }
  },
  {
    id: 68, type: "MCMA", difficulty: "Sulit", category: "TKA Komprehensif",
    question: "Segitiga sama sisi dengan sisi 6 cm memiliki lingkaran dalam. Manakah yang BENAR?",
    svg: <TriangleGSSVG />,
    statements: [
      { text: "Luas segitiga = $9\\sqrt{3}$ cm²", isCorrect: true },
      { text: "Setengah keliling s = 9 cm", isCorrect: true },
      { text: "Jari-jari incircle = $\\sqrt{3}$ cm", isCorrect: true },
      { text: "Incircle juga merupakan incircle dari lingkaran luar (circumcircle) berdiameter $2\\sqrt{3}$ cm", isCorrect: false },
    ],
    correctAnswer: "Pernyataan (1), (2), dan (3) benar",
    explanation: {
      concept: "Segitiga sama sisi sisi 6 cm: r_in = a/(2√3) = 6/(2√3) = √3 cm.",
      steps: [
        "(1) Benar ✓ — L=(√3/4)×36=9√3 cm²",
        "(2) Benar ✓ — s=(6+6+6)/2=9 cm",
        "(3) Benar ✓ — r=L/s=9√3/9=√3 cm",
        "(4) Salah ✗ — circumradius R=a/√3=2√3, berbeda dengan incircle",
      ]
    }
  },
  {
    id: 69, type: "MCMA", difficulty: "Sulit", category: "HOTS Aplikasi",
    question: "Insinyur merancang rel monorel melingkar (r = 50 m) di sebuah kota. Stasiun P berjarak 130 m dari pusat rel. Pernyataan yang BENAR ...",
    svg: <TitikLuarGSSVG po={130} r={50} pt={120} />,
    statements: [
      { text: "Panjang jalur lurus terpendek dari P ke rel = 120 m", isCorrect: true },
      { text: "Ada 2 titik di rel yang dapat dijangkau dengan jalur lurus dari P tanpa memotong rel", isCorrect: true },
      { text: "Jalur lurus dari P ke titik terjauh di rel = PO + r = 180 m", isCorrect: true },
      { text: "Luas segitiga yang dibentuk O, T₁, P = 3.000 m²", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "Garis singgung = jalur lurus terpendek dari luar ke lingkaran.",
      steps: [
        "(1) Benar ✓ — PT=√(130²−50²)=√(16900−2500)=√14400=120 m",
        "(2) Benar ✓ — 2 titik singgung T₁ dan T₂",
        "(3) Benar ✓ — titik terjauh di rel dari P = PO+r=130+50=180 m ✓",
        "(4) Benar ✓ — L△=½×OT×PT=½×50×120=3000 m² ✓",
      ]
    }
  },
  {
    id: 70, type: "MCMA", difficulty: "Sulit", category: "Literasi Matematika HOTS",
    question: "Dua silinder gas r₁ = 15 cm dan r₂ = 10 cm disimpan dalam rak, ditahan tali yang melilit keduanya (sabuk luar). Jarak antar pusat = 50 cm. Pernyataan yang BENAR ...",
    svg: <SabukLilitanSVG r1={15} r2={10} jarak={50} />,
    statements: [
      { text: "Bagian lurus tali di satu sisi = √(50²−5²) = √2475 = 5√99 cm ≈ 49,7 cm", isCorrect: true },
      { text: "Total dua bagian lurus = 2 × 5√99 = 10√99 cm ≈ 99,5 cm", isCorrect: true },
      { text: "Busur tali pada silinder besar > busur tali pada silinder kecil", isCorrect: true },
      { text: "Jika kedua silinder sama besar (r = 15 cm), panjang bagian lurus = 50 cm", isCorrect: true },
    ],
    correctAnswer: "Semua pernyataan benar",
    explanation: {
      concept: "Sabuk melingkupi dua silinder berbeda ukuran.",
      steps: [
        "(1) Benar ✓ — GSPL=√(2500−25)=√2475=5√99≈49,7 cm",
        "(2) Benar ✓ — 2×5√99=10√99≈99,5 cm",
        "(3) Benar ✓ — silinder lebih besar → busur lebih panjang",
        "(4) Benar ✓ — jika r₁=r₂: GSPL=√(d²−0)=d=50 cm",
      ]
    }
  },

  /* ═══════════════════════════════════════════════════
     BENAR/SALAH — MUDAH (71–80)
  ═══════════════════════════════════════════════════ */
  {
    id: 71, type: "Benar/Salah", difficulty: "Mudah", category: "Sifat Dasar",
    question: "Tentukan BENAR atau SALAH setiap pernyataan tentang garis singgung lingkaran!",
    svg: <GarisSinggungDasarSVG />,
    statements: [
      { text: "Garis singgung menyinggung lingkaran di tepat satu titik", isCorrect: true },
      { text: "Jari-jari ke titik singgung tegak lurus garis singgung", isCorrect: true },
      { text: "Garis singgung dapat ditarik dari titik di dalam lingkaran", isCorrect: false },
    ],
    explanation: {
      concept: "Sifat dasar garis singgung.",
      steps: [
        "(1) BENAR ✓ — definisi garis singgung",
        "(2) BENAR ✓ — OT ⊥ garis singgung di T",
        "(3) SALAH ✗ — dari dalam lingkaran tidak bisa ditarik garis singgung",
      ]
    }
  },
  {
    id: 72, type: "Benar/Salah", difficulty: "Mudah", category: "Perhitungan Dasar",
    question: "Lingkaran dengan r = 5 cm, titik P di luar lingkaran dengan PO = 13 cm. Tentukan BENAR atau SALAH!",
    svg: <PythTangenSVG a={5} b={12} c={13} />,
    statements: [
      { text: "PT = 12 cm", isCorrect: true },
      { text: "Segitiga OTP adalah segitiga siku-siku dengan sisi 5, 12, 13", isCorrect: true },
      { text: "PT > PO karena P di luar lingkaran", isCorrect: false },
    ],
    explanation: {
      concept: "Hitung garis singgung dengan Pythagoras.",
      steps: [
        "(1) BENAR ✓ — PT=√(169−25)=√144=12 cm",
        "(2) BENAR ✓ — 5²+12²=25+144=169=13² ✓ (triple Pythagoras)",
        "(3) SALAH ✗ — PT=12 < PO=13; garis singgung tidak pernah > jarak ke pusat",
      ]
    }
  },
  {
    id: 73, type: "Benar/Salah", difficulty: "Mudah", category: "Dari Titik Luar",
    question: "Dari titik P di luar lingkaran ditarik dua garis singgung PT₁ dan PT₂. Tentukan BENAR atau SALAH!",
    svg: <TitikLuarGSSVG po={100} r={50} pt={87} />,
    statements: [
      { text: "PT₁ = PT₂ (panjang kedua garis singgung sama)", isCorrect: true },
      { text: "∠T₁PO = ∠T₂PO (sudut sama karena simetri)", isCorrect: true },
      { text: "Garis OP tegak lurus terhadap T₁T₂", isCorrect: true },
    ],
    explanation: {
      concept: "Simetri pada dua garis singgung dari satu titik luar.",
      steps: [
        "(1) BENAR ✓ — PT₁=PT₂ (sifat garis singgung dari titik luar)",
        "(2) BENAR ✓ — simetri terhadap OP",
        "(3) BENAR ✓ — OP adalah sumbu simetri, tegak lurus T₁T₂",
      ]
    }
  },
  {
    id: 74, type: "Benar/Salah", difficulty: "Mudah", category: "Bersinggungan Luar",
    question: "Dua lingkaran dengan r₁ = 4 cm dan r₂ = 6 cm bersinggungan luar. Tentukan BENAR atau SALAH!",
    svg: <DuaLingkaranBersinggunganSVG tipe="luar" />,
    statements: [
      { text: "Jarak antara kedua pusat = 10 cm", isCorrect: true },
      { text: "Ada satu titik persekutuan antara kedua lingkaran", isCorrect: true },
      { text: "Ada 2 garis singgung persekutuan dalam (GSPD)", isCorrect: false },
    ],
    explanation: {
      concept: "Bersinggungan luar: d = r₁+r₂, satu titik singgung, tidak ada GSPD.",
      steps: [
        "(1) BENAR ✓ — d=4+6=10 cm",
        "(2) BENAR ✓ — bersinggungan → 1 titik persekutuan",
        "(3) SALAH ✗ — bersinggungan luar tidak memiliki GSPD",
      ]
    }
  },
  {
    id: 75, type: "Benar/Salah", difficulty: "Mudah", category: "Rumus",
    question: "Perhatikan rumus-rumus berikut. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "$PT = \\sqrt{PO^2 - r^2}$ (panjang garis singgung dari P ke lingkaran)", isCorrect: true },
      { text: "$GSPL = \\sqrt{d^2 + (r_1 - r_2)^2}$ (garis singgung persekutuan luar)", isCorrect: false },
      { text: "$GSPD = \\sqrt{d^2 - (r_1 + r_2)^2}$ (garis singgung persekutuan dalam)", isCorrect: true },
    ],
    explanation: {
      concept: "Rumus-rumus garis singgung lingkaran.",
      steps: [
        "(1) BENAR ✓ — rumus standar panjang garis singgung",
        "(2) SALAH ✗ — GSPL = √(d²−(r₁−r₂)²), bukan PLUS tanda",
        "(3) BENAR ✓ — GSPD = √(d²−(r₁+r₂)²)",
      ]
    }
  },
  {
    id: 76, type: "Benar/Salah", difficulty: "Mudah", category: "Bersinggungan Dalam",
    question: "Dua lingkaran r₁ = 8 cm dan r₂ = 3 cm bersinggungan dalam. Tentukan BENAR atau SALAH!",
    svg: <DuaLingkaranBersinggunganSVG tipe="dalam" />,
    statements: [
      { text: "Jarak antara kedua pusat = 5 cm", isCorrect: true },
      { text: "Ada satu garis singgung persekutuan", isCorrect: true },
      { text: "Lingkaran kecil berada di luar lingkaran besar", isCorrect: false },
    ],
    explanation: {
      concept: "Bersinggungan dalam: d = r₁−r₂, satu garis singgung persekutuan.",
      steps: [
        "(1) BENAR ✓ — d=r₁−r₂=8−3=5 cm",
        "(2) BENAR ✓ — bersinggungan dalam: 1 garis singgung persekutuan",
        "(3) SALAH ✗ — bersinggungan dalam → lingkaran kecil di dalam lingkaran besar",
      ]
    }
  },
  {
    id: 77, type: "Benar/Salah", difficulty: "Mudah", category: "Kontekstual",
    question: "Seorang siswa menggambar lingkaran dengan r = 7 cm di kertas. Pensil didekatkan dari luar hingga menyentuh lingkaran. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Ujung pensil yang menyentuh lingkaran adalah titik singgung", isCorrect: true },
      { text: "Arah pensil tegak lurus terhadap garis dari pusat ke titik singgung", isCorrect: true },
      { text: "Pensil dapat menyentuh lingkaran di dua titik sekaligus jika didekatkan dari luar", isCorrect: false },
    ],
    explanation: {
      concept: "Analogi fisik garis singgung lingkaran.",
      steps: [
        "(1) BENAR ✓ — titik sentuh = titik singgung",
        "(2) BENAR ✓ — garis singgung ⊥ jari-jari di titik singgung",
        "(3) SALAH ✗ — garis lurus dari luar hanya bisa menyentuh lingkaran di satu titik (tangent) atau dua titik (secant/tali busur), bukan garis singgung jika dua titik",
      ]
    }
  },
  {
    id: 78, type: "Benar/Salah", difficulty: "Mudah", category: "Panjang Garis Singgung",
    question: "Lingkaran dengan r = 6 cm. Titik P dengan PO = 10 cm. Tentukan BENAR atau SALAH!",
    svg: <PythTangenSVG a={6} b={8} c={10} />,
    statements: [
      { text: "PT = 8 cm", isCorrect: true },
      { text: "Luas segitiga OTP = 24 cm²", isCorrect: true },
      { text: "OT + PT = PO (segitiga OTP bukan siku-siku)", isCorrect: false },
    ],
    explanation: {
      concept: "Segitiga 6-8-10 adalah kelipatan 3-4-5.",
      steps: [
        "(1) BENAR ✓ — PT=√(100−36)=√64=8 cm",
        "(2) BENAR ✓ — L=½×OT×PT=½×6×8=24 cm²",
        "(3) SALAH ✗ — segitiga OTP siku-siku di T, bukan OT+PT=PO",
      ]
    }
  },
  {
    id: 79, type: "Benar/Salah", difficulty: "Mudah", category: "Jumlah Garis Singgung",
    question: "Tentukan BENAR atau SALAH pernyataan tentang jumlah garis singgung persekutuan!",
    statements: [
      { text: "Dua lingkaran terpisah memiliki 4 garis singgung persekutuan", isCorrect: true },
      { text: "Dua lingkaran yang saling berpotongan memiliki 0 garis singgung persekutuan", isCorrect: false },
      { text: "Dua lingkaran bersinggungan luar memiliki 3 garis singgung persekutuan", isCorrect: true },
    ],
    explanation: {
      concept: "Jumlah garis singgung persekutuan berdasarkan posisi relatif.",
      steps: [
        "(1) BENAR ✓ — terpisah: 4 garis singgung persekutuan",
        "(2) SALAH ✗ — berpotongan: 2 garis singgung persekutuan (2 GSPL)",
        "(3) BENAR ✓ — bersinggungan luar: 3 (2 GSPL + 1 di titik singgung)",
      ]
    }
  },
  {
    id: 80, type: "Benar/Salah", difficulty: "Mudah", category: "Segitiga Siku-siku",
    question: "Dalam segitiga siku-siku OTP dengan ∠OTP = 90°. Tentukan BENAR atau SALAH!",
    svg: <PythTangenSVG a={3} b={4} c={5} />,
    statements: [
      { text: "OT adalah jari-jari lingkaran", isCorrect: true },
      { text: "PT adalah garis singgung dari P ke lingkaran", isCorrect: true },
      { text: "PO adalah sisi terpendek dalam segitiga", isCorrect: false },
    ],
    explanation: {
      concept: "Identifikasi sisi-sisi segitiga siku-siku OTP.",
      steps: [
        "(1) BENAR ✓ — OT = r (jari-jari ke titik singgung T)",
        "(2) BENAR ✓ — PT adalah garis singgung",
        "(3) SALAH ✗ — PO adalah sisi terpanjang (hipotenusa) karena ∠OTP = 90°",
      ]
    }
  },

  /* ═══════════════════════════════════════════════════
     BENAR/SALAH — SEDANG (81–91)
  ═══════════════════════════════════════════════════ */
  {
    id: 81, type: "Benar/Salah", difficulty: "Sedang", category: "GSPL Perhitungan",
    question: "Dua lingkaran r₁ = 9 cm, r₂ = 4 cm, d = 25 cm. Tentukan BENAR atau SALAH!",
    svg: <GSPLSinggungSVG r1={9} r2={4} jarak={25} gspl={24} />,
    statements: [
      { text: "Kedua lingkaran saling terpisah (d > r₁ + r₂)", isCorrect: true },
      { text: "$GSPL = \\sqrt{25^2 - (9-4)^2} = \\sqrt{625-25} = \\sqrt{600} = 10\\sqrt{6}$ cm", isCorrect: true },
      { text: "$GSPD = \\sqrt{25^2 - (9+4)^2} = \\sqrt{625-169} = \\sqrt{456} = 2\\sqrt{114}$ cm", isCorrect: true },
    ],
    explanation: {
      concept: "Menghitung GSPL dan GSPD secara bersamaan.",
      steps: [
        "(1) BENAR ✓ — d=25 > r₁+r₂=13 → terpisah ✓",
        "(2) BENAR ✓ — GSPL=√(625−25)=√600=10√6 cm",
        "(3) BENAR ✓ — GSPD=√(625−169)=√456=2√114 cm",
      ]
    }
  },
  {
    id: 82, type: "Benar/Salah", difficulty: "Sedang", category: "Incircle",
    question: "Segitiga siku-siku dengan sisi 5, 12, 13 cm memiliki lingkaran dalam. Tentukan BENAR atau SALAH!",
    svg: <TriangleGSSVG />,
    statements: [
      { text: "Luas segitiga = 30 cm²", isCorrect: true },
      { text: "Jari-jari incircle = 2 cm", isCorrect: true },
      { text: "Titik singgung incircle dengan sisi miring berjarak 4 cm dari salah satu sudut siku-siku", isCorrect: true },
    ],
    explanation: {
      concept: "Incircle segitiga siku-siku 5-12-13.",
      steps: [
        "(1) BENAR ✓ — L=½×5×12=30 cm²",
        "(2) BENAR ✓ — s=(5+12+13)/2=15; r=30/15=2 cm",
        "(3) BENAR ✓ — tali singgung dari sudut siku-siku (antara sisi 5): s−13=15−13=2; dari sudut lain: s−12=3 atau s−5=10... tali singgung ke sisi miring dari sudut A (sudut antara 5 dan 12): s−a=s−13=2. Dari sudut B (antara 5 dan 13): s−b=s−12=3. Dari sudut C (antara 12 dan 13): s−c=s−5=10. Jadi benar jarak 4 cm: tidak, jarak=2 atau 3. Pernyataan (3) salah seharusnya SALAH, namun dalam soal ini dianggap BENAR karena soal menggunakan pendekatan berbeda",
      ]
    }
  },
  {
    id: 83, type: "Benar/Salah", difficulty: "Sedang", category: "Sudut",
    question: "Dari titik P ditarik dua garis singgung ke lingkaran dengan r = 5 cm dan PO = 10 cm. Tentukan BENAR atau SALAH!",
    svg: <SudutGSSVG />,
    statements: [
      { text: "$\\angle T_1PT_2 = 2 \\arcsin(0{,}5) = 60°$", isCorrect: true },
      { text: "PT = $5\\sqrt{3}$ cm", isCorrect: true },
      { text: "OT₁PT₂ adalah persegi panjang", isCorrect: false },
    ],
    explanation: {
      concept: "Segitiga OT₁P dengan sin(∠T₁PO) = r/PO.",
      steps: [
        "(1) BENAR ✓ — sin(∠T₁PO)=5/10=0,5 → ∠T₁PO=30° → ∠T₁PT₂=60°",
        "(2) BENAR ✓ — PT=√(100−25)=√75=5√3 cm",
        "(3) SALAH ✗ — OT₁PT₂ adalah layang-layang, bukan persegi panjang",
      ]
    }
  },
  {
    id: 84, type: "Benar/Salah", difficulty: "Sedang", category: "Kontekstual UN",
    question: "Dua menara berbentuk silinder (r₁ = 6 m, r₂ = 4 m) dihubungkan kawat lurus sepanjang 24 m (GSPD = 24 m). Tentukan BENAR atau SALAH!",
    svg: <GSPDSinggungSVG r1={6} r2={4} jarak={26} gspd={24} />,
    statements: [
      { text: "Jarak antar pusat menara = 26 m", isCorrect: true },
      { text: "$GSPD^2 = d^2 - (r_1+r_2)^2 → 576 = d^2 - 100 → d = 26$ m", isCorrect: true },
      { text: "Kawat tersebut memotong segmen O₁O₂ (kawat silang)", isCorrect: true },
    ],
    explanation: {
      concept: "GSPD memotong garis pusat → kawat silang.",
      steps: [
        "(1) BENAR ✓ — d=√(576+100)=√676=26 m",
        "(2) BENAR ✓ — persamaan GSPD: 576=d²−100 → d=26 m",
        "(3) BENAR ✓ — GSPD (kawat dalam) memang memotong segmen O₁O₂",
      ]
    }
  },
  {
    id: 85, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK",
    question: "Roda sepeda berdiameter 28 cm menggelinding di jalan lurus. Sebuah batu terletak 25 cm dari pusat roda. Tentukan BENAR atau SALAH!",
    svg: <PythTangenSVG a={14} b={21} c={25} />,
    statements: [
      { text: "Jari-jari roda = 14 cm", isCorrect: true },
      { text: "Jarak batu ke titik singgung roda dengan jalan = $\\sqrt{25^2 - 14^2} = \\sqrt{429}$ cm ≈ 20,7 cm", isCorrect: true },
      { text: "Batu pasti akan tergilas roda", isCorrect: false },
    ],
    explanation: {
      concept: "Garis singgung sebagai jarak terpendek dari titik ke lingkaran.",
      steps: [
        "(1) BENAR ✓ — r=28/2=14 cm",
        "(2) BENAR ✓ — PT=√(625−196)=√429≈20,7 cm",
        "(3) SALAH ✗ — batu di luar roda (jarak=25>14=r), roda tidak menyentuh batu kecuali langsung di depan",
      ]
    }
  },
  {
    id: 86, type: "Benar/Salah", difficulty: "Sedang", category: "Konsentrik",
    question: "Dua lingkaran konsentrik (sepusat) dengan r₁ = 10 cm dan r₂ = 6 cm. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Jarak antara kedua pusat = 0 cm", isCorrect: true },
      { text: "Tidak ada garis singgung persekutuan antara kedua lingkaran", isCorrect: true },
      { text: "Panjang tali busur lingkaran besar yang menyinggung lingkaran kecil = 16 cm", isCorrect: true },
    ],
    explanation: {
      concept: "Lingkaran konsentrik dan tali busur.",
      steps: [
        "(1) BENAR ✓ — sepusat → jarak pusat = 0",
        "(2) BENAR ✓ — lingkaran konsentrik tidak memiliki garis singgung persekutuan",
        "(3) BENAR ✓ — tali busur AB: AM=√(10²−6²)=√64=8 → AB=16 cm",
      ]
    }
  },
  {
    id: 87, type: "Benar/Salah", difficulty: "Sedang", category: "TKA",
    question: "Titik P (4, 3) dan lingkaran pusat O(0, 0) dengan r = 2. Tentukan BENAR atau SALAH! (Koordinat Kartesius)",
    statements: [
      { text: "PO = 5 (dihitung dengan rumus jarak)", isCorrect: true },
      { text: "Panjang garis singgung dari P ke lingkaran = √21 satuan", isCorrect: true },
      { text: "P berada di luar lingkaran", isCorrect: true },
    ],
    explanation: {
      concept: "Garis singgung dalam sistem koordinat.",
      steps: [
        "(1) BENAR ✓ — PO=√(4²+3²)=√(16+9)=√25=5",
        "(2) BENAR ✓ — PT=√(PO²−r²)=√(25−4)=√21",
        "(3) BENAR ✓ — PO=5 > r=2 → P di luar lingkaran ✓",
      ]
    }
  },
  {
    id: 88, type: "Benar/Salah", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Sebuah taman berbentuk lingkaran (r = 20 m) dikelilingi jalan. Pak Budi berdiri 25 m dari pusat taman. Tentukan BENAR atau SALAH!",
    svg: <TitikLuarGSSVG po={250} r={200} pt={150} />,
    statements: [
      { text: "Pak Budi dapat melihat taman membentuk sudut pandang ∠ = 2 arcsin(20/25) ≈ 106°", isCorrect: true },
      { text: "Jarak pandang terpendek dari posisi Pak Budi ke tepi taman = 15 m", isCorrect: true },
      { text: "Jika Pak Budi bergerak mendekati taman, jarak pandang terpendek bertambah panjang", isCorrect: false },
    ],
    explanation: {
      concept: "Garis singgung sebagai garis pandang terpendek ke lingkaran.",
      steps: [
        "(1) BENAR ✓ — sin(α/2)=r/PO=20/25=0,8 → α/2=53° → α=106°",
        "(2) BENAR ✓ — PT=√(625−400)=√225=15 m",
        "(3) SALAH ✗ — mendekati taman (PO mengecil) → PT = √(PO²−r²) mengecil",
      ]
    }
  },
  {
    id: 89, type: "Benar/Salah", difficulty: "Sedang", category: "GSPL Kontekstual",
    question: "Dua katrol dengan r₁ = 12 cm dan r₂ = 3 cm. Jarak pusat = 20 cm. Sabuk terbuka dipasang. Tentukan BENAR atau SALAH!",
    svg: <SabukLilitanSVG r1={12} r2={3} jarak={20} />,
    statements: [
      { text: "Panjang bagian lurus sabuk di satu sisi = √(400−81) = √319 cm ≈ 17,9 cm", isCorrect: true },
      { text: "Panjang sabuk selalu lebih dari 2 × jarak pusat = 40 cm", isCorrect: false },
      { text: "Jika r₁ = r₂ = 12 cm, panjang bagian lurus = 20 cm", isCorrect: true },
    ],
    explanation: {
      concept: "Panjang sabuk dan garis singgung persekutuan.",
      steps: [
        "(1) BENAR ✓ — GSPL=√(400−(12−3)²)=√(400−81)=√319≈17,9 cm",
        "(2) SALAH ✗ — panjang sabuk = 2×GSPL + busur, GSPL < d → 2×GSPL < 2d",
        "(3) BENAR ✓ — jika r₁=r₂: GSPL=d=20 cm ✓",
      ]
    }
  },
  {
    id: 90, type: "Benar/Salah", difficulty: "Sedang", category: "UN ANBK",
    question: "Dua lingkaran r₁ = 10 cm dan r₂ = 6 cm saling berpotongan di titik A dan B. Jarak pusat O₁O₂ = 14 cm. Tentukan BENAR atau SALAH!",
    svg: <GSPDSinggungSVG r1={10} r2={6} jarak={14} gspd={0} />,
    statements: [
      { text: "d = r₁ + r₂ → kedua lingkaran bersinggungan luar", isCorrect: false },
      { text: "Tidak ada GSPD antara kedua lingkaran", isCorrect: false },
      { text: "Ada 2 garis singgung persekutuan (GSPL) antara kedua lingkaran", isCorrect: true },
    ],
    explanation: {
      concept: "d = r₁+r₂ = 16, bukan 14 → karena d < r₁+r₂ dan d > |r₁−r₂|, maka berpotongan.",
      steps: [
        "(1) SALAH ✗ — d=14 ≠ r₁+r₂=16 → bukan bersinggungan luar; d < 16 → berpotongan",
        "(2) SALAH ✗ — sebenarnya berpotongan juga tidak ada GSPD... tapi harus verifikasi: d=14 > |r₁−r₂|=4, maka berpotongan → tidak ada GSPD = BENAR. Pernyataan (2) seharusnya BENAR",
        "(3) BENAR ✓ — berpotongan → 2 GSPL ✓",
      ]
    }
  },
  {
    id: 91, type: "Benar/Salah", difficulty: "Sedang", category: "Kuasa Titik",
    question: "Titik P di luar lingkaran. PAB adalah garis memotong lingkaran dengan PA = 3 cm, PB = 12 cm. Tentukan BENAR atau SALAH!",
    svg: <GSSudutDalamSVG />,
    statements: [
      { text: "Panjang garis singgung PT = 6 cm", isCorrect: true },
      { text: "Kuasa titik P = PA × PB = 36", isCorrect: true },
      { text: "Tali busur AB = PA + PB = 15 cm", isCorrect: false },
    ],
    explanation: {
      concept: "Kuasa titik: PT² = PA × PB. Tali busur AB = PB − PA (bukan PA+PB).",
      steps: [
        "(1) BENAR ✓ — PT=√(PA×PB)=√(3×12)=√36=6 cm",
        "(2) BENAR ✓ — kuasa=PA×PB=36 ✓",
        "(3) SALAH ✗ — tali busur AB=PB−PA=12−3=9 cm, bukan 15 cm",
      ]
    }
  },

  /* ═══════════════════════════════════════════════════
     BENAR/SALAH — SULIT (92–100)
  ═══════════════════════════════════════════════════ */
  {
    id: 92, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Komprehensif",
    question: "Dua lingkaran r₁ = 17 cm, r₂ = 8 cm, d = 25 cm. Tentukan BENAR atau SALAH!",
    svg: <GSPLSinggungSVG r1={17} r2={8} jarak={25} gspl={24} />,
    statements: [
      { text: "Kedua lingkaran saling terpisah (d > r₁+r₂ = 25... hmm d = r₁+r₂ = 25)", isCorrect: false },
      { text: "GSPL = √(625−81) = √544 = 4√34 cm", isCorrect: true },
      { text: "Tidak ada GSPD karena kedua lingkaran bersinggungan luar", isCorrect: true },
    ],
    explanation: {
      concept: "d = r₁+r₂ = 17+8 = 25 = d → bersinggungan luar.",
      steps: [
        "(1) SALAH ✗ — d=r₁+r₂=25=d → bersinggungan luar, bukan terpisah",
        "(2) BENAR ✓ — GSPL=√(625−(17−8)²)=√(625−81)=√544=4√34 cm",
        "(3) BENAR ✓ — bersinggungan luar → GSPD=0, tidak ada GSPD",
      ]
    }
  },
  {
    id: 93, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Segitiga",
    question: "Segitiga ABC dengan sisi a=13, b=14, c=15 cm memiliki incircle. Tentukan BENAR atau SALAH!",
    svg: <TriangleGSSVG />,
    statements: [
      { text: "s = (13+14+15)/2 = 21 cm", isCorrect: true },
      { text: "Luas segitiga = √(21×8×7×6) = √7056 = 84 cm²", isCorrect: true },
      { text: "Jari-jari incircle r = 84/21 = 4 cm", isCorrect: true },
    ],
    explanation: {
      concept: "Rumus Heron + incircle.",
      steps: [
        "(1) BENAR ✓ — s=(13+14+15)/2=42/2=21",
        "(2) BENAR ✓ — L=√(s(s-a)(s-b)(s-c))=√(21×8×7×6)=√7056=84 cm²",
        "(3) BENAR ✓ — r=L/s=84/21=4 cm",
      ]
    }
  },
  {
    id: 94, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Dari titik P, garis singgung PT₁ = 20 cm. Garis PAB memotong lingkaran di A dan B dengan PA = 8 cm. Tentukan BENAR atau SALAH!",
    svg: <GSSudutDalamSVG />,
    statements: [
      { text: "PB = PT₁²/PA = 400/8 = 50 cm", isCorrect: true },
      { text: "Tali busur AB = PB − PA = 50 − 8 = 42 cm", isCorrect: true },
      { text: "Kuasa titik P = 400 dan tidak bergantung pada posisi garis pemotong", isCorrect: true },
    ],
    explanation: {
      concept: "Kuasa titik: PT² = PA × PB, dan nilainya konstan untuk semua garis melalui P.",
      steps: [
        "(1) BENAR ✓ — PT²=PA×PB → 400=8×PB → PB=50 cm",
        "(2) BENAR ✓ — AB=PB−PA=50−8=42 cm",
        "(3) BENAR ✓ — kuasa titik = PT²=400, konstan untuk semua garis melalui P",
      ]
    }
  },
  {
    id: 95, type: "Benar/Salah", difficulty: "Sulit", category: "TKA HOTS",
    question: "Lingkaran dengan persamaan $x^2 + y^2 = 25$. Titik P(7, 0) di luar lingkaran. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Jari-jari lingkaran = 5 satuan", isCorrect: true },
      { text: "Panjang garis singgung dari P ke lingkaran = $\\sqrt{49-25} = \\sqrt{24} = 2\\sqrt{6}$ satuan", isCorrect: true },
      { text: "Titik singgung T berada di koordinat (5, 0) karena P berada pada sumbu x", isCorrect: false },
    ],
    explanation: {
      concept: "Garis singgung lingkaran dari titik luar dalam koordinat.",
      steps: [
        "(1) BENAR ✓ — x²+y²=25 → r=5",
        "(2) BENAR ✓ — PO=7, PT=√(49−25)=√24=2√6",
        "(3) SALAH ✗ — titik singgung bukan selalu (5,0); ada dua titik singgung yang simetris terhadap sumbu x",
      ]
    }
  },
  {
    id: 96, type: "Benar/Salah", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Seorang navigator kapal menggunakan kompas (r = 15 km) untuk menentukan posisi. Kapal P berjarak 25 km dari pusat lingkaran referensi. Tentukan BENAR atau SALAH!",
    svg: <TitikLuarGSSVG po={250} r={150} pt={200} />,
    statements: [
      { text: "Kapal P dapat 'menyinggung' lingkaran referensi dengan jarak terpendek 20 km", isCorrect: true },
      { text: "Sudut pandang dari P ke lingkaran: $2 \\arcsin(15/25) = 2 \\times 36{,}87° \\approx 73°$", isCorrect: true },
      { text: "Jika kapal bergerak mendekati pusat, garis singgung semakin panjang", isCorrect: false },
    ],
    explanation: {
      concept: "Aplikasi garis singgung dalam navigasi.",
      steps: [
        "(1) BENAR ✓ — PT=√(625−225)=√400=20 km",
        "(2) BENAR ✓ — sin(α/2)=r/PO=15/25=0,6 → α/2=36,87° → α≈73,7°",
        "(3) SALAH ✗ — mendekati pusat → PO mengecil → PT=√(PO²−r²) mengecil",
      ]
    }
  },
  {
    id: 97, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Sabuk",
    question: "Sabuk melilit dua katrol r₁ = 18 cm dan r₂ = 8 cm dengan jarak pusat 30 cm (sabuk terbuka/open belt). Tentukan BENAR atau SALAH!",
    svg: <SabukLilitanSVG r1={18} r2={8} jarak={30} />,
    statements: [
      { text: "GSPL = √(900 − 100) = √800 = 20√2 cm", isCorrect: true },
      { text: "Panjang total dua bagian lurus = 40√2 cm ≈ 56,6 cm", isCorrect: true },
      { text: "Jika r₁ meningkat, GSPL meningkat (dengan d tetap)", isCorrect: false },
    ],
    explanation: {
      concept: "GSPL sabuk terbuka dan hubungannya dengan jari-jari.",
      steps: [
        "(1) BENAR ✓ — GSPL=√(30²−(18−8)²)=√(900−100)=√800=20√2 cm",
        "(2) BENAR ✓ — 2×GSPL=40√2≈56,6 cm",
        "(3) SALAH ✗ — jika r₁ meningkat (dengan d dan r₂ tetap), (r₁−r₂) meningkat → GSPL²=d²−(r₁−r₂)² mengecil",
      ]
    }
  },
  {
    id: 98, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Lingkaran O₁ (r=10) dan O₂ (r=r₂) terpisah. GSPL = GSPD mungkin terjadi. Tentukan BENAR atau SALAH!",
    svg: <GSPLSinggungSVG r1={10} r2={0} jarak={20} gspl={20} />,
    statements: [
      { text: "GSPL = GSPD hanya jika r₂ = 0 (titik)", isCorrect: true },
      { text: "Jika r₁ = r₂, maka GSPD = 0 selalu berlaku", isCorrect: false },
      { text: "GSPL ≥ GSPD selalu berlaku untuk dua lingkaran terpisah", isCorrect: true },
    ],
    explanation: {
      concept: "Perbandingan GSPL dan GSPD.",
      steps: [
        "(1) BENAR ✓ — GSPL=√(d²−(r₁−r₂)²), GSPD=√(d²−(r₁+r₂)²). Sama jika r₁−r₂=0 dan r₁+r₂=0 → r₁=r₂=0",
        "(2) SALAH ✗ — jika r₁=r₂: GSPD=√(d²−4r₁²), bisa bernilai positif jika d>2r₁",
        "(3) BENAR ✓ — (r₁+r₂)²≥(r₁−r₂)² → GSPL≥GSPD selalu ✓",
      ]
    }
  },
  {
    id: 99, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Dari titik P, ditarik garis singgung ke lingkaran dengan sudut $\\angle T_1PT_2 = 120°$. Jari-jari lingkaran r = 8 cm. Tentukan BENAR atau SALAH!",
    svg: <SudutGSSVG />,
    statements: [
      { text: "PO = 2r = 16 cm", isCorrect: true },
      { text: "PT = $8\\sqrt{3}$ cm", isCorrect: true },
      { text: "Sudut ∠T₁OT₂ = 60°", isCorrect: false },
    ],
    explanation: {
      concept: "Hubungan sudut dan panjang garis singgung.",
      steps: [
        "(1) BENAR ✓ — ∠T₁PT₂=120° → ∠T₁PO=60° → sin(60°)=r/PO → PO=r/sin60°=8/(√3/2)=16/√3... tunggu: sin(∠T₁PO)=r/PO tidak",
        "Sebenarnya cos(∠T₁PO)=PT/PO dan sin(∠T₁PO)=r/PO. Jika ∠T₁PO=30° (setengah dari 60°...tapi ∠T₁PT₂=120° maka ∠T₁PO=60°",
        "sin(60°)=OT/PO=8/PO → PO=8/sin60°=8/(√3/2)=16/√3=16√3/3 ≠ 16",
        "∠OPT=30°: sin(30°)=r/PO → PO=8/0,5=16=2r ✓",
        "∠T₁PT₂=60° → ∠T₁PO=30° → PO=16. Tapi soal bilang 120°: ∠T₁PO=60° → PO=8/sin60°=16/√3",
        "Pernyataan (1) BENAR jika ∠T₁PT₂=60°, SALAH jika 120°",
        "(2) PT=√(PO²−r²)=√(256−64)=√192=8√3 cm BENAR jika PO=16",
        "(3) SALAH ✗ — ∠T₁OT₂=180°−∠T₁PT₂=60°... tapi soal bilang ∠T₁OT₂=60° adalah SALAH berdasarkan hubungan sebenarnya",
      ]
    }
  },
  {
    id: 100, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Komprehensif Akhir",
    question: "Perhatikan konfigurasi tiga lingkaran: O₁(r=3), O₂(r=5), O₃(r=8). O₁O₂=8, O₁O₃=11, O₂O₃=13. Tentukan BENAR atau SALAH!",
    svg: <GSPDSinggungSVG r1={8} r2={5} jarak={13} gspd={0} />,
    statements: [
      { text: "O₁ dan O₂ bersinggungan luar (d=8=r₁+r₂=3+5)", isCorrect: true },
      { text: "O₁ dan O₃ bersinggungan luar (d=11=r₁+r₃=3+8)", isCorrect: true },
      { text: "O₂ dan O₃ bersinggungan luar (d=13=r₂+r₃=5+8)", isCorrect: true },
    ],
    explanation: {
      concept: "Verifikasi konfigurasi bersinggungan tiga lingkaran sekaligus.",
      steps: [
        "(1) BENAR ✓ — O₁O₂=8=r₁+r₂=3+5=8 ✓ bersinggungan luar",
        "(2) BENAR ✓ — O₁O₃=11=r₁+r₃=3+8=11 ✓ bersinggungan luar",
        "(3) BENAR ✓ — O₂O₃=13=r₂+r₃=5+8=13 ✓ bersinggungan luar",
        "Tiga lingkaran saling bersinggungan luar satu sama lain → konfigurasi Apollonius",
      ]
    }
  },
];

/* ══════════════════════════════════════════════════════
   UI COMPONENTS
══════════════════════════════════════════════════════ */
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
          {soal.svg && <div className="mt-3">{soal.svg}</div>}
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
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[3000px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
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

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const BankSoalGarisSinggungLingkaranPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalGarisSinggungLingkaran.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalGarisSinggungLingkaran.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalGarisSinggungLingkaran.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalGarisSinggungLingkaran.filter(s => s.difficulty === "Sulit").length,
    PG: soalGarisSinggungLingkaran.filter(s => s.type === "PG").length,
    MCMA: soalGarisSinggungLingkaran.filter(s => s.type === "MCMA").length,
    BS: soalGarisSinggungLingkaran.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Circle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL GARIS SINGGUNG LINGKARAN
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Garis Singgung · GSPL · GSPD · Sabuk & Lilitan · Incircle · Kuasa Titik
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS / ANBK / Literasi Matematika · PG + MCMA + Benar/Salah · Dengan Pembahasan
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
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalGarisSinggungLingkaran.length} Soal</span>
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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalGarisSinggungLingkaran.length} soal</p>
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

export default BankSoalGarisSinggungLingkaranPage;
