import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── SVG: 45-45-90 triangle ── */
const Sudut4545SVG = () => (
  <svg viewBox="0 0 200 180" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga 45-45-90">
    <defs>
      <style>{`@keyframes glow45{0%,100%{opacity:1;}50%{opacity:0.4;}}.g45{animation:glow45 2s ease-in-out infinite;}`}</style>
    </defs>
    {/* Triangle */}
    <polygon points="20,150 140,150 20,30" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="2"/>
    {/* Right angle mark */}
    <polyline points="20,130 40,130 40,150" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.8"/>
    {/* Sides */}
    <line x1="20" y1="30" x2="20" y2="150" stroke="#3b82f6" strokeWidth="2.5" className="g45"/>
    <line x1="20" y1="150" x2="140" y2="150" stroke="#22c55e" strokeWidth="2.5" className="g45"/>
    <line x1="20" y1="30" x2="140" y2="150" stroke="#f97316" strokeWidth="2.5"/>
    {/* Angle labels */}
    <text x="145" y="155" fill="#eab308" fontSize="10" fontFamily="monospace">45°</text>
    <text x="25" y="28" fill="#eab308" fontSize="10" fontFamily="monospace">45°</text>
    <text x="44" y="148" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">90°</text>
    {/* Side labels */}
    <text x="6" y="95" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">a</text>
    <text x="80" y="163" fill="#4ade80" fontSize="12" fontWeight="bold" textAnchor="middle">a</text>
    <text x="92" y="88" fill="#fb923c" fontSize="12" fontWeight="bold">a√2</text>
    {/* Info box */}
    <rect x="0" y="170" width="200" height="10" fill="none"/>
    <text x="100" y="178" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Perbandingan: a : a : a√2</text>
  </svg>
);

/* ── SVG: 30-60-90 triangle ── */
const Sudut3060SVG = () => (
  <svg viewBox="0 0 240 200" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga 30-60-90">
    <defs>
      <style>{`@keyframes glow30{0%,100%{opacity:1;}50%{opacity:0.4;}}.g30{animation:glow30 2s ease-in-out infinite;}`}</style>
    </defs>
    {/* Triangle */}
    <polygon points="20,160 200,160 20,70" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2"/>
    {/* Right angle mark */}
    <polyline points="20,140 40,140 40,160" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.8"/>
    {/* Sides */}
    <line x1="20" y1="70" x2="20" y2="160" stroke="#3b82f6" strokeWidth="2.5" className="g30"/>
    <line x1="20" y1="160" x2="200" y2="160" stroke="#22c55e" strokeWidth="2.5" className="g30"/>
    <line x1="20" y1="70" x2="200" y2="160" stroke="#f97316" strokeWidth="2.5"/>
    {/* Angle labels */}
    <text x="205" y="165" fill="#eab308" fontSize="10" fontFamily="monospace">30°</text>
    <text x="25" y="68" fill="#eab308" fontSize="10" fontFamily="monospace">60°</text>
    <text x="44" y="158" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">90°</text>
    {/* Side labels */}
    <text x="7" y="118" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">a</text>
    <text x="110" y="175" fill="#4ade80" fontSize="12" fontWeight="bold" textAnchor="middle">a√3</text>
    <text x="125" y="108" fill="#fb923c" fontSize="12" fontWeight="bold">2a</text>
    {/* Info box */}
    <text x="120" y="195" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Perbandingan: a : a√3 : 2a</text>
  </svg>
);

/* ── Interactive Triangle Explorer ── */
const TriangleInteraktif = () => {
  const [mode, setMode] = useState<'45' | '30'>('45');
  const [a, setA] = useState(4);

  const SVG_W = 300, SVG_H = 218;
  const CX = 38, CY = 185;   // right-angle vertex (bottom-left)

  const PX = mode === '45' ? 15 : 13;      // px per unit of 'a'
  const shortPx = a * PX;
  const longPx  = mode === '45' ? a * PX : a * PX * Math.sqrt(3);

  const AX = CX, AY = CY - shortPx;       // top vertex (end of short leg)
  const BX = CX + longPx, BY = CY;        // right vertex (end of long leg)

  const shortVal = a;
  const longVal  = mode === '45' ? a : +(a * Math.sqrt(3)).toFixed(2);
  const hypVal   = mode === '45' ? +(a * Math.sqrt(2)).toFixed(2) : 2 * a;

  const shortSym = 'a';
  const longSym  = mode === '45' ? 'a' : 'a√3';
  const hypSym   = mode === '45' ? 'a√2' : '2a';

  const ratioStr   = mode === '45' ? '1 : 1 : √2' : '1 : √3 : 2';
  const triColor   = mode === '45' ? 'rgba(168,85,247,0.18)' : 'rgba(34,197,94,0.18)';
  const edgeColor  = mode === '45' ? '#a855f7' : '#22c55e';
  const accentHex  = mode === '45' ? '#a855f7' : '#22c55e';

  const hypMidX = (AX + BX) / 2;
  const hypMidY = (AY + BY) / 2;
  const showLabels = shortPx >= 26;
  const MK = 11;

  const txtShadow = { stroke: 'rgba(2,6,23,0.85)', strokeWidth: 2, paintOrder: 'stroke' as const };

  return (
    <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">🎛️ Eksplorasi Interaktif</p>
        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${mode==='45' ? 'bg-purple-900/50 text-purple-200 border-purple-500/40' : 'bg-green-900/50 text-green-200 border-green-500/40'}`}>
          Rasio tetap: {ratioStr}
        </span>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 gap-2">
        {(['45','30'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setA(4); }}
            className={`py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
              mode === m
                ? m === '45' ? 'bg-purple-600 text-white border-purple-500' : 'bg-green-700 text-white border-green-600'
                : 'bg-slate-700/50 text-slate-400 border-slate-600 hover:border-slate-500'
            }`}>
            {m === '45' ? '▪ 45°–45°–90°' : '▲ 30°–60°–90°'}
          </button>
        ))}
      </div>

      {/* SVG */}
      <div className="relative">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
          <defs>
            <filter id="triGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Faint grid guide lines */}
          <line x1={CX} y1="8" x2={CX} y2={CY} stroke="rgba(100,116,139,0.18)" strokeWidth="1" strokeDasharray="4 4"/>
          <line x1={CX} y1={CY} x2={SVG_W-4} y2={CY} stroke="rgba(100,116,139,0.18)" strokeWidth="1" strokeDasharray="4 4"/>

          {/* Triangle fill */}
          <polygon
            points={`${CX},${AY} ${BX},${BY} ${CX},${CY}`}
            fill={triColor} stroke={edgeColor} strokeWidth="1.5" strokeLinejoin="round"
          />

          {/* Sides */}
          <line x1={CX} y1={CY} x2={AX} y2={AY} stroke="#3b82f6" strokeWidth="2.8" strokeLinecap="round"/>
          <line x1={CX} y1={CY} x2={BX} y2={BY} stroke="#22c55e" strokeWidth="2.8" strokeLinecap="round"/>
          <line x1={AX} y1={AY} x2={BX} y2={BY} stroke="#f97316" strokeWidth="2.8" strokeLinecap="round"/>

          {/* Right angle mark */}
          <polyline
            points={`${CX},${CY-MK} ${CX+MK},${CY-MK} ${CX+MK},${CY}`}
            fill="none" stroke="#94a3b8" strokeWidth="1.5"
          />

          {/* Angle labels */}
          {showLabels && <>
            <text x={AX+7} y={AY+15} fill="#eab308" fontSize="11" fontFamily="sans-serif" fontWeight="bold" {...txtShadow}>
              {mode==='45' ? '45°' : '60°'}
            </text>
            <text x={Math.max(BX-22, CX+28)} y={BY-4} fill="#eab308" fontSize="11" fontFamily="sans-serif" fontWeight="bold" {...txtShadow}>
              {mode==='45' ? '45°' : '30°'}
            </text>
          </>}
          <text x={CX+14} y={CY-3} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">90°</text>

          {/* Side value labels */}
          {showLabels && <>
            {/* short leg — left of vertical */}
            <text x={CX-5} y={(CY+AY)/2+4}
              fill="#60a5fa" fontSize="11" fontWeight="bold" fontFamily="sans-serif"
              textAnchor="end" {...txtShadow}>
              {shortVal}
            </text>
            {/* long leg — below horizontal */}
            <text x={Math.min((CX+BX)/2, SVG_W-40)} y={CY+16}
              fill="#4ade80" fontSize="11" fontWeight="bold" fontFamily="sans-serif"
              textAnchor="middle" {...txtShadow}>
              {longVal}
            </text>
            {/* hypotenuse — beside mid-point */}
            <text x={Math.min(hypMidX+7, SVG_W-56)} y={Math.max(hypMidY-7, 16)}
              fill="#fb923c" fontSize="11" fontWeight="bold" fontFamily="sans-serif"
              {...txtShadow}>
              {mode === '45' ? `${a}√2` : String(hypVal)}
            </text>
          </>}

          {/* Vertex dots */}
          <circle cx={CX} cy={CY} r="5" fill={accentHex} opacity="0.85"/>
          <circle cx={AX} cy={AY} r="5" fill="#3b82f6" opacity="0.85"/>
          <circle cx={BX} cy={BY} r="5" fill="#22c55e" opacity="0.85"/>

          {/* Vertex labels */}
          <text x={CX-12} y={CY+5} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">C</text>
          {showLabels && <>
            <text x={AX-18} y={AY-4} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">A</text>
            <text x={BX+4}  y={BY+5} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">B</text>
          </>}
        </svg>
      </div>

      {/* Slider */}
      <div className="space-y-2 px-1">
        <div className="flex justify-between items-center">
          <label className="font-body text-xs text-white/70">
            🔍 Geser untuk memperbesar segitiga (<em>a</em> = kelipatan dasar):
          </label>
          <span className={`text-sm font-bold px-2 py-0.5 rounded font-mono ${mode==='45' ? 'bg-purple-900/60 text-purple-200' : 'bg-green-900/60 text-green-200'}`}>
            a = {a}
          </span>
        </div>
        <input
          type="range" min="1" max="10" step="1" value={a}
          onChange={e => setA(+e.target.value)}
          className="w-full h-2 rounded-full cursor-pointer"
          style={{ accentColor: accentHex }}
        />
        <div className="flex justify-between text-xs text-slate-500 px-0.5 font-mono">
          {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n}>{n}</span>)}
        </div>
      </div>

      {/* Value cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Kaki pendek', sym: shortSym, val: shortVal, c: 'text-blue-300',   bg: 'bg-blue-900/25',   bd: 'border-blue-500/30'   },
          { label: mode==='45' ? 'Kaki (sama)' : 'Kaki panjang', sym: longSym, val: longVal, c: 'text-green-300',  bg: 'bg-green-900/25',  bd: 'border-green-500/30'  },
          { label: 'Hipotenusa',   sym: hypSym,   val: hypVal,   c: 'text-orange-300', bg: 'bg-orange-900/25', bd: 'border-orange-500/30' },
        ].map(({ label, sym, val, c, bg, bd }, idx) => (
          <div key={idx} className={`${bg} border ${bd} rounded-lg p-2 text-center`}>
            <p className="text-xs text-white/40 leading-tight">{label}</p>
            <p className={`font-bold text-sm mt-0.5 ${c}`}>{val} <span className="text-xs font-normal">cm</span></p>
            <p className="text-xs text-slate-500 font-mono">({sym})</p>
          </div>
        ))}
      </div>

      {/* Ratio reminder */}
      <div className={`border rounded-lg px-3 py-2 flex items-start gap-2 ${mode==='45' ? 'bg-purple-900/20 border-purple-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
        <span className="text-lg mt-0.5">✨</span>
        <div>
          <p className="font-body text-xs font-bold text-yellow-300">Rasio selalu tetap: {ratioStr}</p>
          <p className="font-body text-xs text-white/60 mt-0.5">
            {mode==='45'
              ? `Berapapun nilai a, sisi-sisinya selalu ${a} : ${a} : ${longVal === a ? `${a}×√2 ≈ ${hypVal}` : hypVal} — perbandingannya tidak pernah berubah!`
              : `Berapapun nilai a, sisi-sisinya selalu ${shortVal} : ${longVal} : ${hypVal} — perbandingannya tidak pernah berubah!`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Comparison Card ── */
const CompareCard = ({ title, ratio, color, sides, example }: {
  title: string; ratio: string; color: string; sides: string[]; example: { angles: string; vals: string[] }
}) => (
  <div className={`bg-slate-800/60 border ${color} rounded-xl p-4 space-y-3`}>
    <p className={`font-body text-sm font-bold ${color.replace("border-","text-").replace("/40","")}`}>{title}</p>
    <p className="font-body text-xs text-white/60">Perbandingan sisi: <span className="text-yellow-300 font-bold">{ratio}</span></p>
    <div className="grid grid-cols-3 gap-2">
      {sides.map((s,i)=>(
        <div key={i} className="bg-slate-900/50 rounded-lg p-2 text-center">
          <p className="font-body text-xs text-white/50">{["Kaki pendek","Kaki panjang","Hipotenusa"][i]}</p>
          <p className="font-body text-sm font-bold text-white">{s}</p>
        </div>
      ))}
    </div>
    <div className="bg-slate-700/50 rounded-lg p-2">
      <p className="font-body text-xs text-white/50">Contoh ({example.angles}):</p>
      <p className="font-body text-xs text-cyan-300 font-bold">{example.vals.join(" : ")}</p>
    </div>
  </div>
);

const SudutKhususPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro","interaktif","sudut45","sudut30","perbandingan","contoh1","contoh2","contoh3","rangkuman"]);

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
          PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Teorema Pythagoras · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Sudut Istimewa yang Wajib Dikuasai"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ada dua jenis segitiga siku-siku spesial yang perbandingan sisinya sudah bisa kita ketahui tanpa menghitung: segitiga <strong className="text-purple-300">45°-45°-90°</strong> dan segitiga <strong className="text-green-300">30°-60°-90°</strong>. Keduanya sering muncul di soal dan sangat berguna dalam kehidupan nyata!
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-body">
                  <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-3 text-center">
                    <p className="text-purple-300 font-bold mb-1">Segitiga Isosceles Siku-siku</p>
                    <p className="text-white/60">45° – 45° – 90°</p>
                    <p className="text-yellow-300 font-bold mt-1">a : a : a√2</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-3 text-center">
                    <p className="text-green-300 font-bold mb-1">Segitiga Setengah Sama Sisi</p>
                    <p className="text-white/60">30° – 60° – 90°</p>
                    <p className="text-yellow-300 font-bold mt-1">a : a√3 : 2a</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ANIMASI INTERAKTIF */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="interaktif" icon={<Target className="w-5 h-5"/>} iconColor="text-pink-400" title="🎮 Animasi Interaktif — Perbesar Segitiga Sudut Khusus"/>
            {open.includes("interaktif") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg px-4 py-2">
                  <p className="font-body text-xs text-pink-200">
                    💡 Geser slider untuk memperbesar atau memperkecil segitiga. Perhatikan bahwa <strong>rasio sisi selalu tetap</strong> meskipun ukurannya berubah — itulah kunci sudut khusus!
                  </p>
                </div>
                <TriangleInteraktif/>
              </div>
            )}
          </div>

          {/* SUDUT 45-45-90 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="sudut45" icon={<Target className="w-5 h-5"/>} iconColor="text-purple-400" title="📐 Segitiga 45°-45°-90°"/>
            {open.includes("sudut45") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Jika kamu memotong persegi dari pojok ke pojok, kamu mendapat dua segitiga <strong className="text-purple-300">45°-45°-90°</strong>. Kedua kakinya sama panjang (sebut <InlineMath math="a"/>), dan hipotenusanya adalah <InlineMath math="a\sqrt{2}"/>.
                </p>
                <Sudut4545SVG/>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-purple-300 font-semibold text-sm">🔢 Penurunan Rumus</p>
                  <p className="font-body text-sm text-white/80">Misalkan kedua kaki = <InlineMath math="a"/>. Gunakan Pythagoras:</p>
                  <BlockMath math="c = \sqrt{a^2 + a^2} = \sqrt{2a^2} = a\sqrt{2}"/>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                    <p className="font-body text-xs text-white/50 mb-1">Perbandingan sisi</p>
                    <BlockMath math="\text{kaki} : \text{kaki} : \text{hipotenusa} = a : a : a\sqrt{2} = 1 : 1 : \sqrt{2}"/>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Trik cepat:</strong> Dari kaki ke hipotenusa, <strong className="text-purple-300">kalikan dengan <InlineMath math="\sqrt{2}"/></strong>. Dari hipotenusa ke kaki, <strong className="text-purple-300">bagi dengan <InlineMath math="\sqrt{2}"/></strong> (atau kalikan <InlineMath math="\frac{\sqrt{2}}{2}"/>).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SUDUT 30-60-90 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="sudut30" icon={<Target className="w-5 h-5"/>} iconColor="text-green-400" title="📐 Segitiga 30°-60°-90°"/>
            {open.includes("sudut30") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Segitiga ini terbentuk jika kamu memotong segitiga sama sisi tepat di tengah. Sisi terpendek berhadapan dengan sudut 30°, sisi tengah berhadapan sudut 60°, dan sisi terpanjang (hipotenusa) berhadapan sudut 90°.
                </p>
                <Sudut3060SVG/>
                <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-green-300 font-semibold text-sm">🔢 Penurunan Rumus</p>
                  <p className="font-body text-sm text-white/80">Misalkan kaki terpendek (berhadapan 30°) = <InlineMath math="a"/>. Hipotenusa = <InlineMath math="2a"/>. Cari kaki panjang:</p>
                  <BlockMath math="b = \sqrt{(2a)^2 - a^2} = \sqrt{4a^2 - a^2} = \sqrt{3a^2} = a\sqrt{3}"/>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                    <BlockMath math="\text{kaki pendek} : \text{kaki panjang} : \text{hipotenusa} = a : a\sqrt{3} : 2a = 1 : \sqrt{3} : 2"/>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Trik cepat:</strong> Jika tahu kaki pendek (<InlineMath math="a"/>): kaki panjang = <InlineMath math="a\sqrt{3}"/>, hipotenusa = <InlineMath math="2a"/>. Selalu dari sudut terkecil ke terbesar: sisi ikut membesar!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PERBANDINGAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="perbandingan" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-cyan-400" title="📊 Tabel Perbandingan Sudut Khusus"/>
            {open.includes("perbandingan") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CompareCard
                    title="▪ Segitiga 45°-45°-90°"
                    ratio="1 : 1 : √2"
                    color="border-purple-500/40"
                    sides={["a", "a", "a√2"]}
                    example={{angles:"a=5", vals:["5", "5", "5√2 ≈ 7,07"]}}
                  />
                  <CompareCard
                    title="▲ Segitiga 30°-60°-90°"
                    ratio="1 : √3 : 2"
                    color="border-green-500/40"
                    sides={["a", "a√3", "2a"]}
                    example={{angles:"a=4", vals:["4", "4√3 ≈ 6,93", "8"]}}
                  />
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title="✏️ Contoh 1 — Segitiga 45-45-90 (Mudah)"/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah kain berbentuk segitiga siku-siku sama kaki dengan panjang kaki <strong>10 cm</strong>. Berapa panjang sisi miringnya?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Segitiga siku-siku sama kaki = segitiga 45°-45°-90°. Kaki = <InlineMath math="a = 10"/> cm.</p>
                  <p className="font-body text-sm text-white/80">Gunakan perbandingan <InlineMath math="1:1:\sqrt{2}"/>:</p>
                  <BlockMath math="c = a\sqrt{2} = 10\sqrt{2} \approx 14{,}14 \text{ cm}"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">✅ Sisi miring = <strong><InlineMath math="10\sqrt{2}"/> cm ≈ 14,14 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title="✏️ Contoh 2 — Segitiga 30-60-90 (Sedang)"/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah tiang lampu membentuk bayangan sepanjang <InlineMath math="6\sqrt{3}"/> m ketika sinar matahari membentuk sudut 30° dengan tanah. Berapa tinggi tiang lampu tersebut?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Situasi ini membentuk segitiga 30°-60°-90°. Bayangan = kaki panjang (berhadapan 60°) = <InlineMath math="6\sqrt{3}"/> m.</p>
                  <p className="font-body text-sm text-white/80">Gunakan perbandingan: kaki panjang = <InlineMath math="a\sqrt{3}"/>.</p>
                  <BlockMath math="a\sqrt{3} = 6\sqrt{3} \Rightarrow a = 6 \text{ m}"/>
                  <p className="font-body text-sm text-white/80">Tinggi tiang = kaki pendek = <InlineMath math="a"/>:</p>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="\text{Tinggi tiang} = 6 \text{ m}"/>
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">✅ Tiang lampu setinggi <strong>6 m</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title="✏️ Contoh 3 — Gabungan Dua Segitiga Khusus (Sulit)"/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah segitiga sama sisi ABC memiliki sisi 12 cm. Titik D adalah kaki tegak lurus dari A ke BC. Hitung panjang AD, lalu gunakan AD sebagai kaki segitiga 45-45-90 baru. Berapa hipotenusa segitiga baru itu?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Segitiga ABD adalah segitiga 30-60-90 (D di tengah BC, sudut B = 60°).</p>
                  <p className="font-body text-sm text-white/80">BD = ½ × 12 = 6 cm (kaki pendek). AD = kaki panjang:</p>
                  <BlockMath math="AD = BD \times \sqrt{3} = 6\sqrt{3} \text{ cm}"/>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Segitiga baru 45-45-90 dengan kaki = AD = <InlineMath math="6\sqrt{3}"/> cm.</p>
                  <BlockMath math="c = AD \times \sqrt{2} = 6\sqrt{3} \times \sqrt{2} = 6\sqrt{6} \text{ cm}"/>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="c = 6\sqrt{6} \approx 14{,}70 \text{ cm}"/>
                    <p className="font-body text-sm text-red-200 text-center mt-1">✅ Hipotenusa segitiga baru = <strong><InlineMath math="6\sqrt{6}"/> cm</strong> ≈ 14,70 cm.</p>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-body">
                    <div className="bg-purple-900/40 rounded-lg p-3">
                      <p className="text-purple-300 font-bold mb-1">45° – 45° – 90°</p>
                      <p className="text-white/80"><InlineMath math="1 : 1 : \sqrt{2}"/></p>
                      <p className="text-white/60 mt-1">Hipotenusa = kaki × √2</p>
                    </div>
                    <div className="bg-green-900/40 rounded-lg p-3">
                      <p className="text-green-300 font-bold mb-1">30° – 60° – 90°</p>
                      <p className="text-white/80"><InlineMath math="1 : \sqrt{3} : 2"/></p>
                      <p className="text-white/60 mt-1">Hipotenusa = 2 × kaki pendek</p>
                    </div>
                  </div>
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

export default SudutKhususPage;
