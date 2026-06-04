import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, MapPin } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── SVG: Ladder against wall ── */
const TanggaSVG = () => (
  <svg viewBox="0 0 200 180" className="w-full max-w-xs mx-auto my-2" aria-label="Tangga di tembok">
    <defs>
      <style>{`@keyframes tanggaGlow{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.3;}}.tg{animation:tanggaGlow 2s ease-in-out infinite;}`}</style>
    </defs>
    {/* Ground */}
    <line x1="10" y1="160" x2="190" y2="160" stroke="#475569" strokeWidth="3"/>
    {/* Wall */}
    <line x1="40" y1="160" x2="40" y2="20" stroke="#475569" strokeWidth="3"/>
    {/* Ladder */}
    <line x1="110" y1="160" x2="40" y2="50" stroke="#f97316" strokeWidth="3" className="tg"/>
    {/* Right angle mark */}
    <polyline points="40,155 50,155 50,160" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.8"/>
    {/* Dimension labels */}
    <text x="70" y="155" fill="#22c55e" fontSize="10" fontFamily="monospace" fontWeight="bold">b = ?</text>
    <text x="12" y="110" fill="#3b82f6" fontSize="10" fontFamily="monospace" fontWeight="bold">a = ?</text>
    <text x="85" y="100" fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold">c = tangga</text>
    {/* Arrow labels */}
    <text x="120" y="158" fill="#4ade80" fontSize="8" fontFamily="monospace">→ tembok</text>
    <text x="40" y="18" fill="#60a5fa" fontSize="8" fontFamily="monospace">↑ tinggi</text>
  </svg>
);

/* ── SVG: Diagonal of rectangle ── */
const DiagonalSVG = () => (
  <svg viewBox="0 0 240 160" className="w-full max-w-sm mx-auto my-2" aria-label="Diagonal persegi panjang">
    <defs>
      <style>{`@keyframes diagGlow{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.2;}}.dg{animation:diagGlow 2s ease-in-out infinite;}`}</style>
    </defs>
    {/* Rectangle */}
    <rect x="20" y="30" width="180" height="100" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="2"/>
    {/* Diagonal */}
    <line x1="20" y1="30" x2="200" y2="130" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" className="dg"/>
    <line x1="20" y1="130" x2="200" y2="30" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 3" className="dg"/>
    {/* Labels */}
    <text x="105" y="25" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">panjang (p)</text>
    <text x="8" y="83" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,8,83)">lebar (l)</text>
    <text x="118" y="100" fill="#fb923c" fontSize="10" fontFamily="monospace">d = √(p²+l²)</text>
    {/* Right angle */}
    <polyline points="20,110 35,110 35,130" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" opacity="0.7"/>
  </svg>
);

/* ── SVG: Bird eye view — distance between two points ── */
const JarakTitikSVG = () => (
  <svg viewBox="0 0 240 180" className="w-full max-w-sm mx-auto my-2" aria-label="Jarak dua titik">
    <defs>
      <style>{`@keyframes pathGlow{0%,100%{opacity:1;}50%{opacity:0.3;}}.pg{animation:pathGlow 2.5s ease-in-out infinite;}`}</style>
    </defs>
    {/* Grid */}
    {[0,1,2,3,4].map(i=>(
      <line key={"h"+i} x1="20" y1={20+i*35} x2="220" y2={20+i*35} stroke="#1e293b" strokeWidth="1"/>
    ))}
    {[0,1,2,3,4,5].map(i=>(
      <line key={"v"+i} x1={20+i*40} y1="20" x2={20+i*40} y2="160" stroke="#1e293b" strokeWidth="1"/>
    ))}
    {/* Horizontal leg */}
    <line x1="40" y1="130" x2="180" y2="130" stroke="#22c55e" strokeWidth="2.5" className="pg"/>
    {/* Vertical leg */}
    <line x1="180" y1="130" x2="180" y2="50" stroke="#3b82f6" strokeWidth="2.5" className="pg"/>
    {/* Hypotenuse (direct distance) */}
    <line x1="40" y1="130" x2="180" y2="50" stroke="#f97316" strokeWidth="2.5"/>
    {/* Points */}
    <circle cx="40" cy="130" r="5" fill="#22c55e"/>
    <circle cx="180" cy="50" r="5" fill="#f97316"/>
    <circle cx="180" cy="130" r="4" fill="#3b82f6" fillOpacity="0.7"/>
    {/* Labels */}
    <text x="32" y="144" fill="#4ade80" fontSize="9" fontFamily="monospace">A</text>
    <text x="183" y="143" fill="#60a5fa" fontSize="9" fontFamily="monospace">C</text>
    <text x="183" y="47" fill="#fb923c" fontSize="9" fontFamily="monospace">B</text>
    <text x="110" y="145" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">horizontal</text>
    <text x="193" y="93" fill="#60a5fa" fontSize="9" textAnchor="middle" fontFamily="monospace">vertikal</text>
    <text x="95" y="82" fill="#fb923c" fontSize="9" fontFamily="monospace">AB (jarak)</text>
    {/* Right angle */}
    <polyline points="180,120 170,120 170,130" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" opacity="0.7"/>
  </svg>
);

const MasalahKontekstualPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro","strategi","contoh1","contoh2","contoh3","rangkuman"]);

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
          PENERAPAN TEOREMA PYTHAGORAS PADA MASALAH KONTEKSTUAL
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Teorema Pythagoras · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Pythagoras di Dunia Nyata"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Teorema Pythagoras bukan sekadar rumus di buku! Ia hadir di mana-mana: dari menghitung <strong className="text-cyan-300">tinggi pohon</strong>, <strong className="text-yellow-300">panjang kabel listrik</strong>, <strong className="text-green-300">jalur pelari</strong>, hingga <strong className="text-purple-300">jarak antara dua kota di peta</strong>. Kuncinya: kenali dulu bentuk segitiga siku-siku yang tersembunyi dalam soal cerita!
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-body">
                  {["🏗️ Konstruksi","⚡ Kelistrikan","🗺️ Navigasi","🏥 Medis"].map((item,i)=>(
                    <div key={i} className="bg-slate-800/60 border border-slate-600 rounded-lg p-2 text-center">
                      <p className="text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STRATEGI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="strategi" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title="📐 Strategi Menyelesaikan Soal Kontekstual"/>
            {open.includes("strategi") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Langkah Penyelesaian Soal Cerita</p>
                  {[
                    { step: 1, title: "Baca & Pahami", desc: "Baca soal 2× dan identifikasi apa yang diketahui dan apa yang ditanya.", color: "bg-blue-900/30 border-blue-500/40" },
                    { step: 2, title: "Gambar Sketsa", desc: "Buat gambar/diagram situasinya. Tandai sudut siku-siku yang ada.", color: "bg-green-900/30 border-green-500/40" },
                    { step: 3, title: "Labeli Sisi", desc: "Tandai sisi yang diketahui (a dan b) dan sisi yang dicari (c, atau sebaliknya).", color: "bg-yellow-900/30 border-yellow-500/40" },
                    { step: 4, title: "Pilih Rumus", desc: "Gunakan rumus yang sesuai: cari c → √(a²+b²), cari kaki → √(c²-sisi²).", color: "bg-orange-900/30 border-orange-500/40" },
                    { step: 5, title: "Hitung & Cek", desc: "Hitung dengan teliti, sederhanakan akar jika perlu, dan beri satuan yang benar.", color: "bg-purple-900/30 border-purple-500/40" },
                  ].map(({ step, title, desc, color }) => (
                    <div key={step} className={`flex gap-3 border rounded-lg px-3 py-2 ${color}`}>
                      <span className="bg-slate-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{step}</span>
                      <div>
                        <p className="font-body text-sm font-bold text-white">{title}</p>
                        <p className="font-body text-xs text-white/60">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title="✏️ Contoh 1 — Tangga dan Dinding (Mudah)"/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah tangga sepanjang <strong>10 m</strong> bersandar ke dinding. Ujung bawah tangga berjarak <strong>6 m</strong> dari dasar dinding. Seberapa tinggi tangga itu mencapai tembok?
                  </p>
                </div>
                <TanggaSVG/>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: tangga (hipotenusa) <InlineMath math="c = 10"/> m, jarak ke dinding <InlineMath math="b = 6"/> m. Dicari: tinggi tembok <InlineMath math="a"/>.</p>
                  <BlockMath math="a = \sqrt{c^2 - b^2} = \sqrt{10^2 - 6^2}"/>
                  <BlockMath math="a = \sqrt{100 - 36} = \sqrt{64}"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="a = 8 \text{ m}"/>
                    <p className="font-body text-sm text-green-300 text-center mt-1">✅ Tangga mencapai ketinggian <strong>8 m</strong> di tembok. (Ini triple 6-8-10 = kelipatan 3-4-5!)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title="✏️ Contoh 2 — Diagonal Lapangan (Sedang)"/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Lapangan bulu tangkis berukuran panjang <strong>13,4 m</strong> dan lebar <strong>6,1 m</strong>. Seorang pemain berlari dari sudut ke sudut (diagonal). Berapa jarak yang ditempuhnya? (Bulatkan ke 2 desimal)
                  </p>
                </div>
                <DiagonalSVG/>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diagonal <InlineMath math="d"/> adalah hipotenusa dengan kaki <InlineMath math="p = 13{,}4"/> m dan <InlineMath math="l = 6{,}1"/> m.</p>
                  <BlockMath math="d = \sqrt{p^2 + l^2} = \sqrt{13{,}4^2 + 6{,}1^2}"/>
                  <BlockMath math="d = \sqrt{179{,}56 + 37{,}21} = \sqrt{216{,}77}"/>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="d \approx 14{,}72 \text{ m}"/>
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">✅ Pemain menempuh jarak sekitar <strong>14,72 m</strong> saat berlari diagonal.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title="✏️ Contoh 3 — Jarak Dua Kapal di Laut (Sulit)"/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Dua kapal berangkat bersamaan dari pelabuhan A. Kapal P berlayar ke arah timur sejauh <strong>36 km</strong>, lalu berbelok ke utara sejauh <strong>15 km</strong> dan berhenti di titik B. Kapal Q berlayar lurus ke arah timur sejauh <strong>20 km</strong> dan berhenti di titik C. Hitung jarak dari B ke C!
                  </p>
                </div>
                <JarakTitikSVG/>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-4">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Tentukan koordinat titik-titik. Misalkan A = (0, 0).</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-body">
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-cyan-300 font-bold">Titik B (Kapal P):</p>
                      <p className="text-white/70">36 km timur, 15 km utara</p>
                      <p className="text-white font-bold mt-1">B = (36, 15)</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-orange-300 font-bold">Titik C (Kapal Q):</p>
                      <p className="text-white/70">20 km timur, 0 km utara</p>
                      <p className="text-white font-bold mt-1">C = (20, 0)</p>
                    </div>
                  </div>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Hitung selisih koordinat.</p>
                  <BlockMath math="\Delta x = 36 - 20 = 16 \text{ km}"/>
                  <BlockMath math="\Delta y = 15 - 0 = 15 \text{ km}"/>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 3:</strong> Gunakan Pythagoras untuk jarak BC.</p>
                  <BlockMath math="BC = \sqrt{(\Delta x)^2 + (\Delta y)^2} = \sqrt{16^2 + 15^2}"/>
                  <BlockMath math="BC = \sqrt{256 + 225} = \sqrt{481}"/>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="BC = \sqrt{481} \approx 21{,}93 \text{ km}"/>
                    <p className="font-body text-sm text-red-200 text-center mt-1">✅ Jarak dari B ke C ≈ <strong>21,93 km</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<MapPin className="w-5 h-5"/>} iconColor="text-violet-400" title="📌 Rangkuman Sub-Bab"/>
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• Soal kontekstual selalu bisa diubah menjadi masalah segitiga siku-siku — <strong className="text-cyan-300">gambar sketsanya dulu!</strong></p>
                  <p className="font-body text-sm text-white/80">• Identifikasi dua sisi yang diketahui dan satu sisi yang dicari.</p>
                  <p className="font-body text-sm text-white/80">• Untuk jarak dua titik: <InlineMath math="d = \sqrt{(\Delta x)^2 + (\Delta y)^2}"/>.</p>
                  <p className="font-body text-sm text-white/80">• Untuk diagonal persegi panjang: <InlineMath math="d = \sqrt{p^2 + l^2}"/>.</p>
                  <p className="font-body text-sm text-white/80">• Selalu berikan <strong className="text-yellow-300">satuan</strong> pada jawaban akhir!</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Para insinyur NASA menggunakan Pythagoras untuk menghitung jarak antar planet! Jika kita tahu posisi dua benda langit dalam koordinat tiga dimensi, rumus jarak tiga dimensi adalah perluasan Pythagoras: <InlineMath math="d = \sqrt{x^2 + y^2 + z^2}"/>.
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

export default MasalahKontekstualPage;
