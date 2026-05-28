import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── DIAGRAMS ──
   △ABC siku-siku di A, AB VERTIKAL, AC HORIZONTAL.
   B = kiri atas, A = kiri bawah (AB vertikal), C = kanan bawah (AC horizontal).
   BC = sisi miring (hipotenusa, diagonal). AD ⊥ BC, D pada BC.
   Koordinat: B=(55,22), A=(55,182), C=(175,182)
   AB=160 (vertikal), AC=120 (horizontal), BC=200, AD=96, BD=128, DC=72  (3-4-5 × 40)
   BC_unit = (C-B)/|BC| = (120,160)/200 = (0.6,0.8)
   t = (A-B)·BC_unit = (0,160)·(0.6,0.8) = 128
   D = B + 128*(0.6,0.8) = (55+76.8, 22+102.4) = (131.8,124.4) ≈ (132,124)
──────────────────────────────────────────── */

/* Sudut siku-siku di A=(55,182): AB ke atas (0,-1), AC ke kanan (1,0) → kotak axis-aligned */
const RightAngleA = () => (
  <path d="M 55,173 L 64,173 L 64,182" fill="none" stroke="#f97316" strokeWidth="1.5"/>
);

/* Sudut siku-siku di D=(132,124): AD⊥BC
   DA_unit (D→A) = (55-132,182-124)/96 = (-76.8,57.6)/96 = (-0.8,0.6)
   BC_unit = (0.6,0.8), s=8 */
const RightAngleD = () => {
  const s = 8;
  const p1 = { x: 132 + s*(-0.8), y: 124 + s*(0.6)  };  // toward A
  const p2 = { x: 132 + s*(0.6),  y: 124 + s*(0.8)  };  // along BC
  const corner = { x: p1.x + s*(0.6), y: p1.y + s*(0.8) };
  return <path d={`M ${p1.x.toFixed(1)},${p1.y.toFixed(1)} L ${corner.x.toFixed(1)},${corner.y.toFixed(1)} L ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`} fill="none" stroke="#facc15" strokeWidth="1.5"/>;
};

const DiagramSikuSiku = () => (
  <svg viewBox="0 0 260 218" className="w-full max-w-sm mx-auto">
    {/* Sub-triangles shaded */}
    <polygon points="55,182 55,22 132,124"  fill="#4ade80"  fillOpacity="0.18" stroke="none"/>
    <polygon points="55,182 175,182 132,124" fill="#a855f7" fillOpacity="0.18" stroke="none"/>
    {/* Main triangle ABC */}
    <polygon points="55,22 55,182 175,182" fill="none" stroke="#60a5fa" strokeWidth="2.2"/>
    {/* Altitude AD */}
    <line x1="55" y1="182" x2="132" y2="124" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <RightAngleA />
    <RightAngleD />
    {/* Vertex labels */}
    <text x="36"  y="20"  fontSize="12" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="36"  y="197" fontSize="12" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="178" y="197" fontSize="12" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="136" y="120" fontSize="11" fill="#fde68a" fontWeight="bold">D</text>
    {/* Legend */}
    <rect x="3" y="202" width="254" height="14" rx="4" fill="#0f172a" stroke="#334155"/>
    <text x="130" y="212" textAnchor="middle" fontSize="8" fill="#fde68a" fontWeight="bold">△ABD ~ △CAD ~ △CAB (tiga segitiga saling sebangun)</text>
  </svg>
);

const DiagramProyeksiAlas = () => (
  <svg viewBox="0 0 260 226" className="w-full max-w-sm mx-auto">
    <polygon points="55,182 55,22 132,124" fill="#4ade80" fillOpacity="0.18" stroke="none"/>
    <polygon points="55,22 55,182 175,182" fill="none" stroke="#60a5fa" strokeWidth="2"/>
    <line x1="55" y1="182" x2="132" y2="124" stroke="#facc15" strokeWidth="1.8" strokeDasharray="5,3"/>
    <RightAngleA />
    <RightAngleD />
    <text x="36"  y="20"  fontSize="12" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="36"  y="197" fontSize="12" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="178" y="197" fontSize="12" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="136" y="120" fontSize="11" fill="#fde68a" fontWeight="bold">D</text>
    <rect x="3" y="193" width="254" height="30" rx="4" fill="#0f172a" stroke="#4ade80" strokeWidth="1"/>
    <text x="130" y="205" textAnchor="middle" fontSize="12" fill="#fde68a" fontWeight="bold">Proyeksi Rusuk Tegak AB:</text>
    <text x="130" y="220" textAnchor="middle" fontSize="12" fill="#4ade80" fontWeight="bold">AB² = BD × BC</text>
  </svg>
);

const DiagramProyeksiTegak = () => (
  <svg viewBox="0 0 260 224" className="w-full max-w-sm mx-auto">
    <polygon points="55,182 175,182 132,124" fill="#c084fc" fillOpacity="0.18" stroke="none"/>
    <polygon points="55,22 55,182 175,182" fill="none" stroke="#c084fc" strokeWidth="2"/>
    <line x1="55" y1="182" x2="132" y2="124" stroke="#facc15" strokeWidth="1.8" strokeDasharray="5,3"/>
    <RightAngleA />
    <RightAngleD />
    <text x="36"  y="20"  fontSize="12" fill="#e9d5ff" fontWeight="bold">B</text>
    <text x="36"  y="197" fontSize="12" fill="#e9d5ff" fontWeight="bold">A</text>
    <text x="178" y="197" fontSize="12" fill="#e9d5ff" fontWeight="bold">C</text>
    <text x="136" y="120" fontSize="11" fill="#fde68a" fontWeight="bold">D</text>
    <rect x="3" y="193" width="254" height="30" rx="4" fill="#0f172a" stroke="#c084fc" strokeWidth="1"/>
    <text x="130" y="205" textAnchor="middle" fontSize="12" fill="#fde68a" fontWeight="bold">Proyeksi Rusuk Mendatar AC:</text>
    <text x="130" y="220" textAnchor="middle" fontSize="12" fill="#c084fc" fontWeight="bold">AC² = DC × BC</text>
  </svg>
);

const DiagramGarisTinggi = () => (
  <svg viewBox="0 0 260 224" className="w-full max-w-sm mx-auto">
    <polygon points="55,182 55,22 132,124"  fill="#facc15" fillOpacity="0.10" stroke="none"/>
    <polygon points="55,182 175,182 132,124" fill="#facc15" fillOpacity="0.10" stroke="none"/>
    <polygon points="55,22 55,182 175,182" fill="none" stroke="#22c55e" strokeWidth="2"/>
    <line x1="55" y1="182" x2="132" y2="124" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <RightAngleA />
    <RightAngleD />
    <text x="36"  y="20"  fontSize="12" fill="#86efac" fontWeight="bold">B</text>
    <text x="36"  y="197" fontSize="12" fill="#86efac" fontWeight="bold">A</text>
    <text x="178" y="197" fontSize="12" fill="#86efac" fontWeight="bold">C</text>
    <text x="136" y="120" fontSize="11" fill="#fde68a" fontWeight="bold">D</text>
    <rect x="3" y="193" width="254" height="30" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1"/>
    <text x="130" y="205" textAnchor="middle" fontSize="12" fill="#fde68a" fontWeight="bold">Garis Tinggi ke Sisi Miring:</text>
    <text x="130" y="220" textAnchor="middle" fontSize="12" fill="#22c55e" fontWeight="bold">AD² = BD × DC</text>
  </svg>
);

const PerbandinganRusukSikuSikuPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep1", "konsep2", "konsep3", "konsep4", "contoh1"]);
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
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">PERBANDINGAN/RASIO RUSUK-RUSUK SEGITIGA SIKU-SIKU</h1>
        <p className="text-white/50 text-xs text-center mb-2 font-body">Dengan Konsep Kesebangunan</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="📐 Setup: Segitiga Siku-siku dengan Garis Tinggi" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pada segitiga siku-siku, jika dari titik sudut siku-siku kita tarik <strong className="text-cyan-300">garis tinggi ke sisi miring</strong>, maka segitiga besar terbagi menjadi dua segitiga kecil yang <strong>sebangun satu sama lain</strong> dan sebangun dengan segitiga besarnya!
                </p>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 SEGITIGA ABC SIKU-SIKU DI A, AD GARIS TINGGI:</p>
                  <DiagramSikuSiku />
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Dari garis tinggi AD, terbentuk:</strong><br />
                    △ABD ~ △CAD ~ △CAB (semuanya saling sebangun!)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* a: PROYEKSI RUSUK ALAS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 (a) Proyeksi Rusuk Alas pada Rusuk Miring" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Perhatikan △ABD dan △CAB. Karena keduanya sebangun:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white/70"><InlineMath math="\frac{BD}{AB} = \frac{AB}{BC}" /> (rusuk bersesuaian sebanding)</p>
                    <BlockMath math="\boxed{AB^2 = BD \times BC}" />
                    <p className="font-body text-xs text-white/60 text-center">Kuadrat rusuk alas = proyeksi alas × sisi miring</p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <DiagramProyeksiAlas />
                </div>
              </div>
            )}
          </div>

          {/* b: PROYEKSI RUSUK TEGAK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep2" icon={<Target className="w-5 h-5" />} color="#c084fc" label="📘 (b) Proyeksi Rusuk Tegak pada Rusuk Miring" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Perhatikan △CDA dan △CAB. Karena keduanya sebangun:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white/70"><InlineMath math="\frac{CD}{AC} = \frac{AC}{BC}" /></p>
                    <BlockMath math="\boxed{AC^2 = CD \times CB}" />
                    <p className="font-body text-xs text-white/60 text-center">Kuadrat rusuk tegak = proyeksi tegak × sisi miring</p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <DiagramProyeksiTegak />
                </div>
              </div>
            )}
          </div>

          {/* c: GARIS TINGGI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep3" icon={<Target className="w-5 h-5" />} color="#22c55e" label="📘 (c) Rumus Garis Tinggi △ABC Siku-siku di A" />
            {expandedSections.includes("konsep3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Perhatikan △ADB dan △ADC. Keduanya sebangun menghasilkan:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white/70"><InlineMath math="\frac{BD}{AD} = \frac{AD}{DC}" /></p>
                    <BlockMath math="\boxed{AD^2 = BD \times DC}" />
                    <p className="font-body text-xs text-white/60 text-center">Garis tinggi kuadrat = hasil kali dua proyeksi pada sisi miring</p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <DiagramGarisTinggi />
                </div>
              </div>
            )}
          </div>

          {/* d: HUBUNGAN RUSUK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep4" icon={<Target className="w-5 h-5" />} color="#f97316" label="📘 (d) Hubungan Rusuk-rusuk dan Garis Tinggi" />
            {expandedSections.includes("konsep4") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Dari dua cara menghitung luas △ABC siku-siku di A:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white/70">Cara 1 (alas-tinggi dengan AB dan AC):</p>
                    <BlockMath math="L = \frac{AB \times AC}{2}" />
                    <p className="font-body text-sm text-white/70">Cara 2 (alas-tinggi dengan BC dan AD):</p>
                    <BlockMath math="L = \frac{BC \times AD}{2}" />
                    <p className="font-body text-sm text-white/70">Karena luasnya sama, maka:</p>
                    <BlockMath math="\boxed{AB \times AC = BC \times AD}" />
                    <p className="font-body text-xs text-white/60 text-center">alas × tegak = miring × garis tinggi</p>
                  </div>
                </div>

                {/* Rangkuman semua rumus */}
                <div className="bg-slate-800/60 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-orange-300 mb-3">📊 RANGKUMAN SEMUA RUMUS (△ABC siku-siku di A, AD tinggi ke BC):</p>
                  <div className="overflow-x-auto">
                    <table className="w-full font-body text-xs text-white/80">
                      <thead><tr className="border-b border-orange-500/30">
                        <th className="text-left py-2 text-orange-300">Rumus</th>
                        <th className="text-left py-2 text-orange-300">Keterangan</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700">
                        <tr><td className="py-2"><InlineMath math="AB^2 = BD \times BC" /></td><td className="py-2 text-green-300">Proyeksi alas</td></tr>
                        <tr><td className="py-2"><InlineMath math="AC^2 = CD \times CB" /></td><td className="py-2 text-purple-300">Proyeksi tegak</td></tr>
                        <tr><td className="py-2"><InlineMath math="AD^2 = BD \times DC" /></td><td className="py-2 text-cyan-300">Garis tinggi</td></tr>
                        <tr><td className="py-2"><InlineMath math="AB \times AC = BC \times AD" /></td><td className="py-2 text-yellow-300">Hubungan rusuk & tinggi</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Perbandingan Rusuk Siku-siku" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">
                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">△ABC siku-siku di A, AD garis tinggi ke BC. Diketahui <InlineMath math="BD = 4" /> cm dan <InlineMath math="DC = 9" /> cm. Tentukan panjang AD dan AB!</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Cari AD (garis tinggi):</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="AD^2 = BD \times DC = 4 \times 9 = 36" />
                        <BlockMath math="AD = \sqrt{36} = 6 \text{ cm}" />
                      </div>
                      <p><strong>Cari AB (proyeksi alas):</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="BC = BD + DC = 4 + 9 = 13 \text{ cm}" />
                        <BlockMath math="AB^2 = BD \times BC = 4 \times 13 = 52" />
                        <BlockMath math="AB = \sqrt{52} = 2\sqrt{13} \approx 7{,}2 \text{ cm}" />
                      </div>
                      <p><strong className="text-green-300">AD = 6 cm, AB = 2√13 cm.</strong></p>
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
                    <p className="font-body text-sm text-white">△ABC siku-siku di A dengan <InlineMath math="AB = 6" /> cm dan <InlineMath math="AC = 8" /> cm. AD adalah garis tinggi ke BC. Tentukan panjang BC, BD, DC, dan AD!</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="BC = \sqrt{AB^2 + AC^2} = \sqrt{36+64} = 10 \text{ cm}" />
                        <BlockMath math="BD = \frac{AB^2}{BC} = \frac{36}{10} = 3{,}6 \text{ cm}" />
                        <BlockMath math="DC = \frac{AC^2}{BC} = \frac{64}{10} = 6{,}4 \text{ cm}" />
                        <BlockMath math="AD = \frac{AB \times AC}{BC} = \frac{6 \times 8}{10} = 4{,}8 \text{ cm}" />
                      </div>
                      <p><strong className="text-yellow-300">BC=10 cm, BD=3,6 cm, DC=6,4 cm, AD=4,8 cm.</strong></p>
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
                    <p className="font-body text-sm text-white">△ABC siku-siku di A, AD ⊥ BC. Diketahui luas △ABD = 96 cm² dan BD = 12 cm. Hitunglah panjang AD, BC, AC, dan luas △ABC!</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>(a) Cari AD:</strong></p>
                        <BlockMath math="L_{ABD} = \frac{AD \times BD}{2} \Rightarrow 96 = \frac{AD \times 12}{2} \Rightarrow AD = 16 \text{ cm}" />
                        <p><strong>(b) Cari DC:</strong></p>
                        <BlockMath math="AD^2 = BD \times DC \Rightarrow 256 = 12 \times DC \Rightarrow DC = \frac{64}{3} \approx 21{,}3 \text{ cm}" />
                        <p><strong>(c) Cari BC dan AC:</strong></p>
                        <BlockMath math="BC = BD + DC = 12 + \tfrac{64}{3} = \tfrac{100}{3} \text{ cm}" />
                        <BlockMath math="AC^2 = DC \times BC = \tfrac{64}{3} \times \tfrac{100}{3} = \tfrac{6400}{9}" />
                        <BlockMath math="AC = \frac{80}{3} \approx 26{,}7 \text{ cm}" />
                        <p><strong>(d) Luas △ABC:</strong></p>
                        <BlockMath math="L = \frac{BC \times AD}{2} = \frac{\tfrac{100}{3} \times 16}{2} = \frac{800}{3} \approx 266{,}7 \text{ cm}^2" />
                      </div>
                      <p><strong className="text-primary">AD=16 cm, DC≈21,3 cm, BC≈33,3 cm, AC≈26,7 cm, L≈266,7 cm².</strong></p>
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
export default PerbandinganRusukSikuSikuPage;
