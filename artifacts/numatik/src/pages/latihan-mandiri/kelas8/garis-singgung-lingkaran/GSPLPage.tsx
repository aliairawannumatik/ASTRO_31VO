import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { GitCompareArrows } from "lucide-react";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  difficulty?: "Mudah" | "Sedang" | "Sulit";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const C = "#38bdf8";

const DiagramGSPLDuaLingkaran = ({
  r1px, r2px, labelP, labelQ, labelA, labelB, labelAB = "AB", labelPA, labelQB, labelPQ,
  size = 240
}: {
  r1px: number; r2px: number; size?: number;
  labelP?: string; labelQ?: string; labelA?: string; labelB?: string;
  labelAB?: string; labelPA?: string; labelQB?: string; labelPQ?: string;
}) => {
  const { isDark } = useTheme();
  const bgFill = isDark ? "rgba(2,8,23,0.97)" : "rgba(241,245,249,0.97)";
  const cx1 = r1px + 14;
  const cx2 = size - r2px - 14;
  const cy = size / 2;
  const d = cx2 - cx1;
  const rDiff = r1px - r2px;
  const sinA = rDiff / d;
  const cosA = Math.sqrt(Math.max(0, 1 - sinA * sinA));
  const ax = cx1 + r1px * sinA;
  const ay = cy - r1px * cosA;
  const bx = cx2 + r2px * sinA;
  const by = cy - r2px * cosA;
  const ax2 = cx1 + r1px * sinA;
  const ay2 = cy + r1px * cosA;
  const bx2 = cx2 + r2px * sinA;
  const by2 = cy + r2px * cosA;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill={bgFill} rx="12" />
      <circle cx={cx1} cy={cy} r={r1px} fill="rgba(56,189,248,0.07)" stroke={C} strokeWidth="2" />
      <circle cx={cx2} cy={cy} r={r2px} fill="rgba(251,146,60,0.07)" stroke="#fb923c" strokeWidth="2" />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#34d399" strokeWidth="2.2" />
      <line x1={ax2} y1={ay2} x2={bx2} y2={by2} stroke="#34d399" strokeWidth="2.2" />
      <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" />
      <line x1={cx1} y1={cy} x2={ax} y2={ay} stroke="#60a5fa" strokeWidth="1.4" strokeDasharray="3,2" />
      <line x1={cx2} y1={cy} x2={bx} y2={by} stroke="#fb923c" strokeWidth="1.4" strokeDasharray="3,2" />
      <rect x={ax - 6} y={ay - 1} width="6" height="6" fill="none" stroke="#facc15" strokeWidth="1.2"
        transform={`rotate(${Math.atan2(ay - cy, ax - cx1) * 180 / Math.PI + 90}, ${ax}, ${ay})`} />
      <rect x={bx - 6} y={by - 1} width="6" height="6" fill="none" stroke="#facc15" strokeWidth="1.2"
        transform={`rotate(${Math.atan2(by - cy, bx - cx2) * 180 / Math.PI + 90}, ${bx}, ${by})`} />
      <circle cx={cx1} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={cx1 - 8} y={cy + 18} fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="serif">{labelP ?? "M"}</text>
      <circle cx={cx2} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={cx2 - 4} y={cy + 18} fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="serif">{labelQ ?? "N"}</text>
      <circle cx={ax} cy={ay} r={3.5} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={ax - 16} y={ay - 5} fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="serif">{labelA ?? "A"}</text>
      <circle cx={bx} cy={by} r={3.5} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={bx + 5} y={by - 5} fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="serif">{labelB ?? "B"}</text>
      {labelPA && (
        <text x={cx1 - 22} y={cy - r1px / 2} fill={C} fontSize="10" fontWeight="bold" fontFamily="sans-serif">{labelPA}</text>
      )}
      {labelQB && (
        <text x={cx2 + 7} y={cy - r2px / 2} fill="#fb923c" fontSize="10" fontWeight="bold" fontFamily="sans-serif">{labelQB}</text>
      )}
      {labelPQ && (
        <text x={(cx1 + cx2) / 2 - 12} y={cy + 14} fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">{labelPQ}</text>
      )}
      <text x={(ax + bx) / 2 - 10} y={(ay + by) / 2 - 9} fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="sans-serif">{labelAB}</text>
    </svg>
  );
};

const DiagramBersinggungLuar = ({ size = 240, tangentPointLabel = "titik singgung" }: { size?: number; tangentPointLabel?: string }) => {
  const { isDark } = useTheme();
  const bgFill = isDark ? "rgba(2,8,23,0.97)" : "rgba(241,245,249,0.97)";
  const r1 = 36;
  const r2 = 20;
  const cx1 = 70;
  const cx2 = cx1 + r1 + r2;
  const cy = size / 2;
  const rDiff = r1 - r2;
  const d = cx2 - cx1;
  const sinA = rDiff / d;
  const cosA = Math.sqrt(Math.max(0, 1 - sinA * sinA));
  const ax = cx1 + r1 * sinA;
  const ay = cy - r1 * cosA;
  const bx = cx2 + r2 * sinA;
  const by = cy - r2 * cosA;
  const ax2 = cx1 + r1 * sinA;
  const ay2 = cy + r1 * cosA;
  const bx2 = cx2 + r2 * sinA;
  const by2 = cy + r2 * cosA;
  const tx = cx1 + r1;
  const ty = cy;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill={bgFill} rx="12" />
      <circle cx={cx1} cy={cy} r={r1} fill="rgba(56,189,248,0.07)" stroke={C} strokeWidth="2" />
      <circle cx={cx2} cy={cy} r={r2} fill="rgba(251,146,60,0.07)" stroke="#fb923c" strokeWidth="2" />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#34d399" strokeWidth="2.2" />
      <line x1={ax2} y1={ay2} x2={bx2} y2={by2} stroke="#34d399" strokeWidth="2.2" />
      <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" />
      <circle cx={tx} cy={ty} r={3} fill="#facc15" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={tx - 4} y={ty + 16} fill="#facc15" fontSize="9" fontFamily="sans-serif">{tangentPointLabel}</text>
      <circle cx={cx1} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={cx1 - 8} y={cy + 17} fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="serif">P</text>
      <circle cx={cx2} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={cx2 - 4} y={cy + 17} fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="serif">Q</text>
      <circle cx={ax} cy={ay} r={3.5} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={ax - 16} y={ay - 5} fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="serif">A</text>
      <circle cx={bx} cy={by} r={3.5} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={bx + 5} y={by - 5} fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="serif">B</text>
      <line x1={cx1} y1={cy} x2={ax} y2={ay} stroke="#60a5fa" strokeWidth="1.3" strokeDasharray="3,2" />
      <line x1={cx2} y1={cy} x2={bx} y2={by} stroke="#fb923c" strokeWidth="1.3" strokeDasharray="3,2" />
      <text x={cx1 - 26} y={cy - r1 / 2} fill={C} fontSize="10" fontWeight="bold" fontFamily="sans-serif">AP</text>
      <text x={cx2 + 7} y={cy - r2 / 2} fill="#fb923c" fontSize="10" fontWeight="bold" fontFamily="sans-serif">BQ</text>
    </svg>
  );
};

const DiagramGir = ({ size = 280 }: { size?: number }) => {
  const { isDark } = useTheme();
  const bgFill = isDark ? "rgba(2,8,23,0.97)" : "rgba(241,245,249,0.97)";
  const r1 = 52;
  const r2 = 26;
  const cx1 = r1 + 16;
  const cx2 = size - r2 - 20;
  const cy = size / 2 + 10;
  const d = cx2 - cx1;
  const rDiff = r1 - r2;
  const sinA = rDiff / d;
  const cosA = Math.sqrt(Math.max(0, 1 - sinA * sinA));
  const ax = cx1 + r1 * sinA;
  const ay = cy - r1 * cosA;
  const bx = cx2 + r2 * sinA;
  const by = cy - r2 * cosA;
  const ax2 = cx1 + r1 * sinA;
  const ay2 = cy + r1 * cosA;
  const bx2 = cx2 + r2 * sinA;
  const by2 = cy + r2 * cosA;
  const toothCount1 = 14;
  const toothCount2 = 7;
  const gearTeeth = (cx: number, cy: number, rInner: number, rOuter: number, count: number, color: string) => {
    const teeth = [];
    for (let i = 0; i < count; i++) {
      const a1 = (i * 2 * Math.PI) / count;
      const a2 = ((i + 0.35) * 2 * Math.PI) / count;
      const a3 = ((i + 0.65) * 2 * Math.PI) / count;
      const a4 = ((i + 1) * 2 * Math.PI) / count;
      teeth.push(
        <path key={i} d={`
          M ${cx + rInner * Math.cos(a1)} ${cy + rInner * Math.sin(a1)}
          L ${cx + rOuter * Math.cos(a2)} ${cy + rOuter * Math.sin(a2)}
          L ${cx + rOuter * Math.cos(a3)} ${cy + rOuter * Math.sin(a3)}
          L ${cx + rInner * Math.cos(a4)} ${cy + rInner * Math.sin(a4)}
        `} fill={color} stroke="rgba(0,0,0,0.5)" strokeWidth="0.8" />
      );
    }
    return teeth;
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill={bgFill} rx="12" />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <line x1={ax2} y1={ay2} x2={bx2} y2={by2} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <path d={`M ${ax2} ${ay2} A ${r1} ${r1} 0 0 0 ${ax} ${ay}`} fill="none" stroke="#94a3b8" strokeWidth="3" />
      <path d={`M ${bx} ${by} A ${r2} ${r2} 0 0 0 ${bx2} ${by2}`} fill="none" stroke="#94a3b8" strokeWidth="3" />
      <circle cx={cx1} cy={cy} r={r1} fill="rgba(251,146,60,0.18)" stroke="#fb923c" strokeWidth="1.5" />
      {gearTeeth(cx1, cy, r1, r1 + 7, toothCount1, "rgba(251,146,60,0.6)")}
      <circle cx={cx1} cy={cy} r={r1 * 0.35} fill="rgba(251,146,60,0.3)" stroke="#fb923c" strokeWidth="1.5" />
      <circle cx={cx2} cy={cy} r={r2} fill="rgba(56,189,248,0.18)" stroke={C} strokeWidth="1.5" />
      {gearTeeth(cx2, cy, r2, r2 + 5, toothCount2, "rgba(56,189,248,0.6)")}
      <circle cx={cx2} cy={cy} r={r2 * 0.35} fill="rgba(56,189,248,0.3)" stroke={C} strokeWidth="1.5" />
      <circle cx={cx1} cy={cy} r={3.5} fill="#fb923c" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={cx1 - 6} y={cy + 18} fill="#fb923c" fontSize="11" fontWeight="bold" fontFamily="serif">Q₁</text>
      <circle cx={cx2} cy={cy} r={3.5} fill={C} stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={cx2 - 6} y={cy + 18} fill={C} fontSize="11" fontWeight="bold" fontFamily="serif">Q₂</text>
      <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
      <text x={(cx1 + cx2) / 2 - 10} y={cy + 12} fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">d</text>
      <circle cx={ax} cy={ay} r={4} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1.2" />
      <text x={ax - 14} y={ay - 7} fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="serif">A</text>
      <circle cx={bx} cy={by} r={4} fill="#facc15" stroke="var(--icon-stroke)" strokeWidth="1.2" />
      <text x={bx + 5} y={by - 7} fill="#facc15" fontSize="12" fontWeight="bold" fontFamily="serif">B</text>
    </svg>
  );
};

const diffColor: Record<string, string> = {
  Mudah: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
  Sedang: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  Sulit: "bg-violet-500/20 text-violet-300 border-violet-400/40",
};

const p = 'practice.garisSinggungLingkaran.gspl';

const GSPLPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const karenaText = t(`${p}.q7.karena`);
  const diffLabels: Record<string, string> = {
    Mudah: t(`${p}.diffMudah`),
    Sedang: t(`${p}.diffSedang`),
    Sulit: t(`${p}.diffSulit`),
  };

  const questions: Q[] = [
    Qn(1, t(`${p}.q1.title`), {
      difficulty: "Mudah",
      diagram: <DiagramGSPLDuaLingkaran r1px={62} r2px={28} size={240}
        labelP="M" labelQ="N" labelA="A" labelB="B"
        labelPA="MA = 9 cm" labelQB="NB = 4 cm" labelPQ="MN = 13 cm" />,
      content: t(`${p}.q1.content`),
      parts: [
        { label: "a.", math: "d_{GSPL} = \\sqrt{MN^2 - (MA - NB)^2} = \\sqrt{13^2 - (9-4)^2}" },
        { label: "b.", math: "= \\sqrt{169 - 25} = \\sqrt{144}" },
        { label: "c.", math: "AB = \\ldots \\text{ cm}" },
      ],
    }),
    Qn(2, t(`${p}.q2.title`), {
      difficulty: "Mudah",
      content: t(`${p}.q2.content`),
      parts: [
        { label: "a.", math: "d_{GSPD}^2 = p^2 - (R + r)^2 \\Rightarrow 24^2 = p^2 - (10+8)^2" },
        { label: "b.", math: "576 = p^2 - 324 \\Rightarrow p^2 = 900" },
        { label: "c.", math: "p = \\ldots \\text{ cm}" },
      ],
    }),
    Qn(3, t(`${p}.q3.title`), {
      difficulty: "Mudah",
      content: t(`${p}.q3.content`),
      parts: [
        { label: "a.", math: "d_{GSPD}^2 = p^2 - (R + r)^2 \\Rightarrow 400 = 625 - (R + r)^2" },
        { label: "b.", math: "(R + r)^2 = 225 \\Rightarrow R + r = 15" },
        { label: "c.", math: "r = 15 - 9 = \\ldots \\text{ cm}" },
      ],
    }),
    Qn(4, t(`${p}.q4.title`), {
      difficulty: "Sedang",
      content: t(`${p}.q4.content`),
      parts: [
        { label: "a.", math: "(R + r)^2 = p^2 - d_{GSPD}^2 = 625 - 400 = 225 \\Rightarrow R + r = 15" },
        { label: "b.", math: "R = 2r \\Rightarrow 2r + r = 15 \\Rightarrow r = 5" },
        { label: "c.", math: "R = 2 \\times 5 = \\ldots \\text{ cm}" },
      ],
    }),
    Qn(5, t(`${p}.q5.title`), {
      difficulty: "Mudah",
      diagram: <DiagramGSPLDuaLingkaran r1px={65} r2px={26} size={240}
        labelP="P" labelQ="Q" labelA="A" labelB="B"
        labelPA="PA = 15 cm" labelQB="QB = 6 cm" labelPQ="PQ = 25 cm" />,
      content: t(`${p}.q5.content`),
      parts: [
        { label: "a.", math: "AB = \\sqrt{PQ^2 - (PA - QB)^2} = \\sqrt{25^2 - (15-6)^2}" },
        { label: "b.", math: "= \\sqrt{625 - 81} = \\sqrt{544}" },
        { label: "c.", math: "AB = 4\\sqrt{34} \\approx \\ldots \\text{ cm}" },
      ],
    }),
    Qn(6, t(`${p}.q6.title`), {
      difficulty: "Sedang",
      content: t(`${p}.q6.content`),
      parts: [
        { label: "a.", math: "d_{GSPL}^2 = p^2 - (R - r)^2 \\Rightarrow 24^2 = p^2 - (25-7)^2" },
        { label: "b.", math: "576 = p^2 - 324 \\Rightarrow p^2 = 900" },
        { label: "c.", math: "p = \\ldots \\text{ cm}" },
      ],
    }),
    Qn(7, t(`${p}.q7.title`), {
      difficulty: "Sedang",
      diagram: <DiagramBersinggungLuar size={240} tangentPointLabel={t('practice.garisSinggungLingkaran.shared.tangentPointLabel')} />,
      content: t(`${p}.q7.content`),
      parts: [
        { label: "a.", math: `\\text{${karenaText}} PQ = AP + BQ = 3 + 12 = 15 \\text{ cm}` },
        { label: "b.", math: "AB = \\sqrt{PQ^2 - (AP - BQ)^2} = \\sqrt{15^2 - (12-3)^2} = \\sqrt{225 - 81}" },
        { label: "c.", math: "AB = \\sqrt{144} = \\ldots \\text{ cm}" },
      ],
    }),
    Qn(8, t(`${p}.q8.title`), {
      difficulty: "Sedang",
      content: t(`${p}.q8.content`),
      parts: [
        { label: "a.", math: "d_{GSPL}^2 = p^2 - (R - r)^2 \\Rightarrow 576 = 676 - (R - 5)^2" },
        { label: "b.", math: "(R - 5)^2 = 100 \\Rightarrow R - 5 = 10" },
        { label: "c.", math: "R = \\ldots \\text{ cm}" },
      ],
    }),
    Qn(9, t(`${p}.q9.title`), {
      difficulty: "Sedang",
      content: t(`${p}.q9.content`),
      parts: [
        { label: "a.", math: "d_{GSPD} = \\sqrt{20^2 - (8+4)^2} = \\sqrt{400 - 144} = \\sqrt{256} = \\ldots \\text{ cm}" },
        { label: "b.", math: "d_{GSPL} = \\sqrt{20^2 - (8-4)^2} = \\sqrt{400 - 16} = \\sqrt{384} = 8\\sqrt{6} \\approx \\ldots \\text{ cm}" },
      ],
    }),
    Qn(10, t(`${p}.q10.title`), {
      difficulty: "Sulit",
      content: t(`${p}.q10.content`),
      parts: [
        { label: "a.", math: "d_{GSPL}^2 = 2 \\cdot d_{GSPD}^2 \\Rightarrow p^2 - (6-4)^2 = 2\\left[p^2 - (6+4)^2\\right]" },
        { label: "b.", math: "p^2 - 4 = 2p^2 - 200 \\Rightarrow p^2 = 196" },
        { label: "c.", math: "p = \\ldots \\text{ cm}" },
      ],
    }),
    Qn(11, t(`${p}.q11.title`), {
      difficulty: "Sulit",
      diagram: <DiagramGir size={260} />,
      content: t(`${p}.q11.content`),
      parts: [
        { label: "a.", math: "r_1 = 12 \\text{ cm},\\; r_2 = 6 \\text{ cm},\\; d = 42 \\text{ cm}" },
        { label: "b.", math: "AB = \\sqrt{d^2 - (r_1 - r_2)^2} = \\sqrt{42^2 - (12-6)^2} = \\sqrt{1764 - 36}" },
        { label: "c.", math: "AB = \\sqrt{1728} = 24\\sqrt{3} \\approx \\ldots \\text{ cm}" },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <GitCompareArrows className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            {t(`${p}.h1`)}
          </h1>
          <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center font-body`}>{t(`${p}.subtitle`)} · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 11 {t('practice.suffixSoal')}</span>
            <span className={`${isDark ? "text-white/30" : "text-gray-400"} text-xs`}>·</span>
            <span className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs`}>{t(`${p}.tagLine`)}</span>
          </div>
        </div>

        <div className={`mb-5 ${isDark ? "bg-cyan-900/20" : "bg-cyan-50"} border border-cyan-500/20 rounded-xl p-4`}>
          <p className="text-cyan-300 text-xs font-bold mb-2">{t(`${p}.formulaBoxTitle`)}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <div className={`${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-3 py-3`}>
              <p className="text-cyan-300 text-[10px] font-bold mb-1">{t(`${p}.gsplLabel`)}</p>
              <div className="flex justify-center">
                <BlockMath math="d_{\text{GSPL}} = \sqrt{p^2 - (R - r)^2}" />
              </div>
            </div>
            <div className={`${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-3 py-3`}>
              <p className="text-violet-300 text-[10px] font-bold mb-1">{t(`${p}.gspdLabel`)}</p>
              <div className="flex justify-center">
                <BlockMath math="d_{\text{GSPD}} = \sqrt{p^2 - (R + r)^2}" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { l: "p", v: t(`${p}.legendP`) },
              { l: "R", v: t(`${p}.legendR`) },
              { l: "r", v: t(`${p}.legendR2`) },
              { l: "d", v: t(`${p}.legendD`) },
            ].map(x => (
              <div key={x.l} className={`${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-2 py-2`}>
                <span className="text-cyan-400 font-bold">{x.l}: </span>
                <span className={isDark ? "text-white/60" : "text-gray-600"}>{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-cyan-900/30 via-slate-900/80 to-blue-900/30" : "from-cyan-50/60 via-white/80 to-blue-50/40"} backdrop-blur`} />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                          {diffLabels[q.difficulty]}
                        </span>
                      )}
                    </div>
                    {q.content && <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"} leading-relaxed mb-3 whitespace-pre-line`}>{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((part, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${part.label ? (isDark ? 'bg-white/5' : 'bg-gray-50') : 'bg-transparent px-0'}`}>
                            {part.label && <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{part.label}</span>}
                            {part.math
                              ? <div className={`${isDark ? "text-white" : "text-gray-900"} text-sm overflow-x-auto`}><InlineMath math={part.math} /></div>
                              : <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{part.text}</p>
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
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSPLPage;
