import { useEffect, useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  Brain, ChevronRight, FileText, Lightbulb, BookOpen, Target,
  ChevronDown, ChevronUp, Info, Layers, Award, BarChart2, ExternalLink,
  Clock, Zap, CheckCircle2, Coffee, Pencil, AlertTriangle, Star, Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const tips = [
  {
    icon: BookOpen, color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/30",
    number: "01", title: "Pelajari Kisi-Kisi & Materi",
    desc: "Fokus pada materi yang sering muncul: Aljabar, Bilangan, Geometri, Statistika, dan Peluang. Kuasai rumus-rumus dasar dan pastikan kamu memahami konsepnya, bukan sekadar hafal.",
  },
  {
    icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30",
    number: "02", title: "Kelola Waktu dengan Cermat",
    desc: "TKA biasanya memiliki batas waktu ketat. Alokasikan rata-rata 1–2 menit per soal. Jika satu soal terlalu sulit, lewati dulu dan kembali lagi setelah semua soal yang mudah selesai dikerjakan.",
  },
  {
    icon: Target, color: "text-green-400", bg: "bg-green-400/10 border-green-400/30",
    number: "03", title: "Kerjakan Soal Mudah Terlebih Dahulu",
    desc: "Jangan terpaku pada soal yang sulit. Kerjakan soal yang kamu kuasai lebih dahulu untuk mengamankan poin. Setelah itu, baru kembali ke soal yang lebih menantang.",
  },
  {
    icon: Pencil, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30",
    number: "04", title: "Baca Soal dengan Teliti",
    desc: "Pastikan kamu memahami apa yang ditanyakan sebelum menjawab. Banyak kesalahan terjadi karena terburu-buru membaca soal. Perhatikan kata kunci seperti 'bukan', 'kecuali', atau 'paling besar'.",
  },
  {
    icon: Zap, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30",
    number: "05", title: "Gunakan Teknik Eliminasi",
    desc: "Jika ragu pada pilihan jawaban, gunakan teknik eliminasi — singkirkan pilihan yang jelas salah terlebih dahulu. Dengan mempersempit pilihan, peluangmu menjawab dengan benar menjadi lebih besar.",
  },
  {
    icon: Brain, color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/30",
    number: "06", title: "Latihan Soal Secara Rutin",
    desc: "Biasakan mengerjakan soal-soal TKA dari tahun sebelumnya. Semakin sering berlatih, semakin cepat dan tepat kamu dalam memahami pola soal dan menemukan strategi penyelesaiannya.",
  },
  {
    icon: Coffee, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30",
    number: "07", title: "Istirahat Cukup Sebelum Tes",
    desc: "Tidur yang cukup (7–8 jam) sebelum hari ujian sangat penting. Otak yang segar akan membantu kamu berpikir lebih jernih, berkonsentrasi lebih baik, dan mengingat materi dengan lebih mudah.",
  },
  {
    icon: CheckCircle2, color: "text-teal-400", bg: "bg-teal-400/10 border-teal-400/30",
    number: "08", title: "Periksa Kembali Jawaban",
    desc: "Jika masih ada waktu tersisa, gunakan untuk mengecek ulang jawaban — terutama soal yang kamu ragu. Kesalahan kecil seperti salah hitung atau salah baca sering bisa diperbaiki di tahap ini.",
  },
  {
    icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10 border-red-400/30",
    number: "09", title: "Tetap Tenang & Jangan Panik",
    desc: "Rasa cemas adalah hal wajar. Tarik napas dalam-dalam dan percaya pada kemampuanmu. Kepanikan hanya akan menghambat konsentrasi. Fokus satu soal pada satu waktu.",
  },
  {
    icon: Star, color: "text-indigo-400", bg: "bg-indigo-400/10 border-indigo-400/30",
    number: "10", title: "Persiapkan Diri Sejak Jauh Hari",
    desc: "Jangan belajar semalam sebelum ujian (SKS — Sistem Kebut Semalam). Mulailah mempersiapkan diri minimal 2–3 minggu sebelum tes agar materi lebih meresap dan kamu tidak kelelahan.",
  },
];

const packages = [
  { id: 1, label: "Try Out 1", path: "/tka/paket-1", soal: 30 },
  { id: 2, label: "Try Out 2", path: "/tka/paket-2", soal: 30 },
  { id: 3, label: "Try Out 3", path: "/tka/paket-3", soal: 30 },
  { id: 4, label: "Try Out 4", path: "/tka/paket-4", soal: 30 },
  { id: 5, label: "Try Out 5", path: "/tka/paket-5", soal: 30 },
];

const routes: Record<string, string> = {
  "Bilangan Bulat": "/tka/modul-pemantapan/bilangan-bulat",
  "Bilangan Rasional": "/tka/modul-pemantapan/bilangan-rasional",
  "KPK dan FPB": "/tka/modul-pemantapan/kpk-fpb",
  "Aljabar": "/tka/modul-pemantapan/aljabar",
  "Persamaan & Pertidaksamaan LSV": "/tka/modul-pemantapan/plsv",
  "Perbandingan": "/tka/modul-pemantapan/perbandingan",
  "Aritmetika Sosial": "/tka/modul-pemantapan/aritmetika-sosial",
  "Himpunan": "/tka/modul-pemantapan/himpunan",
  "Garis dan Sudut": "/tka/modul-pemantapan/garis-sudut",
  "Segitiga & Segiempat": "/tka/modul-pemantapan/segitiga-segiempat",
  "Pola Bilangan": "/tka/modul-pemantapan/pola-bilangan",
  "Koordinat Kartesius": "/tka/modul-pemantapan/koordinat-cartesius",
  "Relasi dan Fungsi": "/tka/modul-pemantapan/relasi-fungsi",
  "Persamaan Garis": "/tka/modul-pemantapan/persamaan-garis",
  "Sistem Persamaan Linear Dua Variabel": "/tka/modul-pemantapan/spldv",
  "Teorema Pythagoras": "/tka/modul-pemantapan/teorema-pythagoras",
  "Lingkaran": "/tka/modul-pemantapan/lingkaran",
  "Bangun Ruang Sisi Datar": "/tka/modul-pemantapan/bangun-ruang-sisi-datar",
  "Bilangan Berpangkat": "/tka/modul-pemantapan/bilangan-berpangkat",
  "Bilangan Irasional": "/tka/modul-pemantapan/bilangan-irasional",
  "Modulo & Sisa Pembagian": "/tka/modul-pemantapan/modulo",
  "Persamaan Kuadrat": "/tka/modul-pemantapan/persamaan-kuadrat",
  "Fungsi Kuadrat": "/tka/modul-pemantapan/fungsi-kuadrat",
  "Kesebangunan & Kekongruenan": "/tka/modul-pemantapan/kesebangunan",
  "Transformasi Geometri": "/tka/modul-pemantapan/transformasi-geometri",
  "Bangun Ruang Sisi Lengkung": "/tka/modul-pemantapan/bangun-ruang-sisi-lengkung",
  "Statistika": "/tka/modul-pemantapan/statistika",
  "Peluang": "/tka/modul-pemantapan/peluang",
};

type Topic = { name: string; emoji: string };
type Kelas = {
  label: string; grade: string; accent: string; glow: string;
  headerBg: string; headerBorder: string; badgeBg: string; badgeText: string;
  iconBg: string; topics: Topic[];
};

const kelasList: Kelas[] = [
  {
    label: "Kelas 7", grade: "VII", accent: "#fbbf24", glow: "rgba(251,191,36,0.18)",
    headerBg: "linear-gradient(135deg,rgba(251,191,36,0.18) 0%,rgba(245,158,11,0.08) 100%)",
    headerBorder: "rgba(251,191,36,0.35)", badgeBg: "rgba(251,191,36,0.18)",
    badgeText: "#fde68a", iconBg: "rgba(251,191,36,0.12)",
    topics: [
      { name: "Bilangan Bulat", emoji: "🔵" },
      { name: "Bilangan Rasional", emoji: "⅔" },
      { name: "KPK dan FPB", emoji: "÷" },
      { name: "Himpunan", emoji: "⊂" },
      { name: "Aljabar", emoji: "𝑥" },
      { name: "Persamaan & Pertidaksamaan LSV", emoji: "=" },
      { name: "Perbandingan", emoji: "∶" },
      { name: "Aritmetika Sosial", emoji: "💰" },
      { name: "Garis dan Sudut", emoji: "∠" },
      { name: "Segitiga & Segiempat", emoji: "◻" },
    ],
  },
  {
    label: "Kelas 8", grade: "VIII", accent: "#22d3ee", glow: "rgba(34,211,238,0.18)",
    headerBg: "linear-gradient(135deg,rgba(34,211,238,0.18) 0%,rgba(6,182,212,0.08) 100%)",
    headerBorder: "rgba(34,211,238,0.35)", badgeBg: "rgba(34,211,238,0.18)",
    badgeText: "#a5f3fc", iconBg: "rgba(34,211,238,0.12)",
    topics: [
      { name: "Pola Bilangan", emoji: "…" },
      { name: "Koordinat Kartesius", emoji: "⊹" },
      { name: "Relasi dan Fungsi", emoji: "↦" },
      { name: "Persamaan Garis", emoji: "📈" },
      { name: "Sistem Persamaan Linear Dua Variabel", emoji: "xy" },
      { name: "Teorema Pythagoras", emoji: "△" },
      { name: "Lingkaran", emoji: "○" },
      { name: "Bangun Ruang Sisi Datar", emoji: "⬡" },
    ],
  },
  {
    label: "Kelas 9", grade: "IX", accent: "#a78bfa", glow: "rgba(167,139,250,0.18)",
    headerBg: "linear-gradient(135deg,rgba(167,139,250,0.18) 0%,rgba(139,92,246,0.08) 100%)",
    headerBorder: "rgba(167,139,250,0.35)", badgeBg: "rgba(167,139,250,0.18)",
    badgeText: "#ddd6fe", iconBg: "rgba(167,139,250,0.12)",
    topics: [
      { name: "Bilangan Berpangkat", emoji: "²ⁿ" },
      { name: "Bilangan Irasional", emoji: "√" },
      { name: "Modulo & Sisa Pembagian", emoji: "%" },
      { name: "Persamaan Kuadrat", emoji: "²" },
      { name: "Fungsi Kuadrat", emoji: "∪" },
      { name: "Kesebangunan & Kekongruenan", emoji: "≅" },
      { name: "Transformasi Geometri", emoji: "↻" },
      { name: "Bangun Ruang Sisi Lengkung", emoji: "⬤" },
      { name: "Statistika", emoji: "📉" },
      { name: "Peluang", emoji: "🎲" },
    ],
  },
];

const InfoSection = ({
  id, open, onToggle, icon, title, accent, children,
}: {
  id: string; open: boolean; onToggle: (id: string) => void;
  icon: React.ReactNode; title: string; accent: string; children: React.ReactNode;
}) => (
  <div className={`rounded-xl overflow-hidden border transition-all duration-200 ${open ? `border-${accent}-400/40` : "border-white/10"} bg-white/5 backdrop-blur`}>
    <button
      onClick={() => { playPopSound(); onToggle(id); }}
      className="w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-body text-sm font-semibold text-white">{title}</span>
      </div>
      {open
        ? <ChevronUp className={`w-4 h-4 text-${accent}-400`} />
        : <ChevronDown className="w-4 h-4 text-white/30" />}
    </button>
    {open && <div className="px-4 pb-4">{children}</div>}
  </div>
);

const SectionToggleHeader = ({
  label, color, open, onToggle,
}: {
  label: string; color: string; open: boolean; onToggle: () => void;
}) => (
  <button
    onClick={() => { playPopSound(); onToggle(); }}
    className="w-full flex items-center gap-2 mb-3 px-1 group cursor-pointer"
  >
    <div className="h-px flex-1 bg-white/10 group-hover:bg-white/20 transition-colors" />
    <div className={`flex items-center gap-1.5 ${!open ? "animate-pulse" : ""}`}>
      <span className={`text-xs font-body font-semibold tracking-widest uppercase ${color}`}>{label}</span>
      {open
        ? <ChevronUp className={`w-3.5 h-3.5 ${color}`} />
        : <ChevronDown className={`w-3.5 h-3.5 ${color} opacity-60`} />}
    </div>
    <div className="h-px flex-1 bg-white/10 group-hover:bg-white/20 transition-colors" />
  </button>
);

const TKAPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isWhite = theme === "white";
  const [infoOpen, setInfoOpen] = useState<string[]>([]);
  const [showTentang, setShowTentang] = useState(false);
  const [showModul, setShowModul] = useState(false);
  const [showPaket, setShowPaket] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const toggleInfo = (id: string) =>
    setInfoOpen(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleTopicClick = (name: string) => {
    const path = routes[name];
    if (path) { playPopSound(); navigate(path); }
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-2xl w-full px-4 py-10">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/10">
            <Brain className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-1 text-center tracking-wide">
            TES KEMAMPUAN AKADEMIK
          </h1>
          <p className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center tracking-wider mb-2 animate-pulse">
            TAHUN AJARAN 2026 - 2027
          </p>
          <p className="text-white/50 text-xs text-center font-body max-w-xs">
            Pemantapan &amp; Persiapan TKA — Matematika Kelas IX
          </p>
          <div className="mt-4 flex gap-5 items-center">
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <FileText className="w-3.5 h-3.5" />
              <span>5 Try Out</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <Target className="w-3.5 h-3.5" />
              <span>150 Soal Total</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kelas IX</span>
            </div>
          </div>
        </div>

        {/* ── TENTANG TKA (toggle) ── */}
        <div className="mb-6 animate-slide-up">
          <button
            onClick={() => { playPopSound(); setShowTentang(v => !v); }}
            className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer mb-3
              ${showTentang
                ? "bg-violet-500/20 border-violet-400/60 shadow-md shadow-violet-500/10"
                : "bg-violet-500/10 border-violet-400/30 hover:bg-violet-500/15 hover:border-violet-400/50"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-400/40 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-violet-300" />
              </div>
              <span className="font-display text-sm font-bold text-violet-200 tracking-wide uppercase">Tentang TKA</span>
              <span className="text-[10px] font-body text-violet-400/70 bg-violet-500/10 border border-violet-400/20 px-2 py-0.5 rounded-full">4 Subtopik</span>
            </div>
            {showTentang
              ? <ChevronUp className="w-4 h-4 text-violet-300" />
              : <ChevronDown className="w-4 h-4 text-violet-300/60" />}
          </button>

          {showTentang && (
            <div className="flex flex-col gap-2.5">
              <InfoSection id="definisi" open={infoOpen.includes("definisi")} onToggle={toggleInfo}
                icon={<Info className="w-4 h-4 text-cyan-400 shrink-0" />}
                title="Definisi Tes Kemampuan Akademik"
                accent="cyan">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Sebagaimana TKA Matematika SD/MI/sederajat, TKA Matematika SMP/MTs/sederajat juga mengukur kemampuan murid dalam memahami <strong className="text-cyan-300">fakta, konsep, prinsip, dan prosedur matematika</strong>, serta kemampuan mereka dalam menerapkan pengetahuan matematika untuk menyelesaikan masalah <strong className="text-cyan-300">(problem solving)</strong>.
                </p>
              </InfoSection>

              <InfoSection id="muatan" open={infoOpen.includes("muatan")} onToggle={toggleInfo}
                icon={<Layers className="w-4 h-4 text-violet-400 shrink-0" />}
                title="Muatan Tes Kemampuan Akademik"
                accent="violet">
                <div className="space-y-3">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Muatan TKA Matematika SMP/MTs/sederajat merujuk pada elemen kurikulum atau materi matematika yang dipelajari murid yang ada pada <strong className="text-violet-300">Kurikulum 2013</strong> dan <strong className="text-violet-300">Kurikulum Merdeka</strong>. Elemen ini meliputi:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Bilangan", icon: "🔢", color: "blue" },
                      { label: "Aljabar", icon: "🔣", color: "purple" },
                      { label: "Geometri dan Pengukuran", icon: "📐", color: "green" },
                      { label: "Data dan Peluang", icon: "📊", color: "orange" },
                    ].map(e => (
                      <div key={e.label} className={`bg-${e.color}-500/10 border border-${e.color}-500/20 rounded-lg px-3 py-2.5 flex items-center gap-2`}>
                        <span className="text-base">{e.icon}</span>
                        <span className="font-body text-xs text-white/80 font-semibold">{e.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-xs text-white/55 leading-relaxed">
                    Penggunaan logika matematika diintegrasikan langsung dengan elemen matematika yang tertera dalam kurikulum. Pengetahuan matematika diukur melalui permasalahan dalam konteks matematika dan permasalahan dalam konteks keseharian yang dapat meliputi kejadian atau situasi di lingkup personal, keluarga, atau lingkungan sekitar yang bersifat lokal.
                  </p>
                </div>
              </InfoSection>

              <InfoSection id="kompetensi" open={infoOpen.includes("kompetensi")} onToggle={toggleInfo}
                icon={<Award className="w-4 h-4 text-amber-400 shrink-0" />}
                title="Kompetensi"
                accent="amber">
                <div className="space-y-3">
                  <p className="font-body text-xs text-white/50 leading-relaxed">
                    TKA Matematika SMP/MTs mengukur tiga level kompetensi kognitif berikut:
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-amber-500/15 border-b border-white/10">
                          <th className="text-left px-3 py-2.5 text-amber-300 font-bold">Level Kognitif</th>
                          <th className="text-left px-3 py-2.5 text-amber-300 font-bold">Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { level: "Memahami", desc: "Menguasai fakta, konsep, prinsip, dan prosedur matematika; mengenali, mengidentifikasi, dan mengklasifikasikan situasi atau representasi matematika." },
                          { level: "Mengaplikasikan", desc: "Menerapkan pengetahuan matematika pada situasi atau konteks yang diberikan; memilih dan menggunakan cara penyelesaian yang sesuai." },
                          { level: "Bernalar Tinggi", desc: "Memecahkan masalah non-rutin; menganalisis, mengevaluasi, membuat generalisasi, menyusun argumen, dan menarik kesimpulan secara logis." },
                        ].map((r, i) => (
                          <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/3" : ""}`}>
                            <td className="px-3 py-2.5 font-bold text-amber-200 whitespace-nowrap align-top">{r.level}</td>
                            <td className="px-3 py-2.5 text-white/70 leading-relaxed">{r.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-amber-500/15 border-b border-white/10">
                          <th className="text-left px-3 py-2.5 text-amber-300 font-bold">Bentuk Soal</th>
                          <th className="text-left px-3 py-2.5 text-amber-300 font-bold">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { bentuk: "Pilihan Ganda Sederhana (PGS)", ket: "Hanya memiliki satu jawaban benar." },
                          { bentuk: "Pilihan Ganda Kompleks MCMA", ket: "Bisa memiliki lebih dari satu jawaban benar." },
                          { bentuk: "Pilihan Ganda Kompleks Kategori", ket: "Berisi beberapa pernyataan yang semuanya harus diberi respons (benar/salah, sesuai/tidak sesuai)." },
                        ].map((r, i) => (
                          <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/3" : ""}`}>
                            <td className="px-3 py-2.5 font-semibold text-white/80 whitespace-nowrap align-top">{r.bentuk}</td>
                            <td className="px-3 py-2.5 text-white/60 leading-relaxed">{r.ket}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <a
                    href="https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/smp"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400/70 hover:text-amber-300 transition-colors font-body"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat sumber resmi Pusmendik
                  </a>
                </div>
              </InfoSection>

              <InfoSection id="matriks" open={infoOpen.includes("matriks")} onToggle={toggleInfo}
                icon={<BarChart2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                title="Matriks Asesmen"
                accent="emerald">
                <div className="space-y-3">
                  <p className="font-body text-xs text-white/50 leading-relaxed">
                    Distribusi muatan materi TKA Matematika SMP/MTs berdasarkan elemen kurikulum dan sub-materinya:
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-emerald-500/15 border-b border-white/10">
                          <th className="text-center px-2 py-2.5 text-emerald-300 font-bold w-8">No</th>
                          <th className="text-left px-3 py-2.5 text-emerald-300 font-bold">Elemen</th>
                          <th className="text-left px-3 py-2.5 text-emerald-300 font-bold">Sub Elemen / Sub Materi</th>
                          <th className="text-left px-3 py-2.5 text-emerald-300 font-bold">Kompetensi yang Diukur</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { no: 1, elemen: "Bilangan", sub: "Bilangan Real", kompetensi: "Memahami, mengaplikasikan, dan bernalar tinggi untuk: (a) perbandingan & sifat bilangan; (b) operasi aritmetika; (c) estimasi; (d) faktorisasi prima; (e) rasio — skala, proporsi, laju perubahan; (f) perbandingan senilai & berbalik nilai.", color: "blue" },
                          { no: 2, elemen: "Aljabar", sub: "Persamaan & Pertidaksamaan Linear", kompetensi: "Persamaan linear satu variabel; persamaan & pertidaksamaan linear; sistem persamaan linear dua variabel (SPLDV).", color: "purple" },
                          { no: 3, elemen: "Aljabar", sub: "Fungsi & Relasi", kompetensi: "Konsep fungsi, relasi, dan grafik fungsi linear.", color: "purple" },
                          { no: 4, elemen: "Aljabar", sub: "Pola & Barisan", kompetensi: "Pola bilangan, barisan aritmetika, dan barisan geometri.", color: "purple" },
                          { no: 5, elemen: "Geometri & Pengukuran", sub: "Bangun Datar & Bangun Ruang", kompetensi: "Luas, keliling, volume bangun datar dan ruang; teorema Pythagoras; kesebangunan dan kekongruenan.", color: "green" },
                          { no: 6, elemen: "Geometri & Pengukuran", sub: "Transformasi Geometri", kompetensi: "Translasi, refleksi, rotasi, dan dilatasi.", color: "green" },
                          { no: 7, elemen: "Data & Peluang", sub: "Statistika Dasar", kompetensi: "Mean, median, modus; penyajian data dalam tabel dan diagram.", color: "orange" },
                          { no: 8, elemen: "Data & Peluang", sub: "Peluang", kompetensi: "Peluang kejadian sederhana dan majemuk.", color: "orange" },
                        ].map((r, i) => (
                          <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/3" : ""}`}>
                            <td className="px-2 py-2.5 text-center text-white/40 align-top">{r.no}</td>
                            <td className={`px-3 py-2.5 font-bold text-${r.color}-300 whitespace-nowrap align-top`}>{r.elemen}</td>
                            <td className="px-3 py-2.5 text-white/80 font-semibold align-top whitespace-nowrap">{r.sub}</td>
                            <td className="px-3 py-2.5 text-white/60 leading-relaxed">{r.kompetensi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2.5">
                    <p className="font-body text-xs text-white/60 leading-relaxed">
                      <strong className="text-emerald-300">Catatan:</strong> Tidak ada perbedaan antara soal TKA Kurikulum Merdeka dan Kurikulum 2013, karena penyusunan soal TKA sudah mempertimbangkan materi dari kedua kurikulum tersebut.
                    </p>
                  </div>
                  <a
                    href="https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/smp"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400/70 hover:text-emerald-300 transition-colors font-body"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat sumber resmi Pusmendik
                  </a>
                </div>
              </InfoSection>
            </div>
          )}
        </div>

        {/* ── Soal TKA Asli 2025 ── */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          <button
            onClick={() => { playPopSound(); navigate("/tka/soal-asli-2025"); }}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl border cursor-pointer
              bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-orange-500/10
              border-amber-400/50 hover:border-amber-400/80
              hover:from-amber-500/30 hover:via-yellow-500/15 hover:to-orange-500/15
              shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20
              transition-all duration-200 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-400/50 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-left">
                <span className="font-display text-sm font-bold text-amber-100 tracking-wide block leading-tight">
                  SOAL DAN PEMBAHASAN TKA MATEMATIKA 2025 - 2026
                </span>
                <span className="text-[10px] font-body text-amber-400/70 leading-none">30 Soal · Soal Resmi · Tahun 2025</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-flex text-[10px] font-body font-bold text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-full tracking-wider">
                ASLI
              </span>
              <ChevronRight className="w-4 h-4 text-amber-300" />
            </div>
          </button>
        </div>

        {/* ── Modul Pemantapan (toggle) ── */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.10s" }}>
          <button
            onClick={() => { playPopSound(); setShowModul(v => !v); }}
            className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer mb-3
              ${showModul
                ? "bg-emerald-500/20 border-emerald-400/60 shadow-md shadow-emerald-500/10"
                : "bg-emerald-500/10 border-emerald-400/30 hover:bg-emerald-500/15 hover:border-emerald-400/50"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="font-display text-sm font-bold text-emerald-200 tracking-wide uppercase">Modul Pemantapan</span>
              <span className="text-[10px] font-body text-emerald-400/70 bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">28 Topik</span>
            </div>
            {showModul
              ? <ChevronUp className="w-4 h-4 text-emerald-300" />
              : <ChevronDown className="w-4 h-4 text-emerald-300/60" />}
          </button>

          {showModul && <div className="flex flex-col gap-4">
            {kelasList.map((kelas) => (
              <div key={kelas.label} className="rounded-2xl overflow-hidden"
                style={{
                  border: `1px solid ${isWhite ? "rgba(0,119,182,0.2)" : kelas.headerBorder}`,
                  boxShadow: `0 4px 24px ${isWhite ? "rgba(0,119,182,0.08)" : kelas.glow}`,
                  background: isWhite ? "var(--bg-card)" : "rgba(10,10,30,0.7)",
                }}>

                {/* Section header */}
                <div className="flex items-center gap-4 px-4 py-3"
                  style={{ background: isWhite ? "var(--bg-secondary)" : kelas.headerBg, borderBottom: `1px solid ${isWhite ? "rgba(0,119,182,0.15)" : kelas.headerBorder}` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-display font-black text-base"
                    style={{ background: kelas.iconBg, border: `1.5px solid ${kelas.headerBorder}`, color: kelas.accent }}>
                    {kelas.grade}
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm font-bold text-white">{kelas.label}</p>
                    <p className="font-body text-[10px]" style={{ color: kelas.accent, opacity: 0.7 }}>
                      {kelas.topics.length} topik materi
                    </p>
                  </div>
                  <span className="font-body text-[9px] font-bold px-2 py-1 rounded-full tracking-widest uppercase"
                    style={{ background: kelas.badgeBg, color: kelas.badgeText, border: `1px solid ${kelas.headerBorder}` }}>
                    ✦ MATERI & LATIHAN
                  </span>
                </div>

                {/* Topics list */}
                <div className="px-2.5 py-2.5 flex flex-col gap-1">
                  {kelas.topics.map((topic, ti) => {
                    const hasRoute = !!routes[topic.name];
                    return (
                      <button
                        key={topic.name}
                        onClick={() => handleTopicClick(topic.name)}
                        disabled={!hasRoute}
                        className={`group flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-all duration-200
                          ${hasRoute ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0" : "cursor-not-allowed opacity-35"}`}
                        style={hasRoute ? {
                          background: isWhite ? "var(--bg-secondary)" : "rgba(255,255,255,0.04)",
                          border: isWhite ? "1px solid rgba(0,119,182,0.12)" : "1px solid rgba(255,255,255,0.07)",
                        } : {
                          background: isWhite ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
                          border: isWhite ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.04)",
                        }}
                        onMouseEnter={e => {
                          if (hasRoute) {
                            (e.currentTarget as HTMLButtonElement).style.background = kelas.iconBg;
                            (e.currentTarget as HTMLButtonElement).style.border = `1px solid ${kelas.headerBorder}`;
                          }
                        }}
                        onMouseLeave={e => {
                          if (hasRoute) {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                            (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.07)";
                          }
                        }}
                      >
                        <span className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center font-display font-bold text-[9px]"
                          style={{ background: kelas.iconBg, color: kelas.accent, border: `1px solid ${kelas.headerBorder}` }}>
                          {ti + 1}
                        </span>
                        <span className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                          style={{ background: isWhite ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.3)", border: isWhite ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.06)" }}>
                          {topic.emoji}
                        </span>
                        <span className="flex-1 font-body text-sm font-medium leading-snug text-white/80 group-hover:text-white transition-colors">
                          {topic.name}
                        </span>
                        {hasRoute && (
                          <svg className="w-3.5 h-3.5 shrink-0 transition-all duration-200 group-hover:translate-x-1"
                            style={{ color: kelas.accent, opacity: 0.5 }}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>}
        </div>

        {/* ── Paket Latihan (toggle) ── */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.20s" }}>
          <button
            onClick={() => { playPopSound(); setShowPaket(v => !v); }}
            className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer mb-3
              ${showPaket
                ? "bg-cyan-500/20 border-cyan-400/60 shadow-md shadow-cyan-500/10"
                : "bg-cyan-500/10 border-cyan-400/30 hover:bg-cyan-500/15 hover:border-cyan-400/50"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-cyan-300" />
              </div>
              <span className="font-display text-sm font-bold text-cyan-200 tracking-wide uppercase">Try Out</span>
              <span className="text-[10px] font-body text-cyan-400/70 bg-cyan-500/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">5 Paket</span>
            </div>
            {showPaket
              ? <ChevronUp className="w-4 h-4 text-cyan-300" />
              : <ChevronDown className="w-4 h-4 text-cyan-300/60" />}
          </button>

          {showPaket && (
            <div className="flex flex-col gap-2.5">
              {packages.map((pkg, i) => (
                <button
                  key={pkg.id}
                  onClick={() => { playPopSound(); navigate(pkg.path); }}
                  className="group flex items-center gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3.5
                    hover:bg-cyan-500/8 hover:border-cyan-400/40 hover:shadow-md hover:shadow-cyan-500/5
                    transition-all duration-250 cursor-pointer text-left animate-slide-up"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0
                    bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors">
                    <span className="font-display text-[10px] text-cyan-400/60 leading-none">No.</span>
                    <span className="font-display text-base font-bold text-cyan-300 leading-tight">{String(pkg.id).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-white/30 font-body uppercase tracking-wider">Try Out TKA</span>
                    <p className="font-body text-sm font-semibold text-white group-hover:text-cyan-100 transition-colors truncate">
                      {pkg.label}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="text-[10px] text-white/30 font-body">Jumlah Soal</span>
                    <span className="text-sm font-bold font-body text-cyan-300">{pkg.soal}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Tips & Panduan ── */}
        <div className="animate-slide-up" style={{ animationDelay: "0.30s" }}>
          <button
            onClick={() => { playPopSound(); setShowTips(v => !v); }}
            className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer mb-3
              ${showTips
                ? "bg-amber-500/20 border-amber-400/60 shadow-md shadow-amber-500/10"
                : "bg-amber-500/10 border-amber-400/30 hover:bg-amber-500/15 hover:border-amber-400/50"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-display text-sm font-bold text-amber-200 tracking-wide uppercase">Tips &amp; Panduan</span>
              <span className="text-[10px] font-body text-amber-400/70 bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded-full">10 Tips</span>
            </div>
            {showTips
              ? <ChevronUp className="w-4 h-4 text-amber-300" />
              : <ChevronDown className="w-4 h-4 text-amber-300/60" />}
          </button>

          {showTips && (
            <div className="flex flex-col gap-3">
              {tips.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={i}
                    className={`flex gap-4 bg-card/70 backdrop-blur border rounded-2xl p-4 animate-slide-up ${tip.bg}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${tip.bg}`}>
                      <Icon className={`w-5 h-5 ${tip.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-display text-xs font-bold ${tip.color} opacity-70`}>{tip.number}</span>
                        <h3 className={`font-display text-sm font-bold ${tip.color}`}>{tip.title}</h3>
                      </div>
                      <p className="text-white/70 text-xs font-body leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                );
              })}
              <div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-accent/10 border border-primary/20 p-4 text-center">
                <p className="font-display text-sm font-bold text-primary text-glow-cyan mb-1">🚀 Kamu Pasti Bisa!</p>
                <p className="text-white/60 text-xs font-body">Persiapan matang + mental kuat = hasil terbaik. Tetap semangat, Sobat Numatik!</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKAPage;
