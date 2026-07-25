import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ── Reusable atoms ───────────────────────────────────── */
const F = ({ n, d }: { n: string; d: string }) => (
  <InlineMath math={`\\dfrac{${n}}{${d}}`} />
);

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

/* ── Soal 1 ───────────────────────────────────────────── */
const SoalSatu = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.bentukDesimal.q1.instruction')}
      </p>
      <div className="grid grid-cols-2 gap-3 pl-1">
        {[
          { l: "a", n: "7", d: "10" },
          { l: "b", n: "11", d: "4" },
          { l: "c", n: "9", d: "100" },
          { l: "d", n: "13", d: "5" },
          { l: "e", n: "3", d: "8" },
          { l: "f", n: "17", d: "20" },
        ].map(({ l, n, d }) => (
          <div key={l} className="flex items-center gap-2.5 bg-lime-500/5 border border-lime-500/15 rounded-lg px-3 py-2">
            <SubLabel letter={l} color="bg-lime-500/20 text-lime-300 border border-lime-400/30" />
            <F n={n} d={d} />
            <span className="text-white/25 text-sm ml-auto">=</span>
            <span className="text-white/20 text-sm">…</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 2 ───────────────────────────────────────────── */
const SoalDua = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.bentukDesimal.q2.instruction')}
      </p>
      <div className="grid grid-cols-2 gap-3 pl-1">
        {[
          { l: "a", n: "6", d: "15" },
          { l: "b", n: "14", d: "35" },
          { l: "c", n: "12", d: "48" },
          { l: "d", n: "22", d: "44" },
        ].map(({ l, n, d }) => (
          <div key={l} className="flex items-center gap-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2">
            <SubLabel letter={l} color="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" />
            <F n={n} d={d} />
            <span className="text-emerald-300/30 text-xs ml-auto">{t('practice.pecahan.bentukDesimal.q2.hint')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 3 ───────────────────────────────────────────── */
const SoalTiga = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.bentukDesimal.q3.instruction')}
      </p>
      <div className="grid grid-cols-2 gap-3 pl-1">
        {[
          { l: "a", n: "5", d: "8" },
          { l: "b", n: "9", d: "16" },
          { l: "c", n: "11", d: "40" },
          { l: "d", n: "7", d: "25" },
        ].map(({ l, n, d }) => (
          <div key={l} className="flex items-center gap-2.5 bg-sky-500/5 border border-sky-500/15 rounded-lg px-3 py-2">
            <SubLabel letter={l} color="bg-sky-500/20 text-sky-300 border border-sky-400/30" />
            <F n={n} d={d} />
            <span className="text-white/25 text-sm ml-auto">=</span>
            <span className="text-white/20 text-sm">…</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 4 ───────────────────────────────────────────── */
const SoalEmpat = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.bentukDesimal.q4.instruction')}
      </p>
      <div className="grid grid-cols-2 gap-3 pl-1">
        {[
          { l: "a", n: "4", d: "7" },
          { l: "b", n: "5", d: "9" },
          { l: "c", n: "8", d: "11" },
          { l: "d", n: "3", d: "14" },
        ].map(({ l, n, d }) => (
          <div key={l} className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/15 rounded-lg px-3 py-2">
            <SubLabel letter={l} color="bg-violet-500/20 text-violet-300 border border-violet-400/30" />
            <F n={n} d={d} />
            <span className="text-violet-300/30 text-xs ml-auto">{t('practice.pecahan.bentukDesimal.q4.hint')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 5 ───────────────────────────────────────────── */
const SoalLima = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.bentukDesimal.q5.instruction')}
      </p>
      <div className="grid grid-cols-2 gap-3 pl-1">
        {[
          { l: "a", val: "0{,}6" },
          { l: "b", val: "0{,}35" },
          { l: "c", val: "0{,}125" },
          { l: "d", val: "1{,}8" },
          { l: "e", val: "2{,}04" },
          { l: "f", val: "3{,}75" },
        ].map(({ l, val }) => (
          <div key={l} className="flex items-center gap-2.5 bg-rose-500/5 border border-rose-500/15 rounded-lg px-3 py-2">
            <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
            <InlineMath math={val} />
            <span className="text-white/25 text-sm ml-auto">=</span>
            <span className="text-white/20 text-sm">…</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 6 ───────────────────────────────────────────── */
const SoalEnam = () => {
  const { t } = useTranslation();
  const items = [
    { l: "a", val: "4{,}5\\underline{3}7", digit: "3" },
    { l: "b", val: "12{,}\\underline{8}06", digit: "8" },
    { l: "c", val: "0{,}70\\underline{9}", digit: "9" },
    { l: "d", val: "\\underline{6}{,}248", digit: "6" },
  ];
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.bentukDesimal.q6.instruction')}
      </p>
      <div className="space-y-3 pl-1">
        {items.map(({ l, val, digit }) => (
          <div key={l} className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-2.5">
            <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
            <InlineMath math={val} />
            <span className="text-amber-300/40 text-xs ml-auto font-body">
              {t('practice.pecahan.bentukDesimal.q6.digitHint', { digit })} = …
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 7 ───────────────────────────────────────────── */
const SoalTujuh = () => {
  const { t } = useTranslation();
  const items = [
    { letter: "a", text: t('practice.pecahan.bentukDesimal.q7.items.a') },
    { letter: "b", text: t('practice.pecahan.bentukDesimal.q7.items.b') },
    { letter: "c", text: t('practice.pecahan.bentukDesimal.q7.items.c') },
  ];
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.bentukDesimal.q7.instruction')}
      </p>
      <div className="space-y-2.5 pl-1">
        {items.map(({ letter, text }) => (
          <div key={letter} className="flex items-start gap-2.5 bg-cyan-500/5 border border-cyan-500/15 rounded-lg px-4 py-3">
            <SubLabel letter={letter} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
            <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 8 ───────────────────────────────────────────── */
const SoalDelapan = () => {
  const { t } = useTranslation();
  const items = [
    { letter: "a", text: t('practice.pecahan.bentukDesimal.q8.items.a') },
    { letter: "b", text: t('practice.pecahan.bentukDesimal.q8.items.b') },
    { letter: "c", text: t('practice.pecahan.bentukDesimal.q8.items.c') },
  ];
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.bentukDesimal.q8.instruction')}
      </p>
      <div className="space-y-2.5 pl-1">
        {items.map(({ letter, text }) => (
          <div key={letter} className="flex items-start gap-2.5 bg-fuchsia-500/5 border border-fuchsia-500/15 rounded-lg px-4 py-3">
            <SubLabel letter={letter} color="bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30" />
            <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────── */
const BentukDesimalPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = [
    {
      num: 1, tag: t('practice.pecahan.bentukDesimal.tags.q1'),
      tagColor: "bg-lime-500/20 text-lime-300 border-lime-400/40",
      gradient: "from-lime-900/50 to-green-900/30", border: "border-lime-500/25",
      bar: "from-lime-400 to-green-500", numBg: "bg-lime-500/30 text-lime-200",
      custom: <SoalSatu />,
    },
    {
      num: 2, tag: t('practice.pecahan.bentukDesimal.tags.q2'),
      tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
      gradient: "from-emerald-900/40 to-teal-900/25", border: "border-emerald-500/25",
      bar: "from-emerald-400 to-teal-500", numBg: "bg-emerald-500/30 text-emerald-200",
      custom: <SoalDua />,
    },
    {
      num: 3, tag: t('practice.pecahan.bentukDesimal.tags.q3'),
      tagColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
      gradient: "from-sky-900/40 to-blue-900/25", border: "border-sky-500/25",
      bar: "from-sky-400 to-blue-500", numBg: "bg-sky-500/30 text-sky-200",
      custom: <SoalTiga />,
    },
    {
      num: 4, tag: t('practice.pecahan.bentukDesimal.tags.q4'),
      tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
      gradient: "from-violet-900/40 to-purple-900/25", border: "border-violet-500/25",
      bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
      custom: <SoalEmpat />,
    },
    {
      num: 5, tag: t('practice.pecahan.bentukDesimal.tags.q5'),
      tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
      gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
      bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
      custom: <SoalLima />,
    },
    {
      num: 6, tag: t('practice.pecahan.bentukDesimal.tags.q6'),
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
      gradient: "from-amber-900/35 to-yellow-900/20", border: "border-amber-500/25",
      bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
      custom: <SoalEnam />,
    },
    {
      num: 7, tag: t('practice.pecahan.bentukDesimal.tags.q7'),
      tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
      gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
      bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
      custom: <SoalTujuh />,
    },
    {
      num: 8, tag: t('practice.pecahan.bentukDesimal.tags.q8'),
      tagColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
      gradient: "from-fuchsia-900/40 to-pink-900/25", border: "border-fuchsia-500/25",
      bar: "from-fuchsia-400 to-pink-500", numBg: "bg-fuchsia-500/30 text-fuchsia-200",
      custom: <SoalDelapan />,
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
            <span className="text-2xl">📊</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(132,204,22,0.5)' }}
          >
            {t('practice.pecahan.bentukDesimal.pageTitle1')}
            <br />
            <span className="text-lime-300">{t('practice.pecahan.bentukDesimal.pageTitle2')}</span>
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">
            {t('practice.pecahan.bentukDesimal.pageSubtitle')}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">
              {t('practice.pecahan.bentukDesimal.badgeSoal')}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-lime-500/10 border border-lime-400/20 text-lime-400 font-body">
              ✦ {t('practice.grade7Label')}
            </span>
          </div>
        </div>

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
            className="text-sm text-white/30 hover:text-lime-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.pecahan.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BentukDesimalPage;
