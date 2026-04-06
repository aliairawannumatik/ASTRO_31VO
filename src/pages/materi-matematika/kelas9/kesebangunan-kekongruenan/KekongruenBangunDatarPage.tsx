import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DiagramSifatKongruen = () => (
  <svg viewBox="0 0 340 170" className="w-full max-w-sm mx-auto">
    {/* Triangle ABC */}
    <polygon points="30,150 140,150 85,40" fill="#3b82f6" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="2" />
    <text x="22" y="158" fontSize="10" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="142" y="158" fontSize="10" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="83" y="34" fontSize="10" fill="#93c5fd" fontWeight="bold">C</text>
    {/* Side tick marks */}
    <line x1="75" y1="98" x2="78" y2="91" stroke="#facc15" strokeWidth="2" />
    <line x1="83" y1="101" x2="86" y2="94" stroke="#facc15" strokeWidth="2" />
    <line x1="84" y1="152" x2="84" y2="142" stroke="#22c55e" strokeWidth="2" />
    <line x1="88" y1="152" x2="88" y2="142" stroke="#22c55e" strokeWidth="2" />
    <line x1="122" y1="101" x2="116" y2="96" stroke="#f97316" strokeWidth="2" />
    {/* Triangle PQR */}
    <polygon points="195,150 305,150 250,40" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="2" />
    <text x="187" y="158" fontSize="10" fill="#e9d5ff" fontWeight="bold">P</text>
    <text x="307" y="158" fontSize="10" fill="#e9d5ff" fontWeight="bold">Q</text>
    <text x="248" y="34" fontSize="10" fill="#e9d5ff" fontWeight="bold">R</text>
    {/* Same tick marks on PQR */}
    <line x1="240" y1="98" x2="243" y2="91" stroke="#facc15" strokeWidth="2" />
    <line x1="248" y1="101" x2="251" y2="94" stroke="#facc15" strokeWidth="2" />
    <line x1="249" y1="152" x2="249" y2="142" stroke="#22c55e" strokeWidth="2" />
    <line x1="253" y1="152" x2="253" y2="142" stroke="#22c55e" strokeWidth="2" />
    <line x1="287" y1="101" x2="281" y2="96" stroke="#f97316" strokeWidth="2" />
    {/* Congruent symbol */}
    <text x="155" y="100" fontSize="18" fill="#facc15" fontWeight="bold">≅</text>
    {/* Labels */}
    <text x="170" y="18" textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold">△ABC ≅ △PQR</text>
    <text x="170" y="30" textAnchor="middle" fontSize="8" fill="#94a3b8">Rusuk sama panjang, sudut sama besar</text>
    {/* Angle arcs */}
    <path d="M30,150 Q45,138 50,150" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <path d="M195,150 Q210,138 215,150" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <path d="M140,150 Q128,138 122,150" fill="none" stroke="#22c55e" strokeWidth="1.5" />
    <path d="M305,150 Q293,138 287,150" fill="none" stroke="#22c55e" strokeWidth="1.5" />
  </svg>
);

const DiagramSyaratRRR = () => (
  <svg viewBox="0 0 300 120" className="w-full max-w-xs mx-auto">
    <polygon points="30,100 130,100 80,25" fill="#3b82f6" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="2" />
    <polygon points="170,100 270,100 220,25" fill="#22c55e" fillOpacity="0.2" stroke="#4ade80" strokeWidth="2" />
    {/* Triple tick marks on all sides */}
    {[[75,63,78,56],[80,66,83,59]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="1.5" />)}
    {[[78,102,78,92],[82,102,82,92]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="1.5" />)}
    {[[104,65,99,59]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="1.5" />)}
    {[[215,63,218,56],[220,66,223,59]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="1.5" />)}
    {[[218,102,218,92],[222,102,222,92]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="1.5" />)}
    {[[244,65,239,59]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="1.5" />)}
    <text x="145" y="68" fontSize="18" fill="#facc15">≅</text>
    <rect x="85" y="3" width="130" height="16" rx="4" fill="#1e293b" />
    <text x="150" y="15" textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold">Syarat RRR: 3 sisi sama panjang</text>
  </svg>
);

const DiagramSyaratRAR = () => (
  <svg viewBox="0 0 300 120" className="w-full max-w-xs mx-auto">
    <polygon points="30,100 130,100 80,25" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="2" />
    <polygon points="170,100 270,100 220,25" fill="#a855f7" fillOpacity="0.2" stroke="#c084fc" strokeWidth="2" />
    {/* Two side marks */}
    {[[75,63,78,56]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="2" />)}
    {[[78,102,78,92]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="2" />)}
    {[[215,63,218,56]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="2" />)}
    {[[218,102,218,92]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="2" />)}
    {/* Angle arc at top vertex */}
    <path d="M80,25 Q90,38 70,38" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <path d="M220,25 Q230,38 210,38" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <text x="145" y="68" fontSize="18" fill="#facc15">≅</text>
    <rect x="60" y="3" width="180" height="16" rx="4" fill="#1e293b" />
    <text x="150" y="15" textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold">Syarat RAR: 2 sisi + sudut apit sama</text>
  </svg>
);

const DiagramSyaratARA = () => (
  <svg viewBox="0 0 300 120" className="w-full max-w-xs mx-auto">
    <polygon points="30,100 130,100 80,25" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="2" />
    <polygon points="170,100 270,100 220,25" fill="#22c55e" fillOpacity="0.2" stroke="#4ade80" strokeWidth="2" />
    {/* One side mark (bottom) */}
    {[[78,102,78,92],[82,102,82,92]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="2" />)}
    {[[218,102,218,92],[222,102,222,92]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="2" />)}
    {/* Two angle arcs */}
    <path d="M30,100 Q45,88 50,100" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <path d="M130,100 Q118,88 112,100" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <path d="M170,100 Q185,88 190,100" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <path d="M270,100 Q258,88 252,100" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <text x="145" y="68" fontSize="18" fill="#facc15">≅</text>
    <rect x="55" y="3" width="190" height="16" rx="4" fill="#1e293b" />
    <text x="150" y="15" textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold">Syarat ARA/AAR: 1 sisi + 2 sudut sama</text>
  </svg>
);

const KekongruenBangunDatarPage = () => {
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
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">KEKONGRUENAN PADA BANGUN DATAR</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="🧱 Dua Segitiga yang Benar-benar Kembar" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Coba bayangkan dua puzzle yang identik — setiap potongannya bisa saling menutupi dengan sempurna tanpa sisa. Itulah gambaran dua segitiga yang <strong className="text-cyan-300">kongruen</strong>! Dua segitiga kongruen jika salah satunya bisa <em>ditutupkan persis</em> di atas yang lain.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    Dua segitiga kongruen dinotasikan <InlineMath math="\triangle ABC \cong \triangle PQR" />. Urutan huruf menunjukkan pasangan titik yang saling bersesuaian:
                    A↔P, B↔Q, C↔R.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SIFAT-SIFAT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 Sub-Bab 1: Sifat-sifat Dua Segitiga Kongruen" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Jika △ABC ≅ △PQR, maka berlaku kedua sifat berikut secara bersamaan:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="font-body text-xs font-semibold text-green-300 mb-1">① Rusuk-rusuk yang bersesuaian sama panjang:</p>
                      <BlockMath math="AB = PQ, \quad BC = QR, \quad CA = RP" />
                    </div>
                    <div>
                      <p className="font-body text-xs font-semibold text-blue-300 mb-1">② Sudut-sudut yang bersesuaian sama besar:</p>
                      <BlockMath math="\angle A = \angle P, \quad \angle B = \angle Q, \quad \angle C = \angle R" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ILUSTRASI SIFAT KEKONGRUENAN:</p>
                  <DiagramSifatKongruen />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Perhatikan urutan penulisan!</strong> △ABC ≅ △PQR berarti A↔P, B↔Q, C↔R. Jadi AB = PQ (bukan AB = PR!). Kesalahan urutan adalah kesalahan yang paling sering terjadi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SYARAT-SYARAT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep2" icon={<Target className="w-5 h-5" />} color="#c084fc" label="📘 Sub-Bab 2: Syarat-syarat Dua Segitiga Kongruen" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Ada 4 kondisi (syarat) yang bisa dipakai untuk membuktikan dua segitiga kongruen. Cukup salah satunya terpenuhi!</p>
                </div>

                {/* RRR */}
                <div className="bg-slate-800/60 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">① Syarat RRR (Sisi-Sisi-Sisi)</p>
                  <DiagramSyaratRRR />
                  <p className="font-body text-sm text-white/80">Jika ketiga rusuk satu segitiga sama panjang dengan ketiga rusuk segitiga lainnya, maka keduanya kongruen.</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="AB = PQ,\; BC = QR,\; CA = RP \Rightarrow \triangle ABC \cong \triangle PQR" />
                  </div>
                </div>

                {/* RAR */}
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">② Syarat RAR (Sisi-Sudut-Sisi)</p>
                  <DiagramSyaratRAR />
                  <p className="font-body text-sm text-white/80">Jika dua rusuk dan sudut apitnya sama dengan dua rusuk dan sudut apit segitiga lain.</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="AB = PQ,\; \angle B = \angle Q,\; BC = QR \Rightarrow \triangle ABC \cong \triangle PQR" />
                  </div>
                </div>

                {/* ARA / AAR */}
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">③ Syarat ARA / AAR / RAA (Sudut-Sisi-Sudut)</p>
                  <DiagramSyaratARA />
                  <p className="font-body text-sm text-white/80">Jika satu rusuk dan dua sudut yang bersesuaian sama dengan segitiga lain. (Posisi rusuk boleh diapit atau dihadapkan ke salah satu sudut.)</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\angle A = \angle P,\; AB = PQ,\; \angle B = \angle Q \Rightarrow \triangle ABC \cong \triangle PQR" />
                  </div>
                </div>

                {/* Rangkuman */}
                <div className="bg-slate-900/60 border border-slate-600/40 rounded-lg p-4 overflow-x-auto">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">📊 RINGKASAN SYARAT KEKONGRUENAN SEGITIGA:</p>
                  <table className="w-full font-body text-xs text-white/80">
                    <thead><tr className="border-b border-slate-600">
                      <th className="text-left py-2 text-cyan-300">Kode</th>
                      <th className="text-left py-2 text-cyan-300">Syarat</th>
                      <th className="text-left py-2 text-cyan-300">Dibutuhkan</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-700">
                      <tr><td className="py-2 text-green-300 font-bold">RRR</td><td className="py-2">3 pasang sisi sama</td><td className="py-2">3 rusuk</td></tr>
                      <tr><td className="py-2 text-purple-300 font-bold">RAR</td><td className="py-2">2 sisi + sudut apit sama</td><td className="py-2">2 rusuk + 1 sudut</td></tr>
                      <tr><td className="py-2 text-cyan-300 font-bold">ARA</td><td className="py-2">1 sisi + 2 sudut sama (sisi diapit)</td><td className="py-2">1 rusuk + 2 sudut</td></tr>
                      <tr><td className="py-2 text-yellow-300 font-bold">AAR/RAA</td><td className="py-2">1 sisi + 2 sudut sama (sisi dihadapkan)</td><td className="py-2">1 rusuk + 2 sudut</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Kekongruenan Segitiga" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">
                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Diketahui △ABC ≅ △PQR dengan <InlineMath math="AB = PQ = 7" /> cm, <InlineMath math="BC = QR = 10" /> cm, <InlineMath math="CA = RP = 8" /> cm. Berdasarkan syarat apa kedua segitiga tersebut kongruen? Sebutkan semua pasangan sudut yang sama besar!</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Ketiga pasang rusuk bersesuaian sama panjang → <strong className="text-green-300">Syarat RRR ✓</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p><InlineMath math="AB = PQ = 7 \text{ cm}" /></p>
                        <p><InlineMath math="BC = QR = 10 \text{ cm}" /></p>
                        <p><InlineMath math="CA = RP = 8 \text{ cm}" /></p>
                      </div>
                      <p>Maka sudut-sudut yang bersesuaian sama besar:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p><InlineMath math="\angle A = \angle P, \quad \angle B = \angle Q, \quad \angle C = \angle R" /></p>
                      </div>
                      <p><strong className="text-green-300">Syarat RRR, ∠A=∠P, ∠B=∠Q, ∠C=∠R.</strong></p>
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
                    <p className="font-body text-sm text-white">Diketahui AC = EC dan BC = DC. Buktikan bahwa △ABC ≅ △EDC! (Petunjuk: AC, BC berpotongan dengan EC, DC di titik C)</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Perhatikan △ABC dan △EDC:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>① <InlineMath math="AC = EC" /> (diketahui)</p>
                        <p>② <InlineMath math="BC = DC" /> (diketahui)</p>
                        <p>③ <InlineMath math="\angle ACB = \angle ECD" /> (sudut bertolak belakang, sama besar)</p>
                      </div>
                      <p>Dua rusuk sama panjang dan sudut apitnya sama → <strong className="text-yellow-300">Syarat RAR ✓</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\therefore \triangle ABC \cong \triangle EDC \text{ (RAR)}" />
                      </div>
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
                    <p className="font-body text-sm text-white">ABCD adalah persegi panjang. Buktikan bahwa △ABD ≅ △CDB! Kemudian tuliskan semua pasangan rusuk dan sudut yang bersesuaian!</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p>Perhatikan △ABD dan △CDB (BD adalah diagonal persama):</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>① <InlineMath math="AB = CD" /> (sifat persegi panjang, sisi berhadapan sama panjang)</p>
                        <p>② <InlineMath math="AD = CB" /> (sifat persegi panjang)</p>
                        <p>③ <InlineMath math="BD = BD" /> (diagonal persekutuan, sisi yang sama)</p>
                      </div>
                      <p>Ketiga pasang rusuk sama panjang → <strong className="text-red-300">Syarat RRR ✓</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\therefore \triangle ABD \cong \triangle CDB \text{ (RRR)}" />
                      </div>
                      <p><strong>Pasangan rusuk bersesuaian:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 text-xs space-y-1">
                        <p><InlineMath math="AB = CD,\; AD = CB,\; BD = DB" /></p>
                        <p><InlineMath math="\angle ABD = \angle CDB,\; \angle ADB = \angle CBD,\; \angle DAB = \angle BCD" /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-xl p-5 space-y-3">
            <p className="font-body text-sm font-semibold text-purple-300">🌟 Rangkuman Kekongruenan Segitiga</p>
            <div className="font-body text-sm text-white/80 space-y-1">
              <p>✅ Sifat: rusuk sama panjang <strong>DAN</strong> sudut sama besar</p>
              <p>✅ Syarat RRR: 3 rusuk bersesuaian sama panjang</p>
              <p>✅ Syarat RAR: 2 rusuk + 1 sudut apit sama</p>
              <p>✅ Syarat ARA/AAR: 1 rusuk + 2 sudut sama</p>
              <p>⚠️ Perhatikan urutan penulisan titik sudut!</p>
            </div>
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
export default KekongruenBangunDatarPage;
