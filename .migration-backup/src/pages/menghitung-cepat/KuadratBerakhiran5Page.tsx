import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Square, ChevronDown, ChevronUp, Lightbulb, BookOpen, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const KuadratBerakhiran5Page = () => {
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
        <Square className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-glow-cyan mb-2 text-center">
          KUADRAT BILANGAN BERAKHIRAN 5
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Menghitung Cepat · Trik Mental Math</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="💡 Konsep Dasar"/>
            {open.includes("konsep") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">
                    Setiap bilangan yang berakhiran <strong className="text-emerald-300">5</strong> memiliki pola kuadrat yang sangat mudah.
                    Hasilnya selalu berakhiran <strong className="text-yellow-300">25</strong>, dan bagian depannya didapat dari mengalikan
                    <strong className="text-cyan-300"> n dengan (n+1)</strong> di mana n adalah digit di depan angka 5.
                  </p>
                  <BlockMath math="(n5)^2 = n \times (n+1) \mid 25" />
                  <p className="font-body text-xs text-white/50">di mana <InlineMath math="n"/> adalah digit atau kelompok digit sebelum angka 5.</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-3">
                  <p className="font-body text-xs text-white/60">
                    <strong className="text-cyan-300">Bukti aljabar:</strong>{" "}
                    Misalkan bilangan = <InlineMath math="10n + 5"/>.
                    Maka <InlineMath math="(10n+5)^2 = 100n^2 + 100n + 25 = 100n(n+1) + 25"/>.
                    Artinya, bagian depan adalah <InlineMath math="n(n+1)"/> dan bagian belakang adalah 25. ✅
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CARA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="cara" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-emerald-400" title="📋 Langkah-Langkah"/>
            {open.includes("cara") && (
              <div className="px-5 pb-5 space-y-2">
                {[
                  { step: "1", text: "Ambil digit/kelompok digit sebelum angka 5 (sebut n).", color: "bg-emerald-600" },
                  { step: "2", text: "Hitung n × (n + 1).", color: "bg-sky-600" },
                  { step: "3", text: "Tulis hasilnya, lalu tambahkan \"25\" di belakang.", color: "bg-orange-600" },
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

                <div className="bg-emerald-900/30 border border-emerald-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-emerald-300">Contoh 1: 35²</p>
                  <p className="font-body text-sm text-white/70">n = 3. Hitung 3 × 4 = 12. Tambahkan 25.</p>
                  <BlockMath math="35^2 = 12 \mid 25 = 1225" />
                </div>

                <div className="bg-sky-900/30 border border-sky-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-sky-300">Contoh 2: 75²</p>
                  <p className="font-body text-sm text-white/70">n = 7. Hitung 7 × 8 = 56. Tambahkan 25.</p>
                  <BlockMath math="75^2 = 56 \mid 25 = 5625" />
                </div>

                <div className="bg-orange-900/30 border border-orange-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-orange-300">Contoh 3: 105²</p>
                  <p className="font-body text-sm text-white/70">n = 10. Hitung 10 × 11 = 110. Tambahkan 25.</p>
                  <BlockMath math="105^2 = 110 \mid 25 = 11025" />
                </div>

                <div className="bg-violet-900/30 border border-violet-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">Contoh 4: 25²</p>
                  <p className="font-body text-sm text-white/70">n = 2. Hitung 2 × 3 = 6. Tambahkan 25.</p>
                  <BlockMath math="25^2 = 6 \mid 25 = 625" />
                </div>

              </div>
            )}
          </div>

          {/* LATIHAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="latihan" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-pink-400" title="✏️ Latihan Mandiri"/>
            {open.includes("latihan") && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/60">Hitung di kepala, lalu buka jawaban.</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { soal: "45²", jawab: "2025" },
                    { soal: "65²", jawab: "4225" },
                    { soal: "85²", jawab: "7225" },
                    { soal: "95²", jawab: "9025" },
                    { soal: "115²", jawab: "13225" },
                    { soal: "125²", jawab: "15625" },
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
                  <p className="font-body text-sm text-white/80">• Trik ini <strong className="text-yellow-300">100% akurat</strong> untuk semua bilangan berakhiran 5, tak terbatas jumlah digitnya.</p>
                  <p className="font-body text-sm text-white/80">• Sangat berguna untuk menghitung luas persegi atau soal kuadrat dalam waktu singkat.</p>
                  <p className="font-body text-sm text-white/80">• Hafalkan: 5²=25, 15²=225, 25²=625, 35²=1225, 45²=2025, 55²=3025, 65²=4225, 75²=5625, 85²=7225, 95²=9025.</p>
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

export default KuadratBerakhiran5Page;
