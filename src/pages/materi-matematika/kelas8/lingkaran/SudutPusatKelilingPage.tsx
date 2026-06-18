import React from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, FlaskConical, Microscope, Joystick } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import SudutPusatProofAnim from "@/components/SudutPusatProofAnim";
import SudutPusatInteraktif from "@/components/SudutPusatInteraktif";

const SudutPusatSVG = () => (
  <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto my-2" aria-label="Sudut pusat lingkaran">
    <defs>
      <style>{`
        @keyframes arcPulse{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #f59e0b);}50%{stroke-opacity:0.3;filter:none;}}
        .ap{animation:arcPulse 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="140" cy="110" r="85" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2"/>
    <circle cx="140" cy="110" r="4" fill="#f59e0b"/>
    <text x="145" y="107" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">O</text>
    <line x1="140" y1="110" x2="225" y2="110" stroke="#22c55e" strokeWidth="2.5"/>
    <line x1="140" y1="110" x2="140" y2="25" stroke="#22c55e" strokeWidth="2.5"/>
    <path d="M225,110 A85,85 0 0,0 140,25" fill="none" stroke="#f59e0b" strokeWidth="4" className="ap"/>
    <path d="M140,110 m30,0 a30,30 0 0,0 -30,-30" fill="none" stroke="#fbbf24" strokeWidth="2"/>
    <text x="175" y="98" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">α</text>
    <circle cx="225" cy="110" r="5" fill="#22c55e"/>
    <circle cx="140" cy="25" r="5" fill="#22c55e"/>
    <text x="230" y="115" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="143" y="20" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <rect x="20" y="175" width="240" height="36" rx="6" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1"/>
    <text x="140" y="192" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace">Sudut Pusat ∠AOB = α (titik sudut di pusat O)</text>
    <text x="140" y="206" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">menghadap busur AB</text>
  </svg>
);

const SudutKelilingVsPusatSVG = () => (
  <svg viewBox="0 0 300 250" className="w-full max-w-sm mx-auto my-2" aria-label="Perbandingan sudut pusat dan sudut keliling">
    <defs>
      <style>{`
        @keyframes fadeToggle{0%,45%{opacity:1;}50%,95%{opacity:0.2;}100%{opacity:1;}}
        .ft1{animation:fadeToggle 3s ease-in-out infinite;}
        .ft2{animation:fadeToggle 3s ease-in-out infinite 1.5s;}
      `}</style>
    </defs>
    <circle cx="150" cy="120" r="90" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2"/>
    <circle cx="150" cy="120" r="4" fill="#f59e0b"/>
    <text x="155" y="117" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    <circle cx="240" cy="120" r="5" fill="#22c55e"/>
    <text x="246" y="125" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <circle cx="150" cy="30" r="5" fill="#22c55e"/>
    <text x="155" y="27" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <circle cx="80" cy="185" r="5" fill="#a855f7"/>
    <text x="68" y="200" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <line x1="150" y1="120" x2="240" y2="120" stroke="#f59e0b" strokeWidth="2.5" className="ft1"/>
    <line x1="150" y1="120" x2="150" y2="30" stroke="#f59e0b" strokeWidth="2.5" className="ft1"/>
    <line x1="80" y1="185" x2="240" y2="120" stroke="#a855f7" strokeWidth="2.5" className="ft2"/>
    <line x1="80" y1="185" x2="150" y2="30" stroke="#a855f7" strokeWidth="2.5" className="ft2"/>
    <path d="M240,120 A90,90 0 0,0 150,30" fill="none" stroke="#06b6d4" strokeWidth="3"/>
    <text x="220" y="62" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" className="ft1">α (pusat)</text>
    <text x="100" y="175" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold" className="ft2">β (keliling)</text>
    <text x="150" y="235" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">∠AOB (pusat) = 2 × ∠ACB (keliling)</text>
    <text x="150" y="248" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">α = 2β  →  β = α/2</text>
  </svg>
);

const SudutDiameterSVG = () => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-2" aria-label="Sudut keliling menghadap diameter = 90 derajat">
    <defs>
      <style>{`@keyframes rightAnglePulse{0%,100%{stroke:#fff;opacity:1;}50%{stroke:#fbbf24;opacity:0.6;}}.rap{animation:rightAnglePulse 2s ease-in-out infinite;}`}</style>
    </defs>
    <circle cx="130" cy="100" r="80" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2"/>
    <line x1="50" y1="100" x2="210" y2="100" stroke="#22c55e" strokeWidth="2.5"/>
    <circle cx="50" cy="100" r="5" fill="#22c55e"/>
    <circle cx="210" cy="100" r="5" fill="#22c55e"/>
    <circle cx="130" cy="100" r="4" fill="#f59e0b"/>
    <text x="135" y="97" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">O</text>
    <text x="38" y="97" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="215" y="97" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <circle cx="130" cy="20" r="5" fill="#a855f7"/>
    <text x="135" y="18" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <line x1="50" y1="100" x2="130" y2="20" stroke="#a855f7" strokeWidth="2.5"/>
    <line x1="210" y1="100" x2="130" y2="20" stroke="#a855f7" strokeWidth="2.5"/>
    <polyline points="130,20 118,20 118,30 130,30" fill="none" className="rap" strokeWidth="1.8"/>
    <text x="90" y="65" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">90°</text>
    <text x="130" y="185" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">AB = diameter → ∠ACB = 90°</text>
  </svg>
);

const SudutPusatKelilingPage = () => {
  const navigate = useNavigate();

  const SectionHeader = ({ icon, iconColor, title }: { id?: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <span className={iconColor}>{icon}</span>
      <span className="font-body font-semibold text-white ml-3">{title}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">SUDUT PUSAT DAN SUDUT KELILING</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Lingkaran · Buku Animasi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="📡 Sudut dari Pusat vs Tepi Lingkaran" />
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Bayangkan kamu nonton konser di sebuah arena melingkar. Orang yang berdiri di <strong className="text-yellow-300">tengah panggung (pusat)</strong> punya pandangan 360°. Tapi orang yang duduk di <strong className="text-purple-300">pinggir (keliling)</strong>? Pandangannya hanya setengah dari orang di pusat! Itulah inti dari hubungan sudut pusat dan sudut keliling.
              </p>
              <SudutPusatSVG />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs font-bold text-yellow-300">⭐ SUDUT PUSAT</p>
                  <p className="font-body text-xs text-white/70 mt-1">Titik sudutnya di <strong>pusat O</strong>. Kedua kakinya adalah jari-jari.</p>
                </div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="font-body text-xs font-bold text-purple-300">🔵 SUDUT KELILING</p>
                  <p className="font-body text-xs text-white/70 mt-1">Titik sudutnya di <strong>tepi lingkaran</strong>. Kedua kakinya adalah tali busur.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teorema" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📐 Teorema Sudut Pusat dan Sudut Keliling" />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-cyan-300 mb-2">🎯 Ringkasan Intisari</p>
                <p className="font-body text-sm text-white/80">Ada dua teorema kunci yang harus kamu hafal untuk menguasai topik ini!</p>
              </div>

              <SudutKelilingVsPusatSVG />

              <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                <p className="font-body text-sm font-bold text-yellow-300 mb-2">📌 Teorema 1: Hubungan Sudut Pusat & Sudut Keliling</p>
                <p className="font-body text-sm text-white/80 mb-2">Jika sudut pusat dan sudut keliling <strong className="text-cyan-300">menghadap busur yang sama</strong>, maka:</p>
                <BlockMath math="\text{Sudut Pusat} = 2 \times \text{Sudut Keliling}" />
                <BlockMath math="\angle AOB = 2 \times \angle ACB" />
              </div>

              <SudutDiameterSVG />

              <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                <p className="font-body text-sm font-bold text-green-300 mb-2">📌 Teorema 2: Sudut Keliling Menghadap Diameter</p>
                <p className="font-body text-sm text-white/80 mb-2">Jika sudut keliling menghadap busur setengah lingkaran (diameternya), maka:</p>
                <BlockMath math="\angle ACB = 90°" />
                <p className="font-body text-xs text-white/60">Ini adalah teorema Thales yang terkenal!</p>
              </div>

              <div className="bg-purple-900/30 border border-purple-500/40 rounded-xl p-4">
                <p className="font-body text-sm font-bold text-purple-300 mb-2">📌 Teorema 3: Sudut Keliling Menghadap Busur yang Sama</p>
                <p className="font-body text-sm text-white/80 mb-2">Semua sudut keliling yang menghadap busur yang sama memiliki besar yang sama:</p>
                <BlockMath math="\angle ACB = \angle ADB = \angle AEB" />
              </div>
            </div>
          </div>

          {/* ── Animasi 1: Pembuktian Langkah-demi-Langkah ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="anim-bukti"
              icon={<Microscope className="w-5 h-5" />}
              iconColor="text-cyan-400"
              title="🔬 Animasi 1 — Mengapa Sudut Pusat = 2× Sudut Keliling?"
            />
            <div className="px-4 pb-4">
              <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-lg px-4 py-2.5 mb-3">
                <p className="font-body text-xs text-cyan-200/80 leading-relaxed">
                  Ikuti <strong className="text-cyan-300">langkah demi langkah</strong> pembuktian geometri mengapa sudut pusat selalu tepat 2 kali sudut keliling. 
                  Tekan <strong className="text-white/80">Selanjutnya</strong> untuk melanjutkan setiap tahap.
                </p>
              </div>
              <SudutPusatProofAnim />
            </div>
          </div>

          {/* ── Animasi 2: Interaktif Geser dan Slider ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="anim-interaktif"
              icon={<Joystick className="w-5 h-5" />}
              iconColor="text-purple-400"
              title="🕹️ Animasi 2 — Eksplorasi Interaktif"
            />
            <div className="px-4 pb-4">
              <div className="bg-purple-500/8 border border-purple-500/20 rounded-lg px-4 py-2.5 mb-3">
                <p className="font-body text-xs text-purple-200/80 leading-relaxed">
                  <strong className="text-amber-300">Geser slider</strong> untuk mengubah besar busur (sudut pusat), dan 
                  <strong className="text-purple-300"> seret titik C </strong> 
                  ke sembarang posisi di busur besar — lihat bagaimana sudut keliling selalu tepat setengahnya!
                </p>
              </div>
              <SudutPusatInteraktif />
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mencari Sudut Keliling (Mudah)" />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                <p className="font-body text-sm text-white/90">
                  Diketahui sudut pusat <InlineMath math="\angle AOB = 110°"/>. Titik C berada pada lingkaran dan menghadap busur AB yang sama. Tentukan besar <InlineMath math="\angle ACB"/>!
                </p>
              </div>
              <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                <p className="font-body text-sm text-white/80">Gunakan teorema: Sudut keliling = ½ × Sudut pusat (menghadap busur yang sama)</p>
                <BlockMath math="\angle ACB = \frac{1}{2} \times \angle AOB" />
                <BlockMath math="\angle ACB = \frac{1}{2} \times 110° = 55°" />
                <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-green-300 text-center">✅ Besar <InlineMath math="\angle ACB = \textbf{55°}"/>.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sudut Gabungan (Sedang)" />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                <p className="font-body text-sm text-white/90">
                  Titik A, B, C, D berada pada lingkaran dengan pusat O. Jika <InlineMath math="\angle ABD = 35°"/> dan <InlineMath math="\angle ACD = 35°"/>, tentukan besar sudut pusat <InlineMath math="\angle AOD"/>!
                </p>
              </div>
              <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                <p className="font-body text-sm text-white/80">∠ABD dan ∠ACD keduanya adalah sudut keliling yang menghadap busur AD yang sama. Karena nilainya sama (35° = 35°), ini membuktikan teorema 3 bahwa sudut keliling yang menghadap busur sama adalah sama besar.</p>
                <p className="font-body text-sm text-white/80">Sudut pusat = 2 × sudut keliling:</p>
                <BlockMath math="\angle AOD = 2 \times \angle ABD = 2 \times 35° = 70°" />
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200 text-center">✅ Besar <InlineMath math="\angle AOD = \textbf{70°}"/>.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Segiempat Siklis (Sulit)" />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                <p className="font-body text-sm text-white/90">
                  Segiempat ABCD bertulis dalam lingkaran (segiempat siklis). Jika <InlineMath math="\angle A = 3x + 10°"/> dan <InlineMath math="\angle C = 2x - 5°"/>, tentukan nilai x dan besar <InlineMath math="\angle A"/> serta <InlineMath math="\angle C"/>!
                </p>
              </div>
              <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                <p className="font-body text-sm text-white/80">Sifat segiempat siklis: sudut yang berhadapan saling berpelurus (jumlahnya 180°).</p>
                <BlockMath math="\angle A + \angle C = 180°" />
                <BlockMath math="(3x + 10°) + (2x - 5°) = 180°" />
                <BlockMath math="5x + 5° = 180°" />
                <BlockMath math="5x = 175° \Rightarrow x = 35°" />
                <p className="font-body text-sm text-white/80">Besar sudut:</p>
                <BlockMath math="\angle A = 3(35°) + 10° = 115°" />
                <BlockMath math="\angle C = 2(35°) - 5° = 65°" />
                <p className="font-body text-sm text-white/80">Cek: <InlineMath math="115° + 65° = 180° ✓"/></p>
                <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-red-200 text-center">✅ x = 35°, <InlineMath math="\angle A = \textbf{115°}"/>, <InlineMath math="\angle C = \textbf{65°}"/>.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="📌 Rangkuman Sub-Bab" />
            <div className="px-5 pb-5 space-y-3">
              <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                <p className="font-body text-sm text-white/80">• <strong className="text-yellow-300">Sudut Pusat (titik O)</strong> = 2 × Sudut Keliling (titik di lingkaran) jika menghadap busur yang sama.</p>
                <p className="font-body text-sm text-white/80">• <strong className="text-green-300">Teorema Thales:</strong> Sudut keliling yang menghadap diameter = 90°.</p>
                <p className="font-body text-sm text-white/80">• <strong className="text-purple-300">Teorema 3:</strong> Semua sudut keliling menghadap busur sama → besar sama.</p>
                <p className="font-body text-sm text-white/80">• <strong className="text-cyan-300">Segiempat Siklis:</strong> Sudut berhadapan saling berpelurus (jumlah = 180°).</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">
                  🚀 <strong>Tips Astronot:</strong> Teorema Thales digunakan oleh insinyur untuk memastikan antenna receiver radio berbentuk setengah lingkaran — sudut penerimaannya selalu tepat 90° dari pemancar!
                </p>
              </div>
            </div>
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

export default SudutPusatKelilingPage;
