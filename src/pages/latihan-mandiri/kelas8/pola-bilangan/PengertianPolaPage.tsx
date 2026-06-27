import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Sigma, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

// ─── SVG Illustrations ────────────────────────────────────────────────────────

/** Soal 1 – Pola persegi: 1×1, 2×2, 3×3 */
const SvgPersegi = () => {
  const sq = 18, gap = 3;
  const groupW = 80;
  const svgW = 3 * groupW + 10;
  const svgH = 88;
  const bottomY = 62;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {[1, 2, 3].map((n, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const gridW = n * sq + (n - 1) * gap;
        const startX = cx - gridW / 2;
        const startY = bottomY - gridW;
        return (
          <g key={gi}>
            {Array.from({ length: n }, (_, row) =>
              Array.from({ length: n }, (_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={startX + col * (sq + gap)}
                  y={startY + row * (sq + gap)}
                  width={sq}
                  height={sq}
                  rx={2}
                  fill="rgba(59,130,246,0.55)"
                  stroke="rgba(96,165,250,0.95)"
                  strokeWidth="1.5"
                />
              ))
            )}
            <text x={cx} y={svgH - 14} textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" fontWeight="600">
              Pola ke-{n}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** Soal BARU – Pola persegi: 1×2, 2×2, 3×2 (pola ke-n = 2n persegi) */
const SvgPersegiDua = () => {
  const sq = 20, gap = 3;
  const groupW = 90;
  const svgW = 3 * groupW + 10;
  const svgH = 90;
  const topY = 10;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {[1, 2, 3].map((n, gi) => {
        const cols = n;
        const rows = 2;
        const cx = 5 + gi * groupW + groupW / 2;
        const gridW = cols * sq + (cols - 1) * gap;
        const gridH = rows * sq + (rows - 1) * gap;
        const startX = cx - gridW / 2;
        const startY = topY;
        return (
          <g key={gi}>
            {Array.from({ length: rows }, (_, row) =>
              Array.from({ length: cols }, (_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={startX + col * (sq + gap)}
                  y={startY + row * (sq + gap)}
                  width={sq}
                  height={sq}
                  rx={2}
                  fill="rgba(96,165,250,0.45)"
                  stroke="rgba(147,197,253,0.9)"
                  strokeWidth="1.5"
                />
              ))
            )}
            <text x={cx} y={topY + gridH + 14} textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" fontWeight="600">
              Pola ke-{n}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** Soal 2 (BARU) – Segitiga berjajar horizontal: 1, 2, 3 segitiga dalam satu baris */
const SvgSegitigaBarisan = () => {
  const W = 34, H = 30;
  const groupW = 100;
  const svgW = 3 * groupW + 10;
  const svgH = 82;
  const baseY = 58;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {[1, 2, 3].map((n, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const totalW = n * W;
        const startX = cx - totalW / 2;
        const lines: [number, number, number, number][] = [];
        for (let k = 0; k < n; k++) {
          const bx = startX + k * W;
          const ax = bx + W / 2;
          // left slant
          lines.push([bx, baseY, ax, baseY - H]);
          // right slant
          lines.push([ax, baseY - H, bx + W, baseY]);
          // base
          lines.push([bx, baseY, bx + W, baseY]);
        }
        return (
          <g key={gi}>
            {lines.map(([x1, y1, x2, y2], li) => (
              <line key={li} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            ))}
            <text x={cx} y={svgH - 10} textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="sans-serif" fontWeight="600">
              Pola ke-{n}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** Soal lama – Pola segitiga batang korek api: 1, 2, 3 segitiga */
const SvgSegitiga = () => {
  const s = 28, h = s * 0.866;
  const groupW = 95;
  const svgW = 3 * groupW + 10;
  const svgH = 72;
  const baseY = svgH - 22;

  const buildLines = (n: number, startX: number): [number, number, number, number][] => {
    const lines: [number, number, number, number][] = [];
    lines.push([startX, baseY, startX + s / 2, baseY - h]);
    lines.push([startX, baseY, startX + s, baseY]);
    lines.push([startX + s, baseY, startX + s / 2, baseY - h]);
    for (let i = 1; i < n; i++) {
      const lx = startX + i * (s / 2);
      if (i % 2 === 1) {
        lines.push([lx, baseY - h, lx + s, baseY - h]);
        lines.push([lx + s, baseY - h, lx + s / 2, baseY]);
      } else {
        lines.push([lx + s / 2, baseY - h, lx + s, baseY]);
        lines.push([lx, baseY, lx + s, baseY]);
      }
    }
    return lines;
  };

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {[1, 2, 3].map((n, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const triWidth = (n + 1) * s / 2;
        const startX = cx - triWidth / 2;
        const lines = buildLines(n, startX);
        return (
          <g key={gi}>
            {lines.map(([x1, y1, x2, y2], li) => (
              <line key={li} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />
            ))}
            <text x={cx} y={svgH - 9} textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="sans-serif" fontWeight="600">
              Pola ke-{n}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** Soal 3 – Pola M (noktah): 5, 9, 13 titik */
const SvgPolaM = () => {
  const W = 16, H = 26;
  const r = 4;
  const groupW = 100;
  const svgW = 3 * groupW + 10;
  const svgH = 84;
  const cy = 36;

  const getMPoints = (n: number, cx: number) => {
    const pts: [number, number][] = [];
    const startX = cx - n * W;
    for (let k = 0; k < n; k++) {
      const bx = startX + 2 * k * W;
      pts.push([bx, cy + H / 2]);
      pts.push([bx, cy - H / 2]);
      pts.push([bx + W, cy + H * 0.1]);
      pts.push([bx + 2 * W, cy - H / 2]);
      if (k === n - 1) pts.push([bx + 2 * W, cy + H / 2]);
    }
    return pts.filter((p, pi, arr) =>
      arr.findIndex(q => Math.abs(q[0] - p[0]) < 0.5 && Math.abs(q[1] - p[1]) < 0.5) === pi
    );
  };

  const getLines = (n: number, cx: number): [number, number, number, number][] => {
    const lines: [number, number, number, number][] = [];
    const startX = cx - n * W;
    for (let k = 0; k < n; k++) {
      const bx = startX + 2 * k * W;
      const BL: [number, number] = [bx, cy + H / 2];
      const TL: [number, number] = [bx, cy - H / 2];
      const V: [number, number] = [bx + W, cy + H * 0.1];
      const TR: [number, number] = [bx + 2 * W, cy - H / 2];
      const BR: [number, number] = [bx + 2 * W, cy + H / 2];
      lines.push([BL[0], BL[1], TL[0], TL[1]]);
      lines.push([TL[0], TL[1], V[0], V[1]]);
      lines.push([V[0], V[1], TR[0], TR[1]]);
      lines.push([TR[0], TR[1], BR[0], BR[1]]);
    }
    return lines;
  };

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {[1, 2, 3].map((n, gi) => {
        const cx = 5 + gi * groupW + groupW / 2;
        const lines = getLines(n, cx);
        const pts = getMPoints(n, cx);
        return (
          <g key={gi}>
            {lines.map(([x1, y1, x2, y2], li) => (
              <line key={li} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(167,139,250,0.55)" strokeWidth="1.6" strokeLinecap="round" />
            ))}
            {pts.map(([px, py], pi) => (
              <circle key={pi} cx={px} cy={py} r={r}
                fill="rgba(109,40,217,0.75)" stroke="#a78bfa" strokeWidth="1.3" />
            ))}
            <text x={cx} y={svgH - 12} textAnchor="middle" fill="#c4b5fd" fontSize="9" fontFamily="sans-serif" fontWeight="600">
              Pola ke-{n}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** Soal 4 – Pola lingkaran (bilangan segitiga): 3, 6, 10 lingkaran */
const SvgLingkaran = () => {
  const r = 6, sp = 15;
  const groupW = 100;
  const svgW = 3 * groupW + 10;
  const svgH = 100;
  const bottomY = 74;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-sm mx-auto" xmlns="http://www.w3.org/2000/svg">
      {[1, 2, 3].map((n, gi) => {
        const rows = n + 1;
        const cx = 5 + gi * groupW + groupW / 2;
        const circles: { cx: number; cy: number }[] = [];
        for (let row = 0; row < rows; row++) {
          const count = row + 1;
          const rowY = bottomY - (rows - 1 - row) * sp;
          const rowStartX = cx - (count - 1) * sp / 2;
          for (let c = 0; c < count; c++) {
            circles.push({ cx: rowStartX + c * sp, cy: rowY });
          }
        }
        return (
          <g key={gi}>
            {circles.map((dot, di) => (
              <circle key={di} cx={dot.cx} cy={dot.cy} r={r}
                fill="rgba(20,184,166,0.18)" stroke="rgba(45,212,191,0.9)" strokeWidth="1.5" />
            ))}
            <text x={cx} y={svgH - 14} textAnchor="middle" fill="#5eead4" fontSize="9" fontFamily="sans-serif" fontWeight="600">
              Pola ke-{n}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

type KunciStep = { label: string; text?: string; math?: string };

type QuestionItem = {
  number: number;
  title?: string;
  content: string;
  type: "essay" | "mixed";
  parts?: { label: string; math?: string; text?: string }[];
  svgNode?: React.ReactNode;
  kunciJawaban?: KunciStep[];
};

const questions: QuestionItem[] = [
  // Soal baru disisipkan → no. 1
  {
    number: 1,
    content: "Perhatikan pola berikut.",
    type: "mixed",
    svgNode: <SvgPersegiDua />,
    parts: [
      { label: "a.", text: "Tuliskan banyaknya persegi pada setiap pola di atas." },
      { label: "b.", text: "Tuliskan aturan pembentukan pola bilangan di atas." },
      { label: "c.", text: "Tentukan banyaknya persegi pada pola ke-25 dan pola ke-50." },
    ],
  },
  // Q2 dari upload → no. 2
  {
    number: 2,
    content: "Perhatikan pola berikut.",
    type: "mixed",
    svgNode: <SvgSegitiga />,
    parts: [
      {
        label: "",
        text: "Yeni menyusun segitiga-segitiga seperti gambar di atas menggunakan batang-batang korek api. Tentukan banyaknya batang korek api untuk menyusun segitiga pada pola ke-15 dan pola ke-30.",
      },
    ],
  },
  // Q4 dari upload → no. 3
  {
    number: 3,
    content: "Perhatikan pola berikut.",
    type: "mixed",
    svgNode: <SvgLingkaran />,
    parts: [
      { label: "a.", text: "Tuliskan banyaknya lingkaran pada setiap pola di atas dalam bentuk barisan bilangan." },
      { label: "b.", text: "Tuliskan aturan pembentukan pola bilangan di atas." },
      { label: "c.", text: "Tentukan banyak lingkaran pada pola ke-20." },
      { label: "d.", text: "Tentukan jumlah noktah dari pola ke-1 sampai dengan pola ke-10." },
    ],
  },
  // Q6 (soal asli no.1) → no. 4
  {
    number: 4,
    title: "Pola Gambar – Susunan Persegi",
    content: "Perhatikan pola berikut.",
    type: "mixed",
    svgNode: <SvgPersegi />,
    parts: [
      { label: "a.", text: "Tuliskan banyaknya persegi pada setiap pola di atas." },
      { label: "b.", text: "Tuliskan aturan pembentukan pola bilangan di atas." },
      { label: "c.", text: "Tentukan banyaknya persegi pada pola ke-25 dan pola ke-50." },
    ],
    kunciJawaban: [
      { label: "a.", text: "Pola ke-1 = 1 persegi, Pola ke-2 = 4 persegi, Pola ke-3 = 9 persegi → Barisan: 1, 4, 9, ..." },
      { label: "b.", math: "U_n = n^2 \\text{ (bilangan kuadrat). Setiap pola ke-}n\\text{ memiliki }n^2\\text{ persegi.}" },
      { label: "c.", math: "U_{25} = 25^2 = 625 \\text{ persegi};\\quad U_{50} = 50^2 = 2.500 \\text{ persegi}" },
    ],
  },
  // Q11 (soal asli no.7) → no. 5
  {
    number: 5,
    title: "Suku yang Hilang",
    content: "Temukan nilai yang tepat untuk menggantikan tanda tanya (?) dalam pola berikut:",
    type: "mixed",
    parts: [
      { label: "a.", math: "3,\\ 7,\\ 11,\\ ?,\\ 19,\\ 23" },
      { label: "b.", math: "2,\\ 4,\\ 8,\\ ?,\\ 32,\\ 64" },
      { label: "c.", math: "100,\\ 95,\\ 88,\\ 79,\\ ?,\\ 55" },
    ],
  },
  // Q12 (soal asli no.9) → no. 6
  {
    number: 6,
    title: "Konfigurasi Objek – Pola Titik",
    content: "Perhatikan susunan titik yang membentuk baris ganjil: 1, 3, 5, 7, ...\na. Tuliskan aturan/pola barisannya.\nb. Berapa banyak titik pada susunan ke-8?\nc. Susunan ke berapa yang memiliki 25 titik?",
    type: "essay",
  },
  // Q13 (soal asli no.14) → no. 7
  {
    number: 7,
    title: "Barisan Bertingkat",
    content: "Barisan bilangan: 1, 3, 7, 13, 21, 31, ...\n\na. Hitung selisih antara suku-suku berurutan (beda tingkat 1).\nb. Hitung selisih dari barisan beda tingkat 1 (beda tingkat 2).\nc. Tentukan suku ke-8 dari barisan tersebut.",
    type: "essay",
  },
  // Q14 (soal asli no.15) → no. 8
  {
    number: 8,
    title: "Soal Kontekstual – Pertumbuhan Tanaman",
    content: "Sebuah tanaman bambu tumbuh mengikuti pola:\nMinggu ke-1: 10 cm | Minggu ke-2: 13 cm | Minggu ke-3: 16 cm | Minggu ke-4: 19 cm\n\na. Identifikasi pola pertumbuhan bambu tersebut.\nb. Berapa tinggi bambu pada minggu ke-10?\nc. Pada minggu ke berapa bambu mencapai tinggi 43 cm?",
    type: "essay",
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

const QuestionCard = ({ q, i }: { q: QuestionItem; i: number }) => {
  const [showKunci, setShowKunci] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden animate-slide-up"
      style={{ animationDelay: `${i * 0.03}s` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
      <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-2xl" />
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
              <div className="my-3 rounded-xl overflow-hidden bg-black/25 border border-white/5 px-2 py-4">
                {q.svgNode}
              </div>
            )}
            {q.type === "mixed" && q.parts && (
              <div className="flex flex-col gap-2 mt-2">
                {q.parts.map((part, pi) => (
                  <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[24px]">{part.label}</span>
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

            {q.kunciJawaban && (
              <div className="mt-3">
                <button
                  onClick={() => setShowKunci(v => !v)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer"
                  style={showKunci
                    ? { color: '#34d399', borderColor: 'rgba(52,211,153,0.5)', background: 'rgba(52,211,153,0.1)' }
                    : { color: '#a78bfa', borderColor: 'rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.08)' }
                  }
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {showKunci ? 'Sembunyikan Kunci' : 'Lihat Kunci Jawaban'}
                  {showKunci ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {showKunci && (
                  <div className="mt-2 rounded-xl border border-emerald-500/25 bg-emerald-950/30 px-4 py-3 flex flex-col gap-2">
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">✅ Kunci Jawaban</p>
                    {q.kunciJawaban.map((step, si) => (
                      <div key={si} className="flex items-start gap-2">
                        {step.label && (
                          <span className="text-emerald-300 text-xs font-bold shrink-0 min-w-[52px]">{step.label}</span>
                        )}
                        {step.math ? (
                          <div className="text-white/90 text-sm overflow-x-auto">
                            <InlineMath math={step.math} />
                          </div>
                        ) : (
                          <p className="font-body text-sm text-white/80 whitespace-pre-line">{step.text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const PengertianPolaPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <Sigma className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            PENGERTIAN POLA DAN BARISAN BILANGAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Pola Bilangan · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
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
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianPolaPage;
