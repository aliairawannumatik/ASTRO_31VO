import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Ruler } from "lucide-react";
import CoordPlane from "./CoordPlane";

// ─── Types ────────────────────────────────────────────────────────────────────

type Part = { label: string; math?: string; textKey?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type QuestionItem = {
  n: number; titleKey: string;
  contentKey?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed";
};

// ─── Locale base path ─────────────────────────────────────────────────────────

const BASE = "practice.koordinatCartesius.jarakTitikGaris";

// ─── Page ─────────────────────────────────────────────────────────────────────

const JarakTitikGarisPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ── Questions array (key references only — no hardcoded Indonesian text) ──
  const questions: QuestionItem[] = [
    {
      n: 1, titleKey: "q1.title", type: "mixed",
      diagram: {
        size: 260, range: 7,
        pts: [
          { x: 1, y: 2, label: "A(1,2)", color: "#f472b6", labelPos: "tl" },
          { x: 5, y: 5, label: "B(5,5)", color: "#60a5fa", labelPos: "tr" },
        ],
        segs: [{ x1: 1, y1: 2, x2: 5, y2: 5, color: "#facc15", label: "d" }],
      },
      parts: [
        // "Rumus:" label is natural language — translated via locale key
        { label: t(`${BASE}.rumusLabel`), math: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}" },
        { label: "a.", textKey: "q1.a" },
        { label: "b.", textKey: "q1.b" },
      ],
    },

    {
      n: 2, titleKey: "q2.title", type: "mixed",
      diagram: {
        size: 260, range: 7,
        pts: [
          { x: -3, y: 4, label: "P(−3,4)", color: "#f472b6", labelPos: "tl" },
          { x: 5, y: -2, label: "Q(5,−2)", color: "#34d399", labelPos: "br" },
        ],
        segs: [{ x1: -3, y1: 4, x2: 5, y2: -2, color: "#facc15" }],
      },
      parts: [
        // Cases 1 & 2: \text{} with Indonesian — converted to textKey (plain text)
        { label: "a.", textKey: "q2.a" },
        { label: "b.", textKey: "q2.b" },
      ],
    },

    {
      n: 3, titleKey: "q3.title", type: "mixed",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: 3, y: 5, label: "A(3,5)", color: "#f472b6", labelPos: "tr" },
          { x: 3, y: 0, label: "", color: "#f472b6" },
          { x: -4, y: -3, label: "B(−4,−3)", color: "#60a5fa", labelPos: "bl" },
          { x: -4, y: 0, label: "", color: "#60a5fa" },
        ],
        segs: [
          { x1: 3, y1: 5, x2: 3, y2: 0, color: "#f472b6", dashed: true, label: "5" },
          { x1: -4, y1: -3, x2: -4, y2: 0, color: "#60a5fa", dashed: true, label: "3" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q3.a" },
        { label: "b.", textKey: "q3.b" },
        // Case 3: \text{Rumus: jarak ke sumbu-x} = |y| — converted to textKey
        { label: "c.", textKey: "q3.c" },
        { label: "d.", textKey: "q3.d" },
      ],
    },

    {
      n: 4, titleKey: "q4.title", type: "mixed",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: 4, y: 2, label: "P(4,2)", color: "#fb923c", labelPos: "tr" },
          { x: 0, y: 2, label: "", color: "#fb923c" },
          { x: -5, y: -3, label: "Q(−5,−3)", color: "#a78bfa", labelPos: "bl" },
          { x: 0, y: -3, label: "", color: "#a78bfa" },
        ],
        segs: [
          { x1: 4, y1: 2, x2: 0, y2: 2, color: "#fb923c", dashed: true, label: "4" },
          { x1: -5, y1: -3, x2: 0, y2: -3, color: "#a78bfa", dashed: true, label: "5" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q4.a" },
        { label: "b.", textKey: "q4.b" },
        // Case 4: \text{Rumus: jarak ke sumbu-y} = |x| — converted to textKey
        { label: "c.", textKey: "q4.c" },
        { label: "d.", textKey: "q4.d" },
      ],
    },

    {
      n: 5, titleKey: "q5.title", type: "mixed",
      contentKey: "q5.content",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: 2, y: 5, label: "A", color: "#f472b6", labelPos: "tr" },
          { x: -4, y: 1, label: "B", color: "#fb923c", labelPos: "tl" },
          { x: 3, y: -3, label: "C", color: "#34d399", labelPos: "br" },
          { x: -1, y: -4, label: "D", color: "#facc15", labelPos: "bl" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q5.a" },
        { label: "b.", textKey: "q5.b" },
        { label: "c.", textKey: "q5.c" },
        { label: "d.", textKey: "q5.d" },
      ],
    },

    {
      n: 6, titleKey: "q6.title", type: "mixed",
      diagram: {
        size: 260, range: 7,
        pts: [
          { x: 3, y: 6, label: "A(3,6)", color: "#f472b6", labelPos: "tr" },
          { x: 3, y: 2, label: "", color: "#f472b6" },
          { x: -2, y: -1, label: "B(−2,−1)", color: "#60a5fa", labelPos: "bl" },
          { x: -2, y: 2, label: "", color: "#60a5fa" },
        ],
        segs: [
          { x1: -6.5, y1: 2, x2: 6.5, y2: 2, color: "#facc15", label: "y = 2" },
          { x1: 3, y1: 6, x2: 3, y2: 2, color: "#f472b6", dashed: true, label: "?" },
          { x1: -2, y1: -1, x2: -2, y2: 2, color: "#60a5fa", dashed: true, label: "?" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q6.a" },
        { label: "b.", textKey: "q6.b" },
        // Case 5: \text{Rumus: jarak titik } (x_0,y_0) \text{ ke garis } y=k \text{ adalah } |y_0-k|
        // Complex sentence with math symbols in multiple positions → textKey (not pre/mid/post)
        { label: "c.", textKey: "q6.c" },
      ],
    },

    {
      n: 7, titleKey: "q7.title", type: "mixed",
      diagram: {
        size: 260, range: 7,
        pts: [
          { x: -2, y: 4, label: "P(−2,4)", color: "#f472b6", labelPos: "tl" },
          { x: -2, y: 4, label: "", color: "#f472b6" },
          { x: 6, y: -3, label: "Q(6,−3)", color: "#34d399", labelPos: "br" },
        ],
        segs: [
          { x1: 3, y1: -6.5, x2: 3, y2: 6.5, color: "#a78bfa", label: "x=3" },
          { x1: -2, y1: 4, x2: 3, y2: 4, color: "#f472b6", dashed: true, label: "?" },
          { x1: 6, y1: -3, x2: 3, y2: -3, color: "#34d399", dashed: true, label: "?" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q7.a" },
        { label: "b.", textKey: "q7.b" },
        // Case 6: \text{Rumus: jarak titik } (x_0,y_0) \text{ ke garis } x=k \text{ adalah } |x_0-k|
        // Complex sentence with math symbols in multiple positions → textKey (not pre/mid/post)
        { label: "c.", textKey: "q7.c" },
      ],
    },

    {
      n: 8, titleKey: "q8.title", type: "mixed",
      diagram: {
        size: 260, range: 7,
        pts: [
          { x: -4, y: 3, label: "P", color: "#f472b6", labelPos: "tl" },
          { x: 2, y: 3, label: "Q", color: "#fb923c", labelPos: "tr" },
          { x: -1, y: -2, label: "R", color: "#34d399", labelPos: "bl" },
        ],
        segs: [
          { x1: -4, y1: 3, x2: 2, y2: 3, color: "#60a5fa" },
          { x1: 2, y1: 3, x2: -1, y2: -2, color: "#60a5fa" },
          { x1: -1, y1: -2, x2: -4, y2: 3, color: "#60a5fa" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q8.a" },
        { label: "b.", textKey: "q8.b" },
      ],
    },

    {
      n: 9, titleKey: "q9.title", type: "mixed",
      contentKey: "q9.content",
      diagram: {
        size: 260, range: 13,
        pts: [
          { x: 2, y: 3, label: "Rumah", color: "#f472b6", labelPos: "bl" },
          { x: 8, y: 11, label: "Sekolah", color: "#60a5fa", labelPos: "tr" },
        ],
        segs: [{ x1: 2, y1: 3, x2: 8, y2: 11, color: "#facc15", dashed: true }],
      },
      parts: [
        { label: "a.", textKey: "q9.a" },
        { label: "b.", textKey: "q9.b" },
      ],
    },

    {
      n: 10, titleKey: "q10.title", type: "mixed",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: -3, y: -2, label: "A", color: "#f472b6", labelPos: "bl" },
          { x: 4, y: -2, label: "B", color: "#fb923c", labelPos: "br" },
          { x: 4, y: 3, label: "C", color: "#34d399", labelPos: "tr" },
          { x: -3, y: 3, label: "D", color: "#facc15", labelPos: "tl" },
        ],
        segs: [
          { x1: -3, y1: -2, x2: 4, y2: -2, color: "rgba(0,0,0,0.35)" },
          { x1: 4, y1: -2, x2: 4, y2: 3, color: "rgba(0,0,0,0.35)" },
          { x1: 4, y1: 3, x2: -3, y2: 3, color: "rgba(0,0,0,0.35)" },
          { x1: -3, y1: 3, x2: -3, y2: -2, color: "rgba(0,0,0,0.35)" },
          { x1: -3, y1: -2, x2: 4, y2: 3, color: "#60a5fa", dashed: true, label: "d₁" },
          { x1: 4, y1: -2, x2: -3, y2: 3, color: "#f472b6", dashed: true, label: "d₂" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q10.a" },
        { label: "b.", textKey: "q10.b" },
        { label: "c.", textKey: "q10.c" },
      ],
    },

    {
      n: 11, titleKey: "q11.title", type: "mixed",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: 0, y: 0, label: "O", color: "#f472b6", labelPos: "bl" },
          { x: 5, y: 0, label: "A(5,0)", color: "#fb923c", labelPos: "br" },
          { x: 0, y: 4, label: "B(0,4)", color: "#34d399", labelPos: "tl" },
        ],
        segs: [
          { x1: 0, y1: 0, x2: 5, y2: 0, color: "#60a5fa" },
          { x1: 5, y1: 0, x2: 0, y2: 4, color: "#60a5fa" },
          { x1: 0, y1: 4, x2: 0, y2: 0, color: "#60a5fa" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q11.a" },
        { label: "b.", textKey: "q11.b" },
        { label: "c.", textKey: "q11.c" },
      ],
    },

    {
      n: 12, titleKey: "q12.title", type: "mixed",
      diagram: {
        size: 260, range: 8,
        pts: [
          { x: -4, y: 2, label: "A(−4,2)", color: "#f472b6", labelPos: "tl" },
          { x: 6, y: 8, label: "B(6,8)", color: "#60a5fa", labelPos: "tr" },
          { x: 1, y: 5, label: "M", color: "#facc15", labelPos: "br" },
        ],
        segs: [
          { x1: -4, y1: 2, x2: 6, y2: 8, color: "rgba(255,255,255,0.25)", dashed: true },
          { x1: -4, y1: 2, x2: 1, y2: 5, color: "#f472b6" },
          { x1: 1, y1: 5, x2: 6, y2: 8, color: "#60a5fa" },
        ],
      },
      parts: [
        { label: t(`${BASE}.rumusLabel`), math: "M = \\left(\\frac{x_1 + x_2}{2},\\ \\frac{y_1 + y_2}{2}\\right)" },
        { label: "a.", textKey: "q12.a" },
        { label: "b.", textKey: "q12.b" },
        { label: "c.", textKey: "q12.c" },
      ],
    },

    {
      n: 13, titleKey: "q13.title", type: "mixed",
      diagram: {
        size: 260, range: 8,
        pts: [
          { x: -3, y: -1, label: "A(−3,−1)", color: "#f472b6", labelPos: "bl" },
          { x: 5, y: 5, label: "B(5,5)", color: "#60a5fa", labelPos: "tr" },
          { x: 1, y: 2, label: "P", color: "#facc15", labelPos: "br" },
        ],
        segs: [
          { x1: -3, y1: -1, x2: 5, y2: 5, color: "#facc15", dashed: true },
        ],
        circles: [
          { cx: 1, cy: 2, r: 5, color: "#34d399" },
        ],
      },
      parts: [
        // "Diket:" label is natural language — translated via locale key
        { label: t(`${BASE}.diketLabel`), textKey: "q13.diket" },
        { label: "a.", textKey: "q13.a" },
        { label: "b.", textKey: "q13.b" },
        { label: "c.", textKey: "q13.c" },
      ],
    },
  ];

  // ── Reference box rows (label translated, math stays hardcoded) ───────────
  const refRows = [
    { labelKey: "refRow1", math: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}" },
    { labelKey: "refRow2", math: "d = |y_0|" },
    { labelKey: "refRow3", math: "d = |x_0|" },
    { labelKey: "refRow4", math: "d = |y_0 - k|" },
    { labelKey: "refRow5", math: "d = |x_0 - k|" },
    { labelKey: "refRow6", math: "M = \\left(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2}\\right)" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-teal-500/20 border-2 border-teal-400/60 flex items-center justify-center mb-3">
            <Ruler className="w-7 h-7 text-teal-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-teal-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(45,212,191,0.7)' }}>
            {t(`${BASE}.pageTitle`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Koordinat Kartesius · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 rounded-lg px-4 py-2">
            <span className="text-teal-400 text-xs font-bold">📋 13 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-teal-900/20 border border-teal-500/20 rounded-xl p-4">
          <p className="text-teal-300 text-xs font-bold mb-3">{t(`${BASE}.infoBoxTitle`)}</p>
          <div className="flex flex-col gap-2">
            {refRows.map((r, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <span className="text-white/40 text-[10px] shrink-0 w-32">{t(`${BASE}.${r.labelKey}`)}</span>
                <div className="text-teal-200 text-sm"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-slate-900/80 to-cyan-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-teal-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-400 to-cyan-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/50 flex items-center justify-center shrink-0">
                    <span className="text-teal-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-teal-400 text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {t(`${BASE}.${q.titleKey}`)}
                    </span>
                    {q.contentKey && (
                      <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">
                        {t(`${BASE}.${q.contentKey}`)}
                      </p>
                    )}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CoordPlane {...q.diagram} lightBg />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-teal-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">
                                  {p.textKey ? t(`${BASE}.${p.textKey}`) : ''}
                                </p>
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
            className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Koordinat Kartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default JarakTitikGarisPage;
