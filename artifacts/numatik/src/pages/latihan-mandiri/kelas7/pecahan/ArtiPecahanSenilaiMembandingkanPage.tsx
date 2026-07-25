import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ── SVG helpers ─────────────────────────────────────── */
const cx = 60, cy = 60, r = 50;
const pts = Array.from({ length: 8 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 4;
  return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)];
});
const slicePath = (i: number) => {
  const [x1, y1] = pts[i];
  const [x2, y2] = pts[(i + 1) % 8];
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
};

/* ── Reusable atoms ───────────────────────────────────── */
const F = ({ n, d }: { n: string; d: string }) => (
  <InlineMath math={`\\dfrac{${n}}{${d}}`} />
);
const Eq = () => <span className="mx-1.5 text-white/50 text-base">=</span>;

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
        {t('practice.pecahan.artiSenilai.q1.instruction')}
      </p>
      <div className="flex flex-wrap gap-10 items-center justify-start pt-1">
        {/* Rectangle */}
        <div className="flex flex-col items-center gap-2">
          <SubLabel letter="a" color="bg-violet-500/30 text-violet-300 border border-violet-400/40" />
          <svg width="220" height="60" viewBox="0 0 220 60" className="rounded">
            <defs>
              <clipPath id="rect-clip-0"><rect x={0} y={0} width={44} height={60} /></clipPath>
              <clipPath id="rect-clip-1"><rect x={44} y={0} width={44} height={60} /></clipPath>
            </defs>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={i * 44} y={0} width={44} height={60}
                fill={i < 2 ? "#a78bfa" : "transparent"}
                fillOpacity={i < 2 ? 0.35 : 0}
                stroke="#a78bfa" strokeWidth={1.5} />
            ))}
            {[0, 1].map((i) => (
              <g key={i} clipPath={`url(#rect-clip-${i})`}>
                {Array.from({ length: 12 }, (_, j) => (
                  <line key={j}
                    x1={i * 44 + j * 7 - 10} y1={0}
                    x2={i * 44 + j * 7} y2={60}
                    stroke="#a78bfa" strokeWidth={0.9} strokeOpacity={0.5} />
                ))}
              </g>
            ))}
          </svg>
        </div>
        {/* Circle */}
        <div className="flex flex-col items-center gap-2">
          <SubLabel letter="b" color="bg-violet-500/30 text-violet-300 border border-violet-400/40" />
          <svg width="110" height="110" viewBox="0 0 120 120">
            <circle cx={cx} cy={cy} r={r} fill="transparent" stroke="#a78bfa" strokeWidth={1.5} />
            {[0,1,2,3,4,5,6,7].map((i) => (
              <path key={i} d={slicePath(i)}
                fill={i < 3 ? "#a78bfa" : "transparent"}
                fillOpacity={i < 3 ? 0.35 : 0}
                stroke="#a78bfa" strokeWidth={1.5} />
            ))}
            {[0,1,2].map((i) => {
              const [x1, y1] = pts[i];
              const [x2, y2] = pts[(i + 1) % 8];
              return Array.from({ length: 5 }, (_, j) => {
                const tVal = (j + 1) / 6;
                return (
                  <line key={`${i}-${j}`}
                    x1={cx + tVal*(x1-cx)} y1={cy + tVal*(y1-cy)}
                    x2={cx + tVal*(x2-cx)} y2={cy + tVal*(y2-cy)}
                    stroke="#a78bfa" strokeWidth={0.8} strokeOpacity={0.5} />
                );
              });
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ── Soal 2 ───────────────────────────────────────────── */
const SoalDua = () => {
  const { t } = useTranslation();
  const items = [
    { letter: "a", text: t('practice.pecahan.artiSenilai.q2.itemA') },
    { letter: "b", text: t('practice.pecahan.artiSenilai.q2.itemB') },
  ];
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.artiSenilai.q2.instruction')}
      </p>
      <div className="space-y-2 pl-1">
        {items.map(({ letter, text }) => (
          <div key={letter} className="flex items-start gap-2.5">
            <SubLabel letter={letter} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
            <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
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
        {t('practice.pecahan.artiSenilai.q3.instruction')}
      </p>
      <div className="space-y-4 pl-1">
        {[
          { l: "a", fracs: [["2","5"],["4","\\ldots"],["18","\\ldots"],["\\ldots","40"]] },
          { l: "b", fracs: [["3","7"],["6","\\ldots"],["15","\\ldots"],["\\ldots","49"]] },
          { l: "c", fracs: [["4","9"],["\\ldots","27"],["28","\\ldots"],["36","\\ldots"]] },
          { l: "d", fracs: [["5","6"],["\\ldots","24"],["35","\\ldots"],["60","\\ldots"]] },
        ].map(({ l, fracs }) => (
          <div key={l} className="flex items-center gap-1 flex-wrap">
            <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
            <span className="ml-1 flex items-center gap-1 flex-wrap">
              {fracs.map(([n, d], i) => (
                <span key={i} className="flex items-center gap-1">
                  <InlineMath math={`\\dfrac{${n}}{${d}}`} />
                  {i < fracs.length - 1 && <Eq />}
                </span>
              ))}
            </span>
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
        {t('practice.pecahan.artiSenilai.q4.instruction')}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 pl-1">
        {[
          { l: "a", n: "16", d: "20" }, { l: "b", n: "24", d: "40" },
          { l: "c", n: "35", d: "49" }, { l: "d", n: "18", d: "54" },
          { l: "e", n: "56", d: "98" }, { l: "f", n: "120", d: "168" },
        ].map(({ l, n, d }) => (
          <div key={l} className="flex items-center gap-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2">
            <SubLabel letter={l} color="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" />
            <F n={n} d={d} />
            <span className="text-white/25 text-sm ml-auto">=</span>
            <span className="text-white/20 text-sm">…</span>
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
        <Trans
          i18nKey="practice.pecahan.artiSenilai.q5.instruction"
          components={{
            gt: <InlineMath math=">" />,
            lt: <InlineMath math="<" />,
          }}
        />
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
        {[
          { l: "a", lhs: ["2","3"], rhs: ["3","5"] },
          { l: "b", lhs: ["4","7"], rhs: ["5","9"] },
          { l: "c", lhs: ["3","8"], rhs: ["2","6"] },
          { l: "d", lhs: ["7","10"], rhs: ["5","7"] },
        ].map(({ l, lhs, rhs }) => (
          <div key={l} className="flex items-center gap-3 bg-rose-500/5 border border-rose-500/15 rounded-lg px-4 py-2.5">
            <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
            <F n={lhs[0]} d={lhs[1]} />
            <span className="text-rose-300/50 text-xl font-light px-1">□</span>
            <F n={rhs[0]} d={rhs[1]} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 6 ───────────────────────────────────────────── */
const SoalEnam = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.artiSenilai.q6.instruction')}
      </p>
      <div className="space-y-3 pl-1">
        {[
          { l: "a", fracs: [["1","4"],["3","8"],["1","6"]] },
          { l: "b", fracs: [["1","3"],["2","9"],["1","6"]] },
          { l: "c", fracs: [["2","5"],["3","10"],["7","20"]] },
          { l: "d", fracs: [["4","9"],["5","12"],["7","18"]] },
        ].map(({ l, fracs }) => (
          <div key={l} className="flex items-center gap-2 flex-wrap bg-indigo-500/5 border border-indigo-500/15 rounded-lg px-4 py-2.5">
            <SubLabel letter={l} color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
            {fracs.map(([n, d], i) => (
              <span key={i} className="flex items-center gap-2">
                <F n={n} d={d} />
                {i < fracs.length - 1 && <span className="text-white/30 text-base">,</span>}
              </span>
            ))}
            <span className="ml-auto text-indigo-400/30 text-xs font-body">
              {t('practice.pecahan.artiSenilai.q6.hint')}
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
    { letter: "a", text: t('practice.pecahan.artiSenilai.q7.itemA') },
    { letter: "b", text: t('practice.pecahan.artiSenilai.q7.itemB') },
  ];
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.artiSenilai.q7.instruction')}
      </p>
      <div className="space-y-2 pl-1">
        {items.map(({ letter, text }) => (
          <div key={letter} className="flex items-start gap-2.5">
            <SubLabel letter={letter} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
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
    { letter: "a", text: t('practice.pecahan.artiSenilai.q8.itemA') },
    { letter: "b", text: t('practice.pecahan.artiSenilai.q8.itemB') },
    { letter: "c", text: t('practice.pecahan.artiSenilai.q8.itemC') },
  ];
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.artiSenilai.q8.instruction')}
      </p>
      <div className="space-y-2 pl-1">
        {items.map(({ letter, text }) => (
          <div key={letter} className="flex items-start gap-2.5">
            <SubLabel letter={letter} color="bg-teal-500/20 text-teal-300 border border-teal-400/30" />
            <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────── */
const ArtiPecahanSenilaiMembandingkanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = [
    {
      num: 1, tag: t('practice.pecahan.artiSenilai.tags.q1'),
      tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
      gradient: "from-violet-900/50 to-purple-900/30", border: "border-violet-500/25",
      bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
      custom: <SoalSatu />,
    },
    {
      num: 2, tag: t('practice.pecahan.artiSenilai.tags.q2'),
      tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
      gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
      bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
      custom: <SoalDua />,
    },
    {
      num: 3, tag: t('practice.pecahan.artiSenilai.tags.q3'),
      tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
      gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
      bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
      custom: <SoalTiga />,
    },
    {
      num: 4, tag: t('practice.pecahan.artiSenilai.tags.q4'),
      tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
      gradient: "from-emerald-900/40 to-green-900/25", border: "border-emerald-500/25",
      bar: "from-emerald-400 to-green-500", numBg: "bg-emerald-500/30 text-emerald-200",
      custom: <SoalEmpat />,
    },
    {
      num: 5, tag: t('practice.pecahan.artiSenilai.tags.q5'),
      tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
      gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
      bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
      custom: <SoalLima />,
    },
    {
      num: 6, tag: t('practice.pecahan.artiSenilai.tags.q6'),
      tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
      gradient: "from-indigo-900/40 to-violet-900/25", border: "border-indigo-500/25",
      bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
      custom: <SoalEnam />,
    },
    {
      num: 7, tag: t('practice.pecahan.artiSenilai.tags.q7'),
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
      gradient: "from-amber-900/35 to-yellow-900/20", border: "border-amber-500/25",
      bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
      custom: <SoalTujuh />,
    },
    {
      num: 8, tag: t('practice.pecahan.artiSenilai.tags.q8'),
      tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
      gradient: "from-teal-900/40 to-cyan-900/25", border: "border-teal-500/25",
      bar: "from-teal-400 to-cyan-500", numBg: "bg-teal-500/30 text-teal-200",
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-teal-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">🍕</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(45,212,191,0.5)' }}>
            {t('practice.pecahan.artiSenilai.pageTitle1')}
            <br />
            <span className="text-teal-300">{t('practice.pecahan.artiSenilai.pageTitle2')}</span>
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">
            {t('practice.pecahan.artiSenilai.pageSubtitle')}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">
              {t('practice.pecahan.artiSenilai.badgeSoal')}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-400 font-body">✦ {t('practice.grade7Label')}</span>
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
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} backdrop-blur`} />
              {/* Border */}
              <div className={`absolute inset-0 border ${c.border} rounded-2xl`} />
              {/* Left accent bar */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${c.bar} rounded-l-2xl`} />

              <div className="relative px-5 py-4 pl-6">
                {/* Card header row */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-body shrink-0 ${c.numBg}`}>
                    {c.num}
                  </span>
                  <Tag label={c.tag} color={c.tagColor} />
                </div>
                {/* Content */}
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
            className="text-sm text-white/30 hover:text-teal-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.pecahan.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtiPecahanSenilaiMembandingkanPage;
