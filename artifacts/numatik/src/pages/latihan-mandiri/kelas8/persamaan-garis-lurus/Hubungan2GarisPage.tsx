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

const Hubungan2GarisPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.persamaanGarisLurus.hubungan2Garis';

  // \text{} interpolation variables
  const danText = t(`${p}.dan`);
  const sejajarSentenceText = t(`${p}.sejajarSentence`);
  const tegakLurusSentenceText = t(`${p}.tegakLurusSentence`);

  const questions: Q[] = [
    Q(1, t(`${p}.q1.title`), {
      type: "mixed",
      content: t(`${p}.q1.content`),
      parts: [
        { label: "a.", math: `y = 3x + 2 \\text{ ${danText} } y = 3x - 5` },
        { label: "b.", math: `y = 2x + 1 \\text{ ${danText} } y = -\\tfrac{1}{2}x + 3` },
        { label: "c.", math: `y = 4x - 7 \\text{ ${danText} } y = -4x + 7` },
        { label: "d.", math: `y = \\tfrac{2}{3}x + 1 \\text{ ${danText} } y = \\tfrac{2}{3}x - 4` },
      ],
    }),

    Q(2, t(`${p}.q2.title`), {
      type: "mixed",
      content: t(`${p}.q2.content`),
      parts: [
        { label: "a.", math: `y = 5x + 3 \\text{ ${danText} } y = -\\tfrac{1}{5}x - 2` },
        { label: "b.", math: `y = -3x + 4 \\text{ ${danText} } y = \\tfrac{1}{3}x + 1` },
        { label: "c.", math: `2x + 3y = 6 \\text{ ${danText} } 3x - 2y = 8` },
        { label: "d.", math: `x - 4y = 0 \\text{ ${danText} } 4x + y = 5` },
      ],
    }),

    Q(3, t(`${p}.q3.title`), {
      type: "mixed",
      content: t(`${p}.q3.content`),
      parts: [
        { label: "a.", math: `y = 2x + 1 \\text{ ${danText} } y = -x + 7` },
        { label: "b.", math: `y = 3x - 4 \\text{ ${danText} } y = x + 2` },
        { label: "c.", math: `y = -2x + 9 \\text{ ${danText} } y = x - 3` },
      ],
    }),

    Q(4, t(`${p}.q4.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 6,
        segs: [
          { x1: -5, y1: -3, x2: 3, y2: 5, color: "#f472b6", label: "ℓ₁" },
          { x1: -5, y1: -6, x2: 3, y2: 2, color: "#60a5fa", label: "ℓ₂" },
        ],
      },
      parts: [
        { label: "a.", text: t(`${p}.q4.pA`) },
        { label: "b.", text: t(`${p}.q4.pB`) },
        { label: "c.", text: t(`${p}.q4.pC`) },
      ],
    }),

    Q(5, t(`${p}.q5.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 6,
        segs: [
          { x1: -4, y1: -4, x2: 4, y2: 4, color: "#f472b6", label: "ℓ₁" },
          { x1: -4, y1: 4, x2: 4, y2: -4, color: "#60a5fa", label: "ℓ₂" },
        ],
        pts: [{ x: 0, y: 0, label: "Q", color: "#facc15", labelPos: "bl" }],
        rightAngleMarks: [{ points: [[0.28, 0.28], [0.57, 0], [0.28, -0.28]], color: "#f87171" }],
      },
      parts: [
        { label: "a.", text: t(`${p}.q5.pA`) },
        { label: "b.", text: t(`${p}.q5.pB`) },
        { label: "c.", text: t(`${p}.q5.pC`) },
      ],
    }),

    Q(6, t(`${p}.q6.title`), {
      type: "mixed",
      content: t(`${p}.q6.content`),
      parts: [
        { label: "(1)", math: `y = 4x + 1 \\text{ ${danText} } y = 4x - 3 \\text{ ${sejajarSentenceText}}` },
        { label: "(2)", math: `y = 2x + 5 \\text{ ${danText} } y = -2x + 5 \\text{ ${sejajarSentenceText}}` },
        { label: "(3)", math: `y = \\tfrac{1}{3}x \\text{ ${danText} } y = 3x \\text{ ${tegakLurusSentenceText}}` },
        { label: "(4)", text: t(`${p}.q6.p4`) },
      ],
    }),

    Q(7, t(`${p}.q7.title`), {
      type: "mixed",
      content: t(`${p}.q7.content`),
      parts: [
        { label: "a.", math: `y = kx + 3 \\text{ ${danText} } y = 5x - 1` },
        { label: "b.", math: `kx - 2y = 8 \\text{ ${danText} } 3x - 6y = 12` },
        { label: "c.", math: `y = (2k-1)x + 4 \\text{ ${danText} } y = 7x - 2` },
      ],
    }),

    Q(8, t(`${p}.q8.title`), {
      type: "mixed",
      content: t(`${p}.q8.content`),
      parts: [
        { label: "a.", math: `y = kx + 1 \\text{ ${danText} } y = 3x - 2` },
        { label: "b.", math: `y = 4x + 5 \\text{ ${danText} } y = kx + 7` },
        { label: "c.", math: `kx + 2y = 6 \\text{ ${danText} } x - 3y = 9` },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-orange-400 text-xs font-body">
              {questions.length} {t('practice.suffixSoal')} {t(`${p}.badgeSuffix`)}
            </span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            {t(`${p}.h1`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">{t(`${p}.grade`)}</p>
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
                    <CoordPlane {...q.diagram} lightBg />
                  </div>
                </div>
              )}

              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((part, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className="text-orange-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{part.label}</span>
                      <div className="text-white/75 text-sm font-body leading-relaxed">
                        {part.math ? <InlineMath math={part.math} /> : <span>{part.text}</span>}
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
            {t('practice.backTo')} {t(`${p}.backTo`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hubungan2GarisPage;
