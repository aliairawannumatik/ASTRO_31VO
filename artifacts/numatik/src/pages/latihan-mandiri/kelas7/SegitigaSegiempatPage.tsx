import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { Triangle, RectangleHorizontal, Maximize2, Square, Shapes, ChevronRight } from "lucide-react";

/* ── Visual config (non-translatable) ────────────────────── */
const subtopicsConfig = [
  { key: "garisBeratBagiTinggi",          path: "/latihan-mandiri/kelas-7/segitiga-dan-segiempat/garis-berat-bagi-tinggi",          soal: 12, icon: Triangle,             gradient: "from-rose-900/40 to-pink-900/30",     border: "border-rose-500/30",   badge: "bg-rose-500/20 text-rose-300 border-rose-400/40",       iconBg: "bg-rose-500/20",   iconColor: "text-rose-400",   leftBar: "from-rose-400 to-pink-500" },
  { key: "kelilingSegitigaSegiempat",     path: "/latihan-mandiri/kelas-7/segitiga-dan-segiempat/keliling-segitiga-dan-segiempat",  soal: 15, icon: RectangleHorizontal,  gradient: "from-pink-900/40 to-fuchsia-900/30",  border: "border-pink-500/30",   badge: "bg-pink-500/20 text-pink-300 border-pink-400/40",       iconBg: "bg-pink-500/20",   iconColor: "text-pink-400",   leftBar: "from-pink-400 to-fuchsia-500" },
  { key: "luasSegitiga",                  path: "/latihan-mandiri/kelas-7/segitiga-dan-segiempat/luas-segitiga",                    soal: 13, icon: Maximize2,            gradient: "from-fuchsia-900/40 to-violet-900/30", border: "border-fuchsia-500/30", badge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40", iconBg: "bg-fuchsia-500/20", iconColor: "text-fuchsia-400", leftBar: "from-fuchsia-400 to-violet-500" },
  { key: "luasSegiempat",                 path: "/latihan-mandiri/kelas-7/segitiga-dan-segiempat/luas-segiempat",                   soal: 15, icon: Square,               gradient: "from-violet-900/40 to-indigo-900/30",  border: "border-violet-500/30", badge: "bg-violet-500/20 text-violet-300 border-violet-400/40", iconBg: "bg-violet-500/20", iconColor: "text-violet-400", leftBar: "from-violet-400 to-indigo-500" },
  { key: "kelilingLuasBangunTakBeraturan", path: "/latihan-mandiri/kelas-7/segitiga-dan-segiempat/keliling-luas-bangun-tak-beraturan", soal: 15, icon: Shapes,            gradient: "from-indigo-900/40 to-blue-900/30",    border: "border-indigo-500/30", badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40", iconBg: "bg-indigo-500/20", iconColor: "text-indigo-400", leftBar: "from-indigo-400 to-blue-500" },
];

const SegitigaSegiempatPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const subtopics = subtopicsConfig.map((s) => ({
    ...s,
    label: t(`practice.segitigaSegiempat.subtopics.${s.key}.label`),
    desc:  t(`practice.segitigaSegiempat.subtopics.${s.key}.desc`),
  }));

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">📐</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-rose-300 text-center mb-1" style={{ textShadow: '0 0 24px rgba(251,113,133,0.7)' }}>{t('practice.segitigaSegiempat.title')}</h1>
          <p className="text-white/50 text-xs text-center font-body mb-1">Kelas 7 · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2 mt-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">70 {t('practice.suffixSoalTotal')} · UN / TKA / ANBK</span>
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
          <p className="text-white/60 text-xs font-body leading-relaxed">{t('practice.segitigaSegiempat.enrichmentNoteDesc')}</p>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7"); }} className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">{t('practice.backToGrade7')}</button>
        </div>
      </div>
    </div>
  );
};
export default SegitigaSegiempatPage;
