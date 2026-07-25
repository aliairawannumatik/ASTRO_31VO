import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ── Reusable atoms ───────────────────────────────────── */
const SubLabel = ({ letter, color }: { letter: string; color: string }) => (
  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${color}`}>
    {letter}
  </span>
);

const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${color}`}>
    {label}
  </span>
);

/* ── Soal 1 ── Bulatkan ke 1 desimal ─────────────────── */
const SoalSatu = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.pecahan.pembulatanDesimal.q1.instruction"
          components={{ s: <strong className="text-violet-300" /> }}
        />
      </p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-1">
        {[
          { l: "a", val: "6{,}83" },
          { l: "b", val: "9{,}47" },
          { l: "c", val: "3{,}158" },
          { l: "d", val: "7{,}052" },
        ].map(({ l, val }) => (
          <div key={l} className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-1.5">
            <SubLabel letter={l} color="bg-violet-500/30 text-violet-300 border border-violet-400/40" />
            <InlineMath math={val} />
            <span className="ml-auto text-white/20 text-xs font-body">≈ …</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 2 ── Bulatkan ke 2 desimal ─────────────────── */
const SoalDua = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.pecahan.pembulatanDesimal.q2.instruction"
          components={{ s: <strong className="text-orange-300" /> }}
        />
      </p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-1">
        {[
          { l: "a", val: "2{,}3847" },
          { l: "b", val: "7{,}1062" },
          { l: "c", val: "0{,}09374" },
          { l: "d", val: "13{,}0095" },
        ].map(({ l, val }) => (
          <div key={l} className="flex items-center gap-2.5 bg-orange-500/5 border border-orange-500/10 rounded-lg px-3 py-1.5">
            <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
            <InlineMath math={val} />
            <span className="ml-auto text-white/20 text-xs font-body">≈ …</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 3 ── Bulatkan ke 3, 2, dan 1 desimal ───────── */
const SoalTiga = () => {
  const { t } = useTranslation();
  const items: { l: string; key: "three" | "two" | "one" }[] = [
    { l: "a", key: "three" },
    { l: "b", key: "two" },
    { l: "c", key: "one" },
  ];
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.pembulatanDesimal.q3.instructionPre')}
        {t('practice.pecahan.pembulatanDesimal.q3.instructionPre') ? " " : ""}
        <InlineMath math="0{,}38519" />{" "}
        {t('practice.pecahan.pembulatanDesimal.q3.instructionPost')}
      </p>
      <div className="space-y-2 pl-1">
        {items.map(({ l, key }) => (
          <div key={l} className="flex items-center gap-2.5 bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-3 py-2">
            <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
            <p className="font-body text-sm text-white/80">
              {t(`practice.pecahan.pembulatanDesimal.q3.items.${key}`)}
            </p>
            <span className="ml-auto text-white/20 text-xs font-body">≈ …</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 4 ── Pecahan → desimal, lalu bulatkan ──────── */
const SoalEmpat = () => {
  const { t } = useTranslation();
  const items: { l: string; key: "two" | "three" }[] = [
    { l: "a", key: "two" },
    { l: "b", key: "three" },
  ];
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.pecahan.pembulatanDesimal.q4.instructionPre')}
        {t('practice.pecahan.pembulatanDesimal.q4.instructionPre') ? " " : ""}
        <InlineMath math="\dfrac{5}{7}" />{" "}
        {t('practice.pecahan.pembulatanDesimal.q4.instructionPost')}
      </p>
      <div className="space-y-2 pl-1">
        {items.map(({ l, key }) => (
          <div key={l} className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2.5">
            <SubLabel letter={l} color="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" />
            <p className="font-body text-sm text-white/80">
              {t(`practice.pecahan.pembulatanDesimal.q4.items.${key}`)}
            </p>
            <span className="ml-auto text-white/20 text-xs font-body">≈ …</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 5 ── Bulatkan ke satuan terdekat ───────────── */
const SoalLima = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.pecahan.pembulatanDesimal.q5.instruction"
          components={{ s: <strong className="text-indigo-300" /> }}
        />
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-1">
        {[
          { l: "a", val: "74{,}6" },
          { l: "b", val: "23{,}48" },
          { l: "c", val: "9{,}512" },
          { l: "d", val: "136{,}75" },
          { l: "e", val: "507{,}9" },
          { l: "f", val: "82{,}403" },
          { l: "g", val: "2{.}814{,}37" },
          { l: "h", val: "648{,}2951" },
        ].map(({ l, val }) => (
          <div key={l} className="flex items-center gap-2 bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-2.5 py-1.5">
            <SubLabel letter={l} color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
            <InlineMath math={val} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 6 ── Taksiran perkalian ────────────────────── */
const SoalEnam = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.pecahan.pembulatanDesimal.q6.instruction"
          components={{ s: <strong className="text-rose-300" /> }}
        />
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
        {[
          { l: "a", expr: "6{,}47 \\times 11{,}83" },
          { l: "b", expr: "38{,}9 \\times 7{,}134" },
          { l: "c", expr: "14{,}56 \\times 203{,}7" },
          { l: "d", expr: "97{,}24 \\times 108{,}6" },
        ].map(({ l, expr }) => (
          <div key={l} className="flex items-center gap-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-1.5">
            <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
            <InlineMath math={expr} />
            <span className="ml-auto text-white/20 text-xs font-body">≈ …</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 7 ── Taksiran pembagian ────────────────────── */
const SoalTujuh = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.pecahan.pembulatanDesimal.q7.instruction"
          components={{ s: <strong className="text-amber-300" /> }}
        />
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
        {[
          { l: "a", expr: "58{,}74 : 6{,}21" },
          { l: "b", expr: "83{,}16 : 27{,}4" },
          { l: "c", expr: "314{,}82 : 16{,}07" },
          { l: "d", expr: "427{,}65 : 38{,}91" },
        ].map(({ l, expr }) => (
          <div key={l} className="flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-1.5">
            <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
            <InlineMath math={expr} />
            <span className="ml-auto text-white/20 text-xs font-body">≈ …</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 8 ── Taksiran luas persegi panjang ─────────── */
const SoalDelapan = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.pecahan.pembulatanDesimal.q8.instruction"
          components={{
            s: <strong className="text-teal-300" />,
            m1: <InlineMath math="34{,}7\ \mathrm{m}" />,
            m2: <InlineMath math="18{,}4\ \mathrm{m}" />,
          }}
        />
      </p>
      <div className="pl-1">
        <svg width="240" height="110" viewBox="0 0 240 110">
          <rect x={10} y={10} width={190} height={82} rx={6}
            fill="#2dd4bf" fillOpacity={0.06} stroke="#2dd4bf" strokeWidth={1.5} />
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i}
              x1={10 + i * 14} y1={10}
              x2={10 + i * 14 - 14} y2={92}
              stroke="#2dd4bf" strokeWidth={0.5} strokeOpacity={0.15} />
          ))}
          <text x={105} y={57} textAnchor="middle" fill="#5eead4" fontSize={11} fontFamily="monospace">
            p = 34,7 m
          </text>
          <text x={210} y={55} textAnchor="middle" fill="#5eead4" fontSize={10}
            fontFamily="monospace" transform="rotate(90,210,55)">
            l = 18,4 m
          </text>
          <text x={105} y={103} textAnchor="middle" fill="#5eead4" fontSize={9} fontFamily="monospace">
            L ≈ … × … = … m²
          </text>
        </svg>
      </div>
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────── */
const PembulatanDesimalPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const cards = [
    {
      num: 1, tag: t('practice.pecahan.pembulatanDesimal.tags.q1'),
      tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
      gradient: isDark ? "from-violet-900/50 to-purple-900/30" : "from-violet-50/80 to-purple-50/60", border: "border-violet-500/25",
      bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
      custom: <SoalSatu />,
    },
    {
      num: 2, tag: t('practice.pecahan.pembulatanDesimal.tags.q2'),
      tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
      gradient: isDark ? "from-orange-900/40 to-amber-900/25" : "from-orange-50/80 to-amber-50/60", border: "border-orange-500/25",
      bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
      custom: <SoalDua />,
    },
    {
      num: 3, tag: t('practice.pecahan.pembulatanDesimal.tags.q3'),
      tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
      gradient: isDark ? "from-cyan-900/40 to-sky-900/25" : "from-cyan-50/80 to-sky-50/60", border: "border-cyan-500/25",
      bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
      custom: <SoalTiga />,
    },
    {
      num: 4, tag: t('practice.pecahan.pembulatanDesimal.tags.q4'),
      tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
      gradient: isDark ? "from-emerald-900/40 to-green-900/25" : "from-emerald-50/80 to-green-50/60", border: "border-emerald-500/25",
      bar: "from-emerald-400 to-green-500", numBg: "bg-emerald-500/30 text-emerald-200",
      custom: <SoalEmpat />,
    },
    {
      num: 5, tag: t('practice.pecahan.pembulatanDesimal.tags.q5'),
      tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
      gradient: isDark ? "from-indigo-900/40 to-violet-900/25" : "from-indigo-50/80 to-violet-50/60", border: "border-indigo-500/25",
      bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
      custom: <SoalLima />,
    },
    {
      num: 6, tag: t('practice.pecahan.pembulatanDesimal.tags.q6'),
      tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
      gradient: isDark ? "from-rose-900/40 to-pink-900/25" : "from-rose-50/80 to-pink-50/60", border: "border-rose-500/25",
      bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
      custom: <SoalEnam />,
    },
    {
      num: 7, tag: t('practice.pecahan.pembulatanDesimal.tags.q7'),
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
      gradient: isDark ? "from-amber-900/35 to-yellow-900/20" : "from-amber-50/80 to-yellow-50/60", border: "border-amber-500/25",
      bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
      custom: <SoalTujuh />,
    },
    {
      num: 8, tag: t('practice.pecahan.pembulatanDesimal.tags.q8'),
      tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
      gradient: isDark ? "from-teal-900/40 to-cyan-900/25" : "from-teal-50/80 to-cyan-50/60", border: "border-teal-500/25",
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/10 border border-fuchsia-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">🎯</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(232,121,249,0.5)' }}
          >
            {t('practice.pecahan.pembulatanDesimal.pageTitle')}
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">
            {t('practice.pecahan.pembulatanDesimal.pageSubtitle')}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">
              {t('practice.pecahan.pembulatanDesimal.badgeSoal')}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/20 text-fuchsia-400 font-body">
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
            className="text-sm text-white/30 hover:text-fuchsia-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.pecahan.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembulatanDesimalPage;
