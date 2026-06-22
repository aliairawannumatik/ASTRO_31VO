import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const BentukUmumSVG = () => (
  <svg width="280" height="100" viewBox="0 0 280 100" className="mx-auto">
    <rect x="10" y="10" width="260" height="80" rx="12" fill="#7c3aed" fillOpacity="0.12" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="140" y="42" fill="#a78bfa" fontSize="22" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ax² + bx + c = 0</text>
    <text x="60" y="70" fill="#c4b5fd" fontSize="10" textAnchor="middle">a ≠ 0</text>
    <text x="140" y="70" fill="#8b5cf6" fontSize="10" textAnchor="middle">a, b, c ∈ ℝ</text>
    <text x="220" y="70" fill="#c4b5fd" fontSize="10" textAnchor="middle">x = variabel</text>
  </svg>
);

const KoefisienSVG = () => (
  <svg width="280" height="110" viewBox="0 0 280 110" className="mx-auto">
    <rect x="10" y="10" width="260" height="90" rx="10" fill="#4c1d95" fillOpacity="0.2" stroke="#7c3aed" strokeWidth="1.5"/>
    <text x="140" y="45" fill="#c4b5fd" fontSize="20" fontFamily="monospace" fontWeight="bold" textAnchor="middle">2x² − 5x + 3 = 0</text>
    <line x1="55" y1="55" x2="55" y2="75" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="130" y1="55" x2="130" y2="75" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="205" y1="55" x2="205" y2="75" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="55" y="90" fill="#f59e0b" fontSize="11" textAnchor="middle">a = 2</text>
    <text x="130" y="90" fill="#34d399" fontSize="11" textAnchor="middle">b = −5</text>
    <text x="205" y="90" fill="#f472b6" fontSize="11" textAnchor="middle">c = 3</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian Persamaan Kuadrat – UN", {
    type: "mixed", diagram: <BentukUmumSVG />,
    parts: [
      { label: "a.", math: "\\text{Apakah } 3x^2 - 5x + 2 = 0 \\text{ merupakan persamaan kuadrat? Jelaskan!}" },
      { label: "b.", text: "Sebutkan syarat suatu persamaan disebut persamaan kuadrat." },
      { label: "c.", math: "\\text{Tentukan nilai } a, b, c \\text{ dari } 3x^2 - 5x + 2 = 0" },
    ],
  }),
  Qn(2, "Identifikasi Koefisien – ANBK", {
    type: "mixed", diagram: <KoefisienSVG />,
    content: "Tentukan nilai a, b, dan c dari persamaan kuadrat berikut:",
    parts: [
      { label: "a.", math: "5x^2 - 3x + 7 = 0 \\Rightarrow a = \\ldots, b = \\ldots, c = \\ldots" },
      { label: "b.", math: "-2x^2 + 4x - 1 = 0 \\Rightarrow a = \\ldots, b = \\ldots, c = \\ldots" },
      { label: "c.", math: "x^2 - 9 = 0 \\Rightarrow a = \\ldots, b = \\ldots, c = \\ldots" },
    ],
  }),
  Qn(3, "Mengubah ke Bentuk Umum – UN", {
    type: "mixed",
    content: "Ubah persamaan berikut ke bentuk umum ax² + bx + c = 0:",
    parts: [
      { label: "a.", math: "x^2 = 5x - 6" },
      { label: "b.", math: "3x(x - 4) = 2x - 1" },
      { label: "c.", math: "(2x + 1)(x - 3) = 4" },
    ],
  }),
  Qn(4, "Mana yang Persamaan Kuadrat? – TKA", {
    type: "mixed",
    content: "Tentukan mana yang merupakan persamaan kuadrat dan mana yang bukan. Jelaskan alasannya!",
    parts: [
      { label: "a.", math: "4x^2 - 7 = 0" },
      { label: "b.", math: "x^3 + 2x^2 - 1 = 0" },
      { label: "c.", math: "\\frac{1}{x} + x = 5" },
      { label: "d.", math: "0 \\cdot x^2 + 3x - 2 = 0" },
    ],
  }),
  Qn(5, "Identifikasi Persamaan Non-Standar – ANBK", {
    type: "mixed",
    content: "Ubah ke bentuk umum dan tentukan nilai a, b, c:",
    parts: [
      { label: "a.", math: "2(x+3)^2 = 8" },
      { label: "b.", math: "\\frac{x^2 - 1}{2} = x + 3" },
      { label: "c.", math: "(x-2)^2 = (x+1)^2 - 5" },
    ],
  }),
  Qn(6, "Persamaan Kuadrat Tidak Lengkap – UN", {
    type: "mixed",
    content: "Persamaan kuadrat tak lengkap terjadi jika b = 0 atau c = 0. Identifikasi:",
    parts: [
      { label: "a.", math: "x^2 - 16 = 0 \\text{ (jenis: ...??)}" },
      { label: "b.", math: "3x^2 - 6x = 0 \\text{ (jenis: ...??)}" },
      { label: "c.", math: "4x^2 = 0 \\text{ (jenis: ...??)}" },
    ],
  }),
  Qn(7, "Verifikasi Solusi – UN/TKA", {
    type: "mixed",
    content: "Verifikasi apakah nilai x yang diberikan merupakan akar dari persamaan kuadrat berikut:",
    parts: [
      { label: "a.", math: "x^2 - 5x + 6 = 0, \\; x = 2" },
      { label: "b.", math: "2x^2 + x - 3 = 0, \\; x = 1" },
      { label: "c.", math: "x^2 - 4 = 0, \\; x = -2" },
    ],
  }),
  Qn(8, "Mengubah Bentuk Persamaan – ANBK", {
    type: "mixed",
    content: "Ubah ke bentuk umum:",
    parts: [
      { label: "a.", math: "x(x-7) = -12" },
      { label: "b.", math: "(x+2)(x-5) = -4" },
      { label: "c.", math: "\\frac{x^2+1}{3} = x" },
    ],
  }),
  Qn(9, "Menentukan Koefisien – TKA", {
    type: "mixed",
    content: "Diketahui persamaan kuadrat px² + qx + r = 0.",
    parts: [
      { label: "a.", math: "\\text{Jika } p = 0 \\text{, apakah masih disebut persamaan kuadrat?}" },
      { label: "b.", math: "\\text{Apa syarat minimal agar } px^2 + qx + r = 0 \\text{ disebut PK?}" },
      { label: "c.", text: "Berikan contoh persamaan kuadrat di mana b = 0 dan c ≠ 0." },
    ],
  }),
  Qn(10, "Bentuk Khusus Persamaan Kuadrat – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\text{Nyatakan } (x-3)^2 = 0 \\text{ dalam bentuk umum}" },
      { label: "b.", math: "\\text{Nyatakan } x^2 - 25 = 0 \\text{ dan tentukan a, b, c}" },
      { label: "c.", math: "\\text{Nyatakan } 6x^2 = 0 \\text{ dan tentukan jenis PK ini}" },
    ],
  }),
  Qn(11, "Soal Cerita → Bentuk PK – UN", {
    type: "mixed",
    content: "Luas persegi panjang adalah 40 cm². Panjang lebih 3 cm dari lebarnya.",
    parts: [
      { label: "a.", text: "Misalkan lebar = x cm, tentukan persamaan kuadratnya." },
      { label: "b.", math: "\\text{Ubah ke bentuk } ax^2+bx+c=0 \\text{ dan tentukan a, b, c}" },
      { label: "c.", text: "Syarat apa yang harus dipenuhi nilai x agar bermakna kontekstual?" },
    ],
  }),
  Qn(12, "Mengidentifikasi dari Ekspresi Aljabar – ANBK", {
    type: "mixed",
    content: "Tentukan apakah setiap ekspresi berikut merupakan PK:",
    parts: [
      { label: "a.", math: "(x+1)^2 - (x-1)^2 = 0" },
      { label: "b.", math: "(x+2)(x+3) - (x+1)(x+4) = 0" },
      { label: "c.", math: "x^4 - 5x^2 + 4 = 0 \\text{ (dengan substitusi } u = x^2 \\text{)}" },
    ],
  }),
  Qn(13, "Persamaan Kuadrat dari Parameter – TKA", {
    type: "mixed",
    content: "Diketahui persamaan (k−2)x² + 3x − 5 = 0.",
    parts: [
      { label: "a.", text: "Untuk nilai k berapa persamaan ini menjadi persamaan kuadrat?" },
      { label: "b.", text: "Untuk nilai k berapa persamaan ini menjadi persamaan linear?" },
      { label: "c.", math: "\\text{Jika } k = 3 \\text{, tentukan nilai a, b, c}" },
    ],
  }),
  Qn(14, "Bentuk Umum dari Operasi – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\text{Sederhanakan: } (2x-1)^2 - (x+3)^2 = 0" },
      { label: "b.", math: "\\text{Sederhanakan: } (x+4)(x-4) + 2x = 12" },
      { label: "c.", math: "\\text{Sederhanakan: } 3x(x+2) - 2(x^2-1) = 0" },
    ],
  }),
  Qn(15, "Koefisien Pecahan – ANBK", {
    type: "mixed",
    content: "Ubah ke bentuk umum (kalikan semua suku agar koefisien bulat):",
    parts: [
      { label: "a.", math: "\\frac{1}{2}x^2 - \\frac{3}{4}x + 1 = 0" },
      { label: "b.", math: "\\frac{2}{3}x^2 + \\frac{1}{6}x - \\frac{1}{2} = 0" },
      { label: "c.", math: "0{,}5x^2 - 1{,}5x + 0{,}25 = 0" },
    ],
  }),
  Qn(16, "Soal UN – Menyebutkan Koefisien", {
    type: "mixed",
    content: "Perhatikan PK berikut, tentukan koefisien a, b, c dan derajatnya:",
    parts: [
      { label: "a.", math: "-x^2 + 6x - 9 = 0" },
      { label: "b.", math: "4x^2 - 12 = 0" },
      { label: "c.", math: "7x - x^2 = 0" },
    ],
  }),
  Qn(17, "Membentuk PK dari Deskripsi – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", text: "Buat PK dengan a = 2, b = −3, c = −5." },
      { label: "b.", text: "Buat PK yang memiliki koefisien x² sama dengan koefisien x." },
      { label: "c.", text: "Buat PK tidak lengkap (tanpa suku b) dengan akar x = ±4." },
    ],
  }),
  Qn(18, "Menyederhanakan ke Bentuk Umum – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2x^2 - 3 = x^2 + 4x - 1" },
      { label: "b.", math: "5x - x^2 = 2x^2 - 7" },
      { label: "c.", math: "3(x^2 - 2) = x(x+5)" },
    ],
  }),
  Qn(19, "Persamaan Kuadrat dari Gambar – ANBK", {
    type: "mixed",
    content: "Sebuah taman berbentuk persegi panjang dengan luas 48 m². Jika panjangnya (x + 4) m dan lebarnya (x − 2) m:",
    parts: [
      { label: "a.", text: "Nyatakan sebagai persamaan kuadrat dalam x." },
      { label: "b.", math: "\\text{Ubah ke bentuk umum } ax^2+bx+c=0" },
      { label: "c.", text: "Tentukan nilai a, b, c dari persamaan tersebut." },
    ],
  }),
  Qn(20, "Persamaan Kuadrat dengan Variabel Lain – TKA", {
    type: "mixed",
    content: "Tentukan nilai a, b, c jika variabelnya adalah t atau y:",
    parts: [
      { label: "a.", math: "3t^2 - 7t + 2 = 0" },
      { label: "b.", math: "-y^2 + 5y = 6 \\Rightarrow -y^2 + 5y - 6 = 0" },
      { label: "c.", math: "16t^2 = 4 \\Rightarrow 16t^2 - 4 = 0" },
    ],
  }),
  Qn(21, "Menentukan a, b, c dari Persamaan Bersarang – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x(x + 5) = 2(3x - 1)" },
      { label: "b.", math: "(x-4)^2 = 3x + 2" },
      { label: "c.", math: "\\frac{x^2-3}{4} = \\frac{x+1}{2}" },
    ],
  }),
  Qn(22, "Mencocokkan Persamaan dengan Nilai a,b,c – ANBK", {
    type: "mixed",
    content: "Pasangkan persamaan berikut dengan nilai (a,b,c) yang tepat:",
    parts: [
      { label: "a.", math: "x^2 + 7x - 8 = 0 \\rightarrow (a,b,c) = \\ldots" },
      { label: "b.", math: "3x^2 - 0x - 27 = 0 \\rightarrow (a,b,c) = \\ldots" },
      { label: "c.", math: "-5x^2 + 2x = 0 \\rightarrow (a,b,c) = \\ldots" },
    ],
  }),
  Qn(23, "Soal Cerita – Persamaan Kuadrat dari Jumlah – UN", {
    type: "mixed",
    content: "Jumlah dua bilangan positif adalah 14 dan hasil kalinya adalah 48.",
    parts: [
      { label: "a.", text: "Misalkan bilangan pertama = x, tuliskan persamaan kuadratnya." },
      { label: "b.", math: "\\text{Ubah ke bentuk } ax^2+bx+c=0" },
      { label: "c.", text: "Tentukan nilai a, b, c." },
    ],
  }),
  Qn(24, "Persamaan dari Lintasan Parabola – TKA", {
    type: "mixed",
    content: "Tinggi bola (m) dinyatakan dengan h(t) = −5t² + 20t + 2. Saat bola menyentuh tanah, h = 0.",
    parts: [
      { label: "a.", math: "\\text{Tuliskan persamaan kuadrat dalam } t" },
      { label: "b.", text: "Tentukan nilai a, b, c dari persamaan tersebut." },
      { label: "c.", text: "Mengapa nilai a negatif? Apa artinya secara geometris?" },
    ],
  }),
  Qn(25, "Identifikasi Derajat Persamaan – UN", {
    type: "mixed",
    content: "Tentukan derajat dan jenis persamaan berikut:",
    parts: [
      { label: "a.", math: "x^2 - \\sqrt{5}x + 1 = 0" },
      { label: "b.", math: "\\pi x^2 - 2\\pi x = 0" },
      { label: "c.", math: "e \\cdot x^2 - 3 = 0" },
    ],
  }),
  Qn(26, "Soal ANBK – Dari Ekspresi ke PK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\text{Ubah: } \\frac{3x+2}{x-1} = x + 3 \\text{ (} x \\neq 1\\text{)}" },
      { label: "b.", math: "\\text{Ubah: } \\frac{x^2-4}{x+2} = x - 3 \\text{ (} x \\neq -2\\text{)}" },
      { label: "c.", text: "Mengapa hasil penyederhanaan bisa menghasilkan PK?" },
    ],
  }),
  Qn(27, "Persamaan Kuadrat dengan Koefisien Negatif – UN", {
    type: "mixed",
    content: "Identifikasi dan ubah ke bentuk standar:",
    parts: [
      { label: "a.", math: "-(x^2 - 4x + 3) = 0" },
      { label: "b.", math: "-(2x^2 - 6x) = 5" },
      { label: "c.", math: "4 - x^2 = 0" },
    ],
  }),
  Qn(28, "Persamaan Kuadrat – Soal Kontekstual – TKA", {
    type: "mixed",
    content: "Sebuah tali dipotong menjadi dua bagian. Panjang satu bagian adalah x cm. Hasil kali kedua potongan = 150 cm².",
    parts: [
      { label: "a.", text: "Jika panjang tali total 25 cm, buat persamaan kuadratnya." },
      { label: "b.", math: "x(25-x) = 150 \\Rightarrow \\text{ bentuk umum?}" },
      { label: "c.", text: "Tentukan a, b, c." },
    ],
  }),
  Qn(29, "Beda Persamaan Kuadrat dan Linear – ANBK", {
    type: "mixed",
    content: "Jelaskan perbedaan antara:",
    parts: [
      { label: "a.", math: "2x^2 - 3 = 0 \\text{ vs } 2x - 3 = 0" },
      { label: "b.", text: "Berapa solusi maksimum yang dimiliki masing-masing?" },
      { label: "c.", math: "\\text{Jika } a = 0 \\text{ pada } ax^2+bx+c=0 \\text{, apa yang terjadi?}" },
    ],
  }),
  Qn(30, "Soal UN – Bentuk Setara", {
    type: "mixed",
    content: "Dua PK dikatakan setara jika memiliki himpunan penyelesaian sama. Tentukan apakah pasangan berikut setara:",
    parts: [
      { label: "a.", math: "x^2 - 4 = 0 \\text{ dan } (x-2)(x+2) = 0" },
      { label: "b.", math: "2x^2 - 8 = 0 \\text{ dan } x^2 - 4 = 0" },
      { label: "c.", math: "x^2 + 2x = 0 \\text{ dan } x(x+2) = 0" },
    ],
  }),
  Qn(31, "Nilai Koefisien Khusus – TKA", {
    type: "mixed",
    content: "Diketahui PK: (m+1)x² − 6x + 9 = 0",
    parts: [
      { label: "a.", text: "Agar persamaan ini berderajat dua, syarat apa yang harus dipenuhi m?" },
      { label: "b.", math: "\\text{Jika } m = 2 \\text{, tentukan a, b, c}" },
      { label: "c.", math: "\\text{Jika } m = -1 \\text{, apa jenis persamaannya?}" },
    ],
  }),
  Qn(32, "Soal Cerita – Segi Empat – UN", {
    type: "mixed",
    content: "Panjang sisi suatu segi empat beraturan adalah x cm. Jika diketahui luasnya adalah (x² + 3x) cm²:",
    parts: [
      { label: "a.", text: "Apakah ekspresi ini bisa membentuk PK? Bagaimana?" },
      { label: "b.", math: "\\text{Jika luas} = 40 \\text{ cm}^2, \\text{ bentuk PK-nya?}" },
      { label: "c.", text: "Tentukan a, b, c." },
    ],
  }),
  Qn(33, "HOTS – Persamaan Kuadrat dan Fungsi – ANBK", {
    type: "mixed",
    content: "Diketahui fungsi f(x) = ax² + bx + c. Grafik memotong sumbu-x di x = 2 dan x = −3, dan memotong sumbu-y di y = −12.",
    parts: [
      { label: "a.", text: "Tentukan nilai a, b, c." },
      { label: "b.", math: "\\text{Tulis persamaan kuadratnya dalam bentuk } ax^2+bx+c=0" },
      { label: "c.", text: "Verifikasi solusinya dengan substitusi." },
    ],
  }),
  Qn(34, "Persamaan Kuadrat dari Sistem – TKA", {
    type: "mixed",
    content: "Diketahui x + y = 7 dan xy = 10.",
    parts: [
      { label: "a.", math: "\\text{Nyatakan x sebagai } (7-y) \\text{ lalu substitusi}" },
      { label: "b.", math: "\\text{Bentuk PK dalam y: } y^2 - 7y + 10 = 0" },
      { label: "c.", text: "Tentukan nilai a, b, c dari PK tersebut." },
    ],
  }),
  Qn(35, "Soal UN – Persamaan Kuadrat Murni", {
    type: "mixed",
    content: "PK murni adalah PK dengan b = 0, yaitu ax² + c = 0.",
    parts: [
      { label: "a.", math: "x^2 - 36 = 0 \\Rightarrow a=?, c=?" },
      { label: "b.", math: "3x^2 - 75 = 0 \\Rightarrow \\text{ sederhanakan!}" },
      { label: "c.", math: "\\frac{x^2}{4} = 9 \\Rightarrow \\text{ bentuk umum}" },
    ],
  }),
  Qn(36, "Persamaan Kuadrat Linear – ANBK", {
    type: "mixed",
    content: "PK tak lengkap dengan c = 0 disebut PK linear-kuadrat.",
    parts: [
      { label: "a.", math: "5x^2 - 10x = 0 \\Rightarrow a=?, b=?" },
      { label: "b.", math: "x^2 = 7x \\Rightarrow \\text{ bentuk umum}" },
      { label: "c.", math: "-3x^2 + 15x = 0 \\Rightarrow a=?, b=?" },
    ],
  }),
  Qn(37, "Menyebutkan Derajat dan Jenis – UN", {
    type: "mixed",
    content: "Tentukan: apakah termasuk PK, dan jenis PK-nya (lengkap / tidak lengkap):",
    parts: [
      { label: "a.", math: "x^2 + x + 1 = 0" },
      { label: "b.", math: "x^2 - 4 = 0" },
      { label: "c.", math: "x^2 = 0" },
    ],
  }),
  Qn(38, "Nilai a, b, c Irasional – TKA", {
    type: "mixed",
    content: "Tentukan nilai a, b, c dari PK berikut:",
    parts: [
      { label: "a.", math: "\\sqrt{2}x^2 - 3x + \\sqrt{5} = 0" },
      { label: "b.", math: "\\pi x^2 + 2x - 1 = 0" },
      { label: "c.", math: "x^2 - \\sqrt{3}x + \\frac{1}{4} = 0" },
    ],
  }),
  Qn(39, "Soal ANBK – Persamaan dari Konteks Fisika", {
    type: "mixed",
    content: "Bola dilempar ke atas. Ketinggiannya h = −4,9t² + 14,7t + 1,5 meter. Saat bola jatuh ke tanah:",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan kuadrat saat } h = 0" },
      { label: "b.", text: "Tentukan a, b, c dari persamaan tersebut." },
      { label: "c.", text: "Mengapa a harus negatif dalam soal gerak parabola ke atas?" },
    ],
  }),
  Qn(40, "HOTS – Persamaan Kuadrat Parametrik – UN/TKA", {
    type: "mixed",
    content: "Diketahui persamaan (a−3)x² + (b+2)x + c = 0 adalah persamaan kuadrat.",
    parts: [
      { label: "a.", text: "Syarat apa yang harus dipenuhi oleh a?" },
      { label: "b.", math: "\\text{Jika } a = 5, b = -4, c = 7 \\text{, tulis persamaannya}" },
      { label: "c.", math: "\\text{Jika persamaan ini setara dengan } 2x^2 - 2x + 7 = 0 \\text{, cari } a \\text{ dan } b" },
    ],
  }),
];

const BentukUmumPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📋</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            BENTUK UMUM PERSAMAAN KUADRAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Persamaan Kuadrat · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-3">📐 Konsep Penting</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Bentuk Umum", math: "ax^2 + bx + c = 0,\\; a \\neq 0" },
              { name: "Koefisien a", math: "a = \\text{koefisien } x^2" },
              { name: "Koefisien b", math: "b = \\text{koefisien } x" },
              { name: "Konstanta c", math: "c = \\text{suku tetap}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-violet-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
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
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Persamaan Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default BentukUmumPage;
