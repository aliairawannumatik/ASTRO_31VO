import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── SVG: Three triangle types ── */
const TigaSegitigaSVG = () => (
  <svg viewBox="0 0 340 160" className="w-full max-w-sm mx-auto my-2" aria-label="Tiga jenis segitiga">
    <defs>
      <style>{`
        @keyframes glow{0%,100%{filter:drop-shadow(0 0 4px currentColor);}50%{filter:none;}}
        .t1{animation:glow 2s ease-in-out infinite;}
        .t2{animation:glow 2s ease-in-out infinite 0.7s;}
        .t3{animation:glow 2s ease-in-out infinite 1.4s;}
      `}</style>
    </defs>
    {/* Lancip (Acute) */}
    <polygon points="55,130 10,130 33,60" fill="rgba(34,197,94,0.25)" stroke="#22c55e" strokeWidth="2" className="t1"/>
    <text x="33" y="148" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">LANCIP</text>
    <text x="33" y="158" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">a²+b² {'>'} c²</text>
    <text x="33" y="50" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace">semua sudut &lt;90°</text>

    {/* Divider */}
    <line x1="115" y1="55" x2="115" y2="140" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>

    {/* Siku-siku (Right) */}
    <polygon points="205,130 130,130 130,60" fill="rgba(59,130,246,0.25)" stroke="#3b82f6" strokeWidth="2" className="t2"/>
    <polyline points="130,110 150,110 150,130" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.8"/>
    <text x="167" y="148" fill="#60a5fa" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">SIKU-SIKU</text>
    <text x="167" y="158" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">a²+b² = c²</text>
    <text x="167" y="50" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="monospace">tepat 1 sudut =90°</text>

    {/* Divider */}
    <line x1="225" y1="55" x2="225" y2="140" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>

    {/* Tumpul (Obtuse) */}
    <polygon points="320,130 235,130 268,75" fill="rgba(249,115,22,0.25)" stroke="#f97316" strokeWidth="2" className="t3"/>
    <text x="278" y="148" fill="#fb923c" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">TUMPUL</text>
    <text x="278" y="158" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">a²+b² {'<'} c²</text>
    <text x="278" y="50" fill="#fb923c" fontSize="8" textAnchor="middle" fontFamily="monospace">1 sudut {'>'} 90°</text>
  </svg>
);

/* ── Interactive triangle type checker ── */
const TriangleTypeChecker = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [result, setResult] = useState<null | string>(null);
  const [color, setColor] = useState("");

  const check = () => {
    const sides = [parseFloat(a), parseFloat(b), parseFloat(c)].filter(v => !isNaN(v) && v > 0);
    if (sides.length < 3) { setResult("Masukkan tiga sisi yang valid!"); setColor("text-white/60"); return; }
    sides.sort((x, y) => x - y);
    const [s1, s2, s3] = sides;
    if (s1 + s2 <= s3) { setResult("❌ Bukan segitiga valid (tidak memenuhi syarat segitiga)!"); setColor("text-red-300"); return; }
    const sum = s1*s1 + s2*s2;
    const hyp = s3*s3;
    if (Math.abs(sum - hyp) < 0.001) { setResult("✅ Segitiga SIKU-SIKU — a² + b² = c² tepat!"); setColor("text-blue-300"); }
    else if (sum > hyp) { setResult("🔺 Segitiga LANCIP — a² + b² > c², semua sudut < 90°"); setColor("text-green-300"); }
    else { setResult("🔶 Segitiga TUMPUL — a² + b² < c², ada sudut > 90°"); setColor("text-orange-300"); }
  };

  return (
    <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-4 space-y-3">
      <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">🔬 Tentukan Jenis Segitigamu!</p>
      <div className="flex gap-2 flex-wrap">
        {[{val:a,set:setA,label:"Sisi a"},{val:b,set:setB,label:"Sisi b"},{val:c,set:setC,label:"Sisi c (terpanjang)"}].map(({val,set,label})=>(
          <div key={label} className="flex flex-col gap-1">
            <label className="font-body text-xs text-white/50">{label}</label>
            <input type="number" min="0.1" step="0.1" value={val}
              onChange={e=>{set(e.target.value);setResult(null);}}
              className="w-24 bg-slate-900/60 border border-slate-500 rounded-lg px-3 py-2 text-white text-sm font-body focus:outline-none"
              placeholder="..."/>
          </div>
        ))}
        <button onClick={check}
          className="mt-5 px-4 py-2 bg-cyan-700/60 border border-cyan-500 text-cyan-300 rounded-lg text-xs font-bold font-body hover:bg-cyan-600/60 transition-colors cursor-pointer">
          Cek!
        </button>
      </div>
      {result && (
        <div className="bg-slate-900/60 border border-slate-600 rounded-lg p-3">
          <p className={`font-body text-sm font-bold ${color}`}>{result}</p>
          {a && b && c && !isNaN(parseFloat(a)) && !isNaN(parseFloat(b)) && !isNaN(parseFloat(c)) && (
            <p className="font-body text-xs text-white/50 mt-1">
              a²+b² = {(parseFloat(a)**2+parseFloat(b)**2).toFixed(2)}, c² = {(parseFloat(c)**2).toFixed(2)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const JenisSegitigaPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro","jenis","contoh1","contoh2","contoh3","rangkuman"]);

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
          PYTHAGORAS DAN JENIS-JENIS SEGITIGA
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Teorema Pythagoras · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Pythagoras Sebagai Pendeteksi Jenis Segitiga"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Siapa sangka, Teorema Pythagoras bukan hanya untuk menghitung sisi! Ia juga bisa kita gunakan sebagai <strong className="text-cyan-300">"detektor"</strong> untuk menentukan apakah sebuah segitiga lancip, siku-siku, atau tumpul — hanya dengan membandingkan kuadrat sisi-sisinya.
                </p>
                <TigaSegitigaSVG/>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <p className="text-cyan-300 font-semibold text-sm">🔑 Kunci Penentuan Jenis Segitiga</p>
                  <p className="font-body text-xs text-white/60 mb-2">Misalkan <InlineMath math="c"/> adalah sisi terpanjang dari segitiga dengan sisi <InlineMath math="a \leq b \leq c"/>:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-blue-900/30 rounded-lg px-3 py-2">
                      <span className="text-blue-300 text-lg">▪</span>
                      <div>
                        <p className="font-body text-sm text-blue-300 font-bold">Siku-siku: <InlineMath math="a^2 + b^2 = c^2"/></p>
                        <p className="font-body text-xs text-white/60">Tepat satu sudut = 90°</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-green-900/30 rounded-lg px-3 py-2">
                      <span className="text-green-300 text-lg">▲</span>
                      <div>
                        <p className="font-body text-sm text-green-300 font-bold">Lancip: <InlineMath math="a^2 + b^2 > c^2"/></p>
                        <p className="font-body text-xs text-white/60">Semua sudut kurang dari 90°</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-orange-900/30 rounded-lg px-3 py-2">
                      <span className="text-orange-300 text-lg">▶</span>
                      <div>
                        <p className="font-body text-sm text-orange-300 font-bold">Tumpul: <InlineMath math="a^2 + b^2 < c^2"/></p>
                        <p className="font-body text-xs text-white/60">Ada satu sudut lebih dari 90°</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* JENIS DETAIL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="jenis" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title="📐 Detail Tiga Jenis Segitiga"/>
            {open.includes("jenis") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Dengan membandingkan <InlineMath math="a^2 + b^2"/> dan <InlineMath math="c^2"/>, kita bisa <strong className="text-cyan-300">mengklasifikasikan setiap segitiga</strong> tanpa harus mengukur sudutnya secara langsung. Ini sangat berguna di bidang teknik dan arsitektur!
                  </p>
                </div>
                <TriangleTypeChecker/>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Tips:</strong> Selalu urutkan sisi dari kecil ke besar dulu. Sisi terpanjang itulah yang menjadi <InlineMath math="c"/> dalam perbandingan. Jangan sampai terbalik!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title="✏️ Contoh 1 — Identifikasi Segitiga (Mudah)"/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Tentukan jenis segitiga dengan panjang sisi <strong>6 cm, 8 cm, dan 10 cm</strong>!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Urutkan: <InlineMath math="a=6, b=8, c=10"/>. Bandingkan <InlineMath math="a^2+b^2"/> dan <InlineMath math="c^2"/>:</p>
                  <BlockMath math="a^2 + b^2 = 6^2 + 8^2 = 36 + 64 = 100"/>
                  <BlockMath math="c^2 = 10^2 = 100"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">✅ Karena <InlineMath math="100 = 100"/>, segitiga ini adalah <strong>SIKU-SIKU</strong> (triple 3-4-5 × 2).</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title="✏️ Contoh 2 — Segitiga Lancip atau Tumpul? (Sedang)"/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Seorang desainer interior mempunyai segitiga logam dengan sisi <strong>5 cm, 7 cm, dan 9 cm</strong>. Termasuk jenis apakah segitiga ini?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Urutkan: <InlineMath math="a=5, b=7, c=9"/>.</p>
                  <BlockMath math="a^2 + b^2 = 25 + 49 = 74"/>
                  <BlockMath math="c^2 = 81"/>
                  <p className="font-body text-sm text-white/80">Bandingkan: <InlineMath math="74 < 81"/></p>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">
                      ✅ Karena <InlineMath math="a^2+b^2 < c^2"/>, segitiga ini adalah <strong>TUMPUL</strong> — ada sudut yang lebih dari 90°.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title="✏️ Contoh 3 — Tentukan Nilai x agar Lancip (Sulit)"/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Segitiga mempunyai sisi <InlineMath math="x"/>, <InlineMath math="x+1"/>, dan <InlineMath math="x+2"/> (dimana <InlineMath math="x+2"/> adalah sisi terpanjang). Untuk nilai <InlineMath math="x"/> berapa segitiga ini menjadi <strong>lancip</strong>?
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Agar lancip: <InlineMath math="a^2 + b^2 > c^2"/></p>
                  <BlockMath math="x^2 + (x+1)^2 > (x+2)^2"/>
                  <p className="font-body text-sm text-white/80">Ekspansi:</p>
                  <BlockMath math="x^2 + x^2 + 2x + 1 > x^2 + 4x + 4"/>
                  <BlockMath math="2x^2 + 2x + 1 > x^2 + 4x + 4"/>
                  <BlockMath math="x^2 - 2x - 3 > 0"/>
                  <BlockMath math="(x-3)(x+1) > 0"/>
                  <p className="font-body text-sm text-white/80">Karena <InlineMath math="x > 0"/>, maka:</p>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="x > 3"/>
                    <p className="font-body text-sm text-red-200 text-center mt-1">✅ Segitiga menjadi lancip jika <strong><InlineMath math="x > 3"/></strong>. Contoh: sisi 4, 5, 6 adalah segitiga lancip.</p>
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
                  <p className="font-body text-sm text-white/80">• Urutkan sisi: <InlineMath math="a \leq b \leq c"/> lalu bandingkan <InlineMath math="a^2+b^2"/> dengan <InlineMath math="c^2"/>.</p>
                  <div className="grid grid-cols-3 gap-2 text-xs font-body mt-2">
                    <div className="bg-blue-900/40 rounded-lg p-2 text-center"><p className="text-blue-300 font-bold">= c²</p><p className="text-white/60">Siku-siku</p></div>
                    <div className="bg-green-900/40 rounded-lg p-2 text-center"><p className="text-green-300 font-bold">{`>`} c²</p><p className="text-white/60">Lancip</p></div>
                    <div className="bg-orange-900/40 rounded-lg p-2 text-center"><p className="text-orange-300 font-bold">{`<`} c²</p><p className="text-white/60">Tumpul</p></div>
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

export default JenisSegitigaPage;
