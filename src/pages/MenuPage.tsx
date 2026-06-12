import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Info,
  BookMarked,
  Heart,
  User,
  Trophy,
  Brain,
  FileText,
  Bot,
  Settings,
  Calculator,
  PlayCircle,
  ClipboardCheck,
  ClipboardList,
  Gamepad2,
  BookOpen,
  ArrowLeftRight,
  Sigma,
  Rocket,
  Zap,
  GraduationCap,
} from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const menuItems = [
  { label: "PETUNJUK PENGGUNAAN", icon: Info, path: "/petunjuk", desc: "Panduan penggunaan" },
  { label: "RUANG UNTUK GURU", icon: GraduationCap, path: "/ruang-untuk-guru", desc: "Ruang khusus untuk para pendidik" },
  { label: "BUKU ANIMASI MATEMATIKA", icon: BookOpen, path: "/materi-matematika", desc: "Pelajari materi matematika lengkap" },
  { label: "TUGAS / LATIHAN MANDIRI", icon: ClipboardList, path: "/latihan-mandiri", desc: "Latihan soal per topik" },
  { label: "MATH GAME ARENA", icon: Gamepad2, path: "/math-game-arena", desc: "Bermain game matematika interaktif" },
  { label: "NUMATIK ARTIFICIAL INTELLIGENCE (AI)", icon: Bot, path: "/chat-ai", desc: "Tanya jawab dengan AI matematika" },
  { label: "LKPD", icon: ClipboardCheck, path: "/lkpd", desc: "Lembar kerja interaktif dan berskor" },
  { label: "KALKULATOR SCIENTIFIC", icon: Calculator, path: "/kalkulator-scientific", desc: "Hitung cepat dengan kalkulator scientific" },
  { label: "OLIMPIADE MATEMATIKA", icon: Trophy, path: "/olimpiade", desc: "Untuk yang suka tantangan" },
  { label: "MENGHITUNG CEPAT", icon: Zap, path: "/menghitung-cepat", desc: "Trik mental math tanpa kalkulator" },
  { label: "TES KEMAMPUAN AKADEMIK", icon: Brain, path: "/tka", desc: "Uji kemampuan akademikmu" },
  { label: "KONVERSI SATUAN", icon: ArrowLeftRight, path: "/konversi-satuan", desc: "Konversi berbagai satuan pengukuran" },
  { label: "KUMPULAN RUMUS", icon: Sigma, path: "/kumpulan-rumus", desc: "Kumpulan rumus matematika SMP lengkap" },
  { label: "VIDEO PEMBELAJARAN", icon: PlayCircle, path: "/video-pembelajaran", desc: "Belajar melalui video interaktif" },
  { label: "BANK SOAL", icon: FileText, path: "/bank-soal", desc: "Koleksi lengkap soal matematika" },
  { label: "PENGATURAN", icon: Settings, path: "/pengaturan", desc: "Atur mode gelap/terang" },
  { label: "DONASI", icon: Heart, path: "/donasi", desc: "Ayo dukung agar aplikasinya lebih berkembang" },
  { label: "BIOGRAFI", icon: User, path: "/biografi", desc: "Data pembuat aplikasi" },
  { label: "SUMBER REFERENSI", icon: BookMarked, path: "/referensi", desc: "Daftar pustaka" },
  { label: "TENTANG APLIKASI", icon: Rocket, path: "/tentang-aplikasi", desc: "Informasi tentang aplikasi" },
];

const MenuPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isWhite = theme === "white";
  const isSpace = theme === "dark";

  const handleClick = (path: string) => {
    playPopSound();
    navigate(path);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/" />
      <div className="relative z-10 text-center px-4 max-w-3xl w-full pt-20 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary text-glow-cyan mb-2">
          MENU UTAMA
        </h1>
        <p className="text-muted-foreground mb-10 text-sm">Pilih menu yang ingin kamu jelajahi</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {menuItems.map((item, i) => (
            <button
              key={item.path}
              onClick={() => handleClick(item.path)}
              className={`water-btn group relative ${isWhite ? "" : "bg-card/80"} backdrop-blur border border-border rounded-xl p-6 hover:border-primary/60 hover:box-glow-cyan transition-all duration-300 cursor-pointer text-left animate-slide-up`}
              style={{
                animationDelay: `${i * 0.1}s`,
                ...(isWhite && {
                  background: "linear-gradient(to right, #2196f3, #00bcd4)",
                  border: "none",
                }),
              }}
            >
              <item.icon
                className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform"
                style={{ color: isWhite ? "#ffffff" : isSpace ? "hsl(var(--primary))" : undefined }}
              />
              <h3
                className="font-display text-[11px] sm:text-base font-bold mb-1 leading-tight"
                style={{ color: isWhite ? "#ffffff" : undefined }}
              >
                {item.label}
              </h3>
              <p
                className="text-xs"
                style={{ color: isWhite ? "rgba(255,255,255,0.8)" : isSpace ? "hsl(var(--primary))" : undefined }}
              >
                {item.desc}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/"); }}
          className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors font-body cursor-pointer"
        >
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default MenuPage;
