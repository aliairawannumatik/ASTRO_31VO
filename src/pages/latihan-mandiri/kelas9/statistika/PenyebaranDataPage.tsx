import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type Q = { n: number; title: string; content: string; diagram?: React.ReactNode };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Jangkauan (Range) – ANBK", {
    content: "Nilai ulangan harian enam siswa adalah: 65, 72, 58, 80, 90, 45. Tentukan jangkauan dari data nilai tersebut, kemudian jelaskan satu kelemahan jangkauan sebagai ukuran penyebaran data!",
  }),
  Qn(2, "Jangkauan Antarkuartil (QR) – UN", {
    content: "Data nilai 10 siswa: 72, 88, 60, 80, 95, 65, 55, 82, 70, 75. Diketahui Q\u2081 = 63,75 dan Q\u2083 = 83,5. Tentukan Q\u1D63 (jangkauan antarkuartil) dan Q\u1D48 (simpangan kuartil) dari data tersebut!",
  }),
  Qn(3, "QR dan Simpangan Kuartil dari Data – ANBK", {
    content: "Data nilai 10 siswa: 82, 65, 75, 55, 88, 70, 95, 60, 72, 80. Tentukan Q\u2081, Q\u2083, Q\u1D63, dan Q\u1D48 dari data tersebut!",
  }),
];

const PenyebaranDataPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📡</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            UKURAN PENYEBARAN DATA
          </h1>
          <p className="text-orange-200/70 text-sm text-center font-body mb-1">
            Jangkauan, Q<sub>R</sub>, dan Q<sub>d</sub>
          </p>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 3 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-3">📌 Rumus Kunci</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { name: "Jangkauan", math: "J = x_{\\max} - x_{\\min}" },
              { name: "Q_R (Jangkauan Antarkuartil)", math: "Q_R = Q_3 - Q_1" },
              { name: "Q_d (Simpangan Kuartil)", math: "Q_d = \\frac{Q_3 - Q_1}{2}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <div className="text-orange-400 text-[9px] uppercase font-bold min-w-[160px]">{r.name}</div>
                <div className="text-orange-200 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-red-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-red-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    <p className="font-body text-sm text-white/90 leading-relaxed">{q.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default PenyebaranDataPage;
