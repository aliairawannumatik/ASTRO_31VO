import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Shuffle } from "lucide-react";
import GSLDiagram from "./GSLDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  difficulty?: "Mudah" | "Sedang" | "Sulit";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Pengertian GSPD", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="gspd-two-circles" size={230} />,
    content: "Garis Singgung Persekutuan Dalam (GSPD) adalah garis yang menyinggung dua lingkaran dari antara kedua pusat, sehingga memotong ruas garis O₁O₂.",
    parts: [
      { label: "a.", text: "Jelaskan mengapa GSPD 'memotong' garis O₁O₂ sedangkan GSPL tidak." },
      { label: "b.", text: "Berapa banyak GSPD yang dapat dibuat pada dua lingkaran yang terpisah?" },
      { label: "c.", text: "Kapan dua lingkaran tidak memiliki GSPD?" },
    ],
  }),
  Qn(2, "Rumus GSPD", {
    difficulty: "Mudah",
    mathContent: "d_{GSPD} = \\sqrt{p^2 - (R + r)^2}",
    parts: [
      { label: "a.", text: "Mengapa pada rumus GSPD digunakan (R + r) bukan (R − r)?" },
      { label: "b.", math: "\\text{Jika } p = 17, R = 8, r = 4, \\text{ hitung } d_{GSPD}" },
      { label: "c.", text: "Bandingkan rumus GSPL dan GSPD. Apa perbedaannya?" },
    ],
  }),
  Qn(3, "GSPD – Titik Silang X", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="gspd-two-circles" size={230} />,
    content: "GSPD memotong garis pusat O₁O₂ di titik X. Perbandingan O₁X : XO₂ = R : r.",
    parts: [
      { label: "a.", math: "R = 9, r = 6, p = 30 \\Rightarrow O_1X : XO_2 = 9 : 6 = 3 : 2" },
      { label: "b.", math: "O_1X = \\frac{3}{5} \\times 30 = 18 \\text{ cm}" },
      { label: "c.", math: "d_{GSPD} = \\sqrt{30^2 - (9+6)^2} = \\sqrt{900 - 225} = \\sqrt{675} = 15\\sqrt{3}" },
    ],
  }),
  Qn(4, "GSPD – Soal TKA Final", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="gspd-two-circles" size={230} />,
    content: "Dua lingkaran R = 8, r = 6, p = 30. Hitung: GSPD, GSPL, selisihnya, dan sudut yang dibentuk GSPD dengan O₁O₂.",
    parts: [
      { label: "a.", math: "d_{GSPD} = \\sqrt{30^2 - 14^2} = \\sqrt{900-196} = \\sqrt{704} = 4\\sqrt{44} = 8\\sqrt{11}" },
      { label: "b.", math: "d_{GSPL} = \\sqrt{30^2 - 2^2} = \\sqrt{900 - 4} = \\sqrt{896} = 4\\sqrt{56} = 8\\sqrt{14}" },
      { label: "c.", math: "\\sin \\beta = \\frac{R+r}{p} = \\frac{14}{30} = \\frac{7}{15} \\Rightarrow \\beta \\approx 27{,}8^\\circ" },
    ],
  }),
];

const diffColor: Record<string, string> = {
  Mudah: "bg-pink-500/20 text-pink-300 border-pink-400/40",
  Sedang: "bg-rose-500/20 text-rose-300 border-rose-400/40",
  Sulit: "bg-red-500/20 text-red-300 border-red-400/40",
};

const GSPDPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <Shuffle className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(244,63,94,0.7)' }}>
            GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Garis Singgung Lingkaran · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 4 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">📌 Rumus Garis Singgung Persekutuan Dalam</p>
          <div className="bg-white/5 rounded-lg px-3 py-3 mb-2 flex justify-center">
            <BlockMath math="d_{GSPD} = \sqrt{p^2 - (R + r)^2}" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { l: "p", v: "Jarak antar pusat O₁O₂" },
              { l: "R + r", v: "Jumlah kedua jari-jari" },
              { l: "Syarat ada:", v: "p > R + r" },
              { l: "GSPD < GSPL", v: "Selalu berlaku" },
            ].map(x => (
              <div key={x.l} className="bg-white/5 rounded-lg px-2 py-2">
                <span className="text-rose-400 font-bold">{x.l}: </span>
                <span className="text-white/60">{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/garis-singgung-lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSPDPage;
