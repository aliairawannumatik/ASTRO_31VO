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

const PersegiPanjangLuasSVG = () => (
  <svg viewBox="0 0 320 190" className="w-full max-w-sm mx-auto my-3" aria-label="Luas persegi panjang p kali l">
    {/* Grid lines */}
    {[0,1,2].map(i => (
      <line key={`gh${i}`} x1="30" y1={50+i*40} x2="270" y2={50+i*40} stroke="#334155" strokeWidth="0.8"/>
    ))}
    {[0,1,2,3,4,5].map(i => (
      <line key={`gv${i}`} x1={30+i*48} y1="50" x2={30+i*48} y2={50+80} stroke="#334155" strokeWidth="0.8"/>
    ))}
    {/* Rectangle */}
    <rect x="30" y="50" width="240" height="80" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2"/>
    {/* Dimension arrows */}
    <line x1="30" y1="145" x2="270" y2="145" stroke="#4ade80" strokeWidth="1.5"/>
    <line x1="285" y1="50" x2="285" y2="130" stroke="#facc15" strokeWidth="1.5"/>
    {/* Labels */}
    <text x="150" y="95" fill="#a78bfa" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">p × l</text>
    <text x="150" y="158" fill="#4ade80" fontSize="12" fontFamily="monospace" textAnchor="middle">p (panjang)</text>
    <text x="298" y="93" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle" transform="rotate(90,298,93)">l (lebar)</text>
    <text x="20" y="45" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="268" y="45" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="20" y="138" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="268" y="138" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    {/* Formula box */}
    <rect x="80" y="58" width="160" height="26" rx="5" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" strokeWidth="1"/>
    <text x="160" y="75" fill="#a78bfa" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = p × l</text>
  </svg>
);

const PersegiLuasSVG = () => (
  <svg viewBox="0 0 220 210" className="w-full max-w-xs mx-auto my-3" aria-label="Luas persegi sisi s">
    {/* Grid */}
    {[0,1,2,3,4].map(i => (
      <line key={`h${i}`} x1="30" y1={30+i*36} x2={30+4*36} y2={30+i*36} stroke="#334155" strokeWidth="0.8"/>
    ))}
    {[0,1,2,3,4].map(i => (
      <line key={`v${i}`} x1={30+i*36} y1="30" x2={30+i*36} y2={30+4*36} stroke="#334155" strokeWidth="0.8"/>
    ))}
    <rect x="30" y="30" width="144" height="144" fill="rgba(74,222,128,0.12)" stroke="#4ade80" strokeWidth="2"/>
    <rect x="30" y="162" width="12" height="12" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="19" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="178" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="19" y="183" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="178" y="183" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="98" y="24" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle">s</text>
    <text x="98" y="192" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle">s</text>
    <text x="12" y="104" fill="#facc15" fontSize="12" fontFamily="monospace">s</text>
    <text x="190" y="104" fill="#facc15" fontSize="12" fontFamily="monospace">s</text>
    <text x="70" y="108" fill="#4ade80" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L = s²</text>
  </svg>
);

const JajargenjangLuasSVG = () => (
  <svg viewBox="0 0 320 200" className="w-full max-w-sm mx-auto my-3" aria-label="Luas jajargenjang alas kali tinggi">
    {/* Jajargenjang */}
    <polygon points="70,30 290,30 230,155 10,155" fill="rgba(251,146,60,0.12)" stroke="#fb923c" strokeWidth="2"/>
    {/* Altitude (tinggi) */}
    <line x1="230" y1="30" x2="230" y2="155" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="218" y="143" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    {/* Alas */}
    <line x1="10" y1="172" x2="230" y2="172" stroke="#4ade80" strokeWidth="1.5"/>
    {/* Labels */}
    <text x="58" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="292" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="0" y="168" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="230" y="168" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="116" y="185" fill="#4ade80" fontSize="12" fontFamily="monospace" textAnchor="middle">a (alas)</text>
    <text x="240" y="97" fill="#facc15" fontSize="12" fontFamily="monospace">t</text>
    <text x="100" y="105" fill="#fb923c" fontSize="12" fontFamily="monospace" fontWeight="bold">L = a × t</text>
  </svg>
);

const TrapesiumLuasSVG = () => (
  <svg viewBox="0 0 320 200" className="w-full max-w-sm mx-auto my-3" aria-label="Luas trapesium setengah jumlah sisi sejajar kali tinggi">
    {/* Trapezoid */}
    <polygon points="80,35 240,35 290,155 30,155" fill="rgba(248,113,113,0.12)" stroke="#f87171" strokeWidth="2"/>
    {/* Altitude */}
    <line x1="200" y1="35" x2="200" y2="155" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="188" y="143" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    {/* Labels */}
    <text x="67" y="30" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="243" y="30" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="17" y="168" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="292" y="168" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="160" y="28" fill="#22d3ee" fontSize="11" fontFamily="monospace" textAnchor="middle">a (sisi atas)</text>
    <text x="160" y="172" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">b (sisi bawah)</text>
    <text x="208" y="100" fill="#facc15" fontSize="12" fontFamily="monospace">t</text>
    <text x="55" y="108" fill="#f87171" fontSize="11" fontFamily="monospace" fontWeight="bold">L = ½(a+b)×t</text>
  </svg>
);

const BelahKetupatLuasSVG = () => (
  <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto my-3" aria-label="Luas belah ketupat setengah kali diagonal 1 kali diagonal 2">
    {/* Rhombus */}
    <polygon points="130,18 220,110 130,202 40,110" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="2"/>
    {/* Diagonals */}
    <line x1="40" y1="110" x2="220" y2="110" stroke="#facc15" strokeWidth="2" strokeDasharray="6,3"/>
    <line x1="130" y1="18" x2="130" y2="202" stroke="#f87171" strokeWidth="2" strokeDasharray="6,3"/>
    {/* Right angle marks */}
    <rect x="130" y="110" width="10" height="10" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
    {/* Labels */}
    <text x="125" y="12" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="224" y="114" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="125" y="215" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="22" y="114" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="130" y="104" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">d₁</text>
    <text x="148" y="138" fill="#f87171" fontSize="11" fontFamily="monospace">d₂</text>
    <text x="25" y="65" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">L = ½×d₁×d₂</text>
  </svg>
);

const LayangLayangLuasSVG = () => (
  <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto my-3" aria-label="Luas layang-layang setengah kali diagonal 1 kali diagonal 2">
    {/* Kite: A(120,15) B(195,100) C(120,220) D(45,100) */}
    <polygon points="120,15 195,100 120,220 45,100" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2"/>
    {/* Diagonals */}
    <line x1="120" y1="15" x2="120" y2="220" stroke="#facc15" strokeWidth="2" strokeDasharray="6,3"/>
    <line x1="45" y1="100" x2="195" y2="100" stroke="#f87171" strokeWidth="2" strokeDasharray="6,3"/>
    {/* Right angle mark */}
    <rect x="120" y="100" width="10" height="10" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
    {/* Labels */}
    <text x="114" y="10" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="198" y="104" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="114" y="233" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="28" y="104" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="127" y="66" fill="#facc15" fontSize="11" fontFamily="monospace">d₁</text>
    <text x="100" y="95" fill="#f87171" fontSize="11" fontFamily="monospace">d₂</text>
    <text x="18" y="50" fill="#a78bfa" fontSize="10" fontFamily="monospace" fontWeight="bold">L = ½×d₁×d₂</text>
  </svg>
);

const ContohMudahSVG = () => (
  <svg viewBox="0 0 300 170" className="w-full max-w-xs mx-auto my-2" aria-label="Persegi panjang 24 kali 15 cm">
    {/* Grid lines subtle */}
    {[0,1,2].map(i => <line key={`h${i}`} x1="20" y1={40+i*30} x2="260" y2={40+i*30} stroke="#1e293b" strokeWidth="0.8"/>)}
    {[0,1,2,3,4,5,6,7].map(i => <line key={`v${i}`} x1={20+i*34} y1="40" x2={20+i*34} y2="100" stroke="#1e293b" strokeWidth="0.8"/>)}
    <rect x="20" y="40" width="240" height="60" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="2"/>
    <text x="10" y="35" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="262" y="35" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="10" y="112" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="262" y="112" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="140" y="74" fill="#a78bfa" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L = ?</text>
    <text x="140" y="120" fill="#4ade80" fontSize="12" fontFamily="monospace" textAnchor="middle">p = 24 cm</text>
    <text x="278" y="74" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle" transform="rotate(90,278,74)">l = 15 cm</text>
  </svg>
);

const ContohSedangSVG = () => (
  <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto my-2" aria-label="Trapesium sisi atas 8 bawah 14 tinggi 9">
    <polygon points="70,35 200,35 250,165 20,165" fill="rgba(248,113,113,0.15)" stroke="#f87171" strokeWidth="2"/>
    <line x1="170" y1="35" x2="170" y2="165" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="158" y="153" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    <text x="56" y="28" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="202" y="28" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="7" y="178" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="252" y="178" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="135" y="26" fill="#22d3ee" fontSize="11" fontFamily="monospace" textAnchor="middle">a = 8 cm</text>
    <text x="135" y="182" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">b = 14 cm</text>
    <text x="178" y="104" fill="#facc15" fontSize="11" fontFamily="monospace">t = 9 cm</text>
  </svg>
);

const ContohSulitSVG = () => (
  <svg viewBox="0 0 260 230" className="w-full max-w-xs mx-auto my-2" aria-label="Belah ketupat diagonal 20 dan 24">
    <polygon points="130,18 218,115 130,212 42,115" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="2"/>
    <line x1="42" y1="115" x2="218" y2="115" stroke="#facc15" strokeWidth="2" strokeDasharray="6,3"/>
    <line x1="130" y1="18" x2="130" y2="212" stroke="#f87171" strokeWidth="2" strokeDasharray="6,3"/>
    <rect x="130" y="115" width="10" height="10" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
    <text x="124" y="12" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="220" y="120" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="124" y="225" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="24" y="120" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="172" y="109" fill="#facc15" fontSize="11" fontFamily="monospace">d₁=20cm</text>
    <text x="133" y="80" fill="#f87171" fontSize="11" fontFamily="monospace">d₂=24cm</text>
    <text x="22" y="42" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">sisi = ?</text>
    <text x="22" y="54" fill="#22d3ee" fontSize="10" fontFamily="monospace">L = ?</text>
  </svg>
);

/* ─────────────────────────────────────────────
   SECTION DATA
───────────────────────────────────────────── */
type Section = { title: string; icon: string; content: React.ReactNode };

const sections: Section[] = [
  {
    title: "Luas Persegi Panjang & Persegi",
    icon: "▭",
    content: (
      <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Bayangkan kamu memasang eternit (ubin langit-langit) berbentuk persegi 1 m × 1 m di ruangan berukuran 5 m × 3 m.
          Berapa lembar eternit yang dibutuhkan? Ternyata jawabannya langsung memberikan kita{" "}
          <strong className="text-violet-300">rumus luas persegi panjang</strong>!
        </p>

        <div className="space-y-3">
          <p className="text-violet-300 font-semibold">① Persegi Panjang</p>
          <PersegiPanjangLuasSVG />
          <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-2">
            <p className="text-violet-300 font-semibold text-xs">📐 Rumus</p>
            <div className="text-center">
              <BlockMath math="L_{\text{pp}} = p \times l" />
            </div>
            <p className="text-white/60 text-xs">
              <InlineMath math="p" /> = panjang, <InlineMath math="l" /> = lebar
            </p>
          </div>
          <blockquote className="border-l-4 border-violet-500 pl-3 text-violet-200 text-xs italic">
            📌 Luas persegi panjang = jumlah petak satuan yang memenuhi seluruh bidang. Cara menghitungnya: banyak baris × banyak kolom.
          </blockquote>
        </div>

        <div className="border-t border-slate-700/50 pt-4 space-y-3">
          <p className="text-green-300 font-semibold">② Persegi</p>
          <p>Persegi adalah persegi panjang dengan <strong>semua sisi sama panjang</strong>, sehingga <InlineMath math="p = l = s" />.</p>
          <PersegiLuasSVG />
          <div className="bg-green-950/60 border border-green-700/50 rounded-lg p-4 text-center">
            <BlockMath math="L_{\square} = s \times s = s^2" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          🔑 <strong className="text-white">Cara cepat bedakan:</strong>
          <p>• Persegi panjang → <InlineMath math="L = p \times l" /> (dua ukuran berbeda)</p>
          <p>• Persegi → <InlineMath math="L = s^2" /> (satu ukuran dikuadratkan)</p>
        </div>
      </div>
    ),
  },
  {
    title: "Luas Jajargenjang",
    icon: "⬡",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Jajargenjang bisa dianggap sebagai persegi panjang yang "digeser" — kalau kita{" "}
          <strong className="text-orange-300">potong dan pindahkan</strong> segitiga di salah satu ujungnya ke ujung lain,
          kita mendapat persegi panjang! Sehingga luasnya pun sama.
        </p>
        <JajargenjangLuasSVG />
        <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-2">
          <p className="text-orange-300 font-semibold text-xs">📐 Rumus</p>
          <div className="text-center">
            <BlockMath math="L_{\text{jj}} = a \times t" />
          </div>
          <p className="text-white/60 text-xs">
            <InlineMath math="a" /> = panjang alas, <InlineMath math="t" /> = tinggi (tegak lurus ke alas)
          </p>
        </div>
        <div className="bg-orange-950/40 border border-orange-600/30 rounded-lg p-3 text-xs text-orange-200 space-y-1">
          ⚠️ <strong>Perhatian:</strong> Tinggi jajargenjang adalah jarak <em>tegak lurus</em> antara dua sisi sejajar,
          bukan panjang sisi miring! Jangan tertukar dengan panjang sisi <InlineMath math="b" />.
        </div>
        <blockquote className="border-l-4 border-orange-500 pl-3 text-orange-200 text-xs italic">
          💡 <strong>Bukti visual:</strong> Potong segitiga di sisi kiri jajargenjang, tempelkan di sisi kanan → jadilah persegi panjang dengan panjang <InlineMath math="a" /> dan lebar <InlineMath math="t" />.
        </blockquote>
      </div>
    ),
  },
  {
    title: "Luas Trapesium",
    icon: "⬢",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Trapesium punya dua sisi yang sejajar tapi berbeda panjang. Cara menemukan rumus luasnya:
          gabungkan dua trapesium yang identik menjadi sebuah <strong className="text-red-300">jajargenjang</strong>,
          lalu bagi dua hasilnya.
        </p>
        <TrapesiumLuasSVG />
        <div className="bg-red-950/60 border border-red-700/50 rounded-lg p-4 space-y-2">
          <p className="text-red-300 font-semibold text-xs">📐 Rumus</p>
          <div className="text-center">
            <BlockMath math="L_{\text{trap}} = \frac{1}{2} \times (a + b) \times t" />
          </div>
          <p className="text-white/60 text-xs">
            <InlineMath math="a" /> = panjang sisi atas (sejajar atas), <InlineMath math="b" /> = panjang sisi bawah (sejajar bawah),
            <InlineMath math="t" /> = tinggi (jarak tegak lurus antar dua sisi sejajar)
          </p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
          🔑 <strong className="text-white">Cara mudah mengingat:</strong> Rumus trapesium mirip rata-rata dua sisi sejajar dikalikan tinggi.{" "}
          <InlineMath math="\frac{a+b}{2}" /> adalah panjang rata-rata kedua sisi sejajar!
        </div>
      </div>
    ),
  },
  {
    title: "Luas Belah Ketupat & Layang-layang",
    icon: "💎",
    content: (
      <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
        <div className="space-y-3">
          <p className="text-cyan-300 font-semibold">① Belah Ketupat</p>
          <p>
            Kedua diagonal belah ketupat saling berpotongan tegak lurus dan saling membagi dua.
            Bila kita gambar persegi panjang di sekeliling belah ketupat, luasnya tepat{" "}
            <strong className="text-cyan-300">setengah</strong> dari persegi panjang tersebut.
          </p>
          <BelahKetupatLuasSVG />
          <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
            <p className="text-cyan-300 font-semibold text-xs">📐 Rumus</p>
            <div className="text-center">
              <BlockMath math="L_{\text{bk}} = \frac{1}{2} \times d_1 \times d_2" />
            </div>
            <p className="text-white/60 text-xs">
              <InlineMath math="d_1" /> = panjang diagonal pertama, <InlineMath math="d_2" /> = panjang diagonal kedua
            </p>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-4 space-y-3">
          <p className="text-violet-300 font-semibold">② Layang-layang</p>
          <p>
            Layang-layang juga memiliki dua diagonal yang saling tegak lurus — satu diagonal membagi yang lain menjadi dua.
            Karena strukturnya mirip belah ketupat, <strong className="text-violet-300">rumus luasnya sama</strong>!
          </p>
          <LayangLayangLuasSVG />
          <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-2">
            <p className="text-violet-300 font-semibold text-xs">📐 Rumus</p>
            <div className="text-center">
              <BlockMath math="L_{\text{ll}} = \frac{1}{2} \times d_1 \times d_2" />
            </div>
          </div>
          <div className="bg-violet-950/40 border border-violet-600/30 rounded-lg p-3 text-xs text-violet-200">
            🎯 <strong>Bedanya dengan belah ketupat:</strong> Pada belah ketupat, semua sisinya sama panjang.
            Pada layang-layang, hanya dua pasang sisi berdekatan yang sama panjang. Tapi rumus luasnya identik!
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Tabel Ringkasan Semua Rumus Luas",
    icon: "📊",
    content: (
      <div className="space-y-3 font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Bangun</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Rumus Luas</th>
                <th className="px-3 py-2 text-cyan-300">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["▭ Persegi Panjang", "L = p × l", "p = panjang, l = lebar"],
                ["■ Persegi", "L = s²", "s = panjang sisi"],
                ["⬡ Jajargenjang", "L = a × t", "a = alas, t = tinggi ⊥"],
                ["⬢ Trapesium", "L = ½(a+b)×t", "a,b = sisi sejajar, t = tinggi"],
                ["◆ Belah Ketupat", "L = ½ × d₁ × d₂", "d₁, d₂ = dua diagonal"],
                ["🪁 Layang-layang", "L = ½ × d₁ × d₂", "d₁, d₂ = dua diagonal"],
              ].map(([bangun, rumus, ket], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{bangun}</td>
                  <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{rumus}</td>
                  <td className="px-3 py-2 text-white/55 text-left">{ket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🔑 <strong className="text-white">Pola yang perlu diingat:</strong></p>
          <p>• Persegi & Persegi Panjang → <strong className="text-violet-300">kalikan dua ukuran sisi</strong></p>
          <p>• Jajargenjang & Trapesium → <strong className="text-orange-300">melibatkan tinggi tegak lurus</strong></p>
          <p>• Belah Ketupat & Layang-layang → <strong className="text-cyan-300">½ × perkalian dua diagonal</strong></p>
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
          Sebuah ruang kelas berbentuk persegi panjang dengan ukuran panjang <InlineMath math="24 \text{ m}" />{" "}
          dan lebar <InlineMath math="15 \text{ m}" />.
        </p>
        <ContohMudahSVG />
        <p>
          Akan dipasang keramik berbentuk persegi berukuran <InlineMath math="50 \text{ cm} \times 50 \text{ cm}" />.
          Hitunglah luas lantai ruangan dan berapa keping keramik yang dibutuhkan!
        </p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-green-400">Langkah 1 — Hitung luas lantai ruangan:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L_{\text{lantai}} = p \times l = 24 \times 15 = 360 \text{ m}^2" />
        </div>

        <p className="text-white/80"><strong className="text-green-400">Langkah 2 — Hitung luas satu keping keramik:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-2">
          <p>Ubah dulu ke satuan yang sama: <InlineMath math="50 \text{ cm} = 0{,}5 \text{ m}" /></p>
          <BlockMath math="L_{\text{keramik}} = 0{,}5 \times 0{,}5 = 0{,}25 \text{ m}^2" />
        </div>

        <p className="text-white/80"><strong className="text-green-400">Langkah 3 — Hitung jumlah keping keramik:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\text{Jumlah} = \frac{L_{\text{lantai}}}{L_{\text{keramik}}} = \frac{360}{0{,}25} = 1.440 \text{ keping}" />
        </div>

        <div className="bg-green-950/60 border border-green-700/40 rounded p-3 space-y-1">
          <p className="text-green-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Luas lantai <InlineMath math="= 360 \text{ m}^2" /></p>
          <p className="text-white/80">• Keramik dibutuhkan <InlineMath math="= 1.440 \text{ keping}" /></p>
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
          Sebuah jembatan memiliki penampang berbentuk trapesium. Sisi atas (sejajar)
          panjangnya <InlineMath math="8 \text{ m}" />, sisi bawah (sejajar) panjangnya{" "}
          <InlineMath math="14 \text{ m}" />, dan tingginya <InlineMath math="9 \text{ m}" />.
        </p>
        <ContohSedangSVG />
        <p>
          Jika biaya pengecatan <InlineMath math="Rp\,50.000" /> per m², berapa total biaya
          untuk mengecat seluruh penampang jembatan tersebut?
        </p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 1 — Hitung luas trapesium:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1 mb-2">
          <p>Diketahui: sisi atas <InlineMath math="a = 8 \text{ m}" />, sisi bawah <InlineMath math="b = 14 \text{ m}" />, tinggi <InlineMath math="t = 9 \text{ m}" /></p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = \frac{1}{2} \times (a + b) \times t" />
          <BlockMath math="L = \frac{1}{2} \times (8 + 14) \times 9" />
          <BlockMath math="L = \frac{1}{2} \times 22 \times 9 = \frac{198}{2} = 99 \text{ m}^2" />
        </div>

        <p className="text-white/80"><strong className="text-yellow-400">Langkah 2 — Hitung total biaya pengecatan:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\text{Biaya} = 99 \times 50.000 = Rp\,4.950.000" />
        </div>

        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 space-y-1">
          <p className="text-yellow-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Luas penampang jembatan <InlineMath math="= 99 \text{ m}^2" /></p>
          <p className="text-white/80">• Total biaya pengecatan <InlineMath math="= Rp\,4.950.000" /></p>
        </div>
        <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
          ✅ Cek: <InlineMath math="\frac{a+b}{2} = \frac{8+14}{2} = 11" /> (rata-rata sisi sejajar), lalu <InlineMath math="11 \times 9 = 99 \text{ m}^2" /> ✓
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
          Sebuah taman berbentuk belah ketupat dengan panjang diagonal-diagonalnya
          <InlineMath math="d_1 = 20 \text{ m}" /> dan <InlineMath math="d_2 = 24 \text{ m}" />.
        </p>
        <ContohSulitSVG />
        <p>Tentukan:</p>
        <ul className="list-disc list-inside text-white/80 space-y-1 ml-2 text-xs">
          <li>Luas taman</li>
          <li>Panjang sisi belah ketupat</li>
          <li>Keliling taman</li>
        </ul>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-red-400">Langkah 1 — Hitung luas belah ketupat:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = \frac{1}{2} \times d_1 \times d_2 = \frac{1}{2} \times 20 \times 24" />
          <BlockMath math="L = \frac{480}{2} = 240 \text{ m}^2" />
        </div>

        <p className="text-white/80"><strong className="text-red-400">Langkah 2 — Hitung panjang sisi menggunakan Pythagoras:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-2">
          <p>Diagonal saling berpotongan tegak lurus dan membagi dua → setengah diagonal:</p>
          <BlockMath math="\frac{d_1}{2} = 10 \text{ m}, \quad \frac{d_2}{2} = 12 \text{ m}" />
          <p>Setiap sisi belah ketupat adalah hipotenusa segitiga siku-siku kecil:</p>
          <BlockMath math="s = \sqrt{\left(\frac{d_1}{2}\right)^2 + \left(\frac{d_2}{2}\right)^2}" />
          <BlockMath math="s = \sqrt{10^2 + 12^2} = \sqrt{100 + 144} = \sqrt{244} = 2\sqrt{61} \approx 15{,}62 \text{ m}" />
        </div>

        <p className="text-white/80"><strong className="text-red-400">Langkah 3 — Hitung keliling:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="K = 4 \times s = 4 \times 2\sqrt{61} = 8\sqrt{61} \approx 62{,}48 \text{ m}" />
        </div>

        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Luas taman <InlineMath math="= 240 \text{ m}^2" /></p>
          <p className="text-white/80">• Panjang sisi <InlineMath math="= 2\sqrt{61} \approx 15{,}62 \text{ m}" /></p>
          <p className="text-white/80">• Keliling <InlineMath math="= 8\sqrt{61} \approx 62{,}48 \text{ m}" /></p>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          🔑 <strong>Kunci soal ini:</strong> Luas pakai rumus diagonal, tapi untuk sisi dan keliling harus
          pakai Teorema Pythagoras pada segitiga siku-siku yang terbentuk oleh setengah-setengah diagonal.
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────
   ACCORDION & CARD COMPONENTS
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
const LuasSegiempatPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        {/* Header */}
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center leading-tight">
          LUAS SEGIEMPAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">
          Kelas 7 · Segitiga dan Segiempat
        </p>

        {/* Intro Card */}
        <div className="bg-card/60 border border-border rounded-xl p-4 mb-6 text-sm font-body text-white/75 leading-relaxed">
          <p>
            Dari menghitung luas lantai yang akan dikeramik, lahan pertanian berbentuk trapesium,
            hingga desain layang-layang kertas — semuanya membutuhkan pemahaman{" "}
            <strong className="text-cyan-300">luas segiempat</strong>. Di sini kita akan menguasai
            rumus luas enam jenis bangun segiempat sekaligus, mulai dari yang paling sederhana hingga yang paling unik!
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-3 mb-8">
          {sections.map((sec, i) => (
            <AccordionSection key={sec.title} section={sec} idx={i} />
          ))}
        </div>

        {/* Contoh Soal */}
        <div className="mb-4">
          <h3 className="font-display text-base font-bold text-white text-center mb-1">
            🚀 Contoh Soal
          </h3>
          <p className="text-white/40 text-xs text-center mb-4 font-body">
            Latihan bertahap dari mudah hingga sulit
          </p>
          <div className="flex flex-col gap-4">
            {examples.map((ex, i) => (
              <ExampleCard key={ex.level} ex={ex} idx={i} />
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
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

export default LuasSegiempatPage;
