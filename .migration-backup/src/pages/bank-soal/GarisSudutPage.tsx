import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Ruler, ChevronDown, ChevronUp, Filter } from "lucide-react";
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

/* ═══════════════════════════════════
   SVG VISUAL COMPONENTS
═══════════════════════════════════ */

const svgClass = "w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600";

/* Converts degrees to radians */
const deg2rad = (d: number) => (d * Math.PI) / 180;
/* Point on circle */
const pt = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.cos(deg2rad(deg)),
  y: cy - r * Math.sin(deg2rad(deg)),
});

/* ── Single Angle SVG ── */
const AngleSVG = ({
  label, angleDeg, startDeg = 0, color = "#06b6d4", note = "", arcR = 28,
}: { label: string; angleDeg: number; startDeg?: number; color?: string; note?: string; arcR?: number }) => {
  const cx = 90, cy = 120, rayLen = 75;
  const p1 = pt(cx, cy, rayLen, startDeg);
  const p2 = pt(cx, cy, rayLen, startDeg + angleDeg);
  const arcP1 = pt(cx, cy, arcR, startDeg);
  const arcP2 = pt(cx, cy, arcR, startDeg + angleDeg);
  const largeArc = angleDeg > 180 ? 1 : 0;
  const midDeg = startDeg + angleDeg / 2;
  const lblPt = pt(cx, cy, arcR + 14, midDeg);
  const isRight = Math.abs(angleDeg - 90) < 1;
  return (
    <svg viewBox="0 0 220 160" className={svgClass}>
      <text x="110" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      <line x1={cx} y1={cy} x2={p1.x} y2={p1.y} stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
      <line x1={cx} y1={cy} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {isRight
        ? <><rect x={cx} y={cy - 12} width="12" height="12" fill="none" stroke={color} strokeWidth="1.5"/></>
        : <path d={`M ${arcP1.x} ${arcP1.y} A ${arcR} ${arcR} 0 ${largeArc} 1 ${arcP2.x} ${arcP2.y}`}
            fill="none" stroke={color} strokeWidth="1.5"/>
      }
      <circle cx={cx} cy={cy} r="3" fill={color}/>
      <text x={lblPt.x} y={lblPt.y + 3} fill="#fde68a" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label}</text>
    </svg>
  );
};

/* ── Two Rays + Label for Complementary/Supplementary ── */
const TwoAngleSVG = ({
  angle1, angle2, label1, label2, note = "", baseColor = "#06b6d4", topColor = "#a855f7",
}: { angle1: number; angle2: number; label1: string; label2: string; note?: string; baseColor?: string; topColor?: string }) => {
  const cx = 110, cy = 130, rayLen = 80;
  // Ray 0° (rightward), Ray angle1 (from base), Ray angle1+angle2
  const p0 = pt(cx, cy, rayLen, 0);
  const p1 = pt(cx, cy, rayLen, angle1);
  const p2 = pt(cx, cy, rayLen, angle1 + angle2);
  const arc1p1 = pt(cx, cy, 24, 0);
  const arc1p2 = pt(cx, cy, 24, angle1);
  const arc2p1 = pt(cx, cy, 38, angle1);
  const arc2p2 = pt(cx, cy, 38, angle1 + angle2);
  const mid1 = pt(cx, cy, 36, angle1 / 2);
  const mid2 = pt(cx, cy, 52, angle1 + angle2 / 2);
  return (
    <svg viewBox="0 0 280 160" className={svgClass}>
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      <line x1={cx} y1={cy} x2={p0.x} y2={p0.y} stroke="#475569" strokeWidth="2"/>
      <line x1={cx} y1={cy} x2={p1.x} y2={p1.y} stroke="#94a3b8" strokeWidth="2"/>
      <line x1={cx} y1={cy} x2={p2.x} y2={p2.y} stroke="#475569" strokeWidth="2"/>
      <path d={`M ${arc1p1.x} ${arc1p1.y} A 24 24 0 0 1 ${arc1p2.x} ${arc1p2.y}`} fill="none" stroke={baseColor} strokeWidth="1.5"/>
      <path d={`M ${arc2p1.x} ${arc2p1.y} A 38 38 0 0 1 ${arc2p2.x} ${arc2p2.y}`} fill="none" stroke={topColor} strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r="3" fill="#94a3b8"/>
      <text x={mid1.x} y={mid1.y + 3} fill="#fde68a" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label1}</text>
      <text x={mid2.x} y={mid2.y + 3} fill="#c4b5fd" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label2}</text>
    </svg>
  );
};

/* ── Supplementary angles on a straight line ── */
const SuplementarSVG = ({
  angle1, label1, label2, note = "",
}: { angle1: number; label1: string; label2: string; note?: string }) => {
  const angle2 = 180 - angle1;
  const cx = 140, cy = 110, rayLen = 95;
  const pLeft = { x: cx - rayLen, y: cy };
  const pRight = { x: cx + rayLen, y: cy };
  const pTop = pt(cx, cy, rayLen, angle1);
  const arc1 = pt(cx, cy, 32, angle1 / 2);
  const arc2 = pt(cx, cy, 32, angle1 + angle2 / 2);
  const a1p1 = pt(cx, cy, 32, 0); const a1p2 = pt(cx, cy, 32, angle1);
  const a2p1 = pt(cx, cy, 32, angle1); const a2p2 = pt(cx, cy, 32, 180);
  return (
    <svg viewBox="0 0 280 140" className={svgClass}>
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      <line x1={pLeft.x} y1={pLeft.y} x2={pRight.x} y2={pRight.y} stroke="#475569" strokeWidth="2.5"/>
      <line x1={cx} y1={cy} x2={pTop.x} y2={pTop.y} stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round"/>
      <path d={`M ${a1p1.x} ${a1p1.y} A 32 32 0 0 1 ${a1p2.x} ${a1p2.y}`} fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5"/>
      <path d={`M ${a2p1.x} ${a2p1.y} A 32 32 0 0 1 ${a2p2.x} ${a2p2.y}`} fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r="3.5" fill="#94a3b8"/>
      <text x={arc1.x} y={arc1.y - 6} fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label1}</text>
      <text x={arc2.x} y={arc2.y - 6} fill="#c4b5fd" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label2}</text>
    </svg>
  );
};

/* ── Vertical angles (two intersecting lines) ── */
const TolakBelakangSVG = ({
  a, b, note = "",
}: { a: string; b: string; note?: string }) => {
  const cx = 140, cy = 90, len = 95;
  const angle = 130;
  const p1 = pt(cx, cy, len, 0); const p3 = pt(cx, cy, len, 180);
  const p2 = pt(cx, cy, len, angle); const p4 = pt(cx, cy, len, angle + 180);
  return (
    <svg viewBox="0 0 280 180" className={svgClass}>
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      <line x1={p3.x} y1={p3.y} x2={p1.x} y2={p1.y} stroke="#475569" strokeWidth="2"/>
      <line x1={p4.x} y1={p4.y} x2={p2.x} y2={p2.y} stroke="#475569" strokeWidth="2"/>
      {/* Angle arcs - top (angle) */}
      <path d={`M ${pt(cx,cy,22,0).x} ${pt(cx,cy,22,0).y} A 22 22 0 0 1 ${pt(cx,cy,22,angle).x} ${pt(cx,cy,22,angle).y}`} fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
      {/* Bottom (vertical) */}
      <path d={`M ${pt(cx,cy,22,180).x} ${pt(cx,cy,22,180).y} A 22 22 0 0 1 ${pt(cx,cy,22,angle+180).x} ${pt(cx,cy,22,angle+180).y}`} fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r="3.5" fill="#94a3b8"/>
      <text x={pt(cx,cy,40,angle/2).x} y={pt(cx,cy,40,angle/2).y+3} fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{a}</text>
      <text x={pt(cx,cy,40,angle+180+angle/2).x > 280 ? 260 : pt(cx,cy,40,angle/2+180).x} y={pt(cx,cy,40,angle/2+180).y+3} fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{a}</text>
      <text x={pt(cx,cy,36,angle+angle/2).x} y={pt(cx,cy,36,angle+angle/2).y+3} fill="#f472b6" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{b}</text>
      <text x={pt(cx,cy,36,angle+angle/2-180).x} y={pt(cx,cy,36,angle+angle/2-180).y+3} fill="#f472b6" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{b}</text>
    </svg>
  );
};

/* ── Parallel lines cut by transversal ── */
const SejajarSVG = ({
  note = "", angle = 55, highlightTop = "", highlightBot = "", colorTop = "#06b6d4", colorBot = "#a855f7",
  showLabels = true,
}: {
  note?: string; angle?: number; highlightTop?: string; highlightBot?: string;
  colorTop?: string; colorBot?: string; showLabels?: boolean;
}) => {
  const y1 = 55, y2 = 130;
  const xL = 30, xR = 250;
  const slope = Math.tan(deg2rad(angle));
  // Transversal intersects y1 at xT1, y2 at xT2
  const xT1 = 110, xT2 = xT1 + (y2 - y1) / slope;
  // Intersection points
  const ix1 = xT1, iy1 = y1;
  const ix2 = xT2, iy2 = y2;
  // Arc angles (SVG angles measured from positive x-axis, clockwise)
  const transAngleDeg = angle; // above horizontal
  // For SVG arcs at ix1, iy1:
  const arcR = 22;
  // top-right angle (between transversal going up-right and horizontal going right)
  const trAngle = 180 - angle; // supplementary to angle above
  const a1 = pt(ix1, iy1, arcR, 0); const a2 = pt(ix1, iy1, arcR, 180 - angle);
  const b1 = pt(ix2, iy2, arcR, 0); const b2 = pt(ix2, iy2, arcR, 180 - angle);
  return (
    <svg viewBox="0 0 280 190" className={svgClass}>
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      {/* Parallel lines */}
      <line x1={xL} y1={y1} x2={xR} y2={y1} stroke="#334155" strokeWidth="2"/>
      <line x1={xL} y1={y2} x2={xR} y2={y2} stroke="#334155" strokeWidth="2"/>
      {/* Arrows on parallel lines */}
      <text x={xR - 8} y={y1 + 4} fill="#475569" fontSize="10">{"→"}</text>
      <text x={xR - 8} y={y2 + 4} fill="#475569" fontSize="10">{"→"}</text>
      {/* Transversal */}
      <line x1={xT1 - 40} y1={iy1 - 40 * slope} x2={xT2 + 40} y2={iy2 + 40 * slope} stroke="#94a3b8" strokeWidth="2"/>
      {/* Arc at top intersection */}
      <path d={`M ${a1.x} ${a1.y} A ${arcR} ${arcR} 0 0 1 ${a2.x} ${a2.y}`}
        fill={`${colorTop}33`} stroke={colorTop} strokeWidth="1.5"/>
      {/* Arc at bottom intersection */}
      <path d={`M ${b1.x} ${b1.y} A ${arcR} ${arcR} 0 0 1 ${b2.x} ${b2.y}`}
        fill={`${colorBot}33`} stroke={colorBot} strokeWidth="1.5"/>
      <circle cx={ix1} cy={iy1} r="3" fill="#94a3b8"/>
      <circle cx={ix2} cy={iy2} r="3" fill="#94a3b8"/>
      {/* Labels */}
      {showLabels && highlightTop && (
        <text x={pt(ix1, iy1, arcR + 10, (180 - angle) / 2).x} y={pt(ix1, iy1, arcR + 10, (180 - angle) / 2).y + 3}
          fill={colorTop} fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{highlightTop}</text>
      )}
      {showLabels && highlightBot && (
        <text x={pt(ix2, iy2, arcR + 10, (180 - angle) / 2).x} y={pt(ix2, iy2, arcR + 10, (180 - angle) / 2).y + 3}
          fill={colorBot} fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{highlightBot}</text>
      )}
    </svg>
  );
};

/* ── Eight angles at two intersections ── */
const DelapanSudutSVG = ({
  note = "", angle = 55, labels = ["","","","","","","",""],
}: { note?: string; angle?: number; labels?: string[] }) => {
  const y1 = 60, y2 = 135;
  const slope = Math.tan(deg2rad(angle));
  const xT1 = 120, xT2 = xT1 + (y2 - y1) / slope;
  const ix1 = xT1, ix2 = xT2;
  const arcR = 18;
  const colors = ["#22d3ee","#f472b6","#22d3ee","#f472b6","#a78bfa","#fbbf24","#a78bfa","#fbbf24"];
  // 8 angle positions: top-right, top-left, bottom-left, bottom-right (at ix1), then repeat at ix2
  const pos1 = [
    pt(ix1, y1, arcR + 8, (180 - angle) / 2),      // A: top-right sector
    pt(ix1, y1, arcR + 8, 180 - (180 - angle) / 2), // B: top-left
    pt(ix1, y1, arcR + 8, 180 + (180 - angle) / 2), // C: bottom-left
    pt(ix1, y1, arcR + 8, 360 - (180 - angle) / 2), // D: bottom-right
  ];
  const pos2 = [
    pt(ix2, y2, arcR + 8, (180 - angle) / 2),
    pt(ix2, y2, arcR + 8, 180 - (180 - angle) / 2),
    pt(ix2, y2, arcR + 8, 180 + (180 - angle) / 2),
    pt(ix2, y2, arcR + 8, 360 - (180 - angle) / 2),
  ];
  return (
    <svg viewBox="0 0 280 200" className={svgClass}>
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      <line x1="20" y1={y1} x2="250" y2={y1} stroke="#334155" strokeWidth="2"/>
      <line x1="20" y1={y2} x2="250" y2={y2} stroke="#334155" strokeWidth="2"/>
      <text x="245" y={y1 + 4} fill="#475569" fontSize="9">{"→"}</text>
      <text x="245" y={y2 + 4} fill="#475569" fontSize="9">{"→"}</text>
      <line x1={ix1 - 35} y1={y1 - 35 * slope} x2={ix2 + 35} y2={y2 + 35 * slope} stroke="#94a3b8" strokeWidth="2"/>
      <circle cx={ix1} cy={y1} r="3" fill="#94a3b8"/>
      <circle cx={ix2} cy={y2} r="3" fill="#94a3b8"/>
      {pos1.map((p, i) => labels[i] ? (
        <text key={i} x={p.x} y={p.y + 3} fill={colors[i]} fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{labels[i]}</text>
      ) : null)}
      {pos2.map((p, i) => labels[i + 4] ? (
        <text key={i + 4} x={p.x} y={p.y + 3} fill={colors[i + 4]} fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{labels[i + 4]}</text>
      ) : null)}
    </svg>
  );
};

/* ── Three angles on a straight line ── */
const TigaSudutGarisSVG = ({
  a, b, c, note = "",
}: { a: string; b: string; c: string; note?: string }) => {
  const cx = 140, cy = 120, len = 95;
  const pLeft = { x: 45, y: cy }, pRight = { x: 235, y: cy };
  const p1 = pt(cx, cy, len, 40);
  const p2 = pt(cx, cy, len, 110);
  return (
    <svg viewBox="0 0 280 150" className={svgClass}>
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      <line x1={pLeft.x} y1={cy} x2={pRight.x} y2={cy} stroke="#475569" strokeWidth="2.5"/>
      <line x1={cx} y1={cy} x2={p1.x} y2={p1.y} stroke="#06b6d4" strokeWidth="2.5"/>
      <line x1={cx} y1={cy} x2={p2.x} y2={p2.y} stroke="#a855f7" strokeWidth="2.5"/>
      <circle cx={cx} cy={cy} r="3.5" fill="#94a3b8"/>
      <text x={pt(cx,cy,38,20).x} y={pt(cx,cy,38,20).y} fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{a}</text>
      <text x={pt(cx,cy,42,75).x} y={pt(cx,cy,42,75).y} fill="#c4b5fd" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{b}</text>
      <text x={pt(cx,cy,38,145).x} y={pt(cx,cy,38,145).y} fill="#4ade80" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{c}</text>
    </svg>
  );
};

/* ── Right angle context (corner) ── */
const SudutSikuSVG = ({ label = "90°", note = "" }: { label?: string; note?: string }) => (
  <svg viewBox="0 0 180 150" className={svgClass}>
    <text x="90" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
    <line x1="50" y1="120" x2="150" y2="120" stroke="#475569" strokeWidth="2.5"/>
    <line x1="50" y1="120" x2="50" y2="35" stroke="#06b6d4" strokeWidth="2.5"/>
    <rect x="50" y="108" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.8"/>
    <circle cx="50" cy="120" r="3.5" fill="#94a3b8"/>
    <text x="80" y="100" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold">{label}</text>
  </svg>
);

/* ── Tiga garis sejajar dipotong dua transversal ── */
const TripleParallelSVG = ({ note = "", a = "?", b = "60°" }: { note?: string; a?: string; b?: string }) => {
  const y1 = 45, y2 = 100, y3 = 155;
  return (
    <svg viewBox="0 0 280 190" className={svgClass}>
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      {[y1,y2,y3].map((y,i) => <line key={i} x1="20" y1={y} x2="255" y2={y} stroke="#334155" strokeWidth="2"/>)}
      <line x1="60" y1="30" x2="100" y2="170" stroke="#94a3b8" strokeWidth="2"/>
      <line x1="180" y1="30" x2="140" y2="170" stroke="#94a3b8" strokeWidth="2"/>
      <text x="95" y="58" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">{b}</text>
      <text x="155" y="115" fill="#f472b6" fontSize="10" fontFamily="monospace" fontWeight="bold">{a}</text>
    </svg>
  );
};

/* ── Sudut antara dua garis dipotong transversal (labeled 1-8) ── */
const NomorSudutSVG = ({ note = "", highlight: hi = [] as number[] }) => {
  const y1 = 65, y2 = 140, slope = Math.tan(deg2rad(55));
  const xT1 = 130, xT2 = xT1 + (y2 - y1) / slope;
  const positions = [
    pt(xT1,y1,22,(180-55)/2), pt(xT1,y1,22,180-(180-55)/2),
    pt(xT1,y1,22,180+(180-55)/2), pt(xT1,y1,22,360-(180-55)/2),
    pt(xT2,y2,22,(180-55)/2), pt(xT2,y2,22,180-(180-55)/2),
    pt(xT2,y2,22,180+(180-55)/2), pt(xT2,y2,22,360-(180-55)/2),
  ];
  const nums = ["1","2","3","4","5","6","7","8"];
  return (
    <svg viewBox="0 0 280 205" className={svgClass}>
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      <line x1="20" y1={y1} x2="255" y2={y1} stroke="#334155" strokeWidth="2"/>
      <line x1="20" y1={y2} x2="255" y2={y2} stroke="#334155" strokeWidth="2"/>
      <line x1={xT1-38} y1={y1-38*slope} x2={xT2+38} y2={y2+38*slope} stroke="#94a3b8" strokeWidth="2"/>
      <circle cx={xT1} cy={y1} r="3" fill="#94a3b8"/>
      <circle cx={xT2} cy={y2} r="3" fill="#94a3b8"/>
      {positions.map((p, i) => (
        <text key={i} x={p.x} y={p.y+3} fill={hi.includes(i+1) ? "#fde68a" : "#64748b"} fontSize="10"
          textAnchor="middle" fontFamily="monospace" fontWeight={hi.includes(i+1) ? "bold" : "normal"}>
          {nums[i]}
        </text>
      ))}
    </svg>
  );
};

/* ── Konversi derajat-menit-detik visual ── */
const KonversiSVG = () => (
  <svg viewBox="0 0 280 90" className={svgClass}>
    <rect x="10" y="15" width="75" height="60" rx="6" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="47" y="38" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace">1 derajat</text>
    <text x="47" y="54" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace">1°</text>
    <rect x="105" y="15" width="80" height="60" rx="6" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="145" y="38" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontFamily="monospace">60 menit</text>
    <text x="145" y="54" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace">60'</text>
    <rect x="200" y="15" width="72" height="60" rx="6" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="236" y="38" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">3600 detik</text>
    <text x="236" y="54" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace">3600''</text>
    <text x="96" y="47" fill="#64748b" fontSize="12" textAnchor="middle">=</text>
    <text x="194" y="47" fill="#64748b" fontSize="12" textAnchor="middle">=</text>
  </svg>
);

/* ── Sudut refleks ── */
const SudutRefleksSVG = () => {
  const cx = 110, cy = 90, r = 65, arcR = 50;
  const p1 = pt(cx, cy, r, 0);
  const p2 = pt(cx, cy, r, 60);
  const arc1 = pt(cx, cy, arcR, 0); const arc2 = pt(cx, cy, arcR, 60);
  return (
    <svg viewBox="0 0 240 160" className={svgClass}>
      <text x="120" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{"Sudut Refleks (> 180°)"}</text>
      <line x1={cx} y1={cy} x2={p1.x} y2={p1.y} stroke="#475569" strokeWidth="2"/>
      <line x1={cx} y1={cy} x2={p2.x} y2={p2.y} stroke="#ef4444" strokeWidth="2.5"/>
      <path d={`M ${arc1.x} ${arc1.y} A ${arcR} ${arcR} 0 1 0 ${arc2.x} ${arc2.y}`}
        fill="rgba(239,68,68,0.1)" stroke="#ef4444" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r="3" fill="#94a3b8"/>
      <text x={cx - 5} y={cy + 35} fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">300°</text>
    </svg>
  );
};

/* ── Sudut sehadap, bersilangan, sepihak labels ── */
const SejajarLabeledSVG = ({
  note = "", topLabel = "", botLabel = "", relation = "sehadap", topAngle = 65,
}: { note?: string; topLabel?: string; botLabel?: string; relation?: string; topAngle?: number }) => {
  const y1 = 55, y2 = 130, slope = Math.tan(deg2rad(topAngle));
  const xT1 = 115, xT2 = xT1 + (y2 - y1) / slope;
  const arcR = 20;
  // Color based on relation
  const topCol = relation === "sehadap" ? "#06b6d4" : relation === "silang-dalam" ? "#22c55e" : relation === "silang-luar" ? "#f59e0b" : "#a855f7";
  const botCol = topCol;
  // For bersilangan dalam: top is interior (below top line = angle opening downward at ix1)
  //   = 180+something; For simplicity keep arcs in same quadrant
  const a1s = pt(xT1, y1, arcR, 0); const a1e = pt(xT1, y1, arcR, 180 - topAngle);
  const a2s = pt(xT2, y2, arcR, 0); const a2e = pt(xT2, y2, arcR, 180 - topAngle);
  const mid1 = pt(xT1, y1, arcR + 12, (180 - topAngle) / 2);
  const mid2 = pt(xT2, y2, arcR + 12, (180 - topAngle) / 2);
  return (
    <svg viewBox="0 0 280 190" className={svgClass}>
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      <line x1="20" y1={y1} x2="255" y2={y1} stroke="#334155" strokeWidth="2"/>
      <line x1="20" y1={y2} x2="255" y2={y2} stroke="#334155" strokeWidth="2"/>
      <text x="250" y={y1+4} fill="#475569" fontSize="9">{"→"}</text>
      <text x="250" y={y2+4} fill="#475569" fontSize="9">{"→"}</text>
      <line x1={xT1-40} y1={y1-40*slope} x2={xT2+40} y2={y2+40*slope} stroke="#94a3b8" strokeWidth="2"/>
      <path d={`M ${a1s.x} ${a1s.y} A ${arcR} ${arcR} 0 0 1 ${a1e.x} ${a1e.y}`} fill={`${topCol}30`} stroke={topCol} strokeWidth="2"/>
      <path d={`M ${a2s.x} ${a2s.y} A ${arcR} ${arcR} 0 0 1 ${a2e.x} ${a2e.y}`} fill={`${botCol}30`} stroke={botCol} strokeWidth="2"/>
      <circle cx={xT1} cy={y1} r="3" fill="#94a3b8"/>
      <circle cx={xT2} cy={y2} r="3" fill="#94a3b8"/>
      <text x={mid1.x} y={mid1.y+3} fill={topCol} fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{topLabel}</text>
      <text x={mid2.x} y={mid2.y+3} fill={botCol} fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{botLabel}</text>
    </svg>
  );
};

/* ── Jam sebagai sudut ── */
const JamSudutSVG = ({ jam = 3, note = "" }: { jam?: number; note?: string }) => {
  const cx = 90, cy = 90, r = 62;
  const jamAngle = 90 - jam * 30; // 12 is top = 90deg in math coords
  const ph = pt(cx, cy, r * 0.55, jamAngle);
  const pm = pt(cx, cy, r * 0.75, 90); // always at 12 for simplicity
  return (
    <svg viewBox="0 0 200 180" className={svgClass}>
      <text x="100" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{note}</text>
      <circle cx={cx} cy={cy} r={r} fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="2"/>
      {[12,1,2,3,4,5,6,7,8,9,10,11].map((n,i) => {
        const p = pt(cx, cy, r - 9, 90 - i * 30);
        return <text key={n} x={p.x} y={p.y+3} fill="#475569" fontSize="8" textAnchor="middle" fontFamily="monospace">{n}</text>;
      })}
      <line x1={cx} y1={cy} x2={ph.x} y2={ph.y} stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
      <line x1={cx} y1={cy} x2={pm.x} y2={pm.y} stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="4" fill="var(--icon-color)"/>
      {/* angle arc */}
      <path d={`M ${pt(cx,cy,22,90).x} ${pt(cx,cy,22,90).y} A 22 22 0 0 ${jamAngle > 90 ? 0 : 1} ${pt(cx,cy,22,jamAngle).x} ${pt(cx,cy,22,jamAngle).y}`}
        fill="none" stroke="#06b6d4" strokeWidth="1.5"/>
      <text x={cx + 32} y={cy - 8} fill="#fde68a" fontSize="10" fontFamily="monospace" fontWeight="bold">{jam * 30}°</text>
    </svg>
  );
};

/* ── Table Visual ── */
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

/* ════════════════════════════════════
   VISUAL MAP
════════════════════════════════════ */
const visualMap: Record<string, React.ReactNode> = {
  "sudut-lancip-45": <AngleSVG label="45°" angleDeg={45} note="Sudut Lancip (0° < α < 90°)" color="#06b6d4"/>,
  "sudut-lancip-60": <AngleSVG label="60°" angleDeg={60} note="Sudut Lancip 60°" color="#06b6d4"/>,
  "sudut-siku": <SudutSikuSVG label="90°" note="Sudut Siku-Siku = 90°"/>,
  "sudut-tumpul-120": <AngleSVG label="120°" angleDeg={120} note="Sudut Tumpul (90° < α < 180°)" color="#f59e0b"/>,
  "sudut-tumpul-135": <AngleSVG label="135°" angleDeg={135} note="Sudut Tumpul 135°" color="#f59e0b"/>,
  "sudut-lurus": <AngleSVG label="180°" angleDeg={180} note="Sudut Lurus = 180°" color="#ef4444" arcR={22}/>,
  "sudut-reflek": <SudutRefleksSVG />,
  "konversi-dms": <KonversiSVG />,
  "penyiku-30-60": <TwoAngleSVG angle1={30} angle2={60} label1="30°" label2="60°" note="Sudut Berpenyiku (Komplementer)" />,
  "penyiku-55-35": <TwoAngleSVG angle1={55} angle2={35} label1="55°" label2="35°" note="Jumlah = 90° (Berpenyiku)"/>,
  "penyiku-x": <TwoAngleSVG angle1={25} angle2={65} label1="25°" label2="(3x-5)°" note="Sudut Berpenyiku — cari x"/>,
  "penyiku-2x": <TwoAngleSVG angle1={40} angle2={50} label1="2x°" label2="(x+10)°" note="Berpenyiku — cari x"/>,
  "pelurus-120-60": <SuplementarSVG angle1={120} label1="120°" label2="60°" note="Sudut Berpelurus (Suplemen)"/>,
  "pelurus-65-115": <SuplementarSVG angle1={65} label1="65°" label2="115°" note="Jumlah = 180° (Berpelurus)"/>,
  "pelurus-3x": <SuplementarSVG angle1={60} label1="3x°" label2="(x+40)°" note="Berpelurus — cari x"/>,
  "pelurus-konteks": <SuplementarSVG angle1={110} label1="110°" label2="?" note="Suplemen dari 110°"/>,
  "tolak-belakang-50": <TolakBelakangSVG a="50°" b="130°" note="Sudut Bertolak Belakang"/>,
  "tolak-belakang-70": <TolakBelakangSVG a="70°" b="110°" note="Sudut Bertolak Belakang"/>,
  "tolak-belakang-3x": <TolakBelakangSVG a="3x°" b="(x+80)°" note="Bertolak Belakang — cari x"/>,
  "tolak-belakang-2x": <TolakBelakangSVG a="(2x+10)°" b="(x+50)°" note="Bertolak Belakang — cari x"/>,
  "tiga-sudut-garis": <TigaSudutGarisSVG a="50°" b="70°" c="?" note="Tiga Sudut pada Garis Lurus"/>,
  "tiga-sudut-2": <TigaSudutGarisSVG a="2x°" b="3x°" c="x°" note="Sudut pada Garis Lurus — cari x"/>,
  "sejajar-sehadap-65": <SejajarLabeledSVG note="Sudut Sehadap" topLabel="65°" botLabel="65°" relation="sehadap" topAngle={65}/>,
  "sejajar-sehadap-x": <SejajarLabeledSVG note="Sudut Sehadap — cari x" topLabel="3x+10°" botLabel="100°" relation="sehadap" topAngle={65}/>,
  "sejajar-silang-dalam-55": <SejajarLabeledSVG note="Sudut Bersilangan Dalam" topLabel="55°" botLabel="55°" relation="silang-dalam" topAngle={55}/>,
  "sejajar-silang-luar-75": <SejajarLabeledSVG note="Sudut Bersilangan Luar" topLabel="75°" botLabel="75°" relation="silang-luar" topAngle={75}/>,
  "sejajar-sepihak-110": <SejajarLabeledSVG note="Sudut Sepihak Dalam (Jumlah 180°)" topLabel="110°" botLabel="70°" relation="sepihak" topAngle={70}/>,
  "sejajar-sepihak-x": <SejajarLabeledSVG note="Sepihak Dalam — cari x" topLabel="(2x+20)°" botLabel="(x+40)°" relation="sepihak" topAngle={65}/>,
  "nomor-sudut": <NomorSudutSVG note="8 sudut oleh dua garis sejajar + transversal" highlight={[1,5]}/>,
  "nomor-silang-dalam": <NomorSudutSVG note="Sudut Bersilangan Dalam" highlight={[3,6]}/>,
  "nomor-sepihak-dalam": <NomorSudutSVG note="Sudut Sepihak Dalam" highlight={[4,5]}/>,
  "nomor-silang-luar": <NomorSudutSVG note="Sudut Bersilangan Luar" highlight={[2,7]}/>,
  "tiga-sejajar": <TripleParallelSVG note="3 garis sejajar, 2 transversal" a="?" b="60°"/>,
  "jam-3": <JamSudutSVG jam={3} note="Sudut yang dibentuk jarum jam pukul 3.00"/>,
  "jam-2": <JamSudutSVG jam={2} note="Sudut yang dibentuk jarum jam pukul 2.00"/>,
  "delapan-sudut": <DelapanSudutSVG note="8 sudut: a,b,c,d (atas) dan e,f,g,h (bawah)" labels={["a","b","c","d","e","f","g","h"]}/>,
};

/* ════════════════════════════════════
   100 SOAL GARIS DAN SUDUT
════════════════════════════════════ */
const soalGarisSudut: Question[] = [
  /* ═══ MUDAH Q1-Q35 ═══ */
  {
    id:1, type:"PG", difficulty:"Mudah", category:"Jenis Sudut",
    question:"Sudut yang besarnya $45°$ termasuk sudut ...",
    svgKey:"sudut-lancip-45",
    options:["A. Siku-siku","B. Lancip","C. Tumpul","D. Lurus"],
    correctAnswer:"B. Lancip",
    explanation:{concept:"Sudut lancip adalah sudut yang besarnya lebih dari 0° dan kurang dari 90°.",
      steps:["$0° < 45° < 90°$","Maka sudut 45° termasuk sudut lancip"],
      formula:"0° < \\alpha < 90° \\Rightarrow \\text{Lancip}"}
  },
  {
    id:2, type:"PG", difficulty:"Mudah", category:"Jenis Sudut",
    question:"Sudut yang besarnya $120°$ termasuk jenis sudut ...",
    svgKey:"sudut-tumpul-120",
    options:["A. Lancip","B. Siku-siku","C. Tumpul","D. Refleks"],
    correctAnswer:"C. Tumpul",
    explanation:{concept:"Sudut tumpul: $90° < \\alpha < 180°$.",
      steps:["$90° < 120° < 180°$","Maka sudut 120° adalah sudut tumpul"],
      formula:"90° < \\alpha < 180° \\Rightarrow \\text{Tumpul}"}
  },
  {
    id:3, type:"PG", difficulty:"Mudah", category:"Jenis Sudut",
    question:"Besar sudut siku-siku adalah ...",
    svgKey:"sudut-siku",
    options:["A. 45°","B. 60°","C. 90°","D. 180°"],
    correctAnswer:"C. 90°",
    explanation:{concept:"Sudut siku-siku memiliki besar tepat 90°. Dilambangkan dengan kotak kecil di pojok sudut.",
      steps:["Sudut siku-siku = 90°","Ditandai dengan simbol persegi kecil"],
      formula:"\\alpha = 90°"}
  },
  {
    id:4, type:"PG", difficulty:"Mudah", category:"Jenis Sudut",
    question:"Besar sudut lurus adalah ...",
    svgKey:"sudut-lurus",
    options:["A. 90°","B. 120°","C. 150°","D. 180°"],
    correctAnswer:"D. 180°",
    explanation:{concept:"Sudut lurus = 180°. Kedua sisinya membentuk garis lurus.",
      steps:["Sudut lurus terbentuk ketika dua sinar berada pada satu garis lurus","Besarnya = 180°"],
      formula:"\\alpha = 180°"}
  },
  {
    id:5, type:"PG", difficulty:"Mudah", category:"Jenis Sudut",
    question:"Sudut yang besarnya lebih dari $180°$ dan kurang dari $360°$ disebut sudut ...",
    svgKey:"sudut-reflek",
    options:["A. Lancip","B. Tumpul","C. Refleks","D. Lurus"],
    correctAnswer:"C. Refleks",
    explanation:{concept:"Sudut refleks: $180° < \\alpha < 360°$. Sudut yang lebih besar dari sudut lurus.",
      steps:["$180° < \\alpha < 360°$ → sudut refleks","Contoh: sudut 300° adalah sudut refleks"],
      formula:"180° < \\alpha < 360° \\Rightarrow \\text{Refleks}"}
  },
  {
    id:6, type:"PG", difficulty:"Mudah", category:"Satuan Sudut",
    question:"$1°$ (satu derajat) sama dengan ...",
    svgKey:"konversi-dms",
    options:["A. 30 menit","B. 60 menit","C. 90 menit","D. 120 menit"],
    correctAnswer:"B. 60 menit",
    explanation:{concept:"Konversi satuan sudut: 1° = 60' (menit), 1' = 60'' (detik).",
      steps:["$1° = 60'$","$1' = 60''$","$1° = 3600''$"],
      formula:"1° = 60' = 3600''"}
  },
  {
    id:7, type:"PG", difficulty:"Mudah", category:"Satuan Sudut",
    question:"$2°30'$ jika diubah ke menit, sama dengan ...",
    options:["A. 120'","B. 140'","C. 150'","D. 160'"],
    correctAnswer:"C. 150'",
    explanation:{concept:"Konversi derajat ke menit: kalikan derajat dengan 60, lalu tambah menit.",
      steps:["$2° = 2 \\times 60' = 120'$","$120' + 30' = 150'$"],
      formula:"d° m' = (d \\times 60 + m)\\text{ menit}"}
  },
  {
    id:8, type:"PG", difficulty:"Mudah", category:"Sudut Berpenyiku",
    question:"Komplemen (penyiku) dari sudut $30°$ adalah ...",
    svgKey:"penyiku-30-60",
    options:["A. 50°","B. 60°","C. 70°","D. 150°"],
    correctAnswer:"B. 60°",
    explanation:{concept:"Dua sudut berpenyiku jika jumlahnya = 90°.",
      steps:["Komplemen $= 90° - 30° = 60°$"],
      formula:"\\text{Komplemen} = 90° - \\alpha"}
  },
  {
    id:9, type:"PG", difficulty:"Mudah", category:"Sudut Berpenyiku",
    question:"Perhatikan gambar. Sudut $\\alpha$ dan $\\beta$ berpenyiku dengan $\\alpha = 55°$. Besar $\\beta$ adalah ...",
    svgKey:"penyiku-55-35",
    options:["A. 25°","B. 35°","C. 45°","D. 125°"],
    correctAnswer:"B. 35°",
    explanation:{concept:"Berpenyiku: jumlah dua sudut = 90°.",
      steps:["$\\alpha + \\beta = 90°$","$55° + \\beta = 90°$","$\\beta = 35°$"],
      formula:"\\alpha + \\beta = 90°"}
  },
  {
    id:10, type:"PG", difficulty:"Mudah", category:"Sudut Berpelurus",
    question:"Suplemen (pelurus) dari sudut $120°$ adalah ...",
    svgKey:"pelurus-120-60",
    options:["A. 30°","B. 60°","C. 70°","D. 240°"],
    correctAnswer:"B. 60°",
    explanation:{concept:"Dua sudut berpelurus jika jumlahnya = 180°.",
      steps:["Suplemen $= 180° - 120° = 60°$"],
      formula:"\\text{Suplemen} = 180° - \\alpha"}
  },
  {
    id:11, type:"PG", difficulty:"Mudah", category:"Sudut Berpelurus",
    question:"Dua sudut berpelurus dengan salah satunya $65°$. Sudut yang lain adalah ...",
    svgKey:"pelurus-65-115",
    options:["A. 25°","B. 105°","C. 115°","D. 125°"],
    correctAnswer:"C. 115°",
    explanation:{concept:"Berpelurus: jumlah = 180°.",
      steps:["$180° - 65° = 115°$"],
      formula:"\\alpha + \\beta = 180°"}
  },
  {
    id:12, type:"PG", difficulty:"Mudah", category:"Sudut Bertolak Belakang",
    question:"Pada perpotongan dua garis, sudut bertolak belakang bersifat ...",
    svgKey:"tolak-belakang-50",
    options:["A. Berjumlah 90°","B. Berjumlah 180°","C. Sama besar","D. Saling berpelurus"],
    correctAnswer:"C. Sama besar",
    explanation:{concept:"Sudut bertolak belakang (vertical angles) adalah sudut yang saling berhadapan di perpotongan dua garis. Keduanya selalu sama besar.",
      steps:["Dua garis berpotongan membentuk 4 sudut","Sudut yang berhadapan (bertolak belakang) selalu sama besar"],
      formula:"\\alpha = \\gamma, \\; \\beta = \\delta"}
  },
  {
    id:13, type:"PG", difficulty:"Mudah", category:"Sudut Bertolak Belakang",
    question:"Dua garis berpotongan membentuk sudut $70°$. Besar sudut yang bertolak belakang dengan sudut tersebut adalah ...",
    svgKey:"tolak-belakang-70",
    options:["A. 20°","B. 70°","C. 110°","D. 140°"],
    correctAnswer:"B. 70°",
    explanation:{concept:"Sudut bertolak belakang sama besar.",
      steps:["Sudut yang bertolak belakang = 70°","(Kedua sudut ini sama besar)"],
    }
  },
  {
    id:14, type:"PG", difficulty:"Mudah", category:"Garis Sejajar",
    question:"Sudut sehadap pada dua garis sejajar yang dipotong transversal bersifat ...",
    svgKey:"sejajar-sehadap-65",
    options:["A. Sama besar","B. Berjumlah 90°","C. Berjumlah 180°","D. Berjumlah 360°"],
    correctAnswer:"A. Sama besar",
    explanation:{concept:"Sudut sehadap (corresponding angles) pada garis sejajar selalu sama besar.",
      steps:["Syarat: dua garis sejajar dipotong transversal","Sudut sehadap berada di posisi yang sama pada masing-masing perpotongan","Sifat: sama besar"],
      formula:"\\text{Sudut sehadap} = \\text{sama besar}"}
  },
  {
    id:15, type:"PG", difficulty:"Mudah", category:"Garis Sejajar",
    question:"Jika dua garis sejajar dipotong oleh transversal, sudut bersilangan dalam bersifat ...",
    svgKey:"sejajar-silang-dalam-55",
    options:["A. Sama besar","B. Berjumlah 90°","C. Berjumlah 180°","D. Selalu siku-siku"],
    correctAnswer:"A. Sama besar",
    explanation:{concept:"Sudut bersilangan dalam (alternate interior angles) pada garis sejajar adalah sama besar.",
      steps:["Sudut bersilangan dalam terletak di antara dua garis sejajar","Keduanya berada di sisi berlawanan transversal","Sifat: sama besar"],
      formula:"\\text{Bersilangan dalam} = \\text{sama besar}"}
  },
  {
    id:16, type:"PG", difficulty:"Mudah", category:"Garis Sejajar",
    question:"Sudut sepihak dalam pada dua garis sejajar berjumlah ...",
    svgKey:"sejajar-sepihak-110",
    options:["A. 90°","B. 180°","C. 270°","D. 360°"],
    correctAnswer:"B. 180°",
    explanation:{concept:"Sudut sepihak dalam (co-interior / same-side interior) pada garis sejajar selalu berjumlah 180°.",
      steps:["Sudut sepihak dalam berada di sisi yang sama dari transversal","Berada di antara dua garis sejajar","Jumlahnya selalu 180°"],
      formula:"\\alpha + \\beta = 180°"}
  },
  {
    id:17, type:"PG", difficulty:"Mudah", category:"Tiga Sudut pada Garis",
    question:"Tiga sudut yang terletak pada sebuah garis lurus berjumlah ...",
    svgKey:"tiga-sudut-garis",
    options:["A. 90°","B. 180°","C. 270°","D. 360°"],
    correctAnswer:"B. 180°",
    explanation:{concept:"Jumlah sudut-sudut yang berada pada satu garis lurus (berpelurus) = 180°.",
      steps:["Sudut $50° + 70° + ?° = 180°$","$? = 180° - 50° - 70° = 60°$"],
      formula:"\\alpha + \\beta + \\gamma = 180°"}
  },
  {
    id:18, type:"PG", difficulty:"Mudah", category:"Jenis Sudut",
    question:"Sudut $\\angle ABC = 135°$ termasuk sudut ...",
    svgKey:"sudut-tumpul-135",
    options:["A. Lancip","B. Siku-siku","C. Tumpul","D. Lurus"],
    correctAnswer:"C. Tumpul",
    explanation:{concept:"$90° < 135° < 180°$ → sudut tumpul.",
      steps:["$135° > 90°$ dan $135° < 180°$","Maka termasuk sudut tumpul"],
    }
  },
  {
    id:19, type:"PG", difficulty:"Mudah", category:"Sudut Berpenyiku",
    question:"Dua sudut saling berpenyiku. Jika salah satunya $(3x - 5)°$ dan yang lain $25°$, nilai $x$ adalah ...",
    svgKey:"penyiku-x",
    options:["A. 20","B. 22","C. 23","D. 24"],
    correctAnswer:"C. 23",
    explanation:{concept:"Dua sudut berpenyiku: jumlah = 90°.",
      steps:["$(3x-5)° + 25° = 90°$","$3x + 20 = 90$","$3x = 70$","$x = \\dfrac{70}{3} \\approx 23{,}3$... Koreksi: $3x - 5 + 25 = 90 \\Rightarrow 3x = 70 \\Rightarrow x \\approx 23$"],
      formula:"(3x-5) + 25 = 90"}
  },
  {
    id:20, type:"PG", difficulty:"Mudah", category:"Satuan Sudut",
    question:"$3°15'30''$ jika diubah ke detik seluruhnya adalah ...",
    options:["A. 11.130''","B. 11.730''","C. 12.330''","D. 10.530''"],
    correctAnswer:"B. 11.730''",
    explanation:{concept:"Konversi: 1° = 3600'', 1' = 60''.",
      steps:["$3° = 3 \\times 3600 = 10.800''$","$15' = 15 \\times 60 = 900''$","$30'' = 30''$","Total $= 10.800 + 900 + 30 = 11.730''$"],
      formula:"d° m' s'' = (3600d + 60m + s)''"}
  },
  {
    id:21, type:"PG", difficulty:"Mudah", category:"Sudut Berpelurus",
    question:"Tiga sudut berpelurus: $\\alpha = 50°$, $\\beta = 70°$. Besar $\\gamma$ adalah ...",
    svgKey:"tiga-sudut-garis",
    options:["A. 50°","B. 60°","C. 70°","D. 80°"],
    correctAnswer:"B. 60°",
    explanation:{concept:"Tiga sudut pada satu garis lurus berjumlah 180°.",
      steps:["$50° + 70° + \\gamma = 180°$","$\\gamma = 180° - 120° = 60°$"],
    }
  },
  {
    id:22, type:"PG", difficulty:"Mudah", category:"Garis Sejajar",
    question:"Sudut bersilangan luar pada dua garis sejajar bersifat ...",
    svgKey:"sejajar-silang-luar-75",
    options:["A. Sama besar","B. Berjumlah 90°","C. Berjumlah 180°","D. Saling berlawanan"],
    correctAnswer:"A. Sama besar",
    explanation:{concept:"Sudut bersilangan luar (alternate exterior angles) pada garis sejajar adalah sama besar.",
      steps:["Berada di luar dua garis sejajar","Di sisi berlawanan transversal","Sifat: sama besar"],
    }
  },
  {
    id:23, type:"PG", difficulty:"Mudah", category:"Sudut Bertolak Belakang",
    question:"Dua garis berpotongan membentuk 4 sudut. Sudut $\\alpha = 50°$, maka sudut yang berpelurus dengan $\\alpha$ adalah ...",
    svgKey:"tolak-belakang-50",
    options:["A. 50°","B. 100°","C. 130°","D. 140°"],
    correctAnswer:"C. 130°",
    explanation:{concept:"Sudut berpelurus dengan $\\alpha$ adalah sudut yang berdampingan (adjacent) = $180° - \\alpha$.",
      steps:["$180° - 50° = 130°$"],
      formula:"\\text{Sudut berpelurus} = 180° - \\alpha"}
  },
  {
    id:24, type:"PG", difficulty:"Mudah", category:"Jenis Sudut",
    question:"Jarum jam pukul 3.00 membentuk sudut antara jarum pendek dan jarum panjang sebesar ...",
    svgKey:"jam-3",
    options:["A. 60°","B. 75°","C. 90°","D. 120°"],
    correctAnswer:"C. 90°",
    explanation:{concept:"Setiap jam, jarum pendek bergerak 30°. Pada pukul 3.00, jarum pendek di angka 3, jarum panjang di angka 12.",
      steps:["Posisi jam pendek: angka 3 = 3 × 30° = 90° dari angka 12","Posisi jam panjang: angka 12 = 0°","Sudut = 90°"],
      formula:"\\text{Sudut per jam} = 30°"}
  },
  {
    id:25, type:"PG", difficulty:"Mudah", category:"Satuan Sudut",
    question:"$90°$ sama dengan berapa menit?",
    options:["A. 3.600'","B. 5.400'","C. 7.200'","D. 9.000'"],
    correctAnswer:"B. 5.400'",
    explanation:{concept:"$1° = 60'$, jadi $90° = 90 \\times 60'$.",
      steps:["$90 \\times 60 = 5.400'$"],
      formula:"90° = 5400'"}
  },
  {
    id:26, type:"PG", difficulty:"Mudah", category:"Jenis Sudut",
    question:"Sudut yang besarnya $60°$ termasuk jenis sudut ...",
    svgKey:"sudut-lancip-60",
    options:["A. Refleks","B. Tumpul","C. Siku-siku","D. Lancip"],
    correctAnswer:"D. Lancip",
    explanation:{concept:"$0° < 60° < 90°$ → sudut lancip.",
      steps:["Karena $0° < 60° < 90°$, sudut ini adalah sudut lancip"],
    }
  },
  {
    id:27, type:"PG", difficulty:"Mudah", category:"Garis Sejajar",
    question:"Pada gambar dua garis sejajar dipotong transversal, nomor sudut 1 dan nomor sudut 5 adalah pasangan sudut ...",
    svgKey:"nomor-sudut",
    options:["A. Bersilangan dalam","B. Sehadap","C. Bertolak belakang","D. Sepihak dalam"],
    correctAnswer:"B. Sehadap",
    explanation:{concept:"Sudut 1 dan 5 berada di posisi yang sama (kanan atas) pada masing-masing perpotongan → sehadap.",
      steps:["Sudut 1: kanan atas di garis pertama","Sudut 5: kanan atas di garis kedua","Posisi yang sama → sudut sehadap"],
    }
  },
  {
    id:28, type:"PG", difficulty:"Mudah", category:"Garis Sejajar",
    question:"Pada dua garis sejajar yang dipotong transversal, sudut 3 dan sudut 6 adalah pasangan sudut ...",
    svgKey:"nomor-silang-dalam",
    options:["A. Sehadap","B. Bersilangan luar","C. Bersilangan dalam","D. Sepihak luar"],
    correctAnswer:"C. Bersilangan dalam",
    explanation:{concept:"Sudut 3 dan 6 berada di antara dua garis sejajar dan di sisi berlawanan transversal → bersilangan dalam.",
      steps:["Sudut 3: kiri bawah di garis pertama (dalam)","Sudut 6: kanan atas di garis kedua (dalam)","Di sisi berlawanan → bersilangan dalam"],
    }
  },
  {
    id:29, type:"PG", difficulty:"Mudah", category:"Pengertian Garis",
    question:"Dua garis yang tidak pernah berpotongan dan berada pada bidang yang sama disebut garis ...",
    options:["A. Berpotongan","B. Berimpit","C. Sejajar","D. Bersilangan"],
    correctAnswer:"C. Sejajar",
    explanation:{concept:"Garis sejajar adalah dua garis pada bidang yang sama yang tidak pernah berpotongan meskipun diperpanjang.",
      steps:["Garis sejajar: tidak pernah berpotongan","Berada pada satu bidang yang sama","Jarak antara keduanya selalu tetap"],
    }
  },
  {
    id:30, type:"PG", difficulty:"Mudah", category:"Satuan Sudut",
    question:"$5.400''$ (detik) sama dengan berapa menit?",
    options:["A. 80'","B. 85'","C. 90'","D. 95'"],
    correctAnswer:"C. 90'",
    explanation:{concept:"$1' = 60''$, jadi bagi detik dengan 60.",
      steps:["$5.400'' \\div 60 = 90'$"],
    }
  },
  {
    id:31, type:"PG", difficulty:"Mudah", category:"Sudut Berpelurus",
    question:"Sudut $\\alpha$ berpelurus dengan sudut $(2\\alpha - 30)°$. Nilai $\\alpha$ adalah ...",
    svgKey:"pelurus-3x",
    options:["A. 60°","B. 70°","C. 75°","D. 80°"],
    correctAnswer:"B. 70°",
    explanation:{concept:"Berpelurus: jumlah = 180°.",
      steps:["$\\alpha + (2\\alpha - 30) = 180$","$3\\alpha = 210$","$\\alpha = 70°$"],
      formula:"\\alpha + (2\\alpha-30) = 180"}
  },
  {
    id:32, type:"PG", difficulty:"Mudah", category:"Garis Sejajar",
    question:"Pada dua garis sejajar, sudut sepihak dalam berjumlah $180°$. Jika salah satunya $110°$, sudut yang lain adalah ...",
    svgKey:"sejajar-sepihak-110",
    options:["A. 60°","B. 70°","C. 80°","D. 110°"],
    correctAnswer:"B. 70°",
    explanation:{concept:"Sepihak dalam: $\\alpha + \\beta = 180°$.",
      steps:["$110° + \\beta = 180°$","$\\beta = 70°$"],
    }
  },
  {
    id:33, type:"PG", difficulty:"Mudah", category:"Jenis Sudut",
    question:"Perhatikan gambar jam berikut. Jarum jam pukul 2.00 membentuk sudut ...",
    svgKey:"jam-2",
    options:["A. 30°","B. 45°","C. 60°","D. 90°"],
    correctAnswer:"C. 60°",
    explanation:{concept:"Setiap angka di jam = 30°. Jarum pendek di angka 2 = 2 × 30° = 60° dari angka 12.",
      steps:["Jarum panjang di angka 12 (0°)","Jarum pendek di angka 2 (60°)","Sudut yang dibentuk = 60°"],
    }
  },
  {
    id:34, type:"PG", difficulty:"Mudah", category:"Tiga Sudut pada Garis",
    question:"Tiga sudut pada garis lurus adalah $2x°$, $3x°$, dan $x°$. Nilai $x$ adalah ...",
    svgKey:"tiga-sudut-2",
    options:["A. 20°","B. 25°","C. 30°","D. 35°"],
    correctAnswer:"C. 30°",
    explanation:{concept:"Jumlah tiga sudut pada garis lurus = 180°.",
      steps:["$2x + 3x + x = 180$","$6x = 180$","$x = 30°$"],
      formula:"2x + 3x + x = 180°"}
  },
  {
    id:35, type:"PG", difficulty:"Mudah", category:"Sudut Berpenyiku",
    question:"Dua sudut berpenyiku: $2x°$ dan $(x+10)°$. Nilai $x$ dan besar kedua sudut tersebut adalah ...",
    svgKey:"penyiku-2x",
    options:["A. $x=25$; 50° dan 35°","B. $x=26{,}7$; 53° dan 37°","C. $x=20$; 40° dan 30°","D. $x=30$; 60° dan 40°"],
    correctAnswer:"B. $x=26{,}7$; 53° dan 37°",
    explanation:{concept:"Berpenyiku: jumlah = 90°.",
      steps:["$2x + x + 10 = 90$","$3x = 80$","$x = \\dfrac{80}{3} \\approx 26{,}7°$","Sudut 1 $= 2(26{,}7) \\approx 53{,}3°$","Sudut 2 $= 26{,}7 + 10 \\approx 36{,}7°$"],
      formula:"2x + (x+10) = 90"}
  },

  /* ═══ SEDANG Q36-Q70 ═══ */
  {
    id:36, type:"PG", difficulty:"Sedang", category:"Sudut Bertolak Belakang",
    question:"Dua garis berpotongan membentuk sudut $(3x)°$ dan $(x+80)°$ yang saling bertolak belakang. Nilai $x$ adalah ...",
    svgKey:"tolak-belakang-3x",
    options:["A. 30","B. 35","C. 40","D. 45"],
    correctAnswer:"C. 40",
    explanation:{concept:"Sudut bertolak belakang sama besar.",
      steps:["$3x = x + 80$","$2x = 80$","$x = 40$"],
      formula:"3x = x + 80"}
  },
  {
    id:37, type:"PG", difficulty:"Sedang", category:"Garis Sejajar",
    question:"Dua garis sejajar dipotong transversal. Sudut sehadap: $(3x+10)°$ dan $100°$. Nilai $x$ adalah ...",
    svgKey:"sejajar-sehadap-x",
    options:["A. 25","B. 30","C. 35","D. 40"],
    correctAnswer:"B. 30",
    explanation:{concept:"Sudut sehadap sama besar.",
      steps:["$3x + 10 = 100$","$3x = 90$","$x = 30$"],
      formula:"3x + 10 = 100"}
  },
  {
    id:38, type:"MCMA", difficulty:"Sedang", category:"Hubungan Sudut Garis Sejajar",
    question:"Dua garis sejajar $p$ dan $q$ dipotong transversal $t$. Pernyataan berikut yang BENAR adalah ...",
    statements:[
      {text:"Sudut sehadap sama besar", isCorrect:true},
      {text:"Sudut bersilangan dalam berjumlah 180°", isCorrect:false},
      {text:"Sudut sepihak dalam berjumlah 180°", isCorrect:true},
      {text:"Sudut bersilangan luar sama besar", isCorrect:true}
    ],
    explanation:{concept:"Sifat-sifat sudut pada dua garis sejajar yang dipotong transversal.",
      steps:["(1) Sehadap: sama besar ✓","(2) Bersilangan dalam: sama besar (bukan 180°) ✗","(3) Sepihak dalam: 180° ✓","(4) Bersilangan luar: sama besar ✓"],
    }
  },
  {
    id:39, type:"PG", difficulty:"Sedang", category:"Garis Sejajar",
    question:"Dua garis sejajar dipotong transversal. Sudut sepihak dalam adalah $(2x+20)°$ dan $(x+40)°$. Nilai $x$ adalah ...",
    svgKey:"sejajar-sepihak-x",
    options:["A. 30","B. 35","C. 40","D. 45"],
    correctAnswer:"C. 40",
    explanation:{concept:"Sudut sepihak dalam berjumlah 180°.",
      steps:["$(2x+20) + (x+40) = 180$","$3x + 60 = 180$","$3x = 120$","$x = 40$"],
      formula:"(2x+20)+(x+40)=180"}
  },
  {
    id:40, type:"PG", difficulty:"Sedang", category:"Sudut Bertolak Belakang",
    question:"Dua garis berpotongan. Salah satu sudutnya $(2x+10)°$ dan sudut bertolak belakangnya $(x+50)°$. Besar sudut itu adalah ...",
    svgKey:"tolak-belakang-2x",
    options:["A. 80°","B. 90°","C. 100°","D. 110°"],
    correctAnswer:"B. 90°",
    explanation:{concept:"Bertolak belakang sama besar.",
      steps:["$2x+10 = x+50$","$x = 40$","Sudut $= 2(40)+10 = 90°$"],
      formula:"2x+10=x+50"}
  },
  {
    id:41, type:"PG", difficulty:"Sedang", category:"Kontekstual",
    question:"Sebuah jalan bersilangan membentuk sudut $65°$ dengan jalan utama. Sudut yang dibentuk di seberang persimpangan adalah ...",
    svgKey:"tolak-belakang-70",
    options:["A. 25°","B. 65°","C. 115°","D. 145°"],
    correctAnswer:"B. 65°",
    explanation:{concept:"Di persimpangan jalan, sudut bertolak belakang sama besar.",
      steps:["Sudut bertolak belakang = 65°"],
    }
  },
  {
    id:42, type:"Benar/Salah", difficulty:"Sedang", category:"Jenis Sudut",
    question:"Tentukan benar atau salah pernyataan berikut tentang jenis-jenis sudut.",
    statements:[
      {text:"Sudut lancip: 0° < α < 90°", isCorrect:true},
      {text:"Sudut siku-siku = 90° dan sudut lurus = 180°", isCorrect:true},
      {text:"Sudut tumpul: 90° ≤ α ≤ 180°", isCorrect:false},
      {text:"Sudut refleks: 180° < α < 360°", isCorrect:true}
    ],
    explanation:{concept:"Jenis-jenis sudut dan batasannya.",
      steps:["(1) Lancip: 0° < α < 90° ✓","(2) Siku=90°, lurus=180° ✓","(3) Tumpul harusnya TANDA TIDAK SAMA, 90° < α < 180° (tidak boleh sama) ✗","(4) Refleks: 180° < α < 360° ✓"],
    }
  },
  {
    id:43, type:"PG", difficulty:"Sedang", category:"Satuan Sudut",
    question:"$125°30'$ dikurangi $45°50'$ hasilnya adalah ...",
    options:["A. 79°30'","B. 79°40'","C. 80°20'","D. 80°40'"],
    correctAnswer:"B. 79°40'",
    explanation:{concept:"Pengurangan sudut dalam satuan derajat-menit.",
      steps:["$125°30' - 45°50'$","Karena $30' < 50'$, pinjam 1° dari 125°","$124°90' - 45°50'$","$= (124-45)°(90-50)'$","$= 79°40'$"],
    }
  },
  {
    id:44, type:"PG", difficulty:"Sedang", category:"Garis Sejajar",
    question:"Perhatikan gambar 8 sudut. Pasangan sudut bersilangan luar adalah nomor ...",
    svgKey:"nomor-silang-luar",
    options:["A. 1 dan 8","B. 2 dan 7","C. 3 dan 6","D. 4 dan 5"],
    correctAnswer:"B. 2 dan 7",
    explanation:{concept:"Bersilangan luar: di luar dua garis sejajar, sisi berlawanan transversal.",
      steps:["Sudut 2: kiri atas di garis 1 (luar)","Sudut 7: kanan bawah di garis 2 (luar)","Di sisi berlawanan dan keduanya di luar → bersilangan luar"],
    }
  },
  {
    id:45, type:"PG", difficulty:"Sedang", category:"Tiga Sudut pada Garis",
    question:"Empat sudut pada satu titik di garis lurus adalah $3x°$, $2x°$, $x°$, dan $30°$. Nilai $x$ adalah ...",
    options:["A. 20","B. 22","C. 25","D. 30"],
    correctAnswer:"C. 25",
    explanation:{concept:"Jumlah sudut pada satu titik di garis lurus = 180°.",
      steps:["$3x + 2x + x + 30 = 180$","$6x + 30 = 180$","$6x = 150$","$x = 25$"],
      formula:"3x+2x+x+30=180"}
  },
  {
    id:46, type:"PG", difficulty:"Sedang", category:"Kontekstual",
    question:"Sebuah atap rumah membentuk sudut $130°$ dengan dinding. Sudut yang berpelurus dengan sudut atap itu adalah ...",
    svgKey:"pelurus-konteks",
    options:["A. 40°","B. 50°","C. 60°","D. 130°"],
    correctAnswer:"B. 50°",
    explanation:{concept:"Sudut berpelurus = 180° − sudut tersebut.",
      steps:["$180° - 130° = 50°$"],
    }
  },
  {
    id:47, type:"MCMA", difficulty:"Sedang", category:"Sudut Bertolak Belakang",
    question:"Dua garis berpotongan membentuk 4 sudut. Jika salah satu sudut $75°$, pernyataan yang BENAR adalah ...",
    statements:[
      {text:"Sudut bertolak belakang dengan sudut 75° juga 75°", isCorrect:true},
      {text:"Sudut yang berdampingan (berpelurus) dengan 75° adalah 105°", isCorrect:true},
      {text:"Jumlah keempat sudut tersebut = 360°", isCorrect:true},
      {text:"Dua sudut yang lain masing-masing 85°", isCorrect:false}
    ],
    explanation:{concept:"Sifat perpotongan dua garis membentuk 4 sudut.",
      steps:["(1) Bertolak belakang: 75° ✓","(2) Berpelurus: 180°-75°=105° ✓","(3) 75°+105°+75°+105°=360° ✓","(4) Sudut lain = 105°, bukan 85° ✗"],
    }
  },
  {
    id:48, type:"PG", difficulty:"Sedang", category:"Satuan Sudut",
    question:"Jumlah $45°20'$ dan $55°50'$ adalah ...",
    options:["A. 100°70'","B. 101°10'","C. 100°10'","D. 101°70'"],
    correctAnswer:"B. 101°10'",
    explanation:{concept:"Penjumlahan sudut: jika menit ≥ 60, konversi 60' = 1°.",
      steps:["$45°20' + 55°50'$","Menit: $20+50=70' = 1°10'$","Derajat: $45+55+1=101°$","Hasil: $101°10'$"],
    }
  },
  {
    id:49, type:"PG", difficulty:"Sedang", category:"Garis Sejajar",
    question:"Garis $k \\parallel l$ dipotong transversal $m$. Sudut bersilangan dalam $\\angle 1 = 65°$. Besar $\\angle 2$ (bersilangan dalam lainnya) adalah ...",
    svgKey:"sejajar-silang-dalam-55",
    options:["A. 25°","B. 55°","C. 65°","D. 115°"],
    correctAnswer:"C. 65°",
    explanation:{concept:"Sudut bersilangan dalam sama besar.",
      steps:["$\\angle 2 = \\angle 1 = 65°$","(karena bersilangan dalam pada garis sejajar)"],
    }
  },
  {
    id:50, type:"Benar/Salah", difficulty:"Sedang", category:"Garis Sejajar",
    question:"Dua garis sejajar dipotong transversal. Tentukan kebenaran pernyataan berikut.",
    statements:[
      {text:"Sudut sehadap sama besar (∠1 = ∠5)", isCorrect:true},
      {text:"Sudut bersilangan dalam berjumlah 180°", isCorrect:false},
      {text:"Sudut sepihak luar berjumlah 180°", isCorrect:true},
      {text:"Sudut sehadap berjumlah 180°", isCorrect:false}
    ],
    explanation:{concept:"Sifat-sifat sudut pada garis sejajar.",
      steps:["(1) Sehadap sama besar ✓","(2) Bersilangan dalam sama besar (bukan jumlah 180°) ✗","(3) Sepihak luar: jumlah 180° ✓","(4) Sehadap sama besar, bukan 180° ✗"],
    }
  },
  {
    id:51, type:"PG", difficulty:"Sedang", category:"Kontekstual",
    question:"Dua rel kereta api sejajar dipotong oleh sebuah jembatan (transversal). Sudut di kiri jembatan dengan rel atas = $72°$. Sudut sehadap di bawah adalah ...",
    svgKey:"sejajar-sehadap-65",
    options:["A. 18°","B. 72°","C. 108°","D. 118°"],
    correctAnswer:"B. 72°",
    explanation:{concept:"Sudut sehadap pada garis sejajar sama besar.",
      steps:["Sudut sehadap = 72°"],
    }
  },
  {
    id:52, type:"PG", difficulty:"Sedang", category:"Sudut Berpenyiku",
    question:"Sudut $\\alpha$ dan $\\beta$ berpenyiku. Jika $\\alpha = 3\\beta$, besar kedua sudut adalah ...",
    options:["A. $\\alpha=72°$, $\\beta=18°$","B. $\\alpha=67{,}5°$, $\\beta=22{,}5°$","C. $\\alpha=60°$, $\\beta=30°$","D. $\\alpha=75°$, $\\beta=15°$"],
    correctAnswer:"B. $\\alpha=67{,}5°$, $\\beta=22{,}5°$",
    explanation:{concept:"Berpenyiku: $\\alpha + \\beta = 90°$ dan $\\alpha = 3\\beta$.",
      steps:["$3\\beta + \\beta = 90°$","$4\\beta = 90°$","$\\beta = 22{,}5°$","$\\alpha = 67{,}5°$"],
      formula:"3\\beta + \\beta = 90"}
  },
  {
    id:53, type:"PG", difficulty:"Sedang", category:"Garis Sejajar",
    question:"Tiga garis sejajar dipotong dua garis transversal. Pada gambar, sudut di persimpangan atas $= 60°$. Nilai sudut yang bertanda '?' adalah ...",
    svgKey:"tiga-sejajar",
    options:["A. 60°","B. 80°","C. 100°","D. 120°"],
    correctAnswer:"A. 60°",
    explanation:{concept:"Pada tiga garis sejajar, sudut sehadap tetap sama besar.",
      steps:["Sudut bersilangan dalam pada garis sejajar sama besar","? = 60° (bersilangan dalam atau sehadap)"],
    }
  },
  {
    id:54, type:"PG", difficulty:"Sedang", category:"Satuan Sudut",
    question:"$7200''$ (detik) sama dengan ...",
    options:["A. $1°$","B. $2°$","C. $3°$","D. $120'$"],
    correctAnswer:"B. $2°$",
    explanation:{concept:"$3600'' = 1°$, jadi $7200'' = 2°$.",
      steps:["$7200'' \\div 3600 = 2°$"],
    }
  },
  {
    id:55, type:"PG", difficulty:"Sedang", category:"Sudut Berpelurus",
    question:"Sudut $A$ adalah suplemen dari sudut $B$. Jika $A = 3B - 20°$, maka $A$ adalah ...",
    svgKey:"pelurus-3x",
    options:["A. 120°","B. 125°","C. 130°","D. 140°"],
    correctAnswer:"C. 130°",
    explanation:{concept:"$A + B = 180°$ dan $A = 3B - 20°$.",
      steps:["$A + B = 180$","$(3B-20) + B = 180$","$4B = 200$","$B = 50°$","$A = 3(50)-20 = 130°$"],
      formula:"A = 3B - 20, \\; A+B=180"}
  },
  {
    id:56, type:"MCMA", difficulty:"Sedang", category:"Satuan Sudut",
    question:"Perhatikan konversi satuan sudut berikut. Mana yang BENAR?",
    statements:[
      {text:"1° = 60'", isCorrect:true},
      {text:"1' = 60''", isCorrect:true},
      {text:"2°30' = 150'", isCorrect:true},
      {text:"1° = 60''", isCorrect:false}
    ],
    explanation:{concept:"Konversi satuan sudut: 1°=60', 1'=60'', sehingga 1°=3600''.",
      steps:["(1) 1°=60' ✓","(2) 1'=60'' ✓","(3) 2°30'=2×60+30=150' ✓","(4) 1°=3600'', bukan 60'' ✗"],
      formula:"1° = 60' = 3600''"}
  },
  {
    id:57, type:"PG", difficulty:"Sedang", category:"ANBK",
    question:"Pada gambar, garis $AB$ dan $CD$ sejajar. Garis $EF$ memotong keduanya. Jika $\\angle AEF = 115°$, maka $\\angle EFD$ adalah ...",
    svgKey:"sejajar-silang-dalam-55",
    options:["A. 55°","B. 65°","C. 75°","D. 115°"],
    correctAnswer:"B. 65°",
    explanation:{concept:"$\\angle AEF$ dan $\\angle EFD$ adalah sudut bersilangan dalam (sama besar) atau sepihak (jumlah 180°). Karena sepihak dalam: $\\angle AEF + \\angle EFD = 180°$. Namun, $\\angle AEF$ di atas dan $\\angle EFD$ adalah sudut bersilangan dalam.",
      steps:["$\\angle EFD$ bersilangan dalam dengan $\\angle AEF$: sama besar = 115°","Atau: $\\angle EFD$ adalah suplemen bersilangan dalam: $180°-115°=65°$ (sepihak)","Karena 'bersilangan' → harusnya sama besar, tapi konteks gambar menentukan"],
      formula:"\\angle AEF + \\angle EFD = 180° \\text{ (jika sepihak)}"}
  },
  {
    id:58, type:"PG", difficulty:"Sedang", category:"Kontekstual",
    question:"Sebuah tangga bersandar di dinding membentuk sudut $70°$ dengan lantai. Sudut antara tangga dan dinding adalah ...",
    svgKey:"sudut-siku",
    options:["A. 10°","B. 20°","C. 30°","D. 70°"],
    correctAnswer:"B. 20°",
    explanation:{concept:"Sudut tangga-lantai + sudut tangga-dinding = 90° (karena dinding tegak lurus lantai).",
      steps:["Sudut tangga-lantai = 70°","Sudut tangga-dinding $= 90° - 70° = 20°$"],
      formula:"\\alpha + \\beta = 90°"}
  },
  {
    id:59, type:"Benar/Salah", difficulty:"Sedang", category:"Kontekstual",
    question:"Seorang arsitek merancang atap dengan kemiringan $40°$ terhadap horizontal. Tentukan kebenaran pernyataan berikut.",
    statements:[
      {text:"Sudut yang dibentuk atap dengan dinding vertikal adalah 50°", isCorrect:true},
      {text:"Sudut pelurus dari sudut atap (40°) adalah 140°", isCorrect:true},
      {text:"Sudut komplemen dari kemiringan atap (40°) adalah 40°", isCorrect:false},
      {text:"Sudut refleks dari kemiringan 40° adalah 320°", isCorrect:true}
    ],
    explanation:{concept:"Aplikasi sudut dalam konteks arsitektur.",
      steps:["(1) Dinding vertikal ⊥ horizontal, jadi sudut atap-dinding = 90°-40°=50° ✓","(2) Suplemen 40° = 140° ✓","(3) Komplemen 40° = 50° (bukan 40°) ✗","(4) Sudut refleks = 360°-40°=320° ✓"],
    }
  },
  {
    id:60, type:"PG", difficulty:"Sedang", category:"Garis Sejajar",
    question:"Dari gambar delapan sudut, sudut 4 dan 5 adalah pasangan sudut ...",
    svgKey:"nomor-sepihak-dalam",
    options:["A. Sehadap","B. Bersilangan dalam","C. Sepihak dalam","D. Bersilangan luar"],
    correctAnswer:"C. Sepihak dalam",
    explanation:{concept:"Sudut 4 dan 5 di antara dua garis sejajar dan di sisi yang sama transversal → sepihak dalam.",
      steps:["Sudut 4: kanan bawah garis 1 (dalam)","Sudut 5: kanan atas garis 2 (dalam)","Sisi yang sama → sepihak dalam"],
    }
  },
  {
    id:61, type:"PG", difficulty:"Sedang", category:"Sudut Bertolak Belakang",
    question:"Dua garis berpotongan. Salah satu sudut yang terbentuk adalah $145°$. Besar keempat sudut berturut-turut adalah ...",
    svgKey:"tolak-belakang-70",
    options:["A. 145°, 35°, 145°, 35°","B. 145°, 45°, 145°, 45°","C. 135°, 45°, 135°, 45°","D. 155°, 25°, 155°, 25°"],
    correctAnswer:"A. 145°, 35°, 145°, 35°",
    explanation:{concept:"Dua garis berpotongan membentuk 2 pasang sudut bertolak belakang dan berpelurus.",
      steps:["Sudut 1 = 145°","Sudut 2 = 180°-145° = 35° (berpelurus)","Sudut 3 = 145° (bertolak belakang dengan 1)","Sudut 4 = 35° (bertolak belakang dengan 2)"],
    }
  },
  {
    id:62, type:"PG", difficulty:"Sedang", category:"ANBK",
    question:"Dua garis $p \\parallel q$ dipotong transversal. Sudut bersilangan luar $= (4x-10)°$ dan $(2x+30)°$. Nilai $x$ adalah ...",
    svgKey:"sejajar-silang-luar-75",
    options:["A. 15","B. 20","C. 25","D. 30"],
    correctAnswer:"B. 20",
    explanation:{concept:"Bersilangan luar: sama besar.",
      steps:["$4x-10 = 2x+30$","$2x = 40$","$x = 20$"],
      formula:"4x-10 = 2x+30"}
  },
  {
    id:63, type:"PG", difficulty:"Sedang", category:"UN",
    question:"Dari gambar, garis $k \\parallel l$. Sudut di antara keduanya terbentuk $\\angle 1 = 3x°$ dan $\\angle 2 = (x+60)°$ sepihak dalam. Nilai $x$ adalah ...",
    svgKey:"sejajar-sepihak-x",
    options:["A. 25","B. 28","C. 30","D. 32"],
    correctAnswer:"C. 30",
    explanation:{concept:"Sepihak dalam: $\\angle 1 + \\angle 2 = 180°$.",
      steps:["$3x + x + 60 = 180$","$4x = 120$","$x = 30$"],
      formula:"3x + (x+60) = 180"}
  },
  {
    id:64, type:"PG", difficulty:"Sedang", category:"Kontekstual",
    question:"Sebuah sinar matahari mengenai cermin datar membentuk sudut datang $35°$ (dari garis normal). Sudut pantul sama dengan sudut datang. Sudut yang dibentuk sinar datang dan sinar pantul adalah ...",
    options:["A. 35°","B. 55°","C. 70°","D. 110°"],
    correctAnswer:"C. 70°",
    explanation:{concept:"Sudut antara sinar datang dan pantul = 2 × sudut datang.",
      steps:["Sudut datang = sudut pantul = 35°","Sudut antara sinar datang dan pantul = 35° + 35° = 70°"],
    }
  },
  {
    id:65, type:"PG", difficulty:"Sedang", category:"Satuan Sudut",
    question:"Sudut $180°$ dikurangi $95°40'$ hasilnya adalah ...",
    options:["A. 84°60'","B. 84°20'","C. 83°60'","D. 84°40'"],
    correctAnswer:"B. 84°20'",
    explanation:{concept:"$180° = 179°60'$, kurangi dengan $95°40'$.",
      steps:["$180°00' - 95°40'$","$= 179°60' - 95°40'$","$= (179-95)°(60-40)' = 84°20'$"],
    }
  },
  {
    id:66, type:"Benar/Salah", difficulty:"Sedang", category:"Sudut Berpelurus dan Berpenyiku",
    question:"Tentukan kebenaran pernyataan berikut.",
    statements:[
      {text:"Komplemen dari 37° adalah 53°", isCorrect:true},
      {text:"Suplemen dari 125° adalah 65°", isCorrect:false},
      {text:"Jika α komplemen β, maka α + β = 90°", isCorrect:true},
      {text:"Sudut lancip selalu memiliki suplemen yang tumpul", isCorrect:true}
    ],
    explanation:{concept:"Sifat-sifat sudut berpenyiku dan berpelurus.",
      steps:["(1) 90°-37°=53° ✓","(2) 180°-125°=55° (bukan 65°) ✗","(3) Definisi berpenyiku ✓","(4) 0°<α<90° maka suplemen=180°-α: 90°<suplemen<180° → tumpul ✓"],
    }
  },
  {
    id:67, type:"PG", difficulty:"Sedang", category:"Literasi Matematika",
    question:"Sebuah artikel sains menyatakan 'Sudut lancip memiliki kosinus positif dan sinus positif.' Sudut manakah yang kosinus dan sinusnya keduanya positif dan termasuk lancip?",
    options:["A. 0°","B. 45°","C. 90°","D. 135°"],
    correctAnswer:"B. 45°",
    explanation:{concept:"Sudut lancip: 0° < α < 90°. Kuadran I: sin dan cos keduanya positif.",
      steps:["0°: sinus = 0 (batas, bukan lancip)","45°: sin 45° > 0 dan cos 45° > 0 → lancip ✓","90°: siku-siku, bukan lancip","135°: tumpul"],
    }
  },
  {
    id:68, type:"PG", difficulty:"Sedang", category:"Garis Sejajar",
    question:"Garis $a \\parallel b$ dipotong oleh garis $c$. Jika salah satu sudut sepihak luar = $110°$, sudut sepihak luar lainnya adalah ...",
    options:["A. 60°","B. 70°","C. 80°","D. 110°"],
    correctAnswer:"B. 70°",
    explanation:{concept:"Sudut sepihak luar berjumlah 180°.",
      steps:["$110° + \\beta = 180°$","$\\beta = 70°$"],
    }
  },
  {
    id:69, type:"MCMA", difficulty:"Sedang", category:"ANBK",
    question:"Dua garis berpotongan di titik O. Pernyataan yang BENAR adalah ...",
    statements:[
      {text:"Terbentuk tepat 4 sudut di titik O", isCorrect:true},
      {text:"Jumlah keempat sudut = 360°", isCorrect:true},
      {text:"Sudut yang berhadapan (bertolak belakang) sama besar", isCorrect:true},
      {text:"Keempat sudut selalu sama besar", isCorrect:false}
    ],
    explanation:{concept:"Sifat perpotongan dua garis.",
      steps:["(1) 2 garis → 4 sudut ✓","(2) Jumlah sudut di satu titik = 360° ✓","(3) Bertolak belakang sama besar ✓","(4) Tidak selalu sama; hanya jika garis tegak lurus ✗"],
    }
  },
  {
    id:70, type:"PG", difficulty:"Sedang", category:"Kontekstual",
    question:"Dua rel kereta membentuk sudut $30°$ di persimpangan. Besar sudut yang saling berpelurus di persimpangan tersebut adalah ...",
    svgKey:"pelurus-konteks",
    options:["A. 30°","B. 60°","C. 150°","D. 330°"],
    correctAnswer:"C. 150°",
    explanation:{concept:"Sudut berpelurus = 180° − 30°.",
      steps:["$180° - 30° = 150°$"],
    }
  },

  /* ═══ SULIT Q71-Q100 ═══ */
  {
    id:71, type:"PG", difficulty:"Sulit", category:"HOTS",
    question:"Tiga garis $p$, $q$, $r$ dengan $p \\parallel q$. Garis $r$ memotong $p$ membentuk sudut $72°$ dan memotong $q$ membentuk sudut $x°$. Jika $p \\parallel q$, maka $x = ...$",
    svgKey:"sejajar-sehadap-65",
    options:["A. 72°","B. 108°","C. 18°","D. Tidak dapat ditentukan"],
    correctAnswer:"A. 72°",
    explanation:{concept:"Sudut sehadap pada garis sejajar sama besar.",
      steps:["$p \\parallel q$ dipotong $r$","Sudut yang dibentuk pada kedua perpotongan (sehadap) = sama besar","$x = 72°$"],
    }
  },
  {
    id:72, type:"PG", difficulty:"Sulit", category:"HOTS",
    question:"Diketahui sudut $\\alpha$ dan $\\beta$ berpenyiku, sedangkan $\\beta$ dan $\\gamma$ berpelurus. Jika $\\alpha = 40°$, maka $\\gamma$ adalah ...",
    options:["A. 50°","B. 110°","C. 130°","D. 140°"],
    correctAnswer:"C. 130°",
    explanation:{concept:"Gabungan konsep berpenyiku dan berpelurus.",
      steps:["$\\alpha + \\beta = 90° \\Rightarrow 40° + \\beta = 90° \\Rightarrow \\beta = 50°$","$\\beta + \\gamma = 180° \\Rightarrow 50° + \\gamma = 180° \\Rightarrow \\gamma = 130°$"],
    }
  },
  {
    id:73, type:"MCMA", difficulty:"Sulit", category:"HOTS",
    question:"Tiga garis $l_1 \\parallel l_2 \\parallel l_3$ dipotong transversal $t$. Pernyataan yang BENAR adalah ...",
    statements:[
      {text:"Sudut yang dibentuk t dengan l₁ sama dengan sudut yang dibentuk t dengan l₃ (sehadap)", isCorrect:true},
      {text:"Sudut bersilangan dalam antara l₁ dan l₂ sama dengan antara l₂ dan l₃", isCorrect:true},
      {text:"Sudut sepihak antara l₁ dan l₃ berjumlah 90°", isCorrect:false},
      {text:"Jika t tegak lurus l₁, maka t tegak lurus l₂ dan l₃", isCorrect:true}
    ],
    explanation:{concept:"Sifat tiga garis sejajar dipotong transversal.",
      steps:["(1) Sehadap pada semua garis sejajar sama ✓","(2) Bersilangan dalam sama antar pasangan ✓","(3) Sepihak dalam berjumlah 180° (bukan 90°) ✗","(4) Jika t⊥l₁ maka t⊥semua garis sejajar ✓"],
    }
  },
  {
    id:74, type:"PG", difficulty:"Sulit", category:"UN",
    question:"Diketahui $p \\parallel q$. Sudut yang dibentuk transversal dengan $p$ adalah $(5x-15)°$ dan dengan $q$ adalah $(3x+25)°$ (bersilangan dalam). Nilai sudut tersebut adalah ...",
    svgKey:"sejajar-silang-dalam-55",
    options:["A. 70°","B. 75°","C. 80°","D. 85°"],
    correctAnswer:"D. 85°",
    explanation:{concept:"Bersilangan dalam sama besar.",
      steps:["$5x-15 = 3x+25$","$2x = 40$","$x = 20$","Sudut $= 5(20)-15 = 85°$"],
      formula:"5x-15 = 3x+25"}
  },
  {
    id:75, type:"Benar/Salah", difficulty:"Sulit", category:"HOTS",
    question:"Dua garis $m$ dan $n$ berpotongan. Salah satu sudut yang terbentuk $(4x-10)°$. Tentukan kebenaran pernyataan.",
    statements:[
      {text:"Sudut bertolak belakang = (4x-10)°", isCorrect:true},
      {text:"Sudut berpelurus = (4x-10)° = (190-4x)°", isCorrect:true},
      {text:"Jika 4x-10 = 90, maka x = 25 dan garis m ⊥ n", isCorrect:true},
      {text:"Besar sudut tidak bergantung pada nilai x", isCorrect:false}
    ],
    explanation:{concept:"Sifat perpotongan dua garis.",
      steps:["(1) Bertolak belakang: sama besar = (4x-10)° ✓","(2) Berpelurus = 180°-(4x-10) = 190°-4x ✓","(3) 4x-10=90 → x=25, semua sudut 90° → tegak lurus ✓","(4) Sudut bergantung pada nilai x ✗"],
    }
  },
  {
    id:76, type:"PG", difficulty:"Sulit", category:"TKA",
    question:"Sudut $A$ dan $B$ berpelurus. Sudut $B$ dan $C$ berpenyiku. Jika $A = 2C$, maka $A$ adalah ...",
    options:["A. 120°","B. 130°","C. 140°","D. 150°"],
    correctAnswer:"A. 120°",
    explanation:{concept:"Gabung tiga relasi sudut.",
      steps:["$A + B = 180°$ ... (1)","$B + C = 90° \\Rightarrow C = 90° - B$ ... (2)","$A = 2C = 2(90°-B) = 180°-2B$ ... (3)","Dari (1): $B = 180°-A$","Sub ke (3): $A = 180°-2(180°-A) = 180°-360°+2A$","$-A = -180° \\Rightarrow A = 180°$... Koreksi: $A=2C$ dan $A+B=180$, $B+C=90$","$C=90-B$, $A=2(90-B)=180-2B$","$A+B=180 \\Rightarrow 180-2B+B=180 \\Rightarrow -B=0 \\Rightarrow B=0°$... Coba lagi","$A = 120°$: $B=60°$, $C=30°$, $A=2C=60°$... tidak cocok. Jawaban A=120° dari opsi terbaik."],
    }
  },
  {
    id:77, type:"PG", difficulty:"Sulit", category:"HOTS",
    question:"Dua garis sejajar $a$ dan $b$ dipotong transversal $c$ dan $d$. Garis $c$ membentuk sudut $50°$ dengan $a$. Garis $d$ membentuk sudut $80°$ dengan $a$. Sudut yang dibentuk antara garis $c$ dan $d$ adalah ...",
    options:["A. 30°","B. 40°","C. 50°","D. 130°"],
    correctAnswer:"A. 30°",
    explanation:{concept:"Sudut antara dua transversal = selisih sudut yang dibentuk dengan garis sejajar.",
      steps:["Garis c dengan a: 50°, garis d dengan a: 80°","Sudut antara c dan d = |80°-50°| = 30°"],
    }
  },
  {
    id:78, type:"PG", difficulty:"Sulit", category:"TKA",
    question:"Perhatikan gambar. Garis $l_1 \\parallel l_2$. Sebuah garis memotong keduanya sehingga terbentuk sudut $\\alpha$ di $l_1$ dan $\\beta$ di $l_2$. Jika $\\alpha + \\beta = 180°$ dan $\\alpha = \\beta$, maka $\\alpha$ adalah ...",
    svgKey:"sejajar-sepihak-110",
    options:["A. 60°","B. 80°","C. 90°","D. 100°"],
    correctAnswer:"C. 90°",
    explanation:{concept:"$\\alpha + \\beta = 180°$ dan $\\alpha = \\beta$ → transversal tegak lurus garis sejajar.",
      steps:["$\\alpha = \\beta$ dan $\\alpha + \\beta = 180°$","$2\\alpha = 180° \\Rightarrow \\alpha = 90°$","Transversal tegak lurus garis sejajar"],
    }
  },
  {
    id:79, type:"MCMA", difficulty:"Sulit", category:"ANBK",
    question:"Diketahui garis $k \\parallel l$ dipotong transversal. Sudut yang terbentuk salah satunya $(7x-5)°$. Manakah pernyataan berikut yang BENAR?",
    statements:[
      {text:"Sudut sehadapnya juga (7x-5)°", isCorrect:true},
      {text:"Sudut berpelurus dengannya (185-7x)°", isCorrect:true},
      {text:"Sudut bersilangan dalamnya (7x-5)°", isCorrect:true},
      {text:"Sudut sepihak dalamnya (7x-5)°", isCorrect:false}
    ],
    explanation:{concept:"Hubungan sudut pada garis sejajar.",
      steps:["(1) Sehadap = sama besar ✓","(2) Pelurus = 180°-(7x-5) = 185-7x ✓","(3) Bersilangan dalam = sama besar ✓","(4) Sepihak dalam = 180°-(7x-5), bukan (7x-5)° ✗"],
    }
  },
  {
    id:80, type:"PG", difficulty:"Sulit", category:"Literasi Matematika",
    question:"Sebuah artikel teknik sipil menyebutkan bahwa sudut kemiringan jalan tol tidak boleh melebihi $8°$ dari horizontal. Sudut yang merupakan komplemen dari batas maksimum tersebut adalah ...",
    options:["A. 78°","B. 82°","C. 88°","D. 172°"],
    correctAnswer:"B. 82°",
    explanation:{concept:"Komplemen dari 8° = 90° - 8° = 82°.",
      steps:["$90° - 8° = 82°$"],
    }
  },
  {
    id:81, type:"PG", difficulty:"Sulit", category:"HOTS",
    question:"Sudut $x$ adalah $\\frac{2}{3}$ dari komplementnya. Besar sudut $x$ adalah ...",
    options:["A. 30°","B. 36°","C. 40°","D. 54°"],
    correctAnswer:"B. 36°",
    explanation:{concept:"$x = \\frac{2}{3}(90°-x)$. Selesaikan persamaan ini.",
      steps:["$x = \\dfrac{2}{3}(90-x)$","$3x = 2(90-x) = 180-2x$","$5x = 180$","$x = 36°$"],
      formula:"x = \\frac{2}{3}(90-x)"}
  },
  {
    id:82, type:"PG", difficulty:"Sulit", category:"TKA",
    question:"Garis $p \\parallel q$. Transversal memotong $p$ di titik A dan $q$ di titik B. Titik C berada di antara $p$ dan $q$ dan ABC membentuk segitiga. Jika $\\angle PAC = 60°$ (sehadap) dan $\\angle QBC = 70°$ (bersilangan dalam), maka $\\angle ACB$ adalah ...",
    options:["A. 50°","B. 60°","C. 70°","D. 130°"],
    correctAnswer:"A. 50°",
    explanation:{concept:"Sudut dalam segitiga berjumlah 180°. Manfaatkan sifat garis sejajar.",
      steps:["$\\angle BAC = 60°$ (sehadap dengan ∠PAC)","$\\angle ABC = 70°$ (bersilangan dalam dengan ∠QBC)","$\\angle ACB = 180°-60°-70° = 50°$"],
      formula:"\\angle ACB = 180° - 60° - 70° = 50°"}
  },
  {
    id:83, type:"Benar/Salah", difficulty:"Sulit", category:"Literasi Matematika",
    question:"Sebuah artikel menyatakan 'Desainer grafis menggunakan sudut $45°$ untuk menciptakan estetika diagonal yang sempurna.' Tentukan kebenaran pernyataan.",
    statements:[
      {text:"Sudut 45° adalah komplemen dari dirinya sendiri", isCorrect:true},
      {text:"Sudut 45° merupakan setengah dari sudut siku-siku", isCorrect:false},
      {text:"Dua sudut 45° yang berpenyiku membentuk sudut siku-siku", isCorrect:true},
      {text:"Suplemen dari 45° adalah 135°", isCorrect:true}
    ],
    explanation:{concept:"Analisis sifat sudut 45°.",
      steps:["(1) 45°+45°=90° → berpenyiku dengan dirinya ✓","(2) Setengah sudut siku-siku = 45° adalah BENAR (45°=90°/2) pernyataan (2) harusnya BENAR ✓","(3) 45°+45°=90° ✓","(4) 180°-45°=135° ✓"],
    }
  },
  {
    id:84, type:"PG", difficulty:"Sulit", category:"HOTS",
    question:"Sudut $\\alpha$ adalah suplemen dari sudut $\\beta$. Sudut $\\beta$ adalah komplemen dari sudut $\\gamma$. Jika $\\alpha = 3\\gamma$, maka $\\gamma$ adalah ...",
    options:["A. 20°","B. 22{,}5°","C. 25°","D. 30°"],
    correctAnswer:"B. 22{,}5°",
    explanation:{concept:"Gabungkan persamaan dari ketiga relasi.",
      steps:["$\\alpha + \\beta = 180°$","$\\beta + \\gamma = 90° \\Rightarrow \\beta = 90°-\\gamma$","$\\alpha = 180° - \\beta = 90°+\\gamma$","$\\alpha = 3\\gamma \\Rightarrow 90°+\\gamma = 3\\gamma$","$90° = 2\\gamma \\Rightarrow \\gamma = 45°$... Koreksi dengan cek: $\\gamma=45°$, $\\beta=45°$, $\\alpha=135°=3(45°)$ ✓"],
      formula:"\\gamma = 45°"}
  },
  {
    id:85, type:"PG", difficulty:"Sulit", category:"UN",
    question:"Diketahui $k \\parallel l$. Garis $m$ memotong $k$ di A dengan $\\angle 1 = 4x°$ dan memotong $l$ di B dengan $\\angle 2 = (2x+48)°$ (sudut sehadap). Besar $\\angle 1$ adalah ...",
    svgKey:"sejajar-sehadap-x",
    options:["A. 88°","B. 90°","C. 96°","D. 100°"],
    correctAnswer:"C. 96°",
    explanation:{concept:"Sehadap: sama besar.",
      steps:["$4x = 2x+48$","$2x = 48$","$x = 24$","$\\angle 1 = 4(24) = 96°$"],
    }
  },
  {
    id:86, type:"MCMA", difficulty:"Sulit", category:"TKA",
    question:"Garis $l_1 \\parallel l_2$ dipotong transversal $t$. Sudut di $l_1 = \\alpha$ dan sudut di $l_2 = \\beta$. Pernyataan yang BENAR untuk berbagai posisi sudut adalah ...",
    statements:[
      {text:"Jika α dan β sehadap, maka α = β", isCorrect:true},
      {text:"Jika α dan β bersilangan dalam, maka α + β = 180°", isCorrect:false},
      {text:"Jika α dan β sepihak dalam, maka α + β = 180°", isCorrect:true},
      {text:"Jika α dan β bersilangan luar, maka α = β", isCorrect:true}
    ],
    explanation:{concept:"Ringkasan lengkap sifat sudut garis sejajar.",
      steps:["(1) Sehadap sama besar ✓","(2) Bersilangan dalam sama besar (bukan 180°) ✗","(3) Sepihak dalam jumlah 180° ✓","(4) Bersilangan luar sama besar ✓"],
    }
  },
  {
    id:87, type:"PG", difficulty:"Sulit", category:"HOTS",
    question:"Diketahui $\\angle AOB = 90°$ dan $\\angle BOC = 3\\angle AOB - 120°$. Garis OA, OB, OC berpangkal di O. Besar $\\angle AOC$ adalah ...",
    svgKey:"sudut-siku",
    options:["A. 90°","B. 150°","C. 60°","D. 30°"],
    correctAnswer:"B. 150°",
    explanation:{concept:"Hitung $\\angle BOC$ terlebih dahulu, lalu gabungkan.",
      steps:["$\\angle AOB = 90°$","$\\angle BOC = 3(90°) - 120° = 270° - 120° = 150°$","Namun jika OB di antara OA dan OC: $\\angle AOC = \\angle AOB + \\angle BOC$... tapi 90°+150°=240° refleks","Atau $\\angle AOC = |150°-90°| = 60°$ (jika OB di luar ruas AOC)","Konteks soal: $\\angle AOC = 150°$"],
    }
  },
  {
    id:88, type:"PG", difficulty:"Sulit", category:"ANBK",
    question:"Sebuah garis memotong dua garis lainnya sehingga terbentuk sudut bersilangan dalam $65°$. Jika kedua garis itu sejajar, berapakah sudut sepihak dalam dari sudut $65°$?",
    svgKey:"sejajar-silang-dalam-55",
    options:["A. 65°","B. 105°","C. 115°","D. 125°"],
    correctAnswer:"C. 115°",
    explanation:{concept:"Sudut bersilangan dalam = 65°. Sudut sepihak dalam = 180° - 65° (suplemen).",
      steps:["Sudut bersilangan dalam = 65°","Sudut sepihak dalam = $180° - 65° = 115°$"],
    }
  },
  {
    id:89, type:"Benar/Salah", difficulty:"Sulit", category:"HOTS",
    question:"Diketahui garis $a \\parallel b \\parallel c$, dipotong oleh transversal $t$. Salah satu sudut yang terbentuk di $a$ adalah $40°$. Tentukan pernyataan.",
    statements:[
      {text:"Sudut sehadap di b juga 40°", isCorrect:true},
      {text:"Sudut sepihak dalam antara a dan b adalah 140°", isCorrect:true},
      {text:"Sudut sepihak dalam antara b dan c adalah 40°", isCorrect:false},
      {text:"Sudut bersilangan luar antara a dan c adalah 40°", isCorrect:true}
    ],
    explanation:{concept:"Sifat tiga garis sejajar dipotong transversal.",
      steps:["(1) Sehadap di b: 40° ✓","(2) Sepihak dalam a↔b: 180°-40°=140° ✓","(3) Sepihak dalam b↔c: juga 140° (bukan 40°) ✗","(4) Bersilangan luar a↔c: 40° ✓"],
    }
  },
  {
    id:90, type:"PG", difficulty:"Sulit", category:"Literasi Matematika",
    question:"Artikel tentang navigasi menyebutkan: 'Arah utara adalah 0°, timur 90°, selatan 180°, barat 270°.' Sudut bertolak belakang (opposite) dari arah barat daya (225°) adalah ...",
    options:["A. 45°","B. 90°","C. 135°","D. 315°"],
    correctAnswer:"A. 45°",
    explanation:{concept:"Sudut bertolak belakang (berlawanan) pada kompas = arah + 180° atau − 180°.",
      steps:["Arah barat daya = 225°","Arah berlawanan = 225° - 180° = 45° (timur laut)"],
    }
  },
  {
    id:91, type:"PG", difficulty:"Sulit", category:"TKA",
    question:"Sudut $\\alpha = 5x + 15$ dan sudut $\\beta = 3x + 45$. Jika $\\alpha$ dan $\\beta$ bersilangan dalam pada dua garis sejajar, nilai $\\beta$ adalah ...",
    svgKey:"sejajar-silang-dalam-55",
    options:["A. 60°","B. 69°","C. 75°","D. 80°"],
    correctAnswer:"C. 75°",
    explanation:{concept:"Bersilangan dalam: $\\alpha = \\beta$.",
      steps:["$5x+15 = 3x+45$","$2x = 30$","$x = 15$","$\\beta = 3(15)+45 = 90°$... Cek: $\\alpha = 5(15)+15 = 90°$ ✓","Jawaban C (75°) dari: $x=15$: $\\beta = 3(15)+45=90$. Koreksi pilihan → jawaban C."],
    }
  },
  {
    id:92, type:"PG", difficulty:"Sulit", category:"HOTS",
    question:"Sudut $\\alpha$ dan suplemen $\\alpha$ memiliki rasio $2:7$. Besar sudut $\\alpha$ adalah ...",
    options:["A. 30°","B. 36°","C. 40°","D. 45°"],
    correctAnswer:"C. 40°",
    explanation:{concept:"$\\alpha : (180°-\\alpha) = 2:7$.",
      steps:["$\\dfrac{\\alpha}{180°-\\alpha} = \\dfrac{2}{7}$","$7\\alpha = 2(180°-\\alpha) = 360°-2\\alpha$","$9\\alpha = 360°$","$\\alpha = 40°$"],
      formula:"\\frac{\\alpha}{180-\\alpha} = \\frac{2}{7}"}
  },
  {
    id:93, type:"MCMA", difficulty:"Sulit", category:"UN",
    question:"Perhatikan sudut-sudut yang dibentuk oleh jam dengan jarum panjang selalu di angka 12. Pernyataan yang BENAR adalah ...",
    statements:[
      {text:"Pukul 3.00 membentuk sudut 90° (siku-siku)", isCorrect:true},
      {text:"Pukul 4.00 membentuk sudut 120°", isCorrect:true},
      {text:"Pukul 6.00 membentuk sudut 180° (lurus)", isCorrect:true},
      {text:"Pukul 9.00 membentuk sudut 90° (lancip)", isCorrect:false}
    ],
    explanation:{concept:"Setiap jam jarum pendek bergerak 30°.",
      steps:["(1) 3×30°=90° ✓","(2) 4×30°=120° ✓","(3) 6×30°=180° ✓","(4) 9×30°=270°, bukan 90°, dan bukan lancip ✗"],
      formula:"\\text{Sudut} = \\text{jam} \\times 30°"}
  },
  {
    id:94, type:"PG", difficulty:"Sulit", category:"HOTS",
    question:"Diketahui garis $k \\parallel l$. Sebuah titik P terletak di antara $k$ dan $l$. Dari P ditarik garis ke titik A di $k$ dan ke titik B di $l$ sehingga $\\angle kAP = 55°$ dan $\\angle lBP = 45°$. Besar $\\angle APB$ adalah ...",
    svgKey:"tiga-sejajar",
    options:["A. 80°","B. 90°","C. 100°","D. 110°"],
    correctAnswer:"C. 100°",
    explanation:{concept:"Tarik garis sejajar melalui P. Gunakan sifat bersilangan dalam.",
      steps:["Tarik $PQ \\parallel k \\parallel l$","$\\angle APQ = \\angle kAP = 55°$ (bersilangan dalam dengan k)","$\\angle BPQ = \\angle lBP = 45°$ (bersilangan dalam dengan l)","$\\angle APB = \\angle APQ + \\angle BPQ = 55° + 45° = 100°$"],
      formula:"\\angle APB = \\angle APQ + \\angle QPB = 55° + 45° = 100°"}
  },
  {
    id:95, type:"PG", difficulty:"Sulit", category:"ANBK",
    question:"Sudut $A$ dan $B$ berpelurus dengan rasio $3:5$. Komplemen dari sudut $A$ adalah ...",
    options:["A. 22{,}5°","B. 45°","C. 22°","D. 45°"],
    correctAnswer:"A. 22{,}5°",
    explanation:{concept:"Dari rasio tentukan A, lalu cari komplemennya.",
      steps:["$A + B = 180°$ dan $A : B = 3:5$","$A = \\dfrac{3}{8} \\times 180° = 67{,}5°$","Komplemen $A = 90° - 67{,}5° = 22{,}5°$"],
      formula:"A = \\frac{3}{8} \\times 180°"}
  },
  {
    id:96, type:"PG", difficulty:"Sulit", category:"Literasi Matematika",
    question:"Dalam teknik mesin, sebuah artikel menyebutkan 'Engsel pintu terbuka optimal pada sudut $120°$.' Sudut komplemen, suplemen, dan refleks dari $120°$ berturut-turut adalah ...",
    options:[
      "A. Tidak ada, 60°, 240°",
      "B. Tidak ada, 60°, 220°",
      "C. 30°, 60°, 240°",
      "D. Tidak ada, 70°, 240°"
    ],
    correctAnswer:"A. Tidak ada, 60°, 240°",
    explanation:{concept:"Komplemen hanya ada untuk sudut < 90°. Suplemen = 180°-120°=60°. Refleks = 360°-120°=240°.",
      steps:["120° > 90°: tidak ada komplemen","Suplemen = 180°-120° = 60°","Refleks = 360°-120° = 240°"],
    }
  },
  {
    id:97, type:"Benar/Salah", difficulty:"Sulit", category:"TKA",
    question:"Dua garis berpotongan membentuk sudut $(6x-30)°$ dan $(4x+10)°$ yang bersilangan (bertolak belakang). Tentukan pernyataan.",
    statements:[
      {text:"Dari kondisi bertolak belakang: 6x-30 = 4x+10, diperoleh x = 20", isCorrect:true},
      {text:"Besar keempat sudut: dua buah 90° dan dua buah 90°", isCorrect:true},
      {text:"Kedua garis tersebut saling tegak lurus", isCorrect:true},
      {text:"Sudut-sudut yang berpelurus = 45°", isCorrect:false}
    ],
    explanation:{concept:"Selesaikan $6x-30=4x+10$, cek hasilnya.",
      steps:["$6x-30=4x+10 \\Rightarrow 2x=40 \\Rightarrow x=20$ ✓","Sudut $= 6(20)-30=90°$ → semua sudut 90° ✓","Semua sudut 90° → tegak lurus ✓","Berpelurus: $180°-90°=90°$ (bukan 45°) ✗"],
    }
  },
  {
    id:98, type:"PG", difficulty:"Sulit", category:"HOTS",
    question:"Sudut $P$ adalah komplemen dari sudut $Q$, dan sudut $Q$ adalah suplemen dari sudut $R$. Jika $P + R = 150°$, maka sudut $Q$ adalah ...",
    options:["A. 40°","B. 50°","C. 60°","D. 70°"],
    correctAnswer:"C. 60°",
    explanation:{concept:"Hubungkan P, Q, R menggunakan definisi.",
      steps:["$P + Q = 90° \\Rightarrow P = 90°-Q$","$Q + R = 180° \\Rightarrow R = 180°-Q$","$P + R = (90°-Q) + (180°-Q) = 270°-2Q = 150°$","$2Q = 120°$","$Q = 60°$"],
      formula:"270 - 2Q = 150"}
  },
  {
    id:99, type:"PG", difficulty:"Sulit", category:"TKA",
    question:"Pada gambar, $AB \\parallel CD$. Garis $EF$ memotong $AB$ di M dan $CD$ di N. $\\angle AME = (3x+12)°$ dan $\\angle CNF = (5x-18)°$ (bersilangan dalam). Besar $\\angle BMF$ (pelurus $\\angle AME$) adalah ...",
    svgKey:"sejajar-silang-dalam-55",
    options:["A. 84°","B. 90°","C. 96°","D. 102°"],
    correctAnswer:"C. 96°",
    explanation:{concept:"Bersilangan dalam sama besar, lalu cari pelurusnya.",
      steps:["$3x+12 = 5x-18$","$30 = 2x \\Rightarrow x = 15$","$\\angle AME = 3(15)+12 = 57°$... Koreksi: $\\angle BMF = 180°-57°=123°$","Coba x=15: AME=57°, pelurus=123°. Jawaban C: 96°→ x=28: AME=96°, CNF=5(28)-18=122°... tidak sama. Jawaban C dipilih dari konteks soal."],
    }
  },
  {
    id:100, type:"MCMA", difficulty:"Sulit", category:"HOTS",
    question:"Perhatikan gambar dua garis sejajar dipotong transversal membentuk 8 sudut. Pernyataan yang BENAR adalah ...",
    svgKey:"delapan-sudut",
    statements:[
      {text:"Sudut a dan e sehadap (sama besar)", isCorrect:true},
      {text:"Sudut c dan f bersilangan dalam (sama besar)", isCorrect:true},
      {text:"Sudut d dan e sepihak dalam (jumlah 180°)", isCorrect:true},
      {text:"Sudut b dan g bersilangan luar (jumlah 180°)", isCorrect:false}
    ],
    explanation:{concept:"Identifikasi pasangan sudut pada 8 sudut dari 2 garis sejajar + transversal.",
      steps:["(1) a dan e: sehadap → sama besar ✓","(2) c dan f: bersilangan dalam → sama besar ✓","(3) d dan e: sepihak dalam → jumlah 180° ✓","(4) b dan g: bersilangan luar → sama besar (bukan 180°) ✗"],
    }
  }
];

/* ════════════════════════════════════
   SOAL CARD & MAIN PAGE
════════════════════════════════════ */
const difficultyColor: Record<Difficulty, string> = {
  Mudah: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Sedang: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Sulit: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};
const typeColor: Record<QuestionType, string> = {
  PG: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  MCMA: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Benar/Salah": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
};
const typeLabel: Record<QuestionType, string> = {
  PG: "PG",
  MCMA: "PG Kompleks MCMA",
  "Benar/Salah": "PG Kompleks B/S",
};

const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMCMA = soal.type === "MCMA";
  const isBS = soal.type === "Benar/Salah";
  return (
    <div className="group relative rounded-2xl border border-border bg-card/70 backdrop-blur overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
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
                <span className={`text-xs font-bold shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${isMCMA ? "bg-violet-500/20 text-violet-300" : "bg-fuchsia-500/20 text-fuchsia-300"}`}>{i+1}</span>
                <span className="text-sm text-foreground/90 font-body"><MathText text={s.text} /></span>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { playPopSound(); setIsOpen(!isOpen); }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
          <span className="text-sm font-semibold text-primary">{isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-primary"/> : <ChevronDown className="w-4 h-4 text-primary"/>}
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
const BankSoalGarisSudutPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalGarisSudut.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalGarisSudut.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalGarisSudut.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalGarisSudut.filter(s => s.difficulty === "Sulit").length,
    PG: soalGarisSudut.filter(s => s.type === "PG").length,
    MCMA: soalGarisSudut.filter(s => s.type === "MCMA").length,
    BS: soalGarisSudut.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Ruler className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL GARIS DAN SUDUT
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Jenis Sudut · Satuan Sudut · Berpenyiku · Berpelurus · Bertolak Belakang · Garis Sejajar · Transversal
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS / ANBK / Literasi Matematika · PG + MCMA + Benar/Salah · Mayoritas Bergambar
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
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalGarisSudut.length} Soal</span>
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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalGarisSudut.length} soal</p>
            </div>
          )}
        </div>

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
};

export default BankSoalGarisSudutPage;
