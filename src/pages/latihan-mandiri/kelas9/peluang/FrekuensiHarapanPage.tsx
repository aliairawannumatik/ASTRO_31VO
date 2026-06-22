import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
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

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Konsep Frekuensi Harapan", {
    type: "mixed",
    content: "Sebuah koin dilempar 100 kali. Berapakah frekuensi harapan muncul sisi Angka?",
    parts: [
      { label: "a.", math: "P(\\text{Angka}) = \\frac{1}{2}" },
      { label: "b.", math: "f_h(\\text{Angka}) = n \\times P(A) = 100 \\times \\frac{1}{2} = \\ldots" },
      { label: "c.", text: "Apakah frekuensi harapan sama dengan frekuensi yang pasti terjadi? Jelaskan." },
    ],
  }),
  Qn(2, "Frekuensi Harapan – Dua Koin", {
    type: "mixed",
    content: "Dua koin dilempar sebanyak 200 kali. S = {AA, AG, GA, GG}.",
    parts: [
      { label: "a.", math: "P(\\text{AA}) = \\frac{1}{4} \\Rightarrow f_h(\\text{AA}) = 200 \\times \\frac{1}{4} = \\ldots" },
      { label: "b.", math: "P(\\text{tepat 1 Angka}) = \\frac{2}{4} \\Rightarrow f_h = 200 \\times \\frac{1}{2} = \\ldots" },
      { label: "c.", math: "P(\\text{GG}) = \\frac{1}{4} \\Rightarrow f_h(\\text{GG}) = \\ldots" },
    ],
  }),
  Qn(3, "Frekuensi Harapan – Bola Berwarna", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Isi kantong bola"
        headers={["Warna","Merah","Biru","Kuning","Total"]}
        rows={[["Banyak",4,3,3,10]]}
      />
    ),
    content: "Dari kantong di atas, satu bola diambil lalu dikembalikan. Percobaan dilakukan 50 kali.",
    parts: [
      { label: "a.", math: "f_h(\\text{Merah}) = 50 \\times \\frac{4}{10} = \\ldots" },
      { label: "b.", math: "f_h(\\text{Biru}) = 50 \\times \\frac{3}{10} = \\ldots" },
      { label: "c.", math: "f_h(\\text{bukan Merah}) = 50 \\times \\frac{6}{10} = \\ldots" },
    ],
  }),
  Qn(4, "Frekuensi Harapan – Kartu Remi", {
    type: "mixed",
    content: "Satu kartu diambil dari 52 kartu remi lalu dikembalikan. Percobaan dilakukan 260 kali.",
    parts: [
      { label: "a.", math: "f_h(\\text{As}) = 260 \\times \\frac{4}{52} = 260 \\times \\frac{1}{13} = \\ldots" },
      { label: "b.", math: "f_h(\\text{merah}) = 260 \\times \\frac{26}{52} = 260 \\times \\frac{1}{2} = \\ldots" },
      { label: "c.", math: "f_h(\\text{kartu gambar}) = 260 \\times \\frac{12}{52} = \\ldots" },
    ],
  }),
  Qn(5, "Soal UN – Mencari n dari fh", {
    type: "mixed",
    content: "Sebuah dadu dilempar beberapa kali. Frekuensi harapan muncul angka 6 adalah 25.",
    parts: [
      { label: "a.", math: "f_h = n \\times P(6) = n \\times \\frac{1}{6} = 25" },
      { label: "b.", math: "n = 25 \\times 6 = \\ldots" },
      { label: "c.", math: "f_h(\\text{bukan 6}) = n - 25 = \\ldots" },
    ],
  }),
  Qn(6, "Frekuensi Harapan – Soal Cerita Produksi", {
    type: "mixed",
    content: "Sebuah mesin memproduksi barang dengan peluang cacat 0,04. Jika mesin beroperasi menghasilkan 2500 barang, berapa frekuensi harapan barang cacat?",
    parts: [
      { label: "a.", math: "f_h(\\text{cacat}) = 2500 \\times 0{,}04 = \\ldots" },
      { label: "b.", math: "f_h(\\text{tidak cacat}) = 2500 - \\ldots = \\ldots" },
      { label: "c.", text: "Berapa persen barang yang diharapkan tidak cacat?" },
    ],
  }),
  Qn(7, "Frekuensi Harapan – Spinner 4 Bagian", {
    type: "mixed",
    content: "Sebuah spinner dibagi 4 sektor: Merah (1/4), Biru (1/4), Kuning (3/8), Hijau (1/8). Spinner diputar 800 kali.",
    diagram: (
      <FreqTable
        caption="Peluang dan frekuensi harapan spinner"
        headers={["Warna","Peluang","fh (800 putaran)"]}
        rows={[
          ["Merah","1/4","?"],
          ["Biru","1/4","?"],
          ["Kuning","3/8","?"],
          ["Hijau","1/8","?"],
          ["Total","1","800"],
        ]}
      />
    ),
    parts: [
      { label: "a.", math: "f_h(\\text{Kuning}) = 800 \\times \\frac{3}{8} = \\ldots" },
      { label: "b.", text: "Lengkapi tabel di atas." },
      { label: "c.", text: "Verifikasi: jumlah semua fh = 800." },
    ],
  }),
  Qn(8, "Soal TKA – Frekuensi Harapan Kompleks", {
    type: "mixed",
    content: "Dalam kantong terdapat 6 bola merah, 4 biru, 5 kuning, dan 5 putih. Pengambilan (dengan pengembalian) dilakukan 100 kali.",
    diagram: (
      <FreqTable
        caption="fh pengambilan bola 100 kali"
        headers={["Warna","n bola","P","fh"]}
        rows={[["Merah",6,"6/20","?"],["Biru",4,"4/20","?"],["Kuning",5,"5/20","?"],["Putih",5,"5/20","?"],["Total",20,"1","100"]]}
      />
    ),
    parts: [
      { label: "a.", text: "Lengkapi kolom fh pada tabel." },
      { label: "b.", text: "Warna apa yang paling sering diharapkan muncul?" },
      { label: "c.", text: "Berapa fh untuk bola berwarna selain merah?" },
    ],
  }),
  Qn(9, "Frekuensi Harapan – Ulangan Harian", {
    type: "mixed",
    content: "Peluang seorang siswa mendapat nilai ≥ 80 pada ulangan adalah 0,6. Jika ada 5 ulangan dalam semester, berapa kali frekuensi harapan siswa mendapat nilai ≥ 80?",
    parts: [
      { label: "a.", math: "f_h = 5 \\times 0{,}6 = \\ldots" },
      { label: "b.", math: "f_h(\\text{nilai} < 80) = 5 - \\ldots = \\ldots" },
      { label: "c.", text: "Apakah ini berarti siswa pasti mendapat nilai ≥ 80 sebanyak 3 kali? Jelaskan." },
    ],
  }),
  Qn(10, "Soal UN – Menentukan n dari fh", {
    type: "mixed",
    content: "Peluang sebuah lampu cacat adalah 1/50. Frekuensi harapan lampu cacat adalah 30.",
    parts: [
      { label: "a.", math: "f_h = n \\times P \\Rightarrow 30 = n \\times \\frac{1}{50}" },
      { label: "b.", math: "n = 30 \\times 50 = \\ldots" },
      { label: "c.", text: "Berapa frekuensi harapan lampu tidak cacat?" },
    ],
  }),
  Qn(11, "Soal UN – Frekuensi Harapan Kartu", {
    type: "mixed",
    content: "Satu kartu diambil dari 52 kartu remi (dengan pengembalian), 104 kali.",
    parts: [
      { label: "a.", math: "f_h(\\text{♠}) = 104 \\times \\frac{13}{52} = \\ldots" },
      { label: "b.", math: "f_h(\\text{As ♥}) = 104 \\times \\frac{1}{52} = \\ldots" },
      { label: "c.", math: "f_h(\\text{kartu merah gambar}) = 104 \\times \\frac{6}{52} = \\ldots" },
    ],
  }),
  Qn(12, "Soal ANBK – Interpretasi fh", {
    type: "mixed",
    content: "Sebuah kotak berisi 3 bola merah dan 7 bola putih. Pengambilan (dengan pengembalian) dilakukan n kali. Diharapkan bola merah muncul 24 kali.",
    parts: [
      { label: "a.", math: "P(\\text{Merah}) = \\frac{3}{10}" },
      { label: "b.", math: "n \\times \\frac{3}{10} = 24 \\Rightarrow n = \\ldots" },
      { label: "c.", math: "f_h(\\text{Putih}) = n - 24 = \\ldots" },
    ],
  }),
  Qn(13, "Frekuensi Harapan – Kelahiran Bayi", {
    type: "mixed",
    content: "Peluang lahirnya bayi laki-laki adalah 0,52. Di suatu desa diperkirakan akan ada 250 kelahiran dalam setahun.",
    parts: [
      { label: "a.", math: "f_h(\\text{bayi laki-laki}) = 250 \\times 0{,}52 = \\ldots" },
      { label: "b.", math: "f_h(\\text{bayi perempuan}) = 250 \\times 0{,}48 = \\ldots" },
      { label: "c.", text: "Apakah jumlah bayi laki-laki dan perempuan pasti sesuai fh? Jelaskan." },
    ],
  }),
  Qn(14, "Soal UN – fh dengan Peluang Pecahan", {
    type: "mixed",
    content: "Peluang tim A menang dalam setiap pertandingan adalah 3/5. Tim A akan bermain 20 pertandingan.",
    parts: [
      { label: "a.", math: "f_h(\\text{menang}) = 20 \\times \\frac{3}{5} = \\ldots" },
      { label: "b.", math: "f_h(\\text{tidak menang}) = 20 - \\ldots = \\ldots" },
      { label: "c.", text: "Jika seri diabaikan (hanya menang/kalah), berapa fh kalah?" },
    ],
  }),
  Qn(15, "Soal UN – fh dari Rasio Bola", {
    type: "mixed",
    content: "Kantong berisi bola merah dan biru dengan rasio 2:3. Satu bola diambil (dengan pengembalian) 150 kali.",
    parts: [
      { label: "a.", math: "P(\\text{Merah}) = \\frac{2}{2+3} = \\frac{2}{5}" },
      { label: "b.", math: "f_h(\\text{Merah}) = 150 \\times \\frac{2}{5} = \\ldots" },
      { label: "c.", math: "f_h(\\text{Biru}) = 150 - \\ldots = \\ldots" },
    ],
  }),
  Qn(16, "Frekuensi Harapan – Soal Obat", {
    type: "mixed",
    content: "Peluang suatu obat berhasil menyembuhkan adalah 0,9. Obat diberikan kepada 300 pasien.",
    parts: [
      { label: "a.", math: "f_h(\\text{sembuh}) = 300 \\times 0{,}9 = \\ldots" },
      { label: "b.", math: "f_h(\\text{tidak sembuh}) = 300 \\times 0{,}1 = \\ldots" },
      { label: "c.", text: "Dokter menargetkan 280 pasien sembuh. Apakah obat ini cukup efektif?" },
    ],
  }),
  Qn(17, "Frekuensi Harapan – Turnamen Basket", {
    type: "mixed",
    content: "Tim basket A memiliki peluang menang 2/3 per pertandingan. Dalam satu musim, mereka bermain 36 pertandingan.",
    parts: [
      { label: "a.", math: "f_h(\\text{menang}) = 36 \\times \\frac{2}{3} = \\ldots" },
      { label: "b.", math: "f_h(\\text{kalah}) = 36 \\times \\frac{1}{3} = \\ldots" },
      { label: "c.", text: "Jika setiap kemenangan mendapat 3 poin, berapa total poin yang diharapkan?" },
    ],
  }),
  Qn(18, "Soal ANBK – Konteks Nyata", {
    type: "mixed",
    content: "Sebuah perusahaan asuransi mencatat bahwa peluang seseorang mengalami kecelakaan dalam setahun adalah 0,02. Perusahaan memiliki 5.000 nasabah.",
    parts: [
      { label: "a.", math: "f_h(\\text{kecelakaan}) = 5000 \\times 0{,}02 = \\ldots" },
      { label: "b.", math: "f_h(\\text{tidak kecelakaan}) = 5000 - \\ldots = \\ldots" },
      { label: "c.", text: "Jika premi asuransi Rp500.000/orang, berapa estimasi total klaim yang harus disiapkan?" },
    ],
  }),
  Qn(19, "Soal TKA – Frekuensi Harapan Acara TV", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Rating 4 saluran TV (total pemirsa: 400)"
        headers={["Saluran","A","B","C","D"]}
        rows={[["Pemirsa",160,120,80,40]]}
      />
    ),
    content: "Jika disurvei 1.000 pemirsa acak, berapa fh pemirsa tiap saluran?",
    parts: [
      { label: "a.", math: "P(A) = \\frac{160}{400} = 0{,}4 \\Rightarrow f_h(A) = 1000 \\times 0{,}4 = \\ldots" },
      { label: "b.", text: "Hitung fh untuk saluran B, C, dan D." },
      { label: "c.", text: "Verifikasi: jumlah semua fh = 1000." },
    ],
  }),
  Qn(20, "Konteks Nyata – Kondisi Cuaca", {
    type: "mixed",
    content: "Berdasarkan data 10 tahun, peluang hujan pada bulan Juli di suatu kota adalah 0,3. Bulan Juli memiliki 31 hari.",
    parts: [
      { label: "a.", math: "f_h(\\text{hujan di Juli}) = 31 \\times 0{,}3 = \\ldots \\text{ hari}" },
      { label: "b.", math: "f_h(\\text{tidak hujan}) = 31 - \\ldots = \\ldots \\text{ hari}" },
      { label: "c.", text: "Berapa frekuensi harapan hujan dalam 10 tahun (10 × 31 hari)?" },
    ],
  }),
  Qn(21, "Soal TKA – Dua Peristiwa Bebas", {
    type: "mixed",
    content: "Peluang siswa A lulus ujian = 0,8 dan peluang siswa B lulus = 0,75. Keduanya ikut 20 ujian.",
    parts: [
      { label: "a.", math: "f_h(\\text{A lulus}) = 20 \\times 0{,}8 = \\ldots" },
      { label: "b.", math: "f_h(\\text{B lulus}) = 20 \\times 0{,}75 = \\ldots" },
      { label: "c.", text: "Siapa yang diharapkan lebih banyak lulus? Berapa selisihnya?" },
    ],
  }),
  Qn(22, "Frekuensi Harapan – Soal Kehamilan", {
    type: "mixed",
    content: "Peluang seorang ibu melahirkan bayi kembar adalah 1/80. Di suatu kota terdapat 4.000 ibu hamil dalam setahun.",
    parts: [
      { label: "a.", math: "f_h(\\text{bayi kembar}) = 4000 \\times \\frac{1}{80} = \\ldots" },
      { label: "b.", math: "f_h(\\text{tidak kembar}) = 4000 - \\ldots = \\ldots" },
      { label: "c.", text: "Jika kehamilan kembar memerlukan perawatan khusus, berapa ruang khusus yang perlu disiapkan?" },
    ],
  }),
  Qn(23, "Soal ANBK – Tingkat Keberhasilan", {
    type: "mixed",
    content: "Sebuah penembak memiliki peluang mengenai sasaran 4/5. Ia menembak 50 kali.",
    parts: [
      { label: "a.", math: "f_h(\\text{kena}) = 50 \\times \\frac{4}{5} = \\ldots" },
      { label: "b.", math: "f_h(\\text{tidak kena}) = 50 \\times \\frac{1}{5} = \\ldots" },
      { label: "c.", text: "Jika penembak ingin mengenai sasaran minimal 100 kali, berapa kali ia perlu menembak?" },
    ],
  }),
  Qn(24, "Soal UN Level Tinggi – Semua Konsep", {
    type: "mixed",
    content: "Sebuah kantong berisi bola dengan perbandingan merah : biru : hijau = 3 : 4 : 5. Percobaan pengambilan (dengan pengembalian) dilakukan sebanyak 480 kali.",
    parts: [
      { label: "a.", math: "P(\\text{Merah}) = \\frac{3}{12} = \\frac{1}{4} \\Rightarrow f_h = 480 \\times \\frac{1}{4} = \\ldots" },
      { label: "b.", math: "f_h(\\text{Biru}) = 480 \\times \\frac{4}{12} = \\ldots" },
      { label: "c.", math: "f_h(\\text{Hijau}) = 480 \\times \\frac{5}{12} = \\ldots" },
      { label: "d.", text: "Verifikasi: 120 + 160 + 200 = 480 ✓" },
    ],
  }),
];

const FrekuensiHarapanPage = () => {
  const navigate = useNavigate();
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
            <span className="text-emerald-400 text-xs font-bold">📋 24 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="flex flex-col gap-2">
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
              <BlockMath math="f_h = n \times P(A)" />
            </div>
            <p className="text-white/50 text-xs font-body text-center">fh = frekuensi harapan · n = banyak percobaan · P(A) = peluang kejadian</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
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
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.math && <div className="mb-3 text-white overflow-x-auto"><BlockMath math={q.math} /></div>}
                    {q.diagram && <div className="mb-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? "bg-white/5" : "bg-transparent px-0"}`}>
                            {p.label && <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
