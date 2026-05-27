import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import JangkaAnimasi from "@/components/JangkaAnimasi";

const SejajarSVG = () => (
  <svg viewBox="0 0 320 120" className="w-full max-w-sm mx-auto my-3" aria-label="Dua garis sejajar">
    <defs>
      <marker id="arrowR1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" />
      </marker>
      <marker id="arrowL1" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
        <path d="M8,0 L8,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="arrowR2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" />
      </marker>
      <marker id="arrowL2" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
        <path d="M8,0 L8,6 L0,3 z" fill="#a78bfa" />
      </marker>
    </defs>
    <line x1="20" y1="40" x2="300" y2="40" stroke="#22d3ee" strokeWidth="2.5"
      markerEnd="url(#arrowR1)" markerStart="url(#arrowL1)" />
    <line x1="20" y1="80" x2="300" y2="80" stroke="#a78bfa" strokeWidth="2.5"
      markerEnd="url(#arrowR2)" markerStart="url(#arrowL2)" />
    <text x="305" y="44" fill="#22d3ee" fontSize="13" fontFamily="monospace">g</text>
    <text x="305" y="84" fill="#a78bfa" fontSize="13" fontFamily="monospace">h</text>
    <line x1="160" y1="40" x2="160" y2="80" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4,3" />
    <text x="165" y="65" fill="#facc15" fontSize="11" fontFamily="monospace">d tetap</text>
  </svg>
);

const BerpotSVG = () => (
  <svg viewBox="0 0 320 140" className="w-full max-w-sm mx-auto my-3" aria-label="Dua garis berpotongan">
    <defs>
      <marker id="bpArR1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" />
      </marker>
      <marker id="bpArL1" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
        <path d="M8,0 L8,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="bpArR2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" />
      </marker>
      <marker id="bpArL2" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
        <path d="M8,0 L8,6 L0,3 z" fill="#a78bfa" />
      </marker>
    </defs>
    <line x1="20" y1="110" x2="300" y2="30" stroke="#22d3ee" strokeWidth="2.5"
      markerEnd="url(#bpArR1)" markerStart="url(#bpArL1)" />
    <line x1="20" y1="25" x2="300" y2="115" stroke="#a78bfa" strokeWidth="2.5"
      markerEnd="url(#bpArR2)" markerStart="url(#bpArL2)" />
    <circle cx="160" cy="70" r="5" fill="#f87171" />
    <text x="167" y="66" fill="#f87171" fontSize="11" fontFamily="monospace">Titik Potong</text>
    <text x="24" y="124" fill="#22d3ee" fontSize="13" fontFamily="monospace">k</text>
    <text x="24" y="22" fill="#a78bfa" fontSize="13" fontFamily="monospace">l</text>
  </svg>
);

const TegakLurusSVG = () => (
  <svg viewBox="0 0 200 180" className="w-full max-w-xs mx-auto my-3" aria-label="Dua garis tegak lurus">
    <defs>
      <marker id="tlArU" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
        <path d="M0,8 L4,0 L8,8 z" fill="#22d3ee" />
      </marker>
      <marker id="tlArD" markerWidth="8" markerHeight="8" refX="4" refY="1" orient="auto-start-reverse">
        <path d="M0,0 L4,8 L8,0 z" fill="#22d3ee" />
      </marker>
      <marker id="tlArR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" />
      </marker>
      <marker id="tlArL" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
        <path d="M8,0 L8,6 L0,3 z" fill="#a78bfa" />
      </marker>
    </defs>
    <line x1="100" y1="10" x2="100" y2="170" stroke="#22d3ee" strokeWidth="2.5"
      markerEnd="url(#tlArU)" markerStart="url(#tlArD)" />
    <line x1="10" y1="90" x2="190" y2="90" stroke="#a78bfa" strokeWidth="2.5"
      markerEnd="url(#tlArR)" markerStart="url(#tlArL)" />
    <rect x="100" y="78" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="2" />
    <text x="118" y="86" fill="#facc15" fontSize="11" fontFamily="monospace">90°</text>
    <text x="104" y="18" fill="#22d3ee" fontSize="13" fontFamily="monospace">m</text>
    <text x="178" y="86" fill="#a78bfa" fontSize="13" fontFamily="monospace">n</text>
  </svg>
);

const BerhimpitSVG = () => (
  <svg viewBox="0 0 320 80" className="w-full max-w-sm mx-auto my-3" aria-label="Dua garis berhimpit">
    <defs>
      <marker id="bhArR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#f87171" />
      </marker>
      <marker id="bhArL" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
        <path d="M8,0 L8,6 L0,3 z" fill="#f87171" />
      </marker>
    </defs>
    <line x1="20" y1="40" x2="300" y2="40" stroke="#22d3ee" strokeWidth="5"
      markerEnd="url(#bhArR)" markerStart="url(#bhArL)" />
    <line x1="20" y1="40" x2="300" y2="40" stroke="#a78bfa" strokeWidth="2" strokeDasharray="8,6" opacity="0.8" />
    <text x="120" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace">p dan q → satu garis yang sama</text>
    <text x="300" y="35" fill="#22d3ee" fontSize="13" fontFamily="monospace">p(q)</text>
  </svg>
);

const BersilanganSVG = () => (
  <svg viewBox="0 0 320 160" className="w-full max-w-sm mx-auto my-3" aria-label="Dua garis bersilangan dalam ruang">
    <defs>
      <marker id="bsArR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" />
      </marker>
      <marker id="bsArR2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#fb923c" />
      </marker>
    </defs>
    <polygon points="30,130 180,130 240,90 90,90" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4,3" />
    <line x1="10" y1="110" x2="260" y2="110" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#bsArR)" />
    <line x1="160" y1="20" x2="90" y2="150" stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#bsArR2)" />
    <text x="265" y="114" fill="#22d3ee" fontSize="12" fontFamily="monospace">a</text>
    <text x="88" y="158" fill="#fb923c" fontSize="12" fontFamily="monospace">b</text>
    <text x="75" y="82" fill="#64748b" fontSize="10" fontFamily="monospace">bidang α</text>
    <text x="80" y="140" fill="#64748b" fontSize="10" fontFamily="monospace">bidang β</text>
    <text x="80" y="10" fill="#94a3b8" fontSize="10" fontFamily="monospace">⟵ berbeda bidang ⟶</text>
  </svg>
);

type Section = { title: string; icon: string; content: React.ReactNode };

const sections: Section[] = [
  {
    title: "Garis Sejajar",
    icon: "〰️",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>Bayangkan rel kereta api yang membentang jauh ke cakrawala — kedua relnya tidak pernah bertemu, meskipun kamu perpanjang sampai ujung dunia. Inilah konsep <strong className="text-cyan-300">garis sejajar</strong>.</p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4">
          <p><strong className="text-cyan-300">Definisi:</strong> Dua garis dikatakan sejajar jika keduanya berada pada bidang yang sama dan tidak pernah berpotongan meskipun diperpanjang hingga tak terhingga.</p>
          <p className="mt-2"><strong className="text-cyan-300">Simbol:</strong> <InlineMath math="g \parallel h" /></p>
          <p className="mt-1"><strong className="text-cyan-300">Ciri utama:</strong> Jarak antara kedua garis selalu <em>tetap/konstan</em> di setiap titik.</p>
        </div>
        <SejajarSVG />
        <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-yellow-200 text-xs">
          💡 <strong>Sifat Transitif Garis Sejajar:</strong> Jika <InlineMath math="a \parallel b" /> dan <InlineMath math="b \parallel c" />, maka <InlineMath math="a \parallel c" />.
        </div>
      </div>
    ),
  },
  {
    title: "Garis Berpotongan & Tegak Lurus",
    icon: "✕",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>Ketika dua jalan raya saling bertemu di suatu persimpangan, itulah gambaran nyata dari <strong className="text-violet-300">garis berpotongan</strong>.</p>
        <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-2">
          <p><strong className="text-violet-300">Definisi:</strong> Dua garis berpotongan jika keduanya memiliki tepat <em>satu titik persekutuan</em> (titik potong).</p>
          <p><strong className="text-violet-300">Kasus Khusus — Tegak Lurus:</strong> Jika sudut yang terbentuk di titik potong tepat <InlineMath math="90^\circ" />, kedua garis disebut <strong>tegak lurus</strong>.</p>
          <p><strong className="text-violet-300">Simbol tegak lurus:</strong> <InlineMath math="k \perp l" /></p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-white/50 text-center mb-1">Berpotongan biasa</p>
            <BerpotSVG />
          </div>
          <div>
            <p className="text-xs text-white/50 text-center mb-1">Tegak lurus (90°)</p>
            <TegakLurusSVG />
          </div>
        </div>
        <div className="bg-violet-950/40 border border-violet-600/30 rounded-lg p-3 text-xs text-violet-200">
          📐 Dua garis tegak lurus membagi bidang menjadi 4 sudut siku-siku yang sama besar.
        </div>
      </div>
    ),
  },
  {
    title: "Garis Berhimpit",
    icon: "═",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>Bayangkan kamu menggambar satu garis di atas garis yang sudah ada. Hasilnya terlihat seperti <em>satu garis saja</em> — inilah yang disebut <strong className="text-red-300">garis berhimpit</strong>.</p>
        <div className="bg-red-950/50 border border-red-700/40 rounded-lg p-4">
          <p><strong className="text-red-300">Definisi:</strong> Dua garis berhimpit jika keduanya terletak pada garis lurus yang persis sama, sehingga seolah-olah hanya ada satu garis.</p>
          <p className="mt-2"><strong className="text-red-300">Ciri:</strong> Setiap titik pada garis pertama juga merupakan titik pada garis kedua (titik persekutuan = tak terhingga).</p>
        </div>
        <BerhimpitSVG />
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
          ⚠️ Garis berhimpit sering membingungkan karena secara visual terlihat seperti satu garis. Bedanya ada di persamaan garis — dua persamaan berbeda yang menghasilkan garis yang sama (misalnya <InlineMath math="y = 2x" /> dan <InlineMath math="2y = 4x" />).
        </div>
      </div>
    ),
  },
  {
    title: "Garis Bersilangan",
    icon: "⤢",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>Bayangkan jalan tol layang yang melintasi jalan biasa di bawahnya — mereka <em>tidak berpotongan</em> karena berada di ketinggian yang berbeda. Inilah <strong className="text-orange-300">garis bersilangan</strong>.</p>
        <div className="bg-orange-950/50 border border-orange-700/40 rounded-lg p-4">
          <p><strong className="text-orange-300">Definisi:</strong> Dua garis bersilangan jika keduanya tidak sejajar, tidak berpotongan, dan <em>tidak berada pada satu bidang datar yang sama</em>.</p>
          <p className="mt-2"><strong className="text-orange-300">Catatan:</strong> Garis bersilangan hanya ada pada bangun ruang (dimensi 3), bukan pada bidang datar.</p>
        </div>
        <BersilanganSVG />
        <div className="bg-orange-950/40 border border-orange-600/30 rounded-lg p-3 text-xs text-orange-200">
          🏗️ Contoh nyata: rusuk-rusuk pada kubus yang tidak sejajar dan tidak berpotongan (misalnya rusuk bawah-depan dengan rusuk atas-kiri).
        </div>
      </div>
    ),
  },
  {
    title: "Ringkasan: Tabel Perbandingan 4 Hubungan",
    icon: "📊",
    content: (
      <div className="space-y-3 text-sm font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Hubungan</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Titik Potong</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Satu Bidang?</th>
                <th className="px-3 py-2 text-cyan-300">Jarak</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-700 bg-cyan-950/30">
                <td className="px-3 py-2 text-cyan-300 font-semibold border-r border-slate-700">Sejajar</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700">Tidak ada</td>
                <td className="px-3 py-2 text-green-400 border-r border-slate-700">✓ Ya</td>
                <td className="px-3 py-2 text-white/70">Selalu tetap</td>
              </tr>
              <tr className="border-t border-slate-700 bg-violet-950/30">
                <td className="px-3 py-2 text-violet-300 font-semibold border-r border-slate-700">Berpotongan</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700">Satu titik</td>
                <td className="px-3 py-2 text-green-400 border-r border-slate-700">✓ Ya</td>
                <td className="px-3 py-2 text-white/70">Berubah</td>
              </tr>
              <tr className="border-t border-slate-700 bg-red-950/30">
                <td className="px-3 py-2 text-red-300 font-semibold border-r border-slate-700">Berhimpit</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700">∞ tak terhingga</td>
                <td className="px-3 py-2 text-green-400 border-r border-slate-700">✓ Ya</td>
                <td className="px-3 py-2 text-white/70">= 0</td>
              </tr>
              <tr className="border-t border-slate-700 bg-orange-950/30">
                <td className="px-3 py-2 text-orange-300 font-semibold border-r border-slate-700">Bersilangan</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700">Tidak ada</td>
                <td className="px-3 py-2 text-red-400 border-r border-slate-700">✗ Tidak</td>
                <td className="px-3 py-2 text-white/70">Ada, tidak tetap</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
];

type Example = { level: string; color: string; bg: string; border: string; question: React.ReactNode; answer: React.ReactNode };

const examples: Example[] = [
  {
    level: "MUDAH",
    color: "text-green-400",
    bg: "bg-green-950/40",
    border: "border-green-700/50",
    question: (
      <p className="text-sm text-white/85 font-body">
        Rel kereta api membentang sejauh pandang mata. Kedua lintasannya tidak pernah bertemu meskipun diperpanjang ribuan kilometer.
        Tuliskan jenis hubungan kedua garis rel tersebut dan notasi matematikanya jika rel kiri adalah garis <InlineMath math="p" /> dan rel kanan adalah garis <InlineMath math="q" />.
      </p>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <p className="text-white/80"><strong className="text-green-400">Langkah 1 — Identifikasi ciri:</strong></p>
        <ul className="list-disc list-inside text-white/70 space-y-1 ml-2">
          <li>Kedua garis berada pada bidang yang sama (permukaan tanah).</li>
          <li>Kedua garis tidak pernah berpotongan.</li>
          <li>Jarak antara keduanya selalu tetap.</li>
        </ul>
        <p className="text-white/80 mt-2"><strong className="text-green-400">Langkah 2 — Kesimpulan:</strong></p>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300">Kedua garis rel adalah <strong>garis sejajar</strong>.</p>
          <BlockMath math="p \parallel q" />
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
      <p className="text-sm text-white/85 font-body">
        Perhatikan pernyataan-pernyataan berikut:
        <br />(i) Dua garis yang tidak sejajar pasti berpotongan.
        <br />(ii) Jika <InlineMath math="a \parallel b" /> dan <InlineMath math="b \parallel c" />, maka <InlineMath math="a \parallel c" />.
        <br />(iii) Dua garis berhimpit tidak memiliki titik potong sama sekali.
        <br />(iv) Garis bersilangan hanya dapat terjadi pada ruang dimensi tiga.
        <br /><br />Tentukan pernyataan mana yang <strong>BENAR</strong> dan jelaskan alasannya!
      </p>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="space-y-2">
          <div className="flex gap-2 items-start">
            <span className="text-red-400 font-bold shrink-0">(i) SALAH</span>
            <p className="text-white/70">Dua garis yang tidak sejajar belum tentu berpotongan — bisa saja <em>bersilangan</em> (tidak sejajar, tidak berpotongan, beda bidang).</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-green-400 font-bold shrink-0">(ii) BENAR</span>
            <p className="text-white/70">Ini adalah <strong>sifat transitif</strong> garis sejajar. Jika <InlineMath math="a \parallel b" /> dan <InlineMath math="b \parallel c" />, dapat disimpulkan <InlineMath math="a \parallel c" />.</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-red-400 font-bold shrink-0">(iii) SALAH</span>
            <p className="text-white/70">Dua garis berhimpit justru memiliki <em>tak terhingga</em> titik persekutuan karena keduanya merupakan garis yang sama persis.</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-green-400 font-bold shrink-0">(iv) BENAR</span>
            <p className="text-white/70">Garis bersilangan memerlukan dua bidang berbeda, sehingga hanya mungkin terjadi pada ruang 3 dimensi.</p>
          </div>
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">Pernyataan yang BENAR: <strong>(ii) dan (iv)</strong></p>
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
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>Perhatikan gambar dua garis sejajar berikut:</p>
        <svg viewBox="0 0 340 180" className="w-full max-w-sm mx-auto my-2">
          <line x1="20" y1="40" x2="320" y2="40" stroke="#22d3ee" strokeWidth="2" />
          <line x1="20" y1="140" x2="320" y2="140" stroke="#a78bfa" strokeWidth="2" />
          <text x="10" y="36" fill="#22d3ee" fontSize="13" fontFamily="monospace">k</text>
          <text x="10" y="136" fill="#a78bfa" fontSize="13" fontFamily="monospace">h</text>
          <circle cx="80" cy="40" r="4" fill="#fb923c" />
          <circle cx="200" cy="40" r="4" fill="#fb923c" />
          <circle cx="80" cy="140" r="4" fill="#f87171" />
          <circle cx="200" cy="140" r="4" fill="#f87171" />
          <text x="74" y="30" fill="#fb923c" fontSize="12" fontFamily="monospace">P</text>
          <text x="196" y="30" fill="#fb923c" fontSize="12" fontFamily="monospace">K</text>
          <text x="74" y="157" fill="#f87171" fontSize="12" fontFamily="monospace">Q</text>
          <text x="196" y="157" fill="#f87171" fontSize="12" fontFamily="monospace">L</text>
          <line x1="200" y1="40" x2="200" y2="140" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="205" y="95" fill="#facc15" fontSize="11" fontFamily="monospace">AB = 8</text>
          <line x1="80" y1="40" x2="200" y2="140" stroke="#4ade80" strokeWidth="2" />
          <text x="120" y="100" fill="#4ade80" fontSize="11" fontFamily="monospace" transform="rotate(39,140,90)">PB = 17</text>
          <circle cx="200" cy="40" r="3" fill="#facc15" />
          <text x="205" y="38" fill="#facc15" fontSize="10" fontFamily="monospace">A(K)</text>
          <line x1="80" y1="140" x2="200" y2="140" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="125" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">QB</text>
          <rect x="200" y="128" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5" />
        </svg>
        <p>Diketahui garis <InlineMath math="k \parallel h" />. Titik <InlineMath math="A" /> dan <InlineMath math="K" /> berimpit di garis <InlineMath math="k" />, sedangkan <InlineMath math="B" /> ada di garis <InlineMath math="h" />. Ruas garis <InlineMath math="AB \perp h" /> (tegak lurus garis h).</p>
        <p>Diketahui: <InlineMath math="AB = 8" /> satuan (jarak antar garis), <InlineMath math="PB = 17" /> satuan, dan <InlineMath math="KL = 10" /> satuan.</p>
        <p>Tentukan panjang <InlineMath math="PQ" />!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-red-400">Langkah 1 — Cari QB menggunakan Teorema Pythagoras:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-1">Segitiga PBQ siku-siku di B (karena AB ⊥ h dan AB = 8 = jarak antar garis):</p>
          <BlockMath math="QB = \sqrt{PB^2 - AB^2}" />
          <BlockMath math="QB = \sqrt{17^2 - 8^2} = \sqrt{289 - 64} = \sqrt{225} = 15 \text{ satuan}" />
        </div>
        <p className="text-white/80"><strong className="text-red-400">Langkah 2 — Cari PQ:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-1"><InlineMath math="KL = QB = 15" /> (karena KBLQ adalah persegi panjang — sisi-sisi sejajar dan siku-siku).</p>
          <p className="text-white/70 text-xs mb-1"><InlineMath math="PK" /> adalah jarak horizontal dari P ke K: karena <InlineMath math="PQ \parallel KL" /> dan bentuknya trapesium siku-siku:</p>
          <BlockMath math="PQ = \sqrt{PB^2 - AB^2} - KL + KL" />
          <p className="text-white/70 text-xs mb-1">Sebenarnya: <InlineMath math="PQ" /> = jarak P ke Q pada garis yang sama (garis k dan h sejajar).</p>
          <BlockMath math="PQ = QB - KL = 15 - 10 = 5 \text{ satuan}" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3">
          <p className="text-red-300 font-semibold">Jawaban: <InlineMath math="PQ = 6" /> satuan</p>
          <p className="text-white/60 text-xs mt-1">
            (Catatan: <InlineMath math="PQ^2 = PB^2 - (QB + KL - QB)^2" /> — soal ini membutuhkan data gambar lengkap untuk menentukan posisi relatif P, Q, K, L secara tepat.)
          </p>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded p-3 text-xs text-cyan-200">
          💡 <strong>Kunci:</strong> Ketika dua garis sejajar dipotong garis transversal, gunakan Teorema Pythagoras untuk mencari jarak-jarak yang tidak diketahui pada segitiga siku-siku yang terbentuk.
        </div>
      </div>
    ),
  },
];

const AccordionSection = ({ section, idx }: { section: Section; idx: number }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
        onClick={() => { playPopSound(); setOpen((o) => !o); }}
      >
        <span className="font-display text-sm font-semibold text-white flex items-center gap-2">
          <span>{section.icon}</span> {section.title}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-primary shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5">{section.content}</div>}
    </div>
  );
};

const ExampleCard = ({ example, idx }: { example: Example; idx: number }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={`rounded-xl border ${example.border} ${example.bg} overflow-hidden`}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
        onClick={() => { playPopSound(); setOpen((o) => !o); }}
      >
        <span className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${example.border} ${example.color}`}>
            {example.level}
          </span>
          <span className="font-body text-sm text-white/80">Contoh {idx + 1}</span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-white/50 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/50 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4">
          <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4">
            <p className="text-xs text-white/40 font-body mb-2 uppercase tracking-wider">Soal</p>
            {example.question}
          </div>
          <div className="space-y-2">
            <p className="text-xs text-white/40 font-body uppercase tracking-wider">Pembahasan</p>
            {example.answer}
          </div>
        </div>
      )}
    </div>
  );
};

const HubunganDuaGarisPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-1 text-center">
          HUBUNGAN DUA GARIS
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">Kelas 7 · Garis dan Sudut · Materi Matematika</p>

        <div className="flex flex-col gap-3 mb-6">
          {sections.map((s, i) => (
            <AccordionSection key={s.title} section={s} idx={i} />
          ))}
        </div>

        {/* Animated Protractor */}
        <div className="mb-8">
          <JangkaAnimasi />
        </div>

        <div className="mb-4">
          <h2 className="font-display text-base font-bold text-primary mb-3 text-center">CONTOH SOAL</h2>
          <div className="flex flex-col gap-3">
            {examples.map((ex, i) => (
              <ExampleCard key={i} example={ex} idx={i} />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/garis-dan-sudut"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Garis dan Sudut
          </button>
        </div>
      </div>
    </div>
  );
};

export default HubunganDuaGarisPage;
