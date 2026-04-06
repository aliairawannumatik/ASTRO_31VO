import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const LingkaranDalamSegtigaSVG = () => (
  <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto my-2" aria-label="Lingkaran dalam segitiga">
    <defs>
      <style>{`@keyframes glowIn{0%,100%{filter:drop-shadow(0 0 6px #22c55e);}50%{filter:none;}}.gi{animation:glowIn 2s ease-in-out infinite;}`}</style>
    </defs>
    <polygon points="140,20 250,200 30,200" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="2.5"/>
    <circle cx="140" cy="143" r="57" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="2.5" className="gi"/>
    <circle cx="140" cy="143" r="4" fill="#22c55e"/>
    <text x="145" y="140" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold">O</text>
    <line x1="140" y1="143" x2="140" y2="200" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 2"/>
    <text x="145" y="178" fill="#fbbf24" fontSize="9" fontFamily="monospace">r</text>
    <circle cx="140" cy="200" r="3.5" fill="#fbbf24"/>
    <text x="140" y="215" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Lingkaran Dalam Segitiga (Incircle)</text>
  </svg>
);

const LingkaranLuarSegiEmpatSVG = () => (
  <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto my-2" aria-label="Lingkaran luar persegi">
    <defs>
      <style>{`@keyframes rotatePulse{0%,100%{stroke-opacity:0.9;}50%{stroke-opacity:0.3;}}.rp{animation:rotatePulse 2.5s ease-in-out infinite;}`}</style>
    </defs>
    <rect x="65" y="50" width="150" height="120" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="2.5"/>
    <circle cx="140" cy="110" r="96" fill="none" stroke="#f97316" strokeWidth="2.5" className="rp"/>
    <line x1="65" y1="50" x2="215" y2="170" stroke="#f97316" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.7"/>
    <text x="135" y="170" fill="#f97316" fontSize="9" textAnchor="middle" fontFamily="monospace">d = diagonal persegi panjang</text>
    <circle cx="140" cy="110" r="4" fill="#f97316"/>
    <text x="145" y="107" fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold">O</text>
    <text x="140" y="210" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Lingkaran Luar Persegi Panjang (Circumcircle)</text>
  </svg>
);

const SegitigaDalamLingkaranSVG = () => (
  <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga dalam lingkaran">
    <defs>
      <style>{`@keyframes triangleSpin{0%{transform-origin:130px 110px;transform:rotate(0deg);}100%{transform-origin:130px 110px;transform:rotate(360deg);}}.ts{animation:triangleSpin 8s linear infinite;}`}</style>
    </defs>
    <circle cx="130" cy="110" r="85" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="2.5"/>
    <polygon points="130,25 215,155 45,155" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="2.5" className="ts"/>
    <circle cx="130" cy="25" r="5" fill="#fbbf24"/>
    <circle cx="215" cy="155" r="5" fill="#fbbf24"/>
    <circle cx="45" cy="155" r="5" fill="#fbbf24"/>
    <circle cx="130" cy="110" r="4" fill="#06b6d4"/>
    <line x1="130" y1="110" x2="130" y2="25" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4 2"/>
    <text x="120" y="70" fill="#4ade80" fontSize="10" fontFamily="monospace">R</text>
    <text x="130" y="210" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Segitiga Bertulis dalam Lingkaran</text>
  </svg>
);

const KaitanBangunDatarPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "kaitan", "contoh1", "contoh2", "contoh3", "rangkuman"]);
  const toggle = (id: string) => { playPopSound(); setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]); };

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
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">KAITAN LINGKARAN DENGAN BANGUN DATAR</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Lingkaran · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🔗 Lingkaran dan Sahabat-Sahabatnya" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Lingkaran tidak hidup sendiri! Ia sering "bersahabat" dengan bangun datar lain. Ada lingkaran yang berada <strong className="text-green-300">di dalam bangun datar</strong> (disebut <em>lingkaran dalam</em> atau <em>incircle</em>), dan ada yang berada <strong className="text-orange-300">di luar bangun datar</strong> sambil memuat semua sudutnya (disebut <em>lingkaran luar</em> atau <em>circumcircle</em>).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-2 text-center">
                    <p className="text-green-300 text-xs font-bold">Lingkaran Dalam</p>
                    <p className="text-white/50 text-xs mt-1">Berada di dalam bangun datar, menyinggung semua sisinya</p>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-2 text-center">
                    <p className="text-orange-300 text-xs font-bold">Lingkaran Luar</p>
                    <p className="text-white/50 text-xs mt-1">Memuat semua titik sudut bangun datar di tepinya</p>
                  </div>
                  <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-2 text-center">
                    <p className="text-purple-300 text-xs font-bold">Bangun Bertulis</p>
                    <p className="text-white/50 text-xs mt-1">Bangun datar yang terlukis di dalam lingkaran</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="kaitan" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📐 Kaitan Penting Lingkaran dan Bangun Datar" />
            {open.includes("kaitan") && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Setiap bangun datar memiliki hubungan unik dengan lingkaran. Kuncinya adalah menemukan jari-jari atau diameter dari hubungan tersebut.</p>
                </div>

                <div>
                  <p className="font-body text-sm font-bold text-green-300 mb-2">1. Lingkaran Dalam Segitiga</p>
                  <LingkaranDalamSegtigaSVG />
                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-3 text-sm font-body">
                    <p className="text-white/80">Pusat lingkaran dalam = <strong className="text-green-300">titik potong garis bagi sudut</strong> segitiga.</p>
                    <BlockMath math="r_{\text{dalam}} = \frac{\text{Luas Segitiga}}{s} \quad \text{di mana } s = \frac{a+b+c}{2}" />
                    <p className="text-white/60 text-xs">s = setengah keliling segitiga (semi-perimeter)</p>
                  </div>
                </div>

                <div>
                  <p className="font-body text-sm font-bold text-orange-300 mb-2">2. Lingkaran Luar Persegi Panjang</p>
                  <LingkaranLuarSegiEmpatSVG />
                  <div className="bg-orange-900/20 border border-orange-500/20 rounded-lg p-3 text-sm font-body">
                    <p className="text-white/80">Jari-jari lingkaran luar persegi panjang = <strong className="text-orange-300">setengah diagonal</strong>.</p>
                    <BlockMath math="R = \frac{d}{2} = \frac{\sqrt{p^2 + l^2}}{2}" />
                  </div>
                </div>

                <div>
                  <p className="font-body text-sm font-bold text-yellow-300 mb-2">3. Segitiga Bertulis dalam Lingkaran</p>
                  <SegitigaDalamLingkaranSVG />
                  <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-3 text-sm font-body">
                    <p className="text-white/80">Jika <strong className="text-yellow-300">segitiga siku-siku</strong> bertulis dalam lingkaran, maka <strong className="text-cyan-300">sisi miring = diameter</strong>.</p>
                    <BlockMath math="d = \text{sisi miring} = \sqrt{a^2 + b^2}" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Lingkaran Luar Persegi (Mudah)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah persegi memiliki sisi 10 cm. Tentukan jari-jari lingkaran yang melalui semua titik sudut persegi tersebut! (Gunakan <InlineMath math="\pi = 3{,}14"/>)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Lingkaran luar persegi berpusat di perpotongan diagonal. Jari-jarinya = setengah diagonal persegi.</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Hitung diagonal persegi</p>
                  <BlockMath math="d = s\sqrt{2} = 10\sqrt{2} \approx 10 \times 1{,}414 = 14{,}14 \text{ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Hitung jari-jari</p>
                  <BlockMath math="R = \frac{d}{2} = \frac{14{,}14}{2} = 7{,}07 \text{ cm}" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">✅ Jari-jari lingkaran luar persegi ≈ <strong>7,07 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Segitiga Siku-Siku dalam Lingkaran (Sedang)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Segitiga siku-siku bertulis dalam lingkaran. Dua sisi siku-sikunya adalah 6 cm dan 8 cm. Tentukan keliling lingkaran tersebut! (π = 3,14)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Cari sisi miring (= diameter lingkaran)</p>
                  <BlockMath math="c = \sqrt{a^2 + b^2} = \sqrt{6^2 + 8^2} = \sqrt{36 + 64} = \sqrt{100} = 10 \text{ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Jari-jari = setengah diameter</p>
                  <BlockMath math="R = \frac{10}{2} = 5 \text{ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 3:</strong> Keliling lingkaran</p>
                  <BlockMath math="K = 2\pi R = 2 \times 3{,}14 \times 5 = 31{,}4 \text{ cm}" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">✅ Keliling lingkaran = <strong>31,4 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Lingkaran Dalam Segitiga (Sulit)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Segitiga siku-siku ABC dengan siku-siku di C memiliki <InlineMath math="AC = 5"/> cm, <InlineMath math="BC = 12"/> cm. Hitunglah jari-jari lingkaran dalam segitiga tersebut!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Cari sisi miring AB</p>
                  <BlockMath math="AB = \sqrt{5^2 + 12^2} = \sqrt{25 + 144} = \sqrt{169} = 13 \text{ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Hitung luas segitiga</p>
                  <BlockMath math="L = \frac{1}{2} \times AC \times BC = \frac{1}{2} \times 5 \times 12 = 30 \text{ cm}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 3:</strong> Hitung semi-perimeter (s)</p>
                  <BlockMath math="s = \frac{a + b + c}{2} = \frac{5 + 12 + 13}{2} = 15 \text{ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 4:</strong> Jari-jari lingkaran dalam</p>
                  <BlockMath math="r = \frac{L}{s} = \frac{30}{15} = 2 \text{ cm}" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">✅ Jari-jari lingkaran dalam = <strong>2 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="📌 Rangkuman Sub-Bab" />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• <strong className="text-green-300">Lingkaran dalam segitiga:</strong> <InlineMath math="r = L/s"/> (L = luas, s = semi-perimeter)</p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">Lingkaran luar persegi panjang:</strong> <InlineMath math="R = \text{diagonal}/2"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-yellow-300">Segitiga siku-siku dalam lingkaran:</strong> sisi miring = diameter</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Konsep "lingkaran luar" digunakan dalam navigasi — tiga sinyal GPS membentuk tiga lingkaran, dan posisimu ada di perpotongannya!
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default KaitanBangunDatarPage;
