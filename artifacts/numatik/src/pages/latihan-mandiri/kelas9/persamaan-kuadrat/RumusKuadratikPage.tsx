import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const RumusABCSVG = () => (
  <svg width="300" height="110" viewBox="0 0 300 110" className="mx-auto">
    <rect x="5" y="5" width="290" height="100" rx="12" fill="#78350f" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.5"/>
    <text x="150" y="40" fill="#fbbf24" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ax² + bx + c = 0</text>
    <text x="150" y="68" fill="#fcd34d" fontSize="18" fontFamily="monospace" fontWeight="bold" textAnchor="middle">x = (−b ± √(b²−4ac)) / 2a</text>
    <text x="90" y="92" fill="#d97706" fontSize="10" textAnchor="middle">x₁ = (−b + √D) / 2a</text>
    <text x="215" y="92" fill="#d97706" fontSize="10" textAnchor="middle">x₂ = (−b − √D) / 2a</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Rumus Kuadratik Dasar – UN", {
    type: "mixed", diagram: <RumusABCSVG />,
    content: "Selesaikan dengan rumus kuadratik:",
    parts: [
      { label: "a.", math: "x^2 - 5x + 6 = 0" },
      { label: "b.", math: "x^2 + 3x - 4 = 0" },
      { label: "c.", math: "2x^2 - 7x + 3 = 0" },
    ],
  }),
  Qn(2, "Identifikasi a, b, c lalu Hitung – UN", {
    type: "mixed",
    content: "Tentukan a, b, c, kemudian gunakan rumus kuadratik:",
    parts: [
      { label: "a.", math: "3x^2 + 5x - 2 = 0" },
      { label: "b.", math: "x^2 - 6x + 1 = 0" },
      { label: "c.", math: "2x^2 + 4x - 3 = 0" },
    ],
  }),
  Qn(3, "Akar Irasional – ANBK", {
    type: "mixed",
    content: "Selesaikan dan nyatakan dalam bentuk akar sederhana:",
    parts: [
      { label: "a.", math: "x^2 - 4x + 1 = 0" },
      { label: "b.", math: "x^2 + 2x - 5 = 0" },
      { label: "c.", math: "3x^2 - 6x + 1 = 0" },
    ],
  }),
  Qn(4, "Rumus ABC dengan Koef. Negatif – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "-x^2 + 4x + 5 = 0" },
      { label: "b.", math: "-2x^2 + 6x - 3 = 0" },
      { label: "c.", math: "-3x^2 + x + 2 = 0" },
    ],
  }),
  Qn(5, "Menghitung Diskriminan dalam Rumus ABC – UN", {
    type: "mixed",
    content: "Hitung nilai diskriminan D = b² − 4ac, lalu tentukan akar-akarnya:",
    parts: [
      { label: "a.", math: "x^2 - 6x + 9 = 0 \\Rightarrow D = \\ldots" },
      { label: "b.", math: "2x^2 + 3x + 5 = 0 \\Rightarrow D = \\ldots" },
      { label: "c.", math: "x^2 + 4x - 12 = 0 \\Rightarrow D = \\ldots, x = \\ldots" },
    ],
  }),
  Qn(6, "Akar Rasional Sempurna – ANBK", {
    type: "mixed",
    content: "Gunakan rumus ABC. Periksa apakah √D bulat sempurna:",
    parts: [
      { label: "a.", math: "x^2 - 7x + 12 = 0" },
      { label: "b.", math: "2x^2 - x - 6 = 0" },
      { label: "c.", math: "4x^2 - 4x - 3 = 0" },
    ],
  }),
  Qn(7, "Soal Cerita – Rumus ABC – UN", {
    type: "mixed",
    content: "Sebuah persegi panjang memiliki keliling 26 cm dan luas 40 cm².",
    parts: [
      { label: "a.", text: "Misalkan lebar = x. Buat persamaan kuadratnya." },
      { label: "b.", math: "x^2 - 13x + 40 = 0" },
      { label: "c.", math: "\\text{Selesaikan dengan rumus ABC, } D = (-13)^2 - 4(1)(40)" },
    ],
  }),
  Qn(8, "Rumus ABC dengan Koef. Besar – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "5x^2 - 11x + 2 = 0" },
      { label: "b.", math: "6x^2 + x - 12 = 0" },
      { label: "c.", math: "8x^2 - 10x - 3 = 0" },
    ],
  }),
  Qn(9, "Menyebutkan Langkah Rumus ABC – ANBK", {
    type: "mixed",
    content: "Selesaikan secara rinci langkah demi langkah:",
    parts: [
      { label: "a.", math: "4x^2 - 8x + 3 = 0" },
      { label: "b.", math: "\\text{Hitung } D = (-8)^2 - 4(4)(3) = \\ldots" },
      { label: "c.", math: "x = \\frac{-(-8) \\pm \\sqrt{D}}{2 \\cdot 4} = \\ldots" },
    ],
  }),
  Qn(10, "PK Tidak Memiliki Akar Real – UN", {
    type: "mixed",
    content: "Tentukan apakah persamaan berikut memiliki akar real:",
    parts: [
      { label: "a.", math: "x^2 + 2x + 5 = 0" },
      { label: "b.", math: "2x^2 - 3x + 4 = 0" },
      { label: "c.", math: "3x^2 + x + 1 = 0" },
    ],
  }),
  Qn(11, "Rumus ABC – Akar Kembar – TKA", {
    type: "mixed",
    content: "Tunjukkan bahwa PK berikut memiliki akar kembar dan tentukan nilainya:",
    parts: [
      { label: "a.", math: "x^2 - 6x + 9 = 0" },
      { label: "b.", math: "4x^2 + 4x + 1 = 0" },
      { label: "c.", math: "9x^2 - 12x + 4 = 0" },
    ],
  }),
  Qn(12, "Soal Cerita – Gerak Jatuh Bebas – UN", {
    type: "mixed",
    content: "Bola dilempar ke atas dengan kecepatan awal 20 m/s. Tingginya: h = −5t² + 20t.",
    parts: [
      { label: "a.", math: "\\text{Saat } h = 0: -5t^2 + 20t = 0" },
      { label: "b.", math: "\\text{Atau: } 5t^2 - 20t = 0 \\rightarrow t(t-4) = 0" },
      { label: "c.", text: "Kapan bola kembali ke tanah? Gunakan rumus ABC!" },
    ],
  }),
  Qn(13, "Menggunakan Rumus ABC – Langkah Penuh – ANBK", {
    type: "mixed",
    content: "Selesaikan dengan menampilkan semua langkah:",
    parts: [
      { label: "a.", math: "x^2 - 8x + 7 = 0" },
      { label: "b.", math: "\\text{a=1, b=-8, c=7} \\Rightarrow D = 64 - 28 = \\ldots" },
      { label: "c.", math: "x = \\frac{8 \\pm \\sqrt{36}}{2} = \\ldots" },
    ],
  }),
  Qn(14, "Rumus ABC – Koef. Pecahan – TKA", {
    type: "mixed",
    content: "Kalikan dulu untuk mendapatkan koefisien bilangan bulat:",
    parts: [
      { label: "a.", math: "\\frac{x^2}{2} - x - \\frac{3}{2} = 0" },
      { label: "b.", math: "\\frac{1}{3}x^2 + x - 2 = 0" },
      { label: "c.", math: "0{,}5x^2 - 3x + 1 = 0" },
    ],
  }),
  Qn(15, "Soal UN – Nilai Ekspresi dari Akar ABC", {
    type: "mixed",
    content: "Akar-akar x² − 3x − 10 = 0 adalah x₁ dan x₂. Gunakan rumus ABC, lalu hitung:",
    parts: [
      { label: "a.", math: "x_1 + x_2" },
      { label: "b.", math: "x_1 \\cdot x_2" },
      { label: "c.", math: "x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1 x_2" },
    ],
  }),
  Qn(16, "Rumus ABC – Penyederhanaan √D – UN", {
    type: "mixed",
    content: "Sederhanakan √D, lalu tentukan akar-akarnya:",
    parts: [
      { label: "a.", math: "x^2 - 2x - 8 = 0, \\quad D = 4 + 32 = \\ldots" },
      { label: "b.", math: "2x^2 + 5x - 3 = 0, \\quad D = 25 + 24 = \\ldots" },
      { label: "c.", math: "x^2 - 5x + 2 = 0, \\quad D = 25 - 8 = \\ldots" },
    ],
  }),
  Qn(17, "Soal Cerita – Jarak – ANBK", {
    type: "mixed",
    content: "Sebuah sepeda melaju dengan kecepatan (x + 2) km/jam selama x jam menempuh jarak 24 km.",
    parts: [
      { label: "a.", text: "Buat persamaan kuadratnya: kecepatan × waktu = jarak." },
      { label: "b.", math: "x(x+2) = 24 \\Rightarrow x^2 + 2x - 24 = 0" },
      { label: "c.", math: "\\text{Selesaikan dengan rumus ABC}" },
    ],
  }),
  Qn(18, "Rumus ABC – Mencari x Positif – TKA", {
    type: "mixed",
    content: "Selesaikan dan ambil akar yang positif:",
    parts: [
      { label: "a.", math: "x^2 - x - 12 = 0" },
      { label: "b.", math: "3x^2 - 2x - 8 = 0" },
      { label: "c.", math: "2x^2 - 3x - 5 = 0" },
    ],
  }),
  Qn(19, "Soal UN – Menentukan Akar Positif", {
    type: "mixed",
    content: "Lebar sebuah lapangan 3 m lebih pendek dari panjangnya. Luas lapangan = 70 m².",
    parts: [
      { label: "a.", math: "x(x-3) = 70 \\Rightarrow x^2 - 3x - 70 = 0" },
      { label: "b.", math: "D = 9 + 280 = \\ldots, \\quad x = \\frac{3 \\pm \\sqrt{D}}{2}" },
      { label: "c.", text: "Tentukan panjang dan lebar lapangan (nilai positif)." },
    ],
  }),
  Qn(20, "Rumus ABC – Bentuk Setara – ANBK", {
    type: "mixed",
    content: "Ubah ke bentuk standar lalu selesaikan dengan rumus ABC:",
    parts: [
      { label: "a.", math: "(x+3)^2 = 7" },
      { label: "b.", math: "2x^2 = 4x + 3" },
      { label: "c.", math: "\\frac{x+1}{x-2} = \\frac{3}{x} \\quad (x \\neq 0, 2)" },
    ],
  }),
  Qn(21, "Rumus ABC – Latihan Cepat – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 - 10x + 16 = 0" },
      { label: "b.", math: "3x^2 + 7x - 6 = 0" },
      { label: "c.", math: "5x^2 - 4x - 1 = 0" },
    ],
  }),
  Qn(22, "Soal ANBK – Akar Campuran", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 - 3x - 1 = 0" },
      { label: "b.", math: "2x^2 + x - 4 = 0" },
      { label: "c.", math: "x^2 + 6x + 2 = 0" },
    ],
  }),
  Qn(23, "Rumus ABC – Persamaan Tidak Standar – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "3(x^2 - 2) = 4x" },
      { label: "b.", math: "x(x-5) = -3" },
      { label: "c.", math: "2x^2 - 5 = x" },
    ],
  }),
  Qn(24, "Soal TKA – Menentukan √D – Tanpa Kalkulator", {
    type: "mixed",
    content: "Hitung nilai √D secara manual (tanpa kalkulator):",
    parts: [
      { label: "a.", math: "x^2 - 8x + 12 = 0 \\Rightarrow D = 64-48 = 16 \\Rightarrow \\sqrt{D} = \\ldots" },
      { label: "b.", math: "2x^2 + 5x - 12 = 0 \\Rightarrow D = 25+96 = 121 \\Rightarrow \\sqrt{D} = \\ldots" },
      { label: "c.", math: "3x^2 - 7x + 4 = 0 \\Rightarrow D = 49 - 48 = 1 \\Rightarrow \\sqrt{D} = \\ldots" },
    ],
  }),
  Qn(25, "Rumus ABC – HOTS – UN", {
    type: "mixed",
    content: "Diketahui x₁ dan x₂ akar dari px² + qx + r = 0. Jika x₁ + x₂ = 4 dan x₁x₂ = −5, tentukan:",
    parts: [
      { label: "a.", math: "\\text{Nilai } x_1 \\text{ dan } x_2" },
      { label: "b.", math: "|x_1 - x_2|" },
      { label: "c.", math: "x_1^3 + x_2^3 = (x_1+x_2)(x_1^2 - x_1 x_2 + x_2^2)" },
    ],
  }),
  Qn(26, "Soal Cerita – Pertumbuhan – ANBK", {
    type: "mixed",
    content: "Modal awal Rp10.000 tumbuh dengan suku bunga r% per tahun. Setelah 2 tahun menjadi Rp12.100.",
    parts: [
      { label: "a.", math: "10000(1+r)^2 = 12100" },
      { label: "b.", math: "\\text{Misalkan } x = 1+r: 10000x^2 = 12100 \\Rightarrow x^2 = 1{,}21" },
      { label: "c.", math: "x = \\sqrt{1{,}21} = \\ldots, \\quad r = \\ldots\\%" },
    ],
  }),
  Qn(27, "Rumus ABC – Akar Negatif – TKA", {
    type: "mixed",
    content: "Selesaikan dan identifikasi akar positif serta negatif:",
    parts: [
      { label: "a.", math: "x^2 - x - 6 = 0" },
      { label: "b.", math: "2x^2 + x - 3 = 0" },
      { label: "c.", math: "x^2 - 2x - 15 = 0" },
    ],
  }),
  Qn(28, "Soal UN – Akar Irasional Disederhanakan", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 - 6x + 7 = 0 \\Rightarrow x = 3 \\pm \\sqrt{2}" },
      { label: "b.", math: "x^2 + 4x - 1 = 0 \\Rightarrow x = \\ldots" },
      { label: "c.", math: "2x^2 - 4x - 1 = 0 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(29, "Rumus ABC – Sistem Persamaan – ANBK", {
    type: "mixed",
    content: "Jumlah dua bilangan adalah 8 dan jumlah kuadratnya adalah 40. Temukan bilangan-bilangan itu.",
    parts: [
      { label: "a.", text: "Misalkan bilangan pertama = x, yang kedua = 8 − x." },
      { label: "b.", math: "x^2 + (8-x)^2 = 40 \\Rightarrow 2x^2 - 16x + 24 = 0" },
      { label: "c.", math: "x^2 - 8x + 12 = 0 \\rightarrow \\text{rumus ABC}" },
    ],
  }),
  Qn(30, "Rumus ABC – Kecocokan Metode – TKA", {
    type: "mixed",
    content: "Selesaikan. Jika D sempurna kuadrat, faktorkan; jika tidak, gunakan rumus ABC:",
    parts: [
      { label: "a.", math: "x^2 + 5x - 24 = 0" },
      { label: "b.", math: "x^2 - 7x + 3 = 0" },
      { label: "c.", math: "3x^2 + 4x - 2 = 0" },
    ],
  }),
  Qn(31, "Rumus ABC – Soal Geometri – UN", {
    type: "mixed",
    content: "Diagonal segi empat panjangnya (2x + 1) cm. Jika selisih kuadrat dua sisi = 45 dan sisi = x:",
    parts: [
      { label: "a.", math: "(x+3)^2 - x^2 = 45" },
      { label: "b.", math: "6x + 9 = 45 \\Rightarrow x = 6" },
      { label: "c.", text: "Periksa dengan rumus ABC apabila diubah ke bentuk PK." },
    ],
  }),
  Qn(32, "Rumus ABC Lanjut – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "7x^2 - 3x - 4 = 0" },
      { label: "b.", math: "4x^2 + 7x - 2 = 0" },
      { label: "c.", math: "9x^2 - 6x - 8 = 0" },
    ],
  }),
  Qn(33, "Soal HOTS – Membandingkan Metode – TKA", {
    type: "mixed",
    content: "Selesaikan 6x² − x − 2 = 0 dengan dua metode:",
    parts: [
      { label: "a.", text: "Metode pemfaktoran" },
      { label: "b.", math: "\\text{Metode rumus ABC: } x = \\frac{1 \\pm \\sqrt{1+48}}{12}" },
      { label: "c.", text: "Bandingkan hasilnya. Apakah sama?" },
    ],
  }),
  Qn(34, "Soal Cerita – Waktu Perjalanan – UN", {
    type: "mixed",
    content: "Jarak dari kota A ke kota B = 120 km. Pulang pergi, kecepatan berangkat 20 km/jam lebih dari pulang. Total waktu 5 jam.",
    parts: [
      { label: "a.", math: "\\frac{120}{v} + \\frac{120}{v-20} = 5" },
      { label: "b.", math: "5v^2 - 100v - 2400 = 0 \\Rightarrow v^2 - 20v - 480 = 0" },
      { label: "c.", math: "v = \\frac{20 \\pm \\sqrt{400+1920}}{2} = \\ldots" },
    ],
  }),
  Qn(35, "Rumus ABC – Soal Angka – ANBK", {
    type: "mixed",
    content: "Nilai dari 2x₁ − 3x₂ jika x₁ > x₂ dan keduanya adalah akar dari:",
    parts: [
      { label: "a.", math: "x^2 - x - 6 = 0" },
      { label: "b.", math: "x_1 = \\ldots, x_2 = \\ldots" },
      { label: "c.", math: "2x_1 - 3x_2 = \\ldots" },
    ],
  }),
  Qn(36, "Rumus ABC – Bentuk Setara – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x + \\frac{6}{x} = 5 \\quad (x \\neq 0)" },
      { label: "b.", math: "\\frac{x}{x+1} + \\frac{x+1}{x} = \\frac{5}{2} \\quad (x \\neq 0, -1)" },
      { label: "c.", math: "\\sqrt{x} + \\frac{2}{\\sqrt{x}} = 3 \\quad (x > 0, u = \\sqrt{x})" },
    ],
  }),
  Qn(37, "Soal UN – Akar Real dan Non-Real", {
    type: "mixed",
    content: "Tentukan jenis akar, lalu selesaikan jika real:",
    parts: [
      { label: "a.", math: "x^2 - 4x + 4 = 0" },
      { label: "b.", math: "x^2 - 4x + 5 = 0" },
      { label: "c.", math: "x^2 - 4x + 3 = 0" },
    ],
  }),
  Qn(38, "Soal Kontekstual – Fisika – ANBK", {
    type: "mixed",
    content: "Sebuah peluru ditembakkan vertikal ke atas. Ketinggiannya h = 30t − 5t² meter.",
    parts: [
      { label: "a.", math: "\\text{Kapan ketinggian } h = 40 \\text{ m? Buat PK!}" },
      { label: "b.", math: "5t^2 - 30t + 40 = 0 \\Rightarrow t^2 - 6t + 8 = 0" },
      { label: "c.", math: "t = \\frac{6 \\pm \\sqrt{36-32}}{2} = \\ldots" },
    ],
  }),
  Qn(39, "Soal Akar Kembar – TKA", {
    type: "mixed",
    content: "Jika PK berikut memiliki akar kembar, tentukan nilai k:",
    parts: [
      { label: "a.", math: "x^2 - 6x + k = 0 \\Rightarrow D = 36 - 4k = 0 \\Rightarrow k = \\ldots" },
      { label: "b.", math: "kx^2 - 4x + 1 = 0 \\Rightarrow D = 16 - 4k = 0 \\Rightarrow k = \\ldots" },
      { label: "c.", math: "x^2 + kx + 4 = 0 \\Rightarrow D = k^2 - 16 = 0 \\Rightarrow k = \\ldots" },
    ],
  }),
  Qn(40, "HOTS – Rumus ABC Gabungan – UN/TKA", {
    type: "mixed",
    content: "Diketahui PK: 2x² − (k+3)x + 2k = 0 memiliki dua akar real berbeda. Jika salah satu akar = 2:",
    parts: [
      { label: "a.", math: "\\text{Substitusi } x=2: 8 - 2(k+3) + 2k = 0 \\Rightarrow k = \\ldots" },
      { label: "b.", math: "\\text{Setelah k ditemukan, tulis PK lengkapnya}" },
      { label: "c.", math: "\\text{Cari akar kedua dengan rumus ABC}" },
    ],
  }),
];

const RumusKuadratikPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔢</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            RUMUS KUADRATIK (RUMUS ABC)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Persamaan Kuadrat · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 40 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-3">📐 Rumus Kuadratik</p>
          <div className="bg-white/5 rounded-lg px-3 py-3 mb-2 flex justify-center">
            <BlockMath math="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { name: "Diskriminan", math: "D = b^2 - 4ac" },
              { name: "D > 0", math: "\\text{2 akar real berbeda}" },
              { name: "D = 0", math: "\\text{akar kembar}" },
              { name: "D < 0", math: "\\text{tidak ada akar real}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-orange-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-orange-900/20 border border-orange-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-orange-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/persamaan-kuadrat"); }}
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Persamaan Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default RumusKuadratikPage;
