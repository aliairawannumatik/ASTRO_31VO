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
  const sq = 14, gap = 2;
  const groupW = 70;
  const svgW = 3 * groupW + 10;
  const svgH = 76;
  const bottomY = 55;
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
                <rect key={`${row}-${col}`}
                  x={startX + col * (sq + gap)} y={startY + row * (sq + gap)}
                  width={sq} height={sq} rx={2}
                  fill="rgba(59,130,246,0.38)" stroke="rgba(96,165,250,0.9)" strokeWidth="1.2" />
              ))
            )}
            <text x={cx} y={svgH - 13} textAnchor="middle" fill="#93c5fd" fontSize="8.5" fontFamily="sans-serif">Pola ke-{n}</text>
            <text x={cx} y={svgH - 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7.5" fontFamily="monospace">= {n * n} persegi</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Soal 2 – Pola segitiga batang korek api: 1, 2, 3 segitiga */
const SvgSegitiga = () => {
  const s = 26, h = s * 0.866;
  const groupW = 88;
  const svgW = 3 * groupW + 10;
  const svgH = 68;
  const baseY = svgH - 24;

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
        const batang = 2 * n + 1;
        return (
          <g key={gi}>
            {lines.map(([x1, y1, x2, y2], li) => (
              <line key={li} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            ))}
            <text x={cx} y={svgH - 12} textAnchor="middle" fill="#fcd34d" fontSize="8.5" fontFamily="sans-serif">Pola ke-{n}</text>
            <text x={cx} y={svgH - 1} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7.5" fontFamily="monospace">= {batang} batang</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Soal 3 – Pola M (noktah): 5, 9, 13 titik */
const SvgPolaM = () => {
  const w = 13, h = 22;
  const r = 3.5;
  const groupW = 95;
  const svgW = 3 * groupW + 10;
  const svgH = 80;
  const cy = 34;

  const getMPoints = (n: number, cx: number) => {
    const pts: [number, number][] = [];
    const startX = cx - n * w;
    for (let k = 0; k < n; k++) {
      const bx = startX + 2 * k * w;
      pts.push([bx, cy + h / 2]);
      pts.push([bx, cy - h / 2]);
      pts.push([bx + w, cy + h * 0.12]);
      pts.push([bx + 2 * w, cy - h / 2]);
      if (k === n - 1) pts.push([bx + 2 * w, cy + h / 2]);
    }
    return pts.filter((p, pi, arr) =>
      arr.findIndex(q => Math.abs(q[0] - p[0]) < 0.1 && Math.abs(q[1] - p[1]) < 0.1) === pi
    );
  };

  const getLines = (n: number, cx: number): [number, number, number, number][] => {
    const lines: [number, number, number, number][] = [];
    const startX = cx - n * w;
    for (let k = 0; k < n; k++) {
      const bx = startX + 2 * k * w;
      const BL: [number, number] = [bx, cy + h / 2];
      const TL: [number, number] = [bx, cy - h / 2];
      const V: [number, number] = [bx + w, cy + h * 0.12];
      const TR: [number, number] = [bx + 2 * w, cy - h / 2];
      const BR: [number, number] = [bx + 2 * w, cy + h / 2];
      lines.push([BL[0], BL[1], TL[0], TL[1]]);
      lines.push([TL[0], TL[1], V[0], V[1]]);
      lines.push([V[0], V[1], TR[0], TR[1]]);
      lines.push([TR[0], TR[1], BR[0], BR[1]]);
    }
    return lines;
  };

  const dotCount = (n: number) => 4 * n + 1;

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
                stroke="rgba(167,139,250,0.6)" strokeWidth="1.4" strokeLinecap="round" />
            ))}
            {pts.map(([px, py], pi) => (
              <circle key={pi} cx={px} cy={py} r={r}
                fill="rgba(139,92,246,0.7)" stroke="#a78bfa" strokeWidth="1" />
            ))}
            <text x={cx} y={svgH - 13} textAnchor="middle" fill="#c4b5fd" fontSize="8.5" fontFamily="sans-serif">Pola ke-{n}</text>
            <text x={cx} y={svgH - 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7.5" fontFamily="monospace">= {dotCount(n)} noktah</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Soal 4 – Pola lingkaran (susunan segitiga): 3, 6, 10 lingkaran */
const SvgLingkaran = () => {
  const r = 5, sp = 13;
  const groupW = 90;
  const svgW = 3 * groupW + 10;
  const svgH = 92;
  const bottomY = 68;

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
        const total = (n + 1) * (n + 2) / 2;
        return (
          <g key={gi}>
            {circles.map((dot, di) => (
              <circle key={di} cx={dot.cx} cy={dot.cy} r={r}
                fill="rgba(20,184,166,0.28)" stroke="rgba(45,212,191,0.85)" strokeWidth="1.3" />
            ))}
            <text x={cx} y={svgH - 13} textAnchor="middle" fill="#5eead4" fontSize="8.5" fontFamily="sans-serif">Pola ke-{n}</text>
            <text x={cx} y={svgH - 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7.5" fontFamily="monospace">= {total} lingkaran</text>
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
  title: string;
  content: string;
  type: "essay" | "mixed";
  parts?: { label: string; math?: string; text?: string }[];
  svgNode?: React.ReactNode;
  kunciJawaban?: KunciStep[];
};

const questions: QuestionItem[] = [
  // ── 5 Soal dari Lembar Kerja ──────────────────────────────────────────────
  {
    number: 1,
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
      { label: "b.", math: "U_n = n^2 \\text{ (bilangan persegi/kuadrat). Setiap pola ke-}n\\text{ memiliki }n^2\\text{ persegi.}" },
      { label: "c.", math: "U_{25} = 25^2 = 625 \\text{ persegi};\\quad U_{50} = 50^2 = 2.500 \\text{ persegi}" },
    ],
  },
  {
    number: 2,
    title: "Pola Gambar – Susunan Segitiga (Batang Korek Api)",
    content: "Perhatikan pola berikut.",
    type: "mixed",
    svgNode: <SvgSegitiga />,
    parts: [
      { label: "", text: "Yeni menyusun segitiga-segitiga seperti gambar di atas menggunakan batang-batang korek api. Tentukan banyaknya batang korek api untuk menyusun segitiga pada pola ke-15 dan pola ke-30." },
    ],
    kunciJawaban: [
      { label: "Pola:", text: "Pola ke-1 = 3 batang, Pola ke-2 = 5 batang, Pola ke-3 = 7 batang → beda = +2 setiap pola." },
      { label: "Rumus:", math: "U_n = 2n + 1" },
      { label: "Pola ke-15:", math: "U_{15} = 2(15) + 1 = 31 \\text{ batang korek api}" },
      { label: "Pola ke-30:", math: "U_{30} = 2(30) + 1 = 61 \\text{ batang korek api}" },
    ],
  },
  {
    number: 3,
    title: "Pola Gambar – Susunan Noktah (Bentuk M)",
    content: "Perhatikan pola berikut.",
    type: "mixed",
    svgNode: <SvgPolaM />,
    parts: [
      { label: "a.", text: "Tuliskan banyaknya noktah pada setiap pola tersebut dalam bentuk deret bilangan." },
      { label: "b.", text: "Tuliskan aturan pembentukan pola bilangan tersebut." },
      { label: "c.", text: "Tentukan banyak noktah pada pola ke-100." },
      { label: "d.", text: "Tentukan jumlah noktah dari pola ke-1 sampai pola ke-10." },
    ],
    kunciJawaban: [
      { label: "a.", text: "Barisan noktah: 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, ..." },
      { label: "b.", math: "U_n = 4n + 1 \\text{ (setiap pola bertambah 4 noktah; beda tetap = 4)}" },
      { label: "c.", math: "U_{100} = 4(100) + 1 = 401 \\text{ noktah}" },
      { label: "d.", math: "S_{10} = \\sum_{n=1}^{10}(4n+1) = 5+9+13+17+21+25+29+33+37+41 = 230 \\text{ noktah}" },
    ],
  },
  {
    number: 4,
    title: "Pola Gambar – Susunan Lingkaran",
    content: "Perhatikan pola berikut.",
    type: "mixed",
    svgNode: <SvgLingkaran />,
    parts: [
      { label: "a.", text: "Tuliskan banyaknya lingkaran pada setiap pola di atas dalam bentuk barisan bilangan." },
      { label: "b.", text: "Tuliskan aturan pembentukan pola bilangan di atas." },
      { label: "c.", text: "Tentukan banyak lingkaran pada pola ke-20." },
      { label: "d.", text: "Tentukan jumlah lingkaran dari pola ke-1 sampai dengan pola ke-10." },
    ],
    kunciJawaban: [
      { label: "a.", text: "Barisan lingkaran: 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, ... (bilangan segitiga mulai T₂)" },
      { label: "b.", math: "U_n = \\frac{(n+1)(n+2)}{2} \\text{ (merupakan bilangan segitiga ke-}(n+1)\\text{)}" },
      { label: "c.", math: "U_{20} = \\frac{(21)(22)}{2} = \\frac{462}{2} = 231 \\text{ lingkaran}" },
      { label: "d.", math: "\\text{Jumlah} = 3+6+10+15+21+28+36+45+55+66 = 285 \\text{ lingkaran}" },
    ],
  },
  {
    number: 5,
    title: "Melanjutkan Barisan Bilangan",
    content: "Tentukan 3 suku berikutnya dari pola bilangan berikut.",
    type: "mixed",
    parts: [
      { label: "a.", math: "0,\\ 3,\\ 6,\\ 9,\\ \\ldots" },
      { label: "b.", math: "1,\\ 5,\\ 9,\\ 13,\\ \\ldots" },
    ],
    kunciJawaban: [
      { label: "a.", math: "0,\\ 3,\\ 6,\\ 9,\\ \\underbrace{12,\\ 15,\\ 18}_{\\text{3 suku berikutnya}} \\quad (\\text{beda} = +3,\\ U_n = 3(n-1))" },
      { label: "b.", math: "1,\\ 5,\\ 9,\\ 13,\\ \\underbrace{17,\\ 21,\\ 25}_{\\text{3 suku berikutnya}} \\quad (\\text{beda} = +4,\\ U_n = 4n - 3)" },
    ],
  },
  // ── Soal Lanjutan ─────────────────────────────────────────────────────────
  {
    number: 6,
    title: "Melanjutkan Pola Bilangan",
    content: "Perhatikan barisan bilangan berikut:\n2, 5, 10, 17, 26, ...\nTentukan dua suku berikutnya dari barisan bilangan tersebut dan jelaskan aturan polanya!",
    type: "essay",
  },
  {
    number: 7,
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
    number: 8,
    title: "Pola Gambar Susunan Batu Bata",
    content: "Seorang tukang batu menyusun batu bata membentuk pola:\nBaris ke-1: 3 batu bata | Baris ke-2: 6 | Baris ke-3: 9 | Baris ke-4: 12\n\na. Tentukan pola yang terbentuk.\nb. Berapa banyak batu bata pada baris ke-10?\nc. Berapa total batu bata jika ada 8 baris?",
    type: "essay",
  },
  {
    number: 9,
    title: "Konfigurasi Objek – Pola Titik",
    content: "Perhatikan susunan titik yang membentuk baris ganjil: 1, 3, 5, 7, ...\na. Tuliskan aturan/pola barisannya.\nb. Berapa banyak titik pada susunan ke-8?\nc. Susunan ke berapa yang memiliki 25 titik?",
    type: "essay",
  },
  {
    number: 10,
    title: "Menentukan Suku ke-n",
    content: "Diketahui barisan bilangan: 4, 9, 16, 25, 36, ...",
    type: "mixed",
    parts: [
      { label: "a.", text: "Jelaskan pola dari barisan bilangan di atas." },
      { label: "b.", text: "Tuliskan rumus suku ke-n dari barisan tersebut." },
      { label: "c.", text: "Tentukan nilai suku ke-12." },
    ],
  },
  {
    number: 11,
    title: "Barisan Bilangan Genap",
    content: "Barisan bilangan genap positif: 2, 4, 6, 8, 10, ...\n\na. Nyatakan suku ke-n barisan tersebut.\nb. Suku ke-25 barisan tersebut adalah ....\nc. Bilangan 84 merupakan suku ke berapa?",
    type: "essay",
  },
  {
    number: 12,
    title: "Pola dari Tabel",
    content: "Perhatikan tabel konfigurasi berikut:",
    type: "mixed",
    parts: [
      { label: "n =", math: "1 \\quad 2 \\quad 3 \\quad 4 \\quad 5" },
      { label: "U_n =", math: "5 \\quad 8 \\quad 11 \\quad 14 \\quad 17" },
      { label: "", text: "a. Tentukan aturan polanya.\nb. Tuliskan rumus suku ke-n.\nc. Hitung nilai suku ke-20." },
    ],
  },
  {
    number: 13,
    title: "Pola Bilangan Positif dan Negatif",
    content: "Perhatikan barisan berikut:\n−20, −15, −10, −5, 0, 5, 10, ...\n\na. Jelaskan pola barisannya.\nb. Tentukan suku ke-15.\nc. Suku ke berapa yang nilainya 40?",
    type: "essay",
  },
  {
    number: 14,
    title: "Barisan Bertingkat",
    content: "Barisan bilangan: 1, 3, 7, 13, 21, 31, ...\n\na. Hitung selisih antara suku-suku berurutan (beda tingkat 1).\nb. Hitung selisih dari barisan beda tingkat 1 (beda tingkat 2).\nc. Tentukan suku ke-8 dari barisan tersebut.",
    type: "essay",
  },
  {
    number: 15,
    title: "Soal Kontekstual – Pertumbuhan Tanaman",
    content: "Sebuah tanaman bambu tumbuh mengikuti pola:\nMinggu ke-1: 10 cm | Minggu ke-2: 13 cm | Minggu ke-3: 16 cm | Minggu ke-4: 19 cm\n\na. Identifikasi pola pertumbuhan bambu tersebut.\nb. Berapa tinggi bambu pada minggu ke-10?\nc. Pada minggu ke berapa bambu mencapai tinggi 43 cm?",
    type: "essay",
  },
  {
    number: 16,
    title: "Pola Barisan Fibonacci",
    content: "Barisan Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21, ...\n\na. Jelaskan aturan pembentukan barisan Fibonacci.\nb. Tuliskan 4 suku berikutnya dari barisan tersebut.\nc. Berapa nilai suku ke-14 dari barisan Fibonacci?",
    type: "essay",
  },
  {
    number: 17,
    title: "Soal ANBK – Evaluasi Pernyataan",
    content: "Perhatikan barisan: 5, 15, 45, 135, ...\nTentukan pernyataan yang BENAR (B) atau SALAH (S) dan berikan alasannya:",
    type: "mixed",
    parts: [
      { label: "(1)", text: "Setiap suku berikutnya diperoleh dengan mengalikan suku sebelumnya dengan 3." },
      { label: "(2)", text: "Selisih antara dua suku berurutan selalu tetap." },
      { label: "(3)", text: "Suku ke-6 dari barisan tersebut adalah 3.645." },
      { label: "(4)", text: "Suku ke-5 dari barisan tersebut adalah 405." },
    ],
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
              <div className="my-3 rounded-xl overflow-hidden bg-black/25 border border-white/5 px-2 py-3">
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
