import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { MapPin, Ruler, Navigation, Crosshair, ChevronRight } from "lucide-react";

const subtopics = [
  {
    label: "UNSUR-UNSUR PADA DIAGRAM KARTESIUS",
    path: "/latihan-mandiri/kelas-8/koordinat-cartesius/unsur-unsur",
    soal: 12,
    icon: MapPin,
    gradient: "from-sky-900/40 to-blue-900/30",
    border: "border-sky-500/30",
    badge: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-400",
    leftBar: "from-sky-400 to-blue-500",
    desc: "Koordinat titik, kuadran, sumbu, pencerminan, translasi",
  },
  {
    label: "POSISI RELATIF SETIAP TITIK TERHADAP SEMBARANG TITIK ACUAN",
    path: "/latihan-mandiri/kelas-8/koordinat-cartesius/posisi-relatif-titik-acuan",
    soal: 14,
    icon: Crosshair,
    gradient: "from-violet-900/40 to-purple-900/30",
    border: "border-violet-500/30",
    badge: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    leftBar: "from-violet-400 to-purple-500",
    desc: "Posisi relatif titik, selisih koordinat, titik acuan sembarang",
  },
  {
    label: "JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS",
    path: "/latihan-mandiri/kelas-8/koordinat-cartesius/jarak-titik-garis",
    soal: 19,
    icon: Ruler,
    gradient: "from-teal-900/40 to-cyan-900/30",
    border: "border-teal-500/30",
    badge: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    iconBg: "bg-teal-500/20",
    iconColor: "text-teal-400",
    leftBar: "from-teal-400 to-cyan-500",
    desc: "Rumus jarak, jarak ke sumbu & garis, keliling, luas",
  },
  {
    label: "POSISI RELATIF SUATU TITIK TERHADAP SUATU GARIS",
    path: "/latihan-mandiri/kelas-8/koordinat-cartesius/posisi-relatif",
    soal: 10,
    icon: Navigation,
    gradient: "from-rose-900/40 to-pink-900/30",
    border: "border-rose-500/30",
    badge: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    leftBar: "from-rose-400 to-pink-500",
    desc: "Di atas/bawah garis, di kiri/kanan, daerah irisan syarat",
  },
];

const KoordinatCartesiusPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mb-4">
            <span className="text-3xl">📍</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-1 text-center">
            KOORDINAT KARTESIUS
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Kelas 8 · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">55 {t('practice.suffixSoalTotal')} · Dilengkapi Diagram Koordinat</span>
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
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">🖼️ Fitur Diagram</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Setiap soal dilengkapi dengan diagram koordinat kartesius bergambar. Titik-titik ditampilkan dengan warna berbeda, garis digambar secara visual, dan daerah/wilayah diarsir. Diagram dibuat otomatis sesuai konteks soal untuk membantu pemahaman visual.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backToGrade8')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KoordinatCartesiusPage;
