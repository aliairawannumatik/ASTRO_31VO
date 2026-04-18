import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Calculator, ChevronDown, ChevronUp, Lightbulb, BookOpen, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const KuadratCepatPage = () => {
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
        <Calculator className="w-10 h-10 text-violet-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-glow-cyan mb-2 text-center">
          KUADRAT CEPAT UMUM
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Menghitung Cepat · Trik Mental Math</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="💡 Dua Metode Utama"/>
            {open.includes("konsep") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">Metode 1 — Patokan Bilangan Bulat Dekat</p>
                  <p className="font-body text-sm text-white/80">Pilih bilangan bulat terdekat sebagai patokan, lalu gunakan identitas aljabar:</p>
                  <BlockMath math="n^2 = (n+d)(n-d) + d^2" />
                  <p className="font-body text-xs text-white/50">di mana <InlineMath math="d"/> adalah selisih antara <InlineMath math="n"/> dan bilangan patokan.</p>
                </div>
                <div className="bg-sky-900/30 border border-sky-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-sky-300">Metode 2 — Pecah menjadi (a + b)² atau (a − b)²</p>
                  <BlockMath math="(a+b)^2 = a^2 + 2ab + b^2" />
                  <BlockMath math="(a-b)^2 = a^2 - 2ab + b^2" />
                  <p className="font-body text-xs text-white/50">Pilih <InlineMath math="a"/> sebagai kelipatan 10 terdekat, dan <InlineMath math="b"/> sebagai selisihnya.</p>
                </div>
              </div>
            )}
          </div>

          {/* CARA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="cara" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-violet-400" title="📋 Langkah-Langkah Metode 2"/>
            {open.includes("cara") && (
              <div className="px-5 pb-5 space-y-2">
                {[
                  { step: "1", text: "Bulatkan bilangan ke kelipatan 10 terdekat — itulah nilai a.", color: "bg-violet-600" },
                  { step: "2", text: "Hitung selisih b = n − a (boleh negatif).", color: "bg-sky-600" },
                  { step: "3", text: "Hitung a², lalu 2ab, lalu b².", color: "bg-emerald-600" },
                  { step: "4", text: "Jumlahkan ketiganya: a² + 2ab + b².", color: "bg-orange-600" },
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

                <div className="bg-violet-900/30 border border-violet-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">Contoh 1: 23² (Metode 2)</p>
                  <p className="font-body text-sm text-white/70">a = 20, b = 3</p>
                  <BlockMath math="23^2 = 20^2 + 2(20)(3) + 3^2 = 400 + 120 + 9 = 529" />
                </div>

                <div className="bg-sky-900/30 border border-sky-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-sky-300">Contoh 2: 48² (Metode 2 dengan b negatif)</p>
                  <p className="font-body text-sm text-white/70">a = 50, b = −2</p>
                  <BlockMath math="48^2 = 50^2 - 2(50)(2) + 2^2 = 2500 - 200 + 4 = 2304" />
                </div>

                <div className="bg-orange-900/30 border border-orange-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-orange-300">Contoh 3: 97² (Metode 1)</p>
                  <p className="font-body text-sm text-white/70">Patokan = 100, d = 3. Maka (97+3)(97−3) + 3² = 100 × 94 + 9</p>
                  <BlockMath math="97^2 = 100 \times 94 + 9 = 9400 + 9 = 9409" />
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
                    { soal: "32²", jawab: "1024" },
                    { soal: "47²", jawab: "2209" },
                    { soal: "63²", jawab: "3969" },
                    { soal: "98²", jawab: "9604" },
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
                  <p className="font-body text-sm text-white/80">• Metode 1 cocok untuk bilangan yang dekat dengan kelipatan 10 (mis. 99², 51², 98²).</p>
                  <p className="font-body text-sm text-white/80">• Metode 2 cocok untuk semua bilangan — cukup pilih <InlineMath math="a"/> yang mudah dikuadratkan.</p>
                  <p className="font-body text-sm text-white/80">• Kedua metode ini adalah <strong className="text-yellow-300">aplikasi nyata identitas aljabar</strong> yang dipelajari di kelas 7 dan 8.</p>
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

export default KuadratCepatPage;
