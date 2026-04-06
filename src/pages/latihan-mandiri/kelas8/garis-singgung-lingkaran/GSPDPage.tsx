import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Shuffle } from "lucide-react";
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
  Qn(1, "Pengertian GSPD", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="gspd-two-circles" size={230} />,
    content: "Garis Singgung Persekutuan Dalam (GSPD) adalah garis yang menyinggung dua lingkaran dari antara kedua pusat, sehingga memotong ruas garis O₁O₂.",
    parts: [
      { label: "a.", text: "Jelaskan mengapa GSPD 'memotong' garis O₁O₂ sedangkan GSPL tidak." },
      { label: "b.", text: "Berapa banyak GSPD yang dapat dibuat pada dua lingkaran yang terpisah?" },
      { label: "c.", text: "Kapan dua lingkaran tidak memiliki GSPD?" },
    ],
  }),
  Qn(2, "Rumus GSPD", {
    difficulty: "Mudah",
    mathContent: "d_{GSPD} = \\sqrt{p^2 - (R + r)^2}",
    parts: [
      { label: "a.", text: "Mengapa pada rumus GSPD digunakan (R + r) bukan (R − r)?" },
      { label: "b.", math: "\\text{Jika } p = 17, R = 8, r = 4, \\text{ hitung } d_{GSPD}" },
      { label: "c.", text: "Bandingkan rumus GSPL dan GSPD. Apa perbedaannya?" },
    ],
  }),
  Qn(3, "GSPD – Soal Dasar 1", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="gspd-two-circles" size={230} />,
    content: "Dua lingkaran berjari-jari R = 5 cm dan r = 4 cm. Jarak antar pusat p = 15 cm.",
    parts: [
      { label: "a.", math: "R + r = 5 + 4 = 9" },
      { label: "b.", math: "d_{GSPD} = \\sqrt{15^2 - 9^2} = \\sqrt{225 - 81} = \\sqrt{144} = \\ldots" },
      { label: "c.", math: "d_{GSPD} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(4, "GSPD – Soal Dasar 2", {
    difficulty: "Mudah",
    content: "Dua lingkaran berjari-jari 3 cm dan 4 cm. Jarak antar pusat = 15 cm.",
    parts: [
      { label: "a.", math: "R + r = 3 + 4 = 7" },
      { label: "b.", math: "d_{GSPD} = \\sqrt{15^2 - 7^2} = \\sqrt{225 - 49} = \\sqrt{176} = 4\\sqrt{11}" },
      { label: "c.", math: "d_{GSPD} \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(5, "GSPD – Mencari Jarak Pusat", {
    difficulty: "Sedang",
    content: "GSPD = 12 cm, R = 5 cm, r = 3 cm. Hitung jarak pusat p.",
    parts: [
      { label: "a.", math: "12^2 = p^2 - (5+3)^2 \\Rightarrow 144 = p^2 - 64" },
      { label: "b.", math: "p^2 = 208 \\Rightarrow p = 4\\sqrt{13} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah kedua lingkaran saling berpotongan?" },
    ],
  }),
  Qn(6, "GSPD – Mencari Jari-Jari", {
    difficulty: "Sedang",
    content: "GSPD = 8 cm, R = 5 cm, p = 13 cm. Hitung r.",
    parts: [
      { label: "a.", math: "8^2 = 13^2 - (5+r)^2 \\Rightarrow 64 = 169 - (5+r)^2" },
      { label: "b.", math: "(5+r)^2 = 105 \\Rightarrow 5+r = \\sqrt{105} \\approx 10{,}2 \\Rightarrow r \\approx \\ldots" },
      { label: "c.", text: "Verifikasi nilai r yang didapat." },
    ],
  }),
  Qn(7, "GSPD – Kondisi Keberadaan", {
    difficulty: "Sedang",
    content: "Tentukan apakah GSPD ada atau tidak untuk kondisi berikut:",
    parts: [
      { label: "a.", text: "R = 8, r = 6, p = 20. (Apakah p > R + r?)" },
      { label: "b.", text: "R = 10, r = 8, p = 14. (Apakah p > R + r?)" },
      { label: "c.", text: "GSPD ada jika dan hanya jika p > ..." },
    ],
  }),
  Qn(8, "GSPD – Soal Cerita (Rantai Silang)", {
    difficulty: "Sedang",
    content: "Dua roda berjari-jari 6 cm dan 4 cm. Jarak pusat = 20 cm. Rantai menyilang (GSPD).",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{20^2 - (6+4)^2} = \\sqrt{400 - 100} = \\sqrt{300} = 10\\sqrt{3}" },
      { label: "b.", math: "d_{GSPD} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Mengapa rantai silang menggunakan GSPD, bukan GSPL?" },
    ],
  }),
  Qn(9, "GSPD – Bilangan Bulat", {
    difficulty: "Mudah",
    content: "Temukan pasangan (R, r, p) yang menghasilkan GSPD bilangan bulat:",
    parts: [
      { label: "a.", math: "R = 5, r = 7, p = 17 \\Rightarrow d_{GSPD} = \\sqrt{17^2 - 12^2} = \\sqrt{289-144} = \\ldots" },
      { label: "b.", math: "R = 3, r = 4, p = 13 \\Rightarrow d_{GSPD} = \\sqrt{169 - 49} = \\sqrt{120} = \\ldots" },
      { label: "c.", math: "R = 6, r = 2, p = 10 \\Rightarrow d_{GSPD} = \\sqrt{100 - 64} = \\sqrt{36} = \\ldots" },
    ],
  }),
  Qn(10, "GSPD – Soal UN", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 5 cm dan 8 cm. Jarak antar pusat = 15 cm. Hitung GSPD.",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{15^2 - (5+8)^2} = \\sqrt{225 - 169} = \\sqrt{56}" },
      { label: "b.", math: "d_{GSPD} = 2\\sqrt{14} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Bandingkan dengan GSPL untuk konfigurasi yang sama." },
    ],
  }),
  Qn(11, "GSPD – Perbandingan dengan GSPL", {
    difficulty: "Sedang",
    content: "R = 4, r = 3, p = 15. Hitung keduanya: GSPL dan GSPD.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{15^2 - (4-3)^2} = \\sqrt{225 - 1} = \\sqrt{224} = 4\\sqrt{14}" },
      { label: "b.", math: "d_{GSPD} = \\sqrt{15^2 - (4+3)^2} = \\sqrt{225 - 49} = \\sqrt{176} = 4\\sqrt{11}" },
      { label: "c.", text: "Mana yang lebih panjang? Selalu benarkah GSPL > GSPD?" },
    ],
  }),
  Qn(12, "GSPD – Soal Cerita (Katrol)", {
    difficulty: "Sedang",
    content: "Dua katrol berjari-jari 8 cm dan 5 cm. Tali menyilang di antara keduanya. Jarak pusat = 21 cm.",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{21^2 - (8+5)^2} = \\sqrt{441 - 169} = \\sqrt{272} = 4\\sqrt{17}" },
      { label: "b.", math: "d_{GSPD} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Total panjang tali = 2 × GSPD + bagian busur. Estimasikan total panjang tali jika busur total ≈ 40 cm." },
    ],
  }),
  Qn(13, "GSPD – Soal Berlapis (Tiga Variabel)", {
    difficulty: "Sulit",
    content: "GSPD = 2R. Jarak pusat p = 5R, dan r = 2R. Verifikasi rumus.",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{(5R)^2 - (R + 2R)^2} = \\sqrt{25R^2 - 9R^2} = \\sqrt{16R^2} = 4R" },
      { label: "b.", text: "Apakah d_GSPD = 2R? Bandingkan dengan yang dihitung." },
      { label: "c.", math: "\\text{Jika } R = 3 \\text{ cm, maka } d_{GSPD} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(14, "GSPD – ANBK Style", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 9 cm dan 5 cm. GSPD = 12 cm. Hitung jarak pusat.",
    parts: [
      { label: "a.", math: "12^2 = p^2 - (9+5)^2 \\Rightarrow 144 = p^2 - 196" },
      { label: "b.", math: "p^2 = 340 \\Rightarrow p = 2\\sqrt{85} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah ada GSPD jika p < R + r? Jelaskan." },
    ],
  }),
  Qn(15, "GSPD – Soal TKA", {
    difficulty: "Sulit",
    content: "Titik X adalah perpotongan GSPD dengan garis O₁O₂. R = 6, r = 4, p = 20. Tentukan O₁X dan O₂X.",
    parts: [
      { label: "a.", math: "\\frac{O_1X}{O_2X} = \\frac{R}{r} = \\frac{6}{4} = \\frac{3}{2}" },
      { label: "b.", math: "O_1X + O_2X = 20 \\Rightarrow O_1X = \\frac{3}{5} \\times 20 = 12" },
      { label: "c.", math: "O_2X = 20 - 12 = 8 \\text{ cm}" },
    ],
  }),
  Qn(16, "GSPD – Mencari R Besar", {
    difficulty: "Sulit",
    content: "GSPD = 16 cm, r = 3 cm, p = 20 cm. Hitung R.",
    parts: [
      { label: "a.", math: "16^2 = 20^2 - (R+3)^2 \\Rightarrow 256 = 400 - (R+3)^2" },
      { label: "b.", math: "(R+3)^2 = 144 \\Rightarrow R+3 = 12 \\Rightarrow R = \\ldots" },
      { label: "c.", math: "\\text{Verifikasi: } d = \\sqrt{20^2 - (9+3)^2} = \\sqrt{400 - 144} = \\sqrt{256} = 16 \\checkmark" },
    ],
  }),
  Qn(17, "GSPD – Soal Gabungan GSPL dan GSPD", {
    difficulty: "Sedang",
    content: "R = 10, r = 4, p = 26. Hitung selisih GSPL dan GSPD.",
    parts: [
      { label: "a.", math: "d_{GSPL} = \\sqrt{26^2 - (10-4)^2} = \\sqrt{676 - 36} = \\sqrt{640} = 8\\sqrt{10}" },
      { label: "b.", math: "d_{GSPD} = \\sqrt{26^2 - (10+4)^2} = \\sqrt{676 - 196} = \\sqrt{480} = 4\\sqrt{30}" },
      { label: "c.", math: "\\text{Selisih} = 8\\sqrt{10} - 4\\sqrt{30} \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(18, "GSPD – Soal Cerita (Transmisi Mesin)", {
    difficulty: "Sedang",
    content: "Dua puli mesin berjari-jari 20 cm dan 10 cm, jarak pusat 60 cm. Sabuk menyilang (GSPD).",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{60^2 - (20+10)^2} = \\sqrt{3600 - 900} = \\sqrt{2700} = 30\\sqrt{3}" },
      { label: "b.", math: "d_{GSPD} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Panjang satu sisi sabuk menyilang (satu lintasan lurus) adalah GSPD. Berapa panjang total dua lintasan lurus?" },
    ],
  }),
  Qn(19, "GSPD – Perbandingan Panjang", {
    difficulty: "Sedang",
    content: "Tentukan GSPD untuk setiap kasus:",
    parts: [
      { label: "a.", math: "R = 3, r = 2, p = 13 \\Rightarrow d_{GSPD} = \\sqrt{169 - 25} = \\ldots" },
      { label: "b.", math: "R = 4, r = 3, p = 13 \\Rightarrow d_{GSPD} = \\sqrt{169 - 49} = \\ldots" },
      { label: "c.", math: "R = 5, r = 4, p = 13 \\Rightarrow d_{GSPD} = \\sqrt{169 - 81} = \\ldots" },
    ],
  }),
  Qn(20, "GSPD – Soal UN (Pilihan)", {
    difficulty: "Mudah",
    content: "Jika R = 8, r = 2, p = 15, maka GSPD = ...",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{15^2 - (8+2)^2} = \\sqrt{225 - 100} = \\sqrt{125}" },
      { label: "b.", math: "d_{GSPD} = 5\\sqrt{5} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah konfigurasi ini memiliki GSPL? Hitung GSPL-nya." },
    ],
  }),
  Qn(21, "GSPD – Titik Silang X", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="gspd-two-circles" size={230} />,
    content: "GSPD memotong garis pusat O₁O₂ di titik X. Perbandingan O₁X : XO₂ = R : r.",
    parts: [
      { label: "a.", math: "R = 9, r = 6, p = 30 \\Rightarrow O_1X : XO_2 = 9 : 6 = 3 : 2" },
      { label: "b.", math: "O_1X = \\frac{3}{5} \\times 30 = 18 \\text{ cm}" },
      { label: "c.", math: "d_{GSPD} = \\sqrt{30^2 - (9+6)^2} = \\sqrt{900 - 225} = \\sqrt{675} = 15\\sqrt{3}" },
    ],
  }),
  Qn(22, "GSPD – Soal Tingkat Lanjut", {
    difficulty: "Sulit",
    content: "Dua lingkaran berpotongan tidak bisa memiliki GSPD. Buktikan untuk R = 5, r = 4, p = 6.",
    parts: [
      { label: "a.", math: "R + r = 5 + 4 = 9 > p = 6 \\Rightarrow \\text{lingkaran saling berpotongan}" },
      { label: "b.", math: "d_{GSPD} = \\sqrt{6^2 - 9^2} = \\sqrt{36 - 81} = \\sqrt{-45} \\text{ (tidak ada)}" },
      { label: "c.", text: "Simpulkan: kapan GSPD tidak ada?" },
    ],
  }),
  Qn(23, "GSPD – Soal Cerita (Sabuk Mesin Jahit)", {
    difficulty: "Sedang",
    content: "Mesin jahit memiliki dua puli berjari-jari 3 cm dan 2 cm. Jarak pusat = 10 cm. Tali/sabuk dipasang silang.",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{10^2 - (3+2)^2} = \\sqrt{100 - 25} = \\sqrt{75} = 5\\sqrt{3}" },
      { label: "b.", math: "d_{GSPD} \\approx \\ldots \\text{ cm}" },
      { label: "c.", text: "Jika tali tidak menyilang (GSPL), berapa panjangnya?" },
    ],
  }),
  Qn(24, "GSPD – Rumus Umum", {
    difficulty: "Sedang",
    content: "Jika p = kR (k kali jari-jari besar) dan r = mR, nyatakan GSPD dalam R, k, m.",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{(kR)^2 - (R + mR)^2} = R\\sqrt{k^2 - (1+m)^2}" },
      { label: "b.", math: "\\text{Jika } k = 5, m = 2: d_{GSPD} = R\\sqrt{25 - 9} = 4R" },
      { label: "c.", math: "\\text{Jika } R = 3 \\text{ cm, maka } d_{GSPD} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(25, "GSPD – Soal Campuran TKA", {
    difficulty: "Sulit",
    content: "Dua lingkaran berjari-jari R dan r = R/2. Jarak pusat p = 3R. Tentukan GSPD dan GSPL.",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{(3R)^2 - (R + R/2)^2} = \\sqrt{9R^2 - (3R/2)^2} = \\sqrt{9R^2 - \\frac{9R^2}{4}} = \\frac{3R\\sqrt{3}}{2}" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{(3R)^2 - (R - R/2)^2} = \\sqrt{9R^2 - R^2/4} = \\frac{R\\sqrt{35}}{2}" },
      { label: "c.", math: "\\frac{d_{GSPL}}{d_{GSPD}} = \\frac{\\sqrt{35}}{3\\sqrt{3}} = \\ldots" },
    ],
  }),
  Qn(26, "GSPD – Soal UN Nasional", {
    difficulty: "Mudah",
    content: "Dua lingkaran berjari-jari 3 dan 4. Jarak pusat 25. GSPD = ...",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{25^2 - (3+4)^2} = \\sqrt{625 - 49} = \\sqrt{576}" },
      { label: "b.", math: "d_{GSPD} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Sebutkan triple Pythagoras yang digunakan." },
    ],
  }),
  Qn(27, "GSPD – Soal Dari Koordinat", {
    difficulty: "Sedang",
    content: "Lingkaran L₁ berpusat O₁(0,0) r=3. Lingkaran L₂ berpusat O₂(13,0) r=2.",
    parts: [
      { label: "a.", math: "p = O_1O_2 = 13" },
      { label: "b.", math: "d_{GSPD} = \\sqrt{13^2 - (3+2)^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12" },
      { label: "c.", text: "Apakah konfigurasi ini memungkinkan GSPD? (Cek p > R+r)" },
    ],
  }),
  Qn(28, "GSPD – Perbandingan Titik Silang", {
    difficulty: "Sulit",
    content: "GSPD memotong garis O₁O₂ di X. R₁ = 6, r = 4, p = 30. Hitung O₁X, XO₂, dan GSPD.",
    parts: [
      { label: "a.", math: "O_1X = \\frac{R}{R+r} \\times p = \\frac{6}{10} \\times 30 = 18 \\text{ cm}" },
      { label: "b.", math: "XO_2 = \\frac{r}{R+r} \\times p = \\frac{4}{10} \\times 30 = 12 \\text{ cm}" },
      { label: "c.", math: "d_{GSPD} = \\sqrt{30^2 - (6+4)^2} = \\sqrt{900 - 100} = \\sqrt{800} = 20\\sqrt{2}" },
    ],
  }),
  Qn(29, "GSPD – Dua Lingkaran Bersinggungan", {
    difficulty: "Sedang",
    content: "Dua lingkaran bersinggungan dalam (p = R − r, R = 10, r = 4).",
    parts: [
      { label: "a.", math: "p = R - r = 10 - 4 = 6" },
      { label: "b.", math: "d_{GSPD} = \\sqrt{6^2 - (10+4)^2} = \\sqrt{36 - 196} \\text{ (tidak ada)}" },
      { label: "c.", text: "Jika lingkaran bersinggungan dalam, apakah ada GSPD? Jelaskan." },
    ],
  }),
  Qn(30, "GSPD – Soal ANBK Campuran", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 7 dan 3. GSPD = 24. Hitung jarak pusat.",
    parts: [
      { label: "a.", math: "24^2 = p^2 - (7+3)^2 \\Rightarrow 576 = p^2 - 100" },
      { label: "b.", math: "p^2 = 676 \\Rightarrow p = 26 \\text{ cm}" },
      { label: "c.", text: "Sebutkan triple Pythagoras. Verifikasi dengan menghitung GSPD menggunakan p = 26." },
    ],
  }),
  Qn(31, "GSPD – Mencari r dari Kondisi", {
    difficulty: "Sulit",
    content: "GSPD = GSPL/2. R = 5, p = 17. Hitung r.",
    parts: [
      { label: "a.", math: "GSPL = \\sqrt{17^2 - (5-r)^2}, \\quad GSPD = \\sqrt{17^2 - (5+r)^2}" },
      { label: "b.", math: "GSPD = GSPL/2 \\Rightarrow 17^2 - (5+r)^2 = \\frac{1}{4}[17^2 - (5-r)^2]" },
      { label: "c.", text: "Selesaikan persamaan ini untuk menemukan r. (Hasil ≈ 3)" },
    ],
  }),
  Qn(32, "GSPD – Luas Segitiga dari Titik Silang", {
    difficulty: "Sulit",
    content: "GSPD = d, titik silang X. O₁X = a, XO₂ = b. Lingkaran berjari-jari R dan r.",
    parts: [
      { label: "a.", text: "Luas segitiga XTO₁ (T titik singgung di lingkaran besar) = ½ × a × R (karena XTO₁ siku-siku di T)." },
      { label: "b.", math: "\\text{Dengan } R = 9, r = 6, p = 30: \\; a = 18, \\; R = 9" },
      { label: "c.", math: "\\text{Luas} = \\frac{1}{2} \\times 18 \\times 9 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(33, "GSPD – Soal Dari UN SMP", {
    difficulty: "Mudah",
    content: "Dua lingkaran berjari-jari 6 cm dan 2 cm. Jarak pusat 10 cm. GSPD = ...",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{10^2 - (6+2)^2} = \\sqrt{100 - 64} = \\sqrt{36}" },
      { label: "b.", math: "d_{GSPD} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah ada GSPL juga untuk konfigurasi ini? Hitung GSPL." },
    ],
  }),
  Qn(34, "GSPD – Soal Mencari Selisih", {
    difficulty: "Sedang",
    content: "R = 8, r = 4, p = 20. Hitung selisih GSPL² − GSPD².",
    parts: [
      { label: "a.", math: "d_{GSPL}^2 = 20^2 - (8-4)^2 = 400 - 16 = 384" },
      { label: "b.", math: "d_{GSPD}^2 = 20^2 - (8+4)^2 = 400 - 144 = 256" },
      { label: "c.", math: "d_{GSPL}^2 - d_{GSPD}^2 = 384 - 256 = \\ldots" },
    ],
  }),
  Qn(35, "GSPD – Soal Pemecahan Masalah", {
    difficulty: "Sulit",
    content: "Tiga lingkaran berjari-jari 2, 3, dan 5 cm. Lingkaran R=2 dan r=3 bersinggungan luar. Lingkaran R=5 dan r=3 bersinggungan luar juga. Hitung GSPD antara R=2 dan R=5.",
    parts: [
      { label: "a.", math: "p_{25} = \\text{jarak antara pusat lingkaran r=2 dan r=5}" },
      { label: "b.", text: "Tentukan p₂₅ menggunakan informasi bersinggungan luar lingkaran-lingkaran tersebut." },
      { label: "c.", math: "d_{GSPD} = \\sqrt{p_{25}^2 - (2+5)^2}" },
    ],
  }),
  Qn(36, "GSPD – Soal Perbandingan", {
    difficulty: "Sedang",
    content: "Dua konfigurasi lingkaran:\n① R = 5, r = 3, p = 16\n② R = 6, r = 4, p = 16",
    parts: [
      { label: "a.", math: "d_1 = \\sqrt{16^2 - (5+3)^2} = \\sqrt{256 - 64} = \\sqrt{192} = 8\\sqrt{3}" },
      { label: "b.", math: "d_2 = \\sqrt{16^2 - (6+4)^2} = \\sqrt{256 - 100} = \\sqrt{156} = 2\\sqrt{39}" },
      { label: "c.", text: "Konfigurasi mana yang memiliki GSPD lebih panjang?" },
    ],
  }),
  Qn(37, "GSPD – Soal Integral Konsep", {
    difficulty: "Sulit",
    content: "Jika R + r = 10 dan p = 26, tentukan nilai R dan r agar GSPD = 24.",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{26^2 - (R+r)^2} = \\sqrt{676 - 100} = \\sqrt{576} = 24 \\checkmark" },
      { label: "b.", text: "Kondisi R + r = 10 sudah terpenuhi sehingga sembarang R dan r dengan R + r = 10 memberikan GSPD = 24." },
      { label: "c.", math: "\\text{Contoh: } R = 7, r = 3 \\Rightarrow d_{GSPD} = \\sqrt{576} = 24 \\checkmark" },
    ],
  }),
  Qn(38, "GSPD – Soal ANBK Final", {
    difficulty: "Sedang",
    content: "Dua lingkaran berjari-jari 10 dan 6. Jarak pusat 34. GSPD = ...",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{34^2 - (10+6)^2} = \\sqrt{1156 - 256} = \\sqrt{900}" },
      { label: "b.", math: "d_{GSPD} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Sebutkan triple Pythagoras yang digunakan." },
    ],
  }),
  Qn(39, "GSPD – Soal Koordinat Lanjut", {
    difficulty: "Sulit",
    content: "Lingkaran L₁: pusat (0,0), r = 4. Lingkaran L₂: pusat (17, 0), r = 9.",
    parts: [
      { label: "a.", math: "p = 17, \\; R + r = 4 + 9 = 13" },
      { label: "b.", math: "d_{GSPD} = \\sqrt{17^2 - 13^2} = \\sqrt{289 - 169} = \\sqrt{120} = 2\\sqrt{30}" },
      { label: "c.", text: "Titik X perpotongan GSPD dan O₁O₂: O₁X = p × R/(R+r) = 17 × 4/13 ≈ ... cm" },
    ],
  }),
  Qn(40, "GSPD – Soal TKA Final", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="gspd-two-circles" size={230} />,
    content: "Dua lingkaran R = 8, r = 6, p = 30. Hitung: GSPD, GSPL, selisihnya, dan sudut yang dibentuk GSPD dengan O₁O₂.",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{30^2 - 14^2} = \\sqrt{900-196} = \\sqrt{704} = 4\\sqrt{44} = 8\\sqrt{11}" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{30^2 - 2^2} = \\sqrt{900 - 4} = \\sqrt{896} = 4\\sqrt{56} = 8\\sqrt{14}" },
      { label: "c.", math: "\\sin \\beta = \\frac{R+r}{p} = \\frac{14}{30} = \\frac{7}{15} \\Rightarrow \\beta \\approx 27{,}8^\\circ" },
    ],
  }),
];

const diffColor: Record<string, string> = {
  Mudah: "bg-pink-500/20 text-pink-300 border-pink-400/40",
  Sedang: "bg-rose-500/20 text-rose-300 border-rose-400/40",
  Sulit: "bg-red-500/20 text-red-300 border-red-400/40",
};

const GSPDPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <Shuffle className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(244,63,94,0.7)' }}>
            GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Garis Singgung Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">📌 Rumus Garis Singgung Persekutuan Dalam</p>
          <div className="bg-white/5 rounded-lg px-3 py-3 mb-2 flex justify-center">
            <BlockMath math="d_{GSPD} = \\sqrt{p^2 - (R + r)^2}" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { l: "p", v: "Jarak antar pusat O₁O₂" },
              { l: "R + r", v: "Jumlah kedua jari-jari" },
              { l: "Syarat ada:", v: "p > R + r" },
              { l: "GSPD < GSPL", v: "Selalu berlaku" },
            ].map(x => (
              <div key={x.l} className="bg-white/5 rounded-lg px-2 py-2">
                <span className="text-rose-400 font-bold">{x.l}: </span>
                <span className="text-white/60">{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded">
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
                      <div className="mb-3 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSPDPage;
