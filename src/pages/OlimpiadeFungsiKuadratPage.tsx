import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const miniParabola = (r1: number, r2: number, openUp: boolean): ReactNode => {
  const ac = "#67e8f9", cc = "#facc15", tc = "#ffffff";
  const W = 150, H = 78, axisY = 46, scale = 18;
  const midX = (r1 + r2) / 2;
  const originX = W / 2 - midX * scale;
  const r1x = originX + r1 * scale;
  const r2x = originX + r2 * scale;
  const vx = originX + midX * scale;
  const ctrlY = openUp ? axisY + 48 : axisY - 48;
  const axisStart = Math.max(5, r1x - 15);
  const axisEnd = Math.min(W - 12, r2x + 22);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: `${W}px` }} className="mt-1 block">
      <line x1={axisStart} y1={axisY} x2={axisEnd} y2={axisY} stroke={ac} strokeWidth="1.2" />
      <polygon points={`${axisEnd},${axisY-3} ${axisEnd},${axisY+3} ${axisEnd+5},${axisY}`} fill={ac} />
      <text x={axisEnd + 9} y={axisY + 4} fill={tc} fontSize="10" textAnchor="middle" fontStyle="italic">X</text>
      <path d={`M ${r1x},${axisY} Q ${vx},${ctrlY} ${r2x},${axisY}`} fill="none" stroke={cc} strokeWidth="2" />
      <line x1={r1x} y1={axisY - 3} x2={r1x} y2={axisY + 3} stroke={tc} strokeWidth="1" />
      <line x1={r2x} y1={axisY - 3} x2={r2x} y2={axisY + 3} stroke={tc} strokeWidth="1" />
      <text x={r1x} y={axisY + 14} fill={tc} fontSize="9" textAnchor="middle">{r1}</text>
      <text x={r2x} y={axisY + 14} fill={tc} fontSize="9" textAnchor="middle">{r2}</text>
    </svg>
  );
};

const q13Svg = (variant: 'A'|'B'|'C'|'D'): ReactNode => {
  const ac="#67e8f9", cc="#facc15", tc="#ffffff";
  const W=155, H=115;
  const axisArrow = (ex: number, ey: number, dir: 'right'|'up') => dir === 'right'
    ? <polygon points={`${ex-5},${ey-3} ${ex-5},${ey+3} ${ex},${ey}`} fill={ac}/>
    : <polygon points={`${ex-3},${ey+5} ${ex+3},${ey+5} ${ex},${ey}`} fill={ac}/>;

  if (variant === 'A') {
    // a>0, roots -5 and 3, vertex deep below (labeled -15)
    const ox=68, ay=48, sc=10;
    const r1x=ox+(-5)*sc, r2x=ox+3*sc, vx=ox+(-1)*sc, ctrlY=108;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
        <line x1="5" y1={ay} x2="145" y2={ay} stroke={ac} strokeWidth="1.2"/>
        {axisArrow(150,ay,'right')}
        <text x="153" y={ay+4} fill={tc} fontSize="10" textAnchor="middle" fontStyle="italic">X</text>
        <line x1={ox} y1="5" x2={ox} y2="107" stroke={ac} strokeWidth="1.2"/>
        {axisArrow(ox,5,'up')}
        <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">Y</text>
        <path d={`M ${r1x},${ay} Q ${vx},${ctrlY} ${r2x},${ay}`} fill="none" stroke={cc} strokeWidth="2"/>
        <line x1={r1x} y1={ay-3} x2={r1x} y2={ay+3} stroke={tc} strokeWidth="1"/>
        <line x1={r2x} y1={ay-3} x2={r2x} y2={ay+3} stroke={tc} strokeWidth="1"/>
        <text x={r1x} y={ay+13} fill={tc} fontSize="9" textAnchor="middle">-5</text>
        <text x={ox+5} y={ay+13} fill={tc} fontSize="9" textAnchor="start">O</text>
        <text x={r2x} y={ay+13} fill={tc} fontSize="9" textAnchor="middle">3</text>
        <text x={vx-3} y="90" fill={tc} fontSize="9" textAnchor="middle">-15</text>
      </svg>
    );
  }
  if (variant === 'B') {
    // a>0, roots -3 and 5, vertex deep below (labeled -15) — CORRECT answer
    const ox=60, ay=48, sc=11;
    const r1x=ox+(-3)*sc, r2x=ox+5*sc, vx=ox+1*sc, ctrlY=108;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
        <line x1="5" y1={ay} x2="145" y2={ay} stroke={ac} strokeWidth="1.2"/>
        {axisArrow(150,ay,'right')}
        <text x="153" y={ay+4} fill={tc} fontSize="10" textAnchor="middle" fontStyle="italic">X</text>
        <line x1={ox} y1="5" x2={ox} y2="107" stroke={ac} strokeWidth="1.2"/>
        {axisArrow(ox,5,'up')}
        <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">Y</text>
        <path d={`M ${r1x},${ay} Q ${vx},${ctrlY} ${r2x},${ay}`} fill="none" stroke={cc} strokeWidth="2"/>
        <line x1={r1x} y1={ay-3} x2={r1x} y2={ay+3} stroke={tc} strokeWidth="1"/>
        <line x1={r2x} y1={ay-3} x2={r2x} y2={ay+3} stroke={tc} strokeWidth="1"/>
        <text x={r1x} y={ay+13} fill={tc} fontSize="9" textAnchor="middle">-3</text>
        <text x={ox+5} y={ay+13} fill={tc} fontSize="9" textAnchor="start">O</text>
        <text x={r2x} y={ay+13} fill={tc} fontSize="9" textAnchor="middle">5</text>
        <text x={vx-2} y="90" fill={tc} fontSize="9" textAnchor="middle">-15</text>
      </svg>
    );
  }
  if (variant === 'C') {
    // a<0 (∩ shape), roots -3 and 5, vertex labeled 15 at top
    const ox=60, ay=78, sc=11;
    const r1x=ox+(-3)*sc, r2x=ox+5*sc, vx=ox+1*sc, ctrlY=12;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
        <line x1="5" y1={ay} x2="145" y2={ay} stroke={ac} strokeWidth="1.2"/>
        {axisArrow(150,ay,'right')}
        <text x="153" y={ay+4} fill={tc} fontSize="10" textAnchor="middle" fontStyle="italic">X</text>
        <line x1={ox} y1="5" x2={ox} y2="107" stroke={ac} strokeWidth="1.2"/>
        {axisArrow(ox,5,'up')}
        <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">Y</text>
        <path d={`M ${r1x},${ay} Q ${vx},${ctrlY} ${r2x},${ay}`} fill="none" stroke={cc} strokeWidth="2"/>
        <line x1={r1x} y1={ay-3} x2={r1x} y2={ay+3} stroke={tc} strokeWidth="1"/>
        <line x1={r2x} y1={ay-3} x2={r2x} y2={ay+3} stroke={tc} strokeWidth="1"/>
        <text x={r1x} y={ay+13} fill={tc} fontSize="9" textAnchor="middle">-3</text>
        <text x={ox+5} y={ay+13} fill={tc} fontSize="9" textAnchor="start">O</text>
        <text x={r2x} y={ay+13} fill={tc} fontSize="9" textAnchor="middle">5</text>
        <text x={ox-8} y="26" fill={tc} fontSize="9" textAnchor="end">15</text>
        <line x1={ox-3} y1="22" x2={ox+3} y2="22" stroke={tc} strokeWidth="1"/>
      </svg>
    );
  }
  // variant D: a>0, roots 3 and 5, y-intercept=15
  // Represents y=(x-3)(x-5)=x²-8x+15, vertex at (4,-1) barely below x-axis
  // Pixel layout: ox=28 (y-axis), ay=80 (x-axis), scX=16, scY=4
  // Key coords: y-int=(28,20), root3=(76,80), vertex=(92,84), root5=(108,80)
  // Cubic bezier control points derived from actual parabola tangent slopes
  const ox=28, ay=80, r1x=76, r2x=108, yIntY=20;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
      <line x1="5" y1={ay} x2="145" y2={ay} stroke={ac} strokeWidth="1.2"/>
      {axisArrow(150,ay,'right')}
      <text x="153" y={ay+4} fill={tc} fontSize="10" textAnchor="middle" fontStyle="italic">X</text>
      <line x1={ox} y1="5" x2={ox} y2="105" stroke={ac} strokeWidth="1.2"/>
      {axisArrow(ox,5,'up')}
      <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">Y</text>
      <path
        d="M 23,10 C 41,48 58,71 76,80 C 87,85 97,85 108,80 C 121,73 135,58 148,35"
        fill="none" stroke={cc} strokeWidth="2"
      />
      <line x1={r1x} y1={ay-3} x2={r1x} y2={ay+3} stroke={tc} strokeWidth="1"/>
      <line x1={r2x} y1={ay-3} x2={r2x} y2={ay+3} stroke={tc} strokeWidth="1"/>
      <line x1={ox-3} y1={yIntY} x2={ox+3} y2={yIntY} stroke={tc} strokeWidth="1"/>
      <text x={ox+5} y={ay+13} fill={tc} fontSize="9" textAnchor="start">O</text>
      <text x={r1x} y={ay+13} fill={tc} fontSize="9" textAnchor="middle">3</text>
      <text x={r2x} y={ay+13} fill={tc} fontSize="9" textAnchor="middle">5</text>
      <text x={ox-4} y={yIntY+4} fill={tc} fontSize="9" textAnchor="end">15</text>
    </svg>
  );
};

const q14Svg = (): ReactNode => {
  const ac="#67e8f9", cc="#facc15", tc="#ffffff", dc="rgba(255,255,255,0.45)";
  const W=140, H=110, ox=38, ay=75;
  const r1x=18, r2x=98, vx=58, vy=35;
  const arr = (ex:number,ey:number,d:'r'|'u') => d==='r'
    ? <polygon points={`${ex-5},${ey-3} ${ex-5},${ey+3} ${ex},${ey}`} fill={ac}/>
    : <polygon points={`${ex-3},${ey+5} ${ex+3},${ey+5} ${ex},${ey}`} fill={ac}/>;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
      <line x1="5" y1={ay} x2="128" y2={ay} stroke={ac} strokeWidth="1.2"/>
      {arr(133,ay,'r')}
      <text x="137" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">x</text>
      <line x1={ox} y1="5" x2={ox} y2="103" stroke={ac} strokeWidth="1.2"/>
      {arr(ox,5,'u')}
      <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">y</text>
      <path d="M 8,98 C 11,88 15,81 18,75 C 44,22 71,22 98,75 C 101,82 105,90 108,98"
        fill="none" stroke={cc} strokeWidth="2"/>
      <line x1={ox} y1={vy} x2={vx} y2={vy} stroke={dc} strokeWidth="1" strokeDasharray="3,2"/>
      <line x1={vx} y1={ay} x2={vx} y2={vy} stroke={dc} strokeWidth="1" strokeDasharray="3,2"/>
      <line x1={r1x} y1={ay-3} x2={r1x} y2={ay+3} stroke={tc} strokeWidth="1"/>
      <line x1={r2x} y1={ay-3} x2={r2x} y2={ay+3} stroke={tc} strokeWidth="1"/>
      <line x1={vx} y1={ay-3} x2={vx} y2={ay+3} stroke={tc} strokeWidth="1"/>
      <line x1={ox-3} y1={vy} x2={ox+3} y2={vy} stroke={tc} strokeWidth="1"/>
      <text x={r1x} y={ay+12} fill={tc} fontSize="9" textAnchor="middle">-1</text>
      <text x={ox+5} y={ay+12} fill={tc} fontSize="9">O</text>
      <text x={vx} y={ay+12} fill={tc} fontSize="9" textAnchor="middle">1</text>
      <text x={r2x} y={ay+12} fill={tc} fontSize="9" textAnchor="middle">3</text>
      <text x={ox-4} y={vy+4} fill={tc} fontSize="9" textAnchor="end">4</text>
    </svg>
  );
};

const q15Svg = (): ReactNode => {
  const ac="#67e8f9", cc="#facc15", tc="#ffffff";
  const W=155, H=103, ox=115, ay=80;
  const arr = (ex:number,ey:number,d:'r'|'u') => d==='r'
    ? <polygon points={`${ex-5},${ey-3} ${ex-5},${ey+3} ${ex},${ey}`} fill={ac}/>
    : <polygon points={`${ex-3},${ey+5} ${ex+3},${ey+5} ${ex},${ey}`} fill={ac}/>;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
      <line x1="20" y1={ay} x2="143" y2={ay} stroke={ac} strokeWidth="1.2"/>
      {arr(148,ay,'r')}
      <text x="152" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">X</text>
      <line x1={ox} y1="5" x2={ox} y2="97" stroke={ac} strokeWidth="1.2"/>
      {arr(ox,5,'u')}
      <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">Y</text>
      <path d="M 49,100 C 51,93 53,86 55,80 C 79,8 103,8 127,80 C 129,86 131,93 133,100"
        fill="none" stroke={cc} strokeWidth="2"/>
      <text x={ox+5} y={ay+12} fill={tc} fontSize="9">O</text>
    </svg>
  );
};

const q16Svg = (variant: 'A'|'B'|'C'|'D'): ReactNode => {
  const ac="#67e8f9", cc="#facc15", tc="#ffffff";
  const W=135, H=100;
  const arr = (ex:number,ey:number,d:'r'|'u') => d==='r'
    ? <polygon points={`${ex-5},${ey-3} ${ex-5},${ey+3} ${ex},${ey}`} fill={ac}/>
    : <polygon points={`${ex-3},${ey+5} ${ex+3},${ey+5} ${ex},${ey}`} fill={ac}/>;

  if (variant === 'A') {
    const ox=55, ay=60;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
        <line x1="5" y1={ay} x2="123" y2={ay} stroke={ac} strokeWidth="1.2"/>
        {arr(128,ay,'r')}
        <text x="132" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">X</text>
        <line x1={ox} y1="5" x2={ox} y2="95" stroke={ac} strokeWidth="1.2"/>
        {arr(ox,5,'u')}
        <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">Y</text>
        <path d="M 3,83 C 5,75 8,66 10,60 C 30,7 50,7 70,60 C 74,71 78,83 82,98"
          fill="none" stroke={cc} strokeWidth="2"/>
        <text x={ox+4} y={ay+12} fill={tc} fontSize="9">O</text>
      </svg>
    );
  }
  if (variant === 'B') {
    const ox=25, ay=55;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
        <line x1="5" y1={ay} x2="123" y2={ay} stroke={ac} strokeWidth="1.2"/>
        {arr(128,ay,'r')}
        <text x="132" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">X</text>
        <line x1={ox} y1="5" x2={ox} y2="95" stroke={ac} strokeWidth="1.2"/>
        {arr(ox,5,'u')}
        <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">Y</text>
        <path d="M 14,97 C 18,90 21,84 25,79 C 32,68 40,60 47,55 C 62,44 76,44 91,55 C 98,60 106,68 113,79 C 117,84 120,90 124,97"
          fill="none" stroke={cc} strokeWidth="2"/>
        <text x={ox+4} y={ay+12} fill={tc} fontSize="9">O</text>
      </svg>
    );
  }
  if (variant === 'C') {
    const ox=95, ay=55;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
        <line x1="5" y1={ay} x2="123" y2={ay} stroke={ac} strokeWidth="1.2"/>
        {arr(128,ay,'r')}
        <text x="132" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">X</text>
        <line x1={ox} y1="5" x2={ox} y2="95" stroke={ac} strokeWidth="1.2"/>
        {arr(ox,5,'u')}
        <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">Y</text>
        <path d="M 20,70 C 25,63 30,58 35,55 C 45,48 55,48 65,55 C 75,62 85,75 95,95 C 97,97 100,98 103,99"
          fill="none" stroke={cc} strokeWidth="2"/>
        <text x={ox+4} y={ay+12} fill={tc} fontSize="9">O</text>
      </svg>
    );
  }
  const ox=45, ay=45;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
      <line x1="5" y1={ay} x2="123" y2={ay} stroke={ac} strokeWidth="1.2"/>
      {arr(128,ay,'r')}
      <text x="132" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">X</text>
      <line x1={ox} y1="5" x2={ox} y2="95" stroke={ac} strokeWidth="1.2"/>
      {arr(ox,5,'u')}
      <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">Y</text>
      <path d="M 15,23 C 18,31 22,38 25,45 C 52,98 78,98 105,45 C 108,38 112,31 115,23"
        fill="none" stroke={cc} strokeWidth="2"/>
      <text x={ox+4} y={ay+12} fill={tc} fontSize="9">O</text>
    </svg>
  );
};

const q27Svg = (): ReactNode => {
  const tc="#ffffff", yc="#facc15", fc="#3b82f6";
  const bott=84, lx=48, lw=86, lh=52, lw2=72, lh2=70;
  const ly=bott-lh, rx=lx+lw, ry=bott-lh2;
  return (
    <svg viewBox="0 0 242 95" width="100%" style={{maxWidth:"242px"}} className="mt-2 block">
      <rect x={lx} y={ly} width={lw} height={lh} fill={fc} stroke={yc} strokeWidth="1.5"/>
      <rect x={rx} y={ry} width={lw2} height={lh2} fill={fc} stroke={yc} strokeWidth="1.5"/>
      <text x={lx+lw/2} y={ly-4} fill={tc} fontSize="9" textAnchor="middle">(7 - x)</text>
      <text x={lx-4} y={ly+lh/2+4} fill={tc} fontSize="9" textAnchor="end">(x + 1)</text>
      <text x={rx+lw2/2} y={ry-4} fill={tc} fontSize="9" textAnchor="middle">5 cm</text>
      <text x={rx+lw2+4} y={ry+lh2/2+4} fill={tc} fontSize="9" textAnchor="start">5 cm</text>
    </svg>
  );
};

const SvgParabolaTable = () => {
  const ac = "#67e8f9";
  const cc = "#facc15";
  const tc = "#ffffff";
  const bc = "#dc2626";

  const cells: { x: number; y: number; type: string; label?: string; labelY?: number }[] = [
    { x: 127, y: 100, type: "a+D+" },
    { x: 272, y: 100, type: "a+D0" },
    { x: 417, y: 100, type: "a+D-", label: "Definit Positif", labelY: 152 },
    { x: 127, y: 228, type: "a-D+" },
    { x: 272, y: 228, type: "a-D0" },
    { x: 417, y: 228, type: "a-D-", label: "Definit Negatif", labelY: 175 },
  ];

  const curve = (x: number, y: number, type: string) => {
    switch (type) {
      case "a+D+": return `M ${x-40},${y} Q ${x},${y+38} ${x+40},${y}`;
      case "a+D0": return `M ${x-40},${y-26} Q ${x},${y+26} ${x+40},${y-26}`;
      case "a+D-": return `M ${x-35},${y-35} Q ${x},${y-5} ${x+35},${y-35}`;
      case "a-D+": return `M ${x-40},${y} Q ${x},${y-38} ${x+40},${y}`;
      case "a-D0": return `M ${x-40},${y+26} Q ${x},${y-26} ${x+40},${y+26}`;
      case "a-D-": return `M ${x-35},${y+35} Q ${x},${y+5} ${x+35},${y+35}`;
      default: return "";
    }
  };

  return (
    <svg viewBox="0 0 490 296" width="100%" style={{ maxWidth: "490px" }} className="my-4 mx-auto block">
      <rect x="0.75" y="0.75" width="488.5" height="294.5" fill="none" stroke={bc} strokeWidth="1.5" />
      <line x1="0" y1="32" x2="490" y2="32" stroke={bc} strokeWidth="1.5" />
      <line x1="55" y1="0" x2="55" y2="296" stroke={bc} strokeWidth="1.5" />
      <line x1="200" y1="0" x2="200" y2="296" stroke={bc} strokeWidth="1.5" />
      <line x1="345" y1="0" x2="345" y2="296" stroke={bc} strokeWidth="1.5" />
      <line x1="0" y1="163" x2="490" y2="163" stroke={bc} strokeWidth="1.5" />
      <line x1="0" y1="0" x2="55" y2="32" stroke={bc} strokeWidth="1" />

      <text x="127" y="22" fill={tc} fontSize="12" textAnchor="middle" fontWeight="bold">{'D > 0'}</text>
      <text x="272" y="22" fill={tc} fontSize="12" textAnchor="middle" fontWeight="bold">{'D = 0'}</text>
      <text x="417" y="22" fill={tc} fontSize="12" textAnchor="middle" fontWeight="bold">{'D < 0'}</text>
      <text x="27" y="100" fill={tc} fontSize="11" textAnchor="middle" fontWeight="bold">{'a > 0'}</text>
      <text x="27" y="228" fill={tc} fontSize="11" textAnchor="middle" fontWeight="bold">{'a < 0'}</text>

      {cells.map((cell, i) => (
        <g key={i}>
          <line x1={cell.x - 46} y1={cell.y} x2={cell.x + 50} y2={cell.y} stroke={ac} strokeWidth="1.2" />
          <polygon points={`${cell.x+50},${cell.y-3} ${cell.x+50},${cell.y+3} ${cell.x+56},${cell.y}`} fill={ac} />
          <line x1={cell.x} y1={cell.y + 44} x2={cell.x} y2={cell.y - 50} stroke={ac} strokeWidth="1.2" />
          <polygon points={`${cell.x-3},${cell.y-50} ${cell.x+3},${cell.y-50} ${cell.x},${cell.y-56}`} fill={ac} />
          <text x={cell.x + 61} y={cell.y + 4} fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">x</text>
          <text x={cell.x + 3} y={cell.y - 57} fill={tc} fontSize="9" textAnchor="start" fontStyle="italic">y</text>
          <path d={curve(cell.x, cell.y, cell.type)} fill="none" stroke={cc} strokeWidth="2" />
          {cell.label && (
            <text x={cell.x + 10} y={cell.labelY} fill={tc} fontSize="8.5" textAnchor="middle" fontWeight="bold">{cell.label}</text>
          )}
        </g>
      ))}
    </svg>
  );
};

const materiSection = {
  title: "MATERI - FUNGSI KUADRAT",
  sections: [
    {
      heading: "A. Menggambar Grafik Fungsi Kuadrat",
      content: `Fungsi kuadrat adalah fungsi yang berbentuk $y = ax^2 + bx + c$ dengan $a \\neq 0$

Gambaran Grafik Fungsi kuadrat:
$D > 0$ : Grafik memotong sumbu-x di dua titik
$D = 0$ : Grafik menyinggung sumbu-x
$D < 0$ : Grafik tidak memotong sumbu-x
dengan $D = b^2 - 4ac$

Definit positif : $a > 0$ dan $D < 0$
Definit negatif : $a < 0$ dan $D < 0$`
    },
    {
      heading: "B. Menggambar Grafik Fungsi Persamaan Kuadrat (4 Langkah)",
      content: `1) Titik potong sumbu x adalah titik yang didapat ketika nilai $y = 0$

2) Titik potong sumbu y adalah titik yang didapat ketika nilai $x = 0$

3) Sumbu simetri pada fungsi kuadrat $y = ax^2 + bx + c$ adalah sumbu yang letaknya simetris terhadap grafik (berada pada sumbu x) bernilai $x_p = -\\frac{b}{2a}$

4) Nilai optimum disebut juga titik puncak atau titik balik maksimum/minimum adalah titik tertinggi atau terendah dari fungsi tersebut (berada pada sumbu y) bernilai $y_p = -\\frac{D}{4a}$`
    },
    {
      heading: "C. Menyusun Fungsi Kuadrat",
      content: `1. Diketahui titik puncak $(x_p, y_p)$ dan melalui titik $(x, y)$.
$y - y_p = a(x - x_p)^2 + y_p$

2. Memotong sumbu-x di $(x_1, 0)$ dan $(x_2, 0)$ dan melalui titik $(x, y)$.
$y = a(x - x_1)(x - x_2)$

3. Grafik melalui tiga titik.
$y = ax^2 + bx + c$`
    },
  ]
};

type PembahasanObj = { konsep: string; langkah: string[]; rumus?: string };

const latihanDasar: { no: number; soal: string; options: string[]; svgOptions?: ReactNode[]; svgQuestion?: ReactNode; jawaban: string; pembahasan: PembahasanObj }[] = [
  { no: 1, soal: "Fungsi $f(x) = 3(x - 1)^2 + 5$ dapat dinyatakan dalam bentuk $f(x) = ax^2 + bx + c$. Nilai b dan c berturut-turut adalah ...", options: ["A. -6 dan 8", "B. -6 dan 2", "C. -3 dan 8", "D. 3 dan 2"], jawaban: "A", pembahasan: { konsep: "Mengubah bentuk vertex ke bentuk standar $ax^2 + bx + c$ dengan menjabarkan.", langkah: ["Jabarkan: $(x-1)^2 = x^2 - 2x + 1$", "Kalikan: $3(x^2 - 2x + 1) = 3x^2 - 6x + 3$", "Tambah 5: $f(x) = 3x^2 - 6x + 8$", "Koefisien: $b = -6$, $c = 8$"], rumus: "$a(x-h)^2 + k = ax^2 - 2ahx + ah^2 + k$" } },
  { no: 2, soal: "Jika titik $(3, a)$ terletak pada kurva $f(x) = 2x^2 - x + 4$, maka nilai $a$ = ...", options: ["A. 19", "B. 17", "C. 16", "D. 13"], jawaban: "A", pembahasan: { konsep: "Titik $(x_0, y_0)$ terletak pada kurva berarti $y_0 = f(x_0)$. Substitusi langsung.", langkah: ["Substitusi $x = 3$: $f(3) = 2(3)^2 - 3 + 4$", "$= 2(9) - 3 + 4 = 18 - 3 + 4 = 19$", "Jadi $a = 19$"], rumus: "Untuk titik $(x_0, y_0)$ pada kurva: $y_0 = f(x_0)$" } },
  { no: 3, soal: "Grafik fungsi $f(x) = x^2 - 2x - 3$ dipotong oleh garis $y = 5$. Salah satu absis titik potongnya adalah ...", options: ["A. 1", "B. 2", "C. 4", "D. 5"], jawaban: "C", pembahasan: { konsep: "Titik potong dua kurva: samakan persamaannya, lalu selesaikan.", langkah: ["Samakan: $x^2 - 2x - 3 = 5$", "Pindahkan: $x^2 - 2x - 8 = 0$", "Faktorkan: $(x - 4)(x + 2) = 0$", "Absis: $x = 4$ atau $x = -2$"], rumus: "Titik potong dua kurva: $f(x) = g(x)$" } },
  { no: 4, soal: "Fungsi $f(x) = x^2 - x - 12$ memotong sumbu X di titik $(p, 0)$ dan $(q, 0)$. Jika $p > q$, maka nilai p dan q berturut-turut adalah ...", options: ["A. 4 dan 3", "B. 4 dan -3", "C. 3 dan -4", "D. 3 dan 2"], jawaban: "B", pembahasan: { konsep: "Titik potong sumbu X diperoleh dengan memfaktorkan $f(x) = 0$.", langkah: ["Faktorkan: $x^2 - x - 12 = 0 \\Rightarrow (x - 4)(x + 3) = 0$", "Akar: $x = 4$ atau $x = -3$", "Karena $p > q$: $p = 4$, $q = -3$"], rumus: "$(x - p)(x - q) = 0 \\Rightarrow x = p$ atau $x = q$" } },
  { no: 5, soal: "Titik potong kurva $f(x) = x^2 + 4x + 7$ dengan sumbu Y adalah ...", options: ["A. (0, 7)", "B. (0, 3)", "C. (-2, 0)", "D. (-3, 3)"], jawaban: "A", pembahasan: { konsep: "Titik potong sumbu Y selalu berada di $x = 0$. Substitusi $x = 0$.", langkah: ["Substitusi $x = 0$: $f(0) = 0^2 + 4(0) + 7 = 7$", "Titik potong sumbu Y: $(0, 7)$"], rumus: "Titik potong sumbu Y: $(0, c)$ untuk $f(x) = ax^2 + bx + c$" } },
  { no: 6, soal: "Kurva yang mempunyai sumbu simetri di $x = 1$ adalah ...", options: ["A.", "B.", "C.", "D."], svgOptions: [<img src="/no_6_opsi_A.png" alt="Opsi A" className="mt-1 block max-w-[165px] w-full" />, <img src="/no_6_opsi_B.png" alt="Opsi B" className="mt-1 block max-w-[165px] w-full" />, <img src="/no_6_opsi_C.png" alt="Opsi C" className="mt-1 block max-w-[165px] w-full" />, <img src="/no_6_opsi_D.png" alt="Opsi D" className="mt-1 block max-w-[165px] w-full" />], jawaban: "B", pembahasan: { konsep: "Sumbu simetri parabola terletak tepat di tengah dua akar, atau dihitung dari $x_p = -\\dfrac{b}{2a}$.", langkah: ["Periksa setiap pilihan grafik", "Pilih grafik yang sumbu simetri vertikalnya tepat di $x = 1$", "Grafik B memiliki sumbu simetri tepat di $x = 1$"], rumus: "$x_p = -\\dfrac{b}{2a}$" } },
  { no: 7, soal: "Sumbu simetri dari kurva $f(x) = x^2 + 6x + 5$ adalah ...", options: ["A. $x = -3$", "B. $x = -35$", "C. $x = 52$", "D. $x = 3$"], jawaban: "A", pembahasan: { konsep: "Gunakan rumus sumbu simetri parabola.", langkah: ["Identifikasi: $a = 1$, $b = 6$", "$x_p = -\\dfrac{b}{2a} = -\\dfrac{6}{2(1)} = -3$", "Sumbu simetri: $x = -3$"], rumus: "$x_p = -\\dfrac{b}{2a}$" } },
  { no: 8, soal: "Sumbu simetri pada fungsi $f(x) = (x + 6)^2 - 5$ adalah ...", options: ["A. $x = 6$", "B. $x = 5$", "C. $x = -3$", "D. $x = -6$"], jawaban: "D", pembahasan: { konsep: "Bentuk vertex $f(x) = (x-h)^2 + k$ langsung menunjukkan puncak di $(h, k)$.", langkah: ["Bentuk vertex: $f(x) = (x - (-6))^2 + (-5)$", "Puncak parabola di $(-6, -5)$", "Sumbu simetri adalah $x = -6$"], rumus: "$f(x) = (x-h)^2 + k \\Rightarrow$ puncak $(h, k)$, sumbu simetri $x = h$" } },
  { no: 9, soal: "Nilai minimum fungsi $f(x) = 3(x + 2)^2 + 5$ adalah ...", options: ["A. 17", "B. 8", "C. 5", "D. -7"], jawaban: "C", pembahasan: { konsep: "Nilai minimum fungsi kuadrat $a > 0$ terjadi di titik puncak (bentuk vertex langsung terbaca).", langkah: ["$a = 3 > 0$ ⇒ parabola membuka ke atas (ada minimum)", "Puncak di $x = -2$: $f(-2) = 3(0)^2 + 5 = 5$", "Nilai minimum = 5"], rumus: "Minimum $= k$ untuk $f(x) = a(x-h)^2 + k$ dengan $a > 0$" } },
  { no: 10, soal: "Nilai maksimum fungsi $f(x) = -x^2 + 6x + 7$ adalah ...", options: ["A. 18", "B. 16", "C. 12", "D. 9"], jawaban: "B", pembahasan: { konsep: "Nilai maksimum fungsi kuadrat $a < 0$ ditemukan di titik puncak.", langkah: ["$a = -1 < 0$ ⇒ memiliki nilai maksimum", "$x_p = -\\dfrac{b}{2a} = -\\dfrac{6}{2(-1)} = 3$", "$f(3) = -(3)^2 + 6(3) + 7 = -9 + 18 + 7 = 16$"], rumus: "$x_p = -\\dfrac{b}{2a}$, nilai maksimum $= f(x_p)$" } },
  { no: 11, soal: "Koordinat titik balik pada kurva $f(x) = x^2 - 10x + 29$ adalah ...", options: ["A. (-5, 5)", "B. (-5, 4)", "C. (5, -4)", "D. (5, 4)"], jawaban: "D", pembahasan: { konsep: "Koordinat titik balik (puncak) parabola dihitung dengan rumus $x_p$ dan $y_p$.", langkah: ["$x_p = -\\dfrac{b}{2a} = -\\dfrac{-10}{2(1)} = 5$", "$y_p = f(5) = 25 - 50 + 29 = 4$", "Titik balik: $(5, 4)$"], rumus: "$x_p = -\\dfrac{b}{2a}$, $y_p = c - \\dfrac{b^2}{4a}$" } },
  { no: 12, soal: "Diketahui fungsi $f(x) = -x^2 + bx + c$ mempunyai koordinat titik balik minimum $(-5, 11)$. Nilai b dan c berturut-turut adalah ...", options: ["A. -10 dan 14", "B. -10 dan 36", "C. 10 dan 14", "D. 10 dan 36"], jawaban: "D", pembahasan: { konsep: "Gunakan syarat titik puncak untuk mencari koefisien. (Catatan: $a < 0$ hasilnya puncak maksimum; asumsikan $a > 0$ sesuai soal.)", langkah: ["Asumsikan $f(x) = x^2 + bx + c$ dengan puncak $(-5, 11)$", "$x_p = -\\dfrac{b}{2} = -5 \\Rightarrow b = 10$", "$f(-5) = 25 + 10(-5) + c = 11 \\Rightarrow 25 - 50 + c = 11 \\Rightarrow c = 36$", "Jawaban: $b = 10$, $c = 36$"], rumus: "$x_p = -\\dfrac{b}{2a}$ dan $y_p = f(x_p)$" } },
  { no: 13, soal: "Grafik dari fungsi $f(x) = x^2 - 2x - 15$ adalah ...", options: ["A.", "B.", "C.", "D."], svgOptions: [q13Svg('A'), q13Svg('B'), q13Svg('C'), q13Svg('D')], jawaban: "B", pembahasan: { konsep: "Faktorkan untuk menemukan akar, tentukan arah bukaan dari tanda $a$.", langkah: ["Faktorkan: $f(x) = (x - 5)(x + 3) = 0 \\Rightarrow x = 5$ atau $x = -3$", "$a = 1 > 0$ ⇒ parabola membuka ke atas (∪)", "Puncak: $x_p = 1$, $y_p = 1 - 2 - 15 = -16$", "Cari grafik dengan akar $(-3, 0)$ dan $(5, 0)$, puncak di bawah sumbu X"], rumus: "$f(x) = a(x - x_1)(x - x_2)$ dengan $x_1, x_2$ sebagai akar" } },
  { no: 14, soal: "Perhatikan gambar! Gambar tersebut adalah grafik fungsi kuadrat ...", options: ["A. $y = x^2 + 2x + 3$", "B. $y = x^2 - 2x - 3$", "C. $y = -x^2 + 2x - 3$", "D. $y = -x^2 - 2x + 3$", "E. $y = -x^2 + 2x + 3$"], svgQuestion: q14Svg(), jawaban: "E", pembahasan: { konsep: "Baca akar dan arah bukaan dari grafik, lalu tentukan $a$ dengan substitusi titik puncak.", langkah: ["Dari grafik: akar $x = -1$ dan $x = 3$, puncak $(1, 4)$ di atas sumbu X ⇒ $a < 0$", "Bentuk: $y = a(x + 1)(x - 3)$", "Substitusi puncak $(1, 4)$: $4 = a(2)(-2) = -4a \\Rightarrow a = -1$", "$y = -(x + 1)(x - 3) = -x^2 + 2x + 3$"], rumus: "$y = a(x - x_1)(x - x_2)$, tentukan $a$ dari titik yang diketahui" } },
  { no: 15, soal: "Perhatikan grafik $f(x) = ax^2 + bx + c$. Nilai a, b dan c yang mungkin adalah ...", options: ["A. $a < 0$, $b > 0$, $c > 0$", "B. $a < 0$, $b > 0$, $c < 0$", "C. $a < 0$, $b < 0$, $c > 0$", "D. $a > 0$, $b < 0$, $c < 0$"], svgQuestion: q15Svg(), jawaban: "C", pembahasan: { konsep: "Baca tanda $a$, $b$, $c$ dari sifat grafik: arah bukaan, sumbu simetri, dan titik potong Y.", langkah: ["Grafik membuka ke bawah ⇒ $a < 0$", "Sumbu simetri di kiri Y ($x_p < 0$): $-\\dfrac{b}{2a} < 0$, dengan $a < 0 \\Rightarrow b < 0$", "Titik potong sumbu Y di atas sumbu X ⇒ $c > 0$", "Kesimpulan: $a < 0$, $b < 0$, $c > 0$"], rumus: "Sumbu simetri $x_p = -\\dfrac{b}{2a}$; titik Y = $(0, c)$" } },
  { no: 16, soal: "Fungsi $f(x) = ax^2 + bx + c$ mempunyai $a < 0$, $b > 0$ dan $c < 0$. Grafik yang sesuai adalah ...", options: ["A.", "B.", "C.", "D."], svgOptions: [q16Svg('A'), q16Svg('B'), q16Svg('C'), q16Svg('D')], jawaban: "B", pembahasan: { konsep: "Gunakan tanda $a$, $b$, $c$ untuk menentukan bentuk dan posisi grafik.", langkah: ["$a < 0$ ⇒ parabola membuka ke bawah ($\\cap$)", "$x_p = -\\dfrac{b}{2a}$ dengan $b > 0$, $a < 0 \\Rightarrow x_p > 0$ (puncak di kanan sumbu Y)", "$c < 0$ ⇒ titik potong sumbu Y di bawah sumbu X", "Pilih grafik: membuka bawah, puncak di kanan, Y negatif"], rumus: "$a < 0 \\Rightarrow \\cap$; $x_p = -\\dfrac{b}{2a}$; titik Y $= (0, c)$" } },
  { no: 17, soal: "Nilai diskriminan pada fungsi $f(x) = -x^2 + 2x + 15$ adalah ...", options: ["A. 64", "B. 56", "C. 36", "D. 25"], jawaban: "A", pembahasan: { konsep: "Diskriminan $D = b^2 - 4ac$ menentukan banyak akar real suatu fungsi kuadrat.", langkah: ["Identifikasi: $a = -1$, $b = 2$, $c = 15$", "$D = b^2 - 4ac = (2)^2 - 4(-1)(15) = 4 + 60 = 64$"], rumus: "$D = b^2 - 4ac$" } },
  { no: 18, soal: "Diantara fungsi kuadrat berikut yang grafiknya memotong sumbu x di dua titik adalah ...", options: ["A. $f(x) = x^2 + 6x + 9$", "B. $f(x) = x^2 - x + 3$", "C. $f(x) = x^2 + x - 20$", "D. $f(x) = x^2 - 2x + 1$"], jawaban: "C", pembahasan: { konsep: "Grafik memotong sumbu X di dua titik jika dan hanya jika $D > 0$.", langkah: ["A: $D = 36 - 4(1)(9) = 36 - 36 = 0$ (menyinggung) ✗", "B: $D = 1 - 4(1)(3) = 1 - 12 = -11 < 0$ (tidak memotong) ✗", "C: $D = 1 - 4(1)(-20) = 1 + 80 = 81 > 0$ ✓", "D: $D = 4 - 4(1)(1) = 0$ (menyinggung) ✗"], rumus: "Memotong sumbu X di 2 titik ⟺ $D > 0$" } },
  { no: 19, soal: "Perhatikan fungsi kuadrat berikut:\n(i) $f(x) = x^2 - 16$\n(ii) $f(x) = x^2 - 25$\n(iii) $f(x) = x^2 + x - 20$\n(iv) $f(x) = x^2 - 10x + 25$\nFungsi kuadrat yang grafiknya menyinggung sumbu x adalah ...", options: ["A. (i)", "B. (ii)", "C. (iii)", "D. (iv)"], jawaban: "D", pembahasan: { konsep: "Grafik menyinggung sumbu X jika dan hanya jika $D = 0$ (satu akar kembar).", langkah: ["(i) $D = 0 + 4(16) = 64 > 0$ ✗", "(ii) $D = 0 + 4(25) = 100 > 0$ ✗", "(iii) $D = 1 + 4(20) = 81 > 0$ ✗", "(iv) $D = (-10)^2 - 4(1)(25) = 100 - 100 = 0$ ✓"], rumus: "Menyinggung sumbu X ⟺ $D = 0$" } },
  { no: 20, soal: "Supaya grafik fungsi $f(x) = x^2 + (m - 1)x - (m - 4) = 0$ menyinggung sumbu x, maka nilai $m$ = ...", options: ["A. 5", "B. 3", "C. 2", "D. -3"], jawaban: "B", pembahasan: { konsep: "Grafik menyinggung sumbu X saat $D = 0$. Selesaikan untuk nilai parameter $m$.", langkah: ["Syarat: $D = 0$", "$D = (m-1)^2 - 4(1)(-(m-4)) = (m-1)^2 + 4(m-4) = 0$", "$m^2 - 2m + 1 + 4m - 16 = m^2 + 2m - 15 = 0$", "$(m + 5)(m - 3) = 0 \\Rightarrow m = -5$ atau $m = 3$", "Dari pilihan: $m = 3$"], rumus: "Menyinggung sumbu X ⟺ $D = 0$" } },
  { no: 21, soal: "Persamaan grafik fungsi kuadrat yang mempunyai titik balik maksimum $(1, 2)$ dan melalui titik $(2, 3)$ adalah ...", options: ["A. $y = x^2 - 2x + 1$", "B. $y = x^2 - 2x + 3$", "C. $y = x^2 + 2x - 1$", "D. $y = x^2 + 2x + 1$", "E. $y = x^2 - 2x - 3$"], jawaban: "B", pembahasan: { konsep: "Gunakan bentuk vertex $y = a(x-h)^2 + k$ lalu substitusi titik lain untuk mencari $a$.", langkah: ["Bentuk vertex dengan puncak $(1, 2)$: $y = a(x - 1)^2 + 2$", "Substitusi titik $(2, 3)$: $3 = a(2-1)^2 + 2 = a + 2 \\Rightarrow a = 1$", "Persamaan: $y = (x-1)^2 + 2 = x^2 - 2x + 1 + 2 = x^2 - 2x + 3$"], rumus: "$y = a(x-h)^2 + k$ dengan puncak $(h, k)$" } },
  { no: 22, soal: "Grafik $y = px^2 + (p + 2)x - p + 4$ memotong sumbu X di dua titik. Batas-batas nilai p yang memenuhi adalah ...", options: ["A. $p < -2$ atau $p > -\\frac{2}{5}$", "B. $p < \\frac{2}{5}$ atau $p > 2$", "C. $p < 2$ atau $p > 10$", "D. $\\frac{2}{5} < p < 2$", "E. $2 < p < 10$"], jawaban: "B", pembahasan: { konsep: "Memotong sumbu X di dua titik ⟺ $D > 0$ (dan $p \\neq 0$ agar berbentuk kuadrat).", langkah: ["Hitung $D = (p+2)^2 - 4p(-p+4) = p^2 + 4p + 4 + 4p^2 - 16p = 5p^2 - 12p + 4$", "Syarat $D > 0$: $5p^2 - 12p + 4 > 0$", "Akar: $p = \\dfrac{12 \\pm \\sqrt{144-80}}{10} = \\dfrac{12 \\pm 8}{10}$, yaitu $p = 2$ atau $p = \\dfrac{2}{5}$", "Solusi: $p < \\dfrac{2}{5}$ atau $p > 2$"], rumus: "Memotong sumbu X di 2 titik ⟺ $D > 0$" } },
  { no: 23, soal: "Fungsi kuadrat $f(x) = (k + 3)x^2 - 2kx + (k - 2)$ merupakan fungsi definit positif. Nilai k yang memenuhi adalah ...", options: ["A. $k > -3$", "B. $k < 6$", "C. $k < -3$", "D. $k > 6$", "E. $-3 < k < 6$"], jawaban: "D", pembahasan: { konsep: "Fungsi definit positif: $a > 0$ dan $D < 0$ harus terpenuhi secara bersamaan.", langkah: ["Syarat $a > 0$: $k + 3 > 0 \\Rightarrow k > -3$", "Hitung $D = (-2k)^2 - 4(k+3)(k-2) = 4k^2 - 4(k^2 + k - 6) = -4k + 24$", "Syarat $D < 0$: $-4k + 24 < 0 \\Rightarrow k > 6$", "Gabungan ($k > -3$ dan $k > 6$): $k > 6$"], rumus: "Definit positif ⟺ $a > 0$ dan $D < 0$" } },
  { no: 24, soal: "Sebuah peluru ditembakkan vertikal memiliki rumus ketinggian per detik, $h(t) = (120t - t^2)$ meter. Tinggi tembakan maksimum peluru itu adalah ...", options: ["A. 4.800 m", "B. 4.500 m", "C. 3.600 m", "D. 3.000 m"], jawaban: "C", pembahasan: { konsep: "Ketinggian maksimum tercapai di titik puncak fungsi kuadrat dengan $a < 0$.", langkah: ["$h(t) = -t^2 + 120t$: koefisien $a = -1 < 0$ ⇒ ada maksimum", "$t_p = -\\dfrac{b}{2a} = -\\dfrac{120}{2(-1)} = 60$ detik", "$h(60) = 120(60) - (60)^2 = 7200 - 3600 = 3600$ m"], rumus: "$t_p = -\\dfrac{b}{2a}$, ketinggian maks $= h(t_p)$" } },
  { no: 25, soal: "Sebuah bola digelindingkan pada bidang miring dari atas ke bawah. Tinggi bola tiap detiknya memiliki rumus $h(t) = 80 + 2t - t^2$ (dalam cm). Bola akan menyentuh tanah pada detik ke- ...", options: ["A. 5", "B. 8", "C. 10", "D. 16"], jawaban: "C", pembahasan: { konsep: "Bola menyentuh tanah saat $h(t) = 0$; selesaikan persamaan kuadrat.", langkah: ["$h(t) = 0$: $80 + 2t - t^2 = 0$", "Kalikan $(-1)$: $t^2 - 2t - 80 = 0$", "Faktorkan: $(t - 10)(t + 8) = 0$", "Ambil $t = 10$ (waktu harus positif)"], rumus: "Bola menyentuh tanah ⟺ $h(t) = 0$" } },
  { no: 26, soal: "Sebuah persegi panjang mempunyai luas 42 cm² dan kelilingnya 34 cm. Lebar persegi panjang itu adalah ...", options: ["A. 2 cm", "B. 3 cm", "C. 5 cm", "D. 14 cm"], jawaban: "B", pembahasan: { konsep: "Gunakan sistem persamaan dari luas dan keliling untuk menyusun persamaan kuadrat.", langkah: ["Misal panjang $p$, lebar $l$: $pl = 42$ dan $2(p + l) = 34 \\Rightarrow p + l = 17$", "$p$ dan $l$ adalah akar persamaan $x^2 - 17x + 42 = 0$", "Faktorkan: $(x - 3)(x - 14) = 0 \\Rightarrow x = 3$ atau $x = 14$", "Lebar (nilai terkecil) = 3 cm"], rumus: "Jika $p + l = S$ dan $pl = P$, maka $x^2 - Sx + P = 0$" } },
  { no: 27, soal: "Perhatikan gambar berikut. Untuk $x \\in$ bilangan asli, luas maksimum bidang yang diarsir adalah ...", options: ["A. 30 cm²", "B. 36 cm²", "C. 41 cm²", "D. 48 cm²"], svgQuestion: q27Svg(), jawaban: "C", pembahasan: { konsep: "Nyatakan luas sebagai fungsi kuadrat, cari maksimumnya di bilangan asli terdekat.", langkah: ["Luas = $(7-x)(x+1) + 5 \\times 5 = -x^2 + 6x + 7 + 25 = -x^2 + 6x + 32$", "$a = -1 < 0$ ⇒ ada nilai maksimum", "$x_p = -\\dfrac{6}{2(-1)} = 3$ (bilangan asli ✓)", "Luas maks = $-(3)^2 + 6(3) + 32 = -9 + 18 + 32 = 41$ cm²"], rumus: "Maksimum $f(x)$ di $x_p = -\\dfrac{b}{2a}$ saat $a < 0$" } },
  { no: 28, soal: "Grafik fungsi $g(x) = x^2 + 3$ dapat diperoleh dari grafik $f(x) = x^2$. Cara yang tepat adalah ...", options: ["A. Menggeser $f(x)$ 3 satuan ke kanan", "B. Menggeser $f(x)$ 3 satuan ke kiri", "C. Menggeser $f(x)$ 3 satuan ke bawah", "D. Menggeser $f(x)$ 3 satuan ke atas"], jawaban: "D", pembahasan: { konsep: "Menambahkan konstanta positif pada fungsi menggeser grafik ke atas.", langkah: ["$g(x) = x^2 + 3 = f(x) + 3$", "Menambahkan 3 pada $f(x)$ berarti grafik naik 3 satuan", "Cara: geser $f(x)$ 3 satuan ke ATAS"], rumus: "$g(x) = f(x) + k \\Rightarrow$ geser $k$ satuan ke atas jika $k > 0$" } },
  { no: 29, soal: "Grafik fungsi $L(x) = x^2 + 2x - 3$ dapat diperoleh dari grafik $K(x) = (x + 1)^2$. Cara yang tepat adalah ...", options: ["A. Menggeser $K(x)$, 4 satuan ke kiri", "B. Menggeser $K(x)$, 3 satuan ke kiri", "C. Menggeser $K(x)$, 4 satuan ke bawah", "D. Menggeser $K(x)$, 3 satuan ke bawah"], jawaban: "C", pembahasan: { konsep: "Mengurangi konstanta pada fungsi menggeser grafik ke bawah.", langkah: ["Jabarkan $L(x) = x^2 + 2x - 3 = (x+1)^2 - 1 - 3 = (x+1)^2 - 4$", "$L(x) = K(x) - 4$", "Mengurangi 4 dari $K(x)$ berarti grafik turun 4 satuan", "Cara: geser $K(x)$ 4 satuan ke BAWAH"], rumus: "$g(x) = f(x) - k \\Rightarrow$ geser $k$ satuan ke bawah jika $k > 0$" } },
];

const olimpSoal1Svg = (): ReactNode => {
  const ac="#67e8f9", cc="#facc15", tc="#ffffff";
  const W=140, H=95, ox=38, ay=55;
  const arr = (ex:number,ey:number,d:'r'|'u') => d==='r'
    ? <polygon points={`${ex-5},${ey-3} ${ex-5},${ey+3} ${ex},${ey}`} fill={ac}/>
    : <polygon points={`${ex-3},${ey+5} ${ex+3},${ey+5} ${ex},${ey}`} fill={ac}/>;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
      <line x1="5" y1={ay} x2="128" y2={ay} stroke={ac} strokeWidth="1.2"/>
      {arr(133,ay,'r')}
      <text x="137" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">x</text>
      <line x1={ox} y1="5" x2={ox} y2="88" stroke={ac} strokeWidth="1.2"/>
      {arr(ox,5,'u')}
      <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">y</text>
      <path d="M 8,5 C 15,22 27,45 38,55 Q 75,96 112,55 C 121,45 128,22 132,5"
        fill="none" stroke={cc} strokeWidth="2"/>
      <text x="112" y={ay+12} fill={tc} fontSize="9" textAnchor="middle">(a,0)</text>
      <text x={ox+4} y={ay+12} fill={tc} fontSize="9">O</text>
    </svg>
  );
};

const olimp1Svg = (variant: 'A'|'B'|'C'|'D'): ReactNode => {
  const ac="#67e8f9", cc="#facc15", tc="#ffffff";
  const W=135, H=95;
  const arr = (ex:number,ey:number,d:'r'|'u') => d==='r'
    ? <polygon points={`${ex-5},${ey-3} ${ex-5},${ey+3} ${ex},${ey}`} fill={ac}/>
    : <polygon points={`${ex-3},${ey+5} ${ex+3},${ey+5} ${ex},${ey}`} fill={ac}/>;

  if (variant === 'A') {
    // g(x)=x²+ax+5: opens up, vertex left of y-axis, ABOVE x-axis (definit positif, no roots)
    const ox=38, ay=72;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
        <line x1="5" y1={ay} x2="123" y2={ay} stroke={ac} strokeWidth="1.2"/>
        {arr(128,ay,'r')}
        <text x="132" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">x</text>
        <line x1={ox} y1="5" x2={ox} y2="88" stroke={ac} strokeWidth="1.2"/>
        {arr(ox,5,'u')}
        <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">y</text>
        <path d="M 5,10 C 10,30 17,46 21,48 C 25,46 72,18 112,4"
          fill="none" stroke={cc} strokeWidth="2"/>
        <text x="108" y={ay+12} fill={tc} fontSize="9" textAnchor="middle">(a,0)</text>
        <text x={ox+4} y={ay+12} fill={tc} fontSize="9">O</text>
      </svg>
    );
  }
  if (variant === 'B') {
    // Wrong: U-shape, left root at negative x (left of y-axis), right root at (a,0)
    const ox=40, ay=52;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
        <line x1="5" y1={ay} x2="123" y2={ay} stroke={ac} strokeWidth="1.2"/>
        {arr(128,ay,'r')}
        <text x="132" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">x</text>
        <line x1={ox} y1="5" x2={ox} y2="88" stroke={ac} strokeWidth="1.2"/>
        {arr(ox,5,'u')}
        <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">y</text>
        <path d="M 4,4 C 8,18 12,38 15,52 Q 63,88 112,52 C 118,38 125,20 128,4"
          fill="none" stroke={cc} strokeWidth="2"/>
        <text x="112" y={ay+12} fill={tc} fontSize="9" textAnchor="middle">(a,0)</text>
        <text x={ox+4} y={ay+12} fill={tc} fontSize="9">O</text>
      </svg>
    );
  }
  if (variant === 'C') {
    // Wrong: U-shape, left root far negative x, right root at (a,0),
    // y-axis sits between the two roots but closer to right root
    const ox=88, ay=60;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
        <line x1="5" y1={ay} x2="123" y2={ay} stroke={ac} strokeWidth="1.2"/>
        {arr(128,ay,'r')}
        <text x="132" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">x</text>
        <line x1={ox} y1="5" x2={ox} y2="88" stroke={ac} strokeWidth="1.2"/>
        {arr(ox,5,'u')}
        <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">y</text>
        <path d="M 4,4 C 8,20 15,44 22,60 Q 62,94 103,60 C 108,48 116,26 122,8"
          fill="none" stroke={cc} strokeWidth="2"/>
        <text x="103" y={ay+12} fill={tc} fontSize="9" textAnchor="middle">(a,0)</text>
        <text x={ox+4} y={ay+12} fill={tc} fontSize="9">O</text>
      </svg>
    );
  }
  // D: Wrong: U-shape symmetric about y-axis, vertex below x-axis on y-axis
  const ox=65, ay=50;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
      <line x1="5" y1={ay} x2="123" y2={ay} stroke={ac} strokeWidth="1.2"/>
      {arr(128,ay,'r')}
      <text x="132" y={ay+4} fill={tc} fontSize="9" fontStyle="italic">x</text>
      <line x1={ox} y1="5" x2={ox} y2="88" stroke={ac} strokeWidth="1.2"/>
      {arr(ox,5,'u')}
      <text x={ox} y="4" fill={tc} fontSize="9" textAnchor="middle" fontStyle="italic">y</text>
      <path d="M 6,5 C 12,22 16,38 20,50 Q 65,92 110,50 C 114,38 120,22 126,5"
        fill="none" stroke={cc} strokeWidth="2"/>
      <text x="110" y={ay+12} fill={tc} fontSize="9" textAnchor="middle">(a,0)</text>
      <text x={ox+4} y={ay+12} fill={tc} fontSize="9">O</text>
    </svg>
  );
};

const olimp9Svg = (variant: 'A'|'B'|'C'|'D'): ReactNode => {
  const tc="#ffffff", gc="rgba(255,255,255,0.15)", dc="rgba(255,255,255,0.5)", cc="#facc15", ac="#67e8f9";
  const W=165, H=172;
  const gx0=38, gx1=155, gy0=8, gy1=148;
  const sx=(gx1-gx0)/6;
  const sy=(gy1-gy0)/55;
  const px=(t:number)=>Math.round(gx0+t*sx);
  const py=(s:number)=>Math.round(gy1-s*sy);
  const sVals=[0,5,10,15,20,25,30,35,40,45,50,55];
  const tVals=[0,1,2,3,4,5,6];

  let curvePath='';
  if (variant==='A') {
    // Steep concave-up: rapid drop then levels near 0 at t≈2.5
    curvePath=`M ${px(1)},${py(50)} C ${px(1)+1},${py(25)} ${px(2.4)},${py(1)} ${px(2.5)},${py(0)}`;
  } else if (variant==='B') {
    // Gentle concave-down: slow start then accelerates, reaches 0 at t=6
    curvePath=`M ${px(1)},${py(50)} C ${px(2)},${py(48)} ${px(4.8)},${py(16)} ${px(6)},${py(0)}`;
  } else if (variant==='C') {
    // Straight line from (1,50) to (5,0)
    curvePath=`M ${px(1)},${py(50)} L ${px(5)},${py(0)}`;
  } else {
    // Steeper straight line from (1,50) to (3.5,0)
    curvePath=`M ${px(1)},${py(50)} L ${px(3.5)},${py(0)}`;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth:`${W}px`}} className="mt-1 block">
      {sVals.map(s=>(
        <line key={`h${s}`} x1={gx0} y1={py(s)} x2={gx1} y2={py(s)} stroke={gc} strokeWidth="0.6"/>
      ))}
      {tVals.map(t=>(
        <line key={`v${t}`} x1={px(t)} y1={gy0} x2={px(t)} y2={gy1} stroke={gc} strokeWidth="0.6"/>
      ))}
      <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke={ac} strokeWidth="1.2"/>
      <line x1={gx0} y1={gy1} x2={gx1+4} y2={gy1} stroke={ac} strokeWidth="1.2"/>
      <line x1={px(1)} y1={gy0} x2={px(1)} y2={gy1} stroke={dc} strokeWidth="0.9" strokeDasharray="3,2"/>
      <line x1={gx0} y1={py(50)} x2={px(1)} y2={py(50)} stroke={dc} strokeWidth="0.9" strokeDasharray="3,2"/>
      <text fill={tc} fontSize="6" textAnchor="middle"
        transform={`translate(9,${Math.round(gy0+(gy1-gy0)/2)}) rotate(-90)`}>jarak (S)</text>
      <text x={Math.round(gx0+(gx1-gx0)/2)} y={gy1+16} fill={tc} fontSize="6" textAnchor="middle">waktu (t)</text>
      {[5,10,15,20,25,30,35,40,45,50,55].map(s=>(
        <text key={s} x={gx0-2} y={py(s)+2} fill={tc} fontSize="4.5" textAnchor="end">{s}</text>
      ))}
      {[1,2,3,4,5,6].map(t=>(
        <text key={t} x={px(t)} y={gy1+8} fill={tc} fontSize="5" textAnchor="middle">{t}</text>
      ))}
      <path d={curvePath} fill="none" stroke={cc} strokeWidth="1.8"/>
    </svg>
  );
};

const latihanOlimpiade: { no: number; soal: string; options: string[]; svgQuestion?: ReactNode; svgOptions?: ReactNode[]; jawaban: string; pembahasan: PembahasanObj }[] = [
  { no: 1, soal: "OSN Matematika 2010 Tingkat Kota\nFungsi $f(x) = x^2 - ax$ mempunyai grafik berikut. Grafik fungsi $g(x) = x^2 + ax + 5$ adalah ...", options: ["A.", "B.", "C.", "D."], svgQuestion: <img src="/soal_olimp_no_1.png" alt="Grafik soal no 1" className="mt-1 block max-w-[140px] w-full" />, svgOptions: [<img src="/olimp_no_1_opsi_A.png" alt="Opsi A" className="mt-1 block max-w-[135px] w-full" />, <img src="/olimp_no_1_opsi_B.png" alt="Opsi B" className="mt-1 block max-w-[135px] w-full" />, <img src="/olimp_no_1_opsi_C.png" alt="Opsi C" className="mt-1 block max-w-[135px] w-full" />, <img src="/olimp_no_1_opsi_D.png" alt="Opsi D" className="mt-1 block max-w-[135px] w-full" />], jawaban: "A", pembahasan: { konsep: "Dari grafik $f(x)$ baca nilai $a$, lalu analisis $D$ dan sumbu simetri $g(x)$.", langkah: ["Dari grafik $f(x) = x^2 - ax = x(x-a)$: akar di $x=0$ dan $x=a$ dengan $a > 0$", "Untuk $g(x) = x^2 + ax + 5$: $D = a^2 - 20$", "Sumbu simetri: $x_p = -\\dfrac{a}{2} < 0$ (di kiri sumbu Y)", "Jika $a^2 < 20$ maka $D < 0$ ⇒ $g$ tidak memotong sumbu X, membuka ke atas, puncak di kiri Y", "Grafik yang sesuai: opsi A"], rumus: "$D = b^2 - 4ac$ dan $x_p = -\\dfrac{b}{2a}$" } },
  { no: 2, soal: "OSN Matematika 2010 Tingkat Kota\nJika $P(x) = Q(x) \\cdot (x - a)$, Dimana $P(x)$ dan $Q(x)$ polinom, maka:", options: ["A. $P(a) \\neq 0$", "B. $x - a$ bukan faktor dari $P(x)$", "C. Kurva $y = P(x)$ memotong sumbu x di titik $(a, 0)$", "D. Kurva $y = P(x)$ memotong sumbu x di titik $(-a, 0)$", "E. Titik potong terhadap sumbu x tidak dapat ditentukan"], jawaban: "C", pembahasan: { konsep: "Jika $(x-a)$ adalah faktor dari $P(x)$, maka $P(a) = 0$ (Teorema Faktor).", langkah: ["Diberikan: $P(x) = Q(x)(x - a)$", "Substitusi $x = a$: $P(a) = Q(a) \\cdot (a - a) = Q(a) \\cdot 0 = 0$", "Jadi titik $(a, 0)$ terletak pada kurva $y = P(x)$", "Pilihan C benar"], rumus: "Teorema Faktor: $(x-a) \\mid P(x) \\Leftrightarrow P(a) = 0$" } },
  { no: 3, soal: "OSN Matematika 2014 Tingkat Kota\nDiketahui persamaan kurva $y = x^3 + 4x^2 + 5x + 1$ dan $y = x^2 + 2x - 1$. Jika kurva digambarkan pada bidang yang sama, maka banyak titik potong kedua kurva tersebut adalah ...", options: ["A. 0", "B. 1", "C. 2", "D. 3"], jawaban: "B", pembahasan: { konsep: "Titik potong dua kurva: selesaikan persamaan selisihnya, hitung solusi nyata.", langkah: ["Samakan: $x^3 + 4x^2 + 5x + 1 = x^2 + 2x - 1$", "Pindahkan: $x^3 + 3x^2 + 3x + 2 = 0$", "Uji $x = -2$: $-8 + 12 - 6 + 2 = 0$ ✓ ⇒ faktor $(x + 2)$", "Faktorkan: $(x+2)(x^2 + x + 1) = 0$", "$D(x^2 + x + 1) = 1 - 4 = -3 < 0$ ⇒ tidak ada akar real lain", "Hanya 1 titik potong"], rumus: "Banyak titik potong = banyak solusi nyata dari $f(x) = g(x)$" } },
  { no: 4, soal: "OSN Matematika 2015 Tingkat Kota\nParabola $y = ax^2 + bx + c$ melalui titik $(-2, 6)$ dan mempunyai sumbu simetri $x = -1$. Jika a, b dan c merupakan bilangan genap positif berurutan, maka nilai $a + b + c$ adalah ...", options: [], jawaban: "$a + b + c = 12$", pembahasan: { konsep: "Gunakan syarat sumbu simetri dan syarat bilangan genap berurutan untuk mencari $a, b, c$.", langkah: ["Sumbu simetri: $-\\dfrac{b}{2a} = -1 \\Rightarrow b = 2a$", "$a, b, c$ genap positif berurutan: $b = a + 2$, $c = a + 4$", "Dari $b = 2a$ dan $b = a + 2$: $a = 2$, $b = 4$, $c = 6$", "Cek titik $(-2, 6)$: $2(4) + 4(-2) + 6 = 8 - 8 + 6 = 6$ ✓", "$a + b + c = 2 + 4 + 6 = 12$"], rumus: "Sumbu simetri $x_p = -\\dfrac{b}{2a}$" } },
  { no: 5, soal: "OSN Matematika 2016 Tingkat Kota\nBanyak bilangan bulat $k > -20$ sehingga parabola $y = x^2 + k$ tidak berpotongan dengan lingkaran $x^2 + y^2 = 9$ adalah ...", options: ["A. 20", "B. 19", "C. 11", "D. 10"], jawaban: "D", pembahasan: { konsep: "Substitusi parabola ke lingkaran, cari syarat $D < 0$ agar sistem tidak berpotongan.", langkah: ["Substitusi $x^2 = y - k$ ke $x^2 + y^2 = 9$: $y - k + y^2 = 9 \\Rightarrow y^2 + y - (k+9) = 0$", "Tidak berpotongan ⟺ $D < 0$: $1 + 4(k+9) < 0 \\Rightarrow k < -\\dfrac{37}{4} \\approx -9.25$", "Bilangan bulat $k$ dengan $k > -20$ dan $k \\leq -10$: $k = -19, -18, \\ldots, -10$", "Banyaknya: $-10 - (-19) + 1 = 10$ nilai"], rumus: "Tidak berpotongan ↔ diskriminan sistem $< 0$" } },
  { no: 6, soal: "OSN Matematika 2018 Tingkat Kota\nJika $0 < a < 1$ dan grafik fungsi kuadrat $y = a(x - 1)^2 + 2a$ berada di bawah grafik fungsi $y = (a^2 + 2a)(x + 1) - 2a(2a + 1)$, maka nilai x yang memenuhi adalah ...", options: ["A. $0 < x < 3$", "B. $a < x < 3$", "C. $a + 1 < x < 3$", "D. $3 < x < 3 + a$"], jawaban: "C", pembahasan: { konsep: "Pertidaksamaan dua fungsi; setelah disederhanakan, faktorkan untuk mencari interval.", langkah: ["Kurangkan: $a(x-1)^2 + 2a < (a^2+2a)(x+1) - 2a(2a+1)$", "Bagi $a > 0$: $(x-1)^2 + 2 < (a+2)(x+1) - 2(2a+1)$", "Sederhanakan: $x^2 - (a+4)x + 3(a+1) < 0$", "Faktorkan: $(x - 3)(x - (a+1)) < 0$", "Karena $0 < a < 1$: $a + 1 \\in (1, 2)$ dan $a + 1 < 3$", "Solusi: $a + 1 < x < 3$"], rumus: "$(x - r_1)(x - r_2) < 0 \\Rightarrow r_1 < x < r_2$ jika $r_1 < r_2$" } },
  { no: 7, soal: "OSN Matematika 2019 Tingkat Kota\nParabola $y = ax^2 + bx + c$ mempunyai puncak di $(p, p)$ dan titik potong dengan sumbu y di $(0, -p)$ jika $p \\neq 0$, maka nilai b adalah ...", options: ["A. 1", "B. 2", "C. 4", "D. 8"], jawaban: "C", pembahasan: { konsep: "Gunakan bentuk vertex dari koordinat puncak, lalu substitusi titik Y untuk mencari $a$.", langkah: ["Bentuk vertex dengan puncak $(p, p)$: $y = a(x - p)^2 + p$", "Substitusi $(0, -p)$: $-p = a(0-p)^2 + p = ap^2 + p$", "$-2p = ap^2 \\Rightarrow a = -\\dfrac{2}{p}$ (karena $p \\neq 0$)", "Bentuk umum: koefisien $x$ adalah $b = -2ap = -2\\left(-\\dfrac{2}{p}\\right)p = 4$"], rumus: "Bentuk vertex $y = a(x-h)^2 + k$; $b = -2ah$ dalam bentuk umum" } },
  { no: 8, soal: "OSN Matematika 2021 Tingkat Kota\nP adalah titik minimum grafik fungsi kuadrat yang melalui $(2a, 0)$, $(4a, 0)$, dan $(0, 3a)$ dengan $a > 0$. Agar jarak P ke sumbu-x lebih dari 3 satuan, maka nilai a adalah ...", options: ["A. $0 < a < 3$", "B. $0 < a < 8$", "C. $a > 3$", "D. $a > 8$"], jawaban: "D", pembahasan: { konsep: "Susun parabola dari akar-akarnya, tentukan $k$ dari titik Y, cari $y_{min}$ di titik puncak.", langkah: ["Bentuk: $y = k(x - 2a)(x - 4a)$ (akar di $2a$ dan $4a$)", "Substitusi $(0, 3a)$: $3a = k(-2a)(-4a) = 8ka^2 \\Rightarrow k = \\dfrac{3}{8a}$", "Titik minimum di $x = 3a$ (rata-rata dua akar)", "$y_{min} = k(3a-2a)(3a-4a) = k \\cdot a \\cdot (-a) = -\\dfrac{3a^2}{8a} = -\\dfrac{3a}{8}$", "Syarat jarak ke sumbu X $> 3$: $\\left|-\\dfrac{3a}{8}\\right| = \\dfrac{3a}{8} > 3 \\Rightarrow a > 8$"], rumus: "Titik minimum di $x = \\dfrac{x_1 + x_2}{2}$" } },
  { no: 9, soal: "OSN Matematika 2023 Tingkat Kota\nA bergerak mendekati B yang berjarak 55 km dengan kecepatan 5 km/jam. Satu jam kemudian, B bergerak menuju A dengan kecepatan x km/jam, dengan x adalah waktu (dalam jam) ketika B berangkat sampai ketemu A. Grafik yang menyatakan hubungan antara waktu (t) yang dibutuhkan A bertemu B dengan jarak (s) A dan B adalah ...", options: ["A.", "B.", "C.", "D."], svgOptions: [<img src="/olimp_no_9_opsi_A.png" alt="Opsi A" className="mt-1 block max-w-[165px] w-full" />, <img src="/olimp_no_9_opsi_B.png" alt="Opsi B" className="mt-1 block max-w-[165px] w-full" />, <img src="/olimp_no_9_opsi_C.png" alt="Opsi C" className="mt-1 block max-w-[165px] w-full" />, <img src="/olimp_no_9_opsi_D.png" alt="Opsi D" className="mt-1 block max-w-[165px] w-full" />], jawaban: "B", pembahasan: { konsep: "Analisis gerakan dua objek yang saling mendekat; nyatakan jarak sebagai fungsi kuadrat terhadap waktu.", langkah: ["A mulai dari $t=0$ dengan kecepatan 5 km/jam. Setelah 1 jam, jarak A-B = 50 km", "B mulai dari $t=1$, kecepatannya = $\\tau$ km/jam ($\\tau$ = waktu sejak B berangkat)", "Jarak setelah $\\tau$ jam: $s(\\tau) = 50 - 5\\tau - \\dfrac{\\tau^2}{2}$", "Fungsi kuadrat cekung ke bawah ⇒ kurva melengkung (bukan garis lurus)", "Grafik yang sesuai: opsi B (kurva turun melengkung ke bawah)"], rumus: "$s(\\tau) = 50 - 5\\tau - \\dfrac{\\tau^2}{2}$ (kuadrat cekung bawah)" } },
  { no: 10, soal: "OSN Matematika 2023 Tingkat Kota\nDiketahui suatu konstanta $k > 0$. Garis l dengan persamaan $y = 2kx + 3k^2$ memotong parabola dengan persamaan $y = x^2$ pada titik P di kuadran I dan titik Q di kuadran II. Jika koordinat O adalah $(0, 0)$ dan luas daerah segitiga POQ adalah 48 satuan luas, maka kemiringan garis l adalah ...", options: ["A. $\\frac{2}{3}$", "B. 2", "C. $\\frac{4}{3}$", "D. 4"], jawaban: "D", pembahasan: { konsep: "Cari titik potong garis dengan parabola, hitung luas segitiga dengan rumus koordinat.", langkah: ["Titik potong: $x^2 = 2kx + 3k^2 \\Rightarrow x^2 - 2kx - 3k^2 = 0 \\Rightarrow (x-3k)(x+k) = 0$", "$P = (3k,\\ 9k^2)$ (kuadran I), $Q = (-k,\\ k^2)$ (kuadran II)", "Luas $\\triangle POQ = \\dfrac{1}{2}|x_P y_Q - x_Q y_P| = \\dfrac{1}{2}|3k \\cdot k^2 - (-k) \\cdot 9k^2| = \\dfrac{1}{2} \\cdot 12k^3 = 6k^3$", "$6k^3 = 48 \\Rightarrow k^3 = 8 \\Rightarrow k = 2$", "Kemiringan garis l $= 2k = 2(2) = 4$"], rumus: "Luas $\\triangle = \\dfrac{1}{2}|x_1 y_2 - x_2 y_1|$ (dengan $O$ di titik asal)" } },
];

const OlimpiadeFungsiKuadratPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
  const [showPembahasan, setShowPembahasan] = useState<Set<string>>(new Set());

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasan = (key: string) => {
    playPopSound();
    setShowPembahasan(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderPembahasan = (key: string, jawaban: string, pembahasan: PembahasanObj) => {
    const isOpen = showPembahasan.has(key);
    return (
      <div className="mt-3">
        <button
          onClick={() => togglePembahasan(key)}
          className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isOpen && (
          <div className="mt-4 space-y-2.5 animate-slide-up">
            <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
              <div className="font-body text-sm text-emerald-50 font-bold">{renderWithLatex(jawaban)}</div>
            </div>
            <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20" style={{background:"linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
              <div className="font-body text-xs text-violet-50/90 leading-relaxed">{renderWithLatex(pembahasan.konsep)}</div>
            </div>
            <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20" style={{background:"linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
              <div className="space-y-1.5">
                {pembahasan.langkah.map((step, si) => (
                  <div key={si} className="flex gap-2 items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">{si + 1}</span>
                    <p className="text-xs text-cyan-50/90 font-body leading-relaxed">{renderWithLatex(step)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20" style={{background:"linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
              <div className="font-body text-xs text-amber-50/90 leading-relaxed">
                {pembahasan.rumus ? renderWithLatex(pembahasan.rumus) : "Kuasai konsep utama dan latih langkah penyelesaian secara berurutan. Verifikasi jawaban dengan substitusi kembali ke soal."}
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20" style={{background:"linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
              <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
                Jadi, jawaban yang tepat adalah <span className="font-bold text-rose-200">{renderWithLatex(jawaban)}</span>.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - FUNGSI KUADRAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div
                key={idx}
                className="backdrop-blur border rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
                  borderColor: expandedSections.includes(idx) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: expandedSections.includes(idx)
                    ? "0 0 24px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)" }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm text-accent font-bold group-hover:text-yellow-300 transition-colors">
                      {section.heading}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        if (/^\d+\. [A-Z]/.test(trimmed)) {
                          return <div key={i} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">{trimmed}</div>;
                        }
                        if (/^Rumus/.test(trimmed)) {
                          return <div key={i} className="mt-3 mb-1 font-semibold text-yellow-300 text-xs uppercase tracking-wide">{renderWithLatex(trimmed)}</div>;
                        }
                        if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
                          return (
                            <div key={i} className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                              <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        if (trimmed === '') return <div key={i} className="h-2" />;
                        return <div key={i} className="mb-1">{renderWithLatex(line)}</div>;
                      })}
                    </div>
                    {idx === 0 && <SvgParabolaTable />}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-2 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {renderWithLatex(soal.soal)}
                </div>
                {(soal as any).svgQuestion && (
                  <div className="mb-3 flex justify-center">
                    {(soal as any).svgQuestion}
                  </div>
                )}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                        {soal.svgOptions?.[j]}
                      </div>
                    ))}
                  </div>
                )}
                {renderPembahasan(`dasar-${soal.no}`, soal.jawaban, soal.pembahasan)}
              </div>
            ))}
          </div>
        )}

        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {(soal as any).svgQuestion && (
                  <div className="flex justify-center mb-3">{(soal as any).svgQuestion}</div>
                )}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2 flex flex-col items-center">
                        {renderWithLatex(opt)}
                        {(soal as any).svgOptions?.[j]}
                      </div>
                    ))}
                  </div>
                )}
                {renderPembahasan(`olim-${soal.no}`, soal.jawaban, soal.pembahasan)}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeFungsiKuadratPage;
