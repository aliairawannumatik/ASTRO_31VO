import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { RefreshCw } from "lucide-react";
import GSLDiagram from "./GSLDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  difficulty?: "Mudah" | "Sedang" | "Sulit";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Pengertian Sabuk Lilitan", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="belt-equal" size={230} />,
    content: "Sabuk lilitan adalah sabuk atau tali yang melingkari dua atau lebih silinder/lingkaran. Panjang sabuk terdiri dari bagian lurus dan bagian busur.",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan 'sabuk lilitan' dalam konteks matematika?" },
      { label: "b.", text: "Sebutkan dua bagian yang membentuk panjang sabuk lilitan." },
      { label: "c.", text: "Berikan tiga contoh sabuk lilitan dalam kehidupan nyata." },
    ],
  }),
  Qn(2, "Sabuk Lilitan Dua Lingkaran Sama Besar", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="belt-equal" size={230} />,
    mathContent: "L_{sabuk} = 2d + 2\\pi r",
    parts: [
      { label: "a.", text: "Jelaskan arti setiap suku dalam rumus L_sabuk = 2d + 2πr." },
      { label: "b.", math: "d = \\text{GSPL} = \\sqrt{p^2 - (r - r)^2} = p \\text{ (jika sama besar)}" },
      { label: "c.", math: "\\text{Jika } r = 7, p = 20: L = 2(20) + 2\\pi(7) = 40 + 14\\pi \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(3, "Sabuk Luar – Dua Lingkaran Sama Besar", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="belt-equal" size={230} values={{ r: 45 }} />,
    content: "Dua lingkaran berjari-jari 10 cm. Jarak antar pusat = 26 cm.",
    parts: [
      { label: "a.", math: "d = \\sqrt{26^2 - (10-10)^2} = 26 \\text{ cm (bagian lurus)}" },
      { label: "b.", math: "L_{busur} = 2\\pi r = 2\\pi \\times 10 = 20\\pi \\text{ cm (setengah lingkaran masing-masing)}" },
      { label: "c.", math: "L_{sabuk} = 2 \\times 26 + 20\\pi = 52 + 20\\pi \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(4, "Sabuk Luar – Dua Lingkaran Berbeda Besar", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="belt-unequal" size={230} />,
    mathContent: "L_{sabuk} = 2 \\times d_{GSPL} + \\pi(R + r) + 2(R - r)\\arcsin\\!\\left(\\frac{R-r}{p}\\right)",
    parts: [
      { label: "a.", text: "Untuk pendekatan, jika sudut kecil, gunakan: L ≈ 2 × GSPL + π(R + r)." },
      { label: "b.", math: "\\text{Jika } R = 8, r = 4, p = 20:\\ d_{GSPL} = \\sqrt{20^2 - 4^2} = \\sqrt{384}" },
      { label: "c.", math: "L \\approx 2\\sqrt{384} + \\pi(8+4) = 2\\sqrt{384} + 12\\pi \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(5, "Sabuk Lilitan – Dua Lingkaran Sama, Soal UN", {
    difficulty: "Mudah",
    content: "Dua silinder berjari-jari 7 cm diikat dengan pita. Jarak antar pusat = 30 cm.",
    parts: [
      { label: "a.", math: "d = 30 \\text{ cm (bagian lurus, karena R = r)}" },
      { label: "b.", math: "L_{busur} = 2\\pi r = 2 \\times \\frac{22}{7} \\times 7 = 44 \\text{ cm}" },
      { label: "c.", math: "L_{sabuk} = 2 \\times 30 + 44 = 60 + 44 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(6, "Sabuk Lilitan – Tiga Lingkaran Sama Besar", {
    difficulty: "Sedang",
    content: "Tiga silinder berjari-jari 7 cm, masing-masing bersinggungan dengan yang lain, diikat sabuk. Jarak antar pusat = 2r = 14 cm.",
    parts: [
      { label: "a.", text: "Berapa panjang bagian lurus sabuk? Ada berapa bagian lurus?" },
      { label: "b.", math: "\\text{Bagian lurus}: 3 \\times d = 3 \\times 14 = 42 \\text{ cm}" },
      { label: "c.", math: "\\text{Busur total} = 2\\pi r = 2\\pi \\times 7 = 14\\pi \\approx 44 \\text{ cm}" },
    ],
  }),
  Qn(7, "Sabuk Lilitan – Soal Cerita (Kaleng)", {
    difficulty: "Mudah",
    content: "Tiga kaleng susu berjari-jari 3 cm diikat jadi satu. Tata letak: tiga lingkaran sama besar bersinggungan dua-dua.",
    parts: [
      { label: "a.", math: "\\text{Jarak antar pusat} = 2r = 6 \\text{ cm}" },
      { label: "b.", math: "\\text{Panjang lurus} = 3 \\times 6 = 18 \\text{ cm}" },
      { label: "c.", math: "\\text{Total sabuk} = 18 + 2\\pi \\times 3 = 18 + 6\\pi \\approx 18 + 18{,}85 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(8, "Sabuk Lilitan – Panjang Minimum", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="belt-equal" size={230} values={{ r: 40 }} />,
    content: "Dua silinder berjari-jari 14 cm. Jarak antar pusat = 50 cm. Hitung panjang sabuk minimum.",
    parts: [
      { label: "a.", math: "d = 50 \\text{ cm}" },
      { label: "b.", math: "L_{busur} = 2\\pi r = 2 \\times \\frac{22}{7} \\times 14 = 88 \\text{ cm}" },
      { label: "c.", math: "L_{min} = 2 \\times 50 + 88 = 100 + 88 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(9, "Sabuk Lilitan – Soal Cerita (Ban)", {
    difficulty: "Mudah",
    content: "Dua ban berjari-jari 21 cm dihubungkan rantai. Jarak pusat = 60 cm. Hitung panjang rantai minimum (π = 22/7).",
    parts: [
      { label: "a.", math: "\\text{Bagian lurus} = 2 \\times 60 = 120 \\text{ cm}" },
      { label: "b.", math: "\\text{Busur total} = 2\\pi r = 2 \\times \\frac{22}{7} \\times 21 = 132 \\text{ cm}" },
      { label: "c.", math: "L_{total} = 120 + 132 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(10, "Sabuk Luar – Dua Lingkaran Beda Jari-Jari", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="belt-unequal" size={230} values={{ r1: 50, r2: 30 }} />,
    content: "Dua silinder berjari-jari R = 10 cm dan r = 6 cm. Jarak pusat p = 20 cm.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{20^2 - (10-6)^2} = \\sqrt{400-16} = \\sqrt{384} = 8\\sqrt{6}" },
      { label: "b.", math: "L_{lurus} = 2 \\times 8\\sqrt{6} = 16\\sqrt{6} \\approx 39{,}2 \\text{ cm}" },
      { label: "c.", math: "L_{approx} \\approx 16\\sqrt{6} + \\pi(10+6) \\approx 39{,}2 + 50{,}3 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(11, "Sabuk Lilitan – Hitung Bagian Busur", {
    difficulty: "Sedang",
    content: "Dua roda berjari-jari sama 14 cm. Jarak pusat 30 cm. Hitung panjang busur yang dilalui sabuk.",
    parts: [
      { label: "a.", text: "Pada dua lingkaran sama besar, sabuk menyentuh setengah lingkaran di masing-masing sisi." },
      { label: "b.", math: "\\text{Busur tiap roda} = \\pi r = \\frac{22}{7} \\times 14 = 44 \\text{ cm}" },
      { label: "c.", math: "\\text{Total busur} = 2 \\times 44 = 88 \\text{ cm}" },
    ],
  }),
  Qn(12, "Sabuk Lilitan – Soal UN Style", {
    difficulty: "Mudah",
    content: "Dua drum minyak berjari-jari 28 cm diikat pita. Jarak antar pusat = 80 cm. Hitung panjang pita (π = 22/7).",
    parts: [
      { label: "a.", math: "\\text{Bagian lurus} = 2 \\times 80 = 160 \\text{ cm}" },
      { label: "b.", math: "\\text{Busur} = 2\\pi r = 2 \\times \\frac{22}{7} \\times 28 = 176 \\text{ cm}" },
      { label: "c.", math: "L_{total} = 160 + 176 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(13, "Sabuk Lilitan – Tiga Silinder Berjejer", {
    difficulty: "Sedang",
    content: "Tiga silinder berjari-jari 7 cm berjejer (tidak segitiga). Jarak pusat berturutan = 14 cm.",
    parts: [
      { label: "a.", math: "\\text{Bagian lurus} = 2 \\times 14 + 14 = 3 \\times 14 = 42 \\text{ (sisi atas dan bawah)}" },
      { label: "b.", text: "Perhatikan: ada 2 busur setengah lingkaran di kiri dan kanan, dan 2 busur di tengah yang tidak ada." },
      { label: "c.", math: "L_{total} = 42 \\times 2 + 2\\pi \\times 7 = 84 + 14\\pi \\approx 84 + 44 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(14, "Sabuk Lilitan – Soal Cerita (Logistik)", {
    difficulty: "Sedang",
    content: "Empat drum berjari-jari 21 cm disusun bujursangkar (2×2). Jarak pusat = 42 cm. Sabuk melingkari semuanya.",
    parts: [
      { label: "a.", math: "\\text{Bagian lurus} = 4 \\times 42 = 168 \\text{ cm}" },
      { label: "b.", math: "\\text{Busur total} = 2\\pi r = 2 \\times \\frac{22}{7} \\times 21 = 132 \\text{ cm}" },
      { label: "c.", math: "L_{total} = 168 + 132 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(15, "Sabuk Lilitan – Mencari Jarak Pusat", {
    difficulty: "Sedang",
    content: "Panjang sabuk dua silinder sama besar (r = 7) adalah 100 cm. Hitung jarak antar pusat (π = 22/7).",
    parts: [
      { label: "a.", math: "L = 2d + 2\\pi r \\Rightarrow 100 = 2d + 2 \\times \\frac{22}{7} \\times 7 = 2d + 44" },
      { label: "b.", math: "2d = 100 - 44 = 56 \\Rightarrow d = 28 \\text{ cm}" },
      { label: "c.", text: "Berapa jarak antar tepi luar kedua silinder (bukan pusat ke pusat)?" },
    ],
  }),
  Qn(16, "Sabuk Lilitan – Mencari Jari-Jari", {
    difficulty: "Sedang",
    content: "Panjang sabuk dua silinder sama besar adalah 120 cm. Jarak pusat = 25 cm (π = 22/7).",
    parts: [
      { label: "a.", math: "120 = 2(25) + 2\\pi r = 50 + 2\\pi r" },
      { label: "b.", math: "2\\pi r = 70 \\Rightarrow r = \\frac{70}{2\\pi} = \\frac{35}{\\pi} = \\frac{35 \\times 7}{22} = \\frac{245}{22} = 11{,}14 \\text{ cm}" },
      { label: "c.", text: "Dibulatkan menjadi r ≈ ... cm." },
    ],
  }),
  Qn(17, "Sabuk Lilitan – Dua Puli Mesin", {
    difficulty: "Sedang",
    content: "Dua puli mesin berjari-jari 15 cm dan 5 cm. Jarak pusat = 25 cm. Sabuk luar.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{25^2 - (15-5)^2} = \\sqrt{625 - 100} = \\sqrt{525} = 5\\sqrt{21}" },
      { label: "b.", math: "\\text{Panjang lurus} = 2 \\times 5\\sqrt{21} = 10\\sqrt{21} \\approx 45{,}8 \\text{ cm}" },
      { label: "c.", math: "\\text{Perkiraan total sabuk} \\approx 10\\sqrt{21} + \\pi(15+5) \\approx 45{,}8 + 62{,}8 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(18, "Sabuk Lilitan – Soal TKA", {
    difficulty: "Sulit",
    content: "Dua lingkaran berjari-jari sama r = 6 cm. Sabuk melingkari keduanya tanpa menyilang. Tentukan panjang sabuk jika p = 10 cm.",
    parts: [
      { label: "a.", math: "L_{lurus} = 2p = 2 \\times 10 = 20 \\text{ cm}" },
      { label: "b.", math: "L_{busur} = 2\\pi r = 12\\pi \\text{ cm}" },
      { label: "c.", math: "L_{total} = 20 + 12\\pi \\approx 20 + 37{,}7 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(19, "Sabuk Lilitan – Mesin Pabrik", {
    difficulty: "Mudah",
    content: "Mesin pabrik menggunakan sabuk yang melingkari dua roda berjari-jari 35 cm masing-masing. Jarak pusat = 1 m = 100 cm. Hitung panjang sabuk (π = 22/7).",
    parts: [
      { label: "a.", math: "L_{lurus} = 2 \\times 100 = 200 \\text{ cm}" },
      { label: "b.", math: "L_{busur} = 2 \\times \\frac{22}{7} \\times 35 = 220 \\text{ cm}" },
      { label: "c.", math: "L_{total} = 200 + 220 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(20, "Sabuk Lilitan – Panjang Total Dalam Meter", {
    difficulty: "Mudah",
    content: "Dua roda dengan r = 42 cm. Jarak pusat = 140 cm. Hitung panjang sabuk dalam meter (π = 22/7).",
    parts: [
      { label: "a.", math: "L_{lurus} = 2 \\times 140 = 280 \\text{ cm}" },
      { label: "b.", math: "L_{busur} = 2 \\times \\frac{22}{7} \\times 42 = 264 \\text{ cm}" },
      { label: "c.", math: "L_{total} = 280 + 264 = 544 \\text{ cm} = \\ldots \\text{ m}" },
    ],
  }),
  Qn(21, "Sabuk Lilitan – Konversi Satuan", {
    difficulty: "Mudah",
    content: "Panjang sabuk = 2(p) + 2πr. Diketahui r = 7 dm dan p = 24 dm.",
    parts: [
      { label: "a.", math: "L = 2(24) + 2\\pi(7) = 48 + 14\\pi" },
      { label: "b.", math: "L \\approx 48 + 14 \\times 3{,}14 = 48 + 43{,}96 = \\ldots \\text{ dm}" },
      { label: "c.", text: "Konversi ke cm: L = ... cm." },
    ],
  }),
  Qn(22, "Sabuk Lilitan – Perbandingan", {
    difficulty: "Sedang",
    content: "Dua konfigurasi sabuk:\n① r = 7, p = 20\n② r = 14, p = 20",
    parts: [
      { label: "a.", math: "L_1 = 2(20) + 2\\pi(7) = 40 + 14\\pi" },
      { label: "b.", math: "L_2 = 2(20) + 2\\pi(14) = 40 + 28\\pi" },
      { label: "c.", math: "L_2 - L_1 = 14\\pi \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(23, "Sabuk Lilitan – Soal UN Cerita", {
    difficulty: "Mudah",
    content: "Pak Ahmad memiliki dua pipa berjari-jari 21 cm yang hendak diikat pita. Jarak pusat antar pipa = 70 cm. Berapa panjang pita minimum yang dibutuhkan? (π = 22/7)",
    parts: [
      { label: "a.", math: "L_{lurus} = 2 \\times 70 = 140 \\text{ cm}" },
      { label: "b.", math: "L_{busur} = 2\\pi r = 2 \\times \\frac{22}{7} \\times 21 = 132 \\text{ cm}" },
      { label: "c.", math: "L_{min} = 140 + 132 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(24, "Sabuk Lilitan – Tiga Roda Segitiga", {
    difficulty: "Sedang",
    content: "Tiga roda berjari-jari 7 cm, bersinggungan berpasangan. Sabuk melingkari ketiganya membentuk sisi segitiga sama sisi.",
    parts: [
      { label: "a.", math: "\\text{Jarak pusat-ke-pusat} = 2r = 14 \\text{ cm}" },
      { label: "b.", math: "\\text{Bagian lurus} = 3 \\times 14 = 42 \\text{ cm}" },
      { label: "c.", math: "\\text{Busur total} = \\frac{360^\\circ - 3 \\times 60^\\circ}{360^\\circ} \\times 2\\pi r \\times 3 = \\frac{180^\\circ}{360^\\circ} \\times 6\\pi r = 3\\pi r = 21\\pi \\approx \\ldots" },
    ],
  }),
  Qn(25, "Sabuk Lilitan – Menentukan Jumlah Pita", {
    difficulty: "Sedang",
    content: "Sebuah toko dijual pita dengan harga Rp500/cm. Pita digunakan untuk mengikat 2 silinder r = 21 cm, jarak pusat = 80 cm.",
    parts: [
      { label: "a.", math: "L_{sabuk} = 2(80) + 2\\pi(21) = 160 + 42\\pi \\approx 160 + 132 = 292 \\text{ cm}" },
      { label: "b.", text: "Berapa biaya pembelian pita?" },
      { label: "c.", text: "Jika pita dijual per rol 3 meter, berapa rol yang harus dibeli?" },
    ],
  }),
  Qn(26, "Sabuk Lilitan – Soal Pecahan", {
    difficulty: "Sedang",
    content: "Dua silinder r = 3,5 cm. Jarak pusat = 15 cm. Hitung panjang sabuk (π = 22/7).",
    parts: [
      { label: "a.", math: "L_{lurus} = 2 \\times 15 = 30 \\text{ cm}" },
      { label: "b.", math: "L_{busur} = 2 \\times \\frac{22}{7} \\times 3{,}5 = 22 \\text{ cm}" },
      { label: "c.", math: "L_{total} = 30 + 22 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(27, "Sabuk Lilitan – Soal ANBK", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 10 cm dihubungkan sabuk. Jika panjang sabuk = 100 cm, hitung jarak antar pusat (π = 3,14).",
    parts: [
      { label: "a.", math: "100 = 2d + 2\\pi(10) = 2d + 62{,}8" },
      { label: "b.", math: "2d = 100 - 62{,}8 = 37{,}2 \\Rightarrow d = 18{,}6 \\text{ cm}" },
      { label: "c.", text: "Berapa jarak tepi luar lingkaran pertama ke tepi luar lingkaran kedua?" },
    ],
  }),
  Qn(28, "Sabuk Lilitan – Soal Cerita Kilang", {
    difficulty: "Mudah",
    content: "Di kilang minyak, dua tangki silinder berjari-jari 7 m ditempatkan bersebelahan. Jarak pusat = 20 m. Kawat pengaman melingkari kedua tangki. Hitung panjang kawat (π = 22/7).",
    parts: [
      { label: "a.", math: "L_{lurus} = 2 \\times 20 = 40 \\text{ m}" },
      { label: "b.", math: "L_{busur} = 2 \\times \\frac{22}{7} \\times 7 = 44 \\text{ m}" },
      { label: "c.", math: "L_{total} = 40 + 44 = \\ldots \\text{ m}" },
    ],
  }),
  Qn(29, "Sabuk Lilitan – Dua Roda Beda Besar", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="belt-unequal" size={230} values={{ r1: 50, r2: 25 }} />,
    content: "Dua roda berjari-jari R = 15 cm dan r = 5 cm. Jarak pusat = 20 cm. Sabuk luar.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{20^2 - (15-5)^2} = \\sqrt{400-100} = \\sqrt{300} = 10\\sqrt{3}" },
      { label: "b.", math: "L_{approx} \\approx 2 \\times 10\\sqrt{3} + \\pi(15+5) = 20\\sqrt{3} + 20\\pi" },
      { label: "c.", math: "L \\approx 20 \\times 1{,}732 + 20 \\times 3{,}14 = 34{,}64 + 62{,}8 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(30, "Sabuk Lilitan – Perbandingan Tiga Konfigurasi", {
    difficulty: "Sedang",
    content: "Hitung panjang sabuk untuk r = 7, π = 22/7 dengan jarak pusat yang berbeda:",
    parts: [
      { label: "a.", math: "p = 20 \\Rightarrow L = 2(20) + 2\\pi(7) = 40 + 44 = 84 \\text{ cm}" },
      { label: "b.", math: "p = 30 \\Rightarrow L = 2(30) + 44 = 104 \\text{ cm}" },
      { label: "c.", text: "Jika p bertambah 10 cm, sabuk bertambah berapa cm?" },
    ],
  }),
  Qn(31, "Sabuk Lilitan – Soal TKA Lanjut", {
    difficulty: "Sulit",
    content: "Sabuk melingkari dua silinder sama besar (r = 5 cm). Panjang sabuk 80 cm. Tentukan jarak pusat.",
    parts: [
      { label: "a.", math: "80 = 2d + 2\\pi(5) = 2d + 10\\pi" },
      { label: "b.", math: "2d = 80 - 10\\pi \\Rightarrow d = 40 - 5\\pi \\approx 40 - 15{,}7 = 24{,}3 \\text{ cm}" },
      { label: "c.", text: "Apakah jarak ini berarti kedua silinder bersinggungan? (cek: apakah d > 2r?)" },
    ],
  }),
  Qn(32, "Sabuk Lilitan – Soal Pilihan UN", {
    difficulty: "Mudah",
    content: "Dua kaleng susu r = 7 cm. Jarak pusat = 14 cm + 2r = 28 cm? (Ternyata jarak pusat = 28 cm).",
    parts: [
      { label: "a.", math: "L = 2(28) + 2\\pi(7) = 56 + 14\\pi" },
      { label: "b.", math: "L = 56 + 14 \\times \\frac{22}{7} = 56 + 44 = \\ldots \\text{ cm}" },
      { label: "c.", text: "Bandingkan dengan r = 7, p = 14: L = 2(14) + 14π = 28 + 44 = 72 cm. Mana yang lebih panjang?" },
    ],
  }),
  Qn(33, "Sabuk Lilitan – Soal Cerita Mesin Pres", {
    difficulty: "Sedang",
    content: "Mesin pres menggunakan sabuk yang melingkari tiga silinder berjari-jari 10 cm berjejer lurus. Jarak pusat berdekatan = 30 cm.",
    parts: [
      { label: "a.", math: "\\text{Bagian lurus} = 2 \\times 2 \\times 30 = 120 \\text{ cm (atas dan bawah, dua celah)}" },
      { label: "b.", math: "\\text{Busur} = 2\\pi r = 2\\pi \\times 10 = 20\\pi \\approx 62{,}8 \\text{ cm}" },
      { label: "c.", math: "L_{total} = 120 + 20\\pi \\approx 120 + 62{,}8 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(34, "Sabuk Lilitan – Soal ANBK Terapan", {
    difficulty: "Sedang",
    content: "Petani ingin mengikat 2 tong berjari-jari 42 cm menggunakan kawat. Jarak antar pusat = 2 m = 200 cm. Hitung panjang kawat (π = 22/7).",
    parts: [
      { label: "a.", math: "L_{lurus} = 2 \\times 200 = 400 \\text{ cm}" },
      { label: "b.", math: "L_{busur} = 2 \\times \\frac{22}{7} \\times 42 = 264 \\text{ cm}" },
      { label: "c.", math: "L_{total} = 400 + 264 = \\ldots \\text{ cm} = \\ldots \\text{ m}" },
    ],
  }),
  Qn(35, "Sabuk Lilitan – Soal Variabel", {
    difficulty: "Sulit",
    content: "Dua lingkaran berjari-jari r. Sabuk melingkari keduanya. Jika panjang sabuk = 6πr, hitung jarak pusat.",
    parts: [
      { label: "a.", math: "L = 2d + 2\\pi r = 6\\pi r \\Rightarrow 2d = 6\\pi r - 2\\pi r = 4\\pi r" },
      { label: "b.", math: "d = 2\\pi r" },
      { label: "c.", math: "\\text{Jika } r = 7: d = 14\\pi \\approx 44 \\text{ cm}" },
    ],
  }),
  Qn(36, "Sabuk Lilitan – Soal Cerita (Industri)", {
    difficulty: "Sedang",
    content: "Industri tekstil menggunakan mesin dengan dua rol berjari-jari 35 cm masing-masing. Jarak pusat = 105 cm. Hitung panjang sabuk (π = 22/7).",
    parts: [
      { label: "a.", math: "L_{lurus} = 2 \\times 105 = 210 \\text{ cm}" },
      { label: "b.", math: "L_{busur} = 2 \\times \\frac{22}{7} \\times 35 = 220 \\text{ cm}" },
      { label: "c.", math: "L_{total} = 210 + 220 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(37, "Sabuk Lilitan – Soal Perbandingan Konfigurasi", {
    difficulty: "Sulit",
    content: "Dua konfigurasi:\n① Sabuk melingkari 2 silinder r=7, p=20\n② Sabuk melingkari 3 silinder r=7, p=14 (berjejer).\nMana yang memerlukan sabuk lebih panjang?",
    parts: [
      { label: "a.", math: "L_1 = 2(20) + 2\\pi(7) = 40 + 14\\pi" },
      { label: "b.", math: "L_2 = 2(2 \\times 14) + 2\\pi(7) = 56 + 14\\pi" },
      { label: "c.", text: "Selisih sabuk = L₂ − L₁ = 56 − 40 = 16 cm (busur sama karena r sama)." },
    ],
  }),
  Qn(38, "Sabuk Lilitan – Mencari Jumlah Lingkaran", {
    difficulty: "Sulit",
    content: "Sabuk melingkari n silinder berjari-jari r = 7, berjejer lurus dengan jarak pusat berdekatan = 14 cm. Panjang sabuk = 154 cm.",
    parts: [
      { label: "a.", math: "L = 2(n-1) \\times 14 + 2\\pi r = 28(n-1) + 14\\pi" },
      { label: "b.", math: "154 = 28(n-1) + 44 \\Rightarrow 28(n-1) = 110 \\Rightarrow n-1 = \\ldots" },
      { label: "c.", math: "n = \\ldots \\text{ (jumlah silinder)}" },
    ],
  }),
  Qn(39, "Sabuk Lilitan – Soal UN Final", {
    difficulty: "Mudah",
    content: "Dua tong berjari-jari 21 cm diikat pita. Jarak pusat = 62 cm. Hitung panjang pita minimum (π = 22/7).",
    parts: [
      { label: "a.", math: "L_{lurus} = 2 \\times 62 = 124 \\text{ cm}" },
      { label: "b.", math: "L_{busur} = 2 \\times \\frac{22}{7} \\times 21 = 132 \\text{ cm}" },
      { label: "c.", math: "L_{min} = 124 + 132 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(40, "Sabuk Lilitan – Soal TKA Gabungan", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="belt-unequal" size={230} values={{ r1: 55, r2: 30 }} />,
    content: "Dua puli berjari-jari R = 20 cm dan r = 10 cm. Jarak pusat = 50 cm. Sabuk luar melingkari keduanya.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{50^2 - (20-10)^2} = \\sqrt{2500 - 100} = \\sqrt{2400} = 20\\sqrt{6} \\approx 48{,}99 \\text{ cm}" },
      { label: "b.", math: "\\sin \\alpha = \\frac{R-r}{p} = \\frac{10}{50} = 0{,}2 \\Rightarrow \\alpha \\approx 11{,}5^\\circ" },
      { label: "c.", math: "L_{approx} \\approx 2 \\times 20\\sqrt{6} + \\pi(R+r) = 40\\sqrt{6} + 30\\pi \\approx 97{,}98 + 94{,}25 = \\ldots \\text{ cm}" },
    ],
  }),
];

const diffColor: Record<string, string> = {
  Mudah: "bg-violet-500/20 text-violet-300 border-violet-400/40",
  Sedang: "bg-purple-500/20 text-purple-300 border-purple-400/40",
  Sulit: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
};

const SabukLilitanPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <RefreshCw className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            SABUK LILITAN MINIMAL (PENERAPAN)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Garis Singgung Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Rumus Panjang Sabuk Lilitan</p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-violet-300 font-bold mb-1">Dua lingkaran sama besar (R = r):</p>
              <div className="flex justify-center"><BlockMath math="L = 2p + 2\\pi r" /></div>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-violet-300 font-bold mb-1">Dua lingkaran berbeda (pendekatan):</p>
              <div className="flex justify-center"><BlockMath math="L \\approx 2 \\times d_{GSPL} + \\pi(R + r)" /></div>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2 flex gap-2">
              <span className="text-violet-400 font-bold shrink-0">Ingat:</span>
              <span className="text-white/60">p = jarak antar pusat, d = panjang bagian lurus</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-violet-500/10 border border-violet-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/garis-singgung-lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default SabukLilitanPage;
