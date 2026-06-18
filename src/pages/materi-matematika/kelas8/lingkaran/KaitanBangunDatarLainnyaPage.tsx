import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, Star } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ═══════════════════════════════════════════════════════════════════
   SVG 1 – Lingkaran Di Dalam Persegi (4 Sudut Diarsir)
   Square: (50,30)→(230,210), side=180. Circle: cx=140,cy=120, r=90
═══════════════════════════════════════════════════════════════════ */
const LingkaranDalamPersegiSVG = () => (
  <svg viewBox="0 0 280 250" className="w-full max-w-xs mx-auto" aria-label="Lingkaran di dalam persegi">
    <defs>
      <style>{`
        @keyframes arsirPulse1{0%,100%{opacity:.45;}50%{opacity:.75;}}
        @keyframes circleGlow1{0%,100%{filter:drop-shadow(0 0 6px #22d3ee);}50%{filter:drop-shadow(0 0 14px #22d3ee);}}
        @keyframes dash1{to{stroke-dashoffset:-16;}}
        .a1-fill{animation:arsirPulse1 2.2s ease-in-out infinite;}
        .a1-ring{animation:circleGlow1 2.2s ease-in-out infinite;}
        .a1-dash{animation:dash1 1.2s linear infinite;}
      `}</style>
    </defs>

    {/* Shaded corners: square - circle using evenodd */}
    <path
      fillRule="evenodd"
      fill="#f97316"
      className="a1-fill"
      d="M50,30 H230 V210 H50 Z M140,120 m-90,0 a90,90,0,1,0,180,0 a90,90,0,1,0,-180,0"
    />

    {/* Square outline */}
    <rect x="50" y="30" width="180" height="180" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round"/>

    {/* Circle fill + glow */}
    <circle cx="140" cy="120" r="90" fill="rgba(34,211,238,.12)" stroke="#22d3ee" strokeWidth="2.5" className="a1-ring"/>

    {/* Center dot */}
    <circle cx="140" cy="120" r="3.5" fill="#22d3ee"/>

    {/* Dashed radius */}
    <line x1="140" y1="120" x2="230" y2="120" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="6 3" className="a1-dash" opacity=".8"/>
    <text x="184" y="114" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>

    {/* Side label */}
    <text x="136" y="224" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">a = 2r</text>

    {/* Arsiran label */}
    <text x="62" y="50" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".9">Arsiran</text>
    <text x="62" y="62" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".9">= Sudut</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG 2 – Bangun Gabungan: Persegi Panjang + Setengah Lingkaran
   Rectangle: (50,120)→(230,210), h=90. Semicircle: cx=140,cy=120,r=90 (top half)
═══════════════════════════════════════════════════════════════════ */
const BangunGabunganSVG = () => (
  <svg viewBox="0 0 280 230" className="w-full max-w-xs mx-auto" aria-label="Bangun gabungan">
    <defs>
      <style>{`
        @keyframes gabPulse{0%,100%{opacity:.35;}50%{opacity:.65;}}
        @keyframes gabGlow{0%,100%{filter:drop-shadow(0 0 6px #06b6d4);}50%{filter:drop-shadow(0 0 16px #06b6d4);}}
        .gab-fill{animation:gabPulse 2.4s ease-in-out infinite;}
        .gab-outer{animation:gabGlow 2.4s ease-in-out infinite;}
      `}</style>
    </defs>

    {/* Combined shape: rectangle + top semicircle, filled */}
    <path
      d="M50,120 A90,90,0,0,1,230,120 V210 H50 Z"
      fill="rgba(6,182,212,.18)"
      className="gab-fill"
    />

    {/* Outline of combined shape */}
    <path
      d="M50,120 A90,90,0,0,1,230,120 V210 H50 Z"
      fill="none"
      stroke="#06b6d4"
      strokeWidth="2.5"
      strokeLinejoin="round"
      className="gab-outer"
    />

    {/* Diameter dashed line */}
    <line x1="50" y1="120" x2="230" y2="120" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 3" opacity=".7"/>
    <text x="133" y="115" fill="#c4b5fd" fontSize="10" fontFamily="monospace">d=2r</text>

    {/* Radius line (to apex of semicircle) */}
    <line x1="140" y1="120" x2="140" y2="30" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5 3" opacity=".7"/>
    <text x="145" y="78" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">r</text>

    {/* Height label */}
    <line x1="238" y1="120" x2="238" y2="210" stroke="#4ade80" strokeWidth="1.5" opacity=".6"/>
    <text x="244" y="170" fill="#4ade80" fontSize="10" fontFamily="monospace">t</text>

    {/* Base label */}
    <text x="136" y="224" fill="#06b6d4" fontSize="10" fontFamily="monospace" textAnchor="middle">2r</text>

    {/* Center dot */}
    <circle cx="140" cy="120" r="3" fill="#06b6d4"/>
    <text x="147" y="119" fill="#67e8f9" fontSize="9" fontFamily="monospace">O</text>

    {/* Labels */}
    <text x="136" y="78" fill="#67e8f9" fontSize="9" fontFamily="monospace" textAnchor="end">↑ Setengah</text>
    <text x="136" y="89" fill="#67e8f9" fontSize="9" fontFamily="monospace" textAnchor="end">Lingkaran</text>
    <text x="144" y="170" fill="#22d3ee" fontSize="9" fontFamily="monospace">Persegi</text>
    <text x="144" y="181" fill="#22d3ee" fontSize="9" fontFamily="monospace">Panjang</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG 3 – Segitiga Siku-Siku dengan Lingkaran Dalam (Arsiran = Segitiga – Lingkaran)
   Right triangle: C(50,200) A(50,40) B(220,200)
   Incircle: r ≈ 38, incenter ≈ (88,162)
   (AC=160, BC=170, AB=√(160²+170²)≈233.5; s≈281.75; L=½×160×170=13600; r=13600/281.75≈48)
   Simpler: AC=120,BC=90,AB=150; s=180; L=5400; r=30; incenter=(50+30,200-30)=(80,170)
   Triangle: C(50,200), A(50,80), B(170,200)
   AC=120, BC=120, AB=√(120²+120²)=... not 90-120-150
   Use: C(55,195), A(55,75), B(175,195) → AC=120, BC=120 → isoceles not right
   Use right triangle 3-4-5 scaled×30: legs 90,120,hyp=150
   C(55,195): right angle
   A(55,75): top (AC=120 vertical)
   B(175,195): right (BC=120... wait 3-4-5: 90,120,150)
   C(55,200), A(55,80) [AC=120], B(175,200) [BC=120] → not 3-4-5
   Use: C(50,200), A(50,80), B(140,200) → AC=120, BC=90 → hyp=√(120²+90²)=√(14400+8100)=√22500=150 ✓ 3-4-5 × 30
   s=(120+90+150)/2=180; L=½×90×120=5400; r=5400/180=30
   Incenter for right triangle at C: ix=C_x+r=50+30=80, iy=C_y-r=200-30=170
═══════════════════════════════════════════════════════════════════ */
const SegitigaDanLingkaranSVG = () => (
  <svg viewBox="0 0 280 240" className="w-full max-w-xs mx-auto" aria-label="Segitiga dan lingkaran dalam">
    <defs>
      <style>{`
        @keyframes arsirPurple{0%,100%{opacity:.45;}50%{opacity:.72;}}
        @keyframes purpleGlow{0%,100%{filter:drop-shadow(0 0 5px #a855f7);}50%{filter:drop-shadow(0 0 14px #a855f7);}}
        .p-fill{animation:arsirPurple 2.6s ease-in-out infinite;}
        .p-ring{animation:purpleGlow 2.6s ease-in-out infinite;}
      `}</style>
    </defs>

    {/* Shaded region: triangle minus incircle (evenodd) */}
    <path
      fillRule="evenodd"
      fill="#a855f7"
      className="p-fill"
      d="M50,200 L50,80 L140,200 Z M80,170 m-30,0 a30,30,0,1,0,60,0 a30,30,0,1,0,-60,0"
    />

    {/* Triangle outline */}
    <polygon points="50,200 50,80 140,200" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinejoin="round"/>

    {/* Incircle */}
    <circle cx="80" cy="170" r="30" fill="rgba(168,85,247,.15)" stroke="#d946ef" strokeWidth="2" className="p-ring"/>

    {/* Right-angle mark at C */}
    <polyline points="60,200 60,190 50,190" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity=".7"/>

    {/* Vertex labels */}
    <text x="42" y="72"  fill="#e879f9" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="148" y="208" fill="#e879f9" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="36" y="212" fill="#e879f9" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>

    {/* Tangent points */}
    <circle cx="80"  cy="200" r="3.5" fill="#fbbf24"/>
    <circle cx="50"  cy="170" r="3.5" fill="#fbbf24"/>

    {/* Radius line */}
    <line x1="80" y1="170" x2="80" y2="200" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="4 2" opacity=".8"/>
    <text x="84" y="188" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">r</text>

    {/* Incenter */}
    <circle cx="80" cy="170" r="3" fill="#d946ef"/>

    {/* Side labels */}
    <text x="32"  y="145" fill="#c4b5fd" fontSize="9" fontFamily="monospace">a=120</text>
    <text x="85"  y="214" fill="#c4b5fd" fontSize="9" fontFamily="monospace">b=90</text>

    {/* Arsiran text */}
    <text x="106" y="155" fill="#fde68a" fontSize="9" fontFamily="monospace">Arsiran</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG 4 – Persegi Panjang dengan Lingkaran di Dalam (Arsiran = Sisi-Sisi)
   Rectangle: (40,40)→(240,200), w=200,h=160. Circle: cx=140,cy=120, r=70
═══════════════════════════════════════════════════════════════════ */
const PersegipanjangDanLingkaranSVG = () => (
  <svg viewBox="0 0 280 240" className="w-full max-w-xs mx-auto" aria-label="Persegi panjang dan lingkaran">
    <defs>
      <style>{`
        @keyframes arsirGreen{0%,100%{opacity:.4;}50%{opacity:.7;}}
        @keyframes greenGlow{0%,100%{filter:drop-shadow(0 0 6px #4ade80);}50%{filter:drop-shadow(0 0 16px #4ade80);}}
        .g-fill{animation:arsirGreen 2s ease-in-out infinite;}
        .g-ring{animation:greenGlow 2s ease-in-out infinite;}
      `}</style>
      <mask id="circMask">
        <rect x="40" y="40" width="200" height="160" fill="white"/>
        <circle cx="140" cy="120" r="70" fill="black"/>
      </mask>
    </defs>

    {/* Shaded corners: rectangle with circle cut using mask */}
    <rect x="40" y="40" width="200" height="160" fill="#22c55e" className="g-fill" mask="url(#circMask)"/>

    {/* Rectangle outline */}
    <rect x="40" y="40" width="200" height="160" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinejoin="round"/>

    {/* Circle */}
    <circle cx="140" cy="120" r="70" fill="rgba(34,197,94,.12)" stroke="#4ade80" strokeWidth="2.5" className="g-ring"/>

    {/* Center */}
    <circle cx="140" cy="120" r="3.5" fill="#4ade80"/>

    {/* Radius line */}
    <line x1="140" y1="120" x2="210" y2="120" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>
    <text x="170" y="114" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>

    {/* Width/height labels */}
    <text x="133" y="228" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle">p (panjang)</text>
    <text x="18"  y="124" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle"
      transform="rotate(-90 18 124)">l (lebar)</text>

    {/* Arsiran corner label */}
    <text x="46" y="56" fill="#fde68a" fontSize="9" fontFamily="monospace">Arsiran</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   FORMULA CARDS
═══════════════════════════════════════════════════════════════════ */
const FormulaCard = ({ color, label, luas, keliling }: {
  color: string; label: string; luas: string; keliling: string;
}) => (
  <div className="rounded-xl p-4 space-y-2 border text-sm"
    style={{ background: `${color}18`, borderColor: `${color}45` }}>
    <p className="font-body font-bold text-xs uppercase tracking-widest" style={{ color }}>
      📐 {label}
    </p>
    <div className="space-y-1">
      <p className="text-white/60 text-xs font-body">Luas Arsiran:</p>
      <BlockMath math={luas} />
      <p className="text-white/60 text-xs font-body">Keliling Daerah Arsiran:</p>
      <BlockMath math={keliling} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
const KaitanBangunDatarLainnyaPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "kasus1", "kasus2", "kasus3", "kasus4", "contoh1", "contoh2", "rangkuman"]);
  const toggle = (id: string) => { playPopSound(); setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]); };

  const SectionHeader = ({
    id, icon, iconColor, title, accent,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string; accent?: string }) => (
    <button
      onClick={() => toggle(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer transition-all"
      style={open.includes(id) ? {
        background: `linear-gradient(to right, ${accent ?? "rgba(6,182,212,.12)"}, transparent)`,
        borderBottom: `1px solid ${accent ? accent.replace("rgba(", "rgba(").replace(", .12)", ", .3)") : "rgba(6,182,212,.3)"}`,
      } : {}}
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white text-sm leading-snug">{title}</span>
      </div>
      {open.includes(id)
        ? <ChevronUp   className="w-5 h-5 shrink-0" style={{ color: accent ? "#fff" : "#06b6d4" }} />
        : <ChevronDown className="w-5 h-5 shrink-0 text-white/25" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">

        {/* ── Page Header ────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-body font-bold tracking-wide"
            style={{ background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.4)", color: "#4ade80" }}>
            <BookOpen className="w-3.5 h-3.5" /> KELAS 8 · LINGKARAN · MATERI
          </div>
          <h1
            className="font-display text-2xl md:text-3xl font-bold mb-2 leading-tight"
            style={{
              background: "linear-gradient(135deg,#4ade80,#22d3ee,#a78bfa,#f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            KAITAN LINGKARAN<br />DENGAN BANGUN DATAR LAINNYA
          </h1>
          <p className="text-white/40 text-xs font-body">Luas & Keliling Daerah Arsiran · Bangun Gabungan</p>
          {/* decorative stars */}
          <div className="flex justify-center gap-2 mt-3">
            {["#f97316","#22d3ee","#a78bfa","#4ade80","#fbbf24"].map((c,i) => (
              <Star key={i} className="w-3 h-3" style={{ color: c, fill: c, opacity: .6 }} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(251,191,36,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title="💡 Apa Itu Daerah Arsiran?" accent="rgba(251,191,36,.12)" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <p className="font-body text-sm text-white/85 leading-relaxed">
                  Dalam soal matematika, kita sering menemukan gambar bangun datar yang <strong className="text-yellow-300">saling bertumpang-tindih</strong> atau saling berada di dalam satu sama lain. Bagian yang <em>diarsir</em> adalah daerah yang menjadi fokus pertanyaan — bisa berupa sudut-sudut yang tersisa, gabungan dua bangun, atau daerah yang "dipotong" oleh lingkaran.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { color: "#f97316", label: "Dikurangi", desc: "Arsiran = Bangun Besar − Bangun Kecil" },
                    { color: "#06b6d4", label: "Dijumlah", desc: "Arsiran = Luas Bangun A + Luas Bangun B" },
                    { color: "#a855f7", label: "Campuran", desc: "Gabungan busur lingkaran dan sisi lurus" },
                  ].map((c, i) => (
                    <div key={i} className="rounded-xl p-3 border text-center"
                      style={{ background: `${c.color}15`, borderColor: `${c.color}40` }}>
                      <p className="text-xs font-bold mb-1" style={{ color: c.color }}>✦ {c.label}</p>
                      <p className="text-white/55 text-xs">{c.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3 border"
                  style={{ background: "rgba(251,191,36,.08)", borderColor: "rgba(251,191,36,.3)" }}>
                  <p className="font-body text-sm text-yellow-200">
                    🔑 <strong>Kunci utama:</strong> Identifikasi terlebih dahulu <em>bangun apa yang ditambah</em> dan <em>bangun apa yang dikurang</em>. Setelah itu, hitung luas dan kelilingnya secara terpisah.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KASUS 1: Lingkaran Di Dalam Persegi ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="kasus1" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400"
              title="🔶 Kasus 1 — Lingkaran di Dalam Persegi (Sudut Diarsir)"
              accent="rgba(249,115,22,.12)" />
            {open.includes("kasus1") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-3 border text-sm font-body"
                  style={{ background: "rgba(249,115,22,.08)", borderColor: "rgba(249,115,22,.25)" }}>
                  <p className="text-orange-200 leading-relaxed">
                    Sebuah lingkaran <strong className="text-cyan-300">tepat menyinggung semua sisi persegi</strong> dari dalam. Daerah yang diarsir adalah <strong className="text-orange-300">keempat sudut persegi</strong> yang tidak tertutupi lingkaran.
                  </p>
                </div>
                <LingkaranDalamPersegiSVG />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(249,115,22,.09)", borderColor: "rgba(249,115,22,.3)" }}>
                    <p className="text-orange-300 font-bold text-xs uppercase tracking-wide">📐 Luas Daerah Arsiran</p>
                    <p className="text-white/60 text-xs font-body">Luas persegi dikurangi luas lingkaran:</p>
                    <BlockMath math="L_{\text{arsir}} = a^2 - \pi r^2" />
                    <p className="text-white/50 text-xs font-body">Karena <InlineMath math="a = 2r" />:</p>
                    <BlockMath math="L_{\text{arsir}} = 4r^2 - \pi r^2 = r^2(4-\pi)" />
                  </div>
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(34,211,238,.09)", borderColor: "rgba(34,211,238,.3)" }}>
                    <p className="text-cyan-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Daerah Arsiran</p>
                    <p className="text-white/60 text-xs font-body">Sisi luar (persegi) + sisi dalam (lingkaran):</p>
                    <BlockMath math="K_{\text{arsir}} = 4a + 2\pi r" />
                    <p className="text-white/50 text-xs font-body">Karena <InlineMath math="a = 2r" />:</p>
                    <BlockMath math="K_{\text{arsir}} = 8r + 2\pi r = 2r(4+\pi)" />
                  </div>
                </div>
                <div className="rounded-xl p-3 border"
                  style={{ background: "rgba(251,191,36,.07)", borderColor: "rgba(251,191,36,.25)" }}>
                  <p className="text-yellow-200 text-xs font-body">
                    ✏️ <strong>Ingat:</strong> "Keliling daerah arsiran" = semua garis batas yang mengelilingi daerah tersebut — baik yang lurus (sisi persegi) maupun yang melengkung (busur lingkaran).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KASUS 2: Bangun Gabungan ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(6,182,212,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="kasus2" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title="🔵 Kasus 2 — Bangun Gabungan: Persegi Panjang + Setengah Lingkaran"
              accent="rgba(6,182,212,.12)" />
            {open.includes("kasus2") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-3 border text-sm font-body"
                  style={{ background: "rgba(6,182,212,.08)", borderColor: "rgba(6,182,212,.25)" }}>
                  <p className="text-cyan-200 leading-relaxed">
                    Dua bangun <strong className="text-cyan-300">digabungkan menjadi satu</strong>: sebuah persegi panjang (panjang <em>p</em>, lebar <em>t</em>) ditambah setengah lingkaran di salah satu sisi panjangnya. Bayangkan kolam renang dengan ujung berbentuk setengah oval!
                  </p>
                </div>
                <BangunGabunganSVG />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(6,182,212,.09)", borderColor: "rgba(6,182,212,.3)" }}>
                    <p className="text-cyan-300 font-bold text-xs uppercase tracking-wide">📐 Luas Gabungan</p>
                    <p className="text-white/60 text-xs font-body">Luas persegi panjang + luas setengah lingkaran:</p>
                    <BlockMath math="L = p \times t + \tfrac{1}{2}\pi r^2" />
                    <p className="text-white/50 text-xs font-body">dengan <InlineMath math="r = \tfrac{p}{2}" /> (diameter = panjang)</p>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(167,139,250,.09)", borderColor: "rgba(167,139,250,.3)" }}>
                    <p className="text-violet-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Gabungan</p>
                    <p className="text-white/60 text-xs font-body">Dua sisi pendek + satu sisi panjang + busur setengah lingkaran:</p>
                    <BlockMath math="K = 2t + p + \pi r" />
                    <p className="text-white/50 text-xs font-body">Sisi panjang atas diganti busur <InlineMath math="\pi r"/></p>
                  </div>
                </div>
                <div className="rounded-xl p-3 border"
                  style={{ background: "rgba(251,191,36,.07)", borderColor: "rgba(251,191,36,.25)" }}>
                  <p className="text-yellow-200 text-xs font-body">
                    🎯 <strong>Perhatikan:</strong> Keliling bangun gabungan <em>tidak</em> menjumlahkan semua sisi — sisi yang <em>berhimpitan</em> (diameter setengah lingkaran yang berimpit dengan sisi persegi panjang) tidak dihitung!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KASUS 3: Segitiga + Lingkaran Dalam ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="kasus3" icon={<Target className="w-5 h-5" />} iconColor="text-violet-400"
              title="🔺 Kasus 3 — Segitiga dengan Lingkaran Dalam (Arsiran = Segitiga − Lingkaran)"
              accent="rgba(168,85,247,.12)" />
            {open.includes("kasus3") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-3 border text-sm font-body"
                  style={{ background: "rgba(168,85,247,.08)", borderColor: "rgba(168,85,247,.25)" }}>
                  <p className="text-violet-200 leading-relaxed">
                    Sebuah lingkaran <strong className="text-violet-300">dimasukkan ke dalam segitiga</strong> sehingga menyinggung ketiga sisinya. Daerah arsiran adalah bagian segitiga yang <strong className="text-pink-300">tidak terisi</strong> oleh lingkaran — biasanya berada di tiga pojok segitiga.
                  </p>
                </div>
                <SegitigaDanLingkaranSVG />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(168,85,247,.09)", borderColor: "rgba(168,85,247,.3)" }}>
                    <p className="text-violet-300 font-bold text-xs uppercase tracking-wide">📐 Luas Daerah Arsiran</p>
                    <BlockMath math="L_{\text{arsir}} = L_\triangle - \pi r^2" />
                    <p className="text-white/60 text-xs font-body">dengan <InlineMath math="r = \dfrac{L_\triangle}{s}"/>, <InlineMath math="s = \dfrac{a+b+c}{2}"/></p>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(217,70,239,.09)", borderColor: "rgba(217,70,239,.3)" }}>
                    <p className="text-fuchsia-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Daerah Arsiran</p>
                    <BlockMath math="K_{\text{arsir}} = (a+b+c) + 2\pi r" />
                    <p className="text-white/60 text-xs font-body">Keliling segitiga + keliling lingkaran</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── KASUS 4: Persegi Panjang − Lingkaran ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(34,197,94,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="kasus4" icon={<Target className="w-5 h-5" />} iconColor="text-green-400"
              title="🟩 Kasus 4 — Persegi Panjang dengan Lingkaran di Dalamnya"
              accent="rgba(34,197,94,.12)" />
            {open.includes("kasus4") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-3 border text-sm font-body"
                  style={{ background: "rgba(34,197,94,.08)", borderColor: "rgba(34,197,94,.25)" }}>
                  <p className="text-green-200 leading-relaxed">
                    Sebuah lingkaran berada <strong className="text-green-300">di tengah persegi panjang</strong>. Daerah arsiran adalah bagian persegi panjang di sekitar lingkaran — seperti bingkai foto yang mengelilingi gambar bulat!
                  </p>
                </div>
                <PersegipanjangDanLingkaranSVG />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(34,197,94,.09)", borderColor: "rgba(34,197,94,.3)" }}>
                    <p className="text-green-300 font-bold text-xs uppercase tracking-wide">📐 Luas Daerah Arsiran</p>
                    <BlockMath math="L_{\text{arsir}} = p \times l - \pi r^2" />
                    <p className="text-white/60 text-xs font-body">Luas persegi panjang dikurangi luas lingkaran</p>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(74,222,128,.09)", borderColor: "rgba(74,222,128,.3)" }}>
                    <p className="text-green-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Daerah Arsiran</p>
                    <BlockMath math="K_{\text{arsir}} = 2(p + l) + 2\pi r" />
                    <p className="text-white/60 text-xs font-body">Keliling persegi panjang + keliling lingkaran</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 1 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title="✏️ Contoh 1 — Persegi dengan Lingkaran Dalam (π = 3,14)"
              accent="rgba(249,115,22,.12)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border"
                  style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                  <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah persegi memiliki sisi 20 cm. Di dalamnya terdapat lingkaran yang menyinggung keempat sisinya. Hitunglah <strong>(a)</strong> luas daerah yang diarsir dan <strong>(b)</strong> keliling daerah yang diarsir! <InlineMath math="(\pi = 3{,}14)"/>
                  </p>
                </div>
                <div className="rounded-xl p-4 space-y-3 border"
                  style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> sisi persegi <InlineMath math="a = 20"/> cm, sehingga <InlineMath math="r = 10"/> cm
                  </p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas daerah arsiran:</strong></p>
                  <BlockMath math="L_{\text{arsir}} = a^2 - \pi r^2 = 20^2 - 3{,}14 \times 10^2" />
                  <BlockMath math="= 400 - 314 = 86 \text{ cm}^2" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling daerah arsiran:</strong></p>
                  <BlockMath math="K_{\text{arsir}} = 4a + 2\pi r = 4(20) + 2 \times 3{,}14 \times 10" />
                  <BlockMath math="= 80 + 62{,}8 = 142{,}8 \text{ cm}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center"
                      style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                      <p className="text-orange-300 text-xs font-bold">✅ Luas Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">86 cm²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center"
                      style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">142,8 cm</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 2 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-violet-400"
              title="✏️ Contoh 2 — Bangun Gabungan Persegi Panjang + Setengah Lingkaran (π = 22/7)"
              accent="rgba(168,85,247,.12)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border"
                  style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
                  <p className="text-violet-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Lapangan futsal berbentuk persegi panjang berukuran 28 m × 14 m. Pada salah satu sisi panjangnya (28 m) ditambahkan setengah lingkaran. Hitunglah <strong>(a)</strong> luas total lapangan dan <strong>(b)</strong> kelilingnya! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <div className="rounded-xl p-4 space-y-3 border"
                  style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> <InlineMath math="p = 28"/> m, <InlineMath math="t = 14"/> m, setengah lingkaran dengan <InlineMath math="r = \tfrac{28}{2} = 14"/> m
                  </p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas total:</strong></p>
                  <BlockMath math="L = p \times t + \tfrac{1}{2}\pi r^2 = 28 \times 14 + \tfrac{1}{2} \times \tfrac{22}{7} \times 14^2" />
                  <BlockMath math="= 392 + \tfrac{1}{2} \times \tfrac{22}{7} \times 196 = 392 + 308 = 700 \text{ m}^2" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Dua sisi pendek (14 m) + satu sisi panjang bawah (28 m) + busur setengah lingkaran</p>
                  <BlockMath math="K = 2t + p + \pi r = 2(14) + 28 + \tfrac{22}{7} \times 14" />
                  <BlockMath math="= 28 + 28 + 44 = 100 \text{ m}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center"
                      style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
                      <p className="text-violet-300 text-xs font-bold">✅ Luas Total</p>
                      <p className="text-white text-sm font-bold mt-1">700 m²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center"
                      style={{ background: "rgba(6,182,212,.1)", borderColor: "rgba(6,182,212,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling</p>
                      <p className="text-white text-sm font-bold mt-1">100 m</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(251,191,36,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-yellow-400"
              title="📌 Rangkuman — Peta Rumus Daerah Arsiran"
              accent="rgba(251,191,36,.12)" />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      color: "#f97316", emoji: "🔶", title: "Lingkaran Dalam Persegi",
                      luas: "L = a^2 - \\pi r^2",
                      keliling: "K = 4a + 2\\pi r",
                    },
                    {
                      color: "#06b6d4", emoji: "🔵", title: "Persegi Panjang + ½ Lingkaran",
                      luas: "L = p \\cdot t + \\tfrac{1}{2}\\pi r^2",
                      keliling: "K = 2t + p + \\pi r",
                    },
                    {
                      color: "#a855f7", emoji: "🔺", title: "Segitiga − Lingkaran Dalam",
                      luas: "L = L_\\triangle - \\pi r^2",
                      keliling: "K = (a+b+c) + 2\\pi r",
                    },
                    {
                      color: "#22c55e", emoji: "🟩", title: "Persegi Panjang − Lingkaran",
                      luas: "L = p \\cdot l - \\pi r^2",
                      keliling: "K = 2(p+l) + 2\\pi r",
                    },
                  ].map((c, i) => (
                    <div key={i} className="rounded-xl p-3 border space-y-2"
                      style={{ background: `${c.color}12`, borderColor: `${c.color}38` }}>
                      <p className="font-bold text-xs" style={{ color: c.color }}>{c.emoji} {c.title}</p>
                      <div className="text-[11px] text-white/50">Luas:</div>
                      <BlockMath math={c.luas} />
                      <div className="text-[11px] text-white/50">Keliling:</div>
                      <BlockMath math={c.keliling} />
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4 border"
                  style={{ background: "linear-gradient(135deg,rgba(251,191,36,.1),rgba(249,115,22,.08))", borderColor: "rgba(251,191,36,.3)" }}>
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    🚀 <strong>Tips Bintang:</strong> Untuk semua soal daerah arsiran, ikuti langkah ini: <br/>
                    <span className="text-cyan-300">① Gambar sketsa</span> →
                    <span className="text-green-300"> ② Identifikasi bangun</span> →
                    <span className="text-orange-300"> ③ Tentukan operasi (+/−)</span> →
                    <span className="text-violet-300"> ④ Hitung luas dan keliling terpisah</span>.
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

export default KaitanBangunDatarLainnyaPage;
