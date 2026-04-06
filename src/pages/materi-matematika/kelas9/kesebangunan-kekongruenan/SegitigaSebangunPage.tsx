import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DiagramSegitigaSebangun = () => (
  <svg viewBox="0 0 340 175" className="w-full max-w-sm mx-auto">
    {/* Triangle 1 - small */}
    <polygon points="20,150 120,150 70,60" fill="#3b82f6" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="2" />
    <text x="70" y="165" textAnchor="middle" fontSize="9" fill="#93c5fd" fontWeight="bold">△ABC</text>
    <text x="14" y="148" fontSize="8" fill="#93c5fd">A</text>
    <text x="122" y="148" fontSize="8" fill="#93c5fd">B</text>
    <text x="66" y="56" fontSize="8" fill="#93c5fd">C</text>
    {/* Arc angles for triangle 1 */}
    <path d="M20,150 Q32,140 40,150" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <path d="M120,150 Q112,138 104,148" fill="none" stroke="#22c55e" strokeWidth="1.5" />
    <path d="M70,60 Q76,72 65,73" fill="none" stroke="#a855f7" strokeWidth="1.5" />
    {/* Triangle 2 - large (similar) */}
    <polygon points="165,155 305,155 235,35" fill="#22c55e" fillOpacity="0.2" stroke="#4ade80" strokeWidth="2" />
    <text x="235" y="170" textAnchor="middle" fontSize="9" fill="#86efac" fontWeight="bold">△PQR</text>
    <text x="158" y="153" fontSize="8" fill="#86efac">P</text>
    <text x="307" y="153" fontSize="8" fill="#86efac">Q</text>
    <text x="231" y="31" fontSize="8" fill="#86efac">R</text>
    {/* Arc angles for triangle 2 */}
    <path d="M165,155 Q180,143 192,153" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <path d="M305,155 Q294,141 283,151" fill="none" stroke="#22c55e" strokeWidth="1.5" />
    <path d="M235,35 Q243,50 228,52" fill="none" stroke="#a855f7" strokeWidth="1.5" />
    {/* Tilde */}
    <text x="135" y="105" fontSize="16" fill="#facc15">~</text>
    {/* Labels */}
    <text x="170" y="15" fontSize="9" fill="#fde68a" fontWeight="bold">Sudut bersesuaian sama besar</text>
    <text x="38" y="140" fontSize="7" fill="#f97316">∠A</text>
    <text x="104" y="140" fontSize="7" fill="#22c55e">∠B</text>
    <text x="63" y="82" fontSize="7" fill="#a855f7">∠C</text>
    <text x="196" y="143" fontSize="7" fill="#f97316">∠P</text>
    <text x="281" y="143" fontSize="7" fill="#22c55e">∠Q</text>
    <text x="228" y="65" fontSize="7" fill="#a855f7">∠R</text>
  </svg>
);

const DiagramGarisSejajar = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto">
    <defs>
      <marker id="arr-s" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8" />
      </marker>
    </defs>
    {/* Main triangle */}
    <polygon points="140,20 30,175 250,175" fill="none" stroke="#60a5fa" strokeWidth="2" />
    <text x="140" y="14" textAnchor="middle" fontSize="10" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="22" y="185" fontSize="10" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="252" y="185" fontSize="10" fill="#93c5fd" fontWeight="bold">C</text>
    {/* Parallel line XY */}
    <line x1="75" y1="110" x2="200" y2="110" stroke="#facc15" strokeWidth="2" />
    <text x="68" y="114" fontSize="10" fill="#fde68a" fontWeight="bold">X</text>
    <text x="203" y="114" fontSize="10" fill="#fde68a" fontWeight="bold">Y</text>
    {/* Parallel markers */}
    <line x1="128" y1="105" x2="128" y2="115" stroke="#facc15" strokeWidth="1.5" />
    <line x1="125" y1="168" x2="125" y2="178" stroke="#facc15" strokeWidth="1.5" />
    <line x1="135" y1="168" x2="135" y2="178" stroke="#facc15" strokeWidth="1.5" />
    <line x1="131" y1="105" x2="131" y2="115" stroke="#facc15" strokeWidth="1.5" />
    {/* Labels on sides */}
    <text x="92" y="70" fontSize="9" fill="#c084fc">AX</text>
    <text x="175" y="70" fontSize="9" fill="#4ade80">AY</text>
    <text x="44" y="145" fontSize="9" fill="#c084fc">XB</text>
    <text x="220" y="145" fontSize="9" fill="#4ade80">YC</text>
    {/* Proportional sign */}
    <rect x="55" y="5" width="170" height="15" rx="3" fill="#1e293b" />
    <text x="140" y="16" textAnchor="middle" fontSize="8" fill="#fde68a">XY // BC → AX/XB = AY/YC</text>
    {/* Dotted triangle △AXY */}
    <polygon points="140,20 75,110 200,110" fill="#facc15" fillOpacity="0.08" stroke="#facc15" strokeWidth="1" strokeDasharray="4,3" />
  </svg>
);

const SegitigaSebangunPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep1", "konsep2", "contoh1"]);
  const toggleSection = (s: string) => {
    playPopSound();
    setExpandedSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };
  const Header = ({ id, icon, color, label }: { id: string; icon: React.ReactNode; color: string; label: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span style={{ color }}>{icon}</span><span className="font-body font-semibold text-white">{label}</span></div>
      {expandedSections.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">SEGITIGA – SEGITIGA YANG SEBANGUN</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="🔺 Mengapa Segitiga Istimewa?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pada bangun datar umum, kita butuh DUA syarat untuk membuktikan kesebangunan (sudut sama + rusuk sebanding). Tapi pada <strong className="text-cyan-300">segitiga</strong>, cukup salah satunya saja — karena keduanya saling memengaruhi secara otomatis!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm text-cyan-200 font-semibold">Dua segitiga sebangun jika memenuhi SALAH SATU dari berikut:</p>
                  <div className="font-body text-sm text-cyan-100 space-y-1">
                    <p>🔹 <strong>Syarat 1 (AAA/AA):</strong> Sudut-sudut yang bersesuaian sama besar</p>
                    <p>🔹 <strong>Syarat 2 (SSS):</strong> Rusuk-rusuk yang bersesuaian sebanding</p>
                    <p>🔹 <strong>Syarat 3 (SAS/SdS):</strong> Dua pasang rusuk sebanding dan sudut apit sama besar</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SYARAT AA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 Sub-Bab 1: Syarat Kesebangunan Segitiga" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Syarat AA (Sudut-Sudut):</p>
                      <p>Jika dua pasang sudut yang bersesuaian dari dua segitiga sama besar, maka sudut ketiga otomatis sama (total sudut = 180°), sehingga kedua segitiga <strong>sebangun</strong>.</p>
                      <BlockMath math="\angle A = \angle P \text{ dan } \angle B = \angle Q \Rightarrow \triangle ABC \sim \triangle PQR" />
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <p className="text-blue-300 font-semibold mb-1">Syarat SSS (Sisi-Sisi-Sisi):</p>
                      <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} = \frac{CA}{RP} \Rightarrow \triangle ABC \sim \triangle PQR" />
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <p className="text-purple-300 font-semibold mb-1">Syarat SAS (Sisi-Sudut-Sisi):</p>
                      <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} \text{ dan } \angle B = \angle Q \Rightarrow \triangle ABC \sim \triangle PQR" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ILUSTRASI DUA SEGITIGA SEBANGUN:</p>
                  <DiagramSegitigaSebangun />
                </div>
              </div>
            )}
          </div>

          {/* DALIL GARIS SEJAJAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep2" icon={<Target className="w-5 h-5" />} color="#facc15" label="📘 Sub-Bab 2: Dalil Garis Sejajar dalam Segitiga" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-yellow-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Jika sebuah garis ditarik sejajar salah satu sisi segitiga sehingga memotong dua sisi lainnya, maka:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <BlockMath math="\text{Jika } XY \parallel BC, \text{ maka } \frac{AX}{XB} = \frac{AY}{YC}" />
                    <p className="font-body text-xs text-white/60">Juga berlaku kebalikannya: Jika AX/XB = AY/YC, maka XY // BC</p>
                  </div>
                  <p className="font-body text-sm text-white/80">Selain itu: △AXY ~ △ABC dengan perbandingan rusuk <InlineMath math="\frac{AX}{AB} = \frac{AY}{AC} = \frac{XY}{BC}" /></p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ILUSTRASI GARIS SEJAJAR DALAM SEGITIGA:</p>
                  <DiagramGarisSejajar />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Dalil ini super berguna untuk menghitung panjang garis yang sejajar dalam segitiga! Ingat: garis sejajar membagi dua sisi lain secara <em>proporsional</em>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Segitiga Sebangun" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">
                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui △ABC dengan <InlineMath math="\angle A = 50°" /> dan <InlineMath math="\angle B = 70°" />. Diketahui juga △PQR dengan <InlineMath math="\angle P = 50°" /> dan <InlineMath math="\angle Q = 70°" />. Apakah kedua segitiga sebangun? Tentukan pasangan sudut yang bersesuaian!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Cari sudut ketiga masing-masing:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\angle C = 180° - 50° - 70° = 60°" />
                        <BlockMath math="\angle R = 180° - 50° - 70° = 60°" />
                      </div>
                      <p>Ketiga pasang sudut sama besar (<strong>syarat AA</strong> terpenuhi):</p>
                      <div className="bg-slate-900/50 rounded p-3 text-sm space-y-1">
                        <p><InlineMath math="\angle A = \angle P = 50°" /></p>
                        <p><InlineMath math="\angle B = \angle Q = 70°" /></p>
                        <p><InlineMath math="\angle C = \angle R = 60°" /></p>
                      </div>
                      <p><strong className="text-green-300">△ABC ~ △PQR ✓</strong></p>
                    </div>
                  </div>
                </div>
                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dalam △ABC, garis PQ sejajar BC dengan P pada AB dan Q pada AC. Jika <InlineMath math="AP = 4" /> cm, <InlineMath math="PB = 6" /> cm, dan <InlineMath math="BC = 15" /> cm, tentukan panjang PQ!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Karena PQ // BC, maka △APQ ~ △ABC. Perbandingan sisi:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AP}{AB} = \frac{PQ}{BC}" />
                        <BlockMath math="AB = AP + PB = 4 + 6 = 10 \text{ cm}" />
                        <BlockMath math="\frac{4}{10} = \frac{PQ}{15} \Rightarrow PQ = \frac{4 \times 15}{10} = 6 \text{ cm}" />
                      </div>
                      <p><strong className="text-yellow-300">PQ = 6 cm.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Pada △ABC, titik D pada AB dengan <InlineMath math="AD = 3" /> cm dan <InlineMath math="DB = 9" /> cm. Titik E pada AC. Diketahui DE // BC, <InlineMath math="BC = 12" /> cm. Tentukan panjang DE dan AE jika <InlineMath math="AC = 16" /> cm!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Cari AB:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="AB = AD + DB = 3 + 9 = 12 \text{ cm}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Gunakan △ADE ~ △ABC:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\frac{AD}{AB} = \frac{DE}{BC} \Rightarrow \frac{3}{12} = \frac{DE}{12} \Rightarrow DE = 3 \text{ cm}" />
                        <BlockMath math="\frac{AD}{AB} = \frac{AE}{AC} \Rightarrow \frac{3}{12} = \frac{AE}{16} \Rightarrow AE = 4 \text{ cm}" />
                      </div>
                      <p><strong className="text-primary">DE = 3 cm dan AE = 4 cm.</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/kesebangunan-kekongruenan"); }} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Kesebangunan dan Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};
export default SegitigaSebangunPage;
