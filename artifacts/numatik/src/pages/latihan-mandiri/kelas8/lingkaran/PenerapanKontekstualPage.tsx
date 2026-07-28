import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Circle } from "lucide-react";
import CircleDiagram, { CircleDiagramProps } from "./CircleDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[]; diagram?: CircleDiagramProps;
  img?: string; imgAlt?: string; imgCaption?: string;
  type: "essay" | "mixed";
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const PenerapanKontekstualPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lp = "practice.lingkaran.penerapanKontekstual";

  const refFormulas = [
    { n: t(`${lp}.refKeliling`),     d: "K = 2πr = πd",       c: "text-cyan-400" },
    { n: t(`${lp}.refLuas`),         d: "L = πr²",             c: "text-emerald-400" },
    { n: t(`${lp}.refPanjangBusur`), d: "(α/360°) × 2πr",      c: "text-yellow-400" },
    { n: t(`${lp}.refLuasJuring`),   d: "(α/360°) × πr²",      c: "text-violet-400" },
    { n: t(`${lp}.refLuasAnnulus`),  d: "π(R² − r²)",          c: "text-orange-400" },
    { n: "π ≈ 22/7",                 d: t(`${lp}.refPiNote`),   c: "text-pink-400" },
  ];

  const questions: Q[] = [
    Qf(1, t(`${lp}.q1.title`), {
      type: "mixed",
      img: "/soal-roda-sepeda.png",
      imgAlt: t(`${lp}.q1.imgAlt`),
      imgCaption: "https://www.cycle-eirin.com/wordpress",
      content: t(`${lp}.q1.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q1.a`) },
        { label: "b.", text: t(`${lp}.q1.b`) },
        { label: "c.", text: t(`${lp}.q1.c`) },
      ],
    }),

    Qf(2, t(`${lp}.q2.title`), {
      type: "essay",
      img: "/soal-kolam-renang.png",
      imgAlt: t(`${lp}.q2.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q2.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q2.a`) },
        { label: "b.", text: t(`${lp}.q2.b`) },
        { label: "c.", text: t(`${lp}.q2.c`) },
      ],
    }),

    Qf(3, t(`${lp}.q3.title`), {
      type: "mixed",
      img: "/soal-jam-dinding.png",
      imgAlt: t(`${lp}.q3.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q3.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q3.a`) },
        { label: "b.", text: t(`${lp}.q3.b`) },
        { label: "c.", text: t(`${lp}.q3.c`) },
      ],
    }),

    Qf(4, t(`${lp}.q4.title`), {
      type: "mixed",
      img: "/soal-pizza.png",
      imgAlt: t(`${lp}.q4.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q4.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q4.a`) },
        { label: "b.", text: t(`${lp}.q4.b`) },
        { label: "c.", text: t(`${lp}.q4.c`) },
      ],
    }),

    Qf(5, t(`${lp}.q5.title`), {
      type: "essay",
      img: "/soal-taman-kota.png",
      imgAlt: t(`${lp}.q5.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q5.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q5.a`) },
        { label: "b.", text: t(`${lp}.q5.b`) },
        { label: "c.", text: t(`${lp}.q5.c`) },
      ],
    }),

    Qf(6, t(`${lp}.q6.title`), {
      type: "essay",
      img: "/soal-lintasan-lari.png",
      imgAlt: t(`${lp}.q6.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q6.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q6.a`) },
        { label: "b.", text: t(`${lp}.q6.b`) },
        { label: "c.", text: t(`${lp}.q6.c`) },
      ],
    }),

    Qf(7, t(`${lp}.q7.title`), {
      type: "essay",
      img: "/image_1778761973928.png",
      imgAlt: t(`${lp}.q7.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q7.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q7.a`) },
        { label: "b.", text: t(`${lp}.q7.b`) },
        { label: "c.", text: t(`${lp}.q7.c`) },
      ],
    }),

    Qf(8, t(`${lp}.q8.title`), {
      type: "essay",
      img: "/image_1778762091357.png",
      imgAlt: t(`${lp}.q8.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q8.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q8.a`) },
        { label: "b.", text: t(`${lp}.q8.b`) },
        { label: "c.", text: t(`${lp}.q8.c`) },
      ],
    }),

    Qf(9, t(`${lp}.q9.title`), {
      type: "essay",
      img: "/image_1778762340281.png",
      imgAlt: t(`${lp}.q9.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q9.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q9.a`) },
        { label: "b.", text: t(`${lp}.q9.b`) },
        { label: "c.", text: t(`${lp}.q9.c`) },
      ],
    }),

    Qf(10, t(`${lp}.q10.title`), {
      type: "essay",
      img: "/image_1778762645992.png",
      imgAlt: t(`${lp}.q10.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q10.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q10.a`) },
        { label: "b.", text: t(`${lp}.q10.b`) },
        { label: "c.", text: t(`${lp}.q10.c`) },
      ],
    }),

    Qf(11, t(`${lp}.q11.title`), {
      type: "essay",
      img: "/image_1778762749930.png",
      imgAlt: t(`${lp}.q11.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q11.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q11.a`) },
        { label: "b.", text: t(`${lp}.q11.b`) },
        { label: "c.", text: t(`${lp}.q11.c`) },
      ],
    }),

    Qf(12, t(`${lp}.q12.title`), {
      type: "mixed",
      img: "/image_1778763445513.png",
      imgAlt: t(`${lp}.q12.imgAlt`),
      imgCaption: "https://www.bing.com/images/create",
      content: t(`${lp}.q12.content`),
      parts: [
        { label: "a.", text: t(`${lp}.q12.a`) },
        { label: "b.", text: t(`${lp}.q12.b`) },
        { label: "c.", text: t(`${lp}.q12.c`) },
        { label: "d.", text: t(`${lp}.q12.d`) },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            {t(`${lp}.h1`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">{t(`${lp}.subtitle`)} · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 {questions.length} {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">{t(`${lp}.refBoxTitle`)}</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {refFormulas.map(r => (
              <div key={r.n} className="bg-white/5 rounded-lg px-3 py-2">
                <span className={`font-bold ${r.c}`}>{r.n}: </span>
                <span className="text-white/60">{r.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
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
                    {q.img && (
                      <div className="mb-3 flex flex-col items-center gap-1">
                        <img src={q.img} alt={q.imgAlt ?? ""} className="max-w-[220px] w-full object-contain rounded-lg bg-white/90 p-2" />
                        {q.imgCaption && (
                          <a href={q.imgCaption} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-white/40 hover:text-rose-300 transition-colors break-all text-center font-body">
                            {q.imgCaption}
                          </a>
                        )}
                      </div>
                    )}
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CircleDiagram {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((pt, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{pt.label}</span>
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
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenerapanKontekstualPage;
