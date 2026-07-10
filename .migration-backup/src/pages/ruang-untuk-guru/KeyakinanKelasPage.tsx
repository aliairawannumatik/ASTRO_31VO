import { useNavigate } from "react-router-dom";
import { ArrowLeft, HeartHandshake, Sparkles, Smartphone, ClipboardCheck, ShieldCheck } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const keyakinan = [
  {
    title: "Saling menghormati dan menghargai",
    desc: "Menghargai pendapat, perasaan, dan perbedaan setiap warga kelas dalam setiap interaksi.",
    icon: HeartHandshake,
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-300/40",
    text: "text-pink-100",
  },
  {
    title: "Menjaga kebersihan dan kerapihan",
    desc: "Membuang sampah pada tempatnya, merapikan meja dan kursi, serta menjaga lingkungan belajar tetap nyaman.",
    icon: Sparkles,
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-300/40",
    text: "text-emerald-100",
  },
  {
    title: "Menggunakan gawai/HP dengan bijak",
    desc: "Gawai hanya digunakan untuk keperluan belajar dan saat diizinkan oleh guru.",
    icon: Smartphone,
    color: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-300/40",
    text: "text-cyan-100",
  },
  {
    title: "Menyelesaikan pekerjaan yang diberikan guru",
    desc: "Mengerjakan tugas, latihan, dan proyek dengan tanggung jawab serta tepat waktu.",
    icon: ClipboardCheck,
    color: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-300/40",
    text: "text-amber-100",
  },
];

const KeyakinanKelasPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <ShieldCheck className="w-4 h-4" />
            Kesepakatan Bersama
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            KEYAKINAN KELAS
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-2xl mx-auto font-body">
            Nilai-nilai yang kita yakini dan kita laksanakan bersama agar kelas menjadi tempat belajar yang aman, nyaman, dan menyenangkan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {keyakinan.map((k, i) => (
            <div
              key={k.title}
              className={`relative rounded-2xl border ${k.border} bg-gradient-to-br ${k.color} p-5 backdrop-blur animate-slide-up`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-xl border ${k.border} bg-black/20 flex items-center justify-center`}>
                  <k.icon className={`w-6 h-6 ${k.text}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${k.text}`}>#{i + 1}</span>
                  </div>
                  <h3 className="font-display text-base md:text-lg font-bold text-white leading-snug mb-1">
                    {k.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/75 font-body leading-relaxed">
                    {k.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center mb-8">
          <p className="text-sm md:text-base text-white/80 font-body italic">
            "Keyakinan kelas adalah janji bersama — bukan aturan yang dipaksakan, melainkan nilai yang kita pegang dengan sepenuh hati."
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Ruang untuk Guru
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyakinanKelasPage;
