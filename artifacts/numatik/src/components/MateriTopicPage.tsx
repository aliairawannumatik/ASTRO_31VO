import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const COLOR_PALETTE_DARK = [
  { gradient: "from-blue-900/40 to-indigo-900/30",   border: "border-blue-500/30",   iconBg: "bg-blue-500/20",   iconColor: "text-blue-300",   leftBar: "from-blue-400 to-indigo-500" },
  { gradient: "from-cyan-900/40 to-sky-900/30",      border: "border-cyan-500/30",   iconBg: "bg-cyan-500/20",   iconColor: "text-cyan-300",   leftBar: "from-cyan-400 to-sky-500" },
  { gradient: "from-violet-900/40 to-purple-900/30", border: "border-violet-500/30", iconBg: "bg-violet-500/20", iconColor: "text-violet-300", leftBar: "from-violet-400 to-purple-500" },
  { gradient: "from-sky-900/40 to-blue-900/30",      border: "border-sky-500/30",    iconBg: "bg-sky-500/20",    iconColor: "text-sky-300",    leftBar: "from-sky-400 to-blue-500" },
  { gradient: "from-indigo-900/40 to-blue-900/30",   border: "border-indigo-500/30", iconBg: "bg-indigo-500/20", iconColor: "text-indigo-300", leftBar: "from-indigo-400 to-blue-500" },
  { gradient: "from-purple-900/40 to-fuchsia-900/30",border: "border-purple-500/30", iconBg: "bg-purple-500/20", iconColor: "text-purple-300", leftBar: "from-purple-400 to-fuchsia-500" },
  { gradient: "from-teal-900/40 to-emerald-900/30",  border: "border-teal-500/30",   iconBg: "bg-teal-500/20",   iconColor: "text-teal-300",   leftBar: "from-teal-400 to-emerald-500" },
  { gradient: "from-green-900/40 to-emerald-900/30", border: "border-green-500/30",  iconBg: "bg-green-500/20",  iconColor: "text-green-300",  leftBar: "from-green-400 to-emerald-500" },
  { gradient: "from-rose-900/40 to-pink-900/30",     border: "border-rose-500/30",   iconBg: "bg-rose-500/20",   iconColor: "text-rose-300",   leftBar: "from-rose-400 to-pink-500" },
  { gradient: "from-orange-900/40 to-amber-900/30",  border: "border-orange-500/30", iconBg: "bg-orange-500/20", iconColor: "text-orange-300", leftBar: "from-orange-400 to-amber-500" },
];

const COLOR_PALETTE_LIGHT = [
  { gradient: "from-blue-50 to-indigo-50",    border: "border-blue-300/70",   iconBg: "bg-blue-100",   iconColor: "text-blue-600",   leftBar: "from-blue-400 to-indigo-500" },
  { gradient: "from-cyan-50 to-sky-50",       border: "border-cyan-300/70",   iconBg: "bg-cyan-100",   iconColor: "text-cyan-600",   leftBar: "from-cyan-400 to-sky-500" },
  { gradient: "from-violet-50 to-purple-50",  border: "border-violet-300/70", iconBg: "bg-violet-100", iconColor: "text-violet-600", leftBar: "from-violet-400 to-purple-500" },
  { gradient: "from-sky-50 to-blue-50",       border: "border-sky-300/70",    iconBg: "bg-sky-100",    iconColor: "text-sky-600",    leftBar: "from-sky-400 to-blue-500" },
  { gradient: "from-indigo-50 to-blue-50",    border: "border-indigo-300/70", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", leftBar: "from-indigo-400 to-blue-500" },
  { gradient: "from-purple-50 to-fuchsia-50", border: "border-purple-300/70", iconBg: "bg-purple-100", iconColor: "text-purple-600", leftBar: "from-purple-400 to-fuchsia-500" },
  { gradient: "from-teal-50 to-emerald-50",   border: "border-teal-300/70",   iconBg: "bg-teal-100",   iconColor: "text-teal-600",   leftBar: "from-teal-400 to-emerald-500" },
  { gradient: "from-green-50 to-emerald-50",  border: "border-green-300/70",  iconBg: "bg-green-100",  iconColor: "text-green-600",  leftBar: "from-green-400 to-emerald-500" },
  { gradient: "from-rose-50 to-pink-50",      border: "border-rose-300/70",   iconBg: "bg-rose-100",   iconColor: "text-rose-600",   leftBar: "from-rose-400 to-pink-500" },
  { gradient: "from-orange-50 to-amber-50",   border: "border-orange-300/70", iconBg: "bg-orange-100", iconColor: "text-orange-600", leftBar: "from-orange-400 to-amber-500" },
];

interface Subtopic {
  label: string;
  path: string;
  icon?: string;
}

interface MateriTopicPageProps {
  title: string;
  emoji: string;
  kelas: string;
  subtopics: Subtopic[];
  backPath: string;
  backLabel: string;
  contextLabel?: string;
}

const MateriTopicPage = ({ title, emoji, kelas, subtopics, backPath, backLabel, contextLabel }: MateriTopicPageProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const uiText = {
    id: { subTopics: "Sub Topik", comingSoon: "Segera hadir", contextDefault: "Buku Animasi Matematika" },
    en: { subTopics: "Sub Topics", comingSoon: "Coming soon", contextDefault: "Math Animation Book" },
    ja: { subTopics: "サブトピック", comingSoon: "近日公開", contextDefault: "数学アニメーションブック" },
  };

  const ui = uiText[language];
  const resolvedContextLabel = contextLabel ?? ui.contextDefault;
  const COLOR_PALETTE = isDark ? COLOR_PALETTE_DARK : COLOR_PALETTE_LIGHT;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath={backPath} />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mb-4">
            <span className="text-3xl">{emoji}</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan text-center mb-1" style={{ textShadow: '0 0 24px rgba(96,165,250,0.7)' }}>
            {title}
          </h1>
          <p className={`text-xs text-center font-body mb-1 ${isDark ? "text-white/50" : "text-gray-500"}`}>
            {kelas} · {resolvedContextLabel}
          </p>
          <div className={`flex items-center gap-3 rounded-xl px-5 py-2 mt-2 border ${
            isDark ? "bg-white/5 border-white/10" : "bg-sky-50 border-sky-200/70"
          }`}>
            <BookOpen className="w-4 h-4 text-primary" />
            <span className={`text-xs font-body ${isDark ? "text-white/70" : "text-gray-600"}`}>
              {subtopics.length} {ui.subTopics}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {subtopics.map((subtopic, i) => {
            const c = COLOR_PALETTE[i % COLOR_PALETTE.length];
            const isComingSoon = !subtopic.path || subtopic.path === "/coming-soon";
            return (
              <button
                key={subtopic.label}
                onClick={() => { if (!isComingSoon) { playPopSound(); navigate(subtopic.path); } }}
                disabled={isComingSoon}
                className={`water-btn group relative rounded-2xl overflow-hidden text-left transition-all duration-300 animate-slide-up ${isComingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] cursor-pointer'}`}
                style={{ animationDelay: `${i * 0.07}s`, background: 'var(--btn-bg)' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} backdrop-blur`} />
                <div className={`absolute inset-0 border ${c.border} rounded-2xl ${isComingSoon ? '' : 'group-hover:border-opacity-80'} transition-colors`} />
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${c.leftBar} rounded-l-2xl`} />
                <div className="relative px-5 py-4 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${c.iconBg} border ${c.border} flex items-center justify-center shrink-0`}>
                    <span className="text-xl leading-none">{subtopic.icon ?? String(i + 1)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`font-display text-sm font-bold block leading-snug ${isDark ? "text-white" : "text-gray-800"}`}>
                      {subtopic.label}
                    </span>
                    {isComingSoon && (
                      <span className={`text-xs font-body mt-0.5 block ${isDark ? "text-white/40" : "text-gray-400"}`}>
                        {ui.comingSoon}
                      </span>
                    )}
                  </div>
                  {!isComingSoon && (
                    <ChevronRight className={`w-5 h-5 ${c.iconColor} group-hover:translate-x-1 transition-transform shrink-0`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate(backPath); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← {backLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MateriTopicPage;
