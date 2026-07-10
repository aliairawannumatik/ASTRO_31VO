import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { X, ChevronDown, ChevronUp, Lightbulb, BookOpen, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const PerkalianDuaDigitPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["konsep", "cara", "contoh", "latihan", "tips"]);

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
        <X className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-yellow-300 text-glow-cyan mb-2 text-center">
          PERKALIAN DUA DIGIT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Menghitung Cepat · Metode Silang & FOIL Mental</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="💡 Konsep — Metode FOIL Mental"/>
            {open.includes("konsep") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">
                    Pecah setiap bilangan dua digit menjadi puluhan dan satuan, lalu kalikan tiap bagian (seperti FOIL dalam aljabar).
                  </p>
                  <BlockMath math="\overline{ab} \times \overline{cd} = (10a+b)(10c+d)" />
                  <BlockMath math="= 100ac + 10(ad+bc) + bd" />
                  <p className="font-body text-xs text-white/50">Hitung dari kanan: satuan, puluhan, ratusan.</p>
                </div>
              </div>
            )}
          </div>

          {/* CARA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="cara" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-yellow-400" title="📋 Langkah-Langkah"/>
            {open.includes("cara") && (
              <div className="px-5 pb-5 space-y-2">
                {[
                  { step: "1", text: "Kalikan satuan × satuan → ambil satuan hasilnya, simpan puluhan.", color: "bg-yellow-600" },
                  { step: "2", text: "Kalikan (puluhan × satuan) + (satuan × puluhan) + simpanan → ambil satuan, simpan puluhan.", color: "bg-orange-600" },
                  { step: "3", text: "Kalikan puluhan × puluhan + simpanan → ini bagian paling kiri.", color: "bg-red-600" },
                ].map(s => (
                  <div key={s.step} className="flex gap-3 items-start">
                    <span className={`${s.color} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5`}>{s.step}</span>
                    <p className="font-body text-sm text-white/80">{s.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-emerald-400" title="🔢 Contoh Soal"/>
            {open.includes("contoh") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-yellow-300">Contoh 1: 23 × 41</p>
                  <p className="font-body text-xs text-white/60">Satuan: 3×1=3. Silang: 2×1+3×4=2+12=14 (tulis 4, simpan 1). Ratusan: 2×4+1=9.</p>
                  <BlockMath math="23 \times 41 = 943" />
                </div>

                <div className="bg-sky-900/30 border border-sky-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-sky-300">Contoh 2: 37 × 58</p>
                  <p className="font-body text-xs text-white/60">Satuan: 7×8=56 (tulis 6, simpan 5). Silang: 3×8+7×5+5=24+35+5=64 (tulis 4, simpan 6). Ratusan: 3×5+6=21.</p>
                  <BlockMath math="37 \times 58 = 2146" />
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
                    { soal: "24 × 32", jawab: "768" },
                    { soal: "45 × 63", jawab: "2835" },
                    { soal: "17 × 83", jawab: "1411" },
                    { soal: "56 × 79", jawab: "4424" },
                  ].map(q => (
                    <details key={q.soal} className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 cursor-pointer">
                      <summary className="font-mono text-sm text-white font-bold">{q.soal} = ?</summary>
                      <p className="font-mono text-lg text-yellow-300 font-bold mt-2">{q.jawab}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TIPS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="tips" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="⚡ Tips & Manfaat"/>
            {open.includes("tips") && (
              <div className="px-5 pb-5">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• Latih metode ini dengan perkalian tabel 1–9 yang sudah hafal sebagai fondasi.</p>
                  <p className="font-body text-sm text-white/80">• Metode silang ini sama persis dengan <strong className="text-yellow-300">perkalian bersusun</strong>, hanya dilakukan di kepala dari kanan ke kiri.</p>
                  <p className="font-body text-sm text-white/80">• Kombinasikan dengan trik Perkalian Dekat 100 untuk bilangan di rentang 90–109.</p>
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

export default PerkalianDuaDigitPage;
