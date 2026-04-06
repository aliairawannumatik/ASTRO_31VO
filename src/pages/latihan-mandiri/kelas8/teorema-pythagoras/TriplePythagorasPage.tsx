import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Star } from "lucide-react";
import PythagorasDiagram from "./PythagorasDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };

const accent = "#34d399";

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
  { n: 1, type: "mixed", title: "Triple Dasar 3-4-5",
    diagram: (
      <PythagorasDiagram
        A={{ x: 65, y: 175, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 195, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 65, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "4", color: "#60a5fa", dy: 14 }}
        BC={{ text: "5", color: "#34d399", dx: 12 }}
        CA={{ text: "3", color: "#f472b6", dx: -12 }}
        vw={260} vh={220} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "3^2 + 4^2 = 9 + 16 = ..." },
      { label: "b.", math: "5^2 = ..." },
      { label: "c.", text: "Apakah 3, 4, 5 merupakan triple Pythagoras? Jelaskan!" },
    ],
  },
  { n: 2, type: "mixed", title: "Triple 5-12-13",
    parts: [
      { label: "a.", math: "5^2 + 12^2 = 25 + 144 = ..." },
      { label: "b.", math: "13^2 = ..." },
      { label: "c.", text: "Apakah 5, 12, 13 membentuk segitiga siku-siku?" },
    ],
  },
  { n: 3, type: "mixed", title: "Triple 8-15-17",
    parts: [
      { label: "a.", math: "8^2 + 15^2 = 64 + 225 = ..." },
      { label: "b.", math: "17^2 = ..." },
      { label: "c.", text: "Apakah 8, 15, 17 merupakan triple Pythagoras?" },
    ],
  },
  { n: 4, type: "mixed", title: "Triple 7-24-25",
    parts: [
      { label: "a.", math: "7^2 + 24^2 = 49 + 576 = ..." },
      { label: "b.", math: "25^2 = ..." },
      { label: "c.", text: "Konfirmasi bahwa 7, 24, 25 adalah triple Pythagoras." },
    ],
  },
  { n: 5, type: "mixed", title: "Kelipatan Triple 3-4-5",
    content: "Kelipatan triple Pythagoras juga merupakan triple Pythagoras.",
    parts: [
      { label: "a.", math: "\\text{Cek kelipatan 2: } 6, 8, 10" },
      { label: "b.", math: "\\text{Cek kelipatan 3: } 9, 12, 15" },
      { label: "c.", math: "\\text{Cek kelipatan 5: } 15, 20, 25" },
    ],
  },
  { n: 6, type: "mixed", title: "Kelipatan Triple 5-12-13",
    parts: [
      { label: "a.", math: "\\text{Cek kelipatan 2: } 10, 24, 26" },
      { label: "b.", math: "\\text{Cek kelipatan 3: } 15, 36, 39" },
      { label: "c.", text: "Jika (a, b, c) adalah triple Pythagoras, apakah (ka, kb, kc) juga triple Pythagoras? Jelaskan!" },
    ],
  },
  { n: 7, type: "mixed", title: "Mengenali Triple Pythagoras",
    content: "Tentukan mana yang merupakan triple Pythagoras:",
    parts: [
      { label: "a.", math: "\\{6,\\ 8,\\ 10\\}" },
      { label: "b.", math: "\\{5,\\ 7,\\ 9\\}" },
      { label: "c.", math: "\\{9,\\ 12,\\ 15\\}" },
      { label: "d.", math: "\\{4,\\ 6,\\ 8\\}" },
    ],
  },
  { n: 8, type: "mixed", title: "Melengkapi Triple Pythagoras",
    content: "Temukan bilangan ketiga agar menjadi triple Pythagoras:",
    parts: [
      { label: "a.", math: "\\{3,\\ 4,\\ ?\\}" },
      { label: "b.", math: "\\{5,\\ ?,\\ 13\\}" },
      { label: "c.", math: "\\{?,\\ 24,\\ 25\\}" },
      { label: "d.", math: "\\{8,\\ ?,\\ 17\\}" },
    ],
  },
  { n: 9, type: "mixed", title: "Triple 9-40-41",
    parts: [
      { label: "a.", math: "9^2 + 40^2 = 81 + 1600 = ..." },
      { label: "b.", math: "41^2 = ..." },
      { label: "c.", text: "Apakah 9, 40, 41 adalah triple Pythagoras?" },
    ],
  },
  { n: 10, type: "mixed", title: "Triple 11-60-61",
    parts: [
      { label: "a.", math: "11^2 + 60^2 = 121 + 3600 = ..." },
      { label: "b.", math: "61^2 = ..." },
      { label: "c.", text: "Apakah 11, 60, 61 merupakan triple Pythagoras?" },
    ],
  },
  { n: 11, type: "mixed", title: "UN — Menentukan Sisi dari Triple",
    content: "Sisi-sisi segitiga siku-siku membentuk triple Pythagoras. Dua sisi diketahui: 20 cm dan 21 cm.",
    parts: [
      { label: "a.", math: "c = \\sqrt{20^2 + 21^2} = \\sqrt{400 + 441} = \\sqrt{841}" },
      { label: "b.", math: "c = ...\\ \\text{cm (apakah bilangan bulat?)}" },
      { label: "c.", text: "Apakah 20, 21, 29 adalah triple Pythagoras?" },
    ],
  },
  { n: 12, type: "mixed", title: "Membuat Triple dari Rumus",
    content: "Rumus menghasilkan triple Pythagoras: m² − n², 2mn, m² + n² (m > n > 0, bulat).",
    parts: [
      { label: "a.", math: "m=2, n=1: \\quad 2^2-1^2=?,\\quad 2(2)(1)=?,\\quad 2^2+1^2=?" },
      { label: "b.", math: "m=3, n=2: \\quad 3^2-2^2=?,\\quad 2(3)(2)=?,\\quad 3^2+2^2=?" },
      { label: "c.", math: "m=4, n=1: \\quad 4^2-1^2=?,\\quad 2(4)(1)=?,\\quad 4^2+1^2=?" },
    ],
  },
  { n: 13, type: "mixed", title: "Triple 20-21-29",
    parts: [
      { label: "a.", math: "20^2 + 21^2 = 400 + 441 = ..." },
      { label: "b.", math: "29^2 = ..." },
      { label: "c.", text: "Konfirmasi apakah 20, 21, 29 adalah triple Pythagoras." },
    ],
  },
  { n: 14, type: "mixed", title: "Triple 28-45-53",
    parts: [
      { label: "a.", math: "28^2 + 45^2 = 784 + 2025 = ..." },
      { label: "b.", math: "53^2 = ..." },
      { label: "c.", text: "Apakah 28, 45, 53 merupakan triple Pythagoras?" },
    ],
  },
  { n: 15, type: "mixed", title: "Identifikasi Triple dari Kelipatan",
    content: "Diketahui triple dasar 8-15-17. Tentukan apakah berikut ini juga triple Pythagoras:",
    parts: [
      { label: "a.", math: "\\{16,\\ 30,\\ 34\\}" },
      { label: "b.", math: "\\{24,\\ 45,\\ 51\\}" },
      { label: "c.", math: "\\{40,\\ 75,\\ 85\\}" },
    ],
  },
  { n: 16, type: "mixed", title: "ANBK — Pilih yang Merupakan Triple",
    content: "Dari pilihan berikut, mana yang merupakan triple Pythagoras? (Pilih semua yang benar)",
    parts: [
      { label: "(A)", math: "3, 4, 5" },
      { label: "(B)", math: "6, 7, 8" },
      { label: "(C)", math: "5, 12, 13" },
      { label: "(D)", math: "10, 24, 26" },
    ],
  },
  { n: 17, type: "mixed", title: "Soal Kontekstual — Triple",
    content: "Dua buah ruas jalan bertemu membentuk sudut siku-siku. Panjang ruas pertama 9 km dan ruas kedua 12 km. Jalan pintas memotong lurus.",
    parts: [
      { label: "a.", math: "\\text{Jalan pintas} = \\sqrt{9^2 + 12^2} = ..." },
      { label: "b.", text: "Apakah ini kelipatan triple 3-4-5?" },
      { label: "c.", text: "Berapa meter lebih pendek melalui jalan pintas?" },
    ],
  },
  { n: 18, type: "mixed", title: "Triple Primitif vs Non-Primitif",
    content: "Triple Pythagoras PRIMITIF adalah triple yang tidak dapat disederhanakan (FPB = 1).",
    parts: [
      { label: "a.", text: "Apakah 3-4-5 triple primitif? (FPB dari 3, 4, 5 = ?)" },
      { label: "b.", text: "Apakah 6-8-10 triple primitif? (FPB dari 6, 8, 10 = ?)" },
      { label: "c.", text: "Sebutkan tiga triple Pythagoras primitif lainnya!" },
    ],
  },
  { n: 19, type: "mixed", title: "Triple 33-56-65",
    parts: [
      { label: "a.", math: "33^2 + 56^2 = 1089 + 3136 = ..." },
      { label: "b.", math: "65^2 = ..." },
      { label: "c.", text: "Verifikasi bahwa 33, 56, 65 adalah triple Pythagoras." },
    ],
  },
  { n: 20, type: "mixed", title: "Pola Triple — Bilangan Ganjil",
    content: "Untuk setiap bilangan ganjil m ≥ 3, kita dapat membuat triple: m, (m²-1)/2, (m²+1)/2.",
    parts: [
      { label: "a.", math: "m=3: \\quad 3,\\ \\frac{9-1}{2},\\ \\frac{9+1}{2} = 3,\\ ?,\\ ?" },
      { label: "b.", math: "m=5: \\quad 5,\\ \\frac{25-1}{2},\\ \\frac{25+1}{2} = 5,\\ ?,\\ ?" },
      { label: "c.", math: "m=7: \\quad 7,\\ ?,\\ ? \\text{ (hitung!)" },
    ],
  },
  { n: 21, type: "mixed", title: "Mengenali Kelipatan Triple",
    content: "Tentukan triple dasar dari setiap set berikut:",
    parts: [
      { label: "a.", math: "\\{12,\\ 16,\\ 20\\}" },
      { label: "b.", math: "\\{15,\\ 36,\\ 39\\}" },
      { label: "c.", math: "\\{24,\\ 32,\\ 40\\}" },
    ],
  },
  { n: 22, type: "mixed", title: "Triple 36-77-85",
    parts: [
      { label: "a.", math: "36^2 + 77^2 = 1296 + 5929 = ..." },
      { label: "b.", math: "85^2 = ..." },
      { label: "c.", text: "Apakah 36, 77, 85 merupakan triple Pythagoras?" },
    ],
  },
  { n: 23, type: "mixed", title: "Sisi Segitiga dari Triple",
    diagram: (
      <PythagorasDiagram
        A={{ x: 55, y: 180, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 215, y: 180, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 55, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "24 cm", color: "#60a5fa", dy: 14 }}
        BC={{ text: "c = ?", color: "#34d399", dx: 12 }}
        CA={{ text: "10 cm", color: "#f472b6", dx: -18 }}
        vw={275} vh={230} size={235}
      />
    ),
    parts: [
      { label: "a.", math: "c^2 = 10^2 + 24^2 = 100 + 576 = ..." },
      { label: "b.", math: "c = \\sqrt{676} = ...\\ \\text{cm}" },
      { label: "c.", text: "Apakah 10, 24, 26 merupakan kelipatan triple 5-12-13?" },
    ],
  },
  { n: 24, type: "mixed", title: "Aplikasi Triple — Taman Kota",
    content: "Taman kota berbentuk segitiga siku-siku dengan sisi 30 m, 40 m, dan 50 m.",
    parts: [
      { label: "a.", text: "Apakah ini kelipatan triple 3-4-5?" },
      { label: "b.", math: "30^2 + 40^2 = 900 + 1600 = ...\\ \\text{dan}\\ 50^2 = ..." },
      { label: "c.", math: "\\text{Luas taman} = \\frac{1}{2} \\times 30 \\times 40 = ...\\ \\text{m}^2" },
    ],
  },
  { n: 25, type: "mixed", title: "TKA — Melengkapi Triple",
    content: "Diberikan dua bilangan dari triple Pythagoras. Temukan bilangan ketiga:",
    parts: [
      { label: "a.", math: "\\{12,\\ 35,\\ ?\\}" },
      { label: "b.", math: "\\{?,\\ 40,\\ 41\\}" },
      { label: "c.", math: "\\{16,\\ ?,\\ 20\\}" },
    ],
  },
  { n: 26, type: "mixed", title: "Triple 13-84-85",
    parts: [
      { label: "a.", math: "13^2 + 84^2 = 169 + 7056 = ..." },
      { label: "b.", math: "85^2 = ..." },
      { label: "c.", text: "Konfirmasi apakah 13, 84, 85 adalah triple Pythagoras." },
    ],
  },
  { n: 27, type: "mixed", title: "Kontekstual — Lapangan",
    content: "Lapangan olahraga berbentuk persegi panjang 40 m × 30 m. Seorang pemain berlari dari pojok ke pojok diagonal.",
    parts: [
      { label: "a.", math: "d = \\sqrt{40^2 + 30^2} = \\sqrt{1600 + 900} = ..." },
      { label: "b.", text: "Apakah 30, 40, 50 merupakan kelipatan triple 3-4-5?" },
      { label: "c.", math: "\\text{Tentukan kelipatan: } 30 = ? \\times 3,\\ 40 = ? \\times 4,\\ 50 = ? \\times 5" },
    ],
  },
  { n: 28, type: "mixed", title: "Rumus Triple Pythagoras",
    content: "Gunakan rumus p = m² − n², q = 2mn, r = m² + n² untuk menghasilkan triple:",
    parts: [
      { label: "a.", math: "m=5,\\ n=2:\\quad p=?,\\ q=?,\\ r=?" },
      { label: "b.", math: "m=4,\\ n=3:\\quad p=?,\\ q=?,\\ r=?" },
      { label: "c.", math: "m=6,\\ n=1:\\quad p=?,\\ q=?,\\ r=?" },
    ],
  },
  { n: 29, type: "mixed", title: "UN — Triple Pythagoras dalam Soal",
    content: "Jika diketahui dua kaki segitiga siku-siku adalah 12 cm dan 16 cm, tentukan hipotenusanya dan tunjukkan apakah itu kelipatan triple tertentu.",
    parts: [
      { label: "a.", math: "c = \\sqrt{12^2 + 16^2} = \\sqrt{144+256} = \\sqrt{400}" },
      { label: "b.", math: "c = ...\\ \\text{cm}" },
      { label: "c.", text: "Kelipatan berapa dari triple 3-4-5?" },
    ],
  },
  { n: 30, type: "mixed", title: "Menentukan Kelipatan",
    content: "Sebuah triple Pythagoras adalah kelipatan dari triple primitif. Tentukan triple primitif dan kelipatannya:",
    parts: [
      { label: "a.", math: "\\{20,\\ 48,\\ 52\\} \\div 4 = ..." },
      { label: "b.", math: "\\{30,\\ 40,\\ 50\\} \\div 10 = ..." },
      { label: "c.", math: "\\{24,\\ 70,\\ 74\\} \\div 2 = ..." },
    ],
  },
  { n: 31, type: "mixed", title: "Triple Berurutan",
    content: "Ada beberapa triple Pythagoras di mana dua sisi-nya berurutan.",
    parts: [
      { label: "a.", math: "3, 4, 5 \\text{ (4 dan 5 berurutan)}" },
      { label: "b.", math: "20, 21, 29 \\text{ (20 dan 21 berurutan)}" },
      { label: "c.", text: "Temukan satu triple lain di mana dua sisinya merupakan bilangan berurutan!" },
    ],
  },
  { n: 32, type: "mixed", title: "ANBK — Benar atau Salah",
    content: "Tentukan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", math: "\\{6,\\ 8,\\ 10\\} \\text{ adalah kelipatan triple } 3\\text{-}4\\text{-}5" },
      { label: "(2)", text: "Setiap kelipatan integer dari triple Pythagoras juga triple Pythagoras." },
      { label: "(3)", math: "\\{4,\\ 5,\\ 6\\} \\text{ adalah triple Pythagoras}" },
      { label: "(4)", text: "Triple Pythagoras primitif tidak memiliki faktor persekutuan." },
    ],
  },
  { n: 33, type: "mixed", title: "Triple dengan Kaki Ganjil-Genap",
    content: "Pada triple Pythagoras primitif, selalu ada tepat satu angka genap.",
    parts: [
      { label: "a.", text: "Periksa triple 3-4-5: berapa banyak angka genap?" },
      { label: "b.", text: "Periksa triple 5-12-13: berapa banyak angka genap?" },
      { label: "c.", text: "Periksa triple 8-15-17: berapa banyak angka genap?" },
    ],
  },
  { n: 34, type: "mixed", title: "Kontekstual — Kapal Berlayar",
    content: "Kapal berlayar 20 mil ke utara, kemudian 21 mil ke timur. Jarak lurus dari titik awal?",
    parts: [
      { label: "a.", math: "d = \\sqrt{20^2 + 21^2} = \\sqrt{400 + 441} = \\sqrt{841}" },
      { label: "b.", math: "d = ...\\ \\text{mil}" },
      { label: "c.", text: "Apakah 20, 21, 29 adalah triple Pythagoras?" },
    ],
  },
  { n: 35, type: "mixed", title: "Triple 3-4-5 dalam Kehidupan",
    content: "Tukang bangunan menggunakan triple 3-4-5 untuk memastikan sudut 90°.",
    parts: [
      { label: "a.", text: "Jika diukur dari sudut bangunan: 3 m ke satu arah dan 4 m ke arah tegak lurus, jarak diagonal harusnya berapa?" },
      { label: "b.", text: "Jika diagonalnya tepat 5 m, apa yang bisa disimpulkan?" },
      { label: "c.", text: "Mengapa menggunakan kelipatan yang lebih besar (misal 6-8-10) lebih akurat?" },
    ],
  },
  { n: 36, type: "mixed", title: "Mengisi Tabel Triple",
    content: "Lengkapi tabel triple Pythagoras berikut:",
    parts: [
      { label: "Triple 1:", math: "3,\\ 4,\\ ?" },
      { label: "Triple 2:", math: "5,\\ ?,\\ 13" },
      { label: "Triple 3:", math: "?,\\ 15,\\ 17" },
      { label: "Triple 4:", math: "7,\\ 24,\\ ?" },
    ],
  },
  { n: 37, type: "mixed", title: "Tiga Triple Terkenal",
    content: "Verifikasi ketiga triple Pythagoras paling terkenal:",
    parts: [
      { label: "1.", math: "3^2 + 4^2 = 5^2" },
      { label: "2.", math: "5^2 + 12^2 = 13^2" },
      { label: "3.", math: "8^2 + 15^2 = 17^2" },
    ],
  },
  { n: 38, type: "mixed", title: "TKA — Triple dan Sisi",
    content: "Segitiga siku-siku dengan sisi terkecil 9 cm membentuk triple Pythagoras primitif.",
    parts: [
      { label: "a.", math: "\\text{Triple: } 9,\\ ?,\\ ?" },
      { label: "b.", math: "9^2 + 40^2 = 81 + 1600 = 1681 = 41^2" },
      { label: "c.", text: "Jadi triple Pythagoras dengan kaki terkecil 9 adalah: 9, 40, 41." },
    ],
  },
  { n: 39, type: "mixed", title: "Kelipatan Triple untuk Masalah Nyata",
    content: "Sebuah tiang bendera setinggi 20 m berdiri tegak. Kawat penahan ditarik dari puncak tiang ke tanah sejauh 15 m dari kaki tiang.",
    parts: [
      { label: "a.", math: "\\text{Panjang kawat} = \\sqrt{20^2 + 15^2} = \\sqrt{400 + 225} = \\sqrt{625}" },
      { label: "b.", math: "\\text{Panjang kawat} = ...\\ \\text{m}" },
      { label: "c.", text: "Apakah 15, 20, 25 kelipatan triple 3-4-5?" },
    ],
  },
  { n: 40, type: "mixed", title: "Soal UN — Triple dalam Konteks",
    content: "Seorang pendaki mendaki bukit 24 m (vertikal), kemudian berjalan mendatar 7 m. Berapa total jarak yang ia tempuh dari titik awal secara lurus?",
    parts: [
      { label: "a.", math: "d = \\sqrt{7^2 + 24^2} = \\sqrt{49 + 576} = \\sqrt{625}" },
      { label: "b.", math: "d = ...\\ \\text{m}" },
      { label: "c.", text: "Apakah 7, 24, 25 merupakan triple Pythagoras primitif?" },
    ],
  },
];

const TriplePythagorasPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #34d39988' }}>
            TRIPLE PYTHAGORAS
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

export default TriplePythagorasPage;
