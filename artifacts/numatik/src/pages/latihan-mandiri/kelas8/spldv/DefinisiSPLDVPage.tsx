import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Layers } from "lucide-react";

const accentColor = "#a78bfa";
const accentDim = "rgba(167,139,250,0.13)";
const borderColor = "rgba(167,139,250,0.25)";

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

const DefinisiSPLDVPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.spldv.definisiSpldv';

  const questions: Q[] = [
    Qf(1, t(`${p}.q1.title`), {
      badge: "ANBK",
      type: "mixed",
      content: t(`${p}.q1.content`),
      parts: [
        { label: "a.", math: "2x + 3y = 7" },
        { label: "b.", math: "x^2 + y = 5" },
        { label: "c.", math: "4x - 2y = 10" },
        { label: "d.", math: "x + y^2 = 9" },
        { label: "e.", math: "3x - 5y = 0" },
      ],
    }),
    Qf(2, t(`${p}.q2.title`), {
      badge: "TKA",
      type: "mixed",
      content: t(`${p}.q2.content`),
      parts: [
        { label: "a.", math: "\\begin{cases} x + y = 10 \\\\ x - y = 4 \\end{cases}" },
        { label: "b.", math: "\\begin{cases} x^2 + y = 6 \\\\ x + y = 3 \\end{cases}" },
        { label: "c.", math: "\\begin{cases} 2x + 3y = 12 \\\\ x = 4 \\end{cases}" },
        { label: "d.", math: "\\begin{cases} xy = 6 \\\\ x + y = 5 \\end{cases}" },
      ],
    }),
    Qf(3, t(`${p}.q3.title`), {
      badge: "UN",
      type: "mixed",
      content: t(`${p}.q3.content`),
      blockMath: "\\begin{cases} 2x + y = 8 \\\\ x - y = 1 \\end{cases}",
      parts: [
        { label: "a.", math: "(3, 2)" },
        { label: "b.", math: "(4, 0)" },
        { label: "c.", math: "(2, 4)" },
        { label: "d.", math: "(5, -2)" },
      ],
    }),
    Qf(4, t(`${p}.q4.title`), {
      badge: "UN",
      type: "mixed",
      content: t(`${p}.q4.content`),
      blockMath: "\\begin{cases} 2x + 3y = 16 \\\\ x - y = 1 \\end{cases}",
      parts: [
        { label: "A.", math: "(1, 4)" },
        { label: "B.", math: "(5, 2)" },
        { label: "C.", math: "(4, 3)" },
        { label: "D.", math: "(3, 4)" },
      ],
    }),
    Qf(5, t(`${p}.q5.title`), {
      badge: "UN",
      type: "mixed",
      content: t(`${p}.q5.content`),
      parts: [
        { label: "a.", math: "\\begin{cases} 2x + 4y = 8 \\\\ x + 2y = 4 \\end{cases}" },
        { label: "b.", math: "\\begin{cases} x + y = 5 \\\\ x + y = 7 \\end{cases}" },
        { label: "c.", math: "\\begin{cases} 3x - y = 4 \\\\ 6x - 2y = 8 \\end{cases}" },
        { label: "d.", math: "\\begin{cases} x + 2y = 6 \\\\ 2x + 4y = 12 \\end{cases}" },
        { label: "e.", math: "\\begin{cases} 3x - y = 4 \\\\ x + 2y = 5 \\end{cases}" },
        { label: "f.", math: "\\begin{cases} 2x + 6y = 10 \\\\ x + 3y = 8 \\end{cases}" },
        { label: "g.", math: "\\begin{cases} 4x - 2y = 8 \\\\ -2x + y = -4 \\end{cases}" },
      ],
    }),
    Qf(6, t(`${p}.q6.title`), {
      badge: "ANBK",
      type: "mixed",
      content: t(`${p}.q6.content`),
      parts: [
        { label: "a.", math: "y = 3x - 5" },
        { label: "b.", math: "\\frac{x}{2} + \\frac{y}{3} = 1" },
        { label: "c.", math: "2(x+1) = 3(y-2) + 4" },
        { label: "d.", math: "0.5x - 1.5y = 6" },
      ],
    }),
    Qf(7, t(`${p}.q7.title`), {
      badge: "UN",
      type: "mixed",
      content: t(`${p}.q7.content`),
      parts: [
        { label: "a.", text: t(`${p}.q7.partA`) },
        { label: "b.", text: t(`${p}.q7.partB`) },
        { label: "c.", text: t(`${p}.q7.partC`) },
      ],
    }),
    Qf(8, t(`${p}.q8.title`), {
      badge: "ANBK",
      type: "mixed",
      content: t(`${p}.q8.content`),
      parts: [
        { label: "(1)", text: t(`${p}.q8.part1`) },
        { label: "(2)", text: t(`${p}.q8.part2`) },
        { label: "(3)", text: t(`${p}.q8.part3`) },
        { label: "(4)", text: t(`${p}.q8.part4`) },
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
            <Layers className="w-8 h-8" style={{ color: accentColor }} />
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
                style={{ borderColor, background: "rgba(167,139,250,0.08)" }}>
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
                    style={{ background: "rgba(167,139,250,0.08)", border: `1px solid ${borderColor}` }}>
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

export default DefinisiSPLDVPage;
