import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Ruler } from "lucide-react";
import PythagorasDiagram from "./PythagorasDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };

const accent = "#60a5fa";

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
  {
    n: 1, type: "mixed", title: "Mencari Hipotenusa — Dasar",
    diagram: (
      <PythagorasDiagram
        A={{ x: 60, y: 175, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 60, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "8 cm", color: "#60a5fa", dy: 14 }}
        BC={{ text: "c = ?", color: "#34d399", dx: 12 }}
        CA={{ text: "6 cm", color: "#f472b6", dx: -18 }}
        vw={260} vh={220} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "c^2 = 6^2 + 8^2 = 36 + 64 = ..." },
      { label: "b.", math: "c = \\sqrt{100} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 2, type: "mixed", title: "Mencari Kaki — Hipotenusa Diketahui",
    diagram: (
      <PythagorasDiagram
        A={{ x: 70, y: 175, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 70, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "b = ?", color: "#60a5fa", dy: 14 }}
        BC={{ text: "13 cm", color: "#34d399", dx: 12 }}
        CA={{ text: "5 cm", color: "#f472b6", dx: -18 }}
        vw={260} vh={220} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "b^2 = 13^2 - 5^2 = 169 - 25 = ..." },
      { label: "b.", math: "b = \\sqrt{144} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 3, type: "mixed", title: "Kaki 9 cm dan 12 cm",
    content: "Segitiga siku-siku dengan kaki 9 cm dan 12 cm.",
    parts: [
      { label: "a.", math: "c = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{...}" },
      { label: "b.", math: "c = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 4, type: "mixed", title: "Hipotenusa 25 cm, Kaki 24 cm",
    content: "Segitiga siku-siku dengan hipotenusa 25 cm dan salah satu kaki 24 cm.",
    parts: [
      { label: "a.", math: "a^2 = 25^2 - 24^2 = 625 - 576 = ..." },
      { label: "b.", math: "a = \\sqrt{49} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 5, type: "mixed", title: "Segitiga dengan Kaki 15 dan 20",
    diagram: (
      <PythagorasDiagram
        A={{ x: 55, y: 175, label: "P", labelDy: 14, color: "#facc15" }}
        B={{ x: 210, y: 175, label: "Q", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 55, y: 50, label: "R", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "20 cm", color: "#60a5fa", dy: 14 }}
        BC={{ text: "PQ = ?", color: "#34d399", dx: 12 }}
        CA={{ text: "15 cm", color: "#f472b6", dx: -20 }}
        vw={270} vh={225} size={235}
      />
    ),
    parts: [
      { label: "a.", math: "PQ^2 = PR^2 + RQ^2 = 15^2 + 20^2 = ..." },
      { label: "b.", math: "PQ = \\sqrt{625} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 6, type: "mixed", title: "Kaki dengan Nilai Pecahan",
    content: "Segitiga siku-siku dengan kaki 1,5 cm dan 2 cm.",
    parts: [
      { label: "a.", math: "c^2 = (1{,}5)^2 + 2^2 = 2{,}25 + 4 = ..." },
      { label: "b.", math: "c = \\sqrt{6{,}25} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 7, type: "mixed", title: "Hipotenusa 10 cm, Kaki 6 cm",
    content: "Sebuah segitiga siku-siku memiliki hipotenusa 10 cm dan kaki 6 cm. Tentukan kaki yang lain.",
    parts: [
      { label: "a.", math: "b^2 = 10^2 - 6^2 = 100 - 36 = ..." },
      { label: "b.", math: "b = \\sqrt{64} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 8, type: "mixed", title: "Kaki 7 dan 24",
    content: "Segitiga siku-siku dengan kaki 7 cm dan 24 cm.",
    parts: [
      { label: "a.", math: "c = \\sqrt{7^2 + 24^2} = \\sqrt{49 + 576} = \\sqrt{...}" },
      { label: "b.", math: "c = ...\\ \\text{cm (apakah bilangan bulat?)}" },
    ],
  },
  {
    n: 9, type: "mixed", title: "Sisi Segitiga Sama Kaki Siku-Siku",
    content: "Segitiga sama kaki siku-siku dengan kaki 10 cm.",
    parts: [
      { label: "a.", math: "c = \\sqrt{10^2 + 10^2} = \\sqrt{200} = 10\\sqrt{2}" },
      { label: "b.", math: "c \\approx ...\\ \\text{cm (2 desimal)}" },
    ],
  },
  {
    n: 10, type: "mixed", title: "UN — Tangga Bersandar",
    content: "Sebuah tangga 10 m bersandar pada dinding. Kaki tangga berjarak 6 m dari dinding.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 60, y: 180, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 195, y: 180, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 60, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "6 m", color: "#60a5fa", dy: 14 }}
        BC={{ text: "10 m", color: "#34d399", dx: 12 }}
        CA={{ text: "h = ?", color: "#f472b6", dx: -18 }}
        extras={[{ type: 'text', x: 130, y: 100, text: 'Tangga', color: '#34d399', size: 10 }]}
        vw={255} vh={215} size={225}
      />
    ),
    parts: [
      { label: "a.", math: "h^2 = 10^2 - 6^2 = 100 - 36 = ..." },
      { label: "b.", math: "h = \\sqrt{64} = ...\\ \\text{m}" },
    ],
  },
  {
    n: 11, type: "mixed", title: "Kaki 20 dan 21",
    content: "Segitiga siku-siku dengan kaki-kaki 20 cm dan 21 cm.",
    parts: [
      { label: "a.", math: "c = \\sqrt{20^2 + 21^2} = \\sqrt{400 + 441} = \\sqrt{841}" },
      { label: "b.", math: "c = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 12, type: "mixed", title: "Hitung Kaki dari Persamaan",
    content: "Segitiga siku-siku memiliki hipotenusa 17 cm dan kaki pertama 8 cm.",
    parts: [
      { label: "a.", math: "b^2 = 17^2 - 8^2 = 289 - 64 = ..." },
      { label: "b.", math: "b = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 13, type: "mixed", title: "Kaki 30 dan 40",
    content: "Segitiga siku-siku dengan kaki-kaki 30 cm dan 40 cm. Hitung hipotenusanya.",
    parts: [
      { label: "a.", math: "c = \\sqrt{30^2 + 40^2} = \\sqrt{900 + 1600} = \\sqrt{...}" },
      { label: "b.", math: "c = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 14, type: "mixed", title: "Mencari Kaki dari Triple",
    content: "Segitiga siku-siku dengan hipotenusa 26 cm dan kaki 10 cm.",
    parts: [
      { label: "a.", math: "b^2 = 26^2 - 10^2 = 676 - 100 = ..." },
      { label: "b.", math: "b = \\sqrt{576} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 15, type: "mixed", title: "Diagonal Persegi Panjang",
    content: "Persegi panjang dengan panjang 12 cm dan lebar 5 cm. Hitung panjang diagonalnya.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 45, y: 180, label: "", labelDy: 14, color: "#facc15" }}
        B={{ x: 215, y: 180, label: "", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 45, y: 70, label: "", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "12 cm", color: "#60a5fa", dy: 14 }}
        BC={{ text: "d = ?", color: "#34d399", dx: 10 }}
        CA={{ text: "5 cm", color: "#f472b6", dx: -16 }}
        extras={[
          { type: 'line', x1: 215, y1: 70, x2: 215, y2: 180, color: 'rgba(255,255,255,0.3)' },
          { type: 'line', x1: 45, y1: 70, x2: 215, y2: 70, color: 'rgba(255,255,255,0.3)' },
        ]}
        vw={265} vh={225} size={235}
      />
    ),
    parts: [
      { label: "a.", math: "d^2 = 12^2 + 5^2 = 144 + 25 = ..." },
      { label: "b.", math: "d = \\sqrt{169} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 16, type: "mixed", title: "Kaki dengan Ekspresi Aljabar",
    content: "Segitiga siku-siku dengan kaki-kaki (2x) cm dan (x) cm. Hipotenusa 15 cm.",
    parts: [
      { label: "a.", math: "15^2 = (2x)^2 + x^2" },
      { label: "b.", math: "225 = 5x^2" },
      { label: "c.", math: "x = \\sqrt{45} = 3\\sqrt{5} \\approx ...\\ \\text{cm}" },
    ],
  },
  {
    n: 17, type: "mixed", title: "Kaki 11 dan 60",
    content: "Segitiga siku-siku dengan kaki 11 cm dan 60 cm.",
    parts: [
      { label: "a.", math: "c = \\sqrt{11^2 + 60^2} = \\sqrt{121 + 3600} = \\sqrt{3721}" },
      { label: "b.", math: "c = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 18, type: "mixed", title: "Kaki 28 dan 45",
    content: "Tentukan hipotenusa segitiga siku-siku dengan kaki 28 cm dan 45 cm.",
    parts: [
      { label: "a.", math: "c^2 = 28^2 + 45^2 = 784 + 2025 = ..." },
      { label: "b.", math: "c = \\sqrt{2809} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 19, type: "mixed", title: "Hipotenusa dengan Akar",
    content: "Segitiga siku-siku dengan kaki 3 cm dan 7 cm.",
    parts: [
      { label: "a.", math: "c^2 = 3^2 + 7^2 = 9 + 49 = 58" },
      { label: "b.", math: "c = \\sqrt{58} \\approx ...\\ \\text{cm (2 desimal)}" },
    ],
  },
  {
    n: 20, type: "mixed", title: "Panjang Sisi Segitiga",
    content: "Segitiga ABC siku-siku di A. AB = 16 cm, AC = 12 cm.",
    parts: [
      { label: "a.", math: "BC^2 = AB^2 + AC^2 = 16^2 + 12^2 = ..." },
      { label: "b.", math: "BC = \\sqrt{400} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 21, type: "mixed", title: "Tinggi Segitiga Sama Kaki",
    content: "Segitiga sama kaki dengan sisi 13 cm dan alas 10 cm. Hitung tingginya dengan Pythagoras.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 130, y: 55, label: "A", labelDy: -12, color: "#facc15" }}
        B={{ x: 50, y: 180, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 210, y: 180, label: "C", labelDy: 14, color: "#f472b6" }}
        rightAngleAt="B"
        AB={{ text: "13 cm", color: "#34d399", dx: -14 }}
        BC={{ text: "5 cm", color: "#60a5fa", dy: 14 }}
        CA={{ text: "13 cm", color: "#a78bfa", dx: 14 }}
        extras={[
          { type: 'line', x1: 130, y1: 55, x2: 130, y2: 180, color: '#facc15', dashed: true, label: 'h', lx: 10, ly: -5 },
          { type: 'text', x: 90, y: 180, text: '← 5 cm →', color: '#60a5fa', size: 9 },
        ]}
        vw={265} vh={225} size={235}
      />
    ),
    parts: [
      { label: "a.", text: "Garis tinggi membagi alas menjadi dua bagian sama. Berapa panjang tiap bagian?" },
      { label: "b.", math: "h^2 = 13^2 - 5^2 = 169 - 25 = ..." },
      { label: "c.", math: "h = \\sqrt{144} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 22, type: "mixed", title: "Kaki dari Hipotenusa √50",
    content: "Segitiga siku-siku sama kaki dengan hipotenusa √50 cm.",
    parts: [
      { label: "a.", math: "a^2 + a^2 = (\\sqrt{50})^2 = 50" },
      { label: "b.", math: "2a^2 = 50 \\Rightarrow a^2 = 25 \\Rightarrow a = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 23, type: "mixed", title: "TKA — Persegi ABCD",
    content: "Persegi ABCD dengan sisi 7 cm. Hitung panjang diagonal AC.",
    parts: [
      { label: "a.", math: "AC^2 = AB^2 + BC^2 = 7^2 + 7^2 = 98" },
      { label: "b.", math: "AC = \\sqrt{98} = 7\\sqrt{2} \\approx ...\\ \\text{cm}" },
    ],
  },
  {
    n: 24, type: "mixed", title: "Kaki 3,6 cm dan 4,8 cm",
    content: "Segitiga siku-siku dengan kaki 3,6 cm dan 4,8 cm.",
    parts: [
      { label: "a.", math: "c^2 = (3{,}6)^2 + (4{,}8)^2 = 12{,}96 + 23{,}04 = 36" },
      { label: "b.", math: "c = \\sqrt{36} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 25, type: "mixed", title: "Kaki 2√3 dan 2",
    content: "Segitiga siku-siku dengan kaki 2√3 cm dan 2 cm.",
    parts: [
      { label: "a.", math: "c^2 = (2\\sqrt{3})^2 + 2^2 = 12 + 4 = ..." },
      { label: "b.", math: "c = \\sqrt{16} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 26, type: "mixed", title: "Kaki Aljabar — Tentukan x",
    content: "Segitiga siku-siku dengan kaki (x+2) cm dan kaki (x−2) cm, hipotenusa 10 cm.",
    parts: [
      { label: "a.", math: "(x+2)^2 + (x-2)^2 = 10^2" },
      { label: "b.", math: "x^2+4x+4 + x^2-4x+4 = 100" },
      { label: "c.", math: "2x^2 + 8 = 100 \\Rightarrow x^2 = 46 \\Rightarrow x = ..." },
    ],
  },
  {
    n: 27, type: "mixed", title: "Sisi Tidak Diketahui dalam Trapesium",
    content: "Trapesium siku-siku ABCD dengan AB = 10 cm (alas), CD = 6 cm (atas), dan AD = 5 cm (sisi tegak lurus alas).",
    parts: [
      { label: "a.", text: "Gambarkan trapesium dan tentukan segitiga siku-siku yang terbentuk." },
      { label: "b.", math: "BC = \\sqrt{(10-6)^2 + 5^2} = \\sqrt{16+25} = \\sqrt{41}" },
      { label: "c.", math: "BC \\approx ...\\ \\text{cm}" },
    ],
  },
  {
    n: 28, type: "mixed", title: "Kaki 45 dan 28",
    content: "Tentukan hipotenusa segitiga siku-siku dengan kaki 45 cm dan 28 cm.",
    parts: [
      { label: "a.", math: "c^2 = 45^2 + 28^2 = 2025 + 784 = ..." },
      { label: "b.", math: "c = \\sqrt{2809} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 29, type: "mixed", title: "UN — Diagonal Belah Ketupat",
    content: "Belah ketupat dengan diagonal 24 cm dan 10 cm. Hitung panjang sisinya.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 130, y: 55, label: "", labelDy: -12, color: "#facc15" }}
        B={{ x: 215, y: 135, label: "", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 130, y: 135, label: "", labelDy: 14, color: "#f472b6" }}
        rightAngleAt="C"
        AB={{ text: "s = ?", color: "#34d399", dx: 14 }}
        BC={{ text: "5 cm", color: "#60a5fa", dy: 12 }}
        CA={{ text: "12 cm", color: "#f472b6", dx: -16 }}
        extras={[
          { type: 'text', x: 130, y: 30, text: 'Setengah diagonal', color: 'rgba(255,255,255,0.4)', size: 9 },
        ]}
        vw={260} vh={200} size={225}
      />
    ),
    parts: [
      { label: "a.", text: "Diagonal saling berpotongan tegak lurus. Setengah diagonal = 12 cm dan 5 cm." },
      { label: "b.", math: "s^2 = 12^2 + 5^2 = 144 + 25 = 169" },
      { label: "c.", math: "s = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 30, type: "mixed", title: "Kaki 1 dan √3",
    content: "Segitiga siku-siku dengan kaki 1 cm dan √3 cm.",
    parts: [
      { label: "a.", math: "c^2 = 1^2 + (\\sqrt{3})^2 = 1 + 3 = 4" },
      { label: "b.", math: "c = \\sqrt{4} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 31, type: "mixed", title: "Hipotenusa 2√2, Kaki Sama",
    content: "Segitiga siku-siku sama kaki dengan hipotenusa 2√2 cm.",
    parts: [
      { label: "a.", math: "a^2 + a^2 = (2\\sqrt{2})^2 = 8" },
      { label: "b.", math: "2a^2 = 8 \\Rightarrow a = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 32, type: "mixed", title: "TKA — Lingkaran dalam Segitiga",
    content: "Segitiga siku-siku dengan kaki 6 cm dan 8 cm. Hitung panjang sisi miring.",
    parts: [
      { label: "a.", math: "c = \\sqrt{6^2 + 8^2} = \\sqrt{100} = ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Keliling segitiga} = 6 + 8 + 10 = ...\\ \\text{cm}" },
      { label: "c.", math: "\\text{Luas segitiga} = \\frac{1}{2} \\times 6 \\times 8 = ...\\ \\text{cm}^2" },
    ],
  },
  {
    n: 33, type: "mixed", title: "Panjang Kaki dengan Hipotenusa √200",
    content: "Segitiga siku-siku sama kaki dengan hipotenusa √200 cm.",
    parts: [
      { label: "a.", math: "2a^2 = 200 \\Rightarrow a^2 = 100" },
      { label: "b.", math: "a = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 34, type: "mixed", title: "Hitung Kaki Ketiga",
    content: "Diketahui tiga ukuran. Temukan sisi yang hilang:",
    parts: [
      { label: "a.", math: "a = 10,\\ c = 26,\\ b = ?" },
      { label: "b.", math: "a = 18,\\ b = 24,\\ c = ?" },
      { label: "c.", math: "b = 40,\\ c = 41,\\ a = ?" },
    ],
  },
  {
    n: 35, type: "mixed", title: "ANBK — Kaki Aljabar",
    content: "Segitiga siku-siku dengan kaki (3k) dan (4k) cm.",
    parts: [
      { label: "a.", math: "c = \\sqrt{(3k)^2 + (4k)^2} = \\sqrt{9k^2 + 16k^2} = \\sqrt{25k^2}" },
      { label: "b.", math: "c = 5k \\text{ cm}" },
      { label: "c.", text: "Jika k = 4, berapa panjang kaki-kaki dan hipotenusanya?" },
    ],
  },
  {
    n: 36, type: "mixed", title: "Tinggi dalam Segitiga Sama Sisi",
    content: "Segitiga sama sisi dengan sisi 10 cm. Hitung tingginya menggunakan Pythagoras.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 130, y: 50, label: "A", labelDy: -12, color: "#facc15" }}
        B={{ x: 55, y: 180, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 205, y: 180, label: "C", labelDy: 14, color: "#f472b6" }}
        rightAngleAt="B"
        AB={{ text: "10 cm", color: "#34d399", dx: -14 }}
        BC={{ text: "5 cm", color: "#60a5fa", dy: 14 }}
        CA={{ text: "10 cm", color: "#a78bfa", dx: 14 }}
        extras={[
          { type: 'line', x1: 130, y1: 50, x2: 130, y2: 180, color: '#facc15', dashed: true, label: 'h', lx: 10, ly: -5 },
        ]}
        vw={265} vh={225} size={235}
      />
    ),
    parts: [
      { label: "a.", text: "Garis tinggi membagi alas menjadi 5 cm dan 5 cm." },
      { label: "b.", math: "h^2 = 10^2 - 5^2 = 100 - 25 = 75" },
      { label: "c.", math: "h = \\sqrt{75} = 5\\sqrt{3} \\approx ...\\ \\text{cm}" },
    ],
  },
  {
    n: 37, type: "mixed", title: "Sisi dari Luas dan Keliling",
    content: "Segitiga siku-siku dengan luas 60 cm² dan salah satu kaki 12 cm. Tentukan hipotenusa.",
    parts: [
      { label: "a.", math: "\\text{Luas} = \\frac{1}{2} \\times 12 \\times b = 60 \\Rightarrow b = ...\\ \\text{cm}" },
      { label: "b.", math: "c = \\sqrt{12^2 + b^2} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 38, type: "mixed", title: "ANBK — Panjang Sisi",
    content: "Pilih nilai c yang benar untuk segitiga siku-siku dengan kaki 8 cm dan 15 cm:",
    parts: [
      { label: "(A)", math: "c = 17 \\text{ cm}" },
      { label: "(B)", math: "c = 23 \\text{ cm}" },
      { label: "(C)", math: "c = 13 \\text{ cm}" },
      { label: "(D)", math: "c = 15 \\text{ cm}" },
      { label: "→", text: "Tunjukkan penghitungan lengkap untuk pilihan yang benar!" },
    ],
  },
  {
    n: 39, type: "mixed", title: "Kaki dari Hipotenusa dan Selisih",
    content: "Hipotenusa segitiga siku-siku adalah 25 cm. Selisih kedua kaki adalah 7 cm.",
    parts: [
      { label: "a.", math: "\\text{Misalkan kaki } a \\text{ dan } b, \\text{ dengan } a - b = 7 \\text{ dan } a^2 + b^2 = 625." },
      { label: "b.", math: "a = b + 7 \\Rightarrow (b+7)^2 + b^2 = 625" },
      { label: "c.", math: "2b^2 + 14b + 49 = 625 \\Rightarrow b = ...,\\ a = ..." },
    ],
  },
  {
    n: 40, type: "mixed", title: "Soal UN — Gabungan",
    content: "Segitiga siku-siku KLM dengan sudut siku-siku di L. KL = (x+1) cm, LM = (x−1) cm, KM = (x+3) cm.",
    parts: [
      { label: "a.", math: "KM^2 = KL^2 + LM^2" },
      { label: "b.", math: "(x+3)^2 = (x+1)^2 + (x-1)^2" },
      { label: "c.", math: "x^2+6x+9 = x^2+2x+1+x^2-2x+1" },
      { label: "d.", math: "x^2 - 6x - 7 = 0 \\Rightarrow x = ..." },
    ],
  },
];

const MenghitungPanjangPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ruler className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #60a5fa88' }}>
            MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU
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

export default MenghitungPanjangPage;
