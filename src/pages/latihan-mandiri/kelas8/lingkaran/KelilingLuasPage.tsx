import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Circle } from "lucide-react";
import CircleDiagram, { CircleDiagramProps } from "./CircleDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: CircleDiagramProps;
  blockMath?: string;
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Rumus Keliling Lingkaran", {
    type: "essay",
    content: "Keliling lingkaran dihitung dengan rumus K = πd = 2πr, dengan π ≈ 22/7 atau π ≈ 3,14.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling lingkaran dengan } r = 7 \\text{ cm.}" },
      { label: "b.", math: "\\text{Hitung keliling lingkaran dengan } d = 14 \\text{ cm.}" },
      { label: "c.", math: "\\text{Hitung keliling lingkaran dengan } r = 21 \\text{ cm.}" },
    ],
  }),

  Q(2, "Rumus Luas Lingkaran", {
    type: "essay",
    content: "Luas lingkaran dihitung dengan rumus L = πr².",
    parts: [
      { label: "a.", math: "\\text{Hitung luas lingkaran dengan } r = 7 \\text{ cm.}" },
      { label: "b.", math: "\\text{Hitung luas lingkaran dengan } r = 14 \\text{ cm.}" },
      { label: "c.", math: "\\text{Hitung luas lingkaran dengan } d = 20 \\text{ cm.}" },
    ],
  }),

  Q(3, "Menghitung Keliling dari Jari-Jari", {
    type: "mixed",
    diagram: { size: 220, r: 0.55, radii: [{ angle: 0, color: "#60a5fa", label: "r = 10 cm" }] },
    parts: [
      { label: "a.", math: "\\text{Hitung keliling dengan } \\pi = 3{,}14." },
      { label: "b.", math: "\\text{Hitung keliling dengan } \\pi = \\tfrac{22}{7}." },
      { label: "c.", text: "Dari hasil a dan b, mana yang lebih besar? Mengapa ada perbedaan?" },
    ],
  }),

  Q(4, "Menghitung Luas dari Diameter", {
    type: "mixed",
    diagram: {
      size: 220, r: 0.55,
      radii: [{ angle: 0, color: "#f472b6", label: "r", toEdge: true }],
      extraTexts: [{ x: 110, y: 205, text: "d = 28 cm", color: "#f472b6", size: 11, bold: true }],
    },
    parts: [
      { label: "a.", text: "Tentukan jari-jari lingkaran." },
      { label: "b.", math: "\\text{Hitung luas dengan } \\pi = \\tfrac{22}{7}." },
      { label: "c.", math: "\\text{Hitung keliling dengan } \\pi = \\tfrac{22}{7}." },
    ],
  }),

  Q(5, "Mencari Jari-Jari dari Keliling", {
    type: "essay",
    content: "Tentukan jari-jari lingkaran jika diketahui kelilingnya!",
    parts: [
      { label: "a.", math: "K = 44 \\text{ cm, gunakan } \\pi = \\tfrac{22}{7}" },
      { label: "b.", math: "K = 62{,}8 \\text{ cm, gunakan } \\pi = 3{,}14" },
      { label: "c.", math: "K = 88 \\text{ cm, gunakan } \\pi = \\tfrac{22}{7}" },
    ],
  }),

  Q(6, "Mencari Jari-Jari dari Luas", {
    type: "essay",
    content: "Tentukan jari-jari lingkaran jika diketahui luasnya!",
    parts: [
      { label: "a.", math: "L = 154 \\text{ cm}^2, \\pi = \\tfrac{22}{7}" },
      { label: "b.", math: "L = 314 \\text{ cm}^2, \\pi = 3{,}14" },
      { label: "c.", math: "L = 616 \\text{ cm}^2, \\pi = \\tfrac{22}{7}" },
    ],
  }),

  Q(7, "Keliling Setengah Lingkaran", {
    type: "mixed",
    diagram: {
      size: 230,
      extraLines: [{ x1: 35, y1: 115, x2: 195, y2: 115, color: "#60a5fa", label: "d" }],
      extraCircles: [{ cx: 115, cy: 115, r: 80, color: "#60a5fa" }],
      extraTexts: [{ x: 115, y: 60, text: "setengah lingkaran", color: "rgba(96,165,250,0.6)", size: 9 }],
      showCenter: false,
    },
    content: "Jari-jari = 7 cm.",
    parts: [
      { label: "a.", text: "Hitung panjang busur setengah lingkaran." },
      { label: "b.", text: "Hitung keliling bangun (busur + diameter)." },
      { label: "c.", text: "Hitung luas setengah lingkaran." },
    ],
  }),

  Q(8, "Keliling Seperempat Lingkaran", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.7,
      sectors: [{ startAngle: 0, endAngle: 90, fillColor: "rgba(250,204,21,0.15)", strokeColor: "#facc15" }],
      radii: [{ angle: 0, color: "#facc15" }, { angle: 90, color: "#facc15" }],
      extraTexts: [{ x: 170, y: 90, text: "r = 14 cm", color: "#facc15", size: 10, bold: true }],
    },
    parts: [
      { label: "a.", text: "Hitung panjang busur seperempat lingkaran." },
      { label: "b.", text: "Hitung keliling bangun (busur + 2 jari-jari)." },
      { label: "c.", text: "Hitung luas seperempat lingkaran." },
    ],
  }),

  Q(9, "Soal UN — Keliling Lingkaran dalam Konteks", {
    type: "mixed",
    content: "Sebuah kolam renang berbentuk lingkaran dengan diameter 14 m. Di sekeliling kolam akan dipasang pagar.",
    parts: [
      { label: "a.", math: "\\text{Hitunglah keliling kolam. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Jika pagar dijual Rp 75.000,00 per meter, berapakah biaya pemasangan pagar?" },
      { label: "c.", text: "Jika diameter diperbesar menjadi 21 m, berapa meter tambahan pagar yang diperlukan?" },
    ],
  }),

  Q(10, "Soal UN — Luas Lingkaran dalam Konteks", {
    type: "mixed",
    content: "Sebuah taman berbentuk lingkaran dengan jari-jari 21 m akan ditanami rumput. Harga rumput Rp 15.000,00 per m².",
    parts: [
      { label: "a.", math: "\\text{Hitunglah luas taman. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Berapakah biaya penanaman rumput?" },
      { label: "c.", text: "Jika jari-jari dikurangi 7 m, berapa luas taman yang baru?" },
    ],
  }),

  Q(11, "Perbandingan Keliling dan Luas", {
    type: "essay",
    content: "Dua lingkaran dengan jari-jari r₁ = 4 cm dan r₂ = 8 cm.",
    parts: [
      { label: "a.", text: "Berapakah perbandingan jari-jari r₁ : r₂?" },
      { label: "b.", text: "Berapakah perbandingan kelilingnya K₁ : K₂?" },
      { label: "c.", text: "Berapakah perbandingan luasnya L₁ : L₂?" },
    ],
  }),

  Q(12, "Jika Jari-Jari Diperbesar", {
    type: "essay",
    content: "Lingkaran awal berjari-jari r. Jari-jari diperbesar menjadi 2r.",
    parts: [
      { label: "a.", text: "Berapa kali keliling lingkaran baru dibanding lingkaran awal?" },
      { label: "b.", text: "Berapa kali luas lingkaran baru dibanding lingkaran awal?" },
      { label: "c.", math: "\\text{Jika } r = 7 \\text{ cm, hitung selisih luas lingkaran awal dan baru.}" },
    ],
  }),

  Q(13, "Luas Gabungan Lingkaran dan Persegi", {
    type: "mixed",
    diagram: {
      size: 230,
      extraRects: [{ x: 35, y: 35, w: 160, h: 160, color: "#fb923c", fill: "rgba(251,146,60,0.1)" }],
      extraCircles: [{ cx: 115, cy: 115, r: 80, color: "#60a5fa", fill: "rgba(56,189,248,0.08)" }],
      showCenter: false,
    },
    content: "Lingkaran dengan r = 7 cm berada di dalam persegi dengan sisi 14 cm.",
    parts: [
      { label: "a.", text: "Hitung luas persegi." },
      { label: "b.", text: "Hitung luas lingkaran." },
      { label: "c.", text: "Hitung luas daerah persegi di luar lingkaran." },
    ],
  }),

  Q(14, "Luas Cincin (Daerah Anular)", {
    type: "mixed",
    diagram: {
      size: 230,
      extraCircles: [
        { cx: 115, cy: 115, r: 80, color: "#60a5fa", fill: "rgba(56,189,248,0.08)" },
        { cx: 115, cy: 115, r: 45, color: "#f472b6", fill: "rgba(2,8,23,0.95)" },
      ],
      extraLines: [
        { x1: 115, y1: 115, x2: 195, y2: 115, color: "#60a5fa", label: "R=7" },
        { x1: 115, y1: 115, x2: 115, y2: 70, color: "#f472b6", label: "r=3" },
      ],
      showCenter: true, centerLabel: "O",
    },
    content: "Dua lingkaran sepusat. Jari-jari luar R = 7 cm, jari-jari dalam r = 3 cm.",
    parts: [
      { label: "a.", text: "Hitung luas lingkaran luar." },
      { label: "b.", text: "Hitung luas lingkaran dalam." },
      { label: "c.", text: "Hitung luas daerah yang diarsir (cincin/annulus)." },
    ],
  }),

  Q(15, "Soal TKA — Roda Berputar", {
    type: "mixed",
    content: "Sebuah roda sepeda berjari-jari 35 cm berputar dan menempuh jarak 88 meter.",
    parts: [
      { label: "a.", text: "Hitung keliling roda." },
      { label: "b.", text: "Berapa banyak roda berputar (rotasi) untuk menempuh jarak 88 m?" },
      { label: "c.", text: "Jika roda berputar 100 kali, berapa jarak yang ditempuh (dalam meter)?" },
    ],
  }),

  Q(16, "Soal ANBK — Membandingkan Lingkaran", {
    type: "essay",
    content: "Lingkaran X berjari-jari 7 cm. Lingkaran Y berdiameter 21 cm.",
    parts: [
      { label: "a.", text: "Berapakah keliling lingkaran X dan Y?" },
      { label: "b.", text: "Berapakah luas lingkaran X dan Y?" },
      { label: "c.", text: "Lingkaran mana yang memiliki luas lebih besar? Berapa kali lebih besar?" },
    ],
  }),

  Q(17, "Mencari Diameter dari Keliling", {
    type: "essay",
    content: "Tentukan diameter lingkaran jika diketahui kelilingnya!",
    parts: [
      { label: "a.", math: "K = 44 \\text{ cm}" },
      { label: "b.", math: "K = 132 \\text{ cm}" },
      { label: "c.", math: "K = 220 \\text{ cm}" },
    ],
  }),

  Q(18, "Luas Persegi Panjang vs Lingkaran", {
    type: "essay",
    content: "Sebuah persegi panjang 14 cm × 11 cm dan sebuah lingkaran berjari-jari 7 cm.",
    parts: [
      { label: "a.", text: "Hitung luas persegi panjang." },
      { label: "b.", math: "\\text{Hitung luas lingkaran. (} \\pi = \\tfrac{22}{7})" },
      { label: "c.", text: "Manakah yang lebih luas? Berapa perbedaannya?" },
    ],
  }),

  Q(19, "Keliling Gabungan Setengah Lingkaran", {
    type: "mixed",
    diagram: {
      size: 230,
      extraRects: [{ x: 35, y: 75, w: 160, h: 80, color: "#34d399", fill: "rgba(52,211,153,0.1)" }],
      extraCircles: [{ cx: 115, cy: 75, r: 80, color: "#f472b6" }],
      showCenter: false,
    },
    content: "Bangun terdiri dari persegi panjang 16 cm × 8 cm dengan setengah lingkaran di bagian atas (diameter = 16 cm).",
    parts: [
      { label: "a.", text: "Hitung panjang busur setengah lingkaran." },
      { label: "b.", text: "Hitung keliling seluruh bangun (3 sisi persegi panjang + busur)." },
      { label: "c.", text: "Hitung luas seluruh bangun." },
    ],
  }),

  Q(20, "Soal UN — Taman Melingkar dengan Jalan", {
    type: "essay",
    content: "Sebuah taman berbentuk lingkaran berjari-jari 28 m. Di luar taman dibuat jalan melingkar lebar 7 m.",
    parts: [
      { label: "a.", text: "Tentukan jari-jari luar (taman + jalan)." },
      { label: "b.", text: "Hitung luas seluruhnya (taman + jalan)." },
      { label: "c.", text: "Hitung luas jalan saja." },
    ],
  }),

  Q(21, "Luas Permukaan Tabung — Alas Lingkaran", {
    type: "essay",
    content: "Sebuah kaleng berbentuk tabung memiliki jari-jari alas 7 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas satu alas (lingkaran). (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Hitung luas dua alas." },
      { label: "c.", math: "\\text{Jika tinggi kaleng 10 cm, hitung luas selimut (K × t).}" },
    ],
  }),

  Q(22, "Soal ANBK — Alun-Alun Melingkar", {
    type: "essay",
    content: "Alun-alun kota berbentuk lingkaran berdiameter 70 m. Di sekelilingnya dipasang lampu setiap 5 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling alun-alun. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Berapa banyak lampu yang diperlukan?" },
      { label: "c.", text: "Jika biaya setiap lampu Rp 200.000,00, berapakah total biaya?" },
    ],
  }),

  Q(23, "Luas Lingkaran — Mencari π", {
    type: "essay",
    content: "Diketahui luas sebuah lingkaran. Gunakan rumus L = πr² untuk mencari nilai yang belum diketahui.",
    parts: [
      { label: "a.", math: "L = 314 \\text{ cm}^2, r = 10 \\text{ cm. Tentukan nilai } \\pi." },
      { label: "b.", math: "L = 154 \\text{ cm}^2, \\pi = \\tfrac{22}{7}. \\text{ Tentukan } r." },
      { label: "c.", math: "K = 31{,}4 \\text{ cm, } \\pi = 3{,}14. \\text{ Tentukan } r \\text{ dan } L." },
    ],
  }),

  Q(24, "Keliling dan Luas dari Soal Cerita", {
    type: "essay",
    content: "Sebuah piring makan berbentuk lingkaran berdiameter 28 cm.",
    parts: [
      { label: "a.", text: "Hitung keliling piring." },
      { label: "b.", text: "Hitung luas permukaan piring." },
      { label: "c.", text: "Jika permukaan piring akan dihias dengan kayu tipis di sekelilingnya dengan harga Rp 5.000/cm, berapa biayanya?" },
    ],
  }),

  Q(25, "Soal TKA — Lintasan Lari Melingkar", {
    type: "essay",
    content: "Lintasan lari berbentuk lingkaran berjari-jari 50 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling lintasan. (} \\pi = 3{,}14)" },
      { label: "b.", text: "Seorang atlet berlari 5 putaran. Berapa meter jarak yang ditempuh?" },
      { label: "c.", text: "Jika kecepatan lari 10 m/s, berapa detik untuk menyelesaikan 5 putaran?" },
    ],
  }),

  Q(26, "Keliling dari Konteks Jam", {
    type: "essay",
    content: "Jarum menit sebuah jam panjangnya 21 cm (dari pusat ke ujung).",
    parts: [
      { label: "a.", text: "Hitung jarak yang ditempuh ujung jarum menit dalam 1 jam (1 putaran penuh)." },
      { label: "b.", text: "Hitung jarak yang ditempuh ujung jarum menit dalam 30 menit." },
      { label: "c.", text: "Dalam 1 hari (24 jam), berapa meter jarak yang ditempuh ujung jarum menit?" },
    ],
  }),

  Q(27, "Luas Tiga Perempat Lingkaran", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.65,
      sectors: [{ startAngle: 90, endAngle: 0, fillColor: "rgba(167,139,250,0.2)", strokeColor: "#a78bfa" }],
      radii: [{ angle: 90, color: "#a78bfa" }, { angle: 0, color: "#a78bfa" }],
      extraTexts: [{ x: 115, y: 155, text: "¾ lingkaran", color: "#a78bfa", size: 10 }],
    },
    content: "Jari-jari = 14 cm.",
    parts: [
      { label: "a.", text: "Hitung panjang busur ¾ lingkaran." },
      { label: "b.", text: "Hitung keliling bangun ¾ lingkaran (busur + 2 jari-jari)." },
      { label: "c.", text: "Hitung luas ¾ lingkaran." },
    ],
  }),

  Q(28, "Menentukan Keliling dan Luas dari Konteks", {
    type: "essay",
    content: "Kue berbentuk lingkaran berdiameter 21 cm akan dibagi menjadi 7 bagian sama besar.",
    parts: [
      { label: "a.", text: "Hitung luas seluruh kue." },
      { label: "b.", text: "Hitung luas setiap bagian kue." },
      { label: "c.", text: "Sudut pusat setiap irisan kue adalah berapa derajat?" },
    ],
  }),

  Q(29, "Soal UN — Perubahan Jari-Jari", {
    type: "essay",
    content: "Jari-jari sebuah lingkaran diperbesar sebesar 50%.",
    parts: [
      { label: "a.", text: "Keliling lingkaran baru berapa kali keliling semula?" },
      { label: "b.", text: "Luas lingkaran baru berapa kali luas semula?" },
      { label: "c.", math: "\\text{Jika } r = 10 \\text{ cm, hitung selisih luas sebelum dan sesudah pembesaran.}" },
    ],
  }),

  Q(30, "Soal ANBK — Desain Taman", {
    type: "essay",
    content: "Sebuah taman melingkar berjari-jari 21 m. Di tengah taman ada kolam berbentuk lingkaran berjari-jari 7 m.",
    parts: [
      { label: "a.", text: "Hitung luas taman (tanpa kolam)." },
      { label: "b.", text: "Jika biaya menanami taman Rp 20.000/m², berapa total biayanya?" },
      { label: "c.", text: "Keliling kolam adalah berapa meter?" },
    ],
  }),

  Q(31, "Menghitung Keliling Berbagai Lingkaran", {
    type: "essay",
    content: "Gunakan π = 22/7. Hitung keliling setiap lingkaran berikut!",
    parts: [
      { label: "a.", math: "r = 3{,}5 \\text{ cm}" },
      { label: "b.", math: "d = 63 \\text{ cm}" },
      { label: "c.", math: "r = 4{,}2 \\text{ m}" },
      { label: "d.", math: "d = 2{,}1 \\text{ m}" },
    ],
  }),

  Q(32, "Menghitung Luas Berbagai Lingkaran", {
    type: "essay",
    content: "Gunakan π = 22/7. Hitung luas setiap lingkaran berikut!",
    parts: [
      { label: "a.", math: "r = 14 \\text{ cm}" },
      { label: "b.", math: "d = 42 \\text{ cm}" },
      { label: "c.", math: "r = 3{,}5 \\text{ m}" },
      { label: "d.", math: "d = 56 \\text{ cm}" },
    ],
  }),

  Q(33, "Soal TKA — Bola Basket", {
    type: "essay",
    content: "Lingkaran tengah lapangan basket berjari-jari 1,8 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling lingkaran tengah. (} \\pi = 3{,}14)" },
      { label: "b.", math: "\\text{Hitung luas lingkaran tengah.}" },
      { label: "c.", text: "Jika lapangan memiliki 3 lingkaran serupa, berapa total luas semua lingkaran?" },
    ],
  }),

  Q(34, "Mencari Diameter dari Luas", {
    type: "essay",
    content: "Tentukan diameter lingkaran jika diketahui luasnya!",
    parts: [
      { label: "a.", math: "L = 154 \\text{ cm}^2, \\pi = \\tfrac{22}{7}" },
      { label: "b.", math: "L = 616 \\text{ cm}^2, \\pi = \\tfrac{22}{7}" },
      { label: "c.", math: "L = 1386 \\text{ cm}^2, \\pi = \\tfrac{22}{7}" },
    ],
  }),

  Q(35, "Keliling dan Luas — Soal Gabungan", {
    type: "mixed",
    diagram: {
      size: 230,
      extraRects: [{ x: 50, y: 75, w: 130, h: 80, color: "#34d399", fill: "rgba(52,211,153,0.1)" }],
      extraCircles: [
        { cx: 50, cy: 115, r: 40, color: "#60a5fa", fill: "rgba(56,189,248,0.1)" },
        { cx: 180, cy: 115, r: 40, color: "#60a5fa", fill: "rgba(56,189,248,0.1)" },
      ],
      showCenter: false,
    },
    content: "Bangun terdiri dari persegi panjang 13 cm × 8 cm dengan dua setengah lingkaran di ujung kiri dan kanan (diameter = 8 cm).",
    parts: [
      { label: "a.", text: "Hitung keliling seluruh bangun (persegi panjang + 2 setengah lingkaran = 1 lingkaran penuh)." },
      { label: "b.", text: "Hitung luas seluruh bangun." },
      { label: "c.", text: "Bangun seperti ini disebut apa? Di mana contohnya dalam kehidupan nyata?" },
    ],
  }),

  Q(36, "Soal UN — Menentukan Keliling dari Luas", {
    type: "essay",
    content: "Sebuah lingkaran memiliki luas 154 cm².",
    parts: [
      { label: "a.", math: "\\text{Tentukan jari-jari lingkaran. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Tentukan diameter lingkaran." },
      { label: "c.", text: "Tentukan keliling lingkaran." },
    ],
  }),

  Q(37, "Soal ANBK — Evaluasi Pernyataan", {
    type: "essay",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S)!",
    parts: [
      { label: "(1)", math: "\\text{Jika } r = 7, \\text{ maka } K = 44 \\text{ cm. (} \\pi = \\tfrac{22}{7})" },
      { label: "(2)", math: "\\text{Jika } d = 14, \\text{ maka } L = 154 \\text{ cm}^2" },
      { label: "(3)", text: "Jika jari-jari dijadikan 3 kali lipat, luas menjadi 6 kali semula." },
      { label: "(4)", text: "Keliling lingkaran = π kali diameternya." },
    ],
  }),

  Q(38, "Menggunakan π = 3,14 vs 22/7", {
    type: "essay",
    content: "Lingkaran dengan diameter 10 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling dengan } \\pi = 3{,}14." },
      { label: "b.", math: "\\text{Hitung keliling dengan } \\pi = \\tfrac{22}{7}." },
      { label: "c.", text: "Berapa selisih hasil keduanya? Nilai π mana yang lebih tepat menurut kamu?" },
    ],
  }),

  Q(39, "Soal TKA — Membandingkan Luas", {
    type: "essay",
    content: "Tiga lingkaran dengan jari-jari 7 cm, 14 cm, dan 21 cm.",
    parts: [
      { label: "a.", text: "Hitung luas masing-masing lingkaran." },
      { label: "b.", text: "Bagaimana perbandingan luas ketiga lingkaran?" },
      { label: "c.", text: "Apakah luas lingkaran terbesar = jumlah luas dua lingkaran kecil? Buktikan!" },
    ],
  }),

  Q(40, "Soal ANBK Gabungan — Keliling dan Luas", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.62,
      radii: [{ angle: 40, color: "#60a5fa", label: "r = 7 cm" }],
      sectors: [
        { startAngle: 0, endAngle: 120, fillColor: "rgba(248,113,163,0.2)", label: "⅓ lingkaran" },
        { startAngle: 120, endAngle: 240, fillColor: "rgba(250,204,21,0.2)", label: "⅓ lingkaran" },
        { startAngle: 240, endAngle: 360, fillColor: "rgba(52,211,153,0.2)", label: "⅓ lingkaran" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung keliling lingkaran penuh." },
      { label: "b.", text: "Hitung luas lingkaran penuh." },
      { label: "c.", text: "Hitung keliling setiap bagian (⅓ lingkaran + 2 jari-jari)." },
      { label: "d.", text: "Hitung luas setiap bagian (⅓ lingkaran)." },
    ],
  }),
];

const KelilingLuasPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            KELILING DAN LUAS LINGKARAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-3">📐 Rumus Keliling dan Luas</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-emerald-400 text-xs font-bold mb-2">KELILING</p>
              <BlockMath math="K = \pi d = 2\pi r" />
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-yellow-400 text-xs font-bold mb-2">LUAS</p>
              <BlockMath math="L = \pi r^2 = \frac{1}{4}\pi d^2" />
            </div>
            <div className="bg-white/5 rounded-xl p-3 flex gap-4 justify-center text-xs font-body">
              <span className="text-white/60"><span className="text-cyan-400 font-bold">π ≈ 22/7</span> jika r atau d habis dibagi 7</span>
              <span className="text-white/60"><span className="text-pink-400 font-bold">π ≈ 3,14</span> jika bilangan lainnya</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CircleDiagram {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default KelilingLuasPage;
