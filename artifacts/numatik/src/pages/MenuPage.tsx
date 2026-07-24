import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Monitor,
} from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const MenuPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isWhite = theme === "white";
  const isSpace = theme === "dark";

  const menuItems = [
    { key: "guide",       icon: Info,           path: "/petunjuk" },
    { key: "teacherRoom", icon: GraduationCap,  path: "/ruang-untuk-guru" },
    { key: "animatedBook",icon: BookOpen,        path: "/materi-matematika" },
    { key: "practice",    icon: ClipboardList,  path: "/latihan-mandiri" },
    { key: "academic",    icon: Brain,          path: "/tka" },
    { key: "gameArena",   icon: Gamepad2,       path: "/math-game-arena" },
    { key: "ai",          icon: Bot,            path: "/chat-ai" },
    { key: "lkpd",        icon: ClipboardCheck, path: "/lkpd" },
    { key: "olympiad",    icon: Trophy,         path: "/olimpiade" },
    { key: "calculator",  icon: Calculator,     path: "/kalkulator-scientific" },
    { key: "fastCalc",    icon: Zap,            path: "/menghitung-cepat" },
    { key: "conversion",  icon: ArrowLeftRight, path: "/konversi-satuan" },
    { key: "formula",     icon: Sigma,          path: "/kumpulan-rumus" },
    { key: "video",       icon: PlayCircle,     path: "/video-pembelajaran" },
    { key: "questionBank",icon: FileText,       path: "/bank-soal" },
    { key: "settings",    icon: Settings,       path: "/pengaturan" },
    { key: "donate",      icon: Heart,          path: "/donasi" },
    { key: "biography",   icon: User,           path: "/biografi" },
    { key: "reference",   icon: BookMarked,     path: "/referensi" },
    { key: "about",       icon: Rocket,         path: "/tentang-aplikasi" },
  ];

  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [pendingPath, setPendingPath] = useState("");

  const handleClick = (path: string) => {
    if (path === "/ruang-untuk-guru") {
      playPopSound();
      setPendingPath(path);
      setShowDesktopModal(true);
      return;
    }
    playPopSound();
    navigate(path);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/" />
      <div className="relative z-10 text-center px-4 max-w-3xl w-full pt-20 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary text-glow-cyan mb-2">
          {t("menu.title")}
        </h1>
        <p className="text-muted-foreground mb-10 text-sm">{t("menu.subtitle")}</p>

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
                {t(`menuItems.${item.key}.label`)}
              </h3>
              <p
                className="text-xs"
                style={{ color: isWhite ? "rgba(255,255,255,0.8)" : isSpace ? "hsl(var(--primary))" : undefined }}
              >
                {t(`menuItems.${item.key}.desc`)}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/"); }}
          className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors font-body cursor-pointer"
        >
          {t("nav.backToHome")}
        </button>
      </div>

      {/* ── Desktop Recommendation Modal ──────────────────────────────── */}
      {showDesktopModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={() => setShowDesktopModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border p-8 flex flex-col items-center text-center shadow-2xl animate-slide-up"
            style={{
              background: "linear-gradient(160deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.10) 50%, rgba(139,92,246,0.08) 100%)",
              borderColor: "rgba(6,182,212,0.4)",
              boxShadow: "0 0 40px rgba(6,182,212,0.15), 0 0 80px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Glow ring behind icon */}
            <div className="relative mb-6">
              <div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(6,182,212,0.5) 0%, rgba(59,130,246,0.3) 50%, transparent 75%)", transform: "scale(2)" }}
              />
              <div
                className="relative flex items-center justify-center w-20 h-20 rounded-full border"
                style={{
                  background: "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(59,130,246,0.25))",
                  borderColor: "rgba(6,182,212,0.5)",
                  boxShadow: "0 0 20px rgba(6,182,212,0.3)",
                }}
              >
                <Monitor className="w-10 h-10 text-cyan-300" strokeWidth={1.5} />
              </div>
            </div>

            {/* Title */}
            <h2
              className="font-display text-xl font-bold mb-2 text-cyan-300"
              style={{ textShadow: "0 0 16px rgba(6,182,212,0.6)" }}
            >
              Tampilan Terbaik di Desktop
            </h2>

            {/* Divider */}
            <div
              className="w-16 h-px mb-4"
              style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)" }}
            />

            {/* Body */}
            <p className="font-body text-sm text-slate-300 leading-relaxed mb-1">
              Menu <span className="font-semibold text-cyan-200">Ruang untuk Guru</span> dirancang khusus untuk layar yang lebih lebar.
            </p>
            <p className="font-body text-xs text-slate-400 leading-relaxed mb-8">
              Untuk pengalaman maksimal, buka di <span className="text-cyan-300 font-medium">laptop atau desktop</span> melalui{" "}
              <span className="text-cyan-300 font-medium">www.numatik.app</span>
            </p>

            {/* CTA button */}
            <div className="relative w-full">
              <div
                className="absolute inset-0 rounded-xl blur-lg opacity-50"
                style={{ background: "linear-gradient(90deg, #06b6d4, #3b82f6)" }}
              />
              <button
                onClick={() => {
                  setShowDesktopModal(false);
                  navigate(pendingPath);
                }}
                className="relative w-full py-3 rounded-xl font-display font-bold text-sm tracking-widest text-white border transition-all duration-200 active:scale-95 hover:opacity-90"
                style={{
                  background: "linear-gradient(90deg, #0891b2, #2563eb)",
                  borderColor: "rgba(6,182,212,0.5)",
                }}
              >
                Mengerti, Lanjutkan →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
