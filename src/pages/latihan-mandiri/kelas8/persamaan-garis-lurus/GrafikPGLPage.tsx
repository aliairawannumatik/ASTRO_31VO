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

  Q(5, "Titik Potong Dua Sumbu", {
    type: "mixed",
    content: "Tentukan titik potong setiap garis dengan sumbu-x dan sumbu-y:",
    parts: [
      { label: "a.", math: "y = 4x + 8" },
      { label: "b.", math: "y = -\\tfrac{1}{2}x + 3" },
      { label: "c.", math: "2x + 3y = 12" },
      { label: "d.", math: "5x - 2y = 10" },
    ],
  }),

  Q(6, "Grafik Persamaan Umum ax + by = c", {
    type: "mixed",
    content: "Gambar grafik persamaan garis berikut menggunakan dua titik:",
    parts: [
      { label: "a.", math: "3x + 2y = 12" },
      { label: "b.", math: "x - 4y = 8" },
      { label: "c.", math: "5x + y = 10" },
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
