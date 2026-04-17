import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { GitFork, RotateCcw, AlignCenter, Pentagon, ChevronRight } from "lucide-react";

const subtopics = [
  { label: "HUBUNGAN 2 GARIS", path: "/latihan-mandiri/kelas-7/garis-dan-sudut/hubungan-2-garis", soal: 10, icon: GitFork, gradient: "from-cyan-900/40 to-teal-900/30", border: "border-cyan-500/30", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40", iconBg: "bg-cyan-500/20", iconColor: "text-cyan-400", leftBar: "from-cyan-400 to-teal-500", desc: "Garis sejajar, berpotongan, tegak lurus, dan berimpit, sifat-sifatnya" },
  { label: "SUDUT PELURUS, SUDUT PENYIKU DAN SUDUT BERTOLAK BELAKANG", path: "/latihan-mandiri/kelas-7/garis-dan-sudut/sudut-pelurus-penyiku-bertolak", soal: 15, icon: RotateCcw, gradient: "from-teal-900/40 to-emerald-900/30", border: "border-teal-500/30", badge: "bg-teal-500/20 text-teal-300 border-teal-400/40", iconBg: "bg-teal-500/20", iconColor: "text-teal-400", leftBar: "from-teal-400 to-emerald-500", desc: "Sudut berpelurus (180°), berpenyikut (90°), bertolak belakang, menghitung sudut" },
  { label: "SIFAT SUDUT DUA GARIS SEJAJAR JIKA DIPOTONG GARIS LAIN", path: "/latihan-mandiri/kelas-7/garis-dan-sudut/sifat-sudut-dua-garis-sejajar", soal: 10, icon: AlignCenter, gradient: "from-emerald-900/40 to-green-900/30", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40", iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400", leftBar: "from-emerald-400 to-green-500", desc: "Sudut sehadap, berseberangan dalam/luar, sepihak dalam/luar pada dua garis sejajar" },
  { label: "JUMLAH SUDUT PADA SEGI BANYAK", path: "/latihan-mandiri/kelas-7/garis-dan-sudut/jumlah-sudut-segi-banyak", soal: 11, icon: Pentagon, gradient: "from-green-900/40 to-lime-900/30", border: "border-green-500/30", badge: "bg-green-500/20 text-green-300 border-green-400/40", iconBg: "bg-green-500/20", iconColor: "text-green-400", leftBar: "from-green-400 to-lime-500", desc: "Rumus jumlah sudut segi-n: (n−2)×180°, sudut dalam dan luar poligon" },
];

const GarisDanSudutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">📐</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-cyan-300 text-center mb-1" style={{ textShadow: '0 0 24px rgba(34,211,238,0.7)' }}>GARIS DAN SUDUT</h1>
          <p className="text-white/50 text-xs text-center font-body mb-1">Kelas 7 · Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2 mt-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">46 Soal Total · UN / TKA / ANBK</span>
            <span className="text-yellow-400 text-sm">⭐</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {subtopics.map((s, i) => {
            const Icon = s.icon;
            return (
              <button key={s.label} onClick={() => { playPopSound(); navigate(s.path); }}
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
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${s.badge}`}>{s.soal} Soal</span>
                    <ChevronRight className={`w-4 h-4 ${s.iconColor} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">📝 Catatan Pengayaan</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">Soal garis dan sudut dari hubungan dasar antar garis hingga sifat sudut pada dua garis sejajar dan segi banyak, sesuai kisi-kisi UN, TKA, dan ANBK.</p>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7"); }} className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body">← Kembali ke Kelas 7</button>
        </div>
      </div>
    </div>
  );
};
export default GarisDanSudutPage;
