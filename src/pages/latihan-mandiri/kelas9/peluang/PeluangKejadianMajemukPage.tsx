import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Layers } from "lucide-react";

const FreqTable = ({ headers, rows, caption }: { headers: string[]; rows: (string | number)[][]; caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-indigo-500/30 my-2">
    {caption && <div className="text-[10px] text-indigo-300/70 font-bold text-center pt-2 px-2">{caption}</div>}
    <table className="min-w-full text-xs font-body">
      <thead>
        <tr className="bg-indigo-900/40">
          {headers.map((h, i) => <th key={i} className="px-3 py-2 text-indigo-200 font-bold text-center border-b border-indigo-500/30">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-indigo-900/10"}>
            {row.map((cell, ci) => <td key={ci} className="px-3 py-2 text-center text-white/80 border-b border-white/5">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const renderOpt = (opt: string) => {
  if (opt.includes('\\')) return <InlineMath math={opt} />;
  return <>{opt}</>;
};

type MCQ = { n: number; title: string; content: string; diagram?: React.ReactNode; options: string[]; answer: number };

const questions: MCQ[] = [
  {
    n: 1, title: "Aturan Penjumlahan – Kejadian Saling Lepas",
    content: "Dua kejadian A dan B dikatakan saling lepas jika A ∩ B = ∅. Jika P(A) = 1/4 dan P(B) = 1/3 dan A, B saling lepas, maka P(A ∪ B) adalah ...",
    options: ["\\frac{1}{12}", "\\frac{5}{12}", "\\frac{7}{12}", "\\frac{1}{2}"],
    answer: 2,
  },
  {
    n: 2, title: "Aturan Penjumlahan – Kejadian Tidak Saling Lepas",
    content: "Jika P(A) = 1/2, P(B) = 1/3, dan P(A ∩ B) = 1/6, maka nilai P(A ∪ B) adalah ...",
    options: ["\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}", "\\frac{5}{6}"],
    answer: 2,
  },
  {
    n: 3, title: "Dadu Tunggal – Saling Lepas",
    content: "Sebuah dadu dilempar sekali. A = muncul angka prima = {2,3,5}, B = muncul angka 6 = {6}. Karena A ∩ B = ∅ (saling lepas), P(A ∪ B) adalah ...",
    options: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
    answer: 3,
  },
  {
    n: 4, title: "Kartu Bridge – Tidak Saling Lepas",
    content: "Satu kartu diambil dari 52 kartu remi. A = kartu merah (26 kartu), B = kartu bergambar J/Q/K (12 kartu), A ∩ B = kartu merah bergambar (6 kartu). Nilai P(A ∪ B) adalah ...",
    diagram: (
      <FreqTable caption="Distribusi kartu bridge 52 lembar"
        headers={["", "Gambar (J,Q,K)", "Bukan Gambar", "Total"]}
        rows={[["Merah", 6, 20, 26], ["Hitam", 6, 20, 26], ["Total", 12, 40, 52]]} />
    ),
    options: ["\\frac{1}{2}", "\\frac{15}{26}", "\\frac{8}{13}", "\\frac{19}{26}"],
    answer: 1,
  },
  {
    n: 5, title: "Aturan Perkalian – Kejadian Saling Bebas",
    content: "Sebuah koin dilempar dan sebuah dadu dilempar secara terpisah. A = koin Angka, B = dadu angka genap. Karena saling bebas, P(A ∩ B) adalah ...",
    options: ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}"],
    answer: 1,
  },
  {
    n: 6, title: "Koin dan Dadu – Saling Bebas",
    content: "Sebuah koin dan sebuah dadu dilempar bersamaan. P(koin Angka) = 1/2 dan P(dadu > 4) = 1/3. Peluang mendapat koin Angka DAN dadu > 4 adalah ...",
    options: ["\\frac{1}{2}", "\\frac{1}{3}", "\\frac{1}{6}", "\\frac{1}{4}"],
    answer: 2,
  },
  {
    n: 7, title: "Dua Dadu – Peluang Kejadian Spesifik",
    content: "Dua dadu dilempar bersamaan. P(dadu pertama = 3) = 1/6 dan P(dadu kedua = 4) = 1/6. Karena saling bebas, P(dadu pertama = 3 DAN dadu kedua = 4) adalah ...",
    options: ["\\frac{1}{6}", "\\frac{1}{18}", "\\frac{1}{36}", "\\frac{1}{12}"],
    answer: 2,
  },
  {
    n: 8, title: "Soal UN – Kartu As dan Kartu Hitam",
    content: "Dari 52 kartu bridge, satu kartu diambil. A = kartu As (4 kartu), B = kartu hitam (26 kartu), A ∩ B = As hitam (2 kartu). Nilai P(A ∪ B) adalah ...",
    diagram: (
      <FreqTable caption="Perpotongan kejadian As dan Hitam"
        headers={["", "As", "Bukan As", "Total"]}
        rows={[["Hitam", 2, 24, 26], ["Merah", 2, 24, 26], ["Total", 4, 48, 52]]} />
    ),
    options: ["\\frac{1}{2}", "\\frac{7}{13}", "\\frac{15}{26}", "\\frac{8}{13}"],
    answer: 1,
  },
  {
    n: 9, title: "Pengambilan Tanpa Pengembalian – Peluang Dua Bola",
    content: "Kotak berisi 4 bola merah dan 6 bola biru. Dua bola diambil tanpa pengembalian. Peluang kedua bola berwarna biru (BB) adalah ...",
    options: [
      "\\frac{6}{10} \\times \\frac{5}{9} = \\frac{1}{3}",
      "\\frac{6}{10} \\times \\frac{6}{10} = \\frac{9}{25}",
      "\\frac{4}{10} \\times \\frac{3}{9} = \\frac{2}{15}",
      "\\frac{6}{10} \\times \\frac{4}{9} = \\frac{4}{15}",
    ],
    answer: 0,
  },
  {
    n: 10, title: "Soal ANBK – Kartu Merah atau Angka 7",
    content: "Dari 52 kartu bridge, satu kartu diambil. P(merah) = 1/2, P(angka 7) = 1/13, P(merah ∩ angka 7) = 1/26. Nilai P(merah ∪ angka 7) adalah ...",
    options: [
      "\\frac{7}{13}",
      "\\frac{15}{26}",
      "\\frac{1}{2}",
      "\\frac{8}{13}",
    ],
    answer: 0,
  },
  {
    n: 11, title: "Pengambilan Dengan Pengembalian – Saling Bebas",
    content: "Kotak berisi 3 merah dan 7 biru. Dua bola diambil satu per satu dengan pengembalian. Peluang mendapat bola berbeda warna (satu merah, satu biru) adalah ...",
    options: [
      "\\frac{3}{10} \\times \\frac{7}{10} = \\frac{21}{100}",
      "2 \\times \\left(\\frac{3}{10} \\times \\frac{7}{10}\\right) = \\frac{21}{50}",
      "\\frac{3}{10} \\times \\frac{7}{9} = \\frac{7}{30}",
      "\\frac{6}{10} \\times \\frac{4}{9} = \\frac{4}{15}",
    ],
    answer: 1,
  },
  {
    n: 12, title: "Soal UN – Menghitung P(A ∪ B) dan Komplemennya",
    content: "Diketahui P(A) = 0,4, P(B) = 0,5, dan P(A ∩ B) = 0,2. Nilai P((A ∪ B)') — yaitu peluang tidak terjadi A maupun B — adalah ...",
    options: ["0{,}2", "0{,}3", "0{,}4", "0{,}7"],
    answer: 1,
  },
  {
    n: 13, title: "Spinner Dua Putaran – Saling Bebas",
    content: "Sebuah spinner punya 8 sektor sama besar: Merah 3, Biru 3, Kuning 2. Dua putaran dilakukan. Peluang mendapat Merah di putaran 1 DAN Kuning di putaran 2 adalah ...",
    diagram: (
      <FreqTable caption="Spinner dengan 8 sektor sama besar"
        headers={["Warna", "Merah", "Biru", "Kuning", "Total"]}
        rows={[["Sektor", 3, 3, 2, 8]]} />
    ),
    options: [
      "\\frac{3}{8} \\times \\frac{3}{8} = \\frac{9}{64}",
      "\\frac{3}{8} \\times \\frac{2}{8} = \\frac{3}{32}",
      "\\frac{3}{8} + \\frac{2}{8} = \\frac{5}{8}",
      "\\frac{2}{8} \\times \\frac{3}{8} = \\frac{3}{32}",
    ],
    answer: 1,
  },
  {
    n: 14, title: "Soal ANBK – Himpunan dan Peluang Gabungan",
    content: "Dari 50 siswa: 35 suka sepak bola, 25 suka basket, 15 suka keduanya. Peluang siswa yang tidak suka sepak bola maupun basket adalah ...",
    diagram: (
      <FreqTable caption="Data 50 siswa"
        headers={["", "Suka Sepak Bola", "Tidak", "Total"]}
        rows={[["Suka Basket", 15, 10, 25], ["Tidak", 20, 5, 25], ["Total", 35, 15, 50]]} />
    ),
    options: ["\\frac{1}{10}", "\\frac{1}{5}", "\\frac{3}{10}", "\\frac{9}{10}"],
    answer: 0,
  },
  {
    n: 15, title: "Soal TKA – Tiga Bola Merah dari 6 Bola",
    content: "Kotak berisi 6 bola: 3 merah (M), 2 biru (B), 1 hijau (H). Tiga bola diambil tanpa pengembalian. Peluang ketiganya berwarna merah adalah ...",
    options: [
      "\\frac{3}{6} \\times \\frac{2}{5} \\times \\frac{1}{4} = \\frac{1}{20}",
      "\\frac{3}{6} \\times \\frac{3}{5} \\times \\frac{3}{4} = \\frac{9}{40}",
      "\\frac{1}{6} \\times \\frac{1}{5} \\times \\frac{1}{4} = \\frac{1}{120}",
      "\\frac{3}{6} \\times \\frac{2}{6} \\times \\frac{1}{6} = \\frac{1}{36}",
    ],
    answer: 0,
  },
  {
    n: 16, title: "Soal ANBK – Membuktikan Saling Bebas",
    content: "Dari 52 kartu bridge, satu kartu diambil. A = kartu As, B = kartu merah. P(A) = 1/13 dan P(B) = 1/2. Apakah A dan B saling bebas?",
    options: [
      "\\text{Ya, karena } P(A \\cap B) = \\frac{1}{26} = P(A) \\times P(B)",
      "\\text{Tidak, karena } P(A \\cap B) \\neq P(A) \\times P(B)",
      "\\text{Ya, karena } A \\text{ dan } B \\text{ tidak punya irisan}",
      "\\text{Tidak, karena kartu As selalu berwarna hitam}",
    ],
    answer: 0,
  },
  {
    n: 17, title: "Soal UN – Peluang Bersyarat",
    content: "Dalam sebuah kotak terdapat 10 kelereng. P(ganjil) = 3/5. P(merah | ganjil) = 1/2. Nilai P(merah ∩ ganjil) adalah ...",
    options: ["\\frac{1}{2}", "\\frac{3}{10}", "\\frac{1}{5}", "\\frac{2}{5}"],
    answer: 1,
  },
  {
    n: 18, title: "Soal ANBK – Peluang Bersyarat dari Tabel",
    content: "Survei 200 siswa: 100 laki-laki (70 suka Matematika), 100 perempuan (50 suka Matematika). Satu siswa dipilih acak dan ternyata laki-laki. Peluang ia suka Matematika — yaitu P(suka Mat | laki-laki) — adalah ...",
    diagram: (
      <FreqTable caption="Survei 200 siswa"
        headers={["", "Suka Matematika", "Tidak Suka", "Total"]}
        rows={[["Laki-laki", 70, 30, 100], ["Perempuan", 50, 50, 100], ["Total", 120, 80, 200]]} />
    ),
    options: ["\\frac{1}{2}", "\\frac{7}{20}", "\\frac{7}{10}", "\\frac{3}{5}"],
    answer: 2,
  },
];

const OPTS = ["A", "B", "C", "D"];

const PeluangKejadianMajemukPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (qn: number, idx: number) => { if (revealed[qn]) return; setSelected(s => ({ ...s, [qn]: idx })); };
  const handleReveal = (qn: number) => { setRevealed(r => ({ ...r, [qn]: true })); };

  const score = questions.filter(q => revealed[q.n] && selected[q.n] === q.answer).length;
  const totalRevealed = Object.keys(revealed).length;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-500/20 border-2 border-indigo-400/60 flex items-center justify-center mb-3">
            <Layers className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-indigo-300 text-center mb-1" style={{ textShadow: "0 0 20px rgba(129,140,248,0.7)" }}>
            PELUANG KEJADIAN MAJEMUK
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-2">
            <span className="text-indigo-400 text-xs font-bold">📋 {questions.length} {t('practice.suffixSoal')} {t('practice.multipleChoice')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
          {totalRevealed > 0 && (
            <div className="mt-2 bg-indigo-900/30 border border-indigo-500/30 rounded-lg px-4 py-1.5 text-xs font-body text-indigo-300">
              Skor: {score} / {totalRevealed} soal dijawab
            </div>
          )}
        </div>
        <div className="mb-5 bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-indigo-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: "Saling Lepas", math: "P(A \\cup B) = P(A) + P(B)" },
              { label: "Tidak Saling Lepas", math: "P(A \\cup B) = P(A)+P(B)-P(A \\cap B)" },
              { label: "Saling Bebas", math: "P(A \\cap B) = P(A) \\times P(B)" },
              { label: "Bersyarat", math: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}" },
            ].map(r => (
              <div key={r.label} className="bg-white/5 rounded-lg px-3 py-2 text-center">
                <p className="text-indigo-300 text-[10px] font-bold mb-1">{r.label}</p>
                <BlockMath math={r.math} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 animate-slide-up">
          {questions.map((q, qi) => {
            const sel = selected[q.n];
            const isRevealed = revealed[q.n];
            const hasSel = sel !== undefined;
            return (
              <div key={q.n} className="relative rounded-2xl overflow-hidden" style={{ animationDelay: `${qi * 0.02}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900/80 to-violet-900/30 backdrop-blur" />
                <div className="absolute inset-0 border border-indigo-500/20 rounded-2xl" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-violet-500 rounded-l-2xl" />
                <div className="relative px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shrink-0">
                      <span className="text-indigo-300 text-xs font-bold">{q.n}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                      {q.diagram && <div className="mb-3">{q.diagram}</div>}
                      <p className="font-body text-sm text-white/90 leading-relaxed mb-4">{q.content}</p>
                      <div className="flex flex-col gap-2">
                        {q.options.map((opt, oi) => {
                          let cls = "bg-white/5 border border-white/10 text-white/80";
                          if (isRevealed) {
                            if (oi === q.answer) cls = "bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 font-bold";
                            else if (oi === sel) cls = "bg-red-500/20 border border-red-400/60 text-red-300";
                            else cls = "bg-white/3 border border-white/5 text-white/40";
                          } else if (hasSel && oi === sel) {
                            cls = "bg-indigo-500/25 border border-indigo-400/60 text-indigo-200";
                          }
                          return (
                            <button key={oi} onClick={() => handleSelect(q.n, oi)}
                              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-all duration-200 ${cls} ${!isRevealed ? "cursor-pointer hover:border-indigo-400/40" : "cursor-default"}`}>
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${isRevealed && oi === q.answer ? "bg-emerald-500/30 border-emerald-400" : isRevealed && oi === sel ? "bg-red-500/30 border-red-400" : hasSel && oi === sel ? "bg-indigo-500/30 border-indigo-400" : "bg-white/10 border-white/20"}`}>
                                {OPTS[oi]}
                              </span>
                              <span className="font-body text-sm overflow-x-auto">{renderOpt(opt)}</span>
                              {isRevealed && oi === q.answer && <span className="ml-auto text-emerald-400 text-xs font-bold shrink-0">✓ Benar</span>}
                              {isRevealed && oi === sel && oi !== q.answer && <span className="ml-auto text-red-400 text-xs font-bold shrink-0">✗ Salah</span>}
                            </button>
                          );
                        })}
                      </div>
                      {hasSel && !isRevealed && (
                        <button onClick={() => handleReveal(q.n)}
                          className="mt-3 text-xs bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 rounded-lg px-4 py-1.5 transition-colors font-body cursor-pointer">
                          Cek Jawaban
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/peluang"); }}
            className="text-sm text-muted-foreground hover:text-indigo-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeluangKejadianMajemukPage;
