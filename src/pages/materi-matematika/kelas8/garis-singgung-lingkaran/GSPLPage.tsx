import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── SVG: External common tangent (GSPL) diagram ── */
const GSPLSVG = () => (
  <svg viewBox="0 0 340 200" className="w-full max-w-sm mx-auto my-2" aria-label="Garis singgung persekutuan luar">
    <defs>
      <style>{`
        @keyframes gsplGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #fbbf24);}50%{stroke-opacity:0.4;filter:none;}}
        .gspl{animation:gsplGlow 2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Circle 1 (larger, R) */}
    <circle cx="85" cy="110" r="60" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2.5"/>
    <circle cx="85" cy="110" r="4" fill="#3b82f6"/>
    <text x="70" y="107" fill="#60a5fa" fontSize="12" fontFamily="monospace" fontWeight="bold">O₁</text>
    {/* Circle 2 (smaller, r) */}
    <circle cx="255" cy="120" r="38" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2.5"/>
    <circle cx="255" cy="120" r="4" fill="#a855f7"/>
    <text x="260" y="117" fill="#c084fc" fontSize="12" fontFamily="monospace" fontWeight="bold">O₂</text>
    {/* Upper GSPL */}
    <line x1="60" y1="50" x2="233" y2="82" stroke="#fbbf24" strokeWidth="3" className="gspl"/>
    {/* Lower GSPL */}
    <line x1="60" y1="170" x2="233" y2="158" stroke="#fbbf24" strokeWidth="3" className="gspl"/>
    {/* Center-to-center line */}
    <line x1="85" y1="110" x2="255" y2="120" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
    {/* Radii labels */}
    <text x="78" y="145" fill="#60a5fa" fontSize="10" fontFamily="monospace">R</text>
    <text x="252" y="152" fill="#c084fc" fontSize="10" fontFamily="monospace">r</text>
    {/* Distance label */}
    <text x="160" y="126" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">d (jarak pusat)</text>
    {/* GSPL label */}
    <text x="145" y="40" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">GSPL atas</text>
    <text x="145" y="185" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">GSPL bawah</text>
    {/* Formula */}
    <rect x="5" y="3" width="330" height="22" rx="5" fill="rgba(30,41,59,0.9)" stroke="#334155" strokeWidth="1"/>
    <text x="170" y="18" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">l_luar = √(d² - (R - r)²)</text>
  </svg>
);

/* ── SVG: Proof construction for GSPL ── */
const GSPLKonstruksiSVG = () => (
  <svg viewBox="0 0 340 210" className="w-full max-w-sm mx-auto my-2" aria-label="Konstruksi GSPL">
    <defs>
      <style>{`@keyframes conGlow{0%,100%{opacity:1;}50%{opacity:0.3;}}.cong{animation:conGlow 2s ease-in-out infinite;}`}</style>
    </defs>
    {/* Circle 1 */}
    <circle cx="85" cy="115" r="60" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="2"/>
    <circle cx="85" cy="115" r="3" fill="#3b82f6"/>
    <text x="70" y="112" fill="#60a5fa" fontSize="10" fontFamily="monospace" fontWeight="bold">O₁</text>
    {/* Circle 2 */}
    <circle cx="255" cy="125" r="38" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="2"/>
    <circle cx="255" cy="125" r="3" fill="#a855f7"/>
    <text x="260" y="122" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold">O₂</text>
    {/* Auxiliary circle (R-r) centered at O1 */}
    <circle cx="85" cy="115" r="22" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3"/>
    <text x="95" y="97" fill="#4ade80" fontSize="8" fontFamily="monospace">R-r</text>
    {/* O1 to O2 line */}
    <line x1="85" y1="115" x2="255" y2="125" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"/>
    <text x="170" y="132" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">d</text>
    {/* External tangent line from O1 to auxiliary tangent point */}
    <line x1="85" y1="93" x2="255" y2="87" stroke="#fbbf24" strokeWidth="2.5" className="cong"/>
    <text x="170" y="82" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">l_luar</text>
    {/* Labels */}
    <text x="170" y="200" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">Konstruksi: Lingkaran bantu jari-jari (R-r) di O₁</text>
    <rect x="5" y="5" width="330" height="20" rx="4" fill="rgba(30,41,59,0.9)" stroke="#334155"/>
    <text x="170" y="18" fill="#eab308" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Syarat ada GSPL: d &gt; R - r (dua lingkaran tidak berdalam)</text>
  </svg>
);

const GSPLPage = () => {
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
          GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Garis Singgung Lingkaran · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Dua Lingkaran Bersama Satu Garis" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan dua roda gigi yang berputar! Ada garis yang bisa menyinggung keduanya sekaligus dari sisi luar. Inilah <strong className="text-yellow-300">Garis Singgung Persekutuan Luar (GSPL)</strong> — garis yang menyinggung dua lingkaran berbeda, dan kedua lingkaran berada di <strong className="text-cyan-300">sisi yang sama</strong> dari garis tersebut.
                </p>
                <GSPLSVG />
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Ciri khas GSPL:</strong> Kedua lingkaran terletak di sisi yang <strong className="text-yellow-300">sama</strong> relatif terhadap garis singgung. Pada umumnya terdapat <strong className="text-cyan-300">2 GSPL</strong> untuk sepasang lingkaran yang tidak saling bertumpuk.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📐 Rumus Panjang GSPL" />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Panjang GSPL dihitung menggunakan Teorema Pythagoras pada segitiga bantu. Jika <InlineMath math="R" /> = jari-jari lingkaran besar, <InlineMath math="r" /> = jari-jari lingkaran kecil, dan <InlineMath math="d" /> = jarak antar pusat, maka:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-3">
                    <BlockMath math="l_{luar} = \sqrt{d^2 - (R - r)^2}" />
                  </div>
                </div>
                <GSPLKonstruksiSVG />
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Penurunan Rumus</p>
                  <p className="font-body text-sm text-white/80">Buat garis dari <InlineMath math="O_2" /> sejajar GSPL ke radius <InlineMath math="O_1" />. Terbentuk persegi panjang dan segitiga siku-siku dengan:</p>
                  <p className="font-body text-sm text-white/80">• Hipotenusa = <InlineMath math="d = O_1O_2"/></p>
                  <p className="font-body text-sm text-white/80">• Kaki = selisih jari-jari <InlineMath math="R - r"/></p>
                  <p className="font-body text-sm text-white/80">• Sisi lain = panjang GSPL <InlineMath math="l_{luar}"/></p>
                  <BlockMath math="d^2 = (R-r)^2 + l_{luar}^2" />
                  <BlockMath math="\therefore l_{luar} = \sqrt{d^2 - (R-r)^2}" />
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-orange-200">
                    ⚠️ <strong>Syarat GSPL ada:</strong> <InlineMath math="d > |R - r|"/> (dua lingkaran tidak saling berada di dalam satu sama lain). Jika <InlineMath math="d = |R-r|"/>, hanya ada 1 GSPL. Jika <InlineMath math="d < |R-r|"/>, tidak ada GSPL.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Hitung Panjang GSPL (Mudah)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Dua lingkaran berjari-jari <strong>10 cm</strong> dan <strong>4 cm</strong>. Jarak antara kedua pusatnya adalah <strong>17 cm</strong>. Hitung panjang GSPL!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="R = 10"/> cm, <InlineMath math="r = 4"/> cm, <InlineMath math="d = 17"/> cm.</p>
                  <BlockMath math="l_{luar} = \sqrt{d^2 - (R-r)^2} = \sqrt{17^2 - (10-4)^2}" />
                  <BlockMath math="= \sqrt{289 - 36} = \sqrt{253}" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="l_{luar} = \sqrt{253} \approx 15{,}91 \text{ cm}" />
                    <p className="font-body text-sm text-green-300 text-center mt-1">✅ Panjang GSPL ≈ <strong>15,91 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Cari Jarak Pusat dari Panjang GSPL (Sedang)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Dua lingkaran berjari-jari <strong>8 cm</strong> dan <strong>3 cm</strong> memiliki GSPL sepanjang <strong>12 cm</strong>. Tentukan jarak antara kedua pusat lingkaran!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="R = 8"/> cm, <InlineMath math="r = 3"/> cm, <InlineMath math="l_{luar} = 12"/> cm. Dicari: <InlineMath math="d"/>.</p>
                  <p className="font-body text-sm text-white/80">Dari rumus GSPL:</p>
                  <BlockMath math="l_{luar}^2 = d^2 - (R-r)^2" />
                  <BlockMath math="12^2 = d^2 - (8-3)^2" />
                  <BlockMath math="144 = d^2 - 25 \Rightarrow d^2 = 169" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="d = \sqrt{169} = 13 \text{ cm}" />
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">✅ Jarak kedua pusat = <strong>13 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — GSPL dengan Rasio Jari-Jari (Sulit)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Dua lingkaran memiliki perbandingan jari-jari <InlineMath math="R : r = 3 : 1"/>. Jarak antar pusatnya <strong>20 cm</strong> dan panjang GSPL-nya <strong>16 cm</strong>. Tentukan nilai <InlineMath math="R"/> dan <InlineMath math="r"/>!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Misalkan <InlineMath math="R = 3k"/> dan <InlineMath math="r = k"/>. Dari rumus GSPL:</p>
                  <BlockMath math="l_{luar}^2 = d^2 - (R-r)^2" />
                  <BlockMath math="16^2 = 20^2 - (3k-k)^2" />
                  <BlockMath math="256 = 400 - (2k)^2" />
                  <BlockMath math="4k^2 = 144 \Rightarrow k^2 = 36 \Rightarrow k = 6" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="R = 3 \times 6 = 18 \text{ cm}, \quad r = 6 \text{ cm}" />
                    <p className="font-body text-sm text-red-200 text-center mt-1">✅ Jari-jari lingkaran besar = <strong>18 cm</strong>, lingkaran kecil = <strong>6 cm</strong>.</p>
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
                  <p className="font-body text-sm text-white/80">• <strong className="text-yellow-300">GSPL</strong>: garis yang menyinggung dua lingkaran dari sisi <strong className="text-cyan-300">luar</strong> (kedua lingkaran di sisi yang sama).</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-2"><BlockMath math="l_{luar} = \sqrt{d^2 - (R-r)^2}" /></div>
                  <p className="font-body text-sm text-white/80 mt-2">• Syarat ada: <InlineMath math="d > |R-r|"/>. Jumlah GSPL = 2 (jika lingkaran tidak saling dalam).</p>
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

export default GSPLPage;
