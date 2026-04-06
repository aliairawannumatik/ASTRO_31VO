import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Ruler } from "lucide-react";
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
  Qn(1, "Rumus Dasar Panjang Garis Singgung", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="tangent-right-angle" size={220} />,
    mathContent: "PT = \\sqrt{OP^2 - r^2}",
    parts: [
      { label: "a.", text: "Sebutkan nama teorema yang digunakan dalam rumus di atas." },
      { label: "b.", math: "\\text{Jika } OP = 10, r = 6, \\text{ hitung } PT" },
      { label: "c.", math: "\\text{Jika } OP = 25, r = 7, \\text{ hitung } PT" },
    ],
  }),
  Qn(2, "Menghitung PT – Soal Dasar 1", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="tangent-right-angle" size={220} color="#34d399" />,
    content: "Jari-jari lingkaran = 5 cm. Titik P berjarak 13 cm dari pusat O.",
    parts: [
      { label: "a.", math: "PT^2 = OP^2 - r^2 = 13^2 - 5^2 = \\ldots" },
      { label: "b.", math: "PT = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah ini merupakan triple Pythagoras? Sebutkan tripletnya." },
    ],
  }),
  Qn(3, "Menghitung PT – Soal Dasar 2", {
    difficulty: "Mudah",
    content: "Lingkaran berpusat O berjari-jari 8 cm. Titik P berjarak 17 cm dari O.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{17^2 - 8^2} = \\sqrt{289 - 64} = \\sqrt{\\ldots}" },
      { label: "b.", math: "PT = \\ldots \\text{ cm}" },
      { label: "c.", text: "Verifikasi: apakah 8² + 15² = 17²?" },
    ],
  }),
  Qn(4, "Menghitung PT – Soal Dasar 3", {
    difficulty: "Mudah",
    content: "Jari-jari lingkaran 24 cm. Jarak pusat ke titik P = 25 cm.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{25^2 - 24^2} = \\sqrt{625 - 576} = \\sqrt{\\ldots} = \\ldots" },
      { label: "b.", math: "PT = \\ldots \\text{ cm}" },
      { label: "c.", text: "Sebutkan triple Pythagoras yang digunakan." },
    ],
  }),
  Qn(5, "Mencari Jari-Jari", {
    difficulty: "Sedang",
    content: "Panjang garis singgung dari titik P ke lingkaran O adalah 15 cm. Jarak OP = 17 cm.",
    parts: [
      { label: "a.", math: "r^2 = OP^2 - PT^2 = 17^2 - 15^2 = \\ldots" },
      { label: "b.", math: "r = \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah segitiga OTP termasuk segitiga siku-siku istimewa?" },
    ],
  }),
  Qn(6, "Mencari Jarak OP", {
    difficulty: "Sedang",
    content: "Jari-jari lingkaran 6 cm. Panjang garis singgung PT = 8 cm.",
    parts: [
      { label: "a.", math: "OP = \\sqrt{PT^2 + r^2} = \\sqrt{8^2 + 6^2} = \\sqrt{\\ldots} = \\ldots" },
      { label: "b.", math: "OP = \\ldots \\text{ cm}" },
      { label: "c.", text: "Sebutkan triple Pythagoras yang berlaku di sini." },
    ],
  }),
  Qn(7, "Panjang Garis Singgung – PT dari Akar", {
    difficulty: "Mudah",
    content: "Lingkaran berpusat O berjari-jari 9 cm. P berjarak 15 cm dari O.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{15^2 - 9^2} = \\sqrt{225 - 81} = \\sqrt{144} = \\ldots" },
      { label: "b.", math: "PT = \\ldots \\text{ cm}" },
      { label: "c.", text: "Hitung luas segitiga OTP." },
    ],
  }),
  Qn(8, "Garis Singgung – Soal Cerita (Tiang Listrik)", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-external-point" size={220} />,
    content: "Seutas kawat diikat dari tiang ke titik singgung di tanki minyak berbentuk silinder. Radius tanki 3 m, jarak tiang dari pusat tanki 5 m.",
    parts: [
      { label: "a.", math: "\\text{Panjang kawat} = \\sqrt{5^2 - 3^2} = \\sqrt{\\ldots} = \\ldots \\text{ m}" },
      { label: "b.", text: "Apakah kawat tersebut merupakan garis singgung lingkaran? Jelaskan." },
      { label: "c.", text: "Sudut antara kawat dan jari-jari tanki di titik singgung adalah berapa derajat?" },
    ],
  }),
  Qn(9, "Dua Garis Singgung – Panjang Sama", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="tangent-two" size={220} />,
    content: "Dari titik P di luar lingkaran O berjari-jari 12 cm, ditarik PA dan PB. OP = 20 cm.",
    parts: [
      { label: "a.", math: "PA = \\sqrt{20^2 - 12^2} = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
      { label: "b.", math: "PB = \\ldots \\text{ cm (mengapa sama dengan PA?)}" },
      { label: "c.", text: "Hitung keliling segiempat OABP (A dan B adalah titik singgung)." },
    ],
  }),
  Qn(10, "Garis Singgung – UN 2019", {
    difficulty: "Sedang",
    content: "Titik P berjarak 26 cm dari pusat lingkaran berjari-jari 10 cm. Garis singgung PT ditarik dari P.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{26^2 - 10^2} = \\sqrt{676 - 100} = \\sqrt{576} = \\ldots" },
      { label: "b.", math: "PT = \\ldots \\text{ cm}" },
      { label: "c.", text: "Tentukan sin, cos, dan tan dari ∠TPO." },
    ],
  }),
  Qn(11, "Panjang Garis Singgung – Pecahan", {
    difficulty: "Sedang",
    content: "Jari-jari lingkaran 2,4 dm. Titik P berjarak 2,6 dm dari pusat O.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{(2{,}6)^2 - (2{,}4)^2} = \\sqrt{6{,}76 - 5{,}76} = \\sqrt{\\ldots}" },
      { label: "b.", math: "PT = \\ldots \\text{ dm}" },
      { label: "c.", text: "Konversi ke cm: PT = ... cm." },
    ],
  }),
  Qn(12, "Luas Segitiga dari Garis Singgung", {
    difficulty: "Sedang",
    content: "PT adalah garis singgung lingkaran O. OT = 9 cm, PT = 12 cm.",
    parts: [
      { label: "a.", math: "OP = \\sqrt{9^2 + 12^2} = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
      { label: "b.", math: "\\text{Luas } \\triangle OTP = \\frac{1}{2} \\times OT \\times PT = \\frac{1}{2} \\times 9 \\times 12 = \\ldots \\text{ cm}^2" },
      { label: "c.", text: "Hitung keliling segitiga OTP." },
    ],
  }),
  Qn(13, "Garis Singgung – OP dalam Bentuk Akar", {
    difficulty: "Sedang",
    content: "Jari-jari lingkaran r = 5 cm. Titik P berjarak OP = 5√2 cm dari pusat.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{(5\\sqrt{2})^2 - 5^2} = \\sqrt{50 - 25} = \\sqrt{25} = \\ldots" },
      { label: "b.", math: "PT = \\ldots \\text{ cm}" },
      { label: "c.", math: "\\angle TOP = \\arctan\\!\\left(\\frac{PT}{OT}\\right) = \\arctan(1) = 45^\\circ" },
    ],
  }),
  Qn(14, "Garis Singgung – Soal Cerita (Menara)", {
    difficulty: "Sedang",
    content: "Sebuah tali ditarik dari puncak menara setinggi 20 m ke tanah. Jarak dari dasar menara ke titik tali menyentuh tanah adalah 15 m.",
    parts: [
      { label: "a.", math: "\\text{Panjang tali} = \\sqrt{20^2 + 15^2} = \\sqrt{\\ldots} = \\ldots \\text{ m}" },
      { label: "b.", text: "Apakah ini soal garis singgung? Jelaskan." },
      { label: "c.", text: "Jika menara dianggap jari-jari, dan tanah garis singgung, di mana pusat lingkarannya?" },
    ],
  }),
  Qn(15, "Mencari r dari PT dan OP", {
    difficulty: "Sedang",
    content: "Panjang garis singgung PT = 24 cm. Jarak OP = 25 cm.",
    parts: [
      { label: "a.", math: "r^2 = OP^2 - PT^2 = 25^2 - 24^2 = \\ldots" },
      { label: "b.", math: "r = \\ldots \\text{ cm}" },
      { label: "c.", text: "Hitung luas lingkaran tersebut." },
    ],
  }),
  Qn(16, "Soal UN – Mencari OP", {
    difficulty: "Mudah",
    content: "Garis singgung PT = 7,5 cm. Jari-jari lingkaran 10 cm. Tentukan jarak OP.",
    parts: [
      { label: "a.", math: "OP = \\sqrt{r^2 + PT^2} = \\sqrt{10^2 + 7{,}5^2} = \\sqrt{\\ldots}" },
      { label: "b.", math: "OP = \\sqrt{100 + 56{,}25} = \\sqrt{156{,}25} = \\ldots" },
      { label: "c.", text: "Berapa luas segitiga OTP?" },
    ],
  }),
  Qn(17, "Garis Singgung – Soal ANBK", {
    difficulty: "Sedang",
    content: "Lingkaran L₁ berpusat O(0, 0) berjari-jari 5. Titik P(12, 0). Tentukan panjang garis singgung dari P ke L₁.",
    parts: [
      { label: "a.", math: "OP = \\sqrt{(12-0)^2 + (0-0)^2} = 12" },
      { label: "b.", math: "PT = \\sqrt{12^2 - 5^2} = \\sqrt{144 - 25} = \\sqrt{119} \\approx \\ldots" },
      { label: "c.", math: "PT \\approx \\ldots \\text{ cm (2 desimal)}" },
    ],
  }),
  Qn(18, "Garis Singgung – Keliling Segitiga", {
    difficulty: "Sedang",
    content: "PT garis singgung dengan OT = 15 cm, OP = 25 cm.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{25^2 - 15^2} = \\sqrt{625 - 225} = \\sqrt{400} = \\ldots" },
      { label: "b.", text: "Hitung keliling segitiga OTP." },
      { label: "c.", text: "Hitung luas segitiga OTP." },
    ],
  }),
  Qn(19, "Garis Singgung Berturut-turut", {
    difficulty: "Sulit",
    content: "Dari titik P, garis singgung PA ditarik ke lingkaran O berjari-jari r. Diketahui OP = 2r.",
    parts: [
      { label: "a.", math: "PA = \\sqrt{(2r)^2 - r^2} = \\sqrt{4r^2 - r^2} = \\sqrt{3r^2} = r\\sqrt{3}" },
      { label: "b.", math: "\\angle APO = \\arcsin\\!\\left(\\frac{r}{2r}\\right) = 30^\\circ" },
      { label: "c.", math: "\\text{Jika } r = 8 \\text{ cm, maka } PA = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(20, "Panjang Garis Singgung – Soal UN Kelas 8", {
    difficulty: "Mudah",
    content: "Sebuah lingkaran berjari-jari 6 cm. Dari titik P yang berjarak 10 cm dari pusat, ditarik garis singgung PT.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{10^2 - 6^2} = \\sqrt{100 - 36} = \\sqrt{64} = \\ldots" },
      { label: "b.", math: "PT = \\ldots \\text{ cm}" },
      { label: "c.", text: "Hitung sin ∠OPT." },
    ],
  }),
  Qn(21, "Luas Jajargenjang dari Garis Singgung", {
    difficulty: "Sulit",
    content: "Dari P di luar lingkaran O, PA dan PB adalah garis singgung. OA = 5 cm, PA = 12 cm.",
    parts: [
      { label: "a.", math: "OP = \\sqrt{5^2 + 12^2} = \\ldots \\text{ cm}" },
      { label: "b.", text: "Buktikan segiempat OAPB adalah jajargenjang." },
      { label: "c.", math: "\\text{Luas } OAPB = 2 \\times \\text{Luas } \\triangle OAP = 2 \\times \\frac{1}{2} \\times 5 \\times 12 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(22, "Soal Cerita – Jangkauan Pandang", {
    difficulty: "Sedang",
    content: "Seorang pengamat berdiri di titik P yang berjarak 50 km dari pusat Bumi. Jari-jari Bumi = 6400 km. (Gunakan pendekatan OP = 50 km dari permukaan, sehingga dari pusat = 6450 km.)",
    parts: [
      { label: "a.", math: "PT = \\sqrt{6450^2 - 6400^2} = \\sqrt{(6450-6400)(6450+6400)}" },
      { label: "b.", math: "PT = \\sqrt{50 \\times 12850} = \\sqrt{642500} \\approx \\ldots \\text{ km}" },
      { label: "c.", text: "Apa makna PT dalam konteks ini?" },
    ],
  }),
  Qn(23, "Garis Singgung – Perbandingan", {
    difficulty: "Sedang",
    content: "Dua lingkaran berpusat O₁ dan O₂ masing-masing berjari-jari 5 cm dan 5 cm. Titik P di luar kedua lingkaran dengan O₁P = 13 cm dan O₂P = 12 cm.",
    parts: [
      { label: "a.", math: "PT_1 = \\sqrt{13^2 - 5^2} = \\ldots \\text{ cm}" },
      { label: "b.", math: "PT_2 = \\sqrt{12^2 - 5^2} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Garis singgung ke lingkaran mana yang lebih panjang? Mengapa?" },
    ],
  }),
  Qn(24, "Garis Singgung dan Koordinat", {
    difficulty: "Sedang",
    content: "Lingkaran berpusat O(3, 4) berjari-jari 5. Titik P(9, 4) di luar lingkaran.",
    parts: [
      { label: "a.", math: "OP = \\sqrt{(9-3)^2 + (4-4)^2} = \\sqrt{36} = 6" },
      { label: "b.", math: "PT = \\sqrt{6^2 - 5^2} = \\sqrt{36 - 25} = \\sqrt{11} \\approx \\ldots" },
      { label: "c.", text: "Apakah P berada di luar lingkaran? Buktikan." },
    ],
  }),
  Qn(25, "Garis Singgung Dua Kali – Soal TKA", {
    difficulty: "Sulit",
    content: "Dari titik P di luar lingkaran O berjari-jari r, panjang garis singgung PT = r√3. Tentukan jarak OP.",
    parts: [
      { label: "a.", math: "OP^2 = PT^2 + r^2 = (r\\sqrt{3})^2 + r^2 = 3r^2 + r^2 = 4r^2" },
      { label: "b.", math: "OP = \\sqrt{4r^2} = 2r" },
      { label: "c.", math: "\\angle OPT = \\arctan\\!\\left(\\frac{r}{r\\sqrt{3}}\\right) = \\arctan\\!\\left(\\frac{1}{\\sqrt{3}}\\right) = 30^\\circ" },
    ],
  }),
  Qn(26, "Panjang Garis Singgung – Pilihan Ganda UN", {
    difficulty: "Mudah",
    content: "Jika OP = 15 cm dan OT = 9 cm (T titik singgung), maka panjang PT adalah ...",
    parts: [
      { label: "a.", math: "PT = \\sqrt{15^2 - 9^2}" },
      { label: "b.", math: "PT = \\sqrt{225 - 81} = \\sqrt{144} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah (9, 12, 15) merupakan triple Pythagoras? Verifikasi." },
    ],
  }),
  Qn(27, "Menentukan r – Dari Perbandingan", {
    difficulty: "Sulit",
    content: "Panjang garis singgung dari P adalah 4r/3 (empat pertiga kali jari-jari). Tentukan OP dalam r.",
    parts: [
      { label: "a.", math: "PT = \\frac{4r}{3}" },
      { label: "b.", math: "OP = \\sqrt{r^2 + \\left(\\frac{4r}{3}\\right)^2} = \\sqrt{r^2 + \\frac{16r^2}{9}} = \\sqrt{\\frac{25r^2}{9}} = \\frac{5r}{3}" },
      { label: "c.", math: "\\sin \\angle OPT = \\frac{r}{OP} = \\frac{r}{5r/3} = \\frac{3}{5}" },
    ],
  }),
  Qn(28, "Aplikasi – Menara Pemancar", {
    difficulty: "Sedang",
    content: "Menara pemancar setinggi 40 m berdiri di atas bukit dengan dasar di permukaan tanah. Seseorang di titik P ingin tahu jarak ke pangkal menara. OP = 50 m.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{50^2 - 40^2} = \\sqrt{2500 - 1600} = \\sqrt{900} = \\ldots \\text{ m}" },
      { label: "b.", text: "Dalam konteks ini, apakah PT adalah garis singgung? Jelaskan." },
      { label: "c.", text: "Hitung sudut elevasi PT terhadap horisontal." },
    ],
  }),
  Qn(29, "Garis Singgung – Perbandingan Panjang", {
    difficulty: "Sedang",
    content: "PT₁ = garis singgung dari P ke lingkaran O₁ (r₁ = 3, O₁P = 5). PT₂ = garis singgung dari P ke lingkaran O₂ (r₂ = 4, O₂P = 5).",
    parts: [
      { label: "a.", math: "PT_1 = \\sqrt{5^2 - 3^2} = \\sqrt{16} = \\ldots \\text{ cm}" },
      { label: "b.", math: "PT_2 = \\sqrt{5^2 - 4^2} = \\sqrt{9} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Perbandingan PT₁ : PT₂ = ...  Jelaskan hubungannya dengan jari-jari." },
    ],
  }),
  Qn(30, "Garis Singgung – Soal Cerita Kolam", {
    difficulty: "Sedang",
    content: "Seorang anak berdiri di pinggir lapangan yang jaraknya 24 m dari pusat kolam bundar. Jari-jari kolam = 7 m.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{24^2 - 7^2} = \\sqrt{576 - 49} = \\sqrt{527} \\approx \\ldots \\text{ m}" },
      { label: "b.", text: "Berapa banyak titik di tepi kolam yang bisa dicapai anak melalui garis singgung?" },
      { label: "c.", math: "\\text{Sudut antara dua garis singgung} = 2 \\arctan\\!\\left(\\frac{7}{\\sqrt{527}}\\right) \\approx \\ldots ^\\circ" },
    ],
  }),
  Qn(31, "Panjang GSL dari Persamaan", {
    difficulty: "Sedang",
    content: "Diketahui lingkaran x² + y² = 25. Titik P(7, 0) di luar lingkaran.",
    parts: [
      { label: "a.", math: "r = 5, \\; OP = 7" },
      { label: "b.", math: "PT = \\sqrt{7^2 - 5^2} = \\sqrt{49 - 25} = \\sqrt{24} = 2\\sqrt{6}" },
      { label: "c.", math: "PT = 2\\sqrt{6} \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(32, "Mencari PT – Bilangan Bulat", {
    difficulty: "Mudah",
    content: "Pilih yang menghasilkan PT bilangan bulat:",
    parts: [
      { label: "a.", math: "r = 3, OP = 5 \\Rightarrow PT = \\ldots" },
      { label: "b.", math: "r = 5, OP = 13 \\Rightarrow PT = \\ldots" },
      { label: "c.", math: "r = 6, OP = 10 \\Rightarrow PT = \\ldots" },
    ],
  }),
  Qn(33, "Soal Menentukan PT – Variasi", {
    difficulty: "Sedang",
    content: "Tentukan panjang garis singgung untuk setiap pasangan (r, OP) berikut:",
    parts: [
      { label: "a.", math: "r = 15, \\; OP = 17 \\Rightarrow PT = \\ldots" },
      { label: "b.", math: "r = 20, \\; OP = 25 \\Rightarrow PT = \\ldots" },
      { label: "c.", math: "r = 12, \\; OP = 20 \\Rightarrow PT = \\ldots" },
    ],
  }),
  Qn(34, "Garis Singgung – Soal UN", {
    difficulty: "Sedang",
    content: "Sebuah lingkaran berjari-jari 10 cm. Dari titik P di luar lingkaran, panjang garis singgung = 24 cm. Tentukan OP.",
    parts: [
      { label: "a.", math: "OP = \\sqrt{r^2 + PT^2} = \\sqrt{10^2 + 24^2} = \\sqrt{100 + 576} = \\sqrt{676}" },
      { label: "b.", math: "OP = \\ldots \\text{ cm}" },
      { label: "c.", text: "Sebutkan triple Pythagoras yang digunakan." },
    ],
  }),
  Qn(35, "Garis Singgung dari Koordinat", {
    difficulty: "Sedang",
    content: "Lingkaran berpusat O(0, 0), r = 6. Titik P(8, 6).",
    parts: [
      { label: "a.", math: "OP = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10" },
      { label: "b.", math: "PT = \\sqrt{10^2 - 6^2} = \\sqrt{64} = \\ldots" },
      { label: "c.", text: "Hitung luas segitiga OTP." },
    ],
  }),
  Qn(36, "Panjang GSL – Soal Campuran", {
    difficulty: "Sulit",
    content: "Dari titik P, panjang garis singgung ke lingkaran berjari-jari r adalah p. Jika p = 3r, maka OP = ...",
    parts: [
      { label: "a.", math: "OP^2 = r^2 + p^2 = r^2 + (3r)^2 = r^2 + 9r^2 = 10r^2" },
      { label: "b.", math: "OP = r\\sqrt{10}" },
      { label: "c.", math: "\\text{Jika } r = 5, \\text{ maka } OP = 5\\sqrt{10} \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(37, "Panjang Garis Singgung – ANBK", {
    difficulty: "Mudah",
    content: "Diketahui jari-jari lingkaran 10 cm dan OP = 26 cm. Hitung PT.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{26^2 - 10^2}" },
      { label: "b.", math: "PT = \\sqrt{676 - 100} = \\sqrt{576} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Hitung sin ∠POT." },
    ],
  }),
  Qn(38, "Garis Singgung – Variasi Sulit", {
    difficulty: "Sulit",
    content: "Dari titik P di luar lingkaran O (r = 4), ditarik garis singgung PA. Titik M adalah titik tengah PA. Jika ∠OPA = 30°, hitung PA dan OM.",
    parts: [
      { label: "a.", math: "\\sin 30^\\circ = \\frac{r}{OP} \\Rightarrow OP = \\frac{4}{0{,}5} = 8" },
      { label: "b.", math: "PA = OP \\cos 30^\\circ = 8 \\times \\frac{\\sqrt{3}}{2} = 4\\sqrt{3}" },
      { label: "c.", math: "OM = \\sqrt{OA^2 - AM^2} = \\sqrt{4^2 - (2\\sqrt{3})^2} = \\sqrt{16 - 12} = 2" },
    ],
  }),
  Qn(39, "Soal UN – Garis Singgung dan Luas", {
    difficulty: "Sedang",
    content: "Garis singgung dari P ke lingkaran berpusat O. OT = 5 cm, PT = 12 cm.",
    parts: [
      { label: "a.", math: "OP = \\sqrt{5^2 + 12^2} = \\sqrt{169} = 13 \\text{ cm}" },
      { label: "b.", math: "\\text{Luas } \\triangle OTP = \\frac{1}{2} \\times 5 \\times 12 = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "\\text{Keliling } \\triangle OTP = 5 + 12 + 13 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(40, "Soal TKA – Garis Singgung Gabungan", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="tangent-two" size={220} color="#fb923c" />,
    content: "Dari P di luar lingkaran O berjari-jari 5 cm, ditarik PA dan PB (keduanya garis singgung). OP = 13 cm. Titik Q adalah perpotongan AB dan OP.",
    parts: [
      { label: "a.", math: "PA = PB = \\sqrt{13^2 - 5^2} = \\ldots \\text{ cm}" },
      { label: "b.", math: "OQ = \\frac{r^2}{OP} = \\frac{25}{13} \\approx \\ldots \\text{ cm (titik tengah tali busur AB)}" },
      { label: "c.", math: "AB = 2\\sqrt{r^2 - OQ^2} = 2\\sqrt{25 - \\frac{625}{169}} = \\ldots \\text{ cm}" },
    ],
  }),
];

const diffColor: Record<string, string> = {
  Mudah: "bg-amber-500/20 text-amber-300 border-amber-400/40",
  Sedang: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  Sulit: "bg-rose-500/20 text-rose-300 border-rose-400/40",
};

const MenghitungPanjangPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <Ruler className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            MENGHITUNG PANJANG GARIS SINGGUNG
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Garis Singgung Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-2">📌 Rumus Panjang Garis Singgung dari Titik Luar</p>
          <div className="bg-white/5 rounded-lg px-3 py-3 mb-2 flex justify-center">
            <BlockMath math="PT = \\sqrt{OP^2 - r^2}" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { l: "PT", v: "Panjang garis singgung" },
              { l: "OP", v: "Jarak titik P ke pusat" },
              { l: "r", v: "Jari-jari lingkaran" },
            ].map(x => (
              <div key={x.l} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <span className="text-orange-400 font-bold block">{x.l}</span>
                <span className="text-white/50 text-[10px]">{x.v}</span>
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
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-orange-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenghitungPanjangPage;
