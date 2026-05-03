import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Circle } from "lucide-react";
import CircleDiagram, { CircleDiagramProps } from "./CircleDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: CircleDiagramProps;
  blockMath?: string;
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Rumus Keliling Lingkaran", {
    type: "essay",
    content: "Keliling lingkaran dihitung dengan rumus K = πd = 2πr, dengan π ≈ 22/7 atau π ≈ 3,14.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling lingkaran dengan } r = 7 \\text{ cm.}" },
      { label: "b.", math: "\\text{Hitung keliling lingkaran dengan } r = 21 \\text{ cm.}" },
      { label: "c.", math: "\\text{Hitung keliling lingkaran dengan } r = 10 \\text{ cm.}" },
    ],
  }),

  Q(2, "Rumus Luas Lingkaran", {
    type: "essay",
    content: "Luas lingkaran dihitung dengan rumus L = πr².",
    parts: [
      { label: "a.", math: "\\text{Hitung luas lingkaran dengan } r = 7 \\text{ cm.}" },
      { label: "b.", math: "\\text{Hitung luas lingkaran dengan } r = 3{,}5 \\text{ cm.}" },
      { label: "c.", math: "\\text{Hitung luas lingkaran dengan } d = 20 \\text{ cm.}" },
    ],
  }),

  Q(3, "Mencari Jari-Jari dari Keliling", {
    type: "essay",
    content: "Tentukan jari-jari lingkaran jika diketahui kelilingnya!",
    parts: [
      { label: "a.", math: "K = 44 \\text{ cm}" },
      { label: "b.", math: "K = 62{,}8 \\text{ cm}" },
      { label: "c.", math: "K = 88 \\text{ cm}" },
    ],
  }),

  Q(4, "Mencari Jari-Jari dari Luas", {
    type: "essay",
    content: "Tentukan jari-jari lingkaran jika diketahui luasnya!",
    parts: [
      { label: "a.", math: "L = 154 \\text{ cm}^2, \\pi = \\tfrac{22}{7}" },
      { label: "b.", math: "L = 314 \\text{ cm}^2, \\pi = 3{,}14" },
      { label: "c.", math: "L = 616 \\text{ cm}^2, \\pi = \\tfrac{22}{7}" },
    ],
  }),

  Q(5, "Soal UN — Keliling Lingkaran dalam Konteks", {
    type: "mixed",
    content: "Sebuah kolam renang berbentuk lingkaran dengan diameter 14 m. Di sekeliling kolam akan dipasang pagar.",
    parts: [
      { label: "a.", math: "\\text{Hitunglah keliling kolam. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Jika pagar dijual Rp 75.000,00 per meter, berapakah biaya pemasangan pagar?" },
      { label: "c.", text: "Jika diameter diperbesar menjadi 21 m, berapa meter tambahan pagar yang diperlukan?" },
    ],
  }),

  Q(6, "Soal UN — Luas Lingkaran dalam Konteks", {
    type: "mixed",
    content: "Sebuah taman berbentuk lingkaran dengan jari-jari 21 m akan ditanami rumput. Harga rumput Rp 15.000,00 per m².",
    parts: [
      { label: "a.", math: "\\text{Hitunglah luas taman. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Berapakah biaya penanaman rumput?" },
      { label: "c.", text: "Jika jari-jari dikurangi 7 m, berapa luas taman yang baru?" },
    ],
  }),

  Q(7, "Perbandingan Keliling dan Luas", {
    type: "essay",
    content: "Dua lingkaran dengan jari-jari r₁ = 4 cm dan r₂ = 8 cm.",
    parts: [
      { label: "a.", text: "Berapakah perbandingan jari-jari r₁ : r₂?" },
      { label: "b.", text: "Berapakah perbandingan kelilingnya K₁ : K₂?" },
      { label: "c.", text: "Berapakah perbandingan luasnya L₁ : L₂?" },
    ],
  }),

  Q(8, "Jika Jari-Jari Diperbesar", {
    type: "essay",
    content: "Lingkaran awal berjari-jari r. Jari-jari diperbesar menjadi 2r.",
    parts: [
      { label: "a.", text: "Berapa kali keliling lingkaran baru dibanding lingkaran awal?" },
      { label: "b.", text: "Berapa kali luas lingkaran baru dibanding lingkaran awal?" },
      { label: "c.", math: "\\text{Jika } r = 7 \\text{ cm, hitung selisih luas lingkaran awal dan baru.}" },
    ],
  }),

  Q(9, "Luas Cincin (Daerah Anular)", {
    type: "mixed",
    diagram: {
      size: 230,
      extraCircles: [
        { cx: 115, cy: 115, r: 80, color: "#60a5fa", fill: "rgba(56,189,248,0.08)" },
        { cx: 115, cy: 115, r: 45, color: "#f472b6", fill: "rgba(2,8,23,0.95)" },
      ],
      extraLines: [
        { x1: 115, y1: 115, x2: 195, y2: 115, color: "#60a5fa", label: "R=7" },
        { x1: 115, y1: 115, x2: 115, y2: 70, color: "#f472b6", label: "r=3" },
      ],
      showCenter: true, centerLabel: "O",
    },
    content: "Dua lingkaran sepusat. Jari-jari luar R = 7 cm, jari-jari dalam r = 3 cm.",
    parts: [
      { label: "a.", text: "Hitung luas lingkaran luar." },
      { label: "b.", text: "Hitung luas lingkaran dalam." },
      { label: "c.", text: "Hitung luas daerah yang diarsir (cincin/annulus)." },
    ],
  }),

  Q(10, "Soal TKA — Roda Berputar", {
    type: "mixed",
    content: "Sebuah roda sepeda berjari-jari 35 cm berputar dan menempuh jarak 88 meter.",
    parts: [
      { label: "a.", text: "Hitung keliling roda." },
      { label: "b.", text: "Berapa banyak roda berputar (rotasi) untuk menempuh jarak 88 m?" },
      { label: "c.", text: "Jika roda berputar 100 kali, berapa jarak yang ditempuh (dalam meter)?" },
    ],
  }),

  Q(11, "Soal UN — Taman Melingkar dengan Jalan", {
    type: "essay",
    content: "Sebuah taman berbentuk lingkaran berjari-jari 28 m. Di luar taman dibuat jalan melingkar lebar 7 m.",
    parts: [
      { label: "a.", text: "Tentukan jari-jari luar (taman + jalan)." },
      { label: "b.", text: "Hitung luas seluruhnya (taman + jalan)." },
      { label: "c.", text: "Hitung luas jalan saja." },
    ],
  }),

  Q(12, "Soal ANBK — Alun-Alun Melingkar", {
    type: "essay",
    content: "Alun-alun kota berbentuk lingkaran berdiameter 70 m. Di sekelilingnya dipasang lampu setiap 5 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling alun-alun. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Berapa banyak lampu yang diperlukan?" },
      { label: "c.", text: "Jika biaya setiap lampu Rp 200.000,00, berapakah total biaya?" },
    ],
  }),

  Q(13, "Soal TKA — Lintasan Lari Melingkar", {
    type: "essay",
    content: "Lintasan lari berbentuk lingkaran berjari-jari 50 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling lintasan. (} \\pi = 3{,}14)" },
      { label: "b.", text: "Seorang atlet berlari 5 putaran. Berapa meter jarak yang ditempuh?" },
      { label: "c.", text: "Jika kecepatan lari 10 m/s, berapa detik untuk menyelesaikan 5 putaran?" },
    ],
  }),
];

const KelilingLuasPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            KELILING DAN LUAS LINGKARAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 13 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-3">📐 Rumus Keliling dan Luas</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-emerald-400 text-xs font-bold mb-2">KELILING</p>
              <BlockMath math="K = \pi d = 2\pi r" />
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-yellow-400 text-xs font-bold mb-2">LUAS</p>
              <BlockMath math="L = \pi r^2 = \frac{1}{4}\pi d^2" />
            </div>
            <div className="bg-white/5 rounded-xl p-3 flex gap-4 justify-center text-xs font-body">
              <span className="text-white/60"><span className="text-cyan-400 font-bold">π ≈ 22/7</span> jika r atau d habis dibagi 7</span>
              <span className="text-white/60"><span className="text-pink-400 font-bold">π ≈ 3,14</span> jika bilangan lainnya</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CircleDiagram {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default KelilingLuasPage;
