import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { Target } from "lucide-react";

const FreqTable = ({ headers, rows, caption }: { headers: string[]; rows: (string | number)[][]; caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-emerald-500/30 my-2">
    {caption && <div className="text-[10px] text-emerald-300/70 font-bold text-center pt-2 px-2">{caption}</div>}
    <table className="min-w-full text-xs font-body">
      <thead>
        <tr className="bg-emerald-900/40">
          {headers.map((h, i) => (
            <th key={i} className="px-3 py-2 text-emerald-200 font-bold text-center border-b border-emerald-500/30">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-emerald-900/10"}>
            {row.map((cell, ci) => (
              <td key={ci} className="px-3 py-2 text-center text-white/80 border-b border-white/5">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

type MCQ = {
  n: number;
  title: string;
  content: string;
  diagram?: React.ReactNode;
  options: string[];
  answer: number;
};

const questions: MCQ[] = [
  {
    n: 1, title: "Konsep Frekuensi Harapan – Koin 100 Lemparan",
    content: "Sebuah koin dilempar 100 kali. P(Angka) = 1/2. Frekuensi harapan (fh) muncul sisi Angka dihitung dengan rumus fh = n × P(A). Hasilnya adalah ...",
    options: ["25 kali", "40 kali", "50 kali", "75 kali"],
    answer: 2,
  },
  {
    n: 2, title: "Frekuensi Harapan – Dua Koin 200 Lemparan",
    content: "Dua koin dilempar sebanyak 200 kali. Ruang sampel: {AA, AG, GA, GG}. Frekuensi harapan muncul tepat satu sisi Angka (AG atau GA) adalah ...",
    options: ["50 kali", "75 kali", "100 kali", "150 kali"],
    answer: 2,
  },
  {
    n: 3, title: "Frekuensi Harapan – Bola Berwarna 50 Kali",
    content: "Kantong berisi 4 merah, 3 biru, 3 kuning (total 10 bola). Satu bola diambil lalu dikembalikan sebanyak 50 kali. Frekuensi harapan terambilnya bola Merah adalah ...",
    diagram: (
      <FreqTable
        caption="Isi kantong bola"
        headers={["Warna", "Merah", "Biru", "Kuning", "Total"]}
        rows={[["Banyak", 4, 3, 3, 10]]}
      />
    ),
    options: ["10 kali", "15 kali", "20 kali", "25 kali"],
    answer: 2,
  },
  {
    n: 4, title: "Frekuensi Harapan – Kartu Remi 260 Kali",
    content: "Satu kartu diambil dari 52 kartu remi lalu dikembalikan, dilakukan 260 kali. P(As) = 4/52 = 1/13. Frekuensi harapan terambilnya kartu As adalah ...",
    options: ["10 kali", "15 kali", "20 kali", "26 kali"],
    answer: 2,
  },
  {
    n: 5, title: "Soal UN – Mencari n dari Frekuensi Harapan",
    content: "Sebuah dadu dilempar beberapa kali. Frekuensi harapan muncul angka 6 adalah 25 kali. Jika P(6) = 1/6, maka total percobaan yang dilakukan adalah ...",
    options: ["100 kali", "120 kali", "150 kali", "180 kali"],
    answer: 2,
  },
  {
    n: 6, title: "Frekuensi Harapan – Produk Cacat Pabrik",
    content: "Sebuah mesin memproduksi barang dengan peluang cacat 0,04. Mesin menghasilkan 2.500 barang. Frekuensi harapan barang cacat adalah ...",
    options: ["75 barang", "100 barang", "125 barang", "200 barang"],
    answer: 1,
  },
  {
    n: 7, title: "Frekuensi Harapan – Spinner 4 Warna, 800 Putaran",
    content: "Spinner dibagi 4 sektor: Merah 1/4, Biru 1/4, Kuning 3/8, Hijau 1/8. Spinner diputar 800 kali. Frekuensi harapan muncul warna Kuning adalah ...",
    diagram: (
      <FreqTable
        caption="Peluang tiap warna pada spinner"
        headers={["Warna", "Merah", "Biru", "Kuning", "Hijau", "Total"]}
        rows={[["Peluang", "1/4", "1/4", "3/8", "1/8", "1"]]}
      />
    ),
    options: ["200 kali", "250 kali", "300 kali", "350 kali"],
    answer: 2,
  },
  {
    n: 8, title: "Soal TKA – Frekuensi Harapan Bola Campuran",
    content: "Kantong berisi 6 merah, 4 biru, 5 kuning, 5 putih (total 20 bola). Pengambilan dengan pengembalian 100 kali. Frekuensi harapan terambilnya bola Merah adalah ...",
    diagram: (
      <FreqTable
        caption="Isi kantong bola (total 20)"
        headers={["Warna", "Merah", "Biru", "Kuning", "Putih", "Total"]}
        rows={[["n bola", 6, 4, 5, 5, 20]]}
      />
    ),
    options: ["20 kali", "25 kali", "30 kali", "35 kali"],
    answer: 2,
  },
  {
    n: 9, title: "Frekuensi Harapan – Nilai Ulangan",
    content: "Peluang seorang siswa mendapat nilai ≥ 80 pada ulangan adalah 0,6. Dalam 1 semester ada 5 ulangan. Frekuensi harapan siswa mendapat nilai ≥ 80 adalah ...",
    options: ["2 kali", "3 kali", "4 kali", "5 kali"],
    answer: 1,
  },
  {
    n: 10, title: "Soal UN – Menentukan n dari Frekuensi Harapan",
    content: "Peluang sebuah lampu cacat adalah 1/50. Frekuensi harapan lampu cacat adalah 30 buah. Banyak lampu yang diproduksi adalah ...",
    options: ["1.000 buah", "1.200 buah", "1.500 buah", "2.000 buah"],
    answer: 2,
  },
  {
    n: 11, title: "Soal UN – Frekuensi Harapan Kartu ♠",
    content: "Satu kartu diambil dari 52 kartu remi (dengan pengembalian) sebanyak 104 kali. P(♠) = 13/52 = 1/4. Frekuensi harapan terambilnya kartu ♠ adalah ...",
    options: ["13 kali", "20 kali", "26 kali", "30 kali"],
    answer: 2,
  },
  {
    n: 12, title: "Soal ANBK – Menentukan n dari fh Bola Merah",
    content: "Sebuah kotak berisi 3 merah dan 7 putih. Pengambilan dengan pengembalian dilakukan n kali. Diharapkan bola merah muncul 24 kali. Nilai n adalah ...",
    options: ["60 kali", "70 kali", "80 kali", "90 kali"],
    answer: 2,
  },
  {
    n: 13, title: "Frekuensi Harapan – Kelahiran Bayi",
    content: "Peluang lahirnya bayi laki-laki adalah 0,52. Di suatu desa diperkirakan ada 250 kelahiran dalam setahun. Frekuensi harapan bayi laki-laki adalah ...",
    options: ["100 bayi", "110 bayi", "120 bayi", "130 bayi"],
    answer: 3,
  },
  {
    n: 14, title: "Soal UN – Frekuensi Harapan Pertandingan",
    content: "Peluang tim A menang dalam setiap pertandingan adalah 3/5. Tim A akan bermain 20 pertandingan. Frekuensi harapan kemenangan tim A adalah ...",
    options: ["8 kali", "10 kali", "12 kali", "15 kali"],
    answer: 2,
  },
  {
    n: 15, title: "Soal UN – Frekuensi Harapan dari Rasio Bola",
    content: "Kantong berisi bola merah dan biru dengan rasio 2:3. Satu bola diambil (dengan pengembalian) sebanyak 150 kali. P(Merah) = 2/5. Frekuensi harapan bola Merah adalah ...",
    options: ["40 kali", "50 kali", "60 kali", "75 kali"],
    answer: 2,
  },
  {
    n: 16, title: "Frekuensi Harapan – Pasien Sembuh",
    content: "Peluang suatu obat berhasil menyembuhkan adalah 0,9. Obat diberikan kepada 300 pasien. Frekuensi harapan pasien yang sembuh adalah ...",
    options: ["240 pasien", "250 pasien", "270 pasien", "280 pasien"],
    answer: 2,
  },
  {
    n: 17, title: "Frekuensi Harapan – Turnamen Basket",
    content: "Tim basket memiliki peluang menang 2/3 per pertandingan. Dalam satu musim mereka bermain 36 pertandingan. Frekuensi harapan kemenangan adalah ...",
    options: ["18 kali", "20 kali", "24 kali", "27 kali"],
    answer: 2,
  },
  {
    n: 18, title: "Soal ANBK – Frekuensi Harapan Kecelakaan",
    content: "Peluang seseorang mengalami kecelakaan dalam setahun adalah 0,02. Perusahaan asuransi memiliki 5.000 nasabah. Frekuensi harapan nasabah yang mengalami kecelakaan adalah ...",
    options: ["50 orang", "75 orang", "100 orang", "150 orang"],
    answer: 2,
  },
  {
    n: 19, title: "Soal TKA – Frekuensi Harapan dari Rating TV",
    content: "Rating 4 saluran TV dari 400 pemirsa: A=160, B=120, C=80, D=40. Jika disurvei 1.000 pemirsa acak, frekuensi harapan pemirsa saluran B adalah ...",
    diagram: (
      <FreqTable
        caption="Rating 4 saluran TV (total pemirsa: 400)"
        headers={["Saluran", "A", "B", "C", "D", "Total"]}
        rows={[["Pemirsa", 160, 120, 80, 40, 400]]}
      />
    ),
    options: ["200 orang", "250 orang", "300 orang", "350 orang"],
    answer: 2,
  },
  {
    n: 20, title: "Frekuensi Harapan – Prediksi Cuaca Hujan",
    content: "Berdasarkan data 10 tahun, peluang hujan pada bulan Juli di suatu kota adalah 0,3. Bulan Juli memiliki 31 hari. Frekuensi harapan hari hujan di bulan Juli adalah ...",
    options: ["6,2 hari", "7,5 hari", "9,3 hari", "12,4 hari"],
    answer: 2,
  },
  {
    n: 21, title: "Soal TKA – Membandingkan fh Dua Siswa",
    content: "Peluang siswa A lulus ujian = 0,8 dan siswa B = 0,75. Keduanya mengikuti 20 ujian. Selisih frekuensi harapan kelulusan A dan B adalah ...",
    options: ["0 kali", "1 kali", "2 kali", "3 kali"],
    answer: 1,
  },
  {
    n: 22, title: "Frekuensi Harapan – Bayi Kembar",
    content: "Peluang seorang ibu melahirkan bayi kembar adalah 1/80. Di suatu kota terdapat 4.000 ibu hamil dalam setahun. Frekuensi harapan kelahiran kembar adalah ...",
    options: ["25 kali", "40 kali", "50 kali", "80 kali"],
    answer: 2,
  },
  {
    n: 23, title: "Soal ANBK – Frekuensi Harapan Penembak",
    content: "Seorang penembak memiliki peluang mengenai sasaran 4/5. Ia menembak 50 kali. Frekuensi harapan mengenai sasaran adalah ...",
    options: ["30 kali", "35 kali", "40 kali", "45 kali"],
    answer: 2,
  },
  {
    n: 24, title: "Soal UN Level Tinggi – Perbandingan 3 Warna Bola",
    content: "Kantong berisi bola dengan perbandingan merah : biru : hijau = 3 : 4 : 5 (total 12 bagian). Percobaan dilakukan 480 kali dengan pengembalian. Frekuensi harapan bola Hijau adalah ...",
    options: ["120 kali", "160 kali", "200 kali", "240 kali"],
    answer: 2,
  },
];

const OPTS = ["A", "B", "C", "D"];

const FrekuensiHarapanPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (qn: number, idx: number) => {
    if (revealed[qn]) return;
    setSelected(s => ({ ...s, [qn]: idx }));
  };

  const handleReveal = (qn: number) => {
    setRevealed(r => ({ ...r, [qn]: true }));
  };

  const score = questions.filter(q => revealed[q.n] && selected[q.n] === q.answer).length;
  const totalRevealed = Object.keys(revealed).length;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <Target className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: "0 0 20px rgba(52,211,153,0.7)" }}>
            FREKUENSI HARAPAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 {questions.length} Soal Pilihan Ganda</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
          {totalRevealed > 0 && (
            <div className="mt-2 bg-emerald-900/30 border border-emerald-500/30 rounded-lg px-4 py-1.5 text-xs font-body text-emerald-300">
              Skor: {score} / {totalRevealed} soal dijawab
            </div>
          )}
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
            <BlockMath math="f_h = n \times P(A)" />
          </div>
          <p className="text-white/50 text-xs font-body text-center mt-1">fh = frekuensi harapan · n = banyak percobaan · P(A) = peluang kejadian</p>
        </div>

        <div className="flex flex-col gap-5 animate-slide-up">
          {questions.map((q, qi) => {
            const sel = selected[q.n];
            const isRevealed = revealed[q.n];
            const hasSel = sel !== undefined;
            return (
              <div key={q.n} className="relative rounded-2xl overflow-hidden" style={{ animationDelay: `${qi * 0.02}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
                <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
                <div className="relative px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                      <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                        {q.title}
                      </span>
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
                            cls = "bg-emerald-500/25 border border-emerald-400/60 text-emerald-200";
                          }
                          return (
                            <button key={oi} onClick={() => handleSelect(q.n, oi)}
                              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-all duration-200 ${cls} ${!isRevealed ? "cursor-pointer hover:border-emerald-400/40" : "cursor-default"}`}>
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${isRevealed && oi === q.answer ? "bg-emerald-500/30 border-emerald-400" : isRevealed && oi === sel ? "bg-red-500/30 border-red-400" : hasSel && oi === sel ? "bg-emerald-500/30 border-emerald-400/70" : "bg-white/10 border-white/20"}`}>
                                {OPTS[oi]}
                              </span>
                              <span className="font-body text-sm">{opt}</span>
                              {isRevealed && oi === q.answer && <span className="ml-auto text-emerald-400 text-xs font-bold">✓ Benar</span>}
                              {isRevealed && oi === sel && oi !== q.answer && <span className="ml-auto text-red-400 text-xs font-bold">✗ Salah</span>}
                            </button>
                          );
                        })}
                      </div>
                      {hasSel && !isRevealed && (
                        <button onClick={() => handleReveal(q.n)}
                          className="mt-3 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 rounded-lg px-4 py-1.5 transition-colors font-body cursor-pointer">
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
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrekuensiHarapanPage;
