import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Sparkles, List } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── Garis Bilangan SVG statis (-5 sampai 5) ──────────────────────── */
const NumberLineSVG = () => {
  const nums = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const cx = (n: number) => 300 + n * 50;

  return (
    <svg viewBox="0 0 620 88" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="sub-arr-r" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 9 3.5, 0 7" fill="#FFD700" />
        </marker>
        <marker id="sub-arr-l" markerWidth="9" markerHeight="7" refX="1" refY="3.5" orient="auto-start-reverse">
          <polygon points="0 0, 9 3.5, 0 7" fill="#FFD700" />
        </marker>
      </defs>
      <line x1="14" y1="38" x2="606" y2="38"
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#sub-arr-r)" markerStart="url(#sub-arr-l)" />
      <text x="7"   y="43" fill="#FFD700" fontSize="15" fontFamily="monospace" textAnchor="middle">…</text>
      <text x="613" y="43" fill="#FFD700" fontSize="15" fontFamily="monospace" textAnchor="middle">…</text>
      {nums.map(n => {
        const x = cx(n);
        const isZero = n === 0;
        return (
          <g key={n}>
            <line
              x1={x} y1={isZero ? 26 : 30}
              x2={x} y2={isZero ? 50 : 46}
              stroke={isZero ? "#FFFFFF" : "#FFD700"}
              strokeWidth={isZero ? 2.5 : 1.8}
            />
            <text
              x={x} y={66}
              textAnchor="middle"
              fill={isZero ? "#FFFFFF" : "#FFE57F"}
              fontSize={isZero ? "14" : "12"}
              fontWeight={isZero ? "bold" : "normal"}
              fontFamily="monospace"
            >{n}</text>
          </g>
        );
      })}
      <text x="58"  y="83" fill="#FFD700" fontSize="10" fontFamily="sans-serif" opacity="0.65">← negatif</text>
      <text x="475" y="83" fill="#FFD700" fontSize="10" fontFamily="sans-serif" opacity="0.65">positif →</text>
    </svg>
  );
};

/* ── Demo Konsep: a − b = a + (−b)
   Phase A (step 1–5)  : pergi ke kanan 5 (busur hijau) dari 0 ke 5
   Phase B (step 6)    : jeda di 5
   Phase C (step 7)    : transisi
   Phase D (step 8–10) : mundur 3 ke kiri dari 5 (busur merah) → hasil = 2
   Phase E (step 11)   : tampilkan hasil, jeda
   → loop
──────────────────────────────────────────────────────────────── */
const SubtractionConceptSVG = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0  ? 700  :
      step === 6  ? 1800 :
      step === 7  ? 450  :
      step === 11 ? 2500 :
      step === 12 ? 600  :
      750;
    const t = setTimeout(() => setStep(s => (s >= 12 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const sp   = 52;
  const cx   = (n: number) => 320 + n * sp;
  const yA   = 72;
  const nums = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];

  const numGreen = step >= 1 && step <= 6 ? Math.min(step, 5) : 0;
  const numRed   = step >= 8 && step <= 11 ? Math.min(step - 7, 3) : 0;

  const showResult = step === 11 || step === 12;
  const isPhaseRight = step >= 1 && step <= 6;
  const isPhaseLeft  = step >= 8;

  const statusText =
    step === 0  ? "" :
    step <= 5   ? `Langkah +${step} · dari ${step - 1} ke ${step}` :
    step === 6  ? "Sudah di 5 · sekarang ubah: −3 → +(−3), mundur 3..." :
    step === 7  ? "Menerapkan konsep: 5 − 3 = 5 + (−3)..." :
    step <= 10  ? `Langkah −${step - 7} · dari ${5 - (step - 8)} ke ${4 - (step - 8)}` :
    step === 11 ? "5 − 3 = 5 + (−3) = 2  ✓" :
                  "";

  const statusColor =
    step === 11 ? "#67e8f9" :
    step >= 8   ? "#f87171" :
    step >= 1   ? "#4ade80" :
    "#ffffff";

  return (
    <svg viewBox="0 0 640 152" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="sc-ar" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="sc-al" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="sc-g" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#4ade80"/>
        </marker>
        <marker id="sc-r" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#f87171"/>
        </marker>
      </defs>

      <text x="14" y="15" fill="#4ade80" fontSize="10" fontFamily="sans-serif" fontWeight="bold">KANAN →</text>
      <text x="14" y="27" fill="#4ade80" fontSize="9"  fontFamily="sans-serif" opacity="0.8">(tambah positif)</text>
      <text x="626" y="15" fill="#f87171" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="end">← KIRI</text>
      <text x="626" y="27" fill="#f87171" fontSize="9"  fontFamily="sans-serif" opacity="0.8" textAnchor="end">(kurangi / tambah negatif)</text>

      {isPhaseRight && (
        <text x="320" y="22" textAnchor="middle" fill="#4ade8099" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          0 + 5 → bergerak kanan
        </text>
      )}
      {isPhaseLeft && !showResult && (
        <text x="320" y="22" textAnchor="middle" fill="#f8717199" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          5 − 3 = 5 + (−3) → mundur kiri
        </text>
      )}
      {showResult && (
        <text x="320" y="22" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          5 − 3 = 2  ✓
        </text>
      )}

      <line x1="12" y1={yA} x2="628" y2={yA}
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#sc-ar)" markerStart="url(#sc-al)"/>

      <circle cx={cx(0)} cy={yA} r="5" fill="#ffffff" opacity="0.9"/>

      {nums.map(n => {
        const x         = cx(n);
        const isZero    = n === 0;
        const isRes     = showResult && n === 2;
        const isMid     = step >= 6 && n === 5;
        const tickColor = isRes ? "#67e8f9" : isMid ? "#86efac" : isZero ? "#ffffff" : "#FFD700";
        const txtColor  = isRes ? "#67e8f9" : isMid ? "#86efac" : isZero ? "#ffffff" : "#FFE57F";
        const prominent = isZero || isRes || isMid;
        return (
          <g key={n}>
            <line
              x1={x} y1={prominent ? 60 : 65}
              x2={x} y2={prominent ? 84 : 79}
              stroke={tickColor} strokeWidth={prominent ? 2.5 : 1.8}
            />
            <text x={x} y={97} textAnchor="middle" fontFamily="monospace"
              fill={txtColor}
              fontSize={prominent ? "13" : "11"}
              fontWeight={prominent ? "bold" : "normal"}
            >{n}</text>
          </g>
        );
      })}

      {Array.from({length: numGreen}, (_, i) => {
        const x1 = cx(i), x2 = cx(i + 1), mx = (x1 + x2) / 2;
        return (
          <path key={`sg${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA - 30} ${x2},${yA}`}
            fill="none" stroke="#4ade80" strokeWidth="2.2"
            markerEnd="url(#sc-g)"
          />
        );
      })}

      {Array.from({length: numRed}, (_, i) => {
        const x1 = cx(5 - i), x2 = cx(4 - i), mx = (x1 + x2) / 2;
        return (
          <path key={`sr${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA + 30} ${x2},${yA}`}
            fill="none" stroke="#f87171" strokeWidth="2.2"
            markerEnd="url(#sc-r)"
          />
        );
      })}

      {showResult && (
        <circle cx={cx(2)} cy={yA} r="9" fill="none" stroke="#67e8f9" strokeWidth="2.5"/>
      )}

      {step >= 1 && step <= 5 && (
        <circle cx={cx(step)} cy={yA} r="5" fill="#4ade80"/>
      )}
      {step >= 8 && step <= 10 && (
        <circle cx={cx(5 - (step - 7))} cy={yA} r="5" fill="#f87171"/>
      )}

      {statusText && (
        <text x="320" y="136" textAnchor="middle" fontFamily="sans-serif"
          fontSize="11.5" fontWeight="bold" fill={statusColor}>
          {statusText}
        </text>
      )}
    </svg>
  );
};

/* ── Animasi bertahap contoh: 6 − 4 = 2 ────────────────────────────
   step 0       : jeda awal
   step 1–6     : busur hijau satu-satu (0→1, …, 5→6)
   step 7       : jeda sejenak
   step 8–11    : busur merah satu-satu (6→5, 5→4, 4→3, 3→2)
   step 12      : tampilkan hasil, lalu mulai ulang
──────────────────────────────────────────────────────────────── */
const NumberLineContoh1SVG = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0  ? 800  :
      step === 7  ? 1100 :
      step === 12 ? 2800 :
      750;
    const t = setTimeout(() => setStep(s => (s >= 12 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const sp   = 50;
  const cx   = (n: number) => 90 + n * sp;
  const yA   = 68;
  const nums = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const numGreen   = Math.min(step, 6);
  const numRed     = Math.min(step >= 8 ? step - 7 : 0, 4);
  const showResult = step >= 12;

  const statusText =
    step === 0  ? "Siap..." :
    step <= 6   ? `Langkah +${step} · dari ${step - 1} ke ${step}` :
    step === 7  ? "Sudah di 6 · sekarang mundur −4..." :
    step <= 11  ? `Langkah −${step - 7} · dari ${6 - (step - 8)} ke ${5 - (step - 8)}` :
                  "Hasil: 6 − 4 = 2  ✓";

  const statusColor =
    step >= 12 ? "#67e8f9" :
    step >= 8  ? "#f87171" :
    "#4ade80";

  return (
    <svg viewBox="0 0 640 136" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="nc1-ar" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="nc1-al" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <polygon points="0 0,8 3,0 6" fill="#FFD700"/>
        </marker>
        <marker id="nc1-g" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#4ade80"/>
        </marker>
        <marker id="nc1-r" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#f87171"/>
        </marker>
      </defs>

      <line x1="12" y1={yA} x2="628" y2={yA}
        stroke="#FFD700" strokeWidth="2.5"
        markerEnd="url(#nc1-ar)" markerStart="url(#nc1-al)"/>

      {nums.map(n => {
        const x      = cx(n);
        const isZero = n === 0;
        const isKey  = n === 2 || n === 6;
        const tickClr = n === 2 && showResult ? "#67e8f9"
                       : n === 6 && step >= 7  ? "#86efac"
                       : isZero               ? "#ffffff"
                       :                        "#FFD700";
        const txtClr  = n === 2 && showResult ? "#67e8f9"
                       : n === 6 && step >= 7  ? "#86efac"
                       : isZero               ? "#ffffff"
                       :                        "#FFE57F";
        return (
          <g key={n}>
            <line
              x1={x} y1={isZero || isKey ? 57 : 62}
              x2={x} y2={isZero || isKey ? 79 : 74}
              stroke={tickClr} strokeWidth={isZero || isKey ? 2.5 : 1.8}
            />
            <text x={x} y={93} textAnchor="middle" fontFamily="monospace"
              fill={txtClr}
              fontSize={isZero || isKey ? "13" : "11"}
              fontWeight={isZero || isKey ? "bold" : "normal"}
            >{n}</text>
          </g>
        );
      })}

      {Array.from({length: numGreen}, (_, i) => {
        const x1 = cx(i), x2 = cx(i + 1), mx = (x1 + x2) / 2;
        return (
          <path key={`cg${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA - 26} ${x2},${yA}`}
            fill="none" stroke="#4ade80" strokeWidth="2.2"
            markerEnd="url(#nc1-g)"
          />
        );
      })}

      {Array.from({length: numRed}, (_, i) => {
        const x1 = cx(6 - i), x2 = cx(5 - i), mx = (x1 + x2) / 2;
        return (
          <path key={`cr${i}`}
            d={`M ${x1},${yA} Q ${mx},${yA + 26} ${x2},${yA}`}
            fill="none" stroke="#f87171" strokeWidth="2.2"
            markerEnd="url(#nc1-r)"
          />
        );
      })}

      {showResult && (
        <circle cx={cx(2)} cy={yA} r="8"
          fill="none" stroke="#67e8f9" strokeWidth="2.5"/>
      )}

      {step >= 1 && step <= 6 && (
        <circle cx={cx(step)} cy={yA} r="4" fill="#4ade80"/>
      )}
      {step >= 8 && step <= 11 && (
        <circle cx={cx(6 - (step - 7))} cy={yA} r="4" fill="#f87171"/>
      )}

      <text x="320" y="122" textAnchor="middle" fontFamily="sans-serif"
        fontSize="11.5" fontWeight="bold" fill={statusColor}>
        {statusText}
      </text>
    </svg>
  );
};

const PenguranganBilanganBulatPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "contoh", "sifat", "kesimpulan"]);

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
          PENGURANGAN BILANGAN BULAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Bilangan Bulat - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* Section: Pengantar - Kunci Rahasia Pengurangan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Kunci Rahasia Pengurangan Bilangan Bulat</span>
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
                  Pernah bingung saat menghitung <InlineMath math="5 - (-3)" />? Tenang, kamu tidak sendirian! Pengurangan bilangan bulat memang terlihat tricky, tapi sebenarnya ada <strong className="text-primary">satu trik sederhana</strong> yang akan membuatmu jago menyelesaikan soal apapun.
                </p>

                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-2">🔑 Trik Emas Pengurangan:</p>
                  <p className="font-body text-sm text-yellow-100 leading-relaxed">
                    <strong>Mengurangi suatu bilangan sama dengan menambah dengan lawan bilangan tersebut!</strong>
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 mt-3">
                    <BlockMath math="a - b = a + (-b)" />
                  </div>
                  <p className="font-body text-xs text-yellow-200/70 mt-2">
                    Artinya, cukup ubah tanda pengurangan menjadi penjumlahan, lalu balik tanda bilangan pengurangnya!
                  </p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Ilustrasi nyata:</strong> Bayangkan kamu punya uang Rp100.000 dan harus membayar hutang Rp30.000. Ini bisa ditulis <InlineMath math="100.000 - 30.000" />. Bisa juga dipikirkan sebagai: uangmu "bertambah" dengan nilai negatif (hutang), yaitu <InlineMath math="100.000 + (-30.000) = 70.000" />.
                  </p>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <p className="font-body text-sm text-accent leading-relaxed">
                    <strong>Ingat:</strong> Di garis bilangan, <strong className="text-white">pengurangan = bergerak ke KIRI</strong> sejumlah bilangan pengurang. Ini adalah kebalikan dari penjumlahan positif.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Ringkasan Intisari: Konsep Pengurangan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("konsep")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Konsep Pengurangan</span>
              </div>
              {expandedSections.includes("konsep") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Cara paling mudah memahami pengurangan bilangan bulat adalah dengan <strong className="text-primary">garis bilangan</strong>. Di garis bilangan, pengurangan artinya bergerak ke <strong className="text-red-400">KIRI</strong>.
                </p>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">Aturan Jalan Pengurangan di Garis Bilangan:</p>
                  <ul className="font-body text-sm text-red-200 space-y-1">
                    <li><strong>a − b</strong> : dari posisi a, mundur b langkah ke <strong>kiri</strong></li>
                    <li><strong>a − (−b)</strong> : mengurangi negatif = maju b langkah ke <strong>kanan</strong></li>
                  </ul>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 border border-yellow-500/20">
                  <p className="text-yellow-300/70 text-xs text-center mb-2 font-body">Garis Bilangan</p>
                  <NumberLineSVG />
                </div>

                {/* ── Demo Animasi Konsep ── */}
                <div className="bg-slate-900/60 rounded-xl p-3 border border-cyan-500/20">
                  <p className="text-cyan-300/70 text-xs text-center mb-1 font-body">
                    Demo: Pengurangan pada Garis Bilangan · 5 − 3 = 5 + (−3) = 2
                  </p>
                  <SubtractionConceptSVG />
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Pola Pengurangan Bilangan Bulat:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3 border border-green-500/20">
                      <p className="text-white/70 text-xs mb-1">Positif dikurangi Positif:</p>
                      <BlockMath math="a - b = a + (-b)" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 border border-cyan-500/20">
                      <p className="text-white/70 text-xs mb-1">Positif dikurangi Negatif (hasilnya pasti lebih besar!):</p>
                      <BlockMath math="a - (-b) = a + b" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">Negatif dikurangi Positif:</p>
                      <BlockMath math="-a - b = -a + (-b) = -(a + b)" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">Negatif dikurangi Negatif:</p>
                      <BlockMath math="-a - (-b) = -a + b" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips Pro:</strong> Setiap kali ketemu tanda "minus-minus" <InlineMath math="- (-)" />, langsung ubah jadi "plus" <InlineMath math="+" />. Dua negatif yang bertemu akan saling menghilangkan!
                  </p>
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
                      Hitunglah hasil dari <InlineMath math="6 - 4" /> menggunakan garis bilangan!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Mulai dari titik 0, bergerak 6 satuan ke <strong className="text-green-400">kanan</strong> (karena 6 positif).</p>
                      <p><strong>Langkah 2:</strong> Dari titik 6, mundur 4 satuan ke <strong className="text-red-400">kiri</strong> (pengurangan = mundur).</p>
                      <p><strong>Langkah 3:</strong> Titik akhir berada di angka <strong className="text-cyan-300">2</strong>.</p>

                      <div className="bg-slate-900/60 rounded-xl p-3 border border-yellow-500/20 mt-2">
                        <p className="text-yellow-300/70 text-xs text-center mb-1 font-body">Visualisasi di Garis Bilangan</p>
                        <NumberLineContoh1SVG />
                        <div className="flex flex-wrap gap-3 justify-center mt-1 text-xs font-body">
                          <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-green-400"></span> +6 ke kanan</span>
                          <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-red-400"></span> −4 ke kiri</span>
                          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full border-2 border-cyan-300"></span> hasil = 2</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded p-3 mt-2">
                        <BlockMath math="6 - 4 = 6 + (-4) = 2" />
                      </div>
                      <p className="text-primary font-semibold">Jadi, <InlineMath math="6 - 4 = 2" /></p>
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
                      Hitunglah hasil pengurangan berikut:
                    </p>
                    <div className="space-y-1 ml-4">
                      <p className="text-white/80">a. <InlineMath math="-8 - 12" /></p>
                      <p className="text-white/80">b. <InlineMath math="6 - (-10)" /></p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="-8 - 12" /></p>
                        <p className="mb-1"><strong>Langkah 1:</strong> Ubah pengurangan menjadi penjumlahan dengan lawan bilangan.</p>
                        <BlockMath math="-8 - 12 = -8 + (-12)" />
                        <p className="mb-1"><strong>Langkah 2:</strong> Kedua bilangan negatif, jumlahkan nilainya dan beri tanda negatif.</p>
                        <BlockMath math="-8 + (-12) = -(8 + 12) = -20" />
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="-20" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="6 - (-10)" /></p>
                        <p className="mb-1"><strong>Langkah 1:</strong> Tanda minus-minus berubah jadi plus!</p>
                        <BlockMath math="6 - (-10) = 6 + 10" />
                        <p className="mb-1"><strong>Langkah 2:</strong> Jumlahkan kedua bilangan positif.</p>
                        <BlockMath math="6 + 10 = 16" />
                        <p className="text-primary font-semibold">Jawaban: <InlineMath math="16" /></p>
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
                      Seekor lumba-lumba melompat hingga mencapai ketinggian <InlineMath math="3" /> meter di atas permukaan air laut, kemudian menyelam hingga kedalaman <InlineMath math="7" /> meter di bawah permukaan. Berapa jarak total antara titik tertinggi lompatan dengan titik terendah penyelaman?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Tentukan titik acuan dan nilai masing-masing posisi.</p>
                      <ul className="ml-4 space-y-1 text-white/70">
                        <li>Permukaan air laut = titik nol (0)</li>
                        <li>Ketinggian lompatan = <InlineMath math="+3" /> meter (di atas nol)</li>
                        <li>Kedalaman penyelaman = <InlineMath math="-7" /> meter (di bawah nol)</li>
                      </ul>

                      <figure className="flex flex-col items-center gap-2">
                        <img
                          src="/images/lumba-lumba-pengurangan.png"
                          alt="Ilustrasi lumba-lumba melompat dan menyelam"
                          className="w-full max-w-xl rounded-lg shadow-lg border border-white/10"
                        />
                        <figcaption className="font-body text-xs text-white/60 text-center italic max-w-xl">
                          <a href="https://gemini.google.com/app/5eb5a48656083a32?hl=id" target="_blank" rel="noopener noreferrer" className="text-primary/70 hover:text-primary underline">
                            https://gemini.google.com/app/5eb5a48656083a32?hl=id
                          </a>
                        </figcaption>
                      </figure>

                      <p><strong>Langkah 2:</strong> Hitung jarak = posisi atas dikurangi posisi bawah.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Jarak} = 3 - (-7)" />
                      </div>
                      <p><strong>Langkah 3:</strong> Terapkan rumus pengurangan.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="3 - (-7) = 3 + 7 = 10" />
                      </div>
                      <p className="text-primary font-semibold">Jadi, jarak antara puncak lompatan dengan kedalaman penyelaman adalah <InlineMath math="10" /> meter.</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 4 - Bonus: Operasi Campuran */}
                <div className="border-l-4 border-purple-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">BONUS</span>
                    <span className="font-body font-semibold text-white">Contoh 4: Rantai Pengurangan</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Hitunglah hasil dari <InlineMath math="-14 - 15 - (-21)" />
                    </p>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-purple-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Ubah semua pengurangan menjadi penjumlahan dengan lawan bilangan.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-14 - 15 - (-21) = -14 + (-15) + 21" />
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung dari kiri ke kanan. Pertama, jumlahkan dua bilangan negatif:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-14 + (-15) = -(14 + 15) = -29" />
                      </div>
                      <p><strong>Langkah 3:</strong> Kemudian tambahkan dengan 21:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-29 + 21 = -(29 - 21) = -8" />
                      </div>
                      <p className="text-primary font-semibold">Jawaban: <InlineMath math="-8" /></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Section: Sifat-sifat Pengurangan Bilangan Bulat */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("sifat")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <List className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Sifat-sifat Pengurangan Bilangan Bulat</span>
              </div>
              {expandedSections.includes("sifat") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("sifat") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  Pengurangan bilangan bulat memiliki sifat-sifat penting yang berbeda dari penjumlahan. Mari kita pelajari satu per satu:
                </p>

                {/* Sifat 1: Tertutup */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-500/30 text-orange-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 1</span>
                    <p className="font-body text-sm font-bold text-orange-300">Sifat Tertutup</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Hasil pengurangan dua bilangan bulat <strong className="text-white">selalu bilangan bulat juga</strong>. Operasi ini tidak pernah menghasilkan bilangan di luar himpunan bilangan bulat.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="\forall\, a, b \in \mathbb{Z},\quad a - b \in \mathbb{Z}" />
                  </div>
                  <p className="font-body text-xs text-white/50 text-center mb-2">(Untuk setiap a dan b bilangan bulat, hasil a − b juga bilangan bulat)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">positif − positif</p>
                      <InlineMath math="12 - 17 = -5 \in \mathbb{Z}" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">negatif − positif</p>
                      <InlineMath math="-6 - 10 = -16 \in \mathbb{Z}" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">negatif − negatif</p>
                      <InlineMath math="-2 - (-9) = 7 \in \mathbb{Z}" />
                    </div>
                  </div>
                </div>

                {/* Sifat 2: Tidak Komutatif */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-500/30 text-red-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 2</span>
                    <p className="font-body text-sm font-bold text-red-300">Tidak Memiliki Sifat Komutatif</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Berbeda dengan penjumlahan, <strong className="text-white">menukar urutan bilangan yang dikurangi MENGUBAH hasilnya</strong>.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="a - b \neq b - a \quad \text{(umumnya)}" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-red-300/80 mb-1">Urutan asal:</p>
                      <InlineMath math="8 - 3 = 5" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-red-300/80 mb-1">Urutan dibalik:</p>
                      <InlineMath math="3 - 8 = -5 \neq 5" />
                    </div>
                  </div>
                  <p className="font-body text-xs text-red-200/70 mt-2 text-center">
                    Urutan sangat penting dalam pengurangan!
                  </p>
                </div>

                {/* Sifat 3: Tidak Asosiatif */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500/30 text-purple-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 3</span>
                    <p className="font-body text-sm font-bold text-purple-300">Tidak Memiliki Sifat Asosiatif</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Cara <strong className="text-white">mengelompokkan</strong> bilangan yang dikurangi mempengaruhi hasil akhirnya.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="(a - b) - c \neq a - (b - c) \quad \text{(umumnya)}" />
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-3 mt-1">
                    <p className="font-body text-xs text-white/60 mb-2 text-center">Contoh pembuktian:</p>
                    <div className="space-y-1 text-center">
                      <div><InlineMath math="(10 - 5) - 2 = 5 - 2 = 3" /></div>
                      <div className="text-white/40 text-xs">TIDAK sama dengan</div>
                      <div><InlineMath math="10 - (5 - 2) = 10 - 3 = 7" /></div>
                    </div>
                  </div>
                  <p className="font-body text-xs text-purple-200/70 mt-2 text-center">
                    Selalu kerjakan pengurangan dari kiri ke kanan!
                  </p>
                </div>

                {/* Sifat 4: Identitas Kanan */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-500/30 text-green-200 text-xs font-bold px-2 py-0.5 rounded-full">Sifat 4</span>
                    <p className="font-body text-sm font-bold text-green-300">Elemen Nol pada Pengurangan</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3">
                    Mengurangi suatu bilangan dengan nol menghasilkan bilangan itu sendiri. Namun, nol dikurangi bilangan menghasilkan lawan bilangan tersebut.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center mb-2">
                    <BlockMath math="a - 0 = a \quad \text{dan} \quad 0 - a = -a" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-green-300/80 mb-1">Dikurangi 0:</p>
                      <InlineMath math="9 - 0 = 9" />
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                      <p className="font-body text-xs text-green-300/80 mb-1">0 dikurangi:</p>
                      <InlineMath math="0 - 9 = -9" />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Section: Kesimpulan dan Tips */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesimpulan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="font-body font-semibold text-white">Kesimpulan dan Tips</span>
              </div>
              {expandedSections.includes("kesimpulan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kesimpulan") && (
              <div className="px-5 pb-5 space-y-4">

                {/* Cara 1: Garis Bilangan */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Cara 1 — Menggunakan Garis Bilangan
                  </p>
                  <p className="font-body text-sm text-white/80 mb-3 leading-relaxed">
                    Bayangkan kamu berdiri di titik awal pada garis bilangan. Arah gerakanmu menentukan hasilnya:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3 text-center">
                      <p className="text-green-300 text-2xl font-bold mb-1">→</p>
                      <p className="font-body text-sm font-semibold text-green-300">Dikurangi Negatif</p>
                      <p className="font-body text-xs text-green-200/80 mt-1"><InlineMath math="a - (-b)" /> = maju ke <strong>kanan</strong></p>
                      <p className="font-body text-xs text-white/50 mt-2 italic">Contoh: 4 − (−3) → maju 3 ke kanan</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-center">
                      <p className="text-red-300 text-2xl font-bold mb-1">←</p>
                      <p className="font-body text-sm font-semibold text-red-300">Dikurangi Positif</p>
                      <p className="font-body text-xs text-red-200/80 mt-1"><InlineMath math="a - b" /> = mundur ke <strong>kiri</strong></p>
                      <p className="font-body text-xs text-white/50 mt-2 italic">Contoh: 6 − 4 → mundur 4 ke kiri</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-3 text-center">
                    <p className="font-body text-xs text-white/60">Langkah-langkah:</p>
                    <p className="font-body text-sm text-white/90 mt-1">
                      <span className="text-white font-semibold">① Mulai dari titik pertama</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-red-300 font-semibold">② Mundur sesuai bilangan pengurang</span>
                      <span className="text-white/40 mx-2">→</span>
                      <span className="text-cyan-300 font-semibold">③ Posisi akhir = hasil</span>
                    </p>
                  </div>
                </div>

                {/* Cara 2: Rumus Ubah ke Penjumlahan */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> Cara 2 — Ubah ke Penjumlahan
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-green-500/20">
                      <p className="font-body text-xs text-green-300 font-semibold mb-1">Positif − Positif</p>
                      <p className="font-body text-xs text-white/60 mb-2">a {">"} 0, b {">"} 0</p>
                      <div className="text-center">
                        <InlineMath math="a - b = a + (-b)" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: 8 − 3 = 8 + (−3) = 5</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-500/20">
                      <p className="font-body text-xs text-cyan-300 font-semibold mb-1">Positif − Negatif</p>
                      <p className="font-body text-xs text-white/60 mb-2">a {">"} 0, b {">"} 0</p>
                      <div className="text-center">
                        <InlineMath math="a - (-b) = a + b" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: 4 − (−6) = 4 + 6 = 10</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-red-500/20">
                      <p className="font-body text-xs text-red-300 font-semibold mb-1">Negatif − Positif</p>
                      <p className="font-body text-xs text-white/60 mb-2">a {">"} 0, b {">"} 0</p>
                      <div className="text-center">
                        <InlineMath math="-a - b = -(a + b)" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: −5 − 3 = −(5+3) = −8</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-yellow-500/20">
                      <p className="font-body text-xs text-yellow-300 font-semibold mb-1">Negatif − Negatif</p>
                      <p className="font-body text-xs text-white/60 mb-2">a {">"} 0, b {">"} 0</p>
                      <div className="text-center">
                        <InlineMath math="-a - (-b) = -a + b" />
                      </div>
                      <p className="font-body text-xs text-white/50 mt-2 italic text-center">Contoh: −7 − (−2) = −7+2 = −5</p>
                    </div>
                  </div>
                </div>

                {/* Rangkuman Sifat */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-blue-300 mb-3">📋 Rangkuman Sifat Pengurangan</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-green-400 text-sm font-bold">✓</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-green-400">Tertutup:</strong> Hasil selalu bilangan bulat</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-red-400 text-sm font-bold">✗</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-red-400">Tidak Komutatif:</strong> <InlineMath math="a - b \neq b - a" /></p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-red-400 text-sm font-bold">✗</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-red-400">Tidak Asosiatif:</strong> <InlineMath math="(a-b)-c \neq a-(b-c)" /></p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2">
                      <span className="text-green-400 text-sm font-bold">✓</span>
                      <p className="font-body text-xs text-white/80"><strong className="text-green-400">Elemen Nol:</strong> <InlineMath math="a - 0 = a" /></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Tips Box */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-5">
            <p className="font-body text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Tips Mengubah Pengurangan ke Penjumlahan
            </p>
            <p className="font-body text-sm text-white/70 leading-relaxed mb-3">
              Dengan mengubah operasi pengurangan menjadi penjumlahan, perhitungan menjadi lebih mudah dan konsisten. Ingat satu aturan ini:
            </p>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="font-body text-sm text-cyan-200">
                <strong>"Ubah tanda operasi, balik tanda bilangan pengurang!"</strong>
              </p>
              <div className="mt-2">
                <InlineMath math="a - b \rightarrow a + (-b)" />
              </div>
            </div>
          </div>

          {/* Back Navigation */}
          <button
            onClick={() => {
              playPopSound();
              navigate("/materi-matematika/kelas-7/bilangan-bulat");
            }}
            className="mt-4 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-xl px-6 py-3 text-primary font-body text-sm transition-all duration-300 mx-auto"
          >
            Kembali ke Daftar Materi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenguranganBilanganBulatPage;
