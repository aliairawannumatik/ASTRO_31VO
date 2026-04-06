import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { TrendingUp } from "lucide-react";
import CoordPlane from "../koordinat-cartesius/CoordPlane";

const accentColor = "#34d399";
const accentDim = "rgba(52,211,153,0.12)";
const borderColor = "rgba(52,211,153,0.25)";

type Part = { label: string; math?: string; text?: string };
type Badge = "UN" | "ANBK" | "TKA" | "AKM";
type Q = {
  n: number; title: string;
  content?: string; math?: string; blockMath?: string;
  parts?: Part[];
  badge?: Badge;
  diagram?: Parameters<typeof CoordPlane>[0];
  type: "essay" | "mixed" | "diagram-only";
};

const badgeStyle: Record<Badge, string> = {
  UN: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
  ANBK: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  TKA: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  AKM: "bg-green-500/20 text-green-300 border-green-400/40",
};

const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Membuat Tabel Nilai — Garis Pertama", {
    badge: "ANBK",
    type: "mixed",
    content: "Lengkapi tabel nilai untuk menggambar grafik persamaan berikut:",
    blockMath: "x + y = 5",
    parts: [
      { label: "x =", text: "0 → y = ?   dan   x = 5 → y = ?" },
      { label: "b.", text: "Gambarkan garis tersebut pada bidang koordinat." },
    ],
  }),
  Q(2, "Tabel Nilai Garis Kedua", {
    badge: "ANBK",
    type: "mixed",
    content: "Buat tabel nilai untuk:",
    blockMath: "x - y = 1",
    parts: [
      { label: "x =", text: "0 → y = ?   dan   x = 1 → y = ?" },
      { label: "b.", text: "Gambar garis tersebut pada bidang koordinat yang sama dengan soal no. 1." },
      { label: "c.", text: "Tentukan titik potong kedua garis tersebut." },
    ],
  }),
  Q(3, "Grafik SPLDV — Satu Solusi", {
    badge: "UN",
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -7, y1: 12, x2: 7, y2: -2, color: "#34d399", label: "L₁" },
        { x1: -7, y1: -5, x2: 7, y2: 9, color: "#f472b6", label: "L₂" },
      ],
      pts: [{ x: 3, y: 3, label: "(3,3)", color: "#facc15", labelPos: "tr" }],
    },
    content: "Dari grafik di samping, dua garis L₁ dan L₂ berpotongan:",
    parts: [
      { label: "a.", text: "Baca koordinat titik potong kedua garis!" },
      { label: "b.", text: "Apakah titik potong itu merupakan penyelesaian SPLDV? Mengapa?" },
    ],
  }),
  Q(4, "Garis Sejajar — Tidak Ada Solusi", {
    badge: "UN",
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -6, y1: 2, x2: 6, y2: 2, color: "#34d399", label: "y=2" },
        { x1: -6, y1: -2, x2: 6, y2: -2, color: "#f472b6", label: "y=−2" },
      ],
    },
    parts: [
      { label: "a.", text: "Apa yang dapat kamu simpulkan dari dua garis sejajar dalam SPLDV?" },
      { label: "b.", text: "Berapa banyak penyelesaian SPLDV ini?" },
      { label: "c.", math: "\\text{SPLDV: } \\begin{cases} x + 2y = 8 \\\\ x + 2y = 2 \\end{cases} \\text{ — ada solusi?}" },
    ],
  }),
  Q(5, "Garis Berimpit — Tak Hingga Solusi", {
    badge: "TKA",
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -4, y1: 6, x2: 6, y2: -4, color: "#facc15", label: "L₁=L₂" }],
    },
    content: "Dua garis berimpit saat satu persamaan merupakan kelipatan persamaan lainnya.",
    parts: [
      { label: "a.", math: "\\text{Contoh: } \\begin{cases} x + y = 3 \\\\ 2x + 2y = 6 \\end{cases}" },
      { label: "b.", text: "Mengapa kedua persamaan menghasilkan garis yang sama?" },
      { label: "c.", text: "Berapa banyak penyelesaiannya? Apa artinya?" },
    ],
  }),
  Q(6, "Metode Grafik — Langkah Demi Langkah", {
    badge: "UN",
    type: "mixed",
    blockMath: "\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}",
    parts: [
      { label: "1.", text: "Tentukan dua titik pada persamaan 2x + y = 7 (gunakan x=0 dan y=0)." },
      { label: "2.", text: "Tentukan dua titik pada persamaan x − y = 2 (gunakan x=0 dan y=0)." },
      { label: "3.", text: "Gambar kedua garis pada satu bidang koordinat." },
      { label: "4.", text: "Tentukan titik potong dan tulis penyelesaian SPLDV." },
    ],
  }),
  Q(7, "Titik Potong Sumbu", {
    badge: "ANBK",
    type: "mixed",
    content: "Tentukan titik potong garis dengan sumbu-x dan sumbu-y untuk setiap persamaan berikut:",
    parts: [
      { label: "a.", math: "3x + 2y = 12" },
      { label: "b.", math: "x - 4y = 8" },
      { label: "c.", math: "5x + 3y = 15" },
      { label: "d.", math: "2x - y = 6" },
    ],
  }),
  Q(8, "Grafik — Baca Solusi", {
    badge: "UN",
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: 0, y1: 4, x2: 4, y2: 0, color: "#34d399", label: "x+y=4" },
        { x1: 0, y1: -2, x2: 6, y2: 4, color: "#f472b6", label: "x−y=2" },
      ],
      pts: [{ x: 3, y: 1, label: "(3,1)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Baca koordinat titik potong kedua garis." },
      { label: "b.", text: "Verifikasi solusi tersebut dengan mensubstitusikan ke kedua persamaan." },
    ],
  }),
  Q(9, "Menentukan Persamaan dari Grafik", {
    badge: "TKA",
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -2, y1: 4, x2: 4, y2: -2, color: "#a78bfa", label: "L₁" },
        { x1: -2, y1: -4, x2: 4, y2: 2, color: "#fb923c", label: "L₂" },
      ],
      pts: [
        { x: 1, y: 1, label: "P(1,1)", color: "#facc15", labelPos: "tr" },
      ],
    },
    parts: [
      { label: "a.", text: "Baca titik potong kedua garis dari diagram." },
      { label: "b.", text: "Jika L₁ melalui (0, 2) dan (2, 0), tentukan persamaan L₁." },
      { label: "c.", text: "Jika L₂ melalui (0, −2) dan (2, 0), tentukan persamaan L₂." },
    ],
  }),
  Q(10, "Soal SPLDV Metode Grafik", {
    badge: "UN",
    type: "mixed",
    blockMath: "\\begin{cases} x + y = 6 \\\\ x - y = 2 \\end{cases}",
    parts: [
      { label: "a.", text: "Tentukan titik potong garis x + y = 6 dengan sumbu koordinat." },
      { label: "b.", text: "Tentukan titik potong garis x − y = 2 dengan sumbu koordinat." },
      { label: "c.", text: "Gambar kedua garis dan tentukan solusi SPLDV." },
    ],
  }),
  Q(11, "Mencari Himpunan Penyelesaian — Grafik", {
    badge: "ANBK",
    type: "mixed",
    blockMath: "\\begin{cases} 3x - y = 4 \\\\ x + y = 8 \\end{cases}",
    parts: [
      { label: "a.", text: "Buat tabel nilai untuk persamaan 3x − y = 4." },
      { label: "b.", text: "Buat tabel nilai untuk persamaan x + y = 8." },
      { label: "c.", text: "Gambar kedua garis dan tentukan titik potongnya." },
    ],
  }),
  Q(12, "Grafik SPLDV — Persamaan Horizontal dan Miring", {
    badge: "TKA",
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -6, y1: 3, x2: 6, y2: 3, color: "#34d399", label: "y=3" },
        { x1: -2, y1: -6, x2: 4, y2: 6, color: "#f472b6", label: "2x−y=1" },
      ],
      pts: [{ x: 2, y: 3, label: "(2,3)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Baca titik potong dari diagram." },
      { label: "b.", text: "Verifikasi bahwa (2, 3) memenuhi y = 3 dan 2x − y = 1." },
    ],
  }),
  Q(13, "Persamaan Vertikal dalam Grafik", {
    badge: "UN",
    type: "mixed",
    blockMath: "\\begin{cases} x = 4 \\\\ 2x + y = 10 \\end{cases}",
    parts: [
      { label: "a.", text: "Gambarkan garis x = 4 (vertikal) pada bidang koordinat." },
      { label: "b.", text: "Gambarkan garis 2x + y = 10 dengan mencari titik potong sumbu." },
      { label: "c.", text: "Baca titik potongnya dan verifikasi." },
    ],
  }),
  Q(14, "Gradien Garis", {
    badge: "ANBK",
    type: "mixed",
    content: "Tentukan gradien (kemiringan) setiap garis berikut untuk menentukan apakah sejajar atau tidak:",
    parts: [
      { label: "a.", math: "2x + y = 5 \\text{ dan } 2x + y = 9" },
      { label: "b.", math: "x - 3y = 6 \\text{ dan } 2x - 6y = 1" },
      { label: "c.", math: "3x + 2y = 7 \\text{ dan } 2x - 3y = 4" },
    ],
  }),
  Q(15, "Menentukan SPLDV dari Dua Garis", {
    badge: "TKA",
    type: "mixed",
    content: "Dua garis diberikan sebagai berikut:",
    blockMath: "L_1: y = 2x - 1 \\qquad L_2: y = -x + 5",
    parts: [
      { label: "a.", text: "Ubah L₁ dan L₂ ke bentuk standar ax + by = c." },
      { label: "b.", text: "Tentukan titik potong kedua garis dengan menggunakan grafik." },
      { label: "c.", text: "Verifikasi solusinya secara aljabar." },
    ],
  }),
  Q(16, "Grafik Tiga Garis", {
    badge: "AKM",
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: 0, y1: 6, x2: 6, y2: 0, color: "#34d399", label: "L₁" },
        { x1: 0, y1: 2, x2: 6, y2: 2, color: "#f472b6", label: "L₂" },
        { x1: 4, y1: -7, x2: 4, y2: 7, color: "#a78bfa", label: "L₃" },
      ],
      pts: [
        { x: 4, y: 2, label: "P", color: "#facc15", labelPos: "tr" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan titik potong L₁ dan L₂." },
      { label: "b.", text: "Tentukan titik potong L₁ dan L₃." },
      { label: "c.", text: "Tentukan titik potong L₂ dan L₃." },
    ],
  }),
  Q(17, "Mencari Solusi Grafik Lengkap", {
    badge: "UN",
    type: "mixed",
    blockMath: "\\begin{cases} y = x + 2 \\\\ y = -2x + 5 \\end{cases}",
    parts: [
      { label: "a.", text: "Gambar garis y = x + 2 dengan mencari minimal 2 titik." },
      { label: "b.", text: "Gambar garis y = −2x + 5 dengan mencari minimal 2 titik." },
      { label: "c.", text: "Tentukan titik potong kedua garis dari grafik." },
    ],
  }),
  Q(18, "Nilai Titik Potong", {
    badge: "ANBK",
    type: "mixed",
    content: "Dari grafik SPLDV yang diberikan, titik potong kedua garis berada di (2, 4). Manakah SPLDV yang penyelesaiannya adalah (2, 4)?",
    parts: [
      { label: "A.", math: "\\begin{cases} x + y = 7 \\\\ x - y = 2 \\end{cases}" },
      { label: "B.", math: "\\begin{cases} x + y = 6 \\\\ x - y = -2 \\end{cases}" },
      { label: "C.", math: "\\begin{cases} 2x + y = 8 \\\\ x - y = -2 \\end{cases}" },
      { label: "D.", math: "\\begin{cases} x + 2y = 10 \\\\ 2x - y = 0 \\end{cases}" },
    ],
  }),
  Q(19, "Titik Potong dan Konteks", {
    badge: "UN",
    type: "mixed",
    content: "Jati menjual kue dan es. Grafiknya menunjukkan hubungan antara harga dan jumlah. Titik potong ada di (5, 3.000).",
    parts: [
      { label: "a.", text: "Apa arti titik potong (5, 3.000) dalam konteks ini?" },
      { label: "b.", text: "Apakah titik potong selalu merupakan solusi SPLDV? Jelaskan!" },
    ],
  }),
  Q(20, "SPLDV Dengan Desimal", {
    badge: "TKA",
    type: "mixed",
    blockMath: "\\begin{cases} 0.5x + y = 3 \\\\ x - 0.5y = 1 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan setiap persamaan agar koefisiennya bilangan bulat." },
      { label: "b.", text: "Tentukan titik potong sumbu untuk masing-masing garis." },
      { label: "c.", text: "Gambar kedua garis dan baca solusinya." },
    ],
  }),
  Q(21, "Mengecek Solusi dari Grafik", {
    badge: "ANBK",
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: 0, y1: 5, x2: 5, y2: 0, color: "#34d399", label: "x+y=5" },
        { x1: 0, y1: 1, x2: 4, y2: 5, color: "#f472b6", label: "x−y=−1" },
      ],
      pts: [{ x: 2, y: 3, label: "(2,3)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Dari grafik, baca solusi SPLDV." },
      { label: "b.", text: "Verifikasi bahwa (2, 3) memenuhi x + y = 5." },
      { label: "c.", text: "Verifikasi bahwa (2, 3) memenuhi x − y = −1." },
    ],
  }),
  Q(22, "Penyelesaian Unik dari Grafik", {
    badge: "UN",
    type: "mixed",
    blockMath: "\\begin{cases} x + 2y = 8 \\\\ 2x - y = 6 \\end{cases}",
    parts: [
      { label: "a.", text: "Cari dua titik pada garis x + 2y = 8." },
      { label: "b.", text: "Cari dua titik pada garis 2x − y = 6." },
      { label: "c.", text: "Gambar dan temukan solusi SPLDV." },
      { label: "d.", text: "Apakah kedua garis sejajar? Berapa solusinya?" },
    ],
  }),
  Q(23, "SPLDV Garis Berpotongan di Asal", {
    badge: "TKA",
    type: "mixed",
    blockMath: "\\begin{cases} y = 2x \\\\ y = -x \\end{cases}",
    parts: [
      { label: "a.", text: "Gambar kedua garis." },
      { label: "b.", text: "Di titik mana mereka berpotongan?" },
      { label: "c.", text: "Apa penyelesaian SPLDV ini?" },
    ],
  }),
  Q(24, "Kasus Khusus — SPLDV Paralel", {
    badge: "UN",
    type: "mixed",
    blockMath: "\\begin{cases} 2x + 3y = 6 \\\\ 4x + 6y = 18 \\end{cases}",
    parts: [
      { label: "a.", text: "Tentukan gradien setiap garis." },
      { label: "b.", text: "Apakah kedua garis sejajar?" },
      { label: "c.", text: "Berapa penyelesaian SPLDV ini?" },
    ],
  }),
  Q(25, "Kasus Khusus — Garis Berimpit", {
    badge: "ANBK",
    type: "mixed",
    blockMath: "\\begin{cases} x + 2y = 4 \\\\ 3x + 6y = 12 \\end{cases}",
    parts: [
      { label: "a.", text: "Sederhanakan persamaan kedua." },
      { label: "b.", text: "Apa yang terjadi dengan kedua garis?" },
      { label: "c.", text: "Berapa banyak penyelesaiannya?" },
    ],
  }),
  Q(26, "Baca Grafik — Pasangan Nilai", {
    badge: "AKM",
    type: "mixed",
    diagram: {
      size: 260, range: 8,
      segs: [
        { x1: 0, y1: 6, x2: 8, y2: -2, color: "#34d399", label: "L₁" },
        { x1: 0, y1: -4, x2: 8, y2: 4, color: "#fb923c", label: "L₂" },
      ],
      pts: [{ x: 5, y: 1, label: "(5,1)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Baca titik potong dari diagram." },
      { label: "b.", text: "Tulis penyelesaian HP SPLDV tersebut." },
    ],
  }),
  Q(27, "Menentukan Solusi Grafik", {
    badge: "UN",
    type: "mixed",
    content: "Diketahui garis y = x + 1 dan y = 3.",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -4, y1: -3, x2: 6, y2: 7, color: "#34d399", label: "y=x+1" },
        { x1: -6, y1: 3, x2: 6, y2: 3, color: "#f472b6", label: "y=3" },
      ],
      pts: [{ x: 2, y: 3, label: "(2,3)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Tentukan titik potong y = x + 1 dengan y = 3 dari diagram." },
      { label: "b.", text: "Verifikasi solusi tersebut secara aljabar." },
    ],
  }),
  Q(28, "Aplikasi Grafik — Masalah Ekonomi", {
    badge: "AKM",
    type: "mixed",
    content: "Harga penawaran suatu barang: P = 2Q + 4. Harga permintaan: P = −Q + 10. (P = harga, Q = kuantitas)",
    parts: [
      { label: "a.", text: "Gambarkan kedua garis pada sistem koordinat P-Q." },
      { label: "b.", text: "Tentukan titik keseimbangan (equilibrium) dari grafik." },
      { label: "c.", text: "Verifikasi solusi tersebut." },
    ],
  }),
  Q(29, "Koordinat Perpotongan", {
    badge: "TKA",
    type: "mixed",
    blockMath: "\\begin{cases} y = 3 \\\\ x + y = 7 \\end{cases}",
    parts: [
      { label: "a.", text: "Gambar garis y = 3 (horizontal)." },
      { label: "b.", text: "Gambar garis x + y = 7." },
      { label: "c.", text: "Tentukan titik potong dari gambar." },
    ],
  }),
  Q(30, "Metode Grafik — Rekap Prosedur", {
    badge: "UN",
    type: "mixed",
    content: "Jelaskan langkah-langkah metode grafik untuk menyelesaikan SPLDV berikut:",
    blockMath: "\\begin{cases} x + 3y = 9 \\\\ 2x - y = 4 \\end{cases}",
    parts: [
      { label: "Langkah 1:", text: "Buat tabel nilai (minimal 2 titik) untuk masing-masing persamaan." },
      { label: "Langkah 2:", text: "Gambar kedua garis pada satu bidang koordinat." },
      { label: "Langkah 3:", text: "Tentukan titik potong." },
      { label: "Langkah 4:", text: "Tulis himpunan penyelesaian (HP)." },
    ],
  }),
  Q(31, "Baca Titik dari Grafik — UN Style", {
    badge: "UN",
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: 0, y1: 4, x2: 4, y2: 0, color: "#a78bfa", label: "L₁: x+y=4" },
        { x1: 0, y1: 0, x2: 4, y2: 4, color: "#fb923c", label: "L₂: y=x" },
      ],
      pts: [{ x: 2, y: 2, label: "(2,2)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Baca titik potong dari grafik." },
      { label: "b.", text: "Tuliskan HP dari SPLDV tersebut." },
    ],
  }),
  Q(32, "Soal UN — Pilih Grafik yang Tepat", {
    badge: "UN",
    type: "mixed",
    content: "SPLDV berikut memiliki penyelesaian (4, 1). Grafik manakah yang sesuai?",
    blockMath: "\\begin{cases} x + y = 5 \\\\ x - y = 3 \\end{cases}",
    parts: [
      { label: "a.", text: "Tentukan titik potong sumbu untuk persamaan pertama." },
      { label: "b.", text: "Tentukan titik potong sumbu untuk persamaan kedua." },
      { label: "c.", text: "Verifikasi bahwa (4, 1) memenuhi kedua persamaan." },
    ],
  }),
  Q(33, "Interpretasi Grafik Kontekstual", {
    badge: "AKM",
    type: "mixed",
    content: "Dua orang pelari berlari dengan kecepatan berbeda dari titik awal yang sama. Grafik menunjukkan posisi mereka terhadap waktu. Titik potong grafik berada di t = 4, s = 20.",
    parts: [
      { label: "a.", text: "Apa arti titik potong (4, 20) dalam konteks ini?" },
      { label: "b.", text: "Siapa yang lebih cepat sebelum t = 4? Setelah t = 4?" },
    ],
  }),
  Q(34, "Garis Melalui Titik Asal", {
    badge: "ANBK",
    type: "mixed",
    blockMath: "\\begin{cases} y = 3x \\\\ 2x + y = 10 \\end{cases}",
    parts: [
      { label: "a.", text: "Gambar garis y = 3x (melalui titik asal)." },
      { label: "b.", text: "Gambar garis 2x + y = 10." },
      { label: "c.", text: "Tentukan penyelesaian SPLDV dari grafik." },
    ],
  }),
  Q(35, "Soal Grafik — Gradien Negatif", {
    badge: "TKA",
    type: "mixed",
    blockMath: "\\begin{cases} y = -2x + 8 \\\\ y = x - 1 \\end{cases}",
    parts: [
      { label: "a.", text: "Buat tabel nilai untuk y = −2x + 8 (gunakan x = 0, 2, 4)." },
      { label: "b.", text: "Buat tabel nilai untuk y = x − 1 (gunakan x = 0, 2, 4)." },
      { label: "c.", text: "Gambar dan tentukan titik potong." },
    ],
  }),
  Q(36, "Verifikasi Secara Grafik", {
    badge: "ANBK",
    type: "mixed",
    content: "Seorang siswa mengklaim bahwa penyelesaian dari SPLDV:",
    blockMath: "\\begin{cases} 3x + y = 11 \\\\ x + 2y = 7 \\end{cases}",
    parts: [
      { label: "a.", text: "adalah (3, 2). Periksa apakah klaimnya benar secara grafik." },
      { label: "b.", text: "Verifikasi secara aljabar juga." },
    ],
  }),
  Q(37, "Titik Potong — ANBK", {
    badge: "ANBK",
    type: "mixed",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S) terkait metode grafik SPLDV:",
    parts: [
      { label: "(1)", text: "Setiap garis linear dapat digambar dengan minimal 2 titik." },
      { label: "(2)", text: "Jika dua garis sejajar, titik potongnya ada di tak hingga." },
      { label: "(3)", text: "Titik potong dua garis merupakan penyelesaian dari kedua persamaan." },
      { label: "(4)", text: "Garis berimpit tidak memiliki solusi." },
    ],
  }),
  Q(38, "Menentukan x dan y dari Grafik", {
    badge: "UN",
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: 0, y1: 3, x2: 6, y2: 0, color: "#34d399", label: "2x+4y=12" },
        { x1: 0, y1: -2, x2: 3, y2: 4, color: "#f472b6", label: "2x−y=−2" },
      ],
      pts: [{ x: 1, y: 2.5, label: "(1, 2.5)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Baca nilai x dan y dari grafik." },
      { label: "b.", text: "Verifikasi solusi pada persamaan pertama." },
    ],
  }),
  Q(39, "Grafik Pecahan", {
    badge: "TKA",
    type: "mixed",
    blockMath: "\\begin{cases} \\frac{x}{3} + \\frac{y}{2} = 2 \\\\ x - y = 1 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama agar bebas pecahan." },
      { label: "b.", text: "Tentukan titik potong sumbu untuk masing-masing garis." },
      { label: "c.", text: "Gambar kedua garis dan tentukan penyelesaiannya." },
    ],
  }),
  Q(40, "Soal AKM — Interpretasi Grafik SPLDV", {
    badge: "AKM",
    type: "mixed",
    content: "Sebuah toko makanan memiliki dua menu paket: Paket A dan Paket B. Grafik penjualan menunjukkan bahwa pada hari ke-5, jumlah penjualan Paket A sama dengan Paket B yaitu 30 porsi.",
    parts: [
      { label: "a.", text: "Jika Paket A dijual 4 porsi/hari dan Paket B 2 porsi/hari, buat persamaan untuk setiap paket." },
      { label: "b.", text: "Gambarkan kedua garis pada koordinat dengan sumbu x = hari dan sumbu y = porsi." },
      { label: "c.", text: "Pada hari ke berapa jumlah penjualan keduanya sama? Berapa porsi masing-masing?" },
    ],
  }),
];

const MetodeGrafikPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <TrendingUp className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            PENYELESAIAN SPLDV — METODE GRAFIK
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · Latihan Mandiri · 40 Soal</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {(["UN","ANBK","TKA","AKM"] as Badge[]).map(b => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b]}`}>{b}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl overflow-hidden border"
              style={{ background: accentDim, borderColor }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b"
                style={{ borderColor, background: "rgba(52,211,153,0.08)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: accentColor + "30", color: accentColor }}>
                  {q.n}
                </div>
                <span className="font-display text-sm font-bold" style={{ color: accentColor }}>{q.title}</span>
                {q.badge && (
                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle[q.badge]}`}>
                    {q.badge}
                  </span>
                )}
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.content && <p className="font-body text-sm text-white/85 leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-white/90 text-sm"><InlineMath math={q.math} /></div>}
                {q.blockMath && (
                  <div className="rounded-xl px-4 py-3 text-white/90 overflow-x-auto"
                    style={{ background: "rgba(52,211,153,0.08)", border: `1px solid ${borderColor}` }}>
                    <BlockMath math={q.blockMath} />
                  </div>
                )}
                {q.diagram && (
                  <div className="flex justify-center my-1">
                    <CoordPlane {...q.diagram} />
                  </div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1">
                    {q.parts.map((p, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <span className="font-bold text-xs shrink-0 mt-0.5" style={{ color: accentColor }}>{p.label}</span>
                        <span className="font-body text-sm text-white/80 leading-relaxed">
                          {p.text && p.text}
                          {p.math && <InlineMath math={p.math} />}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/spldv"); }}
            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer font-body">
            ← Kembali ke Menu SPLDV
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetodeGrafikPage;
