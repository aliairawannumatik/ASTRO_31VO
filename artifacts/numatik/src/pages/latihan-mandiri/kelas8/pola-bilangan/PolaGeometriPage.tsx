import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Zap } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PartItem = { label: string; math?: string; textKey?: string };

type QuestionItem = {
  number: number;
  titleKey: string;
  contentKey: string;
  type: "essay" | "mixed";
  parts?: PartItem[];
};

// ─── Locale base path ─────────────────────────────────────────────────────────

const BASE = "practice.polaBilangan.polaGeometri";

// ─── Page ─────────────────────────────────────────────────────────────────────

const PolaGeometriPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ── \text{} interpolation variables ──────────────────────────────────────
  // For Japanese, pre-variables are empty ("") and post-variables carry the verb.
  const hitungNilaiPre    = t(`${BASE}.hitungNilaiPre`);    // "Hitung nilai" / "Calculate the value of" / ""
  const hitungNilaiPost   = t(`${BASE}.hitungNilaiPost`);   // ""             / ""                        / "の値を求めよ"
  const tentukanNilaiPre  = t(`${BASE}.tentukanNilaiPre`);  // "Tentukan nilai" / "Determine the value of" / ""
  const tentukanNilaiPost = t(`${BASE}.tentukanNilaiPost`); // ""               / ""                       / "の値を求めよ"
  const hitungPre         = t(`${BASE}.hitungPre`);         // "Hitung" / "Calculate" / ""
  const hitungPost        = t(`${BASE}.hitungPost`);        // ""       / ""          / "を計算せよ"
  const tentukanRasioPre  = t(`${BASE}.tentukanRasioPre`);  // "Tentukan rasio" / "Determine the ratio" / "公比 "
  const tentukanRasioPost = t(`${BASE}.tentukanRasioPost`); // ""               / ""                    / "を求めよ"
  const danWord           = t(`${BASE}.danWord`);           // "dan"   / "and"   / "と"
  const labelInfo         = t(`${BASE}.labelInfo`);         // "Info:" / "Info:" / "情報："
  const labelSoal         = t(`${BASE}.labelSoal`);         // "Soal:" / "Problem:" / "問題："
  const labelRGt1         = t(`${BASE}.labelRGt1`);         // "r > 1:" / "r > 1:" / "r > 1："
  const labelRLt1         = t(`${BASE}.labelRLt1`);         // "r < 1:" / "r < 1:" / "r < 1："

  // ── Questions array (key references only — no hardcoded Indonesian text) ──
  const questions: QuestionItem[] = [
    {
      number: 1,
      titleKey: "q1.title",
      contentKey: "q1.content",
      type: "mixed",
      parts: [
        { label: "a.", textKey: "q1.a" },
        // Full sentence with Uₙ in the middle → textKey (plain text, like Case 1 in PolaAritmetika)
        { label: "b.", textKey: "q1.b" },
        // "Hitung nilai U_8." → interpolation pre/post
        { label: "c.", math: `\\text{${hitungNilaiPre}} U_8\\text{${hitungNilaiPost}}.` },
      ],
    },
    {
      number: 2,
      titleKey: "q2.title",
      contentKey: "q2.content",
      type: "mixed",
      parts: [
        // "Tentukan rasio r." → tentukanRasioPre/Post interpolation
        { label: "a.", math: `\\text{${tentukanRasioPre}} r\\text{${tentukanRasioPost}}.` },
        // "Hitung U_8." → hitungPre/Post interpolation
        { label: "b.", math: `\\text{${hitungPre}} U_8\\text{${hitungPost}}.` },
        { label: "c.", textKey: "q2.c" },
      ],
    },
    {
      number: 3,
      titleKey: "q3.title",
      contentKey: "q3.content",
      type: "mixed",
      parts: [
        { label: "a.", textKey: "q3.a" },
        // "Hitung U_{10}." → hitungPre/Post
        { label: "b.", math: `\\text{${hitungPre}} U_{10}\\text{${hitungPost}}.` },
        // "Hitung S_8." → hitungPre/Post
        { label: "c.", math: `\\text{${hitungPre}} S_8\\text{${hitungPost}}.` },
      ],
    },
    {
      number: 4,
      titleKey: "q4.title",
      contentKey: "q4.content",
      type: "mixed",
      parts: [
        // "dan" connector in math string
        { label: labelInfo, math: `U_2 = 6 \\quad \\text{${danWord}} \\quad U_5 = 162` },
        { label: "a.", textKey: "q4.a" },
        { label: "b.", textKey: "q4.b" },
        // "Tentukan nilai U_7." → tentukanNilaiPre/Post
        { label: "c.", math: `\\text{${tentukanNilaiPre}} U_7\\text{${tentukanNilaiPost}}.` },
      ],
    },
    {
      number: 5,
      titleKey: "q5.title",
      contentKey: "q5.content",
      type: "mixed",
      parts: [
        { label: labelRGt1, math: "S_n = \\frac{a(r^n - 1)}{r - 1}" },
        { label: labelRLt1, math: "S_n = \\frac{a(1 - r^n)}{1 - r}" },
        { label: labelSoal, textKey: "q5.soal" },
      ],
    },
    {
      number: 6,
      titleKey: "q6.title",
      contentKey: "q6.content",
      type: "essay",
    },
    {
      number: 7,
      titleKey: "q7.title",
      contentKey: "q7.content",
      type: "essay",
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
  ];

  // ── Formula reference box rows ─────────────────────────────────────────────
  const formulaRows = [
    { labelKey: `${BASE}.formula.sukuKeN`,         math: "U_n = a \\cdot r^{n-1}" },
    { labelKey: `${BASE}.formula.jumlahNSukuRBesar`, math: "S_n = \\frac{a(r^n - 1)}{r - 1}" },
    { labelKey: `${BASE}.formula.jumlahNSukuRKecil`, math: "S_n = \\frac{a(1 - r^n)}{1 - r}" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <Zap className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1" style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            {t(`${BASE}.pageTitle`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Pola Bilangan · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 {questions.length} {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">{t(`${BASE}.tingkatLabel`)} UN / ANBK / TKA</span>
          </div>
        </div>

        {/* ── Formula reference box ── */}
        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-3">{t(`${BASE}.formulaBoxTitle`)}</p>
          <div className="flex flex-col gap-3">
            {formulaRows.map((r, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-4 py-2">
                <p className="text-white/40 text-[10px] mb-1">{t(r.labelKey)}</p>
                <div className="text-orange-200">
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
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />

              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center">
                      <span className="text-orange-300 text-xs font-bold">{q.number}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {t(`${BASE}.${q.titleKey}`)}
                    </span>
                    <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-2">
                      {t(`${BASE}.${q.contentKey}`)}
                    </p>
                    {q.type === "mixed" && q.parts && (
                      <div className="flex flex-col gap-2 mt-2">
                        {q.parts.map((part, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-orange-300 text-xs font-bold shrink-0 mt-0.5 min-w-[40px]">{part.label}</span>
                            {part.math ? (
                              <div className="text-white text-sm overflow-x-auto">
                                <InlineMath math={part.math} />
                              </div>
                            ) : (
                              <p className="font-body text-sm text-white/80 whitespace-pre-line">
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
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolaGeometriPage;
