import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Sigma, Star } from "lucide-react";

// ─── SVG Illustrations ────────────────────────────────────────────────────────

const SvgPolaGambar1 = () => {
  const sq = 22, gap = 3;
  const svgH = 96, svgW = 310;
  const bottomY = 68;
  // Pola ke-1: 1×1, Pola ke-2: 1col×2rows, Pola ke-3: 3col×2rows
  const configs = [
    { cols: 1, rows: 1, label: "Pola ke-1", cx: 45 },
    { cols: 1, rows: 2, label: "Pola ke-2", cx: 140 },
    { cols: 3, rows: 2, label: "Pola ke-3", cx: 245 },
  ];
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {configs.map(({ cols, rows, label, cx }, gi) => {
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
              fill="#7dd3fc" fontSize="9" fontFamily="sans-serif">{label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// Pola ke-1: 1 segitiga, Pola ke-2: 3 segitiga (2 atas + 1 terbalik via garis horizontal di puncak),
// Pola ke-3: 5 segitiga (3 atas + 2 terbalik)
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

        // Base segments (shared bottom line)
        for (let i = 0; i < count; i++) {
          lines.push(
            <line key={`base${i}`}
              x1={sx + i * triBase} y1={byY}
              x2={sx + (i + 1) * triBase} y2={byY}
              stroke={stroke} strokeWidth="2" />
          );
        }

        // Left and right sides of each upward triangle
        for (let i = 0; i < count; i++) {
          const bx = sx + i * triBase;
          const px = sx + (i + 0.5) * triBase;
          lines.push(
            <line key={`L${i}`} x1={bx} y1={byY} x2={px} y2={peakY} stroke={stroke} strokeWidth="2" />,
            <line key={`R${i}`} x1={px} y1={peakY} x2={bx + triBase} y2={byY} stroke={stroke} strokeWidth="2" />
          );
        }

        // Horizontal lines at peak level connecting adjacent peaks → forms inverted triangles
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


const SvgQ7 = () => {
  const configs = [
    { n: 1 },
    { n: 2 },
    { n: 3 },
    { n: 4 },
  ];
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
        return (
          <g key={gi}>
            {dots}
          </g>
        );
      })}
    </svg>
  );
};

const SvgQ8 = () => {
  const configs = [
    { n: 1 },
    { n: 2 },
    { n: 3 },
    { n: 4 },
  ];
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
        return (
          <g key={gi}>
            {dots}
          </g>
        );
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
        return (
          <g key={gi}>
            {dots}
          </g>
        );
      })}
    </svg>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

type QuestionItem = {
  number: number;
  title: string;
  content: string;
  type: "essay" | "mixed";
  parts?: { label: string; math?: string; text?: string }[];
  svgNode?: React.ReactNode;
};

const questions: QuestionItem[] = [
  {
    number: 1,
    title: "Pola Gambar Persegi",
    content: "Perhatikan pola berikut.",
    type: "mixed",
    svgNode: <SvgPolaGambar1 />,
    parts: [
      { label: "a.", text: "Tuliskan banyaknya persegi pada setiap pola di atas." },
      { label: "b.", text: "Tuliskan aturan pembentukan pola bilangan di atas." },
      { label: "c.", text: "Tentukan banyaknya persegi pada pola ke-25 dan pola ke-50." },
    ],
  },
  {
    number: 2,
    title: "Pola Gambar Segitiga Korek Api",
    content: "Perhatikan pola berikut.\n\nYeni menyusun segitiga-segitiga seperti gambar di atas menggunakan batang-batang korek api. Tentukan banyaknya batang korek api untuk menyusun segitiga pada pola ke-15 dan pola ke-30.",
    type: "essay",
    svgNode: <SvgPolaGambar2 />,
  },
  {
    number: 3,
    title: "Suku yang Hilang",
    content: "Temukan nilai yang tepat untuk menggantikan tanda tanya (?) dalam pola berikut:",
    type: "mixed",
    parts: [
      { label: "a.", math: "3,\\ 7,\\ 11,\\ ?,\\ 19,\\ 23" },
      { label: "b.", math: "2,\\ 4,\\ 8,\\ ?,\\ 32,\\ 64" },
      { label: "c.", math: "100,\\ 95,\\ 88,\\ 79,\\ ?,\\ 55" },
    ],
  },
  {
    number: 4,
    title: "Pola Gambar Susunan Batu Bata",
    content: "Seorang tukang batu menyusun batu bata membentuk pola seperti gambar berikut.",
    type: "mixed",
    svgNode: <SvgQ3 />,
    parts: [
      { label: "a.", text: "Tentukan pola yang terbentuk." },
      { label: "b.", text: "Berapa banyak batu bata pada baris ke-10?" },
    ],
  },
  {
    number: 5,
    title: "Bilangan Segitiga",
    content: "Bilangan segitiga dibentuk dari susunan titik berbentuk segitiga:",
    type: "mixed",
    svgNode: <SvgQ7 />,
    parts: [
      { label: "Pola:", math: "1,\\ 3,\\ 6,\\ 10,\\ 15,\\ ..." },
      { label: "a.", text: "Tuliskan rumus bilangan segitiga ke-n." },
      { label: "b.", text: "Tentukan bilangan segitiga ke-10." },
    ],
  },
  {
    number: 6,
    title: "Bilangan Persegi",
    content: "Perhatikan bilangan persegi berikut:",
    type: "mixed",
    svgNode: <SvgQ8 />,
    parts: [
      { label: "Pola:", math: "1,\\ 4,\\ 9,\\ 16,\\ 25,\\ ..." },
      { label: "a.", text: "Nyatakan rumus bilangan persegi ke-n." },
      { label: "b.", text: "Bilangan persegi ke-15 adalah ...." },
    ],
  },
  {
    number: 7,
    title: "Bilangan Persegi Panjang",
    content: "Bilangan persegi panjang dibentuk dari susunan titik berbentuk persegi panjang:",
    type: "mixed",
    svgNode: <SvgQ9 />,
    parts: [
      { label: "Pola:", math: "2,\\ 6,\\ 12,\\ 20,\\ 30,\\ ..." },
      { label: "a.", text: "Tuliskan rumus bilangan persegi panjang ke-n." },
      { label: "b.", text: "Hitung bilangan persegi panjang ke-8." },
    ],
  },
  {
    number: 8,
    title: "Menghitung Suku dengan Rumus Umum",
    content: "Diketahui rumus suku ke-n dari suatu barisan bilangan. Hitunglah nilai suku ke-10 dan suku ke-100 untuk masing-masing barisan berikut:",
    type: "mixed",
    parts: [
      { label: "a.", math: "U_n = n(n + 2)" },
      { label: "b.", math: "U_n = 2n(n - 1)" },
      { label: "c.", math: "U_n = 2n^2 - 1" },
    ],
  },
  {
    number: 9,
    title: "Rumus Suku ke-n dan Suku ke-100",
    content: "Tentukan rumus suku ke-n dan hitunglah suku ke-100 dari barisan bilangan berikut.\n(n ∈ {1, 2, 3, 4, 5, . . .})",
    type: "mixed",
    parts: [
      { label: "a.", math: "1,\\ 4,\\ 9,\\ 16,\\ 25,\\ \\ldots" },
      { label: "b.", math: "0,\\ 3,\\ 8,\\ 15,\\ 24,\\ \\ldots" },
      { label: "c.", math: "1,\\ 7,\\ 17,\\ 31,\\ 49,\\ \\ldots" },
      { label: "d.", math: "1,\\ 6,\\ 15,\\ 28,\\ 45,\\ \\ldots" },
      { label: "e.", math: "2,\\ 5,\\ 9,\\ 14,\\ 20,\\ \\ldots" },
      { label: "f.", math: "3,\\ 9,\\ 18,\\ 30,\\ 45,\\ \\ldots" },
    ],
  },
];

// ─── Card Component ────────────────────────────────────────────────────────────

const QuestionCard = ({ q, i }: { q: QuestionItem; i: number }) => (
  <div
    className="relative rounded-2xl overflow-hidden animate-slide-up"
    style={{ animationDelay: `${i * 0.03}s` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
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
          {q.title && (
            <span className="text-cyan-400 bg-cyan-500/10 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block mb-2">
              {q.title}
            </span>
          )}
          {q.content && (
            <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-2">{q.content}</p>
          )}
          {q.svgNode && (
            <div className="my-3 rounded-xl overflow-hidden bg-black/25 border border-white/5 px-2 py-3">
              {q.svgNode}
            </div>
          )}
          {q.type === "mixed" && q.parts && (
            <div className="flex flex-col gap-2 mt-2">
              {q.parts.map((part, pi) => (
                <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{part.label}</span>
                  {part.math ? (
                    <div className="text-white text-sm overflow-x-auto">
                      <InlineMath math={part.math} />
                    </div>
                  ) : (
                    <p className="font-body text-sm text-white/80 whitespace-pre-line">{part.text}</p>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const PengertianDanPolaKhususPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          <h1 className="font-display text-lg md:text-xl font-bold text-white text-center mb-1 leading-tight px-2"
            style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            PENGERTIAN POLA, BARISAN BILANGAN
            <br />
            <span className="text-purple-300">DAN POLA-POLA KHUSUS</span>
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Kelas 8 · Pola Bilangan · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 {questions.length} {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
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
