import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { useTheme } from "@/contexts/ThemeContext";
import { playPopSound } from "@/hooks/useAudio";
import {
  ThumbsUp,
  Share2,
  Eye,
  BookOpen,
  Play,
  Clock,
  Rocket,
  Star,
  Lock,
  CheckCircle2,
  Sparkles,
  Zap,
  ChevronRight,
  GraduationCap,
  Film,
  Filter,
} from "lucide-react";

const ALL_VIDEOS = [
  {
    id: "UVt4JZaGqwU",
    playlistId: "PLxsvNQG_jS3lKhP69paEJ-f_BcwnY1_yU",
    title: "Statistika — Mean, Median, Modus, dan Penyajian Data",
    subject: "Statistika",
    kelas: "Kelas 8",
    kelasNum: 8,
    duration: "–",
    views: "–",
    likes: "0",
    date: "2024",
    channel: "NUMATIK CHANNEL",
    color: "from-rose-500 via-pink-600 to-red-700",
    colorAccent: "#f43f5e",
    icon: "📊",
    emoji: "📊",
    description:
      "Video pembelajaran ini membahas materi Statistika untuk siswa SMP. Kamu akan belajar cara membaca dan menyajikan data, serta menghitung ukuran pemusatan data seperti Mean, Median, dan Modus dengan mudah dan menyenangkan.\n\nTopik yang dibahas:\n• Pengertian statistika dan data\n• Penyajian data dalam tabel dan diagram\n• Cara menghitung Mean (rata-rata)\n• Cara menentukan Median (nilai tengah)\n• Cara menentukan Modus (nilai yang sering muncul)\n• Contoh soal dan pembahasan lengkap",
  },
  {
    id: "oCprYLAoDTw",
    playlistId: "PLxsvNQG_jS3mDYiC97ma1OBb7hViYPVqr",
    title: "Bangun Ruang Sisi Datar — Kubus, Balok, Prisma, dan Limas",
    subject: "Bangun Ruang Sisi Datar",
    kelas: "Kelas 8",
    kelasNum: 8,
    duration: "–",
    views: "–",
    likes: "0",
    date: "2024",
    channel: "NUMATIK CHANNEL",
    color: "from-emerald-500 via-teal-600 to-cyan-700",
    colorAccent: "#10b981",
    icon: "📦",
    emoji: "📦",
    description:
      "Video pembelajaran ini membahas materi Bangun Ruang Sisi Datar untuk siswa SMP. Kamu akan belajar mengenal dan menghitung luas permukaan serta volume bangun ruang sisi datar dengan cara yang mudah dan menyenangkan.\n\nTopik yang dibahas:\n• Kubus — luas permukaan dan volume\n• Balok — luas permukaan dan volume\n• Prisma — jenis-jenis dan hitungannya\n• Limas — jenis-jenis dan hitungannya\n• Contoh soal dan pembahasan lengkap",
  },
  {
    id: "2kgNqy5VTdA",
    playlistId: "PLxsvNQG_jS3nWlr8-a66c9s4W0MlHH9Vj",
    title: "Teorema Pythagoras — Konsep, Rumus, dan Penerapannya",
    subject: "Teorema Pythagoras",
    kelas: "Kelas 8",
    kelasNum: 8,
    duration: "–",
    views: "–",
    likes: "0",
    date: "2024",
    channel: "NUMATIK CHANNEL",
    color: "from-violet-500 via-purple-600 to-indigo-700",
    colorAccent: "#8b5cf6",
    icon: "📐",
    emoji: "📐",
    description:
      "Video pembelajaran ini membahas materi Teorema Pythagoras untuk siswa SMP. Kamu akan belajar konsep dasar, rumus, dan berbagai penerapan Teorema Pythagoras dalam kehidupan sehari-hari.\n\nTopik yang dibahas:\n• Konsep dan bunyi Teorema Pythagoras\n• Rumus dasar: a² + b² = c²\n• Triple Pythagoras\n• Menentukan jenis segitiga\n• Penerapan dalam soal dan kehidupan nyata\n• Contoh soal dan pembahasan lengkap",
  },
  {
    id: "",
    playlistId: "PLxsvNQG_jS3kd8lcS8mWk0CjyquW2MN4p",
    title: "SPLDV — Sistem Persamaan Linear Dua Variabel",
    subject: "SPLDV",
    kelas: "Kelas 8",
    kelasNum: 8,
    duration: "–",
    views: "–",
    likes: "0",
    date: "2024",
    channel: "NUMATIK CHANNEL",
    color: "from-amber-500 via-orange-500 to-yellow-600",
    colorAccent: "#f59e0b",
    icon: "🔣",
    emoji: "🔣",
    description:
      "Video pembelajaran ini membahas materi Sistem Persamaan Linear Dua Variabel (SPLDV) untuk siswa SMP. Kamu akan belajar berbagai metode penyelesaian SPLDV dengan cara yang mudah dipahami.\n\nTopik yang dibahas:\n• Pengertian dan bentuk umum SPLDV\n• Metode substitusi\n• Metode eliminasi\n• Metode grafik\n• Metode campuran (substitusi + eliminasi)\n• Contoh soal dan pembahasan lengkap",
  },
  {
    id: "",
    playlistId: "PLxsvNQG_jS3lxc31fNfLO8RuMlR9IGo3W",
    title: "Perbandingan — Perbandingan Senilai dan Berbalik Nilai",
    subject: "Perbandingan",
    kelas: "Kelas 7",
    kelasNum: 7,
    duration: "–",
    views: "–",
    likes: "0",
    date: "2024",
    channel: "NUMATIK CHANNEL",
    color: "from-sky-500 via-blue-600 to-indigo-600",
    colorAccent: "#0ea5e9",
    icon: "⚖️",
    emoji: "⚖️",
    description:
      "Video pembelajaran ini membahas materi Perbandingan untuk siswa SMP Kelas 7. Kamu akan belajar konsep perbandingan senilai dan berbalik nilai beserta penerapannya dalam kehidupan sehari-hari.\n\nTopik yang dibahas:\n• Pengertian dan bentuk perbandingan\n• Perbandingan senilai\n• Perbandingan berbalik nilai\n• Skala dan peta\n• Contoh soal dan pembahasan lengkap",
  },
  {
    id: "",
    playlistId: "PLxsvNQG_jS3klHH173EnJ73jBI-ZUPpkt",
    title: "Persamaan Garis Lurus — Gradien, Persamaan, dan Grafik",
    subject: "Persamaan Garis Lurus",
    kelas: "Kelas 8",
    kelasNum: 8,
    duration: "–",
    views: "–",
    likes: "0",
    date: "2024",
    channel: "NUMATIK CHANNEL",
    color: "from-teal-500 via-cyan-600 to-sky-700",
    colorAccent: "#14b8a6",
    icon: "📈",
    emoji: "📈",
    description:
      "Video pembelajaran ini membahas materi Persamaan Garis Lurus untuk siswa SMP Kelas 8. Kamu akan belajar cara menentukan gradien, membuat persamaan garis, dan menggambar grafiknya.\n\nTopik yang dibahas:\n• Pengertian garis lurus dan gradien\n• Menentukan gradien dari dua titik\n• Persamaan garis lurus: y = mx + c\n• Menggambar grafik garis lurus\n• Kedudukan dua garis\n• Contoh soal dan pembahasan lengkap",
  },
  {
    id: "",
    playlistId: "PLxsvNQG_jS3noX9gSeiBd0M6UWJoEvuBk",
    title: "Transformasi Geometri — Translasi, Refleksi, Rotasi, Dilatasi",
    subject: "Transformasi Geometri",
    kelas: "Kelas 9",
    kelasNum: 9,
    duration: "–",
    views: "–",
    likes: "0",
    date: "2024",
    channel: "NUMATIK CHANNEL",
    color: "from-fuchsia-500 via-purple-600 to-violet-700",
    colorAccent: "#d946ef",
    icon: "🔄",
    emoji: "🔄",
    description:
      "Video pembelajaran ini membahas materi Transformasi Geometri untuk siswa SMP Kelas 9. Kamu akan belajar empat jenis transformasi geometri beserta sifat-sifatnya.\n\nTopik yang dibahas:\n• Translasi (pergeseran)\n• Refleksi (pencerminan)\n• Rotasi (perputaran)\n• Dilatasi (perbesaran/perkecilan)\n• Komposisi transformasi\n• Contoh soal dan pembahasan lengkap",
  },
  {
    id: "",
    playlistId: "PLxsvNQG_jS3kmotk-0DltUP6ljHUt4C3n",
    title: "Kesebangunan dan Kekongruenan",
    subject: "Kesebangunan & Kekongruenan",
    kelas: "Kelas 9",
    kelasNum: 9,
    duration: "–",
    views: "–",
    likes: "0",
    date: "2024",
    channel: "NUMATIK CHANNEL",
    color: "from-lime-500 via-green-600 to-emerald-700",
    colorAccent: "#84cc16",
    icon: "🔷",
    emoji: "🔷",
    description:
      "Video pembelajaran ini membahas materi Kesebangunan dan Kekongruenan untuk siswa SMP Kelas 9. Kamu akan belajar syarat, sifat, dan penerapan kedua konsep penting dalam geometri ini.\n\nTopik yang dibahas:\n• Pengertian kesebangunan bangun datar\n• Syarat dua bangun sebangun\n• Pengertian kekongruenan\n• Syarat dua segitiga kongruen (s-s-s, s-d-s, d-s-d)\n• Penerapan dalam soal dan kehidupan nyata\n• Contoh soal dan pembahasan lengkap",
  },
  {
    id: "",
    playlistId: "PLxsvNQG_jS3k0uck2lzDZLavkT2IZMMkr",
    title: "Lingkaran — Unsur, Keliling, Luas, dan Sudut",
    subject: "Lingkaran",
    kelas: "Kelas 8",
    kelasNum: 8,
    duration: "–",
    views: "–",
    likes: "0",
    date: "2024",
    channel: "NUMATIK CHANNEL",
    color: "from-orange-500 via-red-500 to-rose-600",
    colorAccent: "#f97316",
    icon: "⭕",
    emoji: "⭕",
    description:
      "Video pembelajaran ini membahas materi Lingkaran untuk siswa SMP Kelas 8. Kamu akan belajar unsur-unsur lingkaran, cara menghitung keliling dan luas, serta konsep sudut dalam lingkaran.\n\nTopik yang dibahas:\n• Unsur-unsur lingkaran (jari-jari, diameter, busur, tali busur)\n• Keliling lingkaran\n• Luas lingkaran\n• Sudut pusat dan sudut keliling\n• Panjang busur dan luas juring\n• Contoh soal dan pembahasan lengkap",
  },
];

const COMING_SOON = [
  { title: "Bilangan Pecahan & Operasinya", kelas: "Kelas 7", kelasNum: 7, duration: "–", views: "–", color: "from-violet-600 via-purple-600 to-fuchsia-700", colorAccent: "#8b5cf6", emoji: "➗" },
  { title: "Persamaan Linier Satu Variabel", kelas: "Kelas 7", kelasNum: 7, duration: "–", views: "–", color: "from-orange-500 via-amber-500 to-yellow-600", colorAccent: "#f59e0b", emoji: "📐" },
  { title: "Luas & Keliling Bangun Datar", kelas: "Kelas 8", kelasNum: 8, duration: "–", views: "–", color: "from-green-500 via-emerald-600 to-teal-700", colorAccent: "#10b981", emoji: "📏" },
  { title: "Bilangan Bulat & Operasinya", kelas: "Kelas 7", kelasNum: 7, duration: "–", views: "–", color: "from-cyan-500 via-blue-600 to-indigo-700", colorAccent: "#06b6d4", emoji: "🔢" },
];

const KELAS_FILTERS = ["Semua", "Kelas 7", "Kelas 8", "Kelas 9"];

const VideoPembelajaranPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(ALL_VIDEOS[0].likes));
  const [copied, setCopied] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [kelasFilter, setKelasFilter] = useState("Semua");
  const playerRef = useRef<HTMLDivElement>(null);

  const currentVideo = ALL_VIDEOS[activeIndex];

  const filteredVideos = ALL_VIDEOS.filter(
    v => kelasFilter === "Semua" || v.kelas === kelasFilter
  );
  const filteredComingSoon = COMING_SOON.filter(
    v => kelasFilter === "Semua" || v.kelas === kelasFilter
  );

  const handleSelectVideo = (index: number) => {
    if (index === activeIndex) return;
    playPopSound();
    setActiveIndex(index);
    setLiked(false);
    setLikeCount(parseInt(ALL_VIDEOS[index].likes));
    setShowDesc(false);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLike = () => {
    playPopSound();
    setLiked(prev => {
      setLikeCount(c => prev ? c - 1 : c + 1);
      return !prev;
    });
  };

  const handleShare = () => {
    playPopSound();
    navigator.clipboard?.writeText(
      currentVideo.id
        ? `https://www.youtube.com/watch?v=${currentVideo.id}&list=${currentVideo.playlistId}`
        : `https://www.youtube.com/playlist?list=${currentVideo.playlistId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const d = isDark;

  return (
    <div className={`relative min-h-screen flex flex-col overflow-x-hidden ${d ? "gradient-space" : "gradient-snow"}`}>
      {d ? <Starfield /> : <Snowfall />}
      <PageNavigation />

      {/* ─── HERO BANNER ─── */}
      <div className="relative z-10 w-full pt-16">
        <div className={`relative overflow-hidden ${d ? "bg-gradient-to-b from-[#060d1f] via-[#06112a]/80 to-transparent" : "bg-gradient-to-b from-blue-50/90 via-blue-50/50 to-transparent"}`}>
          {/* Decorative orbs */}
          {d && (
            <>
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-display font-bold tracking-widest uppercase mb-4 ${d ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-100 text-blue-600 border border-blue-200"}`}>
                <Film className="w-3.5 h-3.5" />
                Studio Belajar
              </div>

              <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight mb-3 leading-none ${d ? "text-white" : "text-gray-900"}`}>
                <span className={d ? "text-glow-cyan text-cyan-300" : "text-blue-600"}>VIDEO</span>{" "}
                PEMBELAJARAN
              </h1>
              <p className={`font-body text-sm md:text-base max-w-lg ${d ? "text-white/50" : "text-gray-500"}`}>
                Nonton, pahami, dan kuasai matematika bersama NUMATIK — lebih seru dari belajar biasa
              </p>

              {/* Stats pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                {[
                  { icon: Play, label: `${ALL_VIDEOS.length} Video`, color: d ? "text-cyan-400" : "text-blue-600" },
                  { icon: Lock, label: `${COMING_SOON.length} Segera Hadir`, color: d ? "text-amber-400" : "text-amber-600" },
                  { icon: GraduationCap, label: "Kelas 7–9 SMP", color: d ? "text-violet-400" : "text-violet-600" },
                ].map(({ icon: Icon, label, color }) => (
                  <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-bold ${d ? "bg-white/5 border border-white/8" : "bg-white/80 border border-gray-200 shadow-sm"} ${color}`}>
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Divider gradient */}
          <div className={`h-px w-full ${d ? "bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" : "bg-gradient-to-r from-transparent via-blue-200 to-transparent"}`} />
        </div>
      </div>

      {/* ─── FILTER TABS ─── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className={`w-3.5 h-3.5 shrink-0 ${d ? "text-white/30" : "text-gray-400"}`} />
          {KELAS_FILTERS.map(k => (
            <button
              key={k}
              onClick={() => { playPopSound(); setKelasFilter(k); }}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-bold transition-all duration-200 border ${
                kelasFilter === k
                  ? d
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                    : "bg-blue-600 text-white border-blue-600 shadow-md"
                  : d
                    ? "bg-white/4 text-white/50 border-white/8 hover:border-white/20 hover:text-white/70"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

          {/* ══════ LEFT ══════ */}
          <div className="flex flex-col gap-5" ref={playerRef}>

            {/* ── CINEMATIC PLAYER ── */}
            <motion.div
              key={currentVideo.playlistId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Outer glow ring */}
              <div className={`absolute -inset-[2px] rounded-3xl ${d ? `bg-gradient-to-br ${currentVideo.color} opacity-40 blur-sm` : "bg-gradient-to-br from-blue-300 to-cyan-200 opacity-50 blur-sm"}`} />

              {/* Player wrapper */}
              <div className={`relative rounded-3xl overflow-hidden ${d ? "bg-[#040b18]" : "bg-white"} shadow-2xl`}>
                {/* Top accent bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${currentVideo.color}`} />

                {/* Iframe */}
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={
                      currentVideo.id
                        ? `https://www.youtube.com/embed/${currentVideo.id}?list=${currentVideo.playlistId}&rel=0&modestbranding=1&color=white&iv_load_policy=3`
                        : `https://www.youtube.com/embed/videoseries?list=${currentVideo.playlistId}&rel=0&modestbranding=1&color=white&iv_load_policy=3`
                    }
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>

                {/* Bottom info strip */}
                <div className={`flex items-center justify-between gap-3 px-4 py-2.5 ${d ? "bg-[#040b18]/90" : "bg-gray-50/90"}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full ${d ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25" : "bg-blue-100 text-blue-600"}`}>
                      {currentVideo.kelas}
                    </span>
                    <span className={`text-[10px] font-body truncate ${d ? "text-white/35" : "text-gray-400"}`}>
                      {currentVideo.subject}
                    </span>
                  </div>
                  <span className={`text-[10px] font-display shrink-0 flex items-center gap-1 ${d ? "text-white/30" : "text-gray-400"}`}>
                    <Clock className="w-3 h-3" /> {currentVideo.duration}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ── VIDEO INFO CARD ── */}
            <motion.div
              key={`info-${currentVideo.playlistId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className={`rounded-2xl overflow-hidden ${d ? "bg-[#0a1428]/80 backdrop-blur border border-white/6" : "bg-white/95 backdrop-blur border border-gray-100 shadow-xl"}`}
            >
              <div className="p-5 md:p-6">
                {/* Title row */}
                <h2 className={`font-display text-xl md:text-2xl font-black leading-tight mb-1 ${d ? "text-white" : "text-gray-900"}`}>
                  {currentVideo.title}
                </h2>
                <p className={`font-body text-xs mb-4 ${d ? "text-white/35" : "text-gray-400"}`}>
                  {currentVideo.channel} · {currentVideo.date}
                </p>

                {/* Stats row */}
                <div className={`flex flex-wrap items-center gap-4 text-xs font-body pb-4 mb-4 border-b ${d ? "border-white/6 text-white/45" : "border-gray-100 text-gray-500"}`}>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> {currentVideo.views} ditonton
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {currentVideo.duration} durasi
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> {currentVideo.subject}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2.5 mb-5">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-display font-bold transition-all duration-200 ${
                      liked
                        ? d ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_16px_rgba(6,182,212,0.25)]" : "bg-blue-100 text-blue-700 border border-blue-300"
                        : d ? "bg-white/5 text-white/60 border border-white/8 hover:border-cyan-500/30 hover:text-cyan-300" : "bg-gray-100 text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                    {likeCount.toLocaleString()} Suka
                  </button>

                  <button
                    onClick={handleShare}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-display font-bold transition-all duration-200 ${
                      copied
                        ? d ? "bg-green-500/20 text-green-300 border border-green-500/40" : "bg-green-100 text-green-700 border border-green-300"
                        : d ? "bg-white/5 text-white/60 border border-white/8 hover:border-violet-500/30 hover:text-violet-300" : "bg-gray-100 text-gray-600 border border-gray-200 hover:border-violet-300 hover:text-violet-600"
                    }`}
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    {copied ? "Tersalin!" : "Bagikan"}
                  </button>
                </div>

                {/* Channel strip */}
                <div className={`flex items-center gap-3.5 p-3.5 rounded-xl mb-4 ${d ? "bg-white/4 border border-white/6" : "bg-gray-50 border border-gray-100"}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${currentVideo.color} shadow-lg`}>
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-display text-sm font-bold ${d ? "text-white" : "text-gray-900"}`}>{currentVideo.channel}</p>
                    <p className={`font-body text-xs ${d ? "text-white/35" : "text-gray-400"}`}>Pembelajaran Matematika SMP Interaktif</p>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-display font-bold px-2.5 py-1 rounded-lg ${d ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-blue-500"}`}>
                    <Star className="w-3 h-3 fill-current" /> Resmi
                  </div>
                </div>

                {/* Description accordion */}
                <div>
                  <button
                    onClick={() => { playPopSound(); setShowDesc(p => !p); }}
                    className={`w-full flex items-center justify-between text-xs font-display font-bold px-4 py-3 rounded-xl transition-all duration-200 ${d ? "bg-white/4 text-white/50 hover:bg-white/6 hover:text-white/70 border border-white/6" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"}`}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      {showDesc ? "Sembunyikan Deskripsi" : "Lihat Deskripsi Lengkap"}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showDesc ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showDesc && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className={`font-body text-sm leading-relaxed whitespace-pre-line mt-3 px-1 ${d ? "text-white/50" : "text-gray-500"}`}>
                          {currentVideo.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ══════ RIGHT SIDEBAR ══════ */}
          <div className="flex flex-col gap-4">

            {/* ── Playlist header ── */}
            <div className="flex items-center justify-between px-1">
              <span className={`font-display text-xs font-black tracking-widest uppercase flex items-center gap-2 ${d ? "text-cyan-400" : "text-blue-600"}`}>
                <Zap className="w-3.5 h-3.5" /> Episode
              </span>
              <span className={`text-[10px] font-body ${d ? "text-white/25" : "text-gray-400"}`}>
                {ALL_VIDEOS.length} Video Tersedia
              </span>
            </div>

            {/* ── Playlist items ── */}
            <div className="flex flex-col gap-2.5">
              {filteredVideos.length === 0 && (
                <p className={`text-xs font-body text-center py-6 ${d ? "text-white/25" : "text-gray-400"}`}>
                  Tidak ada video untuk kelas ini
                </p>
              )}
              {ALL_VIDEOS.map((vid, i) => {
                const isActive = i === activeIndex;
                return (
                  <motion.div
                    key={vid.playlistId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => handleSelectVideo(i)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-250 ${
                      isActive
                        ? d
                          ? "border border-cyan-500/50 shadow-[0_0_24px_rgba(6,182,212,0.18)] bg-[#071526]/90"
                          : "border border-blue-400 shadow-lg bg-blue-50"
                        : d
                          ? "border border-white/5 bg-[#0a1428]/60 hover:border-white/15 hover:bg-[#0d1a35]/80"
                          : "border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md"
                    }`}
                  >
                    {/* Active glow top */}
                    {isActive && (
                      <div className={`h-0.5 w-full bg-gradient-to-r ${vid.color}`} />
                    )}

                    <div className="flex gap-0 overflow-hidden">
                      {/* Thumbnail */}
                      <div className={`relative w-28 shrink-0 bg-gradient-to-br ${vid.color} flex items-center justify-center overflow-hidden`} style={{ aspectRatio: "16/10" }}>
                        <span className="text-3xl select-none drop-shadow-lg">{vid.emoji}</span>
                        {isActive ? (
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                            <div className={`w-8 h-8 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/15 backdrop-blur`}>
                              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                            </div>
                            <div className={`flex gap-0.5`}>
                              {[0, 1, 2].map(b => (
                                <div
                                  key={b}
                                  className="w-0.5 bg-white/80 rounded-full animate-bounce"
                                  style={{ height: `${8 + b * 3}px`, animationDelay: `${b * 0.12}s` }}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center bg-black/30 backdrop-blur">
                              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                        )}
                        {/* Number badge */}
                        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-md bg-black/60 backdrop-blur flex items-center justify-center">
                          <span className="text-white text-[9px] font-display font-bold">{i + 1}</span>
                        </div>
                        {/* Duration badge */}
                        <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur rounded-md px-1.5 py-0.5">
                          <span className="text-white text-[9px] font-display font-bold">{vid.duration}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 px-3 py-2.5 min-w-0 flex flex-col justify-center gap-1">
                        <p className={`font-display text-[11px] font-bold leading-tight line-clamp-2 ${isActive ? d ? "text-cyan-300" : "text-blue-700" : d ? "text-white/85" : "text-gray-800"}`}>
                          {vid.title}
                        </p>
                        <div className={`flex items-center gap-1.5 text-[10px] font-body ${d ? "text-white/30" : "text-gray-400"}`}>
                          <span>{vid.kelas}</span>
                          <span>·</span>
                          <Eye className="w-2.5 h-2.5" />
                          <span>{vid.views}</span>
                        </div>
                        {isActive && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-display font-bold w-fit ${d ? "bg-cyan-900/50 text-cyan-300" : "bg-blue-100 text-blue-700"}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            Sedang Diputar
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Coming soon divider ── */}
            <div className="flex items-center gap-2 px-1 mt-2">
              <div className={`h-px flex-1 ${d ? "bg-white/6" : "bg-gray-100"}`} />
              <span className={`text-[10px] font-display font-black tracking-widest uppercase flex items-center gap-1.5 ${d ? "text-amber-400/70" : "text-amber-500"}`}>
                <Clock className="w-3 h-3" /> Segera Hadir
              </span>
              <div className={`h-px flex-1 ${d ? "bg-white/6" : "bg-gray-100"}`} />
            </div>

            {/* ── Coming soon cards ── */}
            <div className="flex flex-col gap-2.5">
              {filteredComingSoon.map((vid, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (ALL_VIDEOS.length + i) * 0.06 }}
                  className={`relative rounded-2xl overflow-hidden cursor-not-allowed transition-all duration-200 ${d ? "border border-white/4 bg-[#0a1428]/40" : "border border-gray-100 bg-white/70"}`}
                  style={{ opacity: 0.55 }}
                  title="Segera tersedia"
                >
                  <div className="flex overflow-hidden">
                    <div className={`relative w-28 shrink-0 bg-gradient-to-br ${vid.color} flex items-center justify-center overflow-hidden`} style={{ aspectRatio: "16/10" }}>
                      <span className="text-3xl select-none drop-shadow-lg opacity-70">{vid.emoji}</span>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white/60 drop-shadow" />
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 bg-black/70 rounded-md px-1.5 py-0.5">
                        <span className="text-white text-[9px] font-display font-bold">{vid.duration}</span>
                      </div>
                    </div>
                    <div className="flex-1 px-3 py-2.5 min-w-0 flex flex-col justify-center gap-1">
                      <p className={`font-display text-[11px] font-bold leading-tight line-clamp-2 ${d ? "text-white/60" : "text-gray-700"}`}>
                        {vid.title}
                      </p>
                      <div className={`flex items-center gap-1.5 text-[10px] font-body ${d ? "text-white/25" : "text-gray-400"}`}>
                        <span>{vid.kelas}</span>
                        <span>·</span>
                        <Eye className="w-2.5 h-2.5" />
                        <span>{vid.views}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-display font-bold w-fit ${d ? "bg-amber-900/40 text-amber-400" : "bg-amber-100 text-amber-600"}`}>
                        <Clock className="w-2.5 h-2.5" /> Segera Hadir
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Footer teaser ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`mt-1 rounded-2xl p-4 text-center ${d ? "bg-gradient-to-br from-cyan-950/40 to-violet-950/40 border border-cyan-500/10" : "bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100"}`}
            >
              <div className="text-lg mb-1">🚀</div>
              <p className={`font-display text-xs font-bold mb-0.5 ${d ? "text-white/70" : "text-gray-700"}`}>
                Lebih banyak video sedang disiapkan!
              </p>
              <p className={`font-body text-[10px] leading-relaxed ${d ? "text-white/30" : "text-gray-400"}`}>
                Tim NUMATIK terus menghadirkan konten terbaik untukmu
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPembelajaranPage;
