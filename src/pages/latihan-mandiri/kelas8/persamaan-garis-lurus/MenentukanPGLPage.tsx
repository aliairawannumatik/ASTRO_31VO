import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Q(1, "Persamaan dari Gradien dan Satu Titik", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui titik P dan memiliki gradien m:",
    parts: [
      { label: "a.", math: "P(2,\\ 5),\\ m = 3" },
      { label: "b.", math: "P(-1,\\ 4),\\ m = -2" },
      { label: "c.", math: "P(0,\\ -3),\\ m = \\tfrac{1}{2}" },
      { label: "d.", math: "P(4,\\ -1),\\ m = -\\tfrac{3}{4}" },
    ],
  }),

  Q(2, "Persamaan dari Dua Titik", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui pasangan titik berikut:",
    parts: [
      { label: "a.", math: "A(1,\\ 4) \\text{ dan } B(3,\\ 8)" },
      { label: "b.", math: "C(-2,\\ 3) \\text{ dan } D(4,\\ 0)" },
      { label: "c.", math: "E(0,\\ -5) \\text{ dan } F(5,\\ 5)" },
      { label: "d.", math: "G(-3,\\ -2) \\text{ dan } H(2,\\ 8)" },
    ],
  }),

  Q(3, "Persamaan Garis dari Titik Potong Sumbu", {
    type: "mixed",
    content: "Perhatikan grafik garis berikut. Garis tersebut melalui titik potong sumbu-x dan titik potong sumbu-y.",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 4, y: 0, label: "(4,0)", color: "#fbbf24", labelPos: "bot" },
        { x: 0, y: 3, label: "(0,3)", color: "#fbbf24", labelPos: "tr" },
      ],
      segs: [{ x1: -2, y1: 4.5, x2: 6, y2: -1.5, color: "#fbbf24" }],
    },
    parts: [
      { label: "a.", text: "Tentukan koordinat titik potong garis dengan sumbu-x dan sumbu-y berdasarkan grafik." },
      { label: "b.", text: "Hitung gradien garis tersebut menggunakan kedua titik potong sumbu." },
      { label: "c.", text: "Tuliskan persamaan garis tersebut." },
    ],
  }),

  Q(4, "Persamaan Garis Melalui Titik Pangkal", {
    type: "mixed",
    content: "Perhatikan grafik garis berikut. Garis tersebut melalui titik pangkal O(0, 0) dan satu titik lainnya.",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 0, label: "O(0,0)", color: "#38bdf8", labelPos: "bl" },
        { x: 3, y: 4, label: "(3,4)", color: "#38bdf8", labelPos: "tr" },
      ],
      segs: [{ x1: -4.5, y1: -6, x2: 4.5, y2: 6, color: "#38bdf8" }],
    },
    parts: [
      { label: "a.", text: "Tentukan koordinat titik yang dilalui garis selain titik pangkal O." },
      { label: "b.", text: "Hitung gradien garis tersebut." },
      { label: "c.", text: "Tuliskan persamaan garis tersebut." },
    ],
  }),
];

const MenentukanPGLPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-green-400 text-xs font-body">{questions.length} {t('practice.suffixSoal')} Latihan</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            MENENTUKAN PERSAMAAN GARIS LURUS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Persamaan Garis Lurus · UN / TKA / ANBK</p>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-900/20 via-slate-900/40 to-teal-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className="text-green-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
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
                      <span className="text-green-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{p.label}</span>
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

export default MenentukanPGLPage;
