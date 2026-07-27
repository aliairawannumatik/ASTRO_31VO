import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import CoordPlane from "../koordinat-cartesius/CoordPlane";

type Part   = { label: string; math?: string; text?: string };
type Choice = { key: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  choices?: Choice[];
  type: "essay" | "mixed" | "diagram-only" | "mc";
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

/* ─── colour helpers ──────────────────────────────────────── */
const BADGE_COLOR: Record<number, string> = {
  1: "from-green-500 to-teal-600",
  2: "from-green-500 to-teal-600",
  3: "from-green-500 to-teal-600",
  4: "from-green-500 to-teal-600",
  5: "from-blue-500 to-cyan-600",
  6: "from-violet-500 to-purple-600",
  7: "from-orange-500 to-amber-600",
  8: "from-orange-500 to-amber-600",
  9: "from-orange-500 to-amber-600",
  10: "from-orange-500 to-amber-600",
};
const CARD_COLOR: Record<number, string> = {
  1: "border-green-500/20 from-green-900/20 via-slate-900/40 to-teal-900/20",
  2: "border-green-500/20 from-green-900/20 via-slate-900/40 to-teal-900/20",
  3: "border-green-500/20 from-green-900/20 via-slate-900/40 to-teal-900/20",
  4: "border-green-500/20 from-green-900/20 via-slate-900/40 to-teal-900/20",
  5: "border-blue-500/20 from-blue-900/20 via-slate-900/40 to-cyan-900/20",
  6: "border-violet-500/20 from-violet-900/20 via-slate-900/40 to-purple-900/20",
  7: "border-orange-500/20 from-orange-900/20 via-slate-900/40 to-amber-900/20",
  8: "border-orange-500/20 from-orange-900/20 via-slate-900/40 to-amber-900/20",
  9: "border-orange-500/20 from-orange-900/20 via-slate-900/40 to-amber-900/20",
  10: "border-orange-500/20 from-orange-900/20 via-slate-900/40 to-amber-900/20",
};
const TITLE_COLOR: Record<number, string> = {
  1: "text-green-300",
  2: "text-green-300",
  3: "text-green-300",
  4: "text-green-300",
  5: "text-blue-300",
  6: "text-violet-300",
  7: "text-orange-300",
  8: "text-orange-300",
  9: "text-orange-300",
  10: "text-orange-300",
};

const MenentukanPGLPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.persamaanGarisLurus.menentukanPgl';

  const questions: Q[] = [
    /* ─────────────────────────────────────────────
       SOAL ESSAY / URAIAN
    ───────────────────────────────────────────── */
    Qf(1, t(`${p}.q1.title`), {
      type: "mixed",
      content: t(`${p}.q1.content`),
      parts: [
        { label: "a.", math: "P(2,\\ 5),\\ m = 3" },
        { label: "b.", math: "P(-1,\\ 4),\\ m = -2" },
        { label: "c.", math: "P(0,\\ -3),\\ m = \\tfrac{1}{2}" },
        { label: "d.", math: "P(4,\\ -1),\\ m = -\\tfrac{3}{4}" },
      ],
    }),

    Qf(2, t(`${p}.q2.title`), {
      type: "mixed",
      content: t(`${p}.q2.content`),
      parts: [
        { label: "a.", math: `A(1,\\ 4) \\text{ ${t(`${p}.and`)} } B(3,\\ 8)` },
        { label: "b.", math: `C(-2,\\ 3) \\text{ ${t(`${p}.and`)} } D(4,\\ 0)` },
        { label: "c.", math: `E(0,\\ -5) \\text{ ${t(`${p}.and`)} } F(5,\\ 5)` },
        { label: "d.", math: `G(-3,\\ -2) \\text{ ${t(`${p}.and`)} } H(2,\\ 8)` },
      ],
    }),

    Qf(3, t(`${p}.q3.title`), {
      type: "mixed",
      content: t(`${p}.q3.content`),
      diagram: {
        size: 260, range: 6, lightBg: true,
        pts: [
          { x: 4, y: 0, label: "(4,0)", color: "#b45309", labelPos: "bot" },
          { x: 0, y: 3, label: "(0,3)", color: "#b45309", labelPos: "tr" },
        ],
        segs: [{ x1: -2, y1: 4.5, x2: 6, y2: -1.5, color: "#b45309" }],
      },
      parts: [
        { label: "a.", text: t(`${p}.q3.pA`) },
        { label: "b.", text: t(`${p}.q3.pB`) },
        { label: "c.", text: t(`${p}.q3.pC`) },
      ],
    }),

    Qf(4, t(`${p}.q4.title`), {
      type: "mixed",
      content: t(`${p}.q4.content`),
      diagram: {
        size: 260, range: 6, lightBg: true,
        pts: [
          { x: 0, y: 0, label: "O(0,0)", color: "#0369a1", labelPos: "bl" },
          { x: 3, y: 4, label: "(3,4)", color: "#0369a1", labelPos: "tr" },
        ],
        segs: [{ x1: -4.5, y1: -6, x2: 4.5, y2: 6, color: "#0369a1" }],
      },
      parts: [
        { label: "a.", text: t(`${p}.q4.pA`) },
        { label: "b.", text: t(`${p}.q4.pB`) },
        { label: "c.", text: t(`${p}.q4.pC`) },
      ],
    }),

    /* ─────────────────────────────────────────────
       SOAL SEJAJAR (PARALLEL)
    ───────────────────────────────────────────── */
    Qf(5, t(`${p}.q5.title`), {
      type: "mixed",
      content: t(`${p}.q5.content`),
      parts: [
        { label: "a.", math: `P(3,\\ -1),\\ \\text{${t(`${p}.parallel`)}}\\ y = 2x + 5` },
        { label: "b.", math: `P(-2,\\ 4),\\ \\text{${t(`${p}.parallel`)}}\\ 3x - y + 1 = 0` },
        { label: "c.", math: `P(1,\\ -3),\\ \\text{${t(`${p}.parallel`)}}\\ x + 2y - 6 = 0` },
      ],
    }),

    /* ─────────────────────────────────────────────
       SOAL TEGAK LURUS (PERPENDICULAR)
    ───────────────────────────────────────────── */
    Qf(6, t(`${p}.q6.title`), {
      type: "mixed",
      content: t(`${p}.q6.content`),
      parts: [
        { label: "a.", math: `P(2,\\ 1),\\ \\text{${t(`${p}.perpendicular`)}}\\ y = 3x - 4` },
        { label: "b.", math: `P(-1,\\ 5),\\ \\text{${t(`${p}.perpendicular`)}}\\ 2x - 3y + 6 = 0` },
        { label: "c.", math: `P(4,\\ -2),\\ \\text{${t(`${p}.perpendicular`)}}\\ x + 4y - 8 = 0` },
      ],
    }),

    /* ─────────────────────────────────────────────
       SOAL PILIHAN GANDA — BERBASIS GAMBAR
    ───────────────────────────────────────────── */

    // Soal 7 — dua garis sejajar (slope -3); h melalui (0,4)
    Qf(7, t(`${p}.q7.title`), {
      type: "mc",
      diagram: {
        size: 280, range: 8, lightBg: true,
        segs: [
          // garis referensi tanpa label: melalui (-2,0) dan (0,-6), slope -3
          { x1: -4, y1: 6, x2: 0.67, y2: -8, color: "#7c3aed" },
          // garis h: melalui (0,4), slope -3, sejajar garis referensi
          { x1: -1.33, y1: 8, x2: 3.33, y2: -6, color: "#b45309", label: "h" },
        ],
        pts: [
          { x: -2, y: 0,  color: "#7c3aed", labelPos: "tl" },
          { x: 0,  y: -6, color: "#7c3aed", labelPos: "tl" },
          { x: 0,  y: 4,  color: "#b45309", labelPos: "tr" },
        ],
        // tanda panah sejajar pada kedua garis (slope -3, arah sama)
        arrowMarks: [
          { x: -1.5, y: -1.5, slope: -3, color: "#7c3aed" },
          { x:  0.5, y:  2.5, slope: -3, color: "#b45309" },
        ],
      },
      content: t(`${p}.q7.content`),
      choices: [
        { key: "A", math: "3x + y = 4" },
        { key: "B", math: "3x - y = 4" },
        { key: "C", math: "x + 3y = 4" },
        { key: "D", math: "x - 3y = 4" },
      ],
    }),

    // Soal 8 — dua garis tegak lurus berpotongan di (4,0)
    Qf(8, t(`${p}.q8.title`), {
      type: "mc",
      diagram: {
        size: 270, range: 6, lightBg: true,
        segs: [
          // garis referensi: melalui (0,3) dan (4,0), slope -3/4
          { x1: -4, y1: 6, x2: 6, y2: -1.5, color: "#7c3aed" },
          // garis b: tegak lurus di (4,0), slope 4/3
          { x1: -0.5, y1: -6, x2: 5, y2: 1.33, color: "#b45309", label: "b" },
        ],
        pts: [
          { x: 0, y: 3,  label: "3", color: "#7c3aed", labelPos: "tl" },
          { x: 4, y: 0,  label: "4", color: "#b45309", labelPos: "bot" },
        ],
        rightAngleMarks: [
          { points: [[4.28, -0.21], [4.49, 0.07], [4.21, 0.28]], color: "#1e293b" },
        ],
      },
      content: t(`${p}.q8.content`),
      choices: [
        { key: "A", math: "y = \\tfrac{3}{4}x - \\tfrac{16}{3}" },
        { key: "B", math: "y = \\tfrac{4}{3}x - \\tfrac{16}{3}" },
        { key: "C", math: "y = \\tfrac{3}{4}x + \\tfrac{16}{3}" },
        { key: "D", math: "y = \\tfrac{4}{3}x + \\tfrac{16}{3}" },
      ],
    }),

    // Soal 9 — garis a (biru) melalui (0,4)&(6,0), slope -2/3; garis b (kuning) tegak lurus a melalui (2,3), slope 3/2
    Qf(9, t(`${p}.q9.title`), {
      type: "mc",
      diagram: {
        size: 280, range: 7, lightBg: true,
        segs: [
          // garis a (biru): melalui (0,4) dan (6,0), slope -2/3
          { x1: -4.5, y1: 7, x2: 7, y2: -0.67, color: "#1d4ed8", label: "a" },
          // garis b (kuning): melalui O(0,0) dan (2,3), slope 3/2; tegak lurus a
          { x1: -4.67, y1: -7, x2: 4.67, y2: 7, color: "#b45309", label: "b" },
        ],
        pts: [
          { x: 0, y: 4,  label: "4",     color: "#1d4ed8", labelPos: "tl" },
          { x: 6, y: 0,  label: "6",     color: "#1d4ed8", labelPos: "br" },
          { x: 2, y: 3,  label: "(2,3)", color: "#b45309", labelPos: "tr" },
        ],
        rightAngleMarks: [
          // tanda tegak lurus di titik potong (~1.85, 2.77)
          { points: [[2.10, 2.60], [2.27, 2.85], [2.01, 3.02]], color: "#1e293b" },
        ],
      },
      content: t(`${p}.q9.content`),
      choices: [
        { key: "A", math: "2y - 3x = -5" },
        { key: "B", math: "2y - 3x = 0" },
        { key: "C", math: "3y - 2x = 5" },
        { key: "D", math: "3y - 2x = 0" },
      ],
    }),

    // Soal 10 — tiga garis q, ℓ, p; q⊥p di (-6,0); ℓ∥p melalui (0,9)
    Qf(10, t(`${p}.q10.title`), {
      type: "mc",
      diagram: {
        size: 300, range: 10, lightBg: true,
        segs: [
          // garis q: melalui (-6,0) dan (0,9), slope 3/2
          { x1: -10, y1: -6, x2: 0.67, y2: 10, color: "#1d4ed8", label: "q" },
          // garis ℓ: melalui (0,9), slope -2/3 (sejajar p)
          { x1: -1.5, y1: 10, x2: 10, y2: 2.33, color: "#b45309", label: "ℓ" },
          // garis p: melalui (-6,0) dan (0,-4), slope -2/3 (tegak lurus q)
          { x1: -10, y1: 2.67, x2: 9, y2: -10, color: "#be185d", label: "p" },
        ],
        pts: [
          { x: -6, y: 0, color: "#475569", labelPos: "tl" },
          { x: 0,  y: 9, color: "#b45309", labelPos: "tr" },
          { x: 0,  y: -4, color: "#be185d", labelPos: "bl" },
        ],
        rightAngleMarks: [
          { points: [[-5.72, 0.42], [-5.30, 0.14], [-5.58, -0.28]], color: "#1e293b" },
        ],
        // tanda panah sejajar pada garis ℓ dan p (slope -2/3, arah sama)
        arrowMarks: [
          { x:  3, y:  7, slope: -2/3, color: "#b45309" },
          { x: -3, y: -2, slope: -2/3, color: "#be185d" },
        ],
      },
      content: t(`${p}.q10.content`),
      choices: [
        { key: "A", math: "2x + 3y - 27 = 0" },
        { key: "B", math: "2x + 3y + 27 = 0" },
        { key: "C", math: "2x - 3y - 27 = 0" },
        { key: "D", math: "3x + 2y - 27 = 0" },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-green-400 text-xs font-body">
              {questions.length} {t('practice.suffixSoal')} {t(`${p}.badgeSuffix`)}
            </span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            {t(`${p}.h1`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">
            {t(`${p}.grade`)}
          </p>
        </div>

        {/* ── Section labels ── */}
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-2 text-xs font-body text-white/40">
            <span className="w-2 h-2 rounded-full bg-green-500/60" />
            {t(`${p}.sec1`)}
          </div>
          <div className="flex items-center gap-2 text-xs font-body text-white/40">
            <span className="w-2 h-2 rounded-full bg-blue-500/60" />
            {t(`${p}.sec2`)}
          </div>
          <div className="flex items-center gap-2 text-xs font-body text-white/40">
            <span className="w-2 h-2 rounded-full bg-violet-500/60" />
            {t(`${p}.sec3`)}
          </div>
          <div className="flex items-center gap-2 text-xs font-body text-white/40">
            <span className="w-2 h-2 rounded-full bg-orange-500/60" />
            {t(`${p}.sec4`)}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className={`rounded-2xl border bg-gradient-to-br backdrop-blur p-5 animate-slide-up ${CARD_COLOR[q.n] ?? CARD_COLOR[1]}`}
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              {/* ── Question header ── */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${BADGE_COLOR[q.n] ?? BADGE_COLOR[1]} flex items-center justify-center text-white text-xs font-bold shadow`}>
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-body font-semibold uppercase tracking-wider mb-1 ${TITLE_COLOR[q.n] ?? TITLE_COLOR[1]}`}>
                    {q.title}
                  </p>
                  {q.content && (
                    <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                  )}
                  {q.math && (
                    <div className="text-white/90 text-sm mt-1"><InlineMath math={q.math} /></div>
                  )}
                </div>
              </div>

              {/* ── Diagram ── */}
              {q.diagram && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-lg">
                    <CoordPlane {...q.diagram} />
                  </div>
                </div>
              )}

              {/* ── Essay / mixed sub-parts ── */}
              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((pt, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className={`text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px] ${TITLE_COLOR[q.n] ?? TITLE_COLOR[1]}`}>
                        {pt.label}
                      </span>
                      <div className="text-white/75 text-sm font-body leading-relaxed">
                        {pt.math ? <InlineMath math={pt.math} /> : <span>{pt.text}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Multiple-choice options ── */}
              {q.choices && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {q.choices.map((c) => (
                    <div
                      key={c.key}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <span className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold font-body
                        ${TITLE_COLOR[q.n] ?? TITLE_COLOR[1]} border-current`}>
                        {c.key}
                      </span>
                      <div className="text-white/80 text-sm font-body">
                        {c.math ? <InlineMath math={c.math} /> : <span>{c.text}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Back button ── */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} {t(`${p}.backTo`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenentukanPGLPage;
