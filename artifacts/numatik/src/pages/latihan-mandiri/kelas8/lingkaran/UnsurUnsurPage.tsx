import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Circle } from "lucide-react";
import CircleDiagram, { CircleDiagramProps } from "./CircleDiagram";

type Part = { label: string; math?: string; text?: string };
type Diff = "Mudah" | "Sedang" | "Sulit" | "HOTS";
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: CircleDiagramProps;
  imageSrc?: string;
  diff?: Diff;
  type: "essay" | "mixed" | "diagram-only";
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const diffColor: Record<Diff, string> = {
  Mudah: "text-green-400 bg-green-500/10 border-green-500/30",
  Sedang: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  Sulit: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  HOTS: "text-red-400 bg-red-500/10 border-red-500/30",
};

const SOAL_IMG = "/soal-lingkaran-unsur.png";

const refBoxConfig = [
  { key: "jarijari",   c: "text-cyan-400"   },
  { key: "diameter",   c: "text-blue-400"   },
  { key: "busur",      c: "text-yellow-400" },
  { key: "taliBusur",  c: "text-pink-400"   },
  { key: "apotema",    c: "text-violet-400" },
  { key: "juring",     c: "text-orange-400" },
  { key: "tembereng",  c: "text-green-400"  },
  { key: "sudutPusat", c: "text-red-400"    },
];

const UnsurUnsurLingkaranPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.lingkaran.unsurUnsur';

  const questions: Q[] = [
    Qf(1, t(`${p}.q1.title`), {
      type: "mixed", diff: "Mudah",
      imageSrc: SOAL_IMG,
      parts: [
        { label: "a.", text: t(`${p}.q1.a`) },
        { label: "b.", text: t(`${p}.q1.b`) },
        { label: "c.", text: t(`${p}.q1.c`) },
        { label: "d.", text: t(`${p}.q1.d`) },
        { label: "e.", text: t(`${p}.q1.e`) },
        { label: "f.", text: t(`${p}.q1.f`) },
        { label: "g.", text: t(`${p}.q1.g`) },
        { label: "h.", text: t(`${p}.q1.h`) },
        { label: "i.", text: t(`${p}.q1.i`) },
        { label: "j.", text: t(`${p}.q1.j`) },
        { label: "k.", text: t(`${p}.q1.k`) },
      ],
    }),

    Qf(2, t(`${p}.q2.title`), {
      type: "mixed", diff: "Sedang",
      content: t(`${p}.q2.content`),
      parts: [
        { label: "a.", text: t(`${p}.q2.a`) },
        { label: "b.", text: t(`${p}.q2.b`) },
        { label: "c.", text: t(`${p}.q2.c`) },
        { label: "d.", text: t(`${p}.q2.d`) },
        { label: "e.", text: t(`${p}.q2.e`) },
        { label: "f.", text: t(`${p}.q2.f`) },
        { label: "g.", text: t(`${p}.q2.g`) },
        { label: "h.", text: t(`${p}.q2.h`) },
        { label: "i.", text: t(`${p}.q2.i`) },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            {t(`${p}.h1`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 2 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-2">{t(`${p}.refBoxTitle`)}</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {refBoxConfig.map(r => (
              <div key={r.key} className="bg-white/5 rounded-lg px-3 py-2">
                <span className={`font-bold ${r.c}`}>{t(`${p}.refBox.${r.key}.n`)}: </span>
                <span className="text-white/60">{t(`${p}.refBox.${r.key}.d`)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.diff && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${diffColor[q.diff]}`}>
                          {q.diff}
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.imageSrc && (
                      <div className="mb-3 flex justify-center rounded-xl overflow-hidden bg-white/95 p-3">
                        <img src={q.imageSrc} alt={t(`${p}.imgAlt`)} className="max-w-[220px] w-full object-contain" />
                      </div>
                    )}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CircleDiagram {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((pt, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{pt.label}</span>
                            {pt.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={pt.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{pt.text}</p>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} {t(`${p}.backTo`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsurUnsurLingkaranPage;
