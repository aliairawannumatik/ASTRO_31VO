import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const KelilingLuasPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lp = "practice.lingkaran.kelilingLuas";

  const questions: Q[] = [
    Qf(1, t(`${lp}.q1.title`), {
      type: "essay",
      content: t(`${lp}.q1.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q1.a`) },
        { label: "b.", text: t(`${lp}.q1.b`) },
        { label: "c.", text: t(`${lp}.q1.c`) },
      ],
    }),

    Qf(2, t(`${lp}.q2.title`), {
      type: "essay",
      content: t(`${lp}.q2.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q2.a`) },
        { label: "b.", text: t(`${lp}.q2.b`) },
        { label: "c.", text: t(`${lp}.q2.c`) },
      ],
    }),

    Qf(3, t(`${lp}.q3.title`), {
      type: "essay",
      content: t(`${lp}.q3.content`),
      parts: [
        { label: "a.", math: "K = 44 \\text{ cm}" },
        { label: "b.", math: "K = 62{,}8 \\text{ cm}" },
        { label: "c.", math: "K = 88 \\text{ cm}" },
      ],
    }),

    Qf(4, t(`${lp}.q4.title`), {
      type: "essay",
      content: t(`${lp}.q4.content`),
      parts: [
        { label: "a.", math: "L = 154 \\text{ cm}^2" },
        { label: "b.", math: "L = 314 \\text{ cm}^2" },
        { label: "c.", math: "L = 616 \\text{ cm}^2" },
      ],
    }),

    Qf(5, t(`${lp}.q5.title`), {
      type: "mixed",
      content: t(`${lp}.q5.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q5.a`) },
        { label: "b.", text: t(`${lp}.q5.b`) },
        { label: "c.", text: t(`${lp}.q5.c`) },
      ],
    }),

    Qf(6, t(`${lp}.q6.title`), {
      type: "mixed",
      content: t(`${lp}.q6.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q6.a`) },
        { label: "b.", text: t(`${lp}.q6.b`) },
        { label: "c.", text: t(`${lp}.q6.c`) },
      ],
    }),

    Qf(7, t(`${lp}.q7.title`), {
      type: "essay",
      content: t(`${lp}.q7.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q7.a`) },
        { label: "b.", text: t(`${lp}.q7.b`) },
        { label: "c.", text: t(`${lp}.q7.c`) },
      ],
    }),

    Qf(8, t(`${lp}.q8.title`), {
      type: "essay",
      content: t(`${lp}.q8.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q8.a`) },
        { label: "b.", text: t(`${lp}.q8.b`) },
        { label: "c.", text: t(`${lp}.q8.c`) },
      ],
    }),

    Qf(9, t(`${lp}.q9.title`), {
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
      content: t(`${lp}.q9.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q9.a`) },
        { label: "b.", text: t(`${lp}.q9.b`) },
        { label: "c.", text: t(`${lp}.q9.c`) },
      ],
    }),

    Qf(10, t(`${lp}.q10.title`), {
      type: "mixed",
      content: t(`${lp}.q10.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q10.a`) },
        { label: "b.", text: t(`${lp}.q10.b`) },
        { label: "c.", text: t(`${lp}.q10.c`) },
      ],
    }),

    Qf(11, t(`${lp}.q11.title`), {
      type: "essay",
      content: t(`${lp}.q11.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q11.a`) },
        { label: "b.", text: t(`${lp}.q11.b`) },
        { label: "c.", text: t(`${lp}.q11.c`) },
      ],
    }),

    Qf(12, t(`${lp}.q12.title`), {
      type: "essay",
      content: t(`${lp}.q12.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q12.a`) },
        { label: "b.", text: t(`${lp}.q12.b`) },
        { label: "c.", text: t(`${lp}.q12.c`) },
      ],
    }),

    Qf(13, t(`${lp}.q13.title`), {
      type: "essay",
      content: t(`${lp}.q13.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q13.a`) },
        { label: "b.", text: t(`${lp}.q13.b`) },
        { label: "c.", text: t(`${lp}.q13.c`) },
      ],
    }),
  ];

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
            {t(`${lp}.h1`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">{t(`${lp}.subtitle`)} · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 13 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-3">{t(`${lp}.refBoxTitle`)}</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-emerald-400 text-xs font-bold mb-2">{t(`${lp}.refBoxCircLabel`)}</p>
              <BlockMath math="K = \pi d = 2\pi r" />
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-yellow-400 text-xs font-bold mb-2">{t(`${lp}.refBoxAreaLabel`)}</p>
              <BlockMath math="L = \pi r^2 = \frac{1}{4}\pi d^2" />
            </div>
            <div className="bg-white/5 rounded-xl p-3 flex gap-4 justify-center text-xs font-body">
              <span className="text-white/60"><span className="text-cyan-400 font-bold">π ≈ 22/7</span> {t(`${lp}.refBoxPi1`)}</span>
              <span className="text-white/60"><span className="text-pink-400 font-bold">π ≈ 3,14</span> {t(`${lp}.refBoxPi2`)}</span>
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
                        {q.parts.map((pt, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{pt.label}</span>
                            {pt.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={pt.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{pt.text}</p>
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
            {t('practice.backTo')} Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default KelilingLuasPage;
