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

  Q(4, "Dua Garis Sejajar — Tidak Ada Titik Potong", {
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

  Q(5, "Dua Garis Tegak Lurus — Berpotongan Membentuk Sudut Siku-Siku", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -4, y1: -4, x2: 4, y2: 4, color: "#f472b6", label: "ℓ₁" },
        { x1: -4, y1: 4, x2: 4, y2: -4, color: "#60a5fa", label: "ℓ₂" },
      ],
      pts: [{ x: 0, y: 0, label: "Q", color: "#facc15", labelPos: "bl" }],
      rightAngleMarks: [{ points: [[-1, 1], [0, 0], [1, 1]] }],
    },
    parts: [
      { label: "a.", text: "Hitung gradien masing-masing garis." },
      { label: "b.", text: "Buktikan bahwa hasil kali kedua gradien sama dengan −1." },
      { label: "c.", text: "Tentukan koordinat titik potong Q kedua garis dari grafik." },
    ],
  }),

  Q(6, "ANBK — Garis Sejajar Benar atau Salah", {
    type: "mixed",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", math: "y = 4x + 1 \\text{ dan } y = 4x - 3 \\text{ adalah garis sejajar.}" },
      { label: "(2)", math: "y = 2x + 5 \\text{ dan } y = -2x + 5 \\text{ adalah garis sejajar.}" },
      { label: "(3)", math: "y = \\tfrac{1}{3}x \\text{ dan } y = 3x \\text{ adalah garis tegak lurus.}" },
      { label: "(4)", text: "Dua garis sejajar tidak pernah berpotongan." },
    ],
  }),

  Q(7, "Nilai k untuk Garis Sejajar", {
    type: "mixed",
    content: "Tentukan nilai k agar setiap pasang garis berikut sejajar:",
    parts: [
      { label: "a.", math: "y = kx + 3 \\text{ dan } y = 5x - 1" },
      { label: "b.", math: "kx - 2y = 8 \\text{ dan } 3x - 6y = 12" },
      { label: "c.", math: "y = (2k-1)x + 4 \\text{ dan } y = 7x - 2" },
    ],
  }),

  Q(8, "Nilai k untuk Garis Tegak Lurus", {
    type: "mixed",
    content: "Tentukan nilai k agar setiap pasang garis berikut tegak lurus:",
    parts: [
      { label: "a.", math: "y = kx + 1 \\text{ dan } y = 3x - 2" },
      { label: "b.", math: "y = 4x + 5 \\text{ dan } y = kx + 7" },
      { label: "c.", math: "kx + 2y = 6 \\text{ dan } x - 3y = 9" },
    ],
  }),
];

const Hubungan2GarisPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-orange-400 text-xs font-body">{questions.length} {t('practice.suffixSoal')} Latihan</span>
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
            {t('practice.backTo')} Persamaan Garis Lurus
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hubungan2GarisPage;
