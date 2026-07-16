import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpenCheck, GraduationCap, MapPin, School, Users } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const profileCards = [
  {
    title: "Identitas Sekolah",
    text: "SMP Negeri 28 Bandung merupakan lingkungan belajar tempat NUMATIK dikembangkan untuk mendukung pembelajaran matematika yang aktif, interaktif, dan menyenangkan.",
    icon: School,
  },
  {
    title: "Semangat Belajar",
    text: "Menu ini menjadi ruang pengenalan sekolah sekaligus penghubung antara pembelajaran matematika, teknologi, dan budaya belajar positif.",
    icon: GraduationCap,
  },
  {
    title: "Kolaborasi",
    text: "Pengembangan konten NUMATIK tumbuh dari semangat kolaborasi guru, siswa, dan komunitas belajar di SMPN 28 Bandung.",
    icon: Users,
  },
];

const SMPN28BandungPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <School className="w-4 h-4" />
            Profil Sekolah
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            SMPN 28 BANDUNG
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            Ruang informasi sekolah dalam aplikasi NUMATIK sebagai bagian dari identitas, kolaborasi, dan semangat pembelajaran matematika berbasis teknologi.
          </p>
        </div>

        <section className="rounded-3xl border border-cyan-200/30 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-violet-500/15 p-6 md:p-8 mb-6 backdrop-blur">
          <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 items-center">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
              <div className="w-28 h-28 mx-auto rounded-3xl border border-cyan-300/30 bg-cyan-500/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
                <School className="w-14 h-14 text-cyan-200" />
              </div>
              <h2 className="font-display text-2xl font-bold text-cyan-100">SMP Negeri 28 Bandung</h2>
              <div className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-yellow-200" />
                Kota Bandung
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-white">Sekolah, Numerasi, dan Teknologi</h3>
              <p className="text-sm md:text-base text-white/75 font-body leading-relaxed text-justify">
                SMPN 28 Bandung menjadi bagian penting dalam perjalanan pengembangan NUMATIK. Melalui menu ini, siswa dapat mengenal identitas sekolah dan semangat pembelajaran yang mendorong pemanfaatan teknologi untuk memahami matematika secara lebih bermakna.
              </p>
              <p className="text-sm md:text-base text-white/70 font-body leading-relaxed text-justify">
                Halaman ini dapat terus dikembangkan menjadi ruang profil sekolah, informasi kegiatan, dokumentasi karya siswa, dan etalase pembelajaran numerasi di lingkungan SMPN 28 Bandung.
              </p>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {profileCards.map((card) => (
            <div key={card.title} className="rounded-2xl bg-card/80 backdrop-blur border border-border p-5 shadow-lg">
              <card.icon className="w-8 h-8 text-yellow-300 mb-3" />
              <h3 className="font-display font-bold text-lg text-white mb-2">{card.title}</h3>
              <p className="text-sm text-white/65 font-body leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>

        <section className="rounded-3xl border border-emerald-200/25 bg-emerald-500/10 p-5 md:p-7 text-center backdrop-blur mb-8">
          <BookOpenCheck className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
          <h2 className="font-display text-2xl font-bold text-emerald-100 mb-2">Dukungan untuk Pembelajaran</h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto font-body">
            NUMATIK hadir sebagai media belajar matematika yang dapat digunakan siswa untuk membaca materi, berlatih mandiri, mengerjakan LKPD, bermain game matematika, dan mengeksplorasi soal-soal numerasi.
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

export default SMPN28BandungPage;