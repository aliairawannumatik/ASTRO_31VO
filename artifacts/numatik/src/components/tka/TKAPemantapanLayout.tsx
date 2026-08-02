import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2, XCircle, Lightbulb, ArrowLeft, BookMarked, PenLine } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export interface MateriSection {
  heading: string;
  content: string;
  jsx?: React.ReactNode;
  jsxAfter?: React.ReactNode;
}

export interface LatihanSoal {
  no: number;
  /** "pg" = pilihan ganda biasa | "pgk" = PG Kompleks 4 pernyataan | "pgkbs" = PG Benar-Salah 3 pernyataan */
  type?: "pg" | "pgk" | "pgkbs";
  soal: string;
  /** PG & PGK: opsi A-D (combo untuk PGK) */
  options?: string[];
  /** PG & PGK: huruf jawaban benar (A/B/C/D) */
  jawaban?: string;
  /** PGK: 4 pernyataan | PGKBS: 3 pernyataan */
  pernyataan?: string[];
  /** PGKBS: array ["B"|"S"] untuk tiap pernyataan */
  jawabanBS?: ("B" | "S")[];
  pembahasan?: string;
}

interface Props {
  title: string;
  backPath?: string;
  materiSections: MateriSection[];
  latihanDasar: LatihanSoal[];
  contohSoal?: LatihanSoal[];
}

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const SECTION_COLORS = [
  { bg: "from-indigo-500/20 to-indigo-600/10", border: "border-indigo-400/50", badge: "bg-indigo-500/30 text-indigo-200 border-indigo-400/40", dot: "bg-indigo-400" },
  { bg: "from-violet-500/20 to-violet-600/10", border: "border-violet-400/50", badge: "bg-violet-500/30 text-violet-200 border-violet-400/40", dot: "bg-violet-400" },
  { bg: "from-purple-500/20 to-purple-600/10", border: "border-purple-400/50", badge: "bg-purple-500/30 text-purple-200 border-purple-400/40", dot: "bg-purple-400" },
  { bg: "from-fuchsia-500/20 to-fuchsia-600/10", border: "border-fuchsia-400/50", badge: "bg-fuchsia-500/30 text-fuchsia-200 border-fuchsia-400/40", dot: "bg-fuchsia-400" },
  { bg: "from-sky-500/20 to-sky-600/10", border: "border-sky-400/50", badge: "bg-sky-500/30 text-sky-200 border-sky-400/40", dot: "bg-sky-400" },
  { bg: "from-teal-500/20 to-teal-600/10", border: "border-teal-400/50", badge: "bg-teal-500/30 text-teal-200 border-teal-400/40", dot: "bg-teal-400" },
  { bg: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-400/50", badge: "bg-emerald-500/30 text-emerald-200 border-emerald-400/40", dot: "bg-emerald-400" },
];

const optionLetters = ['A', 'B', 'C', 'D', 'E'];

/* ── Type badge config ── */
const TYPE_BADGE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pg: {
    label: "PG",
    color: "text-violet-300",
    bg: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.35)",
  },
  pgk: {
    label: "PG Kompleks",
    color: "text-amber-300",
    bg: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.35)",
  },
  pgkbs: {
    label: "PG Benar-Salah",
    color: "text-cyan-300",
    bg: "rgba(6,182,212,0.15)",
    border: "rgba(6,182,212,0.35)",
  },
};

const TKAPemantapanLayout = ({ title, backPath = "/tka/modul-pemantapan", materiSections, latihanDasar, contohSoal }: Props) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isWhite = theme === "white";
  const [activeTab, setActiveTab] = useState<"materi" | "contoh" | "dasar">("materi");
  /* PG & PGK: stores selected letter (A/B/C/D) per soal.no */
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  /* PGKBS: stores ["B"|"S"|null, ...] per soal.no */
  const [pgkbsAnswers, setPgkbsAnswers] = useState<Record<number, ("B" | "S" | null)[]>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  /* Contoh soal interactive state (separate from latihan) */
  const [selectedContohAnswers, setSelectedContohAnswers] = useState<Record<number, string>>({});
  const [pgkbsContohAnswers, setPgkbsContohAnswers] = useState<Record<number, ("B" | "S" | null)[]>>({});

  const handleSelectAnswer = (soalNo: number, letter: string) => {
    if (revealedAnswers.has(soalNo)) return;
    playPopSound();
    setSelectedAnswers(prev => ({ ...prev, [soalNo]: letter }));
  };

  const handleSelectBS = (soalNo: number, idx: number, val: "B" | "S", count: number) => {
    if (revealedAnswers.has(soalNo)) return;
    playPopSound();
    setPgkbsAnswers(prev => {
      const current: ("B" | "S" | null)[] = prev[soalNo] ? [...prev[soalNo]] : Array(count).fill(null);
      current[idx] = val;
      return { ...prev, [soalNo]: current };
    });
  };

  const handleReveal = (soalNo: number) => {
    playPopSound();
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      next.add(soalNo);
      return next;
    });
  };

  const handleHide = (soalNo: number) => {
    playPopSound();
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      next.delete(soalNo);
      return next;
    });
    setSelectedAnswers(prev => {
      const next = { ...prev };
      delete next[soalNo];
      return next;
    });
    setPgkbsAnswers(prev => {
      const next = { ...prev };
      delete next[soalNo];
      return next;
    });
  };

  const isCorrectForSoal = (s: LatihanSoal): boolean => {
    if (!revealedAnswers.has(s.no)) return false;
    if (s.type === "pgkbs") {
      return (s.jawabanBS?.every((ans, i) => pgkbsAnswers[s.no]?.[i] === ans) ?? false);
    }
    return selectedAnswers[s.no] === s.jawaban;
  };

  const correctCount = latihanDasar.filter(isCorrectForSoal).length;
  const answeredCount = revealedAnswers.size;

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden tka-pemantapan"
      style={isWhite ? { background: "var(--bg-primary)" } : { background: "linear-gradient(160deg, #0f0c29 0%, #141428 40%, #1a0a2e 70%, #0d1117 100%)" }}>
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 pt-8 pb-14">

        {/* ── Header ── */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
            style={{ background: "radial-gradient(ellipse at 50% 0%, #6366f1 0%, transparent 70%)" }} />
          <div className="relative rounded-2xl overflow-hidden border border-indigo-500/30"
            style={isWhite ? {
              background: "linear-gradient(to right, #2196f3, #00bcd4)",
              borderColor: "rgba(33,150,243,0.4)",
            } : { background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 50%, rgba(15,12,41,0.9) 100%)" }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)" }} />

            <div className="px-6 py-6 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2))", border: "1px solid rgba(167,139,250,0.35)" }}>
                  <BookMarked className="w-4.5 h-4.5 text-violet-300" />
                </div>
                <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-violet-400/70">
                  MODUL PEMANTAPAN TKA MATEMATIKA
                </span>
              </div>

              <h1 className="font-display text-xl md:text-2xl font-bold mb-1 leading-tight"
                style={{ textShadow: "0 0 40px rgba(167,139,250,0.5)", color: "#ffffff" }}>
                {title}
              </h1>

              <div className="flex gap-2 flex-wrap justify-center mb-0">
                <span className="text-[10px] font-body px-3 py-1 rounded-full border font-semibold"
                  style={{ background: "rgba(99,102,241,0.15)", borderColor: "rgba(99,102,241,0.35)", color: "#a5b4fc" }}>
                  📖 {materiSections.length} Materi
                </span>
                {contohSoal && contohSoal.length > 0 && (
                  <span className="text-[10px] font-body px-3 py-1 rounded-full border font-semibold"
                    style={{ background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.35)", color: "#6ee7b7" }}>
                    📚 {contohSoal.length} Contoh Soal
                  </span>
                )}
                <span className="text-[10px] font-body px-3 py-1 rounded-full border font-semibold"
                  style={{ background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.35)", color: "#c4b5fd" }}>
                  ✏️ {latihanDasar.length} Soal Latihan
                </span>
              </div>

              {/* ── Type legend ── */}
              <div className="mt-3 flex gap-2 flex-wrap justify-center">
                {Object.values(TYPE_BADGE).map(b => (
                  <span key={b.label} className={`text-[9px] font-body px-2.5 py-0.5 rounded-full border font-semibold ${b.color}`}
                    style={{ background: b.bg, borderColor: b.border }}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Author strip ── */}
            <div className="px-6 py-3 flex items-center justify-center gap-2 border-t"
              style={isWhite ? {
                borderColor: "rgba(255,255,255,0.35)",
                background: "rgba(0,0,0,0.12)",
              } : {
                borderColor: "rgba(167,139,250,0.2)",
                background: "rgba(99,102,241,0.08)",
              }}>
              <PenLine className="w-3.5 h-3.5 shrink-0" style={{ color: isWhite ? "rgba(255,255,255,0.8)" : "#a5b4fc" }} />
              <span className="font-body text-sm font-semibold tracking-wide"
                style={{ color: isWhite ? "#ffffff" : "#c4b5fd" }}>
                oleh Irawan Sutiawan, M.Pd
              </span>
            </div>
          </div>
        </div>

        {/* ── Tab Switcher ── */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl"
          style={isWhite ? { background: "var(--bg-secondary)", border: "1px solid var(--border)" } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {([
            { key: "materi" as const, label: "📘 Ringkasan Materi" },
            ...(contohSoal && contohSoal.length > 0 ? [{ key: "contoh" as const, label: "📚 Contoh Soal" }] : []),
            { key: "dasar" as const, label: "✏️ Latihan Soal" },
          ] as { key: "materi" | "contoh" | "dasar"; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className="flex-1 font-display text-xs py-2.5 px-3 rounded-lg cursor-pointer transition-all duration-200 font-bold"
              style={activeTab === tab.key ? (isWhite ? {
                background: "linear-gradient(to right, #2196f3, #00bcd4)",
                color: "#ffffff",
                boxShadow: "0 2px 12px rgba(33,150,243,0.3)",
                border: "1px solid rgba(33,150,243,0.4)",
              } : {
                background: "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.4))",
                color: "var(--text-primary)",
                boxShadow: "0 2px 12px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                border: "1px solid rgba(167,139,250,0.4)",
              }) : {
                color: "var(--text-secondary)",
                background: "transparent",
                border: "1px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── MATERI TAB ── */}
        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSections.map((section, idx) => {
              const color = SECTION_COLORS[idx % SECTION_COLORS.length];
              const headingText = section.heading.replace(/^[A-Z]\.\s*/, '');
              return (
                <div key={idx} className={`relative rounded-2xl overflow-hidden border ${color.border}`}
                  style={isWhite ? {
                    background: "#f0f4ff",
                    border: `1px solid rgba(33,150,243,0.25)`,
                    boxShadow: "0 4px 12px rgba(33,150,243,0.08)",
                  } : {
                    background: `linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(15,12,41,0.95) 100%)`,
                    boxShadow: "0 4px 24px rgba(99,102,241,0.12)",
                  }}>

                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{ background: `linear-gradient(to bottom, #6366f1, #8b5cf6)` }} />

                  <div className="w-full flex items-center gap-3 px-5 py-4 text-left pl-6">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${color.badge}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm font-bold text-white/90 flex-1 leading-snug">
                      {headingText}
                    </span>
                  </div>

                  <div className="px-6 pb-5 pt-1 border-t border-white/5">
                    {section.jsx && <div className="mb-3">{section.jsx}</div>}
                    <div className="font-body text-sm text-white/80 leading-relaxed space-y-0.5">
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        const imgMatch = trimmed.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
                        if (imgMatch) {
                          const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'max-w-sm w-full';
                          return (
                            <div key={i} className="my-3 flex justify-center">
                              <img src={imgMatch[1]} alt="Gambar materi" className={`${sizeClass} rounded-xl shadow-lg`} />
                            </div>
                          );
                        }
                        if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
                          return (
                            <div key={i} className="my-4 relative">
                              <div className="absolute inset-0 rounded-xl blur-sm opacity-20"
                                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }} />
                              <div className="relative px-5 py-4 rounded-xl text-center border"
                                style={{
                                  background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.06))",
                                  borderColor: "rgba(245,158,11,0.35)",
                                }}>
                                <div className="flex items-center justify-center gap-1.5 mb-2">
                                  <div className="h-px flex-1 max-w-[40px]"
                                    style={{ background: "rgba(245,158,11,0.4)" }} />
                                  <span className="text-[9px] font-bold tracking-widest uppercase"
                                    style={{ color: "#fbbf24" }}>⭐ Rumus Penting</span>
                                  <div className="h-px flex-1 max-w-[40px]"
                                    style={{ background: "rgba(245,158,11,0.4)" }} />
                                </div>
                                <span className="text-base font-bold text-white">{renderWithLatex(trimmed)}</span>
                              </div>
                            </div>
                          );
                        }
                        if (trimmed === '') return <div key={i} className="h-1.5" />;
                        return <div key={i}>{renderWithLatex(line)}</div>;
                      })}
                    </div>
                    {section.jsxAfter && <div className="mt-3">{section.jsxAfter}</div>}
                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* ── CONTOH SOAL TAB ── */}
        {activeTab === "contoh" && contohSoal && (
          <div className="animate-slide-up">
            {/* Info banner */}
            <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2.5"
              style={isWhite
                ? { background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)" }
                : { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.22)" }}>
              <Lightbulb className="w-4 h-4 shrink-0 text-emerald-400" />
              <p className="font-body text-xs leading-relaxed" style={{ color: isWhite ? "#065f46" : "rgba(255,255,255,0.6)" }}>
                Soal-soal berikut disertai <span className="font-semibold" style={{ color: isWhite ? "#059669" : "#6ee7b7" }}>pembahasan lengkap</span>. Coba kerjakan terlebih dahulu sebelum melihat solusinya.
              </p>
            </div>

            <div className="space-y-4">
              {contohSoal.map((soal, qi) => {
                const type = soal.type ?? "pg";
                const selected = selectedContohAnswers[soal.no];
                const bsArr = pgkbsContohAnswers[soal.no] ?? Array(soal.pernyataan?.length ?? 3).fill(null);
                const typeBadge = TYPE_BADGE[type];

                return (
                  <div key={soal.no} className="relative rounded-2xl overflow-hidden"
                    style={isWhite ? {
                      background: "var(--bg-card)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    } : {
                      background: "linear-gradient(135deg, rgba(20,20,40,0.95) 0%, rgba(15,10,30,0.98) 100%)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}>

                    {/* ── Question header: number + type badge + soal text ── */}
                    <div className="flex items-start gap-3 px-5 pt-4 pb-2">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-display mt-0.5"
                        style={{
                          background: "linear-gradient(135deg, rgba(16,185,129,0.4), rgba(5,150,105,0.2))",
                          border: "1px solid rgba(52,211,153,0.3)",
                          color: "#6ee7b7",
                        }}>
                        {qi + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[9px] font-bold font-display px-2 py-0.5 rounded-full mb-1.5 ${typeBadge.color}`}
                          style={{ background: typeBadge.bg, border: `1px solid ${typeBadge.border}` }}>
                          {typeBadge.label}
                        </span>
                        <div className="font-body text-sm leading-relaxed" style={{ color: isWhite ? "var(--text-primary)" : "rgba(255,255,255,0.9)" }}>
                          {soal.soal.split('\n').map((line, lineIdx) => (
                            <span key={lineIdx}>
                              {lineIdx > 0 && <br />}
                              {renderWithLatex(line)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── PGK: numbered pernyataan list ── */}
                    {type === "pgk" && soal.pernyataan && (
                      <div className="px-5 pb-2 space-y-1.5 ml-11">
                        {soal.pernyataan.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 text-xs font-body leading-relaxed"
                            style={{ color: isWhite ? "var(--text-secondary)" : "rgba(255,255,255,0.8)" }}>
                            <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-display mt-0.5"
                              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#fcd34d" }}>
                              {pi + 1}
                            </span>
                            <span>{renderWithLatex(p)}</span>
                          </div>
                        ))}
                        <p className="text-[11px] font-body text-amber-300/60 mt-2 italic">
                          Pernyataan yang <span className="font-bold not-italic text-amber-300/80">BENAR</span> adalah ...
                        </p>
                      </div>
                    )}

                    {/* ── PG & PGK: options (correct always highlighted green) ── */}
                    {(type === "pg" || type === "pgk") && soal.options && soal.options.length > 0 && (
                      <div className="px-5 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {soal.options.map((opt, j) => {
                          const letter = optionLetters[j];
                          const isSelected = selected === letter;
                          const isThisCorrect = letter === soal.jawaban;

                          let optStyle: React.CSSProperties;
                          if (isThisCorrect) {
                            optStyle = isWhite
                              ? { background: "#dcfce7", border: "1px solid rgba(34,197,94,0.5)", color: "#15803d" }
                              : { background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.5)", color: "#86efac" };
                          } else if (isSelected && !isThisCorrect) {
                            optStyle = isWhite
                              ? { background: "#fef2f2", border: "1px solid rgba(239,68,68,0.4)", color: "#dc2626" }
                              : { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5" };
                          } else {
                            optStyle = isWhite
                              ? { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }
                              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)" };
                          }

                          return (
                            <button
                              key={j}
                              onClick={() => {
                                if (!selected) {
                                  playPopSound();
                                  setSelectedContohAnswers(prev => ({ ...prev, [soal.no]: letter }));
                                }
                              }}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all duration-200 text-xs font-body"
                              style={{ ...optStyle, cursor: selected ? "default" : "pointer" }}
                            >
                              <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-display"
                                style={{
                                  background: isThisCorrect ? "rgba(34,197,94,0.3)" : isSelected && !isThisCorrect ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)",
                                  color: "inherit",
                                }}>
                                {letter}
                              </span>
                              <span className="leading-snug">{renderWithLatex(opt.replace(/^[A-E]\.\s*/, ''))}</span>
                              {isThisCorrect && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-auto text-green-400" />}
                              {isSelected && !isThisCorrect && <XCircle className="w-3.5 h-3.5 shrink-0 ml-auto text-red-400" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* ── PGKBS: pernyataan B/S table (always shows key) ── */}
                    {type === "pgkbs" && soal.pernyataan && (
                      <div className="px-5 pb-3 ml-11">
                        <div className="rounded-xl overflow-hidden border"
                          style={{ borderColor: "rgba(6,182,212,0.2)", background: "rgba(6,182,212,0.04)" }}>
                          <div className="grid grid-cols-[1fr_auto_auto] gap-0 border-b"
                            style={{ borderColor: "rgba(6,182,212,0.15)" }}>
                            <div className="px-3 py-1.5 text-[9px] font-bold font-display tracking-widest uppercase text-cyan-400/60">Pernyataan</div>
                            <div className="w-14 text-center py-1.5 text-[9px] font-bold font-display tracking-widest uppercase text-emerald-400/60">Benar</div>
                            <div className="w-14 text-center py-1.5 text-[9px] font-bold font-display tracking-widest uppercase text-rose-400/60">Salah</div>
                          </div>
                          {soal.pernyataan.map((p, pi) => {
                            const correctAns = soal.jawabanBS?.[pi];
                            const userAns = bsArr[pi];
                            return (
                              <div key={pi}
                                className={`grid grid-cols-[1fr_auto_auto] gap-0 ${pi < soal.pernyataan!.length - 1 ? "border-b" : ""}`}
                                style={{ borderColor: "rgba(6,182,212,0.1)" }}>
                                <div className="px-3 py-2.5 flex items-center gap-2 min-w-0">
                                  <span className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold font-display"
                                    style={{ background: "rgba(6,182,212,0.15)", color: "#67e8f9" }}>
                                    {pi + 1}
                                  </span>
                                  <span className="font-body text-xs leading-snug flex-1 min-w-0"
                                    style={{ color: isWhite ? "var(--text-secondary)" : "rgba(255,255,255,0.8)" }}>
                                    {renderWithLatex(p)}
                                  </span>
                                </div>
                                {(["B", "S"] as const).map(choice => {
                                  const isCorrectChoice = correctAns === choice;
                                  const isUserChoice = userAns === choice;
                                  return (
                                    <div key={choice} className="w-14 flex items-center justify-center py-2">
                                      <button
                                        onClick={() => {
                                          if (userAns === null || userAns === undefined) {
                                            playPopSound();
                                            setPgkbsContohAnswers(prev => {
                                              const cur: ("B" | "S" | null)[] = prev[soal.no] ? [...prev[soal.no]] : Array(soal.pernyataan!.length).fill(null);
                                              cur[pi] = choice;
                                              return { ...prev, [soal.no]: cur };
                                            });
                                          }
                                        }}
                                        className="w-8 h-7 rounded-lg text-[10px] font-bold font-display transition-all duration-150"
                                        style={
                                          isCorrectChoice
                                            ? { background: choice === "B" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)", border: `1px solid ${choice === "B" ? "rgba(34,197,94,0.6)" : "rgba(239,68,68,0.6)"}`, color: choice === "B" ? "#86efac" : "#fca5a5" }
                                            : isUserChoice && !isCorrectChoice
                                              ? { background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", cursor: "default" }
                                              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", cursor: userAns != null ? "default" : "pointer" }
                                        }>
                                        {choice}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                          {/* Answer key row */}
                          <div className="px-3 py-2 border-t flex items-center gap-2"
                            style={{ borderColor: "rgba(6,182,212,0.15)", background: "rgba(6,182,212,0.06)" }}>
                            <span className="text-[9px] font-body text-cyan-400/60">Kunci:</span>
                            {soal.jawabanBS?.map((ans, i) => (
                              <span key={i} className="text-[10px] font-bold font-display px-2 py-0.5 rounded-md"
                                style={{
                                  background: ans === "B" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                                  color: ans === "B" ? "#86efac" : "#fca5a5",
                                  border: `1px solid ${ans === "B" ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
                                }}>
                                ({i + 1}) {ans}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Pembahasan — always visible ── */}
                    {soal.pembahasan && (
                      <div className="mx-4 mb-4 rounded-xl p-4"
                        style={isWhite ? {
                          background: "rgba(16,185,129,0.06)",
                          border: "1px solid rgba(16,185,129,0.25)",
                        } : {
                          background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.05))",
                          border: "1px solid rgba(16,185,129,0.2)",
                        }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-display text-[10px] font-bold tracking-widest uppercase text-emerald-400/80">Pembahasan</span>
                        </div>
                        <div className="font-body text-xs leading-relaxed whitespace-pre-wrap"
                          style={{ color: isWhite ? "#065f46" : "rgba(255,255,255,0.75)" }}>
                          {soal.pembahasan.split('\n').map((line, i) => (
                            <span key={i}>{i > 0 && <br />}{renderWithLatex(line)}</span>
                          ))}
                        </div>
                        {(soal.jawaban || soal.jawabanBS) && (
                          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-body text-white/40">Kunci jawaban:</span>
                            {soal.jawaban && (
                              <span className="font-display text-xs font-bold px-2.5 py-0.5 rounded-lg text-green-300"
                                style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                                {soal.jawaban}
                              </span>
                            )}
                            {soal.jawabanBS?.map((ans, i) => (
                              <span key={i} className="font-display text-xs font-bold px-2.5 py-0.5 rounded-lg"
                                style={{
                                  background: ans === "B" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                                  border: `1px solid ${ans === "B" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                                  color: ans === "B" ? "#86efac" : "#fca5a5",
                                }}>
                                ({i + 1}) {ans}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LATIHAN TAB ── */}
        {activeTab === "dasar" && (
          <div className="animate-slide-up">

            {/* Score summary */}
            {answeredCount > 0 && (
              <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-3"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
                <div className="text-2xl font-display font-bold text-white">
                  {correctCount}<span className="text-sm text-white/40">/{answeredCount}</span>
                </div>
                <div className="flex-1">
                  <p className="font-body text-xs text-white/60">Soal terjawab benar</p>
                  <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0}%`,
                        background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                      }} />
                  </div>
                </div>
                <span className="font-display text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)" }}>
                  {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
                </span>
              </div>
            )}

            <div className="space-y-4">
              {latihanDasar.map((soal, qi) => {
                const type = soal.type ?? "pg";
                const selected = selectedAnswers[soal.no];
                const isRevealed = revealedAnswers.has(soal.no);
                const bsArr = pgkbsAnswers[soal.no] ?? Array(soal.pernyataan?.length ?? 3).fill(null);
                const bsAllAnswered = type === "pgkbs"
                  ? bsArr.length === (soal.pernyataan?.length ?? 3) && bsArr.every(a => a !== null)
                  : false;
                const hasAnswered = type === "pgkbs" ? bsAllAnswered : !!selected;
                const isCorrect = type === "pgkbs"
                  ? (soal.jawabanBS?.every((ans, i) => bsArr[i] === ans) ?? false)
                  : selected === soal.jawaban;
                const typeBadge = TYPE_BADGE[type];

                return (
                  <div key={soal.no} className="relative rounded-2xl overflow-hidden"
                    style={isWhite ? {
                      background: "var(--bg-card)",
                      border: isRevealed
                        ? isCorrect ? "1px solid rgba(34,197,94,0.45)" : "1px solid rgba(239,68,68,0.45)"
                        : hasAnswered ? "1px solid rgba(33,150,243,0.45)" : "1px solid rgba(0,0,0,0.08)",
                    } : {
                      background: "linear-gradient(135deg, rgba(20,20,40,0.95) 0%, rgba(15,10,30,0.98) 100%)",
                      border: isRevealed
                        ? isCorrect ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(239,68,68,0.4)"
                        : hasAnswered ? "1px solid rgba(99,102,241,0.45)" : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isRevealed
                        ? isCorrect ? "0 4px 20px rgba(34,197,94,0.1)" : "0 4px 20px rgba(239,68,68,0.1)"
                        : "0 4px 20px rgba(0,0,0,0.3)",
                    }}>

                    {/* ── Question header: number + type badge + soal text ── */}
                    <div className="flex items-start gap-3 px-5 pt-4 pb-2">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-display mt-0.5"
                        style={{
                          background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2))",
                          border: "1px solid rgba(167,139,250,0.3)",
                          color: "#a5b4fc",
                        }}>
                        {qi + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        {/* Type badge */}
                        <span className={`inline-block text-[9px] font-bold font-display px-2 py-0.5 rounded-full mb-1.5 ${typeBadge.color}`}
                          style={{ background: typeBadge.bg, border: `1px solid ${typeBadge.border}` }}>
                          {typeBadge.label}
                        </span>
                        {/* Soal text */}
                        <div className="font-body text-sm text-white/90 leading-relaxed">
                          {soal.soal.split('\n').map((line, lineIdx) => {
                            const imgMatch = line.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
                            if (imgMatch) {
                              const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'max-w-sm w-full';
                              return (
                                <div key={lineIdx} className="my-2 flex justify-center">
                                  <img src={imgMatch[1]} alt={`Soal ${soal.no}`} className={`${sizeClass} rounded-xl`} />
                                </div>
                              );
                            }
                            return (
                              <span key={lineIdx}>
                                {lineIdx > 0 && <br />}
                                {renderWithLatex(line)}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ── PGK: numbered pernyataan list ── */}
                    {(type === "pgk") && soal.pernyataan && (
                      <div className="px-5 pb-2 space-y-1.5 ml-11">
                        {soal.pernyataan.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 text-xs font-body text-white/80 leading-relaxed">
                            <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-display mt-0.5"
                              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#fcd34d" }}>
                              {pi + 1}
                            </span>
                            <span>{renderWithLatex(p)}</span>
                          </div>
                        ))}
                        <p className="text-[11px] font-body text-amber-300/60 mt-2 italic">
                          Pernyataan yang <span className="font-bold not-italic text-amber-300/80">BENAR</span> adalah ...
                        </p>
                      </div>
                    )}

                    {/* ── PG & PGK: A-D combo options grid ── */}
                    {(type === "pg" || type === "pgk") && soal.options && soal.options.length > 0 && (
                      <div className="px-5 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {soal.options.map((opt, j) => {
                          const letter = optionLetters[j];
                          const isSelected = selected === letter;
                          const isThisCorrect = letter === soal.jawaban;

                          let optStyle: React.CSSProperties = isWhite ? {
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                            color: "var(--text-primary)",
                          } : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.7)",
                          };
                          if (isRevealed) {
                            if (isThisCorrect) {
                              optStyle = isWhite ? {
                                background: "#dcfce7", border: "1px solid rgba(34,197,94,0.5)", color: "#15803d",
                              } : {
                                background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.5)", color: "#86efac",
                              };
                            } else if (isSelected && !isThisCorrect) {
                              optStyle = isWhite ? {
                                background: "#fef2f2", border: "1px solid rgba(239,68,68,0.4)", color: "#dc2626",
                              } : {
                                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5",
                              };
                            }
                          } else if (isSelected) {
                            optStyle = isWhite ? {
                              background: "#eff6ff", border: "1px solid rgba(33,150,243,0.5)", color: "#1d4ed8",
                            } : {
                              background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.6)", color: "#c7d2fe",
                            };
                          }

                          return (
                            <button
                              key={j}
                              onClick={() => handleSelectAnswer(soal.no, letter)}
                              disabled={isRevealed}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all duration-200 text-xs font-body"
                              style={{ ...optStyle, cursor: isRevealed ? "default" : "pointer" }}
                            >
                              <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-display"
                                style={{
                                  background: isRevealed && isThisCorrect
                                    ? "rgba(34,197,94,0.3)"
                                    : isRevealed && isSelected && !isThisCorrect
                                      ? "rgba(239,68,68,0.3)"
                                      : isSelected ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)",
                                  color: "inherit",
                                }}>
                                {letter}
                              </span>
                              {(() => {
                                const pipeIdx = opt.indexOf('|');
                                const isImg = pipeIdx !== -1 && (opt[pipeIdx + 1] === '/' || opt.slice(pipeIdx + 1, pipeIdx + 5) === 'http');
                                if (isImg) {
                                  return <img src={opt.slice(pipeIdx + 1)} alt={`Pilihan ${letter}`} className="max-w-[140px] w-full bg-white rounded p-1" />;
                                }
                                return <span className="leading-snug">{renderWithLatex(opt.replace(/^[A-E]\.\s*/, ''))}</span>;
                              })()}
                              {isRevealed && isThisCorrect && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-auto text-green-400" />}
                              {isRevealed && isSelected && !isThisCorrect && <XCircle className="w-3.5 h-3.5 shrink-0 ml-auto text-red-400" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* ── PGKBS: pernyataan + B/S buttons ── */}
                    {type === "pgkbs" && soal.pernyataan && (
                      <div className="px-5 pb-3 ml-11">
                        <div className="rounded-xl overflow-hidden border"
                          style={{ borderColor: "rgba(6,182,212,0.2)", background: "rgba(6,182,212,0.04)" }}>
                          {/* Header row */}
                          <div className="grid grid-cols-[1fr_auto_auto] gap-0 border-b"
                            style={{ borderColor: "rgba(6,182,212,0.15)" }}>
                            <div className="px-3 py-1.5 text-[9px] font-bold font-display tracking-widest uppercase text-cyan-400/60">Pernyataan</div>
                            <div className="w-14 text-center py-1.5 text-[9px] font-bold font-display tracking-widest uppercase text-emerald-400/60">Benar</div>
                            <div className="w-14 text-center py-1.5 text-[9px] font-bold font-display tracking-widest uppercase text-rose-400/60">Salah</div>
                          </div>
                          {/* Pernyataan rows */}
                          {soal.pernyataan.map((p, pi) => {
                            const userAns = bsArr[pi];
                            const correctAns = soal.jawabanBS?.[pi];
                            const rowCorrect = isRevealed && userAns === correctAns;
                            const rowWrong = isRevealed && userAns !== correctAns;

                            return (
                              <div key={pi}
                                className={`grid grid-cols-[1fr_auto_auto] gap-0 ${pi < soal.pernyataan!.length - 1 ? "border-b" : ""}`}
                                style={{
                                  borderColor: "rgba(6,182,212,0.1)",
                                  background: isRevealed
                                    ? rowCorrect ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)"
                                    : "transparent",
                                }}>
                                {/* Statement text */}
                                <div className="px-3 py-2.5 flex items-center gap-2 min-w-0">
                                  <span className="flex-shrink-0 w-4.5 h-4.5 rounded flex items-center justify-center text-[9px] font-bold font-display"
                                    style={{ background: "rgba(6,182,212,0.15)", color: "#67e8f9" }}>
                                    {pi + 1}
                                  </span>
                                  <span className="font-body text-xs text-white/80 leading-snug flex-1 min-w-0">
                                    {renderWithLatex(p)}
                                  </span>
                                  {isRevealed && (
                                    rowCorrect
                                      ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-400" />
                                      : <XCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                                  )}
                                </div>
                                {/* Benar button */}
                                <div className="w-14 flex items-center justify-center py-2">
                                  <button
                                    disabled={isRevealed}
                                    onClick={() => handleSelectBS(soal.no, pi, "B", soal.pernyataan!.length)}
                                    className="w-8 h-7 rounded-lg text-[10px] font-bold font-display transition-all duration-150"
                                    style={
                                      isRevealed
                                        ? correctAns === "B"
                                          ? { background: "rgba(34,197,94,0.3)", border: "1px solid rgba(34,197,94,0.6)", color: "#86efac", cursor: "default" }
                                          : userAns === "B"
                                            ? { background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", cursor: "default" }
                                            : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)", cursor: "default" }
                                        : userAns === "B"
                                          ? { background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.5)", color: "#86efac", cursor: "pointer" }
                                          : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", cursor: "pointer" }
                                    }>
                                    B
                                  </button>
                                </div>
                                {/* Salah button */}
                                <div className="w-14 flex items-center justify-center py-2">
                                  <button
                                    disabled={isRevealed}
                                    onClick={() => handleSelectBS(soal.no, pi, "S", soal.pernyataan!.length)}
                                    className="w-8 h-7 rounded-lg text-[10px] font-bold font-display transition-all duration-150"
                                    style={
                                      isRevealed
                                        ? correctAns === "S"
                                          ? { background: "rgba(239,68,68,0.3)", border: "1px solid rgba(239,68,68,0.6)", color: "#fca5a5", cursor: "default" }
                                          : userAns === "S"
                                            ? { background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", cursor: "default" }
                                            : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)", cursor: "default" }
                                        : userAns === "S"
                                          ? { background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)", color: "#fca5a5", cursor: "pointer" }
                                          : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", cursor: "pointer" }
                                    }>
                                    S
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                          {/* PGKBS reveal answer row */}
                          {isRevealed && soal.jawabanBS && (
                            <div className="px-3 py-2 border-t flex items-center gap-2"
                              style={{ borderColor: "rgba(6,182,212,0.15)", background: "rgba(6,182,212,0.06)" }}>
                              <span className="text-[9px] font-body text-cyan-400/60">Kunci:</span>
                              {soal.jawabanBS.map((ans, i) => (
                                <span key={i} className="text-[10px] font-bold font-display px-2 py-0.5 rounded-md"
                                  style={{
                                    background: ans === "B" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                                    color: ans === "B" ? "#86efac" : "#fca5a5",
                                    border: `1px solid ${ans === "B" ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
                                  }}>
                                  ({i + 1}) {ans}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── Action row ── */}
                    <div className="px-5 pb-4 flex items-center justify-between gap-3">
                      {!isRevealed ? (
                        <button
                          onClick={() => handleReveal(soal.no)}
                          disabled={!hasAnswered}
                          className="font-display text-xs px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 font-bold"
                          style={hasAnswered ? {
                            background: "linear-gradient(135deg, rgba(99,102,241,0.7), rgba(139,92,246,0.5))",
                            color: "var(--text-primary)",
                            border: "1px solid rgba(167,139,250,0.4)",
                            boxShadow: "0 2px 10px rgba(99,102,241,0.3)",
                            cursor: "pointer",
                          } : {
                            background: "var(--btn-bg)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                            cursor: "not-allowed",
                          }}>
                          Cek Jawaban
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 font-display">
                              <CheckCircle2 className="w-4 h-4" /> Semua Benar!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 font-display">
                              <XCircle className="w-4 h-4" /> Ada yang Salah
                            </span>
                          )}
                        </div>
                      )}

                      {isRevealed && (
                        <button
                          onClick={() => handleHide(soal.no)}
                          className="font-body text-[11px] text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                        >
                          Coba Lagi
                        </button>
                      )}
                    </div>

                    {/* ── Pembahasan ── */}
                    {isRevealed && soal.pembahasan && (
                      <div className="mx-4 mb-4 rounded-xl p-4 animate-slide-up"
                        style={{
                          background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))",
                          border: "1px solid rgba(99,102,241,0.2)",
                        }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-display text-[10px] font-bold tracking-widest uppercase text-amber-400/80">Pembahasan</span>
                        </div>
                        <div className="font-body text-xs text-white/75 leading-relaxed whitespace-pre-wrap">
                          {(soal.pembahasan ?? '').split('\n').map((line, i) => (
                            <span key={i}>{i > 0 && <br />}{renderWithLatex(line)}</span>
                          ))}
                        </div>
                        {(soal.jawaban || soal.jawabanBS) && (
                          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-body text-white/40">Kunci jawaban:</span>
                            {soal.jawaban && (
                              <span className="font-display text-xs font-bold px-2.5 py-0.5 rounded-lg text-green-300"
                                style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                                {soal.jawaban}
                              </span>
                            )}
                            {soal.jawabanBS && soal.jawabanBS.map((ans, i) => (
                              <span key={i} className="font-display text-xs font-bold px-2.5 py-0.5 rounded-lg"
                                style={{
                                  background: ans === "B" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                                  border: `1px solid ${ans === "B" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                                  color: ans === "B" ? "#86efac" : "#fca5a5",
                                }}>
                                ({i + 1}) {ans}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Back button ── */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => { playPopSound(); navigate(backPath); }}
            className="group flex items-center gap-2 font-body text-sm text-white/30 hover:text-violet-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Modul Pemantapan TKA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKAPemantapanLayout;
