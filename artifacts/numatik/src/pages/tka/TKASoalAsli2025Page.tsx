import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath, BlockMath } from "react-katex";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import "katex/dist/katex.min.css";

const TKASoalAsli2025Page = () => {
  const navigate = useNavigate();
  const { isDark, theme } = useTheme();
  const [expandedPembahasan, setExpandedPembahasan] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [selectedComplexAnswers, setSelectedComplexAnswers] = useState<Record<number, Set<number>>>({});
  const [selectedCategory, setSelectedCategory] = useState<Record<string, string>>({});

  const togglePembahasan = (n: number) => {
    setExpandedPembahasan(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const selectAnswer = (qn: number, idx: number) => {
    if (selectedAnswers[qn] !== undefined) return;
    playPopSound();
    setSelectedAnswers(prev => ({ ...prev, [qn]: idx }));
  };

  const selectComplexAnswer = (qn: number, idx: number) => {
    if ((selectedComplexAnswers[qn] ?? new Set()).has(idx)) return;
    playPopSound();
    setSelectedComplexAnswers(prev => {
      const next = new Set(prev[qn] ?? []);
      next.add(idx);
      return { ...prev, [qn]: next };
    });
  };

  const selectCategory = (key: string, choice: string) => {
    if (selectedCategory[key] !== undefined) return;
    playPopSound();
    setSelectedCategory(prev => ({ ...prev, [key]: choice }));
  };

  // ─── Outer background based on theme ─────────────────────────────
  const outerBg = isDark
    ? "gradient-space"
    : theme === "white"
    ? "bg-white"
    : theme === "forest"
    ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
    : theme === "sunset"
    ? "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
    : "bg-gradient-to-br from-blue-50 via-white to-sky-50";

  // ─── Pembahasan sub-components ────────────────────────────────────
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

  // ─── UI Sub-components ────────────────────────────────────────────
  const MCQ = ({ qn, options, correct, cols = 2 }: {
    qn: number; options: React.ReactNode[]; correct: number; cols?: number;
  }) => {
    const sel = selectedAnswers[qn];
    const answered = sel !== undefined;
    return (
      <div className={cols === 1 ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"}>
        {options.map((opt, i) => {
          const isSelected = sel === i;
          const isCorrect = i === correct;
          let cls = "border rounded-lg px-3 py-2 text-xs font-body transition-all flex items-center justify-between ";
          if (!answered) cls += isDark
            ? "bg-white/5 border-white/10 text-white/80 cursor-pointer hover:bg-white/10 hover:border-amber-500/40 active:scale-95"
            : "bg-gray-50 border-gray-300 text-gray-700 cursor-pointer hover:bg-amber-50 hover:border-amber-400 active:scale-95";
          else if (isCorrect) cls += isDark
            ? "bg-green-900/40 border-green-500/60 text-green-300 font-bold"
            : "bg-green-50 border-green-400 text-green-700 font-bold";
          else if (isSelected) cls += isDark
            ? "bg-red-900/30 border-red-500/50 text-red-300"
            : "bg-red-50 border-red-400 text-red-600";
          else cls += isDark
            ? "bg-white/5 border-white/10 text-white/30"
            : "bg-gray-50 border-gray-200 text-gray-400";
          return (
            <div key={i} className={cls} onClick={() => selectAnswer(qn, i)}>
              <span>{opt}</span>
              {answered && isCorrect && <span className={`ml-2 font-bold shrink-0 ${isDark ? "text-green-400" : "text-green-600"}`}>✓</span>}
              {answered && isSelected && !isCorrect && <span className={`ml-2 font-bold shrink-0 ${isDark ? "text-red-400" : "text-red-500"}`}>✗</span>}
            </div>
          );
        })}
      </div>
    );
  };

  const ComplexMCQ = ({ qn, items }: {
    qn: number;
    items: { text: React.ReactNode; benar: boolean }[];
  }) => {
    const clicks = selectedComplexAnswers[qn] ?? new Set<number>();
    return (
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const isClicked = clicks.has(i);
          let cls = "border rounded-lg px-3 py-2 text-xs font-body transition-all flex items-center justify-between ";
          if (!isClicked) cls += isDark
            ? "bg-white/5 border-white/10 text-white/80 cursor-pointer hover:bg-white/10 hover:border-amber-500/40 active:scale-95"
            : "bg-gray-50 border-gray-300 text-gray-700 cursor-pointer hover:bg-amber-50 hover:border-amber-400 active:scale-95";
          else if (item.benar) cls += isDark
            ? "bg-green-900/40 border-green-500/60 text-green-300 font-bold"
            : "bg-green-50 border-green-400 text-green-700 font-bold";
          else cls += isDark
            ? "bg-red-900/30 border-red-500/50 text-red-300"
            : "bg-red-50 border-red-400 text-red-600";
          return (
            <div key={i} className={cls} onClick={() => selectComplexAnswer(qn, i)}>
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
              {isClicked && item.benar && <span className={`ml-2 font-bold shrink-0 ${isDark ? "text-green-400" : "text-green-600"}`}>✓ Benar!</span>}
              {isClicked && !item.benar && <span className={`ml-2 font-bold shrink-0 ${isDark ? "text-red-400" : "text-red-500"}`}>✗ Salah</span>}
            </div>
          );
        })}
      </div>
    );
  };

  const CategoryTable = ({ qn, colA, colB, rows, correctKey }: {
    qn: number;
    colA: string;
    colB: string;
    rows: { key: string; text: React.ReactNode }[];
    correctKey: Record<string, string>;
  }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-body border-collapse">
        <thead>
          <tr className={isDark ? "bg-white/10" : "bg-gray-100"}>
            <th className={`border px-3 py-2 text-left ${isDark ? "border-white/20 text-white" : "border-gray-300 text-gray-700"}`}>Pernyataan</th>
            <th className={`border px-3 py-2 text-center w-28 ${isDark ? "border-white/20 text-white" : "border-gray-300 text-gray-700"}`}>{colA}</th>
            <th className={`border px-3 py-2 text-center w-28 ${isDark ? "border-white/20 text-white" : "border-gray-300 text-gray-700"}`}>{colB}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const key = `${qn}-${row.key}`;
            const sel = selectedCategory[key];
            const answered = sel !== undefined;
            const correct = correctKey[row.key];
            return (
              <tr key={row.key} className={answered ? (sel === correct ? (isDark ? "bg-green-900/20" : "bg-green-50") : (isDark ? "bg-red-900/20" : "bg-red-50")) : ""}>
                <td className={`border px-3 py-2 ${isDark ? "border-white/10 text-white/80" : "border-gray-200 text-gray-700"}`}>{row.text}</td>
                {[colA, colB].map(choice => {
                  const isChosen = sel === choice;
                  const isCorrectCell = correct === choice;
                  let btnCls = "w-full py-1 rounded text-center transition-all cursor-pointer text-xs font-bold ";
                  if (!answered) btnCls += isDark ? "bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-white/50" : "bg-gray-50 hover:bg-amber-50 hover:text-amber-600 text-gray-400 border border-gray-200";
                  else if (isCorrectCell) btnCls += isDark ? "bg-green-700/50 text-green-300" : "bg-green-100 text-green-700 border border-green-300";
                  else if (isChosen) btnCls += isDark ? "bg-red-700/50 text-red-300" : "bg-red-100 text-red-600 border border-red-300";
                  else btnCls += isDark ? "bg-white/5 text-white/20" : "bg-gray-50 text-gray-300";
                  return (
                    <td key={choice} className={`border px-2 py-2 text-center ${isDark ? "border-white/10" : "border-gray-200"}`}>
                      <div className={btnCls} onClick={() => selectCategory(key, choice)}>
                        ○{answered && isChosen && isCorrectCell && " ✓"}{answered && isChosen && !isCorrectCell && " ✗"}
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

  const TrueFalseTable = ({ qn, rows }: {
    qn: number;
    rows: { key: string; text: React.ReactNode; correct: "benar" | "salah" }[];
  }) => (
    <CategoryTable
      qn={qn}
      colA="Benar"
      colB="Salah"
      rows={rows}
      correctKey={Object.fromEntries(rows.map(r => [r.key, r.correct === "benar" ? "Benar" : "Salah"]))}
    />
  );

  const PembahasanBtn = ({ n }: { n: number }) => (
    <button
      onClick={() => { playPopSound(); togglePembahasan(n); }}
      className={`mt-3 w-full py-2 rounded-lg text-xs font-body font-semibold transition-all border ${
        isDark
          ? "border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
          : "border-amber-400 text-amber-600 hover:bg-amber-50 bg-white"
      }`}
    >
      {expandedPembahasan.has(n) ? "▲ Tutup Pembahasan" : "▼ Lihat Pembahasan"}
    </button>
  );

  const ImageNote = ({ text }: { text: string }) => (
    <div className={`flex items-start gap-2 border rounded-lg px-3 py-2 mb-3 ${
      isDark ? "bg-blue-900/20 border-blue-500/30" : "bg-blue-50 border-blue-300"
    }`}>
      <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
      <p className={`text-xs font-body ${isDark ? "text-blue-300" : "text-blue-700"}`}>{text}</p>
    </div>
  );

  const Soal = ({ n, elemen, subelemen, children }: {
    n: number; elemen: string; subelemen: string; children: React.ReactNode;
  }) => (
    <div className={`rounded-xl p-5 ${
      isDark
        ? "bg-card/70 backdrop-blur border border-border"
        : "bg-white border border-gray-200 shadow-sm"
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-amber-500/20 text-amber-400 font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">{n}</span>
        <span className={`text-[10px] font-body rounded-full px-2 py-0.5 ${
          isDark ? "text-white/40 bg-white/5 border border-white/10" : "text-gray-500 bg-gray-100 border border-gray-200"
        }`}>{elemen} · {subelemen}</span>
      </div>
      {children}
    </div>
  );

  // ─── Bacaan ────────────────────────────────────────────────────

  const Bacaan1 = () => (
    <div className={`border rounded-xl p-4 mb-5 ${isDark ? "bg-cyan-900/15 border-cyan-500/30" : "bg-cyan-50 border-cyan-200"}`}>
      <p className={`text-[10px] font-body font-bold uppercase tracking-wider mb-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
        Bacaan 1 — untuk menjawab Soal Nomor 2 dan 3
      </p>
      <p className={`text-xs font-body leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
        Rina lebih suka berbelanja online karena lebih mudah dan praktis. Ia sering menggunakan
        cashback yang disediakan oleh aplikasi belanja online. Di era transaksi digital seperti
        sekarang, istilah cashback barangkali sudah tak asing lagi. Apa itu cashback? Cashback
        merupakan persentase pengembalian uang tunai atau virtual yang didapat saat pembeli
        memenuhi syarat tertentu. Potongan tersebut bisa diberikan secara langsung atau di
        kemudian hari. Cashback berbeda dengan diskon. Diskon diberikan dengan memberikan
        potongan harga di awal. Bentuk diskon pun sudah pasti berupa uang alias potongan harga.
        Selain menggunakan uang tunai, cashback biasanya diberikan dalam bentuk poin atau koin
        digital. Beberapa penjual juga sering kali memberikan cashback dalam bentuk produk
        hingga voucher. Berikut beberapa penawaran cashback yang ada di aplikasi belanja online Rina.
      </p>
      <div className="mb-3 flex justify-center">
        <img src="/tka-2025-bacaan1.png" alt="Tabel voucher cashback Bacaan 1" className="max-w-full rounded-lg border border-white/10" />
      </div>
      <p className={`text-xs font-body leading-relaxed mb-2 ${isDark ? "text-white/70" : "text-gray-600"}`}>
        <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Cashback 25% s/d 100RB</span> artinya uang yang dikembalikan sebanyak 25% dari total belanjaan dan tidak lebih dari Rp100.000,00.
      </p>
      <div className={`rounded-lg p-3 text-xs font-body space-y-1 ${isDark ? "bg-white/5 text-white/60" : "bg-white border border-gray-200 text-gray-600"}`}>
        <p className={`font-bold mb-1 ${isDark ? "text-white/70" : "text-gray-700"}`}>Contoh:</p>
        <p>Total belanjaan Rp500.000,00 → 25% × Rp500.000 = Rp125.000 → dibatasi Rp100.000, jadi cashback <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp100.000,00</span>.</p>
        <p>Total belanjaan Rp300.000,00 → 25% × Rp300.000 = Rp75.000 → tidak melewati batas, jadi cashback <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp75.000,00</span>.</p>
      </div>
    </div>
  );

  // ─── step helper ──────────────────────────────────────────────────
  const S = ({ n, children }: { n: number; children: React.ReactNode }) => (
    <div className="flex gap-2 items-start">
      <span className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
        isDark ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/30" : "bg-cyan-200 text-cyan-800 border border-cyan-300"
      }`}>{n}</span>
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-x-hidden overflow-y-auto ${outerBg}`}>
      {isDark && <Starfield />}
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className={`relative backdrop-blur border border-amber-500/30 rounded-2xl p-5 mb-6 ${isDark ? "bg-card/80" : "bg-white shadow-sm"}`}>
          <img
            src="/logo-numatik.png"
            alt="Numatik"
            className="absolute top-3 left-3 w-10 h-10 object-contain"
          />
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/40 rounded-full px-4 py-1 mb-3">
              <span className="text-amber-400 text-[10px] font-body font-bold uppercase tracking-widest">✦ SOAL ASLI ✦</span>
            </div>
            <h1 className="font-display text-lg font-bold text-amber-400 mb-1">TES KEMAMPUAN AKADEMIK (TKA)</h1>
            <p className={`font-body text-xs mb-0.5 ${isDark ? "text-white/60" : "text-gray-500"}`}>MATEMATIKA — SMP/MTs/Sederajat</p>
            <p className="font-display text-xl font-bold text-amber-400">TAHUN 2025 – 2026</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-left text-xs font-body">
            <div className={`rounded-lg p-2 ${isDark ? "bg-white/5" : "bg-gray-50 border border-gray-200"}`}>
              <span className={isDark ? "text-white/40" : "text-gray-500"}>Mata Pelajaran:</span>
              <span className={`ml-1 ${isDark ? "text-white" : "text-gray-800"}`}>Matematika</span>
            </div>
            <div className={`rounded-lg p-2 ${isDark ? "bg-white/5" : "bg-gray-50 border border-gray-200"}`}>
              <span className={isDark ? "text-white/40" : "text-gray-500"}>Jenjang:</span>
              <span className={`ml-1 ${isDark ? "text-white" : "text-gray-800"}`}>SMP/MTs</span>
            </div>
            <div className={`rounded-lg p-2 flex items-center gap-2 ${isDark ? "bg-white/5" : "bg-gray-50 border border-gray-200"}`}>
              <span className={isDark ? "text-white/40" : "text-gray-500"}>Banyak soal:</span>
              <span className={`font-bold ml-1 ${isDark ? "text-amber-300" : "text-amber-600"}`}>30 Soal</span>
            </div>
            <div className={`rounded-lg p-2 flex items-center gap-2 ${isDark ? "bg-amber-500/10 border border-amber-500/30" : "bg-amber-50 border border-amber-300"}`}>
              <span className="text-lg">⏱️</span>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-amber-400" : "text-amber-600"}`}>Waktu</span>
                <p className={`font-display font-bold text-sm ${isDark ? "text-amber-300" : "text-amber-700"}`}>75 Menit</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Petunjuk ── */}
        <div className={`border rounded-xl p-4 mb-6 ${isDark ? "bg-amber-900/15 border-amber-500/25" : "bg-amber-50 border-amber-300"}`}>
          <p className={`font-body text-xs font-bold mb-2 ${isDark ? "text-amber-300" : "text-amber-700"}`}>PETUNJUK</p>
          <ul className={`space-y-1 text-xs font-body list-disc list-inside ${isDark ? "text-white/65" : "text-gray-600"}`}>
            <li>Klik pilihan jawaban untuk menjawab. Jawaban tidak dapat diubah setelah diklik.</li>
            <li>Soal bertipe <span className={isDark ? "text-cyan-300" : "text-cyan-600"}>Pilihan Ganda Sederhana (PGS)</span>: hanya satu jawaban benar.</li>
            <li>Soal bertipe <span className={isDark ? "text-green-300" : "text-green-600"}>MCMA</span>: jawaban benar lebih dari satu — klik semua yang menurutmu benar.</li>
            <li>Soal bertipe <span className={isDark ? "text-violet-300" : "text-violet-600"}>Benar/Salah</span> dan <span className={isDark ? "text-violet-300" : "text-violet-600"}>Kategori</span>: klik kolom yang sesuai untuk setiap pernyataan.</li>
          </ul>
        </div>

        {/* ── Soal ── */}
        <div className="flex flex-col gap-5">

          {/* ══════════════ SOAL 1 ══════════════ */}
          <Soal n={1} elemen="Bilangan" subelemen="Bilangan Real">
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  Hasil dari operasi bilangan berpangkat berikut adalah ....
                </p>
                <div className="my-3 flex justify-center">
                  <BlockMath math="\dfrac{7^3 \times 7^{-4}}{7^2}" />
                </div>
                <MCQ qn={1} correct={2} options={[
                  <span key="a">A. <InlineMath math="7^{-9}" /></span>,
                  <span key="b">B. <InlineMath math="7^{-6}" /></span>,
                  <span key="c">C. <InlineMath math="7^{-3}" /></span>,
                  <span key="d">D. <InlineMath math="7" /></span>,
                ]} />
              </div>
            </div>
            <PembahasanBtn n={1} />
            {expandedPembahasan.has(1) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>C. <InlineMath math="7^{-3}" /></PBJawaban>
                <PBKonsep>
                  <p>Perkalian pangkat (basis sama): <InlineMath math="a^m \times a^n = a^{m+n}" /></p>
                  <p>Pembagian pangkat (basis sama): <InlineMath math="a^m \div a^n = a^{m-n}" /></p>
                  <p className={`text-[10px] mt-1 italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: kerjakan pembilang dulu, baru bagi penyebut</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Hitung pembilang: <InlineMath math="7^3 \times 7^{-4} = 7^{3+(-4)} = 7^{-1}" /></p></S>
                  <S n={2}><p>Bagi dengan penyebut: <InlineMath math="7^{-1} \div 7^2 = 7^{-1-2} = 7^{-3}" /></p></S>
                  <S n={3}><div><BlockMath math="\frac{7^3 \times 7^{-4}}{7^2} = \frac{7^{-1}}{7^2} = 7^{-3}" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ BACAAN 1 ══════════════ */}
          <Bacaan1 />

          {/* ══════════════ SOAL 2 ══════════════ */}
          <Soal n={2} elemen="Bilangan" subelemen="Bilangan Real">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/90" : "text-gray-800"}`}>
              Rina akan membeli hadiah untuk dua orang temannya. Hadiahnya akan dikirim ke alamat
              masing-masing sehingga Rina harus melakukan dua kali transaksi. Setiap satu kali
              transaksi, Rina dapat memilih satu voucher cashback. Setiap voucher hanya dapat
              digunakan satu kali. Hadiah yang dikirim harganya sama yaitu{" "}
              <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp50.000,00</span>.{" "}
              Jika Rina menginginkan cashback lebih dari Rp10.000,00, voucher mana sajakah yang harus ia pilih?
            </p>
            <p className={`text-xs font-body font-semibold mb-2 ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
            <ComplexMCQ qn={2} items={[
              { text: "Voucher A", benar: true },
              { text: "Voucher B", benar: false },
              { text: "Voucher C", benar: false },
              { text: "Voucher D", benar: true },
            ]} />
            <PembahasanBtn n={2} />
            {expandedPembahasan.has(2) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>A dan D (Voucher A dan Voucher D)</PBJawaban>
                <PBKonsep>
                  <p>Cashback = rate% × nominal belanjaan, maksimal dibatasi cap voucher</p>
                  <p>Agar cashback &gt; Rp10.000 dari belanjaan <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp50.000</span>:</p>
                  <div className="my-1"><BlockMath math="\text{rate} \times 50.000 > 10.000 \Rightarrow \text{rate} > 20\%" /></div>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Cek rate &gt; 20%, lalu pastikan cap ≥ Rp10.000 agar cashback tidak terpotong.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Syarat: cashback &gt; Rp10.000 untuk belanjaan Rp50.000</p></S>
                  <S n={2}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Voucher A:</span> 25% × Rp50.000 = Rp12.500, cap Rp100.000 → cashback <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp12.500</span> &gt; Rp10.000 ✓</p></S>
                  <S n={3}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>Voucher B:</span> 5% × Rp50.000 = Rp2.500, cap Rp200.000 → cashback <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp2.500</span> &lt; Rp10.000 ✗</p></S>
                  <S n={4}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>Voucher C:</span> 10% × Rp50.000 = Rp5.000, cap Rp20.000 → cashback <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp5.000</span> &lt; Rp10.000 ✗</p></S>
                  <S n={5}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Voucher D:</span> 40% × Rp50.000 = Rp20.000, cap Rp20.000 → cashback <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp20.000</span> &gt; Rp10.000 ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 3 ══════════════ */}
          <Soal n={3} elemen="Bilangan" subelemen="Bilangan Real">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/90" : "text-gray-800"}`}>
              Rina memiliki voucher A, B, dan D yang bisa ia gunakan untuk berbelanja online.
              Tentukan <span className={`font-bold ${isDark ? "text-green-300" : "text-green-600"}`}>benar</span> atau{" "}
              <span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>salah</span> pernyataan berikut ini
              berkaitan dengan nominal transaksi Rina dan voucher yang seharusnya ia gunakan
              untuk mendapatkan cashback terbesar!
            </p>
            <p className={`text-xs font-body font-semibold mb-2 ${isDark ? "text-violet-300" : "text-violet-600"}`}>Klik pada kotak yang sesuai!</p>
            <TrueFalseTable qn={3} rows={[
              {
                key: "p1",
                correct: "benar",
                text: <img src="/tka-2025-soal3-p1.png" alt="Pernyataan 1 soal 3" className="max-w-full rounded-lg border border-white/10" />,
              },
              {
                key: "p2",
                correct: "salah",
                text: <img src="/tka-2025-soal3-p2.png" alt="Pernyataan 2 soal 3" className="max-w-full rounded-lg border border-white/10" />,
              },
              {
                key: "p3",
                correct: "salah",
                text: <img src="/tka-2025-soal3-p3.png" alt="Pernyataan 3 soal 3" className="max-w-full rounded-lg border border-white/10" />,
              },
            ]} />
            <PembahasanBtn n={3} />
            {expandedPembahasan.has(3) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Benar / Salah / Salah</PBJawaban>
                <PBKonsep>
                  <p>Untuk mendapat cashback terbesar, bandingkan ketiga voucher yang tersedia (A, B, D):</p>
                  <div className="my-1"><BlockMath math="\text{cashback} = \min(\text{rate} \times \text{belanjaan},\; \text{cap})" /></div>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Belanjaan kecil → pilih rate tinggi; belanjaan besar → cap tinggi lebih menguntungkan.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p className="font-bold">Pernyataan 1 — Rp50.000 → Voucher D?</p></S>
                  <S n={2}><div className={`text-xs space-y-0.5 pl-1 ${isDark ? "text-white/80" : "text-gray-700"}`}>
                    <p>A: 25% × 50.000 = <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp12.500</span> (di bawah cap Rp100.000)</p>
                    <p>B: 5% × 50.000 = <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp2.500</span> (di bawah cap Rp200.000)</p>
                    <p>D: 40% × 50.000 = <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp20.000</span> (= cap Rp20.000) ← terbesar ✓</p>
                    <p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>→ Voucher D memberikan cashback terbesar. BENAR ✓</p>
                  </div></S>
                  <S n={3}><p className="font-bold">Pernyataan 2 — Rp200.000 → Voucher B?</p></S>
                  <S n={4}><div className={`text-xs space-y-0.5 pl-1 ${isDark ? "text-white/80" : "text-gray-700"}`}>
                    <p>A: 25% × 200.000 = <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp50.000</span> (di bawah cap Rp100.000) ← terbesar</p>
                    <p>B: 5% × 200.000 = <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp10.000</span> (di bawah cap Rp200.000)</p>
                    <p>D: 40% × 200.000 = 80.000 → dibatasi cap <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp20.000</span></p>
                    <p className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>→ Voucher A (Rp50.000) lebih besar dari B (Rp10.000). SALAH ✗</p>
                  </div></S>
                  <S n={5}><p className="font-bold">Pernyataan 3 — Rp2.500.000 → Voucher A?</p></S>
                  <S n={6}><div className={`text-xs space-y-0.5 pl-1 ${isDark ? "text-white/80" : "text-gray-700"}`}>
                    <p>A: 25% × 2.500.000 = 625.000 → dibatasi cap <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp100.000</span></p>
                    <p>B: 5% × 2.500.000 = 125.000 → di bawah cap Rp200.000 → <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp125.000</span> ← terbesar</p>
                    <p>D: 40% × 2.500.000 = 1.000.000 → dibatasi cap <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp20.000</span></p>
                    <p className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>→ Voucher B (Rp125.000) lebih besar dari A (Rp100.000). SALAH ✗</p>
                  </div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 4 ══════════════ */}
          <Soal n={4} elemen="Bilangan" subelemen="Bilangan Real">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/90" : "text-gray-800"}`}>
              Buah merupakan salah satu sumber vitamin C. Untuk mengetahui kandungan vitamin C,
              tim peneliti akan menguji kandungan vitamin C dari keempat buah berikut.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className={isDark ? "bg-white/10" : "bg-gray-100"}>
                    <th className={`border px-3 py-2 text-left ${isDark ? "border-white/20 text-white" : "border-gray-300 text-gray-700"}`}>Buah</th>
                    <th className={`border px-3 py-2 text-center ${isDark ? "border-white/20 text-white" : "border-gray-300 text-gray-700"}`}>Berat (gr)</th>
                    <th className={`border px-3 py-2 text-center ${isDark ? "border-white/20 text-white" : "border-gray-300 text-gray-700"}`}>Kandungan Air (mL)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { buah: "Buah A", berat: "118,4", air: "96,3" },
                    { buah: "Buah B", berat: "130,7", air: "150" },
                    { buah: "Buah C", berat: "130,55", air: "140" },
                    { buah: "Buah D", berat: "96,255", air: "118,15" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? (isDark ? "bg-white/3" : "bg-gray-50") : ""}>
                      <td className={`border px-3 py-2 font-semibold ${isDark ? "border-white/10 text-white/80" : "border-gray-200 text-gray-700"}`}>{row.buah}</td>
                      <td className={`border px-3 py-2 text-center ${isDark ? "border-white/10 text-white/70" : "border-gray-200 text-gray-600"}`}>{row.berat}</td>
                      <td className={`border px-3 py-2 text-center ${isDark ? "border-white/10 text-white/70" : "border-gray-200 text-gray-600"}`}>{row.air}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Karena keterbatasan waktu pengujian, pada hari pertama hanya satu buah yang akan diteliti.
              Buah yang akan diteliti pertama adalah buah yang memiliki{" "}
              <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>berat terbesar</span> dan{" "}
              <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>kandungan air paling banyak</span>.
              Buah yang akan diteliti pertama adalah ....
            </p>
            <MCQ qn={4} correct={1} options={["A. Buah A", "B. Buah B", "C. Buah C", "D. Buah D"]} />
            <PembahasanBtn n={4} />
            {expandedPembahasan.has(4) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>B. Buah B</PBJawaban>
                <PBKonsep>
                  <p>Membandingkan bilangan desimal: bandingkan dari kiri ke kanan digit per digit</p>
                  <p>130,7 vs 130,55 → digit desimal pertama: 7 &gt; 5 → 130,7 lebih besar</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Untuk kriteria AND (keduanya harus terpenuhi), cari buah yang unggul di KEDUA kategori sekaligus</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Urutkan berat (terbesar ke terkecil):</p></S>
                  <div className={`ml-7 p-2 rounded-lg text-xs font-mono ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    B(130,7) &gt; C(130,55) &gt; A(118,4) &gt; D(96,255)
                  </div>
                  <S n={2}><p>Urutkan kandungan air (terbanyak ke tersedikit):</p></S>
                  <div className={`ml-7 p-2 rounded-lg text-xs font-mono ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    B(150) &gt; C(140) &gt; D(118,15) &gt; A(96,3)
                  </div>
                  <S n={3}><p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Buah B: peringkat 1 berat DAN peringkat 1 kandungan air → Buah B ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 5 ══════════════ */}
          <Soal n={5} elemen="Bilangan" subelemen="Bilangan Real">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/90" : "text-gray-800"}`}>
              Pada beberapa jenis makanan, suhu penyimpanan yang terlalu tinggi dapat menyebabkan
              makanan tersebut menjadi cepat basi. Gambar di bawah ini menunjukkan berbagai suhu
              penyimpanan makanan di dalam lemari pendingin menurut Departemen Pertanian Amerika
              Serikat (FDA).
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal5.png" alt="Tabel suhu penyimpanan FDA soal 5" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <div className={`border rounded-lg px-3 py-2 mb-3 text-xs font-body ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
              <p><span className={`font-semibold ${isDark ? "text-white/80" : "text-gray-700"}`}>Catatan:</span> daging unggas adalah daging yang berasal dari burung ternak seperti ayam, merpati dan sebagainya. Daging merah adalah daging yang berasal dari mamalia ternak seperti sapi, kambing dan sebagainya.</p>
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Berdasarkan saran FDA, berapa suhu lemari pendingin yang direkomendasikan untuk menyimpan daging ayam?
            </p>
            <MCQ qn={5} correct={2} cols={1} options={[
              "A. 18 derajat di bawah 0 °C",
              "B. 18 derajat di atas 0 °C",
              "C. 19 derajat di bawah 0 °C",
              "D. 19 derajat di atas 0 °C",
            ]} />
            <PembahasanBtn n={5} />
            {expandedPembahasan.has(5) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>C. 19 derajat di bawah 0 °C</PBJawaban>
                <PBKonsep>
                  <p>Daging ayam termasuk <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>daging unggas</span>. Baca suhu penyimpanan daging unggas langsung dari tabel FDA pada gambar.</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Suhu di bawah 0°C berarti negatif — "19 derajat di bawah 0°C" = −19°C.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Daging ayam = daging unggas (poultry)</p></S>
                  <S n={2}><p>Dari tabel FDA: suhu penyimpanan daging unggas = <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>−19°C</span></p></S>
                  <S n={3}><p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>−19°C = 19 derajat di BAWAH 0°C → Jawaban C ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 6 ══════════════ */}
          <Soal n={6} elemen="Aljabar" subelemen="Bentuk Aljabar">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/90" : "text-gray-800"}`}>
              Diketahui bentuk aljabar berikut ini.
            </p>
            <div className="my-3 flex justify-center">
              <BlockMath math="2ab - b^2 + 3a^2b + ab^2 - 5" />
            </div>
            <p className={`font-body text-sm mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Tentukan <span className={`font-bold ${isDark ? "text-green-300" : "text-green-600"}`}>Benar</span> atau{" "}
              <span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>Salah</span> pada setiap pernyataan berikut terkait bentuk aljabar tersebut!
            </p>
            <TrueFalseTable qn={6} rows={[
              { key: "a", text: "Terdapat 2 variabel yaitu a dan b.", correct: "benar" },
              { key: "b", text: "Konstanta pada bentuk aljabar tersebut adalah 5.", correct: "salah" },
              { key: "c", text: <span>Bilangan 2, −1, 3, dan 1 merupakan koefisien.</span>, correct: "benar" },
            ]} />
            <PembahasanBtn n={6} />
            {expandedPembahasan.has(6) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Benar / Salah / Benar</PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Variabel</span>: huruf/simbol yang nilainya bisa berubah (a, b)</p>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Koefisien</span>: angka yang mengalikan variabel dalam satu suku</p>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Konstanta</span>: suku yang tidak mengandung variabel, TERMASUK tanda minusnya</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Konstanta −5 berarti nilainya negatif lima, bukan 5!</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Identifikasi suku-suku: <InlineMath math="2ab,\; -b^2,\; 3a^2b,\; ab^2,\; -5" /></p></S>
                  <S n={2}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>① BENAR</span> — Variabel yang muncul: a dan b → 2 variabel ✓</p></S>
                  <S n={3}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>② SALAH</span> — Konstanta = <InlineMath math="-5" /> (tanda negatif bagian dari nilai), bukan 5 ✗</p></S>
                  <S n={4}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>③ BENAR</span> — Koefisien: <InlineMath math="ab" />→2, <InlineMath math="b^2" />→−1, <InlineMath math="a^2b" />→3, <InlineMath math="ab^2" />→1 ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 7 ══════════════ */}
          <Soal n={7} elemen="Aljabar" subelemen="Fungsi">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/90" : "text-gray-800"}`}>
              Perhatikan diagram panah berikut ini.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal7.png" alt="Tiga diagram panah soal 7" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Apakah diagram 1, diagram 2, dan diagram 3 merupakan fungsi?
              Tentukan <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Fungsi</span> atau{" "}
              <span className={`font-bold ${isDark ? "text-orange-300" : "text-orange-500"}`}>Bukan Fungsi</span> pada setiap diagram berikut!
            </p>
            <CategoryTable
              qn={7}
              colA="Fungsi"
              colB="Bukan Fungsi"
              rows={[
                { key: "d1", text: "Diagram 1" },
                { key: "d2", text: "Diagram 2" },
                { key: "d3", text: "Diagram 3" },
              ]}
              correctKey={{ d1: "Bukan Fungsi", d2: "Bukan Fungsi", d3: "Fungsi" }}
            />
            <PembahasanBtn n={7} />
            {expandedPembahasan.has(7) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Diagram 1: Bukan Fungsi · Diagram 2: Bukan Fungsi · Diagram 3: Fungsi</PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Fungsi</span>: setiap anggota domain dipetakan ke <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>tepat SATU</span> anggota kodomain</p>
                  <p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>Bukan Fungsi</span>: ada domain yang <span className="font-bold">tidak dipetakan sama sekali</span>, atau dipetakan ke <span className="font-bold">lebih dari satu</span> kodomain</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Cek dua syarat — setiap domain harus punya panah, dan panah harus tepat satu.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>Diagram 1 — Bukan Fungsi:</span> anggota domain <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>9</span> tidak memiliki pasangan/panah → ada domain yang tidak terpetakan ✗</p></S>
                  <S n={2}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>Diagram 2 — Bukan Fungsi:</span> anggota domain <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>13</span> memiliki 2 pasangan/panah → satu domain dipetakan ke lebih dari satu kodomain ✗</p></S>
                  <S n={3}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Diagram 3 — Fungsi:</span> setiap anggota domain memiliki tepat satu panah ke kodomain ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 8 ══════════════ */}
          <Soal n={8} elemen="Aljabar" subelemen="Fungsi">
            <p className={`font-body text-sm leading-relaxed mb-2 ${isDark ? "text-white/90" : "text-gray-800"}`}>
              Pembayaran air PDAM setiap rumah berbeda-beda tergantung banyaknya pemakaian air.
              Biaya pemasangan awal adalah{" "}
              <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp800.000,00</span>.
              Tarif pemakaian air berdasarkan banyak air yang digunakan dengan pemasangan awal
              dapat dilihat pada grafik berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal8.png" alt="Grafik tarif pemakaian air PDAM soal 8" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Seseorang menghabiskan biaya{" "}
              <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Rp920.000,00</span> dalam 1 bulan
              pemakaian dengan pemasangan baru.
            </p>
            <p className={`font-body text-sm mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Tentukan <span className={`font-bold ${isDark ? "text-green-300" : "text-green-600"}`}>Benar</span> atau{" "}
              <span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>Salah</span> pada setiap pernyataan berikut!
            </p>
            <TrueFalseTable qn={8} rows={[
              { key: "a", text: <span>Jumlah pemakaian air mencapai 60 m³.</span>, correct: "benar" },
              { key: "b", text: <span>Orang tersebut akan menghabiskan biaya sebesar Rp120.000,00 jika tanpa pemasangan baru.</span>, correct: "benar" },
              { key: "c", text: <span>Tarif dapat mencapai 1 juta jika pemakaian air kurang dari 90 m³ dengan pemasangan baru.</span>, correct: "salah" },
            ]} />
            <PembahasanBtn n={8} />
            {expandedPembahasan.has(8) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Benar / Benar / Salah</PBJawaban>
                <PBKonsep>
                  <p>Dari grafik, tarif PDAM mengikuti fungsi linear:</p>
                  <div className="my-1"><BlockMath math="T(x) = 800.000 + 2.000x" /></div>
                  <p>dengan <em>x</em> = banyak air (m³). Saat x = 0 → Rp800.000; setiap 10 m³ tambah Rp20.000 → kenaikan Rp2.000/m³.</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Gradien grafik = selisih tarif ÷ selisih volume = (820.000 − 800.000) ÷ 10 = 2.000/m³</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Tentukan pemakaian air dari total tagihan Rp920.000:</p></S>
                  <div className="ml-7"><BlockMath math="920.000 = 800.000 + 2.000x \Rightarrow 2.000x = 120.000 \Rightarrow x = 60 \text{ m}^3" /></div>
                  <S n={2}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>① BENAR</span> — Pemakaian air = 60 m³ ✓</p></S>
                  <S n={3}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>② BENAR</span> — Biaya air tanpa pemasangan = 2.000 × 60 = Rp120.000 ✓</p></S>
                  <S n={4}><p>Cek pernyataan ③: berapa m³ agar tarif = Rp1.000.000?</p></S>
                  <div className="ml-7"><BlockMath math="1.000.000 = 800.000 + 2.000x \Rightarrow x = \frac{200.000}{2.000} = 100 \text{ m}^3" /></div>
                  <S n={5}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>③ SALAH</span> — Dibutuhkan 100 m³ untuk mencapai Rp1.000.000, bukan kurang dari 90 m³ ✗</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 9 ══════════════ */}
          <Soal n={9} elemen="Aljabar" subelemen="Fungsi">
            <p className={`font-body text-sm font-bold mb-2 ${isDark ? "text-amber-300" : "text-amber-600"}`}>Pekarangan Rumah</p>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Ayunda mulai memanfaatkan lahan kosong di pekarangan rumahnya untuk menanam berbagai
              jenis tanaman. Setelah melihat tanamannya tumbuh subur, ia berencana untuk menanam
              pohon mangga di pekarangan tersebut. Berikut adalah peta pekarangan rumah Ayunda.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal9.png" alt="Peta pekarangan koordinat kartesius soal 9" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Dalam menentukan lokasi penanaman, Ayunda harus mempertimbangkan beberapa faktor
              penting yaitu ketersediaan sinar matahari dan kualitas tanah. Berdasarkan beberapa
              faktor tersebut, Ayunda hanya akan menanam pohon mangga di{" "}
              <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>lokasi 1, 3, dan 4</span> hanya pada
              lahan yang masih kosong (belum ada tanaman lain) di lokasi tersebut.
            </p>
            <p className={`font-body text-sm mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Tentukan <span className={`font-bold ${isDark ? "text-green-300" : "text-green-600"}`}>"Bisa ditanami pohon mangga"</span> atau{" "}
              <span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>"Tidak bisa ditanami pohon mangga"</span> untuk koordinat berikut!
            </p>
            <CategoryTable
              qn={9}
              colA="Bisa ditanami"
              colB="Tidak bisa"
              rows={[
                { key: "c1", text: <span>Koordinat (9, −2)</span> },
                { key: "c2", text: <span>Koordinat (−2, 9)</span> },
                { key: "c3", text: <span>Koordinat (−9, −9)</span> },
              ]}
              correctKey={{ c1: "Bisa ditanami", c2: "Tidak bisa", c3: "Bisa ditanami" }}
            />
            <PembahasanBtn n={9} />
            {expandedPembahasan.has(9) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>(9,−2): Bisa · (−2,9): Tidak bisa · (−9,−9): Bisa</PBJawaban>
                <PBKonsep>
                  <p>Dari peta, setiap lokasi sesuai dengan kuadran koordinat Kartesius:</p>
                  <div className={`grid grid-cols-2 gap-1 my-1 text-[11px] font-mono ${isDark ? "" : "text-gray-700"}`}>
                    <div className={`p-1 rounded ${isDark ? "bg-orange-900/40" : "bg-orange-100"}`}>Lokasi 1 = Kuadran I: (+,+)</div>
                    <div className={`p-1 rounded ${isDark ? "bg-yellow-900/40" : "bg-yellow-100"}`}>Lokasi 2 = Kuadran II: (−,+)</div>
                    <div className={`p-1 rounded ${isDark ? "bg-green-900/40" : "bg-green-100"}`}>Lokasi 3 = Kuadran III: (−,−)</div>
                    <div className={`p-1 rounded ${isDark ? "bg-cyan-900/40" : "bg-cyan-100"}`}>Lokasi 4 = Kuadran IV: (+,−)</div>
                  </div>
                  <p>Ayunda menanam di <strong>Lokasi 1, 3, dan 4</strong> = Kuadran I, III, dan IV (lahan kosong).</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Lihat tanda (x,y) → tentukan kuadran → cocokkan dengan lokasi 1, 3, atau 4</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p><span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>(9,−2)</span>: x&gt;0, y&lt;0 → Kuadran IV = <strong>Lokasi 4</strong> ✓, lahan kosong → <span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Bisa ditanami ✓</span></p></S>
                  <S n={2}><p><span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>(−2,9)</span>: x&lt;0, y&gt;0 → Kuadran II = <strong>Lokasi 2</strong> ✗, bukan lokasi 1/3/4 → <span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>Tidak bisa ✗</span></p></S>
                  <S n={3}><p><span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>(−9,−9)</span>: x&lt;0, y&lt;0 → Kuadran III = <strong>Lokasi 3</strong> ✓, lahan kosong → <span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Bisa ditanami ✓</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 10 ══════════════ */}
          <Soal n={10} elemen="Aljabar" subelemen="Persamaan dan Pertidaksamaan Linear">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/90" : "text-gray-800"}`}>
              Diketahui pertidaksamaan sebagai berikut.
            </p>
            <div className="my-3 flex justify-center">
              <BlockMath math="3x + 17 \leq 7 - 2x" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Manakah garis bilangan yang menunjukkan himpunan penyelesaian dari pertidaksamaan tersebut?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["A","B","C","D"] as const).map((opt, i) => (
                <div
                  key={i}
                  className={`border rounded-lg p-2 text-xs font-body transition-all flex flex-col items-center gap-1 cursor-pointer
                    ${selectedAnswers[10] === i
                      ? i === 0
                        ? isDark ? "bg-green-900/30 border-green-500/50" : "bg-green-50 border-green-400"
                        : isDark ? "bg-red-900/30 border-red-500/50" : "bg-red-50 border-red-400"
                      : isDark ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/40 active:scale-95" : "bg-gray-50 border-gray-300 hover:bg-amber-50 hover:border-amber-400 active:scale-95"
                    }
                    ${selectedAnswers[10] !== undefined && i === 0 ? (isDark ? "bg-green-900/30 border-green-500/50" : "bg-green-50 border-green-400") : ""}
                  `}
                  onClick={() => selectAnswer(10, i)}
                >
                  <img
                    src={`/tka-2025-soal10${opt.toLowerCase()}.png`}
                    alt={`Pilihan ${opt} soal 10`}
                    className="w-full rounded"
                  />
                  <div className="flex items-center justify-between w-full px-1">
                    <span className={`font-bold ${selectedAnswers[10] === i ? (i === 0 ? (isDark ? "text-green-300" : "text-green-600") : (isDark ? "text-red-300" : "text-red-600")) : (isDark ? "text-white/70" : "text-gray-600")}`}>{opt}.</span>
                    {selectedAnswers[10] !== undefined && i === 0 && <span className={`font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>✓</span>}
                    {selectedAnswers[10] === i && i !== 0 && <span className={`font-bold ${isDark ? "text-red-400" : "text-red-500"}`}>✗</span>}
                  </div>
                </div>
              ))}
            </div>
            <PembahasanBtn n={10} />
            {expandedPembahasan.has(10) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>A — garis bilangan dengan <InlineMath math="x \leq -2" /> (lingkaran tertutup di −2, arsiran ke kiri)</PBJawaban>
                <PBKonsep>
                  <p>Pertidaksamaan linear: perlakukan seperti persamaan (kumpulkan variabel di satu sisi)</p>
                  <p className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>⚠️ Aturan penting:</p>
                  <p>Jika <span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>×/÷ bilangan negatif</span>, tanda &lt;/&gt; harus dibalik!</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Pindahkan semua variabel ke kiri dan konstanta ke kanan dengan mengubah tanda</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><div><BlockMath math="3x + 17 \leq 7 - 2x" /></div></S>
                  <S n={2}><p>Pindahkan <InlineMath math="2x" /> ke kiri, <InlineMath math="17" /> ke kanan:</p></S>
                  <div className="ml-7"><BlockMath math="3x + 2x \leq 7 - 17" /></div>
                  <S n={3}><div><BlockMath math="5x \leq -10" /></div></S>
                  <S n={4}><p>Bagi kedua sisi dengan 5 (positif, tanda tidak berubah):</p></S>
                  <div className="ml-7"><BlockMath math="x \leq -2" /></div>
                  <S n={5}><p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Garis bilangan: ● tertutup di −2, arsiran ke kiri (−∞) → Jawaban A ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

        </div>

          {/* ══════════════ SOAL 11 ══════════════ */}
          <Soal n={11} elemen="Aljabar" subelemen="Persamaan dan Pertidaksamaan Linear">
            <p className={`font-body text-sm font-bold mb-2 ${isDark ? "text-white/90" : "text-gray-800"}`}>Jajanan Tradisional</p>
            <p className={`font-body text-sm leading-relaxed mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Jajanan tradisional merupakan makanan khas dari nenek moyang dan biasanya digunakan untuk acara atau tradisi. Seiring berjalannya waktu, jajanan tradisional bisa dijumpai dan ditemukan setiap hari tidak hanya saat acara tertentu.
            </p>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Berikut merupakan harga jajanan tradisional kue putu mayang dan kue pancong yang dijual di sebuah bazar makanan.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal11.png" alt="Gambar kue putu mayang dan kue pancong soal 11" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Berapa harga <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>3 kotak kue putu mayang</span> dan <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>1 kotak kue pancong</span>?
            </p>
            <MCQ qn={11} correct={2} options={[
              "A. Rp10.000,00",
              "B. Rp14.000,00",
              "C. Rp44.000,00",
              "D. Rp52.000,00",
            ]} />
            <PembahasanBtn n={11} />
            {expandedPembahasan.has(11) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>C. Rp44.000,00</PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>SPLDV</span> (Sistem Persamaan Linear Dua Variabel)</p>
                  <p>Metode Eliminasi: kalikan persamaan agar koefisien salah satu variabel sama, lalu kurangkan</p>
                  <p>Metode Substitusi: cari satu variabel dari salah satu persamaan, substitusikan ke yang lain</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Eliminasi lebih cepat jika koefisien variabel sudah dekat/mudah dikali</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Misalkan: p = harga putu mayang, c = harga pancong (per kotak)</p></S>
                  <S n={2}><div><BlockMath math="3p + 2c = 58.000 \quad\cdots(1)" /></div></S>
                  <S n={3}><div><BlockMath math="2p + 3c = 62.000 \quad\cdots(2)" /></div></S>
                  <S n={4}><p>Eliminasi variabel p — (1)×2 − (2)×3:</p></S>
                  <div className="ml-7"><BlockMath math="6p + 4c - 6p - 9c = 116.000 - 186.000" /></div>
                  <div className="ml-7"><BlockMath math="-5c = -70.000 \Rightarrow c = 14.000" /></div>
                  <S n={5}><p>Substitusi c ke (1): <InlineMath math="3p + 28.000 = 58.000 \Rightarrow p = 10.000" /></p></S>
                  <S n={6}><p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>3p + c = 3×10.000 + 14.000 = 30.000 + 14.000 = <span className="underline">Rp44.000</span> ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 12 ══════════════ */}
          <Soal n={12} elemen="Aljabar" subelemen="Bentuk Aljabar">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Rino, Tiko, dan Bayu pergi ke toko buku untuk membeli buku tulis dan pulpen. Keterangan pembelian:
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal12.png" alt="Keterangan pembelian buku soal 12" className="max-w-full rounded-lg border border-white/10" />
            </div>

            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Jika harga 1 buku = <InlineMath math="x" /> dan 1 pulpen = <InlineMath math="y" />, bagaimana kalimat matematika total harga ketiganya?
            </p>
            <MCQ qn={12} correct={0} options={[
              "A. 24x + 18y",
              "B. 20x + 15y",
              "C. 12x + 9y",
              "D. 4x + 3y",
            ]} />
            <PembahasanBtn n={12} />
            {expandedPembahasan.has(12) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>A. 24x + 18y</PBJawaban>
                <PBKonsep>
                  <p>Penjumlahan bentuk aljabar: kumpulkan <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>suku sejenis</span> (sama variabelnya)</p>
                  <p>Faktor pengali: Rino (1×), Tiko (2×), Bayu (3×)</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Total pengali = 1+2+3 = 6. Kalikan masing-masing jumlah Rino dengan 6</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Rino: <InlineMath math="4x + 3y" /></p></S>
                  <S n={2}><p>Tiko (2×): <InlineMath math="8x + 6y" /></p></S>
                  <S n={3}><p>Bayu (3×): <InlineMath math="12x + 9y" /></p></S>
                  <S n={4}><p>Total buku: <InlineMath math="4+8+12 = 24" /></p></S>
                  <S n={5}><p>Total pulpen: <InlineMath math="3+6+9 = 18" /></p></S>
                  <S n={6}><div><BlockMath math="\text{Total} = 24x + 18y \checkmark" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 13 ══════════════ */}
          <Soal n={13} elemen="Aljabar" subelemen="Fungsi">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Naura menggunakan operator seluler "Nusantara Mobile". Naura menuliskan pilihan paket kuota dan harganya dalam bentuk himpunan pasangan berurutan:
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal13.png" alt="Paket kuota Nusantara Mobile soal 13" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Jika <InlineMath math="x" /> adalah paket kuota dalam GB, rumus fungsi <InlineMath math="f(x)" /> yang menyatakan harga paket kuota adalah …
            </p>
            <MCQ qn={13} correct={3} cols={1} options={[
              "A.  f(x) = 2.000x + 4.000",
              "B.  f(x) = 2.000x + 1.000",
              "C.  f(x) = 1.800x + 9.000",
              "D.  f(x) = 1.800x + 5.000",
            ]} />
            <PembahasanBtn n={13} />
            {expandedPembahasan.has(13) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>D. f(x) = 1.800x + 5.000</PBJawaban>
                <PBKonsep>
                  <p>Fungsi linear: <InlineMath math="f(x) = mx + c" /></p>
                  <p>Gradien (m): <InlineMath math="m = \dfrac{y_2 - y_1}{x_2 - x_1}" /> (kenaikan per unit)</p>
                  <p>Konstanta (c): nilai saat x = 0, dicari dengan substitusi salah satu titik</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Gunakan 2 titik terdekat untuk mengurangi kesalahan hitung. Verifikasi dengan titik ketiga!</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Ambil 2 titik: <InlineMath math="(5, 14.000)" /> dan <InlineMath math="(10, 23.000)" /></p></S>
                  <S n={2}><p>Hitung gradien:</p></S>
                  <div className="ml-7"><BlockMath math="m = \frac{23.000 - 14.000}{10 - 5} = \frac{9.000}{5} = 1.800" /></div>
                  <S n={3}><p>Cari konstanta c dari titik (5, 14.000):</p></S>
                  <div className="ml-7"><BlockMath math="14.000 = 1.800(5) + c \Rightarrow c = 14.000 - 9.000 = 5.000" /></div>
                  <S n={4}><p>Verifikasi: f(20) = 1800(20)+5000 = 41.000 ✓, f(25) = 50.000 ✓</p></S>
                  <S n={5}><p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>f(x) = 1.800x + 5.000 ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ BACAAN 2 (Soal 14 & 15) ══════════════ */}
          <div className={`rounded-xl border p-4 mb-4 ${isDark ? "border-blue-500/30 bg-blue-950/20" : "bg-blue-50 border-blue-200"}`}>
            <p className={`font-display font-bold text-xs mb-2 ${isDark ? "text-blue-300" : "text-blue-600"}`}>📖 BACAAN 2 — untuk menjawab Soal Nomor 14 dan 15</p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-bacaan2.png" alt="Bacaan 2 pola batu bata" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Suatu kompleks X memiliki kebiasaan membuat pagar rumah dengan desain yang unik. Hampir seluruh warga kompleks X menyusun pagar membentuk pola barisan. Desain pagar rumah tersebut disusun menggunakan <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>2 jenis batu bata</span>, yang jika dilihat dari depan batu bata tersebut terlihat berbentuk segitiga dan persegi panjang. Batu bata tersebut disusun membentuk pola seperti gambar di bawah.
            </p>
          </div>

          {/* ══════════════ SOAL 14 ══════════════ */}
          <Soal n={14} elemen="Aljabar" subelemen="Barisan dan Deret">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              <span className={`italic ${isDark ? "text-amber-300" : "text-amber-500"}`}>(Perhatikan Bacaan 2)</span><br />
              Jika ingin dibuat pagar dengan <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>10 tingkat</span> susunan batu bata, berapakah jumlah total batu bata (segitiga maupun persegi panjang) yang ada pada <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>tingkat ke-10</span> dari pagar tersebut?
            </p>
            <MCQ qn={14} correct={3} options={[
              "A. 10 batu bata",
              "B. 11 batu bata",
              "C. 20 batu bata",
              "D. 21 batu bata",
            ]} />
            <PembahasanBtn n={14} />
            {expandedPembahasan.has(14) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>D. 21 batu bata</PBJawaban>
                <PBKonsep>
                  <p>Barisan pola: identifikasi pola pada beberapa suku pertama untuk menemukan rumus umum <InlineMath math="U_n" /></p>
                  <p>Di tingkat ke-n: terdapat <InlineMath math="n" /> segitiga dan <InlineMath math="(n+1)" /> persegi panjang</p>
                  <div className="my-1"><BlockMath math="U_n = n + (n+1) = 2n + 1" /></div>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Cek pola: n=1→3, n=2→5, n=3→7. Beda = 2, ini barisan aritmatika dengan rumus 2n+1</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Identifikasi pola di setiap tingkat:</p></S>
                  <div className={`ml-7 text-xs p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    <p>Tingkat 1: 1 segitiga + 2 persegi = 3 batu bata</p>
                    <p>Tingkat 2: 2 segitiga + 3 persegi = 5 batu bata</p>
                    <p>Tingkat 3: 3 segitiga + 4 persegi = 7 batu bata</p>
                  </div>
                  <S n={2}><p>Rumus: <InlineMath math="U_n = 2n + 1" /></p></S>
                  <S n={3}><div><BlockMath math="U_{10} = 2(10) + 1 = 20 + 1 = 21 \text{ batu bata} \checkmark" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 15 ══════════════ */}
          <Soal n={15} elemen="Aljabar" subelemen="Barisan dan Deret">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              <span className={`italic ${isDark ? "text-amber-300" : "text-amber-500"}`}>(Perhatikan Bacaan 2)</span><br />
              Dua pagar yang sama persis dengan masing-masing memiliki <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>9 tingkat</span> akan dibangun. Tetapi hanya ada persediaan sebanyak <span className={`font-bold ${isDark ? "text-green-300" : "text-green-600"}`}>60 batu bata segitiga</span> dan <span className={`font-bold ${isDark ? "text-purple-300" : "text-purple-600"}`}>80 batu bata persegi panjang</span>. Apakah jumlah kedua jenis batu bata tersebut cukup untuk membuat kedua pagar?
            </p>
            <TrueFalseTable qn={15} rows={[
              { key: "a", text: <span>Diperlukan tambahan <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>15</span> batu bata segitiga.</span>, correct: "salah" },
              { key: "b", text: <span>Diperlukan tambahan <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>28</span> batu bata persegi panjang.</span>, correct: "benar" },
              { key: "c", text: <span>Diperlukan tambahan total sebanyak <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>43</span> batu bata baik segitiga maupun persegi panjang.</span>, correct: "salah" },
            ]} />
            <PembahasanBtn n={15} />
            {expandedPembahasan.has(15) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Salah / Benar / Salah</PBJawaban>
                <PBKonsep>
                  <p>Jumlah deret aritmatika: <InlineMath math="S_n = \dfrac{n(a + U_n)}{2}" /></p>
                  <p>Segitiga di pagar 9 tingkat: jumlah dari tingkat 1 s/d 9 = <InlineMath math="1+2+3+\cdots+9" /></p>
                  <p>Persegi panjang: jumlah dari <InlineMath math="2+3+4+\cdots+10" /> (tingkat ke-n ada n+1 persegi)</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: <InlineMath math="\sum_{k=1}^{9} k = \frac{9 \times 10}{2} = 45" /></p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Segitiga per pagar (9 tingkat):</p></S>
                  <div className="ml-7"><BlockMath math="1+2+\cdots+9 = \frac{9 \times 10}{2} = 45 \text{ segitiga}" /></div>
                  <S n={2}><p>Segitiga untuk 2 pagar: <InlineMath math="2 \times 45 = 90" />. Kurang: <span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>90 − 60 = 30</span> (bukan 15 → <strong>Salah</strong>)</p></S>
                  <S n={3}><p>Persegi panjang per pagar:</p></S>
                  <div className="ml-7"><BlockMath math="2+3+\cdots+10 = \frac{9(2+10)}{2} = 54 \text{ persegi}" /></div>
                  <S n={4}><p>Persegi untuk 2 pagar: <InlineMath math="2 \times 54 = 108" />. Kurang: <span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>108 − 80 = 28</span> ✓ (<strong>Benar</strong>)</p></S>
                  <S n={5}><p>Total kurang: <InlineMath math="30 + 28 = 58" /> (bukan 43 → <span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>Salah</span>)</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 16 ══════════════ */}
          <Soal n={16} elemen="Geometri dan Pengukuran" subelemen="Objek Geometri">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Garis AB dan garis PQ berpotongan di titik Q. Sudut yang terbentuk:
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal16.png" alt="Garis AB dan PQ berpotongan soal 16" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>Nilai <InlineMath math="x" /> yang tepat adalah …</p>
            <MCQ qn={16} correct={1} options={[
              "A. 15°",
              "B. 24°",
              "C. 69°",
              "D. 96°",
            ]} />
            <PembahasanBtn n={16} />
            {expandedPembahasan.has(16) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>B. x = 24°</PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Sudut berpelurus</span>: dua sudut yang membentuk garis lurus → jumlahnya 180°</p>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Sudut bertolak belakang</span>: dua sudut yang saling berhadapan di titik potong → sama besar</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Identifikasi hubungan sudut (berpelurus/bertolak belakang) sebelum membuat persamaan</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Sudut 72° dan (4x+12)° berpelurus (membentuk garis lurus AB)</p></S>
                  <S n={2}><div><BlockMath math="72° + (4x + 12)° = 180°" /></div></S>
                  <S n={3}><div><BlockMath math="4x + 84 = 180 \Rightarrow 4x = 96" /></div></S>
                  <S n={4}><div><BlockMath math="x = \frac{96}{4} = 24°\checkmark" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 17 ══════════════ */}
          <Soal n={17} elemen="Geometri dan Pengukuran" subelemen="Objek Geometri">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Perhatikan gambar jaring-jaring prisma segitiga berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal17.png" alt="Jaring-jaring prisma segitiga soal 17" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Sisi tutup pada prisma adalah <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>sisi ABC</span>. Rusuk <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>AC</span> pada sisi tutup akan berhimpit dengan salah satu rusuk pada sisi tegak prisma nomor …
            </p>
            <MCQ qn={17} correct={1} options={["A. 1", "B. 2", "C. 3", "D. 4"]} />
            <PembahasanBtn n={17} />
            {expandedPembahasan.has(17) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>B. Sisi tegak nomor 2</PBJawaban>
                <PBKonsep>
                  <p>Saat jaring-jaring dilipat menjadi bangun ruang:</p>
                  <p>• Rusuk pada sisi tutup berhimpit dengan rusuk pada sisi tegak yang <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>bersebelahan langsung</span> di jaring-jaring</p>
                  <p>• Sisi tutup ABC: rusuk AB, BC, CA masing-masing bertemu dengan sisi tegak berbeda</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Bayangkan lipat jaring-jaring secara bertahap dari sisi tutup ke sisi tegak</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Perhatikan posisi sisi tegak di jaring-jaring: nomor 1, 2, 3 mengelilingi sisi alas</p></S>
                  <S n={2}><p>Sisi tutup ABC diletakkan di atas. Rusuk AC pada sisi tutup bersebelahan dengan sisi tegak nomor 2 dalam jaring-jaring</p></S>
                  <S n={3}><p>Saat dilipat: sisi tegak 2 terangkat → rusuknya bertemu dengan rusuk AC pada sisi tutup</p></S>
                  <S n={4}><p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Rusuk AC berhimpit dengan rusuk pada sisi tegak nomor 2 ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 18 ══════════════ */}
          <Soal n={18} elemen="Geometri dan Pengukuran" subelemen="Objek Geometri">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Perhatikan gambar dua garis sejajar <InlineMath math="p \parallel q" /> yang dipotong transversal berikut ini.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal18.png" alt="Dua garis sejajar p dan q dipotong transversal soal 18" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>Berdasarkan gambar tersebut, berapa nilai <InlineMath math="b" />?</p>
            <MCQ qn={18} correct={1} options={[
              "A. 46",
              "B. 68",
              "C. 112",
              "D. 134",
            ]} />
            <PembahasanBtn n={18} />
            {expandedPembahasan.has(18) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>B. b = 68°</PBJawaban>
                <PBKonsep>
                  <p>Sifat garis sejajar dipotong transversal:</p>
                  <p>• <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Sudut dalam berseberangan</span> (Z-angle / alternate interior): <span className={`font-bold`}>sama besar</span></p>
                  <p>• <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Sudut sehadap</span> (F-angle / corresponding): sama besar</p>
                  <p>• <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Sudut dalam sepihak</span> (co-interior): berpelurus (jumlah 180°)</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Bayangkan huruf Z, F, C di antara dua garis sejajar untuk identifikasi jenis sudut</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Diketahui <InlineMath math="p \parallel q" /> dipotong transversal</p></S>
                  <S n={2}><p>Sudut 68° pada garis p dan sudut b° pada garis q merupakan <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>sudut dalam berseberangan</span> (Z-angle)</p></S>
                  <S n={3}><div><BlockMath math="b = 68° \checkmark" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 19 ══════════════ */}
          <Soal n={19} elemen="Geometri dan Pengukuran" subelemen="Objek Geometri">
            <p className={`font-body text-sm font-bold mb-2 ${isDark ? "text-white/90" : "text-gray-800"}`}>Pagar Tangga</p>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Pak Anton baru saja membangun rumah. Ada beberapa bagian dalam rumahnya yang belum terpasang. Salah satunya adalah pagar tangga. Pagar tangga berfungsi untuk pegangan saat naik maupun turun tangga. Berikut adalah gambar tangga Pak Anton.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal19.png" alt="Gambar tangga Pak Anton soal 19" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Gambar garis putus-putus adalah rancangan pagar tangga. Setiap anak tangga memiliki tinggi yang sama yaitu <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>25 cm</span>. Tersedia 4 jenis bahan:
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-body">
              <div className={`border rounded-lg p-2 ${isDark ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-50 border-gray-200 text-gray-600"}`}>🪵 Kayu jati: <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>6 m</span></div>
              <div className={`border rounded-lg p-2 ${isDark ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-50 border-gray-200 text-gray-600"}`}>🪵 Kayu meranti: <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>4 m</span></div>
              <div className={`border rounded-lg p-2 ${isDark ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-50 border-gray-200 text-gray-600"}`}>⚙️ Besi: <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>5,5 m</span></div>
              <div className={`border rounded-lg p-2 ${isDark ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-50 border-gray-200 text-gray-600"}`}>🔩 Aluminium: <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>4,5 m</span></div>
            </div>
            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Jenis bahan apa yang harus dipilih Pak Anton agar <span className={`font-bold ${isDark ? "text-green-300" : "text-green-600"}`}>cukup</span> untuk membuat pagar tangga dan memiliki <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>sisa paling sedikit</span>?
            </p>
            <MCQ qn={19} correct={1} cols={1} options={[
              "A. Pagar kayu jati (6 m)",
              "B. Pagar kayu meranti (4 m)",
              "C. Pagar besi (5,5 m)",
              "D. Pagar aluminium (4,5 m)",
            ]} />
            <PembahasanBtn n={19} />
            {expandedPembahasan.has(19) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>B. Pagar kayu meranti (4 m)</PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Teorema Pythagoras</span>: pada segitiga siku-siku, <InlineMath math="c = \sqrt{a^2 + b^2}" /></p>
                  <p>Pagar tangga = diagonal dari sisi horizontal (alas) dan vertikal (tinggi)</p>
                  <p>Pilih bahan: <span className="font-bold">(1) panjang ≥ diagonal</span> DAN <span className="font-bold">(2) sisa sesedikit mungkin</span></p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Hitung diagonal dulu → eliminasi yang tidak cukup → ambil yang terpendek dari yang cukup</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Tangga 6 anak (dari gambar), tiap anak 25 cm:</p></S>
                  <S n={2}><p>Panjang horizontal (alas) = 6 × 25 = 150 cm, Tinggi vertikal = 6 × 25 = 150 cm</p></S>
                  <S n={3}><p>Hitung panjang pagar (diagonal):</p></S>
                  <div className="ml-7"><BlockMath math="\text{Pagar} = \sqrt{150^2 + 150^2} = 150\sqrt{2} \approx 212 \text{ cm} = 2{,}12 \text{ m}" /></div>
                  <S n={4}><p>Semua pilihan (4m, 4,5m, 5,5m, 6m) ≥ 2,12m → semua cukup</p></S>
                  <S n={5}><p>Sisa terkecil = panjang terpendek yang cukup: <span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>4m − 2,12m = 1,88m (paling kecil) → Kayu meranti ✓</span></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 20 ══════════════ */}
          <Soal n={20} elemen="Geometri dan Pengukuran" subelemen="Transformasi Geometri">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Perhatikan dua segitiga kongruen pada koordinat kartesius berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal20.png" alt="Koordinat kartesius segitiga PQR dan KLM soal 20" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Diketahui titik <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Q = titik K</span>. Segitiga PQR akan ditranslasikan oleh{" "}
              <InlineMath math="T = (-4, -2)" />. Bayangan segitiga PQR dan segitiga KLM akan saling …
            </p>
            <MCQ qn={20} correct={3} options={[
              "A. Tegak lurus",
              "B. Berpotongan",
              "C. Sejajar",
              "D. Berhimpit",
            ]} />
            <PembahasanBtn n={20} />
            {expandedPembahasan.has(20) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>D. Berhimpit</PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Translasi</span> T=(a,b): setiap titik (x,y) dipindah ke (x+a, y+b)</p>
                  <p>Dua bangun <span className={`font-bold`}>berhimpit</span> jika setiap titik yang bersesuaian berada di posisi yang tepat sama</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Jika Q=K dan translasi T memindahkan Q ke posisi L, serta PQR kongruen dengan KLM, maka P'Q'R' ≡ LKM ≡ KLM (berhimpit)</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Q = K berarti mereka berada di titik koordinat yang sama</p></S>
                  <S n={2}><p>Misalkan Q = K = (4, 2). Setelah translasi T=(-4,-2):</p></S>
                  <div className="ml-7"><BlockMath math="Q' = (4+(-4),\; 2+(-2)) = (0, 0)" /></div>
                  <S n={3}><p>Karena PQR dan KLM kongruen dan Q=K, translasi T=(-4,-2) memindahkan setiap titik PQR tepat ke posisi titik-titik KLM yang bersesuaian</p></S>
                  <S n={4}><p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Bayangan P'Q'R' menempati posisi yang sama persis dengan KLM → Berhimpit ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 21 ══════════════ */}
          <Soal n={21} elemen="Geometri dan Pengukuran" subelemen="Pengukuran">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Perhatikan gambar juring pada lingkaran di bawah ini.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal21.png" alt="Gambar juring lingkaran soal 21" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>Manakah pernyataan yang benar terkait luas juring A, B, dan C?</p>
            <MCQ qn={21} correct={0} cols={1} options={[
              "A. Luas juring B dua kali dari luas juring C.",
              "B. Luas juring C setengah dari luas juring A.",
              "C. Luas juring A tiga kali dari luas juring B.",
              "D. Luas juring B dua kali dari luas juring A.",
            ]} />
            <PembahasanBtn n={21} />
            {expandedPembahasan.has(21) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>A. Luas juring B = 2 × luas juring C</PBJawaban>
                <PBKonsep>
                  <p>Luas juring: <InlineMath math="L = \dfrac{\alpha}{360°} \times \pi r^2" /></p>
                  <p>Perbandingan luas juring = perbandingan sudut pusat (jika jari-jari sama)</p>
                  <div className="my-1"><BlockMath math="\frac{L_{\text{juring P}}}{L_{\text{juring Q}}} = \frac{\alpha_P}{\alpha_Q}" /></div>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Tidak perlu hitung luas sebenarnya! Langsung bandingkan sudut saja</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Dari gambar: sudut juring B = 70°, juring C = 35°, juring A = 360°−70°−35° = 255°</p></S>
                  <S n={2}><p>Cek pilihan A: <InlineMath math="\dfrac{L_B}{L_C} = \dfrac{70°}{35°} = 2" /> → Luas B = 2 × Luas C ✓</p></S>
                  <S n={3}><p>Cek pilihan B: <InlineMath math="\dfrac{L_C}{L_A} = \dfrac{35°}{255°} \neq \dfrac{1}{2}" /> ✗</p></S>
                  <S n={4}><p>Cek pilihan C: <InlineMath math="\dfrac{L_A}{L_B} = \dfrac{255°}{70°} \neq 3" /> ✗</p></S>
                  <S n={5}><p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Pilihan A benar: Luas juring B = 2 × Luas juring C ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 22 ══════════════ */}
          <Soal n={22} elemen="Geometri dan Pengukuran" subelemen="Pengukuran">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Perhatikan dua persegi panjang berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal22.png" alt="Dua persegi panjang sebangun soal 22" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Diketahui luas persegi panjang yang lebih besar adalah <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>320 cm²</span> dan kedua persegi panjang tersebut <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>sebangun</span>. Berapakah keliling persegi panjang yang lebih kecil?
            </p>
            <MCQ qn={22} correct={1} options={[
              "A. 9 cm",
              "B. 18 cm",
              "C. 20 cm",
              "D. 72 cm",
            ]} />
            <PembahasanBtn n={22} />
            {expandedPembahasan.has(22) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>B. 18 cm</PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Kesebangunan</span>: dua bangun sebangun jika sudut-sudutnya sama dan sisi-sisi bersesuaiannya sebanding</p>
                  <p>Jika skala = k, maka: <InlineMath math="\dfrac{\text{sisi kecil}}{\text{sisi besar}} = k" /></p>
                  <p>Keliling bangun sebangun: <InlineMath math="K_{\text{kecil}} = k \times K_{\text{besar}}" /></p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Temukan satu sisi yang diketahui di kedua bangun untuk menentukan skala k</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Persegi besar: tinggi = 20 cm (dari gambar), luas = 320 cm²</p></S>
                  <S n={2}><div><BlockMath math="\text{Lebar besar} = \frac{320}{20} = 16 \text{ cm}" /></div></S>
                  <S n={3}><p>Skala: <InlineMath math="k = \dfrac{5}{20} = \dfrac{1}{4}" /> (tinggi kecil = 5 cm dari gambar)</p></S>
                  <S n={4}><p>Lebar kecil: <InlineMath math="16 \times \dfrac{1}{4} = 4 \text{ cm}" /></p></S>
                  <S n={5}><div><BlockMath math="K_{\text{kecil}} = 2(5 + 4) = 2 \times 9 = 18 \text{ cm}\checkmark" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ BACAAN 3 (Soal 23 & 24) ══════════════ */}
          <div className={`rounded-xl border p-4 mb-4 ${isDark ? "border-blue-500/30 bg-blue-950/20" : "bg-blue-50 border-blue-200"}`}>
            <p className={`font-display font-bold text-xs mb-2 ${isDark ? "text-blue-300" : "text-blue-600"}`}>📖 BACAAN 3 — untuk menjawab Soal Nomor 23 dan 24</p>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Pak Dodi adalah pemasok minyak goreng curah di Pasar Maju. Minyak goreng curah adalah minyak goreng tanpa kemasan khusus dan tidak memiliki label atau merek. Terdapat dua jenis minyak goreng curah yang dijual Pak Dodi yakni jenis A dan jenis B. Masing-masing jenis minyak goreng dimasukkan dalam tangki berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-bacaan3.png" alt="Bacaan 3 tangki minyak goreng" className="max-w-full rounded-lg border border-white/10" />
            </div>
          </div>

          {/* ══════════════ SOAL 23 ══════════════ */}
          <Soal n={23} elemen="Geometri dan Pengukuran" subelemen="Pengukuran">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              <span className={`italic ${isDark ? "text-amber-300" : "text-amber-500"}`}>(Perhatikan Bacaan 3)</span><br />
              Minyak jenis B pada tangki yang berisi penuh akan dikemas ke botol dan jeriken. Sebanyak <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>300 botol berukuran 2 liter</span> diisi minyak curah jenis B. Sisa minyak dikemas ke dalam <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>jeriken berukuran 5 liter</span>.
            </p>
            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>Bagaimana perbandingan banyak kemasan botol dan jeriken? <span className={`text-xs font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>(Pilih semua jawaban benar!)</span></p>
            <ComplexMCQ qn={23} items={[
              { text: "Jumlah kemasan botol lebih banyak daripada jeriken.", benar: true },
              { text: "Total kemasan botol dan jeriken yang terisi adalah 532.", benar: true },
              { text: "Sisa minyak di tangki cukup untuk mengisi 1 kemasan botol.", benar: false },
              { text: "Banyak kemasan jeriken yang terisi minyak adalah 332.", benar: false },
            ]} />
            <PembahasanBtn n={23} />
            {expandedPembahasan.has(23) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Pernyataan 1 dan 2 Benar</PBJawaban>
                <PBKonsep>
                  <p>Volume tangki B = 1.760 L (dari gambar Bacaan 3)</p>
                  <p>Langkah: isi botol dulu → sisa untuk jeriken → cek semua pernyataan</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Hitung secara berurutan: botol → sisa → jeriken → total → cek tiap pernyataan</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Volume untuk botol: <InlineMath math="300 \times 2 = 600 \text{ L}" /></p></S>
                  <S n={2}><p>Sisa untuk jeriken: <InlineMath math="1.760 - 600 = 1.160 \text{ L}" /></p></S>
                  <S n={3}><div><BlockMath math="\text{Jeriken} = \frac{1.160}{5} = 232 \text{ buah}" /></div></S>
                  <S n={4}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>① BENAR:</span> 300 botol &gt; 232 jeriken ✓</p></S>
                  <S n={5}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>② BENAR:</span> 300 + 232 = 532 ✓</p></S>
                  <S n={6}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>③ SALAH:</span> Sisa = 0 (1160 ÷ 5 = 232 pas, tidak ada sisa) ✗</p></S>
                  <S n={7}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>④ SALAH:</span> Jeriken = 232, bukan 332 ✗</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 24 ══════════════ */}
          <Soal n={24} elemen="Geometri dan Pengukuran" subelemen="Pengukuran">
            <p className={`font-body text-sm leading-relaxed mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Hari ini di toko Pak Dodi kedatangan dua pelanggan minyak curah yakni Pak Angga dan Bu Susi. Pak Angga dan Bu Susi membawa jeriken untuk wadah minyak dalam jumlah banyak. Jeriken minyak Pak Angga berukuran <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>25 liter</span>, jeriken minyak milik Bu Susi berukuran <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>30 liter</span>. Pak Dodi memiliki persediaan <span className={`font-bold ${isDark ? "text-green-300" : "text-green-600"}`}>1 tangki minyak jenis A</span> dan <span className={`font-bold ${isDark ? "text-green-300" : "text-green-600"}`}>1 tangki minyak jenis B</span>. Pak Angga dan Bu Susi membeli <span className={`font-bold ${isDark ? "text-green-300" : "text-green-600"}`}>seluruh</span> minyak tersebut sehingga tidak ada lagi sisa minyak di tangki. Seluruh jeriken yang dibawa berisi penuh dan masing-masing mendapatkan kedua jenis minyak.
            </p>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Bagaimana kemungkinan perbandingan banyaknya jeriken Pak Angga dan Bu Susi? <span className={`text-xs font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Tentukan <strong>Mungkin</strong> atau <strong>Tidak Mungkin</strong> pada setiap pernyataan berikut!</span>
            </p>
            <CategoryTable
              qn={24}
              colA="Mungkin"
              colB="Tidak Mungkin"
              rows={[
                { key: "r1", text: <span>Bu Susi membawa 32 jeriken minyak jenis A dan 22 jeriken minyak jenis B.</span> },
                { key: "r2", text: <span>Pak Angga membawa 24 jeriken minyak jenis A dan 44 jeriken minyak jenis B.</span> },
                { key: "r3", text: <span>Bu Susi membawa 21 jeriken minyak jenis A dan Pak Angga membawa 40 jeriken minyak jenis B.</span> },
              ]}
              correctKey={{ r1: "Tidak Mungkin", r2: "Mungkin", r3: "Tidak Mungkin" }}
            />
            <PembahasanBtn n={24} />
            {expandedPembahasan.has(24) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Tidak Mungkin / Mungkin / Tidak Mungkin</PBJawaban>
                <PBKonsep>
                  <p>Volume tangki A = 960 L, tangki B = 1.760 L (dari Bacaan 3)</p>
                  <p>Syarat: banyak jeriken harus berupa <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>bilangan bulat positif</span> dan masing-masing mendapat kedua jenis minyak</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Cek (1) hasil bagi = bulat positif DAN (2) setiap orang dapat minimal 1 jeriken dari tiap jenis</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>P1 — Tidak Mungkin:</span> Bu Susi A = 32×30 = 960L → Pak Angga A = 0. Pak Angga tidak dapat jenis A → melanggar syarat ✗</p></S>
                  <S n={2}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>P2 — Mungkin:</span></p></S>
                  <div className={`ml-7 p-2 rounded-lg text-xs ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    <p>Pak Angga A: 24×25=600L → Bu Susi A: (960−600)/30 = 12 jeriken ✓ (bulat)</p>
                    <p>Pak Angga B: 44×25=1.100L → Bu Susi B: (1.760−1.100)/30 = 22 jeriken ✓ (bulat)</p>
                  </div>
                  <S n={3}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>P3 — Tidak Mungkin:</span> Bu Susi A = 21×30 = 630L → Pak Angga A = (960−630)/25 = 330/25 = 13,2 (bukan bulat) ✗</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 25 ══════════════ */}
          <Soal n={25} elemen="Data dan Peluang" subelemen="Data">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Karet dan kelapa sangat penting bagi banyak industri di dunia, mulai dari ban hingga makanan. Indonesia adalah penghasil utama keduanya, dan meskipun ada tantangan dalam produksi, kedua komoditas ini tetap penting untuk ekonomi Indonesia dan pasokan global. Berikut adalah data produksi karet dan kelapa di Indonesia.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal25-tabel.png" alt="Tabel produksi karet dan kelapa 2018-2024 soal 25" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Berdasarkan data di atas, diagram garis manakah yang menunjukkan penyajian data dari salah satu hasil produksi karet atau kelapa di Indonesia?
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(["A","B","C","D"] as const).map((opt, i) => (
                <div
                  key={i}
                  className={`border rounded-lg p-2 text-xs font-body transition-all flex flex-col items-center gap-1 cursor-pointer
                    ${selectedAnswers[25] === i
                      ? i === 1
                        ? isDark ? "bg-green-900/30 border-green-500/50" : "bg-green-50 border-green-400"
                        : isDark ? "bg-red-900/30 border-red-500/50" : "bg-red-50 border-red-400"
                      : isDark ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/40 active:scale-95" : "bg-gray-50 border-gray-300 hover:bg-amber-50 hover:border-amber-400 active:scale-95"
                    }
                    ${selectedAnswers[25] !== undefined && i === 1 ? (isDark ? "bg-green-900/30 border-green-500/50" : "bg-green-50 border-green-400") : ""}
                  `}
                  onClick={() => selectAnswer(25, i)}
                >
                  <img src={`/tka-2025-soal25${opt.toLowerCase()}.png`} alt={`Pilihan ${opt} soal 25`} className="w-full rounded" />
                  <div className="flex items-center justify-between w-full px-1">
                    <span className={`font-bold ${selectedAnswers[25] === i ? (i === 1 ? (isDark ? "text-green-300" : "text-green-600") : (isDark ? "text-red-300" : "text-red-600")) : (isDark ? "text-white/70" : "text-gray-600")}`}>{opt}.</span>
                    {selectedAnswers[25] !== undefined && i === 1 && <span className={`font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>✓</span>}
                    {selectedAnswers[25] === i && i !== 1 && <span className={`font-bold ${isDark ? "text-red-400" : "text-red-500"}`}>✗</span>}
                  </div>
                </div>
              ))}
            </div>
            <PembahasanBtn n={25} />
            {expandedPembahasan.has(25) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>B — diagram karet (garis turun konsisten setiap tahun)</PBJawaban>
                <PBKonsep>
                  <p>Diagram garis menampilkan perubahan data dari waktu ke waktu</p>
                  <p>Identifikasi tren: <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>naik</span>, <span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>turun</span>, atau <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>fluktuatif</span></p>
                  <p>Cocokkan tren diagram dengan tren data tabel</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Cari ciri khas data — apakah selalu turun, selalu naik, atau naik-turun? Lalu cocokkan dengan diagram</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Baca data karet 2018–2024 dari tabel:</p></S>
                  <div className={`ml-7 p-2 rounded-lg text-xs font-mono ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    3,68 → 3,50 → 3,30 → 3,12 → 2,95 → 2,75 → 2,60
                  </div>
                  <S n={2}><p>Tren karet: <span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>TURUN MONOTON</span> setiap tahun tanpa kenaikan sama sekali</p></S>
                  <S n={3}><p>Diagram B menunjukkan garis yang terus menurun tanpa fluktuasi → cocok dengan data karet</p></S>
                  <S n={4}><p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Jawaban B ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 26 ══════════════ */}
          <Soal n={26} elemen="Data dan Peluang" subelemen="Data">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Tory suka sekali bermain game online. Dia selalu mengabaikan batasan waktu dalam bermain game online. Belakangan ini Tory sering merasa gelisah dan mudah marah apabila tidak diijinkan bermain. Dia juga sering merasakan sakit mata dan pusing. Dokter mengatakan bahwa Tory telah kecanduan bermain game online. Tory harus berusaha perlahan-lahan mengontrol waktu bermainnya. Dokter mengatakan bahwa batas waktu maksimal Tory diperbolehkan bermain adalah <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>7 jam dalam satu minggu</span>. Selama <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>12 minggu</span>, waktu bermain game Tory terus dipantau oleh kedua orang tuanya dan dilaporkan ke dokter.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal26.png" alt="Diagram batang durasi Tory bermain game soal 26" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Dalam 12 minggu terakhir, Tory paling sering menghabiskan waktu bermain game online setiap minggunya yaitu selama …
            </p>
            <MCQ qn={26} correct={1} options={[
              "A. 10 jam",
              "B. 14 jam",
              "C. 20 jam",
              "D. 22 jam",
            ]} />
            <PembahasanBtn n={26} />
            {expandedPembahasan.has(26) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>B. 14 jam</PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Modus</span> = nilai yang paling sering muncul dalam sekumpulan data</p>
                  <p>"Paling sering" = frekuensi kemunculan terbanyak</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Baca dari diagram batang — batang yang tertinggi = frekuensi terbanyak = MODUS</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Baca data 12 minggu dari diagram batang:</p></S>
                  <div className={`ml-7 p-2 rounded-lg text-xs font-mono ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    22, 20, 18, 20, <span className={isDark ? "text-amber-300" : "text-amber-600"}>14</span>, 16, <span className={isDark ? "text-amber-300" : "text-amber-600"}>14</span>, <span className={isDark ? "text-amber-300" : "text-amber-600"}>14</span>, 12, <span className={isDark ? "text-amber-300" : "text-amber-600"}>14</span>, 10, 12
                  </div>
                  <S n={2}><p>Hitung frekuensi setiap nilai:</p></S>
                  <div className={`ml-7 p-2 rounded-lg text-xs ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    <p>10 jam: 1× | 12 jam: 2× | 14 jam: <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>4×</span> | 16 jam: 1×</p>
                    <p>18 jam: 1× | 20 jam: 2× | 22 jam: 1×</p>
                  </div>
                  <S n={3}><p className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>Modus = 14 jam (muncul 4 kali — terbanyak) ✓</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 27 ══════════════ */}
          <Soal n={27} elemen="Data dan Peluang" subelemen="Data">
            <p className={`font-body text-sm leading-relaxed mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Tory suka sekali bermain game online. Dia selalu mengabaikan batasan waktu dalam bermain game online. Belakangan ini Tory sering merasa gelisah dan mudah marah apabila tidak diijinkan bermain. Dia juga sering merasakan sakit mata dan pusing. Dokter mengatakan bahwa Tory telah kecanduan bermain game online. Tory harus berusaha perlahan-lahan mengontrol waktu bermainnya. Dokter mengatakan bahwa batas waktu maksimal Tory diperbolehkan bermain adalah <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>7 jam dalam satu minggu</span>.
            </p>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Selama <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>12 minggu</span>, waktu bermain game Tory terus dipantau oleh kedua orang tuanya dan dilaporkan ke dokter.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal27-bar.png" alt="Diagram batang durasi Tory bermain game soal 27" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Dokter dan orang tua Tory memahami bahwa tidak mudah menghilangkan kecanduan bermain game online, namun mereka ingin terus memantau bagaimana perkembangan Tory. Dokter membuat skema sebagai berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal27.png" alt="Diagram fase penyembuhan soal 27" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Dokter memantau dan membandingkan rata-rata jam bermain game online setiap 4 minggu dan menyebutnya sebagai <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>fase</span>.
            </p>
            <p className={`font-body text-sm leading-relaxed mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Fase pertama</span> membandingkan rata-rata jam bermain pada 4 minggu pertama dengan rata-rata jam bermain pada 4 minggu kedua.
            </p>
            <p className={`font-body text-sm leading-relaxed mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Fase kedua</span> membandingkan rata-rata jam bermain pada 4 minggu kedua dengan rata-rata jam bermain pada 4 minggu ketiga.
            </p>
            <p className={`font-body text-sm leading-relaxed mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Fase akhir</span> membandingkan rata-rata jam bermain pada 4 minggu ketiga dengan batas waktu maksimal yang disarankan.
            </p>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Hal tersebut dilakukan untuk melihat perkembangan kebiasaan Tory dalam bermain game online. Apakah yang terjadi pada Tory selama fase penyembuhan?
            </p>
            <p className={`font-body text-xs font-bold mb-2 ${isDark ? "text-amber-300" : "text-amber-600"}`}>Pilihlah semua jawaban benar! Jawaban benar lebih dari satu.</p>
            <ComplexMCQ qn={27} items={[
              { text: "Fase pertama berkurang 5,5 jam.", benar: true },
              { text: "Fase kedua berkurang 2,25 jam.", benar: false },
              { text: "Fase akhir berkurang 5,25 jam.", benar: false },
              { text: "Fase penyembuhan berkurang 8 jam.", benar: true },
            ]} />
            <PembahasanBtn n={27} />
            {expandedPembahasan.has(27) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>Pernyataan 1 dan 4 Benar</PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Mean (Rata-rata)</span>: <InlineMath math="\bar{x} = \dfrac{\text{jumlah data}}{\text{banyak data}}" /></p>
                  <p>Hitung rata-rata setiap kelompok 4 minggu, lalu bandingkan antar kelompok</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Dari soal 26 kita tahu datanya. Kelompokkan per 4 minggu, jumlahkan, bagi 4</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Data: 22, 20, 18, 20 | 14, 16, 14, 14 | 12, 14, 10, 12</p></S>
                  <S n={2}><div><BlockMath math="\bar{x}_1 = \frac{22+20+18+20}{4} = \frac{80}{4} = 20 \text{ jam}" /></div></S>
                  <S n={3}><div><BlockMath math="\bar{x}_2 = \frac{14+16+14+14}{4} = \frac{58}{4} = 14{,}5 \text{ jam}" /></div></S>
                  <S n={4}><div><BlockMath math="\bar{x}_3 = \frac{12+14+10+12}{4} = \frac{48}{4} = 12 \text{ jam}" /></div></S>
                  <S n={5}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>P1 ✓:</span> Fase 1→2: 20 − 14,5 = <strong>5,5 jam</strong></p></S>
                  <S n={6}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>P2 ✗:</span> Fase 2→3: 14,5 − 12 = 2,5 jam (bukan 2,25)</p></S>
                  <S n={7}><p><span className={`font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>P3 ✗:</span> Fase 3→batas: 12 − 7 = 5 jam (bukan 5,25)</p></S>
                  <S n={8}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>P4 ✓:</span> Total Fase 1→3: 20 − 12 = <strong>8 jam</strong></p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 28 ══════════════ */}
          <Soal n={28} elemen="Data dan Peluang" subelemen="Peluang">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Suatu paket terdiri dari <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>20 kotak misteri</span>. Kotak misteri tersebut berisi patung figur karakter yang bernama <span className={`font-bold ${isDark ? "text-blue-300" : "text-blue-600"}`}>Saka</span> dan <span className={`font-bold ${isDark ? "text-pink-300" : "text-pink-600"}`}>Kirana</span>. Berikut ini banyak paket figur karakter yang tersedia dalam satu paket.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal28.png" alt="Figur Saka 8 buah dan Kirana 12 buah soal 28" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Riana mengambil <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>3 kotak secara acak</span> dan mendapat <span className={`font-bold ${isDark ? "text-blue-300" : "text-blue-600"}`}>1 Saka + 2 Kirana</span>. Kemudian, <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Santi</span> akan mengambil 1 kotak misteri. Berapakah peluang Santi mendapatkan <span className={`font-bold ${isDark ? "text-blue-300" : "text-blue-600"}`}>Saka</span>?
            </p>
            <MCQ qn={28} correct={3} options={[
              <span key="a">A. <InlineMath math="\dfrac{7}{20}" /></span>,
              <span key="b">B. <InlineMath math="\dfrac{8}{20}" /></span>,
              <span key="c">C. <InlineMath math="\dfrac{8}{17}" /></span>,
              <span key="d">D. <InlineMath math="\dfrac{7}{17}" /></span>,
            ]} />
            <PembahasanBtn n={28} />
            {expandedPembahasan.has(28) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>D. <InlineMath math="\dfrac{7}{17}" /></PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Peluang empiris setelah pengambilan tanpa pengembalian</span></p>
                  <p>Setelah Riana mengambil: total kotak berkurang, jumlah tiap figur berkurang sesuai yang diambil</p>
                  <div className="my-1"><BlockMath math="P(\text{kejadian}) = \frac{\text{jumlah yang diinginkan}}{\text{total setelah pengambilan}}" /></div>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Update total dan favorable setelah setiap pengambilan — jangan pakai total awal!</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Kondisi awal: 8 Saka + 12 Kirana = <strong>20 kotak</strong></p></S>
                  <S n={2}><p>Riana mengambil: 1 Saka + 2 Kirana = 3 kotak</p></S>
                  <S n={3}><p>Sisa Saka: <InlineMath math="8 - 1 = 7" /></p></S>
                  <S n={4}><p>Sisa Kirana: <InlineMath math="12 - 2 = 10" /></p></S>
                  <S n={5}><p>Total kotak sisa: <InlineMath math="20 - 3 = 17" /></p></S>
                  <S n={6}><div><BlockMath math="P(\text{Saka}) = \frac{7}{17}\checkmark" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 29 ══════════════ */}
          <Soal n={29} elemen="Data dan Peluang" subelemen="Peluang">
            <p className={`font-body text-sm font-bold mb-2 ${isDark ? "text-white/90" : "text-gray-800"}`}>Mesin Tetas Telur</p>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Mesin tetas telur adalah sebuah alat yang digunakan untuk membantu proses penetasan telur. Cara kerja alat atau mesin ini adalah melakukan proses pengeraman tanpa induk dengan menggunakan sebuah lampu pijar. Mesin ini dilengkapi dengan motor yang berfungsi untuk meratakan proses pemanasan telur agar telur dapat menetas secara maksimal. Mesin ini umumnya hanya bisa digunakan untuk menetaskan telur unggas seperti telur ayam, puyuh, bebek, dan entok.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal29.png" alt="Gambar mesin tetas telur soal 29" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Penetasan berlangsung selama <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>18 hari</span> terhitung dari awal masuknya telur ke dalam mesin tetas. Dilakukan pengamatan terhadap beberapa telur puyuh dengan usia yang berbeda-beda. Berikut rincian usia telur di mesin tetas tersebut saat ini.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className={isDark ? "bg-amber-900/30 text-amber-300" : "bg-amber-100 text-amber-700"}>
                    <th className={`border px-3 py-1.5 text-left ${isDark ? "border-white/10" : "border-amber-200"}`}>Usia Telur di Dalam Mesin</th>
                    <th className={`border px-3 py-1.5 text-center ${isDark ? "border-white/10" : "border-amber-200"}`}>Banyak Telur</th>
                    <th className={`border px-3 py-1.5 text-center ${isDark ? "border-white/10" : "border-amber-200"}`}>Sisa hari tetas</th>
                  </tr>
                </thead>
                <tbody>
                  {[["2 hari", "20", "16 hari"],["4 hari","35","14 hari"],["6 hari","30","12 hari"],["8 hari","15","10 hari"]].map(([usia,n,sisa],i)=>(
                    <tr key={i} className={i===3 ? (isDark ? "bg-green-900/20 text-green-300 font-bold" : "bg-green-50 text-green-700 font-bold") : (isDark ? "text-white/80" : "text-gray-700")}>
                      <td className={`border px-3 py-1.5 ${isDark ? "border-white/10" : "border-gray-200"}`}>{usia}</td>
                      <td className={`border px-3 py-1.5 text-center ${isDark ? "border-white/10" : "border-gray-200"}`}>{n}</td>
                      <td className={`border px-3 py-1.5 text-center ${isDark ? "border-white/10" : "border-gray-200"}`}>{sisa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`font-body text-sm mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Diketahui telur-telur tersebut diletakkan secara acak di dalam mesin. Jika dilakukan pengamatan pada satu telur yang dipilih secara acak, berapakah peluang telur tersebut akan menetas dalam <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>10 hari ke depan</span>?
            </p>
            <MCQ qn={29} correct={0} options={[
              <span key="a">A. <InlineMath math="\dfrac{3}{20}" /></span>,
              <span key="b">B. <InlineMath math="\dfrac{1}{15}" /></span>,
              <span key="c">C. <InlineMath math="\dfrac{1}{10}" /></span>,
              <span key="d">D. <InlineMath math="\dfrac{1}{8}" /></span>,
            ]} />
            <PembahasanBtn n={29} />
            {expandedPembahasan.has(29) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>A. <InlineMath math="\dfrac{3}{20}" /></PBJawaban>
                <PBKonsep>
                  <p><span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Peluang klasik</span>: <InlineMath math="P(A) = \dfrac{n(A)}{n(S)}" /></p>
                  <p>n(A) = jumlah kejadian yang diinginkan (telur yang menetas dalam 10 hari)</p>
                  <p>n(S) = total semua kejadian yang mungkin (total semua telur)</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: "Menetas dalam 10 hari ke depan" berarti sisa hari tetas ≤ 10 hari</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Total telur: <InlineMath math="20+35+30+15 = 100 \text{ telur}" /></p></S>
                  <S n={2}><p>Syarat menetas ≤ 10 hari ke depan: sisa hari tetas ≤ 10</p></S>
                  <S n={3}><p>Telur yang memenuhi: usia 8 hari (sisa <span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>10 hari</span> = 10) → <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>15 telur</span></p></S>
                  <S n={4}><div><BlockMath math="P(\text{menetas} \leq 10\text{ hari}) = \frac{15}{100} = \frac{3}{20}\checkmark" /></div></S>
                </PBSteps>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 30 ══════════════ */}
          <Soal n={30} elemen="Data dan Peluang" subelemen="Peluang">
            <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Seorang guru menyiapkan sejumlah kertas soal ujian yang digulung dan dimasukkan ke dalam sebuah kotak. Setiap kertas berisi kode soal <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>A, B, atau C</span>.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal30.png" alt="Guru ujian matematika kode soal A B atau C soal 30" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <div className={`border rounded-xl p-4 mb-3 ${isDark ? "bg-cyan-900/15 border-cyan-500/30" : "bg-cyan-50 border-cyan-200"}`}>
              <p className={`text-[10px] font-body font-bold uppercase tracking-wider mb-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>Salinan teks dari gambar</p>
              <p className={`font-body text-sm leading-relaxed mb-3 ${isDark ? "text-white/80" : "text-gray-700"}`}>
                Diketahui bahwa jumlah kertas berkode A lebih sedikit daripada kertas berkode B. Guru kemudian mengambil 3 kertas dengan kode yang sama dari dalam kotak. Setelah pengambilan, jumlah seluruh kertas yang tersisa di dalam kotak menjadi <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>28 lembar</span> dan jumlah kertas berkode B lebih banyak daripada kertas berkode C. Jika kemudian diambil satu kertas secara acak dari kotak tersebut, diketahui bahwa peluang terambilnya kertas berkode C yaitu <InlineMath math="\dfrac{2}{7}" />.
              </p>
              <p className={`font-body text-sm mb-1 ${isDark ? "text-white/80" : "text-gray-700"}`}>
                Berdasarkan informasi tersebut, berapakah kemungkinan jumlah kertas soal ujian kode B mula-mula?
              </p>
              <p className={`text-xs font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>Pilihlah semua jawaban benar! Jawaban benar lebih dari satu.</p>
            </div>
            <ComplexMCQ qn={30} items={[
              { text: "10 lembar", benar: false },
              { text: "11 lembar", benar: false },
              { text: "12 lembar", benar: true },
              { text: "14 lembar", benar: true },
            ]} />
            <PembahasanBtn n={30} />
            {expandedPembahasan.has(30) && (
              <div className="mt-3 space-y-2">
                <PBJawaban>12 lembar dan 14 lembar</PBJawaban>
                <PBKonsep>
                  <p>Gabungan <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>sistem persamaan</span> + <span className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>peluang</span></p>
                  <p>Dari P(C) dan total setelah pengambilan → cari C</p>
                  <p>Dari total awal → cari A+B</p>
                  <p>Gunakan syarat: A&lt;B dan B−3&gt;C untuk membatasi nilai B</p>
                  <p className={`text-[10px] italic ${isDark ? "text-violet-300/70" : "text-violet-500"}`}>💡 Trik: Cari C dari peluang, lalu A+B dari selisih. Gunakan syarat-syarat untuk menyaring nilai B yang valid</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}><p>Total awal: A + B + C = 28 + 3 = <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>31</span> (3 kertas diambil, sisa 28)</p></S>
                  <S n={2}><p>P(C setelah) = C/28 = 2/7 → <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>C = 8</span></p></S>
                  <S n={3}><p>A + B = 31 − 8 = <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>23</span></p></S>
                  <S n={4}><p>Syarat: A &lt; B dan B−3 &gt; 8 (B lebih banyak dari C=8 setelah 3 diambil)</p></S>
                  <S n={5}><div className={`p-2 rounded-lg text-xs ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    <p>B−3 &gt; 8 → B &gt; 11 → <span className={`font-bold ${isDark ? "text-amber-300" : "text-amber-600"}`}>B ≥ 12</span></p>
                    <p>A = 23−B &gt; 0 → B &lt; 23, dan A &lt; B → 23−B &lt; B → B &gt; 11,5 → B ≥ 12</p>
                  </div></S>
                  <S n={6}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>B=12</span>: A=11. Cek: 11&lt;12 ✓, 12−3=9&gt;8 ✓ → <strong>Valid</strong></p></S>
                  <S n={7}><p><span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>B=14</span>: A=9. Cek: 9&lt;14 ✓, 14−3=11&gt;8 ✓ → <strong>Valid</strong></p></S>
                  <S n={8}><p>B=13: A=10. Cek: 10&lt;13 ✓, 13−3=10&gt;8 ✓ → Valid (tapi bukan pilihan yang ada)</p></S>
                </PBSteps>
              </div>
            )}
          </Soal>

        {/* ── Footer ── */}
        <div className={`mt-8 border rounded-xl p-4 text-center ${isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-300"}`}>
          <p className={`text-xs font-body ${isDark ? "text-white/50" : "text-gray-500"}`}>Sumber: Soal Asli TKA Matematika SMP Tahun 2025.</p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/tka"); }}
            className={`text-sm hover:text-amber-400 transition-colors cursor-pointer font-body ${isDark ? "text-muted-foreground" : "text-gray-500"}`}
          >
            ← Kembali ke TKA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKASoalAsli2025Page;
