import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Plus, ChevronDown, ChevronUp, Lightbulb, BookOpen, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const PenjumlahanPenguranganPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["konsep", "trik1", "trik2", "contoh", "latihan"]);

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
        <Plus className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-glow-cyan mb-2 text-center">
          PENJUMLAHAN & PENGURANGAN CEPAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Menghitung Cepat · Trik Mental Math</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="💡 Prinsip Utama"/>
            {open.includes("konsep") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">Dua strategi utama yang mempercepat penjumlahan dan pengurangan di kepala:</p>
                  <p className="font-body text-sm text-white/80">1. <strong className="text-cyan-300">Kompensasi</strong> — bulatkan ke kelipatan 10, lalu koreksi.</p>
                  <p className="font-body text-sm text-white/80">2. <strong className="text-yellow-300">Pengelompokan</strong> — cari pasangan yang berjumlah 10 atau 100.</p>
                </div>
              </div>
            )}
          </div>

          {/* TRIK 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="trik1" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-cyan-400" title="🔧 Trik 1 — Kompensasi"/>
            {open.includes("trik1") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-900/20 border border-cyan-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">Bulatkan salah satu bilangan ke kelipatan 10 terdekat, hitung, lalu koreksi kembali.</p>
                  <BlockMath math="a + b = a + (b' - \delta) = (a + b') - \delta" />
                  <p className="font-body text-sm text-white/70">Contoh: <InlineMath math="47 + 38 = 47 + 40 - 2 = 87 - 2 = 85"/> ✅</p>
                  <p className="font-body text-sm text-white/70">Pengurangan: <InlineMath math="93 - 47 = 93 - 50 + 3 = 43 + 3 = 46"/> ✅</p>
                </div>
              </div>
            )}
          </div>

          {/* TRIK 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="trik2" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-yellow-400" title="🔧 Trik 2 — Pengelompokan (Pasangan 10)"/>
            {open.includes("trik2") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">Saat menjumlahkan beberapa bilangan, cari pasangan yang totalnya <strong className="text-yellow-300">10, 20, 50, atau 100</strong> terlebih dahulu.</p>
                  <p className="font-body text-sm text-white/70">Contoh: <InlineMath math="7 + 3 + 8 + 2 + 5 = (7+3) + (8+2) + 5 = 10 + 10 + 5 = 25"/> ✅</p>
                  <p className="font-body text-sm text-white/70">Contoh 2: <InlineMath math="34 + 17 + 66 + 83 = (34+66) + (17+83) = 100 + 100 = 200"/> ✅</p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-emerald-400" title="🔢 Contoh Soal"/>
            {open.includes("contoh") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-900/30 border border-cyan-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-cyan-300">Contoh 1: 568 + 297</p>
                  <p className="font-body text-sm text-white/70">568 + 300 − 3 = 868 − 3 = 865</p>
                  <BlockMath math="568 + 297 = 865" />
                </div>
                <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-yellow-300">Contoh 2: 1003 − 798</p>
                  <p className="font-body text-sm text-white/70">1003 − 800 + 2 = 203 + 2 = 205</p>
                  <BlockMath math="1003 - 798 = 205" />
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
                    { soal: "396 + 487", jawab: "883" },
                    { soal: "1002 − 597", jawab: "405" },
                    { soal: "23+77+54+46", jawab: "200" },
                    { soal: "750 − 298", jawab: "452" },
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

export default PenjumlahanPenguranganPage;
