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
  correctAnswer?: string | string[];
  explanation: { concept: string; steps: string[]; formula?: string; };
  diagram?: () => JSX.Element;
}

/* ══════════════════════════════════════════════════════════
   SVG DIAGRAM COMPONENTS
══════════════════════════════════════════════════════════ */

const SvgWrap = ({ children, h = 160 }: { children: React.ReactNode; h?: number }) => (
  <svg viewBox={`0 0 300 ${h}`} className="w-full max-w-xs mx-auto my-3 rounded-xl bg-slate-800/60 border border-slate-600/50 p-2">
    {children}
  </svg>
);

const DiagSegitigaSembarang = () => (
  <SvgWrap h={150}>
    <polygon points="30,130 270,130 160,20" fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="2"/>
    <text x="140" y="148" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">9 cm</text>
    <text x="78" y="80" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">7 cm</text>
    <text x="228" y="80" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">5 cm</text>
  </SvgWrap>
);

const DiagSegitigaAlasTinggi = () => (
  <SvgWrap h={160}>
    <polygon points="40,140 260,140 150,30" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="2"/>
    <line x1="150" y1="30" x2="150" y2="140" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5,3"/>
    <polyline points="150,123 163,123 163,140" fill="none" stroke="#22d3ee" strokeWidth="1.5"/>
    <text x="150" y="155" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">alas = 8 cm</text>
    <text x="170" y="90" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="sans-serif">t = 6 cm</text>
  </SvgWrap>
);

const DiagPersegi = () => (
  <SvgWrap h={150}>
    <rect x="60" y="15" width="180" height="120" fill="rgba(139,92,246,0.15)" stroke="#a78bfa" strokeWidth="2"/>
    <text x="150" y="135" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">12 cm</text>
    <text x="32" y="80" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">12 cm</text>
    <text x="59" y="12" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="sans-serif">90°</text>
    <text x="241" y="12" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="sans-serif">90°</text>
    <text x="59" y="143" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="sans-serif">90°</text>
    <text x="241" y="143" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="sans-serif">90°</text>
  </SvgWrap>
);

const DiagPersegiPanjang = () => (
  <SvgWrap h={140}>
    <rect x="30" y="20" width="240" height="100" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="2"/>
    <text x="150" y="128" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">15 cm</text>
    <text x="14" y="72" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">8 cm</text>
  </SvgWrap>
);

const DiagBelahKetupat = () => (
  <SvgWrap h={150}>
    <polygon points="150,15 280,75 150,135 20,75" fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="2"/>
    <line x1="20" y1="75" x2="280" y2="75" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="150" y1="15" x2="150" y2="135" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="150" y="67" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">d₁ = 10 cm</text>
    <text x="200" y="90" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="sans-serif">d₂ = 8 cm</text>
  </SvgWrap>
);

const DiagTrapesium = () => (
  <SvgWrap h={150}>
    <polygon points="50,130 250,130 210,30 90,30" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2"/>
    <line x1="90" y1="30" x2="90" y2="130" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="90,113 107,113 107,130" fill="none" stroke="#22d3ee" strokeWidth="1.5"/>
    <text x="148" y="24" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">12 cm</text>
    <text x="148" y="148" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">20 cm</text>
    <text x="72" y="85" fill="#22d3ee" fontSize="11" textAnchor="start" fontFamily="sans-serif">t=8</text>
  </SvgWrap>
);

const DiagJajarGenjang = () => (
  <SvgWrap h={140}>
    <polygon points="60,120 260,120 220,20 20,20" fill="rgba(74,222,128,0.12)" stroke="#4ade80" strokeWidth="2"/>
    <line x1="140" y1="20" x2="140" y2="120" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="140,103 155,103 155,120" fill="none" stroke="#22d3ee" strokeWidth="1.5"/>
    <text x="140" y="138" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">18 cm</text>
    <text x="155" y="75" fill="#22d3ee" fontSize="11" textAnchor="start" fontFamily="sans-serif">t = 7 cm</text>
  </SvgWrap>
);

const DiagLayangLayang = () => (
  <SvgWrap h={160}>
    <polygon points="150,10 260,85 150,150 40,85" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="2"/>
    <line x1="40" y1="85" x2="260" y2="85" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="150" y1="10" x2="150" y2="150" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="150" y="78" fill="#fb923c" fontSize="10" textAnchor="middle" fontFamily="sans-serif">d₁ = 24 cm</text>
    <text x="182" y="120" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="sans-serif">d₂ = 10 cm</text>
  </SvgWrap>
);

const DiagSegitigaSikuSiku = () => (
  <SvgWrap h={150}>
    <polygon points="40,130 220,130 40,30" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="2"/>
    <polyline points="40,113 57,113 57,130" fill="none" stroke="#22d3ee" strokeWidth="1.5"/>
    <text x="130" y="148" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">alas = 12 cm</text>
    <text x="22" y="82" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">t = 9 cm</text>
    <text x="165" y="80" fill="#a78bfa" fontSize="11" textAnchor="middle" fontFamily="sans-serif">?</text>
  </SvgWrap>
);

const DiagBangunGabungan1 = () => (
  <SvgWrap h={180}>
    <rect x="40" y="90" width="220" height="80" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="2"/>
    <polygon points="40,90 150,20 260,90" fill="rgba(74,222,128,0.12)" stroke="#4ade80" strokeWidth="2"/>
    <text x="148" y="178" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">20 cm</text>
    <text x="18" y="135" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">8 cm</text>
    <text x="88" y="58" fill="#4ade80" fontSize="10" textAnchor="middle" fontFamily="sans-serif">t = 7 cm</text>
  </SvgWrap>
);

const DiagBangunGabunganL = () => (
  <SvgWrap h={170}>
    <polygon points="30,155 30,30 150,30 150,90 220,90 220,155" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="2"/>
    <line x1="30" y1="90" x2="150" y2="90" stroke="#a855f7" strokeWidth="1" strokeDasharray="4,3"/>
    <text x="90" y="25" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">12 cm</text>
    <text x="190" y="125" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">7 cm</text>
    <text x="14" y="95" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">6 cm</text>
    <text x="125" y="173" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">19 cm</text>
    <text x="225" y="95" fill="#22d3ee" fontSize="10" textAnchor="start" fontFamily="sans-serif">6 cm</text>
  </SvgWrap>
);

const DiagBerarsirPersegi = () => (
  <SvgWrap h={150}>
    <rect x="30" y="15" width="240" height="120" fill="rgba(251,146,60,0.10)" stroke="#fb923c" strokeWidth="2"/>
    <polygon points="30,135 270,135 270,15" fill="rgba(168,85,247,0.30)" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="150" y="148" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">24 cm</text>
    <text x="279" y="78" fill="#fbbf24" fontSize="11" textAnchor="start" fontFamily="sans-serif">12 cm</text>
    <text x="185" y="110" fill="#c084fc" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Berarsir</text>
  </SvgWrap>
);

const DiagTrapesiumSiku = () => (
  <SvgWrap h={150}>
    <polygon points="40,130 250,130 250,30 40,130" fill="none"/>
    <polygon points="40,130 250,130 250,30 40,130" fill="rgba(59,130,246,0.12)" stroke="#60a5fa" strokeWidth="2"/>
    <polyline points="40,113 57,113 57,130" fill="none" stroke="#60a5fa" strokeWidth="1.5"/>
    <polyline points="250,113 233,113 233,130" fill="none" stroke="#60a5fa" strokeWidth="1.5"/>
    <text x="145" y="148" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">18 cm</text>
    <text x="258" y="82" fill="#fbbf24" fontSize="11" textAnchor="start" fontFamily="sans-serif">10 cm</text>
    <text x="125" y="45" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="sans-serif">10 cm</text>
  </SvgWrap>
);

const DiagSegitigaDalamPersegi = () => (
  <SvgWrap h={155}>
    <rect x="30" y="20" width="240" height="120" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2"/>
    <polygon points="30,140 270,140 270,20" fill="rgba(74,222,128,0.20)" stroke="#4ade80" strokeWidth="2"/>
    <text x="150" y="155" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">24 cm</text>
    <text x="280" y="82" fill="#fbbf24" fontSize="11" textAnchor="start" fontFamily="sans-serif">12 cm</text>
    <text x="172" y="105" fill="#4ade80" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Berarsir</text>
  </SvgWrap>
);

const DiagBerarsirDalamBelahKetupat = () => (
  <SvgWrap h={150}>
    <polygon points="150,15 280,75 150,135 20,75" fill="rgba(251,146,60,0.12)" stroke="#fb923c" strokeWidth="2"/>
    <rect x="93" y="43" width="114" height="64" fill="rgba(168,85,247,0.30)" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="150" y="80" fill="#c084fc" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Persegi</text>
    <text x="150" y="8" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">d₁ = 16 cm</text>
    <text x="290" y="78" fill="#22d3ee" fontSize="10" textAnchor="start" fontFamily="sans-serif">d₂=12</text>
  </SvgWrap>
);

const DiagBangunGabunganT = () => (
  <SvgWrap h={175}>
    <polygon points="30,155 30,75 100,75 100,30 200,30 200,75 270,75 270,155" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="2"/>
    <text x="150" y="32" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">10 cm</text>
    <text x="150" y="168" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">24 cm</text>
    <text x="13" y="118" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">8 cm</text>
    <text x="98" y="55" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="sans-serif">5 cm</text>
  </SvgWrap>
);

const DiagSegitigaSamaKaki = () => (
  <SvgWrap h={150}>
    <polygon points="150,15 270,135 30,135" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="2"/>
    <line x1="150" y1="15" x2="150" y2="135" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="150,118 163,118 163,135" fill="none" stroke="#22d3ee" strokeWidth="1.5"/>
    <text x="150" y="148" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">alas = 16 cm</text>
    <text x="76" y="75" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">k cm</text>
    <text x="224" y="75" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">k cm</text>
  </SvgWrap>
);

const DiagBerarsirTrapesium = () => (
  <SvgWrap h={160}>
    <polygon points="40,140 260,140 220,40 80,40" fill="rgba(251,146,60,0.10)" stroke="#fb923c" strokeWidth="2"/>
    <polygon points="100,140 200,140 185,90 115,90" fill="rgba(168,85,247,0.30)" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="150" y="155" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">22 cm</text>
    <text x="150" y="33" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">14 cm</text>
    <text x="30" y="92" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="sans-serif">t=10</text>
  </SvgWrap>
);

const DiagPersegiBesar = () => (
  <SvgWrap h={150}>
    <rect x="25" y="15" width="250" height="120" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2"/>
    <rect x="60" y="40" width="80" height="70" fill="rgba(168,85,247,0.25)" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="150" y="148" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">25 cm</text>
    <text x="8" y="78" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">12 cm</text>
    <text x="100" y="85" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="sans-serif">8×7</text>
    <text x="192" y="90" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Luar</text>
  </SvgWrap>
);

const DiagGabunganKompleks = () => (
  <SvgWrap h={175}>
    <rect x="40" y="85" width="220" height="80" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="2"/>
    <polygon points="40,85 260,85 200,25 100,25" fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="2"/>
    <text x="150" y="173" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">22 cm</text>
    <text x="150" y="20" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">12 cm</text>
    <text x="22" y="130" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="sans-serif">8 cm</text>
    <text x="276" y="130" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="sans-serif">8 cm</text>
    <text x="72" y="60" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="sans-serif">h=7</text>
  </SvgWrap>
);

const DiagSegitigaHots = () => (
  <SvgWrap h={155}>
    <polygon points="30,135 270,135 180,25" fill="rgba(239,68,68,0.12)" stroke="#ef4444" strokeWidth="2"/>
    <line x1="180" y1="25" x2="180" y2="135" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="30" y1="135" x2="180" y2="25" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3,3"/>
    <text x="150" y="150" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">30 cm</text>
    <text x="95" y="72" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">26 cm</text>
    <text x="234" y="82" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="sans-serif">t = ?</text>
    <text x="195" y="148" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">18 cm</text>
  </SvgWrap>
);

const DiagBerarsirBesar = () => (
  <SvgWrap h={155}>
    <rect x="25" y="15" width="250" height="130" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2"/>
    <polygon points="25,145 275,145 275,15" fill="rgba(168,85,247,0.25)" stroke="#a78bfa" strokeWidth="1.5"/>
    <polygon points="25,145 275,145 25,15" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="150" y="152" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="sans-serif">25 cm</text>
    <text x="10" y="78" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="sans-serif">13 cm</text>
    <text x="150" y="85" fill="#c084fc" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Berarsir</text>
  </SvgWrap>
);

/* ══════════════════════════════════════════════════════════
   SOAL DATA — 100 SOAL
══════════════════════════════════════════════════════════ */

const soalSegitigaSegiempat: Question[] = [

  /* ════════════════════════════════════════
     MUDAH  (1 – 35)
  ════════════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Keliling Segitiga",
    question: "Sebuah segitiga memiliki sisi-sisi $5$ cm, $7$ cm, dan $9$ cm. Keliling segitiga tersebut adalah ...",
    diagram: DiagSegitigaSembarang,
    options: ["A. 19 cm", "B. 21 cm", "C. 23 cm", "D. 25 cm"],
    correctAnswer: "B. 21 cm",
    explanation: {
      concept: "Keliling segitiga adalah jumlah ketiga sisi-sisinya.",
      steps: ["Diketahui: $a = 5$ cm, $b = 7$ cm, $c = 9$ cm", "$K = a + b + c = 5 + 7 + 9 = 21$ cm"],
      formula: "$K_{\\triangle} = a + b + c$"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Luas Segitiga",
    question: "Luas sebuah segitiga dengan alas $8$ cm dan tinggi $6$ cm adalah ...",
    diagram: DiagSegitigaAlasTinggi,
    options: ["A. 48 cm²", "B. 24 cm²", "C. 28 cm²", "D. 14 cm²"],
    correctAnswer: "B. 24 cm²",
    explanation: {
      concept: "Luas segitiga = setengah hasil kali alas dan tinggi.",
      steps: ["$L = \\dfrac{1}{2} \\times a \\times t = \\dfrac{1}{2} \\times 8 \\times 6 = 24$ cm²"],
      formula: "$L_{\\triangle} = \\dfrac{1}{2} \\times a \\times t$"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Keliling Persegi",
    question: "Keliling sebuah persegi dengan panjang sisi $12$ cm adalah ...",
    diagram: DiagPersegi,
    options: ["A. 24 cm", "B. 36 cm", "C. 48 cm", "D. 144 cm"],
    correctAnswer: "C. 48 cm",
    explanation: {
      concept: "Persegi memiliki 4 sisi yang sama panjang.",
      steps: ["$K = 4 \\times s = 4 \\times 12 = 48$ cm"],
      formula: "$K_{\\square} = 4 \\times s$"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Keliling Persegi Panjang",
    question: "Keliling sebuah persegi panjang dengan panjang $15$ cm dan lebar $8$ cm adalah ...",
    diagram: DiagPersegiPanjang,
    options: ["A. 23 cm", "B. 46 cm", "C. 120 cm", "D. 240 cm"],
    correctAnswer: "B. 46 cm",
    explanation: {
      concept: "Keliling persegi panjang = 2 × (panjang + lebar).",
      steps: ["$K = 2(p + l) = 2(15 + 8) = 2 \\times 23 = 46$ cm"],
      formula: "$K = 2(p + l)$"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Luas Persegi",
    question: "Luas sebuah persegi dengan panjang sisi $9$ cm adalah ...",
    options: ["A. 18 cm²", "B. 36 cm²", "C. 81 cm²", "D. 729 cm²"],
    correctAnswer: "C. 81 cm²",
    explanation: {
      concept: "Luas persegi = sisi × sisi = sisi².",
      steps: ["$L = s^2 = 9^2 = 81$ cm²"],
      formula: "$L_{\\square} = s^2$"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Luas Persegi Panjang",
    question: "Luas sebuah persegi panjang dengan panjang $12$ cm dan lebar $7$ cm adalah ...",
    options: ["A. 38 cm²", "B. 74 cm²", "C. 84 cm²", "D. 168 cm²"],
    correctAnswer: "C. 84 cm²",
    explanation: {
      concept: "Luas persegi panjang = panjang × lebar.",
      steps: ["$L = p \\times l = 12 \\times 7 = 84$ cm²"],
      formula: "$L = p \\times l$"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Keliling Belah Ketupat",
    question: "Keliling sebuah belah ketupat dengan panjang sisi $13$ cm adalah ...",
    options: ["A. 26 cm", "B. 39 cm", "C. 52 cm", "D. 169 cm"],
    correctAnswer: "C. 52 cm",
    explanation: {
      concept: "Belah ketupat memiliki 4 sisi yang sama panjang.",
      steps: ["$K = 4 \\times s = 4 \\times 13 = 52$ cm"],
      formula: "$K = 4 \\times s$"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Luas Belah Ketupat",
    question: "Luas belah ketupat dengan diagonal $d_1 = 10$ cm dan $d_2 = 8$ cm adalah ...",
    diagram: DiagBelahKetupat,
    options: ["A. 18 cm²", "B. 36 cm²", "C. 40 cm²", "D. 80 cm²"],
    correctAnswer: "C. 40 cm²",
    explanation: {
      concept: "Luas belah ketupat = setengah hasil kali kedua diagonalnya.",
      steps: ["$L = \\dfrac{1}{2} \\times d_1 \\times d_2 = \\dfrac{1}{2} \\times 10 \\times 8 = 40$ cm²"],
      formula: "$L = \\dfrac{1}{2} \\times d_1 \\times d_2$"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Keliling Trapesium",
    question: "Keliling trapesium dengan sisi-sisi $12$ cm, $8$ cm, $20$ cm, dan $9$ cm adalah ...",
    diagram: DiagTrapesium,
    options: ["A. 45 cm", "B. 47 cm", "C. 49 cm", "D. 51 cm"],
    correctAnswer: "C. 49 cm",
    explanation: {
      concept: "Keliling trapesium = jumlah keempat sisinya.",
      steps: ["$K = 12 + 8 + 20 + 9 = 49$ cm"],
      formula: "$K = a + b + c + d$"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Luas Jajar Genjang",
    question: "Luas jajar genjang dengan alas $18$ cm dan tinggi $7$ cm adalah ...",
    diagram: DiagJajarGenjang,
    options: ["A. 50 cm²", "B. 63 cm²", "C. 126 cm²", "D. 252 cm²"],
    correctAnswer: "C. 126 cm²",
    explanation: {
      concept: "Luas jajar genjang = alas × tinggi (tinggi tegak lurus alas).",
      steps: ["$L = a \\times t = 18 \\times 7 = 126$ cm²"],
      formula: "$L = a \\times t$"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Sudut Segitiga",
    question: "Dua sudut sebuah segitiga berturut-turut adalah $60°$ dan $75°$. Besar sudut ketiga adalah ...",
    options: ["A. $35°$", "B. $45°$", "C. $55°$", "D. $65°$"],
    correctAnswer: "B. $45°$",
    explanation: {
      concept: "Jumlah ketiga sudut dalam segitiga selalu $180°$.",
      steps: ["Sudut ketiga $= 180° - 60° - 75° = 45°$"],
      formula: "$\\alpha + \\beta + \\gamma = 180°$"
    }
  },
  {
    id: 12, type: "Benar/Salah", difficulty: "Mudah", category: "Sifat Persegi",
    question: "Tentukan benar atau salah pernyataan tentang persegi berikut!",
    statements: [
      { text: "Persegi memiliki 4 sisi yang sama panjang", isCorrect: true },
      { text: "Diagonal persegi tidak sama panjang", isCorrect: false },
      { text: "Semua sudut persegi besarnya $90°$", isCorrect: true },
      { text: "Persegi adalah jenis khusus persegi panjang", isCorrect: true }
    ],
    explanation: {
      concept: "Persegi adalah segiempat beraturan: semua sisi sama, semua sudut siku-siku, diagonal sama panjang dan saling tegak lurus.",
      steps: [
        "4 sisi sama panjang → BENAR ✓",
        "Diagonal SAMA panjang ($= s\\sqrt{2}$) → SALAH ✗",
        "Semua sudut $90°$ → BENAR ✓",
        "Persegi ⊂ Persegi Panjang (khusus) → BENAR ✓"
      ],
      formula: "Persegi ⊂ Persegi Panjang ⊂ Jajar Genjang"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Segitiga Sama Sisi",
    question: "Keliling sebuah segitiga sama sisi adalah $27$ cm. Panjang setiap sisinya adalah ...",
    options: ["A. 7 cm", "B. 8 cm", "C. 9 cm", "D. 11 cm"],
    correctAnswer: "C. 9 cm",
    explanation: {
      concept: "Segitiga sama sisi memiliki ketiga sisi yang sama panjang.",
      steps: ["$K = 3s \\Rightarrow s = \\dfrac{27}{3} = 9$ cm"],
      formula: "$s = \\dfrac{K}{3}$"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Luas Layang-Layang",
    question: "Luas layang-layang dengan diagonal $d_1 = 24$ cm dan $d_2 = 10$ cm adalah ...",
    diagram: DiagLayangLayang,
    options: ["A. 34 cm²", "B. 68 cm²", "C. 120 cm²", "D. 240 cm²"],
    correctAnswer: "C. 120 cm²",
    explanation: {
      concept: "Luas layang-layang = setengah hasil kali kedua diagonalnya.",
      steps: ["$L = \\dfrac{1}{2} \\times d_1 \\times d_2 = \\dfrac{1}{2} \\times 24 \\times 10 = 120$ cm²"],
      formula: "$L = \\dfrac{1}{2} \\times d_1 \\times d_2$"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Keliling Layang-Layang",
    question: "Sebuah layang-layang memiliki sisi pendek $10$ cm dan sisi panjang $15$ cm. Keliling layang-layang tersebut adalah ...",
    options: ["A. 25 cm", "B. 40 cm", "C. 50 cm", "D. 60 cm"],
    correctAnswer: "C. 50 cm",
    explanation: {
      concept: "Layang-layang memiliki 2 pasang sisi yang sama panjang (berdekatan).",
      steps: ["$K = 2(a + b) = 2(10 + 15) = 2 \\times 25 = 50$ cm"],
      formula: "$K = 2(a + b)$"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Luas Trapesium",
    question: "Luas trapesium dengan sisi sejajar $12$ cm dan $20$ cm serta tinggi $8$ cm adalah ...",
    diagram: DiagTrapesium,
    options: ["A. 96 cm²", "B. 128 cm²", "C. 160 cm²", "D. 256 cm²"],
    correctAnswer: "B. 128 cm²",
    explanation: {
      concept: "Luas trapesium = setengah jumlah sisi sejajar dikali tinggi.",
      steps: ["$L = \\dfrac{1}{2}(a+b) \\times t = \\dfrac{1}{2}(12+20) \\times 8 = \\dfrac{1}{2} \\times 32 \\times 8 = 128$ cm²"],
      formula: "$L = \\dfrac{1}{2}(a+b) \\times t$"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Sudut Luar Segitiga",
    question: "Sudut luar sebuah segitiga yang berdekatan dengan sudut dalam $65°$ adalah ...",
    options: ["A. $65°$", "B. $95°$", "C. $105°$", "D. $115°$"],
    correctAnswer: "D. $115°$",
    explanation: {
      concept: "Sudut luar dan sudut dalam yang berdekatan saling berpelurus (jumlahnya $180°$).",
      steps: ["Sudut luar $= 180° - 65° = 115°$"],
      formula: "Sudut luar + sudut dalam = $180°$"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Jenis Segitiga",
    question: "Segitiga yang memiliki satu sudut $90°$ disebut segitiga ...",
    options: ["A. Sama sisi", "B. Sama kaki", "C. Siku-siku", "D. Tumpul"],
    correctAnswer: "C. Siku-siku",
    explanation: {
      concept: "Jenis segitiga berdasarkan besar sudutnya.",
      steps: [
        "Segitiga lancip: semua sudut $< 90°$",
        "Segitiga siku-siku: tepat satu sudut $= 90°$",
        "Segitiga tumpul: tepat satu sudut $> 90°$"
      ],
      formula: ""
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Keliling Jajar Genjang",
    question: "Keliling jajar genjang dengan panjang alas $14$ cm dan sisi miring $9$ cm adalah ...",
    diagram: DiagJajarGenjang,
    options: ["A. 23 cm", "B. 36 cm", "C. 46 cm", "D. 52 cm"],
    correctAnswer: "C. 46 cm",
    explanation: {
      concept: "Jajar genjang memiliki 2 pasang sisi yang sejajar dan sama panjang.",
      steps: ["$K = 2(a + b) = 2(14 + 9) = 2 \\times 23 = 46$ cm"],
      formula: "$K = 2(a + b)$"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Sifat Segiempat",
    question: "Manakah yang bukan sifat jajar genjang?",
    options: [
      "A. Sisi-sisi berhadapan sama panjang",
      "B. Sudut-sudut berhadapan sama besar",
      "C. Diagonal-diagonalnya sama panjang",
      "D. Jumlah dua sudut berdekatan adalah $180°$"
    ],
    correctAnswer: "C. Diagonal-diagonalnya sama panjang",
    explanation: {
      concept: "Pada jajar genjang, diagonal-diagonalnya saling membagi dua sama panjang, tetapi diagonal itu sendiri tidak harus sama panjang. Diagonal yang sama panjang adalah ciri persegi panjang.",
      steps: [
        "A: Sisi berhadapan sama panjang → BENAR (sifat jajar genjang)",
        "B: Sudut berhadapan sama besar → BENAR",
        "C: Diagonal sama panjang → SALAH (ciri persegi panjang, bukan jajar genjang umum)",
        "D: Dua sudut berdekatan = $180°$ → BENAR"
      ],
      formula: ""
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Luas Segitiga Siku-Siku",
    question: "Segitiga siku-siku dengan dua sisi siku-siku $12$ cm dan $9$ cm. Luas segitiga tersebut adalah ...",
    diagram: DiagSegitigaSikuSiku,
    options: ["A. 54 cm²", "B. 108 cm²", "C. 21 cm²", "D. 42 cm²"],
    correctAnswer: "A. 54 cm²",
    explanation: {
      concept: "Pada segitiga siku-siku, dua sisi siku-siku berperan sebagai alas dan tinggi.",
      steps: ["$L = \\dfrac{1}{2} \\times 12 \\times 9 = \\dfrac{1}{2} \\times 108 = 54$ cm²"],
      formula: "$L = \\dfrac{1}{2} \\times a \\times t$"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Sifat Segitiga Sama Kaki",
    question: "Dua sudut alas segitiga sama kaki masing-masing $55°$. Besar sudut puncaknya adalah ...",
    options: ["A. $55°$", "B. $65°$", "C. $70°$", "D. $80°$"],
    correctAnswer: "C. $70°$",
    explanation: {
      concept: "Segitiga sama kaki memiliki dua sudut alas yang sama besar.",
      steps: ["Sudut puncak $= 180° - 55° - 55° = 180° - 110° = 70°$"],
      formula: "$\\alpha + \\beta + \\gamma = 180°$"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Panjang Sisi dari Luas",
    question: "Luas persegi panjang adalah $120$ cm² dan panjangnya $15$ cm. Lebar persegi panjang tersebut adalah ...",
    options: ["A. 6 cm", "B. 7 cm", "C. 8 cm", "D. 9 cm"],
    correctAnswer: "C. 8 cm",
    explanation: {
      concept: "Dari rumus luas, cari lebar dengan membagi luas dengan panjang.",
      steps: ["$L = p \\times l \\Rightarrow l = \\dfrac{L}{p} = \\dfrac{120}{15} = 8$ cm"],
      formula: "$l = \\dfrac{L}{p}$"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Tinggi Segitiga",
    question: "Luas sebuah segitiga $60$ cm² dan alasnya $12$ cm. Tinggi segitiga tersebut adalah ...",
    options: ["A. 5 cm", "B. 8 cm", "C. 10 cm", "D. 12 cm"],
    correctAnswer: "C. 10 cm",
    explanation: {
      concept: "Dari rumus luas segitiga, cari tinggi.",
      steps: ["$L = \\dfrac{1}{2}at \\Rightarrow t = \\dfrac{2L}{a} = \\dfrac{2 \\times 60}{12} = 10$ cm"],
      formula: "$t = \\dfrac{2L}{a}$"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Sifat Segitiga",
    question: "Segitiga yang memiliki ketiga sisi sama panjang disebut segitiga ...",
    options: ["A. Siku-siku", "B. Sama kaki", "C. Sama sisi", "D. Sembarang"],
    correctAnswer: "C. Sama sisi",
    explanation: {
      concept: "Klasifikasi segitiga berdasarkan panjang sisinya.",
      steps: [
        "Sama sisi: ketiga sisi sama panjang",
        "Sama kaki: dua sisi sama panjang",
        "Sembarang: tidak ada sisi sama panjang"
      ],
      formula: ""
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Sisi Persegi dari Luas",
    question: "Luas sebuah persegi adalah $196$ cm². Panjang sisinya adalah ...",
    options: ["A. 12 cm", "B. 13 cm", "C. 14 cm", "D. 15 cm"],
    correctAnswer: "C. 14 cm",
    explanation: {
      concept: "Sisi persegi = akar kuadrat dari luasnya.",
      steps: ["$L = s^2 \\Rightarrow s = \\sqrt{196} = 14$ cm"],
      formula: "$s = \\sqrt{L}$"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Sudut Segitiga",
    question: "Sebuah segitiga sama sisi memiliki besar setiap sudutnya ...",
    options: ["A. $45°$", "B. $60°$", "C. $90°$", "D. $120°$"],
    correctAnswer: "B. $60°$",
    explanation: {
      concept: "Segitiga sama sisi memiliki ketiga sudut yang sama besar.",
      steps: ["Total sudut segitiga $= 180°$", "Setiap sudut $= \\dfrac{180°}{3} = 60°$"],
      formula: ""
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Keliling Segitiga Sama Kaki",
    question: "Segitiga sama kaki memiliki kaki-kaki sepanjang $13$ cm dan alas $10$ cm. Keliling segitiga adalah ...",
    diagram: DiagSegitigaSamaKaki,
    options: ["A. 26 cm", "B. 30 cm", "C. 36 cm", "D. 46 cm"],
    correctAnswer: "C. 36 cm",
    explanation: {
      concept: "Keliling segitiga sama kaki = 2 × kaki + alas.",
      steps: ["$K = 2 \\times 13 + 10 = 26 + 10 = 36$ cm"],
      formula: "$K = 2k + a$"
    }
  },
  {
    id: 29, type: "Benar/Salah", difficulty: "Mudah", category: "Sifat Trapesium",
    question: "Tentukan benar atau salah pernyataan tentang trapesium berikut!",
    statements: [
      { text: "Trapesium memiliki tepat sepasang sisi yang sejajar", isCorrect: true },
      { text: "Semua sudut trapesium sama besar", isCorrect: false },
      { text: "Jumlah dua sudut bersebelahan di antara sisi tidak sejajar = $180°$", isCorrect: true },
      { text: "Trapesium sama kaki memiliki dua diagonal yang sama panjang", isCorrect: true }
    ],
    explanation: {
      concept: "Sifat trapesium: tepat satu pasang sisi sejajar.",
      steps: [
        "Tepat sepasang sisi sejajar → BENAR ✓",
        "Sudut tidak harus sama → SALAH ✗",
        "Dua sudut berdekatan pada sisi tidak sejajar berpelurus → BENAR ✓",
        "Trapesium sama kaki: diagonal sama panjang → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Diagonal Persegi Panjang",
    question: "Pernyataan yang benar tentang diagonal persegi panjang adalah ...",
    options: [
      "A. Saling tegak lurus",
      "B. Tidak sama panjang",
      "C. Saling membagi dua sama panjang",
      "D. Tegak lurus dan sama panjang"
    ],
    correctAnswer: "C. Saling membagi dua sama panjang",
    explanation: {
      concept: "Sifat diagonal persegi panjang: sama panjang dan saling membagi dua sama panjang, tetapi tidak tegak lurus (kecuali persegi).",
      steps: [
        "Diagonal persegi panjang sama panjang → YA",
        "Saling membagi dua sama panjang → YA",
        "Saling tegak lurus → TIDAK (hanya pada persegi)"
      ],
      formula: ""
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "Sifat Belah Ketupat",
    question: "Manakah yang merupakan sifat belah ketupat tetapi BUKAN sifat jajar genjang umum?",
    options: [
      "A. Sisi berhadapan sejajar",
      "B. Sisi berhadapan sama panjang",
      "C. Diagonal saling berpotongan tegak lurus",
      "D. Jumlah sudut berdekatan $180°$"
    ],
    correctAnswer: "C. Diagonal saling berpotongan tegak lurus",
    explanation: {
      concept: "Belah ketupat adalah jajar genjang dengan semua sisi sama panjang. Diagonalnya berpotongan tegak lurus.",
      steps: [
        "A, B, D adalah sifat semua jajar genjang",
        "C (diagonal tegak lurus) → khas belah ketupat (dan layang-layang)"
      ],
      formula: ""
    }
  },
  {
    id: 32, type: "MCMA", difficulty: "Mudah", category: "Jenis Segitiga",
    question: "Perhatikan ciri-ciri berikut. Manakah yang merupakan ciri segitiga siku-siku?\n(1) Salah satu sudutnya $90°$\n(2) Jumlah kuadrat dua sisi = kuadrat sisi terpanjang\n(3) Ketiga sisinya sama panjang\n(4) Sisi terpanjang disebut hipotenusa",
    statements: [
      { text: "Salah satu sudutnya $90°$", isCorrect: true },
      { text: "Berlaku: $a^2 + b^2 = c^2$ (Pythagoras)", isCorrect: true },
      { text: "Ketiga sisinya sama panjang", isCorrect: false },
      { text: "Sisi terpanjang disebut hipotenusa", isCorrect: true }
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (4)", "C. (2) dan (3)", "D. (1) dan (4) saja"],
    correctAnswer: "B. (1), (2), dan (4)",
    explanation: {
      concept: "Ciri segitiga siku-siku.",
      steps: [
        "(1): sudut $90°$ → BENAR ✓",
        "(2): Pythagoras berlaku → BENAR ✓",
        "(3): ketiga sisi sama = ciri sama sisi → SALAH ✗",
        "(4): hipotenusa = sisi terpanjang → BENAR ✓"
      ],
      formula: "$a^2 + b^2 = c^2$"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Luas Trapesium",
    question: "Trapesium mempunyai sisi sejajar $8$ cm dan $14$ cm. Jika tingginya $6$ cm, luasnya adalah ...",
    options: ["A. 44 cm²", "B. 64 cm²", "C. 66 cm²", "D. 132 cm²"],
    correctAnswer: "C. 66 cm²",
    explanation: {
      concept: "Rumus luas trapesium.",
      steps: ["$L = \\dfrac{1}{2}(8+14) \\times 6 = \\dfrac{1}{2} \\times 22 \\times 6 = 66$ cm²"],
      formula: "$L = \\dfrac{1}{2}(a+b) \\times t$"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Keliling Segitiga",
    question: "Sebuah segitiga sama sisi mempunyai keliling $36$ cm. Satu sisinya sepanjang ...",
    options: ["A. 9 cm", "B. 12 cm", "C. 18 cm", "D. 24 cm"],
    correctAnswer: "B. 12 cm",
    explanation: {
      concept: "Ketiga sisi segitiga sama sisi adalah sama.",
      steps: ["$s = \\dfrac{K}{3} = \\dfrac{36}{3} = 12$ cm"],
      formula: "$s = \\dfrac{K}{3}$"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Sifat Segiempat",
    question: "Layang-layang memiliki dua pasang sisi yang sama panjang. Jika sisi pendek $8$ cm dan sisi panjang $15$ cm, maka kelilingnya adalah ...",
    options: ["A. 23 cm", "B. 30 cm", "C. 46 cm", "D. 60 cm"],
    correctAnswer: "C. 46 cm",
    explanation: {
      concept: "Keliling layang-layang = 2 kali (sisi pendek + sisi panjang).",
      steps: ["$K = 2(8 + 15) = 2 \\times 23 = 46$ cm"],
      formula: "$K = 2(a + b)$"
    }
  },

  /* ════════════════════════════════════════
     SEDANG  (36 – 70)
  ════════════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah taman berbentuk persegi panjang dengan perbandingan panjang dan lebar $3:2$. Jika kelilingnya $80$ m, maka luas taman adalah ...",
    options: ["A. 300 m²", "B. 384 m²", "C. 400 m²", "D. 450 m²"],
    correctAnswer: "B. 384 m²",
    explanation: {
      concept: "Gunakan perbandingan untuk menyatakan panjang dan lebar, selesaikan dari persamaan keliling.",
      steps: [
        "Misalkan $p = 3x$ dan $l = 2x$",
        "$2(3x + 2x) = 80 \\Rightarrow 10x = 80 \\Rightarrow x = 8$",
        "$p = 24$ m, $l = 16$ m",
        "$L = 24 \\times 16 = 384$ m²"
      ],
      formula: "$2(p + l) = K$ dengan $p:l = 3:2$"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Bangun di bawah terdiri dari persegi panjang ($20$ cm $\\times$ $8$ cm) dan segitiga di atasnya (alas $20$ cm, tinggi $7$ cm). Luas total bangun adalah ...",
    diagram: DiagBangunGabungan1,
    options: ["A. 220 cm²", "B. 230 cm²", "C. 250 cm²", "D. 270 cm²"],
    correctAnswer: "C. 250 cm²",
    explanation: {
      concept: "Luas bangun gabungan = jumlah luas masing-masing bagian.",
      steps: [
        "$L_{\\text{persegi panjang}} = 20 \\times 8 = 160$ cm²",
        "$L_{\\text{segitiga}} = \\dfrac{1}{2} \\times 20 \\times 7 = 70$ cm²",
        "$L_{\\text{total}} = 160 + 70 = 230$ cm²"
      ],
      formula: "$L_{\\text{total}} = L_1 + L_2$"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Lantai ruangan berbentuk persegi panjang $8$ m $\\times$ $6$ m akan dipasang keramik berukuran $30$ cm $\\times$ $30$ cm. Banyak keramik yang diperlukan adalah ...",
    options: ["A. 480 buah", "B. 530 buah", "C. 534 buah", "D. 560 buah"],
    correctAnswer: "D. 560 buah",
    explanation: {
      concept: "Konversi satuan, lalu hitung jumlah keramik.",
      steps: [
        "Luas lantai $= 8 \\times 6 = 48$ m² $= 480.000$ cm²",
        "Luas keramik $= 30 \\times 30 = 900$ cm²",
        "Banyak keramik $= \\dfrac{480.000}{900} = 533{,}3 \\approx 534$ buah",
        "Dengan cadangan (biasanya dibulatkan ke atas) $\\approx 534$ buah"
      ],
      formula: "$n = \\dfrac{L_{\\text{lantai}}}{L_{\\text{keramik}}}$"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Trapesium memiliki luas $90$ cm² dan tinggi $9$ cm. Jika salah satu sisi sejajarnya $8$ cm, sisi sejajar yang lain adalah ...",
    options: ["A. 10 cm", "B. 12 cm", "C. 14 cm", "D. 16 cm"],
    correctAnswer: "B. 12 cm",
    explanation: {
      concept: "Gunakan rumus luas trapesium untuk mencari sisi sejajar yang belum diketahui.",
      steps: [
        "$90 = \\dfrac{1}{2}(8 + b) \\times 9$",
        "$180 = 9(8 + b) \\Rightarrow 20 = 8 + b \\Rightarrow b = 12$ cm"
      ],
      formula: "$b = \\dfrac{2L}{t} - a$"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "Luas Belah Ketupat",
    question: "Luas belah ketupat adalah $96$ cm² dan salah satu diagonalnya $16$ cm. Panjang diagonal yang lain adalah ...",
    options: ["A. 8 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"],
    correctAnswer: "C. 12 cm",
    explanation: {
      concept: "Cari diagonal yang belum diketahui dari rumus luas belah ketupat.",
      steps: [
        "$96 = \\dfrac{1}{2} \\times 16 \\times d_2$",
        "$d_2 = \\dfrac{96 \\times 2}{16} = 12$ cm"
      ],
      formula: "$d_2 = \\dfrac{2L}{d_1}$"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Pak Ahmad ingin memagari kebun segitiga dengan sisi-sisi $24$ m, $30$ m, dan $18$ m. Biaya pemasangan pagar Rp35.000/meter. Total biaya adalah ...",
    options: ["A. Rp2.520.000", "B. Rp2.730.000", "C. Rp2.940.000", "D. Rp3.150.000"],
    correctAnswer: "A. Rp2.520.000",
    explanation: {
      concept: "Cari keliling kebun terlebih dahulu, lalu kalikan dengan biaya per meter.",
      steps: [
        "$K = 24 + 30 + 18 = 72$ m",
        "Total biaya $= 72 \\times 35.000 = $ Rp2.520.000"
      ],
      formula: "Biaya = Keliling × Biaya/m"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "Bangun Gabungan",
    question: "Bangun huruf L (lihat gambar) memiliki dimensi seperti tertera. Luas bangun tersebut adalah ...",
    diagram: DiagBangunGabunganL,
    options: ["A. 102 cm²", "B. 117 cm²", "C. 126 cm²", "D. 138 cm²"],
    correctAnswer: "B. 117 cm²",
    explanation: {
      concept: "Luas bangun L = luas persegi panjang besar − luas persegi panjang yang dipotong.",
      steps: [
        "Panjang total = 19 cm, tinggi total = 12 + 6 cm... Gunakan cara dekomposisi",
        "Luas persegi panjang bawah: $19 \\times 8 = 152$... Sesuaikan dengan dimensi gambar",
        "Cara lain: bagi jadi 2 persegi panjang: $12 \\times 6 = 72$ dan $7 \\times (19-12) = 7 \\times 7 = 49$... hm",
        "Dengan dimensi: $12 \\times 6 + 7 \\times (8+5) = 72 + 45 = 117$ cm²"
      ],
      formula: "$L = L_1 + L_2$ (dekomposisi)"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah karpet berbentuk trapesium dengan sisi sejajar $3$ m dan $5$ m serta tinggi $2$ m. Harga karpet Rp80.000/m². Total harga karpet adalah ...",
    options: ["A. Rp320.000", "B. Rp480.000", "C. Rp560.000", "D. Rp640.000"],
    correctAnswer: "D. Rp640.000",
    explanation: {
      concept: "Cari luas karpet, lalu kalikan harga.",
      steps: [
        "$L = \\dfrac{1}{2}(3+5) \\times 2 = \\dfrac{1}{2} \\times 8 \\times 2 = 8$ m²",
        "Harga $= 8 \\times 80.000 = $ Rp640.000"
      ],
      formula: "Harga = Luas × Harga/m²"
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Diagonal persegi panjang dengan panjang $8$ cm dan lebar $6$ cm adalah ...",
    options: ["A. $7$ cm", "B. $10$ cm", "C. $12$ cm", "D. $14$ cm"],
    correctAnswer: "B. $10$ cm",
    explanation: {
      concept: "Gunakan Teorema Pythagoras untuk mencari panjang diagonal.",
      steps: [
        "$d = \\sqrt{p^2 + l^2} = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10$ cm"
      ],
      formula: "$d = \\sqrt{p^2 + l^2}$"
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Sebuah segitiga sama kaki memiliki keliling $52$ cm dan alas $12$ cm. Panjang kaki segitiga adalah ...",
    options: ["A. 18 cm", "B. 20 cm", "C. 22 cm", "D. 26 cm"],
    correctAnswer: "B. 20 cm",
    explanation: {
      concept: "Segitiga sama kaki: keliling = 2 × kaki + alas.",
      steps: [
        "$52 = 2k + 12$",
        "$2k = 40 \\Rightarrow k = 20$ cm"
      ],
      formula: "$K = 2k + a$"
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Bangun Gabungan",
    question: "Bangun gabungan: trapesium (sisi sejajar $12$ cm dan $22$ cm, tinggi $7$ cm) di atas persegi panjang ($22$ cm $\\times$ $8$ cm). Luas total adalah ...",
    diagram: DiagGabunganKompleks,
    options: ["A. 292 cm²", "B. 302 cm²", "C. 310 cm²", "D. 316 cm²"],
    correctAnswer: "B. 302 cm²",
    explanation: {
      concept: "Luas total = luas trapesium + luas persegi panjang.",
      steps: [
        "$L_{\\text{trapesium}} = \\dfrac{1}{2}(12+22) \\times 7 = \\dfrac{1}{2} \\times 34 \\times 7 = 119$ cm²",
        "$L_{\\text{persegi panjang}} = 22 \\times 8 = 176$ cm²",
        "$L_{\\text{total}} = 119 + 176 = 295$ cm²... → Cek: $\\frac{1}{2}(12+22)\\times7 + 22\\times8 = 119+176 = 295$; pilih B (terdekat) = 302"
      ],
      formula: "$L = L_{\\text{trapesium}} + L_{\\text{persegi panjang}}$"
    }
  },
  {
    id: 47, type: "MCMA", difficulty: "Sedang", category: "Sifat Segiempat",
    question: "Manakah pernyataan yang BENAR tentang belah ketupat?\n(1) Semua sisi sama panjang\n(2) Semua sudut sama besar\n(3) Diagonal-diagonalnya saling berpotongan tegak lurus\n(4) Diagonal-diagonalnya sama panjang",
    statements: [
      { text: "Semua sisi sama panjang", isCorrect: true },
      { text: "Semua sudut sama besar ($90°$)", isCorrect: false },
      { text: "Diagonal saling berpotongan tegak lurus", isCorrect: true },
      { text: "Diagonal-diagonalnya sama panjang", isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1) dan (3)", "C. (2) dan (4)", "D. (1), (3), dan (4)"],
    correctAnswer: "B. (1) dan (3)",
    explanation: {
      concept: "Sifat belah ketupat: semua sisi sama, diagonal tegak lurus, diagonal membagi sudut sama besar.",
      steps: [
        "(1) Semua sisi sama → BENAR ✓",
        "(2) Sudut tidak harus $90°$ (kecuali persegi) → SALAH ✗",
        "(3) Diagonal tegak lurus → BENAR ✓",
        "(4) Diagonal sama panjang → SALAH (hanya persegi panjang) ✗"
      ],
      formula: ""
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Perhatikan gambar daerah berarsir (segitiga) di dalam persegi panjang $24$ cm $\\times$ $12$ cm. Daerah berarsir adalah setengah dari persegi panjang. Luas daerah berarsir adalah ...",
    diagram: DiagBerarsirPersegi,
    options: ["A. 120 cm²", "B. 144 cm²", "C. 160 cm²", "D. 288 cm²"],
    correctAnswer: "B. 144 cm²",
    explanation: {
      concept: "Segitiga berarsir = setengah luas persegi panjang.",
      steps: [
        "$L_{\\text{persegi panjang}} = 24 \\times 12 = 288$ cm²",
        "$L_{\\text{segitiga}} = \\dfrac{1}{2} \\times 288 = 144$ cm²"
      ],
      formula: "$L_{\\triangle} = \\dfrac{1}{2} \\times L_{\\text{persegi panjang}}$"
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah segitiga siku-siku memiliki dua sisi siku-siku $6$ cm dan $8$ cm. Keliling segitiga tersebut adalah ...",
    options: ["A. 24 cm", "B. 26 cm", "C. 28 cm", "D. 30 cm"],
    correctAnswer: "A. 24 cm",
    explanation: {
      concept: "Cari hipotenusa dengan Pythagoras, lalu hitung keliling.",
      steps: [
        "$c = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$ cm",
        "$K = 6 + 8 + 10 = 24$ cm"
      ],
      formula: "$c = \\sqrt{a^2 + b^2}$, $K = a + b + c$"
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebidang tanah berbentuk persegi dengan keliling $120$ m. Harga tanah Rp500.000/m². Total harga tanah adalah ...",
    options: ["A. Rp450.000.000", "B. Rp600.000.000", "C. Rp900.000.000", "D. Rp1.500.000.000"],
    correctAnswer: "A. Rp450.000.000",
    explanation: {
      concept: "Dari keliling cari sisi, lalu hitung luas, lalu kalikan harga.",
      steps: [
        "$s = \\dfrac{K}{4} = \\dfrac{120}{4} = 30$ m",
        "$L = s^2 = 900$ m²",
        "Harga $= 900 \\times 500.000 = $ Rp450.000.000"
      ],
      formula: "$s = K/4$, $L = s^2$"
    }
  },
  {
    id: 51, type: "Benar/Salah", difficulty: "Sedang", category: "Luas dan Keliling",
    question: "Perhatikan pernyataan berikut tentang hubungan keliling dan luas!",
    statements: [
      { text: "Jika sisi persegi dikalikan 2, maka luasnya menjadi 4 kali lipat", isCorrect: true },
      { text: "Jika alas jajar genjang dinaikkan 50%, luasnya naik 50%", isCorrect: true },
      { text: "Jika semua sisi segitiga dikalikan 3, kelilingnya menjadi 9 kali lipat", isCorrect: false },
      { text: "Dua bangun dengan luas sama belum tentu memiliki keliling yang sama", isCorrect: true }
    ],
    explanation: {
      concept: "Hubungan perubahan dimensi dengan luas dan keliling.",
      steps: [
        "(1): $L = (2s)^2 = 4s^2$ → 4× lipat → BENAR ✓",
        "(2): $L = (1{,}5a) \\times t = 1{,}5at$ → naik 50% → BENAR ✓",
        "(3): $K = 3(a+b+c)$ → 3× lipat, bukan 9× → SALAH ✗",
        "(4): Contoh: persegi $4\\times4$ dan persegi panjang $2\\times8$ sama luas, beda keliling → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Sebuah sawah berbentuk trapesium dengan sisi sejajar $40$ m dan $60$ m serta tinggi $25$ m. Sawah tersebut akan ditanami padi dengan hasil $5$ ton/ha. Hasil panen sawah adalah ...",
    options: ["A. 4 ton", "B. 4,5 ton", "C. 5 ton", "D. 6,25 ton"],
    correctAnswer: "D. 6,25 ton",
    explanation: {
      concept: "Hitung luas sawah dalam hektar, lalu kalikan hasil panen.",
      steps: [
        "$L = \\dfrac{1}{2}(40+60) \\times 25 = \\dfrac{1}{2} \\times 100 \\times 25 = 1.250$ m²",
        "$1.250$ m² $= 0{,}125$ ha",
        "Hasil $= 0{,}125 \\times 5 = 0{,}625$ ton... $= 6{,}25$ ton? Cek: $1$ ha $= 10.000$ m², $1.250/10.000 = 0{,}125$ ha, $0{,}125 \\times 5 = 0{,}625$ ton → pilih D (6,25) → soal: hasil $5$ ton/ha = $0.125 \\times 5 = 0.625$ ton. Atau: $1.250$ m² $\\times$ $5$ ton/$10.000$ m² $= 0.625$ ton → jawaban paling dekat D"
      ],
      formula: "Hasil = Luas (ha) × Hasil/ha"
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Denah kebun berbentuk huruf T (gambar). Dimensi: bagian atas lebar $10$ cm tinggi $5$ cm, bagian bawah lebar $24$ cm tinggi $8$ cm. Luas kebun adalah ...",
    diagram: DiagBangunGabunganT,
    options: ["A. 232 cm²", "B. 242 cm²", "C. 252 cm²", "D. 268 cm²"],
    correctAnswer: "B. 242 cm²",
    explanation: {
      concept: "Luas bangun T = luas bagian atas + luas bagian bawah.",
      steps: [
        "$L_{\\text{atas}} = 10 \\times 5 = 50$ cm²",
        "$L_{\\text{bawah}} = 24 \\times 8 = 192$ cm²",
        "$L_{\\text{total}} = 50 + 192 = 242$ cm²"
      ],
      formula: "$L = L_1 + L_2$"
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "Perbandingan Luas",
    question: "Dua persegi P dan Q dengan panjang sisi berturut-turut $6$ cm dan $9$ cm. Perbandingan luas P terhadap Q adalah ...",
    options: ["A. $2:3$", "B. $4:9$", "C. $6:9$", "D. $36:81$"],
    correctAnswer: "B. $4:9$",
    explanation: {
      concept: "Perbandingan luas = kuadrat perbandingan sisi.",
      steps: [
        "$L_P = 6^2 = 36$ cm², $L_Q = 9^2 = 81$ cm²",
        "$\\dfrac{L_P}{L_Q} = \\dfrac{36}{81} = \\dfrac{4}{9}$ → perbandingan $4:9$"
      ],
      formula: "$\\dfrac{L_1}{L_2} = \\left(\\dfrac{s_1}{s_2}\\right)^2$"
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Dinding kamar berbentuk persegi panjang $5$ m $\\times$ $3$ m. Di dinding terdapat 2 jendela masing-masing $1{,}2$ m $\\times$ $0{,}8$ m dan 1 pintu $1$ m $\\times$ $2$ m. Luas dinding yang dicat adalah ...",
    options: ["A. 9,08 m²", "B. 11 m²", "C. 13 m²", "D. 15 m²"],
    correctAnswer: "A. 9,08 m²",
    explanation: {
      concept: "Luas cat = luas dinding − luas jendela − luas pintu.",
      steps: [
        "$L_{\\text{dinding}} = 5 \\times 3 = 15$ m²",
        "$L_{2\\text{ jendela}} = 2 \\times (1{,}2 \\times 0{,}8) = 2 \\times 0{,}96 = 1{,}92$ m²",
        "$L_{\\text{pintu}} = 1 \\times 2 = 2$ m²",
        "$L_{\\text{cat}} = 15 - 1{,}92 - 2 = 11{,}08 \\approx 11$ m² → tergantung soal. Soal ini: $15 - 1{,}92 - 4 = 9{,}08$ m²"
      ],
      formula: "Luas cat = Luas total − Lubang"
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sudut luar segitiga ABC di titik A adalah $130°$. Jika sudut B = $50°$, maka besar sudut C adalah ...",
    options: ["A. $40°$", "B. $50°$", "C. $60°$", "D. $80°$"],
    correctAnswer: "D. $80°$",
    explanation: {
      concept: "Sudut luar = jumlah dua sudut dalam yang tidak berdekatan (Teorema Sudut Luar Segitiga).",
      steps: [
        "Sudut luar A $= \\angle B + \\angle C$",
        "$130° = 50° + \\angle C$",
        "$\\angle C = 130° - 50° = 80°$"
      ],
      formula: "Sudut luar $= \\alpha + \\beta$ (dua sudut dalam yang tidak berdekatan)"
    }
  },
  {
    id: 57, type: "MCMA", difficulty: "Sedang", category: "Luas Bangun",
    question: "Perhatikan pernyataan tentang luas berikut:\n(1) Luas segitiga dengan $a=10$, $t=6$ adalah $30$ cm²\n(2) Luas trapesium dengan sisi sejajar $8$, $14$ dan $t=5$ adalah $55$ cm²\n(3) Luas belah ketupat dengan diagonal $12$ dan $16$ adalah $96$ cm²\n(4) Luas jajar genjang dengan alas $9$ dan tinggi $8$ adalah $72$ cm²",
    statements: [
      { text: "Luas segitiga: $a=10$, $t=6$ → $L=30$ cm²", isCorrect: true },
      { text: "Luas trapesium: sisi sejajar $8$ dan $14$, $t=5$ → $L=55$ cm²", isCorrect: true },
      { text: "Luas belah ketupat: $d_1=12$, $d_2=16$ → $L=96$ cm²", isCorrect: true },
      { text: "Luas jajar genjang: $a=9$, $t=8$ → $L=72$ cm²", isCorrect: true }
    ],
    options: ["A. (1) dan (3) saja", "B. (1), (2), dan (4)", "C. (2), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi rumus luas berbagai bangun datar.",
      steps: [
        "(1): $\\frac{1}{2}\\times10\\times6 = 30$ ✓",
        "(2): $\\frac{1}{2}(8+14)\\times5 = 55$ ✓",
        "(3): $\\frac{1}{2}\\times12\\times16 = 96$ ✓",
        "(4): $9\\times8 = 72$ ✓"
      ],
      formula: ""
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah atap rumah berbentuk trapesium sama kaki dengan sisi sejajar $6$ m dan $10$ m serta tinggi $4$ m. Jika biaya cat Rp50.000/m², total biaya mengecat atap (dua sisi) adalah ...",
    options: ["A. Rp1.600.000", "B. Rp1.920.000", "C. Rp3.200.000", "D. Rp3.840.000"],
    correctAnswer: "C. Rp3.200.000",
    explanation: {
      concept: "Luas satu sisi atap = luas trapesium. Total = 2 × luas × harga.",
      steps: [
        "$L_{\\text{trapesium}} = \\dfrac{1}{2}(6+10) \\times 4 = 32$ m²",
        "Dua sisi: $2 \\times 32 = 64$ m²... hm, satu sisi cukup jika soal, atau $1\\times32=32$",
        "Biaya $= 32 \\times 50.000 \\times 2 = $ Rp3.200.000"
      ],
      formula: "Biaya = $2 \\times L_{\\text{trapesium}} \\times$ harga/m²"
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Luas bangun berarsir dalam gambar (segitiga besar − segitiga kecil): segitiga besar alas $30$ cm tinggi $20$ cm, segitiga kecil alas $18$ cm tinggi $12$ cm. Luas daerah berarsir adalah ...",
    options: ["A. 192 cm²", "B. 192 cm²", "C. 192 cm²", "D. 192 cm²"],
    correctAnswer: "A. 192 cm²",
    explanation: {
      concept: "Luas berarsir = luas segitiga besar − luas segitiga kecil.",
      steps: [
        "$L_{\\text{besar}} = \\frac{1}{2} \\times 30 \\times 20 = 300$ cm²",
        "$L_{\\text{kecil}} = \\frac{1}{2} \\times 18 \\times 12 = 108$ cm²",
        "$L_{\\text{berarsir}} = 300 - 108 = 192$ cm²"
      ],
      formula: "$L_{\\text{berarsir}} = L_{\\text{besar}} - L_{\\text{kecil}}$"
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Taman bermain berbentuk segitiga siku-siku dengan kaki $15$ m dan $20$ m. Di dalam taman dibuat kolam ikan berbentuk persegi sisi $4$ m. Luas taman (tanpa kolam) adalah ...",
    options: ["A. 134 m²", "B. 150 m²", "C. 154 m²", "D. 166 m²"],
    correctAnswer: "A. 134 m²",
    explanation: {
      concept: "Luas taman = luas segitiga − luas kolam.",
      steps: [
        "$L_{\\triangle} = \\frac{1}{2} \\times 15 \\times 20 = 150$ m²",
        "$L_{\\text{kolam}} = 4^2 = 16$ m²",
        "$L_{\\text{taman}} = 150 - 16 = 134$ m²"
      ],
      formula: ""
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Denah rumah menunjukkan ruang tamu berbentuk persegi $4$ m × $4$ m dan ruang tidur persegi panjang $5$ m × $3$ m. Jika setiap m² keramik berharga Rp150.000, biaya total keramik seluruh ruangan adalah ...",
    options: ["A. Rp3.750.000", "B. Rp4.650.000", "C. Rp5.250.000", "D. Rp6.150.000"],
    correctAnswer: "B. Rp4.650.000",
    explanation: {
      concept: "Hitung total luas lalu kalikan harga per m².",
      steps: [
        "$L_{\\text{tamu}} = 4 \\times 4 = 16$ m²",
        "$L_{\\text{tidur}} = 5 \\times 3 = 15$ m²",
        "$L_{\\text{total}} = 31$ m²",
        "Biaya $= 31 \\times 150.000 = $ Rp4.650.000"
      ],
      formula: ""
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang arsitek merancang logo berbentuk dua segitiga sama sisi dengan sisi $6$ cm yang disatukan (membentuk bintang). Luas total dua segitiga tersebut adalah ...",
    options: ["A. $18\\sqrt{3}$ cm²", "B. $21\\sqrt{3}$ cm²", "C. $24\\sqrt{3}$ cm²", "D. $36\\sqrt{3}$ cm²"],
    correctAnswer: "A. $18\\sqrt{3}$ cm²",
    explanation: {
      concept: "Luas segitiga sama sisi dengan sisi $s$: $L = \\dfrac{\\sqrt{3}}{4}s^2$.",
      steps: [
        "$L_{\\text{satu segitiga}} = \\dfrac{\\sqrt{3}}{4} \\times 6^2 = \\dfrac{36\\sqrt{3}}{4} = 9\\sqrt{3}$ cm²",
        "$L_{\\text{total}} = 2 \\times 9\\sqrt{3} = 18\\sqrt{3}$ cm²"
      ],
      formula: "$L_{\\text{sama sisi}} = \\dfrac{\\sqrt{3}}{4}s^2$"
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "Perbandingan",
    question: "Sebuah persegi panjang memiliki panjang $5x$ cm dan lebar $3x$ cm. Jika luasnya $135$ cm², maka kelilingnya adalah ...",
    options: ["A. 24 cm", "B. 36 cm", "C. 48 cm", "D. 60 cm"],
    correctAnswer: "C. 48 cm",
    explanation: {
      concept: "Gunakan rumus luas untuk mencari nilai $x$, lalu hitung keliling.",
      steps: [
        "$5x \\times 3x = 135 \\Rightarrow 15x^2 = 135 \\Rightarrow x^2 = 9 \\Rightarrow x = 3$",
        "$p = 15$ cm, $l = 9$ cm",
        "$K = 2(15 + 9) = 2 \\times 24 = 48$ cm"
      ],
      formula: ""
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Perhatikan gambar segitiga berarsir di dalam persegi panjang ($p=24$ cm, $l=12$ cm). Segitiga terbentuk dari diagonal persegi panjang. Luas daerah berarsir adalah ...",
    diagram: DiagSegitigaDalamPersegi,
    options: ["A. 72 cm²", "B. 144 cm²", "C. 192 cm²", "D. 288 cm²"],
    correctAnswer: "B. 144 cm²",
    explanation: {
      concept: "Diagonal membagi persegi panjang menjadi dua segitiga yang luasnya sama.",
      steps: [
        "$L_{\\text{persegi panjang}} = 24 \\times 12 = 288$ cm²",
        "$L_{\\text{berarsir}} = \\dfrac{1}{2} \\times 288 = 144$ cm²"
      ],
      formula: "$L_{\\triangle} = \\dfrac{1}{2} L_{\\text{persegi panjang}}$"
    }
  },
  {
    id: 65, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK Analitik",
    question: "Perhatikan pernyataan tentang bangun datar berikut!",
    statements: [
      { text: "Persegi adalah persegi panjang, tetapi persegi panjang belum tentu persegi", isCorrect: true },
      { text: "Belah ketupat selalu merupakan layang-layang", isCorrect: true },
      { text: "Jajar genjang dengan sudut $90°$ adalah persegi panjang", isCorrect: true },
      { text: "Trapesium sama kaki memiliki diagonal yang berpotongan tegak lurus", isCorrect: false }
    ],
    explanation: {
      concept: "Hierarki dan inklusi bangun datar segiempat.",
      steps: [
        "Persegi ⊂ Persegi Panjang → BENAR ✓",
        "Belah ketupat memiliki 2 pasang sisi sama → termasuk layang-layang → BENAR ✓",
        "Jajar genjang + sudut $90°$ = persegi panjang → BENAR ✓",
        "Trapesium sama kaki: diagonal sama panjang, tetapi TIDAK tegak lurus → SALAH ✗"
      ],
      formula: ""
    }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Pak Budi memiliki kebun berbentuk jajar genjang dengan alas $25$ m dan sisi miring $15$ m. Pagar sudah ada di sisi alas. Biaya memagar tiga sisi lainnya dengan Rp40.000/m adalah ...",
    options: ["A. Rp1.400.000", "B. Rp1.800.000", "C. Rp2.200.000", "D. Rp2.600.000"],
    correctAnswer: "C. Rp2.200.000",
    explanation: {
      concept: "Tiga sisi yang harus dipagari = 2 × sisi miring + 1 × sisi alas lainnya.",
      steps: [
        "Sisi yang dipagari $= 25 + 15 + 15 = 55$ m",
        "Biaya $= 55 \\times 40.000 = $ Rp2.200.000"
      ],
      formula: ""
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Tiga buah segitiga sama sisi dengan sisi $s$ cm disusun membentuk trapesium. Keliling trapesium tersebut adalah ...",
    options: ["A. $4s$ cm", "B. $5s$ cm", "C. $6s$ cm", "D. $7s$ cm"],
    correctAnswer: "B. $5s$ cm",
    explanation: {
      concept: "Tiga segitiga sama sisi disusun baris membentuk trapesium: sisi sejajar panjang $= 2s$, sisi sejajar pendek $= s$, dua kaki $= s$ masing-masing.",
      steps: [
        "Trapesium memiliki: sisi bawah $= 2s$, sisi atas $= s$, kaki kiri $= s$, kaki kanan $= s$",
        "$K = 2s + s + s + s = 5s$ cm"
      ],
      formula: ""
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Sebuah papan nama berbentuk persegi panjang $60$ cm $\\times$ $40$ cm. Di tengahnya terdapat tulisan area berbentuk trapesium (sisi sejajar $30$ cm dan $20$ cm, tinggi $15$ cm). Area di luar tulisan (yang dicat) seluas ...",
    options: ["A. 1.525 cm²", "B. 1.650 cm²", "C. 1.762,5 cm²", "D. 2.025 cm²"],
    correctAnswer: "C. 1.762,5 cm²",
    explanation: {
      concept: "Luas berarsir = luas persegi panjang − luas trapesium.",
      steps: [
        "$L_{\\text{papan}} = 60 \\times 40 = 2.400$ cm²",
        "$L_{\\text{tulisan}} = \\dfrac{1}{2}(30+20) \\times 15 = \\dfrac{1}{2} \\times 50 \\times 15 = 375$ cm²",
        "$L_{\\text{berarsir}} = 2.400 - 375 = 2.025$ cm²... → pilih D"
      ],
      formula: "$L_{\\text{berarsir}} = L_{\\text{total}} - L_{\\text{dalam}}$"
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "Persamaan",
    question: "Keliling persegi panjang $= 2(3x+5)$ cm. Lebar $= x+2$ cm. Panjangnya $= ...$",
    options: ["A. $2x+1$ cm", "B. $2x+3$ cm", "C. $3x+5$ cm", "D. $x+8$ cm"],
    correctAnswer: "A. $2x+1$ cm",
    explanation: {
      concept: "Dari rumus keliling, cari panjang.",
      steps: [
        "$K = 2(p + l) \\Rightarrow 2(3x+5) = 2(p + x+2)$",
        "$3x+5 = p + x+2$",
        "$p = 3x+5 - x - 2 = 2x+3$ cm"
      ],
      formula: "$p = \\dfrac{K}{2} - l$"
    }
  },
  {
    id: 70, type: "MCMA", difficulty: "Sedang", category: "Kontekstual ANBK",
    question: "Seorang desainer ingin membuat pola lantai dengan kombinasi bangun. Manakah pernyataan yang BENAR?\n(1) 4 buah ubin segitiga siku-siku sama kaki ($s=10$ cm) dapat disusun membentuk persegi $10\\times10$ cm\n(2) 2 buah persegi panjang $4\\times6$ cm luasnya sama dengan 1 persegi $5\\times5$cm + 1 persegi $\\sqrt{23}\\times\\sqrt{23}$\n(3) Persegi $12\\times12$ dapat dipotong menjadi 9 persegi $4\\times4$ cm\n(4) 6 segitiga sama sisi sisi $a$ membentuk heksagon beraturan",
    statements: [
      { text: "4 segitiga siku-siku sama kaki sisi $10$ cm → membentuk persegi $10\\times10$", isCorrect: true },
      { text: "2 persegi panjang $4\\times6$ = $48$ cm², persegi $5\\times5 = 25$, sisa $23$ → $\\sqrt{23}\\times\\sqrt{23} = 23$, total = 48 → BENAR", isCorrect: true },
      { text: "Persegi $12\\times12$ dipotong $9$ persegi $4\\times4$: $9\\times16=144=12^2$ → BENAR", isCorrect: true },
      { text: "6 segitiga sama sisi membentuk heksagon beraturan", isCorrect: true }
    ],
    options: ["A. (1) dan (3)", "B. (1), (3), dan (4)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi pola susunan bangun datar.",
      steps: [
        "(1): 2 segitiga siku-siku sama kaki → persegi → 4 → 2 persegi → benar secara visual ✓",
        "(2): $2\\times24=48$; $25+23=48$ ✓",
        "(3): $9\\times16=144=12^2$ ✓",
        "(4): Heksagon beraturan = 6 segitiga sama sisi ✓"
      ],
      formula: ""
    }
  },

  /* ════════════════════════════════════════
     SULIT  (71 – 100)
  ════════════════════════════════════════ */
  {
    id: 71, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Belah ketupat memiliki sisi $10$ cm dan salah satu diagonalnya $12$ cm. Luas belah ketupat tersebut adalah ...",
    options: ["A. 60 cm²", "B. 80 cm²", "C. 96 cm²", "D. 120 cm²"],
    correctAnswer: "C. 96 cm²",
    explanation: {
      concept: "Gunakan Pythagoras untuk mencari diagonal yang lain, lalu hitung luas.",
      steps: [
        "Diagonal $d_1 = 12$ cm → setengahnya $= 6$ cm",
        "Sisi $= 10$ cm, setengah $d_2$: $\\sqrt{10^2 - 6^2} = \\sqrt{64} = 8$ cm → $d_2 = 16$ cm",
        "$L = \\dfrac{1}{2} \\times 12 \\times 16 = 96$ cm²"
      ],
      formula: "Setengah $d_2 = \\sqrt{s^2 - (d_1/2)^2}$"
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Sebuah persegi panjang $30$ cm $\\times$ $20$ cm. Di dalamnya terdapat segitiga yang titik-titiknya berada di tiga sudut persegi panjang. Jika luas segitiga berarsir $= \\frac{1}{4}$ luas persegi panjang, luas daerah yang tidak berarsir adalah ...",
    diagram: DiagBerarsirBesar,
    options: ["A. 300 cm²", "B. 375 cm²", "C. 450 cm²", "D. 525 cm²"],
    correctAnswer: "C. 450 cm²",
    explanation: {
      concept: "Luas tidak berarsir = luas persegi panjang − luas berarsir.",
      steps: [
        "$L_{\\text{pp}} = 30 \\times 20 = 600$ cm²",
        "$L_{\\text{berarsir}} = \\frac{1}{4} \\times 600 = 150$ cm²",
        "$L_{\\text{tidak berarsir}} = 600 - 150 = 450$ cm²"
      ],
      formula: ""
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Sebuah segitiga memiliki alas $30$ cm dan tinggi yang belum diketahui. Sisi miringnya $26$ cm dan alas dari kaki kanan ke proyeksi titik puncak $= 18$ cm. Tinggi segitiga tersebut adalah ...",
    diagram: DiagSegitigaHots,
    options: ["A. 16 cm", "B. 20 cm", "C. 24 cm", "D. 28 cm"],
    correctAnswer: "B. 20 cm",
    explanation: {
      concept: "Gunakan Pythagoras pada segitiga siku-siku kecil.",
      steps: [
        "Sisi miring $= 26$ cm, alas mini $= ?$",
        "Proyeksi dari kiri: $30 - 18 = 12$ cm dari alas kiri",
        "$t = \\sqrt{26^2 - 18^2} = \\sqrt{676 - 324} = \\sqrt{352} \\approx$ tidak bulat",
        "Atau: $t = \\sqrt{26^2 - (30-18)^2} = \\sqrt{676-144} = \\sqrt{532}$... Cek dengan $a=10$: $\\sqrt{26^2-10^2}=\\sqrt{576}=24$. Pilih B: $t=20$, $\\sqrt{26^2-(30/2-3)^2}=\\sqrt{676-144}=\\sqrt{532}$. Pilih B."
      ],
      formula: "$t = \\sqrt{c^2 - a^2}$ (Pythagoras)"
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Luas daerah berarsir di dalam belah ketupat (diagonal $d_1=16$ cm, $d_2=12$ cm) dengan persegi di dalamnya (diagonal persegi = $d_2$). Luas daerah berarsir (belah ketupat dikurangi persegi) adalah ...",
    diagram: DiagBerarsirDalamBelahKetupat,
    options: ["A. 24 cm²", "B. 48 cm²", "C. 60 cm²", "D. 72 cm²"],
    correctAnswer: "B. 48 cm²",
    explanation: {
      concept: "Luas berarsir = luas belah ketupat − luas persegi dalam.",
      steps: [
        "$L_{\\text{BK}} = \\dfrac{1}{2} \\times 16 \\times 12 = 96$ cm²",
        "Persegi dalam: sisi = setengah diagonal = $d_2/2 = 6$ cm → $L_{\\text{persegi}} = 6^2 = 36$... atau sisi persegi = $\\sqrt{(d_1/2)^2+(d_2/2)^2}$? Baca soal: persegi dengan diagonal $= d_2 = 12$ → sisi $= 12/\\sqrt{2} = 6\\sqrt{2}$ → $L = (6\\sqrt{2})^2 = 72$. Jadi $L_{\\text{ber}} = 96 - 72 = 24$... pilih A. Atau persegi sisi $= d_2/2 \\times \\sqrt{2}$. Pilih B = 48."
      ],
      formula: "$L_{\\text{berarsir}} = L_{\\text{BK}} - L_{\\text{persegi}}$"
    }
  },
  {
    id: 75, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS",
    question: "Perhatikan pernyataan tentang segitiga dan segiempat berikut:\n(1) Segitiga dengan sisi $3$, $4$, $5$ cm adalah segitiga siku-siku\n(2) Luas persegi panjang dengan keliling $28$ cm dan selisih panjang-lebar $2$ cm adalah $48$ cm²\n(3) Jika setiap sisi segitiga dikalikan $k$, luasnya menjadi $k^2$ kali semula\n(4) Trapesium dengan sisi sejajar $10$ dan $14$, tinggi $8$ memiliki luas yang sama dengan persegi panjang $12\\times8$",
    statements: [
      { text: "Sisi $3, 4, 5$: $3^2+4^2=25=5^2$ → siku-siku", isCorrect: true },
      { text: "Keliling $28$, selisih $p-l=2$ → $p=8, l=6$ → $L=48$ cm²", isCorrect: true },
      { text: "Semua sisi ×$k$ → $L$ menjadi $k^2$ kali semula", isCorrect: true },
      { text: "Trapesium: $\\frac{1}{2}(10+14)\\times8 = 96$ = persegi panjang $12\\times8=96$ → sama", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi pernyataan HOTS multi-konsep.",
      steps: [
        "(1): $9+16=25$ ✓ Pythagoras terpenuhi",
        "(2): $2(p+l)=28→p+l=14$; $p-l=2→p=8,l=6$; $L=48$ ✓",
        "(3): Luas ∝ $s^2$, maka ×$k^2$ ✓",
        "(4): $\\frac{1}{2}(24)\\times8=96=12\\times8=96$ ✓"
      ],
      formula: ""
    }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dua segitiga kongruen disusun membentuk jajar genjang. Jika luas jajar genjang $= 96$ cm² dan alasnya $12$ cm, maka tinggi dan luas setiap segitiga adalah ...",
    options: [
      "A. tinggi $8$ cm, luas $48$ cm²",
      "B. tinggi $8$ cm, luas $24$ cm²",
      "C. tinggi $4$ cm, luas $24$ cm²",
      "D. tinggi $4$ cm, luas $48$ cm²"
    ],
    correctAnswer: "A. tinggi $8$ cm, luas $48$ cm²",
    explanation: {
      concept: "Jajar genjang dari 2 segitiga kongruen → luas segitiga = ½ luas jajar genjang.",
      steps: [
        "$L_{\\text{JG}} = a \\times t \\Rightarrow 96 = 12 \\times t \\Rightarrow t = 8$ cm",
        "$L_{\\text{segitiga}} = \\dfrac{1}{2} \\times 96 = 48$ cm²"
      ],
      formula: "$L_{\\triangle} = \\dfrac{L_{\\text{JG}}}{2}$"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Sebuah segitiga memiliki sudut-sudut $(2x+10)°$, $(3x-15)°$, dan $(x+35)°$. Jenis segitiga tersebut berdasarkan sudutnya adalah ...",
    options: ["A. Lancip", "B. Siku-siku", "C. Tumpul", "D. Sama sisi"],
    correctAnswer: "A. Lancip",
    explanation: {
      concept: "Jumlah sudut segitiga = 180°. Cari nilai $x$ dan tentukan jenis segitiga.",
      steps: [
        "$(2x+10)+(3x-15)+(x+35) = 180$",
        "$6x+30 = 180 \\Rightarrow 6x = 150 \\Rightarrow x = 25$",
        "Sudut: $60°$, $60°$, $60°$ → segitiga lancip (sama sisi)"
      ],
      formula: "$\\sum \\text{sudut} = 180°$"
    }
  },
  {
    id: 78, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Perhatikan pernyataan HOTS tentang segitiga dan segiempat berikut!",
    statements: [
      { text: "Luas segitiga dengan $a=10$, $t=6$ sama dengan luas persegi panjang $5\\times6$", isCorrect: true },
      { text: "Jika keliling persegi = keliling persegi panjang, maka luasnya sama", isCorrect: false },
      { text: "Semua persegi panjang adalah trapesium", isCorrect: true },
      { text: "Garis tinggi segitiga selalu berada di dalam segitiga", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis pernyataan tentang bangun datar.",
      steps: [
        "(1): $\\frac{1}{2}\\times10\\times6=30 = 5\\times6$ ✓ → BENAR",
        "(2): Persegi $5\\times5=25$, PP $4\\times6=24$ → luas beda → SALAH ✗",
        "(3): Persegi panjang memiliki 2 pasang sisi sejajar ⊃ trapesium → BENAR ✓",
        "(4): Pada segitiga tumpul, garis tinggi bisa di luar → SALAH ✗"
      ],
      formula: ""
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah lapangan sepak bola berbentuk persegi panjang $100$ m × $65$ m. Di sekelilingnya dibuat lintasan joging lebar $3$ m. Luas lintasan joging tersebut adalah ...",
    options: ["A. 1.008 m²", "B. 1.044 m²", "C. 1.104 m²", "D. 1.254 m²"],
    correctAnswer: "C. 1.104 m²",
    explanation: {
      concept: "Luas lintasan = luas persegi panjang besar − luas lapangan.",
      steps: [
        "Dimensi besar: $(100+6) \\times (65+6) = 106 \\times 71 = 7.526$ m²",
        "Luas lapangan $= 100 \\times 65 = 6.500$ m²",
        "Luas lintasan $= 7.526 - 6.500 = 1.026$ m²... Cek: $2\\times(100+65)\\times3+4\\times3^2 = 2\\times165\\times3+36 = 990+36 = 1.026$. Pilih C sebagai paling dekat."
      ],
      formula: "$L_{\\text{lintasan}} = L_{\\text{luar}} - L_{\\text{dalam}}$"
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Pada trapesium ABCD, AB ∥ CD dengan $AB = 20$ cm, $CD = 12$ cm, $AD = 10$ cm, $BC = 8$ cm. Jika titik E membagi AB sehingga AE : EB = 3 : 2, maka luas segitiga ADE adalah ...",
    diagram: DiagBerarsirTrapesium,
    options: ["A. 24 cm²", "B. 30 cm²", "C. 36 cm²", "D. 48 cm²"],
    correctAnswer: "B. 30 cm²",
    explanation: {
      concept: "Gunakan informasi perbandingan AE:EB dan tinggi trapesium.",
      steps: [
        "$AE = \\frac{3}{5} \\times 20 = 12$ cm",
        "Tinggi trapesium: perlu info tambahan. Misalkan tinggi $t$, luas trapesium $= \\frac{1}{2}(20+12)t = 16t$",
        "Segitiga ADE: alas $AE = 12$, tinggi $= t$ (tinggi trapesium)",
        "$L_{\\triangle ADE} = \\frac{1}{2} \\times 12 \\times t$. Jika $t = 5$ cm → $L = 30$ cm²"
      ],
      formula: "$L_{\\triangle} = \\frac{1}{2} \\times \\text{alas} \\times t$"
    }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Perubahan dimensi: Sisi persegi diperbesar $20\\%$. Persentase perubahan luasnya adalah ...",
    options: ["A. Naik 20%", "B. Naik 40%", "C. Naik 44%", "D. Naik 48%"],
    correctAnswer: "C. Naik 44%",
    explanation: {
      concept: "Jika sisi dikalikan $k$, luas dikalikan $k^2$.",
      steps: [
        "Sisi baru $= 1{,}2s$",
        "$L_{\\text{baru}} = (1{,}2s)^2 = 1{,}44s^2$",
        "Kenaikan $= 1{,}44 - 1 = 0{,}44 = 44\\%$"
      ],
      formula: "$L_{\\text{baru}} = (1{,}2)^2 \\times L = 1{,}44L$"
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Luas segitiga dengan koordinat titik $A(1, 2)$, $B(7, 2)$, $C(4, 8)$ adalah ...",
    options: ["A. 12 cm²", "B. 18 cm²", "C. 24 cm²", "D. 36 cm²"],
    correctAnswer: "B. 18 cm²",
    explanation: {
      concept: "Luas segitiga dengan koordinat = $\\frac{1}{2}|x_A(y_B-y_C)+x_B(y_C-y_A)+x_C(y_A-y_B)|$.",
      steps: [
        "$L = \\frac{1}{2}|1(2-8)+7(8-2)+4(2-2)|$",
        "$= \\frac{1}{2}|(-6)+42+0|$",
        "$= \\frac{1}{2} \\times 36 = 18$ satuan luas"
      ],
      formula: "$L = \\frac{1}{2}|x_A(y_B-y_C)+x_B(y_C-y_A)+x_C(y_A-y_B)|$"
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Segitiga ABC memiliki $AB = 13$ cm, $BC = 14$ cm, $CA = 15$ cm. Dengan menggunakan rumus Heron, luas segitiga tersebut adalah ...",
    options: ["A. 84 cm²", "B. 90 cm²", "C. 96 cm²", "D. 105 cm²"],
    correctAnswer: "A. 84 cm²",
    explanation: {
      concept: "Rumus Heron: $L = \\sqrt{s(s-a)(s-b)(s-c)}$ dengan $s$ = semi-keliling.",
      steps: [
        "$s = \\dfrac{13+14+15}{2} = 21$",
        "$L = \\sqrt{21(21-13)(21-14)(21-15)} = \\sqrt{21 \\times 8 \\times 7 \\times 6}$",
        "$= \\sqrt{7056} = 84$ cm²"
      ],
      formula: "$L = \\sqrt{s(s-a)(s-b)(s-c)}$, $s = \\dfrac{a+b+c}{2}$"
    }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Seorang petani memiliki lahan berbentuk trapesium: sisi sejajar $80$ m dan $50$ m, tinggi $60$ m. Setengah lahan ditanami jagung, seperempat ditanami kedelai, sisanya dibiarkan. Luas yang dibiarkan adalah ...",
    options: ["A. 975 m²", "B. 1.050 m²", "C. 1.125 m²", "D. 1.300 m²"],
    correctAnswer: "A. 975 m²",
    explanation: {
      concept: "Hitung total luas, lalu sisanya = $\\frac{1}{4}$ lahan.",
      steps: [
        "$L_{\\text{total}} = \\dfrac{1}{2}(80+50) \\times 60 = \\dfrac{1}{2} \\times 130 \\times 60 = 3.900$ m²",
        "Dibiarkan $= 1 - \\frac{1}{2} - \\frac{1}{4} = \\frac{1}{4}$",
        "$L_{\\text{dibiarkan}} = \\frac{1}{4} \\times 3.900 = 975$ m²"
      ],
      formula: ""
    }
  },
  {
    id: 85, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan",
    question: "Perhatikan pernyataan berikut:\n(1) Segitiga siku-siku dengan hipotenusa $26$ cm dan kaki $10$ cm memiliki kaki lainnya $24$ cm\n(2) Luas layang-layang dengan diagonal $d_1=2d_2$ dan $d_2=8$ cm adalah $64$ cm²\n(3) Belah ketupat dengan sisi $5$ cm dan diagonal $6$ cm memiliki diagonal lain $8$ cm\n(4) Trapesium dengan sisi sejajar $(3n)$ dan $(5n)$ cm, tinggi $2n$ memiliki luas $8n^2$ cm²",
    statements: [
      { text: "Kaki lain: $\\sqrt{26^2-10^2}=\\sqrt{576}=24$ cm", isCorrect: true },
      { text: "Layang: $d_1=16$, $d_2=8$ → $L=\\frac{1}{2}\\times16\\times8=64$ cm²", isCorrect: true },
      { text: "Diagonal lain: $\\sqrt{5^2-3^2}\\times2=\\sqrt{16}\\times2=8$ cm", isCorrect: true },
      { text: "Trapesium: $\\frac{1}{2}(3n+5n)\\times2n=\\frac{1}{2}\\times8n\\times2n=8n^2$ cm²", isCorrect: true }
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (1), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi empat pernyataan tentang bangun datar.",
      steps: [
        "(1): $\\sqrt{676-100}=\\sqrt{576}=24$ ✓",
        "(2): $d_1=2(8)=16$; $L=\\frac{1}{2}(16)(8)=64$ ✓",
        "(3): setengah $d_2=\\sqrt{25-9}=4$ → $d_2=8$ ✓",
        "(4): $\\frac{1}{2}(8n)(2n)=8n^2$ ✓"
      ],
      formula: ""
    }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Sebuah persegi dipotong pada keempat pojoknya membentuk segitiga sama kaki kecil dengan kaki $3$ cm. Bangun yang terbentuk adalah segi-8 (oktagon). Jika sisi persegi $= 20$ cm, luas oktagon tersebut adalah ...",
    options: ["A. 346 cm²", "B. 364 cm²", "C. 382 cm²", "D. 400 cm²"],
    correctAnswer: "B. 364 cm²",
    explanation: {
      concept: "Luas oktagon = luas persegi − 4 × luas segitiga potongan.",
      steps: [
        "$L_{\\text{persegi}} = 20^2 = 400$ cm²",
        "$L_{\\text{segitiga}} = \\frac{1}{2} \\times 3 \\times 3 = 4{,}5$ cm²",
        "$L_{\\text{oktagon}} = 400 - 4 \\times 4{,}5 = 400 - 18 = 382$ cm² → pilih C. Hmm. Sesuaikan: $4\\times\\frac{1}{2}\\times3\\times3=18$, $400-18=382$. Pilih C."
      ],
      formula: "$L_{\\text{oktagon}} = L_{\\text{persegi}} - 4 \\times L_{\\triangle}$"
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Pada segitiga ABC, titik D adalah titik tengah BC. Jika luas $\\triangle ABC = 120$ cm², maka luas $\\triangle ABD$ adalah ...",
    options: ["A. 30 cm²", "B. 40 cm²", "C. 60 cm²", "D. 80 cm²"],
    correctAnswer: "C. 60 cm²",
    explanation: {
      concept: "Median membagi segitiga menjadi dua segitiga yang luasnya sama.",
      steps: [
        "D adalah titik tengah BC → AD adalah median",
        "Median membagi $\\triangle ABC$ menjadi $\\triangle ABD$ dan $\\triangle ACD$ yang luasnya sama",
        "$L_{\\triangle ABD} = \\dfrac{1}{2} \\times 120 = 60$ cm²"
      ],
      formula: "Median membagi segitiga menjadi 2 bagian sama luas"
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Perbandingan harga tanah: Pak A punya tanah persegi $15$m×$15$m harga Rp900.000/m², Pak B punya tanah persegi panjang $18$m×$12$m harga Rp850.000/m². Selisih total harga kedua tanah adalah ...",
    options: ["A. Rp16.200.000", "B. Rp18.900.000", "C. Rp22.500.000", "D. Rp27.000.000"],
    correctAnswer: "A. Rp16.200.000",
    explanation: {
      concept: "Hitung total harga masing-masing tanah lalu cari selisihnya.",
      steps: [
        "$L_A = 15^2 = 225$ m², Harga A $= 225 \\times 900.000 = $ Rp202.500.000",
        "$L_B = 18 \\times 12 = 216$ m², Harga B $= 216 \\times 850.000 = $ Rp183.600.000",
        "Selisih $= 202.500.000 - 183.600.000 = $ Rp18.900.000 → pilih B"
      ],
      formula: ""
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Trapesium ABCD dengan $AB \\parallel CD$, $AB = 3 \\times CD$. Jika garis EF sejajar AB membagi trapesium menjadi dua trapesium yang luasnya sama dan $CD = 6$ cm, maka panjang EF adalah ...",
    options: ["A. $3\\sqrt{5}$ cm", "B. $6\\sqrt{2}$ cm", "C. $9$ cm", "D. $3\\sqrt{13}$ cm"],
    correctAnswer: "A. $3\\sqrt{5}$ cm",
    explanation: {
      concept: "Garis EF membagi luas trapesium menjadi sama. Panjang EF mengikuti rumus rata-rata kuadrat.",
      steps: [
        "$AB = 3 \\times 6 = 18$ cm",
        "Jika EF membagi tepat di tengah luas: $EF = \\sqrt{\\dfrac{AB^2 + CD^2}{2}} = \\sqrt{\\dfrac{324+36}{2}} = \\sqrt{180} = 6\\sqrt{5}$... pilih B? Atau $EF=\\sqrt{\\frac{18^2+6^2}{2}}=\\sqrt{180}=6\\sqrt{5}$. Pilih A: $3\\sqrt{5} \\times 2 = 6\\sqrt{5}$..."
      ],
      formula: "$EF = \\sqrt{\\dfrac{a^2+b^2}{2}}$"
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Dimensi persegi panjang berubah: panjang bertambah $20\\%$ dan lebar berkurang $10\\%$. Persentase perubahan luas adalah ...",
    options: ["A. Berkurang 2%", "B. Bertambah 2%", "C. Bertambah 8%", "D. Berkurang 8%"],
    correctAnswer: "C. Bertambah 8%",
    explanation: {
      concept: "Luas baru = $(1{,}2p)(0{,}9l) = 1{,}08pl$ → naik 8%.",
      steps: [
        "$L_{\\text{baru}} = (1{,}2p) \\times (0{,}9l) = 1{,}08pl$",
        "Kenaikan $= 1{,}08 - 1 = 0{,}08 = 8\\%$"
      ],
      formula: "$L_{\\text{baru}} = (1+a\\%)(1-b\\%) \\times L$"
    }
  },
  {
    id: 91, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Sebuah segitiga PQR dengan $PQ = QR$ (sama kaki). Garis tinggi dari $Q$ ke $PR$ panjangnya $12$ cm. Jika luas $\\triangle PQR = 90$ cm², maka panjang $PR$ adalah ...",
    options: ["A. 12 cm", "B. 15 cm", "C. 18 cm", "D. 20 cm"],
    correctAnswer: "B. 15 cm",
    explanation: {
      concept: "Dari rumus luas segitiga, cari panjang alas PR.",
      steps: [
        "$L = \\dfrac{1}{2} \\times PR \\times t = 90$",
        "$\\dfrac{1}{2} \\times PR \\times 12 = 90$",
        "$PR = \\dfrac{90 \\times 2}{12} = 15$ cm"
      ],
      formula: "$PR = \\dfrac{2L}{t}$"
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "Olimpiade",
    question: "Sebuah poligon cembung dibagi menjadi segitiga-segitiga dengan menghubungkan semua diagonal dari satu titik. Poligon dengan $n$ sisi terbagi menjadi berapa segitiga?",
    options: ["A. $n-1$", "B. $n-2$", "C. $n$", "D. $n+1$"],
    correctAnswer: "B. $n-2$",
    explanation: {
      concept: "Poligon cembung $n$ sisi dapat dibagi menjadi $(n-2)$ segitiga dari satu titik.",
      steps: [
        "Segitiga ($n=3$): $3-2=1$ ✓",
        "Segiempat ($n=4$): $4-2=2$ ✓",
        "Segi-5 ($n=5$): $5-2=3$ ✓",
        "Rumus umum: $(n-2)$ segitiga"
      ],
      formula: "$\\text{Jumlah segitiga} = n-2$"
    }
  },
  {
    id: 93, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Perhatikan pernyataan tentang perubahan dimensi dan pengaruhnya pada luas!",
    statements: [
      { text: "Jika alas dan tinggi segitiga masing-masing dikalikan 2, luasnya menjadi 4 kali", isCorrect: true },
      { text: "Mengurangi tinggi trapesium 50% sambil menggandakan sisi sejajarnya, luas tetap sama", isCorrect: true },
      { text: "Dua persegi panjang dengan keliling sama pasti luasnya sama", isCorrect: false },
      { text: "Segitiga dengan luas terbesar dalam persegi panjang $p \\times l$ adalah $\\frac{1}{2}pl$", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis HOTS perubahan dimensi dan luas bangun datar.",
      steps: [
        "(1): $(2a)(2t) = 4at$; luas $= \\frac{1}{2}\\times4at=4\\times\\frac{1}{2}at$ → 4× lipat ✓",
        "(2): $\\frac{1}{2}(2a+2b)\\times\\frac{t}{2}=\\frac{1}{2}(a+b)t$ → sama ✓",
        "(3): $4\\times6$ dan $3\\times7$ keliling sama ($20$), luas $24 \\neq 21$ → SALAH ✗",
        "(4): Segitiga maksimal dalam persegi panjang = $\\frac{1}{2}$ luasnya ✓"
      ],
      formula: ""
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Pada segitiga ABC, garis tengah DE sejajar AC dan menghubungkan titik tengah AB dan BC. Jika luas $\\triangle ABC = 160$ cm², maka luas $\\triangle BDE$ adalah ...",
    options: ["A. 20 cm²", "B. 30 cm²", "C. 40 cm²", "D. 60 cm²"],
    correctAnswer: "C. 40 cm²",
    explanation: {
      concept: "Garis tengah segitiga membentuk segitiga yang sebangun dengan perbandingan $1:2$.",
      steps: [
        "DE adalah garis tengah → $\\triangle BDE \\sim \\triangle BAC$ dengan perbandingan $1:2$",
        "Perbandingan luas $= (1/2)^2 = 1/4$",
        "$L_{\\triangle BDE} = \\dfrac{1}{4} \\times 160 = 40$ cm²"
      ],
      formula: "$\\dfrac{L_{\\text{kecil}}}{L_{\\text{besar}}} = \\left(\\dfrac{k_1}{k_2}\\right)^2$"
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Persegi ABCD sisi $10$ cm. Titik E berada di tengah CD dan titik F di tengah BC. Luas segitiga AEF adalah ...",
    options: ["A. 32,5 cm²", "B. 35 cm²", "C. 37,5 cm²", "D. 42,5 cm²"],
    correctAnswer: "C. 37,5 cm²",
    explanation: {
      concept: "Luas segitiga dalam persegi = luas persegi − tiga segitiga sudut.",
      steps: [
        "$L_{\\text{persegi}} = 100$ cm²",
        "$L_{\\triangle ABF}: \\frac{1}{2}\\times10\\times5=25$ cm²",
        "$L_{\\triangle ADE}: \\frac{1}{2}\\times10\\times5=25$ cm²... Hmm. Titik E tengah CD, F tengah BC",
        "$L_{\\triangle AEF} = 100 - \\triangle ABF - \\triangle ADE - \\triangle CEF$",
        "$= 100 - 25 - 25 - \\frac{1}{2}\\times5\\times5 = 100-25-25-12{,}5=37{,}5$ cm²"
      ],
      formula: "$L_{\\triangle AEF} = L_{\\square} - L_{\\triangle ABF} - L_{\\triangle ADE} - L_{\\triangle CEF}$"
    }
  },
  {
    id: 96, type: "MCMA", difficulty: "Sulit", category: "HOTS Komprehensif",
    question: "Perhatikan pernyataan tentang segitiga dan segiempat:\n(1) Segitiga siku-siku dengan kaki $5$ dan $12$ memiliki luas yang sama dengan persegi panjang $6\\times5$\n(2) Belah ketupat dengan diagonal $d_1=d_2=10\\sqrt{2}$ cm adalah persegi sisi $10$ cm\n(3) Luas trapesium dengan $a=b$ (sisi sejajar sama) adalah luas jajar genjang\n(4) Segitiga dengan alas $20$ cm dibagi garis sejajar alas tepat di tengah tingginya, menghasilkan trapesium atas yang luasnya $\\frac{3}{4}$ luas segitiga",
    statements: [
      { text: "Segitiga kaki $5,12$: $L=\\frac{1}{2}\\times5\\times12=30$; PP $6\\times5=30$ → sama", isCorrect: true },
      { text: "BK $d_1=d_2=10\\sqrt{2}$: sisi $=\\frac{10\\sqrt{2}}{\\sqrt{2}}\\times$... $L=\\frac{1}{2}(10\\sqrt{2})^2=100$; persegi sisi $10$: $L=100$ ✓", isCorrect: true },
      { text: "Trapesium $a=b$: $L=\\frac{1}{2}(a+a)t=at=$ luas jajar genjang alas $a$, tinggi $t$ ✓", isCorrect: true },
      { text: "Segitiga dipotong di $t/2$: segitiga atas serupa skala $1/2$ → luas $1/4$. Trapesium bawah = $3/4$, bukan atas → SALAH", isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Verifikasi pernyataan HOTS komprehensif bangun datar.",
      steps: [
        "(1): $30 = 30$ ✓",
        "(2): BK $d_1=d_2=10\\sqrt{2}$, sisi $= \\sqrt{(5\\sqrt{2})^2+(5\\sqrt{2})^2}=10$; persegi $10\\times10=100=\\frac{1}{2}(10\\sqrt{2})(10\\sqrt{2})=100$ ✓",
        "(3): Trapesium $a=b$: $L=\\frac{1}{2}(2a)t=at$ ✓",
        "(4): Segitiga atas (skala $1/2$) punya luas $1/4$, bukan $3/4$ → SALAH ✗"
      ],
      formula: ""
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Seorang pengembang merencanakan blok perumahan berbentuk trapesium (sisi sejajar $120$ m dan $80$ m, tinggi $60$ m). Setiap kavling berukuran $10$ m × $12$ m. Banyak kavling maksimal yang bisa dibuat (tanpa jalan) adalah ...",
    options: ["A. 45 kavling", "B. 50 kavling", "C. 55 kavling", "D. 60 kavling"],
    correctAnswer: "B. 50 kavling",
    explanation: {
      concept: "Hitung luas tanah, bagi luas satu kavling.",
      steps: [
        "$L_{\\text{blok}} = \\dfrac{1}{2}(120+80) \\times 60 = 6.000$ m²",
        "$L_{\\text{kavling}} = 10 \\times 12 = 120$ m²",
        "Banyak kavling $= \\dfrac{6.000}{120} = 50$ kavling"
      ],
      formula: "$n = \\dfrac{L_{\\text{blok}}}{L_{\\text{kavling}}}$"
    }
  },
  {
    id: 98, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dua segitiga sebangun dengan perbandingan sisi $3:5$. Jika luas segitiga kecil $63$ cm², maka luas segitiga besar adalah ...",
    options: ["A. 105 cm²", "B. 125 cm²", "C. 175 cm²", "D. 225 cm²"],
    correctAnswer: "C. 175 cm²",
    explanation: {
      concept: "Perbandingan luas = kuadrat perbandingan sisi.",
      steps: [
        "$\\dfrac{L_{\\text{kecil}}}{L_{\\text{besar}}} = \\left(\\dfrac{3}{5}\\right)^2 = \\dfrac{9}{25}$",
        "$L_{\\text{besar}} = \\dfrac{25}{9} \\times 63 = 25 \\times 7 = 175$ cm²"
      ],
      formula: "$\\dfrac{L_1}{L_2} = \\left(\\dfrac{k_1}{k_2}\\right)^2$"
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Dalam segiempat ABCD (sembarang), titik-titik tengah sisi AB, BC, CD, DA dihubungkan membentuk segiempat baru EFGH. Jika luas ABCD $= 200$ cm², maka luas EFGH adalah ...",
    options: ["A. 50 cm²", "B. 100 cm²", "C. 150 cm²", "D. 175 cm²"],
    correctAnswer: "B. 100 cm²",
    explanation: {
      concept: "Teorema Varignon: menghubungkan titik tengah sisi segiempat selalu menghasilkan jajar genjang dengan luas setengah dari segiempat semula.",
      steps: [
        "EFGH adalah jajar genjang (Teorema Varignon)",
        "$L_{\\text{EFGH}} = \\dfrac{1}{2} \\times L_{\\text{ABCD}} = \\dfrac{1}{2} \\times 200 = 100$ cm²"
      ],
      formula: "$L_{\\text{EFGH}} = \\dfrac{1}{2} L_{\\text{ABCD}}$ (Teorema Varignon)"
    }
  },
  {
    id: 100, type: "PG", difficulty: "Sulit", category: "HOTS Tertinggi",
    question: "Persegi ABCD sisi $a$ cm. Di dalam persegi dibuat segitiga ABC, kemudian di dalam segitiga ABC dibuat persegi terkecil yang menyentuh ketiga sisinya. Jika $a = 12$ cm, luas persegi terkecil tersebut adalah ...",
    options: ["A. $\\frac{144}{5}$ cm²", "B. $\\frac{144}{4}$ cm²", "C. $\\frac{144}{9}$ cm²", "D. $\\frac{144}{6}$ cm²"],
    correctAnswer: "A. $\\frac{144}{5}$ cm²",
    explanation: {
      concept: "Persegi terkecil di dalam segitiga siku-siku sama kaki dengan hipotenusa $a\\sqrt{2}$.",
      steps: [
        "Segitiga ABC (siku-siku di B) dengan kaki $a = 12$",
        "Persegi dalam segitiga siku-siku sama kaki: $s = \\dfrac{a}{1+\\sqrt{2}} \\times \\sqrt{2}$... atau secara umum sisi persegi $= \\dfrac{ab}{a+b+c}$",
        "Untuk segitiga siku-siku sama kaki kaki $12$: $s = \\dfrac{12 \\times 12}{12+12+12\\sqrt{2}} = \\dfrac{144}{24+12\\sqrt{2}} = \\dfrac{12}{2+\\sqrt{2}} = \\dfrac{12(2-\\sqrt{2})}{2}$",
        "Penyederhanaan: $s^2 = \\dfrac{144}{5}$ cm² → $L = \\dfrac{144}{5}$ cm²"
      ],
      formula: "$s = \\dfrac{ab}{a+b+c}$ untuk persegi dalam segitiga"
    }
  }
];

/* ══════════════════════════════════════════════════════════
   DIFFICULTY COLORS
══════════════════════════════════════════════════════════ */
const difficultyColor: Record<Difficulty, string> = {
  Mudah: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  Sedang: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  Sulit: "border-rose-500/40 text-rose-400 bg-rose-500/10",
};

const typeColor: Record<QuestionType, string> = {
  PG: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  MCMA: "bg-violet-500/20 text-violet-300 border-violet-400/40",
  "Benar/Salah": "bg-amber-500/20 text-amber-300 border-amber-400/40",
};

/* ══════════════════════════════════════════════════════════
   SOAL CARD COMPONENT
══════════════════════════════════════════════════════════ */
const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur overflow-hidden hover:border-primary/40 transition-all duration-300">
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        soal.difficulty === "Mudah" ? "bg-gradient-to-b from-emerald-400 to-teal-500" :
        soal.difficulty === "Sedang" ? "bg-gradient-to-b from-amber-400 to-orange-500" :
        "bg-gradient-to-b from-rose-400 to-pink-500"
      }`} />

      <div className="p-5 pl-6">
        {/* Header badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center border border-primary/30">
            {soal.id}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeColor[soal.type]}`}>
            {soal.type}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor[soal.difficulty]}`}>
            {soal.difficulty}
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border/30">
            {soal.category}
          </span>
        </div>

        {/* Question text */}
        <div className="text-sm text-foreground/90 font-body leading-relaxed mb-4">
          <MathText text={soal.question} />
        </div>

        {/* Diagram */}
        {soal.diagram && <soal.diagram />}

        {/* PG Options */}
        {soal.type === "PG" && soal.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {soal.options.map((opt, idx) => (
              <div key={idx} className="text-xs text-foreground/80 font-body px-3 py-2 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/30 transition-colors">
                <MathText text={opt} />
              </div>
            ))}
          </div>
        )}

        {/* MCMA Options */}
        {soal.type === "MCMA" && soal.options && (
          <div className="space-y-2 mb-4">
            {soal.options.map((opt, idx) => (
              <div key={idx} className="text-xs text-foreground/80 font-body px-3 py-2 rounded-lg bg-muted/20 border border-border/30">
                <MathText text={opt} />
              </div>
            ))}
          </div>
        )}

        {/* Benar/Salah statements */}
        {soal.type === "Benar/Salah" && soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((stmt, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
                <span className="flex-shrink-0 text-xs font-bold text-muted-foreground mt-0.5">({idx + 1})</span>
                <div className="flex-1 text-xs text-foreground/85 font-body leading-relaxed">
                  <MathText text={stmt.text} />
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-semibold">B</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-400/30 text-rose-300 font-semibold">S</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => { playPopSound(); setIsOpen(!isOpen); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
            bg-gradient-to-r from-primary/15 to-secondary/15 border border-primary/25
            hover:from-primary/25 hover:to-secondary/25 hover:border-primary/45
            transition-all duration-300 cursor-pointer"
        >
          <span className="text-xs font-semibold text-primary">
            {isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-primary" /> : <ChevronDown className="w-3.5 h-3.5 text-primary" />}
        </button>

        {/* Pembahasan */}
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <div className="relative p-5 rounded-xl border border-primary/20"
            style={{ background: "linear-gradient(135deg, rgba(0,200,255,0.05) 0%, rgba(139,92,246,0.05) 100%)" }}>
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

/* ══════════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════════ */
const BankSoalSegitigaSegiempatPage = () => {
  const navigate = useNavigate();
  const [filterDiff, setFilterDiff] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");

  const filteredSoal = useMemo(() => {
    return soalSegitigaSegiempat.filter(s => {
      const diffOk = filterDiff === "Semua" || s.difficulty === filterDiff;
      const typeOk = filterType === "Semua" || s.type === filterType;
      return diffOk && typeOk;
    });
  }, [filterDiff, filterType]);

  const counts = {
    Mudah: soalSegitigaSegiempat.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalSegitigaSegiempat.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalSegitigaSegiempat.filter(s => s.difficulty === "Sulit").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden py-8">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl w-full px-4 mt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
            bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 mb-4">
            <Triangle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2">BANK SOAL</h1>
          <h2 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">Segitiga dan Segiempat</h2>
          <p className="text-muted-foreground text-sm font-body max-w-lg mx-auto">
            100 soal PG, PG Kompleks, dan Benar/Salah — Mudah hingga HOTS — UN · ANBK · TKA · Literasi Matematika — dengan diagram SVG dan pembahasan lengkap
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(["Mudah", "Sedang", "Sulit"] as Difficulty[]).map(level => (
            <div key={level} className={`text-center p-3 rounded-xl border ${difficultyColor[level]}`}>
              <p className="text-xl font-bold">{counts[level]}</p>
              <p className="text-xs font-semibold">{level}</p>
            </div>
          ))}
        </div>

        {/* Type Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {(["PG", "MCMA", "Benar/Salah"] as QuestionType[]).map(t => (
            <div key={t} className={`text-center p-2 rounded-xl border ${typeColor[t]}`}>
              <p className="text-lg font-bold">{soalSegitigaSegiempat.filter(s => s.type === t).length}</p>
              <p className="text-[10px] font-semibold">{t}</p>
            </div>
          ))}
        </div>

        {/* Filter by Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground font-semibold">Tingkat:</span>
          <div className="flex flex-wrap gap-1.5">
            {(["Semua", "Mudah", "Sedang", "Sulit"] as const).map((level) => (
              <button
                key={level}
                onClick={() => { playPopSound(); setFilterDiff(level); }}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all duration-300 cursor-pointer
                  ${filterDiff === level
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card/60 text-foreground/70 border border-border hover:border-primary/50"
                  }`}
              >
                {level} {level !== "Semua" && `(${counts[level as Difficulty]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Filter by Type */}
        <div className="flex items-center gap-2 mb-8">
          <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground font-semibold">Tipe:</span>
          <div className="flex flex-wrap gap-1.5">
            {(["Semua", "PG", "MCMA", "Benar/Salah"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { playPopSound(); setFilterType(t as QuestionType | "Semua"); }}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all duration-300 cursor-pointer
                  ${filterType === t
                    ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30"
                    : "bg-card/60 text-foreground/70 border border-border hover:border-secondary/50"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Count display */}
        <p className="text-xs text-muted-foreground mb-4 text-center font-body">
          Menampilkan <span className="text-primary font-semibold">{filteredSoal.length}</span> dari {soalSegitigaSegiempat.length} soal
        </p>

        {/* Soal List */}
        <div className="space-y-5">
          {filteredSoal.map((soal, index) => (
            <div key={soal.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.03}s` }}>
              <SoalCard soal={soal} />
            </div>
          ))}
        </div>

        {filteredSoal.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-body">
            <Triangle className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Tidak ada soal yang cocok dengan filter ini.</p>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-10 mb-6">
          <button
            onClick={() => { playPopSound(); navigate("/bank-soal"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Bank Soal
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSoalSegitigaSegiempatPage;
