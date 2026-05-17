import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2, XCircle, Lightbulb, ArrowLeft, BookMarked, PenLine } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export interface MateriSection {
  heading: string;
  content: string;
}

export interface LatihanSoal {
  no: number;
  soal: string;
  options: string[];
  jawaban?: string;
  pembahasan?: string;
}

interface Props {
  title: string;
  backPath?: string;
  materiSections: MateriSection[];
  latihanDasar: LatihanSoal[];
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

const TKAPemantapanLayout = ({ title, backPath = "/tka/modul-pemantapan", materiSections, latihanDasar }: Props) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() =>
    Array.from({ length: materiSections.length }, (_, i) => i)
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleSelectAnswer = (soalNo: number, letter: string) => {
    if (revealedAnswers.has(soalNo)) return;
    playPopSound();
    setSelectedAnswers(prev => ({ ...prev, [soalNo]: letter }));
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
  };

  const correctCount = latihanDasar.filter(s =>
    revealedAnswers.has(s.no) && selectedAnswers[s.no] === s.jawaban
  ).length;
  const answeredCount = revealedAnswers.size;

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f0c29 0%, #141428 40%, #1a0a2e 70%, #0d1117 100%)" }}>
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 pt-8 pb-14">

        {/* ── Header ── */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
            style={{ background: "radial-gradient(ellipse at 50% 0%, #6366f1 0%, transparent 70%)" }} />
          <div className="relative rounded-2xl overflow-hidden border border-indigo-500/30"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 50%, rgba(15,12,41,0.9) 100%)" }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)" }} />

            <div className="px-6 py-6 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2))", border: "1px solid rgba(167,139,250,0.35)" }}>
                  <BookMarked className="w-4.5 h-4.5 text-violet-300" />
                </div>
                <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-violet-400/70">
                  Modul Pemantapan TKA
                </span>
              </div>

              <h1 className="font-display text-xl md:text-2xl font-bold text-white mb-1 leading-tight"
                style={{ textShadow: "0 0 40px rgba(167,139,250,0.5)" }}>
                {title}
              </h1>
              <p className="font-body text-[11px] text-violet-300/50 mb-4">Irawan Sutiawan, M.Pd</p>

              <div className="flex gap-2 flex-wrap justify-center">
                <span className="text-[10px] font-body px-3 py-1 rounded-full border font-semibold"
                  style={{ background: "rgba(99,102,241,0.15)", borderColor: "rgba(99,102,241,0.35)", color: "#a5b4fc" }}>
                  📖 {materiSections.length} Materi
                </span>
                <span className="text-[10px] font-body px-3 py-1 rounded-full border font-semibold"
                  style={{ background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.35)", color: "#c4b5fd" }}>
                  ✏️ {latihanDasar.length} Soal Latihan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Switcher ── */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { key: "materi" as const, label: "📘 Ringkasan Materi", icon: BookOpen },
            { key: "dasar" as const, label: "✏️ Latihan Soal", icon: PenLine },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className="flex-1 font-display text-xs py-2.5 px-3 rounded-lg cursor-pointer transition-all duration-200 font-bold"
              style={activeTab === tab.key ? {
                background: "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.4))",
                color: "white",
                boxShadow: "0 2px 12px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                border: "1px solid rgba(167,139,250,0.4)",
              } : {
                color: "rgba(255,255,255,0.4)",
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
              const isOpen = expandedSections.includes(idx);
              return (
                <div key={idx} className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${color.border}`}
                  style={{
                    background: isOpen
                      ? `linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(15,12,41,0.95) 100%)`
                      : "rgba(255,255,255,0.03)",
                    boxShadow: isOpen ? "0 4px 24px rgba(99,102,241,0.12)" : "none",
                  }}>

                  {isOpen && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                      style={{ background: `linear-gradient(to bottom, #6366f1, #8b5cf6)` }} />
                  )}

                  <button onClick={() => toggleSection(idx)}
                    className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer text-left group pl-6">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${color.badge}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm font-bold text-white/90 group-hover:text-white flex-1 leading-snug transition-colors">
                      {section.heading}
                    </span>
                    <span className="shrink-0 text-white/30 group-hover:text-white/60 transition-colors">
                      {isOpen
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-white/5 animate-slide-up">
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
                    </div>
                  )}
                </div>
              );
            })}

            <div className="mt-2 px-4 py-3 rounded-xl flex items-center gap-2.5"
              style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
              <p className="font-body text-xs text-white/50 leading-relaxed">
                Pelajari semua materi di atas, lalu uji pemahamanmu di tab <span className="text-violet-300 font-semibold">Latihan Soal</span>.
              </p>
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
                const selected = selectedAnswers[soal.no];
                const isRevealed = revealedAnswers.has(soal.no);
                const isCorrect = selected === soal.jawaban;

                return (
                  <div key={soal.no} className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(20,20,40,0.95) 0%, rgba(15,10,30,0.98) 100%)",
                      border: isRevealed
                        ? isCorrect
                          ? "1px solid rgba(34,197,94,0.4)"
                          : "1px solid rgba(239,68,68,0.4)"
                        : selected
                          ? "1px solid rgba(99,102,241,0.45)"
                          : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isRevealed
                        ? isCorrect
                          ? "0 4px 20px rgba(34,197,94,0.1)"
                          : "0 4px 20px rgba(239,68,68,0.1)"
                        : "0 4px 20px rgba(0,0,0,0.3)",
                    }}>

                    {/* Question number bar */}
                    <div className="flex items-center gap-3 px-5 pt-4 pb-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-display"
                        style={{
                          background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2))",
                          border: "1px solid rgba(167,139,250,0.3)",
                          color: "#a5b4fc",
                        }}>
                        {qi + 1}
                      </span>
                      <div className="font-body text-sm text-white/90 leading-relaxed flex-1">
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

                    {/* Answer options */}
                    {soal.options.length > 0 && (
                      <div className="px-5 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {soal.options.map((opt, j) => {
                          const letter = optionLetters[j];
                          const isSelected = selected === letter;
                          const isThisCorrect = letter === soal.jawaban;

                          let optStyle: React.CSSProperties = {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.7)",
                          };
                          if (isRevealed) {
                            if (isThisCorrect) {
                              optStyle = {
                                background: "rgba(34,197,94,0.15)",
                                border: "1px solid rgba(34,197,94,0.5)",
                                color: "#86efac",
                              };
                            } else if (isSelected && !isThisCorrect) {
                              optStyle = {
                                background: "rgba(239,68,68,0.12)",
                                border: "1px solid rgba(239,68,68,0.4)",
                                color: "#fca5a5",
                              };
                            }
                          } else if (isSelected) {
                            optStyle = {
                              background: "rgba(99,102,241,0.2)",
                              border: "1px solid rgba(99,102,241,0.6)",
                              color: "#c7d2fe",
                            };
                          }

                          return (
                            <button
                              key={j}
                              onClick={() => handleSelectAnswer(soal.no, letter)}
                              disabled={isRevealed}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all duration-200 text-xs font-body"
                              style={{
                                ...optStyle,
                                cursor: isRevealed ? "default" : "pointer",
                              }}
                            >
                              <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-display"
                                style={{
                                  background: isRevealed && isThisCorrect
                                    ? "rgba(34,197,94,0.3)"
                                    : isRevealed && isSelected && !isThisCorrect
                                      ? "rgba(239,68,68,0.3)"
                                      : isSelected
                                        ? "rgba(99,102,241,0.4)"
                                        : "rgba(255,255,255,0.08)",
                                  color: "inherit",
                                }}>
                                {letter}
                              </span>
                              <span className="leading-snug">{renderWithLatex(opt.replace(/^[A-E]\.\s*/, ''))}</span>
                              {isRevealed && isThisCorrect && (
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-auto text-green-400" />
                              )}
                              {isRevealed && isSelected && !isThisCorrect && (
                                <XCircle className="w-3.5 h-3.5 shrink-0 ml-auto text-red-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Action row */}
                    <div className="px-5 pb-4 flex items-center justify-between gap-3">
                      {!isRevealed ? (
                        <button
                          onClick={() => handleReveal(soal.no)}
                          disabled={!selected}
                          className="font-display text-xs px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 font-bold"
                          style={selected ? {
                            background: "linear-gradient(135deg, rgba(99,102,241,0.7), rgba(139,92,246,0.5))",
                            color: "white",
                            border: "1px solid rgba(167,139,250,0.4)",
                            boxShadow: "0 2px 10px rgba(99,102,241,0.3)",
                          } : {
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.25)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            cursor: "not-allowed",
                          }}>
                          Cek Jawaban
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 font-display">
                              <CheckCircle2 className="w-4 h-4" /> Jawaban Benar!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 font-display">
                              <XCircle className="w-4 h-4" /> Jawaban Salah
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

                    {/* Pembahasan */}
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
                          {soal.pembahasan.split('\n').map((line, i) => (
                            <span key={i}>{i > 0 && <br />}{renderWithLatex(line)}</span>
                          ))}
                        </div>
                        {soal.jawaban && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <span className="text-[10px] font-body text-white/40">Kunci jawaban:</span>
                            <span className="font-display text-xs font-bold px-2.5 py-0.5 rounded-lg text-green-300"
                              style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                              {soal.jawaban}
                            </span>
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
