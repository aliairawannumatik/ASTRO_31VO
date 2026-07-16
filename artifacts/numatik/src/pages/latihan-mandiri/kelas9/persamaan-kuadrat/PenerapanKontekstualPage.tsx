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

const PersegiBercelah = () => (
  <svg width="240" height="160" viewBox="0 0 240 160" className="mx-auto">
    <rect x="20" y="20" width="200" height="120" rx="4" fill="#134e4a" fillOpacity="0.2" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="6,3"/>
    <rect x="20" y="20" width="30" height="30" rx="3" fill="#0d9488" fillOpacity="0.4" stroke="#2dd4bf" strokeWidth="1"/>
    <rect x="190" y="20" width="30" height="30" rx="3" fill="#0d9488" fillOpacity="0.4" stroke="#2dd4bf" strokeWidth="1"/>
    <rect x="20" y="110" width="30" height="30" rx="3" fill="#0d9488" fillOpacity="0.4" stroke="#2dd4bf" strokeWidth="1"/>
    <rect x="190" y="110" width="30" height="30" rx="3" fill="#0d9488" fillOpacity="0.4" stroke="#2dd4bf" strokeWidth="1"/>
    <text x="35" y="42" fill="#5eead4" fontSize="9" textAnchor="middle">x</text>
    <text x="205" y="42" fill="#5eead4" fontSize="9" textAnchor="middle">x</text>
    <text x="35" y="130" fill="#5eead4" fontSize="9" textAnchor="middle">x</text>
    <text x="205" y="130" fill="#5eead4" fontSize="9" textAnchor="middle">x</text>
    <text x="120" y="78" fill="#99f6e4" fontSize="11" textAnchor="middle">panjang × lebar</text>
    <text x="120" y="98" fill="#5eead4" fontSize="11" textAnchor="middle">= Volume / tinggi</text>
    <text x="30" y="155" fill="#2dd4bf" fontSize="8" textAnchor="middle">p=20−2x</text>
    <text x="170" y="155" fill="#2dd4bf" fontSize="8" textAnchor="middle">l=12−2x</text>
  </svg>
);

const TrapesiumSVG = () => (
  <svg width="240" height="130" viewBox="0 0 240 130" className="mx-auto">
    <polygon points="60,20 180,20 210,110 30,110" fill="#134e4a" fillOpacity="0.2" stroke="#2dd4bf" strokeWidth="1.5"/>
    <text x="120" y="14" fill="#5eead4" fontSize="10" textAnchor="middle">sisi atas = a</text>
    <text x="120" y="120" fill="#5eead4" fontSize="10" textAnchor="middle">sisi bawah = b</text>
    <line x1="30" y1="110" x2="30" y2="20" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="4,2"/>
    <text x="15" y="70" fill="#99f6e4" fontSize="10" textAnchor="middle" transform="rotate(-90,15,70)">t</text>
    <text x="120" y="70" fill="#2dd4bf" fontSize="10" textAnchor="middle">Luas = ½(a+b)·t</text>
  </svg>
);

const LintasanParabolaSVG = () => (
  <svg width="260" height="140" viewBox="0 0 260 140" className="mx-auto">
    <line x1="10" y1="120" x2="250" y2="120" stroke="#0d9488" strokeWidth="1.5"/>
    <line x1="30" y1="130" x2="30" y2="10" stroke="#0d9488" strokeWidth="1.5"/>
    <polygon points="250,116 258,120 250,124" fill="#0d9488"/>
    <polygon points="26,10 30,2 34,10" fill="#0d9488"/>
    <path d="M 30,120 Q 130,10 230,100" fill="none" stroke="#2dd4bf" strokeWidth="2.5"/>
    <circle cx="30" cy="120" r="4" fill="#fbbf24"/>
    <circle cx="230" cy="100" r="3" fill="#f87171" opacity="0.5"/>
    <circle cx="130" cy="15" r="4" fill="#4ade80"/>
    <text x="130" y="8" fill="#4ade80" fontSize="9" textAnchor="middle">Puncak (max)</text>
    <text x="260" y="124" fill="#5eead4" fontSize="9">t</text>
    <text x="35" y="8" fill="#5eead4" fontSize="9">h</text>
    <text x="15" y="124" fill="#fbbf24" fontSize="9">t₀</text>
    <text x="228" y="114" fill="#f87171" fontSize="9">t₁</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Soal Geometri – Persegi Panjang – UN", {
    type: "mixed",
    content: "Luas sebuah persegi panjang adalah 60 cm². Panjangnya 4 cm lebih dari lebarnya.",
    parts: [
      { label: "a.", text: "Misalkan lebar = x cm. Buat persamaan kuadratnya." },
      { label: "b.", math: "x(x+4) = 60 \\Rightarrow x^2 + 4x - 60 = 0" },
      { label: "c.", text: "Tentukan panjang dan lebar persegi panjang tersebut." },
    ],
  }),
  Qn(2, "Soal Geometri – Luas Segitiga – UN", {
    type: "mixed",
    content: "Alas segitiga 3 cm lebih panjang dari tingginya. Luas segitiga = 27 cm².",
    parts: [
      { label: "a.", math: "\\frac{1}{2} \\cdot (t+3) \\cdot t = 27" },
      { label: "b.", math: "t^2 + 3t - 54 = 0" },
      { label: "c.", text: "Tentukan alas dan tinggi segitiga." },
    ],
  }),
  Qn(3, "Kotak Tanpa Tutup – ANBK", {
    type: "mixed", diagram: <PersegiBercelah />,
    content: "Dari karton 20 × 12 cm, sudut-sudutnya dipotong persegi sisi x cm, lalu dilipat menjadi kotak terbuka. Volume kotak = 224 cm³.",
    parts: [
      { label: "a.", math: "V = x(20-2x)(12-2x) = 224" },
      { label: "b.", math: "4x^3 - 64x^2 + 240x - 224 = 0 \\Rightarrow x^3 - 16x^2 + 60x - 56 = 0" },
      { label: "c.", math: "\\text{Coba } x = 2: 8 - 64 + 120 - 56 = 8 \\neq 0. \\text{ Coba } x = 1: 1-16+60-56 = \\ldots" },
    ],
  }),
  Qn(4, "Soal Cerita – Dua Bilangan – UN", {
    type: "mixed",
    content: "Jumlah dua bilangan positif adalah 16. Jumlah kuadrat keduanya adalah 130.",
    parts: [
      { label: "a.", text: "Misalkan bilangan pertama = x dan bilangan kedua = 16 − x." },
      { label: "b.", math: "x^2 + (16-x)^2 = 130 \\Rightarrow 2x^2 - 32x + 126 = 0" },
      { label: "c.", math: "x^2 - 16x + 63 = 0 \\Rightarrow (x-9)(x-7) = 0 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(5, "Soal Gerak Jatuh Bebas – ANBK", {
    type: "mixed", diagram: <LintasanParabolaSVG />,
    content: "Bola dijatuhkan dari ketinggian 80 m. Ketinggiannya: h = 80 − 5t².",
    parts: [
      { label: "a.", math: "\\text{Saat } h = 0: 80 - 5t^2 = 0 \\Rightarrow t^2 = \\ldots" },
      { label: "b.", math: "t = \\sqrt{16} = \\ldots \\text{ detik}" },
      { label: "c.", math: "\\text{Kapan bola berada di ketinggian } h = 45 \\text{ m?}" },
    ],
  }),
  Qn(6, "Soal Kecepatan dan Waktu – UN", {
    type: "mixed",
    content: "Sebuah mobil menempuh jarak 240 km. Jika kecepatannya dikurangi 20 km/jam, waktu tempuh bertambah 1 jam.",
    parts: [
      { label: "a.", math: "\\frac{240}{v-20} - \\frac{240}{v} = 1" },
      { label: "b.", math: "240v - 240(v-20) = v(v-20)" },
      { label: "c.", math: "v^2 - 20v - 4800 = 0 \\Rightarrow v = \\ldots" },
    ],
  }),
  Qn(7, "Soal Trapesium – TKA", {
    type: "mixed", diagram: <TrapesiumSVG />,
    content: "Trapesium memiliki sisi sejajar (x + 2) dan (2x − 1) dengan tinggi x. Luasnya = 27 cm².",
    parts: [
      { label: "a.", math: "\\frac{1}{2}[(x+2)+(2x-1)] \\cdot x = 27" },
      { label: "b.", math: "\\frac{1}{2}(3x+1)x = 27 \\Rightarrow 3x^2 + x - 54 = 0" },
      { label: "c.", math: "x = \\frac{-1 \\pm \\sqrt{1+648}}{6} = \\ldots" },
    ],
  }),
  Qn(8, "Soal Usia – UN", {
    type: "mixed",
    content: "Usia Ayah 3 kali usia Anak. Lima tahun lagi, hasil kali usia keduanya = 448.",
    parts: [
      { label: "a.", math: "\\text{Sekarang: Anak} = x, \\text{Ayah} = 3x" },
      { label: "b.", math: "(x+5)(3x+5) = 448" },
      { label: "c.", math: "3x^2 + 20x - 423 = 0 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(9, "Soal Lemparan Bola – ANBK", {
    type: "mixed",
    content: "Bola dilempar ke atas dari lantai dengan persamaan ketinggian h = −4t² + 12t + 1 meter.",
    parts: [
      { label: "a.", math: "\\text{Tinggi maks: } t = -\\frac{b}{2a} = -\\frac{12}{-8} = \\ldots \\text{ detik}" },
      { label: "b.", math: "h_{max} = -4\\left(\\frac{3}{2}\\right)^2 + 12\\left(\\frac{3}{2}\\right) + 1 = \\ldots \\text{ m}" },
      { label: "c.", math: "\\text{Saat } h = 0: 4t^2 - 12t - 1 = 0 \\Rightarrow t = \\ldots" },
    ],
  }),
  Qn(10, "Soal Perdagangan – UN", {
    type: "mixed",
    content: "Seorang pedagang membeli x buah jeruk dengan harga total Rp120.000. Karena ada 10 jeruk yang busuk, x − 10 jeruk sisanya dijual dengan harga Rp1.000 lebih mahal per buah, menghasilkan keuntungan Rp8.000.",
    parts: [
      { label: "a.", math: "\\text{Harga beli/buah} = \\frac{120000}{x}" },
      { label: "b.", math: "(x-10) \\cdot \\left(\\frac{120000}{x} + 1000\\right) = 128000" },
      { label: "c.", math: "x^2 - 8x - 1200 = 0 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(11, "Soal Kebun – TKA", {
    type: "mixed",
    content: "Kebun berbentuk persegi dengan sisi x m. Ditambah jalur selebar 2 m di sekelilingnya. Luas total = 256 m².",
    parts: [
      { label: "a.", math: "(x+4)^2 = 256" },
      { label: "b.", math: "x+4 = 16 \\Rightarrow x = 12 \\text{ m}" },
      { label: "c.", text: "Berapa luas kebun aslinya?" },
    ],
  }),
  Qn(12, "Soal Pekerjaan Bersama – UN", {
    type: "mixed",
    content: "A dapat menyelesaikan pekerjaan dalam x hari. B butuh (x − 3) hari. Bersama-sama selesai dalam 2 hari.",
    parts: [
      { label: "a.", math: "\\frac{1}{x} + \\frac{1}{x-3} = \\frac{1}{2}" },
      { label: "b.", math: "2(x-3) + 2x = x(x-3)" },
      { label: "c.", math: "x^2 - 7x + 6 = 0 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(13, "Soal Fisika – Gerak Lurus – ANBK", {
    type: "mixed",
    content: "Sebuah mobil bergerak dengan jarak s = 3t² − 6t meter setelah t detik.",
    parts: [
      { label: "a.", math: "\\text{Saat } s = 45: 3t^2 - 6t - 45 = 0 \\Rightarrow t^2 - 2t - 15 = 0" },
      { label: "b.", math: "(t-5)(t+3) = 0 \\Rightarrow t = \\ldots" },
      { label: "c.", math: "\\text{Kecepatan saat } t = 5 \\text{? (v = ds/dt = 6t-6)}" },
    ],
  }),
  Qn(14, "Soal Pipa Air – TKA", {
    type: "mixed",
    content: "Dua pipa mengisi kolam. Pipa besar x jam lebih cepat dari pipa kecil. Bersama-sama: 6 jam. Sendiri-sendiri: 5 jam (besar) dan (x+5) jam (kecil).",
    parts: [
      { label: "a.", math: "\\frac{1}{5} + \\frac{1}{x+5} = \\frac{1}{6}" },
      { label: "b.", math: "6(x+5) + 30 = 5(x+5)" },
      { label: "c.", text: "Selesaikan dan periksa kelayakan jawaban." },
    ],
  }),
  Qn(15, "Soal Segi Tiga Siku-siku – UN", {
    type: "mixed",
    content: "Sisi miring segitiga siku-siku 5 cm lebih panjang dari salah satu kakinya. Kaki lainnya 7 cm.",
    parts: [
      { label: "a.", math: "\\text{Misal kaki pertama} = x, \\text{hipotenusa} = x+5" },
      { label: "b.", math: "x^2 + 7^2 = (x+5)^2" },
      { label: "c.", math: "x^2 + 49 = x^2 + 10x + 25 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(16, "Soal Populasi – ANBK", {
    type: "mixed",
    content: "Jumlah penduduk desa (ribu jiwa) setelah t tahun: P(t) = t² + 3t + 5.",
    parts: [
      { label: "a.", math: "\\text{Kapan P(t) = 19? Buat PK!}" },
      { label: "b.", math: "t^2 + 3t + 5 = 19 \\Rightarrow t^2 + 3t - 14 = 0" },
      { label: "c.", math: "t = \\frac{-3 \\pm \\sqrt{9+56}}{2} = \\ldots" },
    ],
  }),
  Qn(17, "Soal Perahu dan Arus – UN", {
    type: "mixed",
    content: "Perahu bergerak 20 km melawan arus dan 20 km searah arus dalam total 3 jam. Kecepatan arus 2 km/jam.",
    parts: [
      { label: "a.", math: "\\frac{20}{v-2} + \\frac{20}{v+2} = 3 \\quad (v = \\text{kec. perahu di air tenang})" },
      { label: "b.", math: "20(v+2) + 20(v-2) = 3(v^2-4)" },
      { label: "c.", math: "3v^2 - 40v - 12 = 0 \\Rightarrow v = \\ldots" },
    ],
  }),
  Qn(18, "Soal Kebun Memanjang – TKA", {
    type: "mixed",
    content: "Kebun berbentuk persegi panjang. Panjangnya 2 kali lebarnya dikurangi 3 m. Luas = 44 m².",
    parts: [
      { label: "a.", math: "\\text{Lebar} = x, \\text{panjang} = 2x-3" },
      { label: "b.", math: "x(2x-3) = 44 \\Rightarrow 2x^2 - 3x - 44 = 0" },
      { label: "c.", math: "x = \\frac{3 \\pm \\sqrt{9+352}}{4} = \\ldots" },
    ],
  }),
  Qn(19, "Soal Tabungan Bunga – ANBK", {
    type: "mixed",
    content: "Modal awal Rp10.000 ditabung selama 2 tahun dengan bunga majemuk r% per tahun. Hasilnya Rp12.960.",
    parts: [
      { label: "a.", math: "10000(1+r)^2 = 12960" },
      { label: "b.", math: "(1+r)^2 = 1{,}296 \\Rightarrow 1+r = \\sqrt{1{,}296}" },
      { label: "c.", math: "r = \\sqrt{1{,}296} - 1 = 1{,}14 - 1 = 0{,}14 = \\ldots\\%" },
    ],
  }),
  Qn(20, "Soal Lintasan Bola – UN", {
    type: "mixed",
    content: "Bola ditendang dan lintasannya: h = −x² + 6x (x = jarak horizontal, h = ketinggian, dalam meter).",
    parts: [
      { label: "a.", math: "\\text{Tinggi maks: } x = -\\frac{6}{-2} = 3 \\text{ m}, h_{max} = \\ldots" },
      { label: "b.", math: "\\text{Saat } h = 0: x(6-x) = 0 \\Rightarrow x = 0 \\text{ atau } x = \\ldots" },
      { label: "c.", text: "Berapa jarak horizontal total yang ditempuh bola?" },
    ],
  }),
  Qn(21, "Soal Persegi dan Persegi Panjang – TKA", {
    type: "mixed",
    content: "Luas persegi panjang 3 cm² lebih besar dari persegi bersisi x cm. Panjang persegi panjang (x + 2) cm.",
    parts: [
      { label: "a.", math: "l(x+2) - x^2 = 3" },
      { label: "b.", text: "Jika lebar = (x − 1), tentukan persamaan dan nilai x." },
      { label: "c.", math: "(x-1)(x+2) - x^2 = 3 \\Rightarrow x - 2 = 3 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(22, "Soal Pitagoras – UN", {
    type: "mixed",
    content: "Tiga sisi segitiga siku-siku adalah x, x + 7, dan x + 8 cm (x + 8 adalah hipotenusa).",
    parts: [
      { label: "a.", math: "x^2 + (x+7)^2 = (x+8)^2" },
      { label: "b.", math: "x^2 + x^2 + 14x + 49 = x^2 + 16x + 64" },
      { label: "c.", math: "x^2 - 2x - 15 = 0 \\Rightarrow (x-5)(x+3) = 0 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(23, "Soal Produksi – ANBK", {
    type: "mixed",
    content: "Keuntungan produksi x unit: K(x) = −2x² + 40x − 50 ribu rupiah.",
    parts: [
      { label: "a.", math: "\\text{Kapan K = 0? (titik impas)}" },
      { label: "b.", math: "2x^2 - 40x + 50 = 0 \\Rightarrow x^2 - 20x + 25 = 0" },
      { label: "c.", math: "x = \\frac{20 \\pm \\sqrt{400-100}}{2} = \\ldots" },
    ],
  }),
  Qn(24, "Soal Lahan dan Jalan – TKA", {
    type: "mixed",
    content: "Lahan 24 × 18 m dibangun jalan setebar x m di sekeliling dalamnya. Luas lahan tersisa = 255 m².",
    parts: [
      { label: "a.", math: "(24-2x)(18-2x) = 255" },
      { label: "b.", math: "432 - 84x + 4x^2 = 255" },
      { label: "c.", math: "4x^2 - 84x + 177 = 0 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(25, "Soal Harga dan Permintaan – UN", {
    type: "mixed",
    content: "Permintaan produk D(p) = 100 − p dan biaya total C(p) = p². Untung = D × p − C.",
    parts: [
      { label: "a.", math: "K(p) = p(100-p) - p^2 = 100p - 2p^2" },
      { label: "b.", math: "\\text{Untung maks saat: } \\frac{dK}{dp} = 100 - 4p = 0 \\Rightarrow p = \\ldots" },
      { label: "c.", math: "\\text{Saat } K = 0: 100p - 2p^2 = 0 \\Rightarrow p(100-2p) = 0 \\Rightarrow p = \\ldots" },
    ],
  }),
  Qn(26, "Soal Lingkaran dan Persegi – ANBK", {
    type: "mixed",
    content: "Lingkaran berada di dalam persegi sehingga menyentuh keempat sisinya. Jika jumlah luas keduanya = 500 cm²:",
    parts: [
      { label: "a.", math: "\\text{Persegi sisi } 2r, \\text{ lingkaran jari-jari } r" },
      { label: "b.", math: "4r^2 + \\pi r^2 = 500" },
      { label: "c.", math: "r^2(4+\\pi) = 500 \\Rightarrow r = \\sqrt{\\frac{500}{4+\\pi}} \\approx \\ldots" },
    ],
  }),
  Qn(27, "Soal Pembagian – TKA", {
    type: "mixed",
    content: "Sebuah bilangan jika dikurangi 3 dan dikali hasilnya dengan bilangan aslinya sama dengan 108.",
    parts: [
      { label: "a.", math: "n(n-3) = 108" },
      { label: "b.", math: "n^2 - 3n - 108 = 0" },
      { label: "c.", math: "(n-12)(n+9) = 0 \\Rightarrow n = \\ldots" },
    ],
  }),
  Qn(28, "Soal Kolam Renang – UN", {
    type: "mixed",
    content: "Kolam renang berbentuk persegi panjang panjang (x + 5) m dan lebar x m dikelilingi trotoar selebar 1 m. Luas trotoar = 36 m².",
    parts: [
      { label: "a.", math: "(x+7)(x+2) - x(x+5) = 36" },
      { label: "b.", math: "x^2+9x+14 - x^2-5x = 36" },
      { label: "c.", math: "4x + 14 = 36 \\Rightarrow x = \\ldots \\text{ (cek: ini linear, bukan kuadrat — artinya soal ini mengajarkan waspada!)" },
    ],
  }),
  Qn(29, "Soal Kecepatan Rata-Rata – ANBK", {
    type: "mixed",
    content: "Sebuah sepeda menempuh 36 km pergi dan 36 km pulang. Pulang, kecepatannya 3 km/jam lebih lambat. Total waktu 5 jam.",
    parts: [
      { label: "a.", math: "\\frac{36}{v} + \\frac{36}{v-3} = 5" },
      { label: "b.", math: "36(v-3) + 36v = 5v(v-3)" },
      { label: "c.", math: "5v^2 - 87v + 108 = 0 \\Rightarrow v = \\ldots" },
    ],
  }),
  Qn(30, "Soal Pengaspalan Jalan – TKA", {
    type: "mixed",
    content: "Taman berbentuk persegi berukuran 50 × 50 m. Dibuat jalan dari utara ke selatan dan dari timur ke barat dengan lebar sama x m. Luas jalan = 336 m².",
    parts: [
      { label: "a.", math: "50x + 50x - x^2 = 336" },
      { label: "b.", math: "x^2 - 100x + 336 = 0" },
      { label: "c.", math: "x = \\frac{100 \\pm \\sqrt{10000 - 1344}}{2} = \\ldots" },
    ],
  }),
  Qn(31, "Soal Aritmatika – Suku Tengah – UN", {
    type: "mixed",
    content: "Tiga suku pertama barisan aritmatika adalah x², 8, dan (14 − x²).",
    parts: [
      { label: "a.", math: "8 - x^2 = (14-x^2) - 8 \\Rightarrow 8-x^2 = 6-x^2" },
      { label: "b.", text: "Apakah persamaan itu konsisten? Jelaskan." },
      { label: "c.", math: "\\text{Coba: ketiga suku } = x^2, (x^2+3), (x^2+6) \\text{ dan suku ke-2} = 8 \\Rightarrow x^2 = 5" },
    ],
  }),
  Qn(32, "Soal Pengeluaran Siswa – ANBK", {
    type: "mixed",
    content: "Sekelompok siswa masing-masing urunan Rp20.000 untuk biaya studi tur total Rp2.400.000. Ternyata 4 siswa tidak bisa ikut, sehingga masing-masing menambah Rp10.000.",
    parts: [
      { label: "a.", math: "\\frac{2400000}{x-4} = \\frac{2400000}{x} + 10000" },
      { label: "b.", math: "x^2 - 4x - 960 = 0" },
      { label: "c.", math: "x = \\frac{4 \\pm \\sqrt{16+3840}}{2} = \\ldots" },
    ],
  }),
  Qn(33, "Soal Kerangka Kawat – TKA", {
    type: "mixed",
    content: "Kawat sepanjang 40 m dibentuk menjadi persegi panjang. Jika diagonalnya 4√(13) m, tentukan dimensinya.",
    parts: [
      { label: "a.", math: "2(p+l) = 40 \\Rightarrow p+l = 20" },
      { label: "b.", math: "p^2 + l^2 = (4\\sqrt{13})^2 = 208" },
      { label: "c.", math: "(p+l)^2 - 2pl = 208 \\Rightarrow 400 - 2pl = 208 \\Rightarrow pl = 96" },
    ],
  }),
  Qn(34, "Soal Lingkaran – UN", {
    type: "mixed",
    content: "Sebuah gelang annular (ring) memiliki jari-jari luar R dan dalam r = R − 3 cm. Luasnya = 33π cm².",
    parts: [
      { label: "a.", math: "\\pi R^2 - \\pi(R-3)^2 = 33\\pi" },
      { label: "b.", math: "R^2 - (R-3)^2 = 33" },
      { label: "c.", math: "6R - 9 = 33 \\Rightarrow R = 7 \\text{ cm}" },
    ],
  }),
  Qn(35, "Soal Investasi – ANBK", {
    type: "mixed",
    content: "Investasi sebesar Rp50.000 dua kali lipat menjadi Rp72.000 dalam 2 tahun dengan suku bunga r per tahun.",
    parts: [
      { label: "a.", math: "50000(1+r)^2 = 72000" },
      { label: "b.", math: "(1+r)^2 = \\frac{72}{50} = 1{,}44" },
      { label: "c.", math: "1+r = 1{,}2 \\Rightarrow r = 0{,}2 = 20\\%" },
    ],
  }),
  Qn(36, "Soal Bola dan Gravitasi – TKA", {
    type: "mixed",
    content: "Benda dilempar ke atas dari ketinggian 1 m dengan kecepatan awal 14 m/s. Tinggi: h = 1 + 14t − 5t².",
    parts: [
      { label: "a.", math: "\\text{Tinggi maks saat } t = \\frac{14}{10} = 1{,}4 \\text{ s, } h = \\ldots" },
      { label: "b.", math: "\\text{Kapan bola mencapai h = 10 m?}" },
      { label: "c.", math: "5t^2 - 14t + 9 = 0 \\Rightarrow t = \\ldots" },
    ],
  }),
  Qn(37, "Soal Biaya Minimum – UN", {
    type: "mixed",
    content: "Biaya produksi mesin: C(x) = x² − 10x + 30 juta rupiah (x = jumlah mesin).",
    parts: [
      { label: "a.", math: "C(x) = (x-5)^2 + 5 \\text{ (pelengkap kuadrat)}" },
      { label: "b.", text: "Biaya minimum terjadi saat x berapa?" },
      { label: "c.", math: "C_{min} = \\ldots \\text{ juta rupiah}" },
    ],
  }),
  Qn(38, "Soal Jarak Pandang – ANBK", {
    type: "mixed",
    content: "Jarak pandang (km) dari ketinggian h meter dinyatakan dengan d = √(12,74h). Jika jarak pandang = 30 km:",
    parts: [
      { label: "a.", math: "\\sqrt{12{,}74h} = 30" },
      { label: "b.", math: "12{,}74h = 900 \\Rightarrow h \\approx \\ldots \\text{ m}" },
      { label: "c.", text: "Ubah menjadi persamaan kuadrat dan selesaikan dengan metode yang tepat." },
    ],
  }),
  Qn(39, "Soal Diagonal Segi Empat – TKA", {
    type: "mixed",
    content: "Persegi panjang (x+3) × (x−2) cm. Diagonalnya 13 cm.",
    parts: [
      { label: "a.", math: "(x+3)^2 + (x-2)^2 = 169" },
      { label: "b.", math: "x^2+6x+9 + x^2-4x+4 = 169" },
      { label: "c.", math: "2x^2 + 2x - 156 = 0 \\Rightarrow x^2 + x - 78 = 0 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(40, "HOTS – Persamaan Kuadrat Gabungan – UN/TKA/ANBK", {
    type: "mixed",
    content: "Seorang peternak membeli x ekor ayam dan y ekor bebek. Harga ayam Rp15.000/ekor dan bebek Rp20.000/ekor. Total 40 ekor, total harga Rp700.000.",
    parts: [
      { label: "a.", math: "x + y = 40 \\text{ dan } 15000x + 20000y = 700000" },
      { label: "b.", math: "15x + 20(40-x) = 700 \\Rightarrow -5x = -100 \\Rightarrow x = 20" },
      { label: "c.", text: "Susun persamaan kuadrat jika diketahui hasil kali jumlah ayam dan bebek = 300, lalu selesaikan." },
    ],
  }),
];

const PenerapanKontekstualPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-teal-500/20 border-2 border-teal-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🌍</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-teal-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(45,212,191,0.7)' }}>
            PENERAPAN PERSAMAAN KUADRAT KONTEKSTUAL
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Persamaan Kuadrat · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 rounded-lg px-4 py-2">
            <span className="text-teal-400 text-xs font-bold">📋 40 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-teal-900/20 border border-teal-500/20 rounded-xl p-4">
          <p className="text-teal-300 text-xs font-bold mb-3">📐 Strategi Soal Kontekstual</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Langkah 1", math: "\\text{Misalkan variabel } x" },
              { name: "Langkah 2", math: "\\text{Terjemahkan ke PK}" },
              { name: "Langkah 3", math: "\\text{Selesaikan PK}" },
              { name: "Langkah 4", math: "\\text{Periksa konteks!}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-teal-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-slate-900/80 to-cyan-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-teal-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-400 to-cyan-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/50 flex items-center justify-center shrink-0">
                    <span className="text-teal-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-teal-400 text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-teal-900/20 border border-teal-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-teal-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Persamaan Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default PenerapanKontekstualPage;
