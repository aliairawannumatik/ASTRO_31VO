import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Hash } from "lucide-react";
import ArrowDiagram from "./ArrowDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Menghitung Banyak Fungsi – Dasar", {
    type: "mixed",
    content: "Diketahui A = {a, b} dan B = {1, 2, 3}.",
    parts: [
      { label: "a.", math: "\\text{Banyak fungsi dari A ke B} = \\ldots" },
      { label: "b.", text: "Gambarlah semua fungsi yang mungkin dari A ke B menggunakan diagram panah." },
      { label: "c.", math: "\\text{Banyak fungsi dari B ke A} = \\ldots" },
      { label: "d.", text: "Gambarlah semua fungsi yang mungkin dari B ke A menggunakan diagram panah." },
      { label: "e.", text: "Menurut kamu apakah banyak fungsi dari A ke B dengan B ke A sama atau berbeda? Mengapa?" },
    ],
  }),
  Qn(2, "Korespondensi Satu-Satu – A = {p, q, r, s}, B = {2, 4, 6, 8}", {
    type: "mixed",
    content: "Diketahui A = {p, q, r, s} dan B = {2, 4, 6, 8}.",
    parts: [
      { label: "a.", math: "\\text{Banyak korespondensi satu-satu dari A ke B} = \\ldots" },
      { label: "b.", text: "Gambarlah semua korespondensi satu-satu yang mungkin dari A ke B menggunakan diagram panah." },
      { label: "c.", text: "Menurut kamu apakah banyak korespondensi satu-satu dari A ke B dengan B ke A sama atau berbeda? Mengapa?" },
    ],
  }),
  Qn(3, "Soal UN – Menentukan Banyak Pemetaan", {
    type: "mixed",
    content: "Dari himpunan P = {x | 1 ≤ x ≤ 4, x ∈ bilangan bulat} dan Q = {y | 1 ≤ y ≤ 3, y ∈ bilangan bulat}:",
    parts: [
      { label: "a.", text: "Tentukan n(P) dan n(Q)." },
      { label: "b.", math: "\\text{Banyak fungsi dari P ke Q} = \\ldots" },
      { label: "c.", math: "\\text{Banyak fungsi dari Q ke P} = \\ldots" },
      { label: "d.", text: "Apakah bisa dibentuk korespondensi satu-satu antara P dan Q? Jelaskan." },
    ],
  }),
  Qn(4, "Korespondensi Satu-Satu – Bilangan Prima dan Genap", {
    type: "mixed",
    content: "Dari himpunan P = {x | 1 ≤ x < 13, x ∈ bilangan prima} dan Q = {y | 2 ≤ y < 12, y ∈ bilangan genap}:",
    parts: [
      { label: "a.", text: "Tentukan n(P) dan n(Q)." },
      { label: "b.", text: "Apakah syarat korespondensi satu-satu terpenuhi antara P dan Q? Jelaskan." },
      { label: "c.", math: "\\text{Banyak korespondensi satu-satu yang dapat dibuat} = \\ldots" },
      { label: "d.", text: "Apakah banyak korespondensi satu-satu dari P ke Q sama dengan dari Q ke P? Mengapa?" },
    ],
  }),
  Qn(5, "Korespondensi – Analogi Nyata", {
    type: "mixed",
    content: "Sebuah hotel memiliki 10 kamar dan 10 tamu. Setiap tamu menempati tepat satu kamar dan setiap kamar dihuni tepat satu tamu.",
    parts: [
      { label: "a.", text: "Nyatakan situasi ini dalam bentuk fungsi matematika." },
      { label: "b.", text: "Apakah ini merupakan korespondensi satu-satu? Jelaskan." },
      { label: "c.", math: "\\text{Banyak cara menempati kamar} = 10! = \\ldots \\text{ (tidak perlu dihitung penuh)}" },
    ],
  }),
];

const BanyakFungsiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <Hash className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            BANYAK FUNGSI DAN KORESPONDENSI SATU-SATU
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Relasi dan Fungsi · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 5 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-2">📌 Rumus Penting</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="font-bold text-orange-400">Banyak Fungsi</span>
              <div className="text-white/60 mt-1"><InlineMath math="n(B)^{n(A)}" /></div>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="font-bold text-orange-400">Banyak Korespondensi</span>
              <div className="text-white/60 mt-1"><InlineMath math="n! \quad (n(A) = n(B) = n)" /></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-orange-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanyakFungsiPage;
