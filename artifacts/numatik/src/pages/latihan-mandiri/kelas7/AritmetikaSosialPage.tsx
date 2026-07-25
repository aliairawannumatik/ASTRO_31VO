import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { ShoppingCart, Tag, Package, TrendingUp, Receipt, Banknote, ChevronRight } from "lucide-react";

/* ── Visual config (non-translatable) ────────────────────── */
const subtopicsConfig = [
  { key: "jualBeli",     path: "/latihan-mandiri/kelas-7/aritmetika-sosial/jual-beli-untung-rugi", soal: 10, icon: ShoppingCart, gradient: "from-yellow-900/40 to-amber-900/30",   border: "border-yellow-500/30",   badge: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",   iconBg: "bg-yellow-500/20",   iconColor: "text-yellow-400",   leftBar: "from-yellow-400 to-amber-500" },
  { key: "diskon",       path: "/latihan-mandiri/kelas-7/aritmetika-sosial/diskon",                soal: 12, icon: Tag,          gradient: "from-orange-900/40 to-red-900/30",     border: "border-orange-500/30",   badge: "bg-orange-500/20 text-orange-300 border-orange-400/40",   iconBg: "bg-orange-500/20",   iconColor: "text-orange-400",   leftBar: "from-orange-400 to-red-500" },
  { key: "brutoNetto",   path: "/latihan-mandiri/kelas-7/aritmetika-sosial/bruto-netto-tara",      soal: 15, icon: Package,      gradient: "from-amber-900/40 to-yellow-900/30",   border: "border-amber-500/30",    badge: "bg-amber-500/20 text-amber-300 border-amber-400/40",      iconBg: "bg-amber-500/20",    iconColor: "text-amber-400",    leftBar: "from-amber-400 to-yellow-500" },
  { key: "bungaTunggal", path: "/latihan-mandiri/kelas-7/aritmetika-sosial/bunga-tunggal",         soal: 25, icon: TrendingUp,   gradient: "from-lime-900/40 to-green-900/30",     border: "border-lime-500/30",     badge: "bg-lime-500/20 text-lime-300 border-lime-400/40",         iconBg: "bg-lime-500/20",     iconColor: "text-lime-400",     leftBar: "from-lime-400 to-green-500" },
  { key: "ppn",          path: "/latihan-mandiri/kelas-7/aritmetika-sosial/ppn",                   soal: 10, icon: Receipt,      gradient: "from-emerald-900/40 to-teal-900/30",   border: "border-emerald-500/30",  badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40", iconBg: "bg-emerald-500/20",  iconColor: "text-emerald-400",  leftBar: "from-emerald-400 to-teal-500" },
  { key: "pph",          path: "/latihan-mandiri/kelas-7/aritmetika-sosial/pph",                   soal: 10, icon: Banknote,     gradient: "from-teal-900/40 to-cyan-900/30",      border: "border-teal-500/30",     badge: "bg-teal-500/20 text-teal-300 border-teal-400/40",         iconBg: "bg-teal-500/20",     iconColor: "text-teal-400",     leftBar: "from-teal-400 to-cyan-500" },
];

const AritmetikaSosialPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const subtopics = subtopicsConfig.map((s) => ({
    ...s,
    label: t(`practice.aritmetikaSosial.subtopics.${s.key}.label`),
    desc:  t(`practice.aritmetikaSosial.subtopics.${s.key}.desc`),
  }));

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🛒</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-yellow-300 text-center mb-1" style={{ textShadow: '0 0 24px rgba(250,204,21,0.7)' }}>
            {t('practice.aritmetikaSosial.title')}
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-1">Kelas 7 · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2 mt-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">82 {t('practice.suffixSoalTotal')} · UN / TKA / ANBK</span>
            <span className="text-yellow-400 text-sm">⭐</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {subtopics.map((s, i) => {
            const Icon = s.icon;
            return (
              <button key={s.key} onClick={() => { playPopSound(); navigate(s.path); }}
                className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.01] animate-slide-up"
                style={{ animationDelay: `${i * 0.07}s` }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} backdrop-blur`} />
                <div className={`absolute inset-0 border ${s.border} rounded-2xl group-hover:border-opacity-60 transition-colors`} />
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${s.leftBar} rounded-l-2xl`} />
                <div className="relative px-5 py-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${s.iconBg} border ${s.border} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${s.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-display text-sm font-bold text-white block mb-1">{s.label}</span>
                    <p className="text-white/40 text-xs font-body">{s.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${s.badge}`}>{s.soal} {t('practice.suffixSoal')}</span>
                    <ChevronRight className={`w-4 h-4 ${s.iconColor} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">{t('practice.enrichmentNote')}</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">{t('practice.aritmetikaSosial.enrichmentNoteDesc')}</p>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7"); }} className="text-sm text-muted-foreground hover:text-yellow-400 transition-colors cursor-pointer font-body">{t('practice.backToGrade7')}</button>
        </div>
      </div>
    </div>
  );
};
export default AritmetikaSosialPage;
