import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Target, ChevronDown, ChevronUp, Lightbulb, BookOpen, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const PerkalianDekat100Page = () => {
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
        <Target className="w-10 h-10 text-orange-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-glow-cyan mb-2 text-center">
          PERKALIAN BILANGAN DEKAT 100
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Menghitung Cepat · Trik Vedic Math</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="💡 Konsep Dasar"/>
            {open.includes("konsep") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-orange-900/30 border border-orange-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">
                    Untuk mengalikan dua bilangan yang keduanya dekat dengan <strong className="text-orange-300">100</strong>,
                    kita gunakan selisih masing-masing dari 100 sebagai "kode defisit". Metode ini disebut <strong className="text-yellow-300">Vedic Math — Nikhilam Sutra</strong>.
                  </p>
                  <p className="font-body text-sm font-bold text-orange-300">Rumus:</p>
                  <BlockMath math="a \times b = \bigl[(a-100)+(b)\bigr] \times 100 + (a-100)(b-100)" />
                  <p className="font-body text-xs text-white/50">Atau lebih mudah: hasil kiri = a + (b−100), hasil kanan = (100−a)(100−b).</p>
                </div>
              </div>
            )}
          </div>

          {/* CARA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="cara" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-orange-400" title="📋 Langkah-Langkah"/>
            {open.includes("cara") && (
              <div className="px-5 pb-5 space-y-2">
                {[
                  { step: "1", text: "Hitung selisih tiap bilangan dari 100: d₁ = 100 − a, d₂ = 100 − b.", color: "bg-orange-600" },
                  { step: "2", text: "Bagian KIRI: (a − d₂) atau (b − d₁) — keduanya sama.", color: "bg-sky-600" },
                  { step: "3", text: "Bagian KANAN: d₁ × d₂ (ditulis 2 digit; jika ≥ 100, simpan ke kiri).", color: "bg-emerald-600" },
                  { step: "4", text: "Gabungkan: bagian kiri (×100) + bagian kanan.", color: "bg-violet-600" },
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

                <div className="bg-orange-900/30 border border-orange-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-orange-300">Contoh 1: 97 × 96</p>
                  <p className="font-body text-sm text-white/70">d₁ = 3, d₂ = 4. Kiri = 97 − 4 = 93. Kanan = 3 × 4 = 12.</p>
                  <BlockMath math="97 \times 96 = 9312" />
                </div>

                <div className="bg-sky-900/30 border border-sky-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-sky-300">Contoh 2: 98 × 93</p>
                  <p className="font-body text-sm text-white/70">d₁ = 2, d₂ = 7. Kiri = 98 − 7 = 91. Kanan = 2 × 7 = 14.</p>
                  <BlockMath math="98 \times 93 = 9114" />
                </div>

                <div className="bg-violet-900/30 border border-violet-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">Contoh 3: 88 × 94 (kanan bisa 2 digit)</p>
                  <p className="font-body text-sm text-white/70">d₁ = 12, d₂ = 6. Kiri = 88 − 6 = 82. Kanan = 12 × 6 = 72.</p>
                  <BlockMath math="88 \times 94 = 8272" />
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
                    { soal: "99 × 97", jawab: "9603" },
                    { soal: "95 × 92", jawab: "8740" },
                    { soal: "91 × 98", jawab: "8918" },
                    { soal: "87 × 96", jawab: "8352" },
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
                  <p className="font-body text-sm text-white/80">• Trik ini juga berlaku untuk bilangan <strong className="text-yellow-300">di atas 100</strong> — tinggal ganti tanda selisih menjadi positif.</p>
                  <p className="font-body text-sm text-white/80">• Contoh: 103 × 104 → kiri = 103 + 4 = 107, kanan = 3 × 4 = 12 → <strong className="text-emerald-300">10712</strong>.</p>
                  <p className="font-body text-sm text-white/80">• Sangat berguna untuk perkalian "besar" yang sering muncul di soal olimpiade.</p>
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

export default PerkalianDekat100Page;
