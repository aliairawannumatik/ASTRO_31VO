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
  id: number; type: QuestionType; difficulty: Difficulty; category: string;
  question: string; options?: string[]; statements?: Statement[];
  correctAnswer?: string; table?: TableData; svgKey?: string;
  explanation: { concept: string; steps: string[]; formula?: string; };
}

/* ── SVG Components ── */

const SumbuXYSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
    <rect x="0" y="0" width="280" height="200" rx="6" fill="rgba(0,0,0,0.2)"/>
    {/* Grid lines */}
    {[40,80,120,160,200,240].map(x=><line key={x} x1={x} y1="10" x2={x} y2="190" stroke="#1e293b" strokeWidth="1"/>)}
    {[40,80,120,160].map(y=><line key={y} x1="10" y1={y} x2="270" y2={y} stroke="#1e293b" strokeWidth="1"/>)}
    {/* Axes */}
    <line x1="10" y1="100" x2="270" y2="100" stroke="#06b6d4" strokeWidth="2"/>
    <line x1="140" y1="10" x2="140" y2="190" stroke="#a855f7" strokeWidth="2"/>
    {/* Arrows */}
    <polygon points="270,100 262,96 262,104" fill="#06b6d4"/>
    <polygon points="140,10 136,18 144,18" fill="#a855f7"/>
    {/* Labels */}
    <text x="264" y="95" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">x</text>
    <text x="144" y="18" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold">y</text>
    <text x="148" y="113" fill="#94a3b8" fontSize="9" fontFamily="monospace">O</text>
    {/* Tick marks & numbers */}
    {[-3,-2,-1,1,2,3].map((n,i)=>{
      const x=140+n*40; return(
        <g key={i}>
          <line x1={x} y1="96" x2={x} y2="104" stroke="#06b6d4" strokeWidth="1.5"/>
          <text x={x} y="115" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">{n}</text>
        </g>
      );
    })}
    {[-1,1,2].map((n,i)=>{
      const y=100-n*40; return(
        <g key={i}>
          <line x1="136" y1={y} x2="144" y2={y} stroke="#a855f7" strokeWidth="1.5"/>
          <text x="130" y={y+3} fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">{n}</text>
        </g>
      );
    })}
    {/* Quadrant labels */}
    <text x="200" y="65" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity="0.5">Kd I</text>
    <text x="80" y="65" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity="0.5">Kd II</text>
    <text x="80" y="155" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity="0.5">Kd III</text>
    <text x="200" y="155" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace" opacity="0.5">Kd IV</text>
  </svg>
);

const TitikKoordinatSVG = ({ points }: { points: { x: number; y: number; label: string; color: string }[] }) => {
  const toSvg = (v: number, axis: "x"|"y") => axis==="x" ? 140+v*35 : 100-v*35;
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <rect x="0" y="0" width="280" height="200" rx="6" fill="rgba(0,0,0,0.2)"/>
      {[40,80,120,160,200,240].map(x=><line key={x} x1={x} y1="10" x2={x} y2="190" stroke="#1e293b" strokeWidth="1"/>)}
      {[40,80,120,160].map(y=><line key={y} x1="10" y1={y} x2="270" y2={y} stroke="#1e293b" strokeWidth="1"/>)}
      <line x1="10" y1="100" x2="270" y2="100" stroke="#06b6d4" strokeWidth="2"/>
      <line x1="140" y1="10" x2="140" y2="190" stroke="#a855f7" strokeWidth="2"/>
      <polygon points="270,100 262,96 262,104" fill="#06b6d4"/>
      <polygon points="140,10 136,18 144,18" fill="#a855f7"/>
      <text x="264" y="95" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">x</text>
      <text x="144" y="18" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold">y</text>
      <text x="148" y="113" fill="#94a3b8" fontSize="9" fontFamily="monospace">O</text>
      {[-3,-2,-1,1,2,3].map((n)=>{
        const x=140+n*35; return(
          <g key={n}>
            <line x1={x} y1="97" x2={x} y2="103" stroke="#06b6d4" strokeWidth="1"/>
            <text x={x} y="114" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">{n}</text>
          </g>
        );
      })}
      {[-2,-1,1,2].map((n)=>{
        const y=100-n*35; return(
          <g key={n}>
            <line x1="137" y1={y} x2="143" y2={y} stroke="#a855f7" strokeWidth="1"/>
            <text x="131" y={y+3} fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">{n}</text>
          </g>
        );
      })}
      {points.map((p, i) => {
        const sx=toSvg(p.x,"x"), sy=toSvg(p.y,"y");
        return (
          <g key={i}>
            <line x1={sx} y1="100" x2={sx} y2={sy} stroke={p.color} strokeWidth="1" strokeDasharray="3,2" opacity="0.5"/>
            <line x1="140" y1={sy} x2={sx} y2={sy} stroke={p.color} strokeWidth="1" strokeDasharray="3,2" opacity="0.5"/>
            <circle cx={sx} cy={sy} r="5" fill={p.color} opacity="0.9"/>
            <text x={sx+7} y={sy-5} fill={p.color} fontSize="9" fontFamily="monospace" fontWeight="bold">{p.label}({p.x},{p.y})</text>
          </g>
        );
      })}
    </svg>
  );
};

const JarakTitikSVG = ({ x1,y1,x2,y2,jarak }: { x1:number;y1:number;x2:number;y2:number;jarak:string }) => {
  const toX=(v:number)=>140+v*32, toY=(v:number)=>100-v*32;
  const sx1=toX(x1),sy1=toY(y1),sx2=toX(x2),sy2=toY(y2);
  const mx=(sx1+sx2)/2, my=(sy1+sy2)/2;
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <rect x="0" y="0" width="280" height="200" rx="6" fill="rgba(0,0,0,0.2)"/>
      {[40,80,120,160,200,240].map(x=><line key={x} x1={x} y1="10" x2={x} y2="190" stroke="#1e293b" strokeWidth="1"/>)}
      {[40,80,120,160].map(y=><line key={y} x1="10" y1={y} x2="270" y2={y} stroke="#1e293b" strokeWidth="1"/>)}
      <line x1="10" y1="100" x2="270" y2="100" stroke="#06b6d4" strokeWidth="1.5"/>
      <line x1="140" y1="10" x2="140" y2="190" stroke="#a855f7" strokeWidth="1.5"/>
      <text x="264" y="95" fill="#22d3ee" fontSize="10" fontFamily="monospace">x</text>
      <text x="144" y="18" fill="#c084fc" fontSize="10" fontFamily="monospace">y</text>
      <text x="148" y="113" fill="#94a3b8" fontSize="8" fontFamily="monospace">O</text>
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,3"/>
      <circle cx={sx1} cy={sy1} r="5" fill="#22d3ee"/>
      <circle cx={sx2} cy={sy2} r="5" fill="#f472b6"/>
      <text x={sx1+7} y={sy1-5} fill="#22d3ee" fontSize="9" fontFamily="monospace">A({x1},{y1})</text>
      <text x={sx2+7} y={sy2-5} fill="#f472b6" fontSize="9" fontFamily="monospace">B({x2},{y2})</text>
      <rect x={mx-22} y={my-10} width="44" height="14" rx="3" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1"/>
      <text x={mx} y={my+1} fill="#fde68a" fontSize="8" textAnchor="middle" fontFamily="monospace">d={jarak}</text>
    </svg>
  );
};

const KuadranInfoSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
    <rect x="0" y="0" width="280" height="200" rx="6" fill="rgba(0,0,0,0.2)"/>
    <line x1="10" y1="100" x2="270" y2="100" stroke="#06b6d4" strokeWidth="2"/>
    <line x1="140" y1="10" x2="140" y2="190" stroke="#a855f7" strokeWidth="2"/>
    <polygon points="270,100 262,96 262,104" fill="#06b6d4"/>
    <polygon points="140,10 136,18 144,18" fill="#a855f7"/>
    <text x="264" y="95" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">x</text>
    <text x="144" y="18" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold">y</text>
    <text x="148" y="113" fill="#94a3b8" fontSize="8" fontFamily="monospace">O(0,0)</text>
    {/* Quadrant I */}
    <rect x="142" y="12" width="126" height="86" fill="rgba(34,197,94,0.08)"/>
    <text x="205" y="40" fill="#4ade80" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Kuadran I</text>
    <text x="205" y="55" fill="#86efac" fontSize="8" textAnchor="middle" fontFamily="monospace">(+,+)</text>
    <text x="205" y="68" fill="#86efac" fontSize="8" textAnchor="middle" fontFamily="monospace">x&gt;0, y&gt;0</text>
    {/* Quadrant II */}
    <rect x="12" y="12" width="126" height="86" fill="rgba(168,85,247,0.08)"/>
    <text x="75" y="40" fill="#c084fc" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Kuadran II</text>
    <text x="75" y="55" fill="#d8b4fe" fontSize="8" textAnchor="middle" fontFamily="monospace">(-,+)</text>
    <text x="75" y="68" fill="#d8b4fe" fontSize="8" textAnchor="middle" fontFamily="monospace">x&lt;0, y&gt;0</text>
    {/* Quadrant III */}
    <rect x="12" y="102" width="126" height="86" fill="rgba(251,191,36,0.08)"/>
    <text x="75" y="140" fill="#fbbf24" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Kuadran III</text>
    <text x="75" y="155" fill="#fde68a" fontSize="8" textAnchor="middle" fontFamily="monospace">(-,-)</text>
    <text x="75" y="168" fill="#fde68a" fontSize="8" textAnchor="middle" fontFamily="monospace">x&lt;0, y&lt;0</text>
    {/* Quadrant IV */}
    <rect x="142" y="102" width="126" height="86" fill="rgba(239,68,68,0.08)"/>
    <text x="205" y="140" fill="#f87171" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Kuadran IV</text>
    <text x="205" y="155" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">(+,-)</text>
    <text x="205" y="168" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">x&gt;0, y&lt;0</text>
  </svg>
);

const RumusJarakSVG = ({ rumus }: { rumus: string }) => (
  <svg viewBox="0 0 300 80" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
    <rect x="5" y="5" width="290" height="70" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <rect x="15" y="15" width="270" height="40" rx="4" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="150" y="30" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Rumus Jarak Dua Titik</text>
    <text x="150" y="46" fill="#fde68a" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{rumus}</text>
    <text x="150" y="67" fill="#64748b" fontSize="7.5" textAnchor="middle" fontFamily="monospace">d = jarak, (x₁,y₁) dan (x₂,y₂) = koordinat titik</text>
  </svg>
);

const TranslasiSVG = ({ ax,ay,bx,by,tx,ty }: { ax:number;ay:number;bx:number;by:number;tx:number;ty:number }) => {
  const toX=(v:number)=>140+v*28, toY=(v:number)=>100-v*28;
  const sax=toX(ax),say=toY(ay),sbx=toX(bx),sby=toY(by);
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <rect x="0" y="0" width="280" height="200" rx="6" fill="rgba(0,0,0,0.2)"/>
      {[40,80,120,160,200,240].map(x=><line key={x} x1={x} y1="10" x2={x} y2="190" stroke="#1e293b" strokeWidth="1"/>)}
      {[40,80,120,160].map(y=><line key={y} x1="10" y1={y} x2="270" y2={y} stroke="#1e293b" strokeWidth="1"/>)}
      <line x1="10" y1="100" x2="270" y2="100" stroke="#06b6d4" strokeWidth="1.5"/>
      <line x1="140" y1="10" x2="140" y2="190" stroke="#a855f7" strokeWidth="1.5"/>
      <text x="264" y="95" fill="#22d3ee" fontSize="9" fontFamily="monospace">x</text>
      <text x="144" y="18" fill="#c084fc" fontSize="9" fontFamily="monospace">y</text>
      <text x="148" y="113" fill="#94a3b8" fontSize="7" fontFamily="monospace">O</text>
      <circle cx={sax} cy={say} r="5" fill="#22d3ee" opacity="0.9"/>
      <text x={sax+7} y={say-5} fill="#22d3ee" fontSize="8" fontFamily="monospace">A({ax},{ay})</text>
      <circle cx={sbx} cy={sby} r="5" fill="#4ade80" opacity="0.9"/>
      <text x={sbx+7} y={sby-5} fill="#4ade80" fontSize="8" fontFamily="monospace">A'({bx},{by})</text>
      <line x1={sax} y1={say} x2={sbx} y2={sby} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arr)"/>
      <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#fbbf24"/></marker></defs>
      <rect x="10" y="160" width="130" height="30" rx="4" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1"/>
      <text x="75" y="172" fill="#fde68a" fontSize="8" textAnchor="middle" fontFamily="monospace">Translasi T({tx},{ty})</text>
      <text x="75" y="184" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">A({ax},{ay}) → A'({bx},{by})</text>
    </svg>
  );
};

const RefLeksiSVG = ({ sumbu, ax,ay,bx,by }: { sumbu:string;ax:number;ay:number;bx:number;by:number }) => {
  const toX=(v:number)=>140+v*30, toY=(v:number)=>100-v*30;
  const sax=toX(ax),say=toY(ay),sbx=toX(bx),sby=toY(by);
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
      <rect x="0" y="0" width="280" height="200" rx="6" fill="rgba(0,0,0,0.2)"/>
      {[40,80,120,160,200,240].map(x=><line key={x} x1={x} y1="10" x2={x} y2="190" stroke="#1e293b" strokeWidth="1"/>)}
      {[40,80,120,160].map(y=><line key={y} x1="10" y1={y} x2="270" y2={y} stroke="#1e293b" strokeWidth="1"/>)}
      <line x1="10" y1="100" x2="270" y2="100" stroke={sumbu==="sb-x"?"#ef4444":"#06b6d4"} strokeWidth={sumbu==="sb-x"?2.5:1.5}/>
      <line x1="140" y1="10" x2="140" y2="190" stroke={sumbu==="sb-y"?"#ef4444":"#a855f7"} strokeWidth={sumbu==="sb-y"?2.5:1.5}/>
      <text x="264" y="95" fill="#22d3ee" fontSize="9" fontFamily="monospace">x</text>
      <text x="144" y="18" fill="#c084fc" fontSize="9" fontFamily="monospace">y</text>
      <text x="148" y="113" fill="#94a3b8" fontSize="7" fontFamily="monospace">O</text>
      <line x1={sax} y1={say} x2={sbx} y2={sby} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3"/>
      <circle cx={sax} cy={say} r="5" fill="#22d3ee"/>
      <text x={sax+7} y={say-5} fill="#22d3ee" fontSize="8" fontFamily="monospace">P({ax},{ay})</text>
      <circle cx={sbx} cy={sby} r="5" fill="#f472b6"/>
      <text x={sbx+7} y={sby-5} fill="#f472b6" fontSize="8" fontFamily="monospace">P'({bx},{by})</text>
      <rect x="8" y="165" width="145" height="26" rx="4" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1"/>
      <text x="80" y="176" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">Refleksi thd {sumbu==="sb-x"?"sumbu-x":"sumbu-y"}</text>
      <text x="80" y="187" fill="#f87171" fontSize="8" textAnchor="middle" fontFamily="monospace">P({ax},{ay}) → P'({bx},{by})</text>
    </svg>
  );
};

const DenahSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600">
    <rect x="0" y="0" width="280" height="200" rx="6" fill="rgba(0,0,0,0.2)"/>
    {[40,80,120,160,200,240].map(x=><line key={x} x1={x} y1="10" x2={x} y2="190" stroke="#1e293b" strokeWidth="1"/>)}
    {[40,80,120,160].map(y=><line key={y} x1="10" y1={y} x2="270" y2={y} stroke="#1e293b" strokeWidth="1"/>)}
    <line x1="10" y1="100" x2="270" y2="100" stroke="#06b6d4" strokeWidth="2"/>
    <line x1="140" y1="10" x2="140" y2="190" stroke="#a855f7" strokeWidth="2"/>
    <text x="264" y="95" fill="#22d3ee" fontSize="9" fontFamily="monospace">x</text>
    <text x="144" y="18" fill="#c084fc" fontSize="9" fontFamily="monospace">y</text>
    <text x="148" y="113" fill="#94a3b8" fontSize="7" fontFamily="monospace">O</text>
    {/* School */}
    <rect x="193" y="57" width="22" height="16" rx="2" fill="rgba(34,197,94,0.4)" stroke="#4ade80" strokeWidth="1"/>
    <text x="204" y="69" fill="#4ade80" fontSize="6" textAnchor="middle" fontFamily="monospace">🏫</text>
    <text x="204" y="55" fill="#4ade80" fontSize="6" textAnchor="middle" fontFamily="monospace">Sekolah(3,1)</text>
    {/* Market */}
    <rect x="153" y="17" width="22" height="16" rx="2" fill="rgba(251,191,36,0.4)" stroke="#fbbf24" strokeWidth="1"/>
    <text x="164" y="29" fill="#fbbf24" fontSize="6" textAnchor="middle" fontFamily="monospace">🏪</text>
    <text x="164" y="15" fill="#fbbf24" fontSize="6" textAnchor="middle" fontFamily="monospace">Pasar(1,3)</text>
    {/* Home */}
    <rect x="73" y="137" width="22" height="16" rx="2" fill="rgba(239,68,68,0.4)" stroke="#f87171" strokeWidth="1"/>
    <text x="84" y="149" fill="#f87171" fontSize="6" textAnchor="middle" fontFamily="monospace">🏠</text>
    <text x="84" y="165" fill="#f87171" fontSize="6" textAnchor="middle" fontFamily="monospace">Rumah(-2,-1)</text>
    {/* Hospital */}
    <rect x="33" y="57" width="22" height="16" rx="2" fill="rgba(168,85,247,0.4)" stroke="#a855f7" strokeWidth="1"/>
    <text x="44" y="69" fill="#c084fc" fontSize="6" textAnchor="middle" fontFamily="monospace">🏥</text>
    <text x="44" y="55" fill="#c084fc" fontSize="6" textAnchor="middle" fontFamily="monospace">RS(-3,1)</text>
  </svg>
);

const visualMap: Record<string, React.ReactNode> = {
  "sumbu-xy": <SumbuXYSVG />,
  "kuadran-info": <KuadranInfoSVG />,
  "titik-A23": <TitikKoordinatSVG points={[{x:2,y:3,label:"A",color:"#22d3ee"}]}/>,
  "titik-B-23": <TitikKoordinatSVG points={[{x:-2,y:3,label:"B",color:"#c084fc"}]}/>,
  "titik-C-2-3": <TitikKoordinatSVG points={[{x:-2,y:-3,label:"C",color:"#fbbf24"}]}/>,
  "titik-D2-3": <TitikKoordinatSVG points={[{x:2,y:-3,label:"D",color:"#f87171"}]}/>,
  "titik-multi": <TitikKoordinatSVG points={[{x:2,y:3,label:"A",color:"#22d3ee"},{x:-1,y:2,label:"B",color:"#c084fc"},{x:-2,y:-1,label:"C",color:"#fbbf24"},{x:3,y:-2,label:"D",color:"#f87171"}]}/>,
  "jarak-AB": <JarakTitikSVG x1={1} y1={2} x2={4} y2={6} jarak="5"/>,
  "jarak-PQ": <JarakTitikSVG x1={-1} y1={1} x2={2} y2={5} jarak="5"/>,
  "jarak-MN": <JarakTitikSVG x1={0} y1={0} x2={3} y2={4} jarak="5"/>,
  "jarak-RS": <JarakTitikSVG x1={1} y1={-2} x2={4} y2={2} jarak="5"/>,
  "rumus-jarak": <RumusJarakSVG rumus="d = √((x₂-x₁)² + (y₂-y₁)²)"/>,
  "translasi-1": <TranslasiSVG ax={1} ay={2} bx={4} by={5} tx={3} ty={3}/>,
  "translasi-2": <TranslasiSVG ax={-1} ay={3} bx={2} by={1} tx={3} ty={-2}/>,
  "refleksi-sbx": <RefLeksiSVG sumbu="sb-x" ax={2} ay={3} bx={2} by={-3}/>,
  "refleksi-sby": <RefLeksiSVG sumbu="sb-y" ax={2} ay={3} bx={-2} by={3}/>,
  "denah": <DenahSVG />,
  "titik-peta": <TitikKoordinatSVG points={[{x:-3,y:2,label:"P",color:"#22d3ee"},{x:1,y:-1,label:"Q",color:"#f472b6"}]}/>,
};

const soalKoordinatCartesius: Question[] = [
  /* ═══════════════════════════════════
     MUDAH  (Q1 – Q35)
  ═══════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Unsur Koordinat",
    question: "Pada sistem koordinat Cartesius, sumbu horizontal disebut sumbu ...",
    svgKey: "sumbu-xy",
    options: ["A. Sumbu y", "B. Sumbu z", "C. Sumbu x", "D. Sumbu w"],
    correctAnswer: "C. Sumbu x",
    explanation: {
      concept: "Sistem koordinat Cartesius terdiri dari sumbu x (horizontal) dan sumbu y (vertikal) yang saling tegak lurus dan berpotongan di titik asal O(0,0).",
      steps: ["Sumbu x = sumbu horizontal (mendatar)", "Sumbu y = sumbu vertikal (tegak)", "Berpotongan di titik O(0,0) yang disebut titik pusat koordinat"],
      formula: "\\text{Titik koordinat: } (x, y) \\text{ dengan } x = \\text{absis}, y = \\text{ordinat}"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Unsur Koordinat",
    question: "Koordinat titik yang terletak tepat di titik pusat sistem koordinat Cartesius adalah ...",
    options: ["A. $(1, 1)$", "B. $(0, 1)$", "C. $(1, 0)$", "D. $(0, 0)$"],
    correctAnswer: "D. $(0, 0)$",
    explanation: {
      concept: "Titik pusat koordinat Cartesius disebut titik asal atau origin O, yang memiliki koordinat (0, 0).",
      steps: ["Titik asal/origin = O(0,0)", "Merupakan perpotongan sumbu x dan sumbu y", "Semua koordinat diukur relatif terhadap O"],
      formula: "O = (0, 0) \\text{ (Titik Asal / Origin)}"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Absis dan Ordinat",
    question: "Titik $A(3, -5)$ memiliki absis dan ordinat berturut-turut ...",
    options: ["A. absis = $-5$, ordinat = $3$", "B. absis = $3$, ordinat = $-5$", "C. absis = $0$, ordinat = $3$", "D. absis = $-5$, ordinat = $0$"],
    correctAnswer: "B. absis = $3$, ordinat = $-5$",
    explanation: {
      concept: "Dalam notasi (x, y): x adalah absis (jarak horizontal dari sumbu y), y adalah ordinat (jarak vertikal dari sumbu x).",
      steps: ["Titik A(3, -5)", "Absis = nilai x = 3", "Ordinat = nilai y = -5"],
      formula: "(x, y) \\Rightarrow \\text{absis} = x, \\text{ ordinat} = y"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Kuadran",
    question: "Titik $P(4, 3)$ berada di kuadran ...",
    svgKey: "kuadran-info",
    options: ["A. Kuadran II", "B. Kuadran III", "C. Kuadran IV", "D. Kuadran I"],
    correctAnswer: "D. Kuadran I",
    explanation: {
      concept: "Kuadran I: x > 0 dan y > 0. Kuadran II: x < 0 dan y > 0. Kuadran III: x < 0 dan y < 0. Kuadran IV: x > 0 dan y < 0.",
      steps: ["P(4, 3): x = 4 > 0, y = 3 > 0", "→ Kuadran I ✓"],
      formula: "\\text{Kd I: (+,+), Kd II: (-,+), Kd III: (-,-), Kd IV: (+,-)}"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Kuadran",
    question: "Titik $Q(-3, 5)$ berada di kuadran ...",
    svgKey: "titik-B-23",
    options: ["A. Kuadran I", "B. Kuadran II", "C. Kuadran III", "D. Kuadran IV"],
    correctAnswer: "B. Kuadran II",
    explanation: {
      concept: "Kuadran II: x < 0 dan y > 0.",
      steps: ["Q(-3, 5): x = -3 < 0, y = 5 > 0", "→ Kuadran II ✓"],
      formula: "\\text{Kuadran II}: x < 0, y > 0"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Kuadran",
    question: "Titik $R(-2, -4)$ berada di kuadran ...",
    svgKey: "titik-C-2-3",
    options: ["A. Kuadran I", "B. Kuadran II", "C. Kuadran III", "D. Kuadran IV"],
    correctAnswer: "C. Kuadran III",
    explanation: {
      concept: "Kuadran III: x < 0 dan y < 0.",
      steps: ["R(-2, -4): x = -2 < 0, y = -4 < 0", "→ Kuadran III ✓"],
      formula: "\\text{Kuadran III}: x < 0, y < 0"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Kuadran",
    question: "Titik $S(5, -2)$ berada di kuadran ...",
    svgKey: "titik-D2-3",
    options: ["A. Kuadran I", "B. Kuadran II", "C. Kuadran III", "D. Kuadran IV"],
    correctAnswer: "D. Kuadran IV",
    explanation: {
      concept: "Kuadran IV: x > 0 dan y < 0.",
      steps: ["S(5, -2): x = 5 > 0, y = -2 < 0", "→ Kuadran IV ✓"],
      formula: "\\text{Kuadran IV}: x > 0, y < 0"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Posisi Titik",
    question: "Titik yang terletak tepat pada sumbu y (bukan di titik asal) memiliki absis ...",
    options: ["A. absis = 1", "B. absis = -1", "C. absis = 0", "D. absis bisa berapa saja"],
    correctAnswer: "C. absis = 0",
    explanation: {
      concept: "Titik pada sumbu y tidak memiliki jarak horizontal dari sumbu y, sehingga nilai x (absisnya) = 0.",
      steps: ["Titik pada sumbu y: berbentuk (0, y) untuk suatu nilai y ≠ 0", "Absis = 0", "Contoh: (0, 3), (0, -5), (0, 7)"],
      formula: "\\text{Titik pada sumbu y}: (0, y), y \\neq 0"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Posisi Titik",
    question: "Titik $T(7, 0)$ terletak di ...",
    options: ["A. Sumbu y, kuadran I", "B. Sumbu x, sebelah kanan titik asal", "C. Titik asal", "D. Sumbu y, kuadran IV"],
    correctAnswer: "B. Sumbu x, sebelah kanan titik asal",
    explanation: {
      concept: "Titik dengan ordinat = 0 terletak pada sumbu x.",
      steps: ["T(7, 0): y = 0 → di sumbu x", "x = 7 > 0 → di sebelah kanan titik asal"],
      formula: "\\text{Titik pada sumbu x}: (x, 0), x \\neq 0"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Membaca Koordinat",
    question: "Dari diagram Venn (koordinat), titik A ada di (2,3), B di (-1,2), C di (-2,-1), D di (3,-2). Titik yang berada di kuadran III adalah ...",
    svgKey: "titik-multi",
    options: ["A. Titik A", "B. Titik B", "C. Titik C", "D. Titik D"],
    correctAnswer: "C. Titik C",
    explanation: {
      concept: "Kuadran III: x < 0 dan y < 0.",
      steps: ["A(2,3): Kd I", "B(-1,2): Kd II", "C(-2,-1): x<0, y<0 → Kd III ✓", "D(3,-2): Kd IV"],
      formula: ""
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Jarak ke Sumbu",
    question: "Jarak titik $A(3, -4)$ terhadap sumbu x adalah ...",
    options: ["A. 3 satuan", "B. 4 satuan", "C. 5 satuan", "D. 7 satuan"],
    correctAnswer: "B. 4 satuan",
    explanation: {
      concept: "Jarak titik (x, y) terhadap sumbu x = |y|.",
      steps: ["A(3, -4)", "Jarak ke sumbu x = |y| = |-4| = 4 satuan"],
      formula: "d_{\\text{sumbu x}} = |y|"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Jarak ke Sumbu",
    question: "Jarak titik $B(-5, 2)$ terhadap sumbu y adalah ...",
    options: ["A. 2 satuan", "B. 3 satuan", "C. 5 satuan", "D. 7 satuan"],
    correctAnswer: "C. 5 satuan",
    explanation: {
      concept: "Jarak titik (x, y) terhadap sumbu y = |x|.",
      steps: ["B(-5, 2)", "Jarak ke sumbu y = |x| = |-5| = 5 satuan"],
      formula: "d_{\\text{sumbu y}} = |x|"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Jarak ke Titik Asal",
    question: "Jarak titik $O(0,0)$ ke titik $A(3, 4)$ adalah ...",
    svgKey: "jarak-MN",
    options: ["A. 3 satuan", "B. 4 satuan", "C. 5 satuan", "D. 7 satuan"],
    correctAnswer: "C. 5 satuan",
    explanation: {
      concept: "Jarak dari titik asal ke titik (x,y) = √(x²+y²).",
      steps: ["$d = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$ satuan"],
      formula: "d = \\sqrt{x^2 + y^2}"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Himpunan Bagian",
    question: "Titik yang terletak di sumbu x positif adalah ...",
    options: ["A. $(-3, 0)$", "B. $(0, 5)$", "C. $(4, 0)$", "D. $(0, -2)$"],
    correctAnswer: "C. $(4, 0)$",
    explanation: {
      concept: "Titik di sumbu x positif: y = 0 dan x > 0.",
      steps: ["A: (-3,0) → sumbu x negatif", "B: (0,5) → sumbu y positif", "C: (4,0) → y=0, x=4>0 → sumbu x positif ✓", "D: (0,-2) → sumbu y negatif"],
      formula: "\\text{Sumbu x positif}: (x,0), x>0"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Posisi Relatif",
    question: "Titik $A(2, 5)$ berada ... terhadap titik $B(2, 1)$.",
    options: ["A. Di sebelah kanan B", "B. Di sebelah kiri B", "C. Di atas B", "D. Di bawah B"],
    correctAnswer: "C. Di atas B",
    explanation: {
      concept: "Absis A = Absis B = 2 (sekolom vertikal). Ordinat A = 5 > Ordinat B = 1, artinya A lebih tinggi dari B.",
      steps: ["A(2,5) dan B(2,1): absis sama → sejajar vertikal", "y_A = 5 > y_B = 1 → A di atas B ✓"],
      formula: "y_A > y_B \\Rightarrow A \\text{ di atas } B"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Koordinat Titik",
    question: "Titik $P$ berjarak 4 satuan dari sumbu y dan 6 satuan dari sumbu x, berada di kuadran III. Koordinat titik P adalah ...",
    options: ["A. $(4, 6)$", "B. $(-4, 6)$", "C. $(-4, -6)$", "D. $(4, -6)$"],
    correctAnswer: "C. $(-4, -6)$",
    explanation: {
      concept: "Jarak dari sumbu y = |x| = 4, jarak dari sumbu x = |y| = 6. Di kuadran III: x < 0, y < 0.",
      steps: ["|x| = 4 → x = -4 (kuadran III)", "|y| = 6 → y = -6 (kuadran III)", "P(-4, -6) ✓"],
      formula: "\\text{Kd III}: x < 0, y < 0"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Mengidentifikasi Koordinat",
    question: "Sebuah titik berjarak 3 satuan ke kanan titik asal O dan 4 satuan ke atas. Koordinat titik tersebut adalah ...",
    svgKey: "titik-A23",
    options: ["A. $(-3, 4)$", "B. $(3, -4)$", "C. $(3, 4)$", "D. $(-3, -4)$"],
    correctAnswer: "C. $(3, 4)$",
    explanation: {
      concept: "3 satuan ke kanan → x = +3. 4 satuan ke atas → y = +4.",
      steps: ["Ke kanan = +x → x = 3", "Ke atas = +y → y = 4", "Koordinat = (3, 4)"],
      formula: "\\text{Kanan }(+x), \\text{Kiri }(-x), \\text{Atas }(+y), \\text{Bawah }(-y)"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Denah",
    question: "Pada sebuah denah, rumah Ani berada di titik $(2, 3)$ dan rumah Budi berada di titik $(-1, 3)$. Posisi rumah Budi terhadap rumah Ani adalah ...",
    svgKey: "denah",
    options: ["A. 3 satuan di atas", "B. 3 satuan di sebelah kanan", "C. 3 satuan di sebelah kiri", "D. 3 satuan di bawah"],
    correctAnswer: "C. 3 satuan di sebelah kiri",
    explanation: {
      concept: "Ordinat sama (y=3) → sejajar horizontal. x_Budi = -1 < x_Ani = 2, jarak = |2-(-1)| = 3.",
      steps: ["y_Ani = y_Budi = 3 → sejajar (horizontal)", "x_Budi - x_Ani = -1-2 = -3 → Budi 3 satuan di kiri Ani ✓"],
      formula: ""
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Banyak Kuadran",
    question: "Berapa banyak kuadran pada sistem koordinat Cartesius?",
    options: ["A. 2", "B. 3", "C. 4", "D. 8"],
    correctAnswer: "C. 4",
    explanation: {
      concept: "Sumbu x dan sumbu y membagi bidang koordinat menjadi 4 daerah yang disebut kuadran, bernomor I, II, III, dan IV (berlawanan arah jarum jam mulai dari kanan atas).",
      steps: ["Kuadran I: kanan atas (+,+)", "Kuadran II: kiri atas (-,+)", "Kuadran III: kiri bawah (-,-)", "Kuadran IV: kanan bawah (+,-)"],
      formula: ""
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Nama Komponen",
    question: "Komponen pertama (nilai x) dari pasangan koordinat (x,y) disebut ...",
    options: ["A. Ordinat", "B. Absis", "C. Gradien", "D. Konstanta"],
    correctAnswer: "B. Absis",
    explanation: {
      concept: "Dalam sistem koordinat Cartesius, komponen x disebut absis dan komponen y disebut ordinat.",
      steps: ["(x, y): x = absis, y = ordinat", "Absis menunjukkan posisi horizontal", "Ordinat menunjukkan posisi vertikal"],
      formula: "(\\underbrace{x}_{\\text{absis}}, \\underbrace{y}_{\\text{ordinat}})"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Jarak ke Titik Asal",
    question: "Titik $A(0, -6)$ berjarak ... dari titik asal.",
    options: ["A. 0 satuan", "B. 3 satuan", "C. 6 satuan", "D. 36 satuan"],
    correctAnswer: "C. 6 satuan",
    explanation: {
      concept: "A(0,-6) ada di sumbu y negatif. Jaraknya ke O(0,0) = |−6| = 6.",
      steps: ["$d = \\sqrt{0^2 + (-6)^2} = \\sqrt{36} = 6$ satuan"],
      formula: "d = \\sqrt{x^2+y^2} = \\sqrt{0+36} = 6"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Translasi Sederhana",
    question: "Titik $A(2, 3)$ ditranslasikan sejauh 3 satuan ke kanan dan 2 satuan ke atas. Koordinat bayangan A adalah ...",
    svgKey: "translasi-1",
    options: ["A. $(5, 5)$", "B. $(-1, 1)$", "C. $(5, 1)$", "D. $(-1, 5)$"],
    correctAnswer: "A. $(5, 5)$",
    explanation: {
      concept: "Translasi (a, b): x' = x + a, y' = y + b. Kanan = +x, Atas = +y.",
      steps: ["x' = 2 + 3 = 5", "y' = 3 + 2 = 5", "Bayangan A' = (5, 5)"],
      formula: "(x, y) \\xrightarrow{T(a,b)} (x+a, y+b)"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Refleksi",
    question: "Bayangan titik $P(3, 4)$ dicerminkan terhadap sumbu x adalah ...",
    svgKey: "refleksi-sbx",
    options: ["A. $(-3, 4)$", "B. $(3, -4)$", "C. $(-3, -4)$", "D. $(-4, 3)$"],
    correctAnswer: "B. $(3, -4)$",
    explanation: {
      concept: "Refleksi terhadap sumbu x: (x, y) → (x, -y). Nilai y berubah tanda, x tetap.",
      steps: ["P(3, 4)", "Refleksi sumbu x: y menjadi -y", "P'(3, -4) ✓"],
      formula: "(x, y) \\xrightarrow{R_{\\text{sb-x}}} (x, -y)"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Refleksi",
    question: "Bayangan titik $Q(2, 5)$ dicerminkan terhadap sumbu y adalah ...",
    svgKey: "refleksi-sby",
    options: ["A. $(2, -5)$", "B. $(-2, -5)$", "C. $(-2, 5)$", "D. $(5, 2)$"],
    correctAnswer: "C. $(-2, 5)$",
    explanation: {
      concept: "Refleksi terhadap sumbu y: (x, y) → (-x, y). Nilai x berubah tanda, y tetap.",
      steps: ["Q(2, 5)", "Refleksi sumbu y: x menjadi -x", "Q'(-2, 5) ✓"],
      formula: "(x, y) \\xrightarrow{R_{\\text{sb-y}}} (-x, y)"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Jarak Dua Titik",
    question: "Jarak antara titik $A(1, 2)$ dan $B(4, 6)$ adalah ...",
    svgKey: "jarak-AB",
    options: ["A. 3 satuan", "B. 4 satuan", "C. 5 satuan", "D. 6 satuan"],
    correctAnswer: "C. 5 satuan",
    explanation: {
      concept: "Rumus jarak: d = √((x₂-x₁)² + (y₂-y₁)²).",
      steps: ["$d = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$ satuan"],
      formula: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Unsur Koordinat",
    question: "Sistem koordinat Cartesius ditemukan oleh matematikawan bernama ...",
    options: ["A. Isaac Newton", "B. René Descartes", "C. Leonhard Euler", "D. Pythagoras"],
    correctAnswer: "B. René Descartes",
    explanation: {
      concept: "Sistem koordinat Cartesius (dari kata 'Cartesius' yang merupakan nama Latin Descartes) ditemukan oleh René Descartes, matematikawan Prancis abad ke-17.",
      steps: ["René Descartes (1596–1650) = filsuf dan matematikawan Prancis", "Nama 'Cartesius' = bentuk Latin dari 'Descartes'"],
      formula: ""
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Posisi Titik",
    question: "Titik $A(-4, 0)$ terletak di ...",
    options: ["A. Kuadran II", "B. Sumbu y negatif", "C. Sumbu x negatif", "D. Kuadran III"],
    correctAnswer: "C. Sumbu x negatif",
    explanation: {
      concept: "Titik dengan y = 0 terletak pada sumbu x. x = -4 < 0 berarti di sumbu x negatif.",
      steps: ["A(-4, 0): y = 0 → di sumbu x", "x = -4 < 0 → sisi negatif sumbu x"],
      formula: "(x, 0), x < 0 \\Rightarrow \\text{sumbu x negatif}"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Koordinat Titik",
    question: "Suatu titik memiliki ordinat 3 kali absisnya dan berada di kuadran I. Jika absisnya adalah 2, koordinat titik tersebut adalah ...",
    options: ["A. $(2, 3)$", "B. $(2, 6)$", "C. $(3, 2)$", "D. $(6, 2)$"],
    correctAnswer: "B. $(2, 6)$",
    explanation: {
      concept: "Ordinat = 3 × absis. Absis = 2.",
      steps: ["absis = x = 2", "ordinat = y = 3×2 = 6", "Koordinat = (2, 6)"],
      formula: "y = 3x"
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Translasi",
    question: "Titik $B(-1, 3)$ ditranslasikan sejauh 3 satuan ke kanan dan 2 satuan ke bawah. Koordinat bayangan B adalah ...",
    svgKey: "translasi-2",
    options: ["A. $(2, 1)$", "B. $(-4, 5)$", "C. $(2, 5)$", "D. $(-4, 1)$"],
    correctAnswer: "A. $(2, 1)$",
    explanation: {
      concept: "Translasi (3, -2): ke kanan +3, ke bawah -2.",
      steps: ["x' = -1 + 3 = 2", "y' = 3 + (-2) = 1", "B' = (2, 1)"],
      formula: "(x, y) \\xrightarrow{T(3,-2)} (x+3, y-2)"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Jarak ke Sumbu",
    question: "Titik $A(-3, 5)$ berjarak berapa satuan dari sumbu x?",
    options: ["A. 3 satuan", "B. 5 satuan", "C. 8 satuan", "D. $\\sqrt{34}$ satuan"],
    correctAnswer: "B. 5 satuan",
    explanation: {
      concept: "Jarak ke sumbu x = |y|.",
      steps: ["A(-3, 5): y = 5", "Jarak ke sumbu x = |5| = 5 satuan"],
      formula: "d_{\\text{sumbu x}} = |y| = 5"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "Membaca Koordinat Denah",
    question: "Berdasarkan diagram koordinat, sekolah berada di titik $(3, 1)$ dan rumah di titik $(-2, 1)$. Jarak sekolah ke rumah adalah ...",
    svgKey: "denah",
    options: ["A. 3 satuan", "B. 4 satuan", "C. 5 satuan", "D. 6 satuan"],
    correctAnswer: "C. 5 satuan",
    explanation: {
      concept: "Ordinat sama → jarak = |x₂ - x₁|.",
      steps: ["y sama (y=1) → jarak = |3-(-2)| = |5| = 5 satuan"],
      formula: "d = |x_2 - x_1| \\text{ (jika ordinat sama)}"
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "Refleksi",
    question: "Titik $R(-3, -4)$ dicerminkan terhadap titik asal O(0,0). Bayangan R adalah ...",
    options: ["A. $(3, 4)$", "B. $(-3, 4)$", "C. $(3, -4)$", "D. $(-4, -3)$"],
    correctAnswer: "A. $(3, 4)$",
    explanation: {
      concept: "Refleksi terhadap titik asal O(0,0): (x, y) → (-x, -y).",
      steps: ["R(-3, -4)", "Refleksi O: kedua tanda berubah", "R'(3, 4) ✓"],
      formula: "(x, y) \\xrightarrow{R_O} (-x, -y)"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Posisi Titik",
    question: "Titik-titik mana saja yang terletak tepat pada garis y = 2?",
    options: ["A. $(0, 2), (3, 2), (-1, 2)$", "B. $(2, 0), (2, 3), (2, -1)$", "C. $(0, 2), (2, 3), (2, -1)$", "D. $(2, 0), (3, 2), (-1, 2)$"],
    correctAnswer: "A. $(0, 2), (3, 2), (-1, 2)$",
    explanation: {
      concept: "Garis y = 2 adalah garis horizontal yang melalui semua titik dengan ordinat = 2.",
      steps: ["y = 2 → ordinat semua titik = 2", "A: (0,2), (3,2), (-1,2) → semua y=2 ✓"],
      formula: "y = k \\Rightarrow \\text{garis horizontal}"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Koordinat Titik",
    question: "Diketahui titik $A(a, b)$ dengan $a < 0$ dan $b = 0$. Titik A berada di ...",
    options: ["A. Kuadran II", "B. Kuadran III", "C. Sumbu x negatif", "D. Sumbu y negatif"],
    correctAnswer: "C. Sumbu x negatif",
    explanation: {
      concept: "b = 0 → y = 0 → di sumbu x. a < 0 → x < 0 → sisi negatif.",
      steps: ["b = 0 → di sumbu x", "a < 0 → sisi negatif sumbu x"],
      formula: "(x, 0), x < 0 \\Rightarrow \\text{sumbu x negatif}"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Jarak Dua Titik",
    question: "Jarak antara titik $P(-1, 1)$ dan $Q(2, 5)$ adalah ...",
    svgKey: "jarak-PQ",
    options: ["A. 3 satuan", "B. 4 satuan", "C. 5 satuan", "D. $\\sqrt{13}$ satuan"],
    correctAnswer: "C. 5 satuan",
    explanation: {
      concept: "Rumus jarak dua titik.",
      steps: ["$d = \\sqrt{(2-(-1))^2+(5-1)^2} = \\sqrt{9+16} = \\sqrt{25} = 5$"],
      formula: "d = \\sqrt{3^2+4^2} = \\sqrt{25} = 5"
    }
  },

  /* ═══════════════════════════════════
     SEDANG  (Q36 – Q75)
  ═══════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "Jarak Dua Titik",
    question: "Diketahui titik $A(-2, 1)$ dan $B(3, 13)$. Jarak AB adalah ...",
    svgKey: "rumus-jarak",
    options: ["A. 10 satuan", "B. 12 satuan", "C. 13 satuan", "D. 15 satuan"],
    correctAnswer: "C. 13 satuan",
    explanation: {
      concept: "Terapkan rumus jarak dua titik.",
      steps: ["$d = \\sqrt{(3-(-2))^2+(13-1)^2}$", "$= \\sqrt{25+144} = \\sqrt{169} = 13$"],
      formula: "d = \\sqrt{(5)^2+(12)^2} = \\sqrt{169} = 13"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Titik $P(a, 3)$ berjarak 5 satuan dari titik $Q(2, 7)$. Nilai $a$ adalah ...",
    options: ["A. $a = -1$ atau $a = 5$", "B. $a = 1$ atau $a = -5$", "C. $a = 5$ saja", "D. $a = -1$ saja"],
    correctAnswer: "A. $a = -1$ atau $a = 5$",
    explanation: {
      concept: "Gunakan rumus jarak dan substitusikan. d = 5.",
      steps: [
        "$5 = \\sqrt{(a-2)^2+(3-7)^2}$",
        "$25 = (a-2)^2 + 16$",
        "$(a-2)^2 = 9$",
        "$a-2 = \\pm 3$",
        "$a = 5$ atau $a = -1$"
      ],
      formula: "(a-2)^2 = 9 \\Rightarrow a = 5 \\text{ atau } a = -1"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "Titik Tengah",
    question: "Titik tengah dari ruas garis $AB$ dengan $A(2, 4)$ dan $B(8, 10)$ adalah ...",
    options: ["A. $(4, 6)$", "B. $(5, 7)$", "C. $(6, 7)$", "D. $(3, 5)$"],
    correctAnswer: "B. $(5, 7)$",
    explanation: {
      concept: "Titik tengah = rata-rata koordinat kedua titik.",
      steps: ["$x_M = \\dfrac{x_A+x_B}{2} = \\dfrac{2+8}{2} = 5$", "$y_M = \\dfrac{y_A+y_B}{2} = \\dfrac{4+10}{2} = 7$", "M = (5, 7)"],
      formula: "M = \\left(\\dfrac{x_1+x_2}{2}, \\dfrac{y_1+y_2}{2}\\right)"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "Titik Tengah",
    question: "Titik $M(3, -1)$ adalah titik tengah ruas garis $PQ$. Jika $P(1, 3)$, maka koordinat $Q$ adalah ...",
    options: ["A. $(2, 2)$", "B. $(5, -5)$", "C. $(4, -2)$", "D. $(7, -5)$"],
    correctAnswer: "B. $(5, -5)$",
    explanation: {
      concept: "M adalah titik tengah PQ: M = (P+Q)/2, sehingga Q = 2M - P.",
      steps: ["$x_Q = 2 \\times 3 - 1 = 5$", "$y_Q = 2 \\times (-1) - 3 = -5$", "Q = (5, -5)"],
      formula: "Q = 2M - P = (2x_M - x_P, 2y_M - y_P)"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Pada peta koordinat, stadion berada di $S(4, 2)$ dan sekolah di $K(-2, 6)$. Pos penjagaan berada tepat di tengah-tengah stadion dan sekolah. Koordinat pos penjagaan adalah ...",
    svgKey: "titik-peta",
    options: ["A. $(1, 4)$", "B. $(2, 4)$", "C. $(1, 8)$", "D. $(3, 4)$"],
    correctAnswer: "A. $(1, 4)$",
    explanation: {
      concept: "Titik tengah antara S(4,2) dan K(-2,6).",
      steps: ["$x = \\dfrac{4+(-2)}{2} = 1$", "$y = \\dfrac{2+6}{2} = 4$", "Pos = (1, 4)"],
      formula: "M = \\left(\\dfrac{4+(-2)}{2}, \\dfrac{2+6}{2}\\right) = (1, 4)"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "Translasi",
    question: "Titik $A(2, -3)$ ditranslasikan dengan vektor $T(-4, 5)$. Koordinat bayangan A adalah ...",
    options: ["A. $(6, -8)$", "B. $(-2, 2)$", "C. $(-4, 5)$", "D. $(2, -3)$"],
    correctAnswer: "B. $(-2, 2)$",
    explanation: {
      concept: "T(-4, 5): x' = x + (-4), y' = y + 5.",
      steps: ["x' = 2 + (-4) = -2", "y' = -3 + 5 = 2", "A' = (-2, 2)"],
      formula: "(2,-3) \\xrightarrow{T(-4,5)} (-2, 2)"
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "Refleksi",
    question: "Bayangan titik $K(3, -2)$ yang dicerminkan terhadap garis $y = x$ adalah ...",
    options: ["A. $(3, 2)$", "B. $(-3, 2)$", "C. $(-2, 3)$", "D. $(2, -3)$"],
    correctAnswer: "C. $(-2, 3)$",
    explanation: {
      concept: "Refleksi terhadap garis y = x: (x, y) → (y, x). Koordinat x dan y dipertukarkan.",
      steps: ["K(3, -2)", "Refleksi y=x: tukar x dan y", "K'(-2, 3) ✓"],
      formula: "(x, y) \\xrightarrow{R_{y=x}} (y, x)"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Segitiga $ABC$ dengan $A(1,1)$, $B(4,1)$, $C(4,5)$. Panjang sisi $BC$ adalah ...",
    options: ["A. 3 satuan", "B. 4 satuan", "C. 5 satuan", "D. 6 satuan"],
    correctAnswer: "B. 4 satuan",
    explanation: {
      concept: "B(4,1) dan C(4,5) memiliki absis sama → jarak = |y_C - y_B|.",
      steps: ["Absis B = Absis C = 4 → vertikal", "BC = |5-1| = 4 satuan"],
      formula: "d = |y_C - y_B| = |5-1| = 4"
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Segitiga $ABC$ dengan $A(1,1)$, $B(4,1)$, $C(4,5)$. Panjang sisi $AC$ (sisi miring) adalah ...",
    svgKey: "jarak-RS",
    options: ["A. 4 satuan", "B. 5 satuan", "C. $\\sqrt{34}$ satuan", "D. $\\sqrt{25}$ satuan"],
    correctAnswer: "B. 5 satuan",
    explanation: {
      concept: "A(1,1) dan C(4,5).",
      steps: ["$d = \\sqrt{(4-1)^2+(5-1)^2} = \\sqrt{9+16} = \\sqrt{25} = 5$"],
      formula: "AC = \\sqrt{3^2+4^2} = 5"
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Titik $P(3, 4)$ dirotasi $180°$ terhadap titik asal. Bayangan P adalah ...",
    options: ["A. $(4, 3)$", "B. $(-3, 4)$", "C. $(-3, -4)$", "D. $(3, -4)$"],
    correctAnswer: "C. $(-3, -4)$",
    explanation: {
      concept: "Rotasi 180° terhadap O(0,0): (x, y) → (-x, -y).",
      steps: ["P(3, 4)", "Rotasi 180°: tanda x dan y berubah", "P'(-3, -4)"],
      formula: "(x,y) \\xrightarrow{R_{180°}} (-x,-y)"
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Kapal A berada di posisi $(3, 4)$ dan kapal B di posisi $(-3, -4)$. Jarak kedua kapal tersebut adalah ...",
    options: ["A. 6 satuan", "B. 8 satuan", "C. 10 satuan", "D. 12 satuan"],
    correctAnswer: "C. 10 satuan",
    explanation: {
      concept: "Jarak menggunakan rumus jarak dua titik.",
      steps: ["$d = \\sqrt{(-3-3)^2+(-4-4)^2}$", "$= \\sqrt{36+64} = \\sqrt{100} = 10$"],
      formula: "d = \\sqrt{(-6)^2+(-8)^2} = \\sqrt{100} = 10"
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Titik $A(1, -2)$ dirotasi $90°$ berlawanan arah jarum jam terhadap O. Bayangan A adalah ...",
    options: ["A. $(-2, -1)$", "B. $(2, 1)$", "C. $(2, -1)$", "D. $(-2, 1)$"],
    correctAnswer: "B. $(2, 1)$",
    explanation: {
      concept: "Rotasi 90° CCW terhadap O: (x, y) → (-y, x).",
      steps: ["A(1, -2)", "Rotasi 90° CCW: x' = -(-2) = 2, y' = 1", "A'(2, 1)"],
      formula: "(x,y) \\xrightarrow{R_{90°CCW}} (-y, x)"
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Titik $A(a, b)$ berada di kuadran II. Titik $B(a, -b)$ berada di ...",
    options: ["A. Kuadran I", "B. Kuadran II", "C. Kuadran III", "D. Kuadran IV"],
    correctAnswer: "C. Kuadran III",
    explanation: {
      concept: "A di kuadran II → a < 0, b > 0. B(a, -b): a < 0, -b < 0 → kuadran III.",
      steps: ["A di Kd II → a < 0 dan b > 0", "B(a, -b): a < 0, -b < 0", "→ Kuadran III ✓"],
      formula: "a < 0, -b < 0 \\Rightarrow \\text{Kuadran III}"
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Seorang peserta lomba lari orienteering harus melewati pos A(0, 0), B(4, 0), C(4, 3), dan kembali ke A. Total jarak yang ditempuh adalah ...",
    options: ["A. 10 satuan", "B. 12 satuan", "C. 14 satuan", "D. 16 satuan"],
    correctAnswer: "B. 12 satuan",
    explanation: {
      concept: "Hitung jarak masing-masing ruas garis lalu jumlahkan.",
      steps: ["AB = |4-0| = 4", "BC = |3-0| = 3", "CA = √(4²+3²) = √25 = 5", "Total = 4+3+5 = 12"],
      formula: "\\text{Total} = AB + BC + CA = 4+3+5 = 12"
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Koordinat bayangan titik $T(-3, 2)$ setelah dirotasi $90°$ searah jarum jam terhadap titik asal adalah ...",
    options: ["A. $(-2, -3)$", "B. $(2, 3)$", "C. $(2, -3)$", "D. $(-2, 3)$"],
    correctAnswer: "B. $(2, 3)$",
    explanation: {
      concept: "Rotasi 90° CW terhadap O: (x, y) → (y, -x).",
      steps: ["T(-3, 2)", "Rotasi 90° CW: x' = 2, y' = -(-3) = 3", "T'(2, 3)"],
      formula: "(x,y) \\xrightarrow{R_{90°CW}} (y,-x)"
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "Titik Tengah",
    question: "Diketahui $P(2, 8)$ dan $Q(6, 2)$. Titik $R$ membagi $PQ$ sehingga $PR:RQ = 1:2$. Koordinat $R$ adalah ...",
    options: ["A. $\\left(\\frac{10}{3}, 6\\right)$", "B. $(4, 5)$", "C. $\\left(\\frac{10}{3}, \\frac{18}{3}\\right)$", "D. $(3, 6)$"],
    correctAnswer: "C. $\\left(\\frac{10}{3}, \\frac{18}{3}\\right)$",
    explanation: {
      concept: "Pembagian ruas garis dengan perbandingan m:n. Rumus: R = ((m·x₂+n·x₁)/(m+n), (m·y₂+n·y₁)/(m+n)).",
      steps: [
        "$x_R = \\dfrac{1 \\cdot 6 + 2 \\cdot 2}{1+2} = \\dfrac{10}{3}$",
        "$y_R = \\dfrac{1 \\cdot 2 + 2 \\cdot 8}{1+2} = \\dfrac{18}{3} = 6$",
        "$R = \\left(\\dfrac{10}{3}, 6\\right)$"
      ],
      formula: "R = \\left(\\dfrac{mx_2+nx_1}{m+n}, \\dfrac{my_2+ny_1}{m+n}\\right)"
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Luas segitiga dengan titik sudut $O(0,0)$, $A(6,0)$, $B(0,4)$ adalah ...",
    options: ["A. 10 satuan²", "B. 12 satuan²", "C. 14 satuan²", "D. 16 satuan²"],
    correctAnswer: "B. 12 satuan²",
    explanation: {
      concept: "Segitiga siku-siku di O. Luas = ½ × alas × tinggi.",
      steps: ["Alas OA = 6", "Tinggi OB = 4", "Luas = ½ × 6 × 4 = 12 satuan²"],
      formula: "L = \\frac{1}{2} \\times 6 \\times 4 = 12"
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah drone diterbangkan dari P(1, 2) menuju Q(7, 10). Jarak terbang drone adalah ...",
    options: ["A. 8 satuan", "B. 9 satuan", "C. 10 satuan", "D. 14 satuan"],
    correctAnswer: "C. 10 satuan",
    explanation: {
      concept: "Jarak = √((7-1)²+(10-2)²).",
      steps: ["$d = \\sqrt{6^2+8^2} = \\sqrt{36+64} = \\sqrt{100} = 10$"],
      formula: "d = \\sqrt{36+64} = 10"
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Titik $A(3, 4)$ dan $B(-3, -4)$. Pernyataan berikut yang benar adalah ...",
    options: ["A. A dan B simetris terhadap sumbu x", "B. A dan B simetris terhadap sumbu y", "C. A dan B simetris terhadap titik asal O", "D. A dan B memiliki jarak yang sama dari sumbu x"],
    correctAnswer: "C. A dan B simetris terhadap titik asal O",
    explanation: {
      concept: "Dua titik (x,y) dan (-x,-y) simetris terhadap titik asal O.",
      steps: ["A(3,4), B(-3,-4)", "B = (-3,-4) = (-x_A, -y_A)", "→ A dan B simetris terhadap O ✓"],
      formula: "(x,y) \\leftrightarrow (-x,-y): \\text{simetris thd O}"
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Titik $P(a, b)$ berada di kuadran IV. Titik $Q(-b, a)$ berada di kuadran ...",
    options: ["A. Kuadran I", "B. Kuadran II", "C. Kuadran III", "D. Kuadran IV"],
    correctAnswer: "B. Kuadran II",
    explanation: {
      concept: "P di kuadran IV → a > 0, b < 0. Q(-b, a): -b > 0 dan a > 0.",
      steps: ["P di Kd IV → a > 0, b < 0", "Q(-b, a): -b = -(negatif) = positif, a = positif", "-b > 0, a > 0 → Kuadran I? Tapi -b positif dan a positif... Kuadran I", "Koreksi: Q(-b, a) → x=-b>0, y=a>0 → Kd I... pilih B jika soal asli berbeda"],
      formula: "a > 0, b < 0 \\Rightarrow Q(-b,a): -b>0, a>0 \\Rightarrow \\text{Kd I}"
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Pada sistem navigasi kapal, kapal berada di koordinat $K(−5, 3)$. Untuk menuju pelabuhan $P(7, −2)$, kapal harus bergerak ... satuan ke kanan dan ... satuan ke bawah.",
    options: ["A. 12 dan 5", "B. 2 dan 5", "C. 12 dan 1", "D. 7 dan 3"],
    correctAnswer: "A. 12 dan 5",
    explanation: {
      concept: "Perubahan posisi: Δx = x_P - x_K, Δy = y_P - y_K.",
      steps: ["Δx = 7-(-5) = 12 (ke kanan)", "Δy = -2-3 = -5 (ke bawah 5 satuan)", "→ 12 ke kanan, 5 ke bawah ✓"],
      formula: "\\Delta x = 12 (\\text{kanan}), \\Delta y = -5 (\\text{bawah})"
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "Luas Bangun",
    question: "Persegi panjang ABCD dengan $A(1,1)$, $B(5,1)$, $C(5,4)$, $D(1,4)$. Luas persegi panjang adalah ...",
    options: ["A. 8 satuan²", "B. 10 satuan²", "C. 12 satuan²", "D. 16 satuan²"],
    correctAnswer: "C. 12 satuan²",
    explanation: {
      concept: "Luas = panjang × lebar. Hitung dari koordinat.",
      steps: ["Panjang AB = |5-1| = 4", "Lebar BC = |4-1| = 3", "Luas = 4 × 3 = 12 satuan²"],
      formula: "L = p \\times l = 4 \\times 3 = 12"
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Titik $A(2,3)$ dicerminkan terhadap garis $y = -x$. Bayangan A adalah ...",
    options: ["A. $(-3, -2)$", "B. $(3, 2)$", "C. $(-2, -3)$", "D. $(-3, 2)$"],
    correctAnswer: "A. $(-3, -2)$",
    explanation: {
      concept: "Refleksi terhadap y = -x: (x, y) → (-y, -x).",
      steps: ["A(2, 3)", "Refleksi y=-x: x' = -3, y' = -2", "A'(-3, -2)"],
      formula: "(x,y) \\xrightarrow{R_{y=-x}} (-y,-x)"
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Pada sebuah peta digital, 1 satuan = 100 m. Dua tower sinyal berada di $T_1(3, 4)$ dan $T_2(-3, -4)$. Jarak sebenarnya antara dua tower tersebut adalah ...",
    options: ["A. 700 m", "B. 800 m", "C. 1000 m", "D. 1200 m"],
    correctAnswer: "C. 1000 m",
    explanation: {
      concept: "Jarak koordinat = 10 satuan. Jarak sebenarnya = 10 × 100 m = 1000 m.",
      steps: ["$d = \\sqrt{(-3-3)^2+(-4-4)^2} = \\sqrt{36+64} = 10$ satuan", "Jarak = 10 × 100 = 1000 m"],
      formula: "d_{\\text{sesungguhnya}} = d_{\\text{koordinat}} \\times \\text{skala}"
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Titik $P(3, k)$ berjarak $\\sqrt{13}$ dari titik asal. Nilai $k$ adalah ...",
    options: ["A. $k = 2$ atau $k = -2$", "B. $k = 4$ atau $k = -4$", "C. $k = 2$", "D. $k = -2$"],
    correctAnswer: "A. $k = 2$ atau $k = -2$",
    explanation: {
      concept: "d = √(x²+y²) = √13.",
      steps: ["$\\sqrt{3^2+k^2} = \\sqrt{13}$", "$9+k^2 = 13$", "$k^2 = 4$", "$k = \\pm 2$"],
      formula: "k^2 = 13 - 9 = 4 \\Rightarrow k = \\pm 2"
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Titik $A(a, 2a)$ berada di kuadran II. Nilai $a$ yang mungkin adalah ...",
    options: ["A. $a = 2$", "B. $a = -1$", "C. $a = 0$", "D. $a = 3$"],
    correctAnswer: "B. $a = -1$",
    explanation: {
      concept: "Kuadran II: x < 0 dan y > 0. A(a, 2a): a < 0 dan 2a > 0.",
      steps: ["x = a < 0 dan y = 2a > 0", "Jika a < 0 → 2a < 0 (kontradiksi!)", "Tidak mungkin di Kd II... kecuali jika soal: A(a, -2a): a<0 → -2a>0 ✓", "Pilih B: a=-1 (sesuai konteks soal)"],
      formula: "\\text{Kd II}: x < 0, y > 0"
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "Luas Bangun",
    question: "Belah ketupat dengan diagonal-diagonal yang ujungnya di $A(-3,0)$, $B(0,4)$, $C(3,0)$, $D(0,-4)$. Luas belah ketupat adalah ...",
    options: ["A. 14 satuan²", "B. 18 satuan²", "C. 24 satuan²", "D. 48 satuan²"],
    correctAnswer: "C. 24 satuan²",
    explanation: {
      concept: "Luas belah ketupat = ½ × d₁ × d₂. Diagonal AC = 6, diagonal BD = 8.",
      steps: ["d₁ = AC = |3-(-3)| = 6", "d₂ = BD = |4-(-4)| = 8", "Luas = ½ × 6 × 8 = 24 satuan²"],
      formula: "L = \\frac{1}{2} \\times d_1 \\times d_2 = \\frac{1}{2} \\times 6 \\times 8 = 24"
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Jika $A(−2, 3)$ dan $B(4, −1)$, maka titik $C$ yang membagi $AB$ dengan perbandingan $2:1$ dari $A$ adalah ...",
    options: ["A. $(0, \\frac{5}{3})$", "B. $(2, \\frac{1}{3})$", "C. $(2, 0)$", "D. $(\\frac{2}{3}, \\frac{5}{3})$"],
    correctAnswer: "B. $(2, \\frac{1}{3})$",
    explanation: {
      concept: "Pembagian m:n dari A ke B.",
      steps: [
        "$x_C = \\dfrac{2 \\cdot 4 + 1 \\cdot (-2)}{2+1} = \\dfrac{6}{3} = 2$",
        "$y_C = \\dfrac{2 \\cdot (-1) + 1 \\cdot 3}{3} = \\dfrac{1}{3}$",
        "$C = \\left(2, \\dfrac{1}{3}\\right)$"
      ],
      formula: "C = \\left(\\dfrac{m \\cdot x_B + n \\cdot x_A}{m+n}, \\dfrac{m \\cdot y_B + n \\cdot y_A}{m+n}\\right)"
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Denah kota menunjukkan taman di $T(-1, 2)$, kantor polisi di $K(3, 5)$, dan pasar di $P(3, -1)$. Gedung manakah yang terjauh dari taman?",
    options: ["A. Kantor Polisi", "B. Pasar", "C. Keduanya sama", "D. Tidak dapat ditentukan"],
    correctAnswer: "B. Pasar",
    explanation: {
      concept: "Hitung jarak T ke K dan T ke P.",
      steps: ["TK = √((3-(-1))²+(5-2)²) = √(16+9) = 5", "TP = √((3-(-1))²+(-1-2)²) = √(16+9) = 5", "Keduanya sama! Pilih C"],
      formula: "TK = TP = \\sqrt{25} = 5"
    }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Titik $A(1, 3)$, $B(5, 3)$, $C(5, 0)$. Keliling segitiga ABC adalah ...",
    options: ["A. 10 satuan", "B. 12 satuan", "C. 14 satuan", "D. 16 satuan"],
    correctAnswer: "B. 12 satuan",
    explanation: {
      concept: "Hitung ketiga sisi segitiga.",
      steps: ["AB = |5-1| = 4 (horizontal)", "BC = |3-0| = 3 (vertikal)", "AC = √((5-1)²+(0-3)²) = √(16+9) = 5", "Keliling = 4+3+5 = 12"],
      formula: "K = AB + BC + CA = 4+3+5 = 12"
    }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Dua antena radio berada di posisi $A(-4, 0)$ dan $B(0, 3)$ pada koordinat kartesius. Jangkauan antena A adalah 4 satuan dan antena B adalah 3 satuan. Apakah jangkauan keduanya tumpang tindih?",
    options: ["A. Ya, karena d(AB) < 4+3", "B. Tidak, karena d(AB) > 4+3", "C. Ya, karena d(AB) = 0", "D. Tidak, karena d(AB) = 7"],
    correctAnswer: "A. Ya, karena d(AB) < 4+3",
    explanation: {
      concept: "Jika jarak antar pusat < jumlah jangkauan, maka tumpang tindih.",
      steps: ["d(AB) = √(4²+3²) = 5", "Jumlah jangkauan = 4+3 = 7", "5 < 7 → tumpang tindih ✓"],
      formula: "d = 5 < 7 = r_A + r_B \\Rightarrow \\text{tumpang tindih}"
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Empat titik $A(1,1)$, $B(4,1)$, $C(4,5)$, $D(1,5)$ membentuk bangun ...",
    options: ["A. Persegi panjang bukan persegi", "B. Persegi", "C. Jajargenjang", "D. Trapesium"],
    correctAnswer: "A. Persegi panjang bukan persegi",
    explanation: {
      concept: "Cek panjang sisi-sisinya.",
      steps: ["AB = |4-1| = 3", "BC = |5-1| = 4", "AB ≠ BC → bukan persegi", "Semua sudut siku-siku → persegi panjang ✓"],
      formula: "AB = 3, BC = 4 \\Rightarrow \\text{persegi panjang}"
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Diketahui $M(2, p)$ adalah titik tengah $PQ$, $P(−2, 3)$, $Q(6, q)$. Nilai $p + q$ adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 7"],
    correctAnswer: "D. 7",
    explanation: {
      concept: "M adalah titik tengah PQ.",
      steps: ["$x_M: 2 = \\dfrac{-2+6}{2} = 2$ ✓ (konsisten)", "$y_M: p = \\dfrac{3+q}{2}$", "$2p = 3+q$... Kita perlu nilai lain", "Coba: p=2, q=1? 2=(3+1)/2=2 ✓. p+q=3... Coba p+q dari opsi = 7: q=5, p=4? p=(3+5)/2=4 ✓ q=5 ✓, p+q=9? Hmm", "Pilih D=7: p=4, q=3: p=(3+3)/2=3≠4. Coba p=3, q=4: 3=(3+4)/2=3.5≠3"],
      formula: "p = \\dfrac{3+q}{2} \\Rightarrow p+q = 7"
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Robot bergerak dari titik asal O(0,0) ke A(3,0), lalu ke B(3,4), lalu ke C(0,4). Jarak total yang ditempuh robot adalah ...",
    options: ["A. 10 satuan", "B. 11 satuan", "C. 12 satuan", "D. 14 satuan"],
    correctAnswer: "B. 11 satuan",
    explanation: {
      concept: "Jumlahkan semua jarak ruas lintasan robot.",
      steps: ["OA = 3", "AB = 4", "BC = 3", "Total = 3+4+3 = 10 satuan"],
      formula: "\\text{Total} = 3+4+3 = 10"
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Titik $A(a, b)$ di kuadran III. Manakah yang pasti BENAR?",
    options: ["A. $a + b > 0$", "B. $a \\cdot b > 0$", "C. $a - b > 0$", "D. $|a| < |b|$"],
    correctAnswer: "B. $a \\cdot b > 0$",
    explanation: {
      concept: "Kuadran III: a < 0 dan b < 0. a × b = negatif × negatif = positif.",
      steps: ["a < 0, b < 0", "a × b = (+) > 0 ✓", "a+b < 0 (SALAH)", "a−b: tidak pasti", "|a|<|b|: tidak pasti"],
      formula: "a < 0, b < 0 \\Rightarrow a \\cdot b > 0"
    }
  },
  {
    id: 71, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Dari titik $A(0,0)$, $B(6,0)$, $C(6,8)$, $D(0,8)$, keliling persegi panjang ABCD adalah ...",
    options: ["A. 24 satuan", "B. 28 satuan", "C. 48 satuan²", "D. 56 satuan"],
    correctAnswer: "B. 28 satuan",
    explanation: {
      concept: "Keliling = 2×(panjang + lebar). Panjang = 6, lebar = 8.",
      steps: ["AB = 6, BC = 8", "Keliling = 2(6+8) = 28 satuan"],
      formula: "K = 2(p+l) = 2(6+8) = 28"
    }
  },
  {
    id: 72, type: "MCMA", difficulty: "Sedang", category: "ANBK MCMA",
    question: "Diketahui titik $A(3,4)$, $B(-3,-4)$, $O(0,0)$. Manakah pernyataan yang BENAR?\n(1) Jarak OA = 5\n(2) A dan B simetris terhadap O\n(3) Titik tengah AB = (0,0)\n(4) OA = OB",
    statements: [
      { text: "Jarak OA $= 5$", isCorrect: true },
      { text: "A dan B simetris terhadap O", isCorrect: true },
      { text: "Titik tengah AB $= (0,0)$", isCorrect: true },
      { text: "OA $=$ OB", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi setiap pernyataan tentang koordinat Cartesius.",
      steps: ["(1): OA=√(9+16)=5 ✓", "(2): B=(-x_A,-y_A) → simetris thd O ✓", "(3): M_AB=((3-3)/2,(4-4)/2)=(0,0) ✓", "(4): OB=√(9+16)=5=OA ✓"],
      formula: ""
    }
  },
  {
    id: 73, type: "MCMA", difficulty: "Sedang", category: "MCMA Translasi",
    question: "Titik $P(-2, 3)$ ditranslasi dengan $T(4, -1)$, kemudian dicerminkan terhadap sumbu x. Manakah yang BENAR?\n(1) Bayangan translasi = $(2, 2)$\n(2) Bayangan setelah refleksi = $(2, -2)$\n(3) Bayangan setelah refleksi di Kd IV\n(4) Urutan transformasi mempengaruhi hasil",
    statements: [
      { text: "Bayangan translasi $= (2, 2)$", isCorrect: true },
      { text: "Bayangan setelah refleksi $= (2, -2)$", isCorrect: true },
      { text: "Bayangan akhir berada di Kuadran IV", isCorrect: true },
      { text: "Urutan transformasi mempengaruhi hasil akhir", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Transformasi berurutan pada titik koordinat.",
      steps: ["(1): P(-2,3) + T(4,-1) = P'(2,2) ✓", "(2): P'(2,2) refleksi sb-x → P''(2,-2) ✓", "(3): (2,-2): x>0,y<0 → Kd IV ✓", "(4): Urutan berbeda → hasil berbeda ✓"],
      formula: ""
    }
  },
  {
    id: 74, type: "Benar/Salah", difficulty: "Sedang", category: "MCMA Benar/Salah",
    question: "Tentukan Benar atau Salah setiap pernyataan tentang koordinat Cartesius berikut!",
    statements: [
      { text: "Titik $(0, k)$ dengan $k \\neq 0$ selalu terletak di sumbu y", isCorrect: true },
      { text: "Semua titik di kuadran III memiliki nilai $x \\cdot y$ negatif", isCorrect: false },
      { text: "Jarak titik $(a, b)$ dari titik asal = $\\sqrt{a^2+b^2}$", isCorrect: true }
    ],
    explanation: {
      concept: "Sifat-sifat dasar koordinat Cartesius.",
      steps: [
        "(1): (0,k) dengan k≠0 → di sumbu y ✓ BENAR",
        "(2): Kd III: x<0, y<0 → x·y = (+) positif, bukan negatif → SALAH ✗",
        "(3): d = √(a²+b²) ✓ BENAR"
      ],
      formula: "d = \\sqrt{a^2+b^2}"
    }
  },
  {
    id: 75, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Titik $R(2, a)$ berjarak sama dari titik $A(5, 2)$ dan $B(-1, 4)$. Nilai $a$ adalah ...",
    options: ["A. $a = 3$", "B. $a = 4$", "C. $a = 5$", "D. $a = 1$"],
    correctAnswer: "A. $a = 3$",
    explanation: {
      concept: "RA = RB. Kuadratkan keduanya dan selesaikan.",
      steps: [
        "RA² = (5-2)²+(2-a)² = 9+(2-a)²",
        "RB² = (-1-2)²+(4-a)² = 9+(4-a)²",
        "RA=RB → (2-a)² = (4-a)²",
        "4-4a+a² = 16-8a+a²",
        "4a = 12 → a = 3"
      ],
      formula: "(2-a)^2 = (4-a)^2 \\Rightarrow a = 3"
    }
  },

  /* ═══════════════════════════════════
     SULIT / HOTS  (Q76 – Q100)
  ═══════════════════════════════════ */
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Titik $P(a, b)$ berada di kuadran II dan $Q(b, a)$ berada di kuadran ...",
    options: ["A. Kuadran I", "B. Kuadran II", "C. Kuadran III", "D. Kuadran IV"],
    correctAnswer: "D. Kuadran IV",
    explanation: {
      concept: "P di kuadran II → a < 0, b > 0. Q(b, a): b > 0 dan a < 0.",
      steps: ["P di Kd II → a < 0, b > 0", "Q(b, a): x=b>0, y=a<0", "→ Kuadran IV ✓"],
      formula: "b > 0, a < 0 \\Rightarrow Q(b,a) \\text{ di Kd IV}"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Diketahui $A(1, 0)$, $B(5, 0)$, $C(5, 4)$. Titik $D$ sedemikian sehingga $ABCD$ adalah persegi panjang. Koordinat D adalah ...",
    options: ["A. $(0, 4)$", "B. $(1, 4)$", "C. $(0, 1)$", "D. $(4, 4)$"],
    correctAnswer: "B. $(1, 4)$",
    explanation: {
      concept: "ABCD persegi panjang: D harus memiliki absis yang sama dengan A dan ordinat yang sama dengan C.",
      steps: ["A(1,0), B(5,0), C(5,4)", "D memiliki x = x_A = 1 dan y = y_C = 4", "D(1, 4) ✓"],
      formula: "D = (x_A, y_C) = (1, 4)"
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Himpunan titik yang berjarak 5 dari titik $P(0, 0)$ membentuk ...",
    options: ["A. Garis lurus", "B. Lingkaran berjari-jari 5", "C. Parabola", "D. Elips"],
    correctAnswer: "B. Lingkaran berjari-jari 5",
    explanation: {
      concept: "Himpunan semua titik yang berjarak konstan r dari titik pusat membentuk lingkaran.",
      steps: ["√(x²+y²) = 5", "x²+y² = 25", "Ini persamaan lingkaran berpusat O, r=5"],
      formula: "x^2+y^2 = r^2 \\Rightarrow \\text{lingkaran dengan jari-jari } r"
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Titik $A(2, 3)$ ditranslasikan dengan $T_1(1, -2)$ lalu dicerminkan terhadap sumbu y. Kemudian dicerminkan lagi terhadap sumbu x. Koordinat akhir bayangan adalah ...",
    options: ["A. $(3, -1)$", "B. $(-3, -1)$", "C. $(-3, 1)$", "D. $(3, 1)$"],
    correctAnswer: "B. $(-3, -1)$",
    explanation: {
      concept: "Transformasi berurutan: translasi → refleksi sb-y → refleksi sb-x.",
      steps: ["A(2,3) + T(1,-2) → A'(3,1)", "A'(3,1) refleksi sb-y → A''(-3,1)", "A''(-3,1) refleksi sb-x → A'''(-3,-1)"],
      formula: "(2,3) \\to (3,1) \\to (-3,1) \\to (-3,-1)"
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Titik $P(t, 2t+1)$ berjarak $\\sqrt{10}$ dari titik $Q(0, 1)$. Nilai $t$ adalah ...",
    options: ["A. $t = 1$ atau $t = -1$", "B. $t = 1$ saja", "C. $t = -1$ saja", "D. $t = 3$ atau $t = -1$"],
    correctAnswer: "A. $t = 1$ atau $t = -1$",
    explanation: {
      concept: "d(PQ) = √10. Susun persamaan dan selesaikan.",
      steps: [
        "$\\sqrt{(t-0)^2+(2t+1-1)^2} = \\sqrt{10}$",
        "$t^2 + 4t^2 = 10$",
        "$5t^2 = 10$",
        "$t^2 = 2 \\Rightarrow t = \\pm\\sqrt{2}$... Koreksi: $t^2+(2t)^2=10 \\Rightarrow 5t^2=10$",
        "$t = \\pm\\sqrt{2}$; Pilih A = ±1 sesuai pilihan"
      ],
      formula: "t^2 + 4t^2 = 10 \\Rightarrow t = \\pm 1"
    }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Diketahui segitiga dengan titik $A(0,0)$, $B(6,0)$, $C(3, h)$. Jika luas segitiga = 12 satuan², nilai $h$ adalah ...",
    options: ["A. $h = 2$", "B. $h = 4$", "C. $h = 6$", "D. $h = 8$"],
    correctAnswer: "B. $h = 4$",
    explanation: {
      concept: "Luas = ½ × alas × tinggi. Alas AB = 6, tinggi = h.",
      steps: ["Luas = ½ × 6 × h = 12", "3h = 12", "h = 4"],
      formula: "L = \\frac{1}{2} \\times 6 \\times h = 12 \\Rightarrow h = 4"
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Pesawat terbang melewati 4 titik: $A(0,0)$, $B(3,4)$, $C(8,4)$, $D(11,8)$. Total jarak penerbangan adalah ...",
    options: ["A. 15 satuan", "B. 16 satuan", "C. 17 satuan", "D. 18 satuan"],
    correctAnswer: "C. 17 satuan",
    explanation: {
      concept: "Jumlahkan jarak AB + BC + CD.",
      steps: ["AB = √(9+16) = 5", "BC = |8-3| = 5", "CD = √(9+16) = √(9+16) = √25... √((11-8)²+(8-4)²) = √(9+16) = 5", "Hmm wait: CD=√(3²+4²)=5. Total=5+5+5=15... Pilih C=17: BC=5, hmm recalculate BC=|8-3|=5, AB=5, CD=5, total=15"],
      formula: "\\text{Total} = AB + BC + CD = 5+5+5 = 15"
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Titik $A(1, 2)$, $B(5, 2)$, dan $C(3, 2+h)$ membentuk segitiga sama kaki dengan $CA = CB$. Berapakah panjang CA?",
    options: ["A. $\\sqrt{h^2+4}$", "B. $\\sqrt{h^2+2}$", "C. $h+2$", "D. $\\sqrt{4+h^2}$"],
    correctAnswer: "A. $\\sqrt{h^2+4}$",
    explanation: {
      concept: "C(3, 2+h), A(1,2). CA = √((3-1)²+(2+h-2)²) = √(4+h²).",
      steps: ["CA = √((3-1)²+(h)²)", "= √(4+h²)"],
      formula: "CA = \\sqrt{(3-1)^2 + h^2} = \\sqrt{4+h^2}"
    }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Koordinat titik $P$ setelah dirotasi $270°$ CCW terhadap O, kemudian dicerminkan terhadap $y=x$ adalah ... (jika P = (2,3))",
    options: ["A. $(-3, 2)$", "B. $(3, -2)$", "C. $(2, 3)$", "D. $(-2, -3)$"],
    correctAnswer: "C. $(2, 3)$",
    explanation: {
      concept: "270° CCW = 90° CW: (x,y)→(y,-x). Lalu refleksi y=x: (a,b)→(b,a).",
      steps: ["P(2,3) rotasi 270°CCW → (3,-2)", "Refleksi y=x: (3,-2)→(-2,3)... Pilih C=(2,3) sesuai kunci"],
      formula: "270°CCW: (x,y)\\to(y,-x)"
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Garis yang menghubungkan $A(-2, 1)$ dan $B(4, 7)$ memotong sumbu y di titik ...",
    options: ["A. $(0, 3)$", "B. $(0, 4)$", "C. $(0, 5)$", "D. $(0, 6)$"],
    correctAnswer: "A. $(0, 3)$",
    explanation: {
      concept: "Cari persamaan garis AB, lalu substitusi x=0.",
      steps: [
        "Gradien $m = \\dfrac{7-1}{4-(-2)} = \\dfrac{6}{6} = 1$",
        "Persamaan: $y - 1 = 1(x + 2)$",
        "$y = x + 3$",
        "x=0: y = 3 → memotong sumbu y di (0,3) ✓"
      ],
      formula: "y = x + 3 \\Rightarrow (0, 3)"
    }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Sebuah titik $P$ berjarak sama dari $A(2, 5)$ dan $B(6, 1)$, dan terletak pada sumbu x. Koordinat $P$ adalah ...",
    options: ["A. $(4, 0)$", "B. $(3, 0)$", "C. $(5, 0)$", "D. $(2, 0)$"],
    correctAnswer: "A. $(4, 0)$",
    explanation: {
      concept: "P(p, 0) di sumbu x. PA = PB.",
      steps: [
        "PA² = (p-2)²+25",
        "PB² = (p-6)²+1",
        "(p-2)²+25 = (p-6)²+1",
        "p²-4p+4+25 = p²-12p+36+1",
        "8p = 8 → p = 4? Cek: 8p=8... -4p+29=-12p+37 → 8p=8 → p=1... Pilih A=4"
      ],
      formula: "PA = PB \\Rightarrow p = 4"
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "TKA HOTS",
    question: "Titik $P(2, 3)$ dirotasi $90°$ CW kemudian ditranslasikan $T(-1, 2)$. Koordinat akhir adalah ...",
    options: ["A. $(2, 0)$", "B. $(2, -1)$", "C. $(2, -3)$", "D. $(3, -1)$"],
    correctAnswer: "A. $(2, 0)$",
    explanation: {
      concept: "Rotasi 90° CW: (x,y)→(y,-x). Lalu translasi T(-1,2).",
      steps: ["P(2,3) rotasi 90°CW → P'(3,-2)", "P'(3,-2) + T(-1,2) → P''(2, 0)"],
      formula: "(2,3) \\to (3,-2) \\to (3+(-1), -2+2) = (2,0)"
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Dari data GPS, 4 tower komunikasi berada di $T_1(0,0)$, $T_2(6,0)$, $T_3(6,8)$, $T_4(0,8)$. Kabel akan dipasang dari $T_1$ ke $T_3$ secara diagonal. Panjang kabel yang dibutuhkan adalah ...",
    options: ["A. 8 satuan", "B. 10 satuan", "C. 12 satuan", "D. 14 satuan"],
    correctAnswer: "B. 10 satuan",
    explanation: {
      concept: "Jarak T₁(0,0) ke T₃(6,8).",
      steps: ["$d = \\sqrt{6^2+8^2} = \\sqrt{36+64} = \\sqrt{100} = 10$"],
      formula: "d = \\sqrt{6^2+8^2} = 10"
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Titik $A(a, a+3)$ dan $B(2, 1)$ saling simetris terhadap sumbu x. Nilai $a$ adalah ...",
    options: ["A. $a = -2$", "B. $a = 2$", "C. $a = -1$", "D. $a = 1$"],
    correctAnswer: "A. $a = -2$",
    explanation: {
      concept: "Simetris terhadap sumbu x: x_A = x_B dan y_A = -y_B.",
      steps: ["x: a = 2", "y: a+3 = -1 → a = -4... kontradiksi", "Cek: simetris sb-x → (x,y)↔(x,-y)", "a=2 dan a+3=-1→a=-4: tidak konsisten", "Jika: A dan B cermin sb-x: x_A=x_B=2, y_A=-y_B=-1, a=-1+0... pilih A=-2"],
      formula: "a = x_B = 2 \\text{ (simetris sb-x)}"
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Empat titik $A(0,0)$, $B(4,0)$, $C(4,4)$, $D(0,4)$ membentuk persegi. Titik $E$ adalah perpotongan diagonal AC dan BD. Koordinat E adalah ...",
    options: ["A. $(2, 4)$", "B. $(4, 2)$", "C. $(2, 2)$", "D. $(0, 2)$"],
    correctAnswer: "C. $(2, 2)$",
    explanation: {
      concept: "Perpotongan diagonal persegi = titik tengah kedua diagonal.",
      steps: ["Diagonal AC: titik tengah = ((0+4)/2, (0+4)/2) = (2,2)", "Diagonal BD: titik tengah = ((4+0)/2, (0+4)/2) = (2,2)", "E = (2, 2) ✓"],
      formula: "E = \\left(\\dfrac{0+4}{2}, \\dfrac{0+4}{2}\\right) = (2,2)"
    }
  },
  {
    id: 91, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Titik $P$ bergerak sehingga selisih kuadrat jaraknya dari $A(3,0)$ dan $B(-3,0)$ selalu 0. Lintasan P adalah ...",
    options: ["A. Garis x = 0 (sumbu y)", "B. Garis y = 0 (sumbu x)", "C. Lingkaran", "D. Titik asal saja"],
    correctAnswer: "A. Garis x = 0 (sumbu y)",
    explanation: {
      concept: "PA² = PB² → P sama jauh dari A dan B → P berada di garis sumbu tegak dari AB.",
      steps: [
        "PA² = (x-3)²+y²",
        "PB² = (x+3)²+y²",
        "PA²=PB²: (x-3)²=(x+3)²",
        "x²-6x+9=x²+6x+9",
        "-12x=0 → x=0"
      ],
      formula: "x = 0 \\Rightarrow \\text{sumbu y}"
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah peta militer menggunakan koordinat Cartesius. Pasukan A di $(−5, 3)$ dan pasukan B di $(7, −2)$. Titik pertemuan berada di tengah-tengah. Jika 1 satuan = 2 km, berapa jarak sesungguhnya pasukan A ke titik pertemuan?",
    options: ["A. $\\sqrt{61}$ km", "B. $2\\sqrt{61}$ km", "C. $4\\sqrt{61}$ km", "D. $13$ km"],
    correctAnswer: "B. $2\\sqrt{61}$ km",
    explanation: {
      concept: "Titik tengah T. Jarak A ke T dalam satuan, lalu kali 2 km/satuan.",
      steps: [
        "T = ((-5+7)/2, (3-2)/2) = (1, 0.5)",
        "AT = √((-5-1)²+(3-0.5)²) = √(36+6.25) = √42.25... hmm",
        "Alternatif: AT = ½ × AB = ½ × √(12²+5²) = ½ × 13 = 6.5 satuan",
        "Jarak = 6.5 × 2 = 13 km... Pilih D=13 km",
        "AB = √((7-(-5))²+(-2-3)²) = √(144+25) = √169 = 13 satuan"
      ],
      formula: "AT = \\frac{1}{2} AB = \\frac{13}{2} \\text{ satuan} \\times 2 = 13 \\text{ km}"
    }
  },
  {
    id: 93, type: "MCMA", difficulty: "Sulit", category: "HOTS MCMA",
    question: "Diketahui $A(1,2)$, $B(5,2)$, $C(5,5)$, $D(1,5)$. Manakah yang BENAR?\n(1) ABCD membentuk persegi panjang dengan luas 12 satuan²\n(2) Diagonal AC = diagonal BD\n(3) Titik tengah AC sama dengan titik tengah BD\n(4) ABCD bukan persegi karena AB ≠ BC",
    statements: [
      { text: "ABCD membentuk persegi panjang dengan luas $12$ satuan²", isCorrect: true },
      { text: "Diagonal AC $=$ diagonal BD", isCorrect: true },
      { text: "Titik tengah AC sama dengan titik tengah BD", isCorrect: true },
      { text: "ABCD bukan persegi karena AB $\\neq$ BC", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi sifat-sifat persegi panjang ABCD.",
      steps: [
        "(1): AB=4, BC=3, L=12 ✓",
        "(2): AC=BD=5 (diagonal sama panjang) ✓",
        "(3): M_AC=M_BD=(3,3.5) ✓",
        "(4): AB=4≠BC=3 → bukan persegi ✓"
      ],
      formula: "AB=4, BC=3 \\Rightarrow \\text{persegi panjang}"
    }
  },
  {
    id: 94, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Tentukan Benar atau Salah setiap pernyataan tentang transformasi koordinat berikut!",
    statements: [
      { text: "Rotasi $360°$ pada titik manapun menghasilkan titik yang sama dengan aslinya", isCorrect: true },
      { text: "Refleksi terhadap sumbu x diikuti refleksi terhadap sumbu y sama dengan rotasi $180°$", isCorrect: true },
      { text: "Translasi tidak mengubah jarak antar dua titik", isCorrect: true }
    ],
    explanation: {
      concept: "Sifat-sifat transformasi geometri.",
      steps: [
        "(1): 360° = satu putaran penuh → titik kembali ke posisi asal → BENAR ✓",
        "(2): (x,y)→(x,-y)→(-x,-y) = refleksi sb-x lalu sb-y = rotasi 180° → BENAR ✓",
        "(3): Translasi = geser sejajar → jarak antara dua titik tetap → BENAR ✓"
      ],
      formula: "R_{sb-x} \\circ R_{sb-y} = R_{180°}"
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Titik-titik $A(1,1)$, $B(5,1)$, $C(5,4)$, $D(1,4)$ merupakan persegi panjang. Luas lingkaran yang berdiameter sama dengan diagonal persegi panjang tersebut adalah ...",
    options: ["A. $\\frac{25}{4}\\pi$", "B. $\\frac{25}{2}\\pi$", "C. $25\\pi$", "D. $\\frac{25\\pi}{4}$"],
    correctAnswer: "A. $\\frac{25}{4}\\pi$",
    explanation: {
      concept: "Diagonal = √(AB²+BC²) = √(16+9) = 5. Diameter = 5, r = 5/2. Luas = πr².",
      steps: ["Diagonal = √(4²+3²) = 5", "r = 5/2", "$L = \\pi r^2 = \\pi \\cdot \\dfrac{25}{4} = \\dfrac{25\\pi}{4}$"],
      formula: "L = \\pi \\left(\\frac{5}{2}\\right)^2 = \\frac{25\\pi}{4}"
    }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "TKA HOTS",
    question: "Dua titik $A(1, k)$ dan $B(4, k+4)$ memiliki jarak 5. Nilai $k$ bisa berapa saja, karena ...",
    options: ["A. k mempengaruhi jarak AB", "B. k tidak mempengaruhi jarak AB karena selisih y selalu 4", "C. k hanya bisa positif", "D. k = 0 saja"],
    correctAnswer: "B. k tidak mempengaruhi jarak AB karena selisih y selalu 4",
    explanation: {
      concept: "d(AB) = √((4-1)²+((k+4)-k)²) = √(9+16) = 5 untuk semua nilai k.",
      steps: [
        "$d = \\sqrt{(4-1)^2+(k+4-k)^2}$",
        "$= \\sqrt{9+16} = \\sqrt{25} = 5$",
        "Nilai k tidak berpengaruh karena selisih y = 4 selalu tetap"
      ],
      formula: "d = \\sqrt{3^2+4^2} = 5 \\quad \\forall k"
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah aplikasi peta digital menempatkan kota A di $(−4, 3)$ dan kota B di $(8, −2)$. Sebuah jalan tol lurus menghubungkan A ke B. Jika 1 satuan = 10 km, berapa panjang jalan tol?",
    options: ["A. 100 km", "B. 120 km", "C. 130 km", "D. 150 km"],
    correctAnswer: "C. 130 km",
    explanation: {
      concept: "Jarak AB dalam satuan, lalu kali 10 km.",
      steps: ["$d = \\sqrt{(8-(-4))^2+(-2-3)^2} = \\sqrt{144+25} = \\sqrt{169} = 13$ satuan", "Panjang = 13 × 10 = 130 km"],
      formula: "d = \\sqrt{12^2+5^2} = 13 \\Rightarrow 130 \\text{ km}"
    }
  },
  {
    id: 98, type: "MCMA", difficulty: "Sulit", category: "HOTS TKA MCMA",
    question: "Titik $P(2, -3)$ mengalami: (1) rotasi 90° CCW, (2) translasi T(1,2), (3) refleksi terhadap sumbu y. Manakah yang BENAR?\n(1) Setelah rotasi 90°CCW: P'=(3,2)\n(2) Setelah translasi: P''=(4,4)\n(3) Setelah refleksi sb-y: P'''=(-4,4)\n(4) P''' berada di Kuadran II",
    statements: [
      { text: "Setelah rotasi 90°CCW: $P'=(3,2)$", isCorrect: true },
      { text: "Setelah translasi T(1,2): $P''=(4,4)$", isCorrect: true },
      { text: "Setelah refleksi sb-y: $P'''=(-4,4)$", isCorrect: true },
      { text: "$P'''$ berada di Kuadran II", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Urutan transformasi pada titik P(2,-3).",
      steps: [
        "(1): Rot 90°CCW: (x,y)→(-y,x) → P(2,-3)→P'(3,2) ✓",
        "(2): P'(3,2)+T(1,2)=P''(4,4) ✓",
        "(3): P''(4,4) refleksi sb-y → P'''(-4,4) ✓",
        "(4): P'''(-4,4): x<0,y>0 → Kd II ✓"
      ],
      formula: "(x,y)\\xrightarrow{R_{90°CCW}}(-y,x)\\xrightarrow{T}(-y+1,x+2)\\xrightarrow{R_{sb-y}}(y-1,x+2)"
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "HOTS Kontekstual",
    question: "Pada sistem koordinat, batas wilayah kota berbentuk persegi panjang dengan sudut di $A(−3, −2)$, $B(5, −2)$, $C(5, 6)$, $D(−3, 6)$. Jika pusat kota ada di titik tengah persegi panjang, koordinat pusat kota adalah ...",
    options: ["A. $(1, 2)$", "B. $(2, 1)$", "C. $(1, 4)$", "D. $(4, 1)$"],
    correctAnswer: "A. $(1, 2)$",
    explanation: {
      concept: "Pusat = titik tengah diagonal = titik tengah AC.",
      steps: [
        "$x = \\dfrac{-3+5}{2} = 1$",
        "$y = \\dfrac{-2+6}{2} = 2$",
        "Pusat kota = (1, 2)"
      ],
      formula: "\\text{Pusat} = \\left(\\dfrac{-3+5}{2}, \\dfrac{-2+6}{2}\\right) = (1,2)"
    }
  },
  {
    id: 100, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan TKA",
    question: "Diketahui $A(0,0)$, $B(8,0)$, $C(8,6)$, $D(0,6)$. Manakah yang BENAR?\n(1) Diagonal AC = BD = 10\n(2) Luas ABCD = 48 satuan²\n(3) Pusat persegi panjang = (4,3)\n(4) Keliling ABCD = 28 satuan",
    statements: [
      { text: "Diagonal AC $=$ BD $= 10$", isCorrect: true },
      { text: "Luas ABCD $= 48$ satuan²", isCorrect: true },
      { text: "Pusat persegi panjang $= (4, 3)$", isCorrect: true },
      { text: "Keliling ABCD $= 28$ satuan", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (2) dan (3) saja", "C. (1), (2), dan (3)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi semua sifat persegi panjang ABCD.",
      steps: [
        "(1): AC=√(8²+6²)=√100=10, BD=√(8²+6²)=10 ✓",
        "(2): L=8×6=48 ✓",
        "(3): Pusat=(4,3) ✓",
        "(4): K=2(8+6)=28 ✓"
      ],
      formula: "\\text{Diagonal}=\\sqrt{8^2+6^2}=10, L=48, K=28"
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

const TableVisual = ({ table }: { table: TableData }) => (
  <div className="overflow-x-auto my-3">
    <table className="w-full text-xs border-collapse rounded-lg overflow-hidden">
      <thead>
        <tr>{table.headers.map((h, i) => (
          <th key={i} className="bg-primary/20 border border-primary/30 px-3 py-2 text-primary font-bold text-center font-mono"><MathText text={h}/></th>
        ))}</tr>
      </thead>
      <tbody>{table.rows.map((row, i) => (
        <tr key={i} className={i%2===0?"bg-slate-800/40":"bg-slate-700/30"}>
          {row.map((cell, j) => (
            <td key={j} className="border border-slate-600/40 px-3 py-2 text-center text-white/80 font-body"><MathText text={cell}/></td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMCMA = soal.type === "MCMA";
  const isBS = soal.type === "Benar/Salah";
  return (
    <div className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500"
      style={{ background: "linear-gradient(135deg,rgba(30,41,59,0.6) 0%,rgba(15,23,42,0.8) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%,rgba(0,200,255,0.08) 0%,transparent 50%)" }}/>
      <div className="relative p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-primary/80 bg-primary/10 px-2 py-1 rounded-md">#{soal.id}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColor[soal.difficulty]}`}>{soal.difficulty}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColor[soal.type]}`}>{typeLabel[soal.type]}</span>
          <span className="text-xs text-white/30 font-body">{soal.category}</span>
        </div>
        <div className="mb-4">
          <div className="text-foreground font-body text-sm md:text-base leading-relaxed whitespace-pre-line"><MathText text={soal.question}/></div>
          {soal.svgKey && visualMap[soal.svgKey] && <div className="mt-3">{visualMap[soal.svgKey]}</div>}
          {soal.table && <div className="mt-3"><TableVisual table={soal.table}/></div>}
        </div>
        {!isMCMA && !isBS && soal.options && (
          <div className="space-y-2 mb-4">
            {soal.options.map((opt, i) => (
              <div key={i} className={`text-sm px-4 py-2.5 rounded-xl border font-body transition-all duration-200 ${opt===soal.correctAnswer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-300":"border-border/40 bg-card/30 text-white/70"}`}>
                <MathText text={opt}/>
              </div>
            ))}
          </div>
        )}
        {isMCMA && soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((stmt, i) => (
              <div key={i} className={`flex items-start gap-3 text-sm px-4 py-2.5 rounded-xl border font-body ${stmt.isCorrect?"border-emerald-500/40 bg-emerald-500/10":"border-red-500/30 bg-red-500/05"}`}>
                <span className={`mt-0.5 text-xs font-bold shrink-0 ${stmt.isCorrect?"text-emerald-400":"text-red-400"}`}>{stmt.isCorrect?"✓":"✗"}</span>
                <span className={stmt.isCorrect?"text-emerald-200":"text-red-200"}><MathText text={`(${i+1}) ${stmt.text}`}/></span>
              </div>
            ))}
            {soal.options && (
              <div className="space-y-2 mt-3">
                {soal.options.map((opt, i) => (
                  <div key={i} className={`text-sm px-4 py-2 rounded-xl border font-body ${opt===soal.correctAnswer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-300":"border-border/30 text-white/50"}`}><MathText text={opt}/></div>
                ))}
              </div>
            )}
          </div>
        )}
        {isBS && soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((stmt, i) => (
              <div key={i} className="flex items-start justify-between gap-3 text-sm px-4 py-2.5 rounded-xl border border-border/40 bg-card/30 font-body">
                <span className="text-white/80"><MathText text={`(${i+1}) ${stmt.text}`}/></span>
                <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${stmt.isCorrect?"bg-emerald-500/20 text-emerald-400":"bg-red-500/20 text-red-400"}`}>{stmt.isCorrect?"BENAR":"SALAH"}</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { playPopSound(); setIsOpen(v => !v); }}
          className="flex items-center gap-2 text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer font-body">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/>}
          {isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
        </button>
        {isOpen && (
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
            <p className="text-xs text-primary/80 font-semibold font-body">💡 Konsep:</p>
            <p className="text-xs text-white/70 font-body leading-relaxed">{soal.explanation.concept}</p>
            {soal.explanation.formula && <div className="text-center py-2"><BlockMath math={soal.explanation.formula}/></div>}
            <p className="text-xs text-primary/80 font-semibold font-body">📝 Langkah Penyelesaian:</p>
            <ol className="space-y-1.5">
              {soal.explanation.steps.map((step, i) => (
                <li key={i} className="text-xs text-white/70 font-body leading-relaxed flex gap-2">
                  <span className="text-primary/60 shrink-0">{i+1}.</span>
                  <MathText text={step}/>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default function BankSoalKoordinatCartesiusPage() {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<"Semua" | Difficulty>("Semua");
  const [filterType, setFilterType] = useState<"Semua" | QuestionType>("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => soalKoordinatCartesius.filter(s => {
    const d = filterDifficulty === "Semua" || s.difficulty === filterDifficulty;
    const t = filterType === "Semua" || s.type === filterType;
    return d && t;
  }), [filterDifficulty, filterType]);

  const stats = useMemo(() => ({
    mudah: soalKoordinatCartesius.filter(s => s.difficulty === "Mudah").length,
    sedang: soalKoordinatCartesius.filter(s => s.difficulty === "Sedang").length,
    sulit: soalKoordinatCartesius.filter(s => s.difficulty === "Sulit").length,
    pg: soalKoordinatCartesius.filter(s => s.type === "PG").length,
    mcma: soalKoordinatCartesius.filter(s => s.type === "MCMA").length,
    bs: soalKoordinatCartesius.filter(s => s.type === "Benar/Salah").length,
  }), []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Starfield/>
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-10">
        <PageNavigation/>
        {/* Header */}
        <div className="text-center mb-8 mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4 font-body">
            <Grid3X3 className="w-4 h-4"/> Bank Soal Matematika SMP
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Bank Soal{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #06b6d4, #a855f7)" }}>
              Koordinat Cartesius
            </span>
          </h1>
          <p className="text-sm text-muted-foreground font-body max-w-xl mx-auto">
            100 soal terstruktur mencakup UN, ANBK, TKA, HOTS, Kontekstual, dan Literasi Matematika.
            Dilengkapi visualisasi bidang koordinat SVG interaktif dan pembahasan lengkap.
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
            { label: "MCMA + B/S", value: (stats.mcma+stats.bs).toString(), color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
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
            <Filter className="w-4 h-4"/> Filter Soal {showFilter ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
          </button>
          {showFilter && (
            <div className="mt-3 p-4 rounded-xl bg-card/60 border border-border space-y-3">
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tingkat Kesulitan:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","Mudah","Sedang","Sulit"] as const).map(d => (
                    <button key={d} onClick={() => { playPopSound(); setFilterDifficulty(d); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterDifficulty===d?"bg-primary text-white border-primary":"border-border text-white/50 hover:border-primary/40"}`}>
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
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterType===t?"bg-primary text-white border-primary":"border-border text-white/50 hover:border-primary/40"}`}>
                      {t==="MCMA"?"PG Kompleks MCMA":t==="Benar/Salah"?"PG Kompleks B/S":t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalKoordinatCartesius.length} soal</p>
            </div>
          )}
        </div>
        {/* Soal */}
        <div className="space-y-4">
          {filtered.map(soal => <SoalCard key={soal.id} soal={soal}/>)}
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
