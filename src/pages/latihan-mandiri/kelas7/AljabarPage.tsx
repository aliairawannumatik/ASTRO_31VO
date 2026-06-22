import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { BookOpen, PlusSquare, XSquare, Divide, Zap, Replace, Scissors, Sigma, ChevronRight } from "lucide-react";

const subtopics = [
  { label: "PENGERTIAN DAN UNSUR-UNSUR BENTUK ALJABAR", path: "/latihan-mandiri/kelas-7/aljabar/pengertian-unsur", soal: 3, icon: BookOpen, gradient: "from-violet-900/40 to-purple-900/30", border: "border-violet-500/30", badge: "bg-violet-500/20 text-violet-300 border-violet-400/40", iconBg: "bg-violet-500/20", iconColor: "text-violet-400", leftBar: "from-violet-400 to-purple-500", desc: "Variabel, koefisien, konstanta, suku, suku sejenis & tidak sejenis" },
  { label: "PENJUMLAHAN DAN PENGURANGAN BENTUK ALJABAR", path: "/latihan-mandiri/kelas-7/aljabar/penjumlahan-pengurangan", soal: 5, icon: PlusSquare, gradient: "from-purple-900/40 to-fuchsia-900/30", border: "border-purple-500/30", badge: "bg-purple-500/20 text-purple-300 border-purple-400/40", iconBg: "bg-purple-500/20", iconColor: "text-purple-400", leftBar: "from-purple-400 to-fuchsia-500", desc: "Menjumlahkan dan mengurangkan suku-suku sejenis, penyederhanaan" },
  { label: "PERKALIAN BENTUK ALJABAR", path: "/latihan-mandiri/kelas-7/aljabar/perkalian", soal: 8, icon: XSquare, gradient: "from-fuchsia-900/40 to-pink-900/30", border: "border-fuchsia-500/30", badge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40", iconBg: "bg-fuchsia-500/20", iconColor: "text-fuchsia-400", leftBar: "from-fuchsia-400 to-pink-500", desc: "Monomial×monomial, monomial×polinomial, binomial×binomial" },
  { label: "PEMBAGIAN BENTUK ALJABAR", path: "/latihan-mandiri/kelas-7/aljabar/pembagian", soal: 8, icon: Divide, gradient: "from-indigo-900/40 to-violet-900/30", border: "border-indigo-500/30", badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40", iconBg: "bg-indigo-500/20", iconColor: "text-indigo-400", leftBar: "from-indigo-400 to-violet-500", desc: "Pembagian monomial, penyederhanaan pecahan aljabar" },
  { label: "PEMANGKATAN BENTUK ALJABAR", path: "/latihan-mandiri/kelas-7/aljabar/pemangkatan", soal: 8, icon: Zap, gradient: "from-blue-900/40 to-indigo-900/30", border: "border-blue-500/30", badge: "bg-blue-500/20 text-blue-300 border-blue-400/40", iconBg: "bg-blue-500/20", iconColor: "text-blue-400", leftBar: "from-blue-400 to-indigo-500", desc: "Pemangkatan monomial, (a+b)², (a-b)², pola segitiga Pascal" },
  { label: "SUBSTITUSI BILANGAN PADA BENTUK ALJABAR", path: "/latihan-mandiri/kelas-7/aljabar/substitusi", soal: 8, icon: Replace, gradient: "from-sky-900/40 to-cyan-900/30", border: "border-sky-500/30", badge: "bg-sky-500/20 text-sky-300 border-sky-400/40", iconBg: "bg-sky-500/20", iconColor: "text-sky-400", leftBar: "from-sky-400 to-cyan-500", desc: "Menghitung nilai ekspresi aljabar dengan substitusi nilai variabel" },
  { label: "FAKTORISASI BENTUK ALJABAR", path: "/latihan-mandiri/kelas-7/aljabar/faktorisasi", soal: 8, icon: Scissors, gradient: "from-emerald-900/40 to-teal-900/30", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40", iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400", leftBar: "from-emerald-400 to-teal-500", desc: "Faktor GCF, selisih kuadrat, trinomial sempurna, pemfaktoran aljabar" },
  { label: "MENYEDERHANAKAN PECAHAN ALJABAR", path: "/latihan-mandiri/kelas-7/aljabar/pecahan-aljabar", soal: 20, icon: Sigma, gradient: "from-orange-900/40 to-amber-900/30", border: "border-orange-500/30", badge: "bg-orange-500/20 text-orange-300 border-orange-400/40", iconBg: "bg-orange-500/20", iconColor: "text-orange-400", leftBar: "from-orange-400 to-amber-500", desc: "Sederhanakan pecahan aljabar: GCF, selisih kuadrat, trinomial, dua variabel" },
];

const AljabarPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 border-2 border-violet-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🔣</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-violet-300 text-center mb-1" style={{ textShadow: '0 0 24px rgba(167,139,250,0.7)' }}>ALJABAR</h1>
          <p className="text-white/50 text-xs text-center font-body mb-1">Kelas 7 · Tugas - Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2 mt-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">320 Soal Total · UN / TKA / ANBK</span>
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
          <p className="text-white/60 text-xs font-body leading-relaxed">Soal-soal aljabar dirancang bertingkat dari pengenalan konsep hingga HOTS, sesuai kisi-kisi UN, TKA, dan ANBK Kelas 7.</p>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7"); }} className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">← Kembali ke Kelas 7</button>
        </div>
      </div>
    </div>
  );
};
export default AljabarPage;
