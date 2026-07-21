import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const DiskriminanSVG = () => (
  <svg width="300" height="120" viewBox="0 0 300 120" className="mx-auto">
    <rect x="5" y="5" width="290" height="110" rx="12" fill="var(--card)" fillOpacity="0.25" stroke="#f43f5e" strokeWidth="1.5"/>
    <text x="150" y="30" fill="#fda4af" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">D = b² − 4ac</text>
    <rect x="20" y="45" width="80" height="60" rx="8" fill="var(--card)" fillOpacity="0.3" stroke="#4ade80" strokeWidth="1"/>
    <text x="60" y="68" fill="#4ade80" fontSize="11" textAnchor="middle" fontFamily="monospace">D {">"} 0</text>
    <text x="60" y="86" fill="#86efac" fontSize="9" textAnchor="middle">2 akar real</text>
    <text x="60" y="100" fill="#86efac" fontSize="9" textAnchor="middle">berbeda</text>
    <rect x="110" y="45" width="80" height="60" rx="8" fill="var(--card)" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="1"/>
    <text x="150" y="68" fill="#60a5fa" fontSize="11" textAnchor="middle" fontFamily="monospace">D = 0</text>
    <text x="150" y="86" fill="#93c5fd" fontSize="9" textAnchor="middle">akar kembar</text>
    <text x="150" y="100" fill="#93c5fd" fontSize="9" textAnchor="middle">x₁ = x₂</text>
    <rect x="200" y="45" width="80" height="60" rx="8" fill="var(--card)" fillOpacity="0.3" stroke="#fb7185" strokeWidth="1"/>
    <text x="240" y="68" fill="#fb7185" fontSize="11" textAnchor="middle" fontFamily="monospace">D {"<"} 0</text>
    <text x="240" y="86" fill="#fda4af" fontSize="9" textAnchor="middle">tidak ada</text>
    <text x="240" y="100" fill="#fda4af" fontSize="9" textAnchor="middle">akar real</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Menghitung Diskriminan – UN", {
    type: "mixed", diagram: <DiskriminanSVG />,
    content: "Hitung nilai diskriminan D = b² − 4ac:",
    parts: [
      { label: "a.", math: "x^2 - 5x + 6 = 0 \\Rightarrow D = \\ldots" },
      { label: "b.", math: "2x^2 + 3x + 1 = 0 \\Rightarrow D = \\ldots" },
      { label: "c.", math: "x^2 + 4x + 5 = 0 \\Rightarrow D = \\ldots" },
    ],
  }),
  Qn(2, "Jenis Akar dari Diskriminan – UN", {
    type: "mixed",
    content: "Tentukan jenis akar berdasarkan nilai D:",
    parts: [
      { label: "a.", math: "x^2 - 6x + 9 = 0 \\Rightarrow D = \\ldots \\Rightarrow \\text{jenis akar: ...}" },
      { label: "b.", math: "3x^2 + 2x + 4 = 0 \\Rightarrow D = \\ldots \\Rightarrow \\text{jenis akar: ...}" },
      { label: "c.", math: "x^2 - 7x + 10 = 0 \\Rightarrow D = \\ldots \\Rightarrow \\text{jenis akar: ...}" },
    ],
  }),
  Qn(3, "Menentukan Nilai k – D > 0 – TKA", {
    type: "mixed",
    content: "Tentukan nilai k agar PK memiliki dua akar real berbeda (D > 0):",
    parts: [
      { label: "a.", math: "x^2 + kx + 1 = 0 \\Rightarrow k^2 - 4 > 0 \\Rightarrow k = \\ldots" },
      { label: "b.", math: "x^2 - 6x + k = 0 \\Rightarrow 36 - 4k > 0 \\Rightarrow k < \\ldots" },
      { label: "c.", math: "kx^2 - 2x + 1 = 0 \\Rightarrow 4 - 4k > 0 \\Rightarrow k < \\ldots" },
    ],
  }),
  Qn(4, "Menentukan Nilai k – D = 0 – UN", {
    type: "mixed",
    content: "Tentukan nilai k agar PK memiliki akar kembar:",
    parts: [
      { label: "a.", math: "x^2 + kx + 9 = 0 \\Rightarrow k^2 - 36 = 0 \\Rightarrow k = \\ldots" },
      { label: "b.", math: "x^2 - 8x + k = 0 \\Rightarrow 64 - 4k = 0 \\Rightarrow k = \\ldots" },
      { label: "c.", math: "kx^2 - 6x + 3 = 0 \\Rightarrow 36 - 12k = 0 \\Rightarrow k = \\ldots" },
    ],
  }),
  Qn(5, "Menentukan Nilai k – D < 0 – ANBK", {
    type: "mixed",
    content: "Tentukan nilai k agar PK tidak memiliki akar real (D < 0):",
    parts: [
      { label: "a.", math: "x^2 + 4x + k = 0 \\Rightarrow 16 - 4k < 0 \\Rightarrow k > \\ldots" },
      { label: "b.", math: "x^2 - 2x + k = 0 \\Rightarrow 4 - 4k < 0 \\Rightarrow k > \\ldots" },
      { label: "c.", math: "kx^2 + 4x + 4 = 0, k > 0 \\Rightarrow 16 - 16k < 0 \\Rightarrow k > \\ldots" },
    ],
  }),
  Qn(6, "Diskriminan Campuran – UN", {
    type: "mixed",
    content: "Hitung D dan tentukan jenis akar:",
    parts: [
      { label: "a.", math: "4x^2 - 4x + 1 = 0" },
      { label: "b.", math: "x^2 - \\sqrt{5}x + 1 = 0" },
      { label: "c.", math: "3x^2 + 5x - 2 = 0" },
    ],
  }),
  Qn(7, "Soal Cerita – Diskriminan – TKA", {
    type: "mixed",
    content: "Sebuah roket ditembakkan dengan lintasan h = −4t² + 16t + k. Untuk h = 0 memiliki 2 akar real berbeda.",
    parts: [
      { label: "a.", math: "D = 16^2 - 4(-4)(k) > 0" },
      { label: "b.", math: "256 + 16k > 0 \\Rightarrow k > \\ldots" },
      { label: "c.", text: "Apa artinya secara kontekstual jika D > 0?" },
    ],
  }),
  Qn(8, "Diskriminan dan Grafik Parabola – ANBK", {
    type: "mixed",
    content: "Diskriminan menentukan berapa kali grafik y = ax² + bx + c memotong sumbu-x:",
    parts: [
      { label: "a.", math: "y = x^2 - 4x + 3: D = \\ldots \\Rightarrow \\text{potong sumbu-x } \\ldots \\text{ kali}" },
      { label: "b.", math: "y = x^2 - 2x + 1: D = \\ldots \\Rightarrow \\text{potong/menyinggung sumbu-x}" },
      { label: "c.", math: "y = x^2 + x + 2: D = \\ldots \\Rightarrow \\text{tidak memotong sumbu-x}" },
    ],
  }),
  Qn(9, "Diskriminan – Koef. Besar – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "6x^2 - 7x + 2 = 0 \\Rightarrow D = \\ldots" },
      { label: "b.", math: "9x^2 - 6x + 1 = 0 \\Rightarrow D = \\ldots" },
      { label: "c.", math: "4x^2 + 4x + 5 = 0 \\Rightarrow D = \\ldots" },
    ],
  }),
  Qn(10, "Menentukan Jenis Akar Tanpa Menghitung – UN", {
    type: "mixed",
    content: "Tanpa menyelesaikan PK, tentukan jenis akar-akarnya:",
    parts: [
      { label: "a.", math: "x^2 - 10x + 25 = 0" },
      { label: "b.", math: "2x^2 + x + 3 = 0" },
      { label: "c.", math: "5x^2 - 12x + 4 = 0" },
    ],
  }),
  Qn(11, "Diskriminan – Akar Kembar Sempurna – ANBK", {
    type: "mixed",
    content: "Jika D = 0, PK memiliki akar kembar. Tentukan akar kembar dari:",
    parts: [
      { label: "a.", math: "x^2 - 4x + 4 = 0" },
      { label: "b.", math: "4x^2 - 20x + 25 = 0" },
      { label: "c.", math: "9x^2 + 12x + 4 = 0" },
    ],
  }),
  Qn(12, "Diskriminan – Persamaan dengan Dua Variabel – TKA", {
    type: "mixed",
    content: "Tentukan nilai k agar persamaan memiliki akar kembar:",
    parts: [
      { label: "a.", math: "x^2 - (k+2)x + 4 = 0" },
      { label: "b.", math: "x^2 + 2kx + 9 = 0" },
      { label: "c.", math: "kx^2 - 4x + k = 0 \\quad (k \\neq 0)" },
    ],
  }),
  Qn(13, "Diskriminan pada Soal UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 + 5x + 7 = 0 \\Rightarrow D = 25 - 28 = \\ldots" },
      { label: "b.", math: "x^2 - 5x - 14 = 0 \\Rightarrow D = 25 + 56 = \\ldots" },
      { label: "c.", math: "2x^2 - 3x + 2 = 0 \\Rightarrow D = 9 - 16 = \\ldots" },
    ],
  }),
  Qn(14, "Diskriminan Grafis – ANBK", {
    type: "mixed",
    content: "Perhatikan parabola y = x² − 6x + 9:",
    parts: [
      { label: "a.", text: "Hitung diskriminannya." },
      { label: "b.", text: "Apakah grafik memotong, menyinggung, atau tidak menyentuh sumbu-x?" },
      { label: "c.", math: "\\text{Tentukan titik singgung dengan sumbu-x}" },
    ],
  }),
  Qn(15, "Syarat D untuk Berbagai Kondisi – TKA", {
    type: "mixed",
    content: "Lengkapi tabel berikut:",
    parts: [
      { label: "D > 0", text: "→ akar-akar: ..." },
      { label: "D = 0", text: "→ akar-akar: ..." },
      { label: "D < 0", text: "→ akar-akar: ..." },
    ],
  }),
  Qn(16, "Nilai k – Dua Kondisi – UN", {
    type: "mixed",
    content: "Diketahui: x² − (2k+1)x + k² = 0",
    parts: [
      { label: "a.", math: "\\text{Hitung D dalam k: } D = (2k+1)^2 - 4k^2" },
      { label: "b.", math: "D = 4k + 1 \\Rightarrow \\text{agar D} = 0: k = \\ldots" },
      { label: "c.", math: "\\text{Agar D} > 0: k > \\ldots" },
    ],
  }),
  Qn(17, "Diskriminan – Perbandingan Persamaan – ANBK", {
    type: "mixed",
    content: "Bandingkan diskriminan dari dua PK berikut:",
    parts: [
      { label: "a.", math: "P: x^2 - 4x + 3 = 0 \\Rightarrow D_P = \\ldots" },
      { label: "b.", math: "Q: x^2 - 4x + 4 = 0 \\Rightarrow D_Q = \\ldots" },
      { label: "c.", text: "Mana yang memiliki akar real berbeda? Mengapa?" },
    ],
  }),
  Qn(18, "Diskriminan – Soal Cerita Kontekstual – UN", {
    type: "mixed",
    content: "Harga jual barang: H(x) = x² − 8x + 15. Kapan harga sama dengan 0?",
    parts: [
      { label: "a.", math: "D = 64 - 60 = \\ldots" },
      { label: "b.", text: "Berapa solusi yang ada? Apa artinya?" },
      { label: "c.", math: "x = \\frac{8 \\pm \\sqrt{4}}{2} = \\ldots" },
    ],
  }),
  Qn(19, "Diskriminan – Nilai Parameter – TKA", {
    type: "mixed",
    content: "Tentukan semua nilai p agar PK berikut memiliki akar real:",
    parts: [
      { label: "a.", math: "x^2 - 4x + p = 0 \\Rightarrow p \\leq \\ldots" },
      { label: "b.", math: "px^2 - 6x + 3 = 0 \\Rightarrow D = 36-12p \\geq 0 \\Rightarrow p \\leq \\ldots" },
      { label: "c.", math: "x^2 + px + p = 0 \\Rightarrow D = p^2 - 4p \\geq 0 \\Rightarrow p \\leq 0 \\text{ atau } p \\geq \\ldots" },
    ],
  }),
  Qn(20, "Akar Positif Keduanya – Syarat D dan Vieta – UN", {
    type: "mixed",
    content: "Agar kedua akar positif, harus dipenuhi: D ≥ 0, x₁+x₂ > 0, dan x₁·x₂ > 0.",
    parts: [
      { label: "a.", math: "x^2 - (k+1)x + k = 0 \\Rightarrow D \\geq 0?" },
      { label: "b.", math: "x_1 + x_2 = k+1 > 0 \\Rightarrow k > \\ldots" },
      { label: "c.", math: "x_1 x_2 = k > 0 \\Rightarrow k > \\ldots" },
    ],
  }),
  Qn(21, "Diskriminan – Soal UN Langsung", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 + 6x + 9 = 0 \\Rightarrow D = \\ldots" },
      { label: "b.", math: "2x^2 - 4x + 3 = 0 \\Rightarrow D = \\ldots" },
      { label: "c.", math: "3x^2 + 12x + 12 = 0 \\Rightarrow D = \\ldots" },
    ],
  }),
  Qn(22, "Diskriminan – Koef. Irasional – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x^2 - 2\\sqrt{3}x + 3 = 0 \\Rightarrow D = \\ldots" },
      { label: "b.", math: "x^2 + 2\\sqrt{2}x + 2 = 0 \\Rightarrow D = \\ldots" },
      { label: "c.", math: "x^2 - \\sqrt{5}x + 1 = 0 \\Rightarrow D = \\ldots" },
    ],
  }),
  Qn(23, "Soal HOTS – Diskriminan dan Jumlah Kuadrat Akar – TKA", {
    type: "mixed",
    content: "Akar-akar x² + px + q = 0 adalah x₁ dan x₂. Diketahui x₁² + x₂² = 10 dan D = 36.",
    parts: [
      { label: "a.", math: "x_1^2+x_2^2 = (x_1+x_2)^2 - 2x_1 x_2 = 10" },
      { label: "b.", math: "D = p^2 - 4q = 36" },
      { label: "c.", text: "Tentukan nilai p dan q." },
    ],
  }),
  Qn(24, "Diskriminan – Persamaan Tidak Lengkap – UN", {
    type: "mixed",
    content: "Hitung D untuk PK tidak lengkap (b = 0 atau c = 0):",
    parts: [
      { label: "a.", math: "x^2 - 9 = 0 \\Rightarrow D = 0 - 4(1)(-9) = \\ldots" },
      { label: "b.", math: "3x^2 - 6x = 0 \\Rightarrow D = (-6)^2 - 4(3)(0) = \\ldots" },
      { label: "c.", math: "x^2 = 0 \\Rightarrow D = \\ldots" },
    ],
  }),
  Qn(25, "Diskriminan – Soal UN/TKA Lanjut", {
    type: "mixed",
    content: "Tentukan nilai m agar kedua akar PK memiliki tanda berlawanan:",
    parts: [
      { label: "a.", math: "x^2 + 3x + m = 0 \\Rightarrow x_1 x_2 = m" },
      { label: "b.", text: "Akar berlawanan tanda ⟹ hasil kali akar < 0" },
      { label: "c.", math: "m < 0" },
    ],
  }),
  Qn(26, "Diskriminan – Nilai k Khusus – ANBK", {
    type: "mixed",
    content: "Tentukan nilai k agar PK berikut memiliki dua akar nyata yang berbeda:",
    parts: [
      { label: "a.", math: "x^2 - 2kx + k^2 - 1 = 0 \\Rightarrow D = 4k^2 - 4(k^2-1) = \\ldots" },
      { label: "b.", math: "D = 4 > 0 \\Rightarrow \\text{untuk semua nilai } k" },
      { label: "c.", text: "Apa kesimpulanmu dari soal ini?" },
    ],
  }),
  Qn(27, "Diskriminan – Soal Cerita Fisika – TKA", {
    type: "mixed",
    content: "Dua bola dilempar dari ketinggian berbeda. Pertama: h₁ = −5t² + 20t. Kedua: h₂ = −5t² + 10t.",
    parts: [
      { label: "a.", math: "\\text{PK } h_1 = 0: -5t^2+20t=0 \\Rightarrow D = \\ldots" },
      { label: "b.", math: "\\text{PK } h_2 = 0: -5t^2+10t=0 \\Rightarrow D = \\ldots" },
      { label: "c.", text: "Kapan masing-masing bola kembali ke tanah?" },
    ],
  }),
  Qn(28, "Diskriminan – Grafik Parabola Tidak Memotong – UN", {
    type: "mixed",
    content: "Tentukan nilai k agar grafik y = kx² + 4x + k tidak memotong sumbu-x:",
    parts: [
      { label: "a.", math: "D = 16 - 4k^2 < 0" },
      { label: "b.", math: "4k^2 > 16 \\Rightarrow k^2 > 4 \\Rightarrow |k| > 2" },
      { label: "c.", math: "k > 2 \\text{ atau } k < -2" },
    ],
  }),
  Qn(29, "Diskriminan – Soal Gabungan – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "5x^2 - 3x - 2 = 0 \\Rightarrow D = \\ldots" },
      { label: "b.", math: "7x^2 + 14x + 7 = 0 \\Rightarrow D = \\ldots" },
      { label: "c.", math: "2x^2 - 3x + 5 = 0 \\Rightarrow D = \\ldots" },
    ],
  }),
  Qn(30, "Hubungan Diskriminan dan Jumlah/Kali Akar – TKA", {
    type: "mixed",
    content: "Diketahui x₁ + x₂ = 5 dan x₁ · x₂ = 4. Hitung D:",
    parts: [
      { label: "a.", math: "\\text{Tulis PK: } x^2 - 5x + 4 = 0" },
      { label: "b.", math: "D = 25 - 16 = \\ldots" },
      { label: "c.", math: "D = (x_1+x_2)^2 - 4x_1 x_2 = \\ldots" },
    ],
  }),
  Qn(31, "Diskriminan – Soal {t('practice.multipleChoice')} – UN", {
    type: "mixed",
    content: "Tentukan diskriminan dari masing-masing PK dan cocokkan dengan jenis akarnya:",
    parts: [
      { label: "a.", math: "x^2 - 2x - 3 = 0 \\Rightarrow D = \\ldots" },
      { label: "b.", math: "x^2 - 2x + 1 = 0 \\Rightarrow D = \\ldots" },
      { label: "c.", math: "x^2 - 2x + 2 = 0 \\Rightarrow D = \\ldots" },
    ],
  }),
  Qn(32, "Diskriminan – Akar Kembar Positif – ANBK", {
    type: "mixed",
    content: "Tentukan nilai k agar PK memiliki akar kembar positif:",
    parts: [
      { label: "a.", math: "x^2 - 2kx + k+2 = 0 \\Rightarrow D = 4k^2 - 4(k+2) = 0" },
      { label: "b.", math: "k^2 - k - 2 = 0 \\Rightarrow (k-2)(k+1) = 0" },
      { label: "c.", math: "k = 2 \\text{ atau } k = -1. \\text{ Mana yang memberi akar positif?}" },
    ],
  }),
  Qn(33, "Diskriminan dan Faktorisasi – UN", {
    type: "mixed",
    content: "Jika D adalah bilangan kuadrat sempurna, PK bisa difaktorkan atas ℤ.",
    parts: [
      { label: "a.", math: "x^2 - 7x + 12 = 0: D = 49 - 48 = 1 = 1^2 \\Rightarrow \\text{faktorkan!}" },
      { label: "b.", math: "2x^2 + 5x - 3 = 0: D = 25 + 24 = 49 = 7^2 \\Rightarrow \\text{faktorkan!}" },
      { label: "c.", math: "x^2 + 3x - 1 = 0: D = 9 + 4 = 13 \\Rightarrow \\text{bisa difaktorkan?}" },
    ],
  }),
  Qn(34, "Diskriminan – Soal TKA HOTS", {
    type: "mixed",
    content: "Diketahui PK: x² − 2mx + (m² − n) = 0, m, n > 0.",
    parts: [
      { label: "a.", math: "D = 4m^2 - 4(m^2-n) = 4n" },
      { label: "b.", text: "Karena n > 0, maka D > 0. Apa artinya?" },
      { label: "c.", math: "x = m \\pm \\sqrt{n} \\Rightarrow x_1 = m+\\sqrt{n},\\; x_2 = m-\\sqrt{n}" },
    ],
  }),
  Qn(35, "Diskriminan – Soal Ekonomi – ANBK", {
    type: "mixed",
    content: "Keuntungan suatu usaha: K(x) = −x² + 6x + k. Agar terdapat titik impas (K = 0), maka:",
    parts: [
      { label: "a.", math: "D = 36 + 4k \\geq 0 \\Rightarrow k \\geq \\ldots" },
      { label: "b.", text: "Jika k = −9, berapa titik impasnya?" },
      { label: "c.", text: "Interpretasikan secara ekonomi jika D < 0." },
    ],
  }),
  Qn(36, "Diskriminan – Pencocokan – TKA", {
    type: "mixed",
    content: "Pasangkan PK dengan jenis akarnya:",
    parts: [
      { label: "a.", math: "x^2 + 8x + 16 = 0" },
      { label: "b.", math: "x^2 + 8x + 15 = 0" },
      { label: "c.", math: "x^2 + 8x + 17 = 0" },
    ],
  }),
  Qn(37, "Diskriminan – Soal UN Lanjutan", {
    type: "mixed",
    parts: [
      { label: "a.", math: "4x^2 - 4x + 1 = 0 \\Rightarrow D = \\ldots" },
      { label: "b.", math: "5x^2 + 3x + 2 = 0 \\Rightarrow D = \\ldots" },
      { label: "c.", math: "6x^2 - 7x - 3 = 0 \\Rightarrow D = \\ldots" },
    ],
  }),
  Qn(38, "Diskriminan – Soal UN/TKA Terapan", {
    type: "mixed",
    content: "Sebuah benda bergerak dengan posisi s = 2t² − 8t + 6.",
    parts: [
      { label: "a.", math: "\\text{Saat } s = 0: 2t^2 - 8t + 6 = 0 \\Rightarrow t^2-4t+3=0" },
      { label: "b.", math: "D = 16 - 12 = \\ldots \\Rightarrow \\text{jenis akar: ...}" },
      { label: "c.", math: "t = \\frac{4 \\pm \\sqrt{4}}{2} = \\ldots" },
    ],
  }),
  Qn(39, "Diskriminan – Menentukan Interval k – ANBK", {
    type: "mixed",
    content: "PK: x² + 2(k−1)x + k² = 0. Tentukan nilai k agar memiliki dua akar real.",
    parts: [
      { label: "a.", math: "D = 4(k-1)^2 - 4k^2 \\geq 0" },
      { label: "b.", math: "4(k^2-2k+1) - 4k^2 = -8k+4 \\geq 0" },
      { label: "c.", math: "k \\leq \\frac{1}{2}" },
    ],
  }),
  Qn(40, "HOTS – Diskriminan + Vieta + Penerapan – UN/TKA", {
    type: "mixed",
    content: "PK: 2x² − (3k+2)x + k² = 0 memiliki dua akar real x₁ dan x₂.",
    parts: [
      { label: "a.", math: "D = (3k+2)^2 - 8k^2 \\geq 0 \\Rightarrow k^2 + 12k + 4 \\geq 0" },
      { label: "b.", math: "x_1 + x_2 = \\frac{3k+2}{2},\\quad x_1 x_2 = \\frac{k^2}{2}" },
      { label: "c.", math: "\\text{Jika } k = 2, \\text{ tentukan } x_1^2 + x_2^2" },
    ],
  }),
];

const DiskriminanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            DISKRIMINAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Persamaan Kuadrat · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 40 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-3">📐 Rumus Diskriminan</p>
          <div className={isDark ? "bg-white/5 rounded-lg px-3 py-3 mb-2 flex justify-center" : "bg-gray-50 rounded-lg px-3 py-3 mb-2 flex justify-center"}>
            <BlockMath math="D = b^2 - 4ac" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { name: "D > 0", math: "2 \\text{ akar real berbeda}", color: "text-green-400" },
              { name: "D = 0", math: "\\text{akar kembar}", color: "text-blue-400" },
              { name: "D < 0", math: "\\text{tidak real}", color: "text-red-400" },
            ].map(r => (
              <div key={r.name} className={isDark ? "bg-white/5 rounded-lg px-2 py-2 text-center" : "bg-gray-50 rounded-lg px-2 py-2 text-center"}>
                <div className={`text-xs font-bold mb-1 ${r.color}`}>{r.name}</div>
                <div className={`text-[10px] overflow-x-auto ${r.color}`}><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className={isDark ? "absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" : "absolute inset-0 bg-gradient-to-br from-rose-50/60 via-white/80 to-pink-50/40 backdrop-blur"} />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className={isDark ? "font-body text-sm text-white/90 leading-relaxed mb-3" : "font-body text-sm text-gray-800 leading-relaxed mb-3"}>{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-rose-900/20 border border-rose-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className={isDark ? "mb-3 flex justify-center bg-white/5 rounded-xl p-3" : "mb-3 flex justify-center bg-gray-50 rounded-xl p-3"}>{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={isDark ? "flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5" : "flex items-start gap-2 rounded-lg px-3 py-2 bg-gray-50"}>
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className={isDark ? "text-white text-sm overflow-x-auto" : "text-foreground text-sm overflow-x-auto"}><InlineMath math={p.math} /></div>
                              : <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>{p.text}</p>}
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
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Persamaan Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default DiskriminanPage;
