import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

const AlgExpr = ({ math }: { math: string }) => (
  <span className="inline-block"><InlineMath math={math} /></span>
);

/* ── Soal 1 ── Satu variabel (k = -3) ────────────────── */
const SoalSatu = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.aljabar.substitusi.q1.introPre')}<AlgExpr math="k = -3" />{t('practice.aljabar.substitusi.q1.introEnd')}
      </p>
      <div className="space-y-2 pl-1">
        {[
          { l: "a", expr: "5k^2 - 2k" },
          { l: "b", expr: "(-4k)^2" },
          { l: "c", expr: "(k + 7)^2" },
          { l: "d", expr: "-2k^3 + 6k" },
          { l: "e", expr: "k^2 - (k - 5)^2" },
          { l: "f", expr: "3k^2 + 4k - 9" },
        ].map(({ l, expr }) => (
          <div key={l} className="flex items-center gap-2.5 bg-sky-500/5 border border-sky-500/10 rounded-lg px-3 py-2">
            <SubLabel letter={l} color="bg-sky-500/30 text-sky-300 border border-sky-400/40" />
            <AlgExpr math={expr} />
            <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 2 ── Dua variabel ───────────────────────────── */
const SoalDua = () => {
  const { t } = useTranslation();
  const items = [
    { l: "a", expr: "p^2 - 6p", kKey: "k1" },
    { l: "b", expr: "3m + 2m^2q", kKey: "k2" },
    { l: "c", expr: "4r^2 - 3r^2s", kKey: "k3" },
    { l: "d", expr: "x^3y - 2x^2y^2", kKey: "k4" },
  ];
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.aljabar.substitusi.q2.instruction')}
      </p>
      <div className="space-y-2 pl-1">
        {items.map(({ l, expr, kKey }) => (
          <div key={l} className="flex items-start gap-2.5 bg-teal-500/5 border border-teal-500/10 rounded-lg px-3 py-2.5">
            <SubLabel letter={l} color="bg-teal-500/20 text-teal-300 border border-teal-400/30" />
            <div className="flex flex-col gap-0.5">
              <AlgExpr math={expr} />
              <span className="text-teal-300/50 text-[11px] font-body">
                {t(`practice.aljabar.substitusi.q2.${kKey}`)}
              </span>
            </div>
            <span className="ml-auto text-white/20 text-xs font-body shrink-0 pt-0.5">= …</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 3 ── Tiga variabel (a=-2, b=3, c=-4) ────────── */
const SoalTiga = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.aljabar.substitusi.q3.introPre')}<AlgExpr math="a = -2" />{t('practice.aljabar.substitusi.q3.introSep')}<AlgExpr math="b = 3" />{t('practice.aljabar.substitusi.q3.introAnd')}<AlgExpr math="c = -4" />{t('practice.aljabar.substitusi.q3.introEnd')}
      </p>
      <div className="space-y-2 pl-1">
        {[
          { l: "a", expr: "3ab - 2bc + 5ac" },
          { l: "b", expr: "(ab + c^2)^2" },
          { l: "c", expr: "a^2b - b^2c + c^2a" },
          { l: "d", expr: "3a(b^2 - 2c^2 + bc)" },
        ].map(({ l, expr }) => (
          <div key={l} className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-2">
            <SubLabel letter={l} color="bg-violet-500/20 text-violet-300 border border-violet-400/30" />
            <AlgExpr math={expr} />
            <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 4 ── Persegi panjang aljabar ───────────────── */
const SoalEmpat = () => {
  const { t } = useTranslation();
  const parts = [
    { l: "a", tKey: "a" },
    { l: "b", tKey: "b" },
  ];
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.aljabar.substitusi.q4.instruction')}
      </p>
      <div className="flex justify-center pl-1">
        <svg width="200" height="110" viewBox="0 0 200 110">
          <rect x={12} y={14} width={176} height={78} rx={6}
            fill="#38bdf8" fillOpacity={0.07} stroke="#38bdf8" strokeWidth={1.6} />
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i}
              x1={12 + i * 19} y1={14} x2={12 + i * 19 - 12} y2={92}
              stroke="#38bdf8" strokeWidth={0.5} strokeOpacity={0.15} />
          ))}
          <text x={100} y={10} textAnchor="middle" fill="#7dd3fc" fontSize={10} fontFamily="monospace">3x + 1</text>
          <text x={196} y={56} textAnchor="middle" fill="#7dd3fc" fontSize={10}
            fontFamily="monospace" transform="rotate(90,196,56)">2y − 3</text>
        </svg>
      </div>
      <div className="space-y-1.5 pl-1">
        {parts.map(({ l, tKey }) => (
          <div key={l} className="flex items-start gap-2.5">
            <SubLabel letter={l} color="bg-sky-500/20 text-sky-300 border border-sky-400/30" />
            <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">
              {t(`practice.aljabar.substitusi.q4.${tKey}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 5 ── Tiga variabel m, n, p ─────────────────── */
const SoalLima = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.aljabar.substitusi.q5.introPre')}<AlgExpr math="m = 4" />{t('practice.aljabar.substitusi.q5.introSep')}<AlgExpr math="n = -3" />{t('practice.aljabar.substitusi.q5.introAnd')}<AlgExpr math="p = -2" />{t('practice.aljabar.substitusi.q5.introEnd')}
      </p>
      <div className="space-y-2 pl-1">
        {[
          { l: "a", expr: "5m^2 - 6mn + 8n^2" },
          { l: "b", expr: "14mn - 3mp + 10n^2 - 8np" },
          { l: "c", expr: "6m^2p - 4m^2n + 2mp^2" },
        ].map(({ l, expr }) => (
          <div key={l} className="flex items-center gap-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-3 py-2">
            <SubLabel letter={l} color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
            <span className="flex-1 overflow-x-auto"><AlgExpr math={expr} /></span>
            <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Soal 6 ── Kontekstual: ketinggian bola ──────────── */
const SoalEnam = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <p className="font-body text-sm text-white/90 leading-relaxed">
            {t('practice.aljabar.substitusi.q6.introPre')}<AlgExpr math="h" />{t('practice.aljabar.substitusi.q6.introMid1')}<AlgExpr math="t" />{t('practice.aljabar.substitusi.q6.introMid2')}<AlgExpr math="h = 5t^2 - 8t + 3" />{t('practice.aljabar.substitusi.q6.introMid3')}<strong className="text-white">{t('practice.aljabar.substitusi.q6.bold')}</strong>{t('practice.aljabar.substitusi.q6.introEnd')}
          </p>
        </div>
        <div className="shrink-0">
          <svg width="60" height="90" viewBox="0 0 60 90">
            <rect x={22} y={40} width={16} height={45} rx={2}
              fill="#6366f1" fillOpacity={0.25} stroke="#818cf8" strokeWidth={1} />
            <rect x={10} y={30} width={40} height={12} rx={2}
              fill="#6366f1" fillOpacity={0.35} stroke="#818cf8" strokeWidth={1} />
            <circle cx={30} cy={10} r={8}
              fill="#fbbf24" fillOpacity={0.7} stroke="#fcd34d" strokeWidth={1.5} />
            <line x1={30} y1={18} x2={30} y2={30}
              stroke="#fcd34d" strokeWidth={1} strokeDasharray="2,2" />
            <text x={30} y={83} textAnchor="middle" fill="#818cf8" fontSize={7} fontFamily="monospace">
              {t('practice.aljabar.substitusi.q6.svgLabel')}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ── Soal 7 ── Kontekstual: berat muatan kapal ───────── */
const SoalTujuh = () => {
  const { t } = useTranslation();
  const parts = [
    { l: "a", tKey: "a" },
    { l: "b", tKey: "b" },
  ];
  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <p className="font-body text-sm text-white/90 leading-relaxed">
            {t('practice.aljabar.substitusi.q7.introPre')}<AlgExpr math="x" />{t('practice.aljabar.substitusi.q7.introMid1')}<AlgExpr math="(3x - 5)" />{t('practice.aljabar.substitusi.q7.introMid2')}<AlgExpr math="W" />{t('practice.aljabar.substitusi.q7.introEnd')}
          </p>
          <div className="space-y-1.5 pl-1 mt-2.5">
            {parts.map(({ l, tKey }) => (
              <div key={l} className="flex items-start gap-2.5">
                <SubLabel letter={l} color="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" />
                <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">
                  {t(`practice.aljabar.substitusi.q7.${tKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <svg width="80" height="60" viewBox="0 0 80 60">
            <rect x={5} y={28} width={70} height={24} rx={3}
              fill="#059669" fillOpacity={0.2} stroke="#34d399" strokeWidth={1.2} />
            <polygon points="5,52 10,58 70,58 75,52"
              fill="#059669" fillOpacity={0.35} stroke="#34d399" strokeWidth={1} />
            <rect x={20} y={18} width={40} height={12} rx={2}
              fill="#059669" fillOpacity={0.25} stroke="#34d399" strokeWidth={1} />
            <text x={40} y={44} textAnchor="middle" fill="#6ee7b7" fontSize={7} fontFamily="monospace">
              {t('practice.aljabar.substitusi.q7.svgLabel')}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ── Soal 8 ── Pola bilangan dengan substitusi ────────── */
const SoalDelapan = () => {
  const { t } = useTranslation();
  const parts = [
    { l: "a", tKey: "a" },
    { l: "b", tKey: "b" },
    { l: "c", tKey: "c" },
  ];
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        {t('practice.aljabar.substitusi.q8.introPre')}<AlgExpr math="n" />{t('practice.aljabar.substitusi.q8.introMid')}<AlgExpr math="U_n = 3n^2 - 2n + 5" />{t('practice.aljabar.substitusi.q8.introEnd')}
      </p>
      <div className="space-y-1.5 pl-1">
        {parts.map(({ l, tKey }) => (
          <div key={l} className="flex items-start gap-2.5">
            <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
            <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">
              {t(`practice.aljabar.substitusi.q8.${tKey}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────── */
const SubstitusiBilanganAljabarPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const cards = [
    {
      num: 1, tag: t('practice.aljabar.substitusi.tag1'), tagColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
      gradient: isDark ? "from-sky-900/50 to-cyan-900/30" : "from-sky-50/80 to-cyan-50/60", border: "border-sky-500/25",
      bar: "from-sky-400 to-cyan-500", numBg: "bg-sky-500/30 text-sky-200",
      custom: <SoalSatu />,
    },
    {
      num: 2, tag: t('practice.aljabar.substitusi.tag2'), tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
      gradient: isDark ? "from-teal-900/40 to-emerald-900/25" : "from-teal-50/80 to-emerald-50/60", border: "border-teal-500/25",
      bar: "from-teal-400 to-emerald-500", numBg: "bg-teal-500/30 text-teal-200",
      custom: <SoalDua />,
    },
    {
      num: 3, tag: t('practice.aljabar.substitusi.tag3'), tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
      gradient: isDark ? "from-violet-900/40 to-purple-900/25" : "from-violet-50/80 to-purple-50/60", border: "border-violet-500/25",
      bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
      custom: <SoalTiga />,
    },
    {
      num: 4, tag: t('practice.aljabar.substitusi.tag4'), tagColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
      gradient: isDark ? "from-sky-900/40 to-blue-900/25" : "from-sky-50/80 to-blue-50/60", border: "border-sky-500/25",
      bar: "from-sky-400 to-blue-500", numBg: "bg-sky-500/30 text-sky-200",
      custom: <SoalEmpat />,
    },
    {
      num: 5, tag: t('practice.aljabar.substitusi.tag5'), tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
      gradient: isDark ? "from-indigo-900/40 to-violet-900/25" : "from-indigo-50/80 to-violet-50/60", border: "border-indigo-500/25",
      bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
      custom: <SoalLima />,
    },
    {
      num: 6, tag: t('practice.aljabar.substitusi.tag6'), tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
      gradient: isDark ? "from-amber-900/35 to-orange-900/20" : "from-amber-50/80 to-orange-50/60", border: "border-amber-500/25",
      bar: "from-amber-400 to-orange-500", numBg: "bg-amber-500/30 text-amber-200",
      custom: <SoalEnam />,
    },
    {
      num: 7, tag: t('practice.aljabar.substitusi.tag7'), tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
      gradient: isDark ? "from-emerald-900/40 to-teal-900/25" : "from-emerald-50/80 to-teal-50/60", border: "border-emerald-500/25",
      bar: "from-emerald-400 to-teal-500", numBg: "bg-emerald-500/30 text-emerald-200",
      custom: <SoalTujuh />,
    },
    {
      num: 8, tag: t('practice.aljabar.substitusi.tag8'), tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
      gradient: isDark ? "from-rose-900/40 to-pink-900/25" : "from-rose-50/80 to-pink-50/60", border: "border-rose-500/25",
      bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-cyan-500/10 border border-sky-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">🔁</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(56,189,248,0.5)' }}
          >
            {t('practice.aljabar.substitusi.pageTitle')}
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Aljabar · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">
              {t('practice.aljabar.substitusi.badgeSoal')}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 font-body">✦ Kelas 7</span>
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
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/aljabar"); }}
            className="text-sm text-white/30 hover:text-sky-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubstitusiBilanganAljabarPage;
