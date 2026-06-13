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
    "intro", "konsep", "penyajian", "bukan-fungsi", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

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
                          <g key={el}>
                            <ellipse cx={57} cy={y} rx={16} ry={11} fill="rgba(6,182,212,0.18)" stroke="#06b6d4" strokeWidth="1.2"/>
                            <text x={57} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="12" fontWeight="bold">{el}</text>
                          </g>
                        ))}
                        {/* Kodomain oval B */}
                        <ellipse cx="175" cy="103" rx="50" ry="88" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="175" y="13" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        <text x="175" y="192" textAnchor="middle" fill="#8b5cf6" fontSize="8" opacity="0.55">Kodomain</text>
                        {/* B elements */}
                        {([["1",44],["2",82],["3",120],["4",158]] as [string,number][]).map(([el,y]) => (
                          <g key={el}>
                            <ellipse cx={175} cy={y} rx={16} ry={11} fill="rgba(139,92,246,0.18)" stroke="#8b5cf6" strokeWidth="1.2"/>
                            <text x={175} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                          </g>
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
                          <g key={el}>
                            <ellipse cx={57} cy={y} rx={16} ry={11}
                              fill={el==="b" ? "rgba(239,68,68,0.22)" : "rgba(6,182,212,0.18)"}
                              stroke={el==="b" ? "#ef4444" : "#06b6d4"} strokeWidth="1.2"/>
                            <text x={57} y={y+4} textAnchor="middle"
                              fill={el==="b" ? "#fca5a5" : "#cffafe"} fontSize="12" fontWeight="bold">{el}</text>
                          </g>
                        ))}
                        <ellipse cx="175" cy="93" rx="50" ry="80" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="175" y="11" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        {([["1",48],["2",93],["3",138]] as [string,number][]).map(([el,y]) => (
                          <g key={el}>
                            <ellipse cx={175} cy={y} rx={16} ry={11} fill="rgba(139,92,246,0.18)" stroke="#8b5cf6" strokeWidth="1.2"/>
                            <text x={175} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                          </g>
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
                          <g key={el}>
                            <ellipse cx={57} cy={y} rx={16} ry={11} fill="rgba(6,182,212,0.18)" stroke="#06b6d4" strokeWidth="1.2"/>
                            <text x={57} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="12" fontWeight="bold">{el}</text>
                          </g>
                        ))}
                        {/* d — highlighted orange, no arrow */}
                        <ellipse cx="57" cy="168" rx="18" ry="12" fill="rgba(249,115,22,0.18)" stroke="#f97316" strokeWidth="1.5" strokeDasharray="5,3"/>
                        <text x="57" y="172" textAnchor="middle" fill="#fed7aa" fontSize="12" fontWeight="bold">d</text>
                        {/* "tidak ada panah" label from d */}
                        <path d="M75,168 C92,168 108,168 118,168" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>
                        <text x="122" y="164" fill="#f97316" fontSize="9" fontWeight="bold">?</text>
                        {/* Kodomain oval B */}
                        <ellipse cx="178" cy="100" rx="48" ry="80" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="178" y="18" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        {([["1",50],["2",100],["3",152]] as [string,number][]).map(([el,y]) => (
                          <g key={el}>
                            <ellipse cx={178} cy={y} rx={16} ry={11} fill="rgba(139,92,246,0.18)" stroke="#8b5cf6" strokeWidth="1.2"/>
                            <text x={178} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                          </g>
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
                          <g key={el}>
                            <ellipse cx={62} cy={y} rx={18} ry={11} fill="rgba(6,182,212,0.18)" stroke="#06b6d4" strokeWidth="1.2"/>
                            <text x={62} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">{el}</text>
                          </g>
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
                            <g key={el}>
                              <ellipse cx={208} cy={y} rx={18} ry={11}
                                fill={inRange ? "rgba(139,92,246,0.25)" : "rgba(100,116,139,0.15)"}
                                stroke={inRange ? "#8b5cf6" : "#475569"} strokeWidth="1.2"/>
                              <text x={208} y={y+4} textAnchor="middle"
                                fill={inRange ? "#e9d5ff" : "#64748b"} fontSize="11" fontWeight="bold">{el}</text>
                            </g>
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

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Dari himpunan pasangan berurutan berikut, tentukan mana yang merupakan fungsi dan mana yang bukan:
                    <br /><strong>A.</strong> <InlineMath math="\{(1,3),(2,5),(3,7),(4,9)\}" />
                    <br /><strong>B.</strong> <InlineMath math="\{(1,2),(1,4),(2,6),(3,8)\}" />
                    <br /><strong>C.</strong> <InlineMath math="\{(2,5),(3,5),(4,5),(5,5)\}" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    {[
                      { label: "A", data: "{(1,3),(2,5),(3,7),(4,9)}", status: "FUNGSI", penj: "Setiap nilai x (1,2,3,4) muncul tepat sekali. Tidak ada duplikasi di nilai pertama.", color: "border-green-500/40 bg-green-900/10", statusColor: "text-green-300" },
                      { label: "B", data: "{(1,2),(1,4),(2,6),(3,8)}", status: "BUKAN FUNGSI", penj: "Nilai x=1 muncul DUA KALI (1→2 dan 1→4). Ini melanggar syarat fungsi!", color: "border-red-500/40 bg-red-900/10", statusColor: "text-red-300" },
                      { label: "C", data: "{(2,5),(3,5),(4,5),(5,5)}", status: "FUNGSI", penj: "Meski semua nilai y sama (5), setiap x dipasangkan tepat sekali. Ini TETAP fungsi (disebut fungsi konstan).", color: "border-green-500/40 bg-green-900/10", statusColor: "text-green-300" },
                    ].map(({ label, status, penj, color, statusColor }) => (
                      <div key={label} className={`border ${color} rounded-lg p-3`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-white/10 rounded px-2 py-0.5 text-xs font-bold text-white">{label}</span>
                          <span className={`text-xs font-bold ${statusColor}`}>{status}</span>
                        </div>
                        <p className="text-xs text-white/60">{penj}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui fungsi <InlineMath math="f : A \to B" /> dengan <InlineMath math="A = \{-2, -1, 0, 1, 2\}" /> dan aturan fungsi <InlineMath math="f(x) = x^2 + 3" />. Tentukan:
                    <br />a) Nilai fungsi untuk setiap anggota domain
                    <br />b) Kodomain B (range fungsi)
                    <br />c) Sajikan dalam bentuk tabel
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) Nilai fungsi untuk setiap x:</p>
                      <div className="space-y-1 text-xs">
                        {[
                          ["-2", "(-2)² + 3", "4 + 3", "7"],
                          ["-1", "(-1)² + 3", "1 + 3", "4"],
                          ["0", "0² + 3", "0 + 3", "3"],
                          ["1", "1² + 3", "1 + 3", "4"],
                          ["2", "2² + 3", "4 + 3", "7"],
                        ].map(([x, eksp, hitung, hasil]) => (
                          <div key={x} className="flex gap-2 items-center text-white/70">
                            <span className="bg-cyan-800/50 rounded px-2 py-0.5 text-cyan-200 font-bold w-8 text-center shrink-0">x={x}</span>
                            <span className="text-white/40">→</span>
                            <span>f({x}) = {eksp} = {hitung} = </span>
                            <span className="text-green-300 font-bold">{hasil}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">b) Range fungsi:</p>
                      <BlockMath math="\text{Range} = \{3, 4, 7\}" />
                      <p className="text-white/50 text-xs">Perhatikan: f(-2)=f(2)=7 dan f(-1)=f(1)=4, sehingga range hanya berisi nilai uniknya.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-2">c) Tabel:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-orange-900/40">
                              <th className="border border-orange-500/30 px-2 py-1.5 text-orange-200">x</th>
                              {["-2", "-1", "0", "1", "2"].map(v => (
                                <td key={v} className="border border-orange-500/30 px-2 py-1.5 text-white text-center">{v}</td>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th className="border border-orange-500/30 px-2 py-1.5 text-orange-200">f(x)=x²+3</th>
                              {["7", "4", "3", "4", "7"].map((v, i) => (
                                <td key={i} className="border border-orange-500/30 px-2 py-1.5 text-green-300 text-center font-bold">{v}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300">✅ Range = <InlineMath math="\{3, 4, 7\}" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui <InlineMath math="f(x) = ax + b" /> adalah sebuah fungsi linear. Jika <InlineMath math="f(2) = 7" /> dan <InlineMath math="f(-1) = 1" />, tentukan:
                    <br />a) Nilai <InlineMath math="a" /> dan <InlineMath math="b" />
                    <br />b) Rumus fungsinya
                    <br />c) Nilai dari <InlineMath math="f(5)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Bentuk sistem persamaan:</p>
                      <p className="text-white/70 text-xs mb-2">Substitusi nilai yang diketahui ke <InlineMath math="f(x) = ax + b" />:</p>
                      <BlockMath math="f(2) = 2a + b = 7 \quad \cdots (1)" />
                      <BlockMath math="f(-1) = -a + b = 1 \quad \cdots (2)" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Selesaikan SPLDV:</p>
                      <p className="text-white/60 text-xs mb-1">Eliminasi: Persamaan (1) dikurangi (2):</p>
                      <BlockMath math="(2a + b) - (-a + b) = 7 - 1" />
                      <BlockMath math="3a = 6 \implies a = 2" />
                      <p className="text-white/60 text-xs mb-1 mt-2">Substitusi a=2 ke persamaan (2):</p>
                      <BlockMath math="-2 + b = 1 \implies b = 3" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">b) Rumus Fungsi:</p>
                      <BlockMath math="f(x) = 2x + 3" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">c) Nilai f(5):</p>
                      <BlockMath math="f(5) = 2(5) + 3 = 10 + 3 = 13" />
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-red-300">✅ Jawaban: a=2, b=3, f(x) = 2x+3, dan f(5) = <strong>13</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {[
                    ["Fungsi", "Relasi khusus di mana setiap anggota domain dipasangkan dengan TEPAT SATU anggota kodomain"],
                    ["Syarat 1", "Semua anggota domain harus punya pasangan"],
                    ["Syarat 2", "Setiap anggota domain hanya boleh punya satu pasangan"],
                    ["Notasi Fungsi", "f : A → B, dibaca 'f adalah fungsi dari A ke B'"],
                    ["Nilai Fungsi", "f(x) dibaca 'f dari x' — nilai output saat input adalah x"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Ingat:</strong> Setiap fungsi adalah relasi, tapi tidak setiap relasi adalah fungsi! Fungsi adalah relasi yang "lebih ketat".
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
