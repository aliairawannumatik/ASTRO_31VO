import React, { useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, FlaskConical, Star, Sparkles, Target, CheckCircle2 } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ══════════════════════════════════════════════════════════════════════
   SVG ILLUSTRATIONS
══════════════════════════════════════════════════════════════════════ */

/** SVG 1 – Lingkaran dalam Persegi (sudut diarsir) */
const Svg1 = () => (
  <svg viewBox="0 0 280 260" className="w-full max-w-[260px] mx-auto drop-shadow-xl">
    <defs>
      <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
      </radialGradient>
      <style>{`
        @keyframes p1{0%,100%{opacity:.45}50%{opacity:.8}}
        @keyframes g1{0%,100%{filter:drop-shadow(0 0 6px #22d3ee)}50%{filter:drop-shadow(0 0 18px #22d3ee)}}
        @keyframes d1{to{stroke-dashoffset:-18}}
        @keyframes spin1{from{transform:rotate(0deg) translateX(88px)}to{transform:rotate(360deg) translateX(88px)}}
        .s1a{animation:p1 2.4s ease-in-out infinite}
        .s1b{animation:g1 2.4s ease-in-out infinite}
        .s1d{animation:d1 1.4s linear infinite}
      `}</style>
    </defs>
    {/* Shaded corners */}
    <path fillRule="evenodd" fill="#f97316" className="s1a"
      d="M40,20 H240 V220 H40 Z M140,120 m-100,0 a100,100,0,1,0,200,0 a100,100,0,1,0,-200,0" />
    {/* Square */}
    <rect x="40" y="20" width="200" height="200" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round"/>
    {/* Circle */}
    <circle cx="140" cy="120" r="100" fill="url(#rg1)" stroke="#22d3ee" strokeWidth="2.5" className="s1b"/>
    {/* Center */}
    <circle cx="140" cy="120" r="4" fill="#22d3ee"/>
    <text x="147" y="117" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">O</text>
    {/* Dashed radius */}
    <line x1="140" y1="120" x2="240" y2="120" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="7 3" className="s1d" opacity=".8"/>
    <text x="183" y="113" fill="#67e8f9" fontSize="12" fontFamily="monospace" fontWeight="bold">r</text>
    {/* Labels */}
    <text x="137" y="236" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">a = 2r</text>
    <text x="56" y="40" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".9">Arsiran</text>
    <text x="56" y="52" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".9">= Sudut</text>
    {/* Corner accent dots */}
    {[[40,20],[240,20],[40,220],[240,220]].map(([cx,cy],i) => (
      <circle key={i} cx={cx} cy={cy} r="4.5" fill="#f97316" opacity=".7"/>
    ))}
  </svg>
);

/** SVG 2 – Persegi Panjang + Setengah Lingkaran (bangun gabungan) */
const Svg2 = () => (
  <svg viewBox="0 0 280 240" className="w-full max-w-[260px] mx-auto drop-shadow-xl">
    <defs>
      <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1"/>
      </linearGradient>
      <style>{`
        @keyframes g2{0%,100%{filter:drop-shadow(0 0 7px #06b6d4)}50%{filter:drop-shadow(0 0 20px #06b6d4)}}
        @keyframes p2{0%,100%{opacity:.35}50%{opacity:.65}}
        .s2a{animation:g2 2.6s ease-in-out infinite}
        .s2b{animation:p2 2.6s ease-in-out infinite}
      `}</style>
    </defs>
    {/* Fill */}
    <path d="M50,130 A90,90,0,0,1,230,130 V215 H50 Z" fill="url(#lg2)" className="s2b"/>
    {/* Outline */}
    <path d="M50,130 A90,90,0,0,1,230,130 V215 H50 Z" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinejoin="round" className="s2a"/>
    {/* Diameter dashed */}
    <line x1="50" y1="130" x2="230" y2="130" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 3" opacity=".7"/>
    <text x="128" y="124" fill="#c4b5fd" fontSize="10" fontFamily="monospace">d=2r</text>
    {/* Radius up */}
    <line x1="140" y1="130" x2="140" y2="40" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5 3" opacity=".75"/>
    <text x="145" y="88" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>
    {/* Height label */}
    <line x1="238" y1="130" x2="238" y2="215" stroke="#4ade80" strokeWidth="1.5" opacity=".6"/>
    <text x="245" y="178" fill="#4ade80" fontSize="10" fontFamily="monospace">t</text>
    {/* Base label */}
    <text x="137" y="230" fill="#06b6d4" fontSize="10" fontFamily="monospace" textAnchor="middle">2r = p</text>
    {/* Center dot */}
    <circle cx="140" cy="130" r="4" fill="#06b6d4"/>
    <text x="147" y="127" fill="#67e8f9" fontSize="9" fontFamily="monospace">O</text>
    {/* Labels */}
    <text x="136" y="83" fill="#67e8f9" fontSize="8" fontFamily="monospace" textAnchor="end">½ Lingkaran</text>
    <text x="144" y="182" fill="#22d3ee" fontSize="9" fontFamily="monospace">Persegi</text>
    <text x="144" y="193" fill="#22d3ee" fontSize="9" fontFamily="monospace">Panjang</text>
  </svg>
);

/** SVG 3 – Segitiga dengan lingkaran dalam */
const Svg3 = () => (
  <svg viewBox="0 0 280 250" className="w-full max-w-[260px] mx-auto drop-shadow-xl">
    <defs>
      <style>{`
        @keyframes g3{0%,100%{filter:drop-shadow(0 0 6px #a855f7)}50%{filter:drop-shadow(0 0 18px #a855f7)}}
        @keyframes p3{0%,100%{opacity:.4}50%{opacity:.72}}
        .s3a{animation:p3 2.8s ease-in-out infinite}
        .s3b{animation:g3 2.8s ease-in-out infinite}
      `}</style>
    </defs>
    {/* Arsiran: segitiga − lingkaran */}
    <path fillRule="evenodd" fill="#a855f7" className="s3a"
      d="M50,210 L50,70 L155,210 Z M83,177 m-33,0 a33,33,0,1,0,66,0 a33,33,0,1,0,-66,0"/>
    {/* Triangle */}
    <polygon points="50,210 50,70 155,210" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinejoin="round"/>
    {/* Incircle */}
    <circle cx="83" cy="177" r="33" fill="rgba(168,85,247,.15)" stroke="#d946ef" strokeWidth="2" className="s3b"/>
    {/* Right-angle */}
    <polyline points="62,210 62,198 50,198" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity=".7"/>
    {/* Vertex labels */}
    <text x="40" y="62" fill="#e879f9" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="162" y="218" fill="#e879f9" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="34" y="222" fill="#e879f9" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    {/* Tangent dots */}
    <circle cx="83" cy="210" r="4" fill="#fbbf24"/>
    <circle cx="50" cy="177" r="4" fill="#fbbf24"/>
    {/* Radius */}
    <line x1="83" y1="177" x2="83" y2="210" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="4 2" opacity=".8"/>
    <text x="88" y="197" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">r</text>
    {/* Incenter */}
    <circle cx="83" cy="177" r="3.5" fill="#d946ef"/>
    <text x="90" y="174" fill="#fde68a" fontSize="8" fontFamily="monospace">I</text>
    {/* Side labels */}
    <text x="28" y="148" fill="#c4b5fd" fontSize="9" fontFamily="monospace">a</text>
    <text x="97" y="222" fill="#c4b5fd" fontSize="9" fontFamily="monospace">b</text>
    <text x="116" y="146" fill="#c4b5fd" fontSize="9" fontFamily="monospace">c</text>
  </svg>
);

/** SVG 4 – Trapesium + Setengah Lingkaran di luar */
const Svg4 = () => (
  <svg viewBox="0 0 280 250" className="w-full max-w-[260px] mx-auto drop-shadow-xl">
    <defs>
      <style>{`
        @keyframes g4{0%,100%{filter:drop-shadow(0 0 7px #f59e0b)}50%{filter:drop-shadow(0 0 20px #f59e0b)}}
        @keyframes p4{0%,100%{opacity:.35}50%{opacity:.65}}
        .s4a{animation:g4 2.2s ease-in-out infinite}
        .s4b{animation:p4 2.2s ease-in-out infinite}
      `}</style>
    </defs>
    {/* Trapesium fill */}
    <path d="M70,50 H210 L240,200 H40 Z" fill="rgba(251,191,36,.18)" className="s4b"/>
    <path d="M70,50 H210 L240,200 H40 Z" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" className="s4a"/>
    {/* Semicircle on top */}
    <path d="M70,50 A70,70,0,0,1,210,50" fill="rgba(251,191,36,.2)" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 3"/>
    {/* Dashed diameter */}
    <line x1="70" y1="50" x2="210" y2="50" stroke="#a78bfa" strokeWidth="1.4" strokeDasharray="5 3" opacity=".7"/>
    {/* Labels */}
    <text x="134" y="44" fill="#c4b5fd" fontSize="9" fontFamily="monospace" textAnchor="middle">a (sisi atas)</text>
    <text x="134" y="216" fill="#fbbf24" fontSize="9" fontFamily="monospace" textAnchor="middle">b (sisi bawah)</text>
    {/* height */}
    <line x1="258" y1="50" x2="258" y2="200" stroke="#4ade80" strokeWidth="1.4" opacity=".6"/>
    <line x1="254" y1="50" x2="262" y2="50" stroke="#4ade80" strokeWidth="1.4" opacity=".6"/>
    <line x1="254" y1="200" x2="262" y2="200" stroke="#4ade80" strokeWidth="1.4" opacity=".6"/>
    <text x="264" y="130" fill="#4ade80" fontSize="10" fontFamily="monospace">t</text>
    {/* r label */}
    <circle cx="140" cy="50" r="3.5" fill="#fbbf24"/>
    <line x1="140" y1="50" x2="140" y2="-10" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="4 2" opacity=".7"/>
    <text x="145" y="20" fill="#fbbf24" fontSize="10" fontFamily="monospace">r</text>
    {/* Label */}
    <text x="134" y="130" fill="#fde68a" fontSize="10" fontFamily="monospace" textAnchor="middle">Trapesium</text>
    <text x="134" y="20" fill="#fbbf24" fontSize="9" fontFamily="monospace" textAnchor="middle">½ Lingkaran</text>
  </svg>
);

/** SVG 5 – Lingkaran besar – Lingkaran kecil (gelang/annulus) */
const Svg5 = () => (
  <svg viewBox="0 0 280 260" className="w-full max-w-[260px] mx-auto drop-shadow-xl">
    <defs>
      <style>{`
        @keyframes g5a{0%,100%{filter:drop-shadow(0 0 8px #ec4899)}50%{filter:drop-shadow(0 0 22px #ec4899)}}
        @keyframes g5b{0%,100%{filter:drop-shadow(0 0 5px #a855f7)}50%{filter:drop-shadow(0 0 14px #a855f7)}}
        @keyframes rot5{from{stroke-dashoffset:0}to{stroke-dashoffset:-600}}
        .s5a{animation:g5a 2s ease-in-out infinite}
        .s5b{animation:g5b 2s ease-in-out infinite}
        .s5r{animation:rot5 8s linear infinite}
      `}</style>
    </defs>
    {/* Annulus fill */}
    <circle cx="140" cy="130" r="100" fill="rgba(236,72,153,.15)"/>
    <circle cx="140" cy="130" r="55" fill="rgba(15,23,42,.9)"/>
    {/* Outer ring */}
    <circle cx="140" cy="130" r="100" fill="none" stroke="#ec4899" strokeWidth="3" strokeDasharray="12 4" className="s5r s5a"/>
    {/* Inner ring */}
    <circle cx="140" cy="130" r="55" fill="none" stroke="#a855f7" strokeWidth="2.5" className="s5b"/>
    {/* Center */}
    <circle cx="140" cy="130" r="4" fill="#ec4899"/>
    {/* R outer */}
    <line x1="140" y1="130" x2="240" y2="130" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>
    <text x="183" y="123" fill="#f9a8d4" fontSize="12" fontFamily="monospace" fontWeight="bold">R</text>
    {/* r inner */}
    <line x1="140" y1="130" x2="140" y2="75" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 2" opacity=".8"/>
    <text x="145" y="105" fill="#d8b4fe" fontSize="12" fontFamily="monospace" fontWeight="bold">r</text>
    {/* Labels */}
    <text x="137" y="245" fill="#ec4899" fontSize="10" fontFamily="monospace" textAnchor="middle">Lingkaran Besar (R)</text>
    <text x="137" y="100" fill="#a855f7" fontSize="9" fontFamily="monospace" textAnchor="middle">Lingkaran Kecil (r)</text>
    <text x="230" y="155" fill="#fde68a" fontSize="9" fontFamily="monospace">Arsiran</text>
    <text x="230" y="166" fill="#fde68a" fontSize="9" fontFamily="monospace">= Gelang</text>
  </svg>
);

/** SVG 6 – Lingkaran di pojok persegi (seperempat lingkaran) */
const Svg6 = () => (
  <svg viewBox="0 0 280 260" className="w-full max-w-[260px] mx-auto drop-shadow-xl">
    <defs>
      <style>{`
        @keyframes g6{0%,100%{filter:drop-shadow(0 0 7px #10b981)}50%{filter:drop-shadow(0 0 20px #10b981)}}
        @keyframes p6{0%,100%{opacity:.4}50%{opacity:.75}}
        .s6a{animation:g6 2.4s ease-in-out infinite}
        .s6b{animation:p6 2.4s ease-in-out infinite}
      `}</style>
      <mask id="m6">
        <rect x="40" y="30" width="200" height="200" fill="white"/>
        <path d="M40,30 A120,120,0,0,1,160,150 L40,150 Z" fill="black"/>
      </mask>
    </defs>
    {/* Shaded = square minus quarter circle */}
    <rect x="40" y="30" width="200" height="200" fill="#10b981" className="s6b" mask="url(#m6)" opacity=".45"/>
    {/* Square */}
    <rect x="40" y="30" width="200" height="200" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinejoin="round"/>
    {/* Quarter circle */}
    <path d="M40,30 A120,120,0,0,1,160,150 L40,150 Z" fill="rgba(16,185,129,.2)" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" className="s6a"/>
    {/* Radius */}
    <line x1="40" y1="150" x2="40" y2="30" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>
    <text x="45" y="95" fill="#6ee7b7" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>
    {/* Labels */}
    <text x="137" y="243" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle">sisi = r</text>
    <text x="90" y="70" fill="#fde68a" fontSize="9" fontFamily="monospace">¼ Lingkaran</text>
    <text x="165" y="150" fill="#fde68a" fontSize="9" fontFamily="monospace">Arsiran</text>
    <circle cx="40" cy="30" r="4" fill="#10b981"/>
    <text x="46" y="27" fill="#6ee7b7" fontSize="9" fontFamily="monospace">A</text>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════
   SOAL DATA (10 problems)
══════════════════════════════════════════════════════════════════════ */
interface Soal {
  no: number;
  soal: string;
  diketahui: string[];
  langkah: { teks: string; rumus?: string }[];
  jawaban: string;
  warna: string;
  emoji: string;
}

const SOAL_LIST: Soal[] = [
  {
    no: 1,
    emoji: "🔶",
    warna: "#f97316",
    soal: "Sebuah persegi memiliki sisi 28 cm. Di dalamnya terdapat lingkaran yang menyinggung semua sisinya. Hitung luas dan keliling daerah yang diarsir! (π = 22/7)",
    diketahui: ["Sisi persegi a = 28 cm", "Jari-jari lingkaran r = a/2 = 14 cm", "π = 22/7"],
    langkah: [
      { teks: "Luas persegi:", rumus: "L_\\square = a^2 = 28^2 = 784 \\text{ cm}^2" },
      { teks: "Luas lingkaran:", rumus: "L_\\circ = \\pi r^2 = \\tfrac{22}{7} \\times 14^2 = \\tfrac{22}{7} \\times 196 = 616 \\text{ cm}^2" },
      { teks: "Luas arsiran:", rumus: "L_\\text{arsir} = 784 - 616 = 168 \\text{ cm}^2" },
      { teks: "Keliling arsiran (4 sisi + keliling lingkaran):", rumus: "K = 4a + 2\\pi r = 4(28) + 2 \\times \\tfrac{22}{7} \\times 14 = 112 + 88 = 200 \\text{ cm}" },
    ],
    jawaban: "Luas arsiran = 168 cm², Keliling arsiran = 200 cm",
  },
  {
    no: 2,
    emoji: "🔵",
    warna: "#06b6d4",
    soal: "Sebuah lapangan berbentuk persegi panjang berukuran 42 m × 21 m. Pada salah satu sisi panjangnya ditambah setengah lingkaran. Hitung luas total dan keliling lapangan! (π = 22/7)",
    diketahui: ["Panjang p = 42 m", "Lebar/tinggi t = 21 m", "r = p/2 = 21 m", "π = 22/7"],
    langkah: [
      { teks: "Luas persegi panjang:", rumus: "L_1 = p \\times t = 42 \\times 21 = 882 \\text{ m}^2" },
      { teks: "Luas setengah lingkaran:", rumus: "L_2 = \\tfrac{1}{2}\\pi r^2 = \\tfrac{1}{2} \\times \\tfrac{22}{7} \\times 21^2 = \\tfrac{1}{2} \\times \\tfrac{22}{7} \\times 441 = 693 \\text{ m}^2" },
      { teks: "Luas total:", rumus: "L = 882 + 693 = 1575 \\text{ m}^2" },
      { teks: "Keliling (2t + p + πr):", rumus: "K = 2(21) + 42 + \\tfrac{22}{7} \\times 21 = 42 + 42 + 66 = 150 \\text{ m}" },
    ],
    jawaban: "Luas total = 1.575 m², Keliling = 150 m",
  },
  {
    no: 3,
    emoji: "🔺",
    warna: "#a855f7",
    soal: "Sebuah segitiga siku-siku memiliki sisi siku-siku 6 cm dan 8 cm. Di dalamnya terdapat lingkaran yang menyinggung ketiga sisinya. Hitung jari-jari lingkaran dalam dan luas daerah yang diarsir! (π = 3,14)",
    diketahui: ["Kaki a = 6 cm, kaki b = 8 cm", "Hipotenusa c = √(6²+8²) = 10 cm", "s = (6+8+10)/2 = 12 cm", "π = 3,14"],
    langkah: [
      { teks: "Luas segitiga:", rumus: "L_\\triangle = \\tfrac{1}{2} \\times 6 \\times 8 = 24 \\text{ cm}^2" },
      { teks: "Jari-jari lingkaran dalam:", rumus: "r = \\frac{L_\\triangle}{s} = \\frac{24}{12} = 2 \\text{ cm}" },
      { teks: "Luas lingkaran dalam:", rumus: "L_\\circ = \\pi r^2 = 3{,}14 \\times 4 = 12{,}56 \\text{ cm}^2" },
      { teks: "Luas arsiran:", rumus: "L_\\text{arsir} = 24 - 12{,}56 = 11{,}44 \\text{ cm}^2" },
    ],
    jawaban: "r = 2 cm, Luas arsiran = 11,44 cm²",
  },
  {
    no: 4,
    emoji: "💎",
    warna: "#ec4899",
    soal: "Dua buah lingkaran sepusat (konsentris) dengan jari-jari R = 14 cm dan r = 7 cm. Hitung luas dan keliling daerah gelang (annulus) yang diarsir! (π = 22/7)",
    diketahui: ["R = 14 cm (lingkaran besar)", "r = 7 cm (lingkaran kecil)", "π = 22/7"],
    langkah: [
      { teks: "Luas lingkaran besar:", rumus: "L_R = \\pi R^2 = \\tfrac{22}{7} \\times 196 = 616 \\text{ cm}^2" },
      { teks: "Luas lingkaran kecil:", rumus: "L_r = \\pi r^2 = \\tfrac{22}{7} \\times 49 = 154 \\text{ cm}^2" },
      { teks: "Luas arsiran (gelang):", rumus: "L = L_R - L_r = 616 - 154 = 462 \\text{ cm}^2" },
      { teks: "Keliling arsiran:", rumus: "K = 2\\pi R + 2\\pi r = 2\\pi(R+r) = 2 \\times \\tfrac{22}{7} \\times 21 = 132 \\text{ cm}" },
    ],
    jawaban: "Luas gelang = 462 cm², Keliling = 132 cm",
  },
  {
    no: 5,
    emoji: "🟩",
    warna: "#22c55e",
    soal: "Sebuah persegi panjang berukuran 30 cm × 20 cm. Di tengahnya terdapat lingkaran dengan jari-jari 7 cm. Hitung luas dan keliling daerah yang diarsir! (π = 22/7)",
    diketahui: ["p = 30 cm, l = 20 cm", "r = 7 cm", "π = 22/7"],
    langkah: [
      { teks: "Luas persegi panjang:", rumus: "L_{\\text{PP}} = p \\times l = 30 \\times 20 = 600 \\text{ cm}^2" },
      { teks: "Luas lingkaran:", rumus: "L_\\circ = \\pi r^2 = \\tfrac{22}{7} \\times 49 = 154 \\text{ cm}^2" },
      { teks: "Luas arsiran:", rumus: "L = 600 - 154 = 446 \\text{ cm}^2" },
      { teks: "Keliling arsiran:", rumus: "K = 2(p+l) + 2\\pi r = 2(50) + 2 \\times \\tfrac{22}{7} \\times 7 = 100 + 44 = 144 \\text{ cm}" },
    ],
    jawaban: "Luas arsiran = 446 cm², Keliling = 144 cm",
  },
  {
    no: 6,
    emoji: "🌗",
    warna: "#f59e0b",
    soal: "Sebuah persegi dengan sisi 14 cm. Di sudut kiri atas terdapat seperempat lingkaran berjari-jari 14 cm. Hitung luas daerah yang diarsir (bagian persegi di luar seperempat lingkaran)! (π = 22/7)",
    diketahui: ["Sisi persegi a = 14 cm", "r = 14 cm = a (seperempat lingkaran)", "π = 22/7"],
    langkah: [
      { teks: "Luas persegi:", rumus: "L_\\square = 14^2 = 196 \\text{ cm}^2" },
      { teks: "Luas seperempat lingkaran:", rumus: "L_{\\frac{1}{4}} = \\tfrac{1}{4}\\pi r^2 = \\tfrac{1}{4} \\times \\tfrac{22}{7} \\times 196 = 154 \\text{ cm}^2" },
      { teks: "Luas arsiran:", rumus: "L = 196 - 154 = 42 \\text{ cm}^2" },
    ],
    jawaban: "Luas arsiran = 42 cm²",
  },
  {
    no: 7,
    emoji: "🏟️",
    warna: "#10b981",
    soal: "Sebuah stadion berbentuk persegi panjang 100 m × 70 m dengan kedua ujung sisi pendeknya berbentuk setengah lingkaran. Hitung luas total stadion! (π = 22/7)",
    diketahui: ["Panjang persegi panjang = 100 m", "Lebar = 70 m", "r = 70/2 = 35 m (setengah lingkaran pada kedua ujung)", "π = 22/7"],
    langkah: [
      { teks: "Luas persegi panjang tengah:", rumus: "L_1 = 100 \\times 70 = 7000 \\text{ m}^2" },
      { teks: "Dua setengah lingkaran = satu lingkaran penuh:", rumus: "L_2 = \\pi r^2 = \\tfrac{22}{7} \\times 35^2 = \\tfrac{22}{7} \\times 1225 = 3850 \\text{ m}^2" },
      { teks: "Luas total stadion:", rumus: "L = 7000 + 3850 = 10850 \\text{ m}^2" },
    ],
    jawaban: "Luas total stadion = 10.850 m²",
  },
  {
    no: 8,
    emoji: "🪟",
    warna: "#0ea5e9",
    soal: "Jendela berbentuk persegi panjang 80 cm × 120 cm dengan bagian atas berbentuk setengah lingkaran. Hitung luas kaca yang dibutuhkan! (π = 3,14)",
    diketahui: ["Lebar = 80 cm", "Tinggi persegi panjang = 120 cm", "r = 80/2 = 40 cm", "π = 3,14"],
    langkah: [
      { teks: "Luas bagian persegi panjang:", rumus: "L_1 = 80 \\times 120 = 9600 \\text{ cm}^2" },
      { teks: "Luas setengah lingkaran:", rumus: "L_2 = \\tfrac{1}{2} \\times 3{,}14 \\times 40^2 = \\tfrac{1}{2} \\times 3{,}14 \\times 1600 = 2512 \\text{ cm}^2" },
      { teks: "Luas total kaca:", rumus: "L = 9600 + 2512 = 12112 \\text{ cm}^2 = 1{,}2112 \\text{ m}^2" },
    ],
    jawaban: "Luas kaca = 12.112 cm²",
  },
  {
    no: 9,
    emoji: "🎯",
    warna: "#8b5cf6",
    soal: "Papan target berbentuk lingkaran besar berjari-jari 30 cm. Di tengahnya terdapat lingkaran merah berjari-jari 10 cm, dan di antara keduanya terdapat lingkaran biru berjari-jari 20 cm. Hitung luas daerah biru! (π = 3,14)",
    diketahui: ["R = 30 cm (lingkaran luar)", "r₂ = 20 cm (lingkaran biru)", "r₁ = 10 cm (lingkaran merah)", "π = 3,14"],
    langkah: [
      { teks: "Luas lingkaran r₂ = 20 cm:", rumus: "L_2 = 3{,}14 \\times 400 = 1256 \\text{ cm}^2" },
      { teks: "Luas lingkaran r₁ = 10 cm:", rumus: "L_1 = 3{,}14 \\times 100 = 314 \\text{ cm}^2" },
      { teks: "Luas daerah biru (gelang):", rumus: "L_{\\text{biru}} = 1256 - 314 = 942 \\text{ cm}^2" },
    ],
    jawaban: "Luas daerah biru = 942 cm²",
  },
  {
    no: 10,
    emoji: "🏡",
    warna: "#ef4444",
    soal: "Sebuah taman berbentuk persegi dengan sisi 28 m. Di setiap sudut taman terdapat seperempat lingkaran berjari-jari 7 m (untuk tempat duduk). Hitung luas taman yang tersisa untuk area bermain! (π = 22/7)",
    diketahui: ["Sisi taman a = 28 m", "r = 7 m (seperempat lingkaran di 4 sudut)", "4 × ¼ lingkaran = 1 lingkaran penuh", "π = 22/7"],
    langkah: [
      { teks: "Luas taman (persegi):", rumus: "L_\\square = 28^2 = 784 \\text{ m}^2" },
      { teks: "Luas 4 seperempat lingkaran = 1 lingkaran penuh:", rumus: "L_\\circ = \\pi r^2 = \\tfrac{22}{7} \\times 49 = 154 \\text{ m}^2" },
      { teks: "Luas area bermain:", rumus: "L = 784 - 154 = 630 \\text{ m}^2" },
    ],
    jawaban: "Luas area bermain = 630 m²",
  },
];

/* ══════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════ */
const BukuAnimasiKaitanBangunDatarLainnyaPage: React.FC = () => {
  const [open, setOpen] = useState<string[]>(["header", "intro", "kasus1", "kasus2", "kasus3", "kasus4", "kasus5", "kasus6"]);
  const [openSoal, setOpenSoal] = useState<number[]>([]);

  const toggle = (id: string) => {
    playPopSound();
    setOpen(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };
  const toggleSoal = (no: number) => {
    playPopSound();
    setOpenSoal(p => p.includes(no) ? p.filter(x => x !== no) : [...p, no]);
  };

  const Card = ({ id, borderColor, children }: { id: string; borderColor: string; children: React.ReactNode }) => (
    <div className="rounded-2xl overflow-hidden border" style={{
      background: "rgba(15,23,42,.8)",
      borderColor,
      backdropFilter: "blur(14px)",
      boxShadow: `0 0 24px ${borderColor}22`,
    }}>
      {children}
    </div>
  );

  const SectionBtn = ({ id, icon, iconColor, title, accent }: {
    id: string; icon: React.ReactNode; iconColor: string; title: string; accent: string;
  }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left transition-all"
      style={open.includes(id) ? { background: `linear-gradient(to right,${accent},transparent)`, borderBottom: `1px solid ${accent.replace(".12","0.3")}` } : {}}>
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white text-sm leading-snug">{title}</span>
      </div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 shrink-0 text-white/60"/> : <ChevronDown className="w-5 h-5 shrink-0 text-white/25"/>}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-14">

        {/* ── COVER BADGE ── */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-body font-bold tracking-widest"
            style={{ background: "rgba(251,191,36,.15)", border: "1px solid rgba(251,191,36,.4)", color: "#fbbf24" }}>
            <BookOpen className="w-3.5 h-3.5" /> BUKU ANIMASI MATEMATIKA · KELAS 8
          </div>

          {/* Book cover */}
          <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden border-2 border-yellow-400/30 shadow-2xl mb-5"
            style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)", padding: "2px" }}>
            <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0c1a2e 100%)" }}>
              {/* Decorative circles background */}
              <div className="relative h-44 flex items-center justify-center overflow-hidden">
                {[110,80,55,30].map((r,i) => (
                  <div key={i} className="absolute rounded-full border"
                    style={{ width: r*2, height: r*2, borderColor: `hsl(${200+i*40},80%,60%)`, opacity: 0.15+i*0.08, borderWidth: 1.5 }}/>
                ))}
                {/* Central diagram: circle in square */}
                <svg viewBox="0 0 200 160" className="w-48 relative z-10">
                  <rect x="30" y="15" width="140" height="130" fill="none" stroke="#f97316" strokeWidth="2" opacity=".7"/>
                  <circle cx="100" cy="80" r="65" fill="rgba(34,211,238,.15)" stroke="#22d3ee" strokeWidth="2" opacity=".85"/>
                  <circle cx="100" cy="80" r="35" fill="rgba(168,85,247,.15)" stroke="#a855f7" strokeWidth="1.5" opacity=".75"/>
                  <path d="M100,80 m-35,0 a35,35,0,1,0,70,0 Z" fill="rgba(236,72,153,.25)" opacity=".6"/>
                  <circle cx="100" cy="80" r="3" fill="#22d3ee"/>
                </svg>
              </div>
              <div className="px-5 pb-6 pt-2 text-center">
                <h1 className="font-display font-extrabold text-xl leading-tight mb-1"
                  style={{ background: "linear-gradient(135deg,#fbbf24,#f97316,#ec4899,#a855f7,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  KAITAN LINGKARAN DENGAN<br />BANGUN DATAR LAINNYA
                </h1>
                <p className="text-white/40 text-xs font-body tracking-wide">Luas & Keliling · Daerah Arsiran · Bangun Gabungan</p>
                <div className="flex justify-center gap-1.5 mt-2">
                  {["#f97316","#22d3ee","#a855f7","#4ade80","#fbbf24","#ec4899"].map((c,i) => (
                    <Star key={i} className="w-3 h-3" style={{ color: c, fill: c, opacity: .7 }}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 animate-slide-up">

          {/* ── PENDAHULUAN ── */}
          <Card id="intro" borderColor="rgba(251,191,36,.3)">
            <SectionBtn id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400"
              title="💡 Pengantar — Apa Itu Daerah Arsiran?" accent="rgba(251,191,36,.12)"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <p className="font-body text-sm text-white/85 leading-relaxed">
                  Lingkaran sering hadir bersama bangun datar lain — bisa <strong className="text-yellow-300">di dalam</strong> maupun <strong className="text-cyan-300">di luar</strong> bangun tersebut. Bagian yang <em className="text-pink-300">diarsir</em> adalah daerah yang menjadi fokus pertanyaan. Kuncinya: <strong className="text-green-300">identifikasi bangun yang dijumlah atau dikurang</strong>, lalu hitung masing-masing luasnya.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { c: "#f97316", e: "➖", l: "Dikurangi", d: "Bangun besar − bangun kecil" },
                    { c: "#06b6d4", e: "➕", l: "Digabung",  d: "Luas A + Luas B" },
                    { c: "#a855f7", e: "🔄", l: "Campuran",  d: "Busur + sisi lurus" },
                  ].map((x,i) => (
                    <div key={i} className="rounded-xl p-3 border text-center"
                      style={{ background: `${x.c}14`, borderColor: `${x.c}40` }}>
                      <p className="text-lg mb-1">{x.e}</p>
                      <p className="font-bold text-xs" style={{ color: x.c }}>{x.l}</p>
                      <p className="text-white/50 text-xs mt-0.5">{x.d}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3 border" style={{ background:"rgba(251,191,36,.07)", borderColor:"rgba(251,191,36,.3)"}}>
                  <p className="text-yellow-200 text-xs font-body">
                    🔑 <strong>Kunci:</strong> <InlineMath math="\pi = \tfrac{22}{7}"/> digunakan jika jari-jari kelipatan 7. Gunakan <InlineMath math="\pi = 3{,}14"/> jika tidak disebutkan.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* ── 6 KASUS ILUSTRASI ── */}
          {/* Kasus 1 */}
          <Card id="kasus1" borderColor="rgba(249,115,22,.3)">
            <SectionBtn id="kasus1" icon={<Target className="w-5 h-5"/>} iconColor="text-orange-400"
              title="🔶 Kasus 1 — Lingkaran Dalam Persegi (4 Sudut Diarsir)" accent="rgba(249,115,22,.12)"/>
            {open.includes("kasus1") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <p className="text-orange-200 text-sm font-body leading-relaxed rounded-xl p-3 border"
                  style={{ background:"rgba(249,115,22,.08)", borderColor:"rgba(249,115,22,.25)"}}>
                  Lingkaran <strong className="text-cyan-300">tepat menyinggung semua sisi persegi</strong> dari dalam sehingga <InlineMath math="a = 2r"/>. Daerah arsiran adalah keempat sudut persegi yang tidak tertutupi lingkaran.
                </p>
                <Svg1 />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(249,115,22,.09)", borderColor:"rgba(249,115,22,.3)"}}>
                    <p className="text-orange-300 font-bold text-xs uppercase tracking-wide">📐 Luas Arsiran</p>
                    <BlockMath math="L = a^2 - \pi r^2 = 4r^2 - \pi r^2 = r^2(4-\pi)"/>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(34,211,238,.09)", borderColor:"rgba(34,211,238,.3)"}}>
                    <p className="text-cyan-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Arsiran</p>
                    <BlockMath math="K = 4a + 2\pi r = 8r + 2\pi r = 2r(4+\pi)"/>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Kasus 2 */}
          <Card id="kasus2" borderColor="rgba(6,182,212,.3)">
            <SectionBtn id="kasus2" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400"
              title="🔵 Kasus 2 — Persegi Panjang + Setengah Lingkaran" accent="rgba(6,182,212,.12)"/>
            {open.includes("kasus2") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <p className="text-cyan-200 text-sm font-body leading-relaxed rounded-xl p-3 border"
                  style={{ background:"rgba(6,182,212,.08)", borderColor:"rgba(6,182,212,.25)"}}>
                  Bangun gabungan: persegi panjang (<InlineMath math="p \times t"/>) ditambah setengah lingkaran pada salah satu sisi panjangnya. Contoh nyata: kolam renang olimpiade, lapangan olahraga, jendela dengan busur!
                </p>
                <Svg2 />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(6,182,212,.09)", borderColor:"rgba(6,182,212,.3)"}}>
                    <p className="text-cyan-300 font-bold text-xs uppercase tracking-wide">📐 Luas Gabungan</p>
                    <BlockMath math="L = p \times t + \tfrac{1}{2}\pi r^2"/>
                    <p className="text-white/50 text-xs">dengan <InlineMath math="r = \tfrac{p}{2}"/></p>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(167,139,250,.09)", borderColor:"rgba(167,139,250,.3)"}}>
                    <p className="text-violet-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Gabungan</p>
                    <BlockMath math="K = 2t + p + \pi r"/>
                    <p className="text-white/50 text-xs">Sisi berimpit tidak dihitung!</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Kasus 3 */}
          <Card id="kasus3" borderColor="rgba(168,85,247,.3)">
            <SectionBtn id="kasus3" icon={<Target className="w-5 h-5"/>} iconColor="text-violet-400"
              title="🔺 Kasus 3 — Segitiga dengan Lingkaran Dalam" accent="rgba(168,85,247,.12)"/>
            {open.includes("kasus3") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <p className="text-violet-200 text-sm font-body leading-relaxed rounded-xl p-3 border"
                  style={{ background:"rgba(168,85,247,.08)", borderColor:"rgba(168,85,247,.25)"}}>
                  Lingkaran <strong className="text-pink-300">menyinggung ketiga sisi segitiga</strong> dari dalam (incircle). Jari-jari incircle dihitung dari rumus: <InlineMath math="r = \frac{L_\triangle}{s}"/> di mana <InlineMath math="s"/> adalah setengah keliling segitiga.
                </p>
                <Svg3 />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(168,85,247,.09)", borderColor:"rgba(168,85,247,.3)"}}>
                    <p className="text-violet-300 font-bold text-xs uppercase tracking-wide">📐 Luas Arsiran</p>
                    <BlockMath math="L = L_\triangle - \pi r^2"/>
                    <BlockMath math="r = \frac{L_\triangle}{s},\quad s = \frac{a+b+c}{2}"/>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(217,70,239,.09)", borderColor:"rgba(217,70,239,.3)"}}>
                    <p className="text-fuchsia-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Arsiran</p>
                    <BlockMath math="K = (a+b+c) + 2\pi r"/>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Kasus 4 */}
          <Card id="kasus4" borderColor="rgba(236,72,153,.3)">
            <SectionBtn id="kasus4" icon={<Target className="w-5 h-5"/>} iconColor="text-pink-400"
              title="💎 Kasus 4 — Dua Lingkaran Sepusat (Annulus/Gelang)" accent="rgba(236,72,153,.12)"/>
            {open.includes("kasus4") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <p className="text-pink-200 text-sm font-body leading-relaxed rounded-xl p-3 border"
                  style={{ background:"rgba(236,72,153,.08)", borderColor:"rgba(236,72,153,.25)"}}>
                  Dua lingkaran berpusat sama (konsentris). Lingkaran besar berjari-jari <InlineMath math="R"/>, lingkaran kecil berjari-jari <InlineMath math="r"/>. Daerah arsiran adalah <strong className="text-yellow-300">gelang (annulus)</strong> — bagian antara kedua lingkaran.
                </p>
                <Svg5 />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(236,72,153,.09)", borderColor:"rgba(236,72,153,.3)"}}>
                    <p className="text-pink-300 font-bold text-xs uppercase tracking-wide">📐 Luas Gelang</p>
                    <BlockMath math="L = \pi R^2 - \pi r^2 = \pi(R^2 - r^2)"/>
                    <BlockMath math="= \pi(R+r)(R-r)"/>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(168,85,247,.09)", borderColor:"rgba(168,85,247,.3)"}}>
                    <p className="text-violet-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Gelang</p>
                    <BlockMath math="K = 2\pi R + 2\pi r = 2\pi(R+r)"/>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Kasus 5 */}
          <Card id="kasus5" borderColor="rgba(16,185,129,.3)">
            <SectionBtn id="kasus5" icon={<Target className="w-5 h-5"/>} iconColor="text-emerald-400"
              title="🌿 Kasus 5 — Seperempat Lingkaran di Sudut Persegi" accent="rgba(16,185,129,.12)"/>
            {open.includes("kasus5") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <p className="text-emerald-200 text-sm font-body leading-relaxed rounded-xl p-3 border"
                  style={{ background:"rgba(16,185,129,.08)", borderColor:"rgba(16,185,129,.25)"}}>
                  Seperempat lingkaran (<strong className="text-green-300">quarter circle</strong>) terletak di salah satu sudut persegi dengan jari-jari sama dengan sisi persegi. Daerah arsiran adalah bagian persegi di luar seperempat lingkaran.
                </p>
                <Svg6 />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(16,185,129,.09)", borderColor:"rgba(16,185,129,.3)"}}>
                    <p className="text-emerald-300 font-bold text-xs uppercase tracking-wide">📐 Luas Arsiran</p>
                    <BlockMath math="L = r^2 - \tfrac{1}{4}\pi r^2 = r^2\!\left(1 - \tfrac{\pi}{4}\right)"/>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(52,211,153,.09)", borderColor:"rgba(52,211,153,.3)"}}>
                    <p className="text-emerald-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Arsiran</p>
                    <BlockMath math="K = 2r + \tfrac{1}{4}(2\pi r) = 2r + \tfrac{\pi r}{2}"/>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Kasus 6 */}
          <Card id="kasus6" borderColor="rgba(245,158,11,.3)">
            <SectionBtn id="kasus6" icon={<Target className="w-5 h-5"/>} iconColor="text-amber-400"
              title="🏟️ Kasus 6 — Trapesium + Setengah Lingkaran" accent="rgba(245,158,11,.12)"/>
            {open.includes("kasus6") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <p className="text-amber-200 text-sm font-body leading-relaxed rounded-xl p-3 border"
                  style={{ background:"rgba(245,158,11,.08)", borderColor:"rgba(245,158,11,.25)"}}>
                  Trapesium dengan setengah lingkaran pada sisi atasnya. Diameter setengah lingkaran = sisi atas trapesium. Bangun ini sering muncul pada soal desain atap atau dekorasi.
                </p>
                <Svg4 />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(245,158,11,.09)", borderColor:"rgba(245,158,11,.3)"}}>
                    <p className="text-amber-300 font-bold text-xs uppercase tracking-wide">📐 Luas Gabungan</p>
                    <BlockMath math="L = \tfrac{(a+b)}{2} \times t + \tfrac{1}{2}\pi r^2"/>
                    <p className="text-white/50 text-xs">dengan <InlineMath math="r = \tfrac{a}{2}"/></p>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2" style={{ background:"rgba(251,191,36,.09)", borderColor:"rgba(251,191,36,.3)"}}>
                    <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Gabungan</p>
                    <BlockMath math="K = b + 2c + \pi r"/>
                    <p className="text-white/50 text-xs">c = kaki trapesium</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* ── CONTOH SOAL (10 butir) ── */}
          <Card id="soal" borderColor="rgba(99,102,241,.3)">
            <SectionBtn id="soal" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-indigo-400"
              title="✏️ Contoh Soal & Pembahasan Lengkap (10 Soal)" accent="rgba(99,102,241,.12)"/>
            {open.includes("soal") && (
              <div className="px-5 pb-5 pt-3 space-y-3">
                <p className="text-white/50 text-xs font-body">Klik setiap nomor soal untuk membuka pembahasan lengkap.</p>

                {SOAL_LIST.map(s => (
                  <div key={s.no} className="rounded-xl overflow-hidden border"
                    style={{ borderColor: `${s.warna}40`, background: `${s.warna}0a` }}>

                    {/* Soal header */}
                    <button onClick={() => toggleSoal(s.no)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left transition-all hover:bg-white/5">
                      <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ background: `${s.warna}25`, border: `1.5px solid ${s.warna}60`, color: s.warna }}>
                        {s.no}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold mb-0.5" style={{ color: s.warna }}>{s.emoji} Soal No. {s.no}</p>
                        <p className="font-body text-sm text-white/80 leading-snug">{s.soal}</p>
                      </div>
                      {openSoal.includes(s.no)
                        ? <ChevronUp className="w-4 h-4 shrink-0 mt-1" style={{ color: s.warna }}/>
                        : <ChevronDown className="w-4 h-4 shrink-0 mt-1 text-white/30"/>}
                    </button>

                    {/* Pembahasan */}
                    {openSoal.includes(s.no) && (
                      <div className="px-4 pb-4 pt-1 space-y-3 border-t" style={{ borderColor: `${s.warna}25` }}>
                        {/* Diketahui */}
                        <div className="rounded-lg p-3 border" style={{ background:`${s.warna}10`, borderColor:`${s.warna}35`}}>
                          <p className="font-bold text-xs uppercase tracking-wide mb-2" style={{ color: s.warna }}>📋 Diketahui</p>
                          <ul className="space-y-0.5">
                            {s.diketahui.map((d, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-white/75 font-body">
                                <span style={{ color: s.warna }} className="mt-0.5">▸</span>{d}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Langkah */}
                        <div className="space-y-2">
                          <p className="font-bold text-xs uppercase tracking-wide text-slate-300">🧮 Langkah Penyelesaian</p>
                          {s.langkah.map((l, i) => (
                            <div key={i} className="rounded-lg p-3 border bg-slate-900/50 border-slate-700/40">
                              <p className="text-white/70 text-xs font-body mb-1">
                                <span className="font-bold" style={{ color: s.warna }}>Langkah {i+1}:</span> {l.teks}
                              </p>
                              {l.rumus && <BlockMath math={l.rumus}/>}
                            </div>
                          ))}
                        </div>
                        {/* Jawaban */}
                        <div className="rounded-lg p-3 border flex items-center gap-2"
                          style={{ background:`${s.warna}18`, borderColor:`${s.warna}50`}}>
                          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: s.warna }}/>
                          <p className="font-bold text-sm" style={{ color: s.warna }}>✅ {s.jawaban}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* ── RANGKUMAN ── */}
          <Card id="rangkuman" borderColor="rgba(251,191,36,.3)">
            <SectionBtn id="rangkuman" icon={<Sparkles className="w-5 h-5"/>} iconColor="text-yellow-400"
              title="📌 Rangkuman — Peta Rumus Lengkap" accent="rgba(251,191,36,.12)"/>
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { c:"#f97316", e:"🔶", t:"Lingkaran Dalam Persegi",      l:"L = r^2(4-\\pi)",         k:"K = 2r(4+\\pi)" },
                    { c:"#06b6d4", e:"🔵", t:"Persegi Panjang + ½ Lingkaran",l:"L = pt + \\tfrac{1}{2}\\pi r^2", k:"K = 2t + p + \\pi r" },
                    { c:"#a855f7", e:"🔺", t:"Segitiga − Lingkaran Dalam",   l:"L = L_\\triangle - \\pi r^2", k:"K = (a+b+c) + 2\\pi r" },
                    { c:"#ec4899", e:"💎", t:"Dua Lingkaran (Annulus)",       l:"L = \\pi(R^2-r^2)",       k:"K = 2\\pi(R+r)" },
                    { c:"#22c55e", e:"🟩", t:"Persegi Panjang − Lingkaran",  l:"L = pl - \\pi r^2",       k:"K = 2(p+l) + 2\\pi r" },
                    { c:"#10b981", e:"🌿", t:"Persegi − ¼ Lingkaran",        l:"L = r^2(1-\\tfrac{\\pi}{4})", k:"K = 2r + \\tfrac{\\pi r}{2}" },
                  ].map((x,i) => (
                    <div key={i} className="rounded-xl p-4 border space-y-2"
                      style={{ background:`${x.c}12`, borderColor:`${x.c}40`}}>
                      <p className="font-bold text-xs" style={{ color:x.c }}>{x.e} {x.t}</p>
                      <div className="space-y-1">
                        <p className="text-white/50 text-xs">Luas:</p>
                        <BlockMath math={x.l}/>
                        <p className="text-white/50 text-xs">Keliling:</p>
                        <BlockMath math={x.k}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tips box */}
                <div className="rounded-xl p-4 border" style={{ background:"rgba(251,191,36,.08)", borderColor:"rgba(251,191,36,.35)"}}>
                  <p className="text-yellow-300 font-bold text-sm mb-2">⚡ Tips Cepat Menjawab Soal</p>
                  <ul className="space-y-1.5 text-sm text-white/75 font-body">
                    {[
                      "Identifikasi bentuk utama dan bentuk yang dikurangi/ditambahkan.",
                      "Tentukan r (jari-jari) dari informasi sisi atau diameter yang diketahui.",
                      "Pilih π = 22/7 jika r kelipatan 7, pilih π = 3,14 untuk yang lain.",
                      "Ingat: keliling bangun gabungan tidak menghitung sisi yang berimpit.",
                      "Buat sketsa kasar → beri label → hitung → cek satuan.",
                    ].map((t,i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-400 font-bold mt-0.5">{i+1}.</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Motivasi */}
                <div className="rounded-xl p-4 text-center border"
                  style={{ background:"linear-gradient(135deg,rgba(99,102,241,.15),rgba(168,85,247,.15))", borderColor:"rgba(99,102,241,.35)"}}>
                  <p className="text-2xl mb-1">🚀</p>
                  <p className="font-display text-white font-bold text-sm">Matematika itu indah — setiap lingkaran</p>
                  <p className="font-display text-white font-bold text-sm">menyimpan rahasia tersendiri!</p>
                  <p className="text-white/40 text-xs mt-1 font-body">— NUMATIK · Buku Animasi Matematika Kelas 8</p>
                </div>
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};

export default BukuAnimasiKaitanBangunDatarLainnyaPage;
