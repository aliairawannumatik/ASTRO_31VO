import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── SVG: 45-45-90 triangle ── */
const Sudut4545SVG = () => (
  <svg viewBox="0 0 200 180" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga 45-45-90">
    <defs>
      <style>{`@keyframes glow45{0%,100%{opacity:1;}50%{opacity:0.4;}}.g45{animation:glow45 2s ease-in-out infinite;}`}</style>
    </defs>
    {/* Triangle */}
    <polygon points="20,150 140,150 20,30" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="2"/>
    {/* Right angle mark */}
    <polyline points="20,130 40,130 40,150" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.8"/>
    {/* Sides */}
    <line x1="20" y1="30" x2="20" y2="150" stroke="#3b82f6" strokeWidth="2.5" className="g45"/>
    <line x1="20" y1="150" x2="140" y2="150" stroke="#22c55e" strokeWidth="2.5" className="g45"/>
    <line x1="20" y1="30" x2="140" y2="150" stroke="#f97316" strokeWidth="2.5"/>
    {/* Angle labels */}
    <text x="145" y="155" fill="#eab308" fontSize="10" fontFamily="monospace">45°</text>
    <text x="25" y="28" fill="#eab308" fontSize="10" fontFamily="monospace">45°</text>
    <text x="44" y="148" fill="#fff" fontSize="9" fontFamily="monospace">90°</text>
    {/* Side labels */}
    <text x="6" y="95" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">a</text>
    <text x="80" y="163" fill="#4ade80" fontSize="12" fontWeight="bold" textAnchor="middle">a</text>
    <text x="92" y="88" fill="#fb923c" fontSize="12" fontWeight="bold">a√2</text>
    {/* Info box */}
    <rect x="0" y="170" width="200" height="10" fill="none"/>
    <text x="100" y="178" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Perbandingan: a : a : a√2</text>
  </svg>
);

/* ── SVG: 30-60-90 triangle ── */
const Sudut3060SVG = () => (
  <svg viewBox="0 0 240 200" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga 30-60-90">
    <defs>
      <style>{`@keyframes glow30{0%,100%{opacity:1;}50%{opacity:0.4;}}.g30{animation:glow30 2s ease-in-out infinite;}`}</style>
    </defs>
    {/* Triangle */}
    <polygon points="20,160 200,160 20,70" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2"/>
    {/* Right angle mark */}
    <polyline points="20,140 40,140 40,160" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.8"/>
    {/* Sides */}
    <line x1="20" y1="70" x2="20" y2="160" stroke="#3b82f6" strokeWidth="2.5" className="g30"/>
    <line x1="20" y1="160" x2="200" y2="160" stroke="#22c55e" strokeWidth="2.5" className="g30"/>
    <line x1="20" y1="70" x2="200" y2="160" stroke="#f97316" strokeWidth="2.5"/>
    {/* Angle labels */}
    <text x="205" y="165" fill="#eab308" fontSize="10" fontFamily="monospace">30°</text>
    <text x="25" y="68" fill="#eab308" fontSize="10" fontFamily="monospace">60°</text>
    <text x="44" y="158" fill="#fff" fontSize="9" fontFamily="monospace">90°</text>
    {/* Side labels */}
    <text x="7" y="118" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">a</text>
    <text x="110" y="175" fill="#4ade80" fontSize="12" fontWeight="bold" textAnchor="middle">a√3</text>
    <text x="125" y="108" fill="#fb923c" fontSize="12" fontWeight="bold">2a</text>
    {/* Info box */}
    <text x="120" y="195" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Perbandingan: a : a√3 : 2a</text>
  </svg>
);

/* ── Comparison Card ── */
const CompareCard = ({ title, ratio, color, sides, example }: {
  title: string; ratio: string; color: string; sides: string[]; example: { angles: string; vals: string[] }
}) => (
  <div className={`bg-slate-800/60 border ${color} rounded-xl p-4 space-y-3`}>
    <p className={`font-body text-sm font-bold ${color.replace("border-","text-").replace("/40","")}`}>{title}</p>
    <p className="font-body text-xs text-white/60">Perbandingan sisi: <span className="text-yellow-300 font-bold">{ratio}</span></p>
    <div className="grid grid-cols-3 gap-2">
      {sides.map((s,i)=>(
        <div key={i} className="bg-slate-900/50 rounded-lg p-2 text-center">
          <p className="font-body text-xs text-white/50">{["Kaki pendek","Kaki panjang","Hipotenusa"][i]}</p>
          <p className="font-body text-sm font-bold text-white">{s}</p>
        </div>
      ))}
    </div>
    <div className="bg-slate-700/50 rounded-lg p-2">
      <p className="font-body text-xs text-white/50">Contoh ({example.angles}):</p>
      <p className="font-body text-xs text-cyan-300 font-bold">{example.vals.join(" : ")}</p>
    </div>
  </div>
);

const SudutKhususPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro","sudut45","sudut30","perbandingan","contoh1","contoh2","contoh3","rangkuman"]);

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
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary"/> : <ChevronDown className="w-5 h-5 text-primary"/>}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield/>
      <PageNavigation/>
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3"/>
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Teorema Pythagoras · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Sudut Istimewa yang Wajib Dikuasai"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ada dua jenis segitiga siku-siku spesial yang perbandingan sisinya sudah bisa kita ketahui tanpa menghitung: segitiga <strong className="text-purple-300">45°-45°-90°</strong> dan segitiga <strong className="text-green-300">30°-60°-90°</strong>. Keduanya sering muncul di soal dan sangat berguna dalam kehidupan nyata!
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-body">
                  <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-3 text-center">
                    <p className="text-purple-300 font-bold mb-1">Segitiga Isosceles Siku-siku</p>
                    <p className="text-white/60">45° – 45° – 90°</p>
                    <p className="text-yellow-300 font-bold mt-1">a : a : a√2</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-3 text-center">
                    <p className="text-green-300 font-bold mb-1">Segitiga Setengah Sama Sisi</p>
                    <p className="text-white/60">30° – 60° – 90°</p>
                    <p className="text-yellow-300 font-bold mt-1">a : a√3 : 2a</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SUDUT 45-45-90 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="sudut45" icon={<Target className="w-5 h-5"/>} iconColor="text-purple-400" title="📐 Segitiga 45°-45°-90°"/>
            {open.includes("sudut45") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Jika kamu memotong persegi dari pojok ke pojok, kamu mendapat dua segitiga <strong className="text-purple-300">45°-45°-90°</strong>. Kedua kakinya sama panjang (sebut <InlineMath math="a"/>), dan hipotenusanya adalah <InlineMath math="a\sqrt{2}"/>.
                </p>
                <Sudut4545SVG/>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-purple-300 font-semibold text-sm">🔢 Penurunan Rumus</p>
                  <p className="font-body text-sm text-white/80">Misalkan kedua kaki = <InlineMath math="a"/>. Gunakan Pythagoras:</p>
                  <BlockMath math="c = \sqrt{a^2 + a^2} = \sqrt{2a^2} = a\sqrt{2}"/>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                    <p className="font-body text-xs text-white/50 mb-1">Perbandingan sisi</p>
                    <BlockMath math="\text{kaki} : \text{kaki} : \text{hipotenusa} = a : a : a\sqrt{2} = 1 : 1 : \sqrt{2}"/>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Trik cepat:</strong> Dari kaki ke hipotenusa, <strong className="text-purple-300">kalikan dengan <InlineMath math="\sqrt{2}"/></strong>. Dari hipotenusa ke kaki, <strong className="text-purple-300">bagi dengan <InlineMath math="\sqrt{2}"/></strong> (atau kalikan <InlineMath math="\frac{\sqrt{2}}{2}"/>).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SUDUT 30-60-90 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="sudut30" icon={<Target className="w-5 h-5"/>} iconColor="text-green-400" title="📐 Segitiga 30°-60°-90°"/>
            {open.includes("sudut30") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Segitiga ini terbentuk jika kamu memotong segitiga sama sisi tepat di tengah. Sisi terpendek berhadapan dengan sudut 30°, sisi tengah berhadapan sudut 60°, dan sisi terpanjang (hipotenusa) berhadapan sudut 90°.
                </p>
                <Sudut3060SVG/>
                <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-green-300 font-semibold text-sm">🔢 Penurunan Rumus</p>
                  <p className="font-body text-sm text-white/80">Misalkan kaki terpendek (berhadapan 30°) = <InlineMath math="a"/>. Hipotenusa = <InlineMath math="2a"/>. Cari kaki panjang:</p>
                  <BlockMath math="b = \sqrt{(2a)^2 - a^2} = \sqrt{4a^2 - a^2} = \sqrt{3a^2} = a\sqrt{3}"/>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                    <BlockMath math="\text{kaki pendek} : \text{kaki panjang} : \text{hipotenusa} = a : a\sqrt{3} : 2a = 1 : \sqrt{3} : 2"/>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Trik cepat:</strong> Jika tahu kaki pendek (<InlineMath math="a"/>): kaki panjang = <InlineMath math="a\sqrt{3}"/>, hipotenusa = <InlineMath math="2a"/>. Selalu dari sudut terkecil ke terbesar: sisi ikut membesar!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PERBANDINGAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="perbandingan" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-cyan-400" title="📊 Tabel Perbandingan Sudut Khusus"/>
            {open.includes("perbandingan") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CompareCard
                    title="▪ Segitiga 45°-45°-90°"
                    ratio="1 : 1 : √2"
                    color="border-purple-500/40"
                    sides={["a", "a", "a√2"]}
                    example={{angles:"a=5", vals:["5", "5", "5√2 ≈ 7,07"]}}
                  />
                  <CompareCard
                    title="▲ Segitiga 30°-60°-90°"
                    ratio="1 : √3 : 2"
                    color="border-green-500/40"
                    sides={["a", "a√3", "2a"]}
                    example={{angles:"a=4", vals:["4", "4√3 ≈ 6,93", "8"]}}
                  />
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title="✏️ Contoh 1 — Segitiga 45-45-90 (Mudah)"/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah kain berbentuk segitiga siku-siku sama kaki dengan panjang kaki <strong>10 cm</strong>. Berapa panjang sisi miringnya?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Segitiga siku-siku sama kaki = segitiga 45°-45°-90°. Kaki = <InlineMath math="a = 10"/> cm.</p>
                  <p className="font-body text-sm text-white/80">Gunakan perbandingan <InlineMath math="1:1:\sqrt{2}"/>:</p>
                  <BlockMath math="c = a\sqrt{2} = 10\sqrt{2} \approx 14{,}14 \text{ cm}"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">✅ Sisi miring = <strong><InlineMath math="10\sqrt{2}"/> cm ≈ 14,14 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title="✏️ Contoh 2 — Segitiga 30-60-90 (Sedang)"/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah tiang lampu membentuk bayangan sepanjang <InlineMath math="6\sqrt{3}"/> m ketika sinar matahari membentuk sudut 30° dengan tanah. Berapa tinggi tiang lampu tersebut?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Situasi ini membentuk segitiga 30°-60°-90°. Bayangan = kaki panjang (berhadapan 60°) = <InlineMath math="6\sqrt{3}"/> m.</p>
                  <p className="font-body text-sm text-white/80">Gunakan perbandingan: kaki panjang = <InlineMath math="a\sqrt{3}"/>.</p>
                  <BlockMath math="a\sqrt{3} = 6\sqrt{3} \Rightarrow a = 6 \text{ m}"/>
                  <p className="font-body text-sm text-white/80">Tinggi tiang = kaki pendek = <InlineMath math="a"/>:</p>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="\text{Tinggi tiang} = 6 \text{ m}"/>
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">✅ Tiang lampu setinggi <strong>6 m</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title="✏️ Contoh 3 — Gabungan Dua Segitiga Khusus (Sulit)"/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah segitiga sama sisi ABC memiliki sisi 12 cm. Titik D adalah kaki tegak lurus dari A ke BC. Hitung panjang AD, lalu gunakan AD sebagai kaki segitiga 45-45-90 baru. Berapa hipotenusa segitiga baru itu?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Segitiga ABD adalah segitiga 30-60-90 (D di tengah BC, sudut B = 60°).</p>
                  <p className="font-body text-sm text-white/80">BD = ½ × 12 = 6 cm (kaki pendek). AD = kaki panjang:</p>
                  <BlockMath math="AD = BD \times \sqrt{3} = 6\sqrt{3} \text{ cm}"/>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Segitiga baru 45-45-90 dengan kaki = AD = <InlineMath math="6\sqrt{3}"/> cm.</p>
                  <BlockMath math="c = AD \times \sqrt{2} = 6\sqrt{3} \times \sqrt{2} = 6\sqrt{6} \text{ cm}"/>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="c = 6\sqrt{6} \approx 14{,}70 \text{ cm}"/>
                    <p className="font-body text-sm text-red-200 text-center mt-1">✅ Hipotenusa segitiga baru = <strong><InlineMath math="6\sqrt{6}"/> cm</strong> ≈ 14,70 cm.</p>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-body">
                    <div className="bg-purple-900/40 rounded-lg p-3">
                      <p className="text-purple-300 font-bold mb-1">45° – 45° – 90°</p>
                      <p className="text-white/80"><InlineMath math="1 : 1 : \sqrt{2}"/></p>
                      <p className="text-white/60 mt-1">Hipotenusa = kaki × √2</p>
                    </div>
                    <div className="bg-green-900/40 rounded-lg p-3">
                      <p className="text-green-300 font-bold mb-1">30° – 60° – 90°</p>
                      <p className="text-white/80"><InlineMath math="1 : \sqrt{3} : 2"/></p>
                      <p className="text-white/60 mt-1">Hipotenusa = 2 × kaki pendek</p>
                    </div>
                  </div>
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

export default SudutKhususPage;
