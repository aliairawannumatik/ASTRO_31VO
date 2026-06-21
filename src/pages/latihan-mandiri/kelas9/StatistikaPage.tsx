import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { ChevronRight, BarChart2, PieChart, Target, BoxSelect, TrendingDown, BookOpen } from "lucide-react";

const subtopics = [
  {
    label: "PENGANTAR STATISTIKA, PENGUMPULAN DATA DAN PENYAJIAN DATA",
    path: "/latihan-mandiri/kelas-9/statistika/pengantar",
    soal: 10,
    icon: BookOpen,
    desc: "Populasi, sampel, jenis data, teknik pengumpulan, tabel distribusi, diagram batang, garis, lingkaran",
    color: "cyan",
    gradient: "from-cyan-500/20 to-teal-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-300",
    badge: "bg-cyan-500/15 text-cyan-400",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    accent: "from-cyan-400 to-teal-400",
  },
  {
    label: "UKURAN PEMUSATAN DATA (RATA-RATA DAN RATA-RATA GABUNGAN)",
    path: "/latihan-mandiri/kelas-9/statistika/rata-rata",
    soal: 16,
    icon: PieChart,
    desc: "Mean tunggal, berbobot, berkelompok, rata-rata gabungan",
    color: "blue",
    gradient: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
    text: "text-blue-300",
    badge: "bg-blue-500/15 text-blue-400",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    accent: "from-blue-400 to-indigo-400",
  },
  {
    label: "UKURAN PEMUSATAN DATA (MEDIAN DAN MODUS)",
    path: "/latihan-mandiri/kelas-9/statistika/median-modus",
    soal: 16,
    icon: Target,
    desc: "Median dan modus data tunggal dan berkelompok, interpretasi",
    color: "violet",
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/30",
    text: "text-violet-300",
    badge: "bg-violet-500/15 text-violet-400",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    accent: "from-violet-400 to-purple-400",
  },
  {
    label: "UKURAN LETAK DATA (KUARTIL)",
    path: "/latihan-mandiri/kelas-9/statistika/kuartil",
    soal: 12,
    icon: BoxSelect,
    desc: "Q₁, Q₂, Q₃, IQR, box plot, persentil, desil, deteksi pencilan",
    color: "green",
    gradient: "from-green-500/20 to-emerald-500/10",
    border: "border-green-500/30",
    text: "text-green-300",
    badge: "bg-green-500/15 text-green-400",
    iconBg: "bg-green-500/20",
    iconColor: "text-green-400",
    accent: "from-green-400 to-emerald-400",
  },
  {
    label: "UKURAN PENYEBARAN DATA (JANGKAUAN, JANGKAUAN INTERKUARTIL, SIMPANGAN KUARTIL)",
    path: "/latihan-mandiri/kelas-9/statistika/penyebaran-data",
    soal: 22,
    icon: TrendingDown,
    desc: "Jangkauan, IQR, SQ, simpangan rata-rata, varians, simpangan baku",
    color: "orange",
    gradient: "from-orange-500/20 to-red-500/10",
    border: "border-orange-500/30",
    text: "text-orange-300",
    badge: "bg-orange-500/15 text-orange-400",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
    accent: "from-orange-400 to-red-400",
  },
];

const StatistikaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-cyan-500/15 border-2 border-cyan-400/50 flex items-center justify-center mb-4">
            <BarChart2 className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-cyan-300 text-center mb-2"
            style={{ textShadow: '0 0 24px rgba(34,211,238,0.6)' }}>
            STATISTIKA
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Kelas 9 — Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-white/70 text-xs font-body">5 Sub Topik</span>
            <span className="text-white/20">·</span>
            <span className="text-cyan-400 text-xs font-bold">79 Soal Total</span>
            <span className="text-white/20">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 animate-slide-up">
          {subtopics.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => { playPopSound(); navigate(s.path); }}
                className={`group relative flex items-center gap-4 bg-gradient-to-r ${s.gradient} backdrop-blur border ${s.border} rounded-2xl px-5 py-4
                  hover:scale-[1.015] hover:shadow-lg transition-all duration-300 cursor-pointer text-left overflow-hidden animate-slide-up`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${s.accent} rounded-l-2xl`} />
                <div className={`w-10 h-10 rounded-xl ${s.iconBg} border ${s.border} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-body text-sm font-bold ${s.text} leading-tight mb-1`}>{s.label}</p>
                  <p className="text-white/40 text-[10px] font-body leading-snug">{s.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{s.soal} Soal</span>
                  <ChevronRight className={`w-4 h-4 ${s.iconColor} group-hover:translate-x-1 transition-transform`} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-white/3 border border-white/8 rounded-xl">
          <p className="text-white/40 text-[10px] text-center font-body leading-relaxed">
            Semua soal dirancang sesuai kisi-kisi <span className="text-cyan-400/80">UN</span> · <span className="text-teal-400/80">ANBK</span> · <span className="text-blue-400/80">TKA</span> dan sering keluar dalam ujian resmi SMP.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9"); }}
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Kelas 9
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatistikaPage;
