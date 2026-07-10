import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Divide, ChevronDown, ChevronUp, Lightbulb, BookOpen, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const PembagianCepatPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["konsep", "uji", "cara", "contoh", "latihan"]);

  const toggle = (id: string) => {
    playPopSound();
    setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <Divide className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-glow-cyan mb-2 text-center">
          PEMBAGIAN CEPAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Menghitung Cepat · Uji Keterbagian & Estimasi</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="💡 Strategi Pembagian Cepat"/>
            {open.includes("konsep") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-rose-900/30 border border-rose-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">Ada dua pendekatan utama untuk mempercepat pembagian:</p>
                  <p className="font-body text-sm text-white/80">1. <strong className="text-rose-300">Uji Keterbagian</strong> — kenali apakah suatu bilangan habis dibagi 2, 3, 4, 5, dst.</p>
                  <p className="font-body text-sm text-white/80">2. <strong className="text-yellow-300">Faktorisasi Cerdas</strong> — uraikan pembagi ke faktor yang lebih mudah dihitung.</p>
                </div>
              </div>
            )}
          </div>

          {/* UJI KETERBAGIAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="uji" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-rose-400" title="📋 Tabel Uji Keterbagian"/>
            {open.includes("uji") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="space-y-2">
                  {[
                    { pembagi: "÷ 2", syarat: "Digit satuan genap (0,2,4,6,8)", contoh: "348 → 8 genap ✅" },
                    { pembagi: "÷ 3", syarat: "Jumlah semua digit habis dibagi 3", contoh: "174 → 1+7+4=12 ✅" },
                    { pembagi: "÷ 4", syarat: "Dua digit terakhir habis dibagi 4", contoh: "1312 → 12÷4=3 ✅" },
                    { pembagi: "÷ 5", syarat: "Digit satuan 0 atau 5", contoh: "485 → satuan 5 ✅" },
                    { pembagi: "÷ 6", syarat: "Habis dibagi 2 DAN 3", contoh: "342 → genap & jumlah digit 9 ✅" },
                    { pembagi: "÷ 9", syarat: "Jumlah semua digit habis dibagi 9", contoh: "2673 → 2+6+7+3=18 ✅" },
                    { pembagi: "÷ 10", syarat: "Digit satuan 0", contoh: "370 → satuan 0 ✅" },
                  ].map(r => (
                    <div key={r.pembagi} className="bg-rose-900/20 border border-rose-700/30 rounded-lg p-3 flex gap-3">
                      <span className="text-rose-300 font-bold font-mono text-sm w-12 shrink-0">{r.pembagi}</span>
                      <div className="flex-1">
                        <p className="font-body text-xs text-white/80">{r.syarat}</p>
                        <p className="font-body text-xs text-white/50">{r.contoh}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CARA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="cara" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-yellow-400" title="🔧 Trik Faktorisasi Cerdas"/>
            {open.includes("cara") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">Pecah pembagi menjadi dua faktor yang lebih mudah, lalu bagi bertahap.</p>
                  <p className="font-body text-sm text-white/70">Contoh: <InlineMath math="840 \div 24"/>. Karena <InlineMath math="24 = 4 \times 6"/>:</p>
                  <BlockMath math="840 \div 24 = (840 \div 4) \div 6 = 210 \div 6 = 35" />
                  <p className="font-body text-sm text-white/70">Atau: <InlineMath math="840 \div 24 = (840 \div 6) \div 4 = 140 \div 4 = 35"/> ✅</p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-emerald-400" title="🔢 Contoh Soal"/>
            {open.includes("contoh") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-rose-900/30 border border-rose-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-rose-300">Contoh 1: 756 ÷ 18</p>
                  <p className="font-body text-xs text-white/60">18 = 2 × 9. 756 ÷ 2 = 378. 378 ÷ 9 = 42.</p>
                  <BlockMath math="756 \div 18 = 42" />
                </div>

                <div className="bg-sky-900/30 border border-sky-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-sky-300">Contoh 2: 1260 ÷ 36</p>
                  <p className="font-body text-xs text-white/60">36 = 4 × 9. 1260 ÷ 4 = 315. 315 ÷ 9 = 35.</p>
                  <BlockMath math="1260 \div 36 = 35" />
                </div>

              </div>
            )}
          </div>

          {/* LATIHAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="latihan" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-pink-400" title="✏️ Latihan Mandiri"/>
            {open.includes("latihan") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { soal: "480 ÷ 16", jawab: "30" },
                    { soal: "972 ÷ 27", jawab: "36" },
                    { soal: "1344 ÷ 48", jawab: "28" },
                    { soal: "2016 ÷ 56", jawab: "36" },
                  ].map(q => (
                    <details key={q.soal} className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 cursor-pointer">
                      <summary className="font-body text-xs text-white font-bold">{q.soal} = ?</summary>
                      <p className="font-mono text-lg text-yellow-300 font-bold mt-2">{q.jawab}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menghitung-cepat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Menghitung Cepat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembagianCepatPage;
