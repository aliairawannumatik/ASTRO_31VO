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
  type: "essay" | "mixed";
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const SudutPusatKelilingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.lingkaran.sudutPusatKeliling';
  const tp = (key: string) => t(`${p}.${key}`);

  // Shared text fragments for \text{} interpolation
  const jikaText      = tp('shared.jika');
  const tentukanText  = tp('shared.tentukan');
  const TentukanText  = tp('shared.Tentukan');
  const danText       = tp('shared.dan');
  const pusatText     = tp('shared.pusat');
  const kelilingText  = tp('shared.keliling');
  const busurSamaText = tp('shared.busurSama');

  const refCards = [
    { n: tp('refBox.card1n'), d: tp('refBox.card1d'), c: "text-cyan-400" },
    { n: tp('refBox.card2n'), d: tp('refBox.card2d'), c: "text-yellow-400" },
    { n: tp('refBox.card3n'), d: tp('refBox.card3d'), c: "text-pink-400" },
    { n: tp('refBox.card4n'), d: tp('refBox.card4d'), c: "text-green-400" },
  ];

  const questions: Q[] = [
    Qf(1, tp('q1.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 160, label: "A", color: "#f472b6" },
          { angle: 20, label: "B", color: "#f472b6" },
          { angle: 270, label: "C", color: "#facc15" },
        ],
        radii: [{ angle: 160, color: "rgba(244,114,182,0.4)" }, { angle: 20, color: "rgba(244,114,182,0.4)" }],
        chords: [
          { angle1: 270, angle2: 160, color: "rgba(250,204,21,0.6)" },
          { angle1: 270, angle2: 20, color: "rgba(250,204,21,0.6)" },
        ],
        angleArcs: [
          { vertex: [120, 120], from: 20, to: 160, color: "#f472b6", label: "∠AOB", arcR: 30 },
          { vertex: [120, 192], from: 55, to: 125, color: "#facc15", label: "∠ACB", arcR: 22 },
        ],
        extraTexts: [{ x: 120, y: 18, text: "∠AOB = 2 × ∠ACB", color: "rgba(255,255,255,0.5)", size: 10, bold: true }],
      },
      parts: [
        { label: tp('q1.labelTeorema'), math: "\\angle AOB = 2 \\times \\angle ACB" },
        { label: "a.", math: `\\text{${jikaText}} \\angle AOB = 80°, \\text{ ${tentukanText}} \\angle ACB.` },
        { label: "b.", math: `\\text{${jikaText}} \\angle ACB = 35°, \\text{ ${tentukanText}} \\angle AOB.` },
        { label: "c.", math: `\\text{${jikaText}} \\angle ACB = 55°, \\text{ ${tp('q1.c.post')}}` },
      ],
    }),

    Qf(2, tp('q2.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 180, label: "A", color: "#60a5fa" },
          { angle: 0, label: "B", color: "#60a5fa" },
          { angle: 100, label: "C", color: "#facc15" },
          { angle: 250, label: "D", color: "#34d399" },
        ],
        radii: [{ angle: 180, color: "rgba(96,165,250,0.4)", toEdge: true }],
        chords: [
          { angle1: 180, angle2: 100, color: "rgba(250,204,21,0.6)" },
          { angle1: 0, angle2: 100, color: "rgba(250,204,21,0.6)" },
          { angle1: 180, angle2: 250, color: "rgba(52,211,153,0.5)" },
          { angle1: 0, angle2: 250, color: "rgba(52,211,153,0.5)" },
        ],
        extraTexts: [{ x: 120, y: 18, text: "AB = diameter → ∠ACB = ∠ADB = 90°", color: "rgba(255,255,255,0.5)", size: 9, bold: true }],
      },
      parts: [
        { label: "b.", math: `\\text{${tp('q2.pre')}} \\angle CAB = 40°, \\text{ ${tentukanText}} \\angle ABC.` },
        { label: "c.", math: `\\text{${tp('q2.pre')}} \\angle DAB = 30°, \\text{ ${tentukanText}} \\angle ABD.` },
      ],
    }),

    Qf(3, tp('q3.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 145, label: "A", color: "#f472b6" },
          { angle: 35, label: "B", color: "#f472b6" },
          { angle: 270, label: "C", color: "#facc15" },
        ],
        radii: [{ angle: 145, color: "rgba(244,114,182,0.4)" }, { angle: 35, color: "rgba(244,114,182,0.4)" }],
        chords: [
          { angle1: 270, angle2: 145, color: "rgba(250,204,21,0.6)" },
          { angle1: 270, angle2: 35, color: "rgba(250,204,21,0.6)" },
        ],
        angleArcs: [{ vertex: [120, 192], from: 63, to: 118, color: "#facc15", label: "∠ACB = 55°", arcR: 22 }],
      },
      parts: [
        { label: "a.", math: `\\text{${TentukanText}} \\angle AOB.` },
        { label: "b.", text: tp('q3.b') },
        { label: "c.", text: tp('q3.c') },
      ],
    }),

    Qf(4, tp('q4.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 90, label: "A", color: "#60a5fa" },
          { angle: 210, label: "B", color: "#60a5fa" },
          { angle: 330, label: "C", color: "#60a5fa" },
        ],
        chords: [
          { angle1: 90, angle2: 210, color: "rgba(96,165,250,0.5)" },
          { angle1: 210, angle2: 330, color: "rgba(96,165,250,0.5)" },
          { angle1: 330, angle2: 90, color: "rgba(96,165,250,0.5)" },
        ],
        radii: [
          { angle: 90, color: "rgba(96,165,250,0.3)" },
          { angle: 210, color: "rgba(96,165,250,0.3)" },
          { angle: 330, color: "rgba(96,165,250,0.3)" },
        ],
      },
      content: tp('q4.content'),
      parts: [
        { label: "a.", math: `\\text{${tp('q4.a.pre')}} \\angle AOB?` },
        { label: "b.", math: `\\text{${tp('q4.b.pre')}} \\angle ACB \\text{ ${tp('q4.b.post')}}` },
        { label: "c.", text: tp('q4.c') },
      ],
    }),

    Qf(5, tp('q5.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 160, label: "P", color: "#f472b6" },
          { angle: 20, label: "Q", color: "#f472b6" },
          { angle: 270, label: "R", color: "#facc15" },
        ],
        radii: [{ angle: 160, color: "rgba(244,114,182,0.4)" }, { angle: 20, color: "rgba(244,114,182,0.4)" }],
        chords: [
          { angle1: 270, angle2: 160, color: "rgba(250,204,21,0.6)" },
          { angle1: 270, angle2: 20, color: "rgba(250,204,21,0.6)" },
        ],
        angleArcs: [
          { vertex: [120, 120], from: 20, to: 160, color: "#f472b6", label: "4x", arcR: 28 },
          { vertex: [120, 192], from: 55, to: 125, color: "#facc15", label: "x+20°", arcR: 22 },
        ],
      },
      content: tp('q5.content'),
      parts: [
        { label: "a.", math: `\\text{${tp('q5.a.pre')}} \\angle POQ = 2 \\times \\angle PRQ. \\text{ ${tp('q5.a.post')}}` },
        { label: "b.", math: `\\text{${tp('q5.b.pre')}} x.` },
        { label: "c.", text: tp('q5.c') },
      ],
    }),

    Qf(6, tp('q6.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 90, label: "A", color: "#f472b6" },
          { angle: 175, label: "B", color: "#fb923c" },
          { angle: 250, label: "C", color: "#34d399" },
          { angle: 10, label: "D", color: "#60a5fa" },
        ],
        chords: [
          { angle1: 90, angle2: 175, color: "rgba(255,255,255,0.3)" },
          { angle1: 175, angle2: 250, color: "rgba(255,255,255,0.3)" },
          { angle1: 250, angle2: 10, color: "rgba(255,255,255,0.3)" },
          { angle1: 10, angle2: 90, color: "rgba(255,255,255,0.3)" },
        ],
      },
      content: tp('q6.content'),
      parts: [
        { label: "a.", math: `\\angle A + \\angle C = 180°. \\text{ ${jikaText}} \\angle A = 110°, \\text{ ${tentukanText}} \\angle C.` },
        { label: "b.", math: `\\angle B + \\angle D = 180°. \\text{ ${jikaText}} \\angle B = 75°, \\text{ ${tentukanText}} \\angle D.` },
        { label: "c.", text: tp('q6.c') },
      ],
    }),

    Qf(7, tp('q7.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 140, label: "A", color: "#f472b6" },
          { angle: 40, label: "B", color: "#f472b6" },
          { angle: 280, label: "C", color: "#facc15" },
          { angle: 320, label: "D", color: "#34d399" },
        ],
        chords: [
          { angle1: 280, angle2: 140, color: "rgba(250,204,21,0.5)" },
          { angle1: 280, angle2: 40, color: "rgba(250,204,21,0.5)" },
          { angle1: 320, angle2: 140, color: "rgba(52,211,153,0.5)" },
          { angle1: 320, angle2: 40, color: "rgba(52,211,153,0.5)" },
        ],
      },
      content: tp('q7.content'),
      parts: [
        { label: "a.", math: `\\text{${TentukanText}} \\angle ADB.` },
        { label: "b.", text: tp('q7.b') },
        { label: "c.", text: tp('q7.c') },
      ],
    }),

    Qf(8, tp('q8.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 180, label: "P", color: "#60a5fa" },
          { angle: 0, label: "Q", color: "#60a5fa" },
          { angle: 60, label: "R", color: "#facc15" },
          { angle: 130, label: "S", color: "#f472b6" },
        ],
        radii: [{ angle: 180, color: "rgba(96,165,250,0.4)", toEdge: true }],
        chords: [
          { angle1: 60, angle2: 180, color: "rgba(250,204,21,0.6)" },
          { angle1: 60, angle2: 0, color: "rgba(250,204,21,0.6)" },
          { angle1: 130, angle2: 180, color: "rgba(244,114,182,0.5)" },
          { angle1: 130, angle2: 0, color: "rgba(244,114,182,0.5)" },
        ],
        extraTexts: [{ x: 120, y: 18, text: "PQ = diameter", color: "rgba(96,165,250,0.6)", size: 9, bold: true }],
      },
      parts: [
        { label: "a.", math: `\\text{${TentukanText}} \\angle PRQ \\text{ ${danText}} \\angle PSQ.` },
        { label: "b.", math: `\\text{${jikaText}} \\angle QPR = 35°, \\text{ ${tentukanText}} \\angle PQR \\text{ ${tp('q8.b.post')}}` },
        { label: "c.", math: `\\text{${jikaText}} \\angle QPS = 50°, \\text{ ${tentukanText}} \\angle QSP \\text{ ${tp('q8.c.post')}}` },
      ],
    }),

    Qf(9, tp('q9.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 150, label: "A", color: "#f472b6" },
          { angle: 30, label: "B", color: "#f472b6" },
          { angle: 270, label: "C", color: "#facc15" },
        ],
        chords: [
          { angle1: 150, angle2: 30, color: "#a78bfa", label: "AB" },
          { angle1: 270, angle2: 150, color: "rgba(250,204,21,0.5)" },
          { angle1: 270, angle2: 30, color: "rgba(250,204,21,0.5)" },
        ],
        angleArcs: [{ vertex: [120, 192], from: 60, to: 120, color: "#facc15", label: "∠ACB = 40°", arcR: 22 }],
      },
      content: tp('q9.content'),
      parts: [
        { label: "a.", math: `\\text{${TentukanText}} \\angle AOB \\text{ ${tp('q9.a.post')}}` },
        { label: "b.", text: tp('q9.b') },
        { label: "c.", text: tp('q9.c') },
      ],
    }),

    Qf(10, tp('q10.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 90, label: "A", color: "#f472b6" },
          { angle: 210, label: "B", color: "#fb923c" },
          { angle: 330, label: "C", color: "#34d399" },
          { angle: 270, label: "D", color: "#60a5fa" },
        ],
        chords: [
          { angle1: 90, angle2: 210, color: "rgba(255,255,255,0.3)" },
          { angle1: 210, angle2: 330, color: "rgba(255,255,255,0.3)" },
          { angle1: 330, angle2: 90, color: "rgba(255,255,255,0.3)" },
          { angle1: 270, angle2: 90, color: "rgba(96,165,250,0.4)" },
          { angle1: 270, angle2: 330, color: "rgba(96,165,250,0.4)" },
        ],
        radii: [
          { angle: 90, color: "rgba(244,114,182,0.3)" },
          { angle: 210, color: "rgba(251,146,60,0.3)" },
          { angle: 330, color: "rgba(52,211,153,0.3)" },
        ],
      },
      content: tp('q10.content'),
      parts: [
        { label: "a.", math: `\\text{${TentukanText}} \\angle ACB \\text{ ${tp('q10.a.post')}}` },
        { label: "b.", math: `\\text{${TentukanText}} \\angle ADB \\text{ ${tp('q10.b.post')}}` },
        { label: "c.", text: tp('q10.c') },
      ],
    }),

    Qf(11, tp('q11.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 80, label: "W", color: "#f472b6" },
          { angle: 170, label: "X", color: "#fb923c" },
          { angle: 255, label: "Y", color: "#34d399" },
          { angle: 350, label: "Z", color: "#60a5fa" },
        ],
        chords: [
          { angle1: 80, angle2: 170, color: "rgba(255,255,255,0.3)" },
          { angle1: 170, angle2: 255, color: "rgba(255,255,255,0.3)" },
          { angle1: 255, angle2: 350, color: "rgba(255,255,255,0.3)" },
          { angle1: 350, angle2: 80, color: "rgba(255,255,255,0.3)" },
        ],
        extraTexts: [{ x: 120, y: 18, text: "∠W + ∠Y = 180°, ∠X + ∠Z = 180°", color: "rgba(255,255,255,0.4)", size: 9 }],
      },
      content: tp('q11.content'),
      parts: [
        { label: "a.", math: `\\text{${TentukanText}} \\angle Y.` },
        { label: "b.", math: `\\text{${TentukanText}} \\angle Z.` },
        { label: "c.", text: tp('q11.c') },
      ],
    }),

    Qf(12, tp('q12.title'), {
      type: "essay",
      content: tp('q12.content'),
      parts: [
        { label: "(1)", text: tp('q12.p1') },
        { label: "(2)", text: tp('q12.p2') },
        { label: "(3)", text: tp('q12.p3') },
        { label: "(4)", text: tp('q12.p4') },
      ],
    }),

    Qf(13, tp('q13.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 90, label: "A", color: "#f472b6" },
          { angle: 210, label: "B", color: "#f472b6" },
          { angle: 300, label: "C", color: "#facc15" },
        ],
        radii: [{ angle: 90, color: "rgba(244,114,182,0.4)" }, { angle: 210, color: "rgba(244,114,182,0.4)" }],
        chords: [
          { angle1: 90, angle2: 300, color: "rgba(250,204,21,0.5)" },
          { angle1: 210, angle2: 300, color: "rgba(250,204,21,0.5)" },
          { angle1: 90, angle2: 210, color: "rgba(244,114,182,0.3)" },
        ],
      },
      content: tp('q13.content'),
      parts: [
        { label: "a.", math: `\\text{${jikaText}} \\angle AOB = 120°, \\text{ ${tentukanText}} \\angle ACB.` },
        { label: "b.", math: `\\text{${jikaText}} \\angle OCA = 20°, \\text{ ${tentukanText}} \\angle OAC \\text{ ${tp('q13.b.post')}}` },
        { label: "c.", math: `\\text{${TentukanText}} \\angle AOC.` },
      ],
    }),

    Qf(14, tp('q14.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 120, label: "P", color: "#f472b6" },
          { angle: 0, label: "Q", color: "#f472b6" },
          { angle: 240, label: "R", color: "#facc15" },
          { angle: 300, label: "S", color: "#34d399" },
        ],
        radii: [{ angle: 120, color: "rgba(244,114,182,0.3)" }, { angle: 0, color: "rgba(244,114,182,0.3)" }],
        chords: [
          { angle1: 240, angle2: 120, color: "rgba(250,204,21,0.5)" },
          { angle1: 240, angle2: 0, color: "rgba(250,204,21,0.5)" },
          { angle1: 300, angle2: 120, color: "rgba(52,211,153,0.4)" },
          { angle1: 300, angle2: 0, color: "rgba(52,211,153,0.4)" },
        ],
      },
      content: tp('q14.content'),
      parts: [
        { label: "a.", math: `\\text{${TentukanText}} \\angle PSQ.` },
        { label: "b.", math: `\\text{${tp('q14.b.pre')}} \\angle POQ.` },
        { label: "c.", text: tp('q14.c') },
      ],
    }),

    Qf(15, tp('q15.title'), {
      type: "mixed",
      diagram: {
        size: 240, r: 0.6,
        pts: [
          { angle: 90, label: "A", color: "#f472b6" },
          { angle: 210, label: "B", color: "#fb923c" },
          { angle: 330, label: "C", color: "#34d399" },
          { angle: 270, label: "D", color: "#60a5fa" },
          { angle: 0, label: "E", color: "#a78bfa" },
        ],
        radii: [
          { angle: 90, color: "rgba(244,114,182,0.3)" },
          { angle: 210, color: "rgba(251,146,60,0.3)" },
          { angle: 330, color: "rgba(52,211,153,0.3)" },
        ],
        chords: [
          { angle1: 90, angle2: 210, color: "rgba(255,255,255,0.25)" },
          { angle1: 210, angle2: 330, color: "rgba(255,255,255,0.25)" },
          { angle1: 330, angle2: 90, color: "rgba(255,255,255,0.25)" },
          { angle1: 270, angle2: 90, color: "rgba(96,165,250,0.4)" },
          { angle1: 270, angle2: 210, color: "rgba(96,165,250,0.4)" },
        ],
      },
      content: tp('q15.content'),
      parts: [
        { label: "a.", math: `\\text{${tp('q15.a.pre')}} \\angle ACB.` },
        { label: "b.", math: `\\text{${tp('q15.a.pre')}} \\angle ADB \\text{ ${tp('q15.b.post')}}` },
        { label: "c.", text: tp('q15.c') },
        { label: "d.", math: `\\text{${tp('q15.d.pre')}} \\angle AEB = \\angle ACB?` },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            {tp('h1')}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 15 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-3">{tp('refBox.label')}</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <BlockMath math={`\\angle \\text{${pusatText}} = 2 \\times \\angle \\text{${kelilingText}} \\text{${busurSamaText}}`} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-body">
              {refCards.map(r => (
                <div key={r.n} className="bg-white/5 rounded-lg px-3 py-2">
                  <span className={`font-bold ${r.c}`}>{r.n}: </span>
                  <span className="text-white/60">{r.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CircleDiagram {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((part, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[36px]">{part.label}</span>
                            {part.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={part.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{part.text}</p>
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
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default SudutPusatKelilingPage;
