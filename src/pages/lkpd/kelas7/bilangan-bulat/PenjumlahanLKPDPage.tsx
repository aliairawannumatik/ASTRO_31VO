import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Calculator,
  Target,
  Sparkles,
  List,
  Layers,
} from "lucide-react";
import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import type { LKPDGame } from "@/components/LKPDGameZone";

/* ──────────────────────────────────────────────────────────────
   ANIMATED SVG COMPONENTS  (adapted from PenjumlahanPage.tsx)
──────────────────────────────────────────────────────────────── */

const NumberLineSVG = () => {
  const nums = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const cx = (n: number) => 300 + n * 50;
  return (
    <svg viewBox="0 0 620 88" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="lkpd-arr-r" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 9 3.5, 0 7" fill="#FFD700" />
        </marker>
        <marker id="lkpd-arr-l" markerWidth="9" markerHeight="7" refX="1" refY="3.5" orient="auto-start-reverse">
          <polygon points="0 0, 9 3.5, 0 7" fill="#FFD700" />
        </marker>
      </defs>
      <line x1="14" y1="38" x2="606" y2="38" stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#lkpd-arr-r)" markerStart="url(#lkpd-arr-l)" />
      <text x="7"   y="43" fill="#FFD700" fontSize="15" fontFamily="monospace" textAnchor="middle">…</text>
      <text x="613" y="43" fill="#FFD700" fontSize="15" fontFamily="monospace" textAnchor="middle">…</text>
      {nums.map(n => {
        const x = cx(n);
        const isZero = n === 0;
        return (
          <g key={n}>
            <line x1={x} y1={isZero ? 26 : 30} x2={x} y2={isZero ? 50 : 46}
              stroke={isZero ? "#FFFFFF" : "#FFD700"} strokeWidth={isZero ? 2.5 : 1.8} />
            <text x={x} y={66} textAnchor="middle"
              fill={isZero ? "#FFFFFF" : "#FFE57F"}
              fontSize={isZero ? "14" : "12"}
              fontWeight={isZero ? "bold" : "normal"}
              fontFamily="monospace">{n}</text>
          </g>
        );
      })}
      <text x="58"  y="83" fill="#FFD700" fontSize="10" fontFamily="sans-serif" opacity="0.65">← negatif</text>
      <text x="475" y="83" fill="#FFD700" fontSize="10" fontFamily="sans-serif" opacity="0.65">positif →</text>
    </svg>
  );
};

const DirectionDemoSVG = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const delay =
      step === 0  ? 700  :
      step === 5  ? 2000 :
      step === 6  ? 450  :
      step === 11 ? 2000 :
      step === 12 ? 600  : 750;
    const t = setTimeout(() => setStep(s => (s >= 12 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const sp = 52, cx = (n: number) => 320 + n * sp, yA = 72;
  const nums = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const numGreen = step >= 1 && step <= 5 ? Math.min(step, 4) : 0;
  const numRed   = step >= 7 && step <= 11 ? Math.min(step - 6, 4) : 0;
  const showResultRight = step === 5, showResultLeft = step === 11;
  const isPhaseRight = step >= 1 && step <= 5, isPhaseLeft = step >= 7;

  const statusText =
    step === 0  ? "" :
    step <= 4   ? `Langkah +${step} · dari ${step - 1} ke ${step}` :
    step === 5  ? "0 + 4 = 4  ✓  Positif → bergerak ke KANAN →" :
    step === 6  ? "Sekarang dengan bilangan negatif..." :
    step <= 10  ? `Langkah −${step - 6} · dari ${step === 7 ? 0 : -(step - 7)} ke ${-(step - 6)}` :
    step === 11 ? "0 + (−4) = −4  ✓  Negatif → bergerak ke KIRI ←" : "";
  const statusColor = step === 5 ? "#4ade80" : step === 11 ? "#f87171" : step >= 7 ? "#f87171" : step >= 1 ? "#4ade80" : "#ffffff";

  return (
    <svg viewBox="0 0 640 152" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="lkpd-dird-ar" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="lkpd-dird-al" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="lkpd-dird-g" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#4ade80"/>
        </marker>
        <marker id="lkpd-dird-r" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#f87171"/>
        </marker>
      </defs>
      <text x="14" y="15" fill="#f87171" fontSize="10" fontFamily="sans-serif" fontWeight="bold">← KIRI</text>
      <text x="14" y="27" fill="#f87171" fontSize="9"  fontFamily="sans-serif" opacity="0.8">(negatif)</text>
      <text x="626" y="15" fill="#4ade80" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="end">KANAN →</text>
      <text x="626" y="27" fill="#4ade80" fontSize="9"  fontFamily="sans-serif" opacity="0.8" textAnchor="end">(positif)</text>
      {isPhaseRight && (
        <text x="320" y="22" textAnchor="middle" fill="#4ade8099" fontSize="11" fontFamily="sans-serif" fontWeight="bold">0 + 4 = ?</text>
      )}
      {isPhaseLeft && (
        <text x="320" y="22" textAnchor="middle" fill="#f8717199" fontSize="11" fontFamily="sans-serif" fontWeight="bold">0 + (−4) = ?</text>
      )}
      <line x1="12" y1={yA} x2="628" y2={yA} stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#lkpd-dird-ar)" markerStart="url(#lkpd-dird-al)"/>
      <circle cx={cx(0)} cy={yA} r="5" fill="#ffffff" opacity="0.9"/>
      {nums.map(n => {
        const x = cx(n);
        const isZero = n === 0, isResR = showResultRight && n === 4, isResL = showResultLeft && n === -4;
        const tickColor = isResR ? "#4ade80" : isResL ? "#f87171" : isZero ? "#ffffff" : "#FFD700";
        const txtColor  = isResR ? "#4ade80" : isResL ? "#f87171" : isZero ? "#ffffff" : "#FFE57F";
        const prominent = isZero || isResR || isResL;
        return (
          <g key={n}>
            <line x1={x} y1={prominent ? 60 : 65} x2={x} y2={prominent ? 84 : 79}
              stroke={tickColor} strokeWidth={prominent ? 2.5 : 1.8}/>
            <text x={x} y={97} textAnchor="middle" fontFamily="monospace"
              fill={txtColor} fontSize={prominent ? "13" : "11"} fontWeight={prominent ? "bold" : "normal"}>{n}</text>
          </g>
        );
      })}
      {Array.from({length: numGreen}, (_, i) => {
        const x1 = cx(i), x2 = cx(i+1), mx = (x1+x2)/2;
        return <path key={`ldg${i}`} d={`M ${x1},${yA} Q ${mx},${yA-30} ${x2},${yA}`}
          fill="none" stroke="#4ade80" strokeWidth="2.2" markerEnd="url(#lkpd-dird-g)"/>;
      })}
      {Array.from({length: numRed}, (_, i) => {
        const x1 = cx(-i), x2 = cx(-i-1), mx = (x1+x2)/2;
        return <path key={`ldr${i}`} d={`M ${x1},${yA} Q ${mx},${yA+30} ${x2},${yA}`}
          fill="none" stroke="#f87171" strokeWidth="2.2" markerEnd="url(#lkpd-dird-r)"/>;
      })}
      {showResultRight && <circle cx={cx(4)}  cy={yA} r="9" fill="none" stroke="#4ade80" strokeWidth="2.5"/>}
      {showResultLeft  && <circle cx={cx(-4)} cy={yA} r="9" fill="none" stroke="#f87171" strokeWidth="2.5"/>}
      {step >= 1 && step <= 4  && <circle cx={cx(step)}        cy={yA} r="5" fill="#4ade80"/>}
      {step >= 7 && step <= 10 && <circle cx={cx(-(step-6))}   cy={yA} r="5" fill="#f87171"/>}
      {statusText && (
        <text x="320" y="136" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fontWeight="bold" fill={statusColor}>
          {statusText}
        </text>
      )}
    </svg>
  );
};

const NumberLineContoh1SVG = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const delay =
      step === 0  ? 800  :
      step === 9  ? 1100 :
      step === 13 ? 2800 : 750;
    const t = setTimeout(() => setStep(s => (s >= 13 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const sp = 50, cx = (n: number) => 90 + n * sp, yA = 68;
  const nums = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const numGreen = Math.min(step, 8);
  const numRed   = Math.min(step >= 10 ? step - 9 : 0, 3);
  const showResult = step >= 12;

  const statusText =
    step === 0  ? "Siap..." :
    step <= 8   ? `Langkah +${step} · dari ${step-1} ke ${step}` :
    step === 9  ? "Sudah di 8 · sekarang mundur −3..." :
    step <= 12  ? `Langkah −${step-9} · dari ${8-(step-10)} ke ${7-(step-10)}` :
                  "Hasil: 8 + (−3) = 5  ✓";
  const statusColor = step >= 13 ? "#67e8f9" : step >= 10 ? "#f87171" : "#4ade80";

  return (
    <svg viewBox="0 0 640 136" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="lkpd-nl2-ar" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="lkpd-nl2-al" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="lkpd-nl2-g" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#4ade80"/>
        </marker>
        <marker id="lkpd-nl2-r" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#f87171"/>
        </marker>
      </defs>
      <line x1="12" y1={yA} x2="628" y2={yA} stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#lkpd-nl2-ar)" markerStart="url(#lkpd-nl2-al)"/>
      {nums.map(n => {
        const x = cx(n);
        const isZero = n === 0, isKey = n === 5 || n === 8;
        const tickClr = n === 5 && showResult ? "#67e8f9" : n === 8 && step >= 9 ? "#86efac" : isZero ? "#ffffff" : "#FFD700";
        const txtClr  = n === 5 && showResult ? "#67e8f9" : n === 8 && step >= 9 ? "#86efac" : isZero ? "#ffffff" : "#FFE57F";
        return (
          <g key={n}>
            <line x1={x} y1={isZero || isKey ? 57 : 62} x2={x} y2={isZero || isKey ? 79 : 74}
              stroke={tickClr} strokeWidth={isZero || isKey ? 2.5 : 1.8}/>
            <text x={x} y={93} textAnchor="middle" fontFamily="monospace"
              fill={txtClr} fontSize={isZero || isKey ? "13" : "11"} fontWeight={isZero || isKey ? "bold" : "normal"}>{n}</text>
          </g>
        );
      })}
      {Array.from({length: numGreen}, (_, i) => {
        const x1 = cx(i), x2 = cx(i+1), mx = (x1+x2)/2;
        return <path key={`lg${i}`} d={`M ${x1},${yA} Q ${mx},${yA-26} ${x2},${yA}`}
          fill="none" stroke="#4ade80" strokeWidth="2.2" markerEnd="url(#lkpd-nl2-g)"/>;
      })}
      {Array.from({length: numRed}, (_, i) => {
        const x1 = cx(8-i), x2 = cx(7-i), mx = (x1+x2)/2;
        return <path key={`lr${i}`} d={`M ${x1},${yA} Q ${mx},${yA+26} ${x2},${yA}`}
          fill="none" stroke="#f87171" strokeWidth="2.2" markerEnd="url(#lkpd-nl2-r)"/>;
      })}
      {showResult && <circle cx={cx(5)} cy={yA} r="8" fill="none" stroke="#67e8f9" strokeWidth="2.5"/>}
      {step >= 1 && step <= 8  && <circle cx={cx(step)}          cy={yA} r="4" fill="#4ade80"/>}
      {step >= 10 && step <= 12 && <circle cx={cx(7-(step-10))}  cy={yA} r="4" fill="#f87171"/>}
      <text x="320" y="122" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fontWeight="bold" fill={statusColor}>
        {statusText}
      </text>
    </svg>
  );
};

/* ──────────────────────────────────────────────────────────────
   MATERI SECTION — embedded reading material with animations
──────────────────────────────────────────────────────────────── */

const MateriSection = () => {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<string[]>(["konsep", "contoh", "sifat"]);

  const toggle = (id: string) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const isOpen = (id: string) => expanded.includes(id);

  return (
    <section className="mb-6 rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-500/10 via-orange-500/8 to-yellow-500/10 backdrop-blur overflow-hidden animate-slide-up">
      {/* ── Header toggle ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <p className="font-display font-bold text-amber-100 text-lg leading-tight">📖 Baca Materi Dulu</p>
            <p className="text-xs text-amber-200/60 font-body mt-0.5">Penjumlahan Bilangan Bulat — Kelas 7</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-amber-300/60 font-body">
            {open ? "Sembunyikan" : "Tampilkan"}
          </span>
          {open
            ? <ChevronUp className="w-5 h-5 text-amber-300" />
            : <ChevronDown className="w-5 h-5 text-amber-300" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-6 space-y-3">

          {/* ── Sub-section: Mengapa Bilangan Negatif ── */}
          <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
            <button onClick={() => toggle("intro")}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="font-body font-semibold text-white text-sm">Mengapa Kita Butuh Bilangan Negatif?</span>
              </div>
              {isOpen("intro") ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
            </button>
            {isOpen("intro") && (
              <div className="px-4 pb-4 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Di Sekolah Dasar, kita kenal <strong className="text-primary">bilangan asli</strong> (1, 2, 3, …) dan <strong className="text-primary">bilangan cacah</strong> (0, 1, 2, …). Tapi bilangan-bilangan itu belum cukup untuk semua situasi dunia nyata.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Contoh nyata:</strong> Suhu Jepang saat musim dingin bisa mencapai <InlineMath math="-5°C" />. Bagaimana cara menuliskannya jika hanya ada bilangan positif?
                  </p>
                </div>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bilangan negatif digunakan untuk menyatakan nilai di bawah nol, seperti:
                </p>
                <ul className="font-body text-sm text-white/70 space-y-1 ml-4 list-disc">
                  <li>Suhu di bawah <InlineMath math="0°C" /> → mis. <InlineMath math="-10°C" /></li>
                  <li>Kedalaman di bawah laut → mis. <InlineMath math="-80\text{ m}" /></li>
                  <li>Hutang atau kerugian dalam keuangan</li>
                </ul>
                <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                  <p className="font-body text-sm text-accent leading-relaxed">
                    <strong>Definisi:</strong> <strong className="text-white">Bilangan bulat</strong> terdiri dari bilangan negatif (…, −3, −2, −1), nol (0), dan bilangan positif (1, 2, 3, …).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Sub-section: Konsep Garis Bilangan ── */}
          <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
            <button onClick={() => toggle("konsep")}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="font-body font-semibold text-white text-sm">Konsep: Garis Bilangan & Aturan Arah</span>
              </div>
              {isOpen("konsep") ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
            </button>
            {isOpen("konsep") && (
              <div className="px-4 pb-4 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Cara mudah memahami penjumlahan bilangan bulat adalah dengan <strong className="text-primary">garis bilangan</strong>. Bayangkan kamu berdiri di titik nol dan berjalan sesuai instruksi.
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">Aturan Arah di Garis Bilangan:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3 text-center">
                      <p className="text-green-300 text-2xl font-bold">→</p>
                      <p className="font-body text-xs font-semibold text-green-300 mt-1">Bilangan Positif (+)</p>
                      <p className="font-body text-xs text-green-200/80">Bergerak ke <strong>kanan</strong></p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-center">
                      <p className="text-red-300 text-2xl font-bold">←</p>
                      <p className="font-body text-xs font-semibold text-red-300 mt-1">Bilangan Negatif (−)</p>
                      <p className="font-body text-xs text-red-200/80">Bergerak ke <strong>kiri</strong></p>
                    </div>
                  </div>
                </div>

                {/* Static number line */}
                <div className="bg-slate-900/60 rounded-xl p-3 border border-yellow-500/20">
                  <p className="text-yellow-300/70 text-xs text-center mb-2 font-body">Garis Bilangan (−5 sampai 5)</p>
                  <NumberLineSVG />
                </div>

                {/* Animated direction demo */}
                <div className="bg-slate-900/60 rounded-xl p-3 border border-cyan-500/25">
                  <p className="text-cyan-300/70 text-xs text-center mb-1 font-body">
                    🎬 Animasi: Tambah Positif = Kanan &nbsp;·&nbsp; Tambah Negatif = Kiri
                  </p>
                  <DirectionDemoSVG />
                </div>

                {/* Formulas */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Rumus Penjumlahan Bilangan Bulat:</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-green-500/20">
                      <p className="text-white/60 text-xs mb-1">Kedua <strong className="text-green-400">positif</strong>:</p>
                      <div className="text-center"><InlineMath math="a + b = a + b" /></div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-white/60 text-xs mb-1">Jika <InlineMath math="|a| > |b|" />:</p>
                      <div className="text-center"><InlineMath math="-a + b = -(a - b)" /></div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-white/60 text-xs mb-1">Jika <InlineMath math="|b| > |a|" />:</p>
                      <div className="text-center"><InlineMath math="-a + b = b - a" /></div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-white/60 text-xs mb-1">Kedua <strong className="text-red-400">negatif</strong>:</p>
                      <div className="text-center"><InlineMath math="-a + (-b) = -(a + b)" /></div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-3">
                    <p className="font-body text-xs text-yellow-200 leading-relaxed">
                      <strong>Tips Mudah:</strong> Tanda berbeda? Kurangkan nilai absolutnya, lalu gunakan tanda bilangan yang nilainya lebih besar.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sub-section: Contoh Soal ── */}
          <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
            <button onClick={() => toggle("contoh")}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-400" />
                <span className="font-body font-semibold text-white text-sm">Contoh Soal dan Pembahasan</span>
              </div>
              {isOpen("contoh") ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
            </button>
            {isOpen("contoh") && (
              <div className="px-4 pb-4 space-y-5">
                {/* Contoh 1 */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="font-body text-sm text-white">
                      Hitunglah <InlineMath math="8 + (-3)" /> menggunakan garis bilangan!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Mulai dari 0, bergerak <strong className="text-green-400">8 ke kanan</strong> (positif).</p>
                      <p><strong>Langkah 2:</strong> Dari 8, bergerak <strong className="text-red-400">3 ke kiri</strong> (negatif).</p>
                      <p><strong>Langkah 3:</strong> Titik akhir di <strong className="text-cyan-300">5</strong>.</p>
                      <div className="bg-slate-900/60 rounded-xl p-3 border border-yellow-500/20 mt-2">
                        <p className="text-yellow-300/70 text-xs text-center mb-1 font-body">🎬 Visualisasi Animasi</p>
                        <NumberLineContoh1SVG />
                        <div className="flex flex-wrap gap-3 justify-center mt-1 text-xs font-body">
                          <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-green-400"></span> +8 ke kanan</span>
                          <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-red-400"></span> −3 ke kiri</span>
                          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full border-2 border-cyan-300"></span> hasil = 5</span>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 mt-1">
                        <BlockMath math="8 + (-3) = 8 - 3 = 5" />
                      </div>
                      <p className="text-primary font-semibold">Jadi, <InlineMath math="8 + (-3) = 5" /></p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="font-body text-sm text-white mb-2">Hitunglah:</p>
                    <div className="space-y-1 ml-3 font-body text-sm text-white/80">
                      <p>a. <InlineMath math="-27 + 12" /></p>
                      <p>b. <InlineMath math="-14 + 29" /></p>
                      <p>c. <InlineMath math="-36 + (-58)" /></p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-1">a. <InlineMath math="-27 + 12" /></p>
                        <p className="mb-1 text-xs">|27| {">"} |12| dan 27 bertanda negatif:</p>
                        <BlockMath math="-27 + 12 = -(27 - 12) = -15" />
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-1">b. <InlineMath math="-14 + 29" /></p>
                        <p className="mb-1 text-xs">|29| {">"} |14| dan 29 bertanda positif:</p>
                        <BlockMath math="-14 + 29 = 29 - 14 = 15" />
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-1">c. <InlineMath math="-36 + (-58)" /></p>
                        <p className="mb-1 text-xs">Keduanya negatif, jumlahkan nilai mutlak:</p>
                        <BlockMath math="-36 + (-58) = -(36 + 58) = -94" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 3 — Soal Kontekstual</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="font-body text-sm text-white">
                      Suhu ruang penyimpanan pabrik es krim adalah <InlineMath math="-17°C" />. Ruang administrasi tercatat <InlineMath math="41°" /> lebih tinggi. Berapa suhu ruang administrasi?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Model matematika: <InlineMath math="-17 + 41" /></p>
                      <p>Karena |41| {">"} |17| dan 41 positif:</p>
                      <BlockMath math="-17 + 41 = 41 - 17 = 24" />
                      <p className="text-primary font-semibold">Suhu ruang administrasi: <InlineMath math="24°C" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sub-section: Sifat-sifat ── */}
          <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
            <button onClick={() => toggle("sifat")}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-blue-400" />
                <span className="font-body font-semibold text-white text-sm">Sifat-sifat Penjumlahan Bilangan Bulat</span>
              </div>
              {isOpen("sifat") ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
            </button>
            {isOpen("sifat") && (
              <div className="px-4 pb-4 space-y-3">
                <p className="font-body text-xs text-white/60">Ada 4 sifat penting penjumlahan bilangan bulat:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Komutatif */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 1</span>
                      <p className="font-body text-xs font-bold text-blue-300">Komutatif</p>
                    </div>
                    <div className="bg-slate-900/60 rounded p-2 text-center mb-2">
                      <InlineMath math="a + b = b + a" />
                    </div>
                    <p className="font-body text-xs text-white/60">Contoh: <InlineMath math="-7 + 4 = 4 + (-7) = -3" /></p>
                  </div>
                  {/* Identitas */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-500/30 text-green-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 2</span>
                      <p className="font-body text-xs font-bold text-green-300">Unsur Identitas</p>
                    </div>
                    <div className="bg-slate-900/60 rounded p-2 text-center mb-2">
                      <InlineMath math="a + 0 = 0 + a = a" />
                    </div>
                    <p className="font-body text-xs text-white/60">Contoh: <InlineMath math="-6 + 0 = -6" /></p>
                  </div>
                  {/* Asosiatif */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-purple-500/30 text-purple-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 3</span>
                      <p className="font-body text-xs font-bold text-purple-300">Asosiatif</p>
                    </div>
                    <div className="bg-slate-900/60 rounded p-2 text-center mb-2">
                      <InlineMath math="(a+b)+c = a+(b+c)" />
                    </div>
                    <p className="font-body text-xs text-white/60">Contoh: <InlineMath math="(2+3)+4 = 2+(3+4) = 9" /></p>
                  </div>
                  {/* Tertutup */}
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-500/30 text-orange-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 4</span>
                      <p className="font-body text-xs font-bold text-orange-300">Tertutup</p>
                    </div>
                    <div className="bg-slate-900/60 rounded p-2 text-center mb-2">
                      <InlineMath math="a,b \in \mathbb{Z} \Rightarrow a+b \in \mathbb{Z}" />
                    </div>
                    <p className="font-body text-xs text-white/60">Hasil penjumlahan selalu bilangan bulat.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sub-section: Kesimpulan & Tips ── */}
          <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
            <button onClick={() => toggle("tips")}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="font-body font-semibold text-white text-sm">Kesimpulan & Tips Cepat</span>
              </div>
              {isOpen("tips") ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
            </button>
            {isOpen("tips") && (
              <div className="px-4 pb-4 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900/50 border border-green-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-bold text-green-300 mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Cara 1 — Garis Bilangan
                    </p>
                    <ol className="font-body text-xs text-white/70 space-y-1 list-decimal ml-3">
                      <li>Mulai dari 0</li>
                      <li>Gerak sesuai bilangan pertama</li>
                      <li>Lanjut sesuai bilangan kedua</li>
                      <li>Posisi akhir = hasil</li>
                    </ol>
                  </div>
                  <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-bold text-purple-300 mb-2 flex items-center gap-1">
                      <Calculator className="w-3 h-3" /> Cara 2 — Rumus Tanda
                    </p>
                    <ul className="font-body text-xs text-white/70 space-y-1">
                      <li>+ dan + → jumlahkan, hasil +</li>
                      <li>− dan − → jumlahkan, hasil −</li>
                      <li>+ dan − → selisih, ikut yang besar</li>
                      <li>− dan + → selisih, ikut yang besar</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-amber-300 mb-1 flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Ingat!
                  </p>
                  <p className="font-body text-xs text-white/70 leading-relaxed">
                    Tanda berbeda? Temukan <strong className="text-white">selisih nilai mutlak</strong>, lalu gunakan tanda dari bilangan dengan nilai mutlak <strong className="text-white">lebih besar</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </section>
  );
};

/* ──────────────────────────────────────────────────────────────
   LKPD DATA
──────────────────────────────────────────────────────────────── */

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Pada garis bilangan, gerakan ke KANAN melambangkan bilangan bertanda",
    kind: "choice",
    options: ["positif (+)", "negatif (−)", "nol", "tergantung soal"],
    correctIndex: 0,
    discussion: [
      "Pada garis bilangan, ke kanan = bertambah/positif, ke kiri = berkurang/negatif.",
      "Jadi, gerakan ke kanan melambangkan bilangan positif.",
    ],
  },
  {
    id: "g2",
    label: "Hasil dari 5 + (-3) = ...",
    kind: "fill",
    answers: ["2"],
    discussion: [
      "Mulai dari 5, lalu mundur 3 langkah karena ditambah negatif.",
      "5 - 3 = 2.",
    ],
  },
  {
    id: "g3",
    label: 'Tentukan benar atau salah: "Hasil penjumlahan dua bilangan negatif selalu negatif."',
    kind: "truefalse",
    correct: true,
    discussion: [
      "Contoh: -3 + (-4) = -7, -5 + (-2) = -7.",
      "Penjumlahan dua bilangan negatif menambah tanda negatifnya.",
      "Pernyataan benar.",
    ],
  },
  {
    id: "g4",
    label: "Jodohkan operasi penjumlahan dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "-7 + 4", right: "-3" },
      { left: "8 + (-3)", right: "5" },
      { left: "-6 + (-2)", right: "-8" },
      { left: "10 + (-10)", right: "0" },
    ],
    discussion: [
      "-7 + 4 = -3 (negatif lebih besar nilai mutlak).",
      "8 + (-3) = 5 (positif lebih besar nilai mutlak).",
      "-6 + (-2) = -8 (sama-sama negatif, jumlahkan).",
      "10 + (-10) = 0 (lawan menghilangkan).",
    ],
  },
  {
    id: "g5",
    label: "Urutkan langkah berikut untuk menghitung -8 + 12:",
    kind: "sort",
    items: [
      "Hasilnya 4",
      "Tentukan tanda hasil mengikuti yang nilai mutlaknya lebih besar (12, positif)",
      "Hitung selisih nilai mutlak: 12 - 8 = 4",
      "Bandingkan nilai mutlak |-8| = 8 dan |12| = 12",
    ],
    correctOrder: [
      "Bandingkan nilai mutlak |-8| = 8 dan |12| = 12",
      "Hitung selisih nilai mutlak: 12 - 8 = 4",
      "Tentukan tanda hasil mengikuti yang nilai mutlaknya lebih besar (12, positif)",
      "Hasilnya 4",
    ],
    discussion: [
      "Saat tanda berbeda: bandingkan nilai mutlak.",
      "Hitung selisihnya, lalu tanda mengikuti yang lebih besar.",
      "-8 + 12 = +4.",
    ],
  },
  {
    id: "g6",
    label: "Suhu udara mula-mula -3°C kemudian naik 7°C. Suhu akhir = ...°C",
    kind: "fill",
    answers: ["4"],
    discussion: [
      "-3 + 7 = 4.",
      "Jadi, suhu akhir 4°C.",
    ],
  },
  {
    id: "g7",
    label: "Sifat mana yang BENAR tentang penjumlahan bilangan bulat?",
    kind: "choice",
    options: [
      "a + b = b + a (komutatif)",
      "a + b selalu negatif",
      "a + 0 = -a",
      "a + b > a + c jika b < c",
    ],
    correctIndex: 0,
    discussion: [
      "Penjumlahan bilangan bulat bersifat komutatif: a + b = b + a.",
      "Contoh: 4 + (-7) = -7 + 4 = -3.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung: -15 + 24",
    kind: "fill",
    answers: ["9"],
    hint: "Tanda berbeda: cari selisih nilai mutlak, ikuti tanda yang lebih besar.",
    discussion: ["|24| > |-15|, jadi tandanya positif.", "24 - 15 = 9.", "Jadi, hasilnya 9."],
  },
  {
    id: "p2",
    question: "Pilih hasil yang benar untuk -28 + (-17):",
    kind: "choice",
    options: ["-45", "45", "-11", "11"],
    correctIndex: 0,
    hint: "Sama-sama negatif, jumlahkan nilai mutlaknya, hasil negatif.",
    discussion: ["-28 + (-17) = -(28 + 17) = -45."],
  },
  {
    id: "p3",
    question: 'Benar atau salah: "Hasil dari (-12) + 12 sama dengan 24".',
    kind: "truefalse",
    correct: false,
    hint: "Bilangan dengan lawannya menghasilkan nol.",
    discussion: ["-12 + 12 = 0, bukan 24.", "Jadi, pernyataan SALAH."],
  },
  {
    id: "p4",
    question: "Jodohkan operasi dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "-25 + 40", right: "15" },
      { left: "-18 + (-22)", right: "-40" },
      { left: "35 + (-50)", right: "-15" },
      { left: "0 + (-7)", right: "-7" },
    ],
    hint: "Kerjakan satu per satu: jika tanda sama, jumlahkan; jika beda, kurangi.",
    discussion: [
      "-25 + 40 = 15.",
      "-18 + (-22) = -40.",
      "35 + (-50) = -15.",
      "0 + (-7) = -7.",
    ],
  },
  {
    id: "p5",
    question: "Sebuah submarin berada di kedalaman -120 m, lalu naik 75 m, lalu turun 30 m. Berapa posisi akhirnya (dalam meter)?",
    kind: "fill",
    answers: ["-75"],
    hint: "Hitung -120 + 75 - 30.",
    discussion: ["-120 + 75 = -45.", "-45 - 30 = -75.", "Jadi, posisi akhir -75 m."],
  },
  {
    id: "p6",
    question: "Urutkan dari yang terkecil ke terbesar:",
    kind: "sort",
    items: ["3", "-12", "0", "-5", "8"],
    correctOrder: ["-12", "-5", "0", "3", "8"],
    hint: "Bilangan negatif yang nilai mutlaknya besar justru paling kecil.",
    discussion: [
      "Pada garis bilangan, semakin ke kiri semakin kecil.",
      "Urutan: -12, -5, 0, 3, 8.",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Suhu Naik Turun",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🌡️</p>
        <p className="text-lg font-bold text-white">-3°C → naik 7°C</p>
        <p className="text-sm text-white/65">Suhu akhir? Gunakan -3 + 7.</p>
      </div>
    ),
    text: "Penjumlahan bilangan bulat sering muncul pada perubahan suhu, ketinggian, dan saldo uang.",
  },
  {
    title: "Situasi: Garis Bilangan",
    visual: (
      <div className="text-center">
        <div className="font-mono text-white/70 text-sm">… -3 -2 -1 0 1 2 3 …</div>
        <p className="text-sm text-white/65 mt-2">Ke kanan = positif, ke kiri = negatif.</p>
      </div>
    ),
    text: "Pakai garis bilangan untuk membayangkan arah gerakan tiap operasi penjumlahan.",
  },
];

const games: LKPDGame[] = [
  {
    kind: "page-link",
    id: "pesawat-tembak-meteor-penjumlahan",
    title: "🚀 Pesawat Tembak Meteor — Penjumlahan",
    description:
      "Tembak meteor berisi jawaban yang TEPAT untuk soal penjumlahan bilangan bulat. Setiap jawaban benar mendapat 20 poin!",
    path: "/lkpd/kelas-7/bilangan-bulat/penjumlahan/pesawat-tembak-meteor",
    buttonLabel: "MULAI MAIN",
    emoji: "🚀",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Tanda Sama", text: "Jumlahkan nilai mutlak, tanda mengikuti tanda asli.", tone: "cyan" },
  { title: "Tanda Beda", text: "Kurangi nilai mutlak besar dengan kecil, tanda ikut yang besar.", tone: "yellow" },
  { title: "Sifat", text: "Komutatif (a+b=b+a) & asosiatif. Penjumlahan dengan 0 = bilangan itu sendiri.", tone: "emerald" },
];

/* ──────────────────────────────────────────────────────────────
   PAGE COMPONENT
──────────────────────────────────────────────────────────────── */

const PenjumlahanLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Penjumlahan Bilangan Bulat"
    intro="LKPD ini melatih Sobat Numatik menjumlahkan bilangan bulat lewat isian, pilihan ganda, jodoh, urut, dan benar/salah. Baca materi di bawah sebelum mengerjakan soal!"
    steps={[
      { icon: "Compass", title: "Baca Materi", text: "Buka bagian '📖 Baca Materi Dulu' dan pelajari konsep serta contoh soalnya." },
      { icon: "Lightbulb", title: "Temukan", text: "Selesaikan setiap soal untuk menemukan dan memahami aturan penjumlahan." },
      { icon: "Target", title: "Terapkan", text: "Gunakan rumus dan garis bilangan pada soal latihan kontekstual." },
    ]}
    headerSlot={<MateriSection />}
    situations={situations}
    guidedIntro="Selesaikan beragam jenis soal berikut untuk menemukan aturan penjumlahan bilangan bulat."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Terapkan aturan tanda dan strategi garis bilangan pada soal-soal di bawah ini."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/bilangan-bulat"
    backLabel="Kembali ke LKPD Bilangan Bulat"
  />
);

export default PenjumlahanLKPDPage;
