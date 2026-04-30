import { ReactNode } from "react";
import { ArrowLeft, Home } from "lucide-react";
import Starfield from "@/components/Starfield";
import { spaceBg } from "@/assets/placeholder";

export type IntroTheme = "ocean" | "space" | "galaxy" | "battle" | "meteor";

interface DecorImage {
  src: string;
  className: string;
  glowRgba?: string;
}

interface InstructionItem {
  text: ReactNode;
}

interface MathGameIntroProps {
  gameTitle: string;
  subtitle: string;
  topicLabel?: string;
  heroEmoji: string;
  startLabel: string;
  instructions: InstructionItem[];
  onStart: () => void;
  onBack?: () => void;
  onHome?: () => void;
  theme: IntroTheme;
  decorations?: DecorImage[];
  bestLabel?: string;
  extraOverlay?: ReactNode;
}

const themePresets: Record<IntroTheme, {
  baseGradient: string;
  radial1: string;
  radial2: string;
  radial3: string;
  titleGradient: string;
  titleGlow: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  cardBorder: string;
  cardShadow: string;
  numberBg: string;
  numberText: string;
  startBgGradient: string;
  startShadow: string;
  startHoverShadow: string;
  cardTitleColor: string;
  useSpaceBg: boolean;
}> = {
  ocean: {
    baseGradient: "from-slate-950 via-cyan-950 to-emerald-950",
    radial1: "bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.28),transparent_60%)]",
    radial2: "bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.22),transparent_55%)]",
    radial3: "bg-[radial-gradient(circle_at_70%_30%,rgba(250,204,21,0.12),transparent_50%)]",
    titleGradient: "from-cyan-300 via-emerald-300 to-yellow-300",
    titleGlow: "drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]",
    pillBg: "from-cyan-500/20 to-emerald-500/20",
    pillBorder: "border-cyan-400/40",
    pillText: "text-cyan-200",
    cardBorder: "border-cyan-500/30",
    cardShadow: "shadow-[0_0_30px_rgba(34,211,238,0.18)]",
    numberBg: "bg-cyan-500/30",
    numberText: "text-cyan-200",
    startBgGradient: "from-cyan-500 via-emerald-500 to-yellow-500",
    startShadow: "shadow-[0_0_40px_rgba(34,211,238,0.5)]",
    startHoverShadow: "hover:shadow-[0_0_60px_rgba(34,211,238,0.75)]",
    cardTitleColor: "text-cyan-300",
    useSpaceBg: false,
  },
  space: {
    baseGradient: "from-indigo-950 via-slate-950 to-blue-950",
    radial1: "bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.24),transparent_60%)]",
    radial2: "bg-[radial-gradient(ellipse_at_bottom,rgba(250,204,21,0.18),transparent_55%)]",
    radial3: "bg-[radial-gradient(circle_at_30%_40%,rgba(168,85,247,0.18),transparent_50%)]",
    titleGradient: "from-cyan-300 via-sky-300 to-yellow-300",
    titleGlow: "drop-shadow-[0_0_30px_rgba(56,189,248,0.6)]",
    pillBg: "from-cyan-500/20 to-blue-500/20",
    pillBorder: "border-cyan-400/40",
    pillText: "text-cyan-200",
    cardBorder: "border-cyan-500/30",
    cardShadow: "shadow-[0_0_30px_rgba(0,200,255,0.18)]",
    numberBg: "bg-cyan-500/30",
    numberText: "text-cyan-200",
    startBgGradient: "from-cyan-500 via-blue-500 to-purple-600",
    startShadow: "shadow-[0_0_40px_rgba(0,200,255,0.5)]",
    startHoverShadow: "hover:shadow-[0_0_60px_rgba(0,200,255,0.75)]",
    cardTitleColor: "text-cyan-300",
    useSpaceBg: true,
  },
  galaxy: {
    baseGradient: "from-slate-950 via-purple-950 to-slate-950",
    radial1: "bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.30),transparent_60%)]",
    radial2: "bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.22),transparent_55%)]",
    radial3: "bg-[radial-gradient(circle_at_70%_30%,rgba(250,204,21,0.14),transparent_50%)]",
    titleGradient: "from-cyan-300 via-purple-300 to-yellow-300",
    titleGlow: "drop-shadow-[0_0_30px_rgba(168,85,247,0.7)]",
    pillBg: "from-purple-500/20 to-cyan-500/20",
    pillBorder: "border-purple-400/40",
    pillText: "text-purple-200",
    cardBorder: "border-purple-500/30",
    cardShadow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    numberBg: "bg-purple-500/30",
    numberText: "text-purple-200",
    startBgGradient: "from-purple-500 via-fuchsia-500 to-cyan-500",
    startShadow: "shadow-[0_0_40px_rgba(168,85,247,0.55)]",
    startHoverShadow: "hover:shadow-[0_0_60px_rgba(168,85,247,0.8)]",
    cardTitleColor: "text-purple-300",
    useSpaceBg: true,
  },
  battle: {
    baseGradient: "from-slate-950 via-emerald-950 to-slate-950",
    radial1: "bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.28),transparent_60%)]",
    radial2: "bg-[radial-gradient(ellipse_at_bottom,rgba(250,204,21,0.18),transparent_55%)]",
    radial3: "bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.16),transparent_50%)]",
    titleGradient: "from-emerald-300 via-lime-300 to-yellow-300",
    titleGlow: "drop-shadow-[0_0_30px_rgba(34,197,94,0.6)]",
    pillBg: "from-emerald-500/20 to-yellow-500/20",
    pillBorder: "border-emerald-400/40",
    pillText: "text-emerald-200",
    cardBorder: "border-emerald-500/30",
    cardShadow: "shadow-[0_0_30px_rgba(34,197,94,0.2)]",
    numberBg: "bg-emerald-500/30",
    numberText: "text-emerald-200",
    startBgGradient: "from-emerald-500 via-lime-500 to-yellow-500",
    startShadow: "shadow-[0_0_40px_rgba(34,197,94,0.55)]",
    startHoverShadow: "hover:shadow-[0_0_60px_rgba(34,197,94,0.8)]",
    cardTitleColor: "text-emerald-300",
    useSpaceBg: false,
  },
  meteor: {
    baseGradient: "from-slate-950 via-red-950 to-orange-950",
    radial1: "bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.34),transparent_60%)]",
    radial2: "bg-[radial-gradient(ellipse_at_bottom,rgba(251,146,60,0.28),transparent_55%)]",
    radial3: "bg-[radial-gradient(circle_at_70%_30%,rgba(250,204,21,0.18),transparent_50%)]",
    titleGradient: "from-amber-300 via-orange-400 to-red-500",
    titleGlow: "drop-shadow-[0_0_32px_rgba(251,113,36,0.75)]",
    pillBg: "from-red-500/20 to-orange-500/20",
    pillBorder: "border-orange-400/40",
    pillText: "text-orange-200",
    cardBorder: "border-orange-500/30",
    cardShadow: "shadow-[0_0_30px_rgba(251,113,36,0.25)]",
    numberBg: "bg-orange-500/30",
    numberText: "text-orange-200",
    startBgGradient: "from-red-500 via-orange-500 to-amber-400",
    startShadow: "shadow-[0_0_40px_rgba(251,113,36,0.6)]",
    startHoverShadow: "hover:shadow-[0_0_60px_rgba(251,113,36,0.85)]",
    cardTitleColor: "text-orange-300",
    useSpaceBg: true,
  },
};

const MathGameIntro = ({
  gameTitle,
  subtitle,
  topicLabel,
  heroEmoji,
  startLabel,
  instructions,
  onStart,
  onBack,
  onHome,
  theme,
  decorations = [],
  bestLabel,
  extraOverlay,
}: MathGameIntroProps) => {
  const t = themePresets[theme];

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {t.useSpaceBg && (
        <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className={`absolute inset-0 bg-gradient-to-b ${t.baseGradient}`} />
      <div className={`absolute inset-0 ${t.radial1}`} />
      <div className={`absolute inset-0 ${t.radial2}`} />
      <div className={`absolute inset-0 ${t.radial3}`} />
      <Starfield />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {decorations.map((d, i) => (
          <div key={i} className={d.className}>
            <img
              src={d.src}
              alt=""
              className="w-full h-full"
              style={d.glowRgba ? { filter: `drop-shadow(0 0 14px ${d.glowRgba})` } : undefined}
            />
          </div>
        ))}

        <div className="absolute top-[8%] left-[6%] text-yellow-300 text-2xl animate-twinkle">✦</div>
        <div className="absolute top-[14%] right-[8%] text-cyan-300 text-xl animate-twinkle" style={{ animationDelay: "0.6s" }}>✦</div>
        <div className="absolute top-[40%] left-[4%] text-pink-300 text-base animate-twinkle" style={{ animationDelay: "1.2s" }}>✧</div>
        <div className="absolute bottom-[30%] right-[5%] text-yellow-300 text-lg animate-twinkle" style={{ animationDelay: "0.3s" }}>✧</div>
        <div className="absolute bottom-[15%] left-[10%] text-purple-300 text-xl animate-twinkle" style={{ animationDelay: "0.9s" }}>✦</div>
        <div className="absolute top-[55%] right-[12%] text-cyan-200 text-sm animate-twinkle" style={{ animationDelay: "1.5s" }}>✧</div>

        {extraOverlay}
      </div>

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-4 py-6 overflow-y-auto">
        <div className="w-full max-w-xl text-center animate-slide-up">
          <div className="mb-1 sm:mb-2">
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-wider">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,200,255,0.55)]">
                MATH GAME ARENA
              </span>
            </h1>
          </div>

          <div className="mb-3 sm:mb-5">
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.15em] leading-none">
              <span className={`bg-gradient-to-r ${t.titleGradient} bg-clip-text text-transparent ${t.titleGlow}`}>
                {gameTitle}
              </span>
            </h2>
            <div className="font-display text-[11px] sm:text-sm text-yellow-300/90 tracking-[0.3em] font-bold mt-2">
              {subtitle}
            </div>
          </div>

          {topicLabel && (
            <div className="inline-block mb-4 sm:mb-6">
              <div className={`px-5 py-1.5 rounded-full bg-gradient-to-r ${t.pillBg} border ${t.pillBorder} backdrop-blur-sm`}>
                <span className={`font-display text-xs sm:text-sm font-bold ${t.pillText} tracking-wide`}>
                  {topicLabel}
                </span>
              </div>
            </div>
          )}

          <div className={`bg-card/70 backdrop-blur-md border ${t.cardBorder} rounded-2xl p-4 sm:p-6 max-w-md mx-auto mb-5 sm:mb-7 ${t.cardShadow}`}>
            <h3 className={`font-display text-base sm:text-lg font-bold ${t.cardTitleColor} mb-3 sm:mb-4 flex items-center justify-center gap-2`}>
              <span className="text-xl">{heroEmoji}</span> CARA BERMAIN <span className="text-xl">{heroEmoji}</span>
            </h3>
            <ul className="text-left space-y-2 sm:space-y-3 font-body text-xs sm:text-sm text-foreground/90">
              {instructions.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full ${t.numberBg} flex items-center justify-center ${t.numberText} font-bold text-xs`}>
                    {i + 1}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onStart}
            className={`relative font-display text-lg sm:text-xl md:text-2xl px-10 sm:px-14 py-3 sm:py-5 rounded-2xl bg-gradient-to-r ${t.startBgGradient} text-white font-black tracking-wider cursor-pointer ${t.startShadow} ${t.startHoverShadow} transition-shadow duration-300 animate-pulse-scale`}
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>&#9658;</span> {startLabel} <span>&#9658;</span>
            </span>
          </button>

          {bestLabel && (
            <p className="mt-4 text-yellow-300 text-xs sm:text-sm font-body font-bold drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]">
              🏆 {bestLabel}
            </p>
          )}
        </div>
      </div>

      {(onBack || onHome) && (
        <div
          className="fixed top-0 left-0 right-0 z-[110] flex items-center justify-between p-4"
          style={{
            paddingTop: "max(2.5rem, calc(env(safe-area-inset-top, 0px) + 1.25rem))",
            paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
            paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
          }}
        >
          {onBack ? (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.45)] hover:opacity-90 transition-opacity cursor-pointer"
              title="Kembali"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          ) : <span />}
          {onHome ? (
            <button
              onClick={onHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.45)] hover:opacity-90 transition-opacity cursor-pointer"
              title="Menu Utama"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          ) : <span />}
        </div>
      )}
    </div>
  );
};

export default MathGameIntro;
