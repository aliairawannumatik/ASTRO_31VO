import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, Star } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── 5 Tipe Triple Pythagoras ── */
const LIMA_TIPE = [
  { tipe:1, a:3,  b:4,  c:5,  emoji:'🥇', label:'Triple Paling Dasar',
    text:'text-cyan-300',   bd:'border-cyan-500/60',   hdr:'bg-cyan-900/50',   chip:'bg-cyan-900/40'   },
  { tipe:2, a:5,  b:12, c:13, emoji:'🥈', label:'Triple Pelaut & Navigator',
    text:'text-green-300',  bd:'border-green-500/60',  hdr:'bg-green-900/50',  chip:'bg-green-900/40'  },
  { tipe:3, a:7,  b:24, c:25, emoji:'🥉', label:'Triple Tersembunyi',
    text:'text-violet-300', bd:'border-violet-500/60', hdr:'bg-violet-900/50', chip:'bg-violet-900/40' },
  { tipe:4, a:8,  b:15, c:17, emoji:'⭐', label:'Triple Para Arsitek',
    text:'text-yellow-300', bd:'border-yellow-500/60', hdr:'bg-yellow-900/50', chip:'bg-yellow-900/40' },
  { tipe:5, a:9,  b:40, c:41, emoji:'💎', label:'Triple Luar Biasa',
    text:'text-pink-300',   bd:'border-pink-500/60',   hdr:'bg-pink-900/50',   chip:'bg-pink-900/40'   },
];

/* ── SVG: Triple verification bar chart ── */
const TripleVerifSVG = ({ a, b, c }: { a: number; b: number; c: number }) => {
  const max = c * c;
  const scaleW = 220 / max;
  return (
    <svg viewBox="0 0 300 90" className="w-full max-w-xs mx-auto" aria-label={`Verifikasi ${a}-${b}-${c}`}>
      <rect x="20" y="12" width={a*a*scaleW} height="16" rx="3" fill="#3b82f6" fillOpacity="0.85"/>
      <text x={a*a*scaleW+24} y="24" fill="#60a5fa" fontSize="9" fontFamily="monospace">{a}²={a*a}</text>
      <rect x="20" y="34" width={b*b*scaleW} height="16" rx="3" fill="#22c55e" fillOpacity="0.85"/>
      <text x={b*b*scaleW+24} y="46" fill="#4ade80" fontSize="9" fontFamily="monospace">{b}²={b*b}</text>
      <rect x="20" y="58" width={c*c*scaleW} height="16" rx="3" fill="#f97316" fillOpacity="0.85"/>
      <text x={c*c*scaleW+24} y="70" fill="#fb923c" fontSize="9" fontFamily="monospace">{c}²={c*c}</text>
      <text x="20" y="86" fill="#94a3b8" fontSize="8" fontFamily="monospace">{a}²+{b}²={a*a+b*b} = {c}²={c*c} ✓</text>
    </svg>
  );
};

/* ── Interactive Triple Checker ── */
const TripleChecker = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [result, setResult] = useState<null | boolean>(null);

  const check = () => {
    const na = parseInt(a), nb = parseInt(b), nc = parseInt(c);
    if (isNaN(na) || isNaN(nb) || isNaN(nc) || na <= 0 || nb <= 0 || nc <= 0) {
      setResult(null); return;
    }
    const sides = [na, nb, nc].sort((x, y) => x - y);
    setResult(sides[0]**2 + sides[1]**2 === sides[2]**2);
  };

  return (
    <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-4 space-y-3">
      <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">🔬 Cek Triple Pythagoras Sendiri!</p>
      <div className="flex gap-2 items-center flex-wrap">
        {[{val:a,set:setA,label:"Sisi 1",col:"border-blue-500"},{val:b,set:setB,label:"Sisi 2",col:"border-green-500"},{val:c,set:setC,label:"Sisi 3",col:"border-orange-500"}].map(({val,set,label,col})=>(
          <div key={label} className="flex flex-col gap-1">
            <label className="font-body text-xs text-white/50">{label}</label>
            <input
              type="number" min="1" value={val}
              onChange={e => { set(e.target.value); setResult(null); }}
              className={`w-20 bg-slate-900/60 border ${col} rounded-lg px-3 py-2 text-white text-sm font-body focus:outline-none`}
              placeholder="..."
            />
          </div>
        ))}
        <button
          onClick={check}
          className="mt-5 px-4 py-2 bg-cyan-700/60 border border-cyan-500 text-cyan-300 rounded-lg text-xs font-bold font-body hover:bg-cyan-600/60 transition-colors cursor-pointer"
        >
          Cek!
        </button>
      </div>
      {result !== null && (
        <div className={`rounded-lg p-3 border ${result ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50"}`}>
          <p className={`font-body text-sm font-bold ${result ? "text-green-300" : "text-red-300"}`}>
            {result ? `✅ ${a}-${b}-${c} adalah Triple Pythagoras!` : `❌ ${a}-${b}-${c} bukan Triple Pythagoras.`}
          </p>
        </div>
      )}
    </div>
  );
};

const TriplePythagorasPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro","daftar","pola","contoh1","contoh2","contoh3","rangkuman"]);

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
          TRIPLE PYTHAGORAS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Teorema Pythagoras · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Apa Itu Triple Pythagoras?"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">Triple Pythagoras</strong> adalah kumpulan tiga bilangan bulat positif yang memenuhi persamaan <InlineMath math="a^2 + b^2 = c^2"/>. Jika kamu hafal triple-triple ini, kamu bisa langsung mengenali segitiga siku-siku tanpa perlu menghitung akar — ini trik cepat favorit para matematikawan!
                  </p>
                </div>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu sedang di ujian dan muncul segitiga dengan kaki 5 cm dan 12 cm. Tanpa kalkulator, kamu bisa langsung bilang "hipotenusanya 13 cm!" karena kamu hafal triple <strong className="text-yellow-300">5-12-13</strong>. Keren, kan? 🚀
                </p>

                {/* ── Attractive 5-12-13 Triangle ── */}
                <div className="relative rounded-2xl overflow-hidden border border-yellow-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-950/60 to-slate-900/90 p-4">
                  <p className="text-center text-xs font-bold text-yellow-300 uppercase tracking-widest mb-3 font-body">
                    ✨ Segitiga 5 – 12 – 13
                  </p>
                  <svg
                    viewBox="0 0 380 230"
                    className="w-full max-w-sm mx-auto block"
                    aria-label="Segitiga siku-siku 5-12-13"
                  >
                    <defs>
                      <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.25"/>
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                      <filter id="glowStrong">
                        <feGaussianBlur stdDeviation="5" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                      <marker id="arrowC" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                        <path d="M0,0 L8,4 L0,8 Z" fill="#facc15"/>
                      </marker>
                    </defs>

                    {/* Triangle fill */}
                    <polygon points="50,190 290,190 50,50" fill="url(#triGrad)" stroke="none"/>

                    {/* Sides — bottom (kaki 12), left (kaki 5), hypotenuse */}
                    {/* Bottom side — 12 cm — cyan */}
                    <line x1="50" y1="190" x2="290" y2="190" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)"/>
                    {/* Left side — 5 cm — green */}
                    <line x1="50" y1="190" x2="50" y2="50" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)"/>
                    {/* Hypotenuse — 13 cm — yellow */}
                    <line x1="290" y1="190" x2="50" y2="50" stroke="#facc15" strokeWidth="4" strokeLinecap="round" filter="url(#glowStrong)"/>

                    {/* Right angle marker */}
                    <polyline points="50,170 70,170 70,190" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinejoin="round"/>

                    {/* Vertex dots */}
                    <circle cx="50"  cy="190" r="5" fill="#4ade80"  filter="url(#glow)"/>
                    <circle cx="290" cy="190" r="5" fill="#22d3ee"  filter="url(#glow)"/>
                    <circle cx="50"  cy="50"  r="5" fill="#facc15"  filter="url(#glowStrong)"/>

                    {/* Vertex labels */}
                    <text x="30"  y="210" fill="#4ade80" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
                    <text x="295" y="210" fill="#22d3ee" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
                    <text x="34"  y="44"  fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>

                    {/* Side labels */}
                    {/* BC = 12 cm — below */}
                    <text x="160" y="215" fill="#22d3ee" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">12 cm</text>
                    {/* AC = 5 cm — left */}
                    <text x="26"  y="125" fill="#4ade80" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">5 cm</text>
                    {/* AB = 13 cm — hypotenuse */}
                    <text x="186" y="108" fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-33,186,108)">13 cm</text>

                    {/* Badge: ✓ */}
                    <rect x="285" y="30" width="80" height="28" rx="8" fill="#1e1b4b" stroke="#facc15" strokeWidth="1.5" opacity="0.9"/>
                    <text x="325" y="49" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">5²+12²=13²✓</text>

                    {/* Angle arc at C */}
                    <path d="M50,170 A20,20,0,0,1,70,190" fill="none" stroke="#4ade80" strokeWidth="1.5" opacity="0.8"/>
                    <text x="76" y="183" fill="#4ade80" fontSize="10" fontFamily="monospace">90°</text>
                  </svg>

                  {/* Legend row */}
                  <div className="flex justify-center gap-5 mt-2 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="inline-block w-5 h-1 rounded" style={{background:'#4ade80', boxShadow:'0 0 6px #4ade80'}}/>
                      <span className="text-green-300">Kaki = 5 cm</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="inline-block w-5 h-1 rounded" style={{background:'#22d3ee', boxShadow:'0 0 6px #22d3ee'}}/>
                      <span className="text-cyan-300">Kaki = 12 cm</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="inline-block w-5 h-1 rounded" style={{background:'#facc15', boxShadow:'0 0 8px #facc15'}}/>
                      <span className="text-yellow-300">Hipotenusa = 13 cm</span>
                    </span>
                  </div>
                </div>

                <TripleVerifSVG a={3} b={4} c={5}/>
              </div>
            )}
          </div>

          {/* DAFTAR TRIPLE — 5 TIPE BERWARNA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="daftar" icon={<Star className="w-5 h-5"/>} iconColor="text-yellow-400" title="🏆 5 Tipe Triple Pythagoras Wajib Hafal"/>
            {open.includes("daftar") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Headline banner */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 p-4 text-center"
                  style={{background:'linear-gradient(135deg,rgba(8,145,178,0.35) 0%,rgba(124,58,237,0.35) 50%,rgba(219,39,119,0.35) 100%)'}}>
                  <p className="font-display text-base md:text-lg font-black text-white tracking-wide">
                    ⚡ 5 TIPE DASAR — INDUK SEMUA TRIPLE
                  </p>
                  <p className="font-body text-xs text-white/60 mt-1">
                    Setiap triple Pythagoras (umumnya) adalah kelipatan dari salah satu ke-5 tipe ini!
                  </p>
                </div>

                {/* 5 Tipe cards */}
                {LIMA_TIPE.map(({ tipe, a, b, c, emoji, label, text, bd, hdr, chip }) => (
                  <div key={tipe} className={`border ${bd} rounded-xl overflow-hidden`}>
                    {/* Card header */}
                    <div className={`${hdr} px-4 py-3 flex items-center justify-between gap-2`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">{emoji}</span>
                        <div className="min-w-0">
                          <p className={`font-display text-xs font-black ${text} uppercase tracking-[0.15em]`}>TIPE {tipe}</p>
                          <p className="text-white/50 text-xs truncate">{label}</p>
                        </div>
                      </div>
                      <div className={`font-mono font-black text-xl md:text-2xl ${text} flex-shrink-0`}>
                        {a} – {b} – {c}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="px-4 py-3 bg-slate-900/30 space-y-3">
                      {/* Verification row */}
                      <div className="bg-slate-800/70 rounded-lg px-3 py-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono">
                        <span className="text-blue-300">{a}²</span>
                        <span className="text-white/30">+</span>
                        <span className="text-green-300">{b}²</span>
                        <span className="text-white/30">=</span>
                        <span className="text-blue-300">{a*a}</span>
                        <span className="text-white/30">+</span>
                        <span className="text-green-300">{b*b}</span>
                        <span className="text-white/30">=</span>
                        <span className="text-white font-bold">{a*a+b*b}</span>
                        <span className="text-white/30">=</span>
                        <span className="text-orange-300">{c}²</span>
                        <span className="text-white/30">=</span>
                        <span className="text-orange-300">{c*c}</span>
                        <span className={`font-bold ${text} ml-1`}>✓</span>
                      </div>

                      {/* Kelipatan grid */}
                      <div>
                        <p className="text-xs text-white/40 mb-1.5 font-body">🔢 Kelipatan (juga Triple Pythagoras):</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {[2, 3, 4, 5].map(k => (
                            <div key={k} className={`${chip} rounded-lg px-2 py-2 text-center border border-white/5`}>
                              <p className="text-[10px] text-white/40 font-body">×{k}</p>
                              <p className={`text-xs font-bold font-mono ${text}`}>{a*k}–{b*k}–{c*k}</p>
                              <p className="text-[9px] text-white/30 font-mono">{a*a*k*k+b*b*k*k}={c*c*k*k}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Rumus kelipatan */}
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <p className="text-cyan-300 font-semibold text-sm">📌 Mengapa Kelipatan Juga Berlaku?</p>
                  <p className="font-body text-xs text-white/70">
                    Jika <InlineMath math="(a, b, c)"/> triple Pythagoras, maka untuk sembarang <InlineMath math="k > 0"/>:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="(ka)^2 + (kb)^2 = k^2(a^2+b^2) = k^2c^2 = (kc)^2 \checkmark"/>
                  </div>
                </div>

                {/* Triple di luar 5 tipe */}
                <div className="bg-amber-900/20 border-2 border-amber-500/50 rounded-xl overflow-hidden">
                  <div className="bg-amber-900/40 px-4 py-2 border-b border-amber-500/30">
                    <p className="font-display text-sm font-black text-amber-300 tracking-wide">
                      🌟 TRIPLE DI LUAR 5 TIPE — ADA LHO!
                    </p>
                  </div>
                  <div className="px-4 py-3 space-y-3">
                    <p className="font-body text-xs text-white/70">
                      Meskipun 5 tipe di atas sangat populer, <strong className="text-amber-300">ada triple Pythagoras yang bukan kelipatan dari kelimanya</strong>. Contoh paling terkenal:
                    </p>
                    <div className="bg-slate-800/60 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4">
                      <span className="text-4xl flex-shrink-0">💡</span>
                      <div className="min-w-0">
                        <p className="text-amber-300 font-mono font-black text-2xl tracking-wide">20 – 21 – 29</p>
                        <div className="mt-1 text-xs font-mono text-white/60 flex flex-wrap gap-x-2">
                          <span>20²+21² = 400+441 =</span>
                          <span className="text-green-300 font-bold">841</span>
                          <span>= 29² ✓</span>
                        </div>
                        <p className="text-xs text-white/40 mt-1 font-body italic">Bukan kelipatan dari Tipe 1–5 manapun!</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg px-3 py-2">
                      <p className="text-xs font-body text-white/60">
                        Triple seperti <strong className="text-amber-300">20-21-29</strong> disebut <strong className="text-amber-300">triple primitif</strong> — ketiga anggotanya tidak punya faktor persekutuan selain 1
                        (FPB = 1). Ini membuktikan bahwa dunia triple Pythagoras sangat luas!
                      </p>
                    </div>
                  </div>
                </div>

                <TripleChecker/>
              </div>
            )}
          </div>

          {/* POLA KELIPATAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="pola" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title="📐 Tabel Ringkas 5 Tipe + Kelipatannya"/>
            {open.includes("pola") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-xs text-white/60">Lihat sekilas: baris biru = triple dasar (k=1), baris biasa = kelipatannya.</p>
                <div className="overflow-x-auto rounded-xl border border-slate-600">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-800/90">
                        <th className="px-3 py-2 text-left text-white/50">k</th>
                        {LIMA_TIPE.map(t => (
                          <th key={t.tipe} className={`px-3 py-2 text-center ${t.text}`}>
                            {t.emoji} Tipe {t.tipe}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1,2,3,4,5].map(k => (
                        <tr key={k} className={k===1 ? 'bg-cyan-900/20 border-l-2 border-cyan-500' : k%2===0 ? 'bg-slate-900/40' : 'bg-slate-800/20'}>
                          <td className="px-3 py-1.5 text-white/50 font-bold">×{k}</td>
                          {LIMA_TIPE.map(t => (
                            <td key={t.tipe} className={`px-3 py-1.5 text-center ${k===1 ? t.text+' font-bold' : 'text-white/70'}`}>
                              {t.a*k}–{t.b*k}–{t.c*k}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-slate-800/40 border border-slate-600 rounded-lg px-4 py-2">
                  <p className="font-body text-xs text-white/50">
                    💡 <strong className="text-white/70">Cara cepat:</strong> Lihat apakah dua kaki segitiga bisa dibagi bilangan yang sama. Jika hasil baginya cocok dengan tipe 1–5, langsung tahu sisi miringnya!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title="✏️ Contoh 1 — Kenali Triple Langsung (Mudah)"/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Segitiga ABC siku-siku di C, dengan <InlineMath math="AC = 5"/> cm dan <InlineMath math="BC = 12"/> cm. Tanpa menghitung akar, berapakah panjang AB?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Kenali pola: kaki-kaki bernilai 5 dan 12. Ini adalah triple Pythagoras <strong className="text-yellow-300">5-12-13</strong>!</p>
                  <BlockMath math="AB = \sqrt{5^2 + 12^2} = \sqrt{25 + 144} = \sqrt{169} = 13 \text{ cm}"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">✅ <InlineMath math="AB = 13"/> cm. Dengan hafal triple 5-12-13, tidak perlu kalkulator!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title="✏️ Contoh 2 — Kelipatan Triple (Sedang)"/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah kolam renang berbentuk segitiga siku-siku. Dua sisinya berukuran <strong>30 m</strong> dan <strong>40 m</strong>. Apakah kolam ini menggunakan triple Pythagoras? Tentukan sisi miringnya!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Cek apakah 30 dan 40 merupakan kelipatan dari triple dasar:</p>
                  <BlockMath math="30 = 10 \times 3, \quad 40 = 10 \times 4"/>
                  <p className="font-body text-sm text-white/80">Ini adalah triple <strong className="text-yellow-300">3-4-5</strong> dikalikan <strong className="text-cyan-300">10</strong>! Maka sisi miring:</p>
                  <BlockMath math="c = 10 \times 5 = 50 \text{ m}"/>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">✅ Ya, ini kelipatan triple 3-4-5. Sisi miring kolam = <strong>50 m</strong>.</p>
                  </div>
                  <TripleVerifSVG a={30} b={40} c={50}/>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title="✏️ Contoh 3 — Temukan Triple yang Hilang (Sulit)"/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah segitiga siku-siku memiliki hipotenusa 85 cm dan salah satu kakinya 13 cm. Apakah ini merupakan triple Pythagoras? Jika ya, sebutkan triple-nya!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="c = 85"/>, <InlineMath math="a = 13"/>. Cari kaki lain:</p>
                  <BlockMath math="b = \sqrt{c^2 - a^2} = \sqrt{85^2 - 13^2}"/>
                  <BlockMath math="b = \sqrt{7225 - 169} = \sqrt{7056}"/>
                  <p className="font-body text-sm text-white/80">Apakah 7056 bilangan kuadrat sempurna?</p>
                  <BlockMath math="\sqrt{7056} = 84 \quad \text{(karena } 84^2 = 7056\text{)}"/>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">✅ Triple Pythagoras: <strong className="text-yellow-300">13 – 84 – 85</strong>. Ini adalah triple asli (bukan kelipatan triple lain)!</p>
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
                  <p className="font-body text-sm text-white/80">• <strong className="text-cyan-300">Triple Pythagoras:</strong> tiga bilangan bulat positif <InlineMath math="a, b, c"/> dengan <InlineMath math="a^2+b^2=c^2"/>.</p>
                  <p className="font-body text-sm text-white/80">• Triple wajib hafal: <strong className="text-yellow-300">3-4-5, 5-12-13, 8-15-17, 7-24-25</strong>.</p>
                  <p className="font-body text-sm text-white/80">• Kelipatan triple juga valid: <InlineMath math="(ka, kb, kc)"/> untuk sembarang <InlineMath math="k > 0"/>.</p>
                  <p className="font-body text-sm text-white/80">• Mengenali triple = menyelesaikan soal lebih cepat tanpa kalkulator.</p>
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

export default TriplePythagorasPage;
