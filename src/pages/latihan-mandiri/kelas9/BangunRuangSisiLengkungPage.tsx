import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { Layers, Triangle, Circle, TrendingUp, Package, ChevronRight } from "lucide-react";

const subtopics = [
  {
    label: "TABUNG",
    path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/tabung",
    soal: 15,
    icon: Layers,
    emoji: "🧴",
    gradient: "from-cyan-900/40 to-sky-900/30",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    leftBar: "from-cyan-400 to-sky-500",
    desc: "Luas selimut, luas permukaan total, volume tabung, soal cerita",
  },
  {
    label: "KERUCUT",
    path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/kerucut",
    soal: 15,
    icon: Triangle,
    emoji: "🔺",
    gradient: "from-orange-900/40 to-amber-900/30",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
    leftBar: "from-orange-400 to-amber-500",
    desc: "Garis pelukis, luas selimut, luas permukaan, volume kerucut",
  },
  {
    label: "BOLA",
    path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/bola",
    soal: 15,
    icon: Circle,
    emoji: "🔮",
    gradient: "from-indigo-900/40 to-violet-900/30",
    border: "border-indigo-500/30",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
    leftBar: "from-indigo-400 to-violet-500",
    desc: "Luas permukaan dan volume bola, setengah bola, soal terapan",
  },
  {
    label: "PERUBAHAN LUAS PERMUKAAN DAN VOLUME BANGUN RUANG SISI LENGKUNG",
    path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/perubahan-volume",
    soal: 15,
    icon: TrendingUp,
    emoji: "🔄",
    gradient: "from-purple-900/40 to-fuchsia-900/30",
    border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    leftBar: "from-purple-400 to-fuchsia-500",
    desc: "Perubahan luas & volume akibat perubahan jari-jari dan tinggi",
  },
  {
    label: "BANGUN RUANG SISI LENGKUNG GABUNGAN",
    path: "/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/gabungan",
    soal: 15,
    icon: Package,
    emoji: "🧩",
    gradient: "from-emerald-900/40 to-teal-900/30",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    leftBar: "from-emerald-400 to-teal-500",
    desc: "Volume & luas permukaan gabungan tabung, kerucut, dan bola",
  },
];

const BangunRuangSisiLengkungPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🌀</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-1 text-center">
            BANGUN RUANG SISI LENGKUNG
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Kelas 9 · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">75 {t('practice.suffixSoalTotal')} · Diagram Visual & Soal Terapan</span>
            <span className="text-yellow-400 text-sm">⭐</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {subtopics.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => { playPopSound(); navigate(s.path); }}
                className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.01] animate-slide-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} backdrop-blur`} />
                <div className={`absolute inset-0 border ${s.border} rounded-2xl group-hover:border-opacity-60 transition-colors`} />
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${s.leftBar} rounded-l-2xl`} />
                <div className="relative px-5 py-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${s.iconBg} border ${s.border} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${s.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-display text-sm font-bold text-white">{s.label}</span>
                    </div>
                    <p className="text-white/40 text-xs font-body">{s.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${s.badge}`}>
                      {s.soal} {t('practice.suffixSoal')}
                    </span>
                    <ChevronRight className={`w-4 h-4 ${s.iconColor} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">📐 Fitur Visual</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Setiap sub-topik dilengkapi dengan diagram SVG ilustratif yang menampilkan bangun secara visual. Soal-soal dipilih dari kisi-kisi UN, ANBK, dan TKA untuk mempersiapkan siswa menghadapi ujian resmi.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backToGrade9')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BangunRuangSisiLengkungPage;
