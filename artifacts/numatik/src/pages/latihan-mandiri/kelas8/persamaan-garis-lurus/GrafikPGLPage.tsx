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
type TableCol = { x: number | string; y: number | string };
type TableSpec = { equation: string; cols: TableCol[] };
type Choice = { label: string; math: string };
type DiagramChoice = { label: string; diagram: Diagram };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  table?: TableSpec; choices?: Choice[];
  diagramChoices?: DiagramChoice[];
  type: "essay" | "mixed" | "diagram-only";
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const GrafikPGLPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.persamaanGarisLurus.grafikPgl';

  const questions: Q[] = [
    Qf(1, t(`${p}.q1.title`), {
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
        { label: "a.", math: `\\text{${t(`${p}.q1.pAPre`)}} y = x + 2 \\text{ ${t(`${p}.q1.pAPost`)}}` },
        { label: "b.", text: t(`${p}.q1.pB`) },
        { label: "c.", text: t(`${p}.q1.pC`) },
      ],
    }),

    Qf(2, t(`${p}.q2.title`), {
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
        { label: "a.", text: t(`${p}.q2.pA`) },
        { label: "b.", text: t(`${p}.q2.pB`) },
        { label: "c.", text: t(`${p}.q2.pC`) },
      ],
    }),

    Qf(3, t(`${p}.q3.title`), {
      type: "mixed",
      content: t(`${p}.q3.content`),
      table: {
        equation: "y = 2x - 1",
        cols: [
          { x: -2, y: "…" },
          { x: -1, y: "…" },
          { x: 0,  y: "…" },
          { x: 1,  y: "…" },
          { x: 2,  y: "…" },
        ],
      },
      diagram: { size: 220, range: 6 },
      parts: [
        { label: "a.", text: t(`${p}.tablePartA`) },
        { label: "b.", text: t(`${p}.tablePartB`) },
        { label: "c.", text: t(`${p}.tablePartC`) },
      ],
    }),

    Qf(4, t(`${p}.q4.title`), {
      type: "mixed",
      content: t(`${p}.q4.content`),
      table: {
        equation: "y = -x + 3",
        cols: [
          { x: -1, y: "…" },
          { x: 0,  y: "…" },
          { x: 1,  y: "…" },
          { x: 2,  y: "…" },
          { x: 3,  y: "…" },
        ],
      },
      diagram: { size: 220, range: 6 },
      parts: [
        { label: "a.", text: t(`${p}.tablePartA`) },
        { label: "b.", text: t(`${p}.tablePartB`) },
        { label: "c.", text: t(`${p}.tablePartC`) },
      ],
    }),

    Qf(5, t(`${p}.q5.title`), {
      type: "mixed",
      content: t(`${p}.q5.content`),
      table: {
        equation: "2x + y = 4",
        cols: [
          { x: 0,   y: "…" },
          { x: "…", y: 0   },
        ],
      },
      diagram: { size: 220, range: 6 },
      parts: [
        { label: "a.", text: t(`${p}.axisPartA`) },
        { label: "b.", text: t(`${p}.axisPartB`) },
        { label: "c.", text: t(`${p}.axisPartC`) },
      ],
    }),

    Qf(6, t(`${p}.q6.title`), {
      type: "mixed",
      content: t(`${p}.q6.content`),
      table: {
        equation: "3x - 2y = 12",
        cols: [
          { x: 0,   y: "…" },
          { x: "…", y: 0   },
        ],
      },
      diagram: { size: 220, range: 6 },
      parts: [
        { label: "a.", text: t(`${p}.axisPartA`) },
        { label: "b.", text: t(`${p}.axisPartB`) },
        { label: "c.", text: t(`${p}.axisPartC`) },
      ],
    }),

    Qf(7, t(`${p}.q7.title`), {
      type: "mixed",
      content: t(`${p}.q7.content`),
      diagram: {
        size: 260, range: 6,
        segs: [{ x1: -5, y1: -3, x2: 3, y2: 5, color: "#818cf8" }],
        pts: [
          { x: 0, y: 2, label: "(0,2)", color: "#818cf8", labelPos: "tr" },
          { x: 2, y: 4, label: "(2,4)", color: "#818cf8", labelPos: "top" },
        ],
      },
      choices: [
        { label: "A.", math: "y = x + 2" },
        { label: "B.", math: "y = 2x + 1" },
        { label: "C.", math: "y = -x + 2" },
        { label: "D.", math: "y = x - 2" },
      ],
      parts: [
        { label: t(`${p}.hint`), text: t(`${p}.q7.pHint`) },
      ],
    }),

    Qf(8, t(`${p}.q8.title`), {
      type: "mixed",
      content: t(`${p}.q8.content`),
      diagramChoices: [
        {
          label: "A.",
          diagram: {
            size: 150, range: 5,
            segs: [{ x1: -1, y1: -6, x2: 4, y2: 4, color: "#4ade80" }],
            pts: [
              { x: 0, y: -4, label: "(0,-4)", color: "#4ade80", labelPos: "bot" },
              { x: 2, y: 0, label: "(2,0)", color: "#4ade80", labelPos: "top" },
            ],
          },
        },
        {
          label: "B.",
          diagram: {
            size: 150, range: 5,
            segs: [{ x1: -4, y1: 4, x2: 4, y2: -4, color: "#f87171" }],
            pts: [
              { x: 0, y: 0, label: "(0,0)", color: "#f87171", labelPos: "top" },
            ],
          },
        },
        {
          label: "C.",
          diagram: {
            size: 150, range: 5,
            segs: [{ x1: -3, y1: -1, x2: 3, y2: 3, color: "#f87171" }],
            pts: [
              { x: 0, y: 1, label: "(0,1)", color: "#f87171", labelPos: "top" },
              { x: -2, y: -3, label: "(-2,-3)", color: "#f87171", labelPos: "bl" },
            ],
          },
        },
        {
          label: "D.",
          diagram: {
            size: 150, range: 5,
            segs: [{ x1: -2, y1: 4, x2: 4, y2: -4, color: "#f87171" }],
            pts: [
              { x: 0, y: 4, label: "(0,4)", color: "#f87171", labelPos: "top" },
              { x: 2, y: 0, label: "(2,0)", color: "#f87171", labelPos: "bot" },
            ],
          },
        },
      ],
      parts: [
        { label: t(`${p}.hint`), text: t(`${p}.q8.pHint`) },
      ],
    }),

    Qf(9, t(`${p}.q9.title`), {
      type: "mixed",
      content: t(`${p}.q9.content`),
      diagramChoices: [
        {
          label: "A.",
          diagram: {
            size: 150, range: 5,
            segs: [{ x1: -1, y1: 6, x2: 3, y2: -2, color: "#4ade80" }],
            pts: [
              { x: 0, y: 4, label: "(0,4)", color: "#4ade80", labelPos: "top" },
              { x: 2, y: 0, label: "(2,0)", color: "#4ade80", labelPos: "bot" },
            ],
          },
        },
        {
          label: "B.",
          diagram: {
            size: 150, range: 5,
            segs: [{ x1: -2, y1: 0, x2: 2, y2: 8, color: "#f87171" }],
            pts: [
              { x: 0, y: 4, label: "(0,4)", color: "#f87171", labelPos: "top" },
              { x: 1, y: 6, label: "(1,6)", color: "#f87171", labelPos: "tr" },
            ],
          },
        },
        {
          label: "C.",
          diagram: {
            size: 150, range: 5,
            segs: [{ x1: -3, y1: 2, x2: 3, y2: -10, color: "#f87171" }],
            pts: [
              { x: 0, y: -4, label: "(0,-4)", color: "#f87171", labelPos: "bot" },
              { x: -2, y: 0, label: "(-2,0)", color: "#f87171", labelPos: "top" },
            ],
          },
        },
        {
          label: "D.",
          diagram: {
            size: 150, range: 5,
            segs: [{ x1: -1, y1: -5, x2: 5, y2: 1, color: "#f87171" }],
            pts: [
              { x: 0, y: -4, label: "(0,-4)", color: "#f87171", labelPos: "bot" },
              { x: 4, y: 0, label: "(4,0)", color: "#f87171", labelPos: "top" },
            ],
          },
        },
      ],
      parts: [
        { label: t(`${p}.hint`), text: t(`${p}.q9.pHint`) },
      ],
    }),

    Qf(10, t(`${p}.q10.title`), {
      type: "mixed",
      content: t(`${p}.q10.content`),
      parts: [
        { label: "a.", math: "y = 2x + 3" },
        { label: "b.", math: "y = -3x + 5" },
        { label: "c.", math: "3x + 2y = 12" },
        { label: "d.", math: "x - 4y = 8" },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-pink-400 text-xs font-body">{questions.length} {t('practice.suffixSoal')} {t(`${p}.badgeSuffix`)}</span>
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
              className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-900/20 via-slate-900/40 to-purple-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  {q.title && (
                    <p className="text-pink-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
                  )}
                  {q.content && (
                    <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                  )}
                  {q.math && (
                    <div className="text-white/90 text-sm mt-1"><InlineMath math={q.math} /></div>
                  )}
                </div>
              </div>

              {q.table && (
                <div className="flex justify-center my-4 overflow-x-auto">
                  <table className="border-collapse text-xs md:text-sm bg-white rounded-lg overflow-hidden shadow-md">
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 bg-pink-50 text-slate-700 font-bold px-3 py-1.5 text-center">x</td>
                        {q.table.cols.map((c, ci) => (
                          <td key={ci} className="border border-slate-300 text-slate-800 px-3 py-1.5 text-center min-w-[36px]">{c.x}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-slate-300 bg-pink-50 text-slate-700 font-bold px-3 py-1.5 text-center">y</td>
                        {q.table.cols.map((c, ci) => (
                          <td key={ci} className="border border-slate-300 text-slate-800 px-3 py-1.5 text-center min-w-[36px]">{c.y}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {q.diagram && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-lg">
                    <CoordPlane {...q.diagram} lightBg />
                  </div>
                </div>
              )}

              {q.choices && (
                <div className="flex flex-col gap-1.5 mt-2 mb-1 pl-2">
                  {q.choices.map((c, ci) => (
                    <div key={ci} className="flex items-center gap-2">
                      <span className="text-pink-400 text-xs font-body font-bold shrink-0 min-w-[20px]">{c.label}</span>
                      <div className="text-white/85 text-sm"><InlineMath math={c.math} /></div>
                    </div>
                  ))}
                </div>
              )}

              {q.diagramChoices && (
                <div className="grid grid-cols-2 gap-3 mt-3 mb-1">
                  {q.diagramChoices.map((dc, dci) => (
                    <div key={dci} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-2">
                      <span className="text-pink-400 text-xs font-body font-bold self-start pl-1">{dc.label}</span>
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <CoordPlane {...dc.diagram} lightBg />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((pt, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className="text-pink-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{pt.label}</span>
                      <div className="text-white/75 text-sm font-body leading-relaxed">
                        {pt.math ? <InlineMath math={pt.math} /> : <span>{pt.text}</span>}
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

export default GrafikPGLPage;
