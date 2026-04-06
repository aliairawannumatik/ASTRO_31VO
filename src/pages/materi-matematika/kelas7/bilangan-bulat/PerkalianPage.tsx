import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, AlertCircle, Zap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── Helper: buat komponen animasi busur generik ──────────────── */
const makePatternSVG = (
  rows: string[],
  arcLabel: string,
  rowColor: string,
  rowBg: string,
  rowBorder: string,
  arcStroke: string,
  arcLabel_color: string,
  conclusionText: string,
  conclusionColor1: string,
  conclusionColor2: string,
) => {
  const rowY    = (i: number) => 46 + i * 52;
  const rightX  = 390;
  const arcOutX = 448;
  const nArcs   = rows.length - 1;
  const svgH    = rowY(rows.length) + 60;

  return function PatternSVG() {
    const [step, setStep] = useState(0);
    useEffect(() => {
      const delay =
        step === 0             ? 700  :
        step <= nArcs          ? 820  :
        step === nArcs + 1     ? 2200 :
        500;
      const t = setTimeout(
        () => setStep(s => (s >= nArcs + 2 ? 0 : s + 1)),
        delay,
      );
      return () => clearTimeout(t);
    }, [step]);

    const numArcs = Math.min(step, nArcs);

    return (
      <svg viewBox={`0 0 490 ${svgH}`} width="100%" xmlns="http://www.w3.org/2000/svg">
        {rows.map((label, i) => (
          <g key={i}>
            <rect x="12" y={rowY(i) - 18} width="374" height="34" rx="6"
              fill={rowBg} stroke={rowBorder} strokeWidth="1"/>
            <text x="28" y={rowY(i) + 7} fontSize="14" fontFamily="monospace"
              fill={rowColor} letterSpacing="0.5">{label}</text>
          </g>
        ))}

        {Array.from({ length: numArcs }, (_, i) => {
          const y1 = rowY(i);
          const y2 = rowY(i + 1);
          return (
            <g key={`arc${i}`}>
              <path
                d={`M ${rightX},${y1} C ${arcOutX},${y1+20} ${arcOutX},${y2-20} ${rightX},${y2}`}
                fill="none" stroke={arcStroke} strokeWidth="2.2" strokeLinecap="round"/>
              <path
                d={`M ${rightX-6},${y2-10} L ${rightX},${y2} L ${rightX+6},${y2-10}`}
                fill="none" stroke={arcStroke} strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"/>
              <text x={arcOutX + 10} y={(y1 + y2) / 2 + 5}
                fill={arcLabel_color} fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                {arcLabel}
              </text>
            </g>
          );
        })}

        <g>
          <rect x="12" y={rowY(rows.length) + 4} width="466" height="44" rx="8"
            fill="#0f172a50" strokeWidth="2">
            <animate attributeName="stroke"
              values={`${conclusionColor1}70;${conclusionColor1}bb;${conclusionColor1}70`}
              dur="5s" repeatCount="indefinite"/>
            <animate attributeName="fill-opacity" values="0.25;0.45;0.25" dur="5s" repeatCount="indefinite"/>
          </rect>
          <text x="245" y={rowY(rows.length) + 27} textAnchor="middle"
            fontSize="12.5" fontFamily="sans-serif" fontWeight="bold">
            <animate attributeName="fill"
              values={`${conclusionColor1};${conclusionColor2};${conclusionColor1}`}
              dur="5s" repeatCount="indefinite"/>
            {conclusionText}
          </text>
        </g>
      </svg>
    );
  };
};

const PosTimesPosPatternSVG = makePatternSVG(
  ["1 \u00d7 3 = 3", "2 \u00d7 3 = 6", "3 \u00d7 3 = 9", "4 \u00d7 3 = 12"],
  "+3",
  "#4ade80", "#14532d40", "#16a34a50",
  "#4ade80cc", "#4ade80",
  "Setiap faktor +1 \u2192 hasil naik +3  \u2234 (+) \u00d7 (+) = (+) \u2713",
  "#4ade80", "#86efac",
);

const PosTimesNegPatternSVG = makePatternSVG(
  ["1 \u00d7 (\u22123) = \u22123", "2 \u00d7 (\u22123) = \u22126",
   "3 \u00d7 (\u22123) = \u22129", "4 \u00d7 (\u22123) = \u221212"],
  "\u22123",
  "#fb923c", "#431a0540", "#c2410c50",
  "#fb923ccc", "#fb923c",
  "Setiap faktor +1 \u2192 hasil turun \u22123  \u2234 (+) \u00d7 (\u2212) = (\u2212) \u2713",
  "#fb923c", "#fdba74",
);

const NegTimesPosPatternSVG = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0 ? 700  :
      step === 4 ? 1000 :
      step === 7 ? 3200 :
      step === 8 ? 500  :
      860;
    const t = setTimeout(() => setStep(s => (s >= 8 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const rows = [
    { label: "3 \u00d7 2 = 6",       isNegPos: false },
    { label: "2 \u00d7 2 = 4",       isNegPos: false },
    { label: "1 \u00d7 2 = 2",       isNegPos: false },
    { label: "0 \u00d7 2 = 0",       isNegPos: false },
    { label: "(\u22121) \u00d7 2 = \u22122", isNegPos: true  },
    { label: "(\u22122) \u00d7 2 = \u22124", isNegPos: true  },
    { label: "(\u22123) \u00d7 2 = \u22126", isNegPos: true  },
  ];

  const rowY    = (i: number) => 48 + i * 52;
  const rightX  = 390;
  const arcOutX = 446;
  const numArcs = Math.min(step, 6);

  return (
    <svg viewBox="0 0 490 490" width="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Shaded region for neg × pos rows */}
      <rect
        x="10" y={rowY(4) - 22} width="388" height={52 * 3 + 18}
        rx="8" fill="#450a0a18" stroke="#dc262630" strokeWidth="1"
      />

      {rows.map((row, i) => {
        const y    = rowY(i);
        const isNP = row.isNegPos;
        return (
          <g key={i}>
            <rect
              x="12" y={y - 17} width="374" height="34" rx="6"
              fill={isNP ? "#450a0a50" : "#0f172a80"}
              stroke={isNP ? "#dc262660" : "#ffffff15"}
              strokeWidth="1"
            />
            <text x="28" y={y + 7} fontSize="14" fontFamily="monospace"
              fill={isNP ? "#f87171" : "#e2e8f0"} letterSpacing="0.5">
              {row.label}
            </text>
          </g>
        );
      })}

      {Array.from({ length: numArcs }, (_, i) => {
        const y1       = rowY(i);
        const y2       = rowY(i + 1);
        const isNPArc  = i >= 3;
        const stroke   = isNPArc ? "#f87171dd" : "#64748b60";
        const lbl      = isNPArc ? "#f87171"   : "#475569";
        const sw       = isNPArc ? 2.2 : 1.4;
        const dash     = isNPArc ? undefined : "5 3";
        return (
          <g key={`arc${i}`}>
            <path
              d={`M ${rightX},${y1} C ${arcOutX},${y1 + 20} ${arcOutX},${y2 - 20} ${rightX},${y2}`}
              fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={dash}
            />
            <path
              d={`M ${rightX - 6},${y2 - 10} L ${rightX},${y2} L ${rightX + 6},${y2 - 10}`}
              fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
            />
            <text x={arcOutX + 10} y={(y1 + y2) / 2 + 5}
              fill={lbl} fontSize="12" fontFamily="sans-serif" fontWeight="bold">
              -1
            </text>
          </g>
        );
      })}

      {/* Conclusion box */}
      <g>
        <rect
          x="12" y={rowY(7) + 6} width="466" height="44" rx="8"
          fill="#450a0a50" strokeWidth="2"
        >
          <animate attributeName="stroke" values="#dc262670;#f87171aa;#dc262670" dur="5s" repeatCount="indefinite"/>
          <animate attributeName="fill-opacity" values="0.25;0.4;0.25" dur="5s" repeatCount="indefinite"/>
        </rect>
        <text x="245" y={rowY(7) + 29} textAnchor="middle"
          fontSize="12.5" fontFamily="sans-serif" fontWeight="bold">
          <animate attributeName="fill" values="#f87171;#fca5a5;#ef4444;#f87171" dur="5s" repeatCount="indefinite"/>
          Setiap faktor &#8722;1 &#8594; hasil turun &#8722;2  &#8756; (&#8722;) &times; (+) = (&#8722;) &#10003;
        </text>
      </g>
    </svg>
  );
};

/* ── Animasi Pola: −1 × n, dari n=2 turun ke n=−3 ──────────────
   Setiap baris muncul satu per satu, dihubungkan busur "+1" di
   sebelah kanan. Baris neg×neg disorot kuning.
──────────────────────────────────────────────────────────────── */
const NegTimesNegPatternSVG = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0 ? 700  :
      step === 3 ? 1000 :
      step === 6 ? 700  :
      step === 7 ? 3200 :
      step === 8 ? 500  :
      860;
    const t = setTimeout(() => setStep(s => (s >= 8 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const rows = [
    { label: "-1 \u00d7 2 = -2",    isNegNeg: false },
    { label: "-1 \u00d7 1 = -1",    isNegNeg: false },
    { label: "-1 \u00d7 0 =  0",    isNegNeg: false },
    { label: "-1 \u00d7 (\u22121) = 1",  isNegNeg: true  },
    { label: "-1 \u00d7 (\u22122) = 2",  isNegNeg: true  },
    { label: "-1 \u00d7 (\u22123) = 3",  isNegNeg: true  },
  ];

  const rowY    = (i: number) => 48 + i * 56;
  const rightX  = 390;
  const arcOutX = 446;

  const numArcs = Math.min(step, 5);

  return (
    <svg viewBox="0 0 490 452" width="100%" xmlns="http://www.w3.org/2000/svg">

      {/* Shaded region for neg × neg rows — always visible */}
      <rect
        x="10" y={rowY(3) - 22} width="388" height={56 * 3 + 18}
        rx="8" fill="#78350f18" stroke="#d9770630" strokeWidth="1"
      />

      {/* Rows — all permanently visible */}
      {rows.map((row, i) => {
        const y    = rowY(i);
        const isNN = row.isNegNeg;
        return (
          <g key={i}>
            <rect
              x="12" y={y - 17} width="374" height="34" rx="6"
              fill={isNN ? "#78350f50" : "#0f172a80"}
              stroke={isNN ? "#d9770660" : "#ffffff15"}
              strokeWidth="1"
            />
            <text x="28" y={y + 7} fontSize="14" fontFamily="monospace"
              fill={isNN ? "#FDE047" : "#e2e8f0"} letterSpacing="0.5">
              {row.label}
            </text>
          </g>
        );
      })}

      {/* Arcs + "+1" labels */}
      {Array.from({ length: numArcs }, (_, i) => {
        const y1      = rowY(i);
        const y2      = rowY(i + 1);
        const isNNArc = i >= 2;
        const stroke  = isNNArc ? "#f59e0bdd" : "#64748b60";
        const lbl     = isNNArc ? "#FBBF24"   : "#475569";
        const sw      = isNNArc ? 2.2 : 1.4;
        const dash    = isNNArc ? undefined : "5 3";

        return (
          <g key={`arc${i}`}>
            <path
              d={`M ${rightX},${y1} C ${arcOutX},${y1 + 20} ${arcOutX},${y2 - 20} ${rightX},${y2}`}
              fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={dash}
            />
            {/* small arrowhead at destination */}
            <path
              d={`M ${rightX - 6},${y2 - 10} L ${rightX},${y2} L ${rightX + 6},${y2 - 10}`}
              fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
            />
            <text
              x={arcOutX + 10} y={(y1 + y2) / 2 + 5}
              fill={lbl} fontSize="12" fontFamily="sans-serif" fontWeight="bold"
            >+1</text>
          </g>
        );
      })}

      {/* Conclusion box — permanently visible with glow */}
      <g>
        <rect
          x="12" y={rowY(6) + 6} width="466" height="50" rx="8"
          fill="#14532d50" strokeWidth="2"
        >
          <animate attributeName="stroke" values="#16a34a70;#4ade80aa;#16a34a70" dur="5s" repeatCount="indefinite"/>
          <animate attributeName="fill-opacity" values="0.25;0.4;0.25" dur="5s" repeatCount="indefinite"/>
        </rect>
        <text x="245" y={rowY(6) + 27} textAnchor="middle"
          fontSize="12.5" fontFamily="sans-serif" fontWeight="bold">
          <animate attributeName="fill" values="#4ade80;#86efac;#22c55e;#4ade80" dur="5s" repeatCount="indefinite"/>
          Pola selalu +1 ke bawah &#8594; ketika pengurang menjadi negatif,
        </text>
        <text x="245" y={rowY(6) + 44} textAnchor="middle"
          fontSize="12.5" fontFamily="sans-serif" fontWeight="bold">
          <animate attributeName="fill" values="#86efac;#4ade80;#bbf7d0;#86efac" dur="5s" repeatCount="indefinite"/>
          hasilnya menjadi positif! &#8756; (&minus;) &times; (&minus;) = (+) &#10003;
        </text>
      </g>
    </svg>
  );
};

const PerkalianBilanganBulatPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "positifPositif", "positifNegatif", "negatifNegatif", "nolSatu", "contoh", "sifatPerkalian", "kesimpulan"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERKALIAN BILANGAN BULAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Bilangan Bulat - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section: Pengantar - Memahami Arti Perkalian */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Memahami Makna Perkalian</span>
              </div>
              {expandedSections.includes("intro") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Sebelum masuk ke perkalian bilangan bulat, yuk kita ingat lagi arti perkalian yang sudah dipelajari sejak SD. <strong className="text-primary">Perkalian adalah penjumlahan berulang!</strong>
                </p>
                
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">Konsep Dasar Perkalian:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1"><InlineMath math="2 \times 3" /> artinya ada <strong>dua buah tigaan</strong>:</p>
                      <BlockMath math="2 \times 3 = 3 + 3 = 6" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1"><InlineMath math="4 \times 5" /> artinya ada <strong>empat buah limaan</strong>:</p>
                      <BlockMath math="4 \times 5 = 5 + 5 + 5 + 5 = 20" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Ingat!</strong> <InlineMath math="a \times b" /> artinya <InlineMath math="b" /> ditambahkan sebanyak <InlineMath math="a" /> kali, BUKAN sebaliknya! Jadi <InlineMath math="2 \times 3 = 3 + 3" />, bukan <InlineMath math="2 + 2 + 2" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Perkalian Positif x Positif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("positifPositif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Positif × Positif = Positif</span>
              </div>
              {expandedSections.includes("positifPositif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("positifPositif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Ini adalah kasus paling mudah dan sudah kamu kenal sejak SD. Karena perkalian adalah <strong className="text-primary">penjumlahan berulang</strong>, hasil positif dikali positif sudah pasti positif.
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">Perhatikan polanya (mengalikan dengan 3):</p>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="1 \times 3 = 3" /></span>
                      <span className="text-white/50 text-xs">(satu buah 3)</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="2 \times 3 = 3 + 3 = 6" /></span>
                      <span className="text-white/50 text-xs">(dua buah 3)</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="3 \times 3 = 3 + 3 + 3 = 9" /></span>
                      <span className="text-white/50 text-xs">(tiga buah 3)</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="4 \times 3 = 3 + 3 + 3 + 3 = 12" /></span>
                      <span className="text-white/50 text-xs">(empat buah 3)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Kesimpulan:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Positif} \times \text{Positif} = \textbf{Positif}" />
                    <BlockMath math="a \times b = ab \quad (a, b > 0)" />
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Logika Sederhana:</strong> Jika kamu punya <InlineMath math="a" /> kelompok yang masing-masing berisi <InlineMath math="b" /> benda, totalnya selalu <InlineMath math="a \times b" /> benda — tidak pernah negatif!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Perkalian Positif dengan Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("positifNegatif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Positif × Negatif = Negatif</span>
              </div>
              {expandedSections.includes("positifNegatif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("positifNegatif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dengan konsep penjumlahan berulang, kita bisa menghitung perkalian bilangan positif dengan negatif:
                </p>

                {/* Pola Perkalian */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-3">Perhatikan polanya:</p>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="1 \times (-3) = -3" /></span>
                      <span className="text-white/50 text-xs">(satu buah -3)</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="2 \times (-3) = (-3) + (-3) = -6" /></span>
                      <span className="text-white/50 text-xs">(dua buah -3)</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="3 \times (-3) = (-3) + (-3) + (-3) = -9" /></span>
                      <span className="text-white/50 text-xs">(tiga buah -3)</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="4 \times (-3) = (-3) + (-3) + (-3) + (-3) = -12" /></span>
                      <span className="text-white/50 text-xs">(empat buah -3)</span>
                    </div>
                  </div>
                </div>

                {/* Kesimpulan */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Kesimpulan:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Positif} \times \text{Negatif} = \textbf{Negatif}" />
                    <BlockMath math="a \times (-b) = -ab" />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Section: Perkalian Positif x Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("negatifNegatif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">Negatif × Positif = Negatif</span>
              </div>
              {expandedSections.includes("negatifNegatif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("negatifNegatif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bagaimana jika bilangan <strong className="text-red-400">negatif</strong> dikalikan dengan bilangan <strong className="text-white">positif</strong>? Perhatikan pola berikut — setiap kali faktor pertama turun 1 (menjadi negatif), hasilnya pun terus turun!
                </p>

                {/* Animasi busur: Neg×Pos */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="font-body text-xs font-semibold text-red-300 mb-2">
                    (−) × (+) — pola turun:
                  </p>
                  <div className="bg-slate-900/60 rounded-xl p-2 border border-red-500/20">
                    <NegTimesPosPatternSVG />
                  </div>
                </div>

                {/* Kesimpulan Negatif × Positif */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">Kesimpulan:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Negatif} \times \text{Positif} = \textbf{Negatif}" />
                    <BlockMath math="-a \times b = -ab" />
                  </div>
                </div>

                {/* Pola Neg×Neg — Animasi Busur */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p className="font-body font-semibold text-white">Negatif × Negatif = Positif</p>
                  </div>
                  <p className="font-body text-sm text-white/80">
                    Ikuti busur <InlineMath math="-1 \times \ldots" /> ke bawah — setiap kali faktor pertama turun 1 (menjadi negatif), hasilnya justru <strong className="text-yellow-300">naik menjadi positif</strong>! Busur redup = pola awal, busur terang = wilayah negatif × negatif.
                  </p>
                  <div className="bg-slate-900/60 rounded-xl p-3 border border-yellow-500/20">
                    <NegTimesNegPatternSVG />
                  </div>
                </div>

                {/* Kesimpulan */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Kesimpulan:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Negatif} \times \text{Negatif} = \textbf{Positif}" />
                    <BlockMath math="(-a) \times (-b) = ab" />
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Cara Mudah Mengingat:</strong> Bayangkan tanda negatif seperti "berbalik arah". Satu negatif membalik ke arah negatif, tapi dua negatif membalik dua kali sehingga kembali ke arah positif!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Perkalian dengan 0 dan 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("nolSatu")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">Perkalian dengan 0 dan 1</span>
              </div>
              {expandedSections.includes("nolSatu") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("nolSatu") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Perkalian dengan 0 */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-3">Perkalian dengan 0:</p>
                  <p className="font-body text-sm text-white/80 mb-3">
                    Bilangan apapun jika dikalikan dengan 0, hasilnya selalu 0. Logikanya? Jika kamu punya 0 kelompok dari suatu benda, ya tidak ada benda sama sekali!
                  </p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-2">
                      <InlineMath math="5 \times 0 = 0" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <InlineMath math="0 \times (-7) = 0" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <InlineMath math="(-100) \times 0 = 0" />
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-3 mt-3">
                    <BlockMath math="a \times 0 = 0 \times a = 0" />
                  </div>
                </div>

                {/* Perkalian dengan 1 */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-3">Perkalian dengan 1 (Elemen Identitas):</p>
                  <p className="font-body text-sm text-white/80 mb-3">
                    Bilangan apapun jika dikalikan dengan 1, hasilnya adalah bilangan itu sendiri. Angka 1 disebut <strong className="text-primary">elemen identitas</strong> perkalian.
                  </p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-2">
                      <InlineMath math="8 \times 1 = 8" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <InlineMath math="1 \times (-15) = -15" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <InlineMath math="(-99) \times 1 = -99" />
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-3 mt-3">
                    <BlockMath math="a \times 1 = 1 \times a = a" />
                  </div>
                </div>

                {/* Ringkasan Aturan Tanda */}
                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3">Ringkasan Aturan Tanda Perkalian:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="py-2 px-3 text-left text-white/70">Bilangan 1</th>
                          <th className="py-2 px-3 text-center text-white/70">x</th>
                          <th className="py-2 px-3 text-left text-white/70">Bilangan 2</th>
                          <th className="py-2 px-3 text-center text-white/70">=</th>
                          <th className="py-2 px-3 text-left text-white/70">Hasil</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-green-400">Positif (+)</td>
                          <td className="py-2 px-3 text-center text-white/50">x</td>
                          <td className="py-2 px-3 text-green-400">Positif (+)</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-green-400 font-bold">Positif (+)</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-green-400">Positif (+)</td>
                          <td className="py-2 px-3 text-center text-white/50">x</td>
                          <td className="py-2 px-3 text-red-400">Negatif (-)</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-red-400 font-bold">Negatif (-)</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-red-400">Negatif (-)</td>
                          <td className="py-2 px-3 text-center text-white/50">x</td>
                          <td className="py-2 px-3 text-green-400">Positif (+)</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-red-400 font-bold">Negatif (-)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-red-400">Negatif (-)</td>
                          <td className="py-2 px-3 text-center text-white/50">x</td>
                          <td className="py-2 px-3 text-red-400">Negatif (-)</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-green-400 font-bold">Positif (+)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Contoh Soal dan Pembahasan</span>
              </div>
              {expandedSections.includes("contoh") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Hitunglah hasil perkalian berikut:
                    </p>
                    <div className="space-y-1 ml-4">
                      <p className="text-white/80">a. <InlineMath math="6 \times (-10)" /></p>
                      <p className="text-white/80">b. <InlineMath math="-4 \times 7" /></p>
                      <p className="text-white/80">c. <InlineMath math="-8 \times (-12)" /></p>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      {/* Soal a */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="6 \times (-10)" /></p>
                        <p className="mb-1"><strong>Aturan:</strong> Positif x Negatif = Negatif</p>
                        <BlockMath math="6 \times (-10) = -(6 \times 10) = -60" />
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="-60" /></p>
                      </div>
                      {/* Soal b */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="-4 \times 7" /></p>
                        <p className="mb-1"><strong>Aturan:</strong> Negatif x Positif = Negatif</p>
                        <BlockMath math="-4 \times 7 = -(4 \times 7) = -28" />
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="-28" /></p>
                      </div>
                      {/* Soal c */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">c. <InlineMath math="-8 \times (-12)" /></p>
                        <p className="mb-1"><strong>Aturan:</strong> Negatif x Negatif = Positif</p>
                        <BlockMath math="-8 \times (-12) = 8 \times 12 = 96" />
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="96" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Hitunglah hasil perkalian berikut:
                    </p>
                    <div className="space-y-1 ml-4">
                      <p className="text-white/80">a. <InlineMath math="9 \times [2 \times (-12)]" /></p>
                      <p className="text-white/80">b. <InlineMath math="12 \times [8 + (-19)]" /></p>
                      <p className="text-white/80">c. <InlineMath math="(-7 \times 3) \times (-8)" /></p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      {/* Soal a */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="9 \times [2 \times (-12)]" /></p>
                        <p className="mb-1"><strong>Langkah 1:</strong> Hitung yang dalam kurung dulu.</p>
                        <BlockMath math="2 \times (-12) = -24" />
                        <p className="mb-1"><strong>Langkah 2:</strong> Kalikan hasilnya dengan 9.</p>
                        <BlockMath math="9 \times (-24) = -216" />
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="-216" /></p>
                      </div>
                      {/* Soal b */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="12 \times [8 + (-19)]" /></p>
                        <p className="mb-1"><strong>Langkah 1:</strong> Hitung penjumlahan dalam kurung.</p>
                        <BlockMath math="8 + (-19) = 8 - 19 = -11" />
                        <p className="mb-1"><strong>Langkah 2:</strong> Kalikan hasilnya dengan 12.</p>
                        <BlockMath math="12 \times (-11) = -132" />
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="-132" /></p>
                      </div>
                      {/* Soal c */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">c. <InlineMath math="(-7 \times 3) \times (-8)" /></p>
                        <p className="mb-1"><strong>Langkah 1:</strong> Hitung perkalian dalam kurung.</p>
                        <BlockMath math="-7 \times 3 = -21" />
                        <p className="mb-1"><strong>Langkah 2:</strong> Kalikan hasilnya dengan -8. (Negatif x Negatif = Positif)</p>
                        <BlockMath math="(-21) \times (-8) = 168" />
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="168" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit (Soal Cerita) */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3: Soal Cerita</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Suhu udara di puncak sebuah gunung pada sore hari adalah <InlineMath math="18°C" />. Setiap 2 jam, suhu turun <InlineMath math="4°C" />. Tentukan suhu di puncak gunung tersebut setelah 10 jam!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Tentukan berapa kali suhu turun dalam 10 jam.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Jumlah penurunan} = \frac{10}{2} = 5 \text{ kali}" />
                      </div>
                      
                      <p><strong>Langkah 2:</strong> Hitung total penurunan suhu. Suhu turun artinya perubahan negatif!</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Total penurunan} = 5 \times (-4) = -20°C" />
                      </div>
                      
                      <p><strong>Langkah 3:</strong> Hitung suhu akhir dengan menambahkan perubahan suhu ke suhu awal.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Suhu akhir} = 18 + (-20) = 18 - 20 = -2°C" />
                      </div>

                      <p className="text-primary font-semibold">Jadi, suhu di puncak gunung setelah 10 jam adalah <InlineMath math="-2°C" />.</p>
                    </div>
                  </div>
                </div>

                {/* Contoh Bonus */}
                <div className="border-l-4 border-purple-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">BONUS</span>
                    <span className="font-body font-semibold text-white">Contoh 4: Operasi Gabungan</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Hitunglah: <InlineMath math="-4 \times [5 \times (-6)]" /> dan <InlineMath math="[10 + (-24)] \times (-9)" />
                    </p>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-purple-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      {/* Soal 1 */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2"><InlineMath math="-4 \times [5 \times (-6)]" /></p>
                        <p className="mb-1"><strong>Langkah 1:</strong> <InlineMath math="5 \times (-6) = -30" /></p>
                        <p className="mb-1"><strong>Langkah 2:</strong> <InlineMath math="-4 \times (-30) = 120" /></p>
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="120" /></p>
                      </div>
                      {/* Soal 2 */}
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2"><InlineMath math="[10 + (-24)] \times (-9)" /></p>
                        <p className="mb-1"><strong>Langkah 1:</strong> <InlineMath math="10 + (-24) = 10 - 24 = -14" /></p>
                        <p className="mb-1"><strong>Langkah 2:</strong> <InlineMath math="(-14) \times (-9) = 126" /></p>
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="126" /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Sifat-Sifat Perkalian */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("sifatPerkalian")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Sifat-Sifat Perkalian Bilangan Bulat</span>
              </div>
              {expandedSections.includes("sifatPerkalian") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("sifatPerkalian") && (
              <div className="px-5 pb-5 space-y-4">

                {/* 1. Komutatif */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">1. Sifat Komutatif (Pertukaran)</p>
                  <p className="font-body text-sm text-white/80 mb-3">
                    Urutan faktor dalam perkalian tidak mempengaruhi hasil. Menukar posisi kedua bilangan tidak mengubah hasilnya.
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <BlockMath math="a \times b = b \times a" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-cyan-300"><InlineMath math="3 \times (-5) = -15" /></span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-cyan-300"><InlineMath math="(-5) \times 3 = -15" /></span>
                    </div>
                  </div>
                </div>

                {/* 2. Unsur Identitas */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">2. Unsur Identitas Perkalian</p>
                  <p className="font-body text-sm text-white/80 mb-3">
                    Bilangan <strong className="text-primary">1</strong> adalah unsur identitas perkalian. Apapun bilangan yang dikalikan dengan 1, hasilnya adalah bilangan itu sendiri.
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <BlockMath math="a \times 1 = 1 \times a = a" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-blue-300"><InlineMath math="(-7) \times 1 = -7" /></span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-blue-300"><InlineMath math="1 \times 15 = 15" /></span>
                    </div>
                  </div>
                </div>

                {/* 3. Asosiatif */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">3. Sifat Asosiatif (Pengelompokan)</p>
                  <p className="font-body text-sm text-white/80 mb-3">
                    Cara mengelompokkan tiga bilangan yang dikalikan tidak mempengaruhi hasil akhirnya.
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <BlockMath math="(a \times b) \times c = a \times (b \times c)" />
                  </div>
                  <div className="bg-slate-900/50 rounded p-3">
                    <p className="text-white/60 text-xs mb-1">Contoh:</p>
                    <BlockMath math="(2 \times (-3)) \times 4 = 2 \times ((-3) \times 4)" />
                    <BlockMath math="(-6) \times 4 = 2 \times (-12) = -24 \checkmark" />
                  </div>
                </div>

                {/* 4. Tertutup */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">4. Sifat Tertutup</p>
                  <p className="font-body text-sm text-white/80 mb-3">
                    Hasil perkalian dua bilangan bulat selalu berupa bilangan bulat juga. Perkalian tidak pernah menghasilkan bilangan di luar himpunan bilangan bulat.
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <BlockMath math="\text{Jika } a, b \in \mathbb{Z} \text{, maka } a \times b \in \mathbb{Z}" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-green-300"><InlineMath math="(-4) \times 6 = -24 \in \mathbb{Z}" /></span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-green-300"><InlineMath math="(-9) \times (-3) = 27 \in \mathbb{Z}" /></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Kesimpulan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesimpulan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-body font-semibold text-white">Kesimpulan & Tips Perkalian Bilangan Bulat</span>
              </div>
              {expandedSections.includes("kesimpulan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kesimpulan") && (
              <div className="px-5 pb-5 space-y-4">

                {/* Kesimpulan Aturan Tanda */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">Kesimpulan Aturan Tanda:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-green-400 font-mono text-sm font-bold w-36">(+) × (+)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-green-400 font-bold">Positif (+)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-orange-400 font-mono text-sm font-bold w-36">(+) × (−)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-red-400 font-bold">Negatif (−)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-orange-400 font-mono text-sm font-bold w-36">(−) × (+)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-red-400 font-bold">Negatif (−)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-yellow-400 font-mono text-sm font-bold w-36">(−) × (−)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-green-400 font-bold">Positif (+)</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 mt-3">
                    <p className="text-white/70 text-xs text-center">Cara mudah mengingat: <strong className="text-cyan-300">Tanda sama → positif &nbsp;|&nbsp; Tanda beda → negatif</strong></p>
                  </div>
                </div>

                {/* Ringkasan Sifat */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">Ringkasan Sifat-Sifat:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2 items-start">
                      <span className="text-cyan-400 font-bold min-w-fit">Komutatif:</span>
                      <span className="text-white/80"><InlineMath math="a \times b = b \times a" /></span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <span className="text-blue-400 font-bold min-w-fit">Identitas:</span>
                      <span className="text-white/80"><InlineMath math="a \times 1 = a" /></span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <span className="text-purple-400 font-bold min-w-fit">Asosiatif:</span>
                      <span className="text-white/80"><InlineMath math="(a \times b) \times c = a \times (b \times c)" /></span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <span className="text-green-400 font-bold min-w-fit">Tertutup:</span>
                      <span className="text-white/80">Hasil perkalian bilangan bulat selalu bilangan bulat</span>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-3">Tips Cepat Mengerjakan Soal:</p>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">1.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Hitung nilai mutlaknya dulu</strong>, baru tentukan tandanya. Misalnya <InlineMath math="(-6) \times (-7)" />: nilai mutlak = <InlineMath math="6 \times 7 = 42" />, tanda: (−)×(−) = (+), jadi hasilnya <InlineMath math="42" />.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">2.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Kerjakan kurung terdalam dahulu</strong> pada perkalian bertingkat, baru lanjutkan ke luar.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">3.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Hitung jumlah tanda negatif</strong>: genap → hasil positif, ganjil → hasil negatif. Contoh: <InlineMath math="(-1) \times (-2) \times (-3) = -6" /> (3 tanda negatif = ganjil → negatif).
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">4.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Gunakan sifat komutatif</strong> untuk mempermudah perhitungan. Susun ulang urutan faktor agar lebih mudah dikalikan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tombol Navigasi */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => {
                playPopSound();
                navigate("/materi-matematika/kelas-7/bilangan-bulat/pengurangan");
              }}
              className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-3 text-white/70 hover:text-white hover:border-primary/60 transition-all duration-300"
            >
              &larr; Pengurangan
            </button>
            <button
              onClick={() => {
                playPopSound();
                navigate("/materi-matematika/kelas-7/bilangan-bulat");
              }}
              className="bg-primary/20 backdrop-blur border border-primary/60 rounded-xl px-5 py-3 text-primary hover:bg-primary/30 transition-all duration-300"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerkalianBilanganBulatPage;
