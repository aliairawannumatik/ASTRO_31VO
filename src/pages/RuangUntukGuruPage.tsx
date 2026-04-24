import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  ClipboardCheck,
  ListChecks,
  ShieldCheck,
  MessageSquareHeart,
  Gamepad2,
  HeartHandshake,
  ClipboardList,
} from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const guruMenuItems = [
  {
    label: "ATP",
    icon: ListChecks,
    path: "/atp",
    desc: "Alur tujuan pembelajaran",
  },
  {
    label: "LKPD",
    icon: ClipboardCheck,
    path: "/lkpd",
    desc: "Lembar kerja interaktif dan berskor",
  },
  {
    label: "KEYAKINAN KELAS",
    icon: HeartHandshake,
    path: "/ruang-untuk-guru/keyakinan-kelas",
    desc: "Nilai-nilai dan kesepakatan bersama di kelas",
  },
  {
    label: "NUMATIK GAME",
    icon: Gamepad2,
    path: "/ruang-untuk-guru/numatik-game",
    desc: "Koleksi lengkap game matematika interaktif NUMATIK",
  },
  {
    label: "PESAN DAN KESAN",
    icon: MessageSquareHeart,
    path: "/pesan-kesan",
    desc: "Form masukan penggunaan aplikasi",
  },
  {
    label: "ULANGAN HARIAN",
    icon: ShieldCheck,
    path: "/ulangan-harian",
    desc: "Mode ulangan fullscreen berskor",
  },
  {
    label: "PENILAIAN PEMBELAJARAN",
    icon: ClipboardList,
    path: "/ruang-untuk-guru/penilaian-pembelajaran",
    desc: "Aspek penilaian sikap dan capaian peserta didik",
  },
];

const RuangUntukGuruPage = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    playPopSound();
    navigate(path);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <GraduationCap className="w-4 h-4" />
            Ruang Pendidik
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            RUANG UNTUK GURU
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            Ruang khusus bagi para pendidik untuk memaksimalkan penggunaan NUMATIK sebagai media pembelajaran matematika yang interaktif, inovatif, dan menyenangkan di kelas.
          </p>
        </div>

        <h2 className="font-display text-xl font-bold text-white mb-4 text-center">Fitur untuk Guru</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {guruMenuItems.map((item, i) => (
            <button
              key={item.path}
              onClick={() => handleClick(item.path)}
              className="group relative bg-card/80 backdrop-blur border border-border rounded-xl p-5
                hover:border-primary/60 hover:box-glow-cyan transition-all duration-300
                cursor-pointer text-left animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <item.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-[11px] sm:text-sm font-bold text-foreground mb-1 leading-tight">{item.label}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
};

export default RuangUntukGuruPage;
