import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import CoordPlane from "../koordinat-cartesius/CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type TableCol = { x: number | string; y: number | string };
type TableSpec = { equation: string; cols: TableCol[] };
type Choice = { label: string; math: string };
type DiagramChoice = { label: string; diagram: Diagram };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  table?: TableSpec; choices?: Choice[];
  diagramChoices?: DiagramChoice[];
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Grafik y = x + 2", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 2, label: "(0,2)", color: "#f472b6", labelPos: "tr" },
        { x: -2, y: 0, label: "(-2,0)", color: "#f472b6", labelPos: "tl" },
      ],
      segs: [{ x1: -5, y1: -3, x2: 4, y2: 6, color: "#f472b6", label: "y=x+2" }],
    },
    parts: [
      { label: "a.", math: "\\text{Tentukan titik potong garis } y = x + 2 \\text{ dengan sumbu-x dan sumbu-y.}" },
      { label: "b.", text: "Sketsa grafik garis tersebut." },
      { label: "c.", text: "Apakah titik (3, 5) terletak pada garis ini? Buktikan!" },
    ],
  }),

  Q(2, "Grafik y = −3x + 6", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 6, label: "(0,6)", color: "#34d399", labelPos: "tr" },
        { x: 2, y: 0, label: "(2,0)", color: "#34d399", labelPos: "top" },
      ],
      segs: [{ x1: -0.5, y1: 7.5, x2: 4, y2: -6, color: "#34d399", label: "y=−3x+6" }],
    },
    parts: [
      { label: "a.", text: "Tentukan titik potong garis dengan sumbu-x." },
      { label: "b.", text: "Tentukan titik potong garis dengan sumbu-y." },
      { label: "c.", text: "Ke arah mana garis bergerak? Naik atau turun dari kiri ke kanan?" },
    ],
  }),

  Q(3, "Grafik Persamaan Umum ax + by = c", {
    type: "mixed",
    content: "Gambar grafik persamaan garis berikut menggunakan dua titik:",
    parts: [
      { label: "a.", math: "3x + 2y = 12" },
      { label: "b.", math: "x - 4y = 8" },
      { label: "c.", math: "5x + y = 10" },
    ],
  }),

  Q(4, "Grafik dari Tabel Nilai x — y = 2x − 1", {
    type: "mixed",
    content: "Lengkapi tabel nilai y berikut untuk persamaan garis y = 2x − 1, lalu gambarlah grafiknya pada bidang kartesius di bawah.",
    table: {
      equation: "y = 2x - 1",
      cols: [
        { x: -2, y: "…" },
        { x: -1, y: "…" },
        { x: 0,  y: "…" },
        { x: 1,  y: "…" },
        { x: 2,  y: "…" },
      ],
    },
    diagram: { size: 220, range: 6 },
    parts: [
      { label: "a.", text: "Lengkapi nilai y pada tabel dengan mensubstitusikan setiap nilai x ke persamaan." },
      { label: "b.", text: "Gambarkan titik-titik (x, y) hasil tabel pada bidang kartesius di atas." },
      { label: "c.", text: "Hubungkan titik-titik tersebut menjadi sebuah garis lurus." },
    ],
  }),

  Q(5, "Grafik dari Tabel Nilai x — y = −x + 3", {
    type: "mixed",
    content: "Lengkapi tabel nilai y berikut untuk persamaan garis y = −x + 3, lalu gambarlah grafiknya pada bidang kartesius di bawah.",
    table: {
      equation: "y = -x + 3",
      cols: [
        { x: -1, y: "…" },
        { x: 0,  y: "…" },
        { x: 1,  y: "…" },
        { x: 2,  y: "…" },
        { x: 3,  y: "…" },
      ],
    },
    diagram: { size: 220, range: 6 },
    parts: [
      { label: "a.", text: "Lengkapi nilai y pada tabel dengan mensubstitusikan setiap nilai x ke persamaan." },
      { label: "b.", text: "Gambarkan titik-titik (x, y) hasil tabel pada bidang kartesius di atas." },
      { label: "c.", text: "Hubungkan titik-titik tersebut menjadi sebuah garis lurus." },
    ],
  }),

  Q(6, "Menggambar Garis dengan Titik Potong Sumbu — 2x + y = 4", {
    type: "mixed",
    content: "Lengkapi tabel berikut dengan mencari titik potong sumbu-y (saat x = 0) dan titik potong sumbu-x (saat y = 0) dari persamaan 2x + y = 4, lalu gambarlah garisnya.",
    table: {
      equation: "2x + y = 4",
      cols: [
        { x: 0,   y: "…" },
        { x: "…", y: 0   },
      ],
    },
    diagram: { size: 220, range: 6 },
    parts: [
      { label: "a.", text: "Substitusikan x = 0 ke persamaan untuk mencari nilai y (titik potong sumbu-y)." },
      { label: "b.", text: "Substitusikan y = 0 ke persamaan untuk mencari nilai x (titik potong sumbu-x)." },
      { label: "c.", text: "Gambarkan kedua titik tersebut lalu hubungkan menjadi sebuah garis lurus." },
    ],
  }),

  Q(7, "Menggambar Garis dengan Titik Potong Sumbu — 3x − 2y = 12", {
    type: "mixed",
    content: "Lengkapi tabel berikut dengan mencari titik potong sumbu-y (saat x = 0) dan titik potong sumbu-x (saat y = 0) dari persamaan 3x − 2y = 12, lalu gambarlah garisnya.",
    table: {
      equation: "3x - 2y = 12",
      cols: [
        { x: 0,   y: "…" },
        { x: "…", y: 0   },
      ],
    },
    diagram: { size: 220, range: 6 },
    parts: [
      { label: "a.", text: "Substitusikan x = 0 ke persamaan untuk mencari nilai y (titik potong sumbu-y)." },
      { label: "b.", text: "Substitusikan y = 0 ke persamaan untuk mencari nilai x (titik potong sumbu-x)." },
      { label: "c.", text: "Gambarkan kedua titik tersebut lalu hubungkan menjadi sebuah garis lurus." },
    ],
  }),

  Q(8, "Pilih Persamaan yang Sesuai dengan Grafik", {
    type: "mixed",
    content: "Perhatikan grafik garis berikut. Manakah persamaan garis yang tepat menggambarkan grafik tersebut?",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -5, y1: -3, x2: 3, y2: 5, color: "#818cf8" }],
      pts: [
        { x: 0, y: 2, label: "(0,2)", color: "#818cf8", labelPos: "tr" },
        { x: 2, y: 4, label: "(2,4)", color: "#818cf8", labelPos: "top" },
      ],
    },
    choices: [
      { label: "A.", math: "y = x + 2" },
      { label: "B.", math: "y = 2x + 1" },
      { label: "C.", math: "y = -x + 2" },
      { label: "D.", math: "y = x - 2" },
    ],
    parts: [
      { label: "Petunjuk:", text: "Hitung gradien garis menggunakan kedua titik pada grafik, lalu cocokkan dengan titik potong sumbu-y untuk menentukan persamaan yang tepat." },
    ],
  }),

  Q(9, "Diketahui Persamaan Garis, Pilih Grafik yang Tepat", {
    type: "mixed",
    content: "Diketahui persamaan garis y = 2x − 4. Manakah grafik di bawah ini yang tepat menggambarkan persamaan garis tersebut?",
    diagramChoices: [
      {
        label: "A.",
        diagram: {
          size: 150, range: 5,
          segs: [{ x1: -1, y1: -6, x2: 4, y2: 4, color: "#4ade80" }],
          pts: [
            { x: 0, y: -4, label: "(0,-4)", color: "#4ade80", labelPos: "bot" },
            { x: 2, y: 0, label: "(2,0)", color: "#4ade80", labelPos: "top" },
          ],
        },
      },
      {
        label: "B.",
        diagram: {
          size: 150, range: 5,
          segs: [{ x1: -4, y1: 4, x2: 4, y2: -4, color: "#f87171" }],
          pts: [
            { x: 0, y: 0, label: "(0,0)", color: "#f87171", labelPos: "top" },
          ],
        },
      },
      {
        label: "C.",
        diagram: {
          size: 150, range: 5,
          segs: [{ x1: -3, y1: -1, x2: 3, y2: 3, color: "#f87171" }],
          pts: [
            { x: 0, y: 1, label: "(0,1)", color: "#f87171", labelPos: "top" },
            { x: -2, y: -3, label: "(-2,-3)", color: "#f87171", labelPos: "bl" },
          ],
        },
      },
      {
        label: "D.",
        diagram: {
          size: 150, range: 5,
          segs: [{ x1: -2, y1: 4, x2: 4, y2: -4, color: "#f87171" }],
          pts: [
            { x: 0, y: 4, label: "(0,4)", color: "#f87171", labelPos: "top" },
            { x: 2, y: 0, label: "(2,0)", color: "#f87171", labelPos: "bot" },
          ],
        },
      },
    ],
    parts: [
      { label: "Petunjuk:", text: "Substitusikan x = 0 dan y = 0 ke persamaan y = 2x − 4 untuk menemukan titik potong sumbu-y dan sumbu-x, lalu cocokkan dengan grafik yang benar." },
    ],
  }),
];

const GrafikPGLPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-pink-400 text-xs font-body">{questions.length} {t('practice.suffixSoal')} Latihan</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            GRAFIK PERSAMAAN GARIS LURUS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Persamaan Garis Lurus · UN / TKA / ANBK</p>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-900/20 via-slate-900/40 to-purple-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className="text-pink-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
                  {q.content && (
                    <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                  )}
                  {q.math && (
                    <div className="text-white/90 text-sm mt-1"><InlineMath math={q.math} /></div>
                  )}
                </div>
              </div>

              {q.table && (
                <div className="flex justify-center my-4 overflow-x-auto">
                  <table className="border-collapse text-xs md:text-sm bg-white rounded-lg overflow-hidden shadow-md">
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 bg-pink-50 text-slate-700 font-bold px-3 py-1.5 text-center">x</td>
                        {q.table.cols.map((c, i) => (
                          <td key={i} className="border border-slate-300 text-slate-800 px-3 py-1.5 text-center min-w-[36px]">{c.x}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-slate-300 bg-pink-50 text-slate-700 font-bold px-3 py-1.5 text-center">y</td>
                        {q.table.cols.map((c, i) => (
                          <td key={i} className="border border-slate-300 text-slate-800 px-3 py-1.5 text-center min-w-[36px]">{c.y}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {q.diagram && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-lg">
                    <CoordPlane {...q.diagram} lightBg />
                  </div>
                </div>
              )}

              {q.choices && (
                <div className="flex flex-col gap-1.5 mt-2 mb-1 pl-2">
                  {q.choices.map((c, ci) => (
                    <div key={ci} className="flex items-center gap-2">
                      <span className="text-pink-400 text-xs font-body font-bold shrink-0 min-w-[20px]">{c.label}</span>
                      <div className="text-white/85 text-sm"><InlineMath math={c.math} /></div>
                    </div>
                  ))}
                </div>
              )}

              {q.diagramChoices && (
                <div className="grid grid-cols-2 gap-3 mt-3 mb-1">
                  {q.diagramChoices.map((dc, dci) => (
                    <div key={dci} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-2">
                      <span className="text-pink-400 text-xs font-body font-bold self-start pl-1">{dc.label}</span>
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <CoordPlane {...dc.diagram} lightBg />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((p, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className="text-pink-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{p.label}</span>
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

export default GrafikPGLPage;
