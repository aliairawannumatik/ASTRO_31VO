import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { TrendingUp } from "lucide-react";
import CoordPlane from "../koordinat-cartesius/CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Membuat Tabel Nilai Fungsi Linear", {
    type: "mixed",
    mathContent: "f(x) = 2x + 1",
    parts: [
      { label: "a.", math: "\\text{Lengkapi tabel: } x \\in \\{-3,-2,-1,0,1,2,3\\} \\to f(x) = \\ldots" },
      { label: "b.", text: "Plot titik-titik hasil pada bidang koordinat." },
      { label: "c.", text: "Hubungkan titik-titik tersebut. Bentuk kurva apa yang terbentuk?" },
    ],
  }),
  Qn(2, "Grafik Fungsi Linear – Titik Potong", {
    type: "mixed",
    content: "Fungsi f(x) = 2x − 4.",
    diagram: <CoordPlane size={260} range={6}
      pts={[
        { x: 0, y: -4, label: "(0,−4)", color: "#f472b6", labelPos: "bl" },
        { x: 2, y: 0, label: "(2,0)", color: "#34d399", labelPos: "top" },
      ]}
      segs={[{ x1: -1, y1: -6, x2: 4, y2: 4, color: "#60a5fa" }]}
    />,
    parts: [
      { label: "a.", math: "\\text{Titik potong sumbu-y: } f(0) = \\ldots" },
      { label: "b.", math: "\\text{Titik potong sumbu-x: } f(x) = 0 \\Rightarrow x = \\ldots" },
      { label: "c.", text: "Tentukan kemiringan (gradien) grafik tersebut." },
    ],
  }),
  Qn(3, "Grafik Fungsi Konstan", {
    type: "mixed",
    content: "Fungsi f(x) = 5 (fungsi konstan).",
    diagram: <CoordPlane size={260} range={7}
      segs={[{ x1: -6, y1: 5, x2: 6, y2: 5, color: "#f472b6" }]}
      pts={[{ x: 0, y: 5, label: "f(x)=5", color: "#f472b6", labelPos: "tl" }]}
    />,
    parts: [
      { label: "a.", text: "Bagaimana bentuk grafik fungsi konstan?" },
      { label: "b.", text: "Sejajar dengan sumbu apa grafik fungsi konstan?" },
      { label: "c.", math: "\\text{Apakah grafik } f(x) = 5 \\text{ melewati titik } (3, 5)? \\text{ Cek!}" },
    ],
  }),
  Qn(4, "Tabel Nilai dan Grafik – f(x) = x + 3", {
    type: "mixed",
    mathContent: "f(x) = x + 3",
    parts: [
      { label: "a.", math: "\\text{Buat tabel untuk } x \\in \\{-4,-2,0,2,4\\}" },
      { label: "b.", text: "Plot dan gambarkan grafik fungsi tersebut." },
      { label: "c.", text: "Di mana grafik memotong sumbu-x dan sumbu-y?" },
    ],
  }),
  Qn(5, "Membaca Grafik – Menentukan Nilai Fungsi", {
    type: "mixed",
    diagram: <CoordPlane size={260} range={6}
      segs={[{ x1: -5, y1: -3, x2: 5, y2: 7, color: "#60a5fa" }]}
      pts={[
        { x: 0, y: 2, label: "(0,2)", color: "#f472b6", labelPos: "tl" },
        { x: 3, y: 5, label: "(3,?)", color: "#facc15", labelPos: "tr" },
        { x: -2, y: 0, label: "(?,0)", color: "#34d399", labelPos: "top" },
      ]}
    />,
    content: "Grafik di atas merupakan grafik fungsi linear.",
    parts: [
      { label: "a.", text: "Tentukan nilai f(0) dari grafik." },
      { label: "b.", text: "Tentukan nilai x jika f(x) = 0 (titik potong sumbu-x)." },
      { label: "c.", math: "\\text{Tentukan rumus fungsi: } f(x) = \\ldots" },
    ],
  }),
  Qn(6, "Fungsi dengan Gradien Negatif", {
    type: "mixed",
    mathContent: "f(x) = -x + 4",
    diagram: <CoordPlane size={260} range={6}
      segs={[{ x1: -2, y1: 6, x2: 5, y2: -1, color: "#f87171" }]}
      pts={[
        { x: 0, y: 4, label: "(0,4)", color: "#f87171", labelPos: "tl" },
        { x: 4, y: 0, label: "(4,0)", color: "#fb923c", labelPos: "top" },
      ]}
    />,
    parts: [
      { label: "a.", text: "Ke arah mana grafik berjalan (naik ke kanan atau turun ke kanan)?" },
      { label: "b.", text: "Apa yang terjadi pada nilai f(x) ketika x bertambah?" },
      { label: "c.", math: "f(-2) = \\ldots,\\ f(6) = \\ldots" },
    ],
  }),
  Qn(7, "Dua Grafik pada Satu Bidang", {
    type: "mixed",
    content: "Fungsi f(x) = x + 2 dan g(x) = 3x − 2.",
    diagram: <CoordPlane size={260} range={6}
      segs={[
        { x1: -4, y1: -2, x2: 4, y2: 6, color: "#60a5fa", label: "f" },
        { x1: -1, y1: -5, x2: 4, y2: 10, color: "#f472b6", label: "g" },
      ]}
      pts={[{ x: 2, y: 4, label: "(2,4)", color: "#facc15", labelPos: "tl" }]}
    />,
    parts: [
      { label: "a.", math: "\\text{Titik perpotongan: } f(x) = g(x) \\Rightarrow x = \\ldots,\\ y = \\ldots" },
      { label: "b.", text: "Grafik mana yang lebih curam (gradien lebih besar)?" },
      { label: "c.", text: "Untuk x > 2, grafik mana yang di atas?" },
    ],
  }),
  Qn(8, "Grafik Fungsi – Sifat Gradien", {
    type: "mixed",
    content: "Tentukan sifat grafik fungsi berikut tanpa menggambar:",
    parts: [
      { label: "a.", math: "f(x) = 4x + 2 \\quad (\\text{naik/turun?})" },
      { label: "b.", math: "g(x) = -3x + 5 \\quad (\\text{naik/turun?})" },
      { label: "c.", math: "h(x) = \\frac{1}{2}x - 3 \\quad (\\text{naik/turun?})" },
    ],
  }),
  Qn(9, "Membaca Grafik – Nilai Positif dan Negatif", {
    type: "mixed",
    diagram: <CoordPlane size={260} range={6}
      segs={[{ x1: -3, y1: 5, x2: 5, y2: -3, color: "#fb923c" }]}
      pts={[
        { x: 1, y: 1, label: "(1,1)", color: "#fb923c", labelPos: "tr" },
        { x: -1, y: 3, label: "(−1,3)", color: "#facc15", labelPos: "tl" },
      ]}
      shades={[{ type: 'rect', x1: -6, y1: 0, x2: 1, y2: 6, color: 'rgba(52,211,153,0.08)' }]}
    />,
    parts: [
      { label: "a.", text: "Pada interval x mana nilai f(x) bernilai positif?" },
      { label: "b.", text: "Pada interval x mana nilai f(x) bernilai negatif?" },
      { label: "c.", math: "\\text{Titik potong sumbu-x: } f(x) = 0 \\Rightarrow x = \\ldots" },
    ],
  }),
  Qn(10, "Tabel Nilai – f(x) = −2x + 5", {
    type: "mixed",
    mathContent: "f(x) = -2x + 5",
    parts: [
      { label: "a.", math: "\\text{Buat tabel untuk } x \\in \\{-1, 0, 1, 2, 3\\}" },
      { label: "b.", text: "Gambarlah grafik. Apakah naik atau turun?" },
      { label: "c.", math: "\\text{Titik potong sumbu-x: } x = \\ldots \\quad \\text{sumbu-y: } y = \\ldots" },
    ],
  }),
  Qn(11, "Grafik Fungsi – Soal UN", {
    type: "mixed",
    content: "Fungsi f(x) = kx + 2 memotong sumbu-x di titik (4, 0).",
    parts: [
      { label: "a.", math: "\\text{Substitusi } (4,0) \\to 0 = k(4) + 2 \\Rightarrow k = \\ldots" },
      { label: "b.", math: "\\text{Rumus lengkap: } f(x) = \\ldots" },
      { label: "c.", text: "Gambarlah grafik dengan menandai dua titik penting." },
    ],
  }),
  Qn(12, "Perpotongan Dua Grafik", {
    type: "mixed",
    content: "Dua fungsi: f(x) = x + 4 dan g(x) = 2x + 1.",
    parts: [
      { label: "a.", math: "\\text{Titik potong: } x + 4 = 2x + 1 \\Rightarrow x = \\ldots,\\ y = \\ldots" },
      { label: "b.", text: "Gambarkan kedua grafik pada satu bidang koordinat." },
      { label: "c.", text: "Untuk x < 3, grafik mana yang berada di atas?" },
    ],
  }),
  Qn(13, "Grafik Fungsi – Soal Terapan", {
    type: "mixed",
    content: "Harga tiket masuk kolam renang: f(x) = 10.000x + 5.000, dengan x = jumlah orang dewasa dan anak anak membayar Rp5.000.",
    parts: [
      { label: "a.", math: "f(0) = \\ldots,\\ f(5) = \\ldots,\\ f(10) = \\ldots" },
      { label: "b.", text: "Gambarlah grafik fungsi ini." },
      { label: "c.", text: "Apakah grafik ini selalu naik? Mengapa?" },
    ],
  }),
  Qn(14, "Grafik – Soal UN Gabungan", {
    type: "mixed",
    content: "Diketahui f(x) = 2x + b memotong sumbu-y di (0, −4) dan sumbu-x di (m, 0).",
    parts: [
      { label: "a.", math: "\\text{Dari titik (0,−4): } b = \\ldots" },
      { label: "b.", math: "\\text{Dari } f(m) = 0:\\ 2m + (-4) = 0 \\Rightarrow m = \\ldots" },
      { label: "c.", math: "f(5) = \\ldots" },
    ],
  }),
  Qn(15, "Sketsa Grafik – UN/ANBK Style", {
    type: "mixed",
    content: "Buatlah sketsa grafik untuk setiap fungsi, tandai titik potong sumbu:",
    parts: [
      { label: "a.", math: "f(x) = x - 3 \\quad \\text{(titik potong: } (0,-3) \\text{ dan } (3,0)\\text{)}" },
      { label: "b.", math: "g(x) = -2x + 4 \\quad \\text{(titik potong: } (0,4) \\text{ dan } (2,0)\\text{)}" },
      { label: "c.", text: "Tentukan titik perpotongan kedua grafik tersebut." },
    ],
  }),
  Qn(16, "Grafik – Dari Konteks ke Rumus", {
    type: "mixed",
    content: "Seorang penjual es krim mendapat keuntungan K(x) = 2.000x − 10.000 rupiah untuk x es krim terjual.",
    parts: [
      { label: "a.", math: "K(0) = \\ldots \\text{ (rugi/untung jika tidak ada penjualan)}" },
      { label: "b.", math: "K(x) = 0 \\Rightarrow x = \\ldots \\text{ (titik impas)}" },
      { label: "c.", math: "K(20) = \\ldots" },
    ],
  }),
];

const GrafikFungsiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <TrendingUp className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            GRAFIK FUNGSI (PENGAYAAN)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Relasi dan Fungsi · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 16 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">📌 Tips Grafik Fungsi Linear</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              "Gradien m > 0: grafik naik ke kanan | m < 0: grafik turun ke kanan",
              "Titik potong sumbu-y: set x = 0 → f(0) = b",
              "Titik potong sumbu-x: set f(x) = 0 → x = −b/m",
              "Uji garis vertikal: grafik fungsi dipotong max 1 kali oleh garis vertikal",
            ].map((s, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-3 py-2 flex gap-2">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span className="text-white/60">{s}</span>
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
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.mathContent && (
                      <div className="mb-3 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[36px]">{p.label}</span>}
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrafikFungsiPage;
