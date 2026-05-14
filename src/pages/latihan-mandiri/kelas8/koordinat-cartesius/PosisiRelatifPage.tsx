import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Navigation } from "lucide-react";
import CoordPlane from "./CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Posisi Titik terhadap Sumbu-x", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 3, y: 4, label: "A(3,4)", color: "#f472b6", labelPos: "tr" },
        { x: -2, y: -3, label: "B(−2,−3)", color: "#60a5fa", labelPos: "bl" },
        { x: 5, y: 0, label: "C(5,0)", color: "#facc15", labelPos: "top" },
        { x: -4, y: 2, label: "D(−4,2)", color: "#34d399", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada DI ATAS sumbu-x?" },
      { label: "b.", text: "Titik mana yang berada DI BAWAH sumbu-x?" },
      { label: "c.", text: "Titik mana yang berada PADA sumbu-x?" },
      { label: "d.", text: "Apa syarat koordinat untuk titik di atas sumbu-x?" },
    ],
  }),

  Qn(2, "Posisi Titik terhadap Sumbu-y", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 4, y: 2, label: "P(4,2)", color: "#f472b6", labelPos: "tr" },
        { x: -3, y: 5, label: "Q(−3,5)", color: "#fb923c", labelPos: "tl" },
        { x: 0, y: -4, label: "R(0,−4)", color: "#facc15", labelPos: "tr" },
        { x: -2, y: -2, label: "S(−2,−2)", color: "#a78bfa", labelPos: "bl" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada di sebelah KANAN sumbu-y?" },
      { label: "b.", text: "Titik mana yang berada di sebelah KIRI sumbu-y?" },
      { label: "c.", text: "Titik mana yang berada PADA sumbu-y?" },
      { label: "d.", text: "Apa syarat koordinat untuk titik di sebelah kiri sumbu-y?" },
    ],
  }),

  Qn(3, "Posisi terhadap Garis y = 3", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [{ x1: -6.5, y1: 3, x2: 6.5, y2: 3, color: "#facc15", label: "y = 3" }],
      pts: [
        { x: 4, y: 5, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -3, y: 1, label: "B", color: "#60a5fa", labelPos: "tl" },
        { x: 2, y: 3, label: "C", color: "#34d399", labelPos: "top" },
        { x: -5, y: 6, label: "D", color: "#fb923c", labelPos: "tl" },
        { x: 1, y: -2, label: "E", color: "#a78bfa", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada di ATAS garis y = 3?" },
      { label: "b.", text: "Titik mana yang berada di BAWAH garis y = 3?" },
      { label: "c.", text: "Titik mana yang berada PADA garis y = 3?" },
      { label: "d.", text: "Apa syarat ordinat untuk titik di atas garis y = 3?" },
    ],
  }),

  Qn(4, "Posisi terhadap Garis x = −2", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [{ x1: -2, y1: -6.5, x2: -2, y2: 6.5, color: "#a78bfa", label: "x=−2" }],
      pts: [
        { x: 3, y: 4, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -5, y: 2, label: "B", color: "#60a5fa", labelPos: "tl" },
        { x: -2, y: -3, label: "C", color: "#34d399", labelPos: "tr" },
        { x: 1, y: -4, label: "D", color: "#facc15", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada di KANAN garis x = −2?" },
      { label: "b.", text: "Titik mana yang berada di KIRI garis x = −2?" },
      { label: "c.", text: "Titik mana yang berada PADA garis x = −2?" },
      { label: "d.", text: "Apa syarat absis untuk titik di kanan garis x = −2?" },
    ],
  }),

  Qn(5, "Menentukan Posisi Relatif Kelompok Titik", {
    type: "mixed",
    content: "Tentukan posisi setiap titik terhadap garis y = 4 (di atas, di bawah, atau pada):",
    parts: [
      { label: "a.", math: "A(2,\\ 7)" },
      { label: "b.", math: "B(-3,\\ 4)" },
      { label: "c.", math: "C(5,\\ 1)" },
      { label: "d.", math: "D(-1,\\ -2)" },
      { label: "e.", math: "E(0,\\ 4)" },
      { label: "f.", math: "F(8,\\ 10)" },
    ],
  }),

  Qn(6, "Menentukan Posisi terhadap Garis x = 5", {
    type: "mixed",
    content: "Tentukan posisi setiap titik terhadap garis x = 5 (di kanan, di kiri, atau pada):",
    parts: [
      { label: "a.", math: "A(8,\\ 3)" },
      { label: "b.", math: "B(5,\\ -2)" },
      { label: "c.", math: "C(2,\\ 7)" },
      { label: "d.", math: "D(-4,\\ 1)" },
      { label: "e.", math: "E(5,\\ 0)" },
      { label: "f.", math: "F(11,\\ -5)" },
    ],
  }),

  Qn(7, "Posisi Relatif terhadap Dua Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -6.5, y1: 2, x2: 6.5, y2: 2, color: "#facc15", label: "y=2" },
        { x1: -1, y1: -6.5, x2: -1, y2: 6.5, color: "#a78bfa", label: "x=−1" },
      ],
      pts: [
        { x: 3, y: 5, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -4, y: 4, label: "B", color: "#fb923c", labelPos: "tl" },
        { x: -3, y: -2, label: "C", color: "#34d399", labelPos: "bl" },
        { x: 4, y: -3, label: "D", color: "#60a5fa", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan posisi setiap titik terhadap garis y = 2 (atas/bawah/pada)." },
      { label: "b.", text: "Tentukan posisi setiap titik terhadap garis x = −1 (kanan/kiri/pada)." },
      { label: "c.", text: "Titik mana yang berada di atas y = 2 DAN di kanan x = −1?" },
    ],
  }),

  Qn(8, "Titik pada Garis — Persamaan Garis Lurus", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -3, y1: -4, x2: 4, y2: 10, color: "#facc15" }],
      pts: [
        { x: 0, y: 2, label: "A(0,2)", color: "#f472b6", labelPos: "tl" },
        { x: 1, y: 4, label: "B(1,4)", color: "#60a5fa", labelPos: "tr" },
        { x: 2, y: 5, label: "C(2,5)", color: "#34d399", labelPos: "tr" },
      ],
      extraTexts: [{ x: 3.5, y: 9, text: "y=2x+2", color: "#facc15", size: 10 }],
    },
    parts: [
      { label: "Garis:", math: "y = 2x + 2" },
      { label: "a.", text: "Periksa apakah titik A(0, 2) terletak pada garis y = 2x + 2." },
      { label: "b.", text: "Periksa apakah titik B(1, 4) terletak pada garis y = 2x + 2." },
      { label: "c.", text: "Periksa apakah titik C(2, 5) terletak pada garis y = 2x + 2." },
    ],
  }),

  Qn(9, "Apakah Titik Memenuhi Persamaan Garis?", {
    type: "mixed",
    content: "Periksa apakah setiap titik berikut terletak pada garis y = 3x − 1:",
    parts: [
      { label: "a.", math: "P(1,\\ 2)" },
      { label: "b.", math: "Q(2,\\ 5)" },
      { label: "c.", math: "R(-1,\\ -4)" },
      { label: "d.", math: "S(0,\\ -1)" },
      { label: "e.", math: "T(3,\\ 7)" },
    ],
  }),



  Qn(10, "Soal ANBK — Gabungan Posisi Relatif", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -6.5, y1: 3, x2: 6.5, y2: 3, color: "#facc15", label: "y=3" },
        { x1: 2, y1: -6.5, x2: 2, y2: 6.5, color: "#f472b6", label: "x=2" },
        { x1: -5.5, y1: -5.5, x2: 5.5, y2: 5.5, color: "#60a5fa", dashed: true },
      ],
      pts: [
        { x: -2, y: 5, label: "A", color: "#34d399", labelPos: "tl" },
        { x: 4, y: 5, label: "B", color: "#fb923c", labelPos: "tr" },
        { x: -3, y: -2, label: "C", color: "#a78bfa", labelPos: "bl" },
        { x: 5, y: -1, label: "D", color: "#f87171", labelPos: "br" },
      ],
      extraTexts: [{ x: 5, y: 5.5, text: "y=x", color: "#60a5fa", size: 10 }],
    },
    content: "Tiga garis: y = 3, x = 2, y = x (putus-putus).",
    parts: [
      { label: "a.", text: "Tentukan posisi setiap titik A, B, C, D terhadap garis y = 3." },
      { label: "b.", text: "Tentukan posisi setiap titik terhadap garis x = 2." },
      { label: "c.", text: "Tentukan posisi setiap titik terhadap garis y = x." },
      { label: "d.", text: "Titik mana yang berada di atas y = 3 DAN di kiri x = 2 DAN di atas y = x?" },
    ],
  }),
];

const PosisiRelatifPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <Navigation className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            POSISI RELATIF TITIK TERHADAP GARIS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Koordinat Kartesius · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 10 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-3">📌 Aturan Posisi Relatif</p>
          <div className="flex flex-col gap-2 text-xs font-body">
            {[
              { rule: "Di atas garis y = k", cond: "y₀ > k" },
              { rule: "Di bawah garis y = k", cond: "y₀ < k" },
              { rule: "Di kanan garis x = k", cond: "x₀ > k" },
              { rule: "Di kiri garis x = k", cond: "x₀ < k" },
              { rule: "Di atas garis y = mx + c", cond: "y₀ > mx₀ + c" },
              { rule: "Di bawah garis y = mx + c", cond: "y₀ < mx₀ + c" },
            ].map(r => (
              <div key={r.rule} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3">
                <span className="text-rose-300 font-bold w-40 shrink-0">{r.rule}:</span>
                <span className="text-white/60">{r.cond}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CoordPlane {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Koordinat Kartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosisiRelatifPage;
