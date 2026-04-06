import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, Wrench } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── SVG: Belt around two equal circles (parallel belt) ── */
const SabukSamaBesarSVG = () => (
  <svg viewBox="0 0 340 200" className="w-full max-w-sm mx-auto my-2" aria-label="Sabuk melilit dua lingkaran sama besar">
    <defs>
      <style>{`
        @keyframes beltGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #f97316);}50%{stroke-opacity:0.4;filter:none;}}
        .belt{animation:beltGlow 2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Circle 1 */}
    <circle cx="90" cy="100" r="55" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2.5"/>
    <circle cx="90" cy="100" r="4" fill="#3b82f6"/>
    <text x="76" y="97" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">O₁</text>
    {/* Circle 2 */}
    <circle cx="250" cy="100" r="55" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2.5"/>
    <circle cx="250" cy="100" r="4" fill="#a855f7"/>
    <text x="255" y="97" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">O₂</text>
    {/* Belt — top straight segment */}
    <line x1="90" y1="45" x2="250" y2="45" stroke="#f97316" strokeWidth="3.5" className="belt"/>
    {/* Belt — bottom straight segment */}
    <line x1="90" y1="155" x2="250" y2="155" stroke="#f97316" strokeWidth="3.5" className="belt"/>
    {/* Belt — left semicircle */}
    <path d="M90,45 A55,55 0 0,0 90,155" fill="none" stroke="#f97316" strokeWidth="3.5" className="belt"/>
    {/* Belt — right semicircle */}
    <path d="M250,45 A55,55 0 0,1 250,155" fill="none" stroke="#f97316" strokeWidth="3.5" className="belt"/>
    {/* Distance label */}
    <line x1="90" y1="100" x2="250" y2="100" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.7"/>
    <text x="170" y="115" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">d (jarak pusat)</text>
    {/* Radius labels */}
    <text x="90" y="68" fill="#60a5fa" fontSize="9" textAnchor="middle" fontFamily="monospace">r</text>
    <text x="250" y="68" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">r</text>
    {/* Segment length label */}
    <text x="170" y="38" fill="#fb923c" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">d (panjang lurus)</text>
    {/* Formula box */}
    <rect x="5" y="178" width="330" height="20" rx="5" fill="rgba(30,41,59,0.9)" stroke="#334155"/>
    <text x="170" y="192" fill="#f97316" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">L_sabuk = 2d + 2πr   (dua lingkaran sama besar)</text>
  </svg>
);

/* ── SVG: Belt around two different circles (crossed belt) ── */
const SabukBedaBesarSVG = () => (
  <svg viewBox="0 0 340 200" className="w-full max-w-sm mx-auto my-2" aria-label="Sabuk melilit dua lingkaran beda besar">
    <defs>
      <style>{`@keyframes beltX{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #22c55e);}50%{stroke-opacity:0.4;filter:none;}}.beltx{animation:beltX 2s ease-in-out infinite;}`}</style>
    </defs>
    {/* Circle 1 large */}
    <circle cx="85" cy="105" r="60" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2.5"/>
    <circle cx="85" cy="105" r="4" fill="#3b82f6"/>
    <text x="70" y="102" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">O₁</text>
    {/* Circle 2 small */}
    <circle cx="255" cy="115" r="38" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2.5"/>
    <circle cx="255" cy="115" r="4" fill="#a855f7"/>
    <text x="260" y="112" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">O₂</text>
    {/* Belt outer segments (non-parallel) */}
    <line x1="60" y1="47" x2="233" y2="77" stroke="#22c55e" strokeWidth="3" className="beltx"/>
    <line x1="60" y1="163" x2="233" y2="153" stroke="#22c55e" strokeWidth="3" className="beltx"/>
    {/* Arc on circle 1 */}
    <path d="M60,47 A60,60 0 0,0 60,163" fill="none" stroke="#22c55e" strokeWidth="3" className="beltx"/>
    {/* Arc on circle 2 */}
    <path d="M233,77 A38,38 0 0,1 233,153" fill="none" stroke="#22c55e" strokeWidth="3" className="beltx"/>
    {/* Radius labels */}
    <text x="55" y="82" fill="#60a5fa" fontSize="9" fontFamily="monospace">R</text>
    <text x="248" y="92" fill="#c084fc" fontSize="9" fontFamily="monospace">r</text>
    {/* Distance */}
    <line x1="85" y1="105" x2="255" y2="115" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"/>
    <text x="170" y="128" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">d</text>
    {/* Formula box */}
    <rect x="5" y="180" width="330" height="18" rx="4" fill="rgba(30,41,59,0.9)" stroke="#334155"/>
    <text x="170" y="193" fill="#22c55e" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">L_sabuk = 2l_luar + π(R + r) + 2(R-r)·arcsin((R-r)/d) ... (rumus lengkap)</text>
  </svg>
);

/* ── Interactive Belt Calculator ── */
const BeltCalculator = () => {
  const [r1, setR1] = useState("");
  const [r2, setR2] = useState("");
  const [d, setD] = useState("");
  const [result, setResult] = useState<null | string>(null);

  const calc = () => {
    const R = parseFloat(r1), r = parseFloat(r2), dist = parseFloat(d);
    if (isNaN(R) || isNaN(r) || isNaN(dist) || R <= 0 || r <= 0 || dist <= 0) {
      setResult("Masukkan nilai yang valid!"); return;
    }
    if (Math.abs(R - r) < 0.001) {
      const L = 2 * dist + 2 * Math.PI * R;
      setResult(`L = 2d + 2πr = 2×${dist} + 2π×${R} = ${(2*dist).toFixed(2)} + ${(2*Math.PI*R).toFixed(2)} ≈ ${L.toFixed(2)} cm`);
    } else {
      const luar = Math.sqrt(dist*dist - (R-r)*(R-r));
      const L = 2 * luar + Math.PI * (R + r);
      setResult(`l_luar = √(${dist}² - (${R}-${r})²) ≈ ${luar.toFixed(2)} cm\nL ≈ 2×${luar.toFixed(2)} + π×(${R}+${r}) ≈ ${L.toFixed(2)} cm`);
    }
  };

  return (
    <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-4 space-y-3">
      <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">🔧 Kalkulator Sabuk Lilitan</p>
      <div className="flex gap-2 flex-wrap">
        {[{ val: r1, set: setR1, label: "Jari-jari R (cm)" }, { val: r2, set: setR2, label: "Jari-jari r (cm)" }, { val: d, set: setD, label: "Jarak pusat d (cm)" }].map(({ val, set, label }) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="font-body text-xs text-white/50">{label}</label>
            <input type="number" min="0.1" step="0.1" value={val}
              onChange={e => { set(e.target.value); setResult(null); }}
              className="w-28 bg-slate-900/60 border border-slate-500 rounded-lg px-3 py-2 text-white text-sm font-body focus:outline-none"
              placeholder="..." />
          </div>
        ))}
        <button onClick={calc}
          className="mt-5 px-4 py-2 bg-orange-700/60 border border-orange-500 text-orange-300 rounded-lg text-xs font-bold font-body hover:bg-orange-600/60 transition-colors cursor-pointer">
          Hitung!
        </button>
      </div>
      {result && (
        <div className="bg-orange-900/30 border border-orange-500/40 rounded-lg p-3">
          <pre className="font-body text-sm text-orange-200 whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

const SabukLilitanPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "rumus", "kalkulator", "contoh1", "contoh2", "contoh3", "rangkuman"]);

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
          SABUK LILITAN MINIMAL (PENERAPAN)
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Garis Singgung Lingkaran · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Matematika di Pabrik dan Mesin!" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernahkah kamu melihat mesin dengan dua roda yang dihubungkan sabuk? Misalnya mesin sepeda atau treadmill? Para insinyur perlu menghitung <strong className="text-cyan-300">panjang sabuk minimal</strong> yang diperlukan agar sabuk pas melilit kedua roda tanpa kendur. Inilah penerapan nyata garis singgung lingkaran yang kita pelajari!
                </p>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-cyan-300 font-semibold text-sm mb-2">🏭 Komponen Panjang Sabuk</p>
                  <div className="space-y-2 text-xs font-body">
                    <div className="flex items-center gap-2 bg-orange-900/30 rounded-lg px-3 py-2">
                      <span className="text-orange-300 font-bold">①</span>
                      <p className="text-white/80">Segmen lurus: bagian sabuk yang menyentuh garis singgung persekutuan</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-900/30 rounded-lg px-3 py-2">
                      <span className="text-blue-300 font-bold">②</span>
                      <p className="text-white/80">Busur lingkaran: bagian sabuk yang melilit setiap roda</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Kunci:</strong> Panjang sabuk minimal = <strong className="text-cyan-300">jumlah segmen lurus</strong> + <strong className="text-orange-300">jumlah busur</strong> pada setiap lingkaran.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="📐 Rumus Sabuk Lilitan" />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ada dua kasus utama: sabuk melilit dua lingkaran <strong className="text-cyan-300">sama besar</strong> (lebih sederhana) dan <strong className="text-yellow-300">berbeda besar</strong>. Kasus sama besar adalah yang paling sering muncul di soal SMP.
                  </p>
                </div>
                <SabukSamaBesarSVG />
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-4">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Kasus 1: Dua Lingkaran Sama Besar (<InlineMath math="R = r"/>)</p>
                  <p className="font-body text-sm text-white/80">Sabuk terdiri dari: 2 segmen lurus (panjang masing-masing = d) + 2 setengah lingkaran (total = 1 lingkaran penuh).</p>
                  <div className="bg-orange-900/30 border border-orange-500/40 rounded-lg p-3">
                    <BlockMath math="L_{sabuk} = 2d + 2\pi r" />
                  </div>
                  <p className="font-body text-sm text-white/60 mt-2">di mana <InlineMath math="d"/> = jarak antar pusat, <InlineMath math="r"/> = jari-jari masing-masing lingkaran.</p>
                </div>
                <SabukBedaBesarSVG />
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Kasus 2: Dua Lingkaran Berbeda Besar (<InlineMath math="R \neq r"/>)</p>
                  <p className="font-body text-sm text-white/80">Sabuk terdiri dari: 2 segmen GSPL + busur besar + busur kecil.</p>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="L_{sabuk} = 2l_{luar} + \pi(R + r) + 2(R-r)\arcsin\!\left(\frac{R-r}{d}\right)" />
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200">
                      💡 <strong>Untuk soal SMP:</strong> Jika soal hanya meminta panjang sabuk secara sederhana (dua lingkaran sama besar), gunakan rumus <InlineMath math="L = 2d + 2\pi r"/>. Rumus lengkap untuk berbeda besar biasanya dipelajari di SMA.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KALKULATOR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="kalkulator" icon={<Wrench className="w-5 h-5" />} iconColor="text-orange-400" title="🔧 Kalkulator Sabuk Interaktif" />
            {open.includes("kalkulator") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70">Masukkan nilai dan hitung panjang sabuk! (Jika R = r, gunakan rumus sederhana. Jika berbeda, gunakan perkiraan.)</p>
                <BeltCalculator />
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Dua Roda Sama Besar (Mudah)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah mesin memiliki dua roda silinder berjari-jari <strong>7 cm</strong> yang berjarak pusat <strong>30 cm</strong>. Tentukan panjang sabuk minimal yang diperlukan! (Gunakan <InlineMath math="\pi = \frac{22}{7}"/>)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Dua roda sama besar (<InlineMath math="r = 7"/> cm), <InlineMath math="d = 30"/> cm. Gunakan: <InlineMath math="L = 2d + 2\pi r"/>.</p>
                  <BlockMath math="L = 2(30) + 2 \times \frac{22}{7} \times 7" />
                  <BlockMath math="L = 60 + 2 \times 22 = 60 + 44" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="L = 104 \text{ cm}" />
                    <p className="font-body text-sm text-green-300 text-center mt-1">✅ Panjang sabuk minimal = <strong>104 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tiga Roda Segaris (Sedang)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Tiga silinder berjari-jari <strong>14 cm</strong> disusun berjajar dan diikat sabuk keliling. Tentukan panjang sabuk minimal! (<InlineMath math="\pi = \frac{22}{7}"/>)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Tiga silinder bersentuhan: jarak pusat ke pusat = <InlineMath math="d = 2r = 28"/> cm. Ada 2 celah, jadi total segmen lurus = 4 × 28 cm. Busur total: setiap silinder di ujung = setengah lingkaran, silinder tengah = setengah lingkaran atas + setengah bawah = 1 lingkaran penuh. Total busur = 2 × setengah + 1 = 2 lingkaran penuh.</p>
                  <p className="font-body text-sm text-white/80">Lebih tepat: ujung kiri = 2 × ¼ lingkaran + ½ lingkaran = 1 lingkaran penuh (satu sisi); begitu pula ujung kanan. Silinder tengah = 2 × ½ lingkaran. Total busur = 2π × 14 × 2 = 4πr.</p>
                  <p className="font-body text-sm text-white/80"><strong>Pendekatan SMP:</strong> 4 segmen lurus (masing-masing = d=28) + busur keliling (= 2πr × 2 = 4πr untuk sudut efektif):</p>
                  <BlockMath math="L = 4 \times 28 + 2 \times 2\pi \times 14" />
                  <BlockMath math="L = 112 + 4 \times \frac{22}{7} \times 14 = 112 + 176" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="L = 288 \text{ cm}" />
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">✅ Panjang sabuk minimal ≈ <strong>288 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Dua Roda Berbeda Ukuran (Sulit)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah mesin memiliki roda besar berjari-jari <strong>20 cm</strong> dan roda kecil berjari-jari <strong>8 cm</strong> dengan jarak pusat <strong>52 cm</strong>. Tentukan panjang sabuk GSPL (bagian lurus saja × 2), lalu perkirakan panjang sabuk total jika busur total = <InlineMath math="\pi(R+r)"/>!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Hitung panjang GSPL.</p>
                  <BlockMath math="l_{luar} = \sqrt{d^2 - (R-r)^2} = \sqrt{52^2 - (20-8)^2}" />
                  <BlockMath math="= \sqrt{2704 - 144} = \sqrt{2560} = 16\sqrt{10} \approx 50{,}60 \text{ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Estimasi panjang sabuk total.</p>
                  <BlockMath math="L_{sabuk} \approx 2 \times l_{luar} + \pi(R+r)" />
                  <BlockMath math="= 2 \times 50{,}60 + \pi \times 28" />
                  <BlockMath math="= 101{,}20 + 87{,}96 \approx 189{,}16 \text{ cm}" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">✅ Panjang GSPL = <InlineMath math="16\sqrt{10} \approx 50{,}60" /> cm. Panjang sabuk total ≈ <strong>189,16 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="📌 Rangkuman Sub-Bab & Seluruh Materi" />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-1">Sabuk Lilitan:</p>
                  <p className="font-body text-sm text-white/80">• <strong>Sama besar (R=r):</strong> <InlineMath math="L = 2d + 2\pi r"/></p>
                  <p className="font-body text-sm text-white/80">• <strong>Berbeda besar:</strong> <InlineMath math="L \approx 2l_{luar} + \pi(R+r)"/> (approx. SMP)</p>
                  <p className="font-body text-sm font-bold text-yellow-300 mt-3 mb-1">Recap Seluruh Materi:</p>
                  <div className="grid grid-cols-1 gap-1 text-xs font-body">
                    {[
                      ["Garis Singgung", "Menyentuh lingkaran di 1 titik; OT ⊥ garis"],
                      ["Panjang Singgung", "l = √(d² - r²)"],
                      ["GSPL", "l_luar = √(d² - (R-r)²)"],
                      ["GSPD", "l_dalam = √(d² - (R+r)²)"],
                      ["Sabuk (sama besar)", "L = 2d + 2πr"],
                    ].map(([term, formula]) => (
                      <div key={term} className="flex gap-2 bg-slate-800/60 rounded-lg px-3 py-1.5">
                        <span className="text-cyan-300 font-bold min-w-[120px]">{term}</span>
                        <span className="text-white/70">{formula}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Mekanisme sabuk-roda digunakan di sistem roket dan teleskop luar angkasa! Sabuk transmisi pada teleskop Hubble menghubungkan motor ke lensa dengan prinsip persis yang kamu pelajari hari ini.
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

export default SabukLilitanPage;
