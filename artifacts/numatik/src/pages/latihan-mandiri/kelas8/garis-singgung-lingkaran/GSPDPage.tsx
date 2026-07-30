import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Shuffle } from "lucide-react";
import GSLDiagram from "./GSLDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  difficulty?: "Mudah" | "Sedang" | "Sulit";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const diffColor: Record<string, string> = {
  Mudah: "bg-pink-500/20 text-pink-300 border-pink-400/40",
  Sedang: "bg-rose-500/20 text-rose-300 border-rose-400/40",
  Sulit: "bg-red-500/20 text-red-300 border-red-400/40",
};

const GSPDPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.garisSinggungLingkaran.gspd';

  const diffLabels: Record<string, string> = {
    Mudah: t(`${p}.diffMudah`),
    Sedang: t(`${p}.diffSedang`),
    Sulit: t(`${p}.diffSulit`),
  };

  const questions: Q[] = [
    Qn(1, t(`${p}.q1.title`), {
      difficulty: "Mudah",
      diagram: <GSLDiagram variant="gspd-two-circles" size={230} />,
      content: t(`${p}.q1.content`),
      parts: [
        { label: "a.", text: t(`${p}.q1.pa`) },
        { label: "b.", text: t(`${p}.q1.pb`) },
        { label: "c.", text: t(`${p}.q1.pc`) },
      ],
    }),
    Qn(2, t(`${p}.q2.title`), {
      difficulty: "Mudah",
      mathContent: "d_{GSPD} = \\sqrt{p^2 - (R + r)^2}",
      parts: [
        { label: "a.", text: t(`${p}.q2.pa`) },
        { label: "b.", text: t(`${p}.q2.pb`) },
        { label: "c.", text: t(`${p}.q2.pc`) },
      ],
    }),
    Qn(3, t(`${p}.q3.title`), {
      difficulty: "Sulit",
      diagram: <GSLDiagram variant="gspd-two-circles" size={230} />,
      content: t(`${p}.q3.content`),
      parts: [
        { label: "a.", math: "R = 9, r = 6, p = 30 \\Rightarrow O_1X : XO_2 = 9 : 6 = 3 : 2" },
        { label: "b.", math: "O_1X = \\frac{3}{5} \\times 30 = 18 \\text{ cm}" },
        { label: "c.", math: "d_{GSPD} = \\sqrt{30^2 - (9+6)^2} = \\sqrt{900 - 225} = \\sqrt{675} = 15\\sqrt{3}" },
      ],
    }),
    Qn(4, t(`${p}.q4.title`), {
      difficulty: "Sulit",
      diagram: <GSLDiagram variant="gspd-two-circles" size={230} />,
      content: t(`${p}.q4.content`),
      parts: [
        { label: "a.", math: "d_{GSPD} = \\sqrt{30^2 - 14^2} = \\sqrt{900-196} = \\sqrt{704} = 4\\sqrt{44} = 8\\sqrt{11}" },
        { label: "b.", math: "d_{GSPL} = \\sqrt{30^2 - 2^2} = \\sqrt{900 - 4} = \\sqrt{896} = 4\\sqrt{56} = 8\\sqrt{14}" },
        { label: "c.", math: "\\sin \\beta = \\frac{R+r}{p} = \\frac{14}{30} = \\frac{7}{15} \\Rightarrow \\beta \\approx 27{,}8^\\circ" },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <Shuffle className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(244,63,94,0.7)' }}>
            {t(`${p}.h1`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">{t(`${p}.subtitle`)} · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 4 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">{t(`${p}.formulaBoxTitle`)}</p>
          <div className="bg-white/5 rounded-lg px-3 py-3 mb-2 flex justify-center">
            <BlockMath math="d_{GSPD} = \sqrt{p^2 - (R + r)^2}" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { l: "p", v: t(`${p}.legendP`) },
              { l: "R + r", v: t(`${p}.legendRr`) },
              { l: t(`${p}.legendSyaratL`), v: "p > R + r" },
              { l: "GSPD < GSPL", v: t(`${p}.legendRelation`) },
            ].map(x => (
              <div key={x.l} className="bg-white/5 rounded-lg px-2 py-2">
                <span className="text-rose-400 font-bold">{x.l}: </span>
                <span className="text-white/60">{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                          {diffLabels[q.difficulty]}
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((part, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{part.label}</span>
                            {part.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={part.math} /></div>
                              : <p className="font-body text-sm text-white/80">{part.text}</p>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/garis-singgung-lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} {t(`${p}.backToTopic`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSPDPage;
