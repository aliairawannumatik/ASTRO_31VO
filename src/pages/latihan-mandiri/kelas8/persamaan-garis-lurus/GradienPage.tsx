import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import CoordPlane from "../koordinat-cartesius/CoordPlane";

/* ── Grid chart (white background, no axes) ────────────────── */
const CELL = 20;
const GCOLS = 11;
const GROWS = 11;
const GW = GCOLS * CELL;
const GH = GROWS * CELL;

const GridLineChart = ({
  x1, y1, x2, y2, color = "#60a5fa",
}: { x1: number; y1: number; x2: number; y2: number; color?: string }) => {
  const sx = x1 * CELL, sy = y1 * CELL;
  const ex = x2 * CELL, ey = y2 * CELL;
  const mathDx = x2 - x1;
  const mathDy = y1 - y2;           // positive = up visually
  const goingUp = sy > ey;          // SVG: smaller y = higher
  const cornerX = ex, cornerY = sy; // right-angle at bottom-right (or top-right)
  const dxMidX = (sx + ex) / 2;
  const dxLabelY = goingUp ? sy + 15 : sy - 7;
  const dyLabelX = ex + 7;
  const dyMidY = (sy + ey) / 2 + 4;
  return (
    <svg width={GW} height={GH} className="rounded-xl shadow-md" style={{ border: "1.5px solid #e2e8f0" }}>
      <rect width={GW} height={GH} fill="#ffffff" rx="10" />
      {Array.from({ length: GCOLS + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={GH} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {Array.from({ length: GROWS + 1 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * CELL} x2={GW} y2={i * CELL} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {/* Helper triangle */}
      <line x1={sx} y1={sy} x2={cornerX} y2={cornerY} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5,3" />
      <line x1={cornerX} y1={cornerY} x2={ex} y2={ey} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5,3" />
      {/* Main line */}
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      {/* Endpoints */}
      <circle cx={sx} cy={sy} r={5} fill={color} stroke="white" strokeWidth="1.5" />
      <circle cx={ex} cy={ey} r={5} fill={color} stroke="white" strokeWidth="1.5" />
      {/* Δx label */}
      <text x={dxMidX} y={dxLabelY} textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="700">
        {`Δx = ${mathDx}`}
      </text>
      {/* Δy label */}
      <text x={dyLabelX} y={dyMidY} textAnchor="start" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="700">
        {`Δy = ${mathDy > 0 ? "+" : ""}${mathDy}`}
      </text>
    </svg>
  );
};

/* ── Types ─────────────────────────────────────────────────── */
type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type GridLine = { x1: number; y1: number; x2: number; y2: number; color?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  diagram?: Diagram;
  gridLine?: GridLine;
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

/* ── Questions ─────────────────────────────────────────────── */
const questions: Q[] = [
  /* ── 4 soal baru: baca gradien dari grid kotak-kotak ─── */
  Q(1, "Baca Gradien dari Grid — Garis Naik (1)", {
    type: "mixed",
    content: "Perhatikan garis pada grid kotak-kotak di bawah ini (setiap kotak = 1 satuan). Garis bergerak ke kanan atas.",
    gridLine: { x1: 2, y1: 9, x2: 8, y2: 3, color: "#60a5fa" },
    parts: [
      { label: "a.", text: "Hitung Δx = berapa kotak garis bergerak ke kanan?" },
      { label: "b.", text: "Hitung Δy = berapa kotak garis bergerak ke atas? (atas = positif)" },
      { label: "c.", math: "\\text{Hitung gradien } m = \\dfrac{\\Delta y}{\\Delta x}" },
    ],
  }),

  Q(2, "Baca Gradien dari Grid — Garis Naik (2)", {
    type: "mixed",
    content: "Perhatikan garis pada grid kotak-kotak di bawah ini. Garis bergerak ke kanan atas lebih curam.",
    gridLine: { x1: 3, y1: 10, x2: 7, y2: 2, color: "#34d399" },
    parts: [
      { label: "a.", text: "Hitung Δx = berapa kotak garis bergerak ke kanan?" },
      { label: "b.", text: "Hitung Δy = berapa kotak garis bergerak ke atas?" },
      { label: "c.", math: "\\text{Hitung gradien } m = \\dfrac{\\Delta y}{\\Delta x}" },
    ],
  }),

  Q(3, "Baca Gradien dari Grid — Garis Turun (1)", {
    type: "mixed",
    content: "Perhatikan garis pada grid kotak-kotak di bawah ini. Garis bergerak ke kanan bawah.",
    gridLine: { x1: 2, y1: 2, x2: 8, y2: 8, color: "#f472b6" },
    parts: [
      { label: "a.", text: "Hitung Δx = berapa kotak garis bergerak ke kanan?" },
      { label: "b.", text: "Hitung Δy = berapa kotak garis bergerak ke bawah? (bawah = negatif)" },
      { label: "c.", math: "\\text{Hitung gradien } m = \\dfrac{\\Delta y}{\\Delta x}" },
    ],
  }),

  Q(4, "Baca Gradien dari Grid — Garis Turun (2)", {
    type: "mixed",
    content: "Perhatikan garis pada grid kotak-kotak di bawah ini. Garis bergerak ke kanan bawah lebih landai.",
    gridLine: { x1: 1, y1: 2, x2: 9, y2: 6, color: "#fb923c" },
    parts: [
      { label: "a.", text: "Hitung Δx = berapa kotak garis bergerak ke kanan?" },
      { label: "b.", text: "Hitung Δy = berapa kotak garis bergerak ke bawah?" },
      { label: "c.", math: "\\text{Hitung gradien } m = \\dfrac{\\Delta y}{\\Delta x}" },
    ],
  }),

  /* ── Soal lama (renomor 5–24) ──────────────────────────── */
  Q(5, "Gradien dari Dua Titik", {
    type: "mixed",
    content: "Hitung gradien garis yang melalui pasangan titik berikut:",
    parts: [
      { label: "a.", math: "A(1,\\ 3) \\text{ dan } B(4,\\ 9)" },
      { label: "b.", math: "C(-2,\\ 5) \\text{ dan } D(3,\\ 0)" },
      { label: "c.", math: "E(0,\\ -4) \\text{ dan } F(6,\\ 2)" },
      { label: "d.", math: "G(-3,\\ -1) \\text{ dan } H(5,\\ -5)" },
    ],
  }),

  Q(6, "Gradien dari Persamaan y = mx + c", {
    type: "mixed",
    content: "Tentukan gradien dari setiap persamaan garis berikut:",
    parts: [
      { label: "a.", math: "y = 5x - 3" },
      { label: "b.", math: "y = -\\tfrac{3}{4}x + 7" },
      { label: "c.", math: "y = \\tfrac{2}{5}x" },
      { label: "d.", math: "y = -6x + 1" },
      { label: "e.", math: "y = 9" },
    ],
  }),

  Q(7, "Gradien dari Bentuk Umum ax + by = c", {
    type: "mixed",
    content: "Ubah ke bentuk y = mx + c lalu tentukan gradiennya:",
    parts: [
      { label: "a.", math: "2x + 4y = 12" },
      { label: "b.", math: "3x - y = 9" },
      { label: "c.", math: "5x + 2y = 10" },
      { label: "d.", math: "-x + 3y = 6" },
    ],
  }),

  Q(8, "Gradien dari Grafik Menggunakan Segitiga", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: 0, y1: 1, x2: 4, y2: 5, color: "#60a5fa", label: "g" },
        { x1: 0, y1: 1, x2: 4, y2: 1, color: "#facc15", dashed: true },
        { x1: 4, y1: 1, x2: 4, y2: 5, color: "#f472b6", dashed: true },
      ],
      pts: [
        { x: 0, y: 1, label: "A(0,1)", color: "#60a5fa", labelPos: "tl" },
        { x: 4, y: 5, label: "B(4,5)", color: "#60a5fa", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 2, y: 0.2, text: "Δx = 4", color: "#facc15", size: 10 },
        { x: 4.5, y: 3, text: "Δy = 4", color: "#f472b6", size: 10 },
      ],
    },
    parts: [
      { label: "a.", math: "\\text{Hitung } \\Delta x = x_B - x_A" },
      { label: "b.", math: "\\text{Hitung } \\Delta y = y_B - y_A" },
      { label: "c.", math: "\\text{Hitung gradien } m = \\frac{\\Delta y}{\\Delta x}" },
    ],
  }),

  Q(9, "Gradien Garis Tegak dan Datar", {
    type: "mixed",
    diagram: {
      size: 260, range: 5,
      segs: [
        { x1: -4.5, y1: 3, x2: 4.5, y2: 3, color: "#facc15", label: "y=3" },
        { x1: 2, y1: -4.5, x2: 2, y2: 4.5, color: "#a78bfa", label: "x=2" },
      ],
    },
    parts: [
      { label: "a.", text: "Berapa gradien garis y = 3? Mengapa?" },
      { label: "b.", text: "Berapa gradien garis x = 2? Mengapa?" },
      { label: "c.", text: "Apa yang terjadi saat kita membagi Δy/Δx untuk garis vertikal?" },
    ],
  }),

  Q(10, "Mencari Koordinat dari Gradien", {
    type: "mixed",
    content: "Gradien garis yang melalui titik P(2, k) dan Q(6, 10) adalah 2. Tentukan nilai k.",
    parts: [
      { label: "a.", math: "\\text{Gunakan rumus } m = \\frac{y_2 - y_1}{x_2 - x_1}" },
      { label: "b.", text: "Substitusikan nilai yang diketahui dan selesaikan untuk k." },
      { label: "c.", text: "Verifikasi jawaban dengan menghitung ulang gradiennya." },
    ],
  }),

  Q(11, "Perbandingan Gradien Dua Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -5, y1: -5, x2: 5, y2: 5, color: "#f472b6", label: "m=1" },
        { x1: -3, y1: -6, x2: 3, y2: 6, color: "#60a5fa", label: "m=2" },
        { x1: -5, y1: -2.5, x2: 5, y2: 2.5, color: "#34d399", label: "m=½" },
      ],
    },
    parts: [
      { label: "a.", text: "Mana garis yang paling curam? Mengapa?" },
      { label: "b.", text: "Mana garis yang paling landai? Mengapa?" },
      { label: "c.", text: "Apa hubungan antara nilai gradien dan kecuraman garis?" },
    ],
  }),

  Q(12, "Gradien dari Titik Potong Sumbu", {
    type: "mixed",
    content: "Garis memotong sumbu-x di titik (a, 0) dan sumbu-y di titik (0, b). Gunakan kedua titik ini untuk mencari gradien:",
    parts: [
      { label: "a.", math: "\\text{Titik potong: } (4,\\ 0) \\text{ dan } (0,\\ 8)" },
      { label: "b.", math: "\\text{Titik potong: } (-6,\\ 0) \\text{ dan } (0,\\ 3)" },
      { label: "c.", math: "\\text{Titik potong: } (5,\\ 0) \\text{ dan } (0,\\ -10)" },
    ],
  }),

  Q(13, "UN 2018 — Nilai Gradien", {
    type: "mixed",
    content: "Persamaan garis adalah 3x + 4y − 24 = 0.",
    parts: [
      { label: "a.", math: "\\text{Ubah ke bentuk } y = mx + c." },
      { label: "b.", text: "Tentukan gradien, titik potong sumbu-x, dan sumbu-y." },
      { label: "c.", text: "Gambar grafiknya dengan menandai titik-titik penting." },
    ],
  }),

  Q(14, "Hubungan Gradien Garis Naik dan Turun", {
    type: "mixed",
    content: "Tentukan sifat gradien (positif/negatif/nol/tak terdefinisi) dari setiap deskripsi garis:",
    parts: [
      { label: "a.", text: "Garis yang naik dari kiri ke kanan." },
      { label: "b.", text: "Garis yang turun dari kiri ke kanan." },
      { label: "c.", text: "Garis yang sejajar dengan sumbu-x." },
      { label: "d.", text: "Garis yang tegak lurus dengan sumbu-x." },
    ],
  }),

  Q(15, "Gradien Garis y = mx (Melalui O)", {
    type: "mixed",
    diagram: {
      size: 260, range: 5,
      segs: [
        { x1: -4, y1: -8, x2: 2, y2: 4, color: "#f87171", label: "y=2x" },
        { x1: -4, y1: 4, x2: 4, y2: -4, color: "#60a5fa", label: "y=−x" },
      ],
      pts: [{ x: 0, y: 0, label: "O", color: "var(--text-primary)", labelPos: "br" }],
    },
    parts: [
      { label: "a.", text: "Tentukan gradien garis y = 2x." },
      { label: "b.", text: "Tentukan gradien garis y = −x." },
      { label: "c.", math: "\\text{Untuk garis } y = mx \\text{, gradiennya adalah } \\ldots" },
    ],
  }),

  Q(16, "Mencari Nilai yang Tidak Diketahui dari Gradien", {
    type: "mixed",
    content: "Tentukan nilai yang belum diketahui:",
    parts: [
      { label: "a.", math: "\\text{Garis melalui } (3,\\ k) \\text{ dan } (7,\\ 16) \\text{ memiliki } m = 3." },
      { label: "b.", math: "\\text{Garis melalui } (-2,\\ 5) \\text{ dan } (p,\\ -7) \\text{ memiliki } m = -4." },
      { label: "c.", math: "\\text{Garis melalui } (a,\\ 3) \\text{ dan } (2a,\\ 9) \\text{ memiliki } m = 2." },
    ],
  }),

  Q(17, "Gradien Garis Paralel", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -5, y1: -3, x2: 3, y2: 5, color: "#f472b6", label: "ℓ₁" },
        { x1: -5, y1: -6, x2: 3, y2: 2, color: "#60a5fa", label: "ℓ₂" },
      ],
    },
    parts: [
      { label: "a.", text: "Apakah kedua garis tampak sejajar? Apa cirinya?" },
      { label: "b.", text: "Hitung gradien masing-masing garis." },
      { label: "c.", text: "Apa hubungan gradien dua garis yang sejajar?" },
    ],
  }),

  Q(18, "Gradien Garis Tegak Lurus", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -4, y1: -2, x2: 4, y2: 6, color: "#34d399", label: "ℓ₁: m=1" },
        { x1: -2, y1: 6, x2: 6, y2: -2, color: "#fb923c", label: "ℓ₂: m=−1" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung gradien ℓ₁ dan ℓ₂." },
      { label: "b.", math: "\\text{Hitung } m_1 \\times m_2. \\text{ Berapa hasilnya?}" },
      { label: "c.", text: "Apa syarat dua garis saling tegak lurus dalam hal gradien?" },
    ],
  }),

  Q(19, "Gradien Garis pada Trapesium", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: -4, y: -2, label: "A", color: "#f472b6", labelPos: "bl" },
        { x: 4, y: -2, label: "B", color: "#60a5fa", labelPos: "br" },
        { x: 2, y: 3, label: "C", color: "#34d399", labelPos: "tr" },
        { x: -2, y: 3, label: "D", color: "#facc15", labelPos: "tl" },
      ],
      segs: [
        { x1: -4, y1: -2, x2: 4, y2: -2, color: "#f472b6" },
        { x1: -4, y1: -2, x2: -2, y2: 3, color: "#facc15" },
        { x1: 4, y1: -2, x2: 2, y2: 3, color: "#60a5fa" },
        { x1: -2, y1: 3, x2: 2, y2: 3, color: "#34d399" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung gradien sisi AD (dari A ke D)." },
      { label: "b.", text: "Hitung gradien sisi BC (dari B ke C)." },
      { label: "c.", text: "Apa yang dapat kamu simpulkan dari nilai kedua gradien tersebut?" },
    ],
  }),

  Q(20, "Gradien dari Bentuk Pecahan", {
    type: "mixed",
    content: "Tentukan gradien dari persamaan-persamaan berikut:",
    parts: [
      { label: "a.", math: "\\frac{x}{3} + \\frac{y}{4} = 1" },
      { label: "b.", math: "\\frac{2x-4}{3} = y + 1" },
      { label: "c.", math: "\\frac{y-5}{x+2} = 3" },
    ],
  }),

  Q(21, "Membuktikan Titik Segaris", {
    type: "mixed",
    content: "Buktikan apakah tiga titik berikut terletak pada satu garis lurus (segaris):",
    parts: [
      { label: "a.", math: "A(1,\\ 2),\\ B(3,\\ 6),\\ C(5,\\ 10)" },
      { label: "b.", math: "P(-2,\\ 1),\\ Q(0,\\ 4),\\ R(2,\\ 8)" },
      { label: "Petunjuk:", text: "Hitung gradien AB dan BC. Jika sama, ketiga titik segaris." },
    ],
  }),

  Q(22, "UN 2021 — Soal Gradien Terapan", {
    type: "mixed",
    content: "Sebuah jalan menanjak membentuk garis lurus. Jika ujung bawah jalan ada di koordinat (0, 10) dan ujung atas di (50, 40):",
    parts: [
      { label: "a.", text: "Berapa gradien kemiringan jalan tersebut?" },
      { label: "b.", text: "Artinya, setiap 10 meter horizontal, jalan naik berapa meter?" },
    ],
  }),

  Q(23, "Gradien dari Persamaan Non-Standar", {
    type: "mixed",
    content: "Tentukan gradien dari setiap persamaan:",
    parts: [
      { label: "a.", math: "y - 3 = 4(x - 1)" },
      { label: "b.", math: "y + 2 = -\\tfrac{1}{2}(x - 4)" },
      { label: "c.", math: "y - 5 = 0" },
    ],
  }),

  Q(24, "Tantangan — Gradien Segitiga", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: -3, y: -3, label: "P(−3,−3)", color: "#f472b6", labelPos: "bl" },
        { x: 5, y: 1, label: "Q(5,1)", color: "#60a5fa", labelPos: "br" },
        { x: 1, y: 5, label: "R(1,5)", color: "#34d399", labelPos: "top" },
      ],
      segs: [
        { x1: -3, y1: -3, x2: 5, y2: 1, color: "#f472b6" },
        { x1: 5, y1: 1, x2: 1, y2: 5, color: "#60a5fa" },
        { x1: 1, y1: 5, x2: -3, y2: -3, color: "#34d399" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung gradien sisi PQ." },
      { label: "b.", text: "Hitung gradien sisi QR." },
      { label: "c.", text: "Hitung gradien sisi PR." },
      { label: "d.", text: "Apakah ada dua sisi yang tegak lurus? Periksa dengan m₁ × m₂ = −1." },
    ],
  }),
];

/* ── Page ───────────────────────────────────────────────────── */
const GradienPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-blue-400 text-xs font-body">{questions.length} {t('practice.suffixSoal')} Latihan</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            GRADIEN (KEMIRINGAN GARIS)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Persamaan Garis Lurus · UN / TKA / ANBK</p>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-900/20 via-slate-900/40 to-cyan-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className="text-blue-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
                  {q.content && (
                    <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                  )}
                  {q.math && (
                    <div className="text-white/90 text-sm mt-1"><InlineMath math={q.math} /></div>
                  )}
                </div>
              </div>

              {/* Grid chart (white, no axes) */}
              {q.gridLine && (
                <div className="flex justify-center my-4">
                  <GridLineChart {...q.gridLine} />
                </div>
              )}

              {/* CoordPlane (dark, with axes) */}
              {q.diagram && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-lg">
                    <CoordPlane {...q.diagram} />
                  </div>
                </div>
              )}

              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((p, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className="text-blue-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{p.label}</span>
                      <div className="text-white/75 text-sm font-body leading-relaxed">
                        {p.math ? <InlineMath math={p.math} /> : <span>{p.text}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Persamaan Garis Lurus
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradienPage;
