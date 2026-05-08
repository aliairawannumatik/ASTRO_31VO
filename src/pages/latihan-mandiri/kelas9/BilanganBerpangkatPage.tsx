import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { ChevronRight } from "lucide-react";

const subtopics = [
  {
    label: "PENGERTIAN DAN NOTASI PANGKAT",
    path: "/latihan-mandiri/kelas-9/bilangan-berpangkat/pengertian-notasi",
    soal: 11,
    gradient: "from-sky-900/40 to-cyan-900/30",
    border: "border-sky-500/30",
    badge: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    iconColor: "text-sky-400",
    leftBar: "from-sky-400 to-cyan-500",
    desc: "Definisi, notasi, penulisan, evaluasi, dan aplikasi bilangan berpangkat",
    emoji: "🔢",
  },
  {
    label: "SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT",
    path: "/latihan-mandiri/kelas-9/bilangan-berpangkat/sifat-sifat",
    soal: 31,
    gradient: "from-emerald-900/40 to-teal-900/30",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    iconColor: "text-emerald-400",
    leftBar: "from-emerald-400 to-teal-500",
    desc: "Perkalian, pembagian, pemangkatan, distribusi, dan penyederhanaan eksponen",
    emoji: "⚡",
  },
  {
    label: "PANGKAT NOL, NEGATIF & PECAHAN",
    path: "/latihan-mandiri/kelas-9/bilangan-berpangkat/pangkat-nol-negatif-pecahan",
    soal: 33,
    gradient: "from-violet-900/40 to-purple-900/30",
    border: "border-violet-500/30",
    badge: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    iconColor: "text-violet-400",
    leftBar: "from-violet-400 to-purple-500",
    desc: "a⁰=1, a⁻ⁿ=1/aⁿ, dan aᵖ/ᵍ=ᵍ√aᵖ beserta penerapannya",
    emoji: "🔮",
  },
  {
    label: "BENTUK AKAR",
    path: "/latihan-mandiri/kelas-9/bilangan-berpangkat/bentuk-akar",
    soal: 33,
    gradient: "from-amber-900/40 to-yellow-900/30",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    iconColor: "text-amber-400",
    leftBar: "from-amber-400 to-yellow-500",
    desc: "Menyederhanakan, operasi, merasionalkan, dan soal geometri bentuk akar",
    emoji: "√",
  },
  {
    label: "NOTASI ILMIAH",
    path: "/latihan-mandiri/kelas-9/bilangan-berpangkat/notasi-ilmiah",
    soal: 11,
    gradient: "from-rose-900/40 to-pink-900/30",
    border: "border-rose-500/30",
    badge: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    iconColor: "text-rose-400",
    leftBar: "from-rose-400 to-pink-500",
    desc: "Mengubah, operasi, perbandingan, dan aplikasi sains notasi ilmiah",
    emoji: "🔭",
  },
];

const BilanganBerpangkatPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-sky-500/10 border-2 border-sky-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-sky-300 mb-1 text-center"
            style={{ textShadow: '0 0 24px rgba(56,189,248,0.6)' }}>
            BILANGAN BERPANGKAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Kelas 9 · Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">119 Soal Total · LaTeX & Diagram</span>
            <span className="text-yellow-400 text-sm">⭐</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {subtopics.map((s, i) => (
            <button
              key={s.label}
              onClick={() => { playPopSound(); navigate(s.path); }}
              className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.01] animate-slide-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} backdrop-blur`} />
              <div className={`absolute inset-0 border ${s.border} rounded-2xl`} />
              <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${s.leftBar} rounded-l-2xl`} />
              <div className="relative px-5 py-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-white/5 border ${s.border} flex items-center justify-center shrink-0`}>
                  <span className="text-3xl">{s.emoji}</span>
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
          ))}
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">📐 Fitur</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Setiap soal menggunakan LaTeX untuk rumus matematika yang jelas, dilengkapi diagram visualisasi, dan soal-soal bergaya UN/ANBK/TKA untuk persiapan ujian resmi.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9"); }}
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Kelas 9
          </button>
        </div>
      </div>
    </div>
  );
};

export default BilanganBerpangkatPage;
