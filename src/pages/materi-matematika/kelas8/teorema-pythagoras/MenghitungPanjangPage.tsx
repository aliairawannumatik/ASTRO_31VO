import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── SVG: Right triangle with labelled sides and formulas ── */
const RumusVariasiSVG = () => (
  <svg viewBox="0 0 340 230" className="w-full max-w-sm mx-auto my-2" aria-label="Variasi rumus Pythagoras">
    <defs>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .p1{animation:pulse 2s ease-in-out infinite;}
        .p2{animation:pulse 2s ease-in-out infinite 0.7s;}
        .p3{animation:pulse 2s ease-in-out infinite 1.4s;}
      `}</style>
    </defs>
    {/* Triangle 1: Cari c */}
    <g transform="translate(10,10)">
      <polygon points="10,100 90,100 10,20" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1.5"/>
      <polyline points="10,82 28,82 28,100" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" opacity="0.6"/>
      <text x="8" y="15" fill="#60a5fa" fontSize="9" fontFamily="monospace">a=3</text>
      <text x="47" y="112" fill="#4ade80" fontSize="9" fontFamily="monospace">b=4</text>
      <text x="55" y="55" fill="#fb923c" fontSize="9" fontFamily="monospace" className="p1">c=?</text>
      <text x="5" y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">Cari c (hipotenusa)</text>
      <text x="5" y="135" fill="#eab308" fontSize="8" fontFamily="monospace">c=√(a²+b²)</text>
    </g>
    {/* Divider */}
    <line x1="115" y1="10" x2="115" y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
    {/* Triangle 2: Cari a */}
    <g transform="translate(125,10)">
      <polygon points="10,100 90,100 10,20" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
      <polyline points="10,82 28,82 28,100" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" opacity="0.6"/>
      <text x="8" y="15" fill="#60a5fa" fontSize="9" fontFamily="monospace" className="p2">a=?</text>
      <text x="47" y="112" fill="#4ade80" fontSize="9" fontFamily="monospace">b=4</text>
      <text x="55" y="55" fill="#fb923c" fontSize="9" fontFamily="monospace">c=5</text>
      <text x="5" y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">Cari a (kaki)</text>
      <text x="5" y="135" fill="#eab308" fontSize="8" fontFamily="monospace">a=√(c²-b²)</text>
    </g>
    {/* Divider */}
    <line x1="230" y1="10" x2="230" y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
    {/* Triangle 3: Cari b */}
    <g transform="translate(240,10)">
      <polygon points="10,100 90,100 10,20" fill="rgba(249,115,22,0.2)" stroke="#f97316" strokeWidth="1.5"/>
      <polyline points="10,82 28,82 28,100" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" opacity="0.6"/>
      <text x="8" y="15" fill="#60a5fa" fontSize="9" fontFamily="monospace">a=3</text>
      <text x="47" y="112" fill="#4ade80" fontSize="9" fontFamily="monospace" className="p3">b=?</text>
      <text x="55" y="55" fill="#fb923c" fontSize="9" fontFamily="monospace">c=5</text>
      <text x="5" y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">Cari b (kaki)</text>
      <text x="5" y="135" fill="#eab308" fontSize="8" fontFamily="monospace">b=√(c²-a²)</text>
    </g>
    {/* Bottom summary */}
    <rect x="10" y="170" width="320" height="50" rx="8" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1"/>
    <text x="170" y="187" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">TIGA VARIASI RUMUS PYTHAGORAS</text>
    <text x="60" y="205" fill="#fb923c" fontSize="8" textAnchor="middle" fontFamily="monospace">c = √(a²+b²)</text>
    <text x="170" y="205" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="monospace">a = √(c²-b²)</text>
    <text x="282" y="205" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace">b = √(c²-a²)</text>
  </svg>
);

/* ── SVG: Step-by-step number line / calculation visual ── */
const HitungSVG = ({ a, b, c, cari }: { a: number; b: number; c: number; cari: "a"|"b"|"c" }) => {
  const maxVal = Math.max(a*a, b*b, c*c);
  const scale = 260 / maxVal;
  return (
    <svg viewBox="0 0 300 120" className="w-full max-w-sm mx-auto" aria-label="Visualisasi perhitungan">
      {/* a² bar */}
      <rect x="20" y="15" width={a*a*scale} height="18" rx="4" fill={cari==="c"?"#3b82f6":"#3b82f690"} />
      <text x="20" y="42" fill="#60a5fa" fontSize="9" fontFamily="monospace">a² = {a}² = {a*a}</text>
      {/* b² bar */}
      <rect x="20" y="50" width={b*b*scale} height="18" rx="4" fill={cari==="c"?"#22c55e":"#22c55e90"} />
      <text x="20" y="77" fill="#4ade80" fontSize="9" fontFamily="monospace">b² = {b}² = {b*b}</text>
      {/* c² bar */}
      <rect x="20" y="85" width={c*c*scale} height="18" rx="4" fill={cari==="a"||cari==="b"?"#f97316":"#f9731690"} />
      <text x="20" y="112" fill="#fb923c" fontSize="9" fontFamily="monospace">c² = {c}² = {c*c}</text>
      {/* = sign */}
      <text x={a*a*scale + b*b*scale + 25} y="58" fill="#eab308" fontSize="14" fontFamily="monospace">✓</text>
    </svg>
  );
};

const MenghitungPanjangPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro","rumus","contoh1","contoh2","contoh3","rangkuman"]);

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
          MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Teorema Pythagoras · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Tiga Skenario Berbeda"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dalam sebuah segitiga siku-siku, ada <strong className="text-cyan-300">tiga sisi</strong>: dua kaki (<InlineMath math="a"/> dan <InlineMath math="b"/>) dan satu hipotenusa (<InlineMath math="c"/>). Menggunakan Teorema Pythagoras, kita bisa mencari salah satu sisi <em>jika dua sisi lainnya diketahui</em>. Ada tiga skenario berbeda yang perlu kamu kuasai!
                </p>
                <RumusVariasiSVG/>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <p className="text-cyan-300 font-semibold text-sm">📌 Tiga Variasi Rumus Pythagoras</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <BlockMath math="c = \sqrt{a^2 + b^2} \quad \text{(cari hipotenusa)}"/>
                    <BlockMath math="a = \sqrt{c^2 - b^2} \quad \text{(cari kaki pertama)}"/>
                    <BlockMath math="b = \sqrt{c^2 - a^2} \quad \text{(cari kaki kedua)}"/>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Strategi mudah:</strong> Sisi yang <em>dicari</em> pindahkan ke kiri, dua sisi yang <em>diketahui</em> tetap di kanan. Jika mencari <strong className="text-orange-300">c</strong> → tambahkan. Jika mencari <strong className="text-blue-300">a atau b</strong> → kurangkan <strong className="text-orange-300">c²</strong> dengan sisi yang diketahui.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS DETAIL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title="📐 Prosedur Menghitung Langkah demi Langkah"/>
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Kunci menghitung panjang sisi adalah: <strong className="text-cyan-300">(1)</strong> identifikasi mana hipotenusa, <strong className="text-cyan-300">(2)</strong> pilih rumus yang tepat, <strong className="text-cyan-300">(3)</strong> substitusikan nilai, <strong className="text-cyan-300">(4)</strong> sederhanakan hasilnya — pastikan dalam bentuk akar sederhana jika perlu.
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Cara Menyederhanakan Akar</p>
                  <p className="font-body text-sm text-white/80">Contoh: Sederhanakan <InlineMath math="\sqrt{72}"/></p>
                  <BlockMath math="\sqrt{72} = \sqrt{36 \times 2} = \sqrt{36} \times \sqrt{2} = 6\sqrt{2}"/>
                  <p className="font-body text-sm text-white/80">Langkah: Cari faktor kuadrat sempurna terbesar dari bilangan di bawah akar!</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-body">
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-cyan-300 font-bold mb-1">Bilangan Akar Sempurna:</p>
                      <p className="text-white/60"><InlineMath math="\sqrt{4}=2,\ \sqrt{9}=3,\ \sqrt{16}=4"/></p>
                      <p className="text-white/60"><InlineMath math="\sqrt{25}=5,\ \sqrt{36}=6,\ \sqrt{49}=7"/></p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-yellow-300 font-bold mb-1">Tips:</p>
                      <p className="text-white/60">Jika hasilnya bulat → tulis tanpa akar. Jika tidak → sederhanakan ke bentuk <InlineMath math="n\sqrt{k}"/>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title="✏️ Contoh 1 — Mencari Hipotenusa (Mudah)"/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah tangga disandarkan ke dinding. Kaki tangga berjarak <strong>6 m</strong> dari dinding, dan tinggi tembok yang dijangkau tangga adalah <strong>8 m</strong>. Berapa panjang tangga tersebut?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="a = 6"/> m (jarak kaki tangga), <InlineMath math="b = 8"/> m (tinggi tembok). Dicari: <InlineMath math="c"/> (panjang tangga).</p>
                  <BlockMath math="c = \sqrt{a^2 + b^2} = \sqrt{6^2 + 8^2}"/>
                  <BlockMath math="c = \sqrt{36 + 64} = \sqrt{100}"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="c = 10 \text{ m}"/>
                    <p className="font-body text-sm text-green-300 text-center mt-1">✅ Panjang tangga adalah <strong>10 m</strong>.</p>
                  </div>
                  <HitungSVG a={6} b={8} c={10} cari="c"/>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title="✏️ Contoh 2 — Mencari Salah Satu Kaki (Sedang)"/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah layar kapal berbentuk segitiga siku-siku. Sisi miringnya (tali layar terpanjang) adalah <strong>13 m</strong> dan alas layarnya <strong>5 m</strong>. Tentukan tinggi layar tersebut!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="c = 13"/> m, <InlineMath math="b = 5"/> m. Dicari: <InlineMath math="a"/> (tinggi layar).</p>
                  <BlockMath math="a = \sqrt{c^2 - b^2} = \sqrt{13^2 - 5^2}"/>
                  <BlockMath math="a = \sqrt{169 - 25} = \sqrt{144}"/>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="a = 12 \text{ m}"/>
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">✅ Tinggi layar kapal adalah <strong>12 m</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title="✏️ Contoh 3 — Hasil Bentuk Akar (Sulit)"/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah lapangan berbentuk persegi panjang berukuran <strong>7 m × 9 m</strong>. Seorang siswa berlari dari sudut A ke sudut C (diagonal lapangan). Berapa jarak yang ditempuh siswa tersebut? Nyatakan dalam bentuk akar sederhana!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diagonal persegi panjang membentuk segitiga siku-siku dengan kaki <InlineMath math="a = 7"/> m dan <InlineMath math="b = 9"/> m.</p>
                  <BlockMath math="c = \sqrt{a^2 + b^2} = \sqrt{7^2 + 9^2}"/>
                  <BlockMath math="c = \sqrt{49 + 81} = \sqrt{130}"/>
                  <p className="font-body text-sm text-white/80">Apakah 130 bisa disederhanakan? Faktorkan: <InlineMath math="130 = 2 \times 5 \times 13"/>. Tidak ada faktor kuadrat sempurna.</p>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="c = \sqrt{130} \approx 11{,}40 \text{ m}"/>
                    <p className="font-body text-sm text-red-200 text-center mt-1">
                      ✅ Jarak diagonal adalah <InlineMath math="\sqrt{130}"/> m atau sekitar <strong>11,40 m</strong>.
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
                  <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">Mencari c:</strong> <InlineMath math="c = \sqrt{a^2 + b^2}"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-blue-300">Mencari a:</strong> <InlineMath math="a = \sqrt{c^2 - b^2}"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-green-300">Mencari b:</strong> <InlineMath math="b = \sqrt{c^2 - a^2}"/></p>
                  <p className="font-body text-sm text-white/80">• Hasilnya bisa berupa <strong className="text-cyan-300">bilangan bulat</strong> atau <strong className="text-yellow-300">bentuk akar</strong>.</p>
                  <p className="font-body text-sm text-white/80">• Sederhanakan akar: cari faktor kuadrat sempurna terbesar.</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> NASA menggunakan Pythagoras untuk menghitung lintasan roket! Setiap komponen kecepatan horizontal dan vertikal dihitung, lalu digabung menggunakan rumus <InlineMath math="v = \sqrt{v_x^2 + v_y^2}"/>.
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

export default MenghitungPanjangPage;
