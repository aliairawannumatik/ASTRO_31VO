import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { FunctionSquare, Scissors, Calculator, Square, BarChart2, RefreshCcw, BookOpen, ChevronRight } from "lucide-react";

const subtopics = [
  {
    label: "BENTUK UMUM PERSAMAAN KUADRAT",
    path: "/latihan-mandiri/kelas-9/persamaan-kuadrat/bentuk-umum",
    soal: 40,
    icon: FunctionSquare,
    gradient: "from-violet-900/40 to-purple-900/30",
    border: "border-violet-500/30",
    badge: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    leftBar: "from-violet-400 to-purple-500",
    desc: "Identifikasi PK, nilai a, b, c, bentuk umum ax² + bx + c = 0",
  },
  {
    label: "MENENTUKAN AKAR-AKAR DENGAN PEMFAKTORAN",
    path: "/latihan-mandiri/kelas-9/persamaan-kuadrat/pemfaktoran",
    soal: 40,
    icon: Scissors,
    gradient: "from-emerald-900/40 to-teal-900/30",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    leftBar: "from-emerald-400 to-teal-500",
    desc: "Pemfaktoran x²+bx+c=0, ax²+bx+c=0, kuadrat sempurna, beda kuadrat",
  },
  {
    label: "MENENTUKAN AKAR-AKAR DENGAN RUMUS KUADRATIK",
    path: "/latihan-mandiri/kelas-9/persamaan-kuadrat/rumus-kuadratik",
    soal: 40,
    icon: Calculator,
    gradient: "from-orange-900/40 to-amber-900/30",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
    leftBar: "from-orange-400 to-amber-500",
    desc: "Rumus abc: x = (−b ± √(b²−4ac)) / 2a, akar rasional & irasional",
  },
  {
    label: "AKAR-AKAR DENGAN PELENGKAP KUADRAT",
    path: "/latihan-mandiri/kelas-9/persamaan-kuadrat/pelengkap-kuadrat",
    soal: 40,
    icon: Square,
    gradient: "from-sky-900/40 to-blue-900/30",
    border: "border-sky-500/30",
    badge: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-400",
    leftBar: "from-sky-400 to-blue-500",
    desc: "Melengkapi kuadrat, bentuk (x+p)² = q, transformasi persamaan",
  },
  {
    label: "DISKRIMINAN",
    path: "/latihan-mandiri/kelas-9/persamaan-kuadrat/diskriminan",
    soal: 40,
    icon: BarChart2,
    gradient: "from-rose-900/40 to-pink-900/30",
    border: "border-rose-500/30",
    badge: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    leftBar: "from-rose-400 to-pink-500",
    desc: "D = b²−4ac, jenis akar (real berbeda, kembar, tidak real), nilai k",
  },
  {
    label: "MENYUSUN PERSAMAAN KUADRAT BARU",
    path: "/latihan-mandiri/kelas-9/persamaan-kuadrat/menyusun-persamaan-baru",
    soal: 40,
    icon: RefreshCcw,
    gradient: "from-fuchsia-900/40 to-violet-900/30",
    border: "border-fuchsia-500/30",
    badge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
    iconBg: "bg-fuchsia-500/20",
    iconColor: "text-fuchsia-400",
    leftBar: "from-fuchsia-400 to-violet-500",
    desc: "Dari akar diketahui, jumlah & hasil kali akar, transformasi akar",
  },
  {
    label: "PENERAPAN PERSAMAAN KUADRAT KONTEKSTUAL",
    path: "/latihan-mandiri/kelas-9/persamaan-kuadrat/penerapan-kontekstual",
    soal: 40,
    icon: BookOpen,
    gradient: "from-teal-900/40 to-cyan-900/30",
    border: "border-teal-500/30",
    badge: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    iconBg: "bg-teal-500/20",
    iconColor: "text-teal-400",
    leftBar: "from-teal-400 to-cyan-500",
    desc: "Soal cerita geometri, gerak, ekonomi, permasalahan nyata UN/TKA/ANBK",
  },
];

const PersamaanKuadratPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 border-2 border-violet-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">📐</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(167,139,250,0.7)' }}>
            PERSAMAAN KUADRAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-1">Kelas 9 · Pengayaan · Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2 mt-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">280 Soal Total · UN / TKA / ANBK</span>
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
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">📝 Catatan Pengayaan</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Soal-soal dirancang berdasarkan kisi-kisi UN, TKA, dan ANBK dengan tingkat kesulitan bervariasi. Setiap subtopik mencakup soal pengenalan konsep, pemahaman mendalam, hingga soal penalaran tinggi (HOTS). Dilengkapi diagram dan visualisasi SVG untuk soal yang memerlukan representasi grafis.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9"); }}
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Kelas 9
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersamaanKuadratPage;
