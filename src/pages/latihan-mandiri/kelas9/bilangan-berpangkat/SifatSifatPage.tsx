import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n"|"title">): Q => ({ n, title, ...rest });

const RuleTableSVG = () => (
  <svg width="240" height="145" viewBox="0 0 240 145" className="mx-auto">
    <rect x="5" y="5" width="230" height="135" rx="8" fill="#10b981" fillOpacity="0.08" stroke="#34d399" strokeWidth="1.5"/>
    {[
      ["Perkalian", "aᵐ × aⁿ = aᵐ⁺ⁿ", 20],
      ["Pembagian", "aᵐ ÷ aⁿ = aᵐ⁻ⁿ", 50],
      ["Pemangkatan", "(aᵐ)ⁿ = aᵐⁿ", 80],
      ["Distribusi", "(ab)ⁿ = aⁿbⁿ", 110],
    ].map(([lbl, rule, y]: any[]) => (
      <g key={lbl}>
        <text x="18" y={y} fill="#6ee7b7" fontSize="9" fontWeight="bold">{lbl}</text>
        <text x="18" y={y+14} fill="#34d399" fontSize="11" fontFamily="monospace">{rule}</text>
      </g>
    ))}
  </svg>
);

const questions: Q[] = [
  Qn(1, "Sifat Perkalian Pangkat Basis Sama – Dasar", {
    type: "mixed", mathContent: "a^m \\times a^n = a^{m+n}",
    parts: [
      { label: "a.", math: "3^4 \\times 3^5 = 3^{\\square} = \\ldots" },
      { label: "b.", math: "2^7 \\times 2^3 = 2^{\\square} = \\ldots" },
      { label: "c.", math: "5^2 \\times 5^6 = \\ldots" },
    ],
  }),
  Qn(2, "Sifat Pembagian Pangkat Basis Sama – UN", {
    type: "mixed", mathContent: "a^m \\div a^n = a^{m-n}",
    parts: [
      { label: "a.", math: "7^9 \\div 7^4 = 7^{\\square} = \\ldots" },
      { label: "b.", math: "2^{10} \\div 2^6 = \\ldots" },
      { label: "c.", math: "5^8 \\div 5^5 = \\ldots" },
    ],
  }),
  Qn(3, "Sifat Pemangkatan – TKA", {
    type: "mixed", mathContent: "(a^m)^n = a^{m \\times n}",
    parts: [
      { label: "a.", math: "(2^3)^4 = 2^{\\square} = \\ldots" },
      { label: "b.", math: "(3^2)^5 = \\ldots" },
      { label: "c.", math: "(5^4)^2 = \\ldots" },
    ],
  }),
  Qn(4, "Sifat Distribusi Perkalian – UN", {
    type: "mixed", mathContent: "(ab)^n = a^n \\cdot b^n",
    parts: [
      { label: "a.", math: "(2 \\times 3)^4 = 2^4 \\times 3^4 = \\ldots" },
      { label: "b.", math: "(3 \\times 5)^2 = \\ldots" },
      { label: "c.", math: "(4 \\times 2)^3 = \\ldots" },
    ],
  }),
  Qn(5, "Sifat Distribusi Pembagian – ANBK", {
    type: "mixed", mathContent: "\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}",
    parts: [
      { label: "a.", math: "\\left(\\frac{3}{4}\\right)^2 = \\frac{3^2}{4^2} = \\ldots" },
      { label: "b.", math: "\\left(\\frac{2}{5}\\right)^3 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{6}{7}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(6, "Tabel Sifat-Sifat – Identifikasi", {
    type: "mixed", diagram: <RuleTableSVG />,
    content: "Cocokkan setiap operasi dengan sifat yang digunakan:",
    parts: [
      { label: "a.", math: "2^5 \\times 2^3 \\text{ menggunakan sifat \\ldots}" },
      { label: "b.", math: "(3^2)^4 \\text{ menggunakan sifat \\ldots}" },
      { label: "c.", math: "\\frac{7^8}{7^5} \\text{ menggunakan sifat \\ldots}" },
    ],
  }),
  Qn(7, "Menyederhanakan Ekspresi – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{2^8 \\times 2^3}{2^5} = \\ldots" },
      { label: "b.", math: "\\frac{3^6}{3^2 \\times 3} = \\ldots" },
      { label: "c.", math: "\\frac{5^{10}}{5^4 \\times 5^3} = \\ldots" },
    ],
  }),
  Qn(8, "Sifat Perkalian dengan Variabel – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "a^3 \\times a^7 = \\ldots" },
      { label: "b.", math: "x^4 \\times x^2 \\times x = \\ldots" },
      { label: "c.", math: "y^5 \\times y^5 = \\ldots" },
    ],
  }),
  Qn(9, "Sifat Pembagian dengan Variabel – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{a^9}{a^4} = \\ldots" },
      { label: "b.", math: "\\frac{x^{12}}{x^5 \\times x^3} = \\ldots" },
      { label: "c.", math: "\\frac{m^8 \\times m^3}{m^6} = \\ldots" },
    ],
  }),
  Qn(10, "Pemangkatan Ganda – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "((2^3)^2)^2 = 2^{\\square} = \\ldots" },
      { label: "b.", math: "((5^2)^3)^1 = \\ldots" },
      { label: "c.", math: "((a^2)^3)^4 = a^{\\square}" },
    ],
  }),
  Qn(11, "Campuran Sifat Perkalian & Pemangkatan – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(2^3)^2 \\times 2^4 = \\ldots" },
      { label: "b.", math: "(3^2)^3 \\times 3^2 = \\ldots" },
      { label: "c.", math: "(x^4)^3 \\times x^2 = x^{\\square}" },
    ],
  }),
  Qn(12, "Nilai Numerik Sifat – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2^3 \\times 4^2 = 2^3 \\times (2^2)^2 = 2^\\square = \\ldots" },
      { label: "b.", math: "9^3 = (3^2)^3 = 3^\\square = \\ldots" },
      { label: "c.", math: "8^4 = (2^3)^4 = \\ldots" },
    ],
  }),
  Qn(13, "Menentukan Pangkat – TKA", {
    type: "mixed",
    content: "Tentukan nilai n yang memenuhi:",
    parts: [
      { label: "a.", math: "2^n = 2^3 \\times 2^4 \\Rightarrow n = \\ldots" },
      { label: "b.", math: "3^n = \\frac{3^8}{3^3} \\Rightarrow n = \\ldots" },
      { label: "c.", math: "5^n = (5^3)^4 \\Rightarrow n = \\ldots" },
    ],
  }),
  Qn(14, "Penyederhanaan Ekspresi Aljabar – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{a^5 b^3}{a^2 b} = \\ldots" },
      { label: "b.", math: "\\frac{x^4 y^6}{x^2 y^3} = \\ldots" },
      { label: "c.", math: "\\frac{p^8 q^4}{p^3 q^4} = \\ldots" },
    ],
  }),
  Qn(15, "Soal UN – Sifat Distribusi Campuran", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(2a)^3 = \\ldots" },
      { label: "b.", math: "(3x)^4 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{2x}{3y}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(16, "Persamaan Eksponen Sederhana – UN", {
    type: "mixed",
    content: "Temukan nilai x:",
    parts: [
      { label: "a.", math: "2^x \\times 2^3 = 2^7 \\Rightarrow x = \\ldots" },
      { label: "b.", math: "\\frac{3^x}{3^2} = 3^5 \\Rightarrow x = \\ldots" },
      { label: "c.", math: "(4^x)^2 = 4^8 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(17, "Soal ANBK – Menyamakan Basis", {
    type: "mixed",
    content: "Sederhanakan dengan menyamakan basis terlebih dahulu:",
    parts: [
      { label: "a.", math: "4^3 \\times 2^5 = (2^2)^3 \\times 2^5 = 2^\\square = \\ldots" },
      { label: "b.", math: "9^2 \\times 3^3 = \\ldots" },
      { label: "c.", math: "8^2 \\div 4^3 = \\ldots" },
    ],
  }),
  Qn(18, "Soal TKA – Menyederhanakan Eksponen Besar", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{6^5}{6^2} = \\ldots" },
      { label: "b.", math: "\\frac{10^8}{10^3 \\times 10^2} = \\ldots" },
      { label: "c.", math: "\\frac{2^{15}}{4^5} = \\ldots" },
    ],
  }),
  Qn(19, "Soal UN – Ekspresi Variabel Gabungan", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(a^2 b^3)^4 = a^\\square b^\\square" },
      { label: "b.", math: "(x^3 y^2)^3 \\div (x^2 y)^3 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{a^3}{b^2}\\right)^3 = \\ldots" },
    ],
  }),
  Qn(20, "Soal ANBK – Pembuktian Sifat", {
    type: "mixed",
    content: "Buktikan dengan menghitung kedua sisi:",
    parts: [
      { label: "a.", math: "2^3 \\times 2^4 = 2^{3+4} \\text{ (hitung keduanya)}" },
      { label: "b.", math: "(3^2)^3 = 3^{2 \\times 3} \\text{ (hitung keduanya)}" },
      { label: "c.", math: "(2 \\times 5)^3 = 2^3 \\times 5^3 \\text{ (hitung keduanya)}" },
    ],
  }),
  Qn(21, "Soal UN – Nilai Numerik", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2^3 \\times 2^4 \\times 2^2 = \\ldots" },
      { label: "b.", math: "3^2 \\times 9^3 = 3^2 \\times 3^6 = \\ldots" },
      { label: "c.", math: "16^3 \\div 4^4 = \\ldots" },
    ],
  }),
  Qn(22, "Soal TKA – Perbandingan Ekspresi", {
    type: "mixed",
    content: "Manakah yang lebih besar?",
    parts: [
      { label: "a.", math: "2^{10} \\text{ atau } (2^5)^2 ?" },
      { label: "b.", math: "3^6 \\text{ atau } (3^2)^3?" },
      { label: "c.", math: "\\frac{5^8}{5^4} \\text{ atau } (5^2)^2?" },
    ],
  }),
  Qn(23, "Soal ANBK – Penyederhanaan Langkah Demi Langkah", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{(2^3)^4}{2^8} = \\ldots" },
      { label: "b.", math: "\\frac{(3^4)^2}{3^5 \\times 3^2} = \\ldots" },
      { label: "c.", math: "\\frac{(a^3)^4}{a^5 \\times a^3} = a^\\square" },
    ],
  }),
  Qn(24, "Soal UN – Ekspresi dengan Angka Nyata", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{32 \\times 8}{4} = \\frac{2^5 \\times 2^3}{2^2} = \\ldots" },
      { label: "b.", math: "\\frac{27 \\times 9}{3^4} = \\ldots" },
      { label: "c.", math: "\\frac{4^3 \\times 8^2}{2^{10}} = \\ldots" },
    ],
  }),
  Qn(25, "Soal TKA – Variabel dan Angka", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(2x^3)^4 = 2^4 \\times x^{12} = \\ldots" },
      { label: "b.", math: "(3a^2 b)^3 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{2x^2}{y^3}\\right)^3 = \\ldots" },
    ],
  }),
  Qn(26, "Soal UN – Eksponen Bilangan Negatif", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(-2)^3 \\times (-2)^5 = (-2)^\\square = \\ldots" },
      { label: "b.", math: "(-3)^4 \\div (-3)^2 = \\ldots" },
      { label: "c.", math: "((-2)^3)^2 = \\ldots" },
    ],
  }),
  Qn(27, "Soal ANBK – Menyederhanakan Ekspresi Rumit", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{2^4 \\times 3^4}{6^4} = \\frac{(2 \\times 3)^4}{6^4} = \\ldots" },
      { label: "b.", math: "\\frac{4^5}{2^5} = \\left(\\frac{4}{2}\\right)^5 = \\ldots" },
      { label: "c.", math: "\\frac{(xy)^4}{x^4} = \\ldots" },
    ],
  }),
  Qn(28, "Soal TKA – Penalaran Sifat", {
    type: "mixed",
    content: "Benar atau salah? Jelaskan mengapa:",
    parts: [
      { label: "a.", math: "2^3 + 2^3 = 2^6 \\text{ ?}" },
      { label: "b.", math: "2^3 \\times 2^3 = 2^6 \\text{ ?}" },
      { label: "c.", math: "(2+3)^2 = 2^2 + 3^2 \\text{ ?}" },
    ],
  }),
  Qn(29, "Soal UN – Sifat Eksponen pada Aljabar", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{(2a)^4}{4a^2} = \\ldots" },
      { label: "b.", math: "\\frac{(3x)^3}{9x} = \\ldots" },
      { label: "c.", math: "\\frac{(ab)^5}{a^3 b^2} = \\ldots" },
    ],
  }),
  Qn(30, "Soal ANBK – Menentukan n", {
    type: "mixed",
    content: "Tentukan nilai n:",
    parts: [
      { label: "a.", math: "5^n \\times 5^4 = 5^{10} \\Rightarrow n = \\ldots" },
      { label: "b.", math: "\\frac{7^n}{7^3} = 7^5 \\Rightarrow n = \\ldots" },
      { label: "c.", math: "(2^n)^3 = 2^{18} \\Rightarrow n = \\ldots" },
    ],
  }),
  Qn(31, "Soal TKA – Gabungan Sifat", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{(a^2)^5 \\times a^3}{a^{10}} = a^\\square" },
      { label: "b.", math: "\\frac{(x^3 y)^4}{x^8 y^3} = \\ldots" },
      { label: "c.", math: "\\frac{(2m^2)^3 \\times m^4}{4m^5} = \\ldots" },
    ],
  }),
  Qn(32, "Soal UN – Perpangkatan dengan Basis Komposit", {
    type: "mixed",
    parts: [
      { label: "a.", math: "36^3 = (6^2)^3 = 6^\\square = \\ldots" },
      { label: "b.", math: "64^4 = (2^6)^4 = 2^\\square" },
      { label: "c.", math: "100^5 = (10^2)^5 = 10^\\square = \\ldots" },
    ],
  }),
  Qn(33, "Soal ANBK – Sifat pada Konteks Fisika", {
    type: "mixed",
    content: "Energi kinetik: E = ½mv². Jika v berlipat ganda:",
    parts: [
      { label: "a.", math: "v_2 = 2v_1 \\Rightarrow v_2^2 = (2v_1)^2 = 2^2 \\cdot v_1^2 = \\ldots v_1^2" },
      { label: "b.", text: "Jika v berlipat 3 kali, berapa kali lipat energi kinetiknya?" },
      { label: "c.", math: "\\text{Jika } v = 10 \\text{ m/s, } v^2 = \\ldots" },
    ],
  }),
  Qn(34, "Soal UN – Identitas Pangkat", {
    type: "mixed",
    parts: [
      { label: "a.", math: "a^m \\cdot a^n \\cdot a^p = a^{\\square}" },
      { label: "b.", math: "\\frac{a^m \\cdot a^n}{a^p} = a^{\\square}" },
      { label: "c.", math: "\\left(\\frac{a^m}{a^n}\\right)^p = a^{\\square}" },
    ],
  }),
  Qn(35, "Soal TKA – Ekspresi Campuran Numerik", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2^3 \\times 4 \\times 8^2 = 2^3 \\times 2^2 \\times 2^6 = \\ldots" },
      { label: "b.", math: "3^4 \\times 27 \\div 9^2 = \\ldots" },
      { label: "c.", math: "5^3 \\times 25 \\div 125 = \\ldots" },
    ],
  }),
  Qn(36, "Soal ANBK – Sifat Pangkat Basis Sama Akar", {
    type: "mixed",
    content: "Sederhanakan dengan sifat-sifat eksponen:",
    parts: [
      { label: "a.", math: "\\frac{a^{10} \\cdot a^5}{a^{12}} = \\ldots" },
      { label: "b.", math: "(m^4)^2 \\cdot m^3 \\div m^5 = \\ldots" },
      { label: "c.", math: "\\frac{(p^2 q^3)^4}{p^5 q^8} = \\ldots" },
    ],
  }),
  Qn(37, "Soal UN – Eksponen dan Persamaan Linear", {
    type: "mixed",
    content: "Jika 2^(2x+1) = 2^7, tentukan x:",
    parts: [
      { label: "a.", math: "2x + 1 = 7 \\Rightarrow x = \\ldots" },
      { label: "b.", math: "3^{x+2} = 3^8 \\Rightarrow x = \\ldots" },
      { label: "c.", math: "5^{2x-1} = 5^9 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(38, "Soal TKA – Sifat Eksponen Tingkat Lanjut", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{(2^3 \\cdot 3^2)^2}{6^4} = \\ldots" },
      { label: "b.", math: "\\frac{(ab)^5}{a^3 b^4} \\cdot \\frac{a^2}{b} = \\ldots" },
      { label: "c.", math: "\\left(\\frac{x^3}{y^2}\\right)^4 \\cdot \\frac{y^{10}}{x^8} = \\ldots" },
    ],
  }),
  Qn(39, "Soal UN – Eksponen pada Masalah Nyata", {
    type: "mixed",
    content: "Luas persegi = s². Jika panjang sisi dilipat 3 kali:",
    parts: [
      { label: "a.", math: "s_{baru} = 3s \\Rightarrow L_{baru} = (3s)^2 = 9s^2" },
      { label: "b.", text: "Berapa kali luas persegi baru dibanding semula?" },
      { label: "c.", text: "Jika volumenya, berapa kali lipat jika rusuk kubus dilipat 3 kali?" },
    ],
  }),
  Qn(40, "Soal UN/ANBK/TKA – Gabungan Semua Sifat", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{(2^3)^4 \\times 2^2}{2^{10} \\times 2^2} = \\ldots" },
      { label: "b.", math: "\\frac{(3a^2)^3 \\times a^4}{9a^8} = \\ldots" },
      { label: "c.", math: "\\left(\\frac{2x^3 y}{4xy^2}\\right)^2 = \\ldots" },
      { label: "d.", math: "\\frac{(ab)^6}{a^4 b^3} \\cdot \\frac{a^2}{b^2} = \\ldots" },
    ],
  }),
];

const SifatSifatPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bilangan Berpangkat · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-3">📐 Sifat-Sifat Utama</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Perkalian", math: "a^m \\times a^n = a^{m+n}" },
              { name: "Pembagian", math: "a^m \\div a^n = a^{m-n}" },
              { name: "Pemangkatan", math: "(a^m)^n = a^{mn}" },
              { name: "Distribusi ×", math: "(ab)^n = a^n b^n" },
              { name: "Distribusi ÷", math: "\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}" },
              { name: "Pangkat Nol", math: "a^0 = 1 \\;(a \\ne 0)" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-emerald-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};
export default SifatSifatPage;
