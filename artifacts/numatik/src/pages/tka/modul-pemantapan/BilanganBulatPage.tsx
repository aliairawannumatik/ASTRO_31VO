import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath, BlockMath } from "react-katex";
import { useTheme } from "@/contexts/ThemeContext";
import "katex/dist/katex.min.css";

const BilanganBulatPage = () => {
  const navigate = useNavigate();
  const { isDark, theme } = useTheme();
  const [activeTab, setActiveTab]                   = useState<"materi" | "soal">("materi");
  const [expandedMateri, setExpandedMateri]         = useState<number[]>([0, 1, 2, 3, 4]);
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
        <div className={`relative backdrop-blur border border-blue-500/30 rounded-2xl p-5 mb-6 ${isDark ? "bg-card/80" : "bg-white shadow-sm"}`}>
          <img src="/logo-numatik.png" alt="Numatik" className="absolute top-3 left-3 w-10 h-10 object-contain" />
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/40 rounded-full px-4 py-1 mb-3">
              <span className="text-blue-400 text-[10px] font-body font-bold uppercase tracking-widest">✦ MODUL PEMANTAPAN ✦</span>
            </div>
            <h1 className={`font-display text-base font-bold mb-0.5 ${isDark ? "text-blue-300" : "text-blue-700"}`}>TES KEMAMPUAN AKADEMIK (TKA)</h1>
            <p className={`font-body text-xs mb-0.5 ${isDark ? "text-white/60" : "text-gray-500"}`}>MATEMATIKA — KELAS 7 SMP/MTs</p>
            <p className={`font-display text-xl font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>BILANGAN BULAT</p>
            <p className={`font-body text-xs mt-1 ${isDark ? "text-white/45" : "text-gray-400"}`}>Tahun Ajaran 2026 – 2027</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-body">
            <div className={`rounded-lg p-2 text-center ${isDark ? "bg-white/5" : "bg-gray-50 border border-gray-200"}`}>
              <p className={`text-[9px] uppercase tracking-wider ${isDark ? "text-white/40" : "text-gray-400"}`}>Soal</p>
              <p className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>15 Soal</p>
            </div>
            <div className={`rounded-lg p-2 text-center ${isDark ? "bg-sky-500/10 border border-sky-500/30" : "bg-sky-50 border border-sky-300"}`}>
              <p className={`text-[9px] uppercase tracking-wider ${isDark ? "text-sky-400" : "text-sky-600"}`}>Jenjang</p>
              <p className={`font-bold ${isDark ? "text-sky-300" : "text-sky-700"}`}>SMP Kelas 7</p>
            </div>
            <div className={`rounded-lg p-2 text-center flex items-center justify-center gap-1.5 ${isDark ? "bg-amber-500/10 border border-amber-500/30" : "bg-amber-50 border border-amber-300"}`}>
              <span className="text-base">⏱️</span>
              <div>
                <p className={`text-[9px] uppercase tracking-wider ${isDark ? "text-amber-400" : "text-amber-600"}`}>Waktu</p>
                <p className={`font-display font-bold text-sm ${isDark ? "text-amber-300" : "text-amber-700"}`}>45 Menit</p>
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
                heading: "A. Pengertian Bilangan Bulat",
                content: [
                  "Bilangan bulat adalah himpunan yang terdiri dari bilangan bulat negatif, nol, dan bilangan bulat positif.",
                  "Notasi: ℤ = {…, −3, −2, −1, 0, 1, 2, 3, …}",
                  "",
                  "Himpunan bagian bilangan bulat:",
                  "• Bilangan bulat positif: {1, 2, 3, …} = bilangan asli",
                  "• Bilangan cacah: {0, 1, 2, 3, …} ⊂ ℤ",
                  "• Bilangan bulat negatif: {−1, −2, −3, …}",
                  "",
                  "Di garis bilangan: makin ke kanan → makin besar.",
                  "Contoh: −5 < −2 < 0 < 3 < 7",
                ],
              },
              {
                heading: "B. Nilai Mutlak",
                content: [
                  "Nilai mutlak |a| menyatakan jarak bilangan a dari 0 pada garis bilangan (selalu ≥ 0).",
                  "",
                  "Definisi:",
                  "• |a| = a,  jika a ≥ 0",
                  "• |a| = −a, jika a < 0",
                  "",
                  "Contoh: |−7| = 7,  |5| = 5,  |0| = 0",
                  "",
                  "💡 Trik: Nilai mutlak = 'buang' tanda minusnya.",
                ],
              },
              {
                heading: "C. Penjumlahan & Pengurangan",
                content: [
                  "Aturan tanda penjumlahan:",
                  "• (+) + (+) = (+)  →  3 + 5 = 8",
                  "• (−) + (−) = (−)  →  −3 + (−5) = −8",
                  "• Beda tanda → ambil selisih nilai mutlak, tanda = tanda yang lebih besar",
                  "  Contoh: −8 + 3 = −5  (karena |−8| > |3|, hasilnya negatif)",
                  "",
                  "Pengurangan → ubah ke penjumlahan:",
                  "a − b = a + (−b)",
                  "Contoh: 5 − (−3) = 5 + 3 = 8",
                ],
              },
              {
                heading: "D. Perkalian & Pembagian",
                content: [
                  "Aturan tanda perkalian/pembagian:",
                  "• (+) × (+) = (+)  →  4 × 3 = 12",
                  "• (−) × (−) = (+)  →  −4 × (−3) = 12",
                  "• (+) × (−) = (−)  →  4 × (−3) = −12",
                  "• (−) × (+) = (−)  →  −4 × 3 = −12",
                  "",
                  "Aturan yang sama berlaku untuk pembagian (÷).",
                  "",
                  "Khusus: 0 × a = 0  dan  0 ÷ a = 0  (untuk a ≠ 0)",
                  "",
                  "Pangkat bilangan negatif:",
                  "• Pangkat genap  → hasil positif: (−2)² = 4",
                  "• Pangkat ganjil → hasil negatif: (−2)³ = −8",
                ],
              },
              {
                heading: "E. Urutan Operasi Hitung (Ka–Pa–Ka–Ta)",
                content: [
                  "Urutan pengerjaan operasi hitung campuran:",
                  "",
                  "① Ka — Kurung  ( ) dulu",
                  "② Pa — Pangkat / Akar",
                  "③ Ka — Kali (×) dan Bagi (÷) dari kiri ke kanan",
                  "④ Ta — Tambah (+) dan Kurang (−) dari kiri ke kanan",
                  "",
                  "💡 Ingat: Kali dan Bagi punya prioritas SAMA → kerjakan dari kiri!",
                  "   Begitu pula Tambah dan Kurang.",
                  "",
                  "Contoh: −18 + 42 ÷ (−6) × 3",
                  "= −18 + (−7) × 3",
                  "= −18 + (−21)",
                  "= −39",
                ],
              },
            ] as { heading: string; content: string[] }[]).map((sec, idx) => {
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
                        line === "" ? <div key={li} className="h-1" /> : <div key={li}>{line}</div>
                      )}
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
