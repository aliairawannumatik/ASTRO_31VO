import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import CoordPlane from "../koordinat-cartesius/CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Persamaan dari Dua Titik", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui pasangan titik berikut:",
    parts: [
      { label: "a.", math: "A(1,\\ 4) \\text{ dan } B(3,\\ 8)" },
      { label: "b.", math: "C(-2,\\ 3) \\text{ dan } D(4,\\ 0)" },
      { label: "c.", math: "E(0,\\ -5) \\text{ dan } F(5,\\ 5)" },
    ],
  }),

  Q(2, "Persamaan dari Gradien dan Satu Titik", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui titik P dan memiliki gradien m:",
    parts: [
      { label: "a.", math: "P(2,\\ 5),\\ m = 3" },
      { label: "b.", math: "P(-1,\\ 4),\\ m = -2" },
      { label: "c.", math: "P(0,\\ -3),\\ m = \\tfrac{1}{2}" },
      { label: "d.", math: "P(4,\\ -1),\\ m = -\\tfrac{3}{4}" },
    ],
  }),

  Q(3, "Mengubah Bentuk Persamaan Garis", {
    type: "mixed",
    content: "Ubah setiap persamaan ke bentuk y = mx + c:",
    parts: [
      { label: "a.", math: "3x + y = 9" },
      { label: "b.", math: "4x - 2y = 8" },
      { label: "c.", math: "5x + 3y - 15 = 0" },
      { label: "d.", math: "-2x - y + 6 = 0" },
    ],
  }),

  Q(4, "Persamaan Garis Sejajar", {
    type: "mixed",
    content: "Tentukan persamaan garis yang sejajar dengan garis yang diberikan dan melalui titik yang ditentukan:",
    parts: [
      { label: "a.", math: "y = 2x + 3 \\text{ melalui } (1,\\ 7)" },
      { label: "b.", math: "y = -3x + 1 \\text{ melalui } (-2,\\ 8)" },
      { label: "c.", math: "3x - y = 5 \\text{ melalui } (0,\\ -4)" },
    ],
  }),

  Q(5, "Persamaan Garis Tegak Lurus", {
    type: "mixed",
    content: "Tentukan persamaan garis yang tegak lurus dengan garis yang diberikan dan melalui titik yang ditentukan:",
    parts: [
      { label: "a.", math: "y = 4x - 2 \\text{ melalui } (4,\\ 3)" },
      { label: "b.", math: "y = -\\tfrac{1}{2}x + 5 \\text{ melalui } (-1,\\ 6)" },
      { label: "c.", math: "x + 3y = 9 \\text{ melalui } (3,\\ -2)" },
    ],
  }),

  Q(6, "Persamaan dari Gradien Nol atau Tak Terdefinisi", {
    type: "mixed",
    content: "Tentukan persamaan garis yang:",
    parts: [
      { label: "a.", text: "Sejajar sumbu-x dan melalui titik (3, −5)." },
      { label: "b.", text: "Sejajar sumbu-y dan melalui titik (7, 2)." },
      { label: "c.", text: "Sejajar sumbu-x dan melalui titik (−4, 0)." },
      { label: "d.", text: "Sejajar sumbu-y dan melalui titik (0, 6)." },
    ],
  }),

  Q(7, "Persamaan dari Dua Titik Negatif", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui:",
    parts: [
      { label: "a.", math: "P(-3,\\ -1) \\text{ dan } Q(-1,\\ 5)" },
      { label: "b.", math: "R(-5,\\ 4) \\text{ dan } S(-1,\\ -4)" },
      { label: "c.", math: "A(-2,\\ -3) \\text{ dan } B(-6,\\ -11)" },
    ],
  }),

  Q(8, "Persamaan Garis dari Dua Persamaan Lain", {
    type: "mixed",
    content: "Garis g sejajar dengan garis y = 2x − 5 dan melalui titik perpotongan garis y = 3 dan x = 1.",
    parts: [
      { label: "a.", text: "Tentukan titik perpotongan y = 3 dan x = 1." },
      { label: "b.", text: "Tentukan gradien garis g." },
      { label: "c.", text: "Tentukan persamaan garis g." },
    ],
  }),

  Q(9, "Persamaan dari Kondisi Soal UN 2020", {
    type: "mixed",
    content: "Garis g melalui titik A(3, 7) dan tegak lurus dengan garis y = −½x + 4.",
    parts: [
      { label: "a.", text: "Tentukan gradien garis g." },
      { label: "b.", text: "Tentukan persamaan garis g." },
      { label: "c.", text: "Tentukan titik potong garis g dengan sumbu-x." },
    ],
  }),

  Q(10, "Persamaan dari Titik dan Gradien Pecahan", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui titik P dan memiliki gradien m:",
    parts: [
      { label: "a.", math: "P(6,\\ -2),\\ m = \\tfrac{2}{3}" },
      { label: "b.", math: "P(-4,\\ 5),\\ m = -\\tfrac{5}{4}" },
      { label: "c.", math: "P(10,\\ 0),\\ m = \\tfrac{1}{5}" },
    ],
  }),

  Q(11, "Persamaan Garis Sejajar Melalui Titik Sumbu", {
    type: "mixed",
    content: "Garis ℓ sejajar dengan y = 3x − 2. Tentukan persamaan ℓ jika:",
    parts: [
      { label: "a.", text: "ℓ melalui titik (0, 5)." },
      { label: "b.", text: "ℓ memotong sumbu-y di (0, −4)." },
      { label: "c.", math: "\\ell \\text{ melalui titik } (-1,\\ 2)." },
    ],
  }),

  Q(12, "Menentukan Persamaan dari Kondisi Titik", {
    type: "mixed",
    content: "Garis h melalui titik (−2, 3) dan titik potong dari garis y = 2x + 5 dan y = −x + 2.",
    parts: [
      { label: "a.", text: "Tentukan titik potong garis y = 2x + 5 dan y = −x + 2 secara aljabar." },
      { label: "b.", text: "Gunakan titik potong dan titik (−2, 3) untuk menentukan gradien h." },
      { label: "c.", text: "Tentukan persamaan garis h." },
    ],
  }),

  Q(13, "Persamaan Garis Tegak Lurus dan Titik Perpotongan", {
    type: "mixed",
    content: "Dua garis tegak lurus. Garis pertama: y = 2x + 1. Garis kedua melalui (0, 5).",
    parts: [
      { label: "a.", text: "Tentukan gradien garis kedua." },
      { label: "b.", text: "Tentukan persamaan garis kedua." },
      { label: "c.", text: "Tentukan titik perpotongan kedua garis." },
    ],
  }),

  Q(14, "Persamaan Garis Gabungan", {
    type: "mixed",
    content: "Tentukan persamaan setiap garis:",
    parts: [
      { label: "a.", text: "Melalui titik (0, 0) dan tegak lurus dengan 2x + y = 5." },
      { label: "b.", text: "Sejajar dengan x − 3y = 6 dan melalui titik (−3, 2)." },
      { label: "c.", text: "Tegak lurus dengan x = 4 dan melalui titik (1, 5)." },
    ],
  }),

  Q(15, "Persamaan Garis Melalui Tiga Titik", {
    type: "mixed",
    content: "Tiga buah titik diketahui: P(0, 4), Q(2, k), R(4, 12).",
    parts: [
      { label: "a.", text: "Jika ketiga titik segaris, tentukan nilai k." },
      { label: "b.", text: "Tentukan persamaan garis yang melalui ketiganya." },
      { label: "c.", math: "\\text{Tentukan nilai } y \\text{ saat } x = 6." },
    ],
  }),
];

const MenentukanPGLPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-green-400 text-xs font-body">15 Soal Latihan</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            MENENTUKAN PERSAMAAN GARIS LURUS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Persamaan Garis Lurus · UN / TKA / ANBK</p>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-900/20 via-slate-900/40 to-teal-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className="text-green-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
                  {q.content && (
                    <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                  )}
                  {q.math && (
                    <div className="text-white/90 text-sm mt-1"><InlineMath math={q.math} /></div>
                  )}
                </div>
              </div>

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
                      <span className="text-green-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{p.label}</span>
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
            ← Kembali ke Persamaan Garis Lurus
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenentukanPGLPage;
