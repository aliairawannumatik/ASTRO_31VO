import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { LineChart } from "lucide-react";

const accentColor = "#34d399";
const accentDim = "rgba(52,211,153,0.12)";
const borderColor = "rgba(52,211,153,0.25)";

type Part = { label: string; math?: string; text?: string };
type Badge = "UN" | "ANBK" | "TKA" | "AKM";
type Q = {
  n: number; title: string;
  content?: string; math?: string; blockMath?: string;
  parts?: Part[];
  badge?: Badge;
  type: "essay" | "mixed";
};

const badgeStyle: Record<Badge, string> = {
  UN: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
  ANBK: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  TKA: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  AKM: "bg-green-500/20 text-green-300 border-green-400/40",
};

const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const MetodeGrafikPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.spldv.metodeGrafik';

  const questions: Q[] = [
    Qf(1, t(`${p}.q1.title`), {
      badge: "ANBK", type: "mixed",
      content: t(`${p}.q1.content`),
      blockMath: "x + y = 6",
      parts: [
        { label: "a.", text: t(`${p}.q1.partA`) },
        { label: "b.", text: t(`${p}.q1.partB`) },
        { label: "c.", text: t(`${p}.q1.partC`) },
      ],
    }),
    Qf(2, t(`${p}.q2.title`), {
      badge: "UN", type: "mixed",
      content: t(`${p}.q2.content`),
      blockMath: "x - y = 2",
      parts: [
        { label: "a.", text: t(`${p}.q2.partA`) },
        { label: "b.", text: t(`${p}.q2.partB`) },
        { label: "c.", text: t(`${p}.q2.partC`) },
      ],
    }),
    Qf(3, t(`${p}.q3.title`), {
      badge: "UN", type: "mixed",
      blockMath: "\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}",
      parts: [
        { label: t(`${p}.q3.step1label`), text: t(`${p}.q3.step1`) },
        { label: t(`${p}.q3.step2label`), text: t(`${p}.q3.step2`) },
        { label: t(`${p}.q3.step3label`), text: t(`${p}.q3.step3`) },
        { label: t(`${p}.q3.step4label`), text: t(`${p}.q3.step4`) },
      ],
    }),
    Qf(4, t(`${p}.q4.title`), {
      badge: "TKA", type: "mixed",
      content: t(`${p}.q4.content`),
      parts: [
        { label: "a.", math: "2x + 3y = 12" },
        { label: "b.", math: "4x - 2y = 8" },
        { label: "c.", math: "x + 5y = 10" },
        { label: "d.", math: "3x - y = 9" },
      ],
    }),
    Qf(5, t(`${p}.q5.title`), {
      badge: "UN", type: "mixed",
      blockMath: "\\begin{cases} 2x + y = 7 \\\\ x + 2y = 8 \\end{cases}",
      parts: [
        { label: "a.", text: t(`${p}.q5.partA`) },
        { label: "b.", text: t(`${p}.q5.partB`) },
        { label: "c.", text: t(`${p}.q5.partC`) },
      ],
    }),
    Qf(6, t(`${p}.q6.title`), {
      badge: "TKA", type: "mixed",
      blockMath: "\\begin{cases} x = 3 \\\\ 2x + y = 10 \\end{cases}",
      parts: [
        { label: "a.", text: t(`${p}.q6.partA`) },
        { label: "b.", text: t(`${p}.q6.partB`) },
        { label: "c.", text: t(`${p}.q6.partC`) },
      ],
    }),
    Qf(7, t(`${p}.q7.title`), {
      badge: "UN", type: "mixed",
      blockMath: "\\begin{cases} 3x - y = 5 \\\\ x + y = 7 \\end{cases}",
      parts: [
        { label: "a.", text: t(`${p}.q7.partA`) },
        { label: "b.", text: t(`${p}.q7.partB`) },
        { label: "c.", text: t(`${p}.q7.partC`) },
        { label: "d.", text: t(`${p}.q7.partD`) },
      ],
    }),
    Qf(8, t(`${p}.q8.title`), {
      badge: "ANBK", type: "mixed",
      blockMath: "\\begin{cases} y = 2x \\\\ y = -x + 6 \\end{cases}",
      parts: [
        { label: "a.", text: t(`${p}.q8.partA`) },
        { label: "b.", text: t(`${p}.q8.partB`) },
        { label: "c.", text: t(`${p}.q8.partC`) },
      ],
    }),
    Qf(9, t(`${p}.q9.title`), {
      badge: "AKM", type: "mixed",
      content: t(`${p}.q9.content`),
      blockMath: "\\begin{cases} 3x - y = 4 \\\\ 6x - 2y = 8 \\end{cases}",
      parts: [
        { label: "a.", text: t(`${p}.q9.partA`) },
        { label: "b.", text: t(`${p}.q9.partB`) },
        { label: "c.", text: t(`${p}.q9.partC`) },
      ],
    }),
    Qf(10, t(`${p}.q10.title`), {
      badge: "UN", type: "mixed",
      blockMath: "\\begin{cases} 4x + 2y = 16 \\\\ x - y = -1 \\end{cases}",
      parts: [
        { label: "a.", text: t(`${p}.q10.partA`) },
        { label: "b.", text: t(`${p}.q10.partB`) },
        { label: "c.", text: t(`${p}.q10.partC`) },
      ],
    }),
    Qf(11, t(`${p}.q11.title`), {
      badge: "TKA", type: "mixed",
      blockMath: "\\begin{cases} 5x - 3y = 1 \\\\ 2x + y = 8 \\end{cases}",
      parts: [
        { label: "a.", text: t(`${p}.q11.partA`) },
        { label: "b.", text: t(`${p}.q11.partB`) },
        { label: "c.", text: t(`${p}.q11.partC`) },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <LineChart className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            {t(`${p}.pageTitle`)}
          </h1>
          <p className="text-white/40 text-xs font-body text-center">
            {t(`${p}.grade`)} · {t('practice.breadcrumb')} · {t(`${p}.soalCount`)}
          </p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {(["UN","ANBK","TKA","AKM"] as Badge[]).map(b => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b]}`}>{b}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl overflow-hidden border"
              style={{ background: accentDim, borderColor }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b"
                style={{ borderColor, background: "rgba(52,211,153,0.08)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: accentColor + "30", color: accentColor }}>
                  {q.n}
                </div>
                <span className="font-display text-sm font-bold" style={{ color: accentColor }}>{q.title}</span>
                {q.badge && (
                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle[q.badge]}`}>
                    {q.badge}
                  </span>
                )}
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.content && <p className="font-body text-sm text-white/85 leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-white/90 text-sm"><InlineMath math={q.math} /></div>}
                {q.blockMath && (
                  <div className="rounded-xl px-4 py-3 text-white/90 overflow-x-auto"
                    style={{ background: "rgba(52,211,153,0.08)", border: `1px solid ${borderColor}` }}>
                    <BlockMath math={q.blockMath} />
                  </div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1">
                    {q.parts.map((part, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <span className="font-bold text-xs shrink-0 mt-0.5" style={{ color: accentColor }}>{part.label}</span>
                        <span className="font-body text-sm text-white/80 leading-relaxed">
                          {part.text && part.text}
                          {part.math && <InlineMath math={part.math} />}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/spldv"); }}
            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer font-body">
            ← {t('practice.backToMenu')} {t(`${p}.backSuffix`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetodeGrafikPage;
