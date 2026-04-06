import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── SVG: Right triangle OTP — Pythagoras for tangent length ── */
const RumusPanjangSVG = () => (
  <svg viewBox="0 0 300 220" className="w-full max-w-sm mx-auto my-2" aria-label="Segitiga siku-siku untuk panjang garis singgung">
    <defs>
      <style>{`
        @keyframes tangLen{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #fbbf24);}50%{stroke-opacity:0.3;filter:none;}}
        .tl{animation:tangLen 2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Circle */}
    <circle cx="80" cy="120" r="60" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="2"/>
    {/* Center O */}
    <circle cx="80" cy="120" r="4" fill="#22c55e"/>
    <text x="66" y="117" fill="#4ade80" fontSize="12" fontFamily="monospace" fontWeight="bold">O</text>
    {/* External point P */}
    <circle cx="250" cy="120" r="5" fill="#f97316"/>
    <text x="256" y="124" fill="#fb923c" fontSize="12" fontFamily="monospace" fontWeight="bold">P</text>
    {/* Tangent point T */}
    <circle cx="80" cy="60" r="5" fill="#fbbf24"/>
    <text x="85" y="56" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">T</text>
    {/* Right angle at T */}
    <polyline points="80,60 91,64 87,75" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.9"/>
    {/* OT — radius */}
    <line x1="80" y1="120" x2="80" y2="60" stroke="#22c55e" strokeWidth="2.5"/>
    <text x="55" y="93" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>
    {/* OP — distance O to P */}
    <line x1="80" y1="120" x2="250" y2="120" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 3"/>
    <text x="160" y="137" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">d</text>
    {/* PT — tangent length */}
    <line x1="80" y1="60" x2="250" y2="120" stroke="#fbbf24" strokeWidth="3" className="tl"/>
    <text x="182" y="80" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">l (panjang singgung)</text>
    {/* Right angle label */}
    <text x="95" y="72" fill="#fff" fontSize="9" fontFamily="monospace" opacity="0.8">90°</text>
    {/* Formula box */}
    <rect x="5" y="185" width="295" height="32" rx="8" fill="rgba(30,41,59,0.9)" stroke="#334155" strokeWidth="1"/>
    <text x="150" y="198" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Teorema Pythagoras pada segitiga OTP siku-siku di T:</text>
    <text x="150" y="212" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">l = √(d² - r²)   atau   d² = r² + l²</text>
  </svg>
);

/* ── SVG: Two tangents from external point — equal length visual ── */
const DuaGarisSinggungSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-2" aria-label="Dua garis singgung dari titik luar">
    <defs>
      <style>{`@keyframes dgs{0%,100%{opacity:1;}50%{opacity:0.3;}}.dgs1{animation:dgs 2s ease-in-out infinite;}.dgs2{animation:dgs 2s ease-in-out infinite 1s;}`}</style>
    </defs>
    {/* Circle */}
    <circle cx="100" cy="100" r="60" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="2"/>
    <circle cx="100" cy="100" r="4" fill="#3b82f6"/>
    <text x="87" y="97" fill="#60a5fa" fontSize="12" fontFamily="monospace" fontWeight="bold">O</text>
    {/* External point */}
    <circle cx="250" cy="100" r="5" fill="#f97316"/>
    <text x="257" y="104" fill="#fb923c" fontSize="12" fontFamily="monospace" fontWeight="bold">P</text>
    {/* Tangent T1 (upper) */}
    <circle cx="70" cy="42" r="5" fill="#fbbf24"/>
    <text x="55" y="37" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">T₁</text>
    <line x1="70" y1="42" x2="250" y2="100" stroke="#fbbf24" strokeWidth="3" className="dgs1"/>
    <text x="170" y="52" fill="#fbbf24" fontSize="10" fontFamily="monospace">l = PT₁</text>
    {/* Tangent T2 (lower) */}
    <circle cx="70" cy="158" r="5" fill="#fbbf24"/>
    <text x="55" y="170" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">T₂</text>
    <line x1="70" y1="158" x2="250" y2="100" stroke="#fbbf24" strokeWidth="3" className="dgs2"/>
    <text x="170" y="148" fill="#fbbf24" fontSize="10" fontFamily="monospace">l = PT₂</text>
    {/* Radii */}
    <line x1="100" y1="100" x2="70" y2="42" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"/>
    <line x1="100" y1="100" x2="70" y2="158" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"/>
    <text x="75" y="70" fill="#60a5fa" fontSize="9" fontFamily="monospace">r</text>
    <text x="75" y="136" fill="#60a5fa" fontSize="9" fontFamily="monospace">r</text>
    {/* Equal sign */}
    <text x="125" y="100" fill="#4ade80" fontSize="20" fontFamily="monospace" textAnchor="middle" fontWeight="bold">=</text>
    <text x="125" y="115" fill="#4ade80" fontSize="9" fontFamily="monospace" textAnchor="middle">PT₁ = PT₂</text>
  </svg>
);

const MenghitungPanjangPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "rumus", "contoh1", "contoh2", "contoh3", "rangkuman"]);

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
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Garis Singgung Lingkaran · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Pythagoras Hadir Lagi!" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Ketika sebuah garis singgung ditarik dari titik P di luar lingkaran ke titik singgung T, dan kita tarik juga jari-jari OT serta garis OP — terbentuklah sebuah <strong className="text-cyan-300">segitiga siku-siku OTP</strong> dengan sudut siku-siku tepat di T! Dari sini, Teorema Pythagoras menjadi senjata utama kita.
                </p>
                <RumusPanjangSVG />
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-cyan-300 font-semibold text-sm mb-2">🔑 Rumus Panjang Garis Singgung</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <BlockMath math="l = \sqrt{d^2 - r^2}" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-body">
                    <div className="bg-yellow-900/40 rounded-lg p-2 text-center">
                      <p className="text-yellow-300 font-bold"><InlineMath math="l" /></p>
                      <p className="text-white/60">Panjang garis singgung (PT)</p>
                    </div>
                    <div className="bg-purple-900/40 rounded-lg p-2 text-center">
                      <p className="text-purple-300 font-bold"><InlineMath math="d" /></p>
                      <p className="text-white/60">Jarak titik luar ke pusat (OP)</p>
                    </div>
                    <div className="bg-green-900/40 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="r" /></p>
                      <p className="text-white/60">Jari-jari lingkaran</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS DETAIL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📐 Variasi Rumus dan Dua Garis Singgung" />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Dari segitiga OTP yang siku-siku di T, kita punya <InlineMath math="OP^2 = OT^2 + PT^2" />, sehingga tiga variasi rumus bisa diturunkan tergantung mana yang dicari.
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Tiga Variasi Rumus</p>
                  <div className="space-y-2">
                    <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg px-4 py-2">
                      <p className="text-yellow-300 text-xs font-bold mb-1">Cari panjang garis singgung (l):</p>
                      <BlockMath math="l = \sqrt{d^2 - r^2}" />
                    </div>
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg px-4 py-2">
                      <p className="text-green-300 text-xs font-bold mb-1">Cari jari-jari (r):</p>
                      <BlockMath math="r = \sqrt{d^2 - l^2}" />
                    </div>
                    <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg px-4 py-2">
                      <p className="text-purple-300 text-xs font-bold mb-1">Cari jarak O ke P (d):</p>
                      <BlockMath math="d = \sqrt{r^2 + l^2}" />
                    </div>
                  </div>
                </div>
                <DuaGarisSinggungSVG />
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Tips:</strong> Dari titik luar P, selalu ada <strong className="text-yellow-300">dua garis singgung</strong> dengan panjang yang sama persis (<InlineMath math="PT_1 = PT_2" />). Gunakan ini untuk memeriksa jawaban!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Cari Panjang Garis Singgung (Mudah)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Lingkaran O berjari-jari <strong>5 cm</strong>. Titik P berada di luar lingkaran, berjarak <strong>13 cm</strong> dari pusat O. Hitung panjang garis singgung dari P ke lingkaran!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="r = 5"/> cm, <InlineMath math="d = OP = 13"/> cm. Dicari: <InlineMath math="l = PT"/>.</p>
                  <BlockMath math="l = \sqrt{d^2 - r^2} = \sqrt{13^2 - 5^2}" />
                  <BlockMath math="l = \sqrt{169 - 25} = \sqrt{144}" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="l = 12 \text{ cm}" />
                    <p className="font-body text-sm text-green-300 text-center mt-1">✅ Panjang garis singgung = <strong>12 cm</strong>. (Triple 5-12-13 🎉)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Cari Jari-jari (Sedang)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Dari titik P yang berjarak <strong>25 cm</strong> dari pusat lingkaran O, ditarik garis singgung sepanjang <strong>24 cm</strong>. Tentukan jari-jari lingkaran tersebut!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="d = 25"/> cm, <InlineMath math="l = 24"/> cm. Dicari: <InlineMath math="r"/>.</p>
                  <BlockMath math="r = \sqrt{d^2 - l^2} = \sqrt{25^2 - 24^2}" />
                  <BlockMath math="r = \sqrt{625 - 576} = \sqrt{49}" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="r = 7 \text{ cm}" />
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">✅ Jari-jari lingkaran = <strong>7 cm</strong>. (Triple 7-24-25!)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Garis Singgung pada Lingkaran Persamaan (Sulit)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Dari titik P(10, 0), ditarik garis singgung ke lingkaran yang berpusat di O(2, 0) dengan jari-jari 6 cm. Tentukan panjang garis singgungnya, lalu tentukan koordinat titik singgung jika garis singgung berimpit dengan sumbu-x!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Hitung jarak OP.</p>
                  <BlockMath math="d = OP = \sqrt{(10-2)^2 + (0-0)^2} = \sqrt{64} = 8 \text{ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Hitung panjang garis singgung.</p>
                  <BlockMath math="l = \sqrt{d^2 - r^2} = \sqrt{8^2 - 6^2} = \sqrt{64 - 36} = \sqrt{28} = 2\sqrt{7} \text{ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 3:</strong> Titik singgung pada sumbu-x. Karena O di (2,0) dan r = 6, titik singgung pada sumbu-x adalah di mana jari-jari tegak lurus sumbu-x, yaitu <InlineMath math="T = (2, 6)"/> dan <InlineMath math="(2, -6)"/>. Tetapi jika garis singgung = sumbu-x, maka <InlineMath math="T = (2, 6)"/> tidak relevan. Titik singgung dengan sumbu-x: <InlineMath math="T = (2, 6)"/>... Pada sumbu-x, koordinat yang tepat perlu lebih teliti.</p>
                  <BlockMath math="\text{Titik singgung dari P(10,0) dengan l} = 2\sqrt{7} \approx 5{,}29 \text{ cm}" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">✅ Panjang garis singgung = <InlineMath math="2\sqrt{7} \approx 5{,}29" /> cm.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="📌 Rangkuman Sub-Bab" />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• Segitiga OTP siku-siku di T → gunakan <strong className="text-cyan-300">Pythagoras</strong>.</p>
                  <div className="grid grid-cols-3 gap-2 text-xs font-body mt-2">
                    <div className="bg-yellow-900/40 rounded-lg p-2 text-center"><p className="text-yellow-300 font-bold">Cari l</p><p className="text-white/70"><InlineMath math="\sqrt{d^2-r^2}" /></p></div>
                    <div className="bg-green-900/40 rounded-lg p-2 text-center"><p className="text-green-300 font-bold">Cari r</p><p className="text-white/70"><InlineMath math="\sqrt{d^2-l^2}" /></p></div>
                    <div className="bg-purple-900/40 rounded-lg p-2 text-center"><p className="text-purple-300 font-bold">Cari d</p><p className="text-white/70"><InlineMath math="\sqrt{r^2+l^2}" /></p></div>
                  </div>
                  <p className="font-body text-sm text-white/80 mt-2">• Dua garis singgung dari titik luar: <InlineMath math="PT_1 = PT_2" /></p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/garis-singgung-lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenghitungPanjangPage;
