import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── SVG: GSPD diagram — internal tangent crosses between circles ── */
const GSPDSVG = () => (
  <svg viewBox="0 0 340 210" className="w-full max-w-sm mx-auto my-2" aria-label="Garis singgung persekutuan dalam">
    <defs>
      <style>{`
        @keyframes gspdGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #f97316);}50%{stroke-opacity:0.4;filter:none;}}
        .gspd{animation:gspdGlow 2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Circle 1 (left) */}
    <circle cx="85" cy="110" r="58" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2.5"/>
    <circle cx="85" cy="110" r="4" fill="#3b82f6"/>
    <text x="70" y="107" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">O₁</text>
    {/* Circle 2 (right) */}
    <circle cx="255" cy="110" r="40" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2.5"/>
    <circle cx="255" cy="110" r="4" fill="#a855f7"/>
    <text x="260" y="107" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">O₂</text>
    {/* Intersection point S (on O1O2 line) */}
    <circle cx="172" cy="110" r="4" fill="#22c55e"/>
    <text x="168" y="127" fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold">S</text>
    {/* GSPD 1 — crosses between circles */}
    <line x1="60" y1="168" x2="280" y2="52" stroke="#f97316" strokeWidth="3" className="gspd"/>
    {/* GSPD 2 — crosses between circles */}
    <line x1="60" y1="52" x2="280" y2="168" stroke="#f97316" strokeWidth="3" className="gspd"/>
    {/* Tangent point labels */}
    <circle cx="75" cy="161" r="4" fill="#fbbf24"/>
    <text x="58" y="158" fill="#fbbf24" fontSize="9" fontFamily="monospace">T₃</text>
    <circle cx="269" cy="59" r="4" fill="#fbbf24"/>
    <text x="272" y="55" fill="#fbbf24" fontSize="9" fontFamily="monospace">T₁</text>
    <circle cx="75" cy="59" r="4" fill="#fbbf24"/>
    <text x="58" y="55" fill="#fbbf24" fontSize="9" fontFamily="monospace">T₄</text>
    <circle cx="269" cy="161" r="4" fill="#fbbf24"/>
    <text x="272" y="158" fill="#fbbf24" fontSize="9" fontFamily="monospace">T₂</text>
    {/* Center line */}
    <line x1="85" y1="110" x2="255" y2="110" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
    <text x="170" y="105" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">d</text>
    {/* Formula */}
    <rect x="5" y="190" width="330" height="18" rx="4" fill="rgba(30,41,59,0.9)" stroke="#334155"/>
    <text x="170" y="203" fill="#f97316" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">l_dalam = √(d² - (R + r)²)</text>
  </svg>
);

/* ── SVG: Comparison GSPL vs GSPD ── */
const KomparasiSVG = () => (
  <svg viewBox="0 0 340 160" className="w-full max-w-sm mx-auto my-2" aria-label="Perbandingan GSPL dan GSPD">
    {/* Left: GSPL */}
    <g>
      <circle cx="55" cy="80" r="35" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5"/>
      <circle cx="140" cy="80" r="22" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
      <line x1="30" y1="45" x2="162" y2="58" stroke="#fbbf24" strokeWidth="2.5"/>
      <line x1="30" y1="115" x2="162" y2="102" stroke="#fbbf24" strokeWidth="2.5"/>
      <text x="96" y="148" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">GSPL (tidak silang)</text>
      <rect x="18" y="5" width="156" height="18" rx="4" fill="rgba(30,41,59,0.8)" stroke="#334155"/>
      <text x="96" y="18" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">kedua lingkaran: sisi sama</text>
    </g>
    {/* Divider */}
    <line x1="180" y1="10" x2="180" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
    {/* Right: GSPD */}
    <g>
      <circle cx="215" cy="80" r="35" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5"/>
      <circle cx="300" cy="80" r="22" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
      <line x1="190" y1="50" x2="322" y2="110" stroke="#f97316" strokeWidth="2.5"/>
      <line x1="190" y1="110" x2="322" y2="50" stroke="#f97316" strokeWidth="2.5"/>
      <text x="256" y="148" fill="#f97316" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">GSPD (bersilang)</text>
      <rect x="188" y="5" width="136" height="18" rx="4" fill="rgba(30,41,59,0.8)" stroke="#334155"/>
      <text x="256" y="18" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">lingkaran: sisi berlawanan</text>
    </g>
  </svg>
);

const GSPDPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "rumus", "beda", "contoh1", "contoh2", "contoh3", "rangkuman"]);

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
          GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Garis Singgung Lingkaran · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Garis yang Melintas di Antara Dua Lingkaran" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Berbeda dari GSPL yang melewati sisi luar, <strong className="text-orange-300">Garis Singgung Persekutuan Dalam (GSPD)</strong> adalah garis yang melewati <strong className="text-cyan-300">area di antara dua lingkaran</strong>. Garis ini menyinggung kedua lingkaran, tapi melintas di sela-sela mereka — sehingga kedua lingkaran berada di <strong className="text-yellow-300">sisi yang berlawanan</strong> dari garis tersebut.
                </p>
                <GSPDSVG />
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-orange-200">
                    💡 <strong>Analogi:</strong> Bayangkan dua ember berbeda ukuran. GSPD adalah tali yang melingkar seperti huruf "X" di antara keduanya — menyinggung sisi dalam kedua ember.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="📐 Rumus Panjang GSPD" />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Pada GSPD, garis memotong segmen <InlineMath math="O_1O_2" /> di titik S. Dengan konstruksi segitiga bantu, panjang GSPD menggunakan <strong className="text-cyan-300">penjumlahan</strong> jari-jari (bukan selisih seperti GSPL).
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-3">
                    <BlockMath math="l_{dalam} = \sqrt{d^2 - (R + r)^2}" />
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-2">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Keterangan Variabel</p>
                  <div className="grid grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-orange-900/40 rounded-lg p-2 text-center"><p className="text-orange-300 font-bold"><InlineMath math="l_{dalam}" /></p><p className="text-white/60">Panjang GSPD</p></div>
                    <div className="bg-purple-900/40 rounded-lg p-2 text-center"><p className="text-purple-300 font-bold"><InlineMath math="d" /></p><p className="text-white/60">Jarak antar pusat</p></div>
                    <div className="bg-blue-900/40 rounded-lg p-2 text-center"><p className="text-blue-300 font-bold"><InlineMath math="R+r" /></p><p className="text-white/60">Jumlah jari-jari</p></div>
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-red-200">
                    ⚠️ <strong>Syarat GSPD ada:</strong> <InlineMath math="d > R + r" /> (dua lingkaran tidak bersinggungan atau saling berpotongan). Jika <InlineMath math="d \leq R + r"/>, maka GSPD <strong>tidak ada</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PERBEDAAN GSPL vs GSPD */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="beda" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="🔍 Perbedaan GSPL vs GSPD" />
            {open.includes("beda") && (
              <div className="px-5 pb-5 space-y-4">
                <KomparasiSVG />
                <div className="overflow-x-auto rounded-xl border border-slate-600">
                  <table className="w-full text-xs font-body">
                    <thead>
                      <tr className="bg-slate-800/80">
                        <th className="px-4 py-3 text-left text-white font-bold">Aspek</th>
                        <th className="px-4 py-3 text-left text-yellow-300 font-bold">GSPL</th>
                        <th className="px-4 py-3 text-left text-orange-300 font-bold">GSPD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { aspek: "Posisi lingkaran", gspl: "Sisi yang sama", gspd: "Sisi berlawanan" },
                        { aspek: "Garis melintas", gspl: "Di luar kedua lingkaran", gspd: "Di antara dua lingkaran" },
                        { aspek: "Bentuk", gspl: "Tidak bersilang (///)", gspd: "Bersilang (X)" },
                        { aspek: "Rumus", gspl: "√(d² - (R-r)²)", gspd: "√(d² - (R+r)²)" },
                        { aspek: "Syarat ada", gspl: "d > |R-r|", gspd: "d > R+r" },
                        { aspek: "Jumlah garis", gspl: "2 garis", gspd: "2 garis" },
                      ].map(({ aspek, gspl, gspd }, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}>
                          <td className="px-4 py-2 text-white/70 font-bold">{aspek}</td>
                          <td className="px-4 py-2 text-yellow-200">{gspl}</td>
                          <td className="px-4 py-2 text-orange-200">{gspd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Hitung Panjang GSPD (Mudah)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Dua lingkaran berjari-jari <strong>9 cm</strong> dan <strong>6 cm</strong>, berjarak pusat <strong>25 cm</strong>. Hitung panjang GSPD!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Cek syarat: <InlineMath math="d = 25 > R + r = 15"/> ✓. Diketahui: <InlineMath math="R=9"/>, <InlineMath math="r=6"/>, <InlineMath math="d=25"/>.</p>
                  <BlockMath math="l_{dalam} = \sqrt{d^2 - (R+r)^2} = \sqrt{25^2 - (9+6)^2}" />
                  <BlockMath math="= \sqrt{625 - 225} = \sqrt{400}" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="l_{dalam} = 20 \text{ cm}" />
                    <p className="font-body text-sm text-green-300 text-center mt-1">✅ Panjang GSPD = <strong>20 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Cari Jari-Jari dari GSPD (Sedang)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Dua lingkaran sama besar (<InlineMath math="R = r"/>) memiliki jarak pusat <strong>26 cm</strong>. Panjang GSPD = <strong>24 cm</strong>. Tentukan jari-jari masing-masing lingkaran!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Karena <InlineMath math="R = r"/>, maka <InlineMath math="R + r = 2R"/>.</p>
                  <BlockMath math="l_{dalam}^2 = d^2 - (2R)^2" />
                  <BlockMath math="24^2 = 26^2 - 4R^2" />
                  <BlockMath math="576 = 676 - 4R^2 \Rightarrow 4R^2 = 100 \Rightarrow R^2 = 25" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="R = r = 5 \text{ cm}" />
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">✅ Jari-jari masing-masing lingkaran = <strong>5 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — GSPL dan GSPD Bersamaan (Sulit)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Dua lingkaran berjari-jari <InlineMath math="R = 10"/> cm dan <InlineMath math="r = 6"/> cm. Panjang GSPL = <InlineMath math="4\sqrt{21}"/> cm. Tentukan panjang GSPD!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Cari jarak pusat <InlineMath math="d"/> dari rumus GSPL.</p>
                  <BlockMath math="l_{luar}^2 = d^2 - (R-r)^2" />
                  <BlockMath math="(4\sqrt{21})^2 = d^2 - (10-6)^2" />
                  <BlockMath math="336 = d^2 - 16 \Rightarrow d^2 = 352" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Hitung GSPD.</p>
                  <BlockMath math="l_{dalam} = \sqrt{d^2 - (R+r)^2} = \sqrt{352 - (10+6)^2}" />
                  <BlockMath math="= \sqrt{352 - 256} = \sqrt{96} = 4\sqrt{6} \text{ cm}" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="l_{dalam} = 4\sqrt{6} \approx 9{,}80 \text{ cm}" />
                    <p className="font-body text-sm text-red-200 text-center mt-1">✅ Panjang GSPD = <strong><InlineMath math="4\sqrt{6}" /> cm</strong> ≈ 9,80 cm.</p>
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
                  <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">GSPD</strong>: garis bersilang yang menyinggung dua lingkaran — kedua lingkaran di sisi <strong className="text-cyan-300">berlawanan</strong>.</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-2"><BlockMath math="l_{dalam} = \sqrt{d^2 - (R+r)^2}" /></div>
                  <p className="font-body text-sm text-white/80 mt-2">• Syarat ada: <InlineMath math="d > R+r"/>. • GSPD ≠ GSPL: gunakan <strong className="text-orange-300">(R+r)</strong> bukan (R-r).</p>
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

export default GSPDPage;
