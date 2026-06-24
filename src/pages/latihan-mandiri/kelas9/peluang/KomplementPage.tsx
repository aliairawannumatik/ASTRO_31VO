import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { FlipHorizontal2 } from "lucide-react";

const FreqTable = ({ headers, rows, caption }: { headers: string[]; rows: (string | number)[][]; caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-rose-500/30 my-2">
    {caption && <div className="text-[10px] text-rose-300/70 font-bold text-center pt-2 px-2">{caption}</div>}
    <table className="min-w-full text-xs font-body">
      <thead>
        <tr className="bg-rose-900/40">
          {headers.map((h, i) => <th key={i} className="px-3 py-2 text-rose-200 font-bold text-center border-b border-rose-500/30">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-rose-900/10"}>
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
    n: 1, title: "Konsep Komplemen – Mencari P(A')",
    content: "Komplemen kejadian A (ditulis A') adalah semua titik sampel yang bukan A. Jika P(A) = 3/7, maka nilai P(A') adalah ...",
    options: ["\\frac{3}{7}", "\\frac{4}{7}", "\\frac{5}{7}", "\\frac{1}{7}"],
    answer: 1,
  },
  {
    n: 2, title: "Komplemen – Dadu Tunggal",
    content: "Sebuah dadu dilempar sekali. A = muncul angka prima = {2, 3, 5}. Komplemen A adalah A' = {1, 4, 6}. Nilai P(A') adalah ...",
    options: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
    answer: 2,
  },
  {
    n: 3, title: "Komplemen – Koin Tunggal",
    content: "Sebuah koin dilempar sekali. P(Angka) = 1/2. Menggunakan konsep komplemen, P(Gambar) = P(Angka') adalah ...",
    options: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
    answer: 2,
  },
  {
    n: 4, title: "Komplemen – Kartu As Remi",
    content: "Satu kartu diambil dari 52 kartu remi. A = terambil kartu As. P(As) = 1/13. Nilai P(bukan As) menggunakan rumus komplemen adalah ...",
    options: ["\\frac{1}{13}", "\\frac{11}{13}", "\\frac{12}{13}", "\\frac{48}{52}"],
    answer: 2,
  },
  {
    n: 5, title: "Menggunakan Komplemen – Dua Dadu",
    content: "Dua dadu dilempar bersamaan. Hanya ada 1 titik sampel dengan jumlah = 2, yaitu (1,1). Peluang jumlah kedua dadu BUKAN 2 adalah ...",
    options: ["\\frac{1}{36}", "\\frac{34}{36}", "\\frac{35}{36}", "1"],
    answer: 2,
  },
  {
    n: 6, title: "Komplemen – Bola Berwarna",
    content: "Sebuah kantong berisi 8 bola merah, 5 biru, dan 7 kuning (total 20 bola). Satu bola diambil acak. Peluang terambilnya bola bukan Merah adalah ...",
    diagram: (
      <FreqTable caption="Isi kantong bola"
        headers={["Warna", "Merah", "Biru", "Kuning", "Total"]}
        rows={[["Banyak", 8, 5, 7, 20]]} />
    ),
    options: ["\\frac{2}{5}", "\\frac{3}{5}", "\\frac{1}{4}", "\\frac{3}{4}"],
    answer: 1,
  },
  {
    n: 7, title: "Soal UN – Komplemen Dadu",
    content: "Sebuah dadu dilempar sekali. A = muncul kelipatan 2 = {2, 4, 6}. Menggunakan konsep komplemen, peluang muncul angka yang bukan kelipatan 2 adalah ...",
    options: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
    answer: 2,
  },
  {
    n: 8, title: "Mencari P(A) dari P(A') – Cuaca",
    content: "Peluang tidak hujan hari ini adalah 0,65. Menggunakan rumus P(A) = 1 − P(A'), peluang hujan hari ini adalah ...",
    options: ["0{,}25", "0{,}30", "0{,}35", "0{,}45"],
    answer: 2,
  },
  {
    n: 9, title: "Komplemen – Soal Cerita Ujian",
    content: "Peluang seorang siswa lulus ujian adalah 4/5. Peluang siswa tersebut tidak lulus ujian adalah ...",
    options: ["\\frac{1}{10}", "\\frac{1}{5}", "\\frac{2}{5}", "\\frac{3}{5}"],
    answer: 1,
  },
  {
    n: 10, title: "Komplemen untuk Memudahkan – Kartu 1–20",
    content: "Kartu bernomor 1–20 diacak. Bilangan prima dari 1–20 ada 8 angka (2,3,5,7,11,13,17,19). Peluang terambil kartu bukan prima adalah ...",
    options: ["\\frac{2}{5}", "\\frac{1}{2}", "\\frac{3}{5}", "\\frac{7}{10}"],
    answer: 2,
  },
  {
    n: 11, title: "Komplemen – Spinner Angka 1–8",
    content: "Sebuah spinner dengan 8 sektor sama besar bernomor 1–8. A = jarum berhenti di angka lebih dari 5. Maka A = {6, 7, 8} dan A' = {1, 2, 3, 4, 5}. Nilai P(A') adalah ...",
    options: ["\\frac{3}{8}", "\\frac{1}{2}", "\\frac{5}{8}", "\\frac{3}{4}"],
    answer: 2,
  },
  {
    n: 12, title: "Soal UN – Mencari P(A) dari P(A') yang Diketahui",
    content: "Peluang tidak terpilihnya kelereng merah dari suatu kantong adalah 5/8. Peluang terpilihnya kelereng merah menggunakan komplemen adalah ...",
    options: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{3}{8}", "\\frac{1}{2}"],
    answer: 2,
  },
  {
    n: 13, title: "Komplemen – Dua Koin Dilempar",
    content: "Dua koin dilempar bersamaan. Ruang sampel: {AA, AG, GA, GG}. A = paling sedikit satu Angka. Menggunakan komplemen (A' = GG saja), P(A) adalah ...",
    options: ["\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}", "\\frac{1}{3}"],
    answer: 2,
  },
  {
    n: 14, title: "Komplemen – Kartu Gambar Remi",
    content: "Satu kartu diambil dari 52 kartu remi. A = kartu gambar (J, Q, K) = 12 kartu. P(A) = 3/13. Peluang terambilnya bukan kartu gambar adalah ...",
    options: ["\\frac{3}{13}", "\\frac{9}{13}", "\\frac{10}{13}", "\\frac{11}{13}"],
    answer: 2,
  },
  {
    n: 15, title: "Soal TKA – Komplemen Bola Berwarna",
    content: "Sebuah kantong berisi 3 merah, 4 biru, dan 5 hijau (total 12 bola). Satu bola diambil acak. Peluang terambilnya bola bukan hijau adalah ...",
    options: ["\\frac{5}{12}", "\\frac{1}{2}", "\\frac{7}{12}", "\\frac{2}{3}"],
    answer: 2,
  },
  {
    n: 16, title: "Soal UN – Komplemen dalam Konteks Kelas",
    content: "Di kelas 9 ada 36 siswa. 15 suka Matematika, 12 suka IPA, 9 suka keduanya. Banyak siswa yang suka setidaknya satu pelajaran = 15 + 12 − 9 = 18. Peluang seorang siswa tidak suka keduanya adalah ...",
    diagram: (
      <FreqTable caption="Distribusi minat siswa"
        headers={["Kategori", "Suka Mat", "Suka IPA", "Keduanya", "Total Siswa"]}
        rows={[["Siswa", 15, 12, 9, 36]]} />
    ),
    options: ["\\frac{1}{4}", "\\frac{7}{18}", "\\frac{1}{2}", "\\frac{3}{4}"],
    answer: 2,
  },
  {
    n: 17, title: "Komplemen – Prediksi Cuaca Seminggu",
    content: "Prediksi cuaca 7 hari ke depan, P(Hujan): Senin 0,3 — Selasa 0,5 — Rabu 0,4 — Kamis 0,2 — Jumat 0,6 — Sabtu 0,3 — Minggu 0,1. Pada hari manakah peluang TIDAK hujan paling besar?",
    diagram: (
      <FreqTable caption="Prediksi cuaca 7 hari ke depan"
        headers={["Hari", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]}
        rows={[["P(Hujan)", "0,3", "0,5", "0,4", "0,2", "0,6", "0,3", "0,1"]]} />
    ),
    options: [
      "\\text{Selasa } (P' = 0{,}5)",
      "\\text{Kamis } (P' = 0{,}8)",
      "\\text{Minggu } (P' = 0{,}9)",
      "\\text{Jumat } (P' = 0{,}4)",
    ],
    answer: 2,
  },
  {
    n: 18, title: "Soal UN – Komplemen Tiga Warna Bola",
    content: "Dalam sebuah kantong terdapat bola berwarna. P(merah) = 0,3 dan P(biru) = 0,25. Sisanya adalah bola hijau. Nilai P(hijau) menggunakan komplemen adalah ...",
    options: ["0{,}40", "0{,}45", "0{,}50", "0{,}55"],
    answer: 1,
  },
  {
    n: 19, title: "Komplemen – Kartu Bernomor 1–25",
    content: "Kartu bernomor 1–25 diacak. A' = kelipatan 5 dari 1–25 = {5,10,15,20,25} → n(A') = 5. Nilai P(A) = P(bukan kelipatan 5) adalah ...",
    options: ["\\frac{1}{5}", "\\frac{2}{5}", "\\frac{3}{5}", "\\frac{4}{5}"],
    answer: 3,
  },
  {
    n: 20, title: "Soal ANBK – Komplemen Hobi Siswa",
    content: "Survei hobi 60 siswa: Membaca 20, Olahraga 25, Musik 15. P(Olahraga) = 5/12. Peluang siswa yang TIDAK hobi Olahraga adalah ...",
    diagram: (
      <FreqTable caption="Hasil survei hobi 60 siswa"
        headers={["Hobi", "Membaca", "Olahraga", "Musik", "Total"]}
        rows={[["Siswa", 20, 25, 15, 60]]} />
    ),
    options: ["\\frac{5}{12}", "\\frac{1}{2}", "\\frac{7}{12}", "\\frac{2}{3}"],
    answer: 2,
  },
  {
    n: 21, title: "Soal UN – Komplemen dalam Kehidupan Nyata",
    content: "Peluang sebuah pesawat tiba tepat waktu adalah 0,92. Berapa peluang pesawat TIDAK tiba tepat waktu (terlambat atau dibatalkan)?",
    options: ["0{,}04", "0{,}06", "0{,}08", "0{,}10"],
    answer: 2,
  },
  {
    n: 22, title: "Komplemen – Produk Cacat di Pabrik",
    content: "Peluang suatu produk tidak cacat adalah 0,96. Pabrik memproduksi 5.000 unit. Peluang produk cacat menggunakan komplemen adalah ...",
    options: ["0{,}02", "0{,}04", "0{,}06", "0{,}08"],
    answer: 1,
  },
  {
    n: 23, title: "Soal UN – Komplemen Siswa Membawa Tugas",
    content: "Peluang siswa tidak membawa tugas adalah 1/8. Peluang siswa membawa tugas pada suatu pertemuan adalah ...",
    options: ["\\frac{1}{8}", "\\frac{5}{8}", "\\frac{3}{4}", "\\frac{7}{8}"],
    answer: 3,
  },
  {
    n: 24, title: "Soal TKA – Komplemen Tiga Koin",
    content: "Tiga koin dilempar bersamaan. Ruang sampel ada 8 titik. A = paling sedikit satu Angka. A' = tidak ada Angka sama sekali = {GGG} → P(A') = 1/8. Nilai P(A) adalah ...",
    options: ["\\frac{1}{8}", "\\frac{3}{8}", "\\frac{5}{8}", "\\frac{7}{8}"],
    answer: 3,
  },
];

const OPTS = ["A", "B", "C", "D"];

const KomplementPage = () => {
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
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <FlipHorizontal2 className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1" style={{ textShadow: "0 0 20px rgba(251,113,133,0.7)" }}>
            KOMPLEMEN SUATU KEJADIAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 {questions.length} {t('practice.suffixSoal')} {t('practice.multipleChoice')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
          {totalRevealed > 0 && (
            <div className="mt-2 bg-rose-900/30 border border-rose-500/30 rounded-lg px-4 py-1.5 text-xs font-body text-rose-300">
              Skor: {score} / {totalRevealed} soal dijawab
            </div>
          )}
        </div>
        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
            <BlockMath math="P(A') = 1 - P(A) \quad \Leftrightarrow \quad P(A) + P(A') = 1" />
          </div>
        </div>
        <div className="flex flex-col gap-5 animate-slide-up">
          {questions.map((q, qi) => {
            const sel = selected[q.n];
            const isRevealed = revealed[q.n];
            const hasSel = sel !== undefined;
            return (
              <div key={q.n} className="relative rounded-2xl overflow-hidden" style={{ animationDelay: `${qi * 0.02}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
                <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
                <div className="relative px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                      <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
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
                            cls = "bg-rose-500/25 border border-rose-400/60 text-rose-200";
                          }
                          return (
                            <button key={oi} onClick={() => handleSelect(q.n, oi)}
                              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-all duration-200 ${cls} ${!isRevealed ? "cursor-pointer hover:border-rose-400/40" : "cursor-default"}`}>
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${isRevealed && oi === q.answer ? "bg-emerald-500/30 border-emerald-400" : isRevealed && oi === sel ? "bg-red-500/30 border-red-400" : hasSel && oi === sel ? "bg-rose-500/30 border-rose-400" : "bg-white/10 border-white/20"}`}>
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
                          className="mt-3 text-xs bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 rounded-lg px-4 py-1.5 transition-colors font-body cursor-pointer">
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
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default KomplementPage;
