import { useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, BookOpen, ClipboardList, Lightbulb, FileText, Users } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const featureCards = [
  {
    title: "Panduan Mengajar",
    text: "Gunakan NUMATIK sebagai media pembelajaran interaktif di kelas. Setiap modul dirancang untuk mendukung pembelajaran aktif dan bermakna.",
    icon: BookOpen,
  },
  {
    title: "Sumber Belajar",
    text: "Akses materi, LKPD, bank soal, dan ATP yang dapat langsung digunakan dalam kegiatan belajar mengajar di kelas.",
    icon: ClipboardList,
  },
  {
    title: "Kolaborasi & Inspirasi",
    text: "Bagikan pengalaman mengajar dan temukan inspirasi baru dari fitur-fitur inovatif NUMATIK bersama komunitas guru matematika.",
    icon: Lightbulb,
  },
];

const RuangUntukGuruPage = () => {
  const navigate = useNavigate();

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

        <section className="rounded-3xl border border-cyan-200/30 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-violet-500/15 p-6 md:p-8 mb-6 backdrop-blur">
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
                NUMATIK hadir sebagai mitra mengajar yang dapat dimanfaatkan guru untuk menyajikan pembelajaran matematika yang lebih interaktif. Dari materi terstruktur, latihan soal, LKPD, hingga game matematika — semua tersedia dalam satu platform.
              </p>
              <p className="text-sm md:text-base text-white/70 font-body leading-relaxed text-justify">
                Ruang ini dirancang sebagai titik awal bagi guru untuk mengeksplorasi berbagai fitur NUMATIK dan mengintegrasikannya ke dalam rencana pembelajaran sehari-hari secara kreatif dan efektif.
              </p>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {featureCards.map((card) => (
            <div key={card.title} className="rounded-2xl bg-card/80 backdrop-blur border border-border p-5 shadow-lg">
              <card.icon className="w-8 h-8 text-yellow-300 mb-3" />
              <h3 className="font-display font-bold text-lg text-white mb-2">{card.title}</h3>
              <p className="text-sm text-white/65 font-body leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>

        <section className="rounded-3xl border border-emerald-200/25 bg-emerald-500/10 p-5 md:p-7 text-center backdrop-blur mb-8">
          <FileText className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
          <h2 className="font-display text-2xl font-bold text-emerald-100 mb-2">Eksplorasi Semua Fitur</h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto font-body">
            Manfaatkan seluruh fitur NUMATIK — materi per jenjang, LKPD berskor, ulangan harian, bank soal, video pembelajaran, hingga NUMATIK AI — sebagai ekosistem belajar matematika yang lengkap untuk siswa Anda.
          </p>
        </section>

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
