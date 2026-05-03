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

const materiRPP: { label: string; path: string; available: boolean }[] = [
  { label: "BILANGAN BULAT", path: "/ruang-untuk-guru/rpp/bilangan-bulat", available: true },
  { label: "PECAHAN", path: "/ruang-untuk-guru/rpp/pecahan", available: true },
  { label: "BENTUK ALJABAR", path: "/ruang-untuk-guru/rpp/bentuk-aljabar", available: true },
  { label: "PERSAMAAN DAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", path: "/ruang-untuk-guru/rpp/plsv-ptlsv", available: true },
  { label: "PERBANDINGAN", path: "/ruang-untuk-guru/rpp/perbandingan", available: true },
  { label: "ARITMETIKA SOSIAL", path: "/ruang-untuk-guru/rpp/aritmetika-sosial", available: true },
  { label: "GARIS DAN SUDUT", path: "/ruang-untuk-guru/rpp/garis-dan-sudut", available: true },
  { label: "SEGITIGA DAN SEGIEMPAT", path: "/ruang-untuk-guru/rpp/segitiga-segiempat", available: true },
  { label: "HIMPUNAN", path: "/ruang-untuk-guru/rpp/himpunan", available: true },
  { label: "POLA BILANGAN", path: "/ruang-untuk-guru/rpp/pola-bilangan", available: true },
  { label: "KOORDINAT CARTESIUS", path: "/ruang-untuk-guru/rpp/koordinat-cartesius", available: true },
  { label: "RELASI DAN FUNGSI", path: "/ruang-untuk-guru/rpp/relasi-fungsi", available: true },
  { label: "SISTEM PERSAMAAN LINEAR DUA VARIABEL", path: "/ruang-untuk-guru/rpp/spldv", available: true },
  { label: "PERSAMAAN GARIS LURUS", path: "/ruang-untuk-guru/rpp/persamaan-garis-lurus", available: true },
  { label: "TEOREMA PYTHAGORAS", path: "/ruang-untuk-guru/rpp/teorema-pythagoras", available: true },
  { label: "LINGKARAN", path: "/ruang-untuk-guru/rpp/lingkaran", available: true },
  { label: "GARIS SINGGUNG LINGKARAN", path: "/ruang-untuk-guru/rpp/garis-singgung-lingkaran", available: true },
  { label: "BANGUN RUANG SISI DATAR", path: "/ruang-untuk-guru/rpp/bangun-ruang-sisi-datar", available: true },
  { label: "BILANGAN BERPANGKAT DAN BENTUK AKAR", path: "/ruang-untuk-guru/rpp/bilangan-berpangkat", available: true },
  { label: "PERSAMAAN KUADRAT", path: "/ruang-untuk-guru/rpp/persamaan-kuadrat", available: true },
  { label: "FUNGSI KUADRAT", path: "/ruang-untuk-guru/rpp/fungsi-kuadrat", available: true },
  { label: "TRANSFORMASI GEOMETRI", path: "/ruang-untuk-guru/rpp/transformasi-geometri", available: true },
  { label: "KESEBANGUNAN DAN KEKONGRUENAN", path: "/ruang-untuk-guru/rpp/kesebangunan-kekongruenan", available: true },
  { label: "BANGUN RUANG SISI LENGKUNG", path: "/ruang-untuk-guru/rpp/bangun-ruang-sisi-lengkung", available: false },
  { label: "STATISTIKA", path: "/ruang-untuk-guru/rpp/statistika", available: false },
  { label: "PELUANG", path: "/ruang-untuk-guru/rpp/peluang", available: false },
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
          <div className="flex flex-col gap-3 animate-slide-up">
            {materiRPP.map((materi, i) => (
              <button
                key={materi.label}
                onClick={() => {
                  if (!materi.available) return;
                  playPopSound();
                  navigate(materi.path);
                }}
                disabled={!materi.available}
                className={`group flex items-center gap-4 bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4
                  transition-all duration-300 text-left animate-slide-up ${
                    materi.available
                      ? "hover:border-primary/60 cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <BookOpen className={`w-5 h-5 shrink-0 ${materi.available ? "text-primary group-hover:scale-110 transition-transform" : "text-white/40"}`} />
                <span className="font-body text-sm text-white flex-1">{materi.label}</span>
                {materi.available ? (
                  <span className="text-xs text-primary font-display">LIHAT</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Segera Hadir</span>
                )}
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs text-muted-foreground font-body italic text-center">
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
