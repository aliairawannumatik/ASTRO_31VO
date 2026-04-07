import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import ProtractorAnimation from "@/components/ProtractorAnimation";

const SudutDasarSVG = () => (
  <svg viewBox="0 0 320 160" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="sdArR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" />
      </marker>
      <marker id="sdArR2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" />
      </marker>
    </defs>
    <circle cx="80" cy="120" r="3" fill="#facc15" />
    <line x1="80" y1="120" x2="280" y2="120" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#sdArR)" />
    <line x1="80" y1="120" x2="200" y2="30" stroke="#a78bfa" strokeWidth="2.5" markerEnd="url(#sdArR2)" />
    <path d="M120,120 A40,40 0 0,0 104,88" fill="none" stroke="#facc15" strokeWidth="1.8" />
    <text x="128" y="108" fill="#facc15" fontSize="13" fontFamily="monospace">α</text>
    <text x="283" y="124" fill="#22d3ee" fontSize="12" fontFamily="monospace">sinar 1</text>
    <text x="203" y="28" fill="#a78bfa" fontSize="12" fontFamily="monospace">sinar 2</text>
    <circle cx="80" cy="120" r="3" fill="#facc15" />
    <text x="65" y="138" fill="#facc15" fontSize="11" fontFamily="monospace">O</text>
    <text x="100" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">Sudut α dibentuk oleh 2 sinar dari titik O</text>
  </svg>
);

const BertolakSVG = () => (
  <svg viewBox="0 0 320 220" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="btArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
      </marker>
      <marker id="btArL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="btArU" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#fb923c" />
      </marker>
      <marker id="btArD" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#fb923c" />
      </marker>
    </defs>
    <line x1="20" y1="110" x2="300" y2="110" stroke="#22d3ee" strokeWidth="2.5"
      markerEnd="url(#btArR)" markerStart="url(#btArL)" />
    <line x1="160" y1="15" x2="160" y2="205" stroke="#fb923c" strokeWidth="2.5"
      markerEnd="url(#btArU)" markerStart="url(#btArD)" />
    <circle cx="160" cy="110" r="4" fill="#facc15" />
    <path d="M185,110 A25,25 0 0,0 160,85" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.5" />
    <text x="188" y="100" fill="#facc15" fontSize="13" fontFamily="monospace">∠1</text>
    <path d="M135,110 A25,25 0 0,0 160,135" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.5" />
    <text x="120" y="135" fill="#facc15" fontSize="13" fontFamily="monospace">∠3</text>
    <path d="M160,85 A25,25 0 0,0 135,110" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="120" y="100" fill="#a78bfa" fontSize="13" fontFamily="monospace">∠2</text>
    <path d="M160,135 A25,25 0 0,0 185,110" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="167" y="148" fill="#a78bfa" fontSize="13" fontFamily="monospace">∠4</text>
    <text x="10" y="106" fill="#22d3ee" fontSize="12" fontFamily="monospace">a</text>
    <text x="164" y="13" fill="#fb923c" fontSize="12" fontFamily="monospace">b</text>
    <text x="30" y="200" fill="#94a3b8" fontSize="10" fontFamily="monospace">∠1 = ∠3 (bertolak belakang)  |  ∠2 = ∠4 (bertolak belakang)</text>
  </svg>
);

const PelurusSVG = () => (
  <svg viewBox="0 0 320 130" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="plArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
      </marker>
      <marker id="plArL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="plArU" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#fb923c" />
      </marker>
    </defs>
    <line x1="20" y1="80" x2="300" y2="80" stroke="#22d3ee" strokeWidth="2.5"
      markerEnd="url(#plArR)" markerStart="url(#plArL)" />
    <line x1="160" y1="80" x2="230" y2="20" stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#plArU)" />
    <circle cx="160" cy="80" r="4" fill="#facc15" />
    <path d="M200,80 A40,40 0 0,0 185,48" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.8" />
    <text x="205" y="68" fill="#facc15" fontSize="12" fontFamily="monospace">α</text>
    <path d="M185,48 A40,40 0 0,0 120,80" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1.8" />
    <text x="125" y="58" fill="#a78bfa" fontSize="12" fontFamily="monospace">β</text>
    <text x="55" y="105" fill="#e2e8f0" fontSize="11" fontFamily="monospace">α + β = 180°  →  saling berpelurus</text>
  </svg>
);

const PenyikuSVG = () => (
  <svg viewBox="0 0 220 180" className="w-full max-w-xs mx-auto my-3">
    <defs>
      <marker id="pyArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
      </marker>
      <marker id="pyArU" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#4ade80" />
      </marker>
      <marker id="pyArUo" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#fb923c" />
      </marker>
    </defs>
    <line x1="40" y1="140" x2="190" y2="140" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#pyArR)" />
    <line x1="40" y1="140" x2="40" y2="20" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#pyArU)" />
    <line x1="40" y1="140" x2="155" y2="50" stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#pyArUo)" />
    <rect x="40" y="128" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
    <path d="M80,140 A40,40 0 0,0 64,107" fill="rgba(250,204,21,0.2)" stroke="#facc15" strokeWidth="1.8" />
    <text x="83" y="128" fill="#facc15" fontSize="12" fontFamily="monospace">α</text>
    <path d="M64,107 A40,40 0 0,0 40,100" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" strokeWidth="1.8" />
    <text x="42" y="102" fill="#a78bfa" fontSize="12" fontFamily="monospace">β</text>
    <text x="30" y="165" fill="#e2e8f0" fontSize="10" fontFamily="monospace">α + β = 90°  →  saling berpenyiku</text>
  </svg>
);

const BuktiBertolakSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto my-2">
    <defs>
      <marker id="bbArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
      </marker>
      <marker id="bbArL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="bbArD" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#fb923c" />
      </marker>
      <marker id="bbArU" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
        <path d="M7,0 L7,6 L0,3 z" fill="#fb923c" />
      </marker>
    </defs>
    <line x1="20" y1="90" x2="280" y2="90" stroke="#22d3ee" strokeWidth="2.5"
      markerEnd="url(#bbArR)" markerStart="url(#bbArL)" />
    <line x1="150" y1="170" x2="150" y2="10" stroke="#fb923c" strokeWidth="2.5"
      markerEnd="url(#bbArD)" markerStart="url(#bbArU)" />
    <circle cx="150" cy="90" r="4" fill="#facc15" />
    <text x="10" y="86" fill="#22d3ee" fontSize="12" fontFamily="monospace">a</text>
    <text x="154" y="14" fill="#fb923c" fontSize="12" fontFamily="monospace">b</text>
    <path d="M175,90 A25,25 0 0,0 150,65" fill="rgba(250,204,21,0.2)" stroke="#facc15" strokeWidth="1.5" />
    <text x="177" y="80" fill="#facc15" fontSize="13" fontFamily="monospace">∠1</text>
    <path d="M125,90 A25,25 0 0,0 150,115" fill="rgba(250,204,21,0.2)" stroke="#facc15" strokeWidth="1.5" />
    <text x="108" y="118" fill="#facc15" fontSize="13" fontFamily="monospace">∠3</text>
    <path d="M150,65 A25,25 0 0,0 125,90" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="107" y="76" fill="#a78bfa" fontSize="13" fontFamily="monospace">∠2</text>
    <path d="M150,115 A25,25 0 0,0 175,90" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="158" y="118" fill="#a78bfa" fontSize="13" fontFamily="monospace">∠4</text>
  </svg>
);

type Section = { title: string; icon: string; content: React.ReactNode };

const sections: Section[] = [
  {
    title: "Mengenal Sudut: Dari Mana Asalnya?",
    icon: "📐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>Coba bayangkan dua sinar cahaya yang keluar dari satu titik lampu — sudut adalah <strong className="text-cyan-300">daerah yang terbentuk di antara dua sinar garis yang bertemu di satu titik pangkal</strong>. Semakin lebar bukaannya, semakin besar sudutnya!</p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-1">
          <p><strong className="text-cyan-300">Sudut 0°</strong> — kedua sinar garis saling berhimpit (nol jarak).</p>
          <p><strong className="text-cyan-300">Sudut 90°</strong> — sudut siku-siku, membentuk huruf L.</p>
          <p><strong className="text-cyan-300">Sudut 180°</strong> — kedua sinar membentuk garis lurus.</p>
          <p><strong className="text-cyan-300">Sudut 360°</strong> — satu putaran penuh, kembali ke posisi awal.</p>
        </div>
        <SudutDasarSVG />
        <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-yellow-200 text-xs">
          💡 Di jenjang SMP, kita fokus pada <strong>besar/ukuran sudut</strong>, bukan arah putarnya (positif/negatif).
        </div>
      </div>
    ),
  },
  {
    title: "Sudut Bertolak Belakang",
    icon: "⟺",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>Bayangkan kamu menekan gunting — kedua mata guntingnya membentuk dua garis yang berpotongan. Perpotongan itu menghasilkan 4 sudut, dan yang saling "bersebrangan" disebut <strong className="text-yellow-300">sudut bertolak belakang</strong>.</p>
        <BertolakSVG />
        <div className="bg-yellow-950/60 border border-yellow-600/50 rounded-lg p-4">
          <p><strong className="text-yellow-300">Definisi:</strong> Sudut-sudut yang dibentuk oleh dua garis berpotongan yang saling berhadapan disebut sudut bertolak belakang.</p>
          <p className="mt-2"><strong className="text-yellow-300">Teorema (Dalil):</strong></p>
          <BlockMath math="\angle 1 = \angle 3 \quad \text{dan} \quad \angle 2 = \angle 4" />
          <p className="text-white/70 text-xs mt-1">Sudut bertolak belakang selalu sama besar.</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
          <p className="text-white/80 font-semibold mb-1">Bukti Deduktif:</p>
          <BuktiBertolakSVG />
          <div className="overflow-x-auto mt-1">
            <table className="w-full text-xs text-center border border-slate-600 rounded">
              <thead>
                <tr className="bg-slate-700">
                  <th className="px-2 py-1 border-r border-slate-600">No.</th>
                  <th className="px-2 py-1 border-r border-slate-600">Pernyataan</th>
                  <th className="px-2 py-1">Alasan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-600">
                  <td className="px-2 py-1 border-r border-slate-600">1</td>
                  <td className="px-2 py-1 border-r border-slate-600"><InlineMath math="\angle 1 + \angle 2 = 180°" /></td>
                  <td className="px-2 py-1 text-left">∠1 dan ∠2 membentuk sudut lurus</td>
                </tr>
                <tr className="border-t border-slate-600">
                  <td className="px-2 py-1 border-r border-slate-600">2</td>
                  <td className="px-2 py-1 border-r border-slate-600"><InlineMath math="\angle 2 + \angle 3 = 180°" /></td>
                  <td className="px-2 py-1 text-left">∠2 dan ∠3 membentuk sudut lurus</td>
                </tr>
                <tr className="border-t border-slate-600">
                  <td className="px-2 py-1 border-r border-slate-600">3</td>
                  <td className="px-2 py-1 border-r border-slate-600"><InlineMath math="\angle 1 = \angle 3" /></td>
                  <td className="px-2 py-1 text-left">Dari (1) dan (2), kurangi ∠2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Sudut Pelurus (Berpelurus / Supplementary)",
    icon: "↔",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>Pernah lihat pintu yang terbuka setengah? Kalau ditambah sisi dindingnya, mereka membentuk garis lurus — itulah ilustrasi <strong className="text-violet-300">sudut pelurus</strong>.</p>
        <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4">
          <p><strong className="text-violet-300">Definisi:</strong> Dua sudut saling berpelurus (supplementary) jika jumlah keduanya tepat <InlineMath math="180°" />.</p>
          <BlockMath math="\alpha + \beta = 180°" />
          <p className="text-white/70 text-xs">Jika <InlineMath math="\alpha" /> diketahui, maka pelurusnya = <InlineMath math="180° - \alpha" /></p>
        </div>
        <PelurusSVG />
        <div className="bg-violet-950/40 border border-violet-600/30 rounded-lg p-3 text-xs text-violet-200">
          📌 Contoh: Pelurus dari <InlineMath math="110°" /> adalah <InlineMath math="180° - 110° = 70°" />.
        </div>
      </div>
    ),
  },
  {
    title: "Sudut Penyiku (Berpenyiku / Complementary)",
    icon: "⌐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>Pojok meja yang sempurna membentuk <strong className="text-green-300">sudut siku-siku 90°</strong>. Jika sebuah garis membagi pojok itu, dua sudut kecil yang terbentuk adalah pasangan <strong className="text-green-300">sudut penyiku</strong>.</p>
        <div className="bg-green-950/60 border border-green-700/50 rounded-lg p-4">
          <p><strong className="text-green-300">Definisi:</strong> Dua sudut saling berpenyiku (complementary) jika jumlah keduanya tepat <InlineMath math="90°" />.</p>
          <BlockMath math="\alpha + \beta = 90°" />
          <p className="text-white/70 text-xs">Jika <InlineMath math="\alpha" /> diketahui, maka penyikunya = <InlineMath math="90° - \alpha" /></p>
        </div>
        <PenyikuSVG />
        <div className="bg-green-950/40 border border-green-600/30 rounded-lg p-3 text-xs text-green-200">
          📌 Contoh: Penyiku dari <InlineMath math="70°" /> adalah <InlineMath math="90° - 70° = 20°" />.
        </div>
      </div>
    ),
  },
  {
    title: "Ringkasan: Perbandingan 3 Jenis Sudut",
    icon: "📊",
    content: (
      <div className="space-y-3 text-sm font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Jenis Sudut</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Syarat</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Rumus Mencari Pasangan</th>
                <th className="px-3 py-2 text-cyan-300">Istilah Inggris</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-700 bg-yellow-950/30">
                <td className="px-3 py-2 text-yellow-300 font-semibold border-r border-slate-700">Bertolak Belakang</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700">Terbentuk dari 2 garis berpotongan</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\angle 1 = \angle 3" /></td>
                <td className="px-3 py-2 text-white/70">Vertical Angles</td>
              </tr>
              <tr className="border-t border-slate-700 bg-violet-950/30">
                <td className="px-3 py-2 text-violet-300 font-semibold border-r border-slate-700">Berpelurus</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\alpha + \beta = 180°" /></td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="180° - \alpha" /></td>
                <td className="px-3 py-2 text-white/70">Supplementary</td>
              </tr>
              <tr className="border-t border-slate-700 bg-green-950/30">
                <td className="px-3 py-2 text-green-300 font-semibold border-r border-slate-700">Berpenyiku</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\alpha + \beta = 90°" /></td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="90° - \alpha" /></td>
                <td className="px-3 py-2 text-white/70">Complementary</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
];

type Example = { level: string; color: string; bg: string; border: string; question: React.ReactNode; answer: React.ReactNode };

const TwoLinesCutSVG = ({ angle }: { angle: number }) => {
  const rad = (angle * Math.PI) / 180;
  const x2 = 150 + 100 * Math.cos(rad);
  const y2 = 90 - 100 * Math.sin(rad);
  return (
    <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-2">
      <defs>
        <marker id="tcArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
        </marker>
        <marker id="tcArL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
          <path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" />
        </marker>
        <marker id="tcArU" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#fb923c" />
        </marker>
        <marker id="tcArD" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
          <path d="M7,0 L7,6 L0,3 z" fill="#fb923c" />
        </marker>
      </defs>
      <line x1="20" y1="90" x2="280" y2="90" stroke="#22d3ee" strokeWidth="2.5"
        markerEnd="url(#tcArR)" markerStart="url(#tcArL)" />
      <line x1={300 - x2} y1={180 - y2} x2={x2} y2={y2} stroke="#fb923c" strokeWidth="2.5"
        markerEnd="url(#tcArU)" markerStart="url(#tcArD)" />
      <circle cx="150" cy="90" r="4" fill="#facc15" />
      <path d={`M185,90 A35,35 0 0,0 ${150 + 35 * Math.cos(rad)},${90 - 35 * Math.sin(rad)}`}
        fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.5" />
      <text x="192" y="80" fill="#facc15" fontSize="12" fontFamily="monospace">{angle}°</text>
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
        <p>Tentukan besar sudut pelurus dan sudut penyiku dari <InlineMath math="75°" />!</p>
        <PelurusSVG />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-green-400">Mencari Sudut Pelurus:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\text{Pelurus} = 180° - 75° = 105°" />
        </div>
        <p className="text-white/80"><strong className="text-green-400">Mencari Sudut Penyiku:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\text{Penyiku} = 90° - 75° = 15°" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">Jawaban: Pelurus = <InlineMath math="105°" />, Penyiku = <InlineMath math="15°" /></p>
        </div>
        <div className="bg-yellow-950/40 border border-yellow-600/30 rounded p-2 text-xs text-yellow-200">
          ✅ Cek: <InlineMath math="75° + 105° = 180°" /> ✓ dan <InlineMath math="75° + 15° = 90°" /> ✓
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
        <p>Dua garis <InlineMath math="a" /> dan <InlineMath math="b" /> berpotongan membentuk 4 sudut. Sudut <InlineMath math="\angle 1 = (3x + 15)°" /> dan sudut <InlineMath math="\angle 3 = (5x - 25)°" />.</p>
        <p>Jika <InlineMath math="\angle 1" /> dan <InlineMath math="\angle 3" /> adalah sudut bertolak belakang, tentukan:</p>
        <p>a) Nilai <InlineMath math="x" /></p>
        <p>b) Besar <InlineMath math="\angle 1" /> dan <InlineMath math="\angle 2" /></p>
        <BertolakSVG />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-yellow-400">a) Mencari nilai x:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">Sudut bertolak belakang → sama besar:</p>
          <BlockMath math="3x + 15 = 5x - 25" />
          <BlockMath math="15 + 25 = 5x - 3x" />
          <BlockMath math="40 = 2x \implies x = 20" />
        </div>
        <p className="text-white/80"><strong className="text-yellow-400">b) Besar sudut-sudutnya:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\angle 1 = 3(20) + 15 = 60 + 15 = 75°" />
          <p className="text-white/60 text-xs mb-1">∠1 dan ∠2 berpelurus (membentuk garis lurus):</p>
          <BlockMath math="\angle 2 = 180° - \angle 1 = 180° - 75° = 105°" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">Jawaban: <InlineMath math="x = 20" />, <InlineMath math="\angle 1 = 75°" />, <InlineMath math="\angle 2 = 105°" /></p>
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
        <p>Pelurus sudut <InlineMath math="P" /> adalah <strong>tiga kali</strong> penyiku sudut <InlineMath math="P" />. Tentukan besar sudut <InlineMath math="P" />!</p>
        <svg viewBox="0 0 300 140" className="w-full max-w-xs mx-auto my-2">
          <defs>
            <marker id="slArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
            </marker>
            <marker id="slArL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
              <path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" />
            </marker>
            <marker id="slArU" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#fb923c" />
            </marker>
          </defs>
          <line x1="20" y1="90" x2="280" y2="90" stroke="#22d3ee" strokeWidth="2.5"
            markerEnd="url(#slArR)" markerStart="url(#slArL)" />
          <line x1="150" y1="90" x2="220" y2="20" stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#slArU)" />
          <circle cx="150" cy="90" r="4" fill="#facc15" />
          <path d="M185,90 A35,35 0 0,0 173,61" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.8" />
          <text x="190" y="78" fill="#facc15" fontSize="13" fontFamily="monospace">P</text>
          <path d="M173,61 A35,35 0 0,0 115,90" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1.8" />
          <text x="118" y="72" fill="#a78bfa" fontSize="12" fontFamily="monospace">pelurus P</text>
          <text x="30" y="120" fill="#e2e8f0" fontSize="10" fontFamily="monospace">pelurus P = 3 × penyiku P = ?</text>
        </svg>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-red-400">Langkah 1 — Misalkan:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs">Misalkan besar sudut P = <InlineMath math="p" /></p>
          <BlockMath math="\text{Pelurus } P = 180° - p" />
          <BlockMath math="\text{Penyiku } P = 90° - p" />
        </div>
        <p className="text-white/80"><strong className="text-red-400">Langkah 2 — Buat persamaan:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">"Pelurus P adalah tiga kali penyiku P":</p>
          <BlockMath math="180° - p = 3 \times (90° - p)" />
          <BlockMath math="180° - p = 270° - 3p" />
          <BlockMath math="3p - p = 270° - 180°" />
          <BlockMath math="2p = 90° \implies p = 45°" />
        </div>
        <p className="text-white/80"><strong className="text-red-400">Langkah 3 — Verifikasi:</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70">
          <p>Pelurus 45° = <InlineMath math="180° - 45° = 135°" /></p>
          <p>Penyiku 45° = <InlineMath math="90° - 45° = 45°" /></p>
          <p>Cek: <InlineMath math="135° = 3 \times 45°" /> ✓</p>
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3">
          <p className="text-red-300 font-semibold">Jawaban: <InlineMath math="P = 45°" /></p>
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

const SudutPelurusPenyikuBertolakPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-base md:text-lg font-bold text-primary text-glow-cyan mb-1 text-center leading-tight">
          SUDUT PELURUS, SUDUT PENYIKU<br />& SUDUT BERTOLAK BELAKANG
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">Kelas 7 · Garis dan Sudut · Materi Matematika</p>

        <div className="flex flex-col gap-3 mb-6">
          {sections.map((s, i) => (
            <AccordionSection key={s.title} section={s} idx={i} />
          ))}
        </div>

        {/* Interactive Protractor */}
        <div className="mb-10">
          <ProtractorAnimation />
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

export default SudutPelurusPenyikuBertolakPage;
