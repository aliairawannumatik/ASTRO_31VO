import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, Ruler } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import PythagorasDiscoveryAnimation from "@/components/PythagorasDiscoveryAnimation";
import PythagorasRearrangementAnimation from "@/components/PythagorasRearrangementAnimation";
import PythagorasWaterProof from "@/components/PythagorasWaterProof";

/*
  Pembuktian SVG — 4 right-triangles (a=60, b=80, c=100) inside a square (side=140).
  Outer square corners: (40,20)→(180,20)→(180,160)→(40,160)
  Inner rotated square vertices (all sides = c = 100):
    P1=(100,20) P2=(180,80) P3=(120,160) P4=(40,100)
*/
const PembuktianSVG = () => (
  <svg viewBox="0 0 350 205" className="w-full max-w-lg mx-auto my-4" aria-label="Pembuktian Teorema Pythagoras">
    <defs>
      <style>{`
        @keyframes fadeLabel{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .lbl-anim{animation:fadeLabel 2.5s ease-in-out infinite;}
      `}</style>
    </defs>

    {/* ── Outer big square (side = a+b = 140) ── */}
    <rect x="40" y="20" width="140" height="140" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 3"/>

    {/* ── 4 right triangles ── */}
    {/* Top-left: right angle at (40,20), legs a=60 right & b=80 down */}
    <polygon points="40,20 100,20 40,100" fill="#3b82f6" fillOpacity="0.75" stroke="#60a5fa" strokeWidth="1.5"/>
    {/* Top-right: right angle at (180,20), legs b=80 left & a=60 down */}
    <polygon points="180,20 100,20 180,80" fill="#22c55e" fillOpacity="0.75" stroke="#4ade80" strokeWidth="1.5"/>
    {/* Bottom-right: right angle at (180,160), legs a=60 up & b=80 left */}
    <polygon points="180,160 180,80 120,160" fill="#f97316" fillOpacity="0.75" stroke="#fb923c" strokeWidth="1.5"/>
    {/* Bottom-left: right angle at (40,160), legs b=80 up & a=60 right */}
    <polygon points="40,160 40,100 120,160" fill="#a855f7" fillOpacity="0.75" stroke="#c084fc" strokeWidth="1.5"/>

    {/* ── Inner square (all sides = c = 100) ── */}
    <polygon points="100,20 180,80 120,160 40,100" fill="#fef08a" fillOpacity="0.22" stroke="#eab308" strokeWidth="2.5"/>

    {/* ── Side labels on outer square edges ── */}
    {/* Top edge: a (40→100) and b (100→180) */}
    <text x="70"  y="14" fill="#60a5fa" fontSize="13" fontWeight="bold" textAnchor="middle" className="lbl-anim">a</text>
    <text x="140" y="14" fill="#4ade80" fontSize="13" fontWeight="bold" textAnchor="middle" className="lbl-anim">b</text>
    {/* Right edge: a (20→80) and b (80→160) */}
    <text x="191" y="54"  fill="#4ade80" fontSize="13" fontWeight="bold" textAnchor="start" className="lbl-anim">a</text>
    <text x="191" y="124" fill="#fb923c" fontSize="13" fontWeight="bold" textAnchor="start" className="lbl-anim">b</text>
    {/* Bottom edge: b (40→120) and a (120→180) */}
    <text x="80"  y="178" fill="#c084fc" fontSize="13" fontWeight="bold" textAnchor="middle" className="lbl-anim">b</text>
    <text x="150" y="178" fill="#fb923c" fontSize="13" fontWeight="bold" textAnchor="middle" className="lbl-anim">a</text>
    {/* Left edge: b (20→100) and a (100→160) */}
    <text x="28" y="64"  fill="#60a5fa" fontSize="13" fontWeight="bold" textAnchor="middle" className="lbl-anim">b</text>
    <text x="28" y="134" fill="#c084fc" fontSize="13" fontWeight="bold" textAnchor="middle" className="lbl-anim">a</text>

    {/* ── c label on one side of inner square ── */}
    <text x="145" y="46" fill="#eab308" fontSize="13" fontWeight="bold" className="lbl-anim">c</text>

    {/* ── Right angle marks at outer corners ── */}
    <polyline points="40,28 48,28 48,20"   fill="none" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6"/>
    <polyline points="172,20 172,28 180,28" fill="none" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6"/>
    <polyline points="180,152 172,152 172,160" fill="none" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6"/>
    <polyline points="48,160 48,152 40,152"  fill="none" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6"/>

    {/* ── Divider ── */}
    <line x1="212" y1="18" x2="212" y2="182" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>

    {/* ── Explanation panel ── */}
    <text x="220" y="34"  fill="#94a3b8" fontSize="10" fontFamily="monospace">Luas persegi besar:</text>
    <text x="220" y="49"  fill="#eab308" fontSize="10" fontFamily="monospace" fontWeight="bold">= (a + b)²</text>
    <text x="220" y="72"  fill="#94a3b8" fontSize="10" fontFamily="monospace">= 4 segitiga +</text>
    <text x="220" y="85"  fill="#94a3b8" fontSize="10" fontFamily="monospace">  persegi tengah</text>
    <text x="220" y="108" fill="#94a3b8" fontSize="10" fontFamily="monospace">4 × ½ab + c²</text>
    <text x="220" y="124" fill="#94a3b8" fontSize="10" fontFamily="monospace">= 2ab + c²</text>
    <text x="220" y="152" fill="#eab308" fontSize="11" fontFamily="monospace" fontWeight="bold">∴ a² + b² = c²</text>
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
    <polygon points="20,130 160,130 20,20" fill="rgba(59,130,246,0.15)" stroke="none"/>
    <line x1="20" y1="130" x2="160" y2="130" stroke="#22c55e" strokeWidth="3" className="side-b"/>
    <line x1="20" y1="20" x2="20" y2="130" stroke="#3b82f6" strokeWidth="3" className="side-a"/>
    <line x1="20" y1="20" x2="160" y2="130" stroke="#f97316" strokeWidth="3" className="side-c"/>
    <polyline points="20,110 40,110 40,130" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.7"/>
    <text x="8"   y="80"  fill="#60a5fa" fontSize="14" fontWeight="bold">a</text>
    <text x="87"  y="148" fill="#4ade80" fontSize="14" fontWeight="bold">b</text>
    <text x="100" y="75"  fill="#fb923c" fontSize="14" fontWeight="bold">c</text>
    <text x="20"  y="13"  fill="#94a3b8" fontSize="9">A</text>
    <text x="162" y="134" fill="#94a3b8" fontSize="9">B</text>
    <text x="8"   y="134" fill="#94a3b8" fontSize="9">C</text>
    <text x="44"  y="126" fill="var(--icon-color)" fontSize="8" opacity="0.6">90°</text>
  </svg>
);

/* ── SVG: Three variations of the Pythagoras formula ── */
const RumusVariasiSVG = () => (
  <svg viewBox="0 0 340 230" className="w-full max-w-sm mx-auto my-2" aria-label="Variasi rumus Pythagoras">
    <defs>
      <style>{`
        @keyframes pulse2{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .p1{animation:pulse2 2s ease-in-out infinite;}
        .p2{animation:pulse2 2s ease-in-out infinite 0.7s;}
        .p3{animation:pulse2 2s ease-in-out infinite 1.4s;}
      `}</style>
    </defs>
    <g transform="translate(10,10)">
      <polygon points="10,100 90,100 10,20" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1.5"/>
      <polyline points="10,82 28,82 28,100" fill="none" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6"/>
      <text x="8"  y="15"  fill="#60a5fa" fontSize="9" fontFamily="monospace">a=3</text>
      <text x="47" y="112" fill="#4ade80" fontSize="9" fontFamily="monospace">b=4</text>
      <text x="55" y="55"  fill="#fb923c" fontSize="9" fontFamily="monospace" className="p1">c=?</text>
      <text x="5"  y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">Cari c (hipotenusa)</text>
      <text x="5"  y="135" fill="#eab308" fontSize="8" fontFamily="monospace">c=√(a²+b²)</text>
    </g>
    <line x1="115" y1="10" x2="115" y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
    <g transform="translate(125,10)">
      <polygon points="10,100 90,100 10,20" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
      <polyline points="10,82 28,82 28,100" fill="none" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6"/>
      <text x="8"  y="15"  fill="#60a5fa" fontSize="9" fontFamily="monospace" className="p2">a=?</text>
      <text x="47" y="112" fill="#4ade80" fontSize="9" fontFamily="monospace">b=4</text>
      <text x="55" y="55"  fill="#fb923c" fontSize="9" fontFamily="monospace">c=5</text>
      <text x="5"  y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">Cari a (kaki)</text>
      <text x="5"  y="135" fill="#eab308" fontSize="8" fontFamily="monospace">a=√(c²-b²)</text>
    </g>
    <line x1="230" y1="10" x2="230" y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
    <g transform="translate(240,10)">
      <polygon points="10,100 90,100 10,20" fill="rgba(249,115,22,0.2)" stroke="#f97316" strokeWidth="1.5"/>
      <polyline points="10,82 28,82 28,100" fill="none" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6"/>
      <text x="8"  y="15"  fill="#60a5fa" fontSize="9" fontFamily="monospace">a=3</text>
      <text x="47" y="112" fill="#4ade80" fontSize="9" fontFamily="monospace" className="p3">b=?</text>
      <text x="55" y="55"  fill="#fb923c" fontSize="9" fontFamily="monospace">c=5</text>
      <text x="5"  y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">Cari b (kaki)</text>
      <text x="5"  y="135" fill="#eab308" fontSize="8" fontFamily="monospace">b=√(c²-a²)</text>
    </g>
    <rect x="10" y="170" width="320" height="50" rx="8" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1"/>
    <text x="170" y="187" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">TIGA VARIASI RUMUS PYTHAGORAS</text>
    <text x="60"  y="205" fill="#fb923c" fontSize="8" textAnchor="middle" fontFamily="monospace">c = √(a²+b²)</text>
    <text x="170" y="205" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="monospace">a = √(c²-b²)</text>
    <text x="282" y="205" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace">b = √(c²-a²)</text>
  </svg>
);

/* ── Bar chart SVG for calculation visualisation ── */
const HitungSVG = ({ a, b, c, cari }: { a: number; b: number; c: number; cari: "a"|"b"|"c" }) => {
  const maxVal = Math.max(a*a, b*b, c*c);
  const scale  = 260 / maxVal;
  return (
    <svg viewBox="0 0 300 120" className="w-full max-w-sm mx-auto" aria-label="Visualisasi perhitungan">
      <rect x="20" y="15" width={a*a*scale} height="18" rx="4" fill={cari==="c"?"#3b82f6":"#3b82f690"}/>
      <text x="20" y="42" fill="#60a5fa" fontSize="9" fontFamily="monospace">a² = {a}² = {a*a}</text>
      <rect x="20" y="50" width={b*b*scale} height="18" rx="4" fill={cari==="c"?"#22c55e":"#22c55e90"}/>
      <text x="20" y="77" fill="#4ade80" fontSize="9" fontFamily="monospace">b² = {b}² = {b*b}</text>
      <rect x="20" y="85" width={c*c*scale} height="18" rx="4" fill={(cari==="a"||cari==="b")?"#f97316":"#f9731690"}/>
      <text x="20" y="112" fill="#fb923c" fontSize="9" fontFamily="monospace">c² = {c}² = {c*c}</text>
      <text x={a*a*scale + b*b*scale + 25} y="58" fill="#eab308" fontSize="14" fontFamily="monospace">✓</text>
    </svg>
  );
};

/* ── Small right-triangle SVG used in Contoh 1 ── */
const MiniTriangle = ({
  a, b, c,
  labelA, labelB, labelC,
  colorA = "#60a5fa", colorB = "#4ade80", colorC = "#fb923c",
  question,
}: {
  a: number; b: number; c: number;
  labelA: string; labelB: string; labelC: string;
  colorA?: string; colorB?: string; colorC?: string;
  question?: string;
}) => {
  const scale = 100 / Math.max(a, b);
  const W = b * scale, H = a * scale;
  const vw = W + 60, vh = H + 60;
  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full max-w-[220px] mx-auto" aria-label="Segitiga">
      {question && (
        <text x={vw / 2} y="14" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">{question}</text>
      )}
      {/* triangle: right angle at bottom-left */}
      <polygon
        points={`30,${H + 24} ${W + 30},${H + 24} 30,24`}
        fill="rgba(59,130,246,0.12)"
        stroke="none"
      />
      {/* vertical leg (a) */}
      <line x1="30" y1="24" x2="30" y2={H + 24} stroke={colorA} strokeWidth="2.5"/>
      {/* horizontal leg (b) */}
      <line x1="30" y1={H + 24} x2={W + 30} y2={H + 24} stroke={colorB} strokeWidth="2.5"/>
      {/* hypotenuse (c) */}
      <line x1="30" y1="24" x2={W + 30} y2={H + 24} stroke={colorC} strokeWidth="2.5"/>
      {/* right angle mark */}
      <polyline points={`30,${H + 14} 40,${H + 14} 40,${H + 24}`} fill="none" stroke="#94a3b8" strokeWidth="1.2"/>
      {/* labels */}
      <text x="18"         y={H / 2 + 28}  fill={colorA} fontSize="12" fontWeight="bold" textAnchor="middle">{labelA}</text>
      <text x={W / 2 + 30} y={H + 42}      fill={colorB} fontSize="12" fontWeight="bold" textAnchor="middle">{labelB}</text>
      <text x={W / 2 + 38} y={H / 2 + 16}  fill={colorC} fontSize="12" fontWeight="bold" textAnchor="middle">{labelC}</text>
    </svg>
  );
};

const PembuktianPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "animasi", "rearrangement", "pembuktian", "contoh1", "contoh2", "contoh3", "mhg_intro", "mhg_prosedur", "mhg_c1", "mhg_c2", "mhg_c3", "rangkuman", "kuadrat"]);

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
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center leading-snug">
          PEMBUKTIAN TEOREMA PYTHAGORAS DAN MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Teorema Pythagoras · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══ INTRO — PALING ATAS ══ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Selamat Datang di Dunia Teorema Pythagoras!"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Lebih dari 2.500 tahun lalu, seorang matematikawan Yunani bernama <strong className="text-cyan-300">Pythagoras</strong> menemukan sebuah pola yang luar biasa di setiap segitiga siku-siku. Hubungan antar sisi-sisinya selalu berlaku, tanpa terkecuali! Inilah yang kita kenal sebagai <strong className="text-yellow-300">Teorema Pythagoras</strong> — salah satu rumus paling terkenal di dunia matematika.
                </p>

                {/* Kegunaan Teorema Pythagoras */}
                <div className="bg-slate-800/70 border border-slate-600/50 rounded-xl p-4 space-y-3">
                  <p className="text-yellow-300 font-semibold text-sm">🏗️ Kegunaan Teorema Pythagoras dalam Kehidupan Nyata</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Teorema Pythagoras bukan sekadar rumus di buku teks — ia dipakai setiap hari oleh para profesional di berbagai bidang:
                  </p>
                  <ul className="space-y-2 font-body text-sm text-white/75">
                    <li className="flex gap-2">
                      <span className="text-orange-400 shrink-0">🏗️</span>
                      <span><strong className="text-orange-300">Konstruksi & Arsitektur</strong> — Seperti terlihat pada gambar di bawah, para pekerja bangunan menggunakan Teorema Pythagoras untuk memastikan sudut bangunan benar-benar 90° (siku-siku), mengukur diagonal pondasi, dan menghitung panjang rangka atap secara presisi.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">🗺️</span>
                      <span><strong className="text-cyan-300">Navigasi & Pemetaan</strong> — Menentukan jarak terpendek antara dua titik di peta, digunakan pada GPS dan sistem navigasi kapal maupun pesawat.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400 shrink-0">📡</span>
                      <span><strong className="text-green-300">Teknologi & Sinyal</strong> — Menghitung jangkauan sinyal antena, jarak antar menara telekomunikasi, dan posisi satelit.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-400 shrink-0">🎮</span>
                      <span><strong className="text-purple-300">Game & Grafis Komputer</strong> — Menghitung jarak antar objek dalam ruang 2D dan 3D, dipakai dalam rendering dan deteksi tabrakan (collision detection).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-pink-400 shrink-0">⚕️</span>
                      <span><strong className="text-pink-300">Kedokteran & Imaging</strong> — Digunakan dalam pemrosesan gambar medis seperti CT scan dan MRI untuk menghitung jarak dan ukuran organ.</span>
                    </li>
                  </ul>

                  {/* Gambar Konstruksi */}
                  <figure className="rounded-xl overflow-hidden border border-yellow-500/30 bg-slate-900/60">
                    <img
                      src="/pythagoras-construction.png"
                      alt="Pekerja konstruksi menggunakan Teorema Pythagoras di lapangan"
                      className="w-full object-contain"
                    />
                    <figcaption className="text-center text-white/40 text-xs py-2 px-3 font-body italic">
                      bing.com/images/create
                    </figcaption>
                  </figure>

                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 mt-2">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Fakta Menarik:</strong> Teknik "<em>3-4-5</em>" yang dipakai tukang bangunan untuk memastikan sudut siku-siku adalah penerapan langsung Teorema Pythagoras (3² + 4² = 5²) — digunakan sejak zaman Mesir Kuno!
                    </p>
                  </div>
                </div>

                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-cyan-300 font-semibold text-sm mb-3">🔭 Rumus Inti Teorema Pythagoras</p>
                  <SegitigaSikuSVG/>
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

                  {/* Dua variasi rumus lain */}
                  <div className="mt-4 space-y-2">
                    <p className="text-cyan-300/70 text-xs font-body font-semibold uppercase tracking-wide">🔄 Variasi Rumus — Mencari Sisi Lain</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-3 space-y-1">
                        <p className="text-blue-300 text-xs font-body font-semibold">Mencari sisi tegak <InlineMath math="a"/></p>
                        <p className="text-white/50 text-xs font-body">Jika <InlineMath math="b"/> dan <InlineMath math="c"/> diketahui:</p>
                        <div className="bg-slate-900/60 rounded-lg px-3 py-1">
                          <BlockMath math="a^2 = c^2 - b^2"/>
                        </div>
                      </div>
                      <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-3 space-y-1">
                        <p className="text-green-300 text-xs font-body font-semibold">Mencari sisi alas <InlineMath math="b"/></p>
                        <p className="text-white/50 text-xs font-body">Jika <InlineMath math="a"/> dan <InlineMath math="c"/> diketahui:</p>
                        <div className="bg-slate-900/60 rounded-lg px-3 py-1">
                          <BlockMath math="b^2 = c^2 - a^2"/>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-700/40 border border-slate-600/40 rounded-lg p-2 mt-1">
                      <p className="text-white/50 text-xs font-body text-center">
                        💡 Ketiga rumus ini berasal dari <strong className="text-yellow-300">persamaan yang sama</strong> — hanya dipindah-pindah ruas saja!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Ingat!</strong> Huruf <strong className="text-orange-300">c</strong> selalu mewakili sisi miring (hipotenusa) — yaitu sisi yang berhadapan dengan sudut 90°. Ini adalah sisi terpanjang dari segitiga siku-siku.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* VIDEO YOUTUBE */}
          <div className="w-full">
            <p className="text-center font-display font-bold text-white text-base md:text-lg mb-3 tracking-wide">
              📽️ Pembuktian Teorema Pythagoras
            </p>
            <div className="rounded-2xl overflow-hidden border border-cyan-500/40 shadow-lg shadow-cyan-900/30 bg-black">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/COkhrDbNcuA?rel=0&modestbranding=1"
                  title="Pembuktian Teorema Pythagoras"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="text-center text-white/50 text-xs mt-2 font-body">
              oleh{" "}
              <a
                href="https://www.youtube.com/watch?v=vbG_YBTiN38"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
              >
                Elyarch Ltd
              </a>
            </p>
          </div>

          {/* WATER PROOF ANIMATION */}
          <div className="bg-card/80 backdrop-blur border border-cyan-500/40 rounded-2xl overflow-hidden p-4">
            <PythagorasWaterProof />
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

          {/* PEMBUKTIAN VISUAL */}
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

                {/* Fixed square SVG */}
                <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/60">
                  <p className="text-center text-xs text-slate-400 mb-1 font-body">
                    4 segitiga siku-siku identik (biru, hijau, oranye, ungu) membentuk persegi tengah bersisi <strong className="text-yellow-300">c</strong>
                  </p>
                  <PembuktianSVG/>
                </div>

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
                        <p className="font-body text-sm text-white/80">Di dalamnya, susun 4 segitiga siku-siku (kaki <InlineMath math="a"/> dan <InlineMath math="b"/>) sehingga membentuk <strong className="text-yellow-300">persegi sejati bersisi c</strong> di tengah. Total luas 4 segitiga:</p>
                        <div className="mt-1"><BlockMath math="L_{4\triangle} = 4 \times \tfrac{1}{2}ab = 2ab"/></div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="bg-orange-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <div>
                        <p className="font-body text-sm text-white/80">Luas persegi tengah (bersisi <InlineMath math="c"/>) adalah <InlineMath math="c^2"/>. Jadi, luas persegi besar bisa juga ditulis:</p>
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

          {/* ══ CONTOH 1 — 3 segitiga siku-siku ══ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title="✏️ Contoh 1 — Menghitung Panjang Sisi Segitiga Siku-Siku"/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-3">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide">🟢 Tingkat: Dasar</p>
                </div>

                {/* ─── Pertanyaan a ─── */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0">a</span>
                    <p className="font-body text-sm text-white/90 font-semibold">Tentukan panjang sisi miring segitiga berikut!</p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                    <MiniTriangle
                      a={3} b={4} c={5}
                      labelA="3 cm" labelB="4 cm" labelC="c = ?"
                      colorC="#facc15"
                      question="Cari sisi miring (c)"
                    />
                    <p className="font-body text-xs text-slate-300 uppercase tracking-wide font-bold mt-2">📋 Penyelesaian</p>
                    <p className="font-body text-sm text-white/80">Gunakan rumus: <InlineMath math="c^2 = a^2 + b^2"/></p>
                    <BlockMath math="c^2 = 3^2 + 4^2 = 9 + 16 = 25"/>
                    <BlockMath math="c = \sqrt{25} = 5 \text{ cm}"/>
                    <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                      <p className="font-body text-sm text-green-300 text-center font-bold">✅ Panjang sisi miring = <strong>5 cm</strong></p>
                    </div>
                  </div>
                </div>

                {/* ─── Pertanyaan b ─── */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0">b</span>
                    <p className="font-body text-sm text-white/90 font-semibold">Tentukan panjang sisi siku-siku yang belum diketahui!</p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                    <MiniTriangle
                      a={5} b={12} c={13}
                      labelA="a = ?" labelB="12 cm" labelC="13 cm"
                      colorA="#facc15"
                      question="Cari sisi siku-siku (a)"
                    />
                    <p className="font-body text-xs text-slate-300 uppercase tracking-wide font-bold mt-2">📋 Penyelesaian</p>
                    <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="b = 12"/> cm, <InlineMath math="c = 13"/> cm. Gunakan:</p>
                    <BlockMath math="a^2 = c^2 - b^2 = 13^2 - 12^2 = 169 - 144 = 25"/>
                    <BlockMath math="a = \sqrt{25} = 5 \text{ cm}"/>
                    <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm text-yellow-200 text-center font-bold">✅ Panjang sisi siku-siku = <strong>5 cm</strong></p>
                    </div>
                  </div>
                </div>

                {/* ─── Pertanyaan c ─── */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0">c</span>
                    <p className="font-body text-sm text-white/90 font-semibold">Tentukan panjang sisi siku-siku yang belum diketahui!</p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                    <MiniTriangle
                      a={8} b={15} c={17}
                      labelA="8 cm" labelB="b = ?" labelC="17 cm"
                      colorB="#facc15"
                      question="Cari sisi siku-siku (b)"
                    />
                    <p className="font-body text-xs text-slate-300 uppercase tracking-wide font-bold mt-2">📋 Penyelesaian</p>
                    <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="a = 8"/> cm, <InlineMath math="c = 17"/> cm. Gunakan:</p>
                    <BlockMath math="b^2 = c^2 - a^2 = 17^2 - 8^2 = 289 - 64 = 225"/>
                    <BlockMath math="b = \sqrt{225} = 15 \text{ cm}"/>
                    <div className="bg-orange-900/30 border border-orange-500/40 rounded-lg p-3">
                      <p className="font-body text-sm text-orange-200 text-center font-bold">✅ Panjang sisi siku-siku = <strong>15 cm</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══ CONTOH 2 — Jawaban berupa akar ══ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title="✏️ Contoh 2 — Jawaban Berupa Bentuk Akar"/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90 leading-relaxed">
                    Sebuah segitiga siku-siku memiliki sisi tegak <strong>5 cm</strong> dan sisi alas <strong>7 cm</strong>.
                    Tentukan panjang sisi miringnya! Nyatakan dalam bentuk akar paling sederhana.
                  </p>
                </div>

                {/* Gambar segitiga */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-700/60 p-3">
                  <MiniTriangle
                    a={5} b={7} c={0}
                    labelA="5 cm" labelB="7 cm" labelC="c = ?"
                    colorC="#facc15"
                    question="Cari sisi miring (c)"
                  />
                </div>

                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Penyelesaian</p>
                  <p className="font-body text-sm text-white/80">
                    Diketahui: <InlineMath math="a = 5"/> cm, <InlineMath math="b = 7"/> cm. Gunakan rumus Pythagoras:
                  </p>
                  <BlockMath math="c^2 = a^2 + b^2 = 5^2 + 7^2"/>
                  <BlockMath math="c^2 = 25 + 49 = 74"/>
                  <BlockMath math="c = \sqrt{74} \text{ cm}"/>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="font-body text-sm text-white/70 mb-1">
                      💡 Apakah <InlineMath math="\sqrt{74}"/> bisa disederhanakan?
                    </p>
                    <p className="font-body text-sm text-white/70">
                      Faktorisasi: <InlineMath math="74 = 2 \times 37"/>. Tidak ada faktor kuadrat sempurna, jadi <InlineMath math="\sqrt{74}"/> sudah dalam bentuk paling sederhana.
                    </p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="\boxed{c = \sqrt{74} \approx 8{,}60 \text{ cm}}"/>
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">
                      ✅ Panjang sisi miring = <strong><InlineMath math="\sqrt{74}"/></strong> cm ≈ <strong>8,60 cm</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-cyan-200">
                    🔑 <strong>Kunci:</strong> Tidak semua perhitungan Pythagoras menghasilkan bilangan bulat. Ketika hasilnya bukan kuadrat sempurna, nyatakan sebagai bentuk akar <InlineMath math="\sqrt{n}"/> dan sederhanakan semaksimal mungkin.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ══ CONTOH 3 — Aplikasi: Kapal Laut ══ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title="✏️ Contoh 3 — Aplikasi: Pelayaran Kapal Laut"/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Aplikasi</p>
                  <p className="font-body text-sm text-white/90 leading-relaxed">
                    Sebuah kapal laut bertolak dari Pelabuhan A. Kapal tersebut berlayar ke arah <strong>Timur sejauh 8 km</strong>, lalu berbelok ke arah <strong>Utara sejauh 15 km</strong> hingga tiba di Pelabuhan B. Berapa jarak terpendek (lurus) dari Pelabuhan A ke Pelabuhan B?
                  </p>
                </div>

                {/* Ilustrasi jalur kapal */}
                <div className="bg-slate-900/60 rounded-xl border border-slate-700/60 p-4">
                  <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto" aria-label="Ilustrasi jalur kapal laut">
                    {/* laut */}
                    <rect x="0" y="0" width="280" height="200" fill="#0f172a" rx="8"/>
                    {/* grid ringan */}
                    {[40,80,120,160,200,240].map(x => (
                      <line key={x} x1={x} y1="10" x2={x} y2="190" stroke="#1e3a5f" strokeWidth="0.5"/>
                    ))}
                    {[40,80,120,160].map(y => (
                      <line key={y} x1="10" y1={y} x2="270" y2={y} stroke="#1e3a5f" strokeWidth="0.5"/>
                    ))}

                    {/* Jalur Timur: A→C (horizontal ke kanan) */}
                    <line x1="40" y1="160" x2="200" y2="160" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="6 3"/>
                    {/* Jalur Utara: C→B (vertikal ke atas) */}
                    <line x1="200" y1="160" x2="200" y2="40" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="6 3"/>
                    {/* Jarak lurus: A→B */}
                    <line x1="40" y1="160" x2="200" y2="40" stroke="#f97316" strokeWidth="2.5"/>

                    {/* Sudut siku-siku di C */}
                    <polyline points="190,160 190,150 200,150" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>

                    {/* Pelabuhan A */}
                    <circle cx="40" cy="160" r="5" fill="#facc15"/>
                    <text x="24" y="176" fill="#facc15" fontSize="12" fontWeight="bold">A</text>

                    {/* Titik belok C */}
                    <circle cx="200" cy="160" r="4" fill="#94a3b8"/>
                    <text x="206" y="176" fill="#94a3b8" fontSize="11">C</text>

                    {/* Pelabuhan B */}
                    <circle cx="200" cy="40" r="5" fill="#facc15"/>
                    <text x="208" y="38" fill="#facc15" fontSize="12" fontWeight="bold">B</text>

                    {/* Label jarak */}
                    <text x="112" y="175" fill="#4ade80" fontSize="11" fontWeight="bold" textAnchor="middle">8 km</text>
                    <text x="216" y="104" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="start">15 km</text>
                    <text x="100"  y="88"  fill="#fb923c" fontSize="11" fontWeight="bold" textAnchor="middle">d = ?</text>

                    {/* Arah mata angin */}
                    <text x="248" y="26" fill="#94a3b8" fontSize="9">U</text>
                    <line x1="252" y1="28" x2="252" y2="50" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arrow)"/>
                  </svg>
                  <p className="text-center text-xs text-slate-400 mt-2 font-body">Jalur kapal: Timur 8 km → Utara 15 km. Jarak langsung A ke B = ?</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Penyelesaian</p>
                  <div className="space-y-1 font-body text-sm text-white/80">
                    <p>• Jarak ke Timur (AC) = <InlineMath math="b = 8"/> km</p>
                    <p>• Jarak ke Utara (CB) = <InlineMath math="a = 15"/> km</p>
                    <p>• Sudut di C = 90° → berlaku Teorema Pythagoras</p>
                  </div>
                  <p className="font-body text-sm text-white/80 mt-1">Hitung jarak lurus A ke B:</p>
                  <BlockMath math="d^2 = a^2 + b^2 = 15^2 + 8^2"/>
                  <BlockMath math="d^2 = 225 + 64 = 289"/>
                  <BlockMath math="d = \sqrt{289} = 17 \text{ km}"/>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="\boxed{d = 17 \text{ km}}"/>
                    <p className="font-body text-sm text-red-200 text-center mt-1">
                      ✅ Jarak terpendek dari Pelabuhan A ke Pelabuhan B adalah <strong>17 km</strong>.
                    </p>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-cyan-200">
                    🚢 <strong>Pesan:</strong> Teorema Pythagoras sangat berguna dalam navigasi pelayaran dan penerbangan untuk menghitung jarak terpendek antar dua titik ketika rute aktual membentuk sudut siku-siku.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════
               BAGIAN 2: MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU
              ══════════════════════════════════════════════════════ */}
          <div className="border-t-2 border-cyan-500/40 pt-2">
            <div className="flex items-center gap-3 px-1 mb-4">
              <Ruler className="w-6 h-6 text-cyan-400 shrink-0"/>
              <p className="font-display text-base md:text-lg font-bold text-cyan-300">
                MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU
              </p>
            </div>
          </div>

          {/* MHG INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="mhg_intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Tiga Skenario Berbeda"/>
            {open.includes("mhg_intro") && (
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

          {/* MHG PROSEDUR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="mhg_prosedur" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title="📐 Prosedur Menghitung Langkah demi Langkah"/>
            {open.includes("mhg_prosedur") && (
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

          {/* MHG CONTOH 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="mhg_c1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title="✏️ Contoh 4 — Mencari Hipotenusa (Mudah)"/>
            {open.includes("mhg_c1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah tangga disandarkan ke dinding. Kaki tangga berjarak <strong>6 m</strong> dari dinding, dan tinggi tembok yang dijangkau tangga adalah <strong>8 m</strong>. Berapa panjang tangga tersebut?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="a = 6"/> m, <InlineMath math="b = 8"/> m. Dicari: <InlineMath math="c"/> (panjang tangga).</p>
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

          {/* MHG CONTOH 5 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="mhg_c2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title="✏️ Contoh 5 — Mencari Salah Satu Kaki (Sedang)"/>
            {open.includes("mhg_c2") && (
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

          {/* MHG CONTOH 6 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="mhg_c3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title="✏️ Contoh 6 — Hasil Bentuk Akar (Sulit)"/>
            {open.includes("mhg_c3") && (
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
                  <p className="font-body text-xs font-bold text-violet-300 uppercase mb-1">📐 Pembuktian</p>
                  <p className="font-body text-sm text-white/80">• Teorema Pythagoras berlaku di <strong className="text-cyan-300">setiap segitiga siku-siku</strong>.</p>
                  <p className="font-body text-sm text-white/80">• Rumus dasar: <InlineMath math="a^2 + b^2 = c^2"/> di mana <InlineMath math="c"/> adalah hipotenusa.</p>
                  <p className="font-body text-sm text-white/80">• Dibuktikan secara visual dengan <strong className="text-yellow-300">metode susunan persegi</strong> (4 segitiga identik dalam persegi besar).</p>
                  <div className="border-t border-violet-500/20 pt-2 mt-2"/>
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-1">📏 Menghitung Panjang Sisi</p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">Mencari c:</strong> <InlineMath math="c = \sqrt{a^2 + b^2}"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-blue-300">Mencari a:</strong> <InlineMath math="a = \sqrt{c^2 - b^2}"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-green-300">Mencari b:</strong> <InlineMath math="b = \sqrt{c^2 - a^2}"/></p>
                  <p className="font-body text-sm text-white/80">• Jawaban bisa berupa <strong className="text-cyan-300">bilangan bulat</strong> atau <strong className="text-yellow-300">bentuk akar</strong> — sederhanakan dengan mencari faktor kuadrat sempurna terbesar.</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Teorema Pythagoras digunakan bahkan dalam navigasi satelit dan GPS! Tanpa Pythagoras, kita tidak bisa menghitung jarak antar titik di ruang angkasa.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* HAFAL BILANGAN KUADRAT 1–30 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="kuadrat" icon={<Target className="w-5 h-5"/>} iconColor="text-yellow-400" title="⚡ Hafal Bilangan Kuadrat 1–30"/>
            {open.includes("kuadrat") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-yellow-300">🎯 Mengapa Harus Dihafal?</p>
                  <p className="font-body text-sm text-white/80">
                    Dalam soal Teorema Pythagoras, kita sering harus <strong className="text-cyan-300">mencari sisi yang tidak diketahui</strong> dengan cara mengakarkan bilangan.
                    Jika kamu hafal bilangan kuadrat 1–30, kamu bisa langsung tahu hasil akarnya <strong className="text-yellow-300">tanpa kalkulator</strong>!
                  </p>
                  <p className="font-body text-sm text-white/80">
                    Contoh: jika <InlineMath math="c^2 = 169"/>, kamu langsung tahu <InlineMath math="c = 13"/> karena hafal <InlineMath math="13^2 = 169"/>. ✅
                  </p>
                  <p className="font-body text-sm text-white/80">
                    Manfaat lain: mempercepat perhitungan <strong className="text-pink-300">Triple Pythagoras</strong>, soal ANBK, UN, dan olimpiade matematika.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-body text-xs font-bold text-sky-300 mb-2">🔵 Kelompok 1 — Bilangan 1 sampai 10</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <div key={n} className="bg-sky-900/40 border border-sky-600/40 rounded-lg p-2 text-center">
                        <p className="text-sky-300 font-bold font-mono text-xs">{n}²</p>
                        <p className="text-white font-bold font-mono text-sm">{n*n}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-body text-xs font-bold text-emerald-300 mb-2">🟢 Kelompok 2 — Bilangan 11 sampai 20</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[11,12,13,14,15,16,17,18,19,20].map(n => (
                      <div key={n} className="bg-emerald-900/40 border border-emerald-600/40 rounded-lg p-2 text-center">
                        <p className="text-emerald-300 font-bold font-mono text-xs">{n}²</p>
                        <p className="text-white font-bold font-mono text-sm">{n*n}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-body text-xs font-bold text-orange-300 mb-2">🟠 Kelompok 3 — Bilangan 21 sampai 30</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[21,22,23,24,25,26,27,28,29,30].map(n => (
                      <div key={n} className="bg-orange-900/40 border border-orange-600/40 rounded-lg p-2 text-center">
                        <p className="text-orange-300 font-bold font-mono text-xs">{n}²</p>
                        <p className="text-white font-bold font-mono text-sm">{n*n}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">🔍 Pola Menarik Bilangan Kuadrat</p>
                  <ul className="space-y-1.5 font-body text-sm text-white/80">
                    <li>• Bilangan kuadrat <strong className="text-yellow-300">hanya berakhiran 0, 1, 4, 5, 6, atau 9</strong> — tidak pernah 2, 3, 7, atau 8.</li>
                    <li>• Bilangan yang berakhiran <strong className="text-sky-300">5</strong>, kuadratnya selalu berakhiran <strong className="text-sky-300">25</strong>. Contoh: 5²=25, 15²=225, 25²=625.</li>
                    <li>• Selisih dua bilangan kuadrat berurutan selalu ganjil: <InlineMath math="(n+1)^2 - n^2 = 2n+1"/>.</li>
                    <li>• Contoh: 10²=100, 11²=121, selisihnya = 21 = 2×10+1. ✅</li>
                  </ul>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-cyan-200">
                    🚀 <strong>Tips Hafal Cepat:</strong> Mulai dari kelompok 1 (1–10), hafalkan dulu sampai lancar. Lanjut kelompok 2 (11–20), perhatikan polanya. Kelompok 3 (21–30) lebih mudah jika kamu sudah paham pola selisihnya.
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
