import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import {
  Clock,
  Brain,
  Target,
  Zap,
  BookOpen,
  CheckCircle2,
  Coffee,
  Pencil,
  AlertTriangle,
  Star,
} from "lucide-react";

const tips = [
  {
    icon: BookOpen,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/30",
    number: "01",
    title: "Pelajari Kisi-Kisi & Materi",
    desc: "Fokus pada materi yang sering muncul: Aljabar, Bilangan, Geometri, Statistika, dan Peluang. Kuasai rumus-rumus dasar dan pastikan kamu memahami konsepnya, bukan sekadar hafal.",
  },
  {
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/30",
    number: "02",
    title: "Kelola Waktu dengan Cermat",
    desc: "TKA biasanya memiliki batas waktu ketat. Alokasikan rata-rata 1–2 menit per soal. Jika satu soal terlalu sulit, lewati dulu dan kembali lagi setelah semua soal yang mudah selesai dikerjakan.",
  },
  {
    icon: Target,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/30",
    number: "03",
    title: "Kerjakan Soal Mudah Terlebih Dahulu",
    desc: "Jangan terpaku pada soal yang sulit. Kerjakan soal yang kamu kuasai lebih dahulu untuk mengamankan poin. Setelah itu, baru kembali ke soal yang lebih menantang.",
  },
  {
    icon: Pencil,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/30",
    number: "04",
    title: "Baca Soal dengan Teliti",
    desc: "Pastikan kamu memahami apa yang ditanyakan sebelum menjawab. Banyak kesalahan terjadi karena terburu-buru membaca soal. Perhatikan kata kunci seperti 'bukan', 'kecuali', atau 'paling besar'.",
  },
  {
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/30",
    number: "05",
    title: "Gunakan Teknik Eliminasi",
    desc: "Jika ragu pada pilihan jawaban, gunakan teknik eliminasi — singkirkan pilihan yang jelas salah terlebih dahulu. Dengan mempersempit pilihan, peluangmu menjawab dengan benar menjadi lebih besar.",
  },
  {
    icon: Brain,
    color: "text-pink-400",
    bg: "bg-pink-400/10 border-pink-400/30",
    number: "06",
    title: "Latihan Soal Secara Rutin",
    desc: "Biasakan mengerjakan soal-soal TKA dari tahun sebelumnya. Semakin sering berlatih, semakin cepat dan tepat kamu dalam memahami pola soal dan menemukan strategi penyelesaiannya.",
  },
  {
    icon: Coffee,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/30",
    number: "07",
    title: "Istirahat Cukup Sebelum Tes",
    desc: "Tidur yang cukup (7–8 jam) sebelum hari ujian sangat penting. Otak yang segar akan membantu kamu berpikir lebih jernih, berkonsentrasi lebih baik, dan mengingat materi dengan lebih mudah.",
  },
  {
    icon: CheckCircle2,
    color: "text-teal-400",
    bg: "bg-teal-400/10 border-teal-400/30",
    number: "08",
    title: "Periksa Kembali Jawaban",
    desc: "Jika masih ada waktu tersisa, gunakan untuk mengecek ulang jawaban — terutama soal yang kamu ragu. Kesalahan kecil seperti salah hitung atau salah baca sering bisa diperbaiki di tahap ini.",
  },
  {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
    number: "09",
    title: "Tetap Tenang & Jangan Panik",
    desc: "Rasa cemas adalah hal wajar. Tarik napas dalam-dalam dan percaya pada kemampuanmu. Kepanikan hanya akan menghambat konsentrasi. Fokus satu soal pada satu waktu.",
  },
  {
    icon: Star,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10 border-indigo-400/30",
    number: "10",
    title: "Persiapkan Diri Sejak Jauh Hari",
    desc: "Jangan belajar semalam sebelum ujian (SKS — Sistem Kebut Semalam). Mulailah mempersiapkan diri minimal 2–3 minggu sebelum tes agar materi lebih meresap dan kamu tidak kelelahan.",
  },
];

const TKATipsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/tka" />

      <div className="relative z-10 max-w-2xl w-full px-4 pt-10 pb-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 mb-4">
            <Star className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2">
            TIPS MENGHADAPI TKA
          </h1>
          <p className="text-white/50 text-sm font-body max-w-md mx-auto">
            Strategi jitu agar kamu tampil percaya diri dan maksimal saat menghadapi Tes Kemampuan Akademik
          </p>
        </div>

        {/* Tips Cards */}
        <div className="flex flex-col gap-4">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div
                key={i}
                className={`flex gap-4 bg-card/70 backdrop-blur border rounded-2xl p-5 animate-slide-up ${tip.bg}`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border ${tip.bg}`}>
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
        </div>

        {/* Motivational Banner */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-accent/10 border border-primary/20 p-5 text-center">
          <p className="font-display text-base font-bold text-primary text-glow-cyan mb-1">
            🚀 Kamu Pasti Bisa!
          </p>
          <p className="text-white/60 text-xs font-body">
            Persiapan matang + mental kuat = hasil terbaik. Tetap semangat, Sobat Numatik!
          </p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/tka"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke TKA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKATipsPage;
