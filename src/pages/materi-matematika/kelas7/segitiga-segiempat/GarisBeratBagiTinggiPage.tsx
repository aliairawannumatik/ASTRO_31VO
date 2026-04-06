import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ─────────────────────────────────────────────
   SVG DIAGRAMS
───────────────────────────────────────────── */

const GarisBeratSVG = () => (
  <svg viewBox="0 0 320 210" className="w-full max-w-sm mx-auto my-3" aria-label="Tiga garis berat segitiga bertemu di titik berat G">
    {/* Triangle sides */}
    <polygon points="160,20 30,185 290,185" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />

    {/* Midpoints */}
    {/* Ma = midpoint BC = (160,185) */}
    {/* Mb = midpoint AC = (225,102.5) */}
    {/* Mc = midpoint AB = (95,102.5) */}

    {/* Median from A(160,20) to Ma(160,185) */}
    <line x1="160" y1="20" x2="160" y2="185" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6,3" />
    {/* Median from B(30,185) to Mb(225,103) */}
    <line x1="30" y1="185" x2="225" y2="103" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6,3" />
    {/* Median from C(290,185) to Mc(95,103) */}
    <line x1="290" y1="185" x2="95" y2="103" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6,3" />

    {/* Midpoint dots */}
    <circle cx="160" cy="185" r="4" fill="#facc15" />
    <circle cx="225" cy="103" r="4" fill="#facc15" />
    <circle cx="95" cy="103" r="4" fill="#facc15" />

    {/* Centroid G = (160, 130) */}
    <circle cx="160" cy="130" r="6" fill="#f87171" />
    <text x="168" y="128" fill="#f87171" fontSize="13" fontFamily="monospace" fontWeight="bold">G</text>

    {/* Vertex labels */}
    <text x="153" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="14" y="198" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="293" y="198" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>

    {/* Midpoint labels */}
    <text x="164" y="200" fill="#facc15" fontSize="10" fontFamily="monospace">Ma</text>
    <text x="228" y="100" fill="#facc15" fontSize="10" fontFamily="monospace">Mb</text>
    <text x="72" y="100" fill="#facc15" fontSize="10" fontFamily="monospace">Mc</text>

    {/* Ratio label */}
    <text x="6" y="20" fill="#22d3ee" fontSize="10" fontFamily="monospace">AG : GMa = 2 : 1</text>

    {/* 2/3 mark on median AM */}
    <text x="164" y="108" fill="#f87171" fontSize="9" fontFamily="monospace">2</text>
    <text x="164" y="160" fill="#f87171" fontSize="9" fontFamily="monospace">1</text>
  </svg>
);

const GarisBagiSVG = () => (
  <svg viewBox="0 0 320 210" className="w-full max-w-sm mx-auto my-3" aria-label="Garis bagi sudut A pada segitiga ABC">
    {/* Triangle A(160,20) B(20,185) C(300,185) */}
    <polygon points="160,20 20,185 300,185" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />

    {/* Angle bisector from A to D on BC */}
    {/* AB ≈ 198.5, AC ≈ 214  →  BD/DC = AB/AC ≈ 198.5/214 */}
    {/* BD = 280 × 198.5/412.5 ≈ 134.5 → D ≈ (20+134.5, 185) = (154, 185) */}
    <line x1="160" y1="20" x2="154" y2="185" stroke="#a78bfa" strokeWidth="2.5" />

    {/* D point on BC */}
    <circle cx="154" cy="185" r="4" fill="#a78bfa" />
    <text x="148" y="200" fill="#a78bfa" fontSize="11" fontFamily="monospace">D</text>

    {/* Angle arcs at A showing bisection */}
    <path d="M 140,44 A 28,28 0 0,0 160,20" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="3,2" />
    <path d="M 160,20 A 28,28 0 0,0 178,47" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="3,2" />
    <text x="131" y="62" fill="#fb923c" fontSize="10" fontFamily="monospace">α</text>
    <text x="170" y="62" fill="#fb923c" fontSize="10" fontFamily="monospace">α</text>

    {/* BD and DC labels */}
    <text x="60" y="200" fill="#22d3ee" fontSize="10" fontFamily="monospace">BD</text>
    <text x="220" y="200" fill="#22d3ee" fontSize="10" fontFamily="monospace">DC</text>
    <text x="90" y="175" fill="#94a3b8" fontSize="9" fontFamily="monospace">BD/DC = AB/AC</text>

    {/* Vertex labels */}
    <text x="153" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="4" y="195" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="304" y="195" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>

    {/* AB and AC labels */}
    <text x="65" y="90" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(-49,80,90)">AB</text>
    <text x="250" y="80" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(42,240,100)">AC</text>
  </svg>
);

const GarisTimggiAkutSVG = () => (
  <svg viewBox="0 0 320 210" className="w-full max-w-sm mx-auto my-3" aria-label="Garis tinggi segitiga lancip — ortosentrum di dalam">
    {/* Triangle A(160,20) B(30,185) C(290,185) */}
    <polygon points="160,20 30,185 290,185" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />

    {/* Altitude from A(160,20) to Ha(160,185) — vertical */}
    <line x1="160" y1="20" x2="160" y2="185" stroke="#fb923c" strokeWidth="2" />
    <rect x="148" y="173" width="12" height="12" fill="none" stroke="#fb923c" strokeWidth="1.5" />

    {/* Altitude from B(30,185) to Hb on AC ≈ (179,41) */}
    <line x1="30" y1="185" x2="179" y2="41" stroke="#fb923c" strokeWidth="2" />
    <rect x="175" y="37" width="10" height="10" fill="none" stroke="#fb923c" strokeWidth="1.5"
      transform="rotate(49,180,42)" />

    {/* Altitude from C(290,185) to Hc on AB ≈ (142,41) */}
    <line x1="290" y1="185" x2="142" y2="41" stroke="#fb923c" strokeWidth="2" />
    <rect x="138" y="37" width="10" height="10" fill="none" stroke="#fb923c" strokeWidth="1.5"
      transform="rotate(-49,142,42)" />

    {/* Orthocenter H = (160,57) */}
    <circle cx="160" cy="57" r="5" fill="#f87171" />
    <text x="166" y="55" fill="#f87171" fontSize="12" fontFamily="monospace" fontWeight="bold">H</text>

    {/* Vertex labels */}
    <text x="153" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="14" y="198" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="293" y="198" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>

    <text x="4" y="20" fill="#fb923c" fontSize="10" fontFamily="monospace">H di dalam (segitiga lancip)</text>
  </svg>
);

const GarisTimggiSikuSVG = () => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-3" aria-label="Garis tinggi segitiga siku-siku — ortosentrum di titik sudut siku-siku">
    {/* Right triangle A(30,30) B(30,170) C(230,170) */}
    <polygon points="30,30 30,170 230,170" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    <rect x="30" y="158" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="2" />

    {/* Altitude from B = AB itself (vertical side) */}
    <line x1="30" y1="30" x2="30" y2="170" stroke="#fb923c" strokeWidth="2.5" />
    {/* Altitude from C = BC itself (horizontal side) */}
    <line x1="30" y1="170" x2="230" y2="170" stroke="#fb923c" strokeWidth="2.5" />
    {/* Altitude from A(30,30) to BC — foot at (30,170) since AB⊥BC */}
    <line x1="30" y1="30" x2="30" y2="170" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3" />

    {/* H = B itself */}
    <circle cx="30" cy="170" r="5" fill="#f87171" />
    <text x="10" y="168" fill="#f87171" fontSize="11" fontFamily="monospace" fontWeight="bold">H(B)</text>

    <text x="34" y="25" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="234" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>

    <text x="38" y="16" fill="#fb923c" fontSize="9" fontFamily="monospace">H = titik sudut siku-siku</text>
  </svg>
);

const GarisTimggiTumpulSVG = () => (
  <svg viewBox="0 0 340 200" className="w-full max-w-sm mx-auto my-3" aria-label="Garis tinggi segitiga tumpul — ortosentrum di luar segitiga">
    {/* Obtuse triangle A(230,30) B(20,170) C(200,170) */}
    <polygon points="230,30 20,170 200,170" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />

    {/* Extended base BC to the right for altitude from A */}
    <line x1="200" y1="170" x2="310" y2="170" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" opacity="0.4" />
    {/* Extended AB for altitude from C */}
    <line x1="20" y1="170" x2="230" y2="30" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />

    {/* Altitude from A(230,30) to extended BC — foot at (230,170) */}
    <line x1="230" y1="30" x2="230" y2="170" stroke="#fb923c" strokeWidth="2" />
    <rect x="218" y="158" width="12" height="12" fill="none" stroke="#fb923c" strokeWidth="1.5" />

    {/* Altitude from B(20,170) to AC */}
    {/* AC direction: (200-230, 170-30) = (-30, 140), perp: (140, 30) */}
    {/* Line through B: (20+140t, 170+30t); on line AC: ... ≈ foot at (185, 108) */}
    <line x1="20" y1="170" x2="185" y2="108" stroke="#fb923c" strokeWidth="2" />

    {/* Orthocenter H outside triangle — approx (230, 230) extended below */}
    {/* For this diagram, show H outside below-right */}
    <circle cx="230" cy="252" r="5" fill="#f87171" />
    <text x="236" y="255" fill="#f87171" fontSize="12" fontFamily="monospace" fontWeight="bold">H</text>

    <text x="224" y="26" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="4" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="202" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>

    <text x="4" y="14" fill="#fb923c" fontSize="9" fontFamily="monospace">H di luar (segitiga tumpul)</text>
  </svg>
);

const ContohSVGMudah = () => (
  <svg viewBox="0 0 280 180" className="w-full max-w-xs mx-auto my-2" aria-label="Contoh soal garis berat AG dan GM">
    <polygon points="140,15 20,165 260,165" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    {/* Median from A to midpoint M of BC */}
    <line x1="140" y1="15" x2="140" y2="165" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="7,3" />
    <circle cx="140" cy="165" r="4" fill="#facc15" />
    {/* Centroid G at 2/3 from A */}
    {/* G = A + 2/3*(M - A) = (140,15) + 2/3*(0,150) = (140, 115) */}
    <circle cx="140" cy="115" r="5" fill="#f87171" />
    {/* Labels */}
    <text x="133" y="10" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="4" y="178" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="264" y="178" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="148" y="170" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">M</text>
    <text x="148" y="113" fill="#f87171" fontSize="12" fontFamily="monospace" fontWeight="bold">G</text>
    {/* Dimension lines */}
    <text x="103" y="72" fill="#22d3ee" fontSize="11" fontFamily="monospace">AG=10</text>
    <text x="103" y="148" fill="#4ade80" fontSize="11" fontFamily="monospace">GM=?</text>
  </svg>
);

const ContohSVGSedang = () => (
  <svg viewBox="0 0 300 190" className="w-full max-w-xs mx-auto my-2" aria-label="Contoh soal garis bagi angle bisector theorem">
    <polygon points="140,15 20,175 280,175" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    {/* Angle bisector from P(140,15) to D on QR */}
    {/* PQ = sqrt(120²+160²)=200, PR=sqrt(140²+160²)=213 */}
    {/* QD/DR = PQ/PR = 200/213, QD = 260×200/413 ≈ 126, D ≈ (20+126,175)=(146,175) */}
    <line x1="140" y1="15" x2="146" y2="175" stroke="#a78bfa" strokeWidth="2.5" />
    <circle cx="146" cy="175" r="4" fill="#a78bfa" />
    {/* Labels */}
    <text x="133" y="11" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">P</text>
    <text x="4" y="188" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">Q</text>
    <text x="284" y="188" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">R</text>
    <text x="140" y="192" fill="#a78bfa" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    {/* Side lengths */}
    <text x="44" y="80" fill="#22d3ee" fontSize="10" fontFamily="monospace" transform="rotate(-52,60,90)">PQ = 9</text>
    <text x="228" y="70" fill="#22d3ee" fontSize="10" fontFamily="monospace" transform="rotate(47,225,95)">PR = 12</text>
    {/* QD and DR */}
    <text x="50" y="192" fill="#facc15" fontSize="10" fontFamily="monospace">QD = ?</text>
    <text x="185" y="192" fill="#4ade80" fontSize="10" fontFamily="monospace">DR = ?</text>
    <text x="70" y="160" fill="#94a3b8" fontSize="9" fontFamily="monospace">QR = 14</text>
  </svg>
);

const ContohSVGSulit = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Contoh soal garis tinggi segitiga siku-siku mencari CH">
    {/* Right triangle C(20,170) A(20,30) B(210,170) */}
    <polygon points="20,30 20,170 210,170" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    <rect x="20" y="158" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="2" />
    {/* Altitude from C to AB */}
    {/* AB from A(20,30) to B(210,170): dir=(190,140), len=sqrt(36100+19600)=sqrt(55700)≈236  */}
    {/* foot of perp from C(20,170) to AB: */}
    {/* Using area method: CH = 2×Area/AB */}
    {/* Area = (1/2)×AC×BC = (1/2)×140×190 = 13300 ... no */}
    {/* Let me use actual values: AC=6, BC=8, AB=10, Area=24 */}
    {/* Scale: AC=6→120px, BC=8→160px, AB=10→200px */}
    {/* Triangle: C(20,170) A(20,50) B(180,170) */}
    {/* Altitude from C(20,170) to AB: foot H */}
    {/* CH = 2×Area/AB = 2×48/10 = 9.6 → scaled: 9.6/10×200 = 192? No, let me just draw approximate */}
    <line x1="20" y1="30" x2="20" y2="170" stroke="#e2e8f0" strokeWidth="2.5" opacity="0.7" />
    <line x1="20" y1="170" x2="210" y2="170" stroke="#e2e8f0" strokeWidth="2.5" opacity="0.7" />
    {/* Hypotenuse AB and altitude from C to AB */}
    {/* C(20,170) to foot on AB. AB: (20,30)→(210,170), dir(190,140). */}
    {/* foot = A + [(C-A)·AB_unit] × AB_unit */}
    {/* (C-A) = (0,140). AB_unit direction = (190,140)/||(190,140)|| */}
    {/* dot = 0×190+140×140 = 19600, |AB|²= 36100+19600=55700 */}
    {/* t = 19600/55700 ≈ 0.3518. foot = (20+190×0.3518, 30+140×0.3518) = (86.8, 79.25) ≈ (87,79) */}
    <line x1="20" y1="170" x2="87" y2="79" stroke="#fb923c" strokeWidth="2.5" />
    <circle cx="87" cy="79" r="4" fill="#fb923c" />
    {/* Right angle mark at foot */}
    <rect x="84" y="76" width="9" height="9" fill="none" stroke="#fb923c" strokeWidth="1.5"
      transform="rotate(36,87,80)" />
    {/* Labels */}
    <text x="6" y="26" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="214" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="4" y="175" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="91" y="77" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold">H</text>
    {/* Side labels */}
    <text x="24" y="105" fill="#22d3ee" fontSize="10" fontFamily="monospace">AC=6</text>
    <text x="90" y="185" fill="#22d3ee" fontSize="10" fontFamily="monospace">BC=8</text>
    <text x="80" y="105" fill="#facc15" fontSize="10" fontFamily="monospace" transform="rotate(36,105,120)">AB=10</text>
    <text x="28" y="138" fill="#f87171" fontSize="10" fontFamily="monospace">CH=?</text>
  </svg>
);

/* ─────────────────────────────────────────────
   SECTION DATA
───────────────────────────────────────────── */
type Section = { title: string; icon: string; content: React.ReactNode };

const sections: Section[] = [
  {
    title: "Garis Berat (Median)",
    icon: "📐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Bayangkan kamu ingin mencari titik keseimbangan sebuah segitiga dari karton — titik di mana segitiga tidak akan jatuh ke sisi manapun jika diletakkan di ujung pensil. Untuk menemukan titik itu, kamu perlu tahu tentang <strong className="text-cyan-300">garis berat</strong>.
        </p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p>
            <strong className="text-cyan-300">Definisi:</strong> Garis berat (atau <em>median</em>) adalah ruas garis yang menghubungkan sebuah titik sudut segitiga dengan <strong>titik tengah sisi yang berhadapan</strong> dengannya.
          </p>
          <p>
            <strong className="text-cyan-300">Jumlah:</strong> Setiap segitiga memiliki tepat <strong>3 garis berat</strong> (satu dari setiap sudut).
          </p>
          <p>
            <strong className="text-cyan-300">Titik Temu:</strong> Ketiga garis berat selalu berpotongan di satu titik yang disebut <strong>titik berat</strong> (centroid), dilambangkan <InlineMath math="G" />.
          </p>
        </div>
        <GarisBeratSVG />
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2">
          <p className="text-cyan-300 font-semibold">⚖️ Sifat Utama Titik Berat:</p>
          <p>Titik berat <InlineMath math="G" /> membagi setiap garis berat dengan perbandingan <strong className="text-yellow-300">2 : 1</strong> dihitung dari titik sudut ke titik tengah sisi.</p>
          <div className="bg-cyan-950/50 rounded p-3 text-center">
            <BlockMath math="\frac{AG}{GMa} = \frac{2}{1} \quad \Rightarrow \quad AG = \frac{2}{3} \times AMa" />
          </div>
          <p className="text-white/70 text-xs">Di mana <InlineMath math="Ma" /> adalah titik tengah sisi <InlineMath math="BC" />, dan <InlineMath math="AMa" /> adalah panjang total garis berat dari <InlineMath math="A" /> ke <InlineMath math="Ma" />.</p>
        </div>
        <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-yellow-200 text-xs">
          💡 <strong>Fakta Seru:</strong> Titik berat adalah pusat gravitasi segitiga. Jika kamu gantung segitiga karton dari titik ini, segitiga akan seimbang sempurna secara horizontal!
        </div>
      </div>
    ),
  },
  {
    title: "Garis Bagi (Angle Bisector)",
    icon: "✂️",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Pernahkah kamu memotong sebuah sudut menjadi dua bagian yang sama besar — seperti melipat kertas segitiga sehingga kedua sisi sudutnya berimpit sempurna? Lipatan itu adalah <strong className="text-violet-300">garis bagi</strong>.
        </p>
        <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-2">
          <p>
            <strong className="text-violet-300">Definisi:</strong> Garis bagi adalah ruas garis dari sebuah titik sudut yang <strong>membagi sudut tersebut menjadi dua bagian yang sama besar</strong>.
          </p>
          <p>
            <strong className="text-violet-300">Jumlah:</strong> Setiap segitiga memiliki tepat <strong>3 garis bagi</strong>.
          </p>
          <p>
            <strong className="text-violet-300">Titik Temu:</strong> Ketiga garis bagi berpotongan di satu titik yang disebut <strong>titik bagi</strong> atau <em>incenter</em>, dilambangkan <InlineMath math="I" />.
          </p>
        </div>
        <GarisBagiSVG />
        <div className="bg-violet-950/50 border border-violet-600/40 rounded-lg p-4 space-y-3">
          <p className="text-violet-300 font-semibold">📏 Teorema Garis Bagi (Angle Bisector Theorem):</p>
          <p className="text-white/80">
            Jika garis bagi dari sudut <InlineMath math="A" /> memotong sisi <InlineMath math="BC" /> di titik <InlineMath math="D" />, maka berlaku:
          </p>
          <div className="bg-violet-950/70 rounded p-3 text-center">
            <BlockMath math="\frac{BD}{DC} = \frac{AB}{AC}" />
          </div>
          <p className="text-white/70 text-xs">
            Artinya, titik <InlineMath math="D" /> membagi sisi <InlineMath math="BC" /> secara proporsional sesuai panjang kedua sisi yang mengapit sudut <InlineMath math="A" />.
          </p>
        </div>
        <div className="bg-violet-950/40 border border-violet-600/30 rounded-lg p-3 text-xs text-violet-200">
          🎯 <strong>Sifat Spesial Titik Bagi:</strong> Titik bagi (<InlineMath math="I" />) berjarak <em>sama</em> terhadap ketiga sisi segitiga. Jarak ini adalah jari-jari <strong>lingkaran dalam</strong> segitiga (incircle).
        </div>
      </div>
    ),
  },
  {
    title: "Garis Tinggi (Altitude)",
    icon: "📏",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Ketika kamu mengukur tinggi sebuah segitiga — seperti mengukur seberapa tinggi sebuah gunung berbentuk segitiga dari alasnya — kamu sebenarnya sedang berurusan dengan <strong className="text-orange-300">garis tinggi</strong>.
        </p>
        <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-2">
          <p>
            <strong className="text-orange-300">Definisi:</strong> Garis tinggi adalah ruas garis dari sebuah titik sudut yang <strong>tegak lurus (90°) terhadap sisi yang berhadapan</strong> (atau perpanjangannya).
          </p>
          <p>
            <strong className="text-orange-300">Jumlah:</strong> Setiap segitiga memiliki tepat <strong>3 garis tinggi</strong>.
          </p>
          <p>
            <strong className="text-orange-300">Titik Temu:</strong> Ketiga garis tinggi berpotongan di satu titik yang disebut <strong>titik tinggi</strong> atau <em>orthocenter</em>, dilambangkan <InlineMath math="H" />.
          </p>
        </div>

        <p className="text-orange-300 font-semibold text-xs mt-2">Posisi ortosentrum tergantung jenis segitiga:</p>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-slate-800/50 border border-slate-600/40 rounded-lg p-3">
            <p className="text-green-400 font-semibold text-xs mb-1">🔺 Segitiga Lancip → H di DALAM</p>
            <GarisTimggiAkutSVG />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800/50 border border-slate-600/40 rounded-lg p-3">
              <p className="text-yellow-400 font-semibold text-xs mb-1">📐 Siku-siku → H = Titik Sudut</p>
              <GarisTimggiSikuSVG />
            </div>
            <div className="bg-slate-800/50 border border-slate-600/40 rounded-lg p-3">
              <p className="text-red-400 font-semibold text-xs mb-1">📐 Tumpul → H di LUAR</p>
              <GarisTimggiTumpulSVG />
            </div>
          </div>
        </div>
        <div className="bg-orange-950/50 border border-orange-600/40 rounded-lg p-3 space-y-1">
          <p className="text-orange-300 font-semibold text-xs">📐 Rumus Panjang Garis Tinggi (via Luas):</p>
          <div className="bg-orange-950/70 rounded p-2 text-center">
            <BlockMath math="t_a = \frac{2 \times \text{Luas}}{a}" />
          </div>
          <p className="text-white/60 text-xs">Di mana <InlineMath math="t_a" /> = garis tinggi ke sisi <InlineMath math="a" />, dan <InlineMath math="a" /> = panjang sisi alas yang dituju.</p>
        </div>
      </div>
    ),
  },
  {
    title: "Tabel Perbandingan Ketiga Garis",
    icon: "📊",
    content: (
      <div className="space-y-3 text-sm font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-2 py-2 text-cyan-300 border-r border-slate-700">Jenis</th>
                <th className="px-2 py-2 text-cyan-300 border-r border-slate-700">Definisi</th>
                <th className="px-2 py-2 text-cyan-300 border-r border-slate-700">Titik Temu</th>
                <th className="px-2 py-2 text-cyan-300">Sifat Khusus</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-700 bg-cyan-950/30">
                <td className="px-2 py-2 text-cyan-300 font-bold border-r border-slate-700">Garis Berat</td>
                <td className="px-2 py-2 text-white/70 border-r border-slate-700">Sudut → titik tengah sisi lawan</td>
                <td className="px-2 py-2 text-yellow-300 border-r border-slate-700">Titik Berat (G)</td>
                <td className="px-2 py-2 text-white/70">Rasio 2:1 dari sudut</td>
              </tr>
              <tr className="border-t border-slate-700 bg-violet-950/30">
                <td className="px-2 py-2 text-violet-300 font-bold border-r border-slate-700">Garis Bagi</td>
                <td className="px-2 py-2 text-white/70 border-r border-slate-700">Membelah sudut menjadi 2 sama besar</td>
                <td className="px-2 py-2 text-yellow-300 border-r border-slate-700">Titik Bagi (I)</td>
                <td className="px-2 py-2 text-white/70">Pusat lingkaran dalam</td>
              </tr>
              <tr className="border-t border-slate-700 bg-orange-950/30">
                <td className="px-2 py-2 text-orange-300 font-bold border-r border-slate-700">Garis Tinggi</td>
                <td className="px-2 py-2 text-white/70 border-r border-slate-700">Tegak lurus sisi yang berhadapan</td>
                <td className="px-2 py-2 text-yellow-300 border-r border-slate-700">Ortosentrum (H)</td>
                <td className="px-2 py-2 text-white/70">Bisa di luar segitiga</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🔑 <strong className="text-white">Cara mengingat:</strong></p>
          <p>• <strong className="text-cyan-300">Garis Berat</strong> → ke <em>tengah</em> sisi lawan (Berat = keseimbangan)</p>
          <p>• <strong className="text-violet-300">Garis Bagi</strong> → <em>bagi</em> sudut jadi dua bagian sama</p>
          <p>• <strong className="text-orange-300">Garis Tinggi</strong> → <em>tegak lurus</em> (Tinggi = vertikal = lurus ke bawah)</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────
   EXAMPLE DATA
───────────────────────────────────────────── */
type Example = {
  level: string;
  color: string;
  bg: string;
  border: string;
  badgeBg: string;
  question: React.ReactNode;
  answer: React.ReactNode;
};

const examples: Example[] = [
  {
    level: "MUDAH",
    color: "text-green-400",
    bg: "bg-green-950/30",
    border: "border-green-700/50",
    badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>
          Pada segitiga <InlineMath math="ABC" />, titik <InlineMath math="M" /> adalah titik tengah sisi <InlineMath math="BC" />.
          Ruas garis <InlineMath math="AM" /> adalah garis berat segitiga tersebut, dan titik <InlineMath math="G" /> adalah titik berat yang terletak pada <InlineMath math="AM" />.
        </p>
        <ContohSVGMudah />
        <p>Jika diketahui <InlineMath math="AG = 10 \text{ cm}" />, tentukan panjang <InlineMath math="GM" />!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-green-400">Langkah 1 — Gunakan sifat titik berat:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-2">Titik berat membagi garis berat dengan rasio <strong>2 : 1</strong> dari sudut ke titik tengah sisi.</p>
          <BlockMath math="AG : GM = 2 : 1" />
        </div>
        <p className="text-white/80"><strong className="text-green-400">Langkah 2 — Hitung GM:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="GM = \frac{1}{2} \times AG = \frac{1}{2} \times 10 = 5 \text{ cm}" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">Jawaban: <InlineMath math="GM = 5 \text{ cm}" /></p>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          💡 Jika panjang total <InlineMath math="AM = AG + GM = 10 + 5 = 15 \text{ cm}" />.
          Artinya <InlineMath math="G" /> membagi <InlineMath math="AM" /> sehingga bagian dari <InlineMath math="A" /> dua kali lebih panjang.
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG",
    color: "text-yellow-400",
    bg: "bg-yellow-950/30",
    border: "border-yellow-700/50",
    badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>
          Pada segitiga <InlineMath math="PQR" />, garis bagi dari sudut <InlineMath math="P" /> memotong sisi <InlineMath math="QR" /> di titik <InlineMath math="D" />.
          Diketahui:
        </p>
        <ContohSVGSedang />
        <ul className="list-disc list-inside text-white/80 space-y-1 ml-2">
          <li><InlineMath math="PQ = 9 \text{ cm}" /></li>
          <li><InlineMath math="PR = 12 \text{ cm}" /></li>
          <li><InlineMath math="QR = 14 \text{ cm}" /></li>
        </ul>
        <p>Tentukan panjang <InlineMath math="QD" /> dan <InlineMath math="DR" />!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 1 — Tulis teorema garis bagi:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-2">Berdasarkan Teorema Garis Bagi:</p>
          <BlockMath math="\frac{QD}{DR} = \frac{PQ}{PR} = \frac{9}{12} = \frac{3}{4}" />
        </div>
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 2 — Nyatakan QD dan DR dalam perbandingan:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-2">Misalkan <InlineMath math="QD = 3k" /> dan <InlineMath math="DR = 4k" />, maka:</p>
          <BlockMath math="QD + DR = QR \Rightarrow 3k + 4k = 14" />
          <BlockMath math="7k = 14 \Rightarrow k = 2" />
        </div>
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 3 — Hitung QD dan DR:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="QD = 3k = 3 \times 2 = 6 \text{ cm}" />
          <BlockMath math="DR = 4k = 4 \times 2 = 8 \text{ cm}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">Jawaban: <InlineMath math="QD = 6 \text{ cm}" /> dan <InlineMath math="DR = 8 \text{ cm}" /></p>
        </div>
        <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
          ✅ Cek: <InlineMath math="QD + DR = 6 + 8 = 14 \text{ cm} = QR" /> ✓ dan <InlineMath math="\frac{QD}{DR} = \frac{6}{8} = \frac{3}{4} = \frac{PQ}{PR}" /> ✓
        </div>
      </div>
    ),
  },
  {
    level: "SULIT",
    color: "text-red-400",
    bg: "bg-red-950/30",
    border: "border-red-700/50",
    badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>
          Segitiga <InlineMath math="ABC" /> siku-siku di <InlineMath math="C" />.
          Diketahui <InlineMath math="AC = 6 \text{ cm}" /> dan <InlineMath math="BC = 8 \text{ cm}" />.
          Dari titik <InlineMath math="C" />, ditarik garis tinggi <InlineMath math="CH" /> yang tegak lurus ke sisi miring <InlineMath math="AB" />.
        </p>
        <ContohSVGSulit />
        <p>Tentukan:</p>
        <ul className="list-disc list-inside text-white/80 space-y-1 ml-2">
          <li>Panjang sisi miring <InlineMath math="AB" /></li>
          <li>Panjang garis tinggi <InlineMath math="CH" /></li>
          <li>Panjang <InlineMath math="AH" /> dan <InlineMath math="BH" /></li>
        </ul>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-red-400">Langkah 1 — Cari panjang AB (Teorema Pythagoras):</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="AB = \sqrt{AC^2 + BC^2} = \sqrt{6^2 + 8^2} = \sqrt{36 + 64} = \sqrt{100} = 10 \text{ cm}" />
        </div>

        <p className="text-white/80"><strong className="text-red-400">Langkah 2 — Hitung Luas Segitiga ABC:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-2">Siku-siku di C, jadi AC dan BC adalah kedua kakinya (alas dan tinggi):</p>
          <BlockMath math="\text{Luas} = \frac{1}{2} \times AC \times BC = \frac{1}{2} \times 6 \times 8 = 24 \text{ cm}^2" />
        </div>

        <p className="text-white/80"><strong className="text-red-400">Langkah 3 — Cari CH menggunakan rumus Luas:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-2">Luas juga bisa dihitung dengan alas <InlineMath math="AB" /> dan tinggi <InlineMath math="CH" />:</p>
          <BlockMath math="\text{Luas} = \frac{1}{2} \times AB \times CH" />
          <BlockMath math="24 = \frac{1}{2} \times 10 \times CH \Rightarrow CH = \frac{48}{10} = 4{,}8 \text{ cm}" />
        </div>

        <p className="text-white/80"><strong className="text-red-400">Langkah 4 — Cari AH dan BH:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-2">Gunakan Teorema Pythagoras pada segitiga siku-siku kecil yang terbentuk:</p>
          <BlockMath math="AH = \frac{AC^2}{AB} = \frac{36}{10} = 3{,}6 \text{ cm}" />
          <BlockMath math="BH = \frac{BC^2}{AB} = \frac{64}{10} = 6{,}4 \text{ cm}" />
        </div>

        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
          <p className="text-red-300 font-semibold">Jawaban:</p>
          <p className="text-white/80">• <InlineMath math="AB = 10 \text{ cm}" /></p>
          <p className="text-white/80">• <InlineMath math="CH = 4{,}8 \text{ cm}" /></p>
          <p className="text-white/80">• <InlineMath math="AH = 3{,}6 \text{ cm}" />, <InlineMath math="BH = 6{,}4 \text{ cm}" /></p>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          ✅ Cek: <InlineMath math="AH + BH = 3{,}6 + 6{,}4 = 10 = AB" /> ✓<br />
          🔑 <strong>Rumus umum:</strong> <InlineMath math="AH = \frac{AC^2}{AB}" />, <InlineMath math="BH = \frac{BC^2}{AB}" />, <InlineMath math="CH = \frac{AC \times BC}{AB}" />
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────
   ACCORDION COMPONENTS
───────────────────────────────────────────── */
const AccordionSection = ({ section, idx }: { section: Section; idx: number }) => {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => { playPopSound(); setOpen((v) => !v); }}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-3">
          <span className="text-xl">{section.icon}</span>
          <span className="font-display text-sm font-semibold text-white">{section.title}</span>
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-primary shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border/50">
          <div className="pt-4">{section.content}</div>
        </div>
      )}
    </div>
  );
};

const ExampleCard = ({ ex, idx }: { ex: Example; idx: number }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            CONTOH {idx + 1} — {ex.level}
          </span>
        </div>
        {ex.question}
      </div>
      <button
        onClick={() => { playPopSound(); setShowAnswer((v) => !v); }}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-800/60 hover:bg-slate-800/90 transition-colors cursor-pointer border-t border-slate-700/50"
      >
        <span className={`text-xs font-semibold font-body ${ex.color}`}>
          {showAnswer ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
        </span>
        {showAnswer ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {showAnswer && (
        <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">
          {ex.answer}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────── */
const GarisBeratBagiTinggiPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        {/* Header */}
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center leading-tight">
          GARIS BERAT, GARIS BAGI
        </h1>
        <h2 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center leading-tight">
          DAN GARIS TINGGI PADA SEGITIGA
        </h2>
        <p className="text-white/50 text-xs text-center mb-8 font-body">
          Kelas 7 · Segitiga dan Segiempat
        </p>

        {/* Intro Card */}
        <div className="bg-card/60 border border-border rounded-xl p-4 mb-6 text-sm font-body text-white/75 leading-relaxed">
          <p>
            Setiap segitiga menyimpan tiga "garis istimewa" yang sering dipakai dalam geometri:
            <strong className="text-cyan-300"> garis berat</strong> yang menuju titik tengah sisi lawan,
            <strong className="text-violet-300"> garis bagi</strong> yang membelah sudut menjadi dua bagian sama,
            dan <strong className="text-orange-300"> garis tinggi</strong> yang tegak lurus ke sisi hadapannya.
            Ketiganya punya titik temu unik masing-masing yang akan kita eksplorasi bersama!
          </p>
        </div>

        {/* Theory Sections */}
        <div className="flex flex-col gap-3 mb-8">
          {sections.map((section, i) => (
            <AccordionSection key={section.title} section={section} idx={i} />
          ))}
        </div>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="font-display text-base font-semibold text-primary text-center mb-4">
            ✏️ CONTOH SOAL &amp; PEMBAHASAN
          </h3>
          <div className="flex flex-col gap-4">
            {examples.map((ex, i) => (
              <ExampleCard key={ex.level} ex={ex} idx={i} />
            ))}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-card/60 border border-cyan-800/40 rounded-xl p-4 mb-8">
          <p className="text-cyan-300 font-semibold font-display text-sm mb-3 text-center">🚀 RUMUS KILAT</p>
          <div className="space-y-2 text-xs font-body text-white/80">
            <div className="bg-cyan-950/50 border border-cyan-800/40 rounded p-3">
              <p className="text-cyan-300 font-semibold mb-1">Titik Berat (G):</p>
              <BlockMath math="AG = \frac{2}{3} \times AM_a \qquad GM_a = \frac{1}{3} \times AM_a" />
            </div>
            <div className="bg-violet-950/50 border border-violet-800/40 rounded p-3">
              <p className="text-violet-300 font-semibold mb-1">Teorema Garis Bagi:</p>
              <BlockMath math="\frac{BD}{DC} = \frac{AB}{AC}" />
            </div>
            <div className="bg-orange-950/50 border border-orange-800/40 rounded p-3">
              <p className="text-orange-300 font-semibold mb-1">Panjang Garis Tinggi:</p>
              <BlockMath math="t_a = \frac{2 \times \text{Luas}_{\triangle}}{a}" />
              <p className="text-white/60 mt-1 text-center">Segitiga siku-siku: <InlineMath math="CH = \frac{AC \times BC}{AB}" /></p>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/segitiga-dan-segiempat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Segitiga dan Segiempat
          </button>
        </div>
      </div>
    </div>
  );
};

export default GarisBeratBagiTinggiPage;
