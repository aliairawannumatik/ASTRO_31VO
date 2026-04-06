import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import CoordPlane from "../koordinat-cartesius/CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Grafik y = x + 2", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 2, label: "(0,2)", color: "#f472b6", labelPos: "tr" },
        { x: -2, y: 0, label: "(-2,0)", color: "#f472b6", labelPos: "tl" },
      ],
      segs: [{ x1: -5, y1: -3, x2: 4, y2: 6, color: "#f472b6", label: "y=x+2" }],
    },
    parts: [
      { label: "a.", math: "\\text{Tentukan titik potong garis } y = x + 2 \\text{ dengan sumbu-x dan sumbu-y.}" },
      { label: "b.", text: "Sketsa grafik garis tersebut." },
      { label: "c.", text: "Apakah titik (3, 5) terletak pada garis ini? Buktikan!" },
    ],
  }),

  Q(2, "Grafik y = 2x − 4", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: -4, label: "(0,−4)", color: "#60a5fa", labelPos: "tr" },
        { x: 2, y: 0, label: "(2,0)", color: "#60a5fa", labelPos: "top" },
      ],
      segs: [{ x1: -1, y1: -6, x2: 5, y2: 6, color: "#60a5fa", label: "y=2x−4" }],
    },
    parts: [
      { label: "a.", math: "\\text{Buat tabel nilai } x \\text{ dan } y \\text{ untuk } x \\in \\{-1,\\ 0,\\ 1,\\ 2,\\ 3\\}" },
      { label: "b.", text: "Tentukan titik potong dengan sumbu-x dan sumbu-y." },
      { label: "c.", text: "Gambar grafiknya pada bidang koordinat." },
    ],
  }),

  Q(3, "Grafik y = −3x + 6", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 6, label: "(0,6)", color: "#34d399", labelPos: "tr" },
        { x: 2, y: 0, label: "(2,0)", color: "#34d399", labelPos: "top" },
      ],
      segs: [{ x1: -0.5, y1: 7.5, x2: 4, y2: -6, color: "#34d399", label: "y=−3x+6" }],
    },
    parts: [
      { label: "a.", text: "Tentukan titik potong garis dengan sumbu-x." },
      { label: "b.", text: "Tentukan titik potong garis dengan sumbu-y." },
      { label: "c.", text: "Ke arah mana garis bergerak? Naik atau turun dari kiri ke kanan?" },
    ],
  }),

  Q(4, "Membaca Grafik Garis Lurus", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -5, y1: -3, x2: 5, y2: 5, color: "#a78bfa" }],
      pts: [
        { x: 0, y: 1, label: "B", color: "#a78bfa", labelPos: "tr" },
        { x: -2, y: -1, label: "A", color: "#a78bfa", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan koordinat titik potong garis dengan sumbu-y." },
      { label: "b.", text: "Tentukan koordinat titik potong garis dengan sumbu-x." },
      { label: "c.", math: "\\text{Tuliskan persamaan garis dalam bentuk } y = mx + c." },
    ],
  }),

  Q(5, "Garis Horizontal y = 3", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -5.5, y1: 3, x2: 5.5, y2: 3, color: "#facc15", label: "y = 3" }],
      pts: [{ x: 0, y: 3, label: "(0,3)", color: "#facc15", labelPos: "top" }],
    },
    parts: [
      { label: "a.", text: "Sejajar dengan sumbu manakah garis y = 3?" },
      { label: "b.", text: "Apakah garis ini memotong sumbu-x? Jelaskan!" },
      { label: "c.", text: "Berapa jarak garis ini dari sumbu-x?" },
    ],
  }),

  Q(6, "Garis Vertikal x = −4", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -4, y1: -5.5, x2: -4, y2: 5.5, color: "#fb923c", label: "x=−4" }],
      pts: [{ x: -4, y: 0, label: "(−4,0)", color: "#fb923c", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Sejajar dengan sumbu manakah garis x = −4?" },
      { label: "b.", text: "Apakah garis ini memotong sumbu-y? Jelaskan!" },
      { label: "c.", text: "Berapa jarak garis x = −4 dari sumbu-y?" },
    ],
  }),

  Q(7, "Garis Melalui Titik Asal", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -5, y1: -5, x2: 5, y2: 5, color: "#f87171", label: "y=x" }],
      pts: [{ x: 0, y: 0, label: "O", color: "#f87171", labelPos: "br" }],
    },
    parts: [
      { label: "a.", math: "\\text{Lengkapi tabel: } x \\in \\{-3, -1, 0, 2, 4\\} \\text{ untuk } y = x." },
      { label: "b.", text: "Garis y = x memotong sumbu mana saja? Di titik berapa?" },
      { label: "c.", math: "\\text{Apakah titik }(−5,\\ −5)\\text{ terletak pada garis } y = x?" },
    ],
  }),

  Q(8, "Tabel Nilai → Grafik", {
    type: "mixed",
    content: "Tabel nilai untuk suatu garis lurus:",
    parts: [
      { label: "Tabel:", text: "x: −2, −1, 0, 1, 2   |   y: −5, −3, −1, 1, 3" },
      { label: "a.", text: "Tentukan pola hubungan x dan y dari tabel." },
      { label: "b.", math: "\\text{Tuliskan persamaan garis dalam bentuk } y = mx + c." },
      { label: "c.", text: "Gambar grafiknya dan tentukan titik potong dengan sumbu-x." },
    ],
  }),

  Q(9, "Titik Potong Dua Sumbu", {
    type: "mixed",
    content: "Tentukan titik potong setiap garis dengan sumbu-x dan sumbu-y:",
    parts: [
      { label: "a.", math: "y = 4x + 8" },
      { label: "b.", math: "y = -\\tfrac{1}{2}x + 3" },
      { label: "c.", math: "2x + 3y = 12" },
      { label: "d.", math: "5x - 2y = 10" },
    ],
  }),

  Q(10, "Grafik 2x + y = 6", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: 0, y: 6, label: "(0,6)", color: "#60a5fa", labelPos: "tr" },
        { x: 3, y: 0, label: "(3,0)", color: "#60a5fa", labelPos: "top" },
      ],
      segs: [{ x1: -0.5, y1: 7, x2: 4, y2: -2, color: "#60a5fa", label: "2x+y=6" }],
    },
    parts: [
      { label: "a.", text: "Ubah ke bentuk y = mx + c." },
      { label: "b.", text: "Tentukan titik potong dengan kedua sumbu." },
      { label: "c.", text: "Tentukan tiga titik yang dilalui garis." },
    ],
  }),

  Q(11, "Mengidentifikasi Persamaan dari Grafik", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -4, y1: 6, x2: 6, y2: -4, color: "#f472b6", label: "g" },
      ],
      pts: [
        { x: 0, y: 2, label: "(0,2)", color: "#f472b6", labelPos: "tr" },
        { x: 2, y: 0, label: "(2,0)", color: "#f472b6", labelPos: "top" },
      ],
    },
    parts: [
      { label: "a.", text: "Baca titik potong garis g dengan sumbu-x dan sumbu-y." },
      { label: "b.", math: "\\text{Gunakan titik potong untuk menentukan persamaan garis } g." },
      { label: "c.", text: "Apakah garis naik atau turun? Mengapa?" },
    ],
  }),

  Q(12, "Grafik y = ½x + 1", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 1, label: "(0,1)", color: "#34d399", labelPos: "tr" },
        { x: -2, y: 0, label: "(−2,0)", color: "#34d399", labelPos: "tl" },
      ],
      segs: [{ x1: -5, y1: -1.5, x2: 5, y2: 3.5, color: "#34d399", label: "y=½x+1" }],
    },
    parts: [
      { label: "a.", math: "\\text{Buat tabel nilai untuk } x \\in \\{-4,\\ -2,\\ 0,\\ 2,\\ 4\\}." },
      { label: "b.", text: "Tentukan titik potong dengan sumbu-x dan sumbu-y." },
      { label: "c.", text: "Gambarkan grafik dan tandai titik-titik penting." },
    ],
  }),

  Q(13, "Tiga Garis dalam Satu Bidang", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -5, y1: -5, x2: 5, y2: 5, color: "#f472b6", label: "ℓ₁" },
        { x1: -5.5, y1: 1, x2: 5.5, y2: 1, color: "#facc15", label: "ℓ₂" },
        { x1: 2, y1: -5.5, x2: 2, y2: 5.5, color: "#60a5fa", label: "ℓ₃" },
      ],
    },
    parts: [
      { label: "a.", text: "Tuliskan persamaan garis ℓ₁, ℓ₂, dan ℓ₃." },
      { label: "b.", text: "Di titik mana ℓ₁ dan ℓ₂ berpotongan?" },
      { label: "c.", text: "Di titik mana ℓ₁ dan ℓ₃ berpotongan?" },
    ],
  }),

  Q(14, "Grafik Persamaan Umum ax + by = c", {
    type: "mixed",
    content: "Gambar grafik persamaan garis berikut menggunakan dua titik:",
    parts: [
      { label: "a.", math: "3x + 2y = 12" },
      { label: "b.", math: "x - 4y = 8" },
      { label: "c.", math: "5x + y = 10" },
    ],
  }),

  Q(15, "Persamaan Garis dari Tabel", {
    type: "mixed",
    content: "Perhatikan tabel berikut:",
    parts: [
      { label: "Tabel:", text: "x: 1, 2, 3, 4   |   y: 5, 7, 9, 11" },
      { label: "a.", text: "Apakah data ini membentuk garis lurus? Buktikan!" },
      { label: "b.", math: "\\text{Tentukan persamaan garis } y = mx + c." },
      { label: "c.", math: "\\text{Tentukan nilai } y \\text{ saat } x = 10." },
    ],
  }),

  Q(16, "Grafik y = −x", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -5, y1: 5, x2: 5, y2: -5, color: "#a78bfa", label: "y=−x" }],
      pts: [{ x: 0, y: 0, label: "O", color: "#a78bfa", labelPos: "br" }],
    },
    parts: [
      { label: "a.", text: "Di mana garis y = −x memotong sumbu-x dan sumbu-y?" },
      { label: "b.", math: "\\text{Apakah } (3,\\ −3) \\text{ berada pada garis } y = -x?" },
      { label: "c.", text: "Bandingkan garis y = x dan y = −x. Apa perbedaannya?" },
    ],
  }),

  Q(17, "Titik pada Garis / Tidak pada Garis", {
    type: "mixed",
    content: "Tentukan apakah titik-titik berikut terletak pada garis y = 3x − 5:",
    parts: [
      { label: "a.", math: "A(2,\\ 1)" },
      { label: "b.", math: "B(3,\\ 4)" },
      { label: "c.", math: "C(0,\\ -5)" },
      { label: "d.", math: "D(-1,\\ -7)" },
      { label: "e.", math: "E(5,\\ 10)" },
    ],
  }),

  Q(18, "Dua Grafik Garis Berpotongan", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -4, y1: -2, x2: 4, y2: 6, color: "#f472b6", label: "y=x+2" },
        { x1: -3, y1: 6, x2: 5, y2: -2, color: "#60a5fa", label: "y=−x+3" },
      ],
      pts: [{ x: 0.5, y: 2.5, label: "P", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Baca koordinat titik potong P dari grafik." },
      { label: "b.", text: "Verifikasi koordinat P secara aljabar." },
      { label: "c.", text: "Mana garis yang lebih curam? Jelaskan!" },
    ],
  }),

  Q(19, "Grafik y = 2 (Garis Datar)", {
    type: "mixed",
    diagram: {
      size: 260, range: 5,
      segs: [{ x1: -5, y1: 2, x2: 5, y2: 2, color: "#facc15", label: "y=2" }],
    },
    parts: [
      { label: "a.", text: "Apakah garis y = 2 memiliki kemiringan? Berapa nilainya?" },
      { label: "b.", text: "Titik-titik apa yang dilalui garis ini? Berikan 3 contoh." },
      { label: "c.", text: "Tentukan titik potong garis y = 2 dengan garis x = −3." },
    ],
  }),

  Q(20, "Grafik x = 5 (Garis Tegak)", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: 5, y1: -5.5, x2: 5, y2: 5.5, color: "#34d399", label: "x=5" }],
    },
    parts: [
      { label: "a.", text: "Apakah garis x = 5 memiliki kemiringan? Jelaskan!" },
      { label: "b.", text: "Titik-titik apa yang dilalui garis ini? Berikan 3 contoh." },
      { label: "c.", text: "Tentukan titik potong garis x = 5 dengan garis y = −2." },
    ],
  }),

  Q(21, "Menggambar Garis dari Tabel Pasangan", {
    type: "mixed",
    content: "Pasangan nilai (x, y) berikut membentuk garis lurus: (0, 4), (1, 2), (2, 0), (3, −2)",
    parts: [
      { label: "a.", text: "Plot titik-titik tersebut pada bidang koordinat." },
      { label: "b.", math: "\\text{Tentukan persamaan garis dalam bentuk } y = mx + c." },
      { label: "c.", math: "\\text{Cari nilai } x \\text{ saat } y = -8." },
    ],
  }),

  Q(22, "UN 2019 — Titik Potong Garis", {
    type: "mixed",
    content: "Garis ℓ memotong sumbu-x di titik (−3, 0) dan sumbu-y di titik (0, 6).",
    parts: [
      { label: "a.", text: "Gambarkan garis ℓ pada bidang koordinat." },
      { label: "b.", math: "\\text{Tentukan persamaan garis } \\ell \\text{ dalam bentuk } y = mx + c." },
      { label: "c.", math: "\\text{Apakah titik } (1,\\ 8) \\text{ terletak pada garis } \\ell?" },
    ],
  }),

  Q(23, "Mana yang Garis Lurus?", {
    type: "mixed",
    content: "Tentukan mana dari persamaan berikut yang membentuk garis lurus:",
    parts: [
      { label: "a.", math: "y = 3x^2 + 1" },
      { label: "b.", math: "y = 5x - 7" },
      { label: "c.", math: "2x + 3y = 9" },
      { label: "d.", math: "y = \\frac{4}{x}" },
      { label: "e.", math: "x + y = 10" },
    ],
  }),

  Q(24, "Grafik 4x − y = 8", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 2, y: 0, label: "(2,0)", color: "#fb923c", labelPos: "top" },
        { x: 0, y: -8, label: "(0,−8)", color: "#fb923c", labelPos: "tr" },
      ],
      segs: [{ x1: 0.5, y1: -6, x2: 3.5, y2: 6, color: "#fb923c", label: "4x−y=8" }],
    },
    parts: [
      { label: "a.", text: "Ubah ke bentuk y = mx + c." },
      { label: "b.", text: "Tentukan titik potong dengan sumbu-x dan sumbu-y." },
      { label: "c.", text: "Gambarkan garis dan tandai titik-titik penting." },
    ],
  }),

  Q(25, "Garis Sejajar Sumbu Melalui Titik", {
    type: "mixed",
    content: "Tentukan persamaan garis yang:",
    parts: [
      { label: "a.", text: "Sejajar sumbu-x dan melalui titik (3, 5)." },
      { label: "b.", text: "Sejajar sumbu-y dan melalui titik (−2, 4)." },
      { label: "c.", text: "Sejajar sumbu-x dan berjarak 7 satuan di bawah sumbu-x." },
      { label: "d.", text: "Sejajar sumbu-y dan berjarak 3 satuan di kanan sumbu-y." },
    ],
  }),

  Q(26, "Grafik Persamaan dalam Dua Bentuk", {
    type: "mixed",
    content: "Persamaan 3x + y = 9 dapat ditulis dalam berbagai bentuk.",
    parts: [
      { label: "a.", math: "\\text{Ubah ke bentuk } y = mx + c." },
      { label: "b.", math: "\\text{Ubah ke bentuk } \\frac{x}{a} + \\frac{y}{b} = 1." },
      { label: "c.", text: "Gambar grafik menggunakan titik potong dengan kedua sumbu." },
    ],
  }),

  Q(27, "ANBK — Memilih Grafik yang Tepat", {
    type: "mixed",
    content: "Persamaan garis: y = 2x − 6. Manakah pernyataan yang BENAR?",
    parts: [
      { label: "(1)", text: "Garis memotong sumbu-x di titik (3, 0)." },
      { label: "(2)", text: "Garis memotong sumbu-y di titik (0, −6)." },
      { label: "(3)", text: "Titik (4, 2) terletak pada garis ini." },
      { label: "(4)", text: "Garis bergerak turun dari kiri ke kanan." },
    ],
  }),

  Q(28, "Gradien dari Grafik dan Titik Potong", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -5, y1: -2, x2: 4, y2: 7, color: "#a78bfa", label: "g" }],
      pts: [
        { x: 0, y: 3, label: "B(0,3)", color: "#a78bfa", labelPos: "tr" },
        { x: -3, y: 0, label: "A(−3,0)", color: "#a78bfa", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Baca titik potong garis g dengan kedua sumbu." },
      { label: "b.", math: "\\text{Hitung gradien garis } g." },
      { label: "c.", math: "\\text{Tuliskan persamaan garis } g." },
    ],
  }),

  Q(29, "Garis Melalui Dua Titik Berkoordinat Fraksional", {
    type: "mixed",
    content: "Garis ℓ melalui titik A(−1, 2) dan B(3, −2).",
    parts: [
      { label: "a.", text: "Gambar kedua titik dan hubungkan dengan garis lurus." },
      { label: "b.", math: "\\text{Hitung gradien garis } \\ell." },
      { label: "c.", math: "\\text{Tentukan persamaan garis } \\ell." },
    ],
  }),

  Q(30, "Mencocokkan Garis dengan Persamaan", {
    type: "mixed",
    diagram: {
      size: 260, range: 5,
      segs: [
        { x1: -4, y1: -4, x2: 4, y2: 4, color: "#f472b6", label: "A" },
        { x1: -4, y1: 4, x2: 4, y2: -4, color: "#60a5fa", label: "B" },
        { x1: -4, y1: 2, x2: 4, y2: 2, color: "#facc15", label: "C" },
        { x1: -2, y1: -4, x2: -2, y2: 4, color: "#34d399", label: "D" },
      ],
    },
    parts: [
      { label: "Pasangkan:", text: "Garis A, B, C, D dengan persamaan: y = x, y = −x, y = 2, x = −2" },
      { label: "a.", text: "Persamaan garis A adalah ..." },
      { label: "b.", text: "Persamaan garis B adalah ..." },
      { label: "c.", text: "Persamaan garis C adalah ..." },
      { label: "d.", text: "Persamaan garis D adalah ..." },
    ],
  }),

  Q(31, "Garis yang Melalui Titik Tertentu", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui titik-titik berikut:",
    parts: [
      { label: "a.", math: "A(0,\\ 0) \\text{ dan } B(3,\\ 6)" },
      { label: "b.", math: "C(0,\\ 4) \\text{ dan } D(5,\\ 0)" },
      { label: "c.", math: "E(-2,\\ 0) \\text{ dan } F(0,\\ 8)" },
    ],
  }),

  Q(32, "Nilai x untuk y yang Diberikan", {
    type: "mixed",
    content: "Gunakan persamaan y = 3x + 6 untuk menjawab:",
    parts: [
      { label: "a.", math: "\\text{Nilai } x \\text{ saat } y = 0" },
      { label: "b.", math: "\\text{Nilai } x \\text{ saat } y = 15" },
      { label: "c.", math: "\\text{Nilai } y \\text{ saat } x = -4" },
      { label: "d.", math: "\\text{Nilai } x \\text{ saat } y = -9" },
    ],
  }),

  Q(33, "Grafik dengan Intercept Negatif", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -2, y1: 6, x2: 6, y2: -2, color: "#fb923c", label: "y=−x+4" }],
      pts: [
        { x: 0, y: 4, label: "(0,4)", color: "#fb923c", labelPos: "tr" },
        { x: 4, y: 0, label: "(4,0)", color: "#fb923c", labelPos: "top" },
      ],
    },
    parts: [
      { label: "a.", math: "\\text{Persamaan grafik di atas adalah } y = \\ldots" },
      { label: "b.", text: "Tentukan semua titik pada grafik yang memiliki y = −2." },
      { label: "c.", text: "Apakah titik (3, 1) berada di atas atau di bawah garis? Jelaskan!" },
    ],
  }),

  Q(34, "SPLDV — Solusi Grafis", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -4, y1: 4, x2: 4, y2: -4, color: "#f472b6", label: "y=−x" },
        { x1: -2, y1: -4, x2: 2, y2: 4, color: "#60a5fa", label: "y=2x" },
      ],
      pts: [{ x: 0, y: 0, label: "O(0,0)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Tentukan titik potong kedua garis dari grafik." },
      { label: "b.", text: "Verifikasi jawaban secara aljabar." },
    ],
  }),

  Q(35, "UN 2020 — Persamaan dari Dua Titik", {
    type: "mixed",
    content: "Diketahui garis ℓ melalui titik P(2, 5) dan Q(6, 13).",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: 2, y: 5, label: "P(2,5)", color: "#f472b6", labelPos: "tl" },
        { x: 6, y: 13, label: "Q(6,13)", color: "#60a5fa", labelPos: "tl" },
      ],
      segs: [{ x1: 0, y1: 1, x2: 6, y2: 13, color: "#a78bfa", label: "ℓ" }],
    },
    parts: [
      { label: "a.", math: "\\text{Hitung gradien garis melalui P dan Q.}" },
      { label: "b.", math: "\\text{Tentukan persamaan garis } \\ell." },
      { label: "c.", math: "\\text{Di mana garis } \\ell \\text{ memotong sumbu-x?}" },
    ],
  }),

  Q(36, "Persamaan Garis Sejajar Sumbu", {
    type: "mixed",
    content: "Tuliskan persamaan setiap garis berikut:",
    diagram: {
      size: 260, range: 5,
      segs: [
        { x1: -4.5, y1: -3, x2: 4.5, y2: -3, color: "#f472b6", label: "ℓ₁" },
        { x1: 4, y1: -4.5, x2: 4, y2: 4.5, color: "#60a5fa", label: "ℓ₂" },
        { x1: -4.5, y1: 2, x2: 4.5, y2: 2, color: "#34d399", label: "ℓ₃" },
      ],
    },
    parts: [
      { label: "a.", text: "Persamaan garis ℓ₁ (garis merah muda di bawah sumbu-x)." },
      { label: "b.", text: "Persamaan garis ℓ₂ (garis biru di kanan sumbu-y)." },
      { label: "c.", text: "Persamaan garis ℓ₃ (garis hijau di atas sumbu-x)." },
    ],
  }),

  Q(37, "TKA — Koordinat Berdasarkan Persamaan", {
    type: "mixed",
    content: "Garis y = −2x + 5 melalui titik-titik berikut. Tentukan nilai yang belum diketahui:",
    parts: [
      { label: "a.", math: "A(0,\\ ?)" },
      { label: "b.", math: "B(?,\\ 0)" },
      { label: "c.", math: "C(3,\\ ?)" },
      { label: "d.", math: "D(?,\\ 9)" },
      { label: "e.", math: "E(-1,\\ ?)" },
    ],
  }),

  Q(38, "Perpotongan Garis Horizontal dan Vertikal", {
    type: "mixed",
    diagram: {
      size: 260, range: 5,
      segs: [
        { x1: -4.5, y1: 3, x2: 4.5, y2: 3, color: "#facc15", label: "y=3" },
        { x1: -2, y1: -4.5, x2: -2, y2: 4.5, color: "#a78bfa", label: "x=−2" },
      ],
      pts: [{ x: -2, y: 3, label: "P", color: "#f87171", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Tentukan koordinat titik potong P dari grafik." },
      { label: "b.", text: "Buktikan bahwa P memenuhi kedua persamaan garis." },
    ],
  }),

  Q(39, "Menggunakan Intercept untuk Menggambar", {
    type: "mixed",
    content: "Gambar grafik setiap garis menggunakan metode dua titik (potong sumbu-x dan sumbu-y):",
    parts: [
      { label: "a.", math: "\\frac{x}{4} + \\frac{y}{6} = 1" },
      { label: "b.", math: "\\frac{x}{-3} + \\frac{y}{5} = 1" },
      { label: "c.", math: "2x - 5y = 20" },
    ],
  }),

  Q(40, "Soal Tantangan — Daerah yang Dibatasi Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -4, y1: 4, x2: 4, y2: -4, color: "#f472b6", label: "x+y=0" },
        { x1: -5.5, y1: 3, x2: 5.5, y2: 3, color: "#facc15", label: "y=3" },
        { x1: -3, y1: -5.5, x2: -3, y2: 5.5, color: "#60a5fa", label: "x=−3" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan titik potong garis y = 3 dan x + y = 0." },
      { label: "b.", text: "Tentukan titik potong garis x = −3 dan x + y = 0." },
      { label: "c.", text: "Tentukan titik potong garis x = −3 dan y = 3." },
      { label: "d.", text: "Hitung luas segitiga yang dibentuk oleh ketiga garis tersebut." },
    ],
  }),
];

const GrafikPGLPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-pink-400 text-xs font-body">40 Soal Latihan</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            GRAFIK PERSAMAAN GARIS LURUS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Persamaan Garis Lurus · UN / TKA / ANBK</p>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-900/20 via-slate-900/40 to-purple-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className="text-pink-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
                  {q.content && (
                    <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                  )}
                  {q.math && (
                    <div className="text-white/90 text-sm mt-1"><InlineMath math={q.math} /></div>
                  )}
                </div>
              </div>

              {q.diagram && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-lg">
                    <CoordPlane {...q.diagram} />
                  </div>
                </div>
              )}

              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((p, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className="text-pink-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                      <div className="text-white/75 text-sm font-body leading-relaxed">
                        {p.math ? <InlineMath math={p.math} /> : <span>{p.text}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Persamaan Garis Lurus
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrafikPGLPage;
