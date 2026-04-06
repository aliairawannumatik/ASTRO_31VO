import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ─────────────────────────────────────────────
   ANIMATED SVG: KELILING BANGUN TAK BERATURAN
   (bentuk huruf L — perimeter blink/glow)
───────────────────────────────────────────── */
const KelilingAnimatedSVG = () => (
  <svg viewBox="0 0 340 260" className="w-full max-w-sm mx-auto my-3" aria-label="Animasi keliling bangun tak beraturan berbentuk huruf L">
    <defs>
      <style>{`
        @keyframes periGlow {
          0%   { stroke-opacity: 1;   filter: drop-shadow(0 0 6px #22d3ee); }
          50%  { stroke-opacity: 0.25; filter: drop-shadow(0 0 0px #22d3ee); }
          100% { stroke-opacity: 1;   filter: drop-shadow(0 0 6px #22d3ee); }
        }
        .peri-anim {
          animation: periGlow 1.6s ease-in-out infinite;
        }
        @keyframes labelPop {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        .label-anim { animation: labelPop 1.6s ease-in-out infinite; }
      `}</style>
    </defs>

    {/* Grid background */}
    {[0,1,2,3,4,5,6].map(i => (
      <line key={`gh${i}`} x1="30" y1={30+i*34} x2="310" y2={30+i*34} stroke="#1e293b" strokeWidth="0.7"/>
    ))}
    {[0,1,2,3,4,5,6,7,8].map(i => (
      <line key={`gv${i}`} x1={30+i*35} y1="30" x2={30+i*35} y2={30+6*34} stroke="#1e293b" strokeWidth="0.7"/>
    ))}

    {/* L-shape fill (muted) */}
    <polygon
      points="30,30 170,30 170,98 310,98 310,234 30,234"
      fill="rgba(30,41,59,0.7)"
      stroke="none"
    />

    {/* ANIMATED PERIMETER */}
    <polygon
      points="30,30 170,30 170,98 310,98 310,234 30,234"
      fill="none"
      stroke="#22d3ee"
      strokeWidth="3.5"
      strokeLinejoin="round"
      className="peri-anim"
    />

    {/* Vertex dots */}
    {[[30,30],[170,30],[170,98],[310,98],[310,234],[30,234]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="5" fill="#22d3ee" opacity="0.85"/>
    ))}

    {/* Side labels */}
    <text x="100" y="22" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" className="label-anim">a</text>
    <text x="178" y="68" fill="#facc15" fontSize="12" fontFamily="monospace" className="label-anim">b</text>
    <text x="240" y="91" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" className="label-anim">c</text>
    <text x="318" y="166" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" className="label-anim">d</text>
    <text x="170" y="248" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" className="label-anim">e</text>
    <text x="22" y="136" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" className="label-anim">f</text>

    {/* Legend */}
    <rect x="30" y="245" width="280" height="18" rx="4" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="0.8"/>
    <text x="170" y="257" fill="#22d3ee" fontSize="10" fontFamily="monospace" textAnchor="middle">K = a + b + c + d + e + f  ← semua sisi bersinar!</text>
  </svg>
);

/* ─────────────────────────────────────────────
   ANIMATED SVG: LUAS BANGUN TAK BERATURAN
   (same L-shape — fill area pulses)
───────────────────────────────────────────── */
const LuasAnimatedSVG = () => (
  <svg viewBox="0 0 340 270" className="w-full max-w-sm mx-auto my-3" aria-label="Animasi luas bangun tak beraturan — bagian isi berkedip">
    <defs>
      <style>{`
        @keyframes areaGlow {
          0%   { fill-opacity: 0.55; }
          50%  { fill-opacity: 0.12; }
          100% { fill-opacity: 0.55; }
        }
        .area-anim { animation: areaGlow 1.8s ease-in-out infinite; }
        @keyframes decompLine {
          0%, 100% { opacity: 0.9; }
          50%       { opacity: 0.3; }
        }
        .decomp-anim { animation: decompLine 1.8s ease-in-out infinite; }
      `}</style>
    </defs>

    {/* Grid */}
    {[0,1,2,3,4,5,6].map(i => (
      <line key={`gh${i}`} x1="30" y1={30+i*34} x2="310" y2={30+i*34} stroke="#1e293b" strokeWidth="0.7"/>
    ))}
    {[0,1,2,3,4,5,6,7,8].map(i => (
      <line key={`gv${i}`} x1={30+i*35} y1="30" x2={30+i*35} y2={30+6*34} stroke="#1e293b" strokeWidth="0.7"/>
    ))}

    {/* PULSING FILL — Top rectangle (Bagian I) */}
    <rect x="30" y="30" width="140" height="68" fill="#4ade80" className="area-anim" rx="2"/>
    {/* PULSING FILL — Bottom rectangle (Bagian II) */}
    <rect x="30" y="98" width="280" height="136" fill="#22d3ee" className="area-anim" rx="2"/>

    {/* Outline (static) */}
    <polygon
      points="30,30 170,30 170,98 310,98 310,234 30,234"
      fill="none"
      stroke="#e2e8f0"
      strokeWidth="2"
      strokeLinejoin="round"
      opacity="0.6"
    />

    {/* Decomposition divider */}
    <line x1="30" y1="98" x2="170" y2="98" stroke="#facc15" strokeWidth="2" strokeDasharray="6,3" className="decomp-anim"/>

    {/* Labels for each region */}
    <text x="100" y="70" fill="#052e16" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Bagian I</text>
    <text x="170" y="172" fill="#083344" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Bagian II</text>

    {/* Dimension annotations */}
    <text x="100" y="22" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">4 sat</text>
    <text x="2"  y="68" fill="#4ade80" fontSize="10" fontFamily="monospace">2</text>
    <text x="170" y="22" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">…</text>
    <text x="240" y="91" fill="#22d3ee" fontSize="11" fontFamily="monospace" textAnchor="middle">4 sat</text>
    <text x="316" y="170" fill="#22d3ee" fontSize="10" fontFamily="monospace">4</text>

    {/* Formula chips */}
    <rect x="30" y="242" width="130" height="22" rx="4" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="1"/>
    <text x="95" y="256" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle">L₁ = p₁ × l₁</text>
    <rect x="175" y="242" width="130" height="22" rx="4" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
    <text x="240" y="256" fill="#22d3ee" fontSize="10" fontFamily="monospace" textAnchor="middle">L₂ = p₂ × l₂</text>
  </svg>
);

/* ─────────────────────────────────────────────
   ANIMATED SVG: CONTOH MUDAH — Keliling
   (Bangun L sederhana, sisi terlabel, blink)
───────────────────────────────────────────── */
const ContohKelilingMudahSVG = () => (
  <svg viewBox="0 0 300 220" className="w-full max-w-xs mx-auto my-2" aria-label="Contoh keliling bangun L mudah">
    <defs>
      <style>{`
        @keyframes pm1 { 0%,100%{stroke-opacity:1;} 50%{stroke-opacity:0.2;} }
        .pm1{animation:pm1 1.5s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* L-shape */}
    <polygon points="20,20 140,20 140,80 260,80 260,200 20,200" fill="rgba(34,211,238,0.07)" stroke="none"/>
    <polygon points="20,20 140,20 140,80 260,80 260,200 20,200"
      fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinejoin="round" className="pm1"/>
    {/* Dots */}
    {[[20,20],[140,20],[140,80],[260,80],[260,200],[20,200]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="4" fill="#22d3ee" opacity="0.8"/>
    ))}
    {/* Side labels */}
    <text x="80" y="14" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="148" y="54" fill="#facc15" fontSize="11" fontFamily="monospace">3 cm</text>
    <text x="200" y="74" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="268" y="144" fill="#facc15" fontSize="11" fontFamily="monospace">6 cm</text>
    <text x="140" y="215" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">12 cm</text>
    <text x="2" y="114" fill="#facc15" fontSize="11" fontFamily="monospace">9 cm</text>
  </svg>
);

/* CONTOH SEDANG — Keliling (bangun U/rumah) */
const ContohKelilingSedangSVG = () => (
  <svg viewBox="0 0 320 230" className="w-full max-w-xs mx-auto my-2" aria-label="Contoh keliling bangun U sedang">
    <defs>
      <style>{`
        @keyframes pm2{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.2;}}
        .pm2{animation:pm2 1.5s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* U-shape: outer rect minus inner top center */}
    {/* Polygon: outer from (20,20) around, with inner notch at top */}
    <polygon
      points="20,20 120,20 120,80 200,80 200,20 300,20 300,210 20,210"
      fill="rgba(167,139,250,0.07)"
      stroke="none"
    />
    <polygon
      points="20,20 120,20 120,80 200,80 200,20 300,20 300,210 20,210"
      fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinejoin="round" className="pm2"
    />
    {/* Vertex dots */}
    {[[20,20],[120,20],[120,80],[200,80],[200,20],[300,20],[300,210],[20,210]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="4" fill="#a78bfa" opacity="0.85"/>
    ))}
    {/* Side labels */}
    <text x="70"  y="14" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">5 cm</text>
    <text x="128" y="54" fill="#facc15" fontSize="10" fontFamily="monospace">3 cm</text>
    <text x="160" y="74" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">4 cm</text>
    <text x="208" y="54" fill="#facc15" fontSize="10" fontFamily="monospace">3 cm</text>
    <text x="250" y="14" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">5 cm</text>
    <text x="308" y="118" fill="#facc15" fontSize="10" fontFamily="monospace">9,5 cm</text>
    <text x="160" y="224" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">14 cm</text>
    <text x="2"   y="118" fill="#facc15" fontSize="10" fontFamily="monospace">9,5 cm</text>
  </svg>
);

/* CONTOH SULIT — Keliling (bangun tak beraturan 7 sisi) */
const ContohKelilingSulitSVG = () => (
  <svg viewBox="0 0 320 240" className="w-full max-w-xs mx-auto my-2" aria-label="Contoh keliling bangun tak beraturan 7 sisi sulit">
    <defs>
      <style>{`
        @keyframes pm3{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #f87171);}50%{stroke-opacity:0.25;filter:drop-shadow(0 0 0px #f87171);}}
        .pm3{animation:pm3 1.5s ease-in-out infinite;}
      `}</style>
    </defs>
    <polygon
      points="80,20 220,20 280,80 280,180 200,220 60,200 20,100"
      fill="rgba(248,113,113,0.07)" stroke="none"
    />
    <polygon
      points="80,20 220,20 280,80 280,180 200,220 60,200 20,100"
      fill="none" stroke="#f87171" strokeWidth="3" strokeLinejoin="round" className="pm3"
    />
    {/* Dots */}
    {[[80,20],[220,20],[280,80],[280,180],[200,220],[60,200],[20,100]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="4" fill="#f87171" opacity="0.85"/>
    ))}
    {/* Labels */}
    <text x="150" y="14" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">AB=14</text>
    <text x="258" y="52" fill="#facc15" fontSize="10" fontFamily="monospace">BC=8,5</text>
    <text x="286" y="134" fill="#facc15" fontSize="10" fontFamily="monospace">CD=10</text>
    <text x="130" y="222" fill="#facc15" fontSize="10" fontFamily="monospace">DE=15</text>
    <text x="22" y="218" fill="#facc15" fontSize="10" fontFamily="monospace">EF=?</text>
    <text x="4"  y="158" fill="#facc15" fontSize="10" fontFamily="monospace">FG=12</text>
    <text x="22" y="62"  fill="#facc15" fontSize="10" fontFamily="monospace">GA=10,6</text>
    <text x="60" y="108" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">K=?</text>
  </svg>
);

/* ─────────────────────────────────────────────
   ANIMATED SVG: CONTOH LUAS
───────────────────────────────────────────── */
const ContohLuasMudahSVG = () => (
  <svg viewBox="0 0 300 220" className="w-full max-w-xs mx-auto my-2" aria-label="Luas bangun L mudah — dua persegi panjang">
    <defs>
      <style>{`
        @keyframes la1{0%,100%{fill-opacity:0.5;}50%{fill-opacity:0.1;}}
        .la1{animation:la1 1.8s ease-in-out infinite;}
        @keyframes la2{0%,100%{fill-opacity:0.5;}50%{fill-opacity:0.1;}}
        .la2{animation:la2 1.8s ease-in-out infinite 0.4s;}
      `}</style>
    </defs>
    {/* Part I fill (top-left) */}
    <rect x="20" y="20" width="120" height="80" fill="#4ade80" className="la1" rx="2"/>
    {/* Part II fill (bottom full) */}
    <rect x="20" y="100" width="260" height="100" fill="#22d3ee" className="la2" rx="2"/>
    {/* Outline */}
    <polygon points="20,20 140,20 140,100 280,100 280,200 20,200"
      fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.5"/>
    {/* Divider */}
    <line x1="20" y1="100" x2="140" y2="100" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
    {/* Labels */}
    <text x="80" y="14" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="2" y="66" fill="#4ade80" fontSize="10" fontFamily="monospace">4 cm</text>
    <text x="150" y="97" fill="#94a3b8" fontSize="9" fontFamily="monospace">potong di sini</text>
    <text x="80" y="65" fill="#052e16" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₁</text>
    <text x="150" y="155" fill="#083344" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₂</text>
    <text x="150" y="212" fill="#22d3ee" fontSize="11" fontFamily="monospace" textAnchor="middle">13 cm</text>
    <text x="288" y="155" fill="#22d3ee" fontSize="10" fontFamily="monospace">5 cm</text>
  </svg>
);

const ContohLuasSedangSVG = () => (
  <svg viewBox="0 0 320 240" className="w-full max-w-xs mx-auto my-2" aria-label="Luas bangun L-plus sedang">
    <defs>
      <style>{`
        @keyframes lb1{0%,100%{fill-opacity:0.5;}50%{fill-opacity:0.08;}}
        .lb1{animation:lb1 1.8s ease-in-out infinite;}
        @keyframes lb2{0%,100%{fill-opacity:0.5;}50%{fill-opacity:0.08;}}
        .lb2{animation:lb2 1.8s ease-in-out infinite 0.6s;}
        @keyframes lb3{0%,100%{fill-opacity:0.5;}50%{fill-opacity:0.08;}}
        .lb3{animation:lb3 1.8s ease-in-out infinite 1.2s;}
      `}</style>
    </defs>
    {/* Three-part decomposition */}
    <rect x="20" y="20" width="100" height="200" fill="#fb923c" className="lb1" rx="2"/>
    <rect x="120" y="20" width="80" height="80" fill="#facc15" className="lb2" rx="2"/>
    <rect x="200" y="100" width="100" height="120" fill="#a78bfa" className="lb3" rx="2"/>
    {/* Outline */}
    <polygon points="20,20 200,20 200,100 300,100 300,220 120,220 120,100 20,100"
      fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.5"/>
    {/* Dividers */}
    <line x1="120" y1="20" x2="120" y2="100" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="120" y1="100" x2="200" y2="100" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
    {/* Labels */}
    <text x="70" y="118" fill="#c2410c" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₁</text>
    <text x="160" y="65" fill="#713f12" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₂</text>
    <text x="250" y="165" fill="#4c1d95" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₃</text>
    <text x="70" y="14" fill="#fb923c" fontSize="10" fontFamily="monospace" textAnchor="middle">5 cm</text>
    <text x="160" y="14" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">4 cm</text>
    <text x="308" y="163" fill="#a78bfa" fontSize="10" fontFamily="monospace">5 cm</text>
    <text x="4" y="65" fill="#fb923c" fontSize="10" fontFamily="monospace">10</text>
    <text x="4" y="168" fill="#fb923c" fontSize="9" fontFamily="monospace">cm</text>
  </svg>
);

const ContohLuasSulitSVG = () => (
  <svg viewBox="0 0 320 240" className="w-full max-w-xs mx-auto my-2" aria-label="Luas bangun sembarang sulit">
    <defs>
      <style>{`
        @keyframes lc1{0%,100%{fill-opacity:0.45;}50%{fill-opacity:0.08;}}
        .lc1{animation:lc1 1.8s ease-in-out infinite;}
        @keyframes lc2{0%,100%{fill-opacity:0.45;}50%{fill-opacity:0.08;}}
        .lc2{animation:lc2 1.8s ease-in-out infinite 0.9s;}
      `}</style>
    </defs>
    {/* T-shape: top bar + bottom bar */}
    <rect x="20" y="20" width="280" height="60" fill="#f87171" className="lc1" rx="2"/>
    <rect x="110" y="80" width="100" height="140" fill="#22d3ee" className="lc2" rx="2"/>
    {/* Outline T-shape */}
    <polygon points="20,20 300,20 300,80 210,80 210,220 110,220 110,80 20,80"
      fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.5"/>
    {/* Divider */}
    <line x1="20" y1="80" x2="300" y2="80" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
    {/* Labels */}
    <text x="160" y="56" fill="#7f1d1d" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₁ (Atas)</text>
    <text x="160" y="158" fill="#083344" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₂ (Bawah)</text>
    <text x="160" y="14" fill="#f87171" fontSize="11" fontFamily="monospace" textAnchor="middle">14 cm</text>
    <text x="2" y="54" fill="#f87171" fontSize="10" fontFamily="monospace">3 cm</text>
    <text x="218" y="158" fill="#22d3ee" fontSize="10" fontFamily="monospace">7 cm</text>
    <text x="150" y="232" fill="#22d3ee" fontSize="10" fontFamily="monospace" textAnchor="middle">5 cm</text>
  </svg>
);

/* ─────────────────────────────────────────────
   SECTION DATA
───────────────────────────────────────────── */
type Section = { title: string; icon: string; content: React.ReactNode };

const sections: Section[] = [
  {
    title: "Keliling Bangun Tak Beraturan",
    icon: "📏",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Bangun tak beraturan adalah bangun datar yang sisinya tidak semuanya sama panjang dan tidak punya
          pola simetri yang baku — seperti potongan lahan tanah, denah ruangan berbentuk huruf L atau U,
          atau peta wilayah yang tidak beraturan.
        </p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p className="text-cyan-300 font-semibold">💡 Inti Konsep Keliling Bangun Tak Beraturan</p>
          <p>
            Meskipun bentuknya "tidak standar", cara menghitung kelilingnya tetap sama:
            <strong className="text-yellow-300"> jumlahkan semua sisi yang membentuk bangun tersebut</strong>.
            Sisi-sisi yang bersinar pada ilustrasi di bawah menunjukkan bagian mana yang dihitung!
          </p>
          <div className="bg-cyan-950/70 rounded p-3 text-center">
            <BlockMath math="K = s_1 + s_2 + s_3 + \cdots + s_n" />
          </div>
          <p className="text-white/60 text-xs">Di mana <InlineMath math="s_1, s_2, \ldots, s_n" /> adalah panjang setiap sisi bangun.</p>
        </div>

        <KelilingAnimatedSVG />

        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-slate-300">
          <p className="text-white font-semibold">🔑 Langkah Menghitung Keliling:</p>
          <p>1. <strong className="text-cyan-300">Identifikasi</strong> semua sisi bangun (termasuk sisi yang "tersembunyi" di sudut).</p>
          <p>2. <strong className="text-yellow-300">Ukur atau cari</strong> panjang setiap sisi yang belum diketahui menggunakan hubungan geometris.</p>
          <p>3. <strong className="text-green-300">Jumlahkan</strong> semua sisi yang sudah diketahui.</p>
        </div>

        <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
          📌 <strong>Trik Sisi Tersembunyi:</strong> Pada bangun berbentuk huruf L, ada sisi yang panjangnya tidak langsung tertera.
          Gunakan hubungan: sisi tersembunyi = selisih atau jumlah sisi-sisi yang sejajar dengannya.
        </blockquote>
      </div>
    ),
  },
  {
    title: "Luas Bangun Tak Beraturan",
    icon: "🟦",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Menghitung luas bangun tak beraturan memerlukan sedikit kreativitas —
          kita perlu <strong className="text-green-300">memecah (dekomposisi)</strong> bangun itu menjadi
          beberapa bangun sederhana yang kita sudah tahu rumus luasnya!
        </p>

        <LuasAnimatedSVG />

        <div className="bg-green-950/60 border border-green-700/50 rounded-lg p-4 space-y-2">
          <p className="text-green-300 font-semibold">💡 Dua Strategi Utama:</p>
          <div className="space-y-3">
            <div className="bg-green-950/50 rounded p-3 space-y-1">
              <p className="text-green-300 font-semibold text-xs">① Dekomposisi (Pecah Jadi Bagian)</p>
              <p className="text-white/70 text-xs">Bagi bangun tak beraturan menjadi beberapa persegi panjang, segitiga, atau bangun lain yang sudah dikenal. Hitung luas masing-masing, lalu jumlahkan.</p>
              <div className="bg-green-950/70 rounded p-2 text-center mt-1">
                <BlockMath math="L_{\text{total}} = L_1 + L_2 + L_3 + \cdots" />
              </div>
            </div>
            <div className="bg-cyan-950/50 rounded p-3 space-y-1">
              <p className="text-cyan-300 font-semibold text-xs">② Komplemen (Kurangi dari Bangun Besar)</p>
              <p className="text-white/70 text-xs">Bayangkan bangun tak beraturan sebagai bangun besar dikurangi bagian yang "dipotong". Hitung luas bangun besar, kurangi luas bagian yang dipotong.</p>
              <div className="bg-cyan-950/70 rounded p-2 text-center mt-1">
                <BlockMath math="L_{\text{total}} = L_{\text{besar}} - L_{\text{dipotong}}" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p className="text-white font-semibold">🔑 Langkah Menghitung Luas:</p>
          <p>1. <strong className="text-green-300">Gambarlah garis bantu</strong> untuk memisahkan bangun menjadi bagian-bagian yang lebih sederhana.</p>
          <p>2. <strong className="text-yellow-300">Tentukan dimensi</strong> tiap bagian (panjang, lebar, tinggi, dll.).</p>
          <p>3. <strong className="text-violet-300">Hitung luas</strong> tiap bagian menggunakan rumus yang sesuai.</p>
          <p>4. <strong className="text-cyan-300">Jumlahkan atau kurangkan</strong> sesuai strategi yang dipilih.</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────
   EXAMPLE DATA — KELILING
───────────────────────────────────────────── */
type Example = {
  level: string; color: string; bg: string; border: string; badgeBg: string;
  question: React.ReactNode; answer: React.ReactNode;
};

const kelilingExamples: Example[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30",
    border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>Perhatikan bangun datar berbentuk huruf <strong className="text-cyan-300">L</strong> berikut:</p>
        <ContohKelilingMudahSVG />
        <p>Tentukan keliling bangun tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-green-400">Langkah 1 — Identifikasi semua sisi:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
          <p>• Sisi atas (a) = 6 cm</p>
          <p>• Sisi turun kanan atas (b) = 3 cm</p>
          <p>• Sisi kanan atas mendatar (c) = 6 cm (= 12 − 6)</p>
          <p>• Sisi kanan panjang (d) = 6 cm</p>
          <p>• Sisi bawah (e) = 12 cm</p>
          <p>• Sisi kiri (f) = 9 cm (= 3 + 6)</p>
        </div>
        <p className="text-white/80"><strong className="text-green-400">Langkah 2 — Jumlahkan semua sisi:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="K = 6 + 3 + 6 + 6 + 12 + 9 = 42 \text{ cm}" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Jawaban: Keliling <InlineMath math="= 42 \text{ cm}" /></p>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          💡 Cek sisi tersembunyi: sisi mendatar c = 12 − 6 = 6 cm, sisi tegak f = 3 + 6 = 9 cm ✓
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30",
    border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>Sebuah kolam renang memiliki denah berbentuk huruf <strong className="text-violet-300">U</strong> seperti gambar berikut:</p>
        <ContohKelilingSedangSVG />
        <p>Hitung keliling bangun tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 1 — Daftar semua sisi bangun U:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
          <p>• Sisi kiri atas = 5 cm</p>
          <p>• Sisi turun kiri dalam = 3 cm</p>
          <p>• Sisi mendatar dalam = 4 cm</p>
          <p>• Sisi naik kanan dalam = 3 cm</p>
          <p>• Sisi kanan atas = 5 cm</p>
          <p>• Sisi kanan panjang = 9,5 cm</p>
          <p>• Sisi bawah = 14 cm</p>
          <p>• Sisi kiri panjang = 9,5 cm</p>
        </div>
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 2 — Jumlahkan:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="K = 5 + 3 + 4 + 3 + 5 + 9{,}5 + 14 + 9{,}5" />
          <BlockMath math="K = 53 \text{ cm}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">✅ Jawaban: Keliling <InlineMath math="= 53 \text{ cm}" /></p>
        </div>
        <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
          ✅ Cek: Jumlah sisi kanan + kiri = 9,5 + 9,5 = 19 cm = total tinggi bangun (9,5 + 3 − 3 + 9,5 = 19) ✓
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30",
    border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>Sebuah kavling tanah berbentuk segi-7 tak beraturan dengan ukuran sisi sebagai berikut:</p>
        <ContohKelilingSulitSVG />
        <ul className="list-disc list-inside text-white/80 space-y-0.5 ml-2 text-xs">
          <li><InlineMath math="AB = 14 \text{ m}" /></li>
          <li><InlineMath math="BC = 8{,}5 \text{ m}" /></li>
          <li><InlineMath math="CD = 10 \text{ m}" /></li>
          <li><InlineMath math="DE = 15 \text{ m}" /></li>
          <li><InlineMath math="EF = ?" /> (perlu dihitung)</li>
          <li><InlineMath math="FG = 12 \text{ m}" /></li>
          <li><InlineMath math="GA = 10{,}6 \text{ m}" /></li>
        </ul>
        <p className="text-xs text-white/70 mt-1">Diketahui bahwa <InlineMath math="EF" /> tegak lurus dan berhadapan dengan <InlineMath math="AB" />, serta proyeksi horizontalnya adalah <InlineMath math="4 \text{ m}" /> dan vertikalnya <InlineMath math="7 \text{ m}" />, sehingga <InlineMath math="EF = \sqrt{4^2+7^2}" />.</p>
        <p>Tentukan keliling kavling tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-red-400">Langkah 1 — Hitung sisi EF yang belum diketahui:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="EF = \sqrt{4^2 + 7^2} = \sqrt{16 + 49} = \sqrt{65} \approx 8{,}06 \text{ m}" />
        </div>
        <p className="text-white/80"><strong className="text-red-400">Langkah 2 — Jumlahkan semua sisi:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="K = AB + BC + CD + DE + EF + FG + GA" />
          <BlockMath math="K = 14 + 8{,}5 + 10 + 15 + 8{,}06 + 12 + 10{,}6" />
          <BlockMath math="K = 78{,}16 \text{ m}" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• <InlineMath math="EF = \sqrt{65} \approx 8{,}06 \text{ m}" /></p>
          <p className="text-white/80">• Keliling kavling <InlineMath math="\approx 78{,}16 \text{ m}" /></p>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          🔑 <strong>Kunci:</strong> Sisi yang tidak diketahui bisa ditemukan dengan <strong>Teorema Pythagoras</strong>
          jika kita tahu komponen horizontal dan vertikalnya.
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────
   EXAMPLE DATA — LUAS
───────────────────────────────────────────── */
const luasExamples: Example[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30",
    border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>Hitung luas bangun berbentuk huruf <strong className="text-green-300">L</strong> berikut (bagian yang menyala adalah bagian yang dihitung):</p>
        <ContohLuasMudahSVG />
        <ul className="list-disc list-inside text-white/80 space-y-0.5 ml-2 text-xs">
          <li>Bagian atas (hijau): panjang 6 cm, lebar 4 cm</li>
          <li>Bagian bawah (biru): panjang 13 cm, lebar 5 cm</li>
        </ul>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-green-400">Langkah 1 — Hitung L₁ (bagian atas):</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L_1 = 6 \times 4 = 24 \text{ cm}^2" />
        </div>
        <p className="text-white/80"><strong className="text-green-400">Langkah 2 — Hitung L₂ (bagian bawah):</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L_2 = 13 \times 5 = 65 \text{ cm}^2" />
        </div>
        <p className="text-white/80"><strong className="text-green-400">Langkah 3 — Jumlahkan:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = L_1 + L_2 = 24 + 65 = 89 \text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Jawaban: Luas <InlineMath math="= 89 \text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30",
    border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>Sebuah denah ruangan berbentuk siku-L kompleks dipecah menjadi 3 bagian seperti gambar (perhatikan bagian yang berkedip):</p>
        <ContohLuasSedangSVG />
        <ul className="list-disc list-inside text-white/80 space-y-0.5 ml-2 text-xs">
          <li>Bagian I (oranye): panjang 5 cm, tinggi 10 cm</li>
          <li>Bagian II (kuning): panjang 4 cm, tinggi 4 cm</li>
          <li>Bagian III (ungu): panjang 5 cm, tinggi 5 cm</li>
        </ul>
        <p className="text-xs text-white/70">Hitung total luas denah tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 1 — Hitung setiap bagian:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
          <BlockMath math="L_1 = 5 \times 10 = 50 \text{ cm}^2" />
          <BlockMath math="L_2 = 4 \times 4 = 16 \text{ cm}^2" />
          <BlockMath math="L_3 = 5 \times 5 = 25 \text{ cm}^2" />
        </div>
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 2 — Jumlahkan total luas:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = L_1 + L_2 + L_3 = 50 + 16 + 25 = 91 \text{ cm}^2" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">✅ Jawaban: Luas total <InlineMath math="= 91 \text{ cm}^2" /></p>
        </div>
        <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
          💡 Semakin kompleks bangunnya, semakin banyak bagian yang kita pecah — tapi cara kerjanya tetap sama: hitung luas tiap bagian lalu jumlahkan!
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30",
    border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>
          Sebuah taman berbentuk <strong className="text-red-300">huruf T</strong> akan ditanami rumput dan diberi pagar.
          Perhatikan dua bagian yang berkedip pada gambar:
        </p>
        <ContohLuasSulitSVG />
        <ul className="list-disc list-inside text-white/80 space-y-0.5 ml-2 text-xs">
          <li>Bagian atas (merah): panjang 14 cm, tinggi 3 cm</li>
          <li>Bagian bawah (biru): panjang 5 cm, tinggi 7 cm</li>
        </ul>
        <p className="text-xs text-white/70 mt-1">
          Jika harga rumput <InlineMath math="Rp25.000/\text{cm}^2" /> dan pagar <InlineMath math="Rp8.000/\text{cm}" />,
          berapa total biaya yang dibutuhkan?
        </p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-red-400">Langkah 1 — Hitung luas tiap bagian:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
          <BlockMath math="L_1 = 14 \times 3 = 42 \text{ cm}^2 \quad \text{(bagian atas)}" />
          <BlockMath math="L_2 = 5 \times 7 = 35 \text{ cm}^2 \quad \text{(bagian bawah)}" />
          <BlockMath math="L_{\text{total}} = 42 + 35 = 77 \text{ cm}^2" />
        </div>
        <p className="text-white/80"><strong className="text-red-400">Langkah 2 — Hitung keliling bangun T:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
          <p>Sisi-sisi bangun T (mulai dari pojok kiri atas, searah jarum jam):</p>
          <BlockMath math="K = 14 + 3 + 4{,}5 + 7 + 5 + 7 + 4{,}5 + 3 = 48 \text{ cm}" />
        </div>
        <p className="text-white/80"><strong className="text-red-400">Langkah 3 — Hitung total biaya:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
          <BlockMath math="\text{Biaya rumput} = 77 \times 25.000 = Rp\,1.925.000" />
          <BlockMath math="\text{Biaya pagar} = 48 \times 8.000 = Rp\,384.000" />
          <BlockMath math="\text{Total} = 1.925.000 + 384.000 = Rp\,2.309.000" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Luas taman <InlineMath math="= 77 \text{ cm}^2" /></p>
          <p className="text-white/80">• Keliling taman <InlineMath math="= 48 \text{ cm}" /></p>
          <p className="text-white/80">• Total biaya <InlineMath math="= Rp\,2.309.000" /></p>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          🔑 <strong>Soal gabungan seperti ini</strong> menguji kemampuan menghitung keliling <em>dan</em> luas sekaligus,
          lalu mengaplikasikannya ke konteks nyata (biaya).
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────
   ACCORDION & CARD COMPONENTS
───────────────────────────────────────────── */
const AccordionSection = ({ section, idx }: { section: Section; idx: number }) => {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => { playPopSound(); setOpen(v => !v); }}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-3">
          <span className="text-xl">{section.icon}</span>
          <span className="font-display text-sm font-semibold text-white">{section.title}</span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-primary shrink-0"/> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0"/>}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border/50">
          <div className="pt-4">{section.content}</div>
        </div>
      )}
    </div>
  );
};

const ExampleCard = ({ ex, idx, prefix }: { ex: Example; idx: number; prefix: string }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            {prefix} {idx + 1} — {ex.level}
          </span>
        </div>
        {ex.question}
      </div>
      <button
        onClick={() => { playPopSound(); setShowAnswer(v => !v); }}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-800/60 hover:bg-slate-800/90 transition-colors cursor-pointer border-t border-slate-700/50"
      >
        <span className={`text-xs font-semibold font-body ${ex.color}`}>
          {showAnswer ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
        </span>
        {showAnswer ? <ChevronUp className="w-4 h-4 text-muted-foreground"/> : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
      </button>
      {showAnswer && (
        <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">
          {ex.answer}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const KelilingLuasBangunTakBeraturanPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-base md:text-xl font-bold text-primary text-glow-cyan mb-1 text-center leading-tight">
          KELILING DAN LUAS
        </h1>
        <h2 className="font-display text-base md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center leading-tight">
          BANGUN TAK BERATURAN
        </h2>
        <p className="text-white/50 text-xs text-center mb-8 font-body">
          Kelas 7 · Segitiga dan Segiempat
        </p>

        {/* Intro */}
        <div className="bg-card/60 border border-border rounded-xl p-4 mb-6 text-sm font-body text-white/75 leading-relaxed">
          <p>
            Tidak semua bidang tanah atau ruangan berbentuk persegi panjang sempurna!
            Banyak bentuk di dunia nyata yang <strong className="text-cyan-300">tidak beraturan</strong> —
            ada lekukan, tonjolan, sudut ganjil, dan sisi tersembunyi. Di sini kita akan belajar
            cara cerdas menghitung <strong className="text-yellow-300">keliling</strong> dan{" "}
            <strong className="text-green-300">luas</strong> bangun-bangun tak beraturan tersebut.
            Perhatikan bagian yang <span className="text-cyan-300 font-bold">berkedip</span> pada setiap gambar —
            itulah bagian yang sedang kita hitung!
          </p>
        </div>

        {/* Theory Sections */}
        <div className="flex flex-col gap-3 mb-8">
          {sections.map((sec, i) => (
            <AccordionSection key={sec.title} section={sec} idx={i} />
          ))}
        </div>

        {/* Contoh Soal Keliling */}
        <div className="mb-6">
          <h3 className="font-display text-sm font-bold text-cyan-300 text-center mb-1">
            📏 Contoh Soal — KELILING
          </h3>
          <p className="text-white/40 text-xs text-center mb-4 font-body">Perhatikan sisi yang berkedip pada setiap gambar</p>
          <div className="flex flex-col gap-4">
            {kelilingExamples.map((ex, i) => (
              <ExampleCard key={`k${i}`} ex={ex} idx={i} prefix="KELILING" />
            ))}
          </div>
        </div>

        {/* Contoh Soal Luas */}
        <div className="mb-4">
          <h3 className="font-display text-sm font-bold text-green-300 text-center mb-1">
            🟦 Contoh Soal — LUAS
          </h3>
          <p className="text-white/40 text-xs text-center mb-4 font-body">Perhatikan bagian yang berkedip pada setiap gambar</p>
          <div className="flex flex-col gap-4">
            {luasExamples.map((ex, i) => (
              <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix="LUAS" />
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/segitiga-dan-segiempat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Segitiga dan Segiempat
          </button>
        </div>
      </div>
    </div>
  );
};

export default KelilingLuasBangunTakBeraturanPage;
