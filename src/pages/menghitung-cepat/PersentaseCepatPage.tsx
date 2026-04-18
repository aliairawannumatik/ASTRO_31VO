import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Percent, ChevronDown, ChevronUp, Lightbulb, BookOpen, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const PersentaseCepatPage = () => {
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
        <Percent className="w-10 h-10 text-pink-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-pink-300 text-glow-cyan mb-2 text-center">
          PERSENTASE CEPAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Menghitung Cepat · Trik Mental Math</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="💡 Ide Dasar"/>
            {open.includes("konsep") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-pink-900/30 border border-pink-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">Persentase sebenarnya mudah jika kamu tahu cara <strong className="text-pink-300">memecah persentase</strong> menjadi bagian yang lebih kecil.</p>
                  <p className="font-body text-sm text-white/80">Kunci utamanya: <strong className="text-yellow-300">1% dari suatu bilangan = bilangan ÷ 100.</strong></p>
                  <BlockMath math="1\% \text{ dari } N = \frac{N}{100}" />
                  <p className="font-body text-sm text-white/80">Semua persentase lain bisa dibangun dari 1% ini.</p>
                </div>
              </div>
            )}
          </div>

          {/* TRIK 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="trik1" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-pink-400" title="🔧 Trik 1 — Metode Persentase Balik"/>
            {open.includes("trik1") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-pink-900/20 border border-pink-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-pink-300">a% dari b = b% dari a</p>
                  <p className="font-body text-sm text-white/80">
                    Ini terkesan ajaib, tapi benar secara matematis! Gunakan ketika salah satu persentase lebih mudah dihitung.
                  </p>
                  <BlockMath math="a\% \times b = b\% \times a" />
                  <p className="font-body text-sm text-white/70">Contoh: <InlineMath math="8\% \times 25 = 25\% \times 8 = \frac{1}{4} \times 8 = 2"/> ✅</p>
                </div>
              </div>
            )}
          </div>

          {/* TRIK 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="trik2" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-cyan-400" title="🔧 Trik 2 — Pecah % Jadi Bagian Kecil"/>
            {open.includes("trik2") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-900/20 border border-cyan-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">Pecah persentase menjadi persentase standar yang mudah:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { persen: "50%", arti: "÷ 2" },
                      { persen: "25%", arti: "÷ 4" },
                      { persen: "10%", arti: "÷ 10" },
                      { persen: "5%", arti: "÷ 20 atau ½ × 10%" },
                      { persen: "1%", arti: "÷ 100" },
                      { persen: "20%", arti: "÷ 5 atau 2 × 10%" },
                    ].map(r => (
                      <div key={r.persen} className="bg-slate-800/50 border border-slate-600/30 rounded p-2">
                        <span className="text-yellow-300 font-bold">{r.persen}</span>
                        <span className="text-white/60 ml-2">{r.arti}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-sm text-white/80 mt-2">Contoh: 35% = 25% + 10% → langsung jumlahkan keduanya.</p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-emerald-400" title="🔢 Contoh Soal"/>
            {open.includes("contoh") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-pink-900/30 border border-pink-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-pink-300">35% dari 240</p>
                  <p className="font-body text-sm text-white/70">25% dari 240 = 60. 10% dari 240 = 24. Total = 60 + 24 = 84.</p>
                  <BlockMath math="35\% \times 240 = 84" />
                </div>

                <div className="bg-sky-900/30 border border-sky-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-sky-300">15% dari 380</p>
                  <p className="font-body text-sm text-white/70">10% = 38. 5% = 19. Total = 38 + 19 = 57.</p>
                  <BlockMath math="15\% \times 380 = 57" />
                </div>

                <div className="bg-emerald-900/30 border border-emerald-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-emerald-300">4% dari 75 (Trik balik)</p>
                  <p className="font-body text-sm text-white/70">4% dari 75 = 75% dari 4 = ¾ × 4 = 3.</p>
                  <BlockMath math="4\% \times 75 = 75\% \times 4 = 3" />
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
                    { soal: "20% dari 350", jawab: "70" },
                    { soal: "15% dari 60", jawab: "9" },
                    { soal: "6% dari 50", jawab: "3" },
                    { soal: "45% dari 200", jawab: "90" },
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

export default PersentaseCepatPage;
