import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Crosshair } from "lucide-react";
import CoordPlane from "./CoordPlane";

// ─── Types ────────────────────────────────────────────────────────────────────

type Part = { label: string; math?: string; textKey?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type QuestionItem = {
  n: number; titleKey: string;
  contentKey?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};

// ─── Locale base path ─────────────────────────────────────────────────────────

const BASE = "practice.koordinatCartesius.posisiRelatifTitikAcuan";

// ─── Page ─────────────────────────────────────────────────────────────────────

const PosisiRelatifTitikAcuanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ── Questions array (key references only — no hardcoded Indonesian text) ──
  const questions: QuestionItem[] = [
    // ── Bagian 1: Posisi Relatif terhadap Titik Acuan ─────────────────────
    {
      n: 1, titleKey: "q1.title", type: "mixed",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: 0, y: 0, label: "O(0,0)", color: "#facc15", labelPos: "tr" },
          { x: 3, y: 4, label: "A(3,4)", color: "#f472b6", labelPos: "tr" },
          { x: -2, y: 3, label: "B(−2,3)", color: "#60a5fa", labelPos: "tl" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q1.a" },
        { label: "b.", textKey: "q1.b" },
        { label: "c.", textKey: "q1.c" },
      ],
    },

    {
      n: 2, titleKey: "q2.title", type: "mixed",
      diagram: {
        size: 260, range: 7,
        pts: [
          { x: 2, y: 1, label: "A(2,1)", color: "#facc15", labelPos: "tr" },
          { x: 5, y: 4, label: "P(5,4)", color: "#f472b6", labelPos: "tr" },
          { x: -1, y: 3, label: "Q(−1,3)", color: "#34d399", labelPos: "tl" },
          { x: 2, y: -2, label: "R(2,−2)", color: "#fb923c", labelPos: "br" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q2.a" },
        { label: "b.", textKey: "q2.b" },
        { label: "c.", textKey: "q2.c" },
        { label: "d.", textKey: "q2.d" },
      ],
    },

    {
      n: 3, titleKey: "q3.title", type: "essay",
      contentKey: "q3.content",
      parts: [
        { label: "a.", textKey: "q3.a" },
        { label: "b.", textKey: "q3.b" },
        { label: "c.", textKey: "q3.c" },
      ],
    },

    {
      n: 4, titleKey: "q4.title", type: "essay",
      contentKey: "q4.content",
      parts: [
        { label: "a.", textKey: "q4.a" },
        { label: "b.", textKey: "q4.b" },
        { label: "c.", textKey: "q4.c" },
      ],
    },

    // ── Bagian 2: Posisi Relatif terhadap Suatu Garis ─────────────────────
    {
      n: 5, titleKey: "q5.title", type: "mixed",
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
        { label: "a.", textKey: "q5.a" },
        { label: "b.", textKey: "q5.b" },
        { label: "c.", textKey: "q5.c" },
        { label: "d.", textKey: "q5.d" },
      ],
    },

    {
      n: 6, titleKey: "q6.title", type: "mixed",
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
        { label: "a.", textKey: "q6.a" },
        { label: "b.", textKey: "q6.b" },
        { label: "c.", textKey: "q6.c" },
        { label: "d.", textKey: "q6.d" },
      ],
    },

    {
      n: 7, titleKey: "q7.title", type: "mixed",
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
        { label: "a.", textKey: "q7.a" },
        { label: "b.", textKey: "q7.b" },
        { label: "c.", textKey: "q7.c" },
        { label: "d.", textKey: "q7.d" },
      ],
    },

    {
      n: 8, titleKey: "q8.title", type: "mixed",
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
        { label: "a.", textKey: "q8.a" },
        { label: "b.", textKey: "q8.b" },
        { label: "c.", textKey: "q8.c" },
        { label: "d.", textKey: "q8.d" },
      ],
    },

    {
      n: 9, titleKey: "q9.title", type: "mixed",
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
        // "Garis:" label is natural language — translated via locale key
        { label: t(`${BASE}.q9.lineLabel`), math: "y = 2x + 2" },
        { label: "a.", textKey: "q9.a" },
        { label: "b.", textKey: "q9.b" },
        { label: "c.", textKey: "q9.c" },
      ],
    },

    {
      n: 10, titleKey: "q10.title", type: "mixed",
      contentKey: "q10.content",
      parts: [
        // Pure math coords — no translation needed
        { label: "a.", math: "P(1,\\ 2)" },
        { label: "b.", math: "Q(2,\\ 5)" },
        { label: "c.", math: "R(-1,\\ -4)" },
        { label: "d.", math: "S(0,\\ -1)" },
        { label: "e.", math: "T(3,\\ 7)" },
      ],
    },
  ];

  // ── Reference box 2 rule rows ──────────────────────────────────────────────
  const ruleRows = [
    { ruleKey: "rule1", cond: "y₀ > k" },
    { ruleKey: "rule2", cond: "y₀ < k" },
    { ruleKey: "rule3", cond: "x₀ > k" },
    { ruleKey: "rule4", cond: "x₀ < k" },
    { ruleKey: "rule5", cond: "y₀ > mx₀ + c" },
    { ruleKey: "rule6", cond: "y₀ < mx₀ + c" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 border-2 border-violet-400/40 flex items-center justify-center mb-4">
            <Crosshair className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1">
            {t(`${BASE}.pageTitle`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Koordinat Kartesius · Kelas 8 · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-violet-400 text-sm">🎯</span>
            <span className="text-white/70 text-xs font-body">{t(`${BASE}.badgeText`)}</span>
            <span className="text-violet-400 text-sm">🎯</span>
          </div>
        </div>

        {/* Referensi: Titik Acuan */}
        <div className="mb-4 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">{t(`${BASE}.refBox1Title`)}</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            {t(`${BASE}.refBox1Body`)}
          </p>
        </div>

        {/* Referensi: Posisi terhadap Garis */}
        <div className="mb-6 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-3">{t(`${BASE}.refBox2Title`)}</p>
          <div className="flex flex-col gap-2 text-xs font-body">
            {ruleRows.map(r => (
              <div key={r.ruleKey} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3">
                <span className="text-rose-300 font-bold w-44 shrink-0">{t(`${BASE}.${r.ruleKey}`)}:</span>
                <span className="text-white/60">{r.cond}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q) => (
            <div
              key={q.n}
              className="rounded-2xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-900/30 to-purple-900/20 backdrop-blur"
            >
              <div className="flex items-center gap-3 px-5 py-3 border-b border-violet-500/15 bg-violet-500/10">
                <span className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
                  {q.n}
                </span>
                <span className="font-display text-sm font-bold text-violet-200">{t(`${BASE}.${q.titleKey}`)}</span>
              </div>

              <div className="px-5 py-4 space-y-3">
                {q.diagram && (
                  <div className="flex justify-center my-2">
                    <CoordPlane {...q.diagram} lightBg />
                  </div>
                )}

                {q.contentKey && (
                  <p className="text-white/80 text-sm font-body leading-relaxed">{t(`${BASE}.${q.contentKey}`)}</p>
                )}

                {q.math && (
                  <div className="bg-white/5 rounded-xl px-4 py-2 text-center overflow-x-auto">
                    <BlockMath math={q.math} />
                  </div>
                )}

                {q.parts && (
                  <div className="space-y-2 mt-2">
                    {q.parts.map((p, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-violet-400 font-bold text-sm shrink-0 mt-0.5">{p.label}</span>
                        <div className="flex-1">
                          {p.textKey && <p className="text-white/75 text-sm font-body">{t(`${BASE}.${p.textKey}`)}</p>}
                          {p.math && (
                            <div className="mt-1 overflow-x-auto">
                              <InlineMath math={p.math} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Koordinat Kartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosisiRelatifTitikAcuanPage;
