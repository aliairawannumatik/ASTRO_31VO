import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, X, Divide, Hash, Calculator, Network } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const operasi = [
  {
    title: "Penjumlahan Bilangan Bulat",
    desc: "RPP untuk operasi penjumlahan pada bilangan bulat positif, nol, dan negatif beserta aplikasinya dalam kehidupan sehari-hari.",
    icon: Plus,
    path: "/ruang-untuk-guru/rpp/bilangan-bulat/penjumlahan",
    color: "from-emerald-500/25 to-teal-500/10",
    border: "border-emerald-300/50",
    text: "text-emerald-100",
    iconBg: "bg-emerald-500/20",
    available: true,
  },
  {
    title: "Pengurangan Bilangan Bulat",
    desc: "RPP untuk operasi pengurangan pada bilangan bulat dengan pendekatan garis bilangan dan konteks nyata.",
    icon: Minus,
    path: "/ruang-untuk-guru/rpp/bilangan-bulat/pengurangan",
    color: "from-cyan-500/25 to-blue-500/10",
    border: "border-cyan-300/50",
    text: "text-cyan-100",
    iconBg: "bg-cyan-500/20",
    available: false,
  },
  {
    title: "Perkalian Bilangan Bulat",
    desc: "RPP untuk operasi perkalian bilangan bulat termasuk aturan tanda dan sifat-sifat operasi.",
    icon: X,
    path: "/ruang-untuk-guru/rpp/bilangan-bulat/perkalian",
    color: "from-amber-500/25 to-yellow-500/10",
    border: "border-amber-300/50",
    text: "text-amber-100",
    iconBg: "bg-amber-500/20",
    available: false,
  },
  {
    title: "Pembagian Bilangan Bulat",
    desc: "RPP untuk operasi pembagian bilangan bulat dengan penekanan pada aturan tanda dan kebalikan dari perkalian.",
    icon: Divide,
    path: "/ruang-untuk-guru/rpp/bilangan-bulat/pembagian",
    color: "from-pink-500/25 to-rose-500/10",
    border: "border-pink-300/50",
    text: "text-pink-100",
    iconBg: "bg-pink-500/20",
    available: false,
  },
  {
    title: "Operasi Hitung Campuran Bilangan Bulat",
    desc: "RPP untuk operasi hitung campuran bilangan bulat dengan memperhatikan urutan operasi (penjumlahan, pengurangan, perkalian, pembagian) dan tanda kurung.",
    icon: Calculator,
    path: "/ruang-untuk-guru/rpp/bilangan-bulat/operasi-campuran",
    color: "from-orange-500/25 to-red-500/10",
    border: "border-orange-300/50",
    text: "text-orange-100",
    iconBg: "bg-orange-500/20",
    available: false,
  },
  {
    title: "KPK dan FPB",
    desc: "RPP untuk Kelipatan Persekutuan Terkecil (KPK) dan Faktor Persekutuan Terbesar (FPB) beserta penerapannya dalam menyelesaikan masalah sehari-hari.",
    icon: Network,
    path: "/ruang-untuk-guru/rpp/bilangan-bulat/kpk-fpb",
    color: "from-fuchsia-500/25 to-purple-500/10",
    border: "border-fuchsia-300/50",
    text: "text-fuchsia-100",
    iconBg: "bg-fuchsia-500/20",
    available: false,
  },
];

const RPPBilanganBulatPage = () => {
  const navigate = useNavigate();

  const handleClick = (item: typeof operasi[number]) => {
    playPopSound();
    if (item.available) navigate(item.path);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru/rpp" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <Hash className="w-4 h-4" />
            RPP - Bilangan Bulat
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            RPP - BILANGAN BULAT
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            Pilih sub-topik bilangan bulat untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {operasi.map((item, i) => (
            <button
              key={i}
              onClick={() => handleClick(item)}
              disabled={!item.available}
              className={`text-left bg-gradient-to-br ${item.color} backdrop-blur border ${item.border} rounded-xl p-5 animate-slide-up transition-all ${
                item.available
                  ? "hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.iconBg} mb-3`}>
                <item.icon className={`w-6 h-6 ${item.text}`} />
              </div>
              <h3 className={`font-display text-base font-bold ${item.text} mb-2 leading-tight`}>
                {item.title}
              </h3>
              <p className="text-xs text-white/75 font-body leading-relaxed">{item.desc}</p>
              {!item.available && (
                <span className="mt-3 inline-block text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                  Segera Hadir
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru/rpp"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke RPP
          </button>
        </div>
      </div>
    </div>
  );
};

export default RPPBilanganBulatPage;
