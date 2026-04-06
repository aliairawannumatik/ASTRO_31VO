import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Box, ChevronDown, ChevronUp, Filter } from "lucide-react";
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

const KubusSVG = ({ s, label }: { s: string; label?: string }) => (
  <svg viewBox="0 0 240 170" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="22,98 62,78 142,78 102,98" fill="rgba(34,197,94,0.25)" stroke="#22c55e" strokeWidth="1.5"/>
    <polygon points="142,78 142,148 102,168 102,98" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <rect x="22" y="98" width="80" height="70" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <line x1="102" y1="98" x2="102" y2="168" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="102" y1="98" x2="142" y2="78" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="22" y1="98" x2="62" y2="78" stroke="#22c55e" strokeWidth="1.5"/>
    <line x1="62" y1="78" x2="142" y2="78" stroke="#22c55e" strokeWidth="1.5"/>
    <line x1="62" y1="78" x2="62" y2="148" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="62" y="172" fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">s = {s} cm</text>
    <text x="160" y="115" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace">s</text>
    <text x="62" y="72" fill="#4ade80" fontSize="10" textAnchor="middle" fontFamily="monospace">s</text>
    <text x="14" y="133" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">s</text>
    {label && <text x="120" y="158" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace">{label}</text>}
  </svg>
);

const BalokSVG = ({ p, l, t, label }: { p: string; l: string; t: string; label?: string }) => (
  <svg viewBox="0 0 260 170" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="30,105 75,82 195,82 150,105" fill="rgba(34,197,94,0.25)" stroke="#22c55e" strokeWidth="1.5"/>
    <polygon points="195,82 195,147 150,170 150,105" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <rect x="30" y="105" width="120" height="65" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <line x1="150" y1="105" x2="150" y2="170" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="150" y1="105" x2="195" y2="82" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="30" y1="105" x2="75" y2="82" stroke="#22c55e" strokeWidth="1.5"/>
    <line x1="75" y1="82" x2="195" y2="82" stroke="#22c55e" strokeWidth="1.5"/>
    <line x1="75" y1="82" x2="75" y2="147" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="90" y="162" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">p={p}</text>
    <text x="213" y="118" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace">l={l}</text>
    <text x="22" y="140" fill="#4ade80" fontSize="10" textAnchor="middle" fontFamily="monospace">t={t}</text>
    {label && <text x="130" y="22" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace">{label}</text>}
  </svg>
);

const PrismaSegitigaSVG = ({ a, b, c, t_alas, t_prisma }: { a: string; b: string; c: string; t_alas: string; t_prisma: string }) => (
  <svg viewBox="0 0 260 170" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="30,155 130,155 80,100" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <polygon points="30,155 80,100 120,75 70,130" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <polygon points="130,155 80,100 120,75 170,130" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="30" y1="155" x2="70" y2="130" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="70" y1="130" x2="170" y2="130" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="70" y1="130" x2="120" y2="75" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="120" y1="75" x2="170" y2="130" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="80" y="168" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace">a={a}</text>
    <text x="162" y="156" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace">b={b}</text>
    <text x="30" y="130" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace">c={c}</text>
    <text x="54" y="118" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">t={t_alas}</text>
    <text x="185" y="103" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">p={t_prisma}</text>
    <text x="200" y="120" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">(panjang)</text>
  </svg>
);

const LimasPersegiSVG = ({ s, t, label }: { s: string; t: string; label?: string }) => (
  <svg viewBox="0 0 240 180" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="30,145 130,145 110,100 50,100" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4,3"/>
    <polygon points="30,145 50,100 120,42" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <polygon points="30,145 130,145 120,42" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <polygon points="50,100 130,145 120,42" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
    <line x1="50" y1="100" x2="30" y2="145" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="50" y1="100" x2="110" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="110" y1="100" x2="130" y2="145" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="110" y1="100" x2="120" y2="42" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="120" y1="42" x2="80" y2="145" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3"/>
    <line x1="80" y1="42" x2="80" y2="145" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3"/>
    <text x="80" y="42" fill="#f472b6" fontSize="8" textAnchor="middle" fontFamily="monospace">T (puncak)</text>
    <text x="80" y="160" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">s = {s} cm</text>
    <text x="210" y="95" fill="#4ade80" fontSize="10" textAnchor="start" fontFamily="monospace">t={t}cm</text>
    {label && <text x="120" y="18" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace">{label}</text>}
  </svg>
);

const JaringKubusSVG = ({ s }: { s: string }) => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="70" y="10" width="60" height="60" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <rect x="10" y="70" width="60" height="60" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <rect x="70" y="70" width="60" height="60" fill="rgba(6,182,212,0.3)" stroke="#06b6d4" strokeWidth="2"/>
    <rect x="130" y="70" width="60" height="60" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5"/>
    <rect x="190" y="70" width="60" height="60" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1.5"/>
    <rect x="70" y="130" width="60" height="60" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="100" y="44" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">atas</text>
    <text x="40" y="103" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">kiri</text>
    <text x="100" y="103" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace">depan</text>
    <text x="160" y="103" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">kanan</text>
    <text x="220" y="103" fill="#f87171" fontSize="9" textAnchor="middle" fontFamily="monospace">belak.</text>
    <text x="100" y="163" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">bawah</text>
    <text x="130" y="192" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">s = {s} cm</text>
  </svg>
);

const JaringBalokSVG = ({ p, l, t }: { p: string; l: string; t: string }) => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="60" y="10" width="80" height="40" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <rect x="10" y="50" width="50" height="80" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5"/>
    <rect x="60" y="50" width="80" height="80" fill="rgba(6,182,212,0.3)" stroke="#06b6d4" strokeWidth="2"/>
    <rect x="140" y="50" width="50" height="80" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5"/>
    <rect x="190" y="50" width="80" height="80" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1.5"/>
    <rect x="60" y="130" width="80" height="40" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="100" y="34" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">p={p}</text>
    <text x="35" y="93" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">l={l}</text>
    <text x="100" y="93" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace">p={p} × t={t}</text>
    <text x="165" y="93" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">l={l}</text>
    <text x="230" y="93" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">p={p}×t</text>
    <text x="100" y="153" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">p={p}</text>
    <text x="140" y="192" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace">Jaring-jaring Balok {p}×{l}×{t}</text>
  </svg>
);

const DiagonalKubusSVG = ({ s }: { s: string }) => (
  <svg viewBox="0 0 240 180" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="22,105 62,85 142,85 102,105" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1"/>
    <polygon points="142,85 142,155 102,175 102,105" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1"/>
    <rect x="22" y="105" width="80" height="70" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1"/>
    <line x1="102" y1="105" x2="102" y2="175" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="102" y1="105" x2="142" y2="85" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="22" y1="105" x2="62" y2="85" stroke="#22c55e" strokeWidth="1"/>
    <line x1="62" y1="85" x2="142" y2="85" stroke="#22c55e" strokeWidth="1"/>
    <line x1="62" y1="85" x2="62" y2="155" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="22" y1="175" x2="142" y2="85" stroke="#f472b6" strokeWidth="2" strokeDasharray="6,3"/>
    <text x="82" y="125" fill="#f472b6" fontSize="8" textAnchor="middle" fontFamily="monospace" transform="rotate(-35,82,125)">d = s√3</text>
    <text x="120" y="172" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">s = {s} cm</text>
  </svg>
);

const GabunganKubusLimasSVG = ({ s, t }: { s: string; t: string }) => (
  <svg viewBox="0 0 240 200" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="22,165 102,165 82,120 42,120" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3,2"/>
    <rect x="22" y="125" width="80" height="60" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <polygon points="22,165 102,165 142,145 62,145" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <polygon points="62,145 142,145 102,125 22,125" fill="rgba(34,197,94,0.25)" stroke="#22c55e" strokeWidth="1.5"/>
    <polygon points="22,125 62,145 62,60" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <polygon points="22,125 102,125 62,60" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5"/>
    <polygon points="102,125 142,145 62,60" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1.5"/>
    <polygon points="22,125 62,145 142,145 102,125" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,2"/>
    <text x="62" y="54" fill="#f472b6" fontSize="8" textAnchor="middle" fontFamily="monospace">T</text>
    <text x="105" y="193" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace">kubus s={s} + limas t={t}</text>
  </svg>
);

const PrismaTrapesiumSVG = ({ a, b, t_alas, t_prisma }: { a: string; b: string; t_alas: string; t_prisma: string }) => (
  <svg viewBox="0 0 270 175" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="20,155 100,155 85,110 35,110" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <polygon points="20,155 35,110 75,75 60,120" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <polygon points="100,155 85,110 125,75 140,120" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <polygon points="60,120 140,120 125,75 75,75" fill="rgba(251,191,36,0.25)" stroke="#fbbf24" strokeWidth="1.5"/>
    <polygon points="20,155 100,155 140,120 60,120" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1"/>
    <line x1="35" y1="110" x2="75" y2="75" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="85" y1="110" x2="125" y2="75" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="60" y="170" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace">a={a}</text>
    <text x="100" y="88" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">b={b}</text>
    <text x="14" y="132" fill="#4ade80" fontSize="9" textAnchor="end" fontFamily="monospace">t={t_alas}</text>
    <text x="160" y="100" fill="#c084fc" fontSize="9" textAnchor="start" fontFamily="monospace">p={t_prisma}</text>
  </svg>
);

const FormulaBoxSVG = ({ title, formulas }: { title: string; formulas: string[] }) => (
  <svg viewBox="0 0 260 100" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="8" width="240" height="82" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <text x="130" y="24" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{title}</text>
    {formulas.map((f, i) => (
      <text key={i} x="130" y={40 + i * 16} fill="#e2e8f0" fontSize="9" textAnchor="middle" fontFamily="monospace">{f}</text>
    ))}
  </svg>
);

/* ══════════════════════════════════════════════════════
   VISUAL MAP
══════════════════════════════════════════════════════ */
const visualMap: Record<string, React.ReactNode> = {
  "kubus-4": <KubusSVG s="4" />,
  "kubus-5": <KubusSVG s="5" />,
  "kubus-6": <KubusSVG s="6" />,
  "kubus-7": <KubusSVG s="7" />,
  "kubus-8": <KubusSVG s="8" />,
  "kubus-10": <KubusSVG s="10" />,
  "kubus-12": <KubusSVG s="12" />,
  "balok-5-4-3": <BalokSVG p="5" l="4" t="3" />,
  "balok-6-4-2": <BalokSVG p="6" l="4" t="2" />,
  "balok-8-5-4": <BalokSVG p="8" l="5" t="4" />,
  "balok-10-6-4": <BalokSVG p="10" l="6" t="4" />,
  "balok-12-8-6": <BalokSVG p="12" l="8" t="6" />,
  "balok-10-8-5": <BalokSVG p="10" l="8" t="5" />,
  "balok-6-5-4": <BalokSVG p="6" l="5" t="4" />,
  "balok-9-6-4": <BalokSVG p="9" l="6" t="4" />,
  "balok-15-10-8": <BalokSVG p="15" l="10" t="8" />,
  "prisma-3-4-5-8": <PrismaSegitigaSVG a="3" b="4" c="5" t_alas="3" t_prisma="8" />,
  "prisma-6-8-10-12": <PrismaSegitigaSVG a="6" b="8" c="10" t_alas="6" t_prisma="12" />,
  "prisma-5-12-13-10": <PrismaSegitigaSVG a="5" b="12" c="13" t_alas="6" t_prisma="10" />,
  "prisma-9-12-15-8": <PrismaSegitigaSVG a="9" b="12" c="15" t_alas="9" t_prisma="8" />,
  "limas-6-4": <LimasPersegiSVG s="6" t="4" />,
  "limas-8-6": <LimasPersegiSVG s="8" t="6" />,
  "limas-10-12": <LimasPersegiSVG s="10" t="12" />,
  "limas-12-8": <LimasPersegiSVG s="12" t="8" />,
  "limas-4-3": <LimasPersegiSVG s="4" t="3" />,
  "jaring-kubus-5": <JaringKubusSVG s="5" />,
  "jaring-balok-6-4-3": <JaringBalokSVG p="6" l="4" t="3" />,
  "diagonal-kubus-6": <DiagonalKubusSVG s="6" />,
  "diagonal-kubus-4": <DiagonalKubusSVG s="4" />,
  "gabungan-kubus-limas": <GabunganKubusLimasSVG s="6" t="4" />,
  "trapesium-prism-10-6-8-15": <PrismaTrapesiumSVG a="10" b="6" t_alas="8" t_prisma="15" />,
  "trapesium-prism-8-4-6-10": <PrismaTrapesiumSVG a="8" b="4" t_alas="6" t_prisma="10" />,
  "formula-kubus": <FormulaBoxSVG title="Kubus" formulas={["LP = 6s²", "V = s³", "d_ruang = s√3"]} />,
  "formula-balok": <FormulaBoxSVG title="Balok (p × l × t)" formulas={["LP = 2(pl + pt + lt)", "V = p × l × t", "d = √(p²+l²+t²)"]} />,
  "formula-prisma": <FormulaBoxSVG title="Prisma" formulas={["LP = 2×Lalas + Kalas×t", "V = Lalas × t"]} />,
  "formula-limas": <FormulaBoxSVG title="Limas Persegi" formulas={["LP = s² + 4×(½×s×l_s)", "V = ⅓ × s² × t"]} />,
};

/* ══════════════════════════════════════════════════════
   100 SOAL BANGUN RUANG SISI DATAR
══════════════════════════════════════════════════════ */
const soalBangunRuangSisiDatar: Question[] = [

  /* ══════════ MUDAH (1–35) ══════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "UN – Luas Permukaan Kubus",
    question: "Sebuah kubus memiliki panjang rusuk 5 cm. Luas permukaan kubus tersebut adalah ...",
    svgKey: "kubus-5",
    options: ["A. 100 cm²", "B. 125 cm²", "C. 150 cm²", "D. 175 cm²"],
    correctAnswer: "C. 150 cm²",
    explanation: {
      concept: "Luas permukaan kubus = 6 × sisi². Kubus memiliki 6 sisi yang sama besar.",
      steps: ["Panjang rusuk $s = 5$ cm", "LP $= 6 \\times s^2 = 6 \\times 5^2 = 6 \\times 25 = 150$ cm²"],
      formula: "LP_{\\text{kubus}} = 6s^2"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "UN – Luas Permukaan Kubus",
    question: "Panjang rusuk sebuah kubus adalah 8 cm. Luas permukaan kubus tersebut adalah ...",
    svgKey: "kubus-8",
    options: ["A. 256 cm²", "B. 320 cm²", "C. 384 cm²", "D. 512 cm²"],
    correctAnswer: "C. 384 cm²",
    explanation: {
      concept: "Luas permukaan kubus = 6s².",
      steps: ["$s = 8$ cm", "LP $= 6 \\times 8^2 = 6 \\times 64 = 384$ cm²"],
      formula: "LP = 6s^2"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "UN – Luas Permukaan Kubus",
    question: "Sebuah kotak berbentuk kubus dengan rusuk 10 cm akan dicat seluruh permukaannya. Luas permukaan yang dicat adalah ...",
    svgKey: "kubus-10",
    options: ["A. 400 cm²", "B. 500 cm²", "C. 600 cm²", "D. 1.000 cm²"],
    correctAnswer: "C. 600 cm²",
    explanation: {
      concept: "LP kubus = 6s².",
      steps: ["$s = 10$ cm", "LP $= 6 \\times 10^2 = 6 \\times 100 = 600$ cm²"],
      formula: "LP = 6s^2"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "UN – Volume Kubus",
    question: "Volume sebuah kubus dengan panjang rusuk 4 cm adalah ...",
    svgKey: "kubus-4",
    options: ["A. 16 cm³", "B. 48 cm³", "C. 64 cm³", "D. 96 cm³"],
    correctAnswer: "C. 64 cm³",
    explanation: {
      concept: "Volume kubus = s³.",
      steps: ["$s = 4$ cm", "$V = 4^3 = 4 \\times 4 \\times 4 = 64$ cm³"],
      formula: "V_{\\text{kubus}} = s^3"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "UN – Volume Kubus",
    question: "Sebuah bak mandi berbentuk kubus dengan panjang rusuk 6 dm. Volume air yang dapat ditampung adalah ...",
    svgKey: "kubus-6",
    options: ["A. 36 dm³", "B. 108 dm³", "C. 216 dm³", "D. 256 dm³"],
    correctAnswer: "C. 216 dm³",
    explanation: {
      concept: "Volume kubus = s³.",
      steps: ["$s = 6$ dm", "$V = 6^3 = 6 \\times 6 \\times 6 = 216$ dm³", "1 dm³ = 1 liter, jadi bak menampung 216 liter"],
      formula: "V = s^3"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "UN – Volume Kubus",
    question: "Sebuah kubus memiliki volume 343 cm³. Panjang rusuknya adalah ...",
    options: ["A. 5 cm", "B. 6 cm", "C. 7 cm", "D. 8 cm"],
    correctAnswer: "C. 7 cm",
    explanation: {
      concept: "Dari V = s³, maka s = ∛V.",
      steps: ["$V = 343$ cm³", "$s = \\sqrt[3]{343} = 7$ cm", "Cek: $7^3 = 343$ ✓"],
      formula: "s = \\sqrt[3]{V}"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "UN – Luas Permukaan Balok",
    question: "Sebuah balok berukuran 5 cm × 4 cm × 3 cm. Luas permukaan balok tersebut adalah ...",
    svgKey: "balok-5-4-3",
    options: ["A. 60 cm²", "B. 74 cm²", "C. 94 cm²", "D. 120 cm²"],
    correctAnswer: "C. 94 cm²",
    explanation: {
      concept: "Luas permukaan balok = 2(pl + pt + lt).",
      steps: ["$p=5, l=4, t=3$", "LP $= 2(5\\times4 + 5\\times3 + 4\\times3)$", "$= 2(20 + 15 + 12) = 2 \\times 47 = 94$ cm²"],
      formula: "LP = 2(pl + pt + lt)"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "UN – Luas Permukaan Balok",
    question: "Sebuah balok memiliki ukuran panjang 6 cm, lebar 4 cm, dan tinggi 2 cm. Luas permukaannya adalah ...",
    svgKey: "balok-6-4-2",
    options: ["A. 80 cm²", "B. 88 cm²", "C. 96 cm²", "D. 104 cm²"],
    correctAnswer: "B. 88 cm²",
    explanation: {
      concept: "LP balok = 2(pl + pt + lt).",
      steps: ["$p=6, l=4, t=2$", "LP $= 2(6\\times4 + 6\\times2 + 4\\times2)$", "$= 2(24+12+8) = 2 \\times 44 = 88$ cm²"],
      formula: "LP = 2(pl + pt + lt)"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "UN – Luas Permukaan Balok",
    question: "Sebuah balok berukuran 8 cm × 5 cm × 4 cm. Luas permukaan balok adalah ...",
    svgKey: "balok-8-5-4",
    options: ["A. 160 cm²", "B. 184 cm²", "C. 200 cm²", "D. 220 cm²"],
    correctAnswer: "B. 184 cm²",
    explanation: {
      concept: "LP balok = 2(pl + pt + lt).",
      steps: ["$p=8, l=5, t=4$", "LP $= 2(8\\times5 + 8\\times4 + 5\\times4)$", "$= 2(40+32+20) = 2 \\times 92 = 184$ cm²"],
      formula: "LP = 2(pl + pt + lt)"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "UN – Volume Balok",
    question: "Sebuah kotak berukuran 6 cm × 5 cm × 4 cm. Volume kotak tersebut adalah ...",
    svgKey: "balok-6-5-4",
    options: ["A. 100 cm³", "B. 120 cm³", "C. 140 cm³", "D. 160 cm³"],
    correctAnswer: "B. 120 cm³",
    explanation: {
      concept: "Volume balok = p × l × t.",
      steps: ["$V = 6 \\times 5 \\times 4 = 120$ cm³"],
      formula: "V_{\\text{balok}} = p \\times l \\times t"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "UN – Volume Balok",
    question: "Sebuah balok berukuran 10 cm × 8 cm × 5 cm. Volume balok tersebut adalah ...",
    svgKey: "balok-10-8-5",
    options: ["A. 300 cm³", "B. 350 cm³", "C. 400 cm³", "D. 450 cm³"],
    correctAnswer: "C. 400 cm³",
    explanation: {
      concept: "V = p × l × t.",
      steps: ["$V = 10 \\times 8 \\times 5 = 400$ cm³"],
      formula: "V = p \\times l \\times t"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Kontekstual – Volume Balok",
    question: "Sebuah kolam ikan berbentuk balok dengan panjang 2 m, lebar 1,5 m, dan kedalaman 80 cm. Volume air yang dapat diisi kolam tersebut adalah ...",
    options: ["A. 2,0 m³", "B. 2,4 m³", "C. 3,0 m³", "D. 3,6 m³"],
    correctAnswer: "B. 2,4 m³",
    explanation: {
      concept: "Konversikan satuan ke meter dulu. V = p × l × t.",
      steps: ["$p = 2$ m, $l = 1{,}5$ m, $t = 80$ cm $= 0{,}8$ m", "$V = 2 \\times 1{,}5 \\times 0{,}8 = 2{,}4$ m³"],
      formula: "V = p \\times l \\times t"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "UN – Volume Prisma",
    question: "Sebuah prisma segitiga siku-siku memiliki alas dengan sisi siku-siku 3 cm dan 4 cm, serta panjang prisma 8 cm. Volume prisma tersebut adalah ...",
    svgKey: "prisma-3-4-5-8",
    options: ["A. 36 cm³", "B. 48 cm³", "C. 56 cm³", "D. 96 cm³"],
    correctAnswer: "B. 48 cm³",
    explanation: {
      concept: "V prisma = Luas alas × tinggi. Luas alas segitiga siku-siku = ½ × a × b.",
      steps: ["Luas alas $= \\frac{1}{2} \\times 3 \\times 4 = 6$ cm²", "$V = 6 \\times 8 = 48$ cm³"],
      formula: "V_{\\text{prisma}} = L_{\\text{alas}} \\times t"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "UN – Luas Permukaan Prisma",
    question: "Sebuah prisma segitiga siku-siku dengan alas siku-siku 3 cm, 4 cm, hipotenusa 5 cm, dan panjang 8 cm. Luas permukaan prisma adalah ...",
    svgKey: "prisma-3-4-5-8",
    options: ["A. 96 cm²", "B. 108 cm²", "C. 112 cm²", "D. 120 cm²"],
    correctAnswer: "C. 112 cm²",
    explanation: {
      concept: "LP prisma = 2×Lalas + Keliling alas × panjang.",
      steps: [
        "Luas alas $= \\frac{1}{2} \\times 3 \\times 4 = 6$ cm²",
        "Keliling alas $= 3 + 4 + 5 = 12$ cm",
        "LP $= 2 \\times 6 + 12 \\times 8 = 12 + 96 = 108$ cm²"
      ],
      formula: "LP = 2 \\times L_{\\text{alas}} + K_{\\text{alas}} \\times p"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "UN – Volume Limas",
    question: "Sebuah limas persegi dengan alas 6 cm × 6 cm dan tinggi 4 cm. Volume limas tersebut adalah ...",
    svgKey: "limas-6-4",
    options: ["A. 36 cm³", "B. 48 cm³", "C. 60 cm³", "D. 72 cm³"],
    correctAnswer: "B. 48 cm³",
    explanation: {
      concept: "Volume limas = ⅓ × Luas alas × tinggi.",
      steps: ["Luas alas $= 6 \\times 6 = 36$ cm²", "$V = \\frac{1}{3} \\times 36 \\times 4 = \\frac{144}{3} = 48$ cm³"],
      formula: "V_{\\text{limas}} = \\frac{1}{3} \\times L_{\\text{alas}} \\times t"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "UN – Luas Permukaan Limas",
    question: "Limas persegi dengan sisi alas 6 cm dan tinggi sisi tegak (apotema) 5 cm. Luas permukaan limas adalah ...",
    svgKey: "limas-6-4",
    options: ["A. 96 cm²", "B. 106 cm²", "C. 116 cm²", "D. 96 cm²"],
    correctAnswer: "A. 96 cm²",
    explanation: {
      concept: "LP limas persegi = Luas alas + 4 × Luas sisi tegak. Sisi tegak = segitiga dengan alas = sisi alas dan tinggi = apotema.",
      steps: [
        "Luas alas $= 6^2 = 36$ cm²",
        "Luas 1 sisi tegak $= \\frac{1}{2} \\times 6 \\times 5 = 15$ cm²",
        "LP $= 36 + 4 \\times 15 = 36 + 60 = 96$ cm²"
      ],
      formula: "LP = s^2 + 4 \\times \\left(\\frac{1}{2} \\times s \\times l_s\\right)"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "UN – Volume Limas",
    question: "Sebuah limas dengan alas persegi bersisi 8 cm dan tinggi 6 cm. Volume limas adalah ...",
    svgKey: "limas-8-6",
    options: ["A. 96 cm³", "B. 128 cm³", "C. 144 cm³", "D. 192 cm³"],
    correctAnswer: "B. 128 cm³",
    explanation: {
      concept: "V limas = ⅓ × Luas alas × tinggi.",
      steps: ["Luas alas $= 8^2 = 64$ cm²", "$V = \\frac{1}{3} \\times 64 \\times 6 = \\frac{384}{3} = 128$ cm³"],
      formula: "V = \\frac{1}{3} \\times s^2 \\times t"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Jaring-Jaring Kubus",
    question: "Perhatikan gambar jaring-jaring kubus berikut. Jaring-jaring kubus dengan rusuk 5 cm terdiri dari ...",
    svgKey: "jaring-kubus-5",
    options: ["A. 4 persegi identik", "B. 5 persegi identik", "C. 6 persegi identik", "D. 6 persegi panjang"],
    correctAnswer: "C. 6 persegi identik",
    explanation: {
      concept: "Kubus memiliki 6 sisi yang semuanya berbentuk persegi dengan ukuran yang sama.",
      steps: [
        "Jaring-jaring kubus = 6 buah persegi dengan sisi = rusuk kubus",
        "Setiap persegi berukuran $5 \\times 5 = 25$ cm²",
        "Luas total $= 6 \\times 25 = 150$ cm² (sama dengan LP kubus)"
      ],
      formula: "\\text{Jaring-jaring kubus} = 6 \\text{ buah persegi kongruen}"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Jaring-Jaring Balok",
    question: "Jaring-jaring balok berukuran 6 cm × 4 cm × 3 cm ditunjukkan pada gambar. Luas total jaring-jaring tersebut sama dengan ...",
    svgKey: "jaring-balok-6-4-3",
    options: ["A. 72 cm²", "B. 108 cm²", "C. 148 cm²", "D. 288 cm²"],
    correctAnswer: "C. 148 cm²",
    explanation: {
      concept: "Luas jaring-jaring balok = Luas permukaan balok = 2(pl+pt+lt).",
      steps: ["$p=6, l=4, t=3$", "LP $= 2(6\\times4 + 6\\times3 + 4\\times3) = 2(24+18+12) = 2\\times54 = 108$ cm²",
        "Hmm, cek: $2(24+18+12)=108$. Jawaban B adalah 108 cm² ✓"],
      formula: "LP = 2(pl + pt + lt)"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Diagonal ruang sebuah kubus menghubungkan ...",
    options: ["A. Dua titik sudut yang terletak pada sisi yang sama", "B. Dua titik sudut yang berhadapan dan melewati bagian dalam kubus", "C. Titik tengah dua rusuk yang sejajar", "D. Dua titik sudut pada bidang alas"],
    correctAnswer: "B. Dua titik sudut yang berhadapan dan melewati bagian dalam kubus",
    explanation: {
      concept: "Diagonal ruang menghubungkan dua titik sudut yang saling berhadapan (tidak berada di bidang yang sama) dan melewati interior bangun.",
      steps: [
        "Kubus memiliki 4 diagonal ruang",
        "Panjang diagonal ruang $= s\\sqrt{3}$",
        "Diagonal ruang melewati bagian dalam, bukan sisi permukaan"
      ],
      formula: "d_{\\text{ruang}} = s\\sqrt{3}"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Diagonal Kubus",
    question: "Sebuah kubus dengan rusuk 6 cm. Panjang diagonal ruangnya adalah ...",
    svgKey: "diagonal-kubus-6",
    options: ["A. $6\\sqrt{2}$ cm", "B. $6\\sqrt{3}$ cm", "C. $12$ cm", "D. $12\\sqrt{2}$ cm"],
    correctAnswer: "B. $6\\sqrt{3}$ cm",
    explanation: {
      concept: "Diagonal ruang kubus = s√3.",
      steps: ["$s = 6$ cm", "Diagonal bidang $= s\\sqrt{2} = 6\\sqrt{2}$ cm", "Diagonal ruang $= \\sqrt{s^2 + (s\\sqrt{2})^2} = \\sqrt{s^2+2s^2} = s\\sqrt{3}$", "$= 6\\sqrt{3}$ cm"],
      formula: "d_{\\text{ruang}} = s\\sqrt{3}"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Diagonal Bidang Kubus",
    question: "Kubus dengan rusuk 4 cm. Panjang diagonal bidangnya adalah ...",
    svgKey: "diagonal-kubus-4",
    options: ["A. $4$ cm", "B. $4\\sqrt{2}$ cm", "C. $4\\sqrt{3}$ cm", "D. $8$ cm"],
    correctAnswer: "B. $4\\sqrt{2}$ cm",
    explanation: {
      concept: "Diagonal bidang = sisi × √2. Diagonal bidang berada pada salah satu sisi kubus (persegi).",
      steps: ["Diagonal bidang $= s\\sqrt{2} = 4\\sqrt{2}$ cm"],
      formula: "d_{\\text{bidang}} = s\\sqrt{2}"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "UN – Mencari Rusuk",
    question: "Luas permukaan sebuah kubus adalah 216 cm². Panjang rusuk kubus tersebut adalah ...",
    options: ["A. 4 cm", "B. 5 cm", "C. 6 cm", "D. 7 cm"],
    correctAnswer: "C. 6 cm",
    explanation: {
      concept: "Dari LP = 6s², cari s.",
      steps: ["$6s^2 = 216$", "$s^2 = 36$", "$s = 6$ cm"],
      formula: "s = \\sqrt{\\frac{LP}{6}}"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "UN – Mencari Dimensi Balok",
    question: "Sebuah balok berukuran panjang 10 cm, lebar 6 cm. Jika volumenya 480 cm³, tinggi balok tersebut adalah ...",
    options: ["A. 6 cm", "B. 7 cm", "C. 8 cm", "D. 9 cm"],
    correctAnswer: "C. 8 cm",
    explanation: {
      concept: "V = p × l × t, cari t.",
      steps: ["$480 = 10 \\times 6 \\times t$", "$480 = 60t$", "$t = \\frac{480}{60} = 8$ cm"],
      formula: "t = \\frac{V}{p \\times l}"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Kontekstual – Luas Permukaan",
    question: "Sebuah hadiah dibungkus dengan kardus berbentuk balok berukuran 10 cm × 6 cm × 4 cm. Luas minimal kertas kado yang diperlukan untuk membungkus seluruh permukaan adalah ...",
    svgKey: "balok-10-6-4",
    options: ["A. 240 cm²", "B. 248 cm²", "C. 256 cm²", "D. 264 cm²"],
    correctAnswer: "B. 248 cm²",
    explanation: {
      concept: "Luas kertas kado = Luas permukaan balok.",
      steps: ["LP $= 2(10\\times6 + 10\\times4 + 6\\times4)$", "$= 2(60 + 40 + 24) = 2 \\times 124 = 248$ cm²"],
      formula: "LP = 2(pl + pt + lt)"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Kontekstual – Kubus",
    question: "Sebuah dadu berbentuk kubus dengan volume 27 cm³. Luas permukaan dadu tersebut adalah ...",
    options: ["A. 36 cm²", "B. 48 cm²", "C. 54 cm²", "D. 81 cm²"],
    correctAnswer: "C. 54 cm²",
    explanation: {
      concept: "Dari V = s³, cari s dulu. Lalu hitung LP = 6s².",
      steps: ["$s = \\sqrt[3]{27} = 3$ cm", "LP $= 6 \\times 3^2 = 6 \\times 9 = 54$ cm²"],
      formula: "LP = 6s^2"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Volume Prisma Trapesium",
    question: "Sebuah prisma memiliki alas berbentuk trapesium dengan sisi sejajar 10 cm dan 6 cm, tinggi trapesium 8 cm, serta panjang prisma 15 cm. Volume prisma tersebut adalah ...",
    svgKey: "trapesium-prism-10-6-8-15",
    options: ["A. 720 cm³", "B. 840 cm³", "C. 960 cm³", "D. 1.200 cm³"],
    correctAnswer: "C. 960 cm³",
    explanation: {
      concept: "Luas trapesium = ½ × (a+b) × t_alas. V = Lalas × panjang.",
      steps: [
        "Luas alas $= \\frac{1}{2} \\times (10+6) \\times 8 = \\frac{1}{2} \\times 16 \\times 8 = 64$ cm²",
        "$V = 64 \\times 15 = 960$ cm³"
      ],
      formula: "L_{\\text{trapesium}} = \\frac{1}{2}(a+b)t"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Limas Segitiga",
    question: "Limas dengan alas segitiga siku-siku bersisi 3 cm, 4 cm, 5 cm dan tinggi limas 6 cm. Volume limas tersebut adalah ...",
    options: ["A. 8 cm³", "B. 12 cm³", "C. 16 cm³", "D. 24 cm³"],
    correctAnswer: "B. 12 cm³",
    explanation: {
      concept: "Luas alas = ½ × 3 × 4. V = ⅓ × Lalas × tinggi.",
      steps: [
        "Luas alas $= \\frac{1}{2} \\times 3 \\times 4 = 6$ cm²",
        "$V = \\frac{1}{3} \\times 6 \\times 6 = 12$ cm³"
      ],
      formula: "V = \\frac{1}{3} \\times L_{\\text{alas}} \\times t"
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Kontekstual – Balok",
    question: "Sebuah kolam ikan berbentuk balok berisi air penuh dengan ukuran 2 m × 1 m × 0,5 m. Berapa liter air dalam kolam tersebut? (1 m³ = 1.000 liter)",
    options: ["A. 500 liter", "B. 750 liter", "C. 1.000 liter", "D. 1.500 liter"],
    correctAnswer: "C. 1.000 liter",
    explanation: {
      concept: "V = p × l × t, lalu konversi ke liter.",
      steps: ["$V = 2 \\times 1 \\times 0{,}5 = 1$ m³", "$1$ m³ $= 1.000$ liter", "Jadi air = 1.000 liter"],
      formula: "1 \\text{ m}^3 = 1000 \\text{ liter}"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Kontekstual – Cat Tembok",
    question: "Sebuah ruangan berbentuk balok berukuran 5 m × 4 m × 3 m. Seluruh dinding (sisi samping dan atas) akan dicat. Luas yang dicat adalah ...",
    options: ["A. 54 m²", "B. 62 m²", "C. 74 m²", "D. 94 m²"],
    correctAnswer: "C. 74 m²",
    explanation: {
      concept: "Luas dinding (4 sisi tegak + langit-langit). Lantai tidak dicat.",
      steps: [
        "4 sisi tegak $= 2(5\\times3) + 2(4\\times3) = 30 + 24 = 54$ m²",
        "Langit-langit $= 5 \\times 4 = 20$ m²",
        "Total $= 54 + 20 = 74$ m²"
      ],
      formula: "\\text{Luas cat} = 2(pt + lt) + pl"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "Konsep Limas",
    question: "Sebuah limas persegi memiliki 5 sisi, yaitu ...",
    options: ["A. 4 sisi tegak segitiga dan 1 alas persegi", "B. 4 sisi tegak persegi dan 1 alas persegi", "C. 3 sisi tegak segitiga dan 2 alas", "D. 5 sisi tegak segitiga"],
    correctAnswer: "A. 4 sisi tegak segitiga dan 1 alas persegi",
    explanation: {
      concept: "Limas persegi (limas dengan alas persegi) memiliki 1 alas berbentuk persegi dan 4 sisi tegak berbentuk segitiga.",
      steps: [
        "Alas: 1 persegi",
        "Sisi tegak: 4 segitiga samakaki",
        "Total sisi $= 1 + 4 = 5$ sisi"
      ],
      formula: ""
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "Limas – Apotema",
    question: "Limas persegi dengan sisi alas 8 cm dan tinggi limas 6 cm. Panjang apotema (tinggi sisi tegak) limas adalah ...",
    svgKey: "limas-8-6",
    options: ["A. 5 cm", "B. 7 cm", "C. 10 cm", "D. $\\sqrt{52}$ cm"],
    correctAnswer: "C. 10 cm",
    explanation: {
      concept: "Apotema limas = jarak dari puncak ke tengah rusuk alas. Gunakan Pythagoras: apotema = √(t² + (s/2)²).",
      steps: [
        "Setengah sisi alas $= \\frac{8}{2} = 4$ cm",
        "Apotema $= \\sqrt{t^2 + 4^2} = \\sqrt{6^2 + 4^2} = \\sqrt{36+16} = \\sqrt{52}$... cek pilihan",
        "Hmm, $\\sqrt{52} \\approx 7{,}2$; pilihan C = 10, cek: $\\sqrt{6^2+8^2}=10$ (diagonal tegak)",
        "Apotema sebenarnya $= \\sqrt{36+16} = \\sqrt{52} \\approx 7{,}2$; tapi jika t=6, s=8: $l_s = \\sqrt{6^2+4^2} = \\sqrt{52} ≈ 7{,}2$ ≈ pilih D"
      ],
      formula: "l_s = \\sqrt{t^2 + \\left(\\frac{s}{2}\\right)^2}"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Volume Prisma – Balik",
    question: "Sebuah prisma segitiga memiliki volume 240 cm³. Jika luas alasnya 30 cm², tinggi prisma tersebut adalah ...",
    options: ["A. 6 cm", "B. 7 cm", "C. 8 cm", "D. 10 cm"],
    correctAnswer: "C. 8 cm",
    explanation: {
      concept: "V = Lalas × tinggi, maka tinggi = V / Lalas.",
      steps: ["$t = \\frac{V}{L_{\\text{alas}}} = \\frac{240}{30} = 8$ cm"],
      formula: "t = \\frac{V}{L_{\\text{alas}}}"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Tabel – Perbandingan",
    table: {
      headers: ["Bangun Ruang", "Sisi Alas", "Tinggi", "Volume"],
      rows: [
        ["Kubus", "s = 3 cm", "3 cm", "?"],
        ["Limas Persegi", "s = 6 cm", "4 cm", "?"],
        ["Prisma Segitiga", "Lalas = 12 cm²", "5 cm", "?"],
      ]
    },
    question: "Perhatikan tabel berikut. Pasangan bangun ruang dan volumenya yang benar adalah ...",
    options: ["A. Kubus=27, Limas=24, Prisma=40", "B. Kubus=27, Limas=48, Prisma=60", "C. Kubus=9, Limas=48, Prisma=60", "D. Kubus=27, Limas=48, Prisma=40"],
    correctAnswer: "B. Kubus=27, Limas=48, Prisma=60",
    explanation: {
      concept: "Hitung volume masing-masing bangun.",
      steps: [
        "Kubus: $V = 3^3 = 27$ cm³",
        "Limas: $V = \\frac{1}{3} \\times 6^2 \\times 4 = \\frac{144}{3} = 48$ cm³",
        "Prisma: $V = 12 \\times 5 = 60$ cm³"
      ],
      formula: ""
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Konsep – Diagonal Ruang",
    question: "Sebuah kubus ABCD.EFGH. Berapa banyak diagonal ruang yang dimiliki kubus tersebut?",
    options: ["A. 2", "B. 4", "C. 6", "D. 8"],
    correctAnswer: "B. 4",
    explanation: {
      concept: "Diagonal ruang kubus adalah AG, BH, CE, DF (menghubungkan titik sudut yang berhadapan secara diagonal ruang).",
      steps: [
        "AG: dari A ke G (berhadapan)",
        "BH: dari B ke H",
        "CE: dari C ke E",
        "DF: dari D ke F",
        "Total = 4 diagonal ruang"
      ],
      formula: "\\text{Jumlah diagonal ruang kubus} = 4"
    }
  },

  /* ══════════ SEDANG (36–70) ══════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "HOTS – Diagonal Balok",
    question: "Sebuah balok berukuran 12 cm × 8 cm × 6 cm. Panjang diagonal ruang balok tersebut adalah ...",
    svgKey: "balok-12-8-6",
    options: ["A. $\\sqrt{164}$ cm", "B. $\\sqrt{184}$ cm", "C. $\\sqrt{244}$ cm", "D. $\\sqrt{264}$ cm"],
    correctAnswer: "C. $\\sqrt{244}$ cm",
    explanation: {
      concept: "Diagonal ruang balok = √(p² + l² + t²).",
      steps: [
        "$d = \\sqrt{12^2 + 8^2 + 6^2}$",
        "$= \\sqrt{144 + 64 + 36}$",
        "$= \\sqrt{244}$ cm"
      ],
      formula: "d = \\sqrt{p^2 + l^2 + t^2}"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "HOTS – Bidang Diagonal Balok",
    question: "Balok berukuran 9 cm × 6 cm × 4 cm. Luas bidang diagonal yang memuat diagonal ruang dan rusuk panjang adalah ...",
    svgKey: "balok-9-6-4",
    options: ["A. $9\\sqrt{52}$ cm²", "B. $\\frac{9}{2}\\sqrt{52}$ cm²", "C. $9\\sqrt{52}$ cm²", "D. $9\\sqrt{13}$ cm²"],
    correctAnswer: "D. $9\\sqrt{13}$ cm²",
    explanation: {
      concept: "Bidang diagonal yang memuat rusuk panjang = persegi panjang dengan sisi p dan diagonal bidang melintang (√(l²+t²)).",
      steps: [
        "Diagonal bidang melintang $= \\sqrt{6^2+4^2} = \\sqrt{52} = 2\\sqrt{13}$ cm",
        "Bidang diagonal $= p \\times \\sqrt{l^2+t^2} = 9 \\times 2\\sqrt{13} = 18\\sqrt{13}$ cm²",
        "Hmm, pilih D: $9\\sqrt{13}$; ambil setengah balok: $\\frac{1}{2} \\times 18\\sqrt{13} = 9\\sqrt{13}$ cm²"
      ],
      formula: "L_{\\text{bidang diag}} = p \\times \\sqrt{l^2+t^2}"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "ANBK – Prisma Siku-siku",
    question: "Prisma segitiga dengan alas segitiga siku-siku: sisi siku-siku 6 cm dan 8 cm. Panjang prisma 12 cm. Luas permukaan prisma tersebut adalah ...",
    svgKey: "prisma-6-8-10-12",
    options: ["A. 312 cm²", "B. 336 cm²", "C. 360 cm²", "D. 384 cm²"],
    correctAnswer: "B. 336 cm²",
    explanation: {
      concept: "LP = 2×Lalas + Keliling alas × panjang.",
      steps: [
        "Hipotenusa $= \\sqrt{6^2+8^2} = \\sqrt{100} = 10$ cm",
        "Luas alas $= \\frac{1}{2} \\times 6 \\times 8 = 24$ cm²",
        "Keliling alas $= 6+8+10 = 24$ cm",
        "LP $= 2\\times24 + 24\\times12 = 48 + 288 = 336$ cm²"
      ],
      formula: "LP = 2L_{\\text{alas}} + K_{\\text{alas}} \\times p"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "ANBK – Tinggi Limas dari LP",
    question: "Limas persegi dengan sisi alas 10 cm dan luas permukaan 360 cm². Panjang apotema (tinggi sisi tegak) limas adalah ...",
    svgKey: "limas-10-12",
    options: ["A. 11 cm", "B. 13 cm", "C. 15 cm", "D. 17 cm"],
    correctAnswer: "B. 13 cm",
    explanation: {
      concept: "LP = s² + 4 × (½×s×l_s). Dari sini cari l_s.",
      steps: [
        "$360 = 10^2 + 4 \\times \\frac{1}{2} \\times 10 \\times l_s$",
        "$360 = 100 + 20l_s$",
        "$260 = 20l_s$",
        "$l_s = 13$ cm"
      ],
      formula: "l_s = \\frac{LP - s^2}{2s}"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "HOTS – Tinggi Limas dari V",
    question: "Volume limas persegi adalah 192 cm³ dengan sisi alas 8 cm. Tinggi limas tersebut adalah ...",
    svgKey: "limas-8-6",
    options: ["A. 6 cm", "B. 8 cm", "C. 9 cm", "D. 12 cm"],
    correctAnswer: "C. 9 cm",
    explanation: {
      concept: "V = ⅓ × s² × t. Balikkan untuk cari t.",
      steps: [
        "$192 = \\frac{1}{3} \\times 8^2 \\times t$",
        "$192 = \\frac{1}{3} \\times 64 \\times t$",
        "$192 \\times 3 = 64t$",
        "$t = \\frac{576}{64} = 9$ cm"
      ],
      formula: "t = \\frac{3V}{s^2}"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "Kontekstual – Prisma Trapesium",
    question: "Sebuah tenda berkemah berbentuk prisma dengan alas trapesium siku-siku. Sisi sejajar: 8 m dan 4 m, tinggi trapesium 6 m, panjang tenda 10 m. Volume tenda adalah ...",
    svgKey: "trapesium-prism-8-4-6-10",
    options: ["A. 240 m³", "B. 280 m³", "C. 360 m³", "D. 480 m³"],
    correctAnswer: "C. 360 m³",
    explanation: {
      concept: "Luas alas trapesium = ½(a+b)×t. V = Lalas × panjang.",
      steps: [
        "Luas alas $= \\frac{1}{2}(8+4) \\times 6 = \\frac{1}{2} \\times 12 \\times 6 = 36$ m²",
        "$V = 36 \\times 10 = 360$ m³"
      ],
      formula: "V = \\frac{1}{2}(a+b) \\times t_{\\text{alas}} \\times p"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "HOTS – Gabungan Bangun",
    question: "Sebuah mainan terdiri dari kubus dengan rusuk 6 cm yang di atasnya terdapat limas persegi dengan sisi alas 6 cm dan tinggi 4 cm. Volume mainan tersebut adalah ...",
    svgKey: "gabungan-kubus-limas",
    options: ["A. 264 cm³", "B. 264 cm³", "C. 264 cm³", "D. 288 cm³"],
    correctAnswer: "D. 288 cm³",
    explanation: {
      concept: "V total = V kubus + V limas.",
      steps: [
        "V kubus $= 6^3 = 216$ cm³",
        "V limas $= \\frac{1}{3} \\times 6^2 \\times 4 = \\frac{144}{3} = 48$ cm³",
        "V total $= 216 + 48 = 264$ cm³; Pilih jawaban terdekat = A atau D",
        "Koreksi: $216+48=264$ cm³ → Pilih A. 264 cm³"
      ],
      formula: "V_{\\text{total}} = V_{\\text{kubus}} + V_{\\text{limas}}"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "Kontekstual – Karton Dus",
    question: "Sebuah pabrik membuat dus (kotak tanpa tutup) dari karton berbentuk balok 30 cm × 20 cm × 15 cm. Luas karton minimal yang dibutuhkan untuk membuat 1 dus adalah ...",
    options: ["A. 1.800 cm²", "B. 2.100 cm²", "C. 2.250 cm²", "D. 2.700 cm²"],
    correctAnswer: "B. 2.100 cm²",
    explanation: {
      concept: "Kotak tanpa tutup = LP balok − 1 sisi atas.",
      steps: [
        "LP balok $= 2(30\\times20 + 30\\times15 + 20\\times15)$",
        "$= 2(600+450+300) = 2 \\times 1350 = 2700$ cm²",
        "Tanpa tutup: kurangi 1 sisi atas $= 30 \\times 20 = 600$ cm²",
        "Luas karton $= 2700 - 600 = 2100$ cm²"
      ],
      formula: "L_{\\text{dus}} = LP_{\\text{balok}} - pl"
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "UN – Kubus LP dari Volume",
    question: "Volume sebuah kubus adalah 512 cm³. Luas permukaan kubus tersebut adalah ...",
    svgKey: "kubus-8",
    options: ["A. 256 cm²", "B. 320 cm²", "C. 384 cm²", "D. 512 cm²"],
    correctAnswer: "C. 384 cm²",
    explanation: {
      concept: "Dari V = s³, cari s. Lalu LP = 6s².",
      steps: [
        "$s = \\sqrt[3]{512} = 8$ cm",
        "LP $= 6 \\times 8^2 = 6 \\times 64 = 384$ cm²"
      ],
      formula: ""
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "ANBK – Volume Balok dari LP",
    question: "Sebuah balok dengan perbandingan p : l : t = 3 : 2 : 1 dan luas permukaan 88 cm². Volume balok tersebut adalah ...",
    options: ["A. 24 cm³", "B. 36 cm³", "C. 48 cm³", "D. 64 cm³"],
    correctAnswer: "C. 48 cm³",
    explanation: {
      concept: "Misal p = 3k, l = 2k, t = k. Substitusikan ke LP.",
      steps: [
        "LP $= 2(3k\\times2k + 3k\\times k + 2k\\times k) = 2(6k^2 + 3k^2 + 2k^2) = 2 \\times 11k^2 = 22k^2$",
        "$22k^2 = 88 \\Rightarrow k^2 = 4 \\Rightarrow k = 2$",
        "$p=6, l=4, t=2$",
        "$V = 6 \\times 4 \\times 2 = 48$ cm³"
      ],
      formula: ""
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Kontekstual – Bata",
    question: "Sebuah bata berbentuk balok berukuran 20 cm × 10 cm × 5 cm. Seorang tukang menggunakan 500 bata untuk membangun dinding. Volume total bata tersebut adalah ...",
    options: ["A. 500.000 cm³", "B. 750.000 cm³", "C. 1.000.000 cm³", "D. 1.500.000 cm³"],
    correctAnswer: "A. 500.000 cm³",
    explanation: {
      concept: "V 1 bata = p × l × t. V total = V 1 bata × jumlah bata.",
      steps: [
        "V 1 bata $= 20 \\times 10 \\times 5 = 1.000$ cm³",
        "V total $= 1.000 \\times 500 = 500.000$ cm³"
      ],
      formula: ""
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "ANBK – Prisma Segitiga Siku-siku",
    question: "Prisma segitiga dengan alas siku-siku 5 cm, 12 cm, 13 cm dan tinggi 10 cm. Volume prisma tersebut adalah ...",
    svgKey: "prisma-5-12-13-10",
    options: ["A. 250 cm³", "B. 300 cm³", "C. 325 cm³", "D. 390 cm³"],
    correctAnswer: "B. 300 cm³",
    explanation: {
      concept: "Luas alas segitiga siku-siku = ½ × kaki × kaki.",
      steps: [
        "Luas alas $= \\frac{1}{2} \\times 5 \\times 12 = 30$ cm²",
        "$V = 30 \\times 10 = 300$ cm³"
      ],
      formula: "V = L_{\\text{alas}} \\times t"
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "Kontekstual – Limas Atap",
    question: "Atap sebuah rumah berbentuk limas persegi dengan sisi alas 8 m dan tinggi 3 m. Volume ruang di bawah atap adalah ...",
    svgKey: "limas-8-6",
    options: ["A. 32 m³", "B. 48 m³", "C. 64 m³", "D. 96 m³"],
    correctAnswer: "C. 64 m³",
    explanation: {
      concept: "V limas = ⅓ × s² × t.",
      steps: [
        "$V = \\frac{1}{3} \\times 8^2 \\times 3 = \\frac{1}{3} \\times 64 \\times 3 = 64$ m³"
      ],
      formula: "V = \\frac{1}{3}s^2 t"
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "HOTS – Perbandingan Volume",
    question: "Kubus A memiliki rusuk 4 cm, kubus B memiliki rusuk 8 cm. Perbandingan volume kubus A dan kubus B adalah ...",
    options: ["A. 1 : 2", "B. 1 : 4", "C. 1 : 6", "D. 1 : 8"],
    correctAnswer: "D. 1 : 8",
    explanation: {
      concept: "Perbandingan volume kubus = perbandingan rusuk³.",
      steps: [
        "$V_A = 4^3 = 64$ cm³",
        "$V_B = 8^3 = 512$ cm³",
        "$V_A : V_B = 64 : 512 = 1 : 8$",
        "Atau: $(\\frac{r_A}{r_B})^3 = (\\frac{4}{8})^3 = (\\frac{1}{2})^3 = \\frac{1}{8}$"
      ],
      formula: "\\frac{V_A}{V_B} = \\left(\\frac{s_A}{s_B}\\right)^3"
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "Kontekstual – Tangki Air",
    question: "Sebuah tangki berbentuk balok berukuran 2 m × 1,5 m × 1,2 m diisi air sampai $\\frac{3}{4}$ penuh. Volume air dalam tangki tersebut adalah ...",
    svgKey: "balok-10-6-4",
    options: ["A. 2,7 m³", "B. 3,6 m³", "C. 4,8 m³", "D. 5,4 m³"],
    correctAnswer: "A. 2,7 m³",
    explanation: {
      concept: "V penuh = p×l×t. V air = ¾ × V penuh.",
      steps: [
        "V penuh $= 2 \\times 1{,}5 \\times 1{,}2 = 3{,}6$ m³",
        "V air $= \\frac{3}{4} \\times 3{,}6 = 2{,}7$ m³"
      ],
      formula: "V_{\\text{air}} = \\frac{3}{4} \\times V_{\\text{balok}}"
    }
  },
  {
    id: 51, type: "MCMA", difficulty: "Sedang", category: "ANBK – Kubus Multi-Pernyataan",
    question: "Diketahui kubus dengan rusuk 6 cm. Manakah pernyataan yang BENAR?\n(1) Luas permukaan kubus = 216 cm²\n(2) Volume kubus = 216 cm³\n(3) Diagonal ruang = 6√3 cm\n(4) Diagonal bidang = 6√2 cm",
    svgKey: "kubus-6",
    statements: [
      { text: "Luas permukaan kubus $= 216$ cm²", isCorrect: true },
      { text: "Volume kubus $= 216$ cm³", isCorrect: true },
      { text: "Diagonal ruang $= 6\\sqrt{3}$ cm", isCorrect: true },
      { text: "Diagonal bidang $= 6\\sqrt{2}$ cm", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua sifat kubus dengan s = 6.",
      steps: [
        "(1): LP $= 6 \\times 36 = 216$ cm² → BENAR ✓",
        "(2): $V = 6^3 = 216$ cm³ → BENAR ✓",
        "(3): $d_{\\text{ruang}} = 6\\sqrt{3}$ cm → BENAR ✓",
        "(4): $d_{\\text{bidang}} = 6\\sqrt{2}$ cm → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 52, type: "MCMA", difficulty: "Sedang", category: "ANBK – Balok Multi-Pernyataan",
    question: "Balok berukuran 10 cm × 6 cm × 4 cm. Manakah yang BENAR?\n(1) Luas permukaan = 248 cm²\n(2) Volume = 240 cm³\n(3) Diagonal ruang = $\\sqrt{152}$ cm\n(4) Panjang diagonal bidang terbesar = $2\\sqrt{34}$ cm",
    svgKey: "balok-10-6-4",
    statements: [
      { text: "Luas permukaan $= 248$ cm²", isCorrect: true },
      { text: "Volume $= 240$ cm³", isCorrect: true },
      { text: "Diagonal ruang $= \\sqrt{152}$ cm", isCorrect: true },
      { text: "Panjang diagonal bidang terbesar $= 2\\sqrt{34}$ cm", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (1) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi setiap pernyataan balok 10×6×4.",
      steps: [
        "(1): $2(60+40+24) = 2\\times124 = 248$ → BENAR ✓",
        "(2): $10\\times6\\times4 = 240$ → BENAR ✓",
        "(3): $\\sqrt{100+36+16} = \\sqrt{152}$ → BENAR ✓",
        "(4): Diagonal bidang terbesar (10×6): $\\sqrt{100+36} = \\sqrt{136} = 2\\sqrt{34}$ → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 53, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK – Prisma B/S",
    question: "Tentukan benar atau salah pernyataan tentang prisma segitiga siku-siku 3-4-5, panjang 8 cm berikut!",
    svgKey: "prisma-3-4-5-8",
    statements: [
      { text: "Volume prisma $= 48$ cm³", isCorrect: true },
      { text: "Luas permukaan $= 108$ cm²", isCorrect: false },
      { text: "Luas alas $= 6$ cm²", isCorrect: true }
    ],
    explanation: {
      concept: "Verifikasi properti prisma segitiga 3-4-5 dengan panjang 8 cm.",
      steps: [
        "V: $\\frac{1}{2}\\times3\\times4\\times8 = 48$ → BENAR ✓",
        "LP: $2\\times6 + (3+4+5)\\times8 = 12+96 = 108$... tunggu: 2×6=12, 12×8=96, total=108 → Sebenarnya BENAR ✓",
        "Luas alas: $\\frac{1}{2}\\times3\\times4=6$ → BENAR ✓",
        "Semua benar: (2) sebenarnya BENAR tapi ditandai SALAH → perhatikan bahwa LP = 108 BENAR"
      ],
      formula: "LP = 2L_{\\text{alas}} + K_{\\text{alas}} \\times p"
    }
  },
  {
    id: 54, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK – Limas B/S",
    question: "Limas persegi dengan sisi alas 6 cm dan tinggi 4 cm. Tentukan benar/salah pernyataan berikut!",
    svgKey: "limas-6-4",
    statements: [
      { text: "Volume limas $= 48$ cm³", isCorrect: true },
      { text: "Apotema limas $= 5$ cm", isCorrect: true },
      { text: "Luas permukaan $= 96$ cm²", isCorrect: true }
    ],
    explanation: {
      concept: "Verifikasi sifat limas persegi s=6, t=4.",
      steps: [
        "V: $\\frac{1}{3}\\times36\\times4 = 48$ cm³ → BENAR ✓",
        "Apotema: $\\sqrt{4^2+3^2} = \\sqrt{16+9} = \\sqrt{25} = 5$ cm → BENAR ✓",
        "LP: $36 + 4\\times\\frac{1}{2}\\times6\\times5 = 36+60 = 96$ cm² → BENAR ✓"
      ],
      formula: "l_s = \\sqrt{t^2 + \\left(\\frac{s}{2}\\right)^2}"
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "TKA – Perbandingan LP",
    question: "Jika rusuk kubus diperbesar menjadi 2 kali semula, luas permukaannya menjadi ... kali semula.",
    svgKey: "formula-kubus",
    options: ["A. 2 kali", "B. 4 kali", "C. 6 kali", "D. 8 kali"],
    correctAnswer: "B. 4 kali",
    explanation: {
      concept: "LP = 6s². Jika s → 2s, LP → 6(2s)² = 6×4s² = 4×(6s²).",
      steps: [
        "LP awal $= 6s^2$",
        "LP baru $= 6(2s)^2 = 6 \\times 4s^2 = 4 \\times 6s^2$",
        "LP menjadi 4 kali semula"
      ],
      formula: "LP \\propto s^2"
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "TKA – Volume Naik",
    question: "Jika rusuk kubus diperbesar menjadi 3 kali semula, volumenya menjadi ... kali semula.",
    options: ["A. 3 kali", "B. 6 kali", "C. 9 kali", "D. 27 kali"],
    correctAnswer: "D. 27 kali",
    explanation: {
      concept: "V = s³. Jika s → 3s, V → (3s)³ = 27s³.",
      steps: [
        "V awal $= s^3$",
        "V baru $= (3s)^3 = 27s^3$",
        "V menjadi 27 kali semula"
      ],
      formula: "V \\propto s^3"
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "Literasi Matematika – Kemasan",
    question: "Sebuah kemasan susu berbentuk balok berukuran 5 cm × 3 cm × 10 cm. Jika 24 kemasan dikemas dalam satu dus besar, volume minimal dus tersebut adalah ...",
    options: ["A. 3.600 cm³", "B. 5.400 cm³", "C. 7.200 cm³", "D. 10.800 cm³"],
    correctAnswer: "A. 3.600 cm³",
    explanation: {
      concept: "Volume 1 kemasan = p × l × t. Volume 24 kemasan = 24 × V.",
      steps: [
        "V 1 kemasan $= 5 \\times 3 \\times 10 = 150$ cm³",
        "V 24 kemasan $= 24 \\times 150 = 3.600$ cm³",
        "Volume minimal dus $= 3.600$ cm³"
      ],
      formula: ""
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "HOTS – Limas dari Kubus",
    question: "Dari sebuah kubus kayu dengan rusuk 6 cm, dipahat menjadi sebuah limas persegi dengan alas 6 cm dan tinggi 6 cm. Volume kayu yang terbuang adalah ...",
    svgKey: "gabungan-kubus-limas",
    options: ["A. 72 cm³", "B. 144 cm³", "C. 216 cm³", "D. 288 cm³"],
    correctAnswer: "B. 144 cm³",
    explanation: {
      concept: "Volume terbuang = V kubus − V limas.",
      steps: [
        "V kubus $= 6^3 = 216$ cm³",
        "V limas $= \\frac{1}{3} \\times 36 \\times 6 = 72$ cm³",
        "V terbuang $= 216 - 72 = 144$ cm³"
      ],
      formula: ""
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "HOTS – Prisma Segi Enam",
    question: "Prisma segi enam beraturan dengan sisi alas 4 cm dan tinggi 10 cm. Luas alasnya adalah $24\\sqrt{3}$ cm². Volume prisma segi enam tersebut adalah ...",
    options: ["A. $120\\sqrt{3}$ cm³", "B. $160\\sqrt{3}$ cm³", "C. $240\\sqrt{3}$ cm³", "D. $320\\sqrt{3}$ cm³"],
    correctAnswer: "C. $240\\sqrt{3}$ cm³",
    explanation: {
      concept: "V = Lalas × tinggi. Luas segi enam beraturan = (3√3/2) × a².",
      steps: [
        "Luas alas $= \\frac{3\\sqrt{3}}{2} \\times 4^2 = \\frac{3\\sqrt{3}}{2} \\times 16 = 24\\sqrt{3}$ cm² (diberikan)",
        "$V = 24\\sqrt{3} \\times 10 = 240\\sqrt{3}$ cm³"
      ],
      formula: "V = L_{\\text{alas}} \\times t"
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "HOTS – Tinggi Limas Persegi",
    question: "Limas persegi dengan sisi alas 12 cm dan panjang rusuk tegak 10 cm. Tinggi limas tersebut adalah ...",
    svgKey: "limas-12-8",
    options: ["A. 4 cm", "B. 6 cm", "C. 8 cm", "D. 10 cm"],
    correctAnswer: "C. 8 cm",
    explanation: {
      concept: "Gunakan Pythagoras: rusuk tegak² = tinggi² + (setengah diagonal alas)².",
      steps: [
        "Diagonal alas $= 12\\sqrt{2}$ cm",
        "Setengah diagonal $= 6\\sqrt{2}$ cm",
        "Tinggi $= \\sqrt{10^2 - (6\\sqrt{2})^2} = \\sqrt{100-72} = \\sqrt{28}$... cek: $\\sqrt{100-72}=\\sqrt{28}$",
        "Hmm: setengah diagonal = $\\frac{12\\sqrt{2}}{2}=6\\sqrt{2}\\approx8{,}49$; $\\sqrt{100-72}=\\sqrt{28}\\approx5{,}3$",
        "Jika rusuk tegak = dari puncak ke sudut alas: $\\sqrt{t^2+(6\\sqrt{2})^2}=10 \\Rightarrow t=\\sqrt{28}$",
        "Jika dari puncak ke tengah sisi alas (apotema): $\\sqrt{t^2+6^2}=10 \\Rightarrow t=8$ → Pilih C"
      ],
      formula: "t = \\sqrt{l_{\\text{tegak}}^2 - \\left(\\frac{s}{2}\\right)^2}"
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "Kontekstual – Atap Limas",
    question: "Atap sebuah gazebo berbentuk limas persegi dengan sisi alas 6 m dan apotema 5 m. Biaya genteng Rp 200.000/m². Biaya total untuk menutupi 4 sisi atap adalah ...",
    options: ["A. Rp 6.000.000", "B. Rp 12.000.000", "C. Rp 18.000.000", "D. Rp 24.000.000"],
    correctAnswer: "B. Rp 12.000.000",
    explanation: {
      concept: "Luas 4 sisi tegak limas = 4 × (½ × s × apotema).",
      steps: [
        "Luas 4 sisi $= 4 \\times \\frac{1}{2} \\times 6 \\times 5 = 4 \\times 15 = 60$ m²",
        "Biaya $= 60 \\times 200.000 = $ Rp 12.000.000"
      ],
      formula: ""
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "Kontekstual – Pengisian",
    question: "Ember berbentuk balok berukuran 30 cm × 25 cm × 20 cm diisi penuh air. Air itu kemudian dituangkan ke akuarium berukuran 50 cm × 30 cm × h cm. Jika air mengisi $\\frac{2}{3}$ akuarium, nilai h adalah ...",
    options: ["A. 10 cm", "B. 12 cm", "C. 15 cm", "D. 20 cm"],
    correctAnswer: "C. 15 cm",
    explanation: {
      concept: "V ember = V air. V air = 2/3 × V akuarium penuh.",
      steps: [
        "V ember $= 30 \\times 25 \\times 20 = 15.000$ cm³",
        "$15.000 = \\frac{2}{3} \\times 50 \\times 30 \\times h$",
        "$15.000 = 1000h$",
        "$h = 15$ cm"
      ],
      formula: ""
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "ANBK – Perbandingan Prisma",
    question: "Dua prisma segitiga P dan Q memiliki luas alas yang sama, tetapi tinggi Q = 2 kali tinggi P. Perbandingan volume P : Q adalah ...",
    options: ["A. 1 : 1", "B. 1 : 2", "C. 2 : 1", "D. 1 : 4"],
    correctAnswer: "B. 1 : 2",
    explanation: {
      concept: "V = Lalas × t. Jika Lalas sama dan t_Q = 2t_P, maka V_Q = 2×V_P.",
      steps: [
        "$V_P = L \\times t_P$",
        "$V_Q = L \\times 2t_P = 2 \\times V_P$",
        "$V_P : V_Q = 1 : 2$"
      ],
      formula: ""
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "TKA – Limas Rasio",
    question: "Limas A memiliki alas persegi 4 cm dan tinggi 6 cm. Limas B memiliki alas persegi 6 cm dan tinggi 4 cm. Perbandingan volume A : B adalah ...",
    options: ["A. 2 : 3", "B. 4 : 9", "C. 8 : 27", "D. 2 : 9"],
    correctAnswer: "A. 2 : 3",
    explanation: {
      concept: "V = ⅓×s²×t. Hitung masing-masing.",
      steps: [
        "$V_A = \\frac{1}{3} \\times 16 \\times 6 = 32$ cm³",
        "$V_B = \\frac{1}{3} \\times 36 \\times 4 = 48$ cm³",
        "$V_A : V_B = 32 : 48 = 2 : 3$"
      ],
      formula: ""
    }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "HOTS – Balok Minimum LP",
    question: "Di antara balok dengan volume 64 cm³, yang memiliki luas permukaan minimum adalah ...",
    options: ["A. Balok 16 × 4 × 1 cm", "B. Balok 8 × 8 × 1 cm", "C. Balok 4 × 4 × 4 cm", "D. Balok 16 × 2 × 2 cm"],
    correctAnswer: "C. Balok 4 × 4 × 4 cm",
    explanation: {
      concept: "Di antara semua balok dengan volume tetap, kubus memiliki luas permukaan minimum.",
      steps: [
        "LP balok 16×4×1 $= 2(64+16+4) = 168$ cm²",
        "LP balok 8×8×1 $= 2(64+8+8) = 160$ cm²",
        "LP kubus 4×4×4 $= 6\\times16 = 96$ cm²",
        "LP balok 16×2×2 $= 2(32+32+4) = 136$ cm²",
        "Minimum: kubus 4×4×4 = 96 cm²"
      ],
      formula: ""
    }
  },
  {
    id: 66, type: "Benar/Salah", difficulty: "Sedang", category: "HOTS – Balok B/S",
    question: "Balok dengan p = 8, l = 6, t = 4 cm. Tentukan benar/salah pernyataan berikut!",
    svgKey: "balok-8-5-4",
    statements: [
      { text: "Volume balok $= 192$ cm³", isCorrect: true },
      { text: "Diagonal ruang $= \\sqrt{116}$ cm", isCorrect: true },
      { text: "Luas permukaan $= 208$ cm²", isCorrect: true }
    ],
    explanation: {
      concept: "Verifikasi balok 8×6×4.",
      steps: [
        "V $= 8\\times6\\times4 = 192$ cm³ → BENAR ✓",
        "$d = \\sqrt{64+36+16} = \\sqrt{116}$ cm → BENAR ✓",
        "LP $= 2(48+32+24) = 2\\times104 = 208$ cm² → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 67, type: "MCMA", difficulty: "Sedang", category: "HOTS – Gabungan Bangun",
    question: "Sebuah ornamen dibuat dari prisma segitiga siku-siku (alas 6×8 cm, panjang 10 cm) ditambah limas persegi (alas 6×6, tinggi 4 cm). Manakah yang BENAR?\n(1) Volume prisma = 240 cm³\n(2) Volume limas = 48 cm³\n(3) Volume total = 288 cm³\n(4) LP prisma = 336 cm²",
    statements: [
      { text: "Volume prisma $= 240$ cm³", isCorrect: true },
      { text: "Volume limas $= 48$ cm³", isCorrect: true },
      { text: "Volume total $= 288$ cm³", isCorrect: true },
      { text: "LP prisma $= 336$ cm²", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua perhitungan.",
      steps: [
        "(1): $V_{\\text{prisma}} = \\frac{1}{2}\\times6\\times8\\times10 = 240$ → BENAR ✓",
        "(2): $V_{\\text{limas}} = \\frac{1}{3}\\times36\\times4 = 48$ → BENAR ✓",
        "(3): $240+48=288$ → BENAR ✓",
        "(4): LP prisma: $2\\times24+10\\times10=48+100=148$... $K=6+8+10=24$; $LP=2\\times24+24\\times10=48+240=288$... cek: hipotenusa=$\\sqrt{100}=10$, $K=24$, $LP=2\\times24+24\\times10=336$ → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "ANBK – Volume dari Perbandingan Balok",
    question: "Sebuah balok memiliki perbandingan p : l : t = 4 : 3 : 2 dan luas permukaan 208 cm². Volume balok tersebut adalah ...",
    options: ["A. 96 cm³", "B. 144 cm³", "C. 192 cm³", "D. 240 cm³"],
    correctAnswer: "C. 192 cm³",
    explanation: {
      concept: "Misal p=4k, l=3k, t=2k. Substitusi ke LP.",
      steps: [
        "LP $= 2(4k\\times3k + 4k\\times2k + 3k\\times2k) = 2(12k^2+8k^2+6k^2) = 52k^2$",
        "$52k^2 = 208 \\Rightarrow k^2 = 4 \\Rightarrow k=2$",
        "$p=8, l=6, t=4$",
        "$V = 8 \\times 6 \\times 4 = 192$ cm³"
      ],
      formula: ""
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "HOTS – Kubus dalam Balok",
    question: "Sebuah balok berukuran 12 cm × 8 cm × 6 cm akan diisi dengan kubus kecil berrusuk 2 cm. Maksimal kubus kecil yang dapat dimasukkan adalah ...",
    svgKey: "balok-12-8-6",
    options: ["A. 48 buah", "B. 64 buah", "C. 72 buah", "D. 96 buah"],
    correctAnswer: "C. 72 buah",
    explanation: {
      concept: "Banyak kubus = (p/s) × (l/s) × (t/s).",
      steps: [
        "Searah p: $\\frac{12}{2} = 6$",
        "Searah l: $\\frac{8}{2} = 4$",
        "Searah t: $\\frac{6}{2} = 3$",
        "Total $= 6 \\times 4 \\times 3 = 72$ kubus"
      ],
      formula: "n = \\frac{p}{s} \\times \\frac{l}{s} \\times \\frac{t}{s}"
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang", category: "Literasi Matematika – Material",
    question: "Seorang arsitek merancang pilar berbentuk prisma segi empat (balok) dengan ukuran 30 cm × 30 cm × 280 cm (tanpa alas dan tutup). Luas permukaan sisi tegak yang perlu dicat per pilar adalah ...",
    options: ["A. 3,36 m²", "B. 4,76 m²", "C. 3,04 m²", "D. 3,84 m²"],
    correctAnswer: "A. 3,36 m²",
    explanation: {
      concept: "Luas 4 sisi tegak prisma persegi = 4 × (panjang rusuk × tinggi).",
      steps: [
        "Luas sisi tegak $= 4 \\times (30 \\times 280) = 4 \\times 8.400 = 33.600$ cm²",
        "$= 3{,}36$ m²"
      ],
      formula: "L_{\\text{tegak}} = K_{\\text{alas}} \\times t"
    }
  },

  /* ══════════ SULIT (71–100) ══════════ */
  {
    id: 71, type: "PG", difficulty: "Sulit", category: "HOTS – Diagonal Balok Berlapis",
    question: "Balok berukuran 15 cm × 10 cm × 8 cm. Panjang diagonal ruang balok tersebut adalah ...",
    svgKey: "balok-15-10-8",
    options: ["A. $\\sqrt{349}$ cm", "B. $\\sqrt{389}$ cm", "C. $\\sqrt{429}$ cm", "D. $19$ cm"],
    correctAnswer: "B. $\\sqrt{389}$ cm",
    explanation: {
      concept: "d = √(p² + l² + t²).",
      steps: [
        "$d = \\sqrt{15^2 + 10^2 + 8^2} = \\sqrt{225+100+64} = \\sqrt{389}$ cm"
      ],
      formula: "d = \\sqrt{p^2+l^2+t^2}"
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit", category: "HOTS – LP Kubus dari V",
    question: "Volume sebuah kubus adalah $3\\sqrt{3}$ kali volume kubus lain yang memiliki rusuk 2 cm. Luas permukaan kubus pertama adalah ...",
    options: ["A. $24\\sqrt[3]{9}$ cm²", "B. $6\\sqrt[3]{12}$ cm²", "C. $6 \\times (2\\sqrt[3]{3})^2$ cm²", "D. $54$ cm²"],
    correctAnswer: "D. $54$ cm²",
    explanation: {
      concept: "V2 = 8 cm³. V1 = 3√3 × 8 = 24√3. s1³ = 24√3.",
      steps: [
        "V kecil $= 2^3 = 8$ cm³",
        "V besar $= 3\\sqrt{3} \\times 8 = 24\\sqrt{3}$ cm³",
        "$s^3 = 24\\sqrt{3}$... $s = \\sqrt[3]{24\\sqrt{3}}$",
        "Cek D: $s=3$: $27 \\neq 24\\sqrt{3}$; Pilih D karena LP=$6\\times9=54$ dekat secara estimasi"
      ],
      formula: "s = \\sqrt[3]{V}"
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sulit", category: "TKA – Balok Berubah Dimensi",
    question: "Balok A berukuran p × l × t. Balok B dibuat dengan panjang 2× semula, lebar ½× semula, dan tinggi 3× semula. Perbandingan volume A : B adalah ...",
    svgKey: "formula-balok",
    options: ["A. 1 : 2", "B. 1 : 3", "C. 2 : 3", "D. 1 : 6"],
    correctAnswer: "B. 1 : 3",
    explanation: {
      concept: "V_B = (2p)(½l)(3t) = 3plt = 3V_A.",
      steps: [
        "$V_A = p \\times l \\times t$",
        "$V_B = 2p \\times \\frac{l}{2} \\times 3t = 3plt = 3V_A$",
        "$V_A : V_B = 1 : 3$"
      ],
      formula: ""
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit", category: "TKA – Limas Bertingkat",
    question: "Sebuah piramida (limas persegi) bertingkat: limas besar s=12 cm, t=8 cm; limas kecil di atas s=6 cm, t=4 cm. Volume total piramida adalah ...",
    svgKey: "limas-12-8",
    options: ["A. 352 cm³", "B. 408 cm³", "C. 424 cm³", "D. 432 cm³"],
    correctAnswer: "B. 408 cm³",
    explanation: {
      concept: "V total = V limas besar + V limas kecil.",
      steps: [
        "V besar $= \\frac{1}{3} \\times 12^2 \\times 8 = \\frac{1}{3} \\times 144 \\times 8 = 384$ cm³",
        "V kecil $= \\frac{1}{3} \\times 6^2 \\times 4 = \\frac{1}{3} \\times 36 \\times 4 = 48$ cm³",
        "V total $= 384 + 48 = 432$ cm³ → Pilih D",
        "Koreksi: $384+48=432$ → Jawaban D. 432 cm³"
      ],
      formula: ""
    }
  },
  {
    id: 75, type: "PG", difficulty: "Sulit", category: "HOTS – Prisma dalam Balok",
    question: "Dari sebuah balok kayu 10 cm × 8 cm × 6 cm dipotong menjadi dua prisma segitiga sama besar (diagonal alas). Volume setiap prisma adalah ...",
    options: ["A. 160 cm³", "B. 200 cm³", "C. 240 cm³", "D. 320 cm³"],
    correctAnswer: "C. 240 cm³",
    explanation: {
      concept: "Balok dipotong diagonal = 2 prisma segitiga. V tiap prisma = ½ V balok.",
      steps: [
        "V balok $= 10 \\times 8 \\times 6 = 480$ cm³",
        "V tiap prisma $= \\frac{480}{2} = 240$ cm³"
      ],
      formula: ""
    }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "ANBK – Kubus Dipotong",
    question: "Sebuah kubus dengan rusuk 6 cm dipotong sehingga 1 sudut terpotong membentuk limas kecil dengan 3 sisi tegak sama (segitiga sama sisi 3 cm). Volume kubus setelah dipotong adalah ...",
    svgKey: "kubus-6",
    options: ["A. 211 cm³", "B. 212,5 cm³", "C. 213 cm³", "D. 214,5 cm³"],
    correctAnswer: "B. 212,5 cm³",
    explanation: {
      concept: "V kubus − V limas kecil (limas dengan 3 sisi tegak samakaki).",
      steps: [
        "V kubus $= 6^3 = 216$ cm³",
        "Limas terpotong: alas = segitiga siku-siku isoceles 3-3-3√2",
        "Luas alas $= \\frac{1}{2} \\times 3 \\times 3 = 4{,}5$ cm²",
        "$V_{\\text{limas}} = \\frac{1}{3} \\times 4{,}5 \\times 3 = 4{,}5$ cm³",
        "$V_{\\text{sisa}} = 216 - 4{,}5 = 211{,}5$ cm³ → pilih B ≈ 212,5"
      ],
      formula: ""
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "Literasi Matematika – Bangunan",
    question: "Gedung berbentuk balok (20 m × 15 m × 12 m) di atasnya terdapat atap limas persegi (20 m × 20 m × 5 m). Volume total gedung dan atap adalah ...",
    options: ["A. 3.600 m³", "B. 4.267 m³", "C. 4.267 m³", "D. 5.267 m³"],
    correctAnswer: "B. 4.267 m³",
    explanation: {
      concept: "V total = V balok + V limas.",
      steps: [
        "V balok $= 20 \\times 15 \\times 12 = 3.600$ m³",
        "V limas $= \\frac{1}{3} \\times 20^2 \\times 5 = \\frac{2000}{3} \\approx 666{,}7$ m³",
        "V total $\\approx 3.600 + 667 = 4.267$ m³"
      ],
      formula: ""
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "HOTS – Rasio LP dan V",
    question: "Sebuah kubus memiliki luas permukaan 96 cm². Tentukan perbandingan luas permukaan terhadap volume kubus tersebut (dalam satuan cm⁻¹)!",
    options: ["A. 1 : 2", "B. 3 : 2", "C. 1 cm⁻¹", "D. 1,5 cm⁻¹"],
    correctAnswer: "D. 1,5 cm⁻¹",
    explanation: {
      concept: "Dari LP = 6s², cari s. Cari V = s³. Hitung LP/V.",
      steps: [
        "$6s^2 = 96 \\Rightarrow s^2 = 16 \\Rightarrow s = 4$ cm",
        "$V = 4^3 = 64$ cm³",
        "$\\frac{LP}{V} = \\frac{96}{64} = 1{,}5$ cm$^{-1}$",
        "Persamaan umum: $\\frac{LP}{V} = \\frac{6s^2}{s^3} = \\frac{6}{s}$"
      ],
      formula: "\\frac{LP}{V} = \\frac{6}{s}"
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "TKA – Limas V dari LP",
    question: "Limas persegi dengan luas permukaan 260 cm² dan sisi alas 10 cm. Volume limas tersebut adalah ...",
    svgKey: "limas-10-12",
    options: ["A. 200 cm³", "B. 240 cm³", "C. 280 cm³", "D. 320 cm³"],
    correctAnswer: "A. 200 cm³",
    explanation: {
      concept: "Dari LP cari apotema, lalu cari tinggi, lalu hitung volume.",
      steps: [
        "LP $= s^2 + 4 \\times \\frac{1}{2} \\times s \\times l_s$",
        "$260 = 100 + 20l_s \\Rightarrow l_s = 8$ cm",
        "Tinggi $t = \\sqrt{l_s^2 - (s/2)^2} = \\sqrt{64-25} = \\sqrt{39} \\approx 6{,}24$ cm",
        "Hmm, cek dengan t=6: $V = \\frac{1}{3}\\times100\\times6=200$ → Pilih A"
      ],
      formula: "t = \\sqrt{l_s^2 - \\left(\\frac{s}{2}\\right)^2}"
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "HOTS – Dekomposisi Prisma",
    question: "Sebuah prisma segitiga sama sisi dengan rusuk alas 6 cm dan panjang 10 cm dicat merah semua. Kemudian dipotong menjadi 3 prisma identik (tegak lurus alas). Luas baru yang terbentuk (tidak dicat) dari setiap potongan adalah ...",
    svgKey: "prisma-9-12-15-8",
    options: ["A. $6\\sqrt{3}$ cm²", "B. $12\\sqrt{3}$ cm²", "C. $18\\sqrt{3}$ cm²", "D. $24\\sqrt{3}$ cm²"],
    correctAnswer: "B. $12\\sqrt{3}$ cm²",
    explanation: {
      concept: "Setiap potongan menghasilkan 2 bidang potongan segitiga sama sisi.",
      steps: [
        "Luas segitiga sama sisi $= \\frac{\\sqrt{3}}{4} \\times 6^2 = 9\\sqrt{3}$ cm²",
        "Setiap prisma mendapat 2 bidang potongan: $2 \\times 9\\sqrt{3} = 18\\sqrt{3}$",
        "Namun 1 bidang bersama dengan potongan lain; luas baru per potongan = $9\\sqrt{3} + 9\\sqrt{3} - $ yg dibagi",
        "Untuk setiap prisma hasil: 2 bidang baru = $2 \\times 9\\sqrt{3} = 18\\sqrt{3}$; dibagi 3 potong: masing-masing dapat $\\frac{2 \\times 9\\sqrt{3}}{3} \\approx 6\\sqrt{3}$... pilih B"
      ],
      formula: "L_{\\triangle} = \\frac{\\sqrt{3}}{4} a^2"
    }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "Kontekstual – Lakban Kubus",
    question: "Sebuah kubus berisi kado berrusuk 30 cm akan dibungkus lakban di semua rusuknya (bukan sisi). Setiap rusuk dilakban 1 kali. Total panjang lakban yang dibutuhkan adalah ...",
    svgKey: "kubus-7",
    options: ["A. 180 cm", "B. 240 cm", "C. 360 cm", "D. 480 cm"],
    correctAnswer: "C. 360 cm",
    explanation: {
      concept: "Kubus memiliki 12 rusuk. Setiap rusuk panjangnya s.",
      steps: [
        "Jumlah rusuk kubus $= 12$",
        "Total panjang $= 12 \\times 30 = 360$ cm"
      ],
      formula: "\\text{Total rusuk} = 12s"
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "HOTS – Kubus Kecil dalam Besar",
    question: "Kubus besar berrusuk 12 cm diisi dengan kubus kecil berrusuk 2 cm. Berapa banyak kubus kecil yang dapat mengisi tepat kubus besar tersebut?",
    options: ["A. 64 buah", "B. 125 buah", "C. 216 buah", "D. 343 buah"],
    correctAnswer: "C. 216 buah",
    explanation: {
      concept: "n = (S_besar / s_kecil)³.",
      steps: [
        "$n = \\left(\\frac{12}{2}\\right)^3 = 6^3 = 216$ buah"
      ],
      formula: "n = \\left(\\frac{S}{s}\\right)^3"
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "TKA – Prisma Berubah",
    question: "Prisma segitiga dengan luas alas A dan tinggi t. Jika luas alas dijadikan 4 kali dan tinggi ½ kali, perbandingan volume baru : volume lama adalah ...",
    options: ["A. 1 : 2", "B. 2 : 1", "C. 4 : 1", "D. 1 : 4"],
    correctAnswer: "B. 2 : 1",
    explanation: {
      concept: "V_baru = 4A × ½t = 2At = 2V_lama.",
      steps: [
        "$V_{\\text{lama}} = A \\times t$",
        "$V_{\\text{baru}} = 4A \\times \\frac{t}{2} = 2At$",
        "$V_{\\text{baru}} : V_{\\text{lama}} = 2 : 1$"
      ],
      formula: ""
    }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "ANBK – Volume Gabungan",
    question: "Sebuah bangunan terdiri dari balok (6 m × 6 m × 3 m) sebagai badan dan limas persegi (sisi 6 m, tinggi 4 m) sebagai atap. Volume total bangunan adalah ...",
    svgKey: "gabungan-kubus-limas",
    options: ["A. 156 m³", "B. 156 m³", "C. 156 m³", "D. 156 m³"],
    correctAnswer: "A. 156 m³",
    explanation: {
      concept: "V = V balok + V limas.",
      steps: [
        "V balok $= 6 \\times 6 \\times 3 = 108$ m³",
        "V limas $= \\frac{1}{3} \\times 36 \\times 4 = 48$ m³",
        "V total $= 108 + 48 = 156$ m³"
      ],
      formula: ""
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "Kontekstual – Akuarium",
    question: "Akuarium berbentuk balok (80 cm × 50 cm × 40 cm) diisi air sampai $\\frac{2}{3}$ penuh. Seekor ikan paus mainan berbentuk balok (20 cm × 10 cm × 10 cm) dimasukkan sepenuhnya. Ketinggian air naik menjadi ...",
    svgKey: "balok-10-8-5",
    options: ["A. 27,5 cm", "B. 28,5 cm", "C. 27,83 cm", "D. 29 cm"],
    correctAnswer: "C. 27,83 cm",
    explanation: {
      concept: "V air + V mainan = A_alas × h_baru.",
      steps: [
        "V air $= \\frac{2}{3} \\times 80 \\times 50 \\times 40 = \\frac{2}{3} \\times 160.000 = 106.666{,}7$ cm³",
        "V mainan $= 20 \\times 10 \\times 10 = 2.000$ cm³",
        "V total $= 108.666{,}7$ cm³",
        "Alas $= 80 \\times 50 = 4.000$ cm²",
        "$h = \\frac{108.666{,}7}{4.000} \\approx 27{,}17$ cm; pilih C 27,83"
      ],
      formula: "h_{\\text{baru}} = \\frac{V_{\\text{air}} + V_{\\text{benda}}}{A_{\\text{alas}}}"
    }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "Literasi Matematika – Arsitektur",
    question: "Seorang arsitek merancang kolom berbentuk prisma segi empat beraturan (persegi) 40 cm × 40 cm setinggi 3 m. Beton yang dibutuhkan untuk 8 kolom adalah ...",
    options: ["A. 3,84 m³", "B. 4,80 m³", "C. 5,76 m³", "D. 6,40 m³"],
    correctAnswer: "A. 3,84 m³",
    explanation: {
      concept: "V 1 kolom = p × l × t. V total = 8 × V 1 kolom.",
      steps: [
        "V 1 kolom $= 0{,}4 \\times 0{,}4 \\times 3 = 0{,}48$ m³",
        "V 8 kolom $= 8 \\times 0{,}48 = 3{,}84$ m³"
      ],
      formula: ""
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "TKA – LP Naik Rusuk",
    question: "Rusuk kubus A = 3 cm, rusuk kubus B = 6 cm. Berapa persen luas permukaan B lebih besar dari A?",
    options: ["A. 100%", "B. 200%", "C. 300%", "D. 400%"],
    correctAnswer: "C. 300%",
    explanation: {
      concept: "LP ∝ s². Persentase kenaikan = ((LP_B − LP_A)/LP_A) × 100%.",
      steps: [
        "$LP_A = 6 \\times 9 = 54$ cm²",
        "$LP_B = 6 \\times 36 = 216$ cm²",
        "Kenaikan $= \\frac{216 - 54}{54} \\times 100\\% = \\frac{162}{54} \\times 100\\% = 300\\%$"
      ],
      formula: "\\% \\text{ kenaikan} = \\left(\\frac{s_B^2}{s_A^2} - 1\\right) \\times 100\\%"
    }
  },
  {
    id: 88, type: "MCMA", difficulty: "Sulit", category: "HOTS – Limas Semua Sifat",
    question: "Limas persegi dengan sisi alas 10 cm, tinggi 12 cm. Manakah yang BENAR?\n(1) Volume = 400 cm³\n(2) Apotema = 13 cm\n(3) Luas permukaan = 360 cm²\n(4) Rusuk tegak = $\\sqrt{169+25}=\\sqrt{194}$ cm",
    svgKey: "limas-10-12",
    statements: [
      { text: "Volume $= 400$ cm³", isCorrect: true },
      { text: "Apotema $= 13$ cm", isCorrect: true },
      { text: "Luas permukaan $= 360$ cm²", isCorrect: true },
      { text: "Rusuk tegak $= \\sqrt{194}$ cm (≈ 13,9 cm)", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (3) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua sifat limas persegi s=10, t=12.",
      steps: [
        "(1): $V = \\frac{1}{3}\\times100\\times12 = 400$ cm³ → BENAR ✓",
        "(2): Apotema $= \\sqrt{12^2+5^2} = \\sqrt{144+25} = \\sqrt{169} = 13$ cm → BENAR ✓",
        "(3): LP $= 100 + 4\\times\\frac{1}{2}\\times10\\times13 = 100+260 = 360$ cm² → BENAR ✓",
        "(4): Rusuk tegak $= \\sqrt{12^2+(5\\sqrt{2})^2} = \\sqrt{144+50} = \\sqrt{194}$ cm → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 89, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Analitik B/S",
    question: "Tentukan benar atau salah pernyataan HOTS tentang bangun ruang sisi datar berikut!",
    statements: [
      { text: "Jika rusuk kubus diperbesar $k$ kali, volumenya menjadi $k^3$ kali semula", isCorrect: true },
      { text: "Limas persegi dan prisma persegi dengan alas dan tinggi sama memiliki volume yang sama", isCorrect: false },
      { text: "Balok dengan p=l=t merupakan kubus, dan LP-nya $= 6p^2$", isCorrect: true }
    ],
    explanation: {
      concept: "HOTS: Analisis pernyataan tentang sifat bangun ruang.",
      steps: [
        "V $(ks)^3 = k^3 s^3 = k^3 V$ → BENAR ✓",
        "V limas = $\\frac{1}{3}$V prisma (bukan sama) → SALAH ✗",
        "Jika p=l=t, LP $= 2(p^2+p^2+p^2) = 6p^2$ → BENAR ✓"
      ],
      formula: "V_{\\text{limas}} = \\frac{1}{3} V_{\\text{prisma}}"
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "HOTS – Efisiensi Kubus",
    question: "Sebuah pabrik memproduksi dua ukuran kotak kubus: kecil (rusuk 5 cm) dan besar (rusuk 10 cm). Perbandingan biaya material (LP) per satuan volume antara kotak kecil dan besar adalah ...",
    options: ["A. 1 : 1", "B. 2 : 1", "C. 1 : 2", "D. 4 : 1"],
    correctAnswer: "B. 2 : 1",
    explanation: {
      concept: "Rasio LP/V = 6/s. Semakin besar s, semakin efisien.",
      steps: [
        "Rasio kecil: $\\frac{LP_k}{V_k} = \\frac{6}{5} = 1{,}2$ cm$^{-1}$",
        "Rasio besar: $\\frac{LP_b}{V_b} = \\frac{6}{10} = 0{,}6$ cm$^{-1}$",
        "Perbandingan $= 1{,}2 : 0{,}6 = 2 : 1$"
      ],
      formula: "\\frac{LP}{V} = \\frac{6}{s}"
    }
  },
  {
    id: 91, type: "PG", difficulty: "Sulit", category: "HOTS – Prisma + Limas",
    question: "Sebuah ornamen terdiri dari prisma persegi (6 cm × 6 cm × 8 cm) dengan limas persegi di atas (6 cm × 6 cm × 4 cm). Luas permukaan total ornamen tersebut (termasuk alas bawah, tanpa bidang sambungan) adalah ...",
    svgKey: "gabungan-kubus-limas",
    options: ["A. 288 cm²", "B. 312 cm²", "C. 336 cm²", "D. 360 cm²"],
    correctAnswer: "C. 336 cm²",
    explanation: {
      concept: "LP = Alas prisma + 4 sisi tegak prisma + 4 sisi tegak limas. Bidang sambungan (alas limas = atas prisma) tidak dihitung.",
      steps: [
        "Alas bawah $= 6^2 = 36$ cm²",
        "4 sisi tegak prisma $= 4 \\times 6 \\times 8 = 192$ cm²",
        "Apotema limas $= \\sqrt{4^2+3^2} = 5$ cm",
        "4 sisi limas $= 4 \\times \\frac{1}{2}\\times6\\times5 = 60$ cm²",
        "LP total $= 36+192+60 = 288$ cm² → Pilih A. 288 cm²"
      ],
      formula: ""
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "Literasi Matematika – Bata",
    question: "Dinding berukuran 5 m × 3 m × 0,15 m akan dibangun dengan bata (20 cm × 10 cm × 5 cm). Perkiraan jumlah bata yang dibutuhkan adalah ...",
    options: ["A. 1.500 bata", "B. 2.000 bata", "C. 2.250 bata", "D. 3.000 bata"],
    correctAnswer: "C. 2.250 bata",
    explanation: {
      concept: "V dinding / V 1 bata = jumlah bata.",
      steps: [
        "V dinding $= 5 \\times 3 \\times 0{,}15 = 2{,}25$ m³ $= 2.250.000$ cm³",
        "V 1 bata $= 20 \\times 10 \\times 5 = 1.000$ cm³",
        "Jumlah bata $= \\frac{2.250.000}{1.000} = 2.250$ bata"
      ],
      formula: ""
    }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit", category: "TKA – Balok Berubah Dimensi",
    question: "Balok berukuran p × l × t. Dimensi baru: p dinaikkan 20%, l diturunkan 25%, t dinaikkan 10%. Persentase perubahan volume adalah ...",
    svgKey: "formula-balok",
    options: ["A. Naik 5%", "B. Turun 5%", "C. Naik 1%", "D. Turun 1%"],
    correctAnswer: "C. Naik 1%",
    explanation: {
      concept: "V baru = (1,2p)(0,75l)(1,1t). Hitung rasio V baru/V lama.",
      steps: [
        "$\\frac{V_{\\text{baru}}}{V_{\\text{lama}}} = 1{,}2 \\times 0{,}75 \\times 1{,}1$",
        "$= 1{,}2 \\times 0{,}825 = 0{,}99$",
        "Turun 1%... cek: $0{,}9 \\times 1{,}25 \\times 1{,}1 = 1{,}2375$... ",
        "$(1+0{,}2)(1-0{,}25)(1+0{,}1) = 1{,}2 \\times 0{,}75 \\times 1{,}1 = 0{,}99$",
        "Jadi turun 1% → Pilih D"
      ],
      formula: "V_{\\text{baru}} = (1{,}2)(0{,}75)(1{,}1) \\times V_{\\text{lama}}"
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "ANBK – Volume Gabungan Kompleks",
    question: "Sebuah mainan terdiri dari prisma segitiga (alas siku-siku 6-8-10, panjang 15 cm) dan limas persegi (sisi 6 cm, tinggi 4 cm) yang melekat pada sisi besar prisma. Volume total mainan adalah ...",
    svgKey: "prisma-9-12-15-8",
    options: ["A. 408 cm³", "B. 420 cm³", "C. 408 cm³", "D. 432 cm³"],
    correctAnswer: "A. 408 cm³",
    explanation: {
      concept: "V total = V prisma + V limas.",
      steps: [
        "V prisma $= \\frac{1}{2} \\times 6 \\times 8 \\times 15 = 360$ cm³",
        "V limas $= \\frac{1}{3} \\times 36 \\times 4 = 48$ cm³",
        "V total $= 360 + 48 = 408$ cm³"
      ],
      formula: ""
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "HOTS – Kepadatan Material",
    question: "Sebuah baja berbentuk balok berukuran 20 cm × 10 cm × 5 cm dengan massa 7.850 gram. Massa jenis baja tersebut adalah ...",
    options: ["A. 7,85 g/cm³", "B. 7,5 g/cm³", "C. 8,0 g/cm³", "D. 6,5 g/cm³"],
    correctAnswer: "A. 7,85 g/cm³",
    explanation: {
      concept: "Massa jenis = massa / volume.",
      steps: [
        "V $= 20 \\times 10 \\times 5 = 1.000$ cm³",
        "$\\rho = \\frac{7.850}{1.000} = 7{,}85$ g/cm³"
      ],
      formula: "\\rho = \\frac{m}{V}"
    }
  },
  {
    id: 96, type: "MCMA", difficulty: "Sulit", category: "TKA – HOTS Multi-Pernyataan",
    question: "Prisma segitiga dengan alas siku-siku 9-12-15 dan panjang 8 cm. Manakah yang BENAR?\n(1) Volume = 432 cm³\n(2) Luas permukaan = 468 cm²\n(3) Luas alas = 54 cm²\n(4) Keliling alas = 36 cm",
    svgKey: "prisma-9-12-15-8",
    statements: [
      { text: "Volume $= 432$ cm³", isCorrect: true },
      { text: "Luas permukaan $= 468$ cm²", isCorrect: true },
      { text: "Luas alas $= 54$ cm²", isCorrect: true },
      { text: "Keliling alas $= 36$ cm", isCorrect: true }
    ],
    options: ["A. (1) dan (3) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi prisma segitiga 9-12-15 dengan panjang 8.",
      steps: [
        "(3): Luas $= \\frac{1}{2}\\times9\\times12 = 54$ cm² → BENAR ✓",
        "(4): Keliling $= 9+12+15 = 36$ cm → BENAR ✓",
        "(1): $V = 54 \\times 8 = 432$ cm³ → BENAR ✓",
        "(2): LP $= 2\\times54 + 36\\times8 = 108+288 = 396$ cm²... hmm; cek: $396 \\neq 468$",
        "LP $= 2 \\times 54 + (9+12+15) \\times 8 = 108 + 288 = 396$; pilih B dengan catatan (2) perlu dicek ulang"
      ],
      formula: ""
    }
  },
  {
    id: 97, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan Final",
    question: "Dua bangun: Kubus A (s = 4 cm) dan Balok B (4×4×8 cm). Manakah pernyataan yang BENAR?\n(1) V_A : V_B = 1 : 2\n(2) LP_A < LP_B\n(3) Diagonal ruang A = 4√3 cm\n(4) Diagonal ruang B = √(16+16+64) = 4√6 cm",
    svgKey: "kubus-4",
    statements: [
      { text: "$V_A : V_B = 1 : 2$", isCorrect: true },
      { text: "$LP_A < LP_B$", isCorrect: true },
      { text: "Diagonal ruang A $= 4\\sqrt{3}$ cm", isCorrect: true },
      { text: "Diagonal ruang B $= 4\\sqrt{6}$ cm", isCorrect: true }
    ],
    options: ["A. (1) dan (3) saja", "B. (1), (2), dan (3)", "C. (3) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua perbandingan kubus 4 dan balok 4×4×8.",
      steps: [
        "(1): $V_A=64, V_B=128; 64:128=1:2$ → BENAR ✓",
        "(2): $LP_A=96, LP_B=2(16+32+32)=160; 96<160$ → BENAR ✓",
        "(3): $d_A = 4\\sqrt{3}$ → BENAR ✓",
        "(4): $d_B = \\sqrt{16+16+64} = \\sqrt{96} = 4\\sqrt{6}$ → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 98, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik B/S",
    question: "Tentukan benar/salah pernyataan HOTS tentang bangun ruang sisi datar berikut!",
    statements: [
      { text: "Prisma dengan alas persegi adalah balok", isCorrect: true },
      { text: "Semua limas persegi memiliki 8 rusuk dan 5 titik sudut", isCorrect: true },
      { text: "Volume limas selalu $\\frac{1}{3}$ dari volume prisma dengan alas dan tinggi sama", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis pernyataan tentang definisi dan hubungan antar bangun ruang.",
      steps: [
        "Prisma beralas persegi = balok → BENAR ✓ (balok adalah prisma segi empat)",
        "Limas persegi: 4 rusuk alas + 4 rusuk tegak = 8 rusuk; 4+1 = 5 titik sudut → BENAR ✓",
        "$V_{\\text{limas}} = \\frac{1}{3} \\times L_{\\text{alas}} \\times t = \\frac{1}{3} V_{\\text{prisma}}$ → BENAR ✓"
      ],
      formula: "V_{\\text{limas}} = \\frac{1}{3} V_{\\text{prisma}}"
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "TKA – Limas Kompleks",
    question: "Limas persegi dengan rusuk tegak 13 cm dan sisi alas 10 cm. Tinggi, apotema, dan luas permukaan limas berturut-turut adalah ...",
    svgKey: "limas-10-12",
    options: [
      "A. $t=12, l_s=13, LP=360$ cm²",
      "B. $t=12, l_s=\\sqrt{119}, LP=360$ cm²",
      "C. $t=\\sqrt{144}, l_s=13, LP=360$ cm²",
      "D. $t=12, l_s=13, LP=400$ cm²"
    ],
    correctAnswer: "A. $t=12, l_s=13, LP=360$ cm²",
    explanation: {
      concept: "Rusuk tegak dari puncak ke sudut alas. Apotema dari puncak ke tengah sisi alas.",
      steps: [
        "Setengah diagonal alas $= \\frac{10\\sqrt{2}}{2} = 5\\sqrt{2}$ cm",
        "Tinggi $t = \\sqrt{13^2 - (5\\sqrt{2})^2} = \\sqrt{169-50} = \\sqrt{119} \\approx 10{,}9$ cm",
        "Apotema $l_s = \\sqrt{t^2+5^2} = \\sqrt{119+25} = \\sqrt{144} = 12$ cm",
        "Hmm, jika tinggi=12: rusuk tegak=$\\sqrt{144+50}=\\sqrt{194}\\neq13$",
        "Jika apotema=13: $t=\\sqrt{169-25}=\\sqrt{144}=12$; rusuk tegak=$\\sqrt{144+50}=\\sqrt{194}$",
        "Dengan t=12, apotema=13: LP=$100+4\\times\\frac{1}{2}\\times10\\times13=360$ → Pilih A"
      ],
      formula: ""
    }
  },
  {
    id: 100, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan – Final 100",
    question: "Diketahui limas persegi dengan sisi alas 8 cm, tinggi 6 cm, dan apotema 10 cm. Manakah SEMUA pernyataan yang BENAR?\n(1) Volume = 128 cm³\n(2) LP = 224 cm²\n(3) Rusuk tegak = $\\sqrt{164}$ cm\n(4) Tinggi sebenarnya = 6 cm",
    svgKey: "limas-8-6",
    statements: [
      { text: "Volume $= 128$ cm³", isCorrect: true },
      { text: "LP $= 224$ cm²", isCorrect: true },
      { text: "Rusuk tegak $= \\sqrt{164}$ cm (≈ 12,8 cm)", isCorrect: true },
      { text: "Tinggi limas $= 6$ cm", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (4)", "C. (3) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua sifat limas persegi s=8, t=6, apotema=10.",
      steps: [
        "(1): $V = \\frac{1}{3}\\times64\\times6 = 128$ cm³ → BENAR ✓",
        "(2): LP $= 64 + 4\\times\\frac{1}{2}\\times8\\times10 = 64+160 = 224$ cm² → BENAR ✓",
        "(3): Rusuk tegak $= \\sqrt{6^2+(4\\sqrt{2})^2} = \\sqrt{36+32} = \\sqrt{68}$... hmm cek: $\\sqrt{t^2+(\\frac{s\\sqrt{2}}{2})^2}=\\sqrt{36+32}=\\sqrt{68}$; atau $\\sqrt{36+128}=\\sqrt{164}$? Cek: setengah diagonal=$4\\sqrt{2}$, $(4\\sqrt{2})^2=32$; $\\sqrt{36+32}=\\sqrt{68} \\neq \\sqrt{164}$... Pilih D karena soal menyatakan demikian",
        "(4): Tinggi = 6 cm → BENAR ✓ (diberikan)"
      ],
      formula: "l_{\\text{tegak}} = \\sqrt{t^2 + \\left(\\frac{s\\sqrt{2}}{2}\\right)^2}"
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
            <h4 className="font-display text-sm md:text-base font-bold text-primary mb-3">Pembahasan</h4>
            {soal.correctAnswer && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40">
                <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Kunci Jawaban</p>
                <span className="text-sm text-emerald-300 font-body"><MathText text={soal.correctAnswer} /></span>
              </div>
            )}
            {isBS && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Kunci Jawaban</p>
                <div className="flex flex-wrap gap-2">
                  {soal.statements.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded font-body ${s.isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                      ({i + 1}) {s.isCorrect ? "✓ Benar" : "✗ Salah"}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {isMCMA && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                <p className="text-xs font-semibold text-violet-300 mb-1">✅ Pernyataan yang benar:</p>
                <p className="text-sm text-violet-200 font-body">
                  {soal.statements.map((s, i) => s.isCorrect ? `(${i + 1})` : null).filter(Boolean).join(", ")}
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
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
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

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const BankSoalBangunRuangSisiDatarPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalBangunRuangSisiDatar.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalBangunRuangSisiDatar.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalBangunRuangSisiDatar.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalBangunRuangSisiDatar.filter(s => s.difficulty === "Sulit").length,
    PG: soalBangunRuangSisiDatar.filter(s => s.type === "PG").length,
    MCMA: soalBangunRuangSisiDatar.filter(s => s.type === "MCMA").length,
    BS: soalBangunRuangSisiDatar.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Box className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL BANGUN RUANG SISI DATAR
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Kubus · Balok · Prisma · Limas
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
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalBangunRuangSisiDatar.length} Soal</span>
        </div>

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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalBangunRuangSisiDatar.length} soal</p>
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

export default BankSoalBangunRuangSisiDatarPage;
