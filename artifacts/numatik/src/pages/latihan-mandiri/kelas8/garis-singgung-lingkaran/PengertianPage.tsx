import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Circle } from "lucide-react";
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
  Qn(1, "Definisi Garis Singgung Lingkaran", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="tangent-basic" size={220} />,
    content: "Perhatikan gambar di atas. Garis singgung lingkaran adalah garis yang menyentuh lingkaran hanya di satu titik.",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan garis singgung lingkaran?" },
      { label: "b.", text: "Berapa banyak titik persekutuan antara garis singgung dan lingkaran?" },
      { label: "c.", text: "Apa nama titik pertemuan antara garis singgung dan lingkaran?" },
    ],
  }),
  Qn(2, "Sifat Tegak Lurus Garis Singgung", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="tangent-basic" size={220} color="#34d399" />,
    content: "Sifat penting: Garis singgung lingkaran tegak lurus dengan jari-jari yang ditarik ke titik singgung.",
    parts: [
      { label: "a.", text: "Jika T adalah titik singgung dan O pusat lingkaran, bagaimana hubungan OT dengan garis singgung?" },
      { label: "b.", math: "\\text{Berapa besar sudut antara OT dan garis singgung di titik T?}" },
      { label: "c.", text: "Mengapa sifat tegak lurus ini penting dalam menyelesaikan soal?" },
    ],
  }),
  Qn(7, "Segitiga yang Dibentuk Garis Singgung", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-right-angle" size={220} color="#fb923c" />,
    content: "Titik P di luar lingkaran, T titik singgung, O pusat. Segitiga OTP terbentuk.",
    parts: [
      { label: "a.", math: "\\angle OTP = 90^\\circ. \\text{ Jenis segitiga OTP adalah ...}" },
      { label: "b.", math: "\\text{Gunakan Pythagoras: } PT^2 = OP^2 - OT^2" },
      { label: "c.", math: "\\text{Jika } OT = 6, OP = 10, \\text{ maka } PT = \\ldots" },
    ],
  }),
  Qn(14, "Jumlah Sudut dalam Segiempat Tali Busur", {
    difficulty: "Sulit",
    content: "Titik A, B, C, D terletak pada lingkaran. ABCD adalah segiempat tali busur.",
    parts: [
      { label: "a.", math: "\\angle A + \\angle C = \\ldots ^\\circ" },
      { label: "b.", math: "\\angle B + \\angle D = \\ldots ^\\circ" },
      { label: "c.", text: "Bagaimana hubungan ini berkaitan dengan sifat garis singgung lingkaran?" },
    ],
  }),
  Qn(35, "Sudut pada Segitiga OTP", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-angle" size={220} color="#f472b6" />,
    content: "Dari P ke lingkaran O, garis singgung PT dengan ∠TPO = 35°.",
    parts: [
      { label: "a.", math: "\\angle OTP = 90^\\circ" },
      { label: "b.", math: "\\angle TOP = 180^\\circ - 90^\\circ - 35^\\circ = \\ldots ^\\circ" },
      { label: "c.", math: "\\tan 35^\\circ = \\frac{OT}{PT} \\Rightarrow \\text{ jika } OT = r, \\text{ maka } PT = \\frac{r}{\\tan 35^\\circ}" },
    ],
  }),
];

const diffColor: Record<string, string> = {
  Mudah: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
  Sedang: "bg-amber-500/20 text-amber-300 border-amber-400/40",
  Sulit: "bg-rose-500/20 text-rose-300 border-rose-400/40",
};

const PengertianPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            PENGERTIAN & SIFAT GARIS SINGGUNG
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Garis Singgung Lingkaran · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 5 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Sifat-Sifat Garis Singgung Lingkaran</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { k: "Definisi:", v: "Garis yang menyentuh lingkaran tepat di satu titik (titik singgung)" },
              { k: "Sifat Utama:", v: "Garis singgung ⊥ jari-jari di titik singgung (∠OTP = 90°)" },
              { k: "Dari Titik Luar:", v: "Dapat ditarik 2 garis singgung, dan panjangnya sama (PA = PB)" },
            ].map(x => (
              <div key={x.k} className="bg-white/5 rounded-lg px-3 py-2 flex gap-2">
                <span className="text-emerald-400 font-bold shrink-0">{x.k}</span>
                <span className="text-white/60">{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianPage;
