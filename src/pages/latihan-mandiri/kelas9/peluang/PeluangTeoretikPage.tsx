import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Calculator } from "lucide-react";

const FreqTable = ({ headers, rows, caption }: { headers: string[]; rows: (string | number)[][]; caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-violet-500/30 my-2">
    {caption && <div className="text-[10px] text-violet-300/70 font-bold text-center pt-2 px-2">{caption}</div>}
    <table className="min-w-full text-xs font-body">
      <thead>
        <tr className="bg-violet-900/40">
          {headers.map((h, i) => <th key={i} className="px-3 py-2 text-violet-200 font-bold text-center border-b border-violet-500/30">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-violet-900/10"}>
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
    n: 1, title: "Peluang – Dadu Angka Prima",
    content: "Sebuah dadu dilempar sekali. Angka prima pada dadu adalah 2, 3, dan 5. Peluang muncul angka prima adalah ...",
    options: ["\\frac{1}{6}", "\\frac{1}{2}", "\\frac{2}{3}", "\\frac{1}{3}"],
    answer: 1,
  },
  {
    n: 2, title: "Peluang – Koin Tunggal",
    content: "Sebuah koin dilempar sekali. Ruang sampelnya adalah {Angka, Gambar}. Peluang muncul sisi Angka adalah ...",
    options: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "1"],
    answer: 2,
  },
  {
    n: 3, title: "Peluang – Dua Koin Bersamaan",
    content: "Dua koin dilempar bersamaan. Ruang sampelnya adalah {AA, AG, GA, GG}. Peluang muncul tepat satu sisi Angka adalah ...",
    options: ["\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}", "\\frac{1}{3}"],
    answer: 1,
  },
  {
    n: 4, title: "Peluang – Dua Dadu, Jumlah 7",
    content: "Dua dadu dilempar bersamaan. Ruang sampelnya terdiri dari 36 titik sampel. Peluang jumlah kedua dadu sama dengan 7 adalah ...",
    options: ["\\frac{5}{36}", "\\frac{1}{6}", "\\frac{7}{36}", "\\frac{1}{9}"],
    answer: 1,
  },
  {
    n: 5, title: "Peluang Kartu – As dari Remi",
    content: "Satu kartu diambil secara acak dari 52 kartu remi. Peluang terambilnya kartu As adalah ...",
    options: ["\\frac{1}{52}", "\\frac{1}{26}", "\\frac{1}{13}", "\\frac{4}{13}"],
    answer: 2,
  },
  {
    n: 6, title: "Peluang Kartu – Kartu Merah",
    content: "Satu kartu diambil secara acak dari 52 kartu remi. Kartu merah terdiri dari ♥ dan ♦. Peluang terambilnya kartu merah adalah ...",
    options: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
    answer: 2,
  },
  {
    n: 7, title: "Peluang – Bola dalam Kantong",
    content: "Sebuah kantong berisi 6 bola merah, 4 bola biru, dan 2 bola kuning (total 12 bola). Satu bola diambil secara acak. Peluang terambilnya bola biru adalah ...",
    options: ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}"],
    answer: 2,
  },
  {
    n: 8, title: "Peluang – Kartu Bernomor 1–20",
    content: "Kartu bernomor 1 sampai 20 disimpan dalam kotak. Satu kartu diambil secara acak. Banyak bilangan prima dari 1–20 adalah 8 (yaitu 2,3,5,7,11,13,17,19). Peluang terambilnya kartu bernomor prima adalah ...",
    options: ["\\frac{7}{20}", "\\frac{2}{5}", "\\frac{9}{20}", "\\frac{3}{10}"],
    answer: 1,
  },
  {
    n: 9, title: "Peluang Dua Dadu – Jumlah Genap",
    content: "Dua dadu dilempar bersamaan (ruang sampel 36 titik). Banyaknya titik sampel dengan jumlah genap adalah 18. Peluang jumlah kedua dadu genap adalah ...",
    options: ["\\frac{1}{3}", "\\frac{5}{12}", "\\frac{1}{2}", "\\frac{7}{12}"],
    answer: 2,
  },
  {
    n: 10, title: "Peluang – Spinner 8 Sektor",
    content: "Sebuah spinner dibagi menjadi 8 sektor sama besar bernomor 1 sampai 8. Spinner diputar sekali. Peluang jarum berhenti di angka prima (2, 3, 5, 7) adalah ...",
    options: ["\\frac{3}{8}", "\\frac{1}{2}", "\\frac{5}{8}", "\\frac{1}{4}"],
    answer: 1,
  },
  {
    n: 11, title: "Peluang – Kelereng Campuran",
    content: "Sebuah kotak berisi 5 kelereng merah, 3 putih, 7 hijau, dan 5 hitam (total 20). Satu kelereng diambil acak. Peluang terambilnya kelereng Merah atau Hitam adalah ...",
    options: ["\\frac{9}{20}", "\\frac{1}{2}", "\\frac{11}{20}", "\\frac{7}{20}"],
    answer: 1,
  },
  {
    n: 12, title: "Soal UN – Peluang Bola",
    content: "Dalam sebuah kantong terdapat 5 bola merah, 3 bola putih, dan 2 bola kuning. Satu bola diambil secara acak. Peluang terambilnya bola putih adalah ...",
    options: ["\\frac{1}{5}", "\\frac{3}{10}", "\\frac{2}{5}", "\\frac{1}{2}"],
    answer: 1,
  },
  {
    n: 13, title: "Peluang – Dua Dadu, Hasil Kali 12",
    content: "Dua dadu dilempar bersamaan. Titik sampel dengan hasil kali 12 adalah (2,6), (3,4), (4,3), (6,2). Peluang hasil kali kedua dadu sama dengan 12 adalah ...",
    options: ["\\frac{1}{12}", "\\frac{1}{9}", "\\frac{5}{36}", "\\frac{1}{6}"],
    answer: 1,
  },
  {
    n: 14, title: "Peluang – Kartu As Merah",
    content: "Satu kartu diambil dari 52 kartu remi. Kartu As Merah adalah As ♥ dan As ♦. Peluang terambilnya kartu As Merah adalah ...",
    options: ["\\frac{1}{52}", "\\frac{1}{26}", "\\frac{1}{13}", "\\frac{2}{13}"],
    answer: 1,
  },
  {
    n: 15, title: "Peluang – Undi Nama Kelas",
    content: "Kelas 9A terdiri dari 15 siswa perempuan dan 10 siswa laki-laki. Satu siswa dipilih secara acak sebagai pembawa bendera. Peluang terpilihnya siswa perempuan adalah ...",
    options: ["\\frac{2}{5}", "\\frac{12}{25}", "\\frac{3}{5}", "\\frac{13}{25}"],
    answer: 2,
  },
  {
    n: 16, title: "Soal TKA – Peluang dari Proporsi",
    content: "Data hobi 40 siswa: Membaca 12, Olahraga 15, Musik 8, Gaming 5. Satu siswa dipilih acak. Peluang terpilihnya siswa yang hobi Olahraga adalah ...",
    options: ["\\frac{3}{10}", "\\frac{3}{8}", "\\frac{1}{5}", "\\frac{1}{8}"],
    answer: 1,
  },
  {
    n: 17, title: "Soal UN – Menghitung Banyak Bola dari Peluang",
    content: "Sebuah kantong berisi bola merah dan bola biru. Peluang terambil bola merah adalah 3/7. Jika total ada 21 bola, berapa banyak bola merah dalam kantong tersebut?",
    options: ["6 bola", "7 bola", "9 bola", "12 bola"],
    answer: 2,
  },
  {
    n: 18, title: "Soal TKA – Peluang Kartu Bernilai ≤ 3",
    content: "Dari 52 kartu remi, satu kartu diambil acak. Kartu bernilai ≤ 3 mencakup As (4 kartu), 2 (4 kartu), dan 3 (4 kartu). Peluang terambilnya kartu bernilai ≤ 3 adalah ...",
    options: ["\\frac{1}{13}", "\\frac{2}{13}", "\\frac{3}{13}", "\\frac{3}{52}"],
    answer: 2,
  },
  {
    n: 19, title: "Soal UN – Membandingkan Peluang Dua Kantong",
    content: "Kantong A berisi 3 merah dan 2 biru. Kantong B berisi 4 merah dan 1 biru. Manakah pernyataan berikut yang benar?",
    options: [
      "P(\\text{Merah}|A) = P(\\text{Merah}|B) = \\frac{3}{5}",
      "P(\\text{Merah}|A) = \\frac{3}{5} \\text{ lebih besar dari } P(\\text{Merah}|B) = \\frac{4}{5}",
      "P(\\text{Merah}|B) = \\frac{4}{5} \\text{ lebih besar dari } P(\\text{Merah}|A) = \\frac{3}{5}",
      "P(\\text{Merah}|A) = \\frac{1}{2} \\text{ dan } P(\\text{Merah}|B) = \\frac{4}{5}",
    ],
    answer: 2,
  },
  {
    n: 20, title: "Soal TKA – Peluang dengan Perbandingan Bola",
    content: "Perbandingan bola merah : biru : hijau dalam kotak adalah 2 : 3 : 5. Satu bola diambil secara acak. Peluang terambilnya bola hijau adalah ...",
    options: ["\\frac{1}{5}", "\\frac{3}{10}", "\\frac{2}{5}", "\\frac{1}{2}"],
    answer: 3,
  },
  {
    n: 21, title: "Soal UN – Koin, Dadu, dan Kartu Angka",
    content: "Sebuah koin dilempar, sebuah dadu dilempar, dan satu kartu diambil dari 4 kartu bernomor 1–4. Berapa banyak titik sampel dalam ruang sampel gabungan tersebut?",
    options: ["12", "24", "48", "36"],
    answer: 2,
  },
  {
    n: 22, title: "Soal UN Level Tinggi – Mencari Banyak Bola",
    content: "Kantong berisi bola merah (m) dan bola biru, total awalnya 10 bola. Jika 1 bola merah ditambahkan, peluang terambil merah menjadi 1/2. Berapa banyak bola merah semula?",
    options: ["3 bola", "4 bola", "5 bola", "6 bola"],
    answer: 2,
  },
];

const OPTS = ["A", "B", "C", "D"];

const PeluangTeoretikPage = () => {
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
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <Calculator className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1" style={{ textShadow: "0 0 20px rgba(167,139,250,0.7)" }}>
            PELUANG TEORETIK
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 {questions.length} {t('practice.suffixSoal')} {t('practice.multipleChoice')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
          {totalRevealed > 0 && (
            <div className="mt-2 bg-violet-900/30 border border-violet-500/30 rounded-lg px-4 py-1.5 text-xs font-body text-violet-300">
              Skor: {score} / {totalRevealed} soal dijawab
            </div>
          )}
        </div>
        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
            <BlockMath math="P(A) = \frac{n(A)}{n(S)}, \quad 0 \leq P(A) \leq 1" />
          </div>
        </div>
        <div className="flex flex-col gap-5 animate-slide-up">
          {questions.map((q, qi) => {
            const sel = selected[q.n];
            const isRevealed = revealed[q.n];
            const hasSel = sel !== undefined;
            return (
              <div key={q.n} className="relative rounded-2xl overflow-hidden" style={{ animationDelay: `${qi * 0.02}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
                <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl" />
                <div className="relative px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                      <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
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
                            cls = "bg-violet-500/25 border border-violet-400/60 text-violet-200";
                          }
                          return (
                            <button key={oi} onClick={() => handleSelect(q.n, oi)}
                              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-all duration-200 ${cls} ${!isRevealed ? "cursor-pointer hover:border-violet-400/40" : "cursor-default"}`}>
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${isRevealed && oi === q.answer ? "bg-emerald-500/30 border-emerald-400" : isRevealed && oi === sel ? "bg-red-500/30 border-red-400" : hasSel && oi === sel ? "bg-violet-500/30 border-violet-400" : "bg-white/10 border-white/20"}`}>
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
                          className="mt-3 text-xs bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/40 text-violet-300 rounded-lg px-4 py-1.5 transition-colors font-body cursor-pointer">
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
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeluangTeoretikPage;
