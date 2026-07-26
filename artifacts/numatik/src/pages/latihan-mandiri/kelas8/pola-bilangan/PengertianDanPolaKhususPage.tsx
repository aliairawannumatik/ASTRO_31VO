import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Sigma, Star } from "lucide-react";

// ─── SVG Illustrations ────────────────────────────────────────────────────────

/** Soal 1 – Pola persegi panjang: pola ke-n memiliki (n+1) kolom × n baris = n(n+1) persegi kecil
 *  Pola ke-1: 2×1=2 | Pola ke-2: 3×2=6 | Pola ke-3: 4×3=12 */
const SvgPolaGambar1 = () => {
  const sq = 18, gap = 3;
  const svgH = 96, svgW = 310;
  const bottomY = 70;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {[1, 2, 3].map((n, gi) => {
        const cols = n + 1;
        const rows = n;
        const cx = 52 + gi * 100;
        const gridW = cols * sq + (cols - 1) * gap;
        const gridH = rows * sq + (rows - 1) * gap;
        const startX = cx - gridW / 2;
        const startY = bottomY - gridH;
        return (
          <g key={gi}>
            {Array.from({ length: rows }, (_, row) =>
              Array.from({ length: cols }, (_, col) => (
                <rect key={`${row}-${col}`}
                  x={startX + col * (sq + gap)} y={startY + row * (sq + gap)}
                  width={sq} height={sq} rx={2}
                  fill="rgba(56,189,248,0.45)" stroke="rgba(56,189,248,0.9)" strokeWidth="1.5" />
              ))
            )}
            <text x={cx} y={svgH - 6} textAnchor="middle"
              fill="#7dd3fc" fontSize="9" fontFamily="sans-serif">Pola ke-{n}</text>
          </g>
        );
      })}
    </svg>
  );
};

const SvgPolaGambar2 = () => {
  const svgW = 340, svgH = 82;
  const triBase = 28, triH = 24, peakY = 10, byY = 10 + triH;
  const configs = [
    { count: 1, label: "Pola ke-1", cx: 42 },
    { count: 2, label: "Pola ke-2", cx: 138 },
    { count: 3, label: "Pola ke-3", cx: 258 },
  ];
  const stroke = "rgba(251,191,36,0.9)";
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {configs.map(({ count, label, cx }, gi) => {
        const totalW = count * triBase;
        const sx = cx - totalW / 2;
        const lines: JSX.Element[] = [];

        for (let i = 0; i < count; i++) {
          lines.push(
            <line key={`base${i}`}
              x1={sx + i * triBase} y1={byY}
              x2={sx + (i + 1) * triBase} y2={byY}
              stroke={stroke} strokeWidth="2" />
          );
        }

        for (let i = 0; i < count; i++) {
          const bx = sx + i * triBase;
          const px = sx + (i + 0.5) * triBase;
          lines.push(
            <line key={`L${i}`} x1={bx} y1={byY} x2={px} y2={peakY} stroke={stroke} strokeWidth="2" />,
            <line key={`R${i}`} x1={px} y1={peakY} x2={bx + triBase} y2={byY} stroke={stroke} strokeWidth="2" />
          );
        }

        for (let i = 0; i < count - 1; i++) {
          const px1 = sx + (i + 0.5) * triBase;
          const px2 = sx + (i + 1.5) * triBase;
          lines.push(
            <line key={`H${i}`} x1={px1} y1={peakY} x2={px2} y2={peakY} stroke={stroke} strokeWidth="2" />
          );
        }

        return (
          <g key={gi}>
            {lines}
            <text x={cx} y={svgH - 6} textAnchor="middle"
              fill="#fde68a" fontSize="9" fontFamily="sans-serif">{label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const SvgQ3 = () => {
  const bw = 20, bh = 10, hGap = 2, vGap = 2;
  const rowW = 3 * bw + 2 * hGap;
  const rowH = bh + vGap;
  const maxRows = 4;
  const groupGap = 18;
  const svgH = maxRows * rowH + 22;
  const svgW = 4 * rowW + 3 * groupGap + 10;
  const bottomY = maxRows * rowH;
  const brickColors = [
    ["rgba(251,146,60,0.30)", "rgba(251,146,60,0.75)"],
    ["rgba(251,191,36,0.28)", "rgba(251,191,36,0.70)"],
  ];
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-lg mx-auto" xmlns="http://www.w3.org/2000/svg">
      {[1, 2, 3, 4].map((rows, gi) => {
        const gx = 5 + gi * (rowW + groupGap);
        return (
          <g key={gi}>
            {Array.from({ length: rows }, (_, ri) => {
              const y = bottomY - (ri + 1) * rowH;
              const [fill, stroke] = brickColors[ri % 2];
              return Array.from({ length: 3 }, (_, bi) => (
                <rect key={`${ri}-${bi}`}
                  x={gx + bi * (bw + hGap)} y={y} width={bw} height={bh} rx={2}
                  fill={fill} stroke={stroke} strokeWidth="1" />
              ));
            })}
            <text x={gx + rowW / 2} y={bottomY + 13} textAnchor="middle"
              fill="#a78bfa" fontSize="8.5" fontFamily="sans-serif">Baris {gi + 1}</text>
          </g>
        );
      })}
    </svg>
  );
};

const SvgQ5Lingkaran = () => {
  // Pola ke-n: rows=n, cols=n+2 → 3, 8, 15 circles
  const r = 6, sp = 15;
  const groups = [
    { rows: 1, cols: 3, label: "Pola ke-1" },
    { rows: 2, cols: 4, label: "Pola ke-2" },
    { rows: 3, cols: 5, label: "Pola ke-3" },
  ];
  const groupW = 100, svgH = 90;
  const svgW = groups.length * groupW + 10;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-md mx-auto" xmlns="http://www.w3.org/2000/svg">
      {groups.map(({ rows, cols, label }, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const cy = 38;
        const circles = [];
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            circles.push(
              <circle key={`${row}-${col}`}
                cx={cx - (cols - 1) * sp / 2 + col * sp}
                cy={cy - (rows - 1) * sp / 2 + row * sp}
                r={r}
                fill="rgba(56,189,248,0.25)"
                stroke="rgba(56,189,248,0.9)"
                strokeWidth="1.5" />
            );
          }
        }
        return (
          <g key={gi}>
            {circles}
            <text x={cx} y={svgH - 8} textAnchor="middle"
              fill="#7dd3fc" fontSize="9" fontFamily="sans-serif">{label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const SvgQ7 = () => {
  const configs = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }];
  const groupW = 80, svgH = 80, r = 4, sp = 12;
  const svgW = configs.length * groupW + 10;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {configs.map(({ n }, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const cy = 40;
        const totalH = (n - 1) * sp;
        const dots = [];
        for (let row = 0; row < n; row++) {
          const dotsInRow = row + 1;
          const rowY = cy - totalH / 2 + row * sp;
          const rowStartX = cx - (dotsInRow - 1) * sp / 2;
          for (let d = 0; d < dotsInRow; d++) {
            dots.push(
              <circle key={`${row}-${d}`}
                cx={rowStartX + d * sp} cy={rowY} r={r}
                fill="rgba(99,102,241,0.65)" stroke="#818cf8" strokeWidth="1" />
            );
          }
        }
        return <g key={gi}>{dots}</g>;
      })}
    </svg>
  );
};

const SvgQ8 = () => {
  const configs = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }];
  const groupW = 82, svgH = 80, r = 4, sp = 12;
  const svgW = configs.length * groupW + 10;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {configs.map(({ n }, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const cy = 40;
        const dots = [];
        for (let row = 0; row < n; row++) {
          for (let col = 0; col < n; col++) {
            dots.push(
              <circle key={`${row}-${col}`}
                cx={cx - (n - 1) * sp / 2 + col * sp}
                cy={cy - (n - 1) * sp / 2 + row * sp}
                r={r} fill="rgba(34,211,238,0.65)" stroke="#22d3ee" strokeWidth="1" />
            );
          }
        }
        return <g key={gi}>{dots}</g>;
      })}
    </svg>
  );
};

const SvgQ9 = () => {
  const configs = [
    { rows: 1, cols: 2 },
    { rows: 2, cols: 3 },
    { rows: 3, cols: 4 },
    { rows: 4, cols: 5 },
  ];
  const groupW = 88, svgH = 84, r = 4, sp = 12;
  const svgW = configs.length * groupW + 10;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-lg mx-auto" xmlns="http://www.w3.org/2000/svg">
      {configs.map(({ rows, cols }, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const cy = 42;
        const dots = [];
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            dots.push(
              <circle key={`${row}-${col}`}
                cx={cx - (cols - 1) * sp / 2 + col * sp}
                cy={cy - (rows - 1) * sp / 2 + row * sp}
                r={r} fill="rgba(251,146,60,0.65)" stroke="#fb923c" strokeWidth="1" />
            );
          }
        }
        return <g key={gi}>{dots}</g>;
      })}
    </svg>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────

type PartItem = { label: string; math?: string; textKey?: string };

type QuestionItem = {
  number: number;
  titleKey: string;
  contentKey?: string;
  contentAfterSvgKey?: string;
  type: "essay" | "mixed";
  parts?: PartItem[];
  svgNode?: React.ReactNode;
  imgSrc?: string;
};

// ─── Data (key references — no hardcoded Indonesian text) ─────────────────────

const questions: QuestionItem[] = [
  {
    number: 1,
    titleKey: "q1.title",
    contentKey: "perhatikanPola",
    type: "mixed",
    svgNode: <SvgPolaGambar1 />,
    parts: [
      { label: "a.", textKey: "q1.a" },
      { label: "b.", textKey: "aturanPola" },
      { label: "c.", textKey: "q1.c" },
    ],
  },
  {
    number: 2,
    titleKey: "q2.title",
    contentKey: "perhatikanPola",
    contentAfterSvgKey: "q2.contentAfterSvg",
    type: "essay",
    svgNode: <SvgPolaGambar2 />,
  },
  {
    number: 3,
    titleKey: "q3.title",
    contentKey: "q3.content",
    type: "mixed",
    parts: [
      { label: "a.", math: "3,\\ 7,\\ 11,\\ ?,\\ 19,\\ 23" },
      { label: "b.", math: "2,\\ 4,\\ 8,\\ ?,\\ 32,\\ 64" },
      { label: "c.", math: "1,\\ 2,\\ 4,\\ 7,\\ 11,\\ 16,\\ \\ldots" },
      { label: "d.", math: "100,\\ 95,\\ 88,\\ 79,\\ ?,\\ 55" },
    ],
  },
  {
    number: 4,
    titleKey: "q4.title",
    contentKey: "q4.content",
    type: "mixed",
    svgNode: <SvgQ3 />,
    parts: [
      { label: "a.", textKey: "q4.a" },
      { label: "b.", textKey: "q4.b" },
    ],
  },
  {
    number: 5,
    titleKey: "q5.title",
    contentKey: "perhatikanPola",
    type: "mixed",
    svgNode: <SvgQ5Lingkaran />,
    parts: [
      { label: "a.", textKey: "q5.a" },
      { label: "b.", textKey: "aturanPola" },
      { label: "c.", textKey: "q5.c" },
    ],
  },
  {
    number: 6,
    titleKey: "q6.title",
    contentKey: "q6.content",
    type: "mixed",
    svgNode: <SvgQ8 />,
    parts: [
      { label: "Pola:", math: "1,\\ 4,\\ 9,\\ 16,\\ 25,\\ ..." },
      { label: "a.", textKey: "q6.a" },
      { label: "b.", textKey: "q6.b" },
    ],
  },
  {
    number: 7,
    titleKey: "q7.title",
    contentKey: "q7.content",
    type: "mixed",
    svgNode: <SvgQ7 />,
    parts: [
      { label: "Pola:", math: "1,\\ 3,\\ 6,\\ 10,\\ 15,\\ ..." },
      { label: "a.", textKey: "q7.a" },
      { label: "b.", textKey: "q7.b" },
    ],
  },
  {
    number: 8,
    titleKey: "q8.title",
    contentKey: "q8.content",
    type: "mixed",
    svgNode: <SvgQ9 />,
    parts: [
      { label: "Pola:", math: "2,\\ 6,\\ 12,\\ 20,\\ 30,\\ ..." },
      { label: "a.", textKey: "q8.a" },
      { label: "b.", textKey: "q8.b" },
    ],
  },
  {
    number: 9,
    titleKey: "q9.title",
    contentKey: "q9.content",
    type: "mixed",
    parts: [
      { label: "a.", math: "U_n = n(n + 2)" },
      { label: "b.", math: "U_n = 2n(n - 1)" },
      { label: "c.", math: "U_n = 2n^2 - 1" },
    ],
  },
  {
    number: 10,
    titleKey: "q10.title",
    contentKey: "q10.content",
    type: "mixed",
    parts: [
      { label: "a.", math: "0,\\ 3,\\ 8,\\ 15,\\ 24,\\ \\ldots" },
      { label: "b.", math: "1,\\ 7,\\ 17,\\ 31,\\ 49,\\ \\ldots" },
      { label: "c.", math: "1,\\ 6,\\ 15,\\ 28,\\ 45,\\ \\ldots" },
      { label: "d.", math: "2,\\ 5,\\ 9,\\ 14,\\ 20,\\ \\ldots" },
      { label: "e.", math: "3,\\ 9,\\ 18,\\ 30,\\ 45,\\ \\ldots" },
    ],
  },
];

// ─── Locale base path ─────────────────────────────────────────────────────────

const BASE = "practice.polaBilangan.pengertianDanPolaKhusus";

// ─── Card Component ────────────────────────────────────────────────────────────

const QuestionCard = ({ q, i }: { q: QuestionItem; i: number }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const title = t(`${BASE}.${q.titleKey}`);
  const content = q.contentKey ? t(`${BASE}.${q.contentKey}`) : undefined;
  const contentAfterSvg = q.contentAfterSvgKey ? t(`${BASE}.${q.contentAfterSvgKey}`) : undefined;

  return (
    <div
      className="relative rounded-2xl overflow-hidden animate-slide-up"
      style={{ animationDelay: `${i * 0.03}s` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-cyan-900/30 via-slate-900/80 to-purple-900/30" : "from-cyan-50/60 via-white/80 to-purple-50/40"} backdrop-blur`} />
      <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500 rounded-l-2xl" />
      <div className="relative px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center">
              <span className="text-cyan-300 text-xs font-bold">{q.number}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-cyan-400 bg-cyan-500/10 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block mb-2">
              {title}
            </span>
            {content && (
              <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"} whitespace-pre-line leading-relaxed mb-2`}>{content}</p>
            )}
            {q.svgNode && (
              <div className={`my-3 rounded-xl overflow-hidden ${isDark ? "bg-black/25 border-white/5" : "bg-gray-100 border-gray-200"} border px-2 py-3`}>
                {q.svgNode}
              </div>
            )}
            {q.imgSrc && (
              <div className="my-3 rounded-xl overflow-hidden bg-white border border-white/20 flex items-center justify-center p-3">
                <img src={q.imgSrc} alt="Pola gambar" className="max-w-full h-auto" />
              </div>
            )}
            {contentAfterSvg && (
              <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"} whitespace-pre-line leading-relaxed mb-2`}>{contentAfterSvg}</p>
            )}
            {q.type === "mixed" && q.parts && (
              <div className="flex flex-col gap-2 mt-2">
                {q.parts.map((part, pi) => (
                  <div key={pi} className={`flex items-start gap-2 ${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-3 py-2`}>
                    <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{part.label}</span>
                    {part.math ? (
                      <div className={`${isDark ? "text-white" : "text-gray-900"} text-sm overflow-x-auto`}>
                        <InlineMath math={part.math} />
                      </div>
                    ) : (
                      <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} whitespace-pre-line`}>
                        {part.textKey ? t(`${BASE}.${part.textKey}`) : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const PengertianDanPolaKhususPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="flex gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center">
              <Sigma className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-400/60 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h1 className={`font-display text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-gray-900"} text-center mb-1 leading-tight px-2`}
            style={{ textShadow: isDark ? '0 0 20px rgba(255,255,255,0.3)' : 'none' }}>
            {t(`${BASE}.titleLine1`)}
            <br />
            <span className="text-purple-300">{t(`${BASE}.titleLine2`)}</span>
          </h1>
          <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center font-body mb-3`}>Kelas 8 · Pola Bilangan · {t('practice.breadcrumb')}</p>
          <div className={`flex items-center gap-3 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"} border rounded-xl px-5 py-2`}>
            <span className="text-cyan-400 text-xs font-bold">📋 {questions.length} {t('practice.suffixSoal')}</span>
            <span className={`${isDark ? "text-white/30" : "text-gray-400"} text-xs`}>·</span>
            <span className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs`}>UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {questions.map((q, i) => (
            <QuestionCard key={q.number} q={q} i={i} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/pola-bilangan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianDanPolaKhususPage;
