import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Monitor,
  ListChecks,
  ShieldCheck,
  MessageSquareHeart,
  Gamepad2,
  HeartHandshake,
  ClipboardList,
  BookOpen,
  Target,
  ClipboardCheck,
  NotebookPen,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  BadgeCheck,
  Users,
  Star,
  Trophy,
  Clock,
} from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const guruMenuItems = [
  {
    label: "CAPAIAN PEMBELAJARAN",
    icon: Target,
    path: "/ruang-untuk-guru/capaian-pembelajaran",
    desc: "Capaian pembelajaran matematika Fase D",
  },
  {
    label: "ATP",
    icon: ListChecks,
    path: "/atp",
    desc: "Alur tujuan pembelajaran",
  },
  {
    label: "PROTA",
    icon: CalendarRange,
    path: "/ruang-untuk-guru/prota",
    desc: "Program tahunan matematika SMP",
  },
  {
    label: "ANALISIS ALOKASI WAKTU",
    icon: Clock,
    path: "/ruang-untuk-guru/analisis-alokasi-waktu",
    desc: "Perhitungan minggu efektif dan distribusi alokasi waktu per semester",
  },
  {
    label: "RPP",
    icon: BookOpen,
    path: "/ruang-untuk-guru/rpp",
    desc: "Rencana pelaksanaan pembelajaran",
  },
  {
    label: "KEYAKINAN KELAS",
    icon: HeartHandshake,
    path: "/ruang-untuk-guru/keyakinan-kelas",
    desc: "Nilai-nilai dan kesepakatan bersama di kelas",
  },
  {
    label: "PESAN DAN KESAN",
    icon: MessageSquareHeart,
    path: "/pesan-kesan",
    desc: "Form masukan penggunaan aplikasi",
  },
  {
    label: "RUBRIK PENILAIAN DIMENSI LULUSAN",
    icon: ClipboardCheck,
    path: "/ruang-untuk-guru/rubrik-penilaian-dimensi-lulusan",
    desc: "Rubrik 7 dimensi profil lulusan dan konversi nilai",
  },
  {
    label: "ABSENSI SISWA",
    icon: Users,
    path: "/ruang-untuk-guru/absensi-siswa",
    desc: "Daftar hadir peserta didik per pertemuan dengan rekapitulasi",
  },
  {
    label: "PENILAIAN SISWA",
    icon: Star,
    path: "/ruang-untuk-guru/penilaian-siswa",
    desc: "Input nilai, predikat, dan ketuntasan belajar peserta didik",
  },
  {
    label: "JURNAL GURU",
    icon: NotebookPen,
    path: "/ruang-untuk-guru/jurnal-guru",
    desc: "Buku jurnal kejadian dan tindak lanjut peserta didik",
  },
  {
    label: "AGENDA GURU",
    icon: CalendarClock,
    path: "/ruang-untuk-guru/agenda-guru",
    desc: "Agenda harian kegiatan pembelajaran dan kehadiran",
  },
  {
    label: "KKTP",
    icon: BadgeCheck,
    path: "/ruang-untuk-guru/kktp",
    desc: "Kriteria Ketercapaian Tujuan Pembelajaran Kurikulum Merdeka",
  },
  {
    label: "PROSEM",
    icon: CalendarDays,
    path: "/ruang-untuk-guru/prosem",
    desc: "Program semester matematika SMP 2025-2026 & 2026-2027",
  },
  {
    label: "KOKULIKULER",
    icon: Trophy,
    path: "/ruang-untuk-guru/kokulikuler",
    desc: "Aktivitas kokulikuler matematika: proyek, olimpiade, eksplorasi, investigasi & permainan per materi",
  },
  {
    label: "NUMATIK GAME",
    icon: Gamepad2,
    path: "/ruang-untuk-guru/numatik-game",
    desc: "Koleksi lengkap game matematika interaktif NUMATIK",
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
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            RUANG UNTUK GURU
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            Wadah khusus bagi pendidik yang menyediakan berbagai perangkat bantu untuk optimalisasi kegiatan belajar mengajar.
          </p>
        </div>

        {/* ── Desktop info banner ─────────────────────────────────────── */}
        <div
          className="relative flex items-center gap-4 rounded-2xl border px-5 py-4 mb-8 overflow-hidden animate-slide-up"
          style={{
            background: "linear-gradient(120deg, #0c3a4a 0%, #0f2d4a 60%, #151a3a 100%)",
            borderColor: "rgba(6,182,212,0.55)",
            boxShadow: "0 0 28px rgba(6,182,212,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* subtle glow blob */}
          <div
            className="absolute -left-6 -top-6 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)", filter: "blur(12px)" }}
          />

          {/* monitor icon */}
          <div
            className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(59,130,246,0.20))",
              borderColor: "rgba(6,182,212,0.45)",
              boxShadow: "0 0 14px rgba(6,182,212,0.25)",
            }}
          >
            <Monitor className="w-6 h-6 text-cyan-300" strokeWidth={1.75} />
          </div>

          {/* text */}
          <div className="relative flex-1 min-w-0">
            <p className="font-display text-sm font-bold text-cyan-200 leading-snug mb-0.5">
              🚀 Lebih Nyaman di Laptop atau PC!
            </p>
            <p className="font-body text-xs text-white/65 leading-relaxed">
              Ruang Guru punya banyak tabel & fitur lengkap — buka di desktop biar makin leluasa.{" "}
              <a
                href="https://www.numatik.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cyan-300 underline underline-offset-2 hover:text-cyan-200 transition-colors"
              >
                www.numatik.app
              </a>
            </p>
          </div>
        </div>

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
