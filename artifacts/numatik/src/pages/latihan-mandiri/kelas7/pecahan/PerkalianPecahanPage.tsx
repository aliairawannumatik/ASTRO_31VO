import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ── Reusable atoms ───────────────────────────────────── */
const M = ({ math }: { math: string }) => <InlineMath math={math} />;

const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${color}`}>
    {label}
  </span>
);

const SubLabel = ({ letter, color }: { letter: string; color: string }) => (
  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${color}`}>
    {letter}
  </span>
);

/* ── Shared instruction banner ────────────────────────── */
const InstructionBanner = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-4 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
      <p className="font-body text-xs text-white/55 leading-relaxed italic">
        <Trans
          i18nKey="practice.pecahan.perkalianPecahan.banner"
          components={{ strong: <strong className="text-white/70" /> }}
        />
      </p>
    </div>
  );
};

/* ── Soal 1 — perkalian sederhana ─────────────────────── */
const SoalSatu = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
      {[
        { l: "a", math: "\\dfrac{3}{8} \\times \\dfrac{4}{9}" },
        { l: "d", math: "\\dfrac{5}{6} \\times \\dfrac{9}{10}" },
        { l: "b", math: "\\dfrac{4}{7} \\times \\dfrac{7}{6}" },
        { l: "e", math: "6\\dfrac{2}{3} \\times 1\\dfrac{4}{5}" },
        { l: "c", math: "1\\dfrac{3}{5} \\times 2\\dfrac{1}{4}" },
        { l: "f", math: "3\\dfrac{3}{4} \\times 5\\dfrac{1}{3}" },
      ].map(({ l, math }) => (
        <div key={l} className="flex items-center gap-2 bg-violet-500/5 border border-violet-500/15 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-violet-500/20 text-violet-300 border border-violet-400/30" />
          <M math={math} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 — tiga faktor ─────────────────────────────── */
const SoalDua = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
      {[
        { l: "a", math: "\\dfrac{3}{4} \\times \\dfrac{4}{7} \\times \\dfrac{7}{9}" },
        { l: "c", math: "\\dfrac{4}{9} \\times 3\\dfrac{3}{8} \\times 2\\dfrac{2}{5}" },
        { l: "b", math: "\\dfrac{2}{5} \\times 1\\dfrac{1}{4} \\times \\dfrac{2}{3}" },
        { l: "d", math: "1\\dfrac{5}{7} \\times 2\\dfrac{4}{9} \\times 3\\dfrac{3}{4}" },
      ].map(({ l, math }) => (
        <div key={l} className="flex items-center gap-2 bg-orange-500/5 border border-orange-500/15 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
          <M math={math} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 — operasi campuran ────────────────────────── */
const SoalTiga = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
      {[
        { l: "a", math: "3\\dfrac{3}{5} \\times \\dfrac{5}{9} + 1\\dfrac{2}{3}" },
        { l: "c", math: "5\\dfrac{1}{4} + 2\\dfrac{1}{7} \\times 3\\dfrac{1}{2}" },
        { l: "b", math: "2\\dfrac{2}{5} \\times \\dfrac{5}{6} - 1\\dfrac{1}{4}" },
        { l: "d", math: "8\\dfrac{3}{4} - 1\\dfrac{1}{3} \\times 2\\dfrac{1}{4}" },
      ].map(({ l, math }) => (
        <div key={l} className="flex items-center gap-2 bg-cyan-500/5 border border-cyan-500/15 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
          <M math={math} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 — sifat distributif ───────────────────────── */
const SoalEmpat = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.perkalianPecahan.q4.instruction')}
      </p>
      <div className="space-y-3 pl-1">
        {[
          { l: "a", math: "\\dfrac{4}{7} \\times 2\\dfrac{1}{3} + \\dfrac{4}{7} \\times 4\\dfrac{2}{3}" },
          { l: "b", math: "8\\dfrac{3}{5} \\times 4\\dfrac{2}{3} - 3\\dfrac{3}{5} \\times 4\\dfrac{2}{3}" },
          { l: "c", math: "6\\dfrac{2}{3} \\times 9\\dfrac{1}{4} - 6\\dfrac{2}{3} \\times 6\\dfrac{3}{4}" },
        ].map(({ l, math }) => (
          <div key={l} className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2.5">
            <SubLabel letter={l} color="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" />
            <span className="text-sm"><M math={math} /></span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 5 — kontekstual harga ───────────────────────── */
const SoalLima = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.pecahan.perkalianPecahan.q5.instruction"
          components={{
            f1: <M math="\dfrac{2}{5}" />,
            f2: <M math="\dfrac{3}{4}" />,
          }}
        />
      </p>
    </div>
  );
};

/* ── Soal 6 — kontekstual tangki ──────────────────────── */
const SoalEnam = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.pecahan.perkalianPecahan.q6.instruction"
          components={{
            f1: <M math="12\dfrac{1}{2}" />,
            f2: <M math="4\dfrac{1}{4}" />,
          }}
        />
      </p>
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────── */
const PerkalianPecahanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = [
    {
      num: 1, tag: t('practice.pecahan.perkalianPecahan.tags.q1'),
      tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
      gradient: "from-violet-900/50 to-purple-900/30", border: "border-violet-500/25",
      bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
      custom: <SoalSatu />,
    },
    {
      num: 2, tag: t('practice.pecahan.perkalianPecahan.tags.q2'),
      tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
      gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
      bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
      custom: <SoalDua />,
    },
    {
      num: 3, tag: t('practice.pecahan.perkalianPecahan.tags.q3'),
      tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
      gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
      bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
      custom: <SoalTiga />,
    },
    {
      num: 4, tag: t('practice.pecahan.perkalianPecahan.tags.q4'),
      tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
      gradient: "from-emerald-900/40 to-green-900/25", border: "border-emerald-500/25",
      bar: "from-emerald-400 to-green-500", numBg: "bg-emerald-500/30 text-emerald-200",
      custom: <SoalEmpat />,
    },
    {
      num: 5, tag: t('practice.pecahan.perkalianPecahan.tags.q5'),
      tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
      gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
      bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
      custom: <SoalLima />,
    },
    {
      num: 6, tag: t('practice.pecahan.perkalianPecahan.tags.q6'),
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
      gradient: "from-amber-900/35 to-yellow-900/20", border: "border-amber-500/25",
      bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
      custom: <SoalEnam />,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-[11px] text-violet-300"><InlineMath math="\dfrac{a}{b}\times\dfrac{c}{d}" /></span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(167,139,250,0.5)' }}>
            {t('practice.pecahan.perkalianPecahan.pageTitle1')}
            <br />
            <span className="text-violet-300">{t('practice.pecahan.perkalianPecahan.pageTitle2')}</span>
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">
            {t('practice.pecahan.perkalianPecahan.pageSubtitle')}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">
              {t('practice.pecahan.perkalianPecahan.badgeSoal')}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-400 font-body">
              ✦ {t('practice.grade7Label')}
            </span>
          </div>
        </div>

        {/* ── Instruction banner for soal 1–3 ── */}
        <InstructionBanner />

        {/* ── Cards ── */}
        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <div
              key={c.num}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.04}s` }}
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
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/bilangan-rasional"); }}
            className="text-sm text-white/30 hover:text-violet-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.pecahan.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerkalianPecahanPage;
