import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { Plus, Minus, X, Divide, Calculator, Network, ChevronRight } from "lucide-react";

const subtopics = [
  { label: "PENJUMLAHAN BILANGAN BULAT", path: "/latihan-mandiri/kelas-7/bilangan-bulat/penjumlahan", soal: 40, icon: Plus, gradient: "from-blue-900/40 to-indigo-900/30", border: "border-blue-500/30", badge: "bg-blue-500/20 text-blue-300 border-blue-400/40", iconBg: "bg-blue-500/20", iconColor: "text-blue-400", leftBar: "from-blue-400 to-indigo-500", desc: "Menjumlahkan bilangan bulat positif & negatif, sifat komutatif & asosiatif" },
  { label: "PENGURANGAN BILANGAN BULAT", path: "/latihan-mandiri/kelas-7/bilangan-bulat/pengurangan", soal: 40, icon: Minus, gradient: "from-cyan-900/40 to-sky-900/30", border: "border-cyan-500/30", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40", iconBg: "bg-cyan-500/20", iconColor: "text-cyan-400", leftBar: "from-cyan-400 to-sky-500", desc: "Pengurangan bilangan bulat, lawan suatu bilangan, garis bilangan" },
  { label: "PERKALIAN BILANGAN BULAT", path: "/latihan-mandiri/kelas-7/bilangan-bulat/perkalian", soal: 40, icon: X, gradient: "from-violet-900/40 to-purple-900/30", border: "border-violet-500/30", badge: "bg-violet-500/20 text-violet-300 border-violet-400/40", iconBg: "bg-violet-500/20", iconColor: "text-violet-400", leftBar: "from-violet-400 to-purple-500", desc: "Perkalian bilangan bulat, aturan tanda (+×+, +×−, −×−), sifat-sifatnya" },
  { label: "PEMBAGIAN BILANGAN BULAT", path: "/latihan-mandiri/kelas-7/bilangan-bulat/pembagian", soal: 40, icon: Divide, gradient: "from-sky-900/40 to-blue-900/30", border: "border-sky-500/30", badge: "bg-sky-500/20 text-sky-300 border-sky-400/40", iconBg: "bg-sky-500/20", iconColor: "text-sky-400", leftBar: "from-sky-400 to-blue-500", desc: "Pembagian bilangan bulat, hubungan perkalian dan pembagian, aturan tanda" },
  { label: "OPERASI HITUNG CAMPURAN BILANGAN BULAT", path: "/latihan-mandiri/kelas-7/bilangan-bulat/operasi-campuran", soal: 40, icon: Calculator, gradient: "from-indigo-900/40 to-blue-900/30", border: "border-indigo-500/30", badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40", iconBg: "bg-indigo-500/20", iconColor: "text-indigo-400", leftBar: "from-indigo-400 to-blue-500", desc: "Hierarki operasi hitung, tanda kurung, soal kontekstual campuran" },
  { label: "KPK DAN FPB", path: "/latihan-mandiri/kelas-7/bilangan-bulat/kpk-fpb", soal: 40, icon: Network, gradient: "from-purple-900/40 to-fuchsia-900/30", border: "border-purple-500/30", badge: "bg-purple-500/20 text-purple-300 border-purple-400/40", iconBg: "bg-purple-500/20", iconColor: "text-purple-400", leftBar: "from-purple-400 to-fuchsia-500", desc: "Faktor, kelipatan, faktorisasi prima, pohon faktor, aplikasi KPK & FPB" },
];

const BilanganBulatPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🔢</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-blue-300 text-center mb-1" style={{ textShadow: '0 0 24px rgba(96,165,250,0.7)' }}>BILANGAN BULAT</h1>
          <p className="text-white/50 text-xs text-center font-body mb-1">Kelas 7 · Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2 mt-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">240 Soal Total · UN / TKA / ANBK</span>
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
          <p className="text-white/60 text-xs font-body leading-relaxed">Soal mencakup operasi dasar hingga HOTS berbasis kisi-kisi UN, TKA, dan ANBK. Setiap subtopik dilengkapi soal kontekstual dan visualisasi garis bilangan.</p>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7"); }} className="text-sm text-muted-foreground hover:text-blue-400 transition-colors cursor-pointer font-body">← Kembali ke Kelas 7</button>
        </div>
      </div>
    </div>
  );
};
export default BilanganBulatPage;
