import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { TrendingUp, ChevronDown, ChevronUp, Filter } from "lucide-react";
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

/* ══════════════════════════════════════════
   SVG VISUAL COMPONENTS
══════════════════════════════════════════ */
const FungsiKuadratUmumSVG = () => (
  <svg viewBox="0 0 320 110" className="w-full max-w-md mx-auto my-3 rounded-lg bg-slate-800/60 border border-violet-500/40 p-2">
    <rect x="0" y="0" width="320" height="110" rx="6" fill="rgba(0,0,0,0.25)"/>
    <text x="160" y="17" fill="#c084fc" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">FUNGSI KUADRAT — Bentuk Umum</text>
    <rect x="15" y="24" width="290" height="42" rx="6" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="1.5"/>
    <text x="160" y="44" fill="var(--icon-color)" fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">f(x) = ax² + bx + c</text>
    <text x="160" y="58" fill="#a78bfa" fontSize="8" textAnchor="middle" fontFamily="monospace">a ≠ 0 · a, b, c ∈ ℝ · Derajat 2</text>
    <rect x="15" y="72" width="88" height="28" rx="4" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1"/>
    <text x="59" y="84" fill="#67e8f9" fontSize="7.5" textAnchor="middle" fontFamily="monospace">a: koefisien x²</text>
    <text x="59" y="94" fill="#67e8f9" fontSize="7" textAnchor="middle" fontFamily="monospace">(menentukan arah)</text>
    <rect x="115" y="72" width="88" height="28" rx="4" fill="rgba(250,204,21,0.1)" stroke="#facc15" strokeWidth="1"/>
    <text x="159" y="84" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">b: koefisien x</text>
    <text x="159" y="94" fill="#fde68a" fontSize="7" textAnchor="middle" fontFamily="monospace">(kemiringan sumbu)</text>
    <rect x="215" y="72" width="88" height="28" rx="4" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1"/>
    <text x="259" y="84" fill="#86efac" fontSize="7.5" textAnchor="middle" fontFamily="monospace">c: konstanta</text>
    <text x="259" y="94" fill="#86efac" fontSize="7" textAnchor="middle" fontFamily="monospace">f(0) = c (titik potong y)</text>
  </svg>
);

const ParabolaArahSVG = () => (
  <svg viewBox="0 0 310 135" className="w-full max-w-md mx-auto my-3 rounded-lg bg-slate-800/60 border border-violet-500/40 p-2">
    <rect x="0" y="0" width="310" height="135" rx="6" fill="rgba(0,0,0,0.25)"/>
    <text x="155" y="15" fill="#c084fc" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Arah Terbuka Parabola</text>
    <line x1="20" y1="70" x2="140" y2="70" stroke="#334155" strokeWidth="0.8"/>
    <line x1="80" y1="20" x2="80" y2="120" stroke="#334155" strokeWidth="0.8"/>
    <polyline points="30,110 50,85 65,67 80,60 95,67 110,85 130,110" fill="none" stroke="#8b5cf6" strokeWidth="2.5"/>
    <circle cx="80" cy="60" r="3" fill="#f59e0b"/>
    <text x="80" y="52" fill="#fbbf24" fontSize="6.5" textAnchor="middle" fontFamily="monospace">puncak min</text>
    <text x="80" y="128" fill="#a78bfa" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">a {">"} 0 → terbuka atas</text>
    <line x1="170" y1="70" x2="290" y2="70" stroke="#334155" strokeWidth="0.8"/>
    <line x1="230" y1="20" x2="230" y2="120" stroke="#334155" strokeWidth="0.8"/>
    <polyline points="180,30 200,55 215,70 230,77 245,70 260,55 280,30" fill="none" stroke="#ec4899" strokeWidth="2.5"/>
    <circle cx="230" cy="77" r="3" fill="#f59e0b"/>
    <text x="230" y="92" fill="#fbbf24" fontSize="6.5" textAnchor="middle" fontFamily="monospace">puncak max</text>
    <text x="230" y="128" fill="#f9a8d4" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">a {"<"} 0 → terbuka bawah</text>
  </svg>
);

const TitikPuncakFKSVG = () => (
  <svg viewBox="0 0 310 130" className="w-full max-w-md mx-auto my-3 rounded-lg bg-slate-800/60 border border-violet-500/40 p-2">
    <rect x="0" y="0" width="310" height="130" rx="6" fill="rgba(0,0,0,0.25)"/>
    <text x="155" y="15" fill="#c084fc" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Titik Puncak (Vertex) Fungsi Kuadrat</text>
    <rect x="10" y="22" width="135" height="55" rx="5" fill="rgba(139,92,246,0.12)" stroke="#8b5cf6" strokeWidth="1.5"/>
    <text x="77" y="38" fill="#a78bfa" fontSize="8" textAnchor="middle" fontFamily="monospace">Absis Puncak</text>
    <text x="77" y="54" fill="#e2e8f0" fontSize="10.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">xₚ = −b / 2a</text>
    <text x="77" y="68" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">= sumbu simetri</text>
    <rect x="160" y="22" width="140" height="55" rx="5" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="230" y="38" fill="#a78bfa" fontSize="8" textAnchor="middle" fontFamily="monospace">Ordinat Puncak</text>
    <text x="230" y="54" fill="#e2e8f0" fontSize="10.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">yₚ = f(xₚ)</text>
    <text x="230" y="68" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">= −D / 4a</text>
    <rect x="10" y="84" width="290" height="36" rx="5" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1.2"/>
    <text x="155" y="99" fill="#67e8f9" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Bentuk Vertex: f(x) = a(x − h)² + k</text>
    <text x="155" y="113" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">h = xₚ, k = yₚ → Puncak P(h, k)</text>
  </svg>
);

const DomainRangeSVG = () => (
  <svg viewBox="0 0 310 125" className="w-full max-w-md mx-auto my-3 rounded-lg bg-slate-800/60 border border-violet-500/40 p-2">
    <rect x="0" y="0" width="310" height="125" rx="6" fill="rgba(0,0,0,0.25)"/>
    <text x="155" y="15" fill="#c084fc" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Domain dan Range Fungsi Kuadrat</text>
    <rect x="10" y="22" width="135" height="60" rx="5" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="77" y="38" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Domain</text>
    <text x="77" y="53" fill="#e2e8f0" fontSize="9" textAnchor="middle" fontFamily="monospace">Df = ℝ</text>
    <text x="77" y="67" fill="#86efac" fontSize="7" textAnchor="middle" fontFamily="monospace">semua x bilangan real</text>
    <text x="77" y="76" fill="#86efac" fontSize="7" textAnchor="middle" fontFamily="monospace">(−∞, +∞)</text>
    <rect x="160" y="22" width="140" height="95" rx="5" fill="rgba(251,191,36,0.1)" stroke="#f59e0b" strokeWidth="1.5"/>
    <text x="230" y="38" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Range</text>
    <text x="230" y="54" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">a {">"} 0 (min di yₚ):</text>
    <text x="230" y="66" fill="#e2e8f0" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Rf = [yₚ, +∞)</text>
    <text x="230" y="82" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">a {"<"} 0 (maks di yₚ):</text>
    <text x="230" y="94" fill="#e2e8f0" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Rf = (−∞, yₚ]</text>
    <text x="230" y="110" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontFamily="monospace">yₚ = nilai puncak = −D/4a</text>
    <text x="77" y="105" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Fungsi kuadrat selalu</text>
    <text x="77" y="115" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">terdefinisi ∀x ∈ ℝ</text>
  </svg>
);

const TitikPotongSumbuSVG = () => (
  <svg viewBox="0 0 310 130" className="w-full max-w-md mx-auto my-3 rounded-lg bg-slate-800/60 border border-violet-500/40 p-2">
    <rect x="0" y="0" width="310" height="130" rx="6" fill="rgba(0,0,0,0.25)"/>
    <text x="155" y="14" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Titik Potong Sumbu Koordinat</text>
    <rect x="8" y="20" width="140" height="100" rx="5" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1.2"/>
    <text x="78" y="34" fill="#22d3ee" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Titik Potong Sumbu-x</text>
    <text x="78" y="48" fill="#a5f3fc" fontSize="7" textAnchor="middle" fontFamily="monospace">f(x) = 0 → cari x</text>
    <text x="78" y="62" fill="#e2e8f0" fontSize="7.5" textAnchor="middle" fontFamily="monospace">ax² + bx + c = 0</text>
    <text x="78" y="76" fill="#67e8f9" fontSize="7" textAnchor="middle" fontFamily="monospace">• D {">"} 0 → 2 titik potong</text>
    <text x="78" y="88" fill="#67e8f9" fontSize="7" textAnchor="middle" fontFamily="monospace">• D = 0 → 1 titik potong</text>
    <text x="78" y="100" fill="#67e8f9" fontSize="7" textAnchor="middle" fontFamily="monospace">• D {"<"} 0 → tidak memotong</text>
    <text x="78" y="113" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontFamily="monospace">D = b² − 4ac</text>
    <rect x="162" y="20" width="140" height="55" rx="5" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1.2"/>
    <text x="232" y="34" fill="#4ade80" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Titik Potong Sumbu-y</text>
    <text x="232" y="50" fill="#a5f3fc" fontSize="7" textAnchor="middle" fontFamily="monospace">x = 0 → f(0) = c</text>
    <text x="232" y="62" fill="#86efac" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Titik: (0, c)</text>
    <rect x="162" y="82" width="140" height="38" rx="5" fill="rgba(251,191,36,0.1)" stroke="#f59e0b" strokeWidth="1.2"/>
    <text x="232" y="96" fill="#fbbf24" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Sumbu Simetri</text>
    <text x="232" y="112" fill="#fde68a" fontSize="8" textAnchor="middle" fontFamily="monospace">x = −b / 2a</text>
  </svg>
);

const BentukVertexSVG = () => (
  <svg viewBox="0 0 310 120" className="w-full max-w-md mx-auto my-3 rounded-lg bg-slate-800/60 border border-violet-500/40 p-2">
    <rect x="0" y="0" width="310" height="120" rx="6" fill="rgba(0,0,0,0.25)"/>
    <text x="155" y="15" fill="#c084fc" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Bentuk Vertex: f(x) = a(x−h)² + k</text>
    <rect x="10" y="22" width="290" height="35" rx="5" fill="rgba(139,92,246,0.12)" stroke="#8b5cf6" strokeWidth="1.5"/>
    <text x="155" y="37" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">f(x) = a(x − h)² + k</text>
    <text x="155" y="50" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Titik Puncak P(h, k) · Sumbu simetri: x = h</text>
    <rect x="10" y="64" width="88" height="46" rx="4" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1"/>
    <text x="54" y="79" fill="#22d3ee" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">h = −b/2a</text>
    <text x="54" y="91" fill="#67e8f9" fontSize="7" textAnchor="middle" fontFamily="monospace">absis puncak</text>
    <text x="54" y="103" fill="#67e8f9" fontSize="7" textAnchor="middle" fontFamily="monospace">= sumbu simetri</text>
    <rect x="110" y="64" width="88" height="46" rx="4" fill="rgba(250,204,21,0.1)" stroke="#facc15" strokeWidth="1"/>
    <text x="154" y="79" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">k = f(h)</text>
    <text x="154" y="91" fill="#fcd34d" fontSize="7" textAnchor="middle" fontFamily="monospace">ordinat puncak</text>
    <text x="154" y="103" fill="#fcd34d" fontSize="7" textAnchor="middle" fontFamily="monospace">= −D/4a</text>
    <rect x="210" y="64" width="88" height="46" rx="4" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1"/>
    <text x="254" y="79" fill="#4ade80" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">a {">"} 0 → min</text>
    <text x="254" y="91" fill="#86efac" fontSize="7" textAnchor="middle" fontFamily="monospace">a {"<"} 0 → maks</text>
    <text x="254" y="103" fill="#86efac" fontSize="7" textAnchor="middle" fontFamily="monospace">nilai: k</text>
  </svg>
);

const GrafikParabolaSVG = ({ label, a, h, k, color }: { label: string; a: number; h: number; k: number; color: string }) => {
  const pts = Array.from({ length: 13 }, (_, i) => {
    const dx = (i - 6) * 10;
    const x = 155 + dx;
    const y = 75 - (a * (dx / 10 - h) * (dx / 10 - h) - k) * 3;
    return `${x},${Math.min(Math.max(y, 15), 125)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 310 140" className="w-full max-w-md mx-auto my-3 rounded-lg bg-slate-800/60 border border-violet-500/40 p-2">
      <rect x="0" y="0" width="310" height="140" rx="6" fill="rgba(0,0,0,0.25)"/>
      <text x="155" y="13" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label}</text>
      <line x1="20" y1="75" x2="290" y2="75" stroke="#334155" strokeWidth="1"/>
      <line x1="155" y1="10" x2="155" y2="135" stroke="#334155" strokeWidth="1"/>
      <text x="285" y="71" fill="#64748b" fontSize="8" fontFamily="monospace">x</text>
      <text x="158" y="14" fill="#64748b" fontSize="8" fontFamily="monospace">y</text>
      {[-4,-3,-2,-1,1,2,3,4].map(n => (
        <g key={n}>
          <line x1={155+n*25} y1="73" x2={155+n*25} y2="77" stroke="#334155" strokeWidth="0.8"/>
          <line x1="153" y1={75-n*20} x2="157" y2={75-n*20} stroke="#334155" strokeWidth="0.8"/>
        </g>
      ))}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"/>
      <circle cx={155 + h*25} cy={75 - k*20} r="3.5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5"/>
      <text x={155 + h*25} y={75 - k*20 - 8} fill="#fbbf24" fontSize="7" textAnchor="middle" fontFamily="monospace">P({h},{k})</text>
      <text x="155" y="135" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Sumbu simetri: x = {h} · Puncak: ({h}, {k})</text>
    </svg>
  );
};

const NilaiMakMinSVG = () => (
  <svg viewBox="0 0 310 110" className="w-full max-w-md mx-auto my-3 rounded-lg bg-slate-800/60 border border-violet-500/40 p-2">
    <rect x="0" y="0" width="310" height="110" rx="6" fill="rgba(0,0,0,0.25)"/>
    <text x="155" y="15" fill="#c084fc" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Nilai Maksimum dan Minimum</text>
    <rect x="10" y="22" width="140" height="78" rx="5" fill="rgba(139,92,246,0.12)" stroke="#8b5cf6" strokeWidth="1.5"/>
    <text x="80" y="38" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">a {">"} 0 → MINIMUM</text>
    <polyline points="30,80 55,62 70,52 80,48 90,52 105,62 130,80" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
    <circle cx="80" cy="48" r="3" fill="#f59e0b"/>
    <text x="80" y="44" fill="#fbbf24" fontSize="6.5" textAnchor="middle" fontFamily="monospace">min = yₚ = k</text>
    <text x="80" y="98" fill="#a78bfa" fontSize="7" textAnchor="middle" fontFamily="monospace">Range: [k, +∞)</text>
    <rect x="160" y="22" width="140" height="78" rx="5" fill="rgba(236,72,153,0.12)" stroke="#ec4899" strokeWidth="1.5"/>
    <text x="230" y="38" fill="#f9a8d4" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">a {"<"} 0 → MAKSIMUM</text>
    <polyline points="170,75 195,55 210,43 230,38 250,43 265,55 290,75" fill="none" stroke="#ec4899" strokeWidth="2"/>
    <circle cx="230" cy="38" r="3" fill="#f59e0b"/>
    <text x="230" y="54" fill="#fbbf24" fontSize="6.5" textAnchor="middle" fontFamily="monospace">maks = yₚ = k</text>
    <text x="230" y="98" fill="#f9a8d4" fontSize="7" textAnchor="middle" fontFamily="monospace">Range: (−∞, k]</text>
  </svg>
);

const TransformasiFKSVG = () => (
  <svg viewBox="0 0 310 130" className="w-full max-w-md mx-auto my-3 rounded-lg bg-slate-800/60 border border-violet-500/40 p-2">
    <rect x="0" y="0" width="310" height="130" rx="6" fill="rgba(0,0,0,0.25)"/>
    <text x="155" y="14" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Transformasi Fungsi Kuadrat</text>
    <rect x="8" y="20" width="290" height="22" rx="4" fill="rgba(139,92,246,0.15)" stroke="#7c3aed" strokeWidth="1"/>
    <text x="155" y="34" fill="#e2e8f0" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Dasar: f(x) = x² · Puncak (0,0)</text>
    <rect x="8" y="48" width="89" height="74" rx="4" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="1"/>
    <text x="52" y="62" fill="#22d3ee" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Geser Horizontal</text>
    <text x="52" y="75" fill="#67e8f9" fontSize="7.5" textAnchor="middle" fontFamily="monospace">f(x)=(x−h)²</text>
    <text x="52" y="88" fill="#a5f3fc" fontSize="7" textAnchor="middle" fontFamily="monospace">h {">"} 0: kanan</text>
    <text x="52" y="100" fill="#a5f3fc" fontSize="7" textAnchor="middle" fontFamily="monospace">h {"<"} 0: kiri</text>
    <text x="52" y="115" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontFamily="monospace">Puncak (h,0)</text>
    <rect x="110" y="48" width="89" height="74" rx="4" fill="rgba(250,204,21,0.08)" stroke="#facc15" strokeWidth="1"/>
    <text x="154" y="62" fill="#fde68a" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Geser Vertikal</text>
    <text x="154" y="75" fill="#fcd34d" fontSize="7.5" textAnchor="middle" fontFamily="monospace">f(x) = x² + k</text>
    <text x="154" y="88" fill="#fef9c3" fontSize="7" textAnchor="middle" fontFamily="monospace">k {">"} 0: naik</text>
    <text x="154" y="100" fill="#fef9c3" fontSize="7" textAnchor="middle" fontFamily="monospace">k {"<"} 0: turun</text>
    <text x="154" y="115" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontFamily="monospace">Puncak (0,k)</text>
    <rect x="212" y="48" width="89" height="74" rx="4" fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="1"/>
    <text x="256" y="62" fill="#4ade80" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Peregangan</text>
    <text x="256" y="75" fill="#86efac" fontSize="7.5" textAnchor="middle" fontFamily="monospace">f(x) = ax²</text>
    <text x="256" y="88" fill="#bbf7d0" fontSize="7" textAnchor="middle" fontFamily="monospace">|a|{">"} 1: lebih curam</text>
    <text x="256" y="100" fill="#bbf7d0" fontSize="7" textAnchor="middle" fontFamily="monospace">|a|{"<"} 1: lebih landai</text>
    <text x="256" y="115" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontFamily="monospace">a{"<"}0: refleksi x</text>
  </svg>
);

const visualMap: Record<string, React.ReactNode> = {
  "fungsi-umum": <FungsiKuadratUmumSVG />,
  "arah-parabola": <ParabolaArahSVG />,
  "titik-puncak-fk": <TitikPuncakFKSVG />,
  "domain-range": <DomainRangeSVG />,
  "titik-potong": <TitikPotongSumbuSVG />,
  "bentuk-vertex": <BentukVertexSVG />,
  "nilai-mak-min": <NilaiMakMinSVG />,
  "transformasi": <TransformasiFKSVG />,
  "grafik-up-1": <GrafikParabolaSVG label="f(x) = x² − 4x + 3, a=1, h=2, k=−1" a={1} h={2} k={-1} color="#8b5cf6" />,
  "grafik-up-2": <GrafikParabolaSVG label="f(x) = 2(x−1)² − 2, a=2, h=1, k=−2" a={2} h={1} k={-2} color="#06b6d4" />,
  "grafik-down-1": <GrafikParabolaSVG label="f(x) = −x² + 4x − 3, a=−1, h=2, k=1" a={-1} h={2} k={1} color="#ec4899" />,
  "grafik-down-2": <GrafikParabolaSVG label="f(x) = −2x² + 4x + 6, a=−2, h=1, k=8" a={-2} h={1} k={8} color="#f59e0b" />,
};

/* ══════════════════════════════════════════
   100 SOAL FUNGSI KUADRAT (PENGAYAAN)
   Q1–Q40   : PG (14 Mudah · 14 Sedang · 12 Sulit)
   Q41–Q70  : MCMA (10 Mudah · 10 Sedang · 10 Sulit)
   Q71–Q100 : Benar/Salah (11 Mudah · 11 Sedang · 8 Sulit)
══════════════════════════════════════════ */
const soalFungsiKuadrat: Question[] = [

  /* ══════════ PG — MUDAH (Q1–Q14) ══════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "UN – Bentuk Umum",
    question: "Bentuk umum fungsi kuadrat adalah ...",
    svgKey: "fungsi-umum",
    options: [
      "A. $f(x) = ax + b,\\ a \\neq 0$",
      "B. $f(x) = ax^2 + bx + c,\\ a \\neq 0$",
      "C. $f(x) = ax^3 + bx^2 + c$",
      "D. $f(x) = \\dfrac{a}{x} + b$"
    ],
    correctAnswer: "B. $f(x) = ax^2 + bx + c,\\ a \\neq 0$",
    explanation: {
      concept: "Fungsi kuadrat adalah fungsi polinomial berderajat 2 dengan koefisien $a \\neq 0$.",
      steps: [
        "Fungsi kuadrat memiliki variabel $x$ berpangkat 2 sebagai suku tertinggi.",
        "Syarat utama: $a \\neq 0$ (jika $a=0$ maka menjadi fungsi linear).",
        "Bentuk umum: $f(x) = ax^2 + bx + c$ dengan $a, b, c \\in \\mathbb{R}$."
      ],
      formula: "f(x) = ax^2 + bx + c,\\quad a \\neq 0"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "UN – Identifikasi Koefisien",
    question: "Pada fungsi $f(x) = 2x^2 - 6x + 4$, nilai $a$, $b$, dan $c$ berturut-turut adalah ...",
    options: [
      "A. $2,\\ 6,\\ 4$",
      "B. $2,\\ -6,\\ 4$",
      "C. $-2,\\ 6,\\ 4$",
      "D. $2,\\ -6,\\ -4$"
    ],
    correctAnswer: "B. $2,\\ -6,\\ 4$",
    explanation: {
      concept: "Bandingkan dengan bentuk umum $f(x) = ax^2 + bx + c$.",
      steps: [
        "$a = 2$ (koefisien $x^2$)",
        "$b = -6$ (koefisien $x$)",
        "$c = 4$ (konstanta)"
      ],
      formula: "f(x) = 2x^2 - 6x + 4 \\Rightarrow a=2,\\ b=-6,\\ c=4"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "UN – Nilai Fungsi",
    question: "Nilai dari $f(3)$ jika $f(x) = x^2 - 4x + 1$ adalah ...",
    options: ["A. $-2$", "B. $-1$", "C. $1$", "D. $4$"],
    correctAnswer: "A. $-2$",
    explanation: {
      concept: "Substitusi $x = 3$ ke dalam fungsi.",
      steps: [
        "$f(3) = (3)^2 - 4(3) + 1$",
        "$= 9 - 12 + 1$",
        "$= -2$"
      ],
      formula: "f(3) = 9 - 12 + 1 = -2"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "UN – Arah Parabola",
    question: "Grafik fungsi $f(x) = -3x^2 + 6x - 1$ berbentuk parabola yang ...",
    svgKey: "arah-parabola",
    options: [
      "A. Terbuka ke atas dengan nilai minimum",
      "B. Terbuka ke bawah dengan nilai maksimum",
      "C. Terbuka ke kanan",
      "D. Terbuka ke kiri"
    ],
    correctAnswer: "B. Terbuka ke bawah dengan nilai maksimum",
    explanation: {
      concept: "Arah terbuka parabola ditentukan oleh tanda $a$.",
      steps: [
        "$a = -3 < 0$",
        "Karena $a < 0$, parabola terbuka ke bawah.",
        "Parabola terbuka ke bawah memiliki nilai maksimum di titik puncak."
      ],
      formula: "a < 0 \\Rightarrow \\text{terbuka ke bawah, nilai maks di puncak}"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "UN – Titik Puncak",
    question: "Sumbu simetri dari fungsi $f(x) = x^2 - 6x + 5$ adalah ...",
    svgKey: "titik-puncak-fk",
    options: ["A. $x = -3$", "B. $x = 3$", "C. $x = 5$", "D. $x = 6$"],
    correctAnswer: "B. $x = 3$",
    explanation: {
      concept: "Sumbu simetri = absis titik puncak $= -b/2a$.",
      steps: [
        "$a = 1,\\ b = -6$",
        "$x_p = -\\dfrac{-6}{2 \\cdot 1} = \\dfrac{6}{2} = 3$"
      ],
      formula: "x_p = -\\dfrac{b}{2a} = 3"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "UN – Titik Potong Sumbu-y",
    question: "Titik potong grafik $f(x) = 2x^2 - 3x + 5$ dengan sumbu-$y$ adalah ...",
    svgKey: "titik-potong",
    options: ["A. $(0,\\ -3)$", "B. $(0,\\ 2)$", "C. $(0,\\ 5)$", "D. $(0,\\ 10)$"],
    correctAnswer: "C. $(0,\\ 5)$",
    explanation: {
      concept: "Titik potong sumbu-$y$ diperoleh dengan $x = 0$, sehingga $f(0) = c$.",
      steps: [
        "$f(0) = 2(0)^2 - 3(0) + 5 = 5$",
        "Titik potong sumbu-$y$: $(0,\\ 5)$"
      ],
      formula: "f(0) = c = 5 \\Rightarrow \\text{titik } (0,5)"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "UN – Bentuk Vertex",
    question: "Titik puncak dari fungsi $f(x) = (x - 3)^2 + 2$ adalah ...",
    svgKey: "bentuk-vertex",
    options: ["A. $(-3,\\ 2)$", "B. $(3,\\ -2)$", "C. $(3,\\ 2)$", "D. $(-3,\\ -2)$"],
    correctAnswer: "C. $(3,\\ 2)$",
    explanation: {
      concept: "Fungsi dalam bentuk vertex $f(x) = a(x-h)^2 + k$, titik puncaknya $(h,\\ k)$.",
      steps: [
        "$f(x) = (x - 3)^2 + 2 \\Rightarrow h = 3,\\ k = 2$",
        "Titik puncak: $(3,\\ 2)$"
      ],
      formula: "f(x) = a(x-h)^2+k \\Rightarrow P(h,k) = (3,2)"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "UN – Range Fungsi",
    question: "Nilai minimum fungsi $f(x) = x^2 - 4x + 7$ adalah ...",
    svgKey: "nilai-mak-min",
    options: ["A. $1$", "B. $3$", "C. $4$", "D. $7$"],
    correctAnswer: "B. $3$",
    explanation: {
      concept: "$a = 1 > 0$, maka fungsi memiliki nilai minimum di titik puncak.",
      steps: [
        "$x_p = -\\dfrac{-4}{2 \\cdot 1} = 2$",
        "$y_{min} = f(2) = (2)^2 - 4(2) + 7 = 4 - 8 + 7 = 3$"
      ],
      formula: "y_{min} = f(2) = 3"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "UN – Identifikasi Fungsi",
    question: "Manakah yang merupakan fungsi kuadrat?",
    options: [
      "A. $f(x) = 3x + 5$",
      "B. $f(x) = x^2 - 2x + 1$",
      "C. $f(x) = x^3 - 4$",
      "D. $f(x) = \\dfrac{2}{x}$"
    ],
    correctAnswer: "B. $f(x) = x^2 - 2x + 1$",
    explanation: {
      concept: "Fungsi kuadrat memiliki derajat 2 (pangkat tertinggi variabel adalah 2).",
      steps: [
        "A: derajat 1 (fungsi linear)",
        "B: derajat 2 ✓ (fungsi kuadrat)",
        "C: derajat 3 (fungsi kubik)",
        "D: bukan fungsi polinomial"
      ],
      formula: "\\deg(f) = 2 \\Rightarrow \\text{fungsi kuadrat}"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "UN – Nilai Fungsi",
    question: "Jika $f(x) = x^2 + 2x - 3$, maka $f(-1)$ adalah ...",
    options: ["A. $-4$", "B. $-3$", "C. $0$", "D. $4$"],
    correctAnswer: "A. $-4$",
    explanation: {
      concept: "Substitusi $x = -1$ ke dalam fungsi.",
      steps: [
        "$f(-1) = (-1)^2 + 2(-1) - 3$",
        "$= 1 - 2 - 3 = -4$"
      ],
      formula: "f(-1) = 1 - 2 - 3 = -4"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "UN – Domain",
    question: "Domain dari fungsi kuadrat $f(x) = x^2 - 5x + 6$ adalah ...",
    svgKey: "domain-range",
    options: [
      "A. $\\{x \\mid x \\geq 0\\}$",
      "B. $\\{x \\mid x > 0\\}$",
      "C. $\\{x \\mid x \\in \\mathbb{R}\\}$",
      "D. $\\{x \\mid -5 \\leq x \\leq 6\\}$"
    ],
    correctAnswer: "C. $\\{x \\mid x \\in \\mathbb{R}\\}$",
    explanation: {
      concept: "Domain fungsi kuadrat adalah semua bilangan real karena terdefinisi untuk semua nilai $x$.",
      steps: [
        "Tidak ada pembatasan pada $x$ (tidak ada akar atau pecahan).",
        "$D_f = \\mathbb{R} = (-\\infty, +\\infty)$"
      ],
      formula: "D_f = \\mathbb{R} \\text{ untuk semua fungsi kuadrat}"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "KONTEKSTUAL – Tinggi Bola",
    question: "Tinggi bola yang dilempar ke atas dinyatakan dengan $h(t) = -5t^2 + 20t$ meter ($t$ dalam detik). Tinggi bola saat $t = 2$ detik adalah ...",
    options: ["A. $10$ m", "B. $15$ m", "C. $20$ m", "D. $30$ m"],
    correctAnswer: "C. $20$ m",
    explanation: {
      concept: "Substitusi $t = 2$ ke dalam fungsi ketinggian.",
      steps: [
        "$h(2) = -5(2)^2 + 20(2)$",
        "$= -5(4) + 40$",
        "$= -20 + 40 = 20$ meter"
      ],
      formula: "h(2) = -5(4) + 40 = 20 \\text{ m}"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "UN – Nilai Maksimum",
    question: "Nilai maksimum dari $f(x) = -(x-2)^2 + 9$ adalah ...",
    options: ["A. $-9$", "B. $2$", "C. $9$", "D. $11$"],
    correctAnswer: "C. $9$",
    explanation: {
      concept: "Bentuk vertex $f(x) = a(x-h)^2 + k$, $a < 0$ maka nilai maksimum $= k$.",
      steps: [
        "$a = -1 < 0$, $k = 9$",
        "Nilai maksimum $= k = 9$, dicapai saat $x = 2$."
      ],
      formula: "f_{maks} = k = 9 \\text{ saat } x = h = 2"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "UN – Titik Nol Fungsi",
    question: "Titik potong grafik $f(x) = x^2 - 9$ dengan sumbu-$x$ adalah ...",
    options: [
      "A. $(3,\\ 0)$ saja",
      "B. $(-3,\\ 0)$ saja",
      "C. $(3,\\ 0)$ dan $(-3,\\ 0)$",
      "D. $(0,\\ 9)$ dan $(0,\\ -9)$"
    ],
    correctAnswer: "C. $(3,\\ 0)$ dan $(-3,\\ 0)$",
    explanation: {
      concept: "Titik potong sumbu-$x$: selesaikan $f(x) = 0$.",
      steps: [
        "$x^2 - 9 = 0$",
        "$(x-3)(x+3) = 0$",
        "$x = 3$ atau $x = -3$",
        "Titik: $(3,\\ 0)$ dan $(-3,\\ 0)$"
      ],
      formula: "x^2 = 9 \\Rightarrow x = \\pm 3"
    }
  },

  /* ══════════ PG — SEDANG (Q15–Q28) ══════════ */
  {
    id: 15, type: "PG", difficulty: "Sedang", category: "UN – Nilai Puncak",
    question: "Titik puncak dari fungsi $f(x) = x^2 - 4x + 3$ adalah ...",
    svgKey: "grafik-up-1",
    options: ["A. $(2,\\ -1)$", "B. $(-2,\\ 1)$", "C. $(2,\\ 1)$", "D. $(-2,\\ -1)$"],
    correctAnswer: "A. $(2,\\ -1)$",
    explanation: {
      concept: "Gunakan rumus titik puncak $x_p = -b/2a$ dan $y_p = f(x_p)$.",
      steps: [
        "$a=1,\\ b=-4,\\ c=3$",
        "$x_p = -\\dfrac{-4}{2(1)} = 2$",
        "$y_p = f(2) = 4 - 8 + 3 = -1$",
        "Titik puncak: $(2,\\ -1)$"
      ],
      formula: "P = (2, -1)"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Sedang", category: "UN – Bentuk Vertex",
    question: "Fungsi $f(x) = x^2 - 6x + 11$ dalam bentuk vertex adalah ...",
    svgKey: "bentuk-vertex",
    options: [
      "A. $f(x) = (x-3)^2 + 2$",
      "B. $f(x) = (x+3)^2 + 2$",
      "C. $f(x) = (x-3)^2 - 2$",
      "D. $f(x) = (x-6)^2 + 2$"
    ],
    correctAnswer: "A. $f(x) = (x-3)^2 + 2$",
    explanation: {
      concept: "Lengkapi kuadrat untuk mendapatkan bentuk vertex.",
      steps: [
        "$f(x) = x^2 - 6x + 11$",
        "$= (x^2 - 6x + 9) + 11 - 9$",
        "$= (x-3)^2 + 2$",
        "Puncak: $(3,\\ 2)$"
      ],
      formula: "(x^2 - 6x + 9) = (x-3)^2 \\Rightarrow f(x) = (x-3)^2 + 2"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Sedang", category: "ANBK – Diskriminan & Grafik",
    question: "Grafik fungsi $f(x) = x^2 - 2x + 5$ memotong sumbu-$x$ sebanyak ...",
    svgKey: "titik-potong",
    options: [
      "A. Tidak memotong sumbu-$x$",
      "B. Memotong di 1 titik",
      "C. Memotong di 2 titik",
      "D. Memotong di 3 titik"
    ],
    correctAnswer: "A. Tidak memotong sumbu-$x$",
    explanation: {
      concept: "Jumlah titik potong dengan sumbu-$x$ ditentukan oleh diskriminan $D = b^2 - 4ac$.",
      steps: [
        "$D = (-2)^2 - 4(1)(5) = 4 - 20 = -16$",
        "$D < 0 \\Rightarrow$ tidak ada akar real",
        "Grafik tidak memotong sumbu-$x$"
      ],
      formula: "D = -16 < 0 \\Rightarrow \\text{tidak memotong sumbu-}x"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Sedang", category: "UN – Range Fungsi",
    question: "Range dari fungsi $f(x) = 2x^2 - 8x + 6$ adalah ...",
    svgKey: "domain-range",
    options: [
      "A. $f(x) \\geq -2$",
      "B. $f(x) \\leq -2$",
      "C. $f(x) \\geq 2$",
      "D. $f(x) \\leq 2$"
    ],
    correctAnswer: "A. $f(x) \\geq -2$",
    explanation: {
      concept: "$a = 2 > 0$, fungsi memiliki nilai minimum. Range dimulai dari nilai minimum.",
      steps: [
        "$x_p = -\\dfrac{-8}{2(2)} = 2$",
        "$y_{min} = f(2) = 2(4) - 8(2) + 6 = 8 - 16 + 6 = -2$",
        "Range: $f(x) \\geq -2$ atau $[-2, +\\infty)$"
      ],
      formula: "f_{min} = -2 \\Rightarrow R_f = [-2, +\\infty)"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Sedang", category: "HOTS – Menentukan Fungsi",
    question: "Fungsi kuadrat yang grafiknya memiliki titik puncak $(1,\\ -4)$ dan melalui titik $(3,\\ 0)$ adalah ...",
    options: [
      "A. $f(x) = x^2 - 2x - 3$",
      "B. $f(x) = (x-1)^2 - 4$",
      "C. $f(x) = 2(x-1)^2 - 4$",
      "D. $f(x) = (x+1)^2 - 4$"
    ],
    correctAnswer: "B. $f(x) = (x-1)^2 - 4$",
    explanation: {
      concept: "Gunakan bentuk vertex $f(x) = a(x-h)^2 + k$ dengan puncak $(h,k) = (1,-4)$.",
      steps: [
        "$f(x) = a(x-1)^2 - 4$",
        "Substitusi titik $(3,0)$: $0 = a(3-1)^2 - 4 = 4a - 4$",
        "$4a = 4 \\Rightarrow a = 1$",
        "$f(x) = (x-1)^2 - 4$"
      ],
      formula: "f(x) = (x-1)^2 - 4"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Sedang", category: "KONTEKSTUAL – Optimasi",
    question: "Kebun berbentuk persegi panjang akan dipagar dengan kawat 40 m. Jika lebar kebun $x$ m, luas maksimum kebun adalah ...",
    options: ["A. $80$ m²", "B. $100$ m²", "C. $200$ m²", "D. $400$ m²"],
    correctAnswer: "B. $100$ m²",
    explanation: {
      concept: "Luas $L = x \\cdot p$. Keliling $= 2(x + p) = 40 \\Rightarrow p = 20 - x$. Maka $L = x(20-x) = -x^2 + 20x$.",
      steps: [
        "$L(x) = -x^2 + 20x$, $a = -1 < 0$ → nilai maksimum",
        "$x_p = -\\dfrac{20}{2(-1)} = 10$",
        "$L_{maks} = -(10)^2 + 20(10) = -100 + 200 = 100$ m²"
      ],
      formula: "L_{maks} = 100 \\text{ m}^2 \\text{ saat } x = 10 \\text{ m}"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Sedang", category: "UN – Faktorisasi Fungsi",
    question: "Titik-titik potong grafik $f(x) = x^2 - 5x + 4$ dengan sumbu-$x$ adalah ...",
    options: [
      "A. $(1,\\ 0)$ dan $(4,\\ 0)$",
      "B. $(-1,\\ 0)$ dan $(-4,\\ 0)$",
      "C. $(2,\\ 0)$ dan $(3,\\ 0)$",
      "D. $(1,\\ 0)$ dan $(-4,\\ 0)$"
    ],
    correctAnswer: "A. $(1,\\ 0)$ dan $(4,\\ 0)$",
    explanation: {
      concept: "Selesaikan $f(x) = 0$.",
      steps: [
        "$x^2 - 5x + 4 = 0$",
        "$(x-1)(x-4) = 0$",
        "$x = 1$ atau $x = 4$",
        "Titik: $(1,0)$ dan $(4,0)$"
      ],
      formula: "(x-1)(x-4) = 0 \\Rightarrow x=1 \\text{ atau } x=4"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Sedang", category: "TKA – Nilai Fungsi",
    question: "Jika $f(x) = 3x^2 - 2x + k$ dan $f(2) = 10$, maka nilai $k$ adalah ...",
    options: ["A. $-6$", "B. $-2$", "C. $2$", "D. $6$"],
    correctAnswer: "B. $-2$",
    explanation: {
      concept: "Substitusi $x=2$ dan $f(2) = 10$ untuk mencari $k$.",
      steps: [
        "$f(2) = 3(4) - 2(2) + k = 10$",
        "$12 - 4 + k = 10$",
        "$8 + k = 10$",
        "$k = 2$"
      ],
      formula: "3(4) - 4 + k = 10 \\Rightarrow k = 2"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Sedang", category: "ANBK – Grafik Parabola",
    question: "Grafik fungsi $f(x) = -x^2 + 4x - 3$ memotong sumbu-$x$ di titik ...",
    svgKey: "grafik-down-1",
    options: [
      "A. $(1,\\ 0)$ dan $(3,\\ 0)$",
      "B. $(-1,\\ 0)$ dan $(3,\\ 0)$",
      "C. $(1,\\ 0)$ dan $(-3,\\ 0)$",
      "D. $(3,\\ 0)$ dan $(-3,\\ 0)$"
    ],
    correctAnswer: "A. $(1,\\ 0)$ dan $(3,\\ 0)$",
    explanation: {
      concept: "Selesaikan $-x^2 + 4x - 3 = 0$ atau $x^2 - 4x + 3 = 0$.",
      steps: [
        "$x^2 - 4x + 3 = 0$",
        "$(x-1)(x-3) = 0$",
        "$x = 1$ atau $x = 3$",
        "Titik: $(1,0)$ dan $(3,0)$"
      ],
      formula: "(x-1)(x-3)=0 \\Rightarrow x=1 \\text{ atau } x=3"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Sedang", category: "UN – Transformasi",
    question: "Grafik $f(x) = x^2$ digeser ke kanan 3 satuan dan ke atas 2 satuan. Fungsi barunya adalah ...",
    svgKey: "transformasi",
    options: [
      "A. $f(x) = (x+3)^2 + 2$",
      "B. $f(x) = (x-3)^2 + 2$",
      "C. $f(x) = (x-3)^2 - 2$",
      "D. $f(x) = (x+3)^2 - 2$"
    ],
    correctAnswer: "B. $f(x) = (x-3)^2 + 2$",
    explanation: {
      concept: "Geser kanan $h$ satuan: ganti $x$ dengan $(x-h)$. Geser atas $k$ satuan: tambah $k$.",
      steps: [
        "Geser kanan 3: $f(x) = (x-3)^2$",
        "Geser atas 2: $f(x) = (x-3)^2 + 2$",
        "Puncak baru: $(3,\\ 2)$"
      ],
      formula: "f(x) = (x-3)^2 + 2"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Sedang", category: "LITERASI MATEMATIKA – Kontekstual",
    question: "Sebuah roket mainan diluncurkan dengan ketinggian $h(t) = -4t^2 + 16t + 5$ meter ($t$ dalam detik). Ketinggian maksimum roket adalah ...",
    options: ["A. $16$ m", "B. $19$ m", "C. $21$ m", "D. $25$ m"],
    correctAnswer: "C. $21$ m",
    explanation: {
      concept: "$a = -4 < 0$, fungsi memiliki nilai maksimum.",
      steps: [
        "$t_p = -\\dfrac{16}{2(-4)} = 2$ detik",
        "$h_{maks} = h(2) = -4(4) + 16(2) + 5 = -16 + 32 + 5 = 21$ m"
      ],
      formula: "h_{maks} = h(2) = 21 \\text{ m}"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Sedang", category: "TKA – Mencari a",
    question: "Fungsi kuadrat $f(x) = ax^2 - 4x + 3$ memiliki nilai minimum $-1$. Nilai $a$ adalah ...",
    options: ["A. $1$", "B. $2$", "C. $3$", "D. $4$"],
    correctAnswer: "B. $2$",
    explanation: {
      concept: "Nilai minimum $= f(x_p) = c - \\dfrac{b^2}{4a}$.",
      steps: [
        "Nilai min $= 3 - \\dfrac{(-4)^2}{4a} = 3 - \\dfrac{16}{4a} = -1$",
        "$\\dfrac{16}{4a} = 4 \\Rightarrow 4a = 4 \\Rightarrow a = 1$"
      ],
      formula: "3 - \\frac{16}{4a} = -1 \\Rightarrow a = 2"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Sedang", category: "ANBK – Tabel Nilai Fungsi",
    question: "Perhatikan tabel berikut untuk $f(x) = x^2 - 2x$:\n\n| $x$ | $-1$ | $0$ | $1$ | $2$ | $3$ |\n|------|------|-----|-----|-----|-----|\n| $f(x)$ | $3$ | $0$ | ? | $0$ | $3$ |\n\nNilai yang tepat untuk tanda tanya (?) adalah ...",
    options: ["A. $-2$", "B. $-1$", "C. $0$", "D. $1$"],
    correctAnswer: "B. $-1$",
    explanation: {
      concept: "Substitusi $x = 1$ ke $f(x) = x^2 - 2x$.",
      steps: [
        "$f(1) = (1)^2 - 2(1) = 1 - 2 = -1$"
      ],
      formula: "f(1) = 1 - 2 = -1"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Sedang", category: "KONTEKSTUAL – Ekonomi",
    question: "Laba perusahaan dinyatakan dengan $L(x) = -x^2 + 10x - 16$ (dalam juta rupiah), dengan $x$ unit produksi. Laba maksimum adalah ...",
    options: ["A. $7$ juta", "B. $9$ juta", "C. $10$ juta", "D. $16$ juta"],
    correctAnswer: "B. $9$ juta",
    explanation: {
      concept: "$a = -1 < 0$, laba memiliki nilai maksimum.",
      steps: [
        "$x_p = -\\dfrac{10}{2(-1)} = 5$ unit",
        "$L_{maks} = L(5) = -(25) + 50 - 16 = -25 + 34 = 9$ juta"
      ],
      formula: "L_{maks} = L(5) = 9 \\text{ juta rupiah}"
    }
  },

  /* ══════════ PG — SULIT (Q29–Q40) ══════════ */
  {
    id: 29, type: "PG", difficulty: "Sulit", category: "HOTS – Fungsi dari Dua Titik",
    question: "Fungsi kuadrat dengan titik puncak $(2,\\ 3)$ dan melalui titik $(0,\\ -1)$ adalah ...",
    options: [
      "A. $f(x) = -(x-2)^2 + 3$",
      "B. $f(x) = -x^2 + 4x - 1$",
      "C. $f(x) = (x-2)^2 + 3$",
      "D. $f(x) = -x^2 + 4x + 3$"
    ],
    correctAnswer: "A. $f(x) = -(x-2)^2 + 3$",
    explanation: {
      concept: "Gunakan bentuk vertex, lalu tentukan $a$ dari titik yang diketahui.",
      steps: [
        "$f(x) = a(x-2)^2 + 3$",
        "Substitusi $(0, -1)$: $-1 = a(0-2)^2 + 3 = 4a + 3$",
        "$4a = -4 \\Rightarrow a = -1$",
        "$f(x) = -(x-2)^2 + 3$"
      ],
      formula: "f(x) = -(x-2)^2 + 3"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Sulit", category: "HOTS – Range Terbatas",
    question: "Fungsi $f(x) = x^2 - 4x + 3$ pada domain $0 \\leq x \\leq 5$. Nilai maksimum $f$ pada domain tersebut adalah ...",
    options: ["A. $-1$", "B. $3$", "C. $8$", "D. $12$"],
    correctAnswer: "C. $8$",
    explanation: {
      concept: "Pada domain terbatas, periksa nilai di titik puncak dan kedua ujung domain.",
      steps: [
        "$x_p = 2$, $f(2) = 4 - 8 + 3 = -1$ (minimum)",
        "$f(0) = 0 - 0 + 3 = 3$",
        "$f(5) = 25 - 20 + 3 = 8$",
        "Nilai maksimum $= 8$ di $x = 5$"
      ],
      formula: "f_{maks} = f(5) = 8 \\text{ pada domain } [0,5]"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Sulit", category: "TKA – Fungsi Selalu Positif",
    question: "Agar $f(x) = x^2 - 4x + k$ selalu bernilai positif untuk semua $x \\in \\mathbb{R}$, nilai $k$ harus ...",
    options: ["A. $k < 4$", "B. $k = 4$", "C. $k > 4$", "D. $k \\geq 4$"],
    correctAnswer: "C. $k > 4$",
    explanation: {
      concept: "Fungsi selalu positif jika $a > 0$ dan $D < 0$.",
      steps: [
        "$a = 1 > 0$ (parabola terbuka ke atas) ✓",
        "$D = (-4)^2 - 4(1)(k) = 16 - 4k$",
        "$D < 0 \\Rightarrow 16 - 4k < 0 \\Rightarrow k > 4$"
      ],
      formula: "D < 0 \\Rightarrow 16 - 4k < 0 \\Rightarrow k > 4"
    }
  },
  {
    id: 32, type: "PG", difficulty: "Sulit", category: "HOTS – Komposisi Fungsi",
    question: "Jika $f(x) = x^2 - 2$ dan $g(x) = 3x + 1$, maka $f(g(1))$ adalah ...",
    options: ["A. $12$", "B. $14$", "C. $16$", "D. $18$"],
    correctAnswer: "B. $14$",
    explanation: {
      concept: "Hitung $g(1)$ terlebih dahulu, lalu substitusi ke $f$.",
      steps: [
        "$g(1) = 3(1) + 1 = 4$",
        "$f(g(1)) = f(4) = (4)^2 - 2 = 16 - 2 = 14$"
      ],
      formula: "f(g(1)) = f(4) = 14"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Proyektil",
    question: "Peluru ditembakkan dengan lintasan $h(x) = -0{,}01x^2 + 2x$ meter ($x$ = jarak horizontal m). Jarak horizontal maksimum (saat peluru mendarat) adalah ...",
    options: ["A. $100$ m", "B. $150$ m", "C. $200$ m", "D. $250$ m"],
    correctAnswer: "C. $200$ m",
    explanation: {
      concept: "Peluru mendarat saat $h(x) = 0$.",
      steps: [
        "$-0{,}01x^2 + 2x = 0$",
        "$x(-0{,}01x + 2) = 0$",
        "$x = 0$ (titik tembak) atau $x = \\dfrac{2}{0{,}01} = 200$ m"
      ],
      formula: "x = \\frac{2}{0{,}01} = 200 \\text{ m}"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Sulit", category: "HOTS – Dua Fungsi",
    question: "Fungsi $f(x) = x^2 - 2x - 3$ dan $g(x) = x + 1$. Nilai $x$ agar $f(x) = g(x)$ adalah ...",
    options: [
      "A. $x = -1$ atau $x = 4$",
      "B. $x = 1$ atau $x = -4$",
      "C. $x = 2$ atau $x = -1$",
      "D. $x = -2$ atau $x = 2$"
    ],
    correctAnswer: "A. $x = -1$ atau $x = 4$",
    explanation: {
      concept: "Samakan kedua fungsi: $f(x) = g(x)$.",
      steps: [
        "$x^2 - 2x - 3 = x + 1$",
        "$x^2 - 3x - 4 = 0$",
        "$(x+1)(x-4) = 0$",
        "$x = -1$ atau $x = 4$"
      ],
      formula: "x^2 - 3x - 4 = 0 \\Rightarrow x=-1 \\text{ atau } x=4"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Sulit", category: "TKA – Parameter",
    question: "Fungsi $f(x) = (m-2)x^2 + (m+1)x - 3$ merupakan fungsi kuadrat. Nilai $m$ yang mungkin adalah ...",
    options: ["A. $m = 2$", "B. $m = -1$", "C. $m \\neq 2$", "D. $m = 0$"],
    correctAnswer: "C. $m \\neq 2$",
    explanation: {
      concept: "Fungsi kuadrat syaratnya koefisien $x^2$ tidak sama dengan nol.",
      steps: [
        "Koefisien $x^2 = m - 2$",
        "Syarat fungsi kuadrat: $m - 2 \\neq 0$",
        "$m \\neq 2$"
      ],
      formula: "a = m-2 \\neq 0 \\Rightarrow m \\neq 2"
    }
  },
  {
    id: 36, type: "PG", difficulty: "Sulit", category: "HOTS – Fungsi dari Grafik",
    question: "Grafik parabola memotong sumbu-$x$ di $(-2, 0)$ dan $(4, 0)$, serta melalui titik $(0, -8)$. Fungsi kuadratnya adalah ...",
    options: [
      "A. $f(x) = x^2 - 2x - 8$",
      "B. $f(x) = x^2 + 2x - 8$",
      "C. $f(x) = -x^2 + 2x + 8$",
      "D. $f(x) = x^2 - 2x + 8$"
    ],
    correctAnswer: "A. $f(x) = x^2 - 2x - 8$",
    explanation: {
      concept: "Gunakan bentuk $f(x) = a(x - x_1)(x - x_2)$, lalu tentukan $a$.",
      steps: [
        "$f(x) = a(x+2)(x-4)$",
        "Substitusi $(0, -8)$: $-8 = a(2)(-4) = -8a$",
        "$a = 1$",
        "$f(x) = (x+2)(x-4) = x^2 - 2x - 8$"
      ],
      formula: "f(x) = (x+2)(x-4) = x^2 - 2x - 8"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sulit", category: "HOTS – Ketidaksamaan Kuadrat",
    question: "Nilai $x$ yang memenuhi $f(x) = x^2 - 5x + 4 < 0$ adalah ...",
    options: [
      "A. $1 < x < 4$",
      "B. $x < 1$ atau $x > 4$",
      "C. $x \\leq 1$ atau $x \\geq 4$",
      "D. $1 \\leq x \\leq 4$"
    ],
    correctAnswer: "A. $1 < x < 4$",
    explanation: {
      concept: "Untuk $a > 0$, $f(x) < 0$ berlaku di antara dua akar.",
      steps: [
        "$x^2 - 5x + 4 = (x-1)(x-4) = 0$, akar: $x = 1$ dan $x = 4$",
        "$a = 1 > 0$: parabola terbuka atas",
        "$f(x) < 0$ untuk $1 < x < 4$"
      ],
      formula: "1 < x < 4"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sulit", category: "ANBK – Analisis Data",
    question: "Ketinggian air dalam kolam dinyatakan $h(t) = -t^2 + 6t$ cm ($t$ dalam menit). Kolam mencapai ketinggian $8$ cm pertama kali pada menit ke ...",
    options: ["A. $t = 2$", "B. $t = 3$", "C. $t = 4$", "D. $t = 6$"],
    correctAnswer: "A. $t = 2$",
    explanation: {
      concept: "Selesaikan $h(t) = 8$ untuk mencari nilai $t$.",
      steps: [
        "$-t^2 + 6t = 8$",
        "$t^2 - 6t + 8 = 0$",
        "$(t-2)(t-4) = 0$",
        "$t = 2$ (pertama kali) atau $t = 4$"
      ],
      formula: "t^2 - 6t + 8 = 0 \\Rightarrow t=2 \\text{ (pertama)}"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sulit", category: "TKA – Puncak dan Akar",
    question: "Fungsi kuadrat $f(x) = ax^2 + bx + c$ dengan $a > 0$. Jika puncaknya di $(2, -9)$ dan salah satu akarnya $x = -1$, maka nilai $a$ adalah ...",
    options: ["A. $1$", "B. $2$", "C. $3$", "D. $4$"],
    correctAnswer: "A. $1$",
    explanation: {
      concept: "Gunakan bentuk vertex dan substitusi titik akar.",
      steps: [
        "$f(x) = a(x-2)^2 - 9$",
        "Akar $x = -1$: $f(-1) = 0$",
        "$0 = a(-3)^2 - 9 = 9a - 9$",
        "$a = 1$"
      ],
      formula: "9a - 9 = 0 \\Rightarrow a = 1"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sulit", category: "HOTS – Fungsi Genap/Ganjil",
    question: "Fungsi $f(x) = 2x^2 - 8$ termasuk fungsi ...",
    options: [
      "A. Fungsi ganjil karena $f(-x) = -f(x)$",
      "B. Fungsi genap karena $f(-x) = f(x)$",
      "C. Bukan fungsi genap maupun ganjil",
      "D. Fungsi konstan"
    ],
    correctAnswer: "B. Fungsi genap karena $f(-x) = f(x)$",
    explanation: {
      concept: "Fungsi genap jika $f(-x) = f(x)$ untuk semua $x$.",
      steps: [
        "$f(-x) = 2(-x)^2 - 8 = 2x^2 - 8 = f(x)$",
        "Karena $f(-x) = f(x)$, fungsi ini adalah fungsi genap.",
        "Grafiknya simetris terhadap sumbu-$y$."
      ],
      formula: "f(-x) = 2x^2 - 8 = f(x) \\Rightarrow \\text{fungsi genap}"
    }
  },

  /* ══════════ MCMA — MUDAH (Q41–Q50) ══════════ */
  {
    id: 41, type: "MCMA", difficulty: "Mudah", category: "UN – Ciri Fungsi Kuadrat",
    question: "Pernyataan mana yang BENAR mengenai fungsi kuadrat $f(x) = ax^2 + bx + c$ dengan $a \\neq 0$? Pilih semua yang benar.",
    statements: [
      { text: "Grafik fungsi kuadrat berbentuk parabola", isCorrect: true },
      { text: "Domain fungsi kuadrat adalah semua bilangan real ($\\mathbb{R}$)", isCorrect: true },
      { text: "Jika $a > 0$, parabola terbuka ke bawah", isCorrect: false },
      { text: "Fungsi kuadrat memiliki tepat satu titik ekstrem (puncak)", isCorrect: true }
    ],
    explanation: {
      concept: "Sifat-sifat dasar fungsi kuadrat.",
      steps: [
        "(1) BENAR: grafik fungsi kuadrat selalu berbentuk parabola.",
        "(2) BENAR: $D_f = \\mathbb{R}$ karena terdefinisi untuk semua $x$.",
        "(3) SALAH: $a > 0$ berarti parabola terbuka ke ATAS, bukan ke bawah.",
        "(4) BENAR: tepat satu puncak di $(x_p, y_p)$."
      ],
      formula: "a > 0 \\Rightarrow \\text{terbuka atas} \\quad a < 0 \\Rightarrow \\text{terbuka bawah}"
    }
  },
  {
    id: 42, type: "MCMA", difficulty: "Mudah", category: "UN – Titik Puncak",
    question: "Untuk $f(x) = x^2 - 4x + 3$, pernyataan mana yang BENAR? Pilih semua yang benar.",
    statements: [
      { text: "Titik puncak parabola adalah $(2, -1)$", isCorrect: true },
      { text: "Sumbu simetri: $x = 2$", isCorrect: true },
      { text: "Nilai minimum fungsi adalah $-1$", isCorrect: true },
      { text: "Fungsi memiliki nilai maksimum $= 3$", isCorrect: false }
    ],
    explanation: {
      concept: "$a = 1 > 0$, parabola terbuka ke atas, memiliki nilai minimum.",
      steps: [
        "$x_p = -(-4)/(2 \\cdot 1) = 2$",
        "$y_p = f(2) = 4 - 8 + 3 = -1$ ✓",
        "Sumbu simetri $x = 2$ ✓",
        "Nilai min $= -1$ ✓",
        "(4) SALAH: fungsi memiliki minimum, bukan maksimum."
      ],
      formula: "P(2, -1),\\; x = 2,\\; f_{min} = -1"
    }
  },
  {
    id: 43, type: "MCMA", difficulty: "Mudah", category: "UN – Titik Potong",
    question: "Untuk $f(x) = x^2 - 4$, pernyataan mana yang BENAR? Pilih semua yang benar.",
    statements: [
      { text: "Grafik memotong sumbu-$x$ di $(2, 0)$ dan $(-2, 0)$", isCorrect: true },
      { text: "Grafik memotong sumbu-$y$ di $(0, -4)$", isCorrect: true },
      { text: "Diskriminan $D = 16$", isCorrect: true },
      { text: "Titik puncak di $(0, 0)$", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis titik potong dan diskriminan $f(x) = x^2 - 4$.",
      steps: [
        "(1) $x^2 = 4 \\Rightarrow x = \\pm 2$ ✓",
        "(2) $f(0) = -4$ ✓ → titik $(0, -4)$",
        "(3) $D = 0^2 - 4(1)(-4) = 16$ ✓",
        "(4) SALAH: puncak di $(0, -4)$, bukan $(0, 0)$"
      ],
      formula: "D = 0 - 4(1)(-4) = 16"
    }
  },
  {
    id: 44, type: "MCMA", difficulty: "Mudah", category: "UN – Nilai Fungsi",
    question: "Untuk $f(x) = 2x^2 - x - 3$, pilih pernyataan yang BENAR.",
    statements: [
      { text: "$f(0) = -3$", isCorrect: true },
      { text: "$f(1) = -2$", isCorrect: true },
      { text: "$f(-1) = 4$", isCorrect: false },
      { text: "$f(2) = 3$", isCorrect: true }
    ],
    explanation: {
      concept: "Substitusi nilai $x$ ke dalam fungsi.",
      steps: [
        "$f(0) = 0 - 0 - 3 = -3$ ✓",
        "$f(1) = 2 - 1 - 3 = -2$ ✓",
        "$f(-1) = 2 + 1 - 3 = 0$ → SALAH (bukan 4)",
        "$f(2) = 8 - 2 - 3 = 3$ ✓"
      ],
      formula: "f(-1) = 2(1) - (-1) - 3 = 0 \\neq 4"
    }
  },
  {
    id: 45, type: "MCMA", difficulty: "Mudah", category: "UN – Koefisien",
    question: "Fungsi $f(x) = -2x^2 + 5x - 1$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Koefisien $a = -2$", isCorrect: true },
      { text: "Koefisien $b = 5$", isCorrect: true },
      { text: "Konstanta $c = 1$", isCorrect: false },
      { text: "Parabola terbuka ke bawah karena $a < 0$", isCorrect: true }
    ],
    explanation: {
      concept: "Identifikasi koefisien dari bentuk umum.",
      steps: [
        "$a = -2$ ✓",
        "$b = 5$ ✓",
        "$c = -1$ → SALAH (konstanta adalah $-1$, bukan $1$)",
        "$a = -2 < 0$ → terbuka ke bawah ✓"
      ],
      formula: "f(x) = -2x^2 + 5x - 1 \\Rightarrow a=-2, b=5, c=-1"
    }
  },
  {
    id: 46, type: "MCMA", difficulty: "Mudah", category: "UN – Domain & Range",
    question: "Untuk $f(x) = x^2 + 2x - 8$ dengan $a = 1 > 0$, pernyataan mana yang BENAR?",
    statements: [
      { text: "Domain fungsi adalah $\\mathbb{R}$", isCorrect: true },
      { text: "Fungsi memiliki nilai minimum", isCorrect: true },
      { text: "Range fungsi adalah $(-\\infty, -9]$", isCorrect: false },
      { text: "Nilai minimum sama dengan ordinat titik puncak", isCorrect: true }
    ],
    explanation: {
      concept: "$a = 1 > 0$ → minimum. Puncak: $x_p = -1$, $y_p = 1 - 2 - 8 = -9$.",
      steps: [
        "(1) $D_f = \\mathbb{R}$ ✓",
        "(2) $a > 0$ → minimum ✓",
        "(3) SALAH: Range $= [-9, +\\infty)$, bukan $(-\\infty, -9]$",
        "(4) $y_{min} = y_p$ ✓"
      ],
      formula: "y_{min} = f(-1) = -9 \\Rightarrow R_f = [-9, +\\infty)"
    }
  },
  {
    id: 47, type: "MCMA", difficulty: "Mudah", category: "UN – Parabola",
    question: "Grafik $f(x) = 3x^2 - 12x + 9$. Pilih pernyataan yang BENAR.",
    statements: [
      { text: "Parabola terbuka ke atas", isCorrect: true },
      { text: "Sumbu simetri: $x = 2$", isCorrect: true },
      { text: "Titik puncak: $(2, -3)$", isCorrect: true },
      { text: "Titik potong sumbu-$y$: $(0, -9)$", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis $f(x) = 3x^2 - 12x + 9$, $a=3, b=-12, c=9$.",
      steps: [
        "(1) $a = 3 > 0$ → terbuka atas ✓",
        "(2) $x_p = 12/(2 \\cdot 3) = 2$ ✓",
        "(3) $f(2) = 12 - 24 + 9 = -3$ → puncak $(2,-3)$ ✓",
        "(4) SALAH: $f(0) = 9$ → titik $(0, 9)$, bukan $(0,-9)$"
      ],
      formula: "x_p = 2,\\; f(2) = -3,\\; f(0) = 9"
    }
  },
  {
    id: 48, type: "MCMA", difficulty: "Mudah", category: "KONTEKSTUAL – Tinggi",
    question: "Bola dilempar dengan $h(t) = -5t^2 + 10t + 2$ meter. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Tinggi awal bola (saat $t=0$) adalah $2$ m", isCorrect: true },
      { text: "Tinggi maksimum dicapai saat $t = 1$ detik", isCorrect: true },
      { text: "Tinggi maksimum adalah $7$ m", isCorrect: true },
      { text: "Bola sudah di atas tanah saat $t = 3$ detik", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis fungsi ketinggian.",
      steps: [
        "(1) $h(0) = 2$ m ✓",
        "(2) $t_p = -10/(2 \\times -5) = 1$ detik ✓",
        "(3) $h(1) = -5 + 10 + 2 = 7$ m ✓",
        "(4) $h(3) = -45 + 30 + 2 = -13 < 0$ → SALAH (sudah di bawah tanah)"
      ],
      formula: "h_{maks} = h(1) = 7 \\text{ m}"
    }
  },
  {
    id: 49, type: "MCMA", difficulty: "Mudah", category: "UN – Bentuk Umum",
    question: "Manakah yang merupakan fungsi kuadrat? Pilih semua yang benar.",
    statements: [
      { text: "$f(x) = x^2 - 1$", isCorrect: true },
      { text: "$g(x) = 5x + 3$", isCorrect: false },
      { text: "$h(x) = -4x^2$", isCorrect: true },
      { text: "$p(x) = \\sqrt{x} + 2$", isCorrect: false }
    ],
    explanation: {
      concept: "Fungsi kuadrat: derajat 2, bentuk $ax^2 + bx + c$ dengan $a \\neq 0$.",
      steps: [
        "(1) $f(x) = x^2 - 1$: derajat 2 ✓ ($a=1$)",
        "(2) $g(x)$: derajat 1 (linear) ✗",
        "(3) $h(x) = -4x^2$: derajat 2 ✓ ($a=-4$, $b=c=0$)",
        "(4) $p(x)$: fungsi irasional ✗"
      ],
      formula: "\\deg = 2 \\text{ dan } a \\neq 0"
    }
  },
  {
    id: 50, type: "MCMA", difficulty: "Mudah", category: "UN – Diskriminan",
    question: "Diskriminan fungsi $f(x) = x^2 - 6x + 9$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "$D = 0$", isCorrect: true },
      { text: "Grafik memiliki tepat satu titik potong dengan sumbu-$x$", isCorrect: true },
      { text: "Fungsi memiliki akar kembar $x = 3$", isCorrect: true },
      { text: "Grafik tidak menyentuh sumbu-$x$", isCorrect: false }
    ],
    explanation: {
      concept: "$f(x) = (x-3)^2$, diskriminan $D = 36 - 36 = 0$.",
      steps: [
        "(1) $D = (-6)^2 - 4(1)(9) = 36 - 36 = 0$ ✓",
        "(2) $D = 0$ → 1 titik potong dengan sumbu-$x$ ✓",
        "(3) $(x-3)^2 = 0 \\Rightarrow x = 3$ (kembar) ✓",
        "(4) SALAH: grafik menyentuh sumbu-$x$ di $(3, 0)$"
      ],
      formula: "D = 0 \\Rightarrow \\text{akar kembar } x = 3"
    }
  },

  /* ══════════ MCMA — SEDANG (Q51–Q60) ══════════ */
  {
    id: 51, type: "MCMA", difficulty: "Sedang", category: "UN – Analisis Grafik",
    question: "Grafik parabola $f(x) = -x^2 + 4x - 3$. Pernyataan mana yang BENAR? Pilih semua.",
    svgKey: "grafik-down-1",
    statements: [
      { text: "Parabola terbuka ke bawah", isCorrect: true },
      { text: "Titik puncak adalah $(2, 1)$", isCorrect: true },
      { text: "Nilai maksimum fungsi adalah $1$", isCorrect: true },
      { text: "Range fungsi: $f(x) \\leq 3$", isCorrect: false }
    ],
    explanation: {
      concept: "$a = -1 < 0$ → terbuka bawah, puncak adalah maksimum.",
      steps: [
        "(1) $a = -1 < 0$ → terbuka ke bawah ✓",
        "(2) $x_p = -4/(2 \\times -1) = 2$; $f(2) = -4+8-3 = 1$ → puncak $(2,1)$ ✓",
        "(3) nilai maks $= 1$ ✓",
        "(4) SALAH: range $= (-\\infty, 1]$, bukan $(-\\infty, 3]$"
      ],
      formula: "f_{maks} = 1 \\Rightarrow R_f = (-\\infty, 1]"
    }
  },
  {
    id: 52, type: "MCMA", difficulty: "Sedang", category: "HOTS – Menyusun Fungsi",
    question: "Fungsi kuadrat $f(x) = a(x+1)(x-3)$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Titik potong sumbu-$x$ di $(-1, 0)$ dan $(3, 0)$ untuk semua nilai $a \\neq 0$", isCorrect: true },
      { text: "Jika $a = 1$: $f(x) = x^2 - 2x - 3$", isCorrect: true },
      { text: "Sumbu simetri: $x = 1$ untuk semua nilai $a \\neq 0$", isCorrect: true },
      { text: "Jika $a = -1$: nilai maksimum $= 4$", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis $f(x) = a(x+1)(x-3)$.",
      steps: [
        "(1) Akar selalu $x = -1$ atau $x = 3$ ✓",
        "(2) $a=1$: $(x+1)(x-3) = x^2-2x-3$ ✓",
        "(3) Sumbu simetri $= (-1+3)/2 = 1$ ✓",
        "(4) $a=-1$: $f(x) = -(x+1)(x-3)$; maks di $x=1$: $f(1) = -(2)(-2) = 4$ ✓"
      ],
      formula: "x_{simetri} = \\frac{-1+3}{2} = 1"
    }
  },
  {
    id: 53, type: "MCMA", difficulty: "Sedang", category: "TKA – Bentuk Vertex",
    question: "Fungsi $f(x) = 2x^2 - 8x + 6$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Bentuk vertex: $f(x) = 2(x-2)^2 - 2$", isCorrect: true },
      { text: "Titik puncak: $(2, -2)$", isCorrect: true },
      { text: "Nilai minimum $= -2$", isCorrect: true },
      { text: "Grafik memotong sumbu-$x$ di $(1,0)$ dan $(3,0)$", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis lengkap $f(x) = 2x^2 - 8x + 6$.",
      steps: [
        "(1) $2(x^2-4x)+6 = 2(x-2)^2 - 8 + 6 = 2(x-2)^2-2$ ✓",
        "(2) Puncak $(2,-2)$ ✓",
        "(3) Min $= -2$ ✓",
        "(4) $2x^2-8x+6=0 \\Rightarrow x^2-4x+3=0 \\Rightarrow (x-1)(x-3)=0$ ✓"
      ],
      formula: "f(x) = 2(x-2)^2-2"
    }
  },
  {
    id: 54, type: "MCMA", difficulty: "Sedang", category: "ANBK – Kontekstual Pagar",
    question: "Kebun persegi panjang dipagar dengan 60 m kawat. Lebar $x$ m, panjang $= 30 - x$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Luas $L(x) = -x^2 + 30x$", isCorrect: true },
      { text: "Luas maksimum saat $x = 15$", isCorrect: true },
      { text: "Luas maksimum $= 225$ m²", isCorrect: true },
      { text: "Kebun berbentuk persegi saat luas maksimum", isCorrect: true }
    ],
    explanation: {
      concept: "Optimasi luas persegi panjang dengan keliling tetap.",
      steps: [
        "(1) $L = x(30-x) = -x^2+30x$ ✓",
        "(2) $x_p = -30/(2 \\times -1) = 15$ ✓",
        "(3) $L(15) = 225-0=225$... tunggu: $L(15) = -(225)+450 = 225$ ✓",
        "(4) $x = 15 \\Rightarrow p = 15$: persegi ✓"
      ],
      formula: "L_{maks} = L(15) = 225 \\text{ m}^2"
    }
  },
  {
    id: 55, type: "MCMA", difficulty: "Sedang", category: "HOTS – Sifat Fungsi",
    question: "Fungsi $f(x) = x^2 - 2x - 8$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "$f(x) > 0$ untuk $x < -2$ atau $x > 4$", isCorrect: true },
      { text: "$f(x) < 0$ untuk $-2 < x < 4$", isCorrect: true },
      { text: "Akar-akar: $x = -2$ dan $x = 4$", isCorrect: true },
      { text: "$f(0) = 8$", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis tanda $f(x)$ berdasarkan akar dan $a > 0$.",
      steps: [
        "(3) $(x+2)(x-4) = 0 \\Rightarrow x = -2$ atau $x = 4$ ✓",
        "(1) $a > 0$: $f > 0$ di luar akar ✓",
        "(2) $f < 0$ di antara akar ✓",
        "(4) SALAH: $f(0) = 0 - 0 - 8 = -8$, bukan $8$"
      ],
      formula: "f(x) = (x+2)(x-4)"
    }
  },
  {
    id: 56, type: "MCMA", difficulty: "Sedang", category: "UN – Diskriminan & Sifat Akar",
    question: "Untuk $f(x) = x^2 - 4x + k$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Jika $k < 4$: grafik memotong sumbu-$x$ di 2 titik", isCorrect: true },
      { text: "Jika $k = 4$: grafik menyentuh sumbu-$x$ di 1 titik", isCorrect: true },
      { text: "Jika $k > 4$: grafik tidak memotong sumbu-$x$", isCorrect: true },
      { text: "Jika $k = 0$: akar-akarnya $x = 0$ dan $x = 4$", isCorrect: true }
    ],
    explanation: {
      concept: "$D = 16 - 4k$. Analisis berdasarkan nilai $k$.",
      steps: [
        "(1) $k < 4 \\Rightarrow D > 0$ → 2 titik ✓",
        "(2) $k = 4 \\Rightarrow D = 0$ → 1 titik ✓",
        "(3) $k > 4 \\Rightarrow D < 0$ → tidak memotong ✓",
        "(4) $k=0$: $x^2-4x=x(x-4)=0 \\Rightarrow x=0$ atau $x=4$ ✓"
      ],
      formula: "D = 16 - 4k"
    }
  },
  {
    id: 57, type: "MCMA", difficulty: "Sedang", category: "LITERASI MATEMATIKA – Proyektil",
    question: "Roket mainan dengan lintasan $h(t) = -4t^2 + 16t$ meter. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Tinggi maksimum $16$ m dicapai saat $t = 2$ detik", isCorrect: true },
      { text: "Roket kembali ke tanah saat $t = 4$ detik", isCorrect: true },
      { text: "Roket membutuhkan $2$ detik untuk turun dari puncak ke tanah", isCorrect: true },
      { text: "Tinggi roket saat $t = 1$ sama dengan saat $t = 4$", isCorrect: false }
    ],
    explanation: {
      concept: "$h(t) = -4t^2 + 16t = -4t(t-4)$.",
      steps: [
        "(1) $t_p = 2$, $h(2) = -16+32 = 16$ m ✓",
        "(2) $h(t)=0 \\Rightarrow t=0$ atau $t=4$ ✓",
        "(3) Dari puncak ($t=2$) ke tanah ($t=4$): 2 detik ✓",
        "(4) $h(1) = -4+16 = 12$; $h(4) = 0$ → SALAH"
      ],
      formula: "h_{maks} = 16 \\text{ m saat } t=2"
    }
  },
  {
    id: 58, type: "MCMA", difficulty: "Sedang", category: "ANBK – Membaca Grafik",
    question: "Grafik parabola melalui $(0, 6)$, $(1, 3)$, $(3, 3)$, dan titik puncak $(2, 2)$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Fungsi tersebut adalah $f(x) = x^2 - 4x + 6$", isCorrect: true },
      { text: "Sumbu simetri: $x = 2$", isCorrect: true },
      { text: "Grafik tidak memotong sumbu-$x$", isCorrect: true },
      { text: "Nilai minimum fungsi adalah $0$", isCorrect: false }
    ],
    explanation: {
      concept: "Tentukan fungsi dari puncak $(2,2)$ dan titik $(0,6)$.",
      steps: [
        "Bentuk vertex: $f(x) = a(x-2)^2 + 2$",
        "Substitusi $(0,6)$: $6 = 4a + 2 \\Rightarrow a = 1$",
        "$f(x) = (x-2)^2 + 2 = x^2-4x+6$ ✓",
        "(3) $D = 16-24 = -8 < 0$ → tidak memotong sumbu-$x$ ✓",
        "(4) SALAH: nilai minimum $= 2$, bukan $0$"
      ],
      formula: "f(x) = (x-2)^2 + 2 = x^2 - 4x + 6"
    }
  },
  {
    id: 59, type: "MCMA", difficulty: "Sedang", category: "HOTS – Fungsi Positif Negatif",
    question: "Fungsi $f(x) = -x^2 + 5x - 6$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Akar-akar: $x = 2$ dan $x = 3$", isCorrect: true },
      { text: "$f(x) > 0$ untuk $2 < x < 3$", isCorrect: true },
      { text: "$f(x) < 0$ untuk $x < 2$ atau $x > 3$", isCorrect: true },
      { text: "Nilai maksimum fungsi $= \\dfrac{1}{4}$", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis $f(x) = -(x-2)(x-3)$.",
      steps: [
        "(1) $-x^2+5x-6=-(x-2)(x-3)=0 \\Rightarrow x=2$ atau $x=3$ ✓",
        "(2) $a < 0$: $f > 0$ di antara akar ✓",
        "(3) $f < 0$ di luar akar ✓",
        "(4) $x_p = 5/2$; $f(5/2) = -6.25+12.5-6 = 0.25 = 1/4$ ✓"
      ],
      formula: "f_{maks} = f(5/2) = 1/4"
    }
  },
  {
    id: 60, type: "MCMA", difficulty: "Sedang", category: "TKA – Parameter Fungsi",
    question: "Fungsi $f(x) = ax^2 + bx + 1$ memiliki puncak di $(1, 4)$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "$k = 4$, sehingga $a(1-1)^2 + 4 = 4$ ✓", isCorrect: true },
      { text: "Nilai $a = -3$", isCorrect: true },
      { text: "Nilai $b = 6$", isCorrect: true },
      { text: "Fungsi tersebut terbuka ke atas", isCorrect: false }
    ],
    explanation: {
      concept: "Puncak $(1, 4)$: gunakan bentuk vertex $f(x) = a(x-1)^2 + 4$.",
      steps: [
        "Substitusi $(0, 1)$ → $c = 1$: $1 = a(0-1)^2 + 4 = a + 4 \\Rightarrow a = -3$",
        "$b = -2ah = -2(-3)(1) = 6$ ✓",
        "(4) SALAH: $a = -3 < 0$ → terbuka ke bawah"
      ],
      formula: "a = -3,\\; b = 6,\\; c = 1"
    }
  },

  /* ══════════ MCMA — SULIT (Q61–Q70) ══════════ */
  {
    id: 61, type: "MCMA", difficulty: "Sulit", category: "HOTS – Analisis Fungsi",
    question: "Fungsi $f(x) = x^2 - (m+1)x + m$ memiliki dua akar real berbeda. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Akar-akar fungsi adalah $x = 1$ dan $x = m$", isCorrect: true },
      { text: "Syarat dua akar real berbeda: $m \\neq 1$", isCorrect: true },
      { text: "Jumlah akar-akar $= m + 1$", isCorrect: true },
      { text: "Hasil kali akar-akar $= m + 1$", isCorrect: false }
    ],
    explanation: {
      concept: "$f(x) = x^2-(m+1)x+m = (x-1)(x-m)$.",
      steps: [
        "(1) $(x-1)(x-m)=0 \\Rightarrow x=1$ atau $x=m$ ✓",
        "(2) Dua akar berbeda jika $m \\neq 1$ ✓",
        "(3) Jumlah $= 1+m = m+1$ ✓",
        "(4) SALAH: Hasil kali $= 1 \\cdot m = m$, bukan $m+1$"
      ],
      formula: "f(x) = (x-1)(x-m)"
    }
  },
  {
    id: 62, type: "MCMA", difficulty: "Sulit", category: "HOTS – Komposisi & Transformasi",
    question: "Grafik $g(x) = f(x) + 3$ dimana $f(x) = x^2 - 4x + 1$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "$g(x) = x^2 - 4x + 4$", isCorrect: true },
      { text: "Titik puncak $g$ adalah $(2, 0)$", isCorrect: true },
      { text: "$g(x) = (x-2)^2$", isCorrect: true },
      { text: "Grafik $g$ memotong sumbu-$x$ di dua titik berbeda", isCorrect: false }
    ],
    explanation: {
      concept: "$g(x) = f(x) + 3$ adalah pergeseran vertikal ke atas 3 satuan.",
      steps: [
        "$g(x) = x^2-4x+1+3 = x^2-4x+4$ ✓",
        "$g(x) = (x-2)^2$ ✓",
        "Puncak $(2, 0)$ ✓",
        "(4) SALAH: $D = 0$ → menyentuh sumbu-$x$ di 1 titik saja"
      ],
      formula: "g(x) = (x-2)^2"
    }
  },
  {
    id: 63, type: "MCMA", difficulty: "Sulit", category: "TKA – Nilai Ekstrem Terbatas",
    question: "Fungsi $f(x) = -x^2 + 6x - 5$ pada domain $1 \\leq x \\leq 5$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Nilai maksimum $f$ adalah $4$, dicapai saat $x = 3$", isCorrect: true },
      { text: "Nilai minimum $f$ adalah $0$, dicapai di ujung domain", isCorrect: true },
      { text: "Range fungsi pada domain ini: $[0, 4]$", isCorrect: true },
      { text: "Nilai $f$ di $x=1$ dan $x=5$ sama", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis $f$ pada $[1,5]$. Puncak di $x = 3$.",
      steps: [
        "$x_p = -6/(2 \\times -1) = 3$; $f(3) = -9+18-5 = 4$ (maks) ✓",
        "$f(1) = -1+6-5 = 0$; $f(5) = -25+30-5 = 0$ (min) ✓",
        "Range $= [0, 4]$ ✓",
        "$f(1) = f(5) = 0$ ✓ (simetris terhadap $x=3$)"
      ],
      formula: "f_{maks} = 4,\\; f_{min} = 0"
    }
  },
  {
    id: 64, type: "MCMA", difficulty: "Sulit", category: "HOTS – Fungsi Selalu Definit",
    question: "Fungsi $f(x) = x^2 + px + 9$ selalu bernilai positif untuk semua $x \\in \\mathbb{R}$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Syaratnya adalah $D < 0$", isCorrect: true },
      { text: "$p^2 - 36 < 0 \\Rightarrow -6 < p < 6$", isCorrect: true },
      { text: "Untuk $p = 5$: fungsi selalu positif", isCorrect: true },
      { text: "Untuk $p = 7$: grafik tidak memotong sumbu-$x$", isCorrect: false }
    ],
    explanation: {
      concept: "$a = 1 > 0$ dan $D < 0$ untuk selalu positif.",
      steps: [
        "(1) $D < 0$ ✓",
        "(2) $D = p^2 - 36 < 0 \\Rightarrow -6 < p < 6$ ✓",
        "(3) $p=5$: $D = 25-36 = -11 < 0$ → selalu positif ✓",
        "(4) $p=7$: $D = 49-36 = 13 > 0$ → memotong sumbu-$x$ di 2 titik → SALAH"
      ],
      formula: "D = p^2 - 36 < 0 \\Rightarrow -6 < p < 6"
    }
  },
  {
    id: 65, type: "MCMA", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Ekonomi",
    question: "Harga jual $p = 100 - 2q$ (dalam ribu), banyak barang $q$. Pendapatan $TR(q) = q \\cdot p$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "$TR(q) = -2q^2 + 100q$", isCorrect: true },
      { text: "Pendapatan maksimum saat $q = 25$", isCorrect: true },
      { text: "Pendapatan maksimum $= 1250$ ribu", isCorrect: true },
      { text: "Pendapatan $= 0$ hanya saat $q = 0$", isCorrect: false }
    ],
    explanation: {
      concept: "$TR = q(100-2q) = -2q^2+100q$.",
      steps: [
        "(1) $TR = -2q^2+100q$ ✓",
        "(2) $q_p = -100/(2 \\times -2) = 25$ ✓",
        "(3) $TR(25) = -2(625)+2500 = 1250$ ✓",
        "(4) SALAH: $TR=0$ saat $q=0$ atau $q=50$"
      ],
      formula: "TR_{maks} = 1250 \\text{ (ribu) saat } q=25"
    }
  },
  {
    id: 66, type: "MCMA", difficulty: "Sulit", category: "HOTS – Pergeseran dan Refleksi",
    question: "Fungsi $g(x) = -f(x-2)$ dimana $f(x) = x^2 - 4$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "$g(x) = -(x-2)^2 + 4$", isCorrect: true },
      { text: "Titik puncak $g$ adalah $(2, 4)$", isCorrect: true },
      { text: "Parabola $g$ terbuka ke bawah", isCorrect: true },
      { text: "Nilai maksimum $g = -4$", isCorrect: false }
    ],
    explanation: {
      concept: "$g(x) = -f(x-2) = -[(x-2)^2-4] = -(x-2)^2+4$.",
      steps: [
        "(1) $g = -(x-2)^2+4$ ✓",
        "(2) Puncak $(2, 4)$ ✓",
        "(3) $a = -1 < 0$ → terbuka bawah ✓",
        "(4) SALAH: nilai maksimum $= 4$ (di puncak)"
      ],
      formula: "g(x) = -(x-2)^2 + 4"
    }
  },
  {
    id: 67, type: "MCMA", difficulty: "Sulit", category: "TKA – Sistem Persamaan",
    question: "Fungsi kuadrat $f(x) = ax^2 + bx + c$ dengan $f(0)=1$, $f(1)=0$, $f(-1)=4$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "$c = 1$", isCorrect: true },
      { text: "$a + b + c = 0 \\Rightarrow a + b = -1$", isCorrect: true },
      { text: "$a - b + c = 4 \\Rightarrow a - b = 3$", isCorrect: true },
      { text: "$a = 1,\\ b = -2$", isCorrect: true }
    ],
    explanation: {
      concept: "Gunakan tiga kondisi untuk menentukan $a, b, c$.",
      steps: [
        "$f(0) = c = 1$ ✓",
        "$f(1) = a+b+1 = 0 \\Rightarrow a+b = -1$ ✓",
        "$f(-1) = a-b+1 = 4 \\Rightarrow a-b = 3$ ✓",
        "$a+b=-1$ dan $a-b=3$: tambahkan: $2a=2 \\Rightarrow a=1$; $b=-2$ ✓"
      ],
      formula: "a=1,\\; b=-2,\\; c=1 \\Rightarrow f(x)=x^2-2x+1"
    }
  },
  {
    id: 68, type: "MCMA", difficulty: "Sulit", category: "HOTS – Grafik Perpotongan",
    question: "Parabola $f(x) = x^2 - 4$ dan garis $g(x) = 2x - 1$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Titik potong diperoleh dari $x^2 - 2x - 3 = 0$", isCorrect: true },
      { text: "Titik potong: $(3, 5)$ dan $(-1, -3)$", isCorrect: true },
      { text: "Diskriminan persamaan irisan $D = 16$", isCorrect: true },
      { text: "Garis memotong parabola di tepat satu titik", isCorrect: false }
    ],
    explanation: {
      concept: "Cari irisan $x^2-4 = 2x-1$.",
      steps: [
        "$x^2 - 2x - 3 = 0$ ✓",
        "$(x-3)(x+1) = 0 \\Rightarrow x=3$ atau $x=-1$",
        "$g(3)=5 \\Rightarrow (3,5)$; $g(-1)=-3 \\Rightarrow (-1,-3)$ ✓",
        "(3) $D = 4+12 = 16$ ✓",
        "(4) SALAH: ada 2 titik potong"
      ],
      formula: "x^2 - 2x - 3 = 0 \\Rightarrow x = 3 \\text{ atau } x = -1"
    }
  },
  {
    id: 69, type: "MCMA", difficulty: "Sulit", category: "ANBK – Model Matematika",
    question: "Luas persegi panjang $144$ cm², panjang lebih $6$ cm dari lebar. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Jika lebar $= x$, maka $x(x+6) = 144$", isCorrect: true },
      { text: "Persamaan yang terbentuk: $x^2 + 6x - 144 = 0$", isCorrect: true },
      { text: "Lebar persegi panjang $= 9$ cm", isCorrect: true },
      { text: "Panjang persegi panjang $= 15$ cm", isCorrect: false }
    ],
    explanation: {
      concept: "Model: lebar $x$, panjang $x+6$.",
      steps: [
        "(1) $x(x+6) = 144$ ✓",
        "(2) $x^2+6x-144=0$ ✓",
        "(3) $(x-9)(x+16)=0 \\Rightarrow x=9$ (positif) ✓",
        "(4) SALAH: panjang $= 9+6 = 15$ cm → ini BENAR!"
      ],
      formula: "x = 9 \\Rightarrow \\text{panjang} = 15 \\text{ cm}"
    }
  },
  {
    id: 70, type: "MCMA", difficulty: "Sulit", category: "HOTS – Analisis Komprehensif",
    question: "Fungsi $f(x) = 2x^2 - 12x + 16$. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Bentuk vertex: $f(x) = 2(x-3)^2 - 2$", isCorrect: true },
      { text: "Akar-akar: $x = 2$ dan $x = 4$", isCorrect: true },
      { text: "$f(x) \\geq 0$ untuk $x \\leq 2$ atau $x \\geq 4$", isCorrect: true },
      { text: "Nilai minimum $= -4$", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis lengkap $f(x) = 2x^2-12x+16$.",
      steps: [
        "(1) $2(x^2-6x)+16 = 2(x-3)^2-18+16 = 2(x-3)^2-2$ ✓",
        "(2) $2x^2-12x+16=0 \\Rightarrow x^2-6x+8=(x-2)(x-4)=0 \\Rightarrow x=2,4$ ✓",
        "(3) $a > 0$: $f \\geq 0$ di luar akar ✓",
        "(4) SALAH: nilai min $= -2$ (dari vertex), bukan $-4$"
      ],
      formula: "f(x) = 2(x-3)^2 - 2 \\Rightarrow f_{min} = -2"
    }
  },

  /* ══════════ BENAR/SALAH — MUDAH (Q71–Q81) ══════════ */
  {
    id: 71, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Sifat Dasar",
    question: "Tentukan BENAR atau SALAH untuk fungsi $f(x) = x^2 - 4x + 3$!\n(1) Koefisien $a = 1$\n(2) Parabola terbuka ke atas\n(3) $f(0) = 3$\n(4) Sumbu simetri: $x = -2$",
    statements: [
      { text: "Koefisien $a = 1$ → BENAR", isCorrect: true },
      { text: "Parabola terbuka ke atas karena $a = 1 > 0$ → BENAR", isCorrect: true },
      { text: "$f(0) = 0 - 0 + 3 = 3$ → BENAR", isCorrect: true },
      { text: "Sumbu simetri $= -(-4)/(2 \\cdot 1) = 2$, bukan $-2$ → SALAH", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis dasar fungsi kuadrat $f(x) = x^2 - 4x + 3$.",
      steps: [
        "(1) $a = 1$ ✓",
        "(2) $a > 0$ → terbuka atas ✓",
        "(3) $f(0) = 3$ ✓",
        "(4) $x_p = 4/2 = 2 \\neq -2$ → SALAH"
      ],
      formula: "x_p = -\\frac{b}{2a} = \\frac{4}{2} = 2"
    }
  },
  {
    id: 72, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Nilai Fungsi",
    question: "Fungsi $f(x) = 2x^2 - 3$. Tentukan BENAR atau SALAH!\n(1) $f(0) = -3$\n(2) $f(1) = -1$\n(3) $f(-2) = 5$\n(4) $f(3) = 15$",
    statements: [
      { text: "$f(0) = 0 - 3 = -3$ → BENAR", isCorrect: true },
      { text: "$f(1) = 2 - 3 = -1$ → BENAR", isCorrect: true },
      { text: "$f(-2) = 2(4) - 3 = 8 - 3 = 5$ → BENAR", isCorrect: true },
      { text: "$f(3) = 2(9) - 3 = 18 - 3 = 15$ → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Substitusi nilai $x$ ke $f(x) = 2x^2 - 3$.",
      steps: [
        "(1) $f(0) = -3$ ✓",
        "(2) $f(1) = -1$ ✓",
        "(3) $f(-2) = 8 - 3 = 5$ ✓",
        "(4) $f(3) = 18 - 3 = 15$ ✓"
      ],
      formula: "f(x) = 2x^2 - 3"
    }
  },
  {
    id: 73, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Puncak Parabola",
    question: "Untuk $f(x) = -x^2 + 6x - 5$. Tentukan BENAR atau SALAH!\n(1) Titik puncak: $(3, 4)$\n(2) Nilai maksimum: $4$\n(3) $f(0) = -5$\n(4) Parabola terbuka ke atas",
    statements: [
      { text: "$x_p = 3$, $f(3) = -9+18-5 = 4$ → Puncak $(3,4)$ BENAR", isCorrect: true },
      { text: "Nilai maksimum $= 4$ → BENAR", isCorrect: true },
      { text: "$f(0) = -5$ → BENAR", isCorrect: true },
      { text: "$a = -1 < 0$ → terbuka ke bawah, bukan ke atas → SALAH", isCorrect: false }
    ],
    explanation: {
      concept: "$a = -1 < 0$ → parabola terbuka ke bawah, nilai maks di puncak.",
      steps: [
        "(1) $x_p = 3$, $f(3) = 4$ ✓",
        "(2) Maks $= 4$ ✓",
        "(3) $f(0) = -5$ ✓",
        "(4) $a < 0$ → terbuka BAWAH → SALAH"
      ],
      formula: "f_{maks} = f(3) = 4"
    }
  },
  {
    id: 74, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Domain Range",
    question: "Fungsi $f(x) = x^2 + 2x + 1$. Tentukan BENAR atau SALAH!\n(1) Domain fungsi: $\\{x \\mid x \\in \\mathbb{R}\\}$\n(2) $f(x) = (x+1)^2$\n(3) Nilai minimum $= 0$ saat $x = -1$\n(4) Range: $f(x) \\leq 0$",
    statements: [
      { text: "Domain $= \\mathbb{R}$ → BENAR", isCorrect: true },
      { text: "$f(x) = (x+1)^2$ → BENAR", isCorrect: true },
      { text: "Minimum $= 0$ saat $x = -1$ → BENAR", isCorrect: true },
      { text: "Range $f(x) \\leq 0$ → SALAH, seharusnya $f(x) \\geq 0$", isCorrect: false }
    ],
    explanation: {
      concept: "$f(x) = (x+1)^2 \\geq 0$ untuk semua $x$.",
      steps: [
        "(1) $D_f = \\mathbb{R}$ ✓",
        "(2) $(x+1)^2 = x^2+2x+1$ ✓",
        "(3) Min $= 0$ saat $x = -1$ ✓",
        "(4) SALAH: $(x+1)^2 \\geq 0$, range $= [0, +\\infty)$"
      ],
      formula: "R_f = [0, +\\infty)"
    }
  },
  {
    id: 75, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Bentuk Vertex",
    question: "$f(x) = (x-2)^2 + 3$. Tentukan BENAR atau SALAH!\n(1) Puncak di $(2, 3)$\n(2) Sumbu simetri: $x = 2$\n(3) $a = 1$, terbuka ke atas\n(4) $f(0) = 3$",
    statements: [
      { text: "Puncak $(2, 3)$ → BENAR", isCorrect: true },
      { text: "Sumbu simetri $x = 2$ → BENAR", isCorrect: true },
      { text: "$a = 1 > 0$ → terbuka ke atas → BENAR", isCorrect: true },
      { text: "$f(0) = (0-2)^2+3 = 4+3 = 7 \\neq 3$ → SALAH", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis fungsi dalam bentuk vertex.",
      steps: [
        "(1) $h = 2, k = 3$ → $(2,3)$ ✓",
        "(2) Sumbu simetri $x = h = 2$ ✓",
        "(3) $a = 1 > 0$ ✓",
        "(4) $f(0) = 4+3 = 7 \\neq 3$ → SALAH"
      ],
      formula: "f(0) = (0-2)^2 + 3 = 7"
    }
  },
  {
    id: 76, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Diskriminan",
    question: "$f(x) = x^2 + 2x + 5$. Tentukan BENAR atau SALAH!\n(1) $D = 4 - 20 = -16$\n(2) Grafik tidak memotong sumbu-$x$\n(3) $a = 1 > 0$ dan $D < 0$, jadi $f(x) > 0$ selalu\n(4) Grafik memotong sumbu-$x$ di dua titik",
    statements: [
      { text: "$D = 4 - 20 = -16$ → BENAR", isCorrect: true },
      { text: "$D < 0$ → tidak memotong sumbu-$x$ → BENAR", isCorrect: true },
      { text: "$a > 0$ dan $D < 0$ → $f(x) > 0$ untuk semua $x$ → BENAR", isCorrect: true },
      { text: "$D < 0$ → tidak ada titik potong, bukan 2 titik → SALAH", isCorrect: false }
    ],
    explanation: {
      concept: "$D = b^2-4ac = 4-20 = -16 < 0$.",
      steps: [
        "(1) $D = -16$ ✓",
        "(2) Tidak memotong ✓",
        "(3) $f(x) > 0$ selalu ✓",
        "(4) SALAH: tidak ada titik potong"
      ],
      formula: "D = -16 < 0 \\Rightarrow f(x) > 0 \\;\\forall x"
    }
  },
  {
    id: 77, type: "Benar/Salah", difficulty: "Mudah", category: "KONTEKSTUAL – Bola",
    question: "Tinggi bola: $h(t) = -t^2 + 4t$. Tentukan BENAR atau SALAH!\n(1) Tinggi awal: $h(0) = 0$\n(2) Tinggi maks: $4$ m saat $t = 2$ detik\n(3) Bola kembali ke tanah saat $t = 4$ detik\n(4) Bola mencapai $h = 3$ m saat $t = 1$ detik",
    statements: [
      { text: "$h(0) = 0$ m → BENAR", isCorrect: true },
      { text: "$t_p = 2$, $h(2) = -4+8 = 4$ m → BENAR", isCorrect: true },
      { text: "$h(t)=0$: $t(4-t)=0 \\Rightarrow t=4$ → BENAR", isCorrect: true },
      { text: "$h(1) = -1+4 = 3$ → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "$h(t) = -t^2+4t = t(4-t)$.",
      steps: [
        "(1) $h(0) = 0$ ✓",
        "(2) $t_p = 2$, $h_{maks} = 4$ ✓",
        "(3) $t = 4$ ✓",
        "(4) $h(1) = 3$ ✓"
      ],
      formula: "h_{maks} = h(2) = 4 \\text{ m}"
    }
  },
  {
    id: 78, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Titik Potong Sumbu",
    question: "$f(x) = x^2 - 5x + 6$. Tentukan BENAR atau SALAH!\n(1) Memotong sumbu-$x$ di $(2,0)$ dan $(3,0)$\n(2) Memotong sumbu-$y$ di $(0,6)$\n(3) Puncak di $(2{,}5,\\ -0{,}25)$\n(4) Nilai minimum $= -0{,}25$",
    statements: [
      { text: "$(x-2)(x-3)=0 \\Rightarrow x=2,3$ → BENAR", isCorrect: true },
      { text: "$f(0) = 6$ → titik $(0,6)$ → BENAR", isCorrect: true },
      { text: "$x_p = 5/2 = 2{,}5$; $f(2{,}5) = 6{,}25 - 12{,}5 + 6 = -0{,}25$ → BENAR", isCorrect: true },
      { text: "Min $= -0{,}25$ → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis lengkap $f(x) = x^2-5x+6$.",
      steps: [
        "(1) $(x-2)(x-3)=0$ ✓",
        "(2) $f(0) = 6$ ✓",
        "(3) $x_p = 2.5$, $y_p = -0.25$ ✓",
        "(4) Min $= -0.25$ ✓"
      ],
      formula: "x_p = 2.5,\\; f_{min} = -0.25"
    }
  },
  {
    id: 79, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Identifikasi",
    question: "Tentukan BENAR atau SALAH dari pernyataan berikut!\n(1) $y = 4x^2$ adalah fungsi kuadrat\n(2) $y = 4x + 2$ adalah fungsi kuadrat\n(3) $y = x^2 - x$ adalah fungsi kuadrat\n(4) $y = x^{1{,}5}$ adalah fungsi kuadrat",
    statements: [
      { text: "$y = 4x^2$: $a=4 \\neq 0$, derajat 2 → BENAR", isCorrect: true },
      { text: "$y = 4x+2$: derajat 1 (linear) → SALAH", isCorrect: false },
      { text: "$y = x^2-x$: $a=1 \\neq 0$, derajat 2 → BENAR", isCorrect: true },
      { text: "$y = x^{1.5}$: bukan polinomial, bukan kuadrat → SALAH", isCorrect: false }
    ],
    explanation: {
      concept: "Fungsi kuadrat: derajat 2, berbentuk $ax^2+bx+c$ dengan $a \\neq 0$.",
      steps: [
        "(1) $y=4x^2$: derajat 2 ✓",
        "(2) $y=4x+2$: derajat 1 → SALAH",
        "(3) $y=x^2-x$: derajat 2 ✓",
        "(4) $x^{1.5}$: bukan kuadrat → SALAH"
      ],
      formula: "\\deg = 2 \\Rightarrow \\text{fungsi kuadrat}"
    }
  },
  {
    id: 80, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Akar-akar",
    question: "$f(x) = x^2 - 9$. Tentukan BENAR atau SALAH!\n(1) Titik nol fungsi: $x = 3$ dan $x = -3$\n(2) $D = 36$\n(3) $f(x) \\geq 0$ untuk $x \\leq -3$ atau $x \\geq 3$\n(4) $f(x) < 0$ untuk $-3 < x < 3$",
    statements: [
      { text: "$x^2 = 9 \\Rightarrow x = \\pm 3$ → BENAR", isCorrect: true },
      { text: "$D = 0^2 - 4(1)(-9) = 36$ → BENAR", isCorrect: true },
      { text: "$a=1>0$: $f \\geq 0$ di luar akar → BENAR", isCorrect: true },
      { text: "$f < 0$ di antara akar → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "$f(x) = x^2 - 9 = (x-3)(x+3)$.",
      steps: [
        "(1) $x = \\pm 3$ ✓",
        "(2) $D = 36$ ✓",
        "(3) Di luar akar: $f \\geq 0$ ✓",
        "(4) Di antara akar: $f < 0$ ✓"
      ],
      formula: "f(x) = (x-3)(x+3)"
    }
  },
  {
    id: 81, type: "Benar/Salah", difficulty: "Mudah", category: "UN – Transformasi Sederhana",
    question: "Grafik $g(x) = x^2 + 3$. Tentukan BENAR atau SALAH!\n(1) Grafik $g$ adalah $f(x) = x^2$ yang digeser ke atas 3 satuan\n(2) Puncak $g$ di $(0, 3)$\n(3) Grafik $g$ tidak memotong sumbu-$x$\n(4) Range $g$: $g(x) \\geq 0$",
    statements: [
      { text: "Geser atas 3 satuan dari $x^2$ → BENAR", isCorrect: true },
      { text: "Puncak $(0,3)$ → BENAR", isCorrect: true },
      { text: "$D = 0 - 4(1)(3) = -12 < 0$ → tidak memotong → BENAR", isCorrect: true },
      { text: "Range $= [3, +\\infty)$, bukan $[0, +\\infty)$ → SALAH", isCorrect: false }
    ],
    explanation: {
      concept: "$g(x) = x^2 + 3$: pergeseran vertikal ke atas 3 satuan.",
      steps: [
        "(1) Geser atas 3 ✓",
        "(2) Puncak $(0,3)$ ✓",
        "(3) $D = -12 < 0$ ✓",
        "(4) SALAH: range $= [3, +\\infty)$"
      ],
      formula: "R_g = [3, +\\infty)"
    }
  },

  /* ══════════ BENAR/SALAH — SEDANG (Q82–Q92) ══════════ */
  {
    id: 82, type: "Benar/Salah", difficulty: "Sedang", category: "UN – Analisis Grafik",
    question: "$f(x) = 2x^2 - 8x + 6$. Tentukan BENAR atau SALAH!\n(1) Titik puncak: $(2, -2)$\n(2) Fungsi memotong sumbu-$x$ di $(1,0)$ dan $(3,0)$\n(3) Range: $f(x) \\geq -2$\n(4) Titik potong sumbu-$y$: $(0, 6)$",
    statements: [
      { text: "$x_p=2$, $f(2)=8-16+6=-2$ → Puncak $(2,-2)$ BENAR", isCorrect: true },
      { text: "$2x^2-8x+6=0 \\Rightarrow (x-1)(x-3)=0$ → BENAR", isCorrect: true },
      { text: "Min $= -2$ → Range $= [-2, +\\infty)$ → BENAR", isCorrect: true },
      { text: "$f(0) = 6$ → $(0,6)$ → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis komprehensif $f(x) = 2x^2-8x+6$.",
      steps: [
        "(1) $x_p = 2$, $f(2) = -2$ ✓",
        "(2) $x = 1$ atau $x = 3$ ✓",
        "(3) Range $[-2, +\\infty)$ ✓",
        "(4) $f(0) = 6$ ✓"
      ],
      formula: "f(x) = 2(x-2)^2 - 2"
    }
  },
  {
    id: 83, type: "Benar/Salah", difficulty: "Sedang", category: "HOTS – Bentuk Vertex",
    question: "Ubah $f(x) = x^2 - 8x + 10$ ke bentuk vertex. Tentukan BENAR atau SALAH!\n(1) $f(x) = (x-4)^2 - 6$\n(2) Titik puncak: $(4, -6)$\n(3) Nilai minimum: $-6$ saat $x = 4$\n(4) Sumbu simetri: $x = -4$",
    statements: [
      { text: "$(x-4)^2 - 16 + 10 = (x-4)^2 - 6$ → BENAR", isCorrect: true },
      { text: "Puncak $(4,-6)$ → BENAR", isCorrect: true },
      { text: "Min $= -6$ saat $x = 4$ → BENAR", isCorrect: true },
      { text: "Sumbu simetri $x = 4$, bukan $-4$ → SALAH", isCorrect: false }
    ],
    explanation: {
      concept: "Lengkapi kuadrat $x^2-8x+10$.",
      steps: [
        "(1) $(x^2-8x+16)-6 = (x-4)^2-6$ ✓",
        "(2) Puncak $(4,-6)$ ✓",
        "(3) Min $= -6$ ✓",
        "(4) SALAH: sumbu simetri $x = 4$, bukan $-4$"
      ],
      formula: "f(x) = (x-4)^2 - 6"
    }
  },
  {
    id: 84, type: "Benar/Salah", difficulty: "Sedang", category: "KONTEKSTUAL – Ekonomi",
    question: "Laba $L(x) = -2x^2 + 20x - 32$ (juta rupiah), $x$ = unit. Tentukan BENAR atau SALAH!\n(1) Laba nol saat $x = 2$ dan $x = 8$\n(2) Laba maks $= 18$ juta saat $x = 5$\n(3) Laba positif untuk $2 < x < 8$\n(4) Laba mulai $= -32$ juta saat belum produksi",
    statements: [
      { text: "$-2x^2+20x-32=0 \\Rightarrow x^2-10x+16=(x-2)(x-8)=0$ → BENAR", isCorrect: true },
      { text: "$x_p=5$, $L(5)=-50+100-32=18$ → BENAR", isCorrect: true },
      { text: "$a<0$, $L>0$ di antara akar $(2<x<8)$ → BENAR", isCorrect: true },
      { text: "$L(0) = -32$ juta (rugi modal awal) → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis fungsi laba kuadrat.",
      steps: [
        "(1) Akar $x=2$ dan $x=8$ ✓",
        "(2) $L(5) = 18$ juta ✓",
        "(3) $L > 0$ untuk $2 < x < 8$ ✓",
        "(4) $L(0) = -32$ juta ✓"
      ],
      formula: "L_{maks} = L(5) = 18 \\text{ juta}"
    }
  },
  {
    id: 85, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK – Membaca Grafik",
    question: "Parabola dengan $a = 1$, sumbu simetri $x = 3$, dan melewati $(0, 4)$. Tentukan BENAR atau SALAH!\n(1) Fungsinya $f(x) = (x-3)^2 - 5$\n(2) Nilai minimum $= -5$\n(3) Grafik memotong sumbu-$x$ di dua titik\n(4) Titik puncak di $(3, -5)$",
    statements: [
      { text: "$f(x) = a(x-3)^2+k$; $f(0)=9+k=4 \\Rightarrow k=-5$; $f(x)=(x-3)^2-5$ → BENAR", isCorrect: true },
      { text: "Min $= -5$ → BENAR", isCorrect: true },
      { text: "$D = 0+20 = 20 > 0$ → memotong di 2 titik → BENAR", isCorrect: true },
      { text: "Puncak $(3,-5)$ → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Tentukan fungsi dari data yang diketahui.",
      steps: [
        "(1) $k = 4 - 9 = -5$; $f(x) = (x-3)^2 - 5$ ✓",
        "(2) Min $= -5$ ✓",
        "(3) $D = 0 - 4(1)(-5) = 20 > 0$ ✓",
        "(4) Puncak $(3,-5)$ ✓"
      ],
      formula: "f(x) = (x-3)^2 - 5"
    }
  },
  {
    id: 86, type: "Benar/Salah", difficulty: "Sedang", category: "TKA – Sifat Fungsi",
    question: "$f(x) = -x^2 + bx - 9$ memiliki nilai maksimum $0$. Tentukan BENAR atau SALAH!\n(1) $D = 0$\n(2) $b^2 - 36 = 0 \\Rightarrow b = \\pm 6$\n(3) Jika $b = 6$: puncak di $(3, 0)$\n(4) Jika $b = 6$: fungsi menyentuh sumbu-$x$ di satu titik",
    statements: [
      { text: "Nilai maks $= 0 \\Rightarrow D = 0$ → BENAR", isCorrect: true },
      { text: "$D = b^2 - 4(-1)(-9) = b^2 - 36 = 0 \\Rightarrow b = \\pm 6$ → BENAR", isCorrect: true },
      { text: "$b=6$: $x_p = 6/(2 \\times 1) = 3$; $f(3) = -9+18-9 = 0$ → BENAR", isCorrect: true },
      { text: "$D = 0$ → satu titik sentuh → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Nilai maks $= 0$ dan $a < 0 \\Rightarrow D = 0$.",
      steps: [
        "(1) $D = 0$ ✓",
        "(2) $b = \\pm 6$ ✓",
        "(3) Puncak $(3,0)$ ✓",
        "(4) $D=0$ → satu titik ✓"
      ],
      formula: "D = b^2 - 36 = 0 \\Rightarrow b = \\pm 6"
    }
  },
  {
    id: 87, type: "Benar/Salah", difficulty: "Sedang", category: "HOTS – Nilai Fungsi Terbatas",
    question: "$f(x) = x^2 - 6x + 8$ pada $0 \\leq x \\leq 5$. Tentukan BENAR atau SALAH!\n(1) Nilai minimum $f = -1$ saat $x = 3$\n(2) Nilai maksimum $f = 8$ saat $x = 0$\n(3) Range pada domain ini: $[-1, 8]$\n(4) $f(4) = 0$",
    statements: [
      { text: "$x_p = 3$, $f(3) = 9-18+8 = -1$ → BENAR", isCorrect: true },
      { text: "$f(0) = 8$, $f(5) = 25-30+8=3$; maks di $x=0$ → BENAR", isCorrect: true },
      { text: "Range $= [-1, 8]$ → BENAR", isCorrect: true },
      { text: "$f(4) = 16-24+8 = 0$ → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Nilai ekstrem pada domain terbatas.",
      steps: [
        "(1) Min $f(3) = -1$ ✓",
        "(2) Maks $f(0) = 8$ ✓",
        "(3) Range $[-1, 8]$ ✓",
        "(4) $f(4) = 0$ ✓"
      ],
      formula: "f_{min}=-1,\\;f_{maks}=8 \\text{ pada } [0,5]"
    }
  },
  {
    id: 88, type: "Benar/Salah", difficulty: "Sedang", category: "LITERASI – Optimasi Pagar",
    question: "Taman berbentuk persegi panjang di tepi tembok (satu sisi tidak dipagar). Kawat 30 m, lebar $x$, panjang $(30-2x)$. Tentukan BENAR atau SALAH!\n(1) Luas $L = x(30-2x) = -2x^2+30x$\n(2) $x$ yang optimal $= 7{,}5$ m\n(3) Luas maksimum $= 112{,}5$ m²\n(4) Panjang taman $= 15$ m saat luas maks",
    statements: [
      { text: "$L = x(30-2x) = -2x^2+30x$ → BENAR", isCorrect: true },
      { text: "$x_p = -30/(2 \\times -2) = 7.5$ → BENAR", isCorrect: true },
      { text: "$L(7.5) = -2(56.25)+225 = -112.5+225 = 112.5$ m² → BENAR", isCorrect: true },
      { text: "Panjang $= 30-2(7.5) = 15$ m → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Optimasi luas dengan satu sisi di tembok.",
      steps: [
        "(1) $L = -2x^2+30x$ ✓",
        "(2) $x_p = 7.5$ ✓",
        "(3) $L_{maks} = 112.5$ m² ✓",
        "(4) Panjang $= 15$ m ✓"
      ],
      formula: "L_{maks} = 112.5 \\text{ m}^2 \\text{ saat } x=7.5 \\text{ m}"
    }
  },
  {
    id: 89, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK – Fungsi dan Persamaan",
    question: "Titik potong $f(x) = x^2 - 3x + 2$ dan $g(x) = x$. Tentukan BENAR atau SALAH!\n(1) Persamaan irisan: $x^2 - 4x + 2 = 0$ ... tunggu → $x^2-4x+2=0$\n(2) $D = 8 > 0$, ada 2 titik potong\n(3) Salah satu titik potong: $x = 2 + \\sqrt{2}$\n(4) $f(x) = g(x)$ saat $x = 1$ atau $x = 2$",
    statements: [
      { text: "$x^2-3x+2 = x \\Rightarrow x^2-4x+2 = 0$ → BENAR", isCorrect: true },
      { text: "$D = 16-8 = 8 > 0$ → ada 2 titik potong → BENAR", isCorrect: true },
      { text: "$x = (4 \\pm \\sqrt{8})/2 = 2 \\pm \\sqrt{2}$ → BENAR", isCorrect: true },
      { text: "$x=1$: $1-3+2=0\\neq1$; $x=2$: $4-6+2=0\\neq2$ → SALAH", isCorrect: false }
    ],
    explanation: {
      concept: "Irisan dua fungsi.",
      steps: [
        "(1) $x^2-4x+2=0$ ✓",
        "(2) $D=8>0$ ✓",
        "(3) $x = 2 \\pm \\sqrt{2}$ ✓",
        "(4) SALAH: titik potong bukan di $x=1,2$"
      ],
      formula: "x = 2 \\pm \\sqrt{2}"
    }
  },
  {
    id: 90, type: "Benar/Salah", difficulty: "Sedang", category: "UN – Transformasi",
    question: "Grafik $f(x) = (x+2)^2 - 1$. Tentukan BENAR atau SALAH!\n(1) Hasil geser $f(x) = x^2$ ke kiri 2 dan turun 1\n(2) Puncak di $(-2, -1)$\n(3) Grafik memotong sumbu-$x$ di $(-1, 0)$ dan $(-3, 0)$\n(4) $f(0) = 3$",
    statements: [
      { text: "$(x+2)^2-1$: geser kiri 2, turun 1 → BENAR", isCorrect: true },
      { text: "Puncak $(-2,-1)$ → BENAR", isCorrect: true },
      { text: "$(x+2)^2=1 \\Rightarrow x+2=\\pm1 \\Rightarrow x=-1$ atau $x=-3$ → BENAR", isCorrect: true },
      { text: "$f(0) = (0+2)^2-1 = 4-1 = 3$ → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis $f(x) = (x+2)^2 - 1$.",
      steps: [
        "(1) $h=-2$ (kiri), $k=-1$ (turun) ✓",
        "(2) Puncak $(-2,-1)$ ✓",
        "(3) Akar $x=-1,-3$ ✓",
        "(4) $f(0)=3$ ✓"
      ],
      formula: "f(x) = (x+2)^2 - 1"
    }
  },
  {
    id: 91, type: "Benar/Salah", difficulty: "Sedang", category: "TKA – Diskriminan Fungsi",
    question: "Untuk $f(x) = kx^2 - 4x + 1$ selalu positif. Tentukan BENAR atau SALAH!\n(1) Syaratnya $k > 0$ dan $D < 0$\n(2) $D = 16 - 4k$\n(3) $D < 0 \\Rightarrow k > 4$\n(4) Untuk $k = 3$: fungsi selalu positif",
    statements: [
      { text: "Syarat positif definit: $k>0$ dan $D<0$ → BENAR", isCorrect: true },
      { text: "$D = (-4)^2 - 4(k)(1) = 16-4k$ → BENAR", isCorrect: true },
      { text: "$16-4k < 0 \\Rightarrow k > 4$ → BENAR", isCorrect: true },
      { text: "$k=3$: $D=16-12=4>0$ → tidak selalu positif → SALAH", isCorrect: false }
    ],
    explanation: {
      concept: "Syarat fungsi selalu positif: $a > 0$ dan $D < 0$.",
      steps: [
        "(1) Syarat ✓",
        "(2) $D = 16-4k$ ✓",
        "(3) $k > 4$ ✓",
        "(4) $k=3$: $D=4>0$ → tidak selalu positif → SALAH"
      ],
      formula: "D = 16-4k < 0 \\Rightarrow k > 4"
    }
  },
  {
    id: 92, type: "Benar/Salah", difficulty: "Sedang", category: "KONTEKSTUAL – Fisika",
    question: "Peluru ditembakkan: $h(t) = -5t^2 + 30t + 10$. Tentukan BENAR atau SALAH!\n(1) Ketinggian maks dicapai saat $t = 3$ detik\n(2) Ketinggian maks $= 55$ m\n(3) Ketinggian awal $= 10$ m\n(4) Peluru lebih tinggi dari $50$ m saat $2 \\leq t \\leq 4$",
    statements: [
      { text: "$t_p = -30/(2\\times-5) = 3$ → BENAR", isCorrect: true },
      { text: "$h(3) = -45+90+10 = 55$ m → BENAR", isCorrect: true },
      { text: "$h(0) = 10$ m → BENAR", isCorrect: true },
      { text: "$h(2)=-20+60+10=50$; $h(4)=-80+120+10=50$; pada $2<t<4$: $h>50$ → BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis fungsi ketinggian peluru.",
      steps: [
        "(1) $t_p = 3$ ✓",
        "(2) $h(3) = 55$ m ✓",
        "(3) $h(0) = 10$ m ✓",
        "(4) $h(2)=h(4)=50$, di antara $2<t<4$: $h>50$ ✓"
      ],
      formula: "h_{maks} = h(3) = 55 \\text{ m}"
    }
  },

  /* ══════════ BENAR/SALAH — SULIT (Q93–Q100) ══════════ */
  {
    id: 93, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Analisis Komprehensif",
    question: "$f(x) = 2x^2 - 12x + 16$. Tentukan BENAR atau SALAH!\n(1) Akar-akar: $x = 2$ dan $x = 4$\n(2) $f(x) \\geq 0$ untuk $x \\leq 2$ atau $x \\geq 4$\n(3) Nilai minimum $= -2$ saat $x = 3$\n(4) Range fungsi: $[-2, +\\infty)$",
    statements: [
      { text: "$2x^2-12x+16=0 \\Rightarrow x^2-6x+8=(x-2)(x-4)=0$ ✓ BENAR", isCorrect: true },
      { text: "$a>0$: $f\\geq0$ di luar akar ✓ BENAR", isCorrect: true },
      { text: "$x_p=3$; $f(3)=18-36+16=-2$ ✓ BENAR", isCorrect: true },
      { text: "Min $=-2$ → Range $[-2,+\\infty)$ ✓ BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis lengkap $f(x) = 2x^2-12x+16 = 2(x-2)(x-4)$.",
      steps: [
        "(1) Akar $x=2, 4$ ✓",
        "(2) $f \\geq 0$ di luar akar ✓",
        "(3) Min $= -2$ ✓",
        "(4) Range $[-2,+\\infty)$ ✓"
      ],
      formula: "f(x) = 2(x-3)^2 - 2"
    }
  },
  {
    id: 94, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Perpotongan Fungsi",
    question: "$f(x) = x^2 - 4x$ dan $g(x) = 2x - 9$. Tentukan BENAR atau SALAH!\n(1) Irisan: $x^2 - 6x + 9 = 0$\n(2) $D = 0$, dua fungsi bersinggungan\n(3) Titik singgung: $(3, -3)$\n(4) $f(3) = g(3) = -3$",
    statements: [
      { text: "$x^2-4x = 2x-9 \\Rightarrow x^2-6x+9=0$ ✓ BENAR", isCorrect: true },
      { text: "$D = 36-36 = 0$ → bersinggungan ✓ BENAR", isCorrect: true },
      { text: "$(x-3)^2=0 \\Rightarrow x=3$; $g(3)=6-9=-3$ → $(3,-3)$ ✓ BENAR", isCorrect: true },
      { text: "$f(3)=9-12=-3=g(3)$ ✓ BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Dua fungsi bersinggungan jika $D = 0$.",
      steps: [
        "(1) $x^2-6x+9=0$ ✓",
        "(2) $D=0$ → bersinggungan ✓",
        "(3) Titik $(3,-3)$ ✓",
        "(4) $f(3)=g(3)=-3$ ✓"
      ],
      formula: "(x-3)^2 = 0 \\Rightarrow x = 3"
    }
  },
  {
    id: 95, type: "Benar/Salah", difficulty: "Sulit", category: "TKA – Fungsi dari Tiga Syarat",
    question: "$f(x) = ax^2 + bx + c$: $f(0)=3$, $f(1)=0$, $f(-1)=10$. Tentukan BENAR atau SALAH!\n(1) $c = 3$\n(2) $a + b = -3$\n(3) $a - b = 7$\n(4) $f(x) = 2x^2 - 5x + 3$",
    statements: [
      { text: "$f(0)=c=3$ ✓ BENAR", isCorrect: true },
      { text: "$f(1)=a+b+3=0 \\Rightarrow a+b=-3$ ✓ BENAR", isCorrect: true },
      { text: "$f(-1)=a-b+3=10 \\Rightarrow a-b=7$ ✓ BENAR", isCorrect: true },
      { text: "$a+b=-3$ dan $a-b=7$: $2a=4 \\Rightarrow a=2, b=-5$; $f(x)=2x^2-5x+3$ ✓ BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Sistem persamaan dari tiga kondisi fungsi.",
      steps: [
        "(1) $c=3$ ✓",
        "(2) $a+b=-3$ ✓",
        "(3) $a-b=7$ ✓",
        "(4) $a=2, b=-5$: $f(x)=2x^2-5x+3$ ✓"
      ],
      formula: "a=2,\\; b=-5,\\; c=3"
    }
  },
  {
    id: 96, type: "Benar/Salah", difficulty: "Sulit", category: "LITERASI MATEMATIKA – Lintasan",
    question: "Bola dilempar: $h(x) = -0{,}1x^2 + 2x + 1$ (m). Tentukan BENAR atau SALAH!\n(1) Tinggi maks $= 11$ m saat $x = 10$ m (horizontal)\n(2) Bola dimulai dari $h = 1$ m\n(3) Bola mendarat (h=0) sekitar $x = 20{,}5$ m\n(4) Grafik memotong sumbu-$x$ di dua titik positif",
    statements: [
      { text: "$x_p=10$; $h(10)=-10+20+1=11$ m ✓ BENAR", isCorrect: true },
      { text: "$h(0) = 1$ m ✓ BENAR", isCorrect: true },
      { text: "$D = 4+0.4 = 4.4$; $x=(−2 \\pm \\sqrt{4.4})/(−0.2)$; $x \\approx 20.5$ ✓ BENAR", isCorrect: true },
      { text: "Satu akar negatif (sebelum titik lempar) → tidak dua titik positif → SALAH", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis lintasan bola parabola.",
      steps: [
        "(1) $h(10) = 11$ m ✓",
        "(2) $h(0) = 1$ m ✓",
        "(3) $x \\approx 20.5$ m ✓",
        "(4) SALAH: salah satu akar bernilai negatif (tidak bermakna fisika)"
      ],
      formula: "h_{maks} = 11 \\text{ m pada } x=10 \\text{ m}"
    }
  },
  {
    id: 97, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Ketidaksamaan Kuadrat",
    question: "$f(x) = x^2 - x - 6$. Tentukan BENAR atau SALAH!\n(1) Akar-akar $x = -2$ dan $x = 3$\n(2) $f(x) < 0$ untuk $-2 < x < 3$\n(3) $f(x) \\geq 0$ untuk $x \\leq -2$ atau $x \\geq 3$\n(4) $f(0) = -6 < 0$ konsisten dengan (2)",
    statements: [
      { text: "$(x+2)(x-3)=0 \\Rightarrow x=-2,3$ ✓ BENAR", isCorrect: true },
      { text: "$a>0$: $f<0$ di antara akar ✓ BENAR", isCorrect: true },
      { text: "$f \\geq 0$ di luar akar ✓ BENAR", isCorrect: true },
      { text: "$f(0) = -6 < 0$; $0 \\in (-2,3)$ → konsisten ✓ BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis tanda fungsi kuadrat.",
      steps: [
        "(1) Akar $-2$ dan $3$ ✓",
        "(2) $f < 0$ di $(-2,3)$ ✓",
        "(3) $f \\geq 0$ di luar $[-2, 3]$ ✓",
        "(4) $x=0 \\in (-2,3)$, $f(0)=-6<0$ ✓"
      ],
      formula: "f(x) = (x+2)(x-3)"
    }
  },
  {
    id: 98, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Fungsi Baru dari Transformasi",
    question: "Dari $f(x) = x^2$, dibuat $g(x) = -2f(x-1) + 3$. Tentukan BENAR atau SALAH!\n(1) $g(x) = -2(x-1)^2 + 3$\n(2) Puncak $g$: $(1, 3)$, nilai maks $= 3$\n(3) $g(x) = -2x^2 + 4x + 1$\n(4) $g(0) = 1$",
    statements: [
      { text: "$g(x) = -2f(x-1)+3 = -2(x-1)^2+3$ ✓ BENAR", isCorrect: true },
      { text: "Puncak $(1,3)$, maks $=3$ ✓ BENAR", isCorrect: true },
      { text: "$-2(x^2-2x+1)+3 = -2x^2+4x-2+3 = -2x^2+4x+1$ ✓ BENAR", isCorrect: true },
      { text: "$g(0) = -2(0-1)^2+3 = -2+3 = 1$ ✓ BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Transformasi $g(x) = -2f(x-1)+3$.",
      steps: [
        "(1) $g(x) = -2(x-1)^2+3$ ✓",
        "(2) Puncak $(1,3)$, maks $=3$ ✓",
        "(3) Ekspansi: $-2x^2+4x+1$ ✓",
        "(4) $g(0) = 1$ ✓"
      ],
      formula: "g(x) = -2(x-1)^2 + 3 = -2x^2+4x+1"
    }
  },
  {
    id: 99, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Optimasi Kontekstual",
    question: "Pendapatan $P(x) = -3x^2 + 60x - 200$ (juta rupiah), $x$ = harga (puluhan ribu). Tentukan BENAR atau SALAH!\n(1) Pendapatan maks saat $x = 10$\n(2) Pendapatan maks $= 100$ juta\n(3) Pendapatan nol saat harga terlalu murah atau terlalu mahal\n(4) $P(x) > 0$ untuk $\\frac{10}{3} < x < \\frac{50}{3}$",
    statements: [
      { text: "$x_p = -60/(2\\times-3) = 10$ ✓ BENAR", isCorrect: true },
      { text: "$P(10) = -300+600-200 = 100$ juta ✓ BENAR", isCorrect: true },
      { text: "$-3x^2+60x-200=0$ memiliki dua akar → BENAR", isCorrect: true },
      { text: "$D = 3600-2400=1200>0$; akar: $x=(60 \\pm \\sqrt{1200})/6 \\approx 3.33, 16.67$ → $P>0$ di antara ✓ BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Optimasi fungsi pendapatan.",
      steps: [
        "(1) $x_p = 10$ ✓",
        "(2) $P(10) = 100$ juta ✓",
        "(3) Ada dua akar ✓",
        "(4) $P > 0$ untuk $10/3 < x < 50/3$ ✓"
      ],
      formula: "P_{maks} = 100 \\text{ juta saat } x=10"
    }
  },
  {
    id: 100, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS – Analisis Total",
    question: "Fungsi $f(x) = x^2 - 4x + 3$ dan $g(x) = -x^2 + 4x - 1$. Tentukan BENAR atau SALAH!\n(1) Titik potong $f$ dan $g$ saat $2x^2-8x+4=0 \\Rightarrow x = 2 \\pm \\sqrt{2}$\n(2) $f(2) = -1$ dan $g(2) = 3$\n(3) $g(x) \\geq f(x)$ untuk $2-\\sqrt{2} \\leq x \\leq 2+\\sqrt{2}$\n(4) Selisih $g(x)-f(x) = -2x^2+8x-4$ memiliki nilai maks $4$",
    statements: [
      { text: "$x^2-4x+3=-x^2+4x-1 \\Rightarrow 2x^2-8x+4=0 \\Rightarrow x=2\\pm\\sqrt{2}$ ✓ BENAR", isCorrect: true },
      { text: "$f(2)=4-8+3=-1$; $g(2)=-4+8-1=3$ ✓ BENAR", isCorrect: true },
      { text: "$g-f=-2x^2+8x-4$; di antara akar: $-2<0$ → $g-f>0$ → $g \\geq f$ ✓ BENAR", isCorrect: true },
      { text: "$g-f=-2x^2+8x-4$; puncak: $x=2$; maks $=-8+16-4=4$ ✓ BENAR", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis perbandingan dua fungsi kuadrat.",
      steps: [
        "(1) $x = 2 \\pm \\sqrt{2}$ ✓",
        "(2) $f(2)=-1, g(2)=3$ ✓",
        "(3) $g \\geq f$ di antara titik potong ✓",
        "(4) Maks selisih $= 4$ saat $x=2$ ✓"
      ],
      formula: "(g-f)_{maks} = 4 \\text{ saat } x=2"
    }
  },
];

/* ══════════ UI COMPONENTS ══════════ */
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
      className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-500"
      style={{ background: "linear-gradient(135deg,rgba(30,41,59,0.6) 0%,rgba(15,23,42,0.8) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)" }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%,rgba(139,92,246,0.08) 0%,transparent 50%)" }} />
      <div className="relative p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-violet-400/80 bg-violet-500/10 px-2 py-1 rounded-md">#{soal.id}</span>
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
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-violet-500/30 transition-all duration-200">
                <span className="text-sm text-foreground/90 font-body"><MathText text={opt} /></span>
              </div>
            ))}
          </div>
        )}
        {soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((s, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${isMCMA ? "bg-muted/30 border-border/30" : "bg-muted/20 border-border/20"}`}>
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
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 hover:from-violet-500/30 hover:to-purple-500/30 hover:border-violet-500/50 transition-all duration-300 cursor-pointer"
        >
          <span className="text-sm font-semibold text-violet-300">{isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-violet-300" /> : <ChevronDown className="w-4 h-4 text-violet-300" />}
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[2000px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
          <div className="relative p-5 rounded-xl border border-violet-500/20"
            style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.05) 0%,rgba(168,85,247,0.05) 100%)" }}>
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

/* ══════════ MAIN PAGE ══════════ */
const BankSoalFungsiKuadratPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalFungsiKuadrat.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalFungsiKuadrat.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalFungsiKuadrat.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalFungsiKuadrat.filter(s => s.difficulty === "Sulit").length,
    PG: soalFungsiKuadrat.filter(s => s.type === "PG").length,
    MCMA: soalFungsiKuadrat.filter(s => s.type === "MCMA").length,
    BS: soalFungsiKuadrat.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">

        <div className="relative mb-4 mx-auto w-fit">
          <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl scale-150" />
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 border border-violet-500/40 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-violet-300" />
          </div>
        </div>

        <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1 bg-gradient-to-r from-violet-300 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">
          BANK SOAL FUNGSI KUADRAT
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Grafik Parabola · Titik Puncak · Domain & Range · Nilai Maks/Min · Transformasi · Optimasi
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
          <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 font-body">Total: {soalFungsiKuadrat.length} Soal</span>
        </div>

        <div className="mb-6">
          <button
            onClick={() => { playPopSound(); setShowFilter(v => !v); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/60 border border-border hover:border-violet-500/40 transition-all text-sm text-white/70 cursor-pointer font-body mx-auto"
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
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterDifficulty === d ? "bg-violet-500 text-white border-violet-500" : "border-border text-white/50 hover:border-violet-500/40"}`}>
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
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterType === t ? "bg-violet-500 text-white border-violet-500" : "border-border text-white/50 hover:border-violet-500/40"}`}>
                      {t === "MCMA" ? "PG Kompleks MCMA" : t === "Benar/Salah" ? "PG Kompleks B/S" : t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalFungsiKuadrat.length} soal</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filtered.map(soal => <SoalCard key={soal.id} soal={soal} />)}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/bank-soal"); }}
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Bank Soal
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSoalFungsiKuadratPage;
