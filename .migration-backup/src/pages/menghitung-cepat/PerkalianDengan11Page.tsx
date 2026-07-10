import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Hash, ChevronDown, ChevronUp, Lightbulb, BookOpen, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const PerkalianDengan11Page = () => {
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
        <Hash className="w-10 h-10 text-sky-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-glow-cyan mb-2 text-center">
          PERKALIAN DENGAN 11
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Menghitung Cepat · Trik Mental Math</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="💡 Konsep Dasar"/>
            {open.includes("konsep") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-sky-900/30 border border-sky-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">
                    Saat mengalikan bilangan dua digit dengan <strong className="text-sky-300">11</strong>, hasilnya bisa diperoleh hanya dengan
                    <strong className="text-yellow-300"> menjumlahkan dua digit tersebut</strong> dan menempatkannya di tengah.
                  </p>
                  <p className="font-body text-sm text-white/80">
                    Ini bukan sulap — ini adalah konsekuensi dari cara perkalian bekerja secara aljabar.
                  </p>
                  <BlockMath math="\overline{ab} \times 11 = a \mid (a+b) \mid b" />
                  <p className="font-body text-xs text-white/50">di mana <InlineMath math="a"/> dan <InlineMath math="b"/> adalah digit bilangan tersebut.</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-3">
                  <p className="font-body text-xs text-white/60">
                    <strong className="text-cyan-300">Bukti aljabar:</strong>{" "}
                    Misalkan bilangan dua digit = <InlineMath math="10a + b"/>.
                    Maka <InlineMath math="(10a+b)\times 11 = 110a + 11b = 100a + 10(a+b) + b"/>.
                    Hasilnya adalah angka ratusan <InlineMath math="a"/>, puluhan <InlineMath math="(a+b)"/>, satuan <InlineMath math="b"/>. ✅
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CARA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="cara" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-sky-400" title="📋 Langkah-Langkah"/>
            {open.includes("cara") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="space-y-2">
                  {[
                    { step: "1", text: "Pisahkan dua digit bilangan yang dikalikan 11.", color: "bg-sky-600" },
                    { step: "2", text: "Jumlahkan kedua digit tersebut.", color: "bg-emerald-600" },
                    { step: "3", "text": "Tempatkan hasil penjumlahan di tengah kedua digit asal.", color: "bg-orange-600" },
                    { step: "⚠", text: "Jika jumlah digit ≥ 10, tambahkan 1 ke digit kiri (simpan).", color: "bg-red-600" },
                  ].map(s => (
                    <div key={s.step} className="flex gap-3 items-start">
                      <span className={`${s.color} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5`}>{s.step}</span>
                      <p className="font-body text-sm text-white/80">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-emerald-400" title="🔢 Contoh Soal"/>
            {open.includes("contoh") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-emerald-900/30 border border-emerald-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-emerald-300">Contoh 1: 35 × 11</p>
                  <p className="font-body text-sm text-white/70">Digit: 3 dan 5. Jumlah: 3 + 5 = 8.</p>
                  <BlockMath math="35 \times 11 = 3 \mid 8 \mid 5 = 385" />
                </div>

                <div className="bg-sky-900/30 border border-sky-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-sky-300">Contoh 2: 72 × 11</p>
                  <p className="font-body text-sm text-white/70">Digit: 7 dan 2. Jumlah: 7 + 2 = 9.</p>
                  <BlockMath math="72 \times 11 = 7 \mid 9 \mid 2 = 792" />
                </div>

                <div className="bg-orange-900/30 border border-orange-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-orange-300">Contoh 3: 86 × 11 (jumlah digit ≥ 10)</p>
                  <p className="font-body text-sm text-white/70">Digit: 8 dan 6. Jumlah: 8 + 6 = 14 ≥ 10, tulis 4 di tengah, simpan 1 ke kiri.</p>
                  <BlockMath math="86 \times 11 = (8{+}1) \mid 4 \mid 6 = 946" />
                </div>

                <div className="bg-violet-900/30 border border-violet-600/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">Contoh 4: Bilangan 3 digit — 253 × 11</p>
                  <p className="font-body text-sm text-white/70">Digit: 2, 5, 3. Sisipkan jumlah berurutan dari kiri ke kanan.</p>
                  <BlockMath math="253 \times 11 = 2 \mid (2{+}5) \mid (5{+}3) \mid 3 = 2783" />
                </div>

              </div>
            )}
          </div>

          {/* LATIHAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="latihan" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-pink-400" title="✏️ Latihan Mandiri"/>
            {open.includes("latihan") && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/60">Coba hitung di kepala, lalu buka jawabannya.</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { soal: "43 × 11", jawab: "473" },
                    { soal: "65 × 11", jawab: "715" },
                    { soal: "27 × 11", jawab: "297" },
                    { soal: "94 × 11", jawab: "1034" },
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
                  <p className="font-body text-sm text-white/80">• Trik ini berlaku untuk <strong className="text-yellow-300">bilangan berapa pun digitnya</strong> — selalu sisipkan jumlah digit yang bersebelahan.</p>
                  <p className="font-body text-sm text-white/80">• Berguna saat soal melibatkan tabel kali, pola bilangan, atau estimasi cepat.</p>
                  <p className="font-body text-sm text-white/80">• Latihan rutin 5 menit sehari membuat trik ini menjadi refleks otomatis.</p>
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

export default PerkalianDengan11Page;
