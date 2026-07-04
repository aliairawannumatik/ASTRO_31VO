import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

  Q(2, "Grafik y = −3x + 6", {
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

  Q(3, "Garis Horizontal y = 3", {
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

  Q(4, "Garis Vertikal x = −4", {
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

  Q(5, "Garis Melalui Titik Asal", {
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

  Q(6, "Titik Potong Dua Sumbu", {
    type: "mixed",
    content: "Tentukan titik potong setiap garis dengan sumbu-x dan sumbu-y:",
    parts: [
      { label: "a.", math: "y = 4x + 8" },
      { label: "b.", math: "y = -\\tfrac{1}{2}x + 3" },
      { label: "c.", math: "2x + 3y = 12" },
      { label: "d.", math: "5x - 2y = 10" },
    ],
  }),

  Q(7, "Grafik Persamaan Umum ax + by = c", {
    type: "mixed",
    content: "Gambar grafik persamaan garis berikut menggunakan dua titik:",
    parts: [
      { label: "a.", math: "3x + 2y = 12" },
      { label: "b.", math: "x - 4y = 8" },
      { label: "c.", math: "5x + y = 10" },
    ],
  }),

  Q(8, "Grafik y = −x", {
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

  Q(9, "Titik pada Garis / Tidak pada Garis", {
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

  Q(10, "Dua Grafik Garis Berpotongan", {
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

  Q(11, "Mana yang Garis Lurus?", {
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

  Q(12, "Grafik 4x − y = 8", {
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

  Q(13, "ANBK — Memilih Grafik yang Tepat", {
    type: "mixed",
    content: "Persamaan garis: y = 2x − 6. Manakah pernyataan yang BENAR?",
    parts: [
      { label: "(1)", text: "Garis memotong sumbu-x di titik (3, 0)." },
      { label: "(2)", text: "Garis memotong sumbu-y di titik (0, −6)." },
      { label: "(3)", text: "Titik (4, 2) terletak pada garis ini." },
      { label: "(4)", text: "Garis bergerak turun dari kiri ke kanan." },
    ],
  }),

  Q(14, "Mencocokkan Garis dengan Persamaan", {
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

  Q(15, "TKA — Koordinat Berdasarkan Persamaan", {
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
];

const GrafikPGLPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-pink-400 text-xs font-body">{questions.length} {t('practice.suffixSoal')} Latihan</span>
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
                    <CoordPlane {...q.diagram} lightBg />
                  </div>
                </div>
              )}

              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((p, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className="text-pink-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{p.label}</span>
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
            {t('practice.backTo')} Persamaan Garis Lurus
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrafikPGLPage;
