import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  Zap,
  Hash,
  Square,
  Percent,
  Plus,
  X,
  Divide,
  Target,
  Calculator,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";

const topics = [
  {
    label: "PERKALIAN DENGAN 11",
    icon: Hash,
    path: "/menghitung-cepat/perkalian-11",
    desc: "Trik menjumlah digit bersebelahan",
    color: "text-sky-400",
    border: "border-sky-500/30 hover:border-sky-400/60",
    ready: true,
  },
  {
    label: "KUADRAT BILANGAN BERAKHIRAN 5",
    icon: Square,
    path: "/menghitung-cepat/kuadrat-berakhiran-5",
    desc: "n × (n+1) lalu tambahkan 25",
    color: "text-emerald-400",
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    ready: true,
  },
  {
    label: "KUADRAT CEPAT UMUM",
    icon: Calculator,
    path: "/menghitung-cepat/kuadrat-cepat",
    desc: "Metode (a+b)² dan (a−b)²",
    color: "text-violet-400",
    border: "border-violet-500/30 hover:border-violet-400/60",
    ready: true,
  },
  {
    label: "PERKALIAN BILANGAN DEKAT 100",
    icon: Target,
    path: "/menghitung-cepat/perkalian-dekat-100",
    desc: "Trik Vedic: selisih dari 100",
    color: "text-orange-400",
    border: "border-orange-500/30 hover:border-orange-400/60",
    ready: true,
  },
  {
    label: "PERSENTASE CEPAT",
    icon: Percent,
    path: "/menghitung-cepat/persentase-cepat",
    desc: "Hitung % tanpa kalkulator",
    color: "text-pink-400",
    border: "border-pink-500/30 hover:border-pink-400/60",
    ready: true,
  },
  {
    label: "PENJUMLAHAN & PENGURANGAN CEPAT",
    icon: Plus,
    path: "/menghitung-cepat/penjumlahan-pengurangan",
    desc: "Kompensasi dan pengelompokan",
    color: "text-cyan-400",
    border: "border-cyan-500/30 hover:border-cyan-400/60",
    ready: true,
  },
  {
    label: "PERKALIAN DUA DIGIT",
    icon: X,
    path: "/menghitung-cepat/perkalian-dua-digit",
    desc: "Metode silang & FOIL mental",
    color: "text-yellow-400",
    border: "border-yellow-500/30 hover:border-yellow-400/60",
    ready: true,
  },
  {
    label: "PEMBAGIAN CEPAT",
    icon: Divide,
    path: "/menghitung-cepat/pembagian-cepat",
    desc: "Faktor & estimasi cerdas",
    color: "text-rose-400",
    border: "border-rose-500/30 hover:border-rose-400/60",
    ready: true,
  },
];

const MenghitungCepatPage = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    playPopSound();
    navigate(path);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12 text-center">
        <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-yellow-300 text-glow-cyan mb-2">
          MENGHITUNG CEPAT
        </h1>
        <p className="text-white/60 text-sm font-body mb-2">
          Kuasai trik-trik mental math untuk berhitung lebih cepat dan akurat
        </p>
        <div className="flex justify-center gap-2 mb-8">
          <span className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-body px-3 py-1 rounded-full">
            ⚡ Tanpa Kalkulator
          </span>
          <span className="bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-body px-3 py-1 rounded-full">
            🧠 Mental Math
          </span>
          <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-body px-3 py-1 rounded-full">
            🏆 Cocok untuk ANBK & UN
          </span>
        </div>

        <button
          onClick={() => handleClick("/menghitung-cepat/tabel-referensi")}
          className="w-full mb-4 group bg-gradient-to-r from-yellow-500/15 via-amber-500/15 to-orange-500/15 backdrop-blur border border-yellow-500/40 hover:border-yellow-300/70 rounded-xl p-5 text-left hover:box-glow-cyan transition-all duration-300 cursor-pointer animate-slide-up"
        >
          <div className="flex items-start gap-4">
            <BookOpen className="w-8 h-8 text-yellow-300 mt-0.5 group-hover:scale-110 transition-transform shrink-0" />
            <div>
              <h3 className="font-display text-base font-bold text-yellow-200 mb-1 leading-tight">
                ⭐ TABEL REFERENSI CEPAT
              </h3>
              <p className="text-xs text-white/70 font-body leading-relaxed">
                Daftar perkalian 1–10, kuadrat 1–30, kubik, akar, pangkat, bilangan prima, pecahan ↔ desimal ↔ persen, dan konversi satuan — semua dalam satu halaman hafalan.
              </p>
            </div>
          </div>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((topic, i) => (
            <button
              key={topic.path}
              onClick={() => handleClick(topic.path)}
              className={`group bg-card/80 backdrop-blur border ${topic.border} rounded-xl p-5 text-left 
                hover:box-glow-cyan transition-all duration-300 cursor-pointer animate-slide-up`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="flex items-start gap-4">
                <topic.icon className={`w-7 h-7 ${topic.color} mt-0.5 group-hover:scale-110 transition-transform shrink-0`} />
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground mb-1 leading-tight">
                    {topic.label}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body">{topic.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-left">
          <p className="text-yellow-300 font-body text-sm font-bold mb-1">💡 Mengapa Belajar Menghitung Cepat?</p>
          <p className="text-white/70 text-xs font-body leading-relaxed">
            Kemampuan berhitung cepat di kepala (<em>mental math</em>) membantu kamu menghemat waktu saat ujian,
            memperkirakan hasil dengan cepat, dan melatih konsentrasi. Trik-trik di sini bukan sekadar hafalan —
            setiap trik memiliki dasar <strong className="text-cyan-300">aljabar dan logika matematika</strong> yang bisa kamu buktikan sendiri.
          </p>
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/menu"); }}
          className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors font-body cursor-pointer"
        >
          ← Kembali ke Menu Utama
        </button>
      </div>
    </div>
  );
};

export default MenghitungCepatPage;
