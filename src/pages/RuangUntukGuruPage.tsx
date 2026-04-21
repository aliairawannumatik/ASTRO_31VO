import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Users,
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
    label: "LKPD",
    icon: ClipboardCheck,
    path: "/lkpd",
    desc: "Lembar kerja interaktif dan berskor",
  },
  {
    label: "ATP",
    icon: ListChecks,
    path: "/atp",
    desc: "Alur tujuan pembelajaran",
  },
  {
    label: "ULANGAN HARIAN",
    icon: ShieldCheck,
    path: "/ulangan-harian",
    desc: "Mode ulangan fullscreen berskor",
  },
  {
    label: "PESAN DAN KESAN",
    icon: MessageSquareHeart,
    path: "/pesan-kesan",
    desc: "Form masukan penggunaan aplikasi",
  },
  {
    label: "NUMATIK GAME",
    icon: Gamepad2,
    path: "/ruang-untuk-guru/numatik-game",
    desc: "Koleksi lengkap game matematika interaktif NUMATIK",
  },
  {
    label: "KEYAKINAN KELAS",
    icon: HeartHandshake,
    path: "/ruang-untuk-guru/keyakinan-kelas",
    desc: "Nilai-nilai dan kesepakatan bersama di kelas",
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

        <section className="rounded-3xl border border-cyan-200/30 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-violet-500/15 p-6 md:p-8 mb-8 backdrop-blur">
          <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 items-center">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
              <div className="w-28 h-28 mx-auto rounded-3xl border border-cyan-300/30 bg-cyan-500/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
                <GraduationCap className="w-14 h-14 text-cyan-200" />
              </div>
              <h2 className="font-display text-2xl font-bold text-cyan-100">Untuk Bapak/Ibu Guru</h2>
              <div className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                <Users className="w-4 h-4 text-yellow-200" />
                Pendidik Matematika
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-white">Belajar Bersama, Mengajar Lebih Bermakna</h3>
              <p className="text-sm md:text-base text-white/75 font-body leading-relaxed text-justify">
                NUMATIK hadir sebagai mitra mengajar yang dapat dimanfaatkan guru untuk menyajikan pembelajaran matematika yang lebih interaktif. Dari LKPD berskor, ATP, ulangan harian, hingga form masukan — semua tersedia dalam ruang ini.
              </p>
              <p className="text-sm md:text-base text-white/70 font-body leading-relaxed text-justify">
                Pilih fitur di bawah untuk mulai mengeksplorasi dan mengintegrasikannya ke dalam rencana pembelajaran sehari-hari secara kreatif dan efektif.
              </p>
            </div>
          </div>
        </section>

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
