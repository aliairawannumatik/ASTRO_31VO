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

const SegitigaSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-3" aria-label="Segitiga dengan sisi a, b, c">
    <polygon points="150,20 30,175 270,175" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
    <text x="143" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="14" y="188" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="274" y="188" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="76" y="108" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-55,90,115)">c</text>
    <text x="214" y="108" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(52,218,115)">b</text>
    <text x="143" y="192" fill="#facc15" fontSize="12" fontFamily="monospace">a</text>
    <text x="90" y="228" fill="#22d3ee" fontSize="10" fontFamily="monospace"></text>
    <rect x="6" y="148" width="60" height="26" rx="4" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1" opacity="0.7"/>
    <text x="10" y="165" fill="#22d3ee" fontSize="10" fontFamily="monospace">K = a+b+c</text>
  </svg>
);

const PersegiPanjangSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-3" aria-label="Persegi panjang dengan panjang p dan lebar l">
    <rect x="30" y="40" width="240" height="110" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth="2" />
    <text x="22" y="35" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="272" y="35" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="22" y="165" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="272" y="165" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="135" y="32" fill="#facc15" fontSize="12" fontFamily="monospace">p</text>
    <text x="135" y="168" fill="#facc15" fontSize="12" fontFamily="monospace">p</text>
    <text x="6" y="102" fill="#facc15" fontSize="12" fontFamily="monospace">l</text>
    <text x="282" y="102" fill="#facc15" fontSize="12" fontFamily="monospace">l</text>
    <rect x="30" y="138" width="12" height="12" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="60" y="135" fill="#a78bfa" fontSize="10" fontFamily="monospace">K = 2×(p+l)</text>
  </svg>
);

const PersegiSVG = () => (
  <svg viewBox="0 0 220 200" className="w-full max-w-xs mx-auto my-3" aria-label="Persegi dengan sisi s">
    <rect x="40" y="30" width="140" height="140" fill="rgba(74,222,128,0.08)" stroke="#4ade80" strokeWidth="2" />
    <text x="32" y="25" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="182" y="25" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="32" y="183" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="182" y="183" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <rect x="40" y="158" width="12" height="12" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="103" y="22" fill="#facc15" fontSize="13" fontFamily="monospace">s</text>
    <text x="103" y="186" fill="#facc15" fontSize="13" fontFamily="monospace">s</text>
    <text x="16" y="103" fill="#facc15" fontSize="13" fontFamily="monospace">s</text>
    <text x="188" y="103" fill="#facc15" fontSize="13" fontFamily="monospace">s</text>
    <text x="50" y="108" fill="#4ade80" fontSize="10" fontFamily="monospace">K = 4 × s</text>
  </svg>
);

const JajargenjangSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-3" aria-label="Jajargenjang dengan sisi a dan b">
    <polygon points="70,30 270,30 230,150 30,150" fill="rgba(251,146,60,0.08)" stroke="#fb923c" strokeWidth="2"/>
    <text x="58" y="24" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="272" y="24" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="15" y="163" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="232" y="163" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="158" y="22" fill="#facc15" fontSize="12" fontFamily="monospace">a</text>
    <text x="118" y="162" fill="#facc15" fontSize="12" fontFamily="monospace">a</text>
    <text x="30" y="96" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-72,38,94)">b</text>
    <text x="252" y="96" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-72,254,94)">b</text>
    <text x="60" y="120" fill="#fb923c" fontSize="10" fontFamily="monospace">K = 2×(a+b)</text>
  </svg>
);

const TrapesiumSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-3" aria-label="Trapesium dengan sisi a, b, c, d">
    <polygon points="80,30 220,30 270,150 30,150" fill="rgba(248,113,113,0.08)" stroke="#f87171" strokeWidth="2"/>
    <text x="68" y="24" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="222" y="24" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="14" y="163" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="272" y="163" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="142" y="22" fill="#facc15" fontSize="12" fontFamily="monospace">a (atas)</text>
    <text x="128" y="164" fill="#facc15" fontSize="12" fontFamily="monospace">b (bawah)</text>
    <text x="32" y="96" fill="#22d3ee" fontSize="12" fontFamily="monospace" transform="rotate(-75,40,95)">c</text>
    <text x="258" y="96" fill="#22d3ee" fontSize="12" fontFamily="monospace" transform="rotate(67,262,95)">d</text>
    <text x="60" y="120" fill="#f87171" fontSize="10" fontFamily="monospace">K = a+b+c+d</text>
  </svg>
);

const BelahKetupatSVG = () => (
  <svg viewBox="0 0 220 200" className="w-full max-w-xs mx-auto my-3" aria-label="Belah ketupat dengan sisi s">
    <polygon points="110,20 200,100 110,180 20,100" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2"/>
    <text x="103" y="14" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="204" y="104" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="103" y="194" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="4" y="104" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="162" y="60" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(42,158,65)">s</text>
    <text x="155" y="148" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-42,158,145)">s</text>
    <text x="42" y="60" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-42,55,65)">s</text>
    <text x="42" y="148" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(42,55,145)">s</text>
    <text x="52" y="108" fill="#22d3ee" fontSize="10" fontFamily="monospace">K = 4 × s</text>
  </svg>
);

const LayangLayangSVG = () => (
  <svg viewBox="0 0 220 220" className="w-full max-w-xs mx-auto my-3" aria-label="Layang-layang dengan dua pasang sisi">
    <polygon points="110,15 185,90 110,200 35,90" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth="2"/>
    <text x="102" y="10" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="188" y="94" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="102" y="214" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="16" y="94" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="152" y="48" fill="#facc15" fontSize="11" fontFamily="monospace" transform="rotate(40,155,55)">p</text>
    <text x="148" y="152" fill="#22d3ee" fontSize="11" fontFamily="monospace" transform="rotate(-45,154,157)">q</text>
    <text x="46" y="48" fill="#facc15" fontSize="11" fontFamily="monospace" transform="rotate(-40,55,55)">p</text>
    <text x="44" y="152" fill="#22d3ee" fontSize="11" fontFamily="monospace" transform="rotate(45,54,157)">q</text>
    <text x="35" y="115" fill="#a78bfa" fontSize="10" fontFamily="monospace">K=2(p+q)</text>
  </svg>
);

const ContohMudahSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga sama kaki contoh soal mudah">
    <polygon points="150,20 30,160 270,160" fill="rgba(74,222,128,0.1)" stroke="#4ade80" strokeWidth="2"/>
    <text x="143" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="14" y="173" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="274" y="173" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="62" y="85" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-52,75,90)">13 cm</text>
    <text x="210" y="85" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(52,218,90)">13 cm</text>
    <text x="130" y="174" fill="#22d3ee" fontSize="12" fontFamily="monospace">10 cm</text>
  </svg>
);

const ContohSedangSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-2" aria-label="Persegi panjang contoh soal sedang">
    <rect x="30" y="40" width="240" height="110" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="2"/>
    <text x="22" y="35" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="272" y="35" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="22" y="165" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="272" y="165" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="128" y="33" fill="#facc15" fontSize="12" fontFamily="monospace">p = ?</text>
    <text x="128" y="168" fill="#facc15" fontSize="12" fontFamily="monospace">p = ?</text>
    <text x="2" y="102" fill="#22d3ee" fontSize="11" fontFamily="monospace">12</text>
    <text x="280" y="102" fill="#22d3ee" fontSize="11" fontFamily="monospace">12</text>
    <rect x="30" y="138" width="12" height="12" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="60" y="128" fill="#f87171" fontSize="10" fontFamily="monospace">K = 70 cm</text>
  </svg>
);

const ContohSulitSVG = () => (
  <svg viewBox="0 0 320 220" className="w-full max-w-sm mx-auto my-2" aria-label="Bangun huruf L contoh soal sulit">
    <polygon points="30,30 30,190 160,190 160,120 210,120 210,30"
      fill="rgba(248,113,113,0.1)" stroke="#f87171" strokeWidth="2"/>
    <text x="20" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">F</text>
    <text x="212" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">E</text>
    <text x="212" y="128" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="162" y="128" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="162" y="200" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="20" y="200" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="108" y="24" fill="#facc15" fontSize="11" fontFamily="monospace">FE = 9</text>
    <text x="212" y="80" fill="#facc15" fontSize="11" fontFamily="monospace">ED = 5</text>
    <text x="168" y="148" fill="#22d3ee" fontSize="11" fontFamily="monospace">DC = 3</text>
    <text x="80" y="205" fill="#facc15" fontSize="11" fontFamily="monospace">AB = 13</text>
    <text x="2" y="115" fill="#22d3ee" fontSize="11" fontFamily="monospace">FA = 8</text>
    <text x="76" y="170" fill="#f87171" fontSize="11" fontFamily="monospace">BC = ?</text>
  </svg>
);

/* ─────────────────────────────────────────────
   SECTION DATA
───────────────────────────────────────────── */
type Section = { title: string; icon: string; content: React.ReactNode };

const sections: Section[] = [
  {
    title: "Apa Itu Keliling?",
    icon: "🌍",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Bayangkan kamu sedang berjalan mengelilingi sebuah lapangan sepak bola — mulai dari satu sudut,
          menyusuri setiap sisinya, dan kembali lagi ke titik awal. Jarak total yang kamu tempuh itulah
          yang disebut <strong className="text-cyan-300">keliling</strong>.
        </p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p>
            <strong className="text-cyan-300">Definisi:</strong> Keliling suatu bangun datar adalah{" "}
            <strong>total panjang semua sisi</strong> yang membentuk bangun tersebut.
          </p>
          <p>
            <strong className="text-cyan-300">Rumus Umum:</strong> Untuk bangun apapun, keliling dihitung dengan menjumlahkan seluruh panjang sisinya.
          </p>
          <div className="bg-cyan-950/70 rounded p-3 text-center">
            <BlockMath math="K = \text{sisi}_1 + \text{sisi}_2 + \text{sisi}_3 + \cdots" />
          </div>
        </div>
        <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-yellow-200 text-xs">
          💡 <strong>Analogi Nyata:</strong> Petani yang ingin memasang pagar mengelilingi sawahnya perlu
          mengetahui keliling sawah tersebut agar bisa menghitung berapa meter kawat pagar yang dibutuhkan.
        </div>
        <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
          📌 <strong>Ingat:</strong> Satuan keliling adalah satuan panjang (cm, m, km), bukan satuan luas!
        </blockquote>
      </div>
    ),
  },
  {
    title: "Keliling Segitiga",
    icon: "🔺",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Segitiga punya <strong>tiga sisi</strong>. Kelilingnya diperoleh cukup dengan menjumlahkan
          ketiga sisi tersebut.
        </p>
        <SegitigaSVG />
        <div className="bg-green-950/50 border border-green-700/50 rounded-lg p-4 space-y-2">
          <p className="text-green-300 font-semibold">📐 Rumus Keliling Segitiga</p>
          <div className="bg-green-950/70 rounded p-3 text-center">
            <BlockMath math="K_{\triangle} = a + b + c" />
          </div>
          <p className="text-white/70 text-xs">
            Di mana <InlineMath math="a" />, <InlineMath math="b" />, dan <InlineMath math="c" /> adalah
            panjang masing-masing sisi segitiga.
          </p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs">
          <p className="text-cyan-300 font-semibold">Kasus Khusus:</p>
          <p>• <strong className="text-yellow-300">Segitiga Sama Sisi:</strong> <InlineMath math="K = 3 \times s" /> (ketiga sisi sama panjang)</p>
          <p>• <strong className="text-violet-300">Segitiga Sama Kaki:</strong> <InlineMath math="K = 2p + a" /> (dua sisi kaki panjang <InlineMath math="p" />, alas <InlineMath math="a" />)</p>
          <p>• <strong className="text-orange-300">Segitiga Sembarang:</strong> <InlineMath math="K = a + b + c" /> (semua sisi beda)</p>
        </div>
      </div>
    ),
  },
  {
    title: "Keliling Persegi Panjang & Persegi",
    icon: "▭",
    content: (
      <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
        <div className="space-y-2">
          <p className="text-violet-300 font-semibold">① Persegi Panjang</p>
          <p>
            Persegi panjang memiliki dua pasang sisi yang sama panjang: dua sisi sepanjang{" "}
            <InlineMath math="p" /> (panjang) dan dua sisi sepanjang <InlineMath math="l" /> (lebar).
          </p>
          <PersegiPanjangSVG />
          <div className="bg-violet-950/50 border border-violet-700/50 rounded-lg p-3 text-center">
            <BlockMath math="K_{\text{pp}} = 2 \times (p + l)" />
          </div>
          <blockquote className="border-l-4 border-violet-500 pl-3 text-violet-200 text-xs italic">
            📌 Rumus ini setara dengan <InlineMath math="K = p + l + p + l = 2p + 2l" />.
          </blockquote>
        </div>

        <div className="border-t border-slate-700/50 pt-4 space-y-2">
          <p className="text-green-300 font-semibold">② Persegi</p>
          <p>
            Persegi adalah persegi panjang istimewa di mana <strong>semua sisinya sama panjang</strong>,
            yaitu <InlineMath math="s" />.
          </p>
          <PersegiSVG />
          <div className="bg-green-950/50 border border-green-700/50 rounded-lg p-3 text-center">
            <BlockMath math="K_{\square} = 4 \times s" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
          🔑 <strong className="text-white">Cara cepat bedakan:</strong> Persegi = semua sisi sama.
          Persegi panjang = hanya sisi berhadapan yang sama.
        </div>
      </div>
    ),
  },
  {
    title: "Keliling Jajargenjang, Trapesium, Belah Ketupat & Layang-layang",
    icon: "💎",
    content: (
      <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
        <div className="space-y-2">
          <p className="text-orange-300 font-semibold">① Jajargenjang</p>
          <p>Seperti persegi panjang yang "dimiringkan" — dua pasang sisi berhadapan sama panjang.</p>
          <JajargenjangSVG />
          <div className="bg-orange-950/50 border border-orange-700/40 rounded-lg p-3 text-center">
            <BlockMath math="K_{\text{jj}} = 2 \times (a + b)" />
          </div>
          <p className="text-white/60 text-xs">Di mana <InlineMath math="a" /> = sisi atas/bawah, <InlineMath math="b" /> = sisi kiri/kanan (miring).</p>
        </div>

        <div className="border-t border-slate-700/50 pt-4 space-y-2">
          <p className="text-red-300 font-semibold">② Trapesium</p>
          <p>Trapesium punya satu pasang sisi sejajar (atas dan bawah) dan dua sisi kaki yang bisa berbeda panjang.</p>
          <TrapesiumSVG />
          <div className="bg-red-950/50 border border-red-700/40 rounded-lg p-3 text-center">
            <BlockMath math="K_{\text{trap}} = a + b + c + d" />
          </div>
          <p className="text-white/60 text-xs"><InlineMath math="a" /> = sisi atas, <InlineMath math="b" /> = sisi bawah, <InlineMath math="c" /> dan <InlineMath math="d" /> = dua sisi kaki.</p>
        </div>

        <div className="border-t border-slate-700/50 pt-4 space-y-2">
          <p className="text-cyan-300 font-semibold">③ Belah Ketupat</p>
          <p>Semua empat sisinya sama panjang — seperti persegi yang diputar miring!</p>
          <BelahKetupatSVG />
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-center">
            <BlockMath math="K_{\text{bk}} = 4 \times s" />
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-4 space-y-2">
          <p className="text-violet-300 font-semibold">④ Layang-layang</p>
          <p>Layang-layang punya dua pasang sisi yang berdekatan sama panjang.</p>
          <LayangLayangSVG />
          <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-center">
            <BlockMath math="K_{\text{ll}} = 2 \times (p + q)" />
          </div>
          <p className="text-white/60 text-xs"><InlineMath math="p" /> = panjang sisi pendek (sepasang), <InlineMath math="q" /> = panjang sisi panjang (sepasang).</p>
        </div>
      </div>
    ),
  },
  {
    title: "Tabel Ringkasan Semua Rumus Keliling",
    icon: "📊",
    content: (
      <div className="space-y-3 font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Bangun</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Syarat Khusus</th>
                <th className="px-3 py-2 text-cyan-300">Rumus Keliling</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["🔺 Segitiga", "Semua sisi berbeda", "K = a + b + c"],
                ["🔺 Seg. Sama Sisi", "a = b = c = s", "K = 3s"],
                ["▭ Persegi Panjang", "2 pasang sisi sejajar", "K = 2(p + l)"],
                ["■ Persegi", "Semua sisi = s", "K = 4s"],
                ["⬡ Jajargenjang", "2 pasang sisi sejajar", "K = 2(a + b)"],
                ["⬢ Trapesium", "1 pasang sisi sejajar", "K = a + b + c + d"],
                ["◆ Belah Ketupat", "Semua sisi = s", "K = 4s"],
                ["🪁 Layang-layang", "2 pasang sisi berdekatan", "K = 2(p + q)"],
              ].map(([bangun, syarat, rumus], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{bangun}</td>
                  <td className="px-3 py-2 text-white/60 border-r border-slate-700">{syarat}</td>
                  <td className="px-3 py-2 text-yellow-300 font-mono">{rumus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🔑 <strong className="text-white">Kunci Mudah Mengingat:</strong></p>
          <p>• Kalau <strong className="text-yellow-300">semua sisi sama</strong> → kalikan jumlah sisi × panjang sisi (persegi: ×4, segitiga sama sisi: ×3)</p>
          <p>• Kalau ada <strong className="text-violet-300">dua pasang sisi sama</strong> → pakai rumus <InlineMath math="2 \times (\cdots + \cdots)" /></p>
          <p>• Kalau <strong className="text-red-300">semua sisi berbeda</strong> → jumlahkan semua sisi satu per satu</p>
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
          Sebuah segitiga sama kaki <InlineMath math="ABC" /> memiliki dua sisi kaki masing-masing
          sepanjang <InlineMath math="13 \text{ cm}" /> dan alas <InlineMath math="BC = 10 \text{ cm}" />.
        </p>
        <ContohMudahSVG />
        <p>Hitunglah keliling segitiga tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-green-400">Langkah 1 — Identifikasi semua sisi:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
          <p>• Sisi kaki <InlineMath math="AB = AC = 13 \text{ cm}" /> (sama kaki, jadi dua sisi ini sama)</p>
          <p>• Alas <InlineMath math="BC = 10 \text{ cm}" /></p>
        </div>
        <p className="text-white/80"><strong className="text-green-400">Langkah 2 — Gunakan rumus keliling segitiga:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="K = AB + BC + AC" />
          <BlockMath math="K = 13 + 10 + 13" />
          <BlockMath math="K = 36 \text{ cm}" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Jawaban: Keliling segitiga <InlineMath math="= 36 \text{ cm}" /></p>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          💡 Cara cepat: Segitiga sama kaki bisa ditulis <InlineMath math="K = 2 \times 13 + 10 = 26 + 10 = 36 \text{ cm}" />
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
          Sebuah kolam renang berbentuk persegi panjang memiliki keliling <InlineMath math="70 \text{ m}" />.
          Jika lebar kolam adalah <InlineMath math="12 \text{ m}" />, berapakah panjang kolam tersebut?
        </p>
        <ContohSedangSVG />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 1 — Tulis yang diketahui dan ditanya:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
          <p>• Keliling <InlineMath math="K = 70 \text{ m}" /></p>
          <p>• Lebar <InlineMath math="l = 12 \text{ m}" /></p>
          <p>• Ditanya: panjang <InlineMath math="p = ?" /></p>
        </div>
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 2 — Gunakan rumus keliling persegi panjang:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="K = 2 \times (p + l)" />
          <BlockMath math="70 = 2 \times (p + 12)" />
        </div>
        <p className="text-white/80"><strong className="text-yellow-400">Langkah 3 — Selesaikan persamaan:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="p + 12 = \frac{70}{2} = 35" />
          <BlockMath math="p = 35 - 12 = 23 \text{ m}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">✅ Jawaban: Panjang kolam <InlineMath math="= 23 \text{ m}" /></p>
        </div>
        <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
          ✅ Cek: <InlineMath math="K = 2 \times (23 + 12) = 2 \times 35 = 70 \text{ m}" /> ✓
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
          Perhatikan bangun datar berbentuk huruf "L" berikut ini (bangun FABCDE).
          Diketahui:
        </p>
        <ContohSulitSVG />
        <ul className="list-disc list-inside text-white/80 space-y-1 ml-2 text-xs">
          <li><InlineMath math="FA = 8 \text{ cm}" /> (sisi kiri, vertikal)</li>
          <li><InlineMath math="AB = 13 \text{ cm}" /> (sisi bawah, horizontal)</li>
          <li><InlineMath math="FE = 9 \text{ cm}" /> (sisi atas, horizontal)</li>
          <li><InlineMath math="ED = 5 \text{ cm}" /> (sisi kanan atas, vertikal)</li>
          <li><InlineMath math="DC = 3 \text{ cm}" /> (sisi tonjolan, horizontal)</li>
        </ul>
        <p>Tentukan panjang sisi <InlineMath math="BC" /> (sisi kanan bawah) dan keliling bangun!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-red-400">Langkah 1 — Cari sisi BC yang belum diketahui:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-2">
          <p>Perhatikan arah vertikal (atas ke bawah): Sisi kiri <InlineMath math="FA = 8 \text{ cm}" /> adalah tinggi total bangun.</p>
          <p>Sisi kanan terbagi menjadi dua: <InlineMath math="ED" /> (bagian atas) dan <InlineMath math="BC" /> (bagian bawah).</p>
          <BlockMath math="FA = ED + BC" />
          <BlockMath math="8 = 5 + BC \Rightarrow BC = 3 \text{ cm}" />
        </div>

        <p className="text-white/80"><strong className="text-red-400">Langkah 2 — Verifikasi sisi horizontal (opsional):</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
          <p>Arah horizontal: <InlineMath math="AB = 13 \text{ cm}" /> (bawah) dan <InlineMath math="FE + DC = 9 + 3 = 12 \text{ cm}" /> ??</p>
          <p className="text-yellow-300">⚠️ Selisih ini wajar karena bangun berbentuk L, bukan persegi panjang penuh.</p>
          <p>Selisih horizontal: <InlineMath math="AB - FE = 13 - 9 = 4 \text{ cm}" /> = lebar lekukan = <InlineMath math="DC = ... " /></p>
          <p className="text-cyan-300">Sesuaikan: <InlineMath math="DC" /> sebenarnya adalah <InlineMath math="AB - FE = 13 - 9 = 4 \text{ cm}" /></p>
        </div>

        <p className="text-white/80"><strong className="text-red-400">Langkah 3 — Jumlahkan semua sisi:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-2">Semua sisi bangun L: FA, AB, BC, CD, DE, EF</p>
          <BlockMath math="K = FA + AB + BC + CD + DE + EF" />
          <BlockMath math="K = 8 + 13 + 3 + 4 + 5 + 9" />
          <BlockMath math="K = 42 \text{ cm}" />
        </div>

        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Panjang <InlineMath math="BC = 3 \text{ cm}" /></p>
          <p className="text-white/80">• Keliling bangun L <InlineMath math="= 42 \text{ cm}" /></p>
        </div>

        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          🔑 <strong>Trik bangun tak beraturan:</strong> Cari sisi yang belum diketahui menggunakan
          hubungan geometris (sisi-sisi sejajar yang berhubungan), lalu jumlahkan <strong>semua</strong> sisi keliling.
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
const KelilingSegitigaSegiempatPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        {/* Header */}
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center leading-tight">
          KELILING SEGITIGA
        </h1>
        <h2 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center leading-tight">
          DAN SEGIEMPAT
        </h2>
        <p className="text-white/50 text-xs text-center mb-8 font-body">
          Kelas 7 · Segitiga dan Segiempat
        </p>

        {/* Intro Card */}
        <div className="bg-card/60 border border-border rounded-xl p-4 mb-6 text-sm font-body text-white/75 leading-relaxed">
          <p>
            Dari sawah yang berbentuk persegi panjang hingga taman yang berbentuk segitiga —
            setiap kali kita ingin tahu <strong className="text-cyan-300">seberapa jauh mengelilingi</strong> sebuah
            bangun datar, kita sedang menghitung <strong className="text-yellow-300">kelilingnya</strong>.
            Di sini kita akan belajar cara menghitung keliling berbagai bangun datar secara sistematis dan cepat!
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

export default KelilingSegitigaSegiempatPage;
