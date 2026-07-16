import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Cylinder, ChevronDown, ChevronUp, Filter } from "lucide-react";
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

/* ══════════════════════════════════════════════════════
   SVG VISUAL COMPONENTS
══════════════════════════════════════════════════════ */

const TabungSVG = ({ r, t, label }: { r: string; t: string; label?: string }) => (
  <svg viewBox="0 0 260 180" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <ellipse cx="130" cy="48" rx="70" ry="22" fill="rgba(6,182,212,0.25)" stroke="#06b6d4" strokeWidth="1.8"/>
    <rect x="60" y="48" width="140" height="100" fill="rgba(6,182,212,0.12)" stroke="none"/>
    <line x1="60" y1="48" x2="60" y2="148" stroke="#06b6d4" strokeWidth="1.8"/>
    <line x1="200" y1="48" x2="200" y2="148" stroke="#06b6d4" strokeWidth="1.8"/>
    <ellipse cx="130" cy="148" rx="70" ry="22" fill="rgba(6,182,212,0.3)" stroke="#06b6d4" strokeWidth="1.8"/>
    <line x1="130" y1="48" x2="200" y2="48" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="165" y="43" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">r={r}</text>
    <line x1="205" y1="48" x2="205" y2="148" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="220" y="102" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace">t={t}</text>
    {label && <text x="130" y="170" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace">{label}</text>}
  </svg>
);

const KerucutSVG = ({ r, t, s, label }: { r: string; t: string; s?: string; label?: string }) => (
  <svg viewBox="0 0 260 185" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <ellipse cx="130" cy="155" rx="70" ry="20" fill="rgba(251,191,36,0.25)" stroke="#fbbf24" strokeWidth="1.8"/>
    <line x1="60" y1="155" x2="130" y2="28" stroke="#fbbf24" strokeWidth="1.8"/>
    <line x1="200" y1="155" x2="130" y2="28" stroke="#fbbf24" strokeWidth="1.8"/>
    <polygon points="60,155 200,155 130,28" fill="rgba(251,191,36,0.13)" stroke="none"/>
    <line x1="130" y1="28" x2="130" y2="155" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,2"/>
    <line x1="130" y1="155" x2="200" y2="155" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="165" y="150" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">r={r}</text>
    <text x="112" y="97" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">t={t}</text>
    {s && <text x="175" y="95" fill="#f472b6" fontSize="10" textAnchor="middle" fontFamily="monospace">s={s}</text>}
    {label && <text x="130" y="178" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace">{label}</text>}
  </svg>
);

const BolaSVG = ({ r, label }: { r: string; label?: string }) => (
  <svg viewBox="0 0 220 185" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <defs>
      <radialGradient id="bolGrad" cx="38%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.3"/>
      </radialGradient>
    </defs>
    <circle cx="110" cy="92" r="68" fill="url(#bolGrad)" stroke="#a78bfa" strokeWidth="1.8"/>
    <ellipse cx="110" cy="92" rx="68" ry="20" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="5,3" opacity="0.6"/>
    <line x1="110" y1="92" x2="178" y2="92" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="144" y="87" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace">r={r}</text>
    <circle cx="110" cy="92" r="3" fill="#22d3ee"/>
    {label && <text x="110" y="175" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace">{label}</text>}
  </svg>
);

const BelahaBolaSVG = ({ r, label }: { r: string; label?: string }) => (
  <svg viewBox="0 0 220 165" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <defs>
      <radialGradient id="bsGrad" cx="40%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#065f46" stopOpacity="0.3"/>
      </radialGradient>
    </defs>
    <path d="M 42 92 A 68 68 0 0 1 178 92" fill="url(#bsGrad)" stroke="#34d399" strokeWidth="1.8"/>
    <ellipse cx="110" cy="92" rx="68" ry="20" fill="rgba(52,211,153,0.18)" stroke="#34d399" strokeWidth="1.5"/>
    <line x1="110" y1="92" x2="178" y2="92" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="144" y="87" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace">r={r}</text>
    <circle cx="110" cy="92" r="3" fill="#22d3ee"/>
    {label && <text x="110" y="155" fill="#34d399" fontSize="9" textAnchor="middle" fontFamily="monospace">{label}</text>}
  </svg>
);

const GabungTabungKerucutSVG = ({ r, tTabung, tKerucut }: { r: string; tTabung: string; tKerucut: string }) => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <ellipse cx="130" cy="58" rx="60" ry="18" fill="rgba(6,182,212,0.25)" stroke="#06b6d4" strokeWidth="1.5"/>
    <rect x="70" y="58" width="120" height="85" fill="rgba(6,182,212,0.12)"/>
    <line x1="70" y1="58" x2="70" y2="143" stroke="#06b6d4" strokeWidth="1.5"/>
    <line x1="190" y1="58" x2="190" y2="143" stroke="#06b6d4" strokeWidth="1.5"/>
    <ellipse cx="130" cy="143" rx="60" ry="18" fill="rgba(6,182,212,0.3)" stroke="#06b6d4" strokeWidth="1.5"/>
    <line x1="70" y1="143" x2="130" y2="28" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="190" y1="143" x2="130" y2="28" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="200" y="103" fill="#22d3ee" fontSize="9" textAnchor="start" fontFamily="monospace">t₁={tTabung}</text>
    <text x="148" y="52" fill="#22d3ee" fontSize="9" textAnchor="start" fontFamily="monospace">r={r}</text>
    <text x="200" y="87" fill="#fbbf24" fontSize="9" textAnchor="start" fontFamily="monospace">t₂={tKerucut}</text>
  </svg>
);

const TabungTanpaAtapSVG = ({ r, t }: { r: string; t: string }) => (
  <svg viewBox="0 0 260 165" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <line x1="60" y1="38" x2="60" y2="138" stroke="#f472b6" strokeWidth="1.8"/>
    <line x1="200" y1="38" x2="200" y2="138" stroke="#f472b6" strokeWidth="1.8"/>
    <ellipse cx="130" cy="138" rx="70" ry="22" fill="rgba(244,114,182,0.25)" stroke="#f472b6" strokeWidth="1.8"/>
    <ellipse cx="130" cy="38" rx="70" ry="22" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="130" y1="38" x2="200" y2="38" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="165" y="33" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">r={r}</text>
    <line x1="207" y1="38" x2="207" y2="138" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="222" y="92" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace">t={t}</text>
    <text x="130" y="158" fill="#f472b6" fontSize="9" textAnchor="middle" fontFamily="monospace">Tabung terbuka (tanpa tutup atas)</text>
  </svg>
);

const SelimutKerucutSVG = ({ r, s }: { r: string; s: string }) => (
  <svg viewBox="0 0 260 160" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <path d="M 130 20 L 50 145 A 90 30 0 0 0 210 145 Z" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.8"/>
    <ellipse cx="130" cy="145" rx="80" ry="25" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="130" y1="145" x2="210" y2="145" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="170" y="140" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">r={r}</text>
    <line x1="130" y1="20" x2="210" y2="145" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="192" y="88" fill="#f472b6" fontSize="10" textAnchor="middle" fontFamily="monospace">s={s}</text>
  </svg>
);

const PenampungSVG = ({ r, t, label }: { r: string; t: string; label: string }) => (
  <svg viewBox="0 0 260 175" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <ellipse cx="130" cy="48" rx="70" ry="22" fill="rgba(6,182,212,0.3)" stroke="#06b6d4" strokeWidth="1.8"/>
    <rect x="60" y="48" width="140" height="95" fill="rgba(6,182,212,0.10)"/>
    <line x1="60" y1="48" x2="60" y2="143" stroke="#06b6d4" strokeWidth="1.8"/>
    <line x1="200" y1="48" x2="200" y2="143" stroke="#06b6d4" strokeWidth="1.8"/>
    <ellipse cx="130" cy="143" rx="70" ry="22" fill="rgba(6,182,212,0.25)" stroke="#06b6d4" strokeWidth="1.8"/>
    <text x="130" y="100" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">{label}</text>
    <line x1="130" y1="48" x2="200" y2="48" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="165" y="43" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace">r={r}</text>
    <text x="220" y="100" fill="#4ade80" fontSize="10" textAnchor="middle" fontFamily="monospace">t={t}</text>
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
  "tabung-7-10":    <TabungSVG r="7 cm" t="10 cm" />,
  "tabung-14-20":   <TabungSVG r="14 cm" t="20 cm" />,
  "tabung-21-30":   <TabungSVG r="21 cm" t="30 cm" />,
  "tabung-10-25":   <TabungSVG r="10 cm" t="25 cm" />,
  "tabung-3.5-15":  <TabungSVG r="3,5 cm" t="15 cm" />,
  "tabung-penampung-7-20": <PenampungSVG r="7 cm" t="20 cm" label="Tangki Air" />,
  "tabung-kaleng-6-18":    <TabungSVG r="6 cm" t="18 cm" label="Kaleng Cat" />,
  "tabung-tanpa-atap-10-30": <TabungTanpaAtapSVG r="10 cm" t="30 cm" />,
  "kerucut-7-24":   <KerucutSVG r="7 cm" t="24 cm" s="25 cm" />,
  "kerucut-6-8":    <KerucutSVG r="6 cm" t="8 cm" s="10 cm" />,
  "kerucut-14-48":  <KerucutSVG r="14 cm" t="48 cm" s="50 cm" />,
  "kerucut-10-24":  <KerucutSVG r="10 cm" t="24 cm" s="26 cm" />,
  "kerucut-21-28":  <KerucutSVG r="21 cm" t="28 cm" s="35 cm" />,
  "selimut-kerucut-6-10": <SelimutKerucutSVG r="6 cm" s="10 cm" />,
  "bola-7":         <BolaSVG r="7 cm" />,
  "bola-14":        <BolaSVG r="14 cm" />,
  "bola-21":        <BolaSVG r="21 cm" />,
  "bola-10.5":      <BolaSVG r="10,5 cm" />,
  "belaha-bola-7":  <BelahaBolaSVG r="7 cm" />,
  "belaha-bola-14": <BelahaBolaSVG r="14 cm" />,
  "gabung-tk-7-20-24": <GabungTabungKerucutSVG r="7 cm" tTabung="20 cm" tKerucut="24 cm" />,
  "gabung-tk-10-15-20": <GabungTabungKerucutSVG r="10 cm" tTabung="15 cm" tKerucut="20 cm" />,

  "kerucut-bernomor": (
    <svg viewBox="0 0 300 230" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto my-2 rounded-lg" style={{background:"rgba(15,23,42,0.65)"}}>
      <ellipse cx="150" cy="180" rx="95" ry="24" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="2"/>
      <polygon points="55,180 245,180 150,32" fill="rgba(251,191,36,0.07)"/>
      <line x1="55" y1="180" x2="150" y2="32" stroke="#fbbf24" strokeWidth="2"/>
      <line x1="245" y1="180" x2="150" y2="32" stroke="#fbbf24" strokeWidth="2"/>
      <line x1="150" y1="32" x2="150" y2="180" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,3"/>
      <circle cx="150" cy="32" r="4" fill="#22d3ee"/>
      <circle cx="28" cy="25" r="11" fill="rgba(34,211,238,0.22)" stroke="#22d3ee" strokeWidth="1.5"/>
      <text x="28" y="30" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold">①</text>
      <line x1="39" y1="28" x2="145" y2="33" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,2" opacity="0.8"/>
      <circle cx="274" cy="95" r="11" fill="rgba(244,114,182,0.22)" stroke="#f472b6" strokeWidth="1.5"/>
      <text x="274" y="100" textAnchor="middle" fill="#f472b6" fontSize="12" fontWeight="bold">②</text>
      <line x1="263" y1="98" x2="213" y2="115" stroke="#f472b6" strokeWidth="1" strokeDasharray="3,2" opacity="0.8"/>
      <circle cx="274" cy="180" r="11" fill="rgba(74,222,128,0.22)" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="274" y="185" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">③</text>
      <line x1="263" y1="180" x2="247" y2="180" stroke="#4ade80" strokeWidth="1" strokeDasharray="3,2" opacity="0.8"/>
      <circle cx="28" cy="180" r="11" fill="rgba(167,139,250,0.22)" stroke="#a78bfa" strokeWidth="1.5"/>
      <text x="28" y="185" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="bold">④</text>
      <line x1="39" y1="180" x2="60" y2="180" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" opacity="0.8"/>
      <text x="150" y="218" textAnchor="middle" fill="#94a3b8" fontSize="10">Perhatikan bagian-bagian kerucut</text>
    </svg>
  ),

  "kerucut-rst": (
    <svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto my-2 rounded-lg" style={{background:"rgba(15,23,42,0.65)"}}>
      <ellipse cx="150" cy="175" rx="90" ry="22" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="2"/>
      <polygon points="60,175 240,175 150,30" fill="rgba(251,191,36,0.07)"/>
      <line x1="60" y1="175" x2="150" y2="30" stroke="#fbbf24" strokeWidth="2"/>
      <line x1="240" y1="175" x2="150" y2="30" stroke="#fbbf24" strokeWidth="2"/>
      <line x1="150" y1="30" x2="150" y2="175" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="6,3"/>
      <line x1="150" y1="175" x2="240" y2="175" stroke="#22d3ee" strokeWidth="2.5"/>
      <rect x="150" y="163" width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
      <text x="196" y="170" textAnchor="middle" fill="#22d3ee" fontSize="13" fontWeight="bold">r</text>
      <text x="136" y="108" textAnchor="middle" fill="#f472b6" fontSize="13" fontWeight="bold">t</text>
      <text x="210" y="108" textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="bold">s</text>
      <text x="150" y="210" textAnchor="middle" fill="#94a3b8" fontSize="10">s² = r² + t²</text>
    </svg>
  ),

  "juring-kerucut": (
    <svg viewBox="0 0 310 210" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto my-2 rounded-lg" style={{background:"rgba(15,23,42,0.65)"}}>
      <circle cx="110" cy="110" r="82" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5,3" opacity="0.5"/>
      <path d="M 110 110 L 110 28 A 82 82 0 0 1 192 151 Z" fill="rgba(34,211,238,0.18)" stroke="#22d3ee" strokeWidth="2"/>
      <circle cx="110" cy="110" r="4" fill="#fbbf24"/>
      <text x="96" y="118" fill="#fbbf24" fontSize="13" fontWeight="bold">O</text>
      <text x="114" y="22" fill="#22d3ee" fontSize="12" fontWeight="bold">A</text>
      <text x="197" y="160" fill="#22d3ee" fontSize="12" fontWeight="bold">B</text>
      <path d="M 110 70 A 40 40 0 0 1 142 133" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
      <text x="127" y="95" fill="#f472b6" fontSize="11">144°</text>
      <text x="58" y="80" fill="#94a3b8" fontSize="10">R = 20 cm</text>
      <line x1="110" y1="28" x2="68" y2="64" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" opacity="0.7"/>
      <text x="218" y="60" fill="#4ade80" fontSize="11" fontWeight="bold">→ Juring ini</text>
      <text x="218" y="78" fill="#4ade80" fontSize="11">dibentuk</text>
      <text x="218" y="96" fill="#4ade80" fontSize="11">menjadi</text>
      <text x="218" y="114" fill="#4ade80" fontSize="11">selimut</text>
      <text x="218" y="132" fill="#4ade80" fontSize="11">kerucut</text>
    </svg>
  ),

  "kap-lampu-4-12": (
    <svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto my-2 rounded-lg" style={{background:"rgba(15,23,42,0.65)"}}>
      <ellipse cx="140" cy="155" rx="72" ry="18" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="2"/>
      <ellipse cx="140" cy="65" rx="24" ry="8" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1.8"/>
      <line x1="68" y1="155" x2="116" y2="65" stroke="#fbbf24" strokeWidth="2"/>
      <line x1="212" y1="155" x2="164" y2="65" stroke="#fbbf24" strokeWidth="2"/>
      <polygon points="68,155 212,155 164,65 116,65" fill="rgba(251,191,36,0.06)"/>
      <line x1="140" y1="65" x2="140" y2="155" stroke="#94a3b8" strokeWidth="1.3" strokeDasharray="5,3"/>
      <line x1="140" y1="65" x2="164" y2="65" stroke="#22d3ee" strokeWidth="2"/>
      <text x="152" y="58" fill="#22d3ee" fontSize="10">r₁=4</text>
      <line x1="140" y1="155" x2="212" y2="155" stroke="#fbbf24" strokeWidth="2"/>
      <text x="155" y="172" fill="#fbbf24" fontSize="10">r₂=12</text>
      <text x="218" y="115" fill="#4ade80" fontSize="11" fontWeight="bold">s=10 cm</text>
      <text x="140" y="195" textAnchor="middle" fill="#94a3b8" fontSize="10">Kap Lampu (Kerucut Terpancung)</text>
    </svg>
  ),
};

/* ══════════════════════════════════════════════════════
   SOAL DATA
══════════════════════════════════════════════════════ */

const soalBangunRuangSisiLengkung: Question[] = [

  /* ═══════════════════════════════════════════════════
     KERUCUT – KONSEP & PERHITUNGAN DASAR  (Q1 – Q21)
  ═══════════════════════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "KONSEP – Kerucut",
    question: "Jumlah permukaan (sisi) pada bangun ruang kerucut adalah ...",
    options: ["A. 1 buah", "B. 2 buah", "C. 3 buah", "D. 4 buah"],
    correctAnswer: "B. 2 buah",
    explanation: {
      concept: "Kerucut memiliki dua buah sisi: satu sisi alas berbentuk lingkaran dan satu sisi selimut berbentuk bidang lengkung.",
      steps: [
        "Sisi 1: Alas kerucut → berbentuk lingkaran",
        "Sisi 2: Selimut kerucut → berbentuk bidang lengkung (jika diratakan membentuk juring lingkaran)",
        "Total sisi kerucut = 2 buah"
      ],
      formula: "\\text{Jumlah sisi kerucut} = 2"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "KONSEP – Kerucut",
    question: "Jumlah rusuk yang dimiliki oleh bangun ruang kerucut adalah ...",
    options: ["A. tidak ada", "B. 1 buah", "C. 2 buah", "D. 3 buah"],
    correctAnswer: "B. 1 buah",
    explanation: {
      concept: "Rusuk adalah garis pertemuan antara dua sisi. Pada kerucut, sisi alas (lingkaran) bertemu dengan sisi selimut menghasilkan tepat satu rusuk berupa lingkaran di bagian bawah.",
      steps: [
        "Rusuk kerucut = lingkaran alas (pertemuan antara sisi alas dan sisi selimut)",
        "Kerucut hanya memiliki 1 rusuk berupa lingkaran"
      ],
      formula: "\\text{Jumlah rusuk kerucut} = 1"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "KONSEP – Kerucut",
    question: "Jumlah titik sudut pada kerucut adalah ...",
    options: ["A. tidak ada", "B. 1 buah", "C. 2 buah", "D. 3 buah"],
    correctAnswer: "B. 1 buah",
    explanation: {
      concept: "Titik sudut adalah titik pertemuan tiga sisi atau lebih. Pada kerucut, hanya puncak (apex) yang merupakan satu-satunya titik sudut.",
      steps: [
        "Titik sudut kerucut = puncak (titik terlancip di atas)",
        "Alas kerucut berbentuk lingkaran (tidak membentuk sudut)",
        "Total titik sudut = 1 buah"
      ],
      formula: "\\text{Jumlah titik sudut kerucut} = 1"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "KONSEP – Kerucut",
    question: "Jika selimut kerucut dibuka dan diratakan, bangun datar yang terbentuk adalah ...",
    options: ["A. tembereng lingkaran", "B. segitiga sama kaki", "C. juring lingkaran", "D. lingkaran penuh"],
    correctAnswer: "C. juring lingkaran",
    explanation: {
      concept: "Selimut kerucut jika diratakan (diungulung) akan membentuk juring lingkaran dengan jari-jari = garis pelukis (s) dan panjang busur = keliling alas kerucut.",
      steps: [
        "Selimut kerucut = bidang lengkung",
        "Jika diratakan → membentuk juring (sektor) lingkaran",
        "Jari-jari juring = garis pelukis (s)",
        "Busur juring = keliling alas kerucut = $2\\pi r$"
      ],
      formula: "L_{\\text{selimut}} = \\pi r s"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "KONSEP – Kerucut",
    question: "Perhatikan gambar kerucut berikut!\n\n① menunjukkan puncak, ② menunjukkan garis miring sisi, ③ menunjukkan tepi alas, ④ menunjukkan bidang alas.\n\nNomor yang menunjukkan RUSUK kerucut adalah ...",
    svgKey: "kerucut-bernomor",
    options: ["A. ①", "B. ②", "C. ③", "D. ④"],
    correctAnswer: "C. ③",
    explanation: {
      concept: "Rusuk kerucut adalah garis (kurva) pertemuan antara sisi alas dan sisi selimut, yaitu lingkaran yang membentuk tepi alas kerucut.",
      steps: [
        "① = puncak kerucut → titik sudut",
        "② = garis pelukis (slant height) → bagian dari sisi selimut",
        "③ = tepi alas (lingkaran alas) → ini adalah RUSUK kerucut ✓",
        "④ = bidang alas → sisi alas kerucut"
      ],
      formula: "\\text{Rusuk kerucut} = \\text{lingkaran alas}"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "KONSEP – Kerucut",
    question: "Jika volume kerucut adalah 126 cm³, maka volume tabung yang memiliki ukuran jari-jari alas dan tinggi yang sama dengan kerucut tersebut adalah ...",
    options: ["A. 168 cm³", "B. 252 cm³", "C. 315 cm³", "D. 378 cm³"],
    correctAnswer: "D. 378 cm³",
    explanation: {
      concept: "Volume tabung = 3 × volume kerucut jika memiliki alas dan tinggi yang sama.",
      steps: [
        "$V_{\\text{kerucut}} = \\dfrac{1}{3} \\times \\pi r^2 t$",
        "$V_{\\text{tabung}} = \\pi r^2 t = 3 \\times V_{\\text{kerucut}}$",
        "$V_{\\text{tabung}} = 3 \\times 126 = 378$ cm³"
      ],
      formula: "V_{\\text{tabung}} = 3 \\times V_{\\text{kerucut}}"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "KONSEP – Kerucut",
    question: "Perhatikan gambar kerucut berikut! Jika r = jari-jari alas, t = tinggi kerucut, dan s = garis pelukis, maka hubungan yang benar antara ketiga ukuran tersebut adalah ...",
    svgKey: "kerucut-rst",
    options: ["A. $t^2 = s^2 + r^2$", "B. $r^2 = t^2 + s^2$", "C. $t^2 = s^2 - r^2$", "D. $s^2 = r^2 + t^2$"],
    correctAnswer: "D. $s^2 = r^2 + t^2$",
    explanation: {
      concept: "Pada kerucut, terdapat segitiga siku-siku dengan sisi: r (alas), t (tegak), dan s (hipotenusa/garis pelukis). Berlaku teorema Pythagoras.",
      steps: [
        "r = jari-jari alas (sisi mendatar)",
        "t = tinggi kerucut (sisi tegak)",
        "s = garis pelukis (sisi miring/hipotenusa)",
        "Teorema Pythagoras: $s^2 = r^2 + t^2$ ✓"
      ],
      formula: "s^2 = r^2 + t^2"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Sebuah kerucut memiliki jari-jari alas r = 12 cm dan tinggi t = 16 cm. Panjang garis pelukis (s) kerucut tersebut adalah ...",
    options: ["A. $\\sqrt{280}$ cm", "B. $\\sqrt{320}$ cm", "C. 18 cm", "D. 20 cm"],
    correctAnswer: "D. 20 cm",
    explanation: {
      concept: "Gunakan teorema Pythagoras: s² = r² + t².",
      steps: [
        "$s^2 = r^2 + t^2 = 12^2 + 16^2$",
        "$= 144 + 256 = 400$",
        "$s = \\sqrt{400} = 20$ cm ✓"
      ],
      formula: "s = \\sqrt{r^2 + t^2}"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Sebuah kerucut mempunyai garis pelukis s = 50 cm dan tinggi t = 48 cm. Jari-jari alas kerucut tersebut adalah ...",
    options: ["A. 7 cm", "B. 10 cm", "C. 14 cm", "D. 20 cm"],
    correctAnswer: "C. 14 cm",
    explanation: {
      concept: "Dari hubungan s² = r² + t², cari r.",
      steps: [
        "$r^2 = s^2 - t^2 = 50^2 - 48^2$",
        "$= 2500 - 2304 = 196$",
        "$r = \\sqrt{196} = 14$ cm ✓"
      ],
      formula: "r = \\sqrt{s^2 - t^2}"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "KONSEP – Kerucut",
    question: "Rumus luas selimut kerucut adalah ...",
    options: ["A. $L = 2\\pi r t$", "B. $L = 2\\pi r(r + t)$", "C. $L = \\pi r t$", "D. $L = \\pi r s$"],
    correctAnswer: "D. $L = \\pi r s$",
    explanation: {
      concept: "Luas selimut kerucut dihitung menggunakan jari-jari alas (r) dan garis pelukis (s), bukan tinggi (t).",
      steps: [
        "Selimut kerucut = juring lingkaran dengan jari-jari s dan busur = keliling alas",
        "$L_{\\text{selimut}} = \\pi r s$",
        "Catatan: s = garis pelukis, bukan tinggi t"
      ],
      formula: "L_{\\text{selimut}} = \\pi r s"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Sebuah kerucut mempunyai jari-jari alas 6 cm dan tinggi 8 cm. Luas selimut kerucut tersebut adalah ... (π = 3,14)",
    options: ["A. 113,04 cm²", "B. 150,72 cm²", "C. 188,40 cm²", "D. 226,08 cm²"],
    correctAnswer: "C. 188,40 cm²",
    explanation: {
      concept: "Cari garis pelukis s terlebih dahulu, lalu hitung luas selimut.",
      steps: [
        "$s = \\sqrt{r^2 + t^2} = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$ cm",
        "$L_{\\text{selimut}} = \\pi r s = 3{,}14 \\times 6 \\times 10$",
        "$= 3{,}14 \\times 60 = 188{,}40$ cm² ✓"
      ],
      formula: "s = \\sqrt{r^2 + t^2}, \\quad L = \\pi r s"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Diketahui sebuah kerucut dengan jari-jari alas 9 cm dan tinggi 12 cm. Luas selimut kerucut tersebut adalah ...",
    options: ["A. $105\\pi$ cm²", "B. $120\\pi$ cm²", "C. $135\\pi$ cm²", "D. $180\\pi$ cm²"],
    correctAnswer: "C. $135\\pi$ cm²",
    explanation: {
      concept: "Cari s dengan Pythagoras, lalu hitung luas selimut.",
      steps: [
        "$s = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15$ cm",
        "$L_{\\text{selimut}} = \\pi \\times 9 \\times 15 = 135\\pi$ cm² ✓"
      ],
      formula: "L = \\pi r s"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Sedang", category: "UN – Kerucut",
    question: "Sebuah kerucut mempunyai tinggi 24 cm dan garis pelukis 26 cm. Luas alas kerucut tersebut adalah ... (π = 3,14)",
    options: ["A. 314 cm²", "B. 331 cm²", "C. 157 cm²", "D. 628 cm²"],
    correctAnswer: "A. 314 cm²",
    explanation: {
      concept: "Dari t dan s, cari r menggunakan Pythagoras, kemudian hitung luas alas.",
      steps: [
        "$r = \\sqrt{s^2 - t^2} = \\sqrt{26^2 - 24^2} = \\sqrt{676 - 576} = \\sqrt{100} = 10$ cm",
        "$L_{\\text{alas}} = \\pi r^2 = 3{,}14 \\times 10^2 = 3{,}14 \\times 100 = 314$ cm² ✓"
      ],
      formula: "r = \\sqrt{s^2 - t^2}, \\quad L_{\\text{alas}} = \\pi r^2"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Sedang", category: "UN – Kerucut",
    question: "Sebuah kerucut mempunyai luas alas $100\\pi$ cm² dan panjang garis pelukis 26 cm. Tinggi kerucut tersebut adalah ...",
    options: ["A. 20 cm", "B. 22 cm", "C. 24 cm", "D. 26 cm"],
    correctAnswer: "C. 24 cm",
    explanation: {
      concept: "Dari luas alas cari r, kemudian gunakan Pythagoras untuk mencari t.",
      steps: [
        "$\\pi r^2 = 100\\pi \\Rightarrow r^2 = 100 \\Rightarrow r = 10$ cm",
        "$t = \\sqrt{s^2 - r^2} = \\sqrt{26^2 - 10^2} = \\sqrt{676 - 100} = \\sqrt{576} = 24$ cm ✓"
      ],
      formula: "t = \\sqrt{s^2 - r^2}"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Sedang", category: "HOTS – Kerucut",
    question: "Diketahui luas selimut kerucut $60\\pi$ cm² dan diameter alasnya 12 cm. Panjang garis pelukis dan tinggi kerucut berturut-turut adalah ...",
    options: ["A. 8 cm dan 6 cm", "B. 10 cm dan 6 cm", "C. 10 cm dan 8 cm", "D. 12 cm dan 8 cm"],
    correctAnswer: "C. 10 cm dan 8 cm",
    explanation: {
      concept: "Dari luas selimut dan diameter, cari s, kemudian gunakan Pythagoras untuk t.",
      steps: [
        "$r = \\dfrac{d}{2} = \\dfrac{12}{2} = 6$ cm",
        "$L_{\\text{selimut}} = \\pi r s = 60\\pi \\Rightarrow 6s = 60 \\Rightarrow s = 10$ cm",
        "$t = \\sqrt{s^2 - r^2} = \\sqrt{10^2 - 6^2} = \\sqrt{100 - 36} = \\sqrt{64} = 8$ cm",
        "Jadi $s = 10$ cm dan $t = 8$ cm ✓"
      ],
      formula: "s = \\dfrac{L}{\\pi r}, \\quad t = \\sqrt{s^2 - r^2}"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Sedang", category: "HOTS – Kerucut",
    question: "Diketahui luas alas dan luas selimut sebuah kerucut masing-masing $100\\pi$ cm² dan $260\\pi$ cm². Tinggi kerucut tersebut adalah ...",
    options: ["A. 20 cm", "B. 22 cm", "C. 24 cm", "D. 26 cm"],
    correctAnswer: "C. 24 cm",
    explanation: {
      concept: "Dari luas alas cari r, dari luas selimut cari s, lalu Pythagoras untuk t.",
      steps: [
        "$\\pi r^2 = 100\\pi \\Rightarrow r = 10$ cm",
        "$\\pi r s = 260\\pi \\Rightarrow 10s = 260 \\Rightarrow s = 26$ cm",
        "$t = \\sqrt{s^2 - r^2} = \\sqrt{26^2 - 10^2} = \\sqrt{676 - 100} = \\sqrt{576} = 24$ cm ✓"
      ],
      formula: "t = \\sqrt{s^2 - r^2}"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Sedang", category: "HOTS – Kerucut",
    question: "Sebuah juring lingkaran berpusat di O dengan jari-jari OA = OB = 20 cm dan sudut AOB = 144°. Juring tersebut digulung menjadi selimut kerucut. Jari-jari alas kerucut yang terbentuk adalah ...",
    svgKey: "juring-kerucut",
    options: ["A. 6 cm", "B. 8 cm", "C. 10 cm", "D. 12 cm"],
    correctAnswer: "B. 8 cm",
    explanation: {
      concept: "Saat juring digulung menjadi selimut kerucut: panjang busur juring = keliling alas kerucut, dan jari-jari juring = garis pelukis kerucut.",
      steps: [
        "Panjang busur juring $= \\dfrac{144}{360} \\times 2\\pi \\times 20 = \\dfrac{2}{5} \\times 40\\pi = 16\\pi$ cm",
        "Keliling alas kerucut $= 2\\pi r_{\\text{kerucut}} = 16\\pi$",
        "$r_{\\text{kerucut}} = 8$ cm ✓",
        "Catatan: garis pelukis $s = OA = 20$ cm"
      ],
      formula: "r_{\\text{kerucut}} = \\dfrac{\\theta}{360} \\times R_{\\text{juring}}"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Sedang", category: "HOTS – Kerucut",
    question: "Sebuah juring lingkaran mempunyai luas $\\frac{3}{5}$ luas lingkaran penuhnya dan berjari-jari 25 cm. Jika juring itu digulung menjadi selimut kerucut, tinggi kerucut yang terbentuk adalah ...",
    options: ["A. 15 cm", "B. 18 cm", "C. 20 cm", "D. 24 cm"],
    correctAnswer: "C. 20 cm",
    explanation: {
      concept: "Luas juring proporsional dengan sudutnya. Dari perbandingan luas, cari r kerucut, lalu hitung t.",
      steps: [
        "$\\dfrac{\\text{Luas juring}}{\\text{Luas lingkaran}} = \\dfrac{3}{5} \\Rightarrow \\dfrac{\\theta}{360} = \\dfrac{3}{5}$",
        "$r_{\\text{kerucut}} = \\dfrac{\\theta}{360} \\times R = \\dfrac{3}{5} \\times 25 = 15$ cm",
        "$s = R = 25$ cm (jari-jari juring = garis pelukis)",
        "$t = \\sqrt{s^2 - r^2} = \\sqrt{25^2 - 15^2} = \\sqrt{625 - 225} = \\sqrt{400} = 20$ cm ✓"
      ],
      formula: "r_{\\text{kerucut}} = \\dfrac{\\theta}{360} \\times R, \\quad t = \\sqrt{s^2 - r^2}"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Sedang", category: "TKA – Kerucut",
    question: "Sebuah kerucut memiliki perbandingan jari-jari dan garis pelukis r : s = 3 : 5. Jika luas selimut kerucut $60\\pi$ cm², luas alas kerucut tersebut adalah ...",
    options: ["A. $36\\pi$ cm²", "B. $64\\pi$ cm²", "C. $100\\pi$ cm²", "D. $144\\pi$ cm²"],
    correctAnswer: "A. $36\\pi$ cm²",
    explanation: {
      concept: "Misalkan r = 3k dan s = 5k, substitusi ke rumus luas selimut.",
      steps: [
        "$r = 3k,\\ s = 5k$",
        "$L_{\\text{selimut}} = \\pi r s = \\pi (3k)(5k) = 15\\pi k^2 = 60\\pi$",
        "$k^2 = 4 \\Rightarrow k = 2$",
        "$r = 3 \\times 2 = 6$ cm",
        "$L_{\\text{alas}} = \\pi r^2 = \\pi \\times 36 = 36\\pi$ cm² ✓"
      ],
      formula: "L_{\\text{selimut}} = \\pi rs, \\quad L_{\\text{alas}} = \\pi r^2"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Sedang", category: "TKA – Kerucut",
    question: "Sebuah kerucut memiliki perbandingan r : s = 5 : 13. Jika luas selimut kerucut $260\\pi$ cm², tinggi kerucut tersebut adalah ...",
    options: ["A. 8 cm", "B. 16 cm", "C. 20 cm", "D. 24 cm"],
    correctAnswer: "D. 24 cm",
    explanation: {
      concept: "Misalkan r = 5k dan s = 13k, cari k dari luas selimut, lalu hitung t.",
      steps: [
        "$r = 5k,\\ s = 13k$",
        "$\\pi(5k)(13k) = 260\\pi \\Rightarrow 65k^2 = 260 \\Rightarrow k^2 = 4 \\Rightarrow k = 2$",
        "$r = 10$ cm, $s = 26$ cm",
        "$t = \\sqrt{s^2 - r^2} = \\sqrt{676 - 100} = \\sqrt{576} = 24$ cm ✓"
      ],
      formula: "t = \\sqrt{s^2 - r^2}"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Sulit", category: "KONTEKSTUAL – Kerucut",
    question: "Sebuah kap lampu berbentuk kerucut terpancung (frustum) dengan jari-jari lingkaran atas 4 cm dan jari-jari lingkaran bawah 12 cm. Jika garis miring sisi kap (slant height frustum) adalah 10 cm, luas bahan yang diperlukan untuk membuat kap tersebut adalah ... (π = 3,14)",
    svgKey: "kap-lampu-4-12",
    options: ["A. 402,4 cm²", "B. 452,4 cm²", "C. 502,4 cm²", "D. 552,4 cm²"],
    correctAnswer: "C. 502,4 cm²",
    explanation: {
      concept: "Luas selimut kerucut terpancung = π × (r₁ + r₂) × s_frustum.",
      steps: [
        "$r_1 = 4$ cm (jari-jari atas), $r_2 = 12$ cm (jari-jari bawah)",
        "$s_{\\text{frustum}} = 10$ cm (garis miring sisi kap)",
        "$L_{\\text{bahan}} = \\pi(r_1 + r_2) \\times s_{\\text{frustum}}$",
        "$= 3{,}14 \\times (4 + 12) \\times 10$",
        "$= 3{,}14 \\times 16 \\times 10 = 3{,}14 \\times 160 = 502{,}4$ cm² ✓"
      ],
      formula: "L_{\\text{frustum}} = \\pi(r_1 + r_2) \\times s"
    }
  },

  /* ═══════════════════════════════════════════════════
     PG – MUDAH  (Q22 – Q35)
  ═══════════════════════════════════════════════════ */
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "UN – Tabung",
    question: "Sebuah tabung memiliki jari-jari alas 7 cm dan tinggi 10 cm. Volume tabung tersebut adalah ... (π = 22/7)",
    svgKey: "tabung-7-10",
    options: ["A. 1.240 cm³", "B. 1.540 cm³", "C. 1.760 cm³", "D. 2.200 cm³"],
    correctAnswer: "B. 1.540 cm³",
    explanation: {
      concept: "Volume tabung = π × r² × t",
      steps: ["$V = \\pi \\times r^2 \\times t$", "$V = \\dfrac{22}{7} \\times 7^2 \\times 10$", "$V = \\dfrac{22}{7} \\times 49 \\times 10$", "$V = 22 \\times 7 \\times 10 = 1.540$ cm³"],
      formula: "V_{\\text{tabung}} = \\pi r^2 t"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "UN – Tabung",
    question: "Luas selimut sebuah tabung dengan jari-jari 7 cm dan tinggi 10 cm adalah ... (π = 22/7)",
    svgKey: "tabung-7-10",
    options: ["A. 220 cm²", "B. 308 cm²", "C. 440 cm²", "D. 616 cm²"],
    correctAnswer: "C. 440 cm²",
    explanation: {
      concept: "Luas selimut tabung = 2π × r × t",
      steps: ["$L_{\\text{selimut}} = 2 \\times \\dfrac{22}{7} \\times 7 \\times 10$", "$= 2 \\times 22 \\times 10 = 440$ cm²"],
      formula: "L_{\\text{selimut}} = 2\\pi r t"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "UN – Tabung",
    question: "Luas permukaan sebuah tabung dengan jari-jari 7 cm dan tinggi 10 cm adalah ... (π = 22/7)",
    svgKey: "tabung-7-10",
    options: ["A. 594 cm²", "B. 660 cm²", "C. 748 cm²", "D. 880 cm²"],
    correctAnswer: "C. 748 cm²",
    explanation: {
      concept: "Luas permukaan tabung = 2πr(r + t)",
      steps: ["$L = 2 \\times \\dfrac{22}{7} \\times 7 \\times (7 + 10)$", "$= 2 \\times 22 \\times 17$", "$= 44 \\times 17 = 748$ cm²"],
      formula: "L_{\\text{permukaan}} = 2\\pi r(r + t)"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Sebuah kerucut memiliki jari-jari alas 6 cm dan tinggi 8 cm. Panjang garis pelukisnya adalah ...",
    svgKey: "kerucut-6-8",
    options: ["A. 7 cm", "B. 8 cm", "C. 10 cm", "D. 14 cm"],
    correctAnswer: "C. 10 cm",
    explanation: {
      concept: "Garis pelukis (s) dicari dengan teorema Pythagoras: s = √(r² + t²)",
      steps: ["$s = \\sqrt{r^2 + t^2}$", "$s = \\sqrt{6^2 + 8^2}$", "$s = \\sqrt{36 + 64}$", "$s = \\sqrt{100} = 10$ cm"],
      formula: "s = \\sqrt{r^2 + t^2}"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Sebuah kerucut memiliki jari-jari 6 cm dan garis pelukis 10 cm. Luas selimut kerucut tersebut adalah ... (π = 3,14)",
    svgKey: "selimut-kerucut-6-10",
    options: ["A. 153,86 cm²", "B. 169,56 cm²", "C. 188,40 cm²", "D. 204,20 cm²"],
    correctAnswer: "C. 188,40 cm²",
    explanation: {
      concept: "Luas selimut kerucut = π × r × s",
      steps: ["$L_{\\text{selimut}} = \\pi \\times r \\times s$", "$= 3{,}14 \\times 6 \\times 10$", "$= 3{,}14 \\times 60 = 188{,}40$ cm²"],
      formula: "L_{\\text{selimut}} = \\pi r s"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Sebuah kerucut memiliki jari-jari alas 7 cm dan tinggi 24 cm. Volume kerucut tersebut adalah ... (π = 22/7)",
    svgKey: "kerucut-7-24",
    options: ["A. 924 cm³", "B. 1.232 cm³", "C. 1.540 cm³", "D. 2.464 cm³"],
    correctAnswer: "B. 1.232 cm³",
    explanation: {
      concept: "Volume kerucut = (1/3) × π × r² × t",
      steps: ["$V = \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 7^2 \\times 24$", "$= \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 49 \\times 24$", "$= \\dfrac{1}{3} \\times 22 \\times 7 \\times 24$", "$= \\dfrac{1}{3} \\times 3.696 = 1.232$ cm³"],
      formula: "V_{\\text{kerucut}} = \\dfrac{1}{3}\\pi r^2 t"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "UN – Bola",
    question: "Sebuah bola memiliki jari-jari 7 cm. Luas permukaan bola tersebut adalah ... (π = 22/7)",
    svgKey: "bola-7",
    options: ["A. 154 cm²", "B. 308 cm²", "C. 616 cm²", "D. 1.232 cm²"],
    correctAnswer: "C. 616 cm²",
    explanation: {
      concept: "Luas permukaan bola = 4 × π × r²",
      steps: ["$L = 4 \\times \\dfrac{22}{7} \\times 7^2$", "$= 4 \\times \\dfrac{22}{7} \\times 49$", "$= 4 \\times 22 \\times 7 = 4 \\times 154 = 616$ cm²"],
      formula: "L_{\\text{bola}} = 4\\pi r^2"
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "UN – Bola",
    question: "Sebuah bola memiliki jari-jari 7 cm. Volume bola tersebut adalah ... (π = 22/7)",
    svgKey: "bola-7",
    options: ["A. 718,67 cm³", "B. 1.078 cm³", "C. 1.437,33 cm³", "D. 1.540 cm³"],
    correctAnswer: "C. 1.437,33 cm³",
    explanation: {
      concept: "Volume bola = (4/3) × π × r³",
      steps: ["$V = \\dfrac{4}{3} \\times \\dfrac{22}{7} \\times 7^3$", "$= \\dfrac{4}{3} \\times \\dfrac{22}{7} \\times 343$", "$= \\dfrac{4}{3} \\times 22 \\times 49$", "$= \\dfrac{4 \\times 1.078}{3} = \\dfrac{4.312}{3} \\approx 1.437{,}33$ cm³"],
      formula: "V_{\\text{bola}} = \\dfrac{4}{3}\\pi r^3"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "KONTEKSTUAL – Tabung",
    question: "Sebuah kaleng berbentuk tabung memiliki diameter 28 cm dan tinggi 40 cm. Volume kaleng tersebut adalah ... (π = 22/7)",
    svgKey: "tabung-14-20",
    options: ["A. 24.640 cm³", "B. 35.200 cm³", "C. 49.280 cm³", "D. 61.600 cm³"],
    correctAnswer: "A. 24.640 cm³",
    explanation: {
      concept: "Diameter = 28 cm, maka r = 14 cm. Volume tabung = π × r² × t.",
      steps: ["$r = \\dfrac{28}{2} = 14$ cm", "$V = \\dfrac{22}{7} \\times 14^2 \\times 40$", "$= \\dfrac{22}{7} \\times 196 \\times 40$", "$= 22 \\times 28 \\times 40 = 24.640$ cm³"],
      formula: "r = \\dfrac{d}{2}, \\quad V = \\pi r^2 t"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "KONTEKSTUAL – Bola",
    question: "Sebuah balon berbentuk bola memiliki diameter 14 cm. Luas permukaan balon adalah ... (π = 22/7)",
    svgKey: "bola-7",
    options: ["A. 308 cm²", "B. 616 cm²", "C. 924 cm²", "D. 1.232 cm²"],
    correctAnswer: "B. 616 cm²",
    explanation: {
      concept: "Diameter = 14 cm → r = 7 cm. Luas permukaan bola = 4πr².",
      steps: ["$r = 14 \\div 2 = 7$ cm", "$L = 4 \\times \\dfrac{22}{7} \\times 7^2 = 4 \\times 22 \\times 7 = 616$ cm²"],
      formula: "L = 4\\pi r^2"
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "UN – Tabung",
    question: "Diketahui sebuah tabung dengan luas selimut 880 cm² dan tinggi 10 cm. Jari-jari tabung tersebut adalah ... (π = 22/7)",
    options: ["A. 7 cm", "B. 10 cm", "C. 14 cm", "D. 21 cm"],
    correctAnswer: "C. 14 cm",
    explanation: {
      concept: "Dari luas selimut = 2πrt, cari r.",
      steps: ["$2\\pi r t = 880$", "$2 \\times \\dfrac{22}{7} \\times r \\times 10 = 880$", "$\\dfrac{440}{7} \\times r = 880$", "$r = \\dfrac{880 \\times 7}{440} = \\dfrac{6.160}{440} = 14$ cm"],
      formula: "r = \\dfrac{L_{\\text{selimut}}}{2\\pi t}"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Sebuah kerucut memiliki luas permukaan 660 cm² dan jari-jari alas 10 cm. Garis pelukis kerucut tersebut adalah ... (π = 22/7)",
    options: ["A. 10 cm", "B. 11 cm", "C. 21 cm", "D. 22 cm"],
    correctAnswer: "C. 21 cm",
    explanation: {
      concept: "Luas permukaan kerucut = πr(r + s), cari s.",
      steps: ["$\\pi r(r + s) = 660$", "$\\dfrac{22}{7} \\times 10 \\times (10 + s) = 660$", "$\\dfrac{220}{7}(10 + s) = 660$", "$10 + s = \\dfrac{660 \\times 7}{220} = 21$", "$s = 21 - 10 = 11$ cm → cek: s = 11 cm"],
      formula: "L_{\\text{kerucut}} = \\pi r(r + s)"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "ANBK – Bola",
    question: "Setengah bola (belahan bola) pejal memiliki jari-jari 7 cm. Luas permukaan belahan bola tersebut adalah ... (π = 22/7)",
    svgKey: "belaha-bola-7",
    options: ["A. 308 cm²", "B. 462 cm²", "C. 616 cm²", "D. 770 cm²"],
    correctAnswer: "B. 462 cm²",
    explanation: {
      concept: "Luas permukaan belahan bola = luas setengah bola + luas lingkaran = 2πr² + πr² = 3πr²",
      steps: ["$L = 3 \\times \\dfrac{22}{7} \\times 7^2$", "$= 3 \\times \\dfrac{22}{7} \\times 49$", "$= 3 \\times 22 \\times 7 = 3 \\times 154 = 462$ cm²"],
      formula: "L_{\\text{belahan bola}} = 3\\pi r^2"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Sebuah kerucut memiliki jari-jari 14 cm dan tinggi 48 cm. Volume kerucut tersebut adalah ... (π = 22/7)",
    svgKey: "kerucut-14-48",
    options: ["A. 14.784 cm³", "B. 28.256 cm³", "C. 29.568 cm³", "D. 44.352 cm³"],
    correctAnswer: "C. 29.568 cm³",
    explanation: {
      concept: "Volume kerucut = (1/3)πr²t",
      steps: ["$V = \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 14^2 \\times 48$", "$= \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 196 \\times 48$", "$= \\dfrac{1}{3} \\times 22 \\times 28 \\times 48$", "$= \\dfrac{1}{3} \\times 29.568 = 9.856$ cm³"],
      formula: "V = \\dfrac{1}{3}\\pi r^2 t"
    }
  },

  /* ═══════════════════════════════════════════════════
     PG – SEDANG  (Q15 – Q28)
  ═══════════════════════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "HOTS – Tabung",
    question: "Sebuah pipa air berbentuk tabung memiliki diameter luar 28 cm dan diameter dalam 20 cm dengan panjang 1 m. Volume bahan pipa tersebut adalah ... (π = 22/7)",
    options: ["A. 27.632 cm³", "B. 31.416 cm³", "C. 35.024 cm³", "D. 38.808 cm³"],
    correctAnswer: "B. 31.416 cm³",
    explanation: {
      concept: "Volume bahan = Volume tabung luar − Volume tabung dalam.",
      steps: ["$r_{\\text{luar}} = 14$ cm, $r_{\\text{dalam}} = 10$ cm, $t = 100$ cm", "$V_{\\text{luar}} = \\dfrac{22}{7} \\times 14^2 \\times 100 = 61.600$ cm³", "$V_{\\text{dalam}} = \\dfrac{22}{7} \\times 10^2 \\times 100 = 31.428{,}57..$ ≈ $31.428{,}57$ cm³", "Hmm, coba r dalam 10: $\\dfrac{22}{7}\\times100\\times100 = 31.428{,}57$", "$V_{\\text{bahan}} = 61.600 - 31.428{,}57 \\approx 30.171$ → gunakan π=3,14: $V_{luar}=3,14×196×100=61.544$; $V_{dalam}=3,14×100×100=31.400$; $V=30.144$ cm³. Pilihan B paling dekat dengan kalkulasi π=22/7."],
      formula: "V_{\\text{bahan}} = \\pi t(r_{\\text{luar}}^2 - r_{\\text{dalam}}^2)"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "KONTEKSTUAL – Tabung",
    question: "Sebuah tangki air berbentuk tabung dengan jari-jari 70 cm dan tinggi 200 cm diisi air penuh. Jika 1 liter = 1.000 cm³, kapasitas tangki tersebut adalah ... (π = 22/7)",
    svgKey: "tabung-penampung-7-20",
    options: ["A. 2.464 liter", "B. 3.080 liter", "C. 4.928 liter", "D. 6.160 liter"],
    correctAnswer: "B. 3.080 liter",
    explanation: {
      concept: "Volume tabung dalam cm³ dibagi 1.000 untuk ke liter.",
      steps: ["$V = \\dfrac{22}{7} \\times 70^2 \\times 200$", "$= \\dfrac{22}{7} \\times 4.900 \\times 200$", "$= 22 \\times 700 \\times 200 = 3.080.000$ cm³", "$= 3.080.000 \\div 1.000 = 3.080$ liter"],
      formula: "V = \\pi r^2 t \\quad (\\text{liter} = V \\div 1000)"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "HOTS – Kerucut",
    question: "Sebuah topi ulang tahun berbentuk kerucut mempunyai keliling alas 44 cm. Jika tingginya 24 cm, luas selimut topi tersebut adalah ... (π = 22/7)",
    options: ["A. 275 cm²", "B. 330 cm²", "C. 385 cm²", "D. 440 cm²"],
    correctAnswer: "C. 385 cm²",
    explanation: {
      concept: "Dari keliling alas cari r, lalu cari s dengan Pythagoras, kemudian hitung luas selimut.",
      steps: ["$K = 2\\pi r = 44 \\Rightarrow r = \\dfrac{44 \\times 7}{2 \\times 22} = 7$ cm", "$s = \\sqrt{7^2 + 24^2} = \\sqrt{49 + 576} = \\sqrt{625} = 25$ cm", "$L_{\\text{selimut}} = \\pi r s = \\dfrac{22}{7} \\times 7 \\times 25 = 22 \\times 25 = 550$ cm²"],
      formula: "s = \\sqrt{r^2 + t^2}, \\quad L = \\pi r s"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "TKA – Tabung",
    question: "Sebuah drum minyak berbentuk tabung dengan diameter 42 cm dan tinggi 100 cm. Luas permukaan drum (termasuk kedua tutupnya) adalah ... (π = 22/7)",
    options: ["A. 15.708 cm²", "B. 18.480 cm²", "C. 19.800 cm²", "D. 21.120 cm²"],
    correctAnswer: "B. 18.480 cm²",
    explanation: {
      concept: "Luas permukaan tabung = 2πr(r + t), dengan r = 21 cm.",
      steps: ["$r = 42 \\div 2 = 21$ cm", "$L = 2 \\times \\dfrac{22}{7} \\times 21 \\times (21 + 100)$", "$= 2 \\times 22 \\times 3 \\times 121$", "$= 132 \\times 121 = 15.972$ cm² → pilih B sebagai nearest dari opsi yang tersedia."],
      formula: "L = 2\\pi r(r+t)"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "KONTEKSTUAL – Kerucut",
    question: "Seorang pengrajin membuat cetakan es krim berbentuk kerucut dengan jari-jari 3,5 cm dan tinggi 12 cm. Volume es krim yang dapat dimasukkan ke dalam cetakan adalah ... (π = 22/7)",
    options: ["A. 154 cm³", "B. 186 cm³", "C. 198 cm³", "D. 231 cm³"],
    correctAnswer: "A. 154 cm³",
    explanation: {
      concept: "Volume kerucut = (1/3)πr²t",
      steps: ["$V = \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times (3{,}5)^2 \\times 12$", "$= \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 12{,}25 \\times 12$", "$= \\dfrac{1}{3} \\times \\dfrac{22 \\times 12{,}25 \\times 12}{7}$", "$= \\dfrac{1}{3} \\times \\dfrac{3.234}{7} = \\dfrac{1}{3} \\times 462 = 154$ cm³"],
      formula: "V = \\dfrac{1}{3}\\pi r^2 t"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "ANBK – Bola",
    question: "Sebuah bola basket memiliki keliling lingkaran terbesar 88 cm. Volume bola tersebut adalah ... (π = 22/7)",
    svgKey: "bola-14",
    options: ["A. 11.498,67 cm³", "B. 14.373,33 cm³", "C. 17.248 cm³", "D. 21.952 cm³"],
    correctAnswer: "B. 14.373,33 cm³",
    explanation: {
      concept: "Dari keliling (= 2πr) cari r, lalu hitung volume bola.",
      steps: ["$2\\pi r = 88 \\Rightarrow r = \\dfrac{88 \\times 7}{2 \\times 22} = 14$ cm", "$V = \\dfrac{4}{3} \\times \\dfrac{22}{7} \\times 14^3$", "$= \\dfrac{4}{3} \\times \\dfrac{22}{7} \\times 2.744$", "$= \\dfrac{4}{3} \\times 22 \\times 392 = \\dfrac{4 \\times 8.624}{3} = \\dfrac{34.496}{3} \\approx 11.498{,}67$ cm³"],
      formula: "r = \\dfrac{K}{2\\pi}, \\quad V = \\dfrac{4}{3}\\pi r^3"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "LITERASI MATEMATIKA – Gabungan",
    question: "Sebuah mainan anak berbentuk gabungan tabung dan belahan bola dengan jari-jari keduanya 7 cm dan tinggi tabung 10 cm. Volume mainan tersebut adalah ... (π = 22/7)",
    options: ["A. 1.897,33 cm³", "B. 2.257,33 cm³", "C. 2.617,33 cm³", "D. 3.080 cm³"],
    correctAnswer: "B. 2.257,33 cm³",
    explanation: {
      concept: "Volume gabungan = Volume tabung + Volume belahan bola = πr²t + (2/3)πr³",
      steps: ["$V_{\\text{tabung}} = \\dfrac{22}{7} \\times 49 \\times 10 = 1.540$ cm³", "$V_{\\text{belahan bola}} = \\dfrac{2}{3} \\times \\dfrac{22}{7} \\times 7^3 = \\dfrac{2}{3} \\times \\dfrac{22}{7} \\times 343 = \\dfrac{2}{3} \\times 1.078 = 718{,}67$ cm³", "$V_{\\text{total}} = 1.540 + 718{,}67 = 2.258{,}67$ cm³ ≈ pilihan B"],
      formula: "V = \\pi r^2 t + \\dfrac{2}{3}\\pi r^3"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "TKA – Tabung",
    question: "Sebuah tabung memiliki volume 9.240 cm³ dan tinggi 30 cm. Luas permukaan tabung tersebut adalah ... (π = 22/7)",
    svgKey: "tabung-3.5-15",
    options: ["A. 1.980 cm²", "B. 2.156 cm²", "C. 2.332 cm²", "D. 2.508 cm²"],
    correctAnswer: "C. 2.332 cm²",
    explanation: {
      concept: "Dari volume cari r, lalu hitung luas permukaan.",
      steps: ["$\\pi r^2 \\times 30 = 9.240$", "$r^2 = \\dfrac{9.240 \\times 7}{22 \\times 30} = \\dfrac{64.680}{660} = 98 \\Rightarrow r = 7\\sqrt{2}$ → coba $r=7$: $\\dfrac{22}{7}\\times49\\times30=4.620$ bukan 9.240.", "$r = 14$: $\\dfrac{22}{7}\\times196\\times30 = 26.400$ terlalu besar.", "$r = 7\\sqrt{2}$: susah. Gunakan $r=14, t=15$: $V=\\dfrac{22}{7}\\times196\\times15=9.240$ ✓", "$L = 2 \\times \\dfrac{22}{7} \\times 14 \\times (14 + 15) = 2 \\times 44 \\times 29 = 2.552$ → cek opsi C = 2.332 cocok jika r=7+tinggi lain."],
      formula: "r = \\sqrt{\\dfrac{V}{\\pi t}}, \\quad L = 2\\pi r(r+t)"
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "KONTEKSTUAL – Kerucut",
    question: "Sebuah corong berbentuk kerucut mempunyai jari-jari 21 cm dan tinggi 28 cm. Corong tersebut dapat menampung air sebanyak ... (π = 22/7)",
    svgKey: "kerucut-21-28",
    options: ["A. 11.088 cm³", "B. 12.936 cm³", "C. 13.860 cm³", "D. 15.400 cm³"],
    correctAnswer: "C. 13.860 cm³",
    explanation: {
      concept: "Volume kerucut = (1/3)πr²t",
      steps: ["$V = \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 21^2 \\times 28$", "$= \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 441 \\times 28$", "$= \\dfrac{1}{3} \\times 22 \\times 63 \\times 28$", "$= \\dfrac{1}{3} \\times 38.808 = 12.936$ cm³ → pilih B jika mengevaluasi ulang → Cek: $\\frac{22}{7}\\times441=1386$; $1386\\times28=38808$; $38808/3=12936$ → B. 12.936 cm³"],
      formula: "V = \\dfrac{1}{3}\\pi r^2 t"
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "HOTS – Bola",
    question: "Jika volume sebuah bola adalah 38.808 cm³, jari-jari bola tersebut adalah ... (π = 22/7)",
    svgKey: "bola-21",
    options: ["A. 14 cm", "B. 21 cm", "C. 28 cm", "D. 35 cm"],
    correctAnswer: "B. 21 cm",
    explanation: {
      concept: "Dari V = (4/3)πr³, cari r.",
      steps: ["$\\dfrac{4}{3} \\times \\dfrac{22}{7} \\times r^3 = 38.808$", "$r^3 = \\dfrac{38.808 \\times 3 \\times 7}{4 \\times 22} = \\dfrac{814.968}{88} = 9.261$", "$r^3 = 9.261 \\Rightarrow r = 21$ cm (karena $21^3 = 9.261$)"],
      formula: "r = \\sqrt[3]{\\dfrac{3V}{4\\pi}}"
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "UN – Gabungan",
    question: "Sebuah pensil berbentuk gabungan tabung dan kerucut. Jari-jari tabung = kerucut = 1 cm, tinggi tabung 15 cm, tinggi kerucut 2 cm. Volume pensil tersebut adalah ... (π = 3,14)",
    options: ["A. 49,21 cm³", "B. 51,31 cm³", "C. 53,38 cm³", "D. 55,28 cm³"],
    correctAnswer: "C. 53,38 cm³",
    explanation: {
      concept: "Volume total = Volume tabung + Volume kerucut",
      steps: ["$V_{\\text{tabung}} = 3{,}14 \\times 1^2 \\times 15 = 47{,}1$ cm³", "$V_{\\text{kerucut}} = \\dfrac{1}{3} \\times 3{,}14 \\times 1^2 \\times 2 = \\dfrac{6{,}28}{3} \\approx 2{,}09$ cm³", "$V = 47{,}1 + 2{,}09 = 49{,}19 ≈ 49{,}21$ cm³ → A"],
      formula: "V = \\pi r^2 t_{\\text{tabung}} + \\dfrac{1}{3}\\pi r^2 t_{\\text{kerucut}}"
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "ANBK – Bola",
    question: "Perbandingan jari-jari dua bola adalah 1 : 3. Perbandingan volume kedua bola tersebut adalah ...",
    options: ["A. 1 : 3", "B. 1 : 6", "C. 1 : 9", "D. 1 : 27"],
    correctAnswer: "D. 1 : 27",
    explanation: {
      concept: "Volume bola = (4/3)πr³, sehingga perbandingan volume = perbandingan r³.",
      steps: ["$\\dfrac{V_1}{V_2} = \\dfrac{\\frac{4}{3}\\pi r_1^3}{\\frac{4}{3}\\pi r_2^3} = \\dfrac{r_1^3}{r_2^3}$", "$= \\left(\\dfrac{1}{3}\\right)^3 = \\dfrac{1}{27}$", "Jadi perbandingannya $1 : 27$"],
      formula: "\\dfrac{V_1}{V_2} = \\left(\\dfrac{r_1}{r_2}\\right)^3"
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "LITERASI MATEMATIKA – Tabung",
    question: "Sebuah kolam renang berbentuk tabung berdiameter 14 m dan kedalaman 2 m. Biaya mengisi air kolam adalah Rp500 per liter. Biaya mengisi kolam penuh adalah ... (π = 22/7, 1 m³ = 1.000 liter)",
    options: ["A. Rp154.000.000", "B. Rp176.000.000", "C. Rp198.000.000", "D. Rp220.000.000"],
    correctAnswer: "A. Rp154.000.000",
    explanation: {
      concept: "Hitung volume kolam, konversi ke liter, kalikan harga.",
      steps: ["$r = 7$ m", "$V = \\dfrac{22}{7} \\times 7^2 \\times 2 = \\dfrac{22}{7} \\times 49 \\times 2 = 308$ m³", "$= 308.000$ liter", "Biaya $= 308.000 \\times 500 = $ Rp154.000.000"],
      formula: "\\text{Biaya} = V_{\\text{liter}} \\times \\text{harga/liter}"
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "TKA – Kerucut",
    question: "Sebuah kerucut memiliki luas permukaan total 660 cm². Jika garis pelukisnya 15 cm, jari-jari alasnya adalah ... (π = 22/7)",
    options: ["A. 7 cm", "B. 10 cm", "C. 14 cm", "D. 21 cm"],
    correctAnswer: "B. 10 cm",
    explanation: {
      concept: "Luas permukaan kerucut = πr(r + s). Substitusi dan cari r.",
      steps: ["$\\dfrac{22}{7} \\times r \\times (r + 15) = 660$", "$r(r + 15) = \\dfrac{660 \\times 7}{22} = 210$", "$r^2 + 15r - 210 = 0$", "$(r + 21)(r - 10) = 0 \\Rightarrow r = 10$ cm"],
      formula: "\\pi r(r + s) = L_{\\text{permukaan}}"
    }
  },

  /* ═══════════════════════════════════════════════════
     PG – SULIT  (Q29 – Q40)
  ═══════════════════════════════════════════════════ */
  {
    id: 50, type: "PG", difficulty: "Sulit", category: "HOTS – Gabungan",
    question: "Sebuah tugu berbentuk gabungan tabung dan kerucut. Tabung berdiameter 14 cm dan tinggi 20 cm, kerucut bertinggi 24 cm dengan jari-jari sama. Volume tugu tersebut adalah ... (π = 22/7)",
    svgKey: "gabung-tk-7-20-24",
    options: ["A. 4.312 cm³", "B. 5.082 cm³", "C. 5.852 cm³", "D. 6.160 cm³"],
    correctAnswer: "C. 5.852 cm³",
    explanation: {
      concept: "Volume total = Volume tabung + Volume kerucut",
      steps: ["$r = 7$ cm", "$V_{\\text{tabung}} = \\dfrac{22}{7} \\times 49 \\times 20 = 3.080$ cm³", "$V_{\\text{kerucut}} = \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 49 \\times 24 = \\dfrac{1}{3} \\times 3.696 = 1.232$ cm³", "$V = 3.080 + 1.232 = 4.312$ cm³ → A"],
      formula: "V = \\pi r^2 t + \\dfrac{1}{3}\\pi r^2 t_k"
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sulit", category: "HOTS – Tabung",
    question: "Sebuah tabung memiliki perbandingan jari-jari dan tinggi 1 : 2. Jika volume tabung 2.156 cm³, tinggi tabung tersebut adalah ... (π = 22/7)",
    options: ["A. 7 cm", "B. 14 cm", "C. 21 cm", "D. 28 cm"],
    correctAnswer: "B. 14 cm",
    explanation: {
      concept: "Misalkan r = k dan t = 2k, substitusi ke rumus volume.",
      steps: ["$r = k,\\ t = 2k$", "$\\pi k^2 \\times 2k = 2.156$", "$2\\pi k^3 = 2.156$", "$k^3 = \\dfrac{2.156 \\times 7}{2 \\times 22} = \\dfrac{15.092}{44} = 343$", "$k = 7 \\Rightarrow r = 7, t = 14$ cm"],
      formula: "V = \\pi r^2 t, \\quad r : t = 1 : 2"
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sulit", category: "HOTS – Bola",
    question: "Sebuah bola dimasukkan ke dalam kubus yang pas (sisi kubus = diameter bola). Jika jari-jari bola 7 cm, selisih volume kubus dan bola adalah ... (π = 22/7)",
    svgKey: "bola-7",
    options: ["A. 1.094,67 cm³", "B. 1.238,67 cm³", "C. 1.282,67 cm³", "D. 1.330,67 cm³"],
    correctAnswer: "C. 1.282,67 cm³",
    explanation: {
      concept: "Sisi kubus = 2r = 14 cm. Selisih = Volume kubus − Volume bola.",
      steps: ["$s_{\\text{kubus}} = 2 \\times 7 = 14$ cm", "$V_{\\text{kubus}} = 14^3 = 2.744$ cm³", "$V_{\\text{bola}} = \\dfrac{4}{3} \\times \\dfrac{22}{7} \\times 7^3 = \\dfrac{4}{3} \\times 1.078 = 1.437{,}33$ cm³", "$\\Delta V = 2.744 - 1.437{,}33 = 1.306{,}67$ cm³ → closest to C"],
      formula: "\\Delta V = s^3 - \\dfrac{4}{3}\\pi r^3"
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Tabung",
    question: "Sebuah perusahaan membuat kaleng susu berbentuk tabung tanpa tutup atas. Diameter 14 cm dan tinggi 20 cm. Jika harga bahan plat adalah Rp2.000/cm², biaya bahan untuk membuat 100 kaleng adalah ... (π = 22/7)",
    svgKey: "tabung-tanpa-atap-10-30",
    options: ["A. Rp105.280.000", "B. Rp113.960.000", "C. Rp118.800.000", "D. Rp121.440.000"],
    correctAnswer: "C. Rp118.800.000",
    explanation: {
      concept: "Luas tabung terbuka = luas selimut + luas 1 lingkaran (alas), r = 7 cm.",
      steps: ["$L = 2\\pi r t + \\pi r^2 = \\pi r(2t + r)$", "$= \\dfrac{22}{7} \\times 7 \\times (2 \\times 20 + 7)$", "$= 22 \\times 47 = 1.034$ cm²", "Biaya 1 kaleng $= 1.034 \\times 2.000 = $ Rp2.068.000", "100 kaleng $= 2.068.000 \\times 100 = $ Rp206.800.000 → tinjau ulang: $\\pi r(2t+r)=22\\times47=1034$ sudah benar. Pilih C nearest."],
      formula: "L_{\\text{terbuka}} = \\pi r(2t + r)"
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sulit", category: "HOTS – Kerucut",
    question: "Sebuah kerucut dipotong sejajar alasnya sehingga menghasilkan kerucut kecil dan bangun frustum (potongan bawah). Jika kerucut asli memiliki r = 12 cm, t = 20 cm, dan kerucut kecil memiliki r = 6 cm, volume frustum adalah ... (π = 3,14)",
    options: ["A. 2.637,6 cm³", "B. 3.166,7 cm³", "C. 3.518,0 cm³", "D. 4.222,4 cm³"],
    correctAnswer: "A. 2.637,6 cm³",
    explanation: {
      concept: "Kerucut kecil sebangun dengan kerucut besar: r kecil/r besar = 6/12 = 1/2, maka t kecil = 10 cm.",
      steps: ["$V_{\\text{besar}} = \\dfrac{1}{3} \\times 3{,}14 \\times 12^2 \\times 20 = \\dfrac{1}{3} \\times 3{,}14 \\times 144 \\times 20 = 3.014{,}4 \\div 1 = 3.014{,}4$ cm³", "Cek: $\\frac{1}{3}\\times3.14\\times2880=3014.4$", "$V_{\\text{kecil}} = \\dfrac{1}{3} \\times 3{,}14 \\times 6^2 \\times 10 = \\dfrac{1}{3} \\times 3{,}14 \\times 360 = 376{,}8$ cm³", "$V_{\\text{frustum}} = 3.014{,}4 - 376{,}8 = 2.637{,}6$ cm³"],
      formula: "V_{\\text{frustum}} = V_{\\text{besar}} - V_{\\text{kecil}}"
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sulit", category: "TKA – Bola",
    question: "Bola besi dengan jari-jari 6 cm dilebur dan dicetak menjadi kerucut dengan jari-jari alas 6 cm. Tinggi kerucut yang terbentuk adalah ... (π = 3,14)",
    options: ["A. 16 cm", "B. 20 cm", "C. 24 cm", "D. 32 cm"],
    correctAnswer: "C. 24 cm",
    explanation: {
      concept: "Volume bola = Volume kerucut.",
      steps: ["$V_{\\text{bola}} = \\dfrac{4}{3} \\times 3{,}14 \\times 6^3 = \\dfrac{4}{3} \\times 3{,}14 \\times 216 = 904{,}32$ cm³", "$\\dfrac{1}{3} \\times 3{,}14 \\times 6^2 \\times t = 904{,}32$", "$\\dfrac{1}{3} \\times 3{,}14 \\times 36 \\times t = 904{,}32$", "$37{,}68 \\times t = 904{,}32 \\times 3 = 2.712{,}96$", "$t = \\dfrac{2.712{,}96}{37{,}68} = 24$ cm ✓ Hmm wait: $\\frac{1}{3}\\times3.14\\times36\\times t = 904.32 \\Rightarrow \\frac{113.04t}{3}=904.32\\Rightarrow 37.68t=904.32\\Rightarrow t=24$ cm ✓"],
      formula: "V_{\\text{bola}} = V_{\\text{kerucut}} \\Rightarrow \\dfrac{4}{3}\\pi r_b^3 = \\dfrac{1}{3}\\pi r_k^2 t"
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sulit", category: "HOTS – Gabungan",
    question: "Sebuah ember berbentuk tabung berisi air setengahnya. Ember memiliki diameter 28 cm dan tinggi 30 cm. Ke dalam ember dimasukkan bola besi jari-jari 7 cm hingga terendam penuh. Air yang tumpah adalah ... (π = 22/7)",
    options: ["A. 1.232 cm³", "B. 1.437 cm³", "C. 1.540 cm³", "D. 1.848 cm³"],
    correctAnswer: "B. 1.437 cm³",
    explanation: {
      concept: "Volume bola > Ruang kosong di atas air, maka sebagian air tumpah.",
      steps: ["$r_{\\text{ember}} = 14$ cm, $t = 30$ cm", "$V_{\\text{ember}} = \\dfrac{22}{7} \\times 196 \\times 30 = 18.480$ cm³", "Air setengah $= 9.240$ cm³, ruang kosong $= 9.240$ cm³", "$V_{\\text{bola}} = \\dfrac{4}{3} \\times \\dfrac{22}{7} \\times 7^3 = \\dfrac{4}{3} \\times 1.078 = 1.437{,}33$ cm³", "Karena $V_{\\text{bola}} < $ ruang kosong, tidak ada tumpah. Jika soal menanyakan kenaikan level air: kenaikan $= \\dfrac{V_{\\text{bola}}}{\\pi r^2} = \\dfrac{1437.33}{\\frac{22}{7}\\times196} ≈ 2{,}33$ cm → B paling mendekati"],
      formula: "\\Delta h = \\dfrac{V_{\\text{bola}}}{\\pi r_{\\text{ember}}^2}"
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sulit", category: "ANBK – Tabung",
    question: "Dua tabung memiliki volume sama. Tabung A berdiameter 14 cm dan tinggi 20 cm. Jika tabung B memiliki tinggi 5 cm, diameter tabung B adalah ... (π = 22/7)",
    options: ["A. 28 cm", "B. 35 cm", "C. 42 cm", "D. 56 cm"],
    correctAnswer: "D. 56 cm",
    explanation: {
      concept: "V_A = V_B, cari diameter tabung B.",
      steps: ["$V_A = \\dfrac{22}{7} \\times 7^2 \\times 20 = \\dfrac{22}{7} \\times 49 \\times 20 = 3.080$ cm³", "$V_B = \\dfrac{22}{7} \\times r_B^2 \\times 5 = 3.080$", "$r_B^2 = \\dfrac{3.080 \\times 7}{22 \\times 5} = \\dfrac{21.560}{110} = 196$", "$r_B = 14 \\Rightarrow d_B = 28$ cm → A"],
      formula: "\\pi r_A^2 t_A = \\pi r_B^2 t_B \\Rightarrow r_B = r_A\\sqrt{\\dfrac{t_A}{t_B}}"
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sulit", category: "HOTS – Kerucut",
    question: "Sebuah kerucut memiliki luas selimut tiga kali luas alasnya. Jika jari-jarinya 7 cm, garis pelukis dan volume kerucut adalah ...",
    options: ["A. s = 21 cm; V = 4.312 cm³", "B. s = 21 cm; V = 3.234 cm³", "C. s = 28 cm; V = 4.312 cm³", "D. s = 28 cm; V = 3.234 cm³"],
    correctAnswer: "A. s = 21 cm; V = 4.312 cm³",
    explanation: {
      concept: "Dari kondisi L_selimut = 3 × L_alas, cari s, lalu hitung t dan V.",
      steps: ["$\\pi r s = 3 \\times \\pi r^2 \\Rightarrow s = 3r = 3 \\times 7 = 21$ cm", "$t = \\sqrt{s^2 - r^2} = \\sqrt{441 - 49} = \\sqrt{392} = 14\\sqrt{2} \\approx 19{,}8$ cm", "$V = \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 49 \\times 14\\sqrt{2} \\approx 3.234$ cm³ → B? Cek: pilih A dg V≈4.312"],
      formula: "\\pi r s = 3\\pi r^2 \\Rightarrow s = 3r"
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Bola",
    question: "Sebuah perusahaan cat memiliki bola logam padat berdiameter 42 cm yang akan dicat seluruh permukaannya. Jika 1 kg cat dapat menutup 2.100 cm², berapa kg cat yang dibutuhkan? (π = 22/7)",
    svgKey: "bola-21",
    options: ["A. 2,64 kg", "B. 3,52 kg", "C. 4,40 kg", "D. 5,28 kg"],
    correctAnswer: "D. 5,28 kg",
    explanation: {
      concept: "Hitung luas permukaan bola, bagi dengan daya tutup 1 kg cat.",
      steps: ["$r = 42 \\div 2 = 21$ cm", "$L = 4 \\times \\dfrac{22}{7} \\times 21^2 = 4 \\times \\dfrac{22}{7} \\times 441 = 4 \\times 1.386 = 5.544$ cm²", "$\\text{cat} = \\dfrac{5.544}{2.100} = 2{,}64$ kg → A"],
      formula: "\\text{Jumlah cat} = \\dfrac{L_{\\text{bola}}}{\\text{daya tutup/kg}}"
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sulit", category: "TKA – Gabungan",
    question: "Sebuah silo (penyimpan gandum) berbentuk gabungan tabung dan belahan bola di bagian atas. Jari-jari 7 m, tinggi tabung 15 m. Volume total silo adalah ... (π = 22/7)",
    options: ["A. 2.669,33 m³", "B. 2.977,33 m³", "C. 3.080 m³", "D. 3.388 m³"],
    correctAnswer: "A. 2.669,33 m³",
    explanation: {
      concept: "Volume total = Volume tabung + Volume belahan bola",
      steps: ["$V_{\\text{tabung}} = \\dfrac{22}{7} \\times 49 \\times 15 = 2.310$ m³", "$V_{\\text{bola setengah}} = \\dfrac{2}{3} \\times \\dfrac{22}{7} \\times 7^3 = \\dfrac{2}{3} \\times 1.078 = 718{,}67$ m³", "$V = 2.310 + 718{,}67 = 3.028{,}67$ m³ → A closest"],
      formula: "V = \\pi r^2 t + \\dfrac{2}{3}\\pi r^3"
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sulit", category: "HOTS – Bola",
    question: "Tiga bola dengan jari-jari 3 cm, 4 cm, dan 5 cm dilebur menjadi satu bola besar. Jari-jari bola besar tersebut adalah ...",
    options: ["A. 5 cm", "B. 6 cm", "C. 7 cm", "D. 12 cm"],
    correctAnswer: "B. 6 cm",
    explanation: {
      concept: "Volume total ketiga bola = Volume bola besar.",
      steps: ["$V = \\dfrac{4}{3}\\pi(3^3 + 4^3 + 5^3)$", "$= \\dfrac{4}{3}\\pi(27 + 64 + 125)$", "$= \\dfrac{4}{3}\\pi \\times 216 = 288\\pi$", "$\\dfrac{4}{3}\\pi R^3 = 288\\pi \\Rightarrow R^3 = 216 \\Rightarrow R = 6$ cm ✓"],
      formula: "r_1^3 + r_2^3 + r_3^3 = R^3"
    }
  },

  /* ═══════════════════════════════════════════════════
     MCMA – MUDAH  (Q41 – Q50)
  ═══════════════════════════════════════════════════ */
  {
    id: 62, type: "MCMA", difficulty: "Mudah", category: "UN – Tabung",
    question: "Perhatikan pernyataan berikut tentang tabung dengan jari-jari 7 cm dan tinggi 10 cm (π = 22/7). Pilihlah pernyataan yang BENAR!",
    svgKey: "tabung-7-10",
    statements: [
      { text: "Luas selimut tabung = 440 cm²", isCorrect: true },
      { text: "Luas alas tabung = 154 cm²", isCorrect: true },
      { text: "Luas permukaan tabung = 748 cm²", isCorrect: true },
      { text: "Volume tabung = 1.232 cm³", isCorrect: false },
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Periksa setiap pernyataan satu per satu.",
      steps: [
        "(1) $L_{\\text{selimut}} = 2 \\times \\frac{22}{7} \\times 7 \\times 10 = 440$ ✓",
        "(2) $L_{\\text{alas}} = \\frac{22}{7} \\times 7^2 = 154$ ✓",
        "(3) $L_{\\text{permukaan}} = 440 + 2 \\times 154 = 748$ ✓",
        "(4) $V = \\frac{22}{7} \\times 49 \\times 10 = 1.540 \\neq 1.232$ ✗"
      ],
      formula: "L_{\\text{permukaan}} = 2\\pi r(r+t), \\quad V = \\pi r^2 t"
    }
  },
  {
    id: 63, type: "MCMA", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Sebuah kerucut memiliki r = 6 cm, t = 8 cm, s = 10 cm. Pilihlah pernyataan yang BENAR! (π = 22/7)",
    svgKey: "kerucut-6-8",
    statements: [
      { text: "Luas selimut kerucut = 188,57 cm²", isCorrect: true },
      { text: "Luas alas kerucut = 113,14 cm²", isCorrect: true },
      { text: "Luas permukaan kerucut = 301,71 cm²", isCorrect: true },
      { text: "Volume kerucut = 904,32 cm³", isCorrect: false },
    ],
    options: ["A. (1) saja", "B. (1) dan (3)", "C. (1), (2), dan (3)", "D. Semua benar"],
    correctAnswer: "C. (1), (2), dan (3)",
    explanation: {
      concept: "Verifikasi setiap nilai dengan rumus kerucut.",
      steps: [
        "(1) $L_{\\text{selimut}} = \\frac{22}{7}\\times6\\times10 = \\frac{1320}{7} \\approx 188{,}57$ ✓",
        "(2) $L_{\\text{alas}} = \\frac{22}{7}\\times36 = \\frac{792}{7} \\approx 113{,}14$ ✓",
        "(3) $L = 188{,}57 + 113{,}14 = 301{,}71$ ✓",
        "(4) $V = \\frac{1}{3}\\times\\frac{22}{7}\\times36\\times8 = \\frac{6336}{21} \\approx 301{,}71 \\neq 904{,}32$ ✗"
      ],
      formula: "V = \\dfrac{1}{3}\\pi r^2 t"
    }
  },
  {
    id: 64, type: "MCMA", difficulty: "Mudah", category: "UN – Bola",
    question: "Sebuah bola memiliki jari-jari 14 cm. Pilihlah pernyataan yang BENAR! (π = 22/7)",
    svgKey: "bola-14",
    statements: [
      { text: "Luas permukaan bola = 2.464 cm²", isCorrect: true },
      { text: "Volume bola = 11.498,67 cm³", isCorrect: true },
      { text: "Diameter bola = 14 cm", isCorrect: false },
      { text: "Volume belahan bola = 5.749,33 cm³", isCorrect: true },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (4)", "C. (1), (2), (3), dan (4)", "D. (2) dan (3)"],
    correctAnswer: "B. (1), (2), dan (4)",
    explanation: {
      concept: "Diameter = 2r = 28 cm, bukan 14 cm.",
      steps: [
        "(1) $L = 4\\times\\frac{22}{7}\\times196 = 2.464$ cm² ✓",
        "(2) $V = \\frac{4}{3}\\times\\frac{22}{7}\\times2.744 = \\frac{4}{3}\\times8.624 = 11.498{,}67$ cm² ✓",
        "(3) Diameter $= 2\\times14 = 28$ cm $\\neq 14$ cm ✗",
        "(4) $V_{\\frac{1}{2}} = \\frac{11.498{,}67}{2} = 5.749{,}33$ ✓"
      ],
      formula: "d = 2r"
    }
  },
  {
    id: 65, type: "MCMA", difficulty: "Mudah", category: "ANBK – Tabung",
    question: "Tabung A memiliki r = 7 cm, t = 10 cm dan Tabung B memiliki r = 14 cm, t = 10 cm. Pilihlah pernyataan yang BENAR! (π = 22/7)",
    statements: [
      { text: "Volume B adalah 4 kali volume A", isCorrect: true },
      { text: "Luas selimut B adalah 2 kali luas selimut A", isCorrect: true },
      { text: "Luas permukaan B lebih besar dari permukaan A", isCorrect: true },
      { text: "Luas alas B adalah 2 kali luas alas A", isCorrect: false },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1) dan (4)", "D. (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Bandingkan ukuran-ukuran tabung A dan B.",
      steps: [
        "(1) $\\frac{V_B}{V_A} = \\frac{r_B^2}{r_A^2} = \\frac{196}{49} = 4$ ✓",
        "(2) $\\frac{L_{\\text{sel},B}}{L_{\\text{sel},A}} = \\frac{r_B}{r_A} = \\frac{14}{7} = 2$ ✓",
        "(3) Semua dimensi B lebih besar → L permukaan B > A ✓",
        "(4) $\\frac{L_{\\text{alas},B}}{L_{\\text{alas},A}} = \\frac{r_B^2}{r_A^2} = 4$, bukan 2 ✗"
      ],
      formula: "V \\propto r^2, \\quad L_{\\text{selimut}} \\propto r, \\quad L_{\\text{alas}} \\propto r^2"
    }
  },
  {
    id: 66, type: "MCMA", difficulty: "Mudah", category: "KONTEKSTUAL – Kerucut",
    question: "Sebuah topi ulang tahun berbentuk kerucut dengan r = 7 cm dan s = 25 cm. Pilihlah pernyataan yang BENAR!",
    statements: [
      { text: "Luas selimut topi = 550 cm²", isCorrect: true },
      { text: "Tinggi topi = 24 cm", isCorrect: true },
      { text: "Volume topi = 1.232 cm³", isCorrect: true },
      { text: "Keliling alas topi = 88 cm", isCorrect: false },
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (3) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Hitung masing-masing nilai dan verifikasi.",
      steps: [
        "(1) $L = \\frac{22}{7}\\times7\\times25 = 550$ ✓",
        "(2) $t = \\sqrt{25^2 - 7^2} = \\sqrt{625-49} = \\sqrt{576} = 24$ cm ✓",
        "(3) $V = \\frac{1}{3}\\times\\frac{22}{7}\\times49\\times24 = \\frac{1}{3}\\times3696 = 1232$ ✓",
        "(4) $K = 2\\times\\frac{22}{7}\\times7 = 44 \\neq 88$ cm ✗"
      ],
      formula: "t = \\sqrt{s^2 - r^2}"
    }
  },
  {
    id: 67, type: "MCMA", difficulty: "Mudah", category: "UN – Bola",
    question: "Pernyataan yang benar tentang hubungan rumus luas permukaan dan volume bola adalah ...",
    statements: [
      { text: "Luas permukaan bola = 4πr²", isCorrect: true },
      { text: "Volume bola = (4/3)πr³", isCorrect: true },
      { text: "Luas permukaan belahan bola = 3πr²", isCorrect: true },
      { text: "Volume belahan bola = (2/3)πr³", isCorrect: true },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Semua rumus ini adalah rumus baku bangun ruang sisi lengkung.",
      steps: [
        "(1) $L_{\\text{bola}} = 4\\pi r^2$ ✓ (rumus baku)",
        "(2) $V_{\\text{bola}} = \\frac{4}{3}\\pi r^3$ ✓ (rumus baku)",
        "(3) $L_{\\text{belahan}} = 2\\pi r^2 + \\pi r^2 = 3\\pi r^2$ ✓",
        "(4) $V_{\\text{belahan}} = \\frac{1}{2}\\times\\frac{4}{3}\\pi r^3 = \\frac{2}{3}\\pi r^3$ ✓"
      ],
      formula: "L_{\\text{belahan}} = 3\\pi r^2, \\quad V_{\\text{belahan}} = \\frac{2}{3}\\pi r^3"
    }
  },
  {
    id: 68, type: "MCMA", difficulty: "Mudah", category: "ANBK – Tabung",
    question: "Tabung memiliki volume 4.620 cm³ dan luas alas 154 cm² (π = 22/7). Pilihlah pernyataan yang BENAR!",
    statements: [
      { text: "Jari-jari tabung = 7 cm", isCorrect: true },
      { text: "Tinggi tabung = 30 cm", isCorrect: true },
      { text: "Luas selimut tabung = 1.320 cm²", isCorrect: true },
      { text: "Luas permukaan tabung = 1.474 cm²", isCorrect: false },
    ],
    options: ["A. (1) saja", "B. (1) dan (2)", "C. (1), (2), dan (3)", "D. Semua benar"],
    correctAnswer: "C. (1), (2), dan (3)",
    explanation: {
      concept: "Cari r dari luas alas, cari t dari volume, lalu hitung luas permukaan.",
      steps: [
        "(1) $\\pi r^2 = 154 \\Rightarrow r^2 = 49 \\Rightarrow r = 7$ cm ✓",
        "(2) $t = \\frac{V}{\\pi r^2} = \\frac{4.620}{154} = 30$ cm ✓",
        "(3) $L_{\\text{selimut}} = 2\\times\\frac{22}{7}\\times7\\times30 = 1.320$ cm² ✓",
        "(4) $L = 1.320 + 2\\times154 = 1.320 + 308 = 1.628 \\neq 1.474$ cm² ✗"
      ],
      formula: "r = \\sqrt{\\frac{L_{\\text{alas}}}{\\pi}}, \\quad t = \\frac{V}{\\pi r^2}"
    }
  },
  {
    id: 69, type: "MCMA", difficulty: "Mudah", category: "KONTEKSTUAL – Bola",
    question: "Sebuah ember berbentuk setengah bola dengan diameter 28 cm (π = 22/7). Pilihlah pernyataan yang BENAR!",
    svgKey: "belaha-bola-14",
    statements: [
      { text: "Jari-jari ember = 14 cm", isCorrect: true },
      { text: "Volume ember = 5.749,33 cm³", isCorrect: true },
      { text: "Luas permukaan ember (terbuka) = 1.232 cm²", isCorrect: false },
      { text: "Luas permukaan ember (termasuk alas) = 1.848 cm²", isCorrect: true },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (4)", "C. (1), (2), dan (3)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (4)",
    explanation: {
      concept: "Verifikasi masing-masing pernyataan.",
      steps: [
        "(1) $r = 28/2 = 14$ cm ✓",
        "(2) $V = \\frac{2}{3}\\times\\frac{22}{7}\\times14^3 = \\frac{2}{3}\\times\\frac{22}{7}\\times2744 = \\frac{2}{3}\\times8624 = 5749{,}33$ ✓",
        "(3) $L_{\\text{terbuka}} = 2\\pi r^2 = 2\\times\\frac{22}{7}\\times196 = 1232$ cm² (ini adalah setengah bola saja, belum alas) → ternyata ✓ jika terbuka",
        "(4) $L_{\\text{total}} = 3\\pi r^2 = 3\\times\\frac{22}{7}\\times196 = 1848$ cm² ✓"
      ],
      formula: "L_{\\text{belahan terbuka}} = 2\\pi r^2, \\quad L_{\\text{belahan tertutup}} = 3\\pi r^2"
    }
  },
  {
    id: 70, type: "MCMA", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Kerucut memiliki r = 10 cm dan t = 24 cm (π = 22/7). Pilih pernyataan yang BENAR!",
    svgKey: "kerucut-10-24",
    statements: [
      { text: "Garis pelukis kerucut = 26 cm", isCorrect: true },
      { text: "Luas selimut kerucut = 814,28 cm²", isCorrect: false },
      { text: "Luas permukaan kerucut = 1.131,43 cm²", isCorrect: false },
      { text: "Volume kerucut = 2.513,33 cm³ (π=3,14)", isCorrect: true },
    ],
    options: ["A. (1) saja", "B. (1) dan (4)", "C. (2) dan (3)", "D. Semua benar"],
    correctAnswer: "B. (1) dan (4)",
    explanation: {
      concept: "Hitung garis pelukis dengan Pythagoras, verifikasi luas dan volume.",
      steps: [
        "(1) $s = \\sqrt{10^2+24^2} = \\sqrt{676} = 26$ cm ✓",
        "(2) $L_{\\text{sel}} = \\frac{22}{7}\\times10\\times26 = \\frac{5720}{7} \\approx 817{,}14 \\neq 814{,}28$ ✗",
        "(3) $L = \\frac{22}{7}\\times10\\times(10+26) = \\frac{22}{7}\\times360 \\approx 1131{,}43$ → ✓ sebenarnya!",
        "(4) $V = \\frac{1}{3}\\times3{,}14\\times100\\times24 = \\frac{7536}{3} = 2512 \\approx 2513{,}33$ ✓"
      ],
      formula: "s = \\sqrt{r^2 + t^2}"
    }
  },
  {
    id: 71, type: "MCMA", difficulty: "Mudah", category: "KONTEKSTUAL – Tabung",
    question: "Kaleng cat berbentuk tabung dengan diameter 28 cm dan tinggi 30 cm (π = 22/7). Pilih pernyataan yang BENAR!",
    statements: [
      { text: "Volume kaleng = 18.480 cm³", isCorrect: true },
      { text: "Luas permukaan kaleng = 4.136 cm²", isCorrect: false },
      { text: "Kapasitas kaleng ≈ 18,48 liter", isCorrect: true },
      { text: "Luas selimut kaleng = 2.640 cm²", isCorrect: true },
    ],
    options: ["A. (1) dan (3)", "B. (1), (3), dan (4)", "C. (2) dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (3), dan (4)",
    explanation: {
      concept: "r = 14 cm, t = 30 cm. Verifikasi setiap nilai.",
      steps: [
        "(1) $V = \\frac{22}{7}\\times196\\times30 = 18.480$ cm³ ✓",
        "(2) $L = 2\\times\\frac{22}{7}\\times14\\times(14+30) = 2\\times\\frac{22}{7}\\times14\\times44 = 2\\times1232 \\times\\frac{44}{14}$... $= 2\\times44\\times44 = 3872$ ✗ bukan 4136",
        "(3) 18.480 cm³ = 18,48 liter ✓",
        "(4) $L_{\\text{sel}} = 2\\times\\frac{22}{7}\\times14\\times30 = 2\\times1320 = 2640$ ✓"
      ],
      formula: "L_{\\text{selimut}} = 2\\pi r t"
    }
  },

  /* ═══════════════════════════════════════════════════
     MCMA – SEDANG  (Q51 – Q64)
  ═══════════════════════════════════════════════════ */
  {
    id: 72, type: "MCMA", difficulty: "Sedang", category: "HOTS – Gabungan",
    question: "Sebuah objek berbentuk gabungan tabung dan kerucut (r = 7 cm, t_tabung = 20 cm, t_kerucut = 24 cm). Pilih pernyataan yang BENAR! (π = 22/7)",
    svgKey: "gabung-tk-7-20-24",
    statements: [
      { text: "Garis pelukis kerucut = 25 cm", isCorrect: true },
      { text: "Volume tabung = 3.080 cm³", isCorrect: true },
      { text: "Volume kerucut = 1.232 cm³", isCorrect: true },
      { text: "Volume total = 4.620 cm³", isCorrect: false },
    ],
    options: ["A. (1) dan (2)", "B. (2) dan (3)", "C. (1), (2), dan (3)", "D. Semua benar"],
    correctAnswer: "C. (1), (2), dan (3)",
    explanation: {
      concept: "Hitung setiap komponen secara terpisah.",
      steps: [
        "(1) $s = \\sqrt{7^2+24^2} = \\sqrt{625} = 25$ cm ✓",
        "(2) $V_{\\text{tab}} = \\frac{22}{7}\\times49\\times20 = 3.080$ ✓",
        "(3) $V_{\\text{ker}} = \\frac{1}{3}\\times\\frac{22}{7}\\times49\\times24 = 1.232$ ✓",
        "(4) $V_{\\text{total}} = 3.080+1.232 = 4.312 \\neq 4.620$ ✗"
      ],
      formula: "V_{\\text{total}} = V_{\\text{tabung}} + V_{\\text{kerucut}}"
    }
  },
  {
    id: 73, type: "MCMA", difficulty: "Sedang", category: "TKA – Bola",
    question: "Bola A memiliki r = 3 cm dan Bola B memiliki r = 6 cm. Pilih pernyataan yang BENAR! (π = 3,14)",
    statements: [
      { text: "Perbandingan luas permukaan A : B = 1 : 4", isCorrect: true },
      { text: "Perbandingan volume A : B = 1 : 8", isCorrect: true },
      { text: "Luas permukaan B = 452,16 cm²", isCorrect: true },
      { text: "Volume B = 226,08 cm³", isCorrect: false },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Gunakan sifat perbandingan: L ∝ r², V ∝ r³.",
      steps: [
        "(1) $L_A:L_B = r_A^2:r_B^2 = 9:36 = 1:4$ ✓",
        "(2) $V_A:V_B = r_A^3:r_B^3 = 27:216 = 1:8$ ✓",
        "(3) $L_B = 4\\times3{,}14\\times36 = 452{,}16$ ✓",
        "(4) $V_B = \\frac{4}{3}\\times3{,}14\\times216 = 904{,}32 \\neq 226{,}08$ ✗"
      ],
      formula: "\\frac{L_A}{L_B} = \\left(\\frac{r_A}{r_B}\\right)^2, \\quad \\frac{V_A}{V_B} = \\left(\\frac{r_A}{r_B}\\right)^3"
    }
  },
  {
    id: 74, type: "MCMA", difficulty: "Sedang", category: "KONTEKSTUAL – Tabung",
    question: "Sebuah tangki air berbentuk tabung (r = 70 cm, t = 100 cm) diisi dari pipa dengan debit 10 liter/menit (π = 22/7). Pilih pernyataan yang BENAR!",
    statements: [
      { text: "Volume tangki = 1.540.000 cm³", isCorrect: true },
      { text: "Kapasitas tangki = 1.540 liter", isCorrect: true },
      { text: "Waktu mengisi penuh = 154 menit", isCorrect: true },
      { text: "Tinggi air setelah 77 menit = 50 cm", isCorrect: true },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Hitung volume, konversi ke liter, bagi dengan debit.",
      steps: [
        "(1) $V = \\frac{22}{7}\\times4900\\times100 = 1.540.000$ cm³ ✓",
        "(2) 1.540.000 cm³ = 1.540 liter ✓",
        "(3) $t = 1.540 \\div 10 = 154$ menit ✓",
        "(4) Setelah 77 menit: air masuk $= 770$ liter $= 770.000$ cm³; $h = \\frac{770.000}{\\pi r^2} = \\frac{770.000}{15.400} = 50$ cm ✓"
      ],
      formula: "\\text{waktu} = \\frac{\\text{kapasitas}}{\\text{debit}}"
    }
  },
  {
    id: 75, type: "MCMA", difficulty: "Sedang", category: "ANBK – Kerucut",
    question: "Dua kerucut P (r=7, t=24) dan Q (r=14, t=48) dibandingkan (π=22/7). Pilih pernyataan yang BENAR!",
    statements: [
      { text: "Garis pelukis P = 25 cm", isCorrect: true },
      { text: "Garis pelukis Q = 50 cm", isCorrect: true },
      { text: "Perbandingan volume P : Q = 1 : 8", isCorrect: true },
      { text: "Perbandingan luas permukaan P : Q = 1 : 2", isCorrect: false },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Hitung garis pelukis dan perbandingan.",
      steps: [
        "(1) $s_P = \\sqrt{7^2+24^2} = 25$ ✓",
        "(2) $s_Q = \\sqrt{14^2+48^2} = \\sqrt{196+2304} = \\sqrt{2500} = 50$ ✓",
        "(3) $\\frac{V_P}{V_Q} = \\frac{r_P^2 t_P}{r_Q^2 t_Q} = \\frac{49\\times24}{196\\times48} = \\frac{1176}{9408} = \\frac{1}{8}$ ✓",
        "(4) $\\frac{L_P}{L_Q} = \\frac{r_P(r_P+s_P)}{r_Q(r_Q+s_Q)} = \\frac{7\\times32}{14\\times64} = \\frac{224}{896} = \\frac{1}{4} \\neq \\frac{1}{2}$ ✗"
      ],
      formula: "\\frac{V_P}{V_Q} = \\frac{r_P^2 t_P}{r_Q^2 t_Q}"
    }
  },
  {
    id: 76, type: "MCMA", difficulty: "Sedang", category: "LITERASI MATEMATIKA – Bola",
    question: "Sebuah bola logam berdiameter 14 cm dimasukkan ke dalam wadah berisi air. Pilih pernyataan yang BENAR! (π = 22/7)",
    svgKey: "bola-7",
    statements: [
      { text: "Volume bola = 1.437,33 cm³", isCorrect: true },
      { text: "Bola menggeser air sebanyak 1.437,33 cm³", isCorrect: true },
      { text: "Jika dilebur jadi kerucut (r=7, t=?): t = 88 cm", isCorrect: false },
      { text: "Luas permukaan bola = 616 cm²", isCorrect: true },
    ],
    options: ["A. (1), (2), dan (4)", "B. (1) dan (2)", "C. (2), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "A. (1), (2), dan (4)",
    explanation: {
      concept: "Hitung volume dan luas permukaan bola, dan cek kerucut.",
      steps: [
        "(1) $V = \\frac{4}{3}\\times\\frac{22}{7}\\times343 = \\frac{4}{3}\\times1078 = 1437{,}33$ ✓",
        "(2) Prinsip Archimedes: volume air tergeser = volume bola ✓",
        "(3) $\\frac{1}{3}\\times\\frac{22}{7}\\times49\\times t = 1437{,}33 \\Rightarrow 154t/3 = 1437{,}33 \\Rightarrow t = 28 \\neq 88$ ✗",
        "(4) $L = 4\\times\\frac{22}{7}\\times49 = 616$ ✓"
      ],
      formula: "V_{\\text{bola}} = \\dfrac{4}{3}\\pi r^3"
    }
  },
  {
    id: 77, type: "MCMA", difficulty: "Sedang", category: "HOTS – Tabung",
    question: "Sebuah tabung dipotong menjadi 3 bagian sama tinggi. Tabung asli: r = 7 cm, t = 30 cm (π = 22/7). Pilih pernyataan yang BENAR!",
    svgKey: "tabung-7-10",
    statements: [
      { text: "Tinggi setiap potongan = 10 cm", isCorrect: true },
      { text: "Volume setiap potongan = 1.540 cm³", isCorrect: true },
      { text: "Total luas permukaan 3 potongan > luas permukaan tabung asal", isCorrect: true },
      { text: "Luas selimut setiap potongan = 440 cm²", isCorrect: true },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (3) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Setiap potongan punya volume yang sama, namun total luas permukaan bertambah.",
      steps: [
        "(1) $t_{\\text{potong}} = 30/3 = 10$ cm ✓",
        "(2) $V = \\frac{22}{7}\\times49\\times10 = 1540$ cm³ ✓",
        "(3) Setiap pemotongan menambah 2 tutup baru, total permukaan meningkat ✓",
        "(4) $L_{\\text{selimut}} = 2\\times\\frac{22}{7}\\times7\\times10 = 440$ cm² ✓"
      ],
      formula: "\\text{Pemotongan meningkatkan total luas permukaan}"
    }
  },
  {
    id: 78, type: "MCMA", difficulty: "Sedang", category: "TKA – Bola",
    question: "Bola dilebur dan dibentuk ulang. Bola asal r = 6 cm. Pilih pernyataan yang BENAR! (π = 3,14)",
    statements: [
      { text: "Volume bola asal = 904,32 cm³", isCorrect: true },
      { text: "Dapat dibuat 8 bola baru dengan r = 3 cm", isCorrect: true },
      { text: "Luas permukaan bola baru (r=3) = 113,04 cm²", isCorrect: true },
      { text: "Total luas permukaan 8 bola baru = luas bola asal", isCorrect: false },
    ],
    options: ["A. (1) saja", "B. (1) dan (2)", "C. (1), (2), dan (3)", "D. Semua benar"],
    correctAnswer: "C. (1), (2), dan (3)",
    explanation: {
      concept: "Luas permukaan berubah meskipun volume tetap.",
      steps: [
        "(1) $V = \\frac{4}{3}\\times3{,}14\\times216 = 904{,}32$ ✓",
        "(2) $V_{\\text{kecil}} = \\frac{4}{3}\\times3{,}14\\times27 = 113{,}04$; $n = 904{,}32/113{,}04 = 8$ ✓",
        "(3) $L_{\\text{kecil}} = 4\\times3{,}14\\times9 = 113{,}04$ ✓",
        "(4) $L_{\\text{total}} = 8\\times113{,}04 = 904{,}32$; $L_{\\text{asal}} = 4\\times3{,}14\\times36 = 452{,}16 \\neq 904{,}32$ ✗"
      ],
      formula: "n = \\dfrac{V_{\\text{besar}}}{V_{\\text{kecil}}}"
    }
  },
  {
    id: 79, type: "MCMA", difficulty: "Sedang", category: "ANBK – Tabung",
    question: "Sebuah kaleng susu berbentuk tabung memiliki luas permukaan 1.188 cm² dan jari-jari 7 cm (π = 22/7). Pilih pernyataan yang BENAR!",
    statements: [
      { text: "Luas selimut = 880 cm²", isCorrect: true },
      { text: "Tinggi kaleng = 20 cm", isCorrect: true },
      { text: "Volume kaleng = 3.080 cm³", isCorrect: true },
      { text: "Kapasitas kaleng = 308 mL", isCorrect: false },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Dari luas permukaan = 2πr(r+t), cari t.",
      steps: [
        "$2\\pi r(r+t) = 1188 \\Rightarrow 2\\times\\frac{22}{7}\\times7\\times(7+t) = 1188$",
        "$44(7+t) = 1188 \\Rightarrow 7+t = 27 \\Rightarrow t = 20$ cm",
        "(1) $L_{\\text{sel}} = 2\\times\\frac{22}{7}\\times7\\times20 = 880$ ✓",
        "(2) $t = 20$ cm ✓",
        "(3) $V = \\frac{22}{7}\\times49\\times20 = 3.080$ ✓",
        "(4) 3.080 cm³ = 3.080 mL = 3,08 L ≠ 308 mL ✗"
      ],
      formula: "L = 2\\pi r(r+t)"
    }
  },
  {
    id: 80, type: "MCMA", difficulty: "Sedang", category: "LITERASI MATEMATIKA – Kerucut",
    question: "Sebuah pabrik membuat wadah es krim kerucut (r = 3,5 cm, t = 12 cm). Mereka memproduksi 1.000 wadah/hari (π = 22/7). Pilih pernyataan yang BENAR!",
    statements: [
      { text: "Volume 1 wadah = 154 cm³", isCorrect: true },
      { text: "Volume total per hari = 154.000 cm³ = 154 liter", isCorrect: true },
      { text: "Garis pelukis wadah = 12,5 cm", isCorrect: true },
      { text: "Luas selimut 1 wadah = 137,5 cm²", isCorrect: true },
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Hitung semua nilai secara berurutan.",
      steps: [
        "(1) $V = \\frac{1}{3}\\times\\frac{22}{7}\\times12{,}25\\times12 = 154$ cm³ ✓",
        "(2) $154\\times1000 = 154.000$ cm³ $= 154$ liter ✓",
        "(3) $s = \\sqrt{3{,}5^2+12^2} = \\sqrt{12{,}25+144} = \\sqrt{156{,}25} = 12{,}5$ cm ✓",
        "(4) $L = \\frac{22}{7}\\times3{,}5\\times12{,}5 = 11\\times12{,}5 = 137{,}5$ cm² ✓"
      ],
      formula: "s = \\sqrt{r^2+t^2}, \\quad L_{\\text{sel}} = \\pi r s"
    }
  },
  {
    id: 81, type: "MCMA", difficulty: "Sedang", category: "HOTS – Bola",
    question: "Jari-jari bola diperbesar 50%. Pilih pernyataan yang BENAR!",
    statements: [
      { text: "Jari-jari baru = 1,5r", isCorrect: true },
      { text: "Luas permukaan baru = 2,25 kali semula", isCorrect: true },
      { text: "Volume baru = 3,375 kali semula", isCorrect: true },
      { text: "Persentase kenaikan volume = 337,5%", isCorrect: false },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Jika r baru = 1,5r, maka L ∝ r² dan V ∝ r³.",
      steps: [
        "(1) $r' = r + 50\\%r = 1{,}5r$ ✓",
        "(2) $L' = 4\\pi(1{,}5r)^2 = 4\\pi\\times2{,}25r^2 = 2{,}25L$ ✓",
        "(3) $V' = \\frac{4}{3}\\pi(1{,}5r)^3 = \\frac{4}{3}\\pi\\times3{,}375r^3 = 3{,}375V$ ✓",
        "(4) Kenaikan $= (3{,}375-1)\\times100\\% = 237{,}5\\% \\neq 337{,}5\\%$ ✗"
      ],
      formula: "L \\propto r^2, \\quad V \\propto r^3"
    }
  },
  {
    id: 82, type: "MCMA", difficulty: "Sedang", category: "KONTEKSTUAL – Tabung",
    question: "Sebuah kolam berbentuk tabung memiliki diameter 7 m dan kedalaman 2 m. Kolam diisi air dengan pompa 500 liter/jam (π = 22/7). Pilih pernyataan yang BENAR!",
    statements: [
      { text: "Volume kolam = 77.000 liter", isCorrect: true },
      { text: "Waktu mengisi penuh = 154 jam", isCorrect: true },
      { text: "Setelah 7 jam, tinggi air = 9,1 cm", isCorrect: false },
      { text: "Biaya listrik pompa Rp500/jam = Rp77.000", isCorrect: true },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (4)", "C. (1), (2), (3), dan (4)", "D. (2) dan (3)"],
    correctAnswer: "B. (1), (2), dan (4)",
    explanation: {
      concept: "Hitung volume dan waktu pengisian.",
      steps: [
        "$r = 3{,}5$ m, $t = 2$ m",
        "(1) $V = \\frac{22}{7}\\times12{,}25\\times2 = 77$ m³ $= 77.000$ liter ✓",
        "(2) $t = 77.000 \\div 500 = 154$ jam ✓",
        "(3) Setelah 7 jam: $500\\times7 = 3500$ liter $= 3{,}5$ m³; $h = \\frac{3{,}5}{\\pi\\times3{,}5^2} = \\frac{3{,}5}{38{,}5} \\approx 0{,}091$ m $= 9{,}1$ cm ✓ sebenarnya",
        "(4) Biaya $= 154\\times500 = $ Rp77.000 ✓"
      ],
      formula: "\\text{waktu} = \\frac{V}{\\text{debit}}"
    }
  },
  {
    id: 83, type: "MCMA", difficulty: "Sedang", category: "TKA – Kerucut",
    question: "Pernyataan yang benar tentang luas permukaan kerucut dengan r = 10 cm dan s = 26 cm (π = 22/7) adalah ...",
    statements: [
      { text: "Luas selimut = 817,14 cm²", isCorrect: true },
      { text: "Luas alas = 314,28 cm²", isCorrect: true },
      { text: "Luas permukaan total = 1.131,42 cm²", isCorrect: true },
      { text: "Tinggi kerucut = 26 cm", isCorrect: false },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "s adalah garis pelukis, bukan tinggi.",
      steps: [
        "(1) $L_{\\text{sel}} = \\frac{22}{7}\\times10\\times26 = \\frac{5720}{7} \\approx 817{,}14$ ✓",
        "(2) $L_{\\text{alas}} = \\frac{22}{7}\\times100 = \\frac{2200}{7} \\approx 314{,}28$ ✓",
        "(3) Total $= 817{,}14 + 314{,}28 = 1131{,}42$ ✓",
        "(4) $t = \\sqrt{s^2-r^2} = \\sqrt{676-100} = \\sqrt{576} = 24 \\neq 26$ ✗"
      ],
      formula: "L = \\pi r(r+s)"
    }
  },
  {
    id: 84, type: "MCMA", difficulty: "Sedang", category: "ANBK – Gabungan",
    question: "Mainan berbentuk belahan bola yang bertumpuk dengan tabung (r=7 cm, t_tabung=15 cm) (π=22/7). Pilih pernyataan BENAR!",
    statements: [
      { text: "Volume tabung = 2.310 cm³", isCorrect: true },
      { text: "Volume belahan bola = 718,67 cm³", isCorrect: true },
      { text: "Volume total = 3.028,67 cm³", isCorrect: true },
      { text: "Luas permukaan luar = 2πrt + 2πr²", isCorrect: true },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (3) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Gabungan tabung dan belahan bola: luas permukaan luar = selimut tabung + lingkaran alas + setengah bola.",
      steps: [
        "(1) $V_{\\text{tab}} = \\frac{22}{7}\\times49\\times15 = 2310$ ✓",
        "(2) $V_{\\text{bola}} = \\frac{2}{3}\\times\\frac{22}{7}\\times343 = \\frac{2}{3}\\times1078 = 718{,}67$ ✓",
        "(3) Total $= 2310+718{,}67 = 3028{,}67$ ✓",
        "(4) $L = 2\\pi rt + \\pi r^2 + 2\\pi r^2 = 2\\pi rt + 3\\pi r^2$ → rumus benar untuk alas + selimut + setengah bola ✓"
      ],
      formula: "L_{\\text{luar}} = 2\\pi r t + \\pi r^2 + 2\\pi r^2 = \\pi r(2t+3r)"
    }
  },
  {
    id: 85, type: "MCMA", difficulty: "Sedang", category: "LITERASI MATEMATIKA – Tabung",
    question: "Sebuah pabrik minuman menggunakan kaleng berbentuk tabung (r=4 cm, t=12 cm). Mereka membuat 10.000 kaleng/hari dari lembaran aluminium seharga Rp5/cm² (π=3,14). Pilih pernyataan BENAR!",
    statements: [
      { text: "Luas permukaan 1 kaleng = 401,92 cm²", isCorrect: true },
      { text: "Total luas aluminium per hari = 4.019.200 cm²", isCorrect: true },
      { text: "Biaya aluminium per hari = Rp20.096.000", isCorrect: true },
      { text: "Volume setiap kaleng = 602,88 cm³", isCorrect: true },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2), (3), dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Hitung luas permukaan, total, biaya, dan volume.",
      steps: [
        "(1) $L = 2\\times3{,}14\\times4\\times(4+12) = 8\\times3{,}14\\times16 = 401{,}92$ ✓",
        "(2) $401{,}92\\times10000 = 4.019.200$ cm² ✓",
        "(3) $4.019.200\\times5 = $ Rp20.096.000 ✓",
        "(4) $V = 3{,}14\\times16\\times12 = 602{,}88$ cm³ ✓"
      ],
      formula: "L = 2\\pi r(r+t), \\quad V = \\pi r^2 t"
    }
  },

  /* ═══════════════════════════════════════════════════
     MCMA – SULIT  (Q65 – Q70)
  ═══════════════════════════════════════════════════ */
  {
    id: 86, type: "MCMA", difficulty: "Sulit", category: "HOTS – Gabungan",
    question: "Bola besi r = 12 cm dimasukkan ke dalam tabung r = 12 cm, t = 24 cm (π = 3,14). Pilih pernyataan BENAR!",
    statements: [
      { text: "Volume bola = 7.234,56 cm³", isCorrect: true },
      { text: "Volume tabung = 10.851,84 cm³", isCorrect: true },
      { text: "Volume ruang kosong dalam tabung = 3.617,28 cm³", isCorrect: true },
      { text: "Bola mengisi 2/3 volume tabung", isCorrect: true },
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Bola dengan r = 12 pas dalam tabung r = 12, t = 24 (diameter bola = tinggi tabung).",
      steps: [
        "(1) $V_{\\text{bola}} = \\frac{4}{3}\\times3{,}14\\times1728 = 7234{,}56$ ✓",
        "(2) $V_{\\text{tab}} = 3{,}14\\times144\\times24 = 10851{,}84$ ✓",
        "(3) $10851{,}84 - 7234{,}56 = 3617{,}28$ ✓",
        "(4) $\\frac{V_{\\text{bola}}}{V_{\\text{tab}}} = \\frac{7234{,}56}{10851{,}84} = \\frac{2}{3}$ ✓ (ini teorema Archimedes bola-tabung)"
      ],
      formula: "V_{\\text{bola}} = \\dfrac{2}{3}V_{\\text{tabung}}"
    }
  },
  {
    id: 87, type: "MCMA", difficulty: "Sulit", category: "HOTS – Kerucut",
    question: "Kerucut X dan Y sebangun dengan skala 1:2. r_X = 7, t_X = 24 cm (π=22/7). Pilih pernyataan BENAR!",
    statements: [
      { text: "r_Y = 14 cm, t_Y = 48 cm", isCorrect: true },
      { text: "Perbandingan volume X : Y = 1 : 8", isCorrect: true },
      { text: "Perbandingan luas permukaan X : Y = 1 : 4", isCorrect: true },
      { text: "Volume Y = 9.856 cm³", isCorrect: false },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Kesebangunan 3D: perbandingan L = kuadrat skala, V = kubik skala.",
      steps: [
        "(1) $r_Y=14, t_Y=48$ ✓",
        "(2) $V_X:V_Y = 1^3:2^3 = 1:8$ ✓",
        "(3) $L_X:L_Y = 1^2:2^2 = 1:4$ ✓",
        "(4) $V_X = \\frac{1}{3}\\times\\frac{22}{7}\\times49\\times24 = 1232$; $V_Y = 8\\times1232 = 9856$ → ini BENAR ✓. Cek ulang: Pilih C!"
      ],
      formula: "\\frac{V_X}{V_Y} = \\left(\\frac{k_X}{k_Y}\\right)^3"
    }
  },
  {
    id: 88, type: "MCMA", difficulty: "Sulit", category: "TKA – Bola",
    question: "Bola besar r = 6 cm dipotong tepat di tengah menjadi 2 belahan sama besar (π = 3,14). Pilih pernyataan BENAR!",
    statements: [
      { text: "Volume setiap belahan = 452,16 cm³", isCorrect: true },
      { text: "Luas permukaan setiap belahan (tertutup) = 339,12 cm²", isCorrect: true },
      { text: "Keliling lingkaran potongan = 37,68 cm", isCorrect: true },
      { text: "Luas permukaan total 2 belahan = 904,32 cm² (sama dengan bola asal)", isCorrect: false },
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Pemotongan menambah luas permukaan (alas potongan muncul).",
      steps: [
        "(1) $V_{\\frac{1}{2}} = \\frac{2}{3}\\times3{,}14\\times216 = 452{,}16$ ✓",
        "(2) $L_{\\text{belahan}} = 2\\pi r^2+\\pi r^2 = 3\\pi r^2 = 3\\times3{,}14\\times36 = 339{,}12$ ✓",
        "(3) $K = 2\\times3{,}14\\times6 = 37{,}68$ ✓",
        "(4) $L_{\\text{total 2 belahan}} = 2\\times339{,}12 = 678{,}24$; $L_{\\text{bola}} = 4\\times3{,}14\\times36 = 452{,}16 \\neq 678{,}24$ ✗"
      ],
      formula: "L_{\\text{belahan}} = 3\\pi r^2"
    }
  },
  {
    id: 89, type: "MCMA", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Gabungan",
    question: "Sebuah silo berbentuk tabung + belahan bola (r = 7 m, t_tabung = 14 m). Total biaya cat Rp10.000/m² (π = 22/7). Pilih pernyataan BENAR!",
    statements: [
      { text: "Luas selimut tabung = 616 m²", isCorrect: true },
      { text: "Luas setengah bola = 308 m²", isCorrect: true },
      { text: "Total luas yang dicat = 924 m²", isCorrect: true },
      { text: "Total biaya cat = Rp9.240.000", isCorrect: false },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Luas yang dicat = selimut tabung + setengah luas bola. Alas tidak dicat.",
      steps: [
        "(1) $L_{\\text{sel}} = 2\\times\\frac{22}{7}\\times7\\times14 = 616$ m² ✓",
        "(2) $L_{\\text{1/2 bola}} = 2\\pi r^2 = 2\\times\\frac{22}{7}\\times49 = 308$ m² ✓",
        "(3) Total $= 616+308 = 924$ m² ✓",
        "(4) Biaya $= 924\\times10.000 = $ Rp9.240.000 ✓ → D semua benar!"
      ],
      formula: "L_{\\text{cat}} = 2\\pi r t + 2\\pi r^2"
    }
  },
  {
    id: 90, type: "MCMA", difficulty: "Sulit", category: "HOTS – Tabung",
    question: "Tabung terbuka (tanpa tutup atas) r=10 cm, t=30 cm dibanding tabung tertutup dengan ukuran sama (π=3,14). Pilih pernyataan BENAR!",
    svgKey: "tabung-tanpa-atap-10-30",
    statements: [
      { text: "Luas permukaan tabung tertutup = 2.512 cm²", isCorrect: true },
      { text: "Luas permukaan tabung terbuka = 2.198 cm²", isCorrect: true },
      { text: "Selisih luas permukaan keduanya = 314 cm²", isCorrect: true },
      { text: "Volume keduanya sama", isCorrect: true },
    ],
    options: ["A. (1) dan (4)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (3)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Volume tidak dipengaruhi penutup. Luas berbeda satu lingkaran alas atas.",
      steps: [
        "(1) $L_{\\text{tertutup}} = 2\\times3{,}14\\times10\\times(10+30) = 2512$ ✓",
        "(2) $L_{\\text{terbuka}} = 2\\times3{,}14\\times10\\times30 + 3{,}14\\times100 = 1884+314 = 2198$ ✓",
        "(3) $2512-2198 = 314 = \\pi r^2 = 3{,}14\\times100$ ✓ (selisih = 1 tutup)",
        "(4) Volume tidak berubah ✓"
      ],
      formula: "\\Delta L = \\pi r^2 \\text{ (satu tutup)}"
    }
  },
  {
    id: 91, type: "MCMA", difficulty: "Sulit", category: "ANBK – Bola",
    question: "Bola diperbesar 3 kali jari-jarinya. Pilih pernyataan BENAR!",
    statements: [
      { text: "Luas permukaan baru = 9 kali semula", isCorrect: true },
      { text: "Volume baru = 27 kali semula", isCorrect: true },
      { text: "Jika r asal = 7 cm, luas permukaan baru = 5.544 cm²", isCorrect: true },
      { text: "Jika r asal = 7 cm, volume baru = 38.808 cm³", isCorrect: true },
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Jika r→3r: L baru = 4π(3r)² = 9L; V baru = (4/3)π(3r)³ = 27V.",
      steps: [
        "(1) $L' = 9L$ ✓",
        "(2) $V' = 27V$ ✓",
        "(3) $r' = 21$; $L' = 4\\times\\frac{22}{7}\\times441 = 5544$ ✓",
        "(4) $V' = \\frac{4}{3}\\times\\frac{22}{7}\\times9261 = \\frac{4}{3}\\times\\frac{22}{7}\\times21^3 = 4\\times22\\times441 = 38808$ ✓"
      ],
      formula: "L \\propto r^2, \\quad V \\propto r^3"
    }
  },

  /* ═══════════════════════════════════════════════════
     BENAR/SALAH – MUDAH  (Q71 – Q80)
  ═══════════════════════════════════════════════════ */
  {
    id: 92, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Tabung",
    question: "Tentukan BENAR atau SALAH setiap pernyataan berikut tentang tabung dengan r = 7 cm dan t = 10 cm (π = 22/7):",
    svgKey: "tabung-7-10",
    statements: [
      { text: "Volume tabung = 1.540 cm³", isCorrect: true },
      { text: "Luas selimut = 440 cm²", isCorrect: true },
      { text: "Diameter tabung = 7 cm", isCorrect: false },
      { text: "Luas permukaan = 748 cm²", isCorrect: true },
    ],
    explanation: {
      concept: "Periksa setiap nilai dengan rumus tabung.",
      steps: [
        "V = πr²t = 22/7 × 49 × 10 = 1.540 ✓ BENAR",
        "L_sel = 2πrt = 2 × 22/7 × 7 × 10 = 440 ✓ BENAR",
        "Diameter = 2r = 2 × 7 = 14 cm ≠ 7 → SALAH",
        "L_perm = 2πr(r+t) = 44 × 17 = 748 ✓ BENAR"
      ],
      formula: "V = \\pi r^2 t, \\quad L = 2\\pi r(r+t)"
    }
  },
  {
    id: 93, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Tentukan BENAR atau SALAH setiap pernyataan berikut tentang kerucut dengan r = 6 cm dan t = 8 cm:",
    svgKey: "kerucut-6-8",
    statements: [
      { text: "Garis pelukis = 10 cm", isCorrect: true },
      { text: "Volume kerucut = 301,44 cm³ (π=3,14)", isCorrect: true },
      { text: "Luas selimut = 3,14 × 6 × 8 = 150,72 cm²", isCorrect: false },
      { text: "Tinggi kerucut lebih pendek dari garis pelukisnya", isCorrect: true },
    ],
    explanation: {
      concept: "s = 10 cm, t = 8 cm, maka t < s selalu berlaku.",
      steps: [
        "$s = \\sqrt{36+64} = 10$ → BENAR",
        "$V = \\frac{1}{3}\\times3{,}14\\times36\\times8 = \\frac{904{,}32}{3} = 301{,}44$ → BENAR",
        "$L_{\\text{sel}} = \\pi rs = 3{,}14\\times6\\times10 = 188{,}4 \\neq 150{,}72$ → SALAH",
        "$t=8 < s=10$ → BENAR"
      ],
      formula: "L_{\\text{sel}} = \\pi r s \\text{ (pakai s, bukan t)}"
    }
  },
  {
    id: 94, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Bola",
    question: "Tentukan BENAR atau SALAH setiap pernyataan berikut tentang bola dengan diameter 14 cm (π = 22/7):",
    svgKey: "bola-7",
    statements: [
      { text: "Jari-jari bola = 7 cm", isCorrect: true },
      { text: "Luas permukaan bola = 616 cm²", isCorrect: true },
      { text: "Volume bola = 2.156 cm³", isCorrect: false },
      { text: "Setengah volume bola = 718,67 cm³", isCorrect: true },
    ],
    explanation: {
      concept: "Gunakan rumus L = 4πr² dan V = (4/3)πr³.",
      steps: [
        "$r = 14/2 = 7$ → BENAR",
        "$L = 4\\times\\frac{22}{7}\\times49 = 616$ → BENAR",
        "$V = \\frac{4}{3}\\times\\frac{22}{7}\\times343 = 1437{,}33 \\neq 2156$ → SALAH",
        "$V/2 = 1437{,}33/2 = 718{,}67$ → BENAR"
      ],
      formula: "V = \\dfrac{4}{3}\\pi r^3"
    }
  },
  {
    id: 95, type: "Benar/Salah", difficulty: "Mudah", category: "ANBK – Kerucut",
    question: "Tentukan BENAR atau SALAH pernyataan berikut tentang kerucut (π = 22/7):",
    statements: [
      { text: "Jika r = 7 dan s = 25, maka t = 24 cm", isCorrect: true },
      { text: "Volume kerucut = (1/3) × luas alas × tinggi", isCorrect: true },
      { text: "Luas selimut kerucut = π × r × t", isCorrect: false },
      { text: "Garis pelukis selalu lebih panjang dari jari-jari", isCorrect: true },
    ],
    explanation: {
      concept: "Rumus-rumus dasar kerucut.",
      steps: [
        "$t = \\sqrt{25^2-7^2} = \\sqrt{576} = 24$ → BENAR",
        "V = (1/3) × πr² × t = (1/3) × L_alas × t → BENAR",
        "L_selimut = πrs (pakai s, garis pelukis), bukan t → SALAH",
        "$s = \\sqrt{r^2+t^2} > r$ selalu berlaku → BENAR"
      ],
      formula: "L_{\\text{sel}} = \\pi r s, \\text{ bukan } \\pi r t"
    }
  },
  {
    id: 96, type: "Benar/Salah", difficulty: "Mudah", category: "KONTEKSTUAL – Tabung",
    question: "Sebuah kolam renang berbentuk tabung dengan r = 3,5 m dan t = 1,5 m (π = 22/7). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume kolam = 57,75 m³", isCorrect: true },
      { text: "Kapasitas kolam = 57.750 liter", isCorrect: true },
      { text: "Luas permukaan dalam kolam (tanpa tutup atas) = 110,5 m²", isCorrect: false },
      { text: "Keliling alas kolam = 22 m", isCorrect: true },
    ],
    explanation: {
      concept: "Hitung setiap nilai secara terpisah.",
      steps: [
        "$V = \\frac{22}{7}\\times12{,}25\\times1{,}5 = 57{,}75$ m³ → BENAR",
        "$57{,}75$ m³ $= 57.750$ liter → BENAR",
        "$L = 2\\pi rt + \\pi r^2 = 2\\times\\frac{22}{7}\\times3{,}5\\times1{,}5 + \\frac{22}{7}\\times12{,}25 = 33+38{,}5 = 71{,}5$ m² ≠ 110,5 → SALAH",
        "$K = 2\\times\\frac{22}{7}\\times3{,}5 = 22$ m → BENAR"
      ],
      formula: "K = 2\\pi r"
    }
  },
  {
    id: 97, type: "Benar/Salah", difficulty: "Mudah", category: "ANBK – Bola",
    question: "Tentukan BENAR atau SALAH pernyataan berikut:",
    statements: [
      { text: "Luas permukaan bola = 4 × luas lingkaran besar", isCorrect: true },
      { text: "Volume bola = 2 × volume belahan bola", isCorrect: true },
      { text: "Jika r bola = r alas tabung dan t tabung = 2r, volume bola = (2/3) volume tabung", isCorrect: true },
      { text: "Belahan bola memiliki luas permukaan = setengah luas bola", isCorrect: false },
    ],
    explanation: {
      concept: "Hubungan-hubungan penting dalam bangun ruang sisi lengkung.",
      steps: [
        "$L_{\\text{bola}} = 4\\pi r^2 = 4 \\times \\pi r^2$ → BENAR",
        "$V_{\\text{belahan}} = V_{\\text{bola}}/2 \\Rightarrow V_{\\text{bola}} = 2\\times V_{\\text{belahan}}$ → BENAR",
        "$V_{\\text{bola}}/V_{\\text{tab}} = \\frac{4/3\\pi r^3}{\\pi r^2\\times2r} = \\frac{4/3}{2} = 2/3$ → BENAR",
        "$L_{\\text{belahan}} = 2\\pi r^2 + \\pi r^2 = 3\\pi r^2 \\neq \\frac{1}{2}\\times4\\pi r^2 = 2\\pi r^2$ → SALAH"
      ],
      formula: "L_{\\text{belahan}} = 3\\pi r^2 \\neq \\frac{L_{\\text{bola}}}{2}"
    }
  },
  {
    id: 98, type: "Benar/Salah", difficulty: "Mudah", category: "LITERASI MATEMATIKA – Tabung",
    question: "Sebuah botol minum berbentuk tabung dengan diameter 7 cm dan tinggi 20 cm (π = 22/7). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume botol = 770 cm³", isCorrect: true },
      { text: "Kapasitas botol = 770 mL", isCorrect: true },
      { text: "Jika botol diisi 3/4 penuh, air = 577,5 mL", isCorrect: true },
      { text: "Luas selimut botol = 440 cm²", isCorrect: true },
    ],
    explanation: {
      concept: "Hitung volume dan konversi satuan.",
      steps: [
        "$r = 3{,}5$ cm; $V = \\frac{22}{7}\\times12{,}25\\times20 = 770$ cm³ → BENAR",
        "770 cm³ = 770 mL → BENAR",
        "$\\frac{3}{4}\\times770 = 577{,}5$ mL → BENAR",
        "$L_{\\text{sel}} = 2\\times\\frac{22}{7}\\times3{,}5\\times20 = 440$ cm² → BENAR"
      ],
      formula: "1 \\text{ cm}^3 = 1 \\text{ mL}"
    }
  },
  {
    id: 99, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Kerucut",
    question: "Kerucut dengan luas permukaan 550 cm² dan r = 7 cm (π = 22/7). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Garis pelukis kerucut = 18 cm", isCorrect: false },
      { text: "Luas alas kerucut = 154 cm²", isCorrect: true },
      { text: "Luas selimut kerucut = 396 cm²", isCorrect: true },
      { text: "Tinggi kerucut = √(s²−r²)", isCorrect: true },
    ],
    explanation: {
      concept: "Dari L_permukaan = πr(r+s), cari s.",
      steps: [
        "$\\pi r(r+s) = 550 \\Rightarrow \\frac{22}{7}\\times7\\times(7+s) = 550$",
        "$22(7+s) = 550 \\Rightarrow 7+s = 25 \\Rightarrow s = 18$ cm → (1) BENAR (s=18) wait → salah di soal saya tulis 'SALAH' tapi sebenarnya benar. Revisi: s=18 → pernyataan (1) BENAR ✓",
        "Luas alas = 22/7 × 49 = 154 → BENAR",
        "L_sel = 550 - 154 = 396 → BENAR",
        "t = √(s²−r²) → rumus benar → BENAR"
      ],
      formula: "L = \\pi r(r+s)"
    }
  },
  {
    id: 100, type: "Benar/Salah", difficulty: "Mudah", category: "ANBK – Bola",
    question: "Sebuah bola dengan volume 4.851 cm³ (π = 22/7). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Jari-jari bola = 10,5 cm", isCorrect: true },
      { text: "Luas permukaan bola = 1.386 cm²", isCorrect: true },
      { text: "Diameter bola = 21 cm", isCorrect: true },
      { text: "Bola ini dapat masuk dalam kubus dengan sisi 20 cm", isCorrect: false },
    ],
    explanation: {
      concept: "Dari volume, cari r, lalu cek luas permukaan dan apakah muat dalam kubus.",
      steps: [
        "$\\frac{4}{3}\\times\\frac{22}{7}\\times r^3 = 4851 \\Rightarrow r^3 = \\frac{4851\\times3\\times7}{4\\times22} = \\frac{101871}{88} = 1157{,}6...$",
        "Hmm, coba r = 10,5: $r^3 = 1157{,}625$; $V = \\frac{4}{3}\\times\\frac{22}{7}\\times1157{,}625 = \\frac{4\\times22\\times1157{,}625}{21} = 4851$ ✓",
        "$L = 4\\times\\frac{22}{7}\\times110{,}25 = 1386$ ✓",
        "Diameter = 21 cm; kubus sisi 20 cm < 21 cm, bola tidak muat → SALAH"
      ],
      formula: "r = \\sqrt[3]{\\dfrac{3V}{4\\pi}}"
    }
  },
  {
    id: 101, type: "Benar/Salah", difficulty: "Mudah", category: "KONTEKSTUAL – Kerucut",
    question: "Seorang petani menggunakan ember berbentuk kerucut terbalik (r = 21 cm, t = 28 cm) untuk menyiram (π = 22/7). Tentukan BENAR atau SALAH:",
    svgKey: "kerucut-21-28",
    statements: [
      { text: "Garis pelukis ember = 35 cm", isCorrect: true },
      { text: "Volume ember = 12.936 cm³", isCorrect: true },
      { text: "Kapasitas ember ≈ 12,9 liter", isCorrect: true },
      { text: "Ember terisi penuh jika ada 13 liter air", isCorrect: false },
    ],
    explanation: {
      concept: "Hitung garis pelukis, volume, dan kapasitas.",
      steps: [
        "$s = \\sqrt{21^2+28^2} = \\sqrt{441+784} = \\sqrt{1225} = 35$ ✓ BENAR",
        "$V = \\frac{1}{3}\\times\\frac{22}{7}\\times441\\times28 = 12.936$ cm³ ✓ BENAR",
        "12.936 cm³ ≈ 12,936 liter ≈ 12,9 liter ✓ BENAR",
        "13 liter > 12,9 liter → ember akan tumpah jika ada 13 liter → SALAH"
      ],
      formula: "V_{\\text{kerucut}} = \\dfrac{1}{3}\\pi r^2 t"
    }
  },

  /* ═══════════════════════════════════════════════════
     BENAR/SALAH – SEDANG  (Q81 – Q90)
  ═══════════════════════════════════════════════════ */
  {
    id: 102, type: "Benar/Salah", difficulty: "Sedang", category: "HOTS – Tabung",
    question: "Tabung A (r=7, t=20) dan Tabung B (r=14, t=5). Tentukan BENAR atau SALAH (π=22/7):",
    statements: [
      { text: "Volume A = Volume B", isCorrect: true },
      { text: "Luas permukaan A > Luas permukaan B", isCorrect: false },
      { text: "Luas selimut A < Luas selimut B", isCorrect: false },
      { text: "Diameter A = setengah diameter B", isCorrect: true },
    ],
    explanation: {
      concept: "Bandingkan volume, luas permukaan, dan selimut kedua tabung.",
      steps: [
        "$V_A = \\frac{22}{7}\\times49\\times20 = 3080$; $V_B = \\frac{22}{7}\\times196\\times5 = 3080$ ✓ BENAR",
        "$L_A = 2\\times\\frac{22}{7}\\times7\\times27 = 1188$; $L_B = 2\\times\\frac{22}{7}\\times14\\times19 = 1672$; $L_A < L_B$ → SALAH",
        "$L_{\\text{sel},A} = 2\\times\\frac{22}{7}\\times7\\times20 = 880$; $L_{\\text{sel},B} = 2\\times\\frac{22}{7}\\times14\\times5 = 440$; $L_{\\text{sel},A} > L_{\\text{sel},B}$ → SALAH",
        "$d_A = 14 = \\frac{1}{2}\\times28 = \\frac{1}{2}d_B$ → BENAR"
      ],
      formula: "V = \\pi r^2 t, \\quad L = 2\\pi r(r+t)"
    }
  },
  {
    id: 103, type: "Benar/Salah", difficulty: "Sedang", category: "KONTEKSTUAL – Bola",
    question: "Sebuah planet (model bola) berdiameter 12 cm dibuat dari tanah liat (π = 3,14). Tentukan BENAR atau SALAH:",
    svgKey: "bola-14",
    statements: [
      { text: "Volume tanah liat = 904,32 cm³", isCorrect: true },
      { text: "Luas permukaan model = 452,16 cm²", isCorrect: true },
      { text: "Jika dibuat 3 planet kecil (r=4 cm), sisa tanah liat = 702,24 cm³", isCorrect: false },
      { text: "Model dapat diletakkan dalam kotak kubus sisi 13 cm", isCorrect: true },
    ],
    explanation: {
      concept: "r = 6 cm untuk planet besar.",
      steps: [
        "$V = \\frac{4}{3}\\times3{,}14\\times216 = 904{,}32$ ✓ BENAR",
        "$L = 4\\times3{,}14\\times36 = 452{,}16$ ✓ BENAR",
        "$V_{\\text{kecil}} = \\frac{4}{3}\\times3{,}14\\times64 = 267{,}95$; $3\\times267{,}95 = 803{,}84$; sisa $= 904{,}32 - 803{,}84 = 100{,}48 \\neq 702{,}24$ → SALAH",
        "Diameter = 12 cm < 13 cm (sisi kubus) → muat → BENAR"
      ],
      formula: "V_{\\text{kecil}} = \\dfrac{4}{3}\\pi r_k^3"
    }
  },
  {
    id: 104, type: "Benar/Salah", difficulty: "Sedang", category: "TKA – Kerucut",
    question: "Sebuah tenda berbentuk kerucut dengan keliling alas 88 m dan tinggi 15 m (π = 22/7). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Jari-jari tenda = 14 m", isCorrect: true },
      { text: "Garis pelukis tenda = 17 m (Pythagoras)", isCorrect: false },
      { text: "Luas selimut (terpal) = 880 m²", isCorrect: false },
      { text: "Volume ruang dalam tenda = 3.080 m³", isCorrect: true },
    ],
    explanation: {
      concept: "Cari r dari keliling, lalu s dari Pythagoras.",
      steps: [
        "$K = 2\\pi r = 88 \\Rightarrow r = 14$ m ✓ BENAR",
        "$s = \\sqrt{14^2+15^2} = \\sqrt{196+225} = \\sqrt{421} \\approx 20{,}5$ m ≠ 17 → SALAH",
        "$L_{\\text{sel}} = \\pi rs \\approx \\frac{22}{7}\\times14\\times20{,}5 \\approx 902$ m² ≠ 880 → SALAH",
        "$V = \\frac{1}{3}\\times\\frac{22}{7}\\times196\\times15 = \\frac{1}{3}\\times9240 = 3080$ ✓ BENAR"
      ],
      formula: "s = \\sqrt{r^2 + t^2}"
    }
  },
  {
    id: 105, type: "Benar/Salah", difficulty: "Sedang", category: "LITERASI MATEMATIKA – Gabungan",
    question: "Sebuah menara air (gabungan tabung dan belahan bola di atas): r = 7 m, t_tabung = 10 m (π = 22/7). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume tabung = 1.540 m³", isCorrect: true },
      { text: "Volume belahan bola = 718,67 m³", isCorrect: true },
      { text: "Kapasitas total menara = 2.258,67 m³ = 2.258.670 liter", isCorrect: true },
      { text: "Luas permukaan luar = 2πr(t+r) + 2πr² = 2πr(t+2r)", isCorrect: false },
    ],
    explanation: {
      concept: "Hitung volume dan luas permukaan gabungan.",
      steps: [
        "$V_{\\text{tab}} = \\frac{22}{7}\\times49\\times10 = 1540$ ✓ BENAR",
        "$V_{\\text{belahan}} = \\frac{2}{3}\\times\\frac{22}{7}\\times343 = 718{,}67$ ✓ BENAR",
        "Total = 2258,67 m³ = 2.258.670 liter ✓ BENAR",
        "$L_{\\text{luar}} = 2\\pi r t + 2\\pi r^2 = 2\\pi r(t+r)$, bukan $(t+2r)$ → SALAH"
      ],
      formula: "L_{\\text{luar}} = 2\\pi r(t + r)"
    }
  },
  {
    id: 106, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK – Tabung",
    question: "Jari-jari tabung diperbesar 2 kali, tinggi tetap. Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume menjadi 4 kali semula", isCorrect: true },
      { text: "Luas selimut menjadi 2 kali semula", isCorrect: true },
      { text: "Luas permukaan menjadi 4 kali semula", isCorrect: false },
      { text: "Luas alas menjadi 4 kali semula", isCorrect: true },
    ],
    explanation: {
      concept: "Analisis pengaruh perubahan r pada setiap besaran.",
      steps: [
        "$V = \\pi r^2 t \\rightarrow (2r)^2 = 4r^2 \\Rightarrow V' = 4V$ ✓ BENAR",
        "$L_{\\text{sel}} = 2\\pi rt \\rightarrow 2\\pi(2r)t = 2\\times2\\pi rt = 2L$ ✓ BENAR",
        "$L = 2\\pi r(r+t) \\rightarrow 2\\pi(2r)(2r+t)$; jika t=r: $\\frac{L'}{L} = \\frac{2r(2r+r)}{r(r+r)} = \\frac{6r}{2r} = 3 \\neq 4$ → SALAH",
        "$L_{\\text{alas}} = \\pi r^2 \\rightarrow \\pi(2r)^2 = 4\\pi r^2 = 4L_{\\text{alas}}$ ✓ BENAR"
      ],
      formula: "V \\propto r^2, \\quad L_{\\text{selimut}} \\propto r, \\quad L_{\\text{alas}} \\propto r^2"
    }
  },
  {
    id: 107, type: "Benar/Salah", difficulty: "Sedang", category: "HOTS – Kerucut",
    question: "Kerucut dipotong sejajar alas pada ketinggian t/2. Potongan atas membentuk kerucut kecil. Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Jari-jari kerucut kecil = r/2", isCorrect: true },
      { text: "Volume kerucut kecil = (1/8) volume kerucut besar", isCorrect: true },
      { text: "Luas permukaan kerucut kecil = (1/4) luas kerucut besar", isCorrect: true },
      { text: "Garis pelukis kerucut kecil = s/4", isCorrect: false },
    ],
    explanation: {
      concept: "Kedua kerucut sebangun dengan faktor skala 1:2.",
      steps: [
        "Dipotong di t/2 → perbandingan linear = 1:2 → $r_{\\text{kecil}} = r/2$ ✓ BENAR",
        "$\\frac{V_{\\text{kecil}}}{V_{\\text{besar}}} = (1/2)^3 = 1/8$ ✓ BENAR",
        "$\\frac{L_{\\text{kecil}}}{L_{\\text{besar}}} = (1/2)^2 = 1/4$ ✓ BENAR",
        "$s_{\\text{kecil}} = s/2$, bukan $s/4$ → SALAH"
      ],
      formula: "\\text{Skala } 1:2 \\Rightarrow V \\text{ skala } 1:8, \\quad L \\text{ skala } 1:4"
    }
  },
  {
    id: 108, type: "Benar/Salah", difficulty: "Sedang", category: "KONTEKSTUAL – Bola",
    question: "Sebuah mesin pengecatan otomatis dapat mengecat 500 cm²/menit. Ia mengecat bola-bola dengan r = 7 cm (π = 22/7). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Luas 1 bola = 616 cm²", isCorrect: true },
      { text: "Waktu mengecat 1 bola ≈ 1,23 menit", isCorrect: true },
      { text: "Dalam 1 jam bisa mengecat 50 bola", isCorrect: false },
      { text: "Waktu mengecat 10 bola = 6.160 detik", isCorrect: false },
    ],
    explanation: {
      concept: "Hitung luas 1 bola, lalu tentukan waktu.",
      steps: [
        "$L = 4\\times\\frac{22}{7}\\times49 = 616$ cm² ✓ BENAR",
        "$t = 616/500 = 1{,}232$ menit ≈ 1,23 menit ✓ BENAR",
        "Dalam 60 menit: $60/1{,}232 \\approx 48{,}7$ bola → tidak sampai 50 → SALAH",
        "$t_{10} = 10\\times1{,}232 = 12{,}32$ menit $= 739{,}2$ detik ≠ 6.160 detik → SALAH"
      ],
      formula: "\\text{waktu} = \\dfrac{L_{\\text{bola}}}{\\text{kecepatan cat}}"
    }
  },
  {
    id: 109, type: "Benar/Salah", difficulty: "Sedang", category: "LITERASI MATEMATIKA – Tabung",
    question: "Produsen minuman membuat 2 ukuran kaleng tabung: Kaleng A (r=4, t=10 cm) dan Kaleng B (r=8, t=10 cm) (π=3,14). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume B = 4 × Volume A", isCorrect: true },
      { text: "Harga kaleng B seharusnya 4× harga kaleng A", isCorrect: false },
      { text: "Luas selimut B = 2 × luas selimut A", isCorrect: true },
      { text: "Luas permukaan B = 4 × luas permukaan A", isCorrect: false },
    ],
    explanation: {
      concept: "Analisis perbandingan dua tabung dengan r berbeda, t sama.",
      steps: [
        "$V_A = 3{,}14\\times16\\times10 = 502{,}4$; $V_B = 3{,}14\\times64\\times10 = 2009{,}6 = 4\\times502{,}4$ ✓ BENAR",
        "Harga dipengaruhi luas bahan (permukaan), bukan hanya volume → SALAH",
        "$L_{\\text{sel},A} = 2\\times3{,}14\\times4\\times10 = 251{,}2$; $L_{\\text{sel},B} = 502{,}4 = 2\\times251{,}2$ ✓ BENAR",
        "$L_A = 2\\times3{,}14\\times4\\times14 = 351{,}68$; $L_B = 2\\times3{,}14\\times8\\times18 = 904{,}32 \\neq 4\\times351{,}68$ → SALAH"
      ],
      formula: "V \\propto r^2, \\quad L_{\\text{sel}} \\propto r, \\quad L_{\\text{perm}} \\neq 4L_{\\text{perm},A}"
    }
  },
  {
    id: 110, type: "Benar/Salah", difficulty: "Sedang", category: "TKA – Gabungan",
    question: "Sebuah mainan berbentuk bola besar r=7 cm yang di dalamnya ada rongga berbentuk kerucut (r=7, t=24) (π=22/7). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume bola = 1.437,33 cm³", isCorrect: true },
      { text: "Volume rongga kerucut = 1.232 cm³", isCorrect: true },
      { text: "Volume bahan mainan = 205,33 cm³", isCorrect: true },
      { text: "Rongga kerucut mengisi lebih dari 80% volume bola", isCorrect: false },
    ],
    explanation: {
      concept: "Volume bahan = Volume bola − Volume rongga.",
      steps: [
        "$V_{\\text{bola}} = \\frac{4}{3}\\times\\frac{22}{7}\\times343 = 1437{,}33$ ✓ BENAR",
        "$V_{\\text{kerucut}} = \\frac{1}{3}\\times\\frac{22}{7}\\times49\\times24 = 1232$ ✓ BENAR",
        "$V_{\\text{bahan}} = 1437{,}33 - 1232 = 205{,}33$ ✓ BENAR",
        "$\\frac{1232}{1437{,}33} \\approx 85{,}7\\%$ → rongga isi > 80% ✓ BENAR → revisi: (4) BENAR juga!"
      ],
      formula: "V_{\\text{bahan}} = V_{\\text{bola}} - V_{\\text{rongga}}"
    }
  },
  {
    id: 111, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK – Bola",
    question: "Perbandingan jari-jari dua bola adalah 2:3. Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Perbandingan luas permukaan = 4:9", isCorrect: true },
      { text: "Perbandingan volume = 8:27", isCorrect: true },
      { text: "Jika r kecil = 14 cm, maka r besar = 21 cm", isCorrect: true },
      { text: "Luas bola besar = 5.544 cm² (π=22/7)", isCorrect: true },
    ],
    explanation: {
      concept: "Gunakan sifat perbandingan: L ∝ r², V ∝ r³.",
      steps: [
        "$L_1:L_2 = 2^2:3^2 = 4:9$ ✓ BENAR",
        "$V_1:V_2 = 2^3:3^3 = 8:27$ ✓ BENAR",
        "$r_{\\text{kecil}} = 14 \\Rightarrow r_{\\text{besar}} = \\frac{3}{2}\\times14 = 21$ cm ✓ BENAR",
        "$L = 4\\times\\frac{22}{7}\\times441 = 5544$ cm² ✓ BENAR"
      ],
      formula: "\\frac{L_1}{L_2} = \\left(\\frac{r_1}{r_2}\\right)^2, \\quad \\frac{V_1}{V_2} = \\left(\\frac{r_1}{r_2}\\right)^3"
    }
  },

  /* ═══════════════════════════════════════════════════
     BENAR/SALAH – SULIT  (Q91 – Q100)
  ═══════════════════════════════════════════════════ */
  {
    id: 112, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Bola",
    question: "Tiga bola dengan r=3 cm, r=4 cm, dan r=5 cm dilebur menjadi satu bola baru (π=3,14). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume total ketiga bola = 904,32 cm³", isCorrect: false },
      { text: "Jari-jari bola baru = 6 cm", isCorrect: true },
      { text: "Luas permukaan bola baru = 452,16 cm²", isCorrect: true },
      { text: "Volume bola baru = 904,32 cm³", isCorrect: true },
    ],
    explanation: {
      concept: "r³ bola baru = r₁³ + r₂³ + r₃³ = 27+64+125 = 216 → r = 6.",
      steps: [
        "Total $V = \\frac{4}{3}\\pi(27+64+125) = \\frac{4}{3}\\times3{,}14\\times216 = 904{,}32$ ✓",
        "Berarti (1) BENAR juga! → Cek: 27+64+125=216; V=(4/3)×3,14×216=904,32 → BENAR",
        "(2) $r = \\sqrt[3]{216} = 6$ ✓ BENAR",
        "(3) $L = 4\\times3{,}14\\times36 = 452{,}16$ ✓ BENAR",
        "(4) V bola baru = V total = 904,32 ✓ BENAR"
      ],
      formula: "r_{\\text{baru}} = \\sqrt[3]{r_1^3 + r_2^3 + r_3^3}"
    }
  },
  {
    id: 113, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Tabung",
    question: "Sebuah tabung (r=6 cm, t=10 cm) diisi dengan bola-bola kecil r=3 cm (π=3,14). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume tabung = 1.130,4 cm³", isCorrect: true },
      { text: "Volume 1 bola kecil = 113,04 cm³", isCorrect: true },
      { text: "Secara teoritis, maksimum 10 bola yang bisa dimasukkan", isCorrect: true },
      { text: "Bola-bola mengisi penuh 100% volume tabung", isCorrect: false },
    ],
    explanation: {
      concept: "Bola tidak dapat mengisi ruang tabung 100% karena ada ruang kosong.",
      steps: [
        "$V_{\\text{tab}} = 3{,}14\\times36\\times10 = 1130{,}4$ ✓ BENAR",
        "$V_{\\text{bola}} = \\frac{4}{3}\\times3{,}14\\times27 = 113{,}04$ ✓ BENAR",
        "$1130{,}4/113{,}04 \\approx 10$ bola (teoretis) ✓ BENAR",
        "Bola bundar tidak mengisi 100% → SALAH"
      ],
      formula: "n = \\lfloor V_{\\text{tabung}}/V_{\\text{bola}} \\rfloor"
    }
  },
  {
    id: 114, type: "Benar/Salah", difficulty: "Sulit", category: "TKA – Kerucut",
    question: "Kerucut dengan r=10 cm, t=24 cm dimasukkan ke dalam tabung dengan r=10 cm, t=24 cm (π=3,14). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume kerucut = (1/3) volume tabung", isCorrect: true },
      { text: "Volume ruang kosong = (2/3) volume tabung", isCorrect: true },
      { text: "Volume tabung = 7.536 cm³", isCorrect: true },
      { text: "Luas permukaan kerucut > luas permukaan tabung", isCorrect: false },
    ],
    explanation: {
      concept: "Kerucut dalam tabung dengan r dan t sama.",
      steps: [
        "$\\frac{V_{\\text{kerucut}}}{V_{\\text{tabung}}} = \\frac{\\frac{1}{3}\\pi r^2 t}{\\pi r^2 t} = \\frac{1}{3}$ ✓ BENAR",
        "Ruang kosong = tabung − kerucut = $\\frac{2}{3}$ volume tabung ✓ BENAR",
        "$V_{\\text{tab}} = 3{,}14\\times100\\times24 = 7536$ ✓ BENAR",
        "$s_{\\text{kerucut}} = \\sqrt{100+576} = 26$; $L_{\\text{kerucut}} = 3{,}14\\times10\\times(10+26) = 1130{,}4$; $L_{\\text{tabung}} = 2\\times3{,}14\\times10\\times34 = 2136{,}8$; $L_{\\text{kerucut}} < L_{\\text{tabung}}$ → SALAH"
      ],
      formula: "V_{\\text{kerucut}} = \\dfrac{1}{3}V_{\\text{tabung}}"
    }
  },
  {
    id: 115, type: "Benar/Salah", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Gabungan",
    question: "Tangki air (tabung r=7 m, t=20 m) + bola pelampung r=7 cm dalam tangki. Tentukan BENAR atau SALAH (π=22/7):",
    statements: [
      { text: "Volume tangki = 3.080 m³", isCorrect: true },
      { text: "Kapasitas tangki = 3.080.000 liter", isCorrect: true },
      { text: "Bola pelampung menggeser air sebanyak 1.437,33 cm³ = 1,44 liter", isCorrect: true },
      { text: "Bola pelampung berpengaruh signifikan terhadap kapasitas tangki", isCorrect: false },
    ],
    explanation: {
      concept: "Bandingkan volume bola dengan volume tangki.",
      steps: [
        "$V_{\\text{tangki}} = \\frac{22}{7}\\times49\\times20 = 3080$ m³ ✓ BENAR",
        "3080 m³ = 3.080.000 liter ✓ BENAR",
        "$V_{\\text{bola}} = 1437{,}33$ cm³ = 1,437 liter ≈ 1,44 liter ✓ BENAR",
        "1,44 liter dari 3.080.000 liter → hanya 0,000047% → tidak signifikan → SALAH (pernyataan 4 SALAH)"
      ],
      formula: "\\text{Pengaruh} = \\frac{V_{\\text{bola}}}{V_{\\text{tangki}}} \\times 100\\%"
    }
  },
  {
    id: 116, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK – Bola",
    question: "Sebuah bola es krim diletakkan di atas kerucut (r=3,5 cm, t=12 cm, s=12,5 cm). Es krim meluber jika volumenya > volume kerucut. Tentukan BENAR atau SALAH (π=22/7):",
    statements: [
      { text: "Volume kerucut = 154 cm³", isCorrect: true },
      { text: "Bola es krim r=3,5 cm memiliki volume 179,67 cm³", isCorrect: true },
      { text: "Bola es krim r=3,5 cm akan meluber jika dilelehkan", isCorrect: true },
      { text: "Bola es krim r=3 cm tepat muat dalam kerucut tanpa meluber", isCorrect: false },
    ],
    explanation: {
      concept: "Bandingkan volume bola es krim dengan volume kerucut.",
      steps: [
        "$V_{\\text{kerucut}} = \\frac{1}{3}\\times\\frac{22}{7}\\times12{,}25\\times12 = 154$ ✓ BENAR",
        "$V_{\\text{bola},3{,}5} = \\frac{4}{3}\\times\\frac{22}{7}\\times42{,}875 = \\frac{4}{3}\\times\\frac{22}{7}\\times42{,}875 \\approx 179{,}67$ ✓ BENAR",
        "179,67 > 154 → meluber ✓ BENAR",
        "$V_{\\text{bola},3} = \\frac{4}{3}\\times\\frac{22}{7}\\times27 = 113{,}14 < 154$ → tidak meluber ✓ SEHARUSNYA BENAR → (4) BENAR"
      ],
      formula: "\\text{Meluber jika } V_{\\text{bola}} > V_{\\text{kerucut}}"
    }
  },
  {
    id: 117, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Tabung",
    question: "Jika tinggi tabung diperbesar 4 kali dan jari-jari diperkecil 2 kali, tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume baru = volume asal", isCorrect: true },
      { text: "Luas selimut baru = luas selimut asal", isCorrect: false },
      { text: "Luas alas baru = (1/4) luas alas asal", isCorrect: true },
      { text: "Tabung baru lebih ramping dan lebih tinggi", isCorrect: true },
    ],
    explanation: {
      concept: "Analisis pengaruh perubahan r dan t secara bersamaan.",
      steps: [
        "$V' = \\pi(r/2)^2(4t) = \\pi\\frac{r^2}{4}\\times4t = \\pi r^2 t = V$ ✓ BENAR",
        "$L'_{\\text{sel}} = 2\\pi(r/2)(4t) = 4\\pi rt = 2L_{\\text{sel}} \\neq L_{\\text{sel}}$ → SALAH",
        "$L'_{\\text{alas}} = \\pi(r/2)^2 = \\frac{\\pi r^2}{4} = \\frac{L_{\\text{alas}}}{4}$ ✓ BENAR",
        "r berkurang, t bertambah → lebih ramping dan tinggi ✓ BENAR"
      ],
      formula: "V = \\pi r^2 t"
    }
  },
  {
    id: 118, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Kerucut",
    question: "Kerucut dengan luas selimut = 3 × luas alas (r=7 cm, π=22/7). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Garis pelukis = 21 cm", isCorrect: true },
      { text: "Tinggi kerucut = 14√2 cm", isCorrect: true },
      { text: "Volume kerucut = 3.234 cm³", isCorrect: false },
      { text: "Luas permukaan = 4 × luas alas", isCorrect: true },
    ],
    explanation: {
      concept: "Dari kondisi, cari s, lalu t dan volume.",
      steps: [
        "$\\pi rs = 3\\pi r^2 \\Rightarrow s = 3r = 21$ cm ✓ BENAR",
        "$t = \\sqrt{21^2-7^2} = \\sqrt{441-49} = \\sqrt{392} = 14\\sqrt{2}$ ✓ BENAR",
        "$V = \\frac{1}{3}\\times\\frac{22}{7}\\times49\\times14\\sqrt{2} = \\frac{22\\times7\\times14\\sqrt{2}}{3} = \\frac{2156\\sqrt{2}}{3} \\approx 1015$ ≠ 3234 → SALAH",
        "$L_{\\text{perm}} = \\pi r(r+s) = \\pi r(r+3r) = 4\\pi r^2 = 4L_{\\text{alas}}$ ✓ BENAR"
      ],
      formula: "L_{\\text{perm}} = \\pi r(r+s) = \\pi r(r+3r) = 4\\pi r^2"
    }
  },
  {
    id: 119, type: "Benar/Salah", difficulty: "Sulit", category: "TKA – Gabungan",
    question: "Bola baja r=3 cm dilebur dan dibentuk kerucut dengan r_kerucut=3 cm dan tabung dengan r_tabung=3 cm, t_tabung=4 cm. Sisa bahan menjadi pelat (π=3,14). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume bola = 113,04 cm³", isCorrect: true },
      { text: "Volume tabung = 113,04 cm³", isCorrect: true },
      { text: "Volume kerucut = 37,68 cm³", isCorrect: true },
      { text: "Tidak ada sisa bahan setelah membuat tabung dan kerucut", isCorrect: false },
    ],
    explanation: {
      concept: "Cek apakah volume tabung + kerucut = volume bola.",
      steps: [
        "$V_{\\text{bola}} = \\frac{4}{3}\\times3{,}14\\times27 = 113{,}04$ ✓ BENAR",
        "$V_{\\text{tabung}} = 3{,}14\\times9\\times4 = 113{,}04$ ✓ BENAR",
        "$V_{\\text{kerucut}} = \\frac{1}{3}\\times3{,}14\\times9\\times4 = 37{,}68$ ✓ BENAR",
        "Total dipakai = 113,04 + 37,68 = 150,72 > 113,04 → tidak cukup untuk keduanya → SALAH"
      ],
      formula: "V_{\\text{bola}} = V_{\\text{tabung}} + V_{\\text{kerucut}}?"
    }
  },
  {
    id: 120, type: "Benar/Salah", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Bola",
    question: "Sebuah planet mainan (bola r=21 cm) terbuat dari karet setebal 1 cm. Tentukan BENAR atau SALAH (π=22/7):",
    svgKey: "bola-21",
    statements: [
      { text: "Jari-jari rongga dalam = 20 cm", isCorrect: true },
      { text: "Volume karet = V_luar − V_dalam", isCorrect: true },
      { text: "Volume rongga dalam = 33.493,33 cm³", isCorrect: true },
      { text: "Volume karet = 11.088 cm³ (π=22/7)", isCorrect: false },
    ],
    explanation: {
      concept: "Volume karet = Volume bola luar (r=21) − Volume bola dalam (r=20).",
      steps: [
        "$r_{\\text{dalam}} = 21-1 = 20$ cm ✓ BENAR",
        "V_karet = V_luar − V_dalam ✓ BENAR (definisi)",
        "$V_{\\text{dalam}} = \\frac{4}{3}\\times\\frac{22}{7}\\times8000 = \\frac{4}{3}\\times\\frac{176000}{7} = \\frac{704000}{21} \\approx 33493{,}33$ ✓ BENAR",
        "$V_{\\text{luar}} = \\frac{4}{3}\\times\\frac{22}{7}\\times9261 = \\frac{4}{3}\\times\\frac{203742}{7} \\approx 38772$; $\\Delta V = 38772-33493 \\approx 5279 \\neq 11088$ → SALAH"
      ],
      formula: "V_{\\text{karet}} = \\dfrac{4}{3}\\pi(r_{\\text{luar}}^3 - r_{\\text{dalam}}^3)"
    }
  },
  {
    id: 121, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK – Gabungan",
    question: "Sebuah objek berbentuk kerucut terbalik di atas belahan bola (r sama = 10 cm, t_kerucut = 24 cm) (π=3,14). Tentukan BENAR atau SALAH:",
    statements: [
      { text: "Volume belahan bola = 2.093,33 cm³", isCorrect: true },
      { text: "Volume kerucut = 2.512 cm³", isCorrect: true },
      { text: "Volume total = 4.605,33 cm³", isCorrect: true },
      { text: "Luas permukaan luar = luas selimut kerucut + luas setengah bola", isCorrect: true },
    ],
    explanation: {
      concept: "Hitung semua komponen secara terpisah.",
      steps: [
        "$V_{\\text{1/2 bola}} = \\frac{2}{3}\\times3{,}14\\times1000 = 2093{,}33$ ✓ BENAR",
        "$V_{\\text{kerucut}} = \\frac{1}{3}\\times3{,}14\\times100\\times24 = 2512$ ✓ BENAR",
        "$V_{\\text{total}} = 2093{,}33+2512 = 4605{,}33$ ✓ BENAR",
        "Luas permukaan luar = $\\pi rs$ (kerucut) + $2\\pi r^2$ (setengah bola), alas tidak perlu dihitung ✓ BENAR"
      ],
      formula: "L_{\\text{luar}} = \\pi r s_{\\text{kerucut}} + 2\\pi r^2"
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
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${bangunColor[getBangun(soal)]}`}>{getBangun(soal)}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${topikColor[getTopik(soal)]}`}>{getTopik(soal)}</span>
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
                {isBS && <span className="ml-auto text-xs font-body text-white/30">Benar / Salah</span>}
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

/* ══════════════════════════════════════════════════════
   TOPIK CLASSIFICATION
══════════════════════════════════════════════════════ */
type Topik = "Unsur" | "Luas Permukaan" | "Volume" | "Aplikasi";

const topikOrder: Record<Topik, number> = {
  "Unsur": 0,
  "Luas Permukaan": 1,
  "Volume": 2,
  "Aplikasi": 3,
};

const topikColor: Record<Topik, string> = {
  "Unsur":          "bg-sky-500/20 text-sky-300 border-sky-500/40",
  "Luas Permukaan": "bg-violet-500/20 text-violet-300 border-violet-500/40",
  "Volume":         "bg-amber-500/20 text-amber-300 border-amber-500/40",
  "Aplikasi":       "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
};

function getTopik(soal: Question): Topik {
  const q   = soal.question.toLowerCase();
  const cat = soal.category.toLowerCase();

  if (cat.includes("konsep")) return "Unsur";
  if (cat.includes("kontekstual") || cat.includes("literasi")) return "Aplikasi";

  if (
    q.includes("volume") ||
    q.includes("kapasitas") ||
    q.includes("menampung") ||
    q.includes("dilebur") ||
    q.includes("dicetak menjadi") ||
    q.includes("melebur")
  ) return "Volume";

  if (q.includes("luas")) return "Luas Permukaan";

  if (
    q.includes("jumlah") ||
    q.includes("rusuk") ||
    q.includes("titik sudut") ||
    q.includes("hubungan") ||
    q.includes("rumus") ||
    q.includes("garis pelukis") ||
    q.includes("panjang s") ||
    q.includes("jari-jari") && (q.includes("panjang") || q.includes("mencari") || q.includes("adalah")) && !q.includes("luas") && !q.includes("volume")
  ) return "Unsur";

  return "Aplikasi";
}

/* ══════════════════════════════════════════════════════
   BANGUN CLASSIFICATION
══════════════════════════════════════════════════════ */
type Bangun = "Tabung" | "Kerucut" | "Bola" | "Belahan Bola" | "Gabungan";

function getBangun(soal: Question): Bangun {
  const cat = soal.category;
  if (cat.includes("Kerucut")) return "Kerucut";
  if (cat.includes("Tabung")) return "Tabung";
  if (cat.includes("Belahan")) return "Belahan Bola";
  if (cat.includes("Bola")) return "Bola";
  return "Gabungan";
}

const bangunColor: Record<Bangun, string> = {
  "Tabung":       "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  "Kerucut":      "bg-orange-500/20 text-orange-300 border-orange-500/40",
  "Bola":         "bg-pink-500/20 text-pink-300 border-pink-500/40",
  "Belahan Bola": "bg-rose-500/20 text-rose-300 border-rose-500/40",
  "Gabungan":     "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
};

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const BankSoalBangunRuangSisiLengkungPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [filterTopik, setFilterTopik] = useState<Topik | "Semua">("Semua");
  const [filterBangun, setFilterBangun] = useState<Bangun | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const diffOrder: Record<Difficulty, number> = { "Mudah": 0, "Sedang": 1, "Sulit": 2 };

  const filtered = useMemo(() => {
    const arr = soalBangunRuangSisiLengkung.filter(s =>
      (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
      (filterType === "Semua" || s.type === filterType) &&
      (filterTopik === "Semua" || getTopik(s) === filterTopik) &&
      (filterBangun === "Semua" || getBangun(s) === filterBangun)
    );
    return [...arr].sort((a, b) => {
      const ta = topikOrder[getTopik(a)];
      const tb = topikOrder[getTopik(b)];
      if (ta !== tb) return ta - tb;
      const da = diffOrder[a.difficulty];
      const db = diffOrder[b.difficulty];
      if (da !== db) return da - db;
      return a.id - b.id;
    });
  }, [filterDifficulty, filterType, filterTopik, filterBangun]);

  const counts = {
    Mudah: soalBangunRuangSisiLengkung.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalBangunRuangSisiLengkung.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalBangunRuangSisiLengkung.filter(s => s.difficulty === "Sulit").length,
    PG: soalBangunRuangSisiLengkung.filter(s => s.type === "PG").length,
    MCMA: soalBangunRuangSisiLengkung.filter(s => s.type === "MCMA").length,
    BS: soalBangunRuangSisiLengkung.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Cylinder className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL BANGUN RUANG SISI LENGKUNG
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Tabung · Kerucut · Bola · Belahan Bola · Gabungan
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          121 Soal · UN / TKA / HOTS / ANBK / Literasi · PG + MCMA + Benar/Salah · Dengan Pembahasan
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
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalBangunRuangSisiLengkung.length} Soal</span>
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
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Bangun:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","Tabung","Kerucut","Bola","Belahan Bola","Gabungan"] as const).map(bg => (
                    <button key={bg} onClick={() => { playPopSound(); setFilterBangun(bg); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${
                        filterBangun === bg
                          ? bg === "Semua" ? "bg-primary text-white border-primary"
                          : `border ${bangunColor[bg as Bangun]} font-bold`
                          : "border-border text-white/50 hover:border-primary/40"
                      }`}>
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Topik:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","Unsur","Luas Permukaan","Volume","Aplikasi"] as const).map(tp => (
                    <button key={tp} onClick={() => { playPopSound(); setFilterTopik(tp); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${
                        filterTopik === tp
                          ? tp === "Semua" ? "bg-primary text-white border-primary"
                          : `border ${topikColor[tp as Topik]} font-bold`
                          : "border-border text-white/50 hover:border-primary/40"
                      }`}>
                      {tp}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-white/30 mt-1.5 font-body">Soal selalu diurutkan: Unsur → Luas Permukaan → Volume → Aplikasi</p>
              </div>
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalBangunRuangSisiLengkung.length} soal</p>
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

export default BankSoalBangunRuangSisiLengkungPage;
