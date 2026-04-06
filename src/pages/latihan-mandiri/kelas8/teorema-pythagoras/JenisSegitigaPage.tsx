import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Triangle } from "lucide-react";
import PythagorasDiagram from "./PythagorasDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };

const accent = "#fb923c";

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
  { n: 1, type: "mixed", title: "Aturan Jenis Segitiga",
    content: "Untuk segitiga dengan sisi a ≤ b ≤ c, berlaku:",
    parts: [
      { label: "Siku-siku:", math: "a^2 + b^2 = c^2" },
      { label: "Lancip:", math: "a^2 + b^2 > c^2" },
      { label: "Tumpul:", math: "a^2 + b^2 < c^2" },
      { label: "Tanyakan:", text: "Sebutkan sisi mana yang selalu dijadikan c (sisi terbesar)." },
    ],
  },
  { n: 2, type: "mixed", title: "Segitiga 3-4-6",
    content: "Tentukan jenis segitiga dengan sisi 3 cm, 4 cm, dan 6 cm.",
    parts: [
      { label: "a.", math: "c = 6 \\text{ (terbesar)},\\ a^2 + b^2 = 3^2 + 4^2 = 25" },
      { label: "b.", math: "c^2 = 6^2 = 36" },
      { label: "c.", math: "25 \\ \\boxed{?} \\ 36 \\Rightarrow \\text{jenis: ...}" },
    ],
  },
  { n: 3, type: "mixed", title: "Segitiga 5-7-8",
    content: "Tentukan jenis segitiga dengan sisi 5 cm, 7 cm, dan 8 cm.",
    parts: [
      { label: "a.", math: "a^2 + b^2 = 5^2 + 7^2 = 25 + 49 = 74" },
      { label: "b.", math: "c^2 = 8^2 = 64" },
      { label: "c.", math: "74 > 64 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 4, type: "mixed", title: "Segitiga 4-5-7",
    content: "Tentukan jenis segitiga dengan sisi 4 cm, 5 cm, dan 7 cm.",
    parts: [
      { label: "a.", math: "4^2 + 5^2 = 16 + 25 = 41" },
      { label: "b.", math: "7^2 = 49" },
      { label: "c.", math: "41 < 49 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 5, type: "mixed", title: "Segitiga 6-8-10",
    content: "Tentukan jenis segitiga dengan sisi 6 cm, 8 cm, dan 10 cm.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 60, y: 175, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 205, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 60, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "8 cm", color: "#60a5fa", dy: 14 }}
        BC={{ text: "10 cm", color: "#34d399", dx: 12 }}
        CA={{ text: "6 cm", color: "#f472b6", dx: -16 }}
        vw={265} vh={225} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "6^2 + 8^2 = 36 + 64 = 100" },
      { label: "b.", math: "10^2 = 100" },
      { label: "c.", math: "100 = 100 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 6, type: "mixed", title: "Segitiga 2-3-4",
    content: "Tentukan jenis segitiga dengan sisi 2 cm, 3 cm, dan 4 cm.",
    parts: [
      { label: "a.", math: "2^2 + 3^2 = 4 + 9 = 13" },
      { label: "b.", math: "4^2 = 16" },
      { label: "c.", math: "13 < 16 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 7, type: "mixed", title: "Segitiga 10-10-10 (Sama Sisi)",
    content: "Tentukan jenis segitiga dengan ketiga sisi sama panjang 10 cm.",
    parts: [
      { label: "a.", math: "a^2 + b^2 = 10^2 + 10^2 = 200" },
      { label: "b.", math: "c^2 = 10^2 = 100" },
      { label: "c.", math: "200 > 100 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 8, type: "mixed", title: "Segitiga 5-12-13",
    content: "Tentukan jenis segitiga dengan sisi 5, 12, dan 13.",
    parts: [
      { label: "a.", math: "5^2 + 12^2 = 25 + 144 = 169" },
      { label: "b.", math: "13^2 = 169" },
      { label: "c.", math: "169 = 169 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 9, type: "mixed", title: "Segitiga 1-1-2",
    content: "Tentukan jenis segitiga dengan sisi 1 cm, 1 cm, dan 2 cm.",
    parts: [
      { label: "a.", math: "1^2 + 1^2 = 2" },
      { label: "b.", math: "2^2 = 4" },
      { label: "c.", math: "2 < 4 \\Rightarrow \\text{segitiga } ..." },
      { label: "d.", text: "Perhatikan: apakah 1, 1, 2 bisa membentuk segitiga?" },
    ],
  },
  { n: 10, type: "mixed", title: "Segitiga 7-8-9",
    content: "Tentukan jenis segitiga dengan sisi 7 cm, 8 cm, dan 9 cm.",
    parts: [
      { label: "a.", math: "7^2 + 8^2 = 49 + 64 = 113" },
      { label: "b.", math: "9^2 = 81" },
      { label: "c.", math: "113 > 81 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 11, type: "mixed", title: "Segitiga 10-24-26",
    content: "Tentukan jenis segitiga 10, 24, 26.",
    parts: [
      { label: "a.", math: "10^2 + 24^2 = 100 + 576 = 676" },
      { label: "b.", math: "26^2 = 676" },
      { label: "c.", math: "\\text{Jenis segitiga: }..." },
    ],
  },
  { n: 12, type: "mixed", title: "ANBK — Tabel Jenis Segitiga",
    content: "Lengkapi tabel berikut:",
    parts: [
      { label: "(i)", math: "3,\\ 4,\\ 6:\\ a^2+b^2 = ...,\\ c^2 = ...,\\ \\text{jenis} = ..." },
      { label: "(ii)", math: "9,\\ 12,\\ 15:\\ a^2+b^2 = ...,\\ c^2 = ...,\\ \\text{jenis} = ..." },
      { label: "(iii)", math: "6,\\ 7,\\ 10:\\ a^2+b^2 = ...,\\ c^2 = ...,\\ \\text{jenis} = ..." },
    ],
  },
  { n: 13, type: "mixed", title: "Segitiga dengan Sudut Tumpul",
    content: "Segitiga dengan sudut tumpul berarti salah satu sudutnya lebih dari 90°.",
    parts: [
      { label: "a.", math: "\\text{Cek: } \\{3,\\ 5,\\ 7\\}" },
      { label: "b.", math: "3^2 + 5^2 = 9 + 25 = 34,\\quad 7^2 = 49" },
      { label: "c.", math: "34 < 49 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 14, type: "mixed", title: "Segitiga Lancip — Identifikasi",
    diagram: (
      <PythagorasDiagram
        A={{ x: 130, y: 55, label: "A", labelDy: -12, color: "#facc15" }}
        B={{ x: 50, y: 185, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 215, y: 185, label: "C", labelDy: 14, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "6", color: "#34d399", dx: -12 }}
        BC={{ text: "7", color: "#60a5fa", dy: 14 }}
        CA={{ text: "6", color: "#a78bfa", dx: 12 }}
        extras={[{ type: 'text', x: 130, y: 135, text: 'Lancip?', color: 'rgba(250,204,21,0.5)', size: 11 }]}
        vw={265} vh={225} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "6^2 + 6^2 = 36 + 36 = 72" },
      { label: "b.", math: "7^2 = 49" },
      { label: "c.", math: "72 > 49 \\Rightarrow \\text{segitiga ini adalah segitiga } ..." },
    ],
  },
  { n: 15, type: "mixed", title: "Syarat Segitiga Lancip",
    content: "Untuk segitiga dengan sisi a, b, c (c terbesar) menjadi LANCIP:",
    parts: [
      { label: "a.", math: "\\text{Syarat: } a^2 + b^2 > c^2" },
      { label: "b.", math: "\\text{Cek: } \\{4,\\ 6,\\ 7\\}:\\ 4^2+6^2 = 52,\\ 7^2 = 49,\\ 52 > 49 \\Rightarrow ..." },
      { label: "c.", math: "\\text{Cek: } \\{5,\\ 6,\\ 8\\}:\\ 5^2+6^2 = 61,\\ 8^2 = 64,\\ 61 < 64 \\Rightarrow ..." },
    ],
  },
  { n: 16, type: "mixed", title: "TKA — Menentukan Jenis dari Angka",
    content: "Tanpa menggambar, tentukan jenis segitiga berikut:",
    parts: [
      { label: "a.", math: "\\{11,\\ 12,\\ 15\\}" },
      { label: "b.", math: "\\{9,\\ 40,\\ 41\\}" },
      { label: "c.", math: "\\{10,\\ 11,\\ 16\\}" },
      { label: "d.", math: "\\{6,\\ 6,\\ 6\\}" },
    ],
  },
  { n: 17, type: "mixed", title: "Hubungan Sudut dan Pythagoras",
    content: "Jika a² + b² > c², semua sudut kurang dari 90°.",
    parts: [
      { label: "a.", text: "Apa nama segitiga yang semua sudutnya kurang dari 90°?" },
      { label: "b.", text: "Apa nama segitiga yang memiliki sudut tepat 90°?" },
      { label: "c.", text: "Apa nama segitiga yang memiliki sudut lebih dari 90°?" },
    ],
  },
  { n: 18, type: "mixed", title: "UN — Menentukan Jenis",
    content: "Diketahui panjang sisi segitiga 13 cm, 14 cm, dan 15 cm. Tentukan jenisnya.",
    parts: [
      { label: "a.", math: "a^2 + b^2 = 13^2 + 14^2 = 169 + 196 = 365" },
      { label: "b.", math: "c^2 = 15^2 = 225" },
      { label: "c.", math: "365 > 225 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 19, type: "mixed", title: "Segitiga dari Ekspresi Aljabar",
    content: "Tentukan jenis segitiga dengan sisi x, x, x√2 (x > 0).",
    parts: [
      { label: "a.", math: "a^2 + b^2 = x^2 + x^2 = 2x^2" },
      { label: "b.", math: "c^2 = (x\\sqrt{2})^2 = 2x^2" },
      { label: "c.", math: "2x^2 = 2x^2 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 20, type: "mixed", title: "Segitiga dengan Irasional",
    content: "Tentukan jenis segitiga dengan sisi 3, 5, dan √35.",
    parts: [
      { label: "a.", math: "3^2 + 5^2 = 9 + 25 = 34" },
      { label: "b.", math: "(\\sqrt{35})^2 = 35" },
      { label: "c.", math: "34 < 35 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 21, type: "mixed", title: "Segitiga 1-1-√3",
    content: "Tentukan jenis segitiga dengan sisi 1, 1, dan √3.",
    parts: [
      { label: "a.", math: "1^2 + 1^2 = 2" },
      { label: "b.", math: "(\\sqrt{3})^2 = 3" },
      { label: "c.", math: "2 < 3 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 22, type: "mixed", title: "ANBK — Benar/Salah",
    content: "Tentukan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", text: "Segitiga dengan sisi 6, 8, 10 adalah segitiga siku-siku." },
      { label: "(2)", text: "Semua segitiga sama sisi adalah segitiga lancip." },
      { label: "(3)", text: "Segitiga dengan sisi 3, 4, 6 adalah segitiga tumpul." },
      { label: "(4)", text: "Jika a² + b² = c², maka segitiga tersebut adalah segitiga lancip." },
    ],
  },
  { n: 23, type: "mixed", title: "Segitiga 2-2-3",
    content: "Tentukan jenis segitiga dengan sisi 2 cm, 2 cm, dan 3 cm.",
    parts: [
      { label: "a.", math: "2^2 + 2^2 = 8" },
      { label: "b.", math: "3^2 = 9" },
      { label: "c.", math: "8 < 9 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 24, type: "mixed", title: "Segitiga 10-10-14",
    content: "Tentukan jenis segitiga sama kaki dengan kaki 10 cm dan alas 14 cm.",
    parts: [
      { label: "a.", math: "10^2 + 10^2 = 200" },
      { label: "b.", math: "14^2 = 196" },
      { label: "c.", math: "200 > 196 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 25, type: "mixed", title: "Segitiga 5-5-8",
    content: "Tentukan jenis segitiga sama kaki 5, 5, 8.",
    parts: [
      { label: "a.", math: "5^2 + 5^2 = 50" },
      { label: "b.", math: "8^2 = 64" },
      { label: "c.", math: "50 < 64 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 26, type: "mixed", title: "TKA — Pasangkan",
    content: "Pasangkan setiap set sisi dengan jenis segitiga yang tepat (Lancip, Siku-siku, atau Tumpul):",
    parts: [
      { label: "1.", math: "\\{3,\\ 4,\\ 5\\}" },
      { label: "2.", math: "\\{4,\\ 5,\\ 7\\}" },
      { label: "3.", math: "\\{5,\\ 6,\\ 7\\}" },
      { label: "4.", math: "\\{8,\\ 15,\\ 17\\}" },
    ],
  },
  { n: 27, type: "mixed", title: "Segitiga dengan Sisi Berurutan",
    content: "Tentukan jenis segitiga dengan sisi n, n+1, n+2 untuk n = 3.",
    parts: [
      { label: "a.", math: "3^2 + 4^2 = 9 + 16 = 25" },
      { label: "b.", math: "5^2 = 25" },
      { label: "c.", math: "25 = 25 \\Rightarrow \\text{segitiga } ..." },
      { label: "d.", text: "Apakah untuk setiap n berlaku ini? Coba n = 4." },
    ],
  },
  { n: 28, type: "mixed", title: "Cek Segitiga Tumpul",
    diagram: (
      <PythagorasDiagram
        A={{ x: 55, y: 180, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 215, y: 180, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 90, y: 70, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "9 cm", color: "#60a5fa", dy: 14 }}
        BC={{ text: "10 cm", color: "#34d399", dx: 12 }}
        CA={{ text: "4 cm", color: "#f472b6", dx: -14 }}
        extras={[{ type: 'text', x: 130, y: 140, text: 'Tumpul?', color: 'rgba(251,146,60,0.6)', size: 11 }]}
        vw={270} vh={225} size={235}
      />
    ),
    parts: [
      { label: "a.", math: "a^2 + b^2 = 4^2 + 9^2 = 16 + 81 = 97" },
      { label: "b.", math: "c^2 = 10^2 = 100" },
      { label: "c.", math: "97 < 100 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 29, type: "mixed", title: "Segitiga dengan Sisi Berbeda",
    content: "Tentukan jenis segitiga untuk setiap set sisi berikut:",
    parts: [
      { label: "a.", math: "\\{15,\\ 20,\\ 24\\}" },
      { label: "b.", math: "\\{7,\\ 25,\\ 24\\}" },
      { label: "c.", math: "\\{12,\\ 13,\\ 14\\}" },
    ],
  },
  { n: 30, type: "mixed", title: "Segitiga 4-7-√65",
    content: "Tentukan jenis segitiga dengan sisi 4, 7, dan √65.",
    parts: [
      { label: "a.", math: "4^2 + 7^2 = 16 + 49 = 65" },
      { label: "b.", math: "(\\sqrt{65})^2 = 65" },
      { label: "c.", math: "65 = 65 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 31, type: "mixed", title: "UN — Soal Jenis Segitiga",
    content: "Segitiga XYZ memiliki XY = 8 cm, YZ = 15 cm, dan XZ = 17 cm. Tentukan jenis segitiga ini.",
    parts: [
      { label: "a.", math: "XY^2 + YZ^2 = 8^2 + 15^2 = 64 + 225 = 289" },
      { label: "b.", math: "XZ^2 = 17^2 = 289" },
      { label: "c.", text: "Jenis segitiga XYZ adalah ... dan sudut siku-siku berada di titik ..." },
    ],
  },
  { n: 32, type: "mixed", title: "Menentukan Jenis 5 Segitiga",
    content: "Tentukan jenis masing-masing segitiga:",
    parts: [
      { label: "a.", math: "\\{2,\\ 4,\\ 5\\}" },
      { label: "b.", math: "\\{6,\\ 6,\\ 6\\}" },
      { label: "c.", math: "\\{5,\\ 12,\\ 13\\}" },
      { label: "d.", math: "\\{4,\\ 4,\\ 6\\}" },
      { label: "e.", math: "\\{10,\\ 10,\\ 10\\sqrt{2}\\}" },
    ],
  },
  { n: 33, type: "mixed", title: "Segitiga dari Koordinat",
    content: "Titik A(0,0), B(5,0), C(0,7) membentuk segitiga. Tentukan jenisnya.",
    parts: [
      { label: "a.", math: "AB = 5,\\ AC = 7,\\ BC = \\sqrt{5^2+7^2} = \\sqrt{74}" },
      { label: "b.", math: "AB^2 + AC^2 = 25 + 49 = 74 = BC^2" },
      { label: "c.", text: "Jenis segitiga ABC adalah ..." },
    ],
  },
  { n: 34, type: "mixed", title: "ANBK — Menganalisis Pernyataan",
    content: "Seorang siswa mengatakan: 'Segitiga sama kaki dengan kaki 5 dan alas 8 adalah segitiga siku-siku.' Evaluasi pernyataan ini:",
    parts: [
      { label: "a.", math: "5^2 + 5^2 = 50" },
      { label: "b.", math: "8^2 = 64" },
      { label: "c.", text: "Apakah pernyataan siswa tersebut benar? Jelaskan!" },
    ],
  },
  { n: 35, type: "mixed", title: "Segitiga Lancip Terbesar",
    content: "Dari set sisi berikut, mana yang membentuk segitiga lancip dengan sudut terbesar?",
    parts: [
      { label: "a.", math: "\\{4,\\ 5,\\ 6\\}:\\ 4^2+5^2=41,\\ 6^2=36 \\Rightarrow ..." },
      { label: "b.", math: "\\{5,\\ 6,\\ 7\\}:\\ 5^2+6^2=61,\\ 7^2=49 \\Rightarrow ..." },
      { label: "c.", text: "Mana yang lebih lancip? Bandingkan selisih a²+b²-c²." },
    ],
  },
  { n: 36, type: "mixed", title: "Segitiga Tumpul — Mencari Nilai",
    content: "Segitiga dengan sisi 5, 8, dan x adalah segitiga tumpul (x adalah sisi terbesar).",
    parts: [
      { label: "a.", math: "\\text{Syarat tumpul: } 5^2 + 8^2 < x^2" },
      { label: "b.", math: "89 < x^2 \\Rightarrow x > \\sqrt{89} \\approx 9{,}43" },
      { label: "c.", text: "Juga perlu x < 5 + 8 = 13 (syarat segitiga). Jadi berapa rentang x?" },
    ],
  },
  { n: 37, type: "mixed", title: "TKA — Segitiga dari Sisi Berupa Akar",
    content: "Tentukan jenis segitiga dengan sisi √2, √3, dan √5.",
    parts: [
      { label: "a.", math: "(\\sqrt{2})^2 + (\\sqrt{3})^2 = 2 + 3 = 5" },
      { label: "b.", math: "(\\sqrt{5})^2 = 5" },
      { label: "c.", math: "5 = 5 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 38, type: "mixed", title: "Segitiga √3-√3-√3",
    content: "Tentukan jenis segitiga sama sisi dengan sisi √3.",
    parts: [
      { label: "a.", math: "(\\sqrt{3})^2 + (\\sqrt{3})^2 = 3 + 3 = 6" },
      { label: "b.", math: "(\\sqrt{3})^2 = 3" },
      { label: "c.", math: "6 > 3 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 39, type: "mixed", title: "Mengklasifikasi 5 Segitiga Sekaligus",
    content: "Tentukan jenis kelima segitiga berikut:",
    parts: [
      { label: "1.", math: "\\{6,\\ 8,\\ 9\\}" },
      { label: "2.", math: "\\{9,\\ 12,\\ 15\\}" },
      { label: "3.", math: "\\{7,\\ 8,\\ 12\\}" },
      { label: "4.", math: "\\{1,\\ \\sqrt{3},\\ 2\\}" },
      { label: "5.", math: "\\{3,\\ 3,\\ 3\\sqrt{2}\\}" },
    ],
  },
  { n: 40, type: "mixed", title: "Soal UN — Jenis Segitiga",
    content: "Sebuah segitiga memiliki panjang sisi p, p+1, dan p+2. Untuk nilai p berapa segitiga ini menjadi siku-siku?",
    parts: [
      { label: "a.", math: "p^2 + (p+1)^2 = (p+2)^2" },
      { label: "b.", math: "p^2 + p^2+2p+1 = p^2+4p+4" },
      { label: "c.", math: "p^2 - 2p - 3 = 0 \\Rightarrow (p-3)(p+1) = 0" },
      { label: "d.", math: "p = 3 \\text{ (karena } p > 0\\text{). Cek: } 3, 4, 5 \\Rightarrow \\text{siku-siku!}" },
    ],
  },
];

const JenisSegitigaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Triangle className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #fb923c88' }}>
            PYTHAGORAS DAN JENIS-JENIS SEGITIGA
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

export default JenisSegitigaPage;
