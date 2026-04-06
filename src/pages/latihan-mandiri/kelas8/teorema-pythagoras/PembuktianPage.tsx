import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { FlaskConical } from "lucide-react";
import PythagorasDiagram from "./PythagorasDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed" | "diagram-only";
};

const accent = "#a78bfa";

const badge = (label: string, color: string) => (
  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 uppercase tracking-wider"
    style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>{label}</span>
);

const questions: Q[] = [
  {
    n: 1, type: "mixed", title: "Luas Daerah pada Pembuktian",
    diagram: (
      <PythagorasDiagram
        A={{ x: 130, y: 180, label: "C", labelDx: 0, labelDy: 14, color: "#facc15" }}
        B={{ x: 40, y: 55, label: "A", labelDx: -5, labelDy: -10, color: "#60a5fa" }}
        C={{ x: 130, y: 55, label: "B", labelDx: 5, labelDy: -10, color: "#f472b6" }}
        rightAngleAt="C"
        AB={{ text: "c", color: "#34d399", dy: -6 }}
        BC={{ text: "a", color: "#f472b6", dx: 12, dy: 0 }}
        CA={{ text: "b", color: "#60a5fa", dy: 6 }}
        extras={[
          { type: 'rect', x: 10, y: 55, w: 30, h: 30, fill: 'rgba(96,165,250,0.15)', stroke: '#60a5fa' },
          { type: 'text', x: 25, y: 70, text: 'b²', color: '#60a5fa', size: 9 },
          { type: 'rect', x: 130, y: 55, w: 125, h: 125, fill: 'rgba(52,211,153,0.1)', stroke: '#34d399' },
          { type: 'text', x: 192, y: 117, text: 'c²', color: '#34d399', size: 11 },
          { type: 'rect', x: 130, y: 180, w: 90, h: 90, fill: 'rgba(244,114,182,0.1)', stroke: '#f472b6' },
          { type: 'text', x: 175, y: 225, text: 'a²', color: '#f472b6', size: 10 },
        ]}
        vw={270} vh={280} size={240}
        title="Segitiga siku-siku dengan persegi pada setiap sisinya"
      />
    ),
    parts: [
      { label: "a.", text: "Sebutkan nama sisi miring (hipotenusa) pada segitiga ABC di atas." },
      { label: "b.", math: "\\text{Apa hubungan antara luas } a^2,\\ b^2, \\text{ dan } c^2?" },
      { label: "c.", math: "\\text{Tuliskan persamaan Teorema Pythagoras:}\\ a^2 + b^2 = ..." },
    ],
  },
  {
    n: 2, type: "mixed", title: "Verifikasi Teorema dengan Bilangan Konkret",
    content: "Perhatikan segitiga dengan sisi-sisi 3 cm, 4 cm, dan 5 cm.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 50, y: 170, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 170, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 50, y: 50, label: "C", labelDy: -10, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "4 cm", color: "#60a5fa", dy: 14 }}
        BC={{ text: "5 cm", color: "#34d399", dx: 8 }}
        CA={{ text: "3 cm", color: "#f472b6", dx: -14 }}
        vw={260} vh={220} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "\\text{Hitung } 3^2 + 4^2." },
      { label: "b.", math: "\\text{Hitung } 5^2." },
      { label: "c.", text: "Apakah 3²+ 4² = 5²? Simpulkan apakah segitiga ini siku-siku!" },
    ],
  },
  {
    n: 3, type: "mixed", title: "Pembuktian dengan Diseksi Persegi",
    content: "Sebuah persegi besar berukuran (a+b) × (a+b) disusun dari 4 segitiga siku-siku dan 1 persegi kecil.",
    parts: [
      { label: "a.", math: "\\text{Tuliskan rumus luas persegi besar: } L_{besar} = (a+b)^2 = ..." },
      { label: "b.", math: "\\text{Luas 4 segitiga siku-siku} = 4 \\times \\frac{1}{2}ab = ..." },
      { label: "c.", math: "\\text{Luas persegi kecil di tengah} = L_{besar} - 4 \\times \\frac{1}{2}ab" },
      { label: "d.", text: "Sisi persegi kecil di tengah adalah c (hipotenusa). Simpulkan hubungannya!" },
    ],
  },
  {
    n: 4, type: "mixed", title: "Pembuktian Garfield (Presiden AS)",
    content: "Pembuktian Garfield menggunakan trapesium siku-siku. Trapesium memiliki dua sisi sejajar a dan b.",
    parts: [
      { label: "a.", math: "\\text{Luas trapesium} = \\frac{1}{2}(a+b)(a+b) = \\frac{(a+b)^2}{2}" },
      { label: "b.", math: "\\text{Luas trapesium} = 2 \\times \\frac{1}{2}ab + \\frac{1}{2}c^2" },
      { label: "c.", text: "Samakan kedua ekspresi luas untuk membuktikan a² + b² = c²." },
    ],
  },
  {
    n: 5, type: "mixed", title: "Persegi pada Sisi Segitiga Siku-Siku",
    diagram: (
      <PythagorasDiagram
        A={{ x: 80, y: 160, label: "P", labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 160, label: "Q", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 80, y: 80, label: "R", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "p", color: "#60a5fa", dy: 14 }}
        BC={{ text: "r", color: "#34d399", dx: 10 }}
        CA={{ text: "q", color: "#f472b6", dx: -12 }}
        extras={[
          { type: 'text', x: 130, y: 105, text: 'r² = p² + q²', color: '#34d399', size: 11, bold: true },
        ]}
        vw={260} vh={210} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "\\text{Jika } p = 6 \\text{ cm dan } q = 8 \\text{ cm, hitung } r." },
      { label: "b.", math: "\\text{Jika } p = 5 \\text{ cm dan } r = 13 \\text{ cm, hitung } q." },
      { label: "c.", text: "Tuliskan Teorema Pythagoras dalam bentuk segitiga PQR ini." },
    ],
  },
  {
    n: 6, type: "mixed", title: "Kebalikan Teorema Pythagoras",
    content: "Kebalikan Teorema Pythagoras menyatakan: Jika a² + b² = c², maka segitiga adalah siku-siku.",
    parts: [
      { label: "a.", math: "\\text{Cek apakah segitiga dengan sisi } 6, 8, 10 \\text{ siku-siku.}" },
      { label: "b.", math: "\\text{Cek apakah segitiga dengan sisi } 5, 7, 9 \\text{ siku-siku.}" },
      { label: "c.", math: "\\text{Cek apakah segitiga dengan sisi } 9, 12, 15 \\text{ siku-siku.}" },
    ],
  },
  {
    n: 7, type: "mixed", title: "Luas Persegi pada Sisi",
    content: "Segitiga siku-siku memiliki kaki-kaki 5 cm dan 12 cm.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 80, y: 170, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 170, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 80, y: 50, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "5 cm", color: "#60a5fa", dy: 14 }}
        BC={{ text: "c", color: "#34d399", dx: 12 }}
        CA={{ text: "12 cm", color: "#f472b6", dx: -18 }}
        vw={260} vh={220} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "\\text{Hitung luas persegi pada sisi AB (kaki 1)}" },
      { label: "b.", math: "\\text{Hitung luas persegi pada sisi AC (kaki 2)}" },
      { label: "c.", math: "\\text{Hitung luas persegi pada sisi BC (hipotenusa): } c^2 = 5^2 + 12^2" },
      { label: "d.", math: "\\text{Tentukan panjang } c." },
    ],
  },
  {
    n: 8, type: "mixed", title: "Pembuktian dengan Grid Kotak",
    content: "Pada kertas berkotak, gambar segitiga siku-siku dengan kaki 3 satuan dan 4 satuan. Hitung luas masing-masing persegi.",
    parts: [
      { label: "a.", math: "\\text{Luas persegi pada kaki pertama} = 3^2 = ..." },
      { label: "b.", math: "\\text{Luas persegi pada kaki kedua} = 4^2 = ..." },
      { label: "c.", math: "\\text{Luas persegi pada hipotenusa} = 3^2 + 4^2 = ..." },
      { label: "d.", text: "Apa yang dapat kamu simpulkan dari hasil di atas?" },
    ],
  },
  {
    n: 9, type: "mixed", title: "Pembuktian Bhaskara (India)",
    content: "Bhaskara membagi persegi berukuran c × c menjadi 4 segitiga siku-siku dan 1 persegi kecil (a−b) × (a−b).",
    parts: [
      { label: "a.", math: "\\text{Luas 4 segitiga} = 4 \\times \\frac{1}{2}ab = 2ab" },
      { label: "b.", math: "\\text{Luas persegi kecil} = (a-b)^2 = a^2 - 2ab + b^2" },
      { label: "c.", math: "c^2 = 2ab + (a-b)^2 = ..." },
      { label: "d.", text: "Sederhanakan dan buktikan c² = a² + b²." },
    ],
  },
  {
    n: 10, type: "mixed", title: "Teorema Pythagoras pada Koordinat",
    content: "Titik A(0,0), B(4,0), C(0,3) membentuk segitiga.",
    parts: [
      { label: "a.", text: "Di titik mana sudut siku-siku terbentuk?" },
      { label: "b.", math: "\\text{Panjang AB} = 4, \\text{ AC} = 3.\\text{ Hitung BC.}" },
      { label: "c.", math: "\\text{Verifikasi: } BC^2 = AB^2 + AC^2" },
    ],
  },
  {
    n: 11, type: "mixed", title: "Membuat Segitiga Siku-Siku dari Tali",
    content: "Sebuah tali sepanjang 12 m akan dibentuk menjadi segitiga siku-siku dengan perbandingan sisi 3 : 4 : 5.",
    parts: [
      { label: "a.", text: "Berapa panjang masing-masing sisi segitiga tersebut?" },
      { label: "b.", math: "\\text{Verifikasi bahwa } 3^2 + 4^2 = 5^2." },
      { label: "c.", text: "Mengapa metode ini digunakan oleh ahli bangunan Mesir kuno?" },
    ],
  },
  {
    n: 12, type: "mixed", title: "Teorema Pythagoras dalam Bentuk Umum",
    content: "Teorema Pythagoras dapat dituliskan dalam tiga bentuk berbeda.",
    parts: [
      { label: "a.", math: "c^2 = a^2 + b^2" },
      { label: "b.", math: "a^2 = c^2 - b^2" },
      { label: "c.", math: "b^2 = c^2 - a^2" },
      { label: "d.", text: "Kapan kamu menggunakan bentuk (b) dan kapan menggunakan bentuk (c)?" },
    ],
  },
  {
    n: 13, type: "mixed", title: "Verifikasi dengan Luas Persegi",
    content: "Segitiga siku-siku dengan kaki 8 cm dan 15 cm.",
    parts: [
      { label: "a.", math: "a^2 = 8^2 = \\ldots" },
      { label: "b.", math: "b^2 = 15^2 = \\ldots" },
      { label: "c.", math: "c^2 = a^2 + b^2 = \\ldots" },
      { label: "d.", math: "c = \\sqrt{c^2} = \\ldots \\text{ cm}" },
    ],
  },
  {
    n: 14, type: "mixed", title: "Pembuktian Visual — Tiga Bangun",
    content: "Tiga persegi dibangun pada setiap sisi segitiga siku-siku. Diketahui luas persegi pada dua kaki adalah 16 cm² dan 9 cm².",
    parts: [
      { label: "a.", text: "Berapa luas persegi yang dibangun pada hipotenusa?" },
      { label: "b.", text: "Berapa panjang hipotenusa?" },
      { label: "c.", math: "\\text{Berapa panjang masing-masing kaki segitiga?}" },
    ],
  },
  {
    n: 15, type: "mixed", title: "Melengkapi Pembuktian",
    content: "Lengkapi langkah-langkah pembuktian berikut:",
    parts: [
      { label: "Langkah 1:", math: "\\text{Luas persegi besar} = (a+b)^2 = a^2 + 2ab + b^2" },
      { label: "Langkah 2:", math: "\\text{Luas 4 segitiga} = 4 \\cdot \\frac{1}{2}ab = ..." },
      { label: "Langkah 3:", math: "\\text{Luas persegi kecil} = c^2 = (a+b)^2 - 2ab = ..." },
      { label: "Kesimpulan:", math: "c^2 = ..." },
    ],
  },
  {
    n: 16, type: "mixed", title: "ANBK — Pernyataan Benar/Salah",
    content: "Tentukan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", math: "\\text{Pada segitiga siku-siku, berlaku } a^2 + b^2 = c^2 \\text{ di mana } c \\text{ adalah hipotenusa.}" },
      { label: "(2)", text: "Teorema Pythagoras hanya berlaku untuk segitiga sama kaki." },
      { label: "(3)", math: "\\text{Jika } a^2 + b^2 = c^2, \\text{ maka segitiga pasti siku-siku.}" },
      { label: "(4)", text: "Hipotenusa adalah sisi terpanjang pada segitiga siku-siku." },
    ],
  },
  {
    n: 17, type: "mixed", title: "Luas Persegi pada Hipotenusa",
    content: "Sebuah persegi dibangun pada hipotenusa segitiga siku-siku. Diketahui kaki-kaki segitiga adalah 7 cm dan 24 cm.",
    parts: [
      { label: "a.", math: "c^2 = 7^2 + 24^2 = ..." },
      { label: "b.", math: "c = \\sqrt{625} = ..." },
      { label: "c.", text: "Berapa luas persegi yang dibangun pada hipotenusa tersebut?" },
    ],
  },
  {
    n: 18, type: "mixed", title: "Teorema Pythagoras pada Jajaran Genjang",
    content: "Pada jajaran genjang ABCD dengan AB = 10 cm, BC = 8 cm, dan sudut B = 90°.",
    parts: [
      { label: "a.", text: "Gambarlah diagonal AC dan tuliskan rumus untuk menghitungnya." },
      { label: "b.", math: "AC^2 = AB^2 + BC^2 = ..." },
      { label: "c.", math: "AC = \\ldots \\text{ cm}" },
    ],
  },
  {
    n: 19, type: "mixed", title: "Sisi-Sisi Segitiga dan Teorema Pythagoras",
    content: "Diberikan tiga bilangan. Tentukan apakah dapat membentuk segitiga siku-siku:",
    parts: [
      { label: "a.", math: "\\{5,\\ 12,\\ 13\\}" },
      { label: "b.", math: "\\{7,\\ 24,\\ 25\\}" },
      { label: "c.", math: "\\{2,\\ 3,\\ 4\\}" },
      { label: "d.", math: "\\{8,\\ 15,\\ 17\\}" },
    ],
  },
  {
    n: 20, type: "mixed", title: "Pembuktian Euclid",
    content: "Euclid membuktikan Teorema Pythagoras menggunakan luas persegi dan segitiga yang kongruen. Diketahui segitiga ABC dengan sudut siku-siku di C.",
    parts: [
      { label: "a.", text: "Sebutkan sisi miring (hipotenusa) segitiga ABC." },
      { label: "b.", math: "\\text{Nyatakan hubungan: } AB^2 = AC^2 + BC^2" },
      { label: "c.", text: "Jika AC = 5 cm dan BC = 12 cm, tentukan AB." },
    ],
  },
  {
    n: 21, type: "mixed", title: "Segitiga Siku-Siku dalam Persegi",
    diagram: (
      <PythagorasDiagram
        A={{ x: 60, y: 60, label: "A", labelDy: -12, color: "#60a5fa" }}
        B={{ x: 200, y: 60, label: "B", labelDy: -12, color: "#f472b6" }}
        C={{ x: 200, y: 170, label: "C", labelDy: 14, color: "#34d399" }}
        rightAngleAt="B"
        AB={{ text: "12 cm", color: "#60a5fa", dy: -12 }}
        BC={{ text: "9 cm", color: "#f472b6", dx: 14 }}
        CA={{ text: "?", color: "#34d399", dx: -8, dy: 6 }}
        extras={[
          { type: 'text', x: 130, y: 120, text: 'c = ?', color: '#facc15', size: 12, bold: true },
        ]}
        vw={260} vh={220} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "c^2 = 12^2 + 9^2 = ..." },
      { label: "b.", math: "c = \\sqrt{225} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah ini termasuk triple Pythagoras yang umum? Jelaskan!" },
    ],
  },
  {
    n: 22, type: "mixed", title: "Identifikasi Komponen Teorema",
    content: "Pada sebuah segitiga siku-siku, hipotenusanya adalah sisi yang berhadapan dengan sudut siku-siku.",
    parts: [
      { label: "a.", text: "Jika sudut siku-siku berada di titik R dalam segitiga PQR, tentukan hipotenusanya." },
      { label: "b.", math: "\\text{Tuliskan Teorema Pythagoras untuk segitiga PQR tersebut.}" },
      { label: "c.", text: "Jika PQ = 20 cm dan PR = 15 cm, tentukan QR." },
    ],
  },
  {
    n: 23, type: "mixed", title: "Luas Daerah — Cara Lain Pembuktian",
    content: "Persegi dengan sisi c dibagi menjadi 4 segitiga siku-siku (kaki a dan b) dan persegi kecil.",
    parts: [
      { label: "a.", math: "\\text{Sisi persegi kecil} = b - a \\text{ (asumsi } b > a\\text{)}" },
      { label: "b.", math: "c^2 = 4 \\times \\frac{1}{2}ab + (b-a)^2" },
      { label: "c.", math: "= 2ab + b^2 - 2ab + a^2 = ..." },
      { label: "d.", text: "Apa yang terbukti dari langkah-langkah di atas?" },
    ],
  },
  {
    n: 24, type: "mixed", title: "Aplikasi Kebalikan Teorema Pythagoras",
    content: "Seorang arsitek memeriksa apakah sudut bangunan benar-benar 90°. Ia mengukur tiga titik dengan jarak 9 m, 12 m, dan 15 m.",
    parts: [
      { label: "a.", math: "9^2 + 12^2 = ..." },
      { label: "b.", math: "15^2 = ..." },
      { label: "c.", text: "Apakah sudut bangunan tersebut benar-benar 90°? Jelaskan!" },
    ],
  },
  {
    n: 25, type: "mixed", title: "Bilangan Irrasional dalam Pythagoras",
    content: "Segitiga siku-siku dengan kaki 1 cm dan 1 cm.",
    parts: [
      { label: "a.", math: "c^2 = 1^2 + 1^2 = ..." },
      { label: "b.", math: "c = \\sqrt{2} \\approx \\ldots \\text{ cm (2 desimal)}" },
      { label: "c.", text: "Apakah √2 merupakan bilangan rasional atau irrasional? Jelaskan!" },
    ],
  },
  {
    n: 26, type: "mixed", title: "Pembuktian dengan Kesebangunan Segitiga",
    content: "Pada segitiga siku-siku ABC dengan sudut siku-siku di C, garis CD tegak lurus AB (D pada AB).",
    parts: [
      { label: "a.", text: "Tunjukkan bahwa segitiga ACD sebangun dengan segitiga ABC." },
      { label: "b.", math: "\\frac{AC}{AB} = \\frac{AD}{AC} \\Rightarrow AC^2 = AB \\cdot AD" },
      { label: "c.", math: "\\frac{BC}{AB} = \\frac{BD}{BC} \\Rightarrow BC^2 = AB \\cdot BD" },
      { label: "d.", math: "AC^2 + BC^2 = AB(AD + BD) = AB \\cdot AB = AB^2" },
    ],
  },
  {
    n: 27, type: "mixed", title: "Menentukan Sudut Siku-Siku",
    content: "Segitiga XYZ memiliki sisi XY = 10 cm, YZ = 24 cm, XZ = 26 cm.",
    parts: [
      { label: "a.", math: "\\text{Cek: } XY^2 + YZ^2 = 10^2 + 24^2 = ..." },
      { label: "b.", math: "XZ^2 = 26^2 = ..." },
      { label: "c.", text: "Di titik mana sudut siku-siku berada? Jelaskan!" },
    ],
  },
  {
    n: 28, type: "mixed", title: "Persamaan Pythagoras — Isi yang Hilang",
    content: "Lengkapi tabel berikut (kaki a, kaki b, hipotenusa c):",
    parts: [
      { label: "(i)", math: "a = 6,\\ b = 8,\\ c = ?" },
      { label: "(ii)", math: "a = 5,\\ b = ?,\\ c = 13" },
      { label: "(iii)", math: "a = ?,\\ b = 24,\\ c = 25" },
      { label: "(iv)", math: "a = 20,\\ b = 21,\\ c = ?" },
    ],
  },
  {
    n: 29, type: "mixed", title: "Persegi Terlukis pada Sisi",
    content: "Tiga persegi digambar pada sisi-sisi segitiga siku-siku. Luas dua persegi yang lebih kecil masing-masing 49 cm² dan 576 cm².",
    parts: [
      { label: "a.", text: "Berapa panjang kaki-kaki segitiga tersebut?" },
      { label: "b.", text: "Berapa luas persegi yang terlukis pada hipotenusa?" },
      { label: "c.", text: "Berapa panjang hipotenusa?" },
    ],
  },
  {
    n: 30, type: "mixed", title: "Pembuktian untuk Siswa",
    content: "Seorang siswa menyatakan: 'Jika kuadrat sisi terpanjang sama dengan jumlah kuadrat dua sisi lainnya, maka segitiga itu siku-siku.' Uji pernyataan ini dengan:",
    parts: [
      { label: "a.", math: "\\text{Segitiga dengan sisi } 7, 24, 25" },
      { label: "b.", math: "\\text{Segitiga dengan sisi } 11, 60, 61" },
      { label: "c.", math: "\\text{Segitiga dengan sisi } 4, 5, 6" },
    ],
  },
  {
    n: 31, type: "mixed", title: "ANBK — Pilihan Benar",
    content: "Pilih semua pernyataan yang BENAR tentang Teorema Pythagoras:",
    parts: [
      { label: "(A)", text: "Teorema Pythagoras hanya berlaku untuk segitiga yang semua sudutnya 60°." },
      { label: "(B)", text: "Hipotenusa selalu merupakan sisi terpanjang." },
      { label: "(C)", math: "a^2 + b^2 = c^2 \\text{ di mana } a, b \\text{ adalah kaki dan } c \\text{ hipotenusa}" },
      { label: "(D)", text: "Semua segitiga berlaku Teorema Pythagoras." },
    ],
  },
  {
    n: 32, type: "mixed", title: "Pembuktian dengan Trigonometri Dasar",
    content: "Pada segitiga siku-siku, diketahui sudut siku-siku di C, AC = b, BC = a, AB = c.",
    parts: [
      { label: "a.", math: "\\sin A = \\frac{a}{c},\\ \\cos A = \\frac{b}{c}" },
      { label: "b.", math: "\\sin^2 A + \\cos^2 A = \\frac{a^2}{c^2} + \\frac{b^2}{c^2} = \\frac{a^2 + b^2}{c^2} = 1" },
      { label: "c.", text: "Apa yang terbukti dari identitas trigonometri sin²A + cos²A = 1?" },
    ],
  },
  {
    n: 33, type: "mixed", title: "Luas Bangun dari Pythagoras",
    content: "Segitiga siku-siku memiliki kaki 6 cm dan 8 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung hipotenusa: } c = \\sqrt{6^2 + 8^2} = ..." },
      { label: "b.", math: "\\text{Hitung luas segitiga: } L = \\frac{1}{2} \\times 6 \\times 8 = ..." },
      { label: "c.", math: "\\text{Hitung keliling segitiga: } K = 6 + 8 + c = ..." },
    ],
  },
  {
    n: 34, type: "mixed", title: "Mencari Sisi yang Hilang dengan Pembuktian",
    content: "Diberikan persamaan c² = a² + b². Tentukan nilai yang tidak diketahui:",
    parts: [
      { label: "a.", math: "c^2 = 9^2 + 40^2 = ..." },
      { label: "b.", math: "c = \\sqrt{1681} = ..." },
      { label: "c.", text: "Apakah 9, 40, 41 merupakan triple Pythagoras?" },
    ],
  },
  {
    n: 35, type: "mixed", title: "Pembuktian Pythagoras Historis",
    content: "Bangsa Babilonia (3000 SM) sudah mengetahui tripel Pythagoras seperti 3-4-5 dan 5-12-13 jauh sebelum Pythagoras.",
    parts: [
      { label: "a.", math: "\\text{Verifikasi: } 3^2 + 4^2 = 5^2" },
      { label: "b.", math: "\\text{Verifikasi: } 5^2 + 12^2 = 13^2" },
      { label: "c.", text: "Mengapa ini disebut 'Triple Pythagoras' meskipun bangsa Babilonia sudah mengetahuinya lebih dulu?" },
    ],
  },
  {
    n: 36, type: "mixed", title: "Luas Persegi yang Terkait",
    content: "Diketahui dua persegi: persegi P dengan sisi 5 cm dan persegi Q dengan sisi 12 cm.",
    parts: [
      { label: "a.", math: "L_P = 5^2 = ...\\ \\text{cm}^2" },
      { label: "b.", math: "L_Q = 12^2 = ...\\ \\text{cm}^2" },
      { label: "c.", math: "L_P + L_Q = ... = c^2. \\text{ Tentukan } c." },
      { label: "d.", text: "Bentuk segitiga apa yang memiliki kaki 5 cm dan 12 cm serta hipotenusa c?" },
    ],
  },
  {
    n: 37, type: "mixed", title: "Teorema Pythagoras — Kata-Kata Ilmiah",
    content: "Teorema Pythagoras menyatakan bahwa dalam suatu segitiga siku-siku, kuadrat panjang sisi miring sama dengan jumlah kuadrat panjang dua sisi lainnya.",
    parts: [
      { label: "a.", text: "Tuliskan teorema ini dalam bentuk rumus matematika." },
      { label: "b.", text: "Sebutkan nama sisi miring dalam bahasa Inggris." },
      { label: "c.", math: "\\text{Jika kaki-kaki adalah } a \\text{ dan } b, \\text{ tulis rumus untuk hipotenusa } c." },
    ],
  },
  {
    n: 38, type: "mixed", title: "Pembuktian dengan Model Konkret",
    content: "Sebuah papan kayu berbentuk persegi panjang dengan ukuran 6 cm × 8 cm. Diagonal papan tersebut ditarik.",
    parts: [
      { label: "a.", text: "Berapa panjang diagonal papan tersebut?" },
      { label: "b.", math: "d = \\sqrt{6^2 + 8^2} = \\sqrt{...} = ...\\ \\text{cm}" },
      { label: "c.", text: "Apakah ini menggunakan Teorema Pythagoras? Jelaskan sudut siku-sikunnya!" },
    ],
  },
  {
    n: 39, type: "mixed", title: "Hubungan Hipotenusa dan Kaki",
    content: "Seorang siswa mengatakan: 'Hipotenusa = jumlah dua kaki'. Benarkah pernyataan ini?",
    parts: [
      { label: "a.", math: "\\text{Jika } a = 3, b = 4, \\text{ apakah } c = 3 + 4 = 7?" },
      { label: "b.", math: "\\text{Hitung dengan rumus benar: } c = \\sqrt{3^2+4^2} = ..." },
      { label: "c.", text: "Mengapa pernyataan siswa tersebut SALAH? Jelaskan!" },
    ],
  },
  {
    n: 40, type: "mixed", title: "Soal UN — Pembuktian",
    content: "Segitiga KLM siku-siku di L. Diketahui KL = (2x) cm dan LM = (x+3) cm. Jika KM = 15 cm, tentukan nilai x.",
    parts: [
      { label: "a.", math: "KM^2 = KL^2 + LM^2" },
      { label: "b.", math: "15^2 = (2x)^2 + (x+3)^2" },
      { label: "c.", math: "225 = 4x^2 + x^2 + 6x + 9" },
      { label: "d.", math: "5x^2 + 6x - 216 = 0 \\text{ — Selesaikan untuk } x!" },
    ],
  },
];

const renderPart = (p: Part, i: number) => (
  <div key={i} className="flex gap-2 items-start">
    <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: accent }}>{p.label}</span>
    <div className="text-sm text-white/85 font-body leading-relaxed">
      {p.math ? <InlineMath math={p.math} /> : p.text}
    </div>
  </div>
);

const PembuktianPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FlaskConical className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #a78bfa88' }}>
            PEMBUKTIAN TEOREMA PYTHAGORAS
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
            <div key={q.n}
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'rgba(10,15,40,0.85)', borderColor: `${accent}33`, boxShadow: `0 0 12px ${accent}11` }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: `${accent}22`, background: `${accent}11` }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0"
                  style={{ background: `${accent}22`, color: accent, border: `1.5px solid ${accent}55` }}>{q.n}</span>
                <span className="text-sm font-bold text-white/90 font-display">{q.title}</span>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.diagram && <div className="flex justify-center my-1">{q.diagram}</div>}
                {q.content && (
                  <p className="text-sm text-white/80 font-body leading-relaxed">{q.content}</p>
                )}
                {q.math && (
                  <div className="text-sm text-white/90"><BlockMath math={q.math} /></div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1 pl-2 border-l-2" style={{ borderColor: `${accent}44` }}>
                    {q.parts.map(renderPart)}
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

export default PembuktianPage;
