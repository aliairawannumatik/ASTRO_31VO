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
  Search,
  X,
} from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const MenuPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const isWhite = theme === "white";
  const isSpace = theme === "dark";

  const menuItems = [
    { key: "guide",       icon: Info,           path: "/petunjuk" },
    { key: "teacherRoom", icon: GraduationCap,  path: "/ruang-untuk-guru" },
    { key: "animatedBook",icon: BookOpen,        path: "/buku-animasi-matematika" },
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

  const handleClick = (path: string) => {
    playPopSound();
    navigate(path);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMenuItems = menuItems.filter((item) => {
    if (!normalizedQuery) return true;
    const label = t(`menuItems.${item.key}.label`).toLowerCase();
    const description = t(`menuItems.${item.key}.desc`).toLowerCase();
    return `${label} ${description}`.includes(normalizedQuery);
  });

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/" />
      <div className="relative z-10 text-center px-4 max-w-3xl w-full pt-20 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary text-glow-cyan mb-2">
          {t("menu.title")}
        </h1>
        <p className="text-muted-foreground mb-5 text-sm">{t("menu.subtitle")}</p>

        <div className="relative max-w-2xl mx-auto mb-8">
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          />
          <label htmlFor="menu-search" className="sr-only">Cari di aplikasi</label>
          <input
            id="menu-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari menu, materi, latihan, atau fitur..."
            className={`w-full rounded-xl border border-border ${isWhite ? "bg-white/95 text-slate-900" : "bg-card/90 text-foreground"} py-3 pl-12 pr-11 text-sm shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25`}
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Hapus pencarian"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {filteredMenuItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {filteredMenuItems.map((item, i) => (
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
        ) : (
          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card/70 px-6 py-10 text-center">
            <Search className="mx-auto mb-3 w-8 h-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-display text-base font-semibold text-foreground">Tidak ada hasil pencarian</p>
            <p className="mt-1 text-sm text-muted-foreground">Coba gunakan kata kunci yang berbeda.</p>
          </div>
        )}

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
