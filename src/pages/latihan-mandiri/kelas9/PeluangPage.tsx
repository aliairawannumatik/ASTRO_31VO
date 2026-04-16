import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { Dices, BarChart3, Calculator, Target, FlipHorizontal2, Layers, ChevronRight } from "lucide-react";

const subtopics = [
  {
    label: "RUANG SAMPEL DAN TITIK SAMPEL",
    path: "/latihan-mandiri/kelas-9/peluang/ruang-sampel",
    soal: 40,
    icon: Dices,
    gradient: "from-cyan-900/40 to-teal-900/30",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    leftBar: "from-cyan-400 to-teal-500",
    desc: "Diagram pohon, tabel sampel, mendaftar titik sampel, n(S)",
  },
  {
    label: "PELUANG EMPIRIK DAN FREKUENSI RELATIF",
    path: "/latihan-mandiri/kelas-9/peluang/peluang-empirik",
    soal: 23,
    icon: BarChart3,
    gradient: "from-amber-900/40 to-orange-900/30",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    leftBar: "from-amber-400 to-orange-500",
    desc: "Frekuensi relatif, data percobaan, tabel frekuensi, analisis data",
  },
  {
    label: "PELUANG TEORETIK",
    path: "/latihan-mandiri/kelas-9/peluang/peluang-teoretik",
    soal: 22,
    icon: Calculator,
    gradient: "from-violet-900/40 to-purple-900/30",
    border: "border-violet-500/30",
    badge: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    leftBar: "from-violet-400 to-purple-500",
    desc: "P(A) = n(A)/n(S), dadu, koin, kartu, bola, kejadian majemuk",
  },
  {
    label: "FREKUENSI HARAPAN",
    path: "/latihan-mandiri/kelas-9/peluang/frekuensi-harapan",
    soal: 40,
    icon: Target,
    gradient: "from-emerald-900/40 to-green-900/30",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    leftBar: "from-emerald-400 to-green-500",
    desc: "fh = n × P(A), percobaan berulang, aplikasi kehidupan nyata",
  },
  {
    label: "KOMPLEMEN SUATU KEJADIAN",
    path: "/latihan-mandiri/kelas-9/peluang/komplemen",
    soal: 40,
    icon: FlipHorizontal2,
    gradient: "from-rose-900/40 to-pink-900/30",
    border: "border-rose-500/30",
    badge: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    leftBar: "from-rose-400 to-pink-500",
    desc: "P(A') = 1 − P(A), diagram Venn, penerapan komplemen",
  },
  {
    label: "PELUANG KEJADIAN MAJEMUK",
    path: "/latihan-mandiri/kelas-9/peluang/kejadian-majemuk",
    soal: 40,
    icon: Layers,
    gradient: "from-indigo-900/40 to-violet-900/30",
    border: "border-indigo-500/30",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
    leftBar: "from-indigo-400 to-violet-500",
    desc: "P(A∪B), P(A∩B), saling lepas, saling bebas, peluang bersyarat",
  },
];

const PeluangPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🎲</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-1 text-center">
            PELUANG
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Kelas 9 · Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">165 Soal Total · Diagram Pohon, Tabel & Venn</span>
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
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">🖼️ Fitur Visual</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Setiap soal dilengkapi dengan diagram pohon, tabel ruang sampel, diagram Venn, dan tabel frekuensi interaktif. Soal-soal dipilih dari kisi-kisi UN, ANBK, dan TKA untuk mempersiapkan siswa menghadapi ujian resmi.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Kelas 9
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeluangPage;
