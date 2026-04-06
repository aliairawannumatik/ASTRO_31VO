import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Minus } from "lucide-react";

const accentColor = "#fb923c";
const accentDim = "rgba(251,146,60,0.12)";
const borderColor = "rgba(251,146,60,0.25)";

type Part = { label: string; math?: string; text?: string };
type Badge = "UN" | "ANBK" | "TKA" | "AKM";
type Q = { n: number; title: string; content?: string; math?: string; blockMath?: string; parts?: Part[]; badge?: Badge; type: "essay" | "mixed"; };
const badgeStyle: Record<Badge, string> = {
  UN: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
  ANBK: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  TKA: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  AKM: "bg-green-500/20 text-green-300 border-green-400/40",
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qf(1, "Eliminasi Langsung — Koefisien Sama", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} x + y = 9 \\\\ x - y = 3 \\end{cases}",
    parts: [
      { label: "a.", text: "Jumlahkan kedua persamaan untuk menghilangkan y." },
      { label: "b.", text: "Kurangkan persamaan kedua dari pertama untuk menghilangkan x." },
      { label: "c.", text: "Tentukan HP = {(x, y)}." },
    ],
  }),
  Qf(2, "Eliminasi — Menghilangkan x", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 3x + 2y = 16 \\\\ 3x - y = 10 \\end{cases}",
    parts: [
      { label: "a.", text: "Kurangkan persamaan kedua dari pertama untuk menghilangkan x." },
      { label: "b.", text: "Tentukan nilai y." },
      { label: "c.", text: "Substitusikan kembali untuk mencari x." },
    ],
  }),
  Qf(3, "Perkalian Dulu", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 2x + 3y = 13 \\\\ x + 2y = 8 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan kedua dengan 2 agar koefisien x sama." },
      { label: "b.", text: "Kurangkan untuk menghilangkan x dan cari y." },
      { label: "c.", text: "Substitusikan kembali untuk mencari x." },
    ],
  }),
  Qf(4, "Eliminasi — Koefisien Berbeda", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 4x + y = 14 \\\\ 2x + 3y = 16 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan kedua dengan 2." },
      { label: "b.", text: "Eliminasi x, lalu cari y." },
      { label: "c.", text: "Cari x dan verifikasi." },
    ],
  }),
  Qf(5, "Eliminasi — Dua Kali Perkalian", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 3x + 4y = 25 \\\\ 2x + 3y = 18 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 2 dan persamaan kedua dengan 3." },
      { label: "b.", text: "Eliminasi x, tentukan y." },
      { label: "c.", text: "Tentukan x." },
    ],
  }),
  Qf(6, "Eliminasi — Penambahan", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} 5x - 2y = 16 \\\\ 3x + 2y = 16 \\end{cases}",
    parts: [
      { label: "a.", text: "Jumlahkan kedua persamaan untuk menghilangkan y." },
      { label: "b.", text: "Tentukan x, lalu y." },
      { label: "c.", text: "Verifikasi dengan mensubstitusi ke salah satu persamaan." },
    ],
  }),
  Qf(7, "Soal UN — Harga Barang", {
    badge: "UN", type: "mixed",
    content: "Harga 2 kemeja dan 3 celana = Rp 340.000. Harga 3 kemeja dan 2 celana = Rp 360.000.",
    parts: [
      { label: "a.", text: "Misal harga kemeja = x dan celana = y. Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan metode eliminasi." },
      { label: "c.", text: "Tentukan harga 1 kemeja dan 1 celana." },
    ],
  }),
  Qf(8, "Eliminasi y Terlebih Dahulu", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} 2x + 5y = 21 \\\\ 4x + 3y = 19 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 3 dan persamaan kedua dengan 5." },
      { label: "b.", text: "Eliminasi y, tentukan x." },
      { label: "c.", text: "Tentukan y." },
    ],
  }),
  Qf(9, "Tanda Negatif dalam Eliminasi", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 3x - 2y = 7 \\\\ 5x + 2y = 17 \\end{cases}",
    parts: [
      { label: "a.", text: "Jumlahkan kedua persamaan (perhatikan tanda −2y dan +2y)." },
      { label: "b.", text: "Tentukan x, lalu y." },
    ],
  }),
  Qf(10, "Eliminasi Keduanya", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 6x + 5y = 29 \\\\ 4x - 3y = 3 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan pers. pertama × 3 dan pers. kedua × 5 untuk eliminasi y." },
      { label: "b.", text: "Jumlahkan kedua hasil untuk mendapat nilai x." },
      { label: "c.", text: "Tentukan y." },
    ],
  }),
  Qf(11, "Koefisien Bernilai 1 dan Besar", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} x + 7y = 23 \\\\ 3x - 2y = 2 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 3 untuk eliminasi x." },
      { label: "b.", text: "Kurangkan dari persamaan kedua." },
      { label: "c.", text: "Tentukan y dan x." },
    ],
  }),
  Qf(12, "Soal Perbandingan Usia — Eliminasi", {
    badge: "UN", type: "mixed",
    content: "Selisih umur Ibu dan Anak adalah 25 tahun. Dua kali umur Anak ditambah umur Ibu sama dengan 65 tahun.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan eliminasi." },
      { label: "c.", text: "Tentukan umur keduanya." },
    ],
  }),
  Qf(13, "Eliminasi — Pengurangan", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 4x + 9y = 37 \\\\ 4x + 3y = 19 \\end{cases}",
    parts: [
      { label: "a.", text: "Kurangkan persamaan kedua dari pertama." },
      { label: "b.", text: "Tentukan y, lalu x." },
    ],
  }),
  Qf(14, "Eliminasi — Desimal ke Bulat", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 0.5x + y = 4 \\\\ x - 0.5y = 5 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan setiap persamaan dengan 2 agar tidak ada desimal." },
      { label: "b.", text: "Selesaikan dengan metode eliminasi." },
    ],
  }),
  Qf(15, "Bilangan Bulat Negatif", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} 2x - 3y = -8 \\\\ 5x + 3y = 1 \\end{cases}",
    parts: [
      { label: "a.", text: "Jumlahkan kedua persamaan untuk menghilangkan y." },
      { label: "b.", text: "Tentukan x, lalu y." },
      { label: "c.", text: "Verifikasi (mungkin hasilnya negatif)." },
    ],
  }),
  Qf(16, "Soal Kelereng — UN", {
    badge: "UN", type: "mixed",
    content: "Budi memiliki kelereng merah dan biru. Jumlahnya 40. Selisihnya 8. Kelereng merah lebih banyak.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV (merah = x, biru = y)." },
      { label: "b.", text: "Selesaikan dengan eliminasi." },
      { label: "c.", text: "Berapa banyak kelereng merah dan biru?" },
    ],
  }),
  Qf(17, "Eliminasi — Tiga Langkah", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 5x + 4y = 43 \\\\ 3x - 2y = 9 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan kedua dengan 2." },
      { label: "b.", text: "Jumlahkan untuk menghilangkan y, tentukan x." },
      { label: "c.", text: "Tentukan y." },
    ],
  }),
  Qf(18, "Eliminasi — Koefisien Negatif", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} -2x + y = 1 \\\\ 4x - 3y = 3 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 2." },
      { label: "b.", text: "Jumlahkan dengan persamaan kedua untuk hilangkan x." },
      { label: "c.", text: "Tentukan y dan x." },
    ],
  }),
  Qf(19, "Soal Transportasi — AKM", {
    badge: "AKM", type: "mixed",
    content: "Tiket bus = x rupiah, tiket kereta = y rupiah. 2 tiket bus + 1 tiket kereta = Rp 55.000. 1 tiket bus + 3 tiket kereta = Rp 75.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan eliminasi." },
      { label: "c.", text: "Berapa harga masing-masing tiket?" },
    ],
  }),
  Qf(20, "Eliminasi — Jawaban Tidak Bulat", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 3x + 4y = 10 \\\\ 6x - y = 6 \\end{cases}",
    parts: [
      { label: "a.", text: "Gunakan eliminasi untuk menghilangkan y (kalikan pers. kedua dengan 4)." },
      { label: "b.", text: "Tentukan x dan y." },
    ],
  }),
  Qf(21, "Eliminasi Campuran Positif Negatif", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 7x - 3y = 4 \\\\ 7x + 2y = 14 \\end{cases}",
    parts: [
      { label: "a.", text: "Kurangkan persamaan pertama dari kedua." },
      { label: "b.", text: "Tentukan y, lalu x." },
    ],
  }),
  Qf(22, "Soal Panjang dan Lebar", {
    badge: "UN", type: "mixed",
    content: "Keliling persegi panjang = 48 cm. Panjangnya dua kali lebarnya.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV (panjang = p, lebar = l)." },
      { label: "b.", text: "Selesaikan dengan eliminasi." },
      { label: "c.", text: "Tentukan luas persegi panjang." },
    ],
  }),
  Qf(23, "Eliminasi — Langsung Dapat y", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} 3x + 2y = 17 \\\\ 3x - 2y = 5 \\end{cases}",
    parts: [
      { label: "a.", text: "Jumlahkan kedua persamaan (eliminasi y)." },
      { label: "b.", text: "Kurangkan persamaan kedua dari pertama (eliminasi x)." },
      { label: "c.", text: "Tentukan HP." },
    ],
  }),
  Qf(24, "Perkalian Berbeda — Eliminasi y", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 2x + 3y = 20 \\\\ 5x + 4y = 35 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan pers. pertama × 4 dan pers. kedua × 3." },
      { label: "b.", text: "Kurangkan untuk menghilangkan y." },
      { label: "c.", text: "Tentukan x, lalu y." },
    ],
  }),
  Qf(25, "Soal Pembelian Alat Tulis", {
    badge: "UN", type: "mixed",
    content: "Reni membeli 4 penggaris dan 3 pena seharga Rp 28.000. Siti membeli 2 penggaris dan 5 pena seharga Rp 26.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan eliminasi." },
      { label: "c.", text: "Berapa harga 1 penggaris dan 1 pena?" },
    ],
  }),
  Qf(26, "Eliminasi — Keduanya Negatif", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} -3x + y = -5 \\\\ -x + 2y = 0 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 2." },
      { label: "b.", text: "Kurangkan persamaan kedua dari hasilnya." },
      { label: "c.", text: "Tentukan x dan y." },
    ],
  }),
  Qf(27, "Verifikasi Eliminasi", {
    badge: "ANBK", type: "mixed",
    content: "Seorang siswa menyelesaikan SPLDV berikut dengan eliminasi dan mendapat (4, 3):",
    blockMath: "\\begin{cases} 2x - y = 5 \\\\ x + 3y = 13 \\end{cases}",
    parts: [
      { label: "a.", text: "Periksa apakah (4, 3) memenuhi kedua persamaan." },
      { label: "b.", text: "Jika benar, verifikasi langkah eliminasinya." },
    ],
  }),
  Qf(28, "SPLDV — Soal Kontekstual Kantin", {
    badge: "AKM", type: "mixed",
    content: "3 porsi mie dan 2 minuman = Rp 31.000. 2 porsi mie dan 3 minuman = Rp 29.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan eliminasi." },
      { label: "c.", text: "Berapa harga 1 mie dan 1 minuman?" },
    ],
  }),
  Qf(29, "Eliminasi — Banyak Langkah", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 8x - 3y = 25 \\\\ 5x + 6y = 31 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama × 2 agar koefisien y berlawanan." },
      { label: "b.", text: "Jumlahkan dengan persamaan kedua." },
      { label: "c.", text: "Tentukan x, lalu y." },
    ],
  }),
  Qf(30, "Soal Kecepatan", {
    badge: "AKM", type: "mixed",
    content: "Dua kereta berlari berlawanan arah. Kecepatan kereta A + kereta B = 200 km/jam. Kecepatan kereta A − kereta B = 40 km/jam.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV (A = x, B = y)." },
      { label: "b.", text: "Selesaikan dengan eliminasi." },
      { label: "c.", text: "Tentukan kecepatan masing-masing kereta." },
    ],
  }),
  Qf(31, "Eliminasi — Pecahan", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} \\frac{x}{2} + \\frac{y}{3} = 2 \\\\ \\frac{x}{3} - \\frac{y}{4} = 1 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 6 dan persamaan kedua dengan 12." },
      { label: "b.", text: "Selesaikan dengan eliminasi." },
    ],
  }),
  Qf(32, "Soal Pilihan Ganda — UN", {
    badge: "UN", type: "mixed",
    content: "Nilai x − y dari penyelesaian SPLDV berikut adalah:",
    blockMath: "\\begin{cases} 3x + 2y = 17 \\\\ 2x - y = 6 \\end{cases}",
    parts: [
      { label: "A.", math: "3" },
      { label: "B.", math: "2" },
      { label: "C.", math: "1" },
      { label: "D.", math: "5" },
    ],
  }),
  Qf(33, "Eliminasi — Hasil Nol", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} 4x + y = 8 \\\\ 4x - 2y = 14 \\end{cases}",
    parts: [
      { label: "a.", text: "Kurangkan persamaan kedua dari pertama." },
      { label: "b.", text: "Tentukan y, lalu x." },
    ],
  }),
  Qf(34, "Eliminasi — Soal Campuran", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 9x - 4y = 10 \\\\ 3x + 2y = 10 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan kedua dengan 3 agar koefisien x sama." },
      { label: "b.", text: "Tentukan y dan x." },
    ],
  }),
  Qf(35, "Soal Nilai x + y", {
    badge: "ANBK", type: "mixed",
    content: "Jika (x, y) adalah penyelesaian dari SPLDV berikut, tentukan nilai 2x + 3y:",
    blockMath: "\\begin{cases} x + y = 7 \\\\ 2x - y = 5 \\end{cases}",
    parts: [
      { label: "a.", text: "Selesaikan SPLDV dengan eliminasi." },
      { label: "b.", math: "\\text{Hitung } 2x + 3y." },
    ],
  }),
  Qf(36, "Eliminasi — Verifikasi Klasik", {
    badge: "TKA", type: "mixed",
    content: "Tentukan apakah eliminasi berikut dilakukan dengan benar:",
    blockMath: "\\begin{cases} 2x + 3y = 11 \\quad \\times 2\\\\ 4x + 3y = 17 \\end{cases} \\Rightarrow -y = 5 \\Rightarrow y = -5",
    parts: [
      { label: "a.", text: "Periksa apakah proses eliminasinya benar." },
      { label: "b.", text: "Jika salah, perbaiki dan tentukan solusi yang benar." },
    ],
  }),
  Qf(37, "ANBK — Pernyataan B/S", {
    badge: "ANBK", type: "mixed",
    content: "Tentukan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", text: "Metode eliminasi menghilangkan satu variabel dengan cara menjumlahkan atau mengurangkan kedua persamaan." },
      { label: "(2)", text: "Koefisien yang dihilangkan harus sama tanda." },
      { label: "(3)", text: "Jika koefisien berbeda, kalikan salah satu atau kedua persamaan dengan konstanta tertentu." },
      { label: "(4)", text: "Metode eliminasi tidak bisa digunakan jika koefisiennya berupa pecahan." },
    ],
  }),
  Qf(38, "Eliminasi — Soal Ekonomi", {
    badge: "AKM", type: "mixed",
    content: "Sebuah toko buku menjual novel dan komik. Harga 4 novel + 2 komik = Rp 80.000. Harga 2 novel + 5 komik = Rp 70.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan eliminasi." },
      { label: "c.", text: "Berapa harga total 3 novel dan 3 komik?" },
    ],
  }),
  Qf(39, "Eliminasi — Suku Campuran", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 2x + 5y = 29 \\\\ 4x - 3y = -1 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 2." },
      { label: "b.", text: "Kurangkan dari persamaan kedua." },
      { label: "c.", text: "Tentukan y dan x." },
    ],
  }),
  Qf(40, "Rekap — Pilihan Ganda UN", {
    badge: "UN", type: "mixed",
    content: "Penyelesaian dari SPLDV berikut menggunakan eliminasi adalah:",
    blockMath: "\\begin{cases} 5x + 3y = 30 \\\\ 2x - y = 6 \\end{cases}",
    parts: [
      { label: "A.", math: "x=3,\\ y=5" },
      { label: "B.", math: "x=6,\\ y=0" },
      { label: "C.", math: "x=4,\\ y=\\frac{10}{3}" },
      { label: "D.", math: "x=3,\\ y=\\frac{5}{3}" },
    ],
  }),
];

const MetodeEliminasiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <Minus className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            PENYELESAIAN SPLDV — METODE ELIMINASI
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · Latihan Mandiri · 40 Soal</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {(["UN","ANBK","TKA","AKM"] as Badge[]).map(b => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b]}`}>{b}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl overflow-hidden border" style={{ background: accentDim, borderColor }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor, background: "rgba(251,146,60,0.08)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: accentColor + "30", color: accentColor }}>{q.n}</div>
                <span className="font-display text-sm font-bold" style={{ color: accentColor }}>{q.title}</span>
                {q.badge && <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle[q.badge]}`}>{q.badge}</span>}
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.content && <p className="font-body text-sm text-white/85 leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-white/90 text-sm"><InlineMath math={q.math} /></div>}
                {q.blockMath && (
                  <div className="rounded-xl px-4 py-3 text-white/90 overflow-x-auto"
                    style={{ background: "rgba(251,146,60,0.08)", border: `1px solid ${borderColor}` }}>
                    <BlockMath math={q.blockMath} />
                  </div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1">
                    {q.parts.map((p, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <span className="font-bold text-xs shrink-0 mt-0.5" style={{ color: accentColor }}>{p.label}</span>
                        <span className="font-body text-sm text-white/80 leading-relaxed">
                          {p.text && p.text}{p.math && <InlineMath math={p.math} />}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/spldv"); }}
            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer font-body">
            ← Kembali ke Menu SPLDV
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetodeEliminasiPage;
