import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { Sigma, Star, TrendingUp, Zap, ChevronRight } from "lucide-react";

const subtopics = [
  {
    label: "PENGERTIAN POLA DAN BARISAN BILANGAN",
    path: "/latihan-mandiri/kelas-8/pola-bilangan/pengertian-pola",
    soal: 12,
    icon: Sigma,
    color: "cyan",
    gradient: "from-cyan-900/40 to-blue-900/30",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    leftBar: "from-cyan-400 to-blue-500",
    desc: "Pola, barisan bilangan, suku ke-n, bertingkat",
  },
  {
    label: "POLA-POLA KHUSUS",
    path: "/latihan-mandiri/kelas-8/pola-bilangan/pola-khusus",
    soal: 13,
    icon: Star,
    color: "purple",
    gradient: "from-purple-900/40 to-violet-900/30",
    border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    leftBar: "from-purple-400 to-violet-500",
    desc: "Segitiga Pascal, bilangan segitiga, persegi, kubik",
  },
  {
    label: "POLA ARITMETIKA",
    path: "/latihan-mandiri/kelas-8/pola-bilangan/pola-aritmetika",
    soal: 13,
    icon: TrendingUp,
    color: "emerald",
    gradient: "from-emerald-900/40 to-green-900/30",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    leftBar: "from-emerald-400 to-green-500",
    desc: "Un = a+(n-1)b, jumlah deret, aplikasi kontekstual",
  },
  {
    label: "POLA GEOMETRI",
    path: "/latihan-mandiri/kelas-8/pola-bilangan/pola-geometri",
    soal: 12,
    icon: Zap,
    color: "orange",
    gradient: "from-orange-900/40 to-amber-900/30",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
    leftBar: "from-orange-400 to-amber-500",
    desc: "Un = a·rⁿ⁻¹, deret geometri, rasio, tak hingga",
  },
];

const PolaBilanganPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🔢</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-1 text-center">
            POLA BILANGAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Kelas 8 · Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">50 Soal Total · UN / ANBK / TKA</span>
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
                className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.01] animate-slide-up`}
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
                      <span className={`font-display text-sm font-bold text-white`}>{s.label}</span>
                    </div>
                    <p className="text-white/40 text-xs font-body">{s.desc}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${s.badge}`}>
                      {s.soal} Soal
                    </span>
                    <ChevronRight className={`w-4 h-4 ${s.iconColor} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">💡 Info Latihan</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Soal-soal ini disusun sesuai dengan kisi-kisi UN, TKA, dan ANBK. Setiap sub-topik dilengkapi dengan LaTeX, rumus referensi, dan soal aplikasi kontekstual. Kerjakan secara urut untuk hasil terbaik!
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Kelas 8
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolaBilanganPage;
