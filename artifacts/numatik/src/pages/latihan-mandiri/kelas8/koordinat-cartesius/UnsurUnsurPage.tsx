import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { MapPin } from "lucide-react";
import CoordPlane from "./CoordPlane";

// ─── Types ────────────────────────────────────────────────────────────────────

type Part = { label: string; math?: string; textKey?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type QuestionItem = {
  n: number;
  titleKey: string;
  contentKey?: string;
  parts?: Part[];
  diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};

// ─── Locale base path ─────────────────────────────────────────────────────────

const BASE = "practice.koordinatCartesius.unsurUnsur";

// ─── Page ─────────────────────────────────────────────────────────────────────

const UnsurUnsurPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ── \text{} interpolation variable ───────────────────────────────────────
  // Used as a \text{} connector inside math strings for Q6 parts.
  const danWord = t(`${BASE}.danWord`); // "dan" / "and" / "と"

  // ── Questions array (key references only — no hardcoded Indonesian text) ──
  const questions: QuestionItem[] = [
    {
      n: 1, titleKey: "q1.title", type: "mixed",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: 4, y: 3, label: "A(?,?)", color: "#f472b6", labelPos: "tr" },
          { x: -3, y: 5, label: "B(?,?)", color: "#fb923c", labelPos: "tl" },
          { x: -4, y: -2, label: "C(?,?)", color: "#a78bfa", labelPos: "bl" },
          { x: 2, y: -4, label: "D(?,?)", color: "#34d399", labelPos: "br" },
          { x: 0, y: 3, label: "E(?,?)", color: "#facc15", labelPos: "tr" },
          { x: -5, y: 0, label: "F(?,?)", color: "#f87171", labelPos: "top" },
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
        size: 260, range: 6,
        pts: [
          { x: 3, y: 4, label: "P", color: "#f472b6", labelPos: "tr" },
          { x: -2, y: 3, label: "Q", color: "#fb923c", labelPos: "tl" },
          { x: -4, y: -3, label: "R", color: "#a78bfa", labelPos: "bl" },
          { x: 5, y: -2, label: "S", color: "#34d399", labelPos: "br" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q2.a" },
        { label: "b.", textKey: "q2.b" },
      ],
    },

    {
      n: 3, titleKey: "q3.title", type: "mixed",
      contentKey: "q3.content",
      parts: [
        // Pure math coords — no translation needed
        { label: "a.", math: "A(5,\\ 3)" },
        { label: "b.", math: "B(-2,\\ 4)" },
        { label: "c.", math: "C(-3,\\ -1)" },
        { label: "d.", math: "D(4,\\ -5)" },
        { label: "e.", math: "E(0,\\ 7)" },
        { label: "f.", math: "F(-6,\\ 0)" },
        { label: "g.", math: "G(0,\\ -4)" },
        { label: "h.", math: "H(0,\\ 0)" },
      ],
    },

    {
      n: 4, titleKey: "q4.title", type: "mixed",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: 4, y: 0, label: "K", color: "#facc15", labelPos: "top" },
          { x: 0, y: 3, label: "L", color: "#60a5fa", labelPos: "tr" },
          { x: -3, y: 0, label: "M", color: "#f472b6", labelPos: "top" },
          { x: 0, y: -4, label: "N", color: "#34d399", labelPos: "tr" },
          { x: 3, y: 2, label: "P", color: "#fb923c", labelPos: "tr" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q4.a" },
        { label: "b.", textKey: "q4.b" },
        { label: "c.", textKey: "q4.c" },
      ],
    },

    {
      n: 5, titleKey: "q5.title", type: "mixed",
      contentKey: "q5.content",
      parts: [
        { label: "a.", textKey: "q5.a" },
        { label: "b.", textKey: "q5.b" },
        { label: "c.", textKey: "q5.c" },
      ],
    },

    {
      n: 6, titleKey: "q6.title", type: "mixed",
      contentKey: "q6.content",
      parts: [
        // Case 1–3: \text{ dan } connector → danWord interpolation
        { label: "a.", math: `A(2,\\ 4) \\text{ ${danWord} } B(6,\\ 8)` },
        { label: "b.", math: `C(-3,\\ 5) \\text{ ${danWord} } D(7,\\ -1)` },
        { label: "c.", math: `E(0,\\ 0) \\text{ ${danWord} } F(-4,\\ -6)` },
      ],
    },

    {
      n: 7, titleKey: "q7.title", type: "mixed",
      contentKey: "q7.content",
      parts: [
        // Pure math coords — no translation needed
        { label: "a.", math: "P(1,\\ 2),\\ M(3,\\ 5)" },
        { label: "b.", math: "P(-4,\\ 6),\\ M(0,\\ 2)" },
        { label: "c.", math: "P(3,\\ -5),\\ M(-1,\\ 1)" },
      ],
    },

    {
      n: 8, titleKey: "q8.title", type: "mixed",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: 4, y: 3, label: "A(4,3)", color: "#f472b6", labelPos: "tr" },
          { x: 4, y: 0, label: "", color: "#f472b6" },
        ],
        segs: [
          { x1: 4, y1: 3, x2: 4, y2: 0, color: "#f472b6", dashed: true, label: "?" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q8.a" },
        // Case 4: \text{Jika } P(x, y) \text{, rumus jarak ke sumbu-x adalah } ...
        // Full sentence containing math in middle → moved to textKey (not interpolation)
        { label: "b.", textKey: "q8.b" },
        { label: "c.", textKey: "q8.c" },
      ],
    },

    {
      n: 9, titleKey: "q9.title", type: "mixed",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: -4, y: 3, label: "B(−4,3)", color: "#60a5fa", labelPos: "tl" },
          { x: 0, y: 3, label: "", color: "#60a5fa" },
        ],
        segs: [
          { x1: -4, y1: 3, x2: 0, y2: 3, color: "#60a5fa", dashed: true, label: "?" },
        ],
      },
      parts: [
        { label: "a.", textKey: "q9.a" },
        // Case 5: \text{Jika } P(x, y) \text{, rumus jarak ke sumbu-y adalah } ...
        // Full sentence containing math in middle → moved to textKey (not interpolation)
        { label: "b.", textKey: "q9.b" },
        { label: "c.", textKey: "q9.c" },
      ],
    },

    {
      n: 10, titleKey: "q10.title", type: "mixed",
      diagram: {
        size: 260, range: 6,
        pts: [
          { x: 1, y: 1, label: "A(1,1)", color: "#f472b6", labelPos: "bl" },
          { x: 5, y: 1, label: "B(5,1)", color: "#fb923c", labelPos: "br" },
          { x: 5, y: 4, label: "C(5,4)", color: "#34d399", labelPos: "tr" },
          { x: 1, y: 4, label: "D(?,?)", color: "#facc15", labelPos: "tl" },
        ],
        segs: [
          { x1: 1, y1: 1, x2: 5, y2: 1, color: "rgba(255,255,255,0.3)" },
          { x1: 5, y1: 1, x2: 5, y2: 4, color: "rgba(255,255,255,0.3)" },
          { x1: 5, y1: 4, x2: 1, y2: 4, color: "rgba(255,255,255,0.3)" },
          { x1: 1, y1: 4, x2: 1, y2: 1, color: "rgba(255,255,255,0.3)", dashed: true },
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
          { x: -3, y: -2, label: "A", color: "#f472b6", labelPos: "bl" },
          { x: 4, y: -2, label: "B", color: "#fb923c", labelPos: "br" },
          { x: 1, y: 4, label: "C", color: "#34d399", labelPos: "top" },
        ],
        segs: [
          { x1: -3, y1: -2, x2: 4, y2: -2, color: "#60a5fa" },
          { x1: 4, y1: -2, x2: 1, y2: 4, color: "#60a5fa" },
          { x1: 1, y1: 4, x2: -3, y2: -2, color: "#60a5fa" },
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
      contentKey: "q12.content",
      parts: [
        { label: "a.", textKey: "q12.a" },
        { label: "b.", textKey: "q12.b" },
      ],
    },

    {
      n: 13, titleKey: "q13.title", type: "mixed",
      contentKey: "q13.content",
      parts: [
        { label: "a.", textKey: "q13.a" },
        { label: "b.", textKey: "q13.b" },
      ],
    },

    {
      n: 14, titleKey: "q14.title", type: "essay",
      diagram: {
        size: 260, range: 7,
        pts: [
          { x: -1, y: 2, label: "A(−1, 2)", color: "#f472b6", labelPos: "tl" },
          { x: 3, y: -5, label: "(3, −5)", color: "#60a5fa", labelPos: "br" },
          { x: 3, y: 4, label: "(3, 4)", color: "#60a5fa", labelPos: "tr" },
        ],
        segs: [
          { x1: 3, y1: -5, x2: 3, y2: 4, color: "#60a5fa", label: "garis" },
          { x1: -1, y1: 2, x2: 3, y2: 2, color: "#f472b6", dashed: true, label: "?" },
        ],
      },
      contentKey: "q14.content",
    },

    {
      n: 15, titleKey: "q15.title", type: "mixed",
      contentKey: "q15.content",
      parts: [
        { label: "(1)", textKey: "q15.1" },
        { label: "(2)", textKey: "q15.2" },
        { label: "(3)", textKey: "q15.3" },
        { label: "(4)", textKey: "q15.4" },
      ],
    },
  ];

  // ── Quadrant info box rows ─────────────────────────────────────────────────
  const quadrantRows = [
    { q: t(`${BASE}.quadrantI`),   c: "x > 0, y > 0", col: "text-yellow-400" },
    { q: t(`${BASE}.quadrantII`),  c: "x < 0, y > 0", col: "text-violet-400" },
    { q: t(`${BASE}.quadrantIII`), c: "x < 0, y < 0", col: "text-emerald-400" },
    { q: t(`${BASE}.quadrantIV`),  c: "x > 0, y < 0", col: "text-rose-400" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <MapPin className="w-7 h-7 text-sky-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            {t(`${BASE}.pageTitle`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Koordinat Kartesius · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 15 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-2">{t(`${BASE}.infoBoxTitle`)}</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {quadrantRows.map(r => (
              <div key={r.q} className="bg-white/5 rounded-lg px-3 py-2">
                <span className={`font-bold ${r.col}`}>{r.q}: </span>
                <span className="text-white/60">{r.c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {t(`${BASE}.${q.titleKey}`)}
                    </span>
                    {q.contentKey && (
                      <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">
                        {t(`${BASE}.${q.contentKey}`)}
                      </p>
                    )}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CoordPlane {...q.diagram} lightBg={true} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Koordinat Kartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsurUnsurPage;
