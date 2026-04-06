import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n"|"title">): Q => ({ n, title, ...rest });

const ExpVisualSVG = () => (
  <svg width="220" height="120" viewBox="0 0 220 120" className="mx-auto">
    <rect x="10" y="15" width="200" height="70" rx="10" fill="#0ea5e9" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="1.5"/>
    {[["a", "basis/bilangan pokok", 55, 58], ["n", "eksponen/pangkat", 155, 38]].map(([sym, lbl, x, y]: any[], _i) => (
      <g key={sym}>
        <text x={x} y={y} fill="#38bdf8" fontSize="28" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{sym}</text>
        <text x={x} y={y as number + 22} fill="#7dd3fc" fontSize="9" textAnchor="middle">{lbl}</text>
      </g>
    ))}
    <text x="110" y="58" fill="#94a3b8" fontSize="22" fontFamily="monospace" textAnchor="middle">×</text>
    <text x="110" y="100" fill="#64748b" fontSize="9" textAnchor="middle">aⁿ = a × a × a × … × a (n kali)</text>
  </svg>
);

const NumberLineSVG = () => (
  <svg width="220" height="90" viewBox="0 0 220 90" className="mx-auto">
    <line x1="10" y1="45" x2="210" y2="45" stroke="#38bdf8" strokeWidth="2"/>
    <polygon points="210,40 220,45 210,50" fill="#38bdf8"/>
    {[0,1,2,3,4,5].map(i => (
      <g key={i}>
        <line x1={10+i*38} y1="40" x2={10+i*38} y2="50" stroke="#38bdf8" strokeWidth="1.5"/>
        <text x={10+i*38} y="62" fill="#7dd3fc" fontSize="10" textAnchor="middle">{i}</text>
        <text x={10+i*38} y="28" fill="#f59e0b" fontSize="9" textAnchor="middle">{`2^${i}`}</text>
        <text x={10+i*38} y="18" fill="#fcd34d" fontSize="9" textAnchor="middle">{[1,2,4,8,16,32][i]}</text>
      </g>
    ))}
    <text x="110" y="85" fill="#64748b" fontSize="9" textAnchor="middle">Pangkat 2 — pola kelipatan 2</text>
  </svg>
);

const SquareVisSVG = () => (
  <svg width="220" height="100" viewBox="0 0 220 100" className="mx-auto">
    {[1,2,3,4].map(n => {
      const size = n * 14;
      const x = [15, 50, 100, 170][n-1];
      return (
        <g key={n}>
          {Array.from({length: n}).map((_,r) =>
            Array.from({length: n}).map((_,c) => (
              <rect key={`${r}-${c}`} x={x + c*14} y={20 + r*14} width="12" height="12"
                fill="#0ea5e9" fillOpacity={0.2 + n*0.1} stroke="#38bdf8" strokeWidth="1"/>
            ))
          )}
          <text x={x + size/2} y={90} fill="#7dd3fc" fontSize="9" textAnchor="middle">{n}²={n*n}</text>
        </g>
      );
    })}
    <text x="110" y="10" fill="#64748b" fontSize="9" textAnchor="middle">Visualisasi n² sebagai kotak n×n</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian Bilangan Berpangkat", {
    type: "mixed", diagram: <ExpVisualSVG />,
    parts: [
      { label: "a.", math: "\\text{Apa yang dimaksud dengan } a^n?" },
      { label: "b.", math: "\\text{Pada } 3^5 \\text{, sebutkan bilangan pokok dan pangkatnya!}" },
      { label: "c.", text: "Tuliskan 3⁵ dalam bentuk perkalian berulang." },
    ],
  }),
  Qn(2, "Nilai Pangkat Bilangan Bulat", {
    type: "mixed",
    content: "Hitung nilai bilangan berpangkat berikut:",
    parts: [
      { label: "a.", math: "2^8 = \\ldots" },
      { label: "b.", math: "3^4 = \\ldots" },
      { label: "c.", math: "5^3 = \\ldots" },
    ],
  }),
  Qn(3, "Penulisan Bentuk Pangkat – UN Style", {
    type: "mixed",
    content: "Tuliskan dalam bentuk pangkat:",
    parts: [
      { label: "a.", math: "7 \\times 7 \\times 7 \\times 7 = \\ldots" },
      { label: "b.", math: "(-3) \\times (-3) \\times (-3) = \\ldots" },
      { label: "c.", math: "a \\times a \\times a \\times a \\times a = \\ldots" },
    ],
  }),
  Qn(4, "Pola Bilangan Berpangkat", {
    type: "mixed", diagram: <NumberLineSVG />,
    content: "Perhatikan pola 2⁰, 2¹, 2², 2³, 2⁴, 2⁵:",
    parts: [
      { label: "a.", text: "Tentukan pola hubungan antara pangkat yang berurutan." },
      { label: "b.", math: "\\text{Hitung } 2^7" },
      { label: "c.", math: "\\text{Hitung } 2^{10}" },
    ],
  }),
  Qn(5, "Nilai Pangkat dengan Basis Negatif – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(-2)^4 = \\ldots" },
      { label: "b.", math: "(-3)^3 = \\ldots" },
      { label: "c.", math: "(-1)^{100} = \\ldots" },
    ],
  }),
  Qn(6, "Membandingkan Nilai Pangkat – ANBK", {
    type: "mixed",
    content: "Bandingkan nilai berikut dengan tanda <, >, atau =:",
    parts: [
      { label: "a.", math: "2^5 \\ldots 5^2" },
      { label: "b.", math: "3^4 \\ldots 4^3" },
      { label: "c.", math: "10^3 \\ldots 3^{10}" },
    ],
  }),
  Qn(7, "Kuadrat Bilangan – Visualisasi", {
    type: "mixed", diagram: <SquareVisSVG />,
    content: "Perhatikan visualisasi bilangan kuadrat:",
    parts: [
      { label: "a.", math: "5^2 = \\ldots" },
      { label: "b.", math: "12^2 = \\ldots" },
      { label: "c.", math: "25^2 = \\ldots" },
    ],
  }),
  Qn(8, "Eksponen Basis Pecahan – UN/ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\left(\\frac{2}{3}\\right)^3 = \\ldots" },
      { label: "b.", math: "\\left(\\frac{1}{4}\\right)^2 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{3}{5}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(9, "Menentukan Bilangan Pokok – TKA", {
    type: "mixed",
    content: "Tentukan nilai n yang memenuhi persamaan berikut:",
    parts: [
      { label: "a.", math: "n^3 = 27 \\Rightarrow n = \\ldots" },
      { label: "b.", math: "n^2 = 144 \\Rightarrow n = \\ldots" },
      { label: "c.", math: "n^4 = 16 \\Rightarrow n = \\ldots" },
    ],
  }),
  Qn(10, "Menentukan Pangkat – UN", {
    type: "mixed",
    content: "Tentukan nilai n yang memenuhi:",
    parts: [
      { label: "a.", math: "2^n = 64 \\Rightarrow n = \\ldots" },
      { label: "b.", math: "3^n = 243 \\Rightarrow n = \\ldots" },
      { label: "c.", math: "5^n = 3125 \\Rightarrow n = \\ldots" },
    ],
  }),
  Qn(11, "Nilai Pangkat Basis 10 – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "10^4 = \\ldots" },
      { label: "b.", math: "10^6 = \\ldots" },
      { label: "c.", math: "\\text{Berapa digit angka 0 pada } 10^8?" },
    ],
  }),
  Qn(12, "Bilangan Pangkat Tiga – Soal Cerita UN", {
    type: "mixed",
    content: "Sebuah kubus memiliki rusuk n cm dan volumenya 343 cm³.",
    parts: [
      { label: "a.", math: "343 = n^3 \\Rightarrow n = \\ldots" },
      { label: "b.", text: "Hitung luas permukaan kubus tersebut." },
      { label: "c.", text: "Jika rusuknya diperbesar 2 kali, berapa volume barunya?" },
    ],
  }),
  Qn(13, "Pangkat Nol Awal – ANBK", {
    type: "mixed",
    content: "Berdasarkan pola: 3³=27, 3²=9, 3¹=3, 3⁰=…",
    parts: [
      { label: "a.", text: "Lanjutkan pola untuk menentukan nilai 3⁰." },
      { label: "b.", math: "7^0 = \\ldots" },
      { label: "c.", math: "(100)^0 = \\ldots" },
    ],
  }),
  Qn(14, "Ekspansi Bentuk Pangkat – UN", {
    type: "mixed",
    content: "Nyatakan dalam bentuk perkalian berulang lalu hitung nilainya:",
    parts: [
      { label: "a.", math: "4^3" },
      { label: "b.", math: "(-5)^2" },
      { label: "c.", math: "\\left(\\frac{1}{2}\\right)^5" },
    ],
  }),
  Qn(15, "Soal Cerita Pangkat – ANBK", {
    type: "mixed",
    content: "Selembar kertas dilipat terus menerus. Setiap lipatan menghasilkan 2 lapisan.",
    parts: [
      { label: "a.", math: "\\text{Berapa lapisan setelah 5 lipatan? Nyatakan sebagai } 2^5" },
      { label: "b.", math: "\\text{Berapa lapisan setelah 10 lipatan?}" },
      { label: "c.", text: "Jika kertas setebal 0,1 mm, seberapa tebal setelah 10 lipatan (dalam cm)?" },
    ],
  }),
  Qn(16, "Mana yang Lebih Besar? – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2^{10} \\text{ atau } 10^2?" },
      { label: "b.", math: "3^8 \\text{ atau } 8^3?" },
      { label: "c.", math: "4^5 \\text{ atau } 5^4?" },
    ],
  }),
  Qn(17, "Bilangan Berpangkat pada Luas – UN", {
    type: "mixed",
    content: "Luas persegi dengan sisi s dinyatakan sebagai s².",
    parts: [
      { label: "a.", math: "s = 13 \\Rightarrow L = 13^2 = \\ldots" },
      { label: "b.", math: "L = 196 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
      { label: "c.", math: "L = 225 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
    ],
  }),
  Qn(18, "Urutan Nilai Pangkat – ANBK", {
    type: "mixed",
    content: "Urutkan dari yang terkecil ke terbesar:",
    parts: [
      { label: "a.", math: "3^2,\\; 2^3,\\; 1^5,\\; 4^1" },
      { label: "b.", math: "5^2,\\; 2^5,\\; 4^3,\\; 3^4" },
      { label: "c.", math: "(-2)^3,\\; (-3)^2,\\; 2^4,\\; (-1)^{10}" },
    ],
  }),
  Qn(19, "Soal Pangkat pada Kehidupan – TKA", {
    type: "mixed",
    content: "Populasi bakteri berlipat ganda setiap jam. Awal ada 1 bakteri.",
    parts: [
      { label: "a.", math: "\\text{Setelah 6 jam: } 2^6 = \\ldots \\text{ bakteri}" },
      { label: "b.", math: "\\text{Setelah 10 jam: } 2^{10} = \\ldots \\text{ bakteri}" },
      { label: "c.", text: "Setelah berapa jam populasi melebihi 1.000 bakteri?" },
    ],
  }),
  Qn(20, "Evaluasi Ekspresi Pangkat – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2^3 + 3^2 = \\ldots" },
      { label: "b.", math: "4^2 - 2^4 = \\ldots" },
      { label: "c.", math: "2^2 \\times 3^2 = \\ldots" },
    ],
  }),
  Qn(21, "Pangkat Basis Pecahan – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\left(-\\frac{1}{2}\\right)^4 = \\ldots" },
      { label: "b.", math: "\\left(\\frac{2}{5}\\right)^3 = \\ldots" },
      { label: "c.", math: "\\left(-\\frac{3}{4}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(22, "Soal Penalaran Pangkat – TKA", {
    type: "mixed",
    content: "Jika 5³ = 125, tentukan:",
    parts: [
      { label: "a.", math: "5^3 \\times 5 = 5^\\square = \\ldots" },
      { label: "b.", math: "5^3 \\div 5 = 5^\\square = \\ldots" },
      { label: "c.", math: "(5^3)^2 = 5^\\square = \\ldots" },
    ],
  }),
  Qn(23, "Penjumlahan Bilangan Berpangkat – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "3^4 + 4^3 = \\ldots" },
      { label: "b.", math: "2^5 - 5^2 = \\ldots" },
      { label: "c.", math: "10^2 + 2^{10} = \\ldots" },
    ],
  }),
  Qn(24, "Pangkat dan Perkalian Campuran – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "3 \\times 2^4 = \\ldots" },
      { label: "b.", math: "5^2 \\times 4 = \\ldots" },
      { label: "c.", math: "2 \\times 3^3 + 4 \\times 2^2 = \\ldots" },
    ],
  }),
  Qn(25, "Ekspresi dengan Variabel – ANBK", {
    type: "mixed",
    content: "Jika a = 2 dan b = 3, hitung:",
    parts: [
      { label: "a.", math: "a^3 + b^2 = \\ldots" },
      { label: "b.", math: "a^2 b^3 = \\ldots" },
      { label: "c.", math: "(a+b)^2 - (a^2+b^2) = \\ldots" },
    ],
  }),
  Qn(26, "Identifikasi Pangkat Ganjil/Genap – TKA", {
    type: "mixed",
    content: "Tentukan apakah hasil bilangan berpangkat positif atau negatif:",
    parts: [
      { label: "a.", math: "(-7)^{15}: \\text{ positif atau negatif?}" },
      { label: "b.", math: "(-4)^{22}: \\text{ positif atau negatif?}" },
      { label: "c.", text: "Buat aturan umum: kapan (−a)ⁿ bernilai positif dan kapan negatif?" },
    ],
  }),
  Qn(27, "Soal Pangkat di Kehidupan – UN", {
    type: "mixed",
    content: "Sebuah investasi berlipat ganda setiap tahun. Uang awal Rp1.000.",
    parts: [
      { label: "a.", math: "\\text{Setelah 5 tahun: } 1000 \\times 2^5 = \\ldots" },
      { label: "b.", math: "\\text{Setelah 8 tahun: } 1000 \\times 2^8 = \\ldots" },
      { label: "c.", text: "Setelah berapa tahun uang melebihi Rp100.000?" },
    ],
  }),
  Qn(28, "Pangkat Bilangan Bulat Besar – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "100^3 = \\ldots" },
      { label: "b.", math: "1000^2 = \\ldots" },
      { label: "c.", math: "\\text{Berapa banyak angka nol pada } 10^{12}?" },
    ],
  }),
  Qn(29, "Perbandingan Pangkat – TKA", {
    type: "mixed",
    content: "Dua bilangan: P = 2^{12} dan Q = 4^6.",
    parts: [
      { label: "a.", math: "P = 2^{12} = \\ldots" },
      { label: "b.", math: "Q = 4^6 = (2^2)^6 = 2^{12} = \\ldots" },
      { label: "c.", text: "Apakah P = Q? Jelaskan." },
    ],
  }),
  Qn(30, "Satuan Pangkat – Pola Digit Terakhir – UN", {
    type: "mixed",
    content: "Perhatikan pola digit terakhir dari perpangkatan 2: 2¹=2, 2²=4, 2³=8, 2⁴=6, 2⁵=2, …",
    parts: [
      { label: "a.", text: "Apa digit terakhir dari 2⁵⁰?" },
      { label: "b.", text: "Apa digit terakhir dari 3⁴¹?" },
      { label: "c.", text: "Apa digit terakhir dari 7¹⁰⁰?" },
    ],
  }),
  Qn(31, "Soal ANBK – Volume Kubus Pangkat", {
    type: "mixed",
    content: "Volume kubus = s³. Tentukan volume jika:",
    parts: [
      { label: "a.", math: "s = 6 \\text{ cm}" },
      { label: "b.", math: "s = 12 \\text{ cm}" },
      { label: "c.", math: "s = 1{,}5 \\text{ m}" },
    ],
  }),
  Qn(32, "Menghitung Nilai Ekspresi – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2^4 + 4^2 - 3^3 = \\ldots" },
      { label: "b.", math: "(2^3)^2 \\div 2^4 = \\ldots" },
      { label: "c.", math: "\\frac{3^5}{3^2} = \\ldots" },
    ],
  }),
  Qn(33, "Soal Pangkat Cerita – TKA", {
    type: "mixed",
    content: "Sebuah komputer memproses 2 operasi pada detik ke-1, 4 operasi pada detik ke-2, 8 operasi pada detik ke-3, dan seterusnya.",
    parts: [
      { label: "a.", math: "\\text{Pada detik ke-}n \\text{, proses} = 2^n" },
      { label: "b.", math: "\\text{Berapa proses pada detik ke-12?}" },
      { label: "c.", text: "Pada detik ke berapa proses pertama kali melebihi 1 juta?" },
    ],
  }),
  Qn(34, "Soal ANBK – Bentuk Pangkat Campuran", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2^3 \\times 3^2 + 4^2 = \\ldots" },
      { label: "b.", math: "(3^2 + 4^2) \\times 2 = \\ldots" },
      { label: "c.", math: "5^3 - 3^3 - 2^3 = \\ldots" },
    ],
  }),
  Qn(35, "Soal UN – Pangkat dalam Geometri", {
    type: "mixed",
    content: "Luas lingkaran = πr². Hitung luas jika:",
    parts: [
      { label: "a.", math: "r = 7 \\text{ cm } (\\pi = \\frac{22}{7})" },
      { label: "b.", math: "r = 14 \\text{ cm }" },
      { label: "c.", math: "\\text{Jika luas} = 616 \\text{ cm}^2, \\text{ cari } r" },
    ],
  }),
  Qn(36, "Soal UN – Menentukan Ekspresi", {
    type: "mixed",
    content: "Nilai dari ekspresi berikut adalah:",
    parts: [
      { label: "a.", math: "\\frac{6^4}{6^2} = 6^\\square = \\ldots" },
      { label: "b.", math: "5^2 \\times 5^3 = 5^\\square = \\ldots" },
      { label: "c.", math: "(4^3)^2 = 4^\\square = \\ldots" },
    ],
  }),
  Qn(37, "Soal TKA – Pangkat dalam Luas Permukaan", {
    type: "mixed",
    content: "Luas permukaan kubus = 6s². Tentukan s jika:",
    parts: [
      { label: "a.", math: "L = 54 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
      { label: "b.", math: "L = 150 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
      { label: "c.", math: "L = 600 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
    ],
  }),
  Qn(38, "Soal UN – Penerapan Pangkat dalam Statistika", {
    type: "mixed",
    content: "Rumus varians = (Σ(xᵢ−x̄)²)/n. Jika selisih nilai siswa adalah 2, 3, dan 1:",
    parts: [
      { label: "a.", math: "2^2 + 3^2 + 1^2 = \\ldots" },
      { label: "b.", math: "\\text{Varians} = \\frac{4+9+1}{3} = \\ldots" },
      { label: "c.", text: "Apa arti nilai varians tersebut?" },
    ],
  }),
  Qn(39, "Soal ANBK – Perbandingan Dua Pangkat", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{8^3}{2^3} = \\ldots" },
      { label: "b.", math: "\\frac{9^2}{3^2} = \\ldots" },
      { label: "c.", math: "\\frac{(ab)^3}{a^3} = \\ldots" },
    ],
  }),
  Qn(40, "Soal UN/TKA – Gabungan Konsep Pangkat", {
    type: "mixed",
    content: "Diketahui p = 3 dan q = 2.",
    parts: [
      { label: "a.", math: "p^q + q^p = \\ldots" },
      { label: "b.", math: "(p+q)^2 = \\ldots" },
      { label: "c.", math: "p^3 - q^3 = \\ldots" },
      { label: "d.", math: "(pq)^2 = \\ldots" },
    ],
  }),
];

const PengertianNotasiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔢</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            PENGERTIAN DAN NOTASI PANGKAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bilangan Berpangkat · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-3">📐 Konsep Penting</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Definisi", math: "a^n = \\underbrace{a \\times a \\times \\cdots \\times a}_{n}" },
              { name: "Kuadrat Sempurna", math: "1,4,9,16,25,36,49,64,81,100" },
              { name: "Kubik Sempurna", math: "1,8,27,64,125,216,343" },
              { name: "Pangkat Basis 10", math: "10^n = 1\\underbrace{00\\ldots0}_{n}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-sky-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-cyan-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-cyan-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-sky-900/20 border border-sky-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>}
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/bilangan-berpangkat"); }}
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};
export default PengertianNotasiPage;
