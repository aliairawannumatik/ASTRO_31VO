import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
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
  Q(1, "Garis Sejajar — Syarat Gradien", {
    type: "mixed",
    content: "Tentukan apakah setiap pasang garis berikut sejajar, tegak lurus, atau tidak keduanya:",
    parts: [
      { label: "a.", math: "y = 3x + 2 \\text{ dan } y = 3x - 5" },
      { label: "b.", math: "y = 2x + 1 \\text{ dan } y = -\\tfrac{1}{2}x + 3" },
      { label: "c.", math: "y = 4x - 7 \\text{ dan } y = -4x + 7" },
      { label: "d.", math: "y = \\tfrac{2}{3}x + 1 \\text{ dan } y = \\tfrac{2}{3}x - 4" },
    ],
  }),

  Q(2, "Garis Tegak Lurus — Syarat m₁ × m₂ = −1", {
    type: "mixed",
    content: "Periksa apakah setiap pasang garis berikut saling tegak lurus:",
    parts: [
      { label: "a.", math: "y = 5x + 3 \\text{ dan } y = -\\tfrac{1}{5}x - 2" },
      { label: "b.", math: "y = -3x + 4 \\text{ dan } y = \\tfrac{1}{3}x + 1" },
      { label: "c.", math: "2x + 3y = 6 \\text{ dan } 3x - 2y = 8" },
      { label: "d.", math: "x - 4y = 0 \\text{ dan } 4x + y = 5" },
    ],
  }),

  Q(3, "Titik Potong Dua Garis (Metode Substitusi)", {
    type: "mixed",
    content: "Tentukan titik potong setiap pasang garis berikut:",
    parts: [
      { label: "a.", math: "y = 2x + 1 \\text{ dan } y = -x + 7" },
      { label: "b.", math: "y = 3x - 4 \\text{ dan } y = x + 2" },
      { label: "c.", math: "y = -2x + 9 \\text{ dan } y = x - 3" },
    ],
  }),

  Q(4, "Titik Potong — Metode Eliminasi", {
    type: "mixed",
    content: "Tentukan titik potong menggunakan metode eliminasi:",
    parts: [
      { label: "a.", math: "2x + y = 8 \\text{ dan } x - y = 1" },
      { label: "b.", math: "3x + 2y = 12 \\text{ dan } x + 2y = 8" },
      { label: "c.", math: "4x - y = 10 \\text{ dan } 2x + y = 8" },
    ],
  }),

  Q(5, "Grafik — Titik Potong Dua Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -4, y1: -1, x2: 4, y2: 7, color: "#f472b6", label: "y=x+3" },
        { x1: -2, y1: 7, x2: 4, y2: 1, color: "#60a5fa", label: "y=−x+5" },
      ],
      pts: [{ x: 1, y: 4, label: "P", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Baca koordinat titik potong P dari grafik." },
      { label: "b.", text: "Verifikasi secara aljabar dengan substitusi P ke kedua persamaan." },
      { label: "c.", text: "Apakah kedua garis sejajar atau tidak? Jelaskan!" },
    ],
  }),

  Q(6, "Dua Garis Sejajar — Tidak Ada Titik Potong", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -5, y1: -3, x2: 3, y2: 5, color: "#f472b6", label: "ℓ₁" },
        { x1: -5, y1: -6, x2: 3, y2: 2, color: "#60a5fa", label: "ℓ₂" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung gradien masing-masing garis." },
      { label: "b.", text: "Mengapa dua garis sejajar tidak memiliki titik potong?" },
      { label: "c.", text: "Berapa jarak vertikal antara kedua garis sejajar tersebut?" },
    ],
  }),

  Q(7, "UN 2018 — Garis Sejajar dengan Garis Lain", {
    type: "mixed",
    content: "Garis g sejajar dengan garis y = 3x − 5 dan melalui titik (2, 7).",
    parts: [
      { label: "a.", text: "Tentukan gradien garis g." },
      { label: "b.", text: "Tentukan persamaan garis g." },
      { label: "c.", text: "Tentukan titik potong garis g dengan sumbu-x." },
    ],
  }),

  Q(8, "Titik Potong dengan Sumbu Koordinat", {
    type: "mixed",
    content: "Tentukan titik potong setiap garis dengan sumbu-x dan sumbu-y:",
    parts: [
      { label: "a.", math: "y = 2x - 8" },
      { label: "b.", math: "3x - 4y = 24" },
      { label: "c.", math: "y = -\\tfrac{3}{2}x + 6" },
    ],
  }),

  Q(9, "Garis Tegak Lurus — Menentukan Persamaan", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -3, y1: -6, x2: 3, y2: 6, color: "#34d399", label: "g: y=2x" },
        { x1: -5, y1: 2.5, x2: 5, y2: -2.5, color: "#fb923c", label: "h: y=−½x" },
      ],
      pts: [{ x: 0, y: 0, label: "O", color: "white", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Hitung gradien garis g dan garis h." },
      { label: "b.", math: "\\text{Hitung } m_g \\times m_h. \\text{ Apa kesimpulanmu?}" },
      { label: "c.", text: "Di mana kedua garis berpotongan?" },
    ],
  }),

  Q(10, "Sistem Dua Persamaan — Penyelesaian Grafis", {
    type: "mixed",
    content: "Selesaikan sistem persamaan berikut dengan metode grafik:",
    math: "y = x + 2 \\quad\\text{dan}\\quad y = 3x - 4",
    parts: [
      { label: "a.", text: "Buat tabel nilai untuk masing-masing persamaan." },
      { label: "b.", text: "Gambar kedua grafik dalam satu bidang koordinat." },
      { label: "c.", text: "Tentukan titik potong (solusi sistem) dari grafik." },
      { label: "d.", text: "Verifikasi secara aljabar." },
    ],
  }),

  Q(11, "ANBK — Garis Sejajar Benar atau Salah", {
    type: "mixed",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", math: "y = 4x + 1 \\text{ dan } y = 4x - 3 \\text{ adalah garis sejajar.}" },
      { label: "(2)", math: "y = 2x + 5 \\text{ dan } y = -2x + 5 \\text{ adalah garis sejajar.}" },
      { label: "(3)", math: "y = \\tfrac{1}{3}x \\text{ dan } y = 3x \\text{ adalah garis tegak lurus.}" },
      { label: "(4)", text: "Dua garis sejajar tidak pernah berpotongan." },
    ],
  }),

  Q(12, "Perpotongan dengan Garis Khusus", {
    type: "mixed",
    content: "Tentukan titik potong garis y = 3x − 6 dengan:",
    parts: [
      { label: "a.", text: "Garis y = 0 (sumbu-x)." },
      { label: "b.", text: "Garis x = 0 (sumbu-y)." },
      { label: "c.", math: "\\text{Garis } y = 6." },
      { label: "d.", math: "\\text{Garis } x = 4." },
    ],
  }),

  Q(13, "Dua Garis Berpotongan — Tentukan Titik", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -1, y1: -5, x2: 3, y2: 7, color: "#a78bfa", label: "y=3x−2" },
        { x1: -5, y1: 7, x2: 5, y2: -3, color: "#fb923c", label: "y=−x+2" },
      ],
      pts: [{ x: 1, y: 1, label: "T(1,1)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Baca koordinat titik perpotongan T dari grafik." },
      { label: "b.", text: "Verifikasi dengan mensubstitusi T ke kedua persamaan." },
    ],
  }),

  Q(14, "Nilai k untuk Garis Sejajar", {
    type: "mixed",
    content: "Tentukan nilai k agar setiap pasang garis berikut sejajar:",
    parts: [
      { label: "a.", math: "y = kx + 3 \\text{ dan } y = 5x - 1" },
      { label: "b.", math: "kx - 2y = 8 \\text{ dan } 3x - 6y = 12" },
      { label: "c.", math: "y = (2k-1)x + 4 \\text{ dan } y = 7x - 2" },
    ],
  }),

  Q(15, "Nilai k untuk Garis Tegak Lurus", {
    type: "mixed",
    content: "Tentukan nilai k agar setiap pasang garis berikut tegak lurus:",
    parts: [
      { label: "a.", math: "y = kx + 1 \\text{ dan } y = 3x - 2" },
      { label: "b.", math: "y = 4x + 5 \\text{ dan } y = kx + 7" },
      { label: "c.", math: "kx + 2y = 6 \\text{ dan } x - 3y = 9" },
    ],
  }),

  Q(16, "UN 2020 — Hubungan Dua Garis", {
    type: "mixed",
    content: "Diketahui dua garis: ℓ₁: 4x − 2y + 6 = 0 dan ℓ₂: x + 2y − 4 = 0.",
    parts: [
      { label: "a.", text: "Tentukan gradien masing-masing garis." },
      { label: "b.", text: "Apakah kedua garis sejajar, tegak lurus, atau tidak keduanya?" },
      { label: "c.", text: "Tentukan titik perpotongan kedua garis." },
    ],
  }),

  Q(17, "Tiga Garis — Identifikasi Hubungan", {
    type: "mixed",
    content: "Perhatikan tiga garis berikut: ℓ₁: y = 2x + 1, ℓ₂: y = 2x − 3, ℓ₃: y = −½x + 4",
    parts: [
      { label: "a.", text: "Apakah ℓ₁ dan ℓ₂ sejajar? Buktikan!" },
      { label: "b.", text: "Apakah ℓ₁ dan ℓ₃ tegak lurus? Buktikan!" },
      { label: "c.", text: "Apakah ℓ₂ dan ℓ₃ tegak lurus? Buktikan!" },
    ],
  }),

  Q(18, "Titik Potong — Koordinat Pecahan", {
    type: "mixed",
    content: "Tentukan titik potong dua garis berikut:",
    parts: [
      { label: "a.", math: "y = 3x - 1 \\text{ dan } y = 2x + \\tfrac{1}{2}" },
      { label: "b.", math: "\\tfrac{x}{2} + y = 3 \\text{ dan } x - \\tfrac{y}{2} = 4" },
    ],
  }),

  Q(19, "Grafik Dua Garis Tegak Lurus", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -4, y1: -2, x2: 4, y2: 6, color: "#f472b6", label: "g: m=1" },
        { x1: -2, y1: 6, x2: 6, y2: -2, color: "#60a5fa", label: "h: m=−1" },
      ],
      pts: [{ x: 1, y: 3, label: "K", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Hitung gradien garis g dan h dari grafik." },
      { label: "b.", math: "\\text{Buktikan bahwa } m_g \\times m_h = -1." },
      { label: "c.", text: "Tentukan koordinat titik K (perpotongan) secara aljabar." },
    ],
  }),

  Q(20, "Segitiga dari Tiga Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -5, y1: 1, x2: 3, y2: 5, color: "#f472b6", label: "ℓ₁" },
        { x1: -5, y1: -3, x2: 3, y2: 5, color: "#60a5fa", label: "ℓ₂" },
        { x1: -4.5, y1: 3, x2: 4.5, y2: 3, color: "#facc15", label: "ℓ₃" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan titik potong ℓ₁ dan ℓ₂." },
      { label: "b.", text: "Tentukan titik potong ℓ₁ dan ℓ₃." },
      { label: "c.", text: "Tentukan titik potong ℓ₂ dan ℓ₃." },
      { label: "d.", text: "Ketiga titik ini membentuk segitiga. Hitung kelilingnya." },
    ],
  }),

  Q(21, "Sistem Tiga Variabel — Dua Garis", {
    type: "mixed",
    content: "Selesaikan sistem persamaan berikut secara aljabar:",
    parts: [
      { label: "a.", math: "3x + 2y = 12 \\quad \\text{dan} \\quad x - y = 1" },
      { label: "b.", math: "5x + 3y = 15 \\quad \\text{dan} \\quad 2x - y = 3" },
    ],
  }),

  Q(22, "Apakah Garis Berimpit?", {
    type: "mixed",
    content: "Dua garis berimpit jika semua titik pada satu garis juga terletak pada garis lainnya.",
    parts: [
      { label: "a.", math: "y = 2x + 4 \\quad \\text{dan} \\quad 4x - 2y + 8 = 0" },
      { label: "b.", math: "y = 3x - 1 \\quad \\text{dan} \\quad 6x - 2y = 1" },
      { label: "Petunjuk:", text: "Ubah semua ke bentuk y = mx + c dan bandingkan." },
    ],
  }),

  Q(23, "ANBK — Pilih Hubungan yang Tepat", {
    type: "mixed",
    content: "Pasangkan setiap pasang garis dengan hubungannya (Sejajar / Tegak Lurus / Berpotongan):",
    parts: [
      { label: "(1)", math: "y = \\tfrac{1}{2}x + 1 \\quad \\text{dan} \\quad y = -2x + 3" },
      { label: "(2)", math: "y = 3x - 2 \\quad \\text{dan} \\quad y = 3x + 5" },
      { label: "(3)", math: "y = x + 1 \\quad \\text{dan} \\quad y = 2x + 1" },
    ],
  }),

  Q(24, "Garis Sejajar — Hitung Jarak Antara Keduanya", {
    type: "mixed",
    content: "Dua garis sejajar: y = 2x + 1 dan y = 2x − 5.",
    parts: [
      { label: "a.", text: "Berapa perbedaan intercept-y antara kedua garis?" },
      { label: "b.", text: "Apakah itu berarti jarak antara kedua garis adalah 6? Jelaskan!" },
    ],
  }),

  Q(25, "Titik Potong — Dua Garis Tidak Standar", {
    type: "mixed",
    content: "Tentukan titik potong setiap pasang garis:",
    parts: [
      { label: "a.", math: "y - 3 = 2(x - 1) \\quad \\text{dan} \\quad y + 1 = -(x - 4)" },
      { label: "b.", math: "y = \\tfrac{x+4}{2} \\quad \\text{dan} \\quad 2y = x - 2" },
    ],
  }),

  Q(26, "Garis Mana yang Sejajar dengan y = 4x?", {
    type: "mixed",
    content: "Dari daftar garis berikut, pilih yang sejajar dengan y = 4x:",
    parts: [
      { label: "(A)", math: "y = 4x + 7" },
      { label: "(B)", math: "y = -\\tfrac{1}{4}x + 3" },
      { label: "(C)", math: "4y = x + 8" },
      { label: "(D)", math: "8x - 2y = 12" },
      { label: "(E)", math: "y = 4(x - 2)" },
    ],
  }),

  Q(27, "Perpotongan Tegak Lurus — Titik Kaki Tegak Lurus", {
    type: "mixed",
    content: "Garis g: y = 2x − 3 dan titik P(1, 5) berada di luar garis g.",
    parts: [
      { label: "a.", text: "Tentukan persamaan garis yang melalui P dan tegak lurus dengan g." },
      { label: "b.", text: "Tentukan titik kaki tegak lurus (titik potong garis dari P dengan g)." },
    ],
  }),

  Q(28, "UN 2021 — Perpotongan Dua Persamaan", {
    type: "mixed",
    content: "Dua garis: ℓ₁: y = 3x + 2 dan ℓ₂: y = −2x + 12.",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -2, y1: -4, x2: 4, y2: 14, color: "#f472b6", label: "ℓ₁" },
        { x1: -1, y1: 14, x2: 6, y2: 0, color: "#60a5fa", label: "ℓ₂" },
      ],
      pts: [{ x: 2, y: 8, label: "T(2,8)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Tentukan titik potong T secara aljabar." },
      { label: "b.", text: "Apakah ℓ₁ dan ℓ₂ saling tegak lurus? Jelaskan!" },
      { label: "c.", text: "Di kuadran mana titik T berada?" },
    ],
  }),

  Q(29, "Tiga Garis Bertemu di Satu Titik", {
    type: "mixed",
    content: "Tiga garis: y = 2x − 1, y = −x + 5, dan y = kx + 2 bertemu di satu titik.",
    parts: [
      { label: "a.", text: "Tentukan titik perpotongan garis y = 2x − 1 dan y = −x + 5." },
      { label: "b.", text: "Substitusikan titik tersebut ke garis y = kx + 2 untuk mencari k." },
      { label: "c.", text: "Tuliskan persamaan lengkap garis ketiga." },
    ],
  }),

  Q(30, "Hubungan Garis — Soal Kontekstual", {
    type: "mixed",
    content: "Dua jalan lurus di kota digambarkan sebagai garis: Jalan A: y = 2x + 3 dan Jalan B: y = 2x − 7.",
    parts: [
      { label: "a.", text: "Apakah kedua jalan pernah bersilangan?" },
      { label: "b.", text: "Jelaskan apa artinya dua jalan sejajar dalam kehidupan nyata." },
    ],
  }),

  Q(31, "ANBK — Soal Grafik Dua Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -5, y1: -5, x2: 5, y2: 5, color: "#f472b6", label: "A" },
        { x1: -5, y1: 5, x2: 5, y2: -5, color: "#60a5fa", label: "B" },
      ],
      pts: [{ x: 0, y: 0, label: "O(0,0)", color: "#facc15", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Tuliskan persamaan garis A dan garis B." },
      { label: "b.", text: "Apakah garis A dan B tegak lurus? Buktikan!" },
      { label: "c.", text: "Tentukan titik perpotongannya." },
    ],
  }),

  Q(32, "Titik Potong Garis Vertikal dan Miring", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: 3, y1: -5.5, x2: 3, y2: 5.5, color: "#facc15", label: "x=3" },
        { x1: -3, y1: -3, x2: 5, y2: 5, color: "#a78bfa", label: "y=x" },
      ],
      pts: [{ x: 3, y: 3, label: "P(3,3)", color: "#f87171", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", text: "Tentukan koordinat titik potong P dari grafik." },
      { label: "b.", text: "Buktikan bahwa P memenuhi persamaan kedua garis." },
    ],
  }),

  Q(33, "Garis Bertemu di Sumbu", {
    type: "mixed",
    content: "Dua garis bertemu di titik pada sumbu-y.",
    parts: [
      { label: "a.", math: "y = 2x + 4 \\text{ dan } y = -x + 4" },
      { label: "Pertanyaan:", text: "Apakah kedua garis memiliki intercept-y yang sama? Periksa!" },
      { label: "b.", text: "Tentukan titik perpotongan keduanya." },
      { label: "c.", text: "Tuliskan koordinat titik yang dilalui keduanya." },
    ],
  }),

  Q(34, "Sistem Tak Konsisten dan Konsisten", {
    type: "mixed",
    content: "Tentukan apakah sistem persamaan berikut memiliki solusi (titik potong) atau tidak:",
    parts: [
      { label: "a.", math: "y = 3x + 2 \\quad \\text{dan} \\quad y = 3x - 5" },
      { label: "b.", math: "y = 4x - 1 \\quad \\text{dan} \\quad y = 2x + 3" },
      { label: "c.", math: "y = x + 5 \\quad \\text{dan} \\quad 2y = 2x + 10" },
    ],
  }),

  Q(35, "TKA — Koordinat Titik Potong", {
    type: "mixed",
    content: "Tentukan koordinat titik potong:",
    parts: [
      { label: "a.", math: "y = \\tfrac{1}{2}x + 3 \\quad \\text{dan} \\quad y = -\\tfrac{1}{2}x + 7" },
      { label: "b.", math: "y = 5x - 3 \\quad \\text{dan} \\quad y = -5x + 17" },
    ],
  }),

  Q(36, "Garis Tegak Lurus pada Segitiga Siku-Siku", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 0, label: "O", color: "white", labelPos: "bl" },
        { x: 4, y: 0, label: "A(4,0)", color: "#f472b6", labelPos: "br" },
        { x: 0, y: 3, label: "B(0,3)", color: "#60a5fa", labelPos: "tl" },
      ],
      segs: [
        { x1: 0, y1: 0, x2: 4, y2: 0, color: "#f472b6" },
        { x1: 0, y1: 0, x2: 0, y2: 3, color: "#60a5fa" },
        { x1: 4, y1: 0, x2: 0, y2: 3, color: "#34d399", label: "AB" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan gradien garis AB (dari A ke B)." },
      { label: "b.", text: "Tentukan persamaan garis AB." },
      { label: "c.", text: "Apakah OA dan OB tegak lurus? Jelaskan!" },
    ],
  }),

  Q(37, "Mencari k — Garis Sejajar dari Bentuk Umum", {
    type: "mixed",
    content: "Garis ℓ: kx + 3y = 9 sejajar dengan garis m: 4x − 6y = 12.",
    parts: [
      { label: "a.", text: "Ubah kedua garis ke bentuk y = mx + c." },
      { label: "b.", text: "Gunakan syarat sejajar (gradien sama) untuk mencari k." },
      { label: "c.", text: "Tuliskan persamaan lengkap garis ℓ dengan nilai k yang ditemukan." },
    ],
  }),

  Q(38, "Garis Tegak Lurus Bagi Segmen", {
    type: "mixed",
    content: "Garis ℓ tegak lurus terhadap segmen AB dan melalui titik tengah AB.",
    math: "A(1,\\ 3) \\text{ dan } B(5,\\ 7)",
    parts: [
      { label: "a.", text: "Tentukan titik tengah segmen AB." },
      { label: "b.", text: "Tentukan gradien segmen AB." },
      { label: "c.", text: "Tentukan gradien dan persamaan garis ℓ (garis tegak lurus bagi AB)." },
    ],
  }),

  Q(39, "ANBK — Soal Pilihan Berganda Hubungan Garis", {
    type: "mixed",
    content: "Garis p: 2x + y = 8 dan garis q: x − 2y = 4. Pilih jawaban yang benar:",
    parts: [
      { label: "(A)", text: "p dan q sejajar." },
      { label: "(B)", text: "p dan q tegak lurus." },
      { label: "(C)", text: "p dan q berpotongan tetapi tidak tegak lurus." },
      { label: "(D)", text: "p dan q berimpit." },
      { label: "Buktikan:", text: "Hitung gradien masing-masing garis untuk mendukung jawabanmu." },
    ],
  }),

  Q(40, "Tantangan — Rute Optimal", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: -4, y: -2, label: "Sekolah", color: "#f472b6", labelPos: "bl" },
        { x: 4, y: 4, label: "Rumah", color: "#60a5fa", labelPos: "tr" },
        { x: 2, y: -2, label: "Pasar", color: "#34d399", labelPos: "br" },
      ],
      segs: [
        { x1: -4, y1: -2, x2: 4, y2: 4, color: "#f472b6", dashed: true },
        { x1: -4, y1: -2, x2: 2, y2: -2, color: "#34d399", dashed: true },
        { x1: 2, y1: -2, x2: 4, y2: 4, color: "#60a5fa", dashed: true },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan persamaan garis dari Sekolah ke Rumah (rute langsung)." },
      { label: "b.", text: "Tentukan persamaan garis dari Sekolah ke Pasar." },
      { label: "c.", text: "Apakah rute Sekolah→Pasar dan Pasar→Rumah saling tegak lurus?" },
      { label: "d.", text: "Bandingkan panjang rute langsung dan rute lewat Pasar." },
    ],
  }),
];

const Hubungan2GarisPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-orange-400 text-xs font-body">40 Soal Latihan</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            HUBUNGAN DUA GARIS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Persamaan Garis Lurus · UN / TKA / ANBK</p>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-900/20 via-slate-900/40 to-yellow-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className="text-orange-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
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
                      <span className="text-orange-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{p.label}</span>
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

export default Hubungan2GarisPage;
