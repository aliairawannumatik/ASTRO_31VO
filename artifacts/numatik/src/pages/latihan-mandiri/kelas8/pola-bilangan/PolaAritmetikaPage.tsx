import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { TrendingUp } from "lucide-react";

// ─── SVG Illustrations ────────────────────────────────────────────────────────
// NOTE: All <text> elements inside SVGs are intentionally left hardcoded in
// Indonesian and must NOT be translated (per project rules).

const SvgBarisanObjek = () => {
  const terms = [7, 11, 15, 19];
  const dotsPerRow = 5;
  const dotR = 5;
  const dx = 14;
  const dy = 14;
  const groupCenters = [42, 138, 234, 330];
  const topY = 14;
  const labelY = 80;

  return (
    <svg viewBox="0 0 374 92" className="w-full max-w-md mx-auto my-3" aria-label="Ilustrasi barisan aritmetika dengan bola">
      {terms.map((count, gi) => {
        const cx0 = groupCenters[gi] - Math.floor(dotsPerRow / 2) * dx;
        return (
          <g key={gi}>
            {Array.from({ length: count }, (_, i) => {
              const col = i % dotsPerRow;
              const row = Math.floor(i / dotsPerRow);
              return (
                <circle
                  key={i}
                  cx={cx0 + col * dx}
                  cy={topY + row * dy}
                  r={dotR}
                  fill="#34d399"
                  stroke="#064e3b"
                  strokeWidth="0.8"
                  opacity="0.92"
                />
              );
            })}
            <text x={groupCenters[gi]} y={labelY} textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="bold">
              {`U${gi + 1}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const SvgBatuBata = () => {
  const brickW = 28;
  const brickH = 14;
  const gap = 3;
  const rowGap = 5;
  const maxBricks = 16;
  const svgW = maxBricks * (brickW + gap) + 20;

  return (
    <svg viewBox={`0 0 ${svgW} 170`} className="w-full max-w-lg mx-auto my-3" aria-label="Ilustrasi tumpukan batu bata">
      {[8, 10, 12, 14].map((count, ri) => {
        const y = ri * (brickH + rowGap) + 10;
        const totalW = count * (brickW + gap) - gap;
        const startX = (svgW - totalW) / 2;
        return (
          <g key={ri}>
            {Array.from({ length: count }, (_, bi) => (
              <rect key={bi} x={startX + bi * (brickW + gap)} y={y} width={brickW} height={brickH}
                rx={2} fill="#b45309" stroke="#fbbf24" strokeWidth="0.8" />
            ))}
          </g>
        );
      })}
      <text x={svgW / 2} y={4 * (brickH + rowGap) + 22} textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="bold">⋮</text>
      {(() => {
        const lastCount = 36;
        const lastY = 4 * (brickH + rowGap) + 50;
        const totalW = Math.min(lastCount, maxBricks) * (brickW + gap) - gap;
        const startX = (svgW - totalW) / 2;
        return (
          <g>
            {Array.from({ length: Math.min(lastCount, maxBricks) }, (_, bi) => (
              <rect key={bi} x={startX + bi * (brickW + gap)} y={lastY} width={brickW} height={brickH}
                rx={2} fill="#7c3aed" stroke="#c4b5fd" strokeWidth="0.8" />
            ))}
          </g>
        );
      })()}
    </svg>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────

type PartItem = { label: string; math?: string; textKey?: string };

type QuestionItem = {
  number: number;
  titleKey: string;
  contentKey: string;
  type: "essay" | "mixed";
  parts?: PartItem[];
  svgNode?: React.ReactNode;
};

// ─── Locale base path ─────────────────────────────────────────────────────────

const BASE = "practice.polaBilangan.polaAritmetika";

// ─── Page ─────────────────────────────────────────────────────────────────────

const PolaAritmetikaPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ── \text{} interpolation variables ──────────────────────────────────────
  // Computed here (inside the component) so t() hook is in scope.
  // Each variable holds the locale-appropriate word/phrase for its position.
  // For Japanese, pre-variables are empty ("") and post-variables carry the verb.
  const hitungNilaiPre    = t(`${BASE}.hitungNilaiPre`);   // "Hitung nilai" / "Calculate the value of" / ""
  const hitungNilaiPost   = t(`${BASE}.hitungNilaiPost`);  // ""             / ""                        / "の値を求めよ"
  const tentukanNilaiPre  = t(`${BASE}.tentukanNilaiPre`); // "Tentukan nilai" / "Determine the value of" / ""
  const tentukanNilaiPost = t(`${BASE}.tentukanNilaiPost`);// ""               / ""                       / "の値を求めよ"
  const hitungPre         = t(`${BASE}.hitungPre`);        // "Hitung" / "Calculate" / ""
  const hitungPost        = t(`${BASE}.hitungPost`);       // ""       / ""          / "を計算せよ"
  const danWord           = t(`${BASE}.danWord`);          // "dan"    / "and"        / "と"
  const atauWord          = t(`${BASE}.atauWord`);         // "atau"   / "or"         / "または"
  const labelInfo         = t(`${BASE}.labelInfo`);        // "Info:"  / "Info:"      / "情報："
  const labelRumus        = t(`${BASE}.labelRumus`);       // "Rumus:" / "Formula:"   / "公式："
  const labelSoal         = t(`${BASE}.labelSoal`);        // "Soal:"  / "Problem:"   / "問題："

  // ── Questions array (key references only — no hardcoded Indonesian text) ──
  const questions: QuestionItem[] = [
    {
      number: 1,
      titleKey: "q1.title",
      contentKey: "q1.content",
      type: "mixed",
      svgNode: <SvgBarisanObjek />,
      parts: [
        { label: "a.", textKey: "q1.a" },
        // Case 1: full sentence with U_n in the middle → moved to textKey (plain text)
        { label: "b.", textKey: "q1.b" },
        // Case 2: "Hitung nilai U_{20}." → interpolation pre/post
        { label: "c.", math: `\\text{${hitungNilaiPre}} U_{20}\\text{${hitungNilaiPost}}.` },
      ],
    },
    {
      number: 2,
      titleKey: "q2.title",
      contentKey: "q2.content",
      type: "mixed",
      parts: [
        { label: "a.", textKey: "q2.a" },
        { label: "b.", textKey: "q2.b" },
        // Case 3: "Hitung nilai U_{25}."
        { label: "c.", math: `\\text{${hitungNilaiPre}} U_{25}\\text{${hitungNilaiPost}}.` },
      ],
    },
    {
      number: 3,
      titleKey: "q3.title",
      contentKey: "q3.content",
      type: "mixed",
      parts: [
        { label: "a.", textKey: "q3.a" },
        { label: "b.", textKey: "q3.b" },
        // Case 4: "Hitung nilai U_{40}."
        { label: "c.", math: `\\text{${hitungNilaiPre}} U_{40}\\text{${hitungNilaiPost}}.` },
      ],
    },
    {
      number: 4,
      titleKey: "q4.title",
      contentKey: "q4.content",
      type: "mixed",
      parts: [
        // "dan" connector: "U_3 = 15 \quad \text{dan} \quad U_8 = 35"
        { label: labelInfo, math: `U_3 = 15 \\quad \\text{${danWord}} \\quad U_8 = 35` },
        { label: "a.", textKey: "q4.a" },
        { label: "b.", textKey: "q4.b" },
        // Case 5: "Tentukan nilai U_{15}."
        { label: "c.", math: `\\text{${tentukanNilaiPre}} U_{15}\\text{${tentukanNilaiPost}}.` },
      ],
    },
    {
      number: 5,
      titleKey: "q5.title",
      contentKey: "q5.content",
      type: "mixed",
      parts: [
        { label: "a.", textKey: "q5.a" },
        // Case 6: "Tentukan U_{30} dari barisan tersebut." → moved to textKey (full sentence surrounds symbol)
        { label: "b.", textKey: "q5.b" },
        { label: "c.", textKey: "q5.c" },
      ],
    },
    {
      number: 6,
      titleKey: "q6.title",
      contentKey: "q6.content",
      type: "mixed",
      parts: [
        { label: "a.", textKey: "q6.a" },
        // "Tentukan nilai S_{20}." → interpolation pre/post
        { label: "b.", math: `\\text{${tentukanNilaiPre}} S_{20}\\text{${tentukanNilaiPost}}.` },
      ],
    },
    {
      number: 7,
      titleKey: "q7.title",
      contentKey: "q7.content",
      type: "mixed",
      parts: [
        // Pure math — untouched
        { label: labelRumus, math: "S_n = \\frac{n}{2}(2a + (n-1)b)" },
        // "atau" connector: "\text{atau} \quad S_n = ..."
        { label: "", math: `\\text{${atauWord}} \\quad S_n = \\frac{n}{2}(U_1 + U_n)` },
        { label: labelSoal, textKey: "q7.soal" },
      ],
    },
    {
      number: 8,
      titleKey: "q8.title",
      contentKey: "q8.content",
      type: "essay",
    },
    {
      number: 9,
      titleKey: "q9.title",
      contentKey: "q9.content",
      type: "essay",
    },
    {
      number: 10,
      titleKey: "q10.title",
      contentKey: "q10.content",
      type: "essay",
    },
    {
      number: 11,
      titleKey: "q11.title",
      contentKey: "q11.content",
      type: "essay",
      svgNode: <SvgBatuBata />,
    },
    {
      number: 12,
      titleKey: "q12.title",
      contentKey: "q12.content",
      type: "essay",
    },
    {
      number: 13,
      titleKey: "q13.title",
      contentKey: "q13.content",
      type: "mixed",
      parts: [
        { label: "a.", textKey: "q13.a" },
        { label: "b.", textKey: "q13.b" },
        // Case 7: "Hitung U_{25}."
        { label: "c.", math: `\\text{${hitungPre}} U_{25}\\text{${hitungPost}}.` },
      ],
    },
    {
      number: 14,
      titleKey: "q14.title",
      contentKey: "q14.content",
      type: "essay",
    },
    {
      number: 15,
      titleKey: "q15.title",
      contentKey: "q15.content",
      type: "essay",
    },
  ];

  // ── Formula reference box rows ─────────────────────────────────────────────
  const formulaRows = [
    { labelKey: `${BASE}.formula.sukuKeN`,    math: "U_n = a + (n-1)b" },
    { labelKey: `${BASE}.formula.jumlahNSuku`, math: "S_n = \\frac{n}{2}(2a + (n-1)b)" },
    { labelKey: `${BASE}.formula.alternatifSn`, math: "S_n = \\frac{n}{2}(U_1 + U_n)" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <TrendingUp className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1" style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            {t(`${BASE}.pageTitle`)}
          </h1>
          <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center font-body`}>Kelas 8 · Pola Bilangan · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 {questions.length} {t('practice.suffixSoal')}</span>
            <span className={`${isDark ? "text-white/30" : "text-gray-400"} text-xs`}>·</span>
            <span className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs`}>{t(`${BASE}.tingkatLabel`)} UN / ANBK / TKA</span>
          </div>
        </div>

        {/* ── Formula reference box ── */}
        <div className={`mb-5 ${isDark ? "bg-emerald-900/20" : "bg-emerald-50"} border border-emerald-500/20 rounded-xl p-4`}>
          <p className="text-emerald-300 text-xs font-bold mb-3">{t(`${BASE}.formulaBoxTitle`)}</p>
          <div className="flex flex-col gap-3">
            {formulaRows.map((r, i) => (
              <div key={i} className={`${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-4 py-3`}>
                <p className={`${isDark ? "text-white/40" : "text-gray-500"} text-[10px] mb-1`}>{t(r.labelKey)}</p>
                <div className="text-emerald-200">
                  <BlockMath math={r.math} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Questions ── */}
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div
              key={q.number}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-emerald-900/30 via-slate-900/80 to-green-900/30" : "from-emerald-50/60 via-white/80 to-green-50/40"} backdrop-blur`} />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-green-500 rounded-l-2xl" />

              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
                      <span className="text-emerald-300 text-xs font-bold">{q.number}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {t(`${BASE}.${q.titleKey}`)}
                    </span>
                    <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"} whitespace-pre-line leading-relaxed mb-2`}>
                      {t(`${BASE}.${q.contentKey}`)}
                    </p>
                    {q.svgNode && (
                      <div className={`my-2 ${isDark ? "bg-white/5" : "bg-gray-50"} rounded-xl p-3 border border-emerald-500/20`}>
                        {q.svgNode}
                      </div>
                    )}
                    {q.type === "mixed" && q.parts && (
                      <div className="flex flex-col gap-2 mt-2">
                        {q.parts.map((part, pi) => (
                          <div key={pi} className={`flex items-start gap-2 ${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-3 py-2`}>
                            <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[40px]">{part.label}</span>
                            {part.math ? (
                              <div className={`${isDark ? "text-white" : "text-gray-900"} text-sm overflow-x-auto`}>
                                <InlineMath math={part.math} />
                              </div>
                            ) : (
                              <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} whitespace-pre-line`}>
                                {part.textKey ? t(`${BASE}.${part.textKey}`) : ''}
                              </p>
                            )}
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
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/pola-bilangan"); }}
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolaAritmetikaPage;
