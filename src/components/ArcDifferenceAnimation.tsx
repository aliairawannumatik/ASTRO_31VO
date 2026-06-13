import React, { useState, useEffect, useRef } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface PatternConfig {
  label: string;
  color: string;
  borderColor: string;
  arcColor: string;
  labelColor: string;
  bgColor: string;
  terms: number[];
  getDifferences: (terms: number[]) => (number | string)[];
  diffLabel?: string;
  note?: React.ReactNode;
}

const patterns: PatternConfig[] = [
  {
    label: "Pola Genap",
    color: "text-cyan-200",
    borderColor: "border-cyan-500/60",
    arcColor: "#22d3ee",
    labelColor: "#a5f3fc",
    bgColor: "bg-cyan-900/40",
    terms: [2, 4, 6, 8, 10, 12],
    getDifferences: (t) => t.slice(1).map((v, i) => v - t[i]),
    diffLabel: "Beda tetap +2",
  },
  {
    label: "Pola Ganjil",
    color: "text-orange-200",
    borderColor: "border-orange-500/60",
    arcColor: "#fb923c",
    labelColor: "#fed7aa",
    bgColor: "bg-orange-900/40",
    terms: [1, 3, 5, 7, 9, 11],
    getDifferences: (t) => t.slice(1).map((v, i) => v - t[i]),
    diffLabel: "Beda tetap +2",
  },
  {
    label: "Pola Persegi",
    color: "text-violet-200",
    borderColor: "border-violet-500/60",
    arcColor: "#a78bfa",
    labelColor: "#ddd6fe",
    bgColor: "bg-violet-900/40",
    terms: [1, 4, 9, 16, 25, 36],
    getDifferences: (t) => t.slice(1).map((v, i) => v - t[i]),
    diffLabel: "Beda bertambah +2 setiap kali",
    note: "Beda: +3, +5, +7, +9, +11 → bilangan ganjil!",
  },
  {
    label: "Pola Persegi Panjang",
    color: "text-green-200",
    borderColor: "border-green-500/60",
    arcColor: "#4ade80",
    labelColor: "#bbf7d0",
    bgColor: "bg-green-900/40",
    terms: [2, 6, 12, 20, 30, 42],
    getDifferences: (t) => t.slice(1).map((v, i) => v - t[i]),
    diffLabel: "Beda bertambah +2 setiap kali",
    note: "Beda: +4, +6, +8, +10, +12 → bilangan genap!",
  },
  {
    label: "Pola Segitiga",
    color: "text-yellow-200",
    borderColor: "border-yellow-500/60",
    arcColor: "#facc15",
    labelColor: "#fef08a",
    bgColor: "bg-yellow-900/40",
    terms: [1, 3, 6, 10, 15, 21],
    getDifferences: (t) => t.slice(1).map((v, i) => v - t[i]),
    diffLabel: "Beda bertambah +1 setiap kali",
    note: "Beda: +2, +3, +4, +5, +6 → bilangan asli!",
  },
  {
    label: "Segitiga Pascal",
    color: "text-pink-200",
    borderColor: "border-pink-500/60",
    arcColor: "#f472b6",
    labelColor: "#fbcfe8",
    bgColor: "bg-pink-900/40",
    terms: [1, 2, 4, 8, 16, 32],
    getDifferences: (t) => t.slice(1).map((v, i) => v - t[i]),
    diffLabel: "Beda selalu ×2 (berlipat ganda)",
    note: <>Beda: +1, +2, +4, +8, +16 → jumlah baris ke-n = <InlineMath math="2^{n-1}" /></>,
  },
  {
    label: "Pola Fibonacci",
    color: "text-teal-200",
    borderColor: "border-teal-500/60",
    arcColor: "#2dd4bf",
    labelColor: "#99f6e4",
    bgColor: "bg-teal-900/40",
    terms: [1, 1, 2, 3, 5, 8, 13],
    getDifferences: (t) => t.slice(1).map((v, i) => `${t[i]}+${t[i - 1] ?? 0}` === `${v}` ? `=${v}` : `+${v - t[i]}`),
    note: "Setiap suku = jumlah dua suku sebelumnya",
  },
];

function ArcSVG({
  terms,
  diffs,
  arcColor,
  labelColor,
  animate,
  isFibonacci,
}: {
  terms: number[];
  diffs: (number | string)[];
  arcColor: string;
  labelColor: string;
  animate: boolean;
  isFibonacci?: boolean;
}) {
  const count = terms.length;
  const boxW = 44;
  const gap = 28;
  const totalW = count * boxW + (count - 1) * gap;
  const svgW = totalW + 20;
  const svgH = 90;
  const boxY = svgH - 38;
  const centerY = boxY + boxW / 2;

  const centers = terms.map((_, i) => 10 + i * (boxW + gap) + boxW / 2);

  const arcs = diffs.map((d, i) => {
    const x1 = centers[i];
    const x2 = centers[i + 1];
    const cx = (x1 + x2) / 2;
    const arcH = 28 + i * 3;
    const cy = boxY - arcH;
    return { x1, x2, cx, cy, label: typeof d === "number" ? (d >= 0 ? `+${d}` : `${d}`) : d };
  });

  const [visibleArcs, setVisibleArcs] = useState(animate ? 0 : arcs.length);

  useEffect(() => {
    if (!animate) { setVisibleArcs(arcs.length); return; }
    setVisibleArcs(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleArcs(i);
      if (i >= arcs.length) clearInterval(timer);
    }, 300);
    return () => clearInterval(timer);
  }, [animate, arcs.length]);

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      width="100%"
      style={{ maxWidth: svgW, minWidth: 200, display: "block", margin: "0 auto" }}
    >
      {arcs.slice(0, visibleArcs).map((arc, i) => {
        const pathD = `M ${arc.x1} ${boxY} Q ${arc.cx} ${arc.cy} ${arc.x2} ${boxY}`;
        return (
          <g key={i}>
            <path
              d={pathD}
              fill="none"
              stroke={arcColor}
              strokeWidth="2"
              strokeDasharray="none"
              style={{
                filter: `drop-shadow(0 0 4px ${arcColor}88)`,
                animation: animate ? `arcDraw 0.35s ease-out` : "none",
              }}
            />
            <text
              x={arc.cx}
              y={arc.cy - 5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={labelColor}
              style={{ textShadow: `0 0 6px ${arcColor}` }}
            >
              {arc.label}
            </text>
          </g>
        );
      })}

      {terms.map((val, i) => (
        <g key={i}>
          <rect
            x={centers[i] - boxW / 2}
            y={boxY}
            width={boxW}
            height={32}
            rx={6}
            fill={arcColor + "22"}
            stroke={arcColor + "88"}
            strokeWidth="1.5"
          />
          <text
            x={centers[i]}
            y={boxY + 21}
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="var(--icon-color)"
          >
            {val}
          </text>
        </g>
      ))}

      {isFibonacci && terms.slice(2).map((val, i) => {
        const a = terms[i];
        const b = terms[i + 1];
        return (
          <g key={`fib-${i}`}>
            <line
              x1={centers[i] + boxW / 2}
              y1={boxY + 16}
              x2={centers[i + 2] - boxW / 2}
              y2={boxY + 16}
              stroke={arcColor + "33"}
              strokeWidth="1"
              strokeDasharray="3 2"
            />
          </g>
        );
      })}
    </svg>
  );
}

const sub = (n: number) =>
  String(n).split("").map((d) => "₀₁₂₃₄₅₆₇₈₉"[+d]).join("");

export function ArcPatternPanel({
  terms,
  getDifferences,
  arcColor,
  labelColor,
  diffLabel,
  note,
  isFibonacci,
}: {
  terms: number[];
  getDifferences: (terms: number[]) => (number | string)[];
  arcColor: string;
  labelColor: string;
  diffLabel?: string;
  note?: React.ReactNode;
  isFibonacci?: boolean;
}) {
  const [animKey, setAnimKey] = useState(0);
  const [playing, setPlaying] = useState(false);
  const diffs = getDifferences(terms);

  const handlePlay = () => {
    setAnimKey((k) => k + 1);
    setPlaying(true);
    setTimeout(() => setPlaying(false), diffs.length * 320 + 500);
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex justify-center">
        <button
          onClick={handlePlay}
          disabled={playing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-body border transition-all duration-200 active:scale-95 disabled:opacity-60"
          style={{
            background: arcColor + "22",
            borderColor: arcColor + "66",
            color: labelColor,
          }}
        >
          {playing ? "⏳ Animasi berjalan..." : "▶ Putar Animasi Busur"}
        </button>
      </div>
      <div className="overflow-x-auto pb-1">
        <ArcSVG
          key={animKey}
          terms={terms}
          diffs={diffs}
          arcColor={arcColor}
          labelColor={labelColor}
          animate={animKey > 0}
          isFibonacci={isFibonacci}
        />
      </div>
      {diffLabel && (
        <div className="text-center text-xs font-bold font-body" style={{ color: labelColor }}>
          {diffLabel}
        </div>
      )}
      {note && (
        <div className="text-center text-xs text-white/60 font-body">{note}</div>
      )}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {diffs.map((d, i) => (
          <span
            key={i}
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{
              background: arcColor + "22",
              border: `1px solid ${arcColor}66`,
              color: labelColor,
            }}
          >
            {`U${sub(i + 1)}→U${sub(i + 2)}: `}
            {typeof d === "number" ? (d >= 0 ? `+${d}` : `${d}`) : d}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ArcDifferenceAnimation() {
  const [selected, setSelected] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const pattern = patterns[selected];

  const handleSelect = (i: number) => {
    setSelected(i);
    setAnimKey((k) => k + 1);
  };

  const diffs = pattern.getDifferences(pattern.terms);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {patterns.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`text-xs font-bold font-body px-3 py-1.5 rounded-lg border transition-all duration-200 ${
              selected === i
                ? `${p.bgColor} ${p.borderColor} ${p.color} scale-105 shadow-lg`
                : "bg-slate-800/50 border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={`rounded-xl border ${pattern.borderColor} ${pattern.bgColor} p-4`}>
        <p className={`font-body text-xs font-semibold ${pattern.color} mb-3 text-center`}>
          {pattern.label} — Busur Beda
        </p>

        <div className="overflow-x-auto pb-2">
          <ArcSVG
            key={animKey}
            terms={pattern.terms}
            diffs={diffs}
            arcColor={pattern.arcColor}
            labelColor={pattern.labelColor}
            animate={true}
            isFibonacci={selected === 6}
          />
        </div>

        {pattern.diffLabel && (
          <div
            className={`mt-3 text-center text-xs font-bold font-body`}
            style={{ color: pattern.labelColor }}
          >
            {pattern.diffLabel}
          </div>
        )}
        {pattern.note && (
          <div className="mt-1 text-center text-xs text-white/60 font-body">
            {pattern.note}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {diffs.map((d, i) => (
            <span
              key={i}
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{
                background: pattern.arcColor + "22",
                border: `1px solid ${pattern.arcColor}66`,
                color: pattern.labelColor,
              }}
            >
              {`U${sub(i + 1)}→U${sub(i + 2)}: `}
              {typeof d === "number" ? (d >= 0 ? `+${d}` : `${d}`) : d}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes arcDraw {
          from { stroke-dashoffset: 300; stroke-dasharray: 300; opacity: 0; }
          to   { stroke-dashoffset: 0;   stroke-dasharray: 300; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
