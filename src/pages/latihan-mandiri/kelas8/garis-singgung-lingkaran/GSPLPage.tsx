import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { GitCompareArrows } from "lucide-react";
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
  Qn(1, "Pengertian GSPL", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="gspl-two-circles" size={230} />,
    content: "Garis Singgung Persekutuan Luar (GSPL) adalah garis singgung dua lingkaran yang tidak memotong ruas garis yang menghubungkan kedua pusat.",
    parts: [
      { label: "a.", text: "Jelaskan perbedaan GSPL dengan GSPD dengan kata-katamu sendiri." },
      { label: "b.", text: "Berapa banyak GSPL yang dimiliki oleh dua lingkaran yang tidak saling berpotongan dan tidak saling berada di dalam?" },
      { label: "c.", text: "Kapan dua lingkaran tidak memiliki GSPL sama sekali?" },
    ],
  }),
  Qn(2, "Rumus GSPL", {
    difficulty: "Mudah",
    mathContent: "d_{GSPL} = \\sqrt{p^2 - (R - r)^2}",
    parts: [
      { label: "a.", text: "Sebutkan arti masing-masing variabel: p, R, r, dan d_GSPL." },
      { label: "b.", math: "\\text{Jika } p = 13, R = 5, r = 2, \\text{ hitung } d_{GSPL}" },
      { label: "c.", text: "Mengapa digunakan (R − r) dan bukan (R + r) pada rumus GSPL?" },
    ],
  }),
  Qn(3, "GSPL – Soal Dasar 1", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="gspl-two-circles" size={230} values={{ r1: 50, r2: 30 }} />,
    content: "Dua lingkaran berjari-jari R = 8 cm dan r = 3 cm. Jarak kedua pusat p = 13 cm.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{13^2 - (8-3)^2} = \\sqrt{169 - 25} = \\sqrt{\\ldots}" },
      { label: "b.", math: "d_{GSPL} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah hasilnya merupakan bilangan bulat? Ini triple Pythagoras apa?" },
    ],
  }),
  Qn(4, "GSPL – Soal Dasar 2", {
    difficulty: "Mudah",
    content: "Dua lingkaran berjari-jari 10 cm dan 4 cm. Jarak antara dua pusat = 10 cm.",
    parts: [
      { label: "a.", math: "R - r = 10 - 4 = 6" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{10^2 - 6^2} = \\sqrt{100 - 36} = \\sqrt{64} = \\ldots" },
      { label: "c.", math: "d_{GSPL} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(5, "GSPL – Mencari Jarak Pusat", {
    difficulty: "Sedang",
    content: "Panjang GSPL dua lingkaran berjari-jari 7 cm dan 3 cm adalah 12 cm. Hitung jarak antar pusat (p).",
    parts: [
      { label: "a.", math: "d_{GSPL}^2 = p^2 - (R-r)^2 \\Rightarrow 144 = p^2 - (7-3)^2 = p^2 - 16" },
      { label: "b.", math: "p^2 = 144 + 16 = 160 \\Rightarrow p = \\sqrt{160} = 4\\sqrt{10} \\approx \\ldots" },
      { label: "c.", text: "Apakah kedua lingkaran saling berpotongan, bersinggungan, atau terpisah?" },
    ],
  }),
  Qn(6, "GSPL – Mencari Jari-Jari", {
    difficulty: "Sedang",
    content: "GSPL dua lingkaran sepanjang 12 cm. Jarak pusat = 13 cm. Jari-jari lingkaran besar R = 6 cm. Hitung r.",
    parts: [
      { label: "a.", math: "d_{GSPL}^2 = p^2 - (R-r)^2 \\Rightarrow 144 = 169 - (6-r)^2" },
      { label: "b.", math: "(6-r)^2 = 169 - 144 = 25 \\Rightarrow 6-r = \\pm 5" },
      { label: "c.", math: "r = 1 \\text{ atau } r = 11 \\text{ (yang masuk akal?)} \\Rightarrow r = \\ldots" },
    ],
  }),
  Qn(7, "GSPL – Dua Lingkaran Sama Besar", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="gspl-two-circles" size={230} values={{ r1: 45, r2: 45 }} />,
    content: "Dua lingkaran berjari-jari sama r = 6 cm. Jarak antar pusat p = 10 cm.",
    parts: [
      { label: "a.", math: "R - r = 6 - 6 = 0" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{10^2 - 0^2} = \\sqrt{100} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Jika dua lingkaran sama besar, bagaimana posisi GSPL terhadap garis penghubung pusat?" },
    ],
  }),
  Qn(8, "GSPL – Soal Cerita (Roda Gigi)", {
    difficulty: "Sedang",
    content: "Dua roda berbentuk lingkaran dengan jari-jari 8 cm dan 5 cm. Jarak antar pusat kedua roda = 15 cm. Sabuk menghubungkan keduanya secara luar.",
    parts: [
      { label: "a.", math: "\\text{Panjang bagian lurus sabuk} = d_{GSPL} = \\sqrt{15^2 - (8-5)^2}" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{225 - 9} = \\sqrt{216} = 6\\sqrt{6} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Mengapa sabuk ini disebut sabuk luar dan bukan sabuk dalam?" },
    ],
  }),
  Qn(9, "GSPL – Segitiga Bantu", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="gspl-two-circles" size={230} />,
    content: "Dua lingkaran berjari-jari R = 7 cm dan r = 2 cm. Jarak pusat O₁O₂ = 13 cm.",
    parts: [
      { label: "a.", math: "\\text{Segitiga bantu: sisi miring} = O_1O_2 = 13, \\; \\text{sisi tegak} = R - r = 5" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = \\ldots" },
      { label: "c.", text: "Mengapa dibuat segitiga bantu dengan sisi tegak (R − r)?" },
    ],
  }),
  Qn(10, "GSPL – Soal UN 2020", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 9 cm dan 4 cm. Jarak pusat = 15 cm. Hitung panjang GSPL.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{15^2 - (9-4)^2} = \\sqrt{225 - 25} = \\sqrt{200}" },
      { label: "b.", math: "d_{GSPL} = 10\\sqrt{2} \\approx \\ldots \\text{ cm}" },
      { label: "c.", math: "\\text{Jika } d_{GSPL} = 10\\sqrt{2}, \\text{ nyatakan dalam 2 desimal}" },
    ],
  }),
  Qn(11, "GSPL – Nilai Ganda", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 5 cm dan 5 cm. Jarak pusat = 13 cm. Hitung GSPL.",
    parts: [
      { label: "a.", math: "R - r = 5 - 5 = 0" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{13^2 - 0^2} = 13 \\text{ cm}" },
      { label: "c.", text: "Berapa banyak GSPL pada dua lingkaran sama besar? Gambarkan posisinya." },
    ],
  }),
  Qn(12, "GSPL – Mencari p dari d", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 6 cm dan 2 cm. Panjang GSPL = 12 cm. Hitung jarak antar pusat.",
    parts: [
      { label: "a.", math: "d^2 = p^2 - (R-r)^2 \\Rightarrow 144 = p^2 - (6-2)^2 = p^2 - 16" },
      { label: "b.", math: "p^2 = 160 \\Rightarrow p = 4\\sqrt{10}" },
      { label: "c.", math: "p \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(13, "GSPL – Perbandingan Jari-Jari", {
    difficulty: "Sulit",
    content: "R : r = 3 : 1. Jarak antar pusat p = 8 cm, r = 2 cm, R = 6 cm. Hitung GSPL.",
    parts: [
      { label: "a.", math: "R - r = 6 - 2 = 4" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{8^2 - 4^2} = \\sqrt{64 - 16} = \\sqrt{48} = 4\\sqrt{3}" },
      { label: "c.", math: "d_{GSPL} = 4\\sqrt{3} \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(14, "GSPL – Kondisi Ada Tidaknya", {
    difficulty: "Sedang",
    content: "Tentukan ada atau tidaknya GSPL untuk kondisi berikut:",
    parts: [
      { label: "a.", text: "R = 10, r = 3, p = 6. (Apakah p > |R − r|?)" },
      { label: "b.", text: "R = 8, r = 3, p = 5. (Apakah p > |R − r|?)" },
      { label: "c.", text: "Apa kondisi yang harus dipenuhi agar GSPL ada?" },
    ],
  }),
  Qn(15, "GSPL – Soal Cerita Pipa", {
    difficulty: "Sedang",
    content: "Dua pipa berpenampang lingkaran, jari-jari masing-masing 4 cm dan 2 cm, diikat bersebelahan. Jarak pusat = 10 cm.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{10^2 - (4-2)^2} = \\sqrt{100 - 4} = \\sqrt{96} = 4\\sqrt{6}" },
      { label: "b.", math: "d_{GSPL} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Apa fungsi GSPL dalam konteks pipa ini?" },
    ],
  }),
  Qn(16, "GSPL – Sudut antara GSPL dan O₁O₂", {
    difficulty: "Sulit",
    content: "Dua lingkaran berjari-jari R = 5, r = 2, jarak pusat p = 13. Hitung GSPL dan sudut α antara GSPL dan garis O₁O₂.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{13^2 - 3^2} = \\sqrt{160} = 4\\sqrt{10}" },
      { label: "b.", math: "\\sin \\alpha = \\frac{R - r}{p} = \\frac{3}{13}" },
      { label: "c.", math: "\\alpha = \\arcsin\\!\\left(\\frac{3}{13}\\right) \\approx \\ldots ^\\circ" },
    ],
  }),
  Qn(17, "GSPL – Variasi Ukuran", {
    difficulty: "Mudah",
    content: "Hitung GSPL untuk masing-masing data berikut:",
    parts: [
      { label: "a.", math: "R = 5, r = 2, p = 5 \\Rightarrow d_{GSPL} = \\ldots" },
      { label: "b.", math: "R = 10, r = 2, p = 10 \\Rightarrow d_{GSPL} = \\ldots" },
      { label: "c.", math: "R = 3, r = 1, p = 6 \\Rightarrow d_{GSPL} = \\ldots" },
    ],
  }),
  Qn(18, "GSPL – Soal Perbandingan", {
    difficulty: "Sedang",
    content: "Dua pasang lingkaran:\n① R₁ = 6, r₁ = 2, p₁ = 10\n② R₂ = 5, r₂ = 1, p₂ = 10",
    parts: [
      { label: "a.", math: "d_1 = \\sqrt{10^2 - (6-2)^2} = \\sqrt{84} = 2\\sqrt{21}" },
      { label: "b.", math: "d_2 = \\sqrt{10^2 - (5-1)^2} = \\sqrt{84} = 2\\sqrt{21}" },
      { label: "c.", text: "Mengapa hasilnya sama? Apa yang menentukan panjang GSPL?" },
    ],
  }),
  Qn(19, "GSPL – Segitiga Siku-Siku Bantu", {
    difficulty: "Sedang",
    content: "Gambarlah segitiga siku-siku bantu yang digunakan untuk mencari GSPL. R = 9, r = 4, p = 13.",
    parts: [
      { label: "a.", text: "Apa yang menjadi hipotenusa segitiga bantu tersebut?" },
      { label: "b.", text: "Apa yang menjadi salah satu kaki tegak?" },
      { label: "c.", math: "d_{GSPL} = \\sqrt{13^2 - 5^2} = \\sqrt{144} = \\ldots" },
    ],
  }),
  Qn(20, "GSPL – Soal ANBK", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 11 cm dan 5 cm. Jarak antar pusat = 20 cm. Hitung GSPL.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{20^2 - (11-5)^2} = \\sqrt{400 - 36} = \\sqrt{364}" },
      { label: "b.", math: "d_{GSPL} = 2\\sqrt{91} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah kedua lingkaran ini saling berpotongan? Jelaskan." },
    ],
  }),
  Qn(21, "GSPL – Mencari R", {
    difficulty: "Sulit",
    content: "GSPL = 15 cm, r = 2 cm, jarak pusat = 17 cm. Hitung R.",
    parts: [
      { label: "a.", math: "15^2 = 17^2 - (R-2)^2 \\Rightarrow 225 = 289 - (R-2)^2" },
      { label: "b.", math: "(R-2)^2 = 64 \\Rightarrow R - 2 = 8 \\Rightarrow R = \\ldots" },
      { label: "c.", text: "Verifikasi: cek dengan rumus GSPL menggunakan R yang ditemukan." },
    ],
  }),
  Qn(22, "GSPL – Masalah Nyata Gir Sepeda", {
    difficulty: "Sedang",
    content: "Gir besar sepeda berjari-jari 12 cm, gir kecil 4 cm, jarak antar pusat = 20 cm.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{20^2 - (12-4)^2} = \\sqrt{400 - 64} = \\sqrt{336}" },
      { label: "b.", math: "d_{GSPL} = 4\\sqrt{21} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Dalam kenyataan, rantai sepeda merupakan sabuk dalam (GSPD) atau luar (GSPL)?" },
    ],
  }),
  Qn(23, "GSPL – Bilangan Bulat", {
    difficulty: "Mudah",
    content: "Tentukan pasangan (R, r, p) yang menghasilkan GSPL bilangan bulat:",
    parts: [
      { label: "a.", math: "R = 5, r = 1, p = 10 \\Rightarrow d_{GSPL} = \\sqrt{100 - 16} = \\ldots" },
      { label: "b.", math: "R = 7, r = 3, p = 5 \\Rightarrow d_{GSPL} = \\sqrt{25 - 16} = \\ldots" },
      { label: "c.", math: "R = 9, r = 4, p = 13 \\Rightarrow d_{GSPL} = \\sqrt{169 - 25} = \\ldots" },
    ],
  }),
  Qn(24, "GSPL – Soal UN", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 11 dan 4 cm. Panjang GSPL = 24 cm. Hitung jarak pusat.",
    parts: [
      { label: "a.", math: "24^2 = p^2 - (11-4)^2 \\Rightarrow 576 = p^2 - 49" },
      { label: "b.", math: "p^2 = 625 \\Rightarrow p = \\ldots \\text{ cm}" },
      { label: "c.", text: "Sebutkan triple Pythagoras yang digunakan." },
    ],
  }),
  Qn(25, "GSPL – Hubungan dengan GSPD", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari R = 8, r = 3, p = 15. Hitung GSPL dan GSPD.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{15^2 - (8-3)^2} = \\sqrt{225 - 25} = \\sqrt{200} = 10\\sqrt{2}" },
      { label: "b.", math: "d_{GSPD} = \\sqrt{15^2 - (8+3)^2} = \\sqrt{225 - 121} = \\sqrt{104} = 2\\sqrt{26}" },
      { label: "c.", text: "Mana yang lebih panjang, GSPL atau GSPD? Mengapa selalu demikian?" },
    ],
  }),
  Qn(26, "GSPL – Soal Cerita (Roller)", {
    difficulty: "Sedang",
    content: "Dua silinder (penampang lingkaran) berjari-jari 15 cm dan 6 cm dihubungkan dengan sabuk luar. Jarak pusat = 25 cm.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{25^2 - (15-6)^2} = \\sqrt{625 - 81} = \\sqrt{544} = 4\\sqrt{34}" },
      { label: "b.", math: "d_{GSPL} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Panjang total sabuk = 2 × GSPL + busur di masing-masing roda. Tuliskan rumus totalnya." },
    ],
  }),
  Qn(27, "GSPL – Mencari r (Kecil)", {
    difficulty: "Sulit",
    content: "R = 10, p = 26, GSPL = 24. Hitung r.",
    parts: [
      { label: "a.", math: "24^2 = 26^2 - (10-r)^2 \\Rightarrow 576 = 676 - (10-r)^2" },
      { label: "b.", math: "(10-r)^2 = 100 \\Rightarrow 10-r = 10 \\Rightarrow r = 0 \\text{ atau } 10-r = -10 \\Rightarrow r = 20" },
      { label: "c.", text: "Mana nilai r yang masuk akal? Jelaskan." },
    ],
  }),
  Qn(28, "GSPL – Soal Berlapis", {
    difficulty: "Sulit",
    content: "Tiga lingkaran kongruen berjari-jari r, saling bersinggungan luar. Hitung panjang GSPL antara dua lingkaran yang bersebelahan.",
    parts: [
      { label: "a.", math: "p = r + r = 2r" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{(2r)^2 - (r-r)^2} = \\sqrt{4r^2} = 2r" },
      { label: "c.", math: "\\text{Jika } r = 7, \\; d_{GSPL} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(29, "GSPL – Perbandingan Panjang", {
    difficulty: "Sedang",
    content: "Dua lingkaran p = 20, R = 10, r = 2 vs p = 20, R = 8, r = 4.",
    parts: [
      { label: "a.", math: "d_1 = \\sqrt{20^2 - (10-2)^2} = \\sqrt{400 - 64} = \\sqrt{336}" },
      { label: "b.", math: "d_2 = \\sqrt{20^2 - (8-4)^2} = \\sqrt{400 - 16} = \\sqrt{384}" },
      { label: "c.", text: "Mana yang lebih panjang? Faktor apa yang menyebabkan perbedaan ini?" },
    ],
  }),
  Qn(30, "GSPL – Soal TKA (Trigonometri)", {
    difficulty: "Sulit",
    content: "Dua lingkaran berjari-jari R = 5, r = 2, p = 13. Sudut yang dibentuk GSPL dengan O₁O₂ adalah α.",
    parts: [
      { label: "a.", math: "\\sin \\alpha = \\frac{R - r}{p} = \\frac{3}{13}" },
      { label: "b.", math: "\\cos \\alpha = \\frac{d_{GSPL}}{p} \\Rightarrow d_{GSPL} = p \\cos \\alpha" },
      { label: "c.", math: "d_{GSPL} = \\sqrt{13^2 - 3^2} = \\sqrt{160} = 4\\sqrt{10} \\approx \\ldots" },
    ],
  }),
  Qn(31, "GSPL – Soal Terapan Perkebunan", {
    difficulty: "Sedang",
    content: "Dua tangki minyak berbentuk silinder, jari-jari 5 m dan 3 m, berjarak pusat ke pusat 17 m. Hitung panjang pagar yang menyentuh kedua tangki di luar.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{17^2 - (5-3)^2} = \\sqrt{289 - 4} = \\sqrt{285}" },
      { label: "b.", math: "d_{GSPL} \\approx \\ldots \\text{ m}" },
      { label: "c.", text: "Ada berapa pagar seperti itu yang bisa dipasang?" },
    ],
  }),
  Qn(32, "GSPL – Rumus Umum", {
    difficulty: "Sedang",
    content: "Jika jarak pusat p = R + r + k (k = jarak tambahan), nyatakan GSPL dalam R, r, dan k.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{(R+r+k)^2 - (R-r)^2}" },
      { label: "b.", math: "= \\sqrt{(R+r+k+R-r)(R+r+k-R+r)} = \\sqrt{(2R+k)(2r+k)}" },
      { label: "c.", math: "\\text{Jika } k = 0 \\text{ (bersinggungan luar): } d_{GSPL} = \\sqrt{4Rr} = 2\\sqrt{Rr}" },
    ],
  }),
  Qn(33, "GSPL – Dua Lingkaran Bersinggungan Luar", {
    difficulty: "Sedang",
    content: "Dua lingkaran bersinggungan luar, R = 9, r = 4.",
    parts: [
      { label: "a.", math: "p = R + r = 9 + 4 = 13" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{13^2 - (9-4)^2} = \\sqrt{169 - 25} = \\sqrt{144} = \\ldots" },
      { label: "c.", math: "\\text{Atau gunakan rumus cepat: } d_{GSPL} = 2\\sqrt{Rr} = 2\\sqrt{9 \\times 4} = \\ldots" },
    ],
  }),
  Qn(34, "GSPL – ANBK Style", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 8 cm dan 3 cm. Jarak pusat = 17 cm. Hitung GSPL.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{17^2 - (8-3)^2} = \\sqrt{289 - 25} = \\sqrt{264}" },
      { label: "b.", math: "d_{GSPL} = 2\\sqrt{66} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah ada GSPD untuk konfigurasi ini? (Cek apakah p > R + r)" },
    ],
  }),
  Qn(35, "GSPL – Soal Campuran", {
    difficulty: "Sulit",
    content: "Tiga lingkaran masing-masing berjari-jari 2, 3, dan 4 cm, semua bersinggungan luar satu sama lain. Hitung GSPL antara lingkaran R=4 dan R=3.",
    parts: [
      { label: "a.", math: "p_{43} = 4 + 3 = 7" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{7^2 - (4-3)^2} = \\sqrt{49 - 1} = \\sqrt{48} = 4\\sqrt{3}" },
      { label: "c.", math: "d_{GSPL} \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(36, "GSPL – Soal Cerita (Ban Kendaraan)", {
    difficulty: "Sedang",
    content: "Dua roda kendaraan dengan jari-jari 40 cm dan 20 cm dihubungkan sabuk luar. Jarak pusat = 100 cm.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{100^2 - (40-20)^2} = \\sqrt{10000 - 400} = \\sqrt{9600}" },
      { label: "b.", math: "d_{GSPL} = 40\\sqrt{6} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Konversi ke meter: GSPL ≈ ... m." },
    ],
  }),
  Qn(37, "GSPL – Persamaan Jarak Pusat", {
    difficulty: "Sulit",
    content: "GSPL = GSPD untuk dua lingkaran berjari-jari R dan r. Apakah ini mungkin?",
    parts: [
      { label: "a.", math: "\\sqrt{p^2 - (R-r)^2} = \\sqrt{p^2 - (R+r)^2}" },
      { label: "b.", math: "(R-r)^2 = (R+r)^2 \\Rightarrow R^2 - 2Rr + r^2 = R^2 + 2Rr + r^2" },
      { label: "c.", math: "-2Rr = 2Rr \\Rightarrow 4Rr = 0 \\Rightarrow R = 0 \\text{ atau } r = 0 \\text{ (tidak mungkin)}" },
    ],
  }),
  Qn(38, "GSPL – Soal UN Nasional", {
    difficulty: "Mudah",
    content: "Dua lingkaran berjari-jari 7 cm dan 2 cm. Jarak antar pusat 13 cm. Panjang GSPL = ...",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{13^2 - (7-2)^2} = \\sqrt{169 - 25} = \\sqrt{144}" },
      { label: "b.", math: "d_{GSPL} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Berapakah jumlah semua GSPL yang dimiliki oleh dua lingkaran ini?" },
    ],
  }),
  Qn(39, "GSPL – Soal Gabungan", {
    difficulty: "Sulit",
    content: "Dua lingkaran berjari-jari R = 5, r = 3, p = 10. Hitung luas trapesium yang dibentuk oleh GSPL, jari-jari R, jari-jari r, dan proyeksinya.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{10^2 - (5-3)^2} = \\sqrt{96} = 4\\sqrt{6}" },
      { label: "b.", text: "Trapesium terbentuk dari: GSPL sebagai sisi miring, R dan r sebagai dua sisi sejajar, dan GSPL sebagai sisi lainnya." },
      { label: "c.", math: "\\text{Luas trapesium} = \\frac{1}{2}(R+r) \\times d_{GSPL} = \\frac{1}{2} \\times 8 \\times 4\\sqrt{6} = 16\\sqrt{6} \\approx \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(40, "GSPL – Soal TKA Final", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="gspl-two-circles" size={230} values={{ r1: 55, r2: 30 }} />,
    content: "Dua lingkaran berjari-jari R = 9 cm dan r = 4 cm. Jarak pusat p = 25 cm. Hitung: GSPL, sudut GSPL dengan O₁O₂, dan luas daerah antara dua GSPL dan dua lingkaran.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{25^2 - (9-4)^2} = \\sqrt{625 - 25} = \\sqrt{600} = 10\\sqrt{6} \\approx 24{,}5 \\text{ cm}" },
      { label: "b.", math: "\\sin \\alpha = \\frac{R-r}{p} = \\frac{5}{25} = \\frac{1}{5} \\Rightarrow \\alpha \\approx 11{,}5^\\circ" },
      { label: "c.", math: "\\text{Luas daerah} \\approx d_{GSPL} \\times (R - r) = 10\\sqrt{6} \\times 5 = 50\\sqrt{6} \\text{ cm}^2 \\text{ (pendekatan)}" },
    ],
  }),
];

const diffColor: Record<string, string> = {
  Mudah: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
  Sedang: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  Sulit: "bg-violet-500/20 text-violet-300 border-violet-400/40",
};

const GSPLPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <GitCompareArrows className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Garis Singgung Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-2">📌 Rumus Garis Singgung Persekutuan Luar</p>
          <div className="bg-white/5 rounded-lg px-3 py-3 mb-2 flex justify-center">
            <BlockMath math="d_{GSPL} = \\sqrt{p^2 - (R - r)^2}" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { l: "p", v: "Jarak antar pusat O₁O₂" },
              { l: "R", v: "Jari-jari lingkaran besar" },
              { l: "r", v: "Jari-jari lingkaran kecil" },
              { l: "d", v: "Panjang GSPL" },
            ].map(x => (
              <div key={x.l} className="bg-white/5 rounded-lg px-2 py-2">
                <span className="text-cyan-400 font-bold">{x.l}: </span>
                <span className="text-white/60">{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded">
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
                      <div className="mb-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSPLPage;
