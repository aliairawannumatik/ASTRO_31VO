import React from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useTheme } from "@/contexts/ThemeContext";

interface RingkasanItem { emoji: string; judul: string; isi: string; bg: string; border: string; textColor: string; }
interface TipsItem { emoji: string; teks: React.ReactNode; }
interface RumusItem { label: string; rumus: string; bg: string; border: string; labelColor: string; }

interface RangkumanSectionProps {
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  borderColor: string;
  accentColor: string;
  judul: string;
  subjudul: string;
  headerIcon: string;
  ringkasan: RingkasanItem[];
  rumus?: RumusItem[];
  tips: TipsItem[];
  kesimpulan: string;
  kesimpulanBg: string;
  kesimpulanBorder: string;
  kesimpulanTextColor: string;
  /** Optional override. When omitted, reads from ThemeContext automatically. */
  isDark?: boolean;
}

export const RangkumanSection: React.FC<RangkumanSectionProps> = ({
  gradientFrom, gradientVia, gradientTo, borderColor, accentColor,
  judul, subjudul, headerIcon,
  ringkasan, rumus, tips,
  kesimpulan, kesimpulanBg, kesimpulanBorder, kesimpulanTextColor,
  isDark: isDarkProp,
}) => {
  const { isDark: themeIsDark } = useTheme();
  // Prefer explicit prop (for callers that manage their own theme state);
  // fall back to the global ThemeContext so the component is never stuck in dark mode.
  const isDark = isDarkProp ?? themeIsDark;

  const heading    = isDark ? "text-white"     : "text-gray-900";
  const bodyText   = isDark ? "text-white/70"  : "text-gray-600";
  const sectionLbl = isDark ? "text-white"     : "text-gray-800";
  const tipsBg     = isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-400";
  const tipsText   = isDark ? "text-amber-100" : "text-amber-900";
  // Header badge: readable on both dark and light gradient backgrounds
  const badgeBg    = isDark ? "bg-white/10"    : "bg-white/40";

  return (
    <div className={`bg-card/80 backdrop-blur border ${borderColor} rounded-xl overflow-hidden`}>
      {/* ── Header ── */}
      <div className={`bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} px-5 py-4`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{headerIcon}</span>
          <div>
            <p className="font-heading font-bold text-white text-base sm:text-lg tracking-wide">{judul}</p>
            <p className="text-white/65 text-xs font-body">{subjudul}</p>
          </div>
          <span className={`ml-auto text-xs font-mono ${accentColor} ${badgeBg} px-3 py-1 rounded-full hidden sm:block`}>
            📖 Buku Animasi Matematika
          </span>
        </div>
      </div>

      <div className="px-5 pb-7 pt-5 space-y-6">
        {/* ── Konsep Utama ── */}
        <div>
          <p className={`${sectionLbl} font-semibold text-sm mb-3 flex items-center gap-2`}>
            <span className="text-lg">🗝️</span> Konsep Utama yang Harus Dikuasai
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ringkasan.map((r, i) => (
              <div key={i} className={`${r.bg} border ${r.border} rounded-xl p-3 flex gap-3 items-start`}>
                <span className="text-xl shrink-0 mt-0.5">{r.emoji}</span>
                <div>
                  <p className={`font-semibold text-xs font-body ${r.textColor} mb-0.5`}>{r.judul}</p>
                  <p className={`${bodyText} text-xs font-body leading-relaxed`}>{r.isi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rumus Penting ── */}
        {rumus && rumus.length > 0 && (
          <div>
            <p className={`${sectionLbl} font-semibold text-sm mb-3 flex items-center gap-2`}>
              <span className="text-lg">📐</span> Rumus-Rumus Kunci
            </p>
            <div className="grid grid-cols-1 gap-2">
              {rumus.map((r, i) => (
                <div key={i} className={`${r.bg} border ${r.border} rounded-xl px-4 py-2`}>
                  <p className={`font-mono font-bold text-xs mb-1 ${r.labelColor}`}>{r.label}</p>
                  <div className="overflow-x-auto"><BlockMath math={r.rumus} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tips & Trik ── */}
        <div>
          <p className={`${sectionLbl} font-semibold text-sm mb-3 flex items-center gap-2`}>
            <span className="text-lg">💡</span> Tips & Trik Jitu
          </p>
          <div className="space-y-2">
            {tips.map((t, i) => (
              <div key={i} className={`${tipsBg} rounded-xl px-4 py-2.5 flex gap-3 items-start`}>
                <span className="text-base shrink-0 mt-0.5">{t.emoji}</span>
                <p className={`${tipsText} text-xs font-body leading-relaxed`}>{t.teks}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Kesimpulan ── */}
        <div className={`${kesimpulanBg} border ${kesimpulanBorder} rounded-2xl px-5 py-4 text-center`}>
          <p className="text-2xl mb-2">🎯</p>
          <p className={`${heading} font-semibold text-sm font-body mb-1`}>Kesimpulan</p>
          <p className={`${kesimpulanTextColor} text-sm font-body leading-relaxed`}>{kesimpulan}</p>
        </div>
      </div>
    </div>
  );
};
