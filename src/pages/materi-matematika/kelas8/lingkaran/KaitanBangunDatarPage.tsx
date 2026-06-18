import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ─── Incircle (lingkaran dalam segitiga) ───────────────────────────────────
   Triangle: A(140,22) B(240,198) C(40,198)
   Incenter : (140,140)   r ≈ 58
   Tangent points: BC→(140,198)  CA→(89,111)  AB→(191,111)
*/
const LingkaranDalamSegitigaSVG = () => (
  <svg viewBox="0 0 280 230" className="w-full max-w-xs mx-auto" aria-label="Lingkaran dalam segitiga">
    <defs>
      <radialGradient id="incircleGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#4ade80" stopOpacity=".35" />
        <stop offset="100%" stopColor="#4ade80" stopOpacity=".08" />
      </radialGradient>
      <filter id="incircleGlow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <style>{`
        @keyframes incirclePulse{0%,100%{stroke-opacity:.75;filter:drop-shadow(0 0 5px #4ade80) drop-shadow(0 0 12px rgba(74,222,128,.4));}50%{stroke-opacity:1;filter:drop-shadow(0 0 12px #4ade80) drop-shadow(0 0 28px rgba(74,222,128,.75));}}
        @keyframes tangentDot{0%,100%{r:4;opacity:.7;}50%{r:6;opacity:1;}}
        .ic-ring{animation:incirclePulse 2.4s ease-in-out infinite;}
        .t-dot{animation:tangentDot 2.4s ease-in-out infinite;}
      `}</style>
    </defs>

    {/* Triangle fill */}
    <polygon points="140,22 240,198 40,198"
      fill="rgba(6,182,212,.12)" stroke="#06b6d4" strokeWidth="2.5" strokeLinejoin="round"/>

    {/* Vertex labels */}
    <text x="140" y="15" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">A</text>
    <text x="250" y="208" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">B</text>
    <text x="30"  y="208" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">C</text>

    {/* Incircle fill */}
    <circle cx="140" cy="140" r="58" fill="url(#incircleGrad)"/>

    {/* Incircle stroke — glowing */}
    <circle cx="140" cy="140" r="58" fill="none" stroke="#4ade80" strokeWidth="2.5" className="ic-ring"/>

    {/* Perpendicular lines from incenter to tangent points */}
    <line x1="140" y1="140" x2="140" y2="198" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>
    <line x1="140" y1="140" x2="89"  y2="111" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>
    <line x1="140" y1="140" x2="191" y2="111" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>

    {/* r labels on perpendiculars */}
    <text x="147" y="175" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">r</text>
    <text x="105" y="122" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">r</text>
    <text x="172" y="122" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">r</text>

    {/* Right-angle marks at tangent points */}
    <rect x="140" y="190" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity=".7"/>
    <g transform="rotate(-60 89 111)">
      <rect x="89" y="103" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity=".7"/>
    </g>
    <g transform="rotate(60 191 111)">
      <rect x="183" y="103" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity=".7"/>
    </g>

    {/* Tangent points */}
    <circle cx="140" cy="198" r="4.5" fill="#fbbf24" className="t-dot" style={{filter:'drop-shadow(0 0 5px #fbbf24)'}}/>
    <circle cx="89"  cy="111" r="4.5" fill="#fbbf24" className="t-dot" style={{filter:'drop-shadow(0 0 5px #fbbf24)'}}/>
    <circle cx="191" cy="111" r="4.5" fill="#fbbf24" className="t-dot" style={{filter:'drop-shadow(0 0 5px #fbbf24)'}}/>

    {/* Incenter */}
    <circle cx="140" cy="140" r="4" fill="#4ade80" style={{filter:'drop-shadow(0 0 6px #4ade80)'}}/>
    <text x="148" y="137" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold">O</text>
  </svg>
);

/* ─── Circumscribed circle (lingkaran luar segitiga) ───────────────────────
   Circle: center(140,108) r=80
   Vertices on circle at angles -70°, 40°, 175°:
     A(167,33)  B(201,159)  C(60,115)
*/
const LingkaranLuarSegitigaSVG = () => (
  <svg viewBox="0 0 280 230" className="w-full max-w-xs mx-auto" aria-label="Lingkaran luar segitiga">
    <defs>
      <radialGradient id="circumGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#f97316" stopOpacity="0"   />
        <stop offset="80%"  stopColor="#f97316" stopOpacity=".06" />
        <stop offset="100%" stopColor="#f97316" stopOpacity=".22" />
      </radialGradient>
      <style>{`
        @keyframes circumPulse{0%,100%{stroke-opacity:.7;filter:drop-shadow(0 0 5px #f97316) drop-shadow(0 0 14px rgba(249,115,22,.4));}50%{stroke-opacity:1;filter:drop-shadow(0 0 14px #f97316) drop-shadow(0 0 32px rgba(249,115,22,.75));}}
        @keyframes vertexPulse{0%,100%{r:5;opacity:.8;}50%{r:7;opacity:1;}}
        .cc-ring{animation:circumPulse 2.6s ease-in-out infinite;}
        .v-dot{animation:vertexPulse 2.6s ease-in-out infinite;}
      `}</style>
    </defs>

    {/* Circumcircle fill */}
    <circle cx="140" cy="108" r="80" fill="url(#circumGrad)"/>

    {/* Circumcircle stroke */}
    <circle cx="140" cy="108" r="80" fill="none" stroke="#f97316" strokeWidth="2.5" className="cc-ring"/>

    {/* Triangle */}
    <polygon points="167,33 201,159 60,115"
      fill="rgba(251,191,36,.12)" stroke="#fbbf24" strokeWidth="2.5" strokeLinejoin="round"/>

    {/* Vertex labels */}
    <text x="167" y="24"  fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">A</text>
    <text x="213" y="164" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">B</text>
    <text x="48"  y="120" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">C</text>

    {/* Radius lines from center to each vertex */}
    <line x1="140" y1="108" x2="167" y2="33"  stroke="#f97316" strokeWidth="1.4" strokeDasharray="5 3" opacity=".65"/>
    <line x1="140" y1="108" x2="201" y2="159" stroke="#f97316" strokeWidth="1.4" strokeDasharray="5 3" opacity=".65"/>
    <line x1="140" y1="108" x2="60"  y2="115" stroke="#f97316" strokeWidth="1.4" strokeDasharray="5 3" opacity=".65"/>

    {/* R label */}
    <text x="157" y="75"  fill="#fb923c" fontSize="9" fontFamily="monospace" fontWeight="bold">R</text>

    {/* Vertices glow dots */}
    <circle cx="167" cy="33"  r="5.5" fill="#fbbf24" className="v-dot" style={{filter:'drop-shadow(0 0 7px #fbbf24)'}}/>
    <circle cx="201" cy="159" r="5.5" fill="#fbbf24" className="v-dot" style={{filter:'drop-shadow(0 0 7px #fbbf24)'}}/>
    <circle cx="60"  cy="115" r="5.5" fill="#fbbf24" className="v-dot" style={{filter:'drop-shadow(0 0 7px #fbbf24)'}}/>

    {/* Center */}
    <circle cx="140" cy="108" r="4" fill="#f97316" style={{filter:'drop-shadow(0 0 6px #f97316)'}}/>
    <text x="148" y="105" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold">O</text>

    {/* Side labels */}
    <text x="195" y="102" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".8">AB</text>
    <text x="112" y="148" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".8">BC</text>
    <text x="93"  y="68"  fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".8">AC</text>
  </svg>
);

const KaitanBangunDatarPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "kaitan", "contoh1", "contoh2", "rangkuman"]);
  const toggle = (id: string) => { playPopSound(); setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]); };

  const SectionHeader = ({
    id, icon, iconColor, title, gradFrom, gradTo, borderColor,
  }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
    gradFrom?: string; gradTo?: string; borderColor?: string;
  }) => (
    <button
      onClick={() => toggle(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer transition-all"
      style={open.includes(id) ? {
        background: `linear-gradient(to right, ${gradFrom ?? "rgba(6,182,212,.12)"}, transparent)`,
        borderBottom: `1px solid ${borderColor ?? "rgba(6,182,212,.25)"}`,
      } : {}}
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {open.includes(id)
        ? <ChevronUp   className="w-5 h-5" style={{color: borderColor ?? "#06b6d4"}} />
        : <ChevronDown className="w-5 h-5 text-white/30" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">

        {/* ── Page header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-body font-bold tracking-wide"
            style={{background:"rgba(168,85,247,.15)",border:"1px solid rgba(168,85,247,.4)",color:"#c084fc"}}>
            <BookOpen className="w-3.5 h-3.5"/> KELAS 8 · LINGKARAN · MATERI
          </div>
          <h1 className="font-display text-xl md:text-3xl font-bold mb-2 text-glow-cyan"
            style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa,#f97316)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            KAITAN LINGKARAN<br/>DENGAN BANGUN DATAR
          </h1>
          <p className="text-white/40 text-xs font-body">Incircle · Circumcircle · Rumus Jari-Jari</p>
        </div>

        <div className="flex flex-col gap-5 animate-slide-up">

          {/* ── Intro ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{background:"rgba(15,23,42,.7)",borderColor:"rgba(6,182,212,.25)",backdropFilter:"blur(12px)"}}>
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400"
              title="🔗 Lingkaran dan Sahabat-Sahabatnya"
              gradFrom="rgba(234,179,8,.12)" borderColor="rgba(234,179,8,.3)"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 pt-4 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Lingkaran bisa "bersahabat" dengan bangun datar lain dengan dua cara utama:
                  <strong className="text-green-300"> Lingkaran Dalam</strong> — berada di dalam bangun dan menyinggung setiap sisinya, dan
                  <strong className="text-orange-300"> Lingkaran Luar</strong> — melingkupi bangun dan melewati setiap titik sudutnya.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border"
                    style={{background:"linear-gradient(135deg,rgba(34,197,94,.15),rgba(6,182,212,.08))",borderColor:"rgba(34,197,94,.35)"}}>
                    <p className="text-green-300 text-sm font-bold mb-1">⭕ Lingkaran Dalam (Incircle)</p>
                    <p className="text-white/60 text-xs leading-relaxed">Berada di dalam bangun datar, menyinggung semua sisi. Pusatnya disebut <em>incenter</em>.</p>
                  </div>
                  <div className="rounded-xl p-4 border"
                    style={{background:"linear-gradient(135deg,rgba(249,115,22,.15),rgba(251,191,36,.08))",borderColor:"rgba(249,115,22,.35)"}}>
                    <p className="text-orange-300 text-sm font-bold mb-1">🔴 Lingkaran Luar (Circumcircle)</p>
                    <p className="text-white/60 text-xs leading-relaxed">Melingkupi bangun datar, melewati semua titik sudut. Pusatnya disebut <em>circumcenter</em>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Kaitan section ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{background:"rgba(15,23,42,.7)",borderColor:"rgba(168,85,247,.25)",backdropFilter:"blur(12px)"}}>
            <SectionHeader id="kaitan" icon={<Target className="w-5 h-5"/>} iconColor="text-violet-400"
              title="📐 Lingkaran Dalam & Luar Segitiga"
              gradFrom="rgba(168,85,247,.12)" borderColor="rgba(168,85,247,.3)"/>
            {open.includes("kaitan") && (
              <div className="px-5 pb-6 pt-4 space-y-8">

                {/* ── 1. Lingkaran Dalam Segitiga ── */}
                <div className="rounded-2xl overflow-hidden border"
                  style={{background:"linear-gradient(135deg,rgba(34,197,94,.1),rgba(6,182,212,.06))",borderColor:"rgba(34,197,94,.3)"}}>
                  <div className="px-4 pt-4 pb-1 flex items-center gap-2">
                    <span className="text-xl">🟢</span>
                    <p className="font-body text-base font-bold text-green-300">1. Lingkaran Dalam Segitiga</p>
                  </div>
                  <div className="px-4 pb-4">
                    <LingkaranDalamSegitigaSVG />
                    <div className="rounded-xl p-4 mt-2 space-y-2 border"
                      style={{background:"rgba(34,197,94,.08)",borderColor:"rgba(34,197,94,.2)"}}>
                      <p className="font-body text-sm text-white/80">
                        Pusat lingkaran dalam = <strong className="text-green-300">titik potong garis bagi sudut</strong>.
                        Lingkaran menyinggung <strong className="text-yellow-300">tepat di satu titik</strong> pada setiap sisi segitiga.
                      </p>
                      <BlockMath math="r = \dfrac{L_{\triangle}}{s} \qquad s = \dfrac{a+b+c}{2}" />
                      <p className="text-white/50 text-xs">L = luas segitiga, s = semi-perimeter (setengah keliling), a,b,c = panjang sisi</p>
                    </div>
                  </div>
                </div>

                {/* ── 2. Lingkaran Luar Segitiga ── */}
                <div className="rounded-2xl overflow-hidden border"
                  style={{background:"linear-gradient(135deg,rgba(249,115,22,.1),rgba(251,191,36,.06))",borderColor:"rgba(249,115,22,.3)"}}>
                  <div className="px-4 pt-4 pb-1 flex items-center gap-2">
                    <span className="text-xl">🔴</span>
                    <p className="font-body text-base font-bold text-orange-300">2. Lingkaran Luar Segitiga</p>
                  </div>
                  <div className="px-4 pb-4">
                    <LingkaranLuarSegitigaSVG />
                    <div className="rounded-xl p-4 mt-2 space-y-2 border"
                      style={{background:"rgba(249,115,22,.08)",borderColor:"rgba(249,115,22,.2)"}}>
                      <p className="font-body text-sm text-white/80">
                        Pusat lingkaran luar = <strong className="text-orange-300">titik potong sumbu-sumbu sisi</strong>.
                        Semua <strong className="text-yellow-300">titik sudut segitiga</strong> berada tepat di tepi lingkaran.
                      </p>
                      <BlockMath math="R = \dfrac{AB \times AC \times BC}{4 \times L_{\triangle}}" />
                      <p className="text-white/50 text-xs">AB, AC, BC = panjang sisi-sisi segitiga, L = luas segitiga</p>
                      <div className="rounded-lg p-3 mt-1 border"
                        style={{background:"rgba(251,191,36,.08)",borderColor:"rgba(251,191,36,.25)"}}>
                        <p className="text-yellow-200 text-xs">
                          💡 <strong>Ingat:</strong> Untuk segitiga siku-siku, sisi miring = diameter lingkaran luar, sehingga{" "}
                          <InlineMath math="R = \frac{\text{sisi miring}}{2}"/>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── Contoh 1: Lingkaran Dalam Segitiga ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{background:"rgba(15,23,42,.7)",borderColor:"rgba(34,197,94,.25)",backdropFilter:"blur(12px)"}}>
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400"
              title="✏️ Contoh 1 — Lingkaran Dalam Segitiga (Sedang)"
              gradFrom="rgba(34,197,94,.12)" borderColor="rgba(34,197,94,.3)"/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 pt-4 space-y-4">
                <div className="rounded-xl p-4 border"
                  style={{background:"rgba(34,197,94,.1)",borderColor:"rgba(34,197,94,.35)"}}>
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Segitiga siku-siku ABC dengan siku-siku di C memiliki <InlineMath math="AC = 5"/> cm,{" "}
                    <InlineMath math="BC = 12"/> cm. Hitunglah jari-jari lingkaran dalam segitiga tersebut!
                  </p>
                </div>
                <div className="rounded-xl p-4 space-y-3 border"
                  style={{background:"rgba(15,23,42,.6)",borderColor:"rgba(100,116,139,.35)"}}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Cari sisi miring AB</p>
                  <BlockMath math="AB = \sqrt{AC^2 + BC^2} = \sqrt{25 + 144} = \sqrt{169} = 13 \text{ cm}"/>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Hitung luas segitiga</p>
                  <BlockMath math="L = \tfrac{1}{2} \times AC \times BC = \tfrac{1}{2} \times 5 \times 12 = 30 \text{ cm}^2"/>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 3:</strong> Hitung semi-perimeter</p>
                  <BlockMath math="s = \dfrac{5 + 12 + 13}{2} = 15 \text{ cm}"/>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 4:</strong> Jari-jari lingkaran dalam</p>
                  <BlockMath math="r = \dfrac{L}{s} = \dfrac{30}{15} = 2 \text{ cm}"/>
                  <div className="rounded-lg p-3 border" style={{background:"rgba(34,197,94,.1)",borderColor:"rgba(34,197,94,.35)"}}>
                    <p className="font-body text-sm text-green-300 text-center">✅ Jari-jari lingkaran dalam = <strong>2 cm</strong></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Contoh 2: Lingkaran Luar Segitiga ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{background:"rgba(15,23,42,.7)",borderColor:"rgba(249,115,22,.25)",backdropFilter:"blur(12px)"}}>
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-orange-400"
              title="✏️ Contoh 2 — Lingkaran Luar Segitiga (Sulit)"
              gradFrom="rgba(249,115,22,.12)" borderColor="rgba(249,115,22,.3)"/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 pt-4 space-y-4">
                <div className="rounded-xl p-4 border"
                  style={{background:"rgba(249,115,22,.1)",borderColor:"rgba(249,115,22,.35)"}}>
                  <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Segitiga ABC memiliki sisi <InlineMath math="AB = 13"/> cm, <InlineMath math="AC = 5"/> cm,{" "}
                    <InlineMath math="BC = 12"/> cm (segitiga siku-siku di C). Hitunglah jari-jari lingkaran luar segitiga tersebut!
                  </p>
                </div>
                <div className="rounded-xl p-4 space-y-3 border"
                  style={{background:"rgba(15,23,42,.6)",borderColor:"rgba(100,116,139,.35)"}}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Hitung luas segitiga</p>
                  <BlockMath math="L = \tfrac{1}{2} \times AC \times BC = \tfrac{1}{2} \times 5 \times 12 = 30 \text{ cm}^2"/>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Gunakan rumus lingkaran luar</p>
                  <BlockMath math="R = \dfrac{AB \times AC \times BC}{4 \times L} = \dfrac{13 \times 5 \times 12}{4 \times 30}"/>
                  <BlockMath math="R = \dfrac{780}{120} = 6{,}5 \text{ cm}"/>
                  <p className="font-body text-sm text-white/60 text-xs">
                    Cara cepat untuk segitiga siku-siku: <InlineMath math="R = \frac{AB}{2} = \frac{13}{2} = 6{,}5"/> cm ✓
                  </p>
                  <div className="rounded-lg p-3 border" style={{background:"rgba(249,115,22,.1)",borderColor:"rgba(249,115,22,.35)"}}>
                    <p className="font-body text-sm text-orange-300 text-center">✅ Jari-jari lingkaran luar = <strong>6,5 cm</strong></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Rangkuman ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{background:"rgba(15,23,42,.7)",borderColor:"rgba(168,85,247,.25)",backdropFilter:"blur(12px)"}}>
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-violet-400"
              title="📌 Rangkuman Sub-Bab"
              gradFrom="rgba(168,85,247,.12)" borderColor="rgba(168,85,247,.3)"/>
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{background:"linear-gradient(135deg,rgba(34,197,94,.12),rgba(6,182,212,.06))",borderColor:"rgba(34,197,94,.3)"}}>
                    <p className="text-green-300 text-sm font-bold">⭕ Lingkaran Dalam Segitiga</p>
                    <div className="text-white/70 text-xs space-y-1">
                      <p>• Menyinggung ketiga sisi (tegak lurus)</p>
                      <p>• Pusat = perpotongan garis bagi sudut</p>
                    </div>
                    <BlockMath math="r = \dfrac{L_\triangle}{s}"/>
                    <p className="text-white/40 text-[10px]">s = (a+b+c)/2</p>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{background:"linear-gradient(135deg,rgba(249,115,22,.12),rgba(251,191,36,.06))",borderColor:"rgba(249,115,22,.3)"}}>
                    <p className="text-orange-300 text-sm font-bold">🔴 Lingkaran Luar Segitiga</p>
                    <div className="text-white/70 text-xs space-y-1">
                      <p>• Melalui ketiga titik sudut</p>
                      <p>• Pusat = perpotongan sumbu sisi</p>
                    </div>
                    <BlockMath math="R = \dfrac{AB \cdot AC \cdot BC}{4L_\triangle}"/>
                    <p className="text-white/40 text-[10px]">Siku-siku: R = sisi miring / 2</p>
                  </div>
                </div>
                <div className="rounded-xl p-3 border"
                  style={{background:"rgba(251,191,36,.08)",borderColor:"rgba(251,191,36,.25)"}}>
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Tiga sinyal GPS membentuk tiga lingkaran — posisimu ada di perpotongannya, persis seperti konsep circumcircle!
                  </p>
                </div>
              </div>
            )}
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

export default KaitanBangunDatarPage;
