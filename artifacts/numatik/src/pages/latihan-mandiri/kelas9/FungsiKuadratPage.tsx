import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { TrendingUp, Crosshair, Target, PenLine, Layers, Zap, ChevronRight } from "lucide-react";

const subtopics = [
  {
    label: "BENTUK UMUM DAN KARAKTERISTIK GRAFIK",
    path: "/latihan-mandiri/kelas-9/fungsi-kuadrat/bentuk-umum-karakteristik",
    soal: 40,
    icon: TrendingUp,
    gradient: "from-amber-900/40 to-yellow-900/30",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    leftBar: "from-amber-400 to-yellow-500",
    desc: "Bentuk f(x)=ax²+bx+c, nilai a,b,c, arah buka, domain, range",
  },
  {
    label: "TITIK POTONG TERHADAP SUMBU-SUMBU",
    path: "/latihan-mandiri/kelas-9/fungsi-kuadrat/titik-potong",
    soal: 40,
    icon: Crosshair,
    gradient: "from-cyan-900/40 to-sky-900/30",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    leftBar: "from-cyan-400 to-sky-500",
    desc: "Titik potong sumbu-x (f(x)=0) dan sumbu-y (x=0), koordinat potong",
  },
  {
    label: "SUMBU SIMETRI DAN TITIK PUNCAK (OPTIMUM)",
    path: "/latihan-mandiri/kelas-9/fungsi-kuadrat/sumbu-simetri",
    soal: 40,
    icon: Target,
    gradient: "from-lime-900/40 to-green-900/30",
    border: "border-lime-500/30",
    badge: "bg-lime-500/20 text-lime-300 border-lime-400/40",
    iconBg: "bg-lime-500/20",
    iconColor: "text-lime-400",
    leftBar: "from-lime-400 to-green-500",
    desc: "Sumbu simetri x=−b/2a, titik puncak (h,k), nilai minimum & maksimum",
  },
  {
    label: "MENGGAMBAR GRAFIK FUNGSI KUADRAT",
    path: "/latihan-mandiri/kelas-9/fungsi-kuadrat/menggambar-grafik",
    soal: 40,
    icon: PenLine,
    gradient: "from-indigo-900/40 to-blue-900/30",
    border: "border-indigo-500/30",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
    leftBar: "from-indigo-400 to-blue-500",
    desc: "Tabel nilai, menentukan titik-titik kunci, sketsa parabola lengkap",
  },
  {
    label: "MENYUSUN FUNGSI KUADRAT",
    path: "/latihan-mandiri/kelas-9/fungsi-kuadrat/menyusun-fungsi",
    soal: 40,
    icon: Layers,
    gradient: "from-fuchsia-900/40 to-pink-900/30",
    border: "border-fuchsia-500/30",
    badge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
    iconBg: "bg-fuchsia-500/20",
    iconColor: "text-fuchsia-400",
    leftBar: "from-fuchsia-400 to-pink-500",
    desc: "Dari titik potong, titik puncak, atau tiga titik yang diketahui",
  },
  {
    label: "PENERAPAN FUNGSI KUADRAT (NILAI MAKSIMUM/MINIMUM)",
    path: "/latihan-mandiri/kelas-9/fungsi-kuadrat/penerapan-nilai-maks-min",
    soal: 40,
    icon: Zap,
    gradient: "from-orange-900/40 to-red-900/30",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
    leftBar: "from-orange-400 to-red-500",
    desc: "Soal kontekstual UN/TKA/ANBK: luas maksimum, tinggi & waktu, keuntungan",
  },
];

const FungsiKuadratPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">📈</span>
          </div>
          <h1
            className="font-display text-2xl md:text-3xl font-bold text-amber-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(251,191,36,0.7)' }}
          >
            FUNGSI KUADRAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-1">Kelas 9 · Pengayaan · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2 mt-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">240 {t('practice.suffixSoalTotal')} · UN / TKA / ANBK</span>
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
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">{t('practice.enrichmentNote')}</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Soal-soal dirancang berdasarkan kisi-kisi UN, TKA, dan ANBK dengan tingkat kesulitan bervariasi. Setiap subtopik mencakup soal pengenalan konsep, pemahaman mendalam, hingga soal penalaran tinggi (HOTS). Dilengkapi diagram SVG interaktif untuk visualisasi grafik parabola.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9"); }}
            className="text-sm text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backToGrade9')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FungsiKuadratPage;
