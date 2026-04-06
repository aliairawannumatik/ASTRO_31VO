import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, Star } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── Known Pythagorean triples data ── */
const TRIPLES = [
  { a: 3, b: 4, c: 5, note: "Paling dasar" },
  { a: 5, b: 12, c: 13, note: "Populer" },
  { a: 8, b: 15, c: 17, note: "Arsitek" },
  { a: 7, b: 24, c: 25, note: "Jarang diketahui" },
  { a: 9, b: 40, c: 41, note: "Cerdas" },
  { a: 6, b: 8, c: 10, note: "Kelipatan 3-4-5" },
  { a: 5, b: 12, c: 13, note: "Pelaut" },
  { a: 20, b: 21, c: 29, note: "Unik" },
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
                <TripleVerifSVG a={3} b={4} c={5}/>
              </div>
            )}
          </div>

          {/* DAFTAR TRIPLE */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="daftar" icon={<Star className="w-5 h-5"/>} iconColor="text-yellow-400" title="⭐ Daftar Triple Pythagoras Penting"/>
            {open.includes("daftar") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="overflow-x-auto rounded-xl border border-slate-600">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="bg-slate-800/80">
                        <th className="px-4 py-3 text-left text-cyan-300 font-bold">Triple (a, b, c)</th>
                        <th className="px-4 py-3 text-left text-blue-300 font-bold"><InlineMath math="a^2 + b^2"/></th>
                        <th className="px-4 py-3 text-left text-orange-300 font-bold"><InlineMath math="c^2"/></th>
                        <th className="px-4 py-3 text-left text-green-300 font-bold">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {a:3,b:4,c:5,note:"Triple paling dasar"},
                        {a:5,b:12,c:13,note:"Triple populer"},
                        {a:8,b:15,c:17,note:"Digunakan arsitek"},
                        {a:7,b:24,c:25,note:"Jarang, tapi valid"},
                        {a:9,b:40,c:41,note:"Triple unik"},
                        {a:6,b:8,c:10,note:"Kelipatan 3-4-5 (×2)"},
                        {a:20,b:21,c:29,note:"Triple istimewa"},
                      ].map(({a,b,c,note},i)=>(
                        <tr key={i} className={i%2===0?"bg-slate-900/40":"bg-slate-800/30"}>
                          <td className="px-4 py-2 text-white font-bold">{a} – {b} – {c}</td>
                          <td className="px-4 py-2 text-blue-200">{a*a}+{b*b}={a*a+b*b}</td>
                          <td className="px-4 py-2 text-orange-200">{c}²={c*c}</td>
                          <td className="px-4 py-2 text-white/60 text-xs">{note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TripleChecker/>
              </div>
            )}
          </div>

          {/* POLA KELIPATAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="pola" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title="📐 Pola: Kelipatan Triple Pythagoras"/>
            {open.includes("pola") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-cyan-300 font-semibold text-sm mb-2">📌 Sifat Penting</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Jika <InlineMath math="(a, b, c)"/> adalah triple Pythagoras, maka <InlineMath math="(ka, kb, kc)"/> juga triple Pythagoras untuk setiap bilangan bulat positif <InlineMath math="k"/>.
                  </p>
                  <div className="mt-3 bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="(ka)^2 + (kb)^2 = k^2a^2 + k^2b^2 = k^2(a^2+b^2) = k^2c^2 = (kc)^2"/>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Contoh: Keluarga Triple 3-4-5</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-body">
                    {[1,2,3,4,5,6].map(k=>(
                      <div key={k} className={`rounded-lg p-2 ${k===1?"bg-cyan-900/40 border border-cyan-500/40":"bg-slate-700/40"}`}>
                        <span className="text-white/60">k={k}: </span>
                        <span className="text-white font-bold">{3*k}-{4*k}-{5*k}</span>
                        {k===1 && <span className="text-cyan-300 ml-1">(asli)</span>}
                      </div>
                    ))}
                  </div>
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
