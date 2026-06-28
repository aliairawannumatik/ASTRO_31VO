import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Sigma, Star } from "lucide-react";

// ─── SVG Illustrations ────────────────────────────────────────────────────────

const SvgQ1 = () => {
  const nums = [2, 5, 10, 17, 26];
  const diffs = ["+3", "+5", "+7", "+9", "+11"];
  const bw = 48, bh = 32, gap = 18;
  const step = bw + gap;
  const svgW = 6 + nums.length * step + bw + 6;
  return (
    <svg viewBox={`0 0 ${svgW} 72`} className="w-full max-w-lg mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrQ1" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,1 L6,3.5 L0,6 Z" fill="rgba(167,139,250,0.9)" />
        </marker>
      </defs>
      {nums.map((n, i) => (
        <g key={i}>
          <rect x={6 + i * step} y={14} width={bw} height={bh} rx={7}
            fill="rgba(6,182,212,0.13)" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" />
          <text x={6 + i * step + bw / 2} y={14 + bh / 2 + 1}
            textAnchor="middle" dominantBaseline="middle"
            fill="#67e8f9" fontSize="15" fontWeight="bold" fontFamily="monospace">{n}</text>
        </g>
      ))}
      <rect x={6 + nums.length * step} y={14} width={bw} height={bh} rx={7}
        fill="rgba(251,191,36,0.13)" stroke="rgba(251,191,36,0.6)" strokeWidth="1.5" strokeDasharray="5 2" />
      <text x={6 + nums.length * step + bw / 2} y={14 + bh / 2 + 1}
        textAnchor="middle" dominantBaseline="middle"
        fill="#fbbf24" fontSize="15" fontWeight="bold" fontFamily="monospace">?</text>
      {diffs.map((d, i) => {
        const x1 = 6 + i * step + bw + 2;
        const x2 = 6 + (i + 1) * step - 2;
        const mx = (x1 + x2) / 2;
        return (
          <g key={i}>
            <line x1={x1} y1={14 + bh / 2} x2={x2} y2={14 + bh / 2}
              stroke="rgba(167,139,250,0.85)" strokeWidth="1.5" markerEnd="url(#arrQ1)" />
            <text x={mx} y={11} textAnchor="middle" fill="#c4b5fd" fontSize="9" fontFamily="monospace">{d}</text>
          </g>
        );
      })}
      <text x={svgW / 2} y={64} textAnchor="middle"
        fill="rgba(255,255,255,0.38)" fontSize="9.5" fontFamily="sans-serif">
        Selisih bertambah +2 setiap langkah → beda ke-2 konstan
      </text>
    </svg>
  );
};

const SvgQ3 = () => {
  const bw = 20, bh = 10, hGap = 2, vGap = 2;
  const rowW = 3 * bw + 2 * hGap;
  const rowH = bh + vGap;
  const maxRows = 4;
  const groupGap = 18;
  const svgH = maxRows * rowH + 38;
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
            <text x={gx + rowW / 2} y={bottomY + 26} textAnchor="middle"
              fill="#67e8f9" fontSize="9" fontFamily="monospace">= {rows * 3} bata</text>
          </g>
        );
      })}
    </svg>
  );
};


const SvgQ7 = () => {
  const configs = [
    { n: 1, label: "T\u2081 = 1" },
    { n: 2, label: "T\u2082 = 3" },
    { n: 3, label: "T\u2083 = 6" },
    { n: 4, label: "T\u2084 = 10" },
  ];
  const groupW = 80, svgH = 96, r = 4, sp = 12;
  const svgW = configs.length * groupW + 10;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {configs.map(({ n, label }, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const cy = 44;
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
            <text x={cx} y={svgH - 8} textAnchor="middle"
              fill="#a5b4fc" fontSize="9.5" fontFamily="monospace">{label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const SvgQ8 = () => {
  const configs = [
    { n: 1, label: "1\u00B2 = 1" },
    { n: 2, label: "2\u00B2 = 4" },
    { n: 3, label: "3\u00B2 = 9" },
    { n: 4, label: "4\u00B2 = 16" },
  ];
  const groupW = 82, svgH = 96, r = 4, sp = 12;
  const svgW = configs.length * groupW + 10;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {configs.map(({ n, label }, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const cy = 44;
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
            <text x={cx} y={svgH - 8} textAnchor="middle"
              fill="#67e8f9" fontSize="9.5" fontFamily="monospace">{label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const SvgQ9 = () => {
  const configs = [
    { rows: 1, cols: 2, label: "1\u00D72 = 2" },
    { rows: 2, cols: 3, label: "2\u00D73 = 6" },
    { rows: 3, cols: 4, label: "3\u00D74 = 12" },
    { rows: 4, cols: 5, label: "4\u00D75 = 20" },
  ];
  const groupW = 88, svgH = 100, r = 4, sp = 12;
  const svgW = configs.length * groupW + 10;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-lg mx-auto" xmlns="http://www.w3.org/2000/svg">
      {configs.map(({ rows, cols, label }, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const cy = 44;
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
            <text x={cx} y={svgH - 8} textAnchor="middle"
              fill="#fdba74" fontSize="9.5" fontFamily="monospace">{label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const SvgQ17 = () => {
  const nums = [1, 2, 4, 7, 11, 16, 22];
  const diffs = ["+1", "+2", "+3", "+4", "+5", "+6"];
  const bw = 36, bh = 30, gap = 14;
  const step = bw + gap;
  const svgW = 6 + nums.length * step - gap + 6;
  const svgH = 80;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-lg mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrQ17" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,1 L6,3.5 L0,6 Z" fill="rgba(52,211,153,0.9)" />
        </marker>
      </defs>
      {nums.map((n, i) => (
        <g key={i}>
          <rect x={6 + i * step} y={14} width={bw} height={bh} rx={7}
            fill="rgba(16,185,129,0.13)" stroke="rgba(52,211,153,0.60)" strokeWidth="1.5" />
          <text x={6 + i * step + bw / 2} y={14 + bh / 2 + 1}
            textAnchor="middle" dominantBaseline="middle"
            fill="#6ee7b7" fontSize="13" fontWeight="bold" fontFamily="monospace">{n}</text>
        </g>
      ))}
      {diffs.map((d, i) => {
        const x1 = 6 + i * step + bw + 2;
        const x2 = 6 + (i + 1) * step - 2;
        const mx = (x1 + x2) / 2;
        return (
          <g key={i}>
            <line x1={x1} y1={14 + bh / 2} x2={x2} y2={14 + bh / 2}
              stroke="rgba(52,211,153,0.85)" strokeWidth="1.5" markerEnd="url(#arrQ17)" />
            <text x={mx} y={11} textAnchor="middle"
              fill="#34d399" fontSize="8.5" fontFamily="monospace">{d}</text>
          </g>
        );
      })}
      <text x={svgW / 2} y={svgH - 6} textAnchor="middle"
        fill="rgba(255,255,255,0.38)" fontSize="9" fontFamily="sans-serif">
        Beda: 1, 2, 3, 4, 5, 6 → pola bertingkat (beda ke-2 konstan = 1)
      </text>
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
    title: "Melanjutkan Pola Bilangan",
    content: "Perhatikan barisan bilangan berikut:\n2, 5, 10, 17, 26, ...\nTentukan dua suku berikutnya dari barisan bilangan tersebut dan jelaskan aturan polanya!",
    type: "essay",
    svgNode: <SvgQ1 />,
  },
  {
    number: 2,
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
    number: 3,
    title: "Pola Gambar Susunan Batu Bata",
    content: "Seorang tukang batu menyusun batu bata membentuk pola:\nBaris ke-1: 3 batu bata | Baris ke-2: 6 | Baris ke-3: 9 | Baris ke-4: 12\n\na. Tentukan pola yang terbentuk.\nb. Berapa banyak batu bata pada baris ke-10?\nc. Berapa total batu bata jika ada 8 baris?",
    type: "essay",
    svgNode: <SvgQ3 />,
  },
  {
    number: 4,
    title: "Bilangan Segitiga",
    content: "Bilangan segitiga dibentuk dari susunan titik berbentuk segitiga:",
    type: "mixed",
    svgNode: <SvgQ7 />,
    parts: [
      { label: "Pola:", math: "1,\\ 3,\\ 6,\\ 10,\\ 15,\\ ..." },
      { label: "a.", text: "Jelaskan cara membentuk bilangan segitiga." },
      { label: "b.", text: "Tuliskan rumus bilangan segitiga ke-n." },
      { label: "c.", text: "Tentukan bilangan segitiga ke-10." },
    ],
  },
  {
    number: 5,
    title: "Bilangan Persegi",
    content: "Perhatikan bilangan persegi berikut:",
    type: "mixed",
    svgNode: <SvgQ8 />,
    parts: [
      { label: "Pola:", math: "1,\\ 4,\\ 9,\\ 16,\\ 25,\\ ..." },
      { label: "a.", text: "Nyatakan rumus bilangan persegi ke-n." },
      { label: "b.", text: "Bilangan persegi ke-15 adalah ...." },
      { label: "c.", text: "Apakah 144 merupakan bilangan persegi? Jelaskan!" },
    ],
  },
  {
    number: 6,
    title: "Bilangan Persegi Panjang",
    content: "Bilangan persegi panjang dibentuk dari susunan titik berbentuk persegi panjang:",
    type: "mixed",
    svgNode: <SvgQ9 />,
    parts: [
      { label: "Pola:", math: "2,\\ 6,\\ 12,\\ 20,\\ 30,\\ ..." },
      { label: "a.", text: "Tentukan aturan pola bilangan persegi panjang." },
      { label: "b.", text: "Tuliskan rumus bilangan persegi panjang ke-n." },
      { label: "c.", text: "Hitung bilangan persegi panjang ke-8." },
    ],
  },
  {
    number: 7,
    title: "Soal TKA - Pola Kombinasi",
    content: "Perhatikan barisan: 1, 2, 4, 7, 11, 16, 22, ...\n\na. Tentukan beda antara suku-suku berurutan.\nb. Identifikasi pola beda tersebut.\nc. Tentukan dua suku berikutnya.\nd. Tuliskan rumus umum suku ke-n.",
    type: "essay",
    svgNode: <SvgQ17 />,
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
