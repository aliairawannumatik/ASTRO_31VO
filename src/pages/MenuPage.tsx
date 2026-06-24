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
    { key: "gameArena",   icon: Gamepad2,       path: "/math-game-arena" },
    { key: "ai",          icon: Bot,            path: "/chat-ai" },
    { key: "lkpd",        icon: ClipboardCheck, path: "/lkpd" },
    { key: "calculator",  icon: Calculator,     path: "/kalkulator-scientific" },
    { key: "olympiad",    icon: Trophy,         path: "/olimpiade" },
    { key: "fastCalc",    icon: Zap,            path: "/menghitung-cepat" },
    { key: "academic",    icon: Brain,          path: "/tka" },
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
    </div>
  );
};

export default MenuPage;
