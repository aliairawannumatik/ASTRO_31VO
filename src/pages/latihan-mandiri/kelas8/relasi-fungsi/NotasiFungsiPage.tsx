import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { FunctionSquare } from "lucide-react";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Notasi Fungsi – Pengenalan", {
    type: "mixed",
    content: "Fungsi f yang memetakan himpunan A ke himpunan B ditulis f: A → B. Jika f memetakan x ke y, ditulis f(x) = y atau f: x → y.",
    parts: [
      { label: "a.", text: "Apa arti notasi f: A → B?" },
      { label: "b.", math: "\\text{Jika } f(x) = 2x + 1,\\ \\text{apa yang dimaksud } f(3)?" },
      { label: "c.", math: "\\text{Tentukan } f(0),\\ f(1),\\ f(-1) \\text{ untuk } f(x) = 2x + 1" },
    ],
  }),
  Qn(2, "Menghitung Nilai Fungsi Linear", {
    type: "mixed",
    mathContent: "f(x) = 3x - 5",
    parts: [
      { label: "a.", math: "f(2) = 3(2) - 5 = \\ldots" },
      { label: "b.", math: "f(-3) = 3(-3) - 5 = \\ldots" },
      { label: "c.", math: "f(0) = \\ldots" },
      { label: "d.", math: "f\\left(\\frac{1}{3}\\right) = \\ldots" },
    ],
  }),
  Qn(3, "Menghitung Nilai Fungsi Kuadrat", {
    type: "mixed",
    mathContent: "g(x) = x^2 - 2x + 3",
    parts: [
      { label: "a.", math: "g(0) = \\ldots" },
      { label: "b.", math: "g(3) = \\ldots" },
      { label: "c.", math: "g(-2) = \\ldots" },
      { label: "d.", math: "g(1) = \\ldots" },
    ],
  }),
  Qn(4, "Menentukan Nilai k dari Fungsi", {
    type: "mixed",
    content: "Diketahui fungsi f(x) = ax + b. Tentukan nilai a dan b dari kondisi berikut:",
    parts: [
      { label: "a.", math: "f(1) = 5 \\text{ dan } f(3) = 11" },
      { label: "b.", math: "f(0) = 4 \\text{ dan } f(2) = 8" },
      { label: "c.", math: "f(-1) = 0 \\text{ dan } f(2) = 9" },
    ],
  }),
  Qn(5, "Rumus Fungsi dari Tabel Nilai", {
    type: "mixed",
    content: "Perhatikan tabel nilai berikut dan tentukan rumus fungsinya:",
    parts: [
      { label: "", math: "x: -1 \\to 0,\\ x: 0 \\to 3,\\ x: 1 \\to 6,\\ x: 2 \\to 9" },
      { label: "a.", math: "\\text{Pola: } y = \\ldots \\cdot x + \\ldots" },
      { label: "b.", math: "\\text{Verifikasi dengan } x = 3:\\ f(3) = \\ldots" },
      { label: "c.", text: "Tentukan domain dan range jika domain = {−1, 0, 1, 2, 3}." },
    ],
  }),
  Qn(6, "Fungsi f(x) = ax + b – Mencari a dan b", {
    type: "mixed",
    content: "Diketahui f: x → ax + b dengan f(2) = 7 dan f(5) = 13.",
    parts: [
      { label: "a.", text: "Buat sistem persamaan dari kondisi yang diberikan." },
      { label: "b.", text: "Selesaikan sistem persamaan untuk mendapatkan a dan b." },
      { label: "c.", math: "\\text{Tuliskan rumus lengkap fungsi } f(x) = \\ldots" },
    ],
  }),
  Qn(7, "Nilai Fungsi – Soal UN Klasik", {
    type: "mixed",
    content: "Diketahui f(x) = 4x + 3.",
    parts: [
      { label: "a.", math: "f(5) = \\ldots" },
      { label: "b.", math: "\\text{Jika } f(a) = 23,\\ \\text{tentukan } a" },
      { label: "c.", math: "f(2a - 1) = \\ldots \\text{ (nyatakan dalam } a\\text{)}" },
    ],
  }),
  Qn(8, "Notasi f: x ↦ ...", {
    type: "mixed",
    content: "Fungsi f dinyatakan dengan f: x ↦ 2x² − 3x + 1.",
    parts: [
      { label: "a.", math: "f(0) = \\ldots" },
      { label: "b.", math: "f(2) = \\ldots" },
      { label: "c.", math: "f(-1) = \\ldots" },
      { label: "d.", math: "\\text{Nilai x jika } f(x) = 0\\ (\\text{faktorkan})" },
    ],
  }),
  Qn(9, "Menentukan Rumus dari Dua Titik", {
    type: "mixed",
    content: "Diketahui fungsi linear f(x) = px + q.",
    parts: [
      { label: "a.", math: "\\text{Jika } f(1) = 2 \\text{ dan } f(4) = 11,\\ \\text{tentukan } p \\text{ dan } q" },
      { label: "b.", math: "\\text{Hitung } f(7)" },
      { label: "c.", math: "\\text{Temukan nilai } x \\text{ agar } f(x) = 20" },
    ],
  }),
  Qn(10, "Fungsi Pecahan Sederhana", {
    type: "mixed",
    content: "Diketahui fungsi f(x) = (2x + 6)/2.",
    parts: [
      { label: "a.", math: "\\text{Sederhanakan: } f(x) = \\ldots" },
      { label: "b.", math: "f(3) = \\ldots" },
      { label: "c.", math: "f(-4) = \\ldots" },
    ],
  }),
  Qn(11, "Substitusi ke Fungsi – ANBK Style", {
    type: "mixed",
    content: "Diketahui f(x) = 5x − 2 dan g(x) = x + 8.",
    parts: [
      { label: "a.", math: "f(3) + g(3) = \\ldots" },
      { label: "b.", math: "f(a) = g(a) \\Rightarrow a = \\ldots" },
      { label: "c.", math: "f(2) \\times g(1) = \\ldots" },
    ],
  }),
  Qn(12, "Nilai x dari Nilai Fungsi", {
    type: "mixed",
    content: "Diketahui f(x) = 3x + 9.",
    parts: [
      { label: "a.", math: "\\text{Jika } f(x) = 18,\\ x = \\ldots" },
      { label: "b.", math: "\\text{Jika } f(x) = 0,\\ x = \\ldots" },
      { label: "c.", math: "\\text{Jika } f(x) = -6,\\ x = \\ldots" },
    ],
  }),
  Qn(13, "Terapan Fungsi – Temperatur", {
    type: "mixed",
    content: "Konversi Celsius ke Fahrenheit: F(C) = (9/5)C + 32.",
    parts: [
      { label: "a.", math: "F(0) = \\ldots ^\\circ F" },
      { label: "b.", math: "F(100) = \\ldots ^\\circ F" },
      { label: "c.", math: "\\text{Jika } F(C) = 95,\\ C = \\ldots ^\\circ C" },
    ],
  }),
  Qn(14, "Fungsi dengan Parameter", {
    type: "mixed",
    content: "Fungsi f(x) = kx − 4. Diketahui f(3) = 11.",
    parts: [
      { label: "a.", math: "\\text{Tentukan nilai } k" },
      { label: "b.", math: "\\text{Hitung } f(6)" },
      { label: "c.", math: "\\text{Jika } f(x) = 31,\\ x = \\ldots" },
    ],
  }),
  Qn(15, "Fungsi Kuadrat – Nilai Khusus", {
    type: "mixed",
    mathContent: "h(x) = x^2 + 4x + 4",
    parts: [
      { label: "a.", math: "h(0) = \\ldots" },
      { label: "b.", math: "h(-2) = \\ldots" },
      { label: "c.", math: "h(-4) = \\ldots" },
      { label: "d.", math: "h(x) = (x + 2)^2 \\Rightarrow h(-2) = \\ldots \\text{ (verifikasi)}" },
    ],
  }),
  Qn(16, "Menentukan Rumus Fungsi dari Kondisi", {
    type: "mixed",
    content: "Diketahui fungsi f dengan f(x + 1) = 2x + 3.",
    parts: [
      { label: "a.", math: "\\text{Misalkan } u = x + 1 \\Rightarrow x = u - 1" },
      { label: "b.", math: "\\text{Substitusi: } f(u) = 2(u-1) + 3 = \\ldots" },
      { label: "c.", math: "\\text{Jadi } f(x) = \\ldots" },
    ],
  }),
  Qn(17, "Komposisi Sederhana – UN Style", {
    type: "mixed",
    content: "Diketahui f(x) = 2x + 1.",
    parts: [
      { label: "a.", math: "f(f(1)) = f(\\ldots) = \\ldots" },
      { label: "b.", math: "f(f(2)) = \\ldots" },
      { label: "c.", math: "f(f(x)) = 2(2x+1) + 1 = \\ldots" },
    ],
  }),
  Qn(18, "Fungsi dari Soal Cerita – TKA", {
    type: "mixed",
    content: "Upah seorang pekerja adalah f(h) = 25.000h + 50.000, di mana h adalah jam kerja per hari.",
    parts: [
      { label: "a.", math: "f(8) = \\ldots \\text{ (upah 8 jam)}" },
      { label: "b.", math: "\\text{Jika upah = Rp250.000,\\ berapa jam } h?" },
      { label: "c.", text: "Jelaskan arti 25.000 dan 50.000 dalam konteks soal." },
    ],
  }),
  Qn(19, "Menentukan Nilai Fungsi – Soal UN", {
    type: "mixed",
    content: "Diketahui f(x) = 2x − 6.",
    parts: [
      { label: "a.", math: "f(4) = \\ldots" },
      { label: "b.", math: "f\\left(\\frac{3}{2}\\right) = \\ldots" },
      { label: "c.", math: "\\text{Nilai } x \\text{ agar } f(x) = f(-x):\\ x = \\ldots" },
    ],
  }),
  Qn(20, "Fungsi Ganda – Dua Rumus", {
    type: "mixed",
    content: "Diketahui f(x) = 3x + k dan g(x) = mx − 2. Jika f(2) = g(2) = 10:",
    parts: [
      { label: "a.", math: "\\text{Dari } f(2) = 10:\\ 3(2) + k = 10 \\Rightarrow k = \\ldots" },
      { label: "b.", math: "\\text{Dari } g(2) = 10:\\ m(2) - 2 = 10 \\Rightarrow m = \\ldots" },
      { label: "c.", math: "f(5) + g(5) = \\ldots" },
    ],
  }),
  Qn(21, "Nilai Fungsi untuk x Pecahan", {
    type: "mixed",
    mathContent: "f(x) = 4x + 2",
    parts: [
      { label: "a.", math: "f\\left(\\frac{1}{2}\\right) = \\ldots" },
      { label: "b.", math: "f\\left(-\\frac{3}{4}\\right) = \\ldots" },
      { label: "c.", math: "f\\left(\\frac{5}{2}\\right) = \\ldots" },
    ],
  }),
  Qn(22, "Menulis Ulang Fungsi – ANBK", {
    type: "mixed",
    content: "Fungsi f dinyatakan dengan: f: x ↦ x² − 5x + 6.",
    parts: [
      { label: "a.", math: "f(2) = \\ldots" },
      { label: "b.", math: "f(3) = \\ldots" },
      { label: "c.", math: "f(x) = 0 \\Rightarrow x = \\ldots \\text{ atau } x = \\ldots \\text{ (faktorkan)}" },
    ],
  }),
  Qn(23, "Fungsi Linear – Mencari Input dari Output", {
    type: "mixed",
    content: "Diketahui f(x) = 7x − 3.",
    parts: [
      { label: "a.", math: "\\text{Jika } f(a) = 25,\\ a = \\ldots" },
      { label: "b.", math: "\\text{Jika } f(b) = -10,\\ b = \\ldots" },
      { label: "c.", math: "\\text{Jika } f(c) = f(3),\\ c = \\ldots" },
    ],
  }),
  Qn(24, "Fungsi dan Notasi – Soal Bervariasi", {
    type: "mixed",
    content: "Lengkapi tabel nilai untuk f(x) = −2x + 8:",
    parts: [
      { label: "", math: "x = -2,\\ -1,\\ 0,\\ 1,\\ 2,\\ 3,\\ 4" },
      { label: "a.", text: "Hitung f(x) untuk setiap nilai x di atas." },
      { label: "b.", text: "Tentukan nilai x di mana f(x) = 0 (titik nol fungsi)." },
      { label: "c.", text: "Apakah nilai fungsi selalu menurun? Mengapa?" },
    ],
  }),
  Qn(25, "Perbandingan Dua Fungsi", {
    type: "mixed",
    content: "Diketahui f(x) = 2x + 3 dan g(x) = x + 5.",
    parts: [
      { label: "a.", math: "\\text{Tentukan x agar } f(x) = g(x)" },
      { label: "b.", math: "\\text{Untuk } x > 1,\\ \\text{mana yang lebih besar, } f(x) \\text{ atau } g(x)?" },
      { label: "c.", math: "f(10) - g(10) = \\ldots" },
    ],
  }),
  Qn(26, "Rumus Fungsi – Soal UN", {
    type: "mixed",
    content: "Fungsi f didefinisikan f(2x − 1) = 4x + 5.",
    parts: [
      { label: "a.", math: "\\text{Misalkan } u = 2x - 1 \\Rightarrow x = \\frac{u+1}{2}" },
      { label: "b.", math: "f(u) = 4 \\cdot \\frac{u+1}{2} + 5 = \\ldots" },
      { label: "c.", math: "\\text{Jadi } f(x) = \\ldots,\\ \\text{hitung } f(3)" },
    ],
  }),
  Qn(27, "Fungsi Mutlak Sederhana", {
    type: "mixed",
    mathContent: "f(x) = |2x - 4|",
    parts: [
      { label: "a.", math: "f(2) = \\ldots" },
      { label: "b.", math: "f(0) = \\ldots" },
      { label: "c.", math: "f(-3) = \\ldots" },
      { label: "d.", math: "\\text{Nilai } x \\text{ agar } f(x) = 6:\\ x = \\ldots \\text{ atau } x = \\ldots" },
    ],
  }),
  Qn(28, "Terapan – Kecepatan dan Waktu", {
    type: "mixed",
    content: "Sebuah mobil menempuh jarak d(t) = 60t km dalam t jam.",
    parts: [
      { label: "a.", math: "d(3) = \\ldots \\text{ km}" },
      { label: "b.", math: "\\text{Waktu untuk menempuh 240 km: } t = \\ldots \\text{ jam}" },
      { label: "c.", text: "Apakah d merupakan fungsi dari t? Jelaskan." },
    ],
  }),
  Qn(29, "Fungsi Komposisi – Pengantar", {
    type: "mixed",
    content: "Diketahui f(x) = x + 2 dan g(x) = 3x.",
    parts: [
      { label: "a.", math: "f(g(1)) = f(3 \\cdot 1) = f(3) = \\ldots" },
      { label: "b.", math: "g(f(1)) = g(1 + 2) = g(3) = \\ldots" },
      { label: "c.", text: "Apakah f(g(x)) = g(f(x))? Cek untuk x = 2." },
    ],
  }),
  Qn(30, "Menentukan Rumus dari Titik-Titik", {
    type: "mixed",
    content: "Grafik fungsi linear f melewati titik (0, 5) dan (3, 11).",
    parts: [
      { label: "a.", math: "\\text{Gradien (kemiringan)}: m = \\frac{11-5}{3-0} = \\ldots" },
      { label: "b.", math: "\\text{Rumus fungsi: } f(x) = mx + c = \\ldots" },
      { label: "c.", math: "f(10) = \\ldots" },
    ],
  }),
  Qn(31, "Nilai Fungsi Berurutan – UN Style", {
    type: "mixed",
    mathContent: "f(x) = \\frac{1}{2}x + 3",
    parts: [
      { label: "a.", math: "f(4) = \\ldots" },
      { label: "b.", math: "f(10) = \\ldots" },
      { label: "c.", math: "f(-6) = \\ldots" },
      { label: "d.", math: "\\text{Nilai } x \\text{ agar } f(x) = 7:\\ x = \\ldots" },
    ],
  }),
  Qn(32, "Fungsi dan Pertidaksamaan – TKA Style", {
    type: "mixed",
    content: "Diketahui f(x) = 2x − 4.",
    parts: [
      { label: "a.", math: "\\text{Temukan semua } x \\in \\{1,2,3,4,5\\} \\text{ dengan } f(x) > 0" },
      { label: "b.", math: "\\text{Temukan } x \\text{ dengan } f(x) < f(3)" },
      { label: "c.", math: "\\text{Jika } f(x) = f(y),\\ \\text{apakah selalu } x = y? \\text{ Jelaskan.}" },
    ],
  }),
  Qn(33, "Fungsi – Soal Konteks", {
    type: "mixed",
    content: "Nilai ujian seorang siswa dirumuskan dengan N(x) = 10x − 2, di mana x adalah jumlah soal benar (dari 10 soal).",
    parts: [
      { label: "a.", math: "N(10) = \\ldots \\text{ (sempurna)}" },
      { label: "b.", math: "N(7) = \\ldots" },
      { label: "c.", math: "\\text{Jika } N(x) = 78,\\ x = \\ldots \\text{ soal benar}" },
    ],
  }),
  Qn(34, "Menentukan Nilai Fungsi – Soal ANBK", {
    type: "mixed",
    content: "Diketahui f(x) = 3x + 2. Tentukan:",
    parts: [
      { label: "a.", math: "f(2x) = 3(2x) + 2 = \\ldots" },
      { label: "b.", math: "f(x+1) = 3(x+1) + 2 = \\ldots" },
      { label: "c.", math: "f(x) + f(2) = \\ldots" },
    ],
  }),
  Qn(35, "Rumus Fungsi – Dua Kondisi", {
    type: "mixed",
    content: "Fungsi f(x) = ax + b memenuhi f(3) = 14 dan f(−1) = −2.",
    parts: [
      { label: "a.", text: "Buat dua persamaan dari kondisi yang diberikan." },
      { label: "b.", text: "Selesaikan sistem persamaan untuk a dan b." },
      { label: "c.", math: "\\text{Hitung } f(0) \\text{ dan } f(5)" },
    ],
  }),
  Qn(36, "Notasi dan Substitusi – Soal Campuran", {
    type: "mixed",
    content: "Diketahui f(x) = 2x + c. Jika f(4) = f(2) + 6, tentukan nilai c.",
    parts: [
      { label: "a.", math: "f(4) = 2(4) + c = 8 + c" },
      { label: "b.", math: "f(2) + 6 = (2(2) + c) + 6 = 10 + c" },
      { label: "c.", math: "8 + c = 10 + c \\Rightarrow \\text{apakah persamaan ini selalu benar?}" },
    ],
  }),
  Qn(37, "Nilai Fungsi – Hitung Cepat UN", {
    type: "mixed",
    content: "Diketahui f(x) = 6x − 4. Hitung:",
    parts: [
      { label: "a.", math: "f(3) = \\ldots" },
      { label: "b.", math: "f(-2) = \\ldots" },
      { label: "c.", math: "f(1) + f(2) + f(3) = \\ldots" },
      { label: "d.", math: "\\frac{f(6)}{f(2)} = \\ldots" },
    ],
  }),
  Qn(38, "Fungsi dari Soal UN Nasional", {
    type: "mixed",
    content: "Diketahui f(x) = 2x + p dan f(3) = 11.",
    parts: [
      { label: "a.", math: "\\text{Tentukan nilai } p" },
      { label: "b.", math: "\\text{Hitung } f(6)" },
      { label: "c.", math: "\\text{Jika } f(x) = 2f(1),\\ x = \\ldots" },
    ],
  }),
  Qn(39, "Ekspresi Fungsi – TKA Style", {
    type: "mixed",
    content: "Diketahui f(x) = 5 − 3x.",
    parts: [
      { label: "a.", math: "f(0) = \\ldots" },
      { label: "b.", math: "f(-2) = \\ldots" },
      { label: "c.", math: "\\text{Nilai } x \\text{ agar } f(x) = -7:\\ x = \\ldots" },
      { label: "d.", math: "f(a+1) = 5 - 3(a+1) = \\ldots" },
    ],
  }),
  Qn(40, "Soal UN – Notasi dan Rumus Fungsi", {
    type: "mixed",
    content: "Fungsi f dinyatakan dengan f: x ↦ 3x − 7 dengan domain {−1, 0, 1, 2, 3}.",
    parts: [
      { label: "a.", text: "Hitung nilai fungsi untuk setiap anggota domain." },
      { label: "b.", text: "Tentukan range fungsi f." },
      { label: "c.", math: "\\text{Nilai } x \\text{ agar } f(x) = 2:\\ x = \\ldots" },
      { label: "d.", text: "Apakah 2 termasuk range? Apakah x ada dalam domain?" },
    ],
  }),
];

const NotasiFungsiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <FunctionSquare className="w-7 h-7 text-sky-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            NOTASI DAN RUMUS FUNGSI
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Relasi dan Fungsi · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-2">📌 Notasi Fungsi</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sky-400 font-bold">Notasi: </span>
              <span className="text-white/60">f: A → B &nbsp;|&nbsp; f(x) = y &nbsp;|&nbsp; f: x ↦ ax + b</span>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sky-400 font-bold">Mencari nilai: </span>
              <span className="text-white/60">Substitusi nilai x ke rumus f(x)</span>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sky-400 font-bold">Mencari rumus: </span>
              <span className="text-white/60">Gunakan f(x) = ax + b dan dua kondisi yang diketahui</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.mathContent && (
                      <div className="mb-3 bg-sky-500/10 border border-sky-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotasiFungsiPage;
