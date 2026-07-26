import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { FunctionSquare } from "lucide-react";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const NotasiFungsiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.relasiDanFungsi.notasiFungsi';

  // textKey variables for all 12 \text{} cases (16 vars total)
  const q1bPre  = t(`${p}.q1.q1bPre`);
  const q1bMid  = t(`${p}.q1.q1bMid`);
  const q5aPre  = t(`${p}.q5.q5aPre`);
  const q5bPre  = t(`${p}.q5.q5bPre`);
  const q6Pre   = t(`${p}.q6.q6Pre`);
  const q6Mid   = t(`${p}.q6.q6Mid`);
  const q8cPre  = t(`${p}.q8.q8cPre`);
  const q9cPre  = t(`${p}.q9.q9cPre`);
  const q9cMid  = t(`${p}.q9.q9cMid`);
  const q12aPre = t(`${p}.q12.q12aPre`);
  const q12bPre = t(`${p}.q12.q12bPre`);
  const q12bMid = t(`${p}.q12.q12bMid`);
  const q13aPre = t(`${p}.q13.q13aPre`);
  const q14aPre = t(`${p}.q14.q14aPre`);
  const q14cPre = t(`${p}.q14.q14cPre`);
  const q14cMid = t(`${p}.q14.q14cMid`);

  const questions: Q[] = [
    Qn(1, t(`${p}.q1.title`), {
      type: "mixed",
      content: t(`${p}.q1.content`),
      parts: [
        { label: "a.", text: t(`${p}.q1.partAText`) },
        { label: "b.", math: `\\text{${q1bPre}} f \\text{${q1bMid}} x = -4.` },
      ],
    }),
    Qn(2, t(`${p}.q2.title`), {
      type: "mixed",
      content: t(`${p}.q2.content`),
      parts: [
        { label: "a.", text: t(`${p}.q2.partAText`) },
      ],
    }),
    Qn(3, t(`${p}.q3.title`), {
      type: "mixed",
      content: t(`${p}.q3.content`),
      parts: [
        { label: "a.", math: "f(3) + g(3) = \\ldots" },
        { label: "b.", math: "f(2) \\times g(1) = \\ldots" },
        { label: "c.", math: "f(a) - g(a-2) = \\ldots" },
      ],
    }),
    Qn(4, t(`${p}.q4.title`), {
      type: "mixed",
      mathContent: "g(x) = x^2 - 2x + 3",
      parts: [
        { label: "a.", math: "g(0) = \\ldots" },
        { label: "b.", math: "g(-2) = \\ldots" },
        { label: "c.", math: "g(1) = \\ldots" },
        { label: "d.", math: "g(a + 2) = \\ldots" },
      ],
    }),
    Qn(5, t(`${p}.q5.title`), {
      type: "mixed",
      content: t(`${p}.q5.content`),
      parts: [
        { label: "a.", math: `\\text{${q5aPre}} k` },
        { label: "b.", math: `\\text{${q5bPre}} f(6)` },
      ],
    }),
    Qn(6, t(`${p}.q6.title`), {
      type: "mixed",
      content: t(`${p}.q6.content`),
      parts: [
        { label: "a.", math: `\\text{${q6Pre}} n \\text{${q6Mid}} f(n) = 7.` },
        { label: "b.", math: `\\text{${q6Pre}} m \\text{${q6Mid}} f(m) = -7.` },
      ],
    }),
    Qn(7, t(`${p}.q7.title`), {
      type: "mixed",
      content: t(`${p}.q7.content`),
      parts: [
        { label: "a.", text: t(`${p}.q7.partAText`) },
      ],
    }),
    Qn(8, t(`${p}.q8.title`), {
      type: "mixed",
      content: t(`${p}.q8.content`),
      parts: [
        { label: "a.", text: t(`${p}.q8.partAText`) },
        { label: "b.", text: t(`${p}.q8.partBText`) },
        { label: "c.", math: `\\text{${q8cPre}} f(x) = \\ldots` },
      ],
    }),
    Qn(9, t(`${p}.q9.title`), {
      type: "mixed",
      content: t(`${p}.q9.content`),
      parts: [
        { label: "a.", text: t(`${p}.q9.partAText`) },
        { label: "b.", text: t(`${p}.q9.partBText`) },
        { label: "c.", math: `\\text{${q9cPre}} f \\text{${q9cMid}} x = 5.` },
      ],
    }),
    Qn(10, t(`${p}.q10.title`), {
      type: "mixed",
      content: t(`${p}.q10.content`),
      mathContent: "F(C) = \\frac{9}{5}C + 32",
      parts: [
        { label: "a.", math: "F(0) = \\ldots ^\\circ F" },
        { label: "b.", math: "F(100) = \\ldots ^\\circ F" },
      ],
    }),
    Qn(11, t(`${p}.q11.title`), {
      type: "mixed",
      content: t(`${p}.q11.content`),
      parts: [
        { label: "a.", text: t(`${p}.q11.partAText`) },
        { label: "b.", text: t(`${p}.q11.partBText`) },
        { label: "c.", text: t(`${p}.q11.partCText`) },
      ],
    }),
    Qn(12, t(`${p}.q12.title`), {
      type: "mixed",
      content: t(`${p}.q12.content`),
      parts: [
        { label: "a.", math: `\\text{${q12aPre}} T(x).` },
        { label: "b.", math: `\\text{${q12bPre}} T(65) \\text{${q12bMid}}.` },
        { label: "c.", text: t(`${p}.q12.partCText`) },
      ],
    }),
    Qn(13, t(`${p}.q13.title`), {
      type: "mixed",
      content: t(`${p}.q13.content`),
      parts: [
        { label: "a.", math: `\\text{${q13aPre}} f(x).` },
        { label: "b.", math: "f(2) = \\ldots" },
      ],
    }),
    Qn(14, t(`${p}.q14.title`), {
      type: "mixed",
      content: t(`${p}.q14.content`),
      parts: [
        { label: "a.", math: `\\text{${q14aPre}} f(x).` },
        { label: "b.", math: "f(1) + f(-2) = \\ldots" },
        { label: "c.", math: `\\text{${q14cPre}} p \\text{${q14cMid}} f(p) = 34.` },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <FunctionSquare className="w-7 h-7 text-sky-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            {t(`${p}.h1`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">{t(`${p}.grade`)} · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 14 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-2">{t(`${p}.tipTitle`)}</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sky-400 font-bold">{t(`${p}.tipLabelNotation`)} </span>
              <span className="text-white/60">f: A → B &nbsp;|&nbsp; f(x) = y &nbsp;|&nbsp; f: x ↦ ax + b</span>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sky-400 font-bold">{t(`${p}.tipLabelValue`)} </span>
              <span className="text-white/60">{t(`${p}.tipDescValue`)}</span>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sky-400 font-bold">{t(`${p}.tipLabelFormula`)} </span>
              <span className="text-white/60">{t(`${p}.tipDescFormula`)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.mathContent && (
                      <div className="mb-3 bg-sky-500/10 border border-sky-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((part, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${part.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {part.label && <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{part.label}</span>}
                            {part.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={part.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{part.text}</p>
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
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} {t(`${p}.backToTopic`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotasiFungsiPage;
