import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { ChevronRight } from "lucide-react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const subtopics = [
  {
    label: "ARTI PECAHAN, PECAHAN SENILAI DAN MEMBANDINGKAN PECAHAN",
    path: "/latihan-mandiri/kelas-7/bilangan-rasional/arti-pecahan-senilai-membandingkan",
    soal: 8,
    latex: "\\dfrac{a}{b}",
    gradient: "from-teal-900/40 to-emerald-900/30", border: "border-teal-500/30",
    badge: "bg-teal-500/20 text-teal-300 border-teal-400/40", iconBg: "bg-teal-500/20",
    iconColor: "text-teal-400", leftBar: "from-teal-400 to-emerald-500",
    desc: "Pengertian pecahan, pecahan senilai, membandingkan & mengurutkan pecahan",
  },
  {
    label: "PECAHAN CAMPURAN DAN PERSEN",
    path: "/latihan-mandiri/kelas-7/bilangan-rasional/pecahan-campuran-persen", soal: 10,
    latex: "1\\dfrac{1}{2}",
    gradient: "from-emerald-900/40 to-green-900/30", border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40", iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400", leftBar: "from-emerald-400 to-green-500",
    desc: "Konversi pecahan campuran, pecahan biasa, persen, dan desimal",
  },
  {
    label: "PENJUMLAHAN DAN PENGURANGAN PECAHAN",
    path: "/latihan-mandiri/kelas-7/bilangan-rasional/penjumlahan-pecahan", soal: 9,
    latex: "\\dfrac{a}{b}\\pm\\dfrac{c}{d}",
    gradient: "from-cyan-900/40 to-teal-900/30", border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40", iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400", leftBar: "from-cyan-400 to-teal-500",
    desc: "Penjumlahan dan pengurangan pecahan berpenyebut sama dan berbeda, soal kontekstual",
  },
  {
    label: "PERKALIAN PECAHAN",
    path: "/latihan-mandiri/kelas-7/bilangan-rasional/perkalian-pecahan", soal: 6,
    latex: "\\dfrac{a}{b}\\times\\dfrac{c}{d}",
    gradient: "from-violet-900/40 to-purple-900/30", border: "border-violet-500/30",
    badge: "bg-violet-500/20 text-violet-300 border-violet-400/40", iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400", leftBar: "from-violet-400 to-purple-500",
    desc: "Perkalian pecahan biasa dan campuran, penyederhanaan silang",
  },
  {
    label: "PEMBAGIAN PECAHAN",
    path: "/latihan-mandiri/kelas-7/bilangan-rasional/pembagian-pecahan", soal: 8,
    latex: "\\dfrac{a}{b}\\div\\dfrac{c}{d}",
    gradient: "from-indigo-900/40 to-violet-900/30", border: "border-indigo-500/30",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40", iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400", leftBar: "from-indigo-400 to-violet-500",
    desc: "Pembagian pecahan, konsep membalik pembagi, aplikasi nyata",
  },
  {
    label: "BENTUK DESIMAL",
    path: "/latihan-mandiri/kelas-7/bilangan-rasional/bentuk-desimal", soal: 8,
    latex: "0{,}75",
    gradient: "from-lime-900/40 to-green-900/30", border: "border-lime-500/30",
    badge: "bg-lime-500/20 text-lime-300 border-lime-400/40", iconBg: "bg-lime-500/20",
    iconColor: "text-lime-400", leftBar: "from-lime-400 to-green-500",
    desc: "Pengertian desimal, nilai tempat, konversi pecahan ke desimal dan sebaliknya",
  },
  {
    label: "PENJUMLAHAN DAN PENGURANGAN BENTUK DESIMAL",
    path: "/latihan-mandiri/kelas-7/bilangan-rasional/penjumlahan-pengurangan-desimal", soal: 8,
    latex: "0{,}3\\pm0{,}7",
    gradient: "from-green-900/40 to-emerald-900/30", border: "border-green-500/30",
    badge: "bg-green-500/20 text-green-300 border-green-400/40", iconBg: "bg-green-500/20",
    iconColor: "text-green-400", leftBar: "from-green-400 to-emerald-500",
    desc: "Penjumlahan bilangan desimal, menyamakan nilai tempat",
  },
  {
    label: "PERKALIAN BENTUK DESIMAL",
    path: "/latihan-mandiri/kelas-7/bilangan-rasional/perkalian-desimal", soal: 8,
    latex: "0{,}4\\times 3",
    gradient: "from-blue-900/40 to-sky-900/30", border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300 border-blue-400/40", iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400", leftBar: "from-blue-400 to-sky-500",
    desc: "Perkalian desimal, menentukan letak koma pada hasil kali",
  },
  {
    label: "PEMBAGIAN BENTUK DESIMAL",
    path: "/latihan-mandiri/kelas-7/bilangan-rasional/pembagian-desimal", soal: 8,
    latex: "0{,}6\\div 2",
    gradient: "from-purple-900/40 to-indigo-900/30", border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-300 border-purple-400/40", iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400", leftBar: "from-purple-400 to-indigo-500",
    desc: "Pembagian bilangan desimal, pembagi desimal, pola bagi",
  },
  {
    label: "PEMBULATAN BENTUK DESIMAL",
    path: "/latihan-mandiri/kelas-7/bilangan-rasional/pembulatan-desimal", soal: 8,
    latex: "3{,}14\\approx 3",
    gradient: "from-fuchsia-900/40 to-pink-900/30", border: "border-fuchsia-500/30",
    badge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40", iconBg: "bg-fuchsia-500/20",
    iconColor: "text-fuchsia-400", leftBar: "from-fuchsia-400 to-pink-500",
    desc: "Pembulatan ke satuan, puluhan, desimal tertentu, aturan pembulatan",
  },
];

const BilanganRasionalPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 border-2 border-teal-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🍕</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-teal-300 text-center mb-1" style={{ textShadow: '0 0 24px rgba(45,212,191,0.7)' }}>PECAHAN</h1>
          <p className="text-white/50 text-xs text-center font-body mb-1">Kelas 7 · Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2 mt-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">480 Soal Total · UN / TKA / ANBK</span>
            <span className="text-yellow-400 text-sm">⭐</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {subtopics.map((s, i) => (
            <button key={s.label} onClick={() => { playPopSound(); navigate(s.path); }}
              className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.01] animate-slide-up"
              style={{ animationDelay: `${i * 0.07}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} backdrop-blur`} />
              <div className={`absolute inset-0 border ${s.border} rounded-2xl group-hover:border-opacity-60 transition-colors`} />
              <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${s.leftBar} rounded-l-2xl`} />
              <div className="relative px-5 py-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.iconBg} border ${s.border} flex items-center justify-center shrink-0 overflow-hidden`}>
                  <span className={`text-[11px] leading-none ${s.iconColor}`}>
                    <InlineMath math={s.latex} />
                  </span>
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
          ))}
        </div>
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">📝 Catatan Pengayaan</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">Soal-soal dirancang berdasarkan kisi-kisi UN, TKA, dan ANBK, mencakup pecahan dan bilangan desimal dari konsep dasar hingga penalaran tinggi (HOTS).</p>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7"); }} className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer font-body">← Kembali ke Kelas 7</button>
        </div>
      </div>
    </div>
  );
};
export default BilanganRasionalPage;
