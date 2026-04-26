import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, FileText, Target, Layers, ClipboardCheck, Users } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const komponenRPP = [
  {
    title: "Identitas dan Tujuan Pembelajaran",
    desc: "Mata pelajaran, kelas/semester, alokasi waktu, serta capaian dan tujuan pembelajaran yang ingin dicapai.",
    icon: Target,
    color: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-300/40",
    text: "text-cyan-100",
  },
  {
    title: "Materi dan Pendekatan Pembelajaran",
    desc: "Materi pokok, model pembelajaran (mis. PBL, PjBL, Discovery Learning), serta media dan sumber belajar.",
    icon: Layers,
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-300/40",
    text: "text-emerald-100",
  },
  {
    title: "Kegiatan Pembelajaran",
    desc: "Tahapan pendahuluan, kegiatan inti, dan penutup yang memuat aktivitas guru dan peserta didik.",
    icon: Users,
    color: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-300/40",
    text: "text-amber-100",
  },
  {
    title: "Asesmen dan Refleksi",
    desc: "Bentuk asesmen formatif/sumatif, instrumen penilaian, serta refleksi guru dan peserta didik.",
    icon: ClipboardCheck,
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-300/40",
    text: "text-pink-100",
  },
];

const daftarRPP = [
  { kelas: "VII", topik: "Bilangan Bulat dan Pecahan" },
  { kelas: "VII", topik: "Bentuk Aljabar" },
  { kelas: "VII", topik: "Persamaan dan Pertidaksamaan Linear Satu Variabel" },
  { kelas: "VIII", topik: "Sistem Persamaan Linear Dua Variabel" },
  { kelas: "VIII", topik: "Teorema Pythagoras" },
  { kelas: "VIII", topik: "Lingkaran" },
  { kelas: "IX", topik: "Persamaan dan Fungsi Kuadrat" },
  { kelas: "IX", topik: "Kesebangunan dan Kekongruenan" },
  { kelas: "IX", topik: "Bangun Ruang Sisi Lengkung" },
];

const RPPPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <BookOpen className="w-4 h-4" />
            Perangkat Pembelajaran
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            RPP - RENCANA PELAKSANAAN PEMBELAJARAN
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            Dokumen perencanaan pembelajaran yang memuat tujuan, langkah-langkah kegiatan, serta asesmen sebagai panduan guru menjalankan proses belajar mengajar di kelas.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-lg font-bold text-accent mb-4 text-center">Komponen Utama RPP</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {komponenRPP.map((item, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${item.color} backdrop-blur border ${item.border} rounded-xl p-5 animate-slide-up`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <item.icon className={`w-8 h-8 ${item.text} mb-3`} />
                <h3 className={`font-display text-sm font-bold ${item.text} mb-2 leading-tight`}>{item.title}</h3>
                <p className="text-xs text-white/75 font-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 bg-card/80 backdrop-blur border border-border rounded-xl p-5 animate-slide-up">
          <h2 className="font-display text-lg font-bold text-accent mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Daftar RPP Matematika SMP
          </h2>
          <div className="space-y-2">
            {daftarRPP.map((rpp, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-muted/30 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <span className="flex-shrink-0 w-12 h-8 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center font-display text-xs font-bold text-primary">
                  {rpp.kelas}
                </span>
                <span className="font-body text-sm text-white/90">{rpp.topik}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground font-body italic">
            Konten RPP lengkap dapat ditambahkan sesuai kurikulum yang berlaku.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Ruang Untuk Guru
          </button>
        </div>
      </div>
    </div>
  );
};

export default RPPPage;
