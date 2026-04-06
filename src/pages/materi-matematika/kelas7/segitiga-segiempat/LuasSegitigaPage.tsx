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

const PenurunanRumusSVG = () => (
  <svg viewBox="0 0 340 220" className="w-full max-w-sm mx-auto my-3" aria-label="Penurunan rumus luas segitiga dari persegi panjang">
    {/* Background rectangle */}
    <rect x="30" y="30" width="280" height="150" fill="rgba(167,139,250,0.10)" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6,3"/>
    {/* Triangle filled */}
    <polygon points="30,180 310,180 30,30" fill="rgba(34,211,238,0.20)" stroke="#22d3ee" strokeWidth="2"/>
    {/* Dashed triangle (mirror) */}
    <polygon points="30,30 310,180 310,30" fill="rgba(34,211,238,0.06)" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5,3"/>

    {/* Height line */}
    <line x1="30" y1="30" x2="30" y2="180" stroke="#facc15" strokeWidth="2" strokeDasharray="4,3"/>
    {/* Right angle mark */}
    <rect x="30" y="165" width="15" height="15" fill="none" stroke="#facc15" strokeWidth="1.5"/>

    {/* Width arrow */}
    <line x1="30" y1="198" x2="310" y2="198" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#arrow)"/>
    <line x1="310" y1="198" x2="30" y2="198" stroke="#4ade80" strokeWidth="1.5"/>

    {/* Labels */}
    <text x="155" y="210" fill="#4ade80" fontSize="12" fontFamily="monospace" textAnchor="middle">a (alas)</text>
    <text x="8" y="112" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" transform="rotate(-90,8,112)">t (tinggi)</text>
    <text x="175" y="145" fill="#22d3ee" fontSize="11" fontFamily="monospace">Segitiga</text>
    <text x="200" y="65" fill="#a78bfa" fontSize="10" fontFamily="monospace" opacity="0.8">½ persegi panjang</text>

    {/* Formula note */}
    <rect x="80" y="60" width="180" height="48" rx="6" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="1"/>
    <text x="170" y="80" fill="#22d3ee" fontSize="10" fontFamily="monospace" textAnchor="middle">L = ½ × a × t</text>
    <text x="170" y="96" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">= ½ × L. Persegi Panjang</text>
  </svg>
);

const SegitigaSembarangSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-3" aria-label="Segitiga sembarang dengan alas dan tinggi">
    {/* Triangle */}
    <polygon points="60,175 240,175 140,35" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="2"/>
    {/* Altitude from apex to base */}
    <line x1="140" y1="35" x2="140" y2="175" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="128" y="163" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    {/* Alas arrow */}
    <line x1="60" y1="192" x2="240" y2="192" stroke="#4ade80" strokeWidth="1.5"/>
    {/* Labels */}
    <text x="150" y="170" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="44" y="185" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="244" y="185" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="150" y="108" fill="#facc15" fontSize="12" fontFamily="monospace">t</text>
    <text x="140" y="207" fill="#4ade80" fontSize="12" fontFamily="monospace" textAnchor="middle">a</text>
    <text x="85" y="115" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(-56,90,118)">c</text>
    <text x="198" y="115" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(50,202,118)">b</text>
  </svg>
);

const SegitigaSikuSVG = () => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-3" aria-label="Segitiga siku-siku, alas dan tinggi adalah dua kaki">
    <polygon points="40,170 220,170 40,40" fill="rgba(74,222,128,0.10)" stroke="#4ade80" strokeWidth="2"/>
    {/* Right angle */}
    <rect x="40" y="158" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="2"/>
    {/* Labels */}
    <text x="26" y="35" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="224" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="26" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="10" y="110" fill="#facc15" fontSize="12" fontFamily="monospace">t = AC</text>
    <text x="118" y="187" fill="#4ade80" fontSize="12" fontFamily="monospace">a = BC</text>
    <text x="100" y="95" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(-45,110,105)">miring</text>
    <rect x="130" y="60" width="115" height="32" rx="5" fill="rgba(74,222,128,0.12)" stroke="#4ade80" strokeWidth="1"/>
    <text x="188" y="77" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle">L = ½ × a × t</text>
    <text x="188" y="88" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">(kaki ⊥ kaki)</text>
  </svg>
);

const SegitigaSamaSisiSVG = () => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-3" aria-label="Segitiga sama sisi dengan sisi s">
    <polygon points="130,20 20,185 240,185" fill="rgba(251,146,60,0.10)" stroke="#fb923c" strokeWidth="2"/>
    {/* Altitude */}
    <line x1="130" y1="20" x2="130" y2="185" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="118" y="173" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    {/* Tick marks (equal sides) */}
    <line x1="65" y1="104" x2="72" y2="97" stroke="#fb923c" strokeWidth="2"/>
    <line x1="68" y1="108" x2="75" y2="101" stroke="#fb923c" strokeWidth="2"/>
    <line x1="189" y1="104" x2="182" y2="97" stroke="#fb923c" strokeWidth="2"/>
    <line x1="186" y1="108" x2="179" y2="101" stroke="#fb923c" strokeWidth="2"/>
    <line x1="116" y1="185" x2="116" y2="178" stroke="#fb923c" strokeWidth="2"/>
    <line x1="121" y1="185" x2="121" y2="178" stroke="#fb923c" strokeWidth="2"/>
    {/* Labels */}
    <text x="124" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="6" y="195" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="242" y="195" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="138" y="108" fill="#facc15" fontSize="11" fontFamily="monospace">t</text>
    <text x="62" y="155" fill="#fb923c" fontSize="11" fontFamily="monospace" transform="rotate(-59,70,158)">s</text>
    <text x="190" y="155" fill="#fb923c" fontSize="11" fontFamily="monospace" transform="rotate(59,192,158)">s</text>
    <text x="118" y="198" fill="#fb923c" fontSize="11" fontFamily="monospace">s</text>
    <rect x="54" y="30" width="148" height="30" rx="5" fill="rgba(251,146,60,0.12)" stroke="#fb923c" strokeWidth="1"/>
    <text x="128" y="47" fill="#fb923c" fontSize="10" fontFamily="monospace" textAnchor="middle">t = ½√3 × s</text>
  </svg>
);

const GridLuasSVG = () => (
  <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto my-3" aria-label="Visualisasi luas segitiga pada kotak-kotak grid">
    {/* Grid */}
    {[0,1,2,3,4,5].map(i => (
      <line key={`h${i}`} x1="20" y1={30+i*32} x2="240" y2={30+i*32} stroke="#334155" strokeWidth="0.8"/>
    ))}
    {[0,1,2,3,4,5,6,7].map(i => (
      <line key={`v${i}`} x1={20+i*32} y1="30" x2={20+i*32} y2="190" stroke="#334155" strokeWidth="0.8"/>
    ))}
    {/* Shaded triangle */}
    <polygon points="20,190 180,190 20,30" fill="rgba(34,211,238,0.25)" stroke="#22d3ee" strokeWidth="2"/>
    {/* Full rectangle outline */}
    <rect x="20" y="30" width="160" height="160" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="5,3"/>
    {/* Labels */}
    <text x="100" y="208" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">a = 5 satuan</text>
    <text x="5" y="112" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle" transform="rotate(-90,5,112)">t = 5 sat.</text>
    <text x="60" y="145" fill="#22d3ee" fontSize="12" fontFamily="monospace" fontWeight="bold">12,5</text>
    <text x="60" y="158" fill="#22d3ee" fontSize="10" fontFamily="monospace">satuan²</text>
    <text x="145" y="65" fill="#a78bfa" fontSize="9" fontFamily="monospace">L.persegi</text>
    <text x="145" y="76" fill="#a78bfa" fontSize="9" fontFamily="monospace">= 25 sat²</text>
  </svg>
);

const ContohMudahSVG = () => (
  <svg viewBox="0 0 280 190" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga siku-siku alas 8 tinggi 6">
    <polygon points="40,165 200,165 40,45" fill="rgba(74,222,128,0.12)" stroke="#4ade80" strokeWidth="2"/>
    <rect x="40" y="153" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="2"/>
    <text x="26" y="40" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="204" y="178" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="26" y="178" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="4" y="108" fill="#facc15" fontSize="12" fontFamily="monospace">6 cm</text>
    <text x="105" y="180" fill="#4ade80" fontSize="12" fontFamily="monospace">8 cm</text>
    <text x="100" y="75" fill="#94a3b8" fontSize="10" fontFamily="monospace" transform="rotate(-38,110,85)">10 cm</text>
  </svg>
);

const ContohSedangSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga sembarang alas 14 tinggi 10">
    <polygon points="40,175 260,175 160,35" fill="rgba(251,146,60,0.12)" stroke="#fb923c" strokeWidth="2"/>
    {/* Altitude */}
    <line x1="160" y1="35" x2="160" y2="175" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="148" y="163" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    {/* Labels */}
    <text x="153" y="29" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">P</text>
    <text x="25" y="188" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">Q</text>
    <text x="263" y="188" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">R</text>
    <text x="165" y="110" fill="#facc15" fontSize="12" fontFamily="monospace">10 cm</text>
    <text x="138" y="192" fill="#4ade80" fontSize="12" fontFamily="monospace">14 cm</text>
    <text x="62" y="105" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(-55,72,110)">PQ</text>
    <text x="216" y="105" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(50,222,112)">PR</text>
  </svg>
);

const ContohSulitSVG = () => (
  <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga sama sisi sisi 12 cm">
    <polygon points="140,18 28,188 252,188" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2"/>
    {/* Altitude */}
    <line x1="140" y1="18" x2="140" y2="188" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="128" y="176" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    {/* Equal-side ticks */}
    <line x1="78" y1="106" x2="85" y2="99" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="82" y1="110" x2="89" y2="103" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="194" y1="106" x2="187" y2="99" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="190" y1="110" x2="183" y2="103" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="127" y1="188" x2="127" y2="181" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="132" y1="188" x2="132" y2="181" stroke="#a78bfa" strokeWidth="2"/>
    {/* Labels */}
    <text x="133" y="13" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="12" y="200" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="254" y="200" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="148" y="108" fill="#facc15" fontSize="11" fontFamily="monospace">t = ?</text>
    <text x="60" y="158" fill="#a78bfa" fontSize="11" fontFamily="monospace" transform="rotate(-59,68,162)">12 cm</text>
    <text x="196" y="158" fill="#a78bfa" fontSize="11" fontFamily="monospace" transform="rotate(59,198,162)">12 cm</text>
    <text x="128" y="202" fill="#a78bfa" fontSize="11" fontFamily="monospace">12 cm</text>
  </svg>
);

/* ─────────────────────────────────────────────
   SECTION DATA
───────────────────────────────────────────── */
type Section = { title: string; icon: string; content: React.ReactNode };

const sections: Section[] = [
  {
    title: "Apa Itu Luas?",
    icon: "📐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Bayangkan kamu ingin memasang keramik di lantai kamar berbentuk persegi panjang.
          Berapa banyak keramik yang kamu butuhkan? Jawabannya bergantung pada seberapa besar
          <strong className="text-cyan-300"> daerah yang perlu ditutupi</strong> — itulah yang kita sebut <strong className="text-yellow-300">luas</strong>.
        </p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p>
            <strong className="text-cyan-300">Definisi:</strong> Luas daerah suatu bangun datar adalah{" "}
            <strong>banyaknya satuan luas yang diperlukan untuk menutupi seluruh bangun</strong> tersebut tanpa sisa dan tanpa tumpang tindih.
          </p>
          <p>
            <strong className="text-cyan-300">Satuan Luas</strong> ditulis sebagai kuadrat dari satuan panjang:
          </p>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {[["mm²","milimeter persegi"],["cm²","sentimeter persegi"],["m²","meter persegi"],["km²","kilometer persegi"],["ha","hektar (10.000 m²)"],["are","are (100 m²)"]].map(([sat, nama]) => (
              <div key={sat} className="bg-cyan-950/40 border border-cyan-800/40 rounded p-2 text-center">
                <p className="text-yellow-300 font-bold text-xs font-mono">{sat}</p>
                <p className="text-white/50 text-xs">{nama}</p>
              </div>
            ))}
          </div>
        </div>
        <GridLuasSVG />
        <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
          📌 <strong>Bedakan:</strong> Keliling = jarak mengelilingi (satuan panjang).
          Luas = daerah yang tercakup (satuan persegi/kuadrat).
        </blockquote>
      </div>
    ),
  },
  {
    title: "Menurunkan Rumus Luas Segitiga",
    icon: "🔬",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Rahasia rumus luas segitiga sebenarnya bisa ditemukan dari{" "}
          <strong className="text-violet-300">persegi panjang</strong>! Mari kita eksplor cara menemukan rumusnya.
        </p>
        <PenurunanRumusSVG />
        <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-3">
          <p className="text-violet-300 font-semibold">🔍 Proses Penurunan Rumus:</p>
          <div className="space-y-2 text-white/80">
            <p>
              <strong className="text-violet-300">Langkah 1:</strong> Ambil sebuah persegi panjang dengan panjang <InlineMath math="a" /> (alas) dan tinggi <InlineMath math="t" />.
            </p>
            <div className="bg-violet-950/50 rounded p-2">
              <BlockMath math="L_{\text{persegi panjang}} = a \times t" />
            </div>
            <p>
              <strong className="text-violet-300">Langkah 2:</strong> Tarik diagonal — persegi panjang terbagi menjadi{" "}
              <strong>dua segitiga yang ukurannya sama persis</strong>.
            </p>
            <p>
              <strong className="text-violet-300">Langkah 3:</strong> Karena setiap segitiga adalah <em>setengah</em> dari persegi panjang:
            </p>
            <div className="bg-violet-950/70 rounded p-3 text-center">
              <BlockMath math="L_{\triangle} = \frac{1}{2} \times L_{\text{persegi panjang}} = \frac{1}{2} \times a \times t" />
            </div>
          </div>
        </div>
        <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-xs text-yellow-200">
          💡 <strong>Fakta Keren:</strong> Cara ini berlaku untuk <em>semua jenis segitiga</em> — lancip, siku-siku,
          maupun tumpul — selama <InlineMath math="a" /> adalah alas dan <InlineMath math="t" /> adalah tinggi yang tegak lurus terhadap alas tersebut!
        </div>
      </div>
    ),
  },
  {
    title: "Rumus Luas Segitiga",
    icon: "📏",
    content: (
      <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
        <div className="bg-cyan-950/60 border border-cyan-500/60 rounded-xl p-4 text-center">
          <p className="text-cyan-300 font-semibold mb-2">⭐ Rumus Utama</p>
          <BlockMath math="L_{\triangle} = \frac{1}{2} \times a \times t" />
          <p className="text-white/60 text-xs mt-1">
            <InlineMath math="a" /> = panjang alas, <InlineMath math="t" /> = tinggi tegak lurus ke alas
          </p>
        </div>

        <SegitigaSembarangSVG />

        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2">
          <p className="text-white font-semibold text-xs">⚠️ Hal Penting tentang "Tinggi":</p>
          <p className="text-white/70 text-xs">
            Tinggi segitiga (<InlineMath math="t" />) adalah panjang ruas garis yang ditarik dari salah satu
            titik sudut <strong>tegak lurus (90°)</strong> ke sisi yang menjadi alas (atau perpanjangannya).
            Tinggi ini <strong>belum tentu</strong> sama dengan panjang sisi!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-2">
          <div className="bg-green-950/50 border border-green-700/40 rounded-lg p-3">
            <p className="text-green-300 font-semibold text-xs mb-2">📐 Segitiga Siku-Siku (Istimewa!)</p>
            <SegitigaSikuSVG />
            <p className="text-white/70 text-xs">Pada segitiga siku-siku, <strong>kedua kaki</strong> saling tegak lurus.
              Jadi satu kaki bisa jadi alas, dan kaki lainnya otomatis jadi tingginya.</p>
            <div className="bg-green-950/60 rounded p-2 mt-2 text-center">
              <BlockMath math="L = \frac{1}{2} \times \text{kaki}_1 \times \text{kaki}_2" />
            </div>
          </div>

          <div className="bg-orange-950/50 border border-orange-700/40 rounded-lg p-3">
            <p className="text-orange-300 font-semibold text-xs mb-2">🔺 Segitiga Sama Sisi</p>
            <SegitigaSamaSisiSVG />
            <p className="text-white/70 text-xs">Untuk segitiga sama sisi dengan panjang sisi <InlineMath math="s" />,
              tingginya dihitung dengan Pythagoras:</p>
            <div className="bg-orange-950/60 rounded p-2 mt-2 text-center">
              <BlockMath math="t = \frac{\sqrt{3}}{2} \times s" />
              <BlockMath math="L = \frac{\sqrt{3}}{4} \times s^2" />
            </div>
          </div>
        </div>

        <blockquote className="border-l-4 border-yellow-500 pl-3 text-yellow-200 text-xs italic">
          📌 <strong>Ingat:</strong> Setiap segitiga memiliki 3 alas yang berbeda (setiap sisi bisa jadi alas),
          dan setiap alas punya tinggi yang berbeda. Tapi hasilnya tetap sama!
        </blockquote>
      </div>
    ),
  },
  {
    title: "Konversi Satuan Luas",
    icon: "🔄",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Sering kali kita perlu mengubah satuan luas dari satu bentuk ke bentuk lain.
          Yuk, kuasai konversi satuan luas agar tidak salah dalam menjawab soal!
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Dari</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Ke</th>
                <th className="px-3 py-2 text-cyan-300">Dikali</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["km²", "m²", "× 1.000.000"],
                ["m²", "dm²", "× 100"],
                ["dm²", "cm²", "× 100"],
                ["cm²", "mm²", "× 100"],
                ["m²", "cm²", "× 10.000"],
                ["ha", "m²", "× 10.000"],
                ["are", "m²", "× 100"],
              ].map(([dari, ke, kali], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{dari}</td>
                  <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{ke}</td>
                  <td className="px-3 py-2 text-green-300 font-mono">{kali}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-2">
          <p>🔑 <strong className="text-white">Trik Mengingat:</strong></p>
          <p>Setiap naik 1 tingkat satuan panjang → dikali 10. Tapi satuan <strong className="text-yellow-300">luas</strong> berarti dikuadratkan → naik 1 tingkat = dikali <strong className="text-yellow-300">100</strong>.</p>
          <div className="bg-slate-900/60 rounded p-2">
            <BlockMath math="1 \text{ m}^2 = (100 \text{ cm})^2 = 10.000 \text{ cm}^2" />
          </div>
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
          Sebuah segitiga siku-siku <InlineMath math="ABC" /> memiliki dua kaki (sisi siku-siku)
          sepanjang <InlineMath math="AC = 6 \text{ cm}" /> dan <InlineMath math="BC = 8 \text{ cm}" />.
        </p>
        <ContohMudahSVG />
        <p>Hitunglah luas segitiga tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-green-400">Langkah 1 — Identifikasi alas dan tinggi:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
          <p>Segitiga siku-siku di <InlineMath math="C" />, sehingga dua kaki saling tegak lurus.</p>
          <p>• Alas <InlineMath math="a = BC = 8 \text{ cm}" /></p>
          <p>• Tinggi <InlineMath math="t = AC = 6 \text{ cm}" /></p>
        </div>
        <p className="text-white/80"><strong className="text-green-400">Langkah 2 — Hitung luas:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = \frac{1}{2} \times a \times t" />
          <BlockMath math="L = \frac{1}{2} \times 8 \times 6" />
          <BlockMath math="L = \frac{1}{2} \times 48 = 24 \text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Jawaban: Luas segitiga <InlineMath math="= 24 \text{ cm}^2" /></p>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          💡 Pada segitiga siku-siku, kedua kaki langsung bisa dipakai sebagai alas dan tinggi karena sudah saling tegak lurus.
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
          Segitiga <InlineMath math="PQR" /> memiliki alas <InlineMath math="QR = 14 \text{ cm}" />.
          Garis tinggi dari <InlineMath math="P" /> ke <InlineMath math="QR" /> panjangnya
          <InlineMath math="10 \text{ cm}" />.
        </p>
        <ContohSedangSVG />
        <p>
          Jika luas segitiga dinyatakan dalam satuan <InlineMath math="\text{m}^2" />, berapa luasnya?
        </p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 1 — Hitung luas dalam cm²:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = \frac{1}{2} \times a \times t" />
          <BlockMath math="L = \frac{1}{2} \times 14 \times 10" />
          <BlockMath math="L = \frac{1}{2} \times 140 = 70 \text{ cm}^2" />
        </div>
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 2 — Konversi cm² ke m²:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-2">
          <p>Ingat: <InlineMath math="1 \text{ m} = 100 \text{ cm}" />, jadi <InlineMath math="1 \text{ m}^2 = 10.000 \text{ cm}^2" /></p>
          <BlockMath math="L = \frac{70}{10.000} \text{ m}^2 = 0{,}007 \text{ m}^2" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 space-y-1">
          <p className="text-yellow-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Luas <InlineMath math="= 70 \text{ cm}^2" /></p>
          <p className="text-white/80">• Luas <InlineMath math="= 0{,}007 \text{ m}^2" /></p>
        </div>
        <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
          ✅ Cek balik: <InlineMath math="0{,}007 \times 10.000 = 70 \text{ cm}^2" /> ✓
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
          Sebuah taman berbentuk segitiga sama sisi <InlineMath math="ABC" /> dengan panjang setiap
          sisinya <InlineMath math="12 \text{ m}" />.
        </p>
        <ContohSulitSVG />
        <p>Tentukan:</p>
        <ul className="list-disc list-inside text-white/80 space-y-1 ml-2 text-xs">
          <li>Panjang garis tinggi segitiga (<InlineMath math="t" />)</li>
          <li>Luas taman tersebut (dalam m²)</li>
          <li>Biaya pemasangan rumput jika harga <InlineMath math="Rp30.000" /> per m²</li>
        </ul>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-red-400">Langkah 1 — Hitung tinggi segitiga sama sisi:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-2">
          <p>Tinggi membagi alas menjadi dua bagian sama: <InlineMath math="\frac{12}{2} = 6 \text{ m}" /></p>
          <p>Gunakan Teorema Pythagoras pada setengah segitiga:</p>
          <BlockMath math="t^2 + 6^2 = 12^2" />
          <BlockMath math="t^2 = 144 - 36 = 108" />
          <BlockMath math="t = \sqrt{108} = \sqrt{36 \times 3} = 6\sqrt{3} \approx 10{,}39 \text{ m}" />
        </div>

        <p className="text-white/80"><strong className="text-red-400">Langkah 2 — Hitung luas segitiga:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = \frac{1}{2} \times a \times t = \frac{1}{2} \times 12 \times 6\sqrt{3}" />
          <BlockMath math="L = 36\sqrt{3} \approx 36 \times 1{,}732 \approx 62{,}35 \text{ m}^2" />
        </div>

        <p className="text-white/80"><strong className="text-red-400">Langkah 3 — Hitung biaya pemasangan rumput:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\text{Biaya} = L \times \text{harga per m}^2" />
          <BlockMath math="= 36\sqrt{3} \times 30.000" />
          <BlockMath math="\approx 62{,}35 \times 30.000 = Rp\ 1.870.500" />
        </div>

        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Tinggi <InlineMath math="t = 6\sqrt{3} \approx 10{,}39 \text{ m}" /></p>
          <p className="text-white/80">• Luas <InlineMath math="= 36\sqrt{3} \approx 62{,}35 \text{ m}^2" /></p>
          <p className="text-white/80">• Biaya rumput <InlineMath math="\approx Rp\ 1.870.500" /></p>
        </div>

        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          🔑 <strong>Rumus pintas segitiga sama sisi:</strong>{" "}
          <InlineMath math="L = \frac{\sqrt{3}}{4} \times s^2 = \frac{\sqrt{3}}{4} \times 144 = 36\sqrt{3}" /> ✓
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
const LuasSegitigaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        {/* Header */}
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center leading-tight">
          LUAS SEGITIGA
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">
          Kelas 7 · Segitiga dan Segiempat
        </p>

        {/* Intro Card */}
        <div className="bg-card/60 border border-border rounded-xl p-4 mb-6 text-sm font-body text-white/75 leading-relaxed">
          <p>
            Dari memasang keramik lantai hingga menghitung luas lahan pertanian berbentuk segitiga —
            memahami <strong className="text-cyan-300">luas segitiga</strong> adalah keterampilan matematika
            yang sangat berguna di kehidupan nyata. Hanya dengan satu rumus sederhana yang lahir dari persegi panjang,
            kita bisa menghitung luas <strong className="text-yellow-300">semua jenis segitiga!</strong>
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

export default LuasSegitigaPage;
