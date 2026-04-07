import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ──────────────────────────────────────────
   SVG DIAGRAMS
────────────────────────────────────────── */

const DuaGarisSVGAll = () => (
  <svg viewBox="0 0 340 260" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="ar1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" />
      </marker>
      <marker id="ar2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" />
      </marker>
      <marker id="ar3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#fb923c" />
      </marker>
      <marker id="ar1L" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
        <path d="M8,0 L8,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="ar2L" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
        <path d="M8,0 L8,6 L0,3 z" fill="#a78bfa" />
      </marker>
    </defs>
    {/* garis g1 */}
    <line x1="20" y1="80" x2="305" y2="80" stroke="#22d3ee" strokeWidth="2.5"
      markerEnd="url(#ar1)" markerStart="url(#ar1L)" />
    <text x="310" y="84" fill="#22d3ee" fontSize="13" fontFamily="monospace">g₁</text>
    {/* garis g2 */}
    <line x1="20" y1="180" x2="305" y2="180" stroke="#a78bfa" strokeWidth="2.5"
      markerEnd="url(#ar2)" markerStart="url(#ar2L)" />
    <text x="310" y="184" fill="#a78bfa" fontSize="13" fontFamily="monospace">g₂</text>
    {/* garis transversal h */}
    <line x1="90" y1="15" x2="210" y2="245" stroke="#fb923c" strokeWidth="2.5"
      markerEnd="url(#ar3)" />
    <text x="213" y="248" fill="#fb923c" fontSize="13" fontFamily="monospace">h</text>

    {/* Titik A (perpotongan g1 & h) ≈ (128, 80) */}
    <circle cx="128" cy="80" r="3.5" fill="#facc15" />
    <text x="112" y="70" fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>

    {/* Label sudut di A */}
    <text x="102" y="76" fill="#4ade80" fontSize="11" fontFamily="monospace">∠A2</text>
    <text x="133" y="76" fill="#4ade80" fontSize="11" fontFamily="monospace">∠A1</text>
    <text x="102" y="97" fill="#f472b6" fontSize="11" fontFamily="monospace">∠A3</text>
    <text x="133" y="97" fill="#f472b6" fontSize="11" fontFamily="monospace">∠A4</text>

    {/* Titik B (perpotongan g2 & h) ≈ (168, 180) */}
    <circle cx="168" cy="180" r="3.5" fill="#facc15" />
    <text x="152" y="172" fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>

    {/* Label sudut di B */}
    <text x="142" y="176" fill="#4ade80" fontSize="11" fontFamily="monospace">∠B2</text>
    <text x="172" y="176" fill="#4ade80" fontSize="11" fontFamily="monospace">∠B1</text>
    <text x="142" y="197" fill="#f472b6" fontSize="11" fontFamily="monospace">∠B3</text>
    <text x="172" y="197" fill="#f472b6" fontSize="11" fontFamily="monospace">∠B4</text>

    {/* Legenda */}
    <rect x="10" y="215" width="320" height="36" rx="6" fill="rgba(15,23,42,0.7)" stroke="#334155" strokeWidth="1"/>
    <text x="18" y="229" fill="#22d3ee" fontSize="10" fontFamily="monospace">g₁ // g₂  (sejajar)</text>
    <text x="18" y="244" fill="#fb923c" fontSize="10" fontFamily="monospace">h = garis pemotong (transversal)</text>
    <text x="170" y="229" fill="#4ade80" fontSize="10" fontFamily="monospace">∠A1,A2,B1,B2 = atas garis</text>
    <text x="170" y="244" fill="#f472b6" fontSize="10" fontFamily="monospace">∠A3,A4,B3,B4 = bawah garis</text>
  </svg>
);

const SehadapSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <marker id="sh1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
      </marker>
      <marker id="sh1L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="sh2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#a78bfa" />
      </marker>
      <marker id="sh2L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#a78bfa" />
      </marker>
      <marker id="sh3" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#fb923c" />
      </marker>
    </defs>
    <line x1="15" y1="70" x2="285" y2="70" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#sh1)" markerStart="url(#sh1L)" />
    <line x1="15" y1="155" x2="285" y2="155" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#sh2)" markerStart="url(#sh2L)" />
    <line x1="78" y1="10" x2="162" y2="190" stroke="#fb923c" strokeWidth="2" markerEnd="url(#sh3)" />
    <circle cx="107" cy="70" r="3" fill="#facc15" />
    <circle cx="138" cy="155" r="3" fill="#facc15" />
    <text x="87" y="65" fill="#facc15" fontSize="11" fontFamily="monospace">A</text>
    <text x="118" y="150" fill="#facc15" fontSize="11" fontFamily="monospace">B</text>
    <path d="M127,70 A20,20 0 0,0 113,52" fill="rgba(250,204,21,0.25)" stroke="#facc15" strokeWidth="1.5"/>
    <text x="128" y="62" fill="#facc15" fontSize="11" fontFamily="monospace">∠A1</text>
    <path d="M158,155 A20,20 0 0,0 144,137" fill="rgba(250,204,21,0.25)" stroke="#facc15" strokeWidth="1.5"/>
    <text x="159" y="148" fill="#facc15" fontSize="11" fontFamily="monospace">∠B1</text>
    <text x="60" y="185" fill="#e2e8f0" fontSize="10" fontFamily="monospace">∠A1 = ∠B1  (sudut sehadap)</text>
  </svg>
);

const DalamBerseberanganSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <marker id="db1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
      </marker>
      <marker id="db1L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="db2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#a78bfa" />
      </marker>
      <marker id="db2L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#a78bfa" />
      </marker>
      <marker id="db3" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#fb923c" />
      </marker>
    </defs>
    <line x1="15" y1="70" x2="285" y2="70" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#db1)" markerStart="url(#db1L)" />
    <line x1="15" y1="155" x2="285" y2="155" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#db2)" markerStart="url(#db2L)" />
    <line x1="78" y1="10" x2="162" y2="190" stroke="#fb923c" strokeWidth="2" markerEnd="url(#db3)" />
    <circle cx="107" cy="70" r="3" fill="#facc15" />
    <circle cx="138" cy="155" r="3" fill="#facc15" />
    <text x="87" y="65" fill="#facc15" fontSize="11" fontFamily="monospace">A</text>
    <text x="118" y="150" fill="#facc15" fontSize="11" fontFamily="monospace">B</text>
    <path d="M107,90 A20,20 0 0,1 91,72" fill="rgba(74,222,128,0.25)" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="83" y="98" fill="#4ade80" fontSize="11" fontFamily="monospace">∠A3</text>
    <path d="M138,135 A20,20 0 0,1 154,153" fill="rgba(74,222,128,0.25)" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="154" y="135" fill="#4ade80" fontSize="11" fontFamily="monospace">∠B1</text>
    <text x="40" y="185" fill="#e2e8f0" fontSize="10" fontFamily="monospace">∠A3 = ∠B1  (dalam berseberangan)</text>
  </svg>
);

const LuarBerseberanganSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <marker id="lb1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
      </marker>
      <marker id="lb1L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="lb2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#a78bfa" />
      </marker>
      <marker id="lb2L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#a78bfa" />
      </marker>
      <marker id="lb3" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#fb923c" />
      </marker>
    </defs>
    <line x1="15" y1="70" x2="285" y2="70" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#lb1)" markerStart="url(#lb1L)" />
    <line x1="15" y1="155" x2="285" y2="155" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#lb2)" markerStart="url(#lb2L)" />
    <line x1="78" y1="10" x2="162" y2="190" stroke="#fb923c" strokeWidth="2" markerEnd="url(#lb3)" />
    <circle cx="107" cy="70" r="3" fill="#facc15" />
    <circle cx="138" cy="155" r="3" fill="#facc15" />
    <text x="87" y="65" fill="#facc15" fontSize="11" fontFamily="monospace">A</text>
    <text x="118" y="150" fill="#facc15" fontSize="11" fontFamily="monospace">B</text>
    <path d="M127,70 A20,20 0 0,0 113,52" fill="rgba(244,114,182,0.25)" stroke="#f472b6" strokeWidth="1.5"/>
    <text x="128" y="61" fill="#f472b6" fontSize="11" fontFamily="monospace">∠A1</text>
    <path d="M138,175 A20,20 0 0,1 154,157" fill="rgba(244,114,182,0.25)" stroke="#f472b6" strokeWidth="1.5"/>
    <text x="155" y="178" fill="#f472b6" fontSize="11" fontFamily="monospace">∠B3</text>
    <text x="40" y="195" fill="#e2e8f0" fontSize="10" fontFamily="monospace">∠A1 = ∠B3  (luar berseberangan)</text>
  </svg>
);

const DalamSepihakSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <marker id="ds1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
      </marker>
      <marker id="ds1L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="ds2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#a78bfa" />
      </marker>
      <marker id="ds2L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#a78bfa" />
      </marker>
      <marker id="ds3" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#fb923c" />
      </marker>
    </defs>
    <line x1="15" y1="70" x2="285" y2="70" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#ds1)" markerStart="url(#ds1L)" />
    <line x1="15" y1="155" x2="285" y2="155" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#ds2)" markerStart="url(#ds2L)" />
    <line x1="78" y1="10" x2="162" y2="190" stroke="#fb923c" strokeWidth="2" markerEnd="url(#ds3)" />
    <circle cx="107" cy="70" r="3" fill="#facc15" />
    <circle cx="138" cy="155" r="3" fill="#facc15" />
    <text x="87" y="65" fill="#facc15" fontSize="11" fontFamily="monospace">A</text>
    <text x="118" y="150" fill="#facc15" fontSize="11" fontFamily="monospace">B</text>
    <path d="M107,90 A20,20 0 0,1 91,72" fill="rgba(251,146,60,0.25)" stroke="#fb923c" strokeWidth="1.5"/>
    <text x="74" y="97" fill="#fb923c" fontSize="11" fontFamily="monospace">∠A3</text>
    <path d="M138,135 A20,20 0 0,1 122,153" fill="rgba(251,146,60,0.25)" stroke="#fb923c" strokeWidth="1.5"/>
    <text x="104" y="142" fill="#fb923c" fontSize="11" fontFamily="monospace">∠B2</text>
    <text x="30" y="190" fill="#e2e8f0" fontSize="10" fontFamily="monospace">∠A3 + ∠B2 = 180°  (dalam sepihak)</text>
  </svg>
);

/* ──────────────────────────────────────────
   SECTION DATA
────────────────────────────────────────── */
type Section = { title: string; icon: string; content: React.ReactNode };

const sections: Section[] = [
  {
    title: "Kenali Dulu: Apa Itu Dua Garis Sejajar?",
    icon: "🚀",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Bayangkan dua rel kereta yang membentang sejauh mata memandang — keduanya tidak pernah bertemu walau
          diperpanjang sampai tak terhingga. Itulah gambaran <strong className="text-cyan-300">dua garis sejajar</strong>.
        </p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p><strong className="text-cyan-300">Notasi:</strong> Garis <InlineMath math="g_1 \parallel g_2" /> artinya <InlineMath math="g_1" /> sejajar dengan <InlineMath math="g_2" />.</p>
          <p>Ketika garis ketiga (disebut <strong className="text-orange-300">garis transversal / pemotong</strong>) memotong kedua garis sejajar itu, terbentuklah <strong className="text-yellow-300">8 sudut</strong> unik yang punya hubungan menarik satu sama lain.</p>
        </div>
        <DuaGarisSVGAll />
        <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-yellow-200 text-xs">
          💡 Di titik <strong>A</strong> (potong <InlineMath math="g_1" />) terbentuk ∠A1, ∠A2, ∠A3, ∠A4.<br />
          Di titik <strong>B</strong> (potong <InlineMath math="g_2" />) terbentuk ∠B1, ∠B2, ∠B3, ∠B4.
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
          <p className="text-white/80 font-semibold mb-1">Pengelompokan Sudut:</p>
          <p><span className="text-cyan-300">• Sudut dalam:</span> di antara dua garis sejajar → ∠A3, ∠A4 (di bawah g₁) dan ∠B1, ∠B2 (di atas g₂)</p>
          <p><span className="text-pink-300">• Sudut luar:</span> di luar area dua garis sejajar → ∠A1, ∠A2 dan ∠B3, ∠B4</p>
        </div>
      </div>
    ),
  },
  {
    title: "Sifat 1 — Sudut Sehadap (Corresponding Angles)",
    icon: "🔭",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Sudut sehadap adalah pasangan sudut yang terletak di <strong className="text-yellow-300">posisi yang sama</strong> pada
          tiap titik potong — keduanya berada di sisi yang sama dari garis transversal dan sama-sama di atas (atau di bawah) garis sejajarnya.
        </p>
        <div className="bg-yellow-950/60 border border-yellow-600/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-yellow-300">📌 Sifat: Sudut sehadap sama besar</p>
          <BlockMath math="\angle A1 = \angle B1 \quad ; \quad \angle A2 = \angle B2" />
          <BlockMath math="\angle A3 = \angle B3 \quad ; \quad \angle A4 = \angle B4" />
        </div>
        <SehadapSVG />
        <blockquote className="border-l-4 border-cyan-500 bg-cyan-950/40 pl-4 py-2 text-cyan-200 text-xs rounded-r-lg">
          <strong>Tips:</strong> Cara mudah mengidentifikasi sudut sehadap — posisinya selalu "satu arah", seperti bayangan di cermin yang dipindah ke garis satunya.
        </blockquote>
      </div>
    ),
  },
  {
    title: "Sifat 2 — Sudut Dalam Berseberangan (Alternate Interior Angles)",
    icon: "⚡",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Sudut dalam berseberangan berada di <strong className="text-green-300">dalam</strong> (di antara dua garis sejajar) dan letaknya
          <strong className="text-green-300"> berseberangan</strong> dari garis transversal — satu di kiri atas, satu di kanan bawah.
        </p>
        <div className="bg-green-950/60 border border-green-700/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-green-300">📌 Sifat: Sudut dalam berseberangan sama besar</p>
          <BlockMath math="\angle A3 = \angle B1 \quad ; \quad \angle A4 = \angle B2" />
        </div>
        <DalamBerseberanganSVG />
        <blockquote className="border-l-4 border-green-500 bg-green-950/40 pl-4 py-2 text-green-200 text-xs rounded-r-lg">
          <strong>Tips:</strong> Bayangkan huruf <strong>Z</strong> atau <strong>S</strong> yang terbentuk oleh garis-garis itu. Kedua sudut yang "mentok" di ujung huruf Z/S itulah sudut dalam berseberangan!
        </blockquote>
      </div>
    ),
  },
  {
    title: "Sifat 3 — Sudut Luar Berseberangan (Alternate Exterior Angles)",
    icon: "🌟",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Mirip dengan sudut dalam berseberangan, tapi kali ini keduanya berada di <strong className="text-pink-300">luar</strong> (di sisi terluar dari kedua garis sejajar), dan posisinya tetap berseberangan terhadap garis transversal.
        </p>
        <div className="bg-pink-950/60 border border-pink-700/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-pink-300">📌 Sifat: Sudut luar berseberangan sama besar</p>
          <BlockMath math="\angle A1 = \angle B3 \quad ; \quad \angle A2 = \angle B4" />
        </div>
        <LuarBerseberanganSVG />
        <blockquote className="border-l-4 border-pink-500 bg-pink-950/40 pl-4 py-2 text-pink-200 text-xs rounded-r-lg">
          <strong>Tips:</strong> Sama seperti pola huruf Z/S, tapi kali ini "lengan" huruf Z ada di luar area antara dua garis sejajar.
        </blockquote>
      </div>
    ),
  },
  {
    title: "Sifat 4 — Sudut Dalam Sepihak (Co-Interior / Same-Side Interior)",
    icon: "🪐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Sudut dalam sepihak keduanya berada <strong className="text-orange-300">di dalam</strong> (antara dua garis sejajar), dan
          terletak <strong className="text-orange-300">di sisi yang sama</strong> dari garis transversal. Sifatnya berbeda
          dari ketiga sifat sebelumnya — bukan sama besar, tapi <strong className="text-orange-300">saling berpelurus</strong>!
        </p>
        <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-orange-300">📌 Sifat: Sudut dalam sepihak berjumlah 180°</p>
          <BlockMath math="\angle A3 + \angle B2 = 180°" />
          <BlockMath math="\angle A4 + \angle B1 = 180°" />
        </div>
        <DalamSepihakSVG />
        <blockquote className="border-l-4 border-orange-500 bg-orange-950/40 pl-4 py-2 text-orange-200 text-xs rounded-r-lg">
          <strong>Tips:</strong> Bayangkan huruf <strong>U</strong> atau <strong>C</strong> yang terbentuk. Kedua sudut di "dasar" huruf C itulah sudut dalam sepihak — kalau dijumlah selalu 180°!
        </blockquote>
      </div>
    ),
  },
  {
    title: "Ringkasan Semua Sifat Sudut",
    icon: "📊",
    content: (
      <div className="space-y-3 text-sm font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Jenis Sudut</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Pasangan Contoh</th>
                <th className="px-3 py-2 text-cyan-300">Hubungan</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-700 bg-yellow-950/30">
                <td className="px-3 py-2 text-yellow-300 font-semibold border-r border-slate-700">Sehadap</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\angle A1 \text{ dan } \angle B1" /></td>
                <td className="px-3 py-2 text-white/70">Sama besar</td>
              </tr>
              <tr className="border-t border-slate-700 bg-green-950/30">
                <td className="px-3 py-2 text-green-300 font-semibold border-r border-slate-700">Dalam Berseberangan</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\angle A3 \text{ dan } \angle B1" /></td>
                <td className="px-3 py-2 text-white/70">Sama besar</td>
              </tr>
              <tr className="border-t border-slate-700 bg-pink-950/30">
                <td className="px-3 py-2 text-pink-300 font-semibold border-r border-slate-700">Luar Berseberangan</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\angle A1 \text{ dan } \angle B3" /></td>
                <td className="px-3 py-2 text-white/70">Sama besar</td>
              </tr>
              <tr className="border-t border-slate-700 bg-orange-950/30">
                <td className="px-3 py-2 text-orange-300 font-semibold border-r border-slate-700">Dalam Sepihak</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\angle A3 + \angle B2" /></td>
                <td className="px-3 py-2 text-white/70">= 180°</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
];

/* ──────────────────────────────────────────
   CONTOH SOAL
────────────────────────────────────────── */
type Example = { level: string; color: string; bg: string; border: string; question: React.ReactNode; answer: React.ReactNode };

const ContohSoalSVG = ({ labelA, labelB, type }: { labelA: string; labelB: string; type: "sehadap" | "berseberangan" | "sepihak" }) => {
  const colorA = type === "sepihak" ? "#fb923c" : "#facc15";
  const colorB = type === "sepihak" ? "#fb923c" : "#facc15";
  return (
    <svg viewBox="0 0 280 175" className="w-full max-w-xs mx-auto my-2">
      <defs>
        <marker id={"cAr1" + type} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#22d3ee" />
        </marker>
        <marker id={"cAr1L" + type} markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <path d="M6,0 L6,6 L0,3 z" fill="#22d3ee" />
        </marker>
        <marker id={"cAr2" + type} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#a78bfa" />
        </marker>
        <marker id={"cAr2L" + type} markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <path d="M6,0 L6,6 L0,3 z" fill="#a78bfa" />
        </marker>
        <marker id={"cAr3" + type} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#fb923c" />
        </marker>
      </defs>
      <line x1="10" y1="60" x2="265" y2="60" stroke="#22d3ee" strokeWidth="2"
        markerEnd={"url(#cAr1" + type + ")"} markerStart={"url(#cAr1L" + type + ")"} />
      <text x="268" y="64" fill="#22d3ee" fontSize="11" fontFamily="monospace">g₁</text>
      <line x1="10" y1="135" x2="265" y2="135" stroke="#a78bfa" strokeWidth="2"
        markerEnd={"url(#cAr2" + type + ")"} markerStart={"url(#cAr2L" + type + ")"} />
      <text x="268" y="139" fill="#a78bfa" fontSize="11" fontFamily="monospace">g₂</text>
      <line x1="65" y1="8" x2="148" y2="168" stroke="#fb923c" strokeWidth="2"
        markerEnd={"url(#cAr3" + type + ")"} />
      <circle cx="93" cy="60" r="3" fill="#facc15" />
      <circle cx="122" cy="135" r="3" fill="#facc15" />
      <text x="70" y="56" fill="#facc15" fontSize="10" fontFamily="monospace">A</text>
      <text x="103" y="131" fill="#facc15" fontSize="10" fontFamily="monospace">B</text>
      <text x="100" y="53" fill={colorA} fontSize="11" fontFamily="monospace" fontWeight="bold">{labelA}</text>
      {type === "berseberangan" && <text x="74" y="148" fill={colorB} fontSize="11" fontFamily="monospace" fontWeight="bold">{labelB}</text>}
      {type !== "berseberangan" && <text x="128" y="148" fill={colorB} fontSize="11" fontFamily="monospace" fontWeight="bold">{labelB}</text>}
    </svg>
  );
};

const examples: Example[] = [
  {
    level: "MUDAH",
    color: "text-green-400",
    bg: "bg-green-950/40",
    border: "border-green-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>
          Diketahui <InlineMath math="g_1 \parallel g_2" /> dipotong garis <InlineMath math="h" />.
          Jika <InlineMath math="\angle A1 = 65°" />, tentukan besar:
        </p>
        <p>a) <InlineMath math="\angle B1" /> (sudut sehadap)</p>
        <p>b) <InlineMath math="\angle A2" /> (sudut bertolak belakang dengan ∠A1 di titik A)</p>
        <ContohSoalSVG labelA="65°" labelB="∠B1=?" type="sehadap" />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">a) Sudut sehadap → sama besar:</p>
          <BlockMath math="\angle B1 = \angle A1 = 65°" />
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">b) ∠A2 adalah sudut lurus dengan ∠A1 (membentuk garis lurus):</p>
          <BlockMath math="\angle A2 = 180° - \angle A1 = 180° - 65° = 115°" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">Jawaban: <InlineMath math="\angle B1 = 65°" /> dan <InlineMath math="\angle A2 = 115°" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG",
    color: "text-yellow-400",
    bg: "bg-yellow-950/40",
    border: "border-yellow-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>
          Garis <InlineMath math="g_1 \parallel g_2" /> dipotong oleh garis <InlineMath math="h" />.
          Diketahui <InlineMath math="\angle A3 = (4x - 10)°" /> dan <InlineMath math="\angle B1 = (2x + 30)°" />.
        </p>
        <p>Karena <InlineMath math="\angle A3" /> dan <InlineMath math="\angle B1" /> adalah sudut dalam berseberangan, tentukan nilai <InlineMath math="x" /> dan besar kedua sudut tersebut!</p>
        <ContohSoalSVG labelA="∠A3=(4x-10)°" labelB="∠B1=(2x+30)°" type="berseberangan" />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">Sudut dalam berseberangan → sama besar:</p>
          <BlockMath math="4x - 10 = 2x + 30" />
          <BlockMath math="4x - 2x = 30 + 10" />
          <BlockMath math="2x = 40 \implies x = 20" />
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">Besar sudut-sudutnya:</p>
          <BlockMath math="\angle A3 = 4(20) - 10 = 80 - 10 = 70°" />
          <BlockMath math="\angle B1 = 2(20) + 30 = 40 + 30 = 70° \checkmark" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">Jawaban: <InlineMath math="x = 20" />, <InlineMath math="\angle A3 = \angle B1 = 70°" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT",
    color: "text-red-400",
    bg: "bg-red-950/40",
    border: "border-red-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>
          Garis <InlineMath math="g_1 \parallel g_2" /> dipotong garis <InlineMath math="h" />.
          Diketahui <InlineMath math="\angle A3 = (5x + 15)°" /> dan <InlineMath math="\angle B2 = (3x + 25)°" />.
        </p>
        <p><strong className="text-red-300">∠A3 dan ∠B2 adalah sudut dalam sepihak.</strong> Tentukan nilai <InlineMath math="x" /> dan besar setiap sudut yang terbentuk di titik A dan titik B!</p>
        <ContohSoalSVG labelA="∠A3=(5x+15)°" labelB="∠B2=(3x+25)°" type="sepihak" />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">Sudut dalam sepihak → jumlahnya 180°:</p>
          <BlockMath math="(5x + 15) + (3x + 25) = 180" />
          <BlockMath math="8x + 40 = 180" />
          <BlockMath math="8x = 140 \implies x = 17{,}5" />
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">Besar sudut A3 dan B2:</p>
          <BlockMath math="\angle A3 = 5(17{,}5) + 15 = 87{,}5 + 15 = 102{,}5°" />
          <BlockMath math="\angle B2 = 3(17{,}5) + 25 = 52{,}5 + 25 = 77{,}5°" />
          <p className="text-white/60 text-xs mt-1">Cek: <InlineMath math="102{,}5° + 77{,}5° = 180°" /> ✓</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">Sudut-sudut lain (bertolak belakang):</p>
          <BlockMath math="\angle A4 = \angle A2 \text{ (berpelurus dengan } \angle A3\text{)} = 180° - 102{,}5° = 77{,}5°" />
          <BlockMath math="\angle B1 = 180° - 77{,}5° = 102{,}5°" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3">
          <p className="text-red-300 font-semibold">Jawaban: <InlineMath math="x = 17{,}5" />, <InlineMath math="\angle A3 = 102{,}5°" />, <InlineMath math="\angle B2 = 77{,}5°" /></p>
        </div>
      </div>
    ),
  },
];

/* ──────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────── */
const SifatSudutDuaGarisSejajarPage = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<number[]>([0,1,2,3,4,5,6,7,8,9]);
  const [openExample, setOpenExample] = useState<number[]>([0,1,2,3,4,5,6,7,8,9]);

  const toggle = (i: number, setter: React.Dispatch<React.SetStateAction<number[]>>, cur: number[]) => {
    playPopSound();
    setter(cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i]);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-2xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-1 text-center leading-snug">
          SIFAT SUDUT DUA GARIS SEJAJAR
        </h1>
        <p className="text-cyan-300 text-xs text-center font-display mb-1">JIKA DIPOTONG GARIS LAIN</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 · Garis dan Sudut · Materi Matematika</p>

        {/* RINGKASAN INTISARI */}
        <div className="bg-slate-900/80 border border-cyan-700/50 rounded-2xl p-4 mb-6 text-sm text-white/80 font-body leading-relaxed">
          <p className="text-cyan-300 font-semibold mb-2">🌌 Ringkasan Intisari</p>
          <p>
            Ketika dua garis sejajar (<InlineMath math="g_1 \parallel g_2" />) dipotong oleh sebuah garis transversal, terbentuklah
            8 sudut dengan <strong className="text-yellow-300">4 sifat hubungan</strong> yang penting:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-white/70">
            <li><span className="text-yellow-300 font-semibold">Sudut sehadap</span> → sama besar</li>
            <li><span className="text-green-300 font-semibold">Sudut dalam berseberangan</span> → sama besar</li>
            <li><span className="text-pink-300 font-semibold">Sudut luar berseberangan</span> → sama besar</li>
            <li><span className="text-orange-300 font-semibold">Sudut dalam sepihak</span> → berjumlah 180°</li>
          </ul>
        </div>

        {/* MATERI */}
        <p className="text-white/60 text-xs font-body mb-3 uppercase tracking-widest">📚 Materi</p>
        <div className="flex flex-col gap-2 mb-8">
          {sections.map((sec, i) => (
            <div key={i} className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => toggle(i, setOpenSection, openSection)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-body text-sm font-semibold text-white flex items-center gap-2">
                  <span className="text-base">{sec.icon}</span> {sec.title}
                </span>
                {openSection.includes(i)
                  ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {openSection.includes(i) && (
                <div className="px-4 pb-4 pt-1 border-t border-border/50 animate-slide-up">
                  {sec.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CONTOH SOAL */}
        <p className="text-white/60 text-xs font-body mb-3 uppercase tracking-widest">✏️ Contoh Soal</p>
        <div className="flex flex-col gap-3">
          {examples.map((ex, i) => (
            <div key={i} className={`border rounded-xl overflow-hidden ${ex.border} ${ex.bg}`}>
              <button
                onClick={() => toggle(i, setOpenExample, openExample)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <span className={`font-display text-xs font-bold ${ex.color}`}>
                  ⭐ CONTOH {i + 1} — {ex.level}
                </span>
                {openExample.includes(i)
                  ? <ChevronUp className="w-4 h-4 shrink-0 text-white/60" />
                  : <ChevronDown className="w-4 h-4 shrink-0 text-white/60" />}
              </button>
              {openExample.includes(i) && (
                <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-3 animate-slide-up">
                  <div className="bg-slate-900/60 rounded-lg p-3">{ex.question}</div>
                  <p className={`text-xs font-semibold font-body ${ex.color}`}>💡 Pembahasan:</p>
                  <div className="bg-slate-900/60 rounded-lg p-3">{ex.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/garis-dan-sudut"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Garis dan Sudut
          </button>
        </div>
      </div>
    </div>
  );
};

export default SifatSudutDuaGarisSejajarPage;
