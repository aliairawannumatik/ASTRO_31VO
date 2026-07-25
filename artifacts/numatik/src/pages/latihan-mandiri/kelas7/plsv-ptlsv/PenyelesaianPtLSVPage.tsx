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
const Sub = ({ n, color }: { n: string; color: string }) => (
  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0 ${color}`}>{n}</span>
);

/* ── SECTION 1: Pertidaksamaan Sederhana ─────────────── */
const Soal1 = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.plsvPtlsv.penyelesaianPtLSV.q1.instruction"
          components={{ a: <span className="text-rose-300 font-semibold" /> }}
        />
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
        {[
          { n: "1",  e: "n - 4 > 7" },
          { n: "2",  e: "n + 12 < 6" },
          { n: "3",  e: "n + 6 \\le -5" },
          { n: "4",  e: "n - 8 \\ge 3" },
          { n: "5",  e: "n - 9 < -12" },
          { n: "6",  e: "5 + m \\ge -4" },
          { n: "7",  e: "13 + m > 6" },
          { n: "8",  e: "9 \\le 7 - m" },
          { n: "9",  e: "-5 \\le 8 - m" },
          { n: "10", e: "-14 \\le -11 - m" },
          { n: "11", e: "4k < 16" },
          { n: "12", e: "5k > -15" },
          { n: "13", e: "-3k \\le 21" },
          { n: "14", e: "-8k \\ge -4" },
          { n: "15", e: "\\tfrac{1}{4}k \\le -3" },
          { n: "16", e: "-6k \\ge 18" },
          { n: "17", e: "-\\tfrac{2}{3}k \\le -16" },
          { n: "18", e: "\\tfrac{3}{5}k \\ge -\\tfrac{9}{25}" },
        ].map(({ n, e }) => (
          <div key={n} className="flex items-center gap-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-2.5">
            <Sub n={n} color="bg-rose-500/25 text-rose-300 border border-rose-400/35" />
            <span className="overflow-x-auto"><M math={e} /></span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── SECTION 2: Pertidaksamaan Campuran & Distributif ── */
const Soal2 = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.plsvPtlsv.penyelesaianPtLSV.q2.instruction"
          components={{ a: <span className="text-pink-300 font-semibold" /> }}
        />
      </p>
      <div className="space-y-2 pl-1">
        {[
          { n: "19", e: "5a \\le 4a + 8" },
          { n: "20", e: "6a - 5 > 5a + 3" },
          { n: "21", e: "3(a - 4) \\le a - 6" },
          { n: "22", e: "8(3 - a) > 24 - 7a" },
          { n: "23", e: "3a - 9 < -16" },
          { n: "24", e: "-4a + 12 \\ge 8" },
          { n: "25", e: "5 - 3a < 14" },
          { n: "26", e: "14 + \\tfrac{4}{5}p < 6" },
          { n: "27", e: "4p > 9p - 10" },
          { n: "28", e: "4p - 7 \\ge 5p" },
          { n: "29", e: "11a - 9 + 3a < 16a - 5" },
          { n: "30", e: "9a + 15 - 4a > 3a + 10" },
          { n: "31", e: "5(2p - 3) + 6p \\le 13p + 9" },
          { n: "32", e: "4(5p + 2) - 7p > 16p - 11" },
          { n: "33", e: "8p - 4(2p + 4) \\ge 10 - 8p" },
          { n: "34", e: "4x + 5(3x - 2) < 6 + 17x" },
          { n: "35", e: "5(4x - 3) - 8x \\le 3(3x + 2)" },
          { n: "36", e: "9(3 - x) + 11x \\ge 4(x + 10)" },
          { n: "37", e: "\\tfrac{1}{3}(6y + 4) \\ge 2y + 1\\tfrac{1}{2}" },
          { n: "38", e: "\\tfrac{3}{4}(2y - 6) - \\tfrac{1}{3}(y - 8) < 5\\tfrac{1}{6}" },
        ].map(({ n, e }) => (
          <div key={n} className="flex items-center gap-2.5 bg-pink-500/5 border border-pink-500/10 rounded-lg px-3 py-2.5">
            <Sub n={n} color="bg-pink-500/25 text-pink-300 border border-pink-400/35" />
            <span className="overflow-x-auto"><M math={e} /></span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── SECTION 3: Pertidaksamaan Ganda ──────────────────── */
const Soal3 = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.plsvPtlsv.penyelesaianPtLSV.q3.instruction"
          components={{ a: <span className="text-fuchsia-300 font-semibold" /> }}
        />
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
        {[
          { n: "39", e: "3 < n + 5 < 10" },
          { n: "40", e: "-4 \\le n - 8 \\le 4" },
          { n: "41", e: "3\\tfrac{1}{2} \\le n + \\tfrac{3}{4} < 7" },
          { n: "42", e: "-9 < n - 7 \\le -5" },
          { n: "43", e: "-7 < 2m + 1 \\le 15" },
          { n: "44", e: "-10 \\le -5m \\le 25" },
        ].map(({ n, e }) => (
          <div key={n} className="flex items-center gap-2.5 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-lg px-3 py-2.5">
            <Sub n={n} color="bg-fuchsia-500/25 text-fuchsia-300 border border-fuchsia-400/35" />
            <span className="overflow-x-auto"><M math={e} /></span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── SECTION 4: Pertidaksamaan Pecahan ────────────────── */
const Soal4 = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.plsvPtlsv.penyelesaianPtLSV.q4.instruction"
          components={{ a: <span className="text-violet-300 font-semibold" /> }}
        />
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
        {[
          { n: "45", e: "\\tfrac{1}{3}x + 4 > 10" },
          { n: "46", e: "\\tfrac{3}{4}x - 6 \\le 9" },
          { n: "47", e: "\\tfrac{2}{5}x - 3 > -5" },
          { n: "48", e: "\\tfrac{1}{8} - \\tfrac{1}{3}y < 5" },
          { n: "49", e: "\\tfrac{3}{4}y + 5 \\ge \\tfrac{1}{3}" },
          { n: "50", e: "\\tfrac{7}{15} - \\tfrac{y}{5} < -3" },
          { n: "51", e: "\\tfrac{3}{4}x - \\tfrac{7}{8} > \\tfrac{5}{6}x" },
          { n: "52", e: "\\tfrac{5x}{6} - \\tfrac{x}{4} \\le \\tfrac{2}{3}" },
          { n: "53", e: "\\tfrac{x}{3} + \\tfrac{3}{4} < \\tfrac{3x}{5}" },
          { n: "54", e: "\\tfrac{3x}{4} - \\tfrac{7}{8} > \\tfrac{x}{3}" },
          { n: "55", e: "\\dfrac{5}{p} - \\dfrac{3}{4} > \\dfrac{7}{3p},\\; p > 0" },
          { n: "56", e: "\\dfrac{5}{3p} \\le \\dfrac{9}{4p} + \\dfrac{7}{8},\\; p > 0" },
          { n: "57", e: "\\dfrac{p}{3} - \\dfrac{p - 4}{5} \\ge \\dfrac{7}{10}" },
          { n: "58", e: "\\dfrac{p + 6}{9} + \\dfrac{p}{3} < \\dfrac{5}{6}" },
        ].map(({ n, e }) => (
          <div key={n} className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-2.5">
            <Sub n={n} color="bg-violet-500/25 text-violet-300 border border-violet-400/35" />
            <span className="overflow-x-auto"><M math={e} /></span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── SECTION 5: Himpunan B / C / Q ────────────────────── */
const Soal5 = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <Trans
          i18nKey="practice.plsvPtlsv.penyelesaianPtLSV.q5.instruction"
          components={{
            cacah:    <span className="text-indigo-300 font-semibold">{t('practice.plsvPtlsv.penyelesaianPtLSV.q5.cacah')} <M math="C" /></span>,
            bulat:    <span className="text-indigo-300 font-semibold">{t('practice.plsvPtlsv.penyelesaianPtLSV.q5.bulat')} <M math="B" /></span>,
            rasional: <span className="text-indigo-300 font-semibold">{t('practice.plsvPtlsv.penyelesaianPtLSV.q5.rasional')} <M math="Q" /></span>,
          }}
        />
      </p>
      <div className="space-y-2 pl-1">
        {[
          { n: "59", e: "5(2p + 3) > 3(p - 4) + 6p,\\; p \\in B" },
          { n: "60", e: "4(2p - 4) + 3p \\le 4(3p + 6),\\; p \\in B" },
          { n: "61", e: "\\tfrac{2}{3}(6p - 9) \\ge \\tfrac{3}{4}(3p + 8),\\; p \\in C" },
          { n: "62", e: "6x - 4(3x - 2) < 4(8 - 2x),\\; x \\in C" },
          { n: "63", e: "5x - 2(5x + 2) \\ge 5(x + 4) - 12,\\; x \\in Q" },
          { n: "64", e: "9(2y - 3) - 3(4y - 7) > 14 - 8y,\\; y \\in Q" },
          { n: "65", e: "6(2y + 3) - 5(3y + 2) < 4(y - 4),\\; y \\in C" },
          { n: "66", e: "\\tfrac{1}{5}(4p + 1) \\ge \\tfrac{1}{5}(p + 4),\\; p \\in C" },
          { n: "67", e: "\\tfrac{1}{3}(2x - 1) < \\tfrac{1}{8}x + 3,\\; x \\in C" },
          { n: "68", e: "\\tfrac{1}{4}(p + 3) + \\tfrac{1}{3}(p - 2) > 1,\\; p \\in C" },
          { n: "69", e: "\\tfrac{3}{4}(1 - 3y) - \\tfrac{1}{4}(3 - y) \\ge \\tfrac{1}{2},\\; y \\in B" },
          { n: "70", e: "\\dfrac{3a + 2}{5} + \\dfrac{a - 3}{4} > \\dfrac{7}{10},\\; a \\in B" },
          { n: "71", e: "\\dfrac{3y + 2}{4} < \\dfrac{y - 2}{3} + \\dfrac{5}{2},\\; y \\in B" },
          { n: "72", e: "\\dfrac{a + 5}{4} + \\dfrac{a - 3}{5} \\le \\dfrac{4a + 9}{10},\\; a \\in Q" },
          { n: "73", e: "\\dfrac{3(2y + 4)}{6} + \\dfrac{4(y + 2)}{5} \\le \\dfrac{3y + 2}{2},\\; y \\in B" },
          { n: "74", e: "\\dfrac{4x}{x + 3} - \\dfrac{2}{3} \\le \\dfrac{3x + 5}{x + 3},\\; x > -3,\\; x \\in B" },
          { n: "75", e: "\\dfrac{x}{x - 4} + \\dfrac{5}{6} \\le \\dfrac{x + 2}{x - 4} + \\dfrac{1}{2},\\; x > 4,\\; x \\in Q" },
        ].map(({ n, e }) => (
          <div key={n} className="flex items-center gap-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-3 py-2.5">
            <Sub n={n} color="bg-indigo-500/25 text-indigo-300 border border-indigo-400/35" />
            <span className="overflow-x-auto"><M math={e} /></span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────── */
const PenyelesaianPtLSVPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = [
    {
      num: 1, tag: t('practice.plsvPtlsv.penyelesaianPtLSV.tags.q1'), tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
      gradient: "from-rose-900/50 to-pink-900/30", border: "border-rose-500/25",
      bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
      custom: <Soal1 />,
    },
    {
      num: 2, tag: t('practice.plsvPtlsv.penyelesaianPtLSV.tags.q2'), tagColor: "bg-pink-500/20 text-pink-300 border-pink-400/40",
      gradient: "from-pink-900/50 to-fuchsia-900/30", border: "border-pink-500/25",
      bar: "from-pink-400 to-fuchsia-500", numBg: "bg-pink-500/30 text-pink-200",
      custom: <Soal2 />,
    },
    {
      num: 3, tag: t('practice.plsvPtlsv.penyelesaianPtLSV.tags.q3'), tagColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
      gradient: "from-fuchsia-900/50 to-violet-900/30", border: "border-fuchsia-500/25",
      bar: "from-fuchsia-400 to-violet-500", numBg: "bg-fuchsia-500/30 text-fuchsia-200",
      custom: <Soal3 />,
    },
    {
      num: 4, tag: t('practice.plsvPtlsv.penyelesaianPtLSV.tags.q4'), tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
      gradient: "from-violet-900/50 to-indigo-900/30", border: "border-violet-500/25",
      bar: "from-violet-400 to-indigo-500", numBg: "bg-violet-500/30 text-violet-200",
      custom: <Soal4 />,
    },
    {
      num: 5, tag: t('practice.plsvPtlsv.penyelesaianPtLSV.tags.q5'), tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
      gradient: "from-indigo-900/50 to-blue-900/30", border: "border-indigo-500/25",
      bar: "from-indigo-400 to-blue-500", numBg: "bg-indigo-500/30 text-indigo-200",
      custom: <Soal5 />,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/10 border border-rose-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(244,63,94,0.5)' }}>
            {t('practice.plsvPtlsv.penyelesaianPtLSV.title1')}
          </h1>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(244,63,94,0.5)' }}>
            {t('practice.plsvPtlsv.penyelesaianPtLSV.title2')}
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · PLSV & PtLSV · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">{t('practice.plsvPtlsv.penyelesaianPtLSV.badge')}</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-400 font-body">{t('practice.plsvPtlsv.penyelesaianPtLSV.kelasLabel')}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <div key={c.num} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} backdrop-blur`} />
              <div className={`absolute inset-0 border ${c.border} rounded-2xl`} />
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${c.bar} rounded-l-2xl`} />
              <div className="relative px-5 py-4 pl-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-body shrink-0 ${c.numBg}`}>{c.num}</span>
                  <Tag label={c.tag} color={c.tagColor} />
                </div>
                <div className="pl-1">{c.custom}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/plsv-ptlsv"); }}
            className="text-sm text-white/30 hover:text-rose-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} PLSV & PtLSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenyelesaianPtLSVPage;
