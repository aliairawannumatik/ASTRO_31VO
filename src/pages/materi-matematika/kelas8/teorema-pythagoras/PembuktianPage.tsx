import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import PythagorasDiscoveryAnimation from "@/components/PythagorasDiscoveryAnimation";
import PythagorasRearrangementAnimation from "@/components/PythagorasRearrangementAnimation";

/* ── SVG: Visual proof — four identical right triangles rearranged inside a square ── */
const PembuktianSVG = () => (
  <svg viewBox="0 0 320 220" className="w-full max-w-sm mx-auto my-2" aria-label="Pembuktian Teorema Pythagoras">
    <defs>
      <style>{`
        @keyframes fadeLabel{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .lbl-anim{animation:fadeLabel 2.5s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Outer big square (side c) */}
    <rect x="20" y="10" width="160" height="160" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 3"/>
    {/* 4 right triangles: a=96, b=64, c=160 — colours differ */}
    {/* Top-left triangle: vertices (20,10),(116,10),(20,74) */}
    <polygon points="20,10 116,10 20,74" fill="#3b82f6" fillOpacity="0.7" stroke="#60a5fa" strokeWidth="1.5"/>
    {/* Top-right triangle: vertices (116,10),(180,10),(180,74) */}
    <polygon points="116,10 180,10 180,74" fill="#22c55e" fillOpacity="0.7" stroke="#4ade80" strokeWidth="1.5"/>
    {/* Bottom-right triangle: vertices (180,74),(180,170),(84,170) */}
    <polygon points="180,74 180,170 84,170" fill="#f97316" fillOpacity="0.7" stroke="#fb923c" strokeWidth="1.5"/>
    {/* Bottom-left triangle: vertices (20,74),(84,170),(20,170) */}
    <polygon points="20,74 84,170 20,170" fill="#a855f7" fillOpacity="0.7" stroke="#c084fc" strokeWidth="1.5"/>
    {/* Inner square (side c rotated) */}
    <polygon points="116,10 180,74 84,170 20,106" fill="#fef08a" fillOpacity="0.25" stroke="#eab308" strokeWidth="2"/>

    {/* Labels */}
    <text x="67" y="8" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle" className="lbl-anim">a</text>
    <text x="148" y="8" fill="#4ade80" fontSize="11" fontWeight="bold" textAnchor="middle" className="lbl-anim">b</text>
    <text x="8" y="44" fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle" className="lbl-anim">b</text>
    <text x="8" y="126" fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle" className="lbl-anim">a</text>
    <text x="188" y="44" fill="#4ade80" fontSize="11" fontWeight="bold" textAnchor="middle" className="lbl-anim">a</text>
    <text x="188" y="126" fill="#fb923c" fontSize="11" fontWeight="bold" textAnchor="middle" className="lbl-anim">b</text>
    <text x="50" y="178" fill="#fb923c" fontSize="11" fontWeight="bold" textAnchor="middle" className="lbl-anim">b</text>
    <text x="134" y="178" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle" className="lbl-anim">a</text>
    {/* c label on inner square side */}
    <text x="155" y="47" fill="#eab308" fontSize="11" fontWeight="bold" className="lbl-anim">c</text>

    {/* Right angle marks */}
    <rect x="20" y="10" width="8" height="8" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5"/>
    <rect x="172" y="10" width="8" height="8" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5"/>
    <rect x="172" y="162" width="8" height="8" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5"/>
    <rect x="20" y="162" width="8" height="8" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5"/>

    {/* Right panel explanation */}
    <text x="210" y="30" fill="#94a3b8" fontSize="10" fontFamily="monospace">Luas persegi besar:</text>
    <text x="210" y="46" fill="#eab308" fontSize="10" fontFamily="monospace" fontWeight="bold">= (a + b)²</text>
    <text x="210" y="72" fill="#94a3b8" fontSize="10" fontFamily="monospace">= 4 segitiga +</text>
    <text x="210" y="86" fill="#94a3b8" fontSize="10" fontFamily="monospace">  persegi tengah</text>
    <text x="210" y="112" fill="#94a3b8" fontSize="10" fontFamily="monospace">4 × ½ab + c²</text>
    <text x="210" y="138" fill="#94a3b8" fontSize="10" fontFamily="monospace">= 2ab + c²</text>
    <text x="210" y="164" fill="#eab308" fontSize="10" fontFamily="monospace" fontWeight="bold">∴ a² + b² = c²</text>
    <line x1="205" y1="20" x2="205" y2="175" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
  </svg>
);

/* ── SVG: Right triangle labelled a, b, c ── */
const SegitigaSikuSVG = () => (
  <svg viewBox="0 0 200 160" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga siku-siku">
    <defs>
      <style>{`
        @keyframes sideGlow{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.3;}}
        .side-a{animation:sideGlow 1.8s ease-in-out infinite;}
        .side-b{animation:sideGlow 1.8s ease-in-out infinite 0.6s;}
        .side-c{animation:sideGlow 1.8s ease-in-out infinite 1.2s;}
      `}</style>
    </defs>
    {/* Triangle */}
    <polygon points="20,130 160,130 20,20" fill="rgba(59,130,246,0.15)" stroke="none"/>
    {/* Side b (base, horizontal) */}
    <line x1="20" y1="130" x2="160" y2="130" stroke="#22c55e" strokeWidth="3" className="side-b"/>
    {/* Side a (vertical) */}
    <line x1="20" y1="20" x2="20" y2="130" stroke="#3b82f6" strokeWidth="3" className="side-a"/>
    {/* Side c (hypotenuse) */}
    <line x1="20" y1="20" x2="160" y2="130" stroke="#f97316" strokeWidth="3" className="side-c"/>
    {/* Right angle mark */}
    <polyline points="20,110 40,110 40,130" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.7"/>
    {/* Labels */}
    <text x="8" y="80" fill="#60a5fa" fontSize="14" fontWeight="bold">a</text>
    <text x="87" y="148" fill="#4ade80" fontSize="14" fontWeight="bold">b</text>
    <text x="100" y="75" fill="#fb923c" fontSize="14" fontWeight="bold">c</text>
    <text x="20" y="13" fill="#94a3b8" fontSize="9">A</text>
    <text x="162" y="134" fill="#94a3b8" fontSize="9">B</text>
    <text x="8" y="134" fill="#94a3b8" fontSize="9">C</text>
    {/* 90° label */}
    <text x="44" y="126" fill="#fff" fontSize="8" opacity="0.6">90°</text>
  </svg>
);

const PembuktianPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "animasi", "rearrangement", "pembuktian", "contoh1", "contoh2", "contoh3", "rangkuman"]);

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
          PEMBUKTIAN TEOREMA PYTHAGORAS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Teorema Pythagoras · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Selamat Datang di Dunia Pythagoras!"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Lebih dari 2.500 tahun lalu, seorang matematikawan Yunani bernama <strong className="text-cyan-300">Pythagoras</strong> menemukan sebuah pola yang luar biasa di setiap segitiga siku-siku. Hubungan antar sisi-sisinya selalu berlaku, tanpa terkecuali! Inilah yang kita kenal sebagai <strong className="text-yellow-300">Teorema Pythagoras</strong> — salah satu rumus paling terkenal di dunia matematika.
                </p>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-cyan-300 font-semibold text-sm mb-3">🔭 Rumus Inti Teorema Pythagoras</p>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="a^2 + b^2 = c^2"/>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-body">
                    <div className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-2 text-center">
                      <p className="text-blue-300 font-bold"><InlineMath math="a"/></p>
                      <p className="text-white/60 mt-1">Sisi tegak (kaki 1)</p>
                    </div>
                    <div className="bg-green-900/40 border border-green-500/30 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="b"/></p>
                      <p className="text-white/60 mt-1">Sisi alas (kaki 2)</p>
                    </div>
                    <div className="bg-orange-900/40 border border-orange-500/30 rounded-lg p-2 text-center">
                      <p className="text-orange-300 font-bold"><InlineMath math="c"/></p>
                      <p className="text-white/60 mt-1">Hipotenusa (miring)</p>
                    </div>
                  </div>
                </div>
                <SegitigaSikuSVG/>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Ingat!</strong> Huruf <strong className="text-orange-300">c</strong> selalu mewakili sisi miring (hipotenusa) — yaitu sisi yang berhadapan dengan sudut 90°. Ini adalah sisi terpanjang dari segitiga siku-siku.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ANIMASI PENEMUAN */}
          <div className="bg-card/80 backdrop-blur border border-cyan-500/40 rounded-xl overflow-hidden">
            <SectionHeader id="animasi" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title="🎬 Animasi: Bagaimana Pythagoras Menemukannya?"/>
            {open.includes("animasi") && (
              <div className="px-4 pb-5 space-y-3">
                <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-3">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    🚀 Ikuti animasi langkah demi langkah ini untuk melihat bagaimana teorema Pythagoras <strong className="text-yellow-300">ditemukan secara visual</strong> melalui metode persegi pada setiap sisi segitiga siku-siku!
                  </p>
                </div>
                <PythagorasDiscoveryAnimation />
              </div>
            )}
          </div>

          {/* ANIMASI REARRANGEMENT */}
          <div className="bg-card/80 backdrop-blur border border-violet-500/40 rounded-xl overflow-hidden">
            <SectionHeader id="rearrangement" icon={<Target className="w-5 h-5"/>} iconColor="text-violet-400" title="🔀 Animasi: Metode Penyusunan Ulang (Rearrangement)"/>
            {open.includes("rearrangement") && (
              <div className="px-4 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-3">
                  <p className="font-body text-sm text-violet-200 leading-relaxed">
                    🔬 Bukti paling elegan! Empat segitiga siku-siku yang sama disusun di dalam persegi besar <InlineMath math="(a+b)^2"/>. Dengan <strong className="text-yellow-300">menggeser posisi keempat segitiga</strong>, terlihat bahwa ruang kosong berubah dari <strong className="text-yellow-300">c²</strong> menjadi <strong className="text-cyan-300">a² + b²</strong> — membuktikan teorema secara visual!
                  </p>
                </div>
                <PythagorasRearrangementAnimation />
              </div>
            )}
          </div>

          {/* PEMBUKTIAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="pembuktian" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title="📐 Pembuktian Visual: Metode Persegi"/>
            {open.includes("pembuktian") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Teorema Pythagoras dapat dibuktikan dengan <strong className="text-cyan-300">menyusun empat segitiga siku-siku yang identik</strong> di dalam sebuah persegi besar. Luas persegi besar bisa dihitung dengan dua cara berbeda — dan keduanya harus sama. Dari sini, kita membuktikan bahwa <InlineMath math="a^2 + b^2 = c^2"/>.
                  </p>
                </div>

                <PembuktianSVG/>

                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Langkah-Langkah Pembuktian</p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <div>
                        <p className="font-body text-sm text-white/80">Buat persegi besar dengan panjang sisi <InlineMath math="(a + b)"/>. Luasnya:</p>
                        <div className="mt-1"><BlockMath math="L_{\text{besar}} = (a+b)^2 = a^2 + 2ab + b^2"/></div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <div>
                        <p className="font-body text-sm text-white/80">Di dalamnya, susun 4 segitiga siku-siku (kaki <InlineMath math="a"/> dan <InlineMath math="b"/>) sehingga membentuk persegi kecil bersisi <InlineMath math="c"/> di tengah. Total luas 4 segitiga:</p>
                        <div className="mt-1"><BlockMath math="L_{4\triangle} = 4 \times \tfrac{1}{2}ab = 2ab"/></div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-orange-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <div>
                        <p className="font-body text-sm text-white/80">Luas persegi kecil di tengah adalah <InlineMath math="c^2"/>. Jadi, luas persegi besar bisa juga ditulis:</p>
                        <div className="mt-1"><BlockMath math="L_{\text{besar}} = 2ab + c^2"/></div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-yellow-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">4</span>
                      <div>
                        <p className="font-body text-sm text-white/80">Samakan dua ekspresi luas persegi besar:</p>
                        <div className="mt-1"><BlockMath math="a^2 + 2ab + b^2 = 2ab + c^2"/></div>
                        <p className="font-body text-sm text-white/80 mt-1">Kurangi kedua ruas dengan <InlineMath math="2ab"/>:</p>
                        <div className="mt-1 bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-2">
                          <BlockMath math="\boxed{a^2 + b^2 = c^2}"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-green-200">
                    ✅ <strong>Terbukti!</strong> Dengan cara menyamakan luas dari dua perspektif berbeda, kita membuktikan bahwa di setiap segitiga siku-siku, <strong className="text-yellow-300">kuadrat sisi miring = jumlah kuadrat dua sisi lainnya</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title="✏️ Contoh 1 — Verifikasi Tripel Pythagoras (Mudah)"/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Apakah segitiga dengan panjang sisi <strong>3 cm, 4 cm, dan 5 cm</strong> merupakan segitiga siku-siku?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Identifikasi sisi terpanjang sebagai hipotenusa: <InlineMath math="c = 5"/>, <InlineMath math="a = 3"/>, <InlineMath math="b = 4"/>.</p>
                  <p className="font-body text-sm text-white/80">Cek apakah berlaku <InlineMath math="a^2 + b^2 = c^2"/>:</p>
                  <BlockMath math="3^2 + 4^2 = 9 + 16 = 25"/>
                  <BlockMath math="c^2 = 5^2 = 25"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="25 = 25 \checkmark"/>
                    <p className="font-body text-sm text-green-300 text-center mt-1">
                      ✅ Karena <InlineMath math="a^2 + b^2 = c^2"/>, maka segitiga 3-4-5 <strong>adalah segitiga siku-siku</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title="✏️ Contoh 2 — Menentukan Jenis Segitiga (Sedang)"/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Seorang arsitek memiliki tiga batang besi dengan panjang <strong>8 m, 15 m, dan 17 m</strong>. Buktikan bahwa ketiga batang tersebut dapat membentuk segitiga siku-siku!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Sisi terpanjang <InlineMath math="c = 17"/>, dua sisi lain <InlineMath math="a = 8"/> dan <InlineMath math="b = 15"/>.</p>
                  <p className="font-body text-sm text-white/80">Periksa sisi kiri persamaan Pythagoras:</p>
                  <BlockMath math="a^2 + b^2 = 8^2 + 15^2 = 64 + 225 = 289"/>
                  <p className="font-body text-sm text-white/80">Periksa sisi kanan:</p>
                  <BlockMath math="c^2 = 17^2 = 289"/>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="289 = 289 \checkmark"/>
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">
                      ✅ Terbukti! Ketiga batang besi membentuk <strong>segitiga siku-siku</strong>. Arsitek dapat menggunakannya untuk membuat sudut 90° yang tepat.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title="✏️ Contoh 3 — Buktikan dari Luas (Sulit)"/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah segitiga siku-siku mempunyai dua sisi siku-siku. Sisi pertama adalah <InlineMath math="(x+3)"/> cm dan sisi kedua adalah <InlineMath math="(x-1)"/> cm, dengan hipotenusa <InlineMath math="\sqrt{x^2 + 9x + 10}"/> cm. Tunjukkan bahwa persamaan ini berlaku sesuai Teorema Pythagoras!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Gunakan <InlineMath math="a^2 + b^2 = c^2"/>. Substitusikan nilai-nilainya:</p>
                  <BlockMath math="(x+3)^2 + (x-1)^2 = \left(\sqrt{x^2 + 9x + 10}\right)^2"/>
                  <p className="font-body text-sm text-white/80">Ekspansi ruas kiri:</p>
                  <BlockMath math="(x^2 + 6x + 9) + (x^2 - 2x + 1) = x^2 + 9x + 10"/>
                  <BlockMath math="2x^2 + 4x + 10 = x^2 + 9x + 10"/>
                  <p className="font-body text-sm text-white/80">Hmmm, ternyata ada selisih! Mari kita cek lebih teliti:</p>
                  <BlockMath math="2x^2 + 4x + 10 \neq x^2 + 9x + 10 \text{ secara umum}"/>
                  <div className="bg-orange-900/30 border border-orange-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-orange-200">
                      💡 <strong>Pelajaran penting:</strong> Tidak semua ekspresi aljabar yang "terlihat mirip" membentuk Tripel Pythagoras yang valid. Verifikasi selalu diperlukan! Dalam soal ini, persamaan hanya valid untuk nilai <InlineMath math="x"/> tertentu, yaitu saat:
                    </p>
                    <div className="mt-2"><BlockMath math="x^2 - 5x = 0 \Rightarrow x(x-5) = 0 \Rightarrow x = 5"/></div>
                    <p className="font-body text-sm text-orange-200 mt-2">
                      Sehingga sisi-sisinya: <InlineMath math="a=8"/>, <InlineMath math="b=4"/>, <InlineMath math="c = \sqrt{80} = 4\sqrt{5}"/>. ✅
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-violet-400" title="📌 Rangkuman Sub-Bab"/>
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• Teorema Pythagoras berlaku di <strong className="text-cyan-300">setiap segitiga siku-siku</strong>.</p>
                  <p className="font-body text-sm text-white/80">• Rumus: <InlineMath math="a^2 + b^2 = c^2"/> di mana <InlineMath math="c"/> adalah hipotenusa.</p>
                  <p className="font-body text-sm text-white/80">• Pembuktian dapat dilakukan secara visual dengan <strong className="text-yellow-300">metode susunan persegi</strong>.</p>
                  <p className="font-body text-sm text-white/80">• Untuk mengecek apakah segitiga siku-siku, substitusikan ketiga sisi ke rumus dan periksa kesamaannya.</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Teorema Pythagoras digunakan bahkan dalam navigasi satelit dan GPS! Tanpa Pythagoras, kita tidak bisa menghitung jarak antar titik di ruang angkasa.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/teorema-pythagoras"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Teorema Pythagoras
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembuktianPage;
