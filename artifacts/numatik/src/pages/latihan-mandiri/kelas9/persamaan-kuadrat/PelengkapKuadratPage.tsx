import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const PelengkapStepSVG = () => (
  <svg width="300" height="130" viewBox="0 0 300 130" className="mx-auto">
    <rect x="5" y="5" width="290" height="120" rx="12" fill="var(--card)" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.5"/>
    <text x="150" y="32" fill="#7dd3fc" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">x² + 6x + 5 = 0</text>
    <text x="150" y="52" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">x² + 6x = −5</text>
    <text x="150" y="72" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">x² + 6x + 9 = −5 + 9</text>
    <text x="150" y="92" fill="#7dd3fc" fontSize="11" fontFamily="monospace" textAnchor="middle">(x + 3)² = 4</text>
    <text x="150" y="112" fill="#fcd34d" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">x = −3 ± 2 → x = −1 atau x = −5</text>
  </svg>
);

const KuadratSempurnaSVG = () => (
  <svg width="300" height="100" viewBox="0 0 300 100" className="mx-auto">
    <rect x="5" y="5" width="290" height="90" rx="10" fill="var(--card)" fillOpacity="0.2" stroke="#0ea5e9" strokeWidth="1.5"/>
    <text x="150" y="30" fill="#7dd3fc" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Melengkapi Kuadrat</text>
    <text x="150" y="52" fill="#38bdf8" fontSize="12" fontFamily="monospace" textAnchor="middle">x² + bx → x² + bx + (b/2)² = (x + b/2)²</text>
    <text x="100" y="78" fill="#f59e0b" fontSize="11" fontFamily="monospace" textAnchor="middle">Tambahkan (b/2)²</text>
    <text x="220" y="78" fill="#f59e0b" fontSize="11" fontFamily="monospace" textAnchor="middle">ke kedua ruas</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pelengkap Kuadrat Dasar – UN", {
    type: "mixed", diagram: <PelengkapStepSVG />,
    content: "Selesaikan dengan metode pelengkap kuadrat:",
    parts: [
      { label: "a.", math: "x^2 + 4x - 5 = 0" },
      { label: "b.", math: "x^2 - 6x + 8 = 0" },
      { label: "c.", math: "x^2 + 8x + 12 = 0" },
    ],
  }),
  Qn(2, "Nilai yang Dilengkapi – ANBK", {
    type: "mixed", diagram: <KuadratSempurnaSVG />,
    content: "Tentukan bilangan yang harus ditambahkan untuk melengkapi kuadrat:",
    parts: [
      { label: "a.", math: "x^2 + 10x + \\square = (x + \\square)^2" },
      { label: "b.", math: "x^2 - 14x + \\square = (x - \\square)^2" },
      { label: "c.", math: "x^2 + 3x + \\square = (x + \\square)^2" },
    ],
  }),
  Qn(3, "Langkah Pelengkap Kuadrat – UN", {
    type: "mixed",
    content: "Selesaikan step-by-step dengan metode pelengkap kuadrat:",
    parts: [
      { label: "a.", math: "x^2 + 6x - 7 = 0" },
      { label: "b.", math: "x^2 - 2x - 3 = 0" },
      { label: "c.", math: "x^2 + 10x + 21 = 0" },
    ],
  }),
  Qn(4, "Pelengkap Kuadrat – Koef. a ≠ 1 – TKA", {
    type: "mixed",
    content: "Bagi dengan koefisien a terlebih dahulu, lalu lengkapi kuadrat:",
    parts: [
      { label: "a.", math: "2x^2 + 8x - 10 = 0" },
      { label: "b.", math: "3x^2 - 6x - 9 = 0" },
      { label: "c.", math: "4x^2 + 16x - 20 = 0" },
    ],
  }),
  Qn(5, "Mengubah ke Bentuk (x + p)² = q – UN", {
    type: "mixed",
    content: "Ubah setiap PK ke bentuk (x + p)² = q:",
    parts: [
      { label: "a.", math: "x^2 - 4x - 1 = 0 \\Rightarrow (x-2)^2 = \\ldots" },
      { label: "b.", math: "x^2 + 6x + 2 = 0 \\Rightarrow (x+3)^2 = \\ldots" },
      { label: "c.", math: "x^2 - 8x + 5 = 0 \\Rightarrow (x-4)^2 = \\ldots" },
    ],
  }),
  Qn(6, "Menentukan Akar dari Bentuk (x + p)² = q – ANBK", {
    type: "mixed",
    content: "Tentukan akar-akar dari bentuk yang sudah dilengkapi:",
    parts: [
      { label: "a.", math: "(x - 3)^2 = 16 \\Rightarrow x = \\ldots" },
      { label: "b.", math: "(x + 5)^2 = 9 \\Rightarrow x = \\ldots" },
      { label: "c.", math: "(2x - 1)^2 = 25 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(7, "Pelengkap Kuadrat – Akar Irasional – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 - 2x - 4 = 0" },
      { label: "b.", math: "x^2 + 4x + 1 = 0" },
      { label: "c.", math: "x^2 - 6x + 2 = 0" },
    ],
  }),
  Qn(8, "Soal Cerita – Pelengkap Kuadrat – UN", {
    type: "mixed",
    content: "Sebuah kotak tanpa tutup dibuat dari karton berukuran 10 × 12 cm dengan memotong persegi di sudutnya (sisi x). Volum kotak = 96 cm³.",
    parts: [
      { label: "a.", math: "x(10-2x)(12-2x) = 96" },
      { label: "b.", text: "Sederhanakan dan bentuk PK-nya." },
      { label: "c.", math: "\\text{Selesaikan dengan pelengkap kuadrat}" },
    ],
  }),
  Qn(9, "Bentuk Vertex/Puncak – ANBK", {
    type: "mixed",
    content: "Gunakan pelengkap kuadrat untuk mengubah ke bentuk vertex f(x) = a(x−h)² + k:",
    parts: [
      { label: "a.", math: "f(x) = x^2 - 4x + 7" },
      { label: "b.", math: "f(x) = x^2 + 6x + 10" },
      { label: "c.", math: "f(x) = x^2 - 10x + 30" },
    ],
  }),
  Qn(10, "Pelengkap Kuadrat – Koef. Pecahan – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 + 3x - 1 = 0" },
      { label: "b.", math: "x^2 - 5x + 2 = 0" },
      { label: "c.", math: "x^2 + 7x + 3 = 0" },
    ],
  }),
  Qn(11, "Proses Lengkap Pelengkap Kuadrat – UN", {
    type: "mixed",
    content: "Tunjukkan langkah 1 sd 5 untuk menyelesaikan:",
    parts: [
      { label: "Langkah 1", text: "Pindahkan c ke ruas kanan" },
      { label: "Langkah 2", text: "Tambahkan (b/2a)² ke kedua ruas" },
      { label: "Langkah 3", math: "2x^2 - 12x + 4 = 0 \\text{ → selesaikan!}" },
    ],
  }),
  Qn(12, "Pelengkap Kuadrat – Dua Tahap – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 + 12x - 13 = 0" },
      { label: "b.", math: "x^2 - 16x + 55 = 0" },
      { label: "c.", math: "x^2 + 20x + 91 = 0" },
    ],
  }),
  Qn(13, "Pelengkap Kuadrat – a = 2 – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2x^2 - 12x + 10 = 0" },
      { label: "b.", math: "2x^2 + 6x - 8 = 0" },
      { label: "c.", math: "2x^2 - 10x + 12 = 0" },
    ],
  }),
  Qn(14, "Mengidentifikasi Kesalahan – ANBK", {
    type: "mixed",
    content: "Berikut langkah penyelesaian x² − 4x − 12 = 0. Temukan kesalahan dan perbaiki:",
    parts: [
      { label: "a.", math: "x^2 - 4x = 12" },
      { label: "b.", math: "x^2 - 4x + 4 = 12 + 4 \\text{ (BENAR/SALAH?)}" },
      { label: "c.", math: "(x-2)^2 = 16 \\Rightarrow x = 2 \\pm 4 = \\ldots" },
    ],
  }),
  Qn(15, "Pelengkap Kuadrat Negatif – UN", {
    type: "mixed",
    content: "Jika D < 0, nyatakan dalam bentuk bilangan kompleks (opsional) atau simpulkan tidak ada akar real:",
    parts: [
      { label: "a.", math: "x^2 + 2x + 5 = 0" },
      { label: "b.", math: "x^2 - 4x + 8 = 0" },
      { label: "c.", text: "Apa yang terjadi jika (x+p)² = q dengan q negatif?" },
    ],
  }),
  Qn(16, "Menggunakan Pelengkap Kuadrat untuk Membuktikan Rumus ABC – TKA", {
    type: "mixed",
    content: "Buktikan rumus kuadratik dari ax² + bx + c = 0 dengan metode pelengkap kuadrat:",
    parts: [
      { label: "Langkah 1", math: "x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0" },
      { label: "Langkah 2", math: "x^2 + \\frac{b}{a}x = -\\frac{c}{a}" },
      { label: "Langkah 3", math: "\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2} \\Rightarrow x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" },
    ],
  }),
  Qn(17, "Pelengkap Kuadrat – Akar Kembar – UN", {
    type: "mixed",
    content: "Selesaikan dan identifikasi apakah akarnya kembar:",
    parts: [
      { label: "a.", math: "x^2 - 6x + 9 = 0" },
      { label: "b.", math: "x^2 + 10x + 25 = 0" },
      { label: "c.", math: "4x^2 - 4x + 1 = 0" },
    ],
  }),
  Qn(18, "Pelengkap Kuadrat – Kontekstual – ANBK", {
    type: "mixed",
    content: "Tinggi bola h = −t² + 6t meter. Tentukan waktu saat bola berada di ketinggian maksimum.",
    parts: [
      { label: "a.", math: "h = -(t^2 - 6t) = -\\left[(t-3)^2 - 9\\right]" },
      { label: "b.", math: "h = -(t-3)^2 + 9" },
      { label: "c.", text: "Tinggi maksimum berapa? Kapan terjadi?" },
    ],
  }),
  Qn(19, "Pelengkap Kuadrat – Soal Campuran – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 - 7x + 6 = 0" },
      { label: "b.", math: "3x^2 + 6x - 24 = 0" },
      { label: "c.", math: "5x^2 - 20x + 15 = 0" },
    ],
  }),
  Qn(20, "Mencari Puncak Parabola – UN", {
    type: "mixed",
    content: "Fungsi kuadrat: f(x) = x² − 8x + 13",
    parts: [
      { label: "a.", math: "f(x) = (x - 4)^2 - 3 \\text{ (pelengkap kuadrat)}" },
      { label: "b.", text: "Tentukan koordinat puncak." },
      { label: "c.", text: "Apakah parabola membuka ke atas atau ke bawah?" },
    ],
  }),
  Qn(21, "Pelengkap Kuadrat – a = 3 – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "3x^2 - 12x + 9 = 0" },
      { label: "b.", math: "3x^2 + 18x + 15 = 0" },
      { label: "c.", math: "3x^2 - 24x + 36 = 0" },
    ],
  }),
  Qn(22, "Menentukan b/2 dan (b/2)² – UN", {
    type: "mixed",
    content: "Tentukan nilai yang ditambahkan dalam pelengkap kuadrat:",
    parts: [
      { label: "a.", math: "x^2 + 9x: \\quad \\left(\\frac{b}{2}\\right)^2 = \\left(\\frac{9}{2}\\right)^2 = \\ldots" },
      { label: "b.", math: "x^2 - 11x: \\quad \\left(\\frac{b}{2}\\right)^2 = \\ldots" },
      { label: "c.", math: "x^2 + \\frac{5}{2}x: \\quad \\left(\\frac{b}{2}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(23, "Soal Cerita – Luas Taman – ANBK", {
    type: "mixed",
    content: "Luas taman berbentuk persegi panjang adalah 24 m². Panjangnya 2 m lebih dari lebarnya.",
    parts: [
      { label: "a.", math: "x(x+2) = 24 \\Rightarrow x^2 + 2x - 24 = 0" },
      { label: "b.", math: "(x+1)^2 = 25 \\Rightarrow x+1 = \\pm 5" },
      { label: "c.", text: "Tentukan lebar dan panjang taman." },
    ],
  }),
  Qn(24, "Pelengkap Kuadrat – Koef. b Ganjil – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 + 5x - 14 = 0" },
      { label: "b.", math: "x^2 - 7x + 10 = 0" },
      { label: "c.", math: "x^2 + 9x - 22 = 0" },
    ],
  }),
  Qn(25, "Pelengkap Kuadrat – Verifikasi – UN", {
    type: "mixed",
    content: "Selesaikan x² + 2x − 8 = 0 dengan pelengkap kuadrat. Kemudian verifikasi hasilnya dengan substitusi:",
    parts: [
      { label: "a.", math: "(x+1)^2 = 9 \\Rightarrow x = -1 \\pm 3" },
      { label: "b.", math: "\\text{Substitusi } x = 2: 4 + 4 - 8 = \\ldots" },
      { label: "c.", math: "\\text{Substitusi } x = -4: 16 - 8 - 8 = \\ldots" },
    ],
  }),
  Qn(26, "Soal UN – Menyatakan dalam Bentuk Vertex", {
    type: "mixed",
    content: "Ubah ke bentuk vertex f(x) = a(x−h)² + k:",
    parts: [
      { label: "a.", math: "f(x) = 2x^2 - 8x + 5" },
      { label: "b.", math: "f(x) = -x^2 + 6x - 4" },
      { label: "c.", math: "f(x) = 3x^2 + 12x + 7" },
    ],
  }),
  Qn(27, "Pelengkap Kuadrat – Pecahan Hasil – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 + 3x + 1 = 0" },
      { label: "b.", math: "x^2 - x - 1 = 0" },
      { label: "c.", math: "x^2 + x - 3 = 0" },
    ],
  }),
  Qn(28, "Soal TKA – Pelengkap Kuadrat Campuran", {
    type: "mixed",
    parts: [
      { label: "a.", math: "4x^2 - 8x - 5 = 0" },
      { label: "b.", math: "9x^2 + 6x - 8 = 0" },
      { label: "c.", math: "16x^2 - 24x - 7 = 0" },
    ],
  }),
  Qn(29, "Soal Fisika – Gerak Parabola – UN", {
    type: "mixed",
    content: "Ketinggian bola h = −2t² + 8t + 3. Tentukan ketinggian maksimum dengan pelengkap kuadrat.",
    parts: [
      { label: "a.", math: "h = -2(t^2 - 4t) + 3" },
      { label: "b.", math: "h = -2(t-2)^2 + 11" },
      { label: "c.", text: "Ketinggian maksimum = ? Saat t = ?" },
    ],
  }),
  Qn(30, "Pelengkap Kuadrat – Soal Non-Standar – ANBK", {
    type: "mixed",
    content: "Ubah ke bentuk standar dulu, lalu selesaikan dengan pelengkap kuadrat:",
    parts: [
      { label: "a.", math: "x^2 = 6x - 5" },
      { label: "b.", math: "x(x+4) = 21" },
      { label: "c.", math: "(x-3)(x+1) = 5" },
    ],
  }),
  Qn(31, "Nilai Ekspresi dari Akar Pelengkap Kuadrat – TKA", {
    type: "mixed",
    content: "Akar-akar x² − 8x + 12 = 0 adalah x₁ dan x₂ (x₁ > x₂). Tentukan:",
    parts: [
      { label: "a.", math: "x_1 \\text{ dan } x_2" },
      { label: "b.", math: "x_1 - x_2" },
      { label: "c.", math: "x_1^2 + x_2^2" },
    ],
  }),
  Qn(32, "Soal UN – Menentukan h dan k dari Vertex", {
    type: "mixed",
    content: "Ubah ke bentuk a(x − h)² + k dan tentukan h, k:",
    parts: [
      { label: "a.", math: "f(x) = x^2 - 12x + 40" },
      { label: "b.", math: "f(x) = x^2 + 4x + 1" },
      { label: "c.", math: "f(x) = x^2 - x - \\frac{3}{4}" },
    ],
  }),
  Qn(33, "Soal ANBK – PK dengan a Negatif", {
    type: "mixed",
    content: "Selesaikan PK dengan a < 0 menggunakan pelengkap kuadrat:",
    parts: [
      { label: "a.", math: "-x^2 + 4x + 5 = 0" },
      { label: "b.", math: "-2x^2 + 8x - 6 = 0" },
      { label: "c.", math: "-x^2 + 6x - 9 = 0" },
    ],
  }),
  Qn(34, "Soal Cerita – Keuntungan Maksimum – UN", {
    type: "mixed",
    content: "Keuntungan perusahaan: K(x) = −x² + 10x − 16 (jutaan rupiah), x = jumlah produk (ratus unit).",
    parts: [
      { label: "a.", math: "K(x) = -(x-5)^2 + 9 \\text{ (pelengkap kuadrat)}" },
      { label: "b.", text: "Keuntungan maksimum berapa? Saat x berapa?" },
      { label: "c.", math: "\\text{Saat K = 0: } -x^2 + 10x - 16 = 0 \\rightarrow x = \\ldots" },
    ],
  }),
  Qn(35, "Pelengkap Kuadrat – a = 5 – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "5x^2 - 10x - 15 = 0" },
      { label: "b.", math: "5x^2 + 20x - 25 = 0" },
      { label: "c.", math: "5x^2 - 30x + 40 = 0" },
    ],
  }),
  Qn(36, "Pelengkap Kuadrat – UN HOTS", {
    type: "mixed",
    content: "Diketahui x² + px + q = 0 memiliki akar x₁ = 2 + √5 dan x₂ = 2 − √5.",
    parts: [
      { label: "a.", math: "x_1 + x_2 = \\ldots = -p \\Rightarrow p = \\ldots" },
      { label: "b.", math: "x_1 x_2 = \\ldots = q \\Rightarrow q = \\ldots" },
      { label: "c.", math: "\\text{Verifikasi dengan } (x-2)^2 = 5" },
    ],
  }),
  Qn(37, "Soal TKA – Akar dari (x+p)² = q", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(x + 4)^2 = 49" },
      { label: "b.", math: "(x - 7)^2 = 36" },
      { label: "c.", math: "(2x + 3)^2 = 25" },
    ],
  }),
  Qn(38, "Soal ANBK – Akar Non-Real dari Pelengkap Kuadrat", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 + 4x + 5 = 0 \\Rightarrow (x+2)^2 = -1" },
      { label: "b.", text: "Apa kesimpulannya?" },
      { label: "c.", math: "x^2 - 6x + 10 = 0 \\Rightarrow (x-3)^2 = \\ldots" },
    ],
  }),
  Qn(39, "Soal UN – Dua Metode Dibandingkan", {
    type: "mixed",
    content: "Selesaikan x² − 5x + 4 = 0 dengan:",
    parts: [
      { label: "a.", text: "Metode pemfaktoran" },
      { label: "b.", text: "Metode pelengkap kuadrat" },
      { label: "c.", text: "Apakah hasil kedua metode sama? Metode mana lebih efisien?" },
    ],
  }),
  Qn(40, "HOTS – Pelengkap Kuadrat Parametrik – TKA", {
    type: "mixed",
    content: "PK: x² + (2k)x + (k² − 3) = 0. Dengan pelengkap kuadrat:",
    parts: [
      { label: "a.", math: "(x + k)^2 = 3 \\Rightarrow x = -k \\pm \\sqrt{3}" },
      { label: "b.", math: "\\text{Jika } k = 1, \\text{ tentukan akar-akarnya}" },
      { label: "c.", math: "\\text{Jika } k = -2, \\text{ tentukan akar-akarnya}" },
    ],
  }),
];

const PelengkapKuadratPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔲</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            PELENGKAP KUADRAT
          </h1>
          <p className={isDark ? "text-white/50 text-xs text-center font-body" : "text-gray-500 text-xs text-center font-body"}>Kelas 9 · Persamaan Kuadrat · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 40 {t('practice.suffixSoal')}</span>
            <span className={isDark ? "text-white/30 text-xs" : "text-gray-400 text-xs"}>·</span>
            <span className={isDark ? "text-white/50 text-xs" : "text-gray-500 text-xs"}>UN / ANBK / TKA</span>
          </div>
        </div>

        <div className={isDark ? "mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4" : "mb-5 bg-sky-50 border border-sky-500/20 rounded-xl p-4"}>
          <p className="text-sky-300 text-xs font-bold mb-3">📐 Langkah Pelengkap Kuadrat</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Langkah 1", math: "ax^2+bx+c=0 \\div a" },
              { name: "Langkah 2", math: "x^2+\\tfrac{b}{a}x = -\\tfrac{c}{a}" },
              { name: "Langkah 3", math: "+\\left(\\tfrac{b}{2a}\\right)^2 \\text{ ke dua ruas}" },
              { name: "Langkah 4", math: "\\left(x+\\tfrac{b}{2a}\\right)^2 = \\tfrac{D}{4a^2}" },
            ].map(r => (
              <div key={r.name} className={isDark ? "bg-white/5 rounded-lg px-3 py-2" : "bg-gray-50 rounded-lg px-3 py-2"}>
                <div className={isDark ? "text-white/40 text-[9px] uppercase mb-1" : "text-gray-500 text-[9px] uppercase mb-1"}>{r.name}</div>
                <div className="text-sky-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className={isDark ? "absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" : "absolute inset-0 bg-gradient-to-br from-sky-50/60 via-white/80 to-blue-50/40 backdrop-blur"} />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className={isDark ? "font-body text-sm text-white/90 leading-relaxed mb-3" : "font-body text-sm text-gray-800 leading-relaxed mb-3"}>{q.content}</p>}
                    {q.mathContent && <div className={isDark ? "mb-3 bg-sky-900/20 border border-sky-500/20 rounded-lg px-4 py-3 flex justify-center" : "mb-3 bg-sky-50 border border-sky-500/20 rounded-lg px-4 py-3 flex justify-center"}><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className={isDark ? "mb-3 flex justify-center bg-white/5 rounded-xl p-3" : "mb-3 flex justify-center bg-gray-50 rounded-xl p-3"}>{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={isDark ? "flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5" : "flex items-start gap-2 rounded-lg px-3 py-2 bg-gray-50"}>
                            <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className={isDark ? "text-white text-sm overflow-x-auto" : "text-foreground text-sm overflow-x-auto"}><InlineMath math={p.math} /></div>
                              : <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>{p.text}</p>}
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
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Persamaan Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default PelengkapKuadratPage;
