import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const M = ({ math }: { math: string }) => (
  <span className="inline-block"><InlineMath math={math} /></span>
);

const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${color}`}>
    {label}
  </span>
);

const NumBadge = ({ n, color }: { n: string; color: string }) => (
  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0 font-body ${color}`}>
    {n}
  </span>
);

/* ── Soal A ── Model Matematika ────────────────────────── */
const SoalA = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.qA.instruction"
          components={{ a: <span className="text-lime-300 font-semibold" /> }}
        />
      </p>

      {/* Soal 1 */}
      <div className="bg-lime-500/5 border border-lime-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="1" color="bg-lime-500/30 text-lime-200 border border-lime-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q1.text"
              components={{ a: <span className="text-lime-300 font-semibold" /> }}
            />{" "}
            <span className="text-white/50 italic">
              {t('practice.plsvPtlsv.modelMatematikaPLSV.q1.hintPre')}<M math="n" />{t('practice.plsvPtlsv.modelMatematikaPLSV.q1.hintPost')}
            </span>
          </p>
        </div>
      </div>

      {/* Soal 2 */}
      <div className="bg-lime-500/5 border border-lime-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="2" color="bg-lime-500/30 text-lime-200 border border-lime-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q2.text"
              components={{ a: <span className="text-lime-300 font-semibold" /> }}
            />{" "}
            <span className="text-white/50 italic">
              {t('practice.plsvPtlsv.modelMatematikaPLSV.q2.hintPre')}<M math="x" />{t('practice.plsvPtlsv.modelMatematikaPLSV.q2.hintPost')}
            </span>
          </p>
        </div>
      </div>

      {/* Soal 3 */}
      <div className="bg-lime-500/5 border border-lime-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="3" color="bg-lime-500/30 text-lime-200 border border-lime-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q3.text"
              components={{ a: <span className="text-lime-300 font-semibold" /> }}
            />{" "}
            <span className="text-white/50 italic">
              {t('practice.plsvPtlsv.modelMatematikaPLSV.q3.hintPre')}<M math="q" />{t('practice.plsvPtlsv.modelMatematikaPLSV.q3.hintPost')}
            </span>
          </p>
        </div>
      </div>

      {/* Soal 4 */}
      <div className="bg-lime-500/5 border border-lime-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="4" color="bg-lime-500/30 text-lime-200 border border-lime-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q4.text"
              components={{ a: <span className="text-lime-300 font-semibold" /> }}
            />{" "}
            <span className="text-white/50 italic">
              {t('practice.plsvPtlsv.modelMatematikaPLSV.q4.hintPre')}<M math="y" />{t('practice.plsvPtlsv.modelMatematikaPLSV.q4.hintPost')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Soal B ── Penyelesaian Lengkap ────────────────────── */
const SoalB = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.qB.instruction"
          components={{ a: <span className="text-green-300 font-semibold" /> }}
        />
      </p>

      {/* Soal 5 */}
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-2">
        <div className="flex items-start gap-2.5">
          <NumBadge n="5" color="bg-green-500/25 text-green-200 border border-green-400/40" />
          <div className="space-y-2">
            <p className="font-body text-sm text-white/85 leading-relaxed">
              <Trans
                i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q5.text"
                components={{ a: <span className="text-green-300 font-semibold" /> }}
              />
            </p>
            <div className="flex flex-wrap gap-2 pl-1">
              {[
                { l: "a", tk: "practice.plsvPtlsv.modelMatematikaPLSV.q5.subA" },
                { l: "b", tk: "practice.plsvPtlsv.modelMatematikaPLSV.q5.subB" },
              ].map(({ l, tk }) => (
                <div key={l} className="flex items-start gap-2 bg-green-500/10 border border-green-400/20 rounded-lg px-3 py-2 w-full">
                  <span className="text-green-400 font-bold text-xs mt-0.5 shrink-0">{l}.</span>
                  <span className="font-body text-xs text-white/70 leading-relaxed">{t(tk)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Soal 6 */}
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="6" color="bg-green-500/25 text-green-200 border border-green-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q6.text"
              components={{ a: <span className="text-green-300 font-semibold" /> }}
            />{" "}
            <span className="text-white/50 italic">
              {t('practice.plsvPtlsv.modelMatematikaPLSV.q6.hintPre')}<M math="s" />{t('practice.plsvPtlsv.modelMatematikaPLSV.q6.hintPost')}
            </span>{" "}
            {t('practice.plsvPtlsv.modelMatematikaPLSV.q6.question')}
          </p>
        </div>
      </div>

      {/* Soal 7 */}
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="7" color="bg-green-500/25 text-green-200 border border-green-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q7.text"
              components={{ a: <span className="text-green-300 font-semibold" /> }}
            />
          </p>
        </div>
      </div>

      {/* Soal 8 */}
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="8" color="bg-green-500/25 text-green-200 border border-green-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q8.text"
              components={{ a: <span className="text-green-300 font-semibold" /> }}
            />
          </p>
        </div>
      </div>

      {/* Soal 9 */}
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="9" color="bg-green-500/25 text-green-200 border border-green-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q9.text"
              components={{ a: <span className="text-green-300 font-semibold" />, m: <M math="x" /> }}
            />
          </p>
        </div>
      </div>

      {/* Soal 10 */}
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="10" color="bg-green-500/25 text-green-200 border border-green-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q10.text"
              components={{ a: <span className="text-green-300 font-semibold" /> }}
            />
          </p>
        </div>
      </div>

      {/* Soal 11 */}
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-2">
        <div className="flex items-start gap-2.5">
          <NumBadge n="11" color="bg-green-500/25 text-green-200 border border-green-400/40" />
          <div className="space-y-2">
            <p className="font-body text-sm text-white/85 leading-relaxed">
              <Trans
                i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q11.text"
                components={{ a: <span className="text-green-300 font-semibold" /> }}
              />
            </p>
            <div className="flex flex-wrap gap-2 pl-1">
              {[
                { l: "a", tk: "practice.plsvPtlsv.modelMatematikaPLSV.q11.subA" },
                { l: "b", tk: "practice.plsvPtlsv.modelMatematikaPLSV.q11.subB" },
              ].map(({ l, tk }) => (
                <div key={l} className="flex items-start gap-2 bg-green-500/10 border border-green-400/20 rounded-lg px-3 py-2 w-full">
                  <span className="text-green-400 font-bold text-xs mt-0.5 shrink-0">{l}.</span>
                  <span className="font-body text-xs text-white/70 leading-relaxed">{t(tk)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Soal 12 */}
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="12" color="bg-green-500/25 text-green-200 border border-green-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q12.text"
              components={{ a: <span className="text-green-300 font-semibold" /> }}
            />
          </p>
        </div>
      </div>

      {/* Soal 13 */}
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-start gap-2.5">
          <NumBadge n="13" color="bg-green-500/25 text-green-200 border border-green-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <Trans
              i18nKey="practice.plsvPtlsv.modelMatematikaPLSV.q13.text"
              components={{ a: <span className="text-green-300 font-semibold" /> }}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────── */
const ModelMatematikaPLSVPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* ── Card config (inside component so t() is available) ── */
  const cards = [
    {
      num: 1, tag: t('practice.plsvPtlsv.modelMatematikaPLSV.tags.soalA'),
      tagColor: "bg-lime-500/20 text-lime-300 border-lime-400/40",
      gradient: "from-lime-900/50 to-green-900/30", border: "border-lime-500/25",
      bar: "from-lime-400 to-green-500", numBg: "bg-lime-500/30 text-lime-200",
      custom: <SoalA />,
    },
    {
      num: 2, tag: t('practice.plsvPtlsv.modelMatematikaPLSV.tags.soalB'),
      tagColor: "bg-green-500/20 text-green-300 border-green-400/40",
      gradient: "from-green-900/50 to-teal-900/30", border: "border-green-500/25",
      bar: "from-green-400 to-teal-500", numBg: "bg-green-500/30 text-green-200",
      custom: <SoalB />,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-500/20 to-green-500/10 border border-lime-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">📝</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(132,204,22,0.5)' }}
          >
            {t('practice.plsvPtlsv.modelMatematikaPLSV.title1')}
          </h1>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(132,204,22,0.5)' }}
          >
            {t('practice.plsvPtlsv.modelMatematikaPLSV.title2')}
          </h1>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(132,204,22,0.5)' }}
          >
            {t('practice.plsvPtlsv.modelMatematikaPLSV.title3')}
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · PLSV & PtLSV · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">{t('practice.plsvPtlsv.modelMatematikaPLSV.badge')}</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-lime-500/10 border border-lime-400/20 text-lime-400 font-body">✦ Kelas 7</span>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <div
              key={c.num}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} backdrop-blur`} />
              <div className={`absolute inset-0 border ${c.border} rounded-2xl`} />
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${c.bar} rounded-l-2xl`} />

              <div className="relative px-5 py-4 pl-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-body shrink-0 ${c.numBg}`}>
                    {c.num}
                  </span>
                  <Tag label={c.tag} color={c.tagColor} />
                </div>
                <div className="pl-1">
                  {c.custom}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Back button ── */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/plsv-ptlsv"); }}
            className="text-sm text-white/30 hover:text-lime-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} PLSV & PtLSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelMatematikaPLSVPage;
