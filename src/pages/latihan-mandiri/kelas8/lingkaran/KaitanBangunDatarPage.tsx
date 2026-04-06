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
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Lingkaran Dalam Persegi (Incircle)", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.62,
      extraRects: [{ x: 33, y: 33, w: 164, h: 164, color: "#fb923c", fill: "rgba(251,146,60,0.08)" }],
      extraTexts: [{ x: 115, y: 205, text: "sisi persegi = diameter lingkaran", color: "#fb923c", size: 9 }],
    },
    content: "Lingkaran berada di dalam persegi dengan sisi = diameter lingkaran. Jari-jari lingkaran = 7 cm.",
    parts: [
      { label: "a.", text: "Hitung sisi persegi." },
      { label: "b.", text: "Hitung luas persegi dan luas lingkaran." },
      { label: "c.", text: "Hitung luas daerah persegi di luar lingkaran." },
    ],
  }),

  Q(2, "Lingkaran Luar Persegi (Circumscribed Circle)", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.62,
      extraRects: [{ x: 33, y: 33, w: 164, h: 164, color: "#60a5fa", fill: "rgba(56,189,248,0.08)" }],
      pts: [
        { angle: 45, label: "A", color: "#f472b6" },
        { angle: 135, label: "B", color: "#f472b6" },
        { angle: 225, label: "C", color: "#f472b6" },
        { angle: 315, label: "D", color: "#f472b6" },
      ],
      extraTexts: [{ x: 115, y: 208, text: "diagonal persegi = diameter lingkaran", color: "#60a5fa", size: 9 }],
    },
    content: "Persegi ABCD dengan sisi 10 cm dimasukkan ke dalam lingkaran (sudut-sudut menyentuh lingkaran).",
    parts: [
      { label: "a.", text: "Hitung diagonal persegi ABCD." },
      { label: "b.", text: "Tentukan jari-jari lingkaran." },
      { label: "c.", text: "Hitung luas daerah lingkaran di luar persegi." },
    ],
  }),

  Q(3, "Setengah Lingkaran di Atas Persegi Panjang", {
    type: "mixed",
    diagram: {
      size: 230,
      extraRects: [{ x: 30, y: 110, w: 170, h: 80, color: "#34d399", fill: "rgba(52,211,153,0.1)" }],
      extraCircles: [{ cx: 115, cy: 110, r: 85, color: "#f472b6", fill: "rgba(248,113,163,0.08)" }],
      showCenter: false,
      extraTexts: [
        { x: 115, y: 155, text: "Persegi Panjang", color: "#34d399", size: 9 },
        { x: 115, y: 55, text: "½ Lingkaran", color: "#f472b6", size: 9 },
      ],
    },
    content: "Persegi panjang 14 cm × 7 cm. Di atas persegi ada setengah lingkaran dengan diameter = lebar persegi (14 cm).",
    parts: [
      { label: "a.", text: "Hitung luas persegi panjang." },
      { label: "b.", text: "Hitung luas setengah lingkaran." },
      { label: "c.", text: "Hitung total luas gabungan." },
    ],
  }),

  Q(4, "Lingkaran dalam Segitiga Sama Sisi", {
    type: "essay",
    content: "Segitiga sama sisi dengan sisi a = 6 cm. Lingkaran yang menyinggung ketiga sisi segitiga memiliki jari-jari: r = a/(2√3).",
    parts: [
      { label: "a.", text: "Titik pusat incircle disebut apa dalam segitiga?" },
      { label: "b.", math: "\\text{Hitung } r = \\frac{6}{2\\sqrt{3}}." },
      { label: "c.", text: "Apakah semua sisi segitiga berjarak sama dari pusat lingkaran? Mengapa?" },
    ],
  }),

  Q(5, "Persegi Panjang dengan Lubang Lingkaran", {
    type: "mixed",
    diagram: {
      size: 230,
      extraRects: [{ x: 25, y: 55, w: 180, h: 120, color: "#facc15", fill: "rgba(250,204,21,0.1)" }],
      extraCircles: [{ cx: 115, cy: 115, r: 42, color: "#f87171", fill: "rgba(248,113,163,0.15)" }],
      showCenter: false,
    },
    content: "Papan kayu berbentuk persegi panjang 18 cm × 12 cm. Di tengahnya dilubangi lingkaran berjari-jari 3 cm.",
    parts: [
      { label: "a.", text: "Hitung luas papan awal." },
      { label: "b.", text: "Hitung luas lubang lingkaran." },
      { label: "c.", text: "Hitung luas papan setelah dilubangi." },
    ],
  }),

  Q(6, "Persegi dalam Lingkaran", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.62,
      pts: [
        { angle: 45, label: "A", color: "#facc15" },
        { angle: 135, label: "B", color: "#facc15" },
        { angle: 225, label: "C", color: "#facc15" },
        { angle: 315, label: "D", color: "#facc15" },
      ],
      chords: [
        { angle1: 45, angle2: 135, color: "rgba(250,204,21,0.6)" },
        { angle1: 135, angle2: 225, color: "rgba(250,204,21,0.6)" },
        { angle1: 225, angle2: 315, color: "rgba(250,204,21,0.6)" },
        { angle1: 315, angle2: 45, color: "rgba(250,204,21,0.6)" },
      ],
    },
    content: "Persegi ABCD dengan diagonal = diameter lingkaran. Jari-jari lingkaran = 5√2 cm.",
    parts: [
      { label: "a.", text: "Hitung diagonal persegi ABCD." },
      { label: "b.", math: "\\text{Hitung sisi persegi jika diagonal} = d." },
      { label: "c.", text: "Hitung luas persegi dan luas lingkaran. Mana yang lebih besar?" },
    ],
  }),

  Q(7, "Tiga Lingkaran Berjejer", {
    type: "mixed",
    diagram: {
      size: 230,
      extraCircles: [
        { cx: 55, cy: 115, r: 40, color: "#f472b6", fill: "rgba(244,114,182,0.1)" },
        { cx: 115, cy: 115, r: 40, color: "#60a5fa", fill: "rgba(96,165,250,0.1)" },
        { cx: 175, cy: 115, r: 40, color: "#34d399", fill: "rgba(52,211,153,0.1)" },
      ],
      extraRects: [{ x: 15, y: 75, w: 200, h: 80, color: "rgba(255,255,255,0.15)" }],
      showCenter: false,
    },
    content: "Tiga lingkaran kongruen berdiameter 8 cm berjejer di dalam persegi panjang.",
    parts: [
      { label: "a.", text: "Hitung panjang dan lebar persegi panjang terkecil yang memuat 3 lingkaran." },
      { label: "b.", text: "Hitung luas persegi panjang." },
      { label: "c.", text: "Hitung luas daerah di dalam persegi panjang tapi di luar semua lingkaran." },
    ],
  }),

  Q(8, "Lingkaran dan Belah Ketupat", {
    type: "essay",
    content: "Belah ketupat PQRS dengan diagonal d₁ = 16 cm dan d₂ = 12 cm. Sebuah lingkaran digambar dengan diameter = diagonal terpanjang.",
    parts: [
      { label: "a.", text: "Tentukan jari-jari lingkaran." },
      { label: "b.", text: "Hitung luas belah ketupat." },
      { label: "c.", text: "Hitung luas lingkaran. Manakah yang lebih besar?" },
    ],
  }),

  Q(9, "Bangun Gabungan — Persegi + Dua Setengah Lingkaran", {
    type: "mixed",
    diagram: {
      size: 230,
      extraRects: [{ x: 55, y: 55, w: 120, h: 120, color: "#a78bfa", fill: "rgba(167,139,250,0.1)" }],
      extraCircles: [
        { cx: 55, cy: 115, r: 60, color: "#f472b6", fill: "rgba(248,113,163,0.08)" },
        { cx: 175, cy: 115, r: 60, color: "#f472b6", fill: "rgba(248,113,163,0.08)" },
      ],
      showCenter: false,
    },
    content: "Bangun terdiri dari persegi dengan sisi 12 cm dan dua setengah lingkaran di kiri-kanan (diameter = sisi persegi).",
    parts: [
      { label: "a.", text: "Hitung luas persegi." },
      { label: "b.", text: "Hitung luas dua setengah lingkaran (= satu lingkaran penuh)." },
      { label: "c.", text: "Hitung total luas bangun gabungan." },
    ],
  }),

  Q(10, "Segitiga Siku-Siku dalam Lingkaran", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.62,
      pts: [
        { angle: 180, label: "A", color: "#f472b6" },
        { angle: 0, label: "B", color: "#f472b6" },
        { angle: 90, label: "C", color: "#facc15" },
      ],
      chords: [
        { angle1: 180, angle2: 0, color: "#60a5fa", label: "AB (diameter)" },
        { angle1: 180, angle2: 90, color: "rgba(255,255,255,0.4)" },
        { angle1: 0, angle2: 90, color: "rgba(255,255,255,0.4)" },
      ],
    },
    content: "Segitiga ACB di dalam lingkaran dengan AB sebagai diameter.",
    parts: [
      { label: "a.", text: "Berapakah besar sudut ACB? (ingat teorema sudut keliling)" },
      { label: "b.", math: "\\text{Jika } r = 5 \\text{ cm dan AC} = 6 \\text{ cm, hitung BC.}" },
      { label: "c.", text: "Hitung luas segitiga ACB." },
    ],
  }),

  Q(11, "Soal UN — Lingkaran Dalam Persegi", {
    type: "essay",
    content: "Persegi dengan sisi 14 cm. Di dalam persegi dibuat lingkaran terbesar yang mungkin.",
    parts: [
      { label: "a.", text: "Tentukan jari-jari lingkaran terbesar tersebut." },
      { label: "b.", text: "Hitung luas lingkaran." },
      { label: "c.", text: "Hitung luas persegi yang tidak tertutup lingkaran." },
    ],
  }),

  Q(12, "Soal ANBK — Desain Logo", {
    type: "essay",
    content: "Sebuah logo berbentuk lingkaran berjari-jari 10 cm. Di dalamnya terdapat persegi yang keempat sudutnya menyentuh lingkaran.",
    parts: [
      { label: "a.", text: "Hitung diagonal persegi." },
      { label: "b.", math: "\\text{Hitung sisi persegi. (diagonal persegi} = s\\sqrt{2})" },
      { label: "c.", text: "Hitung luas daerah lingkaran di luar persegi." },
    ],
  }),

  Q(13, "Empat Lingkaran dalam Persegi", {
    type: "mixed",
    diagram: {
      size: 230,
      extraCircles: [
        { cx: 60, cy: 60, r: 45, color: "#f472b6", fill: "rgba(244,114,182,0.1)" },
        { cx: 170, cy: 60, r: 45, color: "#60a5fa", fill: "rgba(96,165,250,0.1)" },
        { cx: 60, cy: 170, r: 45, color: "#34d399", fill: "rgba(52,211,153,0.1)" },
        { cx: 170, cy: 170, r: 45, color: "#facc15", fill: "rgba(250,204,21,0.1)" },
      ],
      extraRects: [{ x: 15, y: 15, w: 200, h: 200, color: "rgba(255,255,255,0.2)" }],
      showCenter: false,
    },
    content: "Empat lingkaran kongruen berjari-jari 5 cm tersusun dalam persegi 20 cm × 20 cm.",
    parts: [
      { label: "a.", text: "Hitung luas persegi." },
      { label: "b.", text: "Hitung total luas keempat lingkaran." },
      { label: "c.", text: "Hitung luas daerah di dalam persegi tapi di luar semua lingkaran." },
    ],
  }),

  Q(14, "Lingkaran di Sekitar Segitiga Siku-Siku", {
    type: "essay",
    content: "Segitiga siku-siku dengan sisi 6 cm, 8 cm, dan 10 cm. Sebuah lingkaran melingkupi segitiga tersebut (hipotenusa = diameter).",
    parts: [
      { label: "a.", text: "Tentukan jari-jari lingkaran." },
      { label: "b.", text: "Hitung luas lingkaran." },
      { label: "c.", text: "Hitung luas segitiga. Kemudian hitung luas daerah lingkaran di luar segitiga." },
    ],
  }),

  Q(15, "Soal TKA — Kayu Berbentuk Lingkaran dalam Persegi", {
    type: "essay",
    content: "Papan berbentuk persegi 28 cm × 28 cm. Dari papan tersebut dipotong lingkaran terbesar yang mungkin.",
    parts: [
      { label: "a.", text: "Tentukan jari-jari lingkaran terbesar." },
      { label: "b.", text: "Hitung luas lingkaran yang dipotong." },
      { label: "c.", text: "Hitung luas papan yang tersisa (menjadi limbah)." },
    ],
  }),

  Q(16, "Perbandingan Luas — Persegi vs Lingkaran", {
    type: "essay",
    content: "Persegi dengan sisi 14 cm dan lingkaran dengan diameter 14 cm.",
    parts: [
      { label: "a.", text: "Hitung luas persegi." },
      { label: "b.", text: "Hitung luas lingkaran." },
      { label: "c.", math: "\\text{Tentukan perbandingan luas persegi : luas lingkaran (dalam pecahan)}.\\text{ (} \\pi = \\tfrac{22}{7})" },
    ],
  }),

  Q(17, "Bangun Gabungan — Mencari Luas yang Diarsir", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.62,
      sectors: [{ startAngle: 0, endAngle: 90, fillColor: "rgba(167,139,250,0.3)", strokeColor: "#a78bfa" }],
      radii: [{ angle: 0, color: "#a78bfa" }, { angle: 90, color: "#a78bfa" }],
      extraRects: [{ x: 115, y: 34, w: 81, h: 81, color: "#facc15", fill: "rgba(250,204,21,0.08)" }],
      extraTexts: [{ x: 170, y: 80, text: "Persegi", color: "#facc15", size: 9 }],
    },
    content: "Juring OAB (sudut 90°) dengan r = 14 cm. Di dalam juring dibuat persegi dengan sisi = r/√2.",
    parts: [
      { label: "a.", text: "Hitung luas juring OAB." },
      { label: "b.", math: "\\text{Hitung sisi persegi jika sisi} = \\frac{r}{\\sqrt{2}} = \\frac{14}{\\sqrt{2}} \\approx 9{,}9 \\text{ cm}." },
      { label: "c.", text: "Hitung luas daerah juring di luar persegi." },
    ],
  }),

  Q(18, "Soal UN — Pizza Melingkar", {
    type: "essay",
    content: "Pizza berbentuk lingkaran berjari-jari 21 cm dipotong menjadi 6 bagian sama besar.",
    parts: [
      { label: "a.", text: "Hitung luas satu potongan pizza." },
      { label: "b.", text: "Hitung keliling pizza." },
      { label: "c.", text: "Hitung panjang tepi melengkung (busur) satu potongan pizza." },
    ],
  }),

  Q(19, "Lingkaran dan Jajaran Genjang", {
    type: "essay",
    content: "Sebuah lingkaran berjari-jari 7 cm berada di dalam jajaran genjang. Tinggi jajaran genjang sama dengan diameter lingkaran.",
    parts: [
      { label: "a.", text: "Tentukan tinggi jajaran genjang." },
      { label: "b.", text: "Jika alas jajaran genjang = 20 cm, hitung luasnya." },
      { label: "c.", text: "Hitung luas daerah jajaran genjang di luar lingkaran." },
    ],
  }),

  Q(20, "Tembereng — Luas Daerah", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.62,
      pts: [
        { angle: 150, label: "A", color: "#f472b6" },
        { angle: 30, label: "B", color: "#f472b6" },
      ],
      chords: [{ angle1: 150, angle2: 30, color: "#f472b6" }],
      sectors: [{ startAngle: 30, endAngle: 150, fillColor: "rgba(248,113,163,0.2)", strokeColor: "none" }],
      radii: [{ angle: 150, color: "rgba(248,113,163,0.4)" }, { angle: 30, color: "rgba(248,113,163,0.4)" }],
      arcs: [{ startAngle: 150, endAngle: 30, color: "#f472b6", width: 3 }],
    },
    content: "Lingkaran r = 14 cm dengan tali busur AB. ∠AOB = 60°.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas juring OAB (sudut 60°).}" },
      { label: "b.", math: "\\text{Hitung luas segitiga OAB. (gunakan } \\tfrac{1}{2}r^2 \\sin \\theta)" },
      { label: "c.", text: "Hitung luas tembereng AB (= luas juring − luas segitiga)." },
    ],
  }),

  Q(21, "Soal ANBK — Menentukan Luas Gabungan", {
    type: "essay",
    content: "Bangun berbentuk persegi panjang 21 cm × 7 cm. Di satu ujungnya terdapat setengah lingkaran (diameter = 7 cm).",
    parts: [
      { label: "a.", text: "Hitung luas persegi panjang." },
      { label: "b.", text: "Hitung luas setengah lingkaran." },
      { label: "c.", text: "Hitung luas total bangun gabungan." },
    ],
  }),

  Q(22, "Dua Lingkaran Bersinggungan", {
    type: "mixed",
    diagram: {
      size: 230,
      extraCircles: [
        { cx: 80, cy: 115, r: 55, color: "#60a5fa", fill: "rgba(56,189,248,0.1)" },
        { cx: 165, cy: 115, r: 40, color: "#f472b6", fill: "rgba(248,113,163,0.1)" },
      ],
      extraTexts: [
        { x: 80, y: 115, text: "R=7", color: "#60a5fa", size: 9 },
        { x: 165, y: 115, text: "r=5", color: "#f472b6", size: 9 },
      ],
      showCenter: false,
    },
    content: "Dua lingkaran bersinggungan luar. Jari-jari masing-masing R = 7 cm dan r = 5 cm.",
    parts: [
      { label: "a.", text: "Hitung jarak antara kedua pusat lingkaran." },
      { label: "b.", text: "Hitung jumlah luas kedua lingkaran." },
      { label: "c.", text: "Hitung jumlah keliling kedua lingkaran." },
    ],
  }),

  Q(23, "Lingkaran dan Trapesium", {
    type: "essay",
    content: "Trapesium dengan alas atas = 6 cm, alas bawah = 14 cm, tinggi = 8 cm. Di dalamnya terdapat lingkaran dengan diameter = tinggi trapesium.",
    parts: [
      { label: "a.", text: "Hitung luas trapesium." },
      { label: "b.", text: "Hitung jari-jari dan luas lingkaran." },
      { label: "c.", text: "Hitung luas daerah trapesium di luar lingkaran." },
    ],
  }),

  Q(24, "Soal TKA — Papan Berbentuk Lingkaran", {
    type: "essay",
    content: "Papan target panahan berbentuk lingkaran berjari-jari 50 cm terdiri dari 5 cincin konsentris dengan lebar cincin 10 cm masing-masing.",
    parts: [
      { label: "a.", text: "Tentukan jari-jari setiap lingkaran (r₁ = 10, r₂ = 20, r₃ = 30, r₄ = 40, r₅ = 50)." },
      { label: "b.", text: "Hitung luas lingkaran terdalam (r₁ = 10 cm)." },
      { label: "c.", text: "Hitung luas cincin paling luar (r₄ sampai r₅)." },
    ],
  }),

  Q(25, "Perubahan Luas — Gabungan", {
    type: "essay",
    content: "Sebuah persegi dengan sisi 2r memiliki lingkaran di dalamnya dengan jari-jari r.",
    parts: [
      { label: "a.", math: "\\text{Tentukan perbandingan luas lingkaran : luas persegi.}" },
      { label: "b.", math: "\\text{Jika } r = 7 \\text{ cm, hitung selisih luas persegi dan lingkaran.}" },
      { label: "c.", text: "Jika r diperbesar 2 kali, berapa kali selisih luas berubah?" },
    ],
  }),

  Q(26, "Soal UN — Luas Gabungan Kipas", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.62,
      sectors: [
        { startAngle: 0, endAngle: 90, fillColor: "rgba(250,204,21,0.2)", strokeColor: "#facc15" },
        { startAngle: 90, endAngle: 180, fillColor: "rgba(250,204,21,0.2)", strokeColor: "#facc15" },
      ],
      radii: [{ angle: 0, color: "#facc15" }, { angle: 90, color: "#facc15" }, { angle: 180, color: "#facc15" }],
    },
    content: "Dua juring masing-masing sudut 90° dengan r = 14 cm tersusun membentuk setengah lingkaran.",
    parts: [
      { label: "a.", text: "Hitung luas satu juring 90°." },
      { label: "b.", text: "Hitung luas dua juring = luas setengah lingkaran." },
      { label: "c.", text: "Verifikasi: luas setengah lingkaran = ½ × πr²." },
    ],
  }),

  Q(27, "Soal ANBK — Hubungan Panjang Sisi", {
    type: "essay",
    content: "Segitiga sama kaki dengan alas 16 cm dan kaki 10 cm. Sebuah lingkaran menyinggung ketiga sisi.",
    parts: [
      { label: "a.", text: "Hitung tinggi segitiga menggunakan Teorema Pythagoras." },
      { label: "b.", text: "Hitung luas segitiga." },
      { label: "c.", math: "\\text{Jari-jari incircle} = \\frac{\\text{Luas}}{\\text{setengah keliling}}. \\text{ Hitung } r." },
    ],
  }),

  Q(28, "Lingkaran dan Persegi Panjang — Konteks Kolam", {
    type: "essay",
    content: "Kolam berbentuk persegi panjang 20 m × 15 m. Di tengah kolam ada pulau berbentuk lingkaran berjari-jari 3 m.",
    parts: [
      { label: "a.", text: "Hitung luas kolam total." },
      { label: "b.", text: "Hitung luas pulau." },
      { label: "c.", text: "Hitung luas air dalam kolam (total − pulau)." },
    ],
  }),

  Q(29, "Soal TKA — Lantai Berbentuk Gabungan", {
    type: "essay",
    content: "Lantai ruangan berbentuk persegi 10 m × 10 m. Sebagian lantai berbentuk lingkaran (r = 4 m) akan dipasang keramik berbeda.",
    parts: [
      { label: "a.", text: "Hitung luas lantai persegi." },
      { label: "b.", text: "Hitung luas bagian lingkaran." },
      { label: "c.", text: "Hitung luas bagian persegi di luar lingkaran." },
    ],
  }),

  Q(30, "Soal UN — Perbandingan Luas Gabungan", {
    type: "essay",
    content: "Persegi dengan sisi 14 cm. Di dalamnya dibuat 4 lingkaran kongruen yang berjejer 2×2 (masing-masing r = 3,5 cm).",
    parts: [
      { label: "a.", text: "Hitung luas persegi." },
      { label: "b.", text: "Hitung luas 4 lingkaran." },
      { label: "c.", text: "Hitung persentase luas persegi yang tertutup lingkaran." },
    ],
  }),

  Q(31, "Keliling Bangun Gabungan", {
    type: "essay",
    content: "Bangun terdiri dari persegi panjang 10 cm × 6 cm dengan setengah lingkaran pada setiap sisi pendeknya (d = 6 cm).",
    parts: [
      { label: "a.", text: "Hitung keliling seluruh bangun (dua busur setengah lingkaran + dua sisi panjang)." },
      { label: "b.", text: "Hitung luas seluruh bangun." },
      { label: "c.", text: "Bangun seperti ini disebut apa dalam kehidupan nyata?" },
    ],
  }),

  Q(32, "Daerah yang Diarsir — Juring dan Segitiga", {
    type: "essay",
    content: "Juring OAB dengan sudut 90° dan r = 14 cm. Di dalamnya digambar segitiga siku-siku OAB.",
    parts: [
      { label: "a.", text: "Hitung luas juring OAB." },
      { label: "b.", text: "Hitung luas segitiga siku-siku OAB (siku-siku di O)." },
      { label: "c.", text: "Hitung luas daerah juring di luar segitiga (tembereng dari sisi AB)." },
    ],
  }),

  Q(33, "Soal ANBK — Kain Melingkar", {
    type: "essay",
    content: "Kain berbentuk persegi 56 cm × 56 cm. Dari kain tersebut akan dibuat taplak meja berbentuk lingkaran terbesar.",
    parts: [
      { label: "a.", text: "Tentukan diameter taplak meja." },
      { label: "b.", text: "Hitung luas taplak meja." },
      { label: "c.", text: "Berapa persen kain yang terbuang (tidak terpakai)?" },
    ],
  }),

  Q(34, "Lingkaran Tiga Cincin Olimpik", {
    type: "essay",
    content: "Cincin Olimpiade memiliki 5 lingkaran dengan diameter masing-masing 20 cm. Dua lingkaran di baris bawah disusun saling menyinggung.",
    parts: [
      { label: "a.", text: "Hitung luas satu lingkaran." },
      { label: "b.", text: "Hitung total luas 5 lingkaran." },
      { label: "c.", text: "Jarak antara pusat dua lingkaran yang saling menyinggung adalah berapa cm?" },
    ],
  }),

  Q(35, "Soal TKA — Luas Daerah Diarsir Kompleks", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.62,
      sectors: [
        { startAngle: 0, endAngle: 180, fillColor: "rgba(96,165,250,0.2)", strokeColor: "none" },
        { startAngle: 180, endAngle: 360, fillColor: "rgba(248,113,163,0.2)", strokeColor: "none" },
      ],
      extraCircles: [
        { cx: 115, cy: 82, r: 41, color: "#60a5fa", fill: "rgba(96,165,250,0.15)" },
        { cx: 115, cy: 150, r: 41, color: "#f472b6", fill: "rgba(248,113,163,0.15)" },
      ],
      showCenter: false,
    },
    content: "Lingkaran besar r = R. Di dalamnya dua lingkaran kecil r = R/2 mengisi masing-masing setengah lingkaran.",
    parts: [
      { label: "a.", text: "Berapa luas setengah lingkaran besar?" },
      { label: "b.", text: "Berapa luas dua lingkaran kecil (masing-masing R/2)?" },
      { label: "c.", text: "Adakah hubungan antara luas setengah lingkaran besar dan dua lingkaran kecil?" },
    ],
  }),

  Q(36, "Soal UN — Luas Gabungan dengan π", {
    type: "essay",
    content: "Sebuah lapangan berbentuk persegi panjang 100 m × 64 m. Di tiap ujungnya ada setengah lingkaran (diameter = 64 m).",
    parts: [
      { label: "a.", math: "\\text{Hitung luas persegi panjang (tanpa setengah lingkaran).}" },
      { label: "b.", math: "\\text{Hitung luas dua setengah lingkaran = satu lingkaran penuh. (} \\pi = 3{,}14)" },
      { label: "c.", text: "Hitung total luas lapangan." },
    ],
  }),

  Q(37, "Persegi dengan 4 Irisan Lingkaran di Sudut", {
    type: "essay",
    content: "Persegi sisi 14 cm. Di setiap sudutnya dibuat seperempat lingkaran berjari-jari 7 cm (ke dalam).",
    parts: [
      { label: "a.", text: "Hitung luas satu juring 90° (r = 7 cm)." },
      { label: "b.", text: "Hitung total luas 4 juring (= satu lingkaran penuh)." },
      { label: "c.", text: "Hitung luas daerah yang tersisa di persegi (berbentuk bintang 4 ujung)." },
    ],
  }),

  Q(38, "Soal ANBK — Membandingkan Perimeter", {
    type: "essay",
    content: "Persegi bersisi 22 cm dan lingkaran berdiameter 14 cm.",
    parts: [
      { label: "a.", text: "Hitung keliling persegi." },
      { label: "b.", math: "\\text{Hitung keliling lingkaran. (} \\pi = \\tfrac{22}{7})" },
      { label: "c.", text: "Manakah yang memiliki keliling lebih besar? Berapa perbedaannya?" },
    ],
  }),

  Q(39, "Soal TKA — Kaitan Nilai π", {
    type: "essay",
    content: "Dari jaman ke jaman nilai π diperkirakan berbeda: Archimedes: 3,1416; Zu Chongzhi: 3,14159265.",
    parts: [
      { label: "a.", text: "Gunakan π = 22/7 dan π = 3,14 untuk r = 7 cm. Bandingkan keliling yang didapat." },
      { label: "b.", text: "Mana yang lebih mendekati nilai π asli?" },
      { label: "c.", text: "Mengapa kita sering menggunakan π = 22/7 dalam soal sekolah?" },
    ],
  }),

  Q(40, "Soal ANBK Gabungan — Kaitan Lingkaran dan Bangun Datar", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.62,
      pts: [
        { angle: 90, label: "A", color: "#f472b6" },
        { angle: 210, label: "B", color: "#fb923c" },
        { angle: 330, label: "C", color: "#34d399" },
      ],
      chords: [
        { angle1: 90, angle2: 210, color: "rgba(255,255,255,0.4)" },
        { angle1: 210, angle2: 330, color: "rgba(255,255,255,0.4)" },
        { angle1: 330, angle2: 90, color: "rgba(255,255,255,0.4)" },
      ],
    },
    content: "Segitiga sama sisi ABC berada di dalam lingkaran berjari-jari R.",
    parts: [
      { label: "a.", math: "\\text{Sisi segitiga sama sisi dalam lingkaran} = R\\sqrt{3}. \\text{ Hitung sisi jika } R = 14 \\text{ cm.}" },
      { label: "b.", math: "\\text{Luas segitiga sama sisi} = \\frac{s^2\\sqrt{3}}{4}. \\text{ Hitung luas segitiga.}" },
      { label: "c.", text: "Hitung luas lingkaran dan luas daerah lingkaran di luar segitiga." },
      { label: "d.", text: "Sebutkan hubungan antara lingkaran dan segitiga dalam soal ini!" },
    ],
  }),
];

const KaitanBangunDatarPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            KAITAN LINGKARAN DENGAN BANGUN DATAR
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-2">📐 Rumus Penting</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { n: "Luas Lingkaran", d: "L = πr²", c: "text-cyan-400" },
              { n: "Keliling Lingkaran", d: "K = 2πr", c: "text-blue-400" },
              { n: "Luas Persegi", d: "L = s²", c: "text-yellow-400" },
              { n: "Luas Segitiga", d: "L = ½ × a × t", c: "text-pink-400" },
              { n: "Diagonal Persegi", d: "d = s√2", c: "text-violet-400" },
              { n: "Teorema Pythagoras", d: "c² = a² + b²", c: "text-green-400" },
            ].map(r => (
              <div key={r.n} className="bg-white/5 rounded-lg px-3 py-2">
                <span className={`font-bold ${r.c}`}>{r.n}: </span>
                <span className="text-white/60">{r.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">
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
                            <span className="text-orange-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default KaitanBangunDatarPage;
