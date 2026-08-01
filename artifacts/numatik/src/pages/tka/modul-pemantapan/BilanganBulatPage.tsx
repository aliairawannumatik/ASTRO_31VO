import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath, BlockMath } from "react-katex";
import { useTheme } from "@/contexts/ThemeContext";
import { BookMarked } from "lucide-react";
import "katex/dist/katex.min.css";

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const NumberLineSVG = () => (
  <svg viewBox="0 0 440 95" className="w-full my-3" style={{ maxHeight: 120 }}>
    {/* Colored background regions */}
    <rect x="32" y="47" width="173" height="26" rx="4" fill="rgba(248,113,113,0.15)" stroke="rgba(248,113,113,0.4)" strokeWidth="1" />
    <rect x="212" y="45" width="26" height="30" rx="4" fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.4)" strokeWidth="1" />
    <rect x="245" y="47" width="162" height="26" rx="4" fill="rgba(96,165,250,0.15)" stroke="rgba(96,165,250,0.4)" strokeWidth="1" />
    {/* Axis line */}
    <line x1="24" y1="60" x2="410" y2="60" stroke="#94a3b8" strokeWidth="2" />
    {/* Arrow heads */}
    <polygon points="418,60 406,54 406,66" fill="#94a3b8" />
    <polygon points="16,60 28,54 28,66" fill="#94a3b8" />
    {/* Tick marks and number labels */}
    {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((n, i) => {
      const x = 55 + i * 34;
      const clr = n < 0 ? "#f87171" : n > 0 ? "#60a5fa" : "#fbbf24";
      return (
        <g key={n}>
          <line x1={x} y1="53" x2={x} y2="67" stroke="#94a3b8" strokeWidth="1.5" />
          <text x={x} y="82" textAnchor="middle" fontSize="10" fontWeight="600" fill={clr}>{n}</text>
        </g>
      );
    })}
    {/* Region labels with dashed pointer lines */}
    <text x="118" y="31" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#f87171">Bilangan Bulat Negatif</text>
    <line x1="118" y1="32" x2="118" y2="45" stroke="#f87171" strokeWidth="0.8" strokeDasharray="2,2" />
    <text x="225" y="31" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#fbbf24">Nol</text>
    <line x1="225" y1="32" x2="225" y2="45" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="2,2" />
    <text x="326" y="31" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#60a5fa">Bilangan Bulat Positif</text>
    <line x1="326" y1="32" x2="326" y2="45" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="2,2" />
    {/* Ellipsis on both ends */}
    <text x="12" y="65" textAnchor="middle" fontSize="11" fill="#64748b">…</text>
    <text x="428" y="65" textAnchor="middle" fontSize="11" fill="#64748b">…</text>
  </svg>
);

const BilanganBulatPage = () => {
  const navigate = useNavigate();
  const { isDark, theme } = useTheme();
  const [activeTab, setActiveTab]                   = useState<"materi" | "telaah" | "soal">("materi");
  const [expandedMateri, setExpandedMateri]         = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);
  const [expandedPembahasan, setExpandedPembahasan] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers]       = useState<Record<number, number>>({});
  const [selectedComplex, setSelectedComplex]       = useState<Record<number, Set<number>>>({});
  const [selectedTF, setSelectedTF]                 = useState<Record<string, string>>({});

  const toggleMateri = (idx: number) => {
    playPopSound();
    setExpandedMateri(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasan = (n: number) => {
    setExpandedPembahasan(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const pickAnswer = (qn: number, idx: number) => {
    if (selectedAnswers[qn] !== undefined) return;
    playPopSound();
    setSelectedAnswers(prev => ({ ...prev, [qn]: idx }));
  };

  const pickComplex = (qn: number, idx: number) => {
    if ((selectedComplex[qn] ?? new Set()).has(idx)) return;
    playPopSound();
    setSelectedComplex(prev => {
      const next = new Set(prev[qn] ?? []);
      next.add(idx);
      return { ...prev, [qn]: next };
    });
  };

  const pickTF = (key: string, val: string) => {
    if (selectedTF[key] !== undefined) return;
    playPopSound();
    setSelectedTF(prev => ({ ...prev, [key]: val }));
  };

  // ── outer background ────────────────────────────────────────────────
  const outerBg = isDark
    ? "gradient-space"
    : theme === "white"
    ? "bg-white"
    : theme === "forest"
    ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
    : theme === "sunset"
    ? "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
    : "bg-gradient-to-br from-blue-50 via-white to-sky-50";

  // ── pembahasan cards ────────────────────────────────────────────────
  const PBJawaban = ({ children }: { children: React.ReactNode }) => (
    <div className={`rounded-xl px-4 py-3 flex items-center gap-3 border ${
      isDark
        ? "bg-gradient-to-r from-green-900/60 to-emerald-900/30 border-green-500/60"
        : "bg-green-50 border-green-300"
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-base border ${
        isDark ? "bg-green-500/20 border-green-400/40" : "bg-green-100 border-green-300"
      }`}>✅</div>
      <div>
        <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? "text-green-400" : "text-green-600"}`}>
          ① Jawaban
        </p>
        <p className={`font-bold text-xs leading-snug ${isDark ? "text-green-200" : "text-green-800"}`}>{children}</p>
      </div>
    </div>
  );

  const PBKonsep = ({ children }: { children: React.ReactNode }) => (
    <div className={`rounded-xl px-4 py-3 border ${
      isDark
        ? "bg-gradient-to-r from-violet-900/50 to-purple-900/25 border-violet-500/50"
        : "bg-violet-50 border-violet-300"
    }`}>
      <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${isDark ? "text-violet-300" : "text-violet-600"}`}>
        🧠 ② Konsep &amp; Trik
      </p>
      <div className={`text-xs space-y-1.5 ${isDark ? "text-white/80" : "text-violet-900"}`}>{children}</div>
    </div>
  );

  const PBSteps = ({ children }: { children: React.ReactNode }) => (
    <div className={`rounded-xl px-4 py-3 border ${
      isDark
        ? "bg-gradient-to-r from-cyan-900/40 to-sky-900/20 border-cyan-500/40"
        : "bg-cyan-50 border-cyan-300"
    }`}>
      <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>
        📐 ③ Step by Step
      </p>
      <div className={`text-xs space-y-2 ${isDark ? "text-white/80" : "text-cyan-900"}`}>{children}</div>
    </div>
  );

  const S = ({ n, children }: { n: number; children: React.ReactNode }) => (
    <div className="flex gap-2 items-start">
      <span className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
        isDark ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/30" : "bg-cyan-200 text-cyan-800 border border-cyan-300"
      }`}>{n}</span>
      <div className="flex-1">{children}</div>
    </div>
  );

  // ── telaah soal wrapper (display num separate from internal qn offset) ─
  const TelaahSoal = ({ num, tipe, children }: { num: number; tipe: "PGS" | "MCMA" | "BS"; children: React.ReactNode }) => {
    const tipeColor =
      tipe === "PGS"  ? (isDark ? "bg-sky-500/20 text-sky-300 border-sky-500/40"       : "bg-sky-100 text-sky-700 border-sky-300") :
      tipe === "MCMA" ? (isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/40"  : "bg-amber-100 text-amber-700 border-amber-300") :
                        (isDark ? "bg-rose-500/20 text-rose-300 border-rose-500/40"     : "bg-rose-100 text-rose-700 border-rose-300");
    const tipeLabel =
      tipe === "PGS"  ? "Pilihan Ganda" :
      tipe === "MCMA" ? "PG Kompleks – lebih dari 1 jawaban" :
                        "PG Kompleks – Benar / Salah";
    return (
      <div className={`rounded-xl p-5 ${
        isDark ? "bg-card/70 backdrop-blur border border-border" : "bg-white border border-gray-200 shadow-sm"
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-emerald-500/20 text-emerald-400 font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">{num}</span>
          <span className={`text-[10px] font-body font-bold rounded-full px-2.5 py-0.5 border ${tipeColor}`}>{tipe}</span>
          <span className={`text-[9px] font-body ${isDark ? "text-white/35" : "text-gray-400"}`}>{tipeLabel}</span>
        </div>
        {children}
      </div>
    );
  };

  // ── question wrapper ─────────────────────────────────────────────────
  const Soal = ({ n, tipe, children }: { n: number; tipe: "PGS" | "MCMA" | "BS"; children: React.ReactNode }) => {
    const tipeColor =
      tipe === "PGS"  ? (isDark ? "bg-sky-500/20 text-sky-300 border-sky-500/40"       : "bg-sky-100 text-sky-700 border-sky-300") :
      tipe === "MCMA" ? (isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/40"  : "bg-amber-100 text-amber-700 border-amber-300") :
                        (isDark ? "bg-rose-500/20 text-rose-300 border-rose-500/40"     : "bg-rose-100 text-rose-700 border-rose-300");
    const tipeLabel =
      tipe === "PGS"  ? "Pilihan Ganda" :
      tipe === "MCMA" ? "PG Kompleks – lebih dari 1 jawaban" :
                        "PG Kompleks – Benar / Salah";
    return (
      <div className={`rounded-xl p-5 ${
        isDark ? "bg-card/70 backdrop-blur border border-border" : "bg-white border border-gray-200 shadow-sm"
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-amber-500/20 text-amber-400 font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">{n}</span>
          <span className={`text-[10px] font-body font-bold rounded-full px-2.5 py-0.5 border ${tipeColor}`}>{tipe}</span>
          <span className={`text-[9px] font-body ${isDark ? "text-white/35" : "text-gray-400"}`}>{tipeLabel}</span>
        </div>
        {children}
      </div>
    );
  };

  // ── MCQ (PGS) ────────────────────────────────────────────────────────
  const MCQ = ({ qn, options, correct, cols = 2 }: {
    qn: number; options: React.ReactNode[]; correct: number; cols?: number;
  }) => {
    const sel = selectedAnswers[qn];
    const answered = sel !== undefined;
    return (
      <div className={cols === 1 ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"}>
        {options.map((opt, i) => {
          const isSelected = sel === i;
          const isCorrect  = i === correct;
          let cls = "border rounded-lg px-3 py-2 text-xs font-body transition-all flex items-center justify-between ";
          if (!answered)        cls += isDark ? "bg-white/5 border-white/10 text-white/80 cursor-pointer hover:bg-white/10 hover:border-amber-500/40 active:scale-95" : "bg-gray-50 border-gray-300 text-gray-700 cursor-pointer hover:bg-amber-50 hover:border-amber-400 active:scale-95";
          else if (isCorrect)   cls += isDark ? "bg-green-900/40 border-green-500/60 text-green-300 font-bold" : "bg-green-50 border-green-400 text-green-700 font-bold";
          else if (isSelected)  cls += isDark ? "bg-red-900/30 border-red-500/50 text-red-300" : "bg-red-50 border-red-400 text-red-600";
          else                  cls += isDark ? "bg-white/5 border-white/10 text-white/30" : "bg-gray-50 border-gray-200 text-gray-400";
          return (
            <div key={i} className={cls} onClick={() => pickAnswer(qn, i)}>
              <span>{opt}</span>
              {answered && isCorrect  && <span className={`ml-2 font-bold shrink-0 ${isDark ? "text-green-400" : "text-green-600"}`}>✓</span>}
              {answered && isSelected && !isCorrect && <span className={`ml-2 font-bold shrink-0 ${isDark ? "text-red-400" : "text-red-500"}`}>✗</span>}
            </div>
          );
        })}
      </div>
    );
  };

  // ── MCMA (4 pernyataan, lebih dari 1 benar) ──────────────────────────
  const MCMA = ({ qn, items }: { qn: number; items: { text: React.ReactNode; benar: boolean }[] }) => {
    const clicks = selectedComplex[qn] ?? new Set<number>();
    return (
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const isClicked = clicks.has(i);
          let cls = "border rounded-lg px-3 py-2 text-xs font-body transition-all flex items-center justify-between ";
          if (!isClicked)   cls += isDark ? "bg-white/5 border-white/10 text-white/80 cursor-pointer hover:bg-white/10 hover:border-amber-500/40 active:scale-95" : "bg-gray-50 border-gray-300 text-gray-700 cursor-pointer hover:bg-amber-50 hover:border-amber-400 active:scale-95";
          else if (item.benar) cls += isDark ? "bg-green-900/40 border-green-500/60 text-green-300 font-bold" : "bg-green-50 border-green-400 text-green-700 font-bold";
          else                 cls += isDark ? "bg-red-900/30 border-red-500/50 text-red-300" : "bg-red-50 border-red-400 text-red-600";
          return (
            <div key={i} className={cls} onClick={() => pickComplex(qn, i)}>
              <div className="flex items-center gap-2">
                <span className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  !isClicked
                    ? isDark ? "border-white/30 bg-white/5" : "border-gray-300 bg-white"
                    : item.benar
                    ? isDark ? "border-green-400 bg-green-500/30" : "border-green-400 bg-green-100"
                    : isDark ? "border-red-400 bg-red-500/30" : "border-red-400 bg-red-100"
                }`}>
                  {isClicked && (
                    <svg viewBox="0 0 10 10" className="w-2.5 h-2.5">
                      <polyline points="1.5,5 4,7.5 8.5,2.5" stroke={item.benar ? "#22c55e" : "#ef4444"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span>{item.text}</span>
              </div>
              {isClicked && item.benar  && <span className={`ml-2 font-bold shrink-0 ${isDark ? "text-green-400" : "text-green-600"}`}>✓ Benar!</span>}
              {isClicked && !item.benar && <span className={`ml-2 font-bold shrink-0 ${isDark ? "text-red-400" : "text-red-500"}`}>✗ Salah</span>}
            </div>
          );
        })}
      </div>
    );
  };

  // ── BS (3 pernyataan benar/salah) ────────────────────────────────────
  const TFTable = ({ qn, rows }: {
    qn: number;
    rows: { key: string; text: React.ReactNode; correct: "Benar" | "Salah" }[];
  }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-body border-collapse">
        <thead>
          <tr className={isDark ? "bg-white/10" : "bg-gray-100"}>
            <th className={`border px-3 py-2 text-left ${isDark ? "border-white/20 text-white" : "border-gray-300 text-gray-700"}`}>Pernyataan</th>
            <th className={`border px-3 py-2 text-center w-20 ${isDark ? "border-white/20 text-white" : "border-gray-300 text-gray-700"}`}>Benar</th>
            <th className={`border px-3 py-2 text-center w-20 ${isDark ? "border-white/20 text-white" : "border-gray-300 text-gray-700"}`}>Salah</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const k = `${qn}-${row.key}`;
            const sel = selectedTF[k];
            const answered = sel !== undefined;
            return (
              <tr key={row.key} className={answered ? (sel === row.correct ? (isDark ? "bg-green-900/20" : "bg-green-50") : (isDark ? "bg-red-900/20" : "bg-red-50")) : ""}>
                <td className={`border px-3 py-2 ${isDark ? "border-white/10 text-white/80" : "border-gray-200 text-gray-700"}`}>{row.text}</td>
                {(["Benar", "Salah"] as const).map(choice => {
                  const isChosen  = sel === choice;
                  const isCorrect = row.correct === choice;
                  let btnCls = "w-full py-1 rounded text-center transition-all cursor-pointer text-xs font-bold ";
                  if (!answered)      btnCls += isDark ? "bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-white/50" : "bg-gray-50 hover:bg-amber-50 hover:text-amber-600 text-gray-400 border border-gray-200";
                  else if (isCorrect) btnCls += isDark ? "bg-green-700/50 text-green-300" : "bg-green-100 text-green-700 border border-green-300";
                  else if (isChosen)  btnCls += isDark ? "bg-red-700/50 text-red-300" : "bg-red-100 text-red-600 border border-red-300";
                  else                btnCls += isDark ? "bg-white/5 text-white/20" : "bg-gray-50 text-gray-300";
                  return (
                    <td key={choice} className={`border px-2 py-2 text-center ${isDark ? "border-white/10" : "border-gray-200"}`}>
                      <div className={btnCls} onClick={() => pickTF(k, choice)}>
                        ○{answered && isChosen && isCorrect && " ✓"}{answered && isChosen && !isCorrect && " ✗"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // ── pembahasan toggle button ─────────────────────────────────────────
  const PembahasanBtn = ({ n }: { n: number }) => (
    <button
      onClick={() => { playPopSound(); togglePembahasan(n); }}
      className={`mt-3 w-full py-2 rounded-lg text-xs font-body font-semibold transition-all border ${
        isDark ? "border-amber-500/40 text-amber-300 hover:bg-amber-500/10" : "border-amber-400 text-amber-600 hover:bg-amber-50 bg-white"
      }`}
    >
      {expandedPembahasan.has(n) ? "▲ Tutup Pembahasan" : "▼ Lihat Pembahasan"}
    </button>
  );

  const qText = `font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/90" : "text-gray-800"}`;
  const hint  = `text-xs font-body font-semibold mb-2`;

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-x-hidden overflow-y-auto ${outerBg}`}>
      {isDark && <Starfield />}
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
            style={{ background: "radial-gradient(ellipse at 50% 0%, #6366f1 0%, transparent 70%)" }} />
          <div className="relative rounded-2xl overflow-hidden border border-indigo-500/30"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 50%, rgba(15,12,41,0.9) 100%)" }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)" }} />
            <div className="px-6 py-6 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2))", border: "1px solid rgba(167,139,250,0.35)" }}>
                  <BookMarked className="w-[18px] h-[18px] text-violet-300" />
                </div>
                <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-violet-400/70">
                  Modul Pemantapan TKA
                </span>
              </div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-white mb-1 leading-tight"
                style={{ textShadow: "0 0 40px rgba(167,139,250,0.5)" }}>
                BILANGAN BULAT
              </h1>
              <p className="font-body text-[11px] text-violet-300/50 mb-4">
                Irawan Sutiawan, M.Pd · Matematika Kelas 7 SMP/MTs · TA 2026–2027
              </p>
              <div className="flex gap-2 flex-wrap justify-center mb-3">
                <span className="text-[10px] font-body px-3 py-1 rounded-full border font-semibold"
                  style={{ background: "rgba(99,102,241,0.15)", borderColor: "rgba(99,102,241,0.35)", color: "#a5b4fc" }}>
                  📖 8 Ringkasan Materi
                </span>
                <span className="text-[10px] font-body px-3 py-1 rounded-full border font-semibold"
                  style={{ background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.35)", color: "#c4b5fd" }}>
                  ✏️ 15 Soal Latihan
                </span>
                <span className="text-[10px] font-body px-3 py-1 rounded-full border font-semibold"
                  style={{ background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.35)", color: "#fcd34d" }}>
                  ⏱️ 45 Menit
                </span>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <span className="text-[9px] font-body px-2.5 py-0.5 rounded-full border font-semibold text-sky-300"
                  style={{ background: "rgba(14,165,233,0.15)", borderColor: "rgba(14,165,233,0.35)" }}>PGS</span>
                <span className="text-[9px] font-body px-2.5 py-0.5 rounded-full border font-semibold text-amber-300"
                  style={{ background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.35)" }}>MCMA</span>
                <span className="text-[9px] font-body px-2.5 py-0.5 rounded-full border font-semibold text-rose-300"
                  style={{ background: "rgba(244,63,94,0.15)", borderColor: "rgba(244,63,94,0.35)" }}>Benar/Salah</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Petunjuk ── */}
        <div className={`border rounded-xl p-4 mb-6 ${isDark ? "bg-blue-900/15 border-blue-500/25" : "bg-blue-50 border-blue-300"}`}>
          <p className={`font-body text-xs font-bold mb-2 ${isDark ? "text-blue-300" : "text-blue-700"}`}>PETUNJUK PENGERJAAN</p>
          <ul className={`space-y-1 text-xs font-body list-disc list-inside ${isDark ? "text-white/65" : "text-gray-600"}`}>
            <li>Klik pilihan jawaban untuk menjawab. Jawaban <span className="font-semibold">tidak dapat diubah</span> setelah diklik.</li>
            <li>Soal <span className={`font-bold ${isDark ? "text-sky-300" : "text-sky-600"}`}>Pilihan Ganda (PGS)</span>: pilih <em>satu</em> jawaban yang paling tepat.</li>
            <li>Soal <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>PG Kompleks MCMA</span>: klik semua pernyataan yang benar — jawaban <em>lebih dari satu</em>.</li>
            <li>Soal <span className={`font-bold ${isDark ? "text-rose-300" : "text-rose-600"}`}>PG Kompleks Benar/Salah</span>: klik kolom <em>Benar</em> atau <em>Salah</em> untuk setiap pernyataan.</li>
          </ul>
        </div>

        {/* ── Tab Switcher ── */}
        <div className={`flex gap-2 mb-6 p-1 rounded-xl ${isDark ? "bg-white/4 border border-white/8" : "bg-gray-100 border border-gray-200"}`}>
          {([
            { key: "materi" as const, label: "📘 Ringkasan Materi" },
            { key: "telaah" as const, label: "🔍 Telaah Soal" },
            { key: "soal"   as const, label: "✏️ Latihan Soal" },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className="flex-1 font-display text-xs py-2.5 px-3 rounded-lg cursor-pointer transition-all duration-200 font-bold"
              style={activeTab === tab.key ? {
                background: "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.4))",
                color: "#e0e7ff",
                boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
                border: "1px solid rgba(167,139,250,0.4)",
              } : {
                color: isDark ? "rgba(255,255,255,0.45)" : "#6b7280",
                background: "transparent",
                border: "1px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Ringkasan Materi ── */}
        {activeTab === "materi" && (
          <div className="space-y-3">
            {([
              {
                heading: "A. Jenis-Jenis Bilangan",
                content: [
                  "Jenis-jenis bilangan, antara lain sebagai berikut.",
                  "• Bilangan asli dinyatakan dalam {1, 2, 3, 4, 5, …}",
                  "• Bilangan cacah dinyatakan dalam {0, 1, 2, 3, 4, 5, …}",
                  "• Bilangan bulat dinyatakan dalam {…, −4, −3, −2, −1, 0, 1, 2, 3, 4, …}",
                  "• Bilangan rasional: dapat dinyatakan dalam bentuk $\\dfrac{a}{b}$, dengan $a$ dan $b$ bilangan bulat serta $b \\neq 0$",
                  "• Bilangan irasional: tidak dapat dinyatakan dalam bentuk $\\dfrac{a}{b}$, dengan $a$ dan $b$ bilangan bulat serta $b \\neq 0$",
                ],
              },
              {
                heading: "B. Pengertian Bilangan Bulat",
                content: [
                  "Bilangan bulat adalah himpunan bilangan yang terdiri atas bilangan bulat positif, nol, dan bilangan bulat negatif.",
                  "Bilangan bulat dapat digambarkan pada garis bilangan.",
                  "",
                  "• Bilangan bulat positif: nilainya lebih dari 0 atau letaknya di sebelah kanan 0 pada garis bilangan.",
                  "• Bilangan bulat negatif: nilainya kurang dari 0 atau letaknya di sebelah kiri 0 pada garis bilangan.",
                  "• Bilangan nol disebut bilangan netral, yaitu bilangan yang tidak positif maupun negatif.",
                  "",
                  "Di garis bilangan: makin ke kanan → makin besar.",
                  "Contoh: −6 < −2 < 0 < 3 (urutan dari kiri ke kanan)",
                ],
                jsxContent: <NumberLineSVG />,
              },
              {
                heading: "C. Membandingkan Bilangan Bulat",
                content: [
                  "Membandingkan dua bilangan bulat berarti menentukan hubungan nilai antara kedua bilangan tersebut dengan kata 'lebih dari', 'kurang dari', atau 'sama dengan'.",
                  "",
                  "• Lambang membandingkan: lebih dari (>), kurang dari (<), sama dengan (=)",
                  "• Pada garis bilangan, nilai di sebelah kiri lebih kecil daripada nilai di sebelah kanan.",
                ],
                jsxContent: (
                  <div className="space-y-3 mt-2">
                    {/* ── INGAT! ── */}
                    <div className={`rounded-xl p-3.5 border-l-[3px] border-rose-400 ${isDark ? "bg-rose-900/20 border border-rose-500/30" : "bg-rose-50 border border-rose-200"}`}>
                      <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1 ${isDark ? "text-rose-300" : "text-rose-600"}`}>
                        ⚠️ INGAT! — Bilangan Negatif
                      </p>
                      <p className={`text-xs font-body leading-relaxed ${isDark ? "text-rose-100/80" : "text-rose-800"}`}>
                        Semakin <span className="font-bold">besar</span> angka di belakang tanda minus <span className="font-bold">(−)</span>, semakin <span className="font-bold underline">kecil</span> nilainya.
                      </p>
                      <div className={`mt-2 flex items-center gap-2 flex-wrap text-xs font-body ${isDark ? "text-white/55" : "text-gray-600"}`}>
                        <InlineMath math="-8 < -3" />
                        <span>karena 8 &gt; 3, maka −8 berada lebih jauh ke kiri dari −3 pada garis bilangan.</span>
                      </div>
                    </div>

                    {/* ── 3 Contoh ── */}
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-white/35" : "text-gray-400"}`}>3 Jenis Perbandingan</p>
                    <div className="space-y-2">
                      {/* ① Positif vs Positif */}
                      <div className={`rounded-xl p-3 border ${isDark ? "bg-sky-900/20 border-sky-500/30" : "bg-sky-50 border-sky-200"}`}>
                        <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-sky-400" : "text-sky-600"}`}>① Positif dengan Positif</p>
                        <div className={`flex items-baseline gap-2 flex-wrap text-xs font-body ${isDark ? "text-white/75" : "text-gray-700"}`}>
                          <InlineMath math="5 > 3" />
                          <span>→ 5 berada di sebelah kanan 3, sehingga 5 lebih besar dari 3.</span>
                        </div>
                      </div>
                      {/* ② Negatif vs Positif */}
                      <div className={`rounded-xl p-3 border ${isDark ? "bg-violet-900/20 border-violet-500/30" : "bg-violet-50 border-violet-200"}`}>
                        <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-violet-400" : "text-violet-600"}`}>② Negatif dengan Positif</p>
                        <div className={`flex items-baseline gap-2 flex-wrap text-xs font-body ${isDark ? "text-white/75" : "text-gray-700"}`}>
                          <InlineMath math="-4 < 2" />
                          <span>→ −4 berada di sebelah kiri 2, sehingga −4 lebih kecil dari 2.</span>
                        </div>
                      </div>
                      {/* ③ Negatif vs Negatif */}
                      <div className={`rounded-xl p-3 border ${isDark ? "bg-rose-900/20 border-rose-500/30" : "bg-rose-50 border-rose-200"}`}>
                        <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-rose-400" : "text-rose-600"}`}>③ Negatif dengan Negatif</p>
                        <div className={`flex items-baseline gap-2 flex-wrap text-xs font-body ${isDark ? "text-white/75" : "text-gray-700"}`}>
                          <InlineMath math="-7 < -2" />
                          <span>→ meski 7 &gt; 2, tanda negatif membalik urutan: −7 lebih jauh ke kiri dari −2.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                heading: "D. Sifat-Sifat Operasi Hitung Bilangan Bulat",
                content: [
                  "Operasi hitung bilangan bulat meliputi penjumlahan, pengurangan, perkalian, dan pembagian.",
                  "Misalkan $a$, $b$, dan $c$ adalah bilangan bulat. Sifat-sifatnya:",
                ],
                jsxContent: (
                  <div className="space-y-2 mt-2">

                    {/* ── a. Tertutup ── */}
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(99,102,241,0.4)", background: "rgba(99,102,241,0.08)" }}>
                      <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "rgba(99,102,241,0.25)", background: "rgba(99,102,241,0.18)" }}>
                        <span className="text-[10px] font-bold font-display tracking-wide" style={{ color: "#a5b4fc" }}>a. Sifat Tertutup</span>
                      </div>
                      <div className="px-4 py-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
                        <InlineMath math="a + b \in \mathbb{Z}" />
                        <InlineMath math="a - b \in \mathbb{Z}" />
                        <InlineMath math="a \times b \in \mathbb{Z}" />
                      </div>
                      <p className={`text-center text-[10px] font-body pb-2.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>Hasil selalu bilangan bulat</p>
                    </div>

                    {/* ── b. Komutatif ── */}
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.08)" }}>
                      <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.18)" }}>
                        <span className="text-[10px] font-bold font-display tracking-wide" style={{ color: "#c4b5fd" }}>b. Sifat Komutatif</span>
                      </div>
                      <div className="px-4 py-3 flex flex-wrap justify-center gap-x-6 gap-y-1">
                        <InlineMath math="a + b = b + a" />
                        <InlineMath math="a \times b = b \times a" />
                      </div>
                    </div>

                    {/* ── c. Identitas ── */}
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(20,184,166,0.4)", background: "rgba(20,184,166,0.08)" }}>
                      <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "rgba(20,184,166,0.25)", background: "rgba(20,184,166,0.18)" }}>
                        <span className="text-[10px] font-bold font-display tracking-wide" style={{ color: "#5eead4" }}>c. Unsur Identitas</span>
                      </div>
                      <div className="px-4 py-3 flex flex-wrap justify-center gap-x-6 gap-y-1">
                        <InlineMath math="a + 0 = 0 + a = a" />
                        <InlineMath math="a \times 1 = 1 \times a = a" />
                      </div>
                      <p className={`text-center text-[10px] font-body pb-2.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>0 = identitas penjumlahan · 1 = identitas perkalian</p>
                    </div>

                    {/* ── d. Asosiatif ── */}
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.08)" }}>
                      <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.18)" }}>
                        <span className="text-[10px] font-bold font-display tracking-wide" style={{ color: "#fcd34d" }}>d. Sifat Asosiatif</span>
                      </div>
                      <div className="px-4 py-3 flex flex-col items-center gap-2">
                        <InlineMath math="(a + b) + c = a + (b + c)" />
                        <InlineMath math="(a \times b) \times c = a \times (b \times c)" />
                      </div>
                    </div>

                    {/* ── e. Distributif ── */}
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(236,72,153,0.4)", background: "rgba(236,72,153,0.08)" }}>
                      <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "rgba(236,72,153,0.25)", background: "rgba(236,72,153,0.18)" }}>
                        <span className="text-[10px] font-bold font-display tracking-wide" style={{ color: "#f9a8d4" }}>e. Sifat Distributif</span>
                      </div>
                      <div className="px-4 py-3 flex flex-col items-center gap-2">
                        <InlineMath math="a \times (b + c) = (a \times b) + (a \times c)" />
                        <InlineMath math="a \times (b - c) = (a \times b) - (a \times c)" />
                      </div>
                      <p className={`text-center text-[10px] font-body pb-2.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>Perkalian terhadap penjumlahan &amp; pengurangan</p>
                    </div>

                  </div>
                ),
              },
              {
                heading: "E. Operasi Hitung Campuran Bilangan Bulat",
                content: [
                  "Aturan urutan pengerjaan operasi hitung campuran bilangan bulat:",
                  "",
                  "a. Dahulukan operasi hitung yang terdapat di dalam tanda kurung.",
                  "b. Jika terdapat perkalian/pembagian dan penjumlahan/pengurangan, kerjakan perkalian atau pembagian terlebih dahulu.",
                  "c. Jika hanya terdapat penjumlahan dan pengurangan, kerjakan berurutan dari kiri ke kanan.",
                  "d. Jika hanya terdapat perkalian dan pembagian, kerjakan berurutan dari kiri ke kanan.",
                  "",
                  "💡 Ingat urutan Ka–Pa–Ka–Ta:",
                  "   Kurung → Pangkat/Akar → Kali/Bagi (kiri ke kanan) → Tambah/Kurang (kiri ke kanan)",
                ],
              },
              {
                heading: "F. Menyelesaikan Masalah Bilangan Bulat",
                content: [
                  "Langkah-langkah menyelesaikan permasalahan yang berkaitan dengan bilangan bulat:",
                  "",
                  "a. Pahami isi soal dan identifikasi informasi yang diketahui.",
                  "b. Buatlah kalimat matematika yang sesuai dengan permasalahan.",
                  "c. Selesaikan kalimat matematika yang diperoleh.",
                  "d. Jawablah soal sesuai pertanyaan yang diminta.",
                ],
              },
              {
                heading: "G. Faktorisasi Prima",
                content: [
                  "Faktorisasi prima adalah proses memecah sebuah bilangan menjadi perkalian dari faktor-faktor bilangan prima.",
                  "Cara: bagi bilangan secara berulang menggunakan bilangan prima (2, 3, 5, 7, …) hingga hasilnya 1.",
                  "",
                  "Contoh: Tentukan faktorisasi prima dari 18.",
                  "18 ÷ 2 = 9",
                  " 9 ÷ 3 = 3",
                  " 3 ÷ 3 = 1",
                  "Faktor prima dari 18: angka 2 sebanyak 1 faktor, angka 3 sebanyak 2 faktor.",
                  "Jadi, faktorisasi prima 18 = 2 × 3².",
                ],
              },
              {
                heading: "H. Estimasi/Perkiraan Hasil Perhitungan",
                content: [
                  "Estimasi adalah memperkirakan hasil operasi hitung bilangan bulat secara cepat dan masuk akal, tanpa menghitung secara tepat.",
                  "",
                  "Cara memperkirakan hasil operasi hitung bilangan bulat:",
                  "1. Bulatkan bilangan ke puluhan, ratusan, ribuan, atau nilai terdekat.",
                  "2. Lakukan operasi (penjumlahan, pengurangan, atau perkalian) pada bilangan hasil pembulatan.",
                  "",
                  "Estimasi dianggap baik jika hasil perkiraan mendekati hasil yang sebenarnya.",
                  "",
                  "Contoh:",
                  "Harga sebuah baju Rp83.600. Lebih dekat dibulatkan menjadi Rp84.000 daripada Rp80.000.",
                  "Pembulatan ini dilakukan untuk mempermudah perhitungan.",
                ],
              },
            ] as { heading: string; content: string[]; jsxContent?: React.ReactNode }[]).map((sec, idx) => {
              const isOpen = expandedMateri.includes(idx);
              const colors = [
                { border: "border-indigo-400/50",  badge: "bg-indigo-500/30 text-indigo-200 border-indigo-400/40"  },
                { border: "border-violet-400/50",  badge: "bg-violet-500/30 text-violet-200 border-violet-400/40"  },
                { border: "border-purple-400/50",  badge: "bg-purple-500/30 text-purple-200 border-purple-400/40"  },
                { border: "border-fuchsia-400/50", badge: "bg-fuchsia-500/30 text-fuchsia-200 border-fuchsia-400/40" },
                { border: "border-sky-400/50",     badge: "bg-sky-500/30 text-sky-200 border-sky-400/40"           },
              ];
              const c = colors[idx % colors.length];
              return (
                <div key={idx} className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${c.border} ${
                  isDark
                    ? isOpen ? "bg-gradient-to-br from-indigo-950/60 to-slate-900/95" : "bg-white/3"
                    : isOpen ? "bg-indigo-50 shadow-sm" : "bg-white border-gray-200"
                }`}>
                  {isOpen && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-indigo-500 to-violet-600" />}
                  <button onClick={() => toggleMateri(idx)} className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer text-left group pl-6">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${c.badge}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={`font-display text-sm font-bold flex-1 leading-snug transition-colors ${isDark ? "text-white/90 group-hover:text-white" : "text-gray-800 group-hover:text-indigo-700"}`}>
                      {sec.heading}
                    </span>
                    <span className={`shrink-0 transition-colors ${isDark ? "text-white/30 group-hover:text-white/60" : "text-gray-400 group-hover:text-gray-600"}`}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className={`px-6 pb-5 pt-1 border-t space-y-1 font-body text-sm leading-relaxed ${isDark ? "border-white/5 text-white/80" : "border-indigo-100 text-gray-700"}`}>
                      {sec.content.map((line, li) =>
                        line === "" ? <div key={li} className="h-1" /> : <div key={li}>{renderWithLatex(line)}</div>
                      )}
                      {sec.jsxContent && <div className="mt-2">{sec.jsxContent}</div>}
                    </div>
                  )}
                </div>
              );
            })}
            <div className={`mt-2 px-4 py-3 rounded-xl flex items-center gap-2.5 ${isDark ? "bg-indigo-500/6 border border-indigo-500/20" : "bg-indigo-50 border border-indigo-200"}`}>
              <span className="text-amber-400">💡</span>
              <p className={`font-body text-xs leading-relaxed ${isDark ? "text-white/50" : "text-gray-500"}`}>
                Pelajari semua materi di atas, lalu uji pemahamanmu di tab{" "}
                <button onClick={() => { playPopSound(); setActiveTab("soal"); }} className={`font-semibold underline cursor-pointer ${isDark ? "text-violet-300" : "text-indigo-600"}`}>
                  Latihan Soal
                </button>.
              </p>
            </div>
          </div>
        )}

        {/* ── Telaah Soal ── */}
        {activeTab === "telaah" && (
          <div className="flex flex-col gap-5">
            {/* header telaah */}
            <div className={`border rounded-xl p-4 ${isDark ? "bg-emerald-900/15 border-emerald-500/25" : "bg-emerald-50 border-emerald-300"}`}>
              <p className={`font-body text-xs font-bold mb-1 ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>🔍 TELAAH SOAL — BILANGAN BULAT</p>
              <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-600"}`}>
                Soal-soal berikut disertai pembahasan lengkap untuk membantumu memahami pola soal TKA. Klik jawaban lalu buka pembahasan.
              </p>
            </div>

            {/* ══ TELAAH 1 — PGS ══ */}
            <TelaahSoal num={1} tipe="PGS">
              <p className={qText}>
                Perhatikan garis bilangan berikut. Garis bilangan dimulai dari 0, dilanjutkan ke kanan sejauh 9 satuan, kemudian ke kiri sejauh 13 satuan.
                Operasi bilangan bulat yang digambarkan pada garis bilangan tersebut adalah ....
              </p>
              <MCQ qn={51} correct={2} options={[
                <span key="a">A. <InlineMath math="-9 - 4 = -4" /></span>,
                <span key="b">B. <InlineMath math="-4 - 2 = -4" /></span>,
                <span key="c">C. <InlineMath math="9 - 13 = -4" /></span>,
                <span key="d">D. <InlineMath math="9 - 4 = 5" /></span>,
              ]} />
              <PembahasanBtn n={51} />
              {expandedPembahasan.has(51) && (
                <div className="mt-3 space-y-2">
                  <PBJawaban>C. 9 − 13 = −4</PBJawaban>
                  <PBKonsep>
                    <p>Garis bilangan dimulai dari 0, lalu ke kanan 9 satuan (posisi 9), kemudian ke kiri 13 satuan.</p>
                    <p>Gerakan ke kanan = penjumlahan (+), gerakan ke kiri = pengurangan (−).</p>
                    <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: perhatikan arah panah dari titik awal sampai titik akhir, bukan hanya titik akhirnya.</p>
                  </PBKonsep>
                  <PBSteps>
                    <S n={1}><p>Mulai dari 0, ke kanan 9 satuan → posisi 9.</p></S>
                    <S n={2}><p>Dari posisi 9, ke kiri 13 satuan → posisi <InlineMath math="9 - 13 = -4" />.</p></S>
                    <S n={3}><p>Titik akhir di −4 pada garis bilangan. Operasi yang digambarkan: <InlineMath math="9 - 13 = -4" /> ✓</p></S>
                  </PBSteps>
                </div>
              )}
            </TelaahSoal>

            {/* ══ TELAAH 2 — MCMA ══ */}
            <TelaahSoal num={2} tipe="MCMA">
              <p className={qText}>
                Diketahui bilangan <InlineMath math="a = -4" />, <InlineMath math="b = 7" />, dan <InlineMath math="c = -9" />.
                Berdasarkan informasi tersebut, pilihlah semua jawaban yang benar. Jawaban benar lebih dari satu.
              </p>
              <p className={`${hint} ${isDark ? "text-amber-300" : "text-amber-600"}`}>Jawaban benar lebih dari satu.</p>
              <MCMA qn={52} items={[
                { text: <span>Hasil dari <InlineMath math="a - b" /> sama dengan <InlineMath math="b - a" /> sehingga berlaku sifat komutatif.</span>, benar: false },
                { text: <span>Hasil <InlineMath math="(a+b)+c" /> sama dengan <InlineMath math="a+(b+c)" /> sehingga berlaku sifat asosiatif.</span>, benar: true },
                { text: <span>Hasil <InlineMath math="a + b - c" /> berupa bilangan bulat sehingga berlaku sifat tertutup.</span>, benar: true },
                { text: <span>Hasil <InlineMath math="a \times (b-c)" /> sama dengan <InlineMath math="(a-b) \times (a-c)" /> sehingga berlaku sifat distributif.</span>, benar: false },
              ]} />
              <PembahasanBtn n={52} />
              {expandedPembahasan.has(52) && (
                <div className="mt-3 space-y-2">
                  <PBJawaban>Pernyataan (2) dan (3) benar</PBJawaban>
                  <PBKonsep>
                    <p>Sifat komutatif berlaku untuk penjumlahan dan perkalian, tetapi <span className="font-bold">tidak</span> untuk pengurangan.</p>
                    <p>Sifat distributif: <InlineMath math="a \times (b-c) = (a\times b)-(a\times c)" />, bukan <InlineMath math="(a-b)\times(a-c)" />.</p>
                  </PBKonsep>
                  <PBSteps>
                    <S n={1}><p>(1) <InlineMath math="a-b=-4-7=-11" />, <InlineMath math="b-a=7-(-4)=11" /> → tidak sama → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                    <S n={2}><p>(2) <InlineMath math="(a+b)+c=(-4+7)+(-9)=3-9=-6" />, <InlineMath math="a+(b+c)=-4+(7-9)=-4+(-2)=-6" /> → sama → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                    <S n={3}><p>(3) <InlineMath math="a+b-c=-4+7-(-9)=-4+7+9=12" /> → bilangan bulat → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                    <S n={4}><p>(4) <InlineMath math="a\times(b-c)=-4\times16=-64" />, <InlineMath math="(a-b)\times(a-c)=-11\times5=-55" /> → tidak sama → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                  </PBSteps>
                </div>
              )}
            </TelaahSoal>

            {/* ══ TELAAH 3 — MCMA ══ */}
            <TelaahSoal num={3} tipe="MCMA">
              <p className={qText}>
                Dalam suatu kompetisi futsal, skor yang diperoleh tim adalah: menang = 3 poin, seri = 1 poin, dan kalah = 0 poin.
                Tabel berikut menunjukkan hasil pertandingan dari empat tim dalam kompetisi tersebut.
              </p>
              <div className="overflow-x-auto mb-3">
                <table className={`w-full text-xs font-body border-collapse rounded-lg overflow-hidden`}>
                  <thead>
                    <tr className={isDark ? "bg-white/10" : "bg-gray-100"}>
                      {["Nama Tim","Main","Menang","Kalah","Seri","Selisih Gol"].map(h => (
                        <th key={h} className={`border px-2 py-2 text-center ${isDark ? "border-white/20 text-white" : "border-gray-300 text-gray-700"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Elang Merah","3","2","0","1","3"],
                      ["Singa Biru","3","1","0","2","2"],
                      ["Merpati Hijau","3","0","1","2","−1"],
                      ["Kancil Emas","3","0","2","1","−4"],
                    ].map((row,i) => (
                      <tr key={i} className={i%2===0 ? (isDark?"bg-white/3":"bg-gray-50") : ""}>
                        {row.map((cell,j) => (
                          <td key={j} className={`border px-2 py-2 text-center ${isDark ? "border-white/10 text-white/80" : "border-gray-200 text-gray-700"} ${j===0?"text-left font-semibold":""}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={`font-body text-xs mb-3 ${isDark ? "text-white/60" : "text-gray-500"}`}>
                Dua tim dengan skor poin tertinggi akan bertanding untuk memperebutkan juara 1. Pilihlah semua jawaban yang benar.
              </p>
              <p className={`${hint} ${isDark ? "text-amber-300" : "text-amber-600"}`}>Jawaban benar lebih dari satu.</p>
              <MCMA qn={53} items={[
                { text: "Jumlah skor yang diperoleh tim Elang Merah adalah 7.", benar: true },
                { text: "Jumlah skor yang diperoleh tim Singa Biru adalah 6.", benar: false },
                { text: "Jumlah skor tim Merpati Hijau dan Kancil Emas adalah sama, yaitu 1.", benar: false },
                { text: "Tim Elang Merah dan tim Singa Biru akan bertanding memperebutkan juara 1.", benar: true },
              ]} />
              <PembahasanBtn n={53} />
              {expandedPembahasan.has(53) && (
                <div className="mt-3 space-y-2">
                  <PBJawaban>Pernyataan (1) dan (4) benar</PBJawaban>
                  <PBKonsep>
                    <p>Skor total = (Menang × 3) + (Kalah × 0) + (Seri × 1)</p>
                    <p>Dua tim dengan total skor tertinggi maju ke final memperebutkan juara 1.</p>
                  </PBKonsep>
                  <PBSteps>
                    <S n={1}><p>Elang Merah: <InlineMath math="(2\times3)+(0\times0)+(1\times1)=6+0+1=7" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                    <S n={2}><p>Singa Biru: <InlineMath math="(1\times3)+(0\times0)+(2\times1)=3+0+2=5" /> → bukan 6 → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                    <S n={3}><p>Merpati Hijau: <InlineMath math="(0\times3)+(1\times0)+(2\times1)=2" />, Kancil Emas: <InlineMath math="(0\times3)+(2\times0)+(1\times1)=1" /> → tidak sama → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                    <S n={4}><p>Skor tertinggi: Elang Merah (7) dan Singa Biru (5) → maju ke final → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  </PBSteps>
                </div>
              )}
            </TelaahSoal>

            {/* ══ TELAAH 4 — PGS ══ */}
            <TelaahSoal num={4} tipe="PGS">
              <p className={qText}>
                Diketahui <InlineMath math="-2 \times (5 + a) - 18 : 3 = 4" />. Nilai <InlineMath math="a" /> adalah ....
              </p>
              <MCQ qn={54} correct={0} options={[
                "A. −10", "B. −7", "C. −3", "D. 2"
              ]} />
              <PembahasanBtn n={54} />
              {expandedPembahasan.has(54) && (
                <div className="mt-3 space-y-2">
                  <PBJawaban>A. −10</PBJawaban>
                  <PBKonsep>
                    <p>Selesaikan urutan operasi: dahulukan tanda kurung, lalu bagi, kemudian kerjakan persamaan.</p>
                    <p>Isolasi variabel <InlineMath math="a" /> langkah demi langkah.</p>
                    <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: hitung dulu bagian yang tidak mengandung variabel, baru isolasi variabel-nya.</p>
                  </PBKonsep>
                  <PBSteps>
                    <S n={1}><p>Hitung bagian pembagian terlebih dahulu: <InlineMath math="18 : 3 = 6" /></p></S>
                    <S n={2}><p>Persamaan menjadi: <InlineMath math="-2 \times (5+a) - 6 = 4" /></p></S>
                    <S n={3}><p>Pindahkan: <InlineMath math="-2 \times (5+a) = 4 + 6 = 10" /></p></S>
                    <S n={4}><p>Bagi kedua ruas: <InlineMath math="5 + a = 10 \div (-2) = -5" /></p></S>
                    <S n={5}><div><BlockMath math="a = -5 - 5 = -10" /></div></S>
                  </PBSteps>
                </div>
              )}
            </TelaahSoal>

            {/* ══ TELAAH 5 — BS ══ */}
            <TelaahSoal num={5} tipe="BS">
              <p className={qText}>
                Sebuah termometer menunjukkan suhu ruangan sebesar <span className={`font-bold ${isDark?"text-amber-300":"text-amber-600"}`}>31°C</span> pada pukul 15.00.
                Perubahan waktu akan memengaruhi besar suhu ruangan.
                Berdasarkan informasi tersebut, tentukan <span className={`font-bold ${isDark?"text-green-300":"text-green-600"}`}>Benar</span> atau{" "}
                <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>Salah</span> untuk setiap pernyataan berikut.
              </p>
              <TFTable qn={55} rows={[
                { key:"a", text: <span>Suhu ruangan pada pukul 19.00 turun <InlineMath math="2°C" /> menjadi <InlineMath math="29°C" />.</span>, correct: "Benar" },
                { key:"b", text: <span>Setelah 6 jam, suhu ruangan berkurang <InlineMath math="3°C" /> sehingga besar suhu ruangan pada pukul 22.00 adalah <InlineMath math="28°C" />.</span>, correct: "Salah" },
                { key:"c", text: <span>Suhu ruangan turun <InlineMath math="1°C" /> setiap 2 jam sampai dengan pukul 01.00 sehingga besar suhu pada pukul 01.00 adalah <InlineMath math="26°C" />.</span>, correct: "Benar" },
              ]} />
              <PembahasanBtn n={55} />
              {expandedPembahasan.has(55) && (
                <div className="mt-3 space-y-2">
                  <PBJawaban>(a) Benar &nbsp;|&nbsp; (b) Salah &nbsp;|&nbsp; (c) Benar</PBJawaban>
                  <PBKonsep>
                    <p>Suhu turun = pengurangan (−). Hitung selang waktu dari pukul awal.</p>
                    <p>Pernyataan (b): 6 jam setelah pukul 15.00 adalah pukul 21.00, bukan 22.00.</p>
                    <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: perhatikan selisih waktu (jam) dengan teliti sebelum menghitung suhu.</p>
                  </PBKonsep>
                  <PBSteps>
                    <S n={1}><p>(a) <InlineMath math="31°C - 2°C = 29°C" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                    <S n={2}><p>(b) 6 jam setelah 15.00 = <span className="font-bold">21.00</span>, bukan 22.00 → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                    <S n={3}><p>(c) Dari 15.00 s.d. 01.00 = 10 jam → <InlineMath math="10 \div 2 = 5" /> kali turun → <InlineMath math="31 - (5 \times 1) = 26°C" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  </PBSteps>
                </div>
              )}
            </TelaahSoal>

            {/* ══ TELAAH 6 — PGS ══ */}
            <TelaahSoal num={6} tipe="PGS">
              <p className={qText}>
                Faktorisasi prima dari 1.350 adalah ....
              </p>
              <MCQ qn={56} correct={1} options={[
                <span key="a">A. <InlineMath math="2 \times 3^2 \times 5^2" /></span>,
                <span key="b">B. <InlineMath math="2 \times 3^3 \times 5^2" /></span>,
                <span key="c">C. <InlineMath math="3^3 \times 5^2" /></span>,
                <span key="d">D. <InlineMath math="2^2 \times 3 \times 5^2" /></span>,
              ]} />
              <PembahasanBtn n={56} />
              {expandedPembahasan.has(56) && (
                <div className="mt-3 space-y-2">
                  <PBJawaban><span>B. <InlineMath math="2 \times 3^3 \times 5^2" /></span></PBJawaban>
                  <PBKonsep>
                    <p>Bagi bilangan secara berulang dimulai dari bilangan prima terkecil (2, 3, 5, …).</p>
                    <p>Lanjutkan hingga hasil baginya adalah 1.</p>
                  </PBKonsep>
                  <PBSteps>
                    <S n={1}><p><InlineMath math="1.350 \div 2 = 675" /></p></S>
                    <S n={2}><p><InlineMath math="675 \div 3 = 225" /></p></S>
                    <S n={3}><p><InlineMath math="225 \div 3 = 75" /></p></S>
                    <S n={4}><p><InlineMath math="75 \div 3 = 25" /></p></S>
                    <S n={5}><p><InlineMath math="25 \div 5 = 5" />, <InlineMath math="5 \div 5 = 1" /></p></S>
                    <S n={6}><div><BlockMath math="1.350 = 2 \times 3^3 \times 5^2" /></div></S>
                  </PBSteps>
                </div>
              )}
            </TelaahSoal>

            {/* ══ TELAAH 7 — PGS ══ */}
            <TelaahSoal num={7} tipe="PGS">
              <p className={qText}>
                Pak Budi akan membeli 3 lusin botol minuman untuk hadiah kepada para peserta. Ia menghubungi toko untuk menanyakan harganya.
                Harga sebuah botol minuman adalah Rp4.900. Tanpa menggunakan kalkulator, Pak Budi ingin menyiapkan uang agar tidak kurang.
                Perkiraan besar uang yang harus disiapkan Pak Budi adalah ....
              </p>
              <MCQ qn={57} correct={2} options={[
                "A. Rp150.000", "B. Rp175.000", "C. Rp200.000", "D. Rp225.000"
              ]} />
              <PembahasanBtn n={57} />
              {expandedPembahasan.has(57) && (
                <div className="mt-3 space-y-2">
                  <PBJawaban>C. Rp200.000</PBJawaban>
                  <PBKonsep>
                    <p>Untuk mempercepat estimasi tanpa kalkulator, bulatkan jumlah barang dan harga ke nilai terdekat yang mudah dihitung.</p>
                    <p>Bulatkan ke atas agar uang yang disiapkan tidak kurang.</p>
                    <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: 1 lusin = 12 buah. Bulatkan jumlah, lalu bulatkan harga, baru kalikan.</p>
                  </PBKonsep>
                  <PBSteps>
                    <S n={1}><p>Banyak botol yang dibeli: <InlineMath math="3 \times 12 = 36" /> buah.</p></S>
                    <S n={2}><p>Bulatkan ke atas: <InlineMath math="36 \approx 40" /> buah.</p></S>
                    <S n={3}><p>Harga per botol: Rp4.900 → dibulatkan ke Rp5.000.</p></S>
                    <S n={4}><div><BlockMath math="40 \times Rp5.000 = Rp200.000" /></div></S>
                    <S n={5}><p>Uang yang perlu disiapkan Pak Budi sekitar <span className="font-bold">Rp200.000</span>.</p></S>
                  </PBSteps>
                </div>
              )}
            </TelaahSoal>

          </div>
        )}

        {/* ── Soal-Soal ── */}
        {activeTab === "soal" && <div className="flex flex-col gap-5">

          {/* ══ SOAL 1 — PGS ══ */}
          <Soal n={1} tipe="PGS">
            <p className={qText}>
              Hasil dari <InlineMath math="-18 + 42 \div (-6) \times 3" /> adalah ....
            </p>
            <MCQ qn={1} correct={0} options={[
              "A. −39", "B. −33", "C. 3", "D. 33"
            ]} />
            <PembahasanBtn n={1} />
            {expandedPembahasan.has(1) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>A. −39</PBJawaban>
                <PBKonsep>
                  <p>Urutan operasi hitung campuran: <span className="font-bold">Ka–Pa–Ka–Ta</span></p>
                  <p>① Kurung → ② Pangkat/Akar → ③ Kali/Bagi (kiri ke kanan) → ④ Tambah/Kurang (kiri ke kanan)</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Bagi dan kali punya prioritas sama, kerjakan dari kiri.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Kerjakan bagi dan kali dari kiri ke kanan: <InlineMath math="42 \div (-6) = -7" /></p></S>
                  <S n={2}><p>Lanjutkan kali: <InlineMath math="-7 \times 3 = -21" /></p></S>
                  <S n={3}><p>Kerjakan tambah/kurang: <InlineMath math="-18 + (-21) = -18 - 21 = -39" /></p></S>
                  <S n={4}><div><BlockMath math="-18 + 42 \div (-6) \times 3 = -18 + (-21) = -39" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 2 — MCMA ══ */}
          <Soal n={2} tipe="MCMA">
            <p className={qText}>
              Manakah pernyataan-pernyataan berikut yang <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>BENAR</span>?
              Klik semua yang benar!
            </p>
            <p className={`${hint} ${isDark ? "text-amber-300" : "text-amber-600"}`}>Jawaban benar lebih dari satu.</p>
            <MCMA qn={2} items={[
              { text: <span>(1) <InlineMath math="(-3) \times (-5) = 15" /></span>,                  benar: true  },
              { text: <span>(2) <InlineMath math="7 + (-7) = 14" /></span>,                          benar: false },
              { text: <span>(3) <InlineMath math="(-12) \div 4 = -3" /></span>,                      benar: true  },
              { text: <span>(4) <InlineMath math="(-2)^3 = -8" /></span>,                            benar: true  },
            ]} />
            <PembahasanBtn n={2} />
            {expandedPembahasan.has(2) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Pernyataan (1), (3), dan (4) — semua tiga benar</PBJawaban>
                <PBKonsep>
                  <p>Aturan tanda perkalian &amp; pembagian:</p>
                  <p>• (+) × (−) = (−) &nbsp;|&nbsp; (−) × (−) = (+)</p>
                  <p>• Penjumlahan dengan invers: <InlineMath math="a + (-a) = 0" /></p>
                  <p>• Pangkat ganjil negatif: <InlineMath math="(-a)^{\text{ganjil}} = -(a^{\text{ganjil}})" /></p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: periksa tanda hasilnya dulu sebelum nilai absolutnya.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>(1) <InlineMath math="(-3)\times(-5) = +15" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={2}><p>(2) <InlineMath math="7+(-7)=7-7=0\neq 14" /> → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                  <S n={3}><p>(3) <InlineMath math="(-12)\div 4 = -3" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={4}><p>(4) <InlineMath math="(-2)^3=(-2)\times(-2)\times(-2)=-8" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 3 — BS ══ */}
          <Soal n={3} tipe="BS">
            <p className={qText}>
              Tentukan <span className={`font-bold ${isDark?"text-green-300":"text-green-600"}`}>Benar</span> atau{" "}
              <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>Salah</span> setiap pernyataan berikut!
            </p>
            <TFTable qn={3} rows={[
              { key:"a", text: <span><InlineMath math="-8 > -3" /></span>,                                  correct: "Salah" },
              { key:"b", text: <span>Nilai mutlak <InlineMath math="|-5| = 5" /></span>,                   correct: "Benar" },
              { key:"c", text: <span>Bilangan bulat negatif terbesar adalah <InlineMath math="-1" /></span>, correct: "Benar" },
            ]} />
            <PembahasanBtn n={3} />
            {expandedPembahasan.has(3) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>(a) Salah &nbsp;|&nbsp; (b) Benar &nbsp;|&nbsp; (c) Benar</PBJawaban>
                <PBKonsep>
                  <p>Pada garis bilangan, semakin ke <span className="font-bold">kanan</span> semakin <span className="font-bold">besar</span>.</p>
                  <p>Nilai mutlak: <InlineMath math="|a| = a" /> jika <InlineMath math="a \geq 0" />, dan <InlineMath math="|a| = -a" /> jika <InlineMath math="a < 0" />.</p>
                  <p className={`text-[10px] italic ${isDark?"text-violet-300/70":"text-violet-500"}`}>💡 Trik: bilangan negatif makin besar = makin dekat ke nol (makin kecil absolut-nya).</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>(a) Di garis bilangan, <InlineMath math="-8" /> di sebelah kiri <InlineMath math="-3" />, jadi <InlineMath math="-8 < -3" /> → pernyataan <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                  <S n={2}><p>(b) <InlineMath math="|-5| = 5" /> karena jarak −5 ke 0 adalah 5 → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={3}><p>(c) Bilangan bulat negatif: …, −3, −2, −1. Yang terbesar adalah −1 (paling dekat 0) → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 4 — PGS ══ */}
          <Soal n={4} tipe="PGS">
            <p className={qText}>
              Suhu di puncak gunung adalah <InlineMath math="-4°C" />. Suhu di kaki gunung <InlineMath math="23°C" /> lebih tinggi dari suhu di puncak. Suhu di kaki gunung adalah ....
            </p>
            <MCQ qn={4} correct={2} options={[
              <span key="a">A. <InlineMath math="-27°C" /></span>,
              <span key="b">B. <InlineMath math="-19°C" /></span>,
              <span key="c">C. <InlineMath math="19°C" /></span>,
              <span key="d">D. <InlineMath math="27°C" /></span>,
            ]} />
            <PembahasanBtn n={4} />
            {expandedPembahasan.has(4) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>C. 19°C</PBJawaban>
                <PBKonsep>
                  <p>"Lebih tinggi" dalam konteks suhu berarti <span className="font-bold">ditambah (+)</span>.</p>
                  <p>"Lebih rendah" berarti dikurangi (−).</p>
                  <p className={`text-[10px] italic ${isDark?"text-violet-300/70":"text-violet-500"}`}>💡 Trik: ubah kata soal ke operasi matematika terlebih dahulu.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Suhu puncak = <InlineMath math="-4°C" /></p></S>
                  <S n={2}><p>Kaki gunung <InlineMath math="23°C" /> lebih tinggi: <InlineMath math="-4 + 23" /></p></S>
                  <S n={3}><div><BlockMath math="-4 + 23 = 19°C" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 5 — MCMA ══ */}
          <Soal n={5} tipe="MCMA">
            <p className={qText}>
              Manakah pernyataan-pernyataan berikut yang <span className={`font-bold ${isDark?"text-amber-300":"text-amber-600"}`}>BENAR</span> tentang bilangan bulat? Klik semua yang benar!
            </p>
            <p className={`${hint} ${isDark?"text-amber-300":"text-amber-600"}`}>Jawaban benar lebih dari satu.</p>
            <MCMA qn={5} items={[
              { text: "(1) Hasil perkalian dua bilangan bulat negatif selalu positif",       benar: true  },
              { text: "(2) Hasil penjumlahan bilangan bulat positif dan negatif selalu negatif", benar: false },
              { text: "(3) Nilai mutlak setiap bilangan bulat selalu tidak negatif",          benar: true  },
              { text: "(4) Bilangan cacah termasuk bagian dari bilangan bulat",               benar: true  },
            ]} />
            <PembahasanBtn n={5} />
            {expandedPembahasan.has(5) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Pernyataan (1), (3), dan (4) benar</PBJawaban>
                <PBKonsep>
                  <p>• (−) × (−) = (+) → negatif × negatif = positif ✓</p>
                  <p>• Penjumlahan positif + negatif hasilnya tergantung besar masing-masing, bisa positif/negatif/nol</p>
                  <p>• <InlineMath math="|a| \geq 0" /> untuk semua <InlineMath math="a \in \mathbb{Z}" /></p>
                  <p>• Bilangan cacah = {"{0,1,2,3,...}"} ⊂ Bilangan Bulat</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>(1) <InlineMath math="(-2)\times(-3)=6>0" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={2}><p>(2) Contoh: <InlineMath math="10+(-3)=7>0" /> → hasilnya positif, bukan negatif → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                  <S n={3}><p>(3) <InlineMath math="|{-5}|=5\geq0,\;|3|=3\geq0" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={4}><p>(4) Bilangan bulat = {"{…,−2,−1,0,1,2,…}"} mencakup 0,1,2,… → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 6 — BS ══ */}
          <Soal n={6} tipe="BS">
            <p className={qText}>
              Tentukan <span className={`font-bold ${isDark?"text-green-300":"text-green-600"}`}>Benar</span> atau{" "}
              <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>Salah</span> setiap pernyataan tentang operasi hitung berikut!
            </p>
            <TFTable qn={6} rows={[
              { key:"a", text: <span><InlineMath math="(-4) \times 3 + (-2) = -14" /></span>,     correct: "Benar" },
              { key:"b", text: <span><InlineMath math="20 \div (-4) - 5 = 0" /></span>,            correct: "Salah" },
              { key:"c", text: <span><InlineMath math="(-3)^2 = -9" /></span>,                     correct: "Salah" },
            ]} />
            <PembahasanBtn n={6} />
            {expandedPembahasan.has(6) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>(a) Benar &nbsp;|&nbsp; (b) Salah &nbsp;|&nbsp; (c) Salah</PBJawaban>
                <PBKonsep>
                  <p>Urutan Ka–Pa–Ka–Ta: kali/bagi dikerjakan sebelum tambah/kurang.</p>
                  <p><InlineMath math="(-3)^2 = (-3)\times(-3) = +9" /> bukan −9 — pangkat genap selalu positif!</p>
                  <p className={`text-[10px] italic ${isDark?"text-violet-300/70":"text-violet-500"}`}>💡 Trik: pangkat genap bilangan negatif = positif, pangkat ganjil = negatif.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>(a) <InlineMath math="(-4)\times3=-12" />, lalu <InlineMath math="-12+(-2)=-14" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={2}><p>(b) <InlineMath math="20\div(-4)=-5" />, lalu <InlineMath math="-5-5=-10\neq0" /> → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                  <S n={3}><p>(c) <InlineMath math="(-3)^2=(-3)\times(-3)=+9\neq-9" /> → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 7 — PGS ══ */}
          <Soal n={7} tipe="PGS">
            <p className={qText}>
              Operasi "<InlineMath math="\star" />" didefinisikan sebagai <InlineMath math="a \star b = 3a - 2b" />.
              Nilai dari <InlineMath math="(-2) \star 4" /> adalah ....
            </p>
            <MCQ qn={7} correct={0} options={[
              "A. −14", "B. −2", "C. 2", "D. 14"
            ]} />
            <PembahasanBtn n={7} />
            {expandedPembahasan.has(7) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>A. −14</PBJawaban>
                <PBKonsep>
                  <p>Operasi khusus (non-standar): ikuti <span className="font-bold">definisi yang diberikan</span>, lalu substitusikan nilai.</p>
                  <p>Rumus: <InlineMath math="a \star b = 3a - 2b" /></p>
                  <p className={`text-[10px] italic ${isDark?"text-violet-300/70":"text-violet-500"}`}>💡 Trik: tulis rumus dulu, baru substitusi — jangan substitusi sebelum tahu rumusnya.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Identifikasi: <InlineMath math="a=-2,\;b=4" /></p></S>
                  <S n={2}><p>Substitusi: <InlineMath math="3(-2) - 2(4)" /></p></S>
                  <S n={3}><p>Hitung: <InlineMath math="-6 - 8 = -14" /></p></S>
                  <S n={4}><div><BlockMath math="(-2)\star 4 = 3(-2)-2(4) = -6-8 = -14" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 8 — MCMA ══ */}
          <Soal n={8} tipe="MCMA">
            <p className={qText}>
              Sebuah lift berada di <span className={`font-bold ${isDark?"text-amber-300":"text-amber-600"}`}>lantai 3</span>. Lift naik 5 lantai, kemudian turun 8 lantai, lalu naik lagi 2 lantai.
              Manakah pernyataan berikut yang <span className={`font-bold ${isDark?"text-amber-300":"text-amber-600"}`}>BENAR</span>?
            </p>
            <p className={`${hint} ${isDark?"text-amber-300":"text-amber-600"}`}>Jawaban benar lebih dari satu.</p>
            <MCMA qn={8} items={[
              { text: <span>(1) Model matematika posisi akhir: <InlineMath math="3+5-8+2" /></span>, benar: true  },
              { text: "(2) Posisi akhir lift adalah lantai 1",                                       benar: false },
              { text: "(3) Lift sempat berada di lantai 8",                                         benar: true  },
              { text: "(4) Posisi akhir lift lebih rendah dari posisi awal",                        benar: true  },
            ]} />
            <PembahasanBtn n={8} />
            {expandedPembahasan.has(8) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Pernyataan (1), (3), dan (4) benar</PBJawaban>
                <PBKonsep>
                  <p>Naik = tambah (+), Turun = kurang (−).</p>
                  <p>Lacak posisi <span className="font-bold">langkah demi langkah</span> untuk menemukan posisi maksimum dan akhir.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Mulai: lantai 3. Naik 5: <InlineMath math="3+5=8" /> → lantai 8</p></S>
                  <S n={2}><p>Turun 8: <InlineMath math="8-8=0" /> → lantai 0</p></S>
                  <S n={3}><p>Naik 2: <InlineMath math="0+2=2" /> → lantai 2 (posisi akhir)</p></S>
                  <S n={4}><p>(1) Model <InlineMath math="3+5-8+2=2" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={5}><p>(2) Posisi akhir lantai <strong>2</strong> bukan lantai 1 → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                  <S n={6}><p>(3) Setelah naik 5, lift di lantai 8 → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={7}><p>(4) Akhir lantai 2 &lt; awal lantai 3 → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 9 — BS ══ */}
          <Soal n={9} tipe="BS">
            <p className={qText}>
              Tentukan <span className={`font-bold ${isDark?"text-green-300":"text-green-600"}`}>Benar</span> atau{" "}
              <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>Salah</span> setiap pernyataan berikut!
            </p>
            <TFTable qn={9} rows={[
              { key:"a", text: <span><InlineMath math="-15 + 7 = -8" /></span>,                correct: "Benar" },
              { key:"b", text: <span><InlineMath math="(-6) \times (-4) = -24" /></span>,      correct: "Salah" },
              { key:"c", text: <span><InlineMath math="0 \div (-5) = 0" /></span>,             correct: "Benar" },
            ]} />
            <PembahasanBtn n={9} />
            {expandedPembahasan.has(9) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>(a) Benar &nbsp;|&nbsp; (b) Salah &nbsp;|&nbsp; (c) Benar</PBJawaban>
                <PBKonsep>
                  <p>• Penjumlahan dengan bilangan negatif: geser ke kiri pada garis bilangan.</p>
                  <p>• (−) × (−) = (+): negatif kali negatif = positif.</p>
                  <p>• 0 dibagi bilangan apa pun (≠ 0) = 0.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>(a) <InlineMath math="-15+7 = -(15-7) = -8" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={2}><p>(b) <InlineMath math="(-6)\times(-4) = +24 \neq -24" /> → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                  <S n={3}><p>(c) <InlineMath math="0\div(-5) = 0" /> (nol dibagi apa pun = 0) → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 10 — PGS ══ */}
          <Soal n={10} tipe="PGS">
            <p className={qText}>
              Kompetisi matematika memberi skor <span className={`font-bold ${isDark?"text-green-300":"text-green-600"}`}>+4</span> untuk jawaban benar,{" "}
              <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>−2</span> untuk jawaban salah, dan{" "}
              <span className={`font-bold ${isDark?"text-white/60":"text-gray-500"}`}>0</span> untuk tidak dijawab.
              Dari 20 soal, Dina menjawab 17 soal dengan 12 benar. Skor Dina adalah ....
            </p>
            <MCQ qn={10} correct={1} options={[
              "A. 34", "B. 38", "C. 42", "D. 44"
            ]} />
            <PembahasanBtn n={10} />
            {expandedPembahasan.has(10) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>B. 38</PBJawaban>
                <PBKonsep>
                  <p>Skor total = (benar × poin benar) + (salah × poin salah) + (kosong × poin kosong)</p>
                  <p>Hitung dulu: jumlah salah = total dijawab − benar.</p>
                  <p className={`text-[10px] italic ${isDark?"text-violet-300/70":"text-violet-500"}`}>💡 Trik: tentukan jumlah masing-masing kategori terlebih dahulu.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Benar = 12, Salah = <InlineMath math="17-12=5" />, Tidak dijawab = <InlineMath math="20-17=3" /></p></S>
                  <S n={2}><p>Skor benar: <InlineMath math="12 \times 4 = 48" /></p></S>
                  <S n={3}><p>Skor salah: <InlineMath math="5 \times (-2) = -10" /></p></S>
                  <S n={4}><p>Skor kosong: <InlineMath math="3 \times 0 = 0" /></p></S>
                  <S n={5}><div><BlockMath math="\text{Skor} = 48 + (-10) + 0 = 38" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 11 — MCMA ══ */}
          <Soal n={11} tipe="MCMA">
            <p className={qText}>
              Perhatikan ekspresi: <InlineMath math="24 - 8 \times 3 + 12 \div 4" />.
              Manakah pernyataan berikut yang <span className={`font-bold ${isDark?"text-amber-300":"text-amber-600"}`}>BENAR</span>?
            </p>
            <p className={`${hint} ${isDark?"text-amber-300":"text-amber-600"}`}>Jawaban benar lebih dari satu.</p>
            <MCMA qn={11} items={[
              { text: <span>(1) Langkah pertama: kerjakan <InlineMath math="8 \times 3 = 24" /></span>,     benar: true  },
              { text: <span>(2) Nilai ekspresi tersebut adalah <InlineMath math="12" /></span>,              benar: false },
              { text: <span>(3) Setelah kali/bagi, ekspresi menjadi <InlineMath math="24-24+3" /></span>,   benar: true  },
              { text: <span>(4) Nilai ekspresi tersebut adalah <InlineMath math="3" /></span>,               benar: true  },
            ]} />
            <PembahasanBtn n={11} />
            {expandedPembahasan.has(11) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Pernyataan (1), (3), dan (4) benar</PBJawaban>
                <PBKonsep>
                  <p>Urutan Ka–Pa–Ka–Ta: kerjakan kali/bagi sebelum tambah/kurang.</p>
                  <p>Kali/bagi dikerjakan dari <span className="font-bold">kiri ke kanan</span>.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Kali: <InlineMath math="8\times3=24" /> dan bagi: <InlineMath math="12\div4=3" /> (kiri ke kanan)</p></S>
                  <S n={2}><p>Ekspresi: <InlineMath math="24-24+3" /></p></S>
                  <S n={3}><p>Tambah/kurang: <InlineMath math="24-24+3=0+3=3" /></p></S>
                  <S n={4}><div><BlockMath math="24-8\times3+12\div4=24-24+3=3" /></div></S>
                  <S n={5}><p>(2) Nilai 12 → salah, hasil = 3 → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 12 — BS ══ */}
          <Soal n={12} tipe="BS">
            <p className={qText}>
              Tentukan <span className={`font-bold ${isDark?"text-green-300":"text-green-600"}`}>Benar</span> atau{" "}
              <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>Salah</span> pernyataan-pernyataan tentang suhu berikut!
            </p>
            <TFTable qn={12} rows={[
              { key:"a", text: <span>Jika suhu mula-mula <InlineMath math="-5°C" /> lalu turun <InlineMath math="3°C" />, suhu akhirnya <InlineMath math="-8°C" /></span>, correct: "Benar" },
              { key:"b", text: <span>Selisih suhu <InlineMath math="-10°C" /> dan <InlineMath math="15°C" /> adalah <InlineMath math="5°C" /></span>,                       correct: "Salah" },
              { key:"c", text: <span>Suhu <InlineMath math="-3°C" /> lebih dingin dari suhu <InlineMath math="-7°C" /></span>,                                               correct: "Salah" },
            ]} />
            <PembahasanBtn n={12} />
            {expandedPembahasan.has(12) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>(a) Benar &nbsp;|&nbsp; (b) Salah &nbsp;|&nbsp; (c) Salah</PBJawaban>
                <PBKonsep>
                  <p>Selisih suhu = <InlineMath math="|T_1 - T_2|" /> (nilai mutlak perbedaan).</p>
                  <p>Makin rendah nilainya, makin dingin. <InlineMath math="-7 < -3" />, jadi −7 lebih dingin.</p>
                  <p className={`text-[10px] italic ${isDark?"text-violet-300/70":"text-violet-500"}`}>💡 Trik: di garis bilangan, kiri = lebih dingin (lebih kecil).</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>(a) <InlineMath math="-5+(-3)=-5-3=-8°C" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={2}><p>(b) <InlineMath math="|15-(-10)|=|15+10|=25°C\neq5°C" /> → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                  <S n={3}><p>(c) <InlineMath math="-3>-7" />, jadi −3 lebih <em>hangat</em>, bukan lebih dingin → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 13 — PGS ══ */}
          <Soal n={13} tipe="PGS">
            <p className={qText}>
              Nilai dari <InlineMath math="2 - 4 + 6 - 8 + 10 - 12 + \ldots + 46 - 48 + 50" /> adalah ....
            </p>
            <MCQ qn={13} correct={1} options={[
              "A. 24", "B. 26", "C. 28", "D. 30"
            ]} />
            <PembahasanBtn n={13} />
            {expandedPembahasan.has(13) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>B. 26</PBJawaban>
                <PBKonsep>
                  <p>Kelompokkan pasangan berurutan: <InlineMath math="(2-4)+(6-8)+\ldots+(46-48)+50" /></p>
                  <p>Setiap pasangan <InlineMath math="(2k-2k-2) = -2" />.</p>
                  <p className={`text-[10px] italic ${isDark?"text-violet-300/70":"text-violet-500"}`}>💡 Trik: hitung banyak pasangan, kalikan −2, tambah suku terakhir jika tersisa.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Bilangan genap dari 2 s.d. 50: ada 25 suku.</p></S>
                  <S n={2}><p>Pasangkan: <InlineMath math="(2-4),(6-8),\ldots,(46-48)" /> → 12 pasangan, sisa suku ke-25 yaitu 50.</p></S>
                  <S n={3}><p>Setiap pasangan = <InlineMath math="-2" />, total 12 pasangan = <InlineMath math="12\times(-2)=-24" /></p></S>
                  <S n={4}><div><BlockMath math="-24 + 50 = 26" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 14 — MCMA ══ */}
          <Soal n={14} tipe="MCMA">
            <p className={qText}>
              Manakah pernyataan berikut yang <span className={`font-bold ${isDark?"text-amber-300":"text-amber-600"}`}>BENAR</span> tentang bilangan <InlineMath math="-36" />?
            </p>
            <p className={`${hint} ${isDark?"text-amber-300":"text-amber-600"}`}>Jawaban benar lebih dari satu.</p>
            <MCMA qn={14} items={[
              { text: <span>(1) <InlineMath math="-36" /> habis dibagi <InlineMath math="-4" /></span>,                              benar: true  },
              { text: <span>(2) <InlineMath math="-36 = (-6)^2" /></span>,                                                            benar: false },
              { text: <span>(3) <InlineMath math="-36" /> adalah bilangan bulat negatif</span>,                                       benar: true  },
              { text: <span>(4) Banyak faktor positif dari <InlineMath math="36" /> adalah <InlineMath math="9" /></span>,            benar: true  },
            ]} />
            <PembahasanBtn n={14} />
            {expandedPembahasan.has(14) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Pernyataan (1), (3), dan (4) benar</PBJawaban>
                <PBKonsep>
                  <p><InlineMath math="(-a)^2 = a^2" /> (pangkat genap selalu positif) → <InlineMath math="(-6)^2=36\neq-36" /></p>
                  <p>Faktor positif 36: 1, 2, 3, 4, 6, 9, 12, 18, 36 → <InlineMath math="36=2^2\times3^2" />, banyak faktor = <InlineMath math="(2+1)(2+1)=9" /></p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>(1) <InlineMath math="-36\div(-4)=9" /> (bilangan bulat) → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={2}><p>(2) <InlineMath math="(-6)^2=36\neq-36" /> → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                  <S n={3}><p>(3) −36 &lt; 0, termasuk bilangan bulat negatif → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={4}><p>(4) <InlineMath math="36=2^2\times3^2" />, banyak faktor = <InlineMath math="(2+1)(2+1)=9" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══ SOAL 15 — BS ══ */}
          <Soal n={15} tipe="BS">
            <p className={qText}>
              Tentukan <span className={`font-bold ${isDark?"text-green-300":"text-green-600"}`}>Benar</span> atau{" "}
              <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>Salah</span> setiap pernyataan berikut!
            </p>
            <TFTable qn={15} rows={[
              { key:"a", text: <span><InlineMath math="(-2)\times(-3)\times(-1) = -6" /></span>,    correct: "Benar" },
              { key:"b", text: <span><InlineMath math="(-5)^2+(-5) = 20" /></span>,                 correct: "Benar" },
              { key:"c", text: <span><InlineMath math="(-4)^3 = 64" /></span>,                      correct: "Salah" },
            ]} />
            <PembahasanBtn n={15} />
            {expandedPembahasan.has(15) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>(a) Benar &nbsp;|&nbsp; (b) Benar &nbsp;|&nbsp; (c) Salah</PBJawaban>
                <PBKonsep>
                  <p>Tiga bilangan negatif dikalikan: (−)(−) = + lalu (+)(−) = −.</p>
                  <p><InlineMath math="(-5)^2=25" /> (pangkat genap = positif), baru dikurangi 5.</p>
                  <p><InlineMath math="(-4)^3" /> = pangkat ganjil → hasilnya negatif = −64.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>(a) <InlineMath math="(-2)\times(-3)=6" />, lalu <InlineMath math="6\times(-1)=-6" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={2}><p>(b) <InlineMath math="(-5)^2=25" />, lalu <InlineMath math="25+(-5)=25-5=20" /> → <span className={`font-bold ${isDark?"text-green-300":"text-green-700"}`}>BENAR ✓</span></p></S>
                  <S n={3}><p>(c) <InlineMath math="(-4)^3=(-4)\times(-4)\times(-4)=16\times(-4)=-64\neq64" /> → <span className={`font-bold ${isDark?"text-red-300":"text-red-600"}`}>SALAH ✗</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

        </div>}{/* end soal-soal */}

        {/* ── Footer ── */}
        <div className={`mt-8 border rounded-xl p-4 text-center ${isDark ? "bg-blue-900/20 border-blue-500/30" : "bg-blue-50 border-blue-300"}`}>
          <p className={`text-xs font-body ${isDark ? "text-white/50" : "text-gray-500"}`}>
            Modul Pemantapan TKA · Kelas 7 SMP · Bilangan Bulat · TA 2026–2027
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/tka/modul-pemantapan"); }}
            className={`text-sm hover:text-blue-400 transition-colors cursor-pointer font-body ${isDark ? "text-muted-foreground" : "text-gray-500"}`}
          >
            ← Kembali ke Modul Pemantapan
          </button>
        </div>

      </div>
    </div>
  );
};

export default BilanganBulatPage;
