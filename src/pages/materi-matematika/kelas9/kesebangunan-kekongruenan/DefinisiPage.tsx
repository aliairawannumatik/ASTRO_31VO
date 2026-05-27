import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import SimilarityAnimation from "@/components/SimilarityAnimation";

/* ── DIAGRAMS ── */

const DiagramSebangun = () => (
  <svg viewBox="0 0 340 160" className="w-full max-w-sm mx-auto">
    {/* Rectangle 1 */}
    <rect x="20" y="40" width="80" height="50" fill="#3b82f6" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="2" rx="2" />
    <text x="60" y="72" textAnchor="middle" fontSize="9" fill="#93c5fd">ABCD</text>
    <text x="60" y="105" textAnchor="middle" fontSize="8" fill="#64748b">4 cm × 2,5 cm</text>
    {/* Arrow */}
    <text x="120" y="70" fontSize="18" fill="#facc15">~</text>
    {/* Rectangle 2 */}
    <rect x="150" y="25" width="120" height="75" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="2" rx="2" />
    <text x="210" y="65" textAnchor="middle" fontSize="9" fill="#86efac">EFGH</text>
    <text x="210" y="115" textAnchor="middle" fontSize="8" fill="#64748b">6 cm × 3,75 cm</text>
    {/* Ratio labels */}
    <text x="170" y="15" fontSize="8" fill="#fde68a">AB/EF = BC/FG = 2/3</text>
    {/* Angle indicators */}
    <path d="M20,40 Q30,40 30,50" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <path d="M150,25 Q162,25 162,37" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <text x="22" y="58" fontSize="7" fill="#f97316">90°</text>
    <text x="152" y="43" fontSize="7" fill="#f97316">90°</text>
    <text x="60" y="20" textAnchor="middle" fontSize="9" fill="#facc15" fontWeight="bold">SEBANGUN (∼)</text>
    <text x="230" y="20" textAnchor="middle" fontSize="9" fill="#facc15" fontWeight="bold">sudut sama, rusuk sebanding</text>
  </svg>
);

const DiagramKongruen = () => (
  <svg viewBox="0 0 340 160" className="w-full max-w-sm mx-auto">
    {/* Triangle 1 */}
    <polygon points="30,130 110,130 70,50" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="2" />
    <text x="70" y="145" textAnchor="middle" fontSize="9" fill="#e9d5ff">△ABC</text>
    <text x="70" y="158" textAnchor="middle" fontSize="8" fill="#64748b">sisi = 5, 6, 7 cm</text>
    {/* Equals */}
    <text x="135" y="95" fontSize="20" fill="#facc15">≅</text>
    {/* Triangle 2 */}
    <polygon points="165,130 245,130 205,50" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="2" />
    <text x="205" y="145" textAnchor="middle" fontSize="9" fill="#e9d5ff">△DEF</text>
    <text x="205" y="158" textAnchor="middle" fontSize="8" fill="#64748b">sisi = 5, 6, 7 cm</text>
    {/* Labels */}
    <text x="170" y="20" textAnchor="middle" fontSize="9" fill="#facc15" fontWeight="bold">KONGRUEN (≅)</text>
    <text x="170" y="35" textAnchor="middle" fontSize="8" fill="#fde68a">bentuk SAMA, ukuran SAMA</text>
    {/* tick marks */}
    <line x1="70" y1="130" x2="70" y2="50" stroke="#f97316" strokeWidth="0.5" strokeDasharray="3,2" />
    <line x1="205" y1="130" x2="205" y2="50" stroke="#f97316" strokeWidth="0.5" strokeDasharray="3,2" />
    <line x1="30" y1="130" x2="70" y2="130" stroke="#22c55e" strokeWidth="2.5" />
    <line x1="165" y1="130" x2="205" y2="130" stroke="#22c55e" strokeWidth="2.5" />
    <text x="50" y="127" fontSize="8" fill="#22c55e">|</text>
    <text x="185" y="127" fontSize="8" fill="#22c55e">|</text>
  </svg>
);

const DiagramHubungan = () => (
  <svg viewBox="0 0 320 130" className="w-full max-w-sm mx-auto">
    <ellipse cx="160" cy="65" rx="150" ry="55" fill="#3b82f6" fillOpacity="0.1" stroke="#60a5fa" strokeWidth="1.5" />
    <text x="160" y="18" textAnchor="middle" fontSize="10" fill="#93c5fd" fontWeight="bold">SEBANGUN (∼)</text>
    <text x="160" y="32" textAnchor="middle" fontSize="8" fill="#64748b">sudut bersesuaian sama besar</text>
    <text x="160" y="44" textAnchor="middle" fontSize="8" fill="#64748b">rusuk bersesuaian sebanding</text>
    <ellipse cx="160" cy="85" rx="90" ry="33" fill="#22c55e" fillOpacity="0.15" stroke="#4ade80" strokeWidth="1.5" />
    <text x="160" y="80" textAnchor="middle" fontSize="10" fill="#86efac" fontWeight="bold">KONGRUEN (≅)</text>
    <text x="160" y="93" textAnchor="middle" fontSize="8" fill="#64748b">seperti sebangun, PLUS</text>
    <text x="160" y="105" textAnchor="middle" fontSize="8" fill="#64748b">ukuran (rusuk) juga SAMA</text>
    <text x="12" y="65" fontSize="8" fill="#fde68a">Kongruen ⊂ Sebangun</text>
  </svg>
);

const DefinisiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep1", "contoh1", "konsep2", "contoh2", "konsep3",
  ]);
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
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">DEFINISI KESEBANGUNAN DAN KEKONGRUENAN</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="🏙️ Dari Maket Gedung sampai Ubin Lantai" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernah lihat maket gedung atau miniatur rumah di kantor arsitek? Miniatur itu punya bentuk persis sama dengan bangunan aslinya, hanya skalanya lebih kecil — itulah <strong className="text-cyan-300">kesebangunan</strong> dalam kehidupan nyata!
                </p>
                <div className="rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-900/20">
                  <img
                    src="/arsitektur-maket.png"
                    alt="Maket gedung di meja arsitek dengan bangunan asli terlihat di latar belakang"
                    className="w-full object-cover max-h-64"
                  />
                  <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 text-xs">📐</span>
                      <p className="font-body text-xs text-white/50 italic">Maket gedung (depan) dan bangunan aslinya (belakang) — bentuk sama, ukuran berbeda. Inilah kesebangunan!</p>
                    </div>
                    <p className="font-body text-xs text-white/30 shrink-0">bing.com/images/create</p>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Sebaliknya, coba perhatikan ubin-ubin di lantai ruang kelasmu. Semua ubin punya bentuk <em>dan</em> ukuran yang persis sama, bukan hanya mirip bentuknya saja. Nah, itu namanya <strong>kekongruenan</strong>! 🧱
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Perbedaan Kunci:</strong> Dua bangun <strong className="text-yellow-300">sebangun</strong> jika bentuknya sama (ukuran boleh beda). Dua bangun <strong className="text-green-300">kongruen</strong> jika bentuk DAN ukurannya sama persis.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SUB-BAB 1: KESEBANGUNAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 Sub-Bab 1: Definisi Kesebangunan" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Dua bangun datar disebut <strong className="text-green-300">sebangun</strong> jika keduanya memenuhi dua syarat secara bersamaan:
                  </p>

                  {/* Visual SVG representasi rumus */}
                  <div className="bg-slate-900/70 rounded-lg p-3">
                    <p className="font-body text-xs text-slate-400 text-center mb-2">📊 Representasi Visual — warna sama = sisi bersesuaian</p>
                    <svg viewBox="0 0 340 148" className="w-full" xmlns="http://www.w3.org/2000/svg">
                      {/* ── Large rect ABCD ── */}
                      <rect x="16" y="25" width="148" height="88" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" rx="2"/>
                      {/* AB – amber */}
                      <line x1="16" y1="25" x2="164" y2="25" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
                      {/* BC – rose */}
                      <line x1="164" y1="25" x2="164" y2="113" stroke="#fb7185" strokeWidth="3" strokeLinecap="round"/>
                      {/* CD – emerald */}
                      <line x1="164" y1="113" x2="16" y2="113" stroke="#34d399" strokeWidth="3" strokeLinecap="round"/>
                      {/* DA – violet */}
                      <line x1="16" y1="113" x2="16" y2="25" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
                      {/* Vertex labels – ABCD */}
                      <text x="10"  y="22" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
                      <text x="166" y="22" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
                      <text x="166" y="124" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
                      <text x="10"  y="124" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="monospace" fontWeight="bold">D</text>
                      {/* ── Dashed connecting lines B→E and C→H ── */}
                      <line x1="164" y1="25" x2="196" y2="39" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3"/>
                      <line x1="164" y1="113" x2="196" y2="101" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3"/>
                      {/* k label between rects */}
                      <text x="180" y="71" fill="rgba(255,255,255,0.35)" fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontStyle="italic">k</text>
                      {/* ── Small rect EFGH ── */}
                      <rect x="196" y="39" width="99" height="59" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" rx="2"/>
                      {/* EF – amber */}
                      <line x1="196" y1="39" x2="295" y2="39" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
                      {/* FG – rose */}
                      <line x1="295" y1="39" x2="295" y2="98" stroke="#fb7185" strokeWidth="3" strokeLinecap="round"/>
                      {/* GH – emerald */}
                      <line x1="295" y1="98" x2="196" y2="98" stroke="#34d399" strokeWidth="3" strokeLinecap="round"/>
                      {/* HE – violet */}
                      <line x1="196" y1="98" x2="196" y2="39" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
                      {/* Vertex labels – EFGH */}
                      <text x="188" y="37" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="monospace" fontWeight="bold">E</text>
                      <text x="297" y="37" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="monospace" fontWeight="bold">F</text>
                      <text x="297" y="110" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="monospace" fontWeight="bold">G</text>
                      <text x="188" y="110" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="monospace" fontWeight="bold">H</text>
                      {/* Similarity symbol */}
                      <text x="170" y="140" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle" fontFamily="sans-serif">ABCD  ~  EFGH</text>
                    </svg>
                  </div>

                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2 font-body text-sm text-white/80">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold shrink-0">①</span>
                      <p><strong className="text-green-300">Sudut-sudut yang bersesuaian sama besar</strong> — setiap sudut di bangun pertama punya pasangan sudut yang sama besar di bangun kedua.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold shrink-0">②</span>
                      <p><strong className="text-green-300">Rusuk-rusuk yang bersesuaian sebanding</strong> — panjang sisi-sisinya membentuk perbandingan yang sama.</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                    <BlockMath math="\frac{AB}{EF} = \frac{BC}{FG} = \frac{CD}{GH} = \frac{DA}{HE} = k" />
                    <p className="font-body text-xs text-white/50 mt-1">k = faktor skala (rasio kesebangunan)</p>
                  </div>

                </div>
                {/* Interactive Similarity Animation */}
                <SimilarityAnimation />

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Penulisan dua bangun sebangun menggunakan simbol "<InlineMath math="\sim" />". Contoh: ABCD <InlineMath math="\sim" /> EFGH. Urutan huruf menunjukkan titik-titik yang saling bersesuaian, jadi jangan sampai keliru urutannya!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Kesebangunan Bangun Datar" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">
                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Persegi panjang ABCD dengan panjang <InlineMath math="AB = 10" /> cm dan lebar <InlineMath math="BC = 6" /> cm sebangun dengan persegi panjang PQRS. Jika <InlineMath math="PQ = 15" /> cm, tentukan panjang <InlineMath math="QR" />!</p>
                    {/* Diagram dua persegi panjang sebangun */}
                    <div className="flex justify-center">
                      <svg viewBox="0 0 380 130" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
                        {/* Persegi panjang ABCD (10×6) — skala: ×8 = 80×48 */}
                        <rect x="20" y="35" width="80" height="48" fill="rgba(96,165,250,0.15)" stroke="#60a5fa" strokeWidth="1.5" rx="1"/>
                        {/* Titik sudut ABCD */}
                        <circle cx="20" cy="35" r="2.5" fill="#60a5fa"/>
                        <circle cx="100" cy="35" r="2.5" fill="#60a5fa"/>
                        <circle cx="100" cy="83" r="2.5" fill="#60a5fa"/>
                        <circle cx="20" cy="83" r="2.5" fill="#60a5fa"/>
                        {/* Label sudut */}
                        <text x="11" y="32" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">A</text>
                        <text x="102" y="32" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">B</text>
                        <text x="102" y="92" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">C</text>
                        <text x="11" y="92" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">D</text>
                        {/* Label sisi */}
                        <text x="55" y="29" fill="#bfdbfe" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">10 cm</text>
                        <text x="108" y="61" fill="#bfdbfe" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">6 cm</text>
                        {/* Nama */}
                        <text x="60" y="68" fill="rgba(255,255,255,0.5)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">ABCD</text>

                        {/* Simbol ~ */}
                        <text x="158" y="64" fill="#facc15" fontSize="20" textAnchor="middle" fontFamily="sans-serif">~</text>

                        {/* Persegi panjang PQRS (15×9) — skala: ×8 = 120×72 */}
                        <rect x="190" y="23" width="120" height="72" fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1.5" rx="1"/>
                        {/* Titik sudut PQRS */}
                        <circle cx="190" cy="23" r="2.5" fill="#34d399"/>
                        <circle cx="310" cy="23" r="2.5" fill="#34d399"/>
                        <circle cx="310" cy="95" r="2.5" fill="#34d399"/>
                        <circle cx="190" cy="95" r="2.5" fill="#34d399"/>
                        {/* Label sudut */}
                        <text x="180" y="21" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">P</text>
                        <text x="313" y="21" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Q</text>
                        <text x="313" y="104" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">R</text>
                        <text x="180" y="104" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">S</text>
                        {/* Label sisi */}
                        <text x="250" y="17" fill="#a7f3d0" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">15 cm</text>
                        <text x="322" y="61" fill="#a7f3d0" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">? cm</text>
                        {/* Nama */}
                        <text x="250" y="63" fill="rgba(255,255,255,0.5)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">PQRS</text>

                        {/* Keterangan faktor skala */}
                        <text x="190" y="118" fill="rgba(250,204,21,0.7)" fontSize="7.5" fontFamily="sans-serif">Faktor skala: 15/10 = 1,5×</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Karena sebangun, rusuk-rusuk yang bersesuaian sebanding:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR}" />
                        <BlockMath math="\frac{10}{15} = \frac{6}{QR}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Selesaikan dengan perkalian silang:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="10 \times QR = 15 \times 6 = 90" />
                        <BlockMath math="QR = \frac{90}{10} = 9 \text{ cm}" />
                      </div>
                      <p><strong className="text-green-300">Panjang QR = 9 cm.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Segiempat ABCD <InlineMath math="\sim" /> EFGH. Diketahui <InlineMath math="\angle A = 80°" />, <InlineMath math="\angle B = 95°" />, <InlineMath math="\angle C = 100°" />. Tentukan besar <InlineMath math="\angle E" />, <InlineMath math="\angle F" />, <InlineMath math="\angle G" />, dan <InlineMath math="\angle H" />!</p>
                    {/* Diagram dua segiempat sebangun dengan label sudut */}
                    <div className="flex justify-center">
                      <svg viewBox="0 0 380 120" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
                        {/* Segiempat ABCD */}
                        <polygon points="22,18 102,12 108,78 18,84" fill="rgba(250,204,21,0.1)" stroke="#facc15" strokeWidth="1.5"/>
                        <circle cx="22" cy="18" r="2.5" fill="#facc15"/>
                        <circle cx="102" cy="12" r="2.5" fill="#facc15"/>
                        <circle cx="108" cy="78" r="2.5" fill="#facc15"/>
                        <circle cx="18" cy="84" r="2.5" fill="#facc15"/>
                        {/* Label titik */}
                        <text x="9" y="16" fill="#fde68a" fontSize="9" fontFamily="sans-serif" fontWeight="bold">A</text>
                        <text x="105" y="11" fill="#fde68a" fontSize="9" fontFamily="sans-serif" fontWeight="bold">B</text>
                        <text x="111" y="86" fill="#fde68a" fontSize="9" fontFamily="sans-serif" fontWeight="bold">C</text>
                        <text x="6" y="93" fill="#fde68a" fontSize="9" fontFamily="sans-serif" fontWeight="bold">D</text>
                        {/* Label sudut */}
                        <text x="26" y="32" fill="#fbbf24" fontSize="7.5" fontFamily="sans-serif">80°</text>
                        <text x="88" y="28" fill="#fbbf24" fontSize="7.5" fontFamily="sans-serif">95°</text>
                        <text x="88" y="72" fill="#fbbf24" fontSize="7.5" fontFamily="sans-serif">100°</text>
                        <text x="24" y="74" fill="#fbbf24" fontSize="7.5" fontFamily="sans-serif">85°</text>
                        <text x="60" y="52" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">ABCD</text>

                        {/* Simbol ~ */}
                        <text x="155" y="52" fill="#facc15" fontSize="20" textAnchor="middle" fontFamily="sans-serif">~</text>

                        {/* Segiempat EFGH (sedikit lebih besar, bentuk serupa) */}
                        <polygon points="178,15 272,8 280,82 174,90" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
                        <circle cx="178" cy="15" r="2.5" fill="#a78bfa"/>
                        <circle cx="272" cy="8" r="2.5" fill="#a78bfa"/>
                        <circle cx="280" cy="82" r="2.5" fill="#a78bfa"/>
                        <circle cx="174" cy="90" r="2.5" fill="#a78bfa"/>
                        {/* Label titik */}
                        <text x="164" y="13" fill="#c4b5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">E</text>
                        <text x="274" y="8" fill="#c4b5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">F</text>
                        <text x="283" y="91" fill="#c4b5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">G</text>
                        <text x="161" y="99" fill="#c4b5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">H</text>
                        {/* Label sudut */}
                        <text x="182" y="30" fill="#a78bfa" fontSize="7.5" fontFamily="sans-serif">80°</text>
                        <text x="254" y="25" fill="#a78bfa" fontSize="7.5" fontFamily="sans-serif">95°</text>
                        <text x="254" y="76" fill="#a78bfa" fontSize="7.5" fontFamily="sans-serif">100°</text>
                        <text x="178" y="78" fill="#a78bfa" fontSize="7.5" fontFamily="sans-serif">85°</text>
                        <text x="228" y="52" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">EFGH</text>

                        {/* Keterangan */}
                        <text x="178" y="108" fill="rgba(250,204,21,0.7)" fontSize="7.5" fontFamily="sans-serif">Sudut bersesuaian sama besar: ∠E=∠A, ∠F=∠B, ∠G=∠C, ∠H=∠D</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Cari <InlineMath math="\angle D" /> dari jumlah sudut segiempat = 360°:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\angle D = 360° - 80° - 95° - 100° = 85°" />
                      </div>
                      <p><strong>Langkah 2:</strong> Karena sebangun, sudut yang bersesuaian sama besar:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-sm">
                        <p><InlineMath math="\angle E = \angle A = 80°" /></p>
                        <p><InlineMath math="\angle F = \angle B = 95°" /></p>
                        <p><InlineMath math="\angle G = \angle C = 100°" /></p>
                        <p><InlineMath math="\angle H = \angle D = 85°" /></p>
                      </div>
                      <p><strong className="text-yellow-300">∠E = 80°, ∠F = 95°, ∠G = 100°, ∠H = 85°.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Segitiga ABC <InlineMath math="\sim" /> segitiga PQR dengan <InlineMath math="AB = 8" /> cm, <InlineMath math="BC = 12" /> cm, <InlineMath math="AC = 10" /> cm. Jika keliling segitiga PQR = 45 cm, tentukan panjang PQ, QR, dan PR!</p>
                    {/* Diagram dua segitiga sebangun */}
                    <div className="flex justify-center">
                      <svg viewBox="0 0 380 125" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
                        {/* Segitiga ABC: A(atas), B(kiri-bawah), C(kanan-bawah) */}
                        {/* AB=8, BC=12, AC=10 → skala 5px/cm */}
                        {/* B=(15,88), C=(75,88), A=(30,28) */}
                        <polygon points="30,20 15,88 87,88" fill="rgba(248,113,113,0.12)" stroke="#f87171" strokeWidth="1.5"/>
                        <circle cx="30" cy="20" r="2.5" fill="#f87171"/>
                        <circle cx="15" cy="88" r="2.5" fill="#f87171"/>
                        <circle cx="87" cy="88" r="2.5" fill="#f87171"/>
                        {/* Label titik */}
                        <text x="25" y="13" fill="#fca5a5" fontSize="9" fontFamily="sans-serif" fontWeight="bold">A</text>
                        <text x="4" y="96" fill="#fca5a5" fontSize="9" fontFamily="sans-serif" fontWeight="bold">B</text>
                        <text x="90" y="96" fill="#fca5a5" fontSize="9" fontFamily="sans-serif" fontWeight="bold">C</text>
                        {/* Label sisi */}
                        {/* AB = 8 cm (sisi kiri miring) */}
                        <text x="14" y="50" fill="#fca5a5" fontSize="8" fontFamily="sans-serif">8 cm</text>
                        {/* BC = 12 cm (alas) */}
                        <text x="45" y="100" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">12 cm</text>
                        {/* AC = 10 cm (sisi kanan miring) */}
                        <text x="66" y="50" fill="#fca5a5" fontSize="8" fontFamily="sans-serif">10 cm</text>
                        <text x="51" y="60" fill="rgba(255,255,255,0.35)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">△ABC</text>

                        {/* Simbol ~ */}
                        <text x="145" y="58" fill="#facc15" fontSize="20" textAnchor="middle" fontFamily="sans-serif">~</text>

                        {/* Segitiga PQR: lebih besar (k=1.5) */}
                        {/* PQ=12, QR=18, PR=15 → skala 5px/cm */}
                        {/* Q=(175,88), R=(265,88), P=(197,18) */}
                        <polygon points="200,12 175,100 283,100" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="1.5"/>
                        <circle cx="200" cy="12" r="2.5" fill="#34d399"/>
                        <circle cx="175" cy="100" r="2.5" fill="#34d399"/>
                        <circle cx="283" cy="100" r="2.5" fill="#34d399"/>
                        {/* Label titik */}
                        <text x="195" y="8" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">P</text>
                        <text x="163" y="110" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Q</text>
                        <text x="286" y="110" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">R</text>
                        {/* Label sisi */}
                        {/* PQ = 12 cm */}
                        <text x="175" y="52" fill="#6ee7b7" fontSize="8" fontFamily="sans-serif">12 cm</text>
                        {/* QR = 18 cm */}
                        <text x="224" y="114" fill="#6ee7b7" fontSize="8" textAnchor="middle" fontFamily="sans-serif">18 cm</text>
                        {/* PR = 15 cm */}
                        <text x="251" y="52" fill="#6ee7b7" fontSize="8" fontFamily="sans-serif">15 cm</text>
                        <text x="229" y="68" fill="rgba(255,255,255,0.35)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">△PQR</text>

                        {/* Keterangan faktor skala */}
                        <text x="175" y="122" fill="rgba(250,204,21,0.7)" fontSize="7.5" fontFamily="sans-serif">Faktor skala k = 45/30 = 1,5× (setiap sisi PQR = 1,5 × sisi ABC)</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung keliling △ABC:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="K_{ABC} = 8 + 12 + 10 = 30 \text{ cm}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Faktor skala dari ABC ke PQR:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="k = \frac{K_{PQR}}{K_{ABC}} = \frac{45}{30} = \frac{3}{2}" />
                      </div>
                      <p><strong>Langkah 3:</strong> Hitung setiap sisi △PQR:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="PQ = \frac{3}{2} \times 8 = 12 \text{ cm}" />
                        <BlockMath math="QR = \frac{3}{2} \times 12 = 18 \text{ cm}" />
                        <BlockMath math="PR = \frac{3}{2} \times 10 = 15 \text{ cm}" />
                      </div>
                      <p><strong className="text-primary">PQ = 12 cm, QR = 18 cm, PR = 15 cm.</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SUB-BAB 2: KEKONGRUENAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep2" icon={<Target className="w-5 h-5" />} color="#c084fc" label="📘 Sub-Bab 2: Definisi Kekongruenan" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-purple-300">Kekongruenan</strong> adalah "kesebangunan spesial" — dua bangun datar disebut <strong>kongruen</strong> jika memenuhi:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2 font-body text-sm text-white/80">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold shrink-0">①</span>
                      <p><strong className="text-purple-300">Sudut-sudut yang bersesuaian sama besar</strong></p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold shrink-0">②</span>
                      <p><strong className="text-purple-300">Rusuk-rusuk yang bersesuaian sama panjang</strong> (bukan hanya sebanding, tapi SAMA!)</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                    <BlockMath math="AB = PQ,\; BC = QR,\; AC = PR" />
                    <p className="font-body text-xs text-white/50 mt-1">Simbol kongruen: ≅ (sama dan sebangun)</p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ILUSTRASI DUA SEGITIGA KONGRUEN:</p>
                  <DiagramKongruen />
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 HUBUNGAN SEBANGUN DAN KONGRUEN:</p>
                  <DiagramHubungan />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Kunci Hubungan:</strong> Bangun yang <strong className="text-purple-300">kongruen</strong> sudah pasti <strong className="text-green-300">sebangun</strong>, tapi bangun yang sebangun belum tentu kongruen (kecuali faktor skalanya <InlineMath math="k = 1" />).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh2" icon={<Calculator className="w-5 h-5" />} color="#c084fc" label="📝 Contoh Soal — Kekongruenan Bangun Datar" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">
                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Diketahui △ABC ≅ △PQR dengan <InlineMath math="AB = 12" /> cm, <InlineMath math="AC = 5" /> cm, dan <InlineMath math="\angle A = 90°" />. Tentukan panjang PQ, PR, dan QR!</p>
                    {/* Diagram dua segitiga siku-siku kongruen */}
                    <div className="flex justify-center">
                      <svg viewBox="0 0 340 110" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
                        {/* Segitiga ABC: sudut siku-siku di A */}
                        {/* A=(20,85), B=(20,25) AB=12→60px, C=(45,85) AC=5→25px */}
                        <polygon points="20,85 20,25 45,85" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="1.5"/>
                        {/* Tanda siku-siku di A */}
                        <polyline points="20,78 27,78 27,85" fill="none" stroke="#34d399" strokeWidth="1"/>
                        <circle cx="20" cy="85" r="2.5" fill="#34d399"/>
                        <circle cx="20" cy="25" r="2.5" fill="#34d399"/>
                        <circle cx="45" cy="85" r="2.5" fill="#34d399"/>
                        <text x="7"  y="89" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">A</text>
                        <text x="7"  y="23" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">B</text>
                        <text x="47" y="89" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">C</text>
                        {/* Label sisi */}
                        <text x="4"  y="58" fill="#a7f3d0" fontSize="8" fontFamily="sans-serif">12</text>
                        <text x="27" y="93" fill="#a7f3d0" fontSize="8" fontFamily="sans-serif">5</text>
                        <text x="38" y="52" fill="#a7f3d0" fontSize="8" fontFamily="sans-serif">13</text>
                        <text x="25" y="65" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="sans-serif">△ABC</text>

                        {/* Simbol ≅ */}
                        <text x="118" y="62" fill="#facc15" fontSize="16" textAnchor="middle" fontFamily="sans-serif">≅</text>

                        {/* Segitiga PQR: kongruen dengan ABC */}
                        <polygon points="175,85 175,25 200,85" fill="rgba(96,165,250,0.12)" stroke="#60a5fa" strokeWidth="1.5"/>
                        {/* Tanda siku-siku di P */}
                        <polyline points="175,78 182,78 182,85" fill="none" stroke="#60a5fa" strokeWidth="1"/>
                        <circle cx="175" cy="85" r="2.5" fill="#60a5fa"/>
                        <circle cx="175" cy="25" r="2.5" fill="#60a5fa"/>
                        <circle cx="200" cy="85" r="2.5" fill="#60a5fa"/>
                        <text x="162" y="89" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">P</text>
                        <text x="162" y="23" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Q</text>
                        <text x="202" y="89" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">R</text>
                        <text x="158" y="58" fill="#bfdbfe" fontSize="8" fontFamily="sans-serif">12</text>
                        <text x="182" y="93" fill="#bfdbfe" fontSize="8" fontFamily="sans-serif">5</text>
                        <text x="193" y="52" fill="#bfdbfe" fontSize="8" fontFamily="sans-serif">13</text>
                        <text x="180" y="65" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="sans-serif">△PQR</text>

                        {/* Keterangan */}
                        <text x="20" y="105" fill="rgba(250,204,21,0.7)" fontSize="7.5" fontFamily="sans-serif">Kongruen → semua sisi & sudut bersesuaian SAMA. QR = √(12²+5²) = 13 cm</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Karena kongruen, sisi yang bersesuaian SAMA PANJANG:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p><InlineMath math="PQ = AB = 12 \text{ cm}" /></p>
                        <p><InlineMath math="PR = AC = 5 \text{ cm}" /></p>
                        <p><InlineMath math="\angle P = \angle A = 90°" /></p>
                      </div>
                      <p>Cari QR dengan Teorema Pythagoras:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="QR = \sqrt{PQ^2 + PR^2} = \sqrt{144 + 25} = \sqrt{169} = 13 \text{ cm}" />
                      </div>
                      <p><strong className="text-green-300">PQ = 12 cm, PR = 5 cm, QR = 13 cm.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Apakah pasangan berikut sebangun, kongruen, atau keduanya? Segitiga P dengan sisi 3, 4, 5 cm dan Segitiga Q dengan sisi 6, 8, 10 cm. Jelaskan!</p>
                    {/* Diagram dua segitiga: satu kecil (3-4-5) satu besar (6-8-10) */}
                    <div className="flex justify-center">
                      <svg viewBox="0 0 340 105" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
                        {/* Segitiga P (3,4,5) skala 8px/cm */}
                        {/* siku-siku di kiri bawah: (15,75), atas:(15,51), kanan:(47,75) */}
                        <polygon points="15,75 15,51 47,75" fill="rgba(250,204,21,0.12)" stroke="#facc15" strokeWidth="1.5"/>
                        <polyline points="15,68 22,68 22,75" fill="none" stroke="#facc15" strokeWidth="1"/>
                        <circle cx="15" cy="75" r="2" fill="#facc15"/>
                        <circle cx="15" cy="51" r="2" fill="#facc15"/>
                        <circle cx="47" cy="75" r="2" fill="#facc15"/>
                        <text x="3"  y="79" fill="#fde68a" fontSize="8" fontFamily="sans-serif" fontWeight="bold">B</text>
                        <text x="3"  y="49" fill="#fde68a" fontSize="8" fontFamily="sans-serif" fontWeight="bold">A</text>
                        <text x="49" y="79" fill="#fde68a" fontSize="8" fontFamily="sans-serif" fontWeight="bold">C</text>
                        <text x="2"  y="65" fill="#fbbf24" fontSize="7.5" fontFamily="sans-serif">3</text>
                        <text x="26" y="83" fill="#fbbf24" fontSize="7.5" fontFamily="sans-serif">4</text>
                        <text x="35" y="61" fill="#fbbf24" fontSize="7.5" fontFamily="sans-serif">5</text>
                        <text x="22" y="66" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="sans-serif">△P</text>

                        {/* Label satuan */}
                        <text x="8" y="90" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="sans-serif">(3,4,5 cm)</text>

                        {/* Simbol ~ tapi tidak ≅ */}
                        <text x="100" y="67" fill="#facc15" fontSize="14" textAnchor="middle" fontFamily="sans-serif">~</text>
                        <text x="100" y="80" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="sans-serif">tdk ≅</text>

                        {/* Segitiga Q (6,8,10) skala 8px/cm */}
                        {/* siku-siku di kiri bawah: (145,85), atas:(145,37), kanan:(209,85) */}
                        <polygon points="145,85 145,37 209,85" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="1.5"/>
                        <polyline points="145,78 152,78 152,85" fill="none" stroke="#a78bfa" strokeWidth="1"/>
                        <circle cx="145" cy="85" r="2" fill="#a78bfa"/>
                        <circle cx="145" cy="37" r="2" fill="#a78bfa"/>
                        <circle cx="209" cy="85" r="2" fill="#a78bfa"/>
                        <text x="133" y="89" fill="#c4b5fd" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Q</text>
                        <text x="133" y="35" fill="#c4b5fd" fontSize="8" fontFamily="sans-serif" fontWeight="bold">P</text>
                        <text x="212" y="89" fill="#c4b5fd" fontSize="8" fontFamily="sans-serif" fontWeight="bold">R</text>
                        <text x="130" y="63" fill="#c4b5fd" fontSize="7.5" fontFamily="sans-serif">6</text>
                        <text x="172" y="95" fill="#c4b5fd" fontSize="7.5" fontFamily="sans-serif">8</text>
                        <text x="183" y="58" fill="#c4b5fd" fontSize="7.5" fontFamily="sans-serif">10</text>
                        <text x="165" y="68" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="sans-serif">△Q</text>
                        <text x="133" y="100" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="sans-serif">(6,8,10 cm)</text>

                        {/* Keterangan */}
                        <text x="20" y="102" fill="rgba(250,204,21,0.65)" fontSize="7" fontFamily="sans-serif">Rasio 3:6=4:8=5:10=½ → Sebangun ✓ | Sisi ≠ sama panjang → Tidak Kongruen ✗</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Cek perbandingan rusuk:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{3}{6} = \frac{4}{8} = \frac{5}{10} = \frac{1}{2}" />
                      </div>
                      <p>Perbandingan sama → <strong className="text-green-300">Sebangun ✓</strong></p>
                      <p><strong>Cek ukuran:</strong> Sisi-sisi tidak sama panjang (3 ≠ 6, dst.) → <strong className="text-red-300">Tidak kongruen ✗</strong></p>
                      <p><strong className="text-yellow-300">Kesimpulan: Kedua segitiga SEBANGUN, tapi TIDAK KONGRUEN.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Diketahui segi-6 beraturan ABCDEF dan segi-6 beraturan PQRSTU. Sisi ABCDEF = 5 cm dan sisi PQRSTU = 5 cm. Apakah kedua bangun tersebut sebangun? Kongruen? Berikan alasannya!</p>
                    {/* Diagram dua segi-6 beraturan sama ukuran → sebangun & kongruen */}
                    <div className="flex justify-center">
                      <svg viewBox="0 0 340 115" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
                        {/* Segi-6 ABCDEF, center(58,57), r=28 */}
                        {/* A=top(58,29), B=top-right(82,43), C=bot-right(82,71), D=bot(58,85), E=bot-left(34,71), F=top-left(34,43) */}
                        <polygon points="58,29 82,43 82,71 58,85 34,71 34,43" fill="rgba(248,113,113,0.12)" stroke="#f87171" strokeWidth="1.5"/>
                        <circle cx="58" cy="29" r="2" fill="#f87171"/>
                        <circle cx="82" cy="43" r="2" fill="#f87171"/>
                        <circle cx="82" cy="71" r="2" fill="#f87171"/>
                        <circle cx="58" cy="85" r="2" fill="#f87171"/>
                        <circle cx="34" cy="71" r="2" fill="#f87171"/>
                        <circle cx="34" cy="43" r="2" fill="#f87171"/>
                        <text x="54" y="23"  fill="#fca5a5" fontSize="8" fontFamily="sans-serif" fontWeight="bold">A</text>
                        <text x="84" y="43"  fill="#fca5a5" fontSize="8" fontFamily="sans-serif" fontWeight="bold">B</text>
                        <text x="84" y="74"  fill="#fca5a5" fontSize="8" fontFamily="sans-serif" fontWeight="bold">C</text>
                        <text x="54" y="96"  fill="#fca5a5" fontSize="8" fontFamily="sans-serif" fontWeight="bold">D</text>
                        <text x="22" y="74"  fill="#fca5a5" fontSize="8" fontFamily="sans-serif" fontWeight="bold">E</text>
                        <text x="22" y="43"  fill="#fca5a5" fontSize="8" fontFamily="sans-serif" fontWeight="bold">F</text>
                        {/* Label sisi contoh */}
                        <text x="60" y="26" fill="#fca5a5" fontSize="7" fontFamily="sans-serif">5cm</text>
                        <text x="48" y="62" fill="rgba(255,255,255,0.3)" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">ABCDEF</text>
                        <text x="48" y="71" fill="rgba(255,255,255,0.25)" fontSize="6.5" textAnchor="middle" fontFamily="sans-serif">120° tiap sudut</text>

                        {/* Simbol ~ dan ≅ */}
                        <text x="158" y="54" fill="#facc15" fontSize="14" textAnchor="middle" fontFamily="sans-serif">~</text>
                        <text x="158" y="70" fill="#34d399" fontSize="12" textAnchor="middle" fontFamily="sans-serif">≅</text>

                        {/* Segi-6 PQRSTU, center(238,57), r=28 — ukuran sama */}
                        <polygon points="238,29 262,43 262,71 238,85 214,71 214,43" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="1.5"/>
                        <circle cx="238" cy="29" r="2" fill="#34d399"/>
                        <circle cx="262" cy="43" r="2" fill="#34d399"/>
                        <circle cx="262" cy="71" r="2" fill="#34d399"/>
                        <circle cx="238" cy="85" r="2" fill="#34d399"/>
                        <circle cx="214" cy="71" r="2" fill="#34d399"/>
                        <circle cx="214" cy="43" r="2" fill="#34d399"/>
                        <text x="234" y="23"  fill="#6ee7b7" fontSize="8" fontFamily="sans-serif" fontWeight="bold">P</text>
                        <text x="264" y="43"  fill="#6ee7b7" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Q</text>
                        <text x="264" y="74"  fill="#6ee7b7" fontSize="8" fontFamily="sans-serif" fontWeight="bold">R</text>
                        <text x="234" y="96"  fill="#6ee7b7" fontSize="8" fontFamily="sans-serif" fontWeight="bold">S</text>
                        <text x="201" y="74"  fill="#6ee7b7" fontSize="8" fontFamily="sans-serif" fontWeight="bold">T</text>
                        <text x="201" y="43"  fill="#6ee7b7" fontSize="8" fontFamily="sans-serif" fontWeight="bold">U</text>
                        <text x="240" y="26" fill="#6ee7b7" fontSize="7" fontFamily="sans-serif">5cm</text>
                        <text x="228" y="62" fill="rgba(255,255,255,0.3)" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">PQRSTU</text>
                        <text x="228" y="71" fill="rgba(255,255,255,0.25)" fontSize="6.5" textAnchor="middle" fontFamily="sans-serif">120° tiap sudut</text>

                        {/* Keterangan */}
                        <text x="20" y="108" fill="rgba(250,204,21,0.65)" fontSize="7" fontFamily="sans-serif">Sisi sama (k=1) + sudut sama (120°) → Sebangun ✓ dan Kongruen ✓</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Cek sudut:</strong> Setiap segi-6 beraturan memiliki sudut dalam <InlineMath math="= \frac{(6-2) \times 180°}{6} = 120°" /> → sudut bersesuaian sama besar ✓</p>
                      <p><strong>Cek rusuk:</strong> Perbandingan = <InlineMath math="\frac{5}{5} = 1" /> → Rusuk sebanding dengan rasio 1 ✓, dan sama panjang ✓</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-sm text-white/80">Karena rasio = 1, artinya rusuk-rusuknya sama panjang:</p>
                        <BlockMath math="k = \frac{5}{5} = 1 \Rightarrow \text{Kongruen!}" />
                      </div>
                      <p><strong className="text-primary">Kedua segi-6 beraturan tersebut SEBANGUN dan KONGRUEN.</strong></p>
                      <p className="text-xs text-white/60">Catatan: Dua bangun beraturan yang sejenis (n-gon beraturan) selalu sebangun. Jika sisinya juga sama panjang, maka kongruen.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl p-5 space-y-3">
            <p className="font-body text-sm font-semibold text-cyan-300">🌟 Rangkuman Definisi</p>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-xs text-white/80">
                <thead><tr className="border-b border-cyan-500/30">
                  <th className="text-left py-2 text-cyan-300">Konsep</th>
                  <th className="text-left py-2 text-cyan-300">Sudut</th>
                  <th className="text-left py-2 text-cyan-300">Rusuk</th>
                  <th className="text-left py-2 text-cyan-300">Simbol</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-700">
                  <tr><td className="py-2 text-green-300">Sebangun</td><td className="py-2">Sama besar</td><td className="py-2">Sebanding (k)</td><td className="py-2"><InlineMath math="\sim" /></td></tr>
                  <tr><td className="py-2 text-purple-300">Kongruen</td><td className="py-2">Sama besar</td><td className="py-2">Sama panjang (k=1)</td><td className="py-2"><InlineMath math="\cong" /></td></tr>
                </tbody>
              </table>
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
export default DefinisiPage;
