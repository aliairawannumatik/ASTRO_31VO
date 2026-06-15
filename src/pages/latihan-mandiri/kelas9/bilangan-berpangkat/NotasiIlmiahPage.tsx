import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Pengertian Notasi Ilmiah – Dasar", {
    type: "mixed",
    parts: [
      { label: "a.", math: "3{,}5 \\times 10^4 \\text{ — apakah ini notasi ilmiah yang valid? Mengapa?}" },
      { label: "b.", math: "15 \\times 10^3 \\text{ — apakah ini notasi ilmiah yang valid? Perbaiki jika salah.}" },
    ],
  }),
  Qn(2, "Mengubah ke Notasi Ilmiah & Memperbaiki Notasi – UN/ANBK/TKA", {
    type: "mixed",
    content: "Ubahlah bentuk berikut ke dalam notasi ilmiah!",
    parts: [
      { label: "a.", math: "7.500.000 = \\ldots" },
      { label: "b.", math: "43.000.000.000 = \\ldots" },
      { label: "c.", math: "986.000 = \\ldots" },
      { label: "d.", math: "0{,}0035 = \\ldots" },
      { label: "e.", math: "0{,}000072 = \\ldots" },
      { label: "f.", math: "0{,}00000045 = \\ldots" },
      { label: "g.", math: "25 \\times 10^4 = \\ldots" },
      { label: "h.", math: "0{,}35 \\times 10^7 = \\ldots" },
      { label: "i.", math: "120 \\times 10^{-3} = \\ldots" },
    ],
  }),
  Qn(3, "Mengubah dari Notasi Ilmiah – UN/ANBK/TKA", {
    type: "mixed",
    content: "Ubahlah bentuk notasi ilmiah berikut ke bentuk biasa!",
    parts: [
      { label: "a.", math: "6{,}02 \\times 10^{23} = \\ldots" },
      { label: "b.", math: "3{,}0 \\times 10^8 = \\ldots \\text{ (kecepatan cahaya, m/s)}" },
      { label: "c.", math: "9{,}46 \\times 10^{12} = \\ldots \\text{ km (satu tahun cahaya)}" },
      { label: "d.", math: "4{,}5 \\times 10^{-4} = 0{,}00045" },
      { label: "e.", math: "1{,}67 \\times 10^{-27} = \\ldots \\text{ (massa proton, kg)}" },
      { label: "f.", math: "2{,}5 \\times 10^{-6} = \\ldots \\text{ m}" },
    ],
  }),
  Qn(4, "Perkalian & Pembagian Notasi Ilmiah – UN/ANBK", {
    type: "mixed",
    content: "Sederhanakan dan ubahlah ke bentuk notasi ilmiah!",
    parts: [
      { label: "a.", math: "(3 \\times 10^4)(2 \\times 10^5) = 6 \\times 10^9" },
      { label: "b.", math: "(4 \\times 10^3)(5 \\times 10^6) = \\ldots" },
      { label: "c.", math: "(2{,}5 \\times 10^7)(4 \\times 10^3) = \\ldots" },
      { label: "d.", math: "\\frac{8 \\times 10^9}{4 \\times 10^3} = 2 \\times 10^6" },
      { label: "e.", math: "\\frac{6 \\times 10^{12}}{3 \\times 10^5} = \\ldots" },
      { label: "f.", math: "\\frac{9 \\times 10^8}{3 \\times 10^{-2}} = \\ldots" },
    ],
  }),
  Qn(5, "Penjumlahan & Pengurangan Notasi Ilmiah – UN/TKA", {
    type: "mixed",
    content: "Sederhanakan dan ubahlah ke bentuk notasi ilmiah!",
    parts: [
      { label: "a.", math: "3 \\times 10^5 + 2 \\times 10^5 = 5 \\times 10^5" },
      { label: "b.", math: "4{,}2 \\times 10^6 + 3{,}8 \\times 10^6 = \\ldots" },
      { label: "c.", math: "5 \\times 10^4 + 3 \\times 10^3 = 5 \\times 10^4 + 0{,}3 \\times 10^4 = \\ldots" },
      { label: "d.", math: "7 \\times 10^8 - 3 \\times 10^8 = \\ldots" },
      { label: "e.", math: "9{,}5 \\times 10^5 - 4{,}5 \\times 10^5 = \\ldots" },
      { label: "f.", math: "6 \\times 10^7 - 4 \\times 10^6 = \\ldots" },
    ],
  }),
];

const NotasiIlmiahPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔭</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            NOTASI ILMIAH
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bilangan Berpangkat · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 5 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/80 italic mb-3">{q.content}</p>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>}
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/bilangan-berpangkat"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};
export default NotasiIlmiahPage;
