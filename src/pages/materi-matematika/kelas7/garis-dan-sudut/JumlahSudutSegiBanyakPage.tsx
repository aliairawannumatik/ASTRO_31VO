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

const SegitigaSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-3">
    <polygon points="140,25 30,170 250,170" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2.5" />
    <circle cx="140" cy="25" r="4" fill="#facc15" />
    <circle cx="30" cy="170" r="4" fill="#facc15" />
    <circle cx="250" cy="170" r="4" fill="#facc15" />
    <text x="132" y="16" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="10" y="178" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="254" y="178" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    {/* Sudut A */}
    <path d="M55,170 A28,28 0 0,1 47,146" fill="rgba(167,139,250,0.3)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="50" y="160" fill="#a78bfa" fontSize="11" fontFamily="monospace">α</text>
    {/* Sudut B */}
    <path d="M225,170 A28,28 0 0,0 228,144" fill="rgba(74,222,128,0.3)" stroke="#4ade80" strokeWidth="1.5" />
    <text x="217" y="158" fill="#4ade80" fontSize="11" fontFamily="monospace">β</text>
    {/* Sudut C */}
    <path d="M124,40 A22,22 0 0,1 156,40" fill="rgba(251,146,60,0.3)" stroke="#fb923c" strokeWidth="1.5" />
    <text x="132" y="52" fill="#fb923c" fontSize="11" fontFamily="monospace">γ</text>
    <text x="60" y="195" fill="#e2e8f0" fontSize="10" fontFamily="monospace">α + β + γ = 180°</text>
  </svg>
);

const SegiEmpatSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-3">
    <polygon points="50,30 230,30 250,170 30,170" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="2.5" />
    <line x1="50" y1="30" x2="250" y2="170" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6,4" />
    <circle cx="50" cy="30" r="4" fill="#facc15" />
    <circle cx="230" cy="30" r="4" fill="#facc15" />
    <circle cx="250" cy="170" r="4" fill="#facc15" />
    <circle cx="30" cy="170" r="4" fill="#facc15" />
    <text x="36" y="22" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="232" y="22" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="254" y="178" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="10" y="178" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <path d="M72,30 A25,25 0 0,1 64,52" fill="rgba(167,139,250,0.3)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="65" y="46" fill="#a78bfa" fontSize="10" fontFamily="monospace">∠A</text>
    <path d="M207,30 A25,25 0 0,0 214,52" fill="rgba(74,222,128,0.3)" stroke="#4ade80" strokeWidth="1.5" />
    <text x="197" y="46" fill="#4ade80" fontSize="10" fontFamily="monospace">∠B</text>
    <path d="M230,157 A25,25 0 0,0 226,145" fill="rgba(251,146,60,0.3)" stroke="#fb923c" strokeWidth="1.5" />
    <text x="222" y="153" fill="#fb923c" fontSize="10" fontFamily="monospace">∠C</text>
    <path d="M50,157 A25,25 0 0,1 54,145" fill="rgba(244,114,182,0.3)" stroke="#f472b6" strokeWidth="1.5" />
    <text x="46" y="150" fill="#f472b6" fontSize="10" fontFamily="monospace">∠D</text>
    <text x="35" y="195" fill="#e2e8f0" fontSize="10" fontFamily="monospace">∠A + ∠B + ∠C + ∠D = 360°</text>
    <text x="60" y="185" fill="#94a3b8" fontSize="9" fontFamily="monospace">= 2 segitiga × 180° = 360°</text>
  </svg>
);

const SegiLimaSVG = () => (
  <svg viewBox="0 0 240 220" className="w-full max-w-xs mx-auto my-3">
    {/* Pentagon: 5 titik sudut */}
    <polygon points="120,15 215,80 180,190 60,190 25,80"
      fill="rgba(250,204,21,0.1)" stroke="#facc15" strokeWidth="2.5" />
    {/* Diagonal dari titik 1 ke semua */}
    <line x1="120" y1="15" x2="180" y2="190" stroke="#facc15" strokeWidth="1.2" strokeDasharray="5,4" />
    <line x1="120" y1="15" x2="60" y2="190" stroke="#facc15" strokeWidth="1.2" strokeDasharray="5,4" />
    {/* label titik */}
    <text x="114" y="11" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="218" y="82" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="182" y="200" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="44" y="200" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="8" y="82" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">E</text>
    {/* Label segitiga */}
    <text x="140" y="80" fill="#22d3ee" fontSize="10" fontFamily="monospace">△1</text>
    <text x="115" y="140" fill="#22d3ee" fontSize="10" fontFamily="monospace">△2</text>
    <text x="80" y="90" fill="#22d3ee" fontSize="10" fontFamily="monospace">△3</text>
    <text x="60" y="212" fill="#e2e8f0" fontSize="10" fontFamily="monospace">Jumlah = 3 × 180° = 540°</text>
  </svg>
);

const PolaSegiNSVG = () => (
  <svg viewBox="0 0 320 120" className="w-full max-w-sm mx-auto my-3">
    <rect x="5" y="5" width="310" height="110" rx="10" fill="rgba(15,23,42,0.8)" stroke="#334155" strokeWidth="1.5" />
    {/* Segitiga (n=3) */}
    <polygon points="45,85 25,95 65,95" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="2" />
    <text x="28" y="110" fill="#22d3ee" fontSize="9" fontFamily="monospace">n=3</text>
    <text x="22" y="78" fill="#22d3ee" fontSize="9" fontFamily="monospace">180°</text>
    {/* Segiempat (n=4) */}
    <rect x="85" y="72" width="30" height="22" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="2" />
    <text x="86" y="110" fill="#a78bfa" fontSize="9" fontFamily="monospace">n=4</text>
    <text x="81" y="66" fill="#a78bfa" fontSize="9" fontFamily="monospace">360°</text>
    {/* Segi lima (n=5) */}
    <polygon points="155,72 170,68 180,80 170,94 145,94" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="2" />
    <text x="148" y="110" fill="#facc15" fontSize="9" fontFamily="monospace">n=5</text>
    <text x="148" y="62" fill="#facc15" fontSize="9" fontFamily="monospace">540°</text>
    {/* Segi enam (n=6) */}
    <polygon points="230,72 242,65 256,72 256,88 242,95 228,88" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="2" />
    <text x="225" y="110" fill="#4ade80" fontSize="9" fontFamily="monospace">n=6</text>
    <text x="225" y="59" fill="#4ade80" fontSize="9" fontFamily="monospace">720°</text>
    {/* Rumus umum */}
    <text x="278" y="78" fill="#f472b6" fontSize="9" fontFamily="monospace">segi-n</text>
    <text x="273" y="92" fill="#f472b6" fontSize="9" fontFamily="monospace">(n-2)×180°</text>
    {/* Panah pola */}
    <text x="15" y="35" fill="#e2e8f0" fontSize="10" fontFamily="monospace">Pola: 1 segitiga → 2 segitiga → 3 segitiga → ... → (n-2) segitiga</text>
    <text x="15" y="50" fill="#94a3b8" fontSize="9" fontFamily="monospace">       180°          360°          540°              (n-2)×180°</text>
  </svg>
);

/* ──────────────────────────────────────────
   SECTION DATA
────────────────────────────────────────── */
type Section = { title: string; icon: string; content: React.ReactNode };

const sections: Section[] = [
  {
    title: "Jumlah Sudut Segitiga = 180°",
    icon: "🔺",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Fakta ini mungkin sudah pernah kamu dengar, tapi tahukah kamu <em>mengapa</em> bisa begitu?
          Jumlah ketiga sudut dalam segitiga <strong className="text-cyan-300">selalu tepat 180°</strong>, tidak peduli
          seberapa lancip, tumpul, atau siku-siku bentuknya.
        </p>
        <SegitigaSVG />
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-cyan-300">📌 Teorema Sudut Segitiga:</p>
          <BlockMath math="\alpha + \beta + \gamma = 180°" />
          <p className="text-white/60 text-xs">
            Untuk segitiga ABC dengan sudut <InlineMath math="\alpha" /> di A, <InlineMath math="\beta" /> di B, dan <InlineMath math="\gamma" /> di C.
          </p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
          <p className="text-white/80 font-semibold mb-2">Bukti Deduktif (Ringkasan):</p>
          <p>Tarik garis sejajar <InlineMath math="AC" /> melalui titik B. Karena sifat sudut dalam berseberangan dan sudut sehadap, ketiga sudut segitiga berkumpul membentuk sudut lurus (180°) di titik B.</p>
        </div>
        <blockquote className="border-l-4 border-cyan-500 bg-cyan-950/40 pl-4 py-2 text-cyan-200 text-xs rounded-r-lg">
          <strong>Ingat:</strong> Segitiga adalah segi banyak dengan jumlah sudut paling kecil — 3 sudut, 180°. Semua segi banyak lainnya dibangun dari sini!
        </blockquote>
      </div>
    ),
  },
  {
    title: "Jumlah Sudut Segi Empat = 360°",
    icon: "🔷",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Sebuah segi empat bisa kita "belah" menjadi <strong className="text-violet-300">2 segitiga</strong> dengan menghubungkan
          dua sudut yang tidak berdekatan (menarik diagonal). Jumlah sudutnya pun menjadi 2 kali jumlah sudut segitiga!
        </p>
        <SegiEmpatSVG />
        <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-violet-300">📌 Jumlah Sudut Segi Empat:</p>
          <BlockMath math="(4 - 2) \times 180° = 2 \times 180° = 360°" />
        </div>
        <blockquote className="border-l-4 border-violet-500 bg-violet-950/40 pl-4 py-2 text-violet-200 text-xs rounded-r-lg">
          <strong>Tips:</strong> Persegi, persegi panjang, jajargenjang, trapesium — semua segi empat memiliki jumlah sudut dalam yang sama: 360°!
        </blockquote>
      </div>
    ),
  },
  {
    title: "Pola Segi Lima, Segi Enam, dan Seterusnya",
    icon: "⭐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Sama seperti tadi, segi lima bisa dipecah menjadi <strong className="text-yellow-300">3 segitiga</strong>,
          segi enam menjadi <strong className="text-green-300">4 segitiga</strong>, dan seterusnya.
          Polanya sangat jelas!
        </p>
        <SegiLimaSVG />
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Bangun</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">n (sisi)</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Jml Segitiga</th>
                <th className="px-3 py-2 text-cyan-300">Jumlah Sudut</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Segitiga", 3, 1, "180°"],
                ["Segi empat", 4, 2, "360°"],
                ["Segi lima", 5, 3, "540°"],
                ["Segi enam", 6, 4, "720°"],
                ["Segi tujuh", 7, 5, "900°"],
                ["Segi-n", "n", "n − 2", "(n−2) × 180°"],
              ].map(([nama, n, jt, js], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i === 5 ? "bg-pink-950/40" : i % 2 === 0 ? "bg-slate-900/40" : ""}`}>
                  <td className={`px-3 py-2 border-r border-slate-700 ${i === 5 ? "text-pink-300 font-bold" : "text-white/80"}`}>{nama}</td>
                  <td className="px-3 py-2 border-r border-slate-700 text-white/70">{n}</td>
                  <td className="px-3 py-2 border-r border-slate-700 text-white/70">{jt}</td>
                  <td className={`px-3 py-2 ${i === 5 ? "text-pink-300 font-bold" : "text-white/70"}`}>{js}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PolaSegiNSVG />
      </div>
    ),
  },
  {
    title: "Rumus Umum: Jumlah Sudut Segi-n",
    icon: "🏆",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Dari pola yang sudah kita temukan, lahirlah satu rumus <strong className="text-pink-300">super penting</strong>
          yang berlaku untuk semua segi banyak:
        </p>
        <div className="bg-gradient-to-r from-pink-950/80 to-violet-950/80 border border-pink-700/60 rounded-xl p-5 text-center">
          <p className="text-pink-300 font-semibold mb-2 text-xs">RUMUS JUMLAH SUDUT SEGI-n</p>
          <BlockMath math="\text{Jumlah Sudut} = (n - 2) \times 180°" />
          <p className="text-white/60 text-xs mt-2">dengan <InlineMath math="n \geq 3" />, <InlineMath math="n" /> = jumlah sisi/sudut bangun</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs space-y-1">
          <p className="text-white/80 font-semibold">Cara Menggunakan Rumus:</p>
          <p className="text-white/60">1. Tentukan nilai <InlineMath math="n" /> (jumlah sisi bangun)</p>
          <p className="text-white/60">2. Hitung <InlineMath math="n - 2" /></p>
          <p className="text-white/60">3. Kalikan dengan <InlineMath math="180°" /></p>
        </div>
        <blockquote className="border-l-4 border-pink-500 bg-pink-950/40 pl-4 py-2 text-pink-200 text-xs rounded-r-lg">
          <strong>Catatan Penting:</strong> Rumus ini berlaku untuk semua segi banyak <em>cembung</em> (convex polygon).
          Rumus ini tidak berlaku untuk bangun yang "berlekuk ke dalam" (konkaf).
        </blockquote>
      </div>
    ),
  },
  {
    title: "Sudut Dalam Reguler: Setiap Sudutnya Sama!",
    icon: "💎",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Kalau semua sisi dan semua sudutnya sama besar, bangun itu disebut <strong className="text-green-300">segi banyak beraturan</strong>
          (regular polygon). Kita bisa cari besar tiap sudutnya dengan cara membagi rata:
        </p>
        <div className="bg-green-950/60 border border-green-700/50 rounded-xl p-4">
          <p className="text-green-300 font-semibold mb-2 text-xs">BESAR SETIAP SUDUT (Segi-n Beraturan):</p>
          <BlockMath math="\text{Besar setiap sudut} = \frac{(n-2) \times 180°}{n}" />
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Bangun Beraturan</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">n</th>
                <th className="px-3 py-2 text-cyan-300">Besar Setiap Sudut</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Segitiga sama sisi", 3, "60°"],
                ["Persegi", 4, "90°"],
                ["Segi lima beraturan", 5, "108°"],
                ["Segi enam beraturan", 6, "120°"],
                ["Segi delapan beraturan", 8, "135°"],
              ].map(([nama, n, sudut], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/30" : ""}`}>
                  <td className="px-3 py-2 border-r border-slate-700 text-white/80">{nama}</td>
                  <td className="px-3 py-2 border-r border-slate-700 text-white/60">{n}</td>
                  <td className="px-3 py-2 text-green-300 font-semibold">{sudut}</td>
                </tr>
              ))}
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

const ContohSegitigaSVG = ({ a, b, c }: { a: string; b: string; c: string }) => (
  <svg viewBox="0 0 240 160" className="w-full max-w-xs mx-auto my-2">
    <polygon points="120,15 20,145 220,145" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2" />
    <circle cx="120" cy="15" r="3" fill="#facc15" />
    <circle cx="20" cy="145" r="3" fill="#facc15" />
    <circle cx="220" cy="145" r="3" fill="#facc15" />
    <text x="112" y="10" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="4" y="152" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="223" y="152" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="115" y="42" fill="#fb923c" fontSize="10" fontFamily="monospace">{c}</text>
    <text x="35" y="138" fill="#a78bfa" fontSize="10" fontFamily="monospace">{a}</text>
    <text x="192" y="138" fill="#4ade80" fontSize="10" fontFamily="monospace">{b}</text>
  </svg>
);

const ContohSegiEnamSVG = () => (
  <svg viewBox="0 0 200 180" className="w-full max-w-xs mx-auto my-2">
    <polygon points="100,15 170,55 170,125 100,165 30,125 30,55"
      fill="rgba(74,222,128,0.1)" stroke="#4ade80" strokeWidth="2.5" />
    {[
      [100, 15], [170, 55], [170, 125], [100, 165], [30, 125], [30, 55]
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="#facc15" />
    ))}
    <text x="86" y="10" fill="#facc15" fontSize="9" fontFamily="monospace">A</text>
    <text x="173" y="58" fill="#facc15" fontSize="9" fontFamily="monospace">B</text>
    <text x="173" y="128" fill="#facc15" fontSize="9" fontFamily="monospace">C</text>
    <text x="86" y="175" fill="#facc15" fontSize="9" fontFamily="monospace">D</text>
    <text x="10" y="128" fill="#facc15" fontSize="9" fontFamily="monospace">E</text>
    <text x="10" y="58" fill="#facc15" fontSize="9" fontFamily="monospace">F</text>
    <text x="55" y="92" fill="#4ade80" fontSize="10" fontFamily="monospace">Segi 6</text>
    <text x="35" y="193" fill="#e2e8f0" fontSize="9" fontFamily="monospace">(6-2) × 180° = 720°</text>
  </svg>
);

const examples: Example[] = [
  {
    level: "MUDAH",
    color: "text-green-400",
    bg: "bg-green-950/40",
    border: "border-green-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>
          Pada segitiga ABC, diketahui <InlineMath math="\angle A = 48°" /> dan <InlineMath math="\angle B = 73°" />.
          Tentukan besar <InlineMath math="\angle C" />!
        </p>
        <ContohSegitigaSVG a="48°" b="73°" c="∠C=?" />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">Gunakan: jumlah sudut segitiga = 180°</p>
          <BlockMath math="\angle A + \angle B + \angle C = 180°" />
          <BlockMath math="48° + 73° + \angle C = 180°" />
          <BlockMath math="121° + \angle C = 180°" />
          <BlockMath math="\angle C = 180° - 121° = 59°" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">Jawaban: <InlineMath math="\angle C = 59°" /></p>
        </div>
        <div className="bg-yellow-950/40 border border-yellow-600/30 rounded p-2 text-xs text-yellow-200">
          ✅ Cek: <InlineMath math="48° + 73° + 59° = 180°" /> ✓
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
          Perbandingan sudut-sudut pada segitiga PQR adalah <InlineMath math="2 : 3 : 7" />.
          Tentukan besar masing-masing sudut dan klasifikasikan jenis segitiganya!
        </p>
        <ContohSegitigaSVG a="2k" b="3k" c="7k" />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">Misalkan faktor pengali = k:</p>
          <BlockMath math="\angle P + \angle Q + \angle R = 180°" />
          <BlockMath math="2k + 3k + 7k = 180°" />
          <BlockMath math="12k = 180° \implies k = 15°" />
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">Besar setiap sudut:</p>
          <BlockMath math="\angle P = 2 \times 15° = 30°" />
          <BlockMath math="\angle Q = 3 \times 15° = 45°" />
          <BlockMath math="\angle R = 7 \times 15° = 105°" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">Jawaban: <InlineMath math="\angle P = 30°" />, <InlineMath math="\angle Q = 45°" />, <InlineMath math="\angle R = 105°" /></p>
          <p className="text-white/60 text-xs mt-1">Klasifikasi: <strong className="text-yellow-300">Segitiga tumpul</strong> (ada sudut &gt; 90°, yaitu ∠R = 105°)</p>
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
          Sebuah segi banyak beraturan memiliki jumlah seluruh sudut dalamnya <InlineMath math="1.440°" />.
        </p>
        <p>a) Tentukan jumlah sisi bangun tersebut!</p>
        <p>b) Tentukan besar setiap sudut dalamnya!</p>
        <p>c) Apakah nama bangun tersebut?</p>
        <ContohSegiEnamSVG />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">a) Mencari n (jumlah sisi):</p>
          <BlockMath math="(n - 2) \times 180° = 1440°" />
          <BlockMath math="n - 2 = \frac{1440°}{180°} = 8" />
          <BlockMath math="n = 8 + 2 = 10" />
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">b) Besar setiap sudut dalam (beraturan):</p>
          <BlockMath math="\text{Setiap sudut} = \frac{1440°}{10} = 144°" />
          <p className="text-white/60 text-xs mt-1">Atau: <InlineMath math="\frac{(10-2)\times180°}{10} = \frac{1440°}{10} = 144°" /></p>
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3">
          <p className="text-red-300 font-semibold">Jawaban:</p>
          <p className="text-white/80 text-xs">a) <InlineMath math="n = 10" /> sisi</p>
          <p className="text-white/80 text-xs">b) Setiap sudut = <InlineMath math="144°" /></p>
          <p className="text-white/80 text-xs">c) Bangun tersebut adalah <strong className="text-red-300">segi sepuluh beraturan (dekagon beraturan)</strong></p>
        </div>
      </div>
    ),
  },
];

/* ──────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────── */
const JumlahSudutSegiBanyakPage = () => {
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
          JUMLAH SUDUT PADA SEGI BANYAK
        </h1>
        <p className="text-cyan-300 text-xs text-center font-display mb-1">Dari Segitiga Hingga Segi-n</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 · Garis dan Sudut · Materi Matematika</p>

        {/* RINGKASAN INTISARI */}
        <div className="bg-slate-900/80 border border-cyan-700/50 rounded-2xl p-4 mb-6 text-sm text-white/80 font-body leading-relaxed">
          <p className="text-cyan-300 font-semibold mb-2">🌌 Ringkasan Intisari</p>
          <p>
            Setiap segi banyak (poligon) bisa dipecah menjadi <strong className="text-yellow-300">segitiga-segitiga</strong>.
            Dari situlah lahir rumus ajaib untuk menghitung jumlah sudut semua segi banyak:
          </p>
          <div className="mt-3 bg-pink-950/60 border border-pink-700/40 rounded-lg p-3 text-center">
            <BlockMath math="\text{Jumlah Sudut Segi-}n = (n - 2) \times 180°" />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/60">
            <div className="bg-slate-800/50 rounded p-2">🔺 Segitiga (n=3): <span className="text-cyan-300 font-semibold">180°</span></div>
            <div className="bg-slate-800/50 rounded p-2">🔷 Segi 4 (n=4): <span className="text-violet-300 font-semibold">360°</span></div>
            <div className="bg-slate-800/50 rounded p-2">⭐ Segi 5 (n=5): <span className="text-yellow-300 font-semibold">540°</span></div>
            <div className="bg-slate-800/50 rounded p-2">🟢 Segi 6 (n=6): <span className="text-green-300 font-semibold">720°</span></div>
          </div>
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

export default JumlahSudutSegiBanyakPage;
