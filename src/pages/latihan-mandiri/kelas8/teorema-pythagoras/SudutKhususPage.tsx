import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Compass } from "lucide-react";
import PythagorasDiagram from "./PythagorasDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };

const accent = "#f472b6";

const badge = (label: string, color: string) => (
  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 uppercase tracking-wider"
    style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>{label}</span>
);

const rp = (p: Part, i: number) => (
  <div key={i} className="flex gap-2 items-start">
    <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: accent }}>{p.label}</span>
    <div className="text-sm text-white/85 font-body leading-relaxed">
      {p.math ? <InlineMath math={p.math} /> : p.text}
    </div>
  </div>
);

const questions: Q[] = [
  { n: 1, type: "mixed", title: "Perbandingan Sisi 45°-45°-90°",
    diagram: (
      <PythagorasDiagram
        A={{ x: 65, y: 175, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 65, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "a", color: "#60a5fa", dy: 14 }}
        BC={{ text: "a√2", color: "#34d399", dx: 14 }}
        CA={{ text: "a", color: "#f472b6", dx: -14 }}
        extras={[
          { type: 'text', x: 80, y: 105, text: '45°', color: '#facc15', size: 11, bold: true },
          { type: 'text', x: 155, y: 175, text: '45°', color: '#facc15', size: 11, bold: true },
          { type: 'text', x: 65, y: 135, text: '90°', color: '#facc15', size: 10 },
        ]}
        vw={260} vh={220} size={230}
      />
    ),
    content: "Pada segitiga siku-siku sama kaki (45°-45°-90°), jika kaki = a, maka:",
    parts: [
      { label: "Kaki 1:", math: "= a" },
      { label: "Kaki 2:", math: "= a" },
      { label: "Hipotenusa:", math: "= a\\sqrt{2}" },
      { label: "Cek:", math: "a^2 + a^2 = 2a^2 = (a\\sqrt{2})^2\\ \\checkmark" },
    ],
  },
  { n: 2, type: "mixed", title: "Perbandingan Sisi 30°-60°-90°",
    diagram: (
      <PythagorasDiagram
        A={{ x: 65, y: 175, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 65, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "a√3", color: "#60a5fa", dy: 14 }}
        BC={{ text: "2a", color: "#34d399", dx: 14 }}
        CA={{ text: "a", color: "#f472b6", dx: -14 }}
        extras={[
          { type: 'text', x: 82, y: 90, text: '60°', color: '#facc15', size: 11, bold: true },
          { type: 'text', x: 160, y: 168, text: '30°', color: '#facc15', size: 11, bold: true },
          { type: 'text', x: 65, y: 135, text: '90°', color: '#facc15', size: 10 },
        ]}
        vw={260} vh={220} size={230}
      />
    ),
    content: "Pada segitiga 30°-60°-90°, jika sisi terpendek = a:",
    parts: [
      { label: "Sisi depan 30°:", math: "= a" },
      { label: "Sisi depan 60°:", math: "= a\\sqrt{3}" },
      { label: "Hipotenusa (depan 90°):", math: "= 2a" },
    ],
  },
  { n: 3, type: "mixed", title: "45°-45°-90° — Kaki 5 cm",
    content: "Segitiga siku-siku sama kaki dengan kaki 5 cm.",
    parts: [
      { label: "a.", math: "\\text{Hipotenusa} = 5\\sqrt{2} \\approx ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Verifikasi: } 5^2 + 5^2 = 50 = (5\\sqrt{2})^2\\ \\checkmark" },
    ],
  },
  { n: 4, type: "mixed", title: "45°-45°-90° — Hipotenusa 8√2 cm",
    content: "Segitiga 45°-45°-90° dengan hipotenusa 8√2 cm.",
    parts: [
      { label: "a.", math: "a\\sqrt{2} = 8\\sqrt{2} \\Rightarrow a = ...\\ \\text{cm}" },
      { label: "b.", text: "Jadi panjang kaki segitiga tersebut adalah ..." },
    ],
  },
  { n: 5, type: "mixed", title: "30°-60°-90° — Sisi Terpendek 4 cm",
    content: "Segitiga 30°-60°-90° dengan sisi terpendek 4 cm.",
    parts: [
      { label: "a.", math: "\\text{Sisi depan 60°} = 4\\sqrt{3} \\approx ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Hipotenusa} = 2 \\times 4 = ...\\ \\text{cm}" },
    ],
  },
  { n: 6, type: "mixed", title: "30°-60°-90° — Hipotenusa 10 cm",
    content: "Segitiga 30°-60°-90° dengan hipotenusa 10 cm.",
    parts: [
      { label: "a.", math: "\\text{Sisi terpendek (depan 30°)} = \\frac{10}{2} = ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Sisi depan 60°} = 5\\sqrt{3} \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 7, type: "mixed", title: "45°-45°-90° — Kaki 10 cm",
    content: "Hitunglah hipotenusa segitiga siku-siku sama kaki dengan kaki 10 cm.",
    parts: [
      { label: "a.", math: "c = 10\\sqrt{2}" },
      { label: "b.", math: "c \\approx ...\\ \\text{cm (2 desimal)}" },
    ],
  },
  { n: 8, type: "mixed", title: "30°-60°-90° — Sisi Depan 60° = 6√3",
    content: "Segitiga 30°-60°-90° dengan sisi depan sudut 60° = 6√3 cm.",
    parts: [
      { label: "a.", math: "a\\sqrt{3} = 6\\sqrt{3} \\Rightarrow a = ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Hipotenusa} = 2a = ...\\ \\text{cm}" },
    ],
  },
  { n: 9, type: "mixed", title: "UN — Diagonal Persegi",
    content: "Persegi dengan sisi 6 cm. Tentukan panjang diagonal menggunakan sifat 45°-45°-90°.",
    parts: [
      { label: "a.", math: "d = 6\\sqrt{2} \\approx ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Verifikasi: } d^2 = 6^2 + 6^2 = 72 = (6\\sqrt{2})^2\\ \\checkmark" },
    ],
  },
  { n: 10, type: "mixed", title: "Tinggi Segitiga Sama Sisi (30°-60°-90°)",
    diagram: (
      <PythagorasDiagram
        A={{ x: 130, y: 50, label: "A", labelDy: -12, color: "#facc15" }}
        B={{ x: 55, y: 185, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 205, y: 185, label: "C", labelDy: 14, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "10 cm", color: "#34d399", dx: -14 }}
        BC={{ text: "10 cm", color: "#60a5fa", dy: 14 }}
        CA={{ text: "10 cm", color: "#a78bfa", dx: 14 }}
        extras={[
          { type: 'line', x1: 130, y1: 50, x2: 130, y2: 185, color: '#facc15', dashed: true, label: 't', lx: 10, ly: -5 },
          { type: 'text', x: 90, y: 185, text: '← 5 cm →', color: '#60a5fa', size: 9 },
        ]}
        vw={265} vh={225} size={235}
      />
    ),
    content: "Segitiga sama sisi dengan sisi 10 cm. Garis tinggi membagi segitiga menjadi dua segitiga 30°-60°-90°.",
    parts: [
      { label: "a.", math: "t = \\frac{10\\sqrt{3}}{2} = 5\\sqrt{3} \\approx ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Verifikasi: } t^2 + 5^2 = 75 + 25 = 100 = 10^2\\ \\checkmark" },
    ],
  },
  { n: 11, type: "mixed", title: "45°-45°-90° — Hipotenusa 12 cm",
    content: "Segitiga siku-siku sama kaki dengan hipotenusa 12 cm.",
    parts: [
      { label: "a.", math: "a = \\frac{12}{\\sqrt{2}} = \\frac{12\\sqrt{2}}{2} = 6\\sqrt{2} \\approx ...\\ \\text{cm}" },
      { label: "b.", text: "Panjang kaki segitiga tersebut adalah ..." },
    ],
  },
  { n: 12, type: "mixed", title: "30°-60°-90° — Sisi Depan 30° = 7",
    content: "Segitiga 30°-60°-90° dengan sisi depan sudut 30° = 7 cm.",
    parts: [
      { label: "a.", math: "\\text{Sisi depan 60°} = 7\\sqrt{3} \\approx ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Hipotenusa} = 2 \\times 7 = ...\\ \\text{cm}" },
    ],
  },
  { n: 13, type: "mixed", title: "Mencari Sudut dari Perbandingan Sisi",
    content: "Segitiga siku-siku memiliki kaki-kaki dalam perbandingan 1 : √3.",
    parts: [
      { label: "a.", text: "Sudut apa saja yang terbentuk pada segitiga ini?" },
      { label: "b.", math: "\\text{Jika kaki terpendek} = 5\\ \\text{cm, hipotenusa} = ..." },
      { label: "c.", math: "\\text{Kaki yang lebih panjang} = 5\\sqrt{3} \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 14, type: "mixed", title: "TKA — Segitiga 45°-45°-90°, Kaki 3√2",
    content: "Segitiga 45°-45°-90° dengan kaki 3√2 cm.",
    parts: [
      { label: "a.", math: "\\text{Hipotenusa} = 3\\sqrt{2} \\times \\sqrt{2} = 3 \\times 2 = ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Luas segitiga} = \\frac{1}{2}(3\\sqrt{2})^2 = \\frac{1}{2} \\times 18 = ...\\ \\text{cm}^2" },
    ],
  },
  { n: 15, type: "mixed", title: "30°-60°-90° — Hipotenusa 14 cm",
    content: "Segitiga 30°-60°-90° dengan hipotenusa 14 cm.",
    parts: [
      { label: "a.", math: "\\text{Sisi terpendek} = \\frac{14}{2} = ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Sisi depan 60°} = 7\\sqrt{3} \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 16, type: "mixed", title: "ANBK — Benar/Salah Sudut Khusus",
    content: "Tentukan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", math: "\\text{Pada segitiga 45°-45°-90°, hipotenusa} = a\\sqrt{2}" },
      { label: "(2)", math: "\\text{Pada segitiga 30°-60°-90°, sisi depan 90° adalah yang terpanjang.}" },
      { label: "(3)", math: "\\text{Perbandingan sisi 30°-60°-90° adalah } 1 : \\sqrt{3} : 2" },
      { label: "(4)", math: "\\text{Perbandingan sisi 45°-45°-90° adalah } 1 : 1 : \\sqrt{3}" },
    ],
  },
  { n: 17, type: "mixed", title: "Luas Segitiga Sudut Khusus",
    content: "Segitiga 30°-60°-90° dengan sisi terpendek 6 cm.",
    parts: [
      { label: "a.", math: "\\text{Kaki ke-2} = 6\\sqrt{3}\\  \\text{cm},\\quad \\text{Hipotenusa} = 12\\ \\text{cm}" },
      { label: "b.", math: "\\text{Luas} = \\frac{1}{2} \\times 6 \\times 6\\sqrt{3} = 18\\sqrt{3} \\approx ...\\ \\text{cm}^2" },
    ],
  },
  { n: 18, type: "mixed", title: "UN — Diagonal Persegi Panjang dengan 45°",
    content: "Diagonal persegi panjang membagi sudut pojok menjadi 45°. Artinya persegi panjang itu adalah persegi. Tentukan panjang diagonal jika sisi = 9 cm.",
    parts: [
      { label: "a.", math: "d = 9\\sqrt{2} \\approx ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Luas persegi} = 9^2 = ...\\ \\text{cm}^2" },
    ],
  },
  { n: 19, type: "mixed", title: "Menentukan Kaki dari Hipotenusa — 45°",
    content: "Segitiga 45°-45°-90° dengan hipotenusa 10 cm.",
    parts: [
      { label: "a.", math: "a = \\frac{10}{\\sqrt{2}} = \\frac{10\\sqrt{2}}{2} = 5\\sqrt{2}" },
      { label: "b.", math: "a \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 20, type: "mixed", title: "Menentukan Kaki dari Hipotenusa — 30°",
    content: "Segitiga 30°-60°-90° dengan hipotenusa 20 cm.",
    parts: [
      { label: "a.", math: "\\text{Sisi terpendek (depan 30°)} = \\frac{20}{2} = ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Sisi depan 60°} = 10\\sqrt{3} \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 21, type: "mixed", title: "Perbandingan dalam Soal Cerita — Tangga 60°",
    content: "Tangga 8 m disandarkan ke dinding membentuk sudut 60° dengan tanah.",
    parts: [
      { label: "a.", text: "Ini adalah segitiga 30°-60°-90°. Hipotenusa = 8 m." },
      { label: "b.", math: "\\text{Jarak kaki tangga dari dinding (depan 30°)} = \\frac{8}{2} = ...\\ \\text{m}" },
      { label: "c.", math: "\\text{Tinggi tangga di dinding (depan 60°)} = 4\\sqrt{3} \\approx ...\\ \\text{m}" },
    ],
  },
  { n: 22, type: "mixed", title: "45°-45°-90° — Kaki 1 cm (Diagonal Unit Persegi)",
    content: "Persegi satuan (sisi 1 cm). Hitunglah panjang diagonalnya.",
    parts: [
      { label: "a.", math: "d = 1 \\times \\sqrt{2} = \\sqrt{2} \\approx 1{,}41\\ \\text{cm}" },
      { label: "b.", text: "Ini adalah asal mula ditemukannya bilangan irasional √2 oleh orang Yunani." },
    ],
  },
  { n: 23, type: "mixed", title: "TKA — Sisi Depan 60° = 9√3",
    content: "Segitiga 30°-60°-90°, sisi depan sudut 60° = 9√3 cm.",
    parts: [
      { label: "a.", math: "a\\sqrt{3} = 9\\sqrt{3} \\Rightarrow a = ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Hipotenusa} = 2 \\times 9 = ...\\ \\text{cm}" },
    ],
  },
  { n: 24, type: "mixed", title: "Keliling Segitiga Sudut Khusus",
    content: "Segitiga 45°-45°-90° dengan kaki 7 cm.",
    parts: [
      { label: "a.", math: "\\text{Hipotenusa} = 7\\sqrt{2}\\ \\text{cm}" },
      { label: "b.", math: "\\text{Keliling} = 7 + 7 + 7\\sqrt{2} = 14 + 7\\sqrt{2} \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 25, type: "mixed", title: "Keliling Segitiga 30°-60°-90°",
    content: "Segitiga 30°-60°-90° dengan sisi terpendek 5 cm.",
    parts: [
      { label: "a.", math: "\\text{Tiga sisi: } 5,\\ 5\\sqrt{3},\\ 10\\ \\text{cm}" },
      { label: "b.", math: "\\text{Keliling} = 5 + 5\\sqrt{3} + 10 = 15 + 5\\sqrt{3} \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 26, type: "mixed", title: "ANBK — Pilih yang Tepat",
    content: "Pada segitiga 45°-45°-90° dengan hipotenusa 6√2 cm. Panjang kaki adalah:",
    parts: [
      { label: "(A)", math: "3\\ \\text{cm}" },
      { label: "(B)", math: "6\\ \\text{cm}" },
      { label: "(C)", math: "3\\sqrt{2}\\ \\text{cm}" },
      { label: "(D)", math: "6\\sqrt{2}\\ \\text{cm}" },
      { label: "→", text: "Tunjukkan caramu mendapatkan jawaban!" },
    ],
  },
  { n: 27, type: "mixed", title: "Mengidentifikasi Jenis dari Perbandingan",
    content: "Segitiga siku-siku dengan sisi dalam perbandingan:",
    parts: [
      { label: "a.", math: "1 : 1 : \\sqrt{2} \\Rightarrow \\text{segitiga } ..." },
      { label: "b.", math: "1 : \\sqrt{3} : 2 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 28, type: "mixed", title: "Luas Belah Ketupat dari 45°",
    content: "Belah ketupat dengan diagonal yang membentuk sudut 45° di atas dan 90° pada perpotongan, dengan sisi 8 cm.",
    parts: [
      { label: "a.", text: "Diagonal terpendek pada belah ketupat dengan sudut 90° pada pojok: hitung setengah diagonal." },
      { label: "b.", math: "d_1 = 8\\sqrt{2} \\approx ...\\ \\text{cm (diagonal panjang)}" },
      { label: "c.", math: "\\text{Luas} = \\frac{1}{2} d_1 d_2" },
    ],
  },
  { n: 29, type: "mixed", title: "30°-60°-90° dalam Segi Enam Beraturan",
    content: "Segi enam beraturan terdiri dari 6 segitiga sama sisi. Setiap segitiga dibagi oleh garis tinggi menjadi dua segitiga 30°-60°-90°.",
    parts: [
      { label: "a.", math: "\\text{Jika sisi segi enam} = 10\\ \\text{cm, tinggi segitiga} = 5\\sqrt{3}\\ \\text{cm}" },
      { label: "b.", math: "\\text{Luas satu segitiga sama sisi} = \\frac{1}{2}\\times 10 \\times 5\\sqrt{3} = 25\\sqrt{3}\\ \\text{cm}^2" },
      { label: "c.", math: "\\text{Luas segi enam} = 6 \\times 25\\sqrt{3} = 150\\sqrt{3} \\approx ...\\ \\text{cm}^2" },
    ],
  },
  { n: 30, type: "mixed", title: "UN — Tinggi Tiang dari 30°",
    content: "Seutas tali dari puncak tiang ke tanah membentuk sudut 30° dengan tiang. Panjang tali = 12 m.",
    parts: [
      { label: "a.", text: "Tali = hipotenusa, tiang = sisi depan 60°, jarak ke tanah = sisi depan 30°." },
      { label: "b.", math: "\\text{Tinggi tiang} = 12 \\times \\frac{\\sqrt{3}}{2} = 6\\sqrt{3} \\approx ...\\ \\text{m}" },
      { label: "c.", math: "\\text{Jarak kaki tali dari tiang} = 12 \\times \\frac{1}{2} = ...\\ \\text{m}" },
    ],
  },
  { n: 31, type: "mixed", title: "Segitiga 45° dalam Kehidupan",
    content: "Sebuah meja miring memiliki sisi alas dan sisi tegak yang sama panjang (2 m). Hitung panjang sisi miringnya.",
    parts: [
      { label: "a.", math: "c = 2\\sqrt{2} \\approx ...\\ \\text{m}" },
      { label: "b.", text: "Sudut yang terbentuk pada setiap ujung alas adalah ..." },
    ],
  },
  { n: 32, type: "mixed", title: "TKA — Perbandingan Sisi",
    content: "Tentukan perbandingan sisi-sisi segitiga berikut:",
    parts: [
      { label: "a.", math: "\\text{Segitiga 45°-45°-90°}: ...\\ :\\ ...\\ :\\ ..." },
      { label: "b.", math: "\\text{Segitiga 30°-60°-90°}: ...\\ :\\ ...\\ :\\ ..." },
    ],
  },
  { n: 33, type: "mixed", title: "Mencari Semua Sisi — 30°-60°-90°",
    content: "Segitiga 30°-60°-90° dengan sisi depan sudut 60° = 12 cm.",
    parts: [
      { label: "a.", math: "a\\sqrt{3} = 12 \\Rightarrow a = \\frac{12}{\\sqrt{3}} = 4\\sqrt{3}\\ \\text{cm}" },
      { label: "b.", math: "\\text{Hipotenusa} = 2a = 8\\sqrt{3} \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 34, type: "mixed", title: "Luas Segitiga Siku-Siku Sama Kaki",
    content: "Segitiga 45°-45°-90° dengan hipotenusa 14 cm.",
    parts: [
      { label: "a.", math: "a = \\frac{14}{\\sqrt{2}} = 7\\sqrt{2}\\ \\text{cm}" },
      { label: "b.", math: "\\text{Luas} = \\frac{1}{2} \\times 7\\sqrt{2} \\times 7\\sqrt{2} = \\frac{1}{2} \\times 98 = ...\\ \\text{cm}^2" },
    ],
  },
  { n: 35, type: "mixed", title: "ANBK — Menghitung Sisi",
    content: "Segitiga 30°-60°-90°. Jika hipotenusa = 18 cm, maka:",
    parts: [
      { label: "a.", math: "\\text{Sisi terpendek} = \\frac{18}{2} = ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Sisi menengah} = 9\\sqrt{3} \\approx ...\\ \\text{cm}" },
      { label: "c.", math: "\\text{Keliling} = 9 + 9\\sqrt{3} + 18 = 27 + 9\\sqrt{3} \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 36, type: "mixed", title: "Sisi Segitiga dari Rasio",
    content: "Segitiga siku-siku ABC dengan sudut A = 45° dan BC = 8 cm (hipotenusa).",
    parts: [
      { label: "a.", math: "AB = AC = \\frac{8}{\\sqrt{2}} = 4\\sqrt{2} \\approx ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Luas} = \\frac{1}{2}(4\\sqrt{2})^2 = \\frac{1}{2} \\times 32 = ...\\ \\text{cm}^2" },
    ],
  },
  { n: 37, type: "mixed", title: "UN — Menara dengan Sudut 30°",
    content: "Dari titik berjarak 20 m dari kaki menara, sudut elevasi puncak menara adalah 60°. Hitung tinggi menara.",
    parts: [
      { label: "a.", text: "Ini segitiga 30°-60°-90°. Sisi depan 30° = 20 m (jarak mendatar)." },
      { label: "b.", math: "\\text{Tinggi menara (depan 60°)} = 20\\sqrt{3} \\approx ...\\ \\text{m}" },
      { label: "c.", math: "\\text{Hipotenusa} = 2 \\times 20 = ...\\ \\text{m}" },
    ],
  },
  { n: 38, type: "mixed", title: "Segitiga 45° — Keliling",
    content: "Segitiga siku-siku sama kaki dengan keliling (14 + 7√2) cm.",
    parts: [
      { label: "a.", math: "K = a + a + a\\sqrt{2} = 2a + a\\sqrt{2} = 14 + 7\\sqrt{2}" },
      { label: "b.", math: "a(2+\\sqrt{2}) = 14 + 7\\sqrt{2} = 7(2+\\sqrt{2}) \\Rightarrow a = ...\\ \\text{cm}" },
    ],
  },
  { n: 39, type: "mixed", title: "Gabungan Segitiga Sudut Khusus",
    content: "Sebuah segitiga ABC dengan AB = 10 cm, sudut B = 90°, sudut A = 45°.",
    parts: [
      { label: "a.", math: "\\text{Karena sudut A=45° dan B=90°, sudut C=45°.}" },
      { label: "b.", math: "BC = AB = 10\\ \\text{cm (segitiga siku-siku sama kaki)}" },
      { label: "c.", math: "AC = 10\\sqrt{2} \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 40, type: "mixed", title: "Soal UN — Sudut Khusus",
    content: "Segitiga PQR siku-siku di Q. Sudut P = 30°. PQ = 12 cm. Tentukan QR dan PR.",
    parts: [
      { label: "a.", text: "Sudut P = 30°, sudut R = 60°. PQ berhadapan dengan sudut R (60°)." },
      { label: "b.", math: "\\text{Karena PQ depan 60°: PQ} = a\\sqrt{3} = 12 \\Rightarrow a = \\frac{12}{\\sqrt{3}} = 4\\sqrt{3}" },
      { label: "c.", math: "QR = 4\\sqrt{3}\\ \\text{cm (depan 30°)},\\quad PR = 2 \\times 4\\sqrt{3} = 8\\sqrt{3}\\ \\text{cm (hipotenusa)}" },
    ],
  },
];

const SudutKhususPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #f472b688' }}>
            PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS
          </h1>
        </div>
        <p className="text-white/40 text-xs text-center mb-1 font-body">Kelas 8 · Latihan Mandiri · 40 Soal</p>
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {badge("UN/USBN", "#34d399")}
          {badge("ANBK", "#60a5fa")}
          {badge("TKA", "#f472b6")}
        </div>
        <div className="flex flex-col gap-5">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl border overflow-hidden"
              style={{ background: 'rgba(10,15,40,0.85)', borderColor: `${accent}33`, boxShadow: `0 0 12px ${accent}11` }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: `${accent}22`, background: `${accent}11` }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0"
                  style={{ background: `${accent}22`, color: accent, border: `1.5px solid ${accent}55` }}>{q.n}</span>
                <span className="text-sm font-bold text-white/90 font-display">{q.title}</span>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.diagram && <div className="flex justify-center my-1">{q.diagram}</div>}
                {q.content && <p className="text-sm text-white/80 font-body leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-sm text-white/90"><BlockMath math={q.math} /></div>}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1 pl-2 border-l-2" style={{ borderColor: `${accent}44` }}>
                    {q.parts.map(rp)}
                  </div>
                )}
                <div className="mt-2 rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span className="text-white/30 text-xs font-body">Jawaban:</span>
                  <div className="flex-1 border-b border-dashed border-white/10 min-h-[18px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/teorema-pythagoras"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Teorema Pythagoras
          </button>
        </div>
      </div>
    </div>
  );
};

export default SudutKhususPage;
