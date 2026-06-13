import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Zap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import DiskMillMachine from "@/components/DiskMillMachine";

const PengertianFungsiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "penyajian", "bukan-fungsi", "contoh1", "contoh2", "contoh3", "contoh4", "rangkuman",
  ]);
  const [soal4Answers, setSoal4Answers] = useState<Record<number,"fungsi"|"bukan">>({});
  const [soal4Checked, setSoal4Checked] = useState(false);
  const soal4Correct: Record<number,"fungsi"|"bukan"> = {1:"fungsi",2:"fungsi",3:"bukan",4:"fungsi",5:"bukan",6:"fungsi"};

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENGERTIAN FUNGSI DAN PENYAJIANNYA
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Relasi Spesial: Satu Masukan, Tepat Satu Keluaran!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Relasi dan Fungsi · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Fungsi — Relasi yang Lebih Ketat Aturannya" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan sebuah mesin pencetak nama: kamu masukkan satu nama, mesin mencetak satu label. Tidak mungkin mesin mencetak dua label berbeda dari satu nama yang sama. Itulah inti dari <strong className="text-cyan-300">fungsi</strong> — setiap masukan hanya punya <strong className="text-cyan-300">tepat satu keluaran</strong>.
                </p>
                <DiskMillMachine />
              </div>
            )}
          </div>

          {/* KONSEP DASAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Syarat dan Konsep Fungsi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">Fungsi</strong> (atau pemetaan) dari himpunan <InlineMath math="A" /> ke himpunan <InlineMath math="B" /> adalah relasi yang memenuhi syarat: <strong className="text-yellow-300">setiap anggota domain (A) dipasangkan dengan tepat satu anggota kodomain (B)</strong>.
                  </p>
                </div>

                {/* Syarat fungsi */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-white">✅ Syarat Suatu Relasi Disebut Fungsi:</p>
                  <div className="space-y-2 text-sm font-body">
                    {[
                      { no: "1", syarat: "Setiap anggota domain harus dipasangkan", detail: "Tidak boleh ada anggota A yang tidak punya pasangan di B", color: "border-cyan-500/30 bg-cyan-900/10" },
                      { no: "2", syarat: "Setiap anggota domain hanya boleh dipasangkan SATU kali", detail: "Tidak boleh satu anggota A punya dua pasangan berbeda di B", color: "border-green-500/30 bg-green-900/10" },
                    ].map(({ no, syarat, detail, color }) => (
                      <div key={no} className={`border ${color} rounded-lg p-3 flex gap-3`}>
                        <span className="font-display font-bold text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm">{no}</span>
                        <div>
                          <p className="text-white font-semibold">{syarat}</p>
                          <p className="text-white/60 text-xs mt-0.5">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-orange-200">
                    <strong>⚠️ Catatan:</strong> Boleh saja dua anggota domain berbeda dipasangkan ke anggota kodomain yang sama. Yang tidak boleh adalah satu anggota domain punya dua keluaran berbeda!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* FUNGSI vs BUKAN FUNGSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="bukan-fungsi" icon={<BookOpen className="w-5 h-5" />} iconColor="text-red-400" title="🔍 Fungsi vs Bukan Fungsi" />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                {/* ── DOMAIN, KODOMAIN, RANGE ── */}
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-white">📌 Domain, Kodomain, dan Range</p>
                  <div className="space-y-2 text-xs font-body">
                    <div className="flex items-start gap-3 bg-cyan-900/20 border border-cyan-500/25 rounded-lg px-3 py-2">
                      <span className="font-bold text-cyan-400 min-w-[125px] shrink-0">Domain (Daerah Asal)</span>
                      <span className="text-white/75">Himpunan A — semua nilai masukan <strong className="text-cyan-300">x</strong> yang boleh digunakan fungsi.</span>
                    </div>
                    <div className="flex items-start gap-3 bg-violet-900/20 border border-violet-500/25 rounded-lg px-3 py-2">
                      <span className="font-bold text-violet-400 min-w-[125px] shrink-0">Kodomain (Daerah Kawan)</span>
                      <span className="text-white/75">Himpunan B — semua nilai yang <em>mungkin</em> jadi keluaran. <strong className="text-orange-300">Tidak harus semuanya terpasang!</strong></span>
                    </div>
                    <div className="flex items-start gap-3 bg-green-900/20 border border-green-500/25 rounded-lg px-3 py-2">
                      <span className="font-bold text-green-400 min-w-[125px] shrink-0">Range (Daerah Hasil)</span>
                      <span className="text-white/75">Anggota kodomain yang <em>benar-benar</em> menjadi nilai f(x). <strong className="text-green-300">Range ⊆ Kodomain</strong></span>
                    </div>
                  </div>
                  {/* Contoh visual Domain/Kodomain/Range */}
                  <div className="bg-slate-900/60 rounded-xl p-3 flex flex-col items-center gap-2">
                    <p className="text-[11px] text-white/50 text-center">Contoh: <span className="text-cyan-300 font-mono font-bold">f(x) = x² + 1</span></p>
                    <div className="flex items-stretch justify-center gap-3 flex-wrap text-xs font-body">
                      <div className="bg-cyan-900/40 border border-cyan-500/40 rounded-lg px-3 py-2 text-center">
                        <p className="text-cyan-400 font-bold mb-1 text-[10px] uppercase tracking-wide">Domain A</p>
                        <p className="text-cyan-200 font-mono">{"{-2,-1,0,1,2}"}</p>
                      </div>
                      <div className="flex items-center text-white/30 font-bold">→</div>
                      <div className="bg-violet-900/40 border border-violet-500/40 rounded-lg px-3 py-2 text-center">
                        <p className="text-violet-400 font-bold mb-1 text-[10px] uppercase tracking-wide">Kodomain B</p>
                        <p className="text-violet-200 font-mono">{"{1,2,3,4,5}"}</p>
                        <div className="mt-1.5 pt-1.5 border-t border-violet-500/20">
                          <p className="text-green-400 font-bold text-[10px]">Range = {"{1, 2, 5}"}</p>
                          <p className="text-white/30 text-[9px]">3 dan 4 tidak terpasang</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── TIGA PERBANDINGAN DIAGRAM ── */}
                <p className="font-body text-[10px] font-bold text-white/50 uppercase tracking-widest">Membedakan Fungsi dari Bukan Fungsi:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* FUNGSI — diagram panah oval */}
                  <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-green-300 mb-2 text-center">✅ INI FUNGSI</p>
                    <div className="flex justify-center">
                      <svg width="230" height="195" viewBox="0 0 230 195">
                        <defs>
                          <marker id="fv-ok" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                            <polygon points="0,0 7,2.5 0,5" fill="#22c55e"/>
                          </marker>
                        </defs>
                        {/* Domain oval A */}
                        <ellipse cx="57" cy="100" rx="50" ry="85" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                        <text x="57" y="13" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">A</text>
                        <text x="57" y="188" textAnchor="middle" fill="#06b6d4" fontSize="8" opacity="0.55">Domain</text>
                        {/* A elements */}
                        {([["a",48],["b",100],["c",152]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={57} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        {/* Kodomain oval B */}
                        <ellipse cx="175" cy="103" rx="50" ry="88" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="175" y="13" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        <text x="175" y="192" textAnchor="middle" fill="#8b5cf6" fontSize="8" opacity="0.55">Kodomain</text>
                        {/* B elements */}
                        {([["1",44],["2",82],["3",120],["4",158]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={175} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        {/* Arrows: a→1, b→1, c→3 */}
                        <path d="M73,48 C110,48 138,44 159,44" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fv-ok)"/>
                        <path d="M73,100 C100,92 138,62 159,44" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fv-ok)"/>
                        <path d="M73,152 C105,152 138,128 159,120" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fv-ok)"/>
                      </svg>
                    </div>
                    <p className="text-xs text-white/50 text-center mt-1">a→1, b→1, c→3 · Tiap anggota A tepat 1 panah ✓</p>
                  </div>

                  {/* BUKAN FUNGSI 1 — satu domain ke 2 kodomain */}
                  <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-red-300 mb-1 text-center">❌ BUKAN FUNGSI</p>
                    <p className="font-body text-[10px] text-red-300/60 text-center mb-2">Ada domain → 2 pasangan</p>
                    <div className="flex justify-center">
                      <svg width="230" height="185" viewBox="0 0 230 185">
                        <defs>
                          <marker id="bfv-ok" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                            <polygon points="0,0 7,2.5 0,5" fill="#22c55e"/>
                          </marker>
                          <marker id="bfv-err" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                            <polygon points="0,0 7,2.5 0,5" fill="#ef4444"/>
                          </marker>
                        </defs>
                        <ellipse cx="57" cy="93" rx="50" ry="80" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                        <text x="57" y="11" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">A</text>
                        {([["a",48],["b",93],["c",138]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={57} y={y+4} textAnchor="middle"
                            fill={el==="b" ? "#fca5a5" : "#cffafe"} fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        <ellipse cx="175" cy="93" rx="50" ry="80" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="175" y="11" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        {([["1",48],["2",93],["3",138]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={175} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        <path d="M73,48 C108,48 140,48 159,48" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bfv-ok)"/>
                        <path d="M73,93 C98,78 138,60 159,48" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#bfv-err)"/>
                        <path d="M73,93 C98,108 138,128 159,138" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#bfv-err)"/>
                        <path d="M73,138 C105,138 140,100 159,93" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bfv-ok)"/>
                        <text x="116" y="78" textAnchor="middle" fill="#ef4444" fontSize="8.5" fontWeight="bold">2 panah!</text>
                        <text x="116" y="88" textAnchor="middle" fill="#ef4444" fontSize="7.5" opacity="0.8">↑ tidak boleh</text>
                      </svg>
                    </div>
                    <p className="text-xs text-white/50 text-center mt-1">
                      <span className="text-red-400">b→1 dan b→3 ✗</span>
                    </p>
                  </div>

                  {/* BUKAN FUNGSI 2 — domain tanpa pasangan */}
                  <div className="bg-orange-900/20 border border-orange-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-orange-300 mb-1 text-center">❌ BUKAN FUNGSI</p>
                    <p className="font-body text-[10px] text-orange-300/60 text-center mb-2">Ada domain tak berpasangan</p>
                    <div className="flex justify-center">
                      <svg width="230" height="210" viewBox="0 0 230 210">
                        <defs>
                          <marker id="bf2-ok" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                            <polygon points="0,0 7,2.5 0,5" fill="#22c55e"/>
                          </marker>
                        </defs>
                        {/* Domain oval A — 4 elements */}
                        <ellipse cx="57" cy="105" rx="50" ry="95" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                        <text x="57" y="10" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">A</text>
                        {/* a, b, c = cyan; d = orange (no arrow) */}
                        {([["a",38],["b",78],["c",118]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={57} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        {/* d — highlighted orange, no arrow */}
                        <text x="57" y="172" textAnchor="middle" fill="#fed7aa" fontSize="12" fontWeight="bold">d</text>
                        {/* "tidak ada panah" label from d */}
                        <path d="M68,168 C85,168 105,168 118,168" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>
                        <text x="122" y="164" fill="#f97316" fontSize="9" fontWeight="bold">?</text>
                        {/* Kodomain oval B */}
                        <ellipse cx="178" cy="100" rx="48" ry="80" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="178" y="18" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        {([["1",50],["2",100],["3",152]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={178} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        {/* Arrows: a→2, b→1, c→3 */}
                        <path d="M73,38 C108,38 145,85 162,100" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bf2-ok)"/>
                        <path d="M73,78 C105,72 145,55 162,50" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bf2-ok)"/>
                        <path d="M73,118 C105,128 140,148 162,152" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bf2-ok)"/>
                        {/* "tidak ada pasangan" below d */}
                        <text x="57" y="192" textAnchor="middle" fill="#f97316" fontSize="7.5" fontWeight="bold">tidak ada pasangan!</text>
                      </svg>
                    </div>
                    <p className="text-xs text-white/50 text-center mt-1">
                      <span className="text-orange-400">d tidak punya pasangan ✗</span>
                    </p>
                  </div>
                </div>

                {/* ── CARA MENYAJIKAN FUNGSI — visual f(x) = x²+1 ── */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-bold text-cyan-300">📋 Cara Menyajikan Fungsi</p>
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg px-3 py-2">
                    <p className="font-body text-xs text-cyan-200">
                      Sajikan fungsi <span className="font-mono font-bold text-cyan-300">f(x) = x² + 1</span> dengan domain A = {"{-2, -1, 0, 1, 2}"} dan kodomain B = {"{1, 2, 3, 4, 5}"}.
                    </p>
                  </div>

                  {/* 1. Diagram Panah */}
                  <div className="bg-slate-800/40 border border-cyan-500/15 rounded-xl p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-cyan-400">1️⃣ Diagram Panah</p>
                    <p className="font-body text-[10px] text-white/45">Elemen 3 dan 4 di B berwarna redup karena tidak termasuk Range.</p>
                    <div className="flex justify-center">
                      <svg width="270" height="262" viewBox="0 0 270 262">
                        <defs>
                          <marker id="fp-ok" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                            <polygon points="0,0 7,2.5 0,5" fill="#22c55e"/>
                          </marker>
                        </defs>
                        {/* Domain oval A */}
                        <ellipse cx="62" cy="122" rx="54" ry="110" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                        <text x="62" y="11" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">A</text>
                        <text x="62" y="252" textAnchor="middle" fill="#06b6d4" fontSize="7.5" opacity="0.6">Domain</text>
                        {([
                          ["-2",32],["-1",72],["0",112],["1",152],["2",195]
                        ] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={62} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">{el}</text>
                        ))}
                        {/* Kodomain oval B */}
                        <ellipse cx="208" cy="122" rx="54" ry="110" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="208" y="11" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="bold">B</text>
                        <text x="208" y="252" textAnchor="middle" fill="#8b5cf6" fontSize="7.5" opacity="0.6">Kodomain</text>
                        {([
                          ["1",32],["2",72],["3",112],["4",152],["5",195]
                        ] as [string,number][]).map(([el,y]) => {
                          const inRange = el==="1"||el==="2"||el==="5";
                          return (
                            <text key={el} x={208} y={y+4} textAnchor="middle"
                              fill={inRange ? "#e9d5ff" : "#64748b"} fontSize="11" fontWeight="bold">{el}</text>
                          );
                        })}
                        {/* Range bracket — ticks exactly at elements 1(y=32), 2(y=72), 5(y=195) */}
                        <text x="253" y="29" textAnchor="middle" fill="#4ade80" fontSize="7.5" fontWeight="bold">Range</text>
                        <line x1="238" y1="32"  x2="238" y2="195" stroke="#4ade80" strokeWidth="1.2" opacity="0.5"/>
                        <line x1="238" y1="32"  x2="247" y2="32"  stroke="#4ade80" strokeWidth="1.8"/>
                        <line x1="238" y1="72"  x2="247" y2="72"  stroke="#4ade80" strokeWidth="1.8"/>
                        <line x1="238" y1="195" x2="247" y2="195" stroke="#4ade80" strokeWidth="1.8"/>
                        {/* Arrows: -2→5, -1→2, 0→1, 1→2, 2→5 */}
                        <path d="M80,32 C125,32 165,182 190,195" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fp-ok)"/>
                        <path d="M80,72 C118,72 155,72 190,72" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fp-ok)"/>
                        <path d="M80,112 C112,100 155,45 190,32" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fp-ok)"/>
                        <path d="M80,152 C112,135 155,88 190,72" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fp-ok)"/>
                        <path d="M80,195 C118,195 155,195 190,195" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fp-ok)"/>
                      </svg>
                    </div>
                  </div>

                  {/* 2. Himpunan Pasangan Berurutan */}
                  <div className="bg-slate-800/40 border border-green-500/15 rounded-xl p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-green-400">2️⃣ Himpunan Pasangan Berurutan</p>
                    <div className="bg-green-900/20 border border-green-500/25 rounded-lg p-3 font-mono text-xs leading-relaxed">
                      <span className="text-green-300 font-bold text-sm">{"{"}</span>
                      {" "}
                      {([
                        ["-2","5"],
                        ["-1","2"],
                        ["0","1"],
                        ["1","2"],
                        ["2","5"],
                      ] as [string,string][]).map(([x,y],i,arr) => (
                        <span key={x}>
                          <span className="text-cyan-300">(</span>
                          <span className="text-yellow-300">{x}</span>
                          <span className="text-white/50">,</span>
                          <span className="text-green-300"> {y}</span>
                          <span className="text-cyan-300">)</span>
                          {i < arr.length-1 && <span className="text-white/40">, </span>}
                        </span>
                      ))}
                      {" "}
                      <span className="text-green-300 font-bold text-sm">{"}"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-body text-white/50">
                      {["-2→5","-1→2","0→1","1→2","2→5"].map(s => (
                        <span key={s} className="bg-slate-700/50 rounded px-2 py-0.5">{s}</span>
                      ))}
                    </div>
                    <p className="text-[10px] font-body text-white/40">
                      Tidak ada nilai x yang muncul 2× dengan y berbeda → ini fungsi ✓ · Range = {"{1, 2, 5}"}
                    </p>
                  </div>

                  {/* 3. Diagram Kartesius */}
                  <div className="bg-slate-800/40 border border-violet-500/15 rounded-xl p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-violet-400">3️⃣ Diagram Kartesius</p>
                    <div className="flex justify-center">
                      <svg width="250" height="225" viewBox="0 0 250 225">
                        {/* Grid lines */}
                        {[40,70,130,160].map(gx => (
                          <line key={gx} x1={gx} y1="25" x2={gx} y2="195" stroke="rgba(148,163,184,0.12)" strokeWidth="1" strokeDasharray="3,3"/>
                        ))}
                        {[45,75,105,135,165].map(gy => (
                          <line key={gy} x1="25" y1={gy} x2="185" y2={gy} stroke="rgba(148,163,184,0.12)" strokeWidth="1" strokeDasharray="3,3"/>
                        ))}
                        {/* Axes */}
                        <line x1="25" y1="195" x2="185" y2="195" stroke="#94a3b8" strokeWidth="1.8"/>
                        <line x1="100" y1="195" x2="100" y2="20"  stroke="#94a3b8" strokeWidth="1.8"/>
                        {/* Arrowheads */}
                        <polygon points="182,192 190,195 182,198" fill="#94a3b8"/>
                        <polygon points="97,22 100,15 103,22"     fill="#94a3b8"/>
                        {/* X-axis labels */}
                        {([[-2,40],[-1,70],[0,100],[1,130],[2,160]] as [number,number][]).map(([v,px]) => (
                          <text key={v} x={px} y="210" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">{v}</text>
                        ))}
                        {/* Y-axis labels */}
                        {([[1,165],[2,135],[3,105],[4,75],[5,45]] as [number,number][]).map(([v,py]) => (
                          <text key={v} x="92" y={py+3} textAnchor="end" fill={v===3||v===4 ? "#475569" : "#a78bfa"} fontSize="9" fontWeight="bold">{v}</text>
                        ))}
                        {/* Axis ticks */}
                        {[40,70,130,160].map(gx => (
                          <line key={gx} x1={gx} y1="195" x2={gx} y2="200" stroke="#94a3b8" strokeWidth="1.2"/>
                        ))}
                        {[45,75,105,135,165].map(gy => (
                          <line key={gy} x1="96" y1={gy} x2="100" y2={gy} stroke="#94a3b8" strokeWidth="1.2"/>
                        ))}
                        {/* Axis titles */}
                        <text x="193" y="199" fill="#64748b" fontSize="7">x</text>
                        <text x="103" y="16"  fill="#64748b" fontSize="7">y</text>
                        <text x="107" y="220" textAnchor="middle" fill="#64748b" fontSize="7">Domain (x)</text>
                        {/* Parabola curve (dashed, background) */}
                        <polyline
                          points={Array.from({length:41}, (_,i) => {
                            const xv = -2 + i*0.1;
                            return `${100+xv*30},${195-(xv*xv+1)*30}`;
                          }).join(' ')}
                          fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.45" strokeDasharray="4,3"
                        />
                        {/* Data points */}
                        {([
                          {x:-2,y:5,cx:40,cy:45},{x:-1,y:2,cx:70,cy:135},
                          {x:0,y:1,cx:100,cy:165},{x:1,y:2,cx:130,cy:135},{x:2,y:5,cx:160,cy:45}
                        ]).map(({cx,cy,x,y}) => (
                          <g key={x}>
                            <circle cx={cx} cy={cy} r="5.5" fill="#22c55e" stroke="white" strokeWidth="1.5"/>
                            <text x={cx} y={cy-9} textAnchor="middle" fill="#86efac" fontSize="7.5">{`(${x},${y})`}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                    <p className="text-[10px] font-body text-white/40 text-center">
                      Kurva parabola <span className="font-mono text-violet-400">y = x² + 1</span> · Setiap x tepat 1 titik → fungsi ✓
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 1 — Domain, Kodomain, dan Range" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Perhatikan diagram panah berikut. Tentukan <strong className="text-cyan-300">domain</strong>, <strong className="text-violet-300">kodomain</strong>, dan <strong className="text-green-300">range</strong> dari fungsi tersebut!
                  </p>
                </div>

                {/* Diagram Panah SVG */}
                <div className="flex justify-center">
                  <svg width="260" height="230" viewBox="0 0 260 230">
                    <defs>
                      <marker id="c3-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                        <polygon points="0,0 7,2.5 0,5" fill="#22c55e"/>
                      </marker>
                    </defs>
                    {/* Oval A (domain) */}
                    <ellipse cx="62" cy="115" rx="52" ry="100" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                    <text x="62" y="14" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">A</text>
                    {/* Domain elements: 1,2,3,4 */}
                    {([["1",50],["2",88],["3",126],["4",164]] as [string,number][]).map(([el,y])=>(
                      <text key={el} x={62} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="13" fontWeight="bold">{el}</text>
                    ))}
                    {/* Oval B (kodomain) */}
                    <ellipse cx="198" cy="115" rx="52" ry="100" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                    <text x="198" y="14" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                    {/* Kodomain elements: a,b,c,d,e */}
                    {([["a",30],["b",66],["c",102],["d",138],["e",174]] as [string,number][]).map(([el,y])=>(
                      <text key={el} x={198} y={y+4} textAnchor="middle"
                        fill="#e9d5ff" fontSize="13" fontWeight="bold">{el}</text>
                    ))}
                    {/* Arrows: 1→b, 2→d, 3→b, 4→e */}
                    <path d="M80,50 C118,50 158,60 180,66" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#c3-arr)"/>
                    <path d="M80,88 C112,100 148,128 180,138" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#c3-arr)"/>
                    <path d="M80,126 C112,112 148,78 180,66" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#c3-arr)"/>
                    <path d="M80,164 C112,164 148,168 180,174" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#c3-arr)"/>
                    {/* Labels */}
                    <text x="62" y="220" textAnchor="middle" fill="#06b6d4" fontSize="8" opacity="0.6">Domain</text>
                    <text x="198" y="220" textAnchor="middle" fill="#8b5cf6" fontSize="8" opacity="0.6">Kodomain</text>
                  </svg>
                </div>

                {/* Pembahasan */}
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 font-body text-sm">

                    {/* Domain */}
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-cyan-700/60 text-cyan-200 text-[11px] font-bold px-2 py-0.5 rounded">DOMAIN</span>
                        <span className="text-white/50 text-xs">= semua anggota himpunan A</span>
                      </div>
                      <p className="text-white/80 text-sm">
                        Domain = <strong className="text-cyan-300">{"{"} 1, 2, 3, 4 {"}"}</strong>
                      </p>
                      <p className="text-white/45 text-xs mt-1">Semua elemen di himpunan A adalah domain, karena setiap elemen memiliki pasangan di B.</p>
                    </div>

                    {/* Kodomain */}
                    <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-violet-700/60 text-violet-200 text-[11px] font-bold px-2 py-0.5 rounded">KODOMAIN</span>
                        <span className="text-white/50 text-xs">= semua anggota himpunan B</span>
                      </div>
                      <p className="text-white/80 text-sm">
                        Kodomain = <strong className="text-violet-300">{"{"} a, b, c, d, e {"}"}</strong>
                      </p>
                      <p className="text-white/45 text-xs mt-1">Semua elemen di himpunan B adalah kodomain, meskipun ada yang tidak mendapat panah (a dan c).</p>
                    </div>

                    {/* Range */}
                    <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-green-700/60 text-green-200 text-[11px] font-bold px-2 py-0.5 rounded">RANGE</span>
                        <span className="text-white/50 text-xs">= anggota B yang benar-benar dipasangkan</span>
                      </div>
                      <div className="space-y-1 text-xs text-white/60 mb-2">
                        {[["1","b"],["2","d"],["3","b"],["4","e"]].map(([x,y])=>(
                          <div key={x} className="flex items-center gap-1.5">
                            <span className="text-cyan-300 font-bold">{x}</span>
                            <span className="text-white/30">→</span>
                            <span className="text-green-300 font-bold">{y}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-white/80 text-sm">
                        Range = <strong className="text-green-300">{"{"} b, d, e {"}"}</strong>
                      </p>
                      <p className="text-white/45 text-xs mt-1">
                        Elemen <strong className="text-slate-400">a</strong> dan <strong className="text-slate-400">c</strong> tidak masuk range karena tidak ada panah yang menuju ke sana.
                      </p>
                    </div>

                    {/* Ringkasan */}
                    <div className="bg-slate-800/60 border border-white/10 rounded-lg p-3 flex flex-col gap-1.5">
                      <p className="text-xs text-white/40 font-semibold mb-0.5">📌 Ringkasan Jawaban</p>
                      <p className="text-sm text-white/80">Domain &nbsp;&nbsp;&nbsp;= <strong className="text-cyan-300">{"{"} 1, 2, 3, 4 {"}"}</strong></p>
                      <p className="text-sm text-white/80">Kodomain = <strong className="text-violet-300">{"{"} a, b, c, d, e {"}"}</strong></p>
                      <p className="text-sm text-white/80">Range &nbsp;&nbsp;&nbsp;= <strong className="text-green-300">{"{"} b, d, e {"}"}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SOAL 4 — Diagram Panah Interaktif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="✏️ Contoh 2 — Identifikasi dari Diagram Panah" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-purple-700/60 text-purple-200" />
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Perhatikan lima diagram panah berikut. Untuk setiap diagram, tentukan apakah relasi tersebut merupakan <strong className="text-green-300">Fungsi</strong> atau <strong className="text-red-300">Bukan Fungsi</strong>!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* ── Diagram 1 — FUNGSI: p→1, q→2, r→3 (bijeksi) ── */}
                  {([
                    {
                      n: 1,
                      title: "Diagram 1",
                      svg: (
                        <svg width="100%" viewBox="0 0 175 158">
                          <defs><marker id="arr-d1" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker></defs>
                          <ellipse cx="46" cy="79" rx="36" ry="62" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                          <text x="46" y="12" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                          <text x="46" y="43" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">p</text>
                          <text x="46" y="82" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">q</text>
                          <text x="46" y="121" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">r</text>
                          <ellipse cx="129" cy="79" rx="36" ry="62" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                          <text x="129" y="12" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                          <text x="129" y="43" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">1</text>
                          <text x="129" y="82" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                          <text x="129" y="121" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">3</text>
                          <path d="M61,39 C88,39 97,39 113,39" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d1)"/>
                          <path d="M61,78 C88,78 97,78 113,78" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d1)"/>
                          <path d="M61,117 C88,117 97,117 113,117" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d1)"/>
                        </svg>
                      ),
                    },
                    {
                      n: 2,
                      title: "Diagram 2",
                      svg: (
                        <svg width="100%" viewBox="0 0 175 158">
                          <defs><marker id="arr-d2" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker></defs>
                          <ellipse cx="46" cy="79" rx="36" ry="62" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                          <text x="46" y="12" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                          <text x="46" y="43" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">a</text>
                          <text x="46" y="82" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">b</text>
                          <text x="46" y="121" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">c</text>
                          <ellipse cx="129" cy="79" rx="36" ry="62" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                          <text x="129" y="12" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                          <text x="129" y="43" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">1</text>
                          <text x="129" y="82" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                          <text x="129" y="121" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">3</text>
                          <path d="M61,39 C85,39 97,68 113,78" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d2)"/>
                          <path d="M61,78 C88,78 97,78 113,78" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d2)"/>
                          <path d="M61,117 C88,117 97,117 113,117" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d2)"/>
                        </svg>
                      ),
                    },
                    {
                      n: 3,
                      title: "Diagram 3",
                      svg: (
                        <svg width="100%" viewBox="0 0 175 158">
                          <defs>
                            <marker id="arr-d3g" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker>
                            <marker id="arr-d3r" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#ef4444"/></marker>
                          </defs>
                          <ellipse cx="46" cy="79" rx="36" ry="62" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                          <text x="46" y="12" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                          <text x="46" y="43" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">a</text>
                          <text x="46" y="82" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">b</text>
                          <text x="46" y="121" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">c</text>
                          <ellipse cx="129" cy="79" rx="36" ry="62" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                          <text x="129" y="12" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                          <text x="129" y="43" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">1</text>
                          <text x="129" y="82" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                          <text x="129" y="121" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">3</text>
                          <path d="M61,39 C88,39 97,39 113,39" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d3g)"/>
                          <path d="M61,78 C84,65 100,50 113,39" fill="none" stroke="#ef4444" strokeWidth="1.8" markerEnd="url(#arr-d3r)"/>
                          <path d="M61,78 C84,92 100,108 113,117" fill="none" stroke="#ef4444" strokeWidth="1.8" markerEnd="url(#arr-d3r)"/>
                          <path d="M61,117 C85,117 97,88 113,78" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d3g)"/>
                        </svg>
                      ),
                    },
                    {
                      n: 4,
                      title: "Diagram 4",
                      svg: (
                        <svg width="100%" viewBox="0 0 175 170">
                          <defs><marker id="arr-d4" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker></defs>
                          <ellipse cx="46" cy="88" rx="36" ry="68" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                          <text x="46" y="13" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                          <text x="46" y="48" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">p</text>
                          <text x="46" y="90" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">q</text>
                          <text x="46" y="134" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">r</text>
                          <ellipse cx="129" cy="84" rx="36" ry="72" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                          <text x="129" y="7" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                          <text x="129" y="31" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">1</text>
                          <text x="129" y="66" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                          <text x="129" y="103" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">3</text>
                          <text x="129" y="140" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">4</text>
                          <path d="M61,44 C86,44 100,56 113,62" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d4)"/>
                          <path d="M61,86 C86,72 100,38 113,27" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d4)"/>
                          <path d="M61,130 C86,130 100,106 113,99" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d4)"/>
                        </svg>
                      ),
                    },
                    {
                      n: 5,
                      title: "Diagram 5",
                      svg: (
                        <svg width="100%" viewBox="0 0 175 170">
                          <defs><marker id="arr-d5" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker></defs>
                          <ellipse cx="46" cy="85" rx="36" ry="72" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                          <text x="46" y="7" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                          <text x="46" y="31" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">a</text>
                          <text x="46" y="66" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">b</text>
                          <text x="46" y="103" textAnchor="middle" fill="#fed7aa" fontSize="11" fontWeight="bold">c</text>
                          <text x="46" y="140" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">d</text>
                          <ellipse cx="129" cy="88" rx="36" ry="68" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                          <text x="129" y="13" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                          <text x="129" y="48" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">1</text>
                          <text x="129" y="90" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                          <text x="129" y="134" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">3</text>
                          <path d="M61,27 C86,27 100,80 113,86" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d5)"/>
                          <path d="M61,62 C86,55 100,50 113,44" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d5)"/>
                          <path d="M61,136 C86,136 100,132 113,130" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d5)"/>
                        </svg>
                      ),
                    },
                    {
                      n: 6,
                      title: "Diagram 6",
                      svg: (
                        <svg width="100%" viewBox="0 0 175 158">
                          <defs><marker id="arr-d6" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker></defs>
                          <ellipse cx="46" cy="79" rx="36" ry="62" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                          <text x="46" y="12" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                          <text x="46" y="43" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">x</text>
                          <text x="46" y="79" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">y</text>
                          <text x="46" y="117" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">z</text>
                          <ellipse cx="129" cy="79" rx="36" ry="62" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                          <text x="129" y="12" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                          <text x="129" y="43" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">1</text>
                          <text x="129" y="79" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                          <text x="129" y="117" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">3</text>
                          <path d="M61,39 C88,39 100,60 113,75" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d6)"/>
                          <path d="M61,75 C88,75 97,75 113,75" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d6)"/>
                          <path d="M61,113 C88,113 100,95 113,75" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d6)"/>
                        </svg>
                      ),
                    },
                  ] as {n:number; title:string; svg:React.ReactNode}[]).map(({ n, title, svg }) => {
                    const chosen = soal4Answers[n];
                    const isCorrect = soal4Correct[n];
                    const studentCorrect = soal4Checked && chosen === isCorrect;
                    const studentWrong   = soal4Checked && chosen !== undefined && chosen !== isCorrect;
                    const borderCls = soal4Checked
                      ? (studentCorrect ? "border-green-500/60 bg-green-900/15" : "border-red-500/60 bg-red-900/15")
                      : (chosen ? "border-purple-500/50 bg-purple-900/10" : "border-white/10 bg-slate-800/40");
                    return (
                      <div key={n} className={`border rounded-xl p-2.5 transition-all ${borderCls}`}>
                        <p className="font-body text-[11px] font-bold text-white/60 text-center mb-1">{title}</p>
                        <div className="flex justify-center">{svg}</div>
                        {!soal4Checked && (
                          <div className="flex gap-1.5 mt-2">
                            <button
                              onClick={() => setSoal4Answers(prev => ({ ...prev, [n]: "fungsi" }))}
                              className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg border transition-all font-body ${chosen === "fungsi" ? "bg-green-600/50 border-green-400/60 text-green-200" : "bg-slate-700/50 border-white/10 text-white/50 hover:border-green-500/40 hover:text-green-300"}`}
                            >✅ Fungsi</button>
                            <button
                              onClick={() => setSoal4Answers(prev => ({ ...prev, [n]: "bukan" }))}
                              className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg border transition-all font-body ${chosen === "bukan" ? "bg-red-600/50 border-red-400/60 text-red-200" : "bg-slate-700/50 border-white/10 text-white/50 hover:border-red-500/40 hover:text-red-300"}`}
                            >❌ Bukan</button>
                          </div>
                        )}
                        {soal4Checked && (
                          <div className={`mt-2 rounded-lg px-2 py-1.5 text-center text-[11px] font-bold font-body ${studentCorrect ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                            {studentCorrect ? "✓ Benar!" : `✗ Salah — ${isCorrect === "fungsi" ? "Ini FUNGSI" : "Ini BUKAN FUNGSI"}`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Cek Jawaban button */}
                {!soal4Checked && (
                  <button
                    disabled={Object.keys(soal4Answers).length < 6}
                    onClick={() => setSoal4Checked(true)}
                    className="w-full py-2.5 rounded-xl font-body font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-purple-600/70 hover:bg-purple-500/80 border border-purple-400/50 text-white"
                  >
                    {Object.keys(soal4Answers).length < 6
                      ? `Pilih semua jawaban dulu (${Object.keys(soal4Answers).length}/6)`
                      : "🔍 Cek Jawaban"}
                  </button>
                )}

                {/* Hasil + Pembahasan */}
                {soal4Checked && (
                  <div className="space-y-3">
                    {/* Score */}
                    <div className={`rounded-xl p-4 border text-center ${[1,2,3,4,5,6].filter(n => soal4Answers[n] === soal4Correct[n]).length === 6 ? "bg-green-900/20 border-green-500/40" : "bg-yellow-900/20 border-yellow-500/40"}`}>
                      <p className="font-body text-lg font-bold text-white">
                        Nilai: <span className="text-green-300">{[1,2,3,4,5,6].filter(n => soal4Answers[n] === soal4Correct[n]).length}</span>
                        <span className="text-white/40">/6</span>
                      </p>
                      <p className="font-body text-xs text-white/50 mt-1">
                        {[1,2,3,4,5,6].filter(n => soal4Answers[n] === soal4Correct[n]).length === 6
                          ? "🎉 Sempurna! Kamu paham syarat fungsi dengan baik."
                          : [1,2,3,4,5,6].filter(n => soal4Answers[n] === soal4Correct[n]).length >= 4
                          ? "👍 Bagus! Review kembali diagram yang salah."
                          : "📖 Coba pelajari lagi syarat fungsi ya!"}
                      </p>
                    </div>

                    {/* Penjelasan per diagram */}
                    <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                      <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                      {[
                        { n: 1, status: "FUNGSI ✅", color: "text-green-300", penj: "Setiap anggota domain (p, q, r) memiliki tepat satu panah ke kodomain. p→1, q→2, r→3. Semua syarat fungsi terpenuhi." },
                        { n: 2, status: "FUNGSI ✅", color: "text-green-300", penj: "a→2 dan b→2 boleh saja (banyak ke satu = fungsi). Yang penting setiap domain punya tepat satu panah. a, b, c masing-masing punya 1 panah ✓" },
                        { n: 3, status: "BUKAN FUNGSI ❌", color: "text-red-300", penj: "Anggota b memiliki DUA panah: b→1 dan b→3. Ini melanggar syarat fungsi — setiap domain hanya boleh punya satu pasangan!" },
                        { n: 4, status: "FUNGSI ✅", color: "text-green-300", penj: "p→2, q→1, r→3. Setiap domain (p,q,r) memiliki tepat satu pasangan di kodomain. Kodomain boleh punya anggota yang tidak berpasangan (elemen 4 tidak dipetakan). Tetap fungsi ✓" },
                        { n: 5, status: "BUKAN FUNGSI ❌", color: "text-red-300", penj: "Anggota c tidak memiliki panah ke kodomain (tidak berpasangan). Ini melanggar syarat fungsi — semua anggota domain wajib punya pasangan!" },
                        { n: 6, status: "FUNGSI ✅", color: "text-green-300", penj: "x→2, y→2, z→2. Semua anggota domain menunjuk ke satu elemen kodomain yang sama (2). Ini disebut fungsi konstan — tetap sah sebagai fungsi karena setiap domain punya tepat satu pasangan ✓" },
                      ].map(({ n, status, color, penj }) => (
                        <div key={n} className="flex gap-2">
                          <span className="bg-white/10 rounded px-2 py-0.5 text-xs font-bold text-white shrink-0 self-start mt-0.5">D{n}</span>
                          <div>
                            <span className={`text-xs font-bold ${color}`}>{status}</span>
                            <p className="text-xs text-white/60 mt-0.5">{penj}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => { setSoal4Answers({}); setSoal4Checked(false); }}
                      className="w-full py-2 rounded-xl font-body text-sm text-white/40 border border-white/10 hover:text-white/70 hover:border-white/20 transition-all"
                    >↺ Ulangi Soal</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CONTOH 5 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-teal-400" title="✏️ Contoh 3 — Identifikasi Fungsi dari Pasangan Berurutan" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-teal-700/60 text-teal-200" />
                <div className="bg-slate-800/60 border border-teal-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-teal-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed mb-3">
                    Tentukan di antara relasi-relasi berikut yang merupakan fungsi!
                  </p>
                  <div className="space-y-2 text-sm font-body">
                    {[
                      { label: "a", data: "{(Januari, Senin), (Februari, Selasa), (Maret, Senin), (April, Selasa), (Maret, Rabu)}" },
                      { label: "b", data: "{(Ani, Beti), (Beti, Dita), (Cici, Eni), (Beti, Fani), (Ani, Ganis)}" },
                      { label: "c", data: "{(Ali, Senin), (Budi, Senin), (Cahya, Rabu), (Doni, Sabtu), (Edi, Rabu), (Feri, Kamis)}" },
                      { label: "d", data: "{(Senin, 2001), (Selasa, 2004), (Rabu, 2007), (Selasa, 2007), (Sabtu, 2006)}" },
                      { label: "e", data: "{(Adit, 2001), (Bana, 2002), (Cakra, 2002), (Eni, 2003), (Fitri, 2001), (Ganis, 2002)}" },
                    ].map(({ label, data }) => (
                      <div key={label} className="flex gap-2 items-start">
                        <span className="font-bold text-teal-300 shrink-0 w-4">{label}.</span>
                        <span className="text-white/75 font-mono text-xs leading-relaxed">{data}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <p className="font-body text-xs text-white/50">Ingat: suatu relasi adalah <strong className="text-yellow-300">fungsi</strong> jika setiap anggota domain dipasangkan dengan <strong className="text-yellow-300">tepat satu</strong> anggota kodomain.</p>

                  <div className="space-y-3">
                    {[
                      {
                        label: "a",
                        status: "BUKAN FUNGSI",
                        statusColor: "text-red-300",
                        borderColor: "border-red-500/40 bg-red-900/10",
                        duplikat: "Maret",
                        penj: "Anggota domain \"Maret\" muncul DUA kali dengan pasangan berbeda: (Maret, Senin) dan (Maret, Rabu). Ini melanggar syarat fungsi!",
                        pasangan: [["Januari","Senin"],["Februari","Selasa"],["Maret","Senin ✗"],["April","Selasa"],["Maret","Rabu ✗"]],
                      },
                      {
                        label: "b",
                        status: "BUKAN FUNGSI",
                        statusColor: "text-red-300",
                        borderColor: "border-red-500/40 bg-red-900/10",
                        duplikat: "Ani & Beti",
                        penj: "\"Ani\" punya dua pasangan: (Ani, Beti) dan (Ani, Ganis). \"Beti\" juga punya dua pasangan: (Beti, Dita) dan (Beti, Fani). Keduanya melanggar syarat fungsi!",
                        pasangan: [["Ani","Beti ✗"],["Beti","Dita ✗"],["Cici","Eni"],["Beti","Fani ✗"],["Ani","Ganis ✗"]],
                      },
                      {
                        label: "c",
                        status: "FUNGSI ✅",
                        statusColor: "text-green-300",
                        borderColor: "border-green-500/40 bg-green-900/10",
                        duplikat: "",
                        penj: "Setiap domain (Ali, Budi, Cahya, Doni, Edi, Feri) masing-masing muncul tepat sekali. Boleh saja dua domain berbeda (misal Budi & Ali) menunjuk ke Senin yang sama — itu tetap fungsi!",
                        pasangan: [["Ali","Senin"],["Budi","Senin"],["Cahya","Rabu"],["Doni","Sabtu"],["Edi","Rabu"],["Feri","Kamis"]],
                      },
                      {
                        label: "d",
                        status: "BUKAN FUNGSI",
                        statusColor: "text-red-300",
                        borderColor: "border-red-500/40 bg-red-900/10",
                        duplikat: "Selasa",
                        penj: "\"Selasa\" muncul dua kali dengan pasangan berbeda: (Selasa, 2004) dan (Selasa, 2007). Ini melanggar syarat fungsi!",
                        pasangan: [["Senin","2001"],["Selasa","2004 ✗"],["Rabu","2007"],["Selasa","2007 ✗"],["Sabtu","2006"]],
                      },
                      {
                        label: "e",
                        status: "FUNGSI ✅",
                        statusColor: "text-green-300",
                        borderColor: "border-green-500/40 bg-green-900/10",
                        duplikat: "",
                        penj: "Setiap domain (Adit, Bana, Cakra, Eni, Fitri, Ganis) masing-masing muncul tepat sekali. Nilai kodomain boleh sama (2002 muncul 3 kali, 2001 muncul 2 kali) — itu tidak masalah. Ini adalah fungsi!",
                        pasangan: [["Adit","2001"],["Bana","2002"],["Cakra","2002"],["Eni","2003"],["Fitri","2001"],["Ganis","2002"]],
                      },
                    ].map(({ label, status, statusColor, borderColor, duplikat, penj, pasangan }) => (
                      <div key={label} className={`border ${borderColor} rounded-xl p-3 space-y-2`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-white/10 rounded px-2 py-0.5 text-xs font-bold text-white shrink-0">{label}</span>
                          <span className={`text-xs font-bold ${statusColor}`}>{status}</span>
                          {duplikat && (
                            <span className="text-[10px] bg-red-900/40 border border-red-500/30 text-red-300 rounded px-2 py-0.5">
                              Domain duplikat: {duplikat}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {pasangan.map(([d, k], i) => (
                            <span key={i} className={`text-[10px] font-mono px-2 py-0.5 rounded border ${k.includes("✗") ? "bg-red-900/30 border-red-500/40 text-red-200" : "bg-slate-700/60 border-white/10 text-white/60"}`}>
                              {d} → {k}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">{penj}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-bold text-teal-300 mb-1">✅ Kesimpulan:</p>
                    <p className="font-body text-xs text-white/75">
                      Yang merupakan fungsi: <strong className="text-green-300">c</strong> dan <strong className="text-green-300">e</strong>.
                      <br />Yang bukan fungsi: <strong className="text-red-300">a</strong> (Maret duplikat), <strong className="text-red-300">b</strong> (Ani & Beti duplikat), <strong className="text-red-300">d</strong> (Selasa duplikat).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 6 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Target className="w-5 h-5" />} iconColor="text-pink-400" title="✏️ Contoh 4 — Identifikasi Fungsi dari Grafik" />
            {expandedSections.includes("contoh4") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-pink-700/60 text-pink-200" />
                <div className="bg-slate-800/60 border border-pink-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-pink-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Di antara grafik berikut, manakah yang merupakan grafik fungsi dalam <strong className="text-cyan-300">x</strong>? Jelaskan!
                  </p>
                </div>

                {/* Uji Garis Vertikal hint */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Uji Garis Vertikal:</strong> Suatu grafik merupakan fungsi jika setiap garis vertikal <em>x = c</em> hanya memotong grafik di <strong>tepat satu titik</strong>.
                  </p>
                </div>

                {/* Grid 6 grafik */}
                <div className="grid grid-cols-2 gap-3">
                  {([
                    {
                      label: "a",
                      fungsi: true,
                      alasan: "Setiap garis vertikal hanya memotong garis di tepat satu titik. Garis lurus naik = fungsi linear.",
                      svg: (
                        <svg viewBox="0 0 160 130" width="100%">
                          {/* grid */}
                          {[32,64,96,128].map(x=><line key={x} x1={x} y1="10" x2={x} y2="110" stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          {[30,50,70,90,110].map(y=><line key={y} x1="10" y1={y} x2="150" y2={y} stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          {/* axes */}
                          <line x1="10" y1="110" x2="150" y2="110" stroke="#64748b" strokeWidth="1.5"/>
                          <line x1="10" y1="110" x2="10" y2="10" stroke="#64748b" strokeWidth="1.5"/>
                          <polygon points="147,107 154,110 147,113" fill="#64748b"/>
                          <polygon points="7,13 10,6 13,13" fill="#64748b"/>
                          {/* labels */}
                          <text x="155" y="114" fill="#64748b" fontSize="8">x</text>
                          <text x="13" y="8" fill="#64748b" fontSize="8">y</text>
                          <text x="128" y="123" fill="#94a3b8" fontSize="8">5</text>
                          <text x="5" y="34" fill="#94a3b8" fontSize="8" textAnchor="end">5</text>
                          {/* straight line: y = x, from (0,0) to (5,5) in grid coords */}
                          {/* grid: x from 10 to 135 maps to 0..5, y from 110 to 15 maps to 0..5 */}
                          <line x1="10" y1="110" x2="135" y2="15" stroke="#22c55e" strokeWidth="2.2"/>
                        </svg>
                      ),
                    },
                    {
                      label: "b",
                      fungsi: false,
                      alasan: "Kurva melengkung balik — ada nilai x yang dipotong garis vertikal di DUA titik. Gagal uji garis vertikal.",
                      svg: (
                        <svg viewBox="0 0 160 130" width="100%">
                          {[32,64,96,128].map(x=><line key={x} x1={x} y1="10" x2={x} y2="110" stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          {[30,50,70,90,110].map(y=><line key={y} x1="10" y1={y} x2="150" y2={y} stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          <line x1="10" y1="110" x2="150" y2="110" stroke="#64748b" strokeWidth="1.5"/>
                          <line x1="10" y1="110" x2="10" y2="10" stroke="#64748b" strokeWidth="1.5"/>
                          <polygon points="147,107 154,110 147,113" fill="#64748b"/>
                          <polygon points="7,13 10,6 13,13" fill="#64748b"/>
                          <text x="155" y="114" fill="#64748b" fontSize="8">x</text>
                          <text x="13" y="8" fill="#64748b" fontSize="8">y</text>
                          <text x="128" y="123" fill="#94a3b8" fontSize="8">5</text>
                          <text x="5" y="34" fill="#94a3b8" fontSize="8" textAnchor="end">5</text>
                          {/* D-shape: half-ellipse opening to the right — x = y(5-y) style */}
                          <path d="M 12,108 C 38,108 118,93 140,60 C 156,32 120,12 12,12" fill="none" stroke="#ef4444" strokeWidth="2.2"/>
                        </svg>
                      ),
                    },
                    {
                      label: "c",
                      fungsi: true,
                      alasan: "Kurva berbentuk gunung (naik lalu turun). Setiap garis vertikal hanya memotong kurva di satu titik.",
                      svg: (
                        <svg viewBox="0 0 160 130" width="100%">
                          {[32,64,96,128].map(x=><line key={x} x1={x} y1="10" x2={x} y2="110" stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          {[30,50,70,90,110].map(y=><line key={y} x1="10" y1={y} x2="150" y2={y} stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          <line x1="10" y1="110" x2="150" y2="110" stroke="#64748b" strokeWidth="1.5"/>
                          <line x1="10" y1="110" x2="10" y2="10" stroke="#64748b" strokeWidth="1.5"/>
                          <polygon points="147,107 154,110 147,113" fill="#64748b"/>
                          <polygon points="7,13 10,6 13,13" fill="#64748b"/>
                          <text x="155" y="114" fill="#64748b" fontSize="8">x</text>
                          <text x="13" y="8" fill="#64748b" fontSize="8">y</text>
                          <text x="128" y="123" fill="#94a3b8" fontSize="8">5</text>
                          <text x="5" y="34" fill="#94a3b8" fontSize="8" textAnchor="end">5</text>
                          {/* bell curve */}
                          <path d="M10,110 C25,110 38,108 55,75 C68,48 80,20 90,18 C100,16 112,42 118,68 C126,100 132,110 148,110" fill="none" stroke="#22c55e" strokeWidth="2.2"/>
                        </svg>
                      ),
                    },
                    {
                      label: "d",
                      fungsi: true,
                      alasan: "Garis lurus menurun. Setiap garis vertikal hanya memotong garis di tepat satu titik. Fungsi linear dengan gradien negatif.",
                      svg: (
                        <svg viewBox="0 0 160 130" width="100%">
                          {[32,64,96,128].map(x=><line key={x} x1={x} y1="10" x2={x} y2="110" stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          {[30,50,70,90,110].map(y=><line key={y} x1="10" y1={y} x2="150" y2={y} stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          <line x1="10" y1="110" x2="150" y2="110" stroke="#64748b" strokeWidth="1.5"/>
                          <line x1="10" y1="110" x2="10" y2="10" stroke="#64748b" strokeWidth="1.5"/>
                          <polygon points="147,107 154,110 147,113" fill="#64748b"/>
                          <polygon points="7,13 10,6 13,13" fill="#64748b"/>
                          <text x="155" y="114" fill="#64748b" fontSize="8">x</text>
                          <text x="13" y="8" fill="#64748b" fontSize="8">y</text>
                          <text x="128" y="123" fill="#94a3b8" fontSize="8">5</text>
                          <text x="5" y="34" fill="#94a3b8" fontSize="8" textAnchor="end">5</text>
                          {/* decreasing line from top-left to bottom-right */}
                          <line x1="10" y1="20" x2="148" y2="108" stroke="#22c55e" strokeWidth="2.2"/>
                        </svg>
                      ),
                    },
                    {
                      label: "e",
                      fungsi: true,
                      alasan: "Gelombang sinusoidal. Meski naik-turun berulang, setiap nilai x tetap memiliki tepat satu nilai y. Fungsi.",
                      svg: (
                        <svg viewBox="0 0 160 130" width="100%">
                          {[32,64,96,128].map(x=><line key={x} x1={x} y1="10" x2={x} y2="110" stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          {[30,50,70,90,110].map(y=><line key={y} x1="10" y1={y} x2="150" y2={y} stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          <line x1="10" y1="110" x2="150" y2="110" stroke="#64748b" strokeWidth="1.5"/>
                          <line x1="10" y1="110" x2="10" y2="10" stroke="#64748b" strokeWidth="1.5"/>
                          <polygon points="147,107 154,110 147,113" fill="#64748b"/>
                          <polygon points="7,13 10,6 13,13" fill="#64748b"/>
                          <text x="155" y="114" fill="#64748b" fontSize="8">x</text>
                          <text x="13" y="8" fill="#64748b" fontSize="8">y</text>
                          <text x="128" y="123" fill="#94a3b8" fontSize="8">5</text>
                          <text x="5" y="34" fill="#94a3b8" fontSize="8" textAnchor="end">5</text>
                          {/* sine-like wave */}
                          <path d="M10,60 C25,60 30,25 50,25 C70,25 75,90 95,90 C115,90 120,40 140,40 C145,40 148,42 150,44" fill="none" stroke="#22c55e" strokeWidth="2.2"/>
                        </svg>
                      ),
                    },
                    {
                      label: "f",
                      fungsi: false,
                      alasan: "Kurva melipat secara vertikal — ada nilai x yang dipotong garis vertikal di DUA titik berbeda. Gagal uji garis vertikal.",
                      svg: (
                        <svg viewBox="0 0 160 130" width="100%">
                          {[32,64,96,128].map(x=><line key={x} x1={x} y1="10" x2={x} y2="110" stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          {[30,50,70,90,110].map(y=><line key={y} x1="10" y1={y} x2="150" y2={y} stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          <line x1="10" y1="110" x2="150" y2="110" stroke="#64748b" strokeWidth="1.5"/>
                          <line x1="10" y1="110" x2="10" y2="10" stroke="#64748b" strokeWidth="1.5"/>
                          <polygon points="147,107 154,110 147,113" fill="#64748b"/>
                          <polygon points="7,13 10,6 13,13" fill="#64748b"/>
                          <text x="155" y="114" fill="#64748b" fontSize="8">x</text>
                          <text x="13" y="8" fill="#64748b" fontSize="8">y</text>
                          <text x="128" y="123" fill="#94a3b8" fontSize="8">5</text>
                          <text x="5" y="34" fill="#94a3b8" fontSize="8" textAnchor="end">5</text>
                          {/* double-S wave: starts top of y-axis, bumps right twice, ends at origin — like x=sin(y) */}
                          <path d="M 10,10 C 10,14 55,14 98,28 C 130,38 12,52 10,60 C 8,68 55,68 98,82 C 128,92 12,106 10,110" fill="none" stroke="#ef4444" strokeWidth="2.2"/>
                        </svg>
                      ),
                    },
                  ] as {label:string; fungsi:boolean; alasan:string; svg:React.ReactNode}[]).map(({ label, fungsi, alasan, svg }) => (
                    <div key={label} className={`border rounded-xl p-2.5 ${fungsi ? "border-green-500/40 bg-green-900/10" : "border-red-500/40 bg-red-900/10"}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-body text-[11px] font-bold text-white/60">Grafik {label}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${fungsi ? "bg-green-700/50 text-green-200" : "bg-red-700/50 text-red-200"}`}>
                          {fungsi ? "✅ FUNGSI" : "❌ BUKAN"}
                        </span>
                      </div>
                      <div className="flex justify-center bg-slate-900/60 rounded-lg p-1">
                        {svg}
                      </div>
                      <p className="text-[10px] text-white/55 mt-1.5 leading-relaxed font-body">{alasan}</p>
                    </div>
                  ))}
                </div>

                {/* Pembahasan ringkas */}
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Kesimpulan</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { lbl: "a", ok: true }, { lbl: "b", ok: false },
                      { lbl: "c", ok: true }, { lbl: "d", ok: true },
                      { lbl: "e", ok: true }, { lbl: "f", ok: false },
                    ].map(({ lbl, ok }) => (
                      <div key={lbl} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold font-body ${ok ? "bg-green-900/30 border-green-500/40 text-green-200" : "bg-red-900/30 border-red-500/40 text-red-200"}`}>
                        <span>Grafik {lbl}</span>
                        <span>{ok ? "✅" : "❌"}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/50 font-body">
                    Grafik <strong className="text-green-300">a, c, d, e</strong> adalah fungsi. Grafik <strong className="text-red-300">b</strong> dan <strong className="text-red-300">f</strong> bukan fungsi karena ada garis vertikal yang memotong grafik di lebih dari satu titik.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman & Kesimpulan" />
            {true && (
              <div className="px-5 pb-6 space-y-4">

                {/* RANGKUMAN */}
                <p className="font-display text-xs font-bold text-violet-300 uppercase tracking-wider pt-1">📚 Rangkuman Materi</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { icon: "⚙️", label: "Fungsi", desc: "Relasi khusus: setiap anggota domain dipasangkan dengan TEPAT SATU anggota kodomain.", color: "from-violet-900/60 to-purple-900/60 border-violet-500/40 text-violet-300" },
                    { icon: "✅", label: "Syarat 1", desc: "Semua anggota domain HARUS punya pasangan — tidak boleh ada yang kosong.", color: "from-green-900/60 to-emerald-900/60 border-green-500/40 text-green-300" },
                    { icon: "☑️", label: "Syarat 2", desc: "Setiap anggota domain hanya boleh punya SATU pasangan — tidak boleh bercabang.", color: "from-blue-900/60 to-cyan-900/60 border-blue-500/40 text-blue-300" },
                    { icon: "📝", label: "Notasi Fungsi", desc: "f : A → B, dibaca 'f adalah fungsi dari A ke B'.", color: "from-orange-900/60 to-amber-900/60 border-orange-500/40 text-orange-300" },
                    { icon: "🎯", label: "Nilai Fungsi", desc: "f(x) = nilai output saat input adalah x. Dibaca: 'f dari x'.", color: "from-pink-900/60 to-rose-900/60 border-pink-500/40 text-pink-300" },
                  ].map(({ icon, label, desc, color }) => (
                    <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="font-display text-xs font-bold mb-0.5">{label}</p>
                        <p className="font-body text-xs text-white/80 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TIPS & TRIK */}
                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">💡 Tips &amp; Trik</p>
                  <div className="space-y-2">
                    {[
                      "Cek diagram panah: setiap titik di domain WAJIB punya tepat satu anak panah keluar.",
                      "Boleh: banyak anggota domain menuju satu anggota kodomain. Tidak boleh: satu domain ke dua kodomain.",
                      "Gunakan tabel nilai — jika ada nilai x yang menghasilkan dua f(x) berbeda, itu bukan fungsi!",
                    ].map((tip, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/30 text-amber-200 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                        <p className="font-body text-xs text-amber-100/90 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KESIMPULAN */}
                <div className="bg-gradient-to-r from-violet-900/60 to-purple-900/60 border border-violet-400/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-violet-300 uppercase tracking-wider mb-2">🎯 Kesimpulan</p>
                  <p className="font-body text-sm text-white/90 leading-relaxed">
                    Fungsi adalah <strong className="text-violet-300">relasi dengan aturan ketat</strong>. Setiap input menghasilkan <strong className="text-green-300">tepat satu output</strong> — seperti mesin yang selalu konsisten dan dapat diprediksi!
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianFungsiPage;
