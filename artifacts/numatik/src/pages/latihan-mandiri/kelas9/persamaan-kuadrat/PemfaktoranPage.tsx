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

const PemfaktoranStepSVG = () => (
  <svg width="300" height="120" viewBox="0 0 300 120" className="mx-auto">
    <rect x="5" y="10" width="290" height="100" rx="10" fill="var(--card)" fillOpacity="0.3" stroke="#34d399" strokeWidth="1.5"/>
    <text x="150" y="40" fill="#6ee7b7" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">x² + 5x + 6 = 0</text>
    <text x="150" y="62" fill="#34d399" fontSize="13" fontFamily="monospace" textAnchor="middle">Cari p·q = 6, p+q = 5</text>
    <text x="150" y="82" fill="#a7f3d0" fontSize="13" fontFamily="monospace" textAnchor="middle">(x + 2)(x + 3) = 0</text>
    <text x="90" y="102" fill="#fcd34d" fontSize="12" fontFamily="monospace" textAnchor="middle">x = −2</text>
    <text x="210" y="102" fill="#fcd34d" fontSize="12" fontFamily="monospace" textAnchor="middle">x = −3</text>
  </svg>
);

const BedaKuadratSVG = () => (
  <svg width="300" height="100" viewBox="0 0 300 100" className="mx-auto">
    <rect x="5" y="5" width="290" height="90" rx="10" fill="var(--card)" fillOpacity="0.2" stroke="#059669" strokeWidth="1.5"/>
    <text x="150" y="32" fill="#6ee7b7" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">a² − b² = (a+b)(a−b)</text>
    <text x="150" y="58" fill="#34d399" fontSize="12" fontFamily="monospace" textAnchor="middle">x² − 9 = (x+3)(x−3)</text>
    <text x="90" y="82" fill="#fcd34d" fontSize="12" fontFamily="monospace" textAnchor="middle">x = −3</text>
    <text x="210" y="82" fill="#fcd34d" fontSize="12" fontFamily="monospace" textAnchor="middle">x = 3</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pemfaktoran Dasar – UN", {
    type: "mixed", diagram: <PemfaktoranStepSVG />,
    content: "Tentukan akar-akar persamaan kuadrat berikut dengan pemfaktoran:",
    parts: [
      { label: "a.", math: "x^2 + 7x + 12 = 0" },
      { label: "b.", math: "x^2 - 9x + 20 = 0" },
      { label: "c.", math: "x^2 + x - 12 = 0" },
    ],
  }),
  Qn(2, "Pemfaktoran dengan Koefisien Negatif – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 - 5x - 14 = 0" },
      { label: "b.", math: "x^2 - 3x - 28 = 0" },
      { label: "c.", math: "x^2 - x - 30 = 0" },
    ],
  }),
  Qn(3, "Pemfaktoran a ≠ 1 – UN", {
    type: "mixed",
    content: "Gunakan metode pemfaktoran untuk mencari akar-akar PK:",
    parts: [
      { label: "a.", math: "2x^2 + 7x + 3 = 0" },
      { label: "b.", math: "3x^2 - 10x + 3 = 0" },
      { label: "c.", math: "4x^2 + 4x - 3 = 0" },
    ],
  }),
  Qn(4, "Beda Dua Kuadrat – UN", {
    type: "mixed", diagram: <BedaKuadratSVG />,
    content: "Faktorkan menggunakan rumus a² − b²:",
    parts: [
      { label: "a.", math: "x^2 - 25 = 0" },
      { label: "b.", math: "4x^2 - 49 = 0" },
      { label: "c.", math: "9x^2 - 16 = 0" },
    ],
  }),
  Qn(5, "Kuadrat Sempurna – ANBK", {
    type: "mixed",
    content: "Faktorkan sebagai kuadrat sempurna:",
    parts: [
      { label: "a.", math: "x^2 + 6x + 9 = 0" },
      { label: "b.", math: "x^2 - 10x + 25 = 0" },
      { label: "c.", math: "4x^2 + 12x + 9 = 0" },
    ],
  }),
  Qn(6, "PK Tak Lengkap – Pemfaktoran – UN", {
    type: "mixed",
    content: "Selesaikan dengan memfaktorkan (c = 0):",
    parts: [
      { label: "a.", math: "x^2 - 7x = 0" },
      { label: "b.", math: "3x^2 + 9x = 0" },
      { label: "c.", math: "5x^2 - 15x = 0" },
    ],
  }),
  Qn(7, "Pemfaktoran Langsung – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 + 11x + 30 = 0" },
      { label: "b.", math: "x^2 - 13x + 36 = 0" },
      { label: "c.", math: "x^2 + 2x - 48 = 0" },
    ],
  }),
  Qn(8, "Pemfaktoran 2ax² + bx + c – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2x^2 - 5x - 3 = 0" },
      { label: "b.", math: "3x^2 + 11x + 6 = 0" },
      { label: "c.", math: "6x^2 - x - 2 = 0" },
    ],
  }),
  Qn(9, "Mengubah ke Bentuk Standar lalu Faktorkan – UN", {
    type: "mixed",
    content: "Ubah ke bentuk standar dulu, lalu faktorkan:",
    parts: [
      { label: "a.", math: "x^2 = 5x - 6" },
      { label: "b.", math: "x(x + 4) = 5" },
      { label: "c.", math: "(x-3)(x+3) = 7x" },
    ],
  }),
  Qn(10, "Akar dari Pemfaktoran – UN", {
    type: "mixed",
    content: "Tentukan himpunan penyelesaian:",
    parts: [
      { label: "a.", math: "x^2 - 4x - 21 = 0" },
      { label: "b.", math: "2x^2 + 3x - 9 = 0" },
      { label: "c.", math: "x^2 - 36 = 0" },
    ],
  }),
  Qn(11, "Soal Cerita – Pemfaktoran – UN", {
    type: "mixed",
    content: "Luas sebuah kolam renang berbentuk persegi panjang adalah 60 m². Panjangnya lebih 7 m dari lebarnya.",
    parts: [
      { label: "a.", text: "Bentuk persamaan kuadratnya." },
      { label: "b.", math: "x^2 + 7x - 60 = 0 \\text{ — faktorkan!}" },
      { label: "c.", text: "Tentukan panjang dan lebar kolam." },
    ],
  }),
  Qn(12, "Pemfaktoran Bilangan Bulat – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 - 15x + 56 = 0" },
      { label: "b.", math: "x^2 + 16x + 63 = 0" },
      { label: "c.", math: "x^2 - 20x + 96 = 0" },
    ],
  }),
  Qn(13, "Faktorkan 4ax² + bx – TKA", {
    type: "mixed",
    content: "Faktorkan PK berikut (tanpa konstanta c):",
    parts: [
      { label: "a.", math: "4x^2 - 8x = 0" },
      { label: "b.", math: "6x^2 + 18x = 0" },
      { label: "c.", math: "-3x^2 + 12x = 0" },
    ],
  }),
  Qn(14, "Faktorkan dengan Substitusi – ANBK", {
    type: "mixed",
    content: "Gunakan substitusi u = x + k untuk memfaktorkan:",
    parts: [
      { label: "a.", math: "(x+1)^2 - 3(x+1) - 4 = 0" },
      { label: "b.", math: "(2x-1)^2 + 2(2x-1) - 15 = 0" },
      { label: "c.", math: "(x+3)^2 - 5(x+3) + 6 = 0" },
    ],
  }),
  Qn(15, "Nilai x dari Akar – UN", {
    type: "mixed",
    content: "Jika akar-akar PK berikut adalah x₁ dan x₂, tentukan nilainya:",
    parts: [
      { label: "a.", math: "x^2 - 8x + 15 = 0" },
      { label: "b.", math: "x^2 + 4x - 45 = 0" },
      { label: "c.", math: "x^2 - x - 72 = 0" },
    ],
  }),
  Qn(16, "PK dengan Koefisien Besar – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "5x^2 - 13x + 6 = 0" },
      { label: "b.", math: "6x^2 + 5x - 6 = 0" },
      { label: "c.", math: "8x^2 - 10x + 3 = 0" },
    ],
  }),
  Qn(17, "Soal Cerita – Dua Bilangan – UN", {
    type: "mixed",
    content: "Selisih dua bilangan adalah 5 dan hasil kalinya adalah 84.",
    parts: [
      { label: "a.", text: "Bentuk PK-nya." },
      { label: "b.", math: "x^2 - 5x - 84 = 0" },
      { label: "c.", text: "Faktorkan dan tentukan kedua bilangan tersebut." },
    ],
  }),
  Qn(18, "Verifikasi Akar dengan Pemfaktoran – ANBK", {
    type: "mixed",
    content: "Faktorkan dan verifikasi dengan substitusi:",
    parts: [
      { label: "a.", math: "x^2 - 7x + 10 = 0" },
      { label: "b.", math: "\\text{Verifikasi: } x = 2 \\text{ dan } x = 5" },
      { label: "c.", math: "\\text{Hitung: } 2^2 - 7(2) + 10 = \\ldots" },
    ],
  }),
  Qn(19, "Beda Kuadrat Kompleks – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "25x^2 - 4 = 0" },
      { label: "b.", math: "x^2 - \\frac{1}{4} = 0" },
      { label: "c.", math: "\\frac{x^2}{9} - 1 = 0" },
    ],
  }),
  Qn(20, "Pemfaktoran dengan Pindah Ruas – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 = 3x + 40" },
      { label: "b.", math: "2x^2 = 3 - x" },
      { label: "c.", math: "6x = 2 - x^2" },
    ],
  }),
  Qn(21, "Soal Cerita – Luas Segitiga – ANBK", {
    type: "mixed",
    content: "Alas segitiga lebih panjang 4 cm dari tingginya. Jika luasnya 30 cm²:",
    parts: [
      { label: "a.", text: "Misalkan tinggi = t, bentuk PK-nya." },
      { label: "b.", math: "t^2 + 4t - 60 = 0 \\text{ — faktorkan!}" },
      { label: "c.", text: "Tentukan tinggi dan alas segitiga." },
    ],
  }),
  Qn(22, "Faktorkan Polinom Tingkat Tinggi – TKA", {
    type: "mixed",
    content: "Dengan substitusi u = x², ubah ke PK dalam u lalu faktorkan:",
    parts: [
      { label: "a.", math: "x^4 - 5x^2 + 4 = 0" },
      { label: "b.", math: "x^4 - 13x^2 + 36 = 0" },
      { label: "c.", math: "x^4 - 10x^2 + 9 = 0" },
    ],
  }),
  Qn(23, "Pemfaktoran PK Lengkap – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "3x^2 - 7x - 6 = 0" },
      { label: "b.", math: "4x^2 - 12x + 9 = 0" },
      { label: "c.", math: "2x^2 + 11x + 12 = 0" },
    ],
  }),
  Qn(24, "Akar Kembar dari Pemfaktoran – ANBK", {
    type: "mixed",
    content: "Jika PK memiliki akar kembar (x₁ = x₂), faktorkan:",
    parts: [
      { label: "a.", math: "x^2 - 6x + 9 = 0" },
      { label: "b.", math: "4x^2 + 4x + 1 = 0" },
      { label: "c.", math: "9x^2 - 12x + 4 = 0" },
    ],
  }),
  Qn(25, "Pemfaktoran Berulang – TKA", {
    type: "mixed",
    content: "Faktorkan seluruhnya (termasuk faktor bersama):",
    parts: [
      { label: "a.", math: "2x^3 - 8x = 0" },
      { label: "b.", math: "3x^3 - 12x = 0" },
      { label: "c.", math: "x^3 - 9x = 0" },
    ],
  }),
  Qn(26, "Faktorkan Ekspresi Campuran – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 + 2x\\sqrt{3} - 9 = 0" },
      { label: "b.", math: "x^2 - 5x + 6 = 0 \\text{ (cek: akar rasional?)}" },
      { label: "c.", math: "x^2 + 6x + 8 = 0" },
    ],
  }),
  Qn(27, "Soal Cerita – Jarak dan Waktu – UN", {
    type: "mixed",
    content: "Seorang anak berlari sejauh (x² − 2x) meter dalam x detik. Jika jarak = 15 m dan waktu = 5 detik:",
    parts: [
      { label: "a.", text: "Substitusi nilai yang diketahui." },
      { label: "b.", math: "x^2 - 2x - 15 = 0 \\text{ — faktorkan!}" },
      { label: "c.", text: "Tentukan nilai x yang memenuhi konteks soal." },
    ],
  }),
  Qn(28, "PK dengan Koefisien Pecahan – ANBK", {
    type: "mixed",
    content: "Kalikan dulu agar koefisien bilangan bulat, lalu faktorkan:",
    parts: [
      { label: "a.", math: "\\frac{1}{2}x^2 + \\frac{3}{2}x - 2 = 0" },
      { label: "b.", math: "\\frac{1}{3}x^2 - \\frac{4}{3}x + 1 = 0" },
      { label: "c.", math: "0{,}5x^2 - 2{,}5x + 3 = 0" },
    ],
  }),
  Qn(29, "Faktorkan Persamaan Non-Standar – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(x+1)(x-6) = -8" },
      { label: "b.", math: "(2x-3)(x+2) = 6" },
      { label: "c.", math: "(x-4)^2 = x + 2" },
    ],
  }),
  Qn(30, "Soal UN – Nilai Ekspresi dari Akar", {
    type: "mixed",
    content: "Akar-akar x² − 5x + 6 = 0 adalah x₁ dan x₂. Tentukan:",
    parts: [
      { label: "a.", math: "x_1 + x_2" },
      { label: "b.", math: "x_1 \\cdot x_2" },
      { label: "c.", math: "x_1^2 + x_2^2" },
    ],
  }),
  Qn(31, "Pemfaktoran Soal HOTS – UN/TKA", {
    type: "mixed",
    content: "Diketahui x₁ dan x₂ adalah akar dari 2x² − 7x + 3 = 0. Tentukan:",
    parts: [
      { label: "a.", math: "x_1 \\text{ dan } x_2 \\text{ dengan pemfaktoran}" },
      { label: "b.", math: "\\frac{1}{x_1} + \\frac{1}{x_2}" },
      { label: "c.", math: "x_1^2 - x_2^2" },
    ],
  }),
  Qn(32, "Pemfaktoran PK Symetris – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 - 2x - 63 = 0" },
      { label: "b.", math: "x^2 + 14x + 45 = 0" },
      { label: "c.", math: "x^2 - 18x + 80 = 0" },
    ],
  }),
  Qn(33, "Soal Cerita – Usia – UN", {
    type: "mixed",
    content: "Usia Budi lebih muda 3 tahun dari usia Ani. Hasil kali usia keduanya adalah 130.",
    parts: [
      { label: "a.", text: "Misalkan usia Budi = x, buat PK-nya." },
      { label: "b.", math: "x^2 + 3x - 130 = 0 \\text{ — faktorkan!}" },
      { label: "c.", text: "Tentukan usia masing-masing." },
    ],
  }),
  Qn(34, "Faktorkan PK dengan Koef. Negatif – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "-x^2 + 9x - 20 = 0" },
      { label: "b.", math: "-2x^2 + 7x - 3 = 0" },
      { label: "c.", math: "-x^2 + x + 12 = 0" },
    ],
  }),
  Qn(35, "Faktorkan Berdasarkan Hasil Kali − Jumlah – UN", {
    type: "mixed",
    content: "Untuk memfaktorkan x² + bx + c, cari dua bilangan p, q di mana p·q = c dan p + q = b:",
    parts: [
      { label: "a.", math: "x^2 - 7x + 6 = 0 \\text{ (cari: pq=6, p+q=-7)}" },
      { label: "b.", math: "x^2 + 3x - 18 = 0 \\text{ (cari: pq=-18, p+q=3)}" },
      { label: "c.", math: "x^2 - x - 20 = 0 \\text{ (cari: pq=-20, p+q=-1)}" },
    ],
  }),
  Qn(36, "Persamaan Kuadrat dengan Pangkat Pecahan – ANBK", {
    type: "mixed",
    content: "Gunakan substitusi untuk mengubah ke PK:",
    parts: [
      { label: "a.", math: "x - 5\\sqrt{x} + 6 = 0 \\quad (u = \\sqrt{x})" },
      { label: "b.", math: "x^{2/3} - 5x^{1/3} + 6 = 0 \\quad (u = x^{1/3})" },
      { label: "c.", math: "\\text{Selesaikan dan cari nilai } x" },
    ],
  }),
  Qn(37, "Soal UN – Faktorkan Lalu Tentukan HP", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 - 49 = 0" },
      { label: "b.", math: "9x^2 - 1 = 0" },
      { label: "c.", math: "16x^2 - 25 = 0" },
    ],
  }),
  Qn(38, "Pemfaktoran Soal Cerita – Volum – TKA", {
    type: "mixed",
    content: "Volume balok = panjang × lebar × tinggi = 60 cm³. Lebar = x, panjang = x + 1, tinggi = 4 cm.",
    parts: [
      { label: "a.", math: "4x(x+1) = 60 \\Rightarrow 4x^2 + 4x - 60 = 0" },
      { label: "b.", math: "x^2 + x - 15 = 0 \\text{ — faktorkan!}" },
      { label: "c.", text: "Tentukan nilai x dan dimensi balok." },
    ],
  }),
  Qn(39, "Pemfaktoran 6ax² + bx + c – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "6x^2 + 7x - 3 = 0" },
      { label: "b.", math: "10x^2 - 3x - 1 = 0" },
      { label: "c.", math: "12x^2 + 5x - 3 = 0" },
    ],
  }),
  Qn(40, "HOTS – Pemfaktoran Gabungan – UN/TKA", {
    type: "mixed",
    content: "Diketahui PK: 6x² − 5x − 6 = 0",
    parts: [
      { label: "a.", math: "\\text{Faktorkan: } 6x^2 - 5x - 6 = 0" },
      { label: "b.", text: "Tentukan akar-akar dan verifikasi dengan substitusi." },
      { label: "c.", math: "\\text{Hitung } x_1^2 + x_2^2 \\text{ dari akar-akar tersebut}" },
    ],
  }),
];

const PemfaktoranPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">✂️</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            PEMFAKTORAN PERSAMAAN KUADRAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Persamaan Kuadrat · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 40 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-3">📐 Konsep Penting</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Cari p dan q", math: "p \\cdot q = c,\\; p + q = b" },
              { name: "Faktor", math: "(x+p)(x+q) = 0" },
              { name: "Beda Kuadrat", math: "a^2 - b^2 = (a+b)(a-b)" },
              { name: "Kuadrat Sempurna", math: "(x+p)^2 = x^2+2px+p^2" },
            ].map(r => (
              <div key={r.name} className={isDark ? "bg-white/5 rounded-lg px-3 py-2" : "bg-gray-50 rounded-lg px-3 py-2"}>
                <div className={isDark ? "text-white/40 text-[9px] uppercase mb-1" : "text-gray-500 text-[9px] uppercase mb-1"}>{r.name}</div>
                <div className="text-emerald-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className={isDark ? "absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" : "absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white/80 to-teal-50/40 backdrop-blur"} />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className={isDark ? "font-body text-sm text-white/90 leading-relaxed mb-3" : "font-body text-sm text-gray-800 leading-relaxed mb-3"}>{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className={isDark ? "mb-3 flex justify-center bg-white/5 rounded-xl p-3" : "mb-3 flex justify-center bg-gray-50 rounded-xl p-3"}>{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={isDark ? "flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5" : "flex items-start gap-2 rounded-lg px-3 py-2 bg-gray-50"}>
                            <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
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
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Persamaan Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default PemfaktoranPage;
