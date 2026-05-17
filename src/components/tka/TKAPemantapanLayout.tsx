import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
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

const TKAPemantapanLayout = ({ title, backPath = "/tka/modul-pemantapan", materiSections, latihanDasar }: Props) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() =>
    Array.from({ length: materiSections.length }, (_, i) => i)
  );
  const [showPembahasan, setShowPembahasan] = useState<Set<number>>(new Set());

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasan = (no: number) => {
    playPopSound();
    setShowPembahasan(prev => {
      const next = new Set(prev);
      if (next.has(no)) next.delete(no); else next.add(no);
      return next;
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PEMANTAPAN TKA — {title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-cyan-500 text-white border-cyan-400"
                  : "bg-card/80 text-white/70 border-border hover:border-cyan-400/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSections.map((section, idx) => (
              <div
                key={idx}
                className="backdrop-blur border rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
                  borderColor: expandedSections.includes(idx) ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: expandedSections.includes(idx)
                    ? "0 0 24px rgba(34,211,238,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.35)" }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm text-cyan-400 font-bold group-hover:text-cyan-300 transition-colors">
                      {section.heading}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        const imgMatch = trimmed.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
                        if (imgMatch) {
                          const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'max-w-sm w-full';
                          return (
                            <div key={i} className="my-2 flex justify-center">
                              <img src={imgMatch[1]} alt="Gambar materi" className={`${sizeClass} rounded-lg`} />
                            </div>
                          );
                        }
                        if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
                          return (
                            <div key={i} className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white shadow-lg">
                              <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        if (trimmed === '') return <div key={i} className="h-2" />;
                        return <div key={i} className="mb-1">{renderWithLatex(line)}</div>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map(soal => {
              const isOpen = showPembahasan.has(soal.no);
              return (
                <div
                  key={soal.no}
                  className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-cyan-400/40 transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                  }}
                >
                  <div className="relative p-5">
                    <div className="font-body text-sm text-white mb-3 leading-relaxed">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold mr-2">
                        {soal.no}
                      </span>
                      {soal.soal.split('\n').map((line, lineIdx) => {
                        const imgMatch = line.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
                        if (imgMatch) {
                          const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'max-w-sm w-full';
                          return (
                            <div key={lineIdx} className="my-2 flex justify-center">
                              <img src={imgMatch[1]} alt={`Gambar soal ${soal.no}`} className={`${sizeClass} rounded-lg`} />
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

                    {soal.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {soal.options.map((opt, j) => (
                          <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-cyan-400/30 transition-all duration-200">
                            {renderWithLatex(opt)}
                          </div>
                        ))}
                      </div>
                    )}

                    {soal.pembahasan && (
                      <>
                        <button
                          onClick={() => togglePembahasan(soal.no)}
                          className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer mt-2"
                        >
                          {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {isOpen && (
                          <div
                            className="mt-3 p-4 rounded-xl border border-cyan-400/30 animate-slide-up"
                            style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.05) 0%, rgba(139,92,246,0.05) 100%)" }}
                          >
                            <div className="font-body text-xs text-white/80 whitespace-pre-wrap leading-relaxed">
                              {soal.pembahasan.split('\n').map((line, i) => (
                                <span key={i}>{i > 0 && <br />}{renderWithLatex(line)}</span>
                              ))}
                            </div>
                            {soal.jawaban && (
                              <div className="mt-2 text-xs font-bold text-emerald-400">
                                Jawaban: {soal.jawaban}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate(backPath); }}
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Modul Pemantapan TKA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKAPemantapanLayout;
