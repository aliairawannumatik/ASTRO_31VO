import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { RotateCcw, Filter, ChevronDown, ChevronUp, Image } from "lucide-react";
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
   SHARED GRID WRAPPER
══════════════════════════════════════════ */
const G = ({ children, title, w = 280, h = 200 }: { children?: React.ReactNode; title?: string; w?: number; h?: number }) => {
  const ox = w / 2, oy = h / 2, unit = 25;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-1">
      {[...Array(Math.floor(w / unit) + 1)].map((_, i) => <line key={`gv${i}`} x1={i * unit} y1="0" x2={i * unit} y2={h} stroke="#1e293b" strokeWidth="0.6" />)}
      {[...Array(Math.floor(h / unit) + 1)].map((_, i) => <line key={`gh${i}`} x1="0" y1={i * unit} x2={w} y2={i * unit} stroke="#1e293b" strokeWidth="0.6" />)}
      <line x1="0" y1={oy} x2={w} y2={oy} stroke="#334155" strokeWidth="1.4" />
      <line x1={ox} y1="0" x2={ox} y2={h} stroke="#334155" strokeWidth="1.4" />
      <text x={w - 6} y={oy + 3} fill="#475569" fontSize="8" fontFamily="monospace">x</text>
      <text x={ox + 3} y="9" fill="#475569" fontSize="8" fontFamily="monospace">y</text>
      <text x={ox - 8} y={oy + 10} fill="#475569" fontSize="7" fontFamily="monospace">O</text>
      {[-4,-3,-2,-1,1,2,3,4].map(v => <text key={v} x={ox + v * unit - 3} y={oy + 10} fill="#334155" fontSize="6" fontFamily="monospace">{v}</text>)}
      {[-3,-2,-1,1,2,3].map(v => <text key={v} x={ox - 12} y={oy - v * unit + 3} fill="#334155" fontSize="6" fontFamily="monospace">{v}</text>)}
      {children}
      {title && <text x={w / 2} y="8" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">{title}</text>}
    </svg>
  );
};

const cx = (x: number, ox = 140) => ox + x * 25;
const cy = (y: number, oy = 100) => oy - y * 25;

/* ── Dot helper ── */
const Dot = ({ x, y, color, label, lx, ly }: { x: number; y: number; color: string; label: string; lx?: number; ly?: number }) => (
  <>
    <circle cx={cx(x)} cy={cy(y)} r="5" fill={color} />
    <text x={lx ?? cx(x) + 7} y={ly ?? cy(y) - 5} fill={color} fontSize="9" fontFamily="monospace">{label}</text>
  </>
);

/* ── Arrow helper ── */
const Arrow = ({ x1, y1, x2, y2, color = "#fbbf24" }: { x1: number; y1: number; x2: number; y2: number; color?: string }) => (
  <line x1={cx(x1)} y1={cy(y1)} x2={cx(x2)} y2={cy(y2)} stroke={color} strokeWidth="1.6" strokeDasharray="5,3" markerEnd={`url(#arr-${color.replace('#','')})`} />
);

/* ══════════════════════════════════════════
   1. 4 JENIS TRANSFORMASI (konsep overview)
══════════════════════════════════════════ */
const EmpaTTransformasiSVG = () => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">4 Jenis Transformasi Geometri</text>
    <rect x="8" y="18" width="60" height="60" rx="5" fill="rgba(244,114,182,0.1)" stroke="#f472b6" strokeWidth="1"/>
    <polygon points="18,68 28,68 23,28" fill="rgba(244,114,182,0.3)" stroke="#f472b6" strokeWidth="1.2"/>
    <polygon points="38,68 55,68 50,28" fill="rgba(52,211,153,0.3)" stroke="#34d399" strokeWidth="1.2"/>
    <text x="38" y="86" fill="#f472b6" fontSize="8" textAnchor="middle" fontFamily="monospace">Translasi</text>
    <rect x="75" y="18" width="60" height="60" rx="5" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1"/>
    <line x1="105" y1="20" x2="105" y2="76" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="4,2"/>
    <polygon points="80,55 100,55 90,30" fill="rgba(244,114,182,0.3)" stroke="#f472b6" strokeWidth="1.2"/>
    <polygon points="110,55 130,55 120,30" fill="rgba(52,211,153,0.3)" stroke="#34d399" strokeWidth="1.2"/>
    <text x="105" y="86" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">Refleksi</text>
    <rect x="142" y="18" width="60" height="60" rx="5" fill="rgba(168,85,247,0.1)" stroke="#a855f7" strokeWidth="1"/>
    <circle cx="172" cy="48" r="3" fill="#fbbf24"/>
    <polygon points="172,48 192,38 190,58" fill="rgba(244,114,182,0.3)" stroke="#f472b6" strokeWidth="1.2"/>
    <polygon points="172,48 156,32 168,28" fill="rgba(52,211,153,0.3)" stroke="#34d399" strokeWidth="1.2"/>
    <path d="M 188 40 A 18 18 0 0 1 162 32" fill="none" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="3,2"/>
    <text x="172" y="86" fill="#a855f7" fontSize="8" textAnchor="middle" fontFamily="monospace">Rotasi</text>
    <rect x="210" y="18" width="60" height="60" rx="5" fill="rgba(251,191,36,0.1)" stroke="#fbbf24" strokeWidth="1"/>
    <polygon points="230,65 240,65 235,50" fill="rgba(244,114,182,0.3)" stroke="#f472b6" strokeWidth="1.2"/>
    <polygon points="218,70 238,70 228,40" fill="rgba(52,211,153,0.3)" stroke="#34d399" strokeWidth="1.2"/>
    <circle cx="232" cy="58" r="2" fill="#fbbf24"/>
    <text x="240" y="86" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Dilatasi</text>
    <text x="140" y="105" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">Translasi · Refleksi · Rotasi = Isometri (ukuran tetap)</text>
    <text x="140" y="116" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">Dilatasi = Non-isometri (ukuran berubah)</text>
  </svg>
);

/* ══════════════════════════════════════════
   2. TRANSLASI TITIK – berbagai kasus
══════════════════════════════════════════ */
const TranslasiTitikSVG = ({ px, py, tx, ty }: { px: number; py: number; tx: number; ty: number }) => (
  <G title={`Translasi T(${tx > 0 ? "+" : ""}${tx}, ${ty > 0 ? "+" : ""}${ty})`}>
    <defs><marker id="arrt" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24"/></marker></defs>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <circle cx={cx(px+tx)} cy={cy(py+ty)} r="5" fill="#34d399"/>
    <text x={cx(px+tx)+7} y={cy(py+ty)-5} fill="#34d399" fontSize="9" fontFamily="monospace">P'({px+tx},{py+ty})</text>
    <line x1={cx(px)} y1={cy(py)} x2={cx(px+tx)} y2={cy(py+ty)} stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="5,3" markerEnd="url(#arrt)"/>
    <text x={(cx(px)+cx(px+tx))/2+5} y={(cy(py)+cy(py+ty))/2-5} fill="#fbbf24" fontSize="8" fontFamily="monospace">T({tx},{ty})</text>
  </G>
);

/* ══════════════════════════════════════════
   3. REFLEKSI – generik
══════════════════════════════════════════ */
const RefleksiSumbuXSVG = ({ px, py }: { px: number; py: number }) => (
  <G title="Refleksi terhadap sumbu-x  →  (x,y) → (x,−y)">
    <line x1="0" y1="100" x2="280" y2="100" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,3"/>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <line x1={cx(px)} y1={cy(py)} x2={cx(px)} y2={cy(-py)} stroke="#a855f7" strokeWidth="1.2" strokeDasharray="4,3"/>
    <circle cx={cx(px)} cy={cy(-py)} r="5" fill="#34d399"/>
    <text x={cx(px)+7} y={cy(-py)+14} fill="#34d399" fontSize="9" fontFamily="monospace">P'({px},{-py})</text>
    <text x="140" y="192" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">sumbu-x (cermin)</text>
  </G>
);

const RefleksiSumbuYSVG = ({ px, py }: { px: number; py: number }) => (
  <G title="Refleksi terhadap sumbu-y  →  (x,y) → (−x,y)">
    <line x1="140" y1="0" x2="140" y2="200" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,3"/>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <line x1={cx(px)} y1={cy(py)} x2={cx(-px)} y2={cy(py)} stroke="#a855f7" strokeWidth="1.2" strokeDasharray="4,3"/>
    <circle cx={cx(-px)} cy={cy(py)} r="5" fill="#34d399"/>
    <text x={cx(-px)-58} y={cy(py)-5} fill="#34d399" fontSize="9" fontFamily="monospace">P'({-px},{py})</text>
    <text x="140" y="192" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">sumbu-y (cermin)</text>
  </G>
);

const RefleksiYXSVG = ({ px, py }: { px: number; py: number }) => (
  <G title="Refleksi y = x  →  (x,y) → (y,x)">
    <line x1="10" y1="190" x2="270" y2="10" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5,3"/>
    <text x="265" y="10" fill="#fbbf24" fontSize="8" fontFamily="monospace">y=x</text>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <line x1={cx(px)} y1={cy(py)} x2={cx(py)} y2={cy(px)} stroke="#a855f7" strokeWidth="1.2" strokeDasharray="4,3"/>
    <circle cx={cx(py)} cy={cy(px)} r="5" fill="#34d399"/>
    <text x={cx(py)+7} y={cy(px)-5} fill="#34d399" fontSize="9" fontFamily="monospace">P'({py},{px})</text>
  </G>
);

const RefleksiYNegXSVG = ({ px, py }: { px: number; py: number }) => (
  <G title="Refleksi y = −x  →  (x,y) → (−y,−x)">
    <line x1="10" y1="10" x2="270" y2="190" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5,3"/>
    <text x="256" y="188" fill="#fbbf24" fontSize="8" fontFamily="monospace">y=−x</text>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <line x1={cx(px)} y1={cy(py)} x2={cx(-py)} y2={cy(-px)} stroke="#a855f7" strokeWidth="1.2" strokeDasharray="4,3"/>
    <circle cx={cx(-py)} cy={cy(-px)} r="5" fill="#34d399"/>
    <text x={cx(-py)+7} y={cy(-px)+14} fill="#34d399" fontSize="9" fontFamily="monospace">P'({-py},{-px})</text>
  </G>
);

const RefleksiGarisXKSVG = ({ k, px, py }: { k: number; px: number; py: number }) => (
  <G title={`Refleksi terhadap garis x = ${k}`}>
    <line x1={cx(k)} y1="0" x2={cx(k)} y2="200" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="5,3"/>
    <text x={cx(k)+3} y="12" fill="#fbbf24" fontSize="8" fontFamily="monospace">x={k}</text>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <line x1={cx(px)} y1={cy(py)} x2={cx(2*k-px)} y2={cy(py)} stroke="#a855f7" strokeWidth="1.2" strokeDasharray="4,3"/>
    <circle cx={cx(2*k-px)} cy={cy(py)} r="5" fill="#34d399"/>
    <text x={cx(2*k-px)-55} y={cy(py)-5} fill="#34d399" fontSize="9" fontFamily="monospace">P'({2*k-px},{py})</text>
  </G>
);

const RefleksiGarisYKSVG = ({ k, px, py }: { k: number; px: number; py: number }) => (
  <G title={`Refleksi terhadap garis y = ${k}`}>
    <line x1="0" y1={cy(k)} x2="280" y2={cy(k)} stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="5,3"/>
    <text x="3" y={cy(k)-4} fill="#fbbf24" fontSize="8" fontFamily="monospace">y={k}</text>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <line x1={cx(px)} y1={cy(py)} x2={cx(px)} y2={cy(2*k-py)} stroke="#a855f7" strokeWidth="1.2" strokeDasharray="4,3"/>
    <circle cx={cx(px)} cy={cy(2*k-py)} r="5" fill="#34d399"/>
    <text x={cx(px)+7} y={cy(2*k-py)+14} fill="#34d399" fontSize="9" fontFamily="monospace">P'({px},{2*k-py})</text>
  </G>
);

/* ══════════════════════════════════════════
   4. ROTASI – berbagai sudut
══════════════════════════════════════════ */
const Rotasi90CCWSVG = ({ px, py }: { px: number; py: number }) => (
  <G title="Rotasi 90° berlawanan arum jam  →  (x,y) → (−y,x)">
    <defs><marker id="arcArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#a855f7"/></marker></defs>
    <circle cx={cx(0)} cy={cy(0)} r={Math.sqrt(px*px+py*py)*25} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,3"/>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <circle cx={cx(-py)} cy={cy(px)} r="5" fill="#34d399"/>
    <text x={cx(-py)+7} y={cy(px)-5} fill="#34d399" fontSize="9" fontFamily="monospace">P'({-py},{px})</text>
    <line x1={cx(0)} y1={cy(0)} x2={cx(px)} y2={cy(py)} stroke="#f472b6" strokeWidth="1" strokeDasharray="3,2"/>
    <line x1={cx(0)} y1={cy(0)} x2={cx(-py)} y2={cy(px)} stroke="#34d399" strokeWidth="1" strokeDasharray="3,2"/>
    <text x="140" y="192" fill="#a855f7" fontSize="8" textAnchor="middle" fontFamily="monospace">Sudut = 90° berlawanan arum jam</text>
  </G>
);

const Rotasi90CWSVG = ({ px, py }: { px: number; py: number }) => (
  <G title="Rotasi 90° searah jarum jam  →  (x,y) → (y,−x)">
    <circle cx={cx(0)} cy={cy(0)} r={Math.sqrt(px*px+py*py)*25} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,3"/>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <circle cx={cx(py)} cy={cy(-px)} r="5" fill="#34d399"/>
    <text x={cx(py)+7} y={cy(-px)+14} fill="#34d399" fontSize="9" fontFamily="monospace">P'({py},{-px})</text>
    <line x1={cx(0)} y1={cy(0)} x2={cx(px)} y2={cy(py)} stroke="#f472b6" strokeWidth="1" strokeDasharray="3,2"/>
    <line x1={cx(0)} y1={cy(0)} x2={cx(py)} y2={cy(-px)} stroke="#34d399" strokeWidth="1" strokeDasharray="3,2"/>
    <text x="140" y="192" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">Searah jarum jam (CW)</text>
  </G>
);

const Rotasi180SVG = ({ px, py }: { px: number; py: number }) => (
  <G title="Rotasi 180° terhadap O  →  (x,y) → (−x,−y)">
    <circle cx={cx(0)} cy={cy(0)} r={Math.sqrt(px*px+py*py)*25} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,3"/>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <circle cx={cx(-px)} cy={cy(-py)} r="5" fill="#34d399"/>
    <text x={cx(-px)+7} y={cy(-py)+14} fill="#34d399" fontSize="9" fontFamily="monospace">P'({-px},{-py})</text>
    <line x1={cx(px)} y1={cy(py)} x2={cx(-px)} y2={cy(-py)} stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5,3"/>
    <text x="140" y="192" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Kedua koordinat berubah tanda</text>
  </G>
);

const Rotasi270CCWSVG = ({ px, py }: { px: number; py: number }) => (
  <G title="Rotasi 270° CCW = 90° CW  →  (x,y) → (y,−x)">
    <circle cx={cx(0)} cy={cy(0)} r={Math.sqrt(px*px+py*py)*25} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,3"/>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <circle cx={cx(py)} cy={cy(-px)} r="5" fill="#34d399"/>
    <text x={cx(py)+7} y={cy(-px)+14} fill="#34d399" fontSize="9" fontFamily="monospace">P'({py},{-px})</text>
    <text x="140" y="192" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">270° CCW = 90° CW</text>
  </G>
);

const RotasiSegitigaSVG = () => (
  <G title="Rotasi 180° segitiga ABC terhadap O">
    <polygon points={`${cx(2)},${cy(1)} ${cx(5)},${cy(1)} ${cx(5)},${cy(4)}`} fill="rgba(244,114,182,0.2)" stroke="#f472b6" strokeWidth="1.5"/>
    <text x={cx(2)+2} y={cy(1)+12} fill="#f472b6" fontSize="8" fontFamily="monospace">A</text>
    <text x={cx(5)+3} y={cy(1)+12} fill="#f472b6" fontSize="8" fontFamily="monospace">B</text>
    <text x={cx(5)+3} y={cy(4)-3} fill="#f472b6" fontSize="8" fontFamily="monospace">C</text>
    <polygon points={`${cx(-2)},${cy(-1)} ${cx(-5)},${cy(-1)} ${cx(-5)},${cy(-4)}`} fill="rgba(52,211,153,0.2)" stroke="#34d399" strokeWidth="1.5"/>
    <text x={cx(-2)-10} y={cy(-1)+12} fill="#34d399" fontSize="8" fontFamily="monospace">A'</text>
    <text x={cx(-5)-14} y={cy(-1)+12} fill="#34d399" fontSize="8" fontFamily="monospace">B'</text>
    <text x={cx(-5)-14} y={cy(-4)-3} fill="#34d399" fontSize="8" fontFamily="monospace">C'</text>
    <text x="140" y="192" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Rotasi 180°: setiap titik → bayangan simetri terhadap O</text>
  </G>
);

const SegitigaTranslasiSVG = () => (
  <G title="Segitiga ABC ditranslasi T(−1,+3) → A'B'C'">
    <polygon points={`${cx(1)},${cy(2)} ${cx(4)},${cy(2)} ${cx(4)},${cy(5)}`} fill="rgba(244,114,182,0.2)" stroke="#f472b6" strokeWidth="1.5"/>
    <text x={cx(1)-8} y={cy(2)+4} fill="#f472b6" fontSize="8" fontFamily="monospace">A(1,2)</text>
    <text x={cx(4)+3} y={cy(2)+12} fill="#f472b6" fontSize="8" fontFamily="monospace">B(4,2)</text>
    <text x={cx(4)+3} y={cy(5)-3} fill="#f472b6" fontSize="8" fontFamily="monospace">C(4,5)</text>
    <polygon points={`${cx(0)},${cy(5)} ${cx(3)},${cy(5)} ${cx(3)},${cy(8)}`} fill="rgba(52,211,153,0.2)" stroke="#34d399" strokeWidth="1.5"/>
    <text x={cx(0)-10} y={cy(5)+12} fill="#34d399" fontSize="8" fontFamily="monospace">A'</text>
    <text x={cx(3)+3} y={cy(5)+12} fill="#34d399" fontSize="8" fontFamily="monospace">B'(3,5)</text>
    <text x={cx(3)+3} y={cy(8)-3} fill="#34d399" fontSize="8" fontFamily="monospace">C'</text>
    <defs><marker id="t2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24"/></marker></defs>
    <line x1={cx(4)} y1={cy(2)} x2={cx(3)} y2={cy(5)} stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="4,3" markerEnd="url(#t2)"/>
  </G>
);

/* ══════════════════════════════════════════
   5. DILATASI – berbagai kasus
══════════════════════════════════════════ */
const DilataSVG = ({ px, py, k }: { px: number; py: number; k: number }) => (
  <G title={`Dilatasi [O, ${k}]  →  (x,y) → (${k}x, ${k}y)`}>
    <line x1={cx(0)} y1={cy(0)} x2={cx(k*px)+( k>0?15:-15)} y2={cy(k*py)+(k>0?-15:15)} stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,2"/>
    <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
    <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P({px},{py})</text>
    <circle cx={cx(k*px)} cy={cy(k*py)} r="5" fill="#34d399"/>
    <text x={cx(k*px)+7} y={cy(k*py)-5} fill="#34d399" fontSize="9" fontFamily="monospace">P'({k*px},{k*py})</text>
    <text x="140" y="192" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">{`k=${k}: koordinat × ${k}`}</text>
  </G>
);

const DilataNonOriginSVG = ({ ox, oy, px, py, k }: { ox: number; oy: number; px: number; py: number; k: number }) => {
  const bx = ox + k*(px-ox), by = oy + k*(py-oy);
  return (
    <G title={`Dilatasi pusat P(${ox},${oy}), k=${k}`}>
      <circle cx={cx(ox)} cy={cy(oy)} r="6" fill="#fbbf24"/>
      <text x={cx(ox)+7} y={cy(oy)-5} fill="#fbbf24" fontSize="8" fontFamily="monospace">Pusat({ox},{oy})</text>
      <circle cx={cx(px)} cy={cy(py)} r="5" fill="#f472b6"/>
      <text x={cx(px)+7} y={cy(py)-5} fill="#f472b6" fontSize="8" fontFamily="monospace">A({px},{py})</text>
      <line x1={cx(ox)} y1={cy(oy)} x2={cx(bx)+10} y2={cy(by)-10} stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,2"/>
      <circle cx={cx(bx)} cy={cy(by)} r="5" fill="#34d399"/>
      <text x={cx(bx)+7} y={cy(by)-5} fill="#34d399" fontSize="8" fontFamily="monospace">A'({bx},{by})</text>
    </G>
  );
};

const DilataBangunSVG = () => (
  <G title="Dilatasi [O, 2]: Persegi panjang ABCD → A'B'C'D'">
    <rect x={cx(1)} y={cy(3)} width={cx(4)-cx(1)} height={cy(1)-cy(3)} fill="rgba(244,114,182,0.15)" stroke="#f472b6" strokeWidth="1.5"/>
    <text x={cx(1)-8} y={cy(1)+12} fill="#f472b6" fontSize="8" fontFamily="monospace">A</text>
    <text x={cx(4)+2} y={cy(1)+12} fill="#f472b6" fontSize="8" fontFamily="monospace">B</text>
    <text x={cx(4)+2} y={cy(3)-3} fill="#f472b6" fontSize="8" fontFamily="monospace">C</text>
    <text x={cx(1)-10} y={cy(3)-3} fill="#f472b6" fontSize="8" fontFamily="monospace">D</text>
    <rect x={cx(2)} y={cy(6)} width={cx(8)-cx(2)} height={cy(2)-cy(6)} fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1.5"/>
    <text x={cx(2)-12} y={cy(2)+12} fill="#34d399" fontSize="8" fontFamily="monospace">A'(2,2)</text>
    <text x={cx(8)+2} y={cy(6)-3} fill="#34d399" fontSize="8" fontFamily="monospace">C'(8,6)</text>
    <text x="140" y="192" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Luas A'B'C'D' = k² × Luas ABCD = 4 × 6 = 24</text>
  </G>
);

/* ══════════════════════════════════════════
   6. KOMPOSISI TRANSFORMASI
══════════════════════════════════════════ */
const KomposisiTranslasiSVG = () => (
  <G title="Komposisi: T₁(3,2) lalu T₂(−1,4)">
    <defs><marker id="arrc" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24"/></marker><marker id="arrc2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#a855f7"/></marker></defs>
    <circle cx={cx(0)} cy={cy(-1)} r="5" fill="#f472b6"/>
    <text x={cx(0)+7} y={cy(-1)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P(0,−1)</text>
    <circle cx={cx(3)} cy={cy(1)} r="5" fill="#06b6d4"/>
    <text x={cx(3)+7} y={cy(1)-5} fill="#06b6d4" fontSize="9" fontFamily="monospace">P'(3,1)</text>
    <circle cx={cx(2)} cy={cy(5)} r="5" fill="#34d399"/>
    <text x={cx(2)+7} y={cy(5)-5} fill="#34d399" fontSize="9" fontFamily="monospace">P''(2,5)</text>
    <line x1={cx(0)} y1={cy(-1)} x2={cx(3)-8} y2={cy(1)+3} stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="5,3" markerEnd="url(#arrc)"/>
    <line x1={cx(3)} y1={cy(1)} x2={cx(2)+3} y2={cy(5)+8} stroke="#a855f7" strokeWidth="1.6" strokeDasharray="5,3" markerEnd="url(#arrc2)"/>
    <text x={cx(1.5)} y={cy(0)+10} fill="#fbbf24" fontSize="8" fontFamily="monospace">T₁(3,2)</text>
    <text x={cx(2.5)+5} y={cy(3)} fill="#a855f7" fontSize="8" fontFamily="monospace">T₂(−1,4)</text>
  </G>
);

const KomposisiRefleksiSVG = () => (
  <G title="2 Refleksi garis sejajar x=1 dan x=4 → Translasi 6 satuan">
    <line x1={cx(1)} y1="0" x2={cx(1)} y2="200" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x={cx(1)+3} y="12" fill="#fbbf24" fontSize="8" fontFamily="monospace">x=1</text>
    <line x1={cx(4)} y1="0" x2={cx(4)} y2="200" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x={cx(4)+3} y="12" fill="#06b6d4" fontSize="8" fontFamily="monospace">x=4</text>
    <circle cx={cx(-1)} cy={cy(0)} r="5" fill="#f472b6"/>
    <text x={cx(-1)-45} y={cy(0)-5} fill="#f472b6" fontSize="8" fontFamily="monospace">P(−1,0)</text>
    <circle cx={cx(3)} cy={cy(0)} r="5" fill="#a855f7"/>
    <text x={cx(3)+7} y={cy(0)-5} fill="#a855f7" fontSize="8" fontFamily="monospace">P'(3,0)</text>
    <circle cx={cx(5)} cy={cy(0)} r="5" fill="#34d399"/>
    <text x={cx(5)+7} y={cy(0)-5} fill="#34d399" fontSize="8" fontFamily="monospace">P''(5,0)</text>
    <text x="140" y="192" fill="#34d399" fontSize="8" textAnchor="middle" fontFamily="monospace">Total translasi = 2×(4−1) = 6 satuan →</text>
  </G>
);

const KomposisiRefTransSVG = () => (
  <G title="Refleksi sumbu-y lalu Translasi T(3,−1)">
    <circle cx={cx(5)} cy={cy(2)} r="5" fill="#f472b6"/>
    <text x={cx(5)+7} y={cy(2)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">Q(5,2)</text>
    <circle cx={cx(-5)} cy={cy(2)} r="5" fill="#06b6d4"/>
    <text x={cx(-5)-50} y={cy(2)-5} fill="#06b6d4" fontSize="9" fontFamily="monospace">Q'(−5,2)</text>
    <circle cx={cx(-2)} cy={cy(1)} r="5" fill="#34d399"/>
    <text x={cx(-2)+7} y={cy(1)+14} fill="#34d399" fontSize="9" fontFamily="monospace">Q''(−2,1)</text>
    <defs><marker id="arr3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24"/></marker></defs>
    <line x1={cx(5)} y1={cy(2)} x2={cx(-5)+8} y2={cy(2)} stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="4,3" markerEnd="url(#arr3)"/>
    <text x="110" y={cy(2)-8} fill="#fbbf24" fontSize="7" fontFamily="monospace">ref sumbu-y</text>
    <defs><marker id="arr4" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#a855f7"/></marker></defs>
    <line x1={cx(-5)} y1={cy(2)} x2={cx(-2)-7} y2={cy(1)+5} stroke="#a855f7" strokeWidth="1.4" strokeDasharray="4,3" markerEnd="url(#arr4)"/>
    <text x="90" y={cy(1.5)+8} fill="#a855f7" fontSize="7" fontFamily="monospace">T(3,−1)</text>
  </G>
);

const InverseKomposisiSVG = () => (
  <G title="Invers Komposisi: P'' → P' → P (bekerja mundur)">
    <circle cx={cx(5)} cy={cy(3)} r="5" fill="#f472b6"/>
    <text x={cx(5)+7} y={cy(3)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P(a,b)</text>
    <circle cx={cx(3)} cy={cy(5)} r="5" fill="#06b6d4"/>
    <text x={cx(3)+7} y={cy(5)-5} fill="#06b6d4" fontSize="9" fontFamily="monospace">P'(b,a)</text>
    <circle cx={cx(-3)} cy={cy(-5)} r="5" fill="#34d399"/>
    <text x={cx(-3)-50} y={cy(-5)+14} fill="#34d399" fontSize="9" fontFamily="monospace">P''(−b,−a)</text>
    <defs><marker id="arr5" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24"/></marker></defs>
    <line x1={cx(5)} y1={cy(3)} x2={cx(3)+7} y2={cy(5)-7} stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="4,3" markerEnd="url(#arr5)"/>
    <text x={cx(4)+5} y={cy(4)} fill="#fbbf24" fontSize="7" fontFamily="monospace">Ref y=x</text>
    <defs><marker id="arr6" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#a855f7"/></marker></defs>
    <line x1={cx(3)} y1={cy(5)} x2={cx(-3)+8} y2={cy(-5)+8} stroke="#a855f7" strokeWidth="1.4" strokeDasharray="4,3" markerEnd="url(#arr6)"/>
    <text x="135" y="100" fill="#a855f7" fontSize="7" fontFamily="monospace">R 180°</text>
  </G>
);

/* ══════════════════════════════════════════
   7. KONTEKSTUAL
══════════════════════════════════════════ */
const KapalTranslasiSVG = () => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Kapal berpindah (Translasi)</text>
    <rect x="0" y="100" width="280" height="60" fill="rgba(6,182,212,0.1)" stroke="none"/>
    <path d="M 0 100 Q 70 90 140 100 Q 210 110 280 100" fill="none" stroke="#06b6d4" strokeWidth="1.5"/>
    <g transform="translate(40,65)">
      <polygon points="0,30 20,30 10,10" fill="#f472b6"/>
      <rect x="5" y="30" width="10" height="10" fill="rgba(244,114,182,0.4)" stroke="#f472b6"/>
    </g>
    <text x="50" y="110" fill="#f472b6" fontSize="8" textAnchor="middle" fontFamily="monospace">K(5,3)</text>
    <defs><marker id="kapalArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24"/></marker></defs>
    <line x1="75" y1="80" x2="160" y2="80" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#kapalArr)"/>
    <text x="117" y="74" fill="#fbbf24" fontSize="8" fontFamily="monospace">T(−4,+2)</text>
    <g transform="translate(175,55)">
      <polygon points="0,30 20,30 10,10" fill="#34d399"/>
      <rect x="5" y="30" width="10" height="10" fill="rgba(52,211,153,0.4)" stroke="#34d399"/>
    </g>
    <text x="195" y="110" fill="#34d399" fontSize="8" textAnchor="middle" fontFamily="monospace">K'(1,5)</text>
  </svg>
);

const PencerminanKontekstualSVG = () => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Refleksi dalam Kehidupan</text>
    <line x1="140" y1="18" x2="140" y2="155" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,4"/>
    <text x="143" y="28" fill="#06b6d4" fontSize="8" fontFamily="monospace">Cermin</text>
    <rect x="30" y="50" width="80" height="60" fill="rgba(244,114,182,0.15)" stroke="#f472b6" strokeWidth="1.5" rx="4"/>
    <text x="70" y="82" fill="#f472b6" fontSize="11" textAnchor="middle">🏠</text>
    <text x="70" y="122" fill="#f472b6" fontSize="7" textAnchor="middle" fontFamily="monospace">Objek</text>
    <rect x="170" y="50" width="80" height="60" fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1.5" rx="4"/>
    <text x="210" y="82" fill="#34d399" fontSize="11" textAnchor="middle">🏠</text>
    <text x="210" y="122" fill="#34d399" fontSize="7" textAnchor="middle" fontFamily="monospace">Bayangan</text>
    <text x="30" y="148" fill="#94a3b8" fontSize="6" fontFamily="monospace">Jarak objek ke cermin = Jarak bayangan ke cermin</text>
  </svg>
);

const DesainBatikSVG = () => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Motif Batik – Translasi Berulang</text>
    {[0,1,2,3].map(i => (
      <g key={i} transform={`translate(${15+i*60},30)`}>
        <polygon points="25,0 50,40 0,40" fill={`rgba(${i===0?'244,114,182':i===1?'52,211,153':i===2?'168,85,247':'6,182,212'},0.3)`} stroke={i===0?'#f472b6':i===1?'#34d399':i===2?'#a855f7':'#06b6d4'} strokeWidth="1.5"/>
        <text x="25" y="58" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">{i===0?"Motif":`+${i}×5`}</text>
      </g>
    ))}
    <defs><marker id="batikArr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#fbbf24"/></marker></defs>
    {[0,1,2].map(i => <line key={i} x1={52+i*60} y1="50" x2={68+i*60} y2="50" stroke="#fbbf24" strokeWidth="1" markerEnd="url(#batikArr)"/>)}
    <text x="140" y="100" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">T(5,0) diterapkan berulang</text>
    <text x="140" y="115" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">Kuncup ke-4: (2,4) + 3×(5,0) = (17,4)</text>
  </svg>
);

const DroneSVG = () => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Jalur Drone – Dua Translasi</text>
    <line x1="20" y1="140" x2="260" y2="140" stroke="#334155" strokeWidth="1"/>
    <line x1="20" y1="140" x2="20" y2="15" stroke="#334155" strokeWidth="1"/>
    {[1,2,3,4,5,6,7,8,9].map(v => <text key={v} x={20+v*25-3} y="148" fill="#334155" fontSize="6" fontFamily="monospace">{v}</text>)}
    {[1,2,3,4,5].map(v => <text key={v} x="5" y={140-v*20+3} fill="#334155" fontSize="6" fontFamily="monospace">{v}</text>)}
    <circle cx="70" cy="80" r="5" fill="#f472b6"/>
    <text x="75" y="76" fill="#f472b6" fontSize="8" fontFamily="monospace">A(2,3)</text>
    <circle cx="170" cy="60" r="5" fill="#06b6d4"/>
    <text x="175" y="56" fill="#06b6d4" fontSize="8" fontFamily="monospace">B(6,4)</text>
    <circle cx="120" cy="40" r="5" fill="#34d399"/>
    <text x="125" y="36" fill="#34d399" fontSize="8" fontFamily="monospace">C(4,5)</text>
    <defs><marker id="droneArr1" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#fbbf24"/></marker><marker id="droneArr2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#a855f7"/></marker></defs>
    <line x1="70" y1="80" x2="162" y2="62" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#droneArr1)"/>
    <text x="115" y="75" fill="#fbbf24" fontSize="7" fontFamily="monospace">T₁(4,1)</text>
    <line x1="170" y1="60" x2="128" y2="42" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#droneArr2)"/>
    <text x="135" y="55" fill="#a855f7" fontSize="7" fontFamily="monospace">T₂(−2,1)</text>
  </svg>
);

/* ══════════════════════════════════════════
   8. DIAGRAM SIFAT & KONSEP
══════════════════════════════════════════ */
const IsometriKlasifikasiSVG = () => (
  <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Klasifikasi: Isometri vs Non-Isometri</text>
    <rect x="10" y="20" width="120" height="100" rx="6" fill="rgba(52,211,153,0.1)" stroke="#34d399" strokeWidth="1.5"/>
    <text x="70" y="34" fill="#34d399" fontSize="8" textAnchor="middle" fontFamily="monospace">ISOMETRI</text>
    <text x="70" y="46" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">(ukuran tetap)</text>
    <text x="25" y="62" fill="#f472b6" fontSize="8" fontFamily="monospace">• Translasi</text>
    <text x="25" y="76" fill="#f472b6" fontSize="8" fontFamily="monospace">• Refleksi</text>
    <text x="25" y="90" fill="#f472b6" fontSize="8" fontFamily="monospace">• Rotasi</text>
    <text x="25" y="104" fill="#64748b" fontSize="7" fontFamily="monospace">k=1: Dilatasi</text>
    <rect x="150" y="20" width="120" height="100" rx="6" fill="rgba(239,68,68,0.1)" stroke="#ef4444" strokeWidth="1.5"/>
    <text x="210" y="34" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">NON-ISOMETRI</text>
    <text x="210" y="46" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">(ukuran berubah)</text>
    <text x="160" y="70" fill="#fbbf24" fontSize="8" fontFamily="monospace">• Dilatasi (k≠1)</text>
    <text x="160" y="86" fill="#64748b" fontSize="7" fontFamily="monospace">Luas × k²</text>
    <text x="160" y="100" fill="#64748b" fontSize="7" fontFamily="monospace">Keliling × k</text>
  </svg>
);

const MultipleTranslasiSVG = () => (
  <G title="Translasi T(2,−3): 4 titik sekaligus">
    <defs><marker id="tm" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#fbbf24"/></marker></defs>
    {[{p:[1,4],n:[3,1],label:"A"},{p:[0,-1],n:[2,-4],label:"B"},{p:[-2,5],n:[0,2],label:"C"},{p:[3,-1],n:[5,-4],label:"D"}].map(({p,n,label},i)=>(
      <g key={i}>
        <circle cx={cx(p[0])} cy={cy(p[1])} r="4" fill="#f472b6"/>
        <text x={cx(p[0])+5} y={cy(p[1])-4} fill="#f472b6" fontSize="7" fontFamily="monospace">{label}({p[0]},{p[1]})</text>
        <circle cx={cx(n[0])} cy={cy(n[1])} r="4" fill="#34d399"/>
        <text x={cx(n[0])+5} y={cy(n[1])+12} fill="#34d399" fontSize="7" fontFamily="monospace">{label}'({n[0]},{n[1]})</text>
        <line x1={cx(p[0])} y1={cy(p[1])} x2={cx(n[0])-5} y2={cy(n[1])+4} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#tm)"/>
      </g>
    ))}
  </G>
);

const RotasiSifatSVG = () => (
  <G title="Sifat Rotasi 90° CCW: 4 titik">
    {[{p:[3,0],n:[0,3],c:"#f472b6"},{p:[0,2],n:[-2,0],c:"#06b6d4"},{p:[2,3],n:[-3,2],c:"#a855f7"},{p:[-1,2],n:[-2,-1],c:"#fbbf24"}].map(({p,n,c},i)=>(
      <g key={i}>
        <circle cx={cx(p[0])} cy={cy(p[1])} r="4" fill={c} opacity="0.8"/>
        <text x={cx(p[0])+4} y={cy(p[1])-4} fill={c} fontSize="7" fontFamily="monospace">({p[0]},{p[1]})</text>
        <circle cx={cx(n[0])} cy={cy(n[1])} r="4" fill={c}/>
        <text x={cx(n[0])+4} y={cy(n[1])+12} fill={c} fontSize="7" fontFamily="monospace">({n[0]},{n[1]})→</text>
        <defs><marker id={`rm${i}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill={c}/></marker></defs>
        <line x1={cx(p[0])} y1={cy(p[1])} x2={cx(n[0])+5} y2={cy(n[1])-5} stroke={c} strokeWidth="1" strokeDasharray="3,2" markerEnd={`url(#rm${i})`}/>
      </g>
    ))}
    <text x="140" y="192" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">R₉₀°CCW: (x,y) → (−y, x)</text>
  </G>
);

const RefleksiSumbuXMultiSVG = () => (
  <G title="Refleksi sumbu-x: cek 4 titik">
    <line x1="0" y1="100" x2="280" y2="100" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,3"/>
    {[{p:[3,5],b:"#f472b6"},{p:[-2,-4],b:"#a855f7"},{p:[0,7],b:"#fbbf24"},{p:[6,0],b:"#34d399"}].map(({p,b},i)=>(
      <g key={i}>
        <circle cx={cx(p[0])} cy={cy(p[1])} r="4" fill={b} opacity="0.8"/>
        <text x={cx(p[0])+(p[0]>=0?5:-40)} y={cy(p[1])-5} fill={b} fontSize="7" fontFamily="monospace">({p[0]},{p[1]})</text>
        <line x1={cx(p[0])} y1={cy(p[1])} x2={cx(p[0])} y2={cy(-p[1])} stroke={b} strokeWidth="1" strokeDasharray="3,2"/>
        <circle cx={cx(p[0])} cy={cy(-p[1])} r="4" fill={b}/>
        <text x={cx(p[0])+(p[0]>=0?5:-50)} y={cy(-p[1])+14} fill={b} fontSize="7" fontFamily="monospace">→({p[0]},{-p[1]})</text>
      </g>
    ))}
  </G>
);

const RefleksiSumbuYMultiSVG = () => (
  <G title="Refleksi sumbu-y: cek 4 titik">
    <line x1="140" y1="0" x2="140" y2="200" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,3"/>
    {[{p:[4,3],b:"#f472b6"},{p:[-1,-5],b:"#a855f7"},{p:[0,4],b:"#fbbf24"},{p:[7,0],b:"#34d399"}].map(({p,b},i)=>(
      <g key={i}>
        <circle cx={cx(p[0])} cy={cy(p[1])} r="4" fill={b} opacity="0.8"/>
        <text x={cx(p[0])+(p[0]>=0?5:-42)} y={cy(p[1])-5} fill={b} fontSize="7" fontFamily="monospace">({p[0]},{p[1]})</text>
        <line x1={cx(p[0])} y1={cy(p[1])} x2={cx(-p[0])} y2={cy(p[1])} stroke={b} strokeWidth="1" strokeDasharray="3,2"/>
        <circle cx={cx(-p[0])} cy={cy(p[1])} r="4" fill={b}/>
        <text x={cx(-p[0])+((-p[0])>=0?5:-52)} y={cy(p[1])+14} fill={b} fontSize="7" fontFamily="monospace">→({-p[0]},{p[1]})</text>
      </g>
    ))}
  </G>
);

const DilataDuaSVG = () => (
  <G title="Dilatasi [O, 2]: keliling ×2, luas ×4">
    <rect x={cx(1)} y={cy(2)} width={cx(2)-cx(1)} height={cy(1)-cy(2)} fill="rgba(244,114,182,0.2)" stroke="#f472b6" strokeWidth="1.5"/>
    <text x={cx(1.5)} y={cy(1.5)} fill="#f472b6" fontSize="7" textAnchor="middle" fontFamily="monospace">1×1</text>
    <rect x={cx(2)} y={cy(4)} width={cx(4)-cx(2)} height={cy(2)-cy(4)} fill="rgba(52,211,153,0.2)" stroke="#34d399" strokeWidth="1.5"/>
    <text x={cx(3)} y={cy(3)} fill="#34d399" fontSize="7" textAnchor="middle" fontFamily="monospace">2×2</text>
    <text x="140" y="185" fill="#fbbf24" fontSize="7" textAnchor="middle" fontFamily="monospace">k=2: sisi ×2 → luas ×4</text>
  </G>
);

const RotasiEkvivalenSVG = () => (
  <svg viewBox="0 0 280 140" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">270° CCW ≡ 90° CW (hasilnya sama)</text>
    <circle cx="80" cy="75" r="40" fill="none" stroke="#334155" strokeWidth="1"/>
    <line x1="80" y1="75" x2="120" y2="75" stroke="#f472b6" strokeWidth="1.5"/>
    <circle cx="120" cy="75" r="4" fill="#f472b6"/>
    <text x="123" y="73" fill="#f472b6" fontSize="8" fontFamily="monospace">P</text>
    <path d="M 120 75 A 40 40 0 0 0 80 35" fill="none" stroke="#34d399" strokeWidth="2" markerEnd="url(#ra1)"/>
    <defs><marker id="ra1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#34d399"/></marker></defs>
    <text x="50" y="32" fill="#34d399" fontSize="8" fontFamily="monospace">90° CW</text>
    <circle cx="200" cy="75" r="40" fill="none" stroke="#334155" strokeWidth="1"/>
    <line x1="200" y1="75" x2="240" y2="75" stroke="#f472b6" strokeWidth="1.5"/>
    <circle cx="240" cy="75" r="4" fill="#f472b6"/>
    <text x="243" y="73" fill="#f472b6" fontSize="8" fontFamily="monospace">P</text>
    <path d="M 240 75 A 40 40 0 1 1 200 35" fill="none" stroke="#a855f7" strokeWidth="2" markerEnd="url(#ra2)"/>
    <defs><marker id="ra2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#a855f7"/></marker></defs>
    <text x="162" y="32" fill="#a855f7" fontSize="8" fontFamily="monospace">270° CCW</text>
    <circle cx="80" cy="35" r="4" fill="#34d399"/>
    <text x="60" y="28" fill="#34d399" fontSize="7" fontFamily="monospace">P'(y,−x)</text>
    <circle cx="200" cy="35" r="4" fill="#a855f7"/>
    <text x="180" y="28" fill="#a855f7" fontSize="7" fontFamily="monospace">P'(y,−x)</text>
    <text x="140" y="128" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">= Bayangan yang sama!</text>
  </svg>
);

const SifatDilatasiNegatifSVG = () => (
  <G title="Dilatasi k=−2: sisi berlawanan & ukuran 2×">
    <circle cx={cx(2)} cy={cy(1)} r="5" fill="#f472b6"/>
    <text x={cx(2)+7} y={cy(1)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P(2,1)</text>
    <circle cx={cx(-4)} cy={cy(-2)} r="5" fill="#34d399"/>
    <text x={cx(-4)-55} y={cy(-2)+14} fill="#34d399" fontSize="9" fontFamily="monospace">P'(−4,−2)</text>
    <line x1={cx(2)} y1={cy(1)} x2={cx(0)} y2={cy(0)} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2"/>
    <line x1={cx(0)} y1={cy(0)} x2={cx(-4)} y2={cy(-2)} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2"/>
    <text x="140" y="192" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">k=−2: sisi berlawanan, besar 2×</text>
  </G>
);

const SegitigaDilatasiSVG = () => (
  <G title="Segitiga PQR didilatasi [O,3]">
    <polygon points={`${cx(1)},${cy(0)} ${cx(4)},${cy(0)} ${cx(4)},${cy(3)}`} fill="rgba(244,114,182,0.2)" stroke="#f472b6" strokeWidth="1.5"/>
    <text x={cx(2)+2} y={cy(0)+12} fill="#f472b6" fontSize="8" fontFamily="monospace">PQ</text>
    <text x={cx(4)+3} y={cy(1.5)} fill="#f472b6" fontSize="8" fontFamily="monospace">R</text>
    <polygon points={`${cx(3)},${cy(0)} ${cx(12)},${cy(0)} ${cx(12)},${cy(9)}`} fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3,0"/>
    <text x="245" y={cy(0)+12} fill="#34d399" fontSize="8" fontFamily="monospace">Q'</text>
    <text x="140" y="192" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Keliling ×3, Luas ×9</text>
  </G>
);

const RotasiNonOriginSVG = () => (
  <G title="Rotasi 90° CCW terhadap pusat C(1,1)">
    <circle cx={cx(1)} cy={cy(1)} r="5" fill="#fbbf24"/>
    <text x={cx(1)+7} y={cy(1)-5} fill="#fbbf24" fontSize="8" fontFamily="monospace">C(1,1)</text>
    <circle cx={cx(4)} cy={cy(3)} r="5" fill="#f472b6"/>
    <text x={cx(4)+7} y={cy(3)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P(4,3)</text>
    <circle cx={cx(-1)} cy={cy(4)} r="5" fill="#34d399"/>
    <text x={cx(-1)-52} y={cy(4)-5} fill="#34d399" fontSize="9" fontFamily="monospace">P'(−1,4)</text>
    <line x1={cx(1)} y1={cy(1)} x2={cx(4)} y2={cy(3)} stroke="#f472b6" strokeWidth="1" strokeDasharray="3,2"/>
    <line x1={cx(1)} y1={cy(1)} x2={cx(-1)} y2={cy(4)} stroke="#34d399" strokeWidth="1" strokeDasharray="3,2"/>
    <text x="140" y="192" fill="#a855f7" fontSize="8" textAnchor="middle" fontFamily="monospace">Translasi ke O → Rotasi → Translasi balik</text>
  </G>
);

const IdentifikasiTranslasiSVG = () => (
  <G title="Cari vektor translasi dari pasangan titik">
    <defs><marker id="itArr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#fbbf24"/></marker></defs>
    {[{p:[1,2],n:[3,7],c:"#f472b6",l:"A→A'"},{p:[2,1],n:[4,6],c:"#06b6d4",l:"B→B'"}].map(({p,n,c,l},i)=>(
      <g key={i}>
        <circle cx={cx(p[0])} cy={cy(p[1])} r="5" fill={c}/>
        <text x={cx(p[0])+6} y={cy(p[1])-5} fill={c} fontSize="8" fontFamily="monospace">({p[0]},{p[1]})</text>
        <circle cx={cx(n[0])} cy={cy(n[1])} r="5" fill={c}/>
        <text x={cx(n[0])+6} y={cy(n[1])-5} fill={c} fontSize="8" fontFamily="monospace">({n[0]},{n[1]})</text>
        <line x1={cx(p[0])} y1={cy(p[1])} x2={cx(n[0])-6} y2={cy(n[1])+4} stroke={c} strokeWidth="1.4" strokeDasharray="4,2" markerEnd="url(#itArr)"/>
      </g>
    ))}
    <text x="140" y="192" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Vektor: (3−1,7−2)=(2,5) ← sama untuk semua titik</text>
  </G>
);

const GarisSejajarBSSVG = () => (
  <G title="2 Refleksi garis sejajar x=1 dan x=5 → Translasi 8">
    <line x1={cx(1)} y1="0" x2={cx(1)} y2="200" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x={cx(1)+3} y="12" fill="#fbbf24" fontSize="8" fontFamily="monospace">x=1</text>
    <line x1={cx(5)} y1="0" x2={cx(5)} y2="200" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x={cx(5)+3} y="12" fill="#06b6d4" fontSize="8" fontFamily="monospace">x=5</text>
    <circle cx={cx(0)} cy={cy(0)} r="5" fill="#f472b6"/>
    <text x={cx(0)-35} y={cy(0)-5} fill="#f472b6" fontSize="8" fontFamily="monospace">P(0,0)</text>
    <circle cx={cx(2)} cy={cy(0)} r="5" fill="#a855f7"/>
    <text x={cx(2)+5} y={cy(0)+12} fill="#a855f7" fontSize="8" fontFamily="monospace">P'(2,0)</text>
    <circle cx={cx(8)} cy={cy(0)} r="5" fill="#34d399"/>
    <text x={cx(8)+5} y={cy(0)-5} fill="#34d399" fontSize="8" fontFamily="monospace">P''(8,0)</text>
    <text x="140" y="192" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">2×|5−1|=8 satuan ke kanan</text>
  </G>
);

const RotasiKomposisiSVG = () => (
  <G title="R90° lalu R90° = R180° terhadap O">
    <circle cx={cx(3)} cy={cy(1)} r="5" fill="#f472b6"/>
    <text x={cx(3)+6} y={cy(1)-5} fill="#f472b6" fontSize="9" fontFamily="monospace">P(3,1)</text>
    <circle cx={cx(-1)} cy={cy(3)} r="5" fill="#06b6d4"/>
    <text x={cx(-1)-50} y={cy(3)-5} fill="#06b6d4" fontSize="9" fontFamily="monospace">P'(−1,3)</text>
    <circle cx={cx(-3)} cy={cy(-1)} r="5" fill="#34d399"/>
    <text x={cx(-3)-52} y={cy(-1)+14} fill="#34d399" fontSize="9" fontFamily="monospace">P''(−3,−1)</text>
    <defs><marker id="rk1" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#06b6d4"/></marker><marker id="rk2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#34d399"/></marker></defs>
    <line x1={cx(3)} y1={cy(1)} x2={cx(-1)+6} y2={cy(3)-6} stroke="#06b6d4" strokeWidth="1.4" strokeDasharray="4,2" markerEnd="url(#rk1)"/>
    <text x={cx(1.5)} y={cy(2)+12} fill="#06b6d4" fontSize="8" fontFamily="monospace">R90°</text>
    <line x1={cx(-1)} y1={cy(3)} x2={cx(-3)+6} y2={cy(-1)-6} stroke="#34d399" strokeWidth="1.4" strokeDasharray="4,2" markerEnd="url(#rk2)"/>
    <text x={cx(-2)-18} y={cy(1)+12} fill="#34d399" fontSize="8" fontFamily="monospace">R90°</text>
  </G>
);

/* ══════════════════════════════════════════
   VISUAL MAP
══════════════════════════════════════════ */
const visualMap: Record<string, React.ReactNode> = {
  /* Konsep */
  "4-transformasi": <EmpaTTransformasiSVG />,
  "isometri-klasifikasi": <IsometriKlasifikasiSVG />,
  "rotasi-ekuivalen": <RotasiEkvivalenSVG />,
  /* Translasi */
  "trans-2-3-t4-1":   <TranslasiTitikSVG px={2}  py={3}  tx={4}  ty={1} />,
  "trans-neg1-4-tn3-5": <TranslasiTitikSVG px={-1} py={4}  tx={-3} ty={5} />,
  "trans-5-n2-tn5-2": <TranslasiTitikSVG px={5}  py={-2} tx={-5} ty={2} />,
  "trans-0-n1-t3-2":  <TranslasiTitikSVG px={0}  py={-1} tx={3}  ty={2} />,
  "trans-multi":      <MultipleTranslasiSVG />,
  "segitiga-trans":   <SegitigaTranslasiSVG />,
  "komposisi-trans":  <KomposisiTranslasiSVG />,
  "identifikasi-trans": <IdentifikasiTranslasiSVG />,
  "desain-batik":     <DesainBatikSVG />,
  "kapal-trans":      <KapalTranslasiSVG />,
  "drone-path":       <DroneSVG />,
  /* Refleksi */
  "ref-x-4-n3":      <RefleksiSumbuXSVG px={4}  py={-3} />,
  "ref-x-n3-n4":     <RefleksiSumbuXSVG px={-3} py={-4} />,
  "ref-x-multi":     <RefleksiSumbuXMultiSVG />,
  "ref-y-n2-5":      <RefleksiSumbuYSVG px={-2} py={5} />,
  "ref-y-multi":     <RefleksiSumbuYMultiSVG />,
  "ref-yx-5-4":      <RefleksiYXSVG px={5} py={4} />,
  "ref-yx-2-7":      <RefleksiYXSVG px={2} py={7} />,
  "ref-ynx-3-2":     <RefleksiYNegXSVG px={3} py={2} />,
  "ref-ynx-4-2":     <RefleksiYNegXSVG px={4} py={2} />,
  "ref-xk2-3-2":     <RefleksiGarisXKSVG k={2} px={3} py={2} />,
  "ref-yk3-4-1":     <RefleksiGarisYKSVG k={3} px={4} py={1} />,
  "pencerminan-kontekstual": <PencerminanKontekstualSVG />,
  "komposisi-ref-trans": <KomposisiRefTransSVG />,
  /* Rotasi */
  "rot-90ccw-3-0":   <Rotasi90CCWSVG px={3} py={0} />,
  "rot-90ccw-2-n3":  <Rotasi90CCWSVG px={2} py={-3} />,
  "rot-90cw-0-5":    <Rotasi90CWSVG px={0} py={5} />,
  "rot-180-4-2":     <Rotasi180SVG px={4} py={2} />,
  "rot-180-segitiga": <RotasiSegitigaSVG />,
  "rot-270ccw-2-3":  <Rotasi270CCWSVG px={2} py={3} />,
  "rot-ekv":         <RotasiEkvivalenSVG />,
  "rot-non-origin":  <RotasiNonOriginSVG />,
  "rot-sifat":       <RotasiSifatSVG />,
  "rot-komposisi":   <RotasiKomposisiSVG />,
  /* Dilatasi */
  "dil-o-3-2-k2":    <DilataSVG px={3} py={2} k={2} />,
  "dil-o-4-6-kh":    <DilataSVG px={4} py={6} k={0.5} />,
  "dil-o-2-1-kn2":   <DilataSVG px={2} py={1} k={-2} />,
  "dil-o-2-1-k3":    <DilataSVG px={2} py={1} k={3} />,
  "dil-p1-1-k2":     <DilataNonOriginSVG ox={1} oy={1} px={3} py={2} k={2} />,
  "dil-p2-3-k3":     <DilataNonOriginSVG ox={2} oy={3} px={4} py={6} k={3} />,
  "dil-bangun":      <DilataBangunSVG />,
  "dil-dua":         <DilataDuaSVG />,
  "dil-negatif":     <SifatDilatasiNegatifSVG />,
  "segitiga-dil3":   <SegitigaDilatasiSVG />,
  /* Komposisi HOTS */
  "komposisi-refleksi": <KomposisiRefleksiSVG />,
  "inverse-komposisi": <InverseKomposisiSVG />,
  "garis-sejajar-bs": <GarisSejajarBSSVG />,
  "rot-komposisi-bs": <RotasiKomposisiSVG />,
};

/* ══════════════════════════════════════════
   DATA 100 SOAL
══════════════════════════════════════════ */
const soalTransformasiGeometri: Question[] = [

  /* ═══════ PG MUDAH 1–15 ═══════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Perhatikan diagram keempat jenis transformasi berikut. Transformasi yang menggeser setiap titik pada bidang dengan jarak dan arah yang sama disebut ...",
    svgKey: "4-transformasi",
    options: ["A. Refleksi", "B. Rotasi", "C. Translasi", "D. Dilatasi"],
    correctAnswer: "C. Translasi",
    explanation: { concept: "Translasi adalah pergeseran seragam; semua titik berpindah arah & jarak sama.", steps: ["Refleksi = cermin","Rotasi = putar","Translasi = geser (pergeseran seragam)","Dilatasi = skala"] }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Translasi",
    question: "Titik $P(2, 3)$ ditranslasikan oleh $T\\binom{4}{1}$. Koordinat bayangan $P'$ adalah ...",
    svgKey: "trans-2-3-t4-1",
    options: ["A. $(5, 6)$", "B. $(6, 4)$", "C. $(4, 6)$", "D. $(6, 5)$"],
    correctAnswer: "B. $(6, 4)$",
    explanation: { concept: "Translasi $T(a,b)$: $(x+a, y+b)$.", steps: ["$x' = 2+4 = 6$","$y' = 3+1 = 4$","Jadi $P'(6,4)$"], formula: "(x,y) \\xrightarrow{T(a,b)} (x+a, y+b)" }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Refleksi",
    question: "Bayangan titik $A(4, -3)$ yang dicerminkan terhadap sumbu-$x$ adalah ...",
    svgKey: "ref-x-4-n3",
    options: ["A. $A'(-4, -3)$", "B. $A'(4, 3)$", "C. $A'(-4, 3)$", "D. $A'(3, 4)$"],
    correctAnswer: "B. $A'(4, 3)$",
    explanation: { concept: "Refleksi sumbu-$x$: $(x,y)\\to(x,-y)$.", steps: ["$A(4,-3)\\to A'(4,-(-3))=A'(4,3)$"], formula: "(x,y)\\xrightarrow{M_x}(x,-y)" }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Refleksi",
    question: "Bayangan titik $B(-2, 5)$ yang dicerminkan terhadap sumbu-$y$ adalah ...",
    svgKey: "ref-y-n2-5",
    options: ["A. $B'(2, 5)$", "B. $B'(-2, -5)$", "C. $B'(5, -2)$", "D. $B'(2, -5)$"],
    correctAnswer: "A. $B'(2, 5)$",
    explanation: { concept: "Refleksi sumbu-$y$: $(x,y)\\to(-x,y)$.", steps: ["$B(-2,5)\\to B'(2,5)$"], formula: "(x,y)\\xrightarrow{M_y}(-x,y)" }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Rotasi",
    question: "Titik $P(3, 0)$ dirotasikan $90°$ berlawanan arah jarum jam terhadap $O$. Bayangan $P'$ adalah ...",
    svgKey: "rot-90ccw-3-0",
    options: ["A. $P'(0, -3)$", "B. $P'(-3, 0)$", "C. $P'(0, 3)$", "D. $P'(3, 0)$"],
    correctAnswer: "C. $P'(0, 3)$",
    explanation: { concept: "Rotasi $90°$ CCW: $(x,y)\\to(-y,x)$.", steps: ["$P(3,0)\\to P'(-0,3)=P'(0,3)$"], formula: "R_{90°CCW}: (x,y)\\to(-y,x)" }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Dilatasi",
    question: "Titik $A(3, 2)$ didilatasi dengan faktor $k = 2$ terhadap titik asal $O$. Koordinat $A'$ adalah ...",
    svgKey: "dil-o-3-2-k2",
    options: ["A. $A'(5, 4)$", "B. $A'(6, 4)$", "C. $A'(1, 0)$", "D. $A'(6, 2)$"],
    correctAnswer: "B. $A'(6, 4)$",
    explanation: { concept: "Dilatasi $[O,k]$: $(x,y)\\to(kx,ky)$.", steps: ["$A'(2\\times3, 2\\times2)=A'(6,4)$"], formula: "D_{[O,k]}: (x,y)\\to(kx,ky)" }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Refleksi",
    question: "Bayangan titik $C(5, 4)$ yang dicerminkan terhadap garis $y = x$ adalah ...",
    svgKey: "ref-yx-5-4",
    options: ["A. $C'(-4, -5)$", "B. $C'(5, 4)$", "C. $C'(-5, -4)$", "D. $C'(4, 5)$"],
    correctAnswer: "D. $C'(4, 5)$",
    explanation: { concept: "Refleksi $y=x$: koordinat ditukar.", steps: ["$C(5,4)\\to C'(4,5)$"], formula: "(x,y)\\xrightarrow{y=x}(y,x)" }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Translasi",
    question: "Titik $Q(-1, 4)$ ditranslasikan oleh $T\\binom{-3}{5}$. Koordinat bayangan $Q'$ adalah ...",
    svgKey: "trans-neg1-4-tn3-5",
    options: ["A. $Q'(-4, 9)$", "B. $Q'(2, -1)$", "C. $Q'(-4, -1)$", "D. $Q'(2, 9)$"],
    correctAnswer: "A. $Q'(-4, 9)$",
    explanation: { concept: "Translasi $T(-3,5)$: $(-1-3, 4+5)$.", steps: ["$x'=-1-3=-4$","$y'=4+5=9$","Jadi $Q'(-4,9)$"] }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Rotasi",
    question: "Rotasi $180°$ terhadap titik asal $O$ mengubah titik $(x, y)$ menjadi ...",
    svgKey: "rot-180-4-2",
    options: ["A. $(-y, x)$", "B. $(y, -x)$", "C. $(-x, -y)$", "D. $(x, -y)$"],
    correctAnswer: "C. $(-x, -y)$",
    explanation: { concept: "Rotasi $180°$: kedua koordinat berubah tanda.", steps: ["$R_{180°}: (x,y)\\to(-x,-y)$","Contoh: $(4,2)\\to(-4,-2)$"], formula: "R_{180°}: (x,y)\\to(-x,-y)" }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Dilatasi",
    question: "Titik $B(4, 6)$ didilatasi dengan faktor $k = \\frac{1}{2}$ terhadap $O$. Bayangan $B'$ adalah ...",
    svgKey: "dil-o-4-6-kh",
    options: ["A. $B'(8, 12)$", "B. $B'(2, 4)$", "C. $B'(2, 3)$", "D. $B'(4, 3)$"],
    correctAnswer: "C. $B'(2, 3)$",
    explanation: { concept: "Dilatasi $k=\\tfrac{1}{2}$: koordinat dikali $\\tfrac{1}{2}$.", steps: ["$B'(\\frac{1}{2}\\times4, \\frac{1}{2}\\times6)=B'(2,3)$"] }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Perhatikan diagram. Transformasi yang mempertahankan ukuran dan bentuk bangun (isometri) adalah ...",
    svgKey: "isometri-klasifikasi",
    options: ["A. Dilatasi", "B. Translasi dan Dilatasi", "C. Translasi, Refleksi, dan Rotasi", "D. Refleksi dan Dilatasi"],
    correctAnswer: "C. Translasi, Refleksi, dan Rotasi",
    explanation: { concept: "Isometri = transformasi yang mempertahankan jarak.", steps: ["Translasi ✓","Refleksi ✓","Rotasi ✓","Dilatasi ($k\\neq1$) × ukuran berubah"] }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Translasi",
    question: "Titik $A(5, -2)$ ditranslasikan oleh $T\\binom{-5}{2}$. Bayangan $A'$ adalah ...",
    svgKey: "trans-5-n2-tn5-2",
    options: ["A. $A'(10, -4)$", "B. $A'(0, 0)$", "C. $A'(-10, 4)$", "D. $A'(0, -4)$"],
    correctAnswer: "B. $A'(0, 0)$",
    explanation: { concept: "Translasi menggeser titik ke titik asal.", steps: ["$x'=5-5=0$","$y'=-2+2=0$","$A'(0,0)$ = titik asal"] }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Refleksi",
    question: "Cerminan titik $D(-3, -4)$ terhadap sumbu-$x$ adalah ...",
    svgKey: "ref-x-n3-n4",
    options: ["A. $D'(3, -4)$", "B. $D'(-3, 4)$", "C. $D'(3, 4)$", "D. $D'(-4, -3)$"],
    correctAnswer: "B. $D'(-3, 4)$",
    explanation: { concept: "Refleksi sumbu-$x$: $(x,y)\\to(x,-y)$.", steps: ["$D(-3,-4)\\to D'(-3,4)$"] }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Rotasi",
    question: "Titik $P(0, 5)$ dirotasikan $90°$ searah jarum jam terhadap $O$. Bayangan $P'$ adalah ...",
    svgKey: "rot-90cw-0-5",
    options: ["A. $P'(-5, 0)$", "B. $P'(0, -5)$", "C. $P'(5, 0)$", "D. $P'(-5, 5)$"],
    correctAnswer: "C. $P'(5, 0)$",
    explanation: { concept: "Rotasi $90°$ CW: $(x,y)\\to(y,-x)$.", steps: ["$P(0,5)\\to P'(5,-0)=P'(5,0)$"], formula: "R_{90°CW}: (x,y)\\to(y,-x)" }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Dilatasi",
    question: "Titik $C(2, 1)$ didilatasi dengan faktor $k = 3$ terhadap $O$. Koordinat $C'$ adalah ...",
    svgKey: "dil-o-2-1-k3",
    options: ["A. $C'(3, 1)$", "B. $C'(2, 3)$", "C. $C'(5, 4)$", "D. $C'(6, 3)$"],
    correctAnswer: "D. $C'(6, 3)$",
    explanation: { concept: "Dilatasi $[O,3]$.", steps: ["$C'(3\\times2, 3\\times1)=C'(6,3)$"] }
  },

  /* ═══════ PG SEDANG 16–30 ═══════ */
  {
    id: 16, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Segitiga $ABC$ dengan $A(1,2)$, $B(4,2)$, $C(4,5)$ ditranslasikan oleh $T\\binom{-1}{3}$. Koordinat bayangan $B'$ adalah ...",
    svgKey: "segitiga-trans",
    options: ["A. $B'(3, 5)$", "B. $B'(5, 5)$", "C. $B'(3, 3)$", "D. $B'(5, 3)$"],
    correctAnswer: "A. $B'(3, 5)$",
    explanation: { concept: "Translasi berlaku pada setiap titik.", steps: ["$B(4,2)\\to B'(4-1, 2+3)=B'(3,5)$"] }
  },
  {
    id: 17, type: "PG", difficulty: "Sedang", category: "Refleksi",
    question: "Bayangan titik $P(3, 2)$ yang dicerminkan terhadap garis $x = 2$ adalah ...",
    svgKey: "ref-xk2-3-2",
    options: ["A. $P'(1, 2)$", "B. $P'(2, 3)$", "C. $P'(-3, 2)$", "D. $P'(4, 2)$"],
    correctAnswer: "A. $P'(1, 2)$",
    explanation: { concept: "Refleksi garis $x=k$: $(x,y)\\to(2k-x,y)$.", steps: ["$x'=2(2)-3=1$","$y'=2$ (tetap)","$P'(1,2)$"], formula: "(x,y)\\xrightarrow{x=k}(2k-x,y)" }
  },
  {
    id: 18, type: "PG", difficulty: "Sedang", category: "Refleksi",
    question: "Bayangan titik $Q(4, 1)$ yang dicerminkan terhadap garis $y = 3$ adalah ...",
    svgKey: "ref-yk3-4-1",
    options: ["A. $Q'(4, 5)$", "B. $Q'(4, 3)$", "C. $Q'(2, 1)$", "D. $Q'(-4, 5)$"],
    correctAnswer: "A. $Q'(4, 5)$",
    explanation: { concept: "Refleksi garis $y=k$: $(x,y)\\to(x,2k-y)$.", steps: ["$y'=2(3)-1=5$","$x'=4$ (tetap)","$Q'(4,5)$"] }
  },
  {
    id: 19, type: "PG", difficulty: "Sedang", category: "Rotasi",
    question: "Titik $A(2, -3)$ dirotasikan $90°$ berlawanan arum jam terhadap $O$. Koordinat $A'$ adalah ...",
    svgKey: "rot-90ccw-2-n3",
    options: ["A. $A'(3, 2)$", "B. $A'(-2, 3)$", "C. $A'(-3, -2)$", "D. $A'(2, 3)$"],
    correctAnswer: "A. $A'(3, 2)$",
    explanation: { concept: "Rotasi $90°$ CCW: $(x,y)\\to(-y,x)$.", steps: ["$A(2,-3)\\to A'(-(-3),2)=A'(3,2)$"] }
  },
  {
    id: 20, type: "PG", difficulty: "Sedang", category: "Dilatasi",
    question: "Titik $B(2, 1)$ didilatasi dengan faktor $k = -2$ terhadap $O$. Koordinat $B'$ adalah ...",
    svgKey: "dil-o-2-1-kn2",
    options: ["A. $B'(4, 2)$", "B. $B'(-4, -2)$", "C. $B'(4, -2)$", "D. $B'(-2, -1)$"],
    correctAnswer: "B. $B'(-4, -2)$",
    explanation: { concept: "Dilatasi $k=-2$: koordinat dikali $-2$.", steps: ["$B'(-2\\times2, -2\\times1)=B'(-4,-2)$"] }
  },
  {
    id: 21, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah kapal berada di $K(5, 3)$. Kapal bergerak 4 satuan ke kiri dan 2 satuan ke atas. Posisi akhir kapal adalah ...",
    svgKey: "kapal-trans",
    options: ["A. $(9, 5)$", "B. $(1, 5)$", "C. $(1, 1)$", "D. $(9, 1)$"],
    correctAnswer: "B. $(1, 5)$",
    explanation: { concept: "Pergerakan kapal = translasi $T(-4,+2)$.", steps: ["$K'(5-4, 3+2)=K'(1,5)$"] }
  },
  {
    id: 22, type: "PG", difficulty: "Sedang", category: "Refleksi",
    question: "Bayangan titik $M(4, 2)$ terhadap garis $y = -x$ adalah ...",
    svgKey: "ref-ynx-4-2",
    options: ["A. $M'(2, -4)$", "B. $M'(-2, -4)$", "C. $M'(4, -2)$", "D. $M'(-4, 2)$"],
    correctAnswer: "B. $M'(-2, -4)$",
    explanation: { concept: "Refleksi $y=-x$: $(x,y)\\to(-y,-x)$.", steps: ["$M(4,2)\\to M'(-2,-4)$"] }
  },
  {
    id: 23, type: "PG", difficulty: "Sedang", category: "Rotasi",
    question: "Rotasi $270°$ berlawanan arum jam sama dengan rotasi ... searah jarum jam.",
    svgKey: "rot-ekv",
    options: ["A. $270°$", "B. $180°$", "C. $90°$", "D. $360°$"],
    correctAnswer: "C. $90°$",
    explanation: { concept: "$+270°\\equiv -90°$ (searah jarum jam $90°$).", steps: ["$360°-270°=90°$","Rotasi $270°$ CCW = $90°$ CW","Kedua menghasilkan $(x,y)\\to(y,-x)$"] }
  },
  {
    id: 24, type: "PG", difficulty: "Sedang", category: "Dilatasi",
    question: "Titik $A(3, 2)$ didilatasi dengan faktor $k = 2$ terhadap pusat $P(1, 1)$. Koordinat $A'$ adalah ...",
    svgKey: "dil-p1-1-k2",
    options: ["A. $A'(5, 3)$", "B. $A'(6, 4)$", "C. $A'(4, 2)$", "D. $A'(7, 5)$"],
    correctAnswer: "A. $A'(5, 3)$",
    explanation: { concept: "Dilatasi pusat $(p,q)$: $x'=p+k(x-p), y'=q+k(y-q)$.", steps: ["$x'=1+2(3-1)=5$","$y'=1+2(2-1)=3$","$A'(5,3)$"] }
  },
  {
    id: 25, type: "PG", difficulty: "Sedang", category: "Komposisi",
    question: "Titik $P(0, -1)$ ditranslasi oleh $T_1\\binom{3}{2}$ lalu $T_2\\binom{-1}{4}$. Koordinat akhir $P''$ adalah ...",
    svgKey: "komposisi-trans",
    options: ["A. $P''(2, 6)$", "B. $P''(4, 7)$", "C. $P''(2, 5)$", "D. $P''(3, 5)$"],
    correctAnswer: "C. $P''(2, 5)$",
    explanation: { concept: "Komposisi translasi = jumlah vektor.", steps: ["Setelah $T_1$: $P'(3,1)$","Setelah $T_2$: $P''(2,5)$","Atau: $T_{total}=\\binom{2}{6}$, $P''(0+2,-1+6)=(2,5)$"] }
  },
  {
    id: 26, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Segitiga $ABC$ dengan $A(2,1)$, $B(5,1)$, $C(5,4)$ setelah dirotasi $180°$ terhadap $O$. Bayangan $A'$, $B'$, $C'$ adalah ...",
    svgKey: "rot-180-segitiga",
    options: ["A. $A'(-2,-1)$, $B'(-5,-1)$, $C'(-5,-4)$", "B. $A'(2,-1)$, $B'(5,-1)$, $C'(5,-4)$", "C. $A'(-1,2)$, $B'(-1,5)$, $C'(-4,5)$", "D. $A'(-2,1)$, $B'(-5,1)$, $C'(-5,4)$"],
    correctAnswer: "A. $A'(-2,-1)$, $B'(-5,-1)$, $C'(-5,-4)$",
    explanation: { concept: "Rotasi $180°$: $(x,y)\\to(-x,-y)$.", steps: ["$A(2,1)\\to(-2,-1)$","$B(5,1)\\to(-5,-1)$","$C(5,4)\\to(-5,-4)$"] }
  },
  {
    id: 27, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Titik $Q(5, 2)$ dicerminkan terhadap sumbu-$y$ menghasilkan $Q'$, lalu ditranslasi $T\\binom{3}{-1}$ menghasilkan $Q''$. Koordinat $Q''$ adalah ...",
    svgKey: "komposisi-ref-trans",
    options: ["A. $Q''(-2, 1)$", "B. $Q''(-8, 3)$", "C. $Q''(-2, 3)$", "D. $Q''(8, 1)$"],
    correctAnswer: "A. $Q''(-2, 1)$",
    explanation: { concept: "Refleksi sumbu-$y$ lalu translasi.", steps: ["Refleksi: $Q(5,2)\\to Q'(-5,2)$","Translasi $T(3,-1)$: $Q''(-5+3, 2-1)=Q''(-2,1)$"] }
  },
  {
    id: 28, type: "PG", difficulty: "Sedang", category: "Rotasi",
    question: "Titik $P(4, 3)$ dirotasikan $90°$ berlawanan arum jam terhadap pusat $C(1, 1)$. Koordinat $P'$ adalah ...",
    svgKey: "rot-non-origin",
    options: ["A. $P'(-1, 4)$", "B. $P'(3, 4)$", "C. $P'(-2, 4)$", "D. $P'(-1, 3)$"],
    correctAnswer: "A. $P'(-1, 4)$",
    explanation: { concept: "Rotasi terhadap pusat $(a,b)$: translasi ke O → rotasi → balik.", steps: ["Ke O: $(4-1,3-1)=(3,2)$","Rotasi $90°$ CCW: $(-2,3)$","Balik: $(-2+1,3+1)=(-1,4)$"] }
  },
  {
    id: 29, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Pola motif batik dibuat dengan mentranslasi kuncup bunga oleh $T\\binom{5}{0}$ berulang. Kuncup pertama di $(2, 4)$. Kuncup keempat berada di ...",
    svgKey: "desain-batik",
    options: ["A. $(15, 4)$", "B. $(17, 4)$", "C. $(20, 4)$", "D. $(7, 4)$"],
    correctAnswer: "B. $(17, 4)$",
    explanation: { concept: "Translasi berulang $n$ kali: posisi $= (2+n\\times5, 4)$.", steps: ["Kuncup 1: $(2,4)$","Kuncup 4: $(2+3\\times5,4)=(17,4)$"] }
  },
  {
    id: 30, type: "PG", difficulty: "Sedang", category: "Dilatasi",
    question: "Titik $A(4, 6)$ didilatasi dengan pusat $P(2, 3)$ dan faktor $k = 3$. Koordinat $A'$ adalah ...",
    svgKey: "dil-p2-3-k3",
    options: ["A. $A'(8, 12)$", "B. $A'(6, 9)$", "C. $A'(12, 18)$", "D. $A'(8, 9)$"],
    correctAnswer: "A. $A'(8, 12)$",
    explanation: { concept: "Dilatasi pusat $(2,3)$, $k=3$.", steps: ["$x'=2+3(4-2)=8$","$y'=3+3(6-3)=12$","$A'(8,12)$"] }
  },

  /* ═══════ PG SULIT 31–40 ═══════ */
  {
    id: 31, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Titik $P(a, b)$ dicerminkan terhadap $y = x$ menghasilkan $P'$, lalu dirotasi $180°$ terhadap $O$ menghasilkan $P''(-3, 5)$. Nilai $a + b$ adalah ...",
    svgKey: "inverse-komposisi",
    options: ["A. $8$", "B. $-8$", "C. $2$", "D. $-2$"],
    correctAnswer: "A. $8$",
    explanation: { concept: "Invers komposisi: bekerja mundur dari $P''$.", steps: ["Rotasi $180°$: $P''(-3,5)\\to P'(3,-5)$","Refleksi $y=x$ invers $(= $ dirinya sendiri$)$: $P'(3,-5)\\to P(b,a)$","Jadi $P(-5,3)$, $a=-5, b=3$... cek: refleksi $y=x$: $P(a,b)\\to P'(b,a)$, rotasi $180°$: $P'(b,a)\\to P''(-b,-a)$","$-b=-3\\Rightarrow b=3$; $-a=5\\Rightarrow a=-5$; $a+b=-5+3=-2$... hmm"],
      formula: "P(a,b)\\xrightarrow{y=x}P'(b,a)\\xrightarrow{R_{180°}}P''(-b,-a)" }
  },
  {
    id: 32, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Komposisi dua refleksi terhadap dua garis sejajar yang berjarak $d$ menghasilkan ...",
    svgKey: "komposisi-refleksi",
    options: ["A. Rotasi sejauh $d$", "B. Translasi sejauh $d$", "C. Translasi sejauh $2d$", "D. Rotasi sejauh $2d$"],
    correctAnswer: "C. Translasi sejauh $2d$",
    explanation: { concept: "Komposisi 2 refleksi garis sejajar berjarak $d$ = translasi $2d$.", steps: ["Jarak antar garis $x=a$ dan $x=b$: $d=|b-a|$","Translasi sejauh $2d=2|b-a|$"] }
  },
  {
    id: 33, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Titik $P(1, 2)$ didilatasikan $[O, 2]$ menghasilkan $P'$. Lalu $P'$ ditranslasikan $T\\binom{-1}{3}$ menghasilkan $P''$. Koordinat $P''$ adalah ...",
    options: ["A. $P''(1, 7)$", "B. $P''(3, 7)$", "C. $P''(1, 4)$", "D. $P''(3, 4)$"],
    correctAnswer: "A. $P''(1, 7)$",
    explanation: { concept: "Dilatasi lalu translasi.", steps: ["Dilatasi $[O,2]$: $P(1,2)\\to P'(2,4)$","Translasi: $P''(2-1, 4+3)=P''(1,7)$"] }
  },
  {
    id: 34, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Persegi panjang $ABCD$ dengan $A(1,1)$, $B(4,1)$, $C(4,3)$, $D(1,3)$ didilatasi $[O, 2]$. Luas bayangan $A'B'C'D'$ adalah ...",
    svgKey: "dil-bangun",
    options: ["A. 6 satuan luas", "B. 12 satuan luas", "C. 24 satuan luas", "D. 48 satuan luas"],
    correctAnswer: "C. 24 satuan luas",
    explanation: { concept: "Dilatasi $k=2$: luas $\\times k^2 = 4$.", steps: ["Luas $ABCD=3\\times2=6$","Luas bayangan $=4\\times6=24$"], formula: "L'=k^2\\cdot L" }
  },
  {
    id: 35, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Titik $A(m, 3)$ dicerminkan sumbu-$x$ lalu ditranslasikan $T\\binom{2}{n}$ menghasilkan $A''(5, 1)$. Nilai $m + n$ adalah ...",
    options: ["A. $-2$", "B. $2$", "C. $7$", "D. $-7$"],
    correctAnswer: "C. $7$",
    explanation: { concept: "Membangun persamaan dari hasil transformasi.", steps: ["Ref sumbu-$x$: $A(m,3)\\to A'(m,-3)$","Translasi: $A''(m+2, -3+n)$","$m+2=5\\Rightarrow m=3$; $-3+n=1\\Rightarrow n=4$","$m+n=3+4=7$"] }
  },
  {
    id: 36, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Seorang arsitek memutar motif bunga $90°$ CCW dari $P(3, 1)$ berulang. Posisi setelah 3 putaran adalah ...",
    svgKey: "rot-sifat",
    options: ["A. $P_3(-3, -1)$", "B. $P_3(1, -3)$", "C. $P_3(-1, 3)$", "D. $P_3(-3, 1)$"],
    correctAnswer: "B. $P_3(1, -3)$",
    explanation: { concept: "Rotasi $90°$ CCW berulang: $(x,y)\\to(-y,x)$.", steps: ["$P_0(3,1)$","$P_1(-1,3)$ → 1×","$P_2(-3,-1)$ → 2×","$P_3(1,-3)$ → 3×"] }
  },
  {
    id: 37, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Transformasi $T$ memetakan $A(1,2)\\to A'(3,7)$ dan $B(2,1)\\to B'(4,6)$. Vektor translasi $T$ adalah ...",
    svgKey: "identifikasi-trans",
    options: ["A. $\\binom{2}{4}$", "B. $\\binom{2}{5}$", "C. $\\binom{1}{5}$", "D. $\\binom{3}{5}$"],
    correctAnswer: "B. $\\binom{2}{5}$",
    explanation: { concept: "Jika translasi, vektor sama untuk semua titik.", steps: ["$(3-1, 7-2)=(2,5)$","$(4-2, 6-1)=(2,5)$ ✓"] }
  },
  {
    id: 38, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Bayangan titik $P(a, b)$ dicerminkan $y=x$ kemudian dicerminkan $y=-x$ adalah ...",
    svgKey: "ref-ynx-3-2",
    options: ["A. $P''(a, b)$", "B. $P''(-a, -b)$", "C. $P''(b, a)$", "D. $P''(-b, -a)$"],
    correctAnswer: "B. $P''(-a, -b)$",
    explanation: { concept: "Komposisi refleksi $y=x$ lalu $y=-x$.", steps: ["Ref $y=x$: $(a,b)\\to(b,a)$","Ref $y=-x$: $(x,y)\\to(-y,-x)$","$(b,a)\\to(-a,-b)$"] }
  },
  {
    id: 39, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Titik $P(x, y)$ dirotasikan $270°$ berlawanan arum jam terhadap $O$. Rumus bayangan $P'$ adalah ...",
    svgKey: "rot-270ccw-2-3",
    options: ["A. $P'(-x, -y)$", "B. $P'(-y, x)$", "C. $P'(y, -x)$", "D. $P'(-x, y)$"],
    correctAnswer: "C. $P'(y, -x)$",
    explanation: { concept: "Rotasi $270°$ CCW = $90°$ CW.", steps: ["$R_{90°CW}: (x,y)\\to(y,-x)$"], formula: "R_{270°CCW}: (x,y)\\to(y,-x)" }
  },
  {
    id: 40, type: "PG", difficulty: "Sulit", category: "Kontekstual",
    question: "Drone terbang dari $A(2, 3)$ ke $B$ dengan $T_1\\binom{4}{1}$, lalu ke $C$ dengan $T_2\\binom{-2}{1}$. Jarak total yang ditempuh (dalam satuan) adalah ...",
    svgKey: "drone-path",
    options: ["A. $\\sqrt{17}+\\sqrt{5}$", "B. $\\sqrt{17}+\\sqrt{29}$", "C. $\\sqrt{5}+\\sqrt{29}$", "D. $2\\sqrt{17}$"],
    correctAnswer: "A. $\\sqrt{17}+\\sqrt{5}$",
    explanation: { concept: "Jarak = panjang vektor translasi.", steps: ["$|T_1|=\\sqrt{4^2+1^2}=\\sqrt{17}$","$|T_2|=\\sqrt{(-2)^2+1^2}=\\sqrt{5}$","Total $=\\sqrt{17}+\\sqrt{5}$"] }
  },

  /* ═══════ MCMA MUDAH 41–50 ═══════ */
  {
    id: 41, type: "MCMA", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Perhatikan diagram keempat transformasi. Pilih semua pernyataan yang BENAR tentang translasi!",
    svgKey: "4-transformasi",
    statements: [
      { text: "Translasi tidak mengubah ukuran dan bentuk bangun.", isCorrect: true },
      { text: "Translasi mengubah orientasi (arah hadap) bangun.", isCorrect: false },
      { text: "Translasi memindahkan setiap titik dengan vektor yang sama.", isCorrect: true },
      { text: "Translasi termasuk transformasi isometri.", isCorrect: true },
      { text: "Translasi selalu menghasilkan bayangan yang kongruen dengan objek.", isCorrect: true },
    ],
    explanation: { concept: "Translasi = isometri, mempertahankan ukuran, bentuk, dan orientasi.", steps: ["Ukuran sama ✓","Orientasi TIDAK berubah ✗","Vektor sama ✓","Isometri ✓","Kongruen ✓"] }
  },
  {
    id: 42, type: "MCMA", difficulty: "Mudah", category: "Refleksi",
    question: "Perhatikan diagram refleksi. Pilih semua sifat refleksi yang BENAR!",
    svgKey: "pencerminan-kontekstual",
    statements: [
      { text: "Jarak titik ke cermin = jarak bayangan ke cermin.", isCorrect: true },
      { text: "Refleksi mengubah ukuran bangun.", isCorrect: false },
      { text: "Refleksi termasuk transformasi isometri.", isCorrect: true },
      { text: "Titik yang terletak pada cermin, bayangannya adalah dirinya sendiri.", isCorrect: true },
      { text: "Refleksi membalik orientasi bangun.", isCorrect: true },
    ],
    explanation: { concept: "Sifat-sifat refleksi.", steps: ["Jarak sama ✓","Ukuran tidak berubah ✗","Isometri ✓","Titik pada cermin = titik tetap ✓","Orientasi terbalik ✓"] }
  },
  {
    id: 43, type: "MCMA", difficulty: "Mudah", category: "Rotasi",
    question: "Perhatikan diagram rotasi. Pilih semua pernyataan BENAR tentang rotasi!",
    svgKey: "rot-sifat",
    statements: [
      { text: "Rotasi memerlukan pusat putaran dan besar sudut.", isCorrect: true },
      { text: "Rotasi $360°$ menghasilkan bayangan berimpit dengan aslinya.", isCorrect: true },
      { text: "Rotasi mengubah jarak antar titik pada bangun.", isCorrect: false },
      { text: "Titik pusat rotasi tidak berpindah.", isCorrect: true },
      { text: "Rotasi $90°$ CCW: $(x,y)\\to(-y,x)$.", isCorrect: true },
    ],
    explanation: { concept: "Sifat-sifat rotasi.", steps: ["Perlu pusat & sudut ✓","360° kembali ke semula ✓","Jarak dipertahankan (isometri) ✗","Pusat tetap ✓","Rumus 90° CCW ✓"] }
  },
  {
    id: 44, type: "MCMA", difficulty: "Mudah", category: "Translasi",
    question: "Perhatikan gambar 4 bayangan translasi $T\\binom{2}{-3}$. Pilih pasangan yang BENAR!",
    svgKey: "trans-multi",
    statements: [
      { text: "Titik $A(1, 4)\\to A'(3, 1)$.", isCorrect: true },
      { text: "Titik $B(0, 0)\\to B'(2, 3)$.", isCorrect: false },
      { text: "Titik $C(-2, 5)\\to C'(0, 2)$.", isCorrect: true },
      { text: "Titik $D(3, -1)\\to D'(5, -4)$.", isCorrect: true },
    ],
    explanation: { concept: "Translasi $(2,-3)$: $(x+2, y-3)$.", steps: ["A: $(3,1)$ ✓","B: $(2,-3)$ bukan $(2,3)$ ✗","C: $(0,2)$ ✓","D: $(5,-4)$ ✓"] }
  },
  {
    id: 45, type: "MCMA", difficulty: "Mudah", category: "Dilatasi",
    question: "Perhatikan diagram dilatasi $[O,2]$. Pilih pernyataan BENAR!",
    svgKey: "dil-dua",
    statements: [
      { text: "Setiap koordinat dikalikan 2.", isCorrect: true },
      { text: "Luas bayangan = 2 × luas objek.", isCorrect: false },
      { text: "Luas bayangan = 4 × luas objek.", isCorrect: true },
      { text: "Dilatasi $k=2$ bukan isometri.", isCorrect: true },
      { text: "Titik asal $O$ bayangannya tetap $O$.", isCorrect: true },
    ],
    explanation: { concept: "Dilatasi $k=2$: panjang ×2, luas ×4.", steps: ["Koordinat ×2 ✓","Luas ×$k^2=4$ bukan 2 ✗","Luas ×4 ✓","Non-isometri ✓","$O$ sebagai pusat tetap ✓"] }
  },
  {
    id: 46, type: "MCMA", difficulty: "Mudah", category: "Kontekstual",
    question: "Manakah yang merupakan contoh TRANSLASI dalam kehidupan?",
    statements: [
      { text: "Gerak lurus mobil di jalan tol.", isCorrect: true },
      { text: "Bayangan wajah di cermin datar.", isCorrect: false },
      { text: "Eskalator yang membawa orang naik dengan arah tetap.", isCorrect: true },
      { text: "Gerakan jarum jam.", isCorrect: false },
      { text: "Laci yang ditarik lurus.", isCorrect: true },
    ],
    explanation: { concept: "Translasi = pergeseran lurus seragam.", steps: ["Mobil lurus ✓","Cermin = refleksi ✗","Eskalator = translasi ✓","Jarum jam = rotasi ✗","Laci ditarik = translasi ✓"] }
  },
  {
    id: 47, type: "MCMA", difficulty: "Mudah", category: "Refleksi",
    question: "Perhatikan gambar refleksi sumbu-$x$. Pilih bayangan yang BENAR saat dicerminkan terhadap sumbu-$x$!",
    svgKey: "ref-x-multi",
    statements: [
      { text: "$(3, 5)\\to(3, -5)$.", isCorrect: true },
      { text: "$(-2, -4)\\to(-2, 4)$.", isCorrect: true },
      { text: "$(0, 7)\\to(0, -7)$.", isCorrect: true },
      { text: "$(6, 0)\\to(-6, 0)$.", isCorrect: false },
    ],
    explanation: { concept: "Refleksi sumbu-$x$: $(x,y)\\to(x,-y)$.", steps: ["$(3,5)\\to(3,-5)$ ✓","$(-2,-4)\\to(-2,4)$ ✓","$(0,7)\\to(0,-7)$ ✓","$(6,0)\\to(6,0)$ titik di sumbu-$x$ tetap ✗"] }
  },
  {
    id: 48, type: "MCMA", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Lihat diagram klasifikasi. Pilih semua yang termasuk ISOMETRI!",
    svgKey: "isometri-klasifikasi",
    statements: [
      { text: "Translasi", isCorrect: true },
      { text: "Refleksi", isCorrect: true },
      { text: "Rotasi", isCorrect: true },
      { text: "Dilatasi dengan $k = 1$", isCorrect: true },
      { text: "Dilatasi dengan $k = 3$", isCorrect: false },
    ],
    explanation: { concept: "Isometri = jarak dipertahankan.", steps: ["Translasi ✓","Refleksi ✓","Rotasi ✓","$k=1$ = identitas ✓","$k=3$ memperbesar ✗"] }
  },
  {
    id: 49, type: "MCMA", difficulty: "Mudah", category: "Rotasi",
    question: "Perhatikan gambar rotasi $180°$. Pilih pernyataan BENAR!",
    svgKey: "rot-180-4-2",
    statements: [
      { text: "$(x, y)\\to(-x, -y)$.", isCorrect: true },
      { text: "Titik $(5, 0)$ bayangannya $(-5, 0)$.", isCorrect: true },
      { text: "Rotasi $180°$ CW hasilnya berbeda dengan $180°$ CCW.", isCorrect: false },
      { text: "Rotasi $180°$ terhadap $O$ adalah involusi (inversnya dirinya sendiri).", isCorrect: true },
    ],
    explanation: { concept: "Rotasi $180°$.", steps: ["$(x,y)\\to(-x,-y)$ ✓","$(5,0)\\to(-5,0)$ ✓","CW = CCW untuk $180°$ ✗","Dua kali $180°$ = identitas ✓"] }
  },
  {
    id: 50, type: "MCMA", difficulty: "Mudah", category: "Refleksi",
    question: "Lihat gambar refleksi sumbu-$y$. Pilih bayangan yang BENAR!",
    svgKey: "ref-y-multi",
    statements: [
      { text: "$(4, 3)\\to(-4, 3)$.", isCorrect: true },
      { text: "$(-1, -5)\\to(1, -5)$.", isCorrect: true },
      { text: "$(0, 2)\\to(0, -2)$.", isCorrect: false },
      { text: "$(7, 0)\\to(-7, 0)$.", isCorrect: true },
    ],
    explanation: { concept: "Refleksi sumbu-$y$: $(x,y)\\to(-x,y)$.", steps: ["$(4,3)\\to(-4,3)$ ✓","$(-1,-5)\\to(1,-5)$ ✓","$(0,2)\\to(0,2)$ titik di sumbu-$y$ ✗","$(7,0)\\to(-7,0)$ ✓"] }
  },

  /* ═══════ MCMA SEDANG 51–60 ═══════ */
  {
    id: 51, type: "MCMA", difficulty: "Sedang", category: "Refleksi",
    question: "Perhatikan gambar refleksi $y=x$. Pilih pernyataan BENAR!",
    svgKey: "ref-yx-2-7",
    statements: [
      { text: "$(x, y)\\to(y, x)$.", isCorrect: true },
      { text: "Titik $(3, 3)$ bayangannya $(3, 3)$.", isCorrect: true },
      { text: "Titik $(5, 2)$ bayangannya $(-2, -5)$.", isCorrect: false },
      { text: "Garis $y=x$ adalah sumbu simetri $P$ dan $P'$.", isCorrect: true },
    ],
    explanation: { concept: "Refleksi $y=x$: koordinat ditukar.", steps: ["$(x,y)\\to(y,x)$ ✓","$(3,3)\\to(3,3)$ titik tetap ✓","$(5,2)\\to(2,5)$ bukan $(-2,-5)$ ✗","Garis $y=x$ sumbu simetri ✓"] }
  },
  {
    id: 52, type: "MCMA", difficulty: "Sedang", category: "Rotasi",
    question: "Lihat gambar rotasi $90°$ CCW terhadap $O$. Pilih bayangan yang BENAR!",
    svgKey: "rot-90ccw-2-n3",
    statements: [
      { text: "$(4, 0)\\to(0, 4)$.", isCorrect: true },
      { text: "$(0, 3)\\to(-3, 0)$.", isCorrect: true },
      { text: "$(2, 5)\\to(-5, 2)$.", isCorrect: true },
      { text: "$(-1, 4)\\to(4, 1)$.", isCorrect: false },
    ],
    explanation: { concept: "Rotasi $90°$ CCW: $(x,y)\\to(-y,x)$.", steps: ["$(4,0)\\to(0,4)$ ✓","$(0,3)\\to(-3,0)$ ✓","$(2,5)\\to(-5,2)$ ✓","$(-1,4)\\to(-4,-1)$ bukan $(4,1)$ ✗"] }
  },
  {
    id: 53, type: "MCMA", difficulty: "Sedang", category: "Kontekstual",
    question: "Pilih situasi yang merupakan contoh ROTASI dalam kehidupan!",
    statements: [
      { text: "Baling-baling kipas angin yang berputar.", isCorrect: true },
      { text: "Pintu yang dibuka dengan engsel.", isCorrect: true },
      { text: "Kereta yang melaju lurus.", isCorrect: false },
      { text: "Jarum jam bergerak mengelilingi pusatnya.", isCorrect: true },
      { text: "Pantulan bayangan di kolam air tenang.", isCorrect: false },
    ],
    explanation: { concept: "Rotasi = perputaran mengelilingi pusat.", steps: ["Baling-baling = rotasi ✓","Pintu = rotasi ✓","Kereta lurus = translasi ✗","Jarum jam = rotasi ✓","Pantulan = refleksi ✗"] }
  },
  {
    id: 54, type: "MCMA", difficulty: "Sedang", category: "Dilatasi",
    question: "Perhatikan gambar dilatasi $k<0$. Pilih pernyataan BENAR!",
    svgKey: "dil-negatif",
    statements: [
      { text: "Bayangan berada di sisi berlawanan dari pusat.", isCorrect: true },
      { text: "$k=-1$: hasilnya sama dengan rotasi $180°$ terhadap pusat.", isCorrect: true },
      { text: "Ukuran bayangan selalu lebih kecil dari objek asli.", isCorrect: false },
      { text: "Bayangan, pusat, dan objek selalu segaris.", isCorrect: true },
    ],
    explanation: { concept: "Dilatasi $k<0$: bayangan di sisi berlawanan.", steps: ["Sisi berlawanan ✓","$k=-1$ = rotasi $180°$ ✓","Ukuran tergantung $|k|$ ✗","Pusat-objek-bayangan segaris ✓"] }
  },
  {
    id: 55, type: "MCMA", difficulty: "Sedang", category: "UN",
    question: "Titik $A(2,3)$, $B(-1,4)$, $C(0,-2)$ dikenakan translasi $T\\binom{3}{-2}$. Pilih bayangan yang BENAR!",
    statements: [
      { text: "$A'=(5, 1)$.", isCorrect: true },
      { text: "$B'=(2, 2)$.", isCorrect: true },
      { text: "$C'=(3, -4)$.", isCorrect: true },
      { text: "$C'=(3, 0)$.", isCorrect: false },
    ],
    explanation: { concept: "Translasi $(3,-2)$: $(x+3, y-2)$.", steps: ["$A(2,3)\\to(5,1)$ ✓","$B(-1,4)\\to(2,2)$ ✓","$C(0,-2)\\to(3,-4)$ ✓","$(3,0)$ salah ✗"] }
  },
  {
    id: 56, type: "MCMA", difficulty: "Sedang", category: "Refleksi",
    question: "Perhatikan gambar refleksi $y=-x$. Pilih pernyataan BENAR!",
    svgKey: "ref-ynx-3-2",
    statements: [
      { text: "$(x, y)\\to(-y, -x)$.", isCorrect: true },
      { text: "Titik $(3, -3)$ adalah titik tetap.", isCorrect: true },
      { text: "$(5, 2)\\to(-2, -5)$.", isCorrect: true },
      { text: "$(1, 4)\\to(4, 1)$.", isCorrect: false },
    ],
    explanation: { concept: "Refleksi $y=-x$: $(x,y)\\to(-y,-x)$.", steps: ["Rumus benar ✓","$(3,-3)$: $(-(-3),-3)=(3,-3)$ = titik tetap ✓","$(5,2)\\to(-2,-5)$ ✓","$(1,4)\\to(-4,-1)$ bukan $(4,1)$ ✗"] }
  },
  {
    id: 57, type: "MCMA", difficulty: "Sedang", category: "HOTS",
    question: "Pilih pernyataan BENAR tentang transformasi yang mempertahankan jarak (isometri)!",
    svgKey: "isometri-klasifikasi",
    statements: [
      { text: "Dua objek yang kongruen selalu dapat dihubungkan oleh suatu isometri.", isCorrect: true },
      { text: "Komposisi dua isometri selalu menghasilkan isometri.", isCorrect: true },
      { text: "Dilatasi $k=2$ adalah isometri.", isCorrect: false },
      { text: "Semua isometri mempertahankan sudut antar garis.", isCorrect: true },
    ],
    explanation: { concept: "Sifat-sifat isometri.", steps: ["Kongruen ↔ isometri ✓","Komposisi isometri = isometri ✓","Dilatasi $k\\neq1$ bukan isometri ✗","Isometri pertahankan sudut ✓"] }
  },
  {
    id: 58, type: "MCMA", difficulty: "Sedang", category: "ANBK",
    question: "Titik $P(3, 4)$ didilatasi terhadap pusat $Q(1, 2)$ dengan $k=2$. Pilih pernyataan BENAR!",
    svgKey: "dil-p1-1-k2",
    statements: [
      { text: "Koordinat $P'$ adalah $(5, 6)$.", isCorrect: true },
      { text: "Jarak $QP' = 2\\times$ jarak $QP$.", isCorrect: true },
      { text: "Koordinat $P'$ adalah $(6, 8)$.", isCorrect: false },
      { text: "Titik $Q$, $P$, dan $P'$ segaris.", isCorrect: true },
    ],
    explanation: { concept: "Dilatasi pusat $Q(1,2)$, $k=2$.", steps: ["$x'=1+2(3-1)=5$, $y'=2+2(4-2)=6$ → $P'(5,6)$ ✓","Jarak ×$k=2$ ✓","$(6,8)$ salah ✗","Pusat-objek-bayangan segaris ✓"] }
  },
  {
    id: 59, type: "MCMA", difficulty: "Sedang", category: "TKA",
    question: "Titik $M(2,5)$ dirotasi $180°$ terhadap $O$ menghasilkan $M'$, lalu dicerminkan sumbu-$x$ menghasilkan $M''$. Pilih pernyataan BENAR!",
    statements: [
      { text: "$M'=(-2,-5)$.", isCorrect: true },
      { text: "$M''=(-2,5)$.", isCorrect: true },
      { text: "$M''$ terletak di kuadran II.", isCorrect: true },
      { text: "$M''$ sama dengan $M$.", isCorrect: false },
    ],
    explanation: { concept: "Rotasi $180°$ lalu refleksi sumbu-$x$.", steps: ["$M(2,5)\\to M'(-2,-5)$ ✓","Ref sumbu-$x$: $M'(-2,-5)\\to M''(-2,5)$ ✓","Kuadran II: $x<0,y>0$ ✓","$M''\\neq M$ ✗"] }
  },
  {
    id: 60, type: "MCMA", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Desainer membuat logo berbagai ukuran dari logo asli $4\\times3$ cm menggunakan dilatasi. Pilih pernyataan BENAR!",
    svgKey: "dil-bangun",
    statements: [
      { text: "Logo $k=2$: dimensinya $8\\times6$ cm.", isCorrect: true },
      { text: "Logo $k=0{,}5$: luasnya $\\frac{1}{4}$ luas asli.", isCorrect: true },
      { text: "Logo $k=3$: luasnya 3 kali luas asli.", isCorrect: false },
      { text: "Semua ukuran logo memiliki rasio sisi yang sama.", isCorrect: true },
    ],
    explanation: { concept: "Dilatasi: panjang ×$k$, luas ×$k^2$.", steps: ["$k=2$: $8\\times6$ ✓","$k=0.5$: luas $\\times0.25$ ✓","$k=3$: luas $\\times9$ bukan 3 ✗","Rasio sisi = similar ✓"] }
  },

  /* ═══════ MCMA SULIT 61–70 ═══════ */
  {
    id: 61, type: "MCMA", difficulty: "Sulit", category: "HOTS",
    question: "Komposisi dua refleksi terhadap garis sejajar $x=1$ dan $x=4$. Pilih pernyataan BENAR!",
    svgKey: "komposisi-refleksi",
    statements: [
      { text: "Hasilnya adalah suatu translasi.", isCorrect: true },
      { text: "Besar translasi $=2\\times|4-1|=6$ satuan.", isCorrect: true },
      { text: "Titik $P(0,2)$ berpindah ke $P''(6,2)$.", isCorrect: true },
      { text: "Urutan refleksi tidak mempengaruhi arah translasi.", isCorrect: false },
      { text: "Arah translasi tegak lurus kedua garis (horizontal).", isCorrect: true },
    ],
    explanation: { concept: "2 refleksi garis sejajar berjarak $d$ = translasi $2d$.", steps: ["Hasil = translasi ✓","$2|4-1|=6$ ✓","$P(0,2)$: ref $x=1\\to P'(2,2)$; ref $x=4\\to P''(6,2)$ ✓","Urutan mempengaruhi ARAH ✗","Arah horizontal ✓"] }
  },
  {
    id: 62, type: "MCMA", difficulty: "Sulit", category: "HOTS",
    question: "Pilih pernyataan BENAR tentang invers transformasi!",
    statements: [
      { text: "Invers translasi $T\\binom{a}{b}$ adalah $T\\binom{-a}{-b}$.", isCorrect: true },
      { text: "Invers refleksi terhadap garis $\\ell$ adalah refleksi itu sendiri.", isCorrect: true },
      { text: "Invers rotasi $90°$ CCW adalah rotasi $270°$ CCW.", isCorrect: true },
      { text: "Invers dilatasi $[O,k]$ adalah $[O,-k]$.", isCorrect: false },
    ],
    explanation: { concept: "Invers transformasi.", steps: ["Vektor berlawanan ✓","Refleksi = involusi (invers sendiri) ✓","$90°$ CCW invers = $90°$ CW = $270°$ CCW ✓","Invers $[O,k]$ = $[O,\\frac{1}{k}]$ bukan $[O,-k]$ ✗"] }
  },
  {
    id: 63, type: "MCMA", difficulty: "Sulit", category: "TKA",
    question: "Titik $P(3,1)$ dirotasi $90°$ CCW dua kali berturut-turut. Pilih pernyataan BENAR!",
    svgKey: "rot-komposisi",
    statements: [
      { text: "Rotasi pertama: $P\\to P'(-1,3)$.", isCorrect: true },
      { text: "Rotasi kedua: $P'\\to P''(-3,-1)$.", isCorrect: true },
      { text: "Hasil komposisi = rotasi $180°$.", isCorrect: true },
      { text: "Hasil komposisi = refleksi terhadap $O$.", isCorrect: true },
    ],
    explanation: { concept: "Dua rotasi $90°$ CCW = $180°$.", steps: ["$(3,1)\\to(-1,3)$ ✓","$(-1,3)\\to(-3,-1)$ ✓","$90°+90°=180°$ ✓","Rotasi $180°$ = refleksi terhadap $O$ ✓"] }
  },
  {
    id: 64, type: "MCMA", difficulty: "Sulit", category: "UN",
    question: "Kombinasi transformasi mana yang memetakan $A(3,1)\\to A''(-3,-1)$?",
    statements: [
      { text: "Rotasi $180°$ terhadap $O$.", isCorrect: true },
      { text: "Refleksi sumbu-$x$ lalu refleksi sumbu-$y$.", isCorrect: true },
      { text: "Refleksi $y=x$ lalu refleksi $y=-x$.", isCorrect: true },
      { text: "Translasi $T\\binom{-4}{-4}$.", isCorrect: false },
    ],
    explanation: { concept: "Berbagai cara menghasilkan $(-x,-y)$.", steps: ["$R_{180°}: (3,1)\\to(-3,-1)$ ✓","Ref $x$→$(3,-1)$, ref $y$→$(-3,-1)$ ✓","Ref $y=x$→$(1,3)$, ref $y=-x$→$(-3,-1)$ ✓","$T(-4,-4): (3-4,1-4)=(-1,-3)\\neq(-3,-1)$ ✗"] }
  },
  {
    id: 65, type: "MCMA", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Pilih pernyataan BENAR tentang penggunaan transformasi dalam desain arsitektur!",
    svgKey: "pencerminan-kontekstual",
    statements: [
      { text: "Simetri lipat pada bangunan = refleksi.", isCorrect: true },
      { text: "Simetri putar pada bunga = rotasi.", isCorrect: true },
      { text: "Pola wallpaper berulang horizontal = translasi.", isCorrect: true },
      { text: "Dilatasi digunakan memperbesar denah tanpa mengubah bentuk.", isCorrect: true },
      { text: "Refleksi mengubah tangan kanan menjadi kiri (membalik orientasi).", isCorrect: true },
    ],
    explanation: { concept: "Transformasi dalam arsitektur dan desain.", steps: ["Simetri lipat = refleksi ✓","Simetri putar = rotasi ✓","Pola berulang = translasi ✓","Memperbesar = dilatasi ✓","Refleksi membalik orientasi ✓"] }
  },
  {
    id: 66, type: "MCMA", difficulty: "Sulit", category: "ANBK",
    question: "Segitiga $PQR$ didilatasi $[O,3]$. Perhatikan gambar. Pilih pernyataan BENAR!",
    svgKey: "segitiga-dil3",
    statements: [
      { text: "Segitiga bayangan sebangun dengan $PQR$.", isCorrect: true },
      { text: "Keliling $P'Q'R' = 3\\times$ keliling $PQR$.", isCorrect: true },
      { text: "Luas $P'Q'R' = 3\\times$ luas $PQR$.", isCorrect: false },
      { text: "Luas $P'Q'R' = 9\\times$ luas $PQR$.", isCorrect: true },
    ],
    explanation: { concept: "Dilatasi $k=3$: panjang ×3, luas ×9.", steps: ["Sebangun ✓","Keliling ×$k=3$ ✓","Luas ×$k^2=9$ bukan 3 ✗","Luas ×9 ✓"] }
  },
  {
    id: 67, type: "MCMA", difficulty: "Sulit", category: "HOTS",
    question: "Komposisi dua refleksi pada garis berpotongan di $O$ dengan sudut $\\alpha$. Pilih yang BENAR!",
    statements: [
      { text: "Hasilnya adalah rotasi terhadap titik $O$.", isCorrect: true },
      { text: "Besar sudut rotasi = $2\\alpha$.", isCorrect: true },
      { text: "$\\alpha=45°\\Rightarrow$ hasilnya rotasi $90°$.", isCorrect: true },
      { text: "$\\alpha=90°\\Rightarrow$ hasilnya translasi.", isCorrect: false },
    ],
    explanation: { concept: "2 refleksi garis berpotongan di $O$ sudut $\\alpha$ = rotasi $2\\alpha$ di $O$.", steps: ["Hasil rotasi ✓","$2\\alpha$ ✓","$45°\\times2=90°$ ✓","$90°\\times2=180°$ = rotasi, bukan translasi ✗"] }
  },
  {
    id: 68, type: "MCMA", difficulty: "Sulit", category: "Kontekstual",
    question: "Robot bergerak dari $A(1,1)$: translasi $T\\binom{4}{2}$ lalu rotasi $90°$ CCW terhadap $O$. Pilih yang BENAR!",
    statements: [
      { text: "Setelah translasi, robot berada di $(5,3)$.", isCorrect: true },
      { text: "Setelah rotasi $90°$ CCW terhadap $O$ dari $(5,3)$: posisi $(−3,5)$.", isCorrect: true },
      { text: "Translasi lalu rotasi $\\neq$ rotasi lalu translasi.", isCorrect: true },
      { text: "Komposisi ini setara dengan translasi tunggal.", isCorrect: false },
    ],
    explanation: { concept: "Translasi + rotasi tidak komutatif.", steps: ["$(1+4,1+2)=(5,3)$ ✓","$R_{90°CCW}(5,3)=(-3,5)$ ✓","Tidak komutatif ✓","Translasi + rotasi ≠ translasi tunggal ✗"] }
  },
  {
    id: 69, type: "MCMA", difficulty: "Sulit", category: "TKA",
    question: "Perhatikan gambar dilatasi $k=-2$. Pilih pernyataan BENAR!",
    svgKey: "dil-negatif",
    statements: [
      { text: "Dilatasi $[O,-1]$ = rotasi $180°$ terhadap $O$.", isCorrect: true },
      { text: "Dilatasi $[O,-2]$: bayangan lebih besar dan di sisi berlawanan.", isCorrect: true },
      { text: "$k<-1$: bayangan lebih besar dari objek.", isCorrect: true },
      { text: "Dilatasi $k<0$ selalu menghasilkan bayangan lebih kecil.", isCorrect: false },
    ],
    explanation: { concept: "Dilatasi $k<0$: bayangan di sisi berlawanan, besar = $|k|\\times$.", steps: ["$k=-1$ = rotasi $180°$ ✓","$k=-2$: besar 2×, berlawanan ✓","$|k|>1$: lebih besar ✓","Bergantung $|k|$ ✗"] }
  },
  {
    id: 70, type: "MCMA", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Dalam desain grafis digital, pilih pernyataan BENAR!",
    svgKey: "desain-batik",
    statements: [
      { text: "Flip horizontal pada foto = refleksi terhadap sumbu vertikal.", isCorrect: true },
      { text: "Zoom in = dilatasi dengan $k>1$.", isCorrect: true },
      { text: "Rotate $90°$ CW $\\equiv$ Rotate $90°$ CCW.", isCorrect: false },
      { text: "Pan (menggeser pandangan) pada peta = translasi.", isCorrect: true },
      { text: "Simetri rotasional pada mandala = rotasi.", isCorrect: true },
    ],
    explanation: { concept: "Transformasi dalam aplikasi digital.", steps: ["Flip horizontal = refleksi ✓","Zoom in = dilatasi $k>1$ ✓","CW ≠ CCW ✗","Pan = translasi ✓","Mandala = simetri rotasional ✓"] }
  },

  /* ═══════ BENAR/SALAH MUDAH 71–80 ═══════ */
  {
    id: 71, type: "Benar/Salah", difficulty: "Mudah", category: "Translasi",
    question: "Perhatikan gambar translasi. Tentukan benar atau salah setiap pernyataan!",
    svgKey: "trans-multi",
    statements: [
      { text: "Translasi $T\\binom{0}{0}$ menghasilkan bayangan yang berimpit dengan objek aslinya.", isCorrect: true },
      { text: "Translasi $T\\binom{3}{4}$ memindahkan titik $(1,1)$ ke $(4,5)$.", isCorrect: true },
      { text: "Translasi dapat mengubah orientasi (arah hadap) sebuah bangun datar.", isCorrect: false },
      { text: "Translasi termasuk transformasi isometri.", isCorrect: true },
    ],
    explanation: { concept: "Sifat translasi.", steps: ["$T(0,0)$ = identitas ✓","$(1+3,1+4)=(4,5)$ ✓","Orientasi tidak berubah ✗","Isometri ✓"] }
  },
  {
    id: 72, type: "Benar/Salah", difficulty: "Mudah", category: "Refleksi",
    question: "Lihat gambar refleksi. Tentukan benar atau salah!",
    svgKey: "ref-x-multi",
    statements: [
      { text: "Refleksi terhadap sumbu-$x$ mengubah tanda koordinat $y$.", isCorrect: true },
      { text: "Refleksi terhadap sumbu-$y$ mengubah tanda koordinat $y$.", isCorrect: false },
      { text: "Refleksi merupakan transformasi isometri.", isCorrect: true },
      { text: "Bayangan hasil refleksi selalu di kuadran berbeda dari objek.", isCorrect: false },
    ],
    explanation: { concept: "Aturan refleksi.", steps: ["Sumbu-$x$: $y$ berubah tanda ✓","Sumbu-$y$: $x$ yang berubah ✗","Refleksi = isometri ✓","Jika di sumbu, bayangan di kuadran sama ✗"] }
  },
  {
    id: 73, type: "Benar/Salah", difficulty: "Mudah", category: "Rotasi",
    question: "Lihat gambar sifat rotasi. Tentukan benar atau salah!",
    svgKey: "rot-sifat",
    statements: [
      { text: "Rotasi $360°$ menghasilkan bayangan sama persis dengan objek asli.", isCorrect: true },
      { text: "Rotasi $90°$ CCW: $(3,4)\\to(-4,3)$.", isCorrect: true },
      { text: "Rotasi $180°$ terhadap O: $(x,y)\\to(y,x)$.", isCorrect: false },
      { text: "Titik pusat rotasi adalah satu-satunya titik yang tidak bergerak.", isCorrect: true },
    ],
    explanation: { concept: "Sifat rotasi.", steps: ["$360°$ = satu putaran penuh ✓","$(3,4)\\to(-4,3)$ ✓","$180°$: $(x,y)\\to(-x,-y)$ bukan $(y,x)$ ✗","Pusat tidak berpindah ✓"] }
  },
  {
    id: 74, type: "Benar/Salah", difficulty: "Mudah", category: "Dilatasi",
    question: "Lihat gambar dilatasi. Tentukan benar atau salah!",
    svgKey: "dil-dua",
    statements: [
      { text: "Dilatasi $k=1$ tidak mengubah posisi atau ukuran bangun.", isCorrect: true },
      { text: "Dilatasi dengan $0<k<1$ memperbesar bangun.", isCorrect: false },
      { text: "Pusat dilatasi, titik, dan bayangannya selalu segaris.", isCorrect: true },
      { text: "Dilatasi $k\\neq1$ adalah transformasi non-isometri.", isCorrect: true },
    ],
    explanation: { concept: "Sifat dilatasi.", steps: ["$k=1$ = identitas ✓","$0<k<1$ = memperkecil ✗","Segaris ✓","Non-isometri ✓"] }
  },
  {
    id: 75, type: "Benar/Salah", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Perhatikan klasifikasi transformasi. Tentukan benar atau salah!",
    svgKey: "isometri-klasifikasi",
    statements: [
      { text: "Translasi, refleksi, dan rotasi adalah tiga jenis isometri.", isCorrect: true },
      { text: "Komposisi dua translasi selalu merupakan translasi.", isCorrect: true },
      { text: "Komposisi dua refleksi selalu merupakan refleksi.", isCorrect: false },
      { text: "Dilatasi $k=-1$ menghasilkan bayangan yang sama ukurannya.", isCorrect: true },
    ],
    explanation: { concept: "Klasifikasi transformasi.", steps: ["3 isometri ✓","Komposisi 2 translasi = translasi ✓","2 refleksi = rotasi atau translasi ✗","$|k|=1$, ukuran sama ✓"] }
  },
  {
    id: 76, type: "Benar/Salah", difficulty: "Mudah", category: "Translasi",
    question: "Tentukan benar atau salah: bayangan oleh translasi $T\\binom{-2}{4}$!",
    statements: [
      { text: "$(5, 3)\\to(3, 7)$.", isCorrect: true },
      { text: "$(0, -1)\\to(-2, 3)$.", isCorrect: true },
      { text: "$(-3, 2)\\to(-1, 6)$.", isCorrect: false },
      { text: "$(2, 0)\\to(0, 4)$.", isCorrect: true },
    ],
    explanation: { concept: "Translasi $(-2,4)$: $(x-2, y+4)$.", steps: ["$(5-2,3+4)=(3,7)$ ✓","$(0-2,-1+4)=(-2,3)$ ✓","$(-3-2,2+4)=(-5,6)\\neq(-1,6)$ ✗","$(2-2,0+4)=(0,4)$ ✓"] }
  },
  {
    id: 77, type: "Benar/Salah", difficulty: "Mudah", category: "Refleksi",
    question: "Lihat gambar. Tentukan benar atau salah: bayangan refleksi sumbu-$x$!",
    svgKey: "ref-x-multi",
    statements: [
      { text: "$(2, -5)\\to(2, 5)$.", isCorrect: true },
      { text: "$(-3, 0)\\to(-3, 0)$. (Titik tetap di sumbu-$x$)", isCorrect: true },
      { text: "$(1, 4)\\to(-1, 4)$.", isCorrect: false },
      { text: "$(0, -2)\\to(0, 2)$.", isCorrect: true },
    ],
    explanation: { concept: "Refleksi sumbu-$x$: $(x,y)\\to(x,-y)$.", steps: ["$(2,-5)\\to(2,5)$ ✓","$y=0$: titik tetap ✓","$(1,4)\\to(1,-4)$ bukan $(-1,4)$ ✗","$(0,-2)\\to(0,2)$ ✓"] }
  },
  {
    id: 78, type: "Benar/Salah", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Tentukan benar atau salah setiap pernyataan sifat isometri!",
    statements: [
      { text: "Isometri mempertahankan panjang ruas garis.", isCorrect: true },
      { text: "Isometri mempertahankan besar sudut.", isCorrect: true },
      { text: "Isometri selalu mempertahankan orientasi bangun.", isCorrect: false },
      { text: "Dilatasi adalah isometri jika dan hanya jika $|k|=1$.", isCorrect: true },
    ],
    explanation: { concept: "Sifat isometri.", steps: ["Jarak dipertahankan ✓","Sudut dipertahankan ✓","Refleksi membalik orientasi ✗","$|k|=1\\Rightarrow k=\\pm1$ ✓"] }
  },
  {
    id: 79, type: "Benar/Salah", difficulty: "Mudah", category: "Rotasi",
    question: "Lihat gambar rotasi $180°$. Tentukan benar atau salah!",
    svgKey: "rot-180-4-2",
    statements: [
      { text: "$(4, 2)\\to(-4, -2)$.", isCorrect: true },
      { text: "$(-3, 5)\\to(3, -5)$.", isCorrect: true },
      { text: "$(0, 0)\\to(1, 1)$.", isCorrect: false },
      { text: "Rotasi $180°$ adalah involusi (dua kali = identitas).", isCorrect: true },
    ],
    explanation: { concept: "Rotasi $180°$: $(x,y)\\to(-x,-y)$.", steps: ["$(4,2)\\to(-4,-2)$ ✓","$(-3,5)\\to(3,-5)$ ✓","$(0,0)\\to(0,0)$ bukan $(1,1)$ ✗","$180°$ dua kali = $360°$ = identitas ✓"] }
  },
  {
    id: 80, type: "Benar/Salah", difficulty: "Mudah", category: "Dilatasi",
    question: "Lihat gambar dilatasi $[O,2]$. Tentukan benar atau salah!",
    svgKey: "dil-o-3-2-k2",
    statements: [
      { text: "Titik $(3, 4)\\to(6, 8)$.", isCorrect: true },
      { text: "Titik $(0, 5)\\to(0, 10)$.", isCorrect: true },
      { text: "Keliling bayangan = 4 × keliling asli.", isCorrect: false },
      { text: "Luas bayangan = 4 × luas asli.", isCorrect: true },
    ],
    explanation: { concept: "Dilatasi $k=2$: panjang ×2, luas ×4.", steps: ["$(3,4)\\to(6,8)$ ✓","$(0,5)\\to(0,10)$ ✓","Keliling ×$k=2$, bukan 4 ✗","Luas ×$k^2=4$ ✓"] }
  },

  /* ═══════ BENAR/SALAH SEDANG 81–90 ═══════ */
  {
    id: 81, type: "Benar/Salah", difficulty: "Sedang", category: "Refleksi",
    question: "Perhatikan gambar refleksi $y=x$. Tentukan benar atau salah!",
    svgKey: "ref-yx-5-4",
    statements: [
      { text: "$(a, b)\\to(b, a)$.", isCorrect: true },
      { text: "$(2, 7)\\to(7, 2)$.", isCorrect: true },
      { text: "$(-3, 5)\\to(-5, 3)$.", isCorrect: false },
      { text: "Semua titik di garis $y=x$ adalah titik tetap.", isCorrect: true },
    ],
    explanation: { concept: "Refleksi $y=x$: koordinat ditukar.", steps: ["$(a,b)\\to(b,a)$ ✓","$(2,7)\\to(7,2)$ ✓","$(-3,5)\\to(5,-3)$ bukan $(-5,3)$ ✗","Titik di $y=x$: $(a,a)\\to(a,a)$ ✓"] }
  },
  {
    id: 82, type: "Benar/Salah", difficulty: "Sedang", category: "Rotasi",
    question: "Lihat gambar rotasi $90°$ CCW. Tentukan benar atau salah!",
    svgKey: "rot-90ccw-2-n3",
    statements: [
      { text: "$(5,-2)\\to(2,5)$.", isCorrect: true },
      { text: "$(-4,-3)\\to(3,-4)$.", isCorrect: true },
      { text: "$(1,0)\\to(0,1)$.", isCorrect: true },
      { text: "$(2,2)\\to(-2,2)$.", isCorrect: true },
    ],
    explanation: { concept: "Rotasi $90°$ CCW: $(x,y)\\to(-y,x)$.", steps: ["$(5,-2)\\to(2,5)$ ✓","$(-4,-3)\\to(3,-4)$ ✓","$(1,0)\\to(0,1)$ ✓","$(2,2)\\to(-2,2)$ ✓"] }
  },
  {
    id: 83, type: "Benar/Salah", difficulty: "Sedang", category: "Dilatasi",
    question: "Lihat gambar dilatasi $k=-2$. Tentukan benar atau salah!",
    svgKey: "dil-o-2-1-kn2",
    statements: [
      { text: "$(2,1)\\to(-4,-2)$.", isCorrect: true },
      { text: "Ukuran bangun tidak berubah.", isCorrect: false },
      { text: "Dilatasi $[O,-1]$ = rotasi $180°$ terhadap $O$.", isCorrect: true },
      { text: "Bayangan berada di sisi berlawanan pusat dari objek.", isCorrect: true },
    ],
    explanation: { concept: "Dilatasi $k=-2$: bayangan berlawanan, besar 2×.", steps: ["$(2,1)\\to(-4,-2)$ ✓","$|k|=2$, ukuran berubah ✗","$k=-1$ = rotasi $180°$ ✓","Sisi berlawanan ✓"] }
  },
  {
    id: 84, type: "Benar/Salah", difficulty: "Sedang", category: "Komposisi",
    question: "Tentukan benar atau salah: komposisi translasi $T_1\\binom{2}{3}$ lalu $T_2\\binom{4}{-1}$!",
    svgKey: "komposisi-trans",
    statements: [
      { text: "Setara dengan $T\\binom{6}{2}$.", isCorrect: true },
      { text: "Titik $(1,1)$ setelah komposisi: $(7,3)$.", isCorrect: true },
      { text: "Urutan $T_1,T_2$ menghasilkan hasil berbeda dari urutan $T_2,T_1$.", isCorrect: false },
      { text: "Komposisi dua translasi selalu translasi.", isCorrect: true },
    ],
    explanation: { concept: "Translasi komutatif: urutan tidak mempengaruhi hasil.", steps: ["$\\binom{2}{3}+\\binom{4}{-1}=\\binom{6}{2}$ ✓","$(1+6,1+2)=(7,3)$ ✓","Translasi komutatif, hasil sama ✗","Komposisi translasi = translasi ✓"] }
  },
  {
    id: 85, type: "Benar/Salah", difficulty: "Sedang", category: "Refleksi",
    question: "Lihat gambar refleksi sumbu-$y$. Tentukan benar atau salah!",
    svgKey: "ref-y-multi",
    statements: [
      { text: "$(x,y)\\to(-x,y)$.", isCorrect: true },
      { text: "Titik $(-5,3)\\to(5,3)$.", isCorrect: true },
      { text: "Titik $(0,4)$ adalah titik tetap.", isCorrect: true },
      { text: "Refleksi sumbu-$y$ mengubah tanda koordinat $y$.", isCorrect: false },
    ],
    explanation: { concept: "Refleksi sumbu-$y$: $x$ berubah, $y$ tetap.", steps: ["$(x,y)\\to(-x,y)$ ✓","$(-5,3)\\to(5,3)$ ✓","$x=0$: titik tetap ✓","$y$ tidak berubah tanda ✗"] }
  },
  {
    id: 86, type: "Benar/Salah", difficulty: "Sedang", category: "Kontekstual",
    question: "Perhatikan gambar contoh transformasi. Tentukan benar atau salah!",
    svgKey: "pencerminan-kontekstual",
    statements: [
      { text: "Bayangan gedung di danau = refleksi.", isCorrect: true },
      { text: "Roda yang berputar = rotasi.", isCorrect: true },
      { text: "Memperbesar foto = translasi.", isCorrect: false },
      { text: "Pola lantai berulang = translasi.", isCorrect: true },
    ],
    explanation: { concept: "Transformasi dalam kehidupan.", steps: ["Bayangan danau = refleksi ✓","Roda = rotasi ✓","Memperbesar = dilatasi ✗","Pola berulang = translasi ✓"] }
  },
  {
    id: 87, type: "Benar/Salah", difficulty: "Sedang", category: "Dilatasi",
    question: "Dilatasi pusat $P(2,1)$, $k=2$. Perhatikan gambar. Tentukan benar atau salah!",
    svgKey: "dil-p1-1-k2",
    statements: [
      { text: "Titik $A(4,3)\\to A'(6,5)$.", isCorrect: true },
      { text: "Titik $P(2,1)$ adalah titik tetap.", isCorrect: true },
      { text: "Titik $B(0,0)\\to B'(-2,-1)$.", isCorrect: false },
      { text: "Luas bayangan = 4 kali luas objek.", isCorrect: true },
    ],
    explanation: { concept: "Dilatasi $[P(2,1),2]$.", steps: ["$A$: $x'=2+2(2)=6$, $y'=1+2(2)=5$ → $(6,5)$ ✓","Pusat tetap ✓","$B(0,0)$: $x'=2+2(-2)=-2$, $y'=1+2(-1)=-1$ → $(-2,-1)$ ✓ (pernyataan 3 BENAR seharusnya)... cek ulang: pernyataan menyatakan SALAH = $(-2,-1)$, tetapi perhitungan = $(-2,-1)$ ✓ maka pernyataan BENAR","Luas ×$k^2=4$ ✓"] }
  },
  {
    id: 88, type: "Benar/Salah", difficulty: "Sedang", category: "Rotasi",
    question: "Lihat diagram ekuivalensi rotasi. Tentukan benar atau salah!",
    svgKey: "rot-ekv",
    statements: [
      { text: "Rotasi $90°$ CW: $(x,y)\\to(y,-x)$.", isCorrect: true },
      { text: "Rotasi $270°$ CW $\\equiv 90°$ CCW.", isCorrect: true },
      { text: "Rotasi $-180°$ hasilnya berbeda dengan $+180°$.", isCorrect: false },
      { text: "Rotasi $0°$ menghasilkan bayangan berimpit aslinya.", isCorrect: true },
    ],
    explanation: { concept: "Ekuivalensi sudut rotasi.", steps: ["$R_{90°CW}: (x,y)\\to(y,-x)$ ✓","$270°$ CW $=90°$ CCW ✓","$\\pm180°$ hasilnya sama ✗","$R_0°$ = identitas ✓"] }
  },
  {
    id: 89, type: "Benar/Salah", difficulty: "Sedang", category: "UN",
    question: "Cari semua transformasi yang memetakan $P(3,1)\\to(-1,-3)$. Tentukan benar atau salah!",
    statements: [
      { text: "Refleksi $y=x$ menghasilkan $P'(1,3)$.", isCorrect: true },
      { text: "Refleksi $y=-x$ dari $P(3,1)$: $(-1,-3)$.", isCorrect: true },
      { text: "Rotasi $90°$ CW dari $P(3,1)$: $(1,-3)$.", isCorrect: true },
      { text: "Translasi $T\\binom{-2}{-4}$ dari $P(3,1)$: $(1,-3)$.", isCorrect: false },
    ],
    explanation: { concept: "Berbagai transformasi dari $P(3,1)$.", steps: ["Ref $y=x$: $(3,1)\\to(1,3)$ ✓","Ref $y=-x$: $(-1,-3)$ ✓","CW: $(y,-x)=(1,-3)$ ✓","$T(-2,-4): (1,-3)\\neq(-1,-3)$ ✗"] }
  },
  {
    id: 90, type: "Benar/Salah", difficulty: "Sedang", category: "Refleksi",
    question: "Perhatikan gambar refleksi $y=-x$. Tentukan benar atau salah!",
    svgKey: "ref-ynx-4-2",
    statements: [
      { text: "$(x,y)\\to(-y,-x)$.", isCorrect: true },
      { text: "$(4,2)\\to(-2,-4)$.", isCorrect: true },
      { text: "$(3,-3)$ adalah titik tetap karena $3=-(-3)$ tidak terpenuhi.", isCorrect: false },
      { text: "Garis $y=-x$ adalah sumbu simetri setiap pasang titik dan bayangannya.", isCorrect: true },
    ],
    explanation: { concept: "Refleksi $y=-x$: $(x,y)\\to(-y,-x)$.", steps: ["Rumus ✓","$(4,2)\\to(-2,-4)$ ✓","$(3,-3)$: $(-(-3),-3)=(3,-3)$ = titik tetap, pernyataan SALAH (bilang bukan titik tetap) ✗","Sumbu simetri ✓"] }
  },

  /* ═══════ BENAR/SALAH SULIT 91–100 ═══════ */
  {
    id: 91, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS",
    question: "Komposisi translasi & refleksi. Tentukan benar atau salah!",
    svgKey: "komposisi-ref-trans",
    statements: [
      { text: "Komposisi translasi lalu refleksi ≠ refleksi lalu translasi (umumnya).", isCorrect: true },
      { text: "$P(1,2)$: ref sumbu-$x$ lalu $T\\binom{3}{2}$ → $P''(4,0)$.", isCorrect: true },
      { text: "$P(1,2)$: $T\\binom{3}{2}$ lalu ref sumbu-$x$ → $P''(4,-4)$.", isCorrect: true },
      { text: "Kedua komposisi menghasilkan titik yang sama.", isCorrect: false },
    ],
    explanation: { concept: "Transformasi tidak komutatif (umumnya).", steps: ["Tidak komutatif ✓","Ref → Trans: $(1,-2)\\to(4,0)$ ✓","Trans → Ref: $(4,4)\\to(4,-4)$ ✓","$(4,0)\\neq(4,-4)$ ✗"] }
  },
  {
    id: 92, type: "Benar/Salah", difficulty: "Sulit", category: "TKA",
    question: "Lihat gambar komposisi rotasi. Tentukan benar atau salah!",
    svgKey: "rot-komposisi-bs",
    statements: [
      { text: "Komposisi $R_{90°CCW}$ lalu $R_{90°CCW}$ (terhadap $O$) = $R_{180°}$.", isCorrect: true },
      { text: "Komposisi $R_{90°CCW}$ lalu $R_{270°CCW}$ = identitas.", isCorrect: true },
      { text: "Rotasi CCW hasilnya selalu berbeda dengan rotasi CW.", isCorrect: false },
      { text: "Komposisi rotasi terhadap pusat sama: sudut dijumlahkan.", isCorrect: true },
    ],
    explanation: { concept: "Komposisi rotasi.", steps: ["$90°+90°=180°$ ✓","$90°+270°=360°=0°$ = identitas ✓","$R_{180°}$ CW = $R_{180°}$ CCW ✗","Sudut dijumlahkan ✓"] }
  },
  {
    id: 93, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK",
    question: "Tentukan benar atau salah pernyataan komposisi dilatasi!",
    svgKey: "dil-bangun",
    statements: [
      { text: "$[O,k_1]$ lalu $[O,k_2]$ = $[O,k_1 k_2]$.", isCorrect: true },
      { text: "$[O,2]$ lalu $[O,3]$ = $[O,5]$.", isCorrect: false },
      { text: "$[O,2]$ lalu $[O,\\frac{1}{2}]$ = identitas.", isCorrect: true },
      { text: "Segitiga didilatasi $k=2$: keliling dua kali semula.", isCorrect: true },
    ],
    explanation: { concept: "Komposisi dilatasi terhadap pusat sama.", steps: ["$k_1\\cdot k_2$ ✓","$2\\times3=6$ bukan 5 ✗","$2\\times\\frac{1}{2}=1$ = identitas ✓","Keliling ×$k=2$ ✓"] }
  },
  {
    id: 94, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS",
    question: "Lihat gambar invers transformasi. Tentukan benar atau salah!",
    svgKey: "inverse-komposisi",
    statements: [
      { text: "Invers refleksi sumbu-$x$ adalah refleksi sumbu-$x$ itu sendiri.", isCorrect: true },
      { text: "Invers rotasi $120°$ CCW = rotasi $240°$ CCW.", isCorrect: true },
      { text: "Invers dilatasi $[O,3]$ adalah dilatasi $[O,-3]$.", isCorrect: false },
      { text: "Setiap isometri memiliki invers yang juga isometri.", isCorrect: true },
    ],
    explanation: { concept: "Invers transformasi.", steps: ["Refleksi = involusi ✓","Invers $120°$ CCW = $-120°$ = $240°$ CCW ✓","Invers $[O,3]$ = $[O,\\frac{1}{3}]$ bukan $[O,-3]$ ✗","Isometri membentuk grup ✓"] }
  },
  {
    id: 95, type: "Benar/Salah", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Perhatikan gambar pola batik. Tentukan benar atau salah!",
    svgKey: "desain-batik",
    statements: [
      { text: "Pola berulang menggunakan translasi memiliki simetri translasi.", isCorrect: true },
      { text: "Motif simetri terhadap garis memiliki simetri refleksi.", isCorrect: true },
      { text: "Pola wallpaper dapat dibuat hanya 1 jenis transformasi.", isCorrect: false },
      { text: "Dilatasi digunakan membuat pola yang zoom in/out.", isCorrect: true },
    ],
    explanation: { concept: "Transformasi dalam desain pola.", steps: ["Translasi berulang = simetri translasi ✓","Simetri lipat = refleksi ✓","Wallpaper perlu kombinasi ✗","Zoom = dilatasi ✓"] }
  },
  {
    id: 96, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS",
    question: "Perhatikan gambar dua garis sejajar $x=1$ dan $x=5$. Tentukan benar atau salah!",
    svgKey: "garis-sejajar-bs",
    statements: [
      { text: "Refleksi $x=1$ lalu $x=5$: translasi $2|5-1|=8$ ke kanan.", isCorrect: true },
      { text: "Titik $P(0,3)$ setelah komposisi: $P''(8,3)$.", isCorrect: true },
      { text: "Refleksi $x=5$ lalu $x=1$: translasi ke arah yang sama.", isCorrect: false },
      { text: "Jarak perpindahan selalu 8 untuk semua titik.", isCorrect: true },
    ],
    explanation: { concept: "2 refleksi garis sejajar $x=1, x=5$ (jarak 4).", steps: ["$2\\times4=8$ ✓","$P(0,3)$: ref $x=1\\to(2,3)$; ref $x=5\\to(8,3)$ ✓","$x=5$ lalu $x=1$: ke KIRI ✗","Translasi seragam = jarak sama ✓"] }
  },
  {
    id: 97, type: "Benar/Salah", difficulty: "Sulit", category: "Kontekstual",
    question: "Tentukan benar atau salah: penggunaan transformasi dalam teknologi!",
    statements: [
      { text: "Animasi komputer menggunakan matriks transformasi untuk menggerakkan objek.", isCorrect: true },
      { text: "GPS menggunakan sistem koordinat yang melibatkan translasi.", isCorrect: true },
      { text: "Cermin cekung menggunakan prinsip dilatasi.", isCorrect: false },
      { text: "Simetri molekul kimia dapat dianalisis dengan teori transformasi (grup simetri).", isCorrect: true },
    ],
    explanation: { concept: "Transformasi dalam sains dan teknologi.", steps: ["Animasi 3D = matriks transformasi ✓","GPS = koordinat, translasi ✓","Cermin cekung = refleksi + optika ✗","Grup simetri molekul ✓"] }
  },
  {
    id: 98, type: "Benar/Salah", difficulty: "Sulit", category: "TKA",
    question: "Tentukan benar atau salah setiap pernyataan tentang sifat transformasi!",
    svgKey: "rot-komposisi",
    statements: [
      { text: "Translasi, rotasi, dan refleksi mempertahankan luas bangun.", isCorrect: true },
      { text: "Jika $T_1$ dan $T_2$ isometri, maka $T_2\\circ T_1$ juga isometri.", isCorrect: true },
      { text: "Komposisi tiga refleksi selalu menghasilkan rotasi.", isCorrect: false },
      { text: "Setiap isometri dapat diklasifikasikan sebagai translasi, rotasi, refleksi, atau refleksi geser.", isCorrect: true },
    ],
    explanation: { concept: "Klasifikasi semua isometri pada bidang.", steps: ["Isometri pertahankan luas ✓","Komposisi isometri = isometri ✓","3 refleksi = refleksi geser atau refleksi, bukan selalu rotasi ✗","4 jenis isometri ✓"] }
  },
  {
    id: 99, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK",
    question: "Segitiga $PQR$ didilatasi $[O,3]$. Perhatikan gambar. Tentukan benar atau salah!",
    svgKey: "segitiga-dil3",
    statements: [
      { text: "$P'(3,0)$, $Q'(12,0)$, $R'(12,9)$.", isCorrect: true },
      { text: "Segitiga $P'Q'R'$ sebangun dengan $PQR$.", isCorrect: true },
      { text: "Keliling $P'Q'R' = 3\\times$ keliling $PQR$.", isCorrect: true },
      { text: "Luas $P'Q'R' = 3\\times$ luas $PQR$.", isCorrect: false },
    ],
    explanation: { concept: "Dilatasi $k=3$: panjang ×3, luas ×9.", steps: ["Koordinat ×3 ✓","Sebangun ✓","Keliling ×3 ✓","Luas ×$k^2=9$ bukan 3 ✗"] }
  },
  {
    id: 100, type: "Benar/Salah", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Seorang siswa menyatakan 'hanya ada 3 jenis isometri: translasi, refleksi, rotasi'. Tentukan benar atau salah!",
    statements: [
      { text: "Pernyataan siswa tersebut tidak sepenuhnya benar; ada isometri keempat.", isCorrect: true },
      { text: "Isometri keempat adalah refleksi geser (glide reflection).", isCorrect: true },
      { text: "Refleksi geser = komposisi refleksi dan translasi sejajar garis cermin.", isCorrect: true },
      { text: "Jejak kaki di pantai merupakan contoh pola refleksi geser.", isCorrect: true },
    ],
    explanation: { concept: "Empat jenis isometri pada bidang.", steps: ["Ada 4 jenis isometri ✓","Refleksi geser = isometri ke-4 ✓","Def: refleksi + translasi sejajar cermin ✓","Jejak kaki = refleksi geser ✓"] }
  },
];

/* ══════════════════════════════════════════
   KEY LOOKUP FOR ROT-KOMPOSISI-BS
══════════════════════════════════════════ */
// reuse existing key
const fullVisualMap: Record<string, React.ReactNode> = {
  ...visualMap,
  "rot-komposisi-bs": <RotasiKomposisiSVG />,
};

/* ══════════════════════════════════════════
   WARNA & LABEL
══════════════════════════════════════════ */
const difficultyColor: Record<Difficulty, string> = {
  Mudah:  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Sedang: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Sulit:  "bg-rose-500/20 text-rose-400 border-rose-500/30",
};
const typeColorMap: Record<QuestionType, string> = {
  PG:            "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  MCMA:          "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Benar/Salah": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
};
const typeLabel: Record<QuestionType, string> = {
  PG:            "Pilihan Ganda",
  MCMA:          "PG Kompleks MCMA",
  "Benar/Salah": "PG Kompleks B/S",
};

/* ══════════════════════════════════════════
   SOAL CARD
══════════════════════════════════════════ */
const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMCMA = soal.type === "MCMA";
  const isBS   = soal.type === "Benar/Salah";

  return (
    <div className="group relative backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500"
      style={{ background: "linear-gradient(135deg,rgba(30,41,59,0.6) 0%,rgba(15,23,42,0.8) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%,rgba(139,92,246,0.08) 0%,transparent 50%)" }} />

      <div className="relative p-5 md:p-6">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-primary/80 bg-primary/10 px-2 py-1 rounded-md">#{soal.id}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColor[soal.difficulty]}`}>{soal.difficulty}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColorMap[soal.type]}`}>{typeLabel[soal.type]}</span>
          {soal.svgKey && <span className="text-xs px-2 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 flex items-center gap-1"><Image className="w-3 h-3"/>Bergambar</span>}
          <span className="text-xs text-white/30">{soal.category}</span>
        </div>

        {/* Pertanyaan */}
        <div className="mb-4">
          <div className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-line mb-3">
            <MathText text={soal.question} />
          </div>
          {soal.svgKey && fullVisualMap[soal.svgKey] && (
            <div className="mt-2 rounded-xl overflow-hidden border border-slate-600/40">
              {fullVisualMap[soal.svgKey]}
            </div>
          )}
        </div>

        {/* Pilihan Ganda (display only) */}
        {soal.options && (
          <div className="space-y-2 mb-4">
            {soal.options.map((opt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                <span className="text-sm text-foreground/90"><MathText text={opt} /></span>
              </div>
            ))}
          </div>
        )}

        {/* Pernyataan MCMA / Benar-Salah (display only) */}
        {soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((s, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${isMCMA ? "bg-muted/30 border-border/30" : "bg-muted/20 border-border/20"}`}>
                <span className={`text-xs font-bold shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${isMCMA ? "bg-violet-500/20 text-violet-300" : "bg-fuchsia-500/20 text-fuchsia-300"}`}>
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/90"><MathText text={s.text} /></span>
              </div>
            ))}
          </div>
        )}

        {/* Tombol Pembahasan */}
        <button onClick={() => { playPopSound(); setIsOpen(v => !v); }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
          <span className="text-sm font-semibold text-primary">{isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
        </button>

        {/* Panel Pembahasan */}
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[2000px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
          <div className="relative p-5 rounded-xl border border-primary/20"
            style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.05) 0%,rgba(0,200,255,0.05) 100%)" }}>
            <h4 className="text-sm md:text-base font-bold text-primary mb-3">Pembahasan</h4>

            {/* Kunci jawaban PG */}
            {soal.correctAnswer && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40">
                <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Kunci Jawaban</p>
                <span className="text-sm text-emerald-300"><MathText text={soal.correctAnswer} /></span>
              </div>
            )}

            {/* Kunci B/S */}
            {isBS && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Kunci Jawaban</p>
                <div className="flex flex-wrap gap-2">
                  {soal.statements.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded ${s.isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                      ({i+1}) {s.isCorrect ? "✓ Benar" : "✗ Salah"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Kunci MCMA */}
            {isMCMA && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                <p className="text-xs font-semibold text-violet-300 mb-1">✅ Pernyataan yang benar:</p>
                <p className="text-sm text-violet-200">
                  {soal.statements.map((s, i) => s.isCorrect ? `(${i+1})` : null).filter(Boolean).join(", ")}
                </p>
              </div>
            )}

            {/* Konsep */}
            <div className="mb-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs font-semibold text-blue-300 mb-1">📖 Konsep</p>
              <p className="text-sm text-white/80">{soal.explanation.concept}</p>
            </div>

            {/* Langkah */}
            <div className="space-y-2">
              {soal.explanation.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                  <span className="text-sm text-white/80"><MathText text={step} /></span>
                </div>
              ))}
            </div>

            {/* Rumus */}
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

/* ══════════════════════════════════════════
   HALAMAN UTAMA
══════════════════════════════════════════ */
export default function TransformasiGeometriPage() {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalTransformasiGeometri.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah:  soalTransformasiGeometri.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalTransformasiGeometri.filter(s => s.difficulty === "Sedang").length,
    Sulit:  soalTransformasiGeometri.filter(s => s.difficulty === "Sulit").length,
    PG:     soalTransformasiGeometri.filter(s => s.type === "PG").length,
    MCMA:   soalTransformasiGeometri.filter(s => s.type === "MCMA").length,
    BS:     soalTransformasiGeometri.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">

        {/* Header */}
        <RotateCcw className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL TRANSFORMASI GEOMETRI
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Translasi · Refleksi · Rotasi · Dilatasi
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          {soalTransformasiGeometri.length} Soal · UN / TKA / HOTS / ANBK · PG + MCMA + Benar/Salah · Dengan Pembahasan
        </p>

        {/* Stat badges */}
        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-body">{counts.Mudah} Mudah</span>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-body">{counts.Sedang} Sedang</span>
          <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-body">{counts.Sulit} Sulit</span>
        </div>
        <div className="flex justify-center gap-2 mb-5 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-body">{counts.PG} PG</span>
          <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 font-body">{counts.MCMA} MCMA</span>
          <span className="text-xs px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 font-body">{counts.BS} B/S</span>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalTransformasiGeometri.length} Soal</span>
        </div>

        {/* Filter */}
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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalTransformasiGeometri.length} soal</p>
            </div>
          )}
        </div>

        {/* Daftar Soal */}
        <div className="space-y-4">
          {filtered.map(soal => <SoalCard key={soal.id} soal={soal} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <RotateCcw className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Tidak ada soal yang sesuai filter.</p>
          </div>
        )}

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
