import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DiagramTrapesium = () => (
  <svg viewBox="0 0 340 180" className="w-full max-w-sm mx-auto">
    {/* Trapezium 1 */}
    <polygon points="20,130 100,130 85,80 35,80" fill="#3b82f6" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="2" />
    <text x="60" y="110" textAnchor="middle" fontSize="9" fill="#93c5fd">ABCD</text>
    <text x="60" y="150" textAnchor="middle" fontSize="8" fill="#64748b">AB=8, BC=5, CD=6</text>
    {/* Labels */}
    <text x="60" y="76" textAnchor="middle" fontSize="8" fill="#fde68a">CD=6</text>
    <text x="57" y="142" textAnchor="middle" fontSize="8" fill="#fde68a">AB=8</text>
    {/* Trapezium 2 */}
    <polygon points="160,140 290,140 265,65 185,65" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="2" />
    <text x="225" y="110" textAnchor="middle" fontSize="9" fill="#86efac">QRSP</text>
    <text x="225" y="160" textAnchor="middle" fontSize="8" fill="#64748b">QP=16, RS=12</text>
    <text x="225" y="61" textAnchor="middle" fontSize="8" fill="#fde68a">RS=12</text>
    <text x="225" y="153" textAnchor="middle" fontSize="8" fill="#fde68a">QP=16</text>
    {/* Tilde */}
    <text x="120" y="110" fontSize="16" fill="#facc15">~</text>
    {/* Ratio box */}
    <rect x="10" y="7" width="200" height="30" rx="5" fill="#1e293b" stroke="#334155" />
    <text x="110" y="20" textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold">Faktor skala:</text>
    <text x="110" y="32" textAnchor="middle" fontSize="9" fill="#4ade80">CD/RS = 6/12 = 1/2</text>
  </svg>
);

const DiagramBayangan = () => (
  <svg viewBox="0 0 340 170" className="w-full max-w-sm mx-auto">
    {/* Ground */}
    <line x1="10" y1="145" x2="330" y2="145" stroke="#475569" strokeWidth="2" />
    {/* Person */}
    <line x1="60" y1="145" x2="60" y2="85" stroke="#60a5fa" strokeWidth="3" />
    <circle cx="60" cy="78" r="8" fill="#60a5fa" fillOpacity="0.5" stroke="#93c5fd" strokeWidth="1.5" />
    <text x="60" y="163" textAnchor="middle" fontSize="8" fill="#93c5fd">Tinggi: 1,5 m</text>
    {/* Person shadow */}
    <line x1="60" y1="145" x2="108" y2="145" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4,2" />
    <text x="84" y="158" textAnchor="middle" fontSize="8" fill="#93c5fd">2 m</text>
    {/* Tree */}
    <line x1="200" y1="145" x2="200" y2="25" stroke="#4ade80" strokeWidth="3" />
    <ellipse cx="200" cy="20" rx="20" ry="12" fill="#4ade80" fillOpacity="0.4" stroke="#86efac" strokeWidth="1.5" />
    <text x="200" y="163" textAnchor="middle" fontSize="8" fill="#86efac">Tinggi: ?</text>
    {/* Tree shadow */}
    <line x1="200" y1="145" x2="320" y2="145" stroke="#4ade80" strokeWidth="2" strokeDasharray="4,2" />
    <text x="260" y="158" textAnchor="middle" fontSize="8" fill="#86efac">6 m</text>
    {/* Sun */}
    <circle cx="320" cy="30" r="15" fill="#facc15" fillOpacity="0.6" />
    <text x="320" y="35" textAnchor="middle" fontSize="10">☀️</text>
    {/* Light rays */}
    <line x1="308" y1="42" x2="108" y2="145" stroke="#facc15" strokeWidth="0.8" strokeDasharray="5,3" />
    <line x1="308" y1="42" x2="320" y2="145" stroke="#facc15" strokeWidth="0.8" strokeDasharray="5,3" />
    <text x="150" y="20" fontSize="9" fill="#fde68a" fontWeight="bold">Konsep Bayangan & Kesebangunan</text>
  </svg>
);

const MenghitungRusukPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep1", "contoh1"]);
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
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="📐 Cara Menghitung Rusuk yang Belum Diketahui" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kalau dua bangun sudah terbukti sebangun, kita bisa memanfaatkan sifat <strong className="text-cyan-300">rusuk-rusuk sebanding</strong> untuk mencari panjang rusuk yang belum diketahui. Caranya sangat sistematis!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Langkah Umum:</strong>
                  </p>
                  <ol className="font-body text-sm text-cyan-100 space-y-1 list-decimal list-inside mt-2">
                    <li>Identifikasi pasangan rusuk yang bersesuaian</li>
                    <li>Bentuk persamaan perbandingan: <InlineMath math="\frac{a}{p} = \frac{b}{q} = \frac{c}{r}" /></li>
                    <li>Gunakan perkalian silang untuk mencari rusuk yang belum diketahui</li>
                  </ol>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <DiagramTrapesium />
                  <p className="font-body text-xs text-white/50 text-center mt-2">Trapesium ABCD ~ QRSP dengan faktor skala 1:2</p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 Konsep: Rumus Perbandingan Rusuk" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Jika bangun <InlineMath math="ABCD \sim PQRS" />, maka berlaku:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} = \frac{CD}{RS} = \frac{DA}{SP} = k" />
                  </div>
                  <p className="font-body text-sm text-white/80">Dari persamaan tersebut, jika tiga nilai diketahui, nilai ke-4 dapat dicari dengan <strong className="text-green-300">perkalian silang</strong>:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <BlockMath math="\frac{a}{p} = \frac{b}{q} \Rightarrow a \times q = b \times p" />
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-1">Kasus Bayangan (Kontekstual):</p>
                    <BlockMath math="\frac{\text{tinggi benda}}{\text{tinggi bayangan benda}} = \frac{\text{tinggi tongkat}}{\text{tinggi bayangan tongkat}}" />
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🌳 ILUSTRASI BAYANGAN:</p>
                  <DiagramBayangan />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Selalu pastikan satuan panjangnya sama sebelum menghitung! Jika ada yang dalam cm dan ada yang dalam meter, ubah dulu ke satuan yang sama.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Menghitung Panjang Rusuk" />
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
                      Trapesium ABCD sebangun dengan trapesium PQRS. Diketahui <InlineMath math="AB = 8" /> cm, <InlineMath math="DC = 6" /> cm, <InlineMath math="BC = 5" /> cm, <InlineMath math="AD = 4" /> cm, dan <InlineMath math="PQ = 16" /> cm. Tentukan panjang <InlineMath math="QR" />, <InlineMath math="RS" />, dan <InlineMath math="PS" />!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Tentukan faktor skala dari perbandingan sisi yang diketahui:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="k = \frac{PQ}{AB} = \frac{16}{8} = 2" />
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung semua sisi PQRS:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="QR = k \times BC = 2 \times 5 = 10 \text{ cm}" />
                        <BlockMath math="RS = k \times DC = 2 \times 6 = 12 \text{ cm}" />
                        <BlockMath math="PS = k \times AD = 2 \times 4 = 8 \text{ cm}" />
                      </div>
                      <p><strong className="text-green-300">QR = 10 cm, RS = 12 cm, PS = 8 cm.</strong></p>
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
                      Segiempat ABCD sebangun dengan PQRS. Diketahui <InlineMath math="AD = 4" /> cm, <InlineMath math="PS = 6" /> cm, <InlineMath math="CD = 3" /> cm, dan <InlineMath math="\angle A = 75°" />. Tentukan panjang <InlineMath math="RS" /> dan besar <InlineMath math="\angle P" />!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Cari RS:</strong> AD bersesuaian dengan PS, CD bersesuaian dengan RS:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AD}{PS} = \frac{CD}{RS} \Rightarrow \frac{4}{6} = \frac{3}{RS}" />
                        <BlockMath math="RS = \frac{3 \times 6}{4} = \frac{18}{4} = 4{,}5 \text{ cm}" />
                      </div>
                      <p><strong>Cari ∠P:</strong> Sudut yang bersesuaian sama besar:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\angle P = \angle A = 75°" />
                      </div>
                      <p><strong className="text-yellow-300">RS = 4,5 cm dan ∠P = 75°.</strong></p>
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
                      Pada siang hari, sebuah tiang bendera setinggi 3 m mempunyai bayangan 1,8 m. Pada saat yang sama, sebuah pohon mempunyai bayangan sepanjang 2,1 m. Tentukan tinggi pohon tersebut!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Konsep:</strong> Tiang dan bayangan membentuk segitiga yang sebangun dengan pohon dan bayangannya (karena sudut elevasi matahari sama).</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{\text{tinggi tiang}}{\text{bayangan tiang}} = \frac{\text{tinggi pohon}}{\text{bayangan pohon}}" />
                        <BlockMath math="\frac{3}{1{,}8} = \frac{h}{2{,}1}" />
                      </div>
                      <p><strong>Selesaikan:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="h = \frac{3 \times 2{,}1}{1{,}8} = \frac{6{,}3}{1{,}8} = 3{,}5 \text{ m}" />
                      </div>
                      <p><strong className="text-primary">Tinggi pohon = 3,5 m.</strong></p>
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
export default MenghitungRusukPage;
