import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── SVG: Circle with tangent line touching at one point ── */
const TangentBasicSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto my-2" aria-label="Garis singgung lingkaran">
    <defs>
      <style>{`
        @keyframes tangentPulse{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #fbbf24);}50%{stroke-opacity:0.4;filter:none;}}
        @keyframes dotPulse{0%,100%{r:6;}50%{r:4;}}
        .tang{animation:tangentPulse 2s ease-in-out infinite;}
        .tdot{animation:dotPulse 2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Circle */}
    <circle cx="120" cy="100" r="65" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="2.5"/>
    {/* Center point */}
    <circle cx="120" cy="100" r="4" fill="#22c55e"/>
    <text x="125" y="96" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    {/* Radius to tangent point */}
    <line x1="120" y1="100" x2="185" y2="100" stroke="#22c55e" strokeWidth="1.8" strokeDasharray="5 3"/>
    <text x="147" y="94" fill="#4ade80" fontSize="10" fontFamily="monospace">r</text>
    {/* Tangent point */}
    <circle cx="185" cy="100" r="5" fill="#fbbf24" className="tdot"/>
    <text x="190" y="94" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">T</text>
    {/* Right angle mark */}
    <polyline points="185,100 185,88 173,88" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.8"/>
    {/* Tangent line */}
    <line x1="185" y1="20" x2="185" y2="180" stroke="#fbbf24" strokeWidth="3" className="tang"/>
    <text x="196" y="35" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">garis singgung</text>
    {/* Right angle label */}
    <text x="152" y="115" fill="#fff" fontSize="9" fontFamily="monospace" opacity="0.7">90°</text>
    {/* Secant line (for comparison) — dashed */}
    <line x1="50" y1="40" x2="220" y2="160" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5"/>
    <text x="225" y="165" fill="#94a3b8" fontSize="9" fontFamily="monospace" opacity="0.7">garis potong</text>
    {/* Two intersection points of secant */}
    <circle cx="80" cy="61" r="3" fill="#94a3b8" opacity="0.6"/>
    <circle cx="173" cy="141" r="3" fill="#94a3b8" opacity="0.6"/>
    {/* Legend */}
    <rect x="10" y="168" width="120" height="28" rx="5" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1"/>
    <line x1="18" y1="178" x2="38" y2="178" stroke="#fbbf24" strokeWidth="2.5"/>
    <text x="44" y="181" fill="#fbbf24" fontSize="8" fontFamily="monospace">Garis Singgung (1 titik)</text>
    <line x1="18" y1="190" x2="38" y2="190" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3"/>
    <text x="44" y="193" fill="#94a3b8" fontSize="8" fontFamily="monospace">Garis Potong (2 titik)</text>
  </svg>
);

/* ── SVG: Three cases — no intersection, tangent, secant ── */
const TigaKasusSVG = () => (
  <svg viewBox="0 0 320 160" className="w-full max-w-sm mx-auto my-2" aria-label="Tiga kasus garis dengan lingkaran">
    <defs>
      <style>{`@keyframes caseGlow{0%,100%{opacity:1;}50%{opacity:0.4;}}.cg{animation:caseGlow 2.2s ease-in-out infinite;}`}</style>
    </defs>
    {/* Case 1: No intersection */}
    <g>
      <circle cx="55" cy="80" r="40" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2"/>
      <line x1="10" y1="30" x2="100" y2="30" stroke="#ef4444" strokeWidth="2.5"/>
      <text x="55" y="135" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Tidak memotong</text>
      <text x="55" y="147" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">(0 titik potong)</text>
    </g>
    {/* Case 2: Tangent */}
    <g>
      <circle cx="160" cy="80" r="40" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2"/>
      <line x1="115" y1="40" x2="205" y2="40" stroke="#fbbf24" strokeWidth="2.5" className="cg"/>
      <circle cx="160" cy="40" r="4" fill="#fbbf24"/>
      <text x="160" y="135" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Garis Singgung</text>
      <text x="160" y="147" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">(1 titik singgung)</text>
    </g>
    {/* Case 3: Secant */}
    <g>
      <circle cx="265" cy="80" r="40" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2"/>
      <line x1="220" y1="55" x2="310" y2="105" stroke="#f97316" strokeWidth="2.5"/>
      <circle cx="234" cy="62" r="4" fill="#f97316"/>
      <circle cx="296" cy="98" r="4" fill="#f97316"/>
      <text x="265" y="135" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">Garis Potong/Sekans</text>
      <text x="265" y="147" fill="#f97316" fontSize="8" textAnchor="middle" fontFamily="monospace">(2 titik potong)</text>
    </g>
  </svg>
);

/* ── SVG: Properties of tangent — radius perpendicular ── */
const SifatTegakLurusSVG = () => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-2" aria-label="Sifat garis singgung tegak lurus jari-jari">
    <defs>
      <style>{`
        @keyframes radGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #22c55e);}50%{stroke-opacity:0.3;filter:none;}}
        .rg{animation:radGlow 1.8s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Circle */}
    <circle cx="100" cy="110" r="70" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="2"/>
    {/* Center O */}
    <circle cx="100" cy="110" r="4" fill="#22c55e"/>
    <text x="88" y="107" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    {/* Radius OT */}
    <line x1="100" y1="110" x2="170" y2="110" stroke="#22c55e" strokeWidth="2.5" className="rg"/>
    <text x="130" y="104" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold">r</text>
    {/* Tangent point T */}
    <circle cx="170" cy="110" r="5" fill="#fbbf24"/>
    <text x="175" y="107" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">T</text>
    {/* Right angle mark */}
    <polyline points="170,110 170,97 157,97" fill="none" stroke="#fff" strokeWidth="1.8" opacity="0.9"/>
    <text x="145" y="128" fill="#fff" fontSize="10" fontFamily="monospace" opacity="0.8">90°</text>
    {/* Tangent line */}
    <line x1="170" y1="30" x2="170" y2="190" stroke="#fbbf24" strokeWidth="3"/>
    {/* External point P */}
    <circle cx="230" cy="110" r="4" fill="#f97316"/>
    <text x="236" y="114" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold">P</text>
    {/* Tangent segment PT */}
    <line x1="170" y1="110" x2="230" y2="110" stroke="#f97316" strokeWidth="2.5" strokeDasharray="5 3"/>
    <text x="196" y="126" fill="#fb923c" fontSize="10" fontFamily="monospace">panjang</text>
    <text x="196" y="138" fill="#fb923c" fontSize="10" fontFamily="monospace">singgung</text>
    {/* Labels */}
    <text x="100" y="20" fill="#eab308" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">OT ⊥ garis singgung</text>
  </svg>
);

const PengertianPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "definisi", "sifat", "contoh1", "contoh2", "contoh3", "rangkuman"]);

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
          PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Garis Singgung Lingkaran · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Garis yang Hanya Menyentuh Sekali" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernahkah kamu melihat roda sepeda yang menyentuh tanah? Tanah adalah <strong className="text-cyan-300">garis singgung</strong> bagi roda — menyentuh tepat di satu titik, tidak menembus ke dalam! Konsep inilah yang kita pelajari: sebuah garis yang <em>hanya menyentuh</em> lingkaran di <strong className="text-yellow-300">tepat satu titik</strong>, lalu pergi lagi.
                </p>
                <TigaKasusSVG />
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Ingat!</strong> Ada tiga kemungkinan posisi garis terhadap lingkaran: tidak berpotongan (0 titik), singgung (1 titik), atau memotong/sekans (2 titik). Yang kita fokuskan adalah yang tengah — <strong className="text-yellow-300">singgung</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DEFINISI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="definisi" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📐 Definisi Garis Singgung Lingkaran" />
            {open.includes("definisi") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">Garis singgung lingkaran</strong> adalah garis lurus yang memotong lingkaran di <strong className="text-yellow-300">tepat satu titik</strong>. Titik pertemuan itu disebut <strong className="text-orange-300">titik singgung (T)</strong>. Di titik ini, jari-jari lingkaran dan garis singgung selalu <strong className="text-green-300">saling tegak lurus (90°)</strong>.
                  </p>
                </div>
                <TangentBasicSVG />
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Istilah-Istilah Penting</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-green-900/40 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold">O</p>
                      <p className="text-white/60 mt-1">Pusat lingkaran</p>
                    </div>
                    <div className="bg-yellow-900/40 border border-yellow-500/20 rounded-lg p-2 text-center">
                      <p className="text-yellow-300 font-bold">T</p>
                      <p className="text-white/60 mt-1">Titik singgung</p>
                    </div>
                    <div className="bg-orange-900/40 border border-orange-500/20 rounded-lg p-2 text-center">
                      <p className="text-orange-300 font-bold">r</p>
                      <p className="text-white/60 mt-1">Jari-jari lingkaran</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIFAT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="sifat" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="🔬 Sifat-Sifat Garis Singgung Lingkaran" />
            {open.includes("sifat") && (
              <div className="px-5 pb-5 space-y-4">
                <SifatTegakLurusSVG />
                <div className="space-y-3">
                  {[
                    { num: 1, color: "blue", title: "Tegak Lurus terhadap Jari-jari", desc: "Di titik singgung T, jari-jari OT selalu tegak lurus (⊥) dengan garis singgung. Artinya sudut OT = 90°.", formula: "OT \\perp \\text{garis singgung}" },
                    { num: 2, color: "green", title: "Dua Garis Singgung dari Satu Titik Luar", desc: "Dari titik P di luar lingkaran, selalu bisa ditarik tepat dua garis singgung ke lingkaran.", formula: "PT_1 = PT_2" },
                    { num: 3, color: "orange", title: "Panjang Garis Singgung Sama", desc: "Kedua garis singgung dari titik luar yang sama selalu memiliki panjang yang sama (simetri).", formula: "|PT_1| = |PT_2|" },
                  ].map(({ num, color, title, desc, formula }) => (
                    <div key={num} className={`flex gap-3 bg-${color}-900/30 border border-${color}-500/30 rounded-lg p-3`}>
                      <span className={`bg-${color}-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5`}>{num}</span>
                      <div>
                        <p className="font-body text-sm font-bold text-white">{title}</p>
                        <p className="font-body text-xs text-white/60 mt-1">{desc}</p>
                        <div className="mt-2"><InlineMath math={formula} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Identifikasi Garis Singgung (Mudah)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Lingkaran berpusat di O dengan jari-jari 5 cm. Garis <InlineMath math="g"/> menyentuh lingkaran di titik T. Jika <InlineMath math="OT = 5"/> cm, apakah garis <InlineMath math="g"/> adalah garis singgung lingkaran? Berapa besar sudut antara OT dan garis <InlineMath math="g"/>?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Cek: OT = jari-jari = 5 cm → T adalah titik pada lingkaran ✓</p>
                  <p className="font-body text-sm text-white/80">Jika garis <InlineMath math="g"/> hanya menyentuh di titik T, maka berdasarkan sifat garis singgung:</p>
                  <BlockMath math="\angle OTg = 90°" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">✅ Ya, garis <InlineMath math="g"/> adalah garis singgung. Sudut antara OT dan garis <InlineMath math="g"/> adalah <strong>90°</strong> (tegak lurus).</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sifat Dua Garis Singgung dari Titik Luar (Sedang)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Dari titik P di luar lingkaran O, ditarik dua garis singgung yang menyinggung di titik A dan B. Jika <InlineMath math="PA = 3x - 2"/> cm dan <InlineMath math="PB = x + 6"/> cm, tentukan panjang PA!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Gunakan sifat: dua garis singgung dari titik luar yang sama mempunyai panjang sama.</p>
                  <BlockMath math="PA = PB" />
                  <BlockMath math="3x - 2 = x + 6" />
                  <BlockMath math="2x = 8 \Rightarrow x = 4" />
                  <BlockMath math="PA = 3(4) - 2 = 10 \text{ cm}" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">✅ Panjang PA = PB = <strong>10 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Segitiga dan Garis Singgung (Sulit)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Segitiga ABC mempunyai lingkaran dalam yang menyinggung sisi AB di P, sisi BC di Q, dan sisi AC di R. Diketahui <InlineMath math="AB = 10"/> cm, <InlineMath math="BC = 8"/> cm, <InlineMath math="AC = 7"/> cm. Tentukan panjang AP!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Misalkan: <InlineMath math="AP = AR = x"/>, <InlineMath math="BP = BQ = y"/>, <InlineMath math="CQ = CR = z"/>.</p>
                  <p className="font-body text-sm text-white/80">Dari panjang sisi-sisi segitiga:</p>
                  <BlockMath math="x + y = AB = 10" />
                  <BlockMath math="y + z = BC = 8" />
                  <BlockMath math="x + z = AC = 7" />
                  <p className="font-body text-sm text-white/80">Jumlahkan ketiga persamaan:</p>
                  <BlockMath math="2(x + y + z) = 25 \Rightarrow x + y + z = 12{,}5" />
                  <p className="font-body text-sm text-white/80">Untuk mencari x: kurangkan persamaan 2 dari jumlah total:</p>
                  <BlockMath math="x = (x+y+z) - (y+z) = 12{,}5 - 8 = 4{,}5 \text{ cm}" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">✅ Panjang <strong>AP = 4,5 cm</strong>.</p>
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
                  <p className="font-body text-sm text-white/80">• <strong className="text-yellow-300">Garis singgung</strong> menyentuh lingkaran di <strong className="text-cyan-300">tepat 1 titik</strong> (titik singgung T).</p>
                  <p className="font-body text-sm text-white/80">• Di titik singgung, jari-jari <InlineMath math="OT \perp"/> garis singgung (<strong className="text-green-300">sudut 90°</strong>).</p>
                  <p className="font-body text-sm text-white/80">• Dari titik luar P, ada <strong className="text-orange-300">dua garis singgung</strong> dengan panjang sama: <InlineMath math="PT_1 = PT_2"/>.</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Prinsip "garis singgung tegak lurus jari-jari" digunakan dalam desain roda gigi mesin dan orbit satelit — orbit lingkar selalu tegak lurus terhadap gaya gravitasi (jari-jari)!
                  </p>
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

export default PengertianPage;
